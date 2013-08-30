
var GAP = GAP || {};


GAP.track = (function() {

    function _init(){
      if(typeof(ga)=="function"){
        //universal analytics ready
        _version = "universal";
      }else{
        _gaq = _gaq || [];
        _version = "classic";
      }
      _log("GA detected version: "+_version);
    }

    
    function _element(event_name, element){
      
      var category = element.getAttribute('data-ga-category') || undefined; // required
      var action = element.getAttribute('data-ga-action') || undefined; // required
      var label = element.getAttribute('data-ga-label') || undefined;
      var value = parseInt(element.getAttribute('data-ga-value'), 10) || undefined;

      if (category && action) {
        _addListener(element, event_name,function(){
            _event(category, action, label, value);
        });
      }
    }

    _debug =  true;
    
    
    function _addListener(element, type, callback) {
        if (element.addEventListener) element.addEventListener(type, callback);
        else if (element.attachEvent) element.attachEvent('on' + type, callback);
    }

    
    function _log(data){
        if(window.console){
            if(typeof(data)!="string"){
                for(var i = 0; i < data.length; i++ ) {
                    console.log(data[i]);
                }
            }else{
                console.log(data);
            }
        }
    }

    
    function _event(cat,action,label,value){
        

        if(_version=="universal"){
          var data = {
                        'hitType': 'event',    // Required.
                        'eventCategory': cat,  // Required.
                        'eventAction': action  // Required.
                      };

          if(label!=null){
            data['eventLabel']= label;
          }

          if(value!=null){
            data['eventValue'] = value;
          }
          
          ga('send', data);
          if(_debug){
                   _log(["event tracking sent using ga with data",data]);
          }
          
        
        }else{

          var data = ['_trackEvent', cat, action, label, value];
          
          _gaq.push(data);
          if(_debug){
               _log(["event tracking sent using _gaq with data:",data]);
          }
        }
    }
    
    function _errors(){
        // Do not override previous handler!
        var old_onerror = window.onerror;
        window.onerror = function(msg,url,line) { 
          if (old_onerror){
            old_onerror(msg,url,line);
          }
          _event('JS ERROR', msg, url + ":"+line);
          return false;
        }  
    }

    function _social(network, action, target) {
      if(_version=="universal"){
          _gaq.push(['_trackSocial', network, action, target]);
      }else{
          ga('send', 'social', network, action, target);
      }
      if(_debug){
        _log("Social interaction "+action+" on "+network+" for "+target+" tracked!");
      }
    }

    function _page(url) {
        //console.log(url);
        if (_version=="universal") {
          ga('send', 'pageview');
        }else{
          _gaq.push('_trackPageview', url);
        }
        if(_debug){
          _log("Pageview tracked with url "+url);
        }
    }
    
    _init();


    return {

        init : _init,
        event: _event,
        element: _element,
        errors: _errors,
        social: _social,
        page: _page,
        addListener : _addListener,
        version : function(v){
            if(v)_version = v;
            return _version;
        },
        debug : function(v){
            if(v)_debug = v;
            return _debug;
        }
    };

    

}());

/***** PENDING ***
//REQUIRE E-COMMERCE PLUGIN
ga('require', 'ecommerce', 'ecommerce.js');

//TRANSACTION
ga('ecommerce:addTransaction', {
  'id': '1234',                     // Transaction ID. Required.
  'affiliation': 'Acme Clothing',   // Affiliation or store name.
  'revenue': '11.99',               // Grand Total.
  'shipping': '5',                  // Shipping.
  'tax': '1.29',                     // Tax.
  'currency': 'UYP'
});
//ITEMS
ga('ecommerce:addItem', {
  'id': '1234',                     // Transaction ID. Required.
  'name': 'Fluffy Pink Bunnies',    // Product name. Required.
  'sku': 'DD23444',                 // SKU/code.
  'category': 'Party Toys',         // Category or variation.
  'price': '11.99',                 // Unit price.
  'quantity': '1',
  'currency': 'UYP'                   // Quantity.
});
ga('ecommerce:send');






 _gaq.push(['_addTrans',
    '1234',           // transaction ID - required
    'Acme Clothing',  // affiliation or store name
    '11.99',          // total - required
    '1.29',           // tax
    '5',              // shipping
    'San Jose',       // city
    'California',     // state or province
    'USA'             // country
  ]);

   // add item might be called for every item in the shopping cart
   // where your ecommerce engine loops through each item in the cart and
   // prints out _addItem for each
  _gaq.push(['_addItem',
    '1234',           // transaction ID - required
    'DD44',           // SKU/code - required
    'T-Shirt',        // product name
    'Green Medium',   // category or variation
    '11.99',          // unit price - required
    '1'               // quantity - required
  ]);
  _gaq.push(['_trackTrans']); //submits transaction to the Analytics servers


/*******************/


