"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/*
This widget does the same a the mouse widget in jqueryui.
*/
var simple_widget_1 = require("./simple.widget");
var MouseWidget = /** @class */ (function (_super) {
    __extends(MouseWidget, _super);
    function MouseWidget() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mouseDown = function (e) {
            // Is left mouse button?
            if (e.which !== 1) {
                return;
            }
            var result = _this.handleMouseDown(_this.getPositionInfo(e));
            if (result) {
                e.preventDefault();
            }
            return result;
        };
        _this.mouseMove = function (e) {
            return _this.handleMouseMove(e, _this.getPositionInfo(e));
        };
        _this.mouseUp = function (e) {
            return _this.handleMouseUp(_this.getPositionInfo(e));
        };
        _this.touchStart = function (e) {
            var touchEvent = e.originalEvent;
            if (touchEvent.touches.length > 1) {
                return;
            }
            var touch = touchEvent.changedTouches[0];
            return _this.handleMouseDown(_this.getPositionInfo(touch));
        };
        _this.touchMove = function (e) {
            var touchEvent = e.originalEvent;
            if (touchEvent.touches.length > 1) {
                return;
            }
            var touch = touchEvent.changedTouches[0];
            return _this.handleMouseMove(e, _this.getPositionInfo(touch));
        };
        _this.touchEnd = function (e) {
            var touchEvent = e.originalEvent;
            if (touchEvent.touches.length > 1) {
                return;
            }
            var touch = touchEvent.changedTouches[0];
            return _this.handleMouseUp(_this.getPositionInfo(touch));
        };
        return _this;
    }
    MouseWidget.prototype.setMouseDelay = function (mouseDelay) {
        this.mouseDelay = mouseDelay;
    };
    MouseWidget.prototype.init = function () {
        this.$el.on("mousedown.mousewidget", this.mouseDown);
        this.$el.on("touchstart.mousewidget", this.touchStart);
        this.isMouseStarted = false;
        this.mouseDelay = 0;
        this.mouseDelayTimer = null;
        this.isMouseDelayMet = true;
        this.mouseDownInfo = null;
    };
    MouseWidget.prototype.deinit = function () {
        this.$el.off("mousedown.mousewidget");
        this.$el.off("touchstart.mousewidget");
        var $document = jQuery(document);
        $document.off("mousemove.mousewidget");
        $document.off("mouseup.mousewidget");
    };
    MouseWidget.prototype.handleMouseDown = function (positionInfo) {
        // We may have missed mouseup (out of window)
        if (this.isMouseStarted) {
            this.handleMouseUp(positionInfo);
        }
        this.mouseDownInfo = positionInfo;
        if (!this.mouseCapture(positionInfo)) {
            return;
        }
        this.handleStartMouse();
        return true;
    };
    MouseWidget.prototype.handleStartMouse = function () {
        var $document = jQuery(document);
        $document.on("mousemove.mousewidget", this.mouseMove);
        $document.on("touchmove.mousewidget", this.touchMove);
        $document.on("mouseup.mousewidget", this.mouseUp);
        $document.on("touchend.mousewidget", this.touchEnd);
        if (this.mouseDelay) {
            this.startMouseDelayTimer();
        }
    };
    MouseWidget.prototype.startMouseDelayTimer = function () {
        var _this = this;
        if (this.mouseDelayTimer) {
            clearTimeout(this.mouseDelayTimer);
        }
        this.mouseDelayTimer = window.setTimeout(function () {
            _this.isMouseDelayMet = true;
        }, this.mouseDelay);
        this.isMouseDelayMet = false;
    };
    MouseWidget.prototype.handleMouseMove = function (e, positionInfo) {
        if (this.isMouseStarted) {
            this.mouseDrag(positionInfo);
            return e.preventDefault();
        }
        if (this.mouseDelay && !this.isMouseDelayMet) {
            return true;
        }
        if (this.mouseDownInfo) {
            this.isMouseStarted = this.mouseStart(this.mouseDownInfo) !== false;
        }
        if (this.isMouseStarted) {
            this.mouseDrag(positionInfo);
        }
        else {
            this.handleMouseUp(positionInfo);
        }
        return !this.isMouseStarted;
    };
    MouseWidget.prototype.getPositionInfo = function (e) {
        return {
            pageX: e.pageX,
            pageY: e.pageY,
            target: e.target,
            originalEvent: e
        };
    };
    MouseWidget.prototype.handleMouseUp = function (positionInfo) {
        var $document = jQuery(document);
        $document.off("mousemove.mousewidget");
        $document.off("touchmove.mousewidget");
        $document.off("mouseup.mousewidget");
        $document.off("touchend.mousewidget");
        if (this.isMouseStarted) {
            this.isMouseStarted = false;
            this.mouseStop(positionInfo);
        }
    };
    return MouseWidget;
}(simple_widget_1["default"]));
exports["default"] = MouseWidget;
