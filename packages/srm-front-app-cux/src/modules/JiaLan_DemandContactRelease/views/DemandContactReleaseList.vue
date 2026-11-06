<script>
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import { DataSet } from "srm-mobile-ui";
import NavHead from "@/components/NavHead";
import indexDs from "../datasource/indexDs";
import { postReleaseAllApi, postReturnAllApi } from "../api";
export default {
  modules: [ "hipspfm.order","scux.demandContactFrom" ],
  name: "DemandContactReleaseList",
  components: { NavHead },
  data() {
    return {
      title: "需求联络单发布",
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
    released() {
      postReleaseAllApi(this.checkedList).then((res)=>{
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 2000
            });
          } else {
            this.dataSet.refresh();
          }
        }
      });
    },
    returnd() {
      postReturnAllApi(this.checkedList).then((res)=>{
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              duration: 2000
            });
          } else {
            this.dataSet.refresh();
          }
        }
      });
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.getLanguageDefine("退回"),
          fill: false,
          type: "danger",
          visible: true,
          disabled: (checkedList) => {
            return checkedList.length === 0;
          },
          callback: (checkedList) => {
            this.checkedList = [];
            checkedList.map((res)=>{
              this.checkedList.push(res.data);
            });
            this.returnd();
          },
        },
        {
          text: this.getLanguageDefine("发布"),
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
            this.released();
          },
        }
      ];
    },
    onItemClick(record) {
      this.$router.push({
        name: "DemandContactReleaseDetail",
        query: {
          id: record.data.reqLiaisonHeaderId
        }
      });
    }
  },
  render() {
    return (
      <div style="height: 100vh">
        <NavHead title={this.getLanguageDefine(this.title)}
          onGoBack={()=>{
            this.goBack();
          }}
          onGoClose={()=>{
            this.goClose();
          }}/>
        <SrmList
          data-set={this.dataSet}
          onItemClick={this.onItemClick}
          columns={this.getColumns()}
          buttons={this.getButtons()}>
        </SrmList>
      </div>
    );
  }
};
</script>
