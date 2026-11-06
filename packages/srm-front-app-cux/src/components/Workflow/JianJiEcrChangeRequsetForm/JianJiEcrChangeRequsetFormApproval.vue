<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.ecrChangeRequset.view.title.baseInfo').$D('基础信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <srm-form :data-set="headerDataDs" :columns="getHeaderInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.ecrChangeRequset.view.title.itemData').$D('变更对象信息')">
        <srm-list :data-set="itemDataDs" :columns="itemColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.ecrChangeRequset.view.title.supplierDs').$D('推荐供应商清单')">
        <srm-list :data-set="supplierDataDs" :columns="supplierColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { itemDs, headerDs, supplierDs } from "./datasource";
export default {
  modules: ["scux.ecrChangeRequset"],
  name: "EcrChangeRequset",
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
    return {
      itemDataDs: new DataSet(itemDs()),
      headerDataDs: new DataSet(headerDs()),
      supplierDataDs: new DataSet(supplierDs()),
    };
  },
  computed: {
    // 基础信息
    getHeaderInfoColumns() {
      return [
        {
          fieldCode: "ecrNum",
        },
        {
          fieldCode: "name",
        },
        {
          fieldCode: "importanceLevel",
        },
        {
          fieldCode: "changeClassification",
        },
        {
          fieldCode: "changeModel",
        },
        {
          fieldCode: "changeMmodelStatus",
        },
        {
          fieldCode: "parametersAndAppearance",
        },
        {
          fieldCode: "priorityLevel"
        },
        {
          fieldCode: "statusMeaning",
        },
        {
          fieldCode: "changePurpose",
        },
        {
          fieldCode: "changeDescription",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    itemColumns() {
      return [
        {
          fieldCode: "changeType",
        },
        {
          fieldCode: "drawingNo",
        },
        {
          fieldCode: "name",
        },
        {
          fieldCode: "changeDescription",
        },
        {
          fieldCode: "needCountInventoryFlag",
        },
        {
          fieldCode: "finishedProduct",
        },
        {
          fieldCode: "semiFinishedProducts",
        },
        {
          fieldCode: "accessory",
        },
        {
          fieldCode: "inGarage",
        },
        {
          fieldCode: "makingCars",
        },
        {
          fieldCode: "outGarage",
        },
        {
          fieldCode: "purchaseAgentIdMeaning",
        },
      ];
    },
    supplierColumns() {
      return [
        {
          fieldCode: "drawingNo",
        },
        {
          fieldCode: "name",
        },
        {
          fieldCode: "purchaser",
        },
        {
          fieldCode: "approvalStatusMeaning",
        },
        {
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "feedbackStatusMeaning",
        },
        {
          fieldCode: "inventorySituation",
        },
        {
          fieldCode: "creationMethodMeaning",
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
      this.headerDataDs.setQueryParameter({ id: this.changeReqId });
      this.itemDataDs.setQueryParameter({ reqId: this.changeReqId });
      this.supplierDataDs.setQueryParameter({ reqId: this.changeReqId });
      this.headerDataDs.refresh();
      this.itemDataDs.refresh();
      this.supplierDataDs.refresh();
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
