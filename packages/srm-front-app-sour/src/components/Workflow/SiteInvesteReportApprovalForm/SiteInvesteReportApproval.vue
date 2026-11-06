<script>
import { getGradeAttachmentApi } from "./api";
import { dateFormat } from "@/utils/index";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import {
  commonDs,
  baseDs,
  scoreDataSet,
  scorePeopleDataSet,
  inspectTeamDataSet,
  materialCategoryDataSet,
  attachmentDataSet,
} from "./datasource/indexDs.js";
import dynamicTable from "./mixins/dynamicTable";
export default {
  modules: [ "sslm.common", "sslm.enterpriseInform", "sslm.supplierDocManage", "smbl.common", "sslm.siteInvestigateReport" ],
  name: "SiteInvesteReportApproval",
  mixins: [ dynamicTable ],
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      appraisalAttachmentList:[],
      appraisalAttachmentCount:0,
      evalGranularity:"",
      evalHeaderId:"",
      // 基本信息
      baseDataSet: new DataSet(commonDs()),
      // 考察物料/品类
      materialCategoryDataSet: new DataSet(commonDs()),
      // 考察小组
      inspectTeamDataSet: new DataSet(commonDs()),
      // 附件信息
      attachmentDataSet: new DataSet(commonDs()),
      // 评分人汇总信息
      scorePeopleDataSet: new DataSet(commonDs()),
      // 评分明细
      scoreDataSet: new DataSet(commonDs()),
    };
  },
  computed: {
    // 基本信息
    getBaseColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.code").$D("考察报告编码"),
          fieldCode: "evalNum",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.feedBack.describe").$D("考察报告描述"),
          fieldCode: "evalDescription",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商"),
          fieldCode: "supplierName",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.feedBack.createdBy").$D("创建人"),
          fieldCode: "realName",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.feedBack.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.feedBack.company").$D("公司"),
          fieldCode: "companyName",
          fieldType: "TEXT",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
          fieldCode: "evalTypeMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.feedBack.template").$D("考察模板"),
          fieldCode: "evalTplName",
          fieldType: "TEXT",
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.surveyTimeFrom").$D("考察时间从"),
          fieldCode: "evalDateFrom",
          fieldType: "TEXT",
          render:(val) => dateFormat(val)
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.surveyTimeTo").$D("考察时间至"),
          fieldCode: "evalDateTo",
          fieldType: "TEXT",
          render:(val) => dateFormat(val)
        },
      ];
      return columns;
    },
    // 考察物料/品类信息
    getMaterialCategoryColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.materialCode").$D("物料编码"),
          fieldCode: "itemCode",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.materialDesc").$D("物料描述"),
          fieldCode: "itemName",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.categoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.category").$D("品类"),
          fieldCode: "itemCategoryName",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.brand").$D("品牌"),
          fieldCode: "brand",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.common.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
    // 考察小组
    getInspectTeamColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.childAccount").$D("子账户"),
          fieldCode: "loginName",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.members").$D("组员"),
          fieldCode: "member",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.model.docManage.department").$D("部门"),
          fieldCode: "department",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.station").$D("岗位"),
          fieldCode: "post",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.contactWay").$D("联系方式"),
          fieldCode: "phone",
          fieldType: "TEXT",
          render:(val, record) => (record.internationalTelMeaning && val ? `${record.internationalTelMeaning} | ` : "") + val
        },
      ];
      return columns;
    },
    // 附件信息
    getAttachmentColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.lnEvalStatusMeaning").$D("上传节点"),
          fieldCode: "lnEvalStatusMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.common.view.attachment.type").$D("附件类型"),
          fieldCode: "attachmentlTypeMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.common.view.attachment.name").$D("附件名称"),
          fieldCode: "attachmentDesc",
          fieldType: "TEXT",
          render: (val, record) => <SrmButton plain rect onClick={() => this.showAttachment(record)}>
            {val}
          </SrmButton>
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.common.view.attachment.size").$D("附件大小(MB)"),
          fieldCode: "attachmentSize",
          fieldType: "TEXT",
          render:(val) => val ? (Number(val) / 1024 / 1024).toFixed(4) : ""
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.common.model.attachment.uploadDate").$D("上传时间"),
          fieldCode: "uploadDate",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.common.model.attachment.uploadName").$D("上传人"),
          fieldCode: "uploadUserName",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
    // 评分人汇总信息
    getscorePeopleColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.name").$D("评分人名称"),
          fieldCode: "respUserName",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.unit").$D("评分人部门"),
          fieldCode: "userDepartmentName",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.totalScore").$D("当前评分人填制总分"),
          fieldCode: "sumScore",
          fieldType: "TEXT",
        },
      ];
      return columns;
    },
    // 评分详情
    getScoreColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.projectCode").$D("考察项目编码"),
          fieldCode: "indicatorCode",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.projectName").$D("考察项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreCriteria").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.projectType").$D("考察项目类型"),
          fieldCode: "indicatorTypeMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlagMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
          fieldCode: "supplierScore",
          fieldType: "TEXT",
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
          fieldCode: "supplierRemarks",
          fieldType: "TEXT",
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
        },
        {
          formRow: 100,
          formCol: 20,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.weight").$D("权重"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
        },
        {
          formRow: 110,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.score").$D("得分"),
          fieldCode: "score",
          fieldType: "TEXT",
        },
        {
          formRow: 120,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.scoreFrom").$D("分值从"),
          fieldCode: "scoreFrom",
          fieldType: "TEXT",
        },
        {
          formRow: 130,
          formCol: 20,
          fieldName: $T("sslm.common.model.archiveFilled.scoreTo").$D("分值至"),
          fieldCode: "scoreTo",
          fieldType: "TEXT",
        },
        {
          formRow: 140,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.defaultScore").$D("缺省分值"),
          fieldCode: "defaultScore",
          fieldType: "TEXT",
        },
        {
          formRow: 150,
          formCol: 20,
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准"),
          fieldCode: "isStandardMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 160,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项"),
          fieldCode: "isVetoMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 170,
          formCol: 20,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.indOptName").$D("评分选项"),
          fieldCode: "indOptName",
          fieldType: "TEXT",
        },
        {
          formRow: 180,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.respRemarks").$D("反馈备注"),
          fieldCode: "respRemarks",
          fieldType: "TEXT",
        },
        {
          formRow: 190,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.common.transformReason").$D("转交原因"),
          fieldCode: "transformReason",
          fieldType: "TEXT",
        },
        {
          formRow: 200,
          formCol: 10,
          fieldName: $T("sslm.siteInvestigateReport.modal.common.gradeAttachment").$D("评分附件"),
          fieldCode: "gradeAttachment",
          fieldType: "TEXT",
          render: (val, record) => <SrmButton plain rect onClick={() => this.showGradeAttachment(record)}>
            {this.$T("smbl.common.button.viewAttachments").$D("查看附件")}
          </SrmButton>
        },
      ];
      return columns;
    },
  },
  mounted() {
    this.$loading.show();
    try {
      const { evalHeaderId, submitUserId } = this.parameters || {};
      this.evalHeaderId = evalHeaderId;
      this.baseDataSet = new DataSet(baseDs({ evalHeaderId }));
      this.baseDataSet.refresh();
      this.scoreDataSet = new DataSet(scoreDataSet({ evalHeaderId, submitUserId }));
      this.scoreDataSet.refresh();
      this.scorePeopleDataSet = new DataSet(scorePeopleDataSet({ evalHeaderId, submitUserId }));
      this.scorePeopleDataSet.refresh();
      this.inspectTeamDataSet = new DataSet(inspectTeamDataSet({ evalHeaderId }));
      this.inspectTeamDataSet.refresh();
      this.materialCategoryDataSet = new DataSet(materialCategoryDataSet({ evalHeaderId }));
      this.materialCategoryDataSet.refresh();
      this.attachmentDataSet = new DataSet(attachmentDataSet({ evalHeaderId }));
      this.attachmentDataSet.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      this.$loading.hide();
    }
  },
  methods: {
    // 附件回调
    showAttachment(record) {
      SrmUtil.previewFile({
        fileName: record.attachmentDesc,
        fileUrl: record.attachmentUrl,
        bucketName: SrmUtil.getDefaultBucketName()
      });
    },
    // 评分附件回调
    showGradeAttachment(record) {
      const userInfo = SrmUtil.getUserInfo();
      const params = {
        evalLineId:record.evalLineId,
        page: 0,
        size: 10000,
        uploadUserId: userInfo.id
      };
      getGradeAttachmentApi(params).then((res) => {
        if (res) {
          this.$showFileList({
            fileList: res.content.map((e) => ({
              fileUrl: e.attachmentUrl,
              fileName: e.attachmentName,
              fileSize: e.attachmentSize,
              creationDate: e.creationDate,
              bucketName: "private-bucket",
            }))
          });
        }
      });
    },
  },
  render() {
    return <div>
      <div style="min-height: 400px;">
        <srm-scroll-tab>
          <srm-scroll-tab-item label={$T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D("基本信息")}>
            <srm-list scrollable={false}
              data-set={this.baseDataSet}
              columns={this.getBaseColumns}
              customize-code="SMBL.WORKFLOW.SITE_INVESTE_REPORT_APPROVAL.BASE_INFO"
              height="auto"
              style={{ height: "auto" }}/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("sslm.siteInvestigateReport.view.tabs.reviewMaterialCategory").$D("考察物料/品类")}>
            <srm-list scrollable={false}
              data-set={this.materialCategoryDataSet}
              columns={this.getMaterialCategoryColumns}
              customize-code="SMBL.WORKFLOW.SITE_INVESTE_REPORT_APPROVAL.MATERIAL_INFO"
              height="auto"
              style={{ height: "auto" }}/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("sslm.siteInvestigateReport.view.tabs.inspectTeam").$D("考察小组")}>
            <srm-list scrollable={false}
              data-set={this.inspectTeamDataSet}
              columns={this.getInspectTeamColumns}
              customize-code="SMBL.WORKFLOW.SITE_INVESTE_REPORT_APPROVAL.INSPECT_TEAM_INFO"
              height="auto"
              style={{ height: "auto" }}/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("sslm.siteInvestigateReport.view.tabs.attachmentInfo").$D("附件信息")}>
            <srm-list scrollable={false}
              data-set={this.attachmentDataSet}
              columns={this.getAttachmentColumns}
              customize-code="SMBL.WORKFLOW.SITE_INVESTE_REPORT_APPROVAL.ATTACHMENT_INFO"
              height="auto"
              style={{ height: "auto" }}/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("sslm.siteInvestigateReport.view.title.scorerInfo").$D("评分人汇总信息")}>
            <srm-list scrollable={false}
              data-set={this.scorePeopleDataSet}
              columns={this.getscorePeopleColumns}
              customize-code="SMBL.WORKFLOW.SITE_INVESTE_REPORT_APPROVAL.SCORE_PEOPLE_INFO"
              height="auto"
              style={{ height: "auto" }}/>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item label={$T("sslm.siteInvestigateReport.view.title.scoreInfo").$D("评分信息")}>
            <srm-list scrollable={false}
              data-set={this.scoreDataSet}
              columns={this.getScoreColumns}
              customize-code="SMBL.WORKFLOW.SITE_INVESTE_REPORT_APPROVAL.SCORE_INFO"
              height="auto"
              style={{ height: "auto" }}/>
          </srm-scroll-tab-item>
          {
            // 渲染配置表的tab
          }
          {
            this.renderModelTablePanel({ relationId:this.evalHeaderId })
          }
        </srm-scroll-tab>
      </div>
    </div>;
  }
};
</script>
