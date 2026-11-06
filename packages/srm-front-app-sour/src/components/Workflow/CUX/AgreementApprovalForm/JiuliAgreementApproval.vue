<template>
  <div v-loading="initLoading" style="min-height: 500px;">
    <div ref="wrapper">
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('spcm.common.view.message.title.contractHeaderInformation').$D('协议信息')">
          <div class="card-personalized">
            <customize :columns="getAgreementInfoColumns" :data-source="headInfo"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spcm.common.view.message.title.contractSubject').$D('协议标的')">
          <div>
            <div v-if="!lineInfo.length" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
            </div>
            <div v-for="(item,index) in lineInfo" :key="index">
              <div @click="showLineInfoDetail(item)">
                <customize class="card-personalized" :columns="getSubjectInfoColumns" :data-source="item"/>
                <srm-blank size="small" theme="fill"/>
              </div>
            </div>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('spcm.common.view.message.title.contractStage').$D('协议阶段')">
          <div v-if="!agreementPhaseInfo.length" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementPhaseInfo" :key="index">
            <customize class="card-personalized" :columns="getStageInfoColumns" :data-source="item"/>
            <srm-blank size="small" theme="fill"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item class="infoContent" :label="$T('spcm.common.view.message.title.partnerInformation').$D('伙伴信息')">
          <div v-if="!agreementPartnerInfo.length" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementPartnerInfo" :key="index">
            <div @click="showPartnerInfo(item)">
              <customize class="card-personalized" :columns="getPartnerInfoColumns" :data-source="item"/>
              <srm-blank size="small" theme="fill"/>
            </div>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item class="infoContent" :label="$T('spcm.common.view.message.title.businessTermsInformation').$D('业务条款')">
          <div v-if="!agreementProcurementInfo.length" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noData").$D("暂无数据") }}</span>
          </div>
          <div v-for="(item,index) in agreementProcurementInfo" :key="index" class="detail-info">
            <div class="sub-title">{{ `${item.termTypeName}-${item.termTypeCode}` }}</div>
            <ul>
              <customize :columns="getTermInfoColumns" :data-source="item"/>
            </ul>
          </div>
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
      :title="$T('spcm.common.view.message.title.partnerInformation').$D('伙伴信息')">
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
  </div>
</template>

<script>
import uuid from "uuid";
import { SrmUtil } from "srm-mobile-ui";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getAgreementPhaseApi,
  getAgreementPartnerApi,
  getAgreementProcurementApi,
  getAgreementAttApi,
  getAgreementApi,
  getAgreementDetailApi,
} from "./api/jiuliIndex";
import { dateFormat } from "@/utils/index";

export default {
  modules: [ "spcm.purchaseRequisitionCreation", "hipspfm.common", "spcm.common", "entity.organization", "ssrc.common", "hipspfm.workFlowAgrement", "sodr.common", "entity.company", "small.common", "entity.attachment", "sqam.inquiryHall", "smbl.agreement" ],
  name: "AgreementApproval",
  components: {
    AttachedFile,
  },
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
      lineInfoFirst:{}, // 标的物首行信息
    };
  },
  computed: {
    getAgreementInfoColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcName").$D("协议名称"),
          fieldCode: "pcName",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
        {
          formRow: 30,
          formCol: 20,
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.createByRealName").$D("创建人"),
          fieldCode: "createByRealName",
        },
        {
          formRow: 40,
          formCol: 20,
          fieldName: this.$T("spcm.common.model.common.currencyType").$D("币种"),
          fieldCode: "currencyCode",
          render:() => this.lineInfoFirst.currencyCode
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.pcKindCode").$D("协议性质"),
          fieldCode: "pcKindCodeMeaning",
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
          fieldCode: "pcTypeName",
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.paymentType").$D("付款方式"),
          fieldCode: "attributeVarchar2Meaning",
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.totalNumber").$D("总数量"),
          fieldCode: "totalQuantity",
          render:() => this.lineInfoFirst.totalQuantity
        },
        {
          formRow: 100,
          formCol: 20,
          fieldName: this.$T("spcm.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
          render:() => this.lineInfoFirst.uomName
        },
        // {
        //   formRow: 90,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.common.pcTemplateId").$D("协议模板"),
        //   fieldCode: "templateName",
        // },
        // {
        //   formRow: 100,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.agentName").$D("采购员"),
        //   fieldCode: "purchaseAgentName",
        // },
        // {
        //   formRow: 110,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.common.checkType").$D("验收类型"),
        //   fieldCode: "acceptTypeMeaning",
        // },
        // {
        //   formRow: 120,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.model.signedEffect").$D("签署即生效"),
        //   fieldCode: "signEffectFlag",
        //   render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        // },
        // {
        //   formRow: 130,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.effectiveTime").$D("有效时长"),
        //   fieldCode: "effectiveTime",
        //   render: (val) => {
        //     if (val) {
        //       return val + this.$T("ssrc.common.model.day").$D("天");
        //     }
        //     return val;
        //   }
        // },
        {
          formRow: 140,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        // {
        //   formRow: 150,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
        //   fieldCode: "endDateActive",
        //   render: (val) =>
        //     // eslint-disable-next-line new-cap
        //     this.$options.filters["CalcDate"](val)
        // },
        // {
        //   formRow: 160,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.mainPcNum").$D("主协议"),
        //   fieldCode: "mainPcNum",
        // },
        {
          formRow: 170,
          formCol: 10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          formRow: 175,
          formCol: 10,
          fieldName: this.$T("spcm.common.view.message.comContractAttachment").$D("协议附件"),
          fieldCode: "contractFileUrl",
          render: (val) => {
            if (val) {
              const arr = val.split("@");
              return <span style="color: #276EF1" onClick={() => {
                SrmUtil.previewFile({
                  fileName: arr[arr.length - 1],
                  fileUrl: val,
                  bucketName: SrmUtil.getDefaultBucketName()
                });
              }}>{arr[arr.length - 1]}
              </span>;
            }
          }
        },
        {
          formRow: 180,
          formCol: 10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.contractAttachmentUrl").$D("合同附件"),
          fieldCode: "contractAttachmentUrl",
          render: (val) => {
            if (val) {
              const arr = val.split("@");
              return <span style="color: #276EF1" onClick={() => {
                SrmUtil.previewFile({
                  fileName: arr[arr.length - 1],
                  fileUrl: val,
                  bucketName: SrmUtil.getDefaultBucketName()
                });
              }}>{arr[arr.length - 1]}
              </span>;
            }
          }
        },
        this.electronicAttachmentFlag && {
          formRow: 190,
          formCol: 10,
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
          formRow: 200,
          formCol: 10,
          fieldName: this.$T("sodr.common.model.common.attachment").$D("附件"),
          fieldCode: "attachment",
          render:(val, record) => {
            // 采购方附件
            let purchaserAttachmentUuid = record.purchaserAttachmentUuid || uuid();
            // 协议附件
            let attachmentUuid = record.attachmentUuid || uuid();
            // 供方附件
            let supplierAttachmentUuid = record.supplierAttachmentUuid || uuid();
            return <SrmUpload
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
              ]}/>;
          }
        },
      ];
      return columns;
    },
    getSubjectInfoColumns() {
      const columns = [
        {
          formRow: 0,
          formCol: 10,
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={true}>
            <span> {record.itemName} </span>
            <span slot="right">{ this.$T("spcm.common.model.common.lineNumber").$D("行号") }：{record.displayLineNum}</span>
          </SrmListHeader>
        },
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.TaxPrice").$D("含税单价"),
          fieldCode: "taxIncludedUnitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        // {
        //   formRow: 30,
        //   formCol: 10,
        //   fieldName: this.$T("spcm.common.model.common.noTaxPrice").$D("不含税单价"),
        //   fieldCode: "unitPrice",
        //   fieldType: "INPUT_NUMBER",
        //   editor: false,
        // },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.outerDiameter").$D("外径"),
          fieldCode: "attributeDecimal1",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.wallThickness").$D("壁厚"),
          fieldCode: "attributeDecimal2",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.width").$D("宽度"),
          fieldCode: "attributeDecimal7",
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.length").$D("长度"),
          fieldCode: "attributeVarchar37",
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.brandAndManufacturer").$D("品牌/厂家"),
          fieldCode: "attributeVarchar15",
        },
      ];
      return columns;
    },
    getStageInfoColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.stageCode").$D("阶段编码"),
          fieldCode: "stageCode",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.stageName").$D("阶段名称"),
          fieldCode: "stageName",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.termId").$D("付款条款"),
          fieldCode: "termName",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.costQuantity").$D("费用"),
          fieldCode: "costQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 50,
          formCol: 10,
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
          formRow: 0,
          formCol: 10,
          fieldType:"EMPTY",
          render:(val, record) => <SrmListHeader showOpenTag={true}>
            <span> {record.companyName} </span>
            <span slot="right">{record.partnerTypeName}</span>
          </SrmListHeader>
        },
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("entity.company.companyCode").$D("公司编码"),
          fieldCode: "companyNum",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          render:(val, record) => (record.internationalTelCode && val ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
      ];
      return columns;
    },
    getTermInfoColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
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
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termRemark").$D("条款说明"),
          fieldCode: "remark",
        }
      ];
      return columns;
    },
    getSubjectDetailInfoColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.MaterialClassify").$D("物料分类"),
          fieldCode: "categoryName",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.model").$D("型号"),
          fieldCode: "model",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.unit").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.unitPriceBatch").$D("价格批量"),
          fieldCode: "unitPriceBatch",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("small.common.model.smallOrderQuantity").$D("最小起订量"),
          fieldCode: "attribute5",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("small.common.model.priceType").$D("价格类型"),
          fieldCode: "attribute1Meaning",
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("spcm.common.currencyCode").$D("原币币种"),
          fieldCode: "currencyCode",
        },
        {
          formRow: 110,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.purchaseCurrencyCode").$D("本币币种"),
          fieldCode: "purchaseCurrencyCode",
        },
        {
          formRow: 120,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.exchangeRate").$D("汇率:(本币/原币)"),
          fieldCode: "exchangeRate",
        },
        {
          formRow: 130,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.purchasePriceTax").$D("进价(含税)"),
          fieldCode: "taxIncludedUnitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 140,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.purchaseTaxIncludedPrice").$D("本币含税单价"),
          fieldCode: "purchaseTaxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 150,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.purchasePriceNoTax").$D("进价(不含税)"),
          fieldCode: "unitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 160,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.PlatformForTax").$D("平台售价(含税)"),
          fieldCode: "attribute4",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 170,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.PlatformForNoTax").$D("平台售价(不含税)"),
          fieldCode: "attribute7",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 180,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.commissionRatio").$D("佣金比例"),
          fieldCode: "attribute10",
        },
        {
          formRow: 190,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.taxIncludedLineAmount").$D("原币含税行金额"),
          fieldCode: "taxIncludedLineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 200,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.purchaseTaxLineAmount").$D("本币含税行金额"),
          fieldCode: "purchaseTaxLineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 210,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.uncludedTaxLineAmount").$D("原币不含税行金额"),
          fieldCode: "lineAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 220,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.taxAmount").$D("原币税额"),
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 230,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          formRow: 240,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.export.itemPropertiesMeaning").$D("属性"),
          fieldCode: "itemPropertiesMeaning",
        },
        {
          formRow: 250,
          formCol: 10,
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
        {
          formRow: 260,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.outerDiameter").$D("外径"),
          fieldCode: "attributeDecimal1",
        },
        {
          formRow: 270,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.wallThickness").$D("壁厚"),
          fieldCode: "attributeDecimal2",
        },
        {
          formRow: 280,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.width").$D("宽度"),
          fieldCode: "attributeDecimal7",
        },
        {
          formRow: 290,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.length").$D("长度"),
          fieldCode: "attributeVarchar37",
        },
        {
          formRow: 300,
          formCol: 10,
          fieldName: this.$T("smbl.agreement.scux.model.brandAndManufacturer").$D("品牌/厂家"),
          fieldCode: "attributeVarchar15",
        },
      ];
      return columns;
    },
    getPartnerDetailInfoColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D("伙伴类型"),
          fieldCode: "partnerTypeName",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D("伙伴类型编码"),
          fieldCode: "partnerTypeCode",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.contractname").$D("联系人"),
          fieldCode: "contacts",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          render:(val, record) => (record.internationalTelCode && val ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.faxes").$D("传真"),
          fieldCode: "faxes",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.bankName").$D("开户行名称"),
          fieldCode: "bankName",
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
        },
        {
          formRow: 110,
          formCol: 10,
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
        }
      ];
      return columns;
    },
    getAgreementAttListInfoColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
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
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.initLoading = false;
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowAgrement.view.title.agrementApproval").$D("协议审批"));
  },
  methods: {
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
        this.lineInfoFirst = res.content[0];
        let totalQuantity = 0;
        res.content.map((e) => {
          console.log("quantity:", e.quantity);
          totalQuantity += e.quantity;
        });
        this.lineInfoFirst.totalQuantity = totalQuantity === 0 ? "" : totalQuantity;
        console.log("totalQuantity:", totalQuantity, this.lineInfoFirst);
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
