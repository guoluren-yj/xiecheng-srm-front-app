<template>
  <div>
    <!-- 内容区 支持个性化tab -->
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.SITE_INSPECTION_FORM.TABS">
      <!-- 基本信息 -->
      <srm-scroll-tab-item code="basicInfo" :label="$T('sslm.siteInvestigateReport.view.tabs.basicInfo').$D('基本信息')">
        <div class="card" @click="showBasicInfoDetail(headInfo)">
          <customize :columns="getBasicInfoColumns" :data-source="headInfo"
                     code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.BASIC_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 考察物料/品类 -->
      <srm-scroll-tab-item code="reviewMaterialCategory" :label="$T('sslm.siteInvestigateReport.view.tabs.reviewMaterialCategory').$D('考察物料/品类')">
        <div v-for="(item,index) in itemInfo" :key="index" class="card">
          <customize :columns="getItemsInfoColumns" :data-source="item"
                     code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.ITEMS_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 考察小组 -->
      <srm-scroll-tab-item code="inspectTeam" :label="$T('sslm.siteInvestigateReport.view.tabs.inspectTeam').$D('考察小组')">
        <div v-for="(item,index) in groupsInfo" :key="index" class="card">
          <customize :columns="getInspectTeamInfoColumns" :data-source="item"
                     code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.INSPECT_TEAM_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 附件信息 -->
      <srm-scroll-tab-item code="attachmentInfo" :label="$T('sslm.siteInvestigateReport.view.tabs.attachmentInfo').$D('附件信息')">
        <div v-for="(item,index) in attachmentInfo" :key="index" class="card">
          <customize :columns="getAttachmentInfoColumns" :data-source="item"
                     code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.ATTACHMENT_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 评分信息 -->
      <srm-scroll-tab-item code="scoreInfo" :label="$T('sslm.siteInvestigateReport.view.title.scoreInfo').$D('评分信息')">
        <div v-for="(item,index) in lineInfo" :key="index" class="card" @click="showScoreInfoDetail(item,index)">
          <customize :columns="getScoreInfoColumns" :data-source="item"
                     code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.SCORE_INFO"/>
        </div>
      </srm-scroll-tab-item>
      <!-- 考察结果 -->
      <srm-scroll-tab-item code="inspectionResults" :label="$T('hipspfm.workFlowSiteInspect.model.common.inspectionResults').$D('考察结果')">
        <div class="card">
          <customize :columns="getInspectResultInfoColumns" :data-source="headInfo"
                     code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.INSPECTRESULT_INFO"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 基本信息详情弹窗 -->
    <srm-popup height="95%" :visible.sync="headInfoDetailPopup"
               :title="$T('sslm.siteInvestigateReport.view.tabs.basicInfo').$D('基本信息')" rounded>
      <div class="srm-pop-headInfo">
        <li>
          <span>{{ headInfoDetail.evalNum }}</span>
        </li>
        <li>
          <span>{{
            $T('sslm.siteInvestigateReport.modal.mange.describe').$D('考察报告描述')
          }}：{{ headInfoDetail.evalDescription }}</span>
        </li>
        <li>
          <span>{{ $T('sslm.siteInvestigateReport.modal.mange.supplierName').$D('供应商名称') }}：{{
            headInfoDetail.supplierName
          }}</span>
        </li>
      </div>
      <div class="srm-pop-lineInfo">
        <customize-detail :columns="getBasicDetailInfoColumns" :data-source="headInfoDetail"
                          code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.BASIC_DETAIL_INFO"/>
      </div>
    </srm-popup>

    <!-- 评分信息详情弹窗 -->
    <srm-popup height="95%" :visible.sync="lineInfoDetailPopup"
               :title="$T('sslm.siteInvestigateReport.view.title.scoreInfo').$D('评分信息')" rounded>
      <div class="srm-pop-headInfo">
        <li>
          <span>{{
            $T('sslm.siteInvestigateReport.modal.mange.projectCode').$D('考察项目编码')
          }}：{{ lineInfoDetail.indicatorCode }}</span>
        </li>
        <li>
          <span>{{
            $T('sslm.siteInvestigateReport.modal.mange.projectName').$D('考察项目名称')
          }}：{{ lineInfoDetail.indicatorName }}</span>
        </li>
      </div>
      <div class="srm-pop-lineInfo">
        <customize-detail :columns="getScoreDetailInfoColumns" :data-source="lineInfoDetail"
                          code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.SCORE_DETAIL_INFO"/>
      </div>
    </srm-popup>

    <!-- 评分人详情弹窗 -->
    <srm-popup v-if="respsInfo.length > 0" height="95%" :visible.sync="ratingInfoPop"
               :title="$T('sslm.siteInvestigateReport.modal.mange.scorer').$D('评分人')" rounded>
      <div class="srm-pop-lineInfo">
        <div v-for="(item,index) in respsInfo" :key="index">
          <customize-detail :columns="getScorerInfoColumns" :data-source="item"
                            code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.SCORER_INFO"/>
        </div>
      </div>
    </srm-popup>

    <!-- 评分状态 -->
    <srm-popup v-if="respsInfo.length > 0" height="95%" :visible.sync="ratingStatusInfoPop"
               :title="$T('sslm.siteInvestigateReport.modal.mange.scoreStatus').$D('评分状态')" rounded>
      <div class="srm-pop-lineInfo">
        <div v-for="(item,index) in respsInfo" :key="index">
          <customize-detail :columns="getRatingStatusInfoColumns" :data-source="item"
                            code="SMBL.WORKFLOW.SITE_INSPECTION_APPROVAL.RATING_STATUS_INFO"/>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import {
  getSiteInspectionBaseApi,
  getSiteInspectionItemApi,
  getSiteInspectionGroupsApi,
  getSiteInspectionLinesApi,
  getFileInfoApi,
  getSiteInspectionRespsApi,
} from "./api/Spection.js";
import uuid from "uuid";
import { isEmpty } from "lodash";
import IndicatorMaintain from "./component/IndicatorMaintain.vue";
import { renderPreviewBtn } from "@/utils/sslmUtils";
export default {
  modules: [ "hipspfm.common", "sslm.siteInvestigateReport", "hipspfm.workFlowSiteInspect", "smbl.common", "sslm.common", "hzero.common", "sslm.purchaserEvaluationDetail", "sslm.evaluationStrategyDetail", "sslm.purchaserEvaluation" ],
  name: "SiteInspectionApproval",
  // eslint-disable-next-line vue/no-unused-components
  components: { IndicatorMaintain },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    topHeight: {
      type: Number,
      default: 0,
    },
    showFilePop: {
      type: Function,
    },
  },
  data() {
    return {
      uuid: "",
      ratingInfoPop: false,
      ratingStatusInfoPop: false,
      headInfoDetailPopup: false, //基本信息信息详情显示标识
      lineInfoDetailPopup: false, //评分信息详情显示标识
      respsInfo: [], //评分人信息
      headInfo: {}, //基本信息、考察结果信息
      headInfoDetail: {}, //基本信息信息详情
      itemInfo: [], //考察物料、品类信息
      groupsInfo: [], //考察小组信息
      lineInfo: [], //评分信息
      attachmentInfo: [], //附件信息
      lineInfoDetail: {}, //评分信息详情
      scorerInfoDetail: {}, //评分人信息
      lineInfoShow: false,
      userName: [], //抄送人
      resultLinkAttachmentUuid: "", //评审结果附件
    };
  },
  computed: {
    getBasicInfoColumns() {
      return [
        {
          fieldCode: "evalNum",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={true}>
              <span>{record.evalNum}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述"),
          fieldCode: "evalDescription",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
          fieldCode: "evalTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板"),
          fieldCode: "evalTplName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.surveyTime").$D("考察时间"),
          fieldCode: "evalDateFrom",
          render: () => {
            if (this.headInfo.evalDateFrom && this.headInfo.evalDateTo) {
              return this.headInfo.evalDateFrom.substring(0, 10) + " - " + this.headInfo.evalDateTo.substring(0, 10);
            }
            return "";
          }
        },
      ];
    },
    getBasicDetailInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.createDepartment").$D("创建人部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.inventoryOrg").$D("库存组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.warehouse").$D("库房"),
          fieldCode: "inventoryName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
          fieldCode: "evalTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板"),
          fieldCode: "evalTplName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.weightCalculation").$D("权重式计算"),
          fieldCode: "weightedFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.surveyTimeFrom").$D("考察时间从"),
          fieldCode: "evalDateFrom",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.surveyTimeTo").$D("考察时间至"),
          fieldCode: "evalDateTo",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierContact").$D("供应商联系人"),
          fieldCode: "supplierContactor",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierContactInfo").$D("供应商联系方式"),
          fieldCode: "supplierContactPhone",
          render: (val, record) => val ? record.internationalTelMeaning + " | " + val : ""
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierType").$D("供应商类型"),
          fieldCode: "supplierTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierProfile").$D("供应商概况"),
          fieldCode: "supplierOverview",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierRegistAddress").$D("供应商注册地址"),
          fieldCode: "supplierRegisteredAddress",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.actualSurveyAddress").$D("实际考察地址"),
          fieldCode: "evalAddress",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.inspectionInstruct").$D("考察说明"),
          fieldCode: "evalRemark",
        }
      ];
    },
    getItemsInfoColumns() {
      return [
        {
          fieldCode: "itemCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{this.$T("sslm.siteInvestigateReport.modal.mange.materialCode").$D("物料编码")}：{record.itemCode}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.materialDesc").$D("物料描述"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.categoryCode").$D("品类代码"),
          fieldCode: "itemCategoryCode",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.category").$D("品类"),
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.brand").$D("品牌"),
          fieldCode: "brand",
        },
        {
          fieldName: this.$T("hipspfm.workFlowSiteInspect.model.common.note").$D("备注"),
          fieldCode: "remark",
        }
      ];
    },
    getInspectTeamInfoColumns() {
      return [
        {
          fieldCode: "itemCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) => {
            const currentLeaderFlag = record.leaderFlag;
            return (
              <SrmListHeader showOpenTag={false}>
                <span>{this.$T("sslm.siteInvestigateReport.modal.mange.members").$D("组员")}：{record.member}</span>
                <div slot="right">
                  {currentLeaderFlag === 1 &&
                  <span class="status1">{this.$T("hipspfm.workFlowSiteInspect.model.common.leader").$D("组长")}</span>}
                </div>
              </SrmListHeader>
            );
          },
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.department").$D("部门"),
          fieldCode: "department",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.station").$D("岗位"),
          fieldCode: "post",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.contactWay").$D("联系方式"),
          fieldCode: "phone",
          render: (val, record) => val ? record.internationalTelMeaning + " | " + val : ""
        },
        {
          fieldName: this.$T("hipspfm.workFlowSiteInspect.model.common.email").$D("邮箱"),
          fieldCode: "email",
        }
      ];
    },
    getAttachmentInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.lnEvalStatusMeaning").$D("上传节点"),
          fieldCode: "lnEvalStatusMeaning",
        },
        {
          fieldName: this.$T("sslm.common.view.attachment.type").$D("附件类型"),
          fieldCode: "attachmentlTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.attachmentName").$D("附件名称"),
          fieldCode: "attachmentDesc",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.attachmentSize").$D("附件大小(MB)"),
          fieldCode: "attachmentSize",
          render: (value) => {
            if (value) {
              const size = `${value / (1024 * 1024)}`;
              return size.substring(0, 5);
            }
            return 0;
          },
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.uploadedTime").$D("上传时间"),
          fieldCode: "uploadDate",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.uploadedBy").$D("上传人"),
          fieldCode: "uploadUserName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.inside").$D("内部附件（供应商不可见）"),
          fieldCode: "insideFlagMeaning",
        },
        {
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("hzero.common.button.action").$D("操作"),
          fieldCode: "operate",
          render:(val, record) => renderPreviewBtn({
            fielName:record.attachmentDesc,
            fielUrl:record.attachmentUrl,
          })
        },
      ];
    },
    getScoreInfoColumns() {
      return [
        {
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.projectName").$D("考察项目名称"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.scoreType").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.projectType").$D("考察项目类型"),
          fieldCode: "indicatorTypeMeaning",
          fieldType: "TEXT",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.evalStandard").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.supplierEvalFlag").$D("供应商自评指标"),
          fieldCode: "supplierEvalFlagMeaning",
          fieldType: "TEXT",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldCode: "supplierScore",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
          visible:(val, record) => record.supplierEvalFlag,
          formRow: 50,
          formCol: 10,
        },
        {
          fieldCode: "supplierRemarks",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
          visible:(val, record) => record.supplierEvalFlag,
          formRow: 60,
          formCol: 10,
        },
        {
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
          showCount: true,
          visible:(val, record) => record.supplierEvalFlag,
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.weight").$D("权重"),
          fieldCode: "evalWeight",
          fieldType: "TEXT",
          formRow: 80,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人"),
          fieldCode: "scorer",
          formRow: 90,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            const scorerMeaning = this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人");
            return flag ? scorerMeaning : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.showRaterInfoPop(record);
            }}>
              { scorerMeaning }
            </srm-button>;
          }
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreStatus").$D("评分状态"),
          fieldCode: "completeFlag",
          formRow: 100,
          formCol: 10,
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            const completeFlagMeaning = this.lineInfoDetail.completeFlag ? this.$T("sslm.siteInvestigateReport.modal.mange.completed").$D("已完成") : this.$T("sslm.siteInvestigateReport.modal.mange.unfinished").$D("未完成");
            return flag ? completeFlagMeaning : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.showRaterStatusInfoPop(record);
            }}>
              { completeFlagMeaning }
            </srm-button>;
          }
        },
        {
          fieldName: this.$T("sslm.purchaserEvaluationDetail.table.column.label.chidrenMaintain").$D("下级指标"),
          fieldCode: "chidrenMaintain",
          fieldType: "TEXT",
          formRow: 110,
          formCol: 10,
          render: (val, record) => {
            const showFlag = record.children && record.children.length > 0;
            return showFlag ? <srm-button
              plain
              onClick={() => {
                this.maintainChildrenAction(record);
              }}>
              {this.$T("smbl.common.view.button.view").$D("查看")}
            </srm-button> : "-";
          },
        }
      ];
    },
    getScoreDetailInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
          fieldCode: "scoreTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreCriteria").$D("评分标准"),
          fieldCode: "evalStandard",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.projectType").$D("考察项目类型"),
          fieldCode: "indicatorTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.weight").$D("权重"),
          fieldCode: "evalWeight",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人"),
          fieldCode: "scorer",
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            const scorerMeaning = this.$T("sslm.siteInvestigateReport.modal.mange.scorer").$D("评分人");
            return flag ? scorerMeaning : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.showRaterInfoPop(record);
            }}>
              { scorerMeaning }
            </srm-button>;
          }
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreStatus").$D("评分状态"),
          fieldCode: "completeFlag",
          render: (val, record) => {
            const { leafFlag, scoreType } = record || {};
            const flag = !leafFlag || scoreType === "SYSTEM"; // 顶级指标和系统评分不展示
            const completeFlagMeaning = this.lineInfoDetail.completeFlag ? this.$T("sslm.siteInvestigateReport.modal.mange.completed").$D("已完成") : this.$T("sslm.siteInvestigateReport.modal.mange.unfinished").$D("未完成");
            return flag ? completeFlagMeaning : <srm-button plain onClick={(e) => {
              e.stopPropagation();
              this.showRaterStatusInfoPop(record);
            }}>
              { completeFlagMeaning }
            </srm-button>;
          }
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.score").$D("得分"),
          fieldCode: "finalScore",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreFrom").$D("分值从"),
          fieldCode: "scoreFrom",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.scoreTo").$D("分值至"),
          fieldCode: "scoreTo",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.defaultScore").$D("缺省分值"),
          fieldCode: "defaultScore",
        }
      ];
    },
    getScorerInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.scoreUser").$D("评分用户"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.userDescribe").$D("评分用户描述"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.weight").$D("权重（%）"),
          fieldCode: "respWeight",
        },
      ];
    },
    getRatingStatusInfoColumns() {
      return [
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.account").$D("评分人账户"),
          fieldCode: "loginName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.userDescribe").$D("评分用户描述"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.weight").$D("权重（%）"),
          fieldCode: "respWeight",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.defaultScore").$D("缺省分值"),
          fieldCode: "defaultScore",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准"),
          fieldCode: "isStandard",
          render: (val, record) => record.isStandard ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项"),
          fieldCode: "isVeto",
          render: (val, record) => record.isVeto ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.scorer.score").$D("得分"),
          fieldCode: "score",
        },
      ];
    },
    getInspectResultInfoColumns() {
      return [
        {
          fieldCode: "finalScore",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{this.$T("sslm.siteInvestigateReport.modal.mange.finalScore").$D("最终得分")}：{record.finalScore}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.level").$D("等级"),
          fieldCode: "grade",
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.compositeOpinion").$D("综合意见"),
          fieldCode: "opinion",
        },
        // {
        //   fieldName: "抄送（知会）",
        //   fieldCode: "userName.join(',')",
        //   langCode: "sslm.siteInvestigateReport.modal.mange.copyTo",
        //   render:(val)=>{
        //     return val.join(",");
        //   }
        // },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.copyTo").$D("抄送（知会）"),
          fieldCode: "userName",
          render: (val) => val && val.join(",")
        },
        {
          fieldName: this.$T("sslm.siteInvestigateReport.modal.mange.resultAttachment").$D("评审结果附件"),
          fieldCode: "resultLinkAttachmentUuid",
          render: () => <srm-upload
            attachmentUuid={this.resultLinkAttachmentUuid} show-icon={false} color="blue"
            desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}/>,
        },
      ];
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getHeadInfo();
        await this.getItemInfo();
        await this.getGroupsInfo();
        await this.getLineInfo();
        await this.getFileInfo();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      } finally {
        this.$loading.hide();
      }
    }
    this.uuid = uuid();
  },
  methods: {
    // 下级指标
    maintainChildrenAction(record) {
      this.maintainPopRef = this.$popup({
        title: this.$T("sslm.siteInvestigateReport.view.manage.viewChildren").$D("查看子级"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "start",
        showBack: true,
        content: <IndicatorMaintain
          indicatorInfo={record}
          basicDs={this.basicDs}
          editFlag={false}/>,
      });
    },
    //评分人弹窗
    async showRaterInfoPop(data) {
      this.scorerInfoDetail = data;
      await this.getRespsInfo();
      this.ratingInfoPop = !this.ratingInfoPop;
    },
    //评分状态弹窗
    async showRaterStatusInfoPop(data) {
      this.scorerInfoDetail = data;
      await this.getRespsInfo();
      this.ratingStatusInfoPop = !this.ratingStatusInfoPop;
    },
    //获取评分人信息
    async getRespsInfo() {
      this.respsInfo = [];
      this.$loading.show();
      await getSiteInspectionRespsApi(this.scorerInfoDetail.evalLineId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.respsInfo = res.content;
        }
      });
    },
    // 显示基本信息详情
    showBasicInfoDetail(data) {
      this.headInfoDetailPopup = true;
      this.headInfoDetail = data;
    },
    // 显示评分信息详情
    showScoreInfoDetail(data, index) {
      this.lineInfoDetailPopup = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    //获取现场考察报告基本信息、考察结果信息
    async getHeadInfo() {
      await getSiteInspectionBaseApi(this.changeReqId).then((res) => {
        this.headInfo = res;
        if (!isEmpty(res.userNames)) {
          this.userName = res.userNames?.map((item) => item.userName);
        }
        // let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        // this.$emit("GetAttachmentUuid", attachmentUuid);
        this.resultLinkAttachmentUuid = this.headInfo.resultLinkUuid || uuid();
        if (res.evalType === "OFFLINE") {
          this.lineInfoShow = false;
        } else {
          this.lineInfoShow = true;
        }
      });
    },
    //获取现场考察报告物料/品类信息
    async getItemInfo() {
      this.$loading.show();
      await getSiteInspectionItemApi(this.changeReqId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.itemInfo = res.content;
        }
      });
    },
    //获取现场考察小组信息
    async getGroupsInfo() {
      this.$loading.show();
      await getSiteInspectionGroupsApi(this.changeReqId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.groupsInfo = res.content;
        }
      });
    },
    //获取评分信息
    async getLineInfo() {
      this.$loading.show();
      await getSiteInspectionLinesApi(this.changeReqId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res;
        }
      });
    },
    //获取附件信息
    async getFileInfo() {
      const params = {
        page: 0,
        size: 1000,
        customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.ATTACHMENTINFO"
      };
      await getFileInfoApi(this.changeReqId, params).then((res) => {
        if (res && res.content) {
          this.attachmentInfo = res.content;
          let GetAttachmentUuid = res.content || uuid();
          this.$emit("GetAttachmentUuid", GetAttachmentUuid);
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

.srm-pop-headInfo {
  padding: 12px 15px 12px 15px;
  border-bottom: solid 8px var(--color-border-default);

  li {

    margin-bottom: 4px;
    justify-content: space-between;
    font-weight bold

    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      display: inline-block;
      color: var(--color-font-default);
      line-height: 24px;

      &:nth-child(1) {
        // font-weight: 700;
      }
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  .lineNum {
    span {
      font-size: 16px;
      color: var(--color-font-default-e);
    }
  }
}

.srm-pop-lineInfo {
  margin: 0 15px 0 15px;
}

.card {
  width: 100%;
  color: #666666;
  padding 10px 15px 12px 15px;
  background: var(--color-bg-default);

  .name-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .item-name {
      line-height: 22px;
      padding: 14px 0;
      font-weight: 700;
    }

    .noWrap {
      width: 260px;
    }

    .name-tag {
      font-size: 10px;
      color: var(--color-other-default-b);
      height: 20px;
      line-height: 20px;
      padding: 0 4px;
      display: inline-block;
      background: var(--color-bg-default-c);
      border-radius: 2px;
      margin-right: 8px;

      &:nth-child(2) {
        margin-left: 12px;
      }
    }

    span:first-child {
      font-size: 14px;
      color: var(--color-font-default);
      line-height: 22px;
      font-weight: bold;
    }
  }
}

</style>
