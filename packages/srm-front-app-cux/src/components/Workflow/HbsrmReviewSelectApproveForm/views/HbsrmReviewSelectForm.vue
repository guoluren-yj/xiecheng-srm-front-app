<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.HbsrmReviewSelectForm.view.baseInfo').$D('基本信息')">
        <srm-form :data-set="headerDataDs" :columns="getBaseInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.HbsrmReviewSelectForm.view.reviewFile').$D('评审表预览')">
        <srm-form :data-set="headerDataDs" :columns="getFileReview" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.HbsrmReviewSelectForm.view.detailLine').$D('评审表明细信息')">
        <srm-form :data-set="headerDataDs" :columns="getSupplierList" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup :visible.sync="visibleBack" title="" height="90%" show-back :show-close="false" header-align="left" @onClose="onClose">
      <srm-list
        :scrollable="false"
        :data-set="lineDataDs"
        :columns="getItemColumns"/>
      <span slot="right"><a style="color: #00BFBF" @click="onOk">{{ $T('scux.HbsrmReviewSelectForm.modal.confirm').$D('确认') }}</a></span>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { headerDs, supplierDs, lineDs } from "../datasource/index";
import { isEmpty } from "@/utils/index";
import { toApprovalList } from "../api";
export default {
  modules: [ "scux.HbsrmReviewSelectForm", "hipspfm.common" ],
  name: "HbsrmReviewSelectForm",
  components: {},
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      flags: [], // 控制勾选框是否勾选
      visibleBack: false, // 弹窗显隐
      headerDataDs: new DataSet(headerDs()),
      supplierDataDs: new DataSet(supplierDs()),
      lineDataDs: new DataSet(lineDs()),
      nowSupplierRecord: "", // 确认时使用
      approveData: [], // 审批勾选数据集合
    };
  },
  computed: {
    getBaseInfoColumns() {
      return [
        {
          fieldCode: "rfxSplitNum",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxSplitNum").$D("评审表编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "docStatusMeaning",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.docStatus").$D("评审表状态"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "templateName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.templateName").$D("寻源模板"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "rfxTitle",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxTitle").$D("标题"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "sourceProjectNum",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.sourceProjectNum").$D("项目编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "sourceProjectName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.sourceProjectName").$D("项目名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "lastApprover",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.lastApprover").$D("审批人"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "lastApproverComment",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.lastApproverComment").$D("审批意见"),
          fieldType: "TEXT",
        },
      ];
    },
    getFileReview() {
      return [
        {
          fieldCode: "rfxSplitUuid",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxSplitUuid").$D("评审表附件"),
          fieldType: "UPLOAD",
          bucketName: "private-bucket",
        },
      ];
    },
    getSupplierList() {
      return [
        {
          fieldCode: "bidding",
          fieldType: "EMPTY",
          formRow: 90,
          render: () => {
            const data = this.supplierDataDs.toData();
            return <srm-flex>
              <table>
                <tr>
                  <th/>
                  <th>{this.$T("scux.HbsrmReviewSelectForm.model.quotationSupplier").$D("报价供应商")}</th>
                  <th>{this.$T("scux.HbsrmReviewSelectForm.model.taxIncludedAmountSum").$D("总金额（元）")}</th>
                </tr>
                {
                  isEmpty(data) &&
                  <tr>
                    <td colspan="2">{this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据")}</td>
                  </tr>
                }
                {
                  this.supplierDataDs.records.map((item, index) => {
                    const supplierCompanyId = item.get("supplierCompanyId");
                    return <tr>
                      <td>
                        <srm-checkbox
                          option={supplierCompanyId}
                          value={this.flags[index]}
                          // value={this.test}
                          key={index}
                          onInput={(value) => {
                            this.lineSelect(value, item, index);
                          }}
                        />
                      </td>
                      <td>
                        <a onClick={() => {
                          this.openModal(index);
                        }}>
                          {item.get("supplierCompanyName")}
                        </a>
                      </td>
                      <td>{item.get("taxIncludedAmountSum")}</td>
                    </tr>;
                  })
                }
              </table>
            </srm-flex>;
          }
        }
      ];
    },
    getItemColumns() {
      return [
        {
          fieldCode: "rfxLineItemNum",
          fieldType: "EMPTY",
          render: (val, record) => <span onClick={() => {
            this.goSourceDetail(record);
          }} style="fontWeight: bold; color: #00BFBF">{ (record.rfxNum || "") + "-" + record.rfxLineItemNum }</span>,
        },
        {
          fieldCode: "ouName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.ouName").$D("公司"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.itemCode").$D("物料编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.itemName").$D("物料名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "specifications",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.specification").$D("规格型号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "uomName",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.uomName").$D("单位"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.rfxQuantity").$D("数量"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "currentQuotationQuantity",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.currentQuotationQuantity").$D("可供数量"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "rfxQuantity",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.unitPrice").$D("单价（元）"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "isSelect",
          fieldName: $T("scux.HbsrmReviewSelectForm.model.isSelect").$D("是否已选用"),
          fieldType: "SWITCH",
          inputChange: (val, item, field, record) => {
            record.set("isSelect", val);
          },
          // render: (val, record) => {
          //   console.log(record);
          //   // <srm-checkbox value={val} option={val} />
          //   return <a>123</a>;
          // },
        },
      ];
    }
  },
  created() {
    this.headerDataDs.setQueryParameter({ "rfxSplitNum": this.changeReqId });
    this.headerDataDs.refresh();
    this.supplierDataDs.setQueryParameter({ "rfxSplitNum": this.changeReqId });
    this.supplierDataDs.refresh().then(() => {
      // 初始化勾选状态，都为false
      for (let index = 0; index < this.supplierDataDs.totalCount; index++) {
        this.flags[index] = false;
      }
    });
  },
  mounted() {
  },
  methods: {
    beforeApprove(approveResult) {
      return new Promise((resolve, reject) => {
        // 审批通过
        if (approveResult === "Approved") {
          const data = this.approveData.filter((item) => item && !isEmpty(item.selects));
          toApprovalList(data, this.changeReqId).then((res) => {
            if (res && res.failed) {
              reject(false);
            }
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    },
    lineSelect(value, item, index) {
      this.supplierDataDs.set(index, "selectAll", value);
      this.$set(this.flags, index, value); // 控制勾选框是否勾选
      const nowApproveData = {
        supplierCompanyId: item.get("supplierCompanyId"),
        supplierCompanyName: item.get("supplierCompanyName"),
        taxlncludedAmountSum: item.get("taxIncludedAmountSum"),
        selects: item.get("selectAll") ? "ALL" : [],
      };
      this.$set(this.approveData, index, nowApproveData);
    },
    openModal(index) {
      // 拿到点击的供应商行数据
      const record = this.supplierDataDs.get(index);
      this.nowSupplierRecord = record;
      // 创建弹窗的行信息ds
      this.lineDataDs = new DataSet({ ...lineDs(), events: {
        afterQuery: (ds, data,) => {
          if (record.get("selectAll")) {
            return data.map((item) => ({ ...item, isSelect: true }));
          } else if (!isEmpty(this.approveData[index])) {
            // 当打开弹窗勾选上部分数据，关掉后第二次后打开弹窗，将上一次勾选的结果还原上。
            const { selects } = this.approveData[index];
            return data.map((item) => {
              const itemNow = selects.filter((el) => el.id === item.id);
              if (isEmpty(itemNow)) {
                return { ...item, isSelect: false };
              }
              return { ...item, isSelect: true };
            });
          }
          return data.map((item) => ({ ...item, isSelect: false }));
        }
      }, });
      // 行信息查询
      const supplierCompanyId = record.get("supplierCompanyId");
      this.lineDataDs.setQueryParameter({ "rfxSplitNum": this.changeReqId, "supplierCompanyId": supplierCompanyId });
      this.lineDataDs.refresh();
      this.visibleBack = true;
      // 设置标题
      setTimeout(() => {
        const titleDom = document.getElementsByClassName("srm-list-search-line")[0];
        const childElement = document.createElement("div");
        childElement.id = "titleSupplier";
        childElement.innerHTML = record.get("supplierCompanyName");
        childElement.style.marginLeft = "10%";
        childElement.style.fontSize = "16px";
        childElement.style.fontWeight = "400";
        titleDom.appendChild(childElement);
      }, 200);
    },
    onClose() {
      const titleDom = document.getElementsByClassName("srm-list-search-line")[0];
      const childElement = document.getElementById("titleSupplier");
      titleDom.removeChild(childElement);
    },
    onOk() {
      const index = this.nowSupplierRecord.index;
      // 弹窗确认时，临时存储当前数据勾选状态。
      const selectData = this.lineDataDs.records.reduce((newArr, item) => {
        if (item.get("isSelect")) {
          const newItem = {
            id: item.get("id"),
            isSelect: item.get("isSelect"),
            rfxLineltemNum: item.get("rfxLineltemNum"),
            itemName: item.get("itemName"),
            itemCode: item.get("itemCode"),
          };
          newArr.push(newItem);
        }
        return newArr;
      }, []);
      if (selectData.length !== Number(this.lineDataDs.totalCount)) {
        this.nowSupplierRecord.set("selectAll", false); // 实际记录是否全选
        this.$set(this.flags, index, false); // 控制勾选框是否勾选
      } else {
        this.nowSupplierRecord.set("selectAll", true);
        this.$set(this.flags, index, true); // 控制勾选框是否勾选
      }
      // 记录确认后弹窗内勾选状况
      const nowApproveData = {
        supplierCompanyId: this.nowSupplierRecord.get("supplierCompanyId"),
        supplierCompanyName: this.nowSupplierRecord.get("supplierCompanyName"),
        taxlncludedAmountSum: this.nowSupplierRecord.get("taxIncludedAmountSum"),
        selects: this.nowSupplierRecord.get("selectAll") ? "ALL" : selectData,
      };
      this.$set(this.approveData, index, nowApproveData);
      // 关闭弹窗，注销标题
      this.visibleBack = false;
      this.onClose();
    },
    goSourceDetail(record) {
      const { rfxHeaderId, itemCode } = record;
      this.$router.push({ path: "/appSour/PricingApprovalNew", query: { rfxHeaderIds: rfxHeaderId, secondarySourceCategory: itemCode, } });
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-form{
  min-height: 10vh;
}
table{
  width:100%;
}
table,table tr th, table tr td {
  border:1px solid #1f1f1f;
  text-align: center;
}
td {
  height: 30px;
  a {
    color: #00BFBF;
  }
  .srm-check-box{
    margin-top: 5px;
  }
}
</style>
