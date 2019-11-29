"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var electron_1 = require("electron");
var CONST = require("./constants");
var view_pane_1 = require("./lib/view-pane");
electron_1.app.on("ready", function () {
    var win = createWindow();
    var panel = createPanel([
        {
            boundsFn: function () {
                return {
                    height: win.getBounds().height - CONST.GOOGLE_TRANSLATOR_HEIGHT,
                    width: win.getBounds().width,
                    x: 0,
                    y: 0
                };
            },
            url: CONST.GRAMMARLY_URL
        },
        {
            boundsFn: function () {
                return {
                    height: CONST.GOOGLE_TRANSLATOR_HEIGHT,
                    width: win.getBounds().width,
                    x: 0,
                    y: win.getBounds().height - CONST.GOOGLE_TRANSLATOR_HEIGHT
                };
            },
            css: CONST.GOOGLE_TRANSLATOR_CUSTOM_CSS,
            url: CONST.GOOGLE_TRANSLATOR_URL
        },
    ]);
    applyPanel.apply(void 0, __spreadArrays([win], panel));
    win.on("resize", createOnResizeFn.apply(void 0, panel));
});
function createWindow() {
    var workArea = electron_1.screen.getPrimaryDisplay().workArea;
    return new electron_1.BrowserWindow({
        height: Math.min(workArea.height, CONST.MAX_INITIAL_WIN_HEIGHT),
        width: Math.min(workArea.width, CONST.MAX_INITIAL_WIN_WIDTH)
    });
}
function createPanel(configs) {
    return configs.map(function (conf) { return new view_pane_1.ViewPane(conf); });
}
function applyPanel(win) {
    var panel = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        panel[_i - 1] = arguments[_i];
    }
    panel.forEach(function (pane) {
        pane.addTo(win);
        pane.updateBounds();
        pane.loadURL();
        pane.insertCSS();
    });
}
function createOnResizeFn() {
    var panel = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        panel[_i] = arguments[_i];
    }
    return function () {
        panel.forEach(function (pane) { return pane.updateBounds(); });
    };
}
//# sourceMappingURL=main.js.map