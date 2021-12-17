const appConfig = {
    // app title
    name: "ICH Explorer",
    // app description
    description:
        "ICH Explorer allows you to explore and search the ICH blockchain for transactions, addresses and blocks",
    // app keywords
    keywords: "ICH, explorer, search, blockchain, crypto, currency",
    // apollo client settings
    apollo: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: 'https://xapi-nodea.fantom.network/',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi-nodeb.fantom.network/',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi-nodec.fantom.network/',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi-noded.fantom.network/',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi-nodee.fantom.network/',
                // for subscriptions
                ws: '',
            },
            {
                http: 'https://xapi-nodef.fantom.network/',
                // for subscriptions
                ws: '',
            },
        ],
        // index into providers array of default provider or 'random' - takes index randomly
        defaultProviderIndex: "random"
    },
    //
    useTestnet: false,
    // use 'hash' mode in vue router
    routerHashMode: false,
    // testnet config
    testnet: {
        // list of providers. if one of them is unavailable, another is randomly picked
        providers: [
            {
                http: 'https://xapi.testnet.fantom.network/api',
                // for subscriptions
                ws: '',
            },
        ],
    },
    // progressive web application
    usePWA: true,
    // pwa settings
    pwa: {
        // name used in pwa manifest
        name: "Fantom Explorer"
    },
    // default options for production build
    build: {
        // output dir for production build
        outputDir: "dist"
    },
    // downtime threshold in seconds. downtime values less than this threshold will be displayed as 0
    downtimeThreshold: 10
};

if (appConfig.useTestnet) {
    appConfig.apollo.providers = appConfig.testnet.providers;
}

// scss variables prepended to every scss file
appConfig.scssData = `
    @import "src/assets/scss/vars";
`;

module.exports = appConfig;
