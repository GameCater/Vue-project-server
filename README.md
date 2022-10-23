express + mongoose 

# 服务器配置
## 技术点
- jwt请求拦截和身份认证

## 服务器信息

- 地址:   localhost
- 端口号:  6600  3000
- 启动
  - npm run serve / yarn serve 
  - npm run auto  / yarn auto

## 接口说明 (可使用APIFOX)

### 用户登录  

- /api/login
  - post
  - 参数: {name,pwd,code}
    - 必传 name,pwd,code

………………………

​		

## 修改说明 

- 20220927  /api/login 修改了一个用户接口 多了一个参数,code
- 20221023 修改了获取用户信息接口