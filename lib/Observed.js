"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global IntersectionObserver */

var Element = Element || require("html-element");

var Observed = function (_Component) {
  _inherits(Observed, _Component);

  function Observed(props) {
    _classCallCheck(this, Observed);

    var _this = _possibleConstructorReturn(this, (Observed.__proto__ || Object.getPrototypeOf(Observed)).call(this, props));

    _this.mapRef = function (ref) {
      _this.el = ref;
    };

    _this.handleIntersection = function (entries, observer) {
      var _this$props = _this.props,
          intersectionRatio = _this$props.intersectionRatio,
          once = _this$props.once,
          onChange = _this$props.onChange,
          onEnter = _this$props.onEnter,
          onExit = _this$props.onExit,
          onIntersect = _this$props.onIntersect;


      entries.forEach(function (entry) {
        var noIntersection = entry.intersectionRatio === 0;
        var isInView = entry.intersectionRatio >= intersectionRatio && !noIntersection;

        // Intersect handler
        onIntersect && onIntersect(entry);

        if (isInView !== _this.state.isInView) {
          // update if we've transitioned to a different state
          _this.setState(function () {
            return { isInView: isInView };
          });

          // Call handlers
          onChange && onChange(isInView);
          isInView && onEnter && onEnter();
          !isInView && onExit && onExit();
        }

        if (isInView && once) {
          // if once is true, disconnect after the element is in view.
          _this.disconnectObserver();
        }
      });
    };

    _this.state = {
      isInView: props.initialViewState
    };
    return _this;
  }

  _createClass(Observed, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createObserver();
      this.observe();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.disconnectObserver();
    }
  }, {
    key: "createObserver",
    value: function createObserver() {
      this.checkForObserver();

      // merge options with defaults
      var defaultOptions = this.constructor.defaultProps.options;
      var options = Object.assign({
        threshold: this.props.intersectionRatio // default to intersectionRatio if no threshold is provided as an option
      }, defaultOptions, this.props.options);

      this.observer = new IntersectionObserver(this.handleIntersection, options);
    }
  }, {
    key: "checkForObserver",
    value: function checkForObserver() {
      var hasObserver = "IntersectionObserver" in window;
      if (!hasObserver) {
        throw new Error("Must provide an IntersectionObserver polyfill for browsers that do not yet support the technology.");
      }
    }
  }, {
    key: "disconnectObserver",
    value: function disconnectObserver() {
      if (this.observer) {
        this.observer = this.observer.disconnect();
      }
    }
  }, {
    key: "observe",
    value: function observe() {
      if (!this.el) {
        throw new Error("Must provide a ref to the DOM element to be observed.");
      }

      var el = this.el;
      this.observer.observe(el);
    }
  }, {
    key: "render",
    value: function render() {
      var isInView = this.state.isInView;
      var mapRef = this.mapRef;


      return this.props.children({ isInView: isInView, mapRef: mapRef });
    }
  }]);

  return Observed;
}(_react.Component);

Observed.defaultProps = {
  initialViewState: false,
  intersectionRatio: 0, // intersect ratio that the element is considered "in view"
  once: false, // remove after the el has intersected the view
  options: {
    root: null, // document.querySelector('#scrollArea')
    rootMargin: "0px" // margin around observed element
    // threshold: 0, // default to props.intersectionRatio
  }
};
Observed.propTypes = {
  children: _propTypes2.default.func.isRequired,
  initialViewState: _propTypes2.default.bool.isRequired,
  intersectionRatio: _propTypes2.default.number.isRequired,
  once: _propTypes2.default.bool.isRequired,
  onEnter: _propTypes2.default.func,
  onExit: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onIntersect: _propTypes2.default.func,
  options: _propTypes2.default.shape({
    root: _propTypes2.default.instanceOf(Element),
    rootMargin: _propTypes2.default.string,
    threshold: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.number])
  })
};
exports.default = Observed;