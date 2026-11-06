<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/CUX/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('hipspfm.createDelivery.view.title.orderDetails').$D('订单明细') }}</div>
    </hips-nav-bar>
    <section class="headInfo">
      <li class="lineNum">
        <span>{{ $T('sinv.common.model.common.asnLineNum').$D('行号') }}：{{ detailInfo.displayLineNum }}</span>
      </li>
      <li>
        <span>{{ $T('sinv.common.model.common.itemCode').$D('物料编码') }}：{{ detailInfo.itemCode }}</span>
      </li>
      <li>
        <span>{{ $T('sinv.common.model.common.itemName').$D('物料名称') }}：{{ detailInfo.itemName }}</span>
      </li>
    </section>

    <div class="prequalification-detail">
      <ul>
        <li >
          <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}：</span>
          <span>{{ detailInfo.companyName }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.supplierName').$D('公司') }}：</span>
          <span>{{ detailInfo.supplierCompanyName }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.orderTypeName').$D('订单类型') }}：</span>
          <span>{{ detailInfo.orderTypeName }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.agentId').$D('采购员') }}：</span>
          <span>{{ detailInfo.purchaseAgentName }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.organizationName').$D('收货组织') }}：</span>
          <span>{{ detailInfo.invOrganizationName }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.shipToLocationAddress').$D('收货地址') }}：</span>
          <span>{{ detailInfo.shipToThirdPartyAddress }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.inventoryName').$D('库房') }}：</span>
          <span>{{ detailInfo.inventoryName }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.locationName').$D('库位') }}：</span>
          <span>{{ detailInfo.locationName }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.actualReceiverName').$D('送达方') }}：</span>
          <span>{{ detailInfo.shipToThirdPartyName }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：</span>
          <span>{{ detailInfo.needByDate|CalcDate }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.promiseDeliveryDate').$D('承诺日期') }}：</span>
          <span>{{ detailInfo.promiseDeliveryDate|CalcDate }}</span>
        </li>

        <li>
          <span>{{ $T('sinv.common.model.common.immedShippedFlag').$D('是否直发') }}：</span>
          <span>{{ detailInfo.immedShippedFlagMeaning }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.sourcePlatform').$D('订单来源') }}：</span>
          <span>{{ detailInfo.poSourcePlatformMeaning }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.displayReleaseNum').$D('发放号') }}：</span>
          <span>{{ detailInfo.releaseNum }}</span>
        </li>
        <li >
          <span>{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：</span>
          <span>{{ detailInfo.displayLineNum }}</span>
        </li>
        <li >
          <span>{{ $T('sinv.common.model.common.displayLineLocationNum').$D('发运号') }}：</span>
          <span>{{ detailInfo.displayLineNum }}</span>
        </li>
        <li >
          <span>{{ $T('sinv.common.model.common.matchQuantity').$D('匹配数量') }}：</span>
          <span>{{ detailInfo.quantity }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.shippableQuantity').$D('可发货数量') }}：</span>
          <span>{{ detailInfo.canAsnQuantity }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.receivedQuantity').$D('净接收') }}：</span>
          <span>{{ detailInfo.netDeliverQuantity }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.shippedQuantity').$D('累计发货') }}：</span>
          <span>{{ detailInfo.shippedQuantity }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.unit').$D('单位') }}：</span>
          <span>{{ detailInfo.uomName }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.contactsInfo').$D('联系人信息') }}：</span>
          <span>{{ detailInfo.shipToThirdPartyContact }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.product.number').$D('商品编码') }}：</span>
          <span>{{ detailInfo.productNum }}</span>
        </li>
        <li >
          <span>{{ $T('sinv.common.model.common.product.name').$D('商品名称') }}：</span>
          <span>{{ detailInfo.productName }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.catalog.name').$D('商品目录') }}：</span>
          <span>{{ detailInfo.catalogName }}</span>
        </li>

        <li >
          <span>{{ $T('sinv.common.model.common.purchaseRemark').$D('采购方行备注') }}：</span>
          <span>{{ detailInfo.purchaseRemark }}</span>
        </li>

        <!-- 底部留白 -->
        <section class="no-more"/>
      </ul>
    </div>

    <div class="handler-bottom" @click="createDelivery">
      {{ $T('hipspfm.createDelivery.view.tab.cretae').$D('创建') }}
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar } from "hips";
import {
  createDeliveryApi,
} from "../api/index";
export default {
  modules: [ "hipspfm.createDelivery","hipspfm.common","sinv.common" ],
  name: "jjy_CreateDeliveryDetail",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar
  },
  data() {
    return {
      detailInfo: {}
    };
  },
  mounted() {
    this.detailInfo = this.$route.query;
  },
  methods: {
    // 创建送货单
    createDelivery() {
      this.$loading.show();
      createDeliveryApi([ this.detailInfo ]).then((res)=>{
        this.$loading.hide();
        if (res.failed) {
          this.$hips.dialog.alert({
            title: this.$T("hipspfm.createDelivery.view.message.creationFailed").$D("创建失败"),
            content: res.message,
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
          });
        } else {
          const asnHeaderId = res[0].asnHeaderId;
          this.$router.replace({ name: "jjy_DeliveryDetail",query: { asnHeaderId } });
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
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
  border-bottom:8px solid var(--color-border-default);

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

      &:nth-child(1) {
        font-weight: bold;
      }
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
  padding-left: 20px;
  padding-bottom: 80px;
  height: calc(100vh - 180px);
  overflow: auto;

  ul {
    li {
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 15px 20px 15px 0;

      &:last-child {
        align-items: center;
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
      }

      span:nth-child(1) {
        width: 105px;
      }

      span:nth-child(2) {
        width: 230px;
        color:var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-other-default-b);
      }
    }

    .edit-wrap {
      align-items: center;
    }
  }
}

.handler-bottom{
  width: 100%;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  font-weight: bold;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27,30,43,0.05);
  position: fixed;
  bottom: 0;
  text-align: center;
  z-index: 555;
}
</style>
