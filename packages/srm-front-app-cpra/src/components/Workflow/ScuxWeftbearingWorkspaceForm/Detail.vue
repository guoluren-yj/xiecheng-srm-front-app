<template>
  <div>
    <srm-scroll-tab ref="srmScrollTab">
      <!-- 基础信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.cuxbasicInfos').$D('基础信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="formDataSet"
                  :columns="getBasicColumns(statusFlag)"/>
      </srm-scroll-tab-item>
      <!-- 结算行信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.cuxlineInfos').$D('结算明细信息')" :show-title="false" style="position: relative;">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('small.common.view.panel.cuxlineInfos').$D('结算明细信息') }}
        </div>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto;border-top: 1px solid #f0f2f5;"
                  :show-bottom-bar="false"
                  :data-set="lineDataSet"
                  :columns="getLineInfoColumns(statusFlag)"/>
      </srm-scroll-tab-item>
      <!-- 财务信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.cuxsstaInfos').$D('财务信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="formDataSet"
                  :columns="getSstaColumns(statusFlag)"/>
      </srm-scroll-tab-item>
      <!-- 合同信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.pcInfos').$D('合同执行明细')" :show-title="false" style="position: relative;">
        <div class="srm-scroll-tab-item-title line-filter">
          {{ $T('small.common.view.panel.pcInfos').$D('合同执行明细') }}
        </div>
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto;border-top: 1px solid #f0f2f5;"
                  :show-bottom-bar="false"
                  :data-set="pcDataSet"
                  :columns="getPcInfoColumns(statusFlag)"/>
      </srm-scroll-tab-item>
      <!-- 附件信息 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.cuxattrInfos').$D('支撑性文件')" >
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="formDataSet"
                  :columns="getAttrmentchColumns(statusFlag)"/>
      </srm-scroll-tab-item>
      <!-- 操作记录 -->
      <srm-scroll-tab-item :label="$T('small.common.view.panel.cuxOperation').$D('操作记录')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto;border-top: 1px solid #f0f2f5;"
                  :show-bottom-bar="false"
                  :data-set="opartionDataSet"
                  :columns="getOprationColumns(statusFlag)"/>
      </srm-scroll-tab-item>
      <!-- 审批记录 -->
      <!-- <srm-scroll-tab-item :label="$T('small.common.view.panel.cuxApproval').$D('审批记录')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto;border-top: 1px solid #f0f2f5;"
                  :show-bottom-bar="false"
                  :data-set="approvalDataSet"
                  :columns="getApprovalColumns(statusFlag)"/>
      </srm-scroll-tab-item> -->
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { formDs, lineDs, pcDs, opartionDs } from "./datasource/commonDs";
import { getHeadInfoApi, getLineInfoApi } from "./api";
import Mixin from "./mixin/DetailColumns";
export default {
  modules: [ "small.common", "hipspfm.common", "smbl.common", "slod.common" ],
  name: "ScuxWeftbearingWorkspaceForm",
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
      lineDataSet: new DataSet(lineDs()),
      pcDataSet: new DataSet(pcDs()),
      opartionDataSet: new DataSet(opartionDs()),
      // approvalDataSet: new DataSet(approvalDs()),
      id:"",
      headInfo: "",
      statusFlag: "",
      lineInfo: [],
    };
  },
  computed: {},
  async beforeMount() {
    const { id } = this.parameters;
    console.log("this.$route", this.$route);
    console.log("this.$route.query", this.$route.query);
    this.$loading.show();
    this.id = id;
    await this.searchHead();
    await this.queryLineInfo();
  },
  methods: {
    async searchHead() {
      // 查询头信息
      console.log("this.id", this.id);
      const params = { id: this.id };
      this.headInfo = await getHeadInfoApi(params);
      this.statusFlag = this.headInfo.status;
      this.formDataSet?.setData([ { ...this.headInfo } ]);
      // this.lineDataSet.addPathParameter("serviceFeeSettleId", this.id);
      // this.lineDataSet.refresh();
      this.pcDataSet.addPathParameter("serviceFeeSettleId", this.id);
      this.pcDataSet.refresh();
      this.opartionDataSet.addPathParameter("serviceFeeSettleId", this.id);
      this.opartionDataSet.refresh();
      // this.approvalDataSet.addPathParameter("serviceFeeSettleId", this.id);
      // this.approvalDataSet.refresh();
      this.$loading.hide();
    },
    async queryLineInfo() {
      const params = { serviceFeeSettleId: this.id };
      this.lineInfo = await getLineInfoApi(params);
      console.log("this.lineInfo", this.lineInfo);
      this.lineDataSet?.setData([ ...this?.lineInfo?.content || [] ]);
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