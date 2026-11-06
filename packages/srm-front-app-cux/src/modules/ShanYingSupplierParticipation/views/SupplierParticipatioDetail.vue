<template>
  <div>
    <div style="height: 100vh">
      <srm-scroll-tab>
        <srm-scroll-tab-item :label="$T('scux.supplierParticipatio.title.headerInfo').$D('基础信息')">
          <srm-form :data-set="formDataDs" :columns="getFormColumns()" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('scux.supplierParticipatio.title.itemLineInfo').$D('物料明细')">
          <div style="height: 100vh; overflow-y: scroll">
            <srm-list
              :data-set="itemDataDs" :columns="getItemColumns()" auto-hide-search-bar :scrollable="false" />
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
      <div style="height: 100vh; overflow-y: scroll">
        <srm-bottom-handler :btn-arr="getBUttons" type="action-sheet" />
      </div>
    </div>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { advanceOrGiveUpApi } from "../api/index";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { formDs, itemDs } from "../datasource/index";
export default {
  modules: [ "scux.supplierParticipatio", "ssrc.inquiryHall" ],
  name: "SupplierParticipatioDetail",
  data() {
    const {
      app: {
        _route: {
          query: { rfxHeaderId, supplierCompanyId, tenantId, type },
        },
      },
    } = this.$router;
    return {
      rfxHeaderId, supplierCompanyId, tenantId,
      formDataDs: new DataSet(formDs(this)),
      itemDataDs: new DataSet(itemDs(this)),
      type,
    };
  },
  computed: {
    getBUttons() {
      if (this.type === "read") {
        return [];
      }
      return [
        {
          text: $T("scux.supplierParticipatio.button.advance").$D("参与"),
          type: "primary",
          fill: true,
          handler: () => {
            this.handleStatus("PARTICIPATED");
          },
        },
        {
          text: $T("scux.supplierParticipatio.button.giveUp").$D("放弃"),
          type: "",
          fill: true,
          handler: () => {
            this.handleStatus("REJECTED");
          },
        },
      ];
    },
  },
  created() {
    this.formDataDs.refresh();
    this.itemDataDs.refresh();
  },
  mounted() {
    // this.addScanMonitor();
  },
  methods: {
    getFormColumns() {
      return [
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode: "rfxTitle",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "secondarySourceCategoryMeaning",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "quotationStartDate",
        },
        {
          fieldCode: "quotationEndDate",
        },
        {
          fieldCode: "rfxRemark",
        },
        {
          fieldCode: "attributeDatetime1",
        },
        {
          fieldCode: "attributeDatetime10",
        },
        {
          fieldCode: "sealedQuotationFlag",
        },
        {
          fieldCode: "bidFileExpense",
        },
        {
          fieldCode: "bidBond",
        },
        {
          fieldCode: "attributeLongtext3",
        },
        {
          fieldCode: "attributeVarchar2",
        },
        {
          fieldCode: "particpateStstusMeaning",
        },
      ];
    },
    getItemColumns() {
      return [
        {
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <span slot="left" style="color:#276EF1;">
                {record.itemName}
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldCode: "rfxLineItemNum",
        },
        {
          fieldCode: "ouName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "itemCategoryName",
        },
        {
          fieldCode: "specs",
        },
        {
          fieldCode: "rfxQuantity",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "batchPrice",
        },
        {
          fieldCode: "taxIncludedFlag",
        },
        {
          fieldCode: "taxRate",
        },
        {
          fieldCode: "freightIncludedFlag",
        },
        {
          fieldCode: "demandDate",
        },
      ];
    },
    handleStatus(status) {
      const data = this.formDataDs.toData()[0] || {};
      advanceOrGiveUpApi({ ...data, type: status }).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            class: "notification",
          });
          return;
        }
        this.$notification.open({
          message: $T(
            "scux.supplierParticipatio.message.success"
          ).$D("操作成功"),
          class: "notification",
        });
        try {
          this.$router.back();
        } catch (err) {
          closeWebView();
        }
      });
    }
  },
};
</script>