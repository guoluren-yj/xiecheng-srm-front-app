import { DataSet } from "srm-mobile-ui";
import asnDS from "../datasource/asnDS";

export default {
  data() {
    return {
      asnDataSet: new DataSet(asnDS()),
    };
  },
  methods: {
    renderDisplayPoNum(item = {}) {
      return <SrmButton
        fill
        onClick={() => {
          this.$router.push({
            path: "/SchSheOrderApprovalDetail",
            query: {
              poHeaderId: item.poHeaderId,
              orgName: item.companyName,
            },
          });
        }}>
        {this.$T("sodr.common.model.common.relatedOrder").$D("关联订单")}
      </SrmButton>;
    },
    renderAsnNum(item = {}) {
      return <SrmButton
        style={{ marginLeft: "10px" }}
        bordered
        onClick={() => {
          this.asnDataSet.addPathParameter("poLineLocationId", item.poLineLocationId);
          this.$popup({
            title: this.$T("sodr.common.model.common.relatedAsn").$D("关联送货单"),
            showHeader: true,
            showClose: true,
            rounded: true,
            height: "75vh",
            position: "bottom",
            content: <SrmList
              showSearch={false}
              showCancel={false}
              height="calc(75vh - 46x)"
              dataSet={this.asnDataSet}
              columns={this.getAsnColumns()}
            />,
          });
        }}>
        {this.$T("sodr.common.model.common.relatedAsn").$D("关联送货单")}
      </SrmButton>;
    },
    getAsnColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader showOpenTag={false}>
            {item.asnNum}
            <span slot="right">
              {this.$T("sodr.common.model.common.lineNum").$D("行号") + "：" + item.displayAsnLineNum}
            </span>
          </SrmListHeader>
        },
        { formRow: 2, fieldCode: "shipQuantity" },
        { formRow: 3, fieldCode: "uomName" },
        { formRow: 4, fieldCode: "shipDate" },
        { formRow: 5, fieldCode: "asnStatusMeaning" },
      ];
    }
  }
};
