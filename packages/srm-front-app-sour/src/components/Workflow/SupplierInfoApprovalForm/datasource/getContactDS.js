/*
 * @Date: 2023-04-10 19:57:06
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";

export const getContactDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "name",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.name").$D("姓名"),
    },
    {
      fieldCode: "mail",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.mail").$D("邮箱"),
    },
    {
      fieldCode: "mobilephone",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.mobilephone").$D("手机号码"),
    },
    {
      fieldCode: "contactType",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.contactType").$D("联系人类型"),
    },
    {
      fieldCode: "department",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.department").$D("部门"),
    },
    {
      fieldCode: "position",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.position").$D("职位"),
    },
    {
      fieldCode: "telephone",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.telephone").$D("固定电话"),
    },
    {
      fieldCode: "description",
      fieldName: $T("sslm.enterpriseInform.view.model.contactPerson.description").$D("备注"),
    },
  ],
});

export const getContactColums = () => [
  {
    fieldCode: "name",
    fieldType: "EMPTY",
    render: (val, item) => {
      const updateTag = renderUpdateTag(item);
      return (
        <SrmListHeader showOpenTag={false}>
          <span style={{ fontWeight:600 }}>{renderRedNode({ name: "name", record:item })}</span>
          <span slot="right">
            {item.defaultFlag ?
              <SrmTag
                type="success"
                style="margin-right: 8px"
              >
                {$T("ssrc.supplyInfoChange.model.default").$D("默认")}
              </SrmTag> :
              ""
            }
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
    fieldCode: "mail",
  },
  {
    fieldCode: "mobilephone",
    render:(val, item, field) => {
      const { internationalTelMeaning } = item;
      const redFlag = getRedFlag({ name:field.fieldCode, record:item });
      const internationalTelCodeRedFlag = getRedFlag({ name:"internationalTelCode", record:item });
      return <span style={{ color: (redFlag || internationalTelCodeRedFlag) && "red" }}>
        {val ? `${internationalTelMeaning} | ${val}` : "-"}
      </span>;
    }
  },
  {
    fieldCode: "contactType",
    render:(val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code:"contactTypeMeaning" }),
  },
  {
    fieldCode: "department",
  },
  {
    fieldCode: "position",
  },
  {
    fieldCode: "telephone",
  },
  {
    fieldCode: "description",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item }), ...col, }));
