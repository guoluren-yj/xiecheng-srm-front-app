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
          auto-height-policy="relative"
          :refreshable="false"
          @reachTop="loadMore">
          <ul v-for="(item,index) in msgList" :key="index">
            <li v-if="!item.senderFlag" class="left-section" >
              <div class="user-img">{{ item.createdByName.substring(0, 1) }}</div>
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
              <div class="user-img">{{ item.createdByName.substring(0, 1) }}</div>
            </li>
          </ul>
        </srm-scroll>
      </div>
      <!-- 空白页 -->
      <no-content
        v-else-if="msgList.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
      <footer>
        <srm-attachment
          ref="srmAttachment"
          display-type="none"
          directory="sodr-order"
          :bucket-name="bucketName"
          @fileUpload="handleChange">
          <img class="img-upload" src="@/assets/Comp/paperclip@3x.png">
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
import { SrmUtil } from "srm-mobile-ui";
import NoContent from "@/components/NoContent";
import { downloadFile } from "srm-mobile-ui/src/utils/jsBridge";
import { sendMessageApi, getMessageApi, recallMessage } from "./api";
import { View, Input, Popup, Scroll, NavBar } from "hips";
import moment from "moment";
export default {
  modules: [ "hipspfm.common" ],
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
      userId:SrmUtil.getUserInfo().id
    };
  },
  watch: {
    value(val) {
      this.$nextTick(() => {
        val && this.$refs.msgScroll && this.$refs.msgScroll.scrollEl.scrollTo(0, this.$refs.msgScroll.scrollEl.scrollHeight);
      });
    }
  },
  async mounted() {
    await this.getMessage();
  },
  methods: {
    onTouchStart(message) {
      //console.log("onTouchStart", message);
      const distance = moment().diff(moment(message.creationDate), "minutes");
      if (distance >= 3) {
        return;
      }
      this.msgList = this.msgList.map((item) => message.messageId === item.messageId && this.userId === item.createdBy ?
        { ...item, recallShow: true } :
        { ...item, recallShow: false });
    },
    onTouchEnd() {
      //console.log("onTouchEnd");
      this.msgList = this.msgList.map((item) => {
        if (item.recallShow) {
          const distance = moment().diff(moment(item.creationDate), "minutes");
          if (distance > 3) {
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
          } else {
            this.msgList = [];
            this.$notification.open({
              message: res.message,
              key,
              class: "notification"
            });
          }
        }
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
            attachmentName: file.fileName,
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
    async loadMore() {
      if (this.msgList.length < this.totalCount) {
        this.currentPage++;
        await this.getMessage("refresh");
      }
    },
    async handleChange(file) {
      await this.handleSend("file", file);
      this.changeFlag++;
    },
    handleCheck(file) {
      // 图片可预览
      const attachmentName = file.attachmentName.split(".");
      const fileType = attachmentName[attachmentName.length - 1].toLowerCase();
      console.log("fileType", fileType);
      if ([ "jpg", "png", "gif", "jpeg" ].includes(fileType)) {
        this.previewImg = this.buildImgUrl(
          file.attachmentUrl,
          SrmUtil.getDefaultBucketName()
        );
        this.$previewImage([ this.previewImg ]);
      } else {
        this.downloadlFileHandler(file.attachmentUrl, SrmUtil.getDefaultBucketName());
      }
    },
    //文件下载
    downloadlFileHandler(fileUrl, bucketName) {
      try {
        const downloadUrl = this.buildImgUrl(fileUrl, bucketName);
        console.log("downloadUrl:", downloadUrl);
        downloadFile(downloadUrl);
      } catch (e) {
        console.log("e:", e);
        this.$emit("input", false);
        const loadUrl = this.buildImgUrl(fileUrl, bucketName);
        console.log(loadUrl, "loadUrl");
        this.$router.push({
          path: `downLoad?downLoadUrl=${encodeURIComponent(loadUrl)}`
        });
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
    height: calc(100vh - 104px);
    overflow: auto;

    ul li {
      padding: 28px 15px
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
      font-size: 10px;
      color: #C6CAD6;
      line-height: 10px;
    }

    .user-time {
      font-family: Alibaba-PuHuiTi-R;
      font-size: 10px;
      color: #82879E;
      line-height: 10px;
    }
  }

  .user-message {
    margin-top: 8px;
    font-family: Alibaba-PuHuiTi-R;
    font-size: 16px;
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
      color: #414660;
      background: #F5F6FA;
      border-radius: 3px 12px 12px 12px;
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
        color: #FFFFFF;
        background: #354FF7;
        border-radius: 12px 3px 12px 12px;
      }
    }
  }
}

footer {
  position: fixed;
  bottom: 0;
  bottom: calc(0px + constant(safe-area-inset-bottom));
  bottom: calc(0px + env(safe-area-inset-bottom));
  height: 60px;
  width: 100%;
  padding: 0px 20px 8px;
  display: flex;
  align-items: center;

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
    height: 44px;
    line-height: 44px;
    width: 291px;
    position: static;

    input {
      font-size: 16px;
      color: #1b1e2b;
    }
  }

  >>> .hips-input__body {
    background: #F5F6FA;
    border-radius: 22px;
    padding: 0px 16px;
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
}
</style>
