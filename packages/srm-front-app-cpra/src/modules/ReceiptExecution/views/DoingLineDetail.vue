<template>
  <div>
    <!-- 供应商报价明细 -->
    <div class="lineinfo-detail">
      <!-- 头部按钮 -->
      <div class="btn-wrap">
        <div class="btn file-btn" @click="showFilePop">
          {{ $T("sinv.common.model.common.lineAattachment").$D("行附件") }}
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <customize-detail :columns="getLineColumns" :data-source="itemData" code="SMBL.RECEIPT_EXECUTION.DOING_LIST.LINE_DETIAL"/>
      </div>
    </div>

    <date-chooser v-model="myDate" @submitDate="handleConfirm" />

    <!-- 附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="attachmentUuid"
      :title="$T('hipspfm.common.message.title.viewAttachment').$D('附件查看')"
      :can-upload="canEdit"
      :can-delete="canEdit"/>

    <!-- 底部按钮 -->
    <new-bottom-handler
      v-if="canEdit"
      :btn-arr="[
        {
          title: $T('hipspfm.common.view.button.saveChange').$D('保存修改'),
          background: '#276EF1',
          color: '#fff',
          handler: saveOrder,
        },
      ]"/>

    <lov
      v-model="inventoryPop"
      :title="$T('sinv.receiptExecution.model.receipt.inventoryName').$D('库房')"
      code="SODR.INVENTORY"
      :query-params="{ lovCode: 'SODR.INVENTORY' }"
      :query-field="['inventoryCode', 'inventoryName']"
      @submitValue="GetInventoryValue"/>
    <lov
      v-model="locationPop"
      code="HPFM.LOCATION"
      :query-params="{ lovCode: 'HPFM.LOCATION' }"
      :query-field="['locationCode', 'locationName']"
      @submitValue="GetLocationValue"/>
  </div>
</template>

<script>
import AttachedFile from "@/components/AttachedFile";
import NewBottomHandler from "@/components/BottomHandler";
import DateChooser from "@/components/DateChooser";
import uuid from "uuid";
import Lov from "@/components/Lov";
import mixin from "../mixin/index.js";
import { View, Popup, Input, NavBar, Textarea } from "hips";
import { getDoingSaveApi } from "../api/index";

export default {
  modules: [ "hipspfm.common", "hipspfm.orderApproval", "sinv.common", "sinv.receiptExecution", "ssrc.inquiryHall", "hipspfm.expertScoring" ],
  components: {
    Lov,
    AttachedFile,
    DateChooser,
    NewBottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
  },
  mixins:[ mixin ],
  data() {
    return {
      headInfo: {}, // 头信息
      lineInfo: [], // 行信息
      itemData: {}, //
      index:0, // 行号
      nodeIndex:"B", // 节点信息 调接口使用
      canEdit:false, // 是否可编辑
      myDate:false,
      inventoryPop:false, // 库房
      locationPop:false, // 库位
      filePopup: false,
      attachmentUuid: "",
    };
  },
  computed: {
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.trxLineNum").$D("单据行号"),
          fieldType: "TEXT",
          fieldCode: "lineNum",
          render:(val) => val || this.index + 1
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.leftQuantity").$D("可执行数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "leftQuantity",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.uomName").$D("单位"),
          fieldCode: "uomName",
          fieldType: "TEXT",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${item.uomNameShow}` : item.uomNameShow,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          inputType: "number",
          editor: (val, record) => {
            if (record.subjectType === "QUANTITY" && this.canEdit) {
              return true;
            }
            return false;
          },
          inputChange:(val, record) => {
            if (record.subjectType === "QUANTITY" && this.canEdit) {
              // const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
              if (this.itemData.quantity > this.itemData.leftQuantity) {
                this.itemData.quantity = this.itemData.leftQuantity;
              }
              // if (this.itemData.quantity && !reg.test(this.itemData.quantity)) {
              //   this.itemData.quantity = this.itemData.quantity.slice(0, this.itemData.quantity.length - 1);
              // }
              const taxIncludedAmount = (this.itemData.quantity * this.itemData.taxIncludedPrice * 1000000 / (this.itemData.unitPriceBatch * 1000000)).toFixed(5);
              this.$set(this.itemData, "taxIncludedAmount", taxIncludedAmount);
            }
          },
          precision: (val, item) => item.uomPrecision
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.taxIncludedAmount").$D("执行金额(含税)"),
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          inputType: "number",
          editor: (val, record) => {
            if (record.subjectType === "AMOUNT" && this.canEdit) {
              return true;
            }
            return false;
          },
          inputChange:(val, record) => {
            if (record.subjectType === "AMOUNT" && this.canEdit) {
              const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
              if (this.itemData.taxIncludedAmount > this.itemData.leftTaxAmount) {
                this.itemData.taxIncludedAmount = this.itemData.leftTaxAmount;
              }
              if (this.itemData.taxIncludedAmount && !reg.test(this.itemData.taxIncludedAmount)) {
                this.itemData.taxIncludedAmount = this.itemData.taxIncludedAmount.slice(0, this.itemData.taxIncludedAmount.length - 1);
              }
              const quantity = this.itemData.taxIncludedAmount * this.itemData.unitPriceBatch * 1000000 / (this.itemData.taxIncludedPrice * 1000000).toFixed(record.uomPrecision);
              // const quantity = Math.ceil(this.itemData.taxIncludedAmount * this.itemData.unitPriceBatch * 1000000 / (this.itemData.taxIncludedPrice * 1000000)).toFixed(record.uomPrecision);
              this.$set(this.itemData, "quantity", quantity);
            }
          },
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision")
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.leftTaxAmount.tax").$D("可执行金额(含税)"),
          fieldCode: "leftTaxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision")
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.trxDate").$D("实际操作日期"),
          fieldCode: "trxDate",
          fieldType: this.canEdit ? "DATE" : "TEXT",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
          ,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.inventoryName").$D("库房"),
          fieldCode: "inventoryName",
          fieldType: "TEXT",
          visible: () => {
            if (!this.canEdit) {
              return true;
            }
            return false;
          },
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.inventoryName").$D("库房"),
          fieldCode: "inventoryName",
          fieldType: "EMPTY",
          visible: () => {
            if (this.canEdit) {
              return true;
            }
            return false;
          },
          render: () => <div class="item-value-style">
            <span>{ this.itemData.inventoryName }</span>
            <img
              class="edit-icon"
              src={require("@/assets/ReceiptExecution/icon_List_editor_normal@3x.png")}
              alt=""/>
          </div>,
          callBack:() => {
            this.showInventoryPop();
          }
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.locationName").$D("库位"),
          fieldCode: "locationName",
          fieldType: "TEXT",
          visible: () => {
            if (!this.canEdit) {
              return true;
            }
            return false;
          },
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.locationName").$D("库位"),
          fieldCode: "locationName",
          fieldType: "EMPTY",
          visible: () => {
            if (this.canEdit) {
              return true;
            }
            return false;
          },
          render: () => <div class="item-value-style">
            <span>{ this.itemData.locationName }</span>
            <img
              class="edit-icon"
              src={require("@/assets/ReceiptExecution/icon_List_editor_normal@3x.png")}
              alt=""/>
          </div>,
          callBack:() => {
            this.showLocationPop();
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.LineRemark").$D("行备注"),
          fieldCode: "remark",
          fieldType: "TEXT_AREA",
          disabled: () => !this.canEdit
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.poTypeCodeMeaning").$D("来源单据类型"),
          fieldCode: "poTypeCodeMeaning",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.source.poTypeCode").$D("来源单据编号"),
          fieldCode: "sourceHeaderNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.source.lineNum").$D("来源单据行号"),
          fieldCode: "sourceLineNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.change").$D("移动类型"),
          fieldCode: "rcvTypeName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.not.netPrice").$D("未税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.tax.includedPrice").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.organizationName").$D("收货组织"),
          fieldCode: "invOrganizationName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.quantity").$D("单据数量"),
          fieldCode: "poQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.productNum").$D("商品编码"),
          fieldCode: "productNum",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.dueDate").$D("妥投时间"),
          fieldCode: "deliverTime",
          fieldType: "TEXT",
        },
      ];

      return columns;
    },
  },
  mounted() {
    const { lineInfo = [], canEdit = 0, index = 0, headInfo = {}, nodeIndex } = this.$route.query;
    this.lineInfo = lineInfo;
    this.index = index;
    this.itemData = this.lineInfo[index];
    this.headInfo = headInfo;
    // eslint-disable-next-line eqeqeq
    this.canEdit = canEdit == "1";
    this.nodeIndex = nodeIndex;
    console.log(12344321, lineInfo, nodeIndex);
  },
  methods: {
    // 控制用户输入
    inputChange() {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
      if (this.itemData.quantity > this.itemData.leftQuantity) {
        this.itemData.quantity = this.itemData.leftQuantity;
      }
      if (this.itemData.quantity && !reg.test(this.itemData.quantity)) {
        this.itemData.quantity = this.itemData.quantity.slice(0, this.itemData.quantity.length - 1);
      }
      const taxIncludedAmount = (this.itemData.quantity * this.itemData.taxIncludedPrice * 1000000 / (this.itemData.unitPriceBatch * 1000000)).toFixed(5);
      this.$set(this.itemData, "taxIncludedAmount", taxIncludedAmount);
    },
    // 控制用户输入
    inputChangeB() {
      const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
      if (this.itemData.taxIncludedAmount > this.itemData.leftTaxAmount) {
        this.itemData.taxIncludedAmount = this.itemData.leftTaxAmount;
      }
      if (this.itemData.taxIncludedAmount && !reg.test(this.itemData.taxIncludedAmount)) {
        this.itemData.taxIncludedAmount = this.itemData.taxIncludedAmount.slice(0, this.itemData.taxIncludedAmount.length - 1);
      }
      const quantity = Math.ceil(this.itemData.taxIncludedAmount * this.itemData.unitPriceBatch * 1000000 / (this.itemData.taxIncludedPrice * 1000000)).toFixed(5);
      this.$set(this.itemData, "quantity", quantity);
    },
    // 执行
    saveOrder() {
      const params = {
        ...this.headInfo,
        sinvRcvTrxLineDTOS:this.lineInfo
      };
      const customizeUnitCode = `SINV.RECEIPT_EXECUTE_DETAIL.HEADER_${this.nodeIndex},SINV.RECEIPT_EXECUTE_DETAIL.LINE_${this.nodeIndex}`;
      this.$loading.show();
      getDoingSaveApi(customizeUnitCode, params).then((res) => {
        this.$loading.hide();
        if (res && !res.failed && !res.error) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            description: "",
            class: "notification",
          });
          this.goBack();
        }
      });
    },
    // 展示日期
    showDate() {
      this.myDate = !this.myDate;
    },
    handleConfirm(value) {
      this.$set(this.itemData, "trxDate", `${value} 00:00:00`);
      this.showDate();
    },
    showInventoryPop() {
      this.inventoryPop = !this.inventoryPop;
    },
    GetInventoryValue(val) {
      this.$set(this.itemData, "inventoryName", val[0].inventoryName);
      this.$set(this.itemData, "inventoryId", val[0].inventoryId);
    },
    showLocationPop() {
      this.locationPop = !this.locationPop;
    },
    GetLocationValue(val) {
      this.$set(this.itemData, "locationName", val[0].locationName);
      this.$set(this.itemData, "locatorId", val[0].locationId);
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
    // 打开附件
    showFilePop() {
      if (!this.itemData.sinvLineAttachmentUuid) {
        this.itemData.sinvLineAttachmentUuid = uuid();
      }
      this.attachmentUuid = this.itemData.sinvLineAttachmentUuid;
      this.filePopup = !this.filePopup;
    },
  },
};
</script>

<style lang="stylus" scoped>
.item-value-style {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  width: 100%

  .form-input {
    width: 200px;
    height: 20px;
  }

  .edit-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}

.lineinfo-detail {
  width: 100%;
  height: calc(100vh - 44px);
  overflow-y: auto;
  background-color #f0f2f5

  .btn-wrap {
    display: flex;
    padding: 16px 15px;
    border-bottom 1px solid #f6f6f6
    position: sticky;
    background: #ffffff;
    top: 0;
    z-index 100

    .btn {
      padding: 8px 16px;
      margin-right: 8px;
      border-radius: 16px;
      font-size: 12px;
      line-height: 16px;
      color: #ffffff;
    }

    .file-btn {
      background: #f36331;
    }
  }

  .content {
    padding-left: 15px;
    margin-bottom: 160px;

    .form-item {
      padding: 15px 15px 15px 0;
      border-bottom: 1px solid #f6f6f6;

      .label {
        color: #AFAFAF;
        font-size: 12px;
        line-height: 16px;
        font-weight bold
      }

      .value {
        margin-top: 8px;
        color: #1f1f1f;
        line-height: 22px;
        min-height 22px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;

        .form-input {
          width: 200px;
          height: 20px;
          border: 0; // 去除未选中状态边框
          outline: none; // 去除选中状态边框
          background-color: rgba(0, 0, 0, 0); // 透明背景
        }

        .edit-icon {
          width: 20px;
          height: 20px;
        }
      }

      .line-text {
        height: 64px;
        margin-top: 8px;
        margin-bottom: 40px;
        background: var(--color-bg-default-b);
        border-radius: 8px;
        position: relative;

        >>> .hips-textarea {
          position: static;
          background-color: var(--color-bg-default-b) !important;
          padding: 0 !important;

          textarea:disabled, textarea[disabled] {
            -webkit-opacity: 0.22;
            opacity: 0.22;
            color: var(--color-font-default) !important;
          }
        }

        >>> .hips-textarea--disabled {
          opacity: 1;
        }

        >>> .hips-textarea__input-value {
          padding: 12px;

          textarea {
            height: 80px !important;
            font-size: 14px !important;
            color: #333333 !important;
            line-height: 20px !important;
          }
        }

        .text-img {
          position: absolute;
          right: 12px;
          top: 72px;
          width: 20px;
          height: 20px;
        }
        .text-img-edit {
          top: 12px;
        }
      }
    }

    .switch-form {
      padding: 18px 15px 18px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .switch-left {
        .lable {
          color: #1f1f1f;
        }

        .tips {
          color: #276ef1;
          line-height: 16px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
