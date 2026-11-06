<template>
  <div style="height: 100vh; overflow: auto;">
    <div class="main-info">
      <customize-detail code="SMBL.CREATE_DELIVERY.CREATE_DELIVERY_DETAIL" :need-padding="true" :data-source="detailInfo" :columns="getOrderLineInfoColumns" />
    </div>

    <!-- 底部操作按钮 -->
    <srm-bottom-handler :btn-arr="btnArr" />
  </div>
</template>

<script>
import { createDeliveryApi } from "../api/index";
import { dateFormat } from "@/utils/index";
export default {
  modules: [ "hipspfm.createDelivery", "sinv.common" ],
  name: "YongXiangCreateDeliveryDetail",
  components: {
  },
  data() {
    return {
      detailInfo: {}, //详细信息
    };
  },
  computed: {
    // 送货单行信息
    getOrderLineInfoColumns() {
      const columns = [
        // {
        //   fieldName: "'行号",
        //   fieldCode: "displayLineNum",
        //   langCode: "sinv.common.model.common.asnLineNum",
        // },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.customer").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierName").$D("公司"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.orderTypeName").$D("订单类型"),
          fieldCode: "orderTypeName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.agentId").$D("采购员"),
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.organizationName").$D("收货组织"),
          fieldCode: "invOrganizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipToLocationAddress").$D("收货地点"),
          fieldCode: "shipToThirdPartyAddress",
        },
        {
          fieldName: this.$T("sinv.common.model.common.inventoryName").$D("库房"),
          fieldCode: "inventoryName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.locationName").$D("库位"),
          fieldCode: "locationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.actualReceiverName").$D("送达方"),
          fieldCode: "shipToThirdPartyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
          fieldCode: "needByDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promiseDeliveryDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
          fieldCode: "immedShippedFlagMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.sourcePlatform").$D("订单来源"),
          fieldCode: "poSourcePlatformMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayReleaseNum").$D("发放号"),
          fieldCode: "releaseNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
          fieldCode: "displayLineNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.matchQuantity").$D("匹配数量"),
          fieldCode: "quantity",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shippableQuantity").$D("可发货数量"),
          fieldCode: "canAsnQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.receivedQuantity").$D("净接收"),
          fieldCode: "netReceivedQuantity",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shippedQuantity").$D("累计发货"),
          fieldCode: "shippedQuantity",
        },
        {
          fieldName: this.$T("sinv.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.contactsInfo").$D("联系人信息"),
          fieldCode: "shipToThirdPartyContact",
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.number").$D("商品编码"),
          fieldCode: "productNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.name").$D("商品名称"),
          fieldCode: "productName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.catalog.name").$D("商品目录"),
          fieldCode: "catalogName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
        },
      ];

      return columns;
    },
    btnArr() {
      return [ {
        title: this.$T("hipspfm.createDelivery.view.tab.cretae").$D("创建"),
        handler: this.createDelivery
      } ];
    }
  },
  mounted() {
    this.detailInfo = this.$route.params.item;
  },
  methods: {
    // 创建送货单
    createDelivery() {
      this.$loading.show();
      createDeliveryApi([ this.detailInfo ]).then((res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          const asnHeaderId = res[0].asnHeaderId;

          this.$router.replace({ name: "YongXiangDeliveryDetail", query: { asnHeaderId } });
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
</style>
