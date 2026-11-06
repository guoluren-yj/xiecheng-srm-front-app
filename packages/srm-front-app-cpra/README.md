### 服务作用

- 甄云srm产品移动子应用微服务，提供srm各套件业务处理能力，srm-front-app版本>=1.27.0 微服务拆分后投入使用

### 执行命令
- yarn --registry=https://nexus.going-link.com/repository/zhenyun-npm-group/ ：安装依赖
- yarn serve:启动运行，默认使用.env环境变量
- yarn build:打包，默认使用.env环境变量，整体打包
- yarn build:cloud:打包，使用.env.cloud配置编译打包，打包后需要替换环境变量，整体打包
- yarn build-sub:打包，默认使用.env环境变量，独立子应用打包（预留，无需使用）
- yarn build-sub:cloud:打包，使用.env.cloud配置编译打包，打包后需要替换环境变量，独立子应用打包（预留，无需使用）
- yarn prepare: 生成提交代码前执行钩子函数的命令,
- yarn lint：对git已修改文件进行eslint检查

### 服务部署
- 环境变量（执行docker下的enterpoint.sh将当前服务变量名替换为服务器上的环境变量）
   - MOBILE_CONSOLE_SWITCH：控制台是否开启，调试使用
   - MOBILE_CLIENT_SECRET：替换为与CLIENT_ID对应的客户端秘钥
   - MOBILE_API_HOST：后端网关地址
   - MOBILE_SRM_ENV：当前环境代码，取自猪齿鱼配置 
   - MOBILE_PRIVATE_BUCKET_NAME：文件上传私有桶
   - MOBILE_PUBLIC_BUCKET_NAME：文件上传共有桶
   - MOBILE_SRM_HOST: SRM移动端域名

  
- 构建过程
    - yarn --registry=https://nexus.going-link.com/repository/zhenyun-npm-group/:安装服务依赖
    - yarn build:cloud:服务打包
        - 打包完成后会在当前服务下产生dist文件夹，dist下存在以当前服务简称命名的包
- 服务代理
    - dist下面存放的是当前服务代码打包好各模块的静态文件，将dist通过域名代理出去即可，若代理成功，可找个示例界面，eg:通过打开 https://xxx.xxx.xxx/当前服务简称/#/public/PaymentResult 的方式进行访问验
    证，若正常弹出页面且接口调用域名与MOBILE_API_HOST配置一致则部署成功
    


### 子应用
Reverse                       --- 冲销
CreateInvoice                 --- 创建应收发票
InvoiceInspection             --- 发票查验
DeliveryBillApproval          --- 送货单审批 
DeliveryBillCancel            --- 送货单取消
DeliveryBillClose             --- 送货单关闭
DeliveryBillQuery             --- 送货单查询
DeliveryBillReview            --- 送货单复审
DeliveryTimeApproval          --- 送货单交期审批
MyDelivery                    --- 我的送货单
MyOrder                       --- 我发出的订单
MyReceiveOrder                --- 我收到的订单
OrderApproval                 --- 订单审批
OrderConfirmation             --- 订单确认
OrderRelease                  --- 订单发布
PurchaseRequisitionApproval   --- 采购申请审批
PurchaseReqWorkbench          --- 采购申请工作台
PurchaserInvoicePool          --- 采购方发票池
ReceiptExecution              --- 收货执行
ReceiveWorkplace              --- 收货工作台
BudgetMaking                  --- 预算调拨
CheckPayableInvoice           --- 审核应付发票
CreateDelivery                --- 送货单创建
Receive                       --- 接收
ScheduleSheet                 --- 计划排程
StatementReview               --- 对账单工作台
VendorInvoicePool             --- 销售方发票池
