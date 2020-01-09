<a href="#"><img src="hopr.png"></a>

---

HOPR is a privacy-preserving messaging protocol that incentivizes users to participate in the network. It provides privacy by relaying messages via several relay nodes to the recipient. Relay nodes are getting paid via payment channels for their services.

For further details, see the [protocol specification on the wiki](../../wiki).

Note that the documentation is under active development and does not always represent the latest version of the protocol.

## Table of Contents
- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Get HOPR](#get-hopr)
- [Proof of Concept - Local Testnet](#proof-of-concept---local-testnet)
  - [Local Ethereum Node (Ganache)](#local-ethereum-node-ganache)
  - [Deploy Contracts](#deploy-contracts)
  - [Start Bootstrap Node](#start-bootstrap-node)
  - [Run HOPR](#run-hopr)
  - [Use HOPR](#use-hopr)
    - [Crawl Network](#crawl-network)
    - [Check Your Addresses](#check-your-addresses)
    - [Send Message](#send-message)
- [Public Testnet - Here Be Dragons!](#public-testnet---here-be-dragons)
  - [Ethereum RPC Endpoint](#ethereum-rpc-endpoint)
    - [Infura Setup](#infura-setup)
  - [Ethereum Network](#ethereum-network)
  - [Accounts and Keys](#accounts-and-keys)
    - [Demo Accounts](#demo-accounts)
  - [Bootstrap Node](#bootstrap-node)
- [Project Structure](#project-structure)
# Setup

## Dependencies

The current implementation of HOPR is in JavaScript so you need:
- [`Node.js`](https://nodejs.org/en/download/) 11
- [`yarn`](https://yarnpkg.com/en/docs/install) >= 1.19.0

You might need to setup further operating system dependent, please refer to the wiki links below for more details: 
- [OSX Setup](../../wiki/Setup#Mac--OSX)
- [Windows Setup](../../wiki/Setup#Windows)

## Get HOPR

Start by cloning this repository, let `yarn` install the dependencies and change the filename of the example settings file (don't worry, to do a quick local test you don't need to touch the content of the file and default settings work!):
```
$ git clone https://github.com/hoprnet/hopr-core.git
$ cd hopr-core

# in case you are using NVM (Node Versioning Manager), run the following two commands:
$ nvm install 11.15
$ nvm use

$ yarn install

$ mv .env.example .env
```

**DO NOT USE THE DEFAULT PRIVATE KEYS ON MAIN NET - YOU WILL LOOSE ALL FUNDS ASSOCIATED WITH THOSE KEYS!**

# Proof of Concept - Local Testnet

The following is an early and unstable proof of concept (PoC) running a *local* testnet which highlights the functionality of HOPR. Use it at your own risk. While we are giving our best to buidl a secure and privacy-preserving base layer of the web of today and tomorrow, we do not guarantee that your funds are safu and we do not guarantee that your communication is really metadata-private.

For the proof of concept, HOPR comes with a built-in chat client that is mostly used for demonstration purposes. It will not be part of HOPR in future releases.

To test everything locally, you will end up with 6 command line tabs (or separate windows):
1. Local Ethereum testnet (Ganache)
2. HOPR bootstrap node
3. HOPR node 0
4. HOPR node 1
5. HOPR node 2
6. HOPR node 3

The HOPR PoC chat app is configured to send messages via 2 intermediate relay nodes to the recipient, thus a total of 4 HOPR nodes is the bare minimum to run the PoC.

## Local Ethereum Node (Ganache)

To start a local Ganache-based testnet, run `yarn startTestnet`.

```
$ yarn startTestnet
// Successfully started local Ganache instance at 'ws://[::]:8545'.
```

## Deploy Contracts
Once Ganache is up and running, open another terminal (in many terminal applications you can simply open a new tab in the terminal via `[Command]` + `[t]`) and run `yarn deployContract` to deploy the smart contract.

```
$ yarn deployContract
// Deployed contract on ganache at 0x4A3CDa9bbfc63ee1Db1fC749d86B769334fe27Fb
// Nonce is now 0.
```

You now have a blank version of the HOPR smart contracts running on your local Ganache node. You can keep using the same terminal for the bootstrap node. 

## Start Bootstrap Node
HOPR is a decentralized network, so in order to bootstrap the network and tell recently joined nodes about the participants of the network, there needs to be a bootstrap node that is known to all nodes. The default settings that in your `.env` file are pre-configured to work with the existing keys and is visible to other HOPR nodes running on the same machine, so you can just start it.

To start a bootstrap node, run `node hopr -b`

```
$ node hopr -b
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
$ node hopr 0

// Welcome to HOPR!
// 
// Available under the following addresses:
//  /ip4/127.0.0.1/tcp/9095/ipfs/16Uiu2HAkzuoWfxBgsgBCr8xqpkjs1RAmtDPxafCUAcbBEonnVQ65
//  /ip4/192.168.0.167/tcp/9095/ipfs/16Uiu2HAkzuoWfxBgsgBCr8xqpkjs1RAmtDPxafCUAcbBEonnVQ65
//  /ip4/192.168.0.14/tcp/9095/ipfs/16Uiu2HAkzuoWfxBgsgBCr8xqpkjs1RAmtDPxafCUAcbBEonnVQ65
// 
// Own Ethereum address: 0x32C160A5008e517Ce06Df4f7d4a39fFC52E049cf
// Funds: 100 ETH
// Stake: 0 ETH
```
You can then follow the on-screen instructions to stake funds (just hit `[enter]` twice to confirm that you want to stake and then add 0.1 ETH to the payment channel smart contract).

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
['16Uiu2HAmEsGQV5Ftmfu7x4dkkBnyc8Q2mWEqgQhNu7s3q1Kwimxp']: Received 0.0000000000000001 ETH on channel cc5fb04ed71c2c0f5205d81511bbb8416c8ca503eae95f3fd2d16da862e154f3.
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
['16Uiu2HAmBBshUFiFn3o99Kvf4CEFtujY3ZZW69ebLAkTmQvRNQoB']: Received 0.0000000000000002 ETH on channel fd14f0694a412f99e9fd3c3d2d13e99a140da2f11b139d5e4f82ae2d2269ce29.
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

# Public Testnet - Here Be Dragons!

The first public testnet has a few caveats and is likely going to be frustrating to test. You have been warned but you will get extra love for moving on. One major issue that we are currently solving is the missing NAT traversal which currently prevents you from receiving messages behind a router, mobile hotspot or alike. You also need to configure keys and settings as outlined below.

## Ethereum RPC Endpoint

In order to perform any on-chain interactions, you will need a connection to an Ethereum node. This can be a local Ganache testnet, a fully-fledged Ethereum node running on your computer or an Ethereum node that is run by a third party like Infura (note that this limits your privacy!).

### Infura Setup
1. Sign up for [`Infura and obtain your Project ID`](../../wiki/Setup/#Infura).
2. Insert the project id into `.env` :
```markdown
...
# Infura config
INFURA_PROJECT_ID = 0123456789abcdef0123456789abcbde
```

## Ethereum Network

HOPR supports multiple Ethereum networks, e.g. `mainnet` or `ropsten` testnet as well as `ganache`. Make sure that you change the `NETWORK`-property in the `.env` file according to the network you intend to use.

```
NETWORK = <name of the network, e.g. ganache>
```

Also make sure that you have set a connection endpoint for that network.

```
PROVIDER_<YOUR NETWORK> = <url to the RPC endpoint, e.g. http://localhost:8545>
```

In case you have set `NETWORK` to something different than `ganache` like `mainnet` or `ropsten`, please make sure that you have set an `ETHERSCAN_API_KEY` in your `.env` file such that the contract gets verified on Etherscan. This is only required if you want to deploy the HOPR smart contracts.

## Accounts and Keys

For demonstration and testing purposes, `hopr` allows to run multiple instances of itself in the same folder and from the same machine so that you can chat with yourself with the integrated PoC chat app. It will create individual database folders for each instance.

```
# normal usage
$ node hopr

# demo usage
$ node hopr <instance number, e. g. 0>
```

**Make sure that you prefix your private key with `0x`!**

Also make sure that you insert the amount of demo accounts that you intend to use.

### Demo Accounts

In case you intend to use demo instances, make sure that you insert the private keys of these accounts into your `.env` file.

```
DEMO_ACCOUNTS = <number of demo accounts, e.g. 6>
DEMO_ACCOUNT_<number>_PRIVATE_KEY = <private key, e.g. 0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef>
```

If you need help when creating Ethereum accounts and/or equip them with Testnet Ether, follow these [instructions](../../wiki/Setup/#PrivateKeyGeneration). You also may want to use the [faucet](https://faucet.ropsten.be/) to receive some Ropsten testnet Ether and transfer them to funding account.

Please make sure that you have at least `0.15` (testnet) Ether on each of these accounts.

## Bootstrap Node
Make sure that you set one or more bootstrap nodes in your `.env` file.

```
BOOTSTRAP_NODES = <Multiaddr of your bootstrap node, e.g. /ip4/142.93.163.250/tcp/9091/ipfs/16Uiu2HAm5xi9cMSE7rnW3wGtAbRR2oJDSJXbrzHYdgdJd7rNJtFf>
```
This allows you to configure your own bootstrap node. For the public testnet we are running a public bootstrap node at hopr.network.

# Project Structure

The most relevant project folders and files are as follows:
```
.
├── db # generated at startup
├── migrations # Truffle migration scripts
├── src # the hopr source code
|   └── ...
├── .env # configuration
├── config.js # parses the .env file
├── hopr.js #  command-line interface
└── ...
```
