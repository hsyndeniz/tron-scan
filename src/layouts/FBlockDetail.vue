<template>
    <div class="f-block-detail f-data-layout">
        <f-card>
            <template v-if="!dBlockByNumberError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.block') }}</div>
                    <div class="col"><div class="break-word">{{ id }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.timestamp') }}</div>
                    <div class="col">
                        <div v-show="blockInfo && ('timestamp' in blockInfo)">
                            <timeago :datetime="(blockInfo.timestamp)"></timeago>
                            ({{ formatDate((blockInfo.timestamp)) }})
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.transactions') }}</div>
                    <div class="col">
                        <div v-show="blockInfo && ('transactionCount' in blockInfo)">
                            <strong>{{ blockInfo.transactionCount }}</strong> {{ $t('view_block_detail.transactions_in_block' )}}
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.block_hash') }}</div>
                    <div class="col">
                        <div v-show="blockInfo && ('hash' in blockInfo)" class="break-word">{{ blockInfo.hash }}</div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_block_detail.parent_hash') }}</div>
                    <div class="col">
                        <div v-show="blockInfo && blockInfo.parent && ('hash' in blockInfo.parent)" class="break-word">{{ blockInfo.parent.hash }}</div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="query-error">{{ $t('view_block_detail.block_not_found') }}</div>
            </template>
        </f-card>

        <div class="f-subsection" v-if="!dBlockByNumberError">
            <h2 class="h1">{{ $t('view_block_detail.block_transactions') }} <span v-if="dRecordsCount" class="f-records-count"></span></h2>

            <f-transaction-list
                :items="cTransactionItems"
                :hidden-columns="['block']"
                :loading="cLoading"
                without-cursor
            ></f-transaction-list>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import FTransactionList from "../data-tables/FTransactionList.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import { formatHexToInt, timestampToDate, formatDate } from "../filters.js";
import axios from 'axios';

    export default {
        components: {
            FCard,
            FTransactionList
        },

        props: {
            /** Block number. */
            id: {
                type: Number,
                required: true,
                default: 0
            }
        },

        apollo: {
            block: {
                query: gql`
                    query BlockByNumber($number: Long) {
                        block (number: $number) {
                            number
                            transactionCount
                            hash
                            parent {
                                hash
                            }
                            timestamp
                            txList {
                                hash
                                from
                                to
                                value
                                gasUsed
                                block {
                                    number
                                    timestamp
                                }
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        number: `0x${parseInt(this.id).toString(16)}`
                    }
                },
                error(_error) {
                    this.dBlockByNumberError = _error.message;
                }
            }
        },

        data() {
            return {
                blockInfo: {},
                dBlockByNumberError: '',
                dRecordsCount: 0,
                dTransactions: []
            }
        },

        computed: {
            cTransactionItems() {
                const {cBlock} = this;
                console.log(cBlock);
                
                if (cBlock) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.dRecordsCount = cBlock.transactionCount;
                }

                return {
                    action: 'replace',
                    data: (cBlock && cBlock.txList ? cBlock.txList : [])
                };
            },

            cBlock() {
/*
                if (this.block) {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.dTransactions = this.block.txList;
                }
*/

                return this.block || {parent: {}};
            },

            cLoading() {
                return this.$apollo.queries.block.loading;
            }
        },

        mounted() {
            axios.post('https://api.ideachaincoin.com/wallet/getblockbynum', { num: this.id })
                .then(response => {
                    console.log("getblockbynum");
                    console.log(response);
                    console.log(this.cBlock);
                    let _block = {
                        "number": response.data.block_header.raw_data.number.toString(16),
                        "transactionCount": 0,
                        "hash": response.data.blockID,
                        "parent": {
                            "hash": response.data.block_header.raw_data.parentHash,
                            "__typename": "Block"
                        },
                        "timestamp": response.data.block_header.raw_data.timestamp,
                        "txList": [],
                        "__typename": "Block"
                    };
                    this.blockInfo = _block;
                    console.log(this.blockInfo)
                })
        },

        methods: {
            WEIToFTM,
            formatHexToInt,
            timestampToDate,
            formatDate
        }
    }
</script>

<style lang="scss">
    .f-block-detail {
        .num-block {
            h2 {
                text-align: center;
                margin-top: 16px;
                margin-bottom: 4px;
            }

            .num {
                text-align: center;
                font-weight: bold;
                font-size: $fs48;
            }
        }
    }
</style>
