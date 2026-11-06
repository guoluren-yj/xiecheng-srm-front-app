import { $T, SrmUtil } from "srm-mobile-ui";
function indexDs (type) {
  const readUrlMap = {
    awaitSubmit: "/spcm/v1/{tenantId}/purchase-contract/edit/page",
    approving: "/spcm/v1/{tenantId}/purchase-contract/approval/page",
    approved: "/spcm/v1/{tenantId}/purchase-contract/purchase-sign/page",
    all: "/spcm/v1/{tenantId}/purchase-contract/purchase-view/page",
  };

  const readParamsMap = {
    approved: {
      workbenchFlag: 1,
      customizeUnitCode: "SPCM.WORKSPACE_TOBERELEASED.SERARCH2,SPCM.WORKSPACE_TOBERELEASED.LIST3",
    },
    all: {
      workbenchFlag: 1,
      customizeUnitCode: "SPCM.WORKSPACE_ALL.SERARCH2,SPCM.WORKSPACE_ALL.LIST",
    }
  };

  return {
    autoQuery: true,
    selection: type === "approved" ? 20 : 0,
    pageSize: 10,
    editable: true,
    enableQuery: true,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fastQueryField: {
      fieldCode: "multiPcNumOrTitle",
      fieldType: "TEXT",
      fieldName: $T("spcm.common.model.common.pcNum").$D("协议编号") + "、" + $T("spcm.common.model.common.pcName").$D("协议名称"),
    },
    queryFields: [
      {
        fieldCode: "allSupplierId",
        fieldType: "LOV",
        fieldName: $T("spcm.common.model.supplierCompanyId").$D("供应商"),
        lovCode: "SSLM.SUPPLIER_CHOOSE",
      },
      {
        fieldCode: "pcStatusSet",
        fieldType: "SELECT",
        fieldName: $T("spcm.common.model.common.pcStatusCode").$D("状态"),
        lovCode: type === "approved" ? "SPCM.PC_STATUS_TO_BE_SIGNED" : "SPCM.CONTRACT.STATUS.SEARCHBAR",
      },
      {
        fieldCode: "purchaseAgentId",
        fieldType: "LOV",
        fieldName: $T("spcm.common.model.agentName").$D("采购员"),
        lovCode: "SPFM.PURCHASE_ORG_AGENT",
        paramList:[ {
          paramType: "fixed",
          paramKey: "tenantId",
          paramValue: SrmUtil.getTenantId()
        } ]
      },
      {
        fieldCode: "attributeVarchar22",
        fieldType: "SELECT",
        fieldName: $T("scux.spcm.view.workspace.wuling.puchaseDepartment").$D("采购科室"),
        lovCode: "SGMW_PROCUREMENT_DEPARTMENT",
        options: {
          multiple: false,
        },
      },
    ],
    transport: {
      read: {
        url: readUrlMap[type],
        method: "get",
        params: readParamsMap[type]
      },
    },
  };
}

function commonDs ({ pcHeaderId, companyId, isChapter }) {
  return {
    autoQuery: true,
    selection: 0,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: `spcm/v1/{tenantId}/purchase-contract/${pcHeaderId}${isChapter ? "/" + companyId : ""}`,
        method: "get",
      },
    },
  };
}

function partnerDs ({ pcHeaderId }) {
  return {
    autoQuery: true,
    selection: 0,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: `spcm/v1/{tenantId}/purchase-contract/${pcHeaderId}/pc-partner/list`,
        method: "get",
      },
    },
  };
}

export {
  indexDs,
  commonDs,
  partnerDs,
};