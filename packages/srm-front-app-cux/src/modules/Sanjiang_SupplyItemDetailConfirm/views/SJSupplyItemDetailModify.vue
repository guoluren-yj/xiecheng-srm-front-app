<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("").$D("供货明细") }}
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
      <div class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <div class="card">
          <ul>
            <li>
              <span>{{ $T("").$D("订单号") }}：</span>
              <div class="item-desc">{{ item.poNum }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("客户") }}：</span>
              <div class="item-desc">{{ item.companyName }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("需求日期") }}：</span>
              <div class="item-desc">{{ item.needByDate }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("需求数量") }}：</span>
              <div class="item-desc">{{ item.quantity }}</div>
            </li>
          </ul>
        </div>
        <div class="card">
          <ul>
            <li>
              <span class="code">{{ $T("").$D("商品信息") }}</span>
            </li>
            <li>
              <span>{{ $T("").$D("商品名称") }}：</span>
              <div class="item-desc">{{ item.itemName }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("产成率") }}：</span>
              <div class="item-desc">{{ item.productRate }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("待办") }}：</span>
              <div class="item-desc">{{ item.agencyUserName }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("农户") }}：</span>
              <div class="item-desc">{{ item.peasantUserName }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("产地") }}：</span>
              <div>{{ item.productAddress }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("交付价格") }}</span>
              <div>
                <hips-input
                  v-model="item.deliverPrice"
                  :placeholder="$T('').$D('请输入交付价格')"
                  type="number"
                  :readonly="item.status === 'CONFIRMED'"/>
                <img v-if="item.status === 'CONFIRMED'" class="img-edit" src="@/assets/icon_list_editor_disabled@3x.png" alt>
                <img v-else class="img-edit" src="@/assets/icon_editor@3x.png" alt>
              </div>
            </li>
            <li>
              <span>{{ $T("").$D("交付数量") }}</span>
              <div>
                <hips-input
                  v-model="item.deliverQuantity"
                  :placeholder="$T('').$D('请输入交付数量')"
                  type="number"
                  :readonly="item.status === 'CONFIRMED'"/>
                <img v-if="item.status === 'CONFIRMED'" class="img-edit" src="@/assets/icon_list_editor_disabled@3x.png" alt>
                <img v-else class="img-edit" src="@/assets/icon_editor@3x.png" alt>
              </div>
            </li>
            <li>
              <span>{{ $T("").$D("单位") }}：</span>
              <div class="item-desc">{{ item.uom }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("状态") }}：</span>
              <div class="item-desc">{{ item.statusMeaning }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("付款情况") }}：</span>
              <div class="item-desc">{{ item.payFlag ? "已付款" : "未付款" }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("提交时间") }}：</span>
              <div class="item-desc">{{ item.creationDate }}</div>
            </li>
            <li>
              <span/>
              <div/>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <BottomHandler v-if="item.status === 'WAIT_CONFIRM'" id="btn" :btn-arr="btnArr"/>
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
  getSupplyDetailApi,
  confirmSupplyDetailApi
} from "../api/index";

export default {
  name: "SupplyItemConfirm",
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
      item: {},
      height: "height: calc(100vh - 104px)",
      noHeadHeight: "height: calc(100vh - 60px)",
      tenantId: window.localStorage.getItem("tenantId"),
      btnArr: [ {
        title: this.$T("").$D("确认"),
        color: "var(--color-other-default-b)",
        background: "var(--color-bg-default)",
        handler: () => {
          const supplyItem = this.item;

          if (!supplyItem.deliverPrice) {
            this.$notification.open({
              message: this.$T("").$D("交付价格为必填"),
              class: "notification",
              duration: 3
            });
            return;
          }
          if (!supplyItem.deliverQuantity) {
            this.$notification.open({
              message: this.$T("").$D("交付数量为必填"),
              class: "notification",
              duration: 3
            });
            return;
          }
          this.$loading.show();
          confirmSupplyDetailApi([ this.item ]).then((res) => {
            if (res && res.length) {
              this.$notification.open({
                message: this.$T("").$D("确认成功"),
                class: "notification",
                duration: 3
              });
              this.goBack();
            }
            this.fetchData();
          }).finally(() => {
            this.$loading.hide();
          });
        }
      }, ],
      supplyDetailId: null,
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    try {
      this.$loading.show();
      this.supplyDetailId = this.$route.query.supplyDetailId;
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
      await getSupplyDetailApi(this.supplyDetailId).then((res) => {
        if (res) {
          this.item = res;
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
    overflow-y scroll;

    >>> .hips-checkbox__checked {
      position: absolute !important;
      top: 3vw !important;
      left: 20px !important;
    }

    >>> .hips-cell {
      padding: 0 !important;
    }

    .card {
      border-bottom: 1px solid #F5F6FA;
      margin: 0 15px;

      .code {
        margin-top 25px;
        color: #1B1E2B;
        font-weight bold;
        font-size 16px;
      }

      ul {
        li {
          padding-top: 8px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 14px;
          color: #1B1E2B;

          span {
            display: inline-block;
            font-size: 12px;
            font-weight: 400;
            color: #82879e;
            line-height: 16px;
            margin-top 10px;
            margin-bottom 10px;
          }

          img {
            width: 16px;
            height: 16px;
          }

          div {
            display: flex;
            justify-content space-between;
            align-items center;
          }

          .item-desc {
            display: flex;
            justify-content space-between;
            align-items center;
            margin-top 8px;
            margin-bottom 8px;
          }

          >>> .hips-input {
            padding: 0 !important;
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
