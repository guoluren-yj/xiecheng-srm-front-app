/*
 * @Date: 2023-04-10 20:55:35
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { renderRedNode, renderUpdateTag } from "../utils/utils";

export const getAddressDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "countryId",
      fieldName: $T("sslm.enterpriseInform.view.model.address.countryName").$D("国家/地区"),
    },
    {
      fieldCode: "regionPathName",
      fieldName: $T("sslm.enterpriseInform.view.model.address.regionPathName").$D("省/市/区"),
    },
    {
      fieldCode: "addressDetail",
      fieldName: $T("sslm.enterpriseInform.view.model.address.businessAddres").$D("经营地址"),
    },
    {
      fieldCode: "postCode",
      fieldName: $T("sslm.enterpriseInform.view.model.address.postCode").$D("邮政编码"),
    },
    {
      fieldCode: "description",
      fieldName: $T("sslm.enterpriseInform.view.model.address.description").$D("地址备注"),
    },
  ],
});

export const getAddressColums = () => [
  {
    fieldCode: "countryId",
    render: (val, item) => {
      const updateTag = renderUpdateTag(item);
      return (
        <SrmListHeader showOpenTag={false}>
          <span style={{ fontWeight:400 }}>{renderRedNode({ name: "countryId", record:item, code:"countryName" })}</span>
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
    fieldCode: "regionPathName",
  },
  {
    fieldCode: "addressDetail",
  },
  {
    fieldCode: "postCode",
  },
  {
    fieldCode: "description",
  },
].map((col) => ({
  render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }),
  ...col,
}));
