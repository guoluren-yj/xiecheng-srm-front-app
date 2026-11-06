<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.back()">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">综合绩效管理审批</div>
      <div v-if="openFlag" slot="right" class="right-button">
        <i @click="showOperationPop"><img class="image-black-default" src="@/assets/Operation_record@3x.png" alt></i>
      </div>
    </hips-nav-bar>
    <!-- 审批/历史 记录弹框 -->
    <OperationApprovalPop
      v-model="operationPopup"
      operator-field-name="assigneeName"
      operation-meaning-field-name="name"
      process-date-field-name="startTime"
      process-remark-field-name="comment"
      :action-data="operationArr"
      :load-refresh="getOperatorType"
      :history-approval="approvalHistory"/>

    <div class="evalution-report-approval-detail">
      <div class="content">
        <div class="head-content">
          <div class="head-text">
            综合绩效管理审批
          </div>
          <div class="head-text">{{ $T("hwfp.commom.model.apply.owner").$D("申请人") }}：{{ taskInfo.assigneeName }}</div>
          <div class="head-text">{{ $T("hwfp.commom.model.apply.time").$D("申请时间") }}：{{ taskInfo.createTime }}</div>
        </div>
        <div class="info-content">
          <ApproveDetailContent :id="comprehensiveArchiveHeaderId"/>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <srm-bottom-handler :btn-arr="openFlag?getBtnArr:[]"/>
    <ToDoOperates
      v-model="operatesPop"
      :type="operateType"
      :task-id="taskId"
      :next-node-approver="nextNodeApprover"
      :comments-required="mCommentsRequired"
      :form-header-data="formHeaderData"
      :task-data="taskInfo"
      back-route-path="EvaluationDocApproveList"/>
  </hips-view>
</template>

<script>
import { Input, NavBar, Popup, View } from "hips";
import { getOperatorTypeApi, } from "../api/index";
import ApproveDetailContent from "../components/ApproveDetailContent";
import ToDoOperates from "@/components/ToDoOperates";
import { getTaskApprovalHistory } from "../../HYPurchasingAgreementApprove/api/index";
import OperationApprovalPop from "../components/OperationApprovalPop";


export default {
  modules: [ "hipspfm.workFlow", "hipspfm.common", "scux.procurementDecisionReview", "hwfp.commom", "scux.myModoList", "spcm.common", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "sinv.common", "scux.evaluation", "scux.supplierEvaluationReport", "hwfp.common", "hzero.common" ],
  name: "EvaluationDocApproveDetail",
  components: {
    OperationApprovalPop,
    ToDoOperates,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    ApproveDetailContent,
  },
  data() {
    return {
      operationArr: [], //操作记录
      operateTypeArr: [],
      moreArr: [],
      operateType: "",
      operatesPop: false,
      operationPopup: false,
      taskId: "",
      processInstance: {},
      commentsRequired: false, // 审批意见是否必输
      mCommentsRequired: false, // 审批意见是否必输
      nextNodeApprover: [], // 是否有指定审批人
      formHeaderData: {}, //表单头数据
      taskInfo: {},
      //操作按钮，返回按钮控制，外部系统直接进入
      openFlag: false,
      approvalHistory: [],
      comprehensiveArchiveHeaderId: null,
    };
  },
  computed: {
    getBtnArr() {
      // eslint-disable-next-line consistent-this
      const self = this;

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.moreArr = [];// 防止脏数据
      let btnArr = [
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
            //审批通过时不必输，意见为空取默认值
            self.mCommentsRequired = false;
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

          btnArr.push(tempObj);
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

          btnArr.push(tempObjA, tempObjB);
        }
      });
      return btnArr;
    }
  },
  async beforeMount() {
    this.comprehensiveArchiveHeaderId = this.$route.query.comprehensiveArchiveHeaderId;
    this.taskId = this.$route.query.taskId;
    await this.getOperatorType();
    await this.fetchApprovalHistory();
    this.openFlag = true;
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
      await getOperatorTypeApi(this.taskId).then((res) => {
        if (!res.id) {
          return;
        }
        this.taskInfo = res;
        this.description = res.description || "";
        this.processInstance = res.processInstance;
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
  }
};
</script>

<style lang="stylus" scoped>
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: var(--color-font-default);
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

.evalution-report-approval-detail {
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

