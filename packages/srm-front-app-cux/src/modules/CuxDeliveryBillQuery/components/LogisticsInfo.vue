<template>
  <hips-popup
    v-model="value"
    class="FullPop"
    style="height:100%;width:100%"
    position="right">
    <div class="container">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img class="image-black-default" src="@/assets/back@3x.png">
        </div>
        <div slot="center" class="header">{{ $T('sinv.common.model.common.logisticsInfo').$D('物流信息') }}</div>
      </hips-nav-bar>
      <div class="Info-header">
        <li>
          <span>{{ $T('sinv.common.model.common.expressNum').$D('快递单号') }}：</span>
          <span>{{ logisticsInfo.expressNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.logisticsCompany').$D('物流公司') }}：</span>
          <span>{{ logisticsInfo.logisticsCompanyMeaning }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.logisticsStaff').$D('配送人员') }}：</span>
          <span>{{ logisticsInfo.logisticsStaff }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.logisticsContactInfo').$D('联系方式') }}：</span>
          <span>{{ logisticsInfo.logisticsContactInfo }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.recipientMobileNum').$D('收件人手机后四位') }}：</span>
          <span>{{ logisticsInfo.logisticsPhoneNum|CalcPhoneNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.logisticsCost').$D('物流费用') }}：</span>
          <span>{{ logisticsInfo.logisticsCost }}</span>
        </li>
      </div>
      <div class="Info-main">
        <div class="Info-refresh">
          <span class="Info-refresh-text">{{ $T('sinv.common.model.common.lastUpdateDate').$D('最后一次更新时间') }}
            <i v-if="infoList && infoList.creationDate">{{ infoList.creationDate }}</i>
            <i v-else> - </i>
          </span>
          <hips-button type="primary" ripple @click="getLogisticsInfoAsync"> {{ $T('sinv.common.model.message.button.refresh').$D('刷新') }}</hips-button>
        </div>
        <hips-timeline v-if="infoList && infoList.asnLogisticsDtoList && infoList.asnLogisticsDtoList.length !== 0" class="Info-content">
          <hips-timeline-item
            v-for="(item,index) in infoList.asnLogisticsDtoList"
            :key="index"
            :title="item.actionMining"
            :content="item.AcceptStation">
            <div class="time-item">
              <div class="time-date">{{ item.AcceptTime | CalcDate }}</div>
              <div class="time-clock">{{ item.AcceptTime | CalcClock }}</div>
            </div>
          </hips-timeline-item>
        </hips-timeline>
        <div v-else class="no-content">{{ $T('sinv.common.model.common.noLogistics').$D('暂无物流信息') }}</div>
      </div>
    </div>
  </hips-popup>
</template>
<script>
import { View, NavBar, Icon, Timeline, TimelineItem, Scroll, Popup, Button } from "hips";
import { getLogisticsDetailsApi, getLogisticsInfoApi } from "../api/index";
export default {
  modules: [ "sinv.common" ],
  name: "LogisticsInfo",
  components: {
    [View.name]: View,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Timeline.name]: Timeline,
    [TimelineItem.name]: TimelineItem,
    [Button.name]: Button,
  },
  filters:{
    CalcPhoneNum(val) {
      if (val) {
        if (val.length <= 4) {
          return Number(val);
        }
        return Number(val.slice(val.length - 4, val.length));

      }
      return "";
    },
    CalcDate(v) {
      return v ? v.split(" ")[0] ? v.split(" ")[0] : v : "";
    },
    CalcClock(v) {
      return v ? v.split(" ")[1] ? v.split(" ")[1] : v : "";
    },
  },
  props: {
    "value": {
      type: Boolean,
      default: false,
    },
    "id": {
      type: Number | String,
      default: 0,
    },
    "logisticsInfo":{
      type: Object,
      default:() => ({})
    }
  },
  data() {
    return {
      infoList: {}
    };
  },
  watch:{
    infoList() {
      if (this.infoList && this.infoList.asnLogisticsDtoList) {
        this.infoList.asnLogisticsDtoList = this.infoList.asnLogisticsDtoList.reverse();
      }
    }
  },
  async mounted() {
    this.$loading.show();
    await this.getLogisticsDetails();
    this.$loading.hide();
  },
  methods: {
    async getLogisticsDetails() {
      getLogisticsDetailsApi(this.id).then((res) => {
        if (res && !res.failed && res.status !== 500) {
          this.infoList = res[0];
          if (!this.infoList || !this.infoList.asnLogisticsDtoList) {
            this.getLogisticsInfoAsync();
          }
        } else {
          this.$notification.open({
            message: res.message,
            key,
            class: "notification",
          });
        }
      });
    },
    async getLogisticsInfoAsync() {
      this.$loading.show();
      getLogisticsInfoApi(this.id).then((res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          this.infoList = { ...this.infoList, ...res[0] };
        } else {
          this.$notification.open({
            message: res.message,
            key,
            class: "notification",
          });
        }
      });
    },
    closePop() {
      this.$emit("input", false);
    }
  }
};
</script>
<style lang="stylus" scoped>
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight:bold;
}
.container {
  position relative
}
.Info-header {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color:var(--color-font-default);
  font-weight: bold;
  padding: 12px 20px 8px 20px;
  border-bottom:8px solid var(--color-border-default);
  li {
    line-height: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
}
.no-content{
  margin 20px
}
.Info-main {
  margin-top: 4px;
  background:var(--color-bg-default);
  height: 470px;
  overflow auto

  .Info-refresh{
    display flex
    padding 6px 20px 0 20px
    align-items center
    justify-content space-between
    .Info-refresh-text{
      font-size 14px
      color:var(--color-font-default);
      font-family: PingFangSC-Medium;
    }
  }

  >>> .hips-timeline {
    height: 63px;
  }

  .Info-content {
    margin: 16px 15px 0px 90px;
    position: relative;

    .time-item {
      position: absolute;
      top: -2px;
      left: -70px;

      .time-date {
        text-align: right;
        font-size: 12px;
        color:var(--color-font-default);
        font-family: PingFangSC-Medium;
      }

      .time-clock {
        font-size: 10px;
        color:var(--color-font-default-b);
      }
    }
  }
}

>>> .hips-timeline-item__head {
  height: 8px
  width: 8px;
}
>>> .hips-timeline-item__head--blue {
  border-color: var(--color-other-default-b);
  color: var(--color-other-default-b);
}
>>> .hips-timeline-item {
  color:var(--color-font-default-b);
}
>>> .hips-timeline-item:nth-child(1) {
  color:var(--color-font-default);
}
>>> .hips-button{
  padding 0 16px
}
</style>