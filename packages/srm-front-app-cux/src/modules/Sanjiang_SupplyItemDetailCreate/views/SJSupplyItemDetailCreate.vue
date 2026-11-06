<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("").$D("订单维护") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_top_default_blank@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_closed_default_blank@3x.png"
            alt
            @click="goBack">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="tab-box">
        <span class="tab-item-active">
          {{ $T("").$D("请选择您供货的商品") }}
        </span>
      </div>
      <div class="tab-box">
        <span>代办：</span>
        <span>{{ agentName }}</span>
      </div>
      <div v-if="poLineList.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <srm-checkbox-group v-model="selectedList" :selection="poLineList ? poLineList.length : 0">
          <srm-checkbox v-for="(li,index) in poLineList" :key="index" class="checkbox-row" :option="index">
            <div class="card">
              <ul>
                <li class="code">
                  <span>{{ li.itemName || ' ' }}</span>
                  <span class="item-uom">单位：{{ li.uomName }}</span>
                </li>
              </ul>
            </div>
          </srm-checkbox>
        </srm-checkbox-group>
      </div>
    </div>
    <bottom-handler id="btn" :btn-arr="btnArr"/>
  </hips-view>
</template>

<script>
import {
  View,
  Popup,
  Input,
  NavBar,
  Scroll,
} from "hips";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import BottomHandler from "@/components/BottomHandler";
import {
  getOrderHeader, getOrderLine, getUserConfig
} from "../api/index";
import { SrmUtil } from "srm-mobile-ui";

export default {
  name: "SJSupplyItemDetailCreate",
  components: {
    BottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      finishLoad: false,
      poLineList: [], //列表数据
      height: "height: calc(100vh - 184px)",
      noHeadHeight: "height: calc(100vh - 140px)",
      tenantId: window.localStorage.getItem("tenantId"),
      btnArr: [
        {
          title: this.$T("").$D("确认"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            if (this.selectedList.length === 0) {
              return;
            }
            const supplyItemList = [];
            this.selectedList.forEach((e) => {
              const data = this.poLineList[e];
              supplyItemList.push({
                //订单号
                poNum: this.poHeader.displayPoNum,
                //客户 取订单上的客户
                companyId: this.poHeader.companyId,
                companyName: this.poHeader.companyName,
                //需求日期
                needByDate: data.needByDate,
                //需求数量
                quantity: data.quantity,
                //商品名称
                itemName: data.itemName,
                itemId: data.itemId,
                itemCode: data.itemCode,
                //产成率 取订单行上的产成率（1.8迭代需求）
                productRate: data.attributeVarchar5,
                //代办
                agencyUserName: this.agentName,
                agencyUserId: this.agentId,
                //农户
                peasantUserId: this.userInfo.id,
                peasantUserName: this.userInfo.realName,
                //产地
                productAddress: this.userConfig.regionName,
                //产地id
                productAddressId: this.userConfig.regionId,
                //交付价格
                deliverPrice: null,
                //交付数量
                deliverQuantity: null,
                //单位 取订单行上的单位
                uomId: data.uomId,
                uomCode: data.uomCode,
                uom: data.uomName,
                //提交时间
                //订单号
                //poNum: this.poHeader.poNum,
                poHeaderId: this.poHeader.poHeaderId,
                //行号
                poLineId: data.poLineId,
                poLineLocationId: data.poLineLocationId,
                poLineNum: data.poLineNum
              });
            });
            this.$store.commit("CUXSanjiang_SupplyItemDetailCreate/setSupplyItemList", supplyItemList);
            this.$router.push({ name: "SJSupplyItemDetailEdit" });
          }
        },
      ],
      poHeaderId: null,
      poHeader: {},
      selectedList: [],
      userInfo: {},
      userConfig: {},
      agentName: null,
      agentId: null
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    try {
      this.$loading.show();
      this.poHeaderId = this.$route.query.poHeaderId;
      this.agentId = this.$route.query.agentId;
      this.agentName = this.$route.query.agentName;
      this.userInfo = SrmUtil.getUserInfo();
      console.log(this.userInfo);
      await this.fetchData();
      this.finishLoad = true;
      this.$forceUpdate();
      this.$loading.hide();
    } catch (err) {
      this.finishLoad = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    //退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    // 请求数据
    async fetchData() {
      this.finishLoad = false;
      this.$loading.show();
      getUserConfig(this.userInfo.id).then((res) => {
        this.userConfig = res;
      });
      getOrderHeader(this.poHeaderId).then((res) => {
        this.poHeader = res;
      });
      await getOrderLine(this.poHeaderId, this.agentId).then((res) => {
        if (res && res.content) {
          this.totalCount = res.totalElements;
          this.poLineList.push.apply(this.poLineList, res.content.filter((e) => e.displayStatusCode === "CONFIRMED"));
        } else {
          this.poLineList = [];
        }
      }).finally(() => {
        this.finishLoad = true;
        this.$loading.hide();
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

.tab-box {
  padding: 15px 20px;

  .tab-item {
    margin-right: 15px;
    color: #1B1E2B
  }

  .tab-item-active {
    margin-right: 15px;
    color: #3473FF
  }
}

>>> .hips-cell {
  line-height: 4.4vw !important;
}

.left-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #1B1E2B;
  line-height: 24px;
  font-weight: bold;

  img {
    height: 12.7px;
    width: 15.3px;
    margin-right: 10.7px;
  }
}

.right-button {
  margin-right: 15px;
  z-index: 1;
  color: var(--color-font-default-f);

  span {
    display: flex;
    align-items: center;
    width: 77px;
    height: 32px;
    padding: 7px 10px;
    background: var(--color-bg-default);
    border: 1px solid var(--color-border-default);
    border-radius: 18px;

    i {
      margin: 0px 8px;
    }
  }

  img {
    height: 18px;
    width: 18px;
  }
}

.content {
  font-family: PingFangSC-Regular;
  font-size: 14px;

  >>> .hips-ellipsis {
    font-size: 16px;
    color: #1B1E2B;
  }

  .scrollWrap {
    font-size: 14px;
    overflow: scroll;

    >>> .hips-checkbox__checked {
      position: absolute !important;
      top: 3vw !important;
      left: 20px !important;
    }

    >>> .hips-cell {
      padding: 0 !important;
    }

    .checkbox-row {
      padding-left: 15px;
      &:last-child {
        margin-bottom: constant(safe-area-inset-bottom);
        margin-bottom: env(safe-area-inset-bottom);
      }
    }
    .card {
      border-bottom: 1px solid #F5F6FA;
      margin: 0;
      width: 100%;

      ul {
        li {
          padding-top: 8px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 14px;
          color: #1B1E2B;

          &:nth-child(2) span {
            line-height: 22px;

            &:nth-child(1) {
              width: 224px;
            }
          }

          span {
            line-height: 20px;
          }

          &:last-child {
            margin-top: 6px;
            margin-bottom: 12px;
          }

          &:last-child span {

            span {
              background: rgba(65, 70, 96, 0.1);
              border-radius: 2px;
              font-size: 10px;
              color: #414660;
              line-height: 22px;
              text-align: center;
              padding: 0px 8px;
            }

            span:nth-child(2) {
              margin-left: 8px;
            }
          }
        }

        .code {
          padding-left: 8px;
          font-weight: bold;
          margin-top: 4px;
          .item-uom {
            margin-left: 15px;
          }
        }
      }
    }

    >>> .hips-group:last-child {
      border-bottom: 0 !important;
    }
  }
}

>>> .bscroll-indicator {
  display: none !important;
}
</style>
