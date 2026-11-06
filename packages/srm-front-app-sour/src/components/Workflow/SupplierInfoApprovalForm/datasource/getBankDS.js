/*
 * @Date: 2023-04-11 09:12:34
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */

import { $T } from "srm-mobile-ui";
import { renderRedNode, renderUpdateTag } from "../utils/utils";

export const getBankDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "bankCountryId",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankCountry").$D("国家/地区"),
    },
    {
      fieldCode: "bankCode",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankCode").$D("银行代码"),
    },
    {
      fieldCode: "bankName",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankName").$D("银行名称"),
    },
    {
      fieldCode: "bankFirm",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankFirm").$D("联行行号"),
    },
    {
      fieldCode: "bankBranchName",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankBranchName").$D("开户行名称"),
    },
    {
      fieldCode: "bankAccountName",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankAccountName").$D("账户名称"),
    },
    {
      fieldCode: "bankAccountNum",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.bankAccountNum").$D("银行账号"),
    },
    {
      fieldCode: "intlBankAccountNum",
      fieldName: $T("spfm.bank.model.bank.intlBankAccount").$D("IBAN码"),
    },
    {
      fieldCode: "accountNature",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.accountNature").$D("账户性质"),
    },
    {
      fieldCode: "accountPurpose",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.accountPurpose").$D("账户用途"),
    },
    {
      fieldCode: "currencyId",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.currencyName").$D("币种"),
    },
    {
      fieldCode: "paymentType",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.paymentType").$D("付款方式"),
    },
    {
      fieldCode: "enabledFlag",
      fieldName: $T("hzero.common.status.enable").$D("启用"),
    },
    {
      fieldCode: "masterFlag",
      fieldName: $T("sslm.enterpriseInform.view.model.bank.masterFlag").$D("是否主账户"),
    },
    {
      fieldCode: "remark",
      fieldName: $T("hzero.common.remark").$D("备注"),
    },
  ],
});

export const getBankColums = () => [
  {
    fieldCode: "bankCountryId",
    render: (val, item) => {
      const updateTag = renderUpdateTag(item);
      return (
        <SrmListHeader showOpenTag={false}>
          <span style={{ fontWeight:400 }}>{renderRedNode({ name: "bankCountryId", record:item, code:"bankCountryName" })}</span>
          <span slot="right">
            {item.masterFlag ?
              <SrmTag
                type="success"
                style="margin-right: 8px"
              >
                {$T("sslm.enterpriseInform.view.model.bank.master").$D("主账户")}
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
    fieldCode: "intlBankAccountNum",
  },
  {
    fieldCode: "accountNature",
    code:"accountNatureMeaning",
  },
  {
    fieldCode: "accountPurpose",
    code:"accountPurposeMeaning",
  },
  {
    fieldCode: "currencyId",
    code:"currencyIdMeaning",
  },
  {
    fieldCode: "paymentType",
    code:"paymentTypeIdMeaning"
  },
  {
    fieldCode: "remark",
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code: col.code }), ...col, }));
