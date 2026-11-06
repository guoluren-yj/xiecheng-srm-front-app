<template>
  <section v-if="loading" class="mainDetail">
    <div ref="wrapper" class="contentWrap wrapper">
      <srm-scroll-tab ref="content" class="content">
        <!-- 基础信息 -->
        <srm-scroll-tab-item
          :label="$T('mallf.common.view.title.baseInfo').$D('基础信息')">
          <div @click="openDetail('baseInfo', headInfo)" >
            <srm-form
              :columns="getBaseInfoColumns()"
              :data-set="headerDs"
              customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.BASE_INFO"/>
          </div>
        </srm-scroll-tab-item>

        <!-- 关联整改报告 -->
        <srm-scroll-tab-item
          v-if="relatedQIReportDs && relatedQIReportDs.totalCount > 0"
          :label="$T('sqam.common.view.message.tab.relatedRectification').$D('关联整改报告')">
          <srm-list
            :scrollable="false"
            :show-bottom-bar="false"
            :columns="getRelatedRectifyReportColumns"
            :data-set="relatedQIReportDs"
            customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.RELATED_RECTIFICATION"/>
        </srm-scroll-tab-item>

        <!-- 关联采购订单 -->
        <srm-scroll-tab-item
          v-if="relatedPurOrderDs && relatedPurOrderDs.totalCount > 0"
          :label="$T('sqam.common.view.message.tab.relatedPurchaseOrder').$D('关联采购订单')">
          <srm-list
            :scrollable="false"
            :show-bottom-bar="false"
            :columns="getRelatedPurchaseOrderColumns"
            :data-set="relatedPurOrderDs"
            customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.RELATED_PURCHASE_ORDER"/>
        </srm-scroll-tab-item>

        <!-- 质检事务 -->
        <srm-scroll-tab-item
          v-if="headInfo.sourceCode === 'TRX_RCV_LINE'"
          :label="$T('sqam.common.view.message.tab.qualityControl').$D('质检事务')">
          <srm-list
            :scrollable="false"
            :show-bottom-bar="false"
            :columns="getQualityControlColumns"
            :data-set="relatedQCAffairDs"
            customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.QUALITY_CONTROL"/>
        </srm-scroll-tab-item>

        <!-- 质量检验单 -->
        <srm-scroll-tab-item
          v-if="headInfo.sourceCode === 'INCOMING_INSPECTION'"
          :label="$T('sqam.common.view.message.tab.qualityCheckSheet').$D('质量检验单')">
          <srm-list
            :scrollable="false"
            :show-bottom-bar="false"
            :columns="getQualityCheckSheetColumns"
            :data-set="relatedQCDocDs"
            customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.QUALITY_CHECK_SHEET"/>
        </srm-scroll-tab-item>

        <!-- 问题描述 -->
        <srm-scroll-tab-item
          :label="$T('sqam.common.view.message.tab..problemDescription').$D('问题描述')">
          <srm-form
            :columns="getProblemDescColumns"
            :data-set="headerDs"
            customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.PROBLEM_DESCRIPTION"/>
        </srm-scroll-tab-item>

        <!-- 小组成员 -->
        <srm-scroll-tab-item
          :label="$T('sqam.common.view.message.title.panel.groupMember').$D('小组成员')">
          <srm-list
            :scrollable="false"
            :show-bottom-bar="false"
            :columns="getTeamMemberColumns"
            :data-set="groupMemberDs"
            customize-code="SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.GROUP_MEMBER"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <!-- 详情展示 -->
    <rectify-report-detail
      :show="detailPopup"
      :title="title"
      :line-info-detail="lineInfo"
      :columns="popColumns"
      :code="customizeCode"
      @input="closeDetail"/>
  </section>
</template>

<script>
import uuid from "uuid";
import RectifyReportDetail from "./components/RectifyReportDetail";
import { $T, DataSet } from "srm-mobile-ui";
import StatusTag from "@/components/StatusTag";
import { formatColumns } from "./utils";
import {
  headerDS,
  relatedQIReportDS,
  relatedPurOrderDS,
  relatedQCAffairDS,
  relatedQCDocDS,
  groupMemberDS,
} from "./datasource/detailDS";

const poStatusCodeColorMap = {
  CONFIRMED: "green",
};
export default {
  modules: [ "hzero.common", "mallf.common", "sqam.common", "sqam.qualityAuditor", "hipspfm.common", "entity.attachment", "sqam.inquiryHall", "smbl.common", "entity.organization", "sqam.quoteIncomingInspection", "sodr.sendOrder" ],
  name: "RectifyReportApproval",
  components: {
    RectifyReportDetail,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    }
  },
  data() {
    const { changeReqId } = this;
    return {
      // 基础信息 问题描述 小组成员
      headInfo: {},
      // 详情
      lineInfo: {},
      customizeCode: "",
      title: "",
      detailPopup: false,
      loading:false,
      popColumns: [],
      uuid: "",
      contentLenArr: [],
      headerDs: new DataSet(headerDS(changeReqId)),
      relatedQIReportDs: new DataSet(relatedQIReportDS(changeReqId)),
      relatedPurOrderDs: new DataSet(relatedPurOrderDS(changeReqId)),
      relatedQCAffairDs: new DataSet(relatedQCAffairDS()),
      relatedQCDocDs: new DataSet(relatedQCDocDS(changeReqId)),
      groupMemberDs: new DataSet(groupMemberDS(changeReqId)),
    };
  },
  computed: {
    // 基本信息
    getBaseInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sqam.common.model.8d.problemTitle").$D("整改报告标题"),
          fieldType: "TEXT",
          fieldCode: "problemTitle",
        },
        {
          fieldName: this.$T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
          fieldType: "TEXT",
          fieldCode: "problemNum",
        },
        [
          {
            fieldName: this.$T("sqam.common.model.8d.createdName").$D("创建人"),
            fieldType: "TEXT",
            fieldCode: "createdName",
          },
          {
            fieldName: this.$T("sqam.common.model.8d.createType").$D("创建方式"),
            fieldType: "TEXT",
            fieldCode: "sourceCodeMeaning",
          },
        ],
        {
          fieldName: this.$T("sqam.common.model.8d.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sqam.common.model.supplierCompanyName").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.icaDemandDate").$D("ICA要求时间"),
          fieldType: "TEXT",
          fieldCode: "icaDemandDate",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.pcaDemandDate").$D("PCA要求日期"),
          fieldType: "TEXT",
          fieldCode: "pcaDemandDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sqam.common.model.8d.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.organizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
        },
        [
          {
            fieldName: this.$T("sqam.common.model.8d.itemCode").$D("物料编码"),
            fieldType: "TEXT",
            fieldCode: "itemCode",
          },
          {
            fieldName: this.$T("sqam.common.model.8d.itemName").$D("物料名称"),
            fieldType: "TEXT",
            fieldCode: "itemName",
          },
        ],
        {
          fieldName: this.$T("sqam.common.model.8d.openDays").$D("开放天数"),
          fieldType: "TEXT",
          fieldCode: "openDays",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.icaDelayDays").$D("ICA累计延期/天"),
          fieldType: "TEXT",
          fieldCode: "icaDelayDays",
          render: (val) => <span class="redFont">{Number(val)}</span>,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.pcaDelayDays").$D("PCA累计延期/天"),
          fieldType: "TEXT",
          fieldCode: "pcaDelayDays",
          render: (val) => <span class="redFont">{Number(val)}</span>,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.pcaSubmittedBy").$D("发布人"),
          fieldType: "TEXT",
          fieldCode: "publishedName",
        },
        {
          fieldName: this.$T("entity.organization.class.purchase").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
      return (detailFlag) => formatColumns(columns, { showTitle: true, takeFlag: !detailFlag });
    },
    // 整改报告
    getRelatedRectifyReportColumns() {
      const columns = [
        {
          fieldName: this.$T("sqam.common.model.8d.updateExportTitle").$D("整改报告标题"),
          fieldType: "TEXT",
          fieldCode: "problemTitle",
        },
        {
          fieldCode: "problemNum",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.common.model.qualityRectification.code").$D("整改报告编号"),
        },
        {
          fieldName: this.$T("sqam.common.model.8d.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sqam.common.model.8d.createdName").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.organizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
        },
      ];
      return formatColumns(columns, { takeFlag: true, showTitle: true });
    },
    // 采购订单
    getRelatedPurchaseOrderColumns() {
      const columns = [
        {
          fieldCode: "displayPoNum",
          fieldType: "TEXT",
          fieldName: this.$T("sodr.sendOrder.model.common.orderNum").$D("订单号"),
        },
        {
          fieldName: this.$T("sqam.common.model.8d.orderTypeName").$D("订单类型"),
          fieldType: "TEXT",
          fieldCode: "orderTypeName",
          // formRow: 1,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.purchaseAgentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentName",
          // formRow: 6,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
          // formRow: 2,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.invOrganizationName").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "organizationName",
          // formRow: 3,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.poNum").$D("采购订单编号"),
          fieldType: "TEXT",
          fieldCode: "poNum",
          // formRow: 4,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.pohPcNum").$D("协议编号"),
          fieldType: "TEXT",
          fieldCode: "pohPcNum",
          // formRow: 5,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.sourceCodeMeaning").$D("来源系统"),
          fieldType: "TEXT",
          fieldCode: "sourceCodeMeaning",
          // formRow: 6,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.releasedDate").$D("发布时间"),
          fieldType: "TEXT",
          fieldCode: "releasedDate",
        },

      ];
      return formatColumns(columns, {
        takeFlag: true,
        rightTagRender: (_, record) => {
          const { statusCode, statusCodeMeaning } = record;
          return (
            <StatusTag
              text={statusCodeMeaning}
              color={poStatusCodeColorMap[statusCode]}
            />
          );
        }
      });
    },
    // 质检事务
    getQualityControlColumns() {
      const columns = [
        {
          fieldCode: "inspectionNum",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.trxNumandLine").$D("事务编号｜行号"),
          render: (_, record) => `${record.trxNum}|${record.trxLineNum}`,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.supplierNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierNum",
          // formRow: 4,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierName",
          // formRow: 3,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
          // formRow: 1,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.organizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "organizationName",
          // formRow: 2,
        },
        [
          {
            fieldName: this.$T("sqam.common.model.8d.itemCode").$D("物料编码"),
            fieldType: "TEXT",
            fieldCode: "itemCode",
          // formRow: 5,
          },
          {
            fieldName: this.$T("sqam.common.model.8d.itemName").$D("物料名称"),
            fieldType: "TEXT",
            fieldCode: "itemName",
            // formRow: 6,
          }
        ],
        [
          {
            fieldCode: "rcvTypeName",
            fieldType: "TEXT",
            fieldName: this.$T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.rcvTypeName").$D("事务类型"),
          },
          {
            fieldName: this.$T("sqam.common.model.8d.quantity").$D("执行数量"),
            fieldType: "INPUT_NUMBER",
            editor:false,
            fieldCode: "quantity",
            // formRow: 7,
          },
        ],
        [
          {
            fieldName: this.$T("sqam.common.model.8d.occupiedQuantity").$D("执行退回数量"),
            fieldType: "INPUT_NUMBER",
            editor:false,
            fieldCode: "occupiedQuantity",
            // formRow: 7,
          },
          {
            fieldName: this.$T("sqam.common.model.8d.nodeConfigName").$D("执行退回节点"),
            fieldType: "TEXT",
            fieldCode: "nodeConfigName",
            // formRow: 8,
          },
        ],
        [
          {
            fieldName: this.$T("sqam.common.model.8d.sourceHeaderNum").$D("事务来源编号"),
            fieldType: "TEXT",
            fieldCode: "sourceHeaderNum",
          },
          {
            fieldName: this.$T("sqam.common.model.8d.trxNum").$D("事务编码"),
            fieldType: "TEXT",
            fieldCode: "displayTrxNum",
          }
        ],
        [
          {
            fieldName: this.$T("sqam.common.model.8d.creationDate").$D("创建时间"),
            fieldType: "TEXT",
            fieldCode: "creationDate",
            // formRow: 8,
          },
          {
            fieldName: this.$T("sqam.common.model.8d.sinvLineAttachmentUuid").$D("附件"),
            fieldType: "UPLOAD",
            fieldCode: "sinvLineAttachmentUuid",
            bucketName: "private-bucket",
            directory: "create8D",
            editor: false,
          },
        ]
      ];
      return formatColumns(columns, { takeFlag: true });
    },
    // 质量检验单
    getQualityCheckSheetColumns() {
      const columns = [
        {
          fieldCode: "inspectionNum",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.quoteIncomingInspection.model.quoteIncomingInspection.inspectionNum").$D("检验单号"),
        },
        [
          {
            fieldName: this.$T("sqam.common.model.8d.itemCode").$D("物料编码"),
            fieldType: "TEXT",
            fieldCode: "itemCode",
            // formRow: 1,
          },
          {
            fieldName: this.$T("sqam.common.model.8d.itemName").$D("物料名称"),
            fieldType: "TEXT",
            fieldCode: "itemName",
            // formRow: 2,
          },
        ],
        {
          fieldName: this.$T("sqam.common.model.8d.assessmentResultMeaning").$D("评估结果"),
          fieldType: "TEXT",
          fieldCode: "assessmentResultMeaning",
          // formRow: 3,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.decisionResultMeaning").$D("决策结果"),
          fieldType: "TEXT",
          fieldCode: "decisionResultMeaning",
          // formRow: 3,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.poNum").$D("采购订单编号"),
          fieldType: "TEXT",
          fieldCode: "poNum",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.transactionNum").$D("事务编号"),
          fieldType: "TEXT",
          fieldCode: "transactionNum",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.creationDate").$D("创建时间"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sqam.common.model.8d.startDate").$D("检验开始日期"),
          fieldType: "TEXT",
          fieldCode: "startDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sqam.common.model.8d.endDate").$D("检验结束日期"),
          fieldType: "TEXT",
          fieldCode: "endDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        }
      ];
      return formatColumns(columns, { takeFlag: true });
    },
    // 问题描述
    getProblemDescColumns() {
      const columns = [
        {
          fieldName: this.$T("sqam.common.model.8d.problemTypeCodeMeaning").$D("问题类型"),
          fieldType: "TEXT",
          fieldCode: "problemTypeCodeMeaning",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.problemDefectTypeMeaning").$D("缺陷类型"),
          fieldType: "TEXT",
          fieldCode: "problemDefectTypeMeaning",
        },
        [
          {
            fieldName: this.$T("sqam.common.model.8d.problemImportanceCodeMeaning").$D("重视度"),
            fieldType: "TEXT",
            fieldCode: "problemImportanceCodeMeaning",
            // formRow: 3,
          },
          {
            fieldName: this.$T("sqam.common.model.8d.problemUrgencyCodeMeaning").$D("紧急度"),
            fieldType: "TEXT",
            fieldCode: "problemUrgencyCodeMeaning",
            // formRow: 3,
          },
        ],
        {
          fieldName: this.$T("sqam.common.model.8d.problemOccurredDate").$D("发现时间"),
          fieldType: "TEXT",
          fieldCode: "problemOccurredDate",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.problemDiscoverBy").$D("发现人员"),
          fieldType: "TEXT",
          fieldCode: "problemDiscoverBy",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.problemOccurredSite").$D("发现地点"),
          fieldType: "TEXT",
          fieldCode: "problemOccurredSite",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.problemIdentifyCauses").$D("识别原因"),
          fieldType: "TEXT",
          fieldCode: "problemIdentifyCauses",
          // formRow: 1,
        },
        {
          fieldCode: "problemIdentification",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.common.model.qualityRectification.problemSketch").$D("问题简述"),
        },
        {
          fieldName: this.$T("sqam.common.model.8d.problemDetail").$D("问题详述"),
          fieldType: "TEXT",
          fieldCode: "problemDetail",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.problemEmergencyAction").$D("紧急处理"),
          fieldType: "TEXT",
          fieldCode: "problemEmergencyAction",
        }
      ];
      return formatColumns(columns, { takeFlag: true, });
    },
    // 小组成员
    getTeamMemberColumns() {
      const columns = [
        {
          fieldCode: "memberName",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.common.model.qualityRectification.name").$D("姓名"),
        },
        {
          fieldName: this.$T("sqam.common.model.8d.campMeaning").$D("代表方"),
          fieldType: "TEXT",
          fieldCode: "campMeaning",
        },
        {
          fieldCode: "memberLoginName",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.common.model.qualityRectification.account").$D("账号"),
        },
        {
          fieldCode: "supplierContactName",
          fieldType: "TEXT",
          fieldName: this.$T("sqam.common.model.qualityRectification.supplierContactId").$D("供应商联系人"),
        },
        {
          fieldName: this.$T("sqam.common.model.8d.memberResp").$D("职责"),
          fieldType: "TEXT",
          fieldCode: "memberResp",
        },
        {
          fieldName: this.$T("sqam.common.model.8d.participantNodeMeaning").$D("参与节点"),
          fieldType: "TEXT",
          fieldCode: "participantNodeMeaning",
          // formRow: 2,
        },
        {
          fieldName: this.$T("sqam.common.model.8d.phone").$D("电话"),
          fieldType: "TEXT",
          fieldCode: "phone",
          // formRow: 3,
          render: (val, record) => {
            if (record.phone) {
              return <span>{`${record.internationalTelCodeMeaning} | ${record.phone}`}</span>;
            }
            return "";
          }
        },
        {
          fieldName: this.$T("sqam.common.model.8d.email").$D("邮箱"),
          fieldType: "TEXT",
          fieldCode: "email",
          // formRow: 4,
        },
        [
          {
            fieldName: this.$T("sqam.common.model.8d.emailFlag").$D("邮件提醒"),
            fieldType: "TEXT",
            fieldCode: "emailFlag",
            // formRow: 5,
            render: (val, record) => <span>{record.emailFlag ? $T("smbl.common.message.yes").$D("是") : this.$T("smbl.common.message.no").$D("否")}</span>
          },
          {
            fieldName: this.$T("sqam.common.model.8d.visibleFlag").$D("供应商不可见"),
            fieldType: "TEXT",
            fieldCode: "visibleFlag",
            // formRow: 5,
            render: (val, record) => <span>{record.visibleFlag ? $T("smbl.common.message.yes").$D("是") : this.$T("smbl.common.message.no").$D("否")}</span>
          },
        ],
        {
          fieldName: this.$T("sqam.common.model.8d.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
      return formatColumns(columns, {
        takeFlag: true,
        showTitle: true,
        rightTagRender: (_, record) => {
          const { leaderFlag } = record;
          return Number(leaderFlag) === 1 ?
            <StatusTag color="blue" text={this.$T("sqam.common.model.qualityRectification.leader").$D("组长")} /> :
            "";
        },
      });
    },
    // 附件查看
    fileArr() {
      let newFileArr = [
        {
          title: this.$T("entity.attachment.type.purchaser.out").$D("采购方外部附件"),
          attachmentUuid: this.headInfo.attachmentUuid || uuid(),
          readOnly: false
        },
        {
          title: this.$T("entity.attachment.type.purchaser.inter").$D("采购方内部附件"),
          attachmentUuid: this.headInfo.attachmentInterUuid || uuid(),
          readOnly: false
        },
        {
          title: this.$T("sqam.inquiryHall.model.inquiryHall.supplierUuid").$D("供应商附件"),
          attachmentUuid: this.headInfo.supplierAttachmentUuid || uuid(),
          readOnly: false
        }
      ];

      return newFileArr;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        this.fetchPartRelatedData();
        await this.fetchData();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
      }
    }
    this.$emit("GetApprovalTitle", this.$T("sqam.common.title.rectify.submitProblemReport").$D("整改报告提交(自审批)"));
  },
  methods: {
    // 基本信息
    async fetchData() {
      await this.headerDs.refresh();
      const headerCurrent = this.headerDs.current;
      this.headInfo = headerCurrent ? headerCurrent.toData() : {};
      const { sourceCode, rcvTrxLineIds } = this.headInfo;
      this.$emit("GetAttachmentFileArr", this.fileArr);
      if (sourceCode === "INCOMING_INSPECTION") {
        this.relatedQCDocDs.refresh();
      }
      if (sourceCode === "TRX_RCV_LINE") {
        this.relatedQCAffairDs.addQueryParameter("rcvTrxLineIds", rcvTrxLineIds?.join());
        this.relatedQCAffairDs.refresh();
      }
    },
    async fetchPartRelatedData() {
      await Promise.all([
        this.relatedQIReportDs.refresh(),
        this.relatedPurOrderDs.refresh(),
      ]);
      this.$forceUpdate();
    },
    // 打开详情
    openDetail(val, item) {
      this.lineInfo = item;
      switch (val) {
      case "baseInfo":
        this.popColumns = this.getBaseInfoColumns(true);
        this.title = this.$T("sqam.common.view.panel.baseInfo").$D("基本信息");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.BI_DETAIL";
        break;
      case "problemDescription" :
        this.popColumns = this.getProblemDescColumns;
        this.title = this.$T("sqam.common.view.message.tab..problemDescription").$D("问题描述");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.PD_DETAIL";
        break;
      case "groupMember":
        this.popColumns = this.getTeamMemberColumns;
        this.title = this.$T("sqam.common.view.message.title.panel.groupMember").$D("小组成员");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.GM_DETAIL";
        break;
      case "relatedRectification":
        this.popColumns = this.getRelatedRectifyReportColumns;
        this.title = this.$T("sqam.common.view.message.tab.relatedRectification").$D("关联整改报告");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.RR_DETAIL";
        break;
      case "relatedPurchaseOrder":
        this.popColumns = this.getRelatedPurchaseOrderColumns;
        this.title = this.$T("sqam.common.view.message.tab.relate.order").$D("关联订单");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.RPO_DETAIL";
        break;
      case "qualityControl":
        this.popColumns = this.getQualityControlColumns;
        this.title = this.$T("sqam.common.view.message.tab.trxRcvLine").$D("质检事务");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.QC_DETAIL";
        break;
      case "qualityCheckSheet":
        this.popColumns = this.getQualityCheckSheetColumns;
        this.title = this.$T("sqam.common.view.message.title.tab.qualityInspect").$D("质量检验单");
        this.customizeCode = "SMBL.WORKFLOW.RECTIFY_REPORT_APPROVAL.QCS_DETAIL";
        break;
      default:
        break;
      }
      this.detailPopup = true;
    },
    closeDetail() {
      this.detailPopup = false;
    }
  },
};
</script>

<style scoped lang="stylus">
.blackFont {
  color: var(--color-font-default);
}

.redFont {
  color: red;
}

.closeFont {
  color: #414660 !important;
  border-color: #414660 !important;
}

.card {
  border-bottom: 8px solid var(--color-border-default);
  .name-title {
    margin: 10px 0 12px 0;
    display: flex;
    justify-content: space-between;
    margin-right: 20px;
  }
}
.block {
  width: 6px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--color-other-default-b);
  position: absolute;
  left: 0;
}
.card:last-child{
  border-bottom: 0;
}

>>> .srm-tab-pane-title {
  background: var(--color-border-default) !important;
}

.mainDetail {

  .contentWrap {
    font-family: PingFangSC-Medium;

    .content {
      .headInfo {
        ul {
          padding: 16px 15px;
          font-family: auto;
        }
        >>> .customize-item-field {
          color: var(--color-font-default);
        }
      }

      .moreInfo {
        align-self: flex-end;
        width: 18.3px;
        height: 18.3px;
      }

      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 235px;
        }

        .materialCode {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .footInfo {
          padding: 12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family: PingFangSC-Medium;
          color: var(--color-font-default);
          font-size: 14px;
          display: flex;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            width: 80px;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 11px;
          margin: 14px 0 3px 20px;
          border-bottom: 1px solid var(--color-border-default);
          padding-right: 20px;

          // line-height: 26px;
          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: #00CFC2;
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color: var(--color-font-default);
            line-height: 24px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }
      }

      .lineInfo {
        ul {
          padding-left: 20px;
          font-family: auto;

          // li:nth-last-child(1) {
          //   padding-bottom: 11px;
          //   border-bottom: 1px solid var(--color-border-default);
          // }

          // li {
          //   display: flex;
          //   align-items: center;
          //   padding: 9px 20px 0 0;
          //   margin-bottom: 2px;

          //   span {
          //     flex: 1;
          //     font-family: PingFangSC-Regular;
          //     font-size: 14px;
          //     color: var(--color-font-default);
          //     line-height: 22px;
          //   }
          // }
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FFFFFF;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .left-button {
    // margin-left: 20px;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: #fff;
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color: var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  .lineBody {
    background-color: #FFFFFF;
    padding-left: 20px;

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}

.invite {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  background: #FFFFFF;
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.05);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    font-weight: bold;
    border-right: 1px solid var(--color-border-default);
    font-family: PingFangSC-Medium;
    font-size: 18px;
    letter-spacing: 0.34px;
  }

  span:nth-child(1) {
    color: #82879E;
  }

  span:nth-child(2) {
    color: #FF6B6B;
  }

  span:nth-child(3) {
    color: #00CFC2;
  }
}
>>> .srm-list-item-card-head-left {
  font-family: PingFangSC-Semibold;
}
</style>
