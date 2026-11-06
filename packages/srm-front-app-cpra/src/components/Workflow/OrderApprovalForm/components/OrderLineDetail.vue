<template>
  <hips-popup
    v-model="showLineDetail"
    class="FullPop"
    style="height: 100%; width: 100%"
    position="bottom">
    <div class="orderLineDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/Comp/icon_navigationbars_off_normal@3x.png" >
        </div>
        <div slot="center" class="header">
          {{
            $T("hipspfm.orderApproval.view.message.title.orderDetail").$D(
              "订单详情"
            )
          }}
        </div>
      </hips-nav-bar>
      <div class="card-personalized">
        <!-- 个性化组件替换后的代码 -->
        <customize-detail
          :columns="getColumns"
          :data-source="lineInfoDetail"
          code="SMBL.WORKFLOW.ORDER_APPROVAL.LINE_DETAIL"/>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, NavBar, Input, Popup } from "hips";
import BigNumber from "bignumber.js";
import { SrmUtil } from "srm-mobile-ui";
import { getDynamicLabel } from "../../../../utils";

export default {
  modules: [ "hipspfm.common", "hipspfm.orderApproval", "sodr.orderApproval", "sinv.common", "smbl.common", "sodr.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench", "slod.deliveryWorkbench", "slod.common" ],
  name: "OrderLineDetail",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    lineInfoDetail: {
      type: Object
    },
    showFilePop: {
      type: Function
    },
    isDoubleUnit:{
      type: Boolean
    },
    renderChangeTip: {
      type: Function
    }
  },
  data() {
    return {};
  },
  computed: {
    showLineDetail: {
      get() {
        return this.value;
      },
      // eslint-disable-next-line no-unused-vars
      set(val) {}
    },
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("sodr.orderApproval.model.common.displayLineNum").$D("行号"),
          fieldCode: "lineNum",
          render:(val, item) => item.displayLineNum,
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.shipmentNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.description").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldCode: "invOrganizationName",
          fieldName: this.$T(
            "sodr.common.model.common.invOrganizationName"
          ).$D("收货组织"),
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          },
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.orderApproval.model.common.unit").$D("单位"),
          fieldCode: "secondaryUomCodeAndName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          }
        },
        this.isDoubleUnit && {
          fieldName: this.$T("sodr.orderApproval.model.common.quantity").$D(
            "数量"
          ),
          fieldCode: "secondaryQuantity",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          }
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "uom"),
          fieldCode: "uomCodeAndName",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          }
        },
        {
          fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
          fieldCode: "quantity",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          }
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.taxedEnteredUnitPrice"
          ).$D("原币含税单价"),
          fieldCode: "enteredTaxIncludedPrice",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          }
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.taxedLineAmount"
          ).$D("含税行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val, record, field) => {
            let precision;
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              precision = Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
            const dom = SrmUtil.getNumberPrecision(
              new BigNumber(val),
              precision
            );
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          }
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.unitPrice").$D(
            "不含税单价"
          ),
          fieldCode: "unitPrice",
          render: (val, record, field) => {
            const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          }
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.lineAmount").$D(
            "不含税行金额"
          ),
          fieldCode: "lineAmount",
          render: (val, record, field) => {
            let precision;
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag =
              record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag =
              record.sourceCode === "SAP" &&
              record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              precision = Number(
                this.$options.filters.calcCurrencyPrecision(
                  record.currencyCode,
                  "financialPrecision"
                )
              );
            }
            const dom = SrmUtil.getNumberPrecision(
              new BigNumber(val),
              precision
            );
            if (val && val !== 0) {
              return this.renderChangeTip(field, record, dom);
            }
          }
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.taxRate").$D(
            "税率"
          ),
          fieldCode: "taxRate",
          render: (val, item, field) => val ? this.renderChangeTip(field, item, val) : "0"
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.currencyName").$D(
            "币种"
          ),
          fieldCode: "currencyCode",
          render: (val, item, field) => {
            const dom = val;
            return this.renderChangeTip(field, item, dom);
          }
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.needByDate").$D(
            "需求日期"
          ),
          fieldCode: "needByDate",
          render: (val, item, field) => {
            // eslint-disable-next-line new-cap
            const dom = this.$options.filters["CalcDate"](val);
            return this.renderChangeTip(field, item, dom);
          }
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.committedDeliveryDate"
          ).$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          render: (val, item, field) => {
            // eslint-disable-next-line new-cap
            const dom = this.$options.filters["CalcDate"](val);
            return this.renderChangeTip(field, item, dom);
          }
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.purReqNum").$D(
            "采购申请号"
          ),
          fieldCode: "displayPrNum"
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.purReqLineNum"
          ).$D("申请行号"),
          fieldCode: "displayPrLineNum"
        },
        {
          fieldName: this.$T(
            "sodr.orderApproval.model.common.purchaserComments"
          ).$D("采购方行备注"),
          fieldCode: "remark",
          render: (val, item, field) => val ?
            this.renderChangeTip(field, item, val) :
            this.$T("hipspfm.common.currency.none").$D("无")
        },
        {
          fieldName: this.$T("sinv.common.model.common.lineAattachment").$D(
            "行附件"
          ),
          fieldCode: "attachmentUuid",
          render: (val, record) =>
            <SrmUpload
              showIcon={false}
              color='blue'
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D(
                "查看附件"
              )}
              attachmentUuid={record.attachmentUuid}
            />, // return <span style="color: blue">{this.$T('hipspfm.common.button.viewAttachments').$D('查看附件')}</span>
          // eslint-disable-next-line no-unused-vars
          callBack: (val, record) => {
            // this.showFilePop(val.attachmentUuid)
          }
        },
        {
          fieldName: this.$T(
            "sodr.common.model.common.newSourceNumAndLine"
          ).$D("寻源单号-行号"),
          fieldCode: "sourceNumAndLine",
          render:(val, item) => <a style="color: blue" onClick={() => this.goSource(item)}>{val || item.sourceCodeNum}</a>
        },
      ];
      return columns;
    }
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    goSource(record) {
      const { sourceHeaderId:rfxHeaderId } = record;
      if (rfxHeaderId) {
        this.$router.push({
          // name: "RfxHall",
          path: "/appSour/RfxHallDetail",
          query: { rfxHeaderId },
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.orderLineDetail {
  height: 100%;
  position: relative;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  .right-button {
    margin-right: 8px;

    img {
      margin-right: 12px;
      height: 24px;
      width: 24px;
    }
  }

  .headInfo {
    padding: 16px 20px 12px 20px;
    border-bottom: solid 8px #F0F2F5;

    li {
      display: flex;
      margin-bottom: 8px;
      justify-content: space-between;

      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color: var(--color-font-default, #1b1e2b);
        line-height: 24px;

        &:nth-child(1) {
          // font-weight: 700;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .lineNum {
      span {
        font-size: 16px;
        color: #C6CAD6;
      }
    }
  }

  .prequalification-detail {
    height: calc(100vh - 176px);
  }
}

.card-personalized {
  width: 100%;
  color: #666666;
  padding 12px 15px;
  background: var(--color-bg-default);

  .card-first-single{
    text-align: left;
    font-size: 14px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 22px;
  }

  .card-first-between{
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
}
</style>
