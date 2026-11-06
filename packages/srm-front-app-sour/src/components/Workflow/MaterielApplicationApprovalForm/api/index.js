import { http, SrmUtil } from "srm-mobile-ui";

//
export const getItemReqsApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-reqs/${id}`;
  let params = {
    customizeUnitCode: "SMDM_MATERIELAPPLICATION_EDIT.ATTRIBUTE,SMDM_MATERIELAPPLICATION_EDIT.BASE",
    page: 0,
    size: 5,
  };
  return http.get(url, { params });
};

export const getItemAttributesApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-attribute-reqs/${id}`;
  let params = {
    customizeUnitCode: "SMDM_MATERIELAPPLICATION_ATTRIBUTETABL.EDITFORM,SMDM_MATERIELAPPLICATION_ATTRIBUTETABL.TABLE",
    page: 0,
    size: 5,
  };
  return http.get(url, { params });
};

export const getItemPartnerApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-partner-rel-reqs/${id}`;
  let params = {
    page: 0,
    size: 5,
  };
  return http.get(url, { params });
};

export const getItemCategoryAssignApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-category-assign-reqs/${id}`;
  let params = {
    page: 0,
    size: 5,
  };
  return http.get(url, { params });
};

export const getItemOrganizationApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-org-rel-reqs/${id}`;
  let params = {
    customizeUnitCode: "SMDM_MATERIELAPPLICATION_ORG.EDITFORM,SMDM_MATERIELAPPLICATION_ORG.TABLE",
    page: 0,
    size: 5,
  };
  return http.get(url, { params });
};

export const getItemAttachmentApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-attachment-reqs/${id}`;
  return http.get(url);
};

export const getItemOrganizationUomApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-org-uom-reqs/${id}`;
  return http.get(url);
};

export const getItemComponentsApi = (id) => {
  let url = `/smdm/v1/${SrmUtil.getTenantId()}/item-component-reqs/page/${id}`;
  let params = {
    customizeUnitCode: "SMDM_MATERIELAPPLICATION_COMPONENTTABLE.EDITFORM,SMDM_MATERIELAPPLICATION_COMPONENTTABLE.TABLE",
    page: 0,
    size: 5,
    organizationId: SrmUtil.getTenantId(),
  };
  return http.get(url, { params });
};

export const getUICustomizeApi = (codes) => {
  let url = `/hpfm/v1/${SrmUtil.getTenantId()}/ui-customize`;
  let params = {
    unitCode: codes,
  };
  return http.get(url, { params });
};