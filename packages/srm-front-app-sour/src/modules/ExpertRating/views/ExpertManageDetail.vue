<template>
  <div class="container">
    <nav-head :title="$T('hipspfm.common.view.message.details').$D('单据详情')"/>
    <!-- 头信息 -->
    <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
      <div class="button-right-margin">
        <srm-button size="small" @click="toBiddingBillDetail">
          <i>
            <img class="image-black-default" src="@/assets/Navigation bar_details_normal@3x.png" alt>
          </i>
        </srm-button>
        <srm-button size="small" type="warn" @click="showFilePop">
          <i>
            <img class="image-black-default" src="@/assets/attached_file@3x.png" alt>
          </i>
        </srm-button>
      </div>
    </srm-detail-head>
    <!-- 头附件弹窗 -->
    <attached-file v-model="filePopup" />
    <div v-if="PromptExist" class="prompt">
      <span>
        <img class="image-yellow-default" src="@/assets/notify_info_normal@3x.png" alt >
        {{ $T('hipspfm.expertScoring.message.validation.checkInvalidTender').$D('勾选可标记无效投标')+'!' }}
      </span>
      <span @click="handleKnow">{{ $T('hipspfm.common.view.button.gotIt').$D('我知道了') }}</span>
    </div>
    <srm-checkbox-group v-model="invalidList" :selection="Infinity">
      <srm-collapse :max-open="1" style="width: 100%">
        <srm-collapse-item v-for="(item,index) in lineInfo" :key="index" :name="index">
          <div class="label-container">
            <srm-checkbox :option="item"/>
            <div class="label-section">
              <customize :need-padding="true" :columns="getInvalidListColumns" :data-source="item"/>
            </div>
          </div>
          <div slot="content" class="infoContent">
            <div v-for="(ele,i) in item.indicateList" :key="i">
              <customize :need-padding="true" :columns="getIndicateListColumns" :data-source="ele"/>
            </div>
          </div>
        </srm-collapse-item>
      </srm-collapse>
    </srm-checkbox-group>
    <srm-bottom-handler v-if="headInfo.sourceStatus==='RFX_EVALUATION_PENDING'" :btn-arr="getBtnArr" />
  </div>
</template>

<script>
import AttachedFile from "@/components/File/AttachedFile";
import { getRatingManageApi, submitSummaryApi, submitEvaluateNewOpenBidSummary, getInquiryHeadInfoApi, } from "../api/index";
import { SrmListHeader } from "srm-mobile-ui";
export default {
  modules: [ "hipspfm.expertScoring", "hipspfm.common", "ssrc.bidHall", "ssrc.expertScoring" ],
  name: "ExpertManageDetail",
  components: {
    AttachedFile,
  },
  data() {
    return {
      headInfo: {}, // 头信息
      currentHeader: {},
      lineInfo: [], // 行信息
      filePopup: false,
      invalidList: [],
      PromptExist: true,
      bidRuleType: "",
      lineAllInfo: {}, // 评分管理供应商维度所有行信息
    };
  },
  computed:{
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "sourceNum",
        },
        {
          fieldCode: "sourceTitle",
        },
      ];

      return columns;
    },
    getBtnArr() {
      return [
        {
          type:"danger",
          title: this.$T("ssrc.expertScoring.model.expertScoring.restartScore").$D("重新评分"),
          handler: this.goReRatingDetail
        },
        {
          type:"primary",
          title: this.$T("ssrc.bidHall.view.message.button.sureAndsummary").$D("确认及汇总"),
          handler: this.clickSummary
        },
      ];
    },
    getInvalidListColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val) => <SrmListHeader showOpenTag={false}>
            {val}
          </SrmListHeader>
        },
        {
          fieldCode: "scoreTotal",
          fieldType: "EMPTY",
          render: (val, record) => <div class="label-section">
            {
              this.bidRuleType === "NONE" ? <div class="total-score">
                {this.$T("ssrc.bidHall.model.bidHall.sumScore").$D("总分")}：{val}
              </div> :
                this.lineAllInfo?.currentTeam === "BUSINESS" ?
                  <div class="total-score">
                    {this.$T("ssrc.bidHall.model.bidHall.businessScoreTotal").$D("商务总分")}：{record.businessScoreTotal}
                    <span>{this.$T("ssrc.expertScoring.model.expertScoring.weight").$D("权重") }：{record.businessWeight}%</span>
                  </div> :
                  <div class="total-score">
                    {this.$T("ssrc.bidHall.model.bidHall.technologyScoreTotal").$D("技术总分")}：{record.technologyScoreTotal}
                    <span>{this.$T("ssrc.expertScoring.model.expertScoring.weight").$D("权重") }：{record.technologyWeight}%</span>
                  </div>
            }
          </div>,
        }
      ];
      return columns;
    },
    getIndicateListColumns() {
      const columns = [
        {
          fieldName:this.$T("ssrc.bidHall.model.bidHall.indicateNames").$D("要素名称"),
          fieldCode:"indicateTitle",
        },
        {
          fieldCode: "score",
          fieldType: "EMPTY",
          render: (val, record) => <div>
            <span style={ { color:"var(--color-other-default-c)" } }>{this.$T("ssrc.bidHall.model.bidHall.score").$D("得分")}：{record.singleIndicScoreAVG || record.passStatusMeaning }</span>
            {
              record.singleIndicScoreAVG && <span class="weight">{this.$T("ssrc.expertScoring.model.expertScoring.weight").$D("权重") }：{this.$options.filters.getPercentage(record.indicateName) }</span>
            }
          </div>
        },
      ];
      return columns;
    },
  },
  mounted() {
    this.headInfo = this.$store.getters["ExpertRating/getExpertRatingList"];
    this.fetchHeader();
    this.getRatingManage();
  },
  methods: {
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    // 跳转询价单详情页
    toBiddingBillDetail() {
      const { sourceHeaderId, sourceFrom } = this.headInfo;
      this.$store.commit("ExpertRating/setTenderHallList", this.headInfo);
      if (sourceFrom === "RFX") {
        this.$router.push({
          name: "InquiryBillsDetail",
          query: { rfxHeaderId: sourceHeaderId }
        });
      } else {
        this.$router.push({
          name: "BiddingBillsDetail",
          query: { bidHeaderId: sourceHeaderId }
        });
      }
    },
    handleKnow() {
      this.PromptExist = false;
    },
    async fetchHeader() {
      const { sourceFrom, sourceHeaderId } = this.headInfo;
      const res = await getInquiryHeadInfoApi(sourceHeaderId, { sourceFrom });

      this.currentHeader = res || {};
    },
    async getRatingManage() {
      const { sourceFrom, sourceHeaderId } = this.headInfo;
      await getRatingManageApi(sourceFrom, sourceHeaderId).then((res) => {
        this.lineInfo = res.NONE;
        this.bidRuleType = res.bidRuleType;
        this.lineAllInfo = res;
      });
    },
    //跳转重新评分
    goReRatingDetail() {
      this.$router.push({ path: "/ReRatingDetail" });
    },
    clickSummary() {
      // eslint-disable-next-line consistent-this
      const self = this;
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.dialog.confirm({
        content: this.$T("hipspfm.expertScoring.validation.message.comfrmAndSummary").$D("是否确认及汇总") + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          self.handleSummary();
        }
      });
    },
    handleSummary() {
      const {
        // sourceHeaderId,
        sourceFrom,
        // roundQuotationRule = null,
      } = this.headInfo;
      const {
        openBidOrder = null,
        currentSequenceNum = null,
        existSecondOpenBidFlag,
      } = this.currentHeader || {};

      if (this.invalidList.length > 0) {
        this.lineInfo.forEach((itemA) => {
          this.invalidList.forEach((itemB) => {
            itemB.invalidFlag = 1;
            if (itemA.evaluateSummaryId === itemB.evaluateSummaryId) {
              itemA.invalidFlag = itemB.invalidFlag;
            }
          });
        });
      }
      let params = this.lineInfo.map((item) => {
        const {
          sectionId,
          sourceFrom: lineSourceFrom,
          scoreTotal,
          invalidFlag,
          sourceHeaderId,
          businessWeight,
          technologyWeight,
          evaluateSummaryId,
          quotationHeaderId,
          businessScoreTotal,
          technologyScoreTotal
        } = item;
        let tenantId = window.localStorage.tenantId;
        return {
          tenantId,
          sectionId,
          sourceFrom: lineSourceFrom,
          scoreTotal,
          invalidFlag,
          sourceHeaderId,
          businessWeight,
          technologyWeight,
          evaluateSummaryId,
          quotationHeaderId,
          businessScoreTotal,
          technologyScoreTotal,
          score: scoreTotal,
          businessScore: businessScoreTotal,
          technologyScore: technologyScoreTotal
        };
      });
      this.$loading.show();

      // 开启新开标功能 && 先技术 或者 先商务 && 当前处于先的组别
      const secondBid = existSecondOpenBidFlag === 1 &&
        sourceFrom === "RFX" &&
        currentSequenceNum === 1 &&
        (openBidOrder === "TECH_FIRST" || openBidOrder === "BUSINESS_FIRST");

      const apiPath = secondBid ? submitEvaluateNewOpenBidSummary : submitSummaryApi;

      apiPath(params).then((res) => {
        this.$loading.hide();
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            key: "1",
            class: "notification",
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            key: "2",
            class: "notification",
          });
          this.$router.back();
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../../../style/mixin.styl'
.container{
  height:calc(100vh -75px);
  overflow: auto;
}
.button-right-margin{
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 20px;
    width: 20px;
  }
}

.prompt {
  height: 36px;
  font-size: 14px;
  color:var(--color-font-default-d);
  opacity: 0.7;
  background: #000000;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0px 20px;
  justify-content: space-between;

  span:nth-child(1) {
    display: flex;
    align-items: center;
    line-height: 20px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color:var(--color-font-default-d);

    img {
      height: 18.3px;
      width: 18.3px;
      margin-right: 4.9px;
    }
  }

  span:nth-child(2) {
    font-family: PingFangSC-Medium;
    font-size: 10px;
    color: var(--color-other-default-b);
    line-height: 18px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--color-other-default-b);
    border-radius: 2px;
    border-radius: 2px;
    padding: 1px 4px;
  }
}

.label-container {
  display: flex;
  align-items: center;

  .label-section {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color:var(--color-font-default);
    line-height: 24px;

    .total-score {
      display: flex;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-other-default-b);
      line-height: 22px;

      span:nth-child(1) {
        background:var(--color-bg-default-e);
        border-radius: 2px;
        display: inline-block;
        font-family: PingFangSC-Medium;
        font-size: 10px;
        color: var(--color-other-default);
        line-height: 18px;
        padding: 1px 4px;
        height: 20px;
        margin-left: 8px;
      }
    }
  }
}

.infoContent {
  width:100%;
  padding-top:10px;
  display: flex;
  overflow-x: scroll;
}
.weight{
  background:var(--color-bg-default-d,rgba(65,70,96,0.1)) ;
        border-radius: 2px;
        display: inline-block;
        font-family: PingFangSC-Medium;
        font-size: 10px;
        color:var(--color-font-default-c);
        line-height: 18px;
        padding: 1px 4px;
        height: 20px;
        margin-left:10px;
}
>>>.srm-collapse-title{
  padding-top:10px;
}
>>> .srm-check-box-button{
  width:24px;
  height:24px;
  border-radius: 24px;
}
>>> .srm-check-box-button-checked-checkbox{
   padding-top:5px;
}
>>> .srm-check-box{
  width:auto;
}
>>> .label-container>.srm-check-box-group{
  flex-direction:row;
}
</style>
