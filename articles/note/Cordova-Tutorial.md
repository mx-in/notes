![cordova logo](https://cordova.apache.org/static/img/cordova_bot.png)

# Cordova Tutorial

## About Cordova
### 用途
> Cordova wraps your HTML/JavaScript app into a native container which can access the device functions of several platforms. These functions are exposed via a unified JavaScript API, allowing you to easily write one set of code to target nearly every phone or tablet on the market today and publish to their app stores.
>
> (Cordova 将你的HTML/JavaScript 应用包裹在一个可以使用设备的功能并且支持一系列的平台的容器中。通过统一的 JavaScript API 来调用这些原生功能，让你通过写一套代码，将你的应用发布到几乎所有的手机或桌面平台的应用程序商店。）



### 所支持平台

![support_platforms](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/support_platforms.png)

### 原生功能 JS API

Cordova 通过插件机制用以为 HTML/JavaScript 应用提供可以支持原生功能的 JS API，cordova 所提供的插件包括：

- [Battery Status](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-battery-status/index.html)
- [Camera](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html)
- [Console](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-console/index.html)
- [Contacts](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-contacts/index.html)
- [Device](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/index.html)
- [Device Motion](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device-motion/index.html)
- [Device Orientation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device-orientation/index.html)
- [Dialogs](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-dialogs/index.html)
- [File](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html)
- [File Transfer](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file-transfer/index.html)
- [Geolocation](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/index.html)
- [Globalization](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-globalization/index.html)
- [Inappbrowser](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/index.html)
- [Media](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media/index.html)
- [Media Capture](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media-capture/index.html)
- [Network Information](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/index.html)
- [Splashscreen](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html)
- [Vibration](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-vibration/index.html)
- [Statusbar](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-statusbar/index.html)
- [Whitelist](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist/index.html)
- [Legacy Whitelist](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-legacy-whitelist/index.html)

当你需要使用原生功能 JS API，可于[此处](https://cordova.apache.org/plugins/)搜索。

我们也可以[自定义插件](https://cordova.apache.org/docs/en//latest/guide/hybrid/plugins/index.html#building-a-plugin)，并向社区[贡献出自己的插件](https://cordova.apache.org/contribute/) 。

# Get Started 

## install

Cordova 命令行工具是基于  [Node.js](http://nodejs.org/) 的，我们可以使用 [NPM ](https://npmjs.org/package/cordova) 安装它。

`npm install -g cordova`

安装完成后，在命令行键入 `cordova` 以验证是否安装成功。

## 使用命令行工具

cordova 命令行工具主要提供了如下功能：

```shell
- Create a cordova project: 		   //创建项目
    cordova create path package.name project.name

- Display the current workspace status: //查看状态
    cordova info

- Add a cordova platform:			   //添加支持平台
    cordova platform add platform

- Remove a cordova platform:		   //移除所支持平台
    cordova platform remove platform

- Add a cordova plugin:				   //为App添加插件
    cordova plugin add pluginid

- Remove a cordova plugin:			    //移除已添加的插件
    cordova plugin remove pluginid
```

例如我们创建一个项目并添加 iOS 平台：

`$ cordova create MyApp`

`$ cd MyApp`

`$ cordova platform add iOS`

## iOS 工程

我们可以看到 MyApp 目录结构如下

```
├── config.xml
├── hooks
│   └── README.md
├── platforms
│   ├── ios
│   └── platforms.json
├── plugins
└── www
```

所添加的iOS工程位于 platforms 下的 ios 文件夹。

工程文件目录结构如下

```
.
├── CordovaLib
├── cordova
├── ios.json
├── platform_www
├── MyApp
├── MyApp.xcodeproj
└── www
```

其中 **www** 文件夹为 Html / JavaScript 应用所在的目录，容器会在 App 启动后自动加载该目录下的 index.html

**CordovaLib** 为 cordova 容器工程所在的目录。

MyApp -> Plugins 为插件原生部分所在位置。

定义插件 JS API 的部分位于 www -> plugins

## cordova 插件

cordova 插件用于向 H5 应用提供 JS 接口，当 JS 接口被调用时会调用插件的原生部分，一个插件的原生/ JS 部分如下：

```javascript
cordova.define("com.mxin.test.TestPlugin", function(require, exports, module) {
var exec = require('cordova/exec');

exports.test = function(success, error) {
  var args = [];
  exec(success, error, "MXCordovaTest", "test", args);
};
  
});
```

**com.mxin.TestPlugin** 为插件 ID 

我们 exprots **test** 方法为 JS 接口

调用 cordova/exec  exec(成功回调， 失败回调，项目中的类名，执行的该类中方法，额外参数)

在原生部分：

```objective-c
/********* MXCordovaTest.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface MXCordovaTest : CDVPlugin {
  // Member variables go here.
}
- (void)test:(CDVInvokedUrlCommand*)command;
@end

@implementation MXCordovaTest

- (void)test:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* arg1 = [command.arguments objectAtIndex:0];
  	NSString* arg2 = [command.arguments objectAtIndex:1];

    if (/*process success*/) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:arg1];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
```

cordova 插件的原生类需要继承 `CDVPlugin`;

当 H5 应用调用如上插件 JS 部分定义的 JS 接口 `exec` 方法被执行时，更具 `exec` 方法传入的 "MXCordovaTest" 参数，cordova 容器初始化了对应的 `MXCordovaTest` 类， 并且更具传入的方法参数调用 `test:` 方法，并传入`CDVInvokedUrlCommand` 对象，该对象封装了 `exec` 方法传入的参数，以及 callbackId 等。

 在如上方法中我们通过 `CDVPluginResult` 对象来封装执行结果，然后将该结果通过 `commandDelegate` 的 `sendPluginResul:callbackId:` 方法执行 传入的 JS 回调方法。

如上定义了一个完整的插件，通过这种方式我们构建了 JS 方法和原生方法之间的桥梁。

当插件定义好之后，我们需要在 Cordova 容器中配置我们的插件。

## 工程中的配置文件

1. config.xml 

   该文件位于iOS工程下的：

   ```
   MyApp
   ├── config.xml
   ```

   ```xml
   <?xml version='1.0' encoding='utf-8'?>
   <widget id="mx.cordova.MyApp" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
       <feature name="TestPlugin">
           <param name="ios-package" value="TestPlugin" />
       </feature>
       <name>MyApp</name>
       <content src="index.html" />
       <access origin="*" />
       <allow-intent href="http://*/*" />
       	...
       <preference name="PaginationBreakingMode" value="page" />
       <preference name="PaginationMode" value="unpaginated" />
   </widget>
   ```

   在config.xml 为容器的配置文件，其中包含了访问权限控制 （access），首页（content），App 名称（name）, 其中插件的配置为：

   ```xml
    <feature name="TestPlugin">
        <param name="ios-package" value="TestPlugin" />
    </feature>
   ```

   其中 `ios-package` 的 value 对应插件的原生类文件

   feature name 与下边  cordova_plugins.js 中的id相对应。

2. cordova_plugins.js

   文件位于：

   ```
   www
   ├── cordova_plugins.js
   ```

   ```javascript
   cordova.define('cordova/plugin_list', function(require, exports, module) {
   module.exports = [
       {
           "file": "plugins/com.mxin.TestPlugin/www/TestPlugin.js",
           "id": "com.mxin.test.TestPlugin",
           "pluginId": "com.mxin.test",
           "clobbers": [
               "TestPlugin"
           ]
       }
   ];
   module.exports.metadata = 
   // TOP OF METADATA
   {
       "com.mxin.test": "1.0.0",
   }
   // BOTTOM OF METADATA
   });
   ```

   该描述文件向 cordova 容器提供了插件 JS API 相关信息，其中包括定义该  JS 接口的插件 JS 文件，插件 id。

   Plugin id 的值为插件 id+name。

   metadata 提记录插件版本信息。

   ​

## 添加插件

需要插件支持时可以前往 [Cordova 官网 ](https://cordova.apache.org/plugins/) 查找。

添加插件命令：

**cordova plugin add  pluginId/插件远程地址/本地插件路径。**

当我们使用这个命令的时候需要提供标准的插件目录格式，对于只包含iOS平台的插件，目录结构如下

```
.
├── package.json
├── plugin.xml
├── src
│   └── ios
│       └── plugin.m
└── www
    └── plugin.js
```

其中 plugin.xml 为插件的描述和配置信息，plugin.m 和 plugin.js 分别对应插件的原生和 JS 部分。



## 创建插件

当现存的插件无法满足需求的时候就需要去自定义插件了，如上所述我们需要创建一个标准的插件目录结构；

但是并不需要手动去创建，因为 cordova 为我们提供了命令行工具 [plugman](https://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/index.html#validating-a-plugin-using-plugman) ，首先使用 npm 安装  plugman:

`npm install -g plugman`

接下来创建一个名为 PluginTest 的插件：

`$ plugman create --name TestPlugin  --plugin_id com.mxin.test --plugin_version 0.0.1`

打开 PluginTest 文件夹，目录结构如下：

```
TestPlugin
├── plugin.xml
├── src
└── www
    └── TestPlugin.js
```

然后添加所需要的平台：

`platform add --platform_name ios`

在 src 文件夹下会生成一个 iOS 目录：

```
TestPlugin
├── plugin.xml
├── src
│   └── ios
│       └── TestPlugin.m
└── www
    └── TestPlugin.js
```

目录中为插件的原生实现。如果你需要增加别的平台，例如 Android 则继续执行：

`platform add --platform_name android`

接下来 src 下会出现对应的平台目录。

创建完成后 plugin.xml 文件的内容为：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0" xmlns:android="http://schemas.android.com/apk/res/android" id="com.mxin.test" version="0.0.1">
   <name>TestPlugin</name>
   <js-module name="TestPlugin" src="www/TestPlugin.js">
      <clobbers target="cordova.plugins.TestPlugin" />
   </js-module>
   <platform name="ios">
      <config-file parent="/*" target="config.xml">
         <feature name="TestPlugin">
            <param name="ios-package" value="TestPlugin" />
         </feature>
      </config-file>
      <source-file src="src/ios/TestPlugin.m" />
   </platform>
   <platform name="android">
      <config-file parent="/*" target="res/xml/config.xml">
         <feature name="TestPlugin">
            <param name="android-package" value="com.mxin.test.TestPlugin" />
         </feature>
      </config-file>
      <config-file parent="/*" target="AndroidManifest.xml" />
      <source-file src="src/android/TestPlugin.java" target-dir="src/com/mxin/test/TestPlugin" />
   </platform>
</plugin>
```

plugman 已经自动更具创建插件命令的参数，创建好了相应的配置文件，其中` <clobbers target="cordova.plugins.TestPlugin" />` 标签对应 cordova_plugins.js 文件中的 clobbers , 我们可以修改为 `      <clobbers target="cordova.plugins.TestPlugin" />`,，`js-module` 和 `platform` 标签内内容也会被添加到相应的配置文件中。

模板中 TestPlugin.js 和 TestPlugin.m 会有相应的默认实现:

```javascript
var exec = require('cordova/exec');

exports.coolMethod = function(arg0, success, error) {
    exec(success, error, "TestPlugin", "coolMethod", [arg0]);
};
```

```objective-c
/********* TestPlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface TestPlugin : CDVPlugin {
  // Member variables go here.
}

- (void)coolMethod:(CDVInvokedUrlCommand*)command;
@end

@implementation TestPlugin

- (void)coolMethod:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
```

我们只需要将其修改为我们想要实现的插件即可。在修改完成后，可以通过 cordova plugin add "path to you plugin" 命令来添加你的插件以测试创建的插件是否可用，该命令会自动将 plugin.xml 中的信息添加到 config.xml  和 cordova_plugins.js 文件中。

[TestPlugin Demo](https://github.com/mx-in/notes/blob/master/articles/document/TestPlugin)

