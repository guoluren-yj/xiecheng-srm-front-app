<template>
  <div style="height: 100vh">
    <NavHead title="供货明细确认"/>
    <srm-list :data-set="dataSet"
              :columns="getColumns()"
              :buttons="getButtons()"
              @itemClick="onItemClick">
      <div slot="filter" class="tab-box">
        <span class="tab-item" :class="{'tab-item-active': currentTabIndex == 0}" @click="selectTabAtIndex(0)">待确认</span>
        <span class="tab-item" :class="{'tab-item-active': currentTabIndex == 1}" @click="selectTabAtIndex(1)">已确认</span>
      </div>
    </srm-list>
  </div>
</template>

<script>
import supplyItemDetailConfirmDatasource from "../dataSource/SJSupplyItemDetailConfirmDatasource";
import { DataSet } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";
import { confirmSupplyDetailApi } from "../api/index";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "smbl.common","ssrc.queryRfq","sodr.writeOff","ssrc.common" ],
  name: "SJSupplyItemDetailConfirm",
  components: { NavHead },
  data() {
    return {
      dataSet: new DataSet(supplyItemDetailConfirmDatasource()),
      currentTabIndex: 0,
    };
  },
  beforeMount() {
    this.userInfo = SrmUtil.getUserInfo();
    this.dataSet.addQueryParameter("agencyUserId", this.userInfo.id);
    this.dataSet.addQueryParameter("status", "WAIT_CONFIRM");
  },
  methods: {
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      if (index === 0) {
        this.dataSet.editFlag = true;
        this.dataSet.addQueryParameter("status", "WAIT_CONFIRM");
      } else {
        this.dataSet.editFlag = false;
        this.dataSet.addQueryParameter("status", "CONFIRMED");
      }
      this.dataSet.refresh();
    },
    getButtons() {
      return [
        {
          text: "批量确认",
          fill: true,
          visible: () => {
            return true;
          },
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
          callback: (checkedList) => {
            // 保存数据
            let checkedItems = [];

            // 遍历取出item
            for (let i = 0; i < checkedList.length; i++) {
              let item = checkedList[i].data;

              if (!item.deliverPrice) {
                this.$notification.open({
                  message: this.$T("smbl.common.view.noDeliverPrice").$D("交付价格为必填"),
                  class: "notification",
                  duration: 3
                });
                return;
              }
              if (!item.deliverQuantity) {
                this.$notification.open({
                  message: this.$T("smbl.common.view.noDeliverQuantity").$D("交付数量为必填"),
                  class: "notification",
                  duration: 3
                });
                return;
              }
              checkedItems.push(item);
            }
            this.$loading.show();
            confirmSupplyDetailApi(checkedItems).then((res) => {
              if (res && res.length) {
                this.$notification.open({
                  message: this.$T("smbl.common.view.confirmSuccess").$D("确认成功"),
                  class: "notification",
                  duration: 3
                });
                this.dataSet.refresh();
              }
              this.$loading.hide();
            }).finally(() => {
              this.$loading.hide();
            });
          },
        }
      ];
    },
    onItemClick(item) {
      this.goToSupplyItemDetailModifyPage(item.data);
    },
    goToSupplyItemDetailModifyPage(item) {
      this.$router.push({
        name: "SJSupplyItemDetailModify",
        query: { supplyDetailId: item.supplyDetailId },
      });
    },
    getColumns() {
      return [ {
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => {
          return <SrmListHeader>
            <span>{item.poNum}</span>
            <span slot="right">{item.payFlag ? "已付款" : "未付款"}</span>
          </SrmListHeader>;
        }
      }, {
        fieldCode: "deliverQuantity",
        fieldType: "EMPTY",
        render: (val, item) => {
          return (
            <div onClick={(e)=>{
              this.goToSupplyItemDetailModifyPage(item);
              e.stopPropagation();
            }}>
              <SrmFlex direction="column">
                <SrmFlex class="flex-row">
                  <SrmFlexItem>{this.$T("smbl.common.model.deliverQuantity").$D("交付数量")}：</SrmFlexItem>
                  <SrmFlexItem>{item.deliverQuantity}</SrmFlexItem>
                </SrmFlex>
                <SrmFlex class="flex-row">
                  <SrmFlexItem>{this.$T("smbl.common.model.deliverPrice").$D("交付金额")}：</SrmFlexItem>
                  <SrmFlexItem>{item.deliverPrice}</SrmFlexItem>
                </SrmFlex>
                <SrmFlex class="flex-row">
                  <SrmFlexItem>{this.$T("smbl.common.model.peasant").$D("农户")}：</SrmFlexItem>
                  <SrmFlexItem>{item.peasantUserName}</SrmFlexItem>
                </SrmFlex>
                <SrmFlex class="flex-row">
                  <SrmFlexItem>{this.$T("smbl.common.model.product").$D("商品")}：</SrmFlexItem>
                  <SrmFlexItem>{item.itemName}</SrmFlexItem>
                </SrmFlex>
                <SrmFlex class="flex-row">
                  <SrmFlexItem>{this.$T("smbl.common.model.supplyDetailNum").$D("供货明细单号")}：</SrmFlexItem>
                  <SrmFlexItem>{item.supplyDetailNum}</SrmFlexItem>
                </SrmFlex>
                <SrmFlex class="flex-row">
                  <SrmFlexItem>{!this.currentTabIndex ? this.$T("smbl.common.model.creationDate").$D("提交时间") : this.$T("smbl.common.model.confirmTime").$D("确认时间")}：</SrmFlexItem>
                  <SrmFlexItem>{!this.currentTabIndex ? item.creationDate : item.confirmTime}</SrmFlexItem>
                </SrmFlex>
              </SrmFlex>
            </div>
          );
        }
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
