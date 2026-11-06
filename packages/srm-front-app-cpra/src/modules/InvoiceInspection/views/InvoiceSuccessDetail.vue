<template>
  <div style="width: 100%; height: 100vh;">
    <div class="content" style="height: 100%;">
      <div class="message">
        <div :class="{success,failed}">{{ info.validateStatusCodeMeaning }}</div>
      </div>
      <div style="height: calc(100% - 30px); width: 100%;overflow: scroll;">
        <customize-detail :columns="columns" :data-source="info" style="padding: 0px 15px 150px 15px;"/>
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
import { checkInvoiceApi, getInvoiceListApi } from "../api/index";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "sfin.invoiceBill", "hipspfm.common", "hipspfm.invoiceInspection", "sfin.inputInvoice", "sfin.invoiceVerification", "sfin.invoiceInspection", "smbl.common" ],
  name: "InvoiceSuccessDetail",
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
        checkCode: null,
        validateMessage: "",
        srmInvoiceNum: "",
        inputTypeCode: "",
        inputTypeCodeMeaning: "",
        checkTime: "",
        validateStatusCodeMeaning: "",
      },
      comfirmOrderList: [],
      previewImg: ""
    };
  },
  computed: {
    columns() {
      return [ {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.inputInvoice.model.invoiceCode").$D("发票代码"),
        fieldCode: "invoiceCode",
        required: true,
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.inputInvoice.model.invoiceNumber").$D("发票号码"),
        fieldCode: "invoiceNumber",
        required: true,
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.billingDate").$D("开票日期"),
        fieldCode: "billingDate",
        required: true,
        render: (val) => {
          let vals = val.split(" ");
          if (vals.length > 0) {
            return vals[0];
          }
          return val;
        },
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.inputInvoice.model.purchaser").$D("购买方"),
        fieldCode: "companyName",
        required: true,
      }, {
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: this.$T("sfin.invoiceVerification.model.totalPrice").$D("不含税金额"),
        fieldCode: "totalAmount",
        precision: 2,
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceInspection.model.validateCode").$D("校验码"),
        fieldCode: "checkCode",
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceInspection.model.inspectionTime").$D("查验时间"),
        fieldCode: "checkTime",
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceVerification.model.validateMessage").$D("状态说明"),
        fieldCode: "validateMessage",
        render: (val) => val || this.$T("smbl.common.view.none").$D("无")
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.inputInvoice.model.srmInvoiceNum").$D("srm发票号"),
        fieldCode: "srmInvoiceNum",
      }, {
        fieldType: "TEXT",
        fieldName: this.$T("sfin.invoiceVerification.model.inputTypeCodeMeaning").$D("录入方式"),
        fieldCode: "inputTypeCode",
        render: (val) => <div>
          {val === "OCR" ? <span style="color: var(--color-other-default-b)" onClick={(e) => {
            e.stopPropagation();
            this.showImg();
          }}>{this.info.inputTypeCodeMeaning}</span> : <span>{this.info.inputTypeCodeMeaning}</span>}
        </div>
      }, ];
    }
  },
  mounted() {
    Object.assign(this.info, this.$route.query);
    this.comfirmOrderList.push(this.$route.query);
  },
  methods: {
    // 点击查验
    clickCheck() {
      // eslint-disable-next-line consistent-this
      const self = this;
      this.$dialog({
        content: this.$T("sfin.invoiceBill.validation.isInvoiceCheck").$D("是否进行发票查验") + "？",
        onOk() {
          self.checkInvoice();
        }
      });
    },
    // 确认保存并查验
    checkInvoice() {
      const params = {
        page: 0,
        size: 10,
        invoiceCode: this.info.invoiceCode, //发票代码
        validateStatusCode: "CHECK_SUCCESS",
        checkedFlag: 1
      };
      this.$loading.show();
      checkInvoiceApi(this.comfirmOrderList).then((resA) => {
        if (resA.failed) {
          this.$notification.open({
            message: resA.message,
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
          //回调刷新数据
          getInvoiceListApi(params).then((resB) => {
            this.comfirmOrderList = resB.content;
          });
        }
      }).finally(() => this.$loading.hide());
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
      background: var(--color-bg-default-e);
      color: var(--color-other-default);
      height: 30px;
      line-height: 30px;
    }

    .success {
      background: var(--color-bg-default-c);
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
