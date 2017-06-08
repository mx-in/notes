# Protocol Oriented Programming is Not a Sliver Bullet 
*为什么需要批判性的使用面向协议编程*
[原文](http://chris.eidhof.nl/post/protocol-oriented-programming/)

在 Swift 语言中，面向协议编程是现在的潮流，有很多 Swift 代码是 “面向协议” 的， 在一些开源库中甚至将其定义为一种功能。我认为在 Swift 中 protocol 被过度使用了，在通常情况下问题可以使用更简单的方法来解决问题。总而言之：不要教条的使用（或者不去使用）protocol 。

在 WWDC 2015 中有一个非常有影响力的 Session 叫做 [Protocol-Oriented Programming in Swift](https://developer.apple.com/videos/play/wwdc2015/408/) 。其中展现了如何使用面向协议的解决方法（protocol 和实现 protocol 的一类型）取代类的继承体系（ superclass 和他的子类们)，面向协议的解决方法相对简单且更灵活。 例如，一个 Class 只能有一个 superclass 但是某种类型却可以实现多种 protocol 。

让我们来看看 WWDC  演讲中所解决的问题，一系列的画图命令需要被渲染为图形，并且输出 log 到控制台。通过将画图命令写到一个 protocol 中， 


#Swift/Protocol