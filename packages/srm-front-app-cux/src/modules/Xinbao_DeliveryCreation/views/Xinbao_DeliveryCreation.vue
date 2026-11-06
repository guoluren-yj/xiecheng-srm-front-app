<template>
  <hips-view style="background: #f0f2f5">
    <nav-head title="APS送货计划"/>
    <div class="header-wrapper">
      <srm-lov-field v-model="company" code="SPFM.USER_AUTHORITY_COMPANY" theme="fill" placeholder="请选择分公司">
        <span slot="left">分公司：</span>
      </srm-lov-field>
      <div style="display: flex;justify-content: space-between">
        <div style="width: 100%;">
          <srm-calendar-field v-model="poHeader.date" theme="fill" placeholder="请选择计划送货日期">
            <span slot="left">计划送货日期：</span>
          </srm-calendar-field>
          <srm-lov-field v-model="company" code="SPFM.USER_AUTHORITY_COMPANY" theme="fill" placeholder="请选择采购单号">
            <span slot="left">采购单号：</span>
          </srm-lov-field>
        </div>
        <div class="scan-box" @click="scanCode">
          <img src="@/assets/4.0/icon_16px_line_scan_highlight@3x.png" alt="">
          扫码
        </div>
      </div>
    </div>
    <div class="content">
      <div class="tab-button-wrap">
        <span :class="tabIndex === 0 ? 'tab-button-active': ''">未扫描</span>
        <span :class="tabIndex === 1 ? 'tab-button-active': ''">已扫描</span>
      </div>
      <div class="tab-content">
        <customize need-padding :data-source="poHeader" :columns="columns"/>
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
} from "hips";
import BottomHandler from "@/components/BottomHandler";
import NavHead from "@/components/NavHead";
import { SrmCalendarField, SrmLovField } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common" ],
  name: "Xinbao_DeliveryCreation",
  components: {
    SrmLovField,
    SrmCalendarField,
    NavHead,
    BottomHandler,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  data() {
    return {
      finishLoad: false,
      poHeader: {},
      poLineList: [], //列表数据
      btnArr: [
        {
          title: "生成送货单",
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.$hips.dialog.confirm({
              title: "",
              content: "确认生成送货单",
              okText: this.$T("hipspfm.common.button.ok").$D("确定"),
              cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
              asyncClose: true,
              closable: false,
              onOk: () => {
              },
              onCancel() {
              }
            });
          }
        },
      ],
      poHeaderId: null,
      company: null,
      tabIndex: 0,
      columns: [ {
        fieldCode: "poNum",
        fieldName: "采购单号",
        langCode: "",
        seq: 1,
      }, {
        fieldCode: "lineNum",
        fieldName: "行号",
        langCode: "",
        seq: 2,
      }, {
        fieldCode: "needNum",
        fieldName: "需求分类号",
        langCode: "",
        seq: 3,
      }, {
        fieldCode: "itemCode",
        fieldName: "物料编码",
        langCode: "",
        seq: 4,
      }, {
        fieldCode: "itemName",
        fieldName: "物料名称",
        langCode: "",
        seq: 5,
      }, {
        fieldCode: "size",
        fieldName: "规格",
        langCode: "",
        seq: 6,
      }, {
        fieldCode: "quantity",
        fieldName: "数量",
        langCode: "",
        seq: 7,
      }, {
        fieldCode: "scanNum",
        fieldName: "扫码数",
        langCode: "",
        seq: 7,
      }, ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 请求数据
    fetchData() {
    },
    scanCode() {

    }
  }
};
</script>

<style lang="stylus" scoped>
.header-wrapper {
  padding 16px 15px;
  background #fff;

  .srm-field-wrapper-container {
    margin-bottom 12px;
  }
}

.scan-box {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.08);
  display flex;
  flex-direction column;
  align-items center;
  justify-content center;
  width 80px;
  margin-left 15px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  color: #276ef1;
  line-height: 16px;
  font-size: 12px;
  margin-bottom 12px;

  img {
    width: 24px;
    height 24px;
  }
}

.content {
  background #fff;
  margin-top 8px;
}

.tab-button-wrap {
  display flex;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;

  span {
    flex 1;
    font-size: 14px;
    text-align: center;
    color: #afafaf;
    line-height: 20px;
    padding-top 12px;
    padding-bottom 12px;
  }

  .tab-button-active {
    color: #276ef1;
  }
}

.tab-content {
  min-height 30vh;
}
</style>
