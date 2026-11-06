import { $T } from "srm-mobile-ui";
import {
  getOperatingDataApi
} from "../api";
import {
  getStatusCodeColor,
} from "../utils";
export default {
  data() {
    return {};
  },
  methods: {
    getWaitSubmitListColumns(nodeTemplateCode) {
      switch (nodeTemplateCode) {
      case "ASN":
        return [
          {
            fieldCode: "displayAsnNum",
            fieldType: "EMPTY",
            formRow: 1,
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.displayAsnNum }</span>
              <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
            </srm-list-header>
          },
          {
            fieldCode: "companyName",
            formRow: 2,
          },
          {
            fieldCode: "supplierCompanyName",
            formRow: 3,
          },
          {
            fieldCode: "creationDate",
            formRow: 4,
          },
          {
            fieldCode: "createdName",
            formRow: 5,
          },
          {
            fieldCode: "operating",
            formRow: 5,
            render: () => <span style="color: var(--color-other-default-b)">{$T("hipspfm.common.button.view").$D("查看")}</span>,
            callBack: async (item) => {
              let operatingData = [];
              if (item["operating"] && item["operating"].length) {
                operatingData = item["operating"];
              } else {
                this.$loading.show();
                const params1 = {
                  tableName: "slod_asn_header",
                  tablePk: item.asnHeaderId,
                };
                const params2 = {
                  nodeTemplateCode: "ASN",
                  deliveryHeaderId: item.asnHeaderId,
                };
                operatingData = await getOperatingDataApi([ "1" ].includes(this.operatingType) ? params1 : params2, this.operatingType);
                item["operating"] = operatingData;
                this.$loading.hide();
              }
              this.$popup({
                title: $T("slod.common.model.common.operating").$D("操作记录"),
                showHeader: true,
                showClose: true,
                rounded: true,
                height: "80%",
                position: "bottom",
                content: <history-record-tiled
                  action-data={operatingData}
                  remark-label={$T("slod.common.model.common.remark").$D("备注")}
                  operation-meaning-field-name="fieldMeaning"
                  process-remark-field-name="name"
                  operator-field-name="operator"
                  process-date-field-name="createDate"/>,
              });
              return;
            },
          }
        ];
      case "PLAN":
        return [
          {
            fieldCode: "displayPlanNum",
            fieldType: "EMPTY",
            formRow: 1,
            render: (val, item) => <srm-list-header show-open-tag={true}>
              <span>{ item.displayPlanNum }</span>
              <span slot="right" style={getStatusCodeColor(item.statusCode)}>{ item.statusCodeMeaning }</span>
            </srm-list-header>
          },
          {
            fieldCode: "companyName",
            formRow: 2,
          },
          {
            fieldCode: "supplierCompanyName",
            formRow: 3,
          },
          {
            fieldCode: "creationDate",
            formRow: 4,
          },
          {
            fieldCode: "createdName",
            formRow: 5,
          },
        ];
      default:
        return [];
      }
    },
  }
};
