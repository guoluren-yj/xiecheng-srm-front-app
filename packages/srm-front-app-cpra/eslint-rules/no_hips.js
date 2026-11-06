/* eslint-disable */
const utils = require("eslint-plugin-vue/lib/utils");

module.exports = {
  meta: {
    docs: {
      description: "禁止使用hips组件库",
      category: "no hips lib",
      recommended: true,
    },
    fixable: "code",
    schema: [], // no options
  },
  create: function (context) {

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (node.name && node.name.startsWith("hips")) {
          return context.report({
            node,
            message: "禁止使用hips组件库",
          });
        }
      }
    }, {
      Identifier(node) {
        if (node.name === "$hips") {
          return context.report({
            node,
            message: "禁止使用hips组件库",
          });
        }
      },
    });
  },
};

