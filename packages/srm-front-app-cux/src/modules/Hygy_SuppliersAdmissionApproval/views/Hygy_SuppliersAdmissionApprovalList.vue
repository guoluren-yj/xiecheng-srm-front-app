<template>
  <div class="supplier-warehouse-approval">
    <nav-head :title="$T('smbl.common.view.title.supplierWarehouse').$D('供应商准入申请单')"/>
    <srm-list
      :data-set="dataSet"
      :columns="getColumns"
      :buttons="getButtons"
      @itemClick="onItemClick"/>
    <to-do-operator-top
      v-model="operatesPop"
      :type="operateType"
      :comments-required="mCommentsRequired"
      :list-data="listData"
      :edit-flag="editFlag"
      :other-params="otherParams"
      back-route-path="HygySuppliersAdmissionApprovalList" />
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import { DataSet } from "srm-mobile-ui";
import ToDoOperatorTop from "@/components/ToDoOperatorTop";
import { isEmpty } from "@/utils/index";
import suppliersWarehouseDataSource from "../dataSource/index";
import {
  sendProcureSchemeApproval,
  fetchApprovedSearch,
  fetchApprovedInDoubt,
} from "../api/index";
export default {
  modules: [ "scux.procurementDecisionReview", "hipspfm.common", "sinv.deliveryApproved", "hipspfm.Approved", "hipspfm.workFlow", "scux.common", "smbl.common" ],
  name: "HygySuppliersAdmissionApprovalList",
  components: {
    NavHead,
    ToDoOperatorTop,
  },
  data() {
    const { name } = this.$route || {};
    const nameFlag = name === "Hygy_SuppliersAdmissionApprovalList";
    return {
      dataSet: new DataSet(suppliersWarehouseDataSource(nameFlag)),
      schemeReviewId: "",
      isCgfaShowFlag: false,
      nameFlag,
      operatesPop: false,
      mCommentsRequired: false, // 审批意见是否必输
      operateType:"",
      editFlag:"",
      listData: [],
      otherParams: {},
      reviewQuestionRemark: "",
      placeholder: this.$T("scux.procurementDecisionReview.model.placeholder.reviewQuestionRemark").$D("请输入流程描述"),
    };
  },
  computed: {
    getColumns() {
      return [ {
        fieldName: this.$T("scux.common.model.supplier.name").$D("供应商名称"),
        fieldCode: "supplierCompanyName",
        fieldType: "EMPTY",
        formRow: 10,
        render: (val, item) => <SrmListHeader>
          <span style="color: var(--color-other-default-b);" onClick={(e) => {
            e.stopPropagation();
            this.gotoDetail(item);
          }}>{val}</span>
        </SrmListHeader>
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
      },
      this.nameFlag && {
        fieldName: this.$T("scux.common.model.common.preReviewConclusion").$D("预评审结论"),
        fieldCode: "attributeLongtext2",
        fieldType: "TEXT",
        formRow: 65,
      },
      !this.nameFlag && {
        fieldName: this.$T("scux.common.model.common.attributeDatetime10").$D("临时有效期至"),
        fieldCode: "attributeDatetime10",
        fieldType: "TEXT",
        formRow: 65,
      }, !this.nameFlag && {
        fieldName: this.$T("scux.common.model.common.attributeVarchar13").$D("审批路径"),
        fieldCode: "attributeVarchar13",
        fieldType: "TEXT",
        formRow: 66,
      }, !this.nameFlag && {
        fieldName: this.$T("scux.common.model.common.attributeDecimal10").$D("临时控制限额(元)"),
        fieldCode: "attributeDecimal10",
        fieldType: "TEXT",
        formRow: 67,
      }, {
        fieldName: this.$T("scux.common.view.message.qualification").$D("资质审核"),
        fieldCode: "investgNumber",
        fieldType: "TEXT",
        formRow: 70,
      }, {
        fieldName: this.$T("scux.common.view.message.siteVisit").$D("现场审核"),
        fieldCode: "evalNum",
        fieldType: "TEXT",
        formRow: 80,
      }, {
        fieldName: this.$T("scux.common.view.message.sampleDelivery").$D("送样审核"),
        fieldCode: "reqNum",
        fieldType: "TEXT",
        formRow: 90,
      }, {
        fieldName: this.$T("smbl.common.view.attachment").$D("附件"),
        fieldCode: "degradeAttachmentLines",
        fieldType: "TEXT",
        formRow: 100,
        render: (val) => {
          let newVal = val.map((item) => ({
            ...item,
            creationDate: item.creationDate || item.uploadDate,
            fileUrl: item.fileUrl || item.attachmentUrl,
            bucketName: "private-bucket",
          }));
          return <srm-upload attachmentUuid={newVal} show-icon={false} color="var(--color-other-default-b)" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}/>;
        }
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
        fieldName: this.$T("smbl.common.view.ministerApprovalcomments").$D("部长审批意见"),
        fieldCode: "attributeLongtext1",
        fieldType: "EMPTY",
        formRow: 120,
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("smbl.common.view.ministerApprovalcomments").$D("部长审批意见")}：</span>
          <span style="word-break:break-all;">{val}</span>
        </srm-flex>
      }, ];
    },
    getButtons() {
      return [ {
        text: this.$T("scux.procurementDecisionReview.view.button.approvalReject").$D("审批拒绝"),
        fill: false,
        type: "danger",
        visible: () => true,
        disabled: (checkedList) => checkedList.length === 0,
        callback: (checkedList) => {
          this.$confirm({
            title: this.$T("sinv.deliveryApproved.model.deliveryApproved.approveRemark").$D("审批意见"),
            onOk: (remark, close) => {
              close();
              let approvedRemark = remark;
              let approvalList = checkedList.map((item) => ({
                action: "complete",
                comment: approvedRemark,
                currentTaskId: item.data.currentTaskId,
                formKey: item.data.formKey,
                processDefinitionId: item.data.processDefinitionId,
                processInstanceId: item.data.processInstanceId,
                processName: item.data.processName,
                variables: [ {
                  name: "approveResult",
                  value: "Rejected",
                }, {
                  name: "comment",
                  value: approvedRemark
                } ],
              }));
              this.$loading.show();
              sendProcureSchemeApproval(approvalList).then((res) => {
                this.$loading.hide();
                if (!(res && res.failed)) {
                  this.$notification.open({
                    message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D("审批拒绝成功"),
                    description: "",
                    class: "notification",
                    duration: 3
                  });
                  this.dataSet.refresh();
                }
              }).finally(() => {
                this.$loading.hide();
              });
            }
          });
        },
      }, {
        text: this.$T("scux.procurementDecisionReview.view.button.approvalAgree").$D("审批通过"),
        fill: false,
        visible: () => true,
        disabled: (checkedList) => checkedList.length === 0,
        callback: (checkedList) => {
          this.$dialog({
            content:
              this.$T("hipspfm.Approved.validation.message.pass").$D(
                "是否确认审批通过"
              ) + "？",
            closable: false,
            onOk: () => {
              let approvedRemark = this.$T("hipspfm.Approved.validation.message.batch.approval").$D(
                "批量同意"
              );
              let approvalList = checkedList.map((item) => ({
                action: "complete",
                comment: approvedRemark,
                currentTaskId: item.data.currentTaskId,
                formKey: item.data.formKey,
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
              }));
              this.$loading.show();
              sendProcureSchemeApproval(approvalList).then((res) => {
                this.$loading.hide();
                if (!(res && res.failed)) {
                  this.$notification.open({
                    message: this.$T("hipspfm.common.view.validation.approvelSuccess").$D("审批通过成功"),
                    description: "",
                    class: "notification",
                    duration: 3
                  });
                  this.dataSet.refresh();
                }
              }).finally(() => {
                this.$loading.hide();
              });
            },
          });
        },
      }, {
        title: this
          .$T("scux.procurementDecisionReview.view.button.reviewInDoubt")
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
      }, {
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
      }, ];
    },
  },
  mounted() {

  },
  methods: {
    onItemClick(item) {
      this.gotoDetail(item.data);
    },
    gotoDetail(item) {
      this.$router.push({ "name": "Hygy_SuppliersAdmissionApprovalDetail", query: {
        info: JSON.stringify(item),
      }, });
    },
  },
};
</script>

<style lang="stylus" scoped>
.supplier-warehouse-approval {
  width: 100%;
  height: 100vh;
}
// 防止最后一行被按钮遮挡无法展示完整
>>> .srm-check-box-group {
  padding-bottom: 60px;
}
</style>