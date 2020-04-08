import PeerInfo from 'peer-info'
import PeerId from 'peer-id'

// @ts-ignore
import libp2p = require('libp2p')
// @ts-ignore
import TCP = require('libp2p-tcp')
// @ts-ignore
import MPLEX = require('libp2p-mplex')
// @ts-ignore
import SECIO = require('libp2p-secio')

import Debug from 'debug'
import chalk from 'chalk'

import Hopr from '..'
import HoprCoreConnector from '@hoprnet/hopr-core-connector-interface'
import { Heartbeat as HeartbeatInteraction } from '../interactions/network/heartbeat'
import { Heartbeat } from './heartbeat'

import assert from 'assert'
import Multiaddr from 'multiaddr'

describe('check heartbeat mechanism', function() {
  async function generateNode(): Promise<Hopr<HoprCoreConnector>> {
    const node = (await libp2p.create({
      peerInfo: await PeerInfo.create(await PeerId.create({ keyType: 'secp256k1' })),
      modules: {
        transport: [TCP],
        streamMuxer: [MPLEX],
        connEncryption: [SECIO]
      }
    })) as Hopr<HoprCoreConnector>

    node.peerInfo.multiaddrs.add(Multiaddr('/ip4/0.0.0.0/tcp/0'))

    await node.start()

    node.peerRouting.findPeer = (_: PeerId): Promise<never> => {
      return Promise.reject(Error('not implemented'))
    }

    node.interactions = {
      network: {
        heartbeat: new HeartbeatInteraction(node)
      }
    } as Hopr<HoprCoreConnector>['interactions']

    node.network = {
      heartbeat: new Heartbeat(node)
    } as Hopr<HoprCoreConnector>['network']

    node.log = Debug(`${chalk.blue(node.peerInfo.id.toB58String())}: `)

    return (node as unknown) as Hopr<HoprCoreConnector>
  }

  it('should initialise the heartbeat module and start the heartbeat functionality', async function() {
    const [Alice, Bob, Chris, Dave] = await Promise.all([generateNode(), generateNode(), generateNode(), generateNode()])

    // Check whether our event listener is triggered by heartbeat interactions
    await Promise.all([
      new Promise(async resolve => {
        Bob.network.heartbeat.once('beat', (peerId: PeerId) => {
          assert(Alice.peerInfo.id.isEqual(peerId), `Incoming connection must come from Alice`)
          resolve()
        })
      }),
      Alice.interactions.network.heartbeat.interact(Bob.peerInfo)
    ])

    // Check whether our event listener is triggered by `normal` interactions
    await Promise.all([
      new Promise(async resolve => {
        Chris.network.heartbeat.once('beat', (peerId: PeerId) => {
          assert(Alice.peerInfo.id.isEqual(peerId), `Incoming connection must come from Alice`)
          resolve()
        })
      }),
      Alice.dial(Chris.peerInfo)
    ])

    // Check that the internal state is as expected
    assert(Alice.network.heartbeat.heap.includes(Chris.peerInfo.id.toB58String()), `Alice should know about Chris now.`)
    assert(Alice.network.heartbeat.heap.includes(Bob.peerInfo.id.toB58String()), `Alice should know about Bob now.`)
    assert(Chris.network.heartbeat.heap.includes(Alice.peerInfo.id.toB58String()), `Chris should know about Alice now.`)
    assert(Bob.network.heartbeat.heap.includes(Alice.peerInfo.id.toB58String()), `Bob should know about Alice now.`)

    // Simulate a node failure
    await Chris.stop()

    // Reset lastSeen times
    for (const peerId of Alice.network.heartbeat.nodes.keys()) {
      Alice.network.heartbeat.nodes.set(peerId, 0)
    }

    // Check whether a node failure gets detected
    await Alice.network.heartbeat.checkNodes()

    assert(!Alice.network.heartbeat.nodes.has(Chris.peerInfo.id.toB58String()), `Alice should have removed Chris.`)

    await Promise.all([
      Alice.stop(),
      Bob.stop()
    ])
  })
})