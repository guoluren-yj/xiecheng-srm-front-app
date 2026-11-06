import { SrmButton } from "srm-mobile-ui";

export default {
  data() {
    return {};
  },
  methods: {
    //执行中
    getDoingColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            {item.displaySupplierName}
            <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }}
              type={this.getDoingStatusType(item.acceptStatus)}
              onClick={() => this.jumpDetail(item.acceptHeaderId, true)}
            >
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
          // render: (val, item) => <span>{val}-({item.printTimes})</span>,
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
          fieldCode: "acceptTotalAmount",
        },
        {
          formRow: 12,
          seq: 1,
          fieldCode: "stageTotalAmount",
        },
        {
          formRow: 13,
          seq: 1,
          fieldCode: "totalScore",
        },
        {
          formRow: 14,
          seq: 1,
          fieldCode: "creationName",
        },
        {
          formRow: 15,
          seq: 1,
          fieldCode: "unitName",
        },
        {
          formRow: 16,
          seq: 1,
          fieldCode: "currencyCode",
        },
        {
          formRow: 17,
          seq: 1,
          fieldCode: "creationDate",
        },
        {
          formRow: 18,
          seq: 1,
          fieldCode: "name",
        },
        {
          formRow: 19,
          seq: 1,
          fieldCode: "organizationName",
        },
        {
          formRow: 20,
          seq: 1,
          fieldCode: "agentName",
        }
      ];
    },
    // getDoingDetailColumns() {
    //   return [
    //     {
    //       fieldCode: "rcvStatusCodeMeaning",
    //     },
    //     {
    //       fieldCode: "nodeConfigName",
    //     },
    //     {
    //       fieldCode: "displayTrxNum",
    //     },
    //     {
    //       fieldCode: "rcvTypeName",
    //     },
    //     {
    //       fieldCode: "returnedFlagMeaning",
    //     },
    //     {
    //       fieldCode: "printFlagMeaning",
    //       render: (val, item) => {
    //         if (item.printTimes !== 0) {
    //           return <span>{val}({item.printTimes})</span>;
    //         }
    //         return <span>{val}</span>;
    //       }
    //     },
    //     {
    //       fieldCode: "supplierName",
    //     },
    //     {
    //       fieldCode: "companyName",
    //     },
    //     {
    //       fieldCode: "remark",
    //     },
    //     {
    //       fieldCode: "creationName",
    //     },
    //     {
    //       fieldCode: "creationDate",
    //     },
    //   ];
    // },
  }
};
