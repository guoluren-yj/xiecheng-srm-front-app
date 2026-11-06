<template>
  <div style="height: 100vh; overflow: auto;">
    <div class="main-info">
      <srm-list :data-set="createDocumentDs" :columns="getColumns" />
    </div>
    <srm-bottom-handler :btn-arr="getBtnArr" />
  </div>
</template>
<script>

import { $T, DataSet } from "srm-mobile-ui";
import { check, poFromPrLineNewCheck, poFromPrSubmit } from "../api/index";
import { isEmpty, isArray, isNil } from "lodash";
import { createDocumentDs } from "../dataSource/index";

export default {
  name: "CreateDocumnet",
  modules: ["sodr.workspace", "hzero.common"],
  props: {
  },
  data() {
    return {
      createDocumentDs: new DataSet(createDocumentDs()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "prNum",
          formRow: 10,
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              <span>{val}</span>
            </SrmListHeader>
        },
        {
          fieldCode: "displayLineNum",
          formRow: 10,
        },
        {
          fieldCode: "itemCode",
          formRow: 20,
        },
        {
          fieldCode: "itemName",
          formRow: 20,
        },
        {
          fieldCode: "attributeVarchar10",
          formRow: 30,
        },
        {
          fieldCode: "selectSupplierCompanyName",
          formRow: 40,
          render: (val, item) => {
            const { itemId, companyId, ouId,
              priceSortFlag,
              purchaseOrgId,
              invOrganizationId,
              uomId,
              prLineId,
              categoryId } = item;
            const options = {
              displayField: "supplierCompanyName",
              valueField: "supplierCompanyId",
              queryParams: {
                itemId,
                companyId,
                ouId,
                priceSortFlag,
                purchaseOrgId,
                invOrganizationId,
                uomId,
                prLineId,
                categoryId,
              },
              callback: (value, valueField, displayField, ds) => {
                if (value && value[0]) {
                  const {
                    supplierCompanyId,
                    supplierCompanyNum,
                    supplierCompanyName,
                    supplierTenantId,
                    priceLibraryId,
                    supplierId,
                    supplierNum,
                    supplierName,
                    enteredTaxIncludedPrice,
                    benchmarkPriceType,
                    uomCode,
                    uomName,
                    uomCodeAndName,
                    currencyCode,
                    taxId,
                    taxRate,
                    unitPrice,
                    unitPriceBatch,
                    holdPcHeaderId,
                    holdPcLineId,
                    contractNum,
                    ladderPriceLibId,
                    ladderQuotationFlag,
                  } = value[0];
                  ds.current.setField("selectSupplierCompanyId", supplierCompanyId);
                  ds.current.setField("selectSupplierCode", supplierCompanyNum);
                  // ds.current.setField("selectSupplierCompanyName", supplierCompanyName);
                  ds.current.setField("selectSupplierTenantId", supplierTenantId);
                  ds.current.setField("priceLibraryId", priceLibraryId);
                  ds.current.setField("priceLibId", supplierCompanyNum);
                  ds.current.setField("taxIncludedPrice", enteredTaxIncludedPrice);
                  ds.current.setField("enteredTaxIncludedPrice", enteredTaxIncludedPrice);
                  ds.current.setField("benchmarkPriceType", benchmarkPriceType);
                  ds.current.setField("selectLocalSupplierCode", isNil(supplierId) ? null : supplierNum);
                  ds.current.setField("selectLocalSupplierId", isNil(supplierId) ? null : supplierId);
                  ds.current.setField("selectLocalSupplierName", isNil(supplierId) ? null : supplierName);
                  ds.current.setField("uomId", value[0]?.uomId);
                  ds.current.setField("uomCode", uomCode);
                  ds.current.setField("uomName", uomName);
                  ds.current.setField("uomCodeAndName", uomCodeAndName);
                  ds.current.setField("currencyCode", currencyCode);
                  ds.current.setField("taxId", taxId);
                  ds.current.setField("taxRate", taxRate);
                  ds.current.setField("unitPrice", unitPrice);
                  ds.current.setField("unitPriceBatch", unitPriceBatch);
                  ds.current.setField("holdPcHeaderId", holdPcHeaderId);
                  ds.current.setField("holdPcLineId", holdPcLineId);
                  ds.current.setField("contractNum", contractNum);
                  ds.current.setField("ladderPriceLibId", ladderPriceLibId);
                  ds.current.setField("ladderQuotationFlag", ladderQuotationFlag);
                  ds.current.setField("originUnitPrice", benchmarkPriceType === "NET_PRICE" ? unitPrice : enteredTaxIncludedPrice);
                }
              },
              onClear: (ds) => {
                ds.current.setField("selectSupplierCompanyId", null);
                ds.current.setField("selectSupplierCode", null);
                // ds.current.setField("selectSupplierCompanyName", null);
                ds.current.setField("selectSupplierTenantId", null);
                ds.current.setField("priceLibraryId", null);
                ds.current.setField("priceLibId", null);
                ds.current.setField("selectLocalSupplierCode", null);
                ds.current.setField("selectLocalSupplierId", null);
                ds.current.setField("selectLocalSupplierName", null);
                ds.current.setField("taxIncludedPrice", null);
                ds.current.setField("benchmarkPriceType", null);
                ds.current.setField("enteredTaxIncludedPrice", null);
                ds.current.setField("uomId", null);
                ds.current.setField("uomCode", null);
                ds.current.setField("uomName", null);
                ds.current.setField("uomCodeAndName", null);
                ds.current.setField("currencyCode", null);
                ds.current.setField("taxId", null);
                ds.current.setField("taxRate", null);
                ds.current.setField("unitPrice", null);
                ds.current.setField("unitPriceBatch", null);
                ds.current.setField("holdPcHeaderId", null);
                ds.current.setField("holdPcLineId", null);
                ds.current.setField("contractNum", null);
                ds.current.setField("ladderPriceLibId", null);
                ds.current.setField("ladderQuotationFlag", null);
                ds.current.setField("originUnitPrice", null);
              }
            };
            return <SrmLovField
              name="selectSupplierCompanyName"
              code="SODR.PR_SUGGEST_SUPPLIER"
              theme="fill"
              placeholder={this.$T("sodr.workspace.gaishi.view.pleaseSelect", [this.$T("sodr.workspace.gaishi.model.receipt.orderSupplierLov").$D("推荐供应商")]).$D("请选择{}")}
              display={item.selectSupplierCompanyName}
              options={options} />;
          },
        },
        {
          fieldCode: "quantity",
          formRow: 50,
        },
        {
          fieldCode: "thisOrderQuantity",
          formRow: 60,
        },
        {
          fieldCode: "restPoQuantity",
          formRow: 70,
        },
        {
          fieldCode: "neededDate",
          formRow: 70,
        },
        {
          fieldCode: "uomName",
          formRow: 80,
        },
        {
          fieldCode: "noUnitPrice",
          formRow: 80,
        },
        {
          fieldCode: "taxIncludedUnitPrice",
          formRow: 90,
        },
      ];
    },
    // 按钮
    getBtnArr() {
      return [
        {
          type: "success",
          title: this.$T("sodr.workspace.gaishi.model.receivedOrder.create.update").$D(
            "新建"
          ),
          disabled: isEmpty(this.createDocumentDs.selected),
          handler: async () => {
            this.$loading.show();
            const { selected } = this.createDocumentDs;
            const validateFlag = selected.map((record) => record.validate())?.includes(false);
            if (!validateFlag) {
              const currentData = selected.map((record) => ({
                ...record.data,
                selectSupplierCompanyName: record.selectSupplierCompanyNameMeaning,
                selectSupplierCompanyNameMeaning: null,
              }));
              const checkResponse = await check({ sourceCode: "PURCHASE_REQUEST" });
              const validateRes = await poFromPrLineNewCheck(currentData);
              if (validateRes.failed) {
                console.log(1111, this.$loading);
                
                this.$loading.hide();
                this.$notification.open({
                  message: validateRes.message || this.$T("sodr.workspace.gaishi.gaishi.view.message.receivedOrder.error").$D("接口报错，请检查！"),
                  class: "notification"
                });
                return;
              }
              const { poCreatePopUpFlag, poCreateErrorMsg } = validateRes;
              if (poCreatePopUpFlag === 1) {
                this.$dialog({
                  closable: true,
                  content: poCreateErrorMsg,
                  // confirmButtonText: $T('sodr.workspace.view.button.createPO').$D('新建订单')
                  async onOk() {
                    const submitRes = await poFromPrSubmit(currentData);
                    if (submitRes && !submitRes.failed) {
                      const { content } = submitRes;
                      const { poHeaderId, poSourcePlatform, sourceBillTypeCode } = isArray(content) ? content[0] : content;
                      this.$loading.hide();
                      this.$notification.open({
                        message: $T("hzero.common.notification.success").$D("操作成功"),
                        class: "notification"
                      });
                      if (checkResponse === 0 || (checkResponse === 1 && content.length === 1)) {
                        // eslint-disable-next-line vue/no-mutating-props
                        this.$router.push({
                          name: "toBeSubmittedDetail",
                          query: { poHeaderId, poSourcePlatform, sourceBillTypeCode },
                        });
                      } else if (checkResponse === 1 && content.length > 1) {
                        // eslint-disable-next-line vue/no-mutating-props
                        this.$router.push({
                          name: "toBeSubmittedDetail",
                          query: { poHeaderId, poSourcePlatform, sourceBillTypeCode, initPoDataList: content },
                        });

                      }
                    } else {
                      this.$loading.hide();
                      this.$notification.open({
                        message: submitRes.message || this.$T("sodr.workspace.gaishi.gaishi.view.message.receivedOrder.error").$D("接口报错，请检查！"),
                        class: "notification"
                      });
                    }
                  },
                });
              } else {
                const submitRes = await poFromPrSubmit(currentData);
                if (submitRes && !submitRes.failed) {
                  this.$loading.hide();
                  const { poHeaderId, poSourcePlatform, sourceBillTypeCode } = submitRes[0] || {};
                  this.$notification.open({
                    message: $T("hzero.common.notification.success").$D("操作成功"),
                    class: "notification"
                  });
                  if (checkResponse === 0 || (checkResponse === 1 && submitRes.length === 1)) {
                    // eslint-disable-next-line vue/no-mutating-props
                    this.$router.push({
                      name: "toBeSubmittedDetail",
                      query: { poHeaderId, poSourcePlatform, sourceBillTypeCode },
                    });
                  } else if (checkResponse === 1 && submitRes.length > 1) {
                    // eslint-disable-next-line vue/no-mutating-props
                    this.$router.push({
                      name: "toBeSubmittedDetail",
                      query: { poHeaderId, poSourcePlatform, sourceBillTypeCode, initPoDataList: submitRes },
                    });
                  }
                } else {
                  this.$loading.hide();
                  this.$notification.open({
                    message: submitRes.message || this.$T("sodr.workspace.gaishi.gaishi.view.message.receivedOrder.error").$D("接口报错，请检查！"),
                    class: "notification"
                  });
                }
              }
            } else {
              this.$loading.hide();
              this.$notification.open({
                message: this.$T("sodr.workspace.gaishi.gaishi.view.message.receivedOrder.create.not.null").$D("请填写必填项!"),
                class: "notification"
              });
            }
          },
        },
        {
          title: this.$T("sodr.workspace.gaishi.model.receivedOrder.create.cancel").$D(
            "取消"
          ),
          handler: () => {
            this.$router.back();
          },
        },
      ];
    },
  },
};
</script>

<style lang="stylus" scoped>

.main-info {
  height: 100%;
  overflow: scroll;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
  .detail-wrap {
  height: calc(100vh - 100px);
  overflow: scroll;
  }
}
</style>