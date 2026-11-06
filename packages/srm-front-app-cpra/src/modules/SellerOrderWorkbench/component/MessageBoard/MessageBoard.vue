<!--eslint-disable-->
<template>
  <srm-popup
    :visible="value"
    :show-close="false"
    show-back
    position="right"
    height="100%"
    :title="$T('hipspfm.common.model.messageboard.title').$D('留言板')"
    @onClose="closePop">
    <div class="BigContainer">
      <div v-if="msgList.length" class="content">
        <srm-scroll
          ref="msgScroll"
          :scrollable="true"
          :refreshable="true"
          :canLoadMore="false"
          @refresh="loadMore"
          auto-height-policy="relative"
          >
          <ul v-for="(item,index) in msgList" :key="index">
            <li v-if="!item.senderFlag" class="left-section">
              <!-- <div class="user-img">{{ item.createdByName.substring(0, 1) }}</div> -->
              <div>
                <div class="user-top">
                  <span class="user-name">{{ item.createdByName }}</span>
                  <span class="user-time">{{ item.creationDate }}</span>
                </div>
                <div
                  v-if="item.attachmentUrl"
                  class="user-message"
                  style="text-decoration: underline"
                  @click="handleCheck(item)">
                  {{ item.message }}
                </div>
                <!-- <a
                  v-if="item.attachmentUrl"
                  class="user-message"
                  style="text-decoration: underline"
                  :href= "getAttachmentUrl(item)"
                  target="_blank"
                  download
                  rel="noopener noreferrer"
                >
                  {{item.message}}
                </a> -->
                <div v-else class="user-message">{{ item.message }}</div>
              </div>
            </li>
            <li v-else class="right-section" @touchstart="onTouchStart(item)" @touchend="onTouchEnd">
              <div class="user-section">
                <div class="user-top">
                  <srm-button
            v-show="item.recallShow"
            size="small"
            @click="messageRecall(item)">
            <span>{{
              $T("hipspfm.common.message.title.recall").$D("撤回")
            }}</span>
          </srm-button>
                  <span class="user-time">{{ item.creationDate }}</span>
                  <span class="user-name">{{ item.createdByName }}</span>
                </div>
                <div
                  v-if="item.attachmentUrl"
                  class="user-message"
                  style="text-decoration: underline"
                  @click="handleCheck(item)">
                  {{ item.message }}
                </div>
                <div v-else class="user-message">{{ item.message }}</div>
              </div>
              <!-- <div class="user-img">{{ item.createdByName.substring(0, 1) }}</div> -->
            </li>
          </ul>
        </srm-scroll>
      </div>
      <!-- 空白页 -->
      <no-content
        v-else-if="msgList.length===0 && finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
      <footer>
        <srm-attachment
          ref="srmAttachment"
          display-type="none"
          directory="sodr-order"
          :bucket-name="bucketName"
          @fileUpload="handleChange">
          <!-- <img class="img-upload" src="@/assets/Comp/paperclip.svg"/> -->
          <span class="srm-icon icon-paperclip upload-icon"></span>
          <span class="upload-tip">{{$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}}</span>
        </srm-attachment>
        <hips-input v-model="msg" :placeholder="$T('hipspfm.common.model.messageboard.placeholder').$D('请输入留言')"
                    type="text" input-align="left">
          <div slot="right">
            <img class="img-sending" src="@/assets/Comp/brand-telegram@3x.png" @click="handleSend">
          </div>
        </hips-input>
      </footer>
    </div>
  </srm-popup>
</template>

<script>
/* eslint-disable no-invalid-this */
import { SrmUtil } from "srm-mobile-ui";
import NoContent from "@/components/NoContent";
import { debounce } from "lodash";
import { sendMessageApi, getMessageApi, recallMessage } from "./api";
import { View, Input, Popup, Scroll, NavBar } from "hips";
import moment from "moment";
export default {
  modules: [ "hipspfm.common", "smbl.common" ],
  name: "MessageBoard",
  components: {
    NoContent,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [Scroll.name]: Scroll,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    poHeaderId: {
      type: String
    },
    uploadUrl: {
      type: String,
      default: `${SrmUtil.getApiBaseUrl()}/hfle/v1/${window.localStorage.organizationId}/files/multipart`
    },
    headers: {
      type: Object,
      default: () => ({
        Authorization: `bearer ${window.localStorage.getItem("user-token")}`
      })
    },
    userCampCode: {
      type: String,
      default: "PURCHASE"
    }
  },
  data() {
    return {
      msg: "",
      msgList: [],
      currentPage: 0,
      totalCount: 0,
      finishLoad: false,
      bucketName: SrmUtil.getDefaultBucketName(),
      uploadPopup: true,
      changeFlag: 0,
      previewImg: "",
      realName:"",
      userId:SrmUtil.getUserInfo().id
    };
  },
  watch: {
    value(val) {
      val && this.scrollBottom();
    }
  },
  async mounted() {
    await this.getMessage();
  },
  methods: {
    onTouchStart(message) {
      //console.log("onTouchStart", message);
      const distance = moment().diff(moment(message.creationDate), "minutes");
      if (distance > 3) {
        return;
      }
      this.msgList = this.msgList.map((item) => message.messageId === item.messageId && this.userId === item.createdBy ?
        { ...item, recallShow: true } :
        { ...item, recallShow: false });
    },
    onTouchEnd() {
      // console.log("onTouchEnd");
      this.msgList = this.msgList.map((item) => {
        if (item.recallShow) {
          const distance = moment().diff(moment(item.creationDate), "minutes");
          if (distance >= 3) {
            return { ...item, recallShow: false };
          }
          return { ...item };
        }
        return { ...item };
      });
    },
    async messageRecall(item) {
      const params = {
        messageId: item.messageId,
      };
      await recallMessage(params).then((res) => {
        if (res) {
          this.getMessage();
        }
      });
    },
    closePop() {
      this.$emit("input", false);
    },
    async getMessage(type) {
      const params = {
        page: this.currentPage,
        poHeaderId: this.poHeaderId,
        size: 10
      };
      this.finishLoad = false;
      this.$loading.show();
      // TODO 卡顿
      await getMessageApi(params).then((res) => {
        this.finishLoad = true;
        this.$loading.hide();
        if (res) {
          if (res && res.content) {
            this.msgList =
            type === "refresh" ?
              [ ...res.content, ...this.msgList ] :
              res.content;
            this.totalCount = res.totalElements;
            if (!type) {
              this.scrollBottom();
            }
          } else {
            this.msgList = [];
            this.$notification.open({
              message: res.message,
              class: "notification"
            });
          }
        }
        this.finishRefresh(300);
      });
    },
    //发送信息
    async handleSend(type, file) {
      if (!this.msg && type !== "file") {
        this.$notification.open({
          message: this.$T("hipspfm.common.model.messageboard.messagetips").$D("消息不能为空"),
          class: "notification"
        });
        return false;
      }
      const params =
        type === "file" ?
          {
            attachmentName: file.fileName + "." + file.extension,
            attachmentUrl: file.fileUrl,
            message: file.fileName + "." + file.extension,
            poHeaderId: this.poHeaderId
          } :
          {
            message: this.msg,
            poHeaderId: this.poHeaderId,
            userCampCode: this.userCampCode
          };
      this.$loading.show();
      try {
        const res = await sendMessageApi(params);
        if (res && !res.failed) {
          this.loadRefresh();
          this.msg = "";
        }
      } finally {
        this.$loading.hide();
      }
    },
    // 加载刷新数据
    async loadRefresh() {
      this.msgList = [];
      this.currentPage = 0;
      await this.getMessage();
    },
    // 加载更多数据
    loadMore: debounce(async function() {
      if (this.msgList.length < this.totalCount) {
        this.currentPage++;
        await this.getMessage("refresh");
      } else {
        this.finishRefresh();
      }
    }, 200),
    // 停止下拉刷新
    finishRefresh(time) {
      this.$refs.msgScroll && this.$refs.msgScroll.finish(time);
    },
    async handleChange(file) {
      await this.handleSend("file", file);
      this.changeFlag++;
    },
    scrollBottom() {
      this.$nextTick(() => {
        this.$refs.msgScroll && this.$refs.msgScroll.scrollEl.scrollTo(0, this.$refs.msgScroll.scrollEl.scrollHeight);
      });
    },
    getAttachmentUrl(file) {
      return SrmUtil.buildImgUrl(
        file.attachmentUrl,
        SrmUtil.getDefaultBucketName()
      );
    },
    handleCheck(file) {
      // 图片可预览
      const attachmentName = file.message.split(".");
      const fileType = attachmentName[attachmentName.length - 1].toLowerCase();
      if ([ "jpg", "png", "gif", "jpeg" ].includes(fileType)) {
        this.previewImg = SrmUtil.buildImgUrl(
          file.attachmentUrl,
          SrmUtil.getDefaultBucketName()
        );
        this.$previewImage([ this.previewImg ], { showClose: true });
      } else {
        this.downloadlFileHandler(file.attachmentUrl, SrmUtil.getDefaultBucketName());
      }
    },
    //文件下载
    downloadlFileHandler(fileUrl, bucketName) {
      try {
        this.$downloadFile(fileUrl, bucketName, this.directory);
      } catch (e) {
        this.$emit("input", false);
        const loadUrl = SrmUtil.buildImgUrl(fileUrl, bucketName);
        this.$router.push({ "path": `downLoad?downLoadUrl=${encodeURIComponent(loadUrl)}` });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.BigContainer {
  position: relative;
  height: 100%;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;

    .img-close {
      height: 24px !important;
      width: 24px !important;
    }
  }

  .right-button {
    margin-right: 8px;

    img {
      margin-right: 12px;
      height: 24px;
      width: 24px;
    }
  }

  .content {
    height: calc(100vh - 164px);
    overflow: auto;

    ul li {
      padding: 10px 20px;
  }

  .left-section, .right-section {
    display: flex;
  }

  .user-img {
    display: inline-block;
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
    background: #F5F6FA;
    border-radius: 50%;
  }

  .user-top {
    max-width: 100%;

    .user-name {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #333333;
      line-height: 16px;
      font-weight: 400;
    }

    .user-time {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #757575;
      line-height: 16px;
      font-weight: 400;
    }
  }

  .user-message {
    display: inline-block;
    margin-top: 8px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    padding: 8px 12px;
    max-width: 249px;
    word-wrap: break-word;
  }

  .left-section {
    width: 100%;

    .user-img {
      margin-right: 8px;
    }

    .user-time {
      margin-left: 8px;
    }

    .user-message {
      background: #F6F6F6;
      border-radius: 2px;
      color: #333333;
    }
  }

  .right-section {
    float: right;

    .user-img {
      margin-left: 8px;
    }

    .user-top {
      text-align: right;

      .user-name {
        margin-left: 8px;
      }
      .user-time {
        margin-left: 8px;
      }
    }

    .user-section {
      max-width: 283px;

      .user-message {
        color: #276EF1;
        background: #EFF3FE;
        border-radius: 2px;
        float: right;
      }
    }
  }
}

footer {
  position: fixed;
  bottom: 0;
  bottom: calc(0px + constant(safe-area-inset-bottom));
  bottom: calc(0px + env(safe-area-inset-bottom));
  height: 110px;
  width: 100%;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;

  .img-upload {
    height: 28px;
    width: 28px;
    margin-right: 16px;
  }

  .img-sending {
    height: 28px;
    width: 28px;
    vertical-align: middle;
  }

  >>> .hips-input {
    padding: 0;
    height: 64px;
    line-height: 64px;
    width: 100%;
    position: static;

    input {
      font-size: 16px;
      color: #1b1e2b;
    }
  }

  >>> .hips-input__body {
    border-radius: 0;
    padding: 0px 16px;
    border-top: 2px solid #F0F2F5;
  }

  >>> .hips-input__input-value {
    display: block !important;
  }

  >>> .hips-input__input-value input::-webkit-input-placeholder {
    color: #82879e !important;
  }

  >>> .ant-upload-list.ant-upload-list-picture-card {
    display: none;
  }

  >>> .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 0;
  }

  >>> .ant-upload.ant-upload-select-picture-card {
    width: 0;
    height: 0;
    margin-right: 0;
    margin-bottom: 0;
  }
}

}
</style>

<style lang="stylus" scoped>
.srm-attachment {
  background transparent;
  width auto;
  padding: 0 20px;
  .upload-icon{
    font-size: 10px;
  }
  >>> .srm-attachment-upload-button{
    padding: 5px;
    background: #EFF3FE;
    border-radius: 18px;
    font-family: PingFangSC-Semibold;
    color: #276EF1;
    line-height: 12px;
    display: inline-block;
    margin-bottom: 10px;
  }
  .upload-tip{
    font-size: 10px;
    font-weight: 600;
  }
}
</style>
