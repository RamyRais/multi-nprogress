NProgress
=========

[![npm version](https://img.shields.io/npm/v/multi-nprogress.png)](https://npmjs.org/package/multi-nprogress "View this project on npm")
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/multi-nprogress/badge?style=rounded)](https://www.jsdelivr.com/package/npm/multi-nprogress)

> Minimalist progress bar

Slim progress bars for frontend applications.

## Installation

### version 1.0.0 and above
NProgress is an ES6 module available via [npm].

    $ npm install --save nprogress

**Manual:** Download the files and add [nprogress.js] and [nprogress.css] to your project.

```html
<link rel='stylesheet' href='nprogress.css'/>
<script type="module">
  // Import the ES module
  import NProgressModule from './nprogress.js';
</script>
```

### version 0.x.x
NProgress is an UMD module available via [npm].

    $ npm install --save nprogress

**Manual:** Download the files and add [nprogress.js] and [nprogress.css] to your project.

```html
<script src='nprogress.js'></script>
<link rel='stylesheet' href='nprogress.css'/>
```


## Basic usage
you should instantiate the progress bar from default import
```js
var nprogress = NProgress();
```

then Simply call `start()` and `done()` to control the progress bar.

```js
nprogress.start();
nprogress.done();
```


Advanced usage
--------------

__Percentages:__ To set a progress percentage, call `.set(n)`, where *n* is a
number between `0..1`.

~~~ js
var nprogress = NProgress();
nprogress.set(0.0);     // Sorta same as .start()
nprogress.set(0.4);
nprogress.set(1.0);     // Sorta same as .done()
~~~

__Incrementing:__ To increment the progress bar, just use `.inc()`. This
increments it with a random amount. This will never get to 100%: use it for
every image load (or similar).

~~~ js
nprogress.inc();
~~~

If you want to increment by a specific value, you can pass that as a parameter:

~~~ js
nprogress.inc(0.2);    // This will get the current status value and adds 0.2 until status is 0.994
~~~

__Force-done:__ By passing `true` to `done()`, it will show the progress bar
even if it's not being shown. (The default behavior is that *.done()* will not
    do anything if *.start()* isn't called)

~~~ js
nprogress.done(true);
~~~

__Get the status value:__ To get the status value, use `.status`

Configuration
-------------

#### `minimum`
Changes the minimum percentage used upon starting. (default: `0.08`)

~~~ js
nprogress.configure({ minimum: 0.1 });
~~~

#### `template`
You can change the markup using `template`. To keep the progress
bar working, keep an element with `role='bar'` in there. See the [default template]
for reference.

~~~ js
nprogress.configure({
  template: "<div class='....'>...</div>"
});
~~~

#### `easing` and `speed`
Adjust animation settings using *easing* (a CSS easing string)
and *speed* (in ms). (default: `ease` and `200`)

~~~ js
nprogress.configure({ easing: 'ease', speed: 500 });
~~~

#### `trickle`
Turn off the automatic incrementing behavior by setting this to `false`. (default: `true`)

~~~ js
nprogress.configure({ trickle: false });
~~~

#### `trickleSpeed`
Adjust how often to trickle/increment, in ms.

~~~ js
nprogress.configure({ trickleSpeed: 200 });
~~~

#### `showSpinner`
Turn off loading spinner by setting it to false. (default: `true`)

~~~ js
nprogress.configure({ showSpinner: false });
~~~

#### `parent`
Specify this to change the parent container. (default: `body`).
Can either specify a query selector (`#id`, `.class`, `tag`) or an `HTMLElement` directly.

~~~ js
nprogress.configure({ parent: '#container' });
// OR
var elt = document.getElementById('#container')
nprogress.configure({ parent: elt });
~~~

When you want to have multi progress bar in your page you need to give different parent for each
~~~ js
var nprogress1 = NProgress();
var nprogress2 = NProgress();

nprogress1.configure({ parent: '#container1' });
nprogress2.configure({ parent: '#container2' });
~~~
Customization
-------------

Just edit `nprogress.css` to your liking. Tip: you probably only want to find
and replace occurrences of `#29d`.

The included CSS file is pretty minimal... in fact, feel free to scrap it and
make your own!


Support
-------

__Bugs and requests__: submit them through the project's issues tracker.<br>
[![Issues](http://img.shields.io/github/issues/RamyRais/multi-nprogress.svg)]( https://github.com/RamyRais/multi-nprogress/issues )


License
------
This is a fork from [**NProgress**](https://github.com/rstacruz/nprogress) Released under the [MIT License].<br> 



<!-- 
LINKS
-->
[nprogress.js]: https://github.com/RamyRais/multi-nprogress/blob/master/nprogress.js
[nprogress.css]: https://github.com/RamyRais/multi-nprogress/blob/master/nprogress.css

[MIT License]: http://mit-license.org/
[npm]: https://www.npmjs.com/package/multi-nprogress