"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var ViewPane = /** @class */ (function () {
    function ViewPane(url, boundsFn, css) {
        this.browserView = ViewPane.create();
        this.url = url;
        this.boundsFn = boundsFn;
        this.css = css;
    }
    ViewPane.create = function () {
        var viewConfig = {
            webPreferences: {
                nodeIntegration: false
            }
        };
        return new electron_1.BrowserView(viewConfig);
    };
    ViewPane.prototype.loadURL = function () {
        this.browserView.webContents.loadURL(this.url);
    };
    ViewPane.prototype.insertCSS = function () {
        var _this = this;
        if (this.css) {
            this.browserView.webContents.on("dom-ready", function () {
                _this.browserView.webContents.insertCSS(_this.css);
            });
        }
    };
    ViewPane.prototype.getBrowserView = function () {
        return this.browserView;
    };
    ViewPane.prototype.setBounds = function () {
        this.browserView.setBounds(this.boundsFn());
    };
    return ViewPane;
}());
exports.ViewPane = ViewPane;
//# sourceMappingURL=view-pane.js.map