import { app, screen, BrowserWindow, BrowserView } from 'electron'
import * as Const from './const'
import { ViewPaneConf, ViewPane } from './lib/view-pane'

const panelConfigs: ViewPaneConf[] = [
  // grammarly
  {
    boundsOffset: {
      height: - Const.GOOGLE_TRANSLATOR_HEIGHT,
      width: - Const.WEBLIO_WIN_WIDTH,
      x: 0,
      y: 0,
    },
    css: Const.GRAMMARLY_CSS,
    url: Const.GRAMMARLY_URL,
  },
  // google translate
  {
    boundsOffset: {
      height: Const.GOOGLE_TRANSLATOR_HEIGHT,
      width: null,
      x: 0,
      y: - Const.GOOGLE_TRANSLATOR_HEIGHT,
    },
    css: Const.GOOGLE_TRANSLATOR_CUSTOM_CSS,
    url: Const.GOOGLE_TRANSLATOR_URL,
  },
  // weblio
  {
    boundsOffset: {
      height: -Const.GOOGLE_TRANSLATOR_HEIGHT,
      width: Const.WEBLIO_WIN_WIDTH,
      x: -Const.WEBLIO_WIN_WIDTH,
      y: 0
    },
    url: Const.WEBLIO_URL,
    useragent: Const.WEBLIO_UA,
  }
]

app.on('ready', () => main())

function main() {
  const { workArea } = screen.getPrimaryDisplay()
  return mountPanels(
    initPanels(panelConfigs),
    createBrowserWindow(
      workArea,
      { height: Const.MAX_INITIAL_WIN_HEIGHT, width: Const.MAX_INITIAL_WIN_WIDTH}
    )
  )
}

type WidthHeight = {
  height: number
  width: number
}

export function createBrowserWindow(actualSize: WidthHeight, hintSize: WidthHeight): BrowserWindow {
  return new BrowserWindow({
    ...calcMinSize(actualSize, hintSize),
    webPreferences: {
      contextIsolation: true
    }
  })
}

export function calcMinSize(actual: WidthHeight, hint: WidthHeight): WidthHeight {
  return {
    height: Math.min(actual.height, hint.height),
    width: Math.min(actual.width, hint.width)
  }
}

export function initPanels(configs: ViewPaneConf[]) {
  return configs.map((conf) => {
    return new ViewPane(BrowserView, conf)
  })
}

export function mountPanels(panels: ViewPane[], bw: BrowserWindow) {
  return Promise.all(panels.map((panel) => panel.mount(bw)))
}
