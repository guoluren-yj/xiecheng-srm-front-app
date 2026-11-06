// 采购申请工作台 的页面
import {
  getActionsRecordApi,
  getApproveRecordApi,
  getPrDetailApi,
  getAttributeApi,
  queryLovData,
} from "../api";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { isArray } from "lodash";
import { dateFormat, getDynamicLabel } from "@/utils/index";
import { commonDs, executorDs, customListDs } from "../datasource/indexDs";
import lineDs from "../datasource/lineDs";
import uuid from "uuid";
export default {
  data() {
    return {
      commonDataSet: new DataSet(commonDs()), // 申请基础信息
      detailInfoDataSet: new DataSet(lineDs()), // 申请明细信息
      customAttributeDataSet: new DataSet(commonDs()), // 物料定制属性
      customSpecsDataSet: new DataSet(customListDs()), // 物料定制属性
      customSpecsVisiable: false,
      customVisible: false,
      uomControlFlag: 0,
      customPopupData: {},
      customSpecsPopup: {},
      executorDataSet: new DataSet(executorDs()), // 执行单据详情
      executorVisible: false,
      executorPopupData: {},
      actionRecordList: [], // 操作记录
      approveRecordList: [], // 审批记录
      showPage: true,
      prSourcePlatform: null,
    };
  },
  computed: {
    getColumns() {
      const currentTenant = SrmUtil.getTenantNum();
      let cuxBasicInfoDetail = [];
      // 标准二开埋点
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            {
              fieldCode: "displayPrNum",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.displayPrNum || "-"}</span>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "title",
              fieldName: $T("sprm.common.model.common.title").$D("标题"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "createByName",
              fieldName: $T("sprm.common.model.common.createByName").$D(
                "创建人"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("sprm.common.model.common.creationDate").$D(
                "创建时间"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "prTypeName",
              fieldName: $T("sprm.common.model.common.prTypeName").$D(
                "申请类型"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "originalCurrency",
              fieldName: $T("sprm.common.model.common.originalCurrency").$D(
                "原币币种"
              ),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "localCurrency",
              fieldName: $T("sprm.common.model.common.newCurrencyCode").$D(
                "本币币种"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "localCurrencyTaxSum",
              fieldName: $T(
                "sprm.common.model.common.localCurrencyTaxSum"
              ).$D("本币金额(含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "localCurrencyTaxSum",
                  item,
                  item.headerPriceHiddenFlag
                ),
            },
            {
              fieldCode: "amount",
              fieldName: $T("sprm.common.model.common.amount").$D("申请总额"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender("amount", item, item.headerPriceHiddenFlag),
            },
            {
              fieldCode: "prRequestedName",
              fieldName: $T("sprm.common.model.common.prRequestedName").$D(
                "申请人"
              ),
              fieldType: "TEXT",
              render: (val, item) =>
                `${item.prRequestedNum || ""}-${item.prRequestedName || ""}`,
            },
            {
              fieldCode: "requestDate",
              fieldName: $T("sprm.common.model.common.requestDate").$D(
                "申请日期"
              ),
              fieldType: "TEXT",
              render: (val) => val ? dateFormat(val) : "-",
            },
            {
              fieldCode: "unitName",
              fieldName: $T("sprm.common.model.common.unitName").$D(
                "所属部门"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.reqDesc").$D(
                "申请说明"
              ),
              fieldType: "TEXT",
            },
          ].concat(currentTenant === "SRM-WEILONG" ? cuxBasicInfoDetail : []);
        case "organization":
          return [
            {
              fieldCode: "companyName",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.companyName || "-"}</span>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "ouName",
              fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
              fieldType: "TEXT",
              required: false,
              formRow: 20,
            },
            {
              fieldCode: "purchaseOrgName",
              fieldName: $T("sprm.common.model.common.purchaseOrgName").$D(
                "采购组织"
              ),
              fieldType: "TEXT",
              required: false,
              formRow: 30,
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("sprm.common.model.common.purchaseAgentName").$D(
                "采购员"
              ),
              fieldType: "TEXT",
              required: false,
              formRow: 40,
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
            fieldType: "TEXT",
            fieldCode: "receiverAddressName",
            fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverTelNum",
            fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
            render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          }, {
            fieldType: "TEXT",
            fieldCode: "invoiceAddressName",
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
          }, ];
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
            fieldType: "TEXT",
            fieldCode: "invoiceMethodName",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
            fieldType: "TEXT",
            fieldCode: "invoiceTypeName",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
            fieldType: "TEXT",
            fieldCode: "invoiceTitleTypeName",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
            fieldType: "TEXT",
            fieldCode: "invoiceDetailTypeName",
          }, ];
        case "detailInfo":
          return [
            {
              fieldCode: "displayLineNum",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.displayLineNum || "-"}</span>
                  <SrmButton slot="right" type="warn">
                    {item.prLineStatusCodeMeaning || ""}
                  </SrmButton>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T(
                "sprm.common.model.common.invOrganizationName"
              ).$D("库存组织"),
              fieldType: "TEXT",
              formRow: 20,
            },
            {
              fieldCode: "itemCode",
              fieldName: $T("sprm.common.model.common.itemCode").$D(
                "物料编码"
              ),
              fieldType: "TEXT",
              formRow: 30,
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sprm.common.model.common.itemName").$D(
                "物料名称"
              ),
              fieldType: "TEXT",
              required: false,
              formRow: 40,
            },
            {
              fieldCode: "categoryName",
              fieldName: $T("sprm.common.model.common.categoryName").$D(
                "物料分类"
              ),
              fieldType: "TEXT",
              formRow: 50,
            },
            {
              fieldCode: "neededDate",
              fieldName: $T("sprm.common.model.common.neededDate").$D(
                "需求日期"
              ),
              fieldType: "TEXT",
              required: false,
              formRow: 60,
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.uomControlFlag, "quantity"),
              fieldType: "TEXT",
              required: false,
              formRow: 70,
            },
            {
              fieldCode: "uomCodeAndName",
              fieldName: getDynamicLabel(this.uomControlFlag, "uom"),
              fieldType: "TEXT",
              required: false,
              formRow: 80,
            },
            this.uomControlFlag && {
              fieldCode: "secondaryQuantity",
              fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
              fieldType: "TEXT",
              required: false,
              formRow: 70,
            },
            this.uomControlFlag && {
              fieldCode: "secondaryUomName",
              fieldName: $T("sprm.common.model.common.uomCodeAndName").$D(
                "单位"
              ),
              render: (val, item) => item.secondaryUomCodeAndName,
              fieldType: "TEXT",
              required: false,
              formRow: 80,
            },
            this.uomControlFlag && {
              fieldCode: "secondaryTaxInUnitPrice",
              fieldName: $T(
                "sprm.common.model.common.taxIncludedUnitPrice"
              ).$D("预估单价(含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "secondaryTaxInUnitPrice",
                  item,
                  item.linePriceHiddenFlag,
                  "number",
                ),
              formRow: 90,
            },
            {
              fieldCode: "taxIncludedUnitPrice",
              fieldName: getDynamicLabel(
                this.uomControlFlag,
                "taxIncludedUnitPrice"
              ),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "taxIncludedUnitPrice",
                  item,
                  item.linePriceHiddenFlag,
                  "number",
                ),
              formRow: 90,
            },
            {
              fieldCode: "taxIncludedLineAmount",
              fieldName: $T(
                "sprm.common.model.common.taxIncludedLineAmount"
              ).$D("行金额"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "taxIncludedLineAmount",
                  item,
                  item.linePriceHiddenFlag
                ),
              formRow: 100,
            },
            {
              fieldCode: "prRequestedName",
              fieldName: $T("sprm.common.model.common.prRequestedName").$D(
                "申请人"
              ),
              fieldType: "TEXT",
              render: (val, item) =>
                `${item.prRequestedNum || ""}-${item.prRequestedName || ""}`,
              formRow: 110,
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("sprm.common.model.common.purchaseAgentName").$D(
                "采购员"
              ),
              fieldType: "TEXT",
              formRow: 120,
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.remark").$D("备注"),
              fieldType: "TEXT",
              formRow: 130,
            },
            {
              fieldCode: "attachmentUuid",
              fieldName: $T("sprm.common.model.common.attachment").$D("附件"),
              fieldType: "UPLOAD",
              editor: false,
              formRow: 140,
            },
          ].concat(currentTenant === "SRM-XXJT" ? cuxBasicInfoDetail : []);
        case "attachInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "attachmentUuid",
              render: (val, _, other) =>
                <SrmFlex
                  class="attachment"
                  justify="between"
                  nativeOnClick={() => {
                    this.$attachment({
                      attachments: [
                        {
                          attachmentUuid: val,
                          title: this.$T(
                            "sprm.common.view.insideAttachment"
                          ).$D("内部附件"),
                          displayType:
                              this.type === "readOnly" ? "list" : "grid",
                          readonly: this.type === "readOnly",
                          showInfo: true,
                          uploadButton:
                              this.type === "readOnly" ? "none" : "fixed",
                        },
                      ],
                    });
                  }}
                >
                  <SrmFlex>
                    <span class="srm-icon icon-other" />
                    <srm-button type="brown" plain>
                      {other?.newFieldName ||
                          this.$T("sprm.common.view.insideAttachment").$D(
                            "内部附件"
                          )}
                    </srm-button>
                  </SrmFlex>
                  <span class="srm-icon icon-chevron-right" />
                </SrmFlex>,
              formRow: 10,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "externalAttachmentUuid",
              render: (val, _, other) =>
                <SrmFlex
                  class="attachment"
                  justify="between"
                  nativeOnClick={() => {
                    this.$attachment({
                      attachments: [
                        {
                          attachmentUuid: val,
                          title: this.$T(
                            "sprm.common.view.outsideAttachment"
                          ).$D("外部附件"),
                          displayType:
                              this.type === "readOnly" ? "list" : "grid",
                          readonly: this.type === "readOnly",
                          showInfo: true,
                          uploadButton:
                              this.type === "readOnly" ? "none" : "fixed",
                        },
                      ],
                    });
                  }}
                >
                  <SrmFlex>
                    <span class="srm-icon icon-other" />
                    <srm-button type="brown" plain>
                      {other?.newFieldName ||
                          this.$T("sprm.common.view.outsideAttachment").$D(
                            "外部附件"
                          )}
                    </srm-button>
                  </SrmFlex>
                  <span class="srm-icon icon-chevron-right" />
                </SrmFlex>,
              formRow: 20,
            },
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "displayPrNum",
              fieldName: $T("sprm.common.model.common.displayPrNum").$D(
                "采购申请编号"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "title",
              fieldName: $T("sprm.common.model.common.title").$D("标题"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "createByName",
              fieldName: $T("sprm.common.model.common.createByName").$D(
                "创建人"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "creationDate",
              fieldName: $T("sprm.common.model.common.creationDate").$D(
                "创建时间"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "prTypeName",
              fieldName: $T("sprm.common.model.common.prTypeName").$D(
                "申请类型"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "originalCurrency",
              fieldName: $T("sprm.common.model.common.originalCurrency").$D(
                "原币币种"
              ),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "localCurrency",
              fieldName: $T("sprm.common.model.common.newCurrencyCode").$D(
                "本币币种"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "localCurrencyTaxSum",
              fieldName: $T(
                "sprm.common.model.common.localCurrencyTaxSum"
              ).$D("本币金额(含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "localCurrencyTaxSum",
                  item,
                  item.headerPriceHiddenFlag
                ),
            },
            {
              fieldCode: "amount",
              fieldName: $T("sprm.common.model.common.amount").$D("申请总额"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender("amount", item, item.headerPriceHiddenFlag),
            },
            {
              fieldCode: "prRequestedName",
              fieldName: $T("sprm.common.model.common.prRequestedName").$D(
                "申请人"
              ),
              fieldType: "TEXT",
              render: (val, item) =>
                `${item.prRequestedNum || ""}-${item.prRequestedName || ""}`,
            },
            {
              fieldCode: "requestDate",
              fieldName: $T("sprm.common.model.common.requestDate").$D(
                "申请日期"
              ),
              fieldType: "TEXT",
              render: (val) => val ? dateFormat(val) : "-",
            },
            {
              fieldCode: "unitName",
              fieldName: $T("sprm.common.model.common.unitName").$D(
                "所属部门"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.reqDesc").$D(
                "申请说明"
              ),
              fieldType: "TEXT",
            },
          ].concat(currentTenant === "SRM-WEILONG" ? cuxBasicInfoDetail : []);
        case "organizationDetail":
          return [
            {
              fieldCode: "companyName",
              fieldName: $T("sprm.common.model.common.companyName").$D(
                "公司"
              ),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "ouName",
              fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "purchaseOrgName",
              fieldName: $T("sprm.common.model.common.purchaseOrgName").$D(
                "采购组织"
              ),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("sprm.common.model.common.purchaseAgentName").$D(
                "采购员"
              ),
              fieldType: "TEXT",
            },
          ];
        case "deliveryInfoDetail":
          return [ {
            fieldType: "TEXT",
            fieldCode: "receiverContactName",
            fieldName: this.$T("sprm.common.model.common.acceptPerson").$D("收货联系人"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverAddressName",
            fieldName: this.$T("sprm.common.model.common.receiverAddress").$D("收货方地址"),
          }, {
            fieldType: "TEXT",
            fieldCode: "receiverTelNum",
            fieldName: this.$T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
            render: (val, item) => val ? `${item.internationalTelCode || ""} ${val}` : "-",
          }, {
            fieldType: "TEXT",
            fieldCode: "invoiceAddressName",
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
            fieldType: "TEXT",
            fieldCode: "invoiceMethodName",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceTitleTypeMeaning").$D("发票形式"),
            fieldType: "TEXT",
            fieldCode: "invoiceTypeName",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceType").$D("发票类型"),
            fieldType: "TEXT",
            fieldCode: "invoiceTitleTypeName",
          }, {
            fieldName: this.$T("sprm.common.model.common.invoiceDetail").$D("发票明细"),
            fieldType: "TEXT",
            fieldCode: "invoiceDetailTypeName",
          }, ];
        case "detailInfoDetail":
          return [
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sprm.common.model.common.displayLineNum").$D(
                "行号"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T(
                "sprm.common.model.common.invOrganizationName"
              ).$D("库存组织"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "itemCode",
              fieldName: $T("sprm.common.model.common.itemCode").$D(
                "物料编码"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sprm.common.model.common.itemName").$D(
                "物料名称"
              ),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "itemModel",
              fieldName: $T("sprm.common.model.common.itemModel").$D("型号"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "itemSpecs",
              fieldName: $T("sprm.common.model.common.itemSpecs").$D("规格"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "categoryName",
              fieldName: $T("sprm.common.model.common.categoryName").$D(
                "物料分类"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "customMadeFlag",
              fieldName: $T("sprm.common.model.common.customMadeFlag").$D(
                "是否定制"
              ),
              render: (val) =>
                val === 1 ?
                  $T("hipspfm.common.status.yes").$D("是") :
                  $T("hipspfm.common.status.no").$D("否"),
            },
            {
              fieldCode: "customAttributeList",
              fieldName: $T(
                "sprm.common.model.common.customAttributeList"
              ).$D("物料定制属性"),
              render: (val, item) =>
                item.customMadeFlag === 1 ?
                  <span style="color: var(--color-other-default-b)">
                    {$T("hipspfm.common.button.view").$D("查看")}
                  </span> :
                  "-",
              callBack: (record) => {
                this.openPopup("customAttributeList", record);
              },
            },
            {
              fieldCode: "neededDate",
              fieldName: $T("sprm.common.model.common.neededDate").$D(
                "需求日期"
              ),
              fieldType: "TEXT",
              required: false,
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
              fieldType: "TEXT",
            },
            {
              fieldCode: "receiveContactName",
              fieldType: "TEXT",
            },
            {
              fieldCode: "internationalTelCode",
              fieldType: "TEXT",
            },
            {
              fieldCode: "receiveTelNum",
              fieldType: "TEXT",
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.uomControlFlag, "quantity"),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "uomCodeAndName",
              fieldName: getDynamicLabel(this.uomControlFlag, "uom"),
              fieldType: "TEXT",
              required: false,
            },
            this.uomControlFlag && {
              fieldCode: "secondaryUomName",
              fieldName: $T("sprm.common.model.common.uomCodeAndName").$D(
                "单位"
              ),
              render: (val, item) => item.secondaryUomCodeAndName,
              fieldType: "TEXT",
              required: false,
            },
            this.uomControlFlag && {
              fieldCode: "secondaryTaxInUnitPrice",
              fieldName: $T(
                "sprm.common.model.common.taxIncludedUnitPrice"
              ).$D("预估单价(含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "secondaryTaxInUnitPrice",
                  item,
                  item.linePriceHiddenFlag,
                  "number",
                ),
            },
            this.uomControlFlag && {
              fieldCode: "secondaryQuantity",
              fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
              fieldType: "TEXT",
              required: false,
            },
            {
              fieldCode: "taxCode",
              fieldName: $T("sprm.common.model.common.taxLov").$D("税种"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("sprm.common.model.common.taxRate").$D("税率"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("sprm.common.model.common.currencyCode").$D(
                "币种"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "taxIncludedUnitPrice",
              fieldName: getDynamicLabel(
                this.uomControlFlag,
                "taxIncludedUnitPrice"
              ),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "taxIncludedUnitPrice",
                  item,
                  item.linePriceHiddenFlag,
                  "number"
                ),
            },
            {
              fieldCode: "lastPurchasePrice",
              fieldName: $T("sprm.common.model.common.lastPurchasePrice").$D(
                "上次采购单价"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "taxIncludedLineAmount",
              fieldName: $T(
                "sprm.common.model.common.taxIncludedLineAmount"
              ).$D("行金额"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "taxIncludedLineAmount",
                  item,
                  item.linePriceHiddenFlag
                ),
            },
            {
              fieldCode: "localCurrencyNoTaxSum",
              fieldName: $T(
                "sprm.common.model.common.localCurrencyNoTaxSum"
              ).$D("本币金额(不含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "localCurrencyNoTaxSum",
                  item,
                  item.linePriceHiddenFlag
                ),
            },
            {
              fieldCode: "localCurrencyTaxSum",
              fieldName: $T(
                "sprm.common.model.common.localCurrencyTaxSum"
              ).$D("本币金额(含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "localCurrencyTaxSum",
                  item,
                  item.linePriceHiddenFlag
                ),
            },
            {
              fieldCode: "localCurrencyNoTaxUnit",
              fieldName: $T(
                "sprm.common.model.common.localCurrencyNoTaxUnit"
              ).$D("本币单价(不含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "localCurrencyNoTaxUnit",
                  item,
                  item.linePriceHiddenFlag,
                  "number"
                ),
            },
            {
              fieldCode: "localCurrencyTaxUnit",
              fieldName: $T(
                "sprm.common.model.common.localCurrencyTaxUnit"
              ).$D("本币单价(含税)"),
              fieldType: "TEXT",
              render: (val, item) =>
                this.amountRender(
                  "localCurrencyTaxUnit",
                  item,
                  item.linePriceHiddenFlag,
                  "number"
                ),
            },
            {
              fieldCode: "supplierCompanyName",
              fieldName: $T("sprm.common.model.common.supplierCompanyId").$D(
                "建议供应商"
              ),
              fieldType: "TEXT",
              render: (val, item) => item.displaySupplierName
            },
            {
              fieldCode: "prRequestedName",
              fieldName: $T("sprm.common.model.common.prRequestedName").$D(
                "申请人"
              ),
              fieldType: "TEXT",
              render: (val, item) =>
                `${item.prRequestedNum || ""}-${item.prRequestedName || ""}`,
            },
            {
              fieldCode: "purchaseAgentName",
              fieldName: $T("sprm.common.model.common.purchaseAgentName").$D(
                "采购员"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "executorName",
              fieldName: $T("sprm.common.model.common.executorName").$D(
                "需求执行人"
              ),
              fieldType: "TEXT",
            },
            {
              fieldCode: "remark",
              fieldName: $T("sprm.common.model.common.remark").$D("备注"),
              fieldType: "TEXT",
            },
            {
              fieldCode: "attachmentUuid",
              fieldName: $T("sprm.common.model.common.attachment").$D("附件"),
              fieldType: "UPLOAD",
              editor: false,
            },
            {
              fieldCode: "executorRecordDetail",
              fieldName: $T(
                "sprm.common.model.common.executorRecordDetail"
              ).$D("执行单据详情"),
              render: () =>
                <span style="color: var(--color-other-default-b)">
                  {$T("hipspfm.common.button.view").$D("查看")}
                </span>,
              callBack: (record) => {
                this.openPopup("executorRecordDetail", record);
              },
            },
          ];
        case "customAttributeList":
          return [
            {
              fieldCode: "attributeName",
              fieldName: $T("sprm.common.model.common.attributeName").$D(
                "属性名称"
              ),
            },
            {
              fieldCode: "attributeValue",
              fieldName: $T("sprm.common.model.common.attributeValue").$D(
                "属性值"
              ),
              fieldType: this.type === "readOnly" ? "TEXT" : "INPUT",
            },
          ];
        case "executorRecordDetail":
          return [
            {
              fieldCode: "displayPrNum",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.displayPrNum || "-"}</span>
                  <span slot="right">{item.billStatusMeaning || ""}</span>
                </SrmListHeader>,
              formRow: 10,
            },
            {
              fieldCode: "lineNum",
              fieldName: $T("sprm.common.model.common.lineNum").$D("行号"),
              formRow: 20,
            },
            {
              fieldCode: "executionBillLineNum",
              fieldName: $T(
                "sprm.common.model.common.executionBillLineNum"
              ).$D("执行单据行号"),
              formRow: 20,
            },
            {
              fieldCode: "executionBillNum",
              fieldName: $T("sprm.common.model.common.executionBillNum").$D(
                "执行单据编号"
              ),
              formRow: 30,
            },
            {
              fieldCode: "executeBillTypeMeaning",
              fieldName: $T(
                "sprm.common.model.common.executeBillTypeMeaning"
              ).$D("执行单据类型"),
              formRow: 40,
            },
            {
              fieldCode: "supplier",
              fieldName: $T("sprm.common.model.common.supplier").$D("供应商"),
              formRow: 40,
            },
            {
              fieldCode: "executeQuantity",
              fieldName: $T("sprm.common.model.common.executeQuantity").$D(
                "有效数量"
              ),
              formRow: 50,
            },
            {
              fieldCode: "needDate",
              fieldName: $T("sprm.common.model.common.needDate").$D(
                "需求日期"
              ),
              render: (val) => val ? dateFormat(val) : "-",
              formRow: 50,
            },
          ];
        case "customSpecsJson":
          return [
            {
              fieldCode: "componentName",
              fieldName: $T("sprm.common.model.common.attributeName").$D(
                "属性名称"
              ),
            },
            {
              fieldCode: "cpValue",
              fieldName: $T("sprm.common.model.common.attributeValue").$D(
                "属性值"
              ),
              fieldType: "TEXT",
              render: (val, item) => {
                const attachments = [ { attachmentUuid: val, title: $T("sprm.common.model.common.attachment").$D("附件"), readonly: true } ];
                return [ "IMAGE", "UPLOAD" ].includes(item.componentType) ?
                  <SrmAttachmentButton
                    attachments={attachments}
                    show-total
                    bucketName="private-bucket"
                    readonly
                  /> :
                  val;
              },
            },
          ];
        default:
          return [];
        }
      };
    },
  },
  mounted() {
    // 编辑/详情
    if (this.prHeaderId) {
      this.init(this.prHeaderId);
    }
  },
  methods: {
    // 编辑和详情 初始化
    async init(prHeaderId) {
      if (prHeaderId) {
        try {
          // 查询基础信息
          const item = await getPrDetailApi(prHeaderId);
          // 编辑页面字段调整
          item[
            "prRequestedNumAndName"
          ] = `${item.prRequestedNum}-${item.prRequestedName}`;
          item["currencyCode"] = item.originalCurrency;
          if (!item["attachmentUuid"]) {
            item["attachmentUuid"] = uuid();
          }
          if (!item["externalAttachmentUuid"]) {
            item["externalAttachmentUuid"] = uuid();
          }
          this.prSourcePlatform = item.prSourcePlatform;
          this.commonDataSet.reset();
          this.headerInfo = { ...item };
          this.commonDataSet.setData([ { ...item } ]);
          if (item.prSourcePlatform === "E-COMMERCE") {
            this.commonDataSet.locate(0);
            if (String(item.newMallFlag) === "0") {
              this.commonDataSet.current.getField("receiverAddressName").lovCode = "SCEC.ADDRESS_LIST";
              this.commonDataSet.current.getField("invoiceTitleTypeName").options.queryParams["companyId"] = item.companyId;
            }
            queryLovData({
              lovCode: "SMAL.EC_INVOICE_METHOD_TYPE_VAL",
              valueType: "INVOICE_METHOD",
              tenantId: SrmUtil.getTenantId(),
              companyId: item.companyId,
              platformCode: item.platformCode,
            }).then((res) => {
              if (!res?.failed) {
                this.commonDataSet.current.getField("invoiceMethodName").options.listData = res;
                // this.commonDataSet.current.setField("invoiceMethodCode", item.invoiceMethodCode);
                // this.commonDataSet.current.setField("invoiceMethodName", item.invoiceMethodName);
              }
            });
            queryLovData({
              lovCode: "SMAL.EC_CLIENT_VALUES",
              valueType: "INVOICE_TITLE",
              tenantId: SrmUtil.getTenantId(),
              companyId: item.companyId,
              platformCode: item.platformCode,
            }).then((res) => {
              if (!res?.failed) {
                this.commonDataSet.current.getField("invoiceTypeName").options.listData = res;
              }
            });
            queryLovData({
              lovCode: "SMAL.EC_INVOICE_METHOD_TYPE_VAL",
              valueType: "INVOICE_TITLE",
              tenantId: SrmUtil.getTenantId(),
              companyId: item.companyId,
              platformCode: item.platformCode,
            }).then((res) => {
              if (!res?.failed) {
                this.commonDataSet.current.getField("invoiceTitleTypeName").options.listData = res;
              }
            });
            queryLovData({
              lovCode: "SMAL.EC_CLIENT_VALUES",
              valueType: "INVOICE_DETAIL",
              tenantId: SrmUtil.getTenantId(),
              companyId: item.companyId,
              platformCode: item.platformCode,
            }).then((res) => {
              if (!res?.failed) {
                this.commonDataSet.current.getField("invoiceDetailTypeName").options.listData = res;
              }
            });
          }

          // 行信息查询
          this.detailInfoDataSet.addPathParameter("prHeaderId", prHeaderId);
          if (this.type !== "readOnly") {
            // 编辑查询全部行，方便批量编辑
            this.detailInfoDataSet.addQueryParameter("size", "100000");
          }
          await this.detailInfoDataSet.refresh();
          // 操作记录查询
          const records = await getActionsRecordApi(prHeaderId);
          /**
           * 动作为【新增行/删除行】的操作记录直接隐藏，
           * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
           * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
           * 动作为【分配】的操作记录不允许合并
           * 动作为【更新/变更】的操作记录 对字段进行合并记录
           */
          let data = [];
          (isArray(records) ? records : []).map((res) => {
            if (
              res.processTypeCode !== "NEWLINE" &&
              res.processTypeCode !== "DELLINE"
            ) {
              if (res.processTypeCode === "ASSIGNED") {
                data.push({ ...res, processRemark: res.processTypeCodeMeaning });
              } else if (res.processTypeCode === "UPDATE") {
                if (
                  data.findIndex((val) => val.batchNo === res.batchNo) === -1
                ) {
                  // 拼接更新的信息
                  let updateRecords = [];
                  records.map((val) => {
                    if (val.batchNo === res.batchNo) {
                      updateRecords.push(val);
                    }
                  });

                  let processRemarks =
                  updateRecords.map(
                    (u) =>
                      `\n${u.processUserName ?? ""} ${
                        u.processRemark ?
                          u.processTypeCodeMeaning :
                          `${$T("sodr.common.model.common.for").$D("将")}【${u.changeFieldMeaning ?? ""}】${$T("sodr.common.model.common.from").$D("由")}【${
                            u.oldValue ?? ""
                          }】${$T("sodr.common.model.common.to").$D("改成")}【${
                            u.newValue ?? ""
                          }】`
                      } ${$T("sprm.common.model.common.docLineNum").$D("行号")}【${
                        u.displayLineNum ?? "-"
                      }】`
                  ) || [];

                  data.push({
                    ...res,
                    processRemark: processRemarks.join("\n"),
                    processedDate:
                      updateRecords?.[0]?.processedDate ?? res?.processedDate,
                  });
                }
              } else if (
                data.findIndex(
                  (val) =>
                    val.processedDate === res.processedDate &&
                    val.batchNo === res.batchNo
                ) === -1
              ) {
                if (res.processTypeCode === "CHANGE") {
                  // 拼接变更的信息
                  let updateRecords = [];
                  records.map((val) => {
                    if (val.batchNo === res.batchNo) {
                      updateRecords.push(val);
                    }
                  });
                  let processRemarks =
                  updateRecords.map(
                    (u) =>
                      `\n${u.processUserName ?? ""} ${
                        u.processRemark ?
                          u.processTypeCodeMeaning :
                          `${$T("sodr.common.view.let").$D("将")}【${u.changeFieldMeaning ?? ""}】${$T("sodr.common.model.common.from").$D("由")}【${
                            u.oldValue ?? ""
                          }】${$T("sodr.common.model.common.to").$D("改成")}【${
                            u.newValue ?? ""
                          }】`
                      } ${$T("sprm.common.model.common.docLineNum").$D("行号")}【${
                        u.displayLineNum ?? "-"
                      }】`
                  ) || [];
                  data.push({
                    ...res,
                    processRemark: processRemarks.join("\n"),
                  });
                } else {
                  data.push({ ...res, processRemark:  res.processTypeCodeMeaning });
                }
              }
            }
          });
          this.actionRecordList = data.map((val) => ({
            ...val,
            status: {
              type: "info",
              text: val.processTypeCodeMeaning,
            },
          }));
          console.log(this.actionRecordList, records);

          // 审批记录查询
          const approveData = await getApproveRecordApi(prHeaderId);
          if (!(approveData && isArray(approveData))) {
            this.approveRecordList = [];
          }
          const prHistoricTaskExtList =
            approveData?.[0]?.prHistoricTaskExtList ?? [];

          this.approveRecordList = prHistoricTaskExtList?.reverse() || [];

          this.commonDataSet.data["prLineList"] = this.detailInfoDataSet.data;
          if (this.type !== "readOnly") {
            // 给LOV字段赋查询参数字段
            this.setQueryParams([]);
          }
        } catch (error) {
          // this.$notification.open({
          //   message: error,
          // });
        }
      } else {
        this.showPage = false;
        this.$notification.open({
          message: $T("hzero.common.notification.noShow.tips").$D(
            "该单据当前状态不可查看"
          ),
        });
      }
    },
    // eslint-disable-next-line valid-jsdoc
    /**
     * 金额精度控制+金额隐藏
     * @param {字段名} fieldCode
     * @param {单据} record
     * @param {金额隐藏标识} amountDisplayFlag
     * @returns
     */
    amountRender(fieldCode = "", record = {}, amountDisplayFlag = 0, type) {
      // 金额隐藏
      if (amountDisplayFlag === 1) {
        return record[`${fieldCode}Meaning`] || "***";
      }

      // 金额精度
      const newValue = SrmUtil.getNumberLocalized(
        record[fieldCode],
        record.localFinancialPrecision
      );
      return type === "number" && newValue ?
        Number(String(newValue).replace(/,/g, "")) :
        SrmUtil.getNumberLocalized(
          record[fieldCode],
          record.localFinancialPrecision
        );
    },
    // 查看单据 弹框
    async openPopup(name, item) {
      switch (name) {
      // 物料定制属性
      case "customAttributeList":
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
        break;
        // 执行单据详情
      case "executorRecordDetail":
        this.executorDataSet.addQueryParameter("prLineId", item.prLineId);
        this.executorDataSet.refresh();
        this.executorPopupData = {
          title: this.getLanguageDefine(name),
          columns: name,
          code: name,
        };
        this.executorVisible = true;
        break;
      // 定制品属性
      case "customSpecsJson":
        this.customSpecsDataSet.setData(item.customSpecsJson ? JSON.parse(item.customSpecsJson) : []);
        this.customSpecsPopup = {
          title: this.getLanguageDefine(name),
          columns: name,
          code: name,
        };
        this.customSpecsVisiable = true;
        break;
      default:
        break;
      }
    },
  },
};
