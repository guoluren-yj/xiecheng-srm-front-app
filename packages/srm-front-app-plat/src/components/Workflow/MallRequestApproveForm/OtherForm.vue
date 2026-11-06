<template>
  <div>
    <!-- <srm-form :data-set="ds" :columns="getColumns()" /> -->
    <customize-detail
      :need-padding="true"
      :data-source="infoData()"
      :columns="getColumns()"/>
  </div>
</template>
<script>
import { $T, SrmUpload } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common" ],
  name: "OtherForm",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    infoData() {
      const obj = {};
      this.list?.forEach((field) => {
        obj[`${field.lineNum ? "line" : "head"}${field.dimensionCode}`] =
          field.valueName || field.value;
      });
      return obj;
    },
    getColumns() {
      const col = this.list?.map((field) => ({
        fieldCode: `${field.lineNum ? "line" : "head"}${field.dimensionCode}`,
        fieldName: field.dimensionName,
        // fieldType: field.componentType === 'UPLOAD' ? 'attachment' : 'TEXT',
        render: (val) => {
          if (field.componentType === "UPLOAD") {
            return (
              <SrmUpload
                showIcon={false}
                color="blue"
                descTitle={$T("hipspfm.common.button.viewAttachments").$D(
                  "查看附件"
                )}
                attachmentUuid={val}
              />
            );
          }
          return <div>{val}</div>;
        },
      }));
      return col || [];
    },
  },
};
</script>