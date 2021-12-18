function poktRelayBody(networkId, payload)
{
    return JSON.stringify({
        "relay_network_id" : networkId,
        "payload" : payload,
    });
}

export {
    poktRelayBody
}