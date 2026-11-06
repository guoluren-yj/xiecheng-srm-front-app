<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <nav-head
      :title="
        $T(
          'small.mallProtocolManagement.model.purchaseAgreement'
        ).$D('采购协议')
      "
      @goBack="goBack"/>
    <srm-list
      :data-set="dataSet"
      :columns="getColumns()"
      :buttons="getButtons()"
      @itemClick="toDetail"/>
    <srm-popup :visible.sync="visible" :title="$T(
      'small.mallProtocolManagement.model.frameworkContract'
    ).$D('框架合同')" rounded>
      <srm-list
        :data-set="frameworkContractDs"
        :columns="getContractColumns()"/>
    </srm-popup>
    <to-do-operator-top
      v-model="operatesPop"
      :type="operateType"
      :comments-required="mCommentsRequired"
      :list-data="listData"
      :edit-flag="editFlag"
      :other-params="otherParams"
      back-route-path="PurchasingAgreementApproveList" />
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import indexDS from "../datasource/indexDS";
import { frameworkContractDs } from "../datasource/contractDs";
import { adoptApi, rejectApi, fetchApprovedSearch,
  fetchApprovedInDoubt, } from "../api/index";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import ToDoOperatorTop from "@/components/ToDoOperatorTop";
import { isEmpty } from "@/utils/index";

export default {
  modules: [ "hipspfm.workFlow", "sprm.common", "scux.analysisConfirm", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "smpc.common", "hipspfm.common", "sinv.deliveryApproved", "hipspfm.Approved", "small.mallProtocolManagement", "smbl.common", "scux.soQuery", "ssta.costSheet", "scux.procurementDecisionReview", "scux.bidEvaluationReport", "spcm.common" ],
  name: "PurchasingAgreementApproveList",
  components: {
    ToDoOperatorTop,
  },
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
      frameworkContractDs : new DataSet(frameworkContractDs(this)),
      chooseParams:[],
      approvedRemark:this.$T("hipspfm.workFlow.view.button.approvalReject").$D("审批拒绝"),
      visible: false,
      operatesPop: false,
      mCommentsRequired: false, // 审批意见是否必输
      operateType:"",
      editFlag:"",
      listData: [],
      otherParams: {},
      reviewQuestionRemark: "",
      placeholder: this.$T("hipspfm.workFlow.model.placeholder.reviewQuestionRemark").$D("请输入流程描述"),
    };
  },
  methods: {
    //退出子应用
    goBack() {
      this.$router.back();
    },
    getContractColumns() {
      return [
        {
          fieldCode: "pcName",
        },
        {
          fieldCode: "pcNum",
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "pcNum",
          fieldType: "EMPTY",
          render: (val) =>
            // {this.$T("sprm.common.model.common.contractName").$D("协议名称")}：
            <SrmListHeader>
              <span style="font-weight: bold; color: #333333;">{val}</span>
            </SrmListHeader>
        },
        {
          fieldCode: "pcName",
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex>
            <span on-click={(e) => {
              e.stopPropagation();
              this.toDetail(record);
            }}
            style="flex-shrink: 0; align-self: flex-start;">{this.$T("sprm.common.model.common.contractName").$D("协议名称")}：</span>
            <span on-click={(e) => {
              e.stopPropagation();
              this.toDetail(record);
            }}
            style={{ color: record.supplementFlag || record.mainPcNum ? "red" : "#276ef1" }}>{val}</span>
          </srm-flex>
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "productName",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.analysisConfirm.model.brandName").$D("品名")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          fieldCode: "contractAmount",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.thousandBitSeparator(val)
          ,
        },
        {
          fieldCode: "applicationUserName",
          fieldName: this.$T("scux.analysisConfirm.model.applicationUserName").$D("申请人手机号"),
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
          fieldCode: "currencyDescription",
        },
        {
          fieldCode:"electricalSignatureAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={
                  this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )
                }
                desc-title={
                  this.$T("scux.purchaseRecordApproval.view.button.uploadview").$D("附件查看")
                }
              />
            </div>,
          callBack: () => {
          },
        },
        {
          fieldCode:"contractFileUrl",
          render: (val, item) => <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
            e.stopPropagation();
            this.showContractAttachment(val, item.contractFileUrl);
          }}>
            <span>{ this.$T("scux.purchaseRecordApproval.button.viewAttachments").$D("附件查看") }</span>
            <span>{ val && item.contractFileUrl ? "(1)" : "(0)" }</span>
          </div>
        },
        {
          fieldCode:"purchaserAttachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={
                  this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                    "相关附件"
                  )
                }
                desc-title={
                  this.$T("scux.purchaseRecordApproval.view.button.uploadview").$D("附件查看")
                }
              />
            </div>,
          callBack: () => {
          },
        },
        {
          fieldCode: "schemeIdMeaning",
          render: (val, item) => <span style="color:#276EF1" on-click={(e) => {
            e.stopPropagation();
            this.toSchemeReviewDetail(item);
          }}>{val}</span>
        },
        {
          fieldCode: "decisionIdMeaning",
          render: (val, item) => <span style="color:#276EF1" on-click={(e) => {
            e.stopPropagation();
            this.toDecisionDetail(item);
          }}>{val}</span>
        },
        {
          fieldCode: "evaluationIdMeaning",
          render: (val, item) => <span style="color:#276EF1" on-click={(e) => {
            e.stopPropagation();
            this.toBidReportDetail(item);
          }}>{val}</span>
        },
        {
          fieldCode: "frameworkContractNumber",
          render: (val) => <span on-click={(e) => {
            e.stopPropagation();
            this.frameworkContractDs.reset();
            this.frameworkContractDs.setQueryParameter({ contractIds: val });
            this.frameworkContractDs.query();
            this.visible = true;
          }}>{val}</span>
        },
        {
          fieldCode:"mainPcNum",
        },
        {
          fieldCode:"attributeVarchar21",
          render: (val) => <span>{val === "Y" ? this.$T("smpc.common.excel.yes").$D("是") : this.$T("smpc.common.excel.no").$D("否")}</span>
        },
        {
          fieldCode: "remark",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("smpc.common.excel.remark").$D("备注")}：</span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        }
      ];
    },
    //跳转评分详情
    toDetail(data) {
      this.$router.push({ "name": "PurchasingAgreementApproveDetail", query: {
        taskId: data.currentTaskId,
        processInstanceId: data.processInstanceId,
        info: JSON.stringify(data),
      }, });
    },
    toSchemeReviewDetail(item) {
      this.$router.push({ "name": "HY_ProcurementSchemeDetail", query: { schemeReviewId: item.schemeId } });
    },
    toDecisionDetail(item) {
      this.$router.push({ "name": "HY_ProcurementDecisionDetail", query: { decisionReviewId: item.decisionId } });
    },
    toBidReportDetail(item) {
      this.$router.push({ "name": "HY_ProcurementEvaluationReportDetail", query: { evaluationReviewId: item.evaluationId } });
    },
    getButtons() {
      return [
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
            this.clickAdopt(checkedList, list);
          },
        }, {
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
        },
      ];
    },
    //点击通过
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
        let approvedRemark = this.$T("hipspfm.workFlow.view.button.approvalPass").$D("审批通过");

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
        comment: this.approvedRemark,
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
    // 显示用章文本附件
    async showContractAttachment(uuid, fileAdress) {
      if (!uuid || !fileAdress) {
        return;
      }
      const that = this;
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileAdress,
        fileName: uuid,
        downloadUrl:that.buildImgUrl(fileAdress, "private-bucket"),
        showDownbtn:true,
        vm:that
      });
    }
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
