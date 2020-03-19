```
 _________  ________  _______   ________  ________  ___  ___  ________  _______      
|\___   ___\\   __  \|\  ___ \ |\   __  \|\   ____\|\  \|\  \|\   __  \|\  ___ \     
\|___ \  \_\ \  \|\  \ \   __/|\ \  \|\  \ \  \___|\ \  \\\  \ \  \|\  \ \   __/|    
     \ \  \ \ \   _  _\ \  \_|/_\ \   __  \ \_____  \ \  \\\  \ \   _  _\ \  \_|/__  
      \ \  \ \ \  \\  \\ \  \_|\ \ \  \ \  \|____|\  \ \  \\\  \ \  \\  \\ \  \_|\ \ 
       \ \__\ \ \__\\ _\\ \_______\ \__\ \__\____\_\  \ \_______\ \__\\ _\\ \_______\
        \|__|  \|__|\|__|\|_______|\|__|\|__|\_________\|_______|\|__|\|__|\|_______|
                                            \|_________|                             
                                                                                
```
# 时光宝库
### 启动
```
npm start
```
### 编译&发布
```
npm run publish
```
### git提交代码
```
sh commit.sh "提交说明"
```
### npm install 出错
尝试执行以下命令
删除package-lock.json
```
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
npm cache clean --force
```
## 自动登录
```
`https://baoku.qingtime.cn/account/login?token=${token}&redirect_uri=/${domain}/home`
```

### 在create-react-app中build禁止生成源映射
create-react-app会默认的在构建期间缩小代码并生成源映射，这样的话会在build文件夹的js目录生成.js与.map文件

.map文件会随着我们打开Developer Tools时按需加载，我们就能看到构建前的原始代码

如果想要禁止cli生成源映射文件(.map)，那么我们只需要修改根目录中node_modules/react-scripts/config/webpack.config.prod.js文件，将
```
devtool: isEnvProduction
  ? shouldUseSourceMap
    ? 'source-map'
    : false
  : isEnvDevelopment && 'cheap-module-source-map',
```
修改为
```
devtool: false,
```

### get a file or blob from an blob url
```
let blob = await fetch(blobUrl).then(r => r.blob());
```