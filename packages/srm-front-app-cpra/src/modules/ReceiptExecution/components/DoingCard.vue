/* eslint-disable vue/no-mutating-props */
<!-- eslint-disable rulesdir/no_hips -->
<template>
  <div>
    <hips-checkbox-group v-model="checkLists.arr" :checkbox-border="false">
      <hips-checkbox
        v-for="(li, index) in lists"
        :key="index"
        :option="{ value: li }">
        <div class="card">
          <ul>
            <li class="code">
              <span>
                <span class="code-type">{{ li.rcvStatusCodeMeaning }}</span>
                {{ li.trxNum }}
              </span>
              <srm-dropdown
                type="tooltip"
                :text="li.sugRcvStatusMeaning || $T('sinv.receiptExecution.view.doing.noSugRcvStatusMeaning').$D('未选择')">
                <srm-dropdown-item
                  v-for="(item,key) in codeType" :key="key"
                  :value="item.value"
                  :text="item.meaning"
                  @click="chooseCodeType(item,index)"/>
              </srm-dropdown>
            </li>
            <customize :columns="getListColumns" :data-source="li" code="SMBL.RECEIPT_EXECUTION.DOING_LIST"/>
          </ul>
          <div class="card-bottom">
            <progress-list :li="li"/>
            <span class="card-btn" @click.stop="goToDetail(index)">{{
              $T("hzero.common.view.title.detail").$D("详情")
            }}</span>
          </div>
        </div>
      </hips-checkbox>
    </hips-checkbox-group>
  </div>
</template>

<script>
import { Input, Checkbox, CheckboxGroup } from "hips";
import ProgressList from "./ProgressList";
import {
  getCodeTypeApi,
} from "../api/index";

export default {
  modules: [ "sinv.receiptExecution", "hipspfm.common", "hzero.common" ],
  name: "DoingCard",
  components: {
    ProgressList,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  props: {
    lists: {
      type: Object | Array,
      default: () => [],
    },
    checkList: {
      type: Object | Array,
      default: () => ({}),
    },
    display: {
      type: Boolean,
      default: false,
    },
    nowNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      codeType: []
    };
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
          fieldName: this.$T("sinv.receiptExecution.model.receipt.rcvTypeName.current").$D("事务类型"),
          fieldCode: "rcvTypeName",
          fieldType: "TEXT",
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
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
      ];

      return columns;
    },
    checkLists() {
      return this.checkList;
    }
  },
  async mounted() {
    this.$loading.show();
    await this.getCodeType();
    this.$loading.hide();
  },
  methods: {
    async getCodeType() {
      getCodeTypeApi({ lovCode: "SPUC.SINV_SUGGEST_STRATEGY" }).then((res) => {
        if (res && !res.failed) {
          this.codeType = res;
        }
      });
    },
    chooseCodeType(val, index) {
      this.$set(this.lists[index], "sugRcvStatusCode", val.value);
      this.$set(this.lists[index], "sugRcvStatusMeaning", val.meaning);
      this.$forceUpdate();
    },
    goToDetail(index) {
      const canEdit = this.display;
      this.$router.push({
        name: "ReceiptExecDoingDetail",
        query: {
          rcvTrxHeaderId: this.lists[index].rcvTrxHeaderId,
          nodeConfigIndexAbc: this.nowNode.nodeConfigIndexAbc,
          canEdit: Number(canEdit)
        }
      });
    }
  },
};
</script>

<style lang="stylus">
>>> .hips-cell hips-thinline {
  padding: 0;
}

.code-btn {
  display: flex;
  align-items: center;
  padding: 3px 8px;
  border: 1px solid var(--color-other-default-b);
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
  line-height: 12px !important;

  img {
    width: 12px;
    height: 12px;
  }
}
</style>
<style lang="stylus" scoped>
>>> .srm-dropdown {
  flex none;

  .srm-dropdown-button-tooltip {
    border solid 1px var(--color-primary);
    height auto;
    font-size 12px;
    width auto;
    padding 0 5px;
    color var(--color-primary);

    .srm-dropdown-button-text {
      font-weight bold;
    }
  }
}
</style>
