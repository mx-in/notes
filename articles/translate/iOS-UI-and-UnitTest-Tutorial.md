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

### 创建一个单元测试的 Target

**Xcode Test Navigato**r 提供了一个简单的方式用于测试；你需要创建一个 test target 用于在你的 App 上运行测试。

打开 **BullsEyes** 工程然后按下 **Command-5** 打开 test navigator。

点击左下角的 + 按钮，在菜单中选择 **New Unit Test Target…** :

![TestNavigator1](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/TestNavigator1.png)

使用默认的名字 **BullsEyeTests**. 然后 test bundle 会出现在 test navigator 中，点击它在 XCode editor 中打开。如果 BullsEyeTests 没有自动的出现，可以尝试点击其他 navigators 然后在点会 test navigator。

![TestNavigator2](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/TestNavigator2.png)

模板中导入了 **XCTest** 并且定义了 **XCTestCase** 的子类 **BullsEyeTests** ，包含了 **setup()**, **tearDown()** 和 测试方法范例。

有三种方法去运行这个 test class ：

1. 在 **Product\Test** 菜单下点击测试，或者使用 **Command-U** 快捷键，这将运行所有测试类。
2. 点击测试 navigator 中的箭头按钮。
3. 点击编辑器沿上钻石状的按钮。![TestNavigator3](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/TestNavigator3.png)

你可以单独的运行测试方法通过点击钻石状的按钮，也可以在 test navigator 或者编辑器左边沿点击运行。

可以去尝试使用不同的方法运行测试，来感受每种方式花去的时间，看看运行后是如何的状态。这个测试的例子尚没有做任何事，所以将运行的很快!!

当所有的测试运行成功，小钻石图标将变为绿色并打上了小对勾，点击最后的**testPerformanceExample()** 左侧的灰色的小钻石图标将展现性能分析结果：

![TestNavigator4](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/TestNavigator4.png)

你不需要 **testPerformanceExample()**， 所以删掉它即可。

## 使用 XCTAssert 用于测试 Models

首先，你将使用 **XCTAssert** 去测试 BullsEye's 核心功能的 model: **BullsEyeGame** 是否正确的计算了没一轮的得分？

在 **BullsEyeTests.swift** 引入如下的声明：

``` swift
@testable import BullsEye
```

用于接入 **BullsEye** 中的类和方法。

在 **BullsEyeTests** 类的顶部加入如下属性：

```swift
var gameUnderTest: BullsEyeGame!
```

在 **setup()**方法的 super: 调用后创建一个新的 **BullsEyeGame** 对象：

```swift
gameUnderTest = BullsEyeGame()
gameUnderTest.startNewGame()
```

如上在 class 层级创建了一个 SUT (System Under Test)，所以此测试类中的所有方法都可以使用这个 SUT 下对象属的所有属性和方法。

在这里我们调用了 game 的用于创建一个 **targetValue** 的方法**startNewCame** 。

你写的测试中许多方法都将用到 **targetValue** , 用于测试 game 对得分的计算是否准确。

为了避免忘记，*release* 你的 SUT 对象在 tearDown() 方法的 super: 调用后：

```swift
gameUnderTest = nil
```

> **note**: 在 **setup()** 方法中创建 SUT，并且在 **tearDown()** 中释放是很好的实践，这样可以确保测试流程的清晰。更多关于此的讨论可以查阅 [Jon Reid’s post](http://qualitycoding.org/teardown/) 。

现在你已经有了充分的准备，可以开始写测试了！！

用如下的代码替换 **testExample()**

```swift
// XCTAssert to test model
func testScoreIsComputed() {
  // 1. given
  let guess = gameUnderTest.targetValue + 5
 
  // 2. when
  _ = gameUnderTest.check(guess: guess)
 
  // 3. then
  XCTAssertEqual(gameUnderTest.scoreRound, 95, "Score computed from guess is wrong")
}
```

测试方法的名字永远已 **test** 开头，如下为该测试的说明。

一个非常好的写测试的习惯是将你的测试方法分解为 **given**, **when**, 和 **then** 三部份：

1. 在 **given** 中创建所有你需要的 value；在这个例子中创建了 **guess** value 用于指定一个不同于 targetValue 的值。
2. 在 **when** 中执行将要被测试的代码：调用`gameUnderTest.check(_:)`.
3. 在 **then** 中的断言中给出你期望的结果，并传入一段用于描述断言失败后将要打印的信息（在这个例子中， `gameUnderTest.scoreRound` 是 100 – 5）。

点击左侧 navigator 中的小钻石。App 将会被构建并且运行，小钻石图标将会变为绿色的小对勾！！

> **note**: 按住 command 单击XCTAssertEqual 你将看到 *XCTestAssertions.h* 代码中你将会看到所有的 *XCTestAssertions* 方法，或者可以前往 [Apple’s Assertions Listed by Category](https://developer.apple.com/library/prerelease/content/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/04-writing_tests.html#//apple_ref/doc/uid/TP40014132-CH4-SW35)查阅。

> **note**: **Given-When-Then** 结构起源自 行为测试(test originated with Behavior Driven Development)，这种结构的其他命名是  *Arrange-Act-Assert* 和 *Assemble-Activate-Assert*.

## Debugging a Testing

这里有一个 bug 被故意设置在了 **BullsEyeGame** 中，所以接下来你将尝试去找到它, 重命名 `testScoreIsComputed` 方法为`testScoreIsComputedWhenGuessGTTarget`, 然后创建 `testScoreIsComputedWhenGuessLTTarget`方法.

在这个测试中在 **given** 中将 `targetValue` 减去5. 其他的和上一个测试相同。

```swift
func testScoreIsComputedWhenGuessLTTarget() {
  // 1. given
  let guess = gameUnderTest.targetValue - 5
 
  // 2. when
  _ = gameUnderTest.check(guess: guess)
 
  // 3. then
  XCTAssertEqual(gameUnderTest.scoreRound, 95, "Score computed from guess is wrong")
}
```

 `guess` 和 `targetValue` 的 difference 值依旧是5, 所以 score 应当依旧为95.

在 breakpoint navigator 中添加 *Test Failure Breakpoint* ，这将使测试停止，当被测试方法抛出一个 failure assertion 。

![AddTestFailureBreakpoint](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/AddTestFailureBreakpoint.png)

运行测试：测试将在 XCTAssertEqual 那一行停止并且伴随着一个 Test Failure。

在 debug console检查 `gameUnderTest` 和 `guess` 对象:

![TestFailure](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/TestFailure.png)

`guess` 为 `targetValue - 5` 但是 `scoreRound` 为 105 ,而不是95!！

为了进一步检查，使用常规的 debug 方式：在 *BullsEyeGame.swift*, 的  `check(_:)`方法中创建 `difference` 处设置断点。然后再次运行测试，单步调试检查 `difference`的值![DebugConsole](/Users/mx_in/Developer/GithubRepo/notes/articles/imgs/DebugConsole.png)

问题在于 `difference` 为一个负数，所以 score 为 100 - (-5); 使用绝对值可以修复这个问题，打开注释掉的这个行并删掉有问题的着一行，去掉断点，然后再次运行测试来确认修复成功。

## 使用 XCTestExpectation 用于测试异步操作

现在你已经学习了如何去测试并且如何 debug 测试失败的内容，接下来可以尝试使用`XCTestExpectation` 来测试网络通信。



打开 *HalfTunes*工程: 这是一个使用 `URLSession` 并使用 iTunes Api 来查询歌曲的例子。

假如你想使用 [AlamoFire](https://www.raywenderlich.com/121540/alamofire-tutorial-getting-started) 来进行网络请求，为了查明是有原有的代码被弄坏，这就需要去写一些测试用于测试网络请求, 并且在每一次修改代码后运行他们。

`URLSession`方法是*异步的* ：它会很快返回结果，但是并不是运行后立即返回。为了测试异步方法你需要使用  `XCTestExpectation` 去使你的测试等待到异步方法完成操作。

异步方法测试起来通常比较慢，所以你应当把他们同那些更快得到测试结果的测试分开。

选择 *New Unit Test Target…*  *+* 菜单 然后命名为 *HalfTunesSlowTests*。然后引入如下内容

```swift
@testable import HalfTunes
```

在这个测试类中将使用原生的 session 用于向 Apple 的 servers 发送请求, 首先声明一个`sessionUnderTest` 对象, 然后 `setup()`初始化，最后在`tearDown()中 release

```swift
var sessionUnderTest: URLSession!
 
override func setUp() {
  super.setUp()
  sessionUnderTest = URLSession(configuration: URLSessionConfiguration.default)
}
 
override func tearDown() {
  sessionUnderTest = nil
  super.tearDown()
}
```

替换 testExample() 为异步测试：

```swift
// Asynchronous test: success fast, failure slow
func testValidCallToiTunesGetsHTTPStatusCode200() {
  // given
  let url = URL(string: "https://itunes.apple.com/search?media=music&entity=song&term=abba")
  // 1
  let promise = expectation(description: "Status code: 200")
 
  // when
  let dataTask = sessionUnderTest.dataTask(with: url!) { data, response, error in
    // then
    if let error = error {
      XCTFail("Error: \(error.localizedDescription)")
      return
    } else if let statusCode = (response as? HTTPURLResponse)?.statusCode {
      if statusCode == 200 {
        // 2
        promise.fulfill()
      } else {
        XCTFail("Status code: \(statusCode)")
      }
    }
  }
  dataTask.resume()
  // 3
  waitForExpectations(timeout: 5, handler: nil)
}
```

这个测试用于测试 iTunes 服务是否会返回 http 状态码 200，