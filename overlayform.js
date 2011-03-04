(function($){
  var elements,
        methods = {
          init : function(){
            elements = this;
            
            return this.each(function(){
              var $this = $(this),
                  data = $this.data('overlayform');
       
              if (!data){ //If the plugin hasn't been initialized yet
                $this.overlayForm('bind');
      
                $(this).data('overlayform', {
                    target : $this
                });
              }
              
            });
          },
          bind: function(){
            var target = this,
                  bubbleObject;

            target.bind('overlay.fill',function(){
              $(this).data('overlayform').content = $.fn.formBubble.bubbleObject;
            });
      
            target.bind('overlay.open',function(){
              var overlayContent = ($(this).data('overlayform')) ? $(this).data('overlayform').content : false,
                    overlayVisible = (overlayContent) ? $.contains(document, overlayContent[0]) : false,
                    rightSpace = $(window).width() - (target.offset().left + target.width()),
                    leftSpace = target.offset().left,
                    align = (leftSpace > rightSpace) ? 'left' : 'right',
                    targetWidth = target.width();

              if (overlayVisible){ //close bubble if 2nd click
                $.fn.formBubble.close(overlayContent);
                return false;
              }
              
              targetWidth = (align==='right' && targetWidth > 0) ? targetWidth * -1 : targetWidth + 14;
              
              if (elements.length) elements.removeClass('above-form-bubble');

              target
                .formBubble({
                  alignment: {
                    bubble: align
                  },
                  graphics: {
                    close: false,
                    pointer: false
                  },
                  offset: {
                      x: targetWidth,
                      y: 3
                  },
                  animation: {
                      slide: false,
                      speed: 0
                  },
                  callbacks : {
                      onOpen: function(){ },
                      onClose: function(){
                        target.removeClass('above-form-bubble');
                      }
                  }
                })
                .addClass('above-form-bubble')
                .trigger('overlay.fill');

              return false;
            });
          },
          destroy : function(){
            return this.each(function(){
              var $this = $(this),
                  data = $this.data('overlayform');

              //unbind overlayform events
              $this.unbind('.open');
              $this.unbind('.fill');
              
              //remove overlayform data
              $this.removeData('overlayform');
              
              //remove overlayform DOM element
              if (data && data.content) data.content.remove();
            });
          }
        };

  $.fn.overlayForm = function(method){
    if (methods[method]){
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ){
      return methods.init.apply( this, arguments );
    }else{
      $.error( 'Method ' +  method + ' does not exist on $.overlayform' );
    }    
  };

})(jQuery);