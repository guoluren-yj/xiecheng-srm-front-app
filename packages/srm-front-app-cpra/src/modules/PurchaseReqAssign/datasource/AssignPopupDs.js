/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-04 16:39:37
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-13 11:54:58
 */
// 分配列表
import { $T } from "srm-mobile-ui";

function assignPopupDS(config) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: true,
    editFlag: true,
    enableQuery: false,
    fields: [
      {
        fieldCode: "purchaseAgentId",
        fieldName: $T("sprm.purchaseRequisitionAssign.modal.purchaseAgentName").$D("采购员"),
        fieldType: "LOV",
        lovCode: "SPUC.PURCHASE_AGENT",
        required: true,
        displayField: "purchaseAgentName",
        options: {
          subDisplayField: "purchaseAgentName",
          valueField: "purchaseAgentId",
          queryParams: {
            purchaseOrgIds: config.purchaseOrgIds,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("purchaseAgentName", val[0].purchaseAgentName);
              ds.current.setField("purchaseAgentId", val[0].purchaseAgentId);
            }
          },
          onClear: (ds) => {
            ds.current.setField("purchaseAgentId", null);
            ds.current.setField("purchaseAgentName", null);
          }
        },
      },
      {
        fieldCode: "executedBys",
        fieldName: $T("sprm.common.model.common.handlePerson").$D("需求执行人"),
        fieldType: "LOV",
        lovCode: "SSLM.KPI_USER",
        maxLength: 120,
        displayField: "executorName",
        disabled: (val, item) => !item.purchaseAgentId,
        options: {
          multiple: true,
          queryParams: {
            purchaseOrgIds: config.purchaseOrgIds,
          },
        },
      },
      {
        fieldCode: "executionStrategyCode",
        fieldName: $T("sprm.common.model.common.executionStrategyCode").$D("执行策略"),
        fieldType: "SELECT",
        lovCode:  config.isOldUser ? "SPRM.EXECUTION_STRATEGY_OLD" : "SPRM.EXECUTION_STRATEGY",
        disabled: config.allTransferFlag && config.page !== "allPage",
        required: config.setting === "1" && !config.allTransferFlag,
        visible: config.setting === "1",
        displayField: "executionStrategyMeaning",
        options: {
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("executionStrategyCode", val[0].value);
              ds.current.setField("executionStrategyMeaning", val[0].meaning);
              if (val[0].value === "ORDER") {
                ds.current.setField("secondLevelStrategyCode", null);
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("executionStrategyCode", null);
            ds.current.setField("executionStrategyMeaning", null);
          }
        },
      },
      {
        fieldCode: "secondLevelStrategyCode",
        fieldName: $T("sprm.common.model.common.secondLevelStrategyCode").$D("寻源二级链路"),
        fieldType: "SELECT",
        lovCode:  config.isShowNewBid ? "SPRM.SECOND_LEVEL_STRATEGY" : "SPRM.SECOND_LEVEL_STRATEGY_OLD",
        displayField: "secondLevelStrategyMeaning",
        disabled: (val, item) => item.executionStrategyCode === "ORDER",
        visible: (val, item) => config.setting === "1" && !config.isOldUser && item.executionStrategyCode !== "ORDER",
      },
      {
        fieldCode: "assignedRemark",
        fieldName: $T("sprm.purchaseRequisitionAssign.model.common.assignedRemark").$D("分配说明"),
        fieldType: "INPUT",
      },
    ],
    // transport: {
    //   read: {
    //     url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-request/line/can-assign/page`,
    //     method: "get",
    //   },
    // },
  };
}

export {
  assignPopupDS,
};