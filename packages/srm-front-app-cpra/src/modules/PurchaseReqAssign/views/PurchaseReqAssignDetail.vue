<template>
  <div class="purchase-requisition-assign-detail">
    <srm-scroll class="purchase-requisition-assign-detail-content" height="100vh" :refreshable="false">
      <srm-form customize-type="detail" :data-set="dataSet" :columns="getColumns"
                customize-code="SMBL.PURCHASEREQ.ASSIGN.DETAIL.FORM" />
    </srm-scroll>
    <srm-bottom-handler :btn-arr="getButtons" type="action-sheet" />
    <!-- 以弹窗形式显示 -->
    <!--    分配 -->
    <assign-popup v-model="assignPopupFlag" :config="config" :checked-list="checkedList" @onSuccess="refresh" />
    <!--    暂挂 -->
    <suspend-popup v-model="suspendPopupFlag" :checked-list="checkedList" @onSuccess="refresh" />
    <!--    退回 -->
    <back-reason-popup v-model="backPopupFlag" :checked-list="checkedList" @onSuccess="refresh" />
    <!--    操作记录 -->
    <srm-popup :title="title" :visible="visible" position="bottom" rounded @onClose="onClosePoppup()">
      <srm-scroll height="100%" :refreshable="false">
        <history-record-tiled :show-remark="false" :loading="false" :action-data="actionRecordList"
                              operation-meaning-field-name="status" operator-field-name="processUserName"
                              process-date-field-name="creationDate" process-remark-field-name="processRemark"
                              :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
                              process-remark-info-field-name="unknown" />
      </srm-scroll>
    </srm-popup>
  </div>
</template>

<script>
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import { purchaseRequisitionListDS } from "../datasource/PurchaseReqAssignListDs";
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import { isArray, isEmpty } from "lodash";
import AssignPopup from "../components/AssignPopup.vue";
import SuspendPopup from "../components/SuspendPopup.vue";
import BackReasonPopup from "../components/BackReasonPopup.vue";
import ReferPricePopup from "../components/ReferPricePopup.vue";
import { getDynamicLabel } from "@/utils/index";
import { enable, getActionsRecordApi, getUomControlApi } from "../api";

export default {
  modules: [ "hzero.common", "sprm.common", "sprm.purchasePlatform", "sprm.purchaseRequisitionAssign", "smbl.common", "entity.supplier", "sodr.common", "ssrc.priceLibrary", "entity.organization", "entity.roles", "hipspfm.workFlow" ],
  name: "PurchaseReqAssignDetail",
  components: { AssignPopup, SuspendPopup, BackReasonPopup, HistoryRecordTiled },
  data() {
    return {
      dataSet: new DataSet(purchaseRequisitionListDS()),
      title: $T("sprm.common.view.tab.operateRecord").$D("操作记录"),
      visible: false,
      setting: "0",
      tabType: "",
      isOldUser: false,
      isShowNewBid: false,
      assignPopupFlag: false,
      suspendPopupFlag: false,
      backPopupFlag: false,
      actionRecordList: [],
      config: {},
      uomControlFlag: 0,
      checkedList: [],
      changeOrderCodeType: [
        {
          code: "success",
          meaning: $T("sprm.common.model.successStatus").$D("成功"),
        },
        {
          code: "fail",
          meaning: $T("sprm.common.model.errorStatus").$D("失败"),
        },
        {
          code: "transfer_order",
          meaning: $T("sprm.common.model.transferOrder").$D("转单中"),
        },
      ],
    };
  },
  computed: {
    getButtons() {

      let btnArr = [];

      const suspendBtn = {
        text: $T("sprm.purchaseRequisitionAssign.view.button.suspend").$D("暂挂"),
        bordered: true,
        type: "primary",
        visible: this.checkedList[0]?.get("prLineStatusCode") !== "SUSPEND",
        size: "large",
        permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.suspend",
        handler: () => {
          // 预算金额校验
          this.suspendPopupFlag = true;
        },
      };

      const assignBtn = {
        text: $T("sprm.purchaseRequisitionAssign.view.button.assign").$D("分配"),
        bordered: true,
        fill: true,
        visible: this.checkedList[0]?.get("prLineStatusCode") !== "SUSPEND",
        type: "primary",
        size: "large",
        permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.assign",
        handler: () => {
          const checkedList = this.checkedList;
          const purchaseAgentId = checkedList.every(
            (ele) => ele.get("purchaseAgentId") === checkedList[0]?.get("purchaseAgentId")
          ) ? checkedList[0]?.get("purchaseAgentId") : null;
          const purchaseAgentName = purchaseAgentId ? checkedList[0]?.get("purchaseAgentName") : null;
          // 是否转单标识 transferFlag
          const allSameFlag = checkedList.every((ele) => ele.get("transferFlag") === checkedList[0]?.get("transferFlag"));
          const executionStrategyCode = checkedList.every(
            (item) => item.get("executionStrategyCode") === checkedList[0]?.get("executionStrategyCode")
          ) ? checkedList[0]?.get("executionStrategyCode") : null;
          const executionStrategyMeaning = executionStrategyCode ? checkedList[0]?.get("executionStrategyMeaning") : null;
          const secondLevelStrategyCode = checkedList.every(
            (ele) => ele.get("secondLevelStrategyCode") === checkedList[0]?.get("secondLevelStrategyCode")
          ) ? checkedList[0]?.get("secondLevelStrategyCode") : null;
          const secondLevelStrategyMeaning = secondLevelStrategyCode ? checkedList[0]?.get("secondLevelStrategyMeaning") : null;
          const purchaseOrgIds = checkedList.some((ele) => !ele.get("purchaseOrgId")) ? null : [ ...new Set(checkedList.map((ele) => ele.get("purchaseOrgId"))) ].join(",");
          const attributeFields = Object.keys(checkedList[0]?.data).filter((ele) => ele.includes("attribute"));
          // 个性化对象
          const attributeObj = {};
          attributeFields.forEach((field) => {
            if (
              checkedList.every(
                (ele) => JSON.stringify(ele.get(field)) === JSON.stringify(checkedList[0]?.get(field))
              )
            ) {
              attributeObj[field] = checkedList[0]?.get(field);
            }
          });
          this.config = {
            setting: this.setting,
            isOldUser: this.isOldUser,
            isShowNewBid: this.isShowNewBid,
            allTransferFlag: checkedList.every((ele) => ele.transferFlag === 1),
            purchaseOrgIds,
            defaultValue: {
              executionStrategyCode,
              executionStrategyMeaning,
              secondLevelStrategyCode,
              secondLevelStrategyMeaning,
              purchaseAgentId,
              purchaseAgentName,
              ...attributeObj,
            }
          };
          if (!allSameFlag && this.setting === "1") {
            this.$notification.open({
              message: $T("sprm.common.model.common.reMaintainSelect").$D("存在已转单和未转单的申请行，请重新维护！"),
              class: "notification",
            });
          }
          this.assignPopupFlag = true;
        },
      };

      const enableBtn = {
        text: $T("sprm.purchaseRequisitionAssign.view.button.enable").$D("启用"),
        title: $T("sprm.purchaseRequisitionAssign.view.button.enable").$D("启用"),
        bordered: true,
        type: "primary",
        visible: true,
        size: "large",
        permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.open",
        handler: () => {
          const checkedList = this.checkedList;
          this.$loading.show();
          enable(checkedList.map((ele) => ele.toData())).then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                class: "notification"
              });
              this.$loading.hide();
              this.refresh();
            } else {
              this.$loading.hide();
              this.refresh();
            }
          });
        },
      };

      const returntoassignBtn = {
        text: $T("sprm.common.view.btn.returntoassign").$D("退回至待分配"),
        title: $T("sprm.common.view.btn.returntoassign").$D("退回至待分配"),
        bordered: true,
        type: "danger",
        visible: true,
        size: "large",
        permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.returntoassign",
        handler: () => {
          this.backPopupFlag = true;
        },
      };

      if (this.checkedList[0]?.get("prLineStatusCode") !== "SUSPEND") {
        btnArr.push(suspendBtn, assignBtn);
      }

      if (this.checkedList[0]?.get("prLineStatusCode") === "SUSPEND") {
        btnArr.push(enableBtn);
      }

      if (this.tabType === "ASSIGNED" && !this.checkedList.some((record) => record.get("occupiedQuantity") || record.get("orderOccupiedQuantity") || record.get("sourceOccupiedQuantity"))) {
        btnArr.push(returntoassignBtn);
      }

      return btnArr;
    },
    getColumns() {
      return [
        {
          fieldCode: "displayLineNum",
          fieldName: $T("sprm.common.model.common.prNum").$D("采购申请编号"),
          render: (val, item) =>
            <span>
              {`${item.displayPrNum}-${item.displayLineNum}`}
            </span>,
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
        },
        {
          fieldCode: "itemName",
          fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
        },
        {
          fieldCode: "categoryName",
          fieldName: $T("sprm.common.model.common.categoryName").$D("物料分类"),
        },
        {
          fieldCode: "quantity",
          fieldName: getDynamicLabel(this.uomControlFlag, "quantity"),
        },
        this.uomControlFlag && {
          fieldCode: "secondaryQuantity",
          fieldName: $T("sprm.common.model.common.quantity").$D("数量"),
        },
        {
          fieldCode: "referencePriceFlag",
          fieldName: $T("sprm.common.model.common.referPrice").$D("参考价格"),
          render: (val, item) => val === 1 && item.itemCode && item.prSourcePlatform !== "CATALOGUE" ? <ReferPricePopup data={item} /> : null,
        },
        {
          fieldCode: "executionStrategyCode",
          fieldName: $T("sprm.common.model.common.executionStrategyCode").$D("执行策略"),
          render: (val, item) => item.executionStrategyMeaning,
        },
        {
          fieldCode: "currencyCode",
          fieldName: $T("sprm.common.model.common.currencyCode").$D("币种"),
        },
        {
          fieldCode: "unitPriceBatch",
          fieldName: $T("sprm.common.model.common.unitPriceBatch").$D("每"),
        },
        {
          fieldCode: "taxIncludedUnitPrice",
          fieldName: getDynamicLabel(this.uomControlFlag, "taxIncludedUnitPrice"),
          render: (val, item) => item.linePriceHiddenFlag === 1 ? item.taxIncludedUnitPriceMeaning : val,
        },
        this.uomControlFlag && {
          fieldCode: "secondaryTaxInUnitPrice",
          fieldName: $T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价(含税)"),
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.secondaryTaxInUnitPriceMeaning;
            }
            return Number(SrmUtil.getNumberLocalized(val, length));
          },
        },
        {
          fieldCode: "taxIncludedBudgetUnitPrice",
          fieldName: $T("sprm.common.model.common.taxIncludedBudgetUnitPrice").$D("预算单价(含税)"),
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedBudgetUnitPriceMeaning;
            }
            return Number(SrmUtil.getNumberLocalized(val, length));
          },
        },
        {
          fieldCode: "taxIncludedLineAmount",
          fieldName: $T("sprm.common.model.common.lineAmount").$D("行金额"),
          render: (val, item) => {
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedLineAmountMeaning;
            }
            return SrmUtil.getNumberLocalized(val, item.financialPrecision);
          },
        },
        {
          fieldCode: "budgetIoFlag",
          fieldName: $T("sprm.common.model.common.budgetIoFlag").$D("预算外标识"),
          render: this.renderYesNo,
        },
        {
          fieldCode: "uomCodeAndName",
          fieldName: getDynamicLabel(this.uomControlFlag, "uom"),
        },
        this.uomControlFlag && {
          fieldCode: "secondaryUomCodeAndName",
          fieldName: $T("sprm.common.model.common.uomName").$D("单位"),
        },
        {
          fieldCode: "neededDate",
          fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
        },
        {
          fieldCode: "requestDate",
          fieldName: $T("sprm.common.model.common.requestDate").$D("申请日期"),
        },
        {
          fieldCode: "companyName",
          fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
        },
        {
          fieldCode: "ouName",
          fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
        },
        {
          fieldCode: "purchaseOrgName",
          fieldName: $T("entity.organization.class.purchase").$D("采购组织"),
        },
        {
          fieldCode: "purchaseAgentName",
          fieldName: $T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
        },
        {
          fieldCode: "prRequestedName",
          fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
        },
        {
          fieldCode: "executorName",
          fieldName: $T("sprm.common.model.common.handlePerson").$D("需求执行人"),
        },
        {
          fieldCode: "invOrganizationName",
          fieldName: $T("entity.organization.class.inventory").$D("库存组织"),
        },
        {
          fieldCode: "unitName",
          fieldName: $T("sprm.common.model.common.unitName").$D("所属部门"),
        },
        {
          fieldCode: "creatorName",
          fieldName: $T("entity.roles.creator").$D("创建人"),
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("sprm.common.model.common.creationTime").$D("创建时间"),
        },
        {
          fieldCode: "assignedDate",
          fieldName: $T("sprm.common.model.common.assignedDate").$D("分配日期"),
        },
        {
          fieldCode: "productBrand",
          fieldName: $T("sprm.common.shoppingMall.model.productBrand").$D("商品品牌"),
        },
        {
          fieldCode: "productModel",
          fieldName: $T("sprm.common.shoppingMall.model.productModel").$D("所属型号"),
        },
        {
          fieldCode: "packingList",
          fieldName: $T("sprm.common.shoppingMall.model.packingList").$D("商品规格"),
        },
        {
          fieldCode: "itemModel",
          fieldName: $T("sprm.common.model.common.itemModel").$D("型号"),
        },
        {
          fieldCode: "itemSpecs",
          fieldName: $T("sprm.common.model.common.itemSpecs").$D("规格"),
        },
        {
          fieldCode: "prSourcePlatform",
          fieldName: $T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
          render: (val, item) => item.prSourcePlatformMeaning,
        },
        {
          fieldCode: "prTypeName",
          fieldName: $T("sprm.common.model.common.sqType").$D("申请类型"),
        },
        {
          fieldCode: "changeOrderCode",
          fieldName: $T("sprm.common.model.autoOrderStatus").$D("自动创建PO状态"),
          render: (val, item) => {
            const data = this.changeOrderCodeType.find((ele) => ele.code === val);
            if (data) {
              return (
                <div>
                  <srm-tooltip title={item.changeOrderMessage} placement="top">
                    <span>{data.meaning}</span>
                  </srm-tooltip>
                </div>
              );
            }
            return null;
          },
        },
        {
          fieldCode: "erpEditStatus",
          fieldName: $T("sprm.common.model.common.ERPstatus").$D("ERP状态"),
          render: (val, item) => item.erpEditStatusMeaning,
        },
        {
          fieldCode: "executionStatusMeaning",
          fieldName: $T("sprm.common.model.common.handleStatus").$D("执行状态"),
        },
        {
          fieldCode: "executionHeaderBillNum",
          fieldName: $T("sprm.purchaseRequisitionAssign.model.common.executionBillNum").$D("执行单据编号"),
        },
        {
          fieldCode: "title",
          fieldName: $T("sprm.common.model.common.title").$D("标题"),
        },
        {
          fieldCode: "remark",
          fieldName: $T("hzero.common.remark").$D("备注"),
        },
        {
          fieldCode: "projectCategoryMeaning",
          fieldName: $T("sprm.common.model.common.projectCategory").$D("项目类别"),
        },
        {
          fieldCode: "wbs",
          fieldName: $T("sprm.common.model.wbs").$D("WBS元素"),
        },
        {
          fieldCode: "projectNum",
          fieldName: $T("sprm.common.model.common.projectNum").$D("项目号"),
        },
        {
          fieldCode: "projectName",
          fieldName: $T("sprm.common.model.common.projectName").$D("项目名称"),
        },
        {
          fieldCode: "supplierItemCode",
          fieldName: $T("sprm.common.model.common.supplierItemNum").$D("供应商料号"),
        },
        {
          fieldCode: "supplierItemName",
          fieldName: $T("sprm.common.model.common.supplierItemName").$D("供应商料号描述"),
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("hzero.common.upload.modal.title").$D("附件"),
          fieldType: "UPLOAD",
          editor: false,
        },
        {
          fieldCode: "operatorRecord",
          fieldName: $T("hzero.common.button.operating").$D("操作记录"),
          render: () => <a style={{ color: "#276EF1" }} onClick={this.openPoppup} >{$T("hipspfm.workFlow.view.message.viewRecord").$D("查看操作记录")}</a>,
        },
        {
          fieldCode: "backToUnassignReason",
          fieldName: $T("sprm.common.model.common.backToUnassignReason").$D("退回原因"),
        },
      ];
    },
  },
  beforeMount() {
    if (!isEmpty(this.$route.params)) {
      const { dataSet, checkedList = [], setting, isOldUser, isShowNewBid, tabType } = this.$route.params;
      this.dataSet = dataSet;
      this.checkedList = checkedList;
      this.setting = setting;
      this.isOldUser = isOldUser;
      this.isShowNewBid = isShowNewBid;
      this.tabType = tabType;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const records = await getActionsRecordApi(this.checkedList[0]?.get("prHeaderId"));
      let uomControlInfo = await getUomControlApi(this.prHeaderId);
      // 获取双单位-申请配置
      this.uomControlFlag = uomControlInfo?.SPRM;
      /**
           * 动作为【新增行/删除行】的操作记录直接隐藏，
           * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
           * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
           * 动作为【分配】的操作记录不允许合并
           * 动作为【更新/变更】的操作记录 对字段进行合并记录
           */
      let data = [];
      (isArray(records) ? records : []).map((res) => {
        if (res.processTypeCode !== "NEWLINE" && res.processTypeCode !== "DELLINE") {
          if (res.processTypeCode === "ASSIGNED") {
            data.push(res);
          } else if (res.processTypeCode === "UPDATE") {
            if (data.findIndex((val) => val.batchNo === res.batchNo) === -1) {
              // 拼接更新的信息
              let updateRecords = [];
              records.map((val) => {
                if (val.batchNo === res.batchNo) {
                  updateRecords.push(val);
                }
              });
              let processRemarks = updateRecords.map((u) =>
                `\n${u.processUserName} ${u.processRemark ? u.processRemark : `将【${u.changeFieldMeaning}】由【${u.oldValue || ""}】改成【${u.newValue}】 行号【${u.displayLineNum}】`}`
              ) || [ {} ];
              data.push({ ...res, processRemark: processRemarks.join("\n") });
            }
          } else if (data.findIndex((val) => val.processedDate === res.processedDate && val.batchNo === res.batchNo) === -1) {
            if (res.processTypeCode === "CHANGE") {
              // 拼接变更的信息
              let updateRecords = [];
              records.map((val) => {
                if (val.batchNo === res.batchNo) {
                  updateRecords.push(val);
                }
              });
              let processRemarks = updateRecords.map((u) =>
                `\n${u.processUserName} ${u.processRemark ? u.processRemark : `将【${u.changeFieldMeaning}】由【${u.oldValue || ""}】改成【${u.newValue}】 行号【${u.displayLineNum}】`}`
              ) || [ {} ];
              data.push({ ...res, processRemark: processRemarks.join("\n") });
            } else {
              data.push(res);
            }
          }
        }
      });
      this.actionRecordList = data.map((val) => ({
        ...val,
        status: {
          type: "info",
          text: val.processTypeCodeMeaning,
        }
      }));
    },
    refresh() {
      this.$router.back();
    },
    renderYesNo(val) {
      return val ? $T("smbl.common.view.yes").$D("是") : $T("smbl.common.view.no").$D("否");
    },
    openPoppup() {
      this.visible = true;
    },
    onClosePoppup() {
      this.visible = false;
    }
  },
};
</script>

<style lang="stylus" scoped>

.purchase-requisition-assign-detail {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll
}

.purchase-requisition-assign-detail-content{
  height: 100vh;
  padding-bottom: 60px;
}

</style>