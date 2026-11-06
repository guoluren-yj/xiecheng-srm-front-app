<template>
  <div>
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.MALL_ORDER.COLLAPSE">
      <srm-scroll-tab-item :label="$T('smbl.common.view.main.info').$D('主要信息')" code="baseInfo">
        <!-- <srm-collapse-item v-model="showMain" name="1" >
          <span>
            {{ $T("smbl.common.view.main.info").$D("主要信息") }}
          </span>
          <div slot="content" style="width: 100%">
            <srm-form :data-set="basicDataSet" :columns="getBasicColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_MAIN"/>
          </div>
        </srm-collapse-item> -->
        <srm-form :data-set="basicDataSet" :columns="getBasicColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_MAIN"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.view.businessInfo').$D('业务信息')" code="businessInfo">
        <srm-form :data-set="basicDataSet" :columns="getBuyerColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_BUYER"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.view.reveiverOrAcquirerInfo').$D('收货/收单信息')" code="reveiverOrAcquirerInfo">
        <srm-form :data-set="basicDataSet" :columns="getContactColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_CONTACT"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="showInvoice" :label="$T('smodr.orderDetail.model.invoiceInfo').$D('发票信息')" code="invoiceInfo">
        <srm-form :data-set="basicDataSet" :columns="getInvoiceColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_INVOICE"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.productInfo').$D('商品信息')" code="prodInfo">
        <srm-list customize-code="SMBL.WORKFLOW.MALL_ORDER.SKU" :data-set="skuDataSet" :columns="getSkuColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.additionInfo').$D('附加费信息')" code="freiInfo">
        <srm-list customize-code="SMBL.WORKFLOW.MALL_ORDER.FREIGHT" :data-set="freightDataSet" :columns="getFreightColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.accessory').$D('附件')" code="attachment">
        <div class="attachment-card">
          <srm-flex class="attachment-container">
            <span class="icon srm-icon icon-other" />
            <srm-attachment-button :attachments="getAttachment" :title="$T('smodr.orderDetail.model.accessoryInner').$D('内部附件')" :show-total="true"/>
          </srm-flex>
          <span class="right-icon srm-icon icon-chevron-right"/>
        </div>
        <div class="attachment-card">
          <srm-flex class="attachment-container">
            <span class="icon srm-icon icon-other" />
            <srm-attachment-button :attachments="getOutAttachment" :title="$T('smodr.orderDetail.model.accessoryOutter').$D('外部附件')" :show-total="true"/>
          </srm-flex>
          <span class="right-icon srm-icon icon-chevron-right"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible.sync="compareVisible"
               :title="$T('smodr.orderDetail.model.competitive').$D('比价单')"
               :position="'bottom'"
               :height="'80%'"
               rounded>
      <srm-list v-if="compareVisible"
                class="comparedScopePopStyle"
                :scrollable="false"
                height="auto"
                style="height: auto"
                :data-set="compareDataSet"
                :columns="getCompareColumns()"
                :auto-hide-search-bar="true"/>
    </srm-popup>
  </div>
</template>

<script>
import { $T, DataSet, SrmButton } from "srm-mobile-ui";
import skuDs from "./datasource/ZYT_skuDs";
import basicDs from "./datasource/ZYT_basicDs";
import freightDs from "@/components/Workflow/MallOrderApproveForm/datasource/freightDs";
import { fetchOrderBudgetApi } from "./api/ZYT_index";

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
      skuDataSet:new DataSet(skuDs(this)),
      freightDataSet:new DataSet(freightDs()),
      compareDataSet: new DataSet({ selection: Infinity, editable: false, }),
      orderId:null,
      showMain:true,
      showOu:true,
      showInvoice:true,
      compareVisible: false,
      orderTypeCode: null,
      budgetData: []
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
    getOutAttachment() {
      return [ {
        attachmentUuid: this.basicDataSet.current && this.basicDataSet.current.data.outerAttachmentUuid,
        title: this.$T("smodr.orderDetail.model.accessoryOutter").$D("外部附件"),
        uploadButton: "fixed",
        readonly:true
      } ];
    },
  },
  beforeMount() {
    this.orderId = this.parameters.orderId;
  },
  async mounted() {
    this.basicDataSet.addQueryParameter("orderId", this.orderId);
    await this.basicDataSet.refresh();
    await this.fetchBudget();
    this.orderTypeCode = (this.basicDataSet.toData() || [])[0]?.orderTypeCode;
    this.showInvoice = this.orderTypeCode === "EC";
    this.skuDataSet.addQueryParameter("orderId", this.orderId);
    this.skuDataSet.refresh();
    this.freightDataSet.addQueryParameter("orderId", this.orderId);
    this.freightDataSet.refresh();
  },
  methods: {
    async fetchBudget() {
      const { basicDataSet } = this;
      if (basicDataSet && basicDataSet?.current?.get("attributeVarchar6") === "1") {
        const params = {
          documentType: "EXP_REQUISITION",
          businessCode:  basicDataSet?.current?.get("orderCode"),
          from: "MALL_ORDER",
        };
        await fetchOrderBudgetApi(params).then((res) => {
          if (res && !res.failed) {
            this.budgetData = res;
          }
        });
      }
    },
    getCompareColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "productName",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.skuName").$D("商品名称"),
        },
        {
          fieldCode: "productCode",
          formRow: 20,
          fieldName: $T("smodr.orderDetail.model.skuCode").$D("商品编码"),
        },
        {
          fieldCode: "showSupplierName",
          formRow: 30,
          fieldName: $T("smodr.orderDetail.model.supplierCompanyName").$D("供应商"),
        },
        {
          fieldCode: "type",
          fieldName: $T("smodr.orderDetail.model.sourceType").$D("来源类型"),
          formRow: 40,
          render: (val) => val === 2 ? $T("smodr.orderDetail.model.termOfSale").$D("同款推荐") : $T("smodr.orderDetail.model.editMode").$D("手工添加"),
        },
        {
          fieldCode: "price",
          fieldName: $T("smodr.orderDetail.model.price").$D("单价"),
          formRow: 45,
        },
      ];
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
      },
      {
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
      },
      // 收单人
      {
        fieldCode: "invoiceContactName",
        render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
        formRow: 40,
        seq:10,
        show: this.orderTypeCode === "EC",
      },
      {
        fieldCode: "invoiceTelNum",
        render:(val, item, field) => item.acquiringInvoice && item.acquiringInvoice[field.fieldCode],
        formRow: 50,
        seq:10,
        show: this.orderTypeCode === "EC",
      },
      // 字段名转换
      {
        fieldCode: "acquireFullAddress",
        render:(val, item) => item.acquiringInvoice && item.acquiringInvoice.fullAddress,
        formRow: 60,
        seq:10,
        show: this.orderTypeCode === "EC",
      }, ].filter((f) => f.show !== false);
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
        {
          formRow: 10,
          fieldCode: "primaryUrl",
          render: (val) => <img src={val} width="40" height="40"/>,
        },
        {
          fieldCode: "skuName",
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "productCompareDTO",
          formRow: 30,
          seq:10,
          render: (val) =>
            <span style="color: var(--color-other-default-b)">
              {val ? $T("smbl.common.button.view").$D("查看") : "-"}
            </span>,
          callBack: (val) => {
            this.openComparePopup(val);
          },
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
          fieldCode: "per",
          formRow: 42,
          seq:10
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
    },
    openComparePopup(item) {
      this.compareDataSet.setData(item?.productCompareDTO.productCompareAssignList || []);
      this.compareVisible = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
>>>.srm-form{
  min-height 0px;
}

.comparedScopePopStyle{
  >>> .srm-list-search-line {
    height: 0px;
    padding: 0px;
  }
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