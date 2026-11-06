import BigNumber from "bignumber.js";

import { $T, SrmUtil, DataSet, SrmList, http } from "srm-mobile-ui";
import SrmAppCore from "srm-front-app-core";

import { dateFormat, getDynamicLabel } from "@/utils";

const tqlyGetColumns = (that) => (name) => {
  switch (name) {
  case "orderHeadInfo":
    return [
      {
        fieldCode: "displayPoNum",
        fieldType: "EMPTY",
        render: (val, item) =>
          <SrmListHeader showOpenTag={false}>
            <span style={{ "font-size": "12px", "font-weight": "bold" }}>
              {item.displayPoNum}
            </span>
          </SrmListHeader>,
        formRow: 10,
      },
      {
        fieldCode: "companyName",
        fieldName: $T("sodr.common.model.common.company").$D("公司"),
        formRow: 20,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
        formRow: 30,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.supplierCompanyNum")
          .$D("供应商编码"),
        fieldCode: "supplierCode",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.supplierSiteId")
          .$D("供应商地址"),
        fieldCode: "supplierSiteName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "poTypeDesc",
        fieldName: $T("sodr.common.model.common.poTypeCodeMeaning").$D(
          "订单类型"
        ),
        formRow: 40,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "agentName",
        fieldName: $T("sodr.common.model.common.agentName").$D("采购员"),
        formRow: 40,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "purchaseOrgName",
        fieldName: $T("sodr.common.model.common.purOrganizationName").$D(
          "采购组织"
        ),
        formRow: 50,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("sodr.common.model.common.currencyCode").$D("币种"),
        formRow: 70,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },

      {
        fieldName: that
          .$T("sodr.common.model.common.releaseNum")
          .$D("发放号"),
        fieldCode: "releaseNum",
      },
      {
        fieldCode: "versionNum",
        fieldName: $T("sodr.common.model.common.versionNum").$D("版本号"),
        formRow: 70,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldName: $T("sodr.common.model.common.newTaxIncludeAmount").$D(
          "金额(含税)"
        ),
        render: (val, item, field) => {
          const dom = that.amountRender(
            "taxIncludeAmount",
            item,
            item.priceShieldFlag
          );
          return that.renderChangeTip(field, item, dom);
        },
        formRow: 80,
      },
      {
        fieldCode: "amount",
        fieldName: $T("sodr.common.model.common.newAmount").$D(
          "金额(不含税)"
        ),
        render: (val, item, field) => {
          const dom = that.amountRender("amount", item, item.priceShieldFlag);
          return that.renderChangeTip(field, item, dom);
        },
        formRow: 80,
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.releasedDate")
          .$D("发布时间"),
        fieldCode: "releasedDate",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.receiverAddressName")
          .$D("收货方地址"),
        fieldCode: "shipToLocationAddress",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.billToLocationAddress")
          .$D("收单方地址"),
        fieldCode: "billToLocationAddress",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.termsName")
          .$D("付款条款"),
        fieldCode: "termsName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.erpContractNum")
          .$D("合同编号"),
        fieldCode: "erpContractNum",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.totalQuantity")
          .$D("总数量"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "quantityTotal",
        editor: false,
      },
      {
        fieldCode: "remark",
        fieldName: $T("sodr.common.model.common.remark").$D("订单摘要"),
        formRow: 90,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
    ];
  case "basicInfo":
    return [
      {
        fieldCode: "headerTip",
        fieldType: "EMPTY",
        visible: (val, item) =>
          item && item.changeMap && "insertFlag" in item.changeMap,
        render: () =>
          <div class="change-line-tip">
            {$T("sodr.common.model.common.newChangeLine").$D(
              "该行是变更时新增行"
            )}
          </div>,
        formRow: 0,
      },
      {
        fieldCode: "itemName",
        fieldType: "EMPTY",
        render: (val, item) =>
          <SrmListHeader showOpenTag={false}>
            <span style={{ "font-size": "12px", "font-weight": "bold" }}>
              {item.itemName || "-"}
            </span>
            <span slot="right">{item.displayStatusMeaning}</span>
          </SrmListHeader>,
        formRow: 10,
      },
      {
        fieldCode: "lineNum",
        fieldName: $T("sodr.common.model.common.displayLineNum").$D("行号"),
        formRow: 20,
        render: (val, item) => item.displayLineNum,
      },
      {
        fieldCode: "displayLineLocationNum",
        fieldName: $T("sodr.common.model.common.displayLineLocationNum").$D(
          "发运号"
        ),
        formRow: 25,
        render: (val, item) => item.displayLineLocationNum,
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("sodr.common.model.common.itemCode").$D("物料编码"),
        formRow: 20,
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "quantity",
        fieldName: getDynamicLabel(that.isDoubleUnit, "quantity"),
        formRow: 30,
        formCol: 10,
        render: (val, record, field) => {
          const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, dom);
          }
        },
      },
      {
        fieldCode: "uomCodeAndName",
        fieldName: getDynamicLabel(that.isDoubleUnit, "uom"),
        fieldType: "TEXT",
        editor: false,
        formRow: 30,
        formCol: 20,
      },
      that.isDoubleUnit && {
        formRow: 30,
        formCol: 10,
        fieldName: $T("sodr.common.model.common.newQuantity").$D("数量"),
        fieldCode: "secondaryQuantity",
        render: (val, record, field) => {
          const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, dom);
          }
        },
      },
      that.isDoubleUnit && {
        formRow: 30,
        formCol: 20,
        fieldName: $T("sodr.common.model.common.uomCodeAndName").$D("单位"),
        fieldCode: "secondaryUomCodeAndName",
        fieldType: "TEXT",
        editor: false,
      },
      {
        fieldCode: "taxRate",
        fieldName: $T("sodr.common.model.common.newTaxRate").$D("税率（%）"),
        render: (val, item, field) =>
          val ? that.renderChangeTip(field, item, val) : "0",
      },
      {
        fieldCode: "enteredTaxIncludedPrice",
        fieldName: $T(
          "sodr.common.model.common.newEnteredTaxIncludedPrice"
        ).$D("原币单价(含税)"),
        render: (val, item, field) => {
          const dom = item.priceShieldFlag === 1 ? "***" : val;
          return that.renderChangeTip(field, item, dom);
        },
        formRow: 30,
      },
      {
        fieldCode: "needByDate",
        fieldName: $T("sodr.common.model.common.needByDate").$D("需求日期"),
        formRow: 40,
        render: (val, item, field) => {
          const dom = val ? dateFormat(val) : "-";
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "taxIncludedLineAmount",
        fieldName: $T("sodr.common.model.common.newTaxIncludedLineAmount").$D(
          "金额(含税)"
        ),
        render: (val, record, field) => {
          const dom = that.amountRender(
            "taxIncludedLineAmount",
            record,
            record.priceShieldFlag
          );
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, dom);
          }
        },
      },
    ];
  case "orderHeadInfoDetail":
    return [
      {
        fieldCode: "displayPoNum",
        fieldName: $T("sodr.common.model.common.displayPoNum").$D("订单号"),
      },
      {
        fieldName: that.$T("sodr.common.model.common.supplier").$D("供应商"),
        fieldCode: "supplierName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.poTypeCode")
          .$D("订单类型"),
        fieldCode: "poTypeDesc",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that.$T("sodr.common.model.common.agentName").$D("采购员"),
        fieldCode: "agentName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.purOrganizationId")
          .$D("采购组织"),
        fieldCode: "purchaseOrgName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.currencyName")
          .$D("币种"),
        fieldCode: "currencyCode",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.versionNumber")
          .$D("版本号"),
        fieldCode: "versionNum",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldName: $T("sodr.common.model.common.newTaxIncludeAmount").$D(
          "金额(含税)"
        ),
        render: (val, item, field) => {
          const dom = that.amountRender(
            "taxIncludeAmount",
            item,
            item.priceShieldFlag
          );
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "amount",
        fieldName: $T("sodr.common.model.common.newAmount").$D(
          "金额(不含税)"
        ),
        render: (val, item, field) => {
          const dom = that.amountRender("amount", item, item.priceShieldFlag);
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "remark",
        fieldName: $T("sodr.common.model.common.remark").$D("订单摘要"),
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.supplierCompanyNum")
          .$D("供应商编码"),
        fieldCode: "supplierCode",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.supplierSiteId")
          .$D("供应商地址"),
        fieldCode: "supplierSiteName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.releaseNum")
          .$D("发放号"),
        fieldCode: "releaseNum",
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.releasedDate")
          .$D("发布时间"),
        fieldCode: "releasedDate",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.receiverAddressName")
          .$D("收货方地址"),
        fieldCode: "shipToLocationAddress",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.billToLocationAddress")
          .$D("收单方地址"),
        fieldCode: "billToLocationAddress",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.termsName")
          .$D("付款条款"),
        fieldCode: "termsName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.erpContractNum")
          .$D("合同编号"),
        fieldCode: "erpContractNum",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.common.model.common.totalQuantity")
          .$D("总数量"),
        fieldType: "INPUT_NUMBER",
        fieldCode: "quantityTotal",
        editor: false,
      },
    ];
  case "basicInfoDetail":
    return [
      {
        fieldCode: "lineNum",
        fieldName: $T("sodr.common.model.common.displayLineNum").$D("行号"),
        render: (val, item) => item.displayLineNum,
      },
      {
        fieldName: that
          .$T("sodr.orderApproval.model.common.shipmentNum")
          .$D("发运号"),
        fieldCode: "displayLineLocationNum",
      },
      {
        fieldName: that
          .$T("sodr.orderApproval.model.common.itemCode")
          .$D("物料编码"),
        fieldCode: "itemCode",
      },
      {
        fieldCode: "itemName",
        fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "quantity",
        fieldName: getDynamicLabel(that.isDoubleUnit, "quantity"),
        render: (val, record, field) => {
          const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, dom);
          }
        },
      },
      that.isDoubleUnit && {
        fieldCode: "secondaryQuantity",
        fieldName: $T("sodr.common.model.common.newQuantity").$D("数量"),
        render: (val, record, field) => {
          const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, dom);
          }
        },
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("sodr.common.model.common.attachmentUuid").$D("行附件"),
        fieldType: "UPLOAD",
      },
      {
        fieldCode: "unitPrice",
        fieldName: $T("sodr.common.model.common.unitPrice").$D(
          "单价(不含税)"
        ),
        render: (val, record, field) => {
          const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
          const _dom = record.priceShieldFlag === 1 ? "***" : dom;
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, _dom);
          }
        },
      },
      {
        fieldCode: "enteredTaxIncludedPrice",
        fieldName: $T(
          "sodr.common.model.common.newEnteredTaxIncludedPrice"
        ).$D("原币单价(含税)"),
        render: (val, record, field) => {
          const dom = SrmUtil.getNumberPrecision(new BigNumber(val), null);
          const _dom = record.priceShieldFlag === 1 ? "***" : dom;
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, _dom);
          }
        },
      },
      {
        fieldCode: "lineAmount",
        fieldName: $T("sodr.common.model.common.newLineAmount").$D(
          "金额(不含税)"
        ),
        render: (val, record, field) => {
          const _dom = that.amountRender(
            "lineAmount",
            record,
            record.priceShieldFlag
          );
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, _dom);
          }
        },
      },
      {
        fieldCode: "taxIncludedLineAmount",
        fieldName: $T("sodr.common.model.common.newTaxIncludedLineAmount").$D(
          "金额(含税)"
        ),
        render: (val, record, field) => {
          const dom = that.amountRender(
            "taxIncludedLineAmount",
            record,
            record.priceShieldFlag
          );
          if (val && val !== 0) {
            return that.renderChangeTip(field, record, dom);
          }
        },
      },
      {
        fieldCode: "taxRate",
        fieldName: $T("sodr.common.model.common.newTaxRate").$D("税率（%）"),
        render: (val, item, field) =>
          val ? that.renderChangeTip(field, item, val) : "0",
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("sodr.common.model.common.currencyCode").$D("币种"),
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("sodr.common.model.common.invOrganizationName").$D(
          "收货组织"
        ),
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "needByDate",
        fieldName: $T("sodr.common.model.common.needByDate").$D("需求日期"),
        render: (val, item, field) => {
          const dom = val ? dateFormat(val) : "-";
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.orderApproval.model.common.committedDeliveryDate")
          .$D("承诺交货日期"),
        fieldCode: "promiseDeliveryDate",
        render: (val, item, field) => {
          // eslint-disable-next-line new-cap
          const dom = that.$options.filters["CalcDate"](val);
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: that
          .$T("sodr.orderApproval.model.common.purReqNum")
          .$D("采购申请号"),
        fieldCode: "displayPrNum",
      },
      {
        fieldName: that
          .$T("sodr.orderApproval.model.common.purReqLineNum")
          .$D("申请行号"),
        fieldCode: "displayPrLineNum",
      },
      {
        fieldCode: "remark",
        fieldName: $T("sodr.common.model.common.purchaseLineRemark").$D(
          "采购方行备注"
        ),
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "sourceNumAndLine",
        fieldName: $T("sodr.common.model.common.newSourceNumAndLine").$D(
          "寻源单号-行号"
        ),
        render: (val, item) =>
          <a style="color: blue" onClick={() => that.goSource(item)}>
            {val || item.sourceCodeNum}
          </a>
        ,
      },
      that.isDoubleUnit && {
        fieldName: that.$T("sodr.orderApproval.model.common.unit").$D("单位"),
        fieldCode: "secondaryUomCodeAndName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldName: getDynamicLabel(that.isDoubleUnit, "uom"),
        fieldCode: "uomCodeAndName",
        render: (val, item, field) => {
          const dom = val;
          return that.renderChangeTip(field, item, dom);
        },
      },
      {
        fieldCode: "cuxConditionFeeLink",
        fieldName: $T("").$D("条件费用"),
        render: (val, item) =>
          <a
            style="color: blue"
            onClick={() => {
              const ConditionFee = {
                data() {
                  return {
                    columns: [
                      {
                        fieldCode: "conditionFeeMeaning",
                        fieldName: $T("").$D("条件费用"),
                        formRow: 5,
                      },
                      {
                        fieldCode: "maintenanceTypeMeaning",
                        fieldName: $T("").$D("维护类型"),
                        formRow: 10,
                      },
                      {
                        fieldCode: "currencyCode",
                        fieldName: $T("").$D("币种"),
                        formRow: 20,
                      },
                      {
                        fieldCode: "taxIncludedPrice",
                        fieldName: $T("").$D("含税单价"),
                        formRow: 30,
                      },
                      {
                        fieldCode: "totalTaxIncludedPrice",
                        fieldName: $T("").$D("含税总价"),
                        formRow: 40,
                      },
                      {
                        fieldCode: "taxRate",
                        fieldName: $T("").$D("税率"),
                        formRow: 50,
                      },
                      {
                        fieldCode: "supplierCompanyName",
                        fieldName: $T("").$D("条件供应商"),
                        formRow: 60,
                      },
                      {
                        fieldCode: "companyName",
                        fieldName: $T("").$D("主公司"),
                        formRow: 70,
                      },
                      {
                        fieldCode: "settleCompanyName",
                        fieldName: $T("").$D("结算公司"),
                        formRow: 80,
                      },
                      {
                        fieldCode: "pcNum",
                        fieldName: $T("").$D("合同"),
                        formRow: 90,
                      },
                    ],
                    ds: new DataSet({
                      enableQuery: false,
                      autoQuery: true,
                      pageSize: 10,
                      editable: false,
                      showTotalCount: true,
                      pathParameter: {
                        tenantId: SrmUtil.getTenantId(),
                      },
                      bodyParameter: item,
                      transport: {
                        read: {
                          url: "/marmot/v1/{tenantId}/marmot-api/ZejOD7nJR8oktbEiaqucLdGm9kl8u37PqAwlslCOAMcs",
                          method: "post",
                        },
                      },
                    }),
                  };
                },
                render() {
                  return <SrmList dataSet={that.ds} columns={that.columns} />;
                },
              };
              that.$popup({
                showBack: true,
                title: $T("").$D("条件费用"),
                position: "bottom",
                showHeader: true,
                rounded: true,
                content: <ConditionFee />,
              });
            }}
          >
            {$T("").$D("查看")}
          </a>
        ,
      },
    ];
  case "attachInfo":
    return [
      {
        fieldType: "EMPTY",
        fieldCode: "purchaserInnerAttachmentUuid",
        render: (val) =>
          <SrmFlex class="attachment" justify="between">
            <SrmFlex>
              <span class="srm-icon icon-other" />
              <SrmAttachmentButton
                showTotal={true}
                title={that
                  .$T("sodr.common.view.enterAttachment")
                  .$D("内部附件")}
                attachments={[
                  {
                    attachmentUuid: val,
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  },
                ]}
              />
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
        formRow: 10,
      },
      {
        fieldType: "EMPTY",
        fieldCode: "attachmentUuid",
        formRow: 20,
        render: (val) =>
          <SrmAttachmentButton
            group={true}
            showTotal={true}
            title={that.$T("sodr.common.view.outerAttachment").$D("外部附件")}
            attachments={[
              {
                attachmentUuid: val,
                readonly: true,
                showInfo: true,
                uploadButton: "none",
              },
            ]}
          />
        ,
      },
    ];
  default:
    return [];
  }
};

const hyrdBeforeApproved = async (that) => {
  const res = await http.post(
    `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/NicIwA48AzTwqOQicPWNfzm3xT8V1gAd3d0dJrofZWu7DEBpyx2pYVx45zwfEOgSPJ`,
    that.orderLineDataSet.toData()
  );
  return Boolean(res);
};

//定义方法映射关系
const cuxFunctions = {
  "SRM-TQLY": {
    //⼆开租户的编码
    getColumns: tqlyGetColumns, //key 标准方法名称，value二开方法
  },
  "SRM-HYRD": {
    beforeApproved: hyrdBeforeApproved,
    beforeRejected: hyrdBeforeApproved,
  },
};

export default {
  data() {
    return {};
  },
  beforeCreate() {
    //抽取一个通用方法，规则构建基于标准二开的埋点方法
    SrmAppCore.buildCuxFunction(this, cuxFunctions);
  },
};
