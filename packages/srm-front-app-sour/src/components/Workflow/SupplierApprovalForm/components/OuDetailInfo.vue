<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div slot="left" class="left-button" @click="showOuInfoPop">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('sslm.supplierInform.view.title.changeSupplier').$D('供应商信息变更') }}</div>
    </hips-nav-bar>
    <div class="prequalification-detail">
      <div v-if="ouInfo.length">
        <ul v-for="(item,index) in ouInfo" :key="index">
          <li >
            <span>{{ $T('sslm.supplierInform.model.supplierInform.supplierAddress').$D('供应商地点') }}：</span>
            <span>{{ item.companyName }}</span>
          </li>

          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.OULayer').$D('OU层') }}：</span>
            <span>{{ item.ouName }}</span>
          </li>
          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.payMethod').$D('付款方式') }}：</span>
            <span>{{ item.typeName }}</span>
          </li>
          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.ticketDay').$D('票据天数') }}：</span>
            <span>{{ item.ticketDay }}</span>
          </li>
          <li>
            <span>{{ $T('sslm.supplierInform.view.model.supplierInform.supplyPoint').$D('付款条件') }}：</span>
            <span>{{ item.termName }}</span>
          </li>
          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.bankCode').$D('银行代码') }}：</span>
            <span>{{ item.bankCode }}</span>
          </li>
          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.bankName').$D('银行名称') }}：</span>
            <span>{{ item.bankName }}</span>
          </li>
          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.depositBank').$D('开户行名称') }}：</span>
            <span>{{ item.bankBranchName }}</span>
          </li>

          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.bankAccountNum').$D('银行账号') }}：</span>
            <span>{{ item.bankAccountNum }}</span>
          </li>

          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.bankFirm').$D('联行行号') }}：</span>
            <span>{{ item.bankFirm }}</span>
          </li>

          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.taxRate').$D('税率') }}：</span>
            <span>{{ item.taxRate }}</span>
          </li>

          <li>
            <span>{{ $T('sslm.supplierInform.model.supplierInform.currencyName').$D('币种') }}：</span>
            <span>{{ item.currencyName }}</span>
          </li>

          <li >
            <span>{{ $T('sslm.supplierInform.model.supplierInform.layerCreationDate').$D('层创建日期') }}：</span>
            <span>{{ item.createDate }}</span>
          </li>

          <li >
            <span>{{ $T('sslm.supplierInform.model.supplierInform.layerExpirationDate').$D('层失效日期') }}：</span>
            <span>{{ item.expirationDate }}</span>
          </li>

          <!-- 底部留白 -->
          <!-- <section class="no-more"></section> -->
        </ul>
      </div>
      <!-- 空白页 -->
      <no-content v-else img-src="NoOrder@3x.png" />
    </div>
  </hips-view>
</template>

<script>
import { View, NavBar } from "hips";
import NoContent from "@/components/NoContent";
export default {
  modules: [ "hipspfm.common", "sslm.supplierInform", "smbl.common" ],
  name: "OuDetailInfo",
  components: {
    NoContent,
    [View.name]: View,
    [NavBar.name]: NavBar
  },
  props: {
    showOuInfoPop: {
      type: Function,
    },
    ouInfo: {
      type: Array,
      default: () => [],
    }
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
      createDeliveryApi([ this.detailInfo ]).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.dialog.alert({
            title: this.$T("smbl.common.button.create.error").$D("创建失败"),
            content: res.message,
            okText: this.$T("hipspfm.common.view.button.gotIt").$D("我知道了"),
          });
        } else {
          const asnHeaderId = res.asnHeaderId;
          this.$router.replace({ name: "DeliveryDetail", query: { asnHeaderId } });
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
  padding: 16px 20px 12px 20px;
  border-bottom:8px solid var(--color-border-default);

  li {
    display: flex;
    margin-bottom: 8px;
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
  // padding-left: 20px;
  padding-bottom: 80px;
  height: calc(100vh - 50px);
  overflow: auto;

  ul {
    border-bottom:8px solid var(--color-border-default);
    li {
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      margin-left: 20px;
      padding: 20px 20px 12px 0;

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
