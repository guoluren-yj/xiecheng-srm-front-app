<template>
  <div style="height: 100vh">
    <!-- 导航 -->
    <NavHead
      :title="
        $T(
          'scux.orderPublish.view.title.orderPublishApproval'
        ).$D('订单发布审批')
      "
      @goBack="goBack"/>
    <SrmList
      :data-set="dataSet"
      :columns="getColumns()"
      :buttons="getButtons()"/>
  </div>
</template>

<script>
import { JsBridge, DataSet } from "srm-mobile-ui";
import indexDS from "../datasource/indexDS";
import { adoptApi, rejectApi } from "../api/index";
export default {
  modules: [ "sinv.common","hipspfm.common","sinv.deliveryApproved","hipspfm.Approved","scux.orderPublish","scux.orderPublish" ],
  name: "Hygy_OrderPublishApprovalList",
  components: {
  },
  data() {
    return {
      dataSource: indexDS(this),
      dataSet: new DataSet(indexDS(this)),
      chooseParams:[],
      operatesPop: false,
      operateType:"",
      refuseRemark:"审批拒绝"
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
          fieldCode: "poNum",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val) => {
            return (
              <SrmListHeader>
                <span>{val}</span>
              </SrmListHeader>
            );
          },
        },
        {
          fieldCode: "companyName",
          formRow:10,
          render: (val,record) => {
            return (
              <span style="color:#276EF1" onClick={()=>this.toDetail(record)}>{val}</span>
            );
          },
        },
        {
          fieldName: "供应商名称",
          fieldCode: "supplierName",
          formRow:20
        },
        {
          fieldName: "申请人",
          fieldCode: "applicationUserName",
          formRow:30
        },
        {
          fieldName: "订单类型",
          fieldCode: "poTypeDesc",
          formRow:40
        },
        {
          fieldName: "含税金额",
          fieldCode: "taxIncludeAmount",
          render: (val) => {
            return this.$options.filters.thousandBitSeparator(val);
          },
          formRow:50
        },
        {
          fieldName: "不含税金额",
          fieldCode:"amount",
          render: (val) => {
            return this.$options.filters.thousandBitSeparator(val);
          },
          formRow:60
        },
        {
          fieldName: "币种",
          fieldCode: "currencyCode",
          formRow:70
        },
        {
          fieldName: "总数量",
          fieldCode: "quantityTotal",
          formRow:80
        },
        {
          fieldName: "付款条件",
          fieldCode: "termsName",
          formRow:90
        },
        {
          fieldName: "月结账期（天）",
          fieldCode: "attributeVarchar10",
          formRow:100
        },
        {
          fieldName: "付款方式",
          fieldCode: "attributeVarchar11Meaning",
          formRow:110
        },
        {
          fieldName: "订单摘要",
          fieldCode: "remark",
          fieldType: "EMPTY",
          formRow:120,
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.orderPublish.model.orderSummary").$D("订单摘要")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldName:"内部附件",
          formRow:130,
          fieldCode: "purchaserInnerAttachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("scux.orderPublish.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderPublish.view.button.viewAttachmentUuid"
                  ).$D("附件查看")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
        {
          fieldName:"外部附件",
          formRow:140,
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("scux.orderPublish.model.annexUuid").$D(
                    "相关附件"
                  )}
                  desc-title={this.$T(
                    "scux.orderPublish.view.button.viewAttachmentUuid"
                  ).$D("附件查看")}
                />
              </div>
            );
          },
          callBack: () => {},
        },
      ];
    },
    //跳转评分详情
    toDetail(item) {
      this.$router.push({ "name": "Hygy_OrderPublishApprovalDetail", query: {
        taskId: item.currentTaskId,
        processInstanceId: item.processInstanceId,
        info: JSON.stringify(item),
      }, });
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
            this.clickAdopt(checkedList, data,list);
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
>>> .srm-list-search-line-cancel{
  display:none !important;
}
</style>
