import { ethGetBalancePayload } from "./src/eth-utils.js";
import { harmonyNodeMetadataPayload } from "./src/harmony-utils.js";
import { poktRelayBody } from "./src/pokt-utils.js";
import {mean, median, mode, range} from "./src/stats.js";
import axios from "axios";
import { ethAddresses } from "./eth-addresses.js";

const args = process.argv.slice(2);

if(args.length < 4)
{
    console.error('Requires 4 arguments [pokt node url] [eth|harmony] [RPC call interval (ms)] [total num RPC calls]');
    process.exit(-1);
}

const url = args[0];
const chainType = args[1];
const callIntervalms = parseInt(args[2]);
const numRPCCalls = parseInt(args[3]);
const times = [];

console.log(typeof chainType);

console.log(`Running POKT relay load for: ${url}`);
console.log(`Chain type: ${chainType}`);
console.log(`${callIntervalms}ms call interval`);
console.log(`Making total of ${numRPCCalls} RPC calls`);

for(let i = 0; i < numRPCCalls; i++)
{
    setTimeout(
        () => makeRelayCall(i, url),
        i * callIntervalms
    );
}

function completedCall(millis)
{
    times.push(millis);
    if(times.length >= numRPCCalls)
    {
        console.log("*************************");
        console.log("Finished!");
        console.log("Mean: " + mean(times));
        console.log("Median: " + median(times));
        console.log("Mode:" + mode(times)[0]);
        const r = range(times);
        console.log(`Range: ${r[0]} - ${r[1]}`);
    }
}

function ethRelay()
{
    const walletAddress = ethAddresses[Math.floor(Math.random()*ethAddresses.length)];
    console.log(`Get eth Kraken account balance for address ${walletAddress}`);
    return poktRelayBody("0021", ethGetBalancePayload(walletAddress));
}

function harmonyRelay()
{
    return poktRelayBody("0040", harmonyNodeMetadataPayload());;
}

function makeRelayCall(callNum, nodeUrl)
{
    console.log(`Making relay call No. [${callNum}]:`);

    let body = null;

    switch (chainType.trim())
    {
        case 'eth':
            body = ethRelay();
            break;

        case 'harmony':
            body = harmonyRelay();
            break;

        default:
            throw `Unknown chain name ${chainType}`;
    }

    const headers = {
        "Content-Type" : 'application/json'
    };

    const requestUrl = nodeUrl + '/v1/client/sim';

    const start = Date.now();

    axios
        .post(requestUrl, body, headers)
        .then(res => {
            const millis = Date.now() - start;
            console.log(`Relay call No. [${callNum}]: ${millis}ms`);
            console.log('Response:');
            console.log(res.data);
            completedCall(millis);
        })
        .catch(error => {
            console.error(error)
            completedCall(null);
        })
}

