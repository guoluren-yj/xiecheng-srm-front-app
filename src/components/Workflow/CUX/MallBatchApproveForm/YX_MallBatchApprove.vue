<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.view.baseInfo').$D('基本信息')">
        <div>
          <customize style="padding-top: 10px" need-padding :columns="getBasicColumns()" :data-source="basicData" code="SMBL.WORKFLOW.MALL_BATCH.BASIC"/>
        </div>
        <srm-scroll-tab-item :label="$T('smodr.orderDetail.view.detail.orderInfo').$D('订单信息')">
          <srm-list :data-set="orderDataSet" :columns="getOrderColumns()" customize-code="SMBL.WORKFLOW.MALL_BATCH.ORDER"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab-item>

      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.productInfo').$D('商品信息')">
        <srm-list :data-set="skuDataSet" :columns="getSkuColumns()" customize-code="SMBL.WORKFLOW.MALL_BATCH.SKU" @itemClick="showSkuPop"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smodr.orderDetail.model.additionInfo').$D('附加费信息')">
        <srm-list :data-set="freightDataSet" :columns="getFreightColumns()" customize-code="SMBL.WORKFLOW.MALL_BATCH.FREIGHT" @itemClick="showFrePop"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>

    <!-- 详情弹框 -->
    <!-- 弹框 -->
    <srm-popup :visible.sync="visible" show-header :title="$T('smodr.orderDetail.view.batchInfoDetail').$D('审批详情')" position="right">
      <customize-detail
        :need-padding="true"
        :data-source="popupData.data"
        :code="popupData.code"
        :columns="popupData.columns"/>
    </srm-popup>
  </div>
</template>

<script>
import { $T, DataSet } from "srm-mobile-ui";
import CommonImage from "@/components/Image.vue";
import { getBasicDataApi } from "./api/index";
import skuDs from "./datasource/skuDs";
import freightDs from "./datasource/freightDs";
import orderDs from "./datasource/orderDs";
import { fetchSelectInfo } from "./api/index";

export default {
  modules: [ "smbl.common", "hzero.common", "smodr.orderDetail", "hipspfm.common" ],
  name: "MallBatchApprove",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      basicData:{},
      orderDataSet:new DataSet(orderDs()),
      skuDataSet:new DataSet(skuDs()),
      freightDataSet:new DataSet(freightDs()),
      batchNum:null,
      popupData:{},
      visible:false,
    };
  },
  computed: {
  },
  beforeMount() {
    this.batchNum = this.parameters.batchNum;
  },
  mounted() {
    // this.basicDataSet.addQueryParameter("batchNum", this.batchNum);
    // this.basicDataSet.refresh();
    this.fetchSelect();
    this.getBasicData();
    this.orderDataSet.addQueryParameter("batchNum", this.batchNum);
    this.orderDataSet.refresh();
    this.skuDataSet.addQueryParameter("batchNum", this.batchNum);
    this.skuDataSet.refresh();
    this.freightDataSet.addQueryParameter("batchNum", this.batchNum);
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
    getBasicData() {
      getBasicDataApi({ batchNum:this.batchNum }).then((res) => {
        if (res && !res.failed) {
          this.basicData = res;
        }
      });
    },
    getBasicColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "batchNum",
          fieldName: $T("hzero.common.components.import.model.batch").$D("批次号"),
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader show-open-tag={false}>
              <span>{$T("hzero.common.components.import.model.batch").$D("批次号")}：</span>{record.batchNum ? record.batchNum : "-"}
            </SrmListHeader>
        },
        {
          fieldCode: "batchAmountMeaning",
          fieldName: $T("smodr.orderDetail.model.batchAmountMeaning").$D("批次金额(含税)"),
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "purchaseCompanyName",
          fieldName: $T("smodr.orderDetail.model.purchaseCompany").$D("采购方"),
          formRow: 30,
          seq:10,
        },
        {
          fieldName: $T("smodr.orderDetail.model.buyerName").$D("下单人姓名"),
          fieldCode: "buyerName",
          formRow: 40,
          seq:10
        },
        {
          fieldName: $T("smodr.orderDetail.model.buyerDate").$D("下单时间"),
          fieldCode: "cecCreatedTime",
          formRow: 50,
          seq:10
        },
      ];
    },
    getOrderColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader show-open-tag={false}>
            <span>{$T("smodr.orderDetail.model.orderCode").$D("商城订单编码")}：</span>{item.orderCode ? item.orderCode : "-"}
          </SrmListHeader>
        },
        {
          fieldCode: "currencyName",
          formRow: 20,
          seq:20
        },
        {
          fieldCode: "proxyOrderAmountMeaning",
          formRow: 30,
          seq:10,
          render:(val, record) => record.agreementType !== "SALE" ?
            record.orderAmountMeaning || "-" :
            val || "-"
        },
        {
          fieldCode: "nakedPriceMeaning",
          formRow: 30,
          seq:20,
          render:(val, record) => record.agreementType !== "SALE" ?
            val || "-" :
            record.proxyNakedPriceMeaning || "-"
        },
        {
          fieldCode: "contactName",
          formRow: 40,
          seq:10,
          render:(val, record) => record.receiverAddress ? record.receiverAddress.contactName || "-" : "-"
        },
        {
          fieldCode: "mobilePhone",
          formRow: 40,
          seq:20,
          render:(val, record) => record.receiverAddress ? record.receiverAddress.mobilePhone || "-" : "-"
        },
        {
          fieldCode: "fullAddress",
          formRow: 50,
          seq:10,
          render:(val, record) => record.receiverAddress ? record.receiverAddress.fullAddress || "-" : "-"
        },
        {
          fieldCode: "showSupplierCompanyName",
          formRow: 60,
          seq:10,
        },
        {
          fieldCode: "attachmentUuid",
          formRow: 70,
          seq:10,
          fieldType: "TEXT",
          render:(val, record) =>
            <SrmUpload showIcon={false} color="blue"
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              attachmentUuid={record.attachmentUuid}/>
        },
        {
          fieldCode: "remark",
          formRow: 80,
          seq:10,
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
    getSkuColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader show-open-tag>
            <span>{$T("smodr.orderDetail.model.orderCode").$D("商城订单编码")}：</span>{item.orderCode}
          </SrmListHeader>
        },
        {
          formRow: 10,
          fieldCode: "primaryUrl",
          render: (val) => <CommonImage src={val} width={40} height={40}/>,
        },
        {
          fieldCode: "skuCode",
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "entryCode",
          formRow: 20,
          seq:20
        },
        {
          fieldCode: "skuName",
          formRow: 30,
          seq:10
        },
        {
          fieldCode: "productAttributeMeaning",
          formRow: 40,
          seq:10
        },
        {
          fieldCode: "itemCode",
          formRow: 40,
          seq:20
        },
        {
          fieldCode: "itemName",
          formRow: 50,
          seq:10,
        },
        {
          fieldCode: "originalQuantityMeaning",
          formRow: 50,
          seq:20
        },
        {
          fieldCode: "uom",
          formRow: 60,
          seq:10
        },
        {
          fieldCode: "proxyUnitPriceMeaning",
          formRow: 60,
          seq:20,
          render:(val, record) => record.agreementType !== "SALE" ? record.unitPriceMeaning : val
        },
        {
          fieldCode: "proxyEntryAmountMeaning",
          formRow: 70,
          seq:10,
          render:(val, record) => record.agreementType !== "SALE" ? record.entryAmountMeaning : val
        },
        {
          fieldCode: "neededDate",
          formRow: 70,
          seq:20
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
          render: (val, item) => <SrmListHeader show-open-tag>
            <span>{$T("smodr.orderDetail.model.orderCode").$D("商城订单编码")}：</span>{item.orderCode ? item.orderCode : "-"}
          </SrmListHeader>
        },
        {
          fieldCode: "entryCode",
          formRow: 10,
          seq:10
        },
        {
          fieldCode: "extraCostTypeMeaning",
          formRow:10,
          seq:20
        },
        {
          fieldCode: "itemCode",
          formRow: 20,
          seq:10
        },
        {
          fieldCode: "itemName",
          formRow:20,
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
          fieldCode: "unitPriceMeaning",
          formRow:40,
          seq:10
        },
        {
          fieldCode: "entryAmountMeaning",
          formRow:40,
          seq:20
        },
      ];
    },
    getSkuDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "orderCode",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.orderCode").$D("商城订单编码"),
        },
        {
          fieldCode: "entryCode",
          formRow: 20,
          fieldName: $T("smodr.orderDetail.model.entryCode").$D("商品行号"),
        },
        {
          fieldCode: "skuCode",
          formRow: 30,
          fieldName: $T("smodr.orderDetail.model.skuCode").$D("商品编码"),
        },
        {
          fieldCode: "skuName",
          fieldName: $T("smodr.orderDetail.model.skuName").$D("商品名称"),
          formRow: 40,
        },
        {
          fieldName: $T("smodr.orderDetail.model.productAttributeMeaning").$D("销售规格"),
          fieldCode: "productAttributeMeaning",
          formRow: 50,
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("smodr.orderDetail.model.itemCode").$D("物料编码"),
          formRow: 60,
        },
        {
          fieldCode: "itemName",
          fieldName: $T("smodr.orderDetail.model.itemName").$D("物料名称"),
          formRow: 70,
        },
        {
          fieldCode: "originalQuantityMeaning",
          fieldName: $T("smodr.orderDetail.model.quantity").$D("数量"),
          formRow: 80,
        },
        {
          fieldCode: "uom",
          formRow: 90,
          fieldName: $T("smodr.orderDetail.model.uomName").$D("单位"),
        },
        {
          fieldCode: "taxRateMeaning",
          formRow: 100,
          fieldName: $T("smodr.orderDetail.model.taxRateMeaning").$D("税率"),
        },
        {
          fieldCode: "currencyName",
          formRow: 110,
          fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
        },

        {
          fieldCode: "proxyUnitPriceMeaning",
          fieldName: $T("smodr.orderDetail.model.proxyUnitPriceMeaning").$D("单价(含税)"),
          formRow: 120,
          render:(val, record) => record.agreementType !== "SALE" ? record.unitPriceMeaning : val
        },
        {
          fieldCode: "proxyEntryAmountMeaning",
          fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
          formRow: 130,
          render:(val, record) => record.agreementType !== "SALE" ? record.entryAmountMeaning : val
        },
        {
          fieldCode: "neededDate",
          fieldName: $T("smodr.orderDetail.model.neededDate").$D("需求日期"),
          formRow: 140,
        },
        {
          fieldCode: "attributeVarchar10",
          fieldName: $T("smbl.common.model.yxApprove.attributeVarchar10").$D("服务类型"),
          formRow: 150,
          render: (val) => (this.attrbute10List.find((r) => r.value === val) || {}).meaning || "-"
        }
      ];
    },
    getFreDetailColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "orderCode",
          fieldType: "TEXT",
          fieldName: $T("smodr.orderDetail.model.orderCode").$D("商城订单编码"),
        },
        {
          fieldCode: "entryCode",
          formRow: 20,
          fieldName: $T("smodr.orderDetail.model.lineNumber").$D("行号"),
        },
        {
          fieldCode: "itemCode",
          formRow: 30,
          fieldName: $T("smodr.orderDetail.model.itemCode").$D("物料编码"),
        },

        {
          fieldCode: "itemName",
          fieldName: $T("smodr.orderDetail.model.itemName").$D("物料名称"),
          formRow: 40,
        },
        {
          fieldCode: "extraCostTypeMeaning",
          fieldName: $T("smodr.orderDetail.model.additionType").$D("附加费种类"),
          formRow: 45,
        },
        {
          fieldName: $T("smodr.orderDetail.model.quantity").$D("数量"),
          fieldCode: "quantityMeaning",
          formRow: 50,
        },
        {
          fieldCode: "uomName",
          fieldName: $T("smodr.orderDetail.model.uomName").$D("单位"),
          formRow: 60,
        },
        {
          fieldCode: "taxRateMeaning",
          formRow: 70,
          fieldName: $T("smodr.orderDetail.model.taxRateMeaning").$D("税率"),
        },
        {
          fieldCode: "currencyName",
          formRow: 80,
          fieldName: $T("smodr.orderDetail.model.currencyCode").$D("币种"),
        },
        {
          fieldCode: "unitPriceMeaning",
          fieldName: $T("smodr.orderDetail.model.unitPriceTaxNew").$D("单价(含税)"),
          formRow: 90,
        },
        {
          fieldCode: "entryAmountMeaning",
          fieldName: $T("smodr.orderDetail.model.lineAmountTaxNew").$D("行金额(含税)"),
          formRow: 100,
        },
        {
          fieldCode: "nakedPriceMeaning",
          formRow: 110,
          fieldName: $T("smodr.orderDetail.model.nakedPriceMeaning").$D("行金额(不含税)")
        },
      ];
    },
    showSkuPop(record) {
      this.openPopup(this.getSkuDetailColumns(), record.data, "SMBL.WORKFLOW.MALL_BATCH.SKU_DETAIL");
    },
    showFrePop(record) {
      this.openPopup(this.getFreDetailColumns(), record.data, "SMBL.WORKFLOW.MALL_BATCH.FREIGHT_DETAIL");
    },
    // 弹框
    openPopup(columns, item, code) {
      this.popupData["data"] = item;
      this.popupData["columns"] = columns;
      this.popupData["code"] = code;
      this.visible = true;
    },
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