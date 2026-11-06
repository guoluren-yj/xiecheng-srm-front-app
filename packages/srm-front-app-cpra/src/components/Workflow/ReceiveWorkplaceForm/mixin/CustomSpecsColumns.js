import { $T, SrmBlank } from "srm-mobile-ui";
import NoContent from "srm-mobile-ui/packages/srm-list/NoContent";
export default {
  data() {
    return {};
  },
  methods: {
    //基本信息
    getSpecsColumns() {
      return [
        {
          formRow: 10,
          seq:10,
          fieldCode: "componentName",
          fieldName: $T("sinv.receiptExecution.model.title.componentName").$D("属性名称")
        },
        {
          formRow: 20,
          seq:10,
          fieldCode: "cpValue",
          fieldName: $T("sinv.receiptExecution.model.title.cpValue").$D("属性值")
        },
      ];
    },
    //定制品属性
    customSpecs(data) {
      // data.customSpecsJson = '[{"componentName":"颜色","componentType":"INPUT","cpDetailId":786,"cpGroupId":170,"cpLineId":300,"cpValue":"红色","cpValueId":977,"orderSeq":4,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"形状","componentType":"INPUT","cpDetailId":787,"cpGroupId":170,"cpLineId":300,"cpValue":"圆形","cpValueId":978,"orderSeq":5,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"材质","componentType":"INPUT","cpDetailId":788,"cpGroupId":170,"cpLineId":300,"cpValue":"木质","cpValueId":979,"orderSeq":6,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"重量（g）","componentType":"INPUT_NUMBER","cpDetailId":785,"cpGroupId":174,"cpLineId":300,"cpValue":"1","cpValueId":980,"orderSeq":0,"pricingFlag":1,"requiredFlag":1,"tenantId":9524,"unitCoefficient":10},{"componentName":"颜色","componentType":"INPUT","cpDetailId":786,"cpGroupId":170,"cpLineId":300,"cpValue":"红色","cpValueId":977,"orderSeq":4,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"颜色","componentType":"INPUT","cpDetailId":786,"cpGroupId":170,"cpLineId":300,"cpValue":"红色","cpValueId":977,"orderSeq":4,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"颜色","componentType":"INPUT","cpDetailId":786,"cpGroupId":170,"cpLineId":300,"cpValue":"红色","cpValueId":977,"orderSeq":4,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"颜色","componentType":"INPUT","cpDetailId":786,"cpGroupId":170,"cpLineId":300,"cpValue":"红色","cpValueId":977,"orderSeq":4,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1},{"componentName":"颜色","componentType":"INPUT","cpDetailId":786,"cpGroupId":170,"cpLineId":300,"cpValue":"红色","cpValueId":977,"orderSeq":4,"pricingFlag":0,"requiredFlag":1,"tenantId":9524,"unitCoefficient":1}]';
      let sObject = null;
      if (data.customSpecsJson) {
        sObject = JSON.parse(data.customSpecsJson);
      }
      this.customSpecsPopup = this.$popup({
        title: this.$T("sinv.receiptExecution.model.receipt.customSpecsJson").$D("定制品属性"),
        showHeader: true,
        position: "right",
        showBack: true,
        content: (sObject && sObject.length) > 0 ? <div>
          {
            sObject.map((item) => <div style={ { "margin-top":"15px" }}> <Customize
              needPadding={true}
              data-source={item}
              columns={this.getSpecsColumns()}
            />
            <SrmBlank size="mid" theme="fill"></SrmBlank>
            </div>)
          }
        </div> : <NoContent
          title={this.$T("smbl.common.view.data.none").$D("暂无数据")}
        />,
      });
    },
    // linkPr(params) {
    //   // 进入详情
    //   const { prHeaderId } = params;
    //   console.log(prHeaderId, 'prHeaderId');
    //   this.$router.push({
    //     path: "/appCpra/PurchaseReqWorkbenchDetail",
    //     query: {
    //       prHeaderId: prHeaderId,
    //       type: "readOnly",
    //     }
    //   });
    // }
  }
};
