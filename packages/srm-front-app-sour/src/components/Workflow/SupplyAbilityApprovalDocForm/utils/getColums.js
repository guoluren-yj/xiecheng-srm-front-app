/*
 * @Date: 2024-08-28 10:31:02
 * @Author: CDJ
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { yesOrNoRenderer } from "@/utils/renderer";

// 头信息
export const getHeaderInfoColumns = () => [
  {
    fieldCode: "abilityReqNum",
    fieldName: $T("sslm.common.model.applicationNumber").$D("申请单号"),
    render: (val) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:400 }}>{val || "-"}</span>
      {/* <span slot="right" >
        {item.abilityReqStatus ?
          <SrmTag
            style={{
              color: "#FC8800",
              backgroundColor: "rgb(252, 136, 0, 0.15)",
            }}
          >
            {item.abilityReqStatusMeaning}
          </SrmTag> :
          ""
        }
      </span> */}
    </SrmListHeader>,
  },
  // {
  //   fieldCode: "abilityReqStatusMeaning",
  //   fieldName: $T("hzero.common.common.status").$D("状态"),
  // },
  {
    fieldCode: "initiateCampMeaning",
    fieldName: $T("sslm.supplyAbilityDoc.model.supplyAbility.reqInitiator").$D("申请单发起方"),
  },
  {
    fieldCode: "supplierCompanyName",
    fieldName: $T("sslm.common.supplier").$D("供应商"),
  },
  {
    fieldCode: "companyName",
    fieldName: $T("sslm.common.company").$D("公司"),
  },
  {
    fieldCode: "createdUserName",
    fieldName: $T("hzero.common.creationName").$D("创建人"),
  },
  {
    fieldCode: "creationDate",
    fieldName: $T("hzero.common.creationDate").$D("创建时间"),
  },
  {
    fieldCode: "remark",
    fieldName: $T("hzero.common.remark").$D("备注"),
  },
  {
    fieldCode: "stageDescription",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.supplierLife").$D("供应商生命周期"),
  },
];

// 物料、品类信息
export const getItemCategoryColumns = ({ purchaserItemFlag = true, supplierItemFlag = false, onAttachment = () => {} } = {}) => [
  // {
  //   fieldCode: "operationTypeMeaning",
  //   fieldName: $T("sslm.common.view.common.operateType").$D("操作类型"),
  // },
  {
    fieldCode: "itemCode",
    fieldName: purchaserItemFlag ?
      $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码") :
      $T("sslm.supplyAbilityDoc.model.supplyAbility.purItemCode").$D("采方校对物料编码"),
  },
  {
    fieldCode: "itemName",
    fieldName: purchaserItemFlag ?
      $T("sslm.common.item.itemName").$D("物料名称") :
      $T("sslm.supplyAbilityDoc.model.supplyAbility.purItemName").$D("采方校对物料名称"),
    render: (val, item) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:400 }}>{val || "-"}</span>
      <span slot="right" >
        {item.operationTypeMeaning ?
          <SrmTag
            style={
              item.operationType ?
                {
                  color: "#FC8800",
                  backgroundColor: "rgb(252, 136, 0, 0.15)",
                } :
                {
                  color: "#05944F",
                  backgroundColor: "#E6F2ED",
                }}
          >
            {item.operationTypeMeaning}
          </SrmTag> :
          ""
        }
      </span>
    </SrmListHeader>,
  },
  {
    fieldCode: "supItemDesc",
    fieldName: $T("sslm.supplyAbilityDoc.model.supplyAbility.supItemDesc").$D("供方物料描述"),
    visible: supplierItemFlag,
  },
  {
    fieldCode: "supItemCategoryDesc",
    fieldName: $T("sslm.supplyAbilityDoc.model.supplyAbility.supCategoryDesc").$D("供方品类描述"),
    visible: supplierItemFlag,
  },
  {
    fieldCode: "itemCategoryCode",
    fieldName: purchaserItemFlag ?
      $T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码") :
      $T("sslm.supplyAbilityDoc.model.supplyAbility.purCategoryCode").$D("采方校对品类编码"),
  },
  {
    fieldCode: "itemCategoryName",
    fieldName: purchaserItemFlag ?
      $T("sslm.common.category.categoryName").$D("品类名称") :
      $T("sslm.supplyAbilityDoc.model.supplyAbility.purCategoryName").$D("采方校对品类名称"),
  },
  {
    fieldCode: "supplyFlag",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.availableFor").$D("可供"),
    render: (val) => yesOrNoRenderer(val),
  },
  {
    fieldCode: "dateFrom",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.dateFrom").$D("有效期从"),
  },
  {
    fieldCode: "dateTo",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.dateTo").$D("有效期至"),
  },
  {
    fieldCode: "purchaseOrganizationName",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.purchasingOrganization")
      .$D("采购组织"),
  },
  {
    fieldCode: "inventoryOrganizationIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.inventoryOrganization")
      .$D("库存组织"),
  },
  {
    fieldCode: "manufacturer",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.manufacturer").$D("生产厂家"),
  },
  {
    fieldCode: "adapterProducts",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品"),
  },
  {
    fieldCode: "countryIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家"),
  },
  {
    fieldCode: "regionIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区"),
  },
  {
    fieldCode: "cityIdMeaning",
    fieldName: $T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市"),
  },
  {
    fieldCode: "remark",
    fieldName: $T("hzero.common.remark").$D("备注"),
  },
  {
    fieldCode: "attachment",
    fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
    render:(_, record) => <a style={{ color: "var(--font-color-primary)" }} onClick={(e) => {
      e.stopPropagation();
      onAttachment(record);
    }}>{`${$T("hzero.common.upload.view").$D("查看附件")} (${record.fileCount || 0})`}</a>,
  },
];

// 附件信息
export const getAttachmentColumns = () => [
  {
    fieldCode: "attachmentUuid",
    fieldType: "EMPTY",
    render: (val, item) => <SrmFlex
      class="attachment-uuid-field"
    >
      <span class="srm-icon icon-other"/>
      <SrmAttachmentButton
        showTotal
        attachments={[
          {
            attachmentUuid: item.attachmentUuid,
            bucketName: "private-bucket",
            readonly:true,
            showInfo: true,
            uploadButton:"none",
          },
        ]}
      />
      <span class="srm-icon icon-chevron-right" />
    </SrmFlex>,
  },
];