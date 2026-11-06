<template>
  <div>
    <div style="height: 100vh">
      <div class="detail-wrap create-receive-detail-scroll-el " >
        <div class="detail-wrap create-receive-detail-scroll-el " >
          <srm-detail-head :data-source="headerDataDs.data[0]?headerDataDs.data[0]:{}" :columns="getHeaderColumns">
            <div class="button-right-margin">
              <srm-button size="small" icon="icon-paperclip">
                <srm-attachment-button :attachments="fileArr" :title="$T('scux.pciQialityInspection.button.file').$D('详情附件')" />
              </srm-button>
            </div>
          </srm-detail-head>
          <srm-scroll-tab>
            <srm-scroll-tab-item :label="$T('scux.pciQialityInspection.title.inspectionHeaderInfo').$D('质检单头部信息')">
              <srm-form style="padding:0 15px 10px 15px;min-height: 264px;margin-bottom: 0px;" :data-set="headerDataDs" :columns="getHeaderInfoColumns"/>
            </srm-scroll-tab-item>
            <srm-scroll-tab-item :label="$T('scux.pciQialityInspection.title.inspectionLineInfo').$D('质检单行表信息')">
              <srm-list
                :scrollable="false"
                :data-set="lineDetalisDataDs"
                :columns="getLieDetailsColumns"
                @itemClick="onItemClick"/>
            </srm-scroll-tab-item>
          </srm-scroll-tab>
        </div>
      </div>
    </div>
    <srm-bottom-handler v-if="headerDataDs.data[0]&&headerDataDs.data[0].checkStatus === 'WAIT_ASSIGN'" :btn-arr="bottomBtn()" type="tooltip" class="bottom-receive-box"/>
  </div>
</template>

<script>
import { DataSet, $T, SrmForm } from "srm-mobile-ui";
import { headerDs, lineDetailsDs } from "../datasource/index";
import { fetchOperation } from "../api/index";
import { isEmpty } from "@/utils/index";

export default {
  modules: [ "scux.pciQialityInspection" ],
  name: "PCIQualityInspectionDetails",
  components: {
  },
  data() {
    const {
      app: {
        _route: {
          query: { asnCheckHeaderId },
        },
      },
    } = this.$router;
    return {
      headerDataDs: new DataSet(headerDs(this)),
      lineDetalisDataDs: new DataSet(lineDetailsDs(this)),
      asnCheckHeaderId,
      headerFilePopup: false,
    };
  },
  computed: {
    fileArr() {
      return [
        {
          title: $T("scux.pciQialityInspection.attachment.qualityInspection").$D("上传质检记录"),
          attachmentUuid: this.headerDataDs.data[0] ? this.headerDataDs.data[0].checkAttachmentUuid : null,
          readonly: false,
          bucketName: "public-bucket",
        },
        {
          title: $T("scux.pciQialityInspection.attachment.supplier").$D("供应商附件"),
          attachmentUuid: this.headerDataDs.data[0] ? this.headerDataDs.data[0].attachmentUuid : null,
          readonly: true,
          uploadButton: "none",
          bucketName: "public-bucket",
        },
      ];
    },
    getHeaderColumns() {
      return [ {
        fieldCode: "asnNum",
        render: (val) => <span>{ $T("scux.pciQialityInspection.model.asnNum").$D("送货单单号") }：{ val }</span>,
      }, {
        fieldCode: "creationDate",
        render: (val) => <span>{ $T("scux.pciQialityInspection.model.creationDate").$D("创建时间") }：{ val }</span>
      } ];

    },
    getHeaderInfoColumns() {
      return [
        {
          fieldCode: "supplierName",
        },
        {
          fieldCode: "asnAddressTypeMeaning",
        },
        {
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldCode: "contactName1",
        },
        {
          fieldCode: "contactPhone1",
        },
        {
          fieldCode: "contactName2",
        },
        {
          fieldCode: "contactPhone2",
        },
        {
          fieldCode: "employeeNum",
        },
        {
          fieldCode: "checkRemark",
        },
      ];
    },
    getLieDetailsColumns() {
      return [
        {
          fieldCode: "itemName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) => <SrmListHeader>
            <span class="srm-list-inspection-line"> {val}</span>
            <span slot="right" style="color:#276EF1;">{`行号${record.asnCheckLineNum}`}</span>
          </SrmListHeader>,
        },
        {
          fieldCode: "itemCode",
        },
        {
          fieldCode: "neededDate",
        },
        {
          fieldCode: "shipQuantity",
        },
        {
          fieldCode: "uomName",
        },
        {
          fieldCode: "productNum",
        },
        {
          fieldCode: "productName",
        },
      ];
    },
    getItemDetailsColumns() {
      return [
        {
          fieldCode: "asnCheckLineNum",
          fieldName: $T("scux.pciQialityInspection.model.asnCheckLineNum").$D("行号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("scux.pciQialityInspection.model.itemCode").$D("物料编码"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "itemName",
          fieldName: $T("scux.pciQialityInspection.model.itemName").$D("物料名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "shipQuantity",
          fieldName: $T("scux.pciQialityInspection.model.shipQuantity").$D("发货数量"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "uomName",
          fieldName: $T("scux.pciQialityInspection.model.uomName").$D("单位"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "poNum",
          fieldName: $T("scux.pciQialityInspection.model.poNum").$D("订单号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "lineNum",
          fieldName: $T("scux.pciQialityInspection.model.lineNum").$D("订单行号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "productNum",
          fieldName: $T("scux.pciQialityInspection.model.productNum").$D("项目号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "productName",
          fieldName: $T("scux.pciQialityInspection.model.productName").$D("项目名称"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "neededDate",
          fieldName: $T("scux.pciQialityInspection.model.neededDate").$D("需求日期"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "purchaseRemark",
          fieldName: $T("scux.pciQialityInspection.model.purchaseRemark").$D("采购方行备注"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "agentName",
          fieldName: $T("scux.pciQialityInspection.model.agentName").$D("采购员"),
          fieldType: "TEXT",
        },
      ];
    },
  },
  beforeMount() {
    this.headerDataDs.create({});
  },
  mounted() {
    this.headerDataDs.refresh();
    this.lineDetalisDataDs.refresh();
  },
  methods: {
    async handleReturnInspection(type) {
      const { checkRemark, checkName } = this.headerDataDs.current.data;
      const validateCheckNameFlag = isEmpty(checkName);
      const validateCheckRemarkFlag = isEmpty(checkRemark);
      if (type === "distribution" && validateCheckNameFlag) {
        this.$notification.open({
          message: $T("scux.pciQialityInspection.message.please.assign.qualityInsprctor").$D("请分配质检员"),
          class: "notification"
        });
        return;
      }
      if (type !== "distribution" && validateCheckRemarkFlag) {
        this.$notification.open({
          message: $T("scux.pciQialityInspection.message.please.enter.reasonRejection").$D("请输入驳回理由"),
          class: "notification"
        });
        return;
      }
      const formData = this.headerDataDs.current.data;
      const currentData = {
        ...formData,
        employeeName: formData.checkName,
      };
      this.$loading.show();
      try {
        const res = await fetchOperation([ currentData ], type);
        if (res && !res.failed) {
          this.$router.replace({
            name: "PCIQualityInspectionList",
          });
        }
      } finally {
        this.$loading.hide();
      }
    },
    bottomBtn() {
      return [ {
        text: $T("scux.pciQialityInspection.button.returnInspectionsReport").$D("退回质检报告"),
        type: "primary",
        fill: true,
        bordered: true,
        visible: true,
        handler: () => {
          this.handleReturnInspection("returnInspections");
        }
      }, {
        text: $T("scux.pciQialityInspection.button.distribution").$D("分配"),
        type: "primary",
        fill: true,
        bordered: true,
        visible: true,
        handler: () => {
          this.handleReturnInspection("distribution");
        }
      }, ];

    },
    onItemClick(record) {
      this.$popup({
        title: this.$T("scux.pciQialityInspection.view.title.itemInfo").$D("物料信息"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        rounded: true,
        content: <SrmForm
          dataSet={record.dataSet}
          style="padding: 0 15px;"
          customizeType="detail"
          columns={this.getItemDetailsColumns}/>,
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
.create-receive-detail-scroll-el {
    height 100%;
    overflow-y scroll;
    overflow-x hidden;
    padding-bottom 35px;
    .create-receive-detail-button {
      margin-right 10px;
    }
  }
.line-filter {
  display flex;
  justify-content space-between;
  color var(--font-color-primary);
  font-size 18px;
  font-weight 600;
  padding 13px;
}
.srm-list-inspection-line {
  white-space break-spaces;
}
.bottom-receive-box {
  border-top: 1px solid #ddd;
  padding-top: 21px;
}

</style>
