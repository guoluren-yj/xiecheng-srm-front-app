<template>
  <div style="height: 100vh">
    <srm-tab-bar
      slot="filter"
      :tabs="getTabs"
      display="justify"
      @indexChange="onTabIndexChange"/>
    <srm-list
      :columns="getListColumns"
      :buttons="getListButtons"
      :data-set="dsObj[type]"
      @itemClick="onListItemClick">
      <srm-dropdown
        v-show="type === 'APPROVE'"
        slot="searchLeft"
        v-model="settleTypeObj[type]"
        :value="settleTypeObj[type]"
        type="tooltip"
        :text="$T('ssta.common.view.message.selectType').$D('选择类型')"
        @select="onSettleTypeChange">
        <srm-flex direction="column">
          <srm-dropdown-item key="all" :value="undefined" :text="$T('hzero.common.status.all').$D('全部')"/>
          <srm-dropdown-item v-for="i in settleTypeData" :key="i.value" :value="i.value" :text="i.meaning"/>
        </srm-flex>
      </srm-dropdown>
      <srm-dropdown
        v-if="type === 'ALL'"
        slot="searchLeft"
        v-model="settleTypeObj[type]"
        :value="settleTypeObj[type]"
        type="tooltip"
        :text="$T('ssta.common.view.message.selectType').$D('选择类型')"
        @select="onSettleTypeChange">
        <srm-flex direction="column">
          <srm-dropdown-item key="all" :value="undefined" :text="$T('hzero.common.status.all').$D('全部')"/>
          <srm-dropdown-item v-for="i in settleTypeData" :key="i.value" :value="i.value" :text="i.meaning"/>
        </srm-flex>
      </srm-dropdown>
    </srm-list>
  </div>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { SrmButton, SrmListHeader } from "srm-mobile-ui";
import { batchConfirmSettle, confirmValidate, queryMapIdpValue, batchReturnSettle } from "../api";
import { uniqBy, fromPairs } from "lodash";
import StatusTag from "@/components/StatusTag";
export default {
  modules: [ "hzero.common", "ssta.purchaseSettle", "ssta.supplySettle", "smbl.common", "ssta.common" ],
  props: {
    role: {
      type: String,
      default: "purchaser",
    },
    dsObj: {
      type: Object,
      default: () => {},
    },
    checkDs: DataSet,
  },
  data() {
    return {
      type: "APPROVE",
      settleTypeObj: { },
      settleTypeData: [],
      settleStatusTypeMap: {},
    };
  },
  computed: {
    getListColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { settleStatus, settleStatusMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value}</span>
                <StatusTag slot="right" text={settleStatusMeaning} color={this.settleStatusTypeMap[settleStatus]} />
              </SrmListHeader>
            );
          }
        },
        { formRow: 20, formCol: 10, fieldCode: "settleTypeMeaning" },
        { formRow: 20, formCol: 20, fieldCode: "currencyCode" },
        { formRow: 30, fieldCode: "taxIncludedAmount" },
        { formRow: 40, fieldCode: "paymentAmount" },
        { formRow: 50, fieldCode: "prepaymentAmount" },
        { formRow: 60, formCol: 10, fieldCode: "creationDate" },
        { formRow: 60, formCol: 20, fieldCode: "createdUserName" },
        { formRow: 70, fieldCode: "companyName" },
        { formRow: 80, fieldCode: "supplierCompanyName" },
      ];
    },
    getListButtons() {
      if (this.type === "APPROVE") {
        return [
          {
            text: this.$T("hzero.common.button.return").$D("退回"),
            type: "danger",
            bordered: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: (selected) => {
              // this.dsObj[this.type].updateSelected();
              this.openApprovePopup(selected, "return");
            }
          },
          {
            text: this.$T("hzero.common.button.confirm").$D("确认"),
            type: "primary",
            fill: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: (selected) => {
              // this.handleBatchConfirm(selected);
              this.openApprovePopup(selected, "confirm");
            },
          },
        ];
      }
      return [];
    },
    getTabs() {
      return this.role === "supplier" ?
        [
          `${this.$T("ssta.purchaseSettle.button.auditable").$D("可审核")}`,
          `${this.$T("ssta.purchaseSettle.button.all").$D("全部")}`,
        ] : [
          `${this.$T("ssta.supplySettle.button.auditable").$D("可审核")}`,
          `${this.$T("ssta.supplySettle.button.all").$D("全部")}`,
        ];
    },
  },
  beforeMount() {
    const defaultTabIndex = this.$route.query?.defaultTabIndex || this.parameters?.defaultTabIndex;
    if (defaultTabIndex) {
      const type = defaultTabIndex.toUpperCase();
      this.settleTypeObj[this.type] = type;
    }
  },
  created() {
    this.fetchLookupData();
  },
  activated() {
    const ds = this.dsObj[this.type];
    const settleType = this.settleTypeObj[this.type];
    if (settleType) {
      ds.addQueryParameter("settleType", settleType);
    }
    ds.refresh();
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        settleStatusData: "SSTA.SETTLE_STATUS",
        settleTypeData: "SSTA.SETTLE_DOCUMENT_TYPE",
      }).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        const { settleStatusData = [], settleTypeData = [] } = res;
        this.settleStatusTypeMap = fromPairs(settleStatusData.map(({ value, tag } = {}) => [ value, tag ]));
        this.settleTypeData = settleTypeData;
      }
    },
    onTabIndexChange(index) {
      if (index === 1) {
        this.type = "ALL";
      }
      if (index === 0) {
        this.type = "APPROVE";
      }
      this.dsObj[this.type].refresh();
    },
    onSettleTypeChange() {
      const { type } = this;
      const ds = this.dsObj[type];
      ds.addQueryParameter("settleType", this.settleTypeObj[type]);
      ds.refresh();
    },
    onListItemClick(item) {
      const settleType = item.get("settleType");
      if (settleType === "PREPAYMENT") {
        this.$router.push({
          name: this.role === "purchaser" ? "PurchasePrePaymentDetail" : "SupplyPrePaymentDetail",
          query: {
            settleHeaderId: item.get("settleHeaderId"),
            type: this.type,
          },
        });
      } else {
        this.$router.push({
          name: this.role === "supplier" ? "SupplySettleDetail" : "PurchaseSettleDetail",
          query: {
            settleHeaderId: item.get("settleHeaderId"),
            settleType: item.get("settleType"),
            type: this.type,
          },
        });
      }
    },
    getConfirmColumns(settleType, settleStatus) {
      return this.role === "supplier" ? [
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) },
        { fieldCode: "supplierApprovedRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CONFIRM" ].includes(settleStatus) },
        { fieldCode: "supplierCanceledRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CANCEL" ].includes(settleStatus) }
      ] : [
        { fieldCode: "accountingDate", editor: true, visible: settleType !== "PAYMENT" && settleStatus !== "CANCELING" },
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) }
      ];
    },
    getReturnColumns(settleStatus) {
      return this.role === "supplier" ? [
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) },
        { fieldCode: "supplierApprovedRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CONFIRM" ].includes(settleStatus) },
        { fieldCode: "supplierCanceledRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CANCEL" ].includes(settleStatus) }
      ] : [
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) }
      ];
    },
    openApprovePopup(selected, action) {
      const selectData = selected.map((item) => item.toData());
      const documentTypeData = uniqBy(selectData, "documentType");
      const settleStatusData = uniqBy(selectData, "settleStatus");
      if (documentTypeData.length > 1) {
        this.$notification.open({
          message: this.$T("ssta.common.model.purchaseSettleType.errorTips")
            .$D("提交审批失败，当前勾选结算单「结算单类型」不一致，请勾选类型一致的结算单进行批量审批"),
        });
        return;
      }
      if (settleStatusData.length > 1) {
        this.$notification.open({
          message: this.$T("ssta.common.model.purchaseSettleStatus.errorTips")
            .$D("提交审批失败，当前勾选「结算单状态」不一致，请勾选状态一致且类型一致的结算单进行批量审批"),
        });
        return;
      }
      this.checkDs.reset();
      // 需要手动create一下，不然点击审核确认时无法获取输入的值，ds里面的autoCreate无效
      this.checkDs.create({}, 0);
      const { settleStatus, settleType } = settleStatusData[0] || {};
      const approveColumns = action === "confirm" ? this.getConfirmColumns(settleType, settleStatus) : this.getReturnColumns(settleStatus);
      const okType = action === "confirm" ? "primary" : "danger";
      const okFunc = action === "confirm" ? this.handleBatchConfirm : this.handleBatchReturn;
      const okText = action === "confirm" ? this.$T("hzero.common.button.confirm").$D("确认") : this.$T("hzero.common.button.return").$D("退回");
      const approvePopup = this.$popup({
        rounded: true,
        height: "70%",
        showClose: true,
        showHeader: true,
        title: this.supplierFlag ?
          this.$T("ssta.supplySettle.view.title.approveInfo").$D("审核信息") :
          this.$T("ssta.purchaseSettle.view.title.approveInfo").$D("审核信息"),
        content:
          <div style={{ height: "100%", display:"flex", flexDirection: "column", justifyContent: "space-between" }}>
            <SrmForm customizeType="detail" dataSet={this.checkDs} columns={approveColumns} />
            <div style={{ padding: "12px 15px" }}>
              <SrmButton
                bordered
                size="x-large"
                type="danger"
                style={{ width: "calc(50% - 6px)", marginRight: "12px" }}
                onClick={() => approvePopup.onClose()}
              >
                {this.$T("hzero.common.button.cancel").$D("取消")}
              </SrmButton>
              <SrmButton
                fill
                size="x-large"
                type={okType}
                style={{ width: "calc(50% - 6px)" }}
                onClick={() => {
                  okFunc(selectData, approvePopup);
                  approvePopup.onClose();
                }}
              >
                {okText}
              </SrmButton>
            </div>
          </div>
        ,
      });
    },
    async handleBatchReturn(data) {
      const { role } = this;
      const checkInfo = this.checkDs.current?.toData() || {};
      const selectData = data.map((item) => ({ ...item, ...checkInfo }));
      const hasNotPre = selectData.some((item) => item.documentType !== "PREPAYMENT");
      this.$loading.show();
      const res = await batchReturnSettle({ role, body: selectData, isOnlyPre: !hasNotPre })
        .catch((err) => {
          throw err;
        });
      this.$loading.hide();
      if (res && res.failed) {
        this.$notification.open({
          message: res.message
        });
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功")
        });
        this.dsObj[this.type].refresh();
      }
    },
    async handleBatchConfirm(data) {
      const checkInfo = this.checkDs.current?.toData() || {};
      const selectData = data.map((item) => ({ ...item, ...checkInfo }));
      const { role } = this;
      const hasPre = selectData.some((item) => item.documentType === "PREPAYMENT");
      const hasNotPre = selectData.some((item) => item.documentType !== "PREPAYMENT");
      // 预付款与其他结算单类型确认接口区分
      if (hasPre && hasNotPre) {
        this.$notification.open({
          message: this.$T("ssta.purchaseSettle.view.message.documentTypeDifferent")
            .$D("请勾选同一结算单类型单据进行批量操作"),
        });
        return;
      }
      const results = await Promise.all(
        selectData.map((item) =>
          [ "SUBMITED", "WAIT_SUPPLIER_CONFIRM" ].includes(item.settleStatus) ?
            confirmValidate({ body: item, role: this.role }) :
            {}
        )
      );
      const validateOk = async () => {
        this.$loading.show();
        const res = await batchConfirmSettle({ role, body: selectData, isOnlyPre: !hasNotPre })
          .catch((err) => {
            throw err;
          });
        this.$loading.hide();
        if (res && res.failed) {
          this.$notification.open({
            message: res.message
          });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功")
          });
          this.dsObj[this.type].refresh();
        }
      };
      const checkWarn = () => {
        const validateWarnIndex = results.findIndex(
          (item) => item && item.validatedCode === "WARNING"
        );
        if (validateWarnIndex > -1) {
          const checkWarnPopup = this.$popup({
            rounded: true,
            showClose: true,
            showHeader: true,
            height: "auto",
            title: this.$T("ssta.common.view.message.tip").$D("提示"),
            content:
              <div style={{ padding: "12px 15px" }}>
                <div style={{ paddingBottom: "68px" }}>{results[validateWarnIndex].msg}</div>
                <SrmButton
                  bordered
                  size="x-large"
                  type="danger"
                  style={{ width: "calc(50% - 6px)", marginRight: "12px" }}
                  onClick={() => {
                    results.splice(validateWarnIndex, 1);
                    selectData.splice(validateWarnIndex, 1);
                    checkWarnPopup.onClose();
                    return checkWarn();
                  }}
                >
                  {this.$T("hzero.common.button.cancel").$D("取消")}
                </SrmButton>
                <SrmButton
                  fill
                  size="x-large"
                  type="primary"
                  style={{ width: "calc(50% - 6px)" }}
                  onClick={() => {
                    results.splice(validateWarnIndex, 1, {});
                    checkWarnPopup.onClose();
                    return checkWarn();
                  }}
                >
                  {this.$T("hzero.common.button.confirm").$D("确认")}
                </SrmButton>
              </div>
          });
        } else if (selectData.length > 0) {
          return validateOk();
        }
      };
      const err = results.find((item) => item && item.failed === true);
      const validateErr = results.find((item) => item && item.validatedCode === "ERROR");
      if (err) {
        this.$notification.open({
          message: err.message
        });
      } else if (validateErr) {
        this.$notification.open({
          message: validateErr.msg,
        });
      } else {
        return checkWarn();
      }
    },
  },
};
</script>