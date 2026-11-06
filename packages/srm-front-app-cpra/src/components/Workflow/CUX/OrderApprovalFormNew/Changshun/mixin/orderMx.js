// 订单相关的页面 - 公共部分
import {
  getOrderHeaderApi,
  getPoProcessActions,
  queryDoubleUomConfigApi
} from "../api";
import { DataSet, SrmUtil, $T, SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import { commonDs, lineDs } from "../datasource";
import { dateFormat, getDynamicLabel } from "@/utils/index";

/*
 * 金额格式化
 * @param {Number} aumont 金额
 * @param {Number} precision 精度
 * @param {Boolean} isSupplement 是否补0
 * @returns
 */
export function formatAumont(aumont, precision, isSupplement) {
  if (isNaN(parseFloat(aumont))) {
    return null;
  }
  const decimal = String(aumont).split(".")[1];
  let newPrecision = Number(precision);
  newPrecision = isNaN(newPrecision) ? null : newPrecision > 20 ? 20 : newPrecision;
  if ((decimal && decimal.length && decimal.length < newPrecision || !decimal) && !isSupplement) {
    newPrecision = null;
  }
  return SrmMath.toFormat(aumont, newPrecision, BigNumber.ROUND_HALF_CEIL);
}

const SHIED_FIELDS = [
  "amount",
  "taxIncludeAmount",
  "unitPrice",
  "enteredTaxIncludedPrice",
  "lineAmount",
  "taxIncludedLineAmount",
  "domesticTaxIncludedPrice",
  "domesticUnitPrice",
  "domesticTaxIncludedLineAmount",
  "domesticLineAmount"
];

export default {
  data() {
    return {
      commonDataSet: new DataSet(commonDs()), // 订单头信息
      orderLineDataSet: new DataSet(lineDs({ poHeaderId:this.$route.query.poHeaderId || this.parameters.poHeaderId })), // 订单行信息
      actionRecordList: [], // 操作记录
      popupData: {},
      visiblePopup: false,
      showPage: true,
      camp: 1, // 采购方1，供应商2 订单审批默认传采购方1
      sortType: 0, // 没有用
      isDoubleUnit: false,
      tabs: [
        this.$T("sodr.common.model.common.changeLineDisplay").$D(
          "仅展示变更行"
        ),
        this.$T("sodr.common.model.common.allDisplay").$D("全部行")
      ]
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "orderHeadInfo":
          return [
            {
              fieldCode: "head",
              fieldType: "EMPTY",
              render: (val, item) =>
                <SrmListHeader>
                  <span>{item.displayPoNum}</span>
                </SrmListHeader>,
              formRow: 10
            },
            {
              fieldCode: "companyName",
              fieldName: $T("sodr.common.model.common.company").$D("公司"),
              formRow: 20,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "supplierName",
              fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
              formRow: 30,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.supplierCompanyNum"
              ).$D("供应商编码"),
              fieldCode: "supplierCode",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.supplierSiteId"
              ).$D("供应商地址"),
              fieldCode: "supplierSiteName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "poTypeDesc",
              fieldName: $T("sodr.common.model.common.poTypeCodeMeaning").$D(
                "订单类型"
              ),
              formRow: 40,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "agentName",
              fieldName: $T("sodr.common.model.common.agentName").$D(
                "采购员"
              ),
              formRow: 40,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "purchaseOrgName",
              fieldName: $T(
                "sodr.common.model.common.purOrganizationName"
              ).$D("采购组织"),
              formRow: 50,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("sodr.common.model.common.currencyCode").$D(
                "币种"
              ),
              formRow: 70,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },

            {
              fieldName: this.$T("sodr.common.model.common.releaseNum").$D(
                "发放号"
              ),
              fieldCode: "releaseNum"
            },
            {
              fieldCode: "versionNum",
              fieldName: $T("sodr.common.model.common.versionNum").$D(
                "版本号"
              ),
              formRow: 70,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "taxIncludeAmount",
              fieldName: $T(
                "sodr.common.model.common.newTaxIncludeAmount"
              ).$D("金额(含税)"),
              render: (val, item, field) => {
                const dom = this.amountRender(
                  "taxIncludeAmount",
                  item,
                  item.priceShieldFlag
                );
                return this.renderChangeTip(field, item, dom);
              },
              formRow: 80
            },
            {
              fieldCode: "amount",
              fieldName: $T("sodr.common.model.common.newAmount").$D(
                "金额(不含税)"
              ),
              render: (val, item, field) => {
                const dom = this.amountRender(
                  "amount",
                  item,
                  item.priceShieldFlag
                );
                return this.renderChangeTip(field, item, dom);
              },
              formRow: 80
            },
            {
              fieldName: this.$T("sodr.common.model.common.releasedDate").$D(
                "发布时间"
              ),
              fieldCode: "releasedDate",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.receiverAddressName"
              ).$D("收货方地址"),
              fieldCode: "shipToLocationAddress",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.billToLocationAddress"
              ).$D("收单方地址"),
              fieldCode: "billToLocationAddress",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.termsName").$D(
                "付款条款"
              ),
              fieldCode: "termsName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.erpContractNum"
              ).$D("合同编号"),
              fieldCode: "erpContractNum",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.totalQuantity").$D(
                "总数量"
              ),
              fieldType: "INPUT_NUMBER",
              fieldCode: "quantityTotal",
              editor: false
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.remark").$D("订单摘要"),
              formRow: 90,
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            }
          ];
        case "basicInfo":
          return [
            {
              fieldCode: "displayLineNum",
              align: "center",
              fieldName: $T("sodr.common.model.common.orderLineNum").$D("订单行号"),
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sodr.common.model.common.itemDescription").$D("物料名称"),
            },
            {
              fieldCode: "specifications",
              fieldName: $T("sodr.common.model.common.itemSpecs").$D("规格"),
            },
            {
              fieldCode: "quantity",
              fieldName: $T("sodr.common.model.common.quantity").$D("数量"),
              render: (val, item) => <srm-text-field>{formatAumont(val, item.uomPrecision, false)}</srm-text-field>
            },
            {
              fieldCode: "enteredTaxIncludedPrice",
              fieldName: $T("sodr.common.model.common.taxIncludedUnitPrice").$D("单价（含税）"),
              render: (val, item) => <srm-text-field>{formatAumont(val, item.defaultPrecision, false)}</srm-text-field>
            },
            {
              fieldCode: "uomCodeAndName",
              fieldName: $T("sodr.common.model.common.primaryUomCode").$D("单位"),
            },
            {
              fieldCode: "needByDate",
              width:300,
              align:"left",
              fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
              render:(val) => <srm-text-field>{dateFormat(val)}</srm-text-field>,
            },
            {
              fieldCode: "taxIncludedLineAmount",
              width:350,
              fieldName: $T("sodr.common.model.common.taxIncludedLineAmount1").$D("行金额（含税）"),
              render: (val, item) => <srm-text-field>{formatAumont(val, item.financialPrecision, true)}</srm-text-field>
            },
          ];
        case "orderHeadInfoDetail":
          return [
            {
              fieldCode: "displayPoNum",
              fieldName: $T("sodr.common.model.common.displayPoNum").$D(
                "订单号"
              )
            },
            {
              fieldName: this.$T("sodr.common.model.common.supplier").$D(
                "供应商"
              ),
              fieldCode: "supplierName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.poTypeCode").$D(
                "订单类型"
              ),
              fieldCode: "poTypeDesc",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.agentName").$D(
                "采购员"
              ),
              fieldCode: "agentName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.purOrganizationId"
              ).$D("采购组织"),
              fieldCode: "purchaseOrgName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.currencyName").$D(
                "币种"
              ),
              fieldCode: "currencyCode",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.versionNumber").$D(
                "版本号"
              ),
              fieldCode: "versionNum",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "taxIncludeAmount",
              fieldName: $T(
                "sodr.common.model.common.newTaxIncludeAmount"
              ).$D("金额(含税)"),
              render: (val, item, field) => {
                const dom = this.amountRender(
                  "taxIncludeAmount",
                  item,
                  item.priceShieldFlag
                );
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "amount",
              fieldName: $T("sodr.common.model.common.newAmount").$D(
                "金额(不含税)"
              ),
              render: (val, item, field) => {
                const dom = this.amountRender(
                  "amount",
                  item,
                  item.priceShieldFlag
                );
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.remark").$D("订单摘要"),
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.supplierCompanyNum"
              ).$D("供应商编码"),
              fieldCode: "supplierCode",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.supplierSiteId"
              ).$D("供应商地址"),
              fieldCode: "supplierSiteName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.releaseNum").$D(
                "发放号"
              ),
              fieldCode: "releaseNum"
            },
            {
              fieldName: this.$T("sodr.common.model.common.releasedDate").$D(
                "发布时间"
              ),
              fieldCode: "releasedDate",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.receiverAddressName"
              ).$D("收货方地址"),
              fieldCode: "shipToLocationAddress",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.billToLocationAddress"
              ).$D("收单方地址"),
              fieldCode: "billToLocationAddress",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.termsName").$D(
                "付款条款"
              ),
              fieldCode: "termsName",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T(
                "sodr.common.model.common.erpContractNum"
              ).$D("合同编号"),
              fieldCode: "erpContractNum",
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldName: this.$T("sodr.common.model.common.totalQuantity").$D(
                "总数量"
              ),
              fieldType: "INPUT_NUMBER",
              fieldCode: "quantityTotal",
              editor: false
            }
          ];
        case "basicInfoDetail":
          return [
            {
              fieldCode: "displayLineNum",
              fieldName: $T("sodr.common.model.common.displayLineNum").$D(
                "行号"
              )
            },
            {
              fieldCode: "itemName",
              fieldName: $T("sodr.common.model.common.itemName").$D(
                "物料名称"
              ),
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "quantity",
              fieldName: getDynamicLabel(this.isDoubleUnit, "quantity"),
              render: (val, record, field) => {
                const dom = SrmUtil.getNumberPrecision(
                  new BigNumber(val),
                  null
                );
                if (val && val !== 0) {
                  return this.renderChangeTip(field, record, dom);
                }
              }
            },
            this.isDoubleUnit && {
              fieldCode: "secondaryQuantity",
              fieldName: $T("sodr.common.model.common.newQuantity").$D(
                "数量"
              ),
              render: (val, record, field) => {
                const dom = SrmUtil.getNumberPrecision(
                  new BigNumber(val),
                  null
                );
                if (val && val !== 0) {
                  return this.renderChangeTip(field, record, dom);
                }
              }
            },
            {
              fieldCode: "attachmentUuid",
              fieldName: $T("sodr.common.model.common.attachmentUuid").$D(
                "行附件"
              ),
              fieldType: "UPLOAD"
            },
            {
              fieldCode: "unitPrice",
              fieldName: $T("sodr.common.model.common.unitPrice").$D(
                "单价(不含税)"
              ),
              render: (val, record, field) => {
                const dom = SrmUtil.getNumberPrecision(
                  new BigNumber(val),
                  null
                );
                const _dom = record.priceShieldFlag === 1 ? "***" : dom;
                if (val && val !== 0) {
                  return this.renderChangeTip(field, record, _dom);
                }
              }
            },
            {
              fieldCode: "enteredTaxIncludedPrice",
              fieldName: $T(
                "sodr.common.model.common.newEnteredTaxIncludedPrice"
              ).$D("原币单价(含税)"),
              render: (val, record, field) => {
                const dom = SrmUtil.getNumberPrecision(
                  new BigNumber(val),
                  null
                );
                const _dom = record.priceShieldFlag === 1 ? "***" : dom;
                if (val && val !== 0) {
                  return this.renderChangeTip(field, record, _dom);
                }
              }
            },
            {
              fieldCode: "lineAmount",
              fieldName: $T("sodr.common.model.common.newLineAmount").$D(
                "金额(不含税)"
              ),
              render: (val, record, field) => {
                const _dom = this.amountRender(
                  "lineAmount",
                  record,
                  record.priceShieldFlag
                );
                if (val && val !== 0) {
                  return this.renderChangeTip(field, record, _dom);
                }
              }
            },
            {
              fieldCode: "taxIncludedLineAmount",
              fieldName: $T(
                "sodr.common.model.common.newTaxIncludedLineAmount"
              ).$D("金额(含税)"),
              render: (val, record, field) => {
                const dom = this.amountRender(
                  "taxIncludedLineAmount",
                  record,
                  record.priceShieldFlag
                );
                if (val && val !== 0) {
                  return this.renderChangeTip(field, record, dom);
                }
              }
            },
            {
              fieldCode: "taxRate",
              fieldName: $T("sodr.common.model.common.newTaxRate").$D(
                "税率（%）"
              ),
              render: (val, item, field) =>
                val ? this.renderChangeTip(field, item, val) : "0"
            },
            {
              fieldCode: "currencyCode",
              fieldName: $T("sodr.common.model.common.currencyCode").$D(
                "币种"
              ),
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "invOrganizationName",
              fieldName: $T(
                "sodr.common.model.common.invOrganizationName"
              ).$D("收货组织"),
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "needByDate",
              fieldName: $T("sodr.common.model.common.needByDate").$D(
                "需求日期"
              ),
              render: (val, item, field) => {
                const dom = val ? dateFormat(val) : "-";
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "remark",
              fieldName: $T("sodr.common.model.common.purchaseLineRemark").$D(
                "采购方行备注"
              ),
              render: (val, item, field) => {
                const dom = val;
                return this.renderChangeTip(field, item, dom);
              }
            },
            {
              fieldCode: "sourceNumAndLine",
              fieldName: $T(
                "sodr.common.model.common.newSourceNumAndLine"
              ).$D("寻源单号-行号"),
              render: (val, item) =>
                <a style='color: blue' onClick={() => this.goSource(item)}>
                  {val || item.sourceCodeNum}
                </a>
            }
          ];
        case "attachInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "purchaserInnerAttachmentUuid",
              render: (val) =>
                <SrmFlex
                  class='attachment'
                  justify='between'
                  nativeOnClick={() => {
                    this.$attachment({
                      attachments: [
                        {
                          attachmentUuid: val,
                          title: $T("sodr.common.view.enterAttachment").$D(
                            "内部附件"
                          ),
                          readonly: true,
                          showInfo: true,
                          uploadButton: "none"
                        }
                      ]
                    });
                  }}
                >
                  <SrmFlex>
                    <span class='srm-icon icon-other' />
                    <srm-button type='brown' plain>
                      {$T("sodr.common.view.enterAttachment").$D("内部附件")}
                    </srm-button>
                  </SrmFlex>
                  <span class='srm-icon icon-chevron-right' />
                </SrmFlex>,
              formRow: 10
            },
            {
              fieldType: "EMPTY",
              fieldCode: "attachmentUuid",
              render: (val) =>
                <SrmFlex
                  class='attachment'
                  justify='between'
                  nativeOnClick={() => {
                    this.$attachment({
                      attachments: [
                        {
                          attachmentUuid: val,
                          title: this.$T(
                            "sodr.common.view.outerAttachment"
                          ).$D("外部附件"),
                          readonly: true,
                          showInfo: true,
                          uploadButton: "none"
                        }
                      ]
                    });
                  }}
                >
                  <SrmFlex>
                    <span class='srm-icon icon-other' />
                    <srm-button type='brown' plain>
                      {$T("sodr.common.view.outerAttachment").$D("外部附件")}
                    </srm-button>
                  </SrmFlex>
                  <span class='srm-icon icon-chevron-right' />
                </SrmFlex>,
              formRow: 20
            }
          ];
        default:
          return [];
        }
      };
    }
  },
  async mounted() {
    if (this.poHeaderId) {
      try {
        // 订单头信息查询
        await getOrderHeaderApi(this.poHeaderId, {
          camp: this.camp,
          poEntryPoint: "PURCHASE_APPROVAL_DETAIL",
          customizeUnitCode: this.headCustomizeUnitCode
        }).then((res) => {
          if (res) {
            this.commonDataSet.create({ ...res }, 0);
          }
        });
        // 订单行信息查询
        // this.orderLineDataSet.addPathParameter("poHeaderId", this.poHeaderId);
        this.orderLineDataSet.addQueryParameter(
          "customizeUnitCode",
          this.lineCustomizeUnitCode
        );
        this.orderLineDataSet.addQueryParameter("camp", this.camp);
        this.orderLineDataSet.addQueryParameter("sortType", this.sortType);
        this.orderLineDataSet.addQueryParameter(
          "poEntryPoint",
          "PURCHASE_APPROVAL_DETAIL"
        );
        await this.queryDoubleUomConfig();
        // await this.orderLineDataSet.refresh();
        // 操作记录查询
        await getPoProcessActions(this.poHeaderId).then((res) => {
          if (res && !res.failed) {
            // 操作记录数据处理
            /**
             * 动作为【新增行/删除行】的操作记录直接隐藏，
             * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
             * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
             * 动作为【分配】的操作记录不允许合并
             * 动作为【更新/变更】的操作记录 对字段进行合并记录
             */
            let data = [];
            res.content.map((item) => {
              if (
                item.processTypeCode === "UPDATE" ||
                item.processTypeCode === "CHANGE" ||
                item.processTypeCode === "ROLLBACK"
              ) {
                if (
                  data.findIndex(
                    (val) => val.poProcessActionId === item.poProcessActionId
                  ) === -1
                ) {
                  // 拼接更新的信息
                  let updateRecords = [];
                  res.content.map((val) => {
                    if (val.poProcessActionId === item.poProcessActionId) {
                      updateRecords.push(val);
                    }
                  });
                  let processRemarks =
                    updateRecords.map((u) =>
                      u.processTypeCode === "UPDATE" &&
                      !u.changeFieldNameMeaning ?
                        "" :
                        `\n${u.processUserName ?? ""} ${
                          u.processRemark ?
                            u.processRemark :
                            `${this.$T(
                              "sodr.workspace.model.operationRecord.take"
                            ).$D("将")}【${
                              u.changeFieldNameMeaning ?? ""
                            }】${this.$T(
                              "sodr.workspace.model.operationRecord.cause"
                            ).$D("由")}【${
                              u.priceShieldFlag ?
                                "******" :
                                u.oldValue ?? ""
                            }】${this.$T(
                              "sodr.workspace.model.operationRecord.change"
                            ).$D("改变为")}【${
                              u.priceShieldFlag ?
                                "******" :
                                u.newValue ?? ""
                            }】 ${
                              u.changeTableName === "SODR_PO_HEADER" ?
                                "" :
                                `${this.$T(
                                  "sodr.workspace.model.common.displayLineNum"
                                ).$D("行号")}【${
                                  u.displayLineNum ?? ""
                                }】`
                            }`
                        }`
                    ) || [];
                  data.push({
                    ...item,
                    processRemark: processRemarks.join("\n")
                  });
                }
              } else {
                data.push(item);
              }
            });
            this.actionRecordList = data.map((e) => {
              e.status = {
                text: e.processTypeMeaning,
                type: "primary"
              };
              if (e.processTypeCode === "SUBMIT") {
                e.status.type = "primary";
              } else if (e.processTypeCode === "APV_REJECT") {
                e.status.type = "danger";
              } else if (e.processTypeCode === "NEW") {
                e.status.type = "info";
              }
              return e;
            });
          }
          // this.actionRecordList = data.content.map((item) => ({
          //   ...item,
          //   status: {
          //     type: "info",
          //     text: item.processTypeMeaning
          //   }
          // }));
        });
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
        )
      });
    }
  },
  methods: {
    // eslint-disable-next-line valid-jsdoc
    // 获取业务规则定义-双单位配置
    async queryDoubleUomConfig() {
      await queryDoubleUomConfigApi().then((res) => {
        if (res) {
          this.isDoubleUnit = Number(res);
        }
      });
    },
    /**
     * 金额精度控制+金额隐藏
     * @param {字段名} fieldCode
     * @param {单据} record
     * @param {金额隐藏标识} amountDisplayFlag
     * @returns
     */
    amountRender(fieldCode = "", record = {}, amountDisplayFlag = 0) {
      // 金额隐藏
      if (amountDisplayFlag === 1) {
        return record[`${fieldCode}Meaning`] || "***";
      }
      // 金额精度控制：不做精度控制的订单
      // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
      const erpFlag =
        record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
      // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
      const sapFlag =
        record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
      if (!erpFlag && !sapFlag) {
        return SrmUtil.getNumberLocalized(
          record[fieldCode],
          record.financialPrecision
        );
      }
      return record[fieldCode];
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        orderHeadInfo: $T("sodr.common.view.tab.orderHeadInfo").$D(
          "订单头信息"
        ),
        basicInfo: $T("sodr.common.view.tab.lineInfo").$D("订单行信息"),
        attachInfo: $T("sodr.common.view.tab.attach").$D("附件"),
        operationRecord: $T("sodr.common.view.tab.operateRecord").$D("操作记录")
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCodeDefine(key) {
      const codeList = {
        orderHeadInfo: "SMBL.WORKFLOW.ORDER_APPROVAL.HEAD",
        basicInfo: "SMBL.WORKFLOW.ORDER_APPROVAL.LINE",
        orderHeadInfoDetail: "SMBL.WORKFLOW.ORDER_APPROVAL.HEADER_INFO",
        basicInfoDetail: "SMBL.WORKFLOW.ORDER_APPROVAL.LINE_DETAIL"
      };
      return codeList[key] || key;
    },
    // 订单头弹框
    clickOrderHeadInfo() {
      this.openPopup("orderHeadInfoDetail", this.commonDataSet);
    },
    // 订单行弹框
    clickBasicInfo() {
      this.openPopup("basicInfoDetail", this.orderLineDataSet);
    },
    // 打开弹框页面
    async openPopup(name, item) {
      switch (name) {
      case null:
        break;
      default:
        this.popupData = {
          data: item,
          columns: name,
          code: name
        };
        setTimeout(() => {
          this.visiblePopup = true;
        }, 0);
      }
    },
    onIndexChange(index) {
      this.orderLineDataSet.addQueryParameter(
        "changeEditFlag",
        index === 0 ? 1 : 0
      );
      this.orderLineDataSet.refresh();
    },
    // 显示变更信息提示,只对 fieldType为 TEXT、EMPTY有用
    renderChangeTip(field, record, content) {
      const that = this;
      const { fieldCode } = field;
      const changeMap = record.changeMap || {};
      const priceShieldFlag = record.priceShieldFlag;
      const tipValue = changeMap[fieldCode] || "【】";
      const priceShieldValidate =
        priceShieldFlag === 1 && SHIED_FIELDS.includes(fieldCode);
      const dom = content;
      if (fieldCode in changeMap) {
        if (priceShieldValidate) {
          return <span style='color:red'>{dom}</span>;
        }
        const tipContent = `${that
          .$T("sodr.common.model.common.beforeUpdate")
          .$D("变更前")} : ${tipValue}`;
        return (
          <srm-tooltip title={tipContent} placement='top'>
            <span
              style='color:red'
              onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {dom}
            </span>
          </srm-tooltip>
        );
      }
      return dom;
    },
    // 跳转寻源明细
    goSource(record) {
      const { sourceHeaderId: rfxHeaderId } = record;
      if (rfxHeaderId) {
        this.$router.push({
          path: "/appSour/RfxHallDetail",
          query: { rfxHeaderId }
        });
      }
    }
  }
};
