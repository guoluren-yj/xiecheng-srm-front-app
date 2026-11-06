const fs = require("fs");
const execSync = require("child_process").execSync;
const exists = fs.existsSync(".husky/pre-commit");
const existsGitDir = fs.existsSync(".git");

function prepare() {
  if (!existsGitDir) {
    console.log("Not exist git");
    return;
  }
  console.log("Exist git");
  execSync("npx husky install");

  if (!exists) {
    execSync("npx husky add .husky/pre-commit \"npm run lint\"");
  } else {
    console.log("prepare .husky/pre-commit already exists");
  }

}

prepare();
