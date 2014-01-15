'use strict';
/* global Skycons */

// skycons directive for https://github.com/darkskyapp/skycons
// there's a bug in skycons code: set() doesn't take string (only skycons.ICON_OBJECT)

angular.module('skycons', [])
    .directive('skycon', [function() {

      var defaults = {
        width: 64,
        height: 64,
        name: 'clear-day',
        options: {
          color: 'white',
          resizeClear: false
        }
      };

      var skycons = [], name = [], pause = [], options = [], instance = 0;

      function trueEnough(v) {
        if (!v) {
          return false;
        } else if (v === '0' || v.toLowerCase() === 'no' || v.toLowerCase() === 'false') {
          return false;
        } else {
          return true;
        }
      }

      /*
       var iconNames = [
       'clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'cloudy', 'rain',
       'sleet', 'snow', 'wind', 'fog'
       ];
       */

      function controller($scope) {

      }

      function compile(element, attrs) {
        var id = 'skycon_' + (instance++);
        if (attrs.id === 'duh') {
          element[0].id = id;
          attrs.id = element[0].id;
        } else {
          element[0].id = element[0].id.split(' ')[0];
          attrs.id = element[0].id;
        }
        return {
          pre: null,
          post: link
        };
      }

      function link(scope, element, attrs) {

        var me = element[0].id;

        name[me] = defaults.name;
        pause[me] = false;
        options[me] = defaults.options;

        setWidth(defaults.width);
        setHeight(defaults.height);
        make(me);

        function setWidth(w) {
          element[0].width = w;
        }

        function setHeight(h) {
          element[0].height = h;
        }

        function make(me) {
          if (skycons[me]) {
            skycons[me].remove(me);
          }
          skycons[me] = new Skycons(options[me]);
          skycons[me].add(me, name[me]);
          if (!pause[me]) {
            skycons[me].play();
          }
        }

        attrs.$observe('name', function(value) {
          var me = element[0].id;
          if (value) {
            name[me] = value;
            make(me); // this could be just a 'set' instead of add
          }
        });
        attrs.$observe('width', function(value) {
          if (value) {
            setWidth(value);
          }
        });
        attrs.$observe('height', function(value) {
          if (value) {
            setHeight(value);
          }
        });
        attrs.$observe('color', function(value) {
          var me = element[0].id;
          if (value) {
            options[me].color = value;
            make(me);
          }
        });

        attrs.$observe('pause', function(value) {
          var me = element[0].id;
          if (trueEnough(value)) {
            skycons[me].pause();
            pause[me] = true;
          } else {
            skycons[me].play();
            pause[me] = false;
          }
        });

      }

      function template(scope) {
        var html = '<canvas id="duh"></canvas>';  // id will by overridden in compile
        return html;
      }

      return {
        restrict: 'E',
        replace: true,
        scope: {
          name: '@',
          width: '@',
          height: '@',
          color: '@',
          pause: '@'
        },
        compile: compile,
        controller: controller,
        template: template
      };
    }

    ])
;