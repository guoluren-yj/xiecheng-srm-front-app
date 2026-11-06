import { http } from "srm-mobile-ui";

// 资质查询
export const fetchQualification = (params) => {
  const url = `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/dH7a798CZU44N89CzurIcX8JLeZkf2o16Ria5nhSoAPg4L2FsgFas0u0gxyHRrrS9`;
  return http.get(url, { params });
};

// 资质查询 - 明细查询
export const fetchMaterialQualification = (params) => {
  const url = `/marmot/v1/${localStorage.getItem("organizationId")}/marmot-api/dH7a798CZU44N89CzurIcchDKG5ia04jibkZNkmvez3MiaHbkgtE5na5C72VK9orkxl`;
  return http.get(url, { params });
};

// 资质查询 - 采购方lov查询
export const fetchLovParams = (params) => {
  const url = `/hpfm/v1/${localStorage.getItem("organizationId")}/lovs/data`;
  return http.get(url, { params });
};