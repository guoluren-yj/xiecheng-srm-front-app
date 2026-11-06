<template>
  <div>
    <div v-for="(li, index) in lists" :key="index" class="card" @click.stop="goToDetail(index)">
      <ul>
        <li class="code code-before">
          <span>
            <span class="code-type">{{ li.rcvStatusCodeMeaning }}</span>
            {{ li.trxNum }}</span>
        </li>
        <customize :columns="getListColumns" :data-source="li" code="SMBL.RECEIPT_EXECUTION.COMPLETE_HEADER_LIST"/>
        <!-- <li>
          <span>{{
            $T("sinv.receiptExecution.model.receipt.supplierName").$D(
              "供应商"
            )
          }}：{{ li.supplierName }}</span>
        </li>
        <li>
          <span>{{
            $T("sinv.receiptExecution.model.receipt.companyName").$D("公司")
          }}：{{ li.companyName }}</span>
        </li>
        <li class="card-b">
          <span>{{
            $T("sinv.receiptExecution.model.receipt.rcvTypeName").$D(
              "事务类型"
            )
          }}：{{ li.rcvTypeName }}</span>
          <span>{{
            $T("sinv.receiptExecution.model.receipt.returnedFlag").$D(
              "是否退回"
            )
          }}：{{ li.returnedFlag == 1 ? $T("hipspfm.common.status.yes").$D("是"):(li.returnedFlag == 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
        </li>
        <li>
          <span>{{
            $T("sinv.receiptExecution.model.receipt.strategyCode").$D(
              "策略编号"
            )
          }}：{{ li.strategyCode }}</span>
        </li> -->
      </ul>
      <div v-show="!li.canEdit" class="card-bottom">
        <progress-list :li="li" />
      </div>
    </div>
  </div>
</template>

<script>
import { Input } from "hips";
// import { getReasonApi } from "../api/index";
import ProgressList from "./ProgressList";
export default {
  modules: [ "sinv.receiptExecution", "hipspfm.common" ],
  name: "HeadCard",
  components: {
    ProgressList,
    [Input.name]: Input,
  },
  props: {
    lists: {
      type: Object | Array,
      default: () => [],
    },
    nowNode:{
      type: Object,
      default:() => ({})
    }
  },
  data() {
    return {};
  },
  computed: {
    getListColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.rcvTypeName").$D("事务类型"),
          fieldType: "TEXT",
          fieldCode: "rcvTypeName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.returnedFlag").$D("是否退回"),
          fieldCode: "returnedFlag",
          fieldType: "TEXT",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.strategyCode").$D("策略编号"),
          fieldCode: "strategyCode",
          fieldType: "TEXT",
        },

      ];

      return columns;
    },
  },
  async mounted() {},
  methods: {
    goToDetail(index) {
      this.$router.push({
        name:"ReceiptExecDoingDetail",
        query:{ rcvTrxHeaderId:this.lists[index].rcvTrxHeaderId, nodeConfigIndexAbc:this.nowNode.nodeConfigIndexAbc }
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
ul {
  overflow: hidden;
}

.card-bottom-b {
  justify-content: flex-end !important;

  .card-btn-cancle {
    border: 1px solid var(--color-other-default-b) !important;
    background: var(--color-bg-default) !important;
    color: var(--color-other-default-b) !important;
    margin-right: 12px;
  }
}
</style>
