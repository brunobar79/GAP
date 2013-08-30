
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
        if (_version=="universal") {
          ga('send', 'pageview');
        }else{
          _gaq.push('_trackPageview', url);
        }
        if(_debug){
          _log("Pageview tracked with url "+url);
        }
    }
    

    function _transaction(id,affiliation,revenue,shipping,tax,currency, items){

      //Fix for non required fields
      if(affiliation==null || affiliation==undefined){
        var affiliation="";
      }
      if(shipping==null || shipping==undefined){
        var shipping="";
      }

      if(tax==null || tax==undefined){
        var tax="";
      }


      if(_version=="universal"){

        if(currency==null || currency==undefined){
          var currency="";
        }

        //REQUIRE E-COMMERCE PLUGIN
        ga('require', 'ecommerce', 'ecommerce.js');

        var transaction_data = {
                                'id': id,                     // Transaction ID. Required.
                                'affiliation': affiliation,   // Affiliation or store name.
                                'revenue': revenue,               // Grand Total.
                                'shipping': shipping,                  // Shipping.
                                'tax': tax
                              };
        if(currency!=null && currency!=undefined && currency!=""){
          transaction_data['currency'] =  currency;
        }

        ga('ecommerce:addTransaction', transaction_data);

        for(var i=0;i<items.length;i++){
          var item = items[i];
          if(item.name==null || item.name==undefined)item.name="";
          if(item.code==null || item.code==undefined)item.code="";
          if(item.category==null || item.category==undefined)item.category="";
          if(item.price==null || item.price==undefined)item.price="";
          if(item.quantity==null || item.quantity==undefined)item.quantity="";

          //ITEMS
          ga('ecommerce:addItem', {
            'id': item.id,                     // Transaction ID. Required.
            'name': item.name,                // Product name. Required.
            'sku': item.code,                // SKU/code.
            'category': item.category,      // Category or variation.
            'price': item.price,           // Unit price.
            'quantity': item.quantity,    // 
          });
        }

        ga('ecommerce:send');
      
      }else{

          if(currency!=null && currency!=undefined && currency!=""){
             _gaq.push(['_set', 'currencyCode', currency]);
          }

          _gaq.push(['_addTrans',
            id,               // transaction ID - required
            affiliation,      // affiliation or store name
            revenue,          // total - required
            shipping,         // tax
            tax              // shippinng
          ]);


          for(var i=0;i<items.length;i++){
            
            var item = items[i];
            
            if(item.name==null || item.name==undefined)item.name="";
            if(item.code==null || item.code==undefined)item.code="";
            if(item.category==null || item.category==undefined)item.category="";
            if(item.price==null || item.price==undefined)item.price="";
            if(item.quantity==null || item.quantity==undefined)item.quantity="";

            _gaq.push(['_addItem',
              item.id,           // transaction ID - required
              item.code,           // SKU/code - required
              item.name,        // product name
              item.category,   // category or variation
              item.price,          // unit price - required
              item.quantity               // quantity - required
            ]);
          }

          _gaq.push(['_trackTrans']);
      }
      if(_debug){
        _log("transaction created succesfully!");
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
        transaction: _transaction,
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


