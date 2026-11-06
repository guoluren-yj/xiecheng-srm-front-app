<template>
  <div class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.view.title.detail.basicInfo').$D('基础信息')">
        <srm-list :data-set="headerDataDs" :columns="getHeaderColumns" type="list" @itemClick="() => onItemClick('header')" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.ihg.view.title.ihglineInfos').$D('预提行明细')">
        <srm-list :data-set="lineInfoDataSet" :columns="getLineColumns" type="list" @itemClick="() => onItemClick('line')" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.uuidInfo').$D('附件信息')">
        <srm-list
          :scrollable="false"
          :data-set="headerDataDs"
          :columns="getAttachmentColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getBidPlanDetailBase, getBidPlanDetailLine } from "./api/IhgService.js";
import { lineInfoDs, headerData } from "./dataSource";

export default {
  modules: [
    "hzero.common",
    "scux.acceptBench",
    "scux.view",
    "scux.ihg",
    "scux.nonCollaborativeSupplier",
    "scux.prepaidAmortizationBill",
    "spcm.common",
  ],
  name: "IhgAccrAmortFormApproval",
  props: {
    changeReqId: {
      type: String | Number,
      default: null,
    },
  },
  data() {
    return {
      planId: this.changeReqId,
      bidPlanDetailBaseInfo: [],
      bidPlanDetailLineInfo: [],
      baseInfoColumns: [],
      lineInfoColumns: [],
      headerDataDs: new DataSet(headerData(this.changeReqId)),
      lineInfoDataSet: new DataSet(lineInfoDs(this.changeReqId)),
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "documentNum",
        },
        {
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldCode: "accrAmortPeriod",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "accrAmortAmount",
        },
        {
          fieldCode: "reverseAccrAmount",
        },
      ];
    },
    getHeaderModelColumns() {
      return [
        {
          fieldCode: "documentNum",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "createdByName",
        },
        {
          fieldCode: "accrAmortPeriod",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "accrAmortAmount",
        },
        {
          fieldCode: "reverseAccrAmount",
        },
        {
          fieldCode: "remark",
        },
      ];
    },
    getLineColumns() {
      return [
        {
          fieldCode: "lineNum",
        },
        {
          fieldCode: "accrAmortNum",
        },
        {
          fieldCode: "poNum",
        },
        {
          fieldCode: "poLineNum",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "currentAccrAmortSystemAmount",
        },
        {
          fieldCode: "currentAccrAmortAmount",
        },
        {
          fieldCode: "currentReverseAccrAmount",
        },
        {
          fieldCode: "cumPayTaxIncludedAmount",
        },
      ];
    },
    getLineModelColumns() {
      return [
        {
          fieldCode: "accrAmortNum",
        },
        {
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldCode: "poNum",
        },
        {
          fieldCode: "poLineNum",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "currentAccrAmortSystemAmount",
        },
        {
          fieldCode: "currentAccrAmortAmount",
        },
        {
          fieldCode: "currentReverseAccrAmount",
        },
        {
          fieldCode: "cumPayNetAmount",
        },
        {
          fieldCode: "cumPayTaxIncludedAmount",
        },
      ];
    },
    getAttachmentColumns() {
      return [
        {
          fieldCode: "purchaserInnerAttachmentUuid",
        },
      ];
    },
  },
  mounted() {
    this.headerDataDs.query().then(() => {
      this.lineInfoDataSet.query();
    });
    this.$emit("GetApprovalTitle", this.$T("scux.acceptBench.model.view.biddingApprovalAll").$D("预提单审批"));
  },
  methods: {
    fetchDetailBaseInfo() {
      this.$loading.show();
      getBidPlanDetailBase(this.planId).then((res) => {
        if (res && !res.failed) {
          this.bidPlanDetailBaseInfo = res;
        }
      }).finally(() => {
        this.$loading.hide();
        this.baseInfoColumns = this.getBaseInfoColumns();
        this.fetchDetailLine();
      });
    },
    fetchDetailLine() {
      this.$loading.show();
      getBidPlanDetailLine(this.planId).then((res) => {
        if (res && !res.failed) {
          const { content = [] } = res || {};
          this.bidPlanDetailLineInfo = content;
        }
      }).finally(() => {
        this.$loading.hide();
        this.lineInfoColumns = this.getLineInfoColumns();
      });
    },
    onItemClick(type) {
      const ds = {
        header: this.headerDataDs,
        line: this.lineInfoDataSet,
      };
      const columns = {
        header: this.getHeaderModelColumns,
        line: this.getLineModelColumns,
      };
      const title = {
        header: this.$T("scux.ihg.view.title.baseInfoDetail").$D("基础信息详情"),
        line: this.$T("scux.ihg.view.title.lineInfoDetail").$D("明细行详情")
      };
      this.detailPopup = this.$popup({
        title: title[type],
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "620px",
        rounded:true,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={ds[type]}
          columns={columns[type]}
        />,
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.preserve-format {
   white-space: pre-line; /* 保留换行，合并连续空格 */
}
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>
