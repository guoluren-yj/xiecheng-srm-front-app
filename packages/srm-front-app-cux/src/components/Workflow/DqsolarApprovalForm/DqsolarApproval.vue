<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.dqsolarApproval.view.title.baseInfo').$D('单据头信息')">
        <srm-form :data-set="headerDataDs" :columns="getHeaderColumns" />
      </srm-scroll-tab-item>
      <!-- <srm-scroll-tab-item
        :label="
          $T('scux.dqsolarApproval.view.title.attachmentInfo').$D('附件信息')
        "
      >
        <srm-form :data-set="headerDataDs" :columns="getAttachmentColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.dqsolarApproval.view.title.linInfo').$D('单据行信息')"
      >
        <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" />
      </srm-scroll-tab-item> -->
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { isEmpty } from "lodash";
import { headerData } from "./datasource/index";
import { getSave } from "./api/index";
export default {
  modules: ["scux.dqsolarApproval"],
  name: "DqsolarApproval",
  components: {},
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      headerDataDs: new DataSet(
        headerData(this.changeReqId, this.parameters.statusConfigId)
      ),
      // lineInfoDataSet: new DataSet(lineInfoDs(this.changeReqId)),
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "pcnNum",
        },
        {
          fieldCode: "attributeVarchar1",
        },
        {
          fieldCode: "attributeVarchar8",
        },
        {
          fieldCode: "attributeVarchar40Meaning",
          render: (val) => {
            if (val) {
              if (typeof val === "string") {
                return val;
              } else {
                // 遍历对象的值并用分号拼接
                const result = Object.values(val).join(";");
                return result;
              }

            }
            return "-";
          }
        },
        {
          fieldCode: "creationDate",
        },
        {
          fieldCode: "supplierPrincipal",
        },
        {
          fieldCode: "attributeVarchar2",
        },
        {
          fieldCode: "attributeVarchar3",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "attributeVarchar4",
        },
        {
          fieldCode: "supplierCompanyName",
        },
        {
          fieldCode: "attributeVarchar5",
        },
        {
          fieldCode: "typeName",
        },
        {
          fieldCode: "remark",
        },
        {
          fieldCode: "attributeVarchar6",
        },
        {
          fieldCode: "attributeVarchar7",
        },
        {
          fieldCode: "attributeVarchar37Meaning",
        },
        {
          fieldCode: "attributeVarchar10Meaning",
          render: (val) => {
            if (val) {
              if (typeof val === "string") {
                return val;
              } else {
                // 遍历对象的值并用分号拼接
                const result = Object.values(val).join(";");
                return result;
              }

            }
            return "-";
          }
        },
        {
          fieldCode: "attributeVarchar39Meaning",
          render: (val) => {
            if (val) {
              if (typeof val === "string") {
                return val;
              } else {
                // 遍历对象的值并用分号拼接
                const result = Object.values(val).join(";");
                return result;
              }

            }
            return "-";
          }
        },
        {
          fieldCode: "attributeVarchar9",
        },
        {
          fieldCode: "attributeVarchar38",
        },
        {
          fieldCode: "supplierAttachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-count={false}
                  show-icon={false}
                  title={this.$T(
                    "scux.dqsolarApproval.model.supplierAttachmentUuid"
                  ).$D("供应商附件")}
                  desc-title={this.$T(
                    "scux.dqsolarApproval.view.button.viewUpload"
                  ).$D("查看附件")}
                />
              </div>
            );
          },
        },
        {
          fieldCode: "attachmentUuid",
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-count={false}
                  show-icon={false}
                  title={this.$T(
                    "scux.dqsolarApproval.model.attachmentUuid"
                  ).$D("采购方附件")}
                  desc-title={this.$T(
                    "scux.dqsolarApproval.view.button.viewUpload"
                  ).$D("查看附件")}
                />
              </div>
            );
          },
        },
        {
          fieldCode: "attributeVarchar36",
          render: (val) => {
            if (val) {
              if (typeof val === "string") {
                return val;
              } else {
                // 遍历对象的值并用分号拼接
                const result = Object.values(val).join(";");
                return result;
              }

            }
            return "-";
          }
        },
        {
          fieldCode: "attributeLongtext1",
          render: (val) => {
            if (val) {
              if (typeof val === "string") {
                return val;
              } else {
                // 遍历对象的值并用分号拼接
                const result = Object.values(val).join(";");
                return result;
              }

            }
            return "-";
          }
        },
        {
          fieldCode: "attributeVarchar11",
          render: (val) => {
            if (val) {
              if (typeof val === "string") {
                return val;
              } else {
                // 遍历对象的值并用分号拼接
                const result = Object.values(val).join(";");
                return result;
              }

            }
            return "-";
          }
        },
      ];
    },
    // getAttachmentColumns() {
    //   return [
    //     {
    //       fieldCode: "attachmentUuidTemplate",
    //       render: (val) => {
    //         return (
    //           <div>
    //             <SrmUpload
    //               attachmentUuid={val}
    //               show-count={false}
    //               show-icon={false}
    //               title={this.$T(
    //                 "scux.dqsolarApproval.model.attachmentUuidTemplate"
    //               ).$D("附件模板")}
    //               desc-title={this.$T(
    //                 "scux.dqsolarApproval.view.button.viewUpload"
    //               ).$D("查看附件")}
    //             />
    //           </div>
    //         );
    //       },
    //     },
    //     {
    //       fieldCode: "attributeVarchar10",
    //       render: (val) => {
    //         return (
    //           <div>
    //             <SrmUpload
    //               attachmentUuid={val}
    //               show-count={false}
    //               show-icon={false}
    //               title={this.$T(
    //                 "scux.dqsolarApproval.model.attributeVarchar10"
    //               ).$D("需求部门")}
    //               desc-title={this.$T(
    //                 "scux.dqsolarApproval.view.button.viewUpload"
    //               ).$D("查看附件")}
    //             />
    //           </div>
    //         );
    //       },
    //     },
    //     {
    //       fieldCode: "attachmentUuid",
    //       render: (val) => {
    //         return (
    //           <div>
    //             <SrmUpload
    //               attachmentUuid={val}
    //               show-count={false}
    //               show-icon={false}
    //               title={this.$T(
    //                 "scux.dqsolarApproval.model.attachmentUuid"
    //               ).$D("采购方附件")}
    //               desc-title={this.$T(
    //                 "scux.dqsolarApproval.view.button.viewUpload"
    //               ).$D("查看附件")}
    //             />
    //           </div>
    //         );
    //       },
    //     },
    //   ];
    // },
    // lineColumns() {
    //   return [
    //     {
    //       fieldCode: "lineNum",
    //     },
    //     {
    //       fieldCode: "itemCode",
    //     },
    //     {
    //       fieldCode: "itemName",
    //     },
    //     {
    //       fieldCode: "industryCategoryName",
    //     },
    //     {
    //       fieldCode: "uomName",
    //     },
    //     {
    //       fieldCode: "supplierInventoryQuantity",
    //     },
    //     {
    //       fieldCode: "supplierProcessingMethod",
    //     },
    //     {
    //       fieldCode: "supplierRemark",
    //     },
    //     {
    //       fieldCode: "buyerInventoryQuantity",
    //     },
    //     {
    //       fieldCode: "buyerProcessingMethod",
    //     },
    //     {
    //       fieldCode: "buyerRemark",
    //     },
    //     {
    //       fieldCode: "attachmentUuid",
    //       render: (val) => {
    //         return (
    //           <div>
    //             <SrmUpload
    //               attachmentUuid={val}
    //               show-count={false}
    //               show-icon={false}
    //               title={this.$T(
    //                 "scux.dqsolarApproval.model.attachmentUuid"
    //               ).$D("行附件")}
    //               desc-title={this.$T(
    //                 "scux.dqsolarApproval.view.button.viewUpload"
    //               ).$D("查看附件")}
    //             />
    //           </div>
    //         );
    //       },
    //     },
    //   ];
    // },
  },
  mounted() {
    this.headerDataDs.setQueryParameter({ customizeUnitCode: "SIEC.PCN_MANAGEWORK_BENCH_DETAI.HEADER" });
    this.headerDataDs.refresh();
    // this.lineInfoDataSet.setQueryParameter({ customizeUnitCode: "SIEC.PCN_MANAGEWORK_BENCH_DETAI.LINE" });
    // this.lineInfoDataSet.refresh();
  },
  methods: {
    async beforeApprove(result) {
      if (result === "Approved") {
        console.log("this.headerDataDs.validate()", this.headerDataDs.validate());
        if (!this.headerDataDs.validate()) {
          return Promise.reject("请填写必填项");
        }
        console.log("this.headerDataDs?.toData()", this.headerDataDs?.toData());
        const params = this.headerDataDs?.toData()?.[0] || {};
        const res = await getSave(params);
        if (res) {
          if (!isEmpty(res)) {
            return Promise.resolve(true);
          }
          return Promise.reject("接口报错，请联系负责人检查接口!");
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .srm-list-item-card-head-left {
  max-width: 100% !important;
}
.font-blue {
  color: var(--color-other-default-b);
}
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>
