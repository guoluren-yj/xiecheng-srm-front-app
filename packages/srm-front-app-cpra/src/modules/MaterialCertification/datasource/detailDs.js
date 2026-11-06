import { $T, SrmUtil } from "srm-mobile-ui";

const commonPrompt = "smdm.common.model.common";

function headerInfoDS ({ isFirstNode, readOnly }) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 1000,
    editable: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "reqHeaderNum",
        fieldName: $T(`${commonPrompt}.reqHeaderNum`).$D("物料认证单号"),
        disabled: true,
      },
      {
        fieldCode: "createdByName",
        fieldName: $T(`${commonPrompt}.createdByName`).$D("创建人"),
        disabled: true,
      },
      {
        fieldCode: "creationDate",
        fieldName: $T(`${commonPrompt}.creationDate`).$D("创建时间"),
        disabled: true,
      },
      {
        fieldCode: "externalNum",
        fieldName: $T(`${commonPrompt}.externalNum`).$D("申请单外部流程编码"),
        disabled: true,
      },
      {
        fieldCode: "feeExternalNum",
        disabled: true,
        fieldName: $T(`${commonPrompt}.feeExternalNum`).$D("反馈单外部流程编码"),
      },
      {
        fieldCode: "certificationConclusion",
        formRow: 130,
        fieldName: $T(`${commonPrompt}.certificationConclusion`).$D("认证结论"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T(`${commonPrompt}.company`).$D("公司"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.COMPANY",
        options: {
          displayField: "companyName",
          subDisplayField: "companyNum",
          valueField: "companyName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            enabledFlag: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("companyName", val[0].companyName);
              ds.current.setField("companyId", val[0].companyId);
              ds.current.getField("displaySupplierName").options.queryParams["companyId"] = val[0].companyId;
            }
          },
          onClear: (ds) => {
            ds.current.setField("companyName", null);
            ds.current.setField("companyId", null);
            ds.current.getField("displaySupplierName").options.queryParams["companyId"] = null;
          }
        },
        disabled: (val, item) => !([ "PENDING", "REJECTED" ].includes(item.authReqStatusCode) && item.sourcePlatform === "SRM" && isFirstNode),
        required: !readOnly,
      },
      {
        fieldCode: "displaySupplierName",
        fieldName: $T(`${commonPrompt}.supplier`).$D("供应商"),
        fieldType: "LOV",
        lovCode: "SPRM.SUPPLIER",
        options: {
          displayField: "displaySupplierName",
          subDisplayField: "supplierCompanyNum",
          valueField: "displaySupplierName",
          queryParams: {
            enabledFlag: 1,
            companyId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("supplierId", val[0].supplierId);
              ds.current.setField("supplierCode", val[0].supplierNum);
              ds.current.setField("supplierName", val[0].supplierName);
              ds.current.setField("supplierCompanyId", val[0].supplierCompanyId);
              ds.current.setField("supplierCompanyName", val[0].supplierCompanyName);
              ds.current.setField("supplierCompanyCode", val[0].supplierCompanyNum);
              ds.current.setField("displaySupplierName", val[0].displaySupplierName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("supplierId", null);
            ds.current.setField("supplierCode", null);
            ds.current.setField("supplierName", null);
            ds.current.setField("supplierCompanyId", null);
            ds.current.setField("supplierCompanyName", null);
            ds.current.setField("supplierCompanyCode", null);
            ds.current.setField("displaySupplierName", null);
          }
        },
        disabled: (val, item) => !([ "PENDING", "REJECTED" ].includes(item.authReqStatusCode) && item.sourcePlatform === "SRM" && isFirstNode),
      },
      {
        fieldCode: "categoryName",
        fieldName: $T(`${commonPrompt}.category`).$D("采购品类"),
        fieldType: "LOV",
        lovCode: "SMDM.CATEGORY.LEVEL_CONTROL_TREE",
        options: {
          displayField: "categoryName",
          subDisplayField: "categoryName",
          valueField: "categoryId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
            businessObjectCode: "SRM_C_SMDM_ITEM_AUTH_REQ",
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("categoryId", val[0].categoryId);
              ds.current.setField("categoryName", val[0].categoryName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("categoryId", null);
            ds.current.setField("categoryName", null);
          }
        },
        disabled: (val, item) => !([ "PENDING", "REJECTED" ].includes(item.authReqStatusCode) && isFirstNode),
      },
      {
        fieldCode: "unitName",
        fieldName: $T(`${commonPrompt}.department`).$D("部门"),
        fieldType: "LOV",
        lovCode: "SPRM.USER_UNIT",
        options: {
          displayField: "unitName",
          subDisplayField: "unitName",
          valueField: "unitName",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("unitId", val[0].unitId);
              ds.current.setField("unitName", val[0].unitName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("unitId", null);
            ds.current.setField("unitName", null);
          }
        },
        disabled: (val, item) => !([ "PENDING", "REJECTED" ].includes(item.authReqStatusCode) && isFirstNode),
      },
      {
        fieldCode: "itemAuthReqHeaderMRList",
        displayField: "itemAuthReqHeaderMRListMeaning",
        fieldName: $T(`${commonPrompt}.messageReminderNames`).$D("消息提醒人"),
        fieldType: "LOV",
        multiple: true,
        lovCode: "SMDM.ITEM_AUTH_NODE_ATT_USER'",
        options: {
          multiple: true,
          displayField: "userName",
          subDisplayField: "userName",
          valueField: "userId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("itemAuthReqHeaderMRList", val);
              ds.current.setField("itemAuthReqHeaderMRListMeaning", val.map((ele) => ele.userName).join());
            }
          },
          onClear: (ds) => {
            ds.current.setField("itemAuthReqHeaderMRList", null);
            ds.current.setField("itemAuthReqHeaderMRListMeaning", null);
          }
        },
        disabled: (val, item) => !([ "PENDING", "REJECTED" ].includes(item.authReqStatusCode) && isFirstNode),
      },
      {
        fieldCode: "prTypeName",
        fieldName: $T(`${commonPrompt}.prType`).$D("采购申请类型"),
        fieldType: "LOV",
        lovCode: "SPUC.PR_DEMAND_TYPE",
        options: {
          displayField: "prTypeName",
          subDisplayField: "prTypeName",
          valueField: "prTypeId",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("prTypeId", val[0].prTypeId);
              ds.current.setField("prTypeName", val[0].prTypeName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("prTypeId", null);
            ds.current.setField("prTypeName", null);
          }
        },
        disabled: (val, item) => !([ "PENDING", "REJECTED" ].includes(item.authReqStatusCode) && isFirstNode),
      },
      {
        fieldCode: "authReqStatusCodeMeaning",
        fieldName: $T("hzero.common.common.status").$D("状态"),
        disabled: true,
      },
      {
        fieldCode: "sourcePlatformMeaning",
        fieldName: $T(`${commonPrompt}.source`).$D("来源"),
        disabled: true,
      },
      {
        fieldCode: "strategyName",
        fieldName: $T(`${commonPrompt}.materialAuthStrategy`).$D("物料认证策略"),
        disabled: true,
      },
      {
        fieldCode: "remark",
        fieldName: $T(`${commonPrompt}.remark`).$D("备注"),
        disabled: true,
      },
      {
        fieldCode: "exportExternalStatusCodeMeaning",
        fieldName: $T(`${commonPrompt}.exportExternalStatusCode`).$D("物料认证完成导出外部状态"),
      },
      {
        fieldCode: "exportExternalErrorReason",
        fieldName: $T(`${commonPrompt}.exportExternalErrorReason`).$D("物料认证完成导出失败原因"),
        disabled: true,
      },
      {
        fieldCode: "sampleType",
        disabled: true,
        fieldName: $T(`${commonPrompt}.sampleType`).$D("送样类型"),
      },
      {
        fieldCode: "receivingDepartmentName",
        fieldName: $T(`${commonPrompt}.receivingDepartment`).$D("接收部门"),
        disabled: true,
        fieldType: "LOV",
        lovCode: "SMDM.ITEM_AUTH_RECEIVING_DEPA",
        options: {
          displayField: "receivingDepartmentName",
          subDisplayField: "receivingDepartmentName",
          valueField: "unitId",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, ds) => {
            if (val && val[0]) {
              ds.current.setField("receivingDepartmentId", val[0].unitId);
              ds.current.setField("receivingDepartmentName", val[0].unitName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("receivingDepartmentId", null);
            ds.current.setField("receivingDepartmentName", null);
          }
        },
      },
      {
        fieldCode: "sampleRecipient",
        fieldName: $T(`${commonPrompt}.sampleRecipient`).$D("接样人"),
      },
      {
        fieldCode: "recipientContactNumber",
        numberGrouping: false,
        fieldName: $T(`${commonPrompt}.recipientContactNumber`).$D("接样人联系电话"),
        disabled: true,
      },
      {
        fieldCode: "sampleDeliveryAddress",
        fieldName: $T(`${commonPrompt}.sampleDeliveryAddress`).$D("接样地址"),
        disabled: true,
      },
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "smdm/v1/{tenantId}/item-auth-req-headers/{itemAuthReqHeaderId}",
        method: "get",
      },
    },
    events: {
      // 查询数据后操作
      afterQuery(ds, result) {
        result.map((res) => {
          res["itemAuthReqHeaderMRListMeaning"] = res.itemAuthReqHeaderMRList.map((ele) => ele.userName).join();
        });
      },
    },
  };
}

function detailInfoDS (readOnly) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "reqLineNum",
        fieldName: $T(`${commonPrompt}.lineNum`).$D("行号"),
        disabled: true,
      },
      {
        fieldCode: "categoryName",
        fieldName: $T(`${commonPrompt}.materialCategory`).$D("物料品类"),
        fieldType: "LOV",
        lovCode: "SMDM.CATEGORY.LEVEL_CONTROL_TREE",
        options: {
          displayField: "categoryName",
          subDisplayField: "categoryName",
          valueField: "categoryId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
            businessObjectCode: "SRM_C_SMDM_ITEM_AUTH_REQ",
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("categoryId", val[0].categoryId);
              ds.current.setField("categoryName", val[0].categoryName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("categoryId", null);
            ds.current.setField("categoryName", null);
          }
        },
        disabled: (val, item) => !item.itemAuthReqLineId,
      },
      {
        fieldCode: "itemCode",
        fieldName: $T(`${commonPrompt}.itemCode`).$D("物料编码"),
        disabled: true,
      },
      {
        fieldCode: "itemName",
        fieldName: $T(`${commonPrompt}.itemName`).$D("物料名称"),
        fieldType: "INPUT",
        required: (val, item) => !readOnly && !item.formalItemCode,
      },
      {
        fieldCode: "formalItemCode",
        fieldName: $T(`${commonPrompt}.formalItemCode`).$D("正式物料编码"),
        fieldType: "LOV",
        lovCode: "SPRM.ITEM_RELATE_PUR_PRICE",
        options: {
          displayField: "itemCode",
          subDisplayField: "itemCode",
          valueField: "itemCode",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("formalItemCode", val[0].itemCode);
              ds.current.setField("formalItemId", val[0].itemId);
              ds.current.setField("formalItemName", val[0].itemName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("formalItemCode", null);
            ds.current.setField("formalItemId", null);
            ds.current.setField("formalItemName", null);
          }
        },
        disabled: (val, item) => !item.itemAuthReqLineId,
        required: (val, item) => !readOnly && !item.itemName,
      },
      {
        fieldCode: "formalItemName",
        fieldName: $T(`${commonPrompt}.formalItemName`).$D("正式物料名称"),
        fieldType: "INPUT",
        required: (val, item) => !readOnly && Boolean(item.formalItemCode),
      },
      {
        fieldCode: "quantity",
        fieldName: $T(`${commonPrompt}.neededQuantity`).$D("需求数量"),
        fieldType: "INPUT_NUMBER",
        required: !readOnly,
      },
      {
        fieldCode: "uomName",
        fieldName: $T(`${commonPrompt}.uomName`).$D("单位"),
        fieldType: "LOV",
        lovCode: "SMDM.DUAL_UOM_ID",
        options: {
          displayField: "uomName",
          subDisplayField: "uomName",
          valueField: "uomId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("uomId", val[0].uomId);
              ds.current.setField("uomName", val[0].uomName);
              ds.current.setField("uomCode", val[0].uomCode);
              ds.current.setField("uomCodeAndName", val[0].uomCodeAndName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("uomId", null);
            ds.current.setField("uomName", null);
            ds.current.setField("uomCode", null);
            ds.current.setField("uomCodeAndName", null);
          }
        },
      },
      {
        fieldCode: "neededDate",
        fieldName: $T(`${commonPrompt}.neededDate`).$D("需求日期"),
        fieldType: "DATE",
        required: !readOnly,
      },
      {
        fieldCode: "poNum",
        fieldName: $T(`${commonPrompt}.poNum`).$D("订单单号"),
      },
      {
        fieldCode: "sourceNum",
        fieldName: $T(`${commonPrompt}.sourceNum`).$D("寻源单号"),
      },
      {
        fieldCode: "sourcePrice",
        fieldName: $T(`${commonPrompt}.sourcePrice`).$D("寻源价格"),
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T(`${commonPrompt}.purchaseAttachment`).$D("采购方附件"),
        required: (val, item) => !readOnly && String(item.attachmentRequiredFlag) === "1",
        render: (val, item) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  required: !readOnly && String(item.attachmentRequiredFlag) === "1",
                  readOnly,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "supplierAttRequiredFlag",
        fieldName: $T(`${commonPrompt}.supplierAttRequiredFlag`).$D("供应商附件必传"),
      },
      {
        fieldCode: "supplierAttachmentUuid",
        fieldName: $T(`${commonPrompt}.supplierAttachment`).$D("供应商附件"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: true,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "nodeAttachmentUuid",
        fieldName: $T(`${commonPrompt}.templateDownload`).$D("模版下载"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: true,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "certificationConclusion",
        formRow: 130,
        fieldName: $T(`${commonPrompt}.certificationConclusion`).$D("认证结论"),
      },
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "smdm/v1/{tenantId}/item-auth-req-lines/{itemAuthReqHeaderId}",
        method: "get",
      },
    },
  };
}

function stageInfoDS (readOnly) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "attachmentCode",
        fieldName: $T(`${commonPrompt}.attachmentCode`).$D("附件编码"),
        required: !readOnly,
      },
      {
        fieldCode: "attachmentName",
        fieldName: $T(`${commonPrompt}.attachmentName`).$D("附件名称"),
        required: !readOnly,
      },
      {
        fieldCode: "requiredFlag",
        fieldName: $T(`${commonPrompt}.purchaseRequiredUpload`).$D("采购方附件必传"),
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG",
        required: !readOnly,
      },
      {
        fieldCode: "supplierAttRequiredFlag",
        fieldName: $T(`${commonPrompt}.supplierAttRequiredFlag`).$D("供应商附件必传"),
        fieldType: "SELECT",
        lovCode: "HPFM.FLAG",
        required: !readOnly,
      },
      {
        fieldCode: "requireUploadDate",
        fieldName: $T(`${commonPrompt}.requireUploadDate`).$D("要求上传时间"),
        required: !readOnly,
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T(`${commonPrompt}.purchaseAttachment`).$D("采购方附件"),
        render: (val, item) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  required: !readOnly && String(item.requiredFlag) === "1",
                  readOnly: readOnly,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "supplierAttachmentUuid",
        fieldName: $T(`${commonPrompt}.supplierAttachment`).$D("供应商附件"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: readOnly,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "nodeAttachmentUuid",
        fieldName: $T(`${commonPrompt}.templateDownload`).$D("模版下载"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: readOnly,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "smdm/v1/{tenantId}/item-auth-req-header-atts/{itemAuthReqHeaderId}",
        method: "get",
      },
    },
  };
}

function sampleInfoDs(readOnly) {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 5,
    editable: false,
    editFlag: false,
    enableQuery: false,
    forceValidate: true,
    fields: [
      {
        fieldCode: "feeSampleNum",
        fieldName: $T(`${commonPrompt}.lineNum`).$D("行号"),
        disabled: true,
      },
      {
        fieldCode: "categoryName",
        fieldName: $T(`${commonPrompt}.materialCategory`).$D("物料品类"),
        fieldType: "LOV",
        lovCode: "SMDM.CATEGORY.LEVEL_CONTROL_TREE",
        options: {
          displayField: "categoryName",
          subDisplayField: "categoryName",
          valueField: "categoryId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
            businessObjectCode: "SRM_C_SMDM_ITEM_AUTH_REQ",
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("categoryId", val[0].categoryId);
              ds.current.setField("categoryName", val[0].categoryName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("categoryId", null);
            ds.current.setField("categoryName", null);
          }
        },
        disabled: (val, item) => !item.itemAuthReqLineId,
      },
      {
        fieldCode: "itemCode",
        fieldName: $T(`${commonPrompt}.itemCode`).$D("物料编码"),
        disabled: true,
      },
      {
        fieldCode: "itemName",
        fieldName: $T(`${commonPrompt}.itemName`).$D("物料名称"),
        fieldType: "INPUT",
        required: (val, item) => !readOnly && !item.formalItemCode,
      },
      {
        fieldCode: "formalItemCode",
        fieldName: $T(`${commonPrompt}.formalItemCode`).$D("正式物料编码"),
        fieldType: "LOV",
        lovCode: "SPRM.ITEM_RELATE_PUR_PRICE",
        options: {
          displayField: "itemCode",
          subDisplayField: "itemCode",
          valueField: "itemCode",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("formalItemCode", val[0].itemCode);
              ds.current.setField("formalItemId", val[0].itemId);
              ds.current.setField("formalItemName", val[0].itemName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("formalItemCode", null);
            ds.current.setField("formalItemId", null);
            ds.current.setField("formalItemName", null);
          }
        },
        disabled: (val, item) => !item.itemAuthReqLineId,
        required: (val, item) => !readOnly && !item.itemName,
      },
      {
        fieldCode: "formalItemName",
        fieldName: $T(`${commonPrompt}.formalItemName`).$D("正式物料名称"),
        fieldType: "INPUT",
        required: (val, item) => !readOnly && Boolean(item.formalItemCode),
      },
      {
        fieldCode: "quantity",
        fieldName: $T(`${commonPrompt}.sampleNeededQuantity`).$D("送样需求数量"),
        fieldType: "INPUT_NUMBER",
        required: !readOnly,
      },
      {
        fieldCode: "uomName",
        fieldName: $T(`${commonPrompt}.uomName`).$D("单位"),
        fieldType: "LOV",
        lovCode: "SMDM.DUAL_UOM_ID",
        options: {
          displayField: "uomName",
          subDisplayField: "uomName",
          valueField: "uomId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("uomId", val[0].uomId);
              ds.current.setField("uomName", val[0].uomName);
              ds.current.setField("uomCode", val[0].uomCode);
              ds.current.setField("uomCodeAndName", val[0].uomCodeAndName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("uomId", null);
            ds.current.setField("uomName", null);
            ds.current.setField("uomCode", null);
            ds.current.setField("uomCodeAndName", null);
          }
        },
      },
      {
        fieldCode: "neededDate",
        fieldName: $T(`${commonPrompt}.sampleNeededDate`).$D("送样需求日期"),
        fieldType: "DATE",
        required: !readOnly,
      },
      {
        fieldCode: "expectedDeliveryDate",
        fieldName: $T(`${commonPrompt}.expectedDeliveryDate`).$D("预计送达日期"),
        fieldType: "DATE",
        required: !readOnly,
      },
      {
        fieldCode: "sampleDeliveryMethod",
        fieldName: $T(`${commonPrompt}.sampleDeliveryMethod`).$D("送样方式"),
        required: !readOnly,
      },
      {
        fieldCode: "logisticsTrackingNum",
        fieldName: $T(`${commonPrompt}.logisticsTrackingNum`).$D("物流单号"),
        required: !readOnly,
      },
      {
        fieldCode: "testingDepartmentName",
        fieldName: $T(`${commonPrompt}.testingDepartmentId`).$D("检测部门"),
        fieldType: "LOV",
        lovCode: "SMDM.ITEM_AUTH_TESTING_DEPA",
        options: {
          displayField: "unitName",
          subDisplayField: "unitName",
          valueField: "unitId",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("testingDepartmentId", val[0].unitId);
              ds.current.setField("testingDepartmentName", val[0].unitName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("testingDepartmentId", null);
            ds.current.setField("testingDepartmentName", null);
          }
        },
      },
      {
        fieldCode: "poNum",
        fieldName: $T(`${commonPrompt}.poNum`).$D("订单单号"),
      },
      {
        fieldCode: "supplierAttachmentUuid",
        fieldName: $T(`${commonPrompt}.supplierAttachment`).$D("供应商附件"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: true,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T(`${commonPrompt}.purchaseAttachment`).$D("采购方附件"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: true,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "nodeAttachmentUuid",
        fieldName: $T(`${commonPrompt}.nodeAttachmentUuid`).$D("模板下载"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("hipspfm.common.button.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                  readOnly: true,
                  bucketName: "private-bucket",
                },
              ]}
              show-total
              title={$T("hipspfm.common.button.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "purchaserRemark",
        fieldName:  $T(`${commonPrompt}.purchaserRemark`).$D("采购方备注"),
      },
      {
        fieldCode: "testingResult",
        fieldName: $T(`${commonPrompt}.testingResult`).$D("检测结果"),
      },
      {
        fieldCode: "testingInstructions",
        fieldName: $T(`${commonPrompt}.testingInstructions`).$D("检测说明"),
      },
      {
        fieldCode: "testingReportUuid",
        fieldName: $T(`${commonPrompt}.testingReportUuid`).$D("检测报告"),
      },
    ],
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    transport: {
      read: {
        url: "smdm/v1/{tenantId}/item-auth-req-samples/{itemAuthReqHeaderId}",
        method: "get",
      },
    },
  };
}
export {
  headerInfoDS,
  detailInfoDS,
  stageInfoDS,
  sampleInfoDs
};