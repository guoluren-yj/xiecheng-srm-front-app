import {
  createApi,
  updateApi,
  checkBudgetApi,
  submitApi,
  getAttributeApi,
} from "../api";
import { editDs } from "../datasource/indexDs";
import { getCreationApi, getUomControlApi, checkPermission } from "../api/config";
import { dateFormat, getDynamicLabel } from "@/utils/index";
import { SrmUtil, $T, DataSet } from "srm-mobile-ui";
import uuid from "uuid";

export default {
  data() {
    return {
      itemLimit: null,
      uomDisplay: 0,
      uomControlFlag: 0,
      batchDataSet: new DataSet(editDs()), // 批量编辑
      batchVisible: false,
      deleteFlag: true,
    };
  },
  computed: {
    getEditColumns() {
      return (name) => {
        const currentTenant = SrmUtil.getTenantNum();
        let cuxBasicInfoDetail = [];
        // 标准二开埋点
        if (this.over$getColumns && typeof this.over$getColumns === "function") {
          cuxBasicInfoDetail = this.over$getColumns();
        }
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "originalCurrency",
              options: {
                displayField: "currencyCode",
                subDisplayField: "currencyName",
                valueField: "currencyCode",
                changeField: this.changeField,
                callback: (val, valueField, displayField, ds) => {
                  if (val && val[0]) {
                    ds.current.setField(
                      "originalCurrency",
                      val[0].currencyCode
                    );
                    ds.current.setField(
                      "originalCurrencyName",
                      val[0].currencyName
                    );
                    ds.current.setField("originalCurrencyLov", val[0]);
                    ds.current.setField(
                      "defaultPrecision",
                      val[0].defaultPrecision
                    );
                    ds.current.setField(
                      "financialPrecision",
                      val[0].financialPrecision
                    );
                    ds.current.setField("remark", val[0].currencyCode);
                    this.changeField("currencyCode", val[0]);
                  }
                },
                onClear: (ds) => {
                  ds.current.setField("originalCurrency", null);
                  ds.current.setField("originalCurrencyName", null);
                  ds.current.setField("originalCurrencyLov", null);
                  ds.current.setField("defaultPrecision", null);
                  ds.current.setField("financialPrecision", null);
                  ds.current.setField("remark", null);
                },
              },
            },
            {
              formRow: 99999,
              fieldType: "EMPTY",
              render: () =>
                <srm-flex justify="end">
                  <srm-button
                    type="primary"
                    fill
                    onClick={() => this.clickEditInfo("one", "ok")}
                  >
                    {this.$T("sprm.common.view.button.editMore").$D(
                      "编辑更多"
                    )}
                  </srm-button>
                </srm-flex>
              ,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "displayPrNum",
              visible: this.type === "edit",
            },
            {
              fieldCode: "title",
            },
            {
              fieldCode: "createByName",
              visible: this.type === "edit",
            },
            {
              fieldCode: "creationDate",
              visible: this.type === "edit",
            },
            {
              fieldCode: "prTypeName",
            },
            {
              fieldCode: "originalCurrency",
              options: {
                displayField: "currencyCode",
                subDisplayField: "currencyName",
                changeField: this.changeField,
                callback: (val, valueField, displayField, ds) => {
                  if (val && val[0]) {
                    ds.current.setField(
                      "originalCurrency",
                      val[0].currencyCode
                    );
                    ds.current.setField(
                      "originalCurrencyName",
                      val[0].currencyName
                    );
                    ds.current.setField("originalCurrencyLov", val[0]);
                    ds.current.setField(
                      "defaultPrecision",
                      val[0].defaultPrecision
                    );
                    ds.current.setField(
                      "financialPrecision",
                      val[0].financialPrecision
                    );
                    ds.current.setField("remark", val[0].currencyCode);
                    this.changeField("currencyCode", val[0]);
                  }
                },
                onClear: (ds) => {
                  ds.current.setField("originalCurrency", null);
                  ds.current.setField("originalCurrencyName", null);
                  ds.current.setField("originalCurrencyLov", null);
                  ds.current.setField("defaultPrecision", null);
                  ds.current.setField("financialPrecision", null);
                  ds.current.setField("remark", null);
                },
              },
            },
            {
              fieldCode: "localCurrency",
              visible: this.type === "edit",
            },
            {
              fieldCode: "localCurrencyTaxSum",
              visible: this.type === "edit",
            },
            {
              fieldCode: "amount",
              visible: this.type === "edit",
            },
            {
              fieldCode: "prRequestedName",
            },
            {
              fieldCode: "requestDate",
            },
            {
              fieldCode: "unitName",
            },
            {
              fieldCode: "remark",
            },
          ].concat(currentTenant === "SRM-WEILONG" ? cuxBasicInfoDetail : []);
        case "organization":
          return [
            {
              fieldCode: "companyName",
              editor: this.type === "add",
            },
            {
              fieldCode: "ouName",
              editor: this.type === "add",
            },
            {
              fieldCode: "purchaseOrgName",
              editor: this.type === "add",
            },
            {
              formRow: 99999,
              fieldType: "EMPTY",
              render: () =>
                <srm-flex justify="end">
                  <srm-button
                    type="primary"
                    fill
                    onClick={() => this.clickEditInfo("two", "ok")}
                  >
                    {this.$T("sprm.common.view.button.editMore").$D(
                      "编辑更多"
                    )}
                  </srm-button>
                </srm-flex>
              ,
            },
          ];
        case "organizationDetail":
          return [
            {
              fieldCode: "companyName",
              editor: this.type === "add",
            },
            {
              fieldCode: "ouName",
              editor: this.type === "add",
            },
            {
              fieldCode: "purchaseOrgName",
            },
            {
              fieldCode: "purchaseAgentName",
            },
          ];
        case "detailInfo":
          return [
            // 方便勾选单据
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.displayLineNum || "-"}</span>
                  <SrmButton
                    slot="right"
                    type="warn"
                    v-show={item.prLineStatusCodeMeaning}
                  >
                    {item.prLineStatusCodeMeaning || ""}
                  </SrmButton>
                </SrmListHeader>
              ,
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "neededDate",
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.uomControlFlag, "quantity"),
              precision: (val, record) => {
                if (
                  record.prSourcePlatform === "SRM" &&
                    record.uomPrecision
                ) {
                  return Number(record.uomPrecision);
                }
              },
            },
            {
              fieldCode: "uomName",
              fieldName: getDynamicLabel(this.uomControlFlag, "uom"),
            },
            this.uomControlFlag && {
              fieldCode: "secondaryQuantity",
              precision: (val, record) => {
                if (
                  record.prSourcePlatform === "SRM" &&
                    record.uomPrecision
                ) {
                  return Number(record.uomPrecision);
                }
              },
            },
            this.uomControlFlag && {
              fieldCode: "secondaryUomName",
              render: (val, item) => item.secondaryUomCodeAndName,
            },
            {
              formRow: 99999,
              fieldType: "EMPTY",
              render: () =>
                <srm-flex justify="end">
                  <srm-button
                    type="primary"
                    fill
                    onClick={() => this.clickEditInfo("three", "ok")}
                  >
                    {this.$T("sprm.common.view.button.editMore").$D(
                      "编辑更多"
                    )}
                  </srm-button>
                </srm-flex>
              ,
            },
          ];
        case "detailInfoDetail":
          return [
            {
              fieldCode: "displayLineNum",
            },
            {
              fieldCode: "invOrganizationName",
            },
            {
              fieldCode: "itemCode",
            },
            {
              fieldCode: "itemName",
            },
            {
              fieldCode: "itemModel",
            },
            {
              fieldCode: "itemSpecs",
            },
            {
              fieldCode: "categoryName",
            },
            {
              fieldCode: "customMadeFlag",
            },
            {
              fieldCode: "customAttributeList",
              callBack: (record) => {
                if (
                  record["customAttributeList"] &&
                    record["customAttributeList"].length > 0
                ) {
                  record["customAttributeList"] = JSON.parse(
                    JSON.stringify(record["customAttributeList"])
                  );
                  this.openEditPopup(
                    "customAttributeList",
                    record["customAttributeList"]
                  );
                } else {
                  this.openEditPopup("customAttributeList", record);
                }
              },
            },
            {
              fieldCode: "neededDate",
            },
            {
              fieldCode: "productNum",
            },
            {
              fieldCode: "productName",
            },
            {
              fieldCode: "thirdSkuCode",
            },
            {
              fieldCode: "thirdSkuName",
            },
            {
              fieldCode: "catalogName",
            },
            {
              fieldCode: "skuType",
            },
            {
              fieldCode: "customSpecsJson",
              callBack: (record) => {
                this.openPopup("customSpecsJson", record);
              },
            },
            {
              fieldCode: "receiveAddress",
            },
            {
              fieldCode: "receiveContactName",
            },
            {
              fieldCode: "internationalTelCode",
            },
            {
              fieldCode: "receiveTelNum",
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.uomControlFlag, "quantity"),
            },
            {
              fieldCode: "uomName",
              fieldName: getDynamicLabel(this.uomControlFlag, "uom"),
            },
            this.uomControlFlag && {
              fieldCode: "secondaryQuantity",
            },
            this.uomControlFlag && {
              fieldCode: "secondaryUomName",
            },
            this.uomControlFlag && {
              fieldCode: "secondaryTaxInUnitPrice",
              precision: (val, record) => {
                if (
                  record.prSourcePlatform === "SRM" &&
                    record.financialPrecision
                ) {
                  return Number(record.financialPrecision);
                }
              },
            },
            {
              fieldCode: "taxCode",
            },
            {
              fieldCode: "taxRate",
            },
            {
              fieldCode: "currencyCode",
            },
            {
              fieldCode: "taxIncludedUnitPrice",
              fieldName: getDynamicLabel(
                this.uomControlFlag,
                "taxIncludedUnitPrice"
              ),
              precision: (val, record) => {
                if (
                  record.prSourcePlatform === "SRM" &&
                    record.financialPrecision
                ) {
                  return Number(record.financialPrecision);
                }
              },
            },
            {
              fieldCode: "lastPurchasePrice",
            },
            {
              fieldCode: "taxIncludedLineAmount",
            },
            {
              fieldCode: "localCurrencyNoTaxSum",
            },
            {
              fieldCode: "localCurrencyTaxSum",
            },
            {
              fieldCode: "localCurrencyNoTaxUnit",
            },
            {
              fieldCode: "localCurrencyTaxUnit",
            },
            {
              fieldCode: "supplierCompanyName",
              render: (val, item) => item.displaySupplierName
            },
            {
              fieldCode: "prRequestedName",
            },
            {
              fieldCode: "purchaseAgentName",
            },
            {
              fieldCode: "executorName",
            },
            {
              fieldCode: "remark",
            },
            {
              fieldCode: "attachmentUuid",
            },
            {
              fieldCode: "executorRecordDetail",
              callBack: (record) => {
                this.openPopup("executorRecordDetail", record);
              },
            },
          ];
        case "deliveryInfo":
          return [ {
            fieldType: "EMPTY",
            fieldCode: "receiverContactName",
            render: (val) => <srm-list-header>
              <span>{this.$T("sprm.common.model.common.acceptPerson").$D("收货联系人")}：{val}</span>
            </srm-list-header>,
          }, {
            fieldCode: "receiverAddressName",
            fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverTelNum",
            fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
            render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          }, {
            fieldCode: "invoiceAddressName",
            editor: this.type === "edit",
            fieldName: this.$T("sprm.common.model.common.invoiceAddress").$D("收单方地址"),
          }, {
            fieldType: "TEXT",
            fieldCode: "invoiceContactName",
            fieldName: this.$T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
          }, {
            fieldType: "TEXT",
            fieldCode: "invoiceTelNum",
            fieldName: this.$T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
            render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          }, {
            fieldType: "TEXT",
            fieldCode: "purchaseUnitName",
            fieldName: this.$T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverEmailAddress",
            fieldName: this.$T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
          }, {
            formRow: 99999,
            fieldType: "EMPTY",
            render: () =>
              <srm-flex justify="end">
                <srm-button
                  type="primary"
                  fill
                  onClick={() => this.clickEditInfo("four", "ok")}
                >
                  {this.$T("sprm.common.view.button.editMore").$D(
                    "编辑更多"
                  )}
                </srm-button>
              </srm-flex>
            ,
          }, ];
        case "deliveryInfoDetail":
          return [ {
            fieldType: "TEXT",
            fieldCode: "receiverContactName",
            fieldName: this.$T("sprm.common.model.common.acceptPerson").$D("收货联系人"),
          }, {
            fieldCode: "receiverAddressName",
            fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverTelNum",
            fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
            render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          }, {
            fieldCode: "invoiceAddressName",
            editor: this.type === "edit",
            fieldName: this.$T("sprm.common.model.common.invoiceAddress").$D("收单方地址"),
          }, {
            fieldType: "TEXT",
            fieldCode: "invoiceContactName",
            fieldName: this.$T("sprm.common.model.common.invoiceContactName").$D("收单联系人"),
          }, {
            fieldType: "TEXT",
            fieldCode: "invoiceTelNum",
            fieldName: this.$T("sprm.common.model.common.invoiceTelNum").$D("收单联系电话"),
            render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          }, {
            fieldType: "TEXT",
            fieldCode: "purchaseUnitName",
            fieldName: this.$T("sprm.common.model.common.purchaseUnitName").$D("收货方组织"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverEmailAddress",
            fieldName: this.$T("sprm.common.model.common.receiverEmail").$D("收单邮箱"),
          } ];
        case "billingInfo":
          return [ {
            fieldType: "EMPTY",
            fieldCode: "invoiceTitle",
            render: (val) => <srm-list-header show-open-tag={true}>
              <span>{val}</span>
            </srm-list-header>,
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceTitle").$D("发票抬头"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterNum",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterAddress",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterTel",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterBank",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterBankAccount",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceMethod").$D("开票方式"),
            fieldCode: "invoiceMethodName",
            editor: this.type === "edit",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
            fieldCode: "invoiceTypeName",
            editor: this.type === "edit",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
            fieldCode: "invoiceTitleTypeName",
            editor: this.type === "edit",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
            fieldCode: "invoiceDetailTypeName",
            editor: this.type === "edit",
          }, {
            formRow: 99999,
            fieldType: "EMPTY",
            render: () =>
              <srm-flex justify="end">
                <srm-button
                  type="primary"
                  fill
                  onClick={() => this.clickEditInfo("five", "ok")}
                >
                  {this.$T("sprm.common.view.button.editMore").$D(
                    "编辑更多"
                  )}
                </srm-button>
              </srm-flex>
            ,
          }, ];
        case "billingInfoDetail":
          return [ {
            fieldType: "TEXT",
            fieldCode: "taxRegisterNum",
            fieldName: this.$T("sprm.common.model.common.taxRegisterNum").$D("税务登记号"),
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceTitle").$D("发票抬头"),
            fieldType: "TEXT",
            fieldCode: "invoiceTitle",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterAddress").$D("税务登记地址"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterAddress",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterTel").$D("公司电话"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterTel",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterBank").$D("开户行"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterBank",
          }, {
            fieldName: this.$T("sprm.common.model.common.taxRegisterBankAccount").$D("开户行账号"),
            fieldType: "TEXT",
            fieldCode: "taxRegisterBankAccount",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceMethod").$D("开票方式"),
            fieldCode: "invoiceMethodName",
            editor: this.type === "edit",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
            fieldCode: "invoiceTypeName",
            editor: this.type === "edit",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
            fieldCode: "invoiceTitleTypeName",
            editor: this.type === "edit",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
            fieldCode: "invoiceDetailTypeName",
            editor: this.type === "edit",
          }, ];
        case "batchEdit":
          return [
            {
              fieldCode: "neededDate",
            },
            {
              fieldCode: "organizationName",
            },
            {
              fieldCode: "costId",
            },
            {
              fieldCode: "wbsCode",
            },
            {
              fieldCode: "innerPoNum",
            },
          ];
        default:
          return [];
        }
      };
    },
    getButtons() {
      if (this.type === "readOnly") {
        return [];
      }
      if (this.type === "add") {
        return [
          {
            text: $T("sprm.common.view.button.save").$D("保存"),
            fill: true,
            permissionCode: "hzero.srm.requirement.prm.pr-platform.ps.create-save",
            handler: () => {
              this.save();
            },
          },
        ];
      }
      return [
        {
          text: $T("sprm.common.view.button.save").$D("保存"),
          bordered: true,
          permissionCode: "hzero.srm.requirement.prm.pr-platform.ps.create-save",
          handler: () => {
            this.save();
          },
        },
        {
          text: $T("sprm.common.view.button.submit").$D("提交"),
          fill: true,
          permissionCode: "hzero.srm.requirement.prm.pr-platform.ps.create-submit",
          handler: () => {
            this.submit();
          },
        },
      ];
    },
    getBatchButtons() {
      return [
        {
          text: $T("sprm.common.view.button.save").$D("保存"),
          fill: true,
          handler: () => {
            this.saveBatch();
          },
        },
      ];
    },
    getDetailInfoButtons() {
      return [
        {
          text: $T("sprm.common.view.button.editMany").$D("批量编辑"),
          fill: true,
          visible: this.type === "edit",
          callback: () => {
            this.openEditPopup("batchEdit");
          },
        },
        {
          text: $T("sprm.common.view.button.delete").$D("删除"),
          type: "danger",
          bordered: true,
          visible: true,
          disabled: (selected) => selected.length === 0,
          callback: (selected) => {
            this.deleteLine(selected);
          },
        },
      ];
    },
  },
  mounted() {
    // 新增状态
    if (this.type === "add") {
      this.commonDataSet.create(
        {
          attachmentUuid: uuid(), // 内部附件
          customizeUnitCode:
            "SPRM.PURCHASE_PLAFORM_CREATE.BASE_HEADER,SPRM.PURCHASE_PLAFORM_CREATE.PURCHASEORGINFO,SPRM.PURCHASE_PLAFORM_CREATE.BILLINGINFO,SPRM.PURCHASE_PLAFORM",
          executionBillId: 0, // 目标单据ID
          originalCurrency: "CNY", // 原币币种数据库字段
          originalCurrencyLov: { currencyCode: "CNY" },
          prLineList: [], // 行数据
          externalAttachmentUuid: uuid(), // 外部附件
          currencyCode: "CNY", // 原币币种 界面替代字段
          prSourcePlatform: "SRM",
          // defaultPrecision: 5,
          // financialPrecision: 5,
        },
        0
      );
    }
    this.getConfig();
    this.getBtnConfig();
  },
  methods: {
    // 新增/编辑 点击更多详情
    clickEditInfo(name, flag) {
      switch (name) {
      case "one":
        if (flag === "ok") {
          this.openDetailPopup("basicInfoDetail", this.commonDataSet);
        }
        break;
      case "two":
        if (flag === "ok") {
          this.openDetailPopup("organizationDetail", this.commonDataSet);
        }
        break;
      case "three":
        if (flag === "ok") {
          // 新增行，物料分类查询 新增参数物料id
          const categoryName =
              this.detailInfoDataSet.getField("categoryName");
          categoryName.options.queryParams["itemId"] =
              this.detailInfoDataSet.current.data.itemId;
          // 页面 库存组织字段
          this.detailInfoDataSet.current.setField(
            "invOrganizationName",
            this.detailInfoDataSet.current.data.invOrganizationName
          );
          // 页面 申请人字段
          this.detailInfoDataSet.current.setField(
            "prRequestedNumAndName",
            `${this.detailInfoDataSet.current.data["prRequestedNum"]}-${this.detailInfoDataSet.current.data["prRequestedName"]}`
          );
          // 字段隐藏 预估单价(含税)
          this.detailInfoDataSet.current.setField(
            "taxIncludedUnitPrice",
            this.detailInfoDataSet.current.data.linePriceHiddenFlag === 1 ?
              this.detailInfoDataSet.current.data
                .taxIncludedUnitPriceMeaning :
              this.detailInfoDataSet.current.data.taxIncludedUnitPrice
          );
          this.openDetailPopup("detailInfoDetail", this.detailInfoDataSet);
        }
        break;
      case "four":
        if (flag === "ok") {
          this.openDetailPopup("deliveryInfoDetail", this.commonDataSet);
        }
        break;
      case "five":
        if (flag === "ok") {
          this.openDetailPopup("billingInfoDetail", this.commonDataSet);
        }
        break;
      default:
        break;
      }
    },
    // 获取按钮权限
    getBtnConfig() {
      checkPermission([
        "hzero.srm.requirement.prm.pr-platform.ps.create-delete"
      ]).then((res) => {
        if (res) {
          this.deleteFlag = res[0]?.approve || false;
        }
      });
    },
    // 获取业务规则定义 配置
    getConfig() {
      Promise.all([
        // 物料限定范围规则
        getCreationApi("SITE.SPUC.PR.CREATION.ITEM_LIMIT", [
          { fullPathCode: "SITE.SPUC.PR.CREATION.ITEM_LIMIT" },
        ]),
        // 单位显示
        getCreationApi("SITE.SMDM.UOM_DISPLAY_CONFIGURATION", [
          { fullPathCode: "SITE.SMDM.UOM_DISPLAY_CONFIGURATION" },
        ]),
        // 单位显示
        getUomControlApi(),
      ]).then((list) => {
        const [ itemLimit ] = list[0];
        this.itemLimit = itemLimit;
        const [ uomDisplay ] = list[1];
        this.uomDisplay = Number(uomDisplay);
        const { SPRM } = list[2];
        this.uomControlFlag = Number(SPRM);
      });
    },
    // 赋值ds中各个LOV字段 查询参数
    setQueryParams(desc = []) {
      let {
        companyId = null, // 公司
        ouId = null, // 业务实体
        purchaseOrgId = null, // 采购组织
        prTypeId = null, // 申请类型
      } = this.commonDataSet.data[0];
      if (desc.length === 0 || desc.includes("commonDataSet")) {
        // 申请基础信息
        const unitName = this.commonDataSet.getField("unitName");
        unitName.options.queryParams["companyId"] = companyId;
        const ouName = this.commonDataSet.getField("ouName");
        ouName.options.queryParams["companyId"] = companyId;
        const purchaseOrgName = this.commonDataSet.getField("purchaseOrgName");
        purchaseOrgName.options.queryParams["ouId"] = ouId;
        const purchaseAgentName =
          this.commonDataSet.getField("purchaseAgentName");
        purchaseAgentName.options.queryParams["purchaseOrgIds"] = purchaseOrgId;
      }
      if (desc.length === 0 || desc.includes("detailInfoDataSet")) {
        // 申请明细信息
        const invOrganizationName = this.detailInfoDataSet.getField(
          "invOrganizationName"
        );
        invOrganizationName.options.queryParams["ouId"] = ouId;
        const itemCode = this.detailInfoDataSet.getField("itemCode");
        itemCode.options.queryParams["companyId"] = companyId;
        itemCode.options.queryParams["prTypeId"] = prTypeId;
        const categoryName = this.detailInfoDataSet.getField("categoryName");
        categoryName.options.queryParams["purchaseOrgId"] = purchaseOrgId;
        categoryName.options.queryParams["queryCategoryId"] = purchaseOrgId;
        categoryName.options.queryParams["prTypeId"] = prTypeId;
        const supplierCompanyName = this.detailInfoDataSet.getField(
          "supplierCompanyName"
        );
        supplierCompanyName.options.queryParams["companyId"] = companyId;
      }
      if (desc.length === 0 || desc.includes("batchDataSet")) {
        // 批量编辑
        const organizationName = this.batchDataSet.getField("organizationName");
        organizationName.options.queryParams["ouId"] = ouId;
        const costId = this.batchDataSet.getField("costId");
        costId.options.queryParams["ouId"] = ouId;
        costId.options.queryParams["companyId"] = companyId;
        const wbsCode = this.batchDataSet.getField("wbsCode");
        wbsCode.options.queryParams["ouId"] = ouId;
        wbsCode.options.queryParams["companyId"] = companyId;
      }
    },
    // 申请明细编辑(批量编辑/删除)
    toggleOrderLineEdit() {
      this.detailInfoDataSet.editFlag = !this.detailInfoDataSet.editFlag;
    },
    // 申请明细新增
    toggleOrderLineAdd() {
      let {
        prRequestedName = null,
        prRequestedNum = null,
        prRequestedNumAndName = null,
        purchaseAgentName = null,
        ouId = null,
        companyId = null,
        originalCurrency = null,
        defaultPrecision = null,
        financialPrecision = null,
        localDefaultPrecision = null,
        localFinancialPrecision = null,
        purchaseAgentId = null,
        requestedBy = null,
      } = this.commonDataSet.data[0];
      this.detailInfoDataSet.create(
        {
          attachmentUuid: uuid(),
          companyId: companyId,
          budgetIoFlag: "0",
          currencyCode: originalCurrency,
          internationalTelCode: "+86",
          originalCurrency: originalCurrency,
          ouId: ouId,
          prSourcePlatform: "SRM",
          tenantId: SrmUtil.getTenantId(),
          userId: SrmUtil.getUserInfo().id,
          itemLimit: this.itemLimit,
          uomDisplay: this.uomDisplay,
          uomControlFlag: this.uomControlFlag,
          prRequestedName: prRequestedName,
          prRequestedNum: prRequestedNum,
          prRequestedNumAndName: prRequestedNumAndName,
          purchaseAgentId: purchaseAgentId,
          purchaseAgentName: purchaseAgentName,
          agentName: purchaseAgentName,
          requestedBy: requestedBy,
          defaultPrecision: defaultPrecision,
          localDefaultPrecision: localDefaultPrecision,
          localFinancialPrecision: localFinancialPrecision,
          financialPrecision: financialPrecision,
        },
        0
      );
      this.detailInfoDataSet.locate(0);
      this.setQueryParams([ "detailInfoDataSet" ]);
    },
    // 批量编辑 弹框
    async openEditPopup(name, item) {
      switch (name) {
      // 批量编辑
      case "batchEdit":
        this.setQueryParams([ "batchDataSet" ]);
        this.batchDataSet.reset();
        this.batchDataSet.setData([
          {
            neededDate: null,
            organizationName: null,
          },
        ]);
        this.batchDataSet.locate(0);
        this.popupData = {
          title: this.getLanguageDefine(name),
          columns: name,
          code: name,
        };
        this.batchVisible = true;
        break;
        // 物料定制编辑
      case "customAttributeList":
        if (this.type !== "readOnly" && item && item.length) {
          this.customAttributeDataSet.reset();
          this.customAttributeDataSet.setData([ ...item ]);
          this.customPopupData = {
            title: this.getLanguageDefine(name),
            columns: name,
            code: name,
          };
          this.customVisible = true;
        } else {
          this.$loading.show;
          getAttributeApi({
            customMadeFlag: item.customMadeFlag,
            itemId: item.itemId,
            prLineId: item.prLineId,
          })
            .then((res) => {
              item["customAttributeList"] = [ ...res ];
              this.customAttributeDataSet.reset();
              this.customAttributeDataSet.setData([ ...res ]);
              this.customPopupData = {
                title: this.getLanguageDefine(name),
                columns: name,
                code: name,
              };
              this.customVisible = true;
            })
            .finally(() => {
              this.$loading.hide;
            });
        }
        break;
      default:
        break;
      }
    },
    // 根据头修改行
    changeField(fieldCode, item) {
      switch (fieldCode) {
      // 原币币种修改，行上币种/原币币种同步修改
      case "currencyCode":
        this.detailInfoDataSet.data.forEach((element) => {
          element[fieldCode] = item.currencyCode;
          element["currencyName"] = item.currencyName;
          element["defaultPrecision"] = item.defaultPrecision;
          element["financialPrecision"] = item.financialPrecision;
        });
        break;
      default:
        break;
      }
    },
    // 批量编辑
    saveBatch() {
      let obj = JSON.parse(JSON.stringify(this.batchDataSet.data[0]));
      if (
        this.detailInfoDataSet.selected &&
        this.detailInfoDataSet.selected.length
      ) {
        // 批量编辑勾选申请明细行，则对勾选的申请明细行进行批量操作
        Object.keys(obj).map((key) => {
          this.detailInfoDataSet.selected.forEach((element) => {
            if (obj[key]) {
              element.data[key] = obj[key];
            }
          });
        });
      } else {
        // 批量编辑未勾选申请明细行，则对全部申请明细行进行批量操作
        Object.keys(obj).map((key) => {
          this.detailInfoDataSet.data.forEach((element) => {
            if (obj[key]) {
              element[key] = obj[key];
            }
          });
          // 传给后端帮忙处理，因此把批量字段放在头上
          if (key === "neededDate" && obj[key]) {
            // 需求日期
            this.commonDataSet.data[0]["batchMaintainDate"] = obj[key];
          }
          if (key === "invOrganizationId" && obj[key]) {
            // 采购组织
            this.commonDataSet.data[0]["batchInvOrganizationId"] = obj[key];
          }
          if (key === "costId" && obj[key]) {
            // 成本中心
            this.commonDataSet.data[0]["batchCostId"] = obj[key];
          }
          if (key === "wbsCode" && obj[key]) {
            // WBS元素
            this.commonDataSet.data[0]["batchWbsCode"] = obj[key];
          }
          if (key === "innerPoNum" && obj[key]) {
            // 单据编号
            this.commonDataSet.data[0]["batchInnerPoNum"] = obj[key];
          }
        });
      }
      this.batchVisible = false;
    },
    // 保存
    save() {
      if (!this.commonDataSet.validate()) {
        // 头校验
        return;
      }
      if (!this.detailInfoDataSet.validate()) {
        // 行校验
        return;
      }
      this.$loading.show();
      if (this.type === "add") {
        createApi({
          ...this.commonDataSet.toData()[0],
          prLineList: this.detailInfoDataSet.toData(),
        })
          .then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: $T("hzero.common.notification.success").$D("操作成功"),
              });
              this.init(res.prHeaderId);
              this.type = "edit";
            }
          })
          .finally(() => {
            this.$loading.hide();
          });
      } else {
        // 需求日期个性化
        this.detailInfoDataSet.data.forEach((element) => {
          element["neededDate"] = dateFormat(
            element["neededDate"],
            "yyyy-MM-dd hh:mm:ss"
          );
        });
        updateApi({
          ...this.commonDataSet.toData()[0],
          currencyCode: "CNY",
          prLineList: this.detailInfoDataSet.toData(),
        })
          .then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: $T("hzero.common.notification.success").$D("操作成功"),
              });
              this.init(res.prHeaderId);
            }
          })
          .finally(() => {
            this.$loading.hide();
          });
      }
    },
    // 提交
    submit() {
      if (
        this.detailInfoDataSet.data &&
        this.detailInfoDataSet.data.length === 0
      ) {
        this.$notification.open({
          message: $T("sprm.common.view.message.mustHaveLines").$D(
            "该采购申请未填写行信息，无法提交，请确认"
          ),
        });
        return;
      }
      this.$loading.show();
      this.detailInfoDataSet.data.forEach((element) => {
        element["neededDate"] = dateFormat(
          element["neededDate"],
          "yyyy-MM-dd hh:mm:ss"
        );
      });
      // 预算金额校验
      checkBudgetApi([
        {
          ...this.commonDataSet.data[0],
          prLineList: this.detailInfoDataSet.data,
        },
      ])
        .then((check) => {
          if (check && check.failed) {
            this.$notification.open({ message: check.message });
          } else {
            submitApi({
              ...this.commonDataSet.data[0],
              prLineList: this.detailInfoDataSet.data,
            })
              .then((res) => {
                if (res && res.failed) {
                  this.$notification.open({ message: res.message });
                } else {
                  this.$notification.open({
                    message: $T("hzero.common.notification.success").$D(
                      "操作成功"
                    ),
                  });
                  this.$router.back();
                }
              })
              .finally(() => {
                this.$loading.hide();
              });
          }
        })
        .finally(() => {
          this.$loading.hide();
        });
    },
    // 删除
    deleteRecord() {
      if (this.prSourcePlatform !== "SRM") {
        return;
      }
      this.commonDataSet
        .removeRecords(this.commonDataSet.records)
        .then(() => {
          this.$notification.open({
            message: $T("hzero.common.notification.success").$D("操作成功"),
          });
          this.$router.back();
        })
        .catch((err) => {
          if (err && err.failed) {
            this.$notification.open({ message: err.message });
          }
        });
    },
    // 删除行
    deleteLine(data) {
      this.detailInfoDataSet
        .removeRecords(data)
        .then(() => {
          this.$notification.open({
            message: $T("hzero.common.notification.success").$D("操作成功"),
          });
          this.init(this.prHeaderId);
        })
        .catch((err) => {
          if (err && err.failed) {
            this.$notification.open({ message: err.message });
          }
        });
    },
  },
};
