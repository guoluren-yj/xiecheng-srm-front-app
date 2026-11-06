<script>
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { DataSet } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";
import indexDs from "../datasource/indexDs";
import { postDistributionApi } from "../api";
export default {
  modules: [ "hipspfm.order","scux.demandContactFrom" ],
  name: "DemandContactDistributeList",
  components: { NavHead },
  data() {
    return {
      currentTabIndex: 1,
      dataSet: new DataSet(indexDs()),
      checkedList: [],
    };
  },
  beforeMount() {
    this.dataSet.refresh();
  },
  methods: {
    // 返回
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 获取自定义语言
    getLanguageDefine(key) {
      const languageList = {
      };
      return languageList[key] || key;
    },
    getPurchaseAgent([ val ], valueField) {
      if (valueField === "purchaseAgentId" && val && val.purchaseAgentId) {
        this.checkedList.map((res)=>{
          res["purchaseAgentName"] = val.purchaseAgentName;
          res["purchaseAgentId"] = val.purchaseAgentId;
        });
        postDistributionApi(this.checkedList).then((res)=>{
          if (res) {
            if (res.failed) {
              this.$notification.open({
                message: res.message,
                duration: 2000,
              });
            } else {
              this.dataSet.refresh();
            }
          }
        });
      }
    },
    distribute() {
      this.$lov("SPFM.USER_AUTH.PUR_ORG_AGENT", this.getPurchaseAgent, {
        multiple: false,
        subDisplayField: "purchaseAgentCode",
        queryField: "purchaseAgentName",
        valueField: "purchaseAgentId"
      });
    },
    // 字段
    getColumns() {
      return [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, record) => {
            return (
              <SrmListHeader>
                <span>{record.liaisonNum}</span>
                <span slot="right"
                  style={record.status === "RELEASE_RETURN" ? { color: "#E11900" } :
                    [ "APPROVED", "ASSIGNED" ].includes(record.status) ? { color: "#05944F" } : { color: "blue" }}>
                  {record.statusMeaning}
                </span>
              </SrmListHeader>
            );
          }
        },
        {
          fieldName: "标题",
          fieldCode: "title",
          langCode: "",
        },
        {
          fieldName: "需求类型",
          fieldCode: "liaisonTypeMeaning",
          labelCode: "",
        },
        {
          fieldName: "品牌",
          fieldCode: "brandMeaning",
          labelCode: "",
        },
        {
          fieldName: "公司",
          fieldCode: "companyName",
          labelCode: "",
        },
        {
          fieldName: "供应商",
          fieldCode: "supplierCompanyName",
          labelCode: "",
        },
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.getLanguageDefine("分配"),
          fill: true,
          visible: true,
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
          callback: (checkedList) => {
            this.checkedList = [];
            checkedList.map((res)=>{
              this.checkedList.push(res.data);
            });
            this.distribute();
          },
        }
      ];
    },
    selectTabAtIndex(index) {
      this.currentTabIndex = index;
      this.dataSet.queryParameter["distributionStatus"] = index;
      this.dataSet.refresh();
    },
    onItemClick(record) {
      this.$router.push({
        name: "DemandContactDistributeDetail",
        query: {
          id: record.data.reqLiaisonHeaderId
        }
      });
    }
  },
  render() {
    return (
      <div style="height: 100vh">
        <NavHead title={this.getLanguageDefine("需求联络单分配")}
          goBack={()=>{
            this.goBack();
          }}
          goClose={()=>{
            this.goClose();
          }}/>
        <SrmList
          data-set={this.dataSet}
          onItemClick={this.onItemClick}
          columns={this.getColumns()}
          buttons={this.getButtons()}>
          <div slot="filter" class="tab-box">
            <span class={this.currentTabIndex === 1 ? "tab-item-active" : ""}
              onClick={()=>{
                this.selectTabAtIndex(1);
              }}>
              { this.getLanguageDefine("待分配") }
            </span>
            <span class={this.currentTabIndex === 2 ? "tab-item-active" : ""}
              onClick={()=>{
                this.selectTabAtIndex(2);
              }}>
              { this.getLanguageDefine("已分配") }
            </span>
            <span class={this.currentTabIndex === 3 ? "tab-item-active" : ""}
              onClick={()=>{
                this.selectTabAtIndex(3);
              }}>
              { this.getLanguageDefine("全部") }
            </span>
          </div>
        </SrmList>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.tab-box {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px 12px 4px 12px;
    color: #AFAFAF;

    .tab-item-active {
        color: #333333;
        font-weight bold;
    }
}
</style>
