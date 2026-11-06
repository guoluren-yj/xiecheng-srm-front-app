<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup v-model="showLineDetail" class="FullPop" style="height: 100%;width:100%" position="bottom">
    <section class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closeLineInfoDetail">
          <img class="image-gray-default" src="@/assets/icon_close_normal@3x.png" alt="">
        </div>
        <div slot="center" class="header">{{ $T("hipspfm.supplierLifeCycle.view.title.concatInfo").$D("联系人信息") }}</div>
      </hips-nav-bar>
      <div class="lineBody">
        <li>
          <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.name").$D("姓名") }}：</span>
          <span>{{ lineInfoDetail.name }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.supplierDetail.contactsData.gender").$D("性别") }}：</span>
          <span>{{ lineInfoDetail.gender === 0 ? $T("hipspfm.common.gender.female").$D("女") : $T("hipspfm.common.gender.male").$D("男") }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mail").$D("邮箱") }}：</span>
          <span>{{ lineInfoDetail.mail }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.mobilephone").$D("手机号码") }}：</span>
          <span>{{ lineInfoDetail.mobilephone }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.telephone").$D("固定电话") }}：</span>
          <span>{{ lineInfoDetail.telephone }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.supplierDetail.contactsData.department").$D("部门") }}：</span>
          <span>{{ lineInfoDetail.department }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.supplierDetail.contactsData.position").$D("职位") }}：</span>
          <span>{{ lineInfoDetail.position }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.supplierDetail.contactsData.description").$D("备注") }}：</span>
          <span>{{ lineInfoDetail.description }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplierDetail.model.suDe.contactsData.defaultFlag").$D("默认联系人") }}：</span>
          <span v-if="lineInfoDetail.defaultFlag === 1" class="font-blue">{{ $T("hipspfm.common.status.yes").$D("是") }}</span>
          <span v-else-if="lineInfoDetail.defaultFlag === 0" >{{ $T("hipspfm.common.status.no").$D("否") }}</span>
        </li>
        <li>
          <span>{{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：</span>
          <span v-if="lineInfoDetail.enabledFlag === 1" class="font-blue">{{ $T("hipspfm.common.status.enabledFlag.enable").$D("启用") }}</span>
          <span v-else-if="lineInfoDetail.enabledFlag === 0" class="font-red">{{ $T("hipspfm.common.status.enabledFlag.disable").$D("禁用") }}</span>
        </li>
        <div class="line-div">
          <span class="line-block"/>
        </div>
      </div>
    </section>
  </hips-popup>
</template>

<script>
import { Popup, NavBar } from "hips";
import uuid from "uuid";

export default {
  modules: [ "hipspfm.supplierLifeCycle", "sslm.supplierDetail", "hipspfm.common" ],
  name:"ContactsDetail",
  components: {
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
  },
  props:{
    "value": { // 弹出层状态
      type: Boolean,
      default: false,
    },
    "lineInfoDetail": { // 弹出层内容
      type: Object,
      default: () => ({}),
    },
    "showFilePop":{
      type: Function,
      default: () => ({})
    },
    "queryParams": {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      uuid: ""
    };
  },
  computed: {
    showLineDetail:{
      get() {
        return this.value;
      },
      // eslint-disable-next-line no-unused-vars
      set(val) {
      }
    }
  },
  mounted() {
    this.uuid = uuid();
  },
  methods:{
    closeLineInfoDetail() {
      this.showLineDetail = false;
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.lineInfoDetail {
  height: 100%;
  display:flex;
  flex-direction: column;
  background-color:var(--color-font-default-d);
  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    font-weight:700;
    line-height: 26px;
  }
  .font-blue{
    color: var(--color-other-default-b) !important;
  }
  .font-red{
    color: var(--color-other-default) !important;
  }
  .lineBody {
    background-color:var(--color-font-default-d);
    overflow: auto;
    li {
      display: flex;
      padding: 16px 20px  15px 0;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);
      &:nth-of-type(1){
        // padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
        &:nth-child(1){
          width:31%;
        }
        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 60%;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;
          img{
            width:12px;
            height:12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }
    .line-div{
      height: 34px;
      display: flex;
      justify-content: center;
      .line-block{
        width:35.7%;
        height:6px;
        // border-radius:100px;
        // background-color : #000000;
        position:relative;
        bottom:-18px;
      }
    }
  }
}
</style>