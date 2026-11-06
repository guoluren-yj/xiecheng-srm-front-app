import { SrmUtil } from "srm-mobile-ui";
// 基础信息DS
export const headerDS = () => ({
  autoQuery: false,
  editable: false,
  editFlag: false,
  enableQuery: false,
  selection: Infinity,
});

// 列表DS
export const lineDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  paging: true,
  pageSize: 10,
  hasMore: true,
  showTotalCount: false,
  queryParameter: {
    customizeUnitCode:
          "SMDM_MATERIELAPPLICATION_LIST.MATERIEL_LIST",
  },
  transport: {
    read: {
      url: `marmot/v1/${SrmUtil.getTenantId()}/marmot-api/W8LtictUd7LktFCMA7vibydPuibr2pvA21RqibFoIOvvlhsjEh3NzKkkh3XaIjA1MFEm`,
      method: "get",
    },
  },
});

export const popupCategoryDS = () => ({
  autoQuery: false,
  editable: false,
  enableQuery: false,
  paging: false,
  showTotalCount: false,
});