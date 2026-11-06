/* eslint-disable */
const utils = require("eslint-plugin-vue/lib/utils");

module.exports = {
  meta: {
    docs: {
      description: "禁止使用AntDesign组件库",
      category: "no AntDesign lib",
      recommended: true,
    },
    fixable: "code",
    schema: [], // no options
  },
  create: function (context) {

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (node.name && node.name.startsWith("a-")) {
          return context.report({
            node,
            message: "禁止使用AntDesign组件库",
          });
        }
      }
    }, {});
  },
};

