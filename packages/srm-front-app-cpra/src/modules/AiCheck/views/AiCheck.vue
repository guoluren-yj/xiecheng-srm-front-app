<template>
  <div style="height: 100vh">
    <ai-check-comp :bind-obj-list="data" />
  </div>
</template>

<script>
import AiCheckComp from "@/components/AiCheckComp/AiCheckComp.vue";

export default {
  modules: [ "smbl.checkRules", "hzero.common" ],
  name: "AiCheck",
  components: { AiCheckComp },
  data() {
    return {
      data: [
        // {
        //   documentCode: "INVESTG",
        //   categoryCode: "INVESTG_BASIC",
        //   token: null,
        //   data: null,
        //   bindValues: [
        //     {
        //       bindObjFieldValue: "91855408513207027",
        //       bindObjDisplayName: "基本信息",
        //       batchId: "0664a3cf40434a28bef2f8b55845d9a8",
        //     },
        //   ],
        //   customParamDesc: null,
        //   attachments: null,
        // },
        // {
        //   documentCode: "INVESTG",
        //   categoryCode: "INVESTG_ATTACHMENT",
        //   token: null,
        //   data: null,
        //   bindValues: [
        //     {
        //       bindObjFieldValue: "91855408513207027",
        //       bindObjDisplayName: "附件信息",
        //       batchId: "a140287123f84c51a3661088362b4fea",
        //     },
        //   ],
        //   customParamDesc: null,
        //   attachments: null,
        // },
        // {
        //   documentCode: "INVESTG",
        //   categoryCode: "INVESTG_BUSINESS",
        //   token: null,
        //   data: null,
        //   bindValues: [
        //     {
        //       bindObjFieldValue: "91855408513207027",
        //       bindObjDisplayName: "业务信息",
        //       batchId: "821ed44430a649a8be9c24be8ece62c5",
        //     },
        //   ],
        //   customParamDesc: null,
        //   attachments: null,
        // },
        // {
        //   documentCode: "INVESTG",
        //   categoryCode: "INVESTG_RD",
        //   token: null,
        //   data: null,
        //   bindValues: [
        //     {
        //       bindObjFieldValue: "91855408513207027",
        //       bindObjDisplayName: "研发能力",
        //       batchId: "74eef3543c9348c19896c6680b8a37f0",
        //     },
        //   ],
        //   customParamDesc: null,
        //   attachments: null,
        // },
        // {
        //   documentCode: "INVESTG",
        //   categoryCode: "INVESTG_FINANCE",
        //   token: null,
        //   data: null,
        //   bindValues: [
        //     {
        //       bindObjFieldValue: "91855408513207027",
        //       bindObjDisplayName: "财务状况",
        //       batchId: "c32493b82f184d19b78d4fc257ea19a1",
        //     },
        //   ],
        //   customParamDesc: null,
        //   attachments: null,
        // },
      ],
    };
  },
};
</script>

<style lang="stylus" scoped></style>
