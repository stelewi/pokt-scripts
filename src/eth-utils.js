function ethGetBalancePayload(walletAddress)
{
    const payloadData = JSON.stringify({
        "jsonrpc":"2.0",
        "method":"eth_getBalance",
        "params":[walletAddress, 'latest'],
        "id":1
    });

    return {
        "data": payloadData,
        "method":"POST",
        "path":"",
        "headers":{}
    };
}

export {
    ethGetBalancePayload
}