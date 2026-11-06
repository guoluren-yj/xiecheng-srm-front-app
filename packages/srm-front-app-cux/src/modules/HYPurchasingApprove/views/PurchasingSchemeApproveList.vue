<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <nav-head
      :title="
        $T(
          'scux.procurementDecisionReview.view.title.procurementProgrammeReview'
        ).$D('采购方案评审表')
      "
      @goBack="goBack"/>
    <srm-list
      :data-set="dataSet"
      :columns="getColumns()"
      :buttons="getButtons()"
      @itemClick="toDetail"/>
    <to-do-operator-top
      v-model="operatesPop"
      :type="operateType"
      :comments-required="mCommentsRequired"
      :list-data="listData"
      :edit-flag="editFlag"
      :other-params="otherParams"
      back-route-path="PurchasingSchemeApproveList" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import ToDoOperatorTop from "@/components/ToDoOperatorTop";
import indexDS from "../datasource/indexDS";
import { adoptApi, rejectApi, fetchApprovedSearch,
  fetchApprovedInDoubt, } from "../api/index";
import { isEmpty } from "@/utils/index";

export default {
  modules: [ "hipspfm.workFlow", "scux.procurementDecisionReview", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "hipspfm.common", "sinv.deliveryApproved", "hipspfm.Approved", "spcm.common", "sinv.common" ],
  name: "PurchasingSchemeApproveList",
  components: {
    ToDoOperatorTop
  },
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
      chooseParams:[],
      operatesPop: false,
      mCommentsRequired: false, // 审批意见是否必输
      operateType:"",
      editFlag:"",
      listData: [],
      otherParams: {},
      reviewQuestionRemark: "",
      placeholder: this.$T("hipspfm.workFlow.model.placeholder.reviewQuestionRemark").$D("请输入流程描述"),
      refuseRemark:this.$T("hipspfm.common.button.approvalReject").$D("审批拒绝")
    };
  },
  mounted() {
    this.dataSet.refresh();
  },
  methods: {
    //退出子应用
    goBack() {
      this.$router.back();
    },
    getColumns() {
      return [
        {
          formRow: 1,
          formCol: 1,
          fieldCode: "schemeReviewNumber",
          fieldType: "EMPTY",
          render: (val, item) =>
            <SrmListHeader>
              <span style="color: #333">{item.schemeReviewNumber}</span>
              <span slot="right" style="color: #333;font-weight: 500;">
                {item.categoryManager}
              </span>
            </SrmListHeader>
          ,
        },
        {
          formRow: 2,
          fieldCode: "materialName",
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex>
            <span on-click={(e) => {
              e.stopPropagation();
              this.toDetail(record);
            }}
            style="flex-shrink: 0; align-self: flex-start">{this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称")}：</span>
            <span on-click={(e) => {
              e.stopPropagation();
              this.toDetail(record);
            }}
            style="color: #276ef1">{val}</span>
          </srm-flex>
        },
        {
          formRow: 3,
          fieldCode: "materialCategory",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialCategory").$D("物资品类")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          formRow: 4,
          fieldCode: "procurementStrategyMeaning",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.procurementStrategyMeaning").$D("采购策略")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          formRow: 5,
          fieldCode: "detailStrategyMeaning",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.detailStrategy").$D("细分策略")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          formRow: 6,
          fieldCode: "purchaseAmount",
          render: (val) => this.$options.filters.thousandBitSeparator(val),
        },
        {
          fieldCode: "applicationUserName",
          fieldName: this.$T("scux.procurementDecisionReview.model.applicationUserName").$D("申请人手机号"),
          formRow: 7,
          render: (val) => {
            const currentVal = val?.split("-");
            return (
              <srm-flex>
                {currentVal && currentVal[1]}
              </srm-flex>
            );
          }
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.coreAttachment").$D("核心附件"),
          fieldCode: "coreAttachmentUuid",
          fieldType: "TEXT",
          formRow: 8,
          render: (val, item) => <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
            e.stopPropagation();
            this.showCoreAttachment(val, item.filedAddress);
          }}>
            <span>{ this.$T("hipspfm.common.button.viewAttachments").$D("查看附件") }</span>
            <span>{ val && item.filedAddress ? "(1)" : "(0)" }</span>
          </div>
        },
        {
          formRow: 9,
          fieldCode: "attachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "scux.purchaseRecordApproval.view.button.uploadview"
                ).$D("附件查看")}
              />
            </div>,
          callBack: () => {},
        },
        {
          formRow: 10,
          fieldCode: "remark",
          fieldType: "EMPTY",
          fieldName: this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明"),
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明")}：</span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        },
      ];
    },
    async showCoreAttachment(uuid, fileAdress) {
      if (!uuid || !fileAdress) {
        return;
      }
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileAdress,
        fileName: uuid,
      });
    },
    //跳转评分详情
    toDetail(data) {
      this.$router.push({ "name": "PurchasingSchemeApproveDetail", query: {
        taskId: data.currentTaskId,
        processInstanceId: data.processInstanceId,
        info: JSON.stringify(data),
      }, });
    },
    getButtons() {
      const BtnArr = [
        {
          text: this.$T("hipspfm.common.button.approvalReject").$D("审批拒绝"),
          type: "danger",
          visible: () => true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList, data, list) => {
            this.$confirm({
              title: this.$T("sinv.deliveryApproved.model.deliveryApproved.approveRemark").$D("审批意见"),
              onOk: (remark, close) => {
                close();
                this.refuseRemark = remark;
                this.clickReject(checkedList, list);
              }
            });
          },
        },
        {
          text: this.$T("hipspfm.common.button.approved").$D("审批通过"),
          fill: true,
          visible: () => true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList, data, list) => {
            this.clickAdopt(checkedList, data, list);
          },
        },
        {
          title: this
            .$T("hipspfm.workFlow.view.button.reviewInDoubt")
            .$D("评审存疑"),
          fill: true,
          disabled: (checkedList) => checkedList.length !== 1,
          callback: (checkedList) => {
            const { historicTaskList, assigneeName, description, businessKey, assignee } = checkedList[0].data || {};
            const approvedBy = [];
            fetchApprovedSearch({ assignee, businessKey }).then((r) => {
              if (r && !r.failed) {
                this.reviewQuestionRemark = r.reviewQuestionRemark;
              }
              this.$dialog({
                title: this.$T("hipspfm.workFlow.view.title.process.approvedBy").$D("审批人"),
                content: <div>
                  {historicTaskList.map(
                    (item, index) =>
                      index < historicTaskList.length - 1 &&
                      <div class="approvedByContent">
                        <SrmCheckbox
                          option={item.assignee}
                          onInput={(val) => {
                            if (val) {
                              approvedBy.push(item.assignee);
                            }
                          }}
                        >{item.assigneeName}-{index}</SrmCheckbox>
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
        {
          text: this.$T("hipspfm.common.button.delegate").$D("转交"),
          fill: true,
          visible: (checkedList) => {
            let operateTypes = [];
            checkedList.forEach(({ data }) => {
              operateTypes.push(data.taskInfo.formData.formProperties.filter((i) => i.id === "APPROVAL_ACTION")[0].enumValues);
            });
            const operateTypeArr = [];
            operateTypes.forEach((env) => {
              operateTypeArr.push(env.some((item) => item.name === "Y" && item.id === "ACTION_DELEGATE") || false);
            });
            const operateTypeArrFlag = !isEmpty(operateTypeArr) ? operateTypeArr.every((item) => item === true) : false;
            return operateTypeArrFlag;
          },
          callback: (checkedList) => {
            let commentsRequired = false;
            checkedList.forEach(({ data }) => {
              commentsRequired = (data.taskInfo.formData.formProperties.filter((item) => item.id === "APPROVAL_NEED_OPINION_FLAG")[0] || {}).name === "Y";
            });
            this.otherParams = { dataSet: this.dataSet };
            this.operateType = "transfer";
            this.operatesPop = true;
            this.listData = checkedList.map((record) => record.data);
            this.mCommentsRequired = commentsRequired;
          },
        },
        {
          text: this.$T("hipspfm.common.button.addSign").$D("加签"),
          fill: true,
          visible: (checkedList) => {
            let operateTypes = [];
            checkedList.forEach(({ data }) => {
              operateTypes.push(data.taskInfo.formData.formProperties.filter((i) => i.id === "APPROVAL_ACTION")[0].enumValues);
            });
            const operateTypeArr = [];
            operateTypes.forEach((env) => {
              operateTypeArr.push(env.some((item) => item.name === "Y" && item.id === "ACTION_ADD_SIGN") || false);
            });
            const operateTypeArrFlag = !isEmpty(operateTypeArr) ? operateTypeArr.every((item) => item === true) : false;
            return operateTypeArrFlag;
          },
          callback: (checkedList) => {
            let commentsRequired = false;
            checkedList.forEach(({ data }) => {
              commentsRequired = (data.taskInfo.formData.formProperties.filter((item) => item.id === "APPROVAL_NEED_OPINION_FLAG")[0] || {}).name === "Y";
            });
            this.otherParams = { dataSet: this.dataSet };
            this.operateType = "signature";
            this.operatesPop = true;
            this.listData = checkedList.map((record) => record.data);
            this.mCommentsRequired = commentsRequired;
          },
        },
        {
          text: this.$T("hipspfm.common.button.approveAndAddSign").$D("同意并加签"),
          fill: true,
          visible: (checkedList) => {
            let operateTypes = [];
            checkedList.forEach(({ data }) => {
              operateTypes.push(data.taskInfo.formData.formProperties.filter((i) => i.id === "APPROVAL_ACTION")[0].enumValues);
            });
            const operateTypeArr = [];
            operateTypes.forEach((env) => {
              operateTypeArr.push(env.some((item) => item.name === "Y" && item.id === "ACTION_ADD_SIGN") || false);
            });
            const operateTypeArrFlag = !isEmpty(operateTypeArr) ? operateTypeArr.every((item) => item === true) : false;
            return operateTypeArrFlag;
          },
          callback: (checkedList) => {
            let commentsRequired = false;
            checkedList.forEach(({ data }) => {
              commentsRequired = (data.taskInfo.formData.formProperties.filter((item) => item.id === "APPROVAL_NEED_OPINION_FLAG")[0] || {}).name === "Y";
            });
            this.otherParams = { dataSet: this.dataSet };
            this.operateType = "approvelSignature";
            this.operatesPop = true;
            this.listData = checkedList.map((record) => record.data);
            this.mCommentsRequired = commentsRequired;
          },
        },
      ];

      return BtnArr;
    },
    clickAdopt(checkedList, list) {
      const that = this;

      this.$dialog({
        content:
          this.$T("hipspfm.Approved.validation.message.pass").$D(
            "是否确认审批通过"
          ) + "？",
        closable: false,
        onOk() {
          that.adoptList(checkedList, list);
        },
      });
    },
    adoptList(checkedList) {
      this.chooseParams = checkedList.map((item) => {
        let approvedRemark = this.$T("hipspfm.common.button.approved").$D("审批通过");

        return {
          action: "complete",
          comment: approvedRemark,
          currentTaskId: item.data.currentTaskId,
          processDefinitionId: item.data.processDefinitionId,
          processInstanceId: item.data.processInstanceId,
          processName: item.data.processName,
          variables: [ {
            name: "approveResult",
            value: "Approved",
          }, {
            name: "comment",
            value: approvedRemark
          } ],
        };
      });
      this.$loading.show();
      adoptApi(this.chooseParams)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.common.view.validation.approvelSuccess"
              ).$D("审批通过成功"),
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
            this.dataSet.refresh();
          }
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    //点击拒绝
    clickReject(checkedList, list) {
      this.rejectList(checkedList, list);
    },
    //确认拒绝
    rejectList(checkedList) {
      this.chooseParams = checkedList.map((item) => ({
        action: "complete",
        comment: this.refuseRemark,
        currentTaskId: item.data.currentTaskId,
        processDefinitionId: item.data.processDefinitionId,
        processInstanceId: item.data.processInstanceId,
        processName: item.data.processName,
        variables: [ {
          name: "approveResult",
          value: "Rejected",
        }, {
          name: "comment",
          value: this.approvedRemark
        } ],
      }));
      this.$loading.show();
      rejectApi(this.chooseParams)
        // eslint-disable-next-line no-unused-vars
        .then((res) => {
          this.$loading.hide();
          if (res && res.failed) {
            this.$notification.open({
              message: res.message,
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
          } else {
            this.$notification.open({
              message: this.$T(
                "hipspfm.common.view.validation.rejectSuccess"
              ).$D("审批拒绝成功"),
              description: "",
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3,
            });
            this.dataSet.refresh();
          }
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .noWrap>div {
  display: flex;
}

>>> .srm-upload {
  width: auto;
}

>>> .srm-list-search-line-cancel {
  display: none !important;
}
</style>
