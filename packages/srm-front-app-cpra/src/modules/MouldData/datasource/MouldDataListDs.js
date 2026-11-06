// 模具主数据列表
import { SrmUtil, $T } from "srm-mobile-ui";

function mouldDataListDS() {
  return {
    autoQuery: false,
    pageSize: 10,
    selection: Infinity,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    filterCustomizeCode: "SMBL.MOULD_DATA.SEARCH",
    queryParameter: {
        mouldStatus: 'CHANGE_APPROVING',
        customizeUnitCode: "SIEC.MOULD_DATA.LIST.SEARCH_BAR,SIEC.MOULD_DATA.LIST.LIST",
    },
    fastQueryField: {
      fieldCode: "mouldNum",
      fieldType: "TEXT",
      fieldName: $T("siec.mould.model.common.mouldNum").$D("模具编码"),
    },
    queryFields: [],
    transport: {
      read: {
        url: `/siec/v1/${SrmUtil.getTenantId()}/mould/list?statusConfigId={statusConfigId}&customizeFilterComparison=mouldStatus:=,mouldName:LIKE,companyId:%3D,mouldType:%3D,sourcePlatform:%3D,mouldOwner:%3D,mouldPrincipalId:%3D,creationDate:~`,
        method: "get",
      },
    },
  };
}

export {
    mouldDataListDS,
};