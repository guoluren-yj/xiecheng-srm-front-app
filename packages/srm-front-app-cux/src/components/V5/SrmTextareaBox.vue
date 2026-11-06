<template>
  <div class="textarea-box">
    <div v-if="rowName" class="textarea-title">
      {{ rowName }}
    </div>
    <div class="textarea-context">
      <textarea
        :id="id"
        :name="name"
        :cols="cols"
        :rows="rows"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="change"/>

      <div class="icon-box">
        <em v-if="!disabled" :class="`srm-icon ${iconEdit}`" />
        <em v-else/>
        <em :class="`srm-icon ${iconView}`" />
      </div>
    </div>
  </div>
</template>
<script>
/**
 * SrmListTextarea 文本框组件
 * @author ZLH
 * @date 2021-02-26
 * @version 1.0
 *
 * value：Textarea绑定值
 * rowName：Textarea行名称
 * disabled：规定禁用文本区域
 * placeholder：规定一个简短的提示，描述文本区域期望的输入值
 * id:规定元素的唯一 id
 * name：规定文本区的名称
 * cols：规定文本区域内可见的宽度
 * rows：规定文本区域内可见的行数
 */
export default {
  name: "SrmTextareaBox",
  props: {
    value: {
      type: String,
    },
    rowName: {
      type: String,
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String | Number,
    },
    cols: {
      type: String | Number,
    },
    rows: {
      type: String | Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder:{
      type: String | Number,
    },
  },
  data() {
    return {
      iconEdit: "icon-edit",
      iconView: "icon-textmore3x",
    };
  },
  methods: {
    change(e) {
      this.$emit("input", e.target.value);
      console.log(e.target.value, 99999);
    },
  },
};
</script>

<style lang="stylus" scoped>
.textarea-box {
  padding: 16px 0px 16px 0;
  width: 100%;
  border-top: 1px solid #f6f6f6;

  .textarea-title {
    color: #AFAFAF;
    font-size: 12px;
    line-height: 16px;
  }

  .textarea-context {
    display: flex;
    height: 64px;
    margin-top: 8px;
    border-radius: 8px;
    width: 100%;
    background: var(--color-bg-default-b);

		> textarea {
			border: 0; // 去除未选中状态边框
			outline: none; // 去除选中状态边框
			background-color: rgba(0, 0, 0, 0); // 透明背景
			font-size: 14px;
			width: 100%;
			height: 100%;
			padding: 12px;
			color: #1f1f1f;
			resize: none;
			line-height: 20px;
		}

		textarea:disabled, textarea[disabled] {
			-webkit-opacity: 0.22;
			opacity: 0.22;
			color: var(--color-font-default) !important;
		}

    .textarea-line{
      flex: 1;
    }
  }
}

.srm-textarea {
  > textarea {
    border: 0; // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0); // 透明背景
    font-size: 14px;
    width: 100%;
    height: 100%;
    padding: 12px;
    color: #1f1f1f;
    resize: none;
    line-height: 20px;
  }

  textarea:disabled, textarea[disabled] {
    -webkit-opacity: 0.22;
    opacity: 0.22;
    color: var(--color-font-default) !important;
  }
}

.icon-box {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 3px;
  color #1F1F1F;

  .srm-icon {
		padding: 5px;
    font-size 20px;
  }
  font-size 12px;
}
</style>