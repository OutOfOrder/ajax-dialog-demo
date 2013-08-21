(function() {
  window.AjaxDialog = {
    _hooks: {
      setup: {},
      response: {}
    },
    hasHook: function(type, name) {
      return (name in this._hooks[type]);
    },
    callHook: function(type, name, obj) {
      if (this.hasHook(type, name)) {
        this._hooks[type][name].apply(obj, Array.prototype.slice.apply(arguments, [3]));
      }
    },
    registerHook: function(type, name, func) {
      if (this._hooks[type] == undefined) {
        $.error("Invalid hook " + type);
      }
      this._hooks[type][name] = func;
    },
    setup: function() {
      $('body').on('click', '.ajax-dialog', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $container = $('<div/>').appendTo('body');

        // extracted out of bootstrap.js to "pre" do the modal backdrop
        var doAnimate = $.support.transition;
        var $loader = $('<div class="modal-backdrop fade"/>').appendTo(document.body);
        $loader.on('click', function() {
          var options = $('.modal', this).data('dialogOptions') || {};
          if (options.static != 'static') {
            $container.children('.modal').modal('hide');
          }
        });
        if (doAnimate) $loader[0].offsetWidth; // force reflow
        $loader.addClass('in');
        if (doAnimate) $loader.one($.support.transition.end);

        $container.load(this.href, function(response, status, xhr) {
          if (status == 'error') {
            alert("Error handling action");
            $loader.remove();
            return;
          }
          var $modal = $(this).children('.modal').first();
          $modal.modal({
            backdrop: false
          }).on('hide', function() {
            $loader.removeClass('in');
            if ($.support.transition) $loader.one($.support.transition.end);
          }).on('hidden', function() {
            $loader.remove();
            $container.remove();
          });
          var options = $modal.data('dialog-options') || {};
          if ((options.nobindform === undefined) && ($modal.find('form').data('remote') !== undefined))
          {
            $modal.on('ajax:success', function(e, data, status, xhr) {
//              console.log('Ajax Success:', arguments);
              if ($.isPlainObject(data)) {
                if (data.action == 'close') {
                  $(this).closest('.modal').modal('hide');
                } else if (data.action == 'replace') {
                  if (data.selector) {
                    $(data.selector).replaceWith(data.html);

                    if (data.animate) {
                      $elem = $(data.selector);
                      $elem.before("<div/>");
                      $elem.prev()
                          .width($elem.width())
                          .height($elem.height())
                          .css({
                              "position": "absolute",
                              "background-color": "#ffff99",
                              "opacity": ".7"   
                          })
                          .fadeOut(1000);
                    }
                  } else {
                    $(this).find('.modal-body').html(data.html);
                  }
                } else if (data.action == 'redirect') {
                  window.location = data.url;
                } else if (data.action == 'reload') {
                  window.location.reload(true);
                } else if (data.action == 'append') {
                  if (data.animate) {
                    var $elem = $(data.html).css({'opacity': 0});
                    $(data.selector).append($elem);
                    $elem.animate({'opacity': 1});
                  } else {
                    $(data.selector).append(data.html);
                  }
                }
                if (data.dismiss) {
                  $(this).closest('.modal').modal('hide');
                }
                if (data.notice !== undefined) {
                  $.jGrowl(data.notice, { header: '<i class="icon-info-sign"></i> Notice', life: 5000});
                }
                if (data.alert !== undefined) {
                  $.jGrowl(data.alert, { header: '<i class="icon-exclamation-sign"></i> Alert', life: 5000 });
                }
                if (AjaxDialog.hasHook('response', options.responseHook)) {
                  AjaxDialog.callHook('response', options.responseHook, $modal, data, status);
                }
              }
            }).on('ajax:error', function() {
              console.log('Ajax Failure:', arguments);
            });
          }
          if (AjaxDialog.hasHook('setup', options.setupHook)) {
            AjaxDialog.callHook('setup', options.setupHook, $modal);
          }
        });
      });
    }
  };
})();

$(function() {
  AjaxDialog.setup();
});