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
      // 页面是否可编辑标识
      const readOnly = false;
      this.tableList.forEach((n) => {
        const modelTable = {
          ...n,
        };
        tabs.push(
          <DynamicTable
            ref="dynamicTable"
            modelTable={modelTable}
            relationId={relationId}
            readOnly={readOnly}
          />
        );
      });
      return tabs;
    }
  }
};