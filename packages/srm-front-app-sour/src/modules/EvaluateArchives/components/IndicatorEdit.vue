<template>
  <div style="height: 100%">
    <srm-tab-bar :active-index.sync="activeIndex">
      <srm-tab-item :label="$T('sslm.supplierDocManage.view.tab.added').$D('已添加')">
        <srm-tree
          v-model="selectedData"
          class="tree-selected"
          height="calc(100% - 74px)"
          tab-key="indicatorName"
          primary-key="indicatorId"
          data-format="LIST"
          lazy
          :checkbox-enable="checkboxEnable"
          :render-fn="renderSelectedItem"
          :load-function="loadSelectedChildren"
          show-header
          multiple/>
      </srm-tab-item>
      <srm-tab-item :label="$T('sslm.supplierDocManage.view.tab.notAdded').$D('未添加')">
        <srm-tree
          v-model="unselectedData"
          height="calc(100% - 74px)"
          tab-key="indicatorName"
          primary-key="indicatorId"
          data-format="LIST"
          lazy
          :checkbox-enable="checkboxEnable"
          :render-fn="renderItem"
          :load-function="loadChildren"
          show-header
          multiple/>
      </srm-tab-item>
    </srm-tab-bar>
    <srm-bottom-handler :btn-arr="activeIndex === 1 ? getTreeButtons() : getListButtons()"/>
  </div>
</template>

<script>

// import { DataSet } from "srm-mobile-ui";
// import indicatorDS from "../datasource/indicatorDS";
import { getIndicatorTree, getIndicatorTreeSelected, createOrUpdateIndicator, removeIndicator } from "../api";

export default {
  modules: [ "sslm.common", "sslm.supplierDocManage", "smbl.common", "sslm.supplierReview" ],
  name: "IndicatorEdit",
  props: {
    evalHeaderId: {
      type: String | Number,
      default: null,
    }
  },
  data() {
    return {
      //dataSet: new DataSet(indicatorDS(this.evalHeaderId)),
      activeIndex: 0,
      selectedData: [],
      unselectedData: [],
    };
  },
  // mounted() {
  //   this.dataSet.refresh();
  // },
  methods: {
    checkboxEnable(item) {
      return Boolean(item.leafFlag);
    },
    getTreeButtons() {
      return [
        {
          title: this.$T("smbl.common.button.cancel").$D("取消"),
          type: "primary",
          visible: true,
          handler: () => this.$emit("cancel"),
        },
        {
          title: this.$T("smbl.common.button.add").$D("添加") + `(${this.unselectedData.length})`,
          type: "primary",
          visible: true,
          fill: true,
          handler: () => {
            this.$loading.show();
            createOrUpdateIndicator(this.evalHeaderId, this.unselectedData).then((res) => {
              if (!res) {
                this.$emit("submit");
              }
            }).finally(() => this.$loading.hide());
          },
        },
      ];
    },
    renderItem(item) {
      return <span>{item.indicatorCode}-{item.indicatorName}-{item.scoreTypeMeaning}</span>;
    },
    renderSelectedItem(item) {
      return <Customize
        style="padding: 15px 0"
        dataSource={item}
        columns={this.getListColumns()}
      />;
    },
    loadChildren(item) {
      return new Promise((resolve, reject) => {
        getIndicatorTree(this.evalHeaderId, item ? item.indicatorId : null).then((res) => {
          res.content && res.content.forEach((e) => e.hasChildren = !e.leafFlag);
          resolve(res.content);
        }).catch((e) => reject(e));
      });
    },
    loadSelectedChildren(item) {
      return new Promise((resolve, reject) => {
        getIndicatorTreeSelected(this.evalHeaderId, item ? item.indicatorId : null).then((res) => {
          res.content && res.content.forEach((e) => e.hasChildren = !e.leafFlag);
          resolve(res.content);
        }).catch((e) => reject(e));
      });
    },
    getListButtons() {
      return [
        {
          title: this.$T("smbl.common.button.delete").$D("删除"),
          type: "danger",
          visible: true,
          handler: () => {
            if (this.selectedData.length) {
              this.$loading.show();
              removeIndicator(this.evalHeaderId, this.selectedData)
                .then((res) => {
                  if (!res || !res.failed) {
                    this.$emit("cancel");
                  }
                })
                .finally(() => this.$loading.hide());
            } else {
              this.$notification.open({
                message: this.$T("sslm.supplierReview.view.message.minOneData").$D("请至少选择一条数据"),
              });
            }
          },
        },
        {
          title: this.$T("smbl.common.button.save").$D("保存"),
          type: "primary",
          visible: true,
          fill: true,
          handler: () => {
            if (this.selectedData.length) {
              // eslint-disable-next-line no-undefined
              if (this.selectedData.filter((e) => [ null, "", undefined ].includes(e.evalWeight)).length > 0) {
                this.$notification.open({
                  message: this.$T("sslm.common.view.message.maintainInfo").$D("请填写相关信息"),
                });
                return;
              }
              this.$loading.show();
              createOrUpdateIndicator(this.evalHeaderId, this.selectedData)
                .finally(() => this.$loading.hide());
            } else {
              this.$notification.open({
                message: this.$T("sslm.supplierReview.view.message.minOneData").$D("请至少选择一条数据"),
              });
            }
          },
        }
      ];
    },
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "indicatorCode",
          fieldType: "EMPTY",
          render: (val) => <srm-list-header showOpenTag={false}>{val}</srm-list-header>,
        },
        {
          formRow: 10, fieldCode: "indicatorName",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
        },
        {
          formRow: 20, fieldCode: "scoreTypeMeaning",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.supplierDocManage.model.docManage.scoreType").$D("评分方式"),
        },
        {
          formRow: 30, fieldCode: "evalWeight",
          fieldType: "INPUT_NUMBER",
          fieldName: this.$T("sslm.supplierDocManage.model.docManage.scoreWeight").$D("权重"),
          editor: (val, item) => Boolean(item.leafFlag),
          required: (val, item) => Boolean(item.leafFlag),
        },
        {
          formRow: 40, fieldCode: "evalStandard",
          fieldType: "INPUT",
          fieldName: this.$T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
          editor: (val, item) => Boolean(item.leafFlag),
        },
      ];
    }
  }
};
</script>

<style lang="stylus" scoped>
.tree-selected {
  >>> .srm-tree-item {
    height auto;
  }
}

>>> .srm-tree-list-right {
  &-enter-active, &-leave-active {
    transition: none;
  }
}

>>> .srm-tree-list-left {
  &-enter-active, &-leave-active {
    transition: none;
  }
}
</style>
