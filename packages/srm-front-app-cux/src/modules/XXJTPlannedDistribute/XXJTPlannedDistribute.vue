<template>
  <div style="height: 100vh">
    <srm-tab ref="tabView" no-all @changeTab="onIndexChange">
      <srm-tab-pane
        :label="$T('scux.XXJTPlannedDistribute.view.title.Audited').$D('已审核')">
        <div v-if="bidInfoDataSet.data.length > 0" style="height: 100vh;padding-top: 16px;">
          <srm-list
            :data-set="bidInfoDataSet"
            :columns="getBidColumns"
            @itemClick="jumpItemDetails"/>
        </div>
        <div v-else class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
      </srm-tab-pane>
      <srm-tab-pane
        :label="$T('scux.XXJTPlannedDistribute.view.title.bidding.manager.assigned').$D('待分配招标经理')">
        <div v-if="bidInfoDataSet.data.length > 0" style="height: 100vh;padding-top: 16px;">
          <srm-list
            :data-set="bidInfoDataSet"
            :columns="getBidColumns"
            @itemClick="jumpItemDetails"/>
        </div>
        <div v-else class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
      </srm-tab-pane>
      <srm-tab-pane
        :label="$T('scux.XXJTPlannedDistribute.view.title.confirmed').$D('待确认')">
        <div v-if="bidInfoDataSet.data.length > 0" style="height: 100vh;padding-top: 16px;">
          <srm-list
            :data-set="bidInfoDataSet"
            :columns="getBidColumns"
            @itemClick="jumpItemDetails"/>
        </div>
        <div v-else class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
      </srm-tab-pane>
    </srm-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { bidInfoDs } from "./dataSource/index";

export default {
  modules: [ "scux.XXJTPlannedDistribute", "hipspfm.workFlow" ],
  name: "XXJTPlannedDistribute",
  data() {
    return {
      bidInfoDataSet: new DataSet(bidInfoDs()),
    };
  },
  computed: {
    getBidColumns() {
      return [
        {
          fieldCode: "biddingNum",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.ouName").$D("项目公司"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.subjectName").$D("项目名称"),
          fieldCode: "subjectName",
        },
        {
          fieldName: this.$T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.budgetAmout").$D("预算金额(万元)"),
          fieldCode: "budgetAmout",
        },
        {
          fieldName: this.$T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.unitCodeMeaning").$D("招标部门"),
          fieldCode: "unitCodeMeaning",
        },
        {
          fieldName: this.$T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.employeeName").$D("招标经理"),
          fieldCode: "employeeName",
        },
        {
          fieldName: this.$T("scux.XXJTPlannedDistribute.model.XXJTPlannedDistribute.biddingPlanTime").$D("计划开标时间"),
          fieldCode: "biddingPlanTime",
        },
      ];
    },
  },
  beforeMount() {
    this.onIndexChange(0);
  },
  methods: {
    // 页签切换展示对应的数据
    onIndexChange({ activeKey }) {
      if (activeKey === 0) {
        this.bidInfoDataSet.setQueryParameter({ biddStatus: "03" });
      } else if (activeKey === 1) {
        this.bidInfoDataSet.setQueryParameter({ biddStatus: "05" });
      } else {
        this.bidInfoDataSet.setQueryParameter({ biddStatus: "08" });
      }
      this.bidInfoDataSet.refresh();
    },
    // 跳转明细
    jumpItemDetails(item) {
      const { data = {} } = item || {};
      this.$router.push({
        name: "XXJTPlannedDistributeDetails",
        query: { biddingNum: data.biddingNum },
      });
    },
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
</style>