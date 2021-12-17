<template>
    <div class="homeblocklist">
        <transition enter-active-class="fadelong-enter-active">
            <f-data-table
                v-show="show"
                :columns="dColumns"
                :items="dItems"
                :disable-infinite-scroll="!dHasNext"
                :loading="cLoading"
                fixed-header
                f-card-off
                mobile-view
                height="300px"
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
                            <timeago :datetime="value" :auto-update="1" :converter-options="{includeSeconds: true}"></timeago>
                        </div>
                    </div>
                    <template v-else>
                        <timeago :datetime="value" :auto-update="5" :converter-options="{includeSeconds: true}"></timeago>
                    </template>
                </template>
            </f-data-table>
        </transition>
    </div>
</template>

<script>
import FBlockList from "@/data-tables/FBlockList.vue";
import FDataTable from "@/components/core/FDataTable/FDataTable.vue";
import {WEIToFTM} from "@/utils/transactions.js";
import {timestampToDate} from "@/filters.js";
import {pollingMixin} from "@/mixins/polling.js";
import axios from "axios";

export default {
    name: "HomeBlockList",

    mixins: [pollingMixin],

    components: {FDataTable},

    props: {
        ...FBlockList.props,
    },

    data() {
        return {
            ...FBlockList.data.call(this),
            show: true,
        }
    },

    computed: {
        cLoading() {
            return this.dItems.length === 0;
        }
    },

    created() {
        this.updateItems();
    },

    mounted() {
        this.updateItems();
    },

    methods: {
        async updateItems() {
            console.log('get dItems');

            axios
                .get('https://plutoapi.ideachaincoin.com/wallet/getnowblock')
                .then(response => {
                    console.log("getnowblock2");
                    let b = {
                        "hash": response.data.block_header.raw_data.hash,
                        "number": response.data.block_header.raw_data.number.toString(16),
                        "timestamp": response.data.block_header.raw_data.timestamp,
                        "transactionCount": 0,
                        "gasUsed": 0,
                        "__typename": "Block"
                    }

                    this.dItems = [{
                        block: b
                    }];
                    console.warn(this.dItems);
                });
        },

        timeDifference(current, previous) {
            console.log(current)
            console.log(previous)
            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;

            var elapsed = current - previous;

            if (elapsed < msPerMinute) {
                return Math.round(elapsed/1000) + ' seconds ago';   
            }

            else if (elapsed < msPerHour) {
                return Math.round(elapsed/msPerMinute) + ' minutes ago';   
            }

            else if (elapsed < msPerDay ) {
                return Math.round(elapsed/msPerHour ) + ' hours ago';   
            }

            else if (elapsed < msPerMonth) {
                return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
            }

            else if (elapsed < msPerYear) {
                return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
            }

            else {
                return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
            }
        },

        WEIToFTM,
        timestampToDate
    }
}
</script>
