<template>
  <div v-if="refreshFlag" style="height: 100vh; overflowY: auto; paddingBottom: 10px;">
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
    <srm-scroll-tab content-scroll>
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
          <div>
            <srm-list
              :data-set="quotationDataSet"
              :scrollable="false"
              :show-bottom-bar="false"
              :columns="getLineInfoColumns"
              @itemClick="goToQuotationDetail"/>
          </div>
        </template>
        <!-- 适配iPhoneX -->
        <div class="bottom-space-view" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('ssrc.inquiryHall.model.inquiryHall.attchment').$D('附件')">
        <customize
          :need-padding="true"
          :data-source="headInfo"
          :columns="getAttachmentsColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup
      :visible.sync="lineDetailPopup"
      height="100%"
      position="right"
      :title="$T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息')">
      <supplier-bidding-material-query-info
        v-if="lineDetailPopup"
        :index="currentLineItemIndex"
        :head-info="headInfo"
        :line-info="lineInfo"
        :operation-meaning="operationMeaning"
        :is-un-tax-price-flag="isUnTaxPriceFlag"
        :switch-url="switchUrl"
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
import SupplierBiddingMaterialQueryInfo from "@/modules/SupplierQuotation/views/SupplierBiddingMaterialQueryInfo";
import { DataSet } from "srm-mobile-ui";
import lineInfoIndexDs from "../datasource/lineInfoIndexQueryDs";
import tableDS from "../datasource/applicationScopeDataSet";
import AttachedFile from "@/components/File/AttachedFile";
import {
  getSetting,
  getPreQualInfo,
  getQueryHeadInfo,
  getOrderLineInfos,
  fetchApplicationScoreUnitList,
  getPurQueryHeadInfo,
  getPurOrderLineInfos,
} from "../api/index";

export default {
  modules: [ "ssrc.supplierQuotation", "hipspfm.supplierQuotation", "hipspfm.common", "message.validation", "ssrc.supplierBidEnquiry", "smbl.common", "ssrc.inquiryHall", "hzero.common", "ssrc.common" ],
  name: "SupplierQueryQuotationDetail",
  components: {
    AttachedFile,
    SupplierBiddingMaterialQueryInfo,
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
      filterList: [],
      timer: null,
      paymentTermValue: "",
      paymentTypeValue: "",
      isUnTaxPriceFlag: false,
      quotationDataSet: {},
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
      ReqStatusList: [], //状态
      ReqTypeList: [], //类型
    };
  },
  computed: {
    haspreQualification() {
      return (
        this.headInfo.preQualificationFlag ||
        Boolean(this.prequalLineStatusMeaning)
      );
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
          fieldCode: "paymentTermName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierBidEnquiry.model.supplierBidEnquiry.paymentType"
          ).$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.busiAttach"
          ).$D("商务附件"),
          fieldCode: "businessAttachment",
          render: () =>
            <span style="color: #276EF1">{this.$T(
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
            <span style="color:#276EF1">{this.$T(
              "hipspfm.common.button.viewAttachments"
            ).$D("查看附件")}</span>,
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
              <span>
                {val}
              </span>
              <div slot="right">
                <span>
                  {this.$T("ssrc.supplierQuotation.model.supQuo.lineNum").$D(
                    "行号"
                  )}
                  ：{record.rfxLineItemNum}
                </span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.itemCode").$D(
            "物料编码"
          ),
          fieldCode: "itemCode",
        },
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
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.quotationDescription"
          ).$D("报价说明"),
          fieldCode: "validQuotationRemark",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.netPrice").$D(
            "未税单价"
          ),
          fieldCode: "netPrice",
          visible: this.headInfo.priceTypeCode === "NET_PRICE",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxPrice").$D(
            "含税单价"
          ),
          fieldCode: "validQuotationPrice",
          visible: this.headInfo.priceTypeCode !== "NET_PRICE",
        },
        {
          fieldCode: "validExpiryDateFrom",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationValidityFrom").$D("报价有效期从"),
        },
        {
          fieldCode: "validExpiryDateTo",
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.currentExpiryDateTo").$D("报价有效期至"),
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
      ].filter(Boolean);
      return columns;
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
          fieldCode: "currentBusinessAttachmentUuid",
          render: () => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={this.headInfo.businessAttachmentUuid}
                canUpload={false}
                canDelete={false}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
                onShowFilePopup={false}
              />
            );
          },
        },
        {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.techAttach"
          ).$D("技术附件"),
          fieldCode: "currentTechAttachmentUuid",
          render: () => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={this.headInfo.techAttachmentUuid}
                canUpload={false}
                canDelete={false}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    )
                }
                onShowFilePopup={false}
              />
            );
          },
        },
        (Number(this.headInfo.bargainFlag) === 1 ||
          this.headInfo.currentBargainBusinessAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.barginBusiAttach"
          ).$D("议价商务附件"),
          fieldCode: "bargainBusinessAttachmentUuid",
          render: () => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={this.headInfo.bargainBusinessAttachmentUuid}
                canUpload={false}
                canDelete={false}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                  this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")
                }
                onShowFilePopup={false}
              />
            );
          },
        },
        (Number(this.headInfo.bargainFlag) === 1 ||
          this.headInfo.currentBargainTechAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.barginTechAttach"
          ).$D("议价技术附件"),
          fieldCode: "bargainTechAttachmentUuid",
          render: () => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={this.headInfo.bargainTechAttachmentUuid}
                canUpload={false}
                canDelete={false}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    )
                }
                onShowFilePopup={false}
              />
            );
          },
        },
        (Number(this.roundFlag) === 1 ||
          this.headInfo.currentRoundBusinessAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.roundBusiAttach"
          ).$D("多轮商务附件"),
          fieldCode: "roundBusinessAttachmentUuid",
          render: () => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={this.headInfo.roundBusinessAttachmentUuid}
                canUpload={false}
                canDelete={false}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    )
                }
                onShowFilePopup={false}
              />
            );
          },
        },
        (Number(this.roundFlag) === 1 ||
          this.headInfo.currentRoundTechAttachmentUuid) && {
          fieldName: this.$T(
            "ssrc.supplierQuotation.model.supQuo.roundTechAttach"
          ).$D("多轮技术附件"),
          fieldCode: "roundTechAttachmentUuid",
          render: () => {
            return (
              <SrmUpload
                color="blue"
                attachmentUuid={this.headInfo.roundTechAttachmentUuid}
                canUpload={false}
                canDelete={false}
                showIcon={false}
                title={this.$T(
                  "ssrc.supplierQuotation.view.message.title.supplierQuotation"
                ).$D("供应商报价")}
                descTitle={
                    this.$T("hipspfm.common.button.viewAttachments").$D(
                      "查看附件"
                    )
                }
                onShowFilePopup={false}
              />
            );
          },
        },
      ].filter(Boolean);
      return columns;
    },
  },
  mounted() {
    this.initData();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  deactivated() {
    clearInterval(this.timer);
  },
  methods: {
    // 跳转预审详情
    goToPrequal() {
      this.$router.push({
        name: "PrequalificationApproveDetail",
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
        switchUrl = 0,
      } = this.$route.query;
      this.rfxStatus = rfxStatus;
      this.organizationName = rfxNum;
      this.asnHeaderId = rfxHeaderId;
      this.purchaseAgentName = rfxTitle;
      this.operationMeaning = operationMeaning;
      this.quotationHeaderId = quotationHeaderId;
      this.supplierCompanyId = supplierCompanyId;
      this.switchUrl = switchUrl;
      this.quotationDataSet = new DataSet(
        lineInfoIndexDs(this.quotationHeaderId, false, this.asnHeaderId, switchUrl, this.supplierCompanyId)
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
    },
    // 跳转报价行详情
    goToQuotationDetail(item) {
      this.currentLineItemIndex = item.index;
      this.lineInfo = this.quotationDataSet.data;
      this.lineDetailPopup = !this.lineDetailPopup;
    },
    // 获取头信息
    async getOrderHeader() {
      const params = {
        customizeUnitCode: "SSRC.SUPPLIER_QUOTATION.BASE_FORM",
      };
      const {
        switchUrl = 0,
        quotationHeaderId,
        rfxHeaderId,
      } = this.$route.query;
      try {
        let headInfo;
        if(Number(switchUrl) === 2){
          headInfo = await getPurQueryHeadInfo(
            rfxHeaderId,
          {
            quotationHeaderId,
            rfxHeaderId,
            supplierCompanyId: this.supplierCompanyId,
          });
        }else{
          headInfo = await getQueryHeadInfo(
            rfxHeaderId,
          {
            quotationHeaderId,
            rfxHeaderId,
            supplierCompanyId: this.supplierCompanyId,
          });
        }
        
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
      const {
        switchUrl = 0,
      } = this.$route.query;
      const params = {
        page: 0,
        size: 100,
        customizeUnitCode:
          "SSRC.SUPPLIER_QUOTATION.LINE,SSRC.SUPPLIER_QUOTATION.LINE_FORM",
        quotationHeaderId: this.quotationHeaderId,
        rfxHeaderId: this.asnHeaderId,
        routerFrom: 'quotationQuery',
        supplierCompanyId: this.supplierCompanyId,
        organizationId: window.localStorage.getItem("organizationId"),
      };
      if(Number(switchUrl) === 2){
        await getPurOrderLineInfos(this.asnHeaderId, params).then((res) => {
          this.$loading.hide();
          this.lineInfoFlag = true;
          if (!res.failed) {
            this.lineInfo = res.content;
          }
        });
      } else {
        await getOrderLineInfos(this.asnHeaderId, params).then((res) => {
          this.$loading.hide();
          this.lineInfoFlag = true;
          if (!res.failed) {
            this.lineInfo = res.content;
          }
        });
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
    refreshData() {
      this.getOrderHeader();
      this.getOrderLine();
      this.quotationDataSet.refresh();
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
    queryTableLine(data = {}) {
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
