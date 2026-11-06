import { SrmFlex } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //导入字段
    getImportColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            let type = "";
            if (item.importStatus === "SUCCESS") {
              type = "success";
            } else if (item.importStatus === "FAIL") {
              type = "danger";
            } else {
              type = "info";
            }
            return <SrmListHeader showOpenTag={false}>
              {item.importTypeMeaning}
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={type}>
                {item.importStatusMeaning}
              </SrmButton>
            </SrmListHeader>;
          }
        },
        {
          formRow: 30,
          seq: 10,
          fieldCode: "importMessage",
        },
        {
          formRow: 40,
          seq: 10,
          fieldCode: "lastUpdateDate",
        },
        {
          formRow: 40,
          seq: 20,
          fieldCode: "lastUpdatedName",
        },
        {
          formRow: 50,
          fieldCode: "button",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex justify="end" >
            <SrmButton fill={true} size="small" type="primary" onClick={() => this.repostFail(item)} disabled={item.importStatus !== "FAIL"}>
              {this.$T("sinv.common.model.common.alinge").$D("重新执行")}
            </SrmButton>
          </SrmFlex>,
        },
      ];
    }
  }
};
