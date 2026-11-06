<template>
  <div>
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.MALL_ORDER.COLLAPSE">
      <srm-scroll-tab-item :label="$T('hzero.common.view.title.baseInfo').$D('基础信息')" code="baseInfo">
        <srm-form :data-set="basicDataSet" :columns="getBasicColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_MAIN"/>
        <h2>{{ $T('smodr.orderDetail.view.reveiverOrAcquirerInfo').$D('收货/收单信息') }}</h2>
        <srm-form :data-set="basicDataSet" :columns="getContactColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_CONTACT"/>
        <h2 v-if="showInvoice">{{ $T('smodr.orderDetail.model.invoiceInfo').$D('发票信息') }}</h2>
        <srm-form v-if="showInvoice" :data-set="basicDataSet" :columns="getInvoiceColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_INVOICE"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.purOrgInfo').$D('交易方&业务组织信息')" code="businessInfo">
        <srm-form :data-set="basicDataSet" :columns="getBuyerColumns()" customize-code="SMBL.WORKFLOW.MALL_ORDER.BASIC_BUYER"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.productInfo').$D('商品信息')" code="prodInfo" style="position: relative">
        <srm-list :scrollable="false" customize-code="SMBL.WORKFLOW.MALL_ORDER.SKU" :data-set="skuDataSet" :columns="getSkuColumns()" @itemClick="showSkuPop"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.additionInfo').$D('附加费信息')" code="freiInfo">
        <srm-list v-if="freightDataSet.records && freightDataSet.records.length > 0" :scrollable="false" customize-code="SMBL.WORKFLOW.MALL_ORDER.FREIGHT" :data-set="freightDataSet" :columns="getFreightColumns()" @itemClick="showFreightPop"/>
        <text-empty v-else />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.accessory').$D('附件')" code="attachment">
        <srm-form :data-set="basicDataSet" :columns="getFileColumns" :row-col-to-seq="true" style="padding: 0" />
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
    <srm-popup :visible.sync="visible" show-header :title="$T('smodr.orderDetail.view.batchInfoDetail').$D('审批详情')" position="right">
      <customize-detail
        :need-padding="true"
        :data-source="popupData.data"
        :columns="popupData.columns"
        :code="popupData.code"/>
    </srm-popup>
  </div>
</template>

<script>
import { $T, DataSet } from "srm-mobile-ui";
import basicDs from "./datasource/basicDs";
import skuDs from "./datasource/skuDs";
import freightDs from "./datasource/freightDs";
import NewSrmListHeader from "../../NewSrmListHeader";
import TextEmpty from "../../TextEmpty";
import CuxMethods from "@/modules/CUX_PART/Method/MallOrderApprovalMethod";
export default {
  modules: ["smbl.common", "hzero.common", "smodr.orderDetail", "smodr.apply", "hipspfm.common"],
  name: "MallOrderApproval",
  components:{
    TextEmpty
  },
  extends: CuxMethods,
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
      compareDataSet: new DataSet({ selection: Infinity, editable: false, }),
      orderId:null,
      showMain:true,
      showOu:true,
      showInvoice:true,
      compareVisible: false,
      orderTypeCode: null,
      popupData: {},
      visible: false,
    };
  },
  computed: {
    getFileColumns() {
      return [
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("smodr.orderDetail.model.accessoryInner").$D("内部附件"),
          fieldType: "UPLOAD",
        },
        {
          fieldCode: "outerAttachmentUuid",
          fieldName: $T("smodr.orderDetail.model.accessoryOutter").$D("外部附件"),
          fieldType: "UPLOAD",
        },
      ];
    },
  },
  beforeMount() {
    this.orderId = this.parameters.orderId;
  },
  async mounted() {
    this.basicDataSet.addQueryParameter("orderId", this.orderId);
    await this.basicDataSet.refresh();
    this.orderTypeCode = (this.basicDataSet.toData() || [])[0]?.orderTypeCode;
    this.showInvoice = this.orderTypeCode === "EC";
    this.skuDataSet.addQueryParameter("orderId", this.orderId);
    this.skuDataSet.refresh();
    this.freightDataSet.addQueryParameter("orderId", this.orderId);
    this.freightDataSet.refresh();
  },
  methods: {
    openPopup(columns, item, code) {
      this.popupData["data"] = item;
      this.popupData["columns"] = columns;
      this.popupData["code"] = code;
      this.visible = true;
    },
    showSkuPop(record) {
      this.openPopup(this.getSkuDetailColumns(), record.data, "SMBL.WORKFLOW.MALL_ORDER.SKU_DETAIL");
    },
    showFreightPop(record) {
      this.openPopup(this.getFreightDetailColumns(), record.data, "SMBL.WORKFLOW.MALL_ORDER.FREIGHT_DETAIL");
    },
    getSkuDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "skuCode",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuCode").$D("商品编码"),
        },
        {
          formRow: 20,
          fieldCode: "skuName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuName").$D("商品名称"),
        },
        {
          formRow: 30,
          fieldCode: "lineNum",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.lineCode").$D("行号"),
        },
        {
          formRow: 40,
          fieldCode: "skuTypeMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.skuType").$D("商品类型"),
        },
        {
          formRow: 50,
          fieldCode: "productAttributeMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.productAttributeMeaning").$D("销售规格"),
        },
        {
          formRow: 60,
          fieldCode: "catalogName",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.catalogThird").$D("三级分类"),
        },
        {
          formRow: 65,
          fieldCode: "categoryName",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.skuCatalo").$D("商品目录"),
        },
        {
          formRow: 70,
          fieldCode: "itemCode",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.itemCode").$D("物料编码"),
        },
        {
          formRow: 80,
          fieldCode: "itemName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.itemName").$D("物料名称"),
        },
        {
          formRow: 90,
          fieldCode: "quantityMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.quantity").$D("数量"),
        },
        {
          formRow: 100,
          fieldCode: "uomName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.uomName").$D("单位"),
        },
        {
          formRow: 110,
          fieldCode: "taxRate",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.tax").$D("税率"),
        },
        {
          formRow: 120,
          fieldCode: "currencyName",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.currency").$D("币种"),
        },
        {
          fieldCode: "productCompareDTO",
          formRow: 130,
          render: (val) =>
            <span style="color: var(--color-other-default-b)">
              {val ? $T("smbl.common.button.view").$D("查看") : "-"}
            </span>,
          callBack: (val) => {
            this.openComparePopup(val);
          },
          fieldName: $T("smodr.orderDetail.model.competitive").$D("比价单"),
        },
        {
          formRow: 140,
          fieldCode: "per",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.per").$D("每"),
        },
        {
          formRow: 150,
          fieldCode: "containFreight",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.containFreight").$D("单价含运费"),
          render:(val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")
        },
        {
          formRow: 160,
          fieldCode: "eachFreight",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.fenAmount").$D("分摊运费（每）"),
        },
        {
          formRow: 170,
          fieldCode: "unitPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.unitPriceTaxNew").$D("单价(含税)"),
        },
        {
          formRow: 175,
          fieldCode: "unitNakedPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.unitNakedPriceMeaning").$D("单价(不含税)"),
        },
        {
          formRow: 180,
          fieldCode: "entryAmountMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
        },
        {
          formRow: 190,
          fieldCode: "nakedPriceMeaning",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.productAttributeMeaning").$D("行金额(不含税)"),
        },
        {
          formRow: 290,
          fieldCode: "remark",
          fieldType: "TEXT",
          fieldName: $T("smodr.apply.model.remark").$D("备注"),
        },
      ];
    },
    getFreightDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "itemName",
          fieldName: $T("smodr.orderDetail.model.itemCode").$D("物料编码"),
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("smodr.orderDetail.model.itemName").$D("物料名称"),
          formRow: 20,
        },
        {
          fieldCode: "entryCode",
          fieldName: $T("smodr.orderDetail.model.lineNumber").$D("行号"),
          formRow: 30,
        },
        {
          fieldCode: "extraCostTypeMeaning",
          fieldName: $T("smodr.orderDetail.model.additionType").$D("附加费种类"),
          formRow: 40,
        },
        {
          fieldCode: "quantityMeaning",
          fieldName: $T("smodr.orderDetail.model.quantity").$D("数量"),
          formRow:50,
        },
        {
          fieldCode: "uomName",
          fieldName: $T("smodr.orderDetail.model.uomName").$D("单位"),
          formRow:60,
        },
        {
          fieldCode: "taxRateMeaning",
          fieldName: $T("smodr.orderDetail.model.taxRateMeaning").$D("税率"),
          formRow:70,
        },
        {
          fieldCode: "currencyName",
          fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
          formRow:80,
        },
        {
          fieldCode: "unitPriceMeaning",
          fieldName: $T("smodr.orderDetail.model.unitPriceTaxNew").$D("单价(含税)"),
          formRow:90,
        },
        {
          fieldCode: "unitNakedPriceMeaning",
          fieldName: $T("smodr.orderDetail.model.unitNakedPriceMeaning").$D("单价(不含税)"),
          formRow:110,
        },
        {
          fieldCode: "entryAmountMeaning",
          fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
          formRow:110,
        },
        {
          fieldCode: "nakedPriceMeaning",
          fieldName: $T("smodr.orderDetail.model.nakedPriceMeaning").$D("行金额(不含税)"),
          formRow:120,
        },
      ];
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
          render: (val, item) => <SrmListHeader show-open-tag={false} class="mall-request-header">
            {item.orderCode}
            <srm-tag slot="right" size="mid" type="warn">
              {item.showOrderStatusMeaning}
            </srm-tag>
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
          render: (val, item) => <NewSrmListHeader show-open-tag>
            {item.skuName}
          </NewSrmListHeader>
        },
        {
          formRow: 10,
          fieldCode: "primaryUrl",
          render: (val) => <img src={val} width="40" height="40"/>,
        },
        {
          formRow: 10,
          fieldCode: "skuCode",
          seq:20
        },
        {
          fieldCode: "skuTypeMeaning",
          formRow: 30,
          seq:10
        },
        {
          fieldCode: "entryCode",
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
          formRow: 33,
          seq:10,
        },
        {
          fieldCode: "quantityMeaning",
          formRow: 40,
          seq:10
        },
        {
          fieldCode: "unitPriceMeaning",
          formRow: 40,
          seq:20
        },
        {
          fieldCode: "per",
          formRow: 42,
          seq:10
        },
        {
          fieldCode: "entryAmountMeaning",
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
          render: (val, item) => <NewSrmListHeader show-open-tag>
            {item.itemName ? item.itemName : "-"}
          </NewSrmListHeader>
        },
        {
          fieldCode: "itemCode",
          formRow: 10,
          seq:10
        },
        {
          fieldCode: "entryCode",
          formRow: 10,
          seq:20
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
          seq:20
        },
        {
          fieldCode: "currencyName",
          formRow:40,
          seq:10
        },
        {
          fieldCode: "unitPriceMeaning",
          formRow:50,
          seq:20
        },
        {
          fieldCode: "entryAmountMeaning",
          formRow:60,
          seq:30
        },
      ];
    },
    openComparePopup(item) {
      this.compareDataSet.setData(item?.productCompareDTO.productCompareAssignList || []);
      this.compareVisible = true;
    },
    // 审批前校验
    async beforeApprove(approveResult) {
      if (approveResult === "Approved" && this.over$beforeApprove && typeof this.over$beforeApprove === "function") {
        const checkFlag = await this.over$beforeApprove();
        return new Promise((resolve, reject) => {
          if (checkFlag === true) {
            resolve(true);
          } else {
            reject(checkFlag);
          }
        });
      }
      return true;
    }
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
>>>.mall-request-header{
  .srm-list-item-card-head-right{
    margin-left: 8px;
    flex-shrink: 0;
    min-width: auto !important;
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

.sku-load-more{
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  height: 36px;
  line-height: 36px;
  z-index: 1;
  background: var(--color-bg-default);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
}

</style>