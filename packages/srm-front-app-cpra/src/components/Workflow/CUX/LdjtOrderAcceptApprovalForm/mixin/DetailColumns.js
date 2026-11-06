import { $T, SrmButton, SrmUpload, SrmFlex, SrmUtil } from "srm-mobile-ui";
// import { isNil } from "lodash";
import uuid from "uuid";
export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getBasicColumns() {
      return {
        "basic": [
          {
            formRow: 1,
            fieldCode: "header",
            fieldType: "EMPTY",
            render: (val, item) => {
              return (
                <SrmListHeader>
                  {item.acceptNum}
                  <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type="primary">
                    {item.acceptStatusMeaning}
                  </SrmButton>
                </SrmListHeader>
              )
            }
          },
          {
            formRow: 30,
            seq: 10,
            fieldCode: "title",
            fieldName: $T("scux.acceptBench.model.receipt.title").$D("验收标题"),
          },
          {
            formRow: 40,
            seq: 10,
            fieldCode: "companyName",
          },
          {
            formRow: 50,
            seq: 10,
            fieldCode: "supplierName",
          },
          {
            formRow: 60,
            seq: 10,
            fieldCode: "displayPoNum",
          },
          {
            formRow: 60,
            seq: 20,
            fieldCode: "stageDesc",
          },

          {
            formRow: 70,
            seq: 10,
            fieldCode: "creationName",
          },
          {
            formRow: 70,
            seq: 20,
            fieldCode: "creationDate",
          },
        ],
        "detail": [
          {
            fieldCode: "acceptNum",
          },
          {
            fieldCode: "title",
          },
          {
            fieldCode: "companyName",
          },
          {
            fieldCode: "supplierName",
          },

          {
            fieldCode: "displayPoNum",
          },
          {
            fieldCode: 'taxIncludeAmount',
          },
          {
            fieldCode: "stageDesc",
          },
          {
            fieldCode: "unitName",
          },
          {
            fieldCode: "acceptStatusMeaning",
          },
          {
            fieldCode: "creationName",
          },
          {
            fieldCode: "creationDate",
          },
        ],
      }


    },
    //验收信息
    getAcceptColumns() {
      return {
        'basic': [

          {
            formRow: 10,
            seq: 10,
            fieldCode: "acceptStageCompleteFlag",
          },
          {
            formRow: 10,
            seq: 20,
            fieldCode: "acceptStageAmount",
          },
          {
            formRow: 20,
            seq: 10,
            fieldCode: "stagePercent",
          },
          {
            formRow: 20,
            seq: 20,
            fieldCode: "acceptTotalAmount",
          },
          {
            formRow: 30,
            seq: 10,
            fieldCode: "stageTotalAmount",
          },
          {
            formRow: 30,
            seq: 20,
            fieldCode: "notAcceptStageAmount",
          },
        ],
        'detail': [

          {

            fieldCode: "acceptStageCompleteFlag",
          },
          {

            fieldCode: "acceptStageAmount",
          },
          {

            fieldCode: "stagePercent",
          },
          {

            fieldCode: "acceptTotalAmount",
          },
          {

            fieldCode: "stageTotalAmount",
          },
          {

            fieldCode: "notAcceptStageAmount",
          },
        ],
      }
    },

    //订单信息
    getOrderColumns() {
      return {
        'basic': [

          {
            formRow: 30,
            seq: 10,
            fieldCode: "acceptProcess",
          },
          {
            formRow: 30,
            seq: 20,
            fieldCode: "acceptTotalAmount",
          },
          {
            formRow: 40,
            seq: 10,
            fieldCode: "addAcceptProcess",
          },
          {
            formRow: 40,
            seq: 20,
            fieldCode: "addAcceptAmount",
          },
          {
            formRow: 50,
            seq: 10,
            fieldCode: "notAcceptProcess",
          },
          {
            formRow: 50,
            seq: 20,
            fieldCode: "notAcceptOrderAmount",
          },
          {
            formRow: 60,
            seq: 20,
            fieldCode: "remark",
          },
        ],
        'detail': [

          {
            fieldCode: "acceptProcess",
          },
          {

            fieldCode: "acceptTotalAmount",
          },
          {

            fieldCode: "addAcceptProcess",
          },
          {

            fieldCode: "addAcceptAmount",
          },
          {

            fieldCode: "notAcceptProcess",
          },
          {

            fieldCode: "acceptCriteria",
          },
          {

            fieldCode: "notAcceptOrderAmount",
          },
          {

            fieldCode: "remark",
          },
        ],
      }
    },

    //验收行信息
    getLineColumns() {
      return {
        "basic": [
          {
            formRow: 1,
            fieldCode: "header",
            fieldType: "EMPTY",
            render: (val, item) => <SrmListHeader>
              {item.acceptLineNum}
            </SrmListHeader>,
          },
          {
            formRow: 10,
            seq: 10,
            fieldCode: "itemCode",
          },
          {
            formRow: 10,
            seq: 20,
            fieldCode: "itemName",
          },
          {
            formRow: 20,
            seq: 10,
            fieldCode: "acceptAmount",
          },
          {
            formRow: 20,
            seq: 20,
            fieldCode: "referenceAmount",
          },
          {
            formRow: 30,
            seq: 10,
            fieldCode: "acceptTaxIncludedPrice",
          },
          {
            formRow: 30,
            seq: 20,
            fieldCode: "taxIncludedPrice",
          },
          {
            formRow: 40,
            seq: 10,
            fieldCode: "quantity",
          },
          {
            formRow: 40,
            seq: 20,
            fieldCode: "taxIncludedLineAmount",
          },
          {
            formRow: 50,
            seq: 10,
            fieldCode: "displayPoNum",
          },
          {
            formRow: 50,
            seq: 20,
            fieldCode: "displayLineNum",
          },

        ],
        "detail": [
          {
            formRow: 1,
            fieldCode: "acceptLineNum",

          },
          {
            formRow: 10,
            seq: 10,
            fieldCode: "itemCode",
          },
          {
            formRow: 10,
            seq: 20,
            fieldCode: "itemName",
          },
          {
            formRow: 20,
            seq: 10,
            fieldCode: "acceptAmount",
          },
          {
            formRow: 20,
            seq: 20,
            fieldCode: "referenceAmount",
          },
          {
            formRow: 30,
            seq: 10,
            fieldCode: "acceptTaxIncludedPrice",
          },
          {
            formRow: 30,
            seq: 20,
            fieldCode: "taxIncludedPrice",
          },
          {
            formRow: 40,
            seq: 10,
            fieldCode: "quantity",
          },
          {
            formRow: 40,
            seq: 20,
            fieldCode: "taxIncludedLineAmount",
          },
          {
            formRow: 50,
            seq: 10,
            fieldCode: "displayPoNum",
          },
          {
            formRow: 50,
            seq: 20,
            fieldCode: "displayLineNum",
          },

          {
            formRow: 30,
            seq: 10,
            fieldCode: "projectTaskNum",
          },
          {
            formRow: 30,
            seq: 20,
            fieldCode: "projectTaskName",
          },
          {
            formRow: 40,
            seq: 10,
            fieldCode: "taskCode",
          },
          {
            formRow: 40,
            seq: 20,
            fieldCode: "specifications",
          },
          {
            formRow: 50,
            seq: 10,
            fieldCode: "brand",
          },
          {
            formRow: 50,
            seq: 20,
            fieldCode: "remark",
          },


        ],
      }
    },


    //评分行
    getLineRateColumns() {
      return {
        "basic": [

          {
            formRow: 10,
            seq: 10,
            fieldCode: "content",
          },
          {
            formRow: 20,
            seq: 10,
            fieldCode: "score",
          },
        ],
        "detail": [

          {
            formRow: 10,
            seq: 10,
            fieldCode: "content",
          },
          {
            formRow: 20,
            seq: 10,
            fieldCode: "score",
          },
          {
            formRow: 30,
            seq: 10,
            fieldCode: "opinion",
          },
        ],
      }
    },


    //附件
    getAttachColumns() {
      return [
        {
          fieldType: "EMPTY",
          fieldCode: "acceptCriteriaAttachUuid",
          render: (val) =>
            <SrmFlex
              class='attachment'
              justify='between'
              nativeOnClick={() => {
                this.$attachment({
                  attachments: [
                    {
                      attachmentUuid: val,
                      title: this.$T(
                        "scux.acceptBench.view.insideAttachmentss"
                      ).$D("验收标准附件"),
                      readonly: true,
                      showInfo: true,
                      uploadButton: "none"
                    }
                  ]
                });
              }}>
              <SrmFlex>
                <span class='srm-icon icon-other' />
                <srm-button type='brown' plain>
                  {this.$T("scux.acceptBench.view.insideAttachmentss").$D(
                    "验收标准附件"
                  )}
                </srm-button>
              </SrmFlex>
              <span class='srm-icon icon-chevron-right' />
            </SrmFlex>,
          formRow: 10
        },
        {
          fieldType: "EMPTY",
          fieldCode: "acceptAttachUuid",
          render: (val) => {
            return (
              <SrmFlex
                class='attachment'
                justify='between'
                nativeOnClick={() => {
                  this.$attachment({
                    attachments: [
                      {
                        attachmentUuid: val,
                        title: this.$T(
                          "scux.acceptBench.view.outsideAttachments"
                        ).$D("验收附件"),
                        readonly: true,
                        showInfo: true,
                        uploadButton: "none"
                      }
                    ]
                  });
                }}>
                <SrmFlex>
                  <span class='srm-icon icon-other' />
                  <srm-button type='brown' plain>
                    {this.$T("scux.acceptBench.view.outsideAttachments").$D(
                      "验收附件"
                    )}
                  </srm-button>
                </SrmFlex>
                <span class='srm-icon icon-chevron-right' />
              </SrmFlex>
            )
          }
          ,
          formRow: 20
        }
      ];
    }
  }
};
