<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("").$D("订单编辑") }}
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
          {{ $T("").$D("请填写商品信息") }}
        </span>
      </div>
      <div v-if="supplyItemList.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <div v-for="(li,index) in supplyItemList" :key="index" class="card">
          <ul>
            <li>
              <span>{{ $T("").$D("商品名称") }}</span>
              <div>{{ li.itemName }}</div>
            </li>
            <li>
              <span>{{ $T("").$D("交付价格") }}</span>
              <div>
                <hips-input
                  v-model="li.deliverPrice"
                  :placeholder="$T('').$D('请输入交付价格')"
                  type="number"/>
                <img class="img-edit" src="@/assets/4.0/icon_List_editor_normal@3x.png" alt>
              </div>
            </li>
            <li>
              <span>{{ $T("").$D("交付数量") }}</span>
              <div>
                <hips-input
                  v-model="li.deliverQuantity"
                  :placeholder="$T('').$D('请输入交付数量')"
                  type="number"/>
                <img class="img-edit" src="@/assets/4.0/icon_List_editor_normal@3x.png" alt>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <BottomHandler id="btn" :btn-arr="btnArr"/>
  </hips-view>
</template>

<script>
import {
  View,
  Popup,
  Input,
  NavBar,
  Scroll, Checkbox, CheckboxGroup,
} from "hips";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import BottomHandler from "@/components/BottomHandler";
import {
  createSupplyDetail, submitSupplyDetail
} from "../api/index";

export default {
  name: "SJSupplyItemDetailEdit",
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
      height: "height: calc(100vh - 148px)",
      noHeadHeight: "height: calc(100vh - 104px)",
      tenantId: window.localStorage.getItem("tenantId"),
      btnArr: [
        {
          title: this.$T("").$D("提交"),
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            for (let i = 0; i < this.supplyItemList.length; i++) {
              const supplyItem = this.supplyItemList[i];
              if (!supplyItem.deliverPrice) {
                this.$notification.open({
                  message: this.$T("").$D("交付价格为必填"),
                  key,
                  class: "notification",
                  duration: 3
                });
                return;
              }
              if (!supplyItem.deliverQuantity) {
                this.$notification.open({
                  message: this.$T("").$D("交付数量为必填"),
                  key,
                  class: "notification",
                  duration: 3
                });
                return;
              }
            }
            this.$loading.show();
            createSupplyDetail(this.supplyItemList).then((res) => {
              if (res && res.length) {
                submitSupplyDetail(res).then((msg) => {
                  let message;
                  if (msg && msg.message) {
                    message = msg.message;
                    this.$notification.open({
                      message,
                      key,
                      class: "notification",
                      duration: 3
                    });
                  } else {
                    message = "提交成功";
                    this.$notification.open({
                      message,
                      key,
                      class: "notification",
                      duration: 3
                    });
                    this.$router.back();
                  }
                }).finally(() => {
                  this.$loading.hide();
                });
              } else {
                this.$loading.hide();
              }
            }).catch((err) => {
              this.$loading.hide();
            });
          }
        },
      ],
      poHeaderId: null,
      agentName: null,
      poHeader: {},
      supplyItemList: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.supplyItemList = this.$store.state.CUXSanjiang_SupplyItemDetailCreate.supplyItemList;
    this.$forceUpdate();
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
    overflow-y scroll;

    >>> .hips-cell {
      padding: 0 !important;
    }

    .card {
      border-bottom: 1px solid #F5F6FA;
      margin: 0 15px;

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

          >>> .hips-input {
            padding: 0 !important;
          }
        }
      }
    }
  }
}

>>> .bscroll-indicator {
  display: none !important;
}
</style>
