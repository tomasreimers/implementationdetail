---
title: "[WIP] In Defense of Not Built Here"
description: "On technology, dependencies, and responsibility."
written: "2020-09-13T00:00:00+00:00"
---

One of the ideas that I think is unduely written off is [Not Built Here Syndrome](https://en.wikipedia.org/wiki/Not_invented_here). Coming from Facebook, which is arguably one of the most entrentched in the ideology, to my own startup, I found myself having to form and defend my own opinions on the matter. This post is a writeup of my thoughts; while I think that FB may be a little too polarized, I do think that not enough people give NBHS the credit it's due. There are a lot of advantages to owning everything.

---

First and foremost, I'm of the opinion that this debate is becoming increasingly relevant because the level of code-reuse, and modularity, is changing. Libraries / Framewworks / SDKs used to be reserved for fairly heavy-weight peices of code with fully encapsulated dependencies. The web, and I believe specifically NPM, has changed that level of code-reuse. Now there is a library for everything--[from checking if something is a number to adding padding to a string](https://github.com/parro-it/awesome-micro-npm-packages)--and it's become popularized _not_ to write that utility function for the Nth time, [but instead to import the canonical one from NPM](https://github.com/sindresorhus/ama/issues/10).

_(There's probably an interesting historical examination to be written of how this came about; I suspect that this level of code-reuse was the logical evolution to the StackOverflow Copy/Paste that became so popular, speficically around web code)._

---

With the increased modularity and a package for everything, why would you ever write a utility function again? My understanding is that many JS devs are of the opinion you shouldn't. I also believe that this is a mentality driven by some of the most prolific OSS contributors, for whom it is successful because they are able to support the code they import.

By support, I mean willing to update the code to suit their specific usecase. A package might be a bad fit for your usecase if it is:

- Too broad: e.g. a full utility library (think lodash or underscore) when you only need one method.
- Too narrow: e.g. a function which behaves close to what you want but just needs one more arg / config value

In these cases, the prolific OSS contributor is able to appropriately monkey patch, fork, or extend the library (in the case it's too broad, they implement tree-shaking or code-splitting; in the case it's too narrow, they extend the package). In this way, importing a library has all the benefits of owning it yourself, with the added benefit of N-many other contributors improving various parts of your codebase (and, of course, [never write what you can steal](https://blog.codinghorror.com/never-design-what-you-can-steal/)). Where I think this advice breaks down is when people choose to import libraries that they don't, and are unwilling to, understand or extend.

For many people, updating an OSS library is scary, and for many projects you don't need or want the constant updates that come with a remote package OR your use-case is so specific that it's unlikely the changes you need would get merged upstream. In these cases, which I believe are more common than many people acknowledge, I believe you're better off writing or forking the package yourself.

---

Said as is, I don't believe this is contentious; where it gets contentious is when you look at the boundary of various technologies. How many mobile developers use React Native without understanding how it works? And how many more web developers use Kubernetes without being able to extend it?

**My belief is that you are responsible for any code you choose to introduce into the codebase**. If you choose to import instead of write, that's fine, you just need to be willing to support it. That does not mean you need to read all the source for React Native before you use it; it does mean that it is your responsibility to do risk analysis and decide what maintence might come up and deciding whether you're willing to do that.

Of course, one may argue that would slow them down - and we should focus on dev velocity. However, I think using a library you don't understand is effectively tech debt. Eventually (assuming you don't toss out the code) you will have to extend it; not being intentional about what debt you assume, may let you move faster in the short term and ultimately [slow you down in the long term](https://www.maxsegan.com/note/debt).
