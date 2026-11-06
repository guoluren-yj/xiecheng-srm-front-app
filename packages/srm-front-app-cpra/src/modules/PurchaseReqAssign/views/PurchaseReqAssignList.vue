<template>
  <div class="purchase-requisition-assign-list">
    <srm-list :data-set="dataSet" :columns="getColumns" customize-code="SMBL.PURCHASEREQ.ASSIGN.LIST" :buttons="getButtons" @itemClick="itemClick">
      <srm-tab-bar
        slot="filter"
        :tabs="tabs"
        display="justify"
        :active-index="currentTab"
        @indexChange="onTabIndexChange"/>
    </srm-list>

    <!-- 以弹窗形式显示 -->
    <!--    分配 -->
    <assign-popup v-model="assignPopupFlag" :config="config" :checked-list="checkedList" @onSuccess="refresh"/>
    <!--    暂挂 -->
    <suspend-popup v-model="suspendPopupFlag" :checked-list="checkedList" @onSuccess="refresh"/>
    <!--    退回 -->
    <back-reason-popup v-model="backPopupFlag" :checked-list="checkedList" @onSuccess="refresh"/>
  </div>
</template>

<script>
import { purchaseRequisitionListDS } from "../datasource/PurchaseReqAssignListDs";
import { DataSet, SrmUtil, $T } from "srm-mobile-ui";
import AssignPopup from "../components/AssignPopup.vue";
import SuspendPopup from "../components/SuspendPopup.vue";
import BackReasonPopup from "../components/BackReasonPopup.vue";
import ReferPricePopup from "../components/ReferPricePopup.vue";
import { fetchExecutionLink, fetchNewLinkStrategy, fetchNewBidConfig, fetchDoExecute } from "../api/config";
import { enable, getUomControlApi } from "../api";
import { getDynamicLabel } from "@/utils/index";

const { isEmpty } = SrmUtil;

export default {
  modules: [ "hzero.common", "sprm.common", "sprm.purchasePlatform", "sprm.purchaseRequisitionAssign", "smbl.common", "entity.supplier", "sodr.common", "ssrc.priceLibrary" ],
  name: "PurchaseReqAssignList",
  components:{ AssignPopup, SuspendPopup, BackReasonPopup },
  data() {
    return {
      dataSet: new DataSet(purchaseRequisitionListDS()),
      tabType: "",
      tabs: [
        $T("sprm.purchaseRequisitionAssign.view.button.notAssign").$D("待分配"),
        $T("sprm.purchaseRequisitionAssign.view.button.assigned").$D("已分配"),
        $T("sprm.purchaseRequisitionAssign.view.button.suspend").$D("暂挂"),
        $T("sprm.purchaseRequisitionAssign.view.button.all").$D("全部"),
      ],
      currentTab: 0,
      setting: "0",
      uomControlFlag: 0,
      isOldUser: false,
      isShowNewBid: false,
      assignPopupFlag: false,
      suspendPopupFlag: false,
      backPopupFlag: false,
      config: {},
      checkedList: [],
      fontColor:{
        "APPROVED":"#FFC043",
        "SUSPEND":"#E11900",
        "ASSIGNED":"#05944F",
      }
    };
  },
  computed: {
    getButtons() {
      return [
        {
          text: $T("sprm.purchaseRequisitionAssign.view.button.suspend").$D("暂挂"),
          bordered: true,
          type: "primary",
          visible: this.currentTab !== 2,
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.suspend",
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.some((record) => record.get("prLineStatusCode") === "SUSPEND");
            if (flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            // 预算金额校验
            this.checkedList = checkedList;
            this.suspendPopupFlag = true;
          },
        },
        {
          text: $T("sprm.purchaseRequisitionAssign.view.button.assign").$D("分配"),
          bordered: true,
          fill: true,
          visible: this.currentTab !== 2,
          type: "primary",
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.assign",
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.some((record) => record.get("prLineStatusCode") === "SUSPEND");
            if (flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            this.checkedList = checkedList;
            const purchaseAgentId = checkedList.every(
              (ele) => ele.get("purchaseAgentId") === checkedList[0].get("purchaseAgentId")
            ) ? checkedList[0].get("purchaseAgentId") : null;
            const purchaseAgentName = purchaseAgentId ? checkedList[0].get("purchaseAgentName") : null;
            // 是否转单标识 transferFlag
            const allSameFlag = checkedList.every((ele) => ele.get("transferFlag") === checkedList[0].get("transferFlag"));
            const executionStrategyCode = checkedList.every(
              (item) => item.get("executionStrategyCode") === checkedList[0].get("executionStrategyCode")
            ) ? checkedList[0].get("executionStrategyCode") : null;
            const executionStrategyMeaning = executionStrategyCode ? checkedList[0].get("executionStrategyMeaning") : null;
            const secondLevelStrategyCode = checkedList.every(
              (ele) => ele.get("secondLevelStrategyCode") === checkedList[0].get("secondLevelStrategyCode")
            ) ? checkedList[0].get("secondLevelStrategyCode") : null;
            const secondLevelStrategyMeaning = secondLevelStrategyCode ? checkedList[0].get("secondLevelStrategyMeaning") : null;
            const purchaseOrgIds = checkedList.some((ele) => !ele.get("purchaseOrgId")) ? null : [ ...new Set(checkedList.map((ele) => ele.get("purchaseOrgId"))) ].join(",");
            const attributeFields = Object.keys(checkedList[0].data).filter((ele) => ele.includes("attribute"));
            // 个性化对象
            const attributeObj = {};
            attributeFields.forEach((field) => {
              if (
                checkedList.every(
                  (ele) => JSON.stringify(ele.get(field)) === JSON.stringify(checkedList[0].get(field))
                )
              ) {
                attributeObj[field] = checkedList[0].get(field);
              }
            });
            this.config = {
              setting: this.setting,
              isOldUser: this.isOldUser,
              isShowNewBid: this.isShowNewBid,
              allTransferFlag: checkedList.every((ele) => ele.transferFlag === 1),
              purchaseOrgIds,
              defaultValue:{
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
        },
        {
          text: $T("sprm.purchaseRequisitionAssign.view.button.enable").$D("启用"),
          bordered: true,
          type: "primary",
          visible: [ 2, 3 ].includes(this.currentTab),
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.open",
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.every((record) => record.get("prLineStatusCode") === "SUSPEND");
            if (!flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0 || !checkedList.every((record) => record.get("prLineStatusCode") === "SUSPEND")) {
              return;
            }
            this.$loading.show();
            enable(checkedList.map((ele) => ele.toData())).then((res) => {
              if (res && !res.failed) {
                this.dataSet.refresh().then(() => {
                  this.$notification.open({
                    message: this.$T("smbl.common.message.acction.success").$D("操作成功"),
                    class: "notification"
                  });
                  this.$loading.hide();
                });
              } else {
                this.$loading.hide();
              }
            });
          },
        },
        {
          text: $T("sprm.common.view.btn.returntoassign").$D("退回至待分配"),
          bordered: true,
          type: "danger",
          visible: this.currentTab === 1,
          size: "large",
          permissionCode: "hzero.srm.requirement.prm.pr-execution.ps.returntoassign",
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            const flag = checkedList.some((record) => record.get("occupiedQuantity") || record.get("orderOccupiedQuantity") || record.get("sourceOccupiedQuantity"));
            if (flag) {
              return true;
            }
          },
          callback: (checkedList) => {
            if (checkedList.length === 0 || checkedList.some((record) => record.get("occupiedQuantity") || record.get("orderOccupiedQuantity") || record.get("sourceOccupiedQuantity"))) {
              return;
            }
            this.checkedList = checkedList;
            this.backPopupFlag = true;
          },
        },
      ];
    },
    getColumns() {
      return [
        {
          fieldCode: "displayLineNum",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>
              {`${item.displayPrNum}-${item.displayLineNum}`}
              {
                item.urgentFlag === 1 ? <em class="srm-icon icon-bolt" style="color: red; font-size: 14px; padding-bottom: 5px;"/> : ""
              }
            </span>
            <span slot="right" style={{ color: this.fontColor[item.prLineStatusCode] }}>{item.prLineStatusCodeMeaning }</span>
          </SrmListHeader>,
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
          fieldCode: "quantity",
          fieldName: getDynamicLabel(this.uomControlFlag, "quantity"),
        },
        {
          fieldCode: "referencePriceFlag",
          fieldName: $T("sprm.common.model.common.referPrice").$D("参考价格"),
          render: (val, item) => val === 1 && item.itemCode && item.prSourcePlatform !== "CATALOGUE" ? <ReferPricePopup data={item} /> : null,
        },
        {
          fieldCode: "taxIncludedUnitPrice",
          fieldName: getDynamicLabel(this.uomControlFlag, "taxIncludedUnitPrice"),
          render: (val, item) => {
            let length = 0;
            if (item.prSourcePlatform === "SRM") {
              length = item.financialPrecision;
            }
            if (item.linePriceHiddenFlag === 1) {
              return item.taxIncludedUnitPriceMeaning;
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
          fieldCode: "neededDate",
          fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
        },
      ];
    },
  },
  activated() {
    this.onTabIndexChange(this.currentTab);
    this.init();
  },
  methods: {
    init() {
      getUomControlApi().then((res) => {
        if (res && !res.failed) {
          // 获取双单位-申请配置
          this.uomControlFlag = res?.SPRM;
        }
      });
      fetchExecutionLink().then((res) => {
        if (res && !isEmpty(res.content)) {
          this.isOldUser = true;
          fetchDoExecute([ { fullPathCode: "SITE.SPUC.PR.EXECUTION_STRATEGY" } ])
            .then((res1) => {
            // 自动分配的未开启执行策略
              if (res && Array.isArray(res1)) {
                this.setting = res1[0];
              }
            });
        } else {
          fetchNewLinkStrategy().then((item) => {
            if (item && Array.isArray(item)) {
              this.setting = item[0];
            }
          });
        }
      });
      fetchNewBidConfig().then((result) => {
        if (result && !isEmpty(result)) {
          this.isShowNewBid = true;
        } else {
          this.isShowNewBid = false;
        }
      });
    },
    itemClick(item) {
      // 进入详情
      this.$router.push({
        name: "PurchaseReqAssignDetail",
        params: {
          dataSet: this.dataSet,
          checkedList: [ item ],
          setting: this.setting,
          isOldUser: this.isOldUser,
          isShowNewBid: this.isShowNewBid,
          tabType: this.tabType,
        }
      });
    },
    onTabIndexChange(index) {
      this.currentTab = index;
      switch (index) {
      case 0:
        this.tabType = "APPROVED";
        break;
      case 1:
        this.tabType = "ASSIGNED";
        break;
      case 2:
        this.tabType = "SUSPEND";
        break;
      case 3:
        this.tabType = "ALL";
        break;
      default:
        break;
      }

      if (this.tabType === "ALL") {
        this.dataSet.addPathParameter("prLineStatusCode", "");
      } else {
        this.dataSet.addPathParameter("prLineStatusCode", this.tabType);
      }

      if (this.tabType === "APPROVED") {
        this.dataSet.addPathParameter("waitAssignRequestFlag", 1);
      } else {
        this.dataSet.addPathParameter("waitAssignRequestFlag", "");
      }

      this.dataSet.refresh();
    },
    refresh() {
      this.dataSet.refresh();
    },
  },
};
</script>

<style lang="stylus" scoped>

.purchase-requisition-assign-list {
  width: 100vw;
  height: 100vh;
}

</style>