#!/bin/bash
set -e
if [ -z "${MOBILE_CONSOLE_SWITCH}" ]; then
  export MOBILE_CONSOLE_SWITCH=true
fi
if [ -z "${MOBILE_CLIENT_SECRET}" ]; then
  export MOBILE_CLIENT_SECRET=secret
fi

if [ -z "${PRIVATE_BUCKET}" ]; then
  export PRIVATE_BUCKET=private-bucket
fi
if [ -z "${PUBLIC_BUCKET}" ]; then
  export PUBLIC_BUCKET=public-bucket
fi

if [ -z "${HZERO_GATEWAY_URL}" ]; then
  export HZERO_GATEWAY_URL=https://dev.isrm.going-link.com
fi
if [ -z "${MOBILE_APM_APP_ID}" ]; then
  export MOBILE_APM_APP_ID=213719
fi
if [ -z "${ENV}" ]; then
  export ENV=DEV
fi
if [ -z "${MOBILE_APMINSIGHT_SWITCH}" ]; then
  export MOBILE_APMINSIGHT_SWITCH=true
fi
if [ -z "${MOBILE_SRM_HOST}" ]; then
  export MOBILE_SRM_HOST="https://mobile.dev.isrm.going-link.com"
fi
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_CONSOLE_SWITCH ${MOBILE_CONSOLE_SWITCH} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_API_HOST ${HZERO_GATEWAY_URL} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_CLIENT_SECRET ${MOBILE_CLIENT_SECRET} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_PRIVATE_BUCKET_NAME ${PRIVATE_BUCKET} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_PUBLIC_BUCKET_NAME ${PUBLIC_BUCKET} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_APM_APP_ID ${MOBILE_APM_APP_ID} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_SRM_ENV ${ENV} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_APMINSIGHT_SWITCH ${MOBILE_APMINSIGHT_SWITCH} g"
find /usr/share/nginx/html -name 'index.html' | xargs sed -i "s MOBILE_SRM_HOST ${MOBILE_SRM_HOST} g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s MOBILE_SRM_HOST ${MOBILE_SRM_HOST} g"
exec "$@"
