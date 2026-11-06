<template>
  <div>
    <div v-for="(li, index) in lists" :key="index" class="card" @click="goToDetail(index)">
      <!-- 不可编辑 -->
      <ul v-if="!li.canEdit">
        <li class="code code-before">
          <span>
            <!-- <span class="code-type">{{ li. }}</span> -->
            {{ li.trxNum }} | {{ li.trxLineNum }}</span>
        </li>
        <customize key="readonly" :columns="getListColumns" :data-source="li"
                   code="SMBL.RECEIPT_EXECUTION.COMPLETE_LIST"/>
      </ul>
      <!-- 可编辑 -->
      <ul v-if="li.canEdit">
        <li class="code code-before">
          <span>
            <!-- <span class="code-type">{{ li. }}</span> -->
            {{ li.trxNum }} | {{ li.trxLineNum }}</span>
        </li>
        <customize key="editable" :columns="getEditorListColumns" :data-source="li"
                   code="SMBL.RECEIPT_EXECUTION.COMPLETE_EDITOR_LIST"/>
      </ul>
      <div v-show="!li.canEdit" class="card-bottom">
        <progress-list :li="li"/>
        <span v-if="display" class="card-btn" @click.stop="canEditFn(index)">{{
          $T("hzero.common.model.edit").$D("编辑")
        }}</span>
      </div>
      <div v-show="li.canEdit" class="card-bottom card-bottom-b">
        <div/>
        <span class="card-btn card-btn-cancle" @click.stop="canEditFn(index)">{{
          $T("hezro.common.button.cancel").$D("取消")
        }}</span>
        <span class="card-btn"
              @click.stop="handleExce(index)">{{ $T("sinv.receiptExecution.model.receipt.execution").$D("执行") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Input } from "hips";
import ProgressList from "./ProgressList";

export default {
  modules: [ "sinv.receiptExecution", "hzero.common", "hezro.common" ],
  name: "LineCard",
  components: {
    ProgressList,
    [Input.name]: Input,
  },
  props: {
    lists: {
      type: Object | Array,
      default: () => [],
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
      reasons: {},
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
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.quantity").$D("单据数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.returnQuantity").$D("可退货数量"),
          fieldCode: "leftQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.quantity").$D("退回数量"),
          fieldCode: "updateQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: (val, record) => {
            if (record.subjectType === "QUANTITY" && !record.canEdit) {
              return true;
            }
            return false;
          },
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.updateTaxAmount").$D("退回金额(含税)"),
          fieldCode: "updateTaxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision"),
          visible: (val, record) => {
            if (record.subjectType === "AMOUNT" && !record.canEdit) {
              return true;
            }
            return false;
          },
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.moveReason").$D("退回原因"),
          fieldCode: "moveReasonMeaning",
          fieldType: "TEXT",
          visible: (val, record) => {
            if (!record.canEdit) {
              return true;
            }
            return false;
          },
        },

      ];

      return columns;
    },
    getEditorListColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.quantity").$D("单据数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.returnQuantity").$D("可退货数量"),
          fieldCode: "leftQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.quantity").$D("退回数量"),
          fieldCode: "updateQuantity",
          fieldType: "INPUT_NUMBER",
          editor: true,
          inputChange: (val, record) => {
            if (record.subjectType === "QUANTITY" && record.canEdit) {
              const { updateQuantity: value, leftQuantity, taxIncludedPrice, unitPriceBatch } = record;
              // const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
              if (value && value > leftQuantity) {
                record.updateQuantity = leftQuantity;
              }
              // if (value && !reg.test(value)) {
              //   record.updateQuantity = value.slice(0, value.length - 1);
              // }
              const updateTaxAmount = (value * taxIncludedPrice * 1000000 / (unitPriceBatch * 1000000)).toFixed(5);
              this.$set(record, "updateTaxAmount", updateTaxAmount);
            }
          },
          visible: (val, record) => {
            if (record.subjectType === "QUANTITY" && record.canEdit) {
              return true;
            }
            return false;
          },
          precision: (val, record) => record.uomPrecision,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.return.updateTaxAmount").$D("退回金额(含税)"),
          fieldCode: "updateTaxAmount",
          fieldType: "INPUT_NUMBER",
          inputType: "number",
          visible: (val, record) => {
            if (record.subjectType === "AMOUNT" && record.canEdit) {
              return true;
            }
            return false;
          },
          inputChange: (val, record) => {
            if (record.subjectType === "AMOUNT" && record.canEdit) {
              const value = record.updateTaxAmount;
              const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
              if (value && value > record.leftTaxAmount) {
                record.updateTaxAmount = record.leftTaxAmount;
              }
              if (value && !reg.test(value)) {
                record.updateTaxAmount = value.slice(0, value.length - 1);
              }
              const updateQuantity = value * record.unitPriceBatch * 1000000 / (record.taxIncludedPrice * 1000000).toFixed(record.uomPrecision);
              // const updateQuantity = Math.ceil(value * record.unitPriceBatch * 1000000 / (record.taxIncludedPrice * 1000000)).toFixed(record.uomPrecision);
              this.$set(record, "updateQuantity", updateQuantity);
            }
          },
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.moveReason").$D("退回原因"),
          fieldCode: "moveReasonMeaning",
          fieldType: "TEXT",
          render: (data, record) => <srm-flex nativeOnClick={(e) => {
            e.stopPropagation();
            setTimeout(() => {
              this.$lov("SPUC.SINV.MOVE.REASON", (val, valueField, displayField) => {
                record.moveReason = val[0][valueField];
                record.moveReasonMeaning = val[0][displayField];
                this.reasons = {
                  moveReason: record.moveReason,
                  moveReasonMeaning: record.moveReasonMeaning,
                };
              }, {
                type: "select"
              });
            }, 100);
          }}>{this.reasons.moveReasonMeaning || "-"}</srm-flex>
        },
      ];

      return columns;
    },
  },
  methods: {
    canEditFn(index) {
      this.$set(this.lists[index], "canEdit", Boolean(!this.lists[index].canEdit));
    },
    // 暂时不做金额
    inputChange(e, index) {
      const { updateQuantity: value, leftQuantity, taxIncludedPrice, unitPriceBatch } = this.lists[index];
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
      if (value && value > leftQuantity) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].updateQuantity = leftQuantity;
      }
      if (value && !reg.test(value)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].updateQuantity = value.slice(0, value.length - 1);
      }
      const updateTaxAmount = (value * taxIncludedPrice * 1000000 / (unitPriceBatch * 1000000)).toFixed(5);
      this.$set(this.lists[index], "updateTaxAmount", updateTaxAmount);
    },
    inputChangeB(e, index) {
      const value = this.lists[index].updateTaxAmount;
      const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
      if (value && value > this.lists[index].leftTaxAmount) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].updateTaxAmount = this.lists[index].leftTaxAmount;
      }
      if (value && !reg.test(value)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].updateTaxAmount = value.slice(0, value.length - 1);
      }
      const updateQuantity = Math.ceil(value * this.lists[index].unitPriceBatch * 1000000 / (this.lists[index].taxIncludedPrice * 1000000)).toFixed(5);
      this.$set(this.lists[index], "updateQuantity", updateQuantity);
    },
    chooseReason(val, record) {
      if (!val) {
        return;
      }
      this.$set(record, "moveReason", val.value);
      this.$set(record, "moveReasonMeaning", val.meaning);
      this.$forceUpdate();
    },
    handleExce(index) {
      const val = this.lists[index];
      if (val.subjectType === "QUANTITY" && !val.updateQuantity && val.updateQuantity !== 0) {
        this.$notification.open({
          message: this.$T("sinv.receiptExecution.viee.require.updateQuantity").$D("退回数量必输"),
          description: "",
          class: "notification",
        });
        return;
      } else if (val.subjectType === "AMOUNT" && !val.updateTaxAmount && val.updateTaxAmount !== 0) {
        this.$notification.open({
          message: this.$T("sinv.receiptExecution.viee.require.updateTaxAmount").$D("退回金额必输"),
          description: "",
          class: "notification",
        });
        return;
      }
      this.$emit("handleExce", [ val ]);
    },
    goToDetail(index) {
      this.$router.push({
        name: "ReceiptExecLineDetail",
        query: { itemData: this.lists[index], nowNode: this.nowNode }
      });
    }
  },
};
</script>

<style lang="stylus">

.line-value {
  color: #1f1f1f;
  line-height: 22px;
  min-height 22px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: #EFF3FE;

  .mydropdown {
    width: 300px;
    height: 20px;
  }

  .form-input {
    width: 600px;
    height: 20px;
    margin-left: 2px;
    border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0); // 透明背景
  }

  .edit-icon {
    margin-right: 9px;
    width: 20px;
    height: 20px;
  }
}

ul {
  overflow: hidden;
}

.card-bottom-b {
  justify-content: flex-end !important;

  .card-btn-cancle {
    border: 1px solid var(--color-other-default-b) !important;
    background: var(--color-bg-default) !important;
    color: var(--color-other-default-b) !important;
    margin-right: 12px !important;
  }
}

.code-dropdown {
  min-width 0 !important
}
</style>
