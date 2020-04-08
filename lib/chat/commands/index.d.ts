import type HoprCoreConnector from '@hoprnet/hopr-core-connector-interface';
import type Hopr from '../../src';
import CloseChannel from './closeChannel';
import Crawl from './crawl';
import ListCommands from './listCommands';
import ListConnectors from './listConnectors';
import ListOpenChannels from './listOpenChannels';
import OpenChannel from './openChannel';
import Ping from './ping';
import PrintAddress from './printAddress';
import PrintBalance from './printBalance';
import SendMessage from './sendMessage';
import StopNode from './stopNode';
export default class Commands {
    node: Hopr<HoprCoreConnector>;
    closeChannel: CloseChannel;
    crawl: Crawl;
    listCommands: ListCommands;
    listConnectors: ListConnectors;
    listOpenChannels: ListOpenChannels;
    openChannel: OpenChannel;
    ping: Ping;
    printAddress: PrintAddress;
    printBalance: PrintBalance;
    sendMessage: SendMessage;
    stopNode: StopNode;
    constructor(node: Hopr<HoprCoreConnector>);
}