<template>
  <div style="height: 100vh" >
    <srm-tab-bar slot="filter" display="auto"
                 class="seller-order-bench-tab"
                 customize-code="SMBL.SELLER_ORDER_WORKBENCH.TABS"
                 :active-index="activeIndex" :tabs="tabs" @indexChange="onTabIndexChange"/>
    <srm-list :data-set="getDataSet" :customize-code="getListCustomizeCode" :columns="getColumns" :buttons="getButtons" @itemClick="onItemClick">
      />
    </srm-list>
  </div>
</template>

<script>
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { isEmpty } from "lodash";
import { listDs } from "../dataSource";
import { fetchSettingApi } from "../api";
import VerificationTable from "../component/VerificationTable";
import { renderStatus } from "../utils";

export default {
  modules: [ "slod.orderExecution", "sodr.workspace", "smbl.common", "sodr.common", "smbl.sellerOrderWorkbench" ],
  name: "SellerOrderWorkbenchList",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const type = from.query?.type;
      if (type) {
        vm.type = type;
      }
    });

  },
  data() {
    return {
      tabs:[ { code:
      "toBeFedBack", label:$T("slod.orderExecution.view.tab.toBeFedBack").$D("待反馈") }, { code:
      "feedbackAlready", label:$T("slod.orderExecution.view.tab.feedbackAlready").$D("已反馈") }, { code:
      "all", label:$T("slod.orderExecution.view.tab.all").$D("全部") } ],
      setting: null,
      type: "toBeFedBack",
      toBeFedBackDs: new DataSet(listDs("toBeFedBack", this)),
      feedbackAlreadyDs: new DataSet(listDs("feedbackAlready", this)),
      allDs: new DataSet()
    };
  },
  computed: {
    activeIndex() {
      return this.tabs.findIndex((i) => i.code === this.type);
    },
    //获取列表个性化
    getListCustomizeCode() {
      switch (this.type) {
      case "toBeFedBack":
        return "SMBL.SELLER_ORDER_WORKBENCH.TOBEFEDBACK.LIST";
      case "feedbackAlready":
        return "SMBL.SELLER_ORDER_WORKBENCH.FEEDBACKALREADY.LIST";
      case "all":
        return "SMBL.SELLER_ORDER_WORKBENCH.ALL.LIST";
      default :
        return null;
      }
    },
    getDataSet() {
      switch (this.type) {
      case "toBeFedBack":
        return this.toBeFedBackDs;
      case "feedbackAlready":
        return this.feedbackAlreadyDs;
      case "all":
        return this.allDs;
      default :
        return this.toBeFedBackDs;
      }
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "displayPoNum",
          fieldType: "EMPTY",
          render:(val, item) => {
            const { beyondQuantity, urgentFlag, statusCode, statusCodeMeaning } = item;
            const show = beyondQuantity > 0;
            return <SrmListHeader>
              {val}
              <SrmTooltip v-show={urgentFlag === 1} title={this.$T("slod.orderExecution.view.tooltip.urgent").$D("订单加急")}>
                <span onClick={this.stopPropagation} class="srm-icon icon-bolt-fill order-tooltip" style="color:red"></span>
              </SrmTooltip>
              <SrmTooltip v-show={show} title={this.$T("slod.orderExecution.view.tooltip.yanqiImg").$D("订单超期")}>
                <span onClick={this.stopPropagation} class="srm-icon icon-calendar-event order-tooltip" style="color:red"></span>
              </SrmTooltip>
              <span slot="right">{renderStatus(statusCode, statusCodeMeaning)}</span>
            </SrmListHeader>;
          }
        },
        {
          formRow: 1,
          fieldName: this.$T("slod.orderExecution.model.common.supplier").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          formRow: 2,
          fieldName: this.$T("slod.orderExecution.model.common.poTypeCode").$D("订单类型"),
          fieldCode: "poTypeCodeMeaning",
        },
        {
          formRow: 2,
          fieldName: this.$T("slod.orderExecution.model.common.agentName").$D("采购员"),
          fieldCode: "agentName",
        },
        {
          formRow: 3,
          fieldName: this.$T("slod.orderExecution.model.common.purchaseOrgId").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          formRow: 4,
          fieldName: this.$T("slod.orderExecution.model.common.creationTime").$D("创建时间"),
          fieldCode: "creationDate",
        },
      ];
    },
    getButtons() {
      return [
        {
          text: $T("slod.orderExecution.view.option.feedback").$D("反馈"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (selected) => {
            this.$dialog({
              content: $T("slod.orderExecution.view.confirm.feedback").$D("是否确认反馈订单") + "?",
              onOk:async () => {
                const data = selected.map((i) => i.toData());
                const verificationRes = await this.toBeFedBackDs.executeTransport(this.toBeFedBackDs.transport.verification, {
                  data,
                });
                if (verificationRes && !verificationRes.failed) {
                  if (verificationRes.content && !isEmpty(verificationRes.content)) {
                    this.$popup({
                      showHeader:true,
                      rounded:true,
                      height:"75%",
                      content:<VerificationTable body={data} handleOk={this.handeleFeedback}></VerificationTable>,
                      title:this.$T("slod.orderExecution.view.confirm.feedback").$D("是否确认反馈订单") });
                  } else {
                    this.handeleFeedback();
                  }
                }
              },
            });
          }
        },
      ];
    }
  },
  activated() {
    this.fetchSettings();
    this.initValueSetAndQuery();
  },
  methods:{
    stopPropagation(e) {
      e.stopPropagation();
    },
    initValueSetAndQuery() {
      SrmUtil.getValueSetBatch({ actionMeaningMap: "SODR.SALES_ORDER_WORKBENCH_STATUS" }, this).then((res) => {
        if (res) {
          this.allDs = new DataSet(listDs("all", this));
          this.getDataSet.refresh();
        }
      });
    },
    fetchSettings() {
      fetchSettingApi().then((res) => {
        if (res && res["010219"]) {
          this.setting = res["010219"];
        }
      });
    },
    async handeleFeedback() {
      const { selected } = this.toBeFedBackDs;
      const needValidateUuid = this.setting === "1";
      const hasUuidLine = [];
      const noUuidLine = [];
      if (needValidateUuid) {
        selected.forEach((i) => {
          const data = i.toData();
          if (data.supplierAttachmentUuid) {
            hasUuidLine.push(data);
          } else {
            noUuidLine.push(data);
          }
        });
        if (!isEmpty(hasUuidLine)) {
          const uuidRes = await this.toBeFedBackDs.executeTransport(this.toBeFedBackDs.transport.validateUuid, {
            data: hasUuidLine.map((i) => i.supplierAttachmentUuid)
          });
          if (uuidRes && !uuidRes.failed) {
            Object.keys(uuidRes).forEach((i) => {
              if (!uuidRes[i]) {
                const currentLine = hasUuidLine.find((n) => n.supplierAttachmentUuid === i);
                if (currentLine) {
                  noUuidLine.push(currentLine);
                }
              }
            });
          }
        }
      }
      if (!needValidateUuid || isEmpty(noUuidLine)) {
        this.toBeFedBackDs.submitSelected();
      } else {
        this.$notification.open({
          type: "waring",
          message: this.$T("slod.orderExecution.view.message.accessoryNotNull", [ JSON.stringify(noUuidLine.map((i) => i.displayPoNum)) ]).$D("订单:{poNum}附件不能为空"),
          duration: 5,
        });
      }
    },
    onTabIndexChange(index, oldIndex, code) {
      this.type = code;
      this.getDataSet.refresh();
    },
    onItemClick(record) {
      this.$router.push({
        name: "SellerOrderWorkbenchDetail",
        query: { poHeaderId: record.get("poHeaderId"), type: this.type }
      });
    }
  },
};
</script>
<style lang="stylus" scoped>
.seller-order-bench-tab{
  >>> .srm-tab-bar-button-normal {
    min-width: 33.3%;
  }
}
.order-tooltip{
    margin-left: 8px
  }
</style>