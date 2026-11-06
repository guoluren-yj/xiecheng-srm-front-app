<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/CUX/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('sinv.common.view.message.title.detail').$D('维护明细') }}</div>
      <div slot="right" class="right-button" >
        <i @click="showFilePop"><img src="@/assets/CUX/attached_file@3x.png" class="image-black-default" alt=""></i>
        <srm-tooltip placement="bottom">
          <a slot="content">
            <p class="moreOperate" @click="deleteDelivery"><img class="image-black-default" src="@/assets/CUX/Popovers_delet_normal@3x.png" alt="">
              <span>{{ $T('hipspfm.createDelivery.view.message.deleteDetail').$D('删除明细') }}</span>
            </p>
            <p class="moreOperate" @click="showOperationPop"><img class="image-black-default" src="@/assets/CUX/Popovers_record_normal@3x.png" alt="">
              <span>{{ $T('hipspfm.common.message.title.operationRecord').$D('操作记录') }}</span>
            </p>
          </a>
          <img src="@/assets/CUX/Navigation bar_more_normal@3x.png" class="image-black-default" alt="">
        </srm-tooltip>
      </div>
    </hips-nav-bar>
    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="operationPopup"
      :operation-arr="operationArr"
      :load-refresh="getOpRecord"
      :loading="oploading"/>
    <!-- 附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :can-upload="true"
      :can-delete="true"
      :title="$T('hipspfm.createDelivery.view.title.maintainAttachment').$D('维护明细附件')"
      :attachment-uuid="attachmentUuid"/>
    <section class="headInfo">
      <li>
        <span>{{ headInfo.asnNum }}</span>
      </li>
      <li>
        <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}：{{ headInfo.companyName }}</span>
      </li>
    </section>
    <tab-scroll
      v-if="asnHeaderId"
      ref="childCompont"
      :head-info="headInfo"
      :line-info="lineInfo"
      :asn-header-id="asnHeaderId"
      :get-order-line="getOrderLine"
      @refreshScrollData="refreshScrollData"/>
  </hips-view>
</template>

<script>
import { View, NavBar, Icon, Popup } from "hips";
import TabScroll from "../components/TabScroll";
import OperationRecord from "@/components/OperationRecord";
import AttachedFile from "@/components/AttachedFile";

import {
  getDetailHeadInfoApi,
  getDetailLineInfoApi,
  getOpRecordApi,
  deleteDeliveryApi,
  getAttachmentUuidApi,
  flashAttachmentUuidApi
} from "../api";
export default {
  modules: [ "sinv.common", "hipspfm.createDelivery", "hipspfm.common", "sslm.investigationMaintain", "message.validation" ],
  name: "JjyDeliveryDetail",
  components: {
    TabScroll,
    AttachedFile,
    OperationRecord,
    [View.name]: View,
    [NavBar.name]: NavBar,
    [Popup.name]: Popup,
    [Icon.name]: Icon,
  },
  beforeRouteLeave(to, from, next) {
    const self = this;
    let b1 = this.oldData;
    let b2 = JSON.stringify(this.headInfo);
    if (b1 === b2 || to.params.saveFlag || self.deleteFlag) {
      self.deleteFlag = false;
      next();
    } else {
      self.$hips.dialog.confirm({
        closable: false,
        content: self.$T("hipspfm.createDelivery.view.message.contentIsNotSave").$D("当前页面尚未保存，是否保存更改！"),
        okText: self.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: self.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk() {
          self.$refs.childCompont.saveDelivery(next);
        },
        onCancel(tx) {
          next();
        },
      });
    }
  },
  data() {
    return {
      headInfo: {}, //订单头信息
      lineInfo: [], //订单行信息
      operationPopup: false,
      visible: false,
      filePopup: false,
      filePopups: false,
      meteriaPopups: false,
      fileList: [],
      choseedDate: "",
      displayPoNum: "", //订单号
      shipDate: "", //发货日期
      expectedArriveDate: "", //预计到货日期
      poHeaderId: "",
      page: 0,
      size: 10,
      attachmentUuid: "",
      supplierAttachmentUuid: "",
      operationArr: [], //操作记录数据集合
      orgName:"", //业务实体
      asnHeaderId: "", //送货单头ID
      oldData: "",
      oploading: false,
      deleteFlag:false
    };
  },
  async mounted() {
    this.asnHeaderId = this.$route.query.asnHeaderId;
    await this.getOrderHeader();
    await this.getOrderLine();
    await this.getOpRecord();
  },
  methods: {
    //操作记录弹窗显示或隐藏
    showOperationPop() {
      this.visible = false;
      this.operationPopup = !this.operationPopup;
    },
    //维护明细附件弹窗显示或隐藏
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    //行附件弹窗显示或隐藏
    showFilePops() {
      this.filePopups = !this.filePopups;
    },
    // 删除送货单
    deleteDelivery() {
      const self = this;
      this.$hips.dialog.confirm({
        closable: false,
        content: self.$T("sinv.common.model.common.confirmDelete").$D("是否确认删除送货单"),
        okText: self.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: self.$T("hipspfm.common.button.cancle").$D("取消"),
        onOk() {
          self.$loading.show();
          deleteDeliveryApi([ self.headInfo ]).then((res) => {
            self.$loading.hide();
            if (res && res.failed) {
              self.$hips.dialog.alert({
                title: self.$T("hipspfm.createDelivery.view.message.deleteFailed").$D("删除失败"),
                content: res.message,
                okText: self.$T("hipspfm.common.view.button.gotIt").$D("我知道了")
              });
            } else {
              self.$notification.open({
                message:self.$T("hipspfm.common.message.deleteSuccess").$D("删除成功"),
                description: "",
                class:"notification",
              });
              self.deleteFlag = true;
              self.$router.push({ name: "jjy_DeliveryList" });
            }
          });
        }
      });
    },
    //获取订单头信息
    async getOrderHeader() {
      const headInfo = await getDetailHeadInfoApi(this.asnHeaderId);
      this.headInfo = this.mergeHeadInfo(headInfo);
      this.oldData = JSON.stringify(this.headInfo);
      if (headInfo.asnHeaderId) {
        if (!headInfo.attachmentUuid && !headInfo.supplierAttachmentUuid) {
          const { content } = await getAttachmentUuidApi();
          this.attachmentUuid = content;
          const uuParms = {
            _token: headInfo._token,
            attachmentUuid: content,
            supplierAttachmentUuid: content,
            asnHeaderId: headInfo.asnHeaderId,
            objectVersionNumber: headInfo.objectVersionNumber,
          };
          await flashAttachmentUuidApi(uuParms);
          const newHeadInfo = await getDetailHeadInfoApi(this.asnHeaderId);
          this.headInfo = this.mergeHeadInfo(newHeadInfo);
          this.oldData = JSON.stringify(this.headInfo);
        } else {
          this.attachmentUuid = headInfo.attachmentUuid || headInfo.supplierAttachmentUuid;
        }
      }
    },
    // 刷新数据
    refreshScrollData() {
      this.getOrderHeader();
      this.getOrderLine();
    },
    //获取订单行信息
    getOrderLine() {
      const params = {
        customizeUnitCode: "SINV.DELIVERY_CREATION_DETAIL.LINE_BASIC",
      };
      this.$loading.show();
      getDetailLineInfoApi(this.asnHeaderId, params).then((res) => {
        this.$loading.hide();
        if (res && res.failed) {
          this.$hips.toast(res.message);
        } else {
          this.lineInfo = res;
        }
      });
    },
    //获取操作记录
    async getOpRecord() {
      let params = {
        page: this.page,
        size: this.size,
      };
      this.oploading = true;
      await getOpRecordApi(this.asnHeaderId, params).then(({ content = [] } = {}) => {
        this.oploading = false;
        this.operationArr = content;
      });
    },
    // 合并头信息属性
    mergeHeadInfo(data) {
      return {
        logisticsContactInfo: "",
        logisticsCompany: "",
        logisticsStaff: "",
        logisticsCost: "",
        expressNum: "",
        ...data,
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .hips-icon hips-icon-arrow-left {
  color: #10121A;
}
.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 32px;
}
.right-button {
  margin-right 8px;
  img {
    margin-right 12px;
    height: 24px;
    width: 24px;
  }
}

.moreOperate{
  width:120px;
  color:var(--color-font-default);
  display:flex;
  align-items:center;
  img{
    width 18.3px;
    height 18.3px;
    margin:12.5px 11px;
  }
}
.moreOperate:nth-child(1){
  border-bottom:1px solid var(--color-border-default);
  img{
    width 20px;
    height 20px;
    margin:12.5px 10px;
  }
}

.headInfo {
  padding: 12px 20px 12px 20px;
  border-bottom:8px solid var(--color-border-default);

  li {
    display: flex;
    height: 24px;
    justify-content: space-between;

    &:nth-child(1) {
      margin-bottom: 4px;
    }

    span {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;

      &:nth-child(1) {
        font-weight: bold;
      }
    }
  }
  .money {
    font-size: 16px;
    color: var(--color-other-default);
    width: 50%;
    text-align: right;
  }
}

</style>
