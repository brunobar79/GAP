GAP.js
===

GAP (which stands for Google Analytics Painless)  is a Javascript wrapper that supports the "classic version" (ga.js) and the new universal analytics (analytics.js) with some cool features like javascript error tracking with a single line of code.

## How it works

GAP autodetects the current version of analytics and provides you a easy to use API that is compatible with both versions so if you want to switch to universal analytics tomorrow, just change one line of code instead of your whole site!

It has javascript error tracking implemented and uses the information of window.onerror event to get the exception, file and line of the error, then parses that data and triggers an event to analytics so you can automatically track javascript errors in all your pages in a really easy way.

## Example


```javascript

//========= Enable error tracking ===========
GAP.track.errors();

//========= Cross browser event tracking using data attributes ===========
GAP.track.element('click',document.getElementById("btn-download"));


//========= Cross browser event tracking with custom values ===========
GAP.track.addListener(document.getElementById("btn-download-bottom"),'click',function(){
  GAP.track.event('buttons','download','v0.0.1','1');

});


```

Enjoy!