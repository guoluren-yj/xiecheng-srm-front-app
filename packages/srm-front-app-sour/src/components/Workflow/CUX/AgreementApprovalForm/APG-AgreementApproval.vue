<template>
  <section v-if="headInfo" class="mainDetail">
    <srm-tab class="main-tab" @changeTab="changeTab">
      <srm-tab-pane :class="{'last-tab-pan': currentTabIndex === 1}" :label="$T('spcm.common.view.message.title.contractHeaderInformation').$D('协议信息')">
        <div class="card">
          <customize v-if="JSON.stringify(headInfo) !== '{}'" :need-padding="true" :columns="getAgreementInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.AGREEMENT_INFO"/>
        </div>
      </srm-tab-pane>
      <srm-tab-pane :class="{'last-tab-pan': currentTabIndex === 2}" :label="$T('spcm.common.view.message.title.approveRecordInformation').$D('审批记录')">
        <div v-if="JSON.stringify(approvalRecordsInfo) === '[]'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
        </div>
        <div v-for="(item,index) in approvalRecordsInfo" :key="index" class="card" style="padding: 12px 15px;">
          <customize :need-padding="false" :columns="getApprovalRecordsColumns" :data-source="item" code=""/>
        </div>
      </srm-tab-pane>
      <srm-tab-pane :class="{'last-tab-pan': currentTabIndex === 3}" :label="$T('spcm.common.view.message.title.contractSubject').$D('协议标的')">
        <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
        </div>
        <div v-for="(item,index) in lineInfo" :key="index" class="card">
          <div @click="showLineInfoDetail(item)">
            <div class="card-first-between">
              <span class="line-code open-tag">
                {{ item.itemName }}
              </span>
              <span class="line-num">
                <span>{{ $T('spcm.common.model.common.lineNumber').$D('行号') }}：{{ item.displayLineNum }}</span>
              </span>
            </div>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getSubjectInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.SUBJECT_INFO"/>
          </div>
        </div>
      </srm-tab-pane>
      <srm-tab-pane :class="{'last-tab-pan': currentTabIndex === 4}" :label="$T('spcm.common.view.message.title.contractStage').$D('协议阶段')">
        <div v-if="JSON.stringify(agreementPhaseInfo) === '[]'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
        </div>
        <div v-for="(item,index) in agreementPhaseInfo" :key="index" class="card">
          <div class="card-first-single">{{ `${item.stageName}-${item.stageCode}` }}</div>
          <!-- 个性化组件替换后的代码 -->
          <customize :need-padding="true" :columns="getStageInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.STAGE_INFO"/>
        </div>
      </srm-tab-pane>
      <srm-tab-pane :class="{'last-tab-pan': currentTabIndex === 5}" :label="$T('spcm.common.view.message.title.partnerInformation').$D('伙伴信息')">
        <div v-if="JSON.stringify(agreementPartnerInfo) === '[]'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
        </div>
        <div v-for="(item,index) in agreementPartnerInfo" :key="index" class="card">
          <div @click="showPartnerInfo(item)">
            <div class="card-first-between">
              <span class="line-code open-tag">
                {{ item.companyName }}
              </span>
              <span class="line-num">
                {{ item.partnerTypeName }}
              </span>
            </div>
            <!-- 个性化组件替换后的代码 -->
            <customize :need-padding="true" :columns="getPartnerInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.PARTNER_INFO"/>
          </div>
        </div>
      </srm-tab-pane>
      <srm-tab-pane class="last-tab-pan" :label="$T('spcm.common.view.message.title.businessTermsInformation').$D('业务条款')">
        <div v-if="JSON.stringify(agreementProcurementInfo) === '[]'" class="noContent">
          <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
        </div>
        <div v-for="(item,index) in agreementProcurementInfo" :key="index" class="card">
          <div class="sub-title">{{ `${item.termTypeName}-${item.termTypeCode}` }}</div>
          <!-- 个性化组件替换后的代码 -->
          <customize :need-padding="true" :columns="getTermInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.TERM_INFO"/>
        </div>
      </srm-tab-pane>
    </srm-tab>
    <!-- 标的信息详情弹窗 -->
    <srm-popup :visible.sync="show" :title="$T('spcm.common.view.message.title.subjectInformation').$D('标的明细')" height="100%" position="right" :show-back="true">
      <section class="line-info-detail">
        <div class="line-head">
          <li>
            <span>
              <span>{{ $T("spcm.common.model.common.lineNumber").$D("行号") }}: {{ lineInfoDetail.displayLineNum }}</span>
            </span>
          </li>
          <p>
            <span>{{ $T("spcm.common.model.common.itemCode").$D("物料编码") }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T("spcm.common.model.common.itemName").$D("物料名称") }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="card">
          <!-- 个性化组件替换后的代码 -->
          <customize-detail :need-padding="true" :columns="getSubjectDetailInfoColumns" :data-source="lineInfoDetail" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.SUBJECT_DETAIL_INFO"/>
          <div class="no-more"/>
        </div>
      </section>
    </srm-popup>

    <!-- 伙伴信息详情弹窗 -->
    <srm-popup :visible.sync="partnerInfoFlag" :title="$T('spcm.common.view.message.title.partnerInformation').$D('伙伴信息')" height="100%" position="right" :show-back="true">
      <section class="line-info-detail">
        <div class="line-head">
          <p>
            <span>{{ $T("entity.company.companyCode").$D("公司编码") }}：</span>
            <span>{{ partnerInfo.companyNum }}</span>
          </p>
          <p>
            <span>{{ $T("entity.company.companyName").$D("公司名称") }}：</span>
            <span>{{ partnerInfo.companyName }}</span>
          </p>
        </div>
        <div class="card">
          <!-- 个性化组件替换后的代码 -->
          <customize-detail :need-padding="true" :columns="getPartnerDetailInfoColumns" :data-source="partnerInfo" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.PARTNER_DETAIL_INFO"/>
          <div class="no-more"/>
        </div>
      </section>
    </srm-popup>

    <srm-popup :visible.sync="departmentShowFlag" :title="$T('spcm.common.model.distributionDepartment').$D('分发部门')" height="80%" rounded>
      <div v-loading="departmentLoadingFlag" style="width: 100%;height: 100%;">
        <div v-for="(item, index) in displayDepartments" :key="index" class="card" style="padding-top: 16px;">
          <customize :need-padding="true" :columns="getDepartmentColumns" :data-source="item" type="list" code=""/>
        </div>
      </div>
    </srm-popup>
  </section>
</template>

<script>
import uuid from "uuid";
import {
  getAgreementPhaseApi,
  getAgreementPartnerApi,
  getAgreementProcurementApi,
  getDistributionDepartmentInfo,
  getApprovalRecordsApi,
  getAgreementApi,
  getAgreementDetailApi,
  getAgreementAttApi
} from "./api/ApgApi";

export default {
  modules: [ "hipspfm.common", "spcm.common", "hipspfm.workFlowAgrement", "sqam.inquiryHall", "spcm.purchaseRequisitionCreation", "entity.organization", "small.common", "entity.company", "smbl.common", "sbud.budgeting", "spcm.purchaseContractView", "entity.department", "sodr.common" ],
  name: "APGAgreementApproval",
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      agreementPhaseInfo: [],
      agreementPartnerInfo: [],
      agreementProcurementInfo: [],
      show: false,
      lineInfoDetail: {},
      partnerInfo: {},
      partnerInfoFlag: false,
      moreAttribute1Meaning: "",
      // 分发部门
      departmentShowFlag: false,
      departmentLoadingFlag: false,
      displayDepartments: [],
      approvalRecordsInfo: [],
      // 当前的index
      currentTabIndex: 0,
      agreementAttList:[],
    };
  },
  computed: {
    getAgreementInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.backgroundDesc").$D("背景说明"),
          fieldCode: "remark",
          formRow: 10,
        },
        {
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
          formRow: 20,
        },
        {
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
          formRow: 30,
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcName").$D("协议名称"),
          fieldCode: "pcName",
          formRow: 40,
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
          formRow: 50,
        },
        {
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
          formRow: 60,
        },
        {
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val),
          formRow: 70,
        },
        {
          fieldName: this.$T("entity.organization.class.createName").$D("创建人"),
          fieldCode: "createByRealName",
          formRow: 80,
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcKindCode").$D("协议性质"),
          fieldCode: "pcKindCodeMeaning",
          formRow: 90,
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
          fieldCode: "pcTypeName",
          formRow: 100,
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcTemplateId").$D("协议模版"),
          fieldCode: "templateName",
          formRow: 110,
        },
        {
          fieldName: this.$T("spcm.common.model.agentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
          formRow: 120,
        },
        {
          fieldName: this.$T("spcm.common.model.common.checkType").$D("验收类型"),
          fieldCode: "acceptTypeMeaning",
          formRow: 130,
        },
        {
          fieldName: this.$T("spcm.common.model.model.signedEffect").$D("签署即生效"),
          fieldCode: "signEffectFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
          formRow: 140,
        },
        {
          fieldName: this.$T("spcm.common.model.effectiveTime").$D("有效时长"),
          fieldCode: "effectiveTime",
          render: (val) => {
            if (val) {
              return val + this.$T("smbl.common.view.day").$D("天");
            }
            return val;
          },
          formRow: 150,
        },
        {
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val),
          formRow: 160,
        },
        {
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldCode: "endDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val),
          formRow: 170,
        },
        {
          fieldName: this.$T("spcm.common.model.mainPcNum").$D("主协议"),
          fieldCode: "mainPcNum",
          formRow: 180,
        },
        {
          fieldName: this.$T("spcm.common.model.common.unitId").$D("所属部门"),
          fieldCode: "attribute14",
          formRow: 200,
        },
        {
          fieldName: this.$T("spcm.common.copies").$D("原件份数"),
          fieldCode: "attribute1",
          formRow: 210,
        },
        {
          fieldName: this.$T("spcm.common.model.export.approvalMethod").$D("审批方式"),
          fieldCode: "attribute2Meaning",
          formRow: 220,
        },
        {
          fieldName: this.$T("spcm.common.model.sealType").$D("用印类型"),
          fieldCode: "attribute5Meaning",
          formRow: 230,
        },
        {
          fieldName: this.$T("spcm.common.estimatedPrice").$D("合同预估总价"),
          fieldCode: "attribute9",
          formRow: 240,
        },
        {
          fieldName: this.$T("spcm.common.model.isSuppliersContract").$D("是否供应商类合同"),
          fieldCode: "attribute13Meaning",
          formRow: 250,
        },
        {
          fieldName: this.$T("spcm.common.model.pcSourceCode").$D("协议来源"),
          fieldCode: "pcSourceCodeMeaning",
          formRow: 260,
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.deviceTypeFlag").$D("是否设备类合同"),
          fieldCode: "attribute6",
          render: (val) => Number(val) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否"),
          formRow: 270,
        },
        {
          fieldName: this.$T("spcm.common.model.distributionDepartment").$D("分发部门"),
          fieldCode: "attribute15",
          render: (val) => <div style="color: var(--color-other-default-b)" onClick={(e) => {
            e.stopPropagation();
            this.checkDistributionDepartmentInfo(val);
          }}>{this.$T("smbl.common.view.clickToView").$D("点击查看")}</div>,
          formRow: 280,
        },
        {
          fieldName: this.$T("sbud.budgeting.model.budgeting.budgetDesc").$D("预算说明"),
          fieldCode: "internalPostil",
          formRow: 290,
        },
        {
          fieldName: this.$T("spcm.common.contractData").$D("随标的合同、资料"),
          fieldCode: "attribute12",
          formRow: 300,
        },
        {
          fieldName: this.$T("spcm.common.sourceValue").$D("比价来源"),
          fieldCode: "attribute11",
          formRow: 310,
        },
        {
          fieldName: this.$T("spcm.common.instructions").$D("金额说明"),
          fieldCode: "attribute10",
          formRow: 320,
        },
        {
          fieldName: this.$T("spcm.common.model.replyToReviewComments").$D("回复评审意见"),
          fieldCode: "attributeVarchar10",
          formRow: 330,
        },
        {
          fieldName: this.$T("spcm.common.model.defaultDescription").$D("违约责任说明"),
          fieldCode: "attribute7",
          render: (val) => <SrmUpload descTitle={this.$T("smbl.common.button.viewAttachments").$D("查看附件")} attachmentUuid={val} showIcon={false} type="primary" bucketName="public-bucket"/>,
          formRow: 340,
        },
        {
          fieldName: this.$T("spcm.common.model.stipulationDescription").$D("重要条款说明"),
          fieldCode: "attribute8",
          render: (val) => <SrmUpload descTitle={this.$T("smbl.common.button.viewAttachments").$D("查看附件")} attachmentUuid={val} showIcon={false} type="primary" bucketName="public-bucket"/>,
          formRow: 350,
        },
        {
          fieldName: this.$T("sodr.common.model.common.attachment").$D("附件"),
          fieldCode: "attachment",
          render:(val, record) => {
            // 采购方附件
            let purchaserAttachmentUuid = record.purchaserAttachmentUuid || uuid();
            // 协议附件
            let attachmentUuid = record.attachmentUuid || uuid();
            // 供方附件
            let supplierAttachmentUuid = record.supplierAttachmentUuid || uuid();
            // 构建附件列表
            let fileArrs = [
              {
                title: this.$T("spcm.common.view.btn.purchaserAttachment").$D("采购方附件"),
                attachmentUuid: purchaserAttachmentUuid,
                readOnly: true
              },
              {
                title: this.$T("spcm.common.view.message.comContractAttachment").$D("协议附件"),
                attachmentUuid: attachmentUuid,
                readOnly: true
              },
              {
                title: this.$T("spcm.common.model.supAttachmentFlag").$D("供方附件"),
                attachmentUuid: supplierAttachmentUuid,
                readOnly: true
              },
            ];
            this.agreementAttList.map((e) => {
              const agreementFile = {
                title: e.attachmentTypeName,
                attachmentUuid: e.attachmentUuid,
                readOnly: true
              };
              fileArrs.push(agreementFile);
            });
            return <SrmUpload
              isTab={false}
              showIcon={false}
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              fileArr={fileArrs}/>;
          }
        },
      ];
      return columns;
    },
    getSubjectInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.itemCode").$D("物品编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.quantity").$D("数量"),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("spcm.common.model.common.noTaxPrice").$D("不含税单价"),
          fieldCode: "unitPrice",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ];
      return columns;
    },
    getStageInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.stageCode").$D("阶段编码"),
          fieldCode: "stageCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.termId").$D("付款条款"),
          fieldCode: "termName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.costQuantity").$D("费用"),
          fieldCode: "costQuantity",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.milestoneTime").$D("里程碑时间"),
          fieldCode: "milestoneTime",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.payRatio").$D("付款比例"),
          fieldCode: "payRatio",
          render: (val) => String(val) + "%",
        },
        {
          fieldName: this.$T("spcm.common.model.paymentType").$D("付款方式"),
          fieldCode: "typeName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
        },
      ];
      return columns;
    },
    getPartnerInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("entity.company.companyCode").$D("公司编码"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
      ];
      return columns;
    },
    getTermInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termContent").$D("条款内容"),
          fieldCode: "termContent",
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termRemark").$D("条款说明"),
          fieldCode: "remark",
        }
      ];
      return columns;
    },
    getSubjectDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.MaterialClassify").$D("物料分类"),
          fieldCode: "categoryName",
          formRow: 10,
        },
        {
          fieldName: this.$T("spcm.common.model.specifications").$D("规格"),
          fieldCode: "specifications",
          formRow: 20,
        },
        {
          fieldName: this.$T("spcm.common.model.common.model").$D("型号"),
          fieldCode: "model",
          formRow: 30,
        },
        {
          fieldName: this.$T("spcm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          formRow: 40,
        },
        {
          fieldName: this.$T("spcm.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
          formRow: 50,
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
          formRow: 60,
        },
        {
          fieldName: this.$T("spcm.common.model.priceReductionRatio").$D("降价比例"),
          fieldCode: "attributeDecimal11",
          formRow: 70,
        },
        {
          fieldName: this.$T("spcm.common.mode.minPackageNum").$D("最小包装数"),
          fieldCode: "attributeBigint11",
          formRow: 80,
        },
        {
          fieldName: this.$T("spcm.common.model.common.priceStartDate").$D("价格有效期从"),
          fieldCode: "priceStartDate",
          formRow: 130,
        },
        {
          fieldName: this.$T("spcm.common.model.common.priceEndDate").$D("价格有效期至"),
          fieldCode: "priceEndDate",
          formRow: 140,
        },
        {
          fieldName: this.$T("spcm.common.model.placeOrigin").$D("产地"),
          fieldCode: "attribute1",
          formRow: 150,
        },
        {
          fieldName: this.$T("spcm.common.model.deCodeType").$D("开发费分摊方式(万件)"),
          fieldCode: "attribute2",
          formRow: 160,
        },
        {
          fieldName: this.$T("spcm.common.model.moldCostType").$D("工模具费分摊方式(万件)"),
          fieldCode: "attribute3",
          formRow: 170,
        },
        {
          fieldName: this.$T("spcm.common.model.moldLife").$D("工模具寿命(万件)"),
          fieldCode: "attribute4",
          formRow: 180,
        },
        {
          fieldName: this.$T("spcm.common.model.minimumEconomicLot").$D("最少经济批量"),
          fieldCode: "attributeDecimal1",
          formRow: 190,
        },
        {
          fieldName: this.$T("spcm.common.model.ProductionCapacity").$D("产能"),
          fieldCode: "attributeDecimal10",
          formRow: 200,
        },
        {
          fieldName: this.$T("spcm.common.model.productionCycle").$D("生产周期(天)"),
          fieldCode: "attributeBigint1",
          formRow: 210,
        },
        {
          fieldName: this.$T("spcm.common.model.deliveryCycle").$D("运输周期(天)"),
          fieldCode: "attributeBigint10",
          formRow: 220,
        },
        {
          fieldName: this.$T("spcm.common.model.sourceCode").$D("来源单据编号"),
          fieldCode: "sourceCode",
          formRow: 230,
        },
        {
          fieldName: this.$T("spcm.common.model.sourceLineNum").$D("来源单据行号"),
          fieldCode: "sourceLineNum",
          formRow: 240,
        },
        {
          fieldName: this.$T("spcm.common.model.common.unitPriceBatch").$D("价格批量"),
          fieldCode: "unitPriceBatch",
          formRow: 250,
        },
        {
          fieldName: this.$T("small.common.model.smallOrderQuantity").$D("最小起订量"),
          fieldCode: "attribute5",
          formRow: 260,
        },
        {
          fieldName: this.$T("small.common.model.priceType").$D("价格类型"),
          fieldCode: "attribute1Meaning",
          formRow: 270,
        },
        {
          fieldName: this.$T("spcm.common.currencyCode").$D("原币币种"),
          fieldCode: "currencyCode",
          formRow: 280,
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseCurrencyCode").$D("本币币种"),
          fieldCode: "purchaseCurrencyCode",
          formRow: 290,
        },
        {
          fieldName: this.$T("spcm.common.model.common.exchangeRate").$D("汇率(本币:原币)"),
          fieldCode: "exchangeRate",
          formRow: 300,
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchasePriceTax").$D("进价(含税)"),
          fieldCode: "taxIncludedUnitPrice",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val),
          formRow: 310,
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxIncludedPrice").$D("本币含税单价"),
          fieldCode: "purchaseTaxIncludedPrice",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val),
          formRow: 320,
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchasePriceNoTax").$D("进价(不含税)"),
          fieldCode: "unitPrice",
          formRow: 330,
          render: (val) => val ? Number(val).toFixed(2) : "",
        },
        {
          fieldName: this.$T("spcm.common.model.common.PlatformForNoTax").$D("平台售价(不含税)"),
          fieldCode: "attribute7",
          formRow: 350,
          render: (val) => val ? Number(val).toFixed(2) : "",
        },
        {
          fieldName: this.$T("spcm.common.model.common.commissionRatio").$D("佣金比例"),
          fieldCode: "attribute10",
          formRow: 360,
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxIncludedLineAmount").$D("原币含税行金额"),
          fieldCode: "taxIncludedLineAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val),
          formRow: 370,
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxLineAmount").$D("本币含税行金额"),
          fieldCode: "purchaseTaxLineAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcMoney"](val),
          formRow: 380,
        },
        {
          fieldName: this.$T("spcm.common.model.uncludedTaxLineAmount").$D("原币不含税行金额"),
          fieldCode: "lineAmount",
          formRow: 390,
          render: (val) => val ? Number(val).toFixed(2) : "",
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxAmount").$D("原币税额"),
          fieldCode: "taxAmount",
          formRow: 400,
          render: (val) => val ? Number(val).toFixed(2) : "",
        },
        {
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val),
          formRow: 410,
        },
        {
          fieldName: this.$T("spcm.common.model.common.export.itemPropertiesMeaning").$D("属性"),
          fieldCode: "itemPropertiesMeaning",
          formRow: 420,
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
          formRow: 430,
        }
      ];
      return columns;
    },
    getPartnerDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D("伙伴类型"),
          fieldCode: "partnerTypeName",
          formRow: 10,
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D("伙伴类型编码"),
          fieldCode: "partnerTypeCode",
          formRow: 20,
        },
        {
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
          formRow: 30,
        },
        {
          fieldName: this.$T("spcm.common.model.contractname").$D("联系人"),
          fieldCode: "contacts",
          formRow: 40,
        },
        {
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          formRow: 50,
        },
        {
          fieldName: this.$T("spcm.common.model.common.faxes").$D("传真"),
          fieldCode: "faxes",
          formRow: 60,
        },
        {
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
          formRow: 70,
        },
        {
          fieldName: this.$T("spcm.common.model.common.mail").$D("邮箱"),
          fieldCode: "mail",
          formRow: 80,
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankName").$D("开户行名称"),
          fieldCode: "bankName",
          formRow: 90,
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
          formRow: 100,
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
          formRow: 110,
        },
        {
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
          formRow: 120,
        }
      ];
      return columns;
    },
    getNavArr() {
      return [
        {
          title: this.$T(
            "spcm.common.view.message.title.contractHeaderInformation"
          ).$D("协议信息"),
          ref: "headInfo"
        },
        {
          title: this.$T("spcm.common.view.message.title.contractSubject").$D(
            "协议标的"
          ),
          ref: "lineInfo"
        },
        {
          title: this.$T("spcm.common.view.message.title.contractStage").$D(
            "协议阶段"
          ),
          ref: "phaseInfo"
        },
        {
          title: this.$T(
            "spcm.common.view.message.title.partnerInformation"
          ).$D("伙伴信息"),
          ref: "partnerInfo"
        },
        {
          title: this.$T(
            "spcm.common.view.message.title.businessTermsInformation"
          ).$D("业务条款"),
          ref: "businessInfo"
        },
        {
          title: this.$T(
            "spcm.common.view.message.title.approveRecordInformation"
          ).$D("审批记录"),
          ref: "approvalRecordsInfo"
        }
      ];
    },
    getDepartmentColumns() {
      return [
        {
          fieldName: "employeeNum",
          fieldCode: "employeeNum",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span>{ item.employeeNum + "-" + item.name }</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("entity.department.name").$D("部门名称"),
          fieldCode: "unitName",
          formRow: 20,
        },
        {
          fieldName: this.$T("spcm.common.model.postName").$D("岗位名称"),
          fieldCode: "positionName",
          formRow: 30,
        },
      ];
    },
    getApprovalRecordsColumns() {
      return [
        {
          fieldName: "processNodeName",
          fieldCode: "processNodeName",
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span>{ item.processNodeName + (item.processActionMeaning ? "-" + item.processActionMeaning : "") }</span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("spcm.common.model.workModalFlow.approvalBy").$D("审批人"),
          fieldCode: "processName",
          formRow: 20,
        },
        {
          fieldName: this.$T("spcm.common.model.common.processDate").$D("时间"),
          fieldCode: "processDate",
          formRow: 30,
        },
        {
          fieldName: this.$T("spcm.common.model.common.processRemark").$D("审批说明"),
          fieldCode: "processRemark",
          formRow: 40,
        },
      ];
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getAgreementDetail();
        await this.getAgreement();
        await this.getAgreementPhase();
        await this.getAgreementPartner();
        await this.getAgreementProcurement();
        await this.getApprovalRecords();
        await this.getAgreementAttInfo(this.changeReqId);
        // this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        // eslint-disable-next-line no-console
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowAgrement.view.title.agrementApproval").$D("协议审批"));
  },
  methods: {
    // 获取协议附件
    async getAgreementAttInfo(pcHeaderId) {
      this.agreementAttList = [];
      await getAgreementAttApi(pcHeaderId).then((res) => {
        if (res) {
          this.agreementAttList = res;
        }
      });
    },
    // 显示表的信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    // 显示伙伴信息详情
    showPartnerInfo(data) {
      this.partnerInfo = data;
      setTimeout(() => {
        this.partnerInfoFlag = true;
      }, 200);
    },
    // 获取协议审批详情信息
    async getAgreementDetail() {
      await getAgreementDetailApi(this.changeReqId).then((res) => {
        this.headInfo = res || {};
        if (typeof this.headInfo.attribute1Meaning === "object") {
          this.moreAttribute1Meaning = Object.values(
            this.headInfo.attribute1Meaning
          ).join("/");
        }
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        let purchaserAttachmentUuid = this.headInfo.purchaserAttachmentUuid || uuid();
        let supplierAttachmentUuid = this.headInfo.supplierAttachmentUuid || uuid();
        // this.$emit("GetAttachmentUuid", attachmentUuid);
        let FileArr = [
          {
            title: this.$T("spcm.common.view.btn.purchaserAttachment").$D("采购方附件"),
            attachmentUuid: purchaserAttachmentUuid,
            readOnly: true
          },
          {
            title: this.$T("spcm.common.view.message.comContractAttachment").$D("协议附件"),
            attachmentUuid: attachmentUuid,
            readOnly: true
          },
          {
            title: this.$T("sqam.inquiryHall.model.inquiryHall.supplierUuid").$D("供应商附件"),
            attachmentUuid: supplierAttachmentUuid,
            readOnly: true
          },
        ];
        this.$emit("GetAttachmentFileArr", FileArr);
      });
    },
    //获取协议标的信息
    async getAgreement() {
      await getAgreementApi(this.changeReqId).then((res) => {
        this.lineInfo = res.content;
      });
    },
    //获取协议阶段详情信息
    async getAgreementPhase() {
      await getAgreementPhaseApi(this.changeReqId).then((res) => {
        this.agreementPhaseInfo = res.content;
      });
    },
    //获取采购协议业务条款信息
    async getAgreementProcurement() {
      await getAgreementProcurementApi(this.changeReqId).then((res) => {
        this.agreementProcurementInfo = res.content;
      });
    },
    //获取伙伴信息
    async getAgreementPartner() {
      await getAgreementPartnerApi(this.changeReqId).then((res) => {
        this.agreementPartnerInfo = res;
      });
    },
    // 获取审批记录
    async getApprovalRecords() {
      await getApprovalRecordsApi(this.changeReqId).then((res) => {
        this.approvalRecordsInfo = res.content ? res.content : [];
      });
    },
    // 查看分发部门信息
    checkDistributionDepartmentInfo(params) {
      if (typeof params !== "string") {
        return;
      }
      this.displayDepartments = [];
      let departmentIds = params.split(",");
      this.departmentShowFlag = true;
      this.departmentLoadingFlag = true;
      getDistributionDepartmentInfo(departmentIds).then((response) => {
        for (let i = 0; i < departmentIds.length; i++) {
          this.displayDepartments.push(response[departmentIds[i]]);
        }
      }).finally(() => {
        this.departmentLoadingFlag = false;
      });
    },
    changeTab(val) {
      this.currentTabIndex = val.activeKey;
    },
  }
};
</script>

<style lang="stylus" scoped>

.line-info-detail {
  // background: #FAFBFC;
  height: 100%;

  .line-head {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default, #1b1e2b);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid #F0F2F5;

    p {
      span {
        color: var(--color-font-default, #1b1e2b);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .line-head :nth-child(2) {
    margin-bottom: 8px;
  }

}

.card {
  border-bottom: 1px solid var(--color-border-default);
  .card-first-between {
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
  .card-first-single {
    text-align: left;
    font-size: 16px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    padding: 12px 15px;
  }
  .sub-title {
    width: 100%;
    padding: 16px 15px;
    line-height: 22px;
    font-size: 14px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    background: #FBFCFE;
    border-top: 1px solid var(--color-border-default);
  }
}

.main-tab {
  >>> .srm-line-tab-content {
    height: calc(100vh - 200px);
    overflow: scroll !important;
    .last-tab-pan {
      margin-bottom: 45vh;
    }
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>
