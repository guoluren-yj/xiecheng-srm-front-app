<template>
  <hips-popup v-model="value" class="FullPop" style="height: 100%;width: 100%" position="right">
    <div class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/icon_screenlist_delete_normal@3x.png" class="image-black-default">
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('ssrc.inquiryHall.view.message.title.quotationDetail').$D('报价明细') }}
        </div>
        <div slot="right" class="right-button">
          <srm-upload :file-arr="fileArr" />
          <!-- <i @click="showFilePop"><img class="image-black-default" src="@/assets/attached_file@3x.png" alt /></i> -->
        </div>
      </hips-nav-bar>
      <div class="lineHead">
        <p>
          <span>{{ quotationDetail.templateNum }} - {{ quotationDetail.templateName }}</span>
        </p>
        <p v-if="isRfxApproval">
          <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.attachmentRequired").$D("附件必传") }}：{{ quotationDetail.attachmentNeedFlag? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
        </p>
        <p>
          <span>{{ $T("ssrc.inquiryHall.model.template.allowCreateFlag").$D("允许供应商新建明细行") }}：</span>
          <span>{{ quotationDetail.allowCreateFlag == 1 ? $T("hipspfm.common.status.yes").$D("是"):(quotationDetail.allowCreateFlag == 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
        </p>
      </div>
      <div class="lineBody">
        <quotation-detail-line v-if="JSON.stringify(content) !== '[]'" :msg="content"/>
        <div v-else class="noContent">
          <span>{{ $T("ssrc.inquiryHall.model.inquiryHall.temporarilyNoData").$D("暂无数据") }}</span>
        </div>
      </div>
    </div>

    <!-- 头附件弹窗 -->
    <attached-files
      v-model="filePopup"
      :file-arr="fileArr"/>
  </hips-popup>
</template>

<script>
import AttachedFiles from "@/components/File/AttachedFiles";
import uuid from "uuid";
import { View, Popup, NavBar } from "hips";
import { getQuotationDetailApi, } from "../api/jin";
import QuotationDetailLine from "./QuotationDetailLine";
export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.common", "ssrc.supplierQuotation" ],
  name: "QuotationDetail",
  components: {
    QuotationDetailLine,
    AttachedFiles,
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  props: {
    value: {
      type: Boolean
    },
    supplierQuotationDetail: {
      type: Object,
      default: {}
    },
    isRfxApproval:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filePopup: false,
      quotationDetail:{},
      content:[],
      attachmentUuid:""
    };
  },
  computed: {
    fileArr() {
      let newFileArr = [ { title: this.$T("ssrc.inquiryHall.view.message.button.viewAttachments").$D("查看附件"), attachmentUuid: this.attachmentUuid, readOnly: true },
        { title: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUpload").$D("采购方附件上传"), attachmentUuid: this.quotationDetail.attachmentUuid ? this.quotationDetail.attachmentUuid : uuid(), readOnly: true }, ];
      if (this.isRfxApproval) {
        newFileArr = [ { title: this.$T("ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUpload").$D("采购方附件上传"), attachmentUuid: this.quotationDetail.attachmentUuid ? this.quotationDetail.attachmentUuid : uuid(), readOnly: true } ];
      }
      return newFileArr;
    },
  },
  async mounted() {
    try {
      this.$loading.show();
      await this.getQuotationDetail();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    async getQuotationDetail() {
      const params = {
        itemCategoryId:this.supplierQuotationDetail.itemCategoryId,
        itemId:this.supplierQuotationDetail.itemId,
        quotationHeaderId:this.supplierQuotationDetail.quotationHeaderId,
        quotationLineId:this.supplierQuotationDetail.quotationLineId,
        rfxLineItemId:this.supplierQuotationDetail.rfxLineItemId,
        sourceFrom:"RFX",
        page:0,
        size:1000
      };
      await getQuotationDetailApi(this.supplierQuotationDetail.rfxHeaderId, params).then((res) => {
        this.quotationDetail = res;
        this.content = this.quotationDetail.supQuotationDetailPage.content || [];
        function addShowMoreFlag(data) {
          data.showMoreFlag = true;
          if (data.children) {
            addShowMoreFlag(data.children);
          }
        }
        addShowMoreFlag(this.content);
        if (this.quotationDetail.quoDetailAttachmentUuid) {
          this.attachmentUuid = this.quotationDetail.quoDetailAttachmentUuid;
        } else if (this.quotationDetail.supQuotationDetailPage.content[0].quoDetailAttachmentUuid) {
          this.attachmentUuid = this.quotationDetail.supQuotationDetailPage.content[0].quoDetailAttachmentUuid;
        } else {
          this.attachmentUuid = uuid();
        }
        this.$forceUpdate();
        console.log(JSON.stringify(this.content) == "{}");
      });
    },
    closePop() {
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}
.block {
  width: 6px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--color-other-default-b);
  margin: 0px 8px 0 0;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}
.lineInfoDetail {
  background:var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

}
</style>
