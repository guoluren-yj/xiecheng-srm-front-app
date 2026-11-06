<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.PLAN_SHEET.CREATE_LIST_SUPPLIER"
              :columns="getListColumns"
              :buttons="getListButtons"
              @itemClick="onListItemClick">
      <srm-flex v-if="type === 'CREATE'" slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="openCreatePopup">
          <em class="srm-icon icon-plus"/>
        </srm-button>
      </srm-flex>
    </srm-list>
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
import Mixin from "../mixins";
import { DataSet } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
import { getPlanHistory } from "../api";
import HistoryRecord from "@/components/HistoryRecord";
import createDSBySupplier from "../datasource/createDSBySupplier";
import listDSBySupplier from "../datasource/indexBySupplier";
export default {
  modules: [ "sodr.common", "sodr.orderMaintain" ],
  name: "ScheduleSheetCreateBySupplier",
  components: { HistoryRecord },
  mixins: [ Mixin ],
  data() {
    return {
      type: "CREATE",
      dataSet: new DataSet(listDSBySupplier("CREATE")),
      createDataSet: new DataSet(createDSBySupplier()),
      createPopup: false,
      detailPopup: false,
      showHistoryRecord: false,
      historyRecordLoading: false,
      historyRecords: [],
    };
  },
  computed: {
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
        { formRow: 2, fieldCode: "displayPoNum", },
        { formRow: 3, fieldCode: "companyName", },
        {
          formRow: 3,
          fieldCode: "planQuantity",
          editor: () => true
        },
        {
          formRow: 4,
          fieldCode: "planDate",
        },
        {
          formRow: 5,
          fieldCode: "supplierRemark",
        },
      ];
    },
    getListButtons() {
      return [
        {
          text: this.$T("sodr.common.view.button.batchEdit").$D("批量编辑"),
          type: "primary",
          bordered: true,
          visible: true,
          callback: () => {
            let batchDate = null;
            this.$dialog({
              title: this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期"),
              content: <SrmCalendarField
                v-model={batchDate} theme="fill"
                placeholder={this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期")}/>,
              closable: true,
              onOk: () => {
                const records = this.dataSet.selected.length ? this.dataSet.selected : this.dataSet.records;
                records.forEach((r) => r.set("planDate", batchDate));
              }
            });
          }
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.cancel").$D("取消"),
          type: "danger",
          bordered: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.dataSet.updateSelected();
          },
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.dataSet.submitSelected();
          },
        },
      ];
    },
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
        showHeader: false,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          customize-code="SMBL.PLAN_SHEET.CREATE_DETAIL_SUPPLIER"
          dataSet={this.dataSet}
          buttons={this.getDetailButtons()}
          columns={this.getDetailColumns()}
          onDelete={() => this.detailPopup.closePopup()}
          onUpdate={() => this.detailPopup.closePopup()}
          onSubmit={() => this.detailPopup.closePopup()}
        />,
      });
    },
    getDetailButtons() {
      return [
        {
          text: this.$T("sodr.common.button.scheduleSheet.cancel").$D("取消"),
          type: "danger",
          bordered: true,
          visible: true,
          handler: () => {
            this.dataSet.updateRecords([ this.dataSet.current ]).then(() => this.detailPopup.closePopup());
          },
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            this.dataSet.submitRecords([ this.dataSet.current ]).then(() => this.detailPopup.closePopup());
          },
        },
      ];
    },
    getDetailColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex>
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
        {
          fieldCode: "planQuantity",
          fieldType: "INPUT_NUMBER",
          editor: true
        },
        { fieldCode: "planDate",
          editor: true
        },
        { fieldType: "TEXT_AREA", fieldCode: "supplierRemark" },
        { fieldCode: "purchaserRemark" },
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
        { fieldCode: "shipToThirdPartyAddress" },
        { fieldCode: "asnNums" },
        { fieldCode: "creationDate" },
      ];
    },
    openCreatePopup() {
      this.createDataSet.setQueryParameter({ customizeUnitCode: "SODR.PLAN_SHEET_CREATE.FEEDBACK.LIST_NEW,SODR.PLAN_SHEET_CREATE.FEEDBACK.QUERY_FORM" });
      this.createPopup = this.$popup({
        title: this.$T("sodr.common.button.createPlan").$D("新建计划单"),
        showHeader: true,
        showClose: true,
        rounded: true,
        height: "75vh",
        position: "bottom",
        content: <SrmList
          showCancel={false}
          dataSet={this.createDataSet}
          buttons={this.getCreateListButtons()}
          columns={this.getCreateListColumns()}
        />,
      });
    },
    getCreateListButtons() {
      return [
        {
          text: this.$T("sodr.common.view.button.scheduleSheet.batchMaintenance").$D("批量编辑"),
          type: "primary",
          bordered: true,
          visible: true,
          callback: () => {
            let batchDate = null;
            this.$dialog({
              title: this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期"),
              content: <SrmCalendarField
                v-model={batchDate} theme="fill"
                placeholder={this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期")}/>,
              closable: true,
              onOk: () => {
                const records = this.createDataSet.selected.length ? this.createDataSet.selected : this.createDataSet.records;
                records.forEach((r) => r.set("planDate", batchDate));
              }
            });
          }
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.createDataSet.submitSelected();
          },
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.save").$D("保存"),
          type: "primary",
          fill: false,
          bordered: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.createDataSet.updateSelected();
          }
        }
      ];
    },
    getCreateListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={false}>{item.itemName}</SrmListHeader>
        },
        // { formRow: 2, fieldCode: "categoryName" },
        { formRow: 2, fieldCode: "displayPoNum", },
        { formRow: 3, fieldCode: "companyName",
          render: (val) => <SrmButton plain>{val}</SrmButton>
        },
        {
          formRow: 3,
          fieldCode: "planQuantity",
        },
        {
          formRow: 4,
          fieldCode: "planDate",
        },
        {
          formRow: 5,
          fieldCode: "supplierRemark",
          editor: true
        },
      ];
    },
  }
};
</script>

<style scoped lang="stylus">
.round-btn {
  line-height normal;
  pointer-events auto;

  .srm-icon {
    font-size 28px;
  }
}

.round-btn-box {
  background transparent;
  padding-bottom 60px;
  padding-right 15px;
}
</style>
