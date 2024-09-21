const fetch = require('node-fetch');

async function getLastTR(wallet, error_delay) {
    const data = {
        "operationName":"AllUserTransactionsV3",
        "variables":{
            "wallets":[wallet],
            "slug":null,
            "limit":30,
            "filters":{
                "txTypes":[
                    "AUCTION_SETTLE",
                    "ELIXIR_COMPOSED_BUY_NFT",
                    "ELIXIR_COMPOSED_SELL_NFT",
                    "LOCK_CLAIM_NFT",
                    "LOCK_CLAIM_TOKENS",
                    "LOCK_LOCK_ORDER",
                    "LOCK_MARKET_BUY_NFT",
                    "LOCK_MARKET_SELL_NFT",
                    "SALE_ACCEPT_BID",
                    "SALE_BUY_NOW",
                    "SWAP_BUY_NFT",
                    "SWAP_SELL_NFT"
                ]
            }
        },
        "query":"query AllUserTransactionsV3($wallets: [String!]!, $slug: String, $filters: TransactionsFilters, $cursor: TransactionsCursorInput, $limit: Int) {\n  allUserTransactionsV3(\n    wallets: $wallets\n    slug: $slug\n    filters: $filters\n    cursor: $cursor\n    limit: $limit\n  ) {\n    txs {\n      ...ReducedParsedTx\n      mint {\n        ...MintV2\n        numMints\n        collection {\n          name\n          slug\n          slugDisplay\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    page {\n      endCursor {\n        txAt\n        txKey\n        __typename\n      }\n      hasMore\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ReducedParsedTx on ParsedTransaction {\n  source\n  txKey\n  txId\n  txType\n  grossAmount\n  sellerId\n  buyerId\n  txAt\n  blockNumber\n  txMetadata {\n    auctionHouse\n    urlId\n    sellerRef\n    tokenAcc\n    __typename\n  }\n  poolOnchainId\n  lockOnchainId\n  __typename\n}\n\nfragment MintV2 on MintV2 {\n  onchainId\n  slug\n  compressed\n  owner\n  name\n  imageUri\n  animationUri\n  metadataUri\n  metadataFetchedAt\n  files {\n    type\n    uri\n    __typename\n  }\n  sellRoyaltyFeeBPS\n  tokenStandard\n  tokenEdition\n  attributes {\n    trait_type\n    value\n    __typename\n  }\n  lastSale {\n    price\n    txAt\n    __typename\n  }\n  accState\n  hidden\n  rarityRankHrtt\n  rarityRankStat\n  rarityRankTeam\n  rarityRankTn\n  inscription {\n    ...InscriptionData\n    __typename\n  }\n  tokenProgram\n  metadataProgram\n  transferHookProgram\n  listingNormalizedPrice\n  hybridAmount\n  __typename\n}\n\nfragment InscriptionData on InscriptionData {\n  inscription\n  inscriptionData\n  immutable\n  order\n  spl20 {\n    p\n    tick\n    amt\n    __typename\n  }\n  __typename\n}"
    }
    const headers = {
        'authority': 'graphql-txs.tensor.trade',
        'accept': '*/*',
        'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://www.tensor.trade',
        'referer': 'https://www.tensor.trade/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'x-request-id': 'f89433b5-50a2-414b-a5a9-85a63db5a9c3'
    }
    while (true) {
        try {
            const response = await fetch('https://graphql-txs.tensor.trade/graphql', {method: 'POST',headers: headers,body: JSON.stringify([data])});
            const walletJSONinfo = await response.json();
            if (walletJSONinfo[0].errors) {
                console.log(walletJSONinfo[0])
                return false
            }
            return walletJSONinfo[0].data.allUserTransactionsV3.txs
        } catch (error) {
            console.error(`Error fetching data: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, error_delay))
        }
    }
}

module.exports = getLastTR