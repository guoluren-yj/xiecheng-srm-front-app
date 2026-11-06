<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="dataSet"
      customize-code="SMBL.REVERSE.LIST"
      :buttons="getButtons"
      :columns="getColumns">
      <div slot="filter" class="tab-box">
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 0 }"
          @click="selectTabAtIndex(0)">{{ $T("sinv.common.title.asn").$D("送货单") }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 1 }"
          @click="selectTabAtIndex(1)">{{
            $T("sinv.common.title.po").$D("订单")
          }}</span>
      </div>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { writeVerificationApi } from "../api/index";
import { indexDS } from "../datasource/indexDS";
export default {
  modules: [ "sinv.common", "smbl.common", "spfm.configServer", "hipspfm.reverse", "sodr.writeOff" ],
  name: "ReverseList",
  data() {
    return {
      dataSet: new DataSet(indexDS("asnNum")),
      currentTabIndex: 0,
      writeVerificationFlag:false,
    };
  },
  computed:{
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("sodr.writeOff.view.button.writeOffPreview").$D("冲销预览"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.$loading.show();
            this.toDetail(checkedListData).finally(() => this.$loading.hide());
          },
        },
      ];
    },
    getColumns() {
      const columns = [
        {
          fieldType: "EMPTY",
          fieldCode: "num",
          formRow: 0,
          render: (val, item) =>
            <SrmListHeader>
              <span>{this.currentTabIndex === 0 ? item.asnNum : item.displayPoNum} | {this.currentTabIndex === 0 ? item.displayAsnLineNum : item.displayLineNum} </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("spfm.configServer.model.mergeSourceSet.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("spfm.configServer.view.title.supplier").$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("hipspfm.reverse.model.header.WriteOffQuantity").$D("可冲销数量"),
          fieldCode: "permitReverseQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("hipspfm.reverse.model.header.ReceivingOrganization").$D("收货组织"),
          fieldType: "TEXT",
          fieldCode: "invOrganizationName",
        }
      ];
      return columns;
    },
  },
  activated() {
    this.dataSet.setQueryParameter({ receiveOrderType:"ASN" });
  },
  methods: {
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      if (index === 1) {
        this.dataSet = new DataSet(indexDS("displayPoNum"));
        this.dataSet.setQueryParameter({ receiveOrderType: "ORDER" });
      } else {
        this.dataSet = new DataSet(indexDS("asnNum"));
        this.dataSet.setQueryParameter({ receiveOrderType:"ASN" });
      }
      this.dataSet.refresh();
    },
    //校验冲销预览数据
    async writeVerification(arr) {
      // console.log(arr,this.receiveOrderType,222222);
      //初始化校验标识
      this.writeVerificationFlag = false;
      const listId =
        this.currentTabIndex === 0 ?
          arr.map((item) => item.asnLineId) :
          arr.map((item) => item.poLineLocationId);
      const params = {
        receiveOrderType: this.currentTabIndex === 0 ? "ASN" : "ORDER",
        lineIds: listId.length > 0 ? listId.join(",") : 0
      };
      // console.log(params,333333);
      await writeVerificationApi(params).then((res) => {
        if (res && res.failed) {
          this.writeVerificationFlag = false;
          if (res.failed) {
            this.$loading.hide();
            this.$notification.open({
              message: res.message,
              key,
              class: "notification",
              duration: 3
            });
            console.log(res, 3333333);
          } else {
            this.writeVerificationFlag = true;
          }
        } else {
          this.writeVerificationFlag = true;
        }
      });
    },
    //跳转冲销预览详情
    async toDetail(checkedListData) {
      //调用接口校验数据
      await this.writeVerification(checkedListData);
      if (this.writeVerificationFlag) {
        this.$router.push({
          name: "ReverseDetail",
          query: {
            list: checkedListData,
            receiveOrderType: this.currentTabIndex === 0 ? "ASN" : "ORDER"
          }
        });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.tab-box {
  display: flex;
  flex-direction: row;
  padding: 15px 20px;

  .tab-item {
    flex: 1;
    text-align: center;
    margin-right: 15px;
    color: #1B1E2B;
  }

  .tab-item-active {
    flex: 1;
    text-align: center;
    margin-right: 15px;
    color: #1B1E2B;
    font-weight: bold;
  }
}
.display-line-num{
    background: rgba(65, 70, 96, 0.1);
    border-radius: 2px;
    width: 77px;
    height: 22px;
    font-size: 10px;
    color: #414660;
    line-height: 22px;
    text-align: center;
    margin-bottom: 12px;
}
</style>
