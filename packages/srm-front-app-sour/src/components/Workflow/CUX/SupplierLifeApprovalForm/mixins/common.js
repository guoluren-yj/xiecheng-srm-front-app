import { isArray } from "lodash";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
import { yesOrNoRenderer } from "@/utils/renderer.js";
import { getCategoryDS } from "../datasource/getCategoryDS";
import { getBasicInfoDS } from "../datasource/getBasicInfoDS";
import { getFactoryDS } from "../datasource/getFactoryDS";
import { getInvestigationDS } from "../datasource/getInvestigationDS";
import { getAccessEvaluateDS } from "../datasource/getAccessEvaluateDS";
import { getTrialResultsDS } from "../datasource/getTrialResultsDS";
import { getEcQuestionnaireDS } from "../datasource/getEcQuestionnaireDS";
import { getattachmentDS } from "../datasource/getattachmentDS";
import { queryFactory, queryInvestigationAttachment } from "../api/starbucksSupplierLife";

export default {
  props:{
    changeReqId: {
      type: String | Number,
      default: ""
    },
    parameters:{
      type:Object,
    }
  },
  data() {
    const requisitionId = this.changeReqId || this.$route.query.requisitionId;
    return {
      factoryTabFlag: false, // 工厂清单tab是否展示
      questionnaireFlag: false, // 调查问卷tab是否显示
      visibleFull:false, // 品类信息弹框
      currentCategory:{}, // 品类弹框数据源
      preDataSource:[], // 预审评估数据源
      trialResultsVisible:false, // 预审评估弹框
      trialResultsModalData:{}, // 预审评估弹框数据源
      trialResultsModalColumns:[], // 预审评估弹框columns
      investigationVisible: false, // 调查表弹框
      investigationModalData:{}, // 调查表弹框数据源
      investigationModalColumns:[], // 调查表弹框columns
      categoryDs: new DataSet(getCategoryDS()), // 品类ds
      investigationDs: new DataSet(getInvestigationDS()), // 调查表
      trialResultsDs: new DataSet(getTrialResultsDS()), // 预审评估ds
      accessEvaluateDs: new DataSet(getAccessEvaluateDS()), // 准入评估ds
      factoryDs: new DataSet(getFactoryDS()), // 工厂ds
      basicInfoDs: new DataSet(getBasicInfoDS({ requisitionId })), // 基础信息ds
      ecQuestionnaireDs: new DataSet(getEcQuestionnaireDS({ requisitionId })), // EC问卷调查
      attachmentDs: new DataSet(getattachmentDS({ requisitionId })), // 附件
    };
  },
  beforeMount() {
    const requisitionId = this.changeReqId || this.$route.query.requisitionId;
    this.basicInfoDs.refresh().then(() => {
      if (this.basicInfoDs && this.basicInfoDs.current) {
        const {
          createdBy,
          fromStageCode,
          attributeVarchar8,
          attributeBigint7,
          qualifiedSupRecList = [],
          preIndRespList = [],
          riskIndRespList = [],
          qualifiedAttachmentLines = [],
        } = this.basicInfoDs.current.data;
        // 当前供应商所处阶段不为"合格"时展示，展示问卷页签
        if (fromStageCode !== "QUALIFIED") {
          this.questionnaireFlag = true;
        }
        // 供应商业务类型为"制造厂商"、"二级供应商"
        if ([ "MANUFACTURE", "TIER2" ].includes(attributeVarchar8)) {
          this.factoryTabFlag = true;
        }
        this.preDataSource = preIndRespList.filter((n) => Boolean(n.attributeVarchar7));
        const categoryList = qualifiedSupRecList.filter((n) => n.remark !== "old");
        this.categoryDs.setData(categoryList);
        this.trialResultsDs.setData(preIndRespList.filter((n) => n.evalTplIndCode === "TSTAR001"));
        this.accessEvaluateDs.setData(riskIndRespList);
        this.attachmentDs.setData(qualifiedAttachmentLines);
        // 处理预审评估 list转form
        this.handleTrialResults(preIndRespList);
        // 查询调查表列表
        this.queryInvestigationList({ createdBy, requisitionId, attributeBigint7 });
      }
    });
    queryFactory({ requisitionId }).then((response) => {
      if (response && isArray(response)) {
        const factoryDataSource = response.filter((n) => n.correlatedRequisitionId);
        this.factoryDs.setData(factoryDataSource);
      }
    });
  },
  computed:{
    getBaseInfoColumns() {
      const basicInfo = this.basicInfoDs?.current?.data || {};
      const { attributeVarchar3 = [], attributeTinyint1, attributeVarchar16, attributeVarchar17 } = basicInfo;
      return [
        {
          fieldCode:"attributeVarchar23Meaning",
        },
        {
          fieldCode: "qualifiedNumber",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "attributeVarchar8Meaning",
        },
        {
          fieldCode: "attributeBigint7Meaning",
        },
        {
          fieldCode: "attributeVarchar3Meaning",
        },
        {
          fieldCode: "attributeVarchar13Meaning",
        },
        {
          fieldCode: "attributeVarchar12",
        },
        attributeVarchar16 && {
          fieldCode: "attributeVarchar16Meaning",
        },
        attributeVarchar17 && {
          fieldCode: "attributeVarchar17Meaning",
        },
        {
          fieldCode: "attributeVarchar4Meaning",
        },
        {
          fieldCode: "attributeDate1",
          render:(val) => dateFormat(val),
        },
        attributeVarchar3.includes("NEW/EXPAND_PRODUCT") && {
          fieldCode: "attributeVarchar14",
        },
        {
          fieldCode: "remark",
        },
        attributeTinyint1 && {
          fieldCode: "attributeTinyint1",
          render: yesOrNoRenderer,
        },
        attributeVarchar3.includes("OTHERS") && {
          fieldCode: "attributeVarchar15",
        },
      ].filter(Boolean);
    },
    getCategoryColumns() {
      return [
        {
          fieldCode: "itemCategoryName",
          render: (val) => <srm-flex justify="between" class="category-name-wrap">
            <div class="title">{val}</div>
            <div class="right-arrow-icon srm-icon icon-chevron-right"/>
          </srm-flex>,
        },
        {
          fieldCode: "attributeVarchar2Meaning",
        },
        {
          fieldCode: "adapterProducts",
        },
      ];
    },
    getCategoryModalColumns() {
      const columns = getCategoryDS().fields;
      return columns;
    },
    getFactoryColumns() {
      return [
        {
          fieldCode:"factoryName",
        },
        {
          fieldCode:"factoryAddress",
        },
        {
          fieldCode:"factoryTypeMeaning",
        },
        {
          fieldCode:"factoryStatusMeaning",
        },
      ];
    },
    getAccessEvaluateColumns() {
      return [
        {
          fieldCode: "attributeVarchar18",
        },
        {
          fieldCode: "attributeVarchar16Meaning",
        },
        {
          fieldCode: "attributeVarchar9Meaning",
        },
        {
          fieldCode: "attributeVarchar10Meaning",
        },
        {
          fieldCode: "attributeVarchar11Meaning",
        },
        {
          fieldCode: "attributeVarchar17",
        }
      ];
    },
    getTrialResultsColumns() {
      const basicInfo = this.basicInfoDs?.current?.data || {};
      const { processStatus } = basicInfo;
      return [
        {
          fieldCode:"attributeVarchar7Meaning",
        },
        {
          fieldCode:"attributeLongtext2",
        },
        {
          fieldCode:"attributeVarchar8",
          render:(val, item) => item.attributeVarchar8Meaning,
          editor: (val, item) => item.evalTplIndCode === "TSTAR001" && processStatus === "PRE_EVALUATING",
        },
        {
          fieldCode:"attributeLongtext3",
          editor: (val, item) => item.evalTplIndCode === "TSTAR001" && processStatus === "PRE_EVALUATING",
        },
      ];
    },
    getInvestigationColumns() {
      return [
        {
          fieldCode: "investgNumber",
          render: (val) => <srm-flex justify="between" class="category-name-wrap">
            <div class="title">{val}</div>
            <div class="right-arrow-icon srm-icon icon-chevron-right"/>
          </srm-flex>,
        },
      ];
    },
    getEcQuestionnaireColumns() {
      // 问卷调查数据源
      const questionnaireData = this.ecQuestionnaireDs?.current?.data || {};
      const { rating = "" } = questionnaireData;
      const list = [
        rating !== "LOW" && {
          fieldCode: "respReportAttachmentUuid",
        },
      ].filter(Boolean);
      const columns = [
        // {
        //   fieldCode: "ratingMeaning",
        // },
        ...list,
        {
          fieldCode: "ecEvaluateResult",
        },
        {
          fieldCode: "ecEvaluateRemark",
        },
        {
          fieldCode: "finEvaluateResult",
        },
        {
          fieldCode: "finEvaluateRemark",
        },
      ];
      return columns;
    },
    getattachmentColumns() {
      return [ {
        fieldCode: "attachmentDesc",
      },
      // {
      //   fieldCode: "attachmentSize",
      // },
      // {
      //   fieldCode: "realName",
      // },
      // {
      //   fieldCode: "uploadDate",
      // },
      {
        fieldCode: "remark",
      },
      {
        fieldCode: "attachmentUrl",
        fieldType: "EMPTY",
        render: (val, record) => <srm-flex justify="end" style="padding: 12px 15px 0px 15px; height: 44px; border-top: 1px solid var(--split-line-color-primary);">
          <srm-button style="margin-right: 8px" size="mid" bordered onClick={() => {
            this.$downloadFile(record.attachmentUrl, SrmUtil.getDefaultBucketName(), "scux-lifecycle");
          }}>{$T("hzero.common.button.download").$D("下载")}</srm-button>
          <srm-button size="mid" bordered onClick={() => {
            SrmUtil.previewFile({
              fileName: record.attachmentDesc,
              fileUrl: record.attachmentUrl,
              bucketName: SrmUtil.getDefaultBucketName(),
            });
          }}>{$T("hzero.common.preview").$D("预览")}</srm-button>
        </srm-flex>,
      } ];
    },
  },
  methods:{
    handleCategoryClick(item) {
      this.visibleFull = !this.visibleFull;
      this.currentCategory = item && item.data;
    },
    // 查询调查表列表
    queryInvestigationList({ createdBy, requisitionId, attributeBigint7 }) {
      this.investigationDs.addQueryParameter("createdBy", createdBy);
      this.investigationDs.addQueryParameter("requisitionId", requisitionId);
      this.investigationDs.addQueryParameter("contractSupplierCompanyId", attributeBigint7);
      this.investigationDs.query();
    },
    // 调查表弹框
    handleInvestigationClick(record = {}) {
      if (!this.investigationVisible) {
        const investgHeaderId = record.get("investgHeaderId");
        if (investgHeaderId) {
          queryInvestigationAttachment({ investgHeaderId }).then((res) => {
            if (res && isArray(res)) {
              this.investigationModalColumns = res.map((n, index) => {
                this.investigationModalData[`supplierAttachmentUuid_${index}`] = n.supplierAttachmentUuid;
                return {
                  fieldCode: `supplierAttachmentUuid_${index}`,
                  fieldType: "UPLOAD",
                  showCount: true,
                  fieldName: n.attachmentTypeMeaning,
                };
              });
            }
          });
        }
      }
      this.investigationVisible = !this.investigationVisible;
    },
    // 预审评估弹框
    handleTrialResultsClick() {
      this.trialResultsVisible = !this.trialResultsVisible;
    },
    // 处理预审评估 list转form
    handleTrialResults(preIndRespList = []) {
      const dataSource = preIndRespList.filter((n) => Boolean(n.attributeVarchar7));
      dataSource.forEach((n, index) => {
        this.trialResultsModalData[`attributeVarchar7Meaning_${index}`] = n.attributeVarchar7Meaning;
        this.trialResultsModalData[`attributeLongtext3_${index}`] = n.attributeLongtext3;
        this.trialResultsModalColumns.push(...[
          {
            fieldCode: `attributeVarchar7Meaning_${index}`,
            fieldName: `${n.attributeVarchar5}${$T("scux.starbucks.view.supplierQuery.opinion").$D("意见")}`,
          },
          {
            fieldCode: `attributeLongtext3_${index}`,
            fieldName: $T("scux.supplierQuery.modal.common.directorOpinion").$D("Line Director 评估意见"),
          }
        ]);
      });
    },
  }
};