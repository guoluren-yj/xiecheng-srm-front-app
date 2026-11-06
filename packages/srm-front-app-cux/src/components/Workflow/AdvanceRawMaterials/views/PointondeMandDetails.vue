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
            <srm-form :data-set="headerDataDs" :columns="getLook" />
          </srm-popup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { headerDs, lineDs } from "../datasource/index";
import { saveApi, fetchOpinion } from "../api";
export default {
  modules: [ "scux.AdvanceRawMaterialsDelay", "scux.AdvanceRawMaterials" ],
  name: "AdvanceRawMaterialsDetails",
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
      headerDataDs: new DataSet(headerDs(orderType)),
      listDs: new DataSet(lineDs(orderType, this.changeReqId)),
      visibleFull: false,
      orderType,
      editFlag,
      datas: [],
    };
  },
  computed: {
    getHeaderInfoColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: () =>
            <SrmListHeader>
              <span style="color:#276EF1;">
                {this.orderType === "delay" ?
                  $T("scux.AdvanceRawMaterialsDelay.model.ycy").$D(
                    "延迟交货(原料)详情页"
                  ) :
                  $T("scux.AdvanceRawMaterialsDelay.model.tqy").$D(
                    "提前交货(原料)详情页"
                  )}
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
        this.orderType === "delay" && {
          fieldCode: "delayDeliveryQuantity",
        },
        this.orderType !== "delay" && {
          fieldCode: "advanceDeliveryQuantity",
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
        this.orderType === "delay" && {
          fieldCode: "reasonTypeMeaning",
        },
        this.orderType === "delay" && {
          fieldCode: "detailsReason",
        },
      ];
    },
    getLook() {
      return [
        {
          fieldCode: "serialNumber",
          fieldName: $T("scux.AdvanceRawMaterials.model.serialNumber").$D(
            "序号"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "orderTypeName",
        },
        {
          fieldCode: "requestDate",
          fieldName: $T("scux.AdvanceRawMaterials.model.requestDate").$D(
            "申请日期"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "processNum",
          fieldName: $T("scux.AdvanceRawMaterials.model.processNum").$D(
            "流程号"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T(
            "scux.AdvanceRawMaterials.model.supplierCompanyName"
          ).$D("供应商名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "poNum",
          fieldName: $T("scux.AdvanceRawMaterials.model.poNum").$D("订单号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "poLineNum",
          fieldName: $T("scux.AdvanceRawMaterials.model.poLineNum").$D("行号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "sapPoNum",
          fieldName: $T("scux.AdvanceRawMaterials.model.sapPoNum").$D(
            "sap订单号"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "businessDate",
          fieldName: $T("scux.AdvanceRawMaterials.model.businessDate").$D(
            "下单日期"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("scux.AdvanceRawMaterials.model.itemCode").$D(
            "物料编码"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemName",
          fieldName: $T("scux.AdvanceRawMaterials.model.itemName").$D(
            "物料名称"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "specification",
          fieldName: $T("scux.AdvanceRawMaterials.model.specification").$D(
            "规格"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "secretLevel",
          fieldName: $T("scux.AdvanceRawMaterials.model.secretLevel").$D(
            "保密级别"
          ),
          fieldType: "TEXT",
        },
        this.orderType !== "delay" && {
          fieldCode: "requestedDate",
          fieldName: $T("scux.AdvanceRawMaterials.model.requestedDates").$D(
            "原交货日期"
          ),
          fieldType: "TEXT",
        },
        this.orderType !== "delay" && {
          fieldCode: "deliveryDate",
          fieldName: $T("scux.AdvanceRawMaterials.model.deliveryDate").$D(
            "现交货日期"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "orderNum",
          fieldName: $T("scux.AdvanceRawMaterials.model.orderNum").$D("订单量"),
          fieldType: "TEXT",
        },

        this.orderType === "delay" && {
          fieldCode: "delayDeliveryQuantity",
        },
        this.orderType === "delay" && {
          fieldCode: "requestedDate",
          fieldName: $T("scux.AdvanceRawMaterials.model.requestedDates").$D(
            "原交货日期"
          ),
          fieldType: "TEXT",
        },
        this.orderType === "delay" && {
          fieldCode: "deliveryDate",
          fieldName: $T("scux.AdvanceRawMaterials.model.deliveryDate").$D(
            "现交货日期"
          ),
          fieldType: "TEXT",
        },
        this.orderType !== "delay" && {
          fieldCode: "advanceDeliveryQuantity",
          fieldName: $T(
            "scux.AdvanceRawMaterials.model.advanceDeliveryQuantity"
          ).$D("提前交货数量"),
          fieldType: "TEXT",
        },
        this.orderType === "delay" && {
          fieldCode: "requestedCycle",
        },
        this.orderType === "delay" && {
          fieldCode: "deliveryCycle",
        },
        this.orderType === "delay" && {
          fieldCode: "produceCycle",
          fieldName: $T("scux.AdvanceRawMaterials.model.produceCycle").$D(
            "无备货生产周期"
          ),
          fieldType: "TEXT",
        },
        this.orderType === "delay" && {
          fieldCode: "reasonTypeMeaning",
          fieldName: $T(
            "scux.AdvanceRawMaterials.model.reasonTypeMeaningdelay"
          ).$D("延迟原因类别"),
          fieldType: "TEXT",
        },

        this.orderType !== "delay" && {
          fieldCode: "boxQuantity",
          fieldName: $T("scux.AdvanceRawMaterials.model.boxQuantity").$D(
            "箱数"
          ),
          fieldType: "TEXT",
        },
        this.orderType !== "delay" && {
          fieldCode: "palletQuantity",
          fieldName: $T("scux.AdvanceRawMaterials.model.palletQuantity").$D(
            "栈板数"
          ),
          fieldType: "TEXT",
        },
        this.orderType !== "delay" && {
          fieldCode: "reasonTypeMeaning",
          fieldName: $T("scux.AdvanceRawMaterials.model.reasonTypeMeanings").$D(
            "提前原因类别"
          ),
          fieldType: "TEXT",
        },

        {
          fieldCode: "detailsReason",
          fieldName: $T("scux.AdvanceRawMaterials.model.detailsReason").$D(
            "详细原因"
          ),
          fieldType: "TEXT",
        },
        {
          fieldCode: "planOpinion",
          fieldName: $T("scux.AdvanceRawMaterials.model.planOpinion").$D(
            "计划意见"
          ),
          fieldType: this.editFlag === "1" ? "INPUT" : "TEXT",
        },
        {
          fieldCode: "purchaseManagerOpinion",
          fieldName: $T(
            "scux.AdvanceRawMaterials.model.purchaseManagerOpinion"
          ).$D("采购经理意见"),
          fieldType: this.editFlag === "1" ? "INPUT" : "TEXT",
        },
      ];
    },
  },
  created() {
    this.initData();
  },
  mounted() {
  },
  methods: {
    async initData() {
      this.listDs.addPathParameter("orderDateHId", this.changeReqId);

      await this.listDs.refresh();
      if (this.listDs && this.listDs.current) {
        const params = { parmType: "material", parmKeyId: this.changeReqId };
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
        type: 2,
      });
      this.headerDataDs.refresh();
      this.visibleFull = true;
    },
    handClose() {
      return new Promise((resolve, reject) => {
        const list = this.headerDataDs.toData();
        const datas = list.map((item) => ({
          ...item,
          orderType: "delay",
        }));
        this.editFlag === "1" &&
          saveApi({
            jalaMaterialDataLS: datas,
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
