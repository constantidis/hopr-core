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

import Hopr from '../..'
import HoprCoreConnector from '@hoprnet/hopr-core-connector-interface'
import LevelUp from 'levelup'
import Memdown from 'memdown'
import { Heartbeat } from './heartbeat'
import * as DbKeys from '../../db_keys'

import assert from 'assert'
import Multiaddr from 'multiaddr'

import { EventEmitter } from 'events'

describe('check heartbeat mechanism', function() {
  async function generateNode(): Promise<Hopr<HoprCoreConnector>> {
    const db = LevelUp(Memdown())

    const node = (await libp2p.create({
      peerInfo: await PeerInfo.create(await PeerId.create({ keyType: 'secp256k1' })),
      modules: {
        transport: [TCP],
        streamMuxer: [MPLEX],
        connEncryption: [SECIO]
      }
    })) as Hopr<HoprCoreConnector>

    node.db = db

    node.peerInfo.multiaddrs.add(Multiaddr('/ip4/0.0.0.0/tcp/0'))

    await node.start()

    node.peerRouting.findPeer = (_: PeerId): Promise<never> => {
      return Promise.reject(Error('not implemented'))
    }

    node.interactions = {
      network: {
        heartbeat: new Heartbeat(node)
      }
    } as Hopr<HoprCoreConnector>['interactions']

    node.network = {
      heartbeat: new EventEmitter()
    } as Hopr<HoprCoreConnector>['network']

    node.log = Debug(`${chalk.blue(node.peerInfo.id.toB58String())}: `)
    node.dbKeys = DbKeys

    return (node as unknown) as Hopr<HoprCoreConnector>
  }

  it('dispatch a heartbeat', async function() {
    const [Alice, Bob] = await Promise.all([generateNode(), generateNode()])

    await Promise.all([
      new Promise(resolve => {
        Bob.network.heartbeat.once('beat', (peerId: PeerId) => {
          assert(peerId.isEqual(Alice.peerInfo.id), 'connection must come from Alice')
          resolve()
        })
      }),
      Alice.interactions.network.heartbeat.interact(Bob.peerInfo, 0)
    ])

    await Promise.all([Alice.stop(), Bob.stop()])
  })
})