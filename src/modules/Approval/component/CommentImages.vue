<template>
  <div
    v-if="images.length"
    class="comment-images-wrap"
    :style="{ justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }">
    <div class="comment-images">
      <div
        v-for="(image, index) in images"
        :key="image.fileId || index"
        class="comment-images-item"
        @click.stop="handlePreview(index)">
        <img :src="image.src" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { getFileApi } from "../api";

const IMAGE_EXT = [ "jpg", "jpeg", "png", "gif", "bmp", "webp" ];

export default {
  name: "CommentImages",
  props: {
    attachmentUuid: {
      type: String,
      default: null,
    },
    bucketName: {
      type: String,
      default: "private-bucket",
    },
    align: {
      type: String,
      default: "left",
    },
  },
  data() {
    return {
      images: [],
    };
  },
  watch: {
    attachmentUuid: {
      handler(val) {
        this.fetchImages(val);
      },
      immediate: true,
    },
  },
  methods: {
    isImageFile(file = {}) {
      const type = file.fileType || "";
      if (type.startsWith("image")) {
        return true;
      }
      const name = file.fileName || file.fileUrl || "";
      const ext = name.split(".").pop().toLowerCase();
      return IMAGE_EXT.includes(ext);
    },
    fetchImages(attachmentUuid) {
      if (!attachmentUuid) {
        this.images = [];
        return;
      }
      getFileApi(attachmentUuid).then((res) => {
        if (res && res.length) {
          this.images = res.filter(this.isImageFile).map((file) => ({
            ...file,
            src: this.buildImgUrl(file.fileUrl, file.bucketName || this.bucketName),
          }));
        } else {
          this.images = [];
        }
      });
    },
    handlePreview(index) {
      this.$previewImage(this.images.map((image) => image.src), { index, showClose: true });
    },
  },
};
</script>

<style lang="stylus" scoped>
.comment-images-wrap {
  display: flex;
  max-width: 100%;
  margin-top: 6px;
}
.comment-images {
  display: flex;
  flex-wrap: nowrap;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}
.comment-images-item {
  flex: none;
  width: 72px;
  height: 72px;
  margin-right: 6px;
  border-radius: 4px;
  overflow: hidden;
  background: #f2f3f5;

  &:last-child {
    margin-right: 0;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>
