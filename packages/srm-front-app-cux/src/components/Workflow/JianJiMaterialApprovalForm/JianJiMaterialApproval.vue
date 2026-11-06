<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.material.view.title.baseInfo').$D('基础信息')">
        <div >
          <!-- <customize
            :columns="getHeaderColumns()"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/> -->
          <srm-form :data-set="headerDataDs" :columns="getHeaderColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.material.view.title.materialMessage').$D('物料信息')">
        <srm-list
          :data-set="lineInfoDataSet"
          :columns="lineColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 详情弹框 -->
    <srm-popup :visible.sync="visiblePopup"
               :position="'right'"
               :show-header="false"
               :height="'100%'">
      <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
        {{ $T('scux.material.view.title.materialMessage').$D('物料信息') }}
      </srm-list-header>
      <customize
        :columns="getSupplierHeaderColumns()"
        :need-padding="true"
        type="list"
        :data-source="clickItem"/>
      <srm-list-header style="padding:15px 0 0 15px" show-open-tag>
        {{ $T('scux.material.view.title.supplierMessage').$D('供应商信息') }}
      </srm-list-header>
      <srm-list
        :scrollable="false"
        height="auto"
        style="height: auto"
        :data-set="supplierLineInfoDataSet"
        :columns="supplierLineColumns"/>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs, supplierLineInfoDs, headerDs } from "./dataSource/lineDs";
import { getBaseInfoApi, toApprovalList } from "./api";
import { isNil } from "lodash";

export default {
  modules: [ "scux.material", "hipspfm.workFlow" ],
  name: "JianJiMaterialApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      // headerInfo: {},
      lineInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs()),
      headerDataDs: new DataSet(headerDs()),
      supplierLineInfoDataSet: new DataSet(supplierLineInfoDs()),
      visiblePopup:false,
      clickItem:{}
    };
  },
  computed: {
    getSupplierHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.material.model.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.material.model.itemCodeMeaning").$D("物料名称"),
          fieldCode: "itemCodeMeaning",
        },
      ];
    },
    getHeaderColumns() {
      //console.log('a',this.headerDataDs?.current?.get('firstNodeEditFlag'))
      return [
        {
          //   fieldName: this.$T("scux.material.model.paramNum").$D("参数单号"),
          fieldCode: "paramNum",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        // {
        //   fieldName: this.$T("scux.material.model.companyName").$D("流程名称"),
        //   fieldCode: "companyName",
        //   formRow: 2,
        // },
        {
          // fieldName: this.$T("scux.material.model.businessTypeMeaning").$D("业务类型"),
          fieldCode: "businessTypeMeaning",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.material.model.invOrganizationCodeMeaning").$D("库存组织编码"),
          fieldCode: "invOrganizationCodeMeaning",
          formRow: 3,
        },
        {
          fieldName: this.$T("scux.material.model.statusMeaning").$D("状态"),
          fieldCode: "statusMeaning",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.material.model.approveFlag").$D("是否质量/研究院审批"),
          fieldCode: "approveFlag",
          formRow: 5,
          lovCode: "SPUC.PO_ITEM_APPROVAL",
          fieldType:"SELECT",
          required: (_, item) =>
          //  console.log('val',val,'item',item)
            [ "1", 1 ].includes(item.approveFlagEdit),
          editor: (_, item) => [ 1, "1" ].includes(item.firstNodeEditFlag), //this.headerDataDs?.current?.
        },
        {
          fieldName: this.$T("scux.material.model.createdByMeaning").$D("创建人"),
          fieldCode: "createdByMeaning",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.material.model.createdDate").$D("创建时间"),
          fieldCode: "createdDate",
          formRow: 7,
        },
        // {
        //   fieldName: this.$T("scux.material.model.engineerComments").$D("价审工程师意见"),
        //   fieldCode: "engineerComments",
        //   formRow: 8,
        // },
        // {
        //   fieldName: this.$T("scux.material.model.extension").$D("是否延期"),
        //   fieldCode: "extension",
        //   formRow: 9,
        // },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.material.model.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.material.model.itemCodeMeaning").$D("物料名称"),
          fieldCode: "itemCodeMeaning",
        },
        {
          fieldName: this.$T("scux.material.model.fileNum").$D("文件编号"),
          fieldCode: "fileNum",
        },
        {
          fieldName: this.$T("scux.material.model.gzjFlag").$D("关重件标识"),
          fieldCode: "gzjFlag",
        },
        {
          fieldName: this.$T("scux.material.model.itemProp").$D("物料属性"),
          fieldCode: "itemProp",
        },
        {
          fieldName: this.$T("scux.material.model.uomCodeMeaning").$D("单位"),
          fieldCode: "uomCodeMeaning",
        },
        {
          fieldName: this.$T("scux.material.model.itemWeight").$D("物料重量"),
          fieldCode: "itemWeight",
        },
        {
          fieldName: this.$T("scux.material.model.guding").$D("固定"),
          fieldCode: "guding",
        },
        {
          fieldName: this.$T("scux.material.model.hjg").$D("后加工"),
          fieldCode: "hjg",
        },
        {
          fieldName: this.$T("scux.material.model.yjg").$D("预加工"),
          fieldCode: "yjg",
        },
        {
          fieldName: this.$T("scux.material.model.gdgyts").$D("固定供应天数"),
          fieldCode: "gdgyts",
        },
        {
          fieldName: this.$T("scux.material.model.zxdhl").$D("最小订货量"),
          fieldCode: "zxdhl",
        },
        {
          fieldName: this.$T("scux.material.model.zddhl").$D("最大订货量"),
          fieldCode: "zddhl",
        },
        {
          fieldName: this.$T("scux.material.model.gddhl").$D("固定订货量"),
          fieldCode: "gddhl",
        },
        {
          fieldName: this.$T("scux.material.model.itemType").$D("物料类型"),
          fieldCode: "itemType",
        },
        {
          fieldName: this.$T("scux.material.model.agentCodeMeaning").$D("采购员"),
          fieldCode: "agentCodeMeaning",
        },
        {
          fieldName: this.$T("scux.material.model.supplier").$D("供应商信息"),
          fieldCode: "supplier",
          render: (val, item) =>
            <srm-list-header show-open-tag={true}>
              {/* <span>{val}</span> */}
              <SrmButton
                // slot="left"
                plain
                rect
                style={{ fontWeight: "bold" }}
                onClick={() => {
                  // this.beforeApprove()
                //  console.log("item", item);
                  this.clickItem = item;
                  this.supplierLineInfoDataSet.addBodyParameter("id", item.id);
                  this.supplierLineInfoDataSet.addBodyParameter("type", "itemSupplierQuery");
                  this.supplierLineInfoDataSet.refresh();
                  this.visiblePopup = true;
                }}
              >
                {this.$T("scux.material.model.lookDetail").$D("查看详情")}
              </SrmButton>
            </srm-list-header>
        },
        {
          fieldName: this.$T("scux.material.model.jszk").$D("接收子库"),
          fieldCode: "jszk",
        },
        {
          fieldName: this.$T("scux.material.model.kgxx").$D("库管信息"),
          fieldCode: "kgxx",
        },
      ];
    },
    supplierLineColumns() {
      return [
        {
          fieldName: this.$T("scux.material.model.supplierNum").$D("供应商编码"),
          fieldCode: "supplierNum",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.material.model.supplierName").$D("供应商名称"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("scux.material.model.stageCodeMeaning").$D("供应商生命周期"),
          fieldCode: "stageCodeMeaning",
        },
        {
          fieldName: this.$T("scux.material.model.supplyRatio").$D("供货比例"),
          fieldCode: "supplyRatio",
        },
      ];
    },
  },
  async mounted() {
    let id = this.changeReqId;//??38272
    // console.log("this.changeReqId", this.changeReqId);
    const res = await getBaseInfoApi(id);
    if (res && res.content) {
    //  this.headerInfo = res.content[0];

      this.headerDataDs.setData(res.content);
      // console.log('res',res,'a', this.headerDataDs.toData()[0].statusMeaning)
      this.headerDataDs.locate(0);
    }
    // console.log('headerDataDs',this.headerDataDs)
    // this.headerDataDs.addQueryParameter("id", id);
    // this.headerDataDs.query().then(res=>{
    //   if(res){
    //     console.log('res',res)
    //   this.headerDataDs.loadData(res.content);
    //   }
    // });
    //this.headerInfo = await getBaseInfoApi(id);
    //this.lineInfoDataSet.addPathParameter("id", id);
    this.lineInfoDataSet.addBodyParameter("id", id);
    this.lineInfoDataSet.addBodyParameter("type", "itemLineQuery");
    this.lineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.material.view.title.materialApproval").$D(
        "新物料参数维护单"
      ),
    );
  },
  methods: {
    beforeApprove(approveResult) {
      //const headerFlag = this.headerDataDs?.validate(true)
      //console.log('headerFlag',  this.headerDataDs?.current.getField("approveFlag").options)
      return new Promise((resolve, reject) => {
        // 审批通过
        if (approveResult === "Approved") {
          // const data = this.approveData.filter((item) => item && !isEmpty(item.selects));
          if ([ "1", 1 ].includes(this.headerDataDs?.current?.get("approveFlagEdit")) && isNil(
        this.headerDataDs?.current?.get("approveFlag")
          )) {
            this.$notification.open({
              message: this.$T("scux.material.model.approvalTip").$D("是否质量/研究院审批必填"),
              class: "notification",
              duration: 3
            });
            reject(false);
          }
          const params = {
            headerVO:this.headerDataDs.toData()[0],
            lineListVO:[]//this.lineInfoDataSet.toData()
          };
          toApprovalList(params).then((res) => {
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
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .contentStyle{
    .titleTag {
      height: 24px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .titleTag::before {
      content: '|';
      background: #36c2cf;
      color: #36c2cf;
      margin-right: 8px;
    }
  }

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