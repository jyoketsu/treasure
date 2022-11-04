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

### git 提交代码

```
sh commit.sh "提交说明"
```

### npm install 出错

尝试执行以下命令
删除 package-lock.json

```
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
npm cache clean --force
```

## 自动登录

```
`https://baoku.qingtime.cn/account/login?token=${token}&redirect_uri=/${domain}/home`
```

## query 说明

- `onlyContent` 仅显示文章内容
- `hidePostButton` 隐藏投稿按钮
- `hide-head` 隐藏头部

## 在 create-react-app 中 build 禁止生成源映射

create-react-app 会默认的在构建期间缩小代码并生成源映射，这样的话会在 build 文件夹的 js 目录生成.js 与.map 文件

.map 文件会随着我们打开 Developer Tools 时按需加载，我们就能看到构建前的原始代码

如果想要禁止 cli 生成源映射文件(.map)，那么我们只需要修改根目录中 node_modules/react-scripts/config/webpack.config.prod.js 文件，将

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
