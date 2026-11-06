
export default {
  data() {
    return {};
  },
  methods: {
    //已完成
    getFinishColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {/*<SrmButton plain rect style={{ fontWeight: "bold" }} type="primary"*/}
            {/*  onClick={() => this.jumpDetail(item.rcvTrxHeaderId,item.returnedFlag,item.nodeConfigIndex)}>*/}
            {/*  {item.displayTrxNum}*/}
            {/*</SrmButton>*/}
            {item.displaySupplierName}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }}
              type={this.getDoingStatusType(item.acceptStatus)}>
              {item.acceptStatusMeaning}
            </SrmButton>
          </SrmListHeader>
        }, {
          formRow: 2,
          fieldCode: "acceptNum",
        },
        {
          formRow: 3,
          seq: 1,
          fieldCode: "companyName",
        },
        {
          formRow: 4,
          seq: 1,
          fieldCode: "title",
        },
        {
          formRow: 5,
          seq: 1,
          fieldCode: "displayPoNum",
        },
        {
          formRow: 6,
          seq: 1,
          fieldCode: "taxIncludeAmount",
        },
        {
          formRow: 7,
          seq: 1,
          fieldCode: "termMeaning",
        },
        {
          formRow: 8,
          seq: 1,
          fieldCode: "stageDesc",
        },
        {
          formRow: 9,
          seq: 1,
          fieldCode: "acceptTypeCodeMeaning",
        },
        {
          formRow: 10,
          seq: 1,
          fieldCode: "acceptStageCompleteFlag",
          render: (val, item) => <span>{item?.acceptStageCompleteFlagMeaning}</span>
        },
        {
          formRow: 11,
          seq: 1,
          fieldCode: "totalScore",
        },
        {
          formRow: 12,
          seq: 1,
          fieldCode: "acceptTotalAmount",
        },
        {
          formRow: 13,
          seq: 1,
          fieldCode: "creationName",
        },
        {
          formRow: 14,
          seq: 1,
          fieldCode: "unitName",
        },
        {
          formRow: 15,
          seq: 1,
          fieldCode: "currencyCode",
        },
        {
          formRow: 16,
          seq: 1,
          fieldCode: "creationDate",
        },
        {
          formRow: 17,
          seq: 1,
          fieldCode: "name",
        },
        {
          formRow: 18,
          seq: 1,
          fieldCode: "organizationName",
        },
        {
          formRow: 19,
          seq: 1,
          fieldCode: "agentName",
        }
      ];
    },
    getFinishDetailColumns() {
      return [
        {
          fieldCode: "nodeConfigName",
        },
        {
          fieldCode: "displayTrxNum",
        },
        {
          fieldCode: "rcvTypeName",
        },
        {
          fieldCode: "returnedFlagMeaning",
        },
        {
          fieldCode: "printFlagMeaning",
        },
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "creationName",
        },
        {
          fieldCode: "creationDate",
        },
      ];
    },
  }
};
