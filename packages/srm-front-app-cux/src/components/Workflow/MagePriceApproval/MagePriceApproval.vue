<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.magePrice.view.title.baseInfo').$D('基本信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize
            :columns="getHeaderColumns()"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.magePrice.view.title.lineInfos').$D('行信息')">
        <srm-list
          :data-set="lineInfoDataSet"
          :columns="lineColumns"
          @itemClick="onItemClick"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs } from "./dataSource/lineDs";
import { getBaseInfoApi } from "./api";

export default {
  modules: [ "scux.magePrice", "hipspfm.workFlow" ],
  name: "MagePriceApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      lineInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.magePrice.model.reviewPriceNum").$D("价审单号"),
          fieldCode: "reviewPriceNum",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        // {
        //   fieldName: this.$T("scux.magePrice.model.companyName").$D("流程名称"),
        //   fieldCode: "companyName",
        //   formRow: 2,
        // },
        {
          fieldName: this.$T("scux.magePrice.model.companyName").$D("公司名称"),
          fieldCode: "companyName",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.magePrice.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.magePrice.model.depart").$D("申请人部门"),
          fieldCode: "depart",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.magePrice.model.rfxCreatedByName").$D("申请人"),
          fieldCode: "rfxCreatedByName",
          formRow: 5,
        },
        {
          fieldName: this.$T("scux.magePrice.model.submittedTime").$D("申请时间"),
          fieldCode: "submittedTime",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.magePrice.model.statusMeaning").$D("状态"),
          fieldCode: "statusMeaning",
          formRow: 7,
        },
        {
          fieldName: this.$T("scux.magePrice.model.engineerComments").$D("价审工程师意见"),
          fieldCode: "engineerComments",
          formRow: 8,
        },
        {
          fieldName: this.$T("scux.magePrice.model.extension").$D("是否延期"),
          fieldCode: "extension",
          formRow: 9,
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.magePrice.model.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.magePrice.model.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("scux.magePrice.model.uomName").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName: this.$T("scux.magePrice.model.specs").$D("规格"),
          fieldCode: "specs",
        },
        {
          fieldName: this.$T("scux.magePrice.model.implementPrice").$D("执行单价"),
          fieldCode: "implementPrice",
        },
        {
          fieldName: this.$T("scux.magePrice.model.unitPrice").$D("临时单价"),
          fieldCode: "unitPrice",
        },
        {
          fieldName: this.$T("scux.magePrice.model.unitPrice").$D("原价"),
          fieldCode: "unitPrice",
        },
        {
          fieldName: this.$T("scux.magePrice.model.macioTargetPrice").$D("申请单价"),
          fieldCode: "macioTargetPrice",
        },
        {
          fieldName: this.$T("scux.magePrice.model.inhibitionRate").$D("抑制率(%)"),
          fieldCode: "inhibitionRate",
        },
        {
          fieldName: this.$T("scux.magePrice.model.suppression").$D("抑制金额"),
          fieldCode: "suppression",
        },
        {
          fieldName: this.$T("scux.magePrice.model.rfxQuantity").$D("分配数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldName: this.$T("scux.magePrice.model.quotationExpiryDateFrom").$D("价格有效期从"),
          fieldCode: "quotationExpiryDateFrom",
        },
        {
          fieldName: this.$T("scux.magePrice.model.quotationExpiryDateTo").$D("价格有效期至"),
          fieldCode: "quotationExpiryDateTo",
        },
        {
          fieldName: this.$T("scux.magePrice.model.sourceDocument").$D("来源单据"),
          fieldCode: "sourceDocument",
        },
        {
          fieldName: this.$T("scux.magePrice.model.orderNum").$D("采购申请单号"),
          fieldCode: "orderNum",
        },
      ];
    },
  },
  async mounted() {
    let id = this.changeReqId;
    this.headerInfo = await getBaseInfoApi(id);
    this.lineInfoDataSet.addPathParameter("id", id);
    this.lineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.magePrice.view.title.magePriceApproval").$D(
        "价审审批"
      ),
    );
  },
  methods: {
  },
};
</script>

<style scoped lang="stylus">
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