import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.quatity.model.seq").$D("序号"),
        fieldCode: "seq",
      },
      {
        fieldName: $T("scux.quatity.model.itemCode").$D("图号"),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("scux.quatity.model.itemName").$D("零部件名称"),
        fieldCode: "itemName",
      },
      {
        fieldName: $T("scux.quatity.model.supplierCompanyNumMeaning").$D("供应商"),
        fieldCode: "supplierCompanyNumMeaning",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YWefnfnLm2eLR8jSLc52vHJtibIjQyXDHQBNqCMv7cNc`,
        method: "post",
        // body:{
        //   id: "1",
        //   type:'itemLineQuery'
        // }
      },
    },
  };
}

function developLineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 100,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.quatity.model.selectedFlag").$D("选择项目"),
        fieldCode: "selectedFlag",
      },
      {
        fieldName: $T("scux.quatity.model.projectMeaning").$D("项目"),
        fieldCode: "projectMeaning",
        //lookupCode: 'SCUX_JIANJI_IC_LINE_RESEARCH_STAGE_PROJECT',
      },
      {
        fieldName:$T("scux.quatity.model.projectContent").$D("内容填写"),
        fieldCode: "projectContent",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YWefnfnLm2eLR8jSLc52vOuaWd1fx7A8OnnoVyEeuCic3Z7F1H0iaAVCN7WPlYaqbU`,
        method: "post",
        // body:{
        //   id: "1",
        //   type:'itemLineQuery'
        // }
      },
    },
  };
}

function qualityLineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 100,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.quatity.model.selectedFlag").$D("选择项目"),
        fieldCode: "selectedFlag",
      },
      {
        fieldName: $T("scux.quatity.model.projectMeaning").$D("项目"),
        fieldCode: "projectMeaning",
        //lookupCode: 'SCUX_JIANJI_IC_LINE_RESEARCH_STAGE_PROJECT',
      },
      {
        fieldName:$T("scux.quatity.model.projectContent").$D("内容填写"),
        fieldCode: "projectContent",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YWefnfnLm2eLR8jSLc52vD4hrQumo8JviaBXg3JQ0EZJQWPvGvLFEF0vGEShnBZMB`,
        method: "post",
        // body:{
        //   id: "1",
        //   type:'itemLineQuery'
        // }
      },
    },
  };
}
export { lineInfoDs, developLineInfoDs, qualityLineInfoDs };
