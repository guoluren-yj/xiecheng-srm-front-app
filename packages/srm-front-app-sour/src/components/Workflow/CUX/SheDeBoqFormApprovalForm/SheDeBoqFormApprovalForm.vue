<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item :label="$T('scux.boqform.message.panel.title').$D('工程量清单编制')">
      <srm-form
        show-default-detail
        :data-set="headerInfoDs"
        :columns="getBasicColumns()"/>
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>
<script>
import { DataSet } from "srm-mobile-ui";
import { update , shedeCheckApplication} from "../SheDeBoqFormApprovalForm/api/index";
import baseInfoDS from "../SheDeBoqFormApprovalForm/dataSource/baseInfoDs";
export default {
  modules: [ "scux.boqform", "ssrc.bidHall", "sprm.shede", "hipspfm.common" ],
  name: "SheDeBoqFormApprovalForm",
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      headerInfoDs: new DataSet(baseInfoDS()),
      approveNodeFlag: false,
    };
  },
  beforeMount() {
    const { prHeaderId, approveNode } = this.parameters || {};
    this.approveNodeFlag = approveNode === "1";
    this.headerInfoDs.addQueryParameter("prHeaderId", prHeaderId);
    this.headerInfoDs.setBodyParameter({ prHeaderId });
    this.$emit("GetApprovalTitle", this.$T("scux.boqform.view.message.approve.title").$D("工程量清单编制审批"));
  },
  methods: {
    getBasicColumns () {
      return [ {
        formRow: 1,
        fieldCode: "createdByName",
      },
      {
        formRow: 2,
        fieldCode: "attributeDatetime1",
      },
      {
        formRow: 3,
        fieldCode: "title",
      },
      {
        formRow: 4,
        fieldCode: "amount",
      },
      {
        formRow: 5,
        fieldCode: "attributeVarchar1",
      },
      {
        formRow: 6,
        fieldCode: "attributeDate1",
      },
      {
        formRow: 7,
        fieldCode: "attributeLongtext1",
      },
      {
        formRow: 8,
        fieldCode: "attributeVarchar4",
      },
      {
        formRow: 9,
        fieldCode: "attributeVarchar3",
        visible: () => this.approveNodeFlag
      } ];
    },
    // 审批前调用保存
    beforeApprove(approveResult) {
      return new Promise((resolve, reject) => {
        if (approveResult === "Approved" && this.approveNodeFlag) {
          const validateFlag = this.headerInfoDs.validate();
          if (!validateFlag) {
            shedeCheckApplication();
            reject(false);
            return false;
          } else {
            const { approveNode } = this.parameters || {};
            const data = this.headerInfoDs.current.data; // 基础信息
            update({
              ...data,
              approveNode: approveNode,
              actionType: 2
            }).then((res) => {
              if (res) {
                resolve(true);
              } else {
                reject();
              }
            });
          }
        } else {
          resolve(true);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>

</style>
