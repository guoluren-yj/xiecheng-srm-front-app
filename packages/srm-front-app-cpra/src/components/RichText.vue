<template>
    <div v-html="val" class="check-remark-str" aria-live="polite" @click='previewRemarkImg'>    
    </div>
  </template>
  
<script>
  export default {
    props: {
      val:''
    },
    methods:{
      previewRemarkImg(e) {
      // 清除文本选择
      if (window.getSelection) {
        window.getSelection().removeAllRanges()
      } else if (document && document.selection) {
        document.selection.empty()
      }
      // 1.点击元素为a标签：直接插入视频链接，未对链接进行修改的情况
      // 2.点击元素的第一级父节点为a标签：插入视频链接，修改链接字体颜色/背景色的情况
      // 3.点击元素的第二级父节点为a标签：插入视频链接，修改链接字体颜色&背景色的情况
      const parentElement = e.target.parentElement;
      const videoHref = e.target.tagName === 'A' ? 
      e.target.href : parentElement && parentElement.tagName === 'A' ?
      parentElement.href : parentElement && parentElement.parentElement && parentElement.parentElement.tagName === 'A' ?
      parentElement.parentElement.href : "";
      if (videoHref) {
        const url=  videoHref.toLowerCase();
        const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|flv|m3u8|mpd)(\?.*)?$/;
        if(!videoExtensions.test(url.split('#')[0])){
          return;
        }
        e.preventDefault();
        this.$popup({
          title: "视频预览",
          showHeader: true,
          showClose: true,
          position: "bottom",
          showBack: true,
          content: <video 
            controls
            playsinline
            webkit-playsinline
            x-webkit-airplay="allow"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            style="width:100%;"
            poster="封面图.jpg"
          >
            <source src={videoHref} type="video/mp4" />
          </video>,
        });
      }
      if (e.target.src) {
        const imageArr = e.currentTarget.getElementsByTagName("img");
        let imageSrcArr = [];
        for (let i = 0; i < imageArr.length; i++) {
          if (imageArr[i]?.src) {
            imageSrcArr.push(imageArr[i]?.src);
          }
        }
        const indexSrc = imageSrcArr.findIndex((item) => item === e.target.src) || 0;
        this.$previewImage(imageSrcArr, { index: indexSrc, showClose: true, });
      }
      e.stopPropagation();
    },
    },
  };
</script>
<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl";
.check-remark-str {
  font-weight: 400;
  white-space: normal;
  -webkit-touch-callout: default !important;
  user-select: auto !important;
  >>> img{
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
  >>> #srm-popovers {
    display: none;
  }
  >>> strong {
    font-weight: bolder !important;
  }
  >>> *:not(img) {
    -webkit-touch-callout: default !important;
    user-select: auto !important; 
  }
}
</style>