<template>
  <srm-popup
    :title="$T('hwfp.task.button.comment').$D('评论')"
    :visible="visible"
    position="bottom"
    height="100%"
    rounded
    class="srm-approval-reply-record"
    @onClose="$emit('input', false)">
    <slot slot="left" name="left" />
    <slot name="prompt" />
    <div class="srm-approval-reply-record-body">
      <div ref="chatContainer" class="srm-approval-reply-record-content">
        <div v-if="data.length === 0" class="srm-approval-reply-record-empty-content">
          <img
            src="@/assets/no_comment.svg"
            class="srm-approval-reply-record-empty-img">
          <div class="srm-approval-reply-record-empty-title">
            {{ $T('hwfp.common.view.message.emptyComment').$D('暂无评论') }}
          </div>
        </div>
        <div v-else>
          <div
            v-for="(group, index) in data"
            :key="index">
            <div v-if="!!group[0]" class="srm-approval-reply-record-time">{{ group[0].endTime || group[0].creationDate }}</div>
            <div
              v-for="item in group"
              :key="item.id">
              <div
                :class="['srm-approval-reply-record-item', {
                  'align-left': item.assignee !== selfEmployeeCode,
                  'align-right': item.assignee === selfEmployeeCode,
                } ]">
                <div class="srm-approval-reply-record-item-title">
                  {{ item.assigneeName || item.assignee }}
                  <div v-if="item.commentRemindEmpNameList" class="srm-approval-reply-record-item-at">
                    <srm-tooltip :title="item.commentRemindEmpNameList.join(',')" placement="bottom">
                      <div>
                        <span v-for="empItem in item.commentRemindEmpNameList" :key="empItem">
                          <span :style="{color: item.commentReplyFlag === 1 ? '#FC8800': '#333'}">
                            @{{ empItem }}
                          </span>
                        </span>
                      </div>
                    </srm-tooltip>
                  </div>
                </div>
                <div class="srm-approval-reply-record-item-content-wrap">
                  <div class="srm-approval-reply-record-item-content">
                    <div class="srm-approval-reply-record-item-content-main">
                      {{ item.comment }}
                    </div>
                    <div v-if="!!item.attachmentUuid && attachmentsCount[item.attachmentUuid]" class="srm-approval-reply-record-item-content-footer">
                      <srm-button size="small" icon="icon-paperclip">
                        <srm-attachment-button
                          size="small"
                          show-total
                          :title="上传"
                          :attachments="[{
                            uploadButton: 'none',
                            readonly: true,
                            attachmentUuid: item.attachmentUuid
                          }]"/>
                      </srm-button>
                    </div>
                  </div>
                  <div
                    v-if="item.assignee !== selfEmployeeCode && item.commentReplyFlag === 1"
                    class="srm-approval-reply-record-item-content-after">
                    <img
                      class="image-black-default"
                      src="@/assets/question-answer-line.svg"
                      alt
                      @click="handleReply(item)">
                  </div>
                </div>
                <div v-if="item._parent" class="srm-approval-reply-record-item-content-extra">
                  {{ item._parent.assigneeName }}：{{ item._parent.comment }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="srm-approval-reply-record-footer">
        <div class="quick-choice-remind">
          {{ $T("smbl.common.title.quickChoice").$D("快速选择提醒的人") }}
        </div>
        <div class="quick-choice-remind-buttons">
          <srm-button
            class="srm-history-record-expand"
            @click="setRemindApprover('INITIATOR')">
            {{ $T("smbl.common.button.processInitiator").$D("流程发起人") }}
          </srm-button>
          <srm-button
            class="srm-history-record-expand"
            @click="setRemindApprover('CURRENT_WAITING_APPROVE')">
            {{ $T("smbl.common.button.currentApprover").$D("当前待审批人") }}
          </srm-button>
          <srm-button
            class="srm-history-record-expand"
            @click="setRemindApprover('ALL_PROCESS_PARTICIPANT')">
            {{ $T("smbl.common.button.allParticipants").$D("所有流程参与人") }}
          </srm-button>
        </div>
        <div class="srm-approval-reply-record-noticer">
          <srm-lov-field
            ref="remindEmployeeRef"
            v-model="replyParams.remindEmployeeNumber"
            code="HWFP.EMPLOYEE"
            :display="replyParams.remindEmployeeName"
            :options="{
              multiple: !replyCommentId,
              valueField: 'employeeNum',
              displayField: 'name',
              queryParams: {
                tenantId: processInstance ? processInstance.startUserId : null,
                enabledFlag: 1,
                valueField: 'employeeNum',
                displayField: 'name',
              },
            }"
            :clear-button="!!replyCommentId"
            :disabled="!!replyCommentId"
            :placeholder="$T('hwfp.common.view.placeholder.select').$D('待选择')"
            @inputChange="handleInputChange">
            <span slot="left">{{ $T('hwfp.common.view.placeholder.reminder').$D('提醒人') }}：</span>
          </srm-lov-field>
        </div>
        <div style="display: flex">
          <div style="flex: 1;overflow: hidden">
            <srm-textarea-field
              v-model="replyParams.comment"
              :bordered="false"
              :show-resizer="false"
              :placeholder="$T('hwfp.common.view.placeholder.sendMsg').$D('发消息')"
              required
              :show-length="true"
              :max-length="3500"
              :auto-size="true"
              :edit-button="false"
              :clear-button="false"
              :rows="5"
              class="srm-approval-reply-record-input"/>
            <div v-if="!!replyComment" class="srm-approval-reply-record-reply-content">
              {{ replyComment.comment }}
              <span class="srm-icon icon-circle-x srm-approval-reply-record-reply-clear" @click="handleClearReply" />
            </div>
          </div>
          <span class="srm-approval-reply-record-file">
            <span class="srm-icon icon-folder" style="font-size: 30px;position: absolute;bottom: 0" @click="showFileList"/>
            <span v-if="replyParams.fileCount>0" class="srm-approval-reply-record-file-count">{{ replyParams.fileCount > 99 ? '99+' : replyParams.fileCount }}</span>
          </span>
          <span class="srm-approval-reply-record-file">
            <img src="@/assets/message-send.svg" style="width: 28px;position: absolute;bottom: 0" @click="handleSendMessage">
          </span>
        </div>
      </div>
    </div>
  </srm-popup>
</template>
<script>
import { SrmUtil } from "srm-mobile-ui";
import uuid from "uuid";
import { debounce } from "lodash";
import moment from "moment";
import { postReplyRecords, postReplyComment, postStartComment, postFileCountBatch, fetchSettingAndSetRemindApprover, getRemindEmployee } from "../api/index";
import { filterNullValueObject } from "@/utils";

export default {
  modules: ["hwfp.task", "hwfp.common", "smbl.workFlow", "smbl.common"],
  name: "ReplyRecord",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    commentId: {
      type: String,
      default: null,
    },
    commentItem: {
      type: Object,
      default: null,
    },
    processInstanceId: {
      type: String,
      default: null,
    },
    taskId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      data: [],
      visible: false,
      replyComment: null,
      replyCommentId: null,
      tenantId: window.localStorage.tenantId,
      replyParams: {
        fileCount: 0,
        attachmentUuid: uuid(),
        remindEmployeeNumber: null,
        remindEmployeeName: null,
        comment: null,
      },
      attachmentsCount: {},
    };
  },
  computed: {
    selfEmployeeCode() {
      const { additionInfo } = SrmUtil.getUserInfo() || {};
      const { employeeCode } = additionInfo || {};
      return employeeCode;
    },
    queryParams() {
      const { tenantId } = SrmUtil.getUserInfo() || {};
      return {
        tenantId,
        enabledFlag: 1,
      };
    },
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.init(true);
      } else {
        this.replyComment = null;
        this.replyCommentId = null;
        this.replyParams = {
          fileCount: 0,
          attachmentUuid: uuid(),
          remindEmployeeNumber: null,
          remindEmployeeName: null,
          comment: null,
        };
      }
    },
    commentItem(val) {
      this.replyParams.remindEmployeeName = val ? val.assigneeName : null;
      this.replyParams.remindEmployeeNumber = val ? val.assignee : null;
    }
  },
  methods: {
    init(initFlag) {
      const params = {};
      if (Array.isArray(this.processInstanceId)) {
        params.procInstIdList = this.processInstanceId;
      } else {
        params.procInstId = this.processInstanceId;
      }
      this.$loading.show();
      const isReply = Boolean(this.commentId);
      postReplyRecords(params)
        .then((res) => {
          if (res && res.length) {
            const attachmentsId = [];
            const data = [];
            res.forEach((r) => {
              const _parent = {
                ...r,
                assignee: r.assignee || r.employeeNum,
                assigneeName: r.assigneeName || r.employeeName,
              };
              if (r.attachmentUuid) {
                attachmentsId.push({ bucketName: "private-bucket", uuid: r.attachmentUuid });
              }
              data.push(_parent);
              if (r.commentRecordList && r.commentRecordList.length > 0) {
                const replyRecords = r.commentRecordList.map((item) => {
                  if (item.attachmentUuid) {
                    attachmentsId.push({ bucketName: "private-bucket", uuid: item.attachmentUuid });
                  }
                  return {
                    ...item,
                    assignee: item.assignee || item.employeeNum,
                    assigneeName: item.assigneeName || item.employeeName,
                    _parent,
                  };
                });
                data.push(...replyRecords);
              }
            });
            this.queryAttachmentsCount(attachmentsId);
            let replyComment;
            let replyCommentId;
            if (initFlag && isReply) {
              replyComment = data.find((i) => i.id === this.commentId);
              if (replyComment) {
                const { assignee, assigneeName, employeeNum, employeeName, id } = replyComment;
                replyComment = {
                  ...replyComment,
                  assignee: assignee || employeeNum,
                  assigneeName: assigneeName || employeeName,
                };
                replyCommentId = id;
              }
            }
            // 时间倒序
            data.sort((a, b) => a.creationDate > b.creationDate ? 1 : -1);
            this.groupDataByMinute(data);
            this.replyComment = replyComment;
            this.replyCommentId = replyCommentId;
            this.scrollToBottom();
            this.fetchSettingAndSetRemindApprover();
          }
        }).finally(() => {
          this.$loading.hide();
        });
    },
    queryAttachmentsCount(attachmentsId) {
      postFileCountBatch(attachmentsId).then((res) => {
        if (res && !res.failed) {
          this.attachmentsCount = res;
        }
      });
    },
    setRemindApprover(commentRemindMode) {
      const procInstId = Array.isArray(this.processInstanceId) ? this.processInstanceId[0] : this.processInstanceId;
      getRemindEmployee(commentRemindMode, procInstId).then((res) => {
        if (res && !res.failed) {
          const numbers = res.map((r) => r.employeeNum);
          let names = res.map((r) => r.name);
          this.replyParams.remindEmployeeNumber = numbers.join(",");
          this.replyParams.remindEmployeeName = names.join(",");
          if (this.$refs.remindEmployeeRef) {
            this.$refs.remindEmployeeRef.valueField = "employeeNum";
            this.$refs.remindEmployeeRef.displayField = "name";
            this.$refs.remindEmployeeRef.init();
          }
        }
      });
    },
    fetchSettingAndSetRemindApprover() {
      fetchSettingAndSetRemindApprover().then((res) => {
        if (res && !res.failed) {
          const { commentDefaultRemindPerson } = res;
          if (commentDefaultRemindPerson) {
            this.setRemindApprover(commentDefaultRemindPerson);
          }
        }
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
      });
    },
    groupDataByMinute(data) {
      // 间隔5分钟分一组
      const result = [];
      let group = [];
      if (data.length) {
        data.forEach((item, index) => {
          if (group.length) {
            const groupLastItem = group[group.length - 1];
            const groupLastItemTime = groupLastItem.endTime || groupLastItem.creationDate;
            const itemTime = item.endTime || item.creationDate;
            if (itemTime && groupLastItemTime) {
              if (moment(itemTime).diff(moment(groupLastItemTime), "minutes") > 5) {
                result.push(group);
                group = [];
              }
            }
          }
          group.push(item);
          if (index === data.length - 1) {
            result.push(group);
          }
        });
      }
      this.data = result;
    },
    handleInputChange(val) {
      if (!val) {
        this.replyParams.remindEmployeeNumber = null;
        this.replyParams.remindEmployeeName = null;
      }
    },
    handleReply(replyItem) {
      this.replyParams.remindEmployeeNumber = replyItem.assignee;
      this.replyParams.remindEmployeeName = replyItem.assigneeName;
      if (this.replyCommentId !== replyItem.id) {
        this.replyCommentId = replyItem.id;
        this.replyComment = replyItem;
      }
    },
    handleClearReply() {
      this.replyCommentId = null;
      this.replyComment = null;
      this.replyParams.remindEmployeeNumber = null;
      this.replyParams.remindEmployeeName = null;
    },
    handleSendMessage() {
      this.submitData(this);
    },
    submitData: debounce(async(self) => {
      const isReply = Boolean(self.replyComment);
      const { attachmentUuid, comment, remindEmployeeNumber } = self.replyParams;
      if (!comment) {
        self.$notification.open({
          message: self.$T("hwfp.common.view.message.noComment").$D("请输入评论意见"),
        });
        return;
      }
      if (comment.length > 3500) {
        self.$notification.open({
          message: self.$T("hwfp.common.view.message.commentTooLong").$D("评论内容太长了！"),
        });
        return;
      }
      const data = filterNullValueObject({
        attachmentUuid,
        comment,
        remindEmployeeNumber,
        taskId: self.taskId,
        procInstId: Array.isArray(self.processInstanceId) ? self.processInstanceId[0] : self.processInstanceId,
      });
      if (isReply) {
        data.relId = self.replyComment.id;
      }
      const service = isReply ? postReplyComment : postStartComment;
      service(data).then((res) => {
        if (res && res.failed) {
          self.$notification.open({ message: res.message });
        } else {
          self.init();
          self.replyComment = null;
          self.replyCommentId = null;
          self.replyParams = {
            fileCount: 0,
            attachmentUuid: uuid(),
            remindEmployeeNumber: null,
            comment: null,
          };
        }
      });
    }, 200),
    onFileListChange(fileList) {
      this.replyParams.fileCount = fileList ? fileList.length : 0;
    },
    showFileList() {
      this.$attachment({
        attachments: [{
          attachmentUuid: this.replyParams.attachmentUuid,
          title: this.$T("smbl.workFlow.view.approve.uploadAttachment").$D("上传附件"),
        }],
        onFileListChange: this.onFileListChange,
      });
    },
  }
};
</script>
<style lang="stylus" scoped>
.srm-approval-reply-record-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f6f6f6;
}
.srm-approval-reply-record-content {
  padding: 12px 24px 50px 24px;
  flex: 1;
  position: relative;
  overflow: auto;
}
.srm-approval-reply-record-empty-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.srm-approval-reply-record-empty-title {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #4e5769;
  line-height: 18px;
  font-weight: 400;
}
.srm-approval-reply-record-time {
  margin: 15px 0;
  font-size: 12px;
  color: #AFAFAF;
  text-align: center;
  font-weight: 400;
}
.srm-approval-reply-record-item {
  margin-bottom: 16px;
  font-size: 12px;
}
.srm-approval-reply-record-item.align-left {
  margin-right: 32px;
}
.srm-approval-reply-record-item.align-right {
  margin-left: 32px;
}
.srm-approval-reply-record-item-title {
  color: #868d9c;
  margin-bottom: 6px;
  font-size: 12px;
  color: #868D9C;
  line-height: 16px;
  font-weight: 400;
  display: flex;
  white-space: nowrap;
}
.srm-approval-reply-record-item-at {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.srm-approval-reply-record-item.align-left .srm-approval-reply-record-item-at {
  margin-left: 5px;
}
.srm-approval-reply-record-item.align-right .srm-approval-reply-record-item-at {
  margin-right: 5px;
}
.srm-approval-reply-record-item.align-left .srm-approval-reply-record-item-title {
  text-align: left;
}
.srm-approval-reply-record-item.align-right .srm-approval-reply-record-item-title {
  text-align: right;
  flex-direction: row-reverse;
}
.srm-approval-reply-record-item-content {
  z-index: 10;
  background: #fff;
  border-radius: 3px;
  position: relative;
  overflow: auto;
}
.srm-approval-reply-record-item-content-after {
  min-width: 40px;
  background: #fff;
  margin-left: 5px;
  position: relative;
}
.srm-approval-reply-record-item-content-after img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.srm-approval-reply-record-item-content-arrow {
  position: absolute;
  height: 10px;
  width: 10px;
  background: #fff;
  z-index: -1;
  border-radius: 2px;
  transform: rotate(45deg);
}
.srm-approval-reply-record-item.align-left .srm-approval-reply-record-item-content-arrow {
  top: 10px;
  left: -5px;
  border-left: 1px solid #e5e7ec;
  border-bottom: 1px solid #e5e7ec;
}
.srm-approval-reply-record-item.align-right .srm-approval-reply-record-item-content-arrow {
  top: 10px;
  right: -5px;
  border-right: 1px solid #e5e7ec;
  border-top: 1px solid #e5e7ec;
}
.srm-approval-reply-record-item-content-title {
  color: #000;
  line-height: 18px;
  font-weight: 500;
}
.srm-approval-reply-record-item-content-wrap {
  display: flex;
  overflow: hidden;
}
.srm-approval-reply-record-item.align-right .srm-approval-reply-record-item-content-wrap {
  flex-direction: row-reverse;
}
.srm-approval-reply-record-item-content-main {
  color: #333;
  font-size: 14px;
  padding: 10px;
  line-height: 20px;
  word-break: break-word;
}
.srm-approval-reply-record-item-content-footer {
  border-top: 1px rgba(218, 223, 230, 1) dashed;
  margin: 0 10px;
}
.srm-approval-reply-record-item-content-footer button {
  background-color: transparent;
  margin: 5px 0;
  padding: 0;
}
.srm-approval-reply-record-item-content-extra {
  margin-top: 4px;
  padding: 8px 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #eee;
  color: #333;
  border-radius: 4px;
  font-weight: 400;
}
.srm-approval-reply-record-item-content-btn {
  color: var(--font-color-primary);
  white-space: nowrap;
  margin-left: 8px;
}
.srm-approval-reply-record-item-content-btn .srm-icon {
  vertical-align: middle;
  font-size: 14px;
}
.srm-approval-reply-record-footer {
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  padding: 8px 15px 20px 15px;
  position: relative;
}
.quick-choice-remind {
  font-size: 12px;
  color: #AFAFAF;
  margin: 8px 0;
}
.quick-choice-remind-buttons {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.srm-approval-reply-record-input {
  background-color: #fff;
}
.srm-approval-reply-record-input /deep/.srm-textarea {
  line-height: 28px !important;
  min-height: 28px !important;
  padding: 0 10px;
  max-height: 140px;
  overflow: auto;
}
.srm-approval-reply-record-file {
  position: relative;
  margin-left: 15px;
  min-width: 30px;
}
.srm-approval-reply-record-file-count {
  position: absolute;
  bottom: 14px;
  right: -8px;
  min-width: 5.333vw;
  height: 5.333vw;
  line-height: 5.333vw;
  background: #e11900;
  border-radius: 2.667vw;
  padding: 0 6px;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  border-radius: 20px;
  box-shadow: 0 0 0 1px #fff;
  transform: scale(0.8);
}
.srm-approval-reply-record-reply-content {
  background: #EEEEEE;
  border-radius: 4px;
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  font-weight: 400;
  overflow: hidden;
  padding: 4px 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 4px;
  position: relative;
  padding-right: 20px;
}
.srm-approval-reply-record-reply-clear {
  position: absolute;
  right: 4px;
  top: 6px;
  color: #afafaf;
}
.srm-approval-reply-record-noticer {
  position: absolute;
  top: -50px;
  height: 40px;
  line-height: 40px;
  background-color: rgb(255, 255, 255);
  max-width: calc(100% - 36px);
  z-index: 10;
}
.srm-approval-reply-record-noticer /deep/.srm-field-wrapper{
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
}
</style>
<style lang="stylus" scoped>
@media screen and (orientation: landscape) {
  .srm-approval-reply-record {
    >>> .srm-popup-header {
      font-size: 2vw;
      height: 6vw;
    }
    >>> .srm-popup-header .srm-popup-header-close .srm-icon {
      font-size: 2vw !important;
    }
    >>> .srm-popup-header-title {
      font-size: 2vw !important;
      height: 6vw !important;
    }
    >>> .srm-popup-header-close {
      height: 4vw !important;
      width: 4vw !important;
    }
    >>> .srm-field-wrapper-mini {
      font-size: 2vw !important;
    }
    >>> .srm-field-wrapper-mini textarea {
      font-size: 1.5vw !important;
    }
    .srm-approval-reply-record-input >>> .srm-textarea {
      line-height: 3vw !important;
      min-height: 3vw !important;
      padding: 0 1vw;
      max-height: 15vw !important;
    }
    .srm-approval-reply-record-footer {
      padding: 1vw 2vw 3vw;
    }
    .srm-approval-reply-record-content {
      padding: 1vw 2vw 4vw;
    }
    .srm-approval-reply-record-content * {
      font-size: 1.5vw !important;
    }
    .srm-approval-reply-record-time {
      margin: 1vw 0;
    }
    .srm-approval-reply-record-item {
      margin-bottom: 2vw;
    }
    .srm-approval-reply-record-item-title {
      line-height: 2vw;
      margin-bottom: 1vw;
    }
    .srm-approval-reply-record-item-content-main {
      padding: 1vw;
      line-height: 2.2vw;
    }
    .srm-approval-reply-record-item-content-footer {
      >>> .srm-button {
        font-size: 1.5vw;
        line-height: 2vw;
        height: 2vw;
      }
    }
    >>> .srm-icon {
      font-size: 1.5vw !important;
    }
    .srm-approval-reply-record-noticer {
      height: 4vw;
      line-height: 4vw;
      top: -6vw;
      >>> .srm-field-wrapper {
        height: 4vw;
        line-height: 4vw;
        font-size: 1.5vw !important;
      }
    }
    >>> .srm-lov *{
      font-size: 1.5vw !important;
    }
    .srm-approval-reply-record-file {
      >>> .srm-icon {
        font-size: 3.333vw !important;
      }
    }
  }
}
</style>
