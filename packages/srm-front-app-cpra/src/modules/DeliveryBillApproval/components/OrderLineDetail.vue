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
          @click="closeLineInfoDetail">
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
          <span>{{ $T('sinv.purchaseReception.view.message.lineNum').$D('行号') }}：{{ lineInfoDetail.displayAsnLineNum }}</span>
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
          <li>
            <span>{{ $T('sinv.common.model.common.num').$D('数量') }}：</span>
            <span>{{ lineInfoDetail.quantity }}</span>
          </li>
          <li class="edit-wrap">
            <span>{{ $T('sinv.common.model.common.canShipQuantity').$D('可发货') }}：</span>
            <span>{{ lineInfoDetail.canShipQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.unit').$D('单位') }}：</span>
            <span>{{ lineInfoDetail.uomName }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.theShipQuantity').$D('本次发货') }}：</span>
            <span>{{ lineInfoDetail.shipQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.unitPackageQuantity').$D('单包装数') }}：</span>
            <span>{{ lineInfoDetail.unitPackageQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.packageQuantity').$D('件数') }}：</span>
            <span>{{ lineInfoDetail.packageQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.remainderQuantity').$D('尾数') }}：</span>
            <span>{{ lineInfoDetail.remainderQuantity }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.lotNum').$D('批次号') }}：</span>
            <span>{{ lineInfoDetail.lotNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.purchaseReception.message.lotExpirationDate').$D('批次有效期') }}：</span>
            <span>{{ lineInfoDetail.lotExpirationDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.productionDate').$D('生产日期') }}：</span>
            <span>{{ lineInfoDetail.productionDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.shelfLife').$D('保质期') }}：</span>
            <span>{{ lineInfoDetail.shelfLife|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：</span>
            <span>{{ lineInfoDetail.neededDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.promiseDeliveryDate').$D('承诺交货日期') }}：</span>
            <span>{{ lineInfoDetail.promisedDate|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.displayPoNum').$D('订单号') }}：</span>
            <span>{{ lineInfoDetail.displayPoNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：</span>
            <span>{{ lineInfoDetail.displayLineNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.serialNum').$D('序列号') }}：</span>
            <span>{{ lineInfoDetail.serialNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.displayReleaseNum').$D('发放号') }}：</span>
            <span>{{ lineInfoDetail.displayReleaseNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.versionNum').$D('版本') }}：</span>
            <span>{{ lineInfoDetail.versionNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.contactInfo').$D('联系人') }}：</span>
            <span>{{ lineInfoDetail.contactInfo }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.invoiceNum').$D('发票号') }}：</span>
            <span>{{ lineInfoDetail.invoiceNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.purchaseRemark').$D('采购方行备注') }}：</span>
            <span>{{ lineInfoDetail.purchaseRemark }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.suppliersRemark').$D('供应商备注') }}：</span>
            <span>{{ lineInfoDetail.remark }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.lineAattachment').$D('行附件') }}：</span>
            <span
              style="color: var(--color-other-default-b);"
              @click="showFilePop(lineInfoDetail.attachmentUuid||uuid)">{{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.product.number').$D('商品编码') }}：</span>
            <span>{{ lineInfoDetail.productNum }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.product.name').$D('商品名称') }}：</span>
            <span>{{ lineInfoDetail.productName }}</span>
          </li>
          <li>
            <span>{{ $T('sinv.common.model.common.catalog.name').$D('商品目录') }}：</span>
            <span>{{ lineInfoDetail.catalogName }}</span>
          </li>
          <li v-if="getTenantNum === 'SRM-SANJIANG'">
            <span>{{ $T('sinv.common.model.common.materialBarcode').$D('物料条码') }}：</span>
            <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
          </li>
          <li v-if="getTenantNum === 'SRM-SANJIANG'">
            <span>{{ $T('sinv.common.model.common.packageQuantity').$D('件数') }}：</span>
            <span>{{ lineInfoDetail.attributeBigint1 }}</span>
          </li>
          <li v-if="getTenantNum === 'SRM-SANJIANG'">
            <span>{{ $T('sinv.common.model.common.poUnitPrice').$D('含税单价') }}：</span>
            <span>{{ lineInfoDetail.attributeDecimal3 }}</span>
          </li>
          <li v-if="getTenantNum === 'SRM-SANJIANG'">
            <span>{{ $T('sinv.common.model.common.taxIncludedUnitPrice').$D('含税行金额') }}：</span>
            <span>{{ lineInfoDetail.attributeDecimal4 }}</span>
          </li>
          <li v-if="getTenantNum === 'SRM-SANJIANG'">
            <span>{{ $T('sinv.common.model.common.excludingTaxPrice').$D('不含税行金额') }}：</span>
            <span>{{ lineInfoDetail.attributeDecimal5 }}</span>
          </li>
          <li v-if="getTenantNum === 'SRM-SANJIANG'" @click="clickToViewStoreDetail">
            <span>{{ $T('sinv.common.model.common.storeDetail').$D('门店明细') }}：</span>
            <span style="color: var(--color-other-default-b);">
              {{ $T('sinv.common.model.common.clickToView').$D('点击查看') }}
            </span>
          </li>
        </ul>
      </div>
      <hips-popup v-model="storeInfoShow" style="height:80%;width:100%" class="FullPop" position="bottom">
        <div class="BigContainer">
          <hips-nav-bar slot="header" :have-border="false">
            <div
              slot="left"
              class="left-button"
              @click="closeStoreInfoDetail">
              <img class="image-black-default" src="@/assets/icon_navigationbars_off_normal@3x.png" >
            </div>
            <div
              slot="center"
              class="header">
              {{ $T('hipspfm.common.model.common.storeDetail').$D('门店明细') }}
            </div>
          </hips-nav-bar>
          <div class="prequalification-detail">
            <ul>
              <li v-for="store in storeList" :key="store.asnStoreId" class="store-item">
                <div class="store-info-line">
                  <div class="store-info-title">{{ $T('sinv.common.model.common.storeName').$D('门店名称') }}：</div>
                  <div class="store-info-content">{{ store.storeName }}</div>
                </div>
                <div class="store-info-line">
                  <div class="store-info-title">{{ $T('sinv.common.model.common.shippedQuantitys').$D('需求数量') }}：</div>
                  <div class="store-info-content">{{ store.needQuantity }}</div>
                </div>
                <div class="store-info-line">
                  <div class="store-info-title">{{ $T('sinv.common.model.common.sendQuantity').$D('发货数量') }}：</div>
                  <div class="store-info-content">{{ store.shipQuantity }}</div>
                </div>
                <div class="store-line-view"/>
              </li>
            </ul>
          </div>
        </div>
      </hips-popup>
    </div>
  </hips-popup>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import { View, Input, Popup, NavBar } from "hips";
import { getStoreInfoList } from "../api/index";
export default {
  modules: [ "hipspfm.common", "sinv.purchaseReception", "sinv.common" ],
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
    closeLineInfoDetail: {
      type: Function
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
    }
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    clickToViewStoreDetail() {
      this.storeList = [];
      this.storeInfoShow = true;
      this.$loading.show();
      getStoreInfoList(this.lineInfoDetail.asnLineId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.storeList = res.content;
        }
      });
    },
    closeStoreInfoDetail() {
      this.storeInfoShow = false;
      this.storeList = [];
    }
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
    height: calc(100vh - 250px);
    overflow: auto;

    ul {
      li {
        display: flex;
        border-bottom:1px solid var(--color-border-default);
        padding: 16px 20px 15px 0;

        &:last-child {
          align-items: center;
        }

        >>> .hips-input {
          width: 209px;
          padding: 0;
        }

        >>> .hips-input__input-value input::-webkit-input-placeholder {
          color:var(--color-font-default-b);
        }

        >>> .hips-input:first-child:after {
          border-top: none;
        }

        span {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default);
          line-height: 22px;

          img {
            width: 16px;
            height: 16px;
            float: right;
          }
        }

        .status {
          color: var(--color-other-default-c) !important;
        }

        .edit {
          display: flex;
          justify-content: space-between;

          span {
            color:var(--color-font-default-b);
          }

          >>> .hips-switch__input {
            width: 36px !important;
            height: 22px !important;
          }

          >>> .hips-switch__input:after {
            width: 20px !important;
            height: 20px !important;
          }
        }

        .edit-input {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        span:nth-child(1) {
          width: 28vw;
        }

        span:nth-child(2) {
          width: 237px;
          color:var(--color-font-default-b);
        }

        span.fileBtn {
          color: var(--color-other-default-b);
        }
      }

      .store-item {
        display: flex;
        flex-direction: column;
        .store-info-line {
          width: 100%;
          margin-top: 8px;
          margin-bottom: 8px;
          display: flex;
          flex-direction: row;
        }
        .store-info-title {
          font-size: 14px;
          color: var(--color-font-default);
        }
        .store-info-content {
          font-size: 14px;
          margin-left: 12px;
          color: var(--color-font-default-b);
        }
      }

      .edit-wrap {
        align-items: center;
      }
    }
  }
}
</style>
