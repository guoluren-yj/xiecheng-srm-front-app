<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="lineDataDs"
      :columns="getLineDataColumns"
      @itemClick="onItemClick"/>
    <srm-popup
      :visible.sync="visibleFull"
      height="100%"
      show-back>
      <srm-form :data-set="headerDataDs" :columns="getHeaderInfoColumns" />
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { lineDs, headerDs } from "./datasource";
export default {
  modules: [ "scux.PackingMaterial", "scux.AdvanceRawMaterials" ],
  name: "PackingMaterial",
  data() {
    return {
      lineDataDs: new DataSet(lineDs()),
      headerDataDs: new DataSet(headerDs()),
      visibleFull: false,
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              <span style="color:#276EF1;">{$T("scux.PackingMaterial.model.tqdetail").$D("提前交货详情")}</span>
            </SrmListHeader>
          ,
        },

        {
          fieldCode: "orderTypeName",
        },
        {
          fieldCode: "processNum",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "advanceDeliveryQuantitys",
        },
        {
          fieldCode: "requestedDate",
        },
        {
          fieldCode: "deliveryDate",
        },
        {
          fieldCode: "purchaseManagerWorkFlowOpinion",
        },
        {
          fieldCode: "reasonTypeMeaning",
        },
        {
          fieldCode: "detailsReason",
        },
      ];
    },
    getHeaderInfoColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              <span style="color:#276EF1;">{$T("scux.PackingMaterial.model.tqdetail").$D("提前交货详情")}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "serialNumber",
        },
        {
          fieldCode: "orderTypeName",
        },
        {
          fieldCode: "requestDate",
        },
        {
          fieldCode: "processNum",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "poNum",
        },
        {
          fieldCode: "poLineNum",
        },
        {
          fieldCode: "businessDate",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "specification",
        },
        {
          fieldCode: "requestedDate",
        },
        {
          fieldCode: "attributeDate3",
        },
        {
          fieldCode: "deliveryDate",
        },
        {
          fieldCode: "orderNum",
        },
        {
          fieldCode: "advanceDeliveryQuantity",
        },
        {
          fieldCode: "boxQuantity",
        },
        {
          fieldCode: "palletQuantity",
        },
        {
          fieldCode: "reasonTypeMeaning",
        },
        {
          fieldCode: "detailsReason",
        },
        {
          fieldCode: "purchaseAgentName",
        },
        {
          fieldCode: "planOpinion",
        },
        {
          fieldCode: "purchaseManagerOpinion",
        },
      ];
    },
  },
  methods: {
    onItemClick() {
      this.visibleFull = true;
      const { orderDateHId } = this.lineDataDs.current.data;
      this.headerDataDs.addPathParameter("orderDateHId", orderDateHId);
      this.headerDataDs.setQueryParameter({ "orderDateHId": orderDateHId });

      this.headerDataDs.refresh();
    },
  },
};
</script>