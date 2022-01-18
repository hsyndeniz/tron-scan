<template>
    <div class="block-list-dt">
        <template v-if="!dBlockListError">
            <f-data-table
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="true"
                :loading="cLoading"
                :itemsPerPage=10
                fixed-header
                @fetch-more="fetchMore"
                v-bind="{...$attrs, ...$props}"
                class="f-data-table-body-bg-color"
            >
                <template v-slot:column-block="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link>
                        </div>
                    </div>
                    <template v-else>
                        <router-link :to="{name: 'block-detail', params: {id: value}}" :title="value">{{value}}</router-link>
                    </template>
                </template>

                <template v-slot:column-age="{ value, column }">
                    <div v-if="column" class="row no-collapse no-vert-col-padding">
                        <div class="col-4 f-row-label">{{ column.label }}</div>
                        <div class="col">
                            <timeago :datetime="new Date(value)" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <timeago :datetime="new Date(value)" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                    </template>
                </template>
            </f-data-table>
        </template>

        <template v-else>
            <div class="query-error">{{ dBlockListError }}</div>
        </template>
    </div>
</template>

<script>
    // import FDataTable from "../components/FDataTable.vue";
    import FDataTable from "../components/core/FDataTable/FDataTable.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import {timestampToDate, formatDate, formatHexToInt} from "../filters.js";
    import {cloneObject} from "@/utils";
    import axios from 'axios';

    export default {
        components: {
            FDataTable
        },

        props: {
            hiddenColumns: {
                ...FDataTable.props.hiddenColumns,
            },
            /** Number of items per page. */
            itemsPerPage: {
                type: Number,
                default: 100
            }
        },

        apollo: {
            blocks: {
                query: gql`
                    query BlockList($cursor: Cursor, $count: Int!) {
                        blocks (cursor: $cursor, count: $count) {
                            totalCount
                            pageInfo {
                                first
                                last
                                hasNext
                                hasPrevious
                            }
                            edges {
                                block {
                                    hash
                                    number
                                    timestamp
                                    transactionCount
                                    gasUsed
                                }
                                cursor
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        cursor: null,
                        count: this.itemsPerPage
                    }
                },
                result(_data, _key) {
                    let data;


                    if (_key === 'blocks') {
                        // console.log('???');
                        data = _data.data.blocks;

                        const edges = cloneObject(data.edges);

                        //this.dHasNext = data.pageInfo.hasNext;
                        this.dHasNext = true;

                        if (this.dItems.length === 0) {
                            //this.dItems = edges;
                        } else {
                            for (let i = 0, len1 = edges.length; i < len1; i++) {
                                //this.dItems.push(edges[i]);
                            }
                        }
                        
                        axios.get('https://plutoapi.ideachaincoin.com/wallet/getnowblock')
                        .then(response => {
                            const latestBlock = response.data.block_header.raw_data.number;
                            
                            axios.post('https://plutoapi.ideachaincoin.com/wallet/getblockbylimitnext', {"startNum": latestBlock - 100,"endNum": latestBlock})
                            .then(response => {
                                console.log("getblockbylimitnext");
                                console.log(response.data);
                                let _blocks = [];
                                response.data.block.map((b,i) => {
                                    console.log(formatDate(timestampToDate(b.block_header.raw_data.timestamp)))
                                    let _b = {
                                        "block": {
                                            "hash": b.block_header.raw_data.parentHash,
                                            "number": b.block_header.raw_data.number.toString(16),
                                            "timestamp": new Date(b.block_header.raw_data.timestamp),
                                            //"timestamp": formatDate(timestampToDate(b.block_header.raw_data.timestamp)),
                                            "transactionCount": 0,
                                            "gasUsed": "0x1ad6f",
                                            "__typename": "Block"
                                        },
                                        "cursor": "0x17ebbcc",
                                        "__typename": "BlockListEdge",
                                        "id": i
                                    }
                                    
                                    _blocks.push(_b);
                                })
                                console.log(this.dItems);
                                console.log(_blocks);
                                this.dItems = _blocks;
                                console.log(this.dItems);
                            });
                        
                        });
                        
                        this.$emit('records-count', formatHexToInt(data.totalCount));
                    }
                },
                error(_error) {
                    this.dBlockListError = _error.message;
                }
            }
        },

        data() {
            return {
                dItems: [],
                dHasNext: false,
                dBlockListError: '',
                gasPrice: this.$store.state.gasPrice,
                dColumns: [
                    {
                        name: 'block',
                        label: this.$t('view_block_list.block'),
                        itemProp: 'block.number',
                        formatter: formatHexToInt
                    },
                    {
                        name: 'time',
                        label: this.$t('view_block_list.time'),
                        itemProp: 'block.timestamp',
                        width: '340px'
                    },
                    {
                        name: 'age',
                        label: this.$t('view_block_list.age'),
                        itemProp: 'block.timestamp'
                    },
                    {
                        name: 'transaction_count',
                        label: this.$t('view_block_list.transaction_count'),
                        itemProp: 'block.transactionCount',
                        width: '80px'
                    }
                ]
            }
        },

        computed: {
            cLoading() {
                return this.$apollo.queries.blocks.loading;
            }
        },

        methods: {
            fetchMore() {
                console.log("fetchMore");

                axios.get('https://plutoapi.ideachaincoin.com/wallet/getnowblock')
                .then(response => {
                    const latestBlock = response.data.block_header.raw_data.number;
                    
                    axios.post('https://plutoapi.ideachaincoin.com/wallet/getblockbylimitnext', {"startNum": latestBlock - 70,"endNum": latestBlock - 50 })
                    .then(response => {
                        console.log("getblockbylimitnext");
                        console.log(response.data);
                        let _blocks = [];
                        response.data.block.map((b,i) => {
                            console.log(formatDate(timestampToDate(b.block_header.raw_data.timestamp)))
                            let _b = {
                                "block": {
                                    "hash": b.block_header.raw_data.parentHash,
                                    "number": b.block_header.raw_data.number.toString(16),
                                    "timestamp": new Date(b.block_header.raw_data.timestamp),
                                    //"timestamp": formatDate(timestampToDate(b.block_header.raw_data.timestamp)),
                                    "transactionCount": 0,
                                    "gasUsed": "0x1ad6f",
                                    "__typename": "Block"
                                },
                                "cursor": "0x17ebbcc",
                                "__typename": "BlockListEdge",
                                "id": i
                            }
                            
                            _blocks.push(_b);
                        })
                        console.log(this.dItems);
                        console.log(_blocks);
                        this.dItems.push(_blocks);
                        console.log(this.dItems);
                    });
                
                });
                
                //this.$emit('records-count', formatHexToInt(data.totalCount));
            },

            WEIToFTM,
            timestampToDate
        }
    }
</script>
