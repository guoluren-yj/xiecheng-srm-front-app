// 审批列表
import { SrmUtil, $T } from "srm-mobile-ui";

function purchaseRequisitionListDS() {
  return {
    autoQuery: true,
    pageSize: 10,
    selection: Infinity,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SRPM.PURCHAE_REQUISITION_APPROVE.LIST.FILTER,SRPM.PURCHAE_REQUISITION_APPROVE.LIST.GRID",
    },
    fastQueryField: {
      fieldCode: "displayPrNum",
      fieldType: "TEXT",
      fieldName: $T("sprm.common.modal.displayPrNum").$D("采购申请编号"),
    },
    queryFields: [ {
      fieldCode: "displayPrNum",
      fieldType: "INPUT",
      fieldName: $T("sprm.common.modal.displayPrNum").$D("采购申请编号"),
    }, {
      fieldName: $T("sprm.common.model.common.title").$D("标题"),
      fieldType: "INPUT",
      fieldCode: "title",
    }, {
      fieldName: $T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
      fieldType: "SELECT",
      fieldCode: "prSourcePlatform",
      lovCode: "SPRM.SRC_PLATFORM",
      options: {
        valueField: "value",
      }
    }, {
      fieldName: $T("sprm.common.model.common.createdName").$D("创建人"),
      fieldType: "INPUT",
      fieldCode: "prRequestedName",
    }, {
      fieldName: $T("sprm.common.model.common.creationDateFrom").$D("创建日期从"),
      fieldType: "DATE",
      timePicker: true,
      fieldCode: "creationDateFrom",
    }, {
      fieldName: $T("sprm.common.model.common.creationDateTo").$D("创建日期至"),
      fieldType: "DATE",
      timePicker: true,
      fieldCode: "creationDateTo",
    }, {
      fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
      fieldType: "LOV",
      fieldCode: "unitId",
      lovCode: "SPRM.USER_DEPARTMENT",
      options: {
        valueField: "unitId",
        displayField: "unitCode",
        subDisplayField: "unitName",
      }
    }, {
      fieldName: $T("sprm.common.model.common.prStatusCode").$D("状态"),
      fieldType: "SELECT",
      fieldCode: "approvalPendingStatus",
      lovCode: "SPRM.PR_APPROVAL_PENDING_STA",
      options: {
        valueField: "value",
      }
    } ],
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/approve`,
        method: "get",
      },
    }
  };
}

export {
  purchaseRequisitionListDS,
};