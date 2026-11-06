<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              :columns="columns"
              :buttons="buttons"
              :customize-code="customizeCode"
              @itemClick="onItemClick">
      <div slot="filter" class="tab-box">
        <span class="tab-item" :class="{'tab-item-active': currentTabIndex === 0}" @click="selectTabAtIndex(0)">{{ $T('hipspfm.createDelivery.view.tab.cretae').$D('创建') }}</span>
        <span class="tab-item" :class="{'tab-item-active': currentTabIndex === 1}" @click="selectTabAtIndex(1)">{{ $T('hipspfm.createDelivery.view.tab.maintain').$D('维护') }}</span>
      </div>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
import { indexDS, mainTainDS } from "../datasource/indexDS";
import { createDeliveryApi, submitMaintainDeliveryApi, getSettingConfig } from "../api/index";
export default {
  modules: [ "sinv.common", "hipspfm.createDelivery", "hipspfm.common", "sinv.deliveryCreation", "sodr.common", "ssrc.bidHall" ],
  name: "YongXiangDeliveryList",
  data() {
    return {
      buttons: [],
      columns: [],
      dataSet: {},
      customizeCode: "",
      currentTabIndex: 0,
      planFlag: true, //是否开启计划送货
    };
  },
  created() {
    this.getSettingConfig();
  },
  methods: {
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      if (index === 0) {
        this.buttons = this.getButtons();
        this.columns = this.getColumns();
        this.dataSet = new DataSet(indexDS());
        this.dataSet.addQueryParameter("planFlag", this.planFlag ? 1 : 0);
        this.customizeCode = "SMBL.CREATE_DELIVERY.CERATE_LIST";
      } else {
        this.buttons = this.getMatainButtons();
        this.columns = this.getMatainColumns();
        this.dataSet = new DataSet(mainTainDS());
        this.customizeCode = "SMBL.CREATE_DELIVERY.MATAIN_LIST";
      }
      // PC卡片拖拽功能
      // this.dataSet.setQueryParameter({ "displayPoNum": this.$route.query.displayPoNum });
      this.dataSet.refresh();
    },
    onItemClick(item) {
      if (this.currentTabIndex === 0) {
        this.goCreateDeliveryDetail(item.data);
      } else {
        this.goDeliveryDetail(item.data.asnHeaderId);
      }
    },
    // 跳转创建详情页
    goCreateDeliveryDetail(item) {
      this.$router.push({
        name: "YongXiangCreateDeliveryDetail",
        params: { item },
      });
    },
    // 跳转维护详情页
    goDeliveryDetail(asnHeaderId) {
      this.$router.push({
        name: "YongXiangDeliveryDetail",
        query: { asnHeaderId }
      });
    },
    // 获取配置
    async getSettingConfig() {
      const params = {
        settingCode: "010807",
        organizationId: localStorage.getItem("organizationId"),
      };

      const resp = await getSettingConfig(params);

      this.planFlag = resp.settingValue === "1";
      this.selectTabAtIndex(0);
    },
    // 创建送货单
    createDelivery(createDeliveryList) {
      this.$loading.show();
      createDeliveryApi(createDeliveryList).then((res) => {
        this.$loading.hide();
        if (res && !res.failed) {
          const asnHeaderId = res[0].asnHeaderId;

          this.$router.push({ name: "YongXiangDeliveryDetail", query: { asnHeaderId } });
        }
      });
    },
    // 提交维护送货单
    subMaintainDelivery(mainTainDeliveryList) {
      // eslint-disable-next-line consistent-this
      const self = this;

      self.$dialog({
        closable: false,
        content: this.$T("sinv.common.model.common.confirmSubmit").$D("是否确认提交送货单"),
        onOk() {
          self.$loading.show();
          submitMaintainDeliveryApi(mainTainDeliveryList).then((res) => {
            // self.mainTainDeliveryList = [];
            self.$loading.hide();
            // eslint-disable-next-line no-empty
            if (res && res.failed) {} else {
              self.dataSet.refresh();
              self.$notification.open({
                message:self.$T("hipspfm.createDelivery.view.message.submitSuccessed").$D("提交成功"),
                description: "",
                class:"notification",
              });
            }
          });
        },
      });
    },
    // 创建按钮
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.createDelivery.view.tab.cretae").$D("创建"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedData = checkedList.map((v) => v.data);
            this.createDelivery(checkedData);
          },
        }
      ];
    },
    // 维护按钮
    getMatainButtons() {
      const that = this;

      return [
        {
          text: that.$T("hipspfm.common.button.submit").$D("提交"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedData = checkedList.map((v) => ({ ...v.data, shipDate: v.data.shipDate + " 00:00:00" }));
            that.subMaintainDelivery(checkedData);
          },
        },
        "delete"
      ];
    },
    // 创建
    getColumns() {
      return [ {
        formRow: 0,
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <span>{item.displayPoNum}</span>
          <span slot="right">{this.$T("sinv.common.model.common.displayLineNum").$D("订单行号")}：{item.displayLineNum}</span>
        </SrmListHeader>
      },
      {
        fieldCode: "itemName",
        fieldName: this.$T("hipspfm.createDelivery.model.createDelivery.itemName").$D("原材料"),
      },
      {
        fieldCode: "canAsnQuantity",
        fieldName: this.$T("sinv.common.model.common.shippableQuantity").$D("可发货数量"),
        fieldType: "INPUT_NUMBER",
        editor: false,
      },
      {
        fieldCode: "needByDate",
        fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
        render: (val) => dateFormat(val)
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: this.$T("hipspfm.createDelivery.model.createDelivery.invOrganizationName").$D("客户收货组织名称"),
      } ];
    },
    // 维护
    getMatainColumns() {
      return [ {
        formRow: 0,
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => <SrmListHeader>
          <span>{item.asnNum}</span>
          <span slot="right">{this.$T("hipspfm.createDelivery.model.createDelivery.standardDeliveryNote").$D("标准送货单")}</span>
        </SrmListHeader>
      },
      {
        fieldCode: "companyName",
        fieldName: this.$T("sinv.common.model.common.customer").$D("客户"),
      },
      {
        fieldCode: "creationDate",
        fieldName: this.$T("sinv.common.model.common.creationDate").$D("创建日期"),
        render: (val) =>
          // eslint-disable-next-line new-cap
          this.$options.filters.CalcDate(val)
      },
      {
        fieldCode: "organizationName",
        fieldName: this.$T("sinv.common.model.common.organizationName").$D("收货组织"),
      } ];
    },
  }
};
</script>
<style lang="stylus" scoped>
.flex-row {
  padding-top: 8px;
  line-height: 20px;
}

.tab-box {
  display: flex;
  flex-direction: row;
  padding: 15px 20px;

  .tab-item {
    flex 1;
    text-align center;
    margin-right: 15px;
    color: #1B1E2B
  }

  .tab-item-active {
    flex 1;
    text-align center;
    margin-right: 15px;
    color: #1B1E2B;
    font-weight bold;
  }
}
</style>