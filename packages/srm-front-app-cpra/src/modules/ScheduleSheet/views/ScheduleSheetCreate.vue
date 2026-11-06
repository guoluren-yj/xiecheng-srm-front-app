<template>
  <div style="height: 100vh">
    <srm-list :data-set="type === 'CREATE' ? dataSet : updateDataSet"
              :customize-code="type === 'CREATE' ? 'SMBL.PLAN_SHEET.CREATE_LIST' : 'SMBL.PLAN_SHEET.UPDATE_LIST'"
              :columns="getListColumns()"
              :buttons="type === 'CREATE' ? getListButtons() : getUpdateButtons()" @itemClick="onListItemClick">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     $T('sodr.scheduleSheet.view.tab.list.create').$D('计划创建'),
                     $T('sodr.common.view.tab.detail.toUpdate').$D('计划更新')
                   ]"
                   display="justify"
                   @indexChange="onTabIndexChange"/>
      <srm-flex v-if="type === 'CREATE'" slot="bottom" class="round-btn-box" justify="end">
        <srm-button class="round-btn" size="x-large" circle type="primary" fill @click="openCreatePopup">
          <em class="srm-icon icon-plus"/>
        </srm-button>
      </srm-flex>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import listDS from "../datasource";
import createDS from "../datasource/createDS";
import { createScheduleSheet } from "../api";
import Mixin from "../mixins";
import { dateFormat } from "@/utils/index";

export default {
  modules: [ "sodr.common", "sodr.orderMaintain", "sodr.scheduleSheet", "model.common", "button.planSheet", "smbl.common" ],
  name: "ScheduleSheetCreate",
  mixins: [ Mixin ],
  data() {
    return {
      type: "CREATE",
      dataSet: new DataSet(listDS("CREATE")),
      updateDataSet: new DataSet(listDS("UPDATE")),
      createDataSet: new DataSet(createDS()),
      detailPopup: null,
    };
  },
  methods: {
    onTabIndexChange(index) {
      if (index === 0) {
        this.type = "CREATE";
        this.dataSet.refresh();
      } else {
        this.type = "UPDATE";
        this.updateDataSet.refresh();
      }
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
          customizeCode={this.type === "CREATE" ? "SMBL.PLAN_SHEET.CREATE_DETAIL" : "SMBL.PLAN_SHEET.UPDATE_DETAIL"}
          dataSet={this.type === "CREATE" ? this.dataSet : this.updateDataSet}
          buttons={this.type === "CREATE" ? this.getDetailButtons() : this.getUpdateDetailButtons()}
          columns={this.getDetailColumns()}
          onDelete={() => this.detailPopup.closePopup()}
          onUpdate={() => this.detailPopup.closePopup()}
          onSubmit={() => this.detailPopup.closePopup()}
        />,
      });
    },
    getCreateListButtons() {
      return [
        {
          text: this.$T("sodr.common.button.planSheet.create").$D("创建计划单"),
          type: "primary",
          fill: true,
          visible: true,
          callback: () => {
            const ids = this.createDataSet.selected.map((r) => r.get("poLineLocationId"));
            this.$loading.show();
            createScheduleSheet(ids).then(() => {
              this.createPopup && this.createPopup.closePopup();
              this.dataSet.refresh();
            }).finally(() => {
              this.$loading.hide();
            });
          }
        }
      ];
    },
    getUpdateButtons() {
      return [
        {
          text: this.$T("sodr.common.button.scheduleSheet.cancel").$D("取消"),
          type: "danger",
          bordered: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.updateDataSet.updateSelected();
          },
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.updateDataSet.submitSelected();
          },
        },
      ];
    },
    openCreatePopup() {
      this.createDataSet.setQueryParameter({ customizeUnitCode: "SODR.PLAN_SHEET.CREATE_LIST" });
      this.createPopup = this.$popup({
        title: this.$T("sodr.common.button.createPlan").$D("新建计划单"),
        showHeader: true,
        showClose: true,
        rounded: true,
        height: "75vh",
        position: "bottom",
        content: <SrmList
          showCancel={false}
          customize-code={"SMBL.PLAN_SHEET.CREATE_POPUP"}
          dataSet={this.createDataSet}
          buttons={this.getCreateListButtons()}
          columns={this.getCreateListColumns()}
        />,
      });
    },
    getListButtons() {
      return [
        {
          text: this.$T("sodr.common.view.button.batchMaintenance").$D("批量维护"),
          type: "primary",
          bordered: true,
          visible: true,
          callback: () => {
            let batchDate = null;
            this.$dialog({
              title: this.$T("sodr.common.model.common.planDate").$D("本次计划到货日期"),
              content: <SrmCalendarField
                v-model={batchDate} theme="fill"
                size="mini"
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
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.dataSet.submitSelected();
          },
        },
        "update",
        "delete",
      ];
    },
    getUpdateDetailButtons() {
      return [
        {
          text: this.$T("sodr.common.button.scheduleSheet.cancel").$D("取消"),
          type: "danger",
          bordered: true,
          visible: true,
          handler: () => {
            this.updateDataSet.updateRecords([ this.updateDataSet.current ])
              .then(() => this.detailPopup && this.detailPopup.closePopup());
          },
        },
        {
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            this.updateDataSet.submitRecords([ this.updateDataSet.current ])
              .then(() => this.detailPopup && this.detailPopup.closePopup());
          },
        },
      ];
    },
    getDetailButtons() {
      return [
        "update",
        {
          text: this.$T("sodr.common.button.scheduleSheet.release").$D("发布"),
          type: "primary",
          fill: true,
          visible: true,
          handler: () => {
            this.dataSet.submitRecords([ this.dataSet.current ])
              .then(() => this.detailPopup && this.detailPopup.closePopup());
          },
        },
        "delete",
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
          </SrmFlex>
        },
        { fieldCode: "serialNum" },
        { fieldCode: "planStatusMeaning" },
        { fieldCode: "itemName" },
        { fieldCode: "supplierCompanyName" },
        { fieldCode: "categoryName" },
        { fieldCode: "availableQuantity" },
        { fieldCode: "planQuantity" },
        { fieldCode: "planDate" },
        { fieldType: "TEXT_AREA", fieldCode: "purchaserRemark" },
        { fieldCode: "lineNum" },
        { fieldCode: "lineLocationNum" },
        { fieldCode: "netReceivedQuantity" },
        { fieldCode: "sendingQuantity" },
        { fieldCode: "uomName" },
        { fieldCode: "needByDate",
          render: (val) => dateFormat(val)
        },
        { fieldCode: "promiseDeliveryDate",
          render: (val) => dateFormat(val)
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
        { formRow: 2, fieldCode: "displayPoNum", },
        { formRow: 4, fieldCode: "supplierCompanyName" },
        { formRow: 5, fieldCode: "availableQuantity" },
        {
          formRow: 5,
          fieldCode: "planQuantity",
          editor: this.type === "CREATE" && this.dataSet.editFlag || this.type === "UPDATE" && this.updateDataSet.editFlag
        },
        {
          formRow: 7,
          fieldCode: "planDate",
          editor: this.dataSet.editFlag,
          render: (val) => dateFormat(val)
        },
        {
          formRow: 8,
          fieldCode: "purchaserRemark",
          editor: this.type === "CREATE" && this.dataSet.editFlag || this.type === "UPDATE" && this.updateDataSet.editFlag
        },
        {
          formRow: Infinity,
          fieldCode: "bottom",
          fieldType: "EMPTY",
          visible: this.dataSet.editFlag && this.type === "CREATE",
          render: (val, item, col, record) => {
            let data = {};
            Object.assign(data, item);
            data.planId = null;
            data.planQuantity = null;
            data.planDate = null;
            return <SrmFlex justify="end">
              <SrmButton bordered style={{ marginRight: "12px" }} onClick={() => {
                this.dataSet.locate(record.index);
                this.onListItemClick();
              }}>
                {this.$T("sodr.common.model.common.toDetail").$D("查看详情")}
              </SrmButton>
              <SrmButton fill onClick={() => this.dataSet.create(data, 0)}>
                {this.$T("sodr.common.model.common.translate").$D("拆分")}
              </SrmButton>
            </SrmFlex>;
          }
        },
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
        { formRow: 2, fieldCode: "itemCode" },
        { formRow: 3, fieldCode: "availableQuantity" },
        {
          formRow: 4,
          fieldCode: "supplierCompanyName",
          render: (val) => <SrmButton plain>{val}</SrmButton>
        },
        { formRow: 5, fieldCode: "displayPoNum" },
      ];
    },
  }
};
</script>

<style scoped lang="stylus">
.round-btn {
  padding 0;
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
