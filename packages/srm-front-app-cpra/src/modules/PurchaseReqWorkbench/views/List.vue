<template>
  <div style="height: 100vh">
    <srm-list
      customize-code="SMBL.PURCHASE_REQ_WORKBENCH.LIST"
      :data-set="dataSet[type]"
      :columns="getColumns"
      :buttons="getButtons"
      @itemClick="itemClick">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     $T('sprm.common.model.common.awaitSubmit').$D('待提交'),
                     $T('sprm.common.model.common.approving').$D('审批中'),
                     $T('sprm.common.model.common.approved').$D('已审批'),
                     $T('sprm.common.model.common.all').$D('全部')
                   ]"
                   display="justify"
                   :active-index="currentTab"
                   @indexChange="onTabIndexChange"/>
      <srm-flex slot="bottom" class="round-btn-box" justify="end">
        <srm-button permission-code="hzero.srm.requirement.prm.pr-platform.ps.new" class="round-btn" size="x-large" circle type="primary" fill
                    @click="createRecord">
          <em class="srm-icon icon-plus"/>
        </srm-button>
      </srm-flex>
    </srm-list>
  </div>
</template>

<script>
import { indexDs } from "../datasource/indexDs";
import { DataSet, $T } from "srm-mobile-ui";
import { checkBudgetApi, cancelRejectApi } from "../api";
export default {
  modules: [ "sprm.common", "sprm.purchasePlatform" ],
  name: "PurchaseReqWorkbenchList",
  data() {
    return {
      dataSet: {
        awaitSubmit: new DataSet(indexDs("awaitSubmit")),
        approving: new DataSet(indexDs("approving")),
        approved: new DataSet(indexDs("approved")),
        all: new DataSet(indexDs("all")),
      },
      type: "approved",
      currentTab: 2,
    };
  },
  computed: {
    getButtons() {
      return [
        {
          text: $T("sprm.purchasePlatform.view.button.reject").$D("整单加急"),
          bordered: true,
          visible: true,
          type: "danger",
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-platform.ps.urgent",
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            let f = true;
            checkedList.map((val) => {
              if (val.data["urgentFlag"] === 1) {
                f = false;
              }
            });
            if (!f) {
              return true;
            }
          },
          callback: () => {
            let that = this;
            that.$dialog({
              content: $T("sprm.common.view.message.confirmUrgent").$D("是否确认整单加急") + "?",
              onOk() {
                that.dataSet[that.type].updateSelected().then(() => {
                  that.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
                  that.dataSet[that.type].refresh();
                }).catch((err) => {
                  if (err && err.failed) {
                    that.$notification.open({ message: err.errorDataVOList.map((msg) => msg.message).join(",") });
                  }
                });
              },
              onCancel() {
              },
            });
          },
        },
        {
          text: $T("sprm.purchasePlatform.view.button.submit").$D("提交"),
          fill: true,
          visible: this.currentTab === 0,
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-platform.ps.submit",
          disabled: (checkedList) => checkedList.length === 0,
          callback: (selected) => {
            // 预算金额校验
            this.$loading.show();
            checkBudgetApi(selected.map((record) => record.data)).then((res) => {
              if (res && res.failed) {
                this.$notification.open({ message: res.message });
              } else {
                let that = this;
                that.$dialog({
                  content: $T("sprm.common.view.message.confirmSubmit").$D("请确认是否继续提交") + "?",
                  onOk() {
                    that.dataSet[that.type].submitSelected().then(() => {
                      that.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
                      that.dataSet[that.type].refresh();
                    }).catch((err) => {
                      if (err && err.failed) {
                        that.$notification.open({ message: err.errorDataVOList.map((msg) => msg.message).join(",") });
                      }
                    });
                  },
                  onCancel() {
                  },
                });
              }
            }).finally(() => {
              this.$loading.hide();
            });
          },
        },
        {
          text: $T("sprm.purchasePlatform.view.button.cancelReject").$D("取消整单加急"),
          bordered: true,
          visible: true,
          type: "danger",
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-platform.ps.urgent",
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            let f = true;
            checkedList.map((val) => {
              if (val.data["urgentFlag"] !== 1) {
                f = false;
              }
            });
            if (!f) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            let that = this;
            that.$dialog({
              content: $T("sprm.common.view.message.confirmCancelUrgent").$D("是否确认取消整单加急") + "?",
              onOk() {
                cancelRejectApi(that.dataSet[that.type].selected.map((item) => item.data)).then((res) => {
                  if (res && res.failed) {
                    that.$notification.open({ message: res.errorDataVOList.map((msg) => msg.message).join(",") });
                  } else {
                    that.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
                    that.dataSet[that.type].refresh();
                  }
                });
              },
              onCancel() {
              },
            });
          },
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "displayPrNum",
          fieldType: "EMPTY",
          render: (val, item) => {
            const prStatusCode = item.prStatusCode;
            const statusType = {
              PENDING: "warn",
              WORKFLOW_APPROVAL: "warn",
              SUBMITTED: "warn",
              SUBMIT_SYNC: "success",
              APPROVED: "success",
              EXCUTED: "success",
              REJECTED: "danger",
              SEND_BACK: "danger",
            };
            return <SrmListHeader>
              <span>
                {item.displayPrNum}
                {
                  item.urgentFlag === 1 ? <em class="srm-icon icon-bolt" style="color: red; font-size: 14px; padding-bottom: 5px;"/> : ""
                }
              </span>
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[prStatusCode]}>
                {item.prStatusMeaning}
              </SrmButton>
            </SrmListHeader>;
          },
        },
        {
          fieldCode: "companyName",
          fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
        },
        {
          fieldCode: "ouName",
          fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
        },
        {
          fieldCode: "purchaseOrgName",
          fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
        },
        {
          fieldCode: "purchaseAgentName",
          fieldName: $T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
        },
        {
          fieldCode: "prRequestedName",
          fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
          render: (val, item) => `${item.prRequestedNum}-${item.prRequestedName}`,
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("sprm.common.model.common.creationDate").$D("创建时间"),
        },
        {
          fieldCode: "unitName",
          fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
        },
      ];
    },
  },
  activated() {
    this.dataSet[this.type].refresh();
  },
  methods: {
    onTabIndexChange(index) {
      this.currentTab = index;
      switch (index) {
      case 0:
        this.type = "awaitSubmit";
        break;
      case 1:
        this.type = "approving";
        break;
      case 2:
        this.type = "approved";
        break;
      case 3:
        this.type = "all";
        break;
      default:
        break;
      }
      this.dataSet[this.type].refresh();
    },
    createRecord() {
      // 新增
      this.$router.push({
        name: "PurchaseReqWorkbenchDetail",
        query: {
          type: "add",
        }
      });
    },
    itemClick(item) {
      // 进入详情
      const { data } = item;
      const { prHeaderId } = data;
      this.$router.push({
        name: "PurchaseReqWorkbenchDetail",
        query: {
          prHeaderId: prHeaderId,
          type: this.type === "awaitSubmit" ? "edit" : "readOnly",
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.round-btn-box {
  background transparent;
  padding-bottom 60px;
  padding-right 15px;
}
</style>
