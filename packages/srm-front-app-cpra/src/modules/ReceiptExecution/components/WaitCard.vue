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
                {{ li.trxNum }}|{{ li.trxLineNum }}</span>
              <span class="code-span-type">{{ li.orderTypeName }}</span>
            </li>
            <customize :columns="getListColumns" :data-source="li" code="SMBL.RECEIPT_EXECUTION.WAIT_LIST"/>
            <!-- <li>
              <span>{{ $T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商") }}：{{ li.supplierName }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称") }}：{{ li.itemName }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.receiptExecution.model.receipt.itemCode").$D("物料编码") }}：{{ li.itemCode }}</span>
            </li>
            <li class="card-b">
              <span>{{ $T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量") }}：{{ li.leftQuantity }}</span>
              <span>{{ $T("sinv.receiptExecution.model.receipt.uomName").$D("单位") }}：{{ li.uomName }}</span>
            </li> -->

            <!-- <li v-if="li.subjectType == 'QUANTITY'" class="can-edit">
              <span>{{ $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量") }}： -->
            <!-- 非负浮点数 -->
            <!-- <input
                  v-model="li.quantity"
                  class="li-input"
                  pattern="^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$"
                  type="number"
                  @input="inputChange($event,index)">
              </span>
              <img src="@/assets/ReceiptExecution/icon_Form_editor_Darknormal@3x.png" >
            </li> -->

            <!-- <li v-if="li.subjectType == 'AMOUNT'" class="can-edit">
              <span>{{ $T("sinv.receiptExecution.model.receipt.taxIncludedAmount").$D("执行金额(含税)") }}： -->
            <!-- 非负浮点数 -->
            <!-- <input
                  v-model="li.taxIncludedAmount"
                  class="li-input"
                  pattern="^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$"
                  type="number"
                  @input="inputChangeB($event,index)">
              </span>
              <img src="@/assets/ReceiptExecution/icon_Form_editor_Darknormal@3x.png" >
            </li> -->
          </ul>
          <div class="card-bottom" @click.stop>
            <progress-list :li="li" />
            <span class="card-btn" @click.stop="goToDetail(index)">{{ $T("hzero.common.view.title.detail").$D("详情") }}</span>
          </div>
        </div>
      </hips-checkbox>
    </hips-checkbox-group>
  </div>
</template>

<script>
import { Input, Checkbox, CheckboxGroup } from "hips";
import ProgressList from "./ProgressList";
export default {
  modules: [ "sinv.receiptExecution", "hzero.common" ],
  name: "WaitCard",
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
      default: () => [],
    },
    nowNode:{
      type: Object,
      default:() => ({})
    }
  },
  data() {
    return {
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
          fieldName: this.$T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量"),
          fieldCode: "leftQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.uomName").$D("单位"),
          fieldCode: "uomName",
          fieldType: "TEXT",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${item.uomNameShow}` : item.uomNameShow,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "quantity",
          inputType: "number",
          inputChange:(val, record) => {
            if (record.subjectType === "QUANTITY") {
              //非负浮点数
              const { quantity:value, leftQuantity, taxIncludedPrice, unitPriceBatch } = record;
              // const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
              if (value && value > leftQuantity) {
                record.quantity = leftQuantity;
              }
              // if (value && !reg.test(value)) {
              //   record.quantity = value.slice(0, value.length - 1);
              // }
              const taxIncludedAmount = (value * taxIncludedPrice * 1000000 / (unitPriceBatch * 1000000)).toFixed(5);
              this.$set(record, "taxIncludedAmount", taxIncludedAmount);
            }
          },
          visible: (val, record) => record.subjectType === "QUANTITY",
          // placeholder: this.$T("sinv.purchaseReception.view.write.receive.quantity.now").$D("请输入此次接受数量"),
          precision: (val, item) => item.uomPrecision
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.taxIncludedAmount").$D("执行金额(含税)"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          inputType: "number",
          inputChange:(val, record) => {
            if (record.subjectType === "AMOUNT") {
              //非负浮点数
              const { taxIncludedAmount:value, leftTaxAmount, taxIncludedPrice, unitPriceBatch } = record;
              const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
              if (value > leftTaxAmount) {
                record.taxIncludedAmount = leftTaxAmount;
              }
              if (value && !reg.test(value)) {
                record.taxIncludedAmount = value.slice(0, value.length - 1);
              }
              const quantity = value * unitPriceBatch * 1000000 / (taxIncludedPrice * 1000000).toFixed(record.uomPrecision);
              this.$set(record, "quantity", quantity);
            }
          },
          visible: (val, record) => record.subjectType === "AMOUNT",
          // placeholder: this.$T("sinv.purchaseReception.view.write.receive.quantity.now").$D("请输入此次接受数量"),
          // precision: (val,item) => {
          //   return this.$options.filters.calcCurrencyPrecision(item.currencyCode,"financialPrecision");
          // }
        },
      ];

      return columns;
    },
    checkLists() {
      return this.checkList;
    }
  },
  watch: {
  },
  methods:{
    inputChange(e, index) {
      const { quantity:value, leftQuantity, taxIncludedPrice, unitPriceBatch } = this.lists[index];
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
      if (value && value > leftQuantity) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].quantity = leftQuantity;
      }
      if (value && !reg.test(value)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].quantity = value.slice(0, value.length - 1);
      }
      const taxIncludedAmount = (value * taxIncludedPrice * 1000000 / (unitPriceBatch * 1000000)).toFixed(5);
      this.$set(this.lists[index], "taxIncludedAmount", taxIncludedAmount);
    },
    inputChangeB(e, index) {
      const { taxIncludedAmount:value, leftTaxAmount, taxIncludedPrice, unitPriceBatch } = this.lists[index];
      const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
      if (value > leftTaxAmount) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].taxIncludedAmount = leftTaxAmount;
      }
      if (value && !reg.test(value)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.lists[index].taxIncludedAmount = value.slice(0, value.length - 1);
      }
      const quantity = Math.ceil(value * unitPriceBatch * 1000000 / (taxIncludedPrice * 1000000)).toFixed(5);
      this.$set(this.lists[index], "quantity", quantity);
    },
    goToDetail(index) {
      this.$router.push({
        name:"ReceiptExecWaitDetail",
        query:{ itemData:this.lists[index], nowNode:this.nowNode }
      });
    }
  }
};
</script>

<style lang="stylus" >
>>> .hips-cell hips-thinline{
  padding 0
}
</style>
