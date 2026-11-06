<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="listDataSet"
      :columns="getColumns()"
      :buttons="getListButtons()"/>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { indexDS } from "../dataSource/indexDS";
import { badProject } from "../dataSource/detailDs";
import { toConfirm, toCencal } from "../api";
import SummaryReceiptsDetail from "./SummaryReceiptsDetail.vue";
import AttachmentLetterDetail from "./AttachmentLetterDetail.vue";
import AttachmentDrawingDetail from "./AttachmentDrawingDetail.vue";

import ListColumns from "../mixins/ListColumns";

export default {
  modules: [ "scux.summaryReceipt", "hzero.common" ],
  name: "SummaryReceiptsList",
  mixins: [ ListColumns ],
  data() {
    return {
      listDataSet: new DataSet(indexDS(this)),
      badProjectDataSet: new DataSet(badProject()),
    };
  },
  computed: {
  },
  methods: {
    openModal(headerId, spotCheckCount, statusCode, item) {
      this.detailPopup = this.$popup({
        showHeader: true,
        position: "right",
        showBack: true,
        title: this.$T("scux.summaryReceipt.title.badProject").$D("不良项维护"),
        content: <SummaryReceiptsDetail headerId={headerId} spotCheckCount={spotCheckCount} statusCode={statusCode} item={item} />
      });
    },
    // 列表页按钮
    getListButtons() {
      return [
        {
          text: this.$T("scux.summaryReceipt.button.confirm").$D("确认"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.handleConfirm("confirm");
          }
        },
        {
          text: this.$T("scux.summaryReceipt.button.cancelConfirm").$D("取消确认"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.handleConfirm("cancel");
          }
        }
      ];
    },
    handleConfirm(type) {
      // 只校验勾选数据
      const validateFlag = this.listDataSet.validateRecord(this.listDataSet.selected);
      const data = this.listDataSet.selected.map((item) => item.data);
      if (validateFlag) {
        if (type === "confirm") {
          this.$loading.show();
          toConfirm(data)
            .then((res) => {
              if (res && !res.failed) {
                this.$notification.open({
                  message: $T(
                    "scux.summaryReceipt.message.please.enter.handLeOks"
                  ).$D("操作成功"),
                  class: "notification",
                });
                this.listDataSet.refresh();
              }
            }).catch(() => {
              // console.info(e);
            }).finally(() => {
              this.$loading.hide();
            });
        } else {
          this.$loading.show();
          toCencal(data)
            .then((res) => {
              if (res && !res.failed) {
                this.$notification.open({
                  message: $T(
                    "scux.summaryReceipt.message.please.enter.handLeOks"
                  ).$D("操作成功"),
                  class: "notification",
                });
                this.listDataSet.refresh();
              }
            }).catch(() => {
              // console.info(e);
            }).finally(() => {
              this.$loading.hide();
            });
        }
      } else {
        this.$notification.open({
          message: $T(
            "scux.summaryReceipt.message.please.enter.validator"
          ).$D("勾选项有必填字段未填写！请检查后再进行操作"),
          class: "notification",
        });
      }
    },
    attachmentLetterModal(itemCode) {
      this.detailPopup = this.$popup({
        showHeader: true,
        position: "right",
        showBack: true,
        title: this.$T("scux.summaryReceipt.title.letter").$D("物料承认书"),
        content:  <AttachmentLetterDetail itemCode={itemCode} />,
      });
    },
    attachmentDrawingModal(itemId) {
      this.detailPopup = this.$popup({
        showHeader: true,
        position: "right",
        showBack: true,
        title: this.$T("scux.summaryReceipt.title.drawing").$D("物料图纸"),
        content:  <AttachmentDrawingDetail itemId={itemId} />,
      });
    },
  }
};
</script>