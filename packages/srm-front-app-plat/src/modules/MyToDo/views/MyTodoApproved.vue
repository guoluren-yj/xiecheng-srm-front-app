<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="$router.replace('MyTodoList')">
        <img src="@/assets/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T("smbl.todo.view.todoApproved.title").$D("流程已审批") }}</div>
    </hips-nav-bar>
    <no-content
      img-src="NoOrder@3x.png"/>
  </hips-view>
</template>

<script>
import { Input, NavBar, Popup, View } from "hips";
import NoContent from "@/components/NoContent";

export default {
  modules: [ "smbl.todo" ],
  name: "MyTodoApproved",
  components: {
    NoContent,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  computed: {
  },
};
</script>

<style lang="stylus" scoped>
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: bold;
}

.right-button {
  margin-right: 8px;

  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

.headInfo {
  padding: 10px 20px 16px 20px;
  border-bottom: solid 8px var(--color-border-default);
  font-weight: bold;

  li {
    display: flex;
    margin-bottom: 4px;
    word-break: break-all;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      line-height: 24px;
      font-size: 16px;
      display: inline-block;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }
}
</style>
