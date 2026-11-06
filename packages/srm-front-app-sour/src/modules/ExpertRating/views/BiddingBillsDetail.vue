<!--eslint-disable-->
<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img class="image-black-default" src="@/assets/back@3x.png" >
      </div>
      <div slot="center" class="header">{{ $T('ssrc.bidHall.view.title.bidDetails').$D('招标书明细') }}</div>
      <div slot="right" class="right-button" >
        <img class="image-black-default" src="@/assets/Operation_record@3x.png" alt="" @click="showOperationPop">
      </div>
    </hips-nav-bar>
    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="operationPopup"
      :operation-arr="operationArr"
      :load-refresh="getOperationRecords"
      :loading="oploading"/>
    <!-- 头附件弹窗 -->
    <attached-file v-model="filePopup" />
    <!-- 专家信息详情弹窗 -->
    <supplier-info v-model="expertInfoPop" date-type="expert" :experts-assign-info="expertsAssignInfo" />
    <!-- 供应商信息详情弹窗 -->
    <supplier-info v-model="supplierInfoPop" date-type="supplier" :supplier-assign-info="supplierAssignInfo"/>
    <section class="headInfo">
      <li>
        <span>{{ headInfo.bidNum }}</span>
      </li>
      <li>
        <span>{{ headInfo.bidTitle }} </span>
      </li>
    </section>
    <!-- 招标书 -->
    <bid-detail-tab-scroll
      v-if="finishLoad"
      :head-info="headInfo"
      :material-detail="materialDetail"
      :supplier-info="supplierInfo"
      :experts-info="expertsInfo"
      :scoring-elements="scoringElements"
      :show-expert-info="showExpertInfo"
      :get-supplier-assigned="getSupplierAssigned"/>
  </hips-view>
</template>

<script>
import uuid from "uuid";
import { View, NavBar, Popup, Input } from "hips";
import AttachedFile from "@/components/File/AttachedFile";
import OperationRecord from "@/components/New/OperationRecord";
import SupplierInfo from "@/components/BidDetail/SupplierInfo";
import BidDetailTabScroll from "@/components/BidDetail/BidDetailTabScroll";
//oldBidDetail import {
//   getExpertAssignedApi,
//   getBiddingSupplierApi,
//   getOperationRecordApi,
//   getBiddingHeadInfoApi,
//   getSupplierAssignedApi,
//   getBiddingExpertsInfoApi,
//   getBiddingMaterialDetailApi,
//   getBiddingScoringElementsApi,
// } from "@/common/BidDetail/api";

import {
  getExpertAssignedApi,
  getBiddingSupplierApi,
  getOperationRecordApi,
  getBiddingHeadInfoApi,
  getSupplierAssignedApi,
  getBiddingExpertsInfoApi,
  getBiddingMaterialDetailApi,
  getBiddingScoringElementsApi,
} from "../api";
export default {
  modules: [ "ssrc.bidHall", "hipspfm.expertScoring" ],
  name: "BiddingBillsDetail",
  components: {
    SupplierInfo,
    AttachedFile,
    OperationRecord,
    BidDetailTabScroll,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  data() {
    return {
      headInfo: {}, // 头信息
      materialDetail: [],
      supplierInfo: [],
      expertsInfo: [],
      scoringElements: [],
      expertsAssignInfo: [], //专家分配信息
      supplierAssignInfo: [], //专家分配信息
      operationArr: [], //操作记录
      fileList: [],
      expertInfoPop: false,
      supplierInfoPop: false,
      bidHeaderId: null,
      bidOpenDate: null,
      preQualificationFlag: "", //是否有资格预审
      expertScoreType: "", //是否专家、评分要素tab页
      approveAttachmentUuid: "", //采购方审核附件
      otherAttachmentUuid:"", //采购方其他附件
      reviewAttachmentUuid:"", //采购方复核附件
      supplierAttachmentUuid:"", //供应商附件
      operationPopup: false,
      filePopup: false,
      lineFilePopup:false,
      oploading: false,
      finishLoad: false,
    };
  },
  async mounted() {
    const { bidOpenDate, bidHeaderId, sourceHeaderId } = this.$route.query;

    this.bidHeaderId = bidHeaderId || sourceHeaderId;
    this.bidOpenDate = bidOpenDate;
    this.$loading.show();
    await this.getBiddingHeadInfo();
    await this.getBiddingMaterialDetail();
    await this.getBiddingSupplier();
    await this.getBiddingExpertsInfo();
    await this.getBiddingScoringElements();
    await this.getOperationRecords();
    this.finishLoad = true;
    this.$loading.hide();
  },
  methods: {
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    showLineFilePop(attachmentUUID) {
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      this.lineFilePopup = !this.lineFilePopup;
    },
    // 获取招投标头表明细信息
    async getBiddingHeadInfo() {
      // this.rfxHeaderId
      await getBiddingHeadInfoApi(this.bidHeaderId).then((res) => {
        this.headInfo = res || {};
        this.preQualificationFlag = this.headInfo.preQualificationFlag;
        this.expertScoreType = this.headInfo.expertScoreType;
        this.attachmentUuid = this.headInfo.attachmentUuid || uuid();
      });
    },
    //获取招投标物料明细信息
    async getBiddingMaterialDetail() {
      await getBiddingMaterialDetailApi(this.bidHeaderId).then((res) => {
        this.materialDetail = res;
      });
    },
    //获取招投标供应商信息
    async getBiddingSupplier() {
      await getBiddingSupplierApi(this.bidHeaderId).then(({ content = [] }) => {
        this.supplierInfo = content;
      });
    },
    //获取招投标专家信息
    async getBiddingExpertsInfo() {
      await getBiddingExpertsInfoApi(this.bidHeaderId).then((res) => {
        this.expertsInfo = res.evaluateExpertList;
      });
    },
    //获取招投标专家分配信息
    async showExpertInfo(team, evaluateIndicId) {
      await getExpertAssignedApi(team, evaluateIndicId, this.bidHeaderId).then((res) => {
        this.expertsAssignInfo = res;
        this.expertInfoPop = true;
      });
    },
    //获取招投标供应商分配信息
    getSupplierAssigned(bidHeaderId, bidLineItemId) {
      getSupplierAssignedApi(bidHeaderId, bidLineItemId).then((res) => {
        this.supplierAssignInfo = res;
        this.supplierInfoPop = true;
      });
    },
    // 获取招投标评分要素信息
    async getBiddingScoringElements() {
      await getBiddingScoringElementsApi(this.bidHeaderId).then((res) => {
        this.scoringElements = res;
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      this.oploading = true;
      await getOperationRecordApi(this.bidHeaderId).then((res) => {
        this.oploading = false;
        this.operationArr = res.content;
      });
    },
  },
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
.right-button {
  margin-right 8px;
  img {
    margin-right 12px;
    height: 24px;
    width: 24px;
  }
}
.headInfo {
  padding: 6px 20px 12px 20px;
  border-bottom: solid 8px var(--color-border-default);
  font-weight:bold;
  li:nth-child(1){
    margin-bottom:4px;
  }
  li {
    display: flex;
    margin-bottom:8px;
    &:last-child{
      margin-bottom: 0;
    }
    span {
      line-height : 24px;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }
}

</style>
