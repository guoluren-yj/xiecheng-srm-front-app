<template>
  <srm-popup
    height="100%"
    :visible="value"
    :title="$T('hipspfm.workFlowbidHall.view.message.title.calibrationBidApproval').$D('招标书结果审批明细')"
    @onClose="$emit('input',false)">
    <srm-detail-head :data-source="calibrationBidInfoDetail" :columns="getHeadColumns"/>
    <div style="height: 100%" class="card">
      <!-- 个性化组件替换后的代码 -->
      <customize-detail :need-padding="true" :columns="getColumns" :data-source="calibrationBidInfoDetail" code="SMBL.WORKFLOW.CALIBRATION_APPROVAL.BIDDING_INFO"/>
    </div>

    <calibration-score-detail
      v-model="scoreDetailPop"
      :score-detail="scoreDetail"/>
  </srm-popup>
</template>

<script>
import uuid from "uuid";
import CalibrationScoreDetail from "./CalibrationScoreDetail";
export default {
  modules: [ "hipspfm.common", "hipspfm.workFlowbidHall", "ssrc.bidHall", "hipspfm.workFlowbidHal" ],
  name: "CalibrationBidInfoDetail",
  components: {
    CalibrationScoreDetail,
  },
  props: {
    value: {
      type: Boolean
    },
    calibrationBidInfoDetail: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      uuid: "",
      activeName:[],
      // filePopup:false,
      scoreDetail: {},
      scoreDetailPop: false,
      quotationEchartsPop: false
    };
  },
  computed: {
    //详情头
    getHeadColumns() {
      const columns = [
        {
          fieldCode: "bidNum",
        },
        {
          fieldCode: "bidTitle",
        },
      ];

      return columns;
    },
    getColumns() {
      const columns = [
        {
          fieldCode: "itemCategoryName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <div class="collapse">
            <div class="collapse-title-a">
              <span>{record.itemCode}-{ record.itemName}</span>
            </div>
            <div class="collapse-title-b">
              {
                record.bidLineItemNum && <span>{this.$T("ssrc.bidHall.modal.inEnquiryHall.lineNo.").$D("行号") }：{ record.bidLineItemNum}</span>
              }
              {
                record.bidQuantity && <span>{this.$T("ssrc.bidHall.modal.inqueryHall.quantity").$D("数量")}：{record.bidQuantity }{record.uomName }</span>
              }
              {
                record.taxRate && <span>{this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率")}：{record.taxRate}</span>
              }
              {
                record.itemCategoryName && <span>{val}</span>
              }
            </div>
          </div>
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.model").$D("型号"),
          fieldCode: "model",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.supplierCode").$D("编码"),
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.supplierName").$D("名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.sumScore").$D("总分"),
          fieldCode: "sumScore",
          render:(val) => {
            if (val) {
              return <span style="color: #276EF1">{val}</span>;
            }
            return val;
          },
          callBack:(val) => {
            if (val.sumScore) {
              this.showScoreDetail(val);
            } else {
              return;
            }
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.quotationTotalAmount").$D("报价总金额"),
          fieldCode: "totalAmountMeaning",
          fieldType:"INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.validQuotationPrice").$D("报价单价"),
          fieldCode: "validQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.validQuotationQuantity").$D("可供数量"),
          fieldCode: "validQuotationQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.wetherWinbid").$D("是否中标"),
          fieldCode: "suggestedFlag",
          render:(val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.allottedQuantity").$D("中标数量"),
          fieldCode: "allottedQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.allottedRatio").$D("中标比例"),
          fieldCode: "allottedRatioMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.allottedPrice").$D("中标金额"),
          fieldCode: "allottedPrice",
          fieldType:"INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.costPrice").$D("标底单价"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.deliveryDay").$D("供货周期"),
          fieldCode: "validDeliveryCycle",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.currentPromisedDate").$D("承诺交货日期"),
          fieldCode: "validPromisedDate",
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.minimumPurchasePrice").$D("备注"),
          fieldCode: "validQuotationRemark",
        }
      ];
      return columns;
    }
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    showScoreDetail(data) {
      this.scoreDetail = data;
      this.scoreDetailPop = !this.scoreDetailPop;
    }
  }
};
</script>

<style lang="stylus" scoped>
  .collapse{
      margin:-15px;
      padding:15px 20px;
      background: var(--color-bg-default-b);

      .collapse-title-a {
        margin-bottom: 4px;

        span:nth-child(1) {
          font-size: 14px;
          color: var(--color-font-default,#1b1e2b);
          display: inline;
          line-height: 22px;
          font-weight: 700;
          word-break: break-all;
        }
      }

      .collapse-title-b {
        span {
          background: var(--color-bg-default-d,rgba(65,70,96,0.1));
          border-radius: 2px;
          padding: 1px 4px;
          margin-right: 8px;
          display: inline-block;
          font-size: 10px;
          color: var(--color-font-default-c);
          line-height: 18px;
          word-break: break-all;
        }
      }
    }
</style>
