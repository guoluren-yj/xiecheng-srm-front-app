import { SrmUtil, $T } from "srm-mobile-ui";

// manage时编辑basic状态
function isReviewMaterEditable(item, useType, readOnly = false) {
  if (useType === "NEW") {
    return false;
  }
  if (useType === "FILLED") {
    return false;
  }
  return !readOnly && item.evalStatus === "NEW" || item.evalStatus === "FEEDBACK";
}

function reviewMaterDS(id, localNum, useType, basicInfo, readOnly = false) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    selection: 20,
    enableQuery: false,
    data: [],
    showTotalCount: false,
    queryParameter: { customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.REVIEWMATERIALCATEGORY" },
    fields: [ {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.materialCode").$D("物料编码"),
      fieldType: "LOV",
      fieldCode: "itemId",
      displayField: "itemCode",
      lovCode: "SSLM.SITE_EVAL_ITEM_CODE",
      required: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      editor: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      options: {
        subDisplayField: "itemName",
        displayField: "itemCode",
        valueField: "itemId",
        onClear: (ds) => {
          const itemCategoryId = ds.current && ds.current.getField("itemCategoryId");
          itemCategoryId.setLovParam({ });
          // itemCategoryId.options.queryParams.itemId = null;
          // ds.current.setField("itemName", null);
          const itemName = ds.current && ds.current.getField("itemName");
          itemName.setData(null);
        },
        callback: (val, fieldCode, display, ds) => {
          let item = {};
          if (val.length) {
            item = val[0];
          }
          const itemCategoryId = ds.current && ds.current.getField("itemCategoryId");
          itemCategoryId.setLovParam({ itemId: item.itemId });
          // itemCategoryId.options.queryParams.itemId = item.itemId;
          // ds.current.setField("itemName", item.itemName);
          const itemName = ds.current && ds.current.getField("itemName");
          itemName.setData(item.itemName);
        },
      }
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.materialDesc").$D("物料描述"),
      fieldType: "INPUT",
      fieldCode: "itemName",
      editor: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      disabled: true,
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.categoryCode").$D("品类代码"),
      fieldType: "TREE",
      fieldCode: "itemCategoryId",
      displayField: "itemCategoryCode",
      lovCode: "SMDM.TREE_ITEM_CATEGORY",
      required: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      editor: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      options: {
        displayField: "categoryCode",
        subDisplayField: "categoryName",
        valueField: "categoryId",
        onClear: (ds) => {
          const itemId = ds.current && ds.current.getField("itemId");
          itemId.setLovParam({ });
          // itemId.options.queryParams.categoryId = null;
          // ds.current.setField("itemCategoryName", null);
          const itemCategoryName = ds.current && ds.current.getField("itemCategoryName");
          itemCategoryName.setData(null);
        },
        callback: (val, fieldCode, display, ds) => {
          let item = {};
          if (val.length) {
            item = val[0];
          }
          const itemId = ds.current && ds.current.getField("itemId");
          itemId.setLovParam({ categoryId: item.categoryId });
          // itemId.options.queryParams.categoryId = item.categoryId;
          // ds.current.setField("itemCategoryName", item.categoryName);
          const itemCategoryName = ds.current && ds.current.getField("itemCategoryName");
          itemCategoryName.setData(item.categoryName);
        },
      },
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.category").$D("品类"),
      fieldType: "INPUT",
      editor: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      disabled: true,
      fieldCode: "itemCategoryName",
    }, {
      fieldName: $T("sslm.siteInvestigateReport.modal.mange.brand").$D("品牌"),
      fieldType: "INPUT",
      editor: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      fieldCode: "brand",
    }, {
      fieldName: $T("smbl.common.model.comment").$D("备注"),
      fieldType: "INPUT",
      editor: (val, item) => isReviewMaterEditable(item, useType, readOnly),
      fieldCode: "remark",
    }, ],
    transport: {
      read: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-item-cates/${id}`,
        method: "get",
      },
      destroy: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-item-cates`,
        method: "delete",
      },
      submit: {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-item-cates`,
        method: "post",
      }
    },
    events: {
      beforeSubmit: (ds, datas) => {
        // 优化为参数外部传入
        // datas.splice(0, datas.length);
        let evalHeaderId = id;
        datas.forEach((element) => {
          element.evalHeaderId = evalHeaderId;
        });
        return datas.length;
      },
      beforeDelete: (ds, datas) => {
        let ids = [];
        datas.forEach((element) => {
          if (element.evalItemCateId) {
            ids.push(element.evalItemCateId);
          }
        });
        datas.splice(0, datas.length);
        datas.push(...ids);
        return datas.length;
      },
    }
  };
}

export {
  reviewMaterDS
};