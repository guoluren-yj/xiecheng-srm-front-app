<template>
  <div :style="{ height: pageType === 'PARTICIPATE' ? '90vh' : '100vh' }">
    <!-- 头信息 -->
    <!--    <srm-detail-head :columns="getHeaderColumns" :data-source="headInfo" /> -->
    <!-- 内容区域 -->
    <srm-scroll-tab content-scroll>
      <srm-scroll-tab-item
        :label="
          $T('ssrc.common.view.message.basicInfos').$D(
            '基础信息'
          )">
        <div v-if="!headInfo.rfxHeaderId" class="noContent">
          <span>
            {{ $T("ssrc.common.view.title.noBasicInfos").$D("暂无基础信息") }}
          </span>
        </div>
        <srm-form
          v-else
          class="ssrc_page_header_form_common_class"
          :need-padding="true"
          :customize-code="getCustomizeUnitCode('base')"
          :data-set="headerFormDS"
          :columns="getBaseForm"/>
      </srm-scroll-tab-item>

      <srm-scroll-tab-item v-if="headInfo.preQualificationFlag" :label="$T('ssrc.common.prequalBasicInfo').$D('资格预审信息')">
        <!-- <div v-if="!headInfo.preQualificationFlag" class="noContent">
          <span>
            {{ $T("hipspfm.supplierQuotation.view.title.noPrequalBasicInfo").$D("暂无资格预审信息") }}
          </span>
        </div> -->
        <srm-form
          :need-padding="true"
          :customize-code="getCustomizeUnitCode('prequal')"
          :data-set="headerFormDS"
          :columns="getPrequalForm"/>
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.supplierQuotation.view.message.tab.itemDetails').$D('物品明细')">
        <!--        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent"> -->
        <!--          <span> -->
        <!--            {{ $T("hipspfm.supplierQuotation.view.title.noItemLineListData").$D("暂无物品明细") }} -->
        <!--          </span> -->
        <!--        </div> -->
        <srm-list :data-set="tableLineDataSet"
                  :columns="getLines"
                  :scrollable="false"
                  :customize-code="getCustomizeUnitCode('table')" />
      </srm-scroll-tab-item>

      <!-- <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')">
        <customize
          :need-padding="true"
          code="SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.DETAIL_ATTACHMENT_FORM"
          :data-source="headInfo"
          :columns="getAttachmentForm" />
      </srm-scroll-tab-item> -->
    </srm-scroll-tab>

    <srm-bottom-handler v-if="pageType === 'PARTICIPATE'" :btn-arr="getPageBottomBtnArr" type="action-sheet">
      <!-- <div slot="left" style="height: 48px;width: 48px;display: flex;justify-content: center;align-items: center;margin-right: 10px" /> -->
    </srm-bottom-handler>
  </div>
</template>

<script>

const storage = window.localStorage;
import { isEmpty, noop, isNil, isArray } from "lodash";
import { $T, DataSet, SrmUtil, } from "srm-mobile-ui";

import { fetchRfxHeader, queryEnableDoubleUnit, } from "../api";
import { itemLineDS, baseInfoDataSet } from "../datasource/itemLineDS";
import { abandonFormDS } from "../datasource/abandonFormDS";
// import { getQtyName, getUomName, } from "../components/doubleUnit";

import {
  participateNew,
  abandonNew,
} from "../api";

import { getBiddingApplyInfos, } from "../utils/commonString";

export default {
  modules: [ "ssrc.queryQuotation", "ssrc.common", "hipspfm.workFlow", "ssrc.biddingOpen", "ssrc.bidHall", "ssrc.inquiryHall", "smbl.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "hzero.common", "hipspfm.common", "ssrc.biddingHall", ],
  name: "QuotationDetail",
  props:{
    documentType: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      loading: false,
      rfxHeaderId: "",
      supplierCompanyId: null,
      headInfo:{},
      info: {},
      headerFormDS: new DataSet(baseInfoDataSet()),
      tableLineDataSet: new DataSet(itemLineDS({
        documentType: this.documentType,
      })),
      abandonFormDs: new DataSet(abandonFormDS()),
      bidFlag: this.documentType === "BID",
      doubleUnitFlag: false, // 双单位是否开启标志
      bucketName: SrmUtil.getDefaultBucketName(),
      validationModalVisible: false,
      querys: {},
      pageType: "", // 页面标识，参与/明细
      abandonModalRef: {},
    };
  },
  computed: {
    // getHeaderColumns() {
    //   return [
    //     {
    //       fieldCode: "rfxTitle",
    //       render: (val) => val
    //     },
    //     {
    //       fieldCode: "rfxByName",
    //       render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.prRequestedNam").$D("申请人") }：{ val }</span>
    //     },
    //     {
    //       fieldCode: "creationDate",
    //       render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.creationTime").$D("创建时间") }：{ val }</span>
    //     }
    //   ];
    // },
    getPageBottomBtnArr() {
      const { pageType } = this.$route.query;
      if (pageType !== "PARTICIPATE") {
        return [];
      }

      return [
        {
          title: this.$T("ssrc.supplierQuotation.view.message.giveUp").$D("放弃"),
          fill: false,
          bordered: true,
          type: "danger",
          handler: () => {
            this.abandon();
          },
        },
        {
          title: this.$T("ssrc.supplierQuotation.view.message.button.participate").$D("参与"),
          type: "primary",
          fill: true,
          bordered: true,
          handler: () => {
            this.participate();
          },
        },
      ];
    },
    getBaseForm() {
      const fields = [
        {
          formRow: 0,
          fieldCode: "rfxTitle",
          fieldType: "EMPTY",
          render: (_, record) => {
            const { secondarySourceCategoryMeaning, rfxTitle, quotationOrderTypeMeaning, } = record || {};
            return (
              <SrmListHeader>
                <div class="ssrc-header-title">
                  <srm-tooltip title={rfxTitle} placement="bottom">
                    <span class="ssrc-header-title-value">{rfxTitle}</span>
                  </srm-tooltip>
                </div>
                <div class="ssrc-header-source-category">
                  {secondarySourceCategoryMeaning}
                </div>
                <div class="ssrc-header-source-category">
                  {quotationOrderTypeMeaning}
                </div>
              </SrmListHeader>
            );
          },
        },
        {
          formRow: 100,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
          fieldCode: "companyName",
        },
        {
          formRow: 200,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件"),
          fieldCode: "companyNameUuid",
          render: (_, item) => {
            const {
              tenderFeeFlag,
              bidFileExpense,
            } = item || {};
            const bidFileFlag = tenderFeeFlag === 1 && !isNil(bidFileExpense);
            if (bidFileFlag) {
              return "-";
            }
            return (
              <SrmUpload
                isTab={false}
                showIcon={false}
                bucketName={this.bucketName}
                descTitle={this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看")}
                title={this.$T("ssrc.supplierQuotation.model.supQuo.companyNameAttachmentBusTec").$D("客户商务/技术附件")}
                queryParams={{
                  directory: "ssrc-rfx-rfxheader",
                }}
                fileArr={this.fileArrs(item)} />
            );
          },
        },
        {
          formRow: 300,
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldCode: "rfxRemark",
        },
        {
          formRow: 400,
          fieldName: this.bidFlag ? this.$T("ssrc.bidHall.model.bidHall.quotationStartDate").$D("投标开始时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          formRow: 500,
          fieldName: this.bidFlag ? this.$T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间") : this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          formRow: 600,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidBondYuan").$D("保证金(元"),
          fieldCode: "bidBond",
          render: (val) => this.renderPriceMayFree(val),
        },
        {
          formRow: 600,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidFileExpense").$D("招标文件费(元)"),
          fieldCode: "bidFileExpense",
          render: (val) => this.renderPriceMayFree(val),
        },
        {
          formRow: 700,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          formRow: 700,
          formCol: 2,
          fieldName: this.$T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
          fieldCode: "paymentTermName",
        },
        {
          formRow: 800,
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currency").$D("币种"),
          fieldCode: "currencyCode",
        },
      ];
      return fields;
    },
    getPrequalForm() {
      const Fields = [
        // {
        //   formRow: 10,
        //   formCol: 1,
        //   fieldCode: "sealedQuotationFlag",
        //   fieldType: "EMPTY",
        //   render: (val) =>
        //     <SrmListHeader>
        //       <span>
        //         {this.$T("ssrc.supplierQuotation.model.supQuo.sealedQuotation").$D("密封报价")}
        //         :
        //         {val ? this.$T("hipspfm.workFlow.view.message.yes").$D("是") : this.$T("hipspfm.workFlow.view.message.no").$D("否")}
        //       </span>
        //     </SrmListHeader>
        //   ,
        // },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applicationDeadline").$D("资格预审截止时间"),
          fieldCode: "prequalEndDate",
          formRow: 10,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.prequalAttachment").$D("资格预审文件"),
          fieldCode: "prequalAttachmentUuid",
          formRow: 20,
          formCol: 1,
          fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
        {
          fieldName: this.$T("ssrc.common.qualRequirements").$D("资质要求"),
          fieldCode: "prequalRemark",
          formRow: 30,
          formCol: 1,
        },
      ];

      return Fields;
    },
    // 报价行表格
    getLines() {
      const doubleUnitFlag = this.doubleUnitFlag;

      const columns = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => {
            const {
              rfxLineItemNum,
              specs,
              secondaryUomName,
              secondaryQuantity,
              uomName,
              rfxQuantity,
            } = item;
            let quantity = rfxQuantity;
            let uom = uomName;
            if (doubleUnitFlag) {
              quantity = secondaryQuantity;
              uom = secondaryUomName;
            }
            const quantityAndUomCombine = quantity && uom ? `${SrmUtil.getNumberLocalized(quantity)}${uom}` : quantity || uom;
            const lineBaseInfo = `${val ?? ""}${val && quantityAndUomCombine ? `-${quantityAndUomCombine}` : ""}`;
            return <div class="ssrc-table-line-customize-header-wrapper">
              <SrmListHeader>
                <div class="ssrc-table-line-customize-header-titles">
                  <srm-tooltip title={lineBaseInfo} placement="bottom">
                    <div class="ssrc-apply-line-item-first">
                      {lineBaseInfo}
                    </div>
                  </srm-tooltip>
                </div>
                <span slot="right">
                  <span class="ssrc-table-line-number-wrap">
                    {this.$T("ssrc.bidHall.model.bidHall.lineNo").$D("行号")}: {rfxLineItemNum}
                  </span>
                </span>
                {specs ? <div class="ssrc-table-line-header-specs-wrap">
                  <div>
                    {this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格")}
                  </div>
                  <srm-tooltip title={specs} placement="bottom">
                    <div class="ssrc-table-line-header-specs-cotent">
                      {specs}
                    </div>
                  </srm-tooltip>
                </div> : ""}
              </SrmListHeader>
            </div>;
          },
        },
        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.lineNo").$D("行号"),
        //   fieldCode: "rfxLineItemNum",
        //   formRow: 20,
        //   formCol: 1,
        // },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          formRow: 100,
          formCol: 1,
          render: (val) => {
            if (val) {
              return val.substring(0, 10);
            }
            return "";
          }
          // render: (val) => val && moment(val).format(DEFAULT_DATE_FORMAT),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "batchPrice",
          formRow: 200,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
          formRow: 300,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率"),
          fieldCode: "taxRate",
          formRow: 300,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationValidityFrom").$D("报价有效期从"),
          fieldCode: "validExpiryDateFrom",
          formRow: 400,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
          fieldCode: "validExpiryDateTo",
          formRow: 500,
          formCol: 1,
        },

        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.businessUnit").$D("业务实体"),
        //   fieldCode: "ouName",
        //   formRow: 50,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.inventoryOrg").$D("库存组织"),
        //   fieldCode: "invOrganizationName",
        //   formRow: 60,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
        //   fieldCode: "itemCode",
        //   formRow: 70,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料描述"),
        //   fieldCode: "itemName",
        //   formRow: 80,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细"),
        //   fieldCode: "quotationDetailFlag",
        //   formRow: 90,
        //   formCol: 2,
        //   render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
        // },
        // doubleUnitFlag ? {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxQuantity").$D("需求数量"),
        //   fieldCode: "secondaryQuantity",
        //   formRow: 92,
        //   formCol: 1,
        // } : null,
        // doubleUnitFlag ? {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
        //   fieldCode: "secondaryUomName",
        //   formRow: 92,
        //   formCol: 2,
        // } : null,
        // {
        //   fieldName: getQtyName(doubleUnitFlag),
        //   fieldCode: "rfxQuantity",
        //   formRow: 93,
        //   formCol: 1,
        // },
        // {
        //   fieldName: getUomName(doubleUnitFlag),
        //   fieldCode: "uomName",
        //   formRow: 93,
        //   formCol: 2,
        // },

        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationRange").$D("报价幅度"),
        //   align: "right",
        //   fieldCode: "quotationRange",
        //   formRow: 120,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
        //   fieldCode: "freightIncludedFlag",
        //   render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
        //   formRow: 130,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
        //   fieldCode: "ladderInquiryFlag",
        //   render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
        //   formRow: 150,
        //   formCol: 1,
        // },
        // {
        //   fieldName: this.$T(`ssrc.supplierQuotation.model.supQuo.ladderLevel`).$D('阶梯报价'),
        //   fieldCode: "ladderInquiry",
        //   // render: (_, record) =>
        //   //   record.ladderInquiryFlag === 1 ? (
        //   //       <a onClick={() => this.viewLadderLevelModal(record)}>
        //   //         {this.$T(`ssrc.supplierQuotation.view.message.button.ladderLevel`).$D('阶梯报价')}
        //   //       </a>
        //   //   ) : null,
        // },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachment").$D("采购方附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          formRow: 1000,
          formCol: 1,
          bucketName: this.bucketName,
          title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
      ];
      return columns.filter(Boolean);
    },
    // getAttachmentForm() {
    //   return [
    //     {
    //       fieldCode: "businessAttachmentUuid",
    //       fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
    //       fieldType: "UPLOAD",
    //       showCount: true,
    //       formRow: 1,
    //     },
    //     {
    //       fieldCode: "techAttachmentUuid",
    //       fieldName: $T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
    //       fieldType: "UPLOAD",
    //       showCount: true,
    //       formRow: 2,
    //     },
    //   ];
    // },
  },
  mounted() {
    const { rfxHeaderId, supplierCompanyId, pageType } = this.$route.query;
    this.bidFlag = this.documentType === "BID";

    if (rfxHeaderId) {
      storage.setItem("hallDetailRfxHeaderId", rfxHeaderId);
    }
    this.pageType = pageType;
    this.getHeadInfo({ rfxHeaderId, supplierCompanyId, });
    this.tableLineDataSet.addPathParameter("rfxHeaderId", rfxHeaderId);
    this.tableLineDataSet.addPathParameter("supplierCompanyId", supplierCompanyId);
    this.tableLineDataSet.addPathParameter("customizeUnitCode", this.getCustomizeUnitCode("table")); // SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.DETAIL_LINE
    this.tableLineDataSet.addPathParameter("pageType", pageType);
    this.tableLineDataSet.query();
    this.init();
  },
  deactivated() {
    clearTimeout(this.timer);
  },
  methods: {
    init() {
      this.queryDoubleUnit();
    },
    // 双单位
    queryDoubleUnit () {
      queryEnableDoubleUnit({
        businessModule: "RFX",
        tenantId: SrmUtil.getTenantId(),
      }).then((res) => {
        if (res === 1 || res === "1" || res === true) {
          this.doubleUnitFlag = true;
        }
      });
    },
    // 基本信息-商务/技术附件
    fileArrs(item) {
      const {
        rfxBusinessAttachmentUuid,
        rfxTechAttachmentUuid,
      } = item || {};

      return [
        {
          title: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          attachmentUuid: rfxBusinessAttachmentUuid,
          readOnly: true,
        },
        {
          title: $T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          attachmentUuid: rfxTechAttachmentUuid,
          readOnly: true,
        },
      ];
    },
    //获取询价单头信息
    async getHeadInfo(data = {}) {
      const params = {
        customizeUnitCode: this.getCustomizeUnitCode([ "base", "prequal" ]),
        ...data,
      };

      this.$loading.show();
      const res = await fetchRfxHeader(params);
      this.$loading.hide();
      if (res && !res.failed) {
        const header = res || {};
        this.headInfo = header;
        // this.baseInfoDS.setData([ header ]);
        this.headerFormDS.create(header, 0);
      }
    },
    renderPriceMayFree(value) {
      if (value === 0) {
        return $T("ssrc.common.view.gratis").$D("免费");
      }

      return value || "-";
    },
    getCurrentPageSubmitData() {
      const { supplierCompanyId, } = this.$route.query;
      const {
        tenantId,
        sourceMethod,
        rfxHeaderId,
      } = this.headInfo || {};

      if (!rfxHeaderId) {
        return;
      }

      const mainData = [ this.headInfo ];

      return {
        organizationId: SrmUtil.getOrganizationId(),
        tenantId,
        rfxHeaderId,
        supplierCompanyId,
        sourceMethod,
        query: {},
        customizeUnitCode: this.getCustomizeUnitCode([ "base", "prequal", "Table" ]),
        rfxQuotationParticipateDTOS: mainData,
        // ...paramData,
        sourceMobileEndFlag: 1,
      };
    },
    getAbandonFormFields() {
      return [
        {
          formRow: 10,
          fieldCode: "abandonRemark",
          render: (val) => {
            const record = this.abandonFormDs.current;
            return (
              <div style={{ width: "96vw", height: "26vh" }}>
                <div>
                  <SrmTextarea
                    value={val}
                    bordered={false}
                    editButton={false}
                    clearButton={false}
                    editor={true}
                    height={300}
                    placeholder={$T("ssrc.supplierQuotation.view.title.pleaseInputgiveUpReason").$D("请输入放弃理由")}
                    // autoSize={{ minRows: 2, maxRows: 8, }}
                    onInputChange={(value) => {
                      if (record) {
                        record.set("abandonRemark", value);
                      }
                    }}
                  />
                </div>
              </div>
            );
          }
          ,
        },
      ];
    },
    async abandon() {
      if (!this.headInfo?.rfxHeaderId) {
        return;
      }

      this.abandonFormDs.create({}, 0);

      this.abandonModalRef = await this.$popup({
        title: !this.bidFlag ? this.$T("ssrc.common.view.title.abandonQuotaiton").$D("放弃报价") : this.$T("ssrc.common.view.title.abandonBidding").$D("放弃投标"),
        headerAlign: "center",
        height: "60%",
        showHeader: true,
        showClose: true,
        rounded: true,
        onClose: () => {
          this.abandonFormDs.reset();
        },
        content:
          <div class="ssrc-apply-detail-validation-form ">
            <div class="ssrc-participate-validation-modal-content-wrap">
              <srm-form theme="fill" dataSet={this.abandonFormDs} columns={this.getAbandonFormFields()} />
            </div>
            <div class="ssrc-apply-button-list-wrap">
              <srm-button
                fill={false}
                style="border-radius: 24px; height: 48px; width: 40%; margin-right: 12px;"
                on-click={() => {
                  this.closeAbandonModal();
                }}
              >
                { this.$T("hzero.common.button.close").$D("关闭") }
              </srm-button>
              <srm-button fill style="border-radius: 24px; height: 48px; width: 40%;" on-click={this.handleAbandon}>
                { this.$T("hzero.common.button.confirm").$D("确认") }
              </srm-button>
            </div>
          </div>
        ,
      });
    },
    // 放弃
    async handleAbandon() {
      const validationFlag = await this.abandonFormDs.validate();

      if (!validationFlag) {
        this.$notification.open({
          duration: 1000,
          message: this.$T("ssrc.common.view.title.pleaseInputCorrectContent").$D("请输入正确内容"),
        });
        return false;
      }

      const pageData = this.getCurrentPageSubmitData();
      const formData = this.abandonFormDs.toData();
      const currentFormData = formData?.[0];

      if (!pageData || isEmpty(currentFormData)) {
        return false;
      }

      const data = {
        ...pageData,
        ...currentFormData,
      };

      this.closeAbandonModal();

      // 二次提交确认
      const confirmSubmit = async (newData = {}) => {
        let result = null;
        const submitInnerData = { passFlag: 1 }; // 通过passFlag确定是校验还是提交
        result = await this.handleParticipate({ ...data, ...submitInnerData, ...newData });

        if (result && result.failed) {
          return;
        }

        this.handleValidationResult({
          result,
          validationStageFlag: 0,
          afterSuccessSubmit: (res) => {
            this.successAbandon(res);
          },
        });
      };

      let result = await this.abandonParticipate(data);
      this.handleValidationResult({
        result,
        validationStageFlag: 1,
        confirmSubmit: (newSubmitData) => confirmSubmit(newSubmitData),
        afterSuccessSubmit: (res) => {
          this.successAbandon(res);
        },
      });
    },
    // 关闭放弃弹窗
    closeAbandonModal() {
      if (this.abandonModalRef) {
        this.abandonModalRef.closePopup();
      }
    },
    // 关闭验证弹窗
    closeValidationModal() {
      if (this.validationModalRef) {
        this.validationModalRef.closePopup();
      }
    },
    // 页面数据组合
    handleValidationResult(allData) {
      const {
        result = {},
        confirmSubmit = noop,
        afterSuccessSubmit = noop,
        // validationStageFlag = 0, // 校验阶段标识
      } = allData || {};
      const currentPageRfxHeaderId = this.headInfo?.rfxHeaderId;

      const resultErrorFlag = result && result.failed;
      if (resultErrorFlag || isEmpty(result) || !currentPageRfxHeaderId) {
        return;
      }

      const { validateResults = [], rfxQuotationHeaderCurDTOS = [], sourceMobileParticipateInfo } = result;
      // 点击参与 有 资格预审的情况，给出去pc端操作的提示，点击提示的确定按钮后，跳回“进行中”页签列表页
      if (sourceMobileParticipateInfo) {
        this.$dialog({
          content: sourceMobileParticipateInfo,
          type: "confirm",
          onOk: () => {
            this.delayDirectionToListPage("onGoing");
          },
        });
        return;
      }

      if (isEmpty(validateResults)) {
        const currentHeader = (rfxQuotationHeaderCurDTOS || []).find(
          (resultLine) => resultLine.rfxHeaderId === currentPageRfxHeaderId
        );
        afterSuccessSubmit(currentHeader);
        return;
      }

      if (!isEmpty(validateResults)) {
        const errors = [];
        const warnings = [];
        let allErrorList = null;

        let modalTitle = this.$T("ssrc.common.view.title.warningInfo").$D("以下验证未通过，确认发布吗？");

        validateResults.forEach((validateLine = {}) => {
          const { type } = validateLine;
          if (type === "ERROR") {
            // 校验失败
            errors.push(validateLine);
          }

          if (type === "WARNING") {
            warnings.push(validateLine);
          }
        });

        if (errors.length) {
          allErrorList = [ ...errors, ...warnings ];
          modalTitle = this.$T("ssrc.common.view.title.errorInfo").$D("提交失败，以下内容验证不通过");
        }

        if (warnings.length && !errors.length) {
          // validateDS.loadData(warningsMap.lists);
          allErrorList = warnings;
        }

        let newMessage = [];

        allErrorList.forEach((item, index) => {
          const { message } = item || {};

          if (message) {
            newMessage.push(
              <div>{index + 1}. {message}</div>
            );
          }
        });

        if (!newMessage.length) {
          return;
        }

        this.validationModalRef = this.$popup({
          title: modalTitle,
          headerAlign: "left",
          height: "60%",
          showHeader: true,
          showClose: true,
          rounded: true,
          content:
            <div class="ssrc-apply-detail-validation-form">
              <div class="ssrc-participate-validation-modal-content-wrap">
                { newMessage || modalTitle }
              </div>
              <div class="ssrc-apply-button-list-wrap">
                <srm-button fill={false} style="border-radius: 24px; height: 48px; width: 40%; margin-right: 12px;" on-click={this.closeValidationModal}>
                  { this.$T("hzero.common.button.close").$D("关闭") }
                </srm-button>
                {!errors.length && <srm-button fill style="border-radius: 24px; height: 48px; width: 40%;" click={() => {
                  this.timer = setTimeout(() => {
                    confirmSubmit();
                  }, 400);
                }}>
                  { this.$T("hzero.common.button.confirm").$D("确认") }
                </srm-button>}
              </div>
            </div>
          ,
        });
      }
    },
    async participate() {
      const data = this.getCurrentPageSubmitData();

      if (!data) {
        return;
      }

      // 二次提交确认
      const confirmSubmit = async (newData = {}) => {
        let result = null;
        const submitInnerData = { passFlag: 1 }; // 通过passFlag确定是校验还是提交
        result = await this.handleParticipate({ ...data, ...submitInnerData, ...newData });

        if (result && result.failed) {
          return;
        }

        this.handleValidationResult({
          result,
          validationStageFlag: 0,
          afterSuccessSubmit: (res) => {
            this.successParticipate(res);
          },
        });
      };

      let result = await this.handleParticipate(data);
      this.handleValidationResult({
        result,
        validationStageFlag: 1,
        confirmSubmit: (newSubmitData) => confirmSubmit(newSubmitData),
        afterSuccessSubmit: (res) => {
          this.successParticipate(res);
        },
      });
    },
    // 参与api
    async handleParticipate(data) {
      let result = null;
      try {
        this.$loading.show();
        result = await participateNew(data);
        this.$loading.hide();
        if (result && result.failed) {
          result = false;
          return result;
        }
      } finally {
        this.$loading.hide();
      }

      return result;
    },
    // 放弃api
    async abandonParticipate(data) {
      let result = null;
      try {
        this.$loading.show();
        result = await abandonNew(data);
        this.$loading.hide();
        if (result && result.failed) {
          result = false;
          return result;
        }
      } finally {
        this.$loading.hide();
      }

      return result;
    },
    delayDirectionToListPage(listPageDefaultTabName) {
      this.timer = setTimeout(() => {
        this.directionList(listPageDefaultTabName);
      }, 400);
    },
    // 跳转列表
    directionList(listPageDefaultTabName = null) {
      let nextPageName = "ListApply";
      if (this.bidFlag) {
        nextPageName = "ListBidding";
      }

      const listParams = {};
      if (listPageDefaultTabName) {
        listParams.tabName = listPageDefaultTabName; // 跳转到列表，默认进行中tab
      }

      this.$router.push({
        name: nextPageName,
        params: listParams, // 使用param是希望跳出去默认tab只生效一次
      });
    },
    directionListTabOnGoing() {
      this.directionList("onGoing");
    },
    //跳转报价
    directionQuotation(result) {
      const { quotationHeaderId = null } = result || {};
      if (!quotationHeaderId) {
        return;
      }

      let nextPageName = "QuotationApply";
      if (this.bidFlag) {
        nextPageName = "QuotationBidding";
      }

      this.$router.push({
        name: nextPageName,
        query: {
          quotationHeaderId,
        },
      });
    },
    delayDirectionToBiddingHall(data = {}) {
      this.timer = setTimeout(() => {
        this.directionToBiddingHall(data);
      }, 400);
    },
    directionToBiddingHall(data = {}) {
      const { rfxLineSupplierId, biddingTarget } = data || {};

      if (!rfxLineSupplierId || !biddingTarget) {
        return;
      }

      this.$router.push({
        name: "BiddingHallSupplier",
        query: {
          rfxLineSupplierId,
          biddingTarget,
        },
      });
    },
    // 放弃成功后
    successAbandon() {
      this.delayDirectionToListPage();
    },
    // 参与成功后
    successParticipate(result) {
      const { jumpQuoteFlag = 0, biddingFlag = 0, } = result || {};

      const jumpQuoteList = !jumpQuoteFlag || jumpQuoteFlag === "0";
      const newBiddingHallFlag = biddingFlag === 1 || biddingFlag === "1";

      if (newBiddingHallFlag) {
        // 竞价大厅逻辑
        if (jumpQuoteList) {
          this.directionListTabOnGoing();
          return;
        }

        this.biddingHallOperation(result);
        return;
      }

      if (!jumpQuoteFlag || jumpQuoteFlag === "0") {
        this.directionListTabOnGoing();
        return;
      }

      if (jumpQuoteFlag) {
        this.directionQuotation(result);
      }
    },
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.DETAIL_BASE_FORM_INFO" ], // 基础信息
        [ "prequal", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.DETAIL_PREQUAL_DETAIL" ], // 资格预审,
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY.DETAIL_LINE" ], // 行表格
      ]);

      const BidCodeMap = new Map([
        [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.DETAIL_BASE_FORM_INFO" ], // 基础信息
        [ "prequal", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.DETAIL_PREQUAL_DETAIL" ], // 资格预审
        [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.DETAIL_LINE" ], // 表格
      ]);

      const CodeDataMap = !this.bidFlag ? RfxCodeMap : BidCodeMap;
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
    async biddingHallOperation(result) {
      const message = getBiddingApplyInfos({ result });

      this.$dialog({
        title: this.$T("ssrc.biddingHall.view.modal.title.confirmEnterBiddingPlace").$D("确认进入竞价现场"),
        content: message,
        onOk: () => {
          this.delayDirectionToBiddingHall(result);
        },
        onCancel: () => {
          this.delayDirectionToListPage();
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

>>> .srm-list-item-card-head-left {
  max-width: 75% !important;
}

// aa
.ssrc_page_header_form_common_class {
  >>> .srm-list-item-card-head-left {
    max-width: 100% !important;
  }

  >>> .srm-list-item-card-head-right {
    max-width: 0% !important;
    min-width: 0% !important;
  }
}

.ssrc-header-title {
  display: inline-block;
  max-width: 78%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
}

.ssrc-header-title-value {
  max-width: 100%;
  display: inline-block
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ssrc-apply-detail-header-title {
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ssrc-apply-line-item-first {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ssrc-header-source-category {
  font-family: PingFangSC-Medium;
  background: #F0F2F5;
  border: 1px solid #F0F2F5;
  border-radius: 2px;
  font-size: 10px;
  transform: scale(0.86);
  transform-origin: 0 0;
  color: #333333;
  line-height: 16px;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  margin-left: 4px;
  padding: 0 4px;
}

.ssrc-table-line-customize-header-wrapper {
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px dashed #F0F2F5;
  position: relative;

  .ssrc-table-line-customize-header-titles {
    font-family: PingFangSC-Medium;
    font-weight: 600;
    max-width: 80vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ssrc-table-line-header-specs-wrap {
    background: var(--background-color-empty-second);
    border: 1px solid var(--background-color-empty-second);
    border-radius: 2px;
    font-size: 10px;
    transform: scale(0.86);
    transform-origin: 0 0;
    color: var(--font-color-default);
    line-height: 16px;
    font-weight: 500;
    max-width: 270px;
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    padding: 0 4px;
  }

  .ssrc-table-line-header-specs-cotent {
    display: inline-block;
    max-width: 240px;
    min-width: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 4px;
    vertical-align: middle;
  }

  .open-tag[data-v-498063c2]:before {
    top: 25% !important;
  }
}

.ssrc-table-line-number-wrap {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: var(--color-default);
  line-height: 20px;
  font-weight: 400;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ssrc-apply-detail-validation-form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
}

.ssrc-participate-validation-modal-content-wrap {
  height: 70%;
  overflow-y: auto;
  padding: 12px;
  padding-top: 0;
}

.ssrc-apply-button-list-wrap {
  display: flex;
  justify-content: center;
}

.ssrc-abandon-quotaiton-modal-content-field-label {
  font-size: 14px;
  color: #1B1E2B;
  line-height: 20px;
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
