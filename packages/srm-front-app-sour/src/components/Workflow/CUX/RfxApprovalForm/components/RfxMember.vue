<template>
  <hips-popup
    v-model="show"
    style="height: 100%;width:100%"
    :overlay-on-click-close="true"
    position="bottom">
    <hips-view>
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="show = false">
          <img src="@/assets/back@3x.png" >
        </div>
        <div slot="center" class="header">{{ $T('ssrc.inquiryHall.model.inquiryHall.inquiryGroup').$D("寻源小组") }}</div>
      </hips-nav-bar>
      <section class="headStyle">
        <div>
          <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.sourceNum').$D("寻源单号") }}：{{ rfxHeader.rfxNum }}</span>
        </div>
        <div>
          <span>{{ $T('ssrc.inquiryHall.view.sourceNum.title').$D("寻源单标题") }}：{{ rfxHeader.rfxTitle }}</span>
        </div>
      </section>

      <ul v-for="(member, index) in members" :key="index" class="card">
        <li>
          <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.inquiryRole').$D("角色") }}：{{ member.rfxRoleMeaning }}</span>
          <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.userName').$D("用户名") }}：{{ member.loginName }}</span>
        </li>
        <li>
          <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.name").$D("名称") }}：{{ member.realName }}</span>
          <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.passwordEnableFlag	').$D("启用开标密码") }}：{{ member.openPassword }}</span>
        </li>
        <li>
          <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.phone').$D("手机") }}：{{ member.phone }}</span>
        </li>
        <li>
          <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.Email").$D("邮箱") }}：{{ member.email }}</span>
        </li>
      </ul>
    </hips-view>
  </hips-popup>
</template>

<script>
import { NavBar, Popup, View } from "hips";
import { getRfxMembers } from "../api/RfxApproveApi";

export default {
  modules: [ "ssrc.inquiryHall" ],
  name: "RfxMember",
  components: {
    [Popup.name]: Popup,
    [View.name]: View,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    rfxHeader: {
      type: Object
    }
  },
  data() {
    return {
      show: false,
      members: []
    };
  },
  watch: {
    value(val) {
      this.show = val;
      if (val) {
        this.fetchMembers();
      }
    },
    show(val) {
      if (!val) {
        this.$emit("onclose");
      }
    }
  },
  mounted() {},
  methods: {
    fetchMembers() {
      this.$loading.show();
      getRfxMembers(this.rfxHeader.rfxHeaderId)
        .then((res) => {
          this.members = res;
        })
        .finally(() => {
          this.$loading.hide();
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.headStyle {
  padding: 10px 20px 16px 20px;
  border-bottom: solid 8px #F0F2F5;
  font-weight: bold;

  span {
    line-height: 24px;
    font-size: 16px;
    display: inline-block;
    color: #1B1E2B;
  }
}

ul {
  padding: 10px 20px 16px 20px;
  border-bottom: 2.133vw solid #f0f2f5;

  li {
    display: flex;
    justify-content: space-between;
    line-height: 32px;
    height: 32px;
    margin-top: 2px;
    font-size: 14px;
    color: var(--color-font-default);

    &:first-child {
      margin-top: 8px;
    }

    > span {
      flex: 1;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .fileBtn {
        color: var(--color-other-default-b);
      }
    }

    > span:nth-child(odd) {
      text-align: left;
    }
  }
}
</style>
