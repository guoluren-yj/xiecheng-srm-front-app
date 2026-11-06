/* eslint-disable */

function isInObject(objectLines, functionLines, lineNum) {
  let nearestObject = null;
  let nearestFunc = null;
  //获取最近的对象起始行
  for (let i = 0; i < objectLines.length; i++) {
    if (objectLines[i].start <= lineNum - 1 && objectLines[i].end >= lineNum - 1) {
      nearestObject = objectLines[i];
    }
  }
  //获取最近的function起始行
  for (let i = 0; i < functionLines.length; i++) {
    if (functionLines[i].start <= lineNum - 1 && functionLines[i].end >= lineNum - 1) {
      nearestFunc = functionLines[i];
    }
  }
  if (nearestObject) {
    if (nearestFunc) {
      //如果在方法里面
      if (nearestFunc.start >= nearestObject.start && nearestFunc.end <= nearestObject.end) {
        return false;
      }
    }
    return true;
  }
  return false;
}

module.exports = {
  meta: {
    docs: {
      description: "去除对象和数组内多余空行",
      category: "no empty line in object",
      recommended: true,
    },
    fixable: "code",
    schema: [], // no options
  },
  create: function (context) {
    const sourceCode = context.getSourceCode();

    // 忽略最后一行
    const allLines = sourceCode.lines[sourceCode.lines.length - 1] === "" ? sourceCode.lines.slice(0, -1) : sourceCode.lines;
    const objectLines = [];
    const functionLines = [];
    return {
      ObjectExpression(node) {
        objectLines.push({
          start: node.loc.start.line,
          end: node.loc.end.line,
        });
      },
      FunctionExpression(node) {
        functionLines.push({
          start: node.loc.start.line,
          end: node.loc.end.line,
        });
      },
      "Program:exit"(node) {
        return allLines

          // Given a list of lines, first get a list of line numbers that are non-empty.
          .reduce((nonEmptyLineNumbers, line, index) => {
            if (line.trim()) {
              nonEmptyLineNumbers.push(index + 1);
            }
            return nonEmptyLineNumbers;
          }, [])

          // Add a value at the end to allow trailing empty lines to be checked.
          .concat(allLines.length + 1)

          // Given two line numbers of non-empty lines, report the lines between if the difference is too large.
          .reduce((lastLineNumber, lineNumber) => {
            let message, maxAllowed;
            message = "对象内不允许有多余空行.";
            maxAllowed = 0;

            if (lineNumber - lastLineNumber - 1 > maxAllowed && isInObject(objectLines, functionLines, lineNumber)) {
              context.report({
                node,
                loc: {
                  start: { line: lastLineNumber + maxAllowed + 1, column: 0 },
                  end: { line: lineNumber, column: 0 }
                },
                message,
                fix(fixer) {
                  const rangeStart = sourceCode.getIndexFromLoc({ line: lastLineNumber + 1, column: 0 });
                  const lineNumberAfterRemovedLines = lineNumber - maxAllowed;
                  const rangeEnd = lineNumberAfterRemovedLines <= allLines.length
                    ? sourceCode.getIndexFromLoc({ line: lineNumberAfterRemovedLines, column: 0 })
                    : sourceCode.text.length;

                  return fixer.removeRange([ rangeStart, rangeEnd ]);
                }
              });
            }

            return lineNumber;
          }, 0);
      }
    };
  },
};

