<template>
  <div class="block-list-dt">
    <template v-if="!dBlockListError">
      <vue-good-table
        :columns="columns"
        :rows="dItems"
        :pagination-options="{
          enabled: true,
          perPage: 10,
          rowsPerPageLabel: `Tx's per page`,
        }"
        theme="nocturnal"
      />
    </template>

    <template v-else>
      <div class="query-error">{{ dBlockListError }}</div>
    </template>
  </div>
</template>

<script>
import "vue-good-table/dist/vue-good-table.css";
// import FDataTable from "../components/FDataTable.vue";
// import FDataTable from "../components/core/FDataTable/FDataTable.vue";
import gql from "graphql-tag";
import { WEIToFTM } from "../utils/transactions.js";
import { timestampToDate, formatDate, formatHexToInt } from "../filters.js";
import { cloneObject } from "@/utils";
import axios from "axios";
import { VueGoodTable } from "vue-good-table";

export default {
  components: {
    // FDataTable,
    VueGoodTable,
  },

  props: {
    hiddenColumns: {
      //...FDataTable.props.hiddenColumns,
    },
    /** Number of items per page. */
    itemsPerPage: {
      type: Number,
      default: 40,
    },
  },

  apollo: {
    blocks: {
      query: gql`
        query BlockList($cursor: Cursor, $count: Int!) {
          blocks(cursor: $cursor, count: $count) {
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
          count: this.itemsPerPage,
        };
      },
      result(_data, _key) {
        let data;

        if (_key === "blocks") {
          // console.log('???');
          data = _data.data.blocks;

          const edges = cloneObject(data.edges);

          this.dHasNext = data.pageInfo.hasNext;

          if (this.dItems.length === 0) {
            //this.dItems = edges;
          } else {
            for (let i = 0, len1 = edges.length; i < len1; i++) {
              //this.dItems.push(edges[i]);
            }
          }

          const timeSince = (date) => {
            var seconds = Math.floor((new Date() - date) / 1000);

            var interval = seconds / 31536000;

            if (interval > 1) {
              return Math.floor(interval) + " years";
            }
            interval = seconds / 2592000;
            if (interval > 1) {
              return Math.floor(interval) + " months";
            }
            interval = seconds / 86400;
            if (interval > 1) {
              return Math.floor(interval) + " days";
            }
            interval = seconds / 3600;
            if (interval > 1) {
              return Math.floor(interval) + " hours";
            }
            interval = seconds / 60;
            if (interval > 1) {
              return Math.floor(interval) + " minutes";
            }
            return Math.floor(seconds) + " seconds";
          };

          axios
            .get("https://api.ideachaincoin.com/wallet/getnowblock")
            .then((response) => {
              const latestBlock = response.data.block_header.raw_data.number;

              axios
                .post(
                  "https://api.ideachaincoin.com/wallet/getblockbylimitnext",
                  { startNum: latestBlock - 100, endNum: latestBlock }
                )
                .then((response) => {
                  console.log("getblockbylimitnext");
                  console.log(response.data);
                  let _blocks = [];
                  response.data.block.map((b, i) => {
                    console.log(
                      formatDate(
                        timestampToDate(b.block_header.raw_data.timestamp)
                      )
                    );
                    let _b = {
                      block: {
                        hash: b.block_header.raw_data.parentHash,
                        number: b.block_header.raw_data.number.toString(16),
                        timestamp: new Date(b.block_header.raw_data.timestamp),
                        //"timestamp": formatDate(timestampToDate(b.block_header.raw_data.timestamp)),
                        transactionCount: 0,
                        gasUsed: "0x1ad6f",
                        __typename: "Block",
                      },
                      cursor: "0x17ebbcc",
                      __typename: "BlockListEdge",
                      id: i,
                    };

                    _blocks.push(_b);
                  });
                  console.log(this.dItems);
                  console.log(_blocks);
                  this.dItems = _blocks;
                  console.log(this.dItems);

                  let txs = [];
                  this.dItems.map((ttx) => {
                    let _ttx = {
                      block: formatHexToInt(ttx.block.number),
                      time: new Date(ttx.block.timestamp),
                      age: `${timeSince(ttx.block.timestamp)} ago`,
                      txns: 0,
                    };
                    txs.push(_ttx);
                    console.log(txs);
                  });
                  this.dItems = txs;
                });
            });

          this.$emit("records-count", this.formatHexToInt(data.totalCount));
        }
      },
      error(_error) {
        this.dBlockListError = _error.message;
      },
    },
  },

  data() {
    return {
      columns: [
        {
          label: "Block",
          field: "block",
        },
        {
          label: "Time",
          field: "time",
        },
        {
          label: "Age",
          field: "age",
        },
        // {
        //   label: "Txns",
        //   field: "txns",
        //   type: "number",
        // },
      ],
      rows: [
        { id: 1, name: "John", age: 20, createdAt: "", score: 0.03343 },
        {
          id: 2,
          name: "Jane",
          age: 24,
          createdAt: "2011-10-31",
          score: 0.03343,
        },
        {
          id: 3,
          name: "Susan",
          age: 16,
          createdAt: "2011-10-30",
          score: 0.03343,
        },
        {
          id: 4,
          name: "Chris",
          age: 55,
          createdAt: "2011-10-11",
          score: 0.03343,
        },
        {
          id: 5,
          name: "Dan",
          age: 40,
          createdAt: "2011-10-21",
          score: 0.03343,
        },
        {
          id: 6,
          name: "John",
          age: 20,
          createdAt: "2011-10-31",
          score: 0.03343,
        },
      ],
      dItems: [],
      dHasNext: false,
      dBlockListError: "",
      gasPrice: this.$store.state.gasPrice,
      dColumns: [
        {
          name: "block",
          label: this.$t("view_block_list.block"),
          itemProp: "block.number",
        },
        {
          name: "time",
          label: this.$t("view_block_list.time"),
          itemProp: "block.timestamp",
          width: "340px",
        },
        {
          name: "age",
          label: this.$t("view_block_list.age"),
          itemProp: "block.timestamp",
        },
        {
          name: "transaction_count",
          label: this.$t("view_block_list.transaction_count"),
          itemProp: "block.transactionCount",
          width: "80px",
        },
      ],
    };
  },

  computed: {
    cLoading() {
      return this.$apollo.queries.blocks.loading;
    },
  },

  methods: {
    fetchMore() {
      const { blocks } = this;

      if (blocks && blocks.pageInfo && blocks.pageInfo.hasNext) {
        const cursor = blocks.pageInfo.last;

        this.$apollo.queries.blocks.fetchMore({
          variables: {
            cursor,
            count: this.itemsPerPage,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            // this.dHasNext = fetchMoreResult.blocks.pageInfo.hasNext;

            return fetchMoreResult;
            /*
                            return {
                                blocks: {
                                    ...fetchMoreResult.blocks,
                                    edges: [...previousResult.blocks.edges, ...fetchMoreResult.blocks.edges]
                                }
                            }
*/
          },
        });
      }
    },

    WEIToFTM,
    timestampToDate,
  },
};
</script>
