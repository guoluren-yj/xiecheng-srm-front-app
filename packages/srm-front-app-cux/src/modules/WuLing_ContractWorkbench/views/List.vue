<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="dataSet[type]"
      :columns="getColumns"
      :buttons="getButtons"
      @itemClick="itemClick">
      <srm-tab-bar slot="filter"
                   :tabs="[
                     $T('spcm.workspace.view.tabPane.toBeSigned').$D('待签署'),
                     $T('spcm.workspace.view.tabPane.all').$D('全部')
                   ]"
                   display="justify"
                   :active-index="currentTab"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
  </div>
</template>

<script>
import { indexDs } from "../datasource/indexDs";
import { DataSet, $T } from "srm-mobile-ui";
import { batchSilentSignatureApi } from "../api";

const colorConfigList = [
  {
    // 黄色
    status: [
      "PENDING",
      "SUBMITTED",
      "SUBMITTED_WFL",
      "DELIVERY_DATE_REVIEW",
      "CLOSEING",
      "CANCELING",
      "CHANGE_TO_APPROVAL",
      "APPROVAL_PENDING",
      "INVALID_TO_APPROVAL",
      "TERMINATION_TO_APPROVAL",
      "ARCHIVE_TO_APPROVAL",
      "TERMINATION_CONFIRM",
      "REPLENISHING",
      "UN_PUBLISHED",
      "PURCHASER_SIGN_CONTRACT",
      "SUPPLIER_SIGN_CONTRACT",
    ],
    color: "warn",
  },
  {
    // 绿色
    status: [ "APPROVED", "PUBLISHED", "EFFECTED", "CONFIRMED", "ARCHIVE", "HAVE_ALTERATION", "SUPPLEMENT_COMPLETE" ],
    color: "success",
  },
  {
    // 红色
    status: [ "REJECTED", "DISABLED", "DELIVERY_DATE_REJECT", "SUPPLIER_REJECTED" ],
    color: "danger",
  },
  {
    // 灰色
    status: [ "DELETED", "TERMINATION", "CANCELLATION", "EXPIRED", "VALID", "FIRST_EDITION", ],
    color: "info",
  },
];

export default {
  modules: [ "spcm.workspace", "spcm.common", "scux.spcm", "sprm.common" ],
  name: "WuLingContractWorkbench",
  data() {
    return {
      dataSet: {
        // awaitSubmit: new DataSet(indexDs("awaitSubmit")),
        // approving: new DataSet(indexDs("approving")),
        approved: new DataSet(indexDs("approved")),
        all: new DataSet(indexDs("all")),
      },
      type: "approved",
      currentTab: 0,
    };
  },
  computed: {
    getButtons() {
      return [
        {
          text: $T("scux.spcm.view.button.workspace.wuling.cuxBatchSilentSignature").$D("批量静默签"),
          fill: true,
          visible: this.type === "approved",
          size: "large",
          disabled: (checkedList) => checkedList.length === 0,
          callback: (selected) => {
            this.$loading.show();
            batchSilentSignatureApi(selected.map((record) => record.data)).then((res) => {
              if (res && res.failed) {
                this.$notification.open({ message: res.message });
              } else {
                this.$notification.open({ message: $T("hzero.common.notification.success").$D("操作成功") });
                this.dataSet[this.type].refresh();
              }
            }).finally(() => {
              this.$loading.hide();
            });
          },
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "pcNum",
          fieldType: "EMPTY",
          render: (val, item) => {
            const pcStatusCode = item.pcStatusCode;
            const type = colorConfigList.find((i) => i.status.includes(pcStatusCode))?.color || "success";
            return <SrmListHeader>
              <span>
                {item.pcNum}
              </span>
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={type}>
                {item.pcStatusCodeMeaning}
              </SrmButton>
            </SrmListHeader>;
          },
        },
        {
          fieldCode: "pcName",
          fieldName: $T("scux.spcm.view.button.workspace.wuling.cuxContractName").$D("合同名称"),
        },
        {
          fieldCode: "companyName",
          fieldName: $T("spcm.workspace.model.companyName").$D("公司"),
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("spcm.workspace.supplierCompanyName").$D("供应商"),
        },
        {
          fieldCode: "purchaseAgentName",
          fieldName: $T("spcm.common.model.common.agentName").$D("采购员"),
        },
        {
          fieldCode: "taxIncludeAmount",
          fieldName: $T("scux.spcm.view.button.workspace.wuling.cuxAllPrice").$D("不含税总计"),
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("spcm.workspace.model.shareMangement.creationDate").$D("创建时间"),
        },
      ];
    },
  },
  activated() {
    this.dataSet[this.type].refresh();
  },
  methods: {
    onTabIndexChange(index) {
      this.currentTab = index;
      switch (index) {
      // case 0:
      //   this.type = "awaitSubmit";
      //   break;
      // case 1:
      //   this.type = "approving";
      //   break;
      case 0:
        this.type = "approved";
        break;
      case 1:
        this.type = "all";
        break;
      default:
        break;
      }
      this.dataSet[this.type].refresh();
    },
    itemClick(item) {
      const { pcHeaderId, companyId } = item?.data || {};
      this.$router.push({
        name: "WuLing_ContractWorkbench_Detail",
        query: {
          pcHeaderId,
          companyId,
          isChapter: this.type === "approved",
        }
      });
    },
  }
};
</script>
