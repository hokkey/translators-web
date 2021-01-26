import { BrowserWindow } from 'electron'
import { ViewPane } from '../src/lib/view-pane'
import { calcMinSize, createBrowserWindow, initPanels, mountPanels } from '../src/main'

interface BrowserWindowMock {
  spyConstructor?: () => any
  prototype?: any
}

describe('main', () => {
  const BwMock = BrowserWindow as BrowserWindowMock
  const bwConstructorSpy = jest.spyOn<BrowserWindowMock, 'spyConstructor'>(BwMock.prototype, 'spyConstructor')

  beforeEach(() => {
    bwConstructorSpy.mockClear()
  })

  describe('createBrowserWindow()', () => {
    it('should call the BrowserWindow constructor with correct params', () => {
      createBrowserWindow({
        width: 1000,
        height: 1000,
      },{
        width: 800,
        height: 600
      })
      expect(bwConstructorSpy).toBeCalledTimes(1)
      expect(bwConstructorSpy).toBeCalledWith({
        width: 800,
        height: 600,
        webPreferences: {
          contextIsolation: true
        }
      })
    })
  })

  describe('calcMinSize()', () => {
    it ('should return the WidthHeight with expected values: case-1', () => {
      const result = calcMinSize({
        width: 101,
        height: 99,
      },{
        width: 100,
        height: 100
      })
      expect(result.width).toBe(100)
      expect(result.height).toBe(99)
    })

    it ('should return the WidthHeight with expected values: case-2', () => {
      const result = calcMinSize({
        width: 100,
        height: 100
      },
  {
        width: 101,
        height: 99,
      })
      expect(result.width).toBe(100)
      expect(result.height).toBe(99)
    })
  })

  describe('initPanels()', () => {
    const configs = [
      {
        boundsOffset: {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        url: 'abc',
      },
      {
        boundsOffset: {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        url: '123',
      }
    ]
    const result = initPanels(configs)
    it('should return an array of ViewPane', () => {
      expect(result.length).toBe(2)
      expect(result[0].url).toBe('abc')
      expect(result[1].url).toBe('123')
    })
  })

  describe('mountPanels', () => {
    const configs = [
      {
        boundsOffset: {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        url: 'abc',
      },
      {
        boundsOffset: {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
        url: '123',
      }
    ]
    const result = initPanels(configs)
    const bw = new BrowserWindow()

    it('should call each mount() method', () => {
      const mountSpy = jest.spyOn<ViewPane, 'mount'>(ViewPane.prototype, 'mount')
      return mountPanels(result, bw).then(() => {
        expect(mountSpy).toBeCalledTimes(2)
        expect(mountSpy).toBeCalledWith(bw)
      })
    })
  })
})
