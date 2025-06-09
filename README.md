d3.forceStraighten
==================

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![NPM Downloads][npm-downloads-img]][npm-downloads-url]

This force transforms flexible sequences of nodes into straighter configurations by identifying arms—linear chains of nodes where each internal node connects to exactly two others—and nudging them toward alignment.

Under the hood, it uses linear regression to find the best-fit line through each arm, then applies a spring-like force that pulls each node toward that line. The farther a node is from alignment, the stronger the corrective force, encouraging long arms to behave like stiff rods instead of floppy chains.

This force plugin is designed to be used with the [d3-force](https://github.com/d3/d3-force) simulation engine. It is also compatible with [d3-force-3d](https://github.com/vasturiano/d3-force-3d) and can function in a one, two (default) or three-dimensional space.

## Quick start

```js
import d3ForceStraighten from 'd3-force-straighten';
```
or using a *script* tag
```html
<script src="//cdn.jsdelivr.net/npm/d3-force-straighten"></script>
```
then
```js
d3.forceSimulation()
  .nodes(<myNodes>)
  .force('straighten-arms', d3.forceStraighten(<myLinks>));
```

## API reference

| Method                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |   Default    |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------:|
| <b>links</b>([<i>array</i>])                        | Sets or gets the list of links connecting nodes. Each link should follow the syntax: `{source: <node-id or node-object>, target: <node-id or node-object>}`.                                                                                                                                                                                                                                                                                                                               |      []      |
| <b>id</b>([<i>fn</i>])                              | Sets or gets the node object unique id accessor function, used by links to reference nodes.                                                                                                                                                                                                                                                                                                                                                                                                | `node.index` |
| <b>strength</b>([<i>num</i>]) | Sets or gets the force strength. Defines how strongly nodes are pulled toward their best-fit straight line. A value of `0` disables the force; `1` applies full strength. | 1 |
| <b>considerAlpha</b>([<i>num</i>]) | Sets or gets whether the force intensity should decrease or not as alpha decays and the simulation cools down.                                                                                                              | `false` |


## ❤️ Support This Project

If you find this module useful and would like to support its development, you can [buy me a ☕](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url). Your contributions help keep open-source sustainable!
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=L398E7PKP47E8&currency_code=USD&source=url)

[npm-img]: https://img.shields.io/npm/v/d3-force-straighten
[npm-url]: https://npmjs.org/package/d3-force-straighten
[build-size-img]: https://img.shields.io/bundlephobia/minzip/d3-force-straighten
[build-size-url]: https://bundlephobia.com/result?p=d3-force-straighten
[npm-downloads-img]: https://img.shields.io/npm/dt/d3-force-straighten
[npm-downloads-url]: https://www.npmtrends.com/d3-force-straighten
