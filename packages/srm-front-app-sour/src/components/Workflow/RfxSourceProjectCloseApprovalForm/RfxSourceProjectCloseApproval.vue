<template>
  <div>
    <srm-scroll-tab :customize-code="getCustomizeUnitCode('scrollTabs')">
      <!-- 关闭原因 -->
      <srm-scroll-tab-item :label="$T('ssrc.projectSetupApprovalWf.view.title.closedReason').$D('关闭原因')" code="closeReasonTab">
        <srm-list :data-set="headerDs"
                  :scrollable="false"
                  :columns="getCloseReasonColumns"
                  :customize-code="getCustomizeUnitCode('closeReasonForm')"/>
      </srm-scroll-tab-item>
      <!-- 关联单据 -->
      <srm-scroll-tab-item v-if="relatedDocumentDs.data && relatedDocumentDs.data.length > 0" :label="$T('ssrc.projectSetupApprovalWf.view.title.relatedBill').$D('关联单据')" code="relatedDocTab">
        <srm-list :scrollable="false"
                  :data-set="relatedDocumentDs"
                  :columns="getRelatedDocColumns"/>
      </srm-scroll-tab-item>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('ssrc.projectSetupApprovalWf.view.title.baseInfo').$D('基础信息')" code="baseInfoTab">
        <srm-list :data-set="headerDs"
                  :scrollable="false"
                  :columns="getBasisColumns"
                  :customize-code="getCustomizeUnitCode('basicForm')"/>
      </srm-scroll-tab-item>
      <!-- 采购组织及人员 -->
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.inquiryHall.purOrganizationAndStaff').$D('采购组织及人员')" code="purOrgAndStaffTab">
        <srm-flex>
          <div class="srm-span-title"> {{ $T('ssrc.inquiryHall.view.inquiryHall.demandSide').$D('需求方') }} </div>
        </srm-flex>
        <srm-blank size="1px" theme="fill"/>
        <srm-list :data-set="headerDs"
                  :scrollable="false"
                  :columns="getBasisDemandColumns"
                  :customize-code="getCustomizeUnitCode('demandForm')"/>
        <srm-blank size="small" theme="fill"/>
        <srm-flex>
          <div class="srm-span-title"> {{ $T('ssrc.projectSetupApprovalWf.view.title.executor').$D('执行人') }} </div>
        </srm-flex>
        <srm-blank size="1px" theme="fill"/>
        <srm-list :data-set="headerDs"
                  :scrollable="false"
                  :columns="getBasisExecuteColumns"
                  :customize-code="getCustomizeUnitCode('executeForm')"/>
      </srm-scroll-tab-item>
      <!-- 物料信息 -->
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.card.subtitle.itemInfo').$D('物料信息')" code="itemInfoTab">
        <srm-flex>
          <div class="srm-span-title"> {{ $T('ssrc.projectSetupApprovalWf.view.title.item').$D('标的物') }} </div>
        </srm-flex>
        <srm-blank size="1px" theme="fill"/>
        <srm-list :scrollable="false"
                  :data-set="itemDs"
                  :columns="getItemPartColumns"
                  :customize-code="getCustomizeUnitCode('itemPartList')"/>
        <srm-blank size="small" theme="fill"/>
        <srm-flex v-if="headerInfo && headerInfo.subjectMatterRule === 'PACK'">
          <div class="srm-span-title"> {{ $T('ssrc.projectSetupApprovalWf.view.title.secPacketInfo').$D('标段/包信息') }} </div>
        </srm-flex>
        <srm-blank v-if="headerInfo && headerInfo.subjectMatterRule === 'PACK'" size="1px" theme="fill"/>
        <srm-list v-if=" headerInfo && headerInfo.subjectMatterRule === 'PACK'"
                  :scrollable="false"
                  :data-set="sectionDs"
                  :columns="getSectionColumns"
                  :customize-code="getCustomizeUnitCode('sectionList')"/>
      </srm-scroll-tab-item>
      <!-- 对供应商要求 -->
      <srm-scroll-tab-item :label="$T('ssrc.common.model.common.supplierRequirements').$D('对供应商要求')"
                           code="supplierWithRequestTab">
        <srm-list :columns="getSourceMethodColumns" :need-padding="true" :data-set="headerDs" customize-type="detail"
                  :customize-code="getCustomizeUnitCode('sourceMethodForm')" class="rfx-sp-close-method-list-card" />
        <srm-list v-if="headerInfo && headerInfo.sourceMethod === 'INVITE'" :scrollable="false"
                  :data-set="supplierLineTableDs" :columns="getSupplierWithRequestColumns"
                  :customize-code="getCustomizeUnitCode('supplierList')" />
      </srm-scroll-tab-item>
      <!-- 项目计划 -->
      <srm-scroll-tab-item :label="$T('ssrc.projectSetup.view.title.spChange.planList').$D('项目计划')"
                           code="projectPlanTab">
        <srm-list :data-set="planLineTableDs" :columns="getProjectPlanColumns"
                  :customize-code="getCustomizeUnitCode('projectPlanList')" />
      </srm-scroll-tab-item>

      <!-- 附件 -->
      <srm-scroll-tab-item :label="$T('hzero.common.upload.modal.title').$D('附件')" code="attachmentTab">
        <srm-list
          :scrollable="false"
          :need-padding="true"
          :data-set="headerDs"
          :columns="getAttachmentColumns"
          :customize-code="getCustomizeUnitCode('attachment')" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 物料明细行 -->
    <srm-popup
      :visible.sync="itemDetailPop"
      position="right"
      height="100%"
      width="100%"
      show-back
      :title="$T('ssrc.common.view.message.viewDetail').$D('查看详情')"
      @onClose="itemDetailCloseEvent">
      <srm-form :columns="getItemDetailColumns"
                :need-padding="true"
                :data-set="itemDetailDs"
                customize-type="detail"
                :customize-code="getCustomizeUnitCode('itemDetailForm')"/>
    </srm-popup>

    <!-- 标段/包-物料信息 -->
    <srm-popup :visible.sync="sectionItemPop"
               position="right"
               show-back
               height="100%"
               :show-close="false"
               :title="$T('ssrc.inquiryHall.view.message.button.viewAllotItem').$D('查看物料')"
               @onClose="sectionItemCloseEvent">
      <div class="section-item-popup-container">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :columns="getSectionHeaderColumns"
                  :data-set="sectionHeaderDs" />
        <srm-blank size="1px" theme="fill"/>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="sectionItemDs"
                  :columns="getItemPartColumns"
                  :customize-code="getCustomizeUnitCode('itemPartList')"/>
      </div>
    </srm-popup>
  </div>
</template>
<script>
import { isEmpty, isArray, cloneDeep } from "lodash";
import {
  getBasicInfoApi
} from "./api";
import { queryDoubleUnit } from "@/utils/utils";
import { basisDs, commonDs, relatedDocumentDs, sectionDs, itemDetailDs, itemDs, supplierLineTableDS, planLineTableDS } from "./datasource/ds";
import { DataSet, SrmListHeader, SrmUtil } from "srm-mobile-ui";
import { getUomName, getQtyName } from "@/utils/doubleUnit";

export default {
  modules: [ "ssrc.projectSetup", "ssrc.bidHall", "ssrc.inquiryHall", "ssrc.common", "smbl.common", "ssrc.projectSetupApprovalWf", "hzero.common" ],
  name: "RfxSourceProjectCloseApprovalForm",
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      sourceProjectId:this.changeReqId, // 单据头id
      headerInfo:{}, // 单据头信息
      headerDs:new DataSet(basisDs({ sourceProjectId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode([ "closeReasonForm", "basicForm", "demandForm", "executeForm", "attachment" ]) })),
      relatedDocumentDs:new DataSet(relatedDocumentDs({ sourceProjectId: this.changeReqId })),
      itemDs:new DataSet(itemDs({ sourceProjectId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode([ "itemPartList", "itemDetailForm" ]), doubleUnitFlag: this.doubleUnitFlag })),
      itemDetailDs:new DataSet(itemDetailDs()),
      sectionDs:new DataSet(sectionDs({ sourceProjectId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode([ "sectionList" ]) })),
      sectionItemDs:new DataSet(itemDs({ sourceProjectId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode([ "itemPartList", "itemDetailForm" ]) })),
      sectionHeaderDs: new DataSet(commonDs()),
      supplierLineTableDs: new DataSet(supplierLineTableDS({ sourceProjectId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode([ "supplierList" ]) })),
      planLineTableDs: new DataSet(planLineTableDS({ sourceProjectId: this.changeReqId, customizeUnitCode: this.getCustomizeUnitCode([ "projectPlanList" ]) })),
      itemDetailPop:false, // 物料行详情Pop
      sectionItemPop:false, // 标段/包-物料信息Pop
      doubleUnitFlag: false, // 判断是否开启双单位
    };
  },
  computed:{
    // 列-关闭原因
    getCloseReasonColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.closeReason").$D("关闭理由"),
          fieldType: "TEXT",
          fieldCode: "closedComments",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.close.attachment").$D("关闭附件"),
          fieldType: "UPLOAD",
          showCount: true,
          bucketName: "private-bucket",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          fieldCode: "closedAttachmentUuid",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prRequestedName").$D("申请人"),
          fieldType: "TEXT",
          fieldCode: "closedByName",
          formRow: 30,
          formCol: 10,
        },
      ];
    },
    // 列-关联单据
    getRelatedDocColumns() {
      return [
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.relatedBill.receiptName")
            .$D("单据名称"),
          fieldType: "EMPTY",
          fieldCode: "sourceName",
          formRow: 10,
          formCol: 10,
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.relatedBill.receiptNum").$D("单据编号"),
          fieldType: "TEXT",
          fieldCode: "sourceNum",
          formRow: 20,
          formCol: 10,
          render: (val, record) => {
            const { targetFrom = "" } = record;
            // RFI RFP 不支持跳转单据详情
            if ([ "RFI", "RFP" ].includes(targetFrom)) {
              return <span>{val}</span>;
            }
            // RFX可以跳转详情
            return <span style="color: var(--color-other-default-b);"
              onClick={() => this.goDetail(record)}>
              {val}
            </span>;
          },
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.relatedBill.shutdownPhase")
            .$D("关闭阶段"),
          fieldType: "TEXT",
          fieldCode: "closingSourceStatusMeaning",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.close.attachment").$D("关闭附件"),
          fieldType: "UPLOAD",
          showCount: true,
          bucketName: "private-bucket",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          fieldCode: "closeAttachmentUuid",
          formRow: 30,
          formCol: 20,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.relatedBill.shutdownStaff")
            .$D("关闭人"),
          fieldType: "TEXT",
          fieldCode: "closedByName",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.relatedBill.shutdownTime")
            .$D("关闭时间"),
          fieldType: "TEXT",
          fieldCode: "closedDate",
          formRow: 40,
          formCol: 20,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.close.inquiryListReason").$D("关闭理由"),
          fieldType: "TEXT",
          fieldCode: "closedComments",
          formRow: 50,
          formCol: 10,
        },
      ];
    },
    // 列-基础信息
    getBasisColumns() {
      return [
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.baseInfo.sourceProjectNum").$D("寻源项目编号"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectNum",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.baseInfo.sourceProjectName").$D("寻源项目名称"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.baseInfo.totalEstimatedAmount").$D("预估金额"),
          fieldCode: "totalEstimatedAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.baseInfo.estimatedTimeOfCompletion").$D("预计完成时间"),
          fieldType: "TEXT",
          fieldCode: "estimatedDate",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sourceDate").$D("寻源时间"),
          fieldType: "TEXT",
          fieldCode: "sourceDate",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.prejectRemark").$D("项目说明"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectRemark",
          formRow: 70,
          formCol: 10,
        },
      ];
    },
    // 列-需求方信息
    getBasisDemandColumns() {
      return [
        {
          fieldName: this.$T("ssrc.common.company").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.purOrganizationAndStaff.unitName").$D("需求部门"),
          fieldType: "TEXT",
          fieldCode: "unitName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.creator").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdByName",
          formRow: 20,
          formCol: 20,
        },
      ];
    },
    // 列-采购执行人信息
    getBasisExecuteColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purOrganizationName",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.purchaseLov").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaserName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.purchaseCont").$D("采购联系人"),
          fieldType: "TEXT",
          fieldCode: "purAgent",
          formRow: 20,
          formCol: 20,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.contactMobilephone").$D("联系人电话"),
          fieldType: "TEXT",
          fieldCode: "contactMobilephone",
          formRow: 30,
          formCol: 10,
          render: (val, record) => {
            if (val && record.internationalTelCodeMeaning) {
              return `${record.internationalTelCodeMeaning}|${val}`;
            }
            return val;
          }
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.contactMail").$D("联系人邮箱"),
          fieldType: "TEXT",
          fieldCode: "contactMail",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.projectMember").$D("项目成员"),
          fieldType: "TEXT",
          fieldCode: "sourceMemberMeaning",
          formRow: 50,
          formCol: 10,
        },
      ];
    },
    // 列-获取部分物料信息
    getItemPartColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemDescs").$D("物料描述"),
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 10,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false} class="srm-list-header-item-name">
              <span>{record.itemName}</span>
              <span slot="right"><span class="srm-icon icon-chevron-right icon-chevron-right-color-style" onclick={() => this.showExpandItemDetailInfo(record)} /></span>
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "projectLineItemNum",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAttachment").$D("行附件"),
          fieldType: "UPLOAD",
          fieldCode: "itemAttachmentUuid",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          showCount: true,
          bucketName: "private-bucket",
          formRow: 20,
          formCol: 20,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 30,
          formCol: 10,
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldCode: "requiredQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 30,
          formCol: 20,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unit").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "secondaryUomName",
          formRow: 40,
          formCol: 10,
        } : null,
        {
          fieldName: getUomName(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "uomName",
          formRow: 40,
          formCol: 20,
        },
      ];
    },
    // 列-获取全部物料明细信息
    getItemDetailColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNo.").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "projectLineItemNum",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.businessUnit").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.invOrganizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemDescs").$D("物料描述"),
          fieldType: "TEXT",
          fieldCode: "itemName",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCategory").$D("物料类别"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specifications").$D("规格"),
          fieldType: "TEXT",
          fieldCode: "specifications",
          formRow: 70,
          formCol: 10,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 80,
          formCol: 10,
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldCode: "requiredQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 90,
          formCol: 10,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unit").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "secondaryUomName",
          formRow: 100,
          formCol: 10,
        } : null,
        {
          fieldName: getUomName(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "uomName",
          formRow: 110,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceQuantity").$D("价格批量"),
          fieldType: "TEXT",
          fieldCode: "priceBatch",
          formRow: 120,
          formCol: 10,
        },
        this.doubleUnitFlag ? null : {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.itemLineDetail.estimatedUnitPrice").$D("预算单价(元)"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 130,
          formCol: 10,
        },
        this.doubleUnitFlag ? null : {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.itemLineDetail.estimatedUnitAmount").$D("预算行金额(元)"),
          fieldCode: "totalPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 140,
          formCol: 10,
        },
        {
          fieldCode: "estimatedPrice",
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.predictUnitPrice").$D("预估单价(元)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 150,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.estimatedAmount").$D("预估行金额(元)"),
          fieldCode: "estimatedAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 160,
          formCol: 10,
        },
        // { // 暂时先不显示 移动端报价明细目前待实现 暂未开放 敬请期待
        //   fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationTemplate").$D("报价模板"),
        //   fieldType: "TEXT",
        //   fieldCode: "templateName",
        // },
        // { // 暂时先不显示 移动端报价明细目前待实现 暂未开放 敬请期待
        //   fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotaionDetail").$D("报价明细"),
        //   fieldType: "TEXT",
        //   fieldCode: "quotationDetailFlag",
        //   // render: (val, record) => <QuotationDetail rowData={record} />,
        // },
        {
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "itemRemark",
          formRow: 170,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAttachment").$D("行附件"),
          fieldType: "UPLOAD",
          fieldCode: "itemAttachmentUuid",
          showCount: true,
          bucketName: "private-bucket",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          formRow: 180,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.itemLineDetail.prNum").$D("采购申请号"),
          fieldType: "TEXT",
          fieldCode: "prNum",
          visible: this.headerInfo.projectFrom === "REFERENCE",
          formRow: 190,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prLineNum").$D("采购申请行号"),
          fieldType: "TEXT",
          fieldCode: "prDisplayLineNum",
          visible: this.headerInfo.projectFrom === "REFERENCE",
          formRow: 200,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.prRequestedName").$D("申请人"),
          fieldType: "TEXT",
          fieldCode: "requestUserName",
          formRow: 210,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.common.model.common.projectTaskNme").$D("项目任务名称"),
          fieldType: "TEXT",
          fieldCode: "projectTaskName",
          formRow: 220,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.itemLineDetail.projectExecutionStatus").$D("立项执行状态"),
          fieldType: "TEXT",
          fieldCode: "executingStatusMeaning",
          formRow: 230,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.itemLineDetail.quantityOccupied").$D("已占用数量"),
          fieldCode: "occupiedQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 240,
          formCol: 10,
        },
        {
          fieldCode: "executableQuantity",
          fieldName: this.$T("ssrc.projectSetupApprovalWf.model.approvalWf.itemLineDetail.executableQuantity").$D("可执行数量"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          formRow: 250,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionNum").$D("标段/包编号"),
          fieldType: "TEXT",
          fieldCode: "sectionCode",
          visible: this.headerInfo.subjectMatterRule === "PACK",
          formRow: 260,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionName").$D("标段/包名称"),
          fieldType: "TEXT",
          fieldCode: "sectionName",
          visible: this.headerInfo.subjectMatterRule === "PACK",
          formRow: 270,
          formCol: 10,
        },
      ];
    },
    // 列-标段/包信息
    getSectionColumns() {
      return [
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionName").$D("标段/包名称"),
          fieldType: "EMPTY",
          fieldCode: "sectionName",
          formRow: 10,
          formCol: 10,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{ record.sectionName }</span>
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionNum").$D("标段/包编号"),
          fieldType: "TEXT",
          fieldCode: "sectionCode",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.viewItemDetail").$D("物料"),
          fieldType: "TEXT",
          fieldCode: "viewMaterial",
          formRow: 20,
          formCol: 20,
          render:(val, record) => {
            if (!record.projectItemCount) {
              return null;
            }
            return <srm-flex>
              <srm-button plain rect onClick={() => this.showSectionItem(record)}>
                {`${this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}(${record.projectItemCount})`}
              </srm-button>
            </srm-flex>;
          },
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionAttachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          fieldCode: "sectionAttachmentUuid",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          showCount: true,
          bucketName: "private-bucket",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "sectionRemark",
          formRow: 30,
          formCol: 20,
        },
      ];
    },
    // 列-标段/包信息-弹框头信息
    getSectionHeaderColumns() {
      return [
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionNum").$D("标段/包编号"),
          fieldType: "TEXT",
          fieldCode: "sectionCode",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionName").$D("标段/包名称"),
          fieldType: "TEXT",
          fieldCode: "sectionName",
          formRow: 10,
          formCol: 20,
        },
      ];
    },
    // 列-附件信息
    getAttachmentColumns() {
      return [
        {
          fieldName: this.$T("ssrc.common.model.common.viewAttachment").$D("查看附件"),
          fieldType: "UPLOAD",
          showCount: true,
          bucketName: "private-bucket",
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
          fieldCode: "sourceProjectAttachmentUuid",
          formRow: 10,
          fromCol: 10,
        },
      ];
    },
    // 表单-寻源方式信息
    getSourceMethodColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
          fieldType: "TEXT",
          fieldCode: "sourceMethodMeaning",
          formRow: 10,
          formCol: 10,
        }
      ];
    },
    // 列-供应商信息
    getSupplierWithRequestColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierName").$D("供应商名称"),
          fieldType: "EMPTY",
          fieldCode: "supplierCompanyName",
          formRow: 0,
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              {val}
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.common.supplierNum").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lifeCycle").$D("生命周期阶段"),
          fieldType: "TEXT",
          fieldCode: "stageDescription",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCategory").$D("供应商分类"),
          fieldType: "TEXT",
          fieldCode: "supplierCategoryDescription",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.contacts").$D("联系人"),
          fieldType: "TEXT",
          fieldCode: "contactName",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.tel").$D("联系电话"),
          fieldType: "TEXT",
          fieldCode: "contactMobilephone",
          formRow: 50,
          formCol: 10,
          render: (_, record) => record.internationalTelCode ?
            `${record.internationalTelCode} | ${record.contactMobilephone || ""}` :
            record.contactMobilephone
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.contactMail").$D("联系人邮箱"),
          fieldType: "TEXT",
          fieldCode: "contactMail",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.button.allotSection").$D("分配标段"),
          fieldType: "TEXT",
          fieldCode: "allocatedLot",
          visible: this.headerInfo.subjectMatterRule === "PACK",
          formRow: 70,
          formCol: 10,
          render: (_, record) => {
            if (record && record.supSectionAssignLovDTOS && record.supSectionAssignLovDTOS.length) {
              return record.supSectionAssignLovDTOS.map((lot) => lot.sectionName).join(",");
            }
            return null;
          }
        },
      ];
    },
    // 列-项目计划
    getProjectPlanColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.projectStage").$D("项目阶段"),
          fieldType: "EMPTY",
          fieldCode: "projectStageMeaning",
          formRow: 0,
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              {val}
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.planCompleteDate").$D("计划完成日期"),
          fieldType: "TEXT",
          fieldCode: "planCompleteDate",
          formRow: 10,
          formCol: 20,
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ];
    },
  },
  async mounted() {
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    // 查询
    if (this.changeReqId) {
      this.getHeadInfo();
      this.itemDs.refresh();
      this.relatedDocumentDs.refresh();
    }
  },
  methods: {
    // 获取个性化单元编码
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const CodeDataMap = new Map([
        [ "scrollTabs", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.TABS" ], // 滚动标签-标签 暂未开放 敬请期待
        [ "closeReasonForm", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.CLOSE_REASON" ], // 关闭原因-表单
        // [ "relatedDocList", "" ], // 关联单据-列表 暂未开放 敬请期待
        [ "basicForm", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.BASIC_INFO" ], // 基础信息-表单
        [ "demandForm", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.DEMAND_FORM" ], // 需求方-表单
        [ "executeForm", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.EXECUTE_FORM" ], // 执行人-表单
        [ "itemPartList", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.ITEM_INFO" ], // 物料-部分-列表
        [ "itemDetailForm", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.ITEM_DETAIL_INFO" ], // 物料-全部-表单
        [ "sectionList", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.SECTION_INFO" ], // 标段-列表
        [ "attachment", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.ATTACHMENT" ], // 附件
        [ "sourceMethodForm", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.SOURCE_METHOD_FORM" ], // 寻源方式-表单
        [ "supplierList", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.SUPPLIER_TABLE" ], // 供应商-列表
        [ "projectPlanList", "SMBL.WORKFLOW.SOURCE_PROJECT_CLOSE_APPROVAL.PROJECT_PLAN_TABLE" ], // 项目计划-列表
      ]);

      let currentUnitCode = null;

      if (typeof type === "string") {
        currentUnitCode = CodeDataMap.get(type);
      }

      if (isArray(type)) {
        const codeSet = new Set();
        type.forEach((unitCode) => {
          codeSet.add(CodeDataMap.get(unitCode));
        });

        currentUnitCode = codeSet.size ? [ ...codeSet ].join(",") : null;
      }

      return currentUnitCode;
    },
    // 获取头信息
    getHeadInfo() {
      if (!this.sourceProjectId) {
        return;
      }
      const params = {
        customizeUnitCode: this.getCustomizeUnitCode([ "closeReasonForm", "basicForm", "demandForm", "executeForm" ]),
        sourceProjectId: this.sourceProjectId,
      };

      this.$loading.show();
      getBasicInfoApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: self.$T("smbl.common.message.request.error").$D("请求失败"),
            description: res.message,
            class: "notification"
          });
          this.$loading.hide();
        } else {
          this.headerInfo = res;
          this.headerDs.create(res, 0);
        }
      }).finally(() => this.$loading.hide());
    },
    // 物料详情页
    showExpandItemDetailInfo(record = {}) {
      if (!record) {
        return;
      }

      this.itemDetailPop = true;
      const _record = cloneDeep(record) || {};
      this.itemDetailDs.create(_record, 0);
    },
    // 物料详情页 关闭回调事件
    itemDetailCloseEvent() {
      this.itemDetailPop = false;
      this.itemDetailDs.reset();
    },
    // 标段/包-物料信息弹窗
    showSectionItem(record = {}) {
      if (!record.projectLineSectionId) {
        return;
      }
      this.sectionItemPop = true;

      // 深拷贝
      // 避免ds.reset 重置数据[{}]
      const _record = cloneDeep(record);

      this.sectionHeaderDs.create(_record, 0);
      this.sectionItemDs.addQueryParameter("projectLineSectionId", _record.projectLineSectionId);
      this.sectionItemDs.refresh();
    },
    // 标段/包-物料信息弹窗 关闭回调事件
    sectionItemCloseEvent() {
      // 重置表单信息
      this.sectionItemPop = false;
      this.sectionHeaderDs.reset();
      this.sectionItemDs.reset();
    },
    // 跳转详情页
    goDetail(record = {}) {
      const { targetFrom = "", sourceHeaderId = "", secondarySourceCategory = "" } = record || {};
      // RFX
      if (targetFrom === "RFX") {
        const bidFlag = secondarySourceCategory === "NEW_BID";
        const environmentUrl = window.location.origin;
        let toUrl;
        // 构造跳转地址
        if (bidFlag) {
          const detailUrl = `/NewBidHall/#/HallDetail?rfxHeaderId=${sourceHeaderId}`;
          toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
        } else {
          const detailUrl = `/RfxHall/#/RfxHall?rfxHeaderId=${sourceHeaderId}`;
          toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
        }
        if (toUrl) {
          this.$popup({
            title: this.$T("ssrc.common.view.details").$D("详情"),
            showHeader: true,
            showBack: true,
            content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
          });
        }
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.srm-span-title {
  font-size: 12px;
  line-height: 16px;
  padding: 10px 15px;
  font-weight: 600;
  color: var(--font-color-default);
}

.icon-chevron-right-color-style {
  color: var(--font-color-default);
}

.srm-list-header-item-name {
  >>> .srm-list-item-card-head-left{
    max-width: 100% !important;
  }
}

.section-item-popup-container {
  height: 100%;
  background-color: var(--background-color-empty-second);
}

.rfx-sp-close-method-list-card {
  >>> .srm-check-box:last-child .srm-list-item-card {
    border-bottom: 4px solid var(--background-color-empty-second)
  }
}
</style>