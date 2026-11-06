<template>
  <!-- 发货工作台 -->
  <div>
    <srm-scroll-tab ref="srmScrollTab">
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.basicInfos').$D('基本信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="formDataSet"
                  :columns="getBasicColumns()"/>
      </srm-scroll-tab-item>
      <!-- 商品信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.lineInfos').$D('行信息')" :show-title="false" style="position: relative;">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('small.common.view.panel.lineInfos').$D('行信息') }}
        </div>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto;border-top: 1px solid #f0f2f5;"
                  :show-bottom-bar="false"
                  :data-set="shopDataSet"
                  :columns="getLineInfoColumns()"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { formDs, shopDs } from "./datasource/commonDs";
import { getHeadInfoApi } from "./api";
import Mixin from "./mixin/DetailColumns";
export default {
  modules: [ "small.common", "hipspfm.common", "smbl.common", "slod.common" ],
  name: "ScuxCentralizeManageForm",
  mixins: [ Mixin ],
  props: {
    parameters: {
      type: Object
    }
  },
  data() {
    return {
      // 基本信息
      formDataSet: new DataSet(formDs()),
      // 行信息
      shopDataSet: new DataSet(shopDs()),
      cartIds: "",
      companyId: "",
      ownerId: "",
      relationIds: "",
      unitId: "",
    };
  },
  computed: {},
  async beforeMount() {
    const { cartIds, companyId, ownerId, relationIds, unitId } = this.parameters;
    this.$loading.show();
    this.cartIds = cartIds;
    this.companyId = companyId;
    this.ownerId = ownerId;
    this.relationIds = relationIds;
    this.unitId = unitId;
    await this.searchHead();
  },
  methods: {
    async searchHead() {
      // 查询头信息
      const params = {
        cartIds: this.cartIds,
        companyId: this.companyId,
        ownerId: this.ownerId,
        relationIds: this.relationIds,
        unitId: this.unitId,
        action: "detail",
      };
      this.headInfo = await getHeadInfoApi(params);
      this.formDataSet?.setData([ { ...this.headInfo } ]);
      this.shopDataSet?.setData(this?.headInfo?.lineList);
      this.$loading.hide();
    },
  }
};
</script>

<style lang="stylus" scoped>
.attachment {
  height 28px;
  font-size 14px;
  color #333333;
  line-height 20px;

  .icon-other {
    font-size 28px;
    color #FEBF43;
    margin-right 8px;
  }

  .icon-chevron-right {
    font-size 16px;
    color val(--color-font-default-b);
  }
  >>> .srm-button-primary {
    color #333 !important;
  }
}
>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;
}

.line-filter {
  .list-tool-tab {
    width: 200px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
  .icon-ambulance {
    color var(--font-color-primary);
    margin-right: 4px;
  }
}

.text{
  font-weight: 600;
}
.tag-ste{
  padding: 2px 4px !important;
  font-size: 12px !important;
}
.title-text{
  font-weight:400;
}
</style>