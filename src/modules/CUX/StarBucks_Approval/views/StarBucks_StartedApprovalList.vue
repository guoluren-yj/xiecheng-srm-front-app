<template>
  <div style="height: 100vh;position: relative">
    <srm-list :data-set="dataSet" :columns="getColumns()" @itemClick="toDetail">
      <srm-flex slot="filter" class="filter-item-box" justify="between">
        <srm-dropdown :text="$T('smbl.workFlow.view.form.documentType').$D('单据类型')">
          <approval-category type="startedBy" @select="onDocumentCategorySelect"/>
        </srm-dropdown>
        <srm-dropdown v-model="processType" :text="$T('smbl.workFlow.view.filter.startedBy').$D('我发起')"
                      @select="onApproveStatusSelect">
          <srm-flex direction="column">
            <srm-dropdown-item value="startedBy" :text="$T('smbl.workFlow.view.filter.startedBy').$D('我发起')"/>
          </srm-flex>
        </srm-dropdown>
        <srm-dropdown ref="filterDropdown" :text="$T('smbl.common.button.filter').$D('筛选')">
          <srm-flex direction="column">
            <srm-flex direction="column" style="padding: 15px">
              <srm-lov-field v-model="filterQuery.startedUserId"
                             :label="$T('hwfp.common.model.apply.owner').$D('申请人')"
                             :placeholder="$T('smbl.common.view.pleaseSelect',[ $T('hwfp.common.model.apply.owner').$D('申请人') ]).$D('请选择申请人')"
                             size="large"
                             code="HPFM.EMPLOYEE"
                             :options="{ queryField: 'name', displayField: 'name', valueField: 'employeeNum' }"/>
              <srm-blank size="1px" theme="fill"/>
              <srm-blank size="large"/>
              <srm-calendar-field v-model="filterQuery.createdAfter"
                                  :label="$T('hwfp.common.model.apply.time').$D('申请日期')"
                                  type="start-end"
                                  :end-date.sync="filterQuery.createdBefore"/>
              <srm-blank size="1px" theme="fill"/>
            </srm-flex>
            <srm-blank size="large"/>
            <srm-flex justify="between">
              <srm-button style="border-radius: 0 !important"
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
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import { isEmpty } from "../../../../utils";
import approvalListDS from "../datasource";
import ApprovalCategory from "../component/ApprovalCategory";

export default {
  modules: [ "smbl.workFlow", "hipspfm.common", "smbl.common", "hwfp.common" ],
  name: "StarBucksApprovalList",
  components: { ApprovalCategory },
  data() {
    return {
      dataSet: new DataSet(approvalListDS()),
      filterDropdownVisible: false,
      filterQuery: {},
      processType: "todo",
    };
  },
  activated() {
    this.dataSet.refresh();
  },
  beforeMount() {
    this.dataSet.editable = false;
    this.dataSet.transport.read.url = "/hwfp/v1/{tenantId}/process/instance/query/new-page";
    this.dataSet.addPathParameter("tenantId", SrmUtil.getTenantId());
    this.dataSet.addQueryParameter("startedBy", true);
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
      if (category.categoryCode === "ALL") {
        this.dataSet.addBodyParameter("documentId", category.categoryId);
        this.dataSet.addBodyParameter("categoryId", null);
      } else {
        this.dataSet.addBodyParameter("categoryId", category.categoryId);
        this.dataSet.addBodyParameter("documentId", category.documentId);
      }
      this.dataSet.refresh();
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
      const processInstanceId = data.processInstanceId || data.id;
      const query = {
        processInstanceId,
        type: "startedBy"
      };
      this.$router.push({
        path: "/StarBucks_ApprovalDetail",
        query
      });
    },
    getColumns() {
      return [ {
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader showOpenTag={Boolean(item.mobileFormUrl)}>
          <span>{item.processName}</span>
          <span slot="right">{item.processInstanceId}</span>
        </SrmListHeader>
      }, {
        fieldCode: "customContent",
        fieldType: "EMPTY",
        render: (val, item) => <span>{item.description}</span>
      }, {
        fieldCode: "customFooter",
        fieldType: "EMPTY",
        render: (val, item) => <SrmFlex justify="between">
          <span class="apply-owner">
            {item.startUserName}-{item.startUserId} / {item.startTime}
          </span>
        </SrmFlex>
      } ];
    }
  }
};
</script>

<style lang="stylus" scoped>
.filter-item-box {
  border-bottom #F6F6F6 solid 1px;
}

.filter-item {
  padding 15px;
  font-size: 14px;
  color: #AFAFAF;
  text-align: center;
  line-height: 20px;
}

>>> .srm-list-item-card-head {
  .srm-list-item-card-head-left {
    font-size 14px;
    line-height: 20px;
    font-weight: 600;
  }

  .srm-list-item-card-head-right {
    font-size: 12px;
    color: #797979;
    line-height: 18px;
    font-weight: 400;
  }
}

.apply-owner {
  font-size: 12px;
  color: #333333;
  line-height: 18px;
  font-weight: 400;
  margin-top 8px;
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
