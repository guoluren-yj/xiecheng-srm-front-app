import { getHeaderApi, getHistoryDataApi } from "../api";
import { DataSet, $T } from "srm-mobile-ui";
import { commonDs, lineDs } from "../datasource/indexDs";
import { dateFormat } from "@/utils/index";

export default {
  data() {
    return {
      commonDataSet: new DataSet(commonDs()), // 头信息
      lineDataSet: new DataSet(lineDs()), // 明细信息
      showPage: true,
    };
  },
  computed: {
    getColumns() {
      return (name) => {
        switch (name) {
        case "basicInfo":
          return [
            // {
            //   fieldCode: "asnNum",
            //   fieldType: "EMPTY",
            //   render: (val, item) => <SrmListHeader>
            //     <span>{item.asnNum || "-"}</span>
            //   </SrmListHeader>,
            //   formRow: 1,
            // },
            {
              fieldName: this.$T("sinv.purchaseReception.view.message.asnTypeCode").$D("送货单类型"),
              fieldCode: "asnTypeCodeMeaning",
            },
            {
              fieldName: this.$T("sinv.common.model.common.vendorCode").$D("供应商"),
              fieldCode: "supplierCompanyName",
            },
            {
              fieldName: this.$T("sinv.common.myPickList.modal.companyName").$D("客户"),
              fieldCode: "companyName",
            },
            {
              fieldName: this.$T("sinv.common.model.model.common.organizationName").$D("收货组织"),
              fieldCode: "organizationName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.shipToLocationAddress").$D("收货地点"),
              fieldCode: "shipToLocationAddress",
            },
            {
              fieldName: this.$T("sinv.common.model.common.supplierSiteName").$D("发货地点"),
              fieldCode: "supplierSiteName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
              fieldCode: "immedShippedFlag",
              render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
            },
            {
              fieldName: this.$T("sinv.common.model.common.actualReceiverName").$D("送达方"),
              fieldCode: "actualReceiverName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.shipmentsTotalQuantity").$D("发货总数"),
              fieldCode: "totalQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
              fieldCode: "shipDate",
              render: (val) => dateFormat(val),
            },
            {
              fieldName: this.$T("sinv.common.model.common.remark").$D("备注"),
              fieldCode: "remark",
              render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
            },
          ];
        case "itemLineInfo":
          return [
            {
              fieldCode: "asnLineNum",
              fieldType: "EMPTY",
              render: (val, item) => <SrmListHeader>
                <span>{item.itemName}</span>
                <span slot="right">{ this.$T("sinv.purchaseReception.view.message.lineNum").$D("行号") }：{item.asnLineNum}</span>
              </SrmListHeader>,
              formRow: 1,
            },
            {
              fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
              fieldCode: "itemCode",
            },
            {
              fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
              fieldCode: "uomName",
              render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
            },
            {
              fieldName: this.$T("sinv.common.model.common.theShipQuantity").$D("本次发货"),
              fieldCode: "shipQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
              fieldCode: "promisedDate",
              render: (val) => dateFormat(val)
            }
          ];
        case "logistics":
          return [
            {
              fieldName: this.$T("sinv.common.model.common.logisticsCompany").$D("物流公司"),
              fieldCode: "logisticsCompany",
            },
            {
              fieldName: this.$T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
              fieldCode: "logisticsStaff",
            },
            {
              fieldName: this.$T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
              fieldCode: "logisticsContactInfo",
            },
            {
              fieldName: this.$T("sinv.common.model.common.logisticsCost").$D("物流费用"),
              fieldCode: "logisticsCost",
            },
            {
              fieldName: this.$T("sinv.common.model.common.expressNum").$D("快递单号"),
              fieldCode: "expressNum",
            },
          ];
        case "basicInfoDetail":
          return [
            // {
            //   fieldName: this.$T("sinv.common.model.common.asnNum").$D("送货单号"),
            //   fieldCode: "asnNum",
            // },
            {
              fieldName: this.$T("sinv.purchaseReception.view.message.asnTypeCode").$D("送货单类型"),
              fieldCode: "asnTypeCodeMeaning",
            },
            {
              fieldName: this.$T("sinv.common.model.common.vendorCode").$D("供应商"),
              fieldCode: "supplierCompanyName",
            },
            {
              fieldName: this.$T("sinv.common.myPickList.modal.companyName").$D("客户"),
              fieldCode: "companyName",
            },
            {
              fieldName: this.$T("sinv.common.model.model.common.organizationName").$D("收货组织"),
              fieldCode: "organizationName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.shipToLocationAddress").$D("收货地点"),
              fieldCode: "shipToLocationAddress",
            },
            {
              fieldName: this.$T("sinv.common.model.common.supplierSiteName").$D("发货地点"),
              fieldCode: "supplierSiteName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
              fieldCode: "immedShippedFlag",
              render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
            },
            {
              fieldName: this.$T("sinv.common.model.common.actualReceiverName").$D("送达方"),
              fieldCode: "actualReceiverName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.shipmentsTotalQuantity").$D("发货总数"),
              fieldCode: "totalQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
              fieldCode: "shipDate",
              render: (val) => dateFormat(val),
            },
            {
              fieldName: this.$T("sinv.common.model.common.remark").$D("备注"),
              fieldCode: "remark",
              render: (val) => val ? val : this.$T("hipspfm.common.currency.none").$D("无")
            },
          ];
        case "itemLineInfoDetail":
          return [
            {
              fieldName: this.$T("sinv.common.model.common.asnLineNum").$D("行号"),
              fieldCode: "displayAsnLineNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
              fieldCode: "itemCode",
            },
            {
              fieldName: this.$T("sinv.common.model.common.itemName").$D("物料名称"),
              fieldCode: "itemName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.num").$D("数量"),
              fieldCode: "quantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.canShipQuantity").$D("可发货"),
              fieldCode: "canShipQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.uomName").$D("单位"),
              fieldCode: "uomName",
              render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
            },
            {
              fieldName: this.$T("sinv.common.model.common.theShipQuantity").$D("本次发货"),
              fieldCode: "shipQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.unitPackageQuantity").$D("单包装数"),
              fieldCode: "unitPackageQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.packageQuantity").$D("件数"),
              fieldCode: "packageQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.remainderQuantity").$D("尾数"),
              fieldCode: "remainderQuantity",
              fieldType: "INPUT_NUMBER",
              editor: false,
            },
            {
              fieldName: this.$T("sinv.common.model.common.lotNum").$D("批次号"),
              fieldCode: "lotNum",
            },
            {
              fieldName: this.$T("sinv.purchaseReception.message.lotExpirationDate").$D("批次有效期"),
              fieldCode: "lotExpirationDate",
              render: (val) => dateFormat(val)
            },
            {
              fieldName: this.$T("sinv.common.model.common.productionDate").$D("生产日期"),
              fieldCode: "productionDate",
              render: (val) => dateFormat(val)
            },
            {
              fieldName: this.$T("sinv.common.model.common.shelfLife").$D("保质期"),
              fieldCode: "shelfLife",
              render: (val) => dateFormat(val)
            },
            {
              fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
              fieldCode: "neededDate",
              render: (val) => dateFormat(val)
            },
            {
              fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
              fieldCode: "promisedDate",
              render: (val) => dateFormat(val)
            },
            {
              fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
              fieldCode: "displayPoNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.displayLineNum").$D("订单行号"),
              fieldCode: "displayLineNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.serialNum").$D("序列号"),
              fieldCode: "serialNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.displayReleaseNum").$D("发放号"),
              fieldCode: "displayReleaseNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.versionNum").$D("版本"),
              fieldCode: "versionNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.contactInfo").$D("联系人"),
              fieldCode: "contactInfo",
            },
            {
              fieldName: this.$T("sinv.common.model.common.invoiceNum").$D("发票号"),
              fieldCode: "invoiceNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
              fieldCode: "purchaseRemark",
            },
            {
              fieldName: this.$T("sinv.common.model.common.suppliersRemark").$D("供应商备注"),
              fieldCode: "remark",
            },
            {
              fieldName: this.$T("sinv.common.model.common.lineAattachment").$D("行附件"),
              fieldCode: "attachmentUuid",
              fieldType: "UPLOAD",
            },
            {
              fieldName: this.$T("sinv.common.model.common.product.number").$D("商品编码"),
              fieldCode: "productNum",
            },
            {
              fieldName: this.$T("sinv.common.model.common.product.name").$D("商品名称"),
              fieldCode: "productName",
            },
            {
              fieldName: this.$T("sinv.common.model.common.catalog.name").$D("商品目录"),
              fieldCode: "catalogName",
            },
          ];
        case "attachInfo":
          return [
            {
              fieldType: "EMPTY",
              fieldCode: "approveAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    attachmentUuid: val,
                    title: this.$T("sinv.common.purchasersAuditAttachment").$D("采购方审核附件"),
                    showInfo: true,
                    uploadButton: "fixed",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="brown" plain>{this.$T("sinv.common.purchasersAuditAttachment").$D("采购方审核附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 10,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "reviewAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    attachmentUuid: val,
                    title: this.$T("sinv.common.view.purchaserReviewAttachment").$D("采购方复核附件"),
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="brown" plain>{this.$T("sinv.common.view.purchaserReviewAttachment").$D("采购方复核附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 20,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "otherAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    attachmentUuid: val,
                    title: this.$T("sinv.common.view.otherAttachment").$D("采购方其他附件"),
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="brown" plain>{this.$T("sinv.common.view.otherAttachment").$D("采购方其他附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 30,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "supplierAttachmentUuid",
              render: (val) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    attachmentUuid: val,
                    title: this.$T("sinv.common.view.supplierAttachment").$D("供应商附件"),
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="brown" plain>{this.$T("sinv.common.view.supplierAttachment").$D("供应商附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 40,
            },
            {
              fieldType: "EMPTY",
              fieldCode: "supplierAttaUuid",
              render: (val) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
                this.$attachment({
                  attachments: [ {
                    attachmentUuid: val,
                    title: this.$T("sinv.common.view.otherSupplierAttachment").$D("供应商其他附件"),
                    readonly: true,
                    showInfo: true,
                    uploadButton: "none",
                  } ]
                });
              }}>
                <SrmFlex>
                  <span class="srm-icon icon-other"/>
                  <srm-button type="brown" plain>{this.$T("sinv.common.view.otherSupplierAttachment").$D("供应商其他附件")}</srm-button>
                </SrmFlex>
                <span class="srm-icon icon-chevron-right"/>
              </SrmFlex>,
              formRow: 50,
            },
          ];
        default:
          return [];
        }
      };
    },
  },
  async mounted() {
    if (this.asnHeaderId) {
      try {
        // 头查询
        await getHeaderApi(this.asnHeaderId,
          {
            asnHeaderId: this.asnHeaderId,
            customizeUnitCode: this.headCustomizeUnitCode,
          }
        ).then((res) => {
          this.commonDataSet.create({ ...res }, 0);
        });
        // 明细信息查询
        this.lineDataSet.addPathParameter("asnHeaderId", this.asnHeaderId);
        this.lineDataSet.addQueryParameter("customizeUnitCode", this.lineCustomizeUnitCode);
        await this.lineDataSet.refresh();
        // 操作记录查询
        await getHistoryDataApi(this.asnHeaderId).then((res) => {
          if (res && res.content) {
            this.historyData = res.content.map((item) => ({
              ...item,
              status: {
                type: "info",
                text: item.processStatusMeaning,
              }
            }));
          }
        });
      } catch (error) {
        // this.$notification.open({
        //   message: error,
        // });
      }
    } else {
      this.showPage = false;
      this.$notification.open({
        message: $T("hzero.common.notification.noShow.tips").$D("该单据当前状态不可查看"),
      });
    }
  },
};