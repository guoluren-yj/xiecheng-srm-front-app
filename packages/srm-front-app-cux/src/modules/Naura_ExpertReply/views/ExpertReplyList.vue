<template>
  <div style="height: 100vh">
    <nav-head
      :title="$T('scux.expertReply.view.message.ExpertReply').$D('专家回复')"/>
    <srm-list
      :data-set="currentTabIndex === 0 ? waitDs : allDs"
      :columns="getColumns"
      @itemClick="onItemClick"
    >
      <div slot="filter" class="tab-box">
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 0 }"
          @click="selectTabAtIndex(0)">{{
            $T('scux.expertReply.model.receipt.waitReply').$D('待回复')
          }}</span>
        <span
          class="tab-item"
          :class="{ 'tab-item-active': currentTabIndex === 1 }"
          @click="selectTabAtIndex(1)">{{
            $T('scux.expertReply.view.title.all').$D('全部')
          }}</span>
      </div>
    </srm-list>
    <!-- <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.expertReply.model.receipt.waitReply').$D('待回复')">
         <srm-list
          :data-set="waitDs"
          :columns="getListColumns()"
          :buttons="getLineBtns()"
        />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.expertReply.view.title.all').$D('全部')">
        <srm-list
          :data-set="waitDs"
          :columns="getListColumns()"
          :buttons="getLineBtns()"
        />
      </srm-scroll-tab-item>
    </srm-scroll-tab> -->
    <!-- <srm-tab @changeTab="onChangeTab">
      <srm-tab-pane key="waitReply" :label="$T('scux.expertReply.model.receipt.waitReply').$D('待回复')" >
        <srm-list
          :data-set="waitDs"
          :columns="getListColumns()"
          :buttons="getLineBtns()"
        />
      </srm-tab-pane>
      <srm-tab-pane key="all" :label="$T('scux.expertReply.view.title.all').$D('全部')"> >
        <srm-list
          :data-set="waitDs"
          :columns="getListColumns()"
          :buttons="getLineBtns()"
        />
      </srm-tab-pane>
    </srm-tab> -->
  </div>
</template>

<script>
import { DataSet, $T, } from "srm-mobile-ui";
import { boxBindApi } from "../api/index";
import SrmAppCore from "srm-front-app-core";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { isEmpty } from "@/utils/index";
import { tableWaitData, tableAllData } from "../datasource/index";
export default {
  modules: [ "scux.expertReply" ],
  name: "ExpertReplyList",
  data() {
    return {
      waitDs: new DataSet(tableWaitData()),
      allDs: new DataSet(tableAllData()),
      currentTabIndex: 0,
      operate: 'waitReply',
      getColumns: []
    };
  },
  beforeMount() {
    this.getColumns = this.getListWaitColumns();
  },
  created() {

  },
  mounted() {
    this.waitDs.events.afterQuery = (ds, dataList) => {
      this.operationRender(dataList);
    };
    this.allDs.events.afterQuery = (ds, dataList) => {
      this.operationRender(dataList);
    };
  },
  methods: {
    getListWaitColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "sourceFromNum",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader>
            <span>{val}</span>
          </SrmListHeader>
        },
        {
          fieldCode: "sourceFromTitle",
        },
        {
          fieldCode: "attributeDatetime12",
        },
        {
          fieldCode: "attributeVarchar17",
        },
        // {
        //   fieldCode: "purName",
        // },
        // {
        //   fieldCode: "purPhone",
        // },
        // {
        //   fieldCode: "purEmail",
        // },
        // {
        //   fieldCode: "creationDate",
        // },
        {
          fieldCode: "replyEndTime",
        },
        {
          fieldCode: "operateMeaning",
          fieldType: "EMPTY",
          render: (val, record) => {
            const butFlag = this.operate === 'waitReply' && record.operates.length === 1;
            const meaning = '回复'
            return (
            <ul>
              <li class="footer-li operate">
                <span style="padding: 0px" onClick={()=>{
                  this.toDetail(record)
                }}>
                  { meaning}
                </span>
              </li>
            </ul>
          )
          }
        }
      ];
    },
    getListAllColumns() {
      return [
         {
          formRow: 0,
          fieldCode: "sourceFromNum",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader>
            <span>{val}</span>
          </SrmListHeader>
        },
        {
          fieldCode: "sourceFromTitle",
        },
        {
          fieldCode: "attributeDatetime12",
        },
        {
          fieldCode: "attributeVarchar17",
        },
        // {
        //   fieldCode: "replyStatusMeaning",
        // },
        // {
        //   fieldCode: "replyContent",
        // },
        // {
        //   fieldCode: "realStatusMeaning",
        // },
        // {
        //   fieldCode: "replyTime",
        // },
        // {
        //   fieldCode: "replyTypeMeaning",
        // },
        // {
        //   fieldCode: "sourceMethodMeaning",
        // },
        // {
        //   fieldCode: "purName",
        // },
        // {
        //   fieldCode: "purPhone",
        // },
        // {
        //   fieldCode: "purEmail",
        // },
        // {
        //   fieldCode: "creationDate",
        // },
        // {
        //   fieldCode: "replyEndTime",
        // },
      ];
    },
    getLineBtns() {
      return [ {
        text: $T("scux.ExpertReply.button.reply").$D("回复"),
        type: "primary",
        fill: true,
        callback: (checkedList) => {
          console.log(checkedList);
        },
      }];
    },
    onItemClick(item) {
      if (this.currentTabIndex === 0) {
        return;
      }
      let path = "/ExpertReplyDetail";
      this.$store.commit("Naura_ExpertReply/setExpertRatingList", item.data);
      this.$store.commit("Naura_ExpertReply/setExpertRatingOperates", this.operate);
      this.$router.push({ path });
    },
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      if (index === 1) {
        this.operate = "all";
        this.allDs.refresh();
        this.getColumns = this.getListAllColumns();

      } else {
        this.operate = "waitReply";
        this.waitDs.refresh();
        this.getColumns = this.getListWaitColumns();
      }
      // this.dataSet.events.afterQuery = (ds, dataList) => {
      //   this.operationRender(dataList);
      // };
    },
    operationRender(list) {
      list.map((item) => {
        let operates = [
          {
            value: "reply",
            meaning: this.$T(
              "scux.expertReply.view.message.button.reply"
            ).$D("回复"),
          }
        ];
        item.operates = operates;
      });
    },
    toDetail(record) {
      let path;
      if (this.operate === "waitReply") {
        path = "/ExpertReplyDetail";
      } else {
        path = "/ExpertReplyDetail";
      }
      this.$store.commit("Naura_ExpertReply/setExpertRatingList", record);
      this.$store.commit("Naura_ExpertReply/setExpertRatingOperates", this.operate);
      this.$router.push({ 
        path, 
        query: {
          sourceFromId: record.sourceFromId, 
        } 
      });
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

.statusA {
  color: var(--color-other-default-c) !important;
}

.statusB {
  color: var(--color-other-default) !important;
}

.statusC {
  color: var(--color-font-default-e) !important;
}

ul {
  width: 100%;

  li {
    padding-top: 12px;
    font-size: 14px;
    color: var(--color-font-default);
    padding-right: 20px;
    line-height: 22px;
    font-family: 'PingFangSC-Regular';
    display: flex;

    span {
      text-align: left;
      flex: none;
    }
  }
}

.footer-li {
  border-top: 1px solid var(--color-border-default);
  font-family: PingFangSC-Medium;
  margin-left: 20px;
  color: var(--color-font-default);
  font-size: 3.733vw;
  font-weight: 700;
  line-height: 5.867vw;
  padding-top: 2.933vw;
}

.operate {
  margin-left: 0px;
  display: flex;
  justify-content: center;
  color: var(--color-other-default-b);
}

.foot-li {
  border-top: 1px solid var(--color-border-default);
  font-family: 'PingFangSC-Medium';
  color: var(--color-other-default-b);
  font-size: 14px;
  font-weight: bold;
  line-height: 22px;
  display: flex;
  align-items: center;

  span {
    flex: 1;
    text-align: center;
    padding: 2.933vw 0 3.2vw;
  }

  span:nth-child(even) {
    border-left: 1px solid var(--color-border-default);
  }
}
</style>