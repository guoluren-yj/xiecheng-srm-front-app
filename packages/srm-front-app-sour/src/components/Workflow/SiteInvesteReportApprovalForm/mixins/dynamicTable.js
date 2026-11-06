import { queryRelTableConfig } from "@/components/DynamicTable/utils/service.js";
import DynamicTable from "@/components/DynamicTable";

export default {
  components: {
    DynamicTable,
  },
  data() {
    return {
      tableList: [], // 用于配置表
    };
  },
  beforeMount() {
    this.fetchRelTableConfig();
  },
  methods: {
    fetchRelTableConfig() {
      // 查询配置表
      queryRelTableConfig("sslm_site_eval_fill_in").then((tableConfigRes) => {
        this.tableList = tableConfigRes;
      });
    },
    renderModelTablePanel(params) {
      const { relationId } = params;
      const tabs = [];
      // 页面是否可编辑标识,设置为true时，只读，不受 供应商模型定义 页面可编辑控制，否则反之
      const readOnly = true;
      this.tableList.forEach((n) => {
        const modelTable = {
          ...n,
        };
        const { enabledFlag, editorFlag = 1 } = modelTable;
        const readOnlyFlag = !editorFlag || readOnly;
        const { tableName:labelName = "" } = modelTable;
        if (enabledFlag) {
          tabs.push(
            <srm-scroll-tab-item
              label={labelName}
              style="position: relative;"
              show-title={readOnlyFlag}
            >
              <DynamicTable
                ref="dynamicTable"
                modelTable={modelTable}
                relationId={relationId}
                readOnly={readOnly}
              />
            </srm-scroll-tab-item>
          );
        }
      });
      return tabs;
    }
  }
};