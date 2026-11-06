import { http } from "srm-mobile-ui";

const storage = window.localStorage;

export function cancelInvoice(data) {
  return http.post(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-header/purchaser/cancel`,
    data
  );
}

export function checkInvoice(data) {
  return http.post(
    `ssta/v1/${storage.getItem("organizationId")}/invoice-header/batch-check`,
    data
  );
}

export function getHistory(id) {
  const params = {};
  return http.get(
    `/ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-action/${id}?invoiceHeaderId=${id}`,
    { params }
  );
}

export function ocrApi(data, camp) {
  return http.post(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-header/ocr-import/mobile?camp=${camp}`,
    data
  );
}

export function getHeaderApi(id, params) {
  return http.get(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-header/detail/${id}?invoiceHeaderId=${id}`,
    { params }
  );
}

export function getLineApi(id, params) {
  return http.get(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-line/${id}?invoiceHeaderId=${id}`,
    { params }
  );
}

export function editInvoiceApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem("organizationId")}/invoice-header/purchaser`,
    params
  );
}

export function createInvoiceApi(params) {
  return http.post(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-header/purchaser/mobile`,
    params
  );
}

export function uploadAttachApi(params) {
  return http.put(
    `ssta/v1/${storage.getItem(
      "organizationId"
    )}/invoice-header/upload-attachment`,
    params
  );
}

export function getAttachApi(id, bucketName) {
  return http.get(
    `/hfle/v1/${window.localStorage.organizationId}/files/${id}/file?attachmentUUID=${id}&bucketName=${bucketName}`
  );
}
