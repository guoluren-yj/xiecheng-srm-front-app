import { DataSet, $T, SrmFlex, SrmUtil } from "srm-mobile-ui";
import { labelRecordDs } from "../datasource/commonDs";
import {
  getStatusCodeColor,
} from "../utils";
export default {
  data() {
    return {
      ds: new DataSet(labelRecordDs()),
    };
  },
  methods: {
    //基本信息
    getBasicColumns(tab, node) {
      // 送货单-审批
      const asnApproveColumns = [
        {
          fieldCode: "displayAsnNum",
          // fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{val}</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.statusCode)}>{item.statusCodeMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
          formRow: 1,
        },
        {
          fieldCode: "createdName",
          formRow: 2,
        },
        {
          fieldCode: "creationDate",
          formRow: 2,
        }
      ];
      // 送货单-关闭
      const asnCloseColumns = [
        {
          fieldCode: "displayAsnNum",
          // fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{val}</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.statusCode)}>{item.statusCodeMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
          formRow: 1,
        },
        {
          fieldCode: "asnTypeCodeMeaning",
          formRow: 2,
        },
        {
          fieldCode: "createdName",
          formRow: 3,
        },
        {
          fieldCode: "creationDate",
          formRow: 3,
        }
      ];
      // 计划
      const planApproveColumns = [
        {
          fieldCode: "displayPlanNum",
          // fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{val}</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.statusCode)}>{item.statusCodeMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
          formRow: 1,
        },
        {
          fieldCode: "nodeConfigName",
          formRow: 2,
        },
        {
          fieldCode: "createdName",
          formRow: 3,
        },
        {
          fieldCode: "creationDate",
          formRow: 4,
        }
      ];
      // 唯一标签
      const uniqueLabelDetailColumns = [
        {
          fieldCode: "displayLabelNum",
          // fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{val}</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.statusCode)}>{item.statusCodeMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
          formRow: 1,
        },
        {
          fieldCode: "companyName",
          formRow: 2,
        },
        {
          fieldCode: "supplierCompanyName",
          formRow: 3,
        }
      ];
      switch (node) {
      case "ASN":
        if (tab === "all") {
          return asnCloseColumns;
        }
        return asnApproveColumns;
      case "PLAN":
        return planApproveColumns;
      case "UNIQUE_LABEL":
        return uniqueLabelDetailColumns;
      default:
        if (tab === "all") {
          return asnCloseColumns;
        }
        return asnApproveColumns;
      }
    },
    //基本信息-明细
    getBasicDetailColumns(node) {
      // 送货单明细
      const asnDetailColumns = [
        {
          fieldCode: "displayAsnNum",
        },
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "asnTypeCodeMeaning",
        },
        {
          fieldCode: "statusCodeMeaning",
        },
        {
          fieldCode: "createdName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
      // 计划单明细
      const planDetailColumns = [
        {
          fieldCode: "displayPlanNum",
        },
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "createdName",
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "createdUnitName",
        },
        {
          fieldCode: "statusCodeMeaning",
        },
        {
          fieldCode: "shipTotalQuantity",
        },
        {
          fieldCode: "purchaseRemark",
        },
        {
          fieldCode: "supplierRemark",
        },
      ];
      // 唯一标签单明细
      const uniqueLabelDetailColumns = [
        {
          fieldCode: "displayLabelNum",
        },
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "statusCodeMeaning",
        },
        {
          fieldCode: "createdName",
        },
        {
          fieldCode: "creationDate",
        },
        // {
        //   fieldCode: "createdUnitName",
        // },
        {
          fieldCode: "packageMethod",
          render: (val, item) => <span>{item?.packageMethodMeaning}</span>,
        },
        {
          fieldCode: "purchaseRemark",
        },
        {
          fieldCode: "supplierRemark",
        },
      ];
      switch (node) {
      case "ASN":
        return asnDetailColumns;
      case "PLAN":
        return planDetailColumns;
      case "UNIQUE_LABEL":
        return uniqueLabelDetailColumns;
      default:
        return asnDetailColumns;
      }
    },
    //发货信息
    getShipInfoColumns() {
      return [
        {
          fieldCode: "supplierCompanyName",
          fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="text">{item.supplierCompanyName}</span>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
        },
        {
          fieldCode: "shipDate",
          editor: false,
        },
        {
          fieldCode: "expectedArriveDate",
          editor: false,
        },
        {
          fieldCode: "deliveryAddress",
          editor: false,
        },
      ];
    },
    //发货信息-明细
    getShipInfoDetailColumns() {
      return [
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "shipDate",
          editor: false,
        },
        {
          fieldCode: "expectedArriveDate",
          editor: false,
        },
        {
          fieldCode: "deliveryAddress",
          editor: false,
        },
        {
          fieldCode: "shipTotalQuantity",
        },
        {
          fieldCode: "shipTaxIncludedAmount",
        },
        {
          fieldCode: "transportTypeMeaning",
        },
        {
          fieldCode: "logisticsCompanyName",
        },
        {
          fieldCode: "carNumber",
          editor: false,
        },
        {
          fieldCode: "expressNum",
          editor: false,
        },
        {
          fieldCode: "logisticsStaff",
          editor: false,
        },
        {
          fieldCode: "logisticsPhoneNumber",
          render: (val, item) => <span>{item.internationalTelCode} | {item.logisticsPhoneNum}</span>
        },
        {
          fieldCode: "purchaseRemark",
        },
        {
          fieldCode: "supplierRemark",
        }
      ];
    },
    //收货信息
    getReceiveInfoColumns() {
      return [
        {
          fieldCode: "companyName",
          fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="text">{item.companyName}</span>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "receiveAddress",
          editor: false,
        },
      ];
    },
    //收货信息-明细
    getReceiveInfoDetailColumns() {
      return [
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "receiveAddress",
          editor: false,
        },
        {
          fieldCode: "contactName",
          editor: false,
        },
        {
          fieldCode: "contactTelNumber",
          render: (val, item) => <span>{item.internationalTelCode} | {item.contactTelNum}</span>
        },
      ];
    },
    //行信息
    getLineInfoColumns(node) {
      //送货单-行信息
      const asnLineColumns = [
        {
          fieldCode: "itemCode",
          formRow: 1,
          // fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={false}>
            <span class="title-text">{ val || "-" }</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.lineStatus)}>{item.lineStatusMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
        },
        {
          fieldCode: "itemName",
          formRow: 2,
        },
        {
          fieldCode: "displayUom",
          formRow: 3
        },
        {
          fieldCode: "displayAsnLineNum",
          formRow: 3
        },
        {
          fieldName: $T("slod.common.model.common.createQuantity").$D("本次创建数量"),
          fieldCode: "actualQuantity",
          editor: false,
          formRow: 4,
        },
        {
          fieldCode: "quantity",
          editor: false,
          formRow: 5
        },
      ];
      //计划单-行信息
      const planLineColumns = [
        {
          fieldCode: "itemCode",
          formRow: 1,
          // fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={true}>
            <span class="title-text">{ val || "-" }</span>
            <srm-tag calss="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.lineStatus)}>{item.lineStatusMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
        },
        {
          fieldCode: "itemName",
          formRow: 2,
        },
        {
          fieldCode: "displayUom",
          formRow: 3
        },
        {
          fieldCode: "displayPlanLineNum",
          formRow: 3
        },
        {
          fieldName: $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
          fieldCode: "actualQuantity",
          editor: false,
          formRow: 4,
        },
        {
          fieldCode: "quantity",
          editor: false,
          formRow: 4
        },
        {
          fieldCode: "plannedArrivalDate",
          editor: false,
          formRow: 5
        },
        {
          fieldCode: "confirmArrivalDate",
          editor: false,
          formRow: 6
        },
      ];
      //唯一标签-行信息
      const uniqueLabelLineColumns = [
        {
          fieldCode: "itemCode",
          formRow: 1,
          render: (val, item) => <srm-list-header show-open-tag={true}>
            <span class="title-text">{ val || "-" }</span>
            <srm-tag class="tag-ste" slot="right" size="large" type={getStatusCodeColor(item.lineStatus)}>{item.lineStatusMeaning}</srm-tag>
            <span slot="right" style={{ marginLeft: "8px", color:"rgb(51, 51, 51)", fontSize: "16px" }} class="srm-icon icon-chevron-right"/>
          </srm-list-header>,
        },
        {
          fieldCode: "itemName",
          formRow: 2,
        },
        {
          fieldCode: "displayUom",
          formRow: 3
        },
        {
          fieldCode: "displayLabelLineNum",
          formRow: 3
        },
        {
          fieldName: $T("slod.common.model.common.presentlabelQuantity").$D("本单已生成标签数量"),
          fieldCode: "actualQuantity",
          editor: false,
          formRow: 4,
        },
        {
          fieldCode: "labelDetail",
          formRow: 5,
          render: () => <span style="color: var(--color-other-default-b)">{$T("hipspfm.common.button.view").$D("查看")}</span>,
          callBack: async (item) => {
            // const ds = new DataSet(labelRecordDs());
            this.ds.addQueryParameter("labelHeaderId", item.labelHeaderId);
            this.ds.addQueryParameter("labelLineId", item.labelLineId);
            this.ds.refresh();
            const labelColumns = [
              {
                fieldCode: "uniqueLabelNum",
                formRow: 1,
                render: (val, items) => <span>{`${val}-${items.lineExtNum}`}</span>
              },
              // {
              //   fieldCode: "lineExtNum",
              //   formRow: 1,
              // },
              {
                fieldCode: "itemCode",
                formRow: 2,
              },
              {
                fieldCode: "itemName",
                formRow: 3,
              },
              {
                fieldCode: "unitPackageQuantity",
                formRow: 4,
              },
              {
                fieldCode: "volumeLength",
                formRow: 4,
              },
              {
                fieldCode: "volumeWidth",
                formRow: 5,
              },
              {
                fieldCode: "volumeHeight",
                formRow: 5,
              },
              {
                fieldCode: "netWeight",
                formRow: 6,
              },
              {
                fieldCode: "grossWeight",
                formRow: 6,
              },
            ];
            this.$popup({
              title: $T("slod.common.model.common.labelDetail").$D("标签明细"),
              showHeader: true,
              showClose: true,
              rounded: true,
              height: "80%",
              position: "bottom",
              content: <srm-list
                scrollable={false}
                height="auto"
                data-set={this.ds}
                columns={labelColumns}
              />,
            });
            return;
          },
        },
      ];
      switch (node) {
      case "ASN":
        return asnLineColumns;
      case "PLAN":
        return planLineColumns;
      case "UNIQUE_LABEL":
        return uniqueLabelLineColumns;
      default:
        return asnLineColumns;
      }
    },
    //行信息-明细
    getLineInfoDetailColumns(tab, node) {
      // 送货单
      const asnDetailLineColumns = [
        {
          fieldCode: "lineStatusMeaning",
        },
        {
          fieldCode: "displayAsnLineNum",
        },
        tab === "all" && {
          fieldCode: "exportRecord",
          render: (val, item) => item.lineExportStatusMeaning ? <span style="color: var(--color-other-default-b)">{item.lineExportStatusMeaning}</span> : "-",
          callBack: async (item) => {
            if (item.lineExportStatusMeaning) {
              this.exportRecord({ lineId: item.asnLineId }, true);
            }
          }
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "displayUom",
        },
        tab !== "affirm" && {
          fieldCode: "sourceQuantity",
        },
        {
          fieldCode: "quantity",
          editor:false,
        },
        {
          fieldName: $T("slod.common.model.common.createQuantity").$D("本次创建数量"),
          fieldCode: "actualQuantity",
          editor: false,
        },
        {
          fieldCode: "unitPackageQuantity",
          editor:false,
        },
        {
          fieldCode: "packageQuantity",
        },
        {
          fieldCode: "remainderQuantity",
        },
        {
          fieldCode: "netWeight",
          editor: false,
        },
        {
          fieldCode: "grossWeight",
          editor: false,
        },
        {
          fieldCode: "lotNum",
          editor: false,
        },
        {
          fieldCode: "productionDate",
          editor: false,
        },
        {
          fieldCode: "lotExpirationDate",
          editor: false,
        },
        {
          fieldCode: "serialNum",
          editor: false,
        },
        {
          fieldCode: "fromDisplayPoNum",
          render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
        },
        {
          fieldCode: "fromDisplayPoLocationNum",
        },
        {
          fieldCode: "sourceDisplayNum",
          render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
        },
        {
          fieldCode: "sourceNodeConfigName",
        },
        {
          fieldCode: "purchaseLineRemark",
          editor:false,
        },
        {
          fieldCode: "supplierLineRemark",
        },
        {
          fieldCode: "deliveryAddress",
          editor:false,
        },
        {
          fieldCode: "receiveAddress",
          editor:false,
        },
        {
          fieldCode: "shipToLocContName",
        },
        {
          fieldCode: "shipToLocTelNum",
        },
        {
          fieldCode: "productNum", // 商品编码
        },
        {
          fieldCode: "productName", // 商品名称
        },
        {
          fieldCode: "catalogName", // 商品目录
        },
        {
          fieldCode: "creationDate", // 创建时间
        },
        {
          fieldCode: "createdName", // 创建人
        },
        {
          fieldCode: "purchaseLineAttachmentUuid",
        },
        {
          fieldCode: "supplierLineAttachmentUuid",
        },
        {
          fieldCode: "splitFlag",
          render: (val, item) => item.splitFlagMeaning,
        },
        {
          fieldCode: "occupiedQuantity",
        },
        {
          fieldCode: "changingFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
      ];
      // 计划单
      const planDetailLineColumns = [
        tab === "all" && {
          fieldCode: "exportRecord",
          render: (val, item) => item.lineExportStatusMeaning ? <span style="color: var(--color-other-default-b)">{item.lineExportStatusMeaning}</span> : "-",
          callBack: async (item) => {
            if (item.lineExportStatusMeaning) {
              this.exportRecord({ lineId: item.asnLineId }, true);
            }
          }
        },
        {
          fieldCode: "lineStatusMeaning",
        },
        {
          fieldCode: "displayPlanLineNum",
        },
        {
          fieldCode: "splitDisplayLineNum", // 拆分行号
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "displayUom",
        },
        {
          fieldCode: "canCreateQuantity",
        },
        {
          fieldName: $T("slod.common.model.common.presentQuantity").$D("本次计划数量"),
          fieldCode: "actualQuantity",
          editor: false,
        },
        {
          fieldCode: "plannedArrivalDate",
          editor:false,
        },
        {
          fieldCode: "quantity",
          editor:false,
        },
        {
          fieldCode: "confirmArrivalDate",
          editor:false,
        },
        {
          fieldCode: "fromDisplayPoNum",
          render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
        },
        {
          fieldCode: "sourceDisplayNum",
          render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
        },
        {
          fieldCode: "sourceNodeConfigName",
        },
        {
          fieldCode: "neededDate",
        },
        {
          fieldCode: "promisedDate",
        },
        {
          fieldCode: "purchaseLineRemark",
          editor:false,
        },
        {
          fieldCode: "supplierLineRemark",
        },
        {
          fieldCode: "agentName",
        },
        {
          fieldCode: "categoryName",
        },
        {
          fieldCode: "invOrganizationName",
        },
        {
          fieldCode: "deliveryAddress",
          editor:false,
        },
        {
          fieldCode: "receiveAddress",
          editor:false,
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "splitFlag",
          render: (val, item) => item.splitFlagMeaning,
        },
        tab === "affirm" && {
          fieldCode: "createCampCodeMeaning", // 创建方
        },
        {
          fieldCode: "createdName", // 创建人
        },
        {
          fieldCode: "occupiedQuantity",
        },
        {
          fieldCode: "changingFlag",
          render: (val) => val === 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val === 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
      ];
      // 唯一标签
      const uniqueLabelDetailLineColumns = [
        {
          fieldCode: "lineStatusMeaning",
        },
        {
          fieldCode: "displayLabelLineNum",
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "itemName",
        },
        {
          fieldCode: "displayUom",
        },
        {
          fieldCode: "sourceQuantity", // 来源单据数量
        },
        {
          fieldName: $T("slod.common.model.common.presentlabelQuantity").$D("本单已生成标签数量"),
          fieldCode: "actualQuantity", // 本单已生成标签数量
          editor: false,
        },
        {
          fieldCode: "quantity",
          editor: false,
        },
        {
          fieldCode: "unitPackageQuantity", // 单包装数
          editor: false,
        },
        {
          fieldCode: "packageQuantity", // 比例份数
          editor: false,
        },
        {
          fieldCode: "volumeLength", // 体积长（CM)
          editor: false,
        },
        {
          fieldCode: "volumeWidth", // 体积宽（CM)
          editor: false,
        },
        {
          fieldCode: "volumeHeight", // 体积高（CM)
          editor: false,
        },
        {
          fieldCode: "netWeight", // 净重（KG)
          editor: false,
        },
        {
          fieldCode: "grossWeight", // 毛重（KG)
          editor: false,
        },
        {
          fieldCode: "lotNum", // 批次号
          editor: false,
        },
        {
          fieldCode: "productionDate", // 生产日期
          editor: false,
        },
        {
          fieldCode: "lotExpirationDate", // 批次有效期
          editor: false,
        },
        {
          fieldCode: "serialNum", // 序列号
          editor: false,
        },
        {
          fieldCode: "purchaseLineRemark",
          editor:false,
        },
        {
          fieldCode: "supplierLineRemark",
        },
        {
          fieldCode: "fromDisplayPoNum",
          render: (val, item) => item.fromDisplayPoNum ? <span>{val}-{item.fromDisplayPoLineNum}</span> : "-",
        },
        {
          fieldCode: "sourceDisplayNum",
          render: (val, item) => item.sourceDisplayNum ? <span>{val}-{item.sourceDisplayLineNum}</span> : "-",
        },
        {
          fieldCode: "sourceNodeConfigName",
        },
        {
          fieldCode: "splitFlag", // 拆分标记
          render: (val, item) => item.splitFlagMeaning,
        },
        tab === "affirm" && {
          fieldCode: "createCampCodeMeaning", // 创建方
        },
        {
          fieldCode: "createdName", // 创建人
        },
        // {
        //   fieldCode: "projectTaskId",
        // },
      ];
      switch (node) {
      case "ASN":
        return asnDetailLineColumns;
      case "PLAN":
        return planDetailLineColumns;
      case "UNIQUE_LABEL":
        return uniqueLabelDetailLineColumns;
      default:
        return asnDetailLineColumns;
      }
    },
    //附件信息
    getAttachInfoColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "purchaseAttachmentUuid",
          // render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
          //   this.$attachment({
          //     onFileUpload: () => this.getSaveAttachmentUuid(item),
          //     attachments: [ {
          //       attachmentUuid: item.purchaseAttachmentUuid,
          //       bucketName: "public-bucket",
          //       title: $T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件"),
          //       displayType: "list",
          //       readonly: true,
          //       showInfo: true,
          //       uploadButton: "none",
          //     } ]
          //   });
          // }}>
          //   <SrmFlex>
          //     <span class="srm-icon icon-other"/>
          //     <srm-button type="primary" plain>{$T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件")}</srm-button>
          //   </SrmFlex>
          //   <span class="srm-icon icon-chevron-right"/>
          // </SrmFlex>,
          render: (val) => <SrmFlex class="attachment" justify="between">
            <SrmFlex>
              <span class="srm-icon icon-other" />
              <SrmAttachmentButton
                showTotal={true}
                title={$T("slod.common.view.purchaseAttachmentUuid").$D("采购方附件")}
                attachments={[
                  {
                    attachmentUuid: val,
                    readonly: true,
                    showInfo: true,
                    displayType: "list",
                    uploadButton: "none",
                    bucketName: "private-bucket",
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
          render: () => <srm-blank size="1px" theme="fill"/>,
          formRow: 20,
        },
        {
          fieldType: "EMPTY",
          fieldCode: "supplierAttachmentUuid",
          // render: (val, item) => <SrmFlex class="attachment" justify="between" nativeOnClick={() => {
          //   this.$attachment({
          //     attachments: [ {
          //       attachmentUuid: item.supplierAttachmentUuid,
          //       tenantId: SrmUtil.getTenantId(),
          //       bucketName: "public-bucket",
          //       title: $T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件"),
          //       displayType: "list",
          //       readonly: true,
          //       showInfo: true,
          //       uploadButton: "none",
          //     } ]
          //   });
          // }}>
          //   <SrmFlex>
          //     <span class="srm-icon icon-other"/>
          //     <srm-button type="primary" plain>{$T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件")}</srm-button>
          //   </SrmFlex>
          //   <span class="srm-icon icon-chevron-right"/>
          // </SrmFlex>,
          render: (val) => <SrmFlex class="attachment" justify="between">
            <SrmFlex>
              <span class="srm-icon icon-other" />
              <SrmAttachmentButton
                showTotal={true}
                title={$T("slod.common.view.supplierLineAttachmentUuid").$D("供应商附件")}
                attachments={[
                  {
                    attachmentUuid: val,
                    readonly: true,
                    showInfo: true,
                    displayType: "list",
                    uploadButton: "none",
                    bucketName: "private-bucket",
                    tenantId: SrmUtil.getTenantId(),
                  },
                ]}
              />
            </SrmFlex>
            <span class="srm-icon icon-chevron-right" />
          </SrmFlex>,
          formRow: 30,
        },
      ];
    },
    getExportRecordColumns() {
      return [
        {
          fieldCode: "exportTypeMeaning",
          fieldType: "EMPTY",
          render: (val, item) => <srm-list-header show-open-tag={true}>
            <span>{ item.exportTypeMeaning }（{ item.exportType || "-"}）</span>
            <span slot="right">{ item.exportStatusMeaning }</span>
          </srm-list-header>,
        },
        {
          fieldCode: "synchronous",
          render: (val, item) => <span style={{
            color: [ "FAIL" ].includes(item.exportStatus) ? "var(--color-other-default-b)" : "",
          }}>
            {$T("slod.common.model.common.sync").$D("重新同步")}
          </span>,
          callBack: (item) => {
            this.exportRecord(item);
          },
        },
        {
          fieldCode: "exportMessage",
        },
        {
          fieldCode: "externalSystemCode",
        }
      ];
    }
  }
};
