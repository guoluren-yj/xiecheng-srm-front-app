<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.massProductionNotice.view.title.baseInfo').$D('基础信息')">
        <div style="padding-top: 16px;">
          <srm-form :data-set="headerDataDs" :columns="getHeaderInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.massProductionNotice.view.title.itemData').$D('新物料明细')">
        <srm-list :data-set="lineInfoDs" :columns="lineColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, headerInfoDs } from "./dataSource/indexDs";
export default {
  modules: [ "scux.massProductionNotice", "hipspfm.workFlow" ],
  name: "JianJiMassProductionNotice",
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
      headerDataDs: new DataSet(headerInfoDs()),
      lineInfoDs: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    // 基础信息
    getHeaderInfoColumns() {
      return [
        {
          fieldCode: "noticeNum",
        },
        {
          fieldCode: "statusMeaning",
        },
        {
          fieldCode: "dataSourceMeaning",
        },
        {
          fieldCode: "icNum",
        },
        {
          fieldCode: "itemCertificationDate",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "createdByMeaning",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "title",
        },
        {
          fieldCode: "model",
        },
        {
          fieldCode: "fileNumber",
        },
        {
          fieldCode: "applicationContent",
        },
        {
          fieldCode: "attachmentUuid",
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "supplierNum",
        },
        {
          fieldCode: "model",
        },
        {
          fieldCode: "attachmentUuid",
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
      this.lineInfoDs.setQueryParameter({ headerId: this.changeReqId });
      this.headerDataDs.refresh();
      this.lineInfoDs.refresh();
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
