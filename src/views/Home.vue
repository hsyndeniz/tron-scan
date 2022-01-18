<template>
    <div class="view-home narrow-container">
        <div class="row">
            <div class="col-8 offset-2 col-10-lg offset-1-lg col-12-sm no-offset-sm">
                <f-search-box></f-search-box>
            </div>
        </div>

        <div class="row row-2-cols-lg no-collapse equal-height">
            <div class="col">
                <router-link :to="{name: 'blocks'}" class="no-effect">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.blocks') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">
                            <animated-number
                                :value="nowBlockNum"
                                :formatValue="formatNum"
                                :duration="numAnimationDuration"
                            />
                        </div>
                    </f-card>
                </router-link>
            </div>
            <div class="col">
                    <f-card class="home-block" hover>
                        <h2 class="h3">{{ $t('view_home.validators') }} <icon data="@/assets/svg/angle-right.svg" color="#999"></icon></h2>
                        <div class="num">
                            <animated-number
                                :value="nodeInfo.activeConnectCount"
                                :formatValue="formatNum"
                                :duration="numAnimationDuration"
                            />
                        </div>
                    </f-card>
            </div>
        </div>
        <div class="row row-1-cols-lg equal-height mat-5">
            <div class="col">
                <f-card class="half-padding">
                    <h2 class="h3">Latest Block</h2>
                    <home-block-list :items="nowBlock" :hidden-columns="['time', 'fee']" :items-per-page="1" class="home-table" />
                    <router-link :to="{name: 'blocks'}" class="btn small secondary" style="width: 100%;">
                        View all blocks
                    </router-link>
                </f-card>
            </div>
        </div>
    </div>
</template>

<script>
    import FCard from "../components/core/FCard/FCard.vue";
    import FSearchBox from "../components/FSearchBox.vue";
    import HomeBlockList from "@/data-tables/HomeBlockList.vue";
    import AnimatedNumber from "animated-number-vue";
    import {pollingMixin} from "@/mixins/polling.js";
    import {formatNumberByLocale} from "@/filters.js";
    import axios from "axios";

    export default {
        mixins: [pollingMixin],

        components: {
            HomeBlockList,
            FCard,
            FSearchBox,
            AnimatedNumber
        },

        data() {
            return {
                nowBlockNum: 0,
                nowBlock: [],
                nodeInfo: {
                    activeConnectCount: 0
                },
                blocksData: [],
                numAnimationDuration: 750,
            }
        },

        created() {
            //this.updateChainState();
        },

        mounted() {
            //axios.get('https://api.ideachaincoin.com/wallet/gettransactioncountbyblocknum', { num: 3965 })
            // getchainparameters
            axios
                .get('https://api.ideachaincoin.com/wallet/getnowblock')
                .then(response => {
                    console.log("getnowblock");
                    this.nowBlockNum = response.data.block_header.raw_data.number;
                    let blocks = [response.data.block_header.raw_data];
                    this.nowBlock = blocks;
                    console.warn(this.nowBlock);
                    console.warn(this.nowBlockNum);
                });
                
            axios.get('https://api.ideachaincoin.com/wallet/getnodeinfo')
                .then(response => {
                    console.log("getnodeinfo");
                    let _nodeInfo = response.data;
                    _nodeInfo.activeConnectCount = response.data.activeConnectCount + 1;
                    this.nodeInfo = _nodeInfo;
                    console.log(this.nodeInfo);
                })
        },

        methods: {
            formatNum(_num) {
                return formatNumberByLocale(parseInt(_num), 0);
            }
        }
    }
</script>

<style lang="scss">
    .view-home {
        .f-search-box {
            width: 100%;
            padding: 8px 0 40px 0;
            //padding: 64px 0;
        }

        .home-block {
            --f-card-padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: center;

            min-height: 195px;

            h2 {
                text-align: center;
                //margin-top: 16px;
                margin-bottom: 4px;
            }

            .num {
                text-align: center;
                font-weight: bold;
                font-size: 38px;
            }
        }

        .home-table {
            margin-bottom: 16px;
            height: 100px;
        }

        .txvolumes_label {
            display: flex;
            flex-wrap: wrap;
            //gap: 16px;
            align-items: center;
            margin-bottom: 4px;

            h2 {
                margin-bottom: 0;
                padding-inline-end: 16px;
            }
        }
    }

    @include media-max($bp-menu) {
        .view-home {
            .f-search-box {
                padding: 32px 0;
            }
        }
    }

    @include media-max($bp-small) {
        .view-home {
            .home-block {
                min-height: 136px;

                h2 {
                    font-size: $fs16;
                }

                .num {
                    font-size: 28px;
                }
            }

            .txvolumes_label {
                //font-size: 14px;
                h2 {
                    margin-bottom: 8px;
                }
            }
        }
    }
</style>
