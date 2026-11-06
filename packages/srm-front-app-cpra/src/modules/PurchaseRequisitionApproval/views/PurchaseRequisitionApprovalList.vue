<template>
  <div class="purchase-requisition-approval-list">
    <srm-list :data-set="dataSet" :columns="getColumns" customize-code="SMBL.PURCHASE_REQUISITION_APPROVAL.LIST" :buttons="getButtons" @itemClick="itemClick"/>
  </div>
</template>

<script>
import {
  submitApprovalApi,
  submitRejectApi,
  cancelApprovalApi,
  cancelRejectApi,
} from "../api/index";
import { purchaseRequisitionListDS } from "../datasource/PurchaseRequisitionListDS";
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "sprm.common", "hipspfm.common", "sprm.purchaseRequisitionApproval", "sodr.common" ],
  name: "PurchaseRequisitionApprovalList",
  data() {
    return {
      dataSet: new DataSet(purchaseRequisitionListDS()),
    };
  },
  computed: {
    getButtons() {
      return [ {
        text: this.$T("sprm.purchaseRequisitionApproval.view.button.reject").$D("审批拒绝"),
        permissionCode: "hzero.srm.requirement.prm.pr-approval.ps.reject-btn",
        bordered: true,
        visible: true,
        type: "danger",
        size: "large",
        disabled: (checkedList) => {
          let submittedCount = 0;
          let cancelCount = 0;
          checkedList.forEach((e) => {
            if (e.data.approvalPendingStatus === "SUBMITTED") {
              submittedCount = submittedCount + 1;
            } else {
              cancelCount = cancelCount + 1;
            }
          });
          // 选中了取消中的，不允许选择已提交；如果选择了多个取消中，不允许批量审批；
          if (cancelCount > 0) {
            if (submittedCount > 0) {
              return true;
            }
            return cancelCount !== 1;
          }
          return submittedCount === 0;
        },
        callback: (checkedList) => {
          this.rejectSelected(checkedList);
        },
      }, {
        text: this.$T("sprm.purchaseRequisitionApproval.view.button.approval").$D("审批通过"),
        permissionCode: "hzero.srm.requirement.prm.pr-approval.ps.approval-btn",
        fill: false,
        type: "success",
        bordered: true,
        visible: true,
        size: "large",
        disabled: (checkedList) => {
          let submittedCount = 0;
          let cancelCount = 0;
          checkedList.forEach((e) => {
            if (e.data.approvalPendingStatus === "SUBMITTED") {
              submittedCount = submittedCount + 1;
            } else {
              cancelCount = cancelCount + 1;
            }
          });
          // 选中了取消中的，不允许选择已提交；如果选择了多个取消中，不允许批量审批；
          if (cancelCount > 0) {
            if (submittedCount > 0) {
              return true;
            }
            return cancelCount !== 1;
          }
          return submittedCount === 0;
        },
        callback: (checkedList) => {
          this.approvalSelected(checkedList);
        },
      }, ];
    },
    getColumns() {
      return [ {
        fieldName: this.$T("sprm.common.model.displayPrNum").$D("采购申请编号"),
        fieldCode: "displayPrNum",
        fieldType: "EMPTY",
        formRow: 10,
        formCol: 10,
        render: (val, item) => <srm-list-header show-open-tag={true}>
          <span>{val}</span>
          <span slot="right" style={{
            color: this.colorForState(item.approvalPendingStatus),
          }}>{item.approvalPendingStatusMeaning}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("sprm.common.model.common.title").$D("标题"),
        fieldCode: "title",
        fieldType: "TEXT",
        formRow: 20,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.createdName").$D("创建人"),
        fieldCode: "createByName",
        fieldType: "TEXT",
        formRow: 30,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.changedFlag").$D("变更中"),
        fieldCode: "changedFlag",
        fieldType: "TEXT",
        formRow: 30,
        formCol: 20,
        render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否"),
      }, {
        fieldName: this.$T("sprm.common.model.common.unitName").$D("所属部门"),
        fieldCode: "unitName",
        fieldType: "TEXT",
        formRow: 40,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
        fieldCode: "prSourcePlatformMeaning",
        fieldType: "TEXT",
        formRow: 40,
        formCol: 20,
      }, {
        fieldName: this.$T("sprm.common.model.common.creationTime").$D("创建日期"),
        fieldCode: "creationDate",
        fieldType: "TEXT",
        formRow: 50,
        formCol: 10,
      }, {
        fieldName: this.$T("sprm.common.model.common.applyExplain").$D("申请说明"),
        fieldCode: "remark",
        fieldType: "TEXT",
        formRow: 60,
        formCol: 10,
      }, ];
    },
  },
  // 回到页面，刷新数据
  activated() {
    this.dataSet.refresh();
  },
  methods: {
    itemClick(item) {
      this.$router.push({
        path: "/PurchaseRequisitionApprovalDetail",
        query: {
          prHeaderId: item.data.prHeaderId,
        },
      });
    },
    colorForState(approvalPendingStatus) {
      if (approvalPendingStatus === "SUBMITTED") {
        return "var(--color-success)";
      }
      return "var(--color-danger)";
    },
    async rejectSelected(checkedList) {
      let submittedCount = 0;
      let cancelCount = 0;
      let items = [];
      checkedList.forEach((e) => {
        if (e.data.approvalPendingStatus === "SUBMITTED") {
          submittedCount = submittedCount + 1;
        } else {
          cancelCount = cancelCount + 1;
        }
        items.push({
          ...e.data,
        });
      });
      if (cancelCount === 1 && submittedCount === 0) {
        // 取消
        this.$loading.show();
        let res = await cancelRejectApi(items);
        this.$loading.hide();
        if (res && !res.failed) {
          this.dataSet.refresh();
        }
      } else if (submittedCount > 0 && cancelCount === 0) {
        // 已提交
        this.$loading.show();
        let res = await submitRejectApi(items);
        this.$loading.hide();
        if (res && !res.failed) {
          this.dataSet.refresh();
        }
      }
    },
    async approvalSelected(checkedList) {
      let submittedCount = 0;
      let cancelCount = 0;
      let items = [];
      checkedList.forEach((e) => {
        if (e.data.approvalPendingStatus === "SUBMITTED") {
          submittedCount = submittedCount + 1;
        } else {
          cancelCount = cancelCount + 1;
        }
        items.push({
          ...e.data,
        });
      });
      if (cancelCount === 1 && submittedCount === 0) {
        // 取消
        this.$loading.show();
        let res = await cancelApprovalApi(items);
        this.$loading.hide();
        if (res && !res.failed) {
          this.dataSet.refresh();
        }
      } else if (submittedCount > 0 && cancelCount === 0) {
        // 已提交
        this.$loading.show();
        let res = await submitApprovalApi(items);
        this.$loading.hide();
        if (res && !res.failed) {
          this.dataSet.refresh();
        }
      }
    },
  }
};
</script>

<style lang="stylus" scoped>

.purchase-requisition-approval-list {
  width: 100vw;
  height: 100vh;
}

</style>
