<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.baseInfo').$D('准入单基本信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize
            :columns="getHeaderColumns"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.registrationInfo').$D('登记信息')">
        <div v-if="JSON.stringify(loginInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize
            :columns="getLoginColumns"
            :need-padding="true"
            type="list"
            :data-source="loginInfo"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.businessInfo').$D('业务信息')">
        <srm-list
          :scrollable="false"
          :data-set="businessInfoDs"
          :columns="getBusinessColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.conectInfo').$D('联系人信息（至少填写一条）')">
        <srm-list
          :scrollable="false"
          :data-set="connectInfoDs"
          :columns="getConnectColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.bankInfo').$D('银行信息')">
        <srm-list
          :scrollable="false"
          :data-set="bankInfoDs"
          :columns="getBankColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.nonCollaborativeSupplier.view.title.uuidInfo').$D('附件信息')">
        <srm-list
          :scrollable="false"
          :data-set="attachmentInfoDs"
          :columns="getAttachmentColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible="visible" :title="$T('scux.nonCollaborativeSupplier.button.viewAttachments').$D('查看附件')">
      <div>
        <img :src="url1" :style="{width: '100%'}">
      </div>
    </srm-popup>
    <srm-popup :visible="visible1" :title="$T('scux.nonCollaborativeSupplier.button.viewAttachments').$D('查看附件')">
      <div>
        <img :src="url1" :style="{width: '100%'}">
        <img :src="url2" :style="{width: '100%'}">
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import Mixin from "./Mixin";
import { connectInfo, bankInfo, attachmentInfo, businessInfo } from "./dataSource";

export default {
  modules: [ "hipspfm.workFlow", "hzero.common", "scux.nonCollaborativeSupplier" ],
  name: "NonCollaborativeApproval",
  mixins: [ Mixin ],
  inject: {
    approvalDetail: {
      default: null
    }
  },
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
    },
  },
  data() {
    return {
      connectInfoDs: new DataSet(connectInfo()),
      bankInfoDs: new DataSet(bankInfo()),
      attachmentInfoDs: new DataSet(attachmentInfo()),
      businessInfoDs: new DataSet(businessInfo()),
    };
  },
  beforeMount() {
    // this.headerDs.create({});
    // this.lineDs.create({});
  },
  mounted() {
    this.connectInfoDs.addPathParameter("supplierZrBasicId", this.changeReqId);
    this.connectInfoDs.refresh();
    this.bankInfoDs.addPathParameter("supplierZrBasicId", this.changeReqId);
    this.bankInfoDs.refresh();
    this.attachmentInfoDs.addPathParameter("supplierZrBasicId", this.changeReqId);
    this.attachmentInfoDs.refresh();
    this.businessInfoDs.addPathParameter("supplierZrBasicId", this.changeReqId);
    this.businessInfoDs.refresh();
  },
  afterMount() {
  },
  methods: {
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}

.line-button {
  display: flex;
  margin-top: 18px;
  height: 24px;
  z-index: 999;
}

.create-receive-detail-define{
  height:100%;
  .create-receive-detail-define-button{
    position:relative;
    top:30px;
    margin-left:15px;
    margin-right:15px;
  }
}
</style>
