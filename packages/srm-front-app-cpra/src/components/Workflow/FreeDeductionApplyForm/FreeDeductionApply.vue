<template>
  <!-- 费用扣款申请审批 -->
  <section>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basicInfoDataSet"
                  :columns="getColumns('basicInfo')"
                  :customize-code="getCodeDefine('basicInfo')"
                  @itemClick="clickBasicInfoInfo"/>
      </srm-scroll-tab-item>

      <!-- 交易方信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('transactionParty')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basicInfoDataSet"
                  :columns="getColumns('transactionParty')"
                  :customize-code="getCodeDefine('transactionParty')"
                  @itemClick="clickTransactionPartyInfo"/>
      </srm-scroll-tab-item>

      <!-- 交易金额信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('transactionAmount')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basicInfoDataSet"
                  :columns="getColumns('transactionAmount')"
                  :customize-code="getCodeDefine('transactionAmount')"/>
      </srm-scroll-tab-item>

      <!-- 交易明细信息 -->
      <srm-scroll-tab-item :label="getLanguageDefine('transactionDetail')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="transactionDetailDataSet"
                  :columns="getColumns('transactionDetail')"
                  :customize-code="getCodeDefine('transactionDetail')"
                  @itemClick="clickTransactionDetailInfo"/>
      </srm-scroll-tab-item>

      <!-- 其他信息 -->
      <!-- <srm-scroll-tab-item :label="getLanguageDefine('othersInfo')">
        <ul style="padding: 16px 15px">
          <div style="border-bottom: 1px solid var(--color-border-default); margin-bottom: 16px;">
            <p class="other-info">
              <span>{{ $T("ssta.costSheet.model.costSheet.remark").$D("备注") }}</span>
              <span style="color: #333333">{{ remarks.length || 0 }}/150</span>
            </p>
            <srm-textarea-field v-model="remarks" class="override-textarea" :disabled="true"/>
          </div>
          <div>
            <p class="other-info">
              <span>{{ $T("ssta.costSheet.model.costSheet.comment").$D("审批意见") }}</span>
              <span style="color: #333333">{{ approvalOpinions.length || 0 }}/150</span>
            </p>
            <srm-textarea-field v-model="approvalOpinions" class="override-textarea" :disabled="true"/>
          </div>
        </ul>
      </srm-scroll-tab-item> -->
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" :show-header="false" position="right">
      <customize-detail
        v-if="visible"
        :need-padding="true"
        :data-source="popupData.data"
        :code="getCodeDefine(popupData.code)"
        :columns="getColumns(popupData.columns)"/>
    </srm-popup>
  </section>
</template>

<script>
import { dateFormat } from "@/utils/index";
import { $T, DataSet } from "srm-mobile-ui";
import { commonDs, transactionDetailDs } from "./dataSource/indexDs";
import { getChargeHeader, getCuszTemplate } from "./api";
import CuxMethods from "@/modules/CUX_PART/Method/FreeDeductionApplyMethod";
const headUnitCodes = [
  "SSTA.COST_SHEET_DETAIL.BASIC_INFO",
  "SSTA.COST_SHEET_DETAIL.OTHERS_INFO",
  "SSTA.COST_SHEET_DETAIL.ENCLOSURE",
  "SSTA.COST_SHEET_DETAIL.OTHERS.WORKFLOW",
  "SSTA.COST_SHEET_DETAIL.CONFIRM",
  "SSTA.COST_SHEET_DETAIL.RETURN",
  "SSTA.COST_SHEET_DETAIL.REVERSE",
  "SSTA.COST_SHEET_DETAIL.FLOW_BASIC_CARD",
  "SSTA.COST_SHEET_DETAIL.FLOW_EXTRA_CARD",
];
export default {
  modules: [ "hipspfm.common", "ssta.costSheet" ],
  name: "FreeDeductionApply",
  extends: CuxMethods,
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    }
  },
  data() {
    return {
      templateInfo: {},
      basicInfoDataSet: new DataSet(commonDs()),
      transactionDetailDataSet: new DataSet(transactionDetailDs()),
      remarks: [],
      approvalOpinions: [],
      visible: false,
      popupData: {},
      implementationVisible: false
    };
  },
  computed: {
    getColumns() {
      let cuxBasicInfoDetail = [];
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                {item.chargeNum}
                <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", color: "var(--color-default)" }} />
              </SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "reverseStatusMeaning",
              fieldName: $T("ssta.costSheet.model.costSheet.reverseStatusMeaning").$D("冲销标识"),
              formRow: 2,
            },
            {
              fieldCode: "reverseNum",
              fieldName: $T("ssta.costSheet.model.costSheet.reverseNum").$D("冲销关联单据"),
              formRow: 3,
            },
            {
              fieldCode: "createdByName",
              fieldName: $T("ssta.costSheet.model.costSheet.createdByName").$D("创建人"),
              formRow: 4,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssta.costSheet.model.costSheet.creationDate").$D("创建日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 5,
            },
          ].concat(cuxBasicInfoDetail);
        case "transactionParty":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                { item.companyName }
                <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", color: "var(--color-default)" }} />
              </SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "companyNum",
              fieldName: $T("ssta.costSheet.model.costSheet.companyNum").$D("公司编号"),
              formRow: 2,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssta.costSheet.model.costSheet.supplierCompanyName").$D("供应商名称"),
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyNum",
              fieldName: $T("ssta.costSheet.model.costSheet.supplierCompanyNum").$D("供应商编号"),
              formRow: 4,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("ssta.costSheet.model.costSheet.currencyCode").$D("币种"),
              formRow: 5,
            },
          ];
        case "transactionAmount":
          return [
            {
              fieldCode: "header",
              fieldType: "TEXT",
              fieldName: $T("ssta.costSheet.model.costSheet.netAmount").$D("不含税金额"),
              render: (val, item) => {
                const length = this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision");
                return this.$options.filters.calcMultipleDelimiter(item.netAmount, length);
              },
              formRow: 1,
            },
            {
              fieldCode: "taxAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.taxAmount").$D("税额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 2,
            },
            {
              fieldCode: "taxIncludedAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.taxIncludedAmount").$D("含税金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
          ];
        case "transactionDetail":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => {
                const tagColor = {
                  PUSHED: "success",
                  PUSH_FAILED: "danger",
                  PUSH_RETURN: "warn",
                };
                return <SrmListHeader>
                  { item.chargeName }
                  <SrmTag slot="right" type={tagColor[item.pushSettleStatus] || "info"}>{item.pushSettleStatusMeaning}</SrmTag>
                  <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", paddingLeft: "10px", color: "var(--color-default)" }} />
                </SrmListHeader>;
              },
              formRow: 0,
            },
            {
              fieldCode: "chargeCode",
              fieldType: "TEXT",
              fieldName: $T("ssta.costSheet.model.costSheet.chargeCode").$D("费用编码"),
              formRow: 2,
            },
            {
              fieldCode: "taxAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.taxAmount").$D("税额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("ssta.costSheet.model.costSheet.taxRate").$D("税率"),
              formRow: 4,
            },
            {
              fieldCode: "netAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.netAmount").$D("不含税金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 5,
            },
            {
              fieldCode: "taxIncludedAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.taxIncludedAmount").$D("含税金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 6,
            },
            {
              fieldCode: "pcNum",
              fieldName: $T("ssta.costSheet.model.costSheet.pcNum").$D("采购协议编号"),
              formRow: 7,
            },
            {
              fieldCode: "poNum",
              fieldName: $T("ssta.costSheet.model.costSheet.poNum").$D("采购订单编号"),
              formRow: 8,
            },
            {
              fieldCode: "reverseLineNum",
              fieldName: $T("ssta.costSheet.model.costSheet.reverseLineNum").$D("冲销关联单行号"),
              formRow: 9,
            },
            {
              fieldCode: "treatmentMethodMeaning",
              fieldName: $T("ssta.costSheet.model.costSheet.treatmentMethodMeaning").$D("费用处理方式"),
              formRow: 10,
            },
            {
              fieldCode: "costName",
              fieldName: $T("ssta.costSheet.model.costSheet.costId").$D("成本中心"),
              formRow: 11,
            },
            // {
            //   fieldCode: "pushSettleStatusMeaning",
            //   fieldName: $T("ssta.costSheet.model.costSheet.pushSettleStatusMeaning").$D("推算结算池状态"),
            //   formRow: 12,
            // },
            // {
            //   fieldCode: "look",
            //   fieldName: $T("ssta.costSheet.model.costSheet.implementation").$D("执行情况"),
            //   render: () => <span style="color: var(--color-other-default-b);">
            //     {this.getLanguageDefine("viewexeresult")}
            //   </span>,
            //   callBack: () => {
            //     this.openPopup("implementation", {});
            //   },
            //   formRow: 13,
            // },
            {
              fieldCode: "lineRemarks",
              fieldName: $T("ssta.costSheet.model.costSheet.lineRemarks").$D("备注信息"),
              formRow: 14,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "chargeNum",
              fieldName: $T("ssta.costSheet.model.costSheet.chargeNum").$D("费用单编号"),
              formRow: 1,
            },
            {
              fieldCode: "reverseStatusMeaning",
              fieldName: $T("ssta.costSheet.model.costSheet.reverseStatusMeaning").$D("冲销标识"),
              formRow: 2,
            },
            {
              fieldCode: "reverseNum",
              fieldName: $T("ssta.costSheet.model.costSheet.reverseNum").$D("冲销关联单据"),
              formRow: 3,
            },
            {
              fieldCode: "createdByName",
              fieldName: $T("ssta.costSheet.model.costSheet.createdByName").$D("创建人"),
              formRow: 4,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssta.costSheet.model.costSheet.creationDate").$D("创建日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 5,
            },
          ];
        case "transactionPartyDetail":
          return [
            {
              fieldCode: "companyName",
              fieldName: $T("ssta.costSheet.model.costSheet.companyName").$D("公司名称"),
              formRow: 1,
            },
            {
              fieldCode: "companyNum",
              fieldName: $T("ssta.costSheet.model.costSheet.companyNum").$D("公司编号"),
              formRow: 2,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssta.costSheet.model.costSheet.supplierCompanyName").$D("供应商名称"),
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyNum",
              fieldName: $T("ssta.costSheet.model.costSheet.supplierCompanyNum").$D("供应商编号"),
              formRow: 4,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("ssta.costSheet.model.costSheet.currencyCode").$D("币种"),
              formRow: 5,
            },
          ];
        case "transactionDetailDetail":
          return [
            {
              fieldCode: "chargeCode",
              fieldName: $T("ssta.costSheet.model.costSheet.chargeCode").$D("费用编码"),
              formRow: 1,
            },
            {
              fieldCode: "chargeName",
              fieldName: $T("ssta.costSheet.model.costSheet.chargeName").$D("费用名称"),
              formRow: 2,
            },
            {
              fieldCode: "taxAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.taxAmount").$D("税额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("ssta.costSheet.model.costSheet.taxRate").$D("税率"),
              formRow: 4,
            },
            {
              fieldCode: "netAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.netAmount").$D("不含税金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 5,
            },
            {
              fieldCode: "taxIncludedAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.costSheet.model.costSheet.taxIncludedAmount").$D("含税金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 6,
            },
            {
              fieldCode: "pcNum",
              fieldName: $T("ssta.costSheet.model.costSheet.pcNum").$D("采购协议编号"),
              formRow: 7,
            },
            {
              fieldCode: "poNum",
              fieldName: $T("ssta.costSheet.model.costSheet.poNum").$D("采购订单编号"),
              formRow: 8,
            },
            {
              fieldCode: "reverseLineNum",
              fieldName: $T("ssta.costSheet.model.costSheet.reverseLineNum").$D("冲销关联单行号"),
              formRow: 9,
            },
            {
              fieldCode: "treatmentMethodMeaning",
              fieldName: $T("ssta.costSheet.model.costSheet.treatmentMethodMeaning").$D("费用处理方式"),
              formRow: 10,
            },
            {
              fieldCode: "costName",
              fieldName: $T("ssta.costSheet.model.costSheet.costId").$D("成本中心"),
              formRow: 11,
            },
            {
              fieldCode: "pushSettleStatusMeaning",
              fieldName: $T("ssta.costSheet.model.costSheet.pushSettleStatusMeaning").$D("推算结算池状态"),
              formRow: 12,
            },
            // {
            //   fieldCode: "look",
            //   fieldName: $T("ssta.costSheet.model.costSheet.implementation").$D("执行情况"),
            //   render: () => <span style="color: var(--color-other-default-b);">
            //     {this.getLanguageDefine("viewexeresult")}
            //   </span>,
            //   callBack: () => {
            //     this.openPopup("implementation", {});
            //   },
            //   formRow: 13,
            // },
            {
              fieldCode: "lineRemarks",
              fieldName: $T("ssta.costSheet.model.costSheet.lineRemarks").$D("备注信息"),
              formRow: 14,
            },
          ];
        default:
          break;
        }
      };
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.initCustomizeTemplate();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    // 获取 自定义语言
    getLanguageDefine(key) {
      const languageList = {
        "noData": $T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "freeDeductionApply": $T("ssta.costSheet.view.message.title.freeDeductionApply").$D("费用单审批"),
        "basicInfo": $T("ssta.costSheet.view.message.panel.baseInfos").$D("基本信息"),
        "transactionParty": $T("ssta.costSheet.view.message.panel.tradingPartyInformation").$D("交易方信息"),
        "transactionAmount": $T("ssta.costSheet.view.message.panel.transactionAmountInformation").$D("交易金额信息"),
        "transactionDetail": $T("ssta.costSheet.view.message.panel.transactionDetails").$D("交易明细信息"),
        "othersInfo": $T("ssta.costSheet.view.message.panel.othersInf").$D("其他信息"),
        "viewexeresult": $T("ssta.costSheet.view.message.panel.viewexeresult").$D("查看执行情况"),
        "checkRecord": $T("ssta.costSheet.view.message.panel.checkRecord").$D("对账记录"),
        "invRecord": $T("ssta.costSheet.view.message.panel.invRecord").$D("开票记录"),
        "payRecord": $T("ssta.costSheet.view.message.panel.payRecord").$D("付款记录"),
      };
      return languageList[key] || key;
    },
    // 获取 自定义配置
    getCodeDefine(key) {
      const codeDefine = {
        "basicInfo": "SMBL.WORKFLOW.FREE_DEDUCTION.BASIC",
        "basicInfoDetail": "SMBL.WORKFLOW.FREE_DEDUCTION.BASIC",
        "transactionParty": "SMBL.WORKFLOW.FREE_DEDUCTION.TRADINGPARTY",
        "transactionPartyDetail": "SMBL.WORKFLOW.FREE_DEDUCTION.TRADINGPARTY",
        "transactionAmount": "SMBL.WORKFLOW.FREE_DEDUCTION.TRANSACTIONDETAIL",
        "transactionDetail": "SMBL.WORKFLOW.FREE_DEDUCTION.TRANSINFOLINE",
        "transactionDetailDetail": "SMBL.WORKFLOW.FREE_DEDUCTION.TRANSINFOLINE",
        "checkRecord": "SMBL.WORKFLOW.FREE_DEDUCTION.RECONCILICATION",
        "invRecord": "SMBL.WORKFLOW.FREE_DEDUCTION.BILLING",
        "payRecord": "SMBL.WORKFLOW.FREE_DEDUCTION.PAYMENT",
        "checkRecordLine": "SMBL.WORKFLOW.FREE_DEDUCTION.RECONCILICATION_LINE",
        "invRecordLine": "SMBL.WORKFLOW.FREE_DEDUCTION.BILLING_LINE",
      };
      return codeDefine[key] || "";
    },
    async initCustomizeTemplate() {
      const templateInfoRes = await getCuszTemplate({
        templateCuszMethodCode: "SSTA_CHARGE_HEADER_DETAIL_CUSZ_TEMPLATE",
        businessParam: { chargeHeaderId: this.changeReqId, role: "PURCHASER" },
      });
      if (templateInfoRes) {
        const { templateCode, templateVersion, useTemplateCusz } = templateInfoRes;
        if (useTemplateCusz) {
          this.templateInfo = {
            cuszTplTemplateCode: templateCode,
            cuszTplVersion: templateVersion,
            cuszTplStageCode: "COST.DETAIL",
            cuszTplPageCode: "COST_DETAIL_BASIC",
          };
        }
      }
      this.fetchLine();
      await this.fetchHeader();
    },
    // 基本信息
    async fetchHeader() {
      await getChargeHeader(this.changeReqId, {
        ...this.templateInfo,
        customizeUnitCode: headUnitCodes.join(),
      }).then((res) => {
        this.basicInfoDataSet.setData([ { ...res } ]);
        this.remarks = res["remarks"] || "";
        this.approvalOpinions = res["approvalOpinions"] || "";
      });
    },
    async fetchLine() {
      this.transactionDetailDataSet.setQueryParameter({
        ...this.templateInfo,
        chargeHeaderId: this.changeReqId,
        customizeUnitCode:"SSTA.COST_SHEET_DETAIL.TRANSACTIONDETAIL",
      });
      this.transactionDetailDataSet.refresh();
    },
    // 弹框
    openPopup(name, item) {
      this.implementationVisible = false;
      switch (name) {
      case "implementation":
        break;
      default:
        this.popupData["data"] = item;
        this.popupData["columns"] = name;
        this.popupData["code"] = name;
        this.visible = true;
        break;
      }
    },
    clickBasicInfoInfo(record) {
      this.openPopup("basicInfoDetail", record.data);
    },
    clickTransactionPartyInfo(record) {
      this.openPopup("transactionPartyDetail", record.data);
    },
    clickTransactionDetailInfo(record) {
      this.openPopup("transactionDetailDetail", record.data);
    },
  }
};
</script>

<style scoped lang="stylus">
.other-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #AFAFAF !important;
  margin-right: 12px;
  font-size: 12px;
}

.override-textarea {
  margin: 10px 0px 10px 0px;
  border-radius: 4px;
  background-color: #f6f6f6;
}
>>> .open-tag::before {
  display: none;
}
>>> .srm-list-item-card-head-left {
  max-width: 80% !important;
}
.srm-header-text {
  font-weight: normal;
}
</style>
