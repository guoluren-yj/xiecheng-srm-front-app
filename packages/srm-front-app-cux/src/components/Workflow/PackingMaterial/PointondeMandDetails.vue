<template>
  <div>
    <div style="height: 100vh; overflow-y: auto">
      <div class="detail-wrap create-receive-detail-scroll-el">
        <div class="detail-wrap create-receive-detail-scroll-el">
          <srm-list
            :data-set="listDs"
            :columns="getHeaderInfoColumns"
            @itemClick="onItemClick"/>
          <srm-popup
            :visible.sync="visibleFull"
            height="90%"
            show-back
            @onClose="handClose">
            <srm-form :data-set="headerDataDs" :columns="getHeaderInfoColumn" />
          </srm-popup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { lineDs, headerDs } from "./datasource";
import { saveApi, fetchOpinion } from "./api";
export default {
  modules: [ "scux.PackingMaterialDetails", "scux.PackingMaterial", "scux.AdvanceRawMaterials" ],
  name: "PackingMaterialDetails",
  components: {},
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    const { orderType, editFlag } = this.parameters;
    return {
      listDs: new DataSet(lineDs(orderType, this.changeReqId)),
      headerDataDs: new DataSet(headerDs(orderType)),
      visibleFull: false,
      orderType,
      editFlag,
    };
  },
  computed: {
    // 基础信息list
    getHeaderInfoColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              <span style="color:#276EF1;">
                {this.orderType === "delay" ?
                  $T("scux.PackingMaterial.model.yc").$D("延迟交货详情") :
                  $T("scux.PackingMaterial.model.tq").$D("提前交货详情")}
              </span>
            </SrmListHeader>
          ,
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
          fieldCode: "itemName",
        },
        {
          fieldCode: "orderNum",
        },
        {
          fieldCode:
            this.orderType === "delay" ?
              "delayDeliveryQuantity" :
              "advanceDeliveryQuantity",
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
    getHeaderInfoColumn() {
      // 弹框
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              <span style="color:#276EF1;">
                {this.orderType === "delay" ?
                  $T("scux.PackingMaterialDetails.model.ycy").$D(
                    "延迟交货详情页"
                  ) :
                  $T("scux.PackingMaterialDetails.model.tqy").$D(
                    "提前交货详情页"
                  )}
              </span>
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
        this.orderType === "delay" && {
          fieldCode: "orderNum",
        },
        this.orderType === "delay" && {
          fieldCode: "delayDeliveryQuantity",
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
        this.orderType === "delay" && {
          fieldCode: "requestedCycle",
        },
        this.orderType === "delay" && {
          fieldCode: "deliveryCycle",
        },
        this.orderType === "delay" && {
          fieldCode: "produceCycle",
        },
        this.orderType === "delay" && {
          fieldCode: "reasonTypeMeaning",
        },
        this.orderType === "delay" && {
          fieldCode: "detailsReason",
        },
        // this.orderType === "delay" && {
        //   fieldCode: "purchaseAgentName",
        // },
        // this.orderType === "delay" && {
        //   fieldCode: "planOpinion",
        // },
        // this.orderType === "delay" && {
        //   fieldCode: "purchaseManagerOpinion",
        // },
        this.orderType !== "delay" && {
          fieldCode: "orderNum",
        },
        this.orderType !== "delay" && {
          fieldCode: "advanceDeliveryQuantity",
        },
        this.orderType !== "delay" && {
          fieldCode: "boxQuantity",
        },
        this.orderType !== "delay" && {
          fieldCode: "palletQuantity",
        },
        this.orderType !== "delay" && {
          fieldCode: "reasonTypeMeaning",
        },
        this.orderType !== "delay" && {
          fieldCode: "detailsReason",
        },
        {
          fieldCode: "planOpinion",
          fieldType: this.editFlag === "1" ? "INPUT" : "TEXT",
        },
        {
          fieldCode: "purchaseManagerOpinion",
          fieldType: this.editFlag === "1" ? "INPUT" : "TEXT",
        },
      ];
    },
  },
  mounted() {
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.listDs.addPathParameter("orderDateHId", this.changeReqId);
      this.listDs.addPathParameter("orderType", this.orderType);

      await this.listDs.refresh();
      if (this.listDs && this.listDs.current) {
        const params = { parmType: "order", parmKeyId: this.changeReqId };
        const headInfo = await fetchOpinion(params);
        if (headInfo) {
          this.listDs.records.forEach((item) => {
            item.set("purchaseManagerWorkFlowOpinion", headInfo.purchaseManagerWorkFlowOpinion);
          });
        }
      }
    },
    onItemClick() {
      const { orderDateLId } = this.listDs.current.data;
      this.headerDataDs.setQueryParameter({
        orderDateLId: orderDateLId,
        type: 1,
      });
      this.headerDataDs.refresh();
      this.visibleFull = true;
    },
    handClose() {
      return new Promise((resolve, reject) => {
        this.editFlag === "1" &&
          saveApi({
            jalaOrderDateLList: this.headerDataDs.toData(),
          }).then((res) => {
            if (res && res.failed) {
              reject(false);
            }
            resolve(true);
          });
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.create-receive-detail-scroll-el {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 35px;

  .create-receive-detail-button {
    margin-right: 10px;
  }
}

.line-filter {
  display: flex;
  justify-content: space-between;
  color: var(--font-color-primary);
  font-size: 18px;
  font-weight: 600;
  padding: 13px;
}

.srm-list-inspection-line {
  white-space: break-spaces;
}

.bottom-receive-box {
  border-top: 1px solid #ddd;
  padding-top: 21px;
}

.historyLook {
  margin-left: 5px;
}

.photos {
  height: 250px;
}
</style>
