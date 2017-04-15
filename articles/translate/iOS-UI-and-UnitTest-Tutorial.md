# iOS Unit Testing and UI Testing Tutorial(翻译自[raywenderlich.com](https://www.raywenderlich.com/150073/ios-unit-testing-and-ui-testing-tutorial))

写测试并不是令人向往的，但是如果测试能帮助你的 App 减少 bug 那么写测试就很有必要了。如果你正在阅读这篇文章大概也意识到了应该为你的代码和 UI 写一些测试了，但是也许你并不知道如何在 Xcode 进行测试。

也许你已经有一个正在“正常工作”的 App 但是并没有为它建立测试，但是你需要在任何对 App 的修改和扩展后进行测试；也许你已经写过一些测试，但是并不确定这些测试写的是否正确；或者，也许你正在写 App 的，同时你需要进行测试。

本篇关于 iOS 单元和 UI 测试的入门教程将向你介绍如下内容：

* 如何使用 XCode 测试 navigator 去测试 App 的 model 和异步方法。
* 如何使用 stubs 和 mocks 去构造一个用来替代需要交互的一些库，或是系统对象。
* 如何测试进行 UI 和性能测试。
* 如何使用测试覆盖率工具。

沿着这条路你将了解许多测试相关的词汇，在本教程结束后你将能沉着的将依赖关系注入至被测试系统（SUT）中😬。

## Tesing, Testing ...

什么是测试？

在写测试前，需要思考一个问题：我们需要一个什么样的测试？

如果你的目标是扩展你的App，首先需要测试的是**所有计划去扩展并且需要改变的部分**.

通常情况下，需要测试的部分包括：

* 核心功能：modle 类及其方法，还有和他们交互的controller
* 最常用的 UI 工作流。
* 边界情况
* 修复的bug

## First Things FIRST: Best Practices for Testing

**F I R S T** 简洁的描述了有效的单元测试的原则和特点:

* **Fast**: 测试需要运行的比较快。
* **Independent/Isolated**: 测试内容需要独立，不去创建或销毁其他对象。
* **Repeatable**: 必须确保每次的测试结果相同。额外的数据源或是同步问题也许将导致间歇性的失败。
* **Self-validating**：测试必须是全自动的；输出结果为 "pass" 或者 "fail", 而不是只是编写者可以理解的 log 文件。
* **Timely**: 理想情况下，在实现具体功能前测试应当就已经写好。

遵守 FRST 原则将有助于写出清晰有效的测试。

## Getting Start

下载并解压 [用于本篇文章的Demo](https://koenig-media.raywenderlich.com/uploads/2016/12/Starters.zip) BullsEye 和 HalfTunes.

**BullsEye** 是一个简单的游戏应用，右下方有一个 segmented control 用于选择游戏模式；选择 **Slede** 模式去滑动 slider 来接近一个可能打到的数值，选择 **Type** 去猜 slider 所处的位置的数值 ，切换control 的同时也会存储用户的游戏模式在 UserDefault。

**HalfTunes** 是一个简单的应用来自 [NSURLSession Tutorial](https://www.raywenderlich.com/110458/nsurlsession-tutorial-getting-started), 已经更新至swift3. 用户可以通过 iTunes API 来查询歌曲，下载歌曲的片段。

**Let's start testing!!!**

## Unit Testing in Xcode

