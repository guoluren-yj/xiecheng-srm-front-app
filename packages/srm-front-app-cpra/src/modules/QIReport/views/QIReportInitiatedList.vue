<template>
  <div style="height: 100vh">
    <srm-list
      :columns="getListColumns"
      :data-set="listDs"
      :customize-code="gridUnitCode"
      :buttons="getListButtons"
      @itemClick="onListItemClick"/>
  </div>
</template>

<script>
import { fromPairs } from "lodash";
import { DataSet } from "srm-mobile-ui";
import { listDS } from "../datasource/initiatedListDS";
import { PermissionCaller, getMblUnitCodeMap } from "../utils";
import { queryMapIdpValue, batchSyncQIReport } from "../api";
import StatusTag from "@/components/StatusTag";
export const permissionCodeMap = {
  recall: "srm.sqam.business.problem.manage.initiated.button.recall",
  sync: "srm.sqam.business.problem.manage.initiated.button.sync",
};
export default {
  modules: [ "hzero.common", "sqam.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.item", "entity.roles", "smbl.common" ],
  name: "QIReportInitiatedList",
  data() {
    return {
      listDs: new DataSet(listDS()),
      permissionMap: new PermissionCaller(permissionCodeMap),
      problemStatusTypeMap: {},
      gridUnitCode: getMblUnitCodeMap("initiated").listGrid,
    };
  },
  computed: {
    getListColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "problemNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { problemStatus, problemStatusMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value}</span>
                <StatusTag
                  slot="right"
                  text={problemStatusMeaning}
                  color={this.problemStatusTypeMap[problemStatus]}
                />
              </SrmListHeader>
            );
          },
        },
        { formRow: 20, fieldCode: "problemTitle" },
        { formRow: 30, fieldCode: "problemTypeCodeMeaning" },
        { formRow: 40, fieldCode: "rectifyTypeCodeMeaning" },
        { formRow: 50, fieldCode: "problemUrgencyCodeMeaning" },
        { formRow: 60, formCol: 10, fieldCode: "creationDate" },
        { formRow: 60, formCol: 20, fieldCode: "createdName" },
        { formRow: 70, fieldCode: "companyName" },
        { formRow: 80, fieldCode: "supplierName" },
      ];
    },
    getListButtons() {
      return [
        {
          text: this.$T("hzero.common.button.sync").$D("同步"),
          bordered: true,
          visible: this.permissionMap?.get("sync"),
          disabled: (checkedList) => checkedList.length === 0,
          callback: (selected) => {
            this.handleSync(selected);
          },
        },
      ];
    },
  },
  created() {
    this.fetchLookupData();
  },
  activated() {
    this.listDs.refresh();
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        problemStatusData: "SQAM.PROBLEM_STATUS",
      }).catch((err) => {
        throw err;
      });
      if (!res) {
        return;
      }
      if (!res.failed) {
        const { problemStatusData = [] } = res;
        this.problemStatusTypeMap = fromPairs(
          problemStatusData.map(({ value, tag } = {}) => [ value, tag ])
        );
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async handleSync(selected) {
      const selectData = selected.map((item) => item.toData());
      const res = await batchSyncQIReport(selectData).catch((err) => {
        throw err;
      });
      if (res && res.failed) {
        this.$notification.open({
          message: res.message
        });
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功")
        });
        this.listDs.refresh();
      }
    },
    onListItemClick(item) {
      this.$router.push({
        path: "/QIReportInitiatedDetail",
        query: {
          problemHeaderId:
            item.get("problemHeaderId") || item.get("associateProblemHeaderId"),
        },
      });
    },
  },
};
</script>