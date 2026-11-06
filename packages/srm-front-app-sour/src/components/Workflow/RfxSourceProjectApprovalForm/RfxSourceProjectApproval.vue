<template>
  <div>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.baseInfos').$D('基础信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basisDs"
                  :columns="getBasisColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.BASIC_INFO"/>
      </srm-scroll-tab-item>
      <!-- 采购组织及人员 -->
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.inquiryHall.purOrganizationAndStaff').$D('采购组织及人员')">
        <h2> {{ $T('ssrc.inquiryHall.view.inquiryHall.demandSide').$D('需求方') }} </h2>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basisDs"
                  :columns="getBasisDemandColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.BASIC_DEMAND_INFO"/>
        <h2> {{ $T('ssrc.inquiryHall.view.inquiryHall.purchaseExecute').$D('采购执行人') }} </h2>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="basisDs"
                  :columns="getBasisExecuteColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.BASIC_EXECUTE_INFO"/>
      </srm-scroll-tab-item>
      <!-- 标段/包信息 -->
      <srm-scroll-tab-item v-if="subjectMatterRule==='PACK'" :label="$T('ssrc.inquiryHall.view.message.tab.sectionInformation').$D('标段/包信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="sectionDs"
                  :columns="getSectionColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.SECTION_INFO"/>
      </srm-scroll-tab-item>
      <!-- 物料明细 -->
      <srm-scroll-tab-item v-if="subjectMatterRule==='NONE'" :label="$T('ssrc.inquiryHall.view.message.tab.itemDetails').$D('物料明细')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="itemDs"
                  :columns="getSectionItemColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.ITEM_INFO"/>
      </srm-scroll-tab-item>
      <!-- 供应商信息 -->
      <srm-scroll-tab-item v-if="supplierDs.data.length > 0" :label="$T('ssrc.inquiryHall.view.tab.supplierList').$D('供应商列表')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="supplierDs"
                  :columns="getSupplierColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.SUPPLIER_INFO"/>
      </srm-scroll-tab-item>
      <!-- 项目计划信息 -->
      <srm-scroll-tab-item v-if="planDs.data.length > 0" :label="$T('ssrc.inquiryHall.view.message.tab.planList').$D('项目计划')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="planDs"
                  :columns="getPlanColumns"
                  customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.PLAN_INFO"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 标段/包-物料信息 -->
    <srm-popup :visible.sync="sectionItemPop"
               position="right"
               show-back
               height="100%"
               :show-close="false"
               :title="$T('ssrc.inquiryHall.view.message.button.viewAllotItem').$D('查看物料')">
      <srm-list :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="sectionItemDs"
                :columns="getSectionItemColumns"
                customize-code="SMBL.WORKFLOW.RFX_SOURCE_PROJECT.ITEM_INFO"/>
    </srm-popup>

    <!-- 报价明细信息 -->
    <srm-popup :visible.sync="quotaionDetailPop"
               position="right"
               show-back
               height="100%"
               :show-close="false"
               :title="$T('ssrc.inquiryHall.model.inquiryHall.quotaionDetail').$D('报价明细')">
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.baseInfos').$D('基础信息')">
          <customize
            :columns="getQuotaionDetailHeaderColumns"
            :data-source="quotaionHeaderInfo"
            type="list"
            :need-padding="false"
            style="padding: 10px 15px"/>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.card.subtitle.quotationInfo').$D('报价信息')">
          <div v-for="(item,index) in quotaionModuleList" :key="index">
            <div class="srm-quotation-title">
              {{ item.templateName }}
            </div>
            <srm-blank size="1px" theme="fill"/>
            <div v-for="(supQuotationDetail,index2) in item.supQuotationDetailPage.content.filter((e) => e.parentDetailId === null)" :key="index2">
              <customize
                :columns="getQuotaionDetailLineColumns"
                :data-source="{...supQuotationDetail,parentIndex: index}"
                type="list"
                :need-padding="false"
                style="padding: 10px 15px"/>
              <srm-blank size="small" theme="fill"/>
            </div>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </srm-popup>

    <!-- 报价明细行弹窗信息 -->
    <srm-popup :visible.sync="quotaionNextDetailPop"
               position="right"
               show-back
               height="100%"
               :show-close="false"
               :title="$T('ssrc.inquiryHall.model.inquiryHall.quotaionDetail').$D('报价明细')">
      <div v-for="(item,index) in quotationNextList" :key="index">
        <customize
          :columns="getQuotaionDetailLineColumns"
          :data-source="{...item,quotaionNextFlag: 1}"
          type="list"
          :need-padding="false"
          style="padding: 10px 15px"/>
        <srm-blank size="small" theme="fill"/>
      </div>
    </srm-popup>
  </div>
</template>
<script>
import {
  getBasisInfoApi,
  getQuotaionDetailInfoApi
} from "./api";
import { queryDoubleUnit } from "@/utils/utils";
import { dateFormat } from "@/utils/index";
import { commonDs, planDs, sectionDs, supplierDs, sectionItemDs, itemDs } from "./datasource/ds";
import { DataSet, SrmTooltip } from "srm-mobile-ui";
import { getUomName, getQtyName } from "@/utils/doubleUnit";
export default {
  modules: [ "ssrc.projectSetup", "ssrc.bidHall", "ssrc.inquiryHall", "ssrc.common", "smbl.common" ],
  name: "RfxSourceProjectApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      sourceProjectId:"", // 单据头id
      sectionItemPop:false,
      quotaionDetailPop:false,
      quotaionNextDetailPop:false,
      quotationNextList:[],
      quotaionHeaderInfo:{},
      quotaionModuleList:[],
      subjectMatterRule:"", // 单据类型（NONE：不区分 | PACK:分标段/包）
      basisDs:new DataSet(commonDs()),
      planDs:new DataSet(commonDs()),
      sectionDs:new DataSet(commonDs()),
      sectionItemDs:new DataSet(commonDs()),
      quotaionDetailDs:new DataSet(commonDs()),
      itemDs:new DataSet(commonDs()),
      supplierDs:new DataSet(commonDs()),
      doubleUnitFlag: false, // 判断是否开启双单位
    };
  },
  computed:{
    // 基础信息
    getBasisColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          fieldCode: "sourceProjectName",
          // fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sourceProjectName").$D("项目名称"),
          render: (_, record) => <SrmListHeader showOpenTag={false}>
            {record.sourceProjectName}
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sourceProjectNum").$D("项目编号"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectNum",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sourceCategory").$D("寻源类别"),
          fieldType: "TEXT",
          fieldCode: "secondarySourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.subjectMatterRule").$D("标的规则"),
          fieldType: "TEXT",
          fieldCode: "subjectMatterRuleMeaning",
        },
        {
          fieldName: this.$T("ssrc.bidHall.modal.inEnquiryHall.currency").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sourceMethod").$D("寻源方式"),
          fieldType: "TEXT",
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.depositAmount").$D("保证金"),
          fieldType: "TEXT",
          fieldCode: "depositAmount",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.estimatedDate").$D("预计完成日期"),
          fieldType: "TEXT",
          fieldCode: "estimatedDate",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sourceDate").$D("寻源时间"),
          fieldType: "TEXT",
          fieldCode: "sourceDate",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.creator").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createdByName",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.evaluatMethod").$D("评标办法"),
          fieldType: "TEXT",
          fieldCode: "evalMethodName",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.methodRemark").$D("评标办法说明"),
          fieldType: "TEXT",
          fieldCode: "methodRemark",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.sectionAttachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          fieldCode: "sourceProjectAttachmentUuid",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.paymentType").$D("付款方式"),
          fieldType: "TEXT",
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.paymentTerm").$D("付款条款"),
          fieldType: "TEXT",
          fieldCode: "paymentTermName",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.prejectRemark").$D("项目说明"),
          fieldType: "TEXT",
          fieldCode: "sourceProjectRemark",
        },
      ];
    },
    // 需求方信息
    getBasisDemandColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.companyName").$D("公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.unitName").$D("需求部门"),
          fieldType: "TEXT",
          fieldCode: "unitName",
        },
      ];
    },
    // 采购执行人信息
    getBasisExecuteColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.depositManage.purchaserName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaserName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purName").$D("采购联系人"),
          fieldType: "TEXT",
          fieldCode: "purAgent",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purPhone").$D("联系人电话"),
          fieldType: "TEXT",
          fieldCode: "contactMobilephone",
          render:(val, record) => val ? record.internationalTelCodeMeaning + " | " + val : ""
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.contactEmail").$D("联系人邮箱"),
          fieldType: "TEXT",
          fieldCode: "contactMail",
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.projectMember").$D("项目成员"),
          fieldType: "TEXT",
          fieldCode: "sourceMemberMeaning",
        },
      ];
    },
    // 标段/包信息
    getSectionColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: (_, record) =>
            <SrmListHeader showOpenTag={false}>
              { record.sectionName }
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "sectionNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.viewItemDetail").$D("物料"),
          fieldType: "TEXT",
          fieldCode: "sectionCode",
          render:(val, record) => <srm-flex>
            <srm-button plain rect onClick={() => this.showSectionItem(record.projectLineSectionId)} class="srm-link-title">
              {this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")} ({ record.projectItemCount })
            </srm-button>
          </srm-flex>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.library.attachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          fieldCode: "sectionAttachmentUuid",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "sectionRemark",
        },
      ];
    },
    // 标段/包-物料信息
    getSectionItemColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: (_, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.itemName}
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号"),
          fieldType: "TEXT",
          fieldCode: "projectLineItemNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.invOrganizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.categoryName").$D("物料类别"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.specifications").$D("规格"),
          fieldType: "TEXT",
          fieldCode: "specifications",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.goods.quantityRequired").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getQtyName(this.doubleUnitFlag),
          fieldCode: "requiredQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? null : {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.predictUnitPrice").$D("预算单价(元)"),
          fieldCode: "costPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.uomName").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "secondaryUomName",
        } : null,
        {
          fieldName: getUomName(this.doubleUnitFlag),
          fieldType: "TEXT",
          fieldCode: "uomName",
        },
        this.doubleUnitFlag ? null : {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.forLineAmnt").$D("预算行金额(元)"),
          fieldCode: "totalPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "estimatedPrice",
          fieldType: "EMPTY",
          render: (val) => <SrmTooltip class="rfx-source-project-tooltip" title={this.$T("ssrc.common.model.inquiryHall.estimatedSecondaryUnitPrice").$D("辅助单位对应的预估单价")} placement="top">
            <span>{this.$T("ssrc.projectSetup.model.projectSetup.predictUnitPrice").$D("预估单价(元)")}：{val || "-"}</span>
          </SrmTooltip>,
        },
        {
          fieldName: this.$T("ssrc.projectSetup.model.projectSetup.estimatedAmount").$D("预估行金额(元)"),
          fieldCode: "estimatedAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationTemplateName").$D("报价模板"),
          fieldType: "TEXT",
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotaionDetail").$D("报价明细"),
          fieldType: "TEXT",
          fieldCode: "quotationDetailFlag",
          render:(val, record) => {
            if (val) {
              return <srm-flex>
                <srm-button plain rect onClick={() => this.showQuotaionDetail(record)}>
                  {this.$T("ssrc.inquiryHall.model.inquiryHall.quotaionDetail").$D("报价明细")}
                </srm-button>
              </srm-flex>;
            }
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.prRequestedName").$D("申请人"),
          fieldType: "TEXT",
          fieldCode: "requestUserName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prNum").$D("采购申请号"),
          fieldType: "TEXT",
          fieldCode: "prNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prLineNum").$D("采购申请行号"),
          fieldType: "TEXT",
          fieldCode: "prLineNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lineAttachment").$D("行附件"),
          fieldType: "UPLOAD",
          fieldCode: "itemAttachmentUuid",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "itemRemark",
        },
      ].filter(Boolean);
    },
    // 供应商信息
    getSupplierColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: (_, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.supplierCompanyName}
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCompanyCode").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.supplierCategory").$D("供应商分类"),
          fieldType: "TEXT",
          fieldCode: "supplierCategoryDescription",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lifeCycle").$D("生命周期阶段"),
          fieldType: "TEXT",
          fieldCode: "stageDescription",
        },
      ];
    },
    // 项目计划信息
    getPlanColumns() {
      return [
        {
          // fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.projectStage").$D("项目阶段"),
          fieldType: "EMPTY",
          formRow: 0,
          fieldCode: "projectStageMeaning",
          render: (_, record) =>
            <SrmListHeader showOpenTag={false}>
              {record.projectStageMeaning}
            </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.planCompleteDate").$D("计划完成日期"),
          fieldType: "TEXT",
          fieldCode: "planCompleteDate",
          render:(val) => dateFormat(val)
        },
      ];
    },
    // 报价明细
    getQuotaionDetailHeaderColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.QuotationTemplateName").$D("报价模板名称"),
          fieldType: "TEXT",
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.common.model.common.supplierAttachNeed").$D("供应商附件必传"),
          fieldType: "TEXT",
          fieldCode: "attachmentNeedFlag",
          render:(val) => val ? this.$T("smbl.common.message.yes").$D("是") : this.$T("smbl.common.message.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allowCreateFlag").$D("允许供应商新建明细行"),
          fieldType: "TEXT",
          fieldCode: "allowCreateFlag",
          render:(val) => val ? this.$T("smbl.common.message.yes").$D("是") : this.$T("smbl.common.message.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.attachmentUuid").$D("附件"),
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid",
        },
      ];
    },
    // 报价明细行
    getQuotaionDetailLineColumns() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.configCod").$D("报价明细编码"),
          fieldType: "TEXT",
          fieldCode: "configCode",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.configName").$D("报价明细名称"),
          fieldType: "TEXT",
          fieldCode: "configName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.nextQuotationDetails").$D("下级报价明细"),
          fieldType: "TEXT",
          fieldCode: "childFlag",
          visible:(val, record) => !record.quotaionNextFlag,
          render:(val, record) => {
            if (record.childFlag === 1) {
              return <srm-button plain rect onClick={() => this.showNextQuotaionDetail(record)} class="srm-link-title">
                {this.$T("ssrc.inquiryHall.model.inquiryHall.view").$D("查看")}
              </srm-button>;
            }
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.quantity").$D("数量"),
          fieldCode: "configQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.Price").$D("单价"),
          fieldCode: "configUnitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
      ];
    },
  },
  async mounted() {
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    this.sourceProjectId = this.parameters.sourceProjectId;
    this.getBasisInfo(this.sourceProjectId);
    this.planDs = new DataSet(planDs(this.sourceProjectId));
    this.planDs.refresh();
    this.sectionDs = new DataSet(sectionDs(this.sourceProjectId));
    this.sectionDs.refresh();
    this.itemDs = new DataSet(itemDs(this.sourceProjectId));
    this.itemDs.refresh();
    this.supplierDs = new DataSet(supplierDs(this.sourceProjectId));
    this.supplierDs.refresh();
  },
  methods: {
    // 获取基础信息
    getBasisInfo(sourceProjectId) {
      getBasisInfoApi({ sourceProjectId, customizeUnitCode: "SMBL.WORKFLOW.RFX_SOURCE_PROJECT.BASIC_INFO" }).then((res) => {
        this.subjectMatterRule = res.subjectMatterRule;
        this.basisDs.setData([ res ] || []);
      });
    },
    // 获取报价明细
    getQuotaionDetailInfo(record) {
      const params = {
        itemCategoryId:record.itemCategoryId,
        itemId:record.itemId,
        quotationTemplateId:record.quotationTemplateId,
        rfxLineItemId:record.projectLineItemId,
        sourceFrom:"PROJECT",
        page: 0,
        size: 10000,
      };
      getQuotaionDetailInfoApi(this.sourceProjectId, params).then((res) => {
        this.quotaionModuleList = [];
        // 判断是否分模块
        if (res.moduleList) {
          this.quotaionHeaderInfo = res;
          this.quotaionModuleList = res.moduleList;
        } else {
          this.quotaionHeaderInfo = res;
          this.quotaionModuleList.push(res);
        }

      });
    },
    // 报价明细弹窗
    async showQuotaionDetail(record) {
      await this.getQuotaionDetailInfo(record);
      this.quotaionDetailPop = !this.quotaionDetailPop;
    },
    // 报价明细下级弹窗
    async showNextQuotaionDetail(record) {
      const quotationInfo = this.quotaionModuleList[record.parentIndex].supQuotationDetailPage.content;
      const curQuotationDetailId = record.quotationDetailId;
      this.quotationNextList = quotationInfo.filter((e) => e.parentDetailId !== null && e.parentDetailId === curQuotationDetailId);
      this.quotaionNextDetailPop = !this.quotaionNextDetailPop;
    },
    // 标段/包-物料信息弹窗
    showSectionItem(projectLineSectionId) {
      this.sectionItemPop = !this.sectionItemPop;
      this.sectionItemDs = new DataSet(sectionItemDs(this.sourceProjectId, projectLineSectionId));
      this.sectionItemDs.refresh();
    },
  }
};
</script>

<style lang="stylus" scoped>
.srm-span-title {
  font-size: 12px;
  line-height: 16px;
  padding: 10px 15px;
}

.srm-quotation-title {
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  font-weight: 400;
  padding: 10px 15px;
}
.srm-link-title {
  font-size: 12px;
  font-weight: 400;
}
>>> .srm-list-item-card-head .srm-list-item-card-head-left {
  font-weight: 600 !important;
}
.rfx-source-project-tooltip {
  >>> .srm-tooltip-wrapper {
    color: var(--font-color-field2);
  }
}
</style>