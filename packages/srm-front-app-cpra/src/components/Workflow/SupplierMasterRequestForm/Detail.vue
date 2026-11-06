<template>
  <div ref="SupplierMasterRequestForm" class="create-receive-detail-container">
    <div class="create-receive-detail-scroll-el">
      <srm-scroll-tab >
        <srm-scroll-tab-item :label="$T('scux.supplierMasterRequestForm.view.tab.baseInfo').$D('基本信息')">
          <div @click="onBasicItemClick()">
            <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headerDs" :columns="getBasicColumns()"/>
          </div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('scux.supplierMasterRequestForm.view.tab.lineDetail').$D('变更明细')" :show-title="false">
          <srm-flex style="background:#f0f2f5;height: 54px " justify="between">
            <div style="margin-left: 15px ;font-family: PingFangSC-Semibold;font-size: 16px;color: #333333;font-weight: 600;">{{ $T('scux.supplierMasterRequestForm.view.tab.lineDetail').$D('变更明细') }}</div>
          </srm-flex>
          <srm-list :show-bottom-bar="false" :auto-hide-bottom="true" :scrollable="false" :data-set="lineDs"
                    :columns="getLinesColumns()" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { headerDs, lineDs } from "./datasource/detailDs";
import Columns from "./mixin/Columns";

export default {
  name: "SupplierMasterRequestForm",
  mixins: [ Columns ],
  props: {
    parameters: {
      type: Object
    }
  },
  modules: [ "scux.supplierMasterRequestForm", "hzero.common" ],
  data() {
    return {
      id: "",
      currentTab :null,
      headerDs: new DataSet(headerDs(this)),
      lineDs: new DataSet(lineDs(this)),
    };
  },
  computed: {},
  async beforeMount() {
    const { id = "" } = this.parameters;
    console.log("id", id);
    this.id = id;
    this.refresh(id);
  },
  async mounted() { },
  methods: {
    refresh(id) {
      this.headerDs.addPathParameter("id", id);
      this.lineDs.addPathParameter("id", id);
      this.headerDs.refresh();
      this.lineDs.refresh();
    },
  },
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"
.create-receive-detail-container {
  height 100vh;
  .create-receive-detail-scroll-el {
    height 100%;
    overflow-y scroll;
    overflow-x hidden;
    padding-bottom 80px;
    .create-receive-detail-button {
      margin-right 10px;
    }
    .override-btn-group {
      display: flex;
      >>> .srm-button {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
>>> .srm-upload{
  color:var(--font-color-white);
}
</style>
