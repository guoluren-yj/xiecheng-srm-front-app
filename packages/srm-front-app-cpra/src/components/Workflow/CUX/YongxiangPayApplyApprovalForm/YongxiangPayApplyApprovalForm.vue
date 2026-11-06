<!--
 * @Description: 永祥-付款申请工作流
 * @Date: 2022-04-26 14:34:18
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
-->
<template>
  <srm-scroll-tab class="main-tab">
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.basicInfo').$D('基本信息')">
      <srm-form show-default-detail :data-set="headerDs" :columns="getHeaderColumns"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.detailInfo').$D('明细信息')">
      <srm-list :data-set="lineDs" :columns="getLineColumns" @itemClick="clickItem('line')"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('scux.settlement.view.title.relatedContractInfo').$D('关联合同信息')">
      <srm-list :data-set="contractDs" :columns="getContractColumns" @itemClick="clickItem('contract')"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item v-if="deductionDs" :label="$T('scux.settlement.view.title.deductionAfterSettle').$D('结算后扣款')">
      <srm-list :data-set="deductionDs" :columns="getDeductionColumns" @itemClick="clickItem('deduction')"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('hzero.common.view.title.attachment').$D('附件')">
      <div class="attachment-section" @click="showAttachmentList">
        <span class="srm-icon icon-other" />
        <span class="attachment-section-text">
          {{ $T("smbl.common.view.button.checkAttachmentList").$D("查看附件列表") }}
        </span>
        <span class="srm-icon icon-chevron-right" />
      </div>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('hzero.common.view.button.operationRecord').$D('操作记录')">
      <history-record-tiled
        :action-data="historyData"
        operation-meaning-field-name="actionTypeMeaning"
        process-remark-field-name="comments"
        operator-field-name="creationName"
        process-date-field-name="creationDate"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet, SrmTooltip } from "srm-mobile-ui";
import SrmAttachmentTabs from "srm-mobile-ui/packages/srm-attachment-button/srm-attachment-tabs";
import { isUndefined } from "lodash";
import headerDS from "./datasource/headerDS";
import lineDS from "./datasource/lineDS";
import contractDS from "./datasource/contractDS";
import deductionDS from "./datasource/deductionDS";
import ListItemDetail from "./components/ListItemDetail";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { getHistoryDataApi, fetchSupplierBalance } from "./api";
export default {
  modules: [ "scux.settlement", "scux.contractorAssessKpi", "scux.commercialTermsPre", "hzero.common", "smbl.common" ],
  name: "YongxiangPayApplyApprovalForm",
  components: { HistoryRecordTiled },
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    const { paymentHeaderId, documentType } = this.parameters || {};
    return {
      headerDs: new DataSet(headerDS(paymentHeaderId)),
      lineDs: new DataSet(lineDS(paymentHeaderId)),
      contractDs: new DataSet(contractDS(paymentHeaderId, documentType)),
      deductionDs: null,
      historyData: [],
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "ouName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "initalPaymentAmount",
          editor: false,
        },
        {
          fieldCode: "paymentTypeName",
        },
        {
          fieldCode: "attributeLongtext1",
        },
        {
          fieldCode: "remark",
        },
        {
          fieldCode: "paymentProportion",
          editor: false,
        },
        {
          fieldCode: "taxIncludedAmount",
          editor: false,
        },
        {
          fieldCode: "supplierBalance",
          editor: false,
          render: (val) => {
            if (val) {
              return val;
            }
            return "--";
          }
        },
        {
          fieldCode: "errorMsg",
          fieldType: "EMPTY",
          render: (val) =>
            <div>
              <a style={{ marginRight: "22px", color: "#276ef1" }} onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  this.initDataSet();
                }
              }}>{ this.$T("scux.settlement.created.model.errorMsg").$D("刷新") }</a>
              <SrmTooltip placement="top" title={val} style={{ width: "76%", whiteSpace: "nowrap", display: "inline" }}>
                {val.length > 20 ? `${val.substr(0, 20)}...` : val}
              </SrmTooltip>
            </div>,
          editor: false,
        },
        {
          fieldCode: "planSummaryNum",
        },
        {
      fieldCode: "bankAccountName",
    },
    {
      fieldCode: "bankAccountNum",
    },
    {
      fieldCode: "bankAccountRemarks",
    },
    {
      fieldCode: "totalClaimAmount",
    },
      ];
    },
    getLineColumns() {
      const fieldCodeList = [ "itemName", "itemCode", "taxIncludedLineAmount", "paymentTaxAmount" ];
      return this.formatColumns(fieldCodeList);
    },
    getContractColumns() {
      const fieldCodeList = [ "stageName", "sourceDocNum", "stageCode", "payRatio", "taxIncludedAmount", "occupiedAmount", "expectPaymentDate" ];
      return this.formatColumns(fieldCodeList);
    },
    getDeductionColumns() {
      const fieldCodeList = [ "itemName", "formNum", "fieldTypeDesc", "taxIncludedLineAmount", "occurDate" ];
      return this.formatColumns(fieldCodeList);
    },
  },
  created() {
    this.initDataSet();
    this.initHistory();
  },
  methods: {
    async initDataSet() {
      const { documentType, paymentHeaderId } = this.parameters || {};
      await this.headerDs.refresh();
      if (this.headerDs && this.headerDs.current) {
        const { companyId, supplierNum, settleStatus } = this.headerDs.current.data || {};
        // 获取供应商余额
        if ((documentType === "PAYMENT" || documentType === "PRE_PAYMENT") && settleStatus !== "CONFIRM") {
          const supplierBalance =
                  await fetchSupplierBalance({ companyId, supplierNum });
          if (isUndefined(supplierBalance)) {
            this.headerDs.current.set("errorMsg", this.$T("scux.settlement.view.title.errorMsg").$D("重新刷新或联系系统管理员"));
            return;
          }
          if (supplierBalance?.errorFlag === 1) {
            this.headerDs.current.set("errorMsg", supplierBalance?.errorMessage);
          } else if (supplierBalance?.errorFlag === 0) {
            this.headerDs.current.set("supplierBalance", supplierBalance?.easSupplierBalance);
            this.headerDs.current.set("errorMsg", "");
          } else {
            this.headerDs.current.set("supplierBalance", "");
            this.headerDs.current.set("errorMsg", "");
          }
        } else {
          this.headerDs.current.set("errorMsg", "");
        }
      }
      if (documentType === "PAYMENT") {
        this.deductionDs = new DataSet(deductionDS(paymentHeaderId));
      }
    },
    async initHistory() {
      const { paymentHeaderId } = this.parameters || {};
      const res = await getHistoryDataApi(paymentHeaderId);
      if (res?.content) {
        this.historyData = res.content;
      }
    },
    formatColumns(fieldCodeList) {
      return fieldCodeList.map((fieldCode, index) => index ?
        { fieldCode } :
        { fieldCode, fieldType: "EMPTY", render: (val) => <SrmListHeader>{val}</SrmListHeader> }
      );
    },
    clickItem(dsName) {
      const detailTitleMap = {
        line: this.$T("scux.settlement.view.title.detailInfo").$D("明细信息"),
        contract: this.$T("scux.settlement.view.title.stageInfo").$D("阶段信息"),
        deduction: this.$T("scux.settlement.view.title.deductionInfo").$D("扣款信息"),
      };
      this.$popup({
        showBack: true,
        showHeader: true,
        title: detailTitleMap[dsName],
        content: <ListItemDetail dataSet={this[`${dsName}Ds`]} />,
      });
    },
    showAttachmentList() {
      this.$popup({
        showBack: true,
        showHeader: true,
        title: this.$T("scux.commercialTermsPre.view.button.upload").$D("查看附件"),
        content:
          <SrmAttachmentTabs
            attachments={[
              {
                readonly: true,
                uploadButton: "none",
                attachmentUuid: this.headerDs.current.get("attachmentUuid"),
              }
            ]}
          />
        ,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-popup-content {
  .detail-popup-top {
    min-height: 0;
    border-bottom: 8px solid var(--background-color-empty-second);
    /deep/ .customize {
       font-weight: 600 !important;
    }
  }
}
.attachment-section {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  .icon-other {
    font-size: 28px;
    color: var(--color-other-default-c);
  }
  .attachment-section-text {
    flex-grow: 1;
  }
  .icon-chevron-right {
    font-size: 16px;
  }
}
</style>