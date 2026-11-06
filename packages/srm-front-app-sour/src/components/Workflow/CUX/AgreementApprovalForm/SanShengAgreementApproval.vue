<template>
  <div v-loading="initLoading" style="min-height: 500px;">
    <section v-if="headInfo" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <srm-scroll-tab-item v-if="headInfo" class="infoContent" :label="$T('spcm.common.view.message.title.contractHeaderInformation').$D('协议信息')">
            <div class="card-personalized">
              <customize :columns="getAgreementInfoColumns" :data-source="headInfo" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.AGREEMENT_INFO"/>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item v-if="lineInfo.length > 0" class="infoContent" :label="$T('spcm.common.view.message.title.contractSubject').$D('协议标的')">
            <div v-for="(item,index) in lineInfo" :key="index" class="card-personalized">
              <div @click="showLineInfoDetail(item)">
                <customize :columns="getSubjectInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.SUBJECT_INFO"/>
              </div>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item v-if="agreementPhaseInfo.length > 0" class="infoContent" :label="$T('spcm.common.view.message.title.contractStage').$D('协议阶段')">
            <div v-for="(item,index) in agreementPhaseInfo" :key="index" class="card-personalized">
              <customize :columns="getStageInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.STAGE_INFO"/>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item v-if="agreementPartnerInfo.length > 0" class="infoContent" :label="$T('smbl.common.view.title.signedCompany').$D('签署公司')">
            <div v-for="(item,index) in agreementPartnerInfo" :key="index" class="card-personalized">
              <div @click="showPartnerInfo(item)">
                <customize :columns="getPartnerInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.PARTNER_INFO"/>
              </div>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item v-if="agreementProcurementInfo.length > 0" class="infoContent" :label="$T('spcm.common.view.message.title.businessTermsInformation').$D('业务条款')">
            <div v-for="(item,index) in agreementProcurementInfo" :key="index" class="detail-info">
              <div class="sub-title">{{ `${item.termTypeName}-${item.termTypeCode}` }}</div>
              <ul>
                <!-- 个性化组件替换后的代码 -->
                <customize :columns="getTermInfoColumns" :data-source="item" code="SMBL.WORKFLOW.AGREEMENT_APPROVAL.TERM_INFO"/>
              </ul>
            </div>
          </srm-scroll-tab-item>
          <srm-scroll-tab-item v-if="historicList.length > 0" key="approveRecord" :label="$T('smbl.common.button.taskDetail.record').$D('审批记录')">
            <history-record-tiled
              :action-data="historicList"
              :is-approval="true"
              operator-field-name="assigneeName"
              operation-meaning-field-name="name"
              process-date-field-name="endTime"
              process-remark-field-name="comment" />
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>
      <!-- 标的信息详情弹窗 -->
      <srm-popup :visible.sync="show"
                 position="right"
                 show-back
                 height="100%"
                 :show-close="false"
                 :title="$T('spcm.common.view.message.title.subjectInformation').$D('标的明细')">
        <section class="lineInfoDetail">
          <div class="lineHead">
            <li>
              <span>
                <span>
                  {{ $T("spcm.common.model.common.lineNumber").$D("行号") }}: {{
                    lineInfoDetail.displayLineNum
                  }}
                </span>
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
          <div class="card-personalized">
            <!-- 个性化组件替换后的代码 -->
            <customize-detail :columns="getSubjectDetailInfoColumns" :data-source="lineInfoDetail"/>
            <div class="no-more"/>
          </div>
        </section>
      </srm-popup>

      <!-- 伙伴信息详情弹窗 -->
      <srm-popup
        :visible.sync="partnerInfoFlag"
        position="right"
        show-back
        height="100%"
        :show-close="false"
        :title="$T('smbl.common.view.title.signedCompany').$D('签署公司')">
        <section class="lineInfoDetail">
          <div class="lineHead">
            <p>
              <span>{{ $T("entity.company.companyCode").$D("公司编码") }}：</span>
              <span>{{ partnerInfo.companyNum }}</span>
            </p>
            <p>
              <span>{{ $T("entity.company.companyName").$D("公司名称") }}：</span>
              <span>{{ partnerInfo.companyName }}</span>
            </p>
          </div>
          <div class="card-personalized">
            <!-- 个性化组件替换后的代码 -->
            <customize-detail :columns="getPartnerDetailInfoColumns" :data-source="partnerInfo"/>
            <div class="no-more"/>
          </div>
        </section>
      </srm-popup>

      <!-- 协议附件弹窗 -->
      <srm-popup
        :visible.sync="agreementAttFlag"
        position="right"
        show-back
        height="100%"
        :show-close="false"
        :title="$T('spcm.common.view.message.comContractAttachment').$D('协议附件')">
        <div v-if="agreementAttList.length>0" class="srm-span-attachment">
          <div v-for="(item,index) in agreementAttList" :key="index">
            <customize-detail :columns="getAgreementAttListInfoColumns" :data-source="item"/>
          </div>
        </div>
      </srm-popup>

      <attached-file v-model="filePopup" :attachment-uuid="attachmentUuid"/>
    </section>
  </div>
</template>

<script>
import uuid from "uuid";
import { SrmUtil } from "srm-mobile-ui";
import AttachedFile from "@/components/File/AttachedFile";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import {
  getPoPurchaserApi,
  getPurchaseApi,
  getRfxApi,
  getAgreementPhaseApi,
  getAgreementPartnerApi,
  getAgreementProcurementApi,
  getAgreementAttApi,
  getAgreementApi,
  getAgreementDetailApi,
  getContractApprovalApi,
} from "./api/SanSheng";
import { dateFormat } from "@/utils/index";

export default {
  modules: [ "spcm.purchaseRequisitionCreation", "hipspfm.common", "spcm.common", "entity.organization", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "entity.company", "small.common", "entity.attachment", "sqam.inquiryHall", "smbl.common", "sprm.common" ],
  name: "SanShengAgreementApproval",
  components: {
    AttachedFile,
    HistoryRecordTiled,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    historicTaskList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      initLoading: false,
      headInfo: {},
      lineInfo: [],
      agreementPhaseInfo: [],
      agreementPartnerInfo: [],
      agreementProcurementInfo: [],
      attachmentUuid: "",
      filePopup: false,
      show: false,
      lineInfoDetail: {},
      partnerInfo: {},
      partnerInfoFlag: false,
      moreAttribute1Meaning: "",
      agreementAttFlag:false,
      agreementAttList:[],
      electronicAttachmentFlag:false, //电子签章附件
      historicList: [],
    };
  },
  computed: {
    getAgreementInfoColumns() {
      const columns = [
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcName").$D("协议名称"),
          fieldCode: "pcName",
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
        {
          formRow:30,
          formCol:20,
          fieldName: this.$T("entity.organization.class.createName").$D("创建人"),
          fieldCode: "createByRealName",
        },
        this.lineInfo.length > 0 && {
          formRow:40,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          render:(val, record) => {
            const taxIncludeAmount = SrmUtil.getNumberLocalized(val);
            return taxIncludeAmount + "(" + record.taxIncludeAmountChinese + ")";
          }
        },
        !this.lineInfo.length && {
          formRow:45,
          formCol:10,
          fieldName: this.$T("sprm.common.model.common.taxIncludeAmount").$D("协议总金额"),
          fieldCode: "attributeDecimal2",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:50,
          formCol:10,
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          formRow:60,
          formCol:10,
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          formRow:70,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.pcKindCode").$D("协议性质"),
          fieldCode: "pcKindCodeMeaning",
        },
        {
          formRow:80,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
          fieldCode: "pcTypeName",
        },
        {
          formRow:90,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.pcTemplateId").$D("协议模板"),
          fieldCode: "templateName",
        },
        {
          formRow:100,
          formCol:10,
          fieldName: this.$T("spcm.common.model.agentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
        },
        {
          formRow:110,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.checkType").$D("验收类型"),
          fieldCode: "acceptTypeMeaning",
        },
        {
          formRow:120,
          formCol:10,
          fieldName: this.$T("spcm.common.model.model.signedEffect").$D("签署即生效"),
          fieldCode: "signEffectFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          formRow:130,
          formCol:10,
          fieldName: this.$T("spcm.common.model.effectiveTime").$D("有效时长"),
          fieldCode: "effectiveTime",
          render: (val) => {
            if (val) {
              return val + this.$T("ssrc.common.model.day").$D("天");
            }
            return val;
          }
        },
        {
          formRow:140,
          formCol:10,
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          formRow:150,
          formCol:10,
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldCode: "endDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          formRow:160,
          formCol:10,
          fieldName: this.$T("spcm.common.model.mainPcNum").$D("主协议"),
          fieldCode: "mainPcNum",
        },
        {
          formRow:170,
          formCol:10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          formRow:180,
          formCol:10,
          fieldName: this.$T("spcm.common.view.message.title.contractAttachment").$D("协议文本"),
          fieldCode: "attributeLongtext7",
          render: (val) =>
            <SrmUpload
              isTab={false}
              showIcon={false}
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              fileArr={[
                {
                  title: this.$T("spcm.common.view.message.contractAttachment").$D("协议文本（附件合同必传）"),
                  attachmentUuid: val || uuid(),
                  readOnly: true
                },
              ]}/>
          ,
        },
        this.electronicAttachmentFlag && {
          formRow:190,
          formCol:10,
          fieldName: this.$T("spcm.common.view.btn.electronicSignatureAttachment").$D("电子签章附件"),
          fieldCode: "electronicSignatureAttachment",
          render:(val, record) => {
            // 待签署附件
            let pcHeaderElectronicSignatureAttachment = record.pcHeaderElectronicSignatureAttachment || uuid();
            // 已签署附件
            let pcHeaderElectronicSignatureAttachmentIsSigned = record.pcHeaderElectronicSignatureAttachmentIsSigned || uuid();
            return <SrmUpload
              isTab={false}
              showIcon={false}
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              fileArr={[
                {
                  title: this.$T("spcm.common.attachment.toBeSigned").$D("待签署附件"),
                  attachmentUuid: pcHeaderElectronicSignatureAttachment,
                  readOnly: true
                },
                {
                  title: this.$T("spcm.common.attachment.Signed").$D("已签署附件"),
                  attachmentUuid: pcHeaderElectronicSignatureAttachmentIsSigned,
                  readOnly: true
                },
              ]}/>;
          }
        },
        {
          formRow:200,
          formCol:10,
          fieldName: this.$T("sodr.common.model.common.attachment").$D("附件"),
          fieldCode: "attachment",
          render:(val, record) => {
            // 采购方附件
            let purchaserAttachmentUuid = record.purchaserAttachmentUuid || uuid();
            // 协议附件
            let attachmentUuid = record.attachmentUuid || uuid();
            // 供方附件
            let supplierAttachmentUuid = record.supplierAttachmentUuid || uuid();
            return (
              <SrmUpload
                isTab={false}
                showIcon={false}
                descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
                fileArr={[
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
                ]}/>
            );
          }
        },
        // {
        //   fieldName: this.$T("sodr.common.model.common.attachment").$D("附件"),
        //   fieldCode: "attachment",
        //   render:(val, record) => {
        //     // 采购方附件
        //     let attachmentUuid = record.attachmentUuid || uuid();
        //     // 供方附件
        //     let supplierAttachmentUuid = record.supplierAttachmentUuid || uuid();
        //     return <SrmUpload
        //       isTab={true}
        //       showIcon={false}
        //       descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
        //       fileArr={[
        //         {
        //           title: this.$T("spcm.common.view.btn.purchaserAttachment").$D("采购方附件"),
        //           attachmentUuid: attachmentUuid,
        //           readOnly: true
        //         },
        //         {
        //           title: this.$T("spcm.common.model.supAttachmentFlag").$D("供方附件"),
        //           attachmentUuid: supplierAttachmentUuid,
        //           readOnly: true
        //         },
        //       ]}/>;
        //   }
        // },
      ];
      return columns;
    },
    getSubjectInfoColumns() {
      const columns = [
        {
          fieldType:"EMPTY",
          fieldCode:"companyName",
          formRow:0,
          render:(val, record) => <SrmListHeader showOpenTag={true}>
            <span>{ record.itemName }</span>
            <span slot="right">{ this.$T("spcm.common.model.common.lineNumber").$D("行号") }:{record.displayLineNum}</span>
          </SrmListHeader>
        },
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          formRow:11,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.categoryName").$D("物料分类"),
          fieldCode: "categoryName",
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.noTaxPrice").$D("不含税单价"),
          fieldCode: "unitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:40,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.link.priceSourceD").$D("价格来源单据号（寻源号）"),
          fieldCode: "attributeLongtext28",
          render: (val, record) => <srm-flex>
            <srm-button type="primary" plain rect onClick={() => this.toDetail("MANUAL_PRICE_SOURCE_RESULT", record)}>{val}</srm-button>
          </srm-flex>,
        },
        this.headInfo.pcSourceCode && this.headInfo.pcSourceCode === "PURCHASE_NEED" && {
          fieldName: this.$T("smbl.common.message.link.purchaseNeed").$D("采购申请跳转链接"),
          fieldCode: "sourceCode",
          render: (val, record) => <srm-flex>
            <srm-button type="primary" plain rect onClick={() => this.toDetail("PURCHASE_NEED", record)}>{val}</srm-button>
          </srm-flex>,
        },
      ];
      return columns;
    },
    getStageInfoColumns() {
      const columns = [
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.stageCode").$D("阶段编码"),
          fieldCode: "stageCode",
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.stageName").$D("阶段名称"),
          fieldCode: "stageName",
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.termId").$D("付款条款"),
          fieldCode: "termName",
        },
        {
          formRow:40,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.costQuantity").$D("费用"),
          fieldCode: "costQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("spcm.common.model.common.milestoneTime").$D("里程碑时间"),
          fieldCode: "milestoneTime",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ];
      return columns;
    },
    getPartnerInfoColumns() {
      const columns = [
        {
          fieldType:"EMPTY",
          fieldCode:"companyName",
          formRow:0,
          render:(val, record) => <SrmListHeader showOpenTag={true}>
            <span>{ record.companyName }</span>
            <span slot="right">{record.partnerTypeName}</span>
          </SrmListHeader>
        },
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("entity.company.companyCode").$D("公司编码"),
          fieldCode: "companyNum",
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          render:(val, record) => (record.internationalTelCode && val ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          formRow:40,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
      ];
      return columns;
    },
    getTermInfoColumns() {
      const columns = [
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termContent").$D("条款内容"),
          fieldCode: "termContent",
          render:(val, record) => {
            if (String(record.termType) === "LOV" && record.termTypeList.length > 0) {
              const cTermTypeList = record.termTypeList;
              for (let i = 0; i < cTermTypeList.length; i++) {
                if (String(cTermTypeList[i].value) === String(val)) {
                  return cTermTypeList[i].meaning;
                }
              }
              return val;
            }
            return val;
          }
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termRemark").$D("条款说明"),
          fieldCode: "remark",
        }
      ];
      return columns;
    },
    getSubjectDetailInfoColumns() {
      const columns = [
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.MaterialClassify").$D("物料分类"),
          fieldCode: "categoryName",
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("spcm.common.model.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.model").$D("型号"),
          fieldCode: "model",
        },
        {
          formRow:40,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.unit").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          formRow:50,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:60,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          formRow:70,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.unitPriceBatch").$D("价格批量"),
          fieldCode: "unitPriceBatch",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:80,
          formCol:10,
          fieldName: this.$T("small.common.model.smallOrderQuantity").$D("最小起订量"),
          fieldCode: "attribute5",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:90,
          formCol:10,
          fieldName: this.$T("small.common.model.priceType").$D("价格类型"),
          fieldCode: "attribute1Meaning",
        },
        {
          formRow:100,
          formCol:10,
          fieldName: this.$T("spcm.common.currencyCode").$D("原币币种"),
          fieldCode: "currencyCode",
        },
        {
          formRow:110,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.purchaseCurrencyCode").$D("本币币种"),
          fieldCode: "purchaseCurrencyCode",
        },
        {
          formRow:120,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.exchangeRate").$D("汇率:(本币/原币)"),
          fieldCode: "exchangeRate",
        },
        {
          formRow:130,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.purchasePriceTax").$D("进价(含税)"),
          fieldCode: "taxIncludedUnitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:140,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.purchaseTaxIncludedPrice").$D("本币含税单价"),
          fieldCode: "purchaseTaxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:150,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.purchasePriceNoTax").$D("进价(不含税)"),
          fieldCode: "unitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:160,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.PlatformForTax").$D("平台售价(含税)"),
          fieldCode: "attribute4",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:170,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.PlatformForNoTax").$D("平台售价(不含税)"),
          fieldCode: "attribute7",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:180,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.commissionRatio").$D("佣金比例"),
          fieldCode: "attribute10",
        },
        {
          formRow:190,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.taxIncludedLineAmount").$D("原币含税行金额"),
          fieldCode: "taxIncludedLineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:200,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.purchaseTaxLineAmount").$D("本币含税行金额"),
          fieldCode: "purchaseTaxLineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:210,
          formCol:10,
          fieldName: this.$T("spcm.common.model.uncludedTaxLineAmount").$D("原币不含税行金额"),
          fieldCode: "lineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:220,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.taxAmount").$D("原币税额"),
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow:230,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          formRow:240,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.export.itemPropertiesMeaning").$D("属性"),
          fieldCode: "itemPropertiesMeaning",
        },
        {
          formRow:250,
          formCol:10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("spcm.common.model.link.priceSourceD").$D("价格来源单据号（寻源号）"),
          fieldCode: "attributeLongtext28",
          render: (val, record) => <srm-flex>
            <srm-button type="primary" plain rect onClick={() => this.toDetail("MANUAL_PRICE_SOURCE_RESULT", record)}>{val}</srm-button>
          </srm-flex>,
        },
      ];
      return columns;
    },
    getPartnerDetailInfoColumns() {
      const columns = [
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D("伙伴类型"),
          fieldCode: "partnerTypeName",
        },
        {
          formRow:20,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D("伙伴类型编码"),
          fieldCode: "partnerTypeCode",
        },
        {
          formRow:30,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          formRow:40,
          formCol:10,
          fieldName: this.$T("spcm.common.model.contractname").$D("联系人"),
          fieldCode: "contacts",
        },
        {
          formRow:50,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          render:(val, record) => (record.internationalTelCode && val ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          formRow:60,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.faxes").$D("传真"),
          fieldCode: "faxes",
        },
        {
          formRow:70,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
        {
          formRow:80,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.bankName").$D("开户行名称"),
          fieldCode: "bankName",
        },
        {
          formRow:90,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
        },
        {
          formRow:100,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
        },
        {
          formRow:110,
          formCol:10,
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
        }
      ];
      return columns;
    },
    getAgreementAttListInfoColumns() {
      const columns = [
        {
          formRow:10,
          formCol:10,
          fieldName: this.$T("entity.attachment.name").$D("附件名称"),
          fieldCode: "attachmentUrl",
          render: (val) => {
            if (val) {
              const arr = val.split("@");
              return <div>
                <span style="color: blue" onClick={() => this.showContractAttachment(arr[arr.length - 1], val)}>{arr[arr.length - 1]}</span>
              </div>;
            }
          }
        },
      ];
      return columns;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.getAgreementDetail();
        await this.getAgreement();
        await this.getAgreementPhase();
        await this.getAgreementPartner();
        await this.getAgreementProcurement();
        await this.transformHistoryData();
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.initLoading = false;
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowAgrement.view.title.agrementApproval").$D("协议审批"));
  },
  methods: {
    // 跳转来源单据
    async toDetail(type, record) {
      let toUrl;
      let params = {};
      // 环境域名
      const environmentUrl = window.location.origin;
      switch (type) {
      // 采购申请
      case "PURCHASE_NEED":
        params = {
          multiSelectHeaderAndLineNums:record.sourceCode,
          customizeUnitCode: "SPRM.PURCHASE_PLAFORM_EXECUTION.FLATSEARCHBAR,SPRM.PURCHASE_PLAFORM_EXECUTION.LIST"
        };
        this.$loading.show();
        await getPurchaseApi(params).then((res) => {
          if (res.content && res.content.length) {
            // 获取headerId
            const prHeaderId = res.content[0].prHeaderId;
            // 构造跳转地址
            const detailUrl = `/PurchaseReqWorkbench/#/PurchaseReqWorkbenchDetail?prHeaderId=${prHeaderId}&type=readOnly`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.none.sourceDocError").$D("来源单据不存在"),
              duration: 2000
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      // 采购订单
      case "PURCHASE_ORDER":
        params = {
          displayPoNum:record.sourceCode,
          customizeUnitCode: "SODR.SEND_ORDER_LIST.FILTER_DETAIL,SODR.SEND_ORDER_LIST.FRID_BY_DETAIL"
        };
        this.$loading.show();
        await getPoPurchaserApi(params).then((res) => {
          if (res.content && res.content.length) {
            // 获取headerId
            const {
              orgName,
              poHeaderId,
              unreadCount,
              displayPoNum
            } = res.content[0];
            // 构造跳转地址
            const detailUrl = `/MyOrder/#/MyOrderDetail?poHeaderId=${poHeaderId}&orgName=${orgName}&unreadCount=${unreadCount}&displayPoNum=${displayPoNum}`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.none.sourceDocError").$D("来源单据不存在"),
              duration: 2000
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      // 寻源单据
      case "SEARCH_SOURCE_RESULT":
        if (record.resultSourceFrom === "NEW_BID") {
          params = {
            multiRfxNumOrTitle: record.sourceCode,
            customizeUnitCode: "SSRC.BID_HALL.NEW_LIST.ALL,SSRC.BID_HALL.NEW_LIST.FILTER_BAR",
            customizeOrderField:"creationDate:desc",
            secondarySourceCategory: record.resultSourceFrom,
          };
        } else {
          params = {
            multiRfxNumOrTitle: record.sourceCode,
            customizeUnitCode: "SSRC.INQUIRY_HALL.NEW_LIST.ALL,SSRC.INQUIRY_HALL.NEW_LIST.FILTER_BAR",
            customizeOrderField:"creationDate:desc",
          };
        }
        this.$loading.show();
        await getRfxApi(params).then((res) => {
          if (res.content && res.content.length) {
            // 获取headerId
            const rfxHeaderId = res.content[0].rfxHeaderId;
            // 构造跳转地址

            if (record.resultSourceFrom === "NEW_BID") {
              const detailUrl = `/NewBidHall/#/HallDetail?rfxHeaderId=${rfxHeaderId}`;
              toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
            } else {
              const detailUrl = `/RfxHall/#/RfxHall?rfxHeaderId=${rfxHeaderId}`;
              toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
            }
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.none.sourceDocError").$D("来源单据不存在"),
              duration: 2000
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      // 手工新建时，价格服务寻源单号跳转处理
      case "MANUAL_PRICE_SOURCE_RESULT":
        params = {
          multiRfxNumOrTitle: record.attributeLongtext28,
          customizeUnitCode: "SSRC.INQUIRY_HALL.NEW_LIST.ALL,SSRC.INQUIRY_HALL.NEW_LIST.FILTER_BAR",
          customizeOrderField:"creationDate:desc",
        };
        this.$loading.show();
        await getRfxApi(params).then((res) => {
          if (res.content && res.content.length) {
            // 获取headerId
            const rfxHeaderId = res.content[0].rfxHeaderId;
            // 构造跳转地址

            const detailUrl = `/RfxHall/#/RfxHall?rfxHeaderId=${rfxHeaderId}`;
            toUrl = `${environmentUrl}/WxCover/?navigateTo=${encodeURIComponent(detailUrl)}&access_token=${SrmUtil.getUserToken()}`;
          } else {
            this.$notification.open({
              message: this.$T("smbl.common.message.none.sourceDocError").$D("来源单据不存在"),
              duration: 2000
            });
          }
        }).finally(() => {
          this.$loading.hide();
        });
        break;
      default: return null;
      }
      if (toUrl) {
        this.detailPopup = this.$popup({
          title: this.$T("spcm.common.view.details").$D("详情"),
          showHeader: true,
          showBack: true,
          content:<iframe style="height:100%;width:100%" ref="relate_data" src={toUrl}/>
        });
      }
    },
    async transformHistoryData() {
      // 合同审批记录
      await getContractApprovalApi(this.changeReqId).then((res) => {
        if (!res) {
          return false;
        }
        res.forEach((item) => {
          const newApprovalHistories = item.approvalHistories.reverse();
          const historicTaskExtList = newApprovalHistories.map(
            (hisItem) => hisItem.historicTaskExtList.map((task) => {
              if (task.actType === "startEvent") {
                return { ...task, nodeName: hisItem.processTypeMeaning, name: this.$T("spcm.common.view.btn.startEvent").$D("开始"), };
              } else if (task.actType === "endEvent") {
                return { ...task, nodeName: hisItem.processTypeMeaning, name: this.$T("spcm.common.view.btn.endEvent").$D("结束"), };
              }
              return task;
            })
          );
          this.historicList = this.historicList.concat(...historicTaskExtList);
        });
      });
    },
    // 显示用章文本附件
    async showContractAttachment(fileName, fileAdress) {
      SrmUtil.previewFile({
        fileName: fileName,
        fileUrl: fileAdress,
        bucketName: SrmUtil.getDefaultBucketName()
      });
    },
    showAttachmentPop(pcHeaderId) {
      this.getAgreementAttInfo(pcHeaderId);
      this.agreementAttFlag = !this.agreementAttFlag;
    },
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
      this.show = true;
    },
    // 显示伙伴信息详情
    showPartnerInfo(data) {
      this.partnerInfo = data;
      this.partnerInfoFlag = true;
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
        // 判断是否有电子签章附件
        // 1、附件签章：signatureType === 'ANNEX_SIGNATURE' && electricSignFlag === 1 && authType === 'ESIGN'
        // 2、附件文本签章：(signatureType === 'TEXT_AND_ANNEX_SIGNATURE' && electricSignFlag === 1 && authType === 'ESIGN')
        // 3、后端配置 附件参数：electronicSignatureAttachmentDisplayFlag === 'Y' （是否附件签章）
        if (this.headInfo.signatureType === "ANNEX_SIGNATURE" && this.headInfo.electricSignFlag === 1 && this.headInfo.authType === "ESIGN" ||
        this.headInfo.signatureType === "TEXT_AND_ANNEX_SIGNATURE" && this.headInfo.electricSignFlag === 1 && this.headInfo.authType === "ESIGN" ||
        this.headInfo.electronicSignatureAttachmentDisplayFlag === "Y") {
          this.electronicAttachmentFlag = true;
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
    }
  }
};
</script>

<style lang="stylus" scoped>

.mainDetail {
  overflow visible;

  .contentWrap {
    font-family: PingFangSC-Medium;
    overflow visible;

    .content {
      .infoContent {
        h3 {
          padding: 20px 53px 12px 15px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color: var(--color-font-default, #1b1e2b);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }

        .input-edit {
          margin-top: 18px;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;

  .header {
    font-size: 18px;
    color: var(--color-font-default, #1b1e2b);
    text-align: center;
    line-height: 26px;
    font-weight: bold;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default, #1b1e2b);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid #F0F2F5;

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: #C6CAD6;
    }

    p {
      span {
        color: var(--color-font-default, #1b1e2b);
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
    background-color: var(--color-font-default-d);
    height: calc(100vh - 160px);
    overflow: auto;

    ul {
      padding-left: 5.333vw;

      li {
        border-bottom: 1px solid var(--color-border-default);
        display: flex;
        flex-direction: column;
        padding: 13px 20px 11px 0;

        span:nth-child(1) {
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: var(--color-font-default-b);
          line-height: 20px;
          margin-bottom: 8px;
          word-break: break-all;
        }

        span:nth-child(2) {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: var(--color-font-default);
          line-height: 24px;
          min-height: 24px;
          word-break: break-all;
        }
      }
    }
  }
}

.detail-info {
  .sub-title {
    width: 100%;
    padding: 16px 20px;
    line-height: 22px;
    font-size: 14px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    background: #FBFCFE;
    border-top: 1px solid var(--color-border-default);
  }

  ul {
    padding-left: 5.333vw;

    li {
      border-bottom: 1px solid var(--color-border-default);
      display: flex;
      flex-direction: column;
      padding: 13px 20px 11px 0;

      span:nth-child(1) {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: var(--color-font-default-b);
        line-height: 20px;
        margin-bottom: 8px;
        word-break: break-all;
      }

      span:nth-child(2) {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: var(--color-font-default);
        line-height: 24px;
        min-height: 24px;
        word-break: break-all;
      }
    }

    .language-attachment {
      img {
        width: 16px;
        height: 16px;
        margin-top: 4px;
        float: right;
      }
    }
  }
}

.card-personalized {
  width: 100%;
  color: #666666;
  padding 12px 15px;
  background: var(--color-bg-default);

  .card-first-single {
    text-align: left;
    font-size: 16px;
    color: var(--color-font-default, #1b1e2b);
    font-weight: bold;
    padding: 12px 0;
  }

  .card-first-between {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

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
}

.srm-span-attachment{
  padding: 0 15px;
}
</style>
