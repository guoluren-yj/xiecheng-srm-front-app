<template>
  <div style="height: 100vh;position: relative">
    <srm-list :data-set="dataSet" :columns="getColumns()" :buttons="getButtons()" @itemClick="toDetail">
      <srm-flex slot="filter" class="filter-item-box" justify="between">
        <srm-dropdown :text="$T('smbl.workFlow.view.form.documentType').$D('单据类型')">
          <approval-category @select="onDocumentCategorySelect"/>
        </srm-dropdown>
        <srm-dropdown v-model="processType" :text="$T('smbl.workFlow.view.filter.toApproval').$D('待审批')"
                      @select="onApproveStatusSelect">
          <srm-flex direction="column">
            <srm-dropdown-item value="todo" :text="$T('smbl.workFlow.view.filter.toApproval').$D('待审批')"/>
            <srm-dropdown-item value="involved" :text="$T('smbl.workFlow.view.filter.involve').$D('我参与')"/>
            <srm-dropdown-item value="carbonCopy" :text="$T('smbl.workFlow.view.filter.cc').$D('抄送我')"/>
          </srm-flex>
        </srm-dropdown>
        <srm-dropdown ref="filterDropdown" :text="$T('smbl.common.button.filter').$D('筛选')">
          <srm-flex direction="column">
            <srm-flex direction="column" style="padding: 20px 15px 36px 10px">
              <srm-lov-field v-model="filterQuery.startedUserId"
                             :label="$T('hwfp.common.model.apply.owner').$D('申请人')"
                             :placeholder="$T('smbl.common.view.pleaseSelect',[ $T('hwfp.common.model.apply.owner').$D('申请人') ]).$D('请选择申请人')"
                             size="mid"
                             code="HPFM.EMPLOYEE"
                             :options="{ queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>
              <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
              <srm-blank size="large"/>
              <srm-blank size="small"/>
              <srm-calendar-field v-model="filterQuery.createdAfter"
                                  size="mid"
                                  :label="$T('hwfp.common.model.apply.time').$D('申请日期')"
                                  type="start-end"
                                  :end-date.sync="filterQuery.createdBefore"/>
              <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
            </srm-flex>
            <srm-blank size="large"/>
            <srm-flex justify="between">
              <srm-button style="border-radius: 0 !important"
                          plain
                          type="default" full-width rect size="x-large"
                          @click.stop="onFilterReset">
                {{ $T("smbl.common.button.reset").$D("重置") }}
              </srm-button>
              <srm-button style="border-radius: 0 !important"
                          type="primary" fill full-width rect size="x-large"
                          @click.stop="onFilterConfirm">
                {{ $T("smbl.common.button.confirm").$D("确定") }}
              </srm-button>
            </srm-flex>
          </srm-flex>
        </srm-dropdown>
        <srm-dropdown value="DESC" :text="$T('smbl.common.button.filter.dateDesc').$D('时间倒序')" @select="onSortSelect">
          <srm-flex direction="column">
            <srm-dropdown-item value="ASC" :text="$T('smbl.common.button.filter.dateAsc').$D('时间升序')"/>
            <srm-dropdown-item value="DESC" :text="$T('smbl.common.button.filter.dateDesc').$D('时间倒序')"/>
          </srm-flex>
        </srm-dropdown>
      </srm-flex>
    </srm-list>
    <approval-popup ref="approvalPopup"/>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { isEmpty } from "../../../../utils";
import { taskBatchApproveApi } from "../api";
import approvalListDS from "../datasource";
import ApprovalPopup from "../component/ApprovalPopup";
import ApprovalCategory from "../component/ApprovalCategory";

export default {
  modules: [ "smbl.workFlow", "hipspfm.common", "smbl.common", "hwfp.common", "hwfp.task" ],
  name: "StarBucksApprovalList",
  components: { ApprovalCategory, ApprovalPopup },
  data() {
    return {
      dataSet: new DataSet(approvalListDS()),
      filterDropdownVisible: false,
      filterQuery: {},
      multipleLanguage: {
        dataTip: this.$T("hipspfm.common.validation.startIsBefore").$D("开始日期不能大于截止日期"),
      },
      processType: "todo",
    };
  },
  activated() {
    this.dataSet.refresh(false);
  },
  beforeMount() {
    this.dataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
    if (SrmUtil.changeTheme) {
      SrmUtil.changeTheme({
        "--color-primary": "#006341",
        "--color-success": "#006341",
        "--font-color-primary": "#006341",
      });
    }
  },
  methods: {
    onFilterReset() {
      this.filterQuery = {};
      this.dataSet.addBodyParameter("createdAfter", null);
      this.dataSet.addBodyParameter("createdBefore", null);
      this.dataSet.addBodyParameter("startedAfter", null);
      this.dataSet.addBodyParameter("startedBefore", null);
      this.dataSet.addBodyParameter("startedUserId", null);
      this.dataSet.addBodyParameter("startUserName", null);
      this.$refs.filterDropdown.close();
      this.dataSet.refresh();
    },
    onFilterConfirm() {
      this.$refs.filterDropdown.close();
      if (this.filterQuery.createdAfter) {
        this.dataSet.addBodyParameter("createdAfter", this.filterQuery.createdAfter + " 00:00:00");
        this.dataSet.addBodyParameter("startedAfter", this.filterQuery.createdAfter + " 00:00:00");
      } else {
        this.dataSet.addBodyParameter("createdAfter", null);
        this.dataSet.addBodyParameter("startedAfter", null);
      }
      if (this.filterQuery.createdBefore) {
        this.dataSet.addBodyParameter("createdBefore", this.filterQuery.createdBefore + " 23:59:59");
        this.dataSet.addBodyParameter("startedBefore", this.filterQuery.createdBefore + " 23:59:59");
      } else {
        this.dataSet.addBodyParameter("createdBefore", null);
        this.dataSet.addBodyParameter("startedBefore", null);
      }
      this.dataSet.addBodyParameter("startedUserId", this.filterQuery.startedUserId);
      this.dataSet.addBodyParameter("startUserName", this.filterQuery.startedUserId);
      this.dataSet.refresh();
    },
    onSortSelect(sort) {
      this.dataSet.addBodyParameter("creationDateSort", sort);
      this.dataSet.addBodyParameter("processStartDateSort", sort);
      this.dataSet.refresh();
    },
    onApproveStatusSelect(status) {
      this.dataSet.addQueryParameter("involved", null);
      this.dataSet.addQueryParameter("carbonCopy", null);
      if (status === "todo") {
        this.dataSet.editable = true;
        this.dataSet.transport.read.url = "/hwfp/v1/{tenantId}/activiti/task/query/new-page";
      } else {
        this.dataSet.editable = false;
        this.dataSet.transport.read.url = "/hwfp/v1/{tenantId}/process/instance/query/new-page";
        this.dataSet.addQueryParameter(status, true);
      }
      this.dataSet.refresh();
    },
    onDocumentCategorySelect(category = {}) {
      this.dataSet.addBodyParameter("documentId", category.documentId);
      this.dataSet.refresh();
    },
    batchApproveTask(tasks = [], params = {}) {
      const approveDataList = [];
      const variables = [ {
        name: "comment",
        value: params.comment,
      }, {
        name: "approveResult",
        value: params.approveResult
      } ];

      tasks.forEach((task) => {
        const taskInfo = task.data;
        const approveData = {
          action: "complete",
          comment: params.comment,
          currentTaskId: taskInfo.id,
          processDefinitionId: taskInfo.processDefinitionId,
          processInstanceId: taskInfo.processInstanceId,
          variables
        };
        approveDataList.push(approveData);
      });

      this.$loading.show({ content: this.$T("smbl.common.message.approving").$D("单据审批中") });
      taskBatchApproveApi(approveDataList).then(() => {
        this.$notification.open({ message: this.$T("hwfp.task.view.message.tip2").$D("单据后台处理中，您可以离开当前页面，审批失败的单据，将通过系统消息展示失败原因，并重新展示在待办列表中。") });
        this.dataSet.refresh();
      }).finally(() => {
        this.$loading.hide();
        // 关闭弹框
        this.$refs?.approvalPopup?.hide();
      });
    },
    toDetail(item) {
      const data = item.data;

      if (isEmpty(data.mobileFormUrl)) {
        this.$notification.open({
          message: this.$T("smbl.workFlow.view.form.null").$D("未配置移动端表单页面,无法办理"),
          class: "notification"
        });
        return;
      }
      const taskId = data.id;
      const processInstanceId = data.processInstanceId || data.id;
      const query = this.processType === "todo" ? {
        processInstanceId,
        taskId,
      } : {
        processInstanceId,
        type: this.processType
      };

      this.$router.push({
        path: "/StarBucks_ApprovalDetail",
        query
      });
    },
    getButtons() {
      return [ {
        text: this.$T("smbl.workFlow.view.form.reject").$D("审批拒绝"),
        bordered: true,
        visible: () => this.processType === "todo",
        type: "danger",
        size: "large",
        disabled: (checkedList) => checkedList.length === 0,
        callback: (checkedList) => {
          this.$refs.approvalPopup.showReject().then((approvalParams) => {
            this.batchApproveTask(checkedList, approvalParams);
          });
        },
      }, {
        text: this.$T("smbl.workFlow.view.form.approve").$D("审批同意"),
        fill: true,
        visible: () => this.processType === "todo",
        size: "large",
        disabled: (checkedList) => checkedList.length === 0,
        callback: (checkedList) => {
          this.$refs.approvalPopup.showApprove().then((approvalParams) => {
            this.batchApproveTask(checkedList, approvalParams);
          });
        },
      }, ];
    },
    getColumns() {
      return [ {
        formRow: 0,
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader showOpenTag={Boolean(item.mobileFormUrl) && !this.dataSet.editFlag}>
          <span>{item.processName}-{item.processInstanceId}</span>
        </SrmListHeader>
      }, {
        formRow: 1,
        fieldCode: "customContent",
        fieldType: "EMPTY",
        render: (val, item) => <span>{item.description}</span>
      }, {
        formRow: 2,
        fieldCode: "customFooter",
        fieldType: "EMPTY",
        render: (val, item) => <SrmFlex justify="between">
          <span class="apply-owner">
            {item.startUserName} / {item.createTime}
          </span>
        </SrmFlex>
      } ];
    }
  }
};
</script>

<style lang="stylus" scoped>
.filter-item-box {
  height 44px;
  border-bottom var(--split-line-color-primary) solid 1px;
}

.filter-item {
  padding 15px;
  font-size: 14px;
  color: var(--font-color-second);
  text-align: center;
  line-height: 20px;
}

.apply-owner {
  font-size: 12px;
  color: var(--font-color-default);
  line-height: 18px;
  font-weight: 400;
  margin-top 8px;
}

>>> .srm-list-item-card-head-left {
  max-width 90% !important;
}

>>> .customize-item {
  margin-top 0 !important;
}

>>> .srm-check-box-button {
  top 17px;
}

>>> .srm-list-search-line .srm-list-icon-search {
  color: #333;
}
</style>
