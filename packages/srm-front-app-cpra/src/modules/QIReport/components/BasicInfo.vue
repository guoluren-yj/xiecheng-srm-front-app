<template>
  <div>
    <srm-flex
      v-if="isPageMap.creation"
      v-show="btnTabKeyList.includes(activeBasicKey)"
      justify="end"
      class="tab-item-button">
      <em
        v-show="!relatedDataSet.editFlag"
        class="srm-icon icon-edit"
        @click="relatedDataSet.editFlag = true"/>
      <em
        v-show="!relatedDataSet.editFlag"
        class="srm-icon icon-plus"
        @click="addRelatedData"/>
      <srm-button
        v-show="relatedDataSet.editFlag"
        plain
        type="danger"
        :disabled="relatedDataSet.selected.length === 0"
        @click="deleteRelatedData">
        {{ $T("hzero.common.button.delete").$D("删除") }}
      </srm-button>
      <srm-button
        v-show="relatedDataSet.editFlag"
        plain
        @click="relatedDataSet.editFlag = false">
        {{ $T("hzero.common.button.cancel").$D("取消") }}
      </srm-button>
    </srm-flex>
    <srm-tab-bar
      v-if="basicTabs.length > 1"
      :show-tab="!createFlag"
      :tabs="basicTabs"
      class="tab-bar"
      active-class-name="tab-bar-button-active"
      @indexChange="onRelatedChange"/>
    <div v-for="key in basicKeyList" v-show="activeBasicKey === key" :key="key">
      <srm-form
        v-if="key === 'basicInfo'"
        :data-set="dataSetMap[key]"
        :columns="getColumnsFuncMap[key]()"
        :customize-code="mblUnitCodeMap[key]"/>
      <srm-list
        v-else
        :scrollable="false"
        :show-bottom-bar="false"
        :columns="getColumnsFuncMap[key]()"
        :data-set="dataSetMap[key]"
        :customize-code="mblUnitCodeMap[key]"/>
    </div>
    <srm-popup
      height="100%"
      position="right"
      :show-header="false"
      :visible.sync="detailPopupVisible">
      <srm-form
        customize-type="detail"
        :data-set="detailPopupDataSet"
        :columns="getDetailPupupColumns(true)"
        :customize-code="detailPopupUnitCode"/>
    </srm-popup>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import StatusTag from "@/components/StatusTag";
import { formatColumns } from "../utils";
import RelatedQIReportAdd from "../components/RelatedQIReportAdd";
import RelatedPurOrderAdd from "../components/RelatedPurOrderAdd";
import RelatedQCDocAdd from "../components/RelatedQCDocAdd";
export default {
  modules: [ "hzero.common", "sqam.createRectification", "sqam.common", "smbl.common", "entity.roles", "sodr.sendOrder", "entity.order", "entity.business", "entity.organization", "sodr.common", "sqam.quoteIncomingInspection", "entity.item", "entity.supplier", "entity.company" ],
  name: "BasicInfo",
  inject: [
    "createFlag",
    "isPageMap",
    "headerDs",
    "relatedQIReportDs",
    "relatedPurOrderDs",
    "relatedQCDocDs",
    "relatedQCAffairDs",
    "siteVisitResultDs",
    "appraisalReportDs",
    "supEvaluationFileDs",
    "problemStatusColorMap",
    "dataSetMap",
    "mblUnitCodeMap",
  ],
  data() {
    return {
      activeBasicKey: "basicInfo",
      detailPopupVisible: false,
      detailPopupDataSet: new DataSet(),
      detailPopupUnitCode: null,
      getDetailPupupColumns: () => [],
      basicKeyList: [
        "basicInfo",
        "relatedQIReport",
        "relatedPurOrder",
        "relatedQCDoc",
        "relatedQCAffair",
        "siteVisitResult",
        "appraisalReport",
        "supEvaluationFile",
      ],
      btnTabKeyList: [
        "relatedQIReport",
        "relatedPurOrder",
        "relatedQCDoc",
      ],
    };
  },
  computed: {
    basicTabs() {
      const sourceCode = this.headerDs.current?.get("sourceCode");
      const baseTabs = [
        {
          code: "basicInfo",
          label: this.$T("sqam.common.view.message.title.tab.basicInfo").$D(
            "基础信息"
          ),
        },
        {
          code: "relatedQIReport",
          label: this.$T(
            "sqam.common.view.message.title.tab.relatedRectification"
          ).$D("关联整改报告"),
          dataSet: this.relatedQIReportDs,
        },
        {
          code: "relatedPurOrder",
          label: this.$T(
            "sqam.common.view.message.title.tab.relatedPurchaseOrder"
          ).$D("关联采购订单"),
          dataSet: this.relatedPurOrderDs,
        },
        {
          code: "relatedQCDoc",
          label: this.$T(
            "sqam.common.view.message.title.tab.qualityInspect"
          ).$D("关联质检单"),
          dataSet: this.relatedQCDocDs,
          visible: sourceCode === "INCOMING_INSPECTION",
        },
        {
          code: "relatedQCAffair",
          label: this.$T("sqam.common.view.message.title.tab.trxRcvLine").$D(
            "关联质检事务"),
          dataSet: this.relatedQCAffairDs,
          visible: sourceCode === "TRX_RCV_LINE",
        },
        {
          code: "siteVisitResult",
          label: this.$T(
            "sqam.common.view.message.title.tab.siteInvestigateReport"
          ).$D("现场考察结果"),
          dataSet: this.siteVisitResultDs,
          visible: sourceCode === "SITE_EVAL",
        },
        {
          code: "appraisalReport",
          label: this.$T("sqam.common.view.message.title.tab.siteEval").$D(
            "评估报告"),
          dataSet: this.appraisalReportDs,
          visible: sourceCode === "REPORT_EVAL",
        },
        {
          code: "supEvaluationFile",
          label: this.$T(
            "sqam.common.view.message.title.tab.supEvaluationFile"
          ).$D("供应商考评档案"),
          dataSet: this.supEvaluationFileDs,
          visible: sourceCode === "KPI_EVAL",
        },
      ];
      const filterTabs = baseTabs.reduce((acc, cur) => {
        const { code, label, dataSet, visible = true } = cur || {};
        if (code === "basicInfo") {
          acc.push({ code, label });
        } else {
          const dsLength = dataSet?.totalCount || 0;
          if (visible) {
            const newLabel = `${label} ${dsLength}`;
            if (this.isPageMap.creation) {
              acc.push({ code, label: newLabel });
            } else if (dsLength > 0) {
              acc.push({ code, label: newLabel });
            }
          }
        }
        return acc;
      }, []);
      return filterTabs;
    },
    getColumnsFuncMap() {
      return {
        basicInfo: this.getBasicColumns,
        relatedQIReport: this.getRelatedQIReportColumns,
        relatedPurOrder: this.getRelatedPurOrderColumns,
        relatedQCDoc: this.getRelatedQCDocColumns,
        relatedQCAffair: this.getRelatedQCAffairColumns,
        siteVisitResult: this.getSiteVisitResultColumns,
        appraisalReport: this.getAppraisalReportColumns,
        supEvaluationFile: this.getSupEvaluationFileColumns,
      };
    },
    relatedDataSet() {
      return this.dataSetMap[this.activeBasicKey];
    },
    getBasicColumns() {
      return (detailFlag) => {
        const {
          ouId,
          companyId,
        } = this.headerDs.current?.toData() || {};
        const fieldsList = [
          "problemNum",
          "problemTitle",
          [ "createdName", "creationDate" ],
          "companyId",
          {
            fieldCode: "supplierNum",
            options: { queryParams: { companyId } },
          },
          "icaDemandDate",
          "pcaDemandDate",
          "ouId",
          {
            fieldCode: "invOrganizationId",
            options: { queryParams: { companyId } },
          },
          "sourceCodeMeaning",
          "itemCode",
          "itemName",
          !this.isPageMap.creation && "openDays",
          !this.isPageMap.creation && "icaDelayDays",
          !this.isPageMap.creation && "pcaDelayDays",
          "publishedName",
          {
            fieldCode: "purOrganizationId",
            options: { queryParams: { ouId, companyId } },
          },
          "remark",
          !this.isPageMap.creation && "approvedRemark",
        ];
        if (detailFlag) {
          delete fieldsList[0];
          fieldsList.unshift("problemNum", "problemStatusMeaning");
        }
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          editorFlag: this.isPageMap.creation,
          onItemClick: () => this.onClickItem("basicInfo"),
        });
      };
    },
    getRelatedQIReportColumns() {
      const fieldsList = [
        "problemNum",
        "problemTitle",
        [ "itemCode", "itemName" ],
        [ "creationDate", "createdName" ],
        "companyName",
        "ouName",
        "invOrganizationName",
        "sourceNum",
        "problemDetail",
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        onItemClick: () => this.onClickItem("relatedQIReport"),
      });
    },
    getRelatedPurOrderColumns() {
      const fieldsList = [
        "displayPoNum",
        "statusCodeMeaning",
        "orderTypeName",
        "purchaseAgentName",
        "ouName",
        "organizationName",
        "poNum",
        "pohPcNum",
        "sourceCode",
        "releasedDate",
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        onItemClick: () => this.onClickItem("relatedPurOrder"),
      });
    },
    getRelatedQCDocColumns() {
      const fieldsList = [
        "inspectionNum",
        [ "itemCode", "itemName" ],
        "assessmentResultMeaning",
        "decisionResultMeaning",
        "poNum",
        "transactionNum",
        "creationDate",
        "startDate",
        "endDate"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        onItemClick: () => this.onClickItem("relatedQCDoc"),
      });
    },
    getRelatedQCAffairColumns() {
      const fieldsList = [
        {
          name: "inspectionNum",
          fieldType: "EMPTY",
          render: (_, record) =>
            <SrmListHeader>{`${record.trxNum}|${record.trxLineNum}`}</SrmListHeader>
          ,
        },
        "supplierNum",
        "supplierName",
        "companyName",
        "organizationName",
        "itemCode",
        "itemName",
        "rcvTypeName",
        "quantity",
        "executeReverseQuantity",
        "nodeConfigName",
        "creationDate",
        "sourceHeaderNum",
        "displayTrxNum",
        "sinvLineAttachmentUuid"
      ];
      return (detailFlag) => {
        if (detailFlag) {
          fieldsList[0] = "inspectionNum";
        }
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          onItemClick: () => this.onClickItem("relatedQCAffair"),
        });
      };
    },
    getSiteVisitResultColumns() {
      const fieldsList = [
        "evalNum",
        "evalStatusMeaning",
        "evalDescription",
        "supplierName",
        "companyName",
        "evalTplName",
        "finalScore",
        "grade",
        "approvedDate",
        "creationDate",
        "realName"
      ];
      return (detailFlag) => formatColumns(fieldsList, {
        takeFlag: !detailFlag,
        onItemClick: () => this.onClickItem("siteVisitResult"),
      });
    },
    getAppraisalReportColumns() {
      const fieldsList = [
        {
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { evalStatusMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value || "-"}</span>
                <StatusTag
                  slot="right"
                  text={evalStatusMeaning}
                />
              </SrmListHeader>
            );
          },
        },
        "evalDescription",
        "supplierName",
        "companyName",
        "evalTplName",
        "finalScore",
        "grade",
        "approvedDate",
        "creationDate",
        "realName"
      ];
      return (detailFlag) => {
        if (detailFlag) {
          delete fieldsList[0];
          fieldsList.unshift("evalNum", "evalStatusMeaning");
        }
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          onItemClick: () => this.onClickItem("appraisalReport"),
        });
      };
    },
    getSupEvaluationFileColumns() {
      const fieldsList = [
        {
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { evalStatusMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value || "-"}</span>
                <StatusTag
                  slot="right"
                  text={evalStatusMeaning}
                />
              </SrmListHeader>
            );
          },
        },
        "evalName",
        "evalCycleMeaning",
        "evalDateFrom",
        "evalDateTo",
        "processUserName"
      ];
      return (detailFlag) => {
        if (detailFlag) {
          delete fieldsList[0];
          fieldsList.unshift("evalNum", "evalStatusMeaning");
        }
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          onItemClick: () => this.onClickItem("supEvaluationFile"),
        });
      };
    },
  },
  methods: {
    onRelatedChange(index, oldIndex, code) {
      this.activeBasicKey = code;
    },
    async addRelatedQCDocDataOk(dataSet) {
      const addRecord = dataSet.selected[0];
      if (addRecord) {
        const addData = addRecord.toData();
        const { inspectionId, inspectionNum } = addData;
        const relatedIdList = this.relatedQCDocDs.toData().map((item) => item.inspectionId);
        if (relatedIdList.includes(inspectionId)) {
          this.$notification.open({
            message: `${inspectionNum}${this.$T("sqam.createRectification.view.message.repeat").$D("已存在，请勿重复添加")}`
          });
          return;
        }
        this.relatedQCDocDs.create(addData);
        Object.assign(this.relatedQCDocDs, { totalCount: this.relatedQCDocDs.totalCount + 1 });
        this.relatedAddPopup.onClose();
      }
    },
    async addRelatedDataOk(dataSet) {
      await dataSet.submitSelected();
      this.relatedAddPopup.onClose();
      this.relatedDataSet.refresh();
      this.headerDs.refresh();
    },
    async deleteRelatedData() {
      await this.relatedDataSet.removeSelect();
      this.relatedDataSet.refresh();
    },
    getRelatedAddContent() {
      const { headerDs, activeBasicKey, decisionResults } = this;
      const headerData = headerDs.current?.toData() || {};
      switch (activeBasicKey) {
      case "relatedQIReport":
        return (
          <RelatedQIReportAdd
            headerData={headerData}
            addOk={this.addRelatedDataOk}
          />
        );
      case "relatedPurOrder":
        return (
          <RelatedPurOrderAdd
            headerData={headerData}
            addOk={this.addRelatedDataOk}
          />
        );
      case "relatedQCDoc":
        return (
          <RelatedQCDocAdd
            headerData={headerData}
            decisionResults={decisionResults}
            addOk={this.addRelatedQCDocDataOk}
          />
        );
      default:
      }
    },
    addRelatedData() {
      this.relatedAddPopup = this.$popup({
        position: "right",
        content: this.getRelatedAddContent(),
      });
    },
    onClickItem(type) {
      this.detailPopupDataSet = this.dataSetMap[type];
      this.detailPopupUnitCode = this.mblUnitCodeMap[type];
      this.getDetailPupupColumns = this.getColumnsFuncMap[type];
      this.detailPopupVisible = true;
    },
  }
};
</script>
<style lang="stylus" scoped>
.tab-item-button {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  gap: 12px;

  .srm-icon {
    font-size: 20px;
    color: var(--font-color-disable);
  }
}
.tab-bar {
  ::v-deep {
    .tab-bar-button-active {
      stroke: var(--font-color-primary);
      background: var(--color-ghost-primary);
      color: var(--font-color-primary);
      border-radius: 12px;
      height: 24px;
      padding: 0 8px;

      &:first-child {
        margin-left: 15px;
      }

      &:last-child {
        margin-right: 15px;
      }
    }
  }
}
</style>