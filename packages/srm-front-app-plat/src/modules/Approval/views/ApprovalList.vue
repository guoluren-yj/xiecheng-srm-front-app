<template>
  <div style="height: 100vh;position: relative">
    <srm-list :data-set="dataSet" :columns="getColumns()" :buttons="getButtons()" @itemClick="toDetail">
      <srm-flex slot="filter" class="filter-item-box" justify="between">
        <srm-flex-item :flex="1">
          <srm-dropdown v-model="processType" :text="$T('smbl.workFlow.view.filter.toApproval').$D('待审批')"
                        @select="onApproveStatusSelect">
            <srm-flex direction="column">
              <srm-dropdown-item value="todo" :text="$T('smbl.workFlow.view.filter.toApproval').$D('待审批')"/>
              <srm-dropdown-item value="involved" :text="$T('smbl.workFlow.view.filter.involve').$D('已审批')"/>
              <srm-dropdown-item value="carbonCopy" :text="$T('smbl.workFlow.view.filter.cc').$D('抄送我')"/>
              <srm-dropdown-item value="startedBy" :text="$T('smbl.workFlow.view.filter.startedBy').$D('我发起')"/>
            </srm-flex>
          </srm-dropdown>
        </srm-flex-item>
        <srm-flex-item :flex="1">
          <srm-dropdown :text="$T('smbl.workFlow.view.form.documentType').$D('单据类型')">
            <approval-category :type="processType" :default-category-id="defaultCategoryId"
                               @select="onDocumentCategorySelect"/>
          </srm-dropdown>
        </srm-flex-item>
        <srm-flex-item :flex="1">
          <srm-dropdown ref="filterDropdown" :text="$T('smbl.common.button.filter').$D('筛选')">
            <srm-flex direction="column">
              <srm-flex direction="column" style="padding: 20px 15px 36px 10px">
                <div v-show="!['todo', 'involved'].includes(processType)" class="filter-item-wrapper">
                  <srm-lov-field v-model="filterQuery.documentCode"
                                 :label="$T('hwfp.common.model.documents.class').$D('流程单据')"
                                 :placeholder="$T('smbl.common.view.pleaseSelect',[ $T('hwfp.common.model.documents.class').$D('流程单据') ]).$D('请选择流程单据')"
                                 size="mid"
                                 code="HWFP.PROCESS_DOCUMENT"
                                 :options="{valueField: 'documentCode'}"/>
                  <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
                  <srm-blank size="large"/>
                  <srm-blank size="small"/>
                </div>
                <div v-show="processType !== 'todo'" class="filter-item-wrapper">
                  <srm-lov-field v-model="filterQuery.processStatus"
                                 :display.sync="filterQuery.processStatusMeaning"
                                 :label="$T('hwfp.common.model.process.approvalStatus').$D('审批状态')"
                                 :placeholder="$T('smbl.common.view.pleaseSelect',[ $T('hwfp.common.model.process.approvalStatus').$D('审批状态') ]).$D('请选择审批状态')"
                                 size="mid"
                                 select-type="SELECT"
                                 code="HWFP.PROCESS_APPROVE_STATUS"
                                 :options="{ multiple: true }"/>
                  <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
                  <srm-blank size="large"/>
                  <srm-blank size="small"/>
                </div>

                <div class="filter-item-wrapper">
                  <srm-lov-field v-model="filterQuery.startedUserId"
                                 :label="$T('hwfp.common.model.apply.owner').$D('申请人')"
                                 :display.sync="filterQuery.startedUserIdMeaning"
                                 :placeholder="$T('smbl.common.view.pleaseSelect',[ $T('hwfp.common.model.apply.owner').$D('申请人') ]).$D('请选择申请人')"
                                 size="mid"
                                 code="HPFM.EMPLOYEE"
                                 :options="{ queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>
                  <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
                  <srm-blank size="large"/>
                  <srm-blank size="small"/>
                </div>

                <div class="filter-item-wrapper">
                  <srm-calendar-field v-model="filterQuery.createdAfter"
                                      size="mid"
                                      :label="$T('hwfp.common.model.apply.time').$D('申请时间')"
                                      type="start-end"
                                      :end-date.sync="filterQuery.createdBefore"/>
                  <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
                  <srm-blank size="large"/>
                  <srm-blank size="small"/>
                </div>

                <div v-show="processType === 'involved'" class="filter-item-wrapper">
                  <srm-calendar-field v-model="filterQuery.empLastApprovalTimeAfter"
                                      size="mid"
                                      :label="$T('smbl.workFlow.view.approve.date').$D('审批日期')"
                                      type="start-end"
                                      :end-date.sync="filterQuery.empLastApprovalTimeBefore"/>
                  <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
                </div>

                <div v-show="['todo', 'startedBy'].includes(processType)" class="filter-item-wrapper">
                  <srm-lov-field v-model="filterQuery.rushFlag"
                                 code="HPFM.FLAG"
                                 select-type="select"
                                 :placeholder="$T('smbl.common.view.pleaseSelect',[ $T('smbl.workFlow.view.approve.rushFlag').$D('是否加急') ]).$D('请选择流程单据')"
                                 :display.sync="filterQuery.rushFlagMeaning"
                                 size="mid"
                                 :label="$T('smbl.workFlow.view.approve.rushFlag').$D('是否加急')"
                                 :options="{ subDisplayField: 'none' }"
                                 type="start-end"/>
                  <srm-blank size="1px" theme="fill" style="margin-top: 12px"/>
                </div>
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
        </srm-flex-item>
        <srm-flex-item :flex="1">
          <srm-dropdown value="DESC" :text="$T('smbl.common.button.filter.dateDesc').$D('时间倒序')"
                        @select="onSortSelect">
            <srm-flex direction="column">
              <srm-dropdown-item value="ASC" :text="$T('smbl.common.button.filter.dateAsc').$D('时间升序')"/>
              <srm-dropdown-item value="DESC" :text="$T('smbl.common.button.filter.dateDesc').$D('时间倒序')"/>
            </srm-flex>
          </srm-dropdown>
        </srm-flex-item>
      </srm-flex>
    </srm-list>
    <approval-popup ref="approvalPopup"/>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { decode } from "js-base64";
import { isEmpty } from "@/utils";
import { taskBatchApproveApi, getApprovalButtonTipsApi } from "../api";
import approvalListDS from "../datasource";
import ApprovalPopup from "../component/ApprovalPopup";
import ApprovalCategory from "../component/ApprovalCategory";

export default {
  modules: [ "smbl.workFlow", "hipspfm.common", "smbl.common", "hwfp.common", "hwfp.task", "hzero.common" ],
  name: "ApprovalList",
  components: { ApprovalCategory, ApprovalPopup },
  data() {
    return {
      dataSet: new DataSet(approvalListDS()),
      filterDropdownVisible: false,
      filterQuery: {},
      processType: "todo",
      statusMap: {
        "REJECTED": this.$T("smbl.workFlow.view.status.rejected").$D("审批拒绝"),
        "APPROVED": this.$T("smbl.workFlow.view.status.approved").$D("审批通过"),
        "APPROVAL": this.$T("smbl.workFlow.view.status.approval").$D("审批中"),
        "SUSPENDED": this.$T("smbl.workFlow.view.status.suspend").$D("挂起中"),
        "STOP": this.$T("smbl.workFlow.view.status.stop").$D("终止"),
        "REVOKE": this.$T("smbl.workFlow.view.status.revoke").$D("撤销"),
      },
      colorMap: {
        "REJECTED": "danger",
        "APPROVED": "success",
        "APPROVAL": "warn",
        "SUSPENDED": "info",
        "STOP": "info",
        "REVOKE": "info",
      },
      tabMap: {
        task: "todo",
        involved: "involved",
        carbonCopy: "carbonCopy",
        startBy: "startedBy",
      },
      defaultCategoryId: null,
      processStatusLov: {},
      sort:"DESC"
    };
  },
  activated() {
    this.dataSet.refresh(false);
  },
  created() {
    this.processType = this.$route.query.processType || "todo";
  },
  beforeMount() {
    this.dataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
    this.initDefaultFilters();
    this.getApprovalButtonTips();
  },
  methods: {
    initDefaultFilters() {
      const { defaultDocumentId = "", defaultFilters = "", defaultTabIndex } = this.$route.query;
      if (defaultDocumentId) {
        this.dataSet.addBodyParameter("documentId", defaultDocumentId);
        this.defaultCategoryId = defaultDocumentId;
      }
      if (defaultTabIndex) {
        this.processType = this.tabMap[defaultTabIndex] || "todo";
      }
      if (defaultFilters) {
        let decoded = "";
        try {
          decoded = decode(decodeURIComponent(defaultFilters));
        } catch (e) {
          console.log("解析base64失败：", e);
          return;
        }
        const {
          processSearch = "",
          startUserLov: { startedUserId, startedUserIdMeaning = "", assignee, assigneeMeaning } = {},
          rushFlag,
          createdTime: { createdBefore, createdAfter } = {},
          startedTime: { startedBefore, startedAfter } = {},
          empLastApprovalTime: { empLastApprovalTimeBefore, empLastApprovalTimeAfter } = {},
          processStatusList = []
        } = JSON.parse(decoded);
        processSearch && this.dataSet.addQueryParameter("processDefinitionNameLike", processSearch);
        if (!isNaN(rushFlag)) {
          this.filterQuery.rushFlag = rushFlag;
          this.filterQuery.rushFlagMeaning = Number(rushFlag) ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否");
        }
        if (startedUserId || assignee) {
          this.filterQuery.startedUserId = startedUserId || assignee;
          this.filterQuery.startedUserIdMeaning = startedUserIdMeaning || assigneeMeaning;
        }
        if (startedBefore) {
          this.filterQuery.startedBefore = startedBefore;
        }
        if (startedAfter) {
          this.filterQuery.startedAfter = startedAfter;
        }
        if (createdBefore) {
          this.filterQuery.createdBefore = createdBefore;
        }
        if (createdAfter) {
          this.filterQuery.createdAfter = createdAfter;
        }
        if (empLastApprovalTimeBefore) {
          this.filterQuery.empLastApprovalTimeBefore = empLastApprovalTimeBefore;
        }
        if (empLastApprovalTimeAfter) {
          this.filterQuery.empLastApprovalTimeAfter = empLastApprovalTimeAfter;
        }
        if (processStatusList && processStatusList.length) {
          this.filterQuery.processStatus = processStatusList.join(",");
          SrmUtil.getValueSetBatch({ processStatusLov: "HWFP.PROCESS_APPROVE_STATUS" }, this).then(() => {
            const meanings = [];
            // eslint-disable-next-line no-unused-vars
            for (const status of processStatusList) {
              const meaning = this.processStatusLov[status];
              meaning && meanings.push(meaning);
            }
            this.$set(this.filterQuery, "processStatusMeaning", meanings.join(","));
          });
        }
        this.onFilterConfirm();
      }
    },
    onFilterReset() {
      this.filterQuery = {};
      this.dataSet.addBodyParameter("createdAfter", null);
      this.dataSet.addBodyParameter("createdBefore", null);
      this.dataSet.addBodyParameter("startedAfter", null);
      this.dataSet.addBodyParameter("startedBefore", null);
      this.dataSet.addBodyParameter("startedUserId", null);
      this.dataSet.addBodyParameter("startUserName", null);
      this.dataSet.addBodyParameter("empLastApprovalTimeAfter", null);
      this.dataSet.addBodyParameter("empLastApprovalTimeBefore", null);
      this.dataSet.addBodyParameter("processStatusList", null);
      this.dataSet.addBodyParameter("documentCode", null);
      this.dataSet.addBodyParameter("rushFlag", null);
      this.$refs.filterDropdown.close();
      this.dataSet.refresh();
    },
    onFilterConfirm() {
      const filterDropdown = this.$refs.filterDropdown;
      filterDropdown && filterDropdown.close();
      if (this.filterQuery.createdAfter) {
        this.dataSet.addBodyParameter("createdAfter", this.filterQuery.createdAfter);
        this.dataSet.addBodyParameter("startedAfter", this.filterQuery.createdAfter);
      } else {
        this.dataSet.addBodyParameter("createdAfter", null);
        this.dataSet.addBodyParameter("startedAfter", null);
      }
      if (this.filterQuery.createdBefore) {
        this.dataSet.addBodyParameter("createdBefore", this.filterQuery.createdBefore);
        this.dataSet.addBodyParameter("startedBefore", this.filterQuery.createdBefore);
      } else {
        this.dataSet.addBodyParameter("createdBefore", null);
        this.dataSet.addBodyParameter("startedBefore", null);
      }
      if (this.filterQuery.empLastApprovalTimeAfter) {
        this.dataSet.addBodyParameter("empLastApprovalTimeAfter", this.filterQuery.empLastApprovalTimeAfter);
        this.dataSet.addBodyParameter("empLastApprovalTimeBefore", this.filterQuery.empLastApprovalTimeBefore);
      } else {
        this.dataSet.addBodyParameter("empLastApprovalTimeAfter", null);
        this.dataSet.addBodyParameter("empLastApprovalTimeBefore", null);
      }
      if (this.filterQuery.processStatus) {
        this.dataSet.addBodyParameter("processStatusList", this.filterQuery.processStatus.split(","));
      } else {
        this.dataSet.addBodyParameter("processStatusList", null);
      }
      if (this.filterQuery.documentCode) {
        this.dataSet.addBodyParameter("documentCode", this.filterQuery.documentCode);
      } else {
        this.dataSet.addBodyParameter("documentCode", null);
      }
      this.dataSet.addBodyParameter("startedUserId", this.filterQuery.startedUserId);
      this.dataSet.addBodyParameter("startUserName", this.filterQuery.startedUserId);
      this.dataSet.addBodyParameter("rushFlag", this.filterQuery.rushFlag);
      this.dataSet.refresh();
    },
    onSortSelect(sort) {
      this.sort = sort;
      if (this.processType === "todo") {
        this.dataSet.addBodyParameter("processStartTimeSort", null);
        this.dataSet.addBodyParameter("creationDateSort", sort);
        this.dataSet.addBodyParameter("processStartDateSort", sort);
      } else {
        this.dataSet.addBodyParameter("creationDateSort", null);
        this.dataSet.addBodyParameter("processStartDateSort", null);
        this.dataSet.addBodyParameter("processStartTimeSort", sort);
      }
      this.dataSet.refresh();
    },
    onApproveStatusSelect(status) {
      if (this.processType === "todo") {
        this.dataSet.addBodyParameter("processStartTimeSort", null);
        this.dataSet.addBodyParameter("creationDateSort", this.sort);
        this.dataSet.addBodyParameter("processStartDateSort", this.sort);
      } else {
        this.dataSet.addBodyParameter("creationDateSort", null);
        this.dataSet.addBodyParameter("processStartDateSort", null);
        this.dataSet.addBodyParameter("processStartTimeSort", this.sort);
      }
      this.dataSet.addQueryParameter("involved", null);
      this.dataSet.addQueryParameter("carbonCopy", null);
      this.dataSet.addQueryParameter("startedBy", null);
      if ([ "carbonCopy", "involved" ].includes(status)) {
        this.dataSet.addBodyParameter("rushFlag", null);
        this.$set(this.filterQuery, "rushFlag", null);
      }
      if (status === "todo") {
        this.dataSet.editable = true;
        this.dataSet.transport.read.url = "/hwfp/v1/{tenantId}/activiti/task/query/new-page";
      } else {
        this.dataSet.editable = false;
        this.dataSet.transport.read.url = "/hwfp/v1/{tenantId}/process/instance/query/new-page";
        this.dataSet.addQueryParameter(status, true);
      }
      this.dataSet.editFlag = false;
      this.dataSet.refresh();
    },
    onDocumentCategorySelect(category = {}) {
      this.dataSet.addBodyParameter("documentId", category.id);
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
          action: params.approveResult === "Delegate" ? "delegate" : "complete",
          comment: params.comment,
          assignee: params.assignee,
          currentTaskId: taskInfo.id,
          processDefinitionId: taskInfo.processDefinitionId,
          processInstanceId: taskInfo.processInstanceId,
          variables
        };
        approveDataList.push(approveData);
      });

      this.$loading.show({ content: this.$T("smbl.common.message.approving").$D("单据审批中") });
      taskBatchApproveApi(approveDataList).then((res) => {
        if (res && res.failed) {
          this.$notification.open({ message: res.message });
        } else {
          this.$notification.open({ message: this.$T("hwfp.task.view.message.tip2").$D("单据后台处理中，您可以离开当前页面，审批失败的单据，将通过系统消息展示失败原因，并重新展示在待办列表中。") });
          this.dataSet.removeLocalRecords(this.dataSet.selected);
        }
      }).finally(() => {
        this.$loading.hide();
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
        dataSetId: this.dataSet.id,
      } : {
        processInstanceId,
        type: this.processType,
        dataSetId: this.dataSet.id,
      };

      this.$router.push({
        path: "/ApprovalDetail",
        query
      });
    },
    getButtons() {
      const disabled = (checkedList) => checkedList.length === 0 || this.dataSet && this.dataSet.clearFlag && this.dataSet.status === "loading";
      return [ {
        text: this.$T("smbl.workFlow.view.form.reject").$D("审批拒绝"),
        bordered: true,
        visible: () => this.processType === "todo",
        type: "danger",
        size: "large",
        disabled,
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
        disabled,
        callback: (checkedList) => {
          this.$refs.approvalPopup.showApprove().then((approvalParams) => {
            this.batchApproveTask(checkedList, approvalParams);
          });
        },
      }, {
        text: this.$T("smbl.workFlow.view.form.delegate").$D("转交"),
        visible: () => this.processType === "todo",
        disabled,
        callback: (checkedList) => {
          if (checkedList.length === 0) {
            return;
          }
          this.$refs.approvalPopup.showDelegate().then((approvalParams) => {
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
          <span>
            {
              Boolean(item.rushFlag) && [ "todo", "startedBy" ].includes(this.processType) &&
                <div class="rush-icon-box">
                  <span class="srm-icon icon-bolt-fill"/>
                </div>
            }
            {item.processName}-{item.processInstanceId || item.id}
          </span>
          {
            item.processStatus &&
              <SrmButton
                slot="right" style="font-weight: 600" type={this.colorMap[item.processStatus]}
                plain
              >
                {this.statusMap[item.processStatus]}
                {
                  item.processStatus && item.processStatus === "SUSPENDED" && item.processExceptionInformation &&
                    <SrmTooltip placement="top" title={item.processExceptionInformation.messageHead}>
                      <span class="srm-icon icon-mall_alert-circle"></span>
                    </SrmTooltip>
                }
              </SrmButton>
          }
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
            {item.startUserName} / {item.startTime || "-"}
          </span>
        </SrmFlex>
      } ];
    },
    async getApprovalButtonTips() {
      await getApprovalButtonTipsApi().then((response) => {
        this.$store.commit("Approval/setActionTips", response);
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.filter-item-box {
  padding 0 15px;
  height 44px;
  border-bottom var(--split-line-color-primary) solid 1px;
}

.filter-item {
  padding 15px;
  font-size: 14px;
  color: #AFAFAF;
  text-align: center;
  line-height: 20px;
}

>>> .filter-item-wrapper {
  width 100%;
}

.apply-owner {
  font-size: 12px;
  color: var(--font-color-default);
  line-height: 18px;
  font-weight: 400;
  margin-top 8px;
}

.rush-icon-box {
  display inline-flex;
  align-items center;
  justify-content center;
  margin-right 8px;
  width 20px;
  height 20px;
  background var(--color-ghost-danger)

  .srm-icon {
    color: var(--color-danger);
    font-size 12px;
  }
}

.start-time {
  font-size: 12px;
  color: #797979;
  line-height: 18px;
  font-weight: 400;
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

</style>
