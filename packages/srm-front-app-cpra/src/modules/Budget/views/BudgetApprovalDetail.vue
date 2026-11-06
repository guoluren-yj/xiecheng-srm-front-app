<template>
  <div>
    <srm-scroll-tab class="content main-tab detail-container-tab">
      <srm-scroll-tab-item key="basicInfo" :label="$T('sbdm.common.model.common.baseInfo').$D('基本信息')" code="basicInfo">
        <div>
          <srm-form v-if="basicInfoDataSet" :data-set="basicInfoDataSet" :columns="getBasicInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sbdm.common.model.common.budgetDetailInfo').$D('预算明细')" code="budgetDetailInfo">
        <srm-list :scrollable="true" v-if="listDataDs" height="auto" style="height: auto" :data-set="listDataDs"
          :columns="getDetailColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :title="$T('sbdm.common.model.common.editRecord').$D('调整记录')" :visible="operationPopup" position="bottom"
      rounded @onClose="showOperationPop()">
      <history-record-tiled v-model="operationPopup" :action-data="actionRecordList" position="bottom"
        operator-field-name="processUser" process-remark-field-name="processRemark"
        operation-meaning-field-name="status" process-date-field-name="processedDate"
        process-remark-info-field-name="unknown" />
    </srm-popup>
  </div>
</template>

<script>
import { getBudgetDetailApi, getBudgetTemplate, getBudgetAdjustData } from "../api/index";
import { DataSet, Record } from "srm-mobile-ui";
import { listDs, getStatusColor } from "../datasource/allDataSet";
import { formDS } from "../datasource/FormDS";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import BudgetApprovalView from './BudgetOccupiedView.vue';
export default {
  modules: ["sprm.common", "hipspfm.common", "sprm.purchaseRequest", "sbdm.common", "smbl.common", "hzero.common", "hzero.button"],
  name: "BudgetApprovalDetail",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  components: {
    HistoryRecordTiled,
  },
  data() {
    return {
      budgetHeaderId: null,
      budgetTemplateCode: null,
      budgetActionType: null,
      basicInfo: null,
      templateFieldsList: null,
      basicInfoDataSet: new DataSet(formDS()), // 基本信息
      listDataDs: null,
      operationPopup: false,
      // 操作记录
      actionRecordList: [],

    };
  },
  computed: {
    // 基本信息-Columns
    getBasicInfoColumns() {
      return [{
        fieldCode: "budgetNum",
        fieldType: "TEXT",
        formRow: 10,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.budgetNum").$D("预算编码"),
        // render: (val) => <ListHeader showTitle>{val}</ListHeader>,
      }, {
        fieldCode: "budgetHeaderDesc",
        fieldType: "TEXT",
        formRow: 20,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.budgetNum").$D("预算说明"),
      },
      {
        fieldCode: "budgetTemplateCode",
        fieldType: "TEXT",
        formRow: 30,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.budgetTemplateCode").$D("预算模板"),
      }, {
        fieldCode: "periodNum",
        fieldType: "TEXT",
        formRow: 40,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.periodNum").$D("预算周期"),
      }, {
        fieldCode: "validityDate",
        fieldType: "dateTime",
        formRow: 50,
        seq: 10,
        render: (value, item) => `${item?.startDate} -${item?.endDate}`,
        fieldName: this.$T("sbdm.common.model.common.validityDate").$D("预算周期"),
      }, {
        fieldCode: "responsibleName",
        fieldType: "TEXT",
        formRow: 60,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.responsibleName").$D("责任人"),
      }, {
        fieldCode: "createdByName",
        fieldType: "TEXT",
        formRow: 60,
        seq: 20,
        fieldName: this.$T("sbdm.common.model.common.createdByName").$D("创建人"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        formRow: 70,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.creationDate").$D("创建时间"),
      }, {
        fieldCode: "version",
        fieldType: "TEXT",
        formRow: 80,
        seq: 10,
        fieldName: this.$T("sbdm.common.model.common.version").$D("版本"),
      },];
    },
    // 任务成本-Columns
    getDetailColumns() {
      const templateFields = this.templateFieldsList?.map(i => ({
        fieldCode: i.displayField || i.valueField,
        fieldType: "TEXT",
        fieldName: i?.budgetItemName,
        render: (val, item) => item[`${i?.valueField}Meaning`] || item[i?.valueField]
      }))
      const peddingList = [
        {
          fieldCode: "lineNum",
          fieldType: "TEXT",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span>{val || "-"}</span>
            <span slot="right" style={getStatusColor(item.budgetLineStatus)}>{item.budgetLineStatusMeaning}</span>
          </srm-list-header>,
        }, {
          fieldCode: "budgetLineDesc",
          fieldType: "TEXT",
        }, {
          fieldCode: "origBudgetAmount",
          fieldType: "NUMBER",
        },
        {
          fieldCode: "currencyCode",
        },
      ].concat(templateFields);
      const adjustList = [
        {
          fieldCode: "lineNum",
          formRow: 10,
          seq: 10,
          fieldType: "TEXT",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span>{val || "-"}</span>
            <span slot="right" style={getStatusColor(item.budgetLineStatus)}>{item.budgetLineStatusMeaning}</span>
          </srm-list-header>,
        },
        {
          fieldCode: "budgetLineDesc",
          fieldType: "TEXT",
          formRow: 20,
          seq: 10,
        },
        {
          fieldCode: "origBudgetAmount",
          formRow: 30,
          seq: 10,
        },
        {
          fieldCode: "adjustAmount",
          formRow: 30,
          seq: 20,
        },
        {
          fieldCode: "adjustedAmount",
          formRow: 40,
          seq: 10,
        },
        {
          fieldCode: "budgetBalanceAmount",
          formRow: 40,
          seq: 20,
        },
        {
          fieldCode: "occupiedAmount",
          formRow: 50,
          seq: 10,
        },
        {
          fieldCode: "appliedAmount",
          formRow: 50,
          seq: 20,
        },
        {
          fieldCode: "currencyCode",
          formRow: 60,
          seq: 10,
        },

        {
          fieldCode: "adjustRecordView",
          formRow: 60,
          fieldName: this.$T("sbdm.common.model.common.editRecord").$D("调整记录"),
          seq: 20,
          render: (val, item) => <a onClick={() => this.showOperationPop(item)}>{this.$T('hzero.button.button.look').$D('查看')}</a>,
        },
        {
          fieldCode: "occupiedView",
          fieldName: this.$T("sbdm.common.model.common.viewOccupiedOrAppliedDetail").$D("占用/核销记录"),
          formRow: 70,
          seq: 10,
          render: (val, item) => <a onClick={() => this.showCusDetail(item)}>{this.$T('hzero.button.button.look').$D('查看')}</a>,
        },
      ].concat(templateFields);
      return this.budgetActionType === 'adjust' ? adjustList : peddingList
    },

  },
  beforeMount() {
    if (this.parameters) {
      // 审批页面过来的，不可显示审批按钮
      this.budgetHeaderId = this.parameters.budgetHeaderId;
      this.budgetTemplateCode = this.parameters.budgetTemplateCode;
      this.budgetActionType = this.parameters.budgetActionType;
    } else {
      this.budgetHeaderId = 1409;
      this.budgetTemplateCode = 'BDM202306280001';
      this.budgetActionType = 'adjust'
    }
    this.requestData();
  },
  methods: {
    async showOperationPop(item) {
      this.operationPopup = !this.operationPopup;
      if (item?.budgetLineId) {
        const queryAdjustData = await getBudgetAdjustData(item?.budgetLineId) || [];


        this.actionRecordList = queryAdjustData?.map(i => {
          return {
            processedDate: i?.creationDate,
            status: {
              text: i?.budgetHeaderStatusMeaning,
              type: 'info'
            },
            processUser: i?.createdByName,
            processRemark: i.lineNum ? `${i?.processUserName} 将行号【${i.lineNum}】的【${i?.processRemark}】由【${i.oldValue || ""}】改成【${i.newValue ?? "-"}】` :
              `${i?.processUserName} 将【${i?.processRemark}】由【${i.oldValue || ""}】改成【${i.newValue ?? "-"}】`
          }
        });
      }
    },
    showCusDetail(item) {
      this.$popup({
        title: this.$T("sbdm.common.model.common.viewOccupiedOrAppliedDetail").$D("占用/核销记录"),
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <BudgetApprovalView budgetLineId={item?.budgetLineId} />,
      });
    },
    async requestData() {
      // 查询模板fields
      this.templateFieldsList = await getBudgetTemplate(this.budgetTemplateCode);

      // 请求网络
      let baseInfo = await getBudgetDetailApi(this.budgetHeaderId);
      // 构建基本信息tab的数据
      this.basicInfo = baseInfo;
      this.basicInfoDataSet = new DataSet(formDS());
      // 保留_token
      let _token = this.basicInfo._token;
      this.basicInfoDataSet.create(this.basicInfo, 0);
      this.basicInfo._token = _token;
      // 行数据 taskDs, purListDs, supplierDs
      this.listDataDs = new DataSet(listDs(this.budgetHeaderId, this.budgetTemplateCode));

    },
    // 基础信息弹框
    // showBasicInfoDetail() {
    //   this.$popup({
    //     title: this.$T("sprm.common.view.panel.basicInfo").$D("申请基础信息"),
    //     showHeader: false,
    //     showClose: false,
    //     rounded: false,
    //     height: "100vh",
    //     position: "right",
    //     content: <customize-detail
    //       columns={this.getBasicInfoDetailColumns}
    //       data-source={this.basicInfo}
    //       type="list"
    //       need-padding={true}
    //       code="SMBL.PROJECT_INFO.BASE_DETAIL" />,
    //   });
    // },
    // // 基础信息弹框
    // showPurInfoDetail(dataSet) {
    //   console.log(323223)
    //   this.$popup({
    //     showHeader: false,
    //     showClose: true,
    //     position: "right",
    //     showBack: false,
    //     content: <SrmForm
    //       customizeCode="SMBL.PROJECT_INFO.PUR_DETAIL"
    //       style={{ padding: "0 15px" }}
    //       customizeType="detail"
    //       dataSet={dataSet}
    //       columns={this.getPurPartDetailColumns}
    //     />
    //   });
    // },
    // 行点击-比加单
    // showPriceCompareList(item) {
    //   this.taskPurDs = new DataSet(purListDs(this.projectId, this.projectReqId, this.reqType, { taskId: item?.taskId, taskReqId: item?.taskReqId }));
    //   this.$popup({
    //     title: this.$T("sprm.common.model.common.executionBillDetail").$D("执行单据详情"),
    //     showHeader: false,
    //     showClose: false,
    //     rounded: false,
    //     height: "100vh",
    //     position: "right",
    //     content: <srm-list scrollable={false} height='auto' data-set={this.taskPurDs} columns={this.getPurPartColumns} customize-code={this.getPurPartColumnsCode} onItemClick={() => this.showPurInfoDetail(this.taskPurDs)} />,
    //   });
    // },


    // 行点击-查看行详情
    // lineItemClick(record) {
    //   this.lineDetailDataSet = new DataSet(prLineDetailDS());
    //   this.lineDetailDataSet.create(record.data, 0);
    //   this.lineDetailFlag = true;
    // }

    // 移动端审批前校验
    // beforeApprove() {
    //   console.log(11, this, this.over$getApproveCheck);
    //   if (this.over$getApproveCheck && typeof this.over$getApproveCheck === "function") {
    //     const checkFlag = this.over$getApproveCheck();
    //     return checkFlag;
    //   }
    //   return true;
    // }
  },
};
</script>

<style lang="stylus" scoped>
.detail-container-tab {
  >>> .srm-scroll-content {
    height: calc(100% - 72px);
   }
  }
.bottom-button {
  height: 72px;
  border-top: 1px solid #f0f2f5;
}
.change-buttons {
  position: absolute;
  height: 54px;
  top: 0px;
  right: 15px;
  z-index: 1;
  .change-button {
    margin-left: 8px;
  }
}

.attachment-container {
  .attachment-form {
    min-height: 58px;
    padding: 0;
  }
}

.attachment-card {
  position: relative;
  height: 54px;
  border-bottom: 1px solid var(--color-border-default);
  >>> .srm-upload {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .right-icon {
    position: absolute;
    right: 15px;
    top: 15px;
    color: var(--font-color-disable);
    font-size: 20px;
  }
  .attachment-container {
    pointer-events: none;
    height: 100%;
    .icon {
      color: var(--color-warn);
      margin-left: 15px;
      font-size: 28px;
    }
    .title {
      margin-left: 8px;
    }
    .attachment-type {
      margin-left: 8px;
    }
  }
}

// UI校对
.main-tab {
  // 列表的颜色改回
  .scoll-list {
    >>> .srm-scroll {
      background: var(--background-color-empty);
    }
  }
  // 操作记录最小高度
  >>> .srm-history-record-content {
    min-height: 0px;
  }
}

.approval-detail-bottom {
  height 72px;
  width 100%;
  margin-bottom: constant(safe-area-inset-top);
  margin-bottom: env(safe-area-inset-top);
  background: var(--background-color-empty-second);
}

>>> .srm-scroll-tab-item-title {
  display: flex;
  justify-content: space-between !important;

}

.line-filter {
  .list-tool-tab {
    width: 100px;
    justify-content flex-end;
  }
  .srm-icon {
    color var(--font-color-disable);
    font-size 20px;
    margin-left: 10px;
  }
}
</style>