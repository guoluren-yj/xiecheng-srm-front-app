/* eslint-disable */

const resolve = require("resolve");
const path = require("path");
const fs = require("fs");
const stripImportPathParams = require("eslint-plugin-node/lib/util/strip-import-path-params");
const getResolvePaths = require("eslint-plugin-node/lib/util/get-resolve-paths");
//const getTryExtensions = require("eslint-plugin-node/lib/util/get-try-extensions");
const utils = require("eslint-plugin-vue/lib/utils");

function check$TLangModule(context, node, args, modules, modulesNode, vueNode) {
  if (!args || !args.length) {
    context.report({
      node,
      message: "$T方法至少需要一个参数"
    });
    return;
  }
  if (args.indexOf(" ") >= 0) {
    context.report({
      node,
      message: "code参数不能包含空格"
    });
    return;
  }
  const langCode = args[0].value;
  if (!langCode) {
    context.report({
      node,
      message: "$T的第一个参数不能为空"
    });
    return;
  }
  const langCodes = langCode.split(".");
  if (langCodes.length < 3) {
    context.report({
      node,
      message: "多语言code最少包含2个.分隔符"
    });
    return;
  }
  const langModule = `${langCodes[0]}.${langCodes[1]}`;
  if (langModule && !modules.includes(langModule)) {
    context.report({
      node,
      message: `请添加多语言模块${langModule}至modules`,
      fix(fixer) {
        if (modulesNode) {
          modules.push(langModule);
          return fixer.replaceTextRange(modulesNode.range, `modules: ${JSON.stringify(modules)}`);
        }
        if (vueNode) {
          modules.push(langModule);
          return fixer.replaceTextRange([ vueNode.declaration.start, vueNode.declaration.start + 1 ], ` { \n  modules: ${JSON.stringify(modules)},`);
        }
        return null;
      }
    });
  }
}

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
            const result = [ fixer.replaceTextRange(node.range, `this.$T("${langCode || ""}").$D("${fieldName}")`) ];
            if(langCodeNode) {
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

function getFilePath(isModule, id, options) {
  try {
    return resolve.sync(id, options);
  } catch (_err) {
    if (isModule) {
      return null;
    }
    return path.resolve(options.basedir, id);
  }
}

function getParent(node) {
  let parent = node.parent;
  while (parent.type === "TSAsExpression") {
    parent = parent.parent;
  }
  return parent;
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
    const basedir = path.dirname(path.resolve(filename));
    const paths = getResolvePaths(context, 100);
    const extensions = [ ".vue", ".js" ];
    const options = { basedir, paths, extensions };
    let modulesNode = null;
    let vueNode = null;
    const modules = [];
    const importModules = new Map();
    if (!filename.endsWith(".vue")) {
      return {};
    }
    let importNode = null;
    return utils.defineTemplateBodyVisitor(context, {
      //html标签内
      VText(node) {
        checkChineseToken(context, node);
      },
      //html标签属性值
      VLiteral(node) {
        checkChineseToken(context, node);
      },
      //html变量标签值
      Literal(node) {
        if (node.parent && node.parent.type === "CallExpression" &&
          node.parent.callee && node.parent.callee.type === "MemberExpression" &&
          node.parent.callee.property && node.parent.callee.property.type === "Identifier" &&
          [ "$D" , "log", "error", "warn" , "info", "debug"].includes(node.parent.callee.property.name)) {
          return;
        }
        checkChineseToken(context, node);
      },
      CallExpression(node) {
        if (node.callee.name === "$T") {
          check$TLangModule(context, node, node.arguments, modules, modulesNode, vueNode);
          if (node.parent && node.parent.property && node.parent.property.name === "$D") {
            return;
          }
          context.report({
            node,
            message: "$T方法后面必须接$D",
          });
        }
      }
    }, {
      Literal(node) {
        if (node.parent && node.parent.type === "CallExpression" &&
          node.parent.callee && node.parent.callee.type === "MemberExpression" &&
          node.parent.callee.property && node.parent.callee.property.type === "Identifier" &&
          [ "$D" , "log", "error", "warn" , "info", "debug"].includes(node.parent.callee.property.name)) {
          return;
        }
        checkChineseToken(context, node);
      },
      ImportDeclaration(node) {
        importNode = importNode || node;
        const sourceNode = node.source;
        if (
          node.type === "ImportExpression" &&
          sourceNode &&
          sourceNode.type !== "Literal"
        ) {
          return;
        }
        const name = sourceNode && stripImportPathParams(sourceNode.value);
        if (name && !resolve.isCore(name)) {
          const isModule = !/^(?:[./\\]|\w+:)/u.test(name);
          const filePath = getFilePath(isModule, name, options);
          if (filePath && (filePath.endsWith(".js") || filePath.endsWith(".vue")) && filePath.indexOf("node_modules") < 0) {
            const text = fs.readFileSync(filePath, "utf8");
            text && text.replace(/langCode[\s]*:[\s]*"[a-zA-Z0-9_.]*"/g, function (val) {
              if (val) {
                const split = val.split("\"");
                if (split.length > 1) {
                  const code = split[1];
                  importModules.set(code, node);
                }
              }
              return val;
            });
            text && text.replace(/\$T\("[a-zA-Z0-9_.]*"\)/g, function (val) {
              if (val) {
                const split = val.split("\"");
                if (split.length > 1) {
                  const code = split[1];
                  importModules.set(code, node);
                }
              }
              return val;
            });
            text && text.replace(/modules\s*:\s*\[\s*[a-zA-Z0-9_.,\s"]*\s*]/g, function (val) {
              if (val) {
                const split = val.split("\"");
                if (split.length > 1) {
                  split.forEach((code, index) => {
                    const newCode = `${code}.common.temp`;
                    index % 2 === 1 && importModules.set(newCode, node);
                  });
                }
              }
              return val;
            });
          }
        }
      },
      ObjectExpression(node) {
        const parent = getParent(node);
        if (parent.type === "ExportDefaultDeclaration") {
          vueNode = parent;
          const modulesProperty = node.properties.filter(utils.isProperty)
            .map((property) => ({
              node: property,
              name: utils.getStaticPropertyName(property) ||
                property.key.type === "Identifier" && property.key.name || ""
            })).filter((e) => e.name === "modules");
          modulesProperty.forEach((module) => {
            modulesNode = module.node;
            const value = module.node.value;
            if (value) {
              if (value.type === "ArrayExpression") {
                value.elements.forEach((e) => {
                  modules.push(e.value);
                });
              } else {
                context.report({
                  node,
                  message: "modules的值必须是数组类型"
                });
              }
            }
          });
          importModules.forEach((v, k) => {
            check$TLangModule(context, v, [ { value: k } ], modules, modulesNode, vueNode);
          });
        }
      },
      CallExpression(node) {
        if (node.callee.property && node.callee.property.name === "$T") {
          check$TLangModule(context, node, node.arguments, modules, modulesNode, vueNode);
          if (node.parent && node.parent.property && node.parent.property.name === "$D") {
            return;
          }
          context.report({
            node,
            message: "$T方法后面必须接$D",
          });
        }
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
      Identifier(node) {
        if (node.name === "langCode" && node.type === "Identifier") {
          const code = node.parent && node.parent.value && node.parent.value.value;
          if (code) {
            check$TLangModule(context, node, [ { value: code } ], modules, modulesNode, vueNode);
          }
        }
      },
    });
  },
};

