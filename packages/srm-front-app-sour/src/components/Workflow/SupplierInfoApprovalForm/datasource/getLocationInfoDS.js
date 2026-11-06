/*
 * @Date: 2023-04-12 16:41:31
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";

export const getLocationDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "countryId",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
    },
    {
      fieldCode: "regionId",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
    },
    {
      fieldCode: "cityId",
      fieldName: $T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
    },
    {
      fieldCode: "address",
      fieldName: $T("sslm.supplierInform.model.supplierInform.addressDetail").$D("详细地址"),
    },
    {
      fieldCode: "supplierAddress",
      fieldName: $T("sslm.supplierInform.model.supplierInform.supplierLocation").$D("供应商地点"),
    },
    {
      fieldCode: "name",
      fieldName: $T("sslm.supplierInform.model.supplierInform.contacts").$D("联系人"),
    },
    {
      fieldCode: "mobilephone",
      fieldName: $T("sslm.supplierInform.model.supplierInform.contactsMethod").$D("联系方式"),
    },
    {
      fieldCode: "ouMessage",
      fieldName: $T("sslm.supplierInform.model.supplierInform.OUMessage").$D("OU层信息"),
    },
  ],
});

export const getLocationColumns = (getOuList) => [
  {
    fieldCode: "countryId",
    render: (val, item) => {
      const updateTag = renderUpdateTag(item);
      return (
        <SrmListHeader showOpenTag={false}>
          <span style={{ fontWeight:400 }}>{renderRedNode({ name: "countryId", record:item, code:"countryName", })}</span>
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
    fieldCode: "regionId",
    code:"regionName",
  },
  {
    fieldCode: "cityId",
    code:"city",
  },
  {
    fieldCode: "address",
  },
  {
    fieldCode: "supplierAddress",
  },
  {
    fieldCode: "name",
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
    fieldCode: "ouMessage",
    render: (val, record) =>
      <span
        style={{ color: "#276EF1" }}
        onClick={() => getOuList(record)}
      >
        {$T("ssrc.supplyInfoChange.view.button.uploadview").$D("查看")}
      </span>
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code: col.code }), ...col, }));

export const getOuDS = () => ({
  editable: false,
  enableQuery: false,
  fields: [
    {
      fieldCode: "ouId",
      fieldName: $T("sslm.supplierInform.model.supplierInform.OULayer").$D("OU层"),
    },
    {
      fieldCode: "billPeriod",
      fieldName: $T("sslm.supplierInform.model.supplierInform.billPeriod").$D("账期"),
    },
    {
      fieldCode: "typeCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
    },
    {
      fieldName: $T("sslm.supplierInform.model.supplierInform.ticketDay").$D("票据天数"),
      fieldCode: "ticketDay",
    },
    {
      fieldCode: "termCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.termName").$D("付款条件"),
    },
    {
      fieldCode: "bankCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.bankCode").$D("银行代码"),
    },
    {
      fieldName: $T("sslm.supplierInform.model.supplierInform.bankName").$D("银行名称"),
      fieldCode: "bankName",
    },
    {
      fieldName: $T("sslm.supplierInform.model.supplierInform.bankFirm").$D("联行行号"),
      fieldCode: "bankFirm",
    },
    {
      fieldName: $T("sslm.supplierInform.model.supplierInform.depositBank").$D("开户行名称"),
      fieldCode: "bankBranchName",
    },
    {
      fieldName: $T("spfm.importErp.model.importErp.accountkName").$D("账户名称"),
      fieldCode: "bankAccountName",
    },
    {
      fieldName: $T("spfm.importErp.model.importErp.bankAccountNum").$D("银行账户"),
      fieldCode: "bankAccountNum",
    },
    {
      fieldCode: "taxRateId",
      fieldName: $T("sslm.supplierInform.model.supplierInform.taxRate").$D("税率"),
    },
    {
      fieldCode: "currencyCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.currencyName").$D("币种"),
    },
    {
      fieldCode: "creationDate",
      fieldName: $T("sslm.supplierInform.model.supplierInform.layerCreationDate").$D("层创建日期"),
    },
    {
      fieldCode: "expirationDate",
      fieldName: $T("sslm.supplierInform.model.supplierInform.layerExpirationDate")
        .$D("层失效日期"),
    },
  ],
});

export const getOuColumns = () => [
  {
    fieldCode: "ouId",
    code:"ouName",
  },
  {
    fieldCode: "billPeriod",
    code:"billPeriodMeaning",
  },
  {
    fieldCode: "typeCode",
    code:"typeName",
  },
  {
    fieldCode: "ticketDay",
  },
  {
    fieldCode: "termCode",
    code:"termName",
  },
  {
    fieldCode: "bankCode",
  },
  {
    fieldCode: "bankName",
  },
  {
    fieldCode: "bankFirm",
  },
  {
    fieldCode: "bankBranchName",
  },
  {
    fieldCode: "bankAccountName",
  },
  {
    fieldCode: "bankAccountNum",
  },
  {
    fieldCode: "taxRateId",
    code:"taxRate",
  },
  {
    fieldCode: "currencyCode",
    code:"currencyName",
  },
  {
    fieldCode: "creationDate",
  },
  {
    fieldCode: "expirationDate",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code: col.code }), ...col, }));
