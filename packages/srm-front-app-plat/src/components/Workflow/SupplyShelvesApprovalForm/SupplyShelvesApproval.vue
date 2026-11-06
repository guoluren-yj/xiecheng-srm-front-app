<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item class="tab-container"
                         :label="$T('smpc.product.view.baseInfo').$D('基本信息')">
      <div v-if="JSON.stringify(headInfo) === '{}'" class="noContent">
        <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
      </div>
      <div v-else style="padding-top: 10px">
        <customize
          code="SMBL.WORKFLOW.SUPPLIER_SHELVES_APPROVE_BASIC_INFO"
          :columns="getBasicColumns" :data-source="headInfo"
          need-padding/>
      </div>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item class="tab-container"
                         :label="$T('smpc.ShelfApply.view.lineDetail').$D('商品明细')">
      <srm-list :data-set="productDetailDataSet"
                customize-code="SMBL.WORKFLOW.SUPPLIER_SHELVES_APPROVE_PRODUCT_DETAIL"
                :scrollable="false"
                :columns="getProduceDetailColumns"
                @itemClick="onListItemClick"/>
    </srm-scroll-tab-item>
    <srm-scroll-tab-item class="tab-container"
                         :label="$T('smpc.ShelfApply.view.attachment').$D('附件')">
      <div v-if="JSON.stringify(headInfo.attachmentUuid) === '{}'" class="noContent">
        <span>{{ $T("hipspfm.workFlow.view.message.attachment").$D("暂无附件") }}</span>
      </div>
      <div v-else style="padding-top: 10px">
        <customize
          :columns="getAttachmentColumns" :data-source="headInfo"
          need-padding/>
      </div>
    </srm-scroll-tab-item>
    <srm-popup position="right" header-align="left" :visible.sync="productDetailFlag" height="100%" :show-header="false">
      <product-detail v-if="productDetailFlag" :product-data="productData" />
    </srm-popup>
  </srm-scroll-tab>
</template>

<script>
import { getProductShelvesHeadInfoApi } from "./api";
import ProductDetail from "./ProductDetail.vue";
import { DataSet } from "srm-mobile-ui";
import productDetailDs from "./datasource/productDetailDs";
export default {
  modules: [ "hipspfm.common", "hipspfm.workFlow", "sslm.common", "smpc.product", "smpc.ShelfApply" ],
  name: "SupplyShelvesApproval",
  components:{
    ProductDetail
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
  },
  data() {
    return {
      productDetailDataSet: {},
      headInfo: {},
      productDetailFlag:false,
      productData:{}
    };
  },
  computed:{
    approveStaus() {
      let status;
      return (approveStaus) => {
        switch (approveStaus) {
        case "APPROVAL":
        case "SUSPENDED":
          status = "warning";
          break;
        case "APPROVED":
          status = "success";
          break;
        case "REJECTED":
          status = "danger";
          break;
        case "STOP":
        case "REVOKE":
          status = "invalid";
          break;
        default:
          status = "create";
          break;
        }
        return status;
      };
    },
    purSkuStatus() {
      let status;
      return (purSkuStatus) => {
        switch (purSkuStatus) {
        case 1:
        case 7:
          status = "success";
          break;
        case 2:
        case 4:
          status = "invalid";
          break;
        case 3:
          status = "danger";
          break;
        case 5:
          status = "create";
          break;
        default:
          status = "create";
          break;
        }
        return status;
      };
    },
    getBasicColumns() {
      return [
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) => <SrmListHeader>
            <span>{val}</span>
            <span slot="right" class={record.applyStatus === "APPROVING" ? "warning" : ""}>{record.applyStatusMeaning}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.applyNum").$D("申请编号"),
          fieldCode: "applyCode",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.applyType").$D("申请类型"),
          fieldCode: "applyTypeMeaning",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.applyUserName").$D("申请人"),
          fieldCode: "applyUserName",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.remark").$D("备注"),
          fieldCode: "remark",
        },
      ];
    },
    getProduceDetailColumns() {
      return [
        {
          fieldCode: "skuCode",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) => <SrmListHeader>
            <span>{this.$T("smpc.ShelfApply.model.skuCode").$D("商品编码")}: {val}</span>
            <span slot="right" class={this.purSkuStatus(record.purSkuStatus)}>{record.purSkuStatusMeaning}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.skuName").$D("商品名称"),
          fieldCode: "skuName",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.supplier").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.categoryName").$D("平台分类"),
          fieldCode: "categoryName",
        },
        {
          fieldName: this.$T("smpc.ShelfApply.model.mallDirectory").$D("商城目录"),
          fieldCode: "catalogName",
        },
      ];
    },
    getAttachmentColumns() {
      return [
        {
          fieldCode: "attachmentUuid",
          fieldType: "EMPTY",
          formRow:0,
          render: (val) => <SrmListHeader showOpenTag={false}>
            <em class="srm-icon icon-other file-icon"></em>
            <span class="att-list">{this.$T("smpc.ShelfApply.model.viewAttachmentList").$D("查看附件列表")}</span>
            <em onClick={() => this.viewAttachment(val)} style="color:#333;font-weight:100" slot="right" class="srm-icon icon-chevron-right"></em>
          </SrmListHeader>
        },
      ];
    },
  },
  created() {
    this.productDetailDataSet = new DataSet(productDetailDs(this.changeReqId));
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getProductShelvesHeadInfo();
      } catch (err) {
        console.log(err, "error");
      } finally {
        this.$loading.hide();
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("hipspfm.workFlow.view.message.title.supplyShelvesApproval").$D(
        "供应商上下架工作流审批"
      )
    );
  },
  methods: {
    onListItemClick(record) {
      this.productData = record.data;
      this.productDetailFlag = !this.productDetailFlag;
    },
    // 获取供应商上下架头信息
    async getProductShelvesHeadInfo() {
      await getProductShelvesHeadInfoApi(this.changeReqId)
        .then((res) => {
          this.headInfo = res;
        });
    },
    viewAttachment(attachmentUuid) {
      this.$showFileList({
        title: this.$T(
          "hipspfm.workFlow.view.button.uploadview"
        ).$D("附件查看"),
        attachmentUuid
      });
    },
  }
};
</script>

<style scoped lang="stylus">
 .warning{
   color:#FFC043;
 }
 .danger{
   color:#E11900;
 }
 .success{
   color:#05944F;
 }
 .invalid{
   color:#CBCBCB;
 }
 .create{
   color:#276EF1;
 }
 .file-icon{
   color:#ffc043;
   font-size:24px;
 }
 .att-list{
   margin-left: 16px;
   vertical-align: top;
 }
</style>
