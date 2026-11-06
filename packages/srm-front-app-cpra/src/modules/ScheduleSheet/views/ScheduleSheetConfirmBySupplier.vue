<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet" :columns="getListColumns()"
              customize-code="SMBL.PLAN_SHEET.CONFIRM_LIST_SUPPLIER"
              :buttons="getListButtons()"
              @itemClick="onListItemClick"/>
    <history-record
      v-model="showHistoryRecord"
      :loading="historyRecordLoading"
      :action-data="historyRecords"
      operation-meaning-field-name="processStatusMeaning"
      operator-field-name="processUser"
      process-remark-info-field-name="processRemark"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import listDSBySupplier from "../datasource/indexBySupplier";
import Mixins from "../mixins";
import { getPlanHistory, getSettingApi } from "../api";
import HistoryRecord from "@/components/HistoryRecord";
import { dateFormat } from "@/utils/index";

export default {
  name: "ScheduleSheetConfirmBySupplier",
  components: { HistoryRecord },
  modules: [ "sodr.common", "sodr.orderMaintain", "sodr.scheduleSheet" ],
  mixins: [ Mixins ],
  data() {
    return {
      dataSet: new DataSet(listDSBySupplier("CONFIRM")),
      historyRecords: [],
      showHistoryRecord: false,
      historyRecordLoading: false,
      detailPopup: null,
      editQuantity: "1",
    };
  },
  mounted() {
    getSettingApi("010804").then((res) => {
      if (res) {
        this.editQuantity = res["010804"] && res["010804"].settingValue;
      }
    });
  },
  methods: {
    showHistoryRecords(planId) {
      this.showHistoryRecord = true;
      this.historyRecordLoading = true;
      getPlanHistory(planId).then((res) => {
        if (res && res.content) {
          this.historyRecords = res.content;
        }
      }).finally(() => {
        this.historyRecordLoading = false;
      });
    },
    onListItemClick() {
      this.detailPopup = this.$popup({
        title: this.$T("sodr.common.view.planSheet.detail").$D("计划排程详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customize-code="SMBL.PLAN_SHEET.CONFIRM_DETAIL_SUPPLIER"
          dataSet={this.dataSet}
          buttons={this.getDetailButtons()}
          columns={this.getDetailColumns()}
          onDelete={() => this.detailPopup.closePopup()}
          onUpdate={() => this.detailPopup.closePopup()}
          onSubmit={() => this.detailPopup.closePopup()}
        />,
      });
    },
    getListButtons() {
      return [
        {
          text: this.$T("sodr.common.view.button.confirmAndfeedBack").$D("反馈/确认"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.dataSet.updateSelected();
          }
        },
        // {
        //   text: this.$T("sodr.common.button.planSheetConfirm.confirm").$D("确认"),
        //   type: "primary",
        //   fill: true,
        //   visible: true,
        //   disabled: (checkedList) => {
        //     return checkedList.length === 0;
        //   },
        //   callback: () => {
        //     this.dataSet.submitSelected();
        //   }
        // },
      ];
    },
    getDetailButtons() {
      return [
        {
          text: this.$T("sodr.common.view.button.confirmAndfeedBack").$D("反馈/确认"),
          type: "primary",
          fill: true,
          // bordered: true,
          visible: true,
          handler: () => {
            this.dataSet.updateRecords([ this.dataSet.current ]).then(() => this.detailPopup.closePopup());
          }
        },
        // {
        //   text: this.$T("sodr.common.button.planSheetConfirm.confirm").$D("确认"),
        // type: "primary",
        // fill: true,
        //   visible: true,
        //   handler: () => {
        //     this.dataSet.submitRecords([ this.dataSet.current ]).then(() => this.detailPopup.closePopup());
        //   }
        // },
      ];
    },
    getDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
            {this.renderDisplayPoNum(item)}
            {this.renderAsnNum(item)}
            <SrmButton bordered style={{ marginLeft: "10px" }} onClick={() => {
              this.showHistoryRecords(item.planId);
            }}>
              {this.$T("sodr.common.view.button.operationRecord").$D("操作记录")}
            </SrmButton>
          </SrmFlex>
        },
        { fieldCode: "serialNum" },
        { fieldCode: "planStatusMeaning" },
        { fieldCode: "itemCode" },
        { fieldCode: "itemName" },
        { fieldCode: "categoryName" },
        { fieldCode: "planQuantity" },
        { fieldCode: "planDate" },
        { fieldType: "TEXT_AREA", fieldCode: "supplierRemark" },
        { fieldCode: "purchaserRemark" },
        { fieldCode: "supplierConfirmQuantity",
          editor: () => {
            if (this.editQuantity === "1") {
              return true;
            }
            return false;
          }
        },
        { fieldCode: "displayPoNum" },
        { fieldCode: "lineNum" },
        { fieldCode: "lineLocationNum" },
        { fieldCode: "netReceivedQuantity" },
        { fieldCode: "sendingQuantity" },
        { fieldCode: "uomName" },
        { fieldCode: "needByDate",
          render: (val) => <span>{dateFormat(val)}</span>
        },
        { fieldCode: "promiseDeliveryDate",
          render: (val) => <span>{dateFormat(val)}</span>
        },
        { fieldCode: "purchaseAgentName" },
        { fieldCode: "companyName" },
        { fieldCode: "invOrganizationName" },
        { fieldCode: "inventoryName" },
        { fieldCode: "receivingAddress" },
        { fieldCode: "asnNums" },
        { fieldCode: "creationDate" },
        { fieldCode: "createdByName" },
      ];
    },
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            const planStatus = item.planStatus;
            const statusType = {
              NEW: "primary",
              RELEASE: "success",
              MODIFY: "primary",
              CONFIRM: "primary",
              FEEDBACK: "primary",
              CANCEL: "info",
              CLOSE: "info",
              PENDING: "warn",
            };
            return <SrmListHeader>
              {item.itemName}
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[planStatus]}>
                {item.planStatusMeaning}
              </SrmButton>
            </SrmListHeader>;
          }
        },
        { formRow: 2, fieldCode: "categoryName" },
        { formRow: 2, fieldCode: "displayPoNum" },
        { formRow: 5, fieldCode: "supplierConfirmQuantity",
          editor: () => {
            if (this.editQuantity === "1") {
              return true;
            }
            return false;
          }
        },
        { formRow: 5, fieldCode: "planQuantity" },
        { formRow: 7, fieldCode: "planDate" },
        { formRow: 8, fieldCode: "supplierRemark" },
      ];
    },
  }
};
</script>

<style scoped lang="stylus">
</style>
