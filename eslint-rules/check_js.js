/* eslint-disable */

function checkChineseToken(context, node) {
  if (typeof node.value === "string" && /[\u4e00-\u9fa5]/.test(node.value)) {
    if (node.parent && node.parent.key && node.parent.key && node.parent.key.name === "fieldName") {
      //如果是fieldName
      const obj = node.parent.parent;
      if (obj && obj.properties) {
        let fieldName = node.value;
        let langCode = null;
        let langCodeNode = null;
        obj.properties.forEach((e) => {
          if (e.key && e.key.name === "langCode") {
            langCode = e.value && e.value.value;
            langCodeNode = e;
          }
        });
        return context.report({
          node,
          message: "请使用$T方法合并多语言",
          fix(fixer) {
            const result = [ fixer.replaceTextRange(node.range, `$T("${langCode || ""}").$D("${fieldName}")`) ];
            if (langCodeNode) {
              result.push(fixer.replaceTextRange([ langCodeNode.range[0], langCodeNode.range[1] + 1 ], ""));
            }
            return result;
          }
        });
      }
    }
    context.report({
      node,
      message: "请使用多语言",
    });
  }
}

module.exports = {
  meta: {
    docs: {
      description: "多语言模块检查",
      category: "Multiple Language Check",
      recommended: true,
    },
    fixable: "code",
    schema: [], // no options
  },
  create: function (context) {
    const filename = context.getFilename();
    if (!filename.endsWith(".js") || filename.indexOf("router") > -1) {
      return {};
    }
    return {
      //html变量标签值
      Literal(node) {
        if (node.parent && node.parent.type === "CallExpression" &&
          node.parent.callee && node.parent.callee.type === "MemberExpression" &&
          node.parent.callee.property && node.parent.callee.property.type === "Identifier" &&
          [ "$D", "log", "error", "warn", "info", "debug" ].includes(node.parent.callee.property.name)) {
          return;
        }
        checkChineseToken(context, node);
      },
      CallExpression(node) {
        if (node.callee && node.callee.name === "$T") {
          if (node.parent && node.parent.property && node.parent.property.name === "$D") {
            return;
          }
          context.report({
            node,
            message: "$T方法后面必须接$D",
          });
        }
      },
      "Program:exit"(/* node */) {
        const globalScope = context.getScope();
        const options = context.options[0];
        const considerTypeOf = options && options.typeof === true || false;

        function hasTypeOfOperator(node) {
          const parent = node.parent;

          return parent.type === "UnaryExpression" && parent.operator === "typeof";
        }

        globalScope.through.forEach((ref) => {
          const identifier = ref.identifier;
          if (!considerTypeOf && hasTypeOfOperator(identifier)) {
            return;
          }
          if (identifier.name !== "$T") {
            return;
          }
          context.report({
            node: identifier,
            message: "请引入$T",
            fix: (fixer) => fixer.replaceTextRange([ 0, 0 ], "import { $T } from \"srm-mobile-ui\";\n")
          });
        });
      }
    };
  },
};

