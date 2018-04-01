# DSS

`dss`全称：`Drag Special System`（拖拽型专题系统）

## 环境安装

**1、安装[NodeJS](http://nodejs.cn/download/)**

此文档编写时，`node`版本为`v8.9.1`。

``` bash
#查看node版本号
node -v
#查看npm包管理版本号
npm -v
```

**2、设置镜像**

对于大陆用户，建议将`npm`的注册表源[设置为国内的镜像](http://riny.net/2014/cnpm/)，可以大幅提升安装速度。

切换镜像后可以使用`cnpm`命令，下载、安装插件会比`npm`快

**3、安装`gulp`**

``` bash
#全局安装gulp
cnpm i gulp@3 -g  
```

**4、安装依赖插件**

``` bash
#这个命令会安装package.json中的插件列表
cnpm i
```

## 开始开发

修改样式与脚本都需要先执行以下命令

``` bash
#开发环境
gulp dev

#生产环境
gulp build
```

### `gulp dev`

启动`watch`任务，实时监听`src/js/*.js`文件变化，生成`.map`后缀文件便于debug

### `gulp build`

不监听文件变化，生成压缩后的`css`、`js`，无map文件。


## TODO

- 点击左侧模块后，添加模块时页面跳转至添加模块处