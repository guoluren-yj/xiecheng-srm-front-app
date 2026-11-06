<template>
  <section>
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.ADVANCE_PAY.COLLAPSES">
      <ai-tip-section
        v-if="aiApproveStatus"
        :ai-approve-status="aiApproveStatus"
        :ai-review-params="aiReviewParams" />
      <!-- 基础信息 -->
      <srm-scroll-tab-item code="basicInfo" :label="getLanguageDefine('basicInfo')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="basicInfoDataSet"
                  :columns="getColumns('basicInfo')" :customize-code="getCodeDefine('basicInfo')"/>
      </srm-scroll-tab-item>

      <!-- 交易方信息 -->
      <srm-scroll-tab-item code="transactionParty" :label="getLanguageDefine('transactionParty')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="basicInfoDataSet"
                  :columns="getColumns('transactionParty')" :customize-code="getCodeDefine('transactionParty')"/>
      </srm-scroll-tab-item>

      <!-- 收款信息 -->
      <srm-scroll-tab-item code="collectionInfo" :label="getLanguageDefine('collectionInfo')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="basicInfoDataSet"
                  :columns="getColumns('collectionInfo')" :customize-code="getCodeDefine('collectionInfo')"/>
      </srm-scroll-tab-item>

      <!-- 交易金额信息 -->
      <srm-scroll-tab-item code="transactionAmount" :label="getLanguageDefine('transactionAmount')">
        <srm-list :scrollable="false" height="auto" style="height: auto" :data-set="transactionAmountDataSet"
                  :columns="getColumns('transactionAmount')" :customize-code="getCodeDefine('transactionAmount')" />
      </srm-scroll-tab-item>

      <!-- 附件 -->
      <srm-scroll-tab-item code="attachment" :label="getLanguageDefine('attachment')">
        <attachment-info :data-set="basicInfoDataSet" directory="ssta-prepayment" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" :show-header="false" position="right">
      <no-content v-if="recordVisible" :title="$T('smbl.common.view.noDocumentInformation').$D('暂无单据信息')"
                  img-src="NoResult@3x.png" />

      <customize-detail v-else :need-padding="true" :data-source="popupData.data" :code="getCodeDefine(popupData.code)"
                        :columns="getColumns(popupData.columns)" />
    </srm-popup>
  </section>
</template>

<script>
import { dateFormat } from "@/utils/index";
import { $T, DataSet } from "srm-mobile-ui";
import NoContent from "@/components/NoContent";

import { commonDs, transactionAmountDs, headUnitCodes } from "./dataSource/indexDs";
import { updatePrePay } from "./api";
import AttachmentInfo from "./components/AttachmentInfo";
import ListHeader from "@/components/ListHeader";
import StatusTag from "@/components/StatusTag";
import AiTipSection from "@/components/AiTipSection/AiTipSection";
import CuxMethods from "@/modules/CUX_PART/Method/AdvancePayApprovalMethod";
export default {
  modules: [ "smbl.common", "ssta.common", "hipspfm.common", "ssta.purchaseSettle" ],
  name: "AdvancePayApproval",
  components: {
    NoContent,
    AttachmentInfo,
    AiTipSection,
  },
  extends: CuxMethods,
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      // 基本信息
      basicInfoDataSet: new DataSet(commonDs(this.changeReqId)),
      transactionAmountDataSet: new DataSet(transactionAmountDs(this.changeReqId)),
      visible: false,
      // 核销纪录
      recordVisible: false,
      popupData: {},
      basicInfoCollapse: true,
      transactionPartyCollapse: true,
      collectionInfoCollapse: true,
      transactionAmountCollapse: true,
      attachmentCollapse: true,
      aiApproveStatus: "",
      aiReviewParams: null,
    };
  },
  computed: {
    getColumns() {
      const { jumpPoFlag, jumpPcFlag, prepaymentType } = this.basicInfoDataSet.current?.toData() || {};
      const jumpFlag =
        [ "PO_LINE", "ORDER" ].includes(prepaymentType) && jumpPoFlag ||
        [ "CONTRACT", "CONTRACT_STAGE", "CONTRACT_SUBJECT" ].includes(prepaymentType) && jumpPcFlag;
      let cuxBasicInfoDetail = [];
      // 标准二开埋点
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "settleNum",
              fieldType: "EMPTY",
              render: (val, item) => {
                const settleStatus = item.settleStatus;
                const statusType = {
                  SUBMITED: "primary",
                  SUBMITED_APPROVING: "warn",
                  CANCELING: "warn",
                  CANCEL: "info",
                  RETURN: "danger",
                  CONFIRM: "success",
                  NEW: "primary",
                };
                return (
                  <ListHeader>
                    <span><span class="srm-field-left-label">{$T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D("结算单编号")}:</span>{item.settleNum}</span>
                    <StatusTag slot="rightTag" color={statusType[settleStatus]} text={item.settleStatusMeaning} />
                  </ListHeader>
                );
              },
              formRow: 1,
            },
            {
              fieldCode: "documentTypeMeaning",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning").$D("结算单类型"),
              formRow: 2,
            },
            {
              fieldCode: "campMeaning",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.campMeaning").$D("创建方阵营"),
              formRow: 3,
            },
            {
              fieldCode: "createdUserName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.createdUserName").$D("创建人"),
              formRow: 4,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.creationDate").$D("创建日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 5,
            },
            {
              fieldCode: "editFlag",
              fieldName: $T("ssta.purchaseSettle.view.message.editableFormURLFlag").$D("是否是可编辑表单URL"),
              render: (val) => val === "1" ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"),
              formRow: 6,
            },
          ].concat(cuxBasicInfoDetail);
        case "transactionParty":
          return [
            {
              fieldCode: "companyName",
              fieldType: "EMPTY",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyName").$D("结算公司名称"),
              render: (val, _, field) => <span><span class="srm-field-left-label">{field.fieldName}：</span>{val || "-"}</span>,
              formRow: 1,
            },
            {
              fieldCode: "companyNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyNum").$D("结算公司编号"),
              formRow: 2,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierName").$D("结算供应商名称"),
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.supplierCompanyNum").$D("结算供应商编号"),
              formRow: 4,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种"),
              formRow: 5,
            },
          ];
        case "collectionInfo":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <ListHeader showTitle>
                <span >{item.bankAccountName || "-"}</span>
              </ListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "prepaymentTypeMeaning",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentType").$D("预付款类型"),
              formRow: 2,
            },
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount").$D("预付款总金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "bankBranchName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.bankBranchName").$D("收款开户行"),
              formRow: 4,
            },
            {
              fieldCode: "bankAccountNum",
              fieldName: $T("ssta.purchaseSettle.purchaseSettle.bankAccountNum").$D("收款银行帐号"),
              formRow: 5,
            },
            {
              fieldCode: "bankAccountName",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.bankAccountName1").$D("收款银行账户名称"),
              formRow: 6,
            },
            {
              fieldCode: "paymentTypeName",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentMethod").$D("付款方式"),
              formRow: 7,
            },
            {
              fieldCode: "paymentTermName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paymentCondition").$D("付款条件"),
              formRow: 8,
            },
            {
              fieldCode: "expectPaymentDate",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.expectPaymentDate").$D("期望付款日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 9,
            },
          ];
        case "transactionAmount":
          return [
            {
              fieldCode: "prepaymentAmount",
              fieldType: "EMPTY",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount1").$D("预付款行金额"),
              render: (val, item, field) => {
                const length = this.$options.filters.calcCurrencyPrecision(item.currencyCode, "financialPrecision");
                return <ListHeader>
                  <span><span class="srm-field-left-label">{field.fieldName}：</span>{this.$options.filters.calcMultipleDelimiter(val, length)}</span>
                </ListHeader>;
              },
              formRow: 1,
            },
            {
              fieldCode: "associateNumAndLineNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNumAndLineNum").$D("关联单据号 | 关联单据行号"),
              formRow: 2,
              render: (val, item) => {
                const text = item.associateLineNum ? `${item.associateNum}-${item.associateLineNum}` : item.associateNum;
                return jumpFlag ?
                  <SrmButton
                    plain
                    onClick={() => {
                      this.linkAssociateDoc(item);
                    }}
                    style={{ fontSize: "12px", fontWeight: 400 }}
                  >
                    {text}
                  </SrmButton> :
                  text;
              }
            },
            {
              fieldCode: "associateAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.associateAmount").$D("关联单据金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "lineNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
              formRow: 4,
            },
            {
              fieldCode: "prepaymentApplyAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.common.prepaymentApplyAmount").$D("已核销金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 5,
            },
            {
              fieldCode: "look",
              fieldName: $T("ssta.common.view.title.writeOffRecord").$D("核销记录"),
              render: () => <span style="color: var(--color-other-default-b);">
                {$T("hipspfm.common.button.view").$D("查看")}
              </span>,
              callBack: () => {
                this.openPopup("prepaymentRecord", {});
              },
              formRow: 6,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "settleNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleNum").$D("结算单编号"),
              formRow: 1,
            },
            {
              fieldCode: "documentTypeMeaning",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.documentTypeMeaning").$D("结算单类型"),
              formRow: 2,
            },
            {
              fieldCode: "campMeaning",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.campMeaning").$D("创建方阵营"),
              formRow: 3,
            },
            {
              fieldCode: "createdUserName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.createdUserName").$D("创建人"),
              formRow: 4,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.creationDate").$D("创建日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 5,
            },
          ];
        case "transactionPartyDetail":
          return [
            {
              fieldCode: "companyName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyName").$D("结算公司名称"),
              formRow: 1,
            },
            {
              fieldCode: "companyNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleCompanyNum").$D("结算公司编号"),
              formRow: 2,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.settleSupplierName").$D("结算供应商名称"),
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.supplierCompanyNum").$D("结算供应商编号"),
              formRow: 4,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.currencyCode").$D("币种"),
              formRow: 5,
            },
          ];
        case "collectionInfoDetail":
          return [
            {
              fieldCode: "bankAccountName",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.bankAccountName1").$D("收款银行账户名称"),
              formRow: 1,
            },
            {
              fieldCode: "prepaymentTypeMeaning",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentType").$D("预付款类型"),
              formRow: 2,
            },
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount").$D("预付款总金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "bankBranchName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.bankBranchName").$D("收款开户行"),
              formRow: 4,
            },
            {
              fieldCode: "bankAccountNum",
              fieldName: $T("ssta.purchaseSettle.purchaseSettle.bankAccountNum").$D("收款银行帐号"),
              formRow: 5,
            },
            {
              fieldCode: "paymentTypeName",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.paymentMethod").$D("付款方式"),
              formRow: 7,
            },
            {
              fieldCode: "paymentTermName",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.paymentCondition").$D("付款条件"),
              formRow: 8,
            },
            {
              fieldCode: "expectPaymentDate",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.expectPaymentDate").$D("期望付款日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 9,
            },
          ];
        case "transactionAmountDetail":
          return [
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount1").$D("预付款行金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 1,
            },
            {
              fieldCode: "associateNumAndLineNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.associateNumAndLineNum").$D("关联单据号 | 关联单据行号"),
              formRow: 2,
              render: (val, item) => {
                const text = item.associateLineNum ? `${item.associateNum}-${item.associateLineNum}` : item.associateNum;
                return jumpFlag ?
                  <SrmButton
                    plain
                    onClick={() => {
                      this.linkAssociateDoc(item);
                    }}
                  >
                    {text}
                  </SrmButton> :
                  text;
              }
            },
            {
              fieldCode: "associateAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.view.message.model.purchaseSettle.associateAmount").$D("关联单据金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "lineNum",
              fieldName: $T("ssta.purchaseSettle.model.purchaseSettle.lineNum").$D("结算单行号"),
              formRow: 4,
            },
            {
              fieldCode: "prepaymentApplyAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.purchaseSettle.common.prepaymentApplyAmount").$D("已核销金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 5,
            },
            {
              fieldCode: "look",
              fieldName: $T("ssta.common.view.title.writeOffRecord").$D("核销记录"),
              render: () => <span style="color: var(--color-other-default-b);">
                {this.getLanguageDefine("viewRecord")}
              </span>,
              callBack: () => {
                this.openPopup("prepaymentRecord", {});
              },
              formRow: 6,
            },
          ];
        default:
          break;
        }
      };
    }
  },
  created() {
    this.basicInfoDataSet.events.afterQuery = (_, data) => {
      if (!data || !data.length) {
        return data;
      }
      const { editFlag } = this.parameters;
      Object.assign(data[0], { editFlag });
      const { aiApproveStatus = "", searchDetailParams = null } =
        data?.[0]?.sstaAiApproveResult || {};
      this.aiApproveStatus = aiApproveStatus;
      this.aiReviewParams = searchDetailParams;
      return data;
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.fetchData();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
  },
  methods: {
    async beforeApprove(approveResult) {
      if (this.parameters.editFlag === "1" && approveResult === "Approved") {
        const res = await updatePrePay(
          {
            settleHeader: this.basicInfoDataSet.toData()[0],
            prePaymentLineList: this.transactionAmountDataSet.toData(),
          },
          { customizeUnitCode: headUnitCodes });
        if (res && res.failed !== true) {
          return this.basicInfoDataSet.refresh();
        } return false;
      }
      return true;
    },
    // 获取 自定义语言
    getLanguageDefine(key) {
      const languageList = {
        "noData": $T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "basicInfo": $T("ssta.purchaseSettle.view.title.basicInfo").$D("基础信息"),
        "transactionParty": $T("ssta.purchaseSettle.view.title.transactionParty").$D("交易方信息"),
        "collectionInfo": $T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息"),
        "transactionAmount": $T("ssta.purchaseSettle.view.title.transactionAmount").$D("交易金额信息"),
        "viewRecord":$T("ssta.common.view.title.writeOffRecord").$D("核销记录"),
        "attachment": $T("ssta.purchaseSettle.view.message.panel.attachment").$D("附件"),
      };

      return languageList[key] || key;
    },
    // 获取 自定义配置
    getCodeDefine(key) {
      const codeDefine = {
        "basicInfo": "SMBL.WORKFLOW.ADVANCE_PAY.BASIC",
        "basicInfoDetail": "SMBL.WORKFLOW.ADVANCE_PAY.BASIC_DETAIL",
        "transactionParty": "SMBL.WORKFLOW.ADVANCE_PAY.TRADINGPARTY",
        "collectionInfo": "SMBL.WORKFLOW.ADVANCE_PAY.PAYMENT",
        "transactionAmount": "SMBL.WORKFLOW.ADVANCE_PAY.TRANSACTIONDETAIL",
        "writeOff": "SMBL.WORKFLOW.ADVANCE_PAY.WRITEOFF",
        "attachment": "SMBL.WORKFLOW.ADVANCE_PAY.ATTACHMENT",
      };

      return codeDefine[key] || "";
    },
    linkAssociateDoc(item) {
      const { associateId } = item || {};
      const { jumpPoFlag, prepaymentType } = this.basicInfoDataSet.current?.toData() || {};
      if ([ "PO_LINE", "ORDER" ].includes(prepaymentType)) {
        // jumpPoFlag === 1 我发出的订单 === 2 订单工作台
        if (jumpPoFlag === 1) {
          this.$router.push({
            path: "/appCpra/MyOrderDetail",
            query: { poHeaderId: associateId },
          });
        } else {
          this.$router.push({
            path: "/appCpra/OrderWorkbenchDetail/All",
            query: { poHeaderId: associateId },
          });
        }
      } else if ([ "CONTRACT", "CONTRACT_STAGE", "CONTRACT_SUBJECT" ].includes(prepaymentType)) {
        this.$router.push({
          path: "/appSour/ContractDetail",
          query: { pcHeaderId: associateId },
        });
      }
    },
    // 弹框
    openPopup(name, item) {
      this.recordVisible = false;
      switch (name) {
      case "prepaymentRecord":
        this.recordVisible = true;
        break;
      default:
        this.popupData["data"] = item;
        this.popupData["columns"] = name;
        this.popupData["code"] = name;
        break;
      }
      this.visible = true;
    },
    clickBasicInfoInfo(record) {
      this.openPopup("basicInfoDetail", record.data);
    },
    clickTransactionPartyInfo(record) {
      this.openPopup("transactionPartyDetail", record.data);
    },
    clickCollectionInfoInfo(record) {
      this.openPopup("collectionInfoDetail", record.data);
    },
    clickTransactionAmountInfo(record) {
      this.openPopup("transactionAmountDetail", record.data);
    },
  }
};
</script>

<style lang="stylus" scoped>

.collapse-item {
  >>> .srm-collapse-title {
    background: var(--background-color-empty-tab-title);
  }
  .collapse-title {
    height: 54px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: var(--font-color-default);
    background: var(--background-color-empty-tab-title);
    width: 100%;
  }
  >>> .srm-collapse-content-active {
    max-height: 100%;
  }
}
.srm-attachment-custom {
  >>> .srm-button {
    font-weight: 400 !important;
    span {
      font-weight: 400 !important;
    }
  }
}
.srm-field-left-label {
  color: var(--font-color-field2);
  margin-right: 8px;
}
>>>.list-header-left {
  max-width: 80% !important;
}
</style>
