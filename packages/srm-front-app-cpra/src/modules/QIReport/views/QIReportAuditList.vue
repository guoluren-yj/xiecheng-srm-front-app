<template>
  <div style="height: 100vh">
    <srm-list
      :columns="getListColumns"
      :data-set="listDs"
      :customize-code="gridUnitCode"
      @itemClick="onListItemClick"/>
  </div>
</template>

<script>
import { fromPairs } from "lodash";
import { DataSet } from "srm-mobile-ui";
import { listDS } from "../datasource/auditListDS";
import { getMblUnitCodeMap } from "../utils";
import { queryMapIdpValue } from "../api";
import StatusTag from "@/components/StatusTag";
export const permissionCodeMap = {
  timeAdjust: "srm.sqam.business.problem.manage.audit.ps.button.time",
  continuePCA: "srm.sqam.business.problem.manage.audit.ps.ps.feedback",
};
export default {
  modules: [ "hzero.common", "sqam.common", "entity.supplier", "entity.company", "entity.business", "entity.organization", "entity.item", "entity.roles", "smbl.common" ],
  name: "QIReportAuditList",
  data() {
    return {
      listDs: new DataSet(listDS()),
      problemStatusTypeMap: {},
      gridUnitCode: getMblUnitCodeMap("audit").listGrid,
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
        path: "/QIReportAuditDetail",
        query: {
          problemHeaderId: item.get("problemHeaderId"),
        },
      });
    },
  },
};
</script>