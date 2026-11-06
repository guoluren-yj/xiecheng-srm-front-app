<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.assetCodeRequest.view.title.baseInfo').$D('基础信息')">
        <srm-form style="padding:10px 15px 10px 15px;margin-bottom: 0px;" :data-set="basicInfoDs" :columns="getHeaderColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.assetCodeRequest.view.title.assetDetailInfo').$D('资产及卡片行信息')">
        <srm-list
          :scrollable="false"
          :data-set="businessInfoDs"
          :columns="getBusinessColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import Mixin from "./Mixin";
import { basicInfo, businessInfo } from "./dataSource";

export default {
  modules: [ "hipspfm.workFlow", "hzero.common", "scux.assetCodeRequest" ],
  name: "AssetCodeRequest",
  mixins: [ Mixin ],
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
      basicInfoDs: new DataSet(basicInfo()),
      businessInfoDs: new DataSet(businessInfo()),
    };
  },
  beforeMount() {
  },
  mounted() {
    this.basicInfoDs.addQueryParameter("assetHeaderId", this.changeReqId);
    this.basicInfoDs.refresh();
    this.businessInfoDs.addQueryParameter("assetHeaderId", this.changeReqId);
    this.businessInfoDs.refresh();
  },
  afterMount() {
  },
  methods: {
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}

.line-button {
  display: flex;
  margin-top: 18px;
  height: 24px;
  z-index: 999;
}

.create-receive-detail-define{
  height:100%;
  .create-receive-detail-define-button{
    position:relative;
    top:30px;
    margin-left:15px;
    margin-right:15px;
  }
}
</style>
