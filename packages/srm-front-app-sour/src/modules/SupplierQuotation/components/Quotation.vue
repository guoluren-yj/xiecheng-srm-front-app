<template>
  <!--  <srm-popup :visible="value" class="FullPop" height="100%" position="right" -->
  <!--             :title="$T('ssrc.inquiryHall.view.message.modal.quotationDetail').$D('报价明细')" -->
  <!--             @onClose="close"> -->
  <div>
    <div v-loading="detailLoading" class="lineInfoDetail">
      <!-- 头信息 -->
      <srm-detail-head :data-source="quotationDetail" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip" @click="showFilePop">
            <!-- <img src="@/assets/4.0/icon_Button_paperclip_highlight@3x.png"> -->
            <span>{{ $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件') }}</span>
          </srm-button>
        </div>
      </srm-detail-head>
      <div class="line-body">
        <div v-if="content&&content.length>0" class="content">
          <ul v-for="(li,key) in content" :key="key">
            <li>
              <span v-if="li.status==='add'&&li.editFlag">
                <srm-input-field
                  v-model="li.configName"
                  :label="$T('ssrc.inquiryHall.view.quotationDetail.name').$D('明细名称')+':'"
                  :placeholder="$T('ssrc.inquiryHall.view.write.quotationDetail.name').$D('请输入明细名称')"
                  type="text"/>
              </span>
              <span v-else class="width-wrap">
                <span class="block"/>
                {{ $T('ssrc.inquiryHall.view.quotationDetail.name').$D('明细名称') }}：{{ li.configName }}
              </span>
            </li>
            <li>
              <span v-if="li.status==='add'&&li.editFlag">
                <srm-input-field
                  v-model="li.configCode"
                  :label="$T('ssrc.inquiryHall.view.quotationDetail.code').$D('明细编码')+'：'"
                  :placeholder="$T('smbl.common.view.pleaseInput',[$T('ssrc.inquiryHall.view.quotationDetail.code').$D('明细编码')]).$D('请输入{}')"
                  type="Number"/>
              </span>
              <span v-else>{{ $T('ssrc.inquiryHall.view.quotationDetail.code').$D('明细编码') }}：{{ li.configCode }}</span>
            </li>
            <li v-for="(item,index) in li.quotationColumns" :key="index">
              <span v-if="!(li.editFlag)&&item">
                <span
                  v-if="leftTimeFlag?(item.quotationColumnValue ? item.quotationColumnValue ==='REQUIRED': item.requiredFlag===1):false"
                  class="font-red">*</span>
                {{ item.columnName }}：{{ item.supQuotationColumnValue }}
              </span>
              <span v-else>
                <srm-input-field
                  v-if="item"
                  v-model="item.supQuotationColumnValue"
                  :label="item.columnName+'：'"
                  :placeholder="item.columnName"
                  :type="item.columnCode!=='Price'&&item.columnCode!=='Quantity'?'text':'number'"
                  :required="leftTimeFlag?(item.quotationColumnValue ? item.quotationColumnValue ==='REQUIRED': item.requiredFlag===1):false"/>
              </span>
            </li>
            <div class="edit-container">
              <span
                v-if="li.editFlag"
                class="bg-blue"
                @click.stop="showEdit(key,0,'ok')">{{ $T('hzero.common.button.ok').$D('确定') }}</span>
              <span
                v-if="!li.editFlag&&quotationDetail.allowCreateFlag&&leftTimeFlag"
                class="bg-blue"
                @click="addData(1,key)">{{ $T('ssrc.inquiryHall.view.add.next.leve').$D('新增下级') }}</span>
              <span
                v-if="quotationDetail.allowCreateFlag&&li.createFlag=== 1&&leftTimeFlag"
                class="bg-red"
                @click="deleteDetail(key,content)">{{ $T('ssrc.inquiryHall.model.inquiryHall.delete').$D('删除') }}</span>
              <img
                v-if="!li.editFlag&&leftTimeFlag"
                src="@/assets/icon_form_editor_normal@3x.png"
                alt
                @click="showEdit(key,1,'edit')">
            </div>
            <div v-if="li.children" class="show-more" @click.stop="showMore(li)">
              <span v-if="li.showMoreFlag">{{ $T('ssrc.inquiryHall.view.open.more.detail').$D('展开更多报价明细') }}</span>
              <span v-else>{{ $T('ssrc.inquiryHall.view.close.more.detail').$D('收起更多报价明细') }}</span>
              <img
                :class="li.showMoreFlag ? 'content img-down':'content img-up'"
                src="@/assets/icon_list_down_normal@3x.png">
            </div>
            <quotation-detail-line
              :class="li.children && !li.showMoreFlag ? 'showContent':'noShow'"
              :msg="li.children"
              :allow-create-flag="quotationDetail.allowCreateFlag"
              :delete-detail="deleteDetail"
              :left-time-flag="leftTimeFlag"/>
          </ul>
        </div>
        <div v-else class="noContent">
          <span>{{ $T("smbl.common.view.data.none").$D("暂无数据") }}</span>
        </div>
      </div>
    </div>
    <bottom-handler v-if="leftTimeFlag" :btn-arr="btnArr"/>
  </div>
<!--  </srm-popup> -->
</template>

<script>
import uuid from "uuid";
import { $T } from "srm-mobile-ui";
import BottomHandler from "@/components/BottomHandler";
import QuotationDetailLine from "./QuotationDetailLine";
import {
  getAddTemplate,
  saveQuotationDetail,
  getQuotationDetailApi,
  deleteQuotationDetail,
  getRfxDetailFileApi
} from "../api/index";

export default {
  modules: [ "ssrc.inquiryHall", "hzero.common", "smbl.common", "hipspfm.common", "ssrc.supplierQuotation", "hipspfm.supplierQuotation" ],
  name: "Quotation",
  components: {
    BottomHandler,
    QuotationDetailLine,
  },
  props: {
    // value: {
    //   type: Boolean
    // },
    supplierQuotationDetail: {
      type: Object,
      default: () => ({})
    },
    getOrderHeader: {
      type: Function
    },
    getOrderLine: {
      type: Function
    },
    leftTimeFlag: {
      type: Boolean,
    }
  },
  data() {
    return {
      detailLoading: false,
      quotationDetail: {},
      content: [],
      attachmentUuidLeft: "",
      attachmentUuidRight: "",
      template: [],
      createDetail:$T("smbl.common.button.createDetail").$D("新建明细"),
      quoDetailAttachmentUuid:""
    };
  },
  computed: {
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "templateName",
          render:(val, record) => <span>{record.templateNum } - {val}</span>
        },
        {
          fieldCode: "allowCreateFlag",
          fieldName:$T("ssrc.inquiryHall.model.template.allowCreateFlag").$D("允许供应商新建明细行"),
          render:(val) => <span> {val === 1 ? $T("hipspfm.common.status.yes").$D("是") : val === 0 ? $T("hipspfm.common.status.no").$D("否") : ""}</span>
        },
      ];

      return columns;
    },
    btnArr() {
      let newBtnArr = [
        {
          title: $T("smbl.common.button.save").$D("保存"),
          color: "var(--color-font-default-d)",
          background: "var(--color-other-default-b)",
          handler: () => {
            this.saveData();
          }
        }
      ];
      if (this.quotationDetail.allowCreateFlag) {
        newBtnArr.unshift({
          title: this.createDetail,
          color: "var(--color-other-default-b)",
          background: "var(--color-bg-default)",
          handler: () => {
            this.addData(0);
          }
        });
      }
      return newBtnArr;
    },
  },
  mounted() {
    this.getQuotationDetail();
  },
  // watch: {
  //   value(val) {
  //     if (val) {
  //       this.getQuotationDetail();
  //     }
  //   }
  // },
  methods: {
    onPopupClose() {
      this.$emit("input", false);
    },
    showFilePop() {
      this.$showFileList({
        title: $T("hipspfm.common.button.viewAttachments").$D("查看附件"),
        attachmentUuid: this.quoDetailAttachmentUuid,
        canUpload:true
      });
    },
    async getQuotationDetail() {
      const {
        itemCategoryId,
        itemId,
        quotationHeaderId,
        quotationLineId,
        rfxLineItemId,
        rfxHeaderId
      } = this.supplierQuotationDetail;
      const params = {
        itemCategoryId,
        itemId,
        quotationHeaderId,
        quotationLineId,
        rfxLineItemId,
        from: "SUP_QUOTATION",
        sourceFrom: "RFX",
        page: 0,
        size: 10
      };
      this.detailLoading = true;
      getQuotationDetailApi(rfxHeaderId, params).then((res) => {
        this.quotationDetail = res;
        this.content =
          res.supQuotationDetailPage && res.supQuotationDetailPage.content ||
          [];
        const result = this.content.length > 0 ? this.content[0] : res;
        getAddTemplate(res.templateId).then((response) => {
          this.template = response.content;
        });
        this.quoDetailAttachmentUuid = res.quoDetailAttachmentUuid || uuid();
        this.attachmentUuidRight = result.attachmentUuid || uuid();
        this.attachmentUuidLeft = this.quoDetailAttachmentUuid || uuid();
        function addShowMoreFlag(data) {
          data.showMoreFlag = true;
          if (data.children) {
            addShowMoreFlag(data.children);
          }
        }

        addShowMoreFlag(this.content);
        this.$forceUpdate();
      }).finally(() => {
        this.detailLoading = false;
      });
    },
    close() {
      this.$emit("changeVisible", false);
    },
    showMore(li) {
      li.showMoreFlag = !li.showMoreFlag;
      this.$forceUpdate();
    },
    //切换编辑状态
    showEdit(index, editFlag, status) {
      let flag = 0;
      if (status === "ok") {
        this.content[index].editFlag = 1;
        // eslint-disable-next-line no-unused-vars
        for (let item of this.content[index].quotationColumns) {
          if (
            item.quotationColumnValue === "REQUIRED" &&
            !item.supQuotationColumnValue
          ) {
            this.$notification.open({
              message: $T("hzero.common.validation.requireInput", [ item.columnName ]).$D("请输入{name}"),
              description: "",
              class: "notification"
            });
            flag = 0;
            break;
          } else {
            flag = 1;
          }
        }
        if (flag) {
          this.content[index].editFlag = 0;
        }
      } else if (status === "edit") {
        this.content[index].editFlag = 1;
      } else {
        this.content[index].editFlag = 0;
      }
      this.$forceUpdate();
    },
    // 新增明细,type=0为一级
    addData(type, index) {
      const template = JSON.parse(JSON.stringify(this.template)) || [];
      const {
        quotationHeaderId,
        rfxLineItemId,
        quotationLineId,
        rfxHeaderId
      } = this.supplierQuotationDetail;
      let list = {
        configName: null, //明细名称
        configCode: null, //明细编码
        quotationColumns: template,
        children: [],
        editFlag: 1,
        status: "add",
        createFlag: 1,
        parentDetailId: type ? this.content[index].supQuotationDetailId : 0,
        quoDetailAttachmentUuid: this.attachmentUuid,
        sourceFrom: "RFX",
        sourceHeaderId: rfxHeaderId,
        quotationHeaderId,
        rfxLineItemId,
        quotationLineId
      };
      if (type) {
        this.content[index].children ?
          this.content[index].children :
          this.content[index].children = [];
        this.content[index].children.unshift(list);
      } else {
        this.content.unshift(list);
      }
      this.$forceUpdate();
    },
    // 删除明细
    deleteDetail(index, data) {
      const { quotationLineId } = this.supplierQuotationDetail;
      let select = data[index].supQuotationDetailId;
      let sourceHeaderId = data[0].sourceHeaderId;
      if (!select) {
        data.splice(index, 1);
      } else {
        this.$loading.show();
        deleteQuotationDetail(sourceHeaderId, quotationLineId, [ select ]).then(
          (res) => {
            this.$loading.hide();
            if (res && res.failed) {
              this.$notification.open({
                message: res.message,
                description: "",
                class: "notification"
              });
            } else {
              this.$notification.open({
                message: $T("smbl.common.message.delete.success").$D("删除成功"),
                description: "",
                class: "notification"
              });
              this.getQuotationDetail();
            }
          }
        );
      }
    },
    //保存
    async saveData() {
      //附件必传校验
      if (this.quotationDetail.attachmentNeedFlag && this.quotationDetail.supQuotationDetailPage && this.quotationDetail.supQuotationDetailPage.content.length > 0) {
        let attachmentFlag;
        await getRfxDetailFileApi(this.attachmentUuidLeft).then((res) => {
          if (!res || res.length < 1) {
            attachmentFlag = false;
            this.$notification.open({
              message: $T("ssrc.inquiryHall.message.attachment.require.least.one").$D("附件为必传项，请至少上传一个附件！"),
            });
          } else {
            attachmentFlag = true;
          }
        });
        if (!attachmentFlag) {
          return;
        }
      }

      const {
        quotationHeaderId,
        quotationLineId
      } = this.supplierQuotationDetail;
      const {
        supQuotationDetailId = null,
      } = this.quotationDetail;
      // eslint-disable-next-line no-shadow
      const setNewData = function (source, uuid) {
        let data = [];
        if (Array.isArray(source) && source.length) {
          data = source.map((item) => {
            if (Array.isArray(item.children) && item.children.length) {
              return {
                ...item,
                quotationLineId,
                quoDetailAttachmentUuid: uuid,
                children: setNewData(item.children, uuid)
              };
            }
            return { ...item, quotationLineId, quoDetailAttachmentUuid: uuid };

          });
        }
        return data;
      };
      this.content = setNewData(this.content, this.attachmentUuidLeft);
      // this.content.map((item, index) => {
      //   item.quotationLineId = quotationLineId;
      //   item.quoDetailAttachmentUuid = this.attachmentUuidLeft;

      // });
      const params = {
        quoDetailAttachmentUuid: this.attachmentUuidLeft,
        supQuotationDetailId,
        sourceFrom:this.supplierQuotationDetail.sourceFrom,
        rfxLineItemId:this.supplierQuotationDetail.rfxLineItemId,
        supQuotationDetailList: this.content
      };

      if (quotationHeaderId) {
        this.$loading.show();
        await saveQuotationDetail(quotationHeaderId, params).then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              class: "notification"
            });
          } else {
            this.$notification.open({
              message: $T("smbl.common.message.save.success").$D("保存成功"),
              description: "",
              class: "notification"
            });
            this.getQuotationDetail();
          }
        });
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
.font-red {
  color: var(--color-other-default);
}

.bg-red {
  background: var(--color-other-default);
}

.bg-blue {
  background: var(--color-other-default-b);
}

.block {
  width: 6px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--color-other-default-b);
  margin: 0px 8px 0 0;
}

.right-button {

  img {
    height: 24px;
    width: 24px;
  }
}

.lineInfoDetail {
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
  background: var(--color-bg-default);
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color: var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color: var(--color-font-default);
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
        color: var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .line-body {
    overflow-y: scroll;
    padding-top:16px;
    margin-bottom: 10px;

    .content {
      .block {
        width: 6px;
        height: 14px;
        border-radius: 1px;
        background-color: var(--color-other-default-b);
        margin: 0px 8px 0 0;
        display: inline-block;
      }

      ul {
        padding: 0;
        li {
          margin: 12px 15px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: var(--color-font-default, #1b1e2b);
          display: flex;
          line-height: 20px;

          span {
            flex: 1;
          }
        }
      }

      .number {
        margin-right: 5px;
      }

      .show-more {
        padding: 5px 20px 12px 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: var(--color-font-default-b);
          text-align: right;
          line-height: 20px;
        }

        img {
          margin-left: 2px;
          width: 16px;
          height: 16px;
        }
      }

      .edit-container {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        width:100%;
        padding-right:15px;
        img {
          height: 28px;
          width: 28px;
        }

        span {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          line-height: 20px;
          padding: 4px 8px;
          border-radius: 2px;

          &:nth-child(1), &:nth-child(2) {
            margin-left: 12px;
          }
        }
      }

      .width-wrap {
        word-break: break-all;
        font-weight: 700;
      }
    }
  }
}
</style>
