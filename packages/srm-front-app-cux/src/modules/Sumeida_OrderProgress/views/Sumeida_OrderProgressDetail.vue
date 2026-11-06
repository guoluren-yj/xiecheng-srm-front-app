<template>
  <div style="height: 100vh; overflow-y: scroll;">
    <nav-head title="维护/查看订单执行进度"/>

    <srm-form style="padding: 15px; min-height: 20vh; margin: 0" :data-set="dataSet" :columns="getHeaderColumns()" show-submit :on-submit="onSubmit"/>
    <SrmList :data-set="dataSet"
             style="margin-bottom: 48px; height: auto"
             :scrollable="false"
             :columns="getDetailLineColumns()"
             @itemClick="onItemClick"/>
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import orderProgressDataSet from "../datasource/OrderProgressDataSet";
import { DataSet } from "srm-mobile-ui";
import uuid from "uuid";

export default {
  modules: [ "smbl.common","sodr.common" ],
  name: "SumeidaOrderProgressDetail",
  components: { NavHead },
  data() {
    return {
      dataSet: new DataSet({ ...orderProgressDataSet(), ...{ enableQuery: false, showTotalCount: false } }),
      poHeaderId: null,
      isSupplier: window.localStorage.getItem("organizationId") !== window.localStorage.getItem("supplierTenantId"),
    };
  },
  beforeMount() {
    this.poHeaderId = this.$route.query.poHeaderId;
    this.dataSet.pageSize = 100;
    this.dataSet.addQueryParameter("poHeaderIds", this.poHeaderId);
    this.dataSet.addQueryParameter("headOrLine", 0);
  },
  methods: {
    onSubmit() {
      this.dataSet.submitRecords(this.dataSet.records).then(()=>{
        this.$notification.open({
          message: this.$T("smbl.common.message.saveSuccess").$D("保存成功"),
          class: "notification",
          duration: 3
        });
      }).finally(()=>{
        this.dataSet.refresh();
      });
    },
    onItemClick() {
      console.log("onItemClick");
    },
    getHeaderColumns() {
      return [ {
        fieldCode: "displayPoNum",
      }, {
        fieldCode: "attributeVarchar2",
      }, {
        fieldCode: "orderTypeName",
      }, {
        fieldCode: "companyName",
      }, {
        fieldCode: "supplierName",
      }, {
        fieldCode: "needByDate",
      }, ];
    },
    getDetailLineColumns() {
      return [ {
        fieldCode: "stageName",
      }, {
        fieldCode: "planDate",
        render: (val, item) => {
          return <SrmCalendarField readonly={item.roleCode === "SUPPLIER" && !this.isSupplier || item.roleCode !== "SUPPLIER" && this.isSupplier} v-model={item.planDate} size="small"
            options={{ format: "yyyy-MM-dd HH:mm:ss" }}/>;
        }
      }, {
        fieldCode: "actualDate",
        render: (val, item) => {
          return <SrmCalendarField readonly={item.roleCode === "SUPPLIER" && !this.isSupplier || item.roleCode !== "SUPPLIER" && this.isSupplier} v-model={item.actualDate} size="small"
            options={{ format: "yyyy-MM-dd HH:mm:ss" }}/>;
        }
      }, {
        fieldCode: "nodeStatusCode",
        render: (val, item, field) => {
          return <SrmLovField
            readonly={item.roleCode === "SUPPLIER" && !this.isSupplier || item.roleCode !== "SUPPLIER" && this.isSupplier}
            code={field.lovCode}
            name="nodeStatusCode"
            //{...{on: {'update:display': val => item.nodeStatusName = val || item.nodeStatusName}}}
            display={item.nodeStatusName}
            selectType="select"
            v-model={item.nodeStatusCode}
            placeholder="节点状态"
            size="small"/>;
        }
      }, {
        fieldCode: "excutePercentage",
        render: (val, item, field) => {
          return <SrmInputField readonly={item.roleCode === "SUPPLIER" && !this.isSupplier || item.roleCode !== "SUPPLIER" && this.isSupplier} v-model={item.excutePercentage} size="small"
            type="number" validator={field.validator}/>;
        }
      }, {
        fieldCode: "roleName",
      }, {
        fieldCode: "responsiblePartyId",
        render: (val, item, field) => {
          return <SrmLovField
            code={field.lovCode}
            readonly={item.roleCode === "SUPPLIER" && !this.isSupplier || item.roleCode !== "SUPPLIER" && this.isSupplier}
            name="responsiblePartyId"
            display={item.responsibleUser}
            v-model={item.responsiblePartyId}
            placeholder="负责人"
            size="small"/>;
        }
      }, {
        fieldCode: "updater",
      }, {
        fieldCode: "lastUpdateDate",
      }, {
        fieldCode: "attachmentId",
        render: (val, item) => {
          const canUpload = item.roleCode === "SUPPLIER" && this.isSupplier || item.roleCode !== "SUPPLIER" && !this.isSupplier;

          if (canUpload && !item.attachmentId) {
            item.attachmentId = uuid();
          }
          return <SrmUpload canUpload={canUpload} descTitle="附件查看" color="blue" attachmentUuid={item.attachmentId}/>;
        }

      }, {
        fieldCode: "remark",
        render: (val, item) => {
          return <SrmTextareaField
            readonly={item.roleCode === "SUPPLIER" && !this.isSupplier || item.roleCode !== "SUPPLIER" && this.isSupplier}
            name="remark"
            v-model={item.remark}
            theme="fill"
            size="small"/>;
        }
      }, ];
    },
  }
};
</script>

<style scoped lang="stylus">
</style>
