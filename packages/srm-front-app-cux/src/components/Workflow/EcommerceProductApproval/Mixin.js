import imgDefault from "@/assets/sku_default.svg";

export default {
  props: {
    batchId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      approver: null, // 流程表单类型
    };
  },
  async mounted() {
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.ecommerceProductApproval.view.title.approval").$D(
        "商品申请提交审批",
      ),
    );
    if (this.parameters) {
      this.approver = this.parameters.approver;
    }
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldName: this.$T("smpc.import.model.batchNum").$D("批次号"),
          fieldCode: "batchNum",
        },
        {
          fieldName: this.$T("smpc.product.view.createByName").$D("创建人"),
          fieldCode: "createdByName",
        },
        {
          fieldName: this.$T("hzero.common.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
      ];
    },
    getBusinessColumns() {
      return [
        {
          fieldName: this.$T("smpc.product.view.skuImage").$D("商品图片"),
          fieldCode: "imagePath",
          render: (val, item) => {
            const skuImageList = item?.skuImageList || [];
            const { mediaPath } = skuImageList.find((f) => f?.primaryFlag === 1) || {};
            const imgSrc = mediaPath || imgDefault;
            return <img style="width: 60px; height: 60px; display: inline-block;" src={imgSrc} alt onClick={() => this.$previewImage([ imgSrc ])}/>;
          },
        },
        {
          fieldName: this.$T("smpc.product.view.skuCode").$D("商品编码"),
          fieldCode: "skuCode",
        },
        {
          fieldName: this.$T("smpc.product.view.skuName").$D("商品名称"),
          fieldCode: "skuName",
        },
        {
          fieldName: this.$T("smpc.product.view.platformCategory").$D("平台分类"),
          fieldCode: "categoryNamePath",
        }, {
          fieldName: this.$T("smpc.product.view.supplier").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sagm.common.view.price.tax").$D("单价(含税)"),
          fieldCode: "taxPrice",
        },
        {
          fieldName: this.$T("smpc.product.model.tax").$D("税率"),
          fieldCode: "tax",
        },
        {
          fieldName: this.$T("smpc.product.model.currency").$D("币种"),
          fieldCode: "currencyName",
        },
      ];
    },
  },
};