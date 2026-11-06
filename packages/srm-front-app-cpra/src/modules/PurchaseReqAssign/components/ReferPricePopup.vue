<!--
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 17:08:57
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-12 17:41:56
-->
<template>
  <div class="refer-price-popup">
    <a class="view-price-text" @click="openReferPricePopup">{{ text }}</a>
    <!-- 以弹窗形式显示 -->
    <!--    参考价格列表 -->
    <srm-popup
      :title="title"
      :visible="referPriceListFlag"
      position="bottom"
      rounded
      @onClose="closeReferPricePopup">
      <srm-list :data-set="dataSet" :columns="getColumns" customize-code="SMBL.PURCHASEREQ.ASSIGN.REFERPRICE_LIST" @itemClick="openDetailPoppup"/>
    </srm-popup>
    <!--    参考价格详情页 -->
    <srm-popup
      :title="detailTitle"
      :visible="referPriceDetailFlag"
      position="bottom"
      rounded
      @onClose="closeDetailPopup">
      <srm-form v-if="referPriceDetailFlag" customize-type="detail" :data-set="dataSet" :columns="getDetailColumns" customize-code="SMBL.PURCHASEREQ.ASSIGN.REFERPRICE_FORM"/>
    </srm-popup>
  </div>
</template>

<script>
import { referPriceListDs } from "../datasource/ReferPriceDs";
import { DataSet, $T } from "srm-mobile-ui";
import LadderDetailPopup from "./LadderDetailPopup.vue";
export default {
  name: "ReferPricePopup",
  modules: [ "sprm.purchaseRequisitionAssign", "sprm.common", "smbl.common", "entity.supplier", "sodr.common", "hzero.common", "ssrc.priceLibrary" ],
  props: {
    data: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data() {
    return {
      title: $T("sprm.common.model.common.referPrice").$D("参考价格"),
      text: $T("sprm.common.model.common.viewReferPrice").$D("查看参考价格"),
      detailTitle: $T("sprm.common.model.common.referPriceDetail").$D("查看参考价格详情"),
      dataSet: new DataSet(referPriceListDs()),
      referPriceListFlag: false,
      referPriceDetailFlag: false,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "orderNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            <span>
              {val}
            </span>
          </SrmListHeader>,
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "taxPrice",
        },
        {
          fieldCode: "unitPrice",
        },
        {
          fieldCode: "creationDate",
        }
      ];
    },
    getDetailColumns() {
      return [
        {
          fieldCode: "orderNum",
        },
        {
          fieldCode: "supplierCompanyNum",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "supplierCode",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "taxPrice",
        },
        {
          fieldCode: "unitPrice",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "currencyCode",
        },
        {
          fieldCode: "taxCode",
        },
        {
          fieldCode: "taxRate",
        },
        {
          fieldCode: "ladderInquiryFlag",
          render: (val, item) => item.ladderInquiryFlag === 1 ? <LadderDetailPopup data={item.ladderPriceLibList} /> : null,
        },
        {
          fieldCode: "priceSourceMeaning",
        },
        {
          fieldCode: "validDate",
          render: (val, item) => item.validDateFrom || item.validDateTo ? `${item.validDateFrom || ""} ~ ${item.validDateTo || ""}` : null,
        },
        {
          fieldCode: "creationDate",
        },
      ];
    }
  },
  methods: {
    openReferPricePopup(event) {
      event.stopPropagation();
      this.dataSet.addPathParameter("prLineId", this.data.prLineId);
      this.dataSet.refresh();
      this.referPriceListFlag = true;
    },
    closeReferPricePopup() {
      this.referPriceListFlag = false;
      this.referPriceDetailFlag = false;
    },
    openDetailPoppup() {
      this.referPriceDetailFlag = true;
    },
    closeDetailPopup() {
      this.referPriceDetailFlag = false;
    }
  }
};
</script>

<style lang="stylus" scoped>

.view-price-text{
  color: #276EF1;
}

</style>
