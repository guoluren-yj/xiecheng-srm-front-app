<template>
  <div v-if="refreshFlag" style="height: 100vh">
    <!-- 剩余时间 -->
    <div>
      <section v-if="mLeftTime.days" class="time-info">
        {{
          $T(
            "hipspfm.supplierQuotation.model.supplierQuotation.remainingTime"
          ).$D("剩余时间")
        }}：{{ mLeftTime.days
        }}{{ $T("hipspfm.common.message.days").$D("天") }}:{{
          mLeftTime.hours
        }}:{{ mLeftTime.minutes }}:{{ mLeftTime.seconds }}
      </section>
      <section v-else class="time-info" />
    </div>
    <!-- 头信息 -->
    <srm-detail-head :columns="getDetailHeadColumns" :data-source="headInfo">
      <div class="button-right-margin">
        <srm-button size="small" icon="icon-paperclip" @click="showFilePop">
          <!-- <img src="@/assets/4.0/icon_Button_paperclip_highlight@3x.png"> -->
          <span>{{
            $T("ssrc.inquiryHall.button.inquiryHall.file").$D("详情附件")
          }}</span>
        </srm-button>
      </div>
    </srm-detail-head>
    <!-- 内容区域 -->
    <srm-scroll-tab content-scroll :margin-bottom="55">
      <srm-scroll-tab-item
        :label="
          $T('hipspfm.supplierQuotation.view.title.rfxHeadInfo').$D(
            '询价单头信息'
          )
        ">
        <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
          <span>{{
            $T("hipspfm.supplierQuotation.view.title.noRfxHeadInfo").$D(
              "暂无询价单头信息"
            )
          }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          code="SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_DN_HEADER"
          :data-source="headInfo"
          :columns="getInquirySheetHeadInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="haspreQualification"
        :label="
          $T('ssrc.supplierQuotation.view.message.panel.preQualification').$D(
            '资格预审'
          )
        ">
        <div v-if="JSON.stringify(prequalInfo) === '{}'" class="noContent">
          <span>{{
            $T(
              "hipspfm.supplierQuotation.model.supplierQuotation.NoPreQualification"
            ).$D("暂无资格预审")
          }}</span>
        </div>
        <div v-else @click="goToPrequal">
          <customize
            :need-padding="true"
            code="SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_DN_PREQUA"
            :data-source="prequalInfo"
            :columns="getPreQuaInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T(
            'hipspfm.supplierQuotation.model.supplierQuotation.rfxLineInfo'
          ).$D('询价单行信息')
        ">
        <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
          <span>{{
            $T(
              "hipspfm.supplierQuotation.model.supplierQuotation.NoRfxLineInfo"
            ).$D("暂无询价单行信息")
          }}</span>
        </div>
        <template v-else>
          <!-- 报价行信息 -->
          <template v-if="IsQuotation">
            <srm-list
              :data-set="quotationDataSet"
              :scrollable="false"
              :show-bottom-bar="false"
              :columns="getLineInfoColumns"
              @itemClick="goToQuotationDetail"/>
          </template>
          <!-- 竞价行信息 -->
          <template v-else>
            <srm-list
              :data-set="bidDataSet"
              :scrollable="false"
              :show-bottom-bar="false"
              :columns="getLineInfoColumns"/>
          </template>
        </template>
        <!-- 适配iPhoneX -->
        <div class="bottom-space-view" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('ssrc.inquiryHall.model.inquiryHall.attchment').$D('附件')">
        <customize
          :need-padding="true"
          :data-source="headInfo"
          :columns="getAttachmentsColumns"
          code="SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_ATTACHMENT"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup
      :visible.sync="lineDetailPopup"
      height="100%"
      position="right"
      :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')">
      <supplier-bidding-material-info
        v-if="lineDetailPopup"
        :index="currentLineItemIndex"
        :head-info="headInfo"
        :line-info="lineInfo"
        :operation-meaning="operationMeaning"
        :is-un-tax-price-flag="isUnTaxPriceFlag"
        @refresh="refresh"
        @onUnitPrice="onUnitPrice"
        @refreshData="refreshData"/>
    </srm-popup>
    <!-- 头信息商务附件 -->
    <attached-file
      v-model="filePopups"
      :attachment-uuid="rfxBusinessAttachmentUuid"/>
    <!-- 头信息技术附件 -->
    <attached-file
      v-model="filePopupT"
      :attachment-uuid="rfxTechAttachmentUuid"/>
    <!-- 资格预审附件 -->
    <attached-file
      v-model="preFilePopup"
      :attachment-uuid="prequalAttachmentUuid"/>
    <srm-bottom-handler :btn-arr="getBtnArr" />
    <srm-popup
      :visible="applicationScopePop"
      :title="$T('ssrc.inquiryHall.view.title.applicationScope').$D('适用范围')"
      width="60%"
      :show-header="true"
      :show-close="true"
      position="bottom"
      :on-close="() => (applicationScopePop = false)">
      <srm-list
        class="applicationScopePopStyle"
        :data-set="applicationScopePopDataSet"
        :columns="getApplicationScopePopColumns"
        :scrollable="false"
        :auto-hide-search-bar="true"/>
    </srm-popup>
  </div>
</template>

<script>
import uuid from "uuid";
import SupplierBiddingMaterialInfo from "@/modules/SupplierQuotation/views/SupplierBiddingMaterialInfo";
import { DataSet, SrmMath, SrmUtil, SrmTooltip } from "srm-mobile-ui";
import lineInfoIndexDs from "../../SupplierQuotation/datasource/lineInfoIndexDs";
import tableDS from "../../SupplierQuotation/datasource/applicationScopeDataSet";
import { leftTime, judgeIsNumExist } from "@/utils/index";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getSetting,
  getPreQualInfo,
  submitQuotation,
  getOrderHeadInfo,
  getOrderLineInfo,
  fetchApplicationScoreUnitList,
  saveFileUUIDApi,
} from "../../SupplierQuotation/api/index";

export default {
  modules: [
    "ssrc.supplierQuotation",
    "hipspfm.supplierQuotation",
    "hipspfm.common",
    "message.validation",
    "ssrc.supplierBidEnquiry",
    "smbl.common",
    "ssrc.inquiryHall",
    "hzero.common",
  ],
  name: "SupplierBiddingDetail",
  components: {
    AttachedFile,
    SupplierBiddingMaterialInfo,
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      lineInfoFlag: false,
      prequalInfo: {},
      fileList: [],
      asnHeaderId: "",
      quotationHeaderId: "",
      rfxTechAttachmentUuid: "", //供应商技术附件
      rfxBusinessAttachmentUuid: "", //供应商商务附件
      prequalAttachmentUuid: "", //资格预审文件
      validAttachmentUuid: "", //资格预审申请文件
      operationPopup: false,
      filePopup: false,
      refreshFlag: true,
      filePopups: false,
      filePopupT: false,
      preFilePopup: false,
      organizationName: "",
      purchaseAgentName: "",
      rfxStatus: "",
      operationMeaning: "",
      dataList: [],
      filterList: [],
      mLeftTime: {},
      timer: null,
      paymentTermValue: "",
      paymentTypeValue: "",
      isUnTaxPriceFlag: false,
      quotationDataSet: {},
      bidDataSet: {},
      currentLineItemIndex: -1,
      lineDetailPopup: false,
      headFileArr: [
        {
          title: this.$T("ssrc.supplierQuotation.model.supQuo.busiAttach").$D(
            "商务附件"
          ),
          attachmentUuid: "",
          readOnly: false,
        },
        {
          title: this.$T("ssrc.supplierQuotation.model.supQuo.techAttach").$D(
            "技术附件"
          ),
          attachmentUuid: "",
          readOnly: false,
        },
      ],
      //一下两个字段控制currentQuotationPrice，netPrice两字段inputChang监听方法互相作用导致死循环
      currentQuotationPriceTgr: false,
      netPriceTgrFlag: false,
      applicationScopePop: false,
      applicationScopePopDataSet: {},
      roundFlag: 0,
      noImage: require("@/assets/NoPicture.png"),
      viewedImageList: [],
    };
  },
  computed: {
    // 按钮
    getBtnArr() {
      return [
        {
          type: "primary",
          title: this.$T("hipspfm.common.button.submit").$D("提交"),
          // eslint-disable-next-line no-return-assign
          handler: this.handleSubmit,
        },
      ];
    },
    haspreQualification() {
      return (
        this.headInfo.preQualificationFlag ||
        Boolean(this.prequalLineStatusMeaning)
      );
    },
    IsQuotation() {
      return this.operationMeaning === "QUOTATION";
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxTitle",
        },
      ];

      return columns;
    },
    getInquirySheetHeadInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "quotationTotalAmount",
          fieldType: "EMPTY",
          render: (val, record) => {
            const finPrecision = Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "financialPrecision"
              )
            );
            return <SrmListHeader showOpenTag={false}>
              <SrmTooltip title={SrmUtil.getNumberLocalized(val, finPrecision)} placement="top" class="supplier-tooltip">
                <span>
                  {this.$T(
                    "ssrc.supplierQuotation.model.supQuo.quotationTotalAmount"
                  ).$D("报价总金额")}
                  : {SrmUtil.getNumberLocalized(val)}
                </span>
              </SrmTooltip>
              <div slot="right">
                <span style={{ color: "var(--color-font-default-e)" }}>
                  {this.$T("ssrc.supplierQuotation.model.supQuo.round").$D(
                    "轮次"
                  )}
                  ：{record.quotationRoundNumber}
                </span>
              </div>
            </SrmListHeader>;
          },
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuot.companyName"
          ).$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T(
            "hipspfm.supplierQuotation.model.supplierQuotation.templateName"
          ).$D("寻源模版"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.curryCode"
          ).$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.exchangeRate"
          ).$D("汇率"),
          fieldCode: "exchangeRate",
          render: (val) => Number(val).toFixed(4),
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.quotationLineNumber"
          ).$D("报价行数"),
          fieldCode: "quotationLineNumber",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.bidDirect"
          ).$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.sourcingType"
          ).$D("寻源类型"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.priceCategory"
          ).$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierBidEnquiry.model.supplierBidEnquiry.paymentTerm"
          ).$D("付款条款"),
          fieldCode: "paymentTermId",
          fieldType: this.headInfo.paymentTermFlag ? "LOV" : "Text",
          displayField: "paymentTermName",
          lovCode: "SMDM.PAYMENT.TERM",
          options: {
            displayField: "termName", // 主键
            subDisplayField: "termCode",
          },
          required: Boolean(this.headInfo.paymentTermFlag),
          rightFlag: Boolean(this.headInfo.paymentTermFlag),
          editor: Boolean(this.headInfo.paymentTermFlag),
          render: (val) => val || "",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierBidEnquiry.model.supplierBidEnquiry.paymentType"
          ).$D("付款方式"),
          fieldCode: "paymentTypeId",
          fieldType: this.headInfo.paymentTermFlag ? "LOV" : "Text",
          lovCode: "SMDM.PAYMENTTYPE",
          displayField: "paymentTypeName",
          options: {
            displayField: "typeName", // 主键
            subDisplayField: "typeCode",
          },
          editor: Boolean(this.headInfo.paymentTermFlag),
          required: Boolean(this.headInfo.paymentTermFlag),
          rightFlag: Boolean(this.headInfo.paymentTermFlag),
          render: (val) => val || "",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.busiAttach"
          ).$D("商务附件"),
          fieldCode: "businessAttachment",
          render: () =>
            <span style="color: #276EF1"> {this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")} </span>,
          callBack: () => {
            this.showFilePop("filePopups");
          },
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.techAttach"
          ).$D("技术附件"),
          fieldCode: "technicalAttachment",
          render: () =>
            <span style="color: #276EF1"> {this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")} </span>,
          callBack: () => {
            this.showFilePop("filePopupT");
          },
        },
        {
          fieldCode: "applicationScopeFlag",
          fieldName: this.$T("ssrc.inquiryHall.view.title.applicationScope").$D(
            "适用范围"
          ),
          render: () =>
            <span style="color: #276EF1">{this.$T(
              "ssrc.inquiryHall.view.message.button.view"
            ).$D("查看")}</span>,
          callBack: (val) => {
            this.showApplicationScopePop(val);
          },
        },
      ];
      return columns;
    },
    getPreQuaInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "prequalEndDate",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span>
                {this.$T(
                  "ssrc.supplierQuotation.model.supQuo.prequalEndDate"
                ).$D("预审截止时间")}
                :{val}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.prequalFileExpense"
          ).$D("预审文件费"),
          fieldCode: "prequalFileExpense",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.enableScoreFlag"
          ).$D("启用评分细项"),
          fieldCode: "paymentFlag",
          render: (val) =>
            Number(val) ?
              this.$T("hipspfm.common.status.yes").$D("是") :
              this.$T("hipspfm.common.status.no").$D("否"),
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.prequalificationDocuments"
          ).$D("资格预审文件"),
          fieldCode: "prequalificationFile",
          render: () =>
            `<span style="color:#276EF1">${this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")}</span>`,
          callBack: () => {
            this.showFilePop("preFilePopup");
          },
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.prequalRemark"
          ).$D("资格预审备注"),
          fieldCode: "prequalRemark",
        },
        {
          fieldCode: "prequalLineStatusMeaning",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader showOpenTag={false}>
              <span>
                {this.$T(
                  "ssrc.supplierQuotation.model.supQuo.pretrialApplication"
                ).$D("预审申请")}
                ：
                {val ===
                  this.$T("hipspfm.common.status.submitted").$D("已提交") &&
                  <span class="orange">{val}</span>
                }
                {val ===
                  this.$T("hipspfm.common.status.unSubmitted").$D("未提交") &&
                  <span class="red">{val}</span>
                }
                {val ===
                  this.$T("hipspfm.common.status.passed").$D("已通过") &&
                  <span class="green">{val}</span>
                }
              </span>
            </SrmListHeader>
          ,
        },
      ];
      return columns;
    },
    // 询价单行信息
    getLineInfoColumns() {
      const columns = [
        {
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span
                onClick={() => {
                  const toDetailFlag =
                    !this.IsQuotation &&
                    Boolean(
                      record.quotationLineStatus === "BARGAINED" ||
                        record.bargainFlag === 1 &&
                          record.continuousQuotationFlag === 1 &&
                          record.quotationLineStatus === "SUBMITTED"
                    );
                  toDetailFlag ? this.goToBiddingDetail(record) : ""; //当竞价时，跳转竞价价行详情
                }}
              >
                <span>
                  {record.rfxLineItemNum}:
                </span>
                <span>
                  {record.itemCode && val ? record.itemCode + "-" + val : record.itemCode || val}
                </span>
              </span>
              <div slot="right">
                <span>
                  {record.quotationLineStatusMeaning}
                </span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          formRow: 2,
          fieldCode: "attributeVarchar3",
          fieldType: "EMPTY",
          render: (val) => <img onClick={(e) => {
            e.stopPropagation();
            if (!val) {
              return;
            }
            e.stopPropagation();
            this.previewImage(val);
          }} src={val || this.noImage} width="100" height="100" />,
        },
        {
          formRow: 2,
          fieldCode: "customize",
          fieldType: "EMPTY",
          render: (val, item) => <Customize
            class="override-Customize"
            columns={this.getDetailRightColumns}
            data-source={item}
            type="list"
            need-padding={false}
            code="SMBL.SUPPLIER_QUOTATION.TAB_SCROLL_LINE"/>,
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.quotationDescription"
          ).$D("报价说明"),
          fieldCode: "currentQuotationRemark",
          fieldType: "INPUT",
          disabled: (val, record) => Boolean(record.abandonedFlag),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D(
            "未税单价"
          ),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          visible: this.headInfo.priceTypeCode === "NET_PRICE",
          editor: (val, record) => {
            const flag =
              record.abandonedFlag ||
              record.continuousQuotationFlag === 0 &&
                record.currentQuotationPrice &&
                record.quotationLineStatus === "SUBMITTED" ||
              record.bargainFlag === 0 &&
                record.bargainStatus === "BARGAINING_ONLINE" ||
              record.quotationLineStatus === "SUBMITTED" &&
                record.bargainFlag !== 1 &&
                record.continuousQuotationFlag !== 1 || // 启用连续报价，且进行议价的行可编辑
              this.headInfo.priceTypeCode === "TAX_INCLUDED_PRICE";
            return !flag;
          },
          editLimit: (val, record) => {
            const flag =
              record.abandonedFlag ||
              record.continuousQuotationFlag === 0 &&
                record.currentQuotationPrice &&
                record.quotationLineStatus === "SUBMITTED" ||
              record.bargainFlag === 0 &&
                record.bargainStatus === "BARGAINING_ONLINE" ||
              record.quotationLineStatus === "SUBMITTED" &&
                record.bargainFlag !== 1 &&
                record.continuousQuotationFlag !== 1 || // 启用连续报价，且进行议价的行可编辑
              this.headInfo.priceTypeCode === "TAX_INCLUDED_PRICE";
            return !flag;
          },
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "defaultPrecision"
              )
            ),
          required: 1,
          inputChange: (val, record) => {
            this.inputNetPriceFocus(record);
          },
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxPrice").$D(
            "含税单价"
          ),
          fieldCode: "currentQuotationPrice",
          fieldType: "INPUT_NUMBER",
          visible: this.headInfo.priceTypeCode !== "NET_PRICE",
          editor: (val, record) => {
            const flag =
              record.abandonedFlag ||
              record.continuousQuotationFlag === 0 &&
                record.currentQuotationPrice &&
                record.quotationLineStatus === "SUBMITTED" ||
              record.quotationLineStatus === "SUBMITTED" &&
                record.bargainFlag !== 1 &&
                record.continuousQuotationFlag !== 1 || // 启用连续报价，且进行议价的行可编辑
              record.bargainFlag === 0 &&
                record.bargainStatus === "BARGAINING_ONLINE" ||
              this.headInfo.priceTypeCode === "NET_PRICE";
            return !flag;
          },
          editLimit: (val, record) => {
            const flag =
              record.abandonedFlag ||
              record.continuousQuotationFlag === 0 &&
                record.currentQuotationPrice &&
                record.quotationLineStatus === "SUBMITTED" ||
              record.bargainFlag === 0 &&
                record.bargainStatus === "BARGAINING_ONLINE" ||
              record.quotationLineStatus === "SUBMITTED" &&
                record.bargainFlag !== 1 &&
                record.continuousQuotationFlag !== 1 || // 启用连续报价，且进行议价的行可编辑
              this.headInfo.priceTypeCode === "NET_PRICE";
            return !flag;
          },
          precision: (val, record) =>
            Number(
              this.$options.filters.calcCurrencyPrecision(
                record.currencyCode,
                "defaultPrecision"
              )
            ),
          required: 1,
          inputChange: (val, record) => {
            this.inputQuotationPriceFocus(record);
          },
        },
        {
          fieldCode: "applicationScopeFlag",
          fieldName: this.$T("ssrc.inquiryHall.view.title.applicationScope").$D(
            "适用范围"
          ),
          render: () =>
            <span style="color: #276EF1">{this.$T(
              "ssrc.inquiryHall.view.message.button.view"
            ).$D("查看")}</span>,
          callBack: (val) => {
            this.showApplicationScopePop(val, "quotation");
          },
        },
      ];
      return columns;
    },
    getDetailRightColumns() {
      const rightColumns = [
        // {
        //   fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemCode").$D(
        //     "物料编码"
        //   ),
        //   fieldCode: "itemCode",
        // },
        // {
        //   fieldName: this.$T(
        //     "ssrc.supplierQuotation.model.supQuo.quotationStatus"
        //   ).$D("报价状态"),
        //   fieldCode: "quotationLineStatusMeaning",
        // },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.rfxQuantity"
          ).$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D(
            "单位"
          ),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.demandDate"
          ).$D("需求日期"),
          fieldCode: "demandDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters["CalcDate"](val),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D(
            "税率（%）"
          ),
          fieldCode: "taxRate",
          // eslint-disable-next-line arrow-body-style
          render: (val, record) => {
            // console.log("税率=>", val, record);
            return record.taxRate;
          },
        },
      ];
      return rightColumns.filter(Boolean);
    },
    getApplicationScopePopColumns() {
      const columns = [
        {
          fieldCode: "expertName",
          fieldType: "EMPTY",
          render: (val, record) =>
            <div>
              <span>{record.dataCode}-</span>
              <span>{record.dataName}</span>
            </div>
          ,
        },
      ];
      return columns;
    },
    getAttachmentsColumns() {
      const columns = [
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.busiAttach"
          ).$D("商务附件"),
          fieldCode: "businessAttachmentUuid",
          render: () => {
            let businessAttachmentUuid;
            if (this.headInfo.businessAttachmentUuid) {
              businessAttachmentUuid = this.headInfo.businessAttachmentUuid;
            } else {
              businessAttachmentUuid = uuid();
              this.headInfo.businessAttachmentUuid = businessAttachmentUuid;
            }
            let viewOnly = Boolean(
              Number(this.headInfo.bargainFlag) === 1 ||
                Number(this.roundFlag) === 1
            );
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={businessAttachmentUuid}
                canUpload={!viewOnly}
                canDelete={!viewOnly}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  viewOnly ?
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    ) :
                    this.$T("hipspfm.common.button.uploadAttachment").$D(
                      "上传附件"
                    )
                }
                onShowFilePopup={
                  viewOnly ? false : () => this.onShowFilePopup()
                }
              />
            );
          },
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.techAttach"
          ).$D("技术附件"),
          fieldCode: "techAttachmentUuid",
          render: () => {
            let techAttachmentUuid;
            if (this.headInfo.techAttachmentUuid) {
              techAttachmentUuid = this.headInfo.techAttachmentUuid;
            } else {
              techAttachmentUuid = uuid();
              this.headInfo.techAttachmentUuid = techAttachmentUuid;
            }
            let viewOnly = Boolean(
              Number(this.headInfo.bargainFlag) === 1 ||
                Number(this.roundFlag) === 1
            );
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={techAttachmentUuid}
                canUpload={!viewOnly}
                canDelete={!viewOnly}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  viewOnly ?
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    ) :
                    this.$T("hipspfm.common.button.uploadAttachment").$D(
                      "上传附件"
                    )
                }
                onShowFilePopup={
                  viewOnly ? false : () => this.onShowFilePopup()
                }
              />
            );
          },
        },
        (Number(this.headInfo.bargainFlag) === 1 ||
          this.headInfo.bargainBusinessAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.barginBusiAttach"
          ).$D("议价商务附件"),
          fieldCode: "bargainBusinessAttachmentUuid",
          render: () => {
            let bargainBusinessAttachmentUuid;
            if (this.headInfo.bargainBusinessAttachmentUuid) {
              bargainBusinessAttachmentUuid =
                this.headInfo.bargainBusinessAttachmentUuid;
            } else {
              bargainBusinessAttachmentUuid = uuid();
              this.headInfo.bargainBusinessAttachmentUuid =
                bargainBusinessAttachmentUuid;
            }
            let viewOnly = Boolean(Number(this.headInfo.bargainFlag) === 0);
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={bargainBusinessAttachmentUuid}
                canUpload={!viewOnly}
                canDelete={!viewOnly}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  viewOnly ?
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    ) :
                    this.$T("hipspfm.common.button.uploadAttachment").$D(
                      "上传附件"
                    )
                }
                onShowFilePopup={
                  viewOnly ? false : () => this.onShowFilePopup()
                }
              />
            );
          },
        },
        (Number(this.headInfo.bargainFlag) === 1 ||
          this.headInfo.bargainTechAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.barginTechAttach"
          ).$D("议价技术附件"),
          fieldCode: "bargainTechAttachmentUuid",
          render: () => {
            let bargainTechAttachmentUuid;
            if (this.headInfo.bargainTechAttachmentUuid) {
              bargainTechAttachmentUuid =
                this.headInfo.bargainTechAttachmentUuid;
            } else {
              bargainTechAttachmentUuid = uuid();
              this.headInfo.bargainTechAttachmentUuid =
                bargainTechAttachmentUuid;
            }
            let viewOnly = Boolean(Number(this.headInfo.bargainFlag) === 0);
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={bargainTechAttachmentUuid}
                canUpload={!viewOnly}
                canDelete={!viewOnly}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  viewOnly ?
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    ) :
                    this.$T("hipspfm.common.button.uploadAttachment").$D(
                      "上传附件"
                    )
                }
                onShowFilePopup={
                  viewOnly ? false : () => this.onShowFilePopup()
                }
              />
            );
          },
        },
        (Number(this.roundFlag) === 1 ||
          this.headInfo.roundBusinessAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.roundBusiAttach"
          ).$D("多轮商务附件"),
          fieldCode: "roundBusinessAttachmentUuid",
          render: () => {
            let roundBusinessAttachmentUuid;
            if (this.headInfo.roundBusinessAttachmentUuid) {
              roundBusinessAttachmentUuid =
                this.headInfo.roundBusinessAttachmentUuid;
            } else {
              roundBusinessAttachmentUuid = uuid();
              this.headInfo.roundBusinessAttachmentUuid =
                roundBusinessAttachmentUuid;
            }
            let viewOnly = Boolean(Number(this.roundFlag) !== 0);
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={roundBusinessAttachmentUuid}
                canUpload={Boolean(viewOnly)}
                canDelete={Boolean(viewOnly)}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  viewOnly ?
                    this.$T("hipspfm.common.button.uploadAttachment").$D(
                      "上传附件"
                    ) :
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    )
                }
                onShowFilePopup={
                  viewOnly ? () => this.onShowFilePopup() : false
                }
              />
            );
          },
        },
        (Number(this.roundFlag) === 1 ||
          this.headInfo.roundTechAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.roundTechAttach"
          ).$D("多轮技术附件"),
          fieldCode: "roundTechAttachmentUuid",
          render: () => {
            let roundTechAttachmentUuid;
            if (this.headInfo.roundTechAttachmentUuid) {
              roundTechAttachmentUuid = this.headInfo.roundTechAttachmentUuid;
            } else {
              roundTechAttachmentUuid = uuid();
              this.headInfo.roundTechAttachmentUuid = roundTechAttachmentUuid;
            }
            let viewOnly = Boolean(Number(this.roundFlag) !== 0);
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={roundTechAttachmentUuid}
                canUpload={Boolean(viewOnly)}
                canDelete={Boolean(viewOnly)}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  viewOnly ?
                    this.$T("hipspfm.common.button.uploadAttachment").$D(
                      "上传附件"
                    ) :
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    )
                }
                onShowFilePopup={
                  viewOnly ? () => this.onShowFilePopup() : false
                }
              />
            );
          },
        },
      ].filter(Boolean);
      return columns;
    },
  },
  mounted() {
    // console.log(23333);
    this.initData();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  deactivated() {
    clearInterval(this.timer);
  },
  methods: {
    // 预览图片
    previewImage(picture = null) {
      const img = [];
      // this.viewedImageList.map((res) => {
      //   const { attributeVarchar3 = null, } = res || {};
      //   // if (attributeVarchar3) {
      //   img.push(attributeVarchar3);
      //   // }
      // });
      if (!picture) {
        return;
      }

      img.push(picture);
      this.$previewImage(img, { showClose: true });
    },
    // 跳转预审详情
    goToPrequal() {
      this.$router.push({
        name: "PrequalificationApprove",
        query: {
          rfxHeaderId: this.asnHeaderId,
          operationMeaning: this.operationMeaning,
          prequalLineStatusMeaning: this.prequalLineStatusMeaning,
          supplierCompanyId: this.supplierCompanyId,
        },
      });
    },
    async initData() {
      const {
        rfxNum,
        rfxTitle,
        rfxStatus,
        rfxHeaderId,
        operationMeaning,
        quotationHeaderId,
        supplierCompanyId,
        prequalLineStatusMeaning,
        roundFlag,
      } = this.$route.query;
      this.rfxStatus = rfxStatus;
      this.organizationName = rfxNum;
      this.asnHeaderId = rfxHeaderId;
      this.purchaseAgentName = rfxTitle;
      this.operationMeaning = operationMeaning;
      this.quotationHeaderId = quotationHeaderId;
      this.supplierCompanyId = supplierCompanyId;
      this.quotationDataSet = new DataSet(
        lineInfoIndexDs(this.quotationHeaderId, false)
      );
      this.bidDataSet = new DataSet(
        lineInfoIndexDs(this.quotationHeaderId, true)
      );
      this.prequalLineStatusMeaning = prequalLineStatusMeaning;
      this.roundFlag = roundFlag;
      await this.getOrderHeader();
      await this.getOrderLine();
      await this.getPreQual();
      await this.getSetting();
    },
    showFilePop(type = "filePopup") {
      this[type] = !this[type];
      // this.$showFileList({
      //   title: this.$T("hipspfm.common.button.viewAttachments").$D("查看附件"),
      //   fileArr: this.headFileArr,
      // });
    },
    onShowFilePopup() {
      const params = {
        objectVersionNumber: this.headInfo.objectVersionNumber,
        quotationHeaderId: this.headInfo.quotationHeaderId,
        businessAttachmentUuid: this.headInfo.businessAttachmentUuid,
        techAttachmentUuid: this.headInfo.techAttachmentUuid,
        bargainTechAttachmentUuid: this.headInfo.bargainTechAttachmentUuid,
        bargainBusinessAttachmentUuid:
          this.headInfo.bargainBusinessAttachmentUuid,
        roundTechAttachmentUuid: this.headInfo.roundTechAttachmentUuid,
        roundBusinessAttachmentUuid: this.headInfo.roundBusinessAttachmentUuid,
      };
      saveFileUUIDApi(params).then(() => {
        this.getOrderHeader();
      });
    },
    // 跳转报价行详情
    goToQuotationDetail(item) {
      this.currentLineItemIndex = item.index;
      this.lineInfo = this.quotationDataSet.data;
      this.lineDetailPopup = !this.lineDetailPopup;
    },
    // 跳转竞价价行详情
    // eslint-disable-next-line no-unused-vars
    goToBiddingDetail(record) {
      // console.log("record:", record, record.rfxLineItemNum);
      // this.currentLineItemIndex = record.rfxLineItemNum - 1;
      this.currentLineItemIndex = this.bidDataSet.current.index;
      this.lineInfo = this.bidDataSet.data;
      this.lineDetailPopup = !this.lineDetailPopup;
    },
    // 获取头信息
    async getOrderHeader() {
      const params = {
        customizeUnitCode: "SSRC.SUPPLIER_QUOTATION.BASE_FORM",
      };
      try {
        const headInfo = await getOrderHeadInfo(
          this.quotationHeaderId,
          "quotation",
          params
        );
        this.headInfo = headInfo;
        this.headFileArr[0].attachmentUuid = this.rfxTechAttachmentUuid =
          headInfo.rfxTechAttachmentUuid || uuid();
        this.headFileArr[1].attachmentUuid = this.rfxBusinessAttachmentUuid =
          headInfo.rfxBusinessAttachmentUuid || uuid();
        // console.log(this.headFileArr, "arr");
      } catch (err) {
        // console.log(err);
      }
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      const params = {
        page: 0,
        size: 100,
        customizeUnitCode:
          "SSRC.SUPPLIER_QUOTATION.LINE,SSRC.SUPPLIER_QUOTATION.LINE_FORM",
      };
      await getOrderLineInfo(this.quotationHeaderId, params).then((res) => {
        this.$loading.hide();
        this.lineInfoFlag = true;
        if (!res.failed) {
          this.lineInfo = res.content || [];
          this.viewedImageList = res.content || [];
          this.getLeftTime();
        }
      });
    },
    //含税单价值监听
    inputQuotationPriceFocus(record) {
      if (this.netPriceTgrFlag) {
        return;
      }
      const defaultPrecision = Number(
        this.$options.filters.calcCurrencyPrecision(
          record.currencyCode,
          "defaultPrecision"
        )
      );
      const finPrecision = Number(
        this.$options.filters.calcCurrencyPrecision(
          record.currencyCode,
          "financialPrecision"
        )
      );
      //标记当前字段currentQuotationPrice在编辑，
      const { currentQuotationPrice } = record || {};
      this.currentQuotationPriceTgr = true;
      //判断含税标识
      if (record.taxIncludedFlag) {
        //税率
        const taxRate = record.taxRate;
        if (judgeIsNumExist(record.currentQuotationPrice) && judgeIsNumExist(taxRate)) {
          const netPrice = SrmMath.toFixed(SrmMath.div(
            record.currentQuotationPrice, SrmMath.plus(1, SrmMath.div(taxRate, 100))
          ), defaultPrecision);
          record.netPrice = netPrice;
        }
        if (judgeIsNumExist(record.currentQuotationPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(
            record.currentQuotationPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额
          record.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(record.netPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(
            record.netPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额未税
          record.netAmount = netAmount;
        }
      } else {
        let netPrice = currentQuotationPrice;
        if (netPrice !== 0) {
          netPrice = netPrice.toFixed(defaultPrecision);
        }
        if (judgeIsNumExist(record.currentQuotationPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(
            record.currentQuotationPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额
          record.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(netPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(
            netPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额未税
          record.netAmount = netAmount;
        }
        record.netPrice = currentQuotationPrice;
      }
    },
    //未税单价值监听
    inputNetPriceFocus(record) {
      if (this.currentQuotationPriceTgr) {
        return;
      }
      //标记当前字段netPrice在编辑，
      this.netPriceTgrFlag = true;
      const defaultPrecision = Number(
        this.$options.filters.calcCurrencyPrecision(
          record.currencyCode,
          "defaultPrecision"
        )
      );
      const finPrecision = Number(
        this.$options.filters.calcCurrencyPrecision(
          record.currencyCode,
          "financialPrecision"
        )
      );
      //判断含税标识
      if (record.taxIncludedFlag) {
        //税率
        const taxRate = record.taxRate;
        if (judgeIsNumExist(record.netPrice) && judgeIsNumExist(taxRate)) {
          const currentQuotationPrice = SrmMath.toFixed(SrmMath.times(
            record.netPrice, SrmMath.plus(1, SrmMath.div(taxRate, 100))
          ), defaultPrecision);
          record.currentQuotationPrice = currentQuotationPrice;
        }
        if (judgeIsNumExist(record.currentQuotationPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(
            record.currentQuotationPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额
          record.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(record.netPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(
            record.netPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额未税
          record.netAmount = netAmount;
        }
      } else {
        const { netPrice = null, } = record || {};
        let currentQuotationPrice = netPrice;
        // if (currentQuotationPrice !== 0) {
        //   currentQuotationPrice = currentQuotationPrice.toFixed(defaultPrecision);
        // }
        if (judgeIsNumExist(currentQuotationPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const totalAmount = SrmMath.toFixed(SrmMath.times(
            currentQuotationPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额
          record.totalAmount = totalAmount;
        }
        if (judgeIsNumExist(record.netPrice) && judgeIsNumExist(record.currentQuotationQuantity)) {
          const netAmount = SrmMath.toFixed(SrmMath.times(
            record.netPrice, record.currentQuotationQuantity
          ), finPrecision); // 行金额未税
          record.netAmount = netAmount;
        }
        record.currentQuotationPrice = netPrice;
      }
    },
    //获取预审信息
    async getPreQual() {
      this.$loading.show();
      const params = {
        prequalCategory: "RFX",
      };
      await getPreQualInfo(this.asnHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res) {
          this.prequalInfo = res;
          this.validAttachmentUuid = res.validAttachmentUuid || "abc";
          this.prequalAttachmentUuid = res.prequalAttachmentUuid || "abc";
        }
      });
    },
    //获取配置信息
    async getSetting() {
      await getSetting().then((res) => {
        this.isUnTaxPriceFlag =
          res["011108"] && res["011108"].settingValue === "UNTAXED_PRICE";
      });
    },
    refresh(val) {
      if (val) {
        this.refreshFlag = false;
        setTimeout(() => {
          this.refreshFlag = true;
        }, 0);
      }
    },
    // 数据
    handleDataList(data) {
      this.dataList = data.map((item) => item);
    },
    //获取倒计时
    getLeftTime() {
      // eslint-disable-next-line consistent-this
      const self = this;
      if (!this.lineInfo.length) {
        return false;
      }
      const rfxHeaderQuotationEndDate =
        this.lineInfo[0].rfxHeaderQuotationEndDate;
      const date = rfxHeaderQuotationEndDate ?
        rfxHeaderQuotationEndDate.replace(/\s/, "T") :
        "";
      if (new Date(date).getTime() - Date.now() <= 0 || !date) {
        this.mLeftTime = {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
      } else {
        this.timer = setInterval(() => {
          self.mLeftTime = leftTime(new Date(date));
        }, 1000);
      }
    },
    handlePaymentValue(data) {
      this[data.type] = data.value;
      if (data.type === "paymentTermValue") {
        this.headInfo.paymentTermName = this.paymentTermValue.termName;
        this.headInfo.paymentTermId = this.paymentTermValue.termId;
      } else {
        this.headInfo.paymentTypeName = this.paymentTypeValue.typeName;
        this.headInfo.paymentTypeId = this.paymentTypeValue.typeId;
      }
    },
    refreshData() {
      this.getOrderHeader();
      this.getOrderLine();
      if (this.IsQuotation) {
        this.quotationDataSet.refresh();
      } else {
        this.bidDataSet.refresh();
      }
    },
    // 提交
    async handleSubmit() {
      // console.info(this.bidDataSet.selected, this.dataList, "####");
      let submitData = [];
      if (this.IsQuotation) {
        submitData = this.quotationDataSet.data;
      } else {
        this.bidDataSet.selected &&
          this.bidDataSet.selected.forEach((item) => {
            submitData.push(item.data);
          });
      }
      // let submitData =
      //   this.operationMeaning === "QUOTATION" ? this.lineInfo : this.dataList;
      const body = {
        allSubmitFlag: 1,
        quotationHeaderId: this.quotationHeaderId,
        rfxQuotationLines: submitData,
        rfxQuotationHeader: this.headInfo,
        selectedRowKeys: submitData.map((item) => item.quotationLineId),
      };
      //校验是否选中行
      if (!submitData.length) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.noSelectSubmitLine"
          ).$D("未选中需要提交的行"),
          description: "",
          class: "notification",
        });
        return false;
      }
      if (!this.quotationDataSet.validate()) {
        return;
      }
      // 校验可供数量
      const countFlag = submitData.filter(
        (item) =>
          item.quantityChangeFlag &&
          // eslint-disable-next-line no-undefined
          (item.currentQuotationQuantity === undefined ||
            item.currentQuotationQuantity === null) &&
          !item.abandonedFlag
      );
      if (countFlag.length) {
        let msgArr = countFlag.map((item) => item.rfxLineItemNum).toString();
        this.$notification.open({
          message:
            this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
            msgArr +
            this.$T("message.validation.quantityIsQequired").$D(
              "行可供数量为必填项"
            ),
          description: "",
          class: "notification",
        });
        return false;
      }
      // 校验税率
      const taxRateFlagArr = submitData.filter(
        (item) =>
          item.taxChangeFlag &&
          item.taxIncludedFlag &&
          // eslint-disable-next-line no-undefined
          (item.taxRate === undefined || item.taxRate === null) &&
          !item.abandonedFlag
      );
      if (taxRateFlagArr.length) {
        let msgArr = taxRateFlagArr
          .map((item) => item.rfxLineItemNum)
          .toString();
        this.$notification.open({
          message:
            this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
            msgArr +
            this.$T(
              "hipspfm.supplierQuotation.view.message.lineTaxIsRequired"
            ).$D("行税率为必填项"),
          description: "",
          class: "notification",
        });
        return false;
      }
      // 校验报价有效期
      const dateFlagArr = submitData.filter(
        (item) => item.validDateInputType === "REQUIRED" && !item.abandonedFlag
      );
      if (dateFlagArr.length) {
        let msgArr = [],
          accessFlag = true;
        dateFlagArr.forEach((item) => {
          if (!item.currentExpiryDateFrom || !item.currentExpiryDateTo) {
            accessFlag = false;
            msgArr.push(item.rfxLineItemNum);
          }
        });
        if (!accessFlag) {
          this.$notification.open({
            message:
              this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
              msgArr.toString() +
              this.$T(
                "hipspfm.supplierQuotation.view.message.lineHaveNoTrueTime"
              ).$D("行未填写报价有效期"),
          });
          return false;
        }
      }
      //校验付款条款
      if (!this.headInfo.paymentTermName && this.headInfo.paymentTermFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.payTerm.none").$D(
            "付款条款不能为空"
          ),
        });
        return false;
      }
      //校验付款方式
      if (!this.headInfo.paymentTypeName && this.headInfo.paymentTermFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.payMethod.none").$D(
            "付款方式不能为空"
          ),
        });
        return false;
      }
      // 提交数据
      this.$loading.show();
      const res = await submitQuotation(body);
      this.$loading.hide();
      if (!res.failed) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.submitSuccessed"
          ).$D("提交成功"),
        });
        // this.getOrderHeader();
        // this.getOrderLine();
        this.$router.back();
      } else if (
        res.code === "error.current.quotation.price.not.found.for_new_bid"
      ) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.noLadderQuotationUnitPrice"
          ).$D("阶梯报价单价未填写"),
        });
      } else if (res.code === "ssrc.quotation.quotation_detail_weak_control") {
        // eslint-disable-next-line rulesdir/no_hips
        this.$dialog({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          content: res.message,
          okText: this.$T("hipspfm.common.button.ok").$D("确定"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable: false,
          onOk: () => {
            this.handleSubmitAgain();
          },
          // onCancel() {
          //   // eslint-disable-next-line rulesdir/no_hips
          //   this.$hips.dialog.close();
          // },
        });
      } else {
        this.$notification.open({
          message: res.message,
        });
        this.getOrderHeader();
        this.getOrderLine();
      }
    },
    // 再次提交
    async handleSubmitAgain() {
      let submitData = [];
      if (this.IsQuotation) {
        submitData = this.lineInfo;
      } else {
        this.bidDataSet.selected &&
          this.bidDataSet.selected.forEach((item) => {
            submitData.push(item.data);
          });
      }
      // let submitData =
      //   this.operationMeaning === "QUOTATION" ? this.lineInfo : this.dataList;
      const body = {
        allSubmitFlag: 1,
        weakCtrlConfirmFlag: 1,
        quotationHeaderId: this.quotationHeaderId,
        rfxQuotationLines: submitData,
        rfxQuotationHeader: this.headInfo,
        selectedRowKeys: submitData.map((item) => item.quotationLineId),
      };
      //校验是否选中行
      if (!submitData.length) {
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.noSelectSubmitLine"
          ).$D("未选中需要提交的行"),
        });
        return false;
      }
      // 校验价格
      const priceFlag = submitData.filter(
        (item) =>
          // eslint-disable-next-line no-undefined
          (item.currentQuotationPrice === undefined ||
            item.currentQuotationPrice === null) &&
          !item.abandonedFlag
      );
      if (priceFlag.length) {
        let msgArr = priceFlag.map((item) => item.rfxLineItemNum).toString();
        this.$notification.open({
          message:
            this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
            msgArr +
            this.$T("message.validation.priceFlagIsQequired").$D(
              "行单价为必填项"
            ),
        });
        return false;
      }
      // 校验可供数量
      const countFlag = submitData.filter(
        (item) =>
          item.quantityChangeFlag &&
          // eslint-disable-next-line no-undefined
          (item.currentQuotationQuantity === undefined ||
            item.currentQuotationQuantity === null) &&
          !item.abandonedFlag
      );
      if (countFlag.length) {
        let msgArr = countFlag.map((item) => item.rfxLineItemNum).toString();
        this.$notification.open({
          message:
            this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
            msgArr +
            this.$T("message.validation.quantityIsQequired").$D(
              "行可供数量为必填项"
            ),
        });
        return false;
      }
      // 校验税率
      const taxRateFlagArr = submitData.filter(
        (item) =>
          item.taxChangeFlag &&
          item.taxIncludedFlag &&
          // eslint-disable-next-line no-undefined
          (item.taxRate === undefined || item.taxRate === null) &&
          !item.abandonedFlag
      );
      if (taxRateFlagArr.length) {
        let msgArr = taxRateFlagArr
          .map((item) => item.rfxLineItemNum)
          .toString();
        this.$notification.open({
          message:
            this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
            msgArr +
            this.$T(
              "hipspfm.supplierQuotation.view.message.lineTaxIsRequired"
            ).$D("行税率为必填项"),
        });
        return false;
      }
      // 校验报价有效期
      const dateFlagArr = submitData.filter(
        (item) => item.validDateInputType === "REQUIRED" && !item.abandonedFlag
      );
      if (dateFlagArr.length) {
        let msgArr = [],
          accessFlag = true;
        dateFlagArr.forEach((item) => {
          if (!item.currentExpiryDateFrom || !item.currentExpiryDateTo) {
            accessFlag = false;
            msgArr.push(item.rfxLineItemNum);
          }
        });
        if (!accessFlag) {
          this.$notification.open({
            message:
              this.$T("hipspfm.supplierQuotation.view.message.the").$D("第") +
              msgArr.toString() +
              this.$T(
                "hipspfm.supplierQuotation.view.message.lineHaveNoTrueTime"
              ).$D("行未填写报价有效期"),
          });
          return false;
        }
      }
      //校验付款条款
      if (!this.headInfo.paymentTermName && this.headInfo.paymentTermFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.payTerm.none").$D(
            "付款条款不能为空"
          ),
        });
        return false;
      }
      //校验付款方式
      if (!this.headInfo.paymentTypeName && this.headInfo.paymentTermFlag) {
        this.$notification.open({
          message: this.$T("ssrc.supplierQuotation.message.payMethod.none").$D(
            "付款方式不能为空"
          ),
        });
        return false;
      }
      // 提交数据
      this.$loading.show();
      const res = await submitQuotation(body);
      this.$loading.hide();
      // console.log(res.code, "code");
      if (!res.failed) {
        // eslint-disable-next-line rulesdir/no_hips
        // this.$hips.dialog.close();
        this.$notification.open({
          message: this.$T(
            "hipspfm.supplierQuotation.view.message.submitSuccessed"
          ).$D("提交成功"),
        });
        // this.getOrderHeader();
        // this.getOrderLine();
        this.$router.back();
      } else if (res.code === "ssrc.quotation.quotation_detail_weak_control") {
        // eslint-disable-next-line rulesdir/no_hips
        this.$dialog({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          content: res.message,
          okText: this.$T("hipspfm.common.button.ok").$D("确定"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable: false,
          onOk: () => {
            this.handleSubmitAgain();
          },
          // onCancel() {
          //   // eslint-disable-next-line rulesdir/no_hips
          //   this.$hips.dialog.close();
          // },
        });
      } else {
        // eslint-disable-next-line rulesdir/no_hips
        // this.$hips.dialog.close();
        this.$notification.open({
          message: res.message,
        });
        this.getOrderHeader();
        this.getOrderLine();
      }
    },
    onUnitPrice(price, index) {
      this.quotationDataSet.data[index] = price;
    },
    showApplicationScopePop(val, type = "") {
      const queryParams = {
        sourceHeaderId: this.asnHeaderId,
        sourceFrom: "RFX",
        applicationScopeFlag: 1,
      };
      if (type === "quotation") {
        queryParams.sourceLineItemId = val.rfxLineItemId;
      }
      fetchApplicationScoreUnitList(queryParams).then((res) => {
        if (!res) {
          return;
        }
        const firstLine = res[0] || {};
        this.queryTableLine(firstLine);
        this.applicationScopePop = true;
      });
    },
    // 查询表格行数据
    queryTableLine(data = {}, params = {}) {
      const {
        sourceCode = null,
        sourceCodeType = "",
        sourceAppScopeId = null,
        sourceCodeUniqueKey,
      } = data;
      const commonProps = {
        sourceCode,
        sourceCodeType,
        sourceAppScopeId,
        sourceCodeUniqueKey,
        ...params,
      };
      this.applicationScopePopDataSet = new DataSet(tableDS(sourceAppScopeId));
      this.applicationScopePopDataSet.setQueryParameter(commonProps);
      this.applicationScopePopDataSet.query();
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-tool-button-wrap {
  bottom: unset;
}

.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.time-info {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: var(--color-bg-default-e);
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-other-default);
  text-align: center;
}

.headInfo {
  padding: 16px 20px;
  border-bottom: 8px solid var(--color-border-default);

  li {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-font-default);
    line-height: 24px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.handler-bottom {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  background: var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.1);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    border-right: 1px solid var(--color-border-default);
  }
}

.bottom-space-view {
  height: 0px;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

.override-Customize {
  width: 70vw;
  margin-left: 6px;
}

.applicationScopePopStyle {
  >>> .srm-list-search-line {
    height: 0px;
    padding: 0px;
  }

  >>> .srm-list-item-card {
    border-bottom: 1px solid var(--background-color-empty-second);
  }
}

>>> .supplier-tooltip.srm-tooltip-container {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
