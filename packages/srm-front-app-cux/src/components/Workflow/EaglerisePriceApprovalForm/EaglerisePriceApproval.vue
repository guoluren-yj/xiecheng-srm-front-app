<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.eaglerisePrice.view.title.baseInfo').$D('基本信息')">
        <div style="padding-top: 16px;">
          <customize
            :columns="headColumns"
            :need-padding="true"
            type="list"
            :data-source="head"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.eaglerisePrice.view.title.lineInfo').$D('行信息')">
        <srm-list
          :data-set="dataSet"
          :columns="lineColumns"
          @itemClick="onItemClick"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { dateFormat } from "@/utils/index";
import { DataSet } from "srm-mobile-ui";
import indexDs from "./datasource/EagPriceDs";
import {
  getEadglePriceHead
} from "./api/index";
export default {
  modules: [ "scux.eaglerisePrice" ],
  name: "EaglerisePriceApproval",
  components: {
  },
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      treeList: [],
      head: {},
      ReqStatusList: [], //状态
      ReqTypeList: [], //类型
      dataSet: new DataSet(
        indexDs(this.parameters.modelPricingId)
      ),
    };
  },
  computed: {
    headColumns() {
      return [
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "核价单号",
          fieldType: "TEXT",
          fieldCode: "modelPricingNum",
          formRow: 10,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "单据状态",
          fieldType: "TEXT",
          fieldCode: "statusMeaning",
          formRow: 20,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "创建人",
          fieldType: "TEXT",
          fieldCode: "createdByName",
          formRow: 20,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "创建时间",
          fieldType: "TEXT",
          fieldCode: "creationDate",
          formRow: 30,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "价格类型",
          fieldType: "TEXT",
          fieldCode: "priceTypeName",
          formRow: 40,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "业务实体",
          fieldType: "TEXT",
          fieldCode: "ouName",
          formRow: 50,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "库存组织",
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
          formRow: 60,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "供应商名称",
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
          formRow: 70,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "附件",
          fieldType: "UPLOAD",
          fieldCode: "attachmentUuid",
          formRow: 70,
        },
      ];
    },
    lineColumns() {
      return [
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "行号",
          fieldType: "TEXT",
          fieldCode: "lineNum",
          formRow: 1,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "物料编码",
          fieldType: "TEXT",
          fieldCode: "itemCode",
          formRow: 2,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "物料名称",
          fieldType: "TEXT",
          fieldCode: "itemName",
          formRow: 3,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "供应商编码",
          fieldType: "TEXT",
          fieldCode: "supplierCompanyNum",
          formRow: 4,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "供应商名称",
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
          formRow: 5,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "计算明细",
          fieldType: "TEXT",
          fieldCode: "formulaInfo",
          formRow: 6,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "税率",
          fieldType: "TEXT",
          fieldCode: "taxRate",
          formRow: 6,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "含税单价(元)",
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxPrice",
          formRow: 7,
          editor: false,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "不含税单价(元)",
          fieldType: "INPUT_NUMBER",
          fieldCode: "netPrice",
          formRow: 7,
          editor: false,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "有效期从",
          fieldType: "TEXT",
          fieldCode: "validExpiryDateFrom",
          formRow: 8,
          render: (val) =>
            <span>{dateFormat(val)}</span>
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "有效期至",
          fieldType: "TEXT",
          fieldCode: "validExpiryDateTo",
          formRow: 8,
          render: (val) =>
            <span>{dateFormat(val)}</span>
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "最小购买量",
          fieldType: "TEXT",
          fieldCode: "minPurchaseQuantity",
          formRow: 9,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "最低采购金额",
          fieldType: "TEXT",
          fieldCode: "minPurchasePrice",
          formRow: 9,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "小于金额",
          fieldType: "TEXT",
          fieldCode: "minPrice",
          formRow: 10,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "小单金额",
          fieldType: "TEXT",
          fieldCode: "minOrderPrice",
          formRow: 10,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "小于数量",
          fieldType: "TEXT",
          fieldCode: "minAmount",
          formRow: 11,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "最小包装量",
          fieldType: "TEXT",
          fieldCode: "minOrderAmount",
          formRow: 11,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "供货周期(天)",
          fieldType: "TEXT",
          fieldCode: "supplyCycle",
          formRow: 12,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "价格批量",
          fieldType: "TEXT",
          fieldCode: "priceBatchQuantity",
          formRow: 12,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "最小数量拆分",
          fieldType: "TEXT",
          fieldCode: "minimumSplitQuantity",
          formRow: 13,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "配额",
          fieldType: "TEXT",
          fieldCode: "quota",
          formRow: 13,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "单位转换比率",
          fieldType: "TEXT",
          fieldCode: "uomConversionRate",
          formRow: 14,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "双单位",
          fieldType: "TEXT",
          fieldCode: "biUomId",
          formRow: 14,
        },
        {
          // eslint-disable-next-line rulesdir/check_modules
          fieldName: "备注",
          fieldType: "TEXT",
          fieldCode: "materialCheckLineRemark",
          formRow: 15,
        },
      ];
    },
  },
  mounted() {
    this.getApprovalDetail();
  },
  methods: {
    onItemClick() {
      this.$popup({
        showHeader: false,
        showClose: false,
        showBack: false,
        height: "100vh",
        position: "bottom",
        content:
          <SrmForm
            style="padding: 0 15px;"
            customizeType="detail"
            columns={this.lineColumns}
            data-set={this.dataSet}
          />
        ,
      });
    },
    async getApprovalDetail() {
      this.head = await getEadglePriceHead(
        this.parameters.modelPricingId,
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-item-card-head-left {
  max-width: 100% !important;
}
.font-blue {
  color: var(--color-other-default-b);
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
