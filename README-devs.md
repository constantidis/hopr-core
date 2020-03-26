<a href="#"><img src="hopr.png"></a>

---

HOPR is a privacy-preserving messaging protocol that incentivizes users to participate in the network. It provides privacy by relaying messages via several relay nodes to the recipient. Relay nodes are getting paid via payment channels for their services.

For further details, see the [protocol specification on the wiki](../../wiki).

Note that the documentation is under active development and does not always represent the latest version of the protocol.

## Table of Contents

- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Prepare HOPR repositories](#prepare-hopr-repositories)
    - [Get hopr-core](#get-hopr-core)
    - [Get hopr-ethereum](#get-hopr-ethereum)
  - [Start a local ethereum node](#start-a-local-ethereum-node)
  - [Deploy contracts](#deploy-contracts)
  - [Fund demo accounts](#fund-demo-accounts)
  - [Start Bootstrap Node](#start-bootstrap-node)
  - [Run HOPR](#run-hopr)
  - [Use HOPR](#use-hopr)
    - [Crawl Network](#crawl-network)
    - [Check Your Addresses](#check-your-addresses)
    - [Send Message](#send-message)

# Setup

**For Hopr on [Polkadot](https://polkadot.network)**, please follow the instruction [here](#HOPR-on-Polkadot)

## Dependencies

- [`Node.js`](https://nodejs.org/en/download/) >= 12
- [`yarn`](https://yarnpkg.com/en/docs/install) >= 1.19.0

## Prepare HOPR repositories

### Get hopr-core

```
$ git clone -b jigsaw https://github.com/hoprnet/hopr-core.git
$ cd hopr-core

# in case you are using NVM (Node Versioning Manager), run the following two commands:
$ nvm install 12
$ nvm use

$ yarn install

$ mv .env.example .env
```

### Get hopr-ethereum

```
$ git clone -b develop https://github.com/hoprnet/hopr-ethereum.git
$ cd hopr-ethereum

# in case you are using NVM (Node Versioning Manager), run the following two commands:
$ nvm install 12
$ nvm use

$ yarn install
```

## Start a local ethereum node

```
$ cd hopr-ethereum
$ yarn network
// Successfully started local Ganache instance at 'ws://[::]:9545'.
```

## Deploy contracts

In another terminal:

```
$ yarn migrate --network development
```

## Fund demo accounts

In another terminal:

```
$ cd hopr-core
$ yarn fundAccounts
```

## Start Bootstrap Node

HOPR is a decentralized network, so in order to bootstrap the network and tell recently joined nodes about the participants of the network, there needs to be a bootstrap node that is known to all nodes. The default settings that in your `.env` file are pre-configured to work with the existing keys and is visible to other HOPR nodes running on the same machine, so you can just start it.

```
$ npx ts-node hopr -b
// Welcome to HOPR!
//
// Available under the following addresses:
//  /ip4/127.0.0.1/tcp/9091/ipfs/16Uiu2HAm5xi9cMSE7rnW3wGtAbRR2oJDSJXbrzHYdgdJd7rNJtFf
//  /ip4/192.168.1.106/tcp/9091/ipfs/16Uiu2HAm5xi9cMSE7rnW3wGtAbRR2oJDSJXbrzHYdgdJd7rNJtFf
//
// ... running as bootstrap node!.
```

This node allows the other nodes on the network to find each other. We will start these nodes next.

## Run HOPR

Now that everything is set up, open a new terminal window (or tab) and you should be able to run a new HOPR node via

```
$ npx ts-node hopr 0

// Welcome to HOPR!
//
// Available under the following addresses:
//  /ip4/127.0.0.1/tcp/9095/ipfs/16Uiu2HAkzuoWfxBgsgBCr8xqpkjs1RAmtDPxafCUAcbBEonnVQ65
//  /ip4/192.168.0.167/tcp/9095/ipfs/16Uiu2HAkzuoWfxBgsgBCr8xqpkjs1RAmtDPxafCUAcbBEonnVQ65
//  /ip4/192.168.0.14/tcp/9095/ipfs/16Uiu2HAkzuoWfxBgsgBCr8xqpkjs1RAmtDPxafCUAcbBEonnVQ65
//
// Own Ethereum address: 0x32C160A5008e517Ce06Df4f7d4a39fFC52E049cf
// Funds: 100 HOPR
// Stake: 0 HOPR
```

You can then follow the on-screen instructions to stake funds (just hit `[enter]` twice to confirm that you want to stake and then add 0.1 HOPR to the payment channel smart contract).

Repeat this step 3 more times so that you have a total of 4 HOPR nodes running. Make sure to change the parameter `0` that you entered the first time to `1`, `2`, `3` the following times. This starts the HOPR nodes with different private keys and lets you send messages from one to another.

## Use HOPR

If all went well this far you have 4 HOPR nodes running (plus a bootstrap node, plus your Ganache instance which is usually a very silent window). Now you are ready to explore the HOPR command line (you can always hit `[tab]` to see available commands or auto-complete):

### Crawl Network

You can actively crawl the network which asks the bootstrap node for available connections:

```
> crawl
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Received 3 new nodes.
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Now holding peer information of 3 nodes in the network.
```

### Check Your Addresses

Sometimes it is good to know your own Ethereum and HOPR address:

```
> myAddress
Ethereum:	0xeb53DDd1Fa419C457956ce7a707073A13377A002
HOPR:		16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi
```

You can use the HOPR address to send messages to this client from another client.

### Send Message

Open one of the other 3 HOPR nodes and send a message to the first node - first type `send [HOPR_ADDRESS]` and hit `[enter`, then type the message that you want to send and again hit `[enter]`:

```
> send 16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj
Sending message to 16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj
Type in your message and press ENTER to send:
Hi from HOPR!
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Received 3 new nodes.
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Now holding peer information of 4 nodes in the network.
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: ---------- New Packet ----------
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Intermediate 0 : 16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Intermediate 1 : 16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Destination    : 16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: --------------------------------
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Encrypting with B/iXluyoLtjBAFTllCp0BfRVGvFtMwS+h9IxUAmz3dk=.
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Listening to close event of channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Listening to opening event of channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Opened payment channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29 with txHash 0xbd276bada32a7bbba5de5da22250d9fd6c8f99d0acb6ceb89edf985950942542. Nonce is now 2.
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Created tx with index 00000000000000000000000000000002 on channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29.
['16Uiu2HAkzYUU8dqzQGFkQDMwBc371X84mkYHrFKMGkdZev6tkxzi']: Received acknowledgement.
```

There is a lot going on during this first message that we sent. HOPR needs to open payment channels to the next downstream node via which they relay the message to the recipient. Now is a good time to inspect the two intermediate nodes and see how they see the incoming payment channel request and open a payment channel themselves to the next downstream node.

```
> ['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Listening to opening event of channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Listening to close event of channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Opened payment channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3 with txHash 0x436913ad8a1b31ee43aeabe133bd586a7c3003930f41022b8e08782aa050241b. Nonce is now 1.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Database index 00000000000000000000000000000001 on channnel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Transaction index 00000000000000000000000000000002 on channnel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Payment channel exists. Requested SHA256 pre-image of 1314a83d1e587c2c950e75129c8e6e669cfe42724a8961db342e56f71cb71de9 is derivable.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Received 0.0000000000000001 HOPR on channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Listening to close event of channel 08f72788bc1ee53cd9da611c3ac13f1ed41f801f7189f843fd41847b6f640723
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Listening to opening event of channel 08f72788bc1ee53cd9da611c3ac13f1ed41f801f7189f843fd41847b6f640723
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Opened payment channel 08f72788bc1ee53cd9da611c3ac13f1ed41f801f7189f843fd41847b6f640723 with txHash 0x0077c23a71c927d8e450aa823000e95efbbf6df4cb2b5711f74165571023585a. Nonce is now 2.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Created tx with index 00000000000000000000000000000002 on channel 08f72788bc1ee53cd9da611c3ac13f1ed41f801f7189f843fd41847b6f640723.
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Forwarding to node 16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj.
```

The second node shows an output like this - note that the two intermediate nodes are chosen at random, therefore the output might look slightly different:

```
> ['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Listening to opening event of channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Listening to close event of channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Opened payment channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29 with txHash 0xbd276bada32a7bbba5de5da22250d9fd6c8f99d0acb6ceb89edf985950942542. Nonce is now 1.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Database index 00000000000000000000000000000001 on channnel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Transaction index 00000000000000000000000000000002 on channnel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Payment channel exists. Requested SHA256 pre-image of b217cd81f3bc033cc4af3803d3c50e4619681d67c35129259b5eecfa046c46c8 is derivable.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Received 0.0000000000000002 HOPR on channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Listening to close event of channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Listening to opening event of channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Opened payment channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3 with txHash 0x436913ad8a1b31ee43aeabe133bd586a7c3003930f41022b8e08782aa050241b. Nonce is now 2.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Created tx with index 00000000000000000000000000000002 on channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3.
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Forwarding to node 16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp.
```

Finally, inspect the recipient node and see how it received the message from the sender:

```
> ['16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj']: Listening to opening event of channel 580058d1fbb570fda7beb5c4881b566145cc04d1c75d0995fbc7752a641ce3ea
['16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj']: Listening to close event of channel 580058d1fbb570fda7beb5c4881b566145cc04d1c75d0995fbc7752a641ce3ea
['16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj']: Opened payment channel 580058d1fbb570fda7beb5c4881b566145cc04d1c75d0995fbc7752a641ce3ea with txHash 0x12647e94d90d3dd7207afc616ca14a80b3d07e53084dc4295eab177446cfaec0. Nonce is now 1.
['16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj']: Database index 00000000000000000000000000000001 on channnel 580058d1fbb570fda7beb5c4881b566145cc04d1c75d0995fbc7752a641ce3ea.
['16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj']: Transaction index 00000000000000000000000000000002 on channnel 580058d1fbb570fda7beb5c4881b566145cc04d1c75d0995fbc7752a641ce3ea.
['16Uiu2HAm9cCi8zuTY43J63udgoRMqiUDXXb18wQhge1ztc6v8Yyj']: Payment channel exists. Requested SHA256 pre-image of c3c954e054685e5b0154064439ad3f324d01309983feab374c992533b6dd6d57 is derivable.


---------- New Message ----------
Message "Hello from HOPR!" latency 1019 ms.
---------------------------------
```

The latency of the initial message is always longer than the following messages as we open payment channels on demand. The production release will open payment channels before sending messages to reduce latency but on the other hand there will be some (configurable) artificial delay to allow for efficient packet mixing and thus privacy.
