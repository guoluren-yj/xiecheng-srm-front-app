#! /bin/bash
buildService=`cat build/currentBuild.txt`
echo "共打包：" ${buildService}
for child_service in ${buildService[*]}
do
  echo "开始打包：" ${child_service}
  cd packages/${child_service}
  yarn install --ignore-engines --registry=https://nexus.going-link.com/repository/zhenyun-npm-group/
  yarn build:cloud
  touch dist/${child_service}_info.txt
  echo ${CI_PROJECT_NAME}, ${CI_COMMIT_REF_NAME}, ${CI_COMMIT_TAG}, ${CI_COMMIT_SHA}>dist/${child_service}_info.txt
  cd ../..
done
echo "打包完成"
