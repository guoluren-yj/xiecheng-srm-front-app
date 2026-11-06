<template>
  <srm-popup
    :visible="visible" height="100%" position="right" @onClose="close">
    <!-- <hips-view> -->
    <!-- 导航 -->
    <nav-head :title="$T('hipspfm.workFlow.view.message.supplierQuotationDetail').$D('供应商报价明细')" @goBack="goBack" />
    <!-- 供应商报价明细 -->
    <div class="lineinfo-detail" :style="{ height: showBackFlag ? 'calc(100vh - 44px)' : '100vh' }">
      <!-- 头部按钮 -->
      <srm-button-group>
        <srm-button size="large" fill @click="goPriceDetail">
          {{ $T("ssrc.inquiryHall.view.message.modal.quotationDetail").$D("报价明细") }}
        </srm-button>
        <srm-button size="large" fill type="warn" @click="goLadderPriceDetail">
          {{ $T("ssrc.inquiryHall.view.message.button.ladderLevel").$D("阶梯报价") }}
        </srm-button>
        <srm-button size="large" type="purple" fill @click="showFilePop">
          {{ $T("ssrc.inquiryHall.model.inquiryHall.supplierLineAttachment").$D("供应商行附件") }}
        </srm-button>
      </srm-button-group>

      <!-- 内容区 -->
      <div class="content">
        <!-- 个性化组件替换后的代码 -->
        <customize-detail :columns="getColumns" :data-source="itemData" code="SMBL.INQUIRY_HALL.LIST.RFXPRICE_DETAIL" />
        <!-- <CustomizeDetail  :dataSource="itemData"  /> -->
      </div>
    </div>

    <!-- 附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :attachment-uuid="attachmentUuid"
      :title="$T('hipspfm.common.message.title.viewAttachment').$D('附件查看')"/>

    <!-- 阶梯报价弹窗 -->
    <!-- <NewLadderQuotationDetail v-model="ladderInfoFlag" :queryParams="ladderQueryParams" /> -->

    <!-- 报价明细弹窗 -->
    <!-- <NewQuotationDetail v-model="detailInfoFlag" :queryParams="queryParams" /> -->

    <!-- 底部按钮 -->
    <new-bottom-handler :btn-arr="[{ title: $T('ssrc.inquiryHall.model.inquiryHall.save').$D('保存'), background: '#276EF1', color: '#fff', handler: submit }]" />

    <!-- </hips-view> -->
  </srm-popup>
</template>

<script>
import uuid from "uuid";
import NavHead from "@/components/NavHead";
import AttachedFile from "@/components/File/AttachedFile";
import NewBottomHandler from "@/components/V5/BottomHandler";
import SrmButtonGroup from "@/components/V5/SrmButtonGroup";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.workFlow", "hipspfm.common" ],
  components: {
    NavHead,
    AttachedFile,
    SrmButtonGroup,
    NewBottomHandler,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    itemData: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      itemDatas: {},
      filePopup: false,
      queryParams: {},
      ladderQueryParams: {},
      detailInfoFlag: false, //报价明细弹窗
      ladderInfoFlag: false, //阶梯报价弹窗
      attachmentUuid: "",
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.validQuotationPrice").$D("单价"),
          fieldCode: "validQuotationPrice",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.availableQuantity").$D("可供数量"),
          fieldCode: "validQuotationQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.isSelect").$D("是否选用"),
          fieldCode: "suggestedFlag",
          fieldType: "SWITCH",
          tips: () => this.$T("ssrc.inquiryHall.view.inquiryHall.isSelectTips").$D("默认关闭，可手动开启"),
          disabled: (val, record) => Boolean(record.invalidFlag),
          switchChange: (val, record) => {
            if (val) {
              record.allottedQuantity = record.rfxQuantity;
            } else {
              record.allottedQuantity = "";
              record.suggestedRemark = "";
            }
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceQuantity").$D("价格批量"),
          fieldCode: "priceBatchQuantity",
          fieldType: "INPUT_NUMBER",
          editor:  (val, record) => record.suggestedFlag, //控制是否可编辑
          editLimit: (val, record) => record.suggestedFlag,
          precision: (val, record) => Number(record.uomPrecision),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.checkPrice.allottedQuantity").$D("分配数量"),
          fieldCode: "allottedQuantity",
          fieldType: "INPUT_NUMBER",
          editor:  (val, record) => record.suggestedFlag, //控制是否可编辑
          editLimit: (val, record) => record.suggestedFlag,
          precision: (val, record) => Number(record.uomPrecision),
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.checkPrice.suggestedRemark").$D("选用理由"),
          fieldCode: "suggestedRemark",
          fieldType: "INPUT",
          disabled: (val, record) => !record.suggestedFlag,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.lastQuotation").$D("上次报价"),
          fieldCode: "preQuotationPrice",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.floatPrice").$D("价格浮动"),
          fieldCode: "priceFluctuation",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.paymentTerm").$D("付款条款"),
          fieldCode: "paymentTermName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qVFrom").$D("报价有效期从"),
          fieldCode: "validExpiryDateFrom",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.qVTo").$D("报价有效期至"),
          fieldCode: "validExpiryDateTo",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.CommitmentDelivery").$D("承诺交期"),
          fieldCode: "validPromisedDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.deliveryPeriod").$D("供货周期"),
          fieldCode: "validDeliveryCycle",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minimumPurchaseAmount").$D("最小购买量"),
          fieldCode: "minPurchaseQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.minimumPackageAmount").$D("最小包装量"),
          fieldCode: "minPackageQuantity",
          fieldType:"INPUT_NUMBER",
          editor:false
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.includingFreight").$D("是否含运费"),
          fieldCode: "freightIncludedFlag",
          render: (val) => val ? this.$T("hipspfm.workFlow.view.message.yes").$D("是") : this.$T("hipspfm.workFlow.view.message.no").$D("否")
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.freightAmount").$D("运费"),
          fieldCode: "freightAmount",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          fieldCode: "validQuotationRemark",
          fieldType: "TEXT_AREA",
          disabled: true,
        },

      ];
      return columns;
    }
  },
  methods: {
    submit() {
      this.$emit("submit", "save");
    },
    close() {
      this.$emit("changeVisible", false);
    },
    goBack() {
      // this.$router.back();
      this.$emit("input", false);
    },
    // 打开附件
    showFilePop() {
      this.filePopup = !this.filePopup;
      this.attachmentUuid = this.itemData.attachmentUuid || uuid();
    },
    // 跳转报价明细页面
    goPriceDetail() {
      const sourceFrom = "RFX";
      const { rfxHeaderId, rfxLineItemId, itemId, quotationHeaderId, quotationLineId, itemName, itemCode, itemCategoryId } = this.itemData;
      // this.$router.push({ name: 'NewQuotationDetail', query: {  rfxHeaderId, rfxLineItemId, itemId, quotationHeaderId, quotationLineId, sourceFrom } });
      this.$emit("showPriceDetail", { detailInfoFlag: true, queryParams: { rfxHeaderId, rfxLineItemId, itemId, quotationHeaderId, quotationLineId, sourceFrom, itemName, itemCode, itemCategoryId } });
    },
    // 跳转阶梯报价页面
    goLadderPriceDetail() {
      const { quotationLineId, companyName, itemCode } = this.itemData;
      // this.$router.push({ name: 'NewLadderQuotationDetail', query: { quotationLineId, companyName, itemCode } });
      this.$emit("showLadderPriceDetail", { ladderInfoFlag: true, ladderQueryParams: { quotationLineId, companyName, itemCode } });
    },
  },
};
</script>

<style lang="stylus" scoped>
.lineinfo-detail {
  width: 100%;
  height calc(100vh - 44px);
  overflow-y: auto;

    .content {
        padding-left 15px;
        padding-bottom: 80px;
    }

}
>>> .srm-popup-content>.bottom-handler{
  width:80%;
}
</style>
