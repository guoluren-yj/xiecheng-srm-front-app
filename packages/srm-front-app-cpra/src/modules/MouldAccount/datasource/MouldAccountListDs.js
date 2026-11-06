/*
 * @Descripttion: 
 * @version: 
 * @Author: yanglin
 * @Date: 2024-02-21 17:08:46
 * @LastEditors: yanglin
 * @LastEditTime: 2024-02-22 17:00:06
 */
// 模具台账列表
import { SrmUtil, $T } from "srm-mobile-ui";

function mouldAccountListDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    selection: Infinity,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    filterCustomizeCode: "SMBL.MOULD_ACCOUNT.SEARCH",
    queryParameter: {
        maStatus_range: 'APPROVING_RL',
        customizeUnitCode: "SIEC.MOULD_PLATFORM.LIST.ACCTOUNT_FILTER,SIEC.MOULD_PLATFORM.LIST.ACCOUNT_LIST",
    },
    fastQueryField: {
      fieldCode: "multiSelectHeaderNums",
      fieldType: "TEXT",
      fieldName: $T("siec.mould.model.common.maNum").$D("模具台账单号"),
    },
    queryFields: [],
    transport: {
      read: {
        url: `/siec/v1/${SrmUtil.getTenantId()}/mould-account/list?maType=NORMAL&statusConfigId={statusConfigId}&customizeFilterComparison=maStatus:IN,companyId:%3D,mouldNum:LIKE,mouldName:LIKE,sourcePlatform:%3D,mouldOwner:%3D,effectiveTimeTo:%3C%3D,effectiveTimeFrom:%3E%3D,mouldPrincipalId:=,mouldType:=`,
        method: "get",
      },
    },
  };
}

function mouldAccountChangeListDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    selection: Infinity,
    editable: true,
    editFlag: false,
    enableQuery: true,
    data: [],
    showTotalCount: true,
    filterCustomizeCode: "SMBL.MOULD_ACCOUNT.SEARCH",
    queryParameter: {
      maStatus_range: 'APPROVING_CH',
      customizeUnitCode: "SIEC.MOULD_PLATFORM.LIST.CHANGE_FILTER,SIEC.MOULD_PLATFORM.LIST.CHANGE_LIST",
    },
    fastQueryField: {
      fieldCode: "maNum",
      fieldType: "TEXT",
      fieldName: $T("siec.mould.model.common.maNum").$D("模具台账单号"),
    },
    queryFields: [],
    transport: {
      read: {
        url: `/siec/v1/${SrmUtil.getTenantId()}/mould-account/list?maType=CHANGE&statusConfigId={statusConfigId}&customizeFilterComparison=maStatus:IN`,
        method: "get",
      },
    },
  };
}

export {
  mouldAccountListDs,
  mouldAccountChangeListDs,
};