/* eslint-disable no-console */
// 采购申请工作台 的页面
// import { Exception } from "../../../utils/index";
import { fechAuthReq, getCuszTemplate, queryRoleAuthority } from "../api";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import {
  headerInfoDS,
  detailInfoDS,
  stageInfoDS,
  sampleInfoDs,
} from "../datasource/detailDs";
import SrmAppCore from "srm-front-app-core";
// 定义方法映射关系
const cuxFunctions = {
  // "SRM-SOJO": {
  //   saveMaterialData: saveMaterialDataForSojo,
  // },
};
export default {
  data() {
    return {
      headerInfoDs: new DataSet(headerInfoDS({ isFirstNode: true, readOnly: true })), // 基础信息
      detailInfoDs: new DataSet(detailInfoDS(true)), // 明细信息
      stageInfoDs: new DataSet(stageInfoDS(true)), // 明细信息
      sampleInfoDs: new DataSet(sampleInfoDs(true)), // 明细信息
      actionRecordList: [], // 操作记录
      approveRecordList: [], // 审批记录
      showPage: true,
      source: null, // 来源判断是不是工作流表单
      type: "readOnly",
      nodeList: [],
      queryFlag: 0,
      operateFlag: 0,
      nodeSkipFlag: 0,
      nodeEarlyTerminationFlag: 0,
      testingResultEnterFlag:0, // 样品信息是否展示
      nodeCode: null,
      isFirstNode: false,
      latestNode: true,
      sourcePlatform: "SRM",
      itemAuthFeeHeaderId: null,
      authFeeStatusCode: null,
      stageCode: "PENDING",
      queryTemplateInfo: {},
      templateInfo: {},
      isTemplate: false,
      statusType: {
        WAIT_FEEDBACK: "warn",
        AUTHENTIGATION_APPROVAL: "warn",
        AUTHENTICATION_APPROVED:"success",
        AUTHENTICATION_REJECTED:"warn",
        CANCEL:"warn",
        EARLY_TERMINATION:"warn",
        FINAL_AUTHENTICATION_COMPLETE:"warn",
        PREAPPROVAL:"success",
        PREAPPROVAL_REJECTED:"warn",
        TEST_RESULTS_TO_BE_ENTERED:"warn",
        SAMPLE_DELIVERY_WAIT_FEEDBACK:"warn",
        FEEDBACK_REJECTED:"warn",
      },
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "feeHeaderNum",
              fieldType: "TEXT",
              render: (val, item) => <SrmListHeader show-open-tag={false} class="feed-num-header">
                 <span style={{fontWeight: 400, fontSize: 14}}>{val || "-"}</span>
                <srm-tag class="tag-ste" slot="right" size="mid" type={this.statusType[item.authFeeStatusCode]}>{item.authFeeStatusCodeMeaning}</srm-tag>
                <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
              </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "createdByName",
              fieldType: "TEXT",
              formRow: 30,
            },
            {
              fieldCode: "creationDate",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "strategyName",
              fieldType: "TEXT",
              formRow: 45,
              render: (val, item) =>
                `${val}【${$T("hzero.common.components.dataAudit.version").$D(
                  "版本"
                )}${item.strategyVersionNumber}】`,
            },
            {
              fieldCode: "sampleType",
              fieldType: "TEXT",
              formRow: 46,
              render: (val, item) =>
                `${item.sampleTypeMeaning || ""}`,
            },
            {
              fieldCode: "receivingDepartmentName",
              formRow: 47,
            },
            {
              fieldCode: "sampleRecipient",
              fieldType: "TEXT",
              formRow: 48,
            },
            {
              fieldCode: "recipientContactNumber",
              fieldType: "TEXT",
              formRow: 49,
            },
            {
              fieldCode: "companyName",
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "displaySupplierName",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 70,
            },
            {
              fieldCode: "unitName",
              fieldType: "TEXT",
              formRow: 80,
            },
            {
              fieldCode: "prTypeName",
              fieldType: "TEXT",
              formRow: 90,
            },
            {
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 100,
            },
            {
              fieldCode: "exportExternalStatusCodeMeaning",
              // fieldType: "TEXT",
              formRow: 110,
            },
            {
              fieldCode: "exportExternalErrorReason",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "sourcePlatformMeaning",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "sampleDeliveryAddress",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "reqRemark",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "externalNum",
              fieldType: "TEXT",
              formRow: 190,
            },
            {
              fieldCode: "certificationConclusion",
              fieldType: "TEXT",
              formRow: 130,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "feeHeaderNum",
              fieldType: "TEXT",
              render: (val, item) =>
                <SrmListHeader showOpenTag={false}>
                 <span style={{fontWeight: 400, fontSize: 14}}>{val || "-"}</span>
                  <srm-tag class="tag-ste" slot="right" size="mid" type={this.statusType[item.authFeeStatusCode]}>{item.authFeeStatusCodeMeaning}</srm-tag>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "createdByName",
              fieldType: "TEXT",
              formRow: 30,
            },
            {
              fieldCode: "creationDate",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "strategyName",
              fieldType: "TEXT",
              formRow: 45,
              render: (val, item) =>
                `${val}【${$T("hzero.common.components.dataAudit.version").$D(
                  "版本"
                )}${item.strategyVersionNumber}】`,
            },
            {
              fieldCode: "sampleType",
              fieldType: "TEXT",
              formRow: 46,
              render: (val, item) =>
                `${item.sampleTypeMeaning || ""}`,
            },
            {
              fieldCode: "receivingDepartmentName",
              formRow: 47,
            },
            {
              fieldCode: "sampleRecipient",
              fieldType: "TEXT",
              formRow: 48,
            },
            {
              fieldCode: "recipientContactNumber",
              fieldType: "TEXT",
              formRow: 49,
            },
            {
              fieldCode: "companyName",
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "displaySupplierName",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 70,
            },
            {
              fieldCode: "unitName",
              fieldType: "TEXT",
              formRow: 80,
            },
            {
              fieldCode: "prTypeName",
              fieldType: "TEXT",
              formRow: 90,
            },
            {
              fieldCode: "remark",
              fieldType: "TEXT",
              formRow: 100,
            },
            {
              fieldCode: "exportExternalStatusCodeMeaning",
              // fieldType: "TEXT",
              formRow: 110,
            },
            {
              fieldCode: "exportExternalErrorReason",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "sourcePlatformMeaning",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "sampleDeliveryAddress",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "reqRemark",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "externalNum",
              fieldType: "TEXT",
              formRow: 190,
            },
            {
              fieldCode: "certificationConclusion",
              fieldType: "TEXT",
              formRow: 130,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "datailInfo":
          return [
            {
              fieldCode: "feeLineNum",
              fieldType: "TEXT",
              render: (val, item) =>
                <SrmListHeader show-open-tag={false}>
                   <span style={{fontWeight: 400, fontSize: 14}}>{val || "-"}</span>
                  <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 30,
            },
            {
              fieldCode: "itemCode",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "itemName",
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "formalItemCode",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "formalItemName",
              fieldType: "TEXT",
              formRow: 70,
            },
            {
              fieldCode: "uomName",
              fieldType: "TEXT",
              formRow: 80,
            },
            {
              fieldCode: "quantity",
              fieldType: "TEXT",
              formRow: 90,
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "neededDate",
              fieldType: "TEXT",
              formRow: 100,
            },
            {
              fieldCode: "feedbackDate",
              fieldType: "TEXT",
              formRow: 105,
            },
            {
              fieldCode: "poNum",
              fieldType: "TEXT",
              formRow: 110,
            },
            {
              fieldCode: "sourceNum",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "sourcePrice",
              fieldType:  "INPUT_NUMBER",
              render: (val) => SrmUtil.getNumberLocalized(val),
              formRow: 130,
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 10,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "certificationConclusion",
              fieldType: "TEXT",
              formRow: 170,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "datailInfoDetail":
          return [
            {
              fieldCode: "feeLineNum",
              fieldType: "TEXT",
              formRow: 10,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 30,
            },
            {
              fieldCode: "itemCode",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "itemName",
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "formalItemCode",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "formalItemName",
              fieldType: "TEXT",
              formRow: 70,
            },
            {
              fieldCode: "uomName",
              fieldType: "TEXT",
              formRow: 80,
            },
            {
              fieldCode: "quantity",
              fieldType: "TEXT",
              formRow: 90,
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "neededDate",
              fieldType: "TEXT",
              formRow: 100,
            },
            {
              fieldCode: "feedbackDate",
              fieldType: "TEXT",
              formRow: 105,
            },
            {
              fieldCode: "poNum",
              fieldType: "TEXT",
              formRow: 110,
            },
            {
              fieldCode: "sourceNum",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "sourcePrice",
              fieldType:  "INPUT_NUMBER",
              render: (val) => SrmUtil.getNumberLocalized(val),
              formRow: 130,
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           style: {fontSize:12},
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 160,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "certificationConclusion",
              fieldType: "TEXT",
              formRow: 170,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "sampleInfo":
          return [
            {
              fieldCode: "feeSampleNum",
              render: (val, item) =>
                <SrmListHeader show-open-tag={false}>
                  <span>{item.feeSampleNum || "-"}</span>
                  <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "itemCode",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "itemName",
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "formalItemCode",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "formalItemName",
              fieldType: "TEXT",
              formRow: 70,
            },
            {
              fieldCode: "quantity",
              fieldType: "TEXT",
              formRow: 90,
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "neededDate",
              fieldType: "TEXT",
              formRow: 100,
            },
            {
              fieldCode: "expectedDeliveryDate",
              fieldType: "TEXT",
              formRow: 110,
            },
            {
              fieldCode: "sampleDeliveryMethod",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "logisticsTrackingNum",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "testingDepartmentName",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "poNum",
              fieldType: "TEXT",
              formRow: 130,
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 10,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "purchaserRemark",
              fieldType: "TEXT",
              formRow: 150,
            },
            {
              fieldCode: "testingResult",
              fieldType: "TEXT",
              formRow: 150,
              render: (val, item) =>
                `${item.testingResultMeaning || ""}`,
            },
            {
              fieldCode: "testingInstructions",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "testingReportUuid",
              fieldType: "UPLOAD",
              formRow: 170,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
          ];
        case "sampleInfoDetail":
          return [
            {
              fieldCode: "feeSampleNum",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader  show-open-tag={false}>
                  <span>{item.feeSampleNum || "-"}</span>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "itemCode",
              fieldType: "TEXT",
              formRow: 40,
            },
            {
              fieldCode: "itemName",
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "formalItemCode",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "formalItemName",
              fieldType: "TEXT",
              formRow: 70,
            },
            {
              fieldCode: "quantity",
              fieldType: "TEXT",
              formRow: 90,
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "neededDate",
              fieldType: "TEXT",
              formRow: 100,
            },
            {
              fieldCode: "expectedDeliveryDate",
              fieldType: "TEXT",
              formRow: 110,
            },
            {
              fieldCode: "sampleDeliveryMethod",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "logisticsTrackingNum",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "testingDepartmentName",
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "poNum",
              fieldType: "TEXT",
              formRow: 130,
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 10,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "purchaserRemark",
              fieldType: "TEXT",
              formRow: 150,
            },
            {
              fieldCode: "testingResult",
              fieldType: "TEXT",
              formRow: 150,
              render: (val, item) =>
                `${item.testingResultMeaning || ""}`,
            },
            {
              fieldCode: "testingInstructions",
              fieldType: "TEXT",
              formRow: 160,
            },
            {
              fieldCode: "testingReportUuid",
              fieldType: "UPLOAD",
              formRow: 170,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
          ];
        case "nodeInfo":
          return [
            {
              fieldCode: "attachmentName",
              formRow: 30,
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader show-open-tag={false}>
                  {item.attachmentName || "-"}
                </SrmListHeader>,
            },
            {
              fieldCode: "attachmentCode",
              fieldType: "TEXT",
              formRow: 10,
            },
            {
              fieldCode: "requiredFlag",
              fieldType: "TEXT",
              formRow: 40,
              render: (val, item) => item.requiredFlagMeaning,
            },
            {
              fieldCode: "requireUploadDate",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           style: {fontSize:12},
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       style={{fontSize:12}}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           style: {fontSize:12},
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       style={{fontSize:12}}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              canUpload: false,
              showCount: true,
              formRow: 160,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           style: {fontSize:12},
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       style={{fontSize:12}}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
          ];
        case "nodeInfoDetail":
          return [
            {
              fieldCode: "attachmentCode",
              fieldType: "TEXT",
              formRow: 10,
            },
            {
              fieldCode: "attachmentName",
              fieldType: "TEXT",
              formRow: 30,
            },
            {
              fieldCode: "requiredFlag",
              fieldType: "TEXT",
              formRow: 40,
              render: (val, item) => item.requiredFlagMeaning,
            },
            {
              fieldCode: "requireUploadDate",
              fieldType: "TEXT",
              formRow: 60,
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 160,
              canUpload: false,
              showCount: true,
              // render: (val) =>
              //   <SrmFlex>
              //     <srm-attachment-button
              //       attachments={[
              //         {
              //           attachmentUuid: val,
              //           title: $T("hipspfm.common.button.viewAttachments").$D(
              //             "查看附件"
              //           ),
              //           displayType: "grid",
              //           showInfo: true,
              //           uploadButton: "fixed",
              //           readOnly: true,
              //           bucketName: "private-bucket",
              //         },
              //       ]}
              //       show-total
              //       title={$T("hipspfm.common.button.viewAttachments").$D(
              //         "查看附件"
              //       )}
              //     />
              //   </SrmFlex>
              // ,
            },
          ];
        default:
          return [];
        }
      };
    },
  },
  beforeMount() {
    this.source = this.$route.query.source || this.parameters.source || "";
    this.type = this.$route.query.type || this.parameters.type || "readOnly";
    this.nodeCode = this.$route.query.node || this.parameters.node || "";
    this.itemAuthFeeHeaderId =
      this.$route.query.itemAuthFeeHeaderId ||
      this.parameters.itemAuthFeeHeaderId ||
      "";
  },
  mounted() {
    // 编辑/详情
    if (this.itemAuthFeeHeaderId) {
      this.init(this.itemAuthFeeHeaderId);
    }
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
  methods: {
    beforeApprove() {
      // 二开埋点
      // if (
      //   this.over$saveMaterialData &&
      //   typeof this.over$saveMaterialData === "function"
      // ) {
      //   return this.over$saveMaterialData({
      //     headerInfoDs: this.headerInfoDs,
      //     detailInfoDs: this.detailInfoDs,
      //     stageInfoDs: this.stageInfoDs,
      //     templateInfo: this.templateInfo,
      //     stageCode: this.stageCode,
      //     nodeCode: this.nodeCode,
      //   });
      // }
      return true;
    },
    beforeReject() {
      return true;
    },
    // 编辑和详情 初始化
    async init(itemAuthFeeHeaderId) {
      if (itemAuthFeeHeaderId) {
        try {
          // 查询基础信息
          //   const res = await fechAuthReq(itemAuthFeeHeaderId);
          const roleAuthority = await queryRoleAuthority(itemAuthFeeHeaderId);
          if (roleAuthority) {
            const currentNode =
              [ ...roleAuthority ].find(
                (ele) => ele.nodeCode === this.nodeCode
              ) || {};
            this.queryFlag = currentNode?.queryFlag;
            this.operateFlag = currentNode?.operateFlag;
            this.nodeSkipFlag = currentNode?.nodeSkipFlag;
            this.testingResultEnterFlag = currentNode?.testingResultEnterFlag;
            if (currentNode?.queryFlag || this.source === "approving") {
              this.initCustomizeTemplate(itemAuthFeeHeaderId);
            }
            if (!currentNode?.queryFlag && this.source !== "approving") {
              this.$notification.open({
                message: `数据查询失败，失败原因是“没有该单据【${currentNode?.nodeCodeMeaning}】的查询权限，导致无法查询数据，请在策略配置中检查权限后再执行该操作”`,
              });
            }
            if (roleAuthority[0]?.nodeCode === this.nodeCode) {
              this.isFirstNode = true;
            } else {
              this.isFirstNode = false;
            }

            if (
              roleAuthority[
                roleAuthority.findIndex(
                  (ele) => ele.nodeCode === this.nodeCode
                ) + 1
              ]?.itemAuthFeeHeaderId
            ) {
              this.latestNode = false;
            } else {
              this.latestNode = true;
            }
            this.nodeList = roleAuthority;
          }
          // 编辑页面字段调整
        } catch (error) {
          // this.$notification.open({
          //   message: error,
          // });
        }
      } else {
        this.showPage = false;
        this.$notification.open({
          message: $T("hzero.common.notification.noShow.tips").$D(
            "该单据当前状态不可查看"
          ),
        });
      }
    },
    initCustomizeTemplate(itemAuthFeeHeaderId) {
      getCuszTemplate({
        templateCuszMethodCode: "SMDM_ITEM_AUTH_FEE_CUSZ_TEMPLATE",
        businessParam: { itemAuthFeeHeaderId },
      }).then((templateInfoRes) => {
        if (templateInfoRes) {
          const { templateCode, templateVersion, useTemplateCusz } =
            templateInfoRes;
          if (useTemplateCusz) {
            fechAuthReq(itemAuthFeeHeaderId).then((res) => {
              if (res) {
                this.sourcePlatform = res.sourcePlatform;
                this.authFeeStatusCode = res.authFeeStatusCode;
                this.stageCode = "PENDING";
                if (this.source === "approving" || [ "AUTHENTICATION_APPROVAL" ].includes(res.authFeeStatusCode)) {
                  // 状态=审批中
                  this.stageCode = "APPROVEING";
                } else if (this.source === "prequalification" || [ "PREAPPROVAL" ].includes(res.authFeeStatusCode)) {
                  // 状态=预审中
                  this.stageCode = "PREQUALIFICATION";
                } else if (![ "WAIT_FEEDBACK",
                  "AUTHENTICATION_REJECTED",
                  "PREAPPROVAL_REJECTED",
                  "FEEDBACK_REJECTED",
                  "SAMPLE_DELIVERY_WAIT_FEEDBACK", ].includes(res.authFeeStatusCode)) {
                  this.stageCode = "FEEDBACK";
                } else {
                  this.stageCode = "PENDING";
                }
                this.queryTemplateInfo = {
                  cuszTplTemplateCode: templateCode,
                  cuszTplVersion: templateVersion,
                  stageCode: this.stageCode,
                  pageCode: this.nodeCode,
                  cuszTplStageCode: this.stageCode,
                  cuszTplPageCode: this.nodeCode,
                  ...templateInfoRes,
                };
                getCuszTemplate({
                  templateCuszMethodCode: "SMDM_ITEM_AUTH_FEE_MOBILE_CUSZ_TEMPLATE",
                  businessParam: { itemAuthFeeHeaderId },
                }).then((data) => {
                  if (data) {
                    if (data.useTemplateCusz) {
                      this.isTemplate = true;
                    }
                    this.templateInfo = {
                      stageCode: this.stageCode,
                      pageCode: this.nodeCode,
                      ...data,
                    };
                  }
                });
              }
              this.initDataSet();
            });
          } else {
            fechAuthReq(itemAuthFeeHeaderId).then((res) => {
              if (res) {
                this.sourcePlatform = res.sourcePlatform;
                this.authFeeStatusCode = res.authFeeStatusCode;
                this.stageCode = "PENDING";
                if (this.source === "approving" || [ "AUTHENTICATION_APPROVAL" ].includes(res.authFeeStatusCode)) {
                  // 状态=审批中
                  this.stageCode = "APPROVEING";
                } else if (this.source === "prequalification" || [ "PREAPPROVAL" ].includes(res.authFeeStatusCode)) {
                  // 状态=预审中
                  this.stageCode = "PREQUALIFICATION";
                } else if (![ "WAIT_FEEDBACK",
                  "AUTHENTICATION_REJECTED",
                  "PREAPPROVAL_REJECTED",
                  "FEEDBACK_REJECTED",
                  "SAMPLE_DELIVERY_WAIT_FEEDBACK", ].includes(res.authFeeStatusCode)) {
                  this.stageCode = "FEEDBACK";
                } else {
                  this.stageCode = "PENDING";
                }
                getCuszTemplate({
                  templateCuszMethodCode: "SMDM_ITEM_AUTH_FEE_MOBILE_CUSZ_TEMPLATE",
                  businessParam: { itemAuthFeeHeaderId },
                }).then((data) => {
                  if (data) {
                    if (data.useTemplateCusz) {
                      this.isTemplate = true;
                    }
                    this.templateInfo = {
                      stageCode: this.stageCode,
                      pageCode: this.nodeCode,
                      ...data,
                    };
                  }
                });
                this.queryTemplateInfo = {};
              }
              this.initDataSet();
            });
          }
        }
      });
    },
    initDataSet() {
      this.headerInfoDs = new DataSet(headerInfoDS({ readOnly: true })); // 基础信息
      this.detailInfoDs = new DataSet(detailInfoDS(true)); // 明细信息
      this.stageInfoDs = new DataSet(stageInfoDS(true)); // 明细信息
      this.sampleInfoDs = new DataSet(sampleInfoDs(true)); // 明细信息

      this.headerInfoDs.addPathParameter(
        "itemAuthFeeHeaderId",
        this.itemAuthFeeHeaderId
      );
      this.detailInfoDs.addPathParameter(
        "itemAuthFeeHeaderId",
        this.itemAuthFeeHeaderId
      );
      this.stageInfoDs.addPathParameter(
        "itemAuthFeeHeaderId",
        this.itemAuthFeeHeaderId
      );
      this.sampleInfoDs.addPathParameter(
        "itemAuthFeeHeaderId",
        this.itemAuthFeeHeaderId
      );

      if (this.stageCode === "APPROVEING") {
        this.headerInfoDs.addQueryParameter("workflowFlag", 1);
        this.detailInfoDs.addQueryParameter("workflowFlag", 1);
        this.stageInfoDs.addQueryParameter("workflowFlag", 1);
        this.sampleInfoDs.addQueryParameter("workflowFlag", 1);
      }

      this.headerInfoDs.addQueryParameter(
        "customizeUnitCode",
        "SMDM_ITEM_FEEDBACK_DETAIL.BASEINFO"
      );
      this.detailInfoDs.addQueryParameter(
        "customizeUnitCode",
        "SMDM_ITEM_FEEDBACK_DETAIL.DETAILINFO"
      );
      this.sampleInfoDs.addQueryParameter(
        "customizeUnitCode",
        "SMDM_ITEM_FEEDBACK_DETAIL.SAMPLE"
      );
      this.stageInfoDs.addQueryParameter(
        "customizeUnitCode",
        "SMDM_ITEM_FEEDBACK_DETAIL.STAGEINFO"
      );

      Object.keys(this.queryTemplateInfo).forEach((key) => {
        this.headerInfoDs.addQueryParameter(key, this.queryTemplateInfo[key]);
        this.detailInfoDs.addQueryParameter(key, this.queryTemplateInfo[key]);
        this.stageInfoDs.addQueryParameter(key, this.queryTemplateInfo[key]);
        this.sampleInfoDs.addQueryParameter(key, this.queryTemplateInfo[key]);
      });
      this.queryData();
    },
    queryData() {
      this.headerInfoDs.refresh();
      this.detailInfoDs.refresh();
      this.stageInfoDs.refresh();
      this.sampleInfoDs.refresh();
    },
  },
};
