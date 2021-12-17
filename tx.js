const tx = {
    "ret": [
        {
            "contractRet": "SUCCESS"
        }
    ],
    "signature": [
        "30a2136c0ba599460436dfb8a2203dcba330191de63a38f51ac6d9b62ff1cc64f177a5ea43ef25d533d4b62c6a561eeee734f33afea698af191ae5d06e94663000"
    ],
    "txID": "3d0201764e2dd31b6a6983fbcd61bfeb2121cb125ef3a0ae8393750747753a87",
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "amount": 100000000,
                        "owner_address": "4149dc7360b2cd73d5ed81d1cb883c1648fb46e454",
                        "to_address": "41555f4c1a4f5403d21e5e7aa9cddcd3282f203865"
                    },
                    "type_url": "type.googleapis.com/protocol.TransferContract"
                },
                "type": "TransferContract"
            }
        ],
        "ref_block_bytes": "c45e",
        "ref_block_hash": "33cc9d5ba94eda7b",
        "expiration": 1639734489000,
        "timestamp": 1639734431659
    },
    "raw_data_hex": "0a02c45e220833cc9d5ba94eda7b40a8dfaabedc2f5a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a154149dc7360b2cd73d5ed81d1cb883c1648fb46e454121541555f4c1a4f5403d21e5e7aa9cddcd3282f2038651880c2d72f70ab9fa7bedc2f"
}

const txInfo = {
    "id": "3d0201764e2dd31b6a6983fbcd61bfeb2121cb125ef3a0ae8393750747753a87",
    "blockNumber": 50272,
    "blockTimeStamp": 1639734435000,
    "contractResult": [
        ""
    ],
    "receipt": {
        "net_usage": 268
    }
}

const a = {
    "hash": tx.txID,
    "index": "0x2",
    "nonce": "0x22c8",
    "from": tx.raw_data.contract[0].parameter.value.owner_address,
    "to": tx.raw_data.contract[0].parameter.value.to_address,
    "value": tx.raw_data.contract[0].parameter.value.amount,
    "gas": "0x55730",
    "gasUsed": "0x240f0",
    "gasPrice": "0x975704e400",
    "inputData": tx.raw_data_hex, // raw_data_hex title
    "status": tx.ret[0].contractRet, // "0x1",
    "block": {
        "hash": "0x0000f432000013829c2376a3577356f43ab476b56fc7ea5f9b62d1245d359027",
        "number": txInfo.blockNumber, // "0x180c400",
        "timestamp": tx.raw_data.timestamp, //"0x61bc5fc4",
        "__typename": "Block"
    },
    "__typename": "Transaction"
}

