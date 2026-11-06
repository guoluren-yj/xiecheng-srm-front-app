<template>
  <div style="height: 100vh">
    <NavHead
      :title="
        $T('spuc.common.model.common.purchaseApprove').$D('非商城采购申请')
      "/>
    <srm-list
      :data-set="dataSet"
      :columns="columns"
      @itemClick="goPurchasingDetail">
      <div slot="filter" class="tab-box">
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex == 0 }"
          @click="selectTabAtIndex(0)">{{ $T("small.common.all.address").$D("全部") }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex == 1 }"
          @click="selectTabAtIndex(1)">{{
            $T("sprm.purchasePlatform.title.beforeSubmit").$D("待提交")
          }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex == 2 }"
          @click="selectTabAtIndex(2)">{{ $T("smbl.common.view.wait.approve").$D("待审批") }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex == 3 }"
          @click="selectTabAtIndex(3)">{{ $T("smbl.common.view.wait.check").$D("待核销") }}</span>
        <span class="new" @click="createBill">
          <em class="srm-icon icon-plus" />{{
            $T("mallf.common.view.new").$D("新建")
          }}
        </span>
      </div>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { indexDS } from "../datasource/indexDS";
export default {
  modules: [
    "spuc.common",
    "spfm.invitationRegister",
    "hwfp.commom",
    "spfm.enterpriseRecovery",
    "sprm.common",
    "small.common",
    "sprm.purchasePlatform",
    "smbl.common",
    "mallf.common",
  ],
  name: "EasyPreparePurchasingApproveList",
  data() {
    return {
      columns: [],
      dataSet: {},
      currentTabIndex: 0,
    };
  },
  created() {
    this.dataSet = new DataSet(indexDS());
  },
  activated() {
    if (localStorage.getItem("status") === "new") {
      this.selectTabAtIndex(1);
      localStorage.removeItem("status");
      return;
    }
    this.selectTabAtIndex(0);
  },
  methods: {
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      this.columns = this.getColumns();
      if (index === 0) {
        this.dataSet.setQueryParameter({});
      } else if (index === 1) {
        this.dataSet.setQueryParameter({ status: "NEW" });
      } else if (index === 2) {
        this.dataSet.setQueryParameter({ status: "SUBMITTED" });
      } else {
        this.dataSet.setQueryParameter({ status: "WRITTEN_OFF" });
      }
      this.dataSet.refresh();
    },
    //新建单据
    createBill() {
      this.$router.push({
        name: "EasyPreparePurchasingApproveDetail",
        query: { reqHeaderId:0 },
      });
    },
    // 跳转维护详情页
    goPurchasingDetail(item) {
      const {
        data: { reqHeaderId },
      } = item;

      this.$router.push({
        name: "EasyPreparePurchasingApproveDetail",
        query: { reqHeaderId },
      });
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => {
            return (
              <SrmListHeader>
                <span>{item.reqNum}</span>
                <span
                  className={
                    item.status === "NEW" ?
                      "new" :
                      item.status === "SUBMITTED" ?
                        "send-back" :
                        "withdraw"
                  }
                  slot="right"
                >
                  {item.statusMeaning}
                </span>
              </SrmListHeader>
            );
          },
        },
        {
          fieldCode: "reqAmount",
          fieldName: "申请总额",
          langCode: "sprm.common.model.common.amount",
          formRow: 1,
          formCol: 1,
        },
        {
          fieldCode: "reqByName",
          fieldName: "申请人",
          langCode: "hwfp.commom.model.apply.owner",
          formRow: 1,
          formCol: 2,
        },
        {
          fieldCode: "departmentName",
          fieldName: "部门",
          langCode: "spfm.invitationRegister.model.invitation.department",
          formRow: 2,
          formCol: 1,
        },
        {
          fieldCode: "reqDate",
          fieldName: "申请日期",
          langCode:
            "spfm.enterpriseRecovery.model.enterpriseRecovery.applyDate",
          render:(val)=>{
            return `${val.split(" ")[0]}`;
          },
          formRow: 3,
          formCol: 1,
        },
      ];
    },
  },
};
</script>
<style lang="stylus" scoped>
.new {
  color: #276EF1;
}
.send-back {
  color: #E11900;
}

.withdraw {
  color: #AFAFAF;
}

.flex-row {
  padding-top: 8px;
  line-height: 20px;
}

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
</style>