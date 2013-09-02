GAP.js
===

GAP (which stands for Google Analytics Painless)  is a Javascript wrapper that supports the "classic version" (ga.js) and the new universal analytics (analytics.js) with some cool features like javascript error tracking with a single line of code.

## How it works

GAP autodetects the current version of analytics and provides you a easy to use API that is compatible with both versions so if you want to switch to universal analytics tomorrow, just change one line of code instead of your whole site!

It has javascript error tracking implemented and uses the information of window.onerror event to get the exception, file and line of the error, then parses that data and triggers an event to analytics so you can automatically track javascript errors in all your pages in a really easy way.

Another cool thing is the way you can assign events to dom objects.
For example, you can just pass the name of the event and the dom object as parameters to the GAP.track.element function if you are using data-attributes to store the content of the event params:
```html
<a href="http://somewhere.com" data-ga-category="Event-cat" data-ga-action="my action" data-ga-label="some label" data-ga-value="1">my link!</a>
```
Also there the events are attached in a cross browser clean way so there is no need to include any external library to do this. GAP.track.addListener handles that for you

Try out the working demo here : http://makeitsolutions.com/labs/GAP/

## Examples
Just be sure to include the library and your custom script at the bottom of the page (before closing the body tag)

```javascript

//========= Enable error tracking ===========
GAP.track.errors();

//========= Cross browser event tracking using data attributes ===========
GAP.track.element('click',document.getElementById("btn-download"));


/* Expected data attributes are:
	- data-ga-category (required)
 	- data-ga-action (required) 
 	- data-ga-label 
    - data-ga-value 
*/


//========= Cross browser event tracking with custom values ===========
GAP.track.addListener(document.getElementById("btn-download-bottom"),'click',function(){
  GAP.track.event('buttons','download','v0.0.1','1');

});

//========= Using jQuery and data attributes it's even easier! ===========
$("[data-ga-category]").each(function(e){
	GAP.track.element("click",this);
});

//======== E-commerce transactions in just one step! ==============//

	var items = [{
                  'id':'2',
                  'code':'XX2',
                  'name':'prod-name',
                  'cat-name':'products',
                  'price':'19',
                  'quantity':'1'
                }];

    GAP.track.transaction(id,store_name,total,shipping,tax,currency, items );






```

Enjoy!