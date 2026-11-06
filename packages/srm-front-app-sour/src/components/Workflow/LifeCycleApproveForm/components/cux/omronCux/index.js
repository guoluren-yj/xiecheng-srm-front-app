import { $T, DataSet } from "srm-mobile-ui";

const getOmronTabItem = ({ baseInfoData }) => {
  let bankList = [];
  try {
    bankList = JSON.parse(baseInfoData?.attributeLongtext1 || "[]");
  } catch (error) {
    console.error(error);
  }
  const bankColumns = [
    { fieldCode: "attributeVarchar6", render: (val) => Number(val) === 0 ? $T("sslm.supplierInform.model.supplierInform.bankAccountNum").$D("银行账号") : "IBAN" },
    { fieldCode: "bankCountryName" },
    { fieldCode: "currencyName" },
    { fieldCode: "attributeVarchar2" },
    { fieldCode: "attributeVarchar4" },
    { fieldCode: "attributeVarchar5" },
    { fieldCode: "bankCode" },
    { fieldCode: "bankName" },
    { fieldCode: "bankFirm" },
    { fieldCode: "bankBranchName" },
    { fieldCode: "bankAccountName" },
    { fieldCode: "bankAccountNum" },
    { fieldCode: "attributeVarchar8" },
    { fieldCode: "attributeVarchar9" },
    { fieldCode: "attributeVarchar10" },
    { fieldCode: "attributeVarchar11" },
    { fieldCode: "attributeVarchar12" },
    { fieldCode: "attributeVarchar13" },
    { fieldCode: "enabledFlag", render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"), },
    { fieldCode: "masterFlag", render: (val) => Number(val) === 1 ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否"), },
    { fieldCode: "remark" }
  ];
  const bankInfoDs = new DataSet({
    selection: Infinity,
    pageSize: 5,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldCode: "attributeVarchar6",
        fieldName: $T("sslm.common.cux.omron.accountType").$D("账户类型"),
      },
      {
        fieldCode: "bankCountryName",
        fieldName: $T("sslm.common.cux.omron.bankCountryName").$D("国家/地区"),
      },
      {
        fieldCode: "currencyName",
        fieldName: $T("sslm.common.cux.omron.currencyName").$D("币种"),
      },
      {
        fieldCode: "attributeVarchar2",
        fieldName: $T("sslm.common.cux.omron.JDECode").$D("JDE CODE"),
      },
      {
        fieldCode: "attributeVarchar4",
        fieldName: $T("sslm.common.cux.omron.province").$D("省"),
      },
      {
        fieldCode: "attributeVarchar5",
        fieldName: $T("sslm.common.cux.omron.city").$D("市"),
      },
      {
        fieldCode: "bankCode",
        fieldName: $T("sslm.supplierDetail.view.message.bankCode").$D("银行编码"),
      },
      {
        fieldCode: "bankName",
        fieldName: $T("sslm.supplierDetail.view.message.bankName").$D("银行名称"),
      },
      {
        fieldCode: "bankFirm",
        fieldName: $T("sslm.supplierDetail.view.message.bankFirm").$D("联行行号"),
      },
      {
        fieldCode: "bankBranchName",
        fieldName: $T("sslm.supplierDetail.model.bankAccountData.bankBranchName").$D("开户行名称"),
      },
      {
        fieldCode: "bankAccountName",
        fieldName: $T("sslm.supplierDetail.model.bankAccountData.bankAccountName").$D("账户名称"),
      },
      {
        fieldCode: "bankAccountNum",
        fieldName: $T("sslm.supplierDetail.view.message.bankAccount").$D("银行账户"),
      },
      {
        fieldCode: "attributeVarchar8",
        fieldName: $T("sslm.supplierDetail.view.message.receiveBankCityOrTown").$D("收款行城市/城镇名称"),
      },
      {
        fieldCode: "attributeVarchar9",
        fieldName: $T("sslm.supplierDetail.view.message.receiverBankCityOrTown").$D("收款人城市/城镇名称"),
      },
      {
        fieldCode: "attributeVarchar10",
        fieldName: $T("sslm.supplierDetail.view.message.receiverCountryCode").$D("收款人国家代码"),
      },
      {
        fieldCode: "attributeVarchar11",
        fieldName: $T("sslm.supplierDetail.view.message.receiverResidentCountryCode").$D("收款人常驻国家（地区）代码"),
      },
      {
        fieldCode: "attributeVarchar12",
        fieldName: $T("sslm.supplierDetail.view.message.receivingBankSwiftLineNumber").$D("收款行swift行号"),
      },
      {
        fieldCode: "attributeVarchar13",
        fieldName: $T("sslm.supplierDetail.view.message.receivingBankCountryCode").$D("收款行国家代码"),
      },
      {
        fieldCode: "enabledFlag",
        fieldName: $T("hzero.common.status.enable").$D("启用"),
      },
      {
        fieldCode: "masterFlag",
        fieldName: $T("sslm.supplierDetail.view.message.primaryAccount").$D("主账号"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("hzero.common.remark").$D("备注"),
      }
    ]
  });
  bankInfoDs.setData(bankList);
  return {
    name: "OmronCuxTabItem",
    functional: true,
    render() {
      return (
        <srm-scroll-tab-item
          code="bankInfo"
          label={$T("sslm.supplierDetail.view.message.bankInfo").$D("银行信息")}>
          <srm-list
            data-set={bankInfoDs}
            columns={bankColumns}
            scrollable={false}/>
        </srm-scroll-tab-item>
      );
    },
  };
};

export {
  getOmronTabItem
};