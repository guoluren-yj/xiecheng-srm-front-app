<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ processName }}</div>
      <div v-if="openFlag" slot="right" class="right-button">
        <i @click="showOperationPop"><img class="image-black-default" src="@/assets/Operation_record@3x.png" alt ></i>
      </div>
    </hips-nav-bar>
    <!-- 审批/历史 记录弹框 -->
    <operation-approval-pop v-model="operationPopup"
                            operator-field-name="assigneeName"
                            operation-meaning-field-name="name"
                            process-date-field-name="startTime"
                            process-remark-field-name="comment"
                            :action-data="operationArr"
                            :load-refresh="getOperatorType"
                            :history-approval="approvalHistory"/>

    <div class="purchase-resolution-approval-detail">
      <div class="content">
        <div class="head-content">
          <div class="head-text">
            {{ processName }}
          </div>
          <div class="head-text">{{ $T("hipspfm.workFlow.model.reqUserName").$D("申请人") }}：{{ taskInfo.assigneeName }}{{ taskInfo.assignee ? `(${taskInfo.assignee})` : "" }}</div>
          <div class="head-text">{{ $T("scux.procurementDecisionReview.model.applyTime").$D("申请时间") }}：{{ taskInfo.createTime }}</div>
        </div>
        <div class="info-content">
          <customize :need-padding="true" :columns="getColumns" :data-source="param" type="list"/>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler :btn-arr="openFlag?getBtnArr:[]" />
    <to-do-operates
      v-model="operatesPop"
      :type="operateType"
      :task-id="param.currentTaskId"
      :next-node-approver="nextNodeApprover"
      :comments-required="mCommentsRequired"
      :form-header-data="formHeaderData"
      :task-data="taskInfo"
      :edit-flag="editFlag"
      back-route-path="Hygy_SuppliersAdmissionApprovalList" />
  </hips-view>
</template>

<script>
import { NavBar, View } from "hips";
import { SrmCheckbox, SrmTextarea } from "srm-mobile-ui";
import { getOperatorTypeApi, fetchApprovedInDoubt, fetchApprovedSearch } from "../api/index";
import ToDoOperates from "@/components/ToDoOperates";
import OperationApprovalPop from "../../HYPurchasingAgreementApprove/components/OperationApprovalPop";
import { getTaskApprovalHistory } from "../../HYPurchasingAgreementApprove/api/index";

export default {
  modules: [ "hipspfm.workFlow", "hipspfm.common", "scux.procurementDecisionReview", "scux.common", "smbl.common", "hwfp.common", "hzero.common" ],
  name: "HygySuppliersAdmissionApprovalDetail",
  components: {
    ToDoOperates,
    OperationApprovalPop,
    [View.name]: View,
    [NavBar.name]: NavBar,
  },
  beforeRouteLeave (to, from, next) {
    if (this.$refs && this.$refs.childComponent && this.$refs.childComponent.beforeRouteLeave) {
      this.$refs.childComponent.beforeRouteLeave(to, from, next);
    } else {
      // eslint-disable-next-line callback-return
      next();
    }
  },
  data() {
    return {
      param: {},
      operationArr: [], //操作记录
      operateTypeArr: [],
      editFlag:"",
      moreArr: [],
      operateType: "",
      operatesPop: false,
      operationPopup: false,
      processName: "",
      processInstance: {},
      commentsRequired: false, // 审批意见是否必输
      mCommentsRequired: false, // 审批意见是否必输
      nextNodeApprover: [], // 是否有指定审批人
      formHeaderData:{}, //表单头数据
      taskInfo: {},
      mountedFlag: false,
      //操作按钮，返回按钮控制，外部系统直接进入
      openFlag:false,
      approvalHistory: [],
      reviewQuestionRemark: "",
      placeholder: this.$T("scux.procurementDecisionReview.model.placeholder.reviewQuestionRemark").$D("请输入流程描述"),
    };
  },
  computed: {
    getColumns() {
      return [ {
        fieldName: this.$T("hipspfm.workFlow.model.reqNum").$D("申请单号"),
        fieldCode: "documentNumber",
        fieldType: "TEXT",
        formRow: 1,
      }, {
        fieldName: this.$T("scux.common.model.supplier.name").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        formRow: 10,
      }, {
        fieldName: this.$T("hipspfm.workFlow.model.reqUserName").$D("申请人"),
        fieldCode: "applicationUserName",
        fieldType: "TEXT",
        formRow: 20,
      }, {
        fieldName: this.$T("smbl.common.model.common.currentStage").$D("当前阶段"),
        fieldCode: "fromStageDescription",
        fieldType: "TEXT",
        formRow: 30,
      }, {
        fieldName: this.$T("smbl.common.model.targetStage").$D("目标阶段"),
        fieldCode: "toStageDescription",
        fieldType: "TEXT",
        formRow: 40,
      }, {
        fieldName: this.$T("scux.common.model.common.businessNature").$D("企业性质"),
        fieldCode: "attributeVarchar10",
        fieldType: "EMPTY",
        formRow: 50,
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.common.model.common.businessNature").$D("企业性质")}：</span>
          <span style="word-break:break-all;">{val}</span>
        </srm-flex>
      }, {
        fieldName: this.$T("scux.common.model.common.mainBusiness").$D("主营业务"),
        fieldCode: "attributeVarchar11",
        fieldType: "EMPTY",
        formRow: 60,
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.common.model.common.mainBusiness").$D("主营业务")}：</span>
          <span style="word-break:break-all;">{val}</span>
        </srm-flex>,
      }, {
        fieldName: this.$T("scux.common.model.common.preReviewConclusion").$D("预评审结论"),
        fieldCode: "attributeLongtext2",
        fieldType: "TEXT",
        formRow: 65,
      }, {
        fieldName: this.$T("scux.common.view.message.qualification").$D("资质审核"),
        fieldCode: "investgNumber",
        fieldType: "TEXT",
        formRow: 80,
      }, {
        fieldName: this.$T("scux.common.view.message.siteVisit").$D("现场审核"),
        fieldCode: "evalNum",
        fieldType: "TEXT",
        formRow: 90,
      }, {
        fieldName: this.$T("scux.common.view.message.sampleDelivery").$D("送样审核"),
        fieldCode: "reqNum",
        fieldType: "TEXT",
        formRow: 100,
      }, {
        fieldName: this.$T("smbl.common.view.description").$D("说明"),
        fieldCode: "remark",
        fieldType: "EMPTY",
        formRow: 110,
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("smbl.common.view.description").$D("说明")}：</span>
          <span style="word-break:break-all;">{val}</span>
        </srm-flex>
      }, {
        fieldName: this.$T("smbl.common.view.attachment").$D("附件"),
        fieldCode: "degradeAttachmentLines",
        fieldType: "TEXT",
        formRow: 120,
        render: (val) => {
          console.log(val);
          let newVal = val?.map((item) => ({
            ...item,
            creationDate: item.creationDate || item.uploadDate,
            fileUrl: item.fileUrl || item.attachmentUrl,
            bucketName: "private-bucket",
          })) || [];
          return <srm-upload attachmentUuid={newVal} show-icon={false} color="var(--color-other-default-b)" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}/>;
        }
      }, ];
    },
    getBtnArr() {
      // eslint-disable-next-line consistent-this
      const self = this;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.moreArr = [];// 防止脏数据
      let BtnArr = [
        {
          title: self
            .$T("hipspfm.workFlow.view.button.approvalReject")
            .$D("审批拒绝"),
          color: "var(--color-other-default)",
          type: "danger",
          handler: () => {
            this.operateType = "refuse";
            this.operatesPop = true;
            self.mCommentsRequired = false;
          }
        },
        {
          title: self
            .$T("hipspfm.workFlow.view.button.approvalPass")
            .$D("审批通过"),
          color: "var(--color-other-default-b)",
          handler: () => {
            this.operateType = "approvel";
            this.operatesPop = true;
            self.mCommentsRequired = false;
          }
        },
        {
          title: self
            .$T("hipspfm.workFlow.view.button.reviewInDoubt")
            .$D("评审存疑"),
          color: "var(--color-other-default-b)",
          handler: async () => {
            const { historicTaskList = [], assigneeName, description, businessKey, assignee } = this.taskInfo;
            const approvedBy = [];
            fetchApprovedSearch({ assignee, businessKey }).then((r) => {
              if (r && !r.failed) {
                this.reviewQuestionRemark = r.reviewQuestionRemark;
              }
              this.$dialog({
                title: self.$T("hipspfm.workFlow.view.title.process.approvedBy").$D("审批人"),
                content: <div>
                  {historicTaskList.map(
                    (item, index) =>
                      index < historicTaskList.length - 1 &&
                      <div class="approvedByContent">
                        <SrmCheckbox
                          value={this.remakFlag}
                          option={item.assignee}
                          onInput={(val) => {
                            if (val) {
                              approvedBy.push(item.assignee);
                            }
                          }}
                        >{item.assigneeName}</SrmCheckbox>
                      </div>
                  )}
                  <SrmTextarea value={this.reviewQuestionRemark} bordered={true} placeholder={this.placeholder} onInputChange={(val) => { this.reviewQuestionRemark = val; }} />
                </div>,
                onOk: () => {
                  const response = fetchApprovedInDoubt({
                    assigneeName,
                    description,
                    assignee,
                    businessKey,
                    assigneeList: approvedBy,
                    reviewQuestionRemark: this.reviewQuestionRemark,
                  });
                  response.then((res) => {
                    if (res) {
                      if (res.failed) {
                        this.$notification.open({
                          message: res.message,
                          class: "notification"
                        });
                      } else {
                        this.$notification.open({
                          message: this.$T("hipspfm.workFlow.view.message.sentSuccess").$D("发送成功!"),
                          class: "notification"
                        });
                      }
                    }
                  });
                },
              });
            });
          }
        },
      ];

      this.operateTypeArr.map((item) => {
        if (item === "ACTION_DELEGATE") {
          let tempObj = {
            title: self.$T("hipspfm.common.action.delegate").$D("转交"),
            handler: () => {
              self.$hips.actionsheet.hide();
              self.operateType = "transfer";
              self.operatesPop = true;
              //转交等操作，根据接口返回值控制是否必输
              self.mCommentsRequired = self.commentsRequired;
            }
          };

          BtnArr.push(tempObj);
        }
        if (item === "ACTION_ADD_SIGN") {
          let tempObjA = {
            title: self.$T("hipspfm.common.action.addSign").$D("加签"),
            handler: () => {
              self.$hips.actionsheet.hide();
              self.operateType = "signature";
              self.operatesPop = true;
              //转交等操作，根据接口返回值控制是否必输
              self.mCommentsRequired = self.commentsRequired;
            }
          };
          let tempObjB = {
            title: self.$T("hipspfm.common.action.approveAndAddSign").$D("同意并加签"),
            handler: () => {
              self.$hips.actionsheet.hide();
              self.operateType = "approvelSignature";
              self.operatesPop = true;
              //转交等操作，根据接口返回值控制是否必输
              self.mCommentsRequired = self.commentsRequired;
            }
          };

          BtnArr.push(tempObjA, tempObjB);
        }
      });
      return BtnArr;
    }
  },
  async beforeMount() {
    this.param = JSON.parse(this.$route.query.info);
    console.log('111111111', this.$route.query.info, this.param);
    this.processName = this.param.processName;
    await this.getOperatorType();
    await this.fetchApprovalHistory();
    this.openFlag = true;
    this.mountedFlag = true;
  },
  async mounted() {

  },
  methods: {
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查询历史记录
    async fetchApprovalHistory() {
      try {
        await getTaskApprovalHistory(this.taskInfo.businessKey || this.processInstance.businessKey).then((res) => {
          if (res && res.length) {
            this.approvalHistory = res;
          }
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    //获取审批操作
    async getOperatorType() {
      await getOperatorTypeApi(this.param.currentTaskId).then((res) => {
        if (!res.id) {
          return;
        }
        this.taskInfo = res;
        this.processInstance = res.processInstance;
        this.processName = this.processInstance.processDefinitionName;
        const operateType = res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_ACTION"
        )[0].enumValues;

        this.operateTypeArr = operateType.map((item) => {
          if (item.name === "Y") {
            return item.id;
          }
        });
        this.operationArr = res.historicTaskList;
        this.commentsRequired = (res.formData.formProperties.filter(
          (item) => item.id === "APPROVAL_NEED_OPINION_FLAG"
        )[0] || {}).name === "Y";
        this.nextNodeApprover = res.nextNodeApprover || [];
      });
    },
    // 获取单据头数据
    GetformHeaderData(val) {
      this.formHeaderData = val;
    },
    // 更多操作
    openActionSheet() {
      // eslint-disable-next-line consistent-this
      const self = this;

      this.$hips.actionsheet.show({
        theme: "android",
        title: "",
        subTitle: "",
        buttons: this.moreArr,
        cancel: {
          text: self.$T("hipspfm.common.button.cancle").$D("取消"),
          handler: () => {
            // console.log('Cancel')
          }
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: bold;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.purchase-resolution-approval-detail {
  width: 100%;
  height: calc(100vh - 72px - 44px);
  height: calc(100vh - 72px - 44px - constant(safe-area-inset-bottom));
  height: calc(100vh - 72px - 44px - env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
}
.nav-title {
  flex-shrink: 0;
}
.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .head-content {
    flex-shrink: 0;
    width: 100%;
    border-bottom: 0.7px solid var(--color-font-default);
    padding: 12px 0;
    background-color: var(--color-other-default-b);
    .head-text {
      font-size: 14px;
      color: white;
      padding: 8px 15px 0 15px;
    }
  }
  .info-content {
    flex-grow: 1;
    width: 100%;
    overflow: scroll;
  }
}

</style>
