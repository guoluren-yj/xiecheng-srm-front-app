<template>
  <div>
    <div style="height: 100vh">
      <nav-head :title="$T('sslm.enterpriseInform.view.title.changeApplicationApproval').$D('企业信息变更审批')" @goBack="goBack" />
      <srm-tab-bar display="justify" customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.LIST.TABS" @indexChange="tabIndexChange">
        <srm-tab-item :label="$T('sslm.enterpriseInform.view.title.tenantApproval').$D('租户级变更审批')" code="tenantListTab">
          <srm-list
            :data-set="indexTenantDS"
            :columns="getColumns"
            :buttons="getTenantListButtons"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.TENANT_LIST"
            @itemClick="goToTenantDetail"/>
        </srm-tab-item>
        <srm-tab-item :label="$T('sslm.enterpriseInform.view.title.platformConfirm').$D('平台级变更审批')" code="platformListTab">
          <srm-list
            :data-set="indexPlatformDS"
            :columns="getColumns"
            :buttons="getPlatformListButtons"
            customize-code="SMBL.ENTERPRISE_INFORM_CONFIRM.PLATFORM_LIST"
            @itemClick="goToPlatformDetail"/>
        </srm-tab-item>
      </srm-tab-bar>
    </div>
  </div>
</template>

<script>
import { indexTenantDS, indexPlatformDS } from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
import { batchApprovedApi, batchRejectApi, batchOkApi } from "../api/index";
export default {
  modules: [ "sslm.supplierWarehouse", "sslm.enterpriseInform", "smbl.common", "sslm.common", "smbl.workFlow", "hipspfm.workFlow", "hipspfm.common" ],
  name: "EnterpriseInformConfirmList",
  components: {
  },
  data() {
    return {
      indexTenantDS: new DataSet(indexTenantDS()),
      indexPlatformDS: new DataSet(indexPlatformDS()),
      // tabbar下标
      tabbarIndex: 0,
      approveRemark:"",
      approvedPopup: null,
    };
  },
  computed: {
    // 租户级变更审批按钮
    getTenantListButtons() {
      return [
        {
          text: this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
          type: "danger",
          fill: false,
          bordered: true,
          visible: true,
          callback: () => {
            this.handlerOperation("rejected");
          },
        },
        {
          text: this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
          type: "primary",
          fill: true,
          visible: true,
          callback: () => {
            this.handlerOperation("approved");
          },
        }
      ];
    },
    // 平台级变更审批按钮
    getPlatformListButtons() {
      return [
        {
          text: this.$T("smbl.common.button.ok").$D("确认"),
          type: "primary",
          fill: true,
          visible: true,
          callback: () => {
            this.handlerOperation("ok");
          },
        }
      ];
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "changeReqNumber",
          fieldType: "EMPTY",
          render: (val, record) => {
            const statusColor = this.renderStatus(record.reqStatus);
            return <SrmListHeader>
              <span>{record.changeReqNumber}</span>
              <span slot="right" class={"item-num"} style={{ color:statusColor }}> {record.reqStatusMeaning} </span>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "changeLevelMeaning",
          fieldName: this.$T("sslm.enterpriseInform.model.application.latitudeChange").$D("变更维度"),
        },
        {
          fieldCode: "companyNum",
          fieldName: this.$T("sslm.enterpriseInform.model.application.companyNum").$D("企业编码"),
        },
        {
          fieldCode: "companyName",
          fieldName: this.$T("sslm.enterpriseInform.model.application.companyName").$D("企业名称"),
        },
        {
          fieldCode: "submitDate",
          fieldName: this.$T("sslm.enterpriseInform.model.application.submintTime").$D("提交时间"),
        },
      ];
    },
  },
  mounted () {},
  methods: {
    // 渲染状态
    renderStatus(status) {
      let statusColor = "#05944F";
      switch (status) {
      case "CONFIRMING":
      case "WAIT_TENANT_CONFIRMED":
      case "WAIT_CONFIRMED":
        statusColor = "#FFC043";
        break;
      case "CONFIRM_REJECTED":
        statusColor = "#E11900";
        break;
      default:
        statusColor = "#05944F";
        break;
      }
      return statusColor;
    },
    // 审批意见弹窗按钮
    getApprovedButtons(type) {
      if (type === "approved") {
        return [
          {
            text: this.$T("smbl.common.button.cancel").$D("取消"),
            type: "info",
            fill: false,
            handler: () => {
              this.approvedPopup.closePopup();
            },
          },
          {
            text: this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
            type: "primary",
            fill: true,
            handler: () => {
              this.approved();
            },
          }
        ];
      } else if (type === "rejected") {
        return [
          {
            text: this.$T("smbl.common.button.cancel").$D("取消"),
            type: "info",
            fill: false,
            handler: () => {
              this.approvedPopup.closePopup();
            },
          },
          {
            text: this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
            type: "danger",
            fill: true,
            handler: () => {
              this.rejected();
            },
          }
        ];
      }
    },
    // 处理同意/拒绝操作
    handlerOperation(type) {
      // 判断是否选中数据
      let selected = this.tabbarIndex === 0 ? this.indexTenantDS.selected : this.indexPlatformDS.selected;
      if (selected.length < 1) {
        this.$notification.open({
          message: this.$T("smbl.common.message.pleaseCheckSelectData").$D("未选择可操作数据，请检查！"),
          duration: 2000
        });
        return;
      }
      // 审批通过
      if (type === "approved") {
        this.showApprovedPopup(type);
      } else if (type === "rejected") {
        // 审批拒绝
        this.showApprovedPopup(type);
      } else if (type === "ok") {
        // 确认
        this.$dialog({
          content: this.$T("hipspfm.common.button.confirm").$D("确认") + "？",
          onOk: () => {
            this.bathOk();
          },
        });
      }
    },
    // 审批意见pop
    showApprovedPopup(type) {
      this.approveRemark = "";
      this.approvedPopup = this.$popup({
        title: this.$T("sslm.enterpriseInform.model.application.approvalOpinion").$D("审批意见"),
        showHeader: true,
        showClose: false,
        showBack: false,
        rounded: true,
        height: "50vh",
        position: "bottom",
        content:<srm-flex style={{ padding: "0 15px" }}>
          <srm-textarea-field
            v-model={this.approveRemark}
            placeholder={this.$T("hipspfm.workFlow.view.message.inputApproveRemark").$D("请输入审批意见")}
            height={120}
            maxLength={1000}
            required={false}
            clearButton={false}
            showLength={true}
            editButton={false}
            showResizer={false}/>
          <srm-bottom-handler btn-arr={type === "approved" ? this.getApprovedButtons("approved") : this.getApprovedButtons("rejected")}/>
        </srm-flex>
      });
    },
    // 刷新数据
    refreshDataset() {
      if (this.tabbarIndex === 0) {
        this.indexTenantDS.refresh();
      } else {
        this.indexPlatformDS.refresh();
      }
    },
    // 批量审批拒绝
    rejected() {
      let selected = [];
      this.$loading.show();
      if (this.tabbarIndex === 0) {
        selected = this.indexTenantDS.selected.map((r) => ({ changeConfirmId:r.data.changeConfirmId, approvalOpinion:this.approveRemark }));
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.message.pleaseSwitchTenantPage").$D("请切换到租户级变更审批进行操作"),
          duration: 2000
        });
        return;
      }
      const params = selected;
      batchRejectApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          // 关闭pop
          this.approvedPopup.closePopup();
          // 刷新数据
          this.refreshDataset();
        }
      }).finally(() => this.$loading.hide());
    },
    // 批量审批通过
    approved() {
      let selected = [];
      this.$loading.show();
      if (this.tabbarIndex === 0) {
        selected = this.indexTenantDS.selected.map((r) => ({ ...r.data, approvalOpinion:this.approveRemark }));
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.message.pleaseSwitchTenantPage").$D("请切换到租户级变更审批进行操作"),
          duration: 2000
        });
        return;
      }
      const params = selected;
      batchApprovedApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          // 关闭pop
          this.approvedPopup.closePopup();
          // 刷新数据
          this.refreshDataset();
        }
      }).finally(() => this.$loading.hide());
    },
    // 批量审批通过
    bathOk() {
      let selected = [];
      this.$loading.show();
      if (this.tabbarIndex === 1) {
        selected = this.indexPlatformDS.selected.map((r) => ({ ...r.data }));
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.message.pleaseSwitchPlatformPage").$D("请切换到平台级变更确认进行操作"),
          duration: 2000
        });
        return;
      }
      const params = selected;
      batchOkApi(params).then((res) => {
        if (res && res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
            description: "",
            class: "notification"
          });
          // 刷新数据
          this.refreshDataset();
        }
      }).finally(() => this.$loading.hide());
    },
    // 跳转租户级详情页
    goToTenantDetail(item = {}) {
      const { data:{ changeReqId, companyId, partnerTenantId, reqStatus, changeConfirmId } } = item;
      this.$router.push({
        name: "EnterpriseInformConfirmTenantDetail",
        query: { changeReqId, companyId, partnerTenantId, reqStatus, changeConfirmId }
      });
    },
    // 跳转平台级详情页
    goToPlatformDetail(item = {}) {
      const { data:{ changeReqId, companyId, partnerTenantId, changeConfirmId, platformConfirmNewestFlag } } = item;
      this.$router.push({
        name: "EnterpriseInformConfirmPlatDetail",
        query: { changeReqId, companyId, partnerTenantId, changeConfirmId, platformConfirmNewestFlag }
      });
    },
    // tab切换
    tabIndexChange(index) {
      this.tabbarIndex = index;
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>

>>> .srm-popup-header-title {
  flex-wrap: wrap;
  overflow: hidden;
  padding: 0 15px;
}

</style>
