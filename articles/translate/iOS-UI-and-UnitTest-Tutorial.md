# iOS Unit Testing and UI Testing Tutorial(翻译自[raywenderlich.com](https://www.raywenderlich.com/150073/ios-unit-testing-and-ui-testing-tutorial))

写测试并不是令人向往的，但是如果测试能帮助你的 App 减少 bug 那么写测试就很有必要了。如果你正在阅读这篇文章大概也意识到了应该为你的代码和 UI 写一些测试了，但是可能你并不知道如何在 Xcode 进行测试。

也许你已经有一个正在“正常工作”的 App 但是并没有为它建立测试，现在你需要在任何对 App 的修改和扩展后进行测试；也许你已经写过一些测试，但是并不确定这些测试写的是否正确；或者，也许你正在写一个 App ，同时你需要进行测试。

本篇文章是关于 iOS 单元和 UI 测试的入门教程，将介绍如下内容：

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

**F I R S T**  原则简洁的描述了有效的单元测试的原则和特点:

* **Fast**: 测试需要运行的比较快。
* **Independent/Isolated**: 测试内容需要独立，不去创建或销毁其他对象。
* **Repeatable**: 必须确保每次的测试结果相同。额外的数据源或是同步问题也许将导致间歇性的失败。
* **Self-validating**：测试必须是全自动的；输出结果仅为 "pass" 或者 "fail", 而不是只是编写者可以理解的 log 文件。
* **Timely**: 理想情况下，在实现具体功能前测试应当就已经写好。

遵守 FRST 原则将有助于写出清晰有效的测试。

## Getting Start

下载并解压 [本篇文章所用到的Demo](https://koenig-media.raywenderlich.com/uploads/2016/12/Starters.zip)BullsEye 和 HalfTunes.

**BullsEye** 是一个简单的游戏应用，右下方有一个 segmented control 用于选择游戏模式；选择 **Slide** 模式去滑动 slider 来接近一个可能打到的数值，选择 **Type** 去猜 slider 所处的位置的数值 ，切换control 的同时也会存储用户的游戏模式在 UserDefault 中。

**HalfTunes** 是一个简单的应用来自 [NSURLSession Tutorial](https://www.raywenderlich.com/110458/nsurlsession-tutorial-getting-started), 现已更新至swift3. 用户可以通过 iTunes API 来查询歌曲，下载歌曲的片段。

接下来我们就可以结合以上 Demo 和本篇文章所介绍的内容来开是写测试了。

## Unit Testing in Xcode

### 创建一个单元测试的 Target

**Xcode Test Navigato**r 提供了一个简单的方式用于测试；你需要创建一个 test target 用于在你的 App 上运行测试。

打开 **BullsEyes** 工程然后按下 **Command-5** 打开 test navigator。

点击左下角的 + 按钮，在菜单中选择 **New Unit Test Target…** :

![TestNavigator1](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/TestNavigator1.png)

使用默认的名字 **BullsEyeTests**. 然后 test bundle 会出现在 test navigator 中，点击它在 XCode editor 中打开。如果 BullsEyeTests 没有自动的出现，可以尝试点击其他 navigators 然后在点会 test navigator。

![TestNavigator2](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/TestNavigator2.png)模板中导入了 **XCTest** 并且定义了 **XCTestCase** 的子类 **BullsEyeTests** ，包含了 **setup()**, **tearDown()** 和 测试方法范例。

有三种方法去运行这个测试类 ：

1. 在 **Product\Test** 菜单下点击测试，或者使用 **Command-U** 快捷键，这将运行所有测试类。
2. 点击测试 navigator 中的箭头按钮。
3. 点击编辑器沿上钻石状的按钮。![TestNavigator3](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/TestNavigator3.png)

你可以单独的运行测试方法通过点击钻石状的按钮，也可以在 test navigator 或者编辑器左边沿点击运行。

可以去尝试使用不同的方法运行测试，来感受每种方式花去的时间，看看运行后是如何的状态。这个测试的例子尚没有做任何事，所以将运行的很快!!

当所有的测试运行成功，小钻石图标将变为绿色并打上了小对勾，点击最后的**testPerformanceExample()** 左侧的灰色的小钻石图标将展现性能分析结果：

![TestNavigator4](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/TestNavigator4.png)

现在尚不需要 **testPerformanceExample()**， 所以删掉它即可。

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

在这里我们调用了 game 中用于创建一个 **targetValue** 的方法**startNewCame** 。

你写的测试中许多方法都将用到 **targetValue** , 用于测试 game 对得分的计算是否准确。

为了避免忘记，*释放* 你的 SUT 对象在 tearDown() 方法的 super: 调用后：

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

测试方法的名字永远已 **test** 开头，一个非常好的写测试的习惯是将你的测试方法分解为 **given**, **when**, 和 **then** 三部份：

1. 在 **given** 中创建所有你需要的 value；在这个例子中创建了 **guess** value 用于指定一个不同于 targetValue 的值。
2. 在 **when** 中执行将要被测试的代码：调用`gameUnderTest.check(_:)`.
3. 在 **then** 中的断言中给出你期望的结果，并传入一段用于描述断言失败后将要打印的信息（在这个例子中， `gameUnderTest.scoreRound` 是 100 – 5）。

接下来点击左侧 navigator 中的小钻石。App 将会被构建并且运行，小钻石图标将会变为绿色的小对勾(测试成功)！！

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

![AddTestFailureBreakpoint](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/AddTestFailureBreakpoint.png)

运行测试：测试将在 XCTAssertEqual 那一行停止并且伴随着一个 Test Failure。

在 debug console检查 `gameUnderTest` 和 `guess` 对象:

![TestFailure](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/TestFailure.png)

`guess` 为 `targetValue - 5` 但是 `scoreRound` 为 105 ,而不是95!！

为了进一步检查，使用常规的 debug 方式：在 *BullsEyeGame.swift*, 的  `check(_:)`方法中创建 `difference` 处设置断点。然后再次运行测试，单步调试检查 `difference`的值![DebugConsole](https://raw.githubusercontent.com/mx-in/notes/master/articles/imgs/DebugConsole.png)

问题在于 `difference` 为一个负数，所以 score 为 100 - (-5); 使用绝对值可以修复这个问题，打开注释掉的这个行并删掉有问题的着一行，去掉断点，然后再次运行测试来确认修复成功。

## 使用 XCTestExpectation 用于测试异步操作

现在你已经学习了如何去测试并且如何 debug 测试失败的内容，接下来可以尝试使用`XCTestExpectation` 来测试网络通信。

打开 *HalfTunes*工程: 这是一个使用 `URLSession` 并使用 iTunes Api 来查询歌曲的例子。

假如你想使用 [AlamoFire](https://www.raywenderlich.com/121540/alamofire-tutorial-getting-started) 来进行网络请求，为了查明是有原有的代码是否被弄坏，这就需要去写一些测试用于测试网络请求, 并且在每一次修改代码后运行他们。

`URLSession`方法是*异步的* ：它会很快返回结果，但是并不是运行后立即返回。为了测试异步方法你需要使用  `XCTestExpectation` 去使你的测试等待到异步方法完成操作。

异步方法测试起来通常比较慢，所以你应当把他们同那些更快得到测试结果的测试分开。

选择 *New Unit Test Target…*  *+* 菜单 然后命名为 *HalfTunesSlowTests*。然后引入如下内容

```swift
@testable import HalfTunes
```

在这个测试类中将使用原生的 session 用于向 Apple 的 servers 发送请求, 首先声明一个 `sessionUnderTest` 对象, 然后 `setup()`初始化，最后在 `tearDown()` 中 release

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

这个测试用于测试 iTunes 服务是否会返回 http 状态码 200，大部分代码和在 App 中的实现代码相同，不同的地方包括：

1. `expectation(_:)` 方法返回一个`XCTestExpectation` 对象, 存储与 `promise`. 对这个对象也有一些其他的常用命名，包括 `expectation` 和 `future`. `description` 参数描述了你所希望发生的状况。
2. 为了匹配 `description` 所描述的状况, 可以在异步回调成功的情况下调用`promise.fulfill()` 。
3. `waitForExpectations(_:handler:)` 方法将使测试持续运行，直到期望的情况完全匹配(all expectations are fulfilled), 或者 `timeout` 参数所指定的时间到时。

运行测试，如果你的网络保持通畅，当 app 启动并加载到模拟器测试后，将耗费几秒钟的时间，然后显示测试成功。

## Fail Faster

失败很让人受伤，而且失败过程也不应该太过耗时，如下将阐释如何在测试失败的情况下更快的发现失败，而不是像上面的例子一样需要等到 `timeout` 时间耗尽以后，尽量的节省时间，以便把时间浪费在刷朋友圈上了 ：）

首先修改测试使得异步调用返回失败的结果，轻轻的从 URL 的"itunes"中删去 's' ：

```swift
let url = URL(string: "https://itune.apple.com/search?media=music&entity=song&term=abba")
```

运行测试，测试将失败，但是你却必须得等到 timeout 的时间走完! 在上边的例子中要么调用 promise.fulfill() 在测试成功的情况下，要么等待 timeout 的时间走完，在测试失败的情况下。

你可以修改 expectation 使得在测试失败的情况下可以更快的呈现失败结果: 替换等待请求成功的方案，采取只等待异步方法的回调被执行，无论返回的结果是成功或是失败，都将较快的接收到相应的 reponse ，当服务器有响应时即实现了所期望的情况，接下来你的测试可以检查请求是否成功。

接下来你需要创建一个新的 test 方法并添加到你的测试类中去：

```swift
// Asynchronous test: faster fail
func testCallToiTunesCompletes() {
  // given
  let url = URL(string: "https://itune.apple.com/search?media=music&entity=song&term=abba")
  // 1
  let promise = expectation(description: "Completion handler invoked")
  var statusCode: Int?
  var responseError: Error?
 
  // when
  let dataTask = sessionUnderTest.dataTask(with: url!) { data, response, error in
    statusCode = (response as? HTTPURLResponse)?.statusCode
    responseError = error
    // 2
    promise.fulfill()
  }
  dataTask.resume()
  // 3
  waitForExpectations(timeout: 5, handler: nil)
 
  // then
  XCTAssertNil(responseError)
  XCTAssertEqual(statusCode, 200)
}
```

关键点在于，提供了一个易于实现的期望，并且可以在较短的时间内实现；如果请求失败那么则 断言 **fail**.

运行测试：因为请求失败，所以测试应该很快就回呈现失败结果，而不是因为测试 **timeout**。

修改回正确的 url 然后再次测，测试将显示为测试成功。

## Faking Objects and Interactions

异步测试让你在使用异步请求 ApI 时信心满满。接下来，也许你同样需要测试你的程序在接收到来自 `URLSession ` 的数据做为输入时程序是否正确工作, 又或是测试 `UserDefaults`  CloudKit 是否更新成功。

大多数的 App 需要和系统以及类库对象进行交互，这些对象你无法掌控，并且测试起来也许很慢且测试结果很可能是无法复现的，这和 **FIRST** 原则中的两条是冲突的。所以做为替代，你需要伪造交互（*fake* the interactions）通过测试桩(stubs)获取输入，或是通过模拟的对象(mock objects)。

你需要创建一个 faker 对象，当你的代码依赖与系统或是类库对象，将这个faker 注入你的代码用来扮演系统或是类库对象的角色。 [*Dependency Injection* by Jon Reid](https://www.objc.io/issues/15-testing/dependency-injection/) 讲述了关于注入的方法。

### Fake Input From Stub

在此测试中，你将检查该应用程序的 `updateSearchResults(_ :)` 方法是否正确地解析会话下载的数据，检查的方法是去检查 `searchResults.count`是否正确。 SUT(system under test) 为 `viewController`，你需要使用一些预先下载的数据来伪造会话。

点击 + 在菜单中选择 *New Unit Test Target…* 然后命名为 *HalfTunesFakeTests*. 然后导入 HalfTunes app 通过使用下边的 `import`  声明:

```swift
@testable import HalfTunes
```

声明一个 SUT, 并在  `setup()` 中创建，在 `tearDown()` 中释放：

```swift
var controllerUnderTest: SearchViewController!
 
override func setUp() {
  super.setUp()
  controllerUnderTest = UIStoryboard(name: "Main", 
      bundle: nil).instantiateInitialViewController() as! SearchViewController!
}
 
override func tearDown() {
  super.tearDown()
  controllerUnderTest = nil
}
```

> **Note:** SUT 是一个 view controller 因为  HalfTunes 有一个 *臃肿* 的 view controller — 所有的工作都会在 SearchViewController.swift 中完成。 [将网络请求代码分离在其他模块中](http://williamboles.me/networking-with-nsoperation-as-your-wingman/) 将减少类似问题，并且将更易于测试。

接下来你需要一个简单的 JSON 数据用于伪造一个 session 所将要提供的数据，来进行测试；我们需要几条数据即可，所以在下载的 URL 后边添加 `&limit=3` 来限制一下下载数据的条数。

```swift
https://itunes.apple.com/search?media=music&entity=song&term=abba&limit=3
```

Copy 这个 URL 把它复制在浏览器中, 复制 JSON 并且把他们存储在一个名为  *abbaData.json* 的文件中，然后你需要将它添加至 *HalfTunesFakeTests* group 中。

 HalfTunes project 包含了一用于模拟网络请求的类： *DHURLSessionMock.swift*. 它定义了一个简单的协议 `DHURLSession`, 包含一些方法 (stubs) ，用于创建一个从从 `URL` 或 `URLRequest`下载数据的任务。这个文件也定义了遵循如上协议的 `URLSessionMock` ，它提供初始化方法让你可以模拟一个  `URLSession`对象，并且你可与选择它的返回数据，response 或是会返回 error。

创建伪造的数据 和 response, 然后创建一个伪造的 session 对象, 在 `setup()` 的声明后创建 SUT:

```swift
let testBundle = Bundle(for: type(of: self)) 
let path = testBundle.path(forResource: "abbaData", ofType: "json") 
let data = try? Data(contentsOf: URL(fileURLWithPath: path!), options: .alwaysMapped)   
let url = URL(string: "https://itunes.apple.com/search?media=music&entity=song&term=abba") 
let urlResponse = HTTPURLResponse(url: url!, statusCode: 200, httpVersion: nil, headerFields: nil)   
let sessionMock = URLSessionMock(data: data, response: urlResponse, error: nil)
```

在 setup()方法的最后,  注入了一个伪造的 session 做为 SUT 的属性:

```swift
controllerUnderTest.defaultSession = sessionMock
```

> **Note:** 你将在你的测试中直接的使用伪造的 session 对象，但是这里可以看出如何去调用 SUT 的方法：使用 viewController 的  `defaultSession `属性.

现在你可以去写下用于检查调用 `updateSearchResults(_:)` 方法是否会正确的解析伪造的数据。接下来替换 `testExample()`方法：

```swift
// Fake URLSession with DHURLSession protocol and stubs
func test_UpdateSearchResults_ParsesData() {
  // given
  let promise = expectation(description: "Status code: 200")
 
  // when
  XCTAssertEqual(controllerUnderTest?.searchResults.count, 0, "searchResults should be empty before the data task runs")
  let url = URL(string: "https://itunes.apple.com/search?media=music&entity=song&term=abba")
  let dataTask = controllerUnderTest?.defaultSession.dataTask(with: url!) {
    data, response, error in
    // if HTTP request is successful, call updateSearchResults(_:) which parses the response data into Tracks
    if let error = error {
      print(error.localizedDescription)
    } else if let httpResponse = response as? HTTPURLResponse {
      if httpResponse.statusCode == 200 {
        promise.fulfill()
        self.controllerUnderTest?.updateSearchResults(data)
      }
    }
  }
  dataTask?.resume()
  waitForExpectations(timeout: 5, handler: nil)
 
  // then
  XCTAssertEqual(controllerUnderTest?.searchResults.count, 3, "Didn't parse 3 items from fake response")
}
```

你依旧需要去写一个异步测试，因为 **stub** 需要假装有一个异步方法。

*when*  中断言在运行测试前 `searchResults` 应当为 0 ， 这将为真, 因为你在 `setup()` 方法中创建了一个全新的 SUT。

伪造数据的 JSON 包含三个 `Track` 对象，所以在 *then* 的 assertion中 view controller 的`searchResults` 数组应当包含三个对象。

运行测试，测试成功的结果将来的非常快，因为这不是一个真正的网络请求。

### Fake Update to Mock Object

上一个测试使用 *stub* 用于从伪造对象中获得输入， 接下来你将模拟一个对象用于测试你的代码是否正确的更新了`UserDefaults` 。

重新打开 *BullsEye* 工程. app 有两种游戏模式: 用户可以移动滑动开关来匹配 target 对应的值，或是更具 滑动开关的位置来猜测 target 的值。一个 segmented control  在右下角用于切换游戏模式，并且更新 user default 中存储的 game style。

你接下来需要测试 app 是否正确的更新了 `gameStyle` user default.

在 test navigator 中点击  *New Unit Test Target…  然后命名为  BullsEyeMockTests*。 然后在 `import` 声明下加入如下内容：

```swift
@testable import BullsEye
 
class MockUserDefaults: UserDefaults {
  var gameStyleChanged = 0
  override func set(_ value: Int, forKey defaultName: String) {
    if defaultName == "gameStyle" {
      gameStyleChanged += 1
    }
  }
}
```

`MockUserDefaults` 重写了 `set(_:forKey:)` 方法，当调用时去自增 `gameStyleChanged`标识. 通常你会在类似的测试中看到一个  `Bool` 变量用于标识, 但是一个自增的 `Int` 可以更方便 — 比如说你可以判断该方法是否被调用超过了一次。

在 `BullsEyeMockTests`: 中声明 SUT 和模拟对象:

```swift
var controllerUnderTest: ViewController!
var mockUserDefaults: MockUserDefaults!
```

在 `setup()`，中 创建 SUT 和模拟的对象, 然后注入模拟的对象为 SUT 的属性:

```swift
controllerUnderTest = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController() as! ViewController!
mockUserDefaults = MockUserDefaults(suiteName: "testing")!
controllerUnderTest.defaults = mockUserDefaults
```

在  `tearDown()` 中释放 SUT 和所模拟的对象:

```swift
controllerUnderTest = nil
mockUserDefaults = nil
```

用如下的代码替换 `testExample()` ：

```swift
// Mock to test interaction with UserDefaults
func testGameStyleCanBeChanged() {
  // given
  let segmentedControl = UISegmentedControl()
 
  // when
  XCTAssertEqual(mockUserDefaults.gameStyleChanged, 0, "gameStyleChanged should be 0 before sendActions")
  segmentedControl.addTarget(controllerUnderTest, 
      action: #selector(ViewController.chooseGameStyle(_:)), for: .valueChanged)
  segmentedControl.sendActions(for: .valueChanged)
 
  // then
  XCTAssertEqual(mockUserDefaults.gameStyleChanged, 1, "gameStyle user default wasn't changed")
}
```

在 *when* 的 assertion 中 `ameStyleChanged`标识在 segmented control  的  "tap" 方法执行前应当为 0 ， 因此，如果 *then* assertion 结果也为 true, 这就意味着可以确定 `set(_:forKey:) `已经被调用了一次。

运行测试，这个测试的结果应该是成功的。

## UI Testing in Xcode

Xcode 7 引入了 UI 测试,  你一可以通过录制一些和 UI 的交互用来创建一个 UI 测试. UI测试通过查询 app 的 UI 对象，合成事件，然后将它们发送到这些对象来工作。该API使你能够检查UI对象的属性和状态，以便将其与预期状态进行比较。

在 *BullsEye* 工程的 test navigator 中添加一个新的 *UI Test Target*. 检查一下被测试的对象为 *BullsEye*, 然后选择默认的命名 *BullsEyeUITests*.

增加如下属性在 `BullsEyeUITests` class 的顶部:

```swift
var app: XCUIApplication!
```

在 `setup()` 方法中 用如下的代码替换`XCUIApplication().launch()` ：

```swift
app = XCUIApplication()
app.launch()
```

修改 `testExample()` 为 `testGameStyleSwitch()`.

在`testGameStyleSwitch()` 中增加一行空行，然后点击在编辑器窗口下方的红色的 *Record* 按钮:

[![iOS Unit Testing: Recording a UI Test](https://koenig-media.raywenderlich.com/uploads/2016/12/UITest.png)](https://koenig-media.raywenderlich.com/uploads/2016/12/UITest.png)

当 app 出现在模拟起上的时候，点击控制游戏  *Slide* segment  和顶部的 label，然后点击 Xcode 的 *Recod* 开关停止录制。

现在`testGameStyleSwitch()`会出现如下三行:

```swift
let app = XCUIApplication()
app.buttons["Slide"].tap()
app.staticTexts["Get as close as you can to: "].tap()
```

删掉除这三行以外的其他行。

将第一行剪切复制到  `setup()` ，你不去要去点击，所以删掉目前第二，第三行的 `.tap()。打开 ["Slide"]` 然后选择 `segmentedControls.buttons["Slide"]`。

留下来的内容是: 

```swift
app.segmentedControls.buttons["Slide"]
app.staticTexts["Get as close as you can to: "]
```

我们可以在 **given** 中修改一下上边的内容:

```swift
// given
let slideButton = app.segmentedControls.buttons["Slide"]
let typeButton = app.segmentedControls.buttons["Type"]
let slideLabel = app.staticTexts["Get as close as you can to: "]
let typeLabel = app.staticTexts["Guess where the slider is: "]
```

现在你已经有了个 buttons 和在两种情况下可能出现在顶端的labels， 然后增加如下内容：

```swift
// then
if slideButton.isSelected {
  XCTAssertTrue(slideLabel.exists)
  XCTAssertFalse(typeLabel.exists)
 
  typeButton.tap()
  XCTAssertTrue(typeLabel.exists)
  XCTAssertFalse(slideLabel.exists)
} else if typeButton.isSelected {
  XCTAssertTrue(typeLabel.exists)
  XCTAssertFalse(slideLabel.exists)
 
  slideButton.tap()
  XCTAssertTrue(slideLabel.exists)
  XCTAssertFalse(typeLabel.exists)
}
```

如上用来检查相应的 lable 是否后出现在界面上，当每一个按钮被点击时。运行测试，所有的 assertions 都将为成功。

## Performance Testing

 [Apple 文档的论述为：](https://developer.apple.com/library/prerelease/content/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/04-writing_tests.html#//apple_ref/doc/uid/TP40014132-CH4-SW8) A performance test takes a block of code that you want to evaluate and runs it ten times, collecting the average execution time and the standard deviation for the runs. The averaging of these individual measurements form a value for the test run that can then be compared against a baseline to evaluate success or failure.

```
性能测试需要一系列要评估的代码并运行十次，收集运行的平均执行时间和标准偏差。这些单独测量的平均值形成测试运行的值，然后将其与基准进行比较以评估成功或失败。
```

写性能测试是很简单的：你只需要将你需要测试性能的代码放入 messure 闭包。

重新打开 *HalfTunes*工程，在 *HalfTunesFakeTests*, 中替换 `testPerformanceExample()` 为如下的测试：

```swift
// Performance 
func test_StartDownload_Performance() {
  let track = Track(name: "Waterloo", artist: "ABBA", 
      previewUrl: "http://a821.phobos.apple.com/us/r30/Music/d7/ba/ce/mzm.vsyjlsff.aac.p.m4a")
  measure {
    self.controllerUnderTest?.startDownload(track)
  }
}
```

运行测试，然后点击出现在  `measure()`闭包底部左边的按钮来查看分析结果：

[![iOS Unit Testing: Viewing a Performance Result](https://koenig-media.raywenderlich.com/uploads/2016/12/PerformanceResult-650x228.png)](https://koenig-media.raywenderlich.com/uploads/2016/12/PerformanceResult.png)



点击  *Set Baseline*, 然后会再次运行性能测试并展现结果— 结果可能比 baseline 的情况更好，也可能更坏， *Edit* 按钮可以让你重置 baseline 为一个新的结果。

Baselines 存储了对应设别的配置, 因此你可以在几个不同的设备上执行相同的测试，并且每个设备都保持不同的基准，具体取决于具体配置的处理器速度，内存等。

每当你你修改 app 并有可能影响到被测试方法的性能时，你需要再次运行性能测试，去看看运行结果和 baseline 比较起来怎么样。

## Code Coverage

代码覆盖率工具可以告诉你 app 中具体有哪些代码被测试跑到了，因此你就可以发祥有哪些代码是没有被测试过的。

> Note:是否应当在 code covaertage 是 enable 的情况下运行测试？ [Apple’s documentation](https://developer.apple.com/library/prerelease/content/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/07-code_coverage.html#//apple_ref/doc/uid/TP40014132-CH15-SW1) says: Code coverage data collection incurs a performance penalty … affect[ing] execution of the code in a linear fashion so performance results remain comparable from test run to test run when it is enabled. However, you should consider whether to have code coverage enabled when you are critically evaluating the performance of routines in your tests.
>
> （代码覆盖率数据收集会引起性能损失...并且以线性方式影响代码的执行，而在测试时启用，性能测试结果与不启用时测试运行相当。但是，当严格评估测试中例程的性能时，应该考虑是否启用代码覆盖。）

启用代码覆盖率,需要编辑 scheme 中的 *Test* 选项 然后选中 *Code Coverage*：

[![iOS Unit Testing: Setting the Code Coverage Switch](https://koenig-media.raywenderlich.com/uploads/2016/12/CodeCoverageSwitch.png)](https://koenig-media.raywenderlich.com/uploads/2016/12/CodeCoverageSwitch.png)

运行所有的测试 (Command-U), 然后打开 reports navigator (Command-8). 选择By Time*, 选择列表中的第一行, 然后选择 Coverage* tab:

[![iOS Unit Testing: Code Coverage Report](https://koenig-media.raywenderlich.com/uploads/2016/12/CoverageReport1-650x189.png)](https://koenig-media.raywenderlich.com/uploads/2016/12/CoverageReport1.png)

点击下拉三角，查看*SearchViewController.swift* 的方法列表：

[![iOS Unit Testing: Code Coverage Report](https://koenig-media.raywenderlich.com/uploads/2016/12/CoverageReport2-650x252.png)](https://koenig-media.raywenderlich.com/uploads/2016/12/CoverageReport2.png)

当鼠标浮动在`updateSearchResults(_:)` 右侧显示覆盖路的进度条上时， 可以看到该方法覆盖率为71.88%.

点击这个 function 可以打开其所在的源文件，并显示该方法。当你的鼠标当悬停在右侧栏中的coverage annotations上时，代码段突出显示绿色或红色：

[![iOS Unit Testing: Good and Bad Code Coverage](https://koenig-media.raywenderlich.com/uploads/2016/12/CoverageReport4-650x436.png)](https://koenig-media.raywenderlich.com/uploads/2016/12/CoverageReport4.png)

 coverage annotations  显示测试命中每个代码段的次数;未调用的部分以红色突出显示。正如所期望的，for循环运行了3次，但是 else 没有执行任何操作。要增的覆盖范围，可以复制abbaData.json，然后对其进行编辑，从而导致不同的错误 - 例如，将`"results"` 改为`"result"`测试（"Results key not found in dictionary" ）

### 100% Coverage?

该如何努力去实现100％的代码覆盖呢？ 谷歌一下 “100% unit test coverage”，你会发现一系列支持和反对意见，以及关于“100% unit test coverage” 的定义的辩论。最多的争论是最后的10-15％的努力到底是不值得的。有争论说最后的10-15％是最重要的，因为很难测试。Google “hard to unit test bad design” 可以找到一些令人信服的观点如：[untestable code is a sign of deeper design problems](https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters) ，进一步的去思考我们也许会得出一条结论：无论如何，总之 [测试驱动开发](http://qualitycoding.org/tdd-sample-archives/) 的模式是行之有效的。

## END





















