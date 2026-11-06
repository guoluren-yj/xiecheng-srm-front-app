<!-- ShanyingSupplierTable 山鹰 二开供应商列表查看 -->

<script>

import { $T, DataSet, SrmList, } from "srm-mobile-ui";

import { shanyingSupplierTableDS } from "./cuxDS";

export default {
  modules: [ "ssrc.common", "ssrc.inquiryHall", "hzero.common", "sscux.ssrc" ],
  name: "ShanyingSupplierTable",
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
    name: {
      type: String,
      default: "shanying",
    },
  },
  data() {
    return {
      data: {},
      tableList: [],
      cuxShanYingModal: null,
      tableDS: new DataSet(shanyingSupplierTableDS()),
    };
  },
  computed: {
  },
  watch: {
    record(val) {
      this.data = val;
    },
  },
  beforeUnmount() {
    this.closeModal();
  },
  methods: {
    clearAllDataCache() {
      this.tableList = [];
      this.tableDS.reset();
    },
    getCuxTableList() {
      const columns = [
        {
          fieldCode: "supplierCompanyNum",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              {val || "-"}
            </SrmListHeader>
        },
        {
          fieldCode: "supplierCompanyName",
          render: (_, item) => {
            const { supplierCompanyName } = item || {};
            const meaning = supplierCompanyName || "";
            return (
              <srm-tooltip title={meaning} placement="top">
                <span>{meaning}</span>
              </srm-tooltip>
            );
          },
        },
        {
          fieldCode: "supplierStatus",
          render: (_, item) => {
            const { supplierStatusMeaning } = item || {};
            const meaning = supplierStatusMeaning || "";
            return meaning;
          },
        },
      ].filter(Boolean);

      return columns;
    },
    closeModal() {
      this.clearAllDataCache();
    },
    renderModal() {
      return (
        <SrmList
          data-set={this.tableDS}
          columns={this.getCuxTableList()}
          scrollable={false}
        />
      );
    },
    updateTableList() {
      const { attributeLongtext50, } = this.data || {};
      let text50Value = [];
      // 字符串转
      if (attributeLongtext50 && typeof attributeLongtext50 === "string") {
        text50Value = JSON.parse(attributeLongtext50);
      }

      this.tableDS.setData(text50Value || []);
    },
    async viewTable(e) {
      if (e) {
        e.stopPropagation();
      }

      await this.updateTableList();

      this.cuxShanYingModal = this.$popup({
        title: $T("sscux.ssrc.view.shanying.supplierListCux").$D("供应商列表"),
        headerAlign: "center",
        height: "100%",
        showHeader: true,
        showClose: true,
        rounded: true,
        content: this.renderModal(),
        onClose: this.closeModal,
      });
    },
  },
  render() {
    return (
      <a class="ssrc-cux-view-group-button" onClick={this.viewTable}>
        { $T("hzero.common.button.view").$D("查看") }
      </a>
    );
  }
};
</script>

<style lang="stylus" scoped>

.ssrc-cux-view-group-button {
  color: var(--font-color-primary);
}

</style>

