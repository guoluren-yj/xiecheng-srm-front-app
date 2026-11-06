<template>
  <section>
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.ADVANCE_PAY.COLLAPSES">
      <!-- 基础信息 -->
      <srm-scroll-tab-item code="basicInfo" :show-title="false" :label="getLanguageDefine('basicInfo')">
        <srm-collapse-item v-model="basicInfoCollapse" class="collapse-item" name="basicInfo">
          <div class="collapse-title">{{ getLanguageDefine('basicInfo') }}</div>
          <div slot="content">
            <srm-list
              :scrollable="false"
              height="auto"
              style="height: auto"
              :data-set="basicInfoDataSet"
              :columns="getColumns('basicInfo')"
              :customize-code="getCodeDefine('basicInfo')"/>
          </div>
        </srm-collapse-item>
      </srm-scroll-tab-item>

      <!-- 交易方信息 -->
      <srm-scroll-tab-item code="transactionParty" :show-title="false" :label="getLanguageDefine('transactionParty')">
        <srm-collapse-item v-model="transactionPartyCollapse" class="collapse-item" name="transactionParty">
          <div class="collapse-title">{{ getLanguageDefine('transactionParty') }}</div>
          <div slot="content">
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="basicInfoDataSet"
                      :columns="getColumns('transactionParty')"
                      :customize-code="getCodeDefine('transactionParty')"/>
          </div>
        </srm-collapse-item>
      </srm-scroll-tab-item>

      <!-- 收款信息 -->
      <srm-scroll-tab-item code="collectionInfo" :show-title="false" :label="getLanguageDefine('collectionInfo')">
        <srm-collapse-item v-model="collectionInfoCollapse" class="collapse-item" name="collectionInfo">
          <div class="collapse-title">{{ getLanguageDefine('collectionInfo') }}</div>
          <div slot="content">
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="basicInfoDataSet"
                      :columns="getColumns('collectionInfo')"
                      :customize-code="getCodeDefine('collectionInfo')"/>
          </div>
        </srm-collapse-item>
      </srm-scroll-tab-item>

      <!-- 交易金额信息 -->
      <srm-scroll-tab-item code="transactionAmount" :show-title="false" :label="getLanguageDefine('transactionAmount')">
        <srm-collapse-item v-model="transactionAmountCollapse" class="collapse-item" name="transactionAmount">
          <div class="collapse-title">{{ getLanguageDefine('transactionAmount') }}</div>
          <div slot="content">
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="transactionAmountDataSet"
                      :columns="getColumns('transactionAmount')"
                      :customize-code="getCodeDefine('transactionAmount')"/>
          </div>
        </srm-collapse-item>
      </srm-scroll-tab-item>

      <!-- 附件 -->
      <srm-scroll-tab-item code="attachment" :show-title="false" :label="getLanguageDefine('attachment')">
        <srm-collapse-item v-model="attachmentCollapse" class="collapse-item" name="attachment">
          <div class="collapse-title">{{ getLanguageDefine('attachment') }}</div>
          <div slot="content">
            <srm-list :scrollable="false"
                      height="auto"
                      style="height: auto"
                      :data-set="basicInfoDataSet"
                      :columns="getColumns('attachment')"
                      :customize-code="getCodeDefine('attachment')"/>
          </div>
        </srm-collapse-item>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" :show-header="false" position="right">
      <no-content
        v-if="recordVisible"
        :title="$T('smbl.common.view.noDocumentInformation').$D('暂无单据信息')"
        img-src="NoResult@3x.png"/>

      <customize-detail
        v-else
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
import NoContent from "@/components/NoContent";
import PoDetail from "./PoDetail";
import { commonDs, transactionAmountDs } from "./dataSource/indexDs";
import {
  getPrePayHeader,
} from "./api";
export default {
  modules: [ "smbl.common", "ssta.supplySettle", "hipspfm.common", "sodr.common", "hzero.common" ],
  name: "AdvancePayApproval",
  components: {
    NoContent,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    }
  },
  data() {
    return {
      // 基本信息
      basicInfoDataSet: new DataSet(commonDs()),
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
      jumpPoFlag: 0,
      prepaymentType: null,
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => {
                const settleStatus = item.settleStatus;
                const statusType = {
                  // NEW: "primary",
                };
                return <SrmListHeader>
                  {item.settleNum}
                  <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[settleStatus]}>
                    {item.settleStatusMeaning}
                  </SrmButton>
                </SrmListHeader>;
              },
              formRow: 1,
            },
            {
              fieldCode: "documentTypeMeaning",
              fieldName: $T("ssta.supplySettle.model.supplySettle.documentTypeMeaning").$D("结算单类型"),
              formRow: 2,
            },
            {
              fieldCode: "campMeaning",
              fieldName: $T("ssta.supplySettle.model.supplySettle.campMeaning").$D("创建方阵营"),
              formRow: 3,
            },
            {
              fieldCode: "createdUserName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.createdUserName").$D("创建人"),
              formRow: 4,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssta.supplySettle.model.supplySettle.creationDate").$D("创建日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 5,
            },
            {
              fieldCode: "prepaymentAmount",
              fieldName: $T("ssta.supplySettle.view.message.model.supplySettle.prepaymentAmount").$D("预付款金额"),
              formRow: 6,
              precision: (val, record) => record.amountPrecision || 2,
              fieldType: "INPUT_NUMBER",
              editor: false,
            }
          ];
        case "transactionParty":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                { $T("ssta.supplySettle.model.supplySettle.settleCustomCompanyName").$D("结算客户公司名称") }：{ item.companyName }
              </SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "companyNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.companyNum").$D("结算客户公司编号"),
              formRow: 2,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.settleSupplierName").$D("结算供应商名称"),
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.supplierCompanyNum").$D("结算供应商编号"),
              formRow: 4,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("ssta.supplySettle.model.supplySettle.currencyCode").$D("币种"),
              formRow: 5,
            },
          ];
        case "collectionInfo":
          return [
            {
              fieldCode: "header",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>{item.bankAccountName}</SrmListHeader>,
              formRow: 1,
            },
            {
              fieldCode: "prepaymentTypeMeaning",
              fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionType").$D("预收款类型"),
              formRow: 2,
            },
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionAmount").$D("预收款总金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "bankBranchName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.bankBranchName").$D("收款开户行"),
              formRow: 4,
            },
            {
              fieldCode: "bankAccountNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.bankAccountNum").$D("收款银行帐号"),
              formRow: 5,
            },
            {
              fieldCode: "bankAccountName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.bankAccountName").$D("银行帐号名称"),
              formRow: 6,
            },
            {
              fieldCode: "paymentTypeName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.collectionTypeName").$D("收款方式"),
              formRow: 7,
            },
            {
              fieldCode: "paymentTermName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.collectionCondition").$D("收款条件"),
              formRow: 8,
            },
            {
              fieldCode: "expectPaymentDate",
              fieldName: $T("ssta.supplySettle.model.supplySettle.expectCollectionDate").$D("期望收款日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 9,
            },
          ];
        case "transactionAmount":
          return [
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.view.message.model.supplySettle.prepaymentAmount").$D("预付款金额"),
              precision: (val, record) => record.amountPrecision || 2,
              editor: false,
              formRow: 1,
            },
            { formRow: 2, fieldCode: "associateNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.associateNumAndLineNum").$D("关联单据号 | 关联单据行号"),
              render: (_val, item) => {
                const { jumpPoFlag, prepaymentType } = this;
                const text = item.associateLineNum ? `${item.associateNum}-${item.associateLineNum}` : item.associateNum;
                if (jumpPoFlag && [ "ORDER", "PO_LINE" ].includes(prepaymentType)) {
                  return <div style="color: var(--color-success);" onClick={ (e) => {
                    e.stopPropagation();
                    this.jumpMyOrder(item);
                  }}>
                    {text}
                  </div>;
                }
                return text;
              },
            },
            {
              fieldCode: "associateAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.model.supplySettle.associateAmount").$D("关联单据金额"),
              precision: (val, record) => record.amountPrecision || 2,
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "lineNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.lineNum").$D("结算单行号"),
              formRow: 4,
            },
            {
              fieldCode: "prepaymentApplyAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.model.supplySettle.prepaymentApplyAmount").$D("已核销金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 5,
            },
            {
              fieldCode: "look",
              fieldName: $T("ssta.supplySettle.model.supplySettle.prepaymentRecord").$D("核销记录"),
              render: () => <span style="color: var(--color-success);">
                {this.getLanguageDefine("viewRecord")}
              </span>,
              callBack: () => {
                this.openPopup("prepaymentRecord", {});
              },
              formRow: 6,
            },
          ];
        case "attachment":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "attachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between">
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-attachment-button
                    attachments={[ {
                      attachmentUuid: val,
                      title: $T("ssta.supplySettle.view.purchaserAttachment").$D("采购方附件"),
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none",
                    } ]}
                    show-total
                    title={$T("ssta.supplySettle.view.purchaserAttachment").$D("采购方附件")}/>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 10,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "settleNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.settleNum").$D("结算单编号"),
              formRow: 1,
            },
            {
              fieldCode: "documentTypeMeaning",
              fieldName: $T("ssta.supplySettle.model.supplySettle.documentTypeMeaning").$D("结算单类型"),
              formRow: 2,
            },
            {
              fieldCode: "campMeaning",
              fieldName: $T("ssta.supplySettle.model.supplySettle.campMeaning").$D("创建方阵营"),
              formRow: 3,
            },
            {
              fieldCode: "createdUserName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.createdUserName").$D("创建人"),
              formRow: 4,
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("ssta.supplySettle.model.supplySettle.creationDate").$D("创建日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 5,
            },
          ];
        case "transactionPartyDetail":
          return [
            {
              fieldCode: "companyName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.settleCustomCompanyName").$D("结算客户公司名称"),
              formRow: 1,
            },
            {
              fieldCode: "companyNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.companyNum").$D("结算客户公司编号"),
              formRow: 2,
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.settleSupplierName").$D("结算供应商名称"),
              formRow: 3,
            },
            {
              fieldCode: "supplierCompanyNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.supplierCompanyNum").$D("结算供应商编号"),
              formRow: 4,
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("ssta.supplySettle.model.supplySettle.currencyCode").$D("币种"),
              formRow: 5,
            },
          ];
        case "collectionInfoDetail":
          return [
            {
              fieldCode: "bankAccountName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.bankAccountName").$D("银行帐号名称"),
              formRow: 1,
            },
            {
              fieldCode: "prepaymentTypeMeaning",
              fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionType").$D("预收款类型"),
              formRow: 2,
            },
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.model.supplySettle.preCollectionAmount").$D("预收款总金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "bankBranchName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.bankBranchName").$D("收款开户行"),
              formRow: 4,
            },
            {
              fieldCode: "bankAccountNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.bankAccountNum").$D("收款银行帐号"),
              formRow: 5,
            },
            {
              fieldCode: "paymentTypeName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.collectionTypeName").$D("收款方式"),
              formRow: 7,
            },
            {
              fieldCode: "paymentTermName",
              fieldName: $T("ssta.supplySettle.model.supplySettle.collectionCondition").$D("收款条件"),
              formRow: 8,
            },
            {
              fieldCode: "expectPaymentDate",
              fieldName: $T("ssta.supplySettle.model.supplySettle.expectCollectionDate").$D("期望收款日期"),
              render: (val) => <span>{dateFormat(val)}</span>,
              formRow: 9,
            },
          ];
        case "transactionAmountDetail":
          return [
            {
              fieldCode: "prepaymentAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.view.message.model.supplySettle.prepaymentAmount").$D("预付款金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 1,
            },
            {
              fieldCode: "associateNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.associateNumAndLineNum").$D("关联单据号 | 关联单据行号"),
              formRow: 2,
              render:(val, item) => item.associateLineNum ? `${item.associateNum}-${item.associateLineNum}` : item.associateNum,
            },
            {
              fieldCode: "associateAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.model.supplySettle.associateAmount").$D("关联单据金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 3,
            },
            {
              fieldCode: "lineNum",
              fieldName: $T("ssta.supplySettle.model.supplySettle.lineNum").$D("结算单行号"),
              formRow: 4,
            },
            {
              fieldCode: "prepaymentApplyAmount",
              fieldType: "INPUT_NUMBER",
              fieldName: $T("ssta.supplySettle.model.supplySettle.prepaymentApplyAmount").$D("已核销金额"),
              precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
              editor: false,
              formRow: 5,
            },
            {
              fieldCode: "look",
              fieldName: $T("ssta.supplySettle.model.supplySettle.prepaymentRecord").$D("核销记录"),
              render: () => <span style="color: var(--color-success);">
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
    // 基本信息
    async fetchData() {
      await getPrePayHeader(this.changeReqId, {
        "customizeUnitCode":"SSTA.PURCHASE_SETTLE_DETAIL.PRE_BASIC_INFO,SSTA.PURCHASE_SETTLE_DETAIL.PRE_PAYMENT_INFO,SSTA.PURCHASE_SETTLE_DETAIL.OTHER_INFO_PRE,SMBL.WORKFLOW.ADVANCE_PAY.BASIC,SMBL.WORKFLOW.ADVANCE_PAY.BASIC_DETAIL,SMBL.WORKFLOW.ADVANCE_PAY.TRADINGPARTY,SMBL.WORKFLOW.ADVANCE_PAY.PAYMENT,SMBL.WORKFLOW.ADVANCE_PAY.ATTACHMENT",
      }).then((res) => {
        const { jumpPoFlag, prepaymentType } = res;
        this.jumpPoFlag = jumpPoFlag;
        this.prepaymentType = prepaymentType;
        this.basicInfoDataSet.setData([ { ...res } ]);
      });
    },
    // 获取 自定义语言
    getLanguageDefine(key) {
      const languageList = {
        "noData": $T("hipspfm.common.view.message.title.noData").$D("暂无数据"),
        "basicInfo": $T("ssta.supplySettle.view.title.basicInfo").$D("基础信息"),
        "transactionParty": $T("ssta.supplySettle.view.title.transactionParty").$D("交易方信息"),
        "collectionInfo": $T("ssta.supplySettle.view.title.collectionInfo").$D("收款信息"),
        "transactionAmount": $T("ssta.supplySettle.view.title.transactionAmount").$D("交易金额信息"),
        "advancePaymentApproval": $T("ssta.supplySettle.view.title.advancePaymentApproval").$D("预付款申请审批"),
        "viewRecord": $T("ssta.supplySettle.view.message.button.viewRecord").$D("查看记录"),
        "attachment": $T("ssta.supplySettle.view.title.attachment").$D("附件"),
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
    jumpMyOrder(item) {
      const { associateId, associateNum } = item;
      this.$popup({
        showBack: false,
        showHeader: false,
        content: <PoDetail poHeaderId={associateId} associateNum={associateNum} />,
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.attachment {
  height 28px;
  font-size 14px;
  color #333333;
  line-height 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 8px;
  }

  .icon-chevron-right {
    font-size 16px;
    color val(--color-font-default-b);
  }
  >>> .srm-button-primary {
    color #333 !important;
  }
}
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
</style>