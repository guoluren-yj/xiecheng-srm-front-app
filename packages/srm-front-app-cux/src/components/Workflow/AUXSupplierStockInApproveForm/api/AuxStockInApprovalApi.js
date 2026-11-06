
import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取入库单据信息
export const getStockInOrderInfo = (auxStockHId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-supplier-stock-hs/${auxStockHId}`;

  let params = { auxStockHId, page: 0, size: 1000 };

  return http.get(url, { params });
};

// 获取入库单行信息
export const getStockInLineInfo = (auxStockHId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-supplier-stock-ls/${auxStockHId}`;

  let params = { auxStockHId, page: 0, size: 1000 };

  return http.get(url, { params });
};

export const getLovTypeMeaning = (lovCode) => {
  const url = `/hpfm/v1/${storage.getItem("organizationId")}/lovs/data`;

  let params = { lovCode, };

  return http.get(url, { params });
};

// 获取准入单详细
export const getZrLinesDetails = (auxZrHeaderId) => {
  const url = `/scux/v1/${storage.getItem("organizationId")}/aux-supplier-zr-lines/${auxZrHeaderId}`;

  let params = { auxZrHeaderId, page: 0, size: 1000 };

  return http.get(url, { params });
};
