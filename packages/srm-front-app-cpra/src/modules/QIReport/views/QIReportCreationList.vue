<template>
  <div style="height: 100vh">
    <srm-list
      :columns="getListColumns"
      :buttons="getListButtons"
      :data-set="listDs"
      :customize-code="gridUnitCode"
      @itemClick="onListItemClick"/>
    <srm-flex class="create-button" justify="end" align="end">
      <srm-button
        class="round-btn"
        size="x-large"
        circle
        type="primary"
        fill
        @click="handleCreate">
        <span class="srm-icon icon-plus" />
      </srm-button>
    </srm-flex>
  </div>
</template>

<script>
import { fromPairs } from "lodash";
import { DataSet } from "srm-mobile-ui";
import { listDS } from "../datasource/creationListDS";
import { PermissionCaller, getMblUnitCodeMap } from "../utils";
import { batchDeleteQIReport, queryMapIdpValue } from "../api";
import StatusTag from "@/components/StatusTag";
export const permissionCodeMap = {
  release: "srm.sqam.business.problem.8d.create.ps.publish",
  delete: "srm.sqam.business.problem.manage.create.ps.radio.button.delete",
  foreverDelete: "srm.sqam.business.problem.manage.create.ps.radio.button.permanent_delete",
};
export default {
  modules: [ "hzero.common", "sqam.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.item", "entity.roles", "smbl.common" ],
  name: "QIReportCreationList",
  data() {
    return {
      listDs: new DataSet(listDS()),
      permissionMap: new PermissionCaller(permissionCodeMap),
      problemStatusTypeMap: {},
      gridUnitCode: getMblUnitCodeMap("creation").listGrid,
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
          text: this.$T("sqam.common.button.deleteForever").$D("永久删除"),
          type: "danger",
          bordered: true,
          visible: this.permissionMap?.get("foreverDelete"),
          disabled: (checkedList) => checkedList.length === 0,
          callback: (selected) => {
            this.openDeletePopup(selected);
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
    onListItemClick(item) {
      this.$router.push({
        path: "/QIReportCreationDetail",
        query: {
          problemHeaderId:
            item.get("problemHeaderId") || item.get("associateProblemHeaderId"),
        },
      });
    },
    handleCreate() {
      this.$router.push({
        path: "/QIReportCreationCreate",
      });
    },
    openDeletePopup(selected) {
      this.$dialog({
        closable: false,
        content: this.$T("sqam.common.view.message.confirm.deleteRectificationForever")
          .$D("是否永久删除整改报告"),
        onOk: async () => {
          const selectData = selected.map((item) => item.toData());
          const res = await batchDeleteQIReport(selectData).catch((err) => {
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
        }
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.create-button {
  position: absolute;
  right: 15px;
  bottom: 72px;
  width: 60px;
  height: 60px;
  .icon-plus {
    font-size: 24px;
  }
}
</style>