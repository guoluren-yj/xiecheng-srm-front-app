<template>
  <div style="width: 100%;height: 100vh;">
    <div class="content" style="height: 100%;width: 100%;overflow: scroll;">
      <customize-detail ref="inputView" :columns="columns" :data-source="info" style="padding: 0px 15px 150px 15px;"/>
    </div>
    <div class="supplier-confirm">
      <srm-button style="width: 100%;" size="x-large" fill @click="clickCheck">
        {{ $T("hipspfm.common.button.inspection").$D("查验") }}
      </srm-button>
    </div>
  </div>
</template>

<script>
import {
  saveInvoiceApi,
  checkInvoiceApi,
  getInvoiceListApi
} from "../api/index";
export default {
  modules: [ "sfin.invoiceBill", "hipspfm.common", "sfin.inputInvoice", "hipspfm.invoiceInspection", "sfin.invoiceVerification", "sfin.invoiceInspection" ],
  name: "ManualEntry",
  components: {
  },
  data() {
    return {
      info: {
        companyName: "",
        companyId: "",
        invoiceCode: "",
        invoiceNumber: "",
        billingDate: "",
        totalAmount: null,
        checkCode: null,
      },
      flag: false, //10位发票代码不可输校验码
      comfirmOrderList: [],
      unModifyParams: [], //未修改过的数据
      ModifyParams: [],
      ModifyOrderList: [],
      supplierLoading: false
    };
  },
  computed: {
    columns() {
      return [ {
        fieldType: "INPUT_NUMBER",
        fieldName: this.$T("sfin.inputInvoice.model.invoiceCode").$D("发票代码"),
        fieldCode: "invoiceCode",
        // placeholder: this.$T("sfin.invoiceVerification.verify.TenOrTwelveLengthOnly").$D("长度只能为10或12位数字"),
        required: true,
        // validator: (val) => {
        //   if (String(val).length === 10 || String(val).length === 12) {
        //     return null;
        //   }
        //   return this.$T("sfin.invoiceVerification.verify.TenOrTwelveLengthOnly").$D("长度只能为10或12位数字");
        // },
        inputChange: (nVal) => {
          if (!nVal) {
            return;
          }
          if (nVal.length === 10) {
            this.flag = false;
          } else if (nVal.length === 12) {
            this.flag = true;
          }
        }
      }, {
        fieldType: "INPUT_NUMBER",
        fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceNum").$D("税务发票号码"),
        fieldCode: "invoiceNumber",
        required: true,
        // placeholder: this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits").$D("长度只能为8位数字"),
        // validator: (val) => {
        //   if (String(val).length !== 8) {
        //     return this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits").$D("长度只能为8位数字");
        //   }
        //   return null;
        // },
      }, {
        fieldType: "DATE",
        fieldName: this.$T("sfin.invoiceInspection.model.billingDate").$D("开票日期"),
        fieldCode: "billingDate",
        placeholder: this.$T("hipspfm.invoiceInspection.view.message.selectBillingDate").$D("请选择开票日期"),
        required: true,
      }, {
        fieldType: "LOV",
        fieldName: this.$T("sfin.inputInvoice.model.purchaser").$D("购买方"),
        fieldCode: "companyId",
        displayField: "companyName",
        placeholder: this.$T("hipspfm.invoiceInspection.view.message.selectPurchaser").$D("请选择购买方"),
        required: true,
        lovCode: "SFIN.USER_AUTH.COMPANY",
      }, {
        fieldType: "INPUT_NUMBER",
        fieldName: this.$T("sfin.invoiceVerification.model.totalPrice").$D("不含税金额"),
        fieldCode: "totalAmount",
        placeholder: this.$T("hipspfm.invoiceInspection.view.message.handlerTotalPrice").$D("请输入不含税金额"),
        required: !this.flag,
        // disabled: this.flag,
        precision: 2,
      }, this.flag ? {
        fieldType: "INPUT",
        fieldName: this.$T("sfin.invoiceInspection.model.validateCode").$D("校验码"),
        fieldCode: "checkCode",
        placeholder: this.$T("sfin.inputInvoice.model.checkCodeWarning").$D("多位时请输入后6位即可"),
        required: this.flag,
        disabled: !this.flag,
        // validator: (val) => {
        //   if (String(val).length !== 6) {
        //     return this.$T("sfin.invoiceBill.verify.theLengthCanOnlyBeSixDigits").$D("长度只能为6位数字");
        //   }
        //   return null;
        // },
      } : null, ];
    },
  },
  watch: {
  },
  mounted() {},
  methods: {
    // 点击查验
    clickCheck() {
      if (!this.$refs.inputView.validate()) {
        return;
      }
      // eslint-disable-next-line consistent-this
      const self = this;
      this.$hips.dialog.confirm({
        content:
          this.$T("sfin.invoiceBill.validation.isInvoiceCheck").$D(
            "是否进行发票查验"
          ) + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          self.comfirmInvoice();
        }
      });
    },
    comfirmInvoice() {
      this.ModifyParams = [
        {
          invoiceCode: this.info.invoiceCode,
          invoiceNumber: this.info.invoiceNumber,
          billingDate: this.info.billingDate,
          companyId: this.info.companyId,
          totalAmount: this.info.totalAmount,
          checkCode: this.info.checkCode
        }
      ];
      //检查输入格式
      // let invoiceCodeLen = JSON.stringify(this.info.invoiceCode).length - 2;
      // let invoiceNumLen = JSON.stringify(this.info.invoiceNumber).length - 2;
      if (!this.info.invoiceCode) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.handlerLenInvoiceCodeValue"
          ).$D("请输入发票代码"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      } else if (!this.info.invoiceNumber) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.handlerLenInvoiceNumValue"
          ).$D("请输入税务发票号码"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      } else if (!this.info.totalAmount && !this.flag) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.handlerTotalPrice"
          ).$D("请输入不含税金额"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      } else if (!this.info.companyName) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.selectPurchaser"
          ).$D("请选择购买方"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      } else if ( //如果没有修改数据就直接查验发票，如果有修改，则保存再查验
        JSON.stringify(this.unModifyParams) ===
        JSON.stringify(this.ModifyParams)
      ) {
        this.checkInvoice(this.comfirmOrderList);
      } else {
        this.ModifyOrderList = [
          { ...this.comfirmOrderList[0], ...this.ModifyParams[0] }
        ];
        this.saveInvoice();
      }
    },
    //保存并查验发票
    saveInvoice() {
      saveInvoiceApi(this.ModifyOrderList).then((resA) => {
        if (resA.failed) {
          this.$notification.open({
            message: resA.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
        } else {
          this.checkInvoice(resA);
        }
      });
    },
    //查验发票
    checkInvoice(resA) {
      checkInvoiceApi(resA).then((resB) => {
        if (resB.failed) {
          this.$notification.open({
            message: resB.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.$router.push({ name: "InvoiceExceptionList" });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.reNewList();
        }
      });
    },
    //回调刷新数据
    reNewList() {
      const params = {
        page: 0,
        size: 10,
        invoiceCode: this.info.invoiceCode, //发票代码
        invoiceNumber: this.info.invoiceNumber //发票号码
      };
      getInvoiceListApi(params).then((resC) => {
        if (!(resC && resC.content && resC.content[0])) {
          return;
        }
        this.comfirmOrderList = resC.content;
        this.unModifyParams = [
          {
            invoiceCode: resC.content[0].invoiceCode,
            invoiceNumber: resC.content[0].invoiceNumber,
            billingDate: resC.content[0].billingDate ?
              resC.content[0].billingDate :
              "",
            companyId: resC.content[0].companyId,
            totalAmount: resC.content[0].totalAmount,
            checkCode: resC.content[0].checkCode
          }
        ];
        this.info.invoiceCode = resC.content[0].invoiceCode;
        this.info.invoiceNumber = resC.content[0].invoiceNumber,
        this.info.billingDate = resC.content[0].billingDate,
        this.info.companyId = resC.content[0].companyId,
        this.info.totalAmount = resC.content[0].totalAmount,
        this.info.checkCode = resC.content[0].checkCode;
        this.ModifyOrderList = [
          { ...this.comfirmOrderList[0], ...this.ModifyParams[0] }
        ];
        if (resC.content[0].validateStatusCode === "CHECK_SUCCESS") {
          this.$router.push({ name: "InvoiceSuccessList" });
        } else {
          this.$router.push({ name: "InvoiceExceptionList" });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.supplier-confirm {
  width: 100%;
  line-height: 69px;
  height: calc(69px + constant(safe-area-inset-bottom));
  height: calc(69px + env(safe-area-inset-bottom));
  font-size: 18px;
  background: white;
  box-shadow: 0 -2px 12px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 15px;
}

</style>
