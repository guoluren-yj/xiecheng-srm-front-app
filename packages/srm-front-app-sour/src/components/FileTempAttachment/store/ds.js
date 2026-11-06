import { SrmUtil, $T } from "srm-mobile-ui";
import { isEmpty, noop, isFunction } from "lodash";

import { fetchAttTemplateDataByAttType } from "../api";

function fileTemplateAttachmentDs(props) {
  const {
    editorFlag = true,
    node = "CHECK",
    getHeaderFieldsValue = noop,
    getErrorMessage = noop
  } = props || {};
  return {
    autoQuery: false,
    editable: editorFlag,
    enableQuery: false,
    editFlag: editorFlag,
    paging: true,
    pageSize: 5,
    selection: Infinity,
    forceValidate: true,
    enableSelect: (record) => !record.get("requiredFlag") || !record.get("attachmentLineId"),
    fields: [
      {
        fieldCode: "attachmentType",
        fieldName: $T("ssrc.inquiryHall.model.fileTemplateAttachment.attachType").$D("附件类型"),
        fieldType: "LOV",
        lovCode: "SSRC.GET_ATTACHMENT_TYPE",
        displayField: "attachmentTypeMeaning",
        options: {
          multiple: false,
          displayField: "fieldName",
          valueField: "uniqueKey",
          queryParams: {
            page: null,
            pageSize: null,
            organizationId: localStorage.getItem("tenantId"),
            node,
            sourceCategory:  isFunction(getHeaderFieldsValue) ? (getHeaderFieldsValue() || {}).secondarySourceCategory : null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              const { uniqueKey, sourceNode } = val[0] || {};
              const { templateId } = isFunction(getHeaderFieldsValue) ? getHeaderFieldsValue() || {} : {};
              if (!templateId || !uniqueKey) {
                return;
              }
              const params = {
                sourceCategory: "RFX",
                templateId,
                attachmentType: uniqueKey,
                organizationId: SrmUtil.getTenantId(),
              };
              fetchAttTemplateDataByAttType(params).then((res) => {
                if (res && res.failed && isFunction(getErrorMessage)) {
                  getErrorMessage(res);
                } else if (isEmpty(res)) {
                  // 模板没有维护，数据为空
                  const sourceNodeField = ds.current.getField("sourceNode");
                  if (sourceNodeField) {
                    sourceNodeField.setData(sourceNode);
                  }
                  return;
                }
                // eslint-disable-next-line no-unused-vars
                const { attachmentType, ...others } = res || {}; // attachmentType 默认更新
                Object.keys(others).forEach((key) => {
                  const field = ds.current.getField(key);
                  if (field) {
                    field.setData(others[key]);
                  }
                });
              });
            }
          },
        },
        required(val, item) {
          const attachmentFrom = item && item.attachmentFrom;
          const flag = Boolean(editorFlag) && attachmentFrom !== "TEMPLATE";
          return flag;
        },
        disabled: (val, item) => {
          const attachmentFrom = item && item.attachmentFrom;
          const flag = attachmentFrom === "TEMPLATE" || !editorFlag;
          return flag;
        },
      },
      {
        // 虚拟字段
        fieldCode: "templateAttachment",
        fieldName: $T("ssrc.inquiryHall.model.fileTemplateAttachment.attachmentTemplate").$D("模板附件"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("ssrc.inquiryHall.model.fileTemplateAttachment.describeTemplate").$D("模板描述"),
        disabled: true,
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("ssrc.common.model.common.attachment").$D("附件"),
      },
      {
        fieldCode: "sourceNode",
        defaultValue: node,
      },
      {
        fieldCode: "fileManageId",
      },
    ],
    transport: {
      read: {
        url: `/ssrc/v1/${SrmUtil.getTenantId()}/attachment-lines/list`,
        method: "POST",
      },
    },
  };
}

export {
  fileTemplateAttachmentDs,
};