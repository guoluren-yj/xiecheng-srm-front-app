<template>
  <srm-form :data-set="basicDataSet" :columns="getBasicColumns()" />
</template>

<script>
import { DataSet } from "srm-mobile-ui";

export default {
  name: "StandardForm",
  props: {
  },
  data() {
    return {
      basicDataSet: new DataSet({
        autoQuery: false,
        editable: true,
        enableQuery: false,
        forceValidate: true,
        fields: [
          {
            fieldCode: "code",
            fieldType: "INPUT",
            // eslint-disable-next-line rulesdir/check_modules
            fieldName: "编码",
            required: true,
          },
          {
            fieldCode: "name",
            fieldType: "INPUT",
            // eslint-disable-next-line rulesdir/check_modules
            fieldName: "名称",
            required: true,
          },
        ],
      }),
    };
  },
  computed: {
  },
  mounted() {
    this.basicDataSet.create({
      code: "",
      name: "",
    }, 0);
  },
  methods: {
    // 审批前校验
    beforeApprove() {
      return new Promise((resolve, reject) => {
        if (!this.basicDataSet.validate()) {
          // eslint-disable-next-line rulesdir/check_modules
          reject("必输校验不通过");
        } else {
          resolve(true);
        }
      });
    },
    getBasicColumns() {
      return [
        { fieldCode: "code" },
        { fieldCode: "name" },
      ];
    },
  }
};
</script>