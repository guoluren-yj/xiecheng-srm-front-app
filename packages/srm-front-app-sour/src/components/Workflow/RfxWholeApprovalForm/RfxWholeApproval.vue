<template>
  <div>
    <srm-scroll-tab class="rfx-whole-approval-content">
      <srm-scroll-tab-item
        :label="
          $T('ssrc.common.view.message.basicInfos').$D(
            '基础信息'
          )">
        <div v-if="!headInfo.rfxTitle" class="noContent">
          <span>
            {{ $T("ssrc.common.view.title.noBasicInfos").$D("暂无基础信息") }}
          </span>
        </div>
        <srm-form
          v-else
          :data-set="headerFormDS"
          :customize-code="getCustomizeUnitCode('base')"
          :columns="getBaseForm" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.title.resultInput').$D('结果录入')">
        <srm-list :data-set="tableLineDataSet"
                  :columns="getLines"
                  :scrollable="false"
                  :customize-code="getCustomizeUnitCode('table')" />
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('hzero.common.upload.modal.title').$D('附件')">
        <customize
          :code="getCustomizeUnitCode('attachment')"
          :data-source="headInfo"
          type="list"
          :row-col-to-seq="true"
          :columns="getAttachmentForm" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 阶梯报价 -->
    <srm-popup
      :visible.sync="ladderLeverVisibleFlag"
      height="100%"
      position="bottom"
      :show-back="true"
      :show-close="true"
      :show-header="true"
      :title="$T('ssrc.supplierQuotation.view.message.button.ladderLevel').$D('阶梯报价')"
      @onClose="viewLadderLevelCloseModal" >
      <div style="padding: 15px 15px">
        <customize
          :columns="getLadderHeaderInfoColumns"
          :data-source="ladderHeadInfo" type="list" />
      </div>
      <srm-blank size="small" theme="fill"/>
      <srm-list
        :data-set="ladderLevelDS"
        :columns="getLadderInfoColumns"
        :scrollable="true" />
    </srm-popup>

    <!-- 适用范围 -->
    <srm-popup
      :visible.sync="applicationScopeVisibleFlag"
      height="100%"
      position="bottom"
      :show-back="true"
      :show-close="true"
      :show-header="true"
      :title="$T('ssrc.inquiryHall.model.inquiryHall.applicationScope').$D('适用范围')"
      @onClose="viewApplicationOrgModalClose" >
      <div style="padding: 15px 15px">
        <customize
          :columns="getApplicationScopeHeaderInfoColumns"
          :data-source="applicationScopeHeaderInfo" type="list" />
      </div>
      <srm-blank size="small" theme="fill"/>
      <srm-list
        :data-set="applicationScopeDS"
        :columns="getApplicationScopeListColumns"
        :scrollable="true" />
    </srm-popup>
  </div>
</template>

<script>

// const storage = window.localStorage;
import { isEmpty, isArray, } from "lodash";
import { $T, DataSet, SrmUtil, SrmTag } from "srm-mobile-ui";

import {
  getPriceName,
  getNetPriceName,
  getAvailableQtyName,
  getAllottedQuantity,
  getLadderFrom,
  getLadderTo,
  getUomName,
  getQtyName,
} from "@/utils/doubleUnit.js";
import { yesOrNoRenderer, } from "@/utils/renderer.js";

import { fetchWholeHeader, queryEnableDoubleUnit, fetchWholeLadderLevelList, fetchApplicationScopeUnitList, fetchApplicationScopeConfigList, } from "./api";
import { queryQuotationBasicFormDataSet } from "./datasource/queryQuotationBasicFormDataSet";
import { queryQuotationLineDataSet } from "./datasource/queryQuotationLineDataSet";
import { ladderLevelDataSet, applicationScopeDataSet, } from "./datasource/ds";

export default {
  modules: [ "ssrc.common", "hipspfm.workFlow", "ssrc.biddingOpen", "ssrc.bidHall", "ssrc.inquiryHall", "smbl.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "hzero.common", "hipspfm.common", "ssrc.queryQuotation", ],
  name: "RfxWholeApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      organizationId: SrmUtil.getOrganizationId(),
      documentType:"", // 单据类型 BID(招标单)|RFX（询价单）
      headInfo: {},
      headerFormDS: new DataSet(queryQuotationBasicFormDataSet({
        documentType: this.documentType,
      })),
      tableLineDataSet: new DataSet(queryQuotationLineDataSet({
        documentType: this.documentType,
      })),
      bidFlag: this.documentType === "BID",
      doubleUnitFlag: false, // 双单位是否开启标志
      bucketName: SrmUtil.getDefaultBucketName(),
      ladderLeverVisibleFlag: false, // 报价明细表 visible
      // currencyPrecision: null, // 手动查询的币种精度
      // financialPrecision: null, // 手动查询的财务精度
      ladderLevelDS: new DataSet(ladderLevelDataSet()),
      ladderHeadInfo: {},
      applicationScopeDS: new DataSet(applicationScopeDataSet()), // 适用范围 行数据
      applicationScopeHeaderInfo: {}, // 适用范围 头数据
      applicationScopeVisibleFlag: false, // 适用范围 popvisible
      applicationScopeCurrentData: {},
    };
  },
  computed: {
    getApplicationScopeHeaderInfoColumns() {
      const { rfxLineItemId } = this.applicationScopeHeaderInfo || {};

      return [
        !rfxLineItemId ? {
          fieldName: $T("ssrc.common.view.message.rfx").$D("询价单"),
          fieldType: "TEXT",
          formRow: 10,
          formCol: 1,
          fieldCode: "rfxTitle",
          visible: !rfxLineItemId,
          render: (val, item) => {
            const {
              rfxTitle,
              rfxNum,
            } = item || {};
            const codeName = rfxNum && rfxTitle ? `${rfxNum}-${rfxTitle}` : rfxNum || rfxTitle;
            return (
              <div class="ssrc-header-title">
                <srm-tooltip title={codeName} placement="bottom">
                  <span class="ssrc-header-title-value ssrc-approval-modal-info-header">{codeName}</span>
                </srm-tooltip>
              </div>
            );
          },
        } : {
          fieldName: $T("ssrc.common.item").$D("物料"),
          fieldType: "TEXT",
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          visible: rfxLineItemId,
          render: (val, item) => {
            const {
              itemName,
              itemCode,
            } = item || {};
            const codeName = itemCode && itemName ? `${itemCode}-${itemName}` : itemCode || itemName;
            return (
              <div>
                <srm-tooltip title={codeName} placement="bottom">
                  <div class="ssrc-whole-approval-modal-main-field">
                    {codeName}
                  </div>
                </srm-tooltip>
              </div>
            );
          },
        },
      ];
    },
    getApplicationScopeListColumns() {
      return [
        {
          fieldName: this?.applicationScopeCurrentData?.dimensionName || "",
          fieldType: "TEXT",
          fieldCode: "dataName",
          formRow: 100,
          formCol: 1,
        },
        {
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.dataCode").$D("编码"),
          fieldType: "TEXT",
          fieldCode: "dataCode",
          formRow: 200,
          formCol: 1,
        },
      ];
    },
    getLadderHeaderInfoColumns() {
      return [
        {
          fieldName: $T("ssrc.common.item").$D("物料"),
          fieldType: "TEXT",
          formRow: 10,
          formCol: 1,
          fieldCode: "itemName",
          render: (val, item) => {
            const {
              itemName,
              itemCode,
            } = item || {};
            const codeName = itemCode && itemName ? `${itemCode}-${itemName}` : itemCode || itemName;
            return (
              <div>
                <srm-tooltip title={codeName} placement="bottom">
                  <div class="ssrc-whole-approval-modal-main-field">
                    {codeName}
                  </div>
                </srm-tooltip>
              </div>
            );
          },
        },
      ];
    },
    // 阶梯报价
    getLadderInfoColumns() {
      const doubleUnitFlag = this.doubleUnitFlag;

      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxLineItemNum").$D("行号"),
          // fieldType: "TEXT",
          fieldType: "EMPTY",
          fieldCode: "rfxLadderLineNum",
          formRow: 100,
          formCol: 1,
          render: (val) =>
            <span style="font-size: 14px; font-weight: 600; font-family: PingFangSC-Semibold;">
              {val}
            </span>
          ,
        },
        {
          fieldName: $T("ssrc.common.model.common.ladderFrom").$D("数量从"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "secondaryLadderFrom",
          formRow: 200,
          formCol: 1,
          visible: doubleUnitFlag,
        },
        {
          fieldName: $T("ssrc.common.model.common.ladderTo").$D("数量至"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "secondaryLadderTo",
          formRow: 200,
          formCol: 2,
          visible: doubleUnitFlag,
        },
        {
          fieldName: getLadderFrom(doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "ladderFrom",
          formRow: 300,
          formCol: 1,
          // visible: !doubleUnitFlag,
        },
        {
          fieldName: getLadderTo(doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "ladderTo",
          formRow: 300,
          formCol: 2,
          // visible: !doubleUnitFlag,
        },
        {
          fieldName: $T("ssrc.supplierQuotation.model.supQuo.taxPrice").$D("单价(含税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "currentLadderSecPrice",
          formRow: 400,
          formCol: 1,
          visible: doubleUnitFlag,
        },
        {
          fieldName: $T("ssrc.supplierQuotation.model.supQuo.netPrice").$D("单价(不含税)"),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "currentNetLadderSecPrice",
          formRow: 400,
          formCol: 2,
          visible: doubleUnitFlag,
        },
        {
          fieldName: getPriceName(doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "currentLadderPrice",
          formRow: 500,
          formCol: 1,
        },
        {
          fieldName: getNetPriceName(doubleUnitFlag),
          fieldType: "INPUT_NUMBER",
          editor: false,
          fieldCode: "currentNetLadderPrice",
          formRow: 500,
          formCol: 2,
        },
        // {
        //   formRow: 1000,
        //   formCol: 1,
        //   fieldName: $T("hzero.common.remark").$D("备注"),
        //   fieldType: "TEXT",
        //   fieldCode: "remark",
        // },
      ].filter(Boolean);
    },
    getBaseForm() {
      const fields = [
        {
          formRow: 0,
          fieldType: "EMPTY",
          fieldCode: "rfxTitle",
          render: (val, record) => {
            const { rfxTitle } = record || {};
            return (
              <SrmListHeader show-open-tag={false}>
                <div class="ssrc-header-title">
                  <srm-tooltip title={rfxTitle} placement="bottom">
                    <span class="ssrc-header-title-value">{rfxTitle}</span>
                  </srm-tooltip>
                </div>
              </SrmListHeader>
            );
          },
        },
        {
          formRow: 100,
          fieldName: this.$T("ssrc.common.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          formRow: 300,
          fieldName: this.$T("ssrc.inquiryHall.model.whole.distributeTotalPrice").$D("分配总金额"),
          fieldCode: "totalPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 400,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applicationScope").$D("适用范围"),
          fieldCode: "applicationScopeFlag",
          fieldType: "TEXT",
          render: (value) =>
            <span class="ssrc-whole-approval-application-scope">
              {yesOrNoRenderer(value)}
              {value ? <a
                disabled={!value}
                class="ssrc-link-buttons"
                style="margin-left: 8px;"
                onClick={this.viewApplicationHeader}
              >
                {this.$T("ssrc.inquiryHall.model.inquiryHall.applicationOrganization").$D("适用其他组织")}
              </a> : ""}
            </span>
          ,
        },
        {
          formRow: 500,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currency").$D("币种"),
          fieldCode: "currencyCode",
          fieldType: "TEXT",
        },
        {
          formRow: 600,
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldCode: "checkRemark",
          fieldType: "TEXT",
        },
      ];
      return fields;
    },
    // 获取报价行表格物料相关的字段
    getItemColumns() {
      return [
        {
          fieldCode: "itemName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料名称"),
          formRow: 1,
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader show-open-tag={false}>{val}</SrmListHeader>,
        },
        {
          fieldCode: "itemCode",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          formRow: 10,
          formCol: 10,
        },
        {
          fieldCode: "rfxLineItemNum",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.rfxLineItemNum").$D("行号"),
          formRow: 10,
          formCol: 20,
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: getQtyName(this.doubleUnitFlag),
          formRow: 20,
          formCol: 10,
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "secondaryQuantity",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quantity").$D("需求数量"),
          formRow: 30,
          formCol: 10,
          visible: this.doubleUnitFlag,
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldCode: "uomName",
          fieldName: getUomName(this.doubleUnitFlag),
          formRow: 20,
          formCol: 20,
        },
        {
          fieldCode: "secondaryUomName",
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.uom").$D("单位"),
          formRow: 30,
          formCol: 20,
          visible: this.doubleUnitFlag,
        },
      ];
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
          render: (_, item) =>
            <div class="ssrc-table-line-customize-header-wrapper">
              <Customize
                dataSource={item}
                columns={this.getItemColumns}
                code={this.getCustomizeUnitCode("item")} />
            </div>
          ,
        },
        {
          formRow: 20,
          formCol: 1,
          fieldCode: "suggestedFlag",
          fieldType: "EMPTY",
          render: (_, item) => {
            const {
              suggestedFlag,
              supplierCompanyName,
            } = item || {};
            const tagTitle = suggestedFlag ? this.$T("ssrc.inquiryHall.model.inquiryHall.suggest").$D("选用") : this.$T("ssrc.inquiryHall.model.inquiryHall.suggestNot").$D("未选用");
            const tagType = suggestedFlag ? "success" : "info";
            return (
              <SrmListHeader show-open-tag={false}>
                {supplierCompanyName}
                <SrmTag type={tagType} slot="right">{tagTitle}</SrmTag>
              </SrmListHeader>
            );
          },
        },

        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedRatio").$D("分配比例%"),
          fieldCode: "allottedRatio",
          formRow: 100,
          formCol: 1,
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: getAllottedQuantity(doubleUnitFlag),
          fieldCode: "allottedQuantity",
          formRow: 100,
          formCol: 2,
          // visible: !doubleUnitFlag,
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.allottedQuantity").$D("分配数量"),
          fieldCode: "allottedSecondaryQuantity",
          formRow: 101,
          formCol: 2,
          visible: doubleUnitFlag,
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          formRow: 300,
          formCol: 1,
          fieldName: getPriceName(doubleUnitFlag),
          fieldCode: "currentQuotationPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // visible: !doubleUnitFlag,
        },
        {
          formRow: 300,
          formCol: 2,
          fieldName: getNetPriceName(doubleUnitFlag),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          // visible: !doubleUnitFlag,
        },
        {
          formRow: 301,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPriceTax").$D("单价(含税)"),
          fieldCode: "currentQuotationSecPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          formRow: 301,
          formCol: 2,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.netPrice").$D("单价(不含税)"),
          fieldCode: "netSecondaryPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
          visible: doubleUnitFlag,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.reason").$D("选用理由"),
          fieldCode: "suggestedRemark",
          formRow: 400,
          formCol: 1,
          visible: !doubleUnitFlag,
        },
        {
          fieldName: getAvailableQtyName(doubleUnitFlag),
          fieldCode: "currentQuotationQuantity",
          formRow: 400,
          formCol: 2,
          editor: false,
          fieldType: "INPUT_NUMBER",
          // visible: !doubleUnitFlag,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationQuantity").$D("可供数量"),
          fieldCode: "currentQuotationSecQuantity",
          formRow: 401,
          formCol: 2,
          editor: false,
          fieldType: "INPUT_NUMBER",
          visible: doubleUnitFlag,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率"),
          fieldCode: "taxRate",
          formRow: 500,
          formCol: 1,
          editor: false,
        },
        {
          fieldName: this.$T("ssrc.common.deliveryCycleDay").$D("供货周期(天)"),
          fieldCode: "currentDeliveryCycle",
          formRow: 500,
          formCol: 2,
          fieldType: "INPUT_NUMBER",
        },

        {
          formRow: 800,
          formCol: 1,
          fieldName: this.$T("ssrc.supplierQuotation.view.message.button.ladderLevel").$D("阶梯报价"),
          fieldCode: "ladderLevel",
          editor: false,
          fieldType: "TEXT",
          render: (val, item) => {
            const { ladderInquiryFlag } = item || {};
            return ladderInquiryFlag ? <a class="ssrc-link-buttons" onClick={() => this.viewLadderLevel(item)}>
              { this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看") }
            </a> : "";
          },
        },
        {
          formRow: 900,
          formCol: 1,
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.applicationScope").$D("适用范围"),
          fieldCode: "applicationScopeFlag",
          fieldType: "TEXT",
          render: (value, item) =>
            <span class="ssrc-whole-approval-application-scope">
              {yesOrNoRenderer(value)}
              {value ? <a
                disabled={!value}
                style="margin-left: 8px;"
                class="ssrc-link-buttons"
                onClick={() => this.viewApplicationLine(item)}
              >
                {this.$T("ssrc.inquiryHall.model.inquiryHall.applicationOrganization").$D("适用其他组织")}
              </a> : ""}
            </span>
          ,
        },
        {
          formRow: 1000,
          formCol: 1,
          fieldCode: "currentAttachmentUuid",
          fieldName: $T("ssrc.supplierQuotation.model.supQuo.purchaserLineAttachment").$D("供应商行附件"),
          fieldType: "UPLOAD",
          showCount: true,
          bucketName: "private-bucket",
          bucketDirectory: "ssrc-rfx-quotationline",
          disabled: true,
          title: this.$T("hzero.common.title.checkAttach").$D("查看附件"),
        },
      ];
      return columns.filter(Boolean);
    },
    getAttachmentForm() {
      return [
        {
          fieldCode: "checkAttachmentUuid",
          fieldName: $T("hzero.common.title.checkAttach").$D("查看附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 100,
          bucketName: "private-bucket",
          bucketDirectory: "ssrc-rfx-quotationline",
          disabled: true,
          // title: this.$T("ssrc.inquiryHall.view.message.button.view").$D("查看"),
        },
      ];
    },
  },
  mounted() {
    const { documentType, } = this.$route.query;
    this.documentType = documentType;
    this.bidFlag = documentType === "BID";

    this.queryHeaderAndLine();
    this.intiConfigs();
  },
  methods: {
    intiConfigs() {
      this.queryDoubleUnit();
    },
    // query page header and line
    queryHeaderAndLine() {
      const { rfxHeaderId } = this.parameters || {};
      if (!rfxHeaderId) {
        return;
      }
      this.getHeadInfo();
      this.tableLineDataSet.addPathParameter("rfxHeaderId", rfxHeaderId);
      this.tableLineDataSet.addPathParameter("customizeUnitCode", this.getCustomizeUnitCode([ "table", ]));
      this.tableLineDataSet.addPathParameter("sourceMobileEndFlag", 1);

      this.tableLineDataSet.reset();
      this.tableLineDataSet.query();
    },
    getCustomizeUnitCode(type) {
      if (!type || isEmpty(type)) {
        return null;
      }

      const RfxCodeMap = new Map([
        [ "base", "SMBL.WORKFLOW.OFFLINE_WHOLE_APPROVAL.BASE_FORM_INFO" ], // 基础信息
        [ "table", "SMBL.WORKFLOW.OFFLINE_WHOLE_APPROVAL.QUOTATION_LINE" ], // 报价行表格
        [ "item", "SMBL.WORKFLOW.OFFLINE_WHOLE_APPROVAL.QUOTATION_ITEM_LINE_ITEM_DETAIL" ], //
        [ "attachment", "SMBL.WORKFLOW.OFFLINE_WHOLE_APPROVAL.QUOTATION_ATTACHMENT" ], // attachment
      ]);

      const BidCodeMap = new Map([
        // [ "base", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATIAON_BASE_FORM_INFO" ], // 基础信息
        // [ "table", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATIAON_QUOTATION_LINE" ], // 报价行表格
        // [ "item", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATIAON_QUOTATION_ITEM_LINE_DETAIL" ], // 附件,
        // [ "attachment", "SMBL_SSRC_SUPPLIER_QUOTATION_REPLY_BID.QUERY_QUOTATIAON_QUOTATION_ATTACHMENT" ],
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
    // 双单位
    queryDoubleUnit() {
      queryEnableDoubleUnit({
        businessModule: "RFX",
        tenantId: SrmUtil.getTenantId(),
      }).then((res) => {
        if (res === 1 || res === "1") {
          this.doubleUnitFlag = true;
        }
      });
    },
    //获取询价单头信息
    async getHeadInfo() {
      const { rfxHeaderId } = this.parameters || {};
      if (!rfxHeaderId) {
        return;
      }
      const params = {
        customizeUnitCode: this.getCustomizeUnitCode([ "base", "attachment" ]),
        rfxHeaderId,
        organizationId: this.organizationId,
        sourceMobileEndFlag: 1,
      };

      this.$loading.show();
      const res = await fetchWholeHeader(params);
      this.$loading.hide();
      if (res && !res.failed) {
        const headerData = res || {};
        this.headInfo = headerData;
        this.headerFormDS.create(headerData, 0);
      }
    },
    viewApplicationHeader() {
      const { rfxHeaderId, applicationScopeFlag, } = this.headInfo || {};
      if (!rfxHeaderId) {
        return;
      }
      const params = {
        sourceHeaderId: rfxHeaderId,
        applicationScopeFlag,
      };
      this.applicationScopeHeaderInfo = this.headInfo || {};
      this.fetchApplicationAndOpenModal(params);
    },
    viewApplicationLine(item) {
      const { rfxHeaderId, } = this.headInfo || {};
      const { rfxLineItemId, applicationScopeFlag, } = item || {};
      if (!rfxLineItemId) {
        return;
      }

      this.applicationScopeHeaderInfo = item;
      const currentData = {
        sourceHeaderId: rfxHeaderId,
        sourceLineItemId: rfxLineItemId,
        applicationScopeFlag,
      };
      this.fetchApplicationAndOpenModal(currentData);
    },
    // 适用范围
    async fetchApplicationAndOpenModal(params) {
      let result = null;
      const paramNew = {
        sourceFrom: "RFX",
        organizationId: this.organizationId,
        ...params || {},
      };
      result = await fetchApplicationScopeUnitList(paramNew);
      if (result && result.failed) {
        return;
      }

      this.applicationScopeDS.reset();
      if (isEmpty(result)) {
        return;
      }

      const firstLine = result[0] || {};
      this.applicationScopeCurrentData = firstLine;
      this.querySelectedLine(firstLine);

      this.applicationScopeVisibleFlag = true;
    },
    // 查询勾选的行
    async querySelectedLine(data = {}, params = {}) {
      if (isEmpty(data)) {
        return;
      }

      const {
        sourceCode = null,
        sourceCodeType = "",
        sourceAppScopeId = null,
        sourceCodeUniqueKey,
      } = data;
      const commonProps = {
        sourceCode,
        organizationId: this.organizationId,
        sourceCodeType,
        sourceAppScopeId,
        sourceCodeUniqueKey,
        ...params,
      };
      let result = null;
      result = await fetchApplicationScopeConfigList(commonProps);
      if (result && result.failed) {
        return;
      }

      this.applicationScopeDS.setData(result || []);
    },
    viewApplicationOrgModalClose() {
      this.applicationScopeDS.reset();
      this.applicationScopeHeaderInfo = {};
      this.applicationScopeCurrentData = {};
      this.applicationScopeVisibleFlag = false;
    },
    // 阶梯报价
    async viewLadderLevel(data) {
      const { rfxLineItemId, offlineQuoLineId, } = data || {};

      if (!offlineQuoLineId) {
        return;
      }

      const params = {
        rfxLineItemId,
        offlineQuoLineId,
        organizationId: this.organizationId,
        sourceMobileEndFlag: 1,
      };

      let result = null;
      result = await fetchWholeLadderLevelList(params);
      if (result && result.failed) {
        return;
      }

      this.ladderLevelDS.setData(result || []);
      this.ladderLeverVisibleFlag = true;
      this.ladderHeadInfo = data || {};
    },
    viewLadderLevelCloseModal() {
      this.ladderLevelDS.reset();
      this.ladderLevelDS.setData([]);
      this.ladderHeadInfo = {};
      this.ladderLeverVisibleFlag = false;
    },
  }
};
</script>

<style lang="stylus" scoped>

>>> .srm-list-item-card-head {
  display: flex;
  align-items: flex-start !important;
}

>>> .rfx-whole-approval-content > .srm-scroll{
  background: var(--background-color-empty);
}

>>> .srm-attachment-button > .srm-button-plain > .srm-button-text {
  font-family: PingFangSC-Regular;
}

.ssrc-header-title {
  display: inline-block;
  max-width: 100%;
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

.ssrc-approval-modal-info-header {
  vertical-align: middle;
}

.ssrc-header-source-category {
  font-family: PingFangSC-Medium;
  background: #F0F2F5;
  border: 1px solid #F0F2F5;
  border-radius: 2px;
  font-size: 10px;
  transform: scale(0.86);
  transform-origin: 0 0;
  color: var(--font-color-default);
  line-height: 16px;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  margin-left: 4px;
  padding: 0 4px;
}

.ssrc-whole-approval-application-scope {
  display: inline-block;
}

.ssrc-table-line-customize-header-wrapper {
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F2F5;
  position: relative;

  .ssrc-table-line-customize-header-titles {
    max-width: 100%;
    display: inline-block
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.ssrc-whole-table-line-suggest-wrap {
  display: flex;
  align-items: center;
}

.ssrc-whole-table-line-suggest-wrap-suggest {
  background: #05944F;
  border: 1px solid #009847;
  border-radius: 2px;
  font-family: PingFangSC-Medium;
  font-size: 10px;
  transform: scale(0.86);
  transform-origin: 0 0;
  color: var(--background-color-empty-second);
  line-height: 16px;
  font-weight: 500;
}

.ssrc-whole-table-line-supplier-name {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: var(--font-color-default);
  font-weight: 600;
  margin-left: 8px;
}

.ssrc-table-line-number-wrap {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: var(--color-default);
  line-height: 20px;
  font-weight: 400;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ssrc-link-buttons {
  color: var(--font-color-primary);
  font-weight: 500;
}

.ssrc-whole-approval-modal-main-field {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

</style>
