import { SrmUtil, $T } from "srm-mobile-ui";
function commonDs () {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
  };
}

function lineInfoDs (id, params) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    queryParameter: {
      ...params
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldType: "SELECT",
        fieldName: $T("smdm.materielApplication.model.materiel.itemAllOrgFlag").$D("是否下发WMS"),
        fieldCode: "attributeVarchar13",
        displayField: "attributeVarchar13Meaning",
        lovCode: "HPFM.FLAG",
        required: false,
        editor: true,
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/{tenantId}/item-req/itemReqList/${id}`,
        method: "get",
      },
      update: {
        url: "/scux/v1/{tenantId}/item-req/itemReqUpdate-batch",
        method: "post",
      },
    },
    events: {
      afterQuery(ds, result) {
        // 是否下发WMS 值 修改
        result.map((res) => {
          res["attributeVarchar13"] = Number(res["attributeVarchar13"]);
          res["attributeVarchar13Meaning"] = res["attributeVarchar13"] === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否");
        });
      },
      beforeUpdate: (ds, data) => {
        // 是否下发WMS 值 恢复
        data.map((res) => {
          delete res["attributeVarchar13Meaning"];
          delete res["aiXueXiItemCategoryAssignReqList"];
          res["attributeVarchar13"] = String(res["attributeVarchar13"]);
          res["_status"] = "update";
        });
        return [ ...data ];
      },
    }
  };
}

export {
  commonDs,
  lineInfoDs,
};