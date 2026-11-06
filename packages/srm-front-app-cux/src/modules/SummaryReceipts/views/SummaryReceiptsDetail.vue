<template>
  <div style="height: 100vh">
    <customize
      :columns="getBadProjectForm()"
      :need-padding="true"
      type="list"
      :data-source="item"/>
    <srm-list
      class="detail-list"
      :data-set="badProjectDataSet"
      :columns="getBadProjectColumns()"
      :buttons="getButtons()"/>
    <srm-bottom-handler :btn-arr="getListButtons()"/>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { badProject } from "../dataSource/detailDs";

import ListColumns from "../mixins/ListColumns";
import { toSave, toDelete } from "../api/index";

export default {
  modules: [ "scux.summaryReceipt", "hzero.common" ],
  name: "SummaryReceiptsDetail",
  components: {
  },
  mixins: [ ListColumns ],
  props: {
    headerId: {
      type: String,
    },
    spotCheckCount: {
      type: String,
    },
    statusCode: {
      type: String,
    },
    item: {
      type: Object,
    }
  },
  data() {
    return {
      headerInfo: this.item,
      badProjectDataSet: new DataSet(badProject(this.headerId, this.spotCheckCount, this.statusCode)),
    };
  },
  mounted() {
    if (this.headerId) {
      this.badProjectDataSet.addQueryParameter("headerId", this.headerId);
      this.badProjectDataSet.addQueryParameter("spotCheckCount", this.spotCheckCount);
      this.badProjectDataSet.refresh();
    }
  },
  methods: {
    getListButtons() {
      if (this.statusCode !== "CHECKED") {
        return [
          {
            text: this.$T("hzero.common.button.create").$D("新增"),
            type: "primary",
            fill: true,
            visible: true,
            handler: () => {
              this.handleCreate();
            },
          },
          {
            text: this.$T("hzero.common.button.save").$D("保存"),
            type: "primary",
            fill: true,
            visible: true,
            handler: () => {
              this.handleSave();
            }
          },
        ];
      }
      return "";
    },
    getButtons() {
      return [
        {
          text: this.$T("scux.summaryReceipt.button.delete").$D("删除"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.handleDelete();
          }
        },
      ];
    },
    handleCreate() {
      this.badProjectDataSet.create({ }, 0);
      // console.log(this.item);
    },
    handleSave() {
      const validate = this.badProjectDataSet.validate();
      if (validate) {
        const list = this.badProjectDataSet.toData();
        const data = list.map((item) => ({ ...item, headerId: this.headerId, spotCheckCount: this.spotCheckCount }));
        this.$loading.show();
        toSave(data)
          .then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: $T(
                  "scux.summaryReceipt.message.please.enter.handLeOks"
                ).$D("操作成功"),
                class: "notification",
              });
              this.badProjectDataSet.refresh();
            }
          }).catch((e) => {
            console.info(e);
          }).finally(() => {
            this.$loading.hide();
          });
      }
    },
    handleDelete() {
      const selected = this.badProjectDataSet.selected.map((item) => item.data);
      const localDta = this.badProjectDataSet.selected.filter((item) => !item.data.id);
      const remote = selected.filter((item) => item.id) || [];
      if (remote.length < 1) {
        this.badProjectDataSet.removeLocalRecords(localDta);
      } else {
        this.$loading.show();
        toDelete(remote)
          .then((res) => {
            if (res && !res.failed) {
              this.$notification.open({
                message: $T(
                  "scux.summaryReceipt.message.please.enter.handLeOks"
                ).$D("操作成功"),
                class: "notification",
              });
              this.badProjectDataSet.refresh();
            }
          }).catch((e) => {
            console.info(e);
          }).finally(() => {
            this.$loading.hide();
          });
      }
    }
  }
};
</script>