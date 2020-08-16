---
title: "The Developer Framework Lifecycle"
description: "Methods of acceleration and control."
written: "2020-08-15T00:00:00+00:00"
---

I started my career by working on developer frameworks, specifically infrastructure to better facilitate product development. I was fortunate enough to have the opportunity to extend the framework and enable a new class of functionality. Because the functionality I was enabling was highly sought after, I had a lot of interested individuals happy to mentor and make sure the project went well. (I cannot overstate how grateful I was to have the opportunity to lead that project early on.)

It was in one of those meetings, discussing how to best design the APIs we would be exposing to developers, when I got one of the better pieces of advice regarding framework design:

> Developer frameworks start as methods of acceleration and end as methods of control

## Acceleration

The reason why developers will adopt your framework ultimately reduces to some variant of "it will accelerate them": it's possible it accelerates them through:

- Structuring their thinking (e.g. React);
- Abstracting a platform (e.g. Firebase); or
- Handling and abstracting away complexity (e.g. Tensorflow)

The reason why accelerating developers is so important is because fundamentally it is one of the only value props you _can_ provide. In the case of things like React and Tensorflow, developers are fundamentally able to build what you are providing them, and so their incentive is to only adopt your thing if it somehow accelerates them (putting off learning, handing off building, or offloading maintence).

_Note: There is a notable exception around frameworks you are mandated to use in order to develop for a platform, e.g. the iOS APIs / Hardware SDKs. Those don't need to provide value beyond allowing you to develop for a new platform._

## Control

As a framework gains in popularity, it will enter the second phase of it's lifecycle, "Control".

The framework authors got many different teams to conform to their various codebases and programming styles to conform to a common set of APIs. The more people using the framework, the more leverage there is in changing the implementation (as you're now suddenly affecting N codepaths at once). This leverage point becomes the best place where organizations and individuals can exert influence to change developer behavior and gate what is and isn't possible.

> “We shape our tools and, thereafter, our tools shape us.” — John Culkin

While "control" has a bad connotation, it doesn't have to be malicious. Examples of "good control" are UI frameworks / design systems which force the resulting UIs to be accessible, or ML frameworks which force the models to be serializable.

## Platformitization

As a framework starts to push the author's opinions on the users, the framework maintains control through platformitization. Because of its "market share" and the relative leverage, new frameworks and tooling are built on top of it. This causes more and more teams to adopt your framework and raises the barrier to leave to existing developers. Said another way, developer frameworks experience an inherent network effect.

As an organization, you want to be thoughtful about which frameworks you build, adopt, and open source because they will end up and allow you to influence the direction of development. And in open source: **if you don't build it, somebody else will**.
