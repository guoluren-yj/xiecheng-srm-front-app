/* eslint-disable no-console */
// 采购申请工作台 的页面
import { Exception } from "../../../utils/index";
import { fechAuthReq, getCuszTemplate, queryRoleAuthority } from "../api";
import { DataSet, $T, SrmUtil, http } from "srm-mobile-ui";
import {
  headerInfoDS,
  detailInfoDS,
  stageInfoDS,
  sampleInfoDs,
} from "../datasource/detailDs";

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
      testingResultEnterFlag: 0, // 样品行信息是否展示逻辑
      nodeCode: null,
      isFirstNode: true,
      latestNode: true,
      sourcePlatform: "SRM",
      itemAuthReqHeaderId: null,
      authReqStatusCode: null,
      stageCode: "PENDING_AUTHS",
      queryTemplateInfo: {},
      templateInfo: {},
      isTemplate: false,
      statusType: {
        PENDING: "warn",
        SUBMITTED: "success",
        APPROVED: "warn",
        AUTHENTICATION_APPROVAL: "warn",
        AUTHENTICATION_APPROVED: "warn",
        EARLY_TERMINATION: "success",
        FINAL_AUTHENTICATION_COMPLETE: "success",
        SUCCESS: "success",
        CANCEL: "warn",
        REJECTED: "warn",
        AUTHENTICATION_REJECTED: "warn",
        ERROR: "warn",
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
              fieldCode: "reqHeaderNum",
              render: (val, item) => <SrmListHeader show-open-tag={false}>
                <span class="title-text">{val || "-"}</span>
                <srm-tag class="tag-ste" slot="right" size="mid" type={this.statusType[item.authReqStatusCode]}>{item.authReqStatusCodeMeaning}</srm-tag>
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
              fieldCode: "sampleDeliveryAddress",
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
              fieldCode: "itemAuthReqHeaderMRList",
              formRow: 130,
              editor: false,
            },
            {
              fieldCode: "externalNum",
              formRow: 130,
              editor: false,
            },
            {
              fieldCode: "feeExternalNum",
              formRow: 130,
              editor: false,
            },
            {
              fieldCode: "certificationConclusion",
              formRow: 130,
              editor: false,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "reqHeaderNum",
              fieldType: "TEXT",
              formRow: 10,
            },
            {
              fieldCode: "authReqStatusCodeMeaning",
              fieldType: "TEXT",
              formRow: 20,
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
              fieldCode: "sampleDeliveryAddress",
              fieldType: "TEXT",
              formRow: 49,
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
              formRow: 48,
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
              formRow: 110,
            },
            {
              fieldCode: "exportExternalErrorReason",
              formRow: 120,
            },
            {
              fieldCode: "itemAuthReqHeaderMRList",
              formRow: 130,
              editor: false,
            },
            {
              fieldCode: "externalNum",
              formRow: 130,
              editor: false,
            },
            {
              fieldCode: "feeExternalNum",
              formRow: 130,
              editor: false,
            },
            {
              fieldCode: "certificationConclusion",
              formRow: 130,
              editor: false,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "datailInfo":
          return [
            {
              fieldCode: "reqLineNum",
              fieldType: "TEXT",
              render: (val, item) =>
                <SrmListHeader show-open-tag={false}>
                  <span>{item.reqLineNum || "-"}</span>
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
              fieldType:  "TEXT",
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
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "certificationConclusion",
              formRow: 160,
              editor: false,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "datailInfoDetail":
          return [
            {
              fieldCode: "reqLineNum",
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
              fieldType:  "TEXT",
              formRow: 130,
              render: (val) => SrmUtil.getNumberLocalized(val),
            },
            {
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 160,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "certificationConclusion",
              formRow: 160,
              editor: false,
              render: (val, item) =>
                `${item.certificationConclusionMeaning || ""}`,
            },
          ];
        case "nodeInfo":
          return [
            {
              fieldCode: "attachmentName",
              formRow: 1,
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
              fieldCode: "supplierAttRequiredFlag",
              fieldType: "TEXT",
              formRow: 50,
              render: (val, item) => item.supplierAttRequiredFlagMeaning,
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
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 160,
              canUpload: false,
              showCount: true,
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
              fieldCode: "supplierAttRequiredFlag",
              fieldType: "TEXT",
              formRow: 50,
              render: (val, item) => item.supplierAttRequiredFlagMeaning,
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
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 160,
              canUpload: false,
              showCount: true,
            },
          ];
        case "sampleInfo":
          return [
            {
              fieldCode: "reqSampleNum",
              render: (val, item) =>
                <SrmListHeader show-open-tag={false}>
                  <span>{item.reqSampleNum || "-"}</span>
                  <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 150,
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
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
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
            },
          ];
        case "sampleInfoDetail":
          return [
            {
              fieldCode: "reqSampleNum",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.reqSampleNum || "-"}</span>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "categoryName",
              fieldType: "TEXT",
              formRow: 150,
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
            },
            {
              fieldCode: "supplierAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 140,
              formCol: 20,
              canUpload: false,
              showCount: true,
            },
            {
              fieldCode: "nodeAttachmentUuid",
              fieldType: "UPLOAD",
              formRow: 150,
              canUpload: false,
              showCount: true,
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
    this.itemAuthReqHeaderId =
      this.$route.query.itemAuthReqHeaderId ||
      this.parameters.itemAuthReqHeaderId ||
      "";
  },
  mounted() {
    // 编辑/详情
    if (this.itemAuthReqHeaderId) {
      this.init(this.itemAuthReqHeaderId);
    }
  },

  methods: {
    // 编辑和详情 初始化
    async init(itemAuthReqHeaderId) {
      if (itemAuthReqHeaderId) {
        try {
          // 查询基础信息
          //   const res = await fechAuthReq(itemAuthReqHeaderId);
          const roleAuthority = await queryRoleAuthority(itemAuthReqHeaderId);
          if (roleAuthority) {
            const currentNode =
              [ ...roleAuthority ].find(
                (ele) => ele.nodeCode === this.nodeCode
              ) || {};
            this.queryFlag = currentNode?.queryFlag;
            this.operateFlag = currentNode?.operateFlag;
            this.nodeSkipFlag = currentNode?.nodeSkipFlag;
            this.testingResultEnterFlag = currentNode?.testingResultEnterFlag;
            this.nodeEarlyTerminationFlag =
              currentNode?.nodeEarlyTerminationFlag;
            if (currentNode?.queryFlag || this.source === "approving") {
              this.initCustomizeTemplate(itemAuthReqHeaderId);
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
              ]?.itemAuthReqHeaderId
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
    initCustomizeTemplate(itemAuthReqHeaderId) {
      getCuszTemplate({
        templateCuszMethodCode: "SMDM_ITEM_AUTH_CUSZ_TEMPLATE",
        businessParam: { itemAuthReqHeaderId },
      }).then((templateInfoRes) => {
        if (templateInfoRes) {
          const { templateCode, templateVersion, useTemplateCusz } =
            templateInfoRes;
          if (useTemplateCusz) {
            fechAuthReq(itemAuthReqHeaderId).then((res) => {
              if (res) {
                this.sourcePlatform = res.sourcePlatform;
                this.authReqStatusCode = res.authReqStatusCode;
                this.stageCode = "PENDING_AUTHS";
                if (this.source === "approving") {
                  this.stageCode = "APPROVEING";
                } else if (
                  [
                    "EARLY_TERMINATION",
                    "FINAL_AUTHENTICATION_COMPLETE",
                  ].includes(res.authReqStatusCode)
                ) {
                  this.stageCode = "CERTIFIED";
                } else if ("CANCEL" === res.authReqStatusCode) {
                  this.stageCode = "CANCELED";
                } else {
                  this.stageCode = "PENDING_AUTHS";
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
                  templateCuszMethodCode: "SMDM_ITEM_AUTH_MOBILE_CUSZ_TEMPLATE",
                  businessParam: { itemAuthReqHeaderId },
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
            fechAuthReq(itemAuthReqHeaderId).then((res) => {
              if (res) {
                this.sourcePlatform = res.sourcePlatform;
                this.authReqStatusCode = res.authReqStatusCode;
                this.stageCode = "PENDING_AUTHS";
                if (this.source === "approving") {
                  this.stageCode = "APPROVEING";
                } else if (
                  [
                    "EARLY_TERMINATION",
                    "FINAL_AUTHENTICATION_COMPLETE",
                  ].includes(res.authReqStatusCode)
                ) {
                  this.stageCode = "CERTIFIED";
                } else if ("CANCEL" === res.authReqStatusCode) {
                  this.stageCode = "CANCELED";
                } else {
                  this.stageCode = "PENDING_AUTHS";
                }
                getCuszTemplate({
                  templateCuszMethodCode: "SMDM_ITEM_AUTH_MOBILE_CUSZ_TEMPLATE",
                  businessParam: { itemAuthReqHeaderId },
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
      if (this.type !== "readOnly") {
        this.detailInfoDs = new DataSet(detailInfoDS(false)); // 明细信息
        this.stageInfoDs = new DataSet(stageInfoDS(false)); // 明细信息
        this.sampleInfoDs = new DataSet(sampleInfoDs(false));
      }

      if (!this.isFirstNode) {
        this.headerInfoDs = new DataSet(headerInfoDS({ isFirstNode: this.isFirstNode, readOnly: this.type !== "readOnly" })); // 基础信息
      }

      this.headerInfoDs.addPathParameter(
        "itemAuthReqHeaderId",
        this.itemAuthReqHeaderId
      );
      this.detailInfoDs.addPathParameter(
        "itemAuthReqHeaderId",
        this.itemAuthReqHeaderId
      );
      this.stageInfoDs.addPathParameter(
        "itemAuthReqHeaderId",
        this.itemAuthReqHeaderId
      );
      this.sampleInfoDs.addPathParameter(
        "itemAuthReqHeaderId",
        this.itemAuthReqHeaderId
      );

      if (this.stageCode === "APPROVEING") {
        this.headerInfoDs.addQueryParameter("workflowFlag", 1);
        this.detailInfoDs.addQueryParameter("workflowFlag", 1);
        this.stageInfoDs.addQueryParameter("workflowFlag", 1);
        this.sampleInfoDs.addQueryParameter("workflowFlag", 1);
      }

      if ([ "APPROVEING", "CERTIFIED", "CANCELED" ].includes(this.stageCode)) {
        this.headerInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_CERTIFIED.DETAIL_BASEINFO"
        );
        this.detailInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_CERTIFIED.DETAIL_LINEINFO"
        );
        this.stageInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_CERTIFIED.DETAIL_STAGEINFO"
        );
        this.sampleInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_CERTIFIED.DETAIL_SAMPLE"
        );
      } else {
        this.headerInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_PENDING_AUTH.DETAIL_BASEINFO"
        );
        this.detailInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_PENDING_AUTH.DETAIL_LINEINFO"
        );
        this.stageInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_PENDING_AUTH.DETAIL_STAGEINFO"
        );
        this.sampleInfoDs.addQueryParameter(
          "customizeUnitCode",
          "SMDM.ITEM_CERTIFIED.DETAIL_SAMPLE"
        );
      }

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
      if (this.testingResultEnterFlag) {
        this.sampleInfoDs.refresh();
      }
    },
  },
};
