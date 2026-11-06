<template>
  <!-- 设置容器高度 处理详情页返回-列表页高度异常 -->
  <div style="height: 100vh">
    <srm-tab-bar
      slot="filter"
      display="auto"
      :tabs="tabs"
      class="order-bench-tab"
      customize-code="SMBL.ORDER_WORKBENCH.TABS"
      :active-index="currentTabIdx"
      @indexChange="onTabIndexChange"/>
    <srm-list
      :data-set="getCurrentDs"
      :columns="getColumns(currentTab)"
      :customize-code="getCustomizeCode(currentTab)"
      :buttons="getButtons"
      :show-select-all="showSelectAll"
      :bottom-render="bottomRender"
      @itemClick="itemClick"/>
    <srm-bottom-handler v-if="visibleFlag" :btn-arr="getBottomButtons" type="tooltip"/>
  </div>
</template>
<script>
import { DataSet, $T } from "srm-mobile-ui";
// import { dateFormat } from "@/utils/index";
import {
  agreeApi,
  rejectApi,
  batchReleaseApi,
  cuxBatchSilentSigning,
} from "../api/index";
import {
  underApprovalDs,
  toBeReleasedDs,
  feedbackUnderReviewDs,
  allDs,
  getCustomizeCode,
} from "../datasource/index";
import { STATUS_COLOR_MAP } from "../components/utils/index";
import OrderWorkbenchMethod from "../../CUX_PART/Method/OrderWorkbenchMethod";
export default {
  modules: [
    "sodr.common",
    "hzero.common",
    "sodr.workspace",
    "hipspfm.createDelivery",
    "sodr.deliveryDateReview",
    "hipspfm.common",
    "slod.orderExecution",
    "smbl.common",
  ],
  name: "OrderWorkbenchList",
  extends: OrderWorkbenchMethod,
  data() {
    return {
      dataSet: {},
      currentTab: "underApproval",
      currentTabIdx: 0,
      tabs: [],
      showSelectAll: true,
      visibleFlag: false, // 按钮显示标识
    };
  },
  // 无关 事件、后端数据的
  computed: {
    getCurrentDs() {
      return this.dataSet[this.currentTab];
    },
    getButtons() {
      const { currentTab } = this;
      if (currentTab === "toBeReleased") {
        return [
          {
            name: "release",
            size: "small",
            fill: true,
            bordered: true,
            disabled: (recordList) => recordList.length === 0,
            text: this.$T("sodr.workspace.view.option.release").$D("发布"),
            callback: (recordList) => {
              this.action(
                "release",
                recordList.map((v) => v.toData())
              );
            },
          },
        ];
      } else if (currentTab === "feedbackUnderReview") {
        return [
          {
            name: "agree",
            size: "small",
            fill: true,
            disabled: (recordList) => recordList.length === 0,
            text: this.$T("sodr.workspace.view.button.agree").$D("同意"),
            callback: (recordList) => {
              this.action(
                "agree",
                recordList.map((v) => v.toData())
              );
            },
          },
          {
            name: "reject",
            type: "danger",
            size: "small",
            fill: true,
            disabled: (recordList) => recordList.length === 0,
            text: this.$T("sodr.workspace.view.button.return").$D("退回"),
            callback: (recordList) => {
              this.action(
                "reject",
                recordList.map((v) => v.toData())
              );
            },
          },
        ];
      }
      // 五菱埋点
      if (currentTab === "wulingSign") {
        return [
          {
            name: "release",
            size: "small",
            fill: true,
            bordered: true,
            disabled: (recordList) => recordList?.length === 0,
            text: "批量静默签",
            callback: (recordList) => {
              if (recordList.length > 20) {
                return this.$notification.open({
                  message: "批量静默签每批次最多支持20单订单",
                });
              }
              const data = (recordList.map((v) => v.toData()) || [])?.map(
                (i) => i.poHeaderId
              );
              this.$loading.show();
              cuxBatchSilentSigning(data)
                .then((res) => {
                  // eslint-disable-next-line no-empty
                  if (res && !res.failed) {
                    this.$notification.open({
                      message: this.$T("hzero.common.notification.success").$D(
                        "操作成功"
                      ),
                    });
                    this.getCurrentDs.editFlag = false;
                  }
                })
                .finally(() => {
                  this.getCurrentDs.refresh();
                  this.$loading.hide();
                });
            },
          },
        ];
      }
      return [];
    },
    getBottomButtons() {
      if (
        this.over$getBottomButtons &&
        typeof this.over$getBottomButtons === "function"
      ) {
        return this.over$getBottomButtons();
      }
      return [];
    }
  },
  beforeMount() {
    this.tabs = [
      {
        label: $T("sodr.workspace.view.tabPane.underApproval").$D("审批中"),
        code: "underApproval",
      },
      {
        label: $T("sodr.workspace.view.tabPane.toBeReleased").$D("待发布"),
        code: "toBeReleased",
      },
      {
        label: $T("sodr.workspace.view.tabPane.feedbackUnders").$D(
          "待反馈审核"
        ),
        code: "feedbackUnderReview",
      },
      { label: $T("sodr.workspace.view.tabPane.all").$D("全部"), code: "all" },
    ];
    this.dataSet = {
      all: new DataSet(this.getAllDs()),
      toBeReleased: new DataSet(toBeReleasedDs("toBeReleased")),
      underApproval: new DataSet(underApprovalDs("underApproval")),
      feedbackUnderReview: new DataSet(
        feedbackUnderReviewDs("feedbackUnderReview")
      ),
    };
    // 埋点操作
    if (this.over$befotMount && typeof this.over$befotMount === "function") {
      this.over$befotMount();
    }
  },
  activated() {
    this.dataSet[this.currentTab].refresh();
  },
  mounted() {
    this.dataSet[this.currentTab].refresh();
  },
  methods: {
    getCustomizeCode,
    onTabIndexChange(idx, oldIndex, code) {
      this.currentTabIdx = idx;
      this.currentTab = code;
      this.dataSet[this.currentTab].refresh();
    },
    getColumns(type) {
      if (type === "underApproval") {
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            render: (val, item) => {
              const statusCode = item.statusCode;
              return (
                <SrmListHeader>
                  <span>{item.displayPoNum}</span>
                  <SrmButton
                    rect
                    plain
                    slot="right"
                    style={{ fontWeight: "bold" }}
                    type={STATUS_COLOR_MAP[statusCode]}
                  >
                    {item.statusCodeMeaning}
                  </SrmButton>
                </SrmListHeader>
              );
            },
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
          },
          {
            fieldCode: "companyName",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
          },
        ];
      } else if (type === "toBeReleased") {
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            render: (val, item) => {
              const statusCode = item.statusCode;
              return (
                <SrmListHeader>
                  <span>{item.displayPoNum}</span>
                  <SrmButton
                    rect
                    plain
                    slot="right"
                    style={{ fontWeight: "bold" }}
                    type={STATUS_COLOR_MAP[statusCode]}
                  >
                    {item.statusCodeMeaning}
                  </SrmButton>
                </SrmListHeader>
              );
            },
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
          },
          {
            fieldCode: "companyName",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
          },
          {
            fieldCode: "poTypeCodeMeaning",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D(
              "订单类型"
            ),
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
          },
        ];
      } else if (type === "feedbackUnderReview") {
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            render: (val, item) => {
              const statusCode = item.statusCode;
              return (
                <SrmListHeader>
                  <span>{item.displayPoNum}</span>
                  <SrmButton
                    rect
                    plain
                    slot="right"
                    style={{ fontWeight: "bold" }}
                    type={STATUS_COLOR_MAP[statusCode]}
                  >
                    {item.statusCodeMeaning}
                  </SrmButton>
                </SrmListHeader>
              );
            },
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
          },
          {
            fieldCode: "companyName",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
          {
            fieldCode: "feedbackDate",
            fieldName: $T("sodr.workspace.model.common.feedbackDate").$D(
              "交期反馈时间"
            ),
            render: (val, record) => {
              const time = <span>{val}</span>;
              if (Number(record.unreadCount) > 0) {
                return (
                  <div>
                    {time}
                    <span style="color: #fd4b4b;margin-left: 15px;font-size: 10px;line-height: 18px;background: rgba(253, 75, 75, 0.1);border-radius: 2px;padding: 2px 8px;font-weight: normal;">
                      {this.$T("smbl.common.view.unread.count", [
                        Number(record.unreadCount),
                      ]).$D("{count}条未读消息")}
                    </span>
                  </div>
                );
              }
              return time;
            },
          },
        ];
      } else if (type === "all") {
        return [
          {
            fieldCode: "displayPoNum",
            fieldType: "EMPTY",
            render: (val, item) => {
              const { beyondQuantity, urgentFlag, statusCode, unreadCount } =
                item;
              return (
                <SrmListHeader>
                  <span>{item.displayPoNum}</span>
                  <SrmTooltip
                    v-show={urgentFlag === 1}
                    title={this.$T(
                      "slod.orderExecution.view.tooltip.urgent"
                    ).$D("订单加急")}
                  >
                    <span
                      onClick={(e) => e.stopPropagation()}
                      class="srm-icon icon-bolt-fill order-tooltip"
                      style="color:red"
                    ></span>
                  </SrmTooltip>
                  <SrmTooltip
                    v-show={beyondQuantity > 0}
                    title={this.$T(
                      "slod.orderExecution.view.tooltip.yanqiImg"
                    ).$D("订单超期")}
                  >
                    <span
                      onClick={(e) => e.stopPropagation()}
                      class="srm-icon icon-calendar-event order-tooltip"
                      style="color:red"
                    ></span>
                  </SrmTooltip>
                  <SrmTooltip
                    v-show={unreadCount > 0}
                    title={
                      unreadCount +
                      this.$T("sodr.common.model.common.unreadCount").$D(
                        "条留言板消息未读"
                      )
                    }
                  >
                    <span
                      onClick={(e) => e.stopPropagation()}
                      class="srm-icon icon-brand-messenger order-tooltip"
                      style="color:red"
                    ></span>
                  </SrmTooltip>
                  <SrmButton
                    rect
                    plain
                    slot="right"
                    style={{ fontWeight: "bold" }}
                    type={STATUS_COLOR_MAP[statusCode]}
                  >
                    {item.statusCodeMeaning}
                  </SrmButton>
                </SrmListHeader>
              );
            },
          },
          {
            fieldCode: "supplierName",
            fieldName: $T("sodr.workspace.model.common.supplier").$D("供应商"),
          },
          {
            fieldCode: "companyName",
            fieldName: $T("sodr.workspace.model.common.company").$D("公司"),
          },
          {
            fieldCode: "agentName",
            fieldName: $T("sodr.workspace.model.common.agentId").$D("采购员"),
          },
          {
            fieldCode: "poSourcePlatformMeaning",
            fieldName: $T("sodr.workspace.model.common.poSourcePlatform").$D(
              "来源平台"
            ),
          },
          {
            fieldCode: "poTypeCodeMeaning",
            fieldName: $T("sodr.workspace.model.common.poTypeId").$D(
              "订单类型"
            ),
          },
          {
            fieldCode: "creationDate",
            fieldName: $T("sodr.workspace.model.common.creationTime").$D(
              "创建时间"
            ),
          },
        ];
      }
      // 五菱埋点
      if (
        this.over$handleGetcolumns &&
        typeof this.over$handleGetcolumns === "function"
      ) {
        const columns = this.over$handleGetcolumns();
        return columns || [];
      }
      return [];
    },
    // 进入详情
    itemClick(item) {
      const {
        data: { poHeaderId },
      } = item;
      if (this.currentTab) {
        this.$router.push({
          name: `${this.currentTab}Detail`,
          query: { poHeaderId },
        });
      }
    },
    // 列表页按钮操作
    action(type, data) {
      // eslint-disable-next-line consistent-this
      const self = this;
      const actionApiMap = {
        agree: agreeApi,
        reject: rejectApi,
        release: batchReleaseApi,
      };
      const actionApi = actionApiMap[type];
      self.$loading.show();
      actionApi(data)
        .then((res) => {
          // eslint-disable-next-line no-empty
          if (res && !res.failed) {
            self.$notification.open({
              message: self
                .$T("hzero.common.notification.success")
                .$D("操作成功"),
            });
            self.getCurrentDs.editFlag = false;
          }
        })
        .finally(() => {
          self.getCurrentDs.refresh();
          self.$loading.hide();
        });
    },
    bottomRender() {
      if (
        this.over$bottomRender &&
        typeof this.over$bottomRender === "function"
      ) {
        return this.over$bottomRender();
      }
    },
    getAllDs() {
      if (
        this.over$getAllDs &&
        typeof this.over$getAllDs === "function"
      ) {
        return { ...allDs("all"), ...this.over$getAllDs() };
      }
      return allDs("all");
    }
  },
};
</script>
<style lang="stylus" scoped>
.order-bench-tab {
  >>> .srm-tab-bar-button-normal {
    min-width: 25%;
  }
}
</style>
