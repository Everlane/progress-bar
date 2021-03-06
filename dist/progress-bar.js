(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('ProgressBar', ['exports', 'module', 'jquery'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.$);
    global.ProgressBar = mod.exports;
  }
})(this, function (exports, module, _jquery) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _$ = _interopRequireDefault(_jquery);

  ;

  /*
  A thin progress bar that sits at the top of the page
  
  When `.start()` is called, the bar will animate all
  the way to the specified `stopPoint`, where it will
  sit patiently until you call `.end()` on it.
   */
  var ProgressBar;

  ProgressBar = (function () {
    ProgressBar.prototype.delayStartTimeout = null;

    ProgressBar.prototype.timeout = null;

    function ProgressBar(options) {
      var defaults;
      this.progress = 0;
      defaults = {
        baseIncrementAmount: 25,
        stopPoint: 98,
        selector: '.progress-bar'
      };
      this.options = _$['default'].extend({}, defaults, options);
      this.element = (0, _$['default'])(this.options.selector);
      return this;
    }

    ProgressBar.prototype.start = function (delay) {
      if (delay == null) {
        delay = 0;
      }
      this.stop();
      this.delayStartTimeout = setTimeout((function (_this) {
        return function () {
          _this.reset();
          return _this.trickle();
        };
      })(this), delay);
      return this;
    };

    ProgressBar.prototype.stop = function () {
      clearTimeout(this.delayStartTimeout);
      clearTimeout(this.timeout);
      if (this.progress) {
        return this.element.velocity({
          width: '100%',
          opacity: 0
        }, {
          complete: _$['default'].proxy(this.reset, this)
        });
      }
    };

    ProgressBar.prototype.reset = function () {
      this.progress = 0;
      this.element.css('width', 0).velocity({
        opacity: 1
      });
      return clearTimeout(this.timeout);
    };

    /*
    Increments the loading bar until it has reached it's
    final resting spot, as defined by `@options.stopPoint`.
    
    @param {Number} delta the amount to move the progress bar
     */

    ProgressBar.prototype.trickle = function (delta) {
      if (this.progress <= this.options.stopPoint) {

        /*
        We are using a dynamic multipler to generate the progress
        delta so as the loading bar approaches 100%, we can
        increment it in increasingly smaller amounts.
         */
        this.progress += this.options.baseIncrementAmount * this.multiplier() * Math.random();
        return this.timeout = setTimeout((function (_this) {
          return function () {
            _this.element.velocity({
              width: _this.progress + '%'
            });
            return _this.trickle();
          };
        })(this), this.progress ? 100 + 500 * Math.random() : 0);
      } else {
        return clearTimeout(this.timeout);
      }
    };

    /*
    Used to generate a number that will be multiplied against
    `this.baseIncrementAmount`. This makes it so as the progress
    bar nears completion, it will grow in smaller and smaller
    increments, approaching `@options.stopPoint`.
     */

    ProgressBar.prototype.multiplier = function () {
      if (this.progress < 0.5 * this.optionsstopPoint) {
        return 0.9;
      } else if (this.progress < 0.8 * this.options.stopPoint) {
        return 0.5;
      } else if (this.progress < this.options.stopPoint) {
        return 0.2;
      } else {
        return 0;
      }
    };

    return ProgressBar;
  })();

  module.exports = ProgressBar;
});
