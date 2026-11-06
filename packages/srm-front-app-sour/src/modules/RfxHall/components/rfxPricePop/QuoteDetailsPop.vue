<!-- eslint-disable rulesdir/no_hips -->
<template>
  <srm-popup
    :visible="visible" height="100%" position="right" @onClose="close">
    <!-- 导航 -->
    <nav-head :title="$T('ssrc.inquiryHall.view.message.modal.quotationDetail').$D('报价明细')" @goTop="goTop" @goBack="goBack" @goClose="goClose"/>

    <srm-detail-head
      :columns="getHeadColumn"
      :data-source="materielInfo">
      <div class="button-right-margin">
        <srm-button size="small" icon="icon-paperclip" bordered @click="showFilePop">
          {{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
        </srm-button>
        <srm-button size="small" icon="icon-paperclip" bordered type="warn" @click="showPurFilePop" >
          {{ $T('ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUpload').$D('采购方附件上传') }}
        </srm-button>
      </div>
    </srm-detail-head>

    <!-- 附件 -->
    <!-- <div class="attachmentWrap">
      <div class="attachment-content">
        <span class="attachment-text">{{ $T('ssrc.inquiryHall.model.inquiryHall.purchaseAttachmentUpload').$D('采购方附件上传') }}</span>
      </div>
    </div> -->

    <div ref="content" class="rfxprice-detail">
      <div class="content">
        <div v-if="JSON.stringify(lineInfo) === '[]'" class="noContent">
          <span>{{ $T('smbl.common.view.noDocumentInformation').$D('暂无单据信息') }}</span>
        </div>
        <!-- 内容区 -->
        <div v-for="(item,headerIndex) in lineInfo" v-else :key="headerIndex" >
          <hips-collapse v-model="activeName">
            <hips-collapse-item :name="headerIndex">
              <div slot="title" class="title" @click.stop>
                <!-- 内容区 -->
                <div class="content">
                  <!-- 个性化组件替换后的代码 -->
                  <customize-detail :columns="getColumns" :data-source="item" code="SMBL.INQUIRY_HALL.LIST.RFXPRICE_SUPPLIER_QUATION_DETAIL" />
                </div>
              </div>
              <div slot="right-icon" class="right-icon">
                <div class="right-icon-wrap">
                  {{ $T('ssrc.common.view.button.unfold').$D('展开明细') }}
                  <img
                    class="image-gray-default"
                    src="@/assets/icon_list_right_normal@3x.png">
                </div>
              </div>
              <div v-if="lineInfo[headerIndex].children && lineInfo[headerIndex].children.length > 0" class="content-body">
                <div v-for="(line, index) in lineInfo[headerIndex].children" :key="index" class="list list-content">
                  <!-- 内容区 -->
                  <div class="content">
                    <!-- 个性化组件替换后的代码 -->
                    <customize-detail :columns="getColumns" :data-source="item" code="SMBL.INQUIRY_HALL.LIST.RFXPRICE_SUPPLIER_QUATION_DETAIL" />
                  </div>
                </div>
              </div>
            </hips-collapse-item>
          </hips-collapse>
        </div>
      </div>
    </div>

    <!-- 附件弹窗 -->
    <attached-file
      v-model="filePopup"
      :bucket-name="bucketName"
      :attachment-uuid="quoDetailAttachmentUuid"
      :query-params="{tenantId}"/>

    <!-- 采购方附件上传弹窗 -->
    <attached-file
      v-model="purFilePopup"
      :bucket-name="bucketName"
      :attachment-uuid="attachmentUuid"
      :query-params="{tenantId}"/>
  </srm-popup>
</template>

<script>
import {
  Collapse,
  CollapseItem,
} from "hips";
import {
  getQuotationTemplateApi
} from "../../api/RfxPrice";
import NavHead from "@/components/NavHead";
import AttachedFile from "@/components/File/AttachedFile";

export default {
  modules: [ "ssrc.inquiryHall", "hipspfm.common", "ssrc.common", "ssrc.queryRfq", "hipspfm.workFlow", "hipspfm.invoiceBill", "smbl.common" ],
  name: "QuoteDetailsPop",
  components: {
    AttachedFile,
    NavHead,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rfxHeaderId:{
      type:String,
      default:""
    },
    materielInfo: {
      type:Object,
      default: () => ({})
    },
    currentPageType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      curIndex: "A",
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
      filePopup: false,
      purFilePopup:false,
      activeName: [],
      quoteDetailInfo:{}, //报价明细信息
      lineInfo:[],
      bucketName:"private-bucket",
      attachmentUuid:"",
      quoDetailAttachmentUuid:"",
      tenantId: window.localStorage.tenantId,
    };
  },
  computed: {
    showQuantity() {
      return (data, code) => {
        const obj = data.find((item) => item.columnCode === code) || {};

        return obj["supQuotationColumnValue"];
      };
    },
    // 采购组织人员
    getOrgPersonInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.queryRfq.model.queryRfq.company").$D("公司"),
          fieldCode: "companyName",
        },
      ];

      return columns;
    },
    // 详情头
    getHeadColumn() {
      return [
        {
          fieldName: this.$T("ssrc.inquiryHall.view.inquiryHall.inquiryTitle").$D("询价单标题"), // 不传标题则只展示对应值
          fieldType: "TEXT", // 默认TEXT,可选 TEXT/TAG
          fieldCode: "rfxTitle",
          render: (val) => val,
          callBack: () => {},
        },
        {
          fieldCode: "rfxNum",
        },
        // {
        //   fieldName: this.$T("ssrc.inquiryHall.modal.inquiryHall.sourcingTemplate").$D("寻源模板"), // 不传标题则只展示对应值
        //   fieldCode: "templateName",
        // }
      ];
    },
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.common.model.common.configName").$D("报价明细名称"),
          fieldCode: "configName",
          fieldType:"EMPTY",
          formRow:0,
          render:(val) => <SrmListHeader showOpenTag={false}>
            <span>{this.$T("ssrc.common.model.common.configName").$D("报价明细名称")}：{ val }</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("ssrc.common.model.common.configCode").$D("报价明细编码"),
          fieldCode: "configCode",
        },
        {
          fieldName: this.$T("ssrc.common.number").$D("数量"),
          fieldCode: "quantity",
          render:(val, record) => <span>{this.showQuantity(record.quotationColumns, "Quantity")}</span>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.unitPrice").$D("单价"),
          fieldCode: "price",
          fieldType: "ssrc.common.unitPrice",
          render:(val, record) => <span>{this.showQuantity(record.quotationColumns, "Price")}</span>
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.remark").$D("备注信息"),
          fieldCode: "remarkInfo",
          fieldType:"EMPTY",
          render:(val, record) => <srm-textarea-field disabled value={record.quotationColumns[2] ? record.quotationColumns[2].supQuotationColumnValue : ""} theme="fill"/>
        },
      ];
      return columns;
    }
  },
  async mounted() {
    try {
      this.$loading.show();
      // eslint-disable-next-line no-irregular-whitespace
      await this.getQuotationTemplateInfo();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    //switch切换
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    close() {
      this.$emit("changePopVisible", false);
    },
    //附件显示
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    //采购方上传附件显示
    showPurFilePop() {
      this.purFilePopup = !this.purFilePopup;
    },
    /**
     * ******************
     * 获取页面数据接口
     * ******************
     */
    //报价明细信息
    async getQuotationTemplateInfo() {
      const params = {
        page: 0,
        size: 1000,
        itemCategoryId: this.materielInfo.itemCategoryId,
        quotationHeaderId: this.materielInfo.quotationHeaderId,
        quotationLineId: this.materielInfo.quotationLineId,
        itemId: this.materielInfo.itemId,
        rfxLineItemId: this.materielInfo.rfxLineItemId,
        sourceFrom: "RFX",
        sourceMobileEndFlag: 1,
        pageType: this.currentPageType,
      };

      await getQuotationTemplateApi(this.rfxHeaderId, params).then((res) => {
        if (res && !res.failed) {
          // eslint-disable-next-line vue/no-mutating-props
          this.materielInfo.templateName = res.templateName;
          this.quoteDetailInfo = res;
          this.attachmentUuid = res.attachmentUuid;
          //逻辑是这样的，如果头上有，就取头上的UUID，如果头上没有就取第一行的UUID
          this.quoDetailAttachmentUuid = res.quoDetailAttachmentUuid;
          if (res.supQuotationDetailPage.content.length > 0) {
            this.lineInfo = res.supQuotationDetailPage.content;
            if (!this.quoDetailAttachmentUuid) {
              this.quoDetailAttachmentUuid = res.supQuotationDetailPage.content[0].quoDetailAttachmentUuid;
            }
          }
        }
      });
    },
    /**
     * ************************
     * 组件属性控制方法
     * ************************
     */
    change(e) {
      this.curIndex = e.target.dataset.index;
    },
    // 返回
    goBack() {
      //取父页面v-model的绑定值，设置其值为false，效果为隐藏报价明细pop
      this.$emit("input", false);
    },
    //退出子应用
    goClose() {
      this.$emit("input", false);
    },
    //回到顶部
    goTop() {
      // eslint-disable-next-line no-irregular-whitespace
      this.$refs.content.scrollTop = 0;
    },
  },
};
</script>

<style lang="stylus" scoped>

.rfxprice-detail {
  width: 100%;
  height calc(100vh - 140px);
  padding-bottom 100px;
  overflow-y: auto;
}
.attachmentWrap{
  display: flex;
  align-items: center;
  height: 64px;
  background: #ffffff;

  .attachment-content{
    height: 32px;
    background: #276ef1;
    border-radius: 16px;
    display: flex;
    align-items: center;
    margin-left: 15px;

    .attachment-text{
      padding: 8px 16px;
      font-size: 12px;
      text-align: left;
      color: #ffffff;
      line-height: 16px;
    }
  }

}

.content {
  >>>.hips-cell {
    padding 16px 15px;
  }
  >>> .hips-cell__title{
    width:100%;
  }
  .right-icon {
    display: flex;
    align-items: flex-end;

    .right-icon-wrap {
      background: #276ef1;
      border: 1px solid #276ef1;
      border-radius: 10px;
      font-size: 10px;
      color: #ffffff;
      line-height: 12px;
      padding: 4px 8px;
      display: flex;
      align-items: center;

      img {
        width: 12px;
        height: 12px;
        transition: all 0.3s;
      }
    }
  }

  .content-body {
    .list-content{
      font-size: 14px;
      text-align: left;
      color: #1f1f1f;
      line-height: 20px;
    }
    }
  }

>>> .hips-collapse-item__title .right-icon img {
  -webkit-transform: rotateZ(0) !important;
  transform: rotateZ(0) !important;
}

>>> .hips-collapse-item__title--expanded .right-icon img {
  -webkit-transform: rotateZ(90deg) !important;
  transform: rotateZ(90deg) !important;
}

>>> .hips-collapse-item__title{
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.08);
}
//
//>>>.srmPopovers .tipImag {
//  background: transparent;
//}

>>>.srmPopovers .top {
  background: none;
}
</style>
