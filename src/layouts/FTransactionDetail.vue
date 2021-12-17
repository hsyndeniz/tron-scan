<template>
    <div class="f-transaction-detail f-data-layout">
        <f-card>
            <template v-if="!dTransactionByHashError">
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.hash') }}</div>
                    <div class="col"><div class="break-word">{{ id }}</div></div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.status') }}</div>
                    <div class="col">
                        <div v-show="cTransaction && ('status' in cTransaction)"><f-transaction-status :status="cStatus"></f-transaction-status></div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.from') }}</div>
                    <div class="col">
                        <div class="break-word" v-show="cTransaction">
                            <router-link :to="{name: 'address-detail', params: {id: cTransaction.from}}">{{ cTransaction.from }}</router-link>
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.to') }}</div>
                    <div class="col">
                        <div class="break-word" v-show="cTransaction">
                            <router-link :to="{name: 'address-detail', params: {id: cTransaction.to}}">{{ cTransaction.to }}</router-link>
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.time') }}</div>
                    <div class="col">
                        <div class="break-word" v-show="cTransaction && cTransaction.block.timestamp">
                            <timeago :datetime="(cTransaction.block.timestamp)"></timeago>
                            ({{ formatDate((cTransaction.block.timestamp)) }})
                        </div>
                    </div>
                </div>
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.amount') }}</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{ (cTransaction.value / 1000000) }} ICH</div></div>
                </div>
                <!--
                            <div class="row no-collapse">
                                <div class="col-4 f-row-label">{{ $t('view_transaction_detail.fee') }}</div>
                                <div class="col"><div class="break-word" v-show="cTransaction">{{  WEIToFTM(cTransaction.fee) }} FTM</div></div>
                            </div>
                -->
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.block') }}</div>
                    <div class="col">
                        <div class="break-word" v-show="cTransaction">
                            <router-link :to="{name: 'block-detail', params: {id: block_Number }}">
                                {{cTransaction.block.number | formatHexToInt}}
                            </router-link>
                        </div>
                    </div>
                </div>

                <!--
                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.transaction_fee') }}</div>
                    <div class="col"><div class="break-word" v-show="cTransaction">{{  cTransactionFee }} ICH</div></div>
                </div>
                -->

                <div class="row no-collapse">
                    <div class="col-4 f-row-label">{{ $t('view_transaction_detail.input_data') }}</div>
                    <div class="col"><div class="break-word input-data" v-show="cTransaction">{{  encodeURIComponent(cTransaction.inputData) }}</div></div>
                </div>
            </template>
            <template v-else>
                <div class="query-error">{{ $t('view_transaction_detail.transaction_not_found') }}</div>
            </template>
        </f-card>
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import gql from 'graphql-tag';
    import { WEIToFTM } from "../utils/transactions.js";
    import { formatHexToInt, timestampToDate, formatDate } from "../filters.js";
    import FTransactionStatus from "../components/FTransactionStatus.vue";
    import axios from 'axios';

    export default {
        components: {
            FTransactionStatus,
            FCard
        },

        props: {
            /** Transaction id */
            id: {
                type: String,
                required: true,
                default: ''
            }
        },

        apollo: {
            transaction: {
                query: gql`
                    query TransactionByHash($hash: Bytes32!) {
                        transaction (hash: $hash) {
                            hash
                            index
                            nonce
                            from
                            to
                            value
                            gas
                            gasUsed
                            gasPrice
                            inputData
                            status
                            block {
                                hash
                                number
                                timestamp
                            }
                        }
                    }
                `,
                variables() {
                    return {
                        hash: "0xaa827fb0a2ad8ba90f2e626f84891660aac3a8592601b00a4235d5c06b832f73"
                    }
                },
                error(_error) {
                    this.dTransactionByHashError = _error.message;
                }
            }
        },

        data() {
            return {
                dTransactionByHashError: '',
                block_Number: 0
            }
        },

        mounted() {
            let _transaction;
            let _transactionInfo;
            let host = "https://plutoapi.ideachaincoin.com";

            axios.post(`${host}/wallet/gettransactionbyid`, { value: this.id })
                .then(response => {
                    console.log("gettransactionbyid");
                    _transaction = response.data;

                    axios.post(`${host}/wallet/gettransactioninfobyid`, 
                        { value: this.id })
                        .then(transactionInfo => {
                            console.log("gettransactioninfobyid");
                            _transactionInfo = transactionInfo.data;
                        
                        console.log(_transaction);
                        console.log(_transactionInfo);

                        const a = {
                            "hash": _transaction.txID,
                            "index": "0x2",
                            "nonce": "0x22c8",
                            "from": _transaction.raw_data.contract[0].parameter.value.owner_address,
                            "to": _transaction.raw_data.contract[0].parameter.value.to_address,
                            "value": _transaction.raw_data.contract[0].parameter.value.amount,
                            "gas": "0x55730",
                            "gasUsed": "0x240f0",
                            "gasPrice": "0x975704e400",
                            "inputData": _transaction.raw_data_hex, // raw_data_hex title
                            "status": _transaction.ret[0].contractRet, // "0x1",
                            "block": {
                                "hash": "0x0000f432000013829c2376a3577356f43ab476b56fc7ea5f9b62d1245d359027",
                                "number": _transactionInfo.blockNumber.toString(16), // "0x180c400",
                                "timestamp": _transaction.raw_data.timestamp, //"0x61bc5fc4",
                                "__typename": "Block"
                            },
                            "__typename": "Transaction"
                        }

                        console.log("this.transaction");
                        console.log(this.transaction);
                        console.log("a");
                        console.log(a);
                        this.transaction = a;
                        this.block_Number = _transactionInfo.blockNumber;
                        console.log(this.transaction);
                });
            });
        },

        computed: {
            cTransaction() {
                return this.transaction || {block: {}};
            },

            cTransactionFee() {
                const {transaction} = this;

                if (transaction) {
                    return WEIToFTM(this.formatHexToInt(transaction.gasPrice) * this.formatHexToInt(transaction.gasUsed));
                }

                return 0;
            },

            cStatus() {
                let status = 2;

                if (this.transaction) {
                    if (this.transaction.status !== null) {
                        
                        if (this.transaction.status == 'SUCCESS') {
                            status = 1;
                        } else if(this.transaction.status == 'PENDING') {
                            status = null;
                        } else {
                            status = 0;
                        }
                    }
                }

                return status;
            }
/*
            cLoading() {
                return this.$apollo.queries.transaction.loading;
            }
*/
        },

        methods: {
            WEIToFTM,
            formatHexToInt,
            timestampToDate,
            formatDate,
        }
    }
</script>
