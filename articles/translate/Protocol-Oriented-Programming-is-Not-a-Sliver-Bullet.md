# Protocol Oriented Programming is Not a Sliver Bullet 
*为什么需要批判性的使用面向协议编程*
[原文](http://chris.eidhof.nl/post/protocol-oriented-programming/)  From [@chriseidhof](http://www.twitter.com/chriseidhof/)

在 Swift 语言中，面向协议编程是现在的潮流，有很多 Swift 代码是 “面向协议” 的， 在一些开源库中甚至将其定义为一种功能。我认为在 Swift 中 protocol 被过度使用了，在通常情况下问题可以使用更简单的方法来解决问题。总而言之：不要教条的使用（或者不去使用）protocol 。

在 WWDC 2015 中有一个意义非凡 Session 叫做 [Protocol-Oriented Programming in Swift](https://developer.apple.com/videos/play/wwdc2015/408/) 。其中展现了如何使用面向协议的解决方法（protocol 和实现 protocol 的类型）取代类的继承体系（ superclass 和他的子类们)，面向协议的解决方法相对简单且更灵活。 例如，一个 Class 只能有一个 superclass 但是某种类型却可以实现多种 protocol 。

让我们来看看 WWDC  演讲中所解决的问题，一系列的画图命令需要被渲染为图形，并且输出 log 到控制台。通过将画图命令定义在 protocol 中，任何描述绘图语义的代码大概都包括在这组 protocol 方法中。 协议扩展也允许你去在 protocol 的基础功能上定义新的绘制功能， 而且任何实现该协议的类型都可以获得新功能没有任何约束。

在如上的例子中，protocol 解决了在多种类型间共享代码的问题。在 Swift 的标准库中， 集合类型们重度的试用了 protocol ,  他们确实是在解决相同的问题。`dropFirst`  被定义在集合类型中， 因而所有的集合类型都不受约束的获得了这个方法。与此同时，有许多与集合类型相关（collection-related）的 protocol 和 类型，在其中查找内容是很困难的。这便是 protocol 的缺点之一，截至目前为止在标准库中 protocol  带来的好处肯定是大于坏处的。

接下来， 我们通过一个例子来展示我们的使用方式，在这里我们有一个 `WebService`  类， 它通过 `URLSession`  来获取实体。（实际上并不加载仍和东西， 只要明白想法就好）：

``` swift
class Webservice {
    func loadUser() -> User? {
        let json = self.load(URL(string: "/users/current")!)
        return User(json: json)
    }
    
    func loadEpisode() -> Episode? {
        let json = self.load(URL(string: "/episodes/latest")!)
        return Episode(json: json)
    }
    
    private func load(_ url: URL) -> [AnyHashable:Any] {
        URLSession.shared.dataTask(with: url)
        // etc.
        return [:] // should come from the server
    }
}
```

上边的代码很简短，并且可以正确的运行。这里没有任何问题，直到需要去测试 `loadUser`  和 `loadEposode` 时。 这时要么选择使用 stub 来 load， 或者使用依赖注入的方式 传入一个 mock 的 `URLSession`  。我们也可以定义一个  URLSession 实现的 protocol  然后传入测试的实例。 然而在这个例子中，有一个更简单的解决方法：我们将需要变化的部分抽出到一个  `struct`  中。

``` swift
struct Resource<A> {
    let url: URL
    let parse: ([AnyHashable:Any]) -> A
}

class Webservice {
    let user = Resource<User>(url: URL(string: "/users/current")!, parse: User.init)
    let episode = Resource<Episode>(url: URL(string: "/episodes/latest")!, parse: Episode.init)
    
    private func load<A>(resource: Resource<A>) -> A {
        URLSession.shared.dataTask(with: resource.url)
        // load asynchronously, parse the JSON, etc. For the sake of the example, we directly return an empty result.
        let json: [AnyHashable:Any] = [:] // should come from the server
        return resource.parse(json)
    }
}
```

现在我们可以测试  user 和 episode 而不用去模拟任何东西：他们只是简单的 struct 值。我们依然需要测试 `load` 方法（而不是像之前需要测试加载每一种资源的方法），接下来我们增加一些 protocol 。

为了替代 `parse` 方法，我们可以创建一个 protocol 用于实现协议的类型可以通过 JSON 来初始化。

``` swift
protocol FromJSON {
    init(json: [AnyHashable:Any])
}

struct Resource<A: FromJSON> {
    let url: URL
}

class Webservice {
    let user = Resource<User>(url: URL(string: "/users/current")!)
    let episode = Resource<Episode>(url: URL(string: "/episodes/latest")!)
    
    private func load<A>(resource: Resource<A>) -> A {
        URLSession.shared.dataTask(with: resource.url)
        // load asynchronously, parse the JSON, etc. For the sake of the example, we directly return an empty result.
        let json: [AnyHashable:Any] = [:] // should come from the server
        return A(json: json)
    }
}
```

上边的代码看起来已经比较简单了，但是这种方式同样限制了可扩展性。例如，如何去定义一个存储 User 的数组的 resource ？(在如上面向协议的示例中，这是无法实现的，也许只能去等 Swift 4 或 5 直到这是可行的为止）。protocol 可以使得事情变得简单，但是我认为它不会自己买单，因为它会大大减少我们创建 Resource 的方式。

做为替代，我们将 user 和 episode 实现为 Resource 协议的类型，并且这样是更普遍的做法，因为

``` swift
protocol Resource {
    associatedtype Result
    var url: URL { get }
    func parse(json: [AnyHashable:Any]) -> Result
}

struct UserResource: Resource {
    let url = URL(string: "/users/current")!
    func parse(json: [AnyHashable : Any]) -> User {
        return User(json: json)
    }
}

struct EpisodeResource: Resource {
    let url = URL(string: "/episodes/latest")!
    func parse(json: [AnyHashable : Any]) -> Episode {
        return Episode(json: json)
    }
}

class Webservice {
    private func load<R: Resource>(resource: R) -> R.Result {
        URLSession.shared.dataTask(with: resource.url)
        // load asynchronously, parse the JSON, etc. For the sake of the example, we directly return an empty result.
        let json: [AnyHashable:Any] = [:]
        return resource.parse(json: json)
    }
}
```
