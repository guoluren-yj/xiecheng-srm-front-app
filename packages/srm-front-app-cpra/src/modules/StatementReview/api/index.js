import { http } from "srm-mobile-ui";
import { detailCustomizeUnit } from "../datasource/indexDs";
import { supDetailCustomizeUnit } from "../datasource/indexDsBySupplier";

const storage = window.localStorage;

export function getHeaderApi(params) {
  return http.get(
    `ssta/v1/${storage.getItem("organizationId")}/bill-headers/detail`,
    { params }
  );
}

export function getLineApi(id, params) {
  return http.get(
    `ssta/v1/${storage.getItem("organizationId")}/bill-lines/${id}`,
    { params }
  );
}

export function getHistory(id) {
  const params = {};
  return http.get(
    `/ssta/v1/${storage.getItem("organizationId")}/bill-actions/${id}`,
    { params }
  );
}

export function getLineInfoBillApi(id, lineId) {
  return http.get(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-lines/detail-for-bill/${id}/${lineId}`,
    {
      customizeUnitCode:
        "SSTA.PURCHASER_BILL_DETAIL_DRAWER.BILL_INFO,SSTA.PURCHASER_BILL_DETAIL_DRAWER.BILL_RULE,SSTA.PURCHASER_BILL_DETAIL_DRAWER.INVOICE_INFO,SSTA.PURCHASER_BILL_DETAIL_DRAWER.PAYMENT_INFO,SSTA.PURCHASER_BILL_DETAIL_DRAWER.SETTLE_DATA_RULE,SSTA.PURCHASER_BILL_DETAIL_DRAWER.TRADING_PARTY,SSTA.PURCHASER_BILL_DETAIL_DRAWER.TRANSACTION_AFFAIR,SSTA.PURCHASER_BILL_DETAIL_DRAWER.TRANSACTION_AMOUNT",
    }
  );
}
export function getLineInfoSettleApi(id) {
  return http.get(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/settle-config/current-config-by-id/${id}`,
    {
      customizeUnitCode:
        "SSTA.PURCHASER_BILL_DETAIL_DRAWER.BILL_INFO,SSTA.PURCHASER_BILL_DETAIL_DRAWER.BILL_RULE,SSTA.PURCHASER_BILL_DETAIL_DRAWER.INVOICE_INFO,SSTA.PURCHASER_BILL_DETAIL_DRAWER.PAYMENT_INFO,SSTA.PURCHASER_BILL_DETAIL_DRAWER.SETTLE_DATA_RULE,SSTA.PURCHASER_BILL_DETAIL_DRAWER.TRADING_PARTY,SSTA.PURCHASER_BILL_DETAIL_DRAWER.TRANSACTION_AFFAIR,SSTA.PURCHASER_BILL_DETAIL_DRAWER.TRANSACTION_AMOUNT",
    }
  );
}

export function returnApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/purchaser/return-back?customizeUnitCode=${detailCustomizeUnit}`,
    params
  );
}
export function confirmApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/purchaser/confirm?customizeUnitCode=${detailCustomizeUnit}`,
    params
  );
}
export function cancelApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/purchaser/cancel?customizeUnitCode=${detailCustomizeUnit}`,
    params
  );
}
export function syncApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem("organizationId")}/bill-headers/purchaser/sync`,
    params
  );
}
export function submitApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/purchaser/submit?customizeUnitCode=${detailCustomizeUnit}`,
    params
  );
}
export function saveApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/purchaser?customizeUnitCode=${detailCustomizeUnit}`,
    params
  );
}
export function returnSupplierApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/supplier/return-back?customizeUnitCode=${supDetailCustomizeUnit}`,
    params
  );
}
export function confirmSupplierApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/supplier/confirm?customizeUnitCode=${supDetailCustomizeUnit}`,
    params
  );
}
export function cancelSupplierApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/supplier/cancel?customizeUnitCode=${supDetailCustomizeUnit}`,
    params
  );
}
export function submitSupplierApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/supplier/submit?customizeUnitCode=${supDetailCustomizeUnit}`,
    params
  );
}
export function saveSupplierApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/bill-headers/supplier?customizeUnitCode=${supDetailCustomizeUnit}`,
    params
  );
}
