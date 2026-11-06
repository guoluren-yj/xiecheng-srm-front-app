<template>
  <div class="member">
    <base-header :title="$T('smbl.chat.model.room.groupMemberLength',[memberInfo.members.length]).$D(`群成员（${memberInfo.members.length}）`)"
                 show-back />
    <div class="search-top">
      <div class="search-wrap">
        <input-field v-model="searchValue"
                     :placeholder="$T('smbl.chat.view.placeholder.groupMember').$D('搜索群成员')"
                     :show-icon="false" />
      </div>
      <div @click="onCancelClick">{{ $T('smbl.app.model.default.Cancel').$D('取消') }}</div>
    </div>
    <div class="member-count">
      {{ $T("smbl.chat.view.info.groupMember", [currentMemberInfo.length, currentMemberInfo.supplierLength]).$D("共 {all} 人，含 {supplier} 位供应商联系人") }}
    </div>
    <div class="member-list">
      <div v-for="member in currentMemberInfo.list"
           :key="member.id"
           :class="['member-item', { ['member-item-pur']: member.isPurchase }]">
        <div class="member-info">
          <span v-if="member.displayName"
                class="member-name">{{ member.displayName }}</span>
          <span v-if="member.companyName"
                class="member-company">{{ `@${member.companyName}` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BaseHeader from "@/modules/ChatRoom/components/BaseHeader";
import InputField from "@/modules/ChatRoom/components/form/InputField";

export default {
  name: "RoomMember",
  modules: ["smbl.chat", "smbl.app"],
  components: {
    BaseHeader,
    InputField,
  },
  data() {
    return {
      searchValue: "",
    };
  },
  computed: {
    ...mapGetters({
      memberInfo: "ChatRoom/memberInfo",
    }),
    currentMemberInfo() {
      const _currentMemberInfo = {
        list: this.memberInfo.members,
        length: this.memberInfo.members.length,
        supplierLength: this.memberInfo.supplierMembers.length,
      };
      if (this.searchValue) {
        const list = [];
        let supplierLength = 0;
        this.memberInfo.members.forEach((member) => {
          if (!member.displayName.includes(this.searchValue)) {
            return;
          }
          if (!member.isPurchase) {
            supplierLength++;
          }
          list.push(member);
        });
        _currentMemberInfo.list = list;
        _currentMemberInfo.length = list.length;
        _currentMemberInfo.supplierLength = supplierLength;
      }
      return _currentMemberInfo;
    },
  },
  mounted() {},
  methods: {
    onCancelClick() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>
.member {
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
  }

  .member-count {
    padding: 16px 20px 4px 20px;
    font-size: 12px;
    color: #AFAFAF;
    line-height: 20px;
  }

  .member-list {
    flex: 1;
    overflow: auto;

    .member-item {
      padding: 7px 20px;
      display: flex;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 0;
        height: 1px;
        background: #F6F6F6;
      }

      .member-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        line-height: 24px;
        overflow: hidden;

        .member-name {
          margin-bottom: 4px;
          font-size: 16px;
        }

        .member-company {
          color: #FFC043;
          line-height: 16px;
          font-size: 12px;
          white-space: pre-wrap;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
