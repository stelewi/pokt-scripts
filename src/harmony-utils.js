function harmonyNodeMetadataPayload()
{
    const payloadData = JSON.stringify({
        "jsonrpc":"2.0",
        "method":"hmy_getNodeMetadata",
        "params":[],
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
    harmonyNodeMetadataPayload
}