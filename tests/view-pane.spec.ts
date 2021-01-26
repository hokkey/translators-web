import { BrowserWindow, BrowserView } from 'electron'
import { ViewPane, ViewPaneConf } from '../src/lib/view-pane'

interface BrowserViewMock {
  spyConstructor?: () => any
  spyLoadURL?: () => any
  spyInsertCSS?: () => any
  spySetUserAgent?: () => any
  spyOn?: () => any
  [key:string]: any
}

describe('ViewPane', () => {

  const conf: ViewPaneConf = {
    boundsOffset: {
      height: null,
      width: 0,
      x: 100,
      y: -100,
    },
    url: 'https://www.example.com',
    css: 'body { background: white }',
    useragent: 'test-ua'
  }

  let bw = new BrowserWindow()
  let vp = new ViewPane(BrowserView, conf)

  // setup spy
  const bvSetBoundsSpy = jest.spyOn<BrowserView, 'setBounds'>(BrowserView.prototype, 'setBounds')

  const TestBv = BrowserView as BrowserViewMock
  const bvConstructorSpy = jest.spyOn<BrowserViewMock, 'spyConstructor'>(TestBv.prototype, 'spyConstructor')
  const bvSetUserAgentSpy = jest.spyOn<BrowserViewMock, 'spySetUserAgent'>(TestBv.prototype, 'spySetUserAgent')
  const bvLoadURLSpy = jest.spyOn<BrowserViewMock, 'spyLoadURL'>(TestBv.prototype, 'spyLoadURL')
  const bvInsertCssSpy = jest.spyOn<BrowserViewMock, 'spyInsertCSS'>(TestBv.prototype, 'spyInsertCSS')
  const bvWebContentsOnSpy = jest.spyOn<BrowserViewMock, 'spyOn'>(TestBv.prototype, 'spyOn')

  beforeEach(() => {
    bvConstructorSpy.mockClear()
    bvSetBoundsSpy.mockClear()
    bvSetUserAgentSpy.mockClear()
    bvLoadURLSpy.mockClear()
    bvInsertCssSpy.mockClear()
    bvWebContentsOnSpy.mockClear()
    bw = new BrowserWindow()
    vp = new ViewPane(BrowserView, conf)
  })

  describe('constructor()', () => {
    it('should call the BrowserView constructor', () => {
      expect(bvConstructorSpy).toBeCalledTimes(1)
      expect(bvConstructorSpy).toBeCalledWith({
        webPreferences: {
          contextIsolation: true
        }
      })
    })

    it('should have the url specified with the constructor', () => {
      expect(vp.url).toBe('https://www.example.com')
    })
  })

  describe('mount()', () => {
    it('should call the BrowserWindow.addBrowserView()', () => {
      const addBrowserViewSpy = jest.spyOn<BrowserWindow, 'addBrowserView'>(bw, 'addBrowserView')
      return vp.mount(bw).then(() => {
        expect(addBrowserViewSpy).toBeCalled()
      })
    })

    it('should call BrowserWindow.getBounds()', () => {
      const getBoundsSpy = jest.spyOn<BrowserWindow, 'getBounds'>(bw, 'getBounds')
      return vp.mount(bw).then(() => {
        expect(getBoundsSpy).toBeCalledTimes(1)
      })
    })

    it('should call BrowserWindow.on("resize")', () => {
      const bwOnSpy = jest.spyOn<BrowserWindow, 'on'>(bw, 'on')
      return vp.mount(bw).then(() => {
        expect(bwOnSpy).toBeCalledTimes(1)
        expect(bwOnSpy.mock.calls[0][0]).toBe('resize')
      })
    })

    it('should call setBounds with the calculated Rectangle values', () => {
      return vp.mount(bw).then(() => {
        expect(bvSetBoundsSpy).toBeCalledTimes(1)
        expect(bvSetBoundsSpy).toBeCalledWith({
          // use getBounds() value when the option is null
          height: 600,
          // use the option value as is if it is a zero or plus value
          width: 0,
          x: 100,
          // use (getBounds() - option) if the option value is minus value
          y: 600 - 100,
        })
      })
    })

    it('should call webContents.setUserAgent(conf.useragent)', () => {
      return vp.mount(bw).then(() => {
        expect(bvSetUserAgentSpy).toBeCalledTimes(1)
        expect(bvSetUserAgentSpy).toBeCalledWith('test-ua')
      })
    })

    it('should not call webContents.setUserAgent() if conf.useragent is blank', () => {
      vp = new ViewPane(BrowserView, {
        ...conf,
        useragent: ''
      })

      return vp.mount(bw).then(() => {
        expect(bvSetUserAgentSpy).toBeCalledTimes(0)
      })
    })

    it('should call webContents.on with "dom-ready"', () => {
      return vp.mount(bw).then(() => {
        expect(bvWebContentsOnSpy).toBeCalledTimes(1)
        expect(bvWebContentsOnSpy).toBeCalledWith('dom-ready')
      })
    })

    it('should call webContents.loadURL(conf.url)', () => {
      return vp.mount(bw).then(() => {
        expect(bvLoadURLSpy).toBeCalledTimes(1)
        expect(bvLoadURLSpy).toBeCalledWith('https://www.example.com')
      })
    })

    it('should call webContents.insertCSS(conf.css)', () => {
      return vp.mount(bw).then(() => {
        expect(bvInsertCssSpy).toBeCalledTimes(1)
        expect(bvInsertCssSpy).toBeCalledWith('body { background: white }')
      })
    })

    it('should not call webContents.insertCSS() if conf.css is blank', () => {
      vp = new ViewPane(BrowserView, {
        ...conf,
        css: ''
      })

      return vp.mount(bw).then(() => {
        expect(bvInsertCssSpy).toBeCalledTimes(0)
      })
    })

    it('should resolve with [undefined, conf.css]', () => {
      return vp.mount(bw).then(([isVoid, css]) => {
        expect(isVoid).toBeUndefined()
        expect(css).toBe('body { background: white }')
      })
    })
  })

})
