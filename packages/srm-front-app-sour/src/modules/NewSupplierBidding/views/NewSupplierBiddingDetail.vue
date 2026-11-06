<template>
  <div style="height: 100vh">
    <!-- 头信息 -->
    <!--    <srm-detail-head :columns="getHeaderColumns" :data-source="headInfo" /> -->
    <!-- 内容区域 -->
    <srm-scroll-tab content-scroll>
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
        <customize
          v-else
          :need-padding="true"
          code="SSLM.BIDDING_TABLE_BID.DETAIL_BASE_FORM"
          :data-source="headInfo"
          :columns="getBaseForm"/>
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.supplierQuotation.view.message.panel.otherInfos').$D('其他信息')">
        <div v-if="!headInfo.rfxTitle" class="noContent">
          <span>
            {{ $T("hipspfm.supplierQuotation.view.title.noRfxHeadInfo").$D("暂无询价单头信息") }}
          </span>
        </div>
        <customize
          :need-padding="true"
          code="SSLM.BIDDING_TABLE_BID.DETAIL_OTHERS_FORM"
          :data-source="headInfo"
          :columns="getOtherForm"/>
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
                  :customize-code="getItemLineUnitCode()"/>
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.tab.attachmentList').$D('附件列表')">
        <customize
          :need-padding="true"
          code="SSLM.BIDDING_TABLE_BID.DETAIL_ATTACHMENT_FORM"
          :data-source="headInfo"
          :columns="getAttachmentForm" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>

const storage = window.localStorage;

import { $T, DataSet, SrmUtil, } from "srm-mobile-ui";
import { fetchQuotationHeader, queryEnableDoubleUnit, } from "../api";
import { itemLineDS } from "../datasource/itemLineDS";
import { getQtyName, getUomName, } from "../components/doubleUnit";

export default {
  modules: [ "ssrc.common", "hipspfm.workFlow", "ssrc.biddingOpen", "ssrc.bidHall", "ssrc.inquiryHall", "smbl.common", "hipspfm.supplierQuotation", "ssrc.supplierQuotation", "hzero.common", "hipspfm.common" ],
  name: "NewSupplierBiddingDetail",
  // components: { ContextDetail },
  data() {
    return {
      loading: false,
      rfxHeaderId: "",
      supplierCompanyId: null,
      documentType:"", // 单据类型 BID(招标单)|RFX（询价单）
      headInfo:{},
      info: {},
      tableLineDataSet: new DataSet(itemLineDS({
        documentType: this.documentType,
      })),
      bidFlag: this.documentType === "BID",
      doubleUnitFlag: false, // 双单位是否开启标志
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "rfxTitle",
          render: (val) => val
        },
        {
          fieldCode: "rfxByName",
          render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.prRequestedNam").$D("申请人") }：{ val }</span>
        },
        {
          fieldCode: "creationDate",
          render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.creationTime").$D("创建时间") }：{ val }</span>
        }
      ];
    },
    getBaseForm() {
      const fields = [
        {
          formRow: 0,
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              <span>
                {this.$T("ssrc.supplierQuotation.model.supQuo.commonRFXNo", [ this.documentType ]).$D("{categoryCode}单号")}
                :{val}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.supplierBiddingTitle").$D("招标书标题"),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuot.companyName").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
          fieldCode: "secondarySourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.curryCode").$D("币种"),
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.bidDirect").$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldCode: "quotationStartDate",
          fieldName: $T("ssrc.bidHall.model.bidHall.quotationStartTime").$D("投标开始时间"),
        },
        {
          fieldName: $T("ssrc.bidHall.model.bidHall.quotationEndDate").$D("投标截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("hzero.common.remark").$D("备注"),
          fieldCode: "rfxRemark",
        },
      ];
      return fields;
    },
    // 其它信息表单
    getOtherForm() {
      const Fields = [
        {
          formRow: 10,
          formCol: 1,
          fieldCode: "sealedQuotationFlag",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              <span>
                {this.$T("ssrc.supplierQuotation.model.supQuo.sealedQuotation").$D("密封报价")}
                :
                {val ? this.$T("hipspfm.workFlow.view.message.yes").$D("是") : this.$T("hipspfm.workFlow.view.message.no").$D("否")}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.sourcingType").$D("寻源类型"),
          fieldCode: "sourceTypeMeaning",
          formRow: 10,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceCategory").$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
          formRow: 20,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
          formRow: 20,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.common.model.common.termsOfPayment").$D("付款条款"),
          fieldCode: "paymentTermName",
          formRow: 30,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.bidBondYuan").$D("保证金(元)"),
          fieldCode: "bidBond",
          render: (val) => val === 0 ? this.$T("ssrc.common.view.gratis").$D("免费") : val ?? "",
          formRow: 30,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.round").$D("轮次"),
          fieldCode: "quotationRoundNumber",
          formRow: 40,
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
          render: (val) =>
            <SrmListHeader>
              <span>
                {val ?? ""}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.lineNo").$D("行号"),
          fieldCode: "rfxLineItemNum",
          formRow: 20,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.common.startTime").$D("开始时间"),
          fieldCode: "quotationStartDate",
          formRow: 30,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationsEndDate").$D("结束时间"),
          fieldCode: "quotationEndDate",
          formRow: 40,
          formCol: 1,
        },

        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.businessUnit").$D("业务实体"),
          fieldCode: "ouName",
          formRow: 50,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.inventoryOrg").$D("库存组织"),
          fieldCode: "invOrganizationName",
          formRow: 60,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          formRow: 70,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemName").$D("物料描述"),
          fieldCode: "itemName",
          formRow: 80,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.specs").$D("规格"),
          fieldCode: "specs",
          formRow: 90,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationDetails").$D("报价明细"),
          fieldCode: "quotationDetailFlag",
          formRow: 90,
          formCol: 2,
          render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
        },
        doubleUnitFlag ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.rfxQuantity").$D("需求数量"),
          fieldCode: "secondaryQuantity",
          formRow: 92,
          formCol: 1,
        } : null,
        doubleUnitFlag ? {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.unit").$D("单位"),
          fieldCode: "secondaryUomName",
          formRow: 92,
          formCol: 2,
        } : null,
        {
          fieldName: getQtyName(doubleUnitFlag),
          fieldCode: "rfxQuantity",
          formRow: 93,
          formCol: 1,
        },
        {
          fieldName: getUomName(doubleUnitFlag),
          fieldCode: "uomName",
          formRow: 93,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.priceQuantity").$D("价格批量"),
          fieldCode: "batchPrice",
          formRow: 100,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxInclude").$D("是否含税"),
          fieldCode: "taxIncludedFlag",
          render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
          formRow: 110,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.taxRate").$D("税率"),
          fieldCode: "taxRate",
          formRow: 110,
          formCol: 2,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.quotationRange").$D("报价幅度"),
          align: "right",
          fieldCode: "quotationRange",
          formRow: 120,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
          formRow: 130,
          formCol: 1,
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.demandDate").$D("需求日期"),
          fieldCode: "demandDate",
          formRow: 140,
          formCol: 1,
          // render: (val) => val && moment(val).format(DEFAULT_DATE_FORMAT),
        },
        {
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.startLadderLevel").$D("启用阶梯报价"),
          fieldCode: "ladderInquiryFlag",
          render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
          formRow: 150,
          formCol: 1,
        },
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
          fieldName: this.$T("ssrc.supplierQuotation.model.supQuo.biddingSupplierAttachment").$D("招标书附件"),
          fieldCode: "attachmentUuid",
          fieldType: "UPLOAD",
          showCount: true,
          readonly: true,
          formRow: 160,
          formCol: 1,
        },
      ];
      return columns.filter(Boolean);
    },
    getAttachmentForm() {
      return [
        {
          fieldCode: "businessAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.businessAttachmentUuid").$D("商务附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 1,
        },
        {
          fieldCode: "techAttachmentUuid",
          fieldName: $T("ssrc.inquiryHall.model.inquiryHall.techAttachmentUuid").$D("技术附件"),
          fieldType: "UPLOAD",
          showCount: true,
          formRow: 2,
        },
      ];
    },
  },
  mounted() {
    const { rfxHeaderId, supplierCompanyId, documentType } = this.$route.query;
    this.documentType = documentType;
    if (rfxHeaderId) {
      storage.setItem("hallDetailRfxHeaderId", rfxHeaderId);
    }
    this.getHeadInfo({ rfxHeaderId, supplierCompanyId, });
    this.tableLineDataSet.addPathParameter("rfxHeaderId", rfxHeaderId);
    this.tableLineDataSet.addPathParameter("supplierCompanyId", supplierCompanyId);
    this.tableLineDataSet.addPathParameter("customizeUnitCode", "SSLM.BIDDING_TABLE_BID.DETAIL_LINE");
    this.tableLineDataSet.query();
    this.init();
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
        if (res === 1 || res === "1") {
          this.doubleUnitFlag = true;
        }
      });
    },
    getItemLineUnitCode() {
      return "SSLM.BIDDING_TABLE_BID.DETAIL_LINE";
    },
    //获取询价单头信息
    async getHeadInfo(data = {}) {
      const params = {
        customizeUnitCode: "SSLM.BIDDING_TABLE_BID.DETAIL_BASE_FORM,SSLM.BIDDING_TABLE_BID.DETAIL_OTHERS_FORM,SSLM.BIDDING_TABLE_BID.DETAIL_ATTACHMENT_FORM",
        ...data,
      };

      this.$loading.show();
      const res = await fetchQuotationHeader(params);
      this.$loading.hide();
      if (res && !res.failed) {
        this.headInfo = res || {};
      }
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
