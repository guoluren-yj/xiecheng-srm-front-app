<template>
  <div>
    <div v-if="!loading"/>
    <hips-view v-else>
      <hips-nav-bar slot="header" :have-border="false">
        <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
          <img src="@/assets/CUX/back@3x.png" class="image-black-default">
        </div>
        <div slot="center" class="header">{{ $T('sinv.common.view.message.title.detailInfo').$D('送货单详情') }}</div>
        <div slot="right" class="right-button" >
          <i @click="showOperationPop" ><img class="image-black-default" src="@/assets/CUX/Operation_record@3x.png" alt=""></i>
          <!-- <img @click="showLogisticsPop" src="@/assets/CUX/Logistics_record@3x.png" alt=""> -->
          <i @click="showFilePop()"><img class="image-black-default" src="@/assets/CUX/attached_file@3x.png" alt=""></i>
        </div>
      </hips-nav-bar>
      <!-- 操作记录弹窗-->
      <OperationRecord
        v-model="operationPopup"
        :operation-arr="operationArr"
        :load-refresh="getOperationRecords"
        :loading="oploading"/>
      <!-- 头附件弹窗 -->
      <AttachedFiles
        v-model="filePopup"
        :file-arr="fileArr"/>
      <!-- 行附件弹窗-->
      <AttachedFile
        v-if="attachmentUUID"
        v-model="lineFilePopup"
        :attachment-uuid="attachmentUUID"/>
      <section class="headInfo">
        <li>
          <span>{{ headInfo.asnNum }}</span>
        </li>
        <li>
          <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}: </span>
          <span>&nbsp;&nbsp;{{ headInfo.companyName }}</span>
        </li>
      </section>
      <TabScroll
        v-if="JSON.stringify(headInfo)!=='{}'"
        ref="tab"
        :head-info="headInfo"
        :line-info="lineInfo"
        :show-file-pop="showLineFilePop"
        :organization-name="companyName"
        :purchase-agent-name="asnNum"
        :get-order-header="getOrderHeader"
        @GetNormal="GetNormal"
        @GetChange="GetChange"/>
    </hips-view>
  </div>
</template>

<script>
import { View, NavBar,Popup,Input } from "hips";
import TabScroll from "../components/TabScroll";
import uuid from "uuid";
import OperationRecord from "@/components/OperationRecord";
import AttachedFile from "@/components/AttachedFile";
import AttachedFiles from "@/components/AttachedFiles";
import { getOrderHeadInfo, getOrderLineInfo, getOperationRecordsApi, getFileUUIDApi } from "../api/index";
export default {
  modules: [ "hipspfm.common","hipspfm.supplierDelivery","sinv.common" ],
  name: "jjy_MyDeliveryDetail",
  components: {
    TabScroll,
    OperationRecord,
    AttachedFile,
    AttachedFiles,
    [Input.name]: Input,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
  },
  beforeRouteLeave (to, from, next) {
    this.back(next);
  },
  data() {
    return {
      headInfo: {}, // 头信息
      lineInfo: [], // 行信息
      operationArr: [], //操作记录
      fileList: [],
      asnHeaderId: "",
      approveAttachmentUuid: "", //采购方审核附件
      otherAttachmentUuid:"", //采购方其他附件
      reviewAttachmentUuid:"", //采购方复核附件
      supplierAttachmentUuid:"", //供应商附件
      attachmentUUIDs: "",
      attachmentUUID:"",
      operationPopup: false,
      filePopup: false,
      lineFilePopup:false,
      companyName: "",
      asnNum: "",
      normal:"", // nomal
      change:"", // change
      loading: false,
      oploading: false,
    };
  },
  computed:{
    fileArr() {
      let newFileArr = [ { title: this.$T("hipspfm.common.view.message.title.auditFile").$D("审核附件"), attachmentUuid: this.approveAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.reviewFile").$D("复核附件"), attachmentUuid: this.reviewAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.otherFile").$D("其它附件"), attachmentUuid: this.otherAttachmentUuid, readOnly: true },
        { title: this.$T("hipspfm.common.view.message.title.supplierFile").$D("供应商附件"), attachmentUuid: this.supplierAttachmentUuid, readOnly: true }, ];
      return newFileArr;
    }
  },
  mounted() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    this.companyName = this.$route.query.companyName;
    this.asnNum = this.$route.query.asnNum;
    this.getOrderHeader();
    this.getOrderLine();
    this.getOperationRecords();
  },
  methods: {
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    showLineFilePop(attachmentUUID) {
      if (typeof attachmentUUID === "string") {
        this.attachmentUUID = attachmentUUID;
      }
      console.log(11111,attachmentUUID);
      this.lineFilePopup = !this.lineFilePopup;
    },
    // 获取头信息
    async getOrderHeader() {
      try {
        const headInfo = await getOrderHeadInfo(this.asnHeaderId);
        this.headInfo = headInfo;
        this.approveAttachmentUuid = headInfo.approveAttachmentUuid || uuid();
        this.otherAttachmentUuid = headInfo.otherAttachmentUuid || uuid();
        this.reviewAttachmentUuid = headInfo.reviewAttachmentUuid || uuid();
        this.supplierAttachmentUuid = headInfo.supplierAttachmentUuid || uuid();
        if (headInfo) {
          // this.attachmentUUIDs = headInfo.attachmentUuids;
        } else {
          const { content } = await getFileUUIDApi();
          // this.approveAttachmentUuid = headInfo.approveAttachmentUuid;
          // this.otherAttachmentUuid = headInfo.otherAttachmentUuid;
          // this.reviewAttachmentUuid = headInfo.reviewAttachmentUuid;
          // this.supplierAttachmentUuid = headInfo.supplierAttachmentUuid;
          this.attachmentUUIDs = content;
        }
      } catch (err) {
        console.log(err);
      }
    },
    //获取订单行信息
    getOrderLine(asnHeaderId) {
      const params = {
        customizeUnitCode: "SINV.DELIVERY_CREATION_DETAIL.LINE_BASIC",
      };
      this.$loading.show();
      getOrderLineInfo(this.asnHeaderId,params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
        this.loading = true;
      });
    },
    // 获取操作记录
    async getOperationRecords() {
      const params = {
        asnHeaderId: this.asnHeaderId
      };
      this.oploading = true;
      await getOperationRecordsApi(params).then((res)=>{
        this.oploading = false;
        this.operationArr = res.content;
      });
    },
    GetNormal(val) {
      this.normal = val;
    },
    GetChange(val) {
      this.change = val;
    },
    back(next) {
      if (this.normal != this.change) {
        this.$hips.dialog.confirm({
          title: this.$T("hipspfm.common.message.tips").$D("提示"),
          content: this.$T("hipspfm.supplierDelivery.view.message.saveInfoOrNot").$D("是否保存已修改信息") + "?",
          okText: this.$T("hipspfm.common.button.save").$D("保存"),
          cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
          closable:false,
          onOk: (tx) => {
            const _this = this;
            new Promise((resolve,reject)=>{
              _this.$refs.tab.collection();
              resolve();
            }
            ).then((res)=>{
              next();
            });
          },
          onCancel(tx) {
            // on cancel
            next();
          },
        });
      } else {
        next();
      }
    }

  }
};
</script>

<style lang="stylus" scoped>
>>> .hips-view__content {
  position fixed
}
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
    margin-bottom:8px;
  }
  li {
    display: flex;
    height: 24px;
    // justify-content: space-between;

    &:nth-child(1) {
      margin-bottom: 4px;
    }

    span {
      line-height : 24px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }
}

</style>
