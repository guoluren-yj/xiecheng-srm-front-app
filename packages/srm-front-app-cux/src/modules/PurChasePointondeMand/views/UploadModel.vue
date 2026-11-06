<template>
  <srm-popup
    style="height: 100vh; overflow-y: auto"
    :visible="uploadFlag"
    height="100%"
    width="100%"
    position="right"
    show-back
    :title="
      status === 'uploading'
        ? $T('hipspfm.common.message.uploadAttanchment').$D('附件上传')
        : $T('hipspfm.common.message.uploadAttanchmentLook').$D('附件查看')
    "
    @onClose="uploadClose">
    <div v-if="mointDs.data.length > 0 || status === 'look'">
      <srm-list
        :data-set="mointDs"
        :columns="status === 'uploading' ? getColumns() : gethistoryColumns()"/>
    </div>
    <div v-else>
      <div class="orientation">
        {{
          `${
            $T("scux.PointondeMandDetails.button.locations").$D("定位:") +
            locations
          }`
        }}
      </div>

      <srm-form :data-set="quethtionDs" :columns="getWtBZColumns()" />

      <!-- <srm-lov-field
        class="orientations"
        size="large"
        :options="{
          multiple: true,
          callBack: (val, valueField, displayField, ds) => {
            console.log(val, valueField, displayField, ds);
            asd=val[0];
          },
        }"
        select-type="select"
        :value="asd"
        v-model="asd"
        code="WTBZ"
        placeholder="备注"
      >
        <span slot="left">问题备注:</span>
      </srm-lov-field> -->
      <srm-attachment
        class="srmAtt"
        :attachment-uuid="uuids"
        display-type="grid"
        :compress-image="false"
        :cols="2"/>
      <!-- <srm-lov-field rounded size="large" :options="{multiple: true}" select-type="select"  :value="asd" v-model="asd" code="WTBZ" placeholder="备注">
        <span slot="left">问题备注:</span>
      </srm-lov-field> -->
    </div>
    <div v-if="status === 'uploading'" class="divs" />
    <srm-bottom-handler
      v-if="status === 'uploading'"
      :btn-arr="bottomBtn()"
      type="tooltip"/>
  </srm-popup>
</template>

<script>
import { $T, DataSet, SrmUtil } from "srm-mobile-ui";
import {
  saveApi,
  checkDeleteApi,
  checkSubmitApi,
  checkSaveApi,
  uploadApi,
} from "../api/index";
import { isEmpty } from "@/utils/index";
import { wtbzData } from "../datasource/index";
export default {
  modules: [
    "hipspfm.common",
    "scux.PointondeMandDetails",
    "scux.PointondeMandList",
    "scux.PurChasePointondeMandList",
    "scux.PurChaseMandPlaceList",
    "scux.Province",
    "scux.City",
    "scux.MonitData",
    "scux.PurChasePointondeMandDetails",
  ],
  name: "UploadModel",
  props: {
    queryLis: {
      type: Object,
    },
    attachmentUuid: {
      type: String,
      default: "",
    },
    bucketName: {
      type: String,
      default: "private-bucket",
    },
    value: {
      type: Boolean,
      default: true,
    },
    uploadFlag: {
      type: Boolean,
    },
    journalPositionId: {
      type: String,
    },
    mointDs: {
      type: Object,
    },
    status: {
      type: String,
    },
    listUpload: {
      type: Object,
    },
    uuids: {
      type: String,
      default: "",
    },
    locations: {
      type: String,
      default: "",
    },
    supplierId: {
      type: String,
    },
    inspectId: {
      type: String,
    },
    createId: {
      type: String,
    },
    records: {
      type: Object,
    },
  },
  data() {
    const quethtionDs = new DataSet(wtbzData());
    const user = SrmUtil.getUserInfo();
    const { id } = user;
    return {
      fileList: [],
      asd: null,
      quethtionDs,
      id: Number(id),
    };
  },
  computed: {},
  watch: {
    value(val) {
      if (!val) {
        this.fileList = [];
      }
    },
  },
  created() {
    this.quethtionDs.create({}, 0);
  },
  methods: {
    getColumns() {
      return [
        {
          fieldCode: "uploadAddress",
          fieldType: "TEXT",
          disabled: false,
        },
        !isEmpty(this.inspectId) ?
          (this.id === Number(this.createId) ||
              this.id === Number(this.inspectId)) && {
            fieldCode: "attributeVarchar1",
          } :
          {
            fieldCode: "attributeVarchar1",
          },
        !isEmpty(this.inspectId) ?
          (this.id === Number(this.createId) ||
              this.id === Number(this.inspectId)) && {
            fieldCode: "uploadUuid",
            fieldType: "TEXT",
            render: (value) =>
              <srm-attachment
                attachment-uuid={value}
                display-type="grid"
                readonly={this.status === "look"}
                cols={2}
                // showInfo={true}
                // cameraOnly={true}
                compressImage={false}
              />
            ,
          } :
          {
            fieldCode: "uploadUuid",
            fieldType: "TEXT",
            render: (value) =>
              <srm-attachment
                attachment-uuid={value}
                display-type="grid"
                readonly={this.status === "look"}
                cols={2}
                // showInfo={true}
                // cameraOnly={true}
                compressImage={false}
              />
            ,
          },
        // this.status === "uploading" || !isEmpty(this.inspectId) ?
        //    (this.id === Number(this.createId) ||
        //       this.id === Number(this.inspectId)) && {
        //       fieldCode: "attributeVarchar1",
        //     }
        //   : {
        //       fieldCode: "attributeVarchar1",
        //     },
        // this.status !== "look" || !isEmpty(this.inspectId)
        //   ? (this.id === Number(this.createId) ||
        //       this.id === Number(this.inspectId)) && {
        //       fieldCode: "uploadUuid",
        //       fieldType: "TEXT",
        //       render: (value) => (
        //         <srm-attachment
        //           attachment-uuid={value}
        //           display-type="grid"
        //           readonly={this.status === "look"}
        //           cols={2}
        //           // showInfo={true}
        //           // cameraOnly={true}
        //           compressImage={false}
        //           onFileUpload={this.onfileUpload}
        //         />
        //       ),
        //     }
        //   : {
        //       fieldCode: "uploadUuid",
        //       fieldType: "TEXT",
        //       render: (value) => (
        //         <srm-attachment
        //           attachment-uuid={value}
        //           display-type="grid"
        //           readonly={this.status === "look"}
        //           cols={2}
        //           // showInfo={true}
        //           // cameraOnly={true}
        //           compressImage={false}
        //           onFileUpload={this.onfileUpload}
        //         />
        //       ),
        //     },
        // {
        //   fieldCode: "uploadAddress",
        //   fieldType: "TEXT",
        //   disabled: false,
        //   render: (value, record, _, records) => {
        //     if (this.status === "uploading") {
        //       return (
        //         <div class="icons" style="width:200px;overflow: hidden;">
        //           <srm-tooltip
        //             style="width:135px;overflow: hidden;"
        //             class="locations"
        //             title={value}
        //             placement="top"
        //           >
        //             <span>{value}</span>
        //           </srm-tooltip>
        //           <span
        //             style="width:50px;overflow: hidden;"
        //             class="srm-icon icon-trash"
        //             onClick={() => this.onDelete(record, records)}
        //           ></span>
        //         </div>
        //       );
        //     }
        //     return <span>{value}</span>;
        //   },
        // },
      ];
    },
    gethistoryColumns() {
      return [
        {
          fieldCode: "uploadAddress",
          fieldType: "TEXT",
          disabled: false,
        },
        {
          fieldCode: "uploadUuid",
          fieldType: "TEXT",
          render: (value) =>
            <srm-attachment
              attachment-uuid={value}
              display-type="grid"
              readonly={this.status === "look"}
              cols={2}
              compressImage={false}
            />
          ,
        },
      ];
    },
    getWtBZColumns() {
      return [
        {
          fieldCode: "attributeVarchar1",
        },
      ];
    },
    async handleOpreation(type) {
      let arr = [];
      uploadApi({ ...this.queryLis, page: 0, size: 10 }).then(async (res) => {
        arr = res;
        if (res && res.content[0]) {
          const formValdata = type === "update" ? await this.mointDs.validate() : await this.quethtionDs.validate();
          if (formValdata) {
            const list = {
              ...arr.content[0],
              // uploadAddress: this.locations,
              attributeVarchar1Meaning: arr.content[0].attributeVarchar1Meaning,
            };
            const ress = await checkSubmitApi(list);
            if (ress && !ress.failed) {
              this.$notification.open({
                message: $T(
                  "scux.PointondeMandDetails.message.please.enter.handLeOks"
                ).$D("操作成功"),
                class: "notification",
              });
              this.listUpload.refresh();
              this.$emit("uuid", "");
              this.$emit("uploads", false);
            }
          } else {
            this.$notification.open({
              message: $T("scux.MonitData.message.please.enter.wtwarning").$D(
                "问题备注字段必输"
              ),
              class: "notification",
            });
          }
        }
      });
    },
    bottomBtn() {
      return [
        // {
        //   text: $T("scux.MonitData.button.add").$D("新增"),
        //   type: "primary",
        //   fill: true,
        //   bordered: true,
        //   visible: true,
        //   handler: this.handAdd,
        // },
        // {
        //   text: $T("scux.MonitData.button.save").$D("保存"),
        //   type: "primary",
        //   fill: true,
        //   bordered: true,
        //   visible: true,
        //   handler: this.handSave,
        // },
        {
          text: $T("scux.PointondeMandDetails.button.submit").$D("提交"),
          type: "primary",
          fill: true,
          bordered: true,
          visible: true,
          // disabled: this.mointDs.toData().length === 0,
          handler: this.handSave,
        },
      ];
    },
    handleChange(file) {
      this.fileList.push(file);
    },
    uploadClose() {
      this.$emit("uploads", false);
      this.mointDs.reset();
    },
    // handAdd() {
    //   this.$geoLocation()
    //     .then((res) => {
    //       this.mointDs.create({ uploadAddress: res.addr });
    //       console.info("位置
    //     .catch((err) => {
    //       console.info("定位错误：", err);
    //     });
    // },
    async onDelete(record, records) {
      if (record.journalMaterialId) {
        const { journalMaterialId = "" } = record;
        const res = await checkDeleteApi([ journalMaterialId ]);
        if (res && !res.failed) {
          this.$notification.open({
            message: $T("scux.MonitData.message.please.enter.deleteOk").$D(
              "刪除成功"
            ),
            class: "notification",
          });
          this.mointDs.refresh();
        }
      } else {
        this.mointDs.removeLocalRecords([ records ]);
      }
    },
    async handSave() {
      if (this.mointDs.data.length > 0) {
        const saveArr = this.mointDs.data.map((item) => ({
          ...item,
          journalPositionId: this.journalPositionId,
          sourceFrom: "MOBILE", //区分保存 (移动端 pc端)
        }));
        const obj = {
          uploadUuid: this.uuids,
          ...this.records,
          attributeVarchar1: this.mointDs.toData()[0].attributeVarchar1,
          attributeVarchar1Meaning:
            this.mointDs.toData()[0].attributeVarchar1Meaning,
        };
        const resSub = await checkSaveApi([ obj ]);
        const res = await saveApi(saveArr);
        if (res && !res.failed && resSub && !res.resSub) {
          this.mointDs.refresh();
          this.handleOpreation("update");
        }
      } else {
        const obj = {
          uploadUuid: this.uuids,
          ...this.records,
          attributeVarchar1: this.quethtionDs.toData()[0].attributeVarchar1,
          attributeVarchar1Meaning: this.quethtionDs.toData()[0].attributeVarchar1Meaning,
        };
        const resopen = await checkSaveApi([ obj ]);
        const objs = {
          journalPositionId: this.journalPositionId,
          uploadUuid: this.uuids,
          sourceFrom: "MOBILE",
        };
        const resubmit = await saveApi([ objs ]);
        if (resopen && !resopen.failed && resubmit && !resubmit.failed) {
          this.mointDs.refresh();
          this.handleOpreation("new");

        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.right-button {
  img {
    height: 24px;
    width: 24px;
  }
}

.uploadWrap {
  padding: 10px 18px;
}

.header {
  font-size: 18px;
  font-weight: bold;
  line-height: 26px;
}

>>>.srm-attachment {
  width: auto;
  background: transparent;
}

.icons {
  display: flex;
  justify-content: space-between;
}

.orientation {
  margin-top: 30px;
  margin-left: 20px;
}

.srmAtt {
  margin-top: -35px;
  margin-left: 20px;
}

.divs {
  height: 50px;
}
</style>
