/*
 * @Date: 2023-04-12 10:28:52
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { renderRedNode, renderUpdateTag } from "../utils/utils";

export const getSupplierClassifyDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "categoryCode",
      fieldName: $T("sslm.enterpriseInform.model.supplierClassify.code").$D("供应商类型分类"),
    },
    {
      fieldCode: "categoryDescription",
      fieldName: $T("sslm.enterpriseInform.model.supplierClassify.describe").$D("供应商分类描述"),
    },
  ],
});

export const getSupplierClassifyColums = () => [
  {
    fieldCode: "categoryDescription",
    fieldType: "EMPTY",
    render: (val, item) => {
      const updateTag = renderUpdateTag(item);
      return (
        <SrmListHeader showOpenTag={false}>
          <span style={{ fontWeight:600 }}>{renderRedNode({ name: "categoryDescription", record:item })}</span>
          <span slot="right">
            <SrmTag
              type={item.enabledFlag ? "success" : "danger"}
              style={{ marginRight: updateTag ? "8px" : "0px" }}
            >
              {item.enabledFlag ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用") : $T("hipspfm.common.status.enabledFlag.disable").$D("禁用")}
            </SrmTag>
            {updateTag}
          </span>
        </SrmListHeader>
      );
    },
  },
  {
    fieldCode: "categoryCode",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }), ...col, }));
