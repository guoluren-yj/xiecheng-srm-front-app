<template>
  <div class="purchase-resolution-approval">
    <nav-head :title="$T('scux.procurementDecisionReview.view.title.procurementDecisionReview').$D('采购决议')"/>
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
      back-route-path="HygyPurchaseResolutionApproval" />
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import { DataSet } from "srm-mobile-ui";
import ToDoOperatorTop from "@/components/ToDoOperatorTop";
import evaluationReportsDataSource from "../dataSource/index";
import {
  sendProcureSchemeApproval,
  fetchApprovedSearch,
  fetchApprovedInDoubt,
} from "../api/index";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import { isEmpty } from "@/utils/index";
export default {
  modules: [ "hipspfm.workFlow", "scux.procurementDecisionReview", "hipspfm.common", "sinv.deliveryApproved", "hipspfm.Approved", ],
  name: "HygyPurchaseResolutionApproval",
  components: {
    NavHead,
    ToDoOperatorTop,
  },
  data() {
    return {
      dataSet: new DataSet(evaluationReportsDataSource()),
      schemeReviewId: "",
      isCgfaShowFlag: false,
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
        fieldName: this.$T("scux.procurementDecisionReview.model.categoryManager").$D("品类经理"),
        fieldCode: "decisionReviewNumber",
        fieldType: "EMPTY",
        formRow: 10,
        render: (val, item) => <SrmListHeader>
          <span>{val}</span>
          <span slot="right" style="font-weight: bold; color: #333333;">{this.$T("scux.procurementDecisionReview.model.categoryManager").$D("品类经理") + "：" + item.categoryManager}</span>
        </SrmListHeader>
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称"),
        fieldCode: "materialName",
        fieldType: "EMPTY",
        formRow: 20,
        render: (val, record) => <srm-flex>
          <span on-click={(e) => {
            e.stopPropagation();
            this.onItemClick(record);
          }}
          style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称")}：</span>
          <span on-click={(e) => {
            e.stopPropagation();
            this.onItemClick(record);
          }}
          style="color: #276ef1">{val}</span>
        </srm-flex>,
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.procurementStrategyMeaning").$D("采购策略"),
        fieldCode: "procurementStrategyMeaning",
        fieldType: "TEXT",
        formRow: 30,
      }, {
        formRow: 31,
        fieldCode: "detailStrategyMeaning",
        fieldType: "EMPTY",
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.detailStrategy").$D("细分策略")}：</span>
          <span>{val}</span>
        </srm-flex>
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.procurementAmount").$D("采购金额(元)"),
        fieldCode: "purchaseAmount",
        fieldType: "TEXT",
        formRow: 35,
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.applicationUserName").$D("申请人手机号"),
        fieldCode: "applicationUserName",
        fieldType: "TEXT",
        formRow: 36,
        render: (val) => {
          const currentVal = val?.split("-");
          return (
            <srm-flex>
              {currentVal && currentVal[1]}
            </srm-flex>
          );
        }
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.schemeReviewNumber").$D("采购方案评审单号"),
        fieldCode: "schemeReviewNumber",
        fieldType: "TEXT",
        formRow: 40,
        render: (val, item) => <div class="click-code" on-click={(e) => {
          e.stopPropagation();
          this.toPurchaseDetail(item);
        }}>{val}</div>
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.coreAttachment").$D("核心附件"),
        fieldCode: "coreAttachmentUuid",
        fieldType: "TEXT",
        formRow: 50,
        render: (val, item) => <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
          e.stopPropagation();
          this.showCoreAttachment(val, item.filedAddress);
        }}>
          <span>{ this.$T("hipspfm.common.button.viewAttachments").$D("查看附件") }</span>
          <span>{ val && item.filedAddress ? "(1)" : "(0)" }</span>
        </div>
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.attachmentInfo").$D("附件信息"),
        fieldCode: "attachmentUuid",
        fieldType: "TEXT",
        formRow: 60,
        render: (val) => <srm-upload attachmentUuid={val} show-icon={false} color="var(--color-other-default-b)" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}/>
      }, {
        fieldName: this.$T("scux.procurementDecisionReview.model.ProcessAddedSupplierDescription").$D("过程新增供应商说明"),
        fieldCode: "newSupplierIllustrate",
        fieldType: "EMPTY",
        formRow: 70,
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.ProcessAddedSupplierDescription").$D("过程新增供应商说明")}：</span>
          {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
        </srm-flex>
      },
      {
        fieldName: this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明"),
        fieldCode: "remark",
        fieldType: "EMPTY",
        formRow: 80,
        render: (val) => <srm-flex>
          <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明")}：</span>
          {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
        </srm-flex>
      },
      {
        fieldCode: "bidding",
        fieldType: "EMPTY",
        formRow: 90,
        render: (val, record) =>
          <srm-flex>
            <table>
              <tr>
                <th>{this.$T("scux.procurementDecisionReview.model.winningSupplier").$D("中标供应商")}</th>
                <th>{this.$T("scux.procurementDecisionReview.model.bidPrice").$D("中标金额")}</th>
              </tr>
              {
                !record.hygyWSupplierDTOList &&
                <tr>
                  <td colspan="2">{this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据")}</td>
                </tr>
              }
              {
                record.hygyWSupplierDTOList && record.hygyWSupplierDTOList.map((item) => <tr>
                  <td>{item.supplierCompanyName}</td>
                  <td>{item.totalPriceS}</td>
                </tr>)
              }
            </table>
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
              let approvedRemark = this.$T("scux.procurementDecisionReview.model.batchApprove").$D("批量同意");
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
    onItemClick(data) {
      this.$router.push({ "name": "Hygy_PurchaseResolutionApprovalDetail", query: {
        taskId: data.currentTaskId,
        processInstanceId: data.processInstanceId,
        decisionReviewId: data.decisionReviewId,
        processName: data.processName,
        applicationUserName: data.applicationUserName,
        applicationTime: data.applicationTime,
      }, });
    },
    toPurchaseDetail(item) {
      this.$router.push({ "name": "Hygy_ProcurementPlanDetail", query: { schemeReviewId: item.schemeReviewId } });
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
    }
  },
};
</script>

<style lang="stylus" scoped>
.purchase-resolution-approval {
  width: 100%;
  height: 100vh;
  .click-code {
    color: var(--color-other-default-b);
    font-size: 14px;
    font-weight: bold;
  }
}

>>> .srm-list-search-line-cancel {
  display: none !important;
}
table{
  width:100%;
}
table,table tr th, table tr td {
  border:1px solid #1f1f1f;
  text-align: center;
  }
</style>