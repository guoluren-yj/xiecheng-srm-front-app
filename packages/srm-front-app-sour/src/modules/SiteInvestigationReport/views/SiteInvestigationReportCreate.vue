<template>
  <div class="report-create">
    <nav-head :nav-title="$T('sslm.siteInvestigateReport.view.maintain.title').$D('现场考察报告维护')" />
    <div>
      <srm-scroll-tab>
        <!-- 基本信息 -->
        <srm-scroll-tab-item :label="$T('sslm.siteInvestigateReport.view.tabs.basicInfo').$D('基本信息')">
          <srm-form v-if="basicDataSet" customize-type="detail" :data-set="basicDataSet" :columns="getBasicInfoDetailColumns" customize-code="SMBL.SITE_INVESTIGATE_REPORT.CREATE.BASIC_INFO" />
          <div class="bottom-space-view" />
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
    <srm-bottom-handler :btn-arr="bottomButtons"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { reportBasicDS } from "../datasource/ReportBasicDS";
import { creatReportAction } from "../api/index";
export default {
  modules: [ "sslm.siteInvestigateReport", "smbl.common" ],
  name: "SiteInvestigationReportCreate",
  data() {
    return {
      basicDataSet: null,
      headInfo: {
        companyId: null,
        companyName: null,
        ouId: null,
        ouName: null,
        invOrganizationId: null,
        organizationName: null,
        inventoryId: null,
        inventoryName: null,
        supplierCompanyId: null,
        supplierName: null,
        supplierContactor: null,
        supplierContactMail: null,
        evalType: null,
      },
    };
  },
  computed: {
    // 基础信息
    getBasicInfoDetailColumns() {
      return [ {
        fieldCode: "evalNum",
      }, {
        fieldCode: "evalDescription",
      }, {
        fieldCode: "evalStatusMeaning",
      }, {
        fieldCode: "creationDate",
      }, {
        fieldCode: "realName",
      }, {
        fieldCode: "unitId",
      }, {
        fieldCode: "companyId",
      }, {
        fieldCode: "ouId",
      }, {
        fieldCode: "invOrganizationId",
      }, {
        fieldCode: "inventoryId",
      }, {
        fieldCode: "evalType",
      }, {
        fieldCode: "evalTplId",
      }, {
        fieldCode: "weightedFlag",
      }, {
        fieldCode: "evalDateFrom",
      }, {
        fieldCode: "evalDateTo",
      }, {
        fieldCode: "supplierCompanyId",
      }, {
        fieldCode: "supplierContactor",
      }, {
        fieldCode: "supplierContactMail",
      }, {
        fieldCode: "supplierContactPhone",
      }, {
        fieldCode: "needFeedbackFlag",
      }, {
        fieldCode: "callSuppliersFlag",
      }, {
        fieldCode: "supplierType",
      }, {
        fieldCode: "investigationType",
      }, {
        fieldCode: "supplierOverview",
      }, {
        fieldCode: "supplierRegisteredAddress",
      }, {
        fieldCode: "evalAddress",
      }, {
        fieldCode: "evalRemark",
      }, {
        fieldCode: "backRemark",
      } ];
    },
    // 底部按钮
    bottomButtons() {
      return [
        {
          title: this.$T("smbl.common.view.button.cancel").$D("取消"),
          handler: () => {
            this.$router.back();
          },
        },
        {
          title: this.$T("smbl.common.view.save").$D("保存"),
          fill: true,
          handler: () => {
            this.saveAction();
          },
        }
      ];
    },
  },
  beforeMount() {
    this.basicDataSet = new DataSet(reportBasicDS(this.headInfo, "NEW"));
    this.basicDataSet.create(this.headInfo, 0);
  },
  methods: {
    saveAction() {
      if (!this.basicDataSet.validate()) {
        return;
      }
      // 保存时，考察时间至格式改为23:59:59
      if (this.headInfo.evalDateTo.indexOf("00:00:00")) {
        this.headInfo.evalDateTo = this.headInfo.evalDateTo.replace(/00:00:00/g, "23:59:59");
      }
      let payload = {};
      // 处理平台供应商和本地供应商传值，当为平台供应商时传 supplierCompanyId，本地供应商传 supplierId
      if (this.headInfo.supplierSource === "plate") {
        payload = { ...this.headInfo, supplierId:"" };
      } else {
        payload = { ...this.headInfo, supplierCompanyId:"" };
      }
      this.$loading.show();
      creatReportAction(payload).then((res) => {
        if (!res.failed) {
          this.$router.back();
        }
      }).finally(() => {
        this.$loading.hide();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

.report-create {
  width: 100vw;
  height: 100vh;
}

.bottom-space-view {
  height: 72px;
  height: calc(72px + constant(safe-area-inset-bottom));
  height: calc(72px + env(safe-area-inset-bottom));
}

</style>
