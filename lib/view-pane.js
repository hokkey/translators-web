"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var ViewPane = /** @class */ (function () {
    function ViewPane(conf) {
        this.browserView = ViewPane.create();
        this.boundsFn = conf.boundsFn;
        this.url = conf.url;
        this.css = conf.css;
    }
    ViewPane.create = function () {
        return new electron_1.BrowserView({
            webPreferences: {
                nodeIntegration: false
            }
        });
    };
    ViewPane.prototype.addTo = function (win) {
        this.parent = win;
        this.parent.addBrowserView(this.browserView);
    };
    ViewPane.prototype.loadURL = function () {
        return this.browserView.webContents.loadURL(this.url);
    };
    ViewPane.prototype.insertCSS = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.css) {
                _this.browserView.webContents.on("dom-ready", function () {
                    resolve(_this.browserView.webContents.insertCSS(_this.css));
                });
            }
            else {
                resolve();
            }
        });
    };
    ViewPane.prototype.updateBounds = function () {
        this.browserView.setBounds(this.boundsFn());
    };
    return ViewPane;
}());
exports.ViewPane = ViewPane;
//# sourceMappingURL=view-pane.js.map