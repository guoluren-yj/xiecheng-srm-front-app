<template>
  <!-- 寻源单详情 头信息 -->
  <div class="approval-detail-container">
    <div class="approval-detail-scroll-el">
      <!-- 明细信息 -->
      <context-detail v-if="rfxHeaderId" ref="RfxDetailPop" :change-req-id="rfxHeaderId" :document-type="documentType" @changeSection="init()"/>

      <!-- 获取底部的高度 -->
      <div v-if="getBtnArr.length > 0" class="approval-detail-bottom"/>
    </div>
    <!-- 底部按钮 -->
    <div v-if="headInfo.rfxStatus==='OPEN_BID_PENDING' && bidStatusMap.showOpenButtonFlag===1" class="button-container">
      <srm-button size="x-large" fill @click="openBidAction">{{ $T("ssrc.inquiryHall.view.message.title.openingBid").$D("开标") }}</srm-button>
    </div>
    <srm-popup :visible.sync="openBidActionViewFlag" :height="headInfo.passwordFlag ? '174px' : '110px'" width="100%" position="center" :show-header="false">
      <div class="open-bid-action-view">
        <div class="open-bid-title">{{ headInfo.passwordFlag ? $T("ssrc.inquiryHall.model.inquiryHall.openingBidPassword").$D("开标密码") : ($T("ssrc.inquiryHall.view.message.confirm.sureOpeningBid").$D("是否确认开标") + "?") }}</div>
        <div v-if="headInfo.passwordFlag" class="open-bid-message">{{ $T("ssrc.inquiryHall.model.inquiryHall.inputBidPassword").$D("输入开标密码") }}</div>
        <srm-flex v-if="headInfo.passwordFlag" class="password-view" style="width: calc(100% - 40px);">
          <srm-input-field v-model="openPassword" type="password" :placeholder="$T('ssrc.inquiryHall.model.inquiryHall.openingBidPassword').$D('开标密码')" :show-icon="false"/>
          <div class="resend-password" @click="resendPasswordAction">{{ $T("ssrc.inquiryHall.view.message.button.resendPassword").$D("重发密码") }}</div>
        </srm-flex>
        <srm-flex class="popup-buttons">
          <srm-button size="x-large" style="background: var(--background-color-empty); color: var(--font-color-default); border-radius: 0px;" @click="openBidActionViewFlag = false">{{ $T("smbl.common.view.button.cancel").$D("取消") }}</srm-button>
          <div style="width: 1px; height: 100%; background: var(--split-line-color-primary);"/>
          <srm-button size="x-large" style="background: var(--background-color-empty); border-radius: 0px;" @click="openBidComfirm">{{ $T("ssrc.inquiryHall.view.message.button.openingBid").$D("开标") }}</srm-button>
        </srm-flex>
      </div>
    </srm-popup>

    <!-- 底部按钮 -->
    <srm-bottom-handler v-if="getBtnArr.length > 0"
                        :btn-arr="getBtnArr"
                        type="action-sheet"/>
  </div>
</template>

<script>
const storage = window.localStorage;
import {
  getRfxHeaderApi,
  resendOpenPasswordApi,
  getSecBidOpeningEnableApi,
  openBidApi,
  openingSecBid,
  getRfxMembersApi, fetchBidOpenExecution,
} from "../api/BidOpening.js";

import ContextDetail from "../components/ContextDetail";
import { SrmUtil } from "srm-mobile-ui";
import { getNewHeaderApi } from "../api";
export default {
  modules: [ "sdat.riskScanReport", "sdat.riskTroubleshoot", "hzero.common", "ssrc.queryRfq", "ssrc.inquiryHall", "ssrc.common", "ssrc.bidHall", "ssrc.priceLibrary", "ssrc.supplierQuotation", "smbl.common", "smbl.inquiryHall", "hipspfm.expertScoring", "hipspfm.common", "hipspfm.workFlow", "hipspfm.invoiceBill", "sqam.common" ],
  name: "HallDetail",
  components: { ContextDetail },
  props: {
    changeReqId: {
      type: String,
    },
    changeDocumentType : {
      type: String,
    }
  },
  data() {
    return {
      loading: false,
      rfxHeaderId: "",
      documentType:"", // 单据类型 BID(招标单)|RFX（询价单）
      headInfo:{},
      info: {},
      // 开标操作视图
      secBidOpenFlag: false, // 二阶段开标配置表是否开启
      openBidActionViewFlag: false,
      openPassword: null,
      bidStatusMap: {},
    };
  },
  computed: {
    getBtnArr() {
      return [];
    }
  },
  mounted() {
    const { rfxHeaderId, documentType } = this.$route && this.$route.query || {};
    this.rfxHeaderId = rfxHeaderId || this.changeReqId;
    this.documentType = documentType || this.changeDocumentType;
    if (this.rfxHeaderId) {
      storage.setItem("hallDetailRfxHeaderId", this.rfxHeaderId);
    }
    this.getHeadInfo(this.rfxHeaderId);
    this.getSecBidOpeningEnable();
    this.init();
    this.fetchBidOpenExecutionStatus();
  },
  methods: {
    init() {
      try {
        this.rfxHeaderId = storage.getItem("hallDetailRfxHeaderId");
        this.$loading.show();
        getNewHeaderApi(this.rfxHeaderId, {
          path: "/ssrc/inquiry-hall/rfx-detail/:rfxId",
          tenantId: SrmUtil.getTenantId(),
          sourceMobileEndFlag: 1,
        }).then((res) => {
          this.info = {
            rfxTitle: res.rfxHeader.rfxTitle,
            rfxByName: res.rfxHeader.rfxByName,
            creationDate: res.rfxHeader.creationDate
          };
          this.$loading.hide();
        });
      } catch (error) {
        this.info = {
          rfxTitle: "",
          rfxByName: "",
          creationDate: "",
        };
        this.$loading.hide();
      }
    },
    getHeaderColumns() {
      return [
        {
          fieldCode: "rfxTitle",
          render: (val) => val
        },
        {
          fieldCode: "rfxByName",
          render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.prRequestedNam").$D("申请人") }：{ val }</span>
        },
        {
          fieldCode: "creationDate",
          render: (val) => <span>{ this.$T("ssrc.inquiryHall.model.inquiryHall.creationTime").$D("创建时间") }：{ val }</span>
        }
      ];
    },
    // 开标按钮，触发事件
    openBidAction() {
      this.openBidActionViewFlag = true;
    },
    // 重发开标密码
    resendPasswordAction() {
      this.$loading.show();
      resendOpenPasswordApi(this.rfxHeaderId).then((res) => {
        let response = res || {};
        if (!response.failed) {
          this.$notification.open({
            message: this.$T("ssrc.inquiryHall.view.message.confirm.resendOpenPassword").$D("密码发送成功，请注意查收！"),
            class: "notification"
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 确认开标
    async openBidComfirm() {
      const { rfxHeaderId, } = this || {};
      const {
        // firstAllOpened,
        // secondAllOpened,
        currentOpenerFirstOpened,
        // currentOpenerSecondOpened,
        // enableBidAnnouncementFlag,
      } = this.bidStatusMap || {};
      const { rfxStatus } = this.headInfo || {};
      // 一阶段开标: 询价单状态=待开标 && 当前开标员第一阶段未开标
      const showFirstOpenBidFlag = rfxStatus === "OPEN_BID_PENDING" && currentOpenerFirstOpened === 0;
      const bidOrder = showFirstOpenBidFlag ? "first" : "second";
      let openPassword = this.headInfo.passwordFlag ? this.openPassword : null;
      this.openBidActionViewFlag = false;
      this.$loading.show();

      if (!rfxHeaderId) {
        return;
      }

      // 没开启二阶段，开启二阶段但是不是第二阶段
      const commonBid = bidOrder === "first" && this.secBidOpenFlag || !this.secBidOpenFlag;
      let res = null;
      if (commonBid) {
        res = await openBidApi(rfxHeaderId, openPassword);
      } else {
        res = await openingSecBid({
          rfxHeaderId,
          openPassword,
          sourceMobileEndFlag: 1,
        });
      }
      if (!res.failed) {
        await this.getHeadInfo(this.rfxHeaderId);
        await this.fetchBidOpenExecutionStatus();
        this.$refs.RfxDetailPop.getCurrentNode();
      }
      if (res === 0) {
        this.$notification.open({
          message: this.$T("smbl.common.message.validate.completeBid.waitOtherBider").$D("您已完成开标，请等候其他开标员开标!"),
          class: "notification"
        });
      }
      if (res === 1) {
        this.$notification.open({
          message: this.$T("smbl.common.message.operateSuccess").$D("操作成功"),
          class: "notification"
        });
      }
      this.$loading.hide();
    },
    //获取询价单头信息
    async getHeadInfo(rfxHeaderId) {
      const params = {
        customizeUnitCode: "SSRC.INQUIRY_HALL_DETAIL.INFO_PREPARE,SSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_DEMAND,SSRC.INQUIRY_HALL_DETAIL.LINE_ORGANIZATION_EXECUTOR,SSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_PREQUAL,SSRC.INQUIRY_HALL_DETAIL.RFX_DEMAND_QUOTATION"
      };

      let members = await getRfxMembersApi(rfxHeaderId);
      if (!members) {
        members = [];
      }
      let rfxMemberNames = [];
      members.map((item) => {
        rfxMemberNames.push(item.realName);
      });
      await getRfxHeaderApi(params, rfxHeaderId).then((res) => {
        if (res && !res.failed) {
          this.headInfo = res;
          this.headInfo.rfxMemberName = rfxMemberNames.join(",");
          this.statusArr = res.allowSourceSupplierStages.split(",");
        }
      });
    },
    // 查询专家评分开标是否开启新功能
    async getSecBidOpeningEnable() {
      const res = await getSecBidOpeningEnableApi();
      if (res && !res.failed) {
        this.secBidOpenFlag = Boolean(res);
      }
    },
    // 查询新专家评分开标状态状态
    async fetchBidOpenExecutionStatus() {
      const { rfxHeaderId } = this || {};
      if (!rfxHeaderId) {
        return;
      }

      let res = await fetchBidOpenExecution({ rfxHeaderId: this.rfxHeaderId, sourceMobileEndFlag: 1, });
      if (res && !res.failed) {
        this.bidStatusMap = res || {};
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
.approval-detail-container {
  height 100vh;
  background: #f0f2f5;
}

.approval-detail-scroll-el {
  height 100%;
  overflow-y scroll;
  overflow-x hidden;
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: #f0f2f5;
}

.approval-from-loading {
  width 100%;
  padding 100px 50px;
  text-align center;
}

.approval-button {
  margin-right 10px;
}

.button-container {
    width: 100%;
    position: absolute;
    padding: 12px 15px 0px 12px;
    bottom: 0px;
    left: 0px;
    height: 72px;
    height: calc(72px + constant(safe-area-inset-bottom));
    height: calc(72px + env(safe-area-inset-bottom));
    background: var(--background-color-empty);
  }
  .open-bid-message {
    margin-top: 4px;
    padding: 0px 15px;
    line-height: 20px;
    color: var(--font-color-second);
    font-size: 14px;
    text-align: center;
  }
  .password-view {
    margin: 12px 20px 0px 20px;
    background: var(--split-line-color-primary);
    border-radius: 4px;
  }
  .resend-password {
    flex-shrink: 0;
    padding: 0px 20px;
    font-size: 12px;
    color: var(--font-color-primary);
  }
  .popup-buttons {
  border-top: 1px solid var(--split-line-color-primary);
  height: 48px;
  position: absolute;
  bottom: 0px;
  left: 0px;
}

.open-bid-action-view {
  padding-top: 20px;
  height: 100%;
  background: var(--background-color-empty);
  margin: 0px 44px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  .open-bid-title {
    color: var(--font-color-default);
    line-height: 22px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
}
</style>
