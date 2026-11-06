<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.view.baseInfo').$D('基本信息')"/>
      <!--      <srm-collapse > -->
      <srm-collapse-item v-model="showMain" name="1" >
        <span>
          {{ $T("smbl.common.view.main.info").$D("主要信息") }}
        </span>
        <div slot="content" style="width: 100%">
          <srm-form :data-set="basicDataSet" :columns="getBasicColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_MAIN"/>
        </div>
      </srm-collapse-item>
      <srm-collapse-item v-model="showBuy" name="2">
        <span>
          {{ $T("smodr.orderDetail.view.buyerInfo").$D("下单人信息") }}
        </span>
        <div slot="content" style="width: 100%">
          <srm-form :data-set="basicDataSet" :columns="getBuyerColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_BUYER"/>
        </div>
      </srm-collapse-item>
      <srm-collapse-item v-model="showContact" name="3">
        <span>
          {{ $T("smodr.orderDetail.view.reveiverInfo").$D("收货信息") }}
        </span>
        <div slot="content" style="width: 100%">
          <srm-form :data-set="basicDataSet" :columns="getContactColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_CONTACT"/>
        </div>
      </srm-collapse-item>
      <srm-collapse-item v-model="showOu" name="4">
        <span>
          {{ $T("smodr.orderDetail.model.orgInfo").$D("业务组织关系") }}
        </span>
        <div slot="content" style="width: 100%">
          <srm-form :data-set="basicDataSet" :columns="getOuColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_OU"/>
        </div>
      </srm-collapse-item>
      <srm-collapse-item v-model="showInvoice" name="5">
        <span>
          {{ $T("smodr.orderDetail.model.invoiceInfo").$D("发票信息") }}
        </span>
        <div slot="content" style="width: 100%">
          <srm-form :data-set="basicDataSet" :columns="getInvoiceColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_INVOICE"/>
        </div>
      </srm-collapse-item>
      <!--      </srm-collapse> -->
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.productInfo').$D('商品信息')">
        <srm-list customize-code="SMBL.WORKFLOW.MALL_ORDER.SKU" :data-set="skuDataSet" :columns="getSkuColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.additionInfo').$D('附加费信息')">
        <srm-list customize-code="SMBL.WORKFLOW.MALL_ORDER.FREIGHT" :data-set="freightDataSet" :columns="getFreightColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.accessory').$D('附件')">
        <div class="attachment-card">
          <srm-flex class="attachment-container">
            <span class="icon srm-icon icon-other" />
            <srm-attachment-button :attachments="getAttachment" :title="$T('smodr.orderDetail.model.accessoryInner').$D('内部附件')" :show-total="true"/>
          </srm-flex>
          <span class="right-icon srm-icon icon-chevron-right"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { $T, DataSet, SrmButton } from "srm-mobile-ui";
// import CommonImage from "@/components/Image.vue";
import basicDs from "./datasource/basicDs";
import skuDs from "./datasource/skuDs";
import freightDs from "./datasource/freightDs";
import { fetchSelectInfo } from "./api/index";
export default {
  modules: [ "smbl.common", "hzero.common", "smodr.orderDetail" ],
  name: "MallOrderApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      basicDataSet:new DataSet(basicDs()),
      skuDataSet:new DataSet(skuDs()),
      freightDataSet:new DataSet(freightDs()),
      orderId:null,
      showMain:true,
      showBuy:true,
      showContact:true,
      showOu:true,
      showInvoice:true,
      attrbute3List:[],
      attrbute2List:[],
      attrbute10List:[],
    };
  },
  computed: {
    getAttachment() {
      return [ {
        attachmentUuid: this.basicDataSet.current && this.basicDataSet.current.data.attachmentUuid,
        title: this.$T("smodr.orderDetail.model.accessoryInner").$D("内部附件"),
        uploadButton: "fixed",
        readonly:true
      } ];
    },
  },
  beforeMount() {
    this.orderId = this.parameters.orderId;
  },
  async mounted() {
    this.fetchSelect();
    this.basicDataSet.addQueryParameter("orderId", this.orderId);
    this.basicDataSet.refresh();
    this.skuDataSet.addQueryParameter("orderId", this.orderId);
    this.skuDataSet.refresh();
    this.freightDataSet.addQueryParameter("orderId", this.orderId);
    this.freightDataSet.refresh();
  },
  methods: {
    fetchSelect() {
      fetchSelectInfo("SRM_SMPC_PUR_SKU_LOV").then((res) => {
        if (res && res.length) {
          this.attrbute3List = res;
        }
      });
      fetchSelectInfo("JSFS-YX").then((res) => {
        if (res && res.length) {
          this.attrbute2List = res;
        }
      });
      fetchSelectInfo("YX.SC.FWLX").then((res) => {
        if (res && res.length) {
          this.attrbute10List = res;
        }
      });
    },
    getBasicColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader show-open-tag={false}>
            {item.orderCode}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="warn">
              {item.showOrderStatusMeaning}
            </SrmButton>
          </SrmListHeader>
        },
        {
          fieldCode: "orderTypeMeaning",
          formRow: 10,
          seq:10
        },
        {
          fieldCode: "proxyPaymentTypeMeaning",
          formRow: 10,
          seq:20
        },
        {
          fieldCode: "currencyName",
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "extraCostAmountMeaning",
          formRow: 35,
          seq:20
        },
        {
          fieldCode: "proxyProductAmountMeaning",
          formRow: 30,
          seq:10,
          render: (val, item) => item["agreementType"] !== "SALE" ? item["productAmountMeaning"] : val
        },
        {
          fieldCode: "proxyOrderAmountMeaning",
          formRow: 40,
          seq:10,
          render: (val, item) => item["agreementType"] !== "SALE" ? item["orderAmountMeaning"] : val
        },
        {
          fieldCode: "purchaseCompanyName",
          formRow: 50,
          seq:10,
          render: (val, item) => item["agreementType"] === "SALE" ? item["proxySupplierCompanyName"] : val
        },
        {
          fieldCode: "showSupplierCompanyName",
          formRow: 60,
          seq:10
        },
        {
          fieldCode: "creationDate",
          formRow: 70,
          seq:10
        },
        {
          fieldCode: "attributeVarchar3",
          formRow: 80,
          seq:20,
          render: (val) => (this.attrbute3List.find((r) => r.value === val) || {}).meaning || "-"
        },
        {
          fieldCode: "attributeVarchar2",
          formRow: 80,
          seq:20,
          render: (val) => (this.attrbute2List.find((r) => r.value === val) || {}).meaning || "-"
        }
      ];
    },
    getBuyerColumns() {
      return [ {
        fieldCode: "buyerName",
        formRow: 10,
        seq:10
      },
      {
        fieldCode: "buyerFullPhone",
        formRow: 20,
        seq:10
      },
      {
        fieldCode: "unitName",
        formRow: 30,
        seq:10
      }, ];
    },
    getContactColumns() {
      return [ {
        fieldCode: "contactName",
        render:(val, item, field) => item.receiverAddress && item.receiverAddress[field.fieldCode],
        formRow: 10,
        seq:10
      },
      {
        fieldCode: "fullPhone",
        render:(val, item, field) => item.receiverAddress && item.receiverAddress[field.fieldCode],
        formRow: 20,
        seq:10
      },
      {
        fieldCode: "fullAddress",
        render:(val, item, field) => item.receiverAddress && item.receiverAddress[field.fieldCode],
        formRow: 30,
        seq:10
      }, ];
    },
    getOuColumns() {
      return [ {
        fieldCode: "ouName",
        formRow: 10,
        seq:10
      },
      {
        fieldCode: "purOrganizationName",
        formRow: 20,
        seq:10
      } ];
    },
    getInvoiceColumns() {
      return [
        {
          fieldCode: "invoiceTypeName",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 10,
          seq:10
        },
        {
          fieldCode: "invoiceStateName",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "invoiceTitleTypeName",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 30,
          seq:10
        },
        {
          fieldCode: "invoiceContentName",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 40,
          seq:10
        },
        {
          fieldCode: "taxRegisterNum",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 50,
          seq:10
        },
        {
          fieldCode: "depositBank",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 60,
          seq:10
        },
        {
          fieldCode: "bankAccount",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 70,
          seq:10
        },
        {
          fieldCode: "registeredAddress",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 80,
          seq:10
        },
        {
          fieldCode: "registeredPhone",
          render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
          formRow: 90,
          seq:10
        },
      ];
    },
    getSkuColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader show-open-tag={false}>
            <span>{$T("smodr.orderDetail.model.skuCode").$D("商品编码")}：</span>{item.skuCode}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
              <span>{$T("smbl.common.model.lineNumber").$D("行号")}</span>：{item.entryCode}
            </SrmButton>
          </SrmListHeader>
        },
        // {
        //   formRow: 10,
        //   fieldCode: "primaryUrl",
        //   render: (val) => <CommonImage src={val} width={40} height={40}/>,
        // },
        {
          fieldCode: "skuName",
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "skuTypeMeaning",
          formRow: 30,
          seq:20
        },
        {
          fieldCode: "itemCode",
          formRow: 33,
          seq:10
        },
        {
          fieldCode: "itemName",
          formRow: 36,
          seq:10,
          render:(val, record) => record.itemCode ? val : "-" // 无物料编码不展示物料名称
        },
        {
          fieldCode: "quantityMeaning",
          formRow: 40,
          seq:10
        },
        {
          fieldCode: "finalUnitPriceMeaning",
          formRow: 40,
          seq:20
        },
        {
          fieldCode: "finalEntryAmountMeaning",
          formRow: 50,
          seq:10
        },
        {
          fieldCode: "currencyName",
          formRow: 50,
          seq:20
        },
        {
          fieldCode: "taxRateMeaning",
          formRow: 60,
          seq:10
        }, {
          fieldCode: "uom",
          formRow: 60,
          seq:20,
        },
        {
          fieldCode: "containFreight",
          formRow: 70,
          seq:10,
          render:(val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")
        },
        {
          fieldCode: "eachFreight",
          formRow: 70,
          seq:20,
        },
        {
          fieldCode: "remark",
          formRow: 80,
          seq:10,
        },
        {
          fieldCode: "attributeVarchar10",
          formRow: 80,
          seq:10,
          render: (val) => (this.attrbute10List.find((r) => r.value === val) || {}).meaning || "-"
        }
      ];
    },
    getFreightColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader show-open-tag={false}>
            <span>{$T("smodr.orderDetail.model.itemCode").$D("物料编码")}：</span>{item.itemCode ? item.itemCode : "-"}
          </SrmListHeader>
        },
        {
          fieldCode: "itemName",
          formRow: 10,
          seq:10
        },
        {
          fieldCode: "entryCode",
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "extraCostTypeMeaning",
          formRow: 20,
          seq:20
        },
        {
          fieldCode: "quantityMeaning",
          formRow:30,
          seq:10
        },
        {
          fieldCode: "uomName",
          formRow:30,
          seq:20
        },
        {
          fieldCode: "taxRateMeaning",
          formRow:40,
          seq:10
        },
        {
          fieldCode: "currencyName",
          formRow:40,
          seq:20
        },
        {
          fieldCode: "unitPriceMeaning",
          formRow:50,
          seq:20
        },
        {
          fieldCode: "entryAmountMeaning",
          formRow:50,
          seq:30
        },
      ];
    }
  },
};
</script>

<style lang="stylus" scoped>
>>>.srm-form{
  min-height 0px;
}

.attachment-card {
  position: relative;
  height: 54px;
  border-bottom: 1px solid var(--color-border-default);
  >>> .srm-upload {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .right-icon {
    position: absolute;
    right: 15px;
    top: 15px;
    color: var(--font-color-disable);
    font-size: 20px;
  }
  .attachment-container {
    pointer-events: none;
    height: 100%;
    .icon {
      color: var(--color-warn);
      margin-left: 15px;
      font-size: 28px;
    }
    .title {
      margin-left: 8px;
    }
    .attachment-type {
      margin-left: 8px;
    }
  }
}

</style>