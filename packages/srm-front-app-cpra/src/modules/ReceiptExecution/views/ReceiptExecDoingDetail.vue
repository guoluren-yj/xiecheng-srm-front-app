<template>
  <div>
    <div ref="content" class="content">
      <new-detail-head
        :title="
          $T('sinv.receiptExecution.model.receipt.rcvTypeName.current').$D(
            '事务类型'
          )+'：' + headInfo.rcvTypeName
        "
        no-history
        @showFilePop="showFilePop">
        <div class="head-lin">
          <span>{{ headInfo.displayTrxNum }}</span>
        </div>
      </new-detail-head>

      <div class="info">
        <div class="card head-card">
          <ul>
            <li class="code ">
              <span> {{ headInfo.displayTrxNum }}</span>
            </li>
            <customize :columns="getHeaderColumns" :data-source="headInfo" code="SMBL.RECEIPT_EXECUTION.DOING_LIST.HEADER"/>
          </ul>
        </div>

        <div class="line-card">
          {{ $T("hipspfm.orderApproval.view.message.title.orderDetail").$D("订单详情") }}
        </div>
        <div v-for="(li, index) in lineInfo" :key="index" class="card">
          <ul>
            <li class="code code-before">
              <span> {{
                $T("sinv.receiptExecution.model.receipt.itemCode").$D(
                  "物料编码"
                )
              }}：{{ li.itemCode }}</span>
              <span class="code-span-type">{{ li.rcvTypeName }}</span>
            </li>
            <customize :columns="getLineColumns" :data-source="li" code="SMBL.RECEIPT_EXECUTION.DOING_LIST.LINE"/>
          </ul>
          <div class="card-bottom">
            <span class="card-btn" @click="goToDetail(index)">{{
              $T("hzero.common.button.details").$D(
                "查看详情"
              )
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="canEdit" class="bottom-btn">
      <img
        class="delete-btn"
        src="@/assets/ReceiptExecution/icon_40px_line_deleted_red@3x.png"
        @click.stop="deleteOrder">
      <div class="btn-group">
        <span class="btn-span" @click="saveOrder">{{ $T("hipspfm.common.button.save").$D("保存") }}</span>
        <span class="btn-span submit-btn" @click="submitOrder">{{ $T("hipspfm.common.button.submit").$D("提交") }}</span>
      </div>
    </div>

    <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid" :can-upload="canEdit" :can-delete="canEdit" />
  </div>
</template>

<script>
import { View, Popup, Input, NavBar, Textarea } from "hips";
import { getHeadInfoApi, getLineInfoApi, getDoingSaveApi, getDoingDeleteApi, getDoingSubmitApi } from "../api/index";
import uuid from "uuid";
import NewDetailHead from "@/components/NewDetailHead";
import AttachedFile from "@/components/AttachedFile";

export default {
  modules: [ "sinv.receiptExecution", "hipspfm.common", "hzero.c7nProUI", "hzero.common", "hipspfm.orderApproval" ],
  name: "ReceiptExecDoingDetail",
  components: {
    NewDetailHead,
    AttachedFile,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
  },
  data() {
    return {
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
      rcvTrxHeaderId: "",
      nodeIndex: "",
      headInfo: {},
      lineInfo: [],
      attachmentUuid: "",
      filePopup: false,
      canEdit: false, // 是否可编辑操作
    };
  },
  computed: {
    getHeaderColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.supplierName").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.creationName").$D("单据创建人"),
          fieldType: "TEXT",
          fieldCode: "creationName",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.companyName").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.returnedFlag").$D("是否退回"),
          fieldCode: "returnedFlag",
          fieldType: "TEXT",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
          fieldType: "TEXT",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.header.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT_AREA"
        },
      ];

      return columns;
    },
    getLineColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
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
          visible: (val, record) => {
            if (record.subjectType === "QUANTITY" && this.canEdit) {
              return true;
            }
            return false;
          },
          inputChange:(val, record) => {
            if (record.subjectType === "QUANTITY" && this.canEdit) {
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
          precision: (val, item) => item.uomPrecision
        },
        {
          fieldName: this.$T("sinv.receiptExecution.model.receipt.taxIncludedAmount").$D("执行金额(含税)"),
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          inputType: "number",
          visible: (val, record) => {
            if (record.subjectType === "AMOUNT" && this.canEdit) {
              return true;
            }
            return false;
          },
          inputChange:(val, record) => {
            if (record.subjectType === "AMOUNT" && this.canEdit) {
              const { taxIncludedAmount:value, leftTaxAmount, taxIncludedPrice, unitPriceBatch } = record;
              const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
              if (value > leftTaxAmount) {
                record.taxIncludedAmount = leftTaxAmount;
              }
              if (value && !reg.test(value)) {
                record.taxIncludedAmount = value.slice(0, value.length - 1);
              }
              const quantity = value * unitPriceBatch * 1000000 / (taxIncludedPrice * 1000000).toFixed(record.uomPrecision);
              // const quantity = Math.ceil(value * unitPriceBatch * 1000000 / (taxIncludedPrice * 1000000)).toFixed(record.uomPrecision);
              this.$set(record, "quantity", quantity);
            }
          },
          precision: (val, item) => this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision")
        },
      ];

      return columns;
    },
  },
  watch: {},
  async mounted() {
    const {
      rcvTrxHeaderId = "",
      nodeConfigIndexAbc: nodeIndex,
      canEdit,
    } = this.$route.query;
    this.rcvTrxHeaderId = rcvTrxHeaderId;
    this.nodeIndex = nodeIndex;
    // eslint-disable-next-line eqeqeq
    this.canEdit = canEdit == "1";
    try {
      this.$loading.show();
      await this.getHeadInfo();
      await this.getLineInfo();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    async getHeadInfo() {
      await getHeadInfoApi(this.rcvTrxHeaderId, {
        customizeUnitCode: `SINV.RECEIPT_EXECUTE_DETAIL.HEADER_${this.nodeIndex}`,
      }).then((res) => {
        if (res && !res.failed) {
          this.headInfo = res;
          if (this.headInfo.sinvHeaderAttachmentUuid) {
            this.attachmentUuid = this.headInfo.sinvHeaderAttachmentUuid;
          } else {
            this.attachmentUuid = uuid();
            this.headInfo.sinvHeaderAttachmentUuid = this.attachmentUuid;
          }
        }
      });
    },
    async getLineInfo() {
      const params = {
        page: 0,
        size: 1000,
        customizeUnitCode: `SINV.RECEIPT_EXECUTE_DETAIL.LINE_${this.nodeIndex}`,
      };
      await getLineInfoApi(this.rcvTrxHeaderId, params).then((res) => {
        if (res && !res.failed) {
          this.lineInfo = res.content || [];
        }
      });
    },
    goToDetail(index) {
      this.$router.push({
        name:"DoingLineDetail",
        query:{ lineInfo:this.lineInfo, canEdit:Number(this.canEdit), index, headInfo:this.headInfo, nodeIndex:this.nodeIndex }
      });
    },
    inputChange(e, index) {
      const { quantity:value, leftQuantity, taxIncludedPrice, unitPriceBatch } = this.lineInfo[index];
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,5})?$/;
      if (value && value > leftQuantity) {
        this.lineInfo[index].quantity = leftQuantity;
      }
      if (value && !reg.test(value)) {
        this.lineInfo[index].quantity = value.slice(0, value.length - 1);
      }
      const taxIncludedAmount = (value * taxIncludedPrice * 1000000 / (unitPriceBatch * 1000000)).toFixed(5);
      this.$set(this.lineInfo[index], "taxIncludedAmount", taxIncludedAmount);
    },
    // 控制用户输入
    inputChangeB(e, index) {
      const { taxIncludedAmount:value, leftTaxAmount, taxIncludedPrice, unitPriceBatch } = this.lineInfo[index];
      const reg = /^(\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
      if (value > leftTaxAmount) {
        this.lineInfo[index].taxIncludedAmount = leftTaxAmount;
      }
      if (value && !reg.test(value)) {
        this.lineInfo[index].taxIncludedAmount = value.slice(0, value.length - 1);
      }
      const quantity = Math.ceil(value * unitPriceBatch * 1000000 / (taxIncludedPrice * 1000000)).toFixed(5);
      this.$set(this.lineInfo[index], "quantity", quantity);
    },
    validData() {
      let flag = true, AFlag = true;
      this.lineInfo.map((i) => {
        if (i.subjectType === "QUANTITY" && i.quantity !== 0 && !i.quantity) {
          flag = false;
        }
        if (i.subjectType === "AMOUNT" && i.taxIncludedAmount !== 0 && !i.taxIncludedAmount) {
          AFlag = false;
        }
      });
      if (!AFlag) {
        this.$notification.open({
          message: this.$T("sinv.receiptExecution.view.require.taxIncludedAmount").$D("执行金额(含税)必填"),
          description: "",
          class: "notification",
        });
      }
      if (!flag) {
        this.$notification.open({
          message: this.$T("sinv.receiptExecution.view.require.quantity").$D("执行数量必填"),
          description: "",
          class: "notification",
        });
      }
      return flag && AFlag;
    },
    // saveOrder
    async saveOrder() {
      const params = {
        ...this.headInfo,
        sinvRcvTrxLineDTOS:this.lineInfo
      };
      const customizeUnitCode = `SINV.RECEIPT_EXECUTE_DETAIL.HEADER_${this.nodeIndex},SINV.RECEIPT_EXECUTE_DETAIL.LINE_${this.nodeIndex}`;
      this.$loading.show();
      await getDoingSaveApi(customizeUnitCode, params).then(async (res) => {
        if (res && !res.failed && !res.error) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            description: "",
            class: "notification",
          });
          await this.getHeadInfo();
          await this.getLineInfo();
        }
        this.$loading.hide();
      });
    },
    // 提交
    submitOrder() {
      if (!this.validData()) {
        return;
      }
      const params = {
        ...this.headInfo,
        sinvRcvTrxLineDTOS:this.lineInfo
      };
      const customizeUnitCode = `SINV.RECEIPT_EXECUTE_DETAIL.HEADER_${this.nodeIndex},SINV.RECEIPT_EXECUTE_DETAIL.LINE_${this.nodeIndex}`;
      this.$loading.show();
      getDoingSubmitApi(customizeUnitCode, params).then((res) => {
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
    // 删除单据
    deleteOrder() {
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.dialog.confirm({
        content: this.$T("hzero.c7nProUI.DataSet.delete_all_row_confirm").$D("确认删除所有行"),
        okText: this.$T("hipspfm.common.button.confirm").$D("确认"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable:false,
        // eslint-disable-next-line no-unused-vars
        onOk: (tx) => {
          // eslint-disable-next-line consistent-this
          const _this = this;
          const params = {
            ..._this.headInfo,
            sinvRcvTrxLineDTOS:_this.lineInfo
          };
          _this.$loading.show();
          getDoingDeleteApi(params).then((res) => {
            _this.$loading.hide();
            if (res && !res.failed && !res.error) {
              _this.$notification.open({
                message: _this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
                description: "",
                class: "notification",
              });
              _this.goBack();
            }
          });
        },
        // eslint-disable-next-line no-unused-vars
        onCancel(tx) {

        },
      });

    },
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.content {
  height: calc(100vh - 44px);
  overflow: auto;

  .head-lin {
    font-size: 14px;
    line-height: 20px;
    padding-bottom: 4px;

    .head-tip {
      width: 34px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      font-size: 10px;
      line-height: 12px;
      padding: 4px 6px;
      margin: 4px 0;
    }
  }

  .info {
    background: #f0f2f5;
    min-height: calc(100% - 88px);
    padding-bottom: 160px;

    .card {
      margin-bottom: 4px;
      position: relative;
      width: 100vw;
      background: var(--color-bg-default);

      .code-type {
        height: 16px;
        margin-right: 8px;
        padding: 2px;
        background: #eff3fe;
        border-radius: 2px;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        color: #276ef1;
        line-height: 12px;
      }

      ul {
        padding: 0 15px 12px 15px;

        li {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 14px;
          color: #1B1E2B;

          // &:nth-child(2) span {
          //   line-height: 22px;

          //   &:nth-child(1) {
          //     width: 224px;
          //   }
          // }

          span {
            display: inline-block;
            line-height: 20px;
          }
        }

        .card-b {
          span {
            flex: 1;
          }
        }

        .can-edit {
          width: 353px;
          height: 28px;
          background: #eff3fe;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          left: -4px;

          span {
            margin-left: 4px;
            flex: 1;
            display: flex;
            align-items: center;
          }

          img {
            width: 20px;
            height: 20px;
            margin-right: 4px;
          }
        }

        .code {
          font-weight: bold;
          margin-top: 0px;
          padding-top: 12px;
          // margin-left: 25px;

          .code-span-type {
            color: var(--color-other-default-b);
          }

          span {
            display: flex;
            align-items: center;
          }
        }

        .code-before:before {
          content: '';
          width: 7px;
          height: 10px;
          background: #276ef1;
          position: absolute;
          top: 16px;
          left: 0;
        }

        .code-before {
          margin-left: 0;
        }
      }

      .card-bottom {
        padding: 0px 15px 16px 11px;
        display: flex;
        align-items: center;
        justify-content: center;

        .card-btn {
          background: var(--color-other-default-b);
          border-radius: 14px;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          color: var(--color-font-default-d);
          line-height: 16px;
          padding: 6px 24px;
        }
      }
    }

    .head-card {
      margin-bottom: 12px;

      .remark {
        overflow: hidden;
        border-top 1px solid #f6f6f6
      }

      .line-title {
        margin: 16px 15px 8px 15px;
        font-size: 12px;
        text-align: left;
        color: var(--color-font-default-b);
        line-height: 16px;
      }

      .line-text {
        margin: 0 15px 16px 15px;
        height: 64px;
        background: var(--color-bg-default-b);
        border-radius: 8px;
        position: relative;

        >>> .hips-textarea {
          position: static;
          background-color: var(--color-bg-default-b) !important;
          padding: 0 !important;
          border-radius 4px

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
          border-radius 4px

          textarea {
            width: 289px !important;
            height: 40px !important;
            font-size: 14px !important;
            color: #333333 !important;
            line-height: 20px !important;
          }
        }

        .text-img {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 20px;
          height: 20px;
        }

        .text-img-edit {
          top: 12px;
        }
      }
    }

    .line-card {
      width: 100%;
      padding: 10px 15px;
      font-weight: bold;
      background: var(--color-bg-default);
      border-bottom: 1px solid var(--color-bg-default-b);
      font-size: 12px;
      line-height: 16px;
    }
  }

  .li-input {
    flex-grow: 1;
    border: 0;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
  }
}

.bottom-btn {
  position: fixed;
  background: var(--color-bg-default);
  width: 100%;
  bottom: 0;
  padding: 12px 15px;
  padding-bottom: calc(12px + constant(safe-area-inset-bottom));
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;

  .delete-btn {
    width: 40px;
    height: 40px;
  }

  .btn-group {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn-span {
      width: 133px;
      height: 48px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: var(--color-other-default-b);
      line-height: 48px;
      background: #eff3fe;
      border-radius: 24px;
    }

    .submit-btn {
      background: var(--color-other-default-b);
      margin-left: 20px;
      color: var(--color-font-default-d);
    }
  }
}
</style>
