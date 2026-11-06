/**
 * 禁止使用domPropsInnerHTML
 */
/* eslint-disable */

module.exports = {
  meta: {
    docs: {
      description: "禁止使用domPropsInnerHTML",
      categories: [ "no domPropsInnerHTML" ],
    },
    fixable: "code",
    schema: []
  },
  create(context) {
    return {
      JSXAttribute: function JSXAttribute(attribute) {
        if (attribute.name.name === "domPropsInnerHTML") {
          context.report({
            node: attribute,
            message: "禁止使用domPropsInnerHTML",
          });
        }
      }
    };
  },
};
