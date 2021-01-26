// electron package mock

const app = {
  on(event, cb) {
    cb()
  }
}

const screen = {
  getPrimaryDisplay() {
    return {
      workArea: {
        height: 600,
        width: 800
      }
    }
  }
}

class BrowserWindow {
  constructor(param) {
    this.spyConstructor(param)
  }
  addBrowserView() {}
  getBounds() {
    return { width: 800, height: 600 }
  }
  on(event, cb) {}

  spyConstructor(param) {}
}

class BrowserView {
  constructor(param) {
    this.spyConstructor(param);
    const self = this

    this.webContents = {
      setUserAgent(ua) {
        self.spySetUserAgent(ua)
        return Promise.resolve(ua)
      },
      loadURL(url) {
        self.spyLoadURL(url)
        return Promise.resolve()
      },
      insertCSS(css) {
        self.spyInsertCSS(css)
        return Promise.resolve(css)
      },
      on(event, cb) {
        self.spyOn(event)
        cb()
      }
    }
  }
  setBounds() {}

  spyConstructor(param) {}
  spySetUserAgent(ua) {}
  spyLoadURL(url) {}
  spyInsertCSS(css) {}
  spyOn(event) {}
}

module.exports = {
  app,
  screen,
  BrowserWindow,
  BrowserView
}
