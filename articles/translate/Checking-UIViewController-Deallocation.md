# [Checking UIViewController Deallocation](http://holko.pl/2017/06/26/checking-uiviewcontroller-deallocation/)

From [Arek Holko](https://twitter.com/arekholko)

[检查当 ViewController 已经不在屏幕上显示的时候是否被 dealloc](https://medium.com/@kazmiekr/what-every-ios-developer-should-be-doing-with-instruments-d1661eeaf64f#b228) 被广泛的用于去发现是否有由 [retain cycles](https://digitalleaves.com/blog/2015/05/demystifying-retain-cycles-in-arc/) 造成的内存泄漏。检查的步骤一般需要你手动的在 Release 前重复性的去写一些代码，重复让人失去乐趣，繁杂的步骤更容易出错。**在我们日常的开发中，如果能更早的发现 `UIViewController` 的内存泄漏那不是很 cool 😎 么？**

有两个并不是很常用的 `UIViewController` 的 properties 为我们的想法提供了可能：

* `isBeingDismissed` – 当一个已经出现的 modally viewController 被关闭后，它的值将为 `true`。
* `isMovingFromParentViewController` – 当一个 viewController 被 parentViewController 移除之后，以及被从系统级的容器移除，例如从 `UINavigationController` 的栈中移除后，该属性值将为 `true`。

当任意一个为 `true ` 时 ，意味着 viewController 即将被 dealloc。我们无法知道清理ViewController 内部状态以及  [ARC dealloc](http://clang.llvm.org/docs/AutomaticReferenceCounting.html#object-liveness)  所需的确切时间，所以为了更简单明了，我们假设这个时间不会大于两秒。

接下来看看我们做了什么：

``` swift
extension UIViewController {
    public func dch_checkDeallocation(afterDelay delay: TimeInterval = 2.0) {
        let rootParentViewController = dch_rootParentViewController

        // 在这个 viewController 中，我们不只是简单的检查 `isBeingDismissed` 因为在通常情况下 viewController 
        // 会被包裹在另一个 viewController 之下（例如 UINavigationController）
        // 并且呈现被包裹过的 viewController。
        if isMovingFromParentViewController || rootParentViewController.isBeingDismissed {
            let type = type(of: self)
            let disappearanceSource: String = isMovingFromParentViewController ? "removed from its parent" : "dismissed"

            DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: { [weak self] in
                assert(self == nil, "\(type) not deallocated after being \(disappearanceSource)")
            })
        }
    }

    private var dch_rootParentViewController: UIViewController {
        var root = self

        while let parent = root.parent {
            root = parent
        }

        return root
    }
}
```

有趣的点发生在调用`asyncAfter(deadline:execute:)`之后 . 首先我们使用 wake self (`[weak self]`)，使得 self 不被延后执行的闭包所 retain，接下来， 我们断言  `self` （`UIViewController` 的实例） 为  `nil`. **仅当在有引用循环的情况下，viewController 将依旧存在。**

接下来，我们需要做的仅仅是在所有 ViewController 的  `viewDidDisappear(_:)` 方法中调用  `dch_checkDeallocation()`  （除了那些我们需要在移除后依旧存在的 viewController ）：

``` swift
override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated)

    dch_checkDeallocation()
}
```

当有内存泄漏时，我们将能看到 assert 处的错误提示（only in -0none builds）：

![image1](http://holko.pl/public/images/deallocation_checker@2x.png)

从这个角度来看，我们可以很简单的开启  (awesome) [Memory Graph Debugger](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/debugging_with_xcode/chapters/special_debugging_workflows.html#//apple_ref/doc/uid/TP40015022-CH9-DontLinkElementID_1) 用来审查或是修复引用循环。

我认为这很方便，我们可以快速的感知到新引入的引用循环的存在。我希望你也会喜欢使用它！更详细的使用过程请看 [GitHub: DeallocationChecker](https://github.com/fastred/DeallocationChecker)（有更多评论和#if DEBUG检查）。