<template>
  <div>
    <div id="drapable-area-img" class="image-list">
      <div
        v-for="(item, idx) in imageList"
        :key="item.mediaId"
        class="drag-item">
        <div v-show="!item.isLoading">
          <img :src="item.largeImagePath || item.mediaPath" >
          <div v-show="imageList.filter((i)=> !i.isLoading)?.length > 1" class="delete-icon">
            <img :src="CircleMinus" @click.stop.prevent="handleRemoveItem(idx)" >
          </div>
        </div>
        <div v-show="item.isLoading" class="loading-wrapper">
          <loading/>
        </div>
      </div>
      <div
        v-if="imageList.length < 9"
        class="upload-button"
        @click="handleUpload">
        <input
          ref="uploadImageRef"
          multiple
          hidden
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          @change="handleFileChange">
        <span class="srm-icon icon-camera" />
        <span class="description">{{
          $T("smpc.product.button.uploadImage").$D("上传图片")
        }}</span>
        <span>{{ imageList.length }}/{{ maxNum }}</span>
      </div>
    </div>
    <srm-button
      size="large"
      circle
      fill
      type="primary"
      class="fixed-btn"
      @click="handleSave">
      {{ $T("hzero.common.button.ok").$D("确定") }}
    </srm-button>
  </div>
</template>

<script>
import { $T, SrmUtil } from "srm-mobile-ui";
import Sortable from "sortablejs";
// import EXIF from "exif-js";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import uuid from "uuid";
import Loading from "../../../../components/Loading.vue";
import { upload, fetchSaveImages } from "../api/index";
// import { rotateImg } from "../api/commonUtils";
// import NavHead from "../components/NavHead.vue";
import CircleMinus from "@/assets/circle-minus.svg";

export default {
  name: "ImageMaintain",
  modules: ["smpc.product", "hzero.common"],
  components: { Loading },
  data() {
    return {
      imageList: [],
      maxNum: 9,
      CircleMinus: CircleMinus,
    };
  },
  mounted() {
    this.imageList = (this.$route.params.dataList || []).filter((f) => f.mediaType !== 1);
    // eslint-disable-next-line no-new
    new Sortable(document.getElementById("drapable-area-img"), {
      animation: 150,
      delay: 350,
      handle: ".drag-item",
      onEnd: ({ newIndex, oldIndex }) => {
        //拖拽动作结束后执行
        this.imageList.splice(
          newIndex, // 第一个元素为主图， 不能拖拽
          0,
          this.imageList.splice(oldIndex, 1)[0]
        );
        let newArray = this.imageList.slice(0);
        this.imageList = [];
        const that = this;
        this.$nextTick(function () {
          that.imageList = newArray.map((m, idx) => ({
            ...m,
            orderSeq: idx + 1,
          }));
        });
      },
    });
  },
  methods: {
    handleSave() {
      const data = this.imageList;
      const { spuId, skuId } = this.$route.query;
      fetchSaveImages({
        tenantId: SrmUtil.getTenantId(),
        skuId,
        spuId,
        skuImageList: data?.map((m, index) => ({
          ...m,
          primaryFlag: Number(index === 0), // 默认第一张为主图
          mediaPath: m.mediaId ? m.largeImagePath : m.mediaPath,
        })) || [],
      }).then((res) => {
        if (res?.failed) {
          this.$notification.open({
            message: res?.message,
            duration: 1,
          });
          return;
        }
        const list = res || [];
        // 刷新图片列表
        this.imageList = this.getSortList(list);
        this.$notification.open({
          message: $T("hzero.common.notification.success").$D("操作成功"),
          duration: 1,
        });
        this.$router.replace({
          name: "ReceiveSkuDetail",
          query: this.$route.query
        });
      });
    },
    handleRemoveItem(idx) {
      this.imageList.splice(idx, 1);
    },
    handleUpload() {
      this.$refs.uploadImageRef.click();
    },
    handleFileChange(e) {
      const files = Array.from(e.target.files);
      // console.log('files', files)
      // 未上传
      if (files.length === 0) {
        return;
      }
      if (
        files.some(
          (s) =>
            !["image/png", "image/jpg", "image/jpeg"].includes(s.type) ||
            s.size > 1024 * 1024 * 30
        )
      ) {
        this.$notification.open({
          message: $T("smpc.product.view.helpInfo3").$D(
            "图片支持PNG、JPG、JPEG格式，且不能大于30M"
          ),
          duration: 1,
        });
        return;
      }
      if (this.imageList.length + files.length > 9) {
        this.$notification.open({
          message: $T("smpc.product.view.validation.maxImageNum").$D(
            "最多上传9张图片"
          ),
          duration: 1,
        });
        return;
      }
      this.imageList.push({ isLoading: true });
      upload(files)
        .then((res) => {
          const lastOrderSeq = this.imageList.length + 1;
          const addImgs = (res || []).map((f, idx) => ({
            mediaType: 0,
            mediaPath: f.imagePath,
            thumbnailPath: f.thumbnailPath,
            _imgUniqKey: uuid(),
            orderSeq: lastOrderSeq + idx,
          }));
          this.imageList.pop();
          this.imageList = this.imageList.concat(addImgs);
          e.target.value = null;
        })
        .catch(() => {
          this.imageList.pop();
          e.target.value = null;
        });
    },
    // handleIosImageDirection(files = []) {
    //   return files.map((file) => {
    //     console.log("file", file);
    //     // let Orientation = null;
    //     EXIF.getData(file, function () {
    //       let Orientation = EXIF.getTag(this, "Orientation");
    //       console.log("Orientation", Orientation, this, EXIF.getAllTags(this));
    //       if (/^image/.test(file.type)) {
    //         // 需处理旋转的情况
    //         if (Orientation && Orientation !== 1) {
    //           const reader = new FileReader();
    //           reader.readAsDataURL(file);
    //           reader.onload = function (e) {
    //             const image = new Image();
    //             image.src = e.target.result; // 加载图片 base64格式
    //             // 图片加载完后绘制，不然canvas绘制的图片有误
    //             image.onload = function () {
    //               // 图片原始宽高
    //               const expectWidth = this.naturalWidth;
    //               const expectHeight = this.naturalHeight;
    //               let canvas = document.createElement("canvas");
    //               // let ctx = canvas.getContext("2d");
    //               canvas.width = expectWidth;
    //               canvas.height = expectHeight;
    //               // ctx.drawImage(this, 0, 0, expectWidth, expectHeight); // 以画布左上角为原点绘制
    //               // 修复IOS(图片会自动旋转)
    //               if (navigator.userAgent.match(/iphone/i)) {
    //                 console.log("iphone");
    //                 switch (Orientation) {
    //                   case 6: // 旋转90度
    //                     rotateImg(this, "left", canvas);
    //                     break;
    //                   case 3: // 旋转180度
    //                     rotateImg(this, "right", canvas); //转两次
    //                     rotateImg(this, "right", canvas);
    //                     break;
    //                   case 8: // 旋转-90度
    //                     rotateImg(this, "right", canvas);
    //                     break;
    //                   default:
    //                     break;
    //                 }
    //                 return base64ToFile(
    //                   canvas.toDataURL(file.type, 1),
    //                   file.name,
    //                   file.type
    //                 );
    //               } else if (navigator.userAgent.match(/Android/i)) {
    //                 return file;
    //               }
    //               // ctx.restore();
    //               // document.getElementById("hh").src = canvas
    //               //   .toDataURL()
    //               //   .replace(/\r\n\s/g, "");
    //             };
    //           };
    //         } else {
    //           return file;
    //         }
    //       }
    //     });
    //   });
    // },
    getSortList(list) {
      const _list = list.sort((a, b) => a - b);
      return [
        ..._list.filter((f) => f.primaryFlag), // 主图在第一个位置
        ..._list.filter((f) => !f.primaryFlag),
      ];
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.image-list {
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    display: inline-block;
  }

  .drag-item {
    pointer-events: bounding-box;
    position: relative;
    width: 100px;
    height: 100px;

    .delete-icon {
      position: absolute;
      right: 4px;
      top: 4px;

      > img {
        display: inline-block;
        width: 20px;
        height: 20px;
      }
    }
  }

  .loading-wrapper {
    width: 100px;
    height: 100px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
}

.upload-button {
  width: 100px;
  height: 100px;
  background: #F6F6F6;
  border-radius: 8px;
  font-size: 12px;
  color: #AFAFAF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  >span {
    line-height: 16px;

    &.description {
      margin: 2px 0;
    }
  }
}

.fixed-btn {
  position: fixed;
  border-radius: 24px;
  bottom: 12px;
  margin: 0 15px;
  height: 48px;
  width: calc(100vw - 30px);
}
</style>
