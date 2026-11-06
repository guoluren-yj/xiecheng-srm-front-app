<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('sqam.common.view.panel.baseInfo').$D('基本信息')">
        <div @click="onClickItem('basic')">
          <srm-form customize-code="SMBL.MY_INITIATED_CLAIM.DETAIL_BAISC" :data-set="claimHeaderDs" :columns="getBasicColumns()" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('sqam.common.view.panel.claimInfo').$D('索赔信息')">
        <srm-form show-default-detail customize-code="SMBL.MY_INITIATED_CLAIM.DETAIL_CLAIM" :data-set="claimHeaderDs" :columns="getClaimColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('sqam.common.view.panel.claimItem').$D('索赔项目')">
        <srm-list
          customize-code="SMBL.MY_INITIATED_CLAIM.DETAIL_LINE"
          :data-set="claimLineDs"
          :columns="getLineColumns()"
          @itemClick="onClickItem('line')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="claimHeaderDs.current && claimHeaderDs.current.get('appealedFlag')"
        :label="$T('sqam.common.view.panel.complaintHandle').$D('申诉处理')">
        <srm-form show-default-detail customize-code="SMBL.MY_INITIATED_CLAIM.DETAIL_APPEAL" :data-set="claimHeaderDs" :columns="getAppealColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="claimHeaderDs.current && claimHeaderDs.current.get('confirmVisibleFlag')"
        :label="$T('sqam.common.model.feedbackOpinion').$D('反馈意见')">
        <srm-form show-default-detail :data-set="claimHeaderDs" :columns="getFeedbackColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="claimHeaderDs.current && claimHeaderDs.current.get('statusCode') === 'FINISHED'"
        :label="$T('sqam.common.model.claimResultExc').$D('索赔结果执行')">
        <srm-form show-default-detail :data-set="claimHeaderDs" :columns="getExecuteColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('hzero.common.view.title.attachment').$D('附件')">
        <div class="attachment-section" @click="showAttachmentList">
          <span class="srm-icon icon-other" />
          <span class="attachment-section-text">
            {{
              $T("smbl.common.view.button.checkAttachmentList").$D(
                "查看附件列表"
              )
            }}
          </span>
          <span class="srm-icon icon-chevron-right" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('hzero.common.view.button.operationRecord').$D('操作记录')">
        <history-record-tiled
          :action-data="historyData"
          operation-meaning-field-name="processTypeMeaning"
          process-remark-field-name="processRemark"
          operator-field-name="processUserName"
          process-date-field-name="processedDate"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="approveData.length > 0"
        :label="$T('smbl.common.button.taskDetail.record').$D('审批记录')">
        <history-record-tiled
          :action-data="approveData"
          operator-field-name="assigneeName"
          operation-meaning-field-name="action"
          process-date-field-name="endTime"
          process-remark-field-name="comment" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import SrmAttachmentTabs from "srm-mobile-ui/packages/srm-attachment-button/srm-attachment-tabs";
import { isObject, isArray, isString, take, isEmpty, fromPairs } from "lodash";
import StatusTag from "@/components/StatusTag";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { queryApproveRecords, queryHistoryRecords, queryMapIdpValue } from "../api";
import {
  claimHeaderDS,
  claimLineDS,
} from "../datasource/myInitiatedClaimDetailDS";

export default {
  modules: [
    "sqam.common",
    "hzero.common",
    "entity.company",
    "entity.business",
    "entity.organization",
    "entity.supplier",
    "ssta.common",
    "entity.item",
    "smbl.common",
  ],
  name: "MyInitiatedClaimDetail",
  components: { HistoryRecordTiled },
  data() {
    const { formHeaderId } = this.$route.query;
    return {
      formHeaderId,
      historyData: [],
      approveData: [],
      statusTypeMap: {},
      approveActionMap: {},
      claimHeaderDs: new DataSet(claimHeaderDS(formHeaderId)),
      claimLineDs: new DataSet(claimLineDS(formHeaderId)),
    };
  },
  computed: {
    getClaimColumns() {
      const fieldsList = [
        "dataSourceNum",
        "totalAmount",
        [ "currencyCode", "dataSourceCodeMeaning" ],
        "expenseProcessTypeMeaning",
        "feedbackDate",
        "actualFeedbackDate",
      ];
      return this.formatListColumns(fieldsList, { showLabelTop: true });
    },
    getAppealColumns() {
      const fieldsList = [
        "appealContentMeaning",
        "appealOpinion",
        [ "applyTimes", "supplierAttachmentUuid" ],
        "appealedDate",
        "appealHandledDate",
        "appealHandleActionMeaning",
        "appealHandleOpinion",
      ];
      return this.formatListColumns(fieldsList, { showLabelTop: true });
    },
    getFeedbackColumns() {
      return [
        { fieldCode: "feedbackOpinion" },
        { fieldCode: "supplierConfirmUuid" },
      ];
    },
    getExecuteColumns() {
      return [
        { fieldCode: "resultRemark" },
        { fieldCode: "resultAttachmentUuid" },
      ];
    },
  },
  created() {
    this.fetchLookupData();
    this.fetchHistoryRecords();
    this.fetchApproveRecords();
  },
  methods: {
    getBasicColumns(detailFlag) {
      const fieldsList = [
        {
          fieldCode: "formNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { statusCodeMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value}</span>
                <StatusTag
                  slot="right"
                  text={statusCodeMeaning}
                  color={this.statusTypeMap[record.statusCode]}
                />
              </SrmListHeader>
            );
          },
        },
        "formTitle",
        "companyName",
        "supplierCompanyName",
        [ "createName", "claimTypeName" ],
        "creationDate",
        "ouName",
        "invOrganizationName",
        "purchaseAgentName",
        "claimDesc",
      ];
      if (detailFlag) {
        delete fieldsList[0];
        fieldsList.unshift("formNum", "statusCodeMeaning");
        return this.formatDetailColumns(fieldsList);
      }
      return this.formatListColumns(fieldsList);
    },
    getLineColumns(detailFlag) {
      const claimAmountMaintainMode = this.claimHeaderDs.current?.get(
        "claimAmountMaintainMode"
      );
      const fieldsList = [
        {
          fieldCode: "claimItemNum",
          fieldType: "EMPTY",
          render: (value, record, field) => {
            const { displayLineNum } = record;
            return (
              <SrmListHeader>
                <span>
                  {field.fieldName}： {value}
                </span>
                <StatusTag slot="right" color="info" text={displayLineNum} />
              </SrmListHeader>
            );
          },
        },
        "claimItemDesc",
        "itemCode",
        "itemName",
        [ "uomCodeAndName", "quantity" ],
        "occurDate",
        "lineExplain",
        claimAmountMaintainMode === "netPrice" && "netPrice",
        claimAmountMaintainMode === "taxIncludedPrice" && "taxIncludedPrice",
        "taxRate",
        "lineAmount",
        "taxIncludedLineAmount",
        "associateItemCode",
        "associateItemUomCodeAndName",
        "associateItemQuantity",
        "lineRemark",
        "fromInspectionNum",
        "specifications",
        "model",
      ];
      if (detailFlag) {
        delete fieldsList[0];
        fieldsList.unshift("displayLineNum", "claimItemNum");
        return this.formatDetailColumns(fieldsList);
      }
      return this.formatListColumns(fieldsList);
    },
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        statusTypeMap: "SQAM.CLAIM_STATUS_CODE",
        approveActionMap: "HWFP.APPROVAL.ACTION",
      }).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        Object.entries(res).forEach(([ key, data ]) => {
          this[key] = fromPairs(
            data.map(({ value, tag, meaning } = {}) => [
              value,
              key === "statusTypeMap" ? tag : meaning,
            ])
          );
        });
      }
    },
    async fetchHistoryRecords() {
      const res = await queryHistoryRecords(this.formHeaderId).catch(
        (err) => {
          throw err;
        }
      );
      if (res && res.content) {
        this.historyData = res.content.map((item) => {
          const { processRemarkList } = item;
          const otherRemark = isArray(processRemarkList) && !isEmpty(processRemarkList) ? item.processRemarkList.join("\n") : "";
          return {
            ...item,
            processRemark: "\n" + otherRemark,
          };
        });
      }
    },
    async fetchApproveRecords() {
      const res = await queryApproveRecords(this.formHeaderId).catch(
        (err) => {
          throw err;
        }
      );
      if (res) {
        this.approveData = res.map((item) => {
          const { action, comment } = item;
          return {
            ...item,
            action: this.approveActionMap[action] || action,
            comment: "\n" + (comment?.split("/end")?.join("\n") || "")
          };
        });
      }
    },
    onClickItem(key) {
      let dataSet, getColumnsFunc, customizeCode;
      switch (key) {
      case "basic":
        dataSet = this.claimHeaderDs;
        getColumnsFunc = this.getBasicColumns;
        customizeCode = "SMBL.MY_INITIATED_CLAIM.DETAIL_BASIC_POPUP";
        break;
      case "line":
        dataSet = this.claimLineDs;
        getColumnsFunc = this.getLineColumns;
        customizeCode = "SMBL.MY_INITIATED_CLAIM.DETAIL_LINE_POPUP";
        break;
      default:
        break;
      }
      this.$popup({
        position: "right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={dataSet}
            customizeCode={customizeCode}
            columns={getColumnsFunc(true)}
          />
        ,
      });
    },
    showAttachmentList() {
      this.$popup({
        position: "right",
        content:
          <SrmAttachmentTabs
            attachments={[
              {
                readonly: true,
                uploadButton: "none",
                attachmentUuid: this.claimHeaderDs.current.get(
                  "purchaseAttachmentUuid"
                ),
              },
            ]}
          />
        ,
      });
    },
    formatListColumns(fieldsList, options = {}) {
      const { endRow = 7, showLabelTop = true } = options;
      const filterList = fieldsList.filter((item) => item);
      return take(filterList, endRow).reduce((total, item, formRow) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem, formCol) => {
            if (isObject(childItem)) {
              currentList.push({ formRow, formCol, ...childItem });
            } else if (isString(childItem)) {
              currentList.push({ formRow, formCol, fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push({ formRow, ...item });
        } else if (isString(item)) {
          if (formRow === 0) {
            currentList.push({
              formRow,
              fieldCode: item,
              fieldType: "EMPTY",
              render: (value, _, field) => {
                const content = showLabelTop ?
                  `${field.fieldName}：${value}` :
                  value;
                return <SrmListHeader>{content}</SrmListHeader>;
              },
            });
          } else {
            currentList.push({ formRow, fieldCode: item });
          }
        }
        return total.concat(currentList);
      }, []);
    },
    formatDetailColumns(fieldsList) {
      const filterList = fieldsList.filter((item) => item);
      return filterList.reduce((total, item) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem) => {
            if (isObject(childItem)) {
              currentList.push(item);
            } else if (isString(childItem)) {
              currentList.push({ fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push(item);
        } else if (isString(item)) {
          currentList.push({ fieldCode: item });
        }
        return total.concat(currentList);
      }, []);
    },
  },
};
</script>
<style  lang="stylus" scoped>
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
