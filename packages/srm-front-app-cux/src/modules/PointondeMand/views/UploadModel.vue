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
      <srm-list :data-set="mointDs" :columns="getColumns()" />
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
      <srm-attachment
        class="srmAtt"
        :attachment-uuid="uuids"
        display-type="grid"
        :camera-only="true"
        :compress-image="false"
        :cols="2"
        @fileUpload="handSave"/>
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
import { $T, SrmUtil } from "srm-mobile-ui";
import {
  saveApi,
  checkDeleteApi,
  checkSubmitApi,
  checkSaveApi,
} from "../api/index";

export default {
  modules: [ "hipspfm.common", "scux.PointondeMandDetails" ],
  name: "UploadModel",
  props: {
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
    records: {
      type: Object,
    },
  },
  data() {
    const user = SrmUtil.getUserInfo();
    const { id } = user;
    return {
      fileList: [],
      // asd: null,
      id,
    };
  },
  computed: {
    getHeaderInfoColumns() {
      return [
        {
          fieldCode: "uuids",
        },
      ];
    },
  },
  watch: {
    value(val) {
      if (!val) {
        this.fileList = [];
      }
    },
  },
  methods: {
    onfileUpload() {
      this.handSave();
    },
    getColumns() {
      return [
        {
          fieldCode: "uploadAddress",
          fieldType: "TEXT",
          disabled: false,
          render: (value) =>
            <span>
              {this.status === "look" ?
                value :
                this.locations && this.locations}
            </span>
          ,
        },
        this.status !== "look" && {
          fieldCode: "attributeVarchar1Meaning",
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
              // showInfo={true}
              cameraOnly={true}
              compressImage={false}
              onFileUpload={this.onfileUpload}
            />
          ,
        },
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
    async handleOpreation() {
      const list = { ...this.mointDs.data[0], uploadAddress: this.locations };
      const res = await checkSubmitApi(list);
      if (res && !res.failed) {
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
          disabled: this.mointDs.toData().length === 0,
          handler: this.handleOpreation,
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
    //       console.info("位置：", res);
    //     })
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
          uploadAddress: this.locations,
          journalPositionId: this.journalPositionId,
        }));
        await checkSaveApi([
          {
            ...this.records,
            // inspectorId: this.id,
          },
        ]);
        const res = await saveApi(saveArr);
        if (res && !res.failed) {
          this.$notification.open({
            message: $T("scux.MonitData.message.please.enter.handLeOk").$D(
              "保存成功"
            ),
            class: "notification",
          });
          this.mointDs.refresh();
        }
      } else {
        const resopen = await saveApi([
          {
            uploadAddress: this.locations,
            uploadUuid: this.uuids,
            journalPositionId: this.journalPositionId,
          },
        ]);
        await checkSaveApi([
          {
            ...this.records,
            // inspectorId: this.id,
          },
        ]);
        if (resopen && !resopen.failed) {
          this.$notification.open({
            message: $T("scux.MonitData.message.please.enter.handLeOk").$D(
              "保存成功"
            ),
            class: "notification",
          });
          this.mointDs.refresh();
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
  margin-top: 30px;
  margin-left: 20px;
}

.divs {
  height: 50px;
}
</style>
