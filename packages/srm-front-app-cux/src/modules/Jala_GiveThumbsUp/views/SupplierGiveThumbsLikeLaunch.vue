<template>
  <div style="height: 100vh">
    <nav-head
      :title="$T('scux.supplierGiveThumbsUp.view.message.likeLanuch.details').$D('发起明细')"
      @goClose="goClose"
      @goBack="goBack"/>
    <srm-form class="jala-like-launch-form" :data-set="likeLaunchDataDs" :columns="getLikeLaunchColumns"/>
    <srm-bottom-handler
      :btn-arr="getBtnArr"
      type="action-sheet"/>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { likeLaunchData } from "../datasource/index";
import { fetchLikeRelease } from "../api/index";
import NavHead from "./NavHead.vue";
import ChooseValueMedal from "./ChooseValueMedal";

export default {
  modules: [ "scux.supplierGiveThumbsUp", "hzero.common" ],
  name: "SupplierGiveThumbsLikeLaunch",
  components: { NavHead },
  data() {
    return {
      likeLaunchDataDs: new DataSet(likeLaunchData()),
      headerInfo: {},
      jalaLikeLineList: [],
      likeLanuchPopup: null,
    };
  },
  computed: {
    // 点赞发起
    getLikeLaunchColumns() {
      return [ {
        fieldCode: "supplierId",
        options: {
          multiple: false,
          callback: this.changeFieldCallBack,
        },
      }, {
        fieldCode: "coinQuantity",
      }, {
        fieldCode: "likeAssort",
      },
      {
        fieldCode: "likeAssortDimensionOne",
        required: (val, data, _, record) => record?.get("likeAssort") === "INNOVATION",
        visible: (val, data, _, record) => record?.get("likeAssort") === "INNOVATION",
        lovCode: "SCUX_JALA_LIKE_DIMENSION_INNOVATION",
        options: {
          multiple: false,
          valueField: "meaning",
          callback: this.changelikeAssortCallBack,
        },
      },
      {
        fieldCode: "likeAssortDimensionTwo",
        required: (val, data, _, record) => record?.get("likeAssort") === "PRAISE",
        visible: (val, data, _, record) => record?.get("likeAssort") === "PRAISE",
        lovCode: "SCUX_JALA_LIKE_DIMENSION_PRAISE",
        options: {
          multiple: false,
          valueField: "meaning",
          callback: this.changelikeAssortCallBack,
        },
      }, {
        fieldCode: "remark",
        placeholder: $T("scux.supplierGiveThumbsUp.model.remark.tootip").$D("不少于15字，包含供应商、事件、行为"),
      }, ];
    },
    // 点赞底部按钮
    getBtnArr() {
      return [
        {
          title: <span>{$T("scux.supplierGiveThumbsUp.view.button.select.coin").$D("选择勋章")}<span style="color: red;margin-left: 5px">{this.jalaLikeLineList.length}{$T("scux.supplierGiveThumbsUp.model.pieces").$D("枚")}</span></span>,
          handler: () => {
            this.handleSelectCoin();
          },
        },
        {
          title: $T("scux.supplierGiveThumbsUp.view.button.release").$D("发布"),
          color: "var(--color-other-default)",
          handler: () => {
            this.handleRelease();
          },
        },
      ];
    },
  },
  mounted() {
    this.likeLaunchDataDs.create({
      supplierId: null,
      likeAssortDimensionOne: null,
      likeAssortDimensionTwo: null,
      remark: null,
    });
  },
  methods: {
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        // eslint-disable-next-line
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 供应商回调
    changeFieldCallBack(value) {
      const { companyName, supplierTenantId, companyNum } = value[0] || {};
      this.headerInfo["supplierName"] = companyName;
      this.headerInfo["supplierTenantId"] = supplierTenantId;
      this.headerInfo["supplierCode"] = companyNum;
    },
    // 点赞行为回调
    changelikeAssortCallBack(val) {
      const { value } = val[0] || {};
      this.likeLaunchDataDs.set(0, "likeAssortDimension", value);
    },
    // 发布
    async handleRelease() {
      if (this.jalaLikeLineList.length === 0) {
        this.$notification.open({
          message: $T("scux.supplierGiveThumbsUp.message.selected.one.coin").$D("请至少选择一枚勋章!"),
          class: "notification",
        });
        return;
      }
      const validFlag = this.likeLaunchDataDs.validate();
      if (validFlag) {
        const headerData = this.likeLaunchDataDs.current.data;
        try {
          this.$loading.show();
          const response = await fetchLikeRelease({ ...headerData, ...this.headerInfo, jalaLikeLineList: this.jalaLikeLineList });
          if (response && !response.failed) {
            this.$notification.open({
              message: $T("scux.supplierGiveThumbsUp.message.sending.succeeded").$D("发送成功"),
              class: "notification"
            });
            this.$router.push({
              name: "SupplierGiveThumbsUp",
            });
          }
        } finally {
          this.$loading.hide();
        }
      }
    },
    // 确认
    handleLikeLanuchConfirm(list = []) {
      const currentList = Object.values(list);
      const confirmList = [ "INNOVATION_SURMOUNT", "CLIENT_SUPREME", "COOPERATE_WIN", "ALTRUISM", "TRUSTWORTHY", "RESPONSIBILITY", "MASTER", "USE_NUMBER", "PURSUE" ];
      const filterList = currentList.filter((i) => confirmList.includes(i));
      this.jalaLikeLineList = filterList.map((i) => ({ medalType: i }));
      this.likeLanuchPopup.closePopup();
    },
    // 选择勋章
    handleSelectCoin() {
      this.likeLanuchPopup = this.$popup({
        title: $T("scux.supplierGiveThumbsUp.view.title.choose.values.medal").$D("选择价值观勋章"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        content: <ChooseValueMedal handleLikeLanuchConfirm={this.handleLikeLanuchConfirm} />,
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
>>>.srm-field-wrapper-fill {
  height: 50px;
  margin-bottom: 10px;
}
</style>
