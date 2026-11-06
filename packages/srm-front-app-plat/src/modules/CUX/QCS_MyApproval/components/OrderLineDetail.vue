<template>
  <hips-popup
    v-model="value"
    style="height:100%;width:100%"
    class="FullPop"
    position="bottom"
    :overlay-on-click-close="false"
    @click-overlay="closePop">
    <div class="BigContainer">
      <hips-nav-bar slot="header" :have-border="false">
        <div
          v-if="showBackFlag"
          slot="left"
          class="left-button"
          @click="closePop">
          <img class="image-black-default" src="@/assets/icon_navigationbars_off_normal@3x.png" >
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息') }}
        </div>
      </hips-nav-bar>
      <section class="headInfo">
        <li class="lineNum">
          <span>{{ $T('sinv.purchaseReception.view.message.lineNum').$D('行号') }}：{{ lineInfoDetail.displayLineNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.itemCode').$D('物料编码') }}：{{ lineInfoDetail.itemCode }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.itemName').$D('物料名称') }}：{{ lineInfoDetail.itemName }}</span>
        </li>
      </section>
      <div class="prequalification-detail">
        <ul>
          <CustomizeDetail :columns="getColumns" :data-source="lineInfoDetail" />
        </ul>
      </div>
    </div>
  </hips-popup>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import { View, Input, Popup, NavBar } from "hips";
export default {
  modules: [ "hipspfm.common","sinv.purchaseReception","sinv.common","sodr.common","spcm.common","sodr.sendOrder","mallf.common" ],
  name: "OrderLineDetail",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    lineInfoDetail: {
      type: Object
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      uuid: uuid(),
      storeInfoShow: false,
      storeList: []
    };
  },
  computed: {
    getTenantNum() {
      return SrmUtil.getTenantNum();
    },
    getColumns() {
      const columns = [
        {
          fieldName: "商品品类",
          fieldCode: "categoryName",
          langCode: "sinv.common.model.common.itemCategoryName",
        },
        {
          fieldName: "单位",
          fieldCode: "uomName",
          langCode: "sodr.common.model.unit",
        },
        {
          fieldName: "数量",
          fieldCode: "quantity",
          langCode: "sodr.common.model.common.purLineCount",
        },
        {
          fieldName: "税率",
          fieldCode: "taxRate",
          langCode: "sodr.common.model.common.taxRates",
        },
        {
          fieldName: "含税单价(含运费)",
          fieldCode: "taxIncludedUnitPrice",
          langCode: "sodr.common.model.common.includingTaxAndFreightPrice",
        },
        {
          fieldName: "本地含税行金额",
          fieldCode: "lineFreight",
          langCode: "spcm.common.model.common.purchaseTaxLineAmount",
        },
        // {
        //   fieldName: "行运费",
        //   fieldCode: "",
        //   langCode: "sprm.common.model.common.lineFreight",
        // },
        {
          fieldName: "需求日期",
          fieldCode: "requestDate",
          langCode: "sodr.sendOrder.model.common.needByDate",
        },
        {
          fieldName: "供应商",
          fieldCode: "supplierName",
          langCode: "sodr.common.model.common.erpSupplierCode",
        },
        {
          fieldName: "CMS合同号",
          fieldCode: "",
          langCode: "mallf.common.model.CMS.num",
        },
        {
          fieldName: "费用承担部门",
          fieldCode: "",
          langCode: "mallf.common.view.cost.shopping.bumen",
        },
        {
          fieldName: "写字楼/店铺/仓库",
          fieldCode: "invOrganizationName",
          langCode: "mallf.common.view.costShopWarehouse",
        },
        {
          fieldName: "附件",
          fieldCode: "",
          langCode: "sodr.sendOrder.view.button.attachment",
          render: () => {
            return <span style="color: #276EF1">{this.$T("sinv.common.button.viewAttachment").$D("查看附件")}</span>;
          },
          callBack: () => {
            this.showFilePop();
          }
        },
      ];
      return columns;
    }
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
  }
};
</script>

<style lang="stylus" scoped>
.BigContainer {
  position: relative;
  height: 100%;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  .right-button {
    margin-right: 8px;

    img {
      margin-right: 12px;
      height: 24px;
      width: 24px;
    }
  }

  .headInfo {
    padding: 12px 20px 12px 20px;
    border-bottom: solid 8px var(--color-border-default);

    li {
      display: flex;
      margin-bottom: 4px;
      justify-content: space-between;

      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color:var(--color-font-default);
        line-height: 24px;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .lineNum {
      span {
        font-size: 16px;
        color: var(--color-font-default-e);
      }
    }
  }

  .prequalification-detail {
    padding-bottom: 49px;
    padding-left: 20px;
    height: calc(100vh - 116px);
    overflow: auto;
  }
}
</style>
