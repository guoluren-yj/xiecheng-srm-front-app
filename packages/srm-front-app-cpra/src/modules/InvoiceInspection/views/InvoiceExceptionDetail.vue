<template>
  <div style="height: 100vh;width: 100%;">
    <div class="content" style="height: 100%;">
      <div class="message">
        <div :class="{success,failed}">{{ info.validateStatusCodeMeaning }}</div>
      </div>
      <div style="height: calc(100% - 30px); width: 100%;overflow: scroll;">
        <customize-detail ref="inputView" :columns="columns" :data-source="info" style="padding: 0px 15px 150px 15px;"/>
      </div>
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
import { SrmUtil } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.invoiceInspection", "sfin.invoiceBill", "hipspfm.common", "sfin.inputInvoice", "sfin.invoiceVerification", "sfin.invoiceInspection" ],
  name: "InvoiceDetail",
  components: {
  },
  data() {
    return {
      success: true, //查验成功样式
      failed: false, //查验失败样式
      info: {
        invoiceCode: "",
        invoiceNumber: "",
        billingDate: "",
        totalAmount: null,
        companyName: "",
        companyId: "",
        checkCode: null,
        checkTime: "",
        validateMessage: "",
        inputTypeCode: "",
        inputTypeCodeMeaning: "",
        validateStatusCodeMeaning: "",
        srmInvoiceNum: "",
      },
      comfirmOrderList: [],
      unModifyParams: [], //未修改过的数据
      ModifyParams: [],
      ModifyOrderList: [],
      flag: false, //10位发票代码不可输校验码
      previewImg: "",
      editable: true,
    };
  },
  computed: {
    columns() {
      return [ {
        fieldType: "INPUT_NUMBER",
        fieldName: this.$T("sfin.inputInvoice.model.invoiceCode").$D("发票代码"),
        fieldCode: "invoiceCode",
        required: this.editable,
        disabled: !this.editable,
        // placeholder: this.$T("sfin.invoiceVerification.verify.TenOrTwelveLengthOnly").$D("长度只能为10或12位数字"),
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
        fieldName: this.$T("sfin.inputInvoice.model.invoiceNumber").$D("发票号码"),
        fieldCode: "invoiceNumber",
        required: this.editable,
        disabled: !this.editable,
        // placeholder: this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits").$D("长度只能为8位数字"),
        // validator: (val) => {
        //   if (String(val).length !== 8) {
        //     return this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits").$D("长度只能为8位数字");
        //   }
        //   return null;
        // },
      }, {
        fieldType: "DATE",
        fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.billingDate").$D("开票日期"),
        fieldCode: "billingDate",
        required: this.editable,
        disabled: !this.editable,
      }, {
        fieldType: "LOV",
        fieldName: this.$T("sfin.inputInvoice.model.purchaser").$D("购买方"),
        fieldCode: "companyId",
        displayField: "companyName",
        required: this.editable,
        disabled: !this.editable,
        lovCode: "SFIN.USER_AUTH.COMPANY",
        options: {
          queryParams: {
            page: 0,
            size: 10,
            enabledFlag: 1,
            companyName: "",
            tenantId: window.localStorage.tenantId
          }
        }
      }, {
        fieldType: "INPUT_NUMBER",
        fieldName: this.$T("sfin.invoiceVerification.model.totalPrice").$D("不含税金额"),
        fieldCode: "totalAmount",
        required: !this.flag,
        disabled: !this.editable,
        // required: !this.flag,
        // disabled: this.flag || !this.editable,
        placeholder: this.$T("hipspfm.invoiceInspection.view.message.handlerTotalPrice").$D("请输入不含税金额"),
        precision: 2,
      }, this.flag ? {
        fieldType: "INPUT",
        fieldName: this.$T("sfin.invoiceInspection.model.validateCode").$D("校验码"),
        fieldCode: "checkCode",
        required: this.flag,
        disabled: !this.flag || !this.editable,
        placeholder: this.$T("sfin.inputInvoice.model.checkCodeWarning").$D("多位时请输入后6位即可"),
      } : null, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceInspection.model.inspectionTime").$D("查验时间"),
        fieldCode: "checkTime",
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceVerification.model.validateMessage").$D("状态说明"),
        fieldCode: "validateMessage",
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.inputInvoice.model.srmInvoiceNum").$D("srm发票号"),
        fieldCode: "srmInvoiceNum",
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceVerification.model.inputTypeCodeMeaning").$D("录入方式"),
        fieldCode: "inputTypeCodeMeaning",
        render: (val, item) => <div>
          {item.inputTypeCode === "OCR" ? <span style="color: var(--color-other-default-b)" onClick={(e) => {
            e.stopPropagation();
            this.showImg();
          }}>{val}</span> : <span>{val}</span>}
        </div>
      } ];
    },
  },
  watch: {
  },
  mounted() {
    this.comfirmOrderList.push(this.$route.query);
    let prefix = this.$route.query;
    this.flag = (prefix.invoiceCode || "").length === 12;
    Object.assign(this.info, prefix);
    this.unModifyParams = [
      {
        invoiceCode: this.info.invoiceCode,
        invoiceNumber: this.info.invoiceNumber,
        billingDate: this.info.billingDate || "",
        companyId: this.info.companyId,
        companyName: this.info.companyName,
        totalAmount: this.info.totalAmount,
        checkCode: this.info.checkCode
      }
    ];
    const srmTaxInvoiceMap = prefix.srmTaxInvoiceMap;
    this.invoiceNum = srmTaxInvoiceMap && srmTaxInvoiceMap[0].invoiceNum;

    if (this.info.validateStatusCodeMeaning === this.$T("hipspfm.invoiceInspection.view.message.checkFailed").$D("查验失败")) {
      this.failed = true;
      this.success = false;
    }
    if (
      this.info.inputTypeCodeMeaning ===
      this.$T("hipspfm.invoiceInspection.view.message.scanIEntry").$D(
        "扫描录入"
      )
    ) {
      this.editable = false;
    }
    this.previewImg = this.buildImgUrl(prefix.ocrFileUrl);
  },
  methods: {
    // 点击查验
    clickCheck() {
      if (!this.$refs.inputView.validate()) {
        return;
      }
      // eslint-disable-next-line consistent-this
      const self = this;
      // eslint-disable-next-line rulesdir/no_hips
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
    // 确认查验
    comfirmInvoice() {
      this.ModifyParams = [
        {
          invoiceCode: this.info.invoiceCode,
          billingDate: this.info.billingDate || "",
          companyId: this.info.companyId,
          companyName: this.info.companyName,
          totalAmount: this.info.totalAmount,
          checkCode: this.info.checkCode,
        }
      ];
      //检查输入格式
      if (!this.info.invoiceCode) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.invoiceCode"
          ).$D("请输入发票代码"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      } else if (!this.info.invoiceNumber) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.invoiceNumber"
          ).$D("请输入发票号"),
          // eslint-disable-next-line no-undef
          key,
          class: "notification",
          duration: 3
        });
      } else if (!this.info.companyId) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.invoiceInspection.view.message.handlerCompanyId"
          ).$D("请输入采购方"),
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
      } else if (
        JSON.stringify(this.unModifyParams) ===
        JSON.stringify(this.ModifyParams)
      ) {
      // 如果没有修改数据就直接查验发票，如果有修改，则保存再查验
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
      this.$loading.show({
        text: this.$T("hipspfm.invoiceInspection.view.message.saving").$D(
          "保存中"
        )
      });
      saveInvoiceApi(this.ModifyOrderList).then((resA) => {
        this.$loading.hide();
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
    checkInvoice(InvoiceData) {
      // eslint-disable-next-line consistent-this
      const self = this;
      this.$loading.show({
        text: this.$T("hipspfm.invoiceInspection.view.message.checking").$D(
          "查验中"
        )
      });
      checkInvoiceApi(InvoiceData).then((resB) => {
        this.$loading.hide();
        if (resB.failed) {
          this.$notification.open({
            message: resB.message,
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
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
        }
        self.reNewList();
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
        // this.invoiceCode = resC.content[0].invoiceCode;
        // this.invoiceNumber = resC.content[0].invoiceNumber,
        // this.billingDate = resC.content[0].billingDate,
        // this.companyId = resC.content[0].companyId,
        // this.totalAmount = resC.content[0].totalAmount,
        // this.checkCode = resC.content[0].checkCode,
        // this.checkTime = resC.content[0].checkTime;
        // this.validateMessage = resC.content[0].validateMessage,
        // this.invoiceNum =
        //     resC.content[0].srmTaxInvoiceMap &&
        //     resC.content[0].srmTaxInvoiceMap.invoiceNum;
        // this.validateStatusCodeMeaning =
        //   resC.content[0].validateStatusCodeMeaning;
        Object.assign(this.info, resC.content[0]);

        this.ModifyOrderList = [
          { ...this.comfirmOrderList[0], ...this.ModifyParams[0] }
        ];
        if (resC.content[0].validateStatusCode === "CHECK_SUCCESS") {
          this.success = true;
          this.failed = false;
          setTimeout(() => {
            this.$router.push({ name: "InvoiceSuccessList" });
          }, 1000);
        } else {
          this.success = false;
          this.failed = true;
          setTimeout(() => {
            this.$router.push({ name: "InvoiceExceptionList" });
          }, 1000);
        }
      });
    },
    showImg() {
      this.previewImg = this.buildImgUrl(
        this.$route.query.ocrFileUrl,
        SrmUtil.getDefaultBucketName()
      );
      this.$previewImage([ this.previewImg ]);
    }
  }
};
</script>

<style lang="stylus" scoped>

.content {
  .message {
    font-size: 12px;
    text-align: center;

    .failed {
      background:var(--color-bg-default-e);
      color: var(--color-other-default);
      height: 30px;
      line-height: 30px;
    }

    .success {
      background:var(--color-bg-default-c);
      color: var(--color-other-default-b);
      height: 30px;
      line-height: 30px;
    }
  }
}

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
