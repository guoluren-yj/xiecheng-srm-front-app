<!--
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-06 17:08:57
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-11 02:07:44
-->
<template>
  <div class="refer-price-popup">
    <a class="view-price-text" @click="openPoppup()">{{ text }}</a>
    <!-- 以弹窗形式显示 -->
    <!--    阶梯价格列表 -->
    <srm-popup
      :title="title"
      :visible="visible"
      position="bottom"
      rounded
      @onClose="closePopup()">
      <srm-list v-if="visible" :data-set="dataSet" :columns="getColumns"/>
    </srm-popup>
  </div>
</template>

<script>
import { ladderPriceListDs } from "../datasource/LadderPricePoppupDs";
import { DataSet, $T } from "srm-mobile-ui";
export default {
  name: "ReferPricePopup",
  modules: [ "sprm.purchaseRequisitionAssign", "sprm.common", "smbl.common", "entity.supplier", "sodr.common", "hzero.common", "ssrc.priceLibrary" ],
  props: {
    data: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      title: $T("sodr.common.model.common.ladderPrice").$D("阶梯价格"),
      text: $T("sodr.common.model.common.viewLadderPrice").$D("查看参考价格"),
      dataSet: new DataSet(ladderPriceListDs()),
      visible: false,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "ladderLineNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            <span>
              {val}
            </span>
          </SrmListHeader>,
        },
        {
          fieldCode: "numberRange",
          render: (val, item) => `[${item.ladderFrom},${item.ladderTo})`,
        },
        {
          fieldCode: "ladderPrice",
        },
        {
          fieldCode: "ladderPriceRemark",
        },
      ];
    },
  },
  methods: {
    openPoppup() {
      (this.data || []).forEach((item) => {
        this.dataSet.create(item, 0);
      });
      this.visible = true;
    },
    closePopup() {
      this.visible = false;
    }
  }
};
</script>

<style lang="stylus" scoped>

.view-price-text{
  color: #276EF1;
}

</style>
