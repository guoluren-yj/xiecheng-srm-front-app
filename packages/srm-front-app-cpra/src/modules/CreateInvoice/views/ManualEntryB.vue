<template>
  <div style="height: 100vh; overflow: auto">
    <div class="main-info">
      <div style="height: 100%; overflow: auto;background:#fff">
        <customize-detail
          ref="customize"
          :need-padding="true"
          code="SMBL.CREATE.RECEIVEABLE.INVOICE.MANUAL_ENTRY"
          :data-source="detailInfo"
          :columns="getOrderDetailInfoColumns"/>
      </div>
    </div>
    <srm-bottom-handler
      :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import { taxInvoiceLinesSaveApi } from "../api/index";
export default {
  modules: [ "sodr.sendOrder", "hzero.common", "spuc.common", "sodr.confirmOrder", "hipspfm.common", "sodr.common", "hipspfm.orderConfirmation", "ssrc.inquiryHall", "hipspfm.invoiceBill", "sfin.invoiceBill", "sfin.common", "sfin.supplierChargeEntry", "hipspfm.createInvoice", "hipspfm.invoiceInspection", "sfin.inputInvoice", "sfin.invoiceVerification", "sfin.invoiceInspection", "smbl.common" ],
  name: "ManualEntryB",
  components: {
  },
  beforeRouteLeave(to, from, next) {
    this.back(next);
  },
  data() {
    return {
      detailInfo:{},
      invoiceHeaderId:"",
      leaveFlag:true,
      token: null,
      objectVersionNumber: null,
    };
  },
  computed: {
    // 税务发票行手工录入
    getOrderDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sfin.inputInvoice.model.invoiceCode").$D("发票代码"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "invoiceCode",
          // placeholder:this.$T("sfin.invoiceVerification.verify.TenOrTwelveLengthOnly").$D("长度只能为10或12位数字"),
          required:(_, item) => {
            const { noDepositInvoiceTypeCode } = item;
            return ![ "18", "19" ].includes(noDepositInvoiceTypeCode);
          },
          inputChange:this.debounce(),
          // validator: (val) => {
          //   if (val.length !== 10 && val.length !== 12) {
          //     return this.$T("sfin.invoiceVerification.view.message.validation.onlyTenOrTwelveDigitsInLength").$D("长度只能为10或12位数字");
          //   }
          // },
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceNum").$D("税务发票号码"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "invoiceNumber",
          // placeholder:this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits").$D("长度只能为8位数字"),
          required:true,
          inputChange:this.debounce(),
          // validator: (val) => {
          //   if (val.length !== 8) {
          //     return this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeEightDigits").$D("长度只能为8位数字");
          //   }
          // },
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期"),
          fieldCode: "billingDate",
          fieldType:"DATE_PICKER",
          required:true,
          inputChange:this.debounce(),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.category").$D("发票种类"),
          fieldType: "SELECT",
          lovCode:"SPUC.INVOICE_TYPE",
          fieldCode: "noDepositInvoiceTypeCode",
          displayField:"noDepositInvoiceTypeMeaning",
          required:true,
          inputChange:this.debounce(),
        },
        {
          fieldName: this.$T("sfin.invoiceVerification.model.invoiceDirection").$D("发票方向"),
          fieldType: "SELECT",
          lovCode:"SPUC.INVOICE_DIRECTION",
          fieldCode: "invoiceDirection",
          displayField:"invoiceDirectionMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceVerification.model.totalPrice").$D("不含税金额"),
          fieldCode: "totalAmount",
          fieldType: "INPUT_NUMBER",
          required:true,
          editor: true,
          editLimit:true,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          inputChange:(val, record) => {
            record.taxIncludedAmount = this.calculation("add", Number(val), Number(record.taxAmount ? record.taxAmount : 0));
          }
        },
        {
          fieldName: this.$T("sfin.invoiceVerification.model.taxAmount").$D("税额"),
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          required:true,
          editor: true,
          editLimit:true,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
          inputChange:(val, record) => {
            record.taxIncludedAmount = this.calculation("add", Number(val), Number(record.taxAmount ? record.totalAmount : 0));
          }
        },
        {
          fieldName: this.$T("sfin.invoiceVerification.model.taxIncludedAmount").$D("含税金额"),
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          editor:false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceInspection.model.validateCode").$D("校验码"),
          fieldCode: "checkCode",
          fieldType: "INPUT",
          placeholder:this.$T("sfin.invoiceVerification.view.message.validation.checkCodeWarning").$D("多位时请输入后6位即可"),
          validator: (val) => {
            if (val && !/^[a-zA-Z\d]+$/.test(val)) {
              return this.$T("sfin.invoiceVerification.view.message.validation.theLengthCanOnlyBeDigitsOrLetter").$D("校验码只能为数字或字母");
            }
          },
        },
      ];
      return columns;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("hipspfm.common.button.cancel").$D(
            "取消"
          ),
          // eslint-disable-next-line no-return-assign
          handler: () => this.$router.back(),
        },
        {
          type:"success",
          title: this.$T("hipspfm.common.button.save").$D(
            "保存"
          ),
          // eslint-disable-next-line no-return-assign
          handler:  this.saveInvoice,
        },
      ];
    },
  },
  async mounted() {
    this.invoiceHeaderId = this.$route.query.invoiceHeaderId;
    this.detailInfo = this.$route.query;
  },
  methods: {
    saveInvoice() {
      if (!this.$refs.customize.validate()) {
        return;
      }
      const invoiceLines = [ { ...this.detailInfo, objectVersionNumber: null, _token: this.token, tenantId: Number(window.localStorage.getItem("organizationId")) } ];
      this.$loading.show({
        text: this.$T("hipspfm.invoiceInspection.view.message.saving").$D(
          "保存中"
        )
      });
      taxInvoiceLinesSaveApi(this.invoiceHeaderId, invoiceLines).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.dialog.alert({
            title: this.$T("hipspfm.common.message.operationFailed").$D(
              "操作失败"
            ),
            content: res.message,
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
            onOk() {}
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            key,
            class: "notification",
            duration: 3
          });
          // eslint-disable-next-line consistent-this
          const _this = this;
          setTimeout(() => {
            _this.$router.back();
          }, 1000);
          _this.leaveFlag = false;
        }
      });
    },
    // 返回提示
    back(next) {
      const { invoiceCode, invoiceNumber, billingDate, checkCode, totalAmount } = this.detailInfo;
      if (this.leaveFlag) {
        if (
          invoiceCode ||
          invoiceNumber ||
          billingDate ||
          checkCode ||
          totalAmount
        ) {
          this.$hips.dialog.confirm({
            title: "",
            content: this.$T("hipspfm.createInvoice.validation.message.pleaseSave").$D("您还有未保存的内容是否保存") + "?",
            okText: this.$T("hipspfm.common.button.save").$D("保存"),
            cancelText: this.$T("hipspfm.common.button.noSave").$D("不保存"),
            closable: false,
            onOk: () => {
              // eslint-disable-next-line consistent-this
              const _this = this;
              new Promise(function(resolve) {
                _this.saveInvoice();
                resolve(_this.$T("smbl.common.view.message.success").$D("成功"));
              }).then(() => {
                next();
              });
            },
            onCancel() {
              // on cancel
              next();
            }
          });
        } else {
          next();
        }
      } else {
        next();
      }
    },
    //输入防抖函数
    debounce() {
      let timer = null;
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          if (!this.$refs.customize.validate()) {
            return;
          }
        }, 500);
      };
    },
    //解决js小数加减法精度缺失问题
    calculation(type, num1, num2) {

      let temp1, temp2, a;
      try {
        // 获取temp1小数点后的长度
        temp1 = num1.toString().split(".")[1].length;
      } catch (e) {
        temp1 = 0;
      }
      try {
        // 获取temp2小数点后的长度
        temp2 = num2.toString().split(".")[1].length;
      } catch (e) {
        temp2 = 0;
      }
      // Math.max(temp1, temp2) 为了获取temp1和temp2两个值中较大的一个
      // Math.pow(a,b) 表示 a 的 b 次方
      a = Math.pow(10, Math.max(temp1, temp2));

      // 计算的方式是先将所有的小数乘为整数，待加减运算执行完之后再除去对应的 a 的值，将其变为小数输出
      // 先判断执行的方式是否是加法，不是的话则执行减法运算
      return type === "add" ? (num1 * a + num2 * a) / a : (num1 * a - num2 * a) / a;
    }
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
>>> .customize-detail{
    padding: 0px 15px 10px 15px !important;
    .label{
      font-size:14px !important;
    }
  }
>>> .srm-date-placeholder,.srm-input-placeholder{
  font-size:14px !important;
}

</style>
