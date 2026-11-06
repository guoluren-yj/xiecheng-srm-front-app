<template>
  <div class="record-search">
    <div class="search-top">
      <div class="search-wrap">
        <input-field v-model="searchValue"
                     :placeholder="$T('smbl.chat.view.placeholder.records').$D('搜索聊天记录')"
                     :show-icon="false" />
      </div>
      <div v-if="searchValue"
           class="search-to-btn"
           @click="onSearchClick">
        {{ $T('smbl.app.model.default.Search').$D('搜索') }}
      </div>
      <div v-else
           @click="onCancelClick">
        {{ $T('smbl.app.model.default.Cancel').$D('取消') }}
      </div>
    </div>
    <div class="search-type-list">
      <div v-for="type in searchTypeList"
           :key="type.type"
           class="search-type-item"
           @click="onSearchTypeClick(type.type)">
        {{ type.label }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import InputField from "@/modules/ChatRoom/components/form/InputField";

export default {
  name: "RecordSearch",
  modules: ["smbl.chat", "smbl.app"],
  components: {
    InputField,
  },
  data() {
    return {
      searchValue: "",
      searchTypeList: [
        { type: "image", label: this.$T("smbl.chat.view.button.imageMessageTab").$D("图片") },
        { type: "file", label: this.$T("smbl.chat.view.button.fileMessageTab").$D("文件") },
      ],
    };
  },
  computed: {
    ...mapGetters({
      searchTextValue: "ChatRoom/getSearchTextValue",
    }),
  },
  beforeMount() {
    this.$store.commit("ChatRoom/setSearchTextValue", "");
  },
  mounted() {},
  destroy() {
    this.$store.commit("ChatRoom/setSearchTextValue", "");
  },
  methods: {
    onCancelClick() {
      this.$router.back();
    },
    onSearchClick() {
      this.$store.commit("ChatRoom/setSearchTextValue", this.searchValue);
      this.$router.push({ name: "TextRecordList" });
    },
    onSearchTypeClick(type) {
      const name = { file: "FileRecordList", image: "ImageRecordList" }[type];
      this.$router.push({ name: name || "MemberRecordList", params: { type } });
    },
  },
};
</script>

<style lang="stylus" scoped>
.record-search {
  height: 100vh;
  width: 100vw;
  color: #333;
  font-weight: 400;
  display: flex;
  flex-direction: column;

  .search-top {
    display: flex;
    align-items: center;
    padding-right: 20px;

    .search-wrap {
      flex: 1;
      margin: 4px 20px;
      padding: 4px 0;
      background-color: #F6F6F6;
      border-radius: 4px;
      overflow: hidden;
    }

    .search-to-btn {
      color: #276ef1;
    }
  }

  .search-type-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 32px;

    .search-type-item {
      width: 33.33%;
      color: #276EF1;
      text-align: center;
      line-height: 24px;
      margin-bottom: 24px;
      position: relative;

      &:nth-child(3n+2) {
        &::before, &::after {
          content: '';
          position: absolute;
          top: 6px;
          bottom: 6px;
          width: 1px;
          background-color: #F6F6F6;
        }

        &::before {
          left: 0;
        }

        &::after {
          right: 0;
        }
      }
    }
  }
}
</style>
