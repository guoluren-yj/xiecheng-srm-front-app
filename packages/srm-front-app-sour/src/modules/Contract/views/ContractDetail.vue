<template>
  <section>
    <srm-scroll-tab customize-code="SMBL.CONTRACT.DETAIL_TABS">
      <srm-scroll-tab-item
        code="headInfo"
        :label="
          $T('spcm.common.view.message.title.contractHeaderInformation').$D(
            '协议信息'
          )
        " >
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="headerFormDs"
          :columns="getAgreementInfoColumns"
          :customize-code="getCodeDefine('headerInfo')"
          @itemClick="clickHeaderInfo" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="contractSubject"
        :label="
          $T('spcm.common.view.message.title.contractSubject').$D('协议标的')
        " >
        <srm-list
          :data-set="subjectInfoDs"
          :columns="getSubjectInfoColumns"
          :scrollable="false"
          :customize-code="getCodeDefine('subjectInfo')"
          @itemClick="showLineInfoDetail" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="contractStage"
        :label="
          $T('spcm.common.view.message.title.contractStage').$D('协议阶段')
        " >
        <srm-list
          :data-set="stageInfoDs"
          :columns="getStageInfoColumns"
          :scrollable="false"
          :customize-code="getCodeDefine('stageInfo')" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="partner"
        :label="
          $T('spcm.common.view.message.title.partnerInformation').$D('伙伴信息')
        " >
        <srm-list
          :data-set="partnerInfoDs"
          :columns="getPartnerInfoColumns"
          :scrollable="false"
          :customize-code="getCodeDefine('partnerInfo')"
          @itemClick="showPartnerInfo" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="businessTerms"
        :label="
          $T('spcm.common.view.message.title.businessTermsInformation').$D(
            '业务条款'
          )
        " >
        <srm-list
          :data-set="termInfoDs"
          :columns="getTermInfoColumns"
          :scrollable="false"
          :customize-code="getCodeDefine('termInfo')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        code="tableExtend"
        :label="
          $T('spcm.common.view.message.title.contractTableExtend').$D(
            '自定义行表'
          )
        ">
        <srm-list
          :data-set="tableExtendInfoDs"
          :columns="getTableExtendInfoColumns"
          :scrollable="false"
          :customize-code="getCodeDefine('tableExtendInfo')" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item class="attachment" code="attachmentInfo" :label="$T('entity.attachment.tag.spcm').$D('附件')">
        <srm-form :data-set="headerFormDs" :columns="getFileColumns" :customize-code="getCodeDefine('attachmentInfo')" :row-col-to-seq="true" style="padding: 0" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" :show-header="false" position="right">
      <customize-detail
        v-if="visible"
        :need-padding="true"
        :data-source="popupData.data"
        :code="getCodeDefine(popupData.code)"
        :columns="getDetailColumns(popupData.code)"/>
    </srm-popup>
  </section>
</template>

<script>
import { SrmUtil, DataSet } from "srm-mobile-ui";
import { getPurchaseApi,
  getPoPurchaserApi,
  getRfxApi,
  getAgreementDetailApi,
  queryEnableDoubleUnit,
  fetchPcAttachmentList,
} from "../api/index";
import { lineInfoDS, headerFormDS, stageInfoDS, partnerInfoDS, termInfoDS, tableExtendInfoDS, allSignList } from "../datasource/index";
import { getDynamicLabel } from "../utils/index";
import { dateFormat } from "@/utils/index";

export default {
  modules: [ "hipspfm.common", "spcm.common", "hipspfm.workFlowAgrement", "sqam.inquiryHall", "spcm.purchaseRequisitionCreation", "entity.organization", "small.common", "entity.company", "ssrc.common", "smbl.common", "sodr.common", "entity.attachment" ],
  name: "AgreementApproval",
  components: {
    // SrmAttachmentButton,
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const { pcHeaderId: routePcHeaderId } = this.$route && this.$route.query || {};
    const pcHeaderId = routePcHeaderId || this.changeReqId;
    return {
      visible: false,
      initLoading: false,
      headInfo: {},
      pcHeaderId,
      headerFormDs: new DataSet(headerFormDS({ pcHeaderId })),
      lineInfo: [],
      subjectInfoDs: new DataSet(lineInfoDS({ pcHeaderId, })), // 标的信息
      popupData: {},
      agreementPhaseInfo: [],
      stageInfoDs: new DataSet(stageInfoDS({ pcHeaderId, })), // 阶段信息
      agreementPartnerInfo: [],
      partnerInfoDs: new DataSet(partnerInfoDS({ pcHeaderId, })), // 伙伴信息
      agreementProcurementInfo: [],
      termInfoDs: new DataSet(termInfoDS({ pcHeaderId, })), // 条款信息
      agreementTableExtend: [],
      tableExtendInfoDs: new DataSet(tableExtendInfoDS({ pcHeaderId, })), // 扩展信息
      attachmentUuid: "",
      show: false,
      showTableExtendFlag: false,
      lineInfoDetail: {},
      partnerInfo: {},
      partnerInfoFlag: false,
      moreAttribute1Meaning: "",
      electronicAttachmentFlag:false, //电子签章附件
      templateList: [], // 自定义附件
      doubleUnitFlag: 0,
      outerAttachment: [], // 外部附件
      enterAttachment: [], // 内部附件
    };
  },
  computed: {
    // 圣和药业基于标准二开，协议审批查看关联申请或寻源单据（srm-117309 2022/3/25）
    getTenantNum() {
      return window.localStorage.getItem("tenantNum") === "SRM-SANHOME";
    },
    getAgreementInfoColumns() {
      const columns = [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.pcName}
            <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", color: "var(--color-default)" }} />
          </SrmListHeader>,
          formRow: 1,
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
        },
        {
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // precision: (val,record) => {
          //   return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode,"financialPrecision"));
          // },
        },
        {
          fieldName: this.$T("entity.organization.class.createName").$D("创建人"),
          fieldCode: "createByRealName",
        },
        {
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcKindCode").$D("协议性质"),
          fieldCode: "pcKindCodeMeaning",
        },
        {
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldCode: "endDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        this.headInfo.pcKindCode && ![ "ATTACHMENT_FRAMEWORK", "ATTACHMENT" ].includes(this.headInfo.pcKindCode) && {
          fieldName: this.$T("spcm.common.view.message.title.contractAttachment").$D("协议文本"),
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
        this.headInfo.pcKindCode && [ "ATTACHMENT_FRAMEWORK", "ATTACHMENT" ].includes(this.headInfo.pcKindCode) && {
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
      ].filter(Boolean);
      return columns;
    },
    getAgreementDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcName").$D("协议名称"),
          fieldCode: "pcName",
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.pcNum").$D("协议编号"),
          fieldCode: "pcNum",
        },
        {
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "creationDate",
          render:(val) => dateFormat(val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.amount").$D("协议总额"),
          fieldCode: "taxIncludeAmount",
          // fieldType: "INPUT_NUMBER",
          editor: false,
          // precision: (val,record) => {
          //   return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode,"financialPrecision"));
          // },
        },
        {
          fieldName: this.$T("entity.organization.class.createName").$D("创建人"),
          fieldCode: "createByRealName",
        },
        {
          fieldName: this.$T("spcm.common.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("spcm.common.model.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcKindCode").$D("协议性质"),
          fieldCode: "pcKindCodeMeaning",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcType").$D("协议类型"),
          fieldCode: "pcTypeName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.pcTemplateId").$D("协议模板"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("spcm.common.model.agentName").$D("采购员"),
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.checkType").$D("验收类型"),
          fieldCode: "acceptTypeMeaning",
        },
        {
          fieldName: this.$T("spcm.common.model.model.signedEffect").$D("签署即生效"),
          fieldCode: "signEffectFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
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
          fieldName: this.$T("spcm.common.model.startDateActive").$D("协议起始日期"),
          fieldCode: "startDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.endDateActive").$D("协议终止日期"),
          fieldCode: "endDateActive",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.mainPcNum").$D("主协议"),
          fieldCode: "mainPcNum",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        },
        this.headInfo.pcKindCode && ![ "ATTACHMENT_FRAMEWORK", "ATTACHMENT" ].includes(this.headInfo.pcKindCode) && {
          fieldName: this.$T("spcm.common.view.message.title.contractAttachment").$D("协议文本"),
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
        this.headInfo.pcKindCode && [ "ATTACHMENT_FRAMEWORK", "ATTACHMENT" ].includes(this.headInfo.pcKindCode) && {
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
      ].filter(Boolean);
      return columns;
    },
    getSubjectInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.itemName}
            <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", color: "var(--color-default)" }} />
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("spcm.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getDynamicLabel(this.doubleUnitFlag, "quantity"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("spcm.common.model.common.unitPrice").$D("原币单价(不含税)"),
          fieldCode: "secondaryUnitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getDynamicLabel(this.doubleUnitFlag, "unitPrice"),
          fieldCode: "unitPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // render: (val) => {
          //   // eslint-disable-next-line new-cap
          //   return this.$options.filters["CalcMoney"](val);
          // }
        },
        {
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        this.headInfo.pcSourceCode && this.headInfo.pcSourceCode !== "MANUALLY" && {
          fieldName: this.$T("smbl.common.message.link.sourceCode").$D("来源单据编号链接"),
          fieldCode: "sourceCode",
          render:(val, record) => {
            // 采购需求：（pcSourceCode：PURCHASE_NEED）
            // 采购订单：（pcSourceCode：PURCHASE_ORDER）
            // 寻源结果：（pcSourceCode：SEARCH_SOURCE_RESULT）
            if (this.headInfo.pcSourceCode === "PURCHASE_NEED") {
              return <srm-flex>
                <srm-button type="primary" size="small" plain rect onClick={() => this.toDetail("PURCHASE_NEED", record)}>{ val }</srm-button>
              </srm-flex>;
            } else if (this.headInfo.pcSourceCode === "PURCHASE_ORDER") {
              return <srm-flex>
                <srm-button type="primary" size="small" plain rect onClick={() => this.toDetail("PURCHASE_ORDER", record)}>{ val }</srm-button>
              </srm-flex>;
            } else if (this.headInfo.pcSourceCode === "SEARCH_SOURCE_RESULT") {
              return <srm-flex>
                <srm-button type="primary" size="small" plain rect onClick={() => this.toDetail("SEARCH_SOURCE_RESULT", record)}>{ val }</srm-button>
              </srm-flex>;
            }
            return val;
          }
        },
      ].filter(Boolean);
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
          fieldType: "INPUT_NUMBER",
          editor: false,
          // render: (val) => {
          //   // eslint-disable-next-line new-cap
          //   return this.$options.filters["CalcMoney"](val);
          // }
        },
        {
          fieldName: this.$T("spcm.common.model.common.milestoneTime").$D("里程碑时间"),
          fieldCode: "milestoneTime",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
      ].filter(Boolean);
      return columns;
    },
    getPartnerInfoColumns() {
      const columns = [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.companyName}
            <span slot="right" class="srm-icon icon-chevron-right" style={{ fontSize: "16px", color: "var(--color-default)" }} />
          </SrmListHeader>,
          formRow: 1,
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D("伙伴类型名称"),
          fieldCode: "partnerTypeName",
        },
        {
          fieldName: this.$T("entity.company.companyCode").$D("公司编码"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spcm.common.model.contractname").$D("联系人"),
          fieldCode: "contacts",
        },
        {
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          render:(val, record) => (record.internationalTelCode && val ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
        {
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
        }
      ].filter(Boolean);
      return columns;
    },
    getTermInfoColumns() {
      const columns = [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.termTypeName}
          </SrmListHeader>,
          formRow: 1,
        },
        {
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termTypeCode").$D("业务条款编码"),
          fieldCode: "termTypeCode",
        },
        {
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
          fieldName: this.$T("spcm.purchaseRequisitionCreation.model.termRemark").$D("条款说明"),
          fieldCode: "remark",
        }
      ].filter(Boolean);
      return columns;
    },
    getTableExtendInfoColumns() {
      const columns = [];
      return columns;
    },
    getSubjectDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("spcm.common.model.common.MaterialClassify").$D("物料分类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("spcm.common.model.specifications").$D("规格"),
          fieldCode: "specifications",
        },
        {
          fieldName: this.$T("spcm.common.model.common.model").$D("型号"),
          fieldCode: "model",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("spcm.common.model.common.unit").$D("单位"),
          fieldCode: "secondaryUomId",
          render: (_, record) => record.secondaryUomCodeAndName || "-"
        } : null,
        {
          fieldName: getDynamicLabel(this.doubleUnitFlag),
          fieldCode: "uomName",
          render: (_, record) => record.uomCodeAndName || "-"
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("spcm.common.model.common.quantity").$D("数量"),
          fieldCode: "secondaryQuantity",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getDynamicLabel(this.doubleUnitFlag, "quantity"),
          fieldCode: "quantity",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("spcm.common.model.common.unitPriceBatch").$D("价格批量"),
          fieldCode: "unitPriceBatch",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("small.common.model.smallOrderQuantity").$D("最小起订量"),
          fieldCode: "attribute5",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("small.common.model.priceType").$D("价格类型"),
          fieldCode: "attribute1Meaning",
        },
        {
          fieldName: this.$T("spcm.common.currencyCode").$D("原币币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseCurrencyCode").$D("本币币种"),
          fieldCode: "purchaseCurrencyCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.exchangeRate").$D("汇率:(本币/原币)"),
          fieldCode: "exchangeRate",
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("spcm.common.model.common.purchasePriceTax").$D("进价(含税)"),
          fieldCode: "taxIncludedSecondaryUnitPrice",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getDynamicLabel(this.doubleUnitFlag, "purchasePriceTax"),
          fieldCode: "taxIncludedUnitPrice",
          // fieldType: "INPUT_NUMBER",
          editor: false,
          // render: (val) => {
          //   // eslint-disable-next-line new-cap
          //   return this.$options.filters["CalcMoney"](val);
          // }
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxIncludedPrice").$D("本币含税单价"),
          fieldCode: "purchaseTaxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // render: (val) => {
          //   // eslint-disable-next-line new-cap
          //   return this.$options.filters["CalcMoney"](val);
          // }
        },
        this.doubleUnitFlag ? {
          fieldName: this.$T("spcm.common.model.common.purchasePriceNoTax").$D("进价(不含税)"),
          fieldCode: "secondaryUnitPrice",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        } : null,
        {
          fieldName: getDynamicLabel(this.doubleUnitFlag, "purchasePriceNoTax"),
          fieldCode: "unitPrice",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("spcm.common.model.common.PlatformForTax").$D("平台售价(含税)"),
          fieldCode: "attribute4",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("spcm.common.model.common.PlatformForNoTax").$D("平台售价(不含税)"),
          fieldCode: "attribute7",
          // fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("spcm.common.model.common.commissionRatio").$D("佣金比例"),
          fieldCode: "attribute10",
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxIncludedLineAmount").$D("原币含税行金额"),
          fieldCode: "taxIncludedLineAmount",
          // fieldType: "INPUT_NUMBER",
          editor: false,
          // precision: (val,record) => {
          //   return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode,"financialPrecision"));
          // },
          // render: (val) => {
          //   // eslint-disable-next-line new-cap
          //   return this.$options.filters["CalcMoney"](val);
          // }
        },
        {
          fieldName: this.$T("spcm.common.model.common.purchaseTaxLineAmount").$D("本币含税行金额"),
          fieldCode: "purchaseTaxLineAmount",
          // fieldType: "INPUT_NUMBER",
          editor: false,
          // precision: (val,record) => {
          //   return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode,"financialPrecision"));
          // },
          // render: (val) => {
          //   // eslint-disable-next-line new-cap
          //   return this.$options.filters["CalcMoney"](val);
          // }
        },
        {
          fieldName: this.$T("spcm.common.model.uncludedTaxLineAmount").$D("原币不含税行金额"),
          fieldCode: "lineAmount",
          // fieldType: "INPUT_NUMBER",
          editor: false,
          // precision: (val,record) => {
          //   return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode,"financialPrecision"));
          // },
        },
        {
          fieldName: this.$T("spcm.common.model.common.taxAmount").$D("原币税额"),
          fieldCode: "taxAmount",
          // fieldType: "INPUT_NUMBER",
          editor: false,
          // precision: (val,record) => {
          //   return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode,"financialPrecision"));
          // },
        },
        {
          fieldName: this.$T("spcm.common.model.common.needByDate").$D("交付日期"),
          fieldCode: "deliverDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val)
        },
        {
          fieldName: this.$T("spcm.common.model.common.export.itemPropertiesMeaning").$D("属性"),
          fieldCode: "itemPropertiesMeaning",
        },
        {
          fieldName: this.$T("hipspfm.workFlowAgrement.model.workFlowAgrement.remark").$D("备注"),
          fieldCode: "remark",
        }
      ].filter(Boolean);
      return columns;
    },
    getPartnerDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("entity.company.name").$D("公司名称"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("entity.company.companyCode").$D("公司编码"),
          fieldCode: "companyNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeName").$D("伙伴类型名称"),
          fieldCode: "partnerTypeName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.partnerTypeCode").$D("伙伴类型编码"),
          fieldCode: "partnerTypeCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.legalRepName").$D("代表人"),
          fieldCode: "legalRepName",
        },
        {
          fieldName: this.$T("spcm.common.model.contractname").$D("联系人"),
          fieldCode: "contacts",
        },
        {
          fieldName: this.$T("spcm.common.model.common.telNum").$D("联系方式"),
          fieldCode: "telNum",
          render:(val, record) => (record.internationalTelCode && val ? `${record.internationalTelCode} | ` : "") + val
        },
        {
          fieldName: this.$T("spcm.common.model.common.faxes").$D("传真"),
          fieldCode: "faxes",
        },
        {
          fieldName: this.$T("spcm.common.model.common.address").$D("地址"),
          fieldCode: "address",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankName").$D("开户行名称"),
          fieldCode: "bankName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
        },
        {
          fieldName: this.$T("spcm.common.model.common.remark").$D("说明"),
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("spcm.common.model.common.unifiedSocialCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCode",
        },
        {
          fieldName: this.$T("spcm.common.model.common.businessRegistrationNumber").$D("商业注册号/税号"),
          fieldCode: "businessRegistrationNumber",
        },
        {
          fieldName: this.$T("spcm.common.model.common.mail").$D("邮箱"),
          fieldCode: "mail",
        },
        {
          fieldName: this.$T("spcm.common.model.common.bankNumber").$D("联行行号"),
          fieldCode: "bankFirm",
        },
      ].filter(Boolean);
      return columns;
    },
    getFileColumns() {
      const { electricSignFlag, pcStatusCode, supplementFlag, archiveAttachmentUuid } = this.headInfo || {};
      const isShowOfflineMutual =
        !electricSignFlag &&
        (supplementFlag && pcStatusCode === "SUPPLEMENT_COMPLETE" ||
          !supplementFlag &&
            [ "ARCHIVE", "ARCHIVE_TO_APPROVAL", "REPLENISHING", "CONFIRMED" ].includes(pcStatusCode) ||
          [ "TO_BE_VALID", "EFFECTED_TO_APPROVAL" ].includes(pcStatusCode));
      const templateColumns = this.templateList.map((item, index) => {
        if (item.attachmentUrl) {
          return {
            fieldType: "EMPTY",
            fieldName: item.attachmentTypeName,
            fieldCode: `template-${item.attachmentTypeCode}`,
            formRow: 140 + index,
          };
        }
        return null;
      }).filter(Boolean);
      const columns = [
        {
          fieldType: "EMPTY",
          fieldName: this.$T("spcm.common.view.btn.purchaserAttachment").$D("采购方附件"),
          fieldCode: "purchaserAttachmentUuid",
          formRow: 20,
          enterFlag: true,
        },
        pcStatusCode === "ARCHIVE" || archiveAttachmentUuid && {
          fieldType: "EMPTY",
          fieldName: this.$T("spcm.common.attachmentUuid").$D("归档文件"),
          fieldCode: "archiveAttachmentUuid",
          formRow: 30,
        },
        {
          fieldType: "EMPTY",
          fieldName: this.$T("spcm.common.view.message.comContractAttachment").$D("协议附件"),
          fieldCode: "attachmentUuid",
          formRow: 35,
        },
        {
          fieldType: "EMPTY",
          fieldName: this.$T("sqam.inquiryHall.model.inquiryHall.supplierUuid").$D("供应商附件"),
          fieldCode: "supplierAttachmentUuid",
          formRow: 100,
        },
        this.electronicAttachmentFlag && {
          fieldType: "EMPTY",
          fieldName: this.$T("spcm.common.attachment.toBeSigned").$D("待签署附件"),
          fieldCode: "pcHeaderElectronicSignatureAttachment",
          formRow: 110,
        },
        this.electronicAttachmentFlag && {
          fieldType: "EMPTY",
          fieldName: this.$T("spcm.common.attachment.Signed").$D("已签署附件"),
          fieldCode: "pcHeaderElectronicSignatureAttachmentIsSigned",
          formRow: 120,
        },
        isShowOfflineMutual && {
          fieldType: "EMPTY",
          fieldName: this.$T("spcm.common.model.offlineMutualSignUuid").$D("线下双方签章文件"),
          fieldCode: "offlineMutualSignUuid",
          formRow: 130,
        },
        ...templateColumns,
      ].filter(Boolean);
      return columns.map((col) => {
        const title = col.enterFlag ?
          this.$T("spcm.common.view.enterAttachment").$D("内部附件") :
          this.$T("spcm.common.view.outerAttachment").$D("外部附件");
        return {
          ...col,
          render: (val, _, field) =>
            <SrmAttachmentButton
              group={true}
              showTotal={true}
              title={`${title}-${field.fieldName}`}
              attachments={[
                {
                  attachmentUuid: val,
                  readonly: true,
                  showInfo: true,
                  uploadButton: "none",
                },
              ]}
            />
          ,
        };
      });
    },
  },
  async created() {
    this.doubleUnitFlag = await queryEnableDoubleUnit();
  },
  async mounted() {
    if (this.pcHeaderId) {
      try {
        this.$loading.show();
        await this.getAgreementDetail();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
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
    // 获取 自定义配置
    getCodeDefine(key) {
      switch (key) {
      case "headerInfo":
        return "SMBL.CONTRACT.DETAIL_HEADER";
      case "headerInfoDetail":
        return "SMBL.CONTRACT.DETAIL_HEADER_INFO";
      case "subjectInfo":
        return "SMBL.CONTRACT.DETAIL_SUBJECT";
      case "subjectInfoDetail":
        return "SMBL.CONTRACT.DETAIL_SUBJECT_INFO";
      case "stageInfo":
        return "SMBL.CONTRACT.DETAIL_STAGE";
      case "partnerInfo":
        return "SMBL.CONTRACT.DETAIL_PARTNER";
      case "partnerInfoDetail":
        return "SMBL.CONTRACT.DETAIL_PARTNER_INFO";
      case "termInfo":
        return "SMBL.CONTRACT.DETAIL_BUSINESSTERMS";
      case "tableExtendInfo":
        return "SMBL.CONTRACT.DETAIL_TABLEEXTEND";
      case "attachmentInfo":
        return "SMBL.CONTRACT.ATTACHMENT_INFO";
      default:
        return "";
      }
    },
    // 获取弹框字段
    getDetailColumns(key) {
      switch (key) {
      case "headerInfoDetail":
        return this.getAgreementDetailInfoColumns;
      case "partnerInfoDetail":
        return this.getPartnerDetailInfoColumns;
      case "subjectInfoDetail":
        return this.getSubjectDetailInfoColumns;
      default:
        return [];
      }
    },
    // 弹框
    openPopup(name, item) {
      this.popupData["data"] = item;
      this.popupData["columns"] = name;
      this.popupData["code"] = name;
      this.visible = true;
    },
    clickHeaderInfo(record) {
      this.openPopup("headerInfoDetail", record.data);
    },
    // 显示用章文本附件
    async showContractAttachment(fileName, fileAdress) {
      SrmUtil.previewFile({
        fileName: fileName,
        fileUrl: fileAdress,
        bucketName: SrmUtil.getDefaultBucketName()
      });
    },
    // 显示表的信息详情
    showLineInfoDetail(record) {
      this.lineInfoDetail = record?.data;
      this.show = true;
      this.openPopup("subjectInfoDetail", record.data);
    },
    // 显示伙伴信息详情
    showPartnerInfo(record) {
      this.partnerInfo = record?.data;
      this.partnerInfoFlag = true;
      this.openPopup("partnerInfoDetail", record?.data);
    },
    // 获取协议审批详情信息
    async getAgreementDetail() {
      await fetchPcAttachmentList(this.pcHeaderId).then((res) => {
        if (res?.length && !res.failed) {
          this.templateList = res;
        }
      });
      await getAgreementDetailApi(this.pcHeaderId, { isNewCust: this?.parameters?.isNewCust }).then((res) => {
        if (res?.failed) {
          return false;
        }
        this.headInfo = res || {};
        this.templateList.forEach((item) => {
          const { attachmentTypeCode, attachmentUuid } = item;
          const fieldName = `template-${attachmentTypeCode}`;
          this.headInfo[fieldName] = attachmentUuid;
        });
        this.headerFormDs.create(this.headInfo, 0);
        if (typeof this.headInfo.attribute1Meaning === "object") {
          this.moreAttribute1Meaning = Object.values(
            this.headInfo.attribute1Meaning
          ).join("/");
        }
        // 判断是否有电子签章附件
        // 1、附件签章：signatureType === 'ANNEX_SIGNATURE' && electricSignFlag === 1 && authType === 'ESIGN'
        // 2、附件文本签章：(signatureType === 'TEXT_AND_ANNEX_SIGNATURE' && electricSignFlag === 1 && authType === 'ESIGN')
        // 3、后端配置 附件参数：electronicSignatureAttachmentDisplayFlag === 'Y' （是否附件签章）
        if (this.headInfo.signatureType === "ANNEX_SIGNATURE" && this.headInfo.electricSignFlag === 1 && allSignList.includes(this.headInfo.authType) ||
        this.headInfo.signatureType === "TEXT_AND_ANNEX_SIGNATURE" && this.headInfo.electricSignFlag === 1 && allSignList.includes(this.headInfo.authType) ||
        this.headInfo.electronicSignatureAttachmentDisplayFlag === "Y") {
          this.electronicAttachmentFlag = true;
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
>>> .open-tag::before {
  display: none;
}
>>> .srm-list-item-card-head-left {
  max-width: 80% !important;
}
.srm-header-text {
  font-weight: normal;
}

.attachment {
  >>> .customize-item {
    margin 0px;
  }
  >>> .srm-attachment-group {
    width 100%;
  }
  >>> .srm-attachment-group .srm-attachment-group-item {
    border-top: none;
  }
}
</style>
