<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <NavHead
      :title="$T('scux.procurementDecisionReview.view.title.procurementProgrammeReview').$D('采购方案评审表')"
      @goBack="goBack"/>
    <SrmList
      :data-set="dataSet"
      :show-cancel="false"
      :columns="getColumns()"
      :buttons="getButtons()"
      @itemClick="toDetail"/>
  </div>
</template>

<script>
import { JsBridge, DataSet } from "srm-mobile-ui";
import indexDS from "../datasource/indexDS";
import { adoptApi, rejectApi } from "../api/index";

export default {
  modules: [ "hipspfm.workFlow", "scux.procurementDecisionReview", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "hipspfm.common", "sinv.deliveryApproved", "hipspfm.Approved", "spcm.common", "sinv.common", "scux.myModoList" ],
  name: "EvaluationDocApproveList",
  components: {},
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
      chooseParams: [],
      operatesPop: false,
      operateType: "",
      refuseRemark: "审批拒绝"
    };
  },
  mounted() {
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
          fieldCode: "comprehensiveArchiveCode",
          fieldType: "EMPTY",
          render: (val, item, field, record) => {
            return <SrmListHeader onClick={() => this.toDetail(record)}>
              <span style="color: black">{val}</span>
            </SrmListHeader>;
          },
        },
        {
          formRow: 2,
          fieldCode: "archiveDescribe",
          fieldType: "EMPTY",
          render: (val, item, field, record) => {
            return <srm-flex>
              <span
                style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.myModoList.model.archiveDescribe").$D("档案描述")}：</span>
              <span onClick={(e) => {
                e.stopPropagation();
                this.toDetail(record);
              }} style="color: rgb(39, 110, 241);">
                {val}
              </span>
            </srm-flex>;
          }
        },
        {
          formRow: 3,
          fieldCode: "supplierName",
        },
        {
          formRow: 4,
          fieldCode: "totalScore",
        },
        {
          formRow: 5,
          fieldCode: "finalConclusion",
        },
        {
          formRow: 6,
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
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
              </div>
            );
          },
        },
        {
          formRow: 7,
          fieldCode: "remark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span
                style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
      ];
    },
    //跳转评分详情
    toDetail(item) {
      console.log(item);
      this.$router.push({
        name: "EvaluationDocApproveDetail",
        query: {
          taskId: item.get("currentTaskId"),
          processInstanceId: item.get("processInstanceId"),
          comprehensiveArchiveHeaderId: item.get("comprehensiveArchiveHeaderId")
        },
      });
    },
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.common.button.approvalReject").$D("审批拒绝"),
          type: "danger",
          visible: () => {
            return true;
          },
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
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
          visible: () => {
            return true;
          },
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
          callback: (checkedList, data, list) => {
            this.clickAdopt(checkedList, data, list);
          },
        },
      ];
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
        let approvedRemark = "审批通过";

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
      this.chooseParams = checkedList.map((item) => {
        return {
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
        };
      });
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
