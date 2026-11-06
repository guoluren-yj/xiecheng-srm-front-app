<template>
  <div style="height: 100vh">
    <srm-list
      :data-set="lineDataDs"
      :columns="getLineDataColumns"
      :buttons="getLineBtns"
      @itemClick="onItemClick"/>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { lineDs, formDs } from "../datasource/index";
import { fetchOperation } from "../api/index";

export default {
  modules: [ "scux.pciQialityInspection" ],
  name: "PCIQualityInspectionList",
  data() {
    return {
      lineDataDs: new DataSet(lineDs()),
      formDataDs: null,
      distributionFlag: false,
    };
  },
  computed: {
    getLineDataColumns() {
      return [
        {
          fieldCode: "asnNum",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) => <SrmListHeader>
            <span> {val}</span>
            <span slot="right" style="color:#276EF1;">{record.checkStatusMeaning}</span>
          </SrmListHeader>,
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "organizationName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
    getLineBtns() {
      return [ {
        text: $T("scux.pciQialityInspection.button.returnInspections").$D("退回质检"),
        type: "primary",
        fill: true,
        disabled: (checkedList) => {
          const checkedData = checkedList.map((item) => item.data);
          return checkedList.length === 0 || checkedData.some((item) => item.checkStatus !== "WAIT_ASSIGN");
        },
        callback: (checkedList) => {
          this.handleReturnInspection(checkedList, "returnInspections");
        },
      }, {
        text: $T("scux.pciQialityInspection.button.distribution").$D("分配"),
        type: "primary",
        fill: true,
        disabled: (checkedList) => {
          const checkedData = checkedList.map((item) => item.data);
          return checkedList.length === 0 || checkedData.some((item) => item.checkStatus !== "WAIT_ASSIGN");
        },
        callback: (checkedList) => {
          this.handleReturnInspection(checkedList, "distribution");
        },
      } ];
    },
  },
  methods: {
    getFormColumns(type = "") {
      return type === "returnInspections" ? [
        {
          fieldCode: "checkRemark",
        },
      ] : [
        {
          fieldCode: "employeeNum",
        },
      ];
    },
    handleReturnInspection(checkedList, type) {
      this.addDialogVisible = true;
      this.formDataDs = new DataSet(formDs(type));
      this.formDataDs.create({});
      this.$dialog({
        content: <SrmForm
          style="padding: 0 15px; height: 50%"
          columns={this.getFormColumns(type)}
          dataSet={this.formDataDs}/>,
        onOk: async () => {
          const validateFlag = this.formDataDs.validate();
          if (validateFlag) {
            const formData = this.formDataDs.current.data;
            const checkedData = checkedList.map((item) => item.data);
            const currentData = {
              checkName: type === "distribution" ? formData.employeeNumMeaning : null,
              employeeNum: type === "distribution" ? formData.employeeNum : null,
              checkRemark: type !== "distribution" ? formData.checkRemark : null,
            };
            const data = checkedData.map((item) => ({ ...item, ...currentData }));
            this.$loading.show();
            try {
              const res = await fetchOperation(data, type);
              if (res && !res.failed) {
                this.lineDataDs.refresh();
              }
            } finally {
              this.$loading.hide();
            }
          } else {
            this.$notification.open({
              message: $T("scux.pciQialityInspection.message.requestMessage").$D("请填写必填项"),
              class: "notification"
            });
          }
        },
      });
    },
    onItemClick() {
      const { asnCheckHeaderId } = this.lineDataDs.current.data;
      this.$router.push({
        name: "PCIQualityInspectionDetails",
        query: { asnCheckHeaderId },
      });
    },
  },
};
</script>