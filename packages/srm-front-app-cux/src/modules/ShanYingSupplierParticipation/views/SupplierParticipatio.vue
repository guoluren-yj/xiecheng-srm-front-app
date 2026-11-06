<template>
  <div>
    <div style="height: 100vh; overflow-y: scroll">
      <srm-list :data-set="listDataDs"
                :columns="getListColumns()"/>
    </div>
  </div>
</template>

<script>
import { DataSet, $T, } from "srm-mobile-ui";
import { listDs } from "../datasource/index";
export default {
  modules: [ "scux.supplierParticipatio", "ssrc.inquiryHall" ],
  name: "SupplierParticipatio",
  data() {
    return {
      nowFieldCode: "",
      boxArr: [],
      fullFlag: false,
      boxNow: 0,
      boxMax: 0,
      labelCode: "",
      listDataDs: new DataSet(listDs()),
    };
  },
  created() {
    this.listDataDs.refresh();
  },
  mounted() {
    // this.addScanMonitor();
  },
  methods: {
    getListColumns() {
      return [
        {
          fieldCode: "rfxNum",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span on-click={(e) => {
                e.stopPropagation();
                this.goDetail(record, "read");
              }}>{val}</span>
              <span slot="left" style="color:#276EF1;">
                {record.rfxNum}
              </span>
              {
                record.showFlag === "1" ?
                  <span on-click={(e) => {
                    e.stopPropagation();
                    this.goDetail(record, "show");
                  }} slot="right" style="color:#276EF1;">
                    {$T("scux.supplierParticipatio.model.show").$D("参与")}
                  </span> : null
              }
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "particpateStstusMeaning",
        },
        {
          fieldCode: "rfxTitle",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "attributeDatetime1",
        },
        {
          fieldCode: "quotationStartDate",
        },
        {
          fieldCode: "quotationEndDate",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldCode: "realName",
        },
        {
          fieldCode: "openBidDate",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    goDetail(record, type) {
      const { rfxHeaderId, supplierCompanyId, } = record;
      this.$router.push({
        name: "SupplierParticipatioDetail",
        query: {
          rfxHeaderId,
          supplierCompanyId,
          type,
          tenantId: localStorage.getItem("organizationId"),
        },
      });
    }
  },
};
</script>