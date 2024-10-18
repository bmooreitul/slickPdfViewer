import {} from '//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.min.mjs';

/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/  // define getter functions for harmony exports
/******/  __webpack_require__.d = (exports, definition) => {
/******/    for(var key in definition) {
/******/      if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/      }
/******/    }
/******/  };
/******/ })();
/******/
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/  __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

/*
CanvasRenderingContext2D.prototype.strokeText = function () { };
CanvasRenderingContext2D.prototype.fillText = function () { };
*/

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  PDFViewerApplication: () => (/* reexport */ PDFViewerApplication),
  PDFViewerApplicationConstants: () => (/* binding */ AppConstants),
  PDFViewerApplicationOptions: () => (/* reexport */ AppOptions)
});

;// ./web/ui_utils.js
const DEFAULT_SCALE_VALUE = "auto";
const DEFAULT_SCALE = 1.0;
const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10.0;
const UNKNOWN_SCALE = 0;
const MAX_AUTO_SCALE = 1.25;
const SCROLLBAR_PADDING = 40;
const VERTICAL_PADDING = 5;
const RenderingStates = {
  INITIAL: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3
};
const PresentationModeState = {
  UNKNOWN: 0,
  NORMAL: 1,
  CHANGING: 2,
  FULLSCREEN: 3
};
const SidebarView = {
  UNKNOWN: -1,
  NONE: 0,
  THUMBS: 1,
  OUTLINE: 2,
  ATTACHMENTS: 3,
  LAYERS: 4
};
const TextLayerMode = {
  DISABLE: 0,
  ENABLE: 1,
  ENABLE_PERMISSIONS: 2
};
const ScrollMode = {
  UNKNOWN: -1,
  VERTICAL: 0,
  HORIZONTAL: 1,
  WRAPPED: 2,
  PAGE: 3
};
const SpreadMode = {
  UNKNOWN: -1,
  NONE: 0,
  ODD: 1,
  EVEN: 2
};
const CursorTool = {
  SELECT: 0,
  HAND: 1,
  ZOOM: 2
};
const AutoPrintRegExp = /\bprint\s*\(/;
function scrollIntoView(element, spot, scrollMatches = false) {
  let parent = element.offsetParent;
  if (!parent) {
    console.error("offsetParent is not set -- cannot scroll");
    return;
  }
  let offsetY = element.offsetTop + element.clientTop;
  let offsetX = element.offsetLeft + element.clientLeft;
  while (parent.clientHeight === parent.scrollHeight && parent.clientWidth === parent.scrollWidth || scrollMatches && (parent.classList.contains("markedContent") || getComputedStyle(parent).overflow === "hidden")) {
    offsetY += parent.offsetTop;
    offsetX += parent.offsetLeft;
    parent = parent.offsetParent;
    if (!parent) {
      return;
    }
  }
  if (spot) {
    if (spot.top !== undefined) {
      offsetY += spot.top;
    }
    if (spot.left !== undefined) {
      offsetX += spot.left;
      parent.scrollLeft = offsetX;
    }
  }
  parent.scrollTop = offsetY;
}
function watchScroll(viewAreaElement, callback, abortSignal = undefined) {
  const debounceScroll = function (evt) {
    if (rAF) {
      return;
    }
    rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
      rAF = null;
      const currentX = viewAreaElement.scrollLeft;
      const lastX = state.lastX;
      if (currentX !== lastX) {
        state.right = currentX > lastX;
      }
      state.lastX = currentX;
      const currentY = viewAreaElement.scrollTop;
      const lastY = state.lastY;
      if (currentY !== lastY) {
        state.down = currentY > lastY;
      }
      state.lastY = currentY;
      callback(state);
    });
  };
  const state = {
    right: true,
    down: true,
    lastX: viewAreaElement.scrollLeft,
    lastY: viewAreaElement.scrollTop,
    _eventHandler: debounceScroll
  };
  let rAF = null;
  viewAreaElement.addEventListener("scroll", debounceScroll, {
    useCapture: true,
    signal: abortSignal
  });
  abortSignal?.addEventListener("abort", () => window.cancelAnimationFrame(rAF), {
    once: true
  });
  return state;
}
function parseQueryString(query) {
  const params = new Map();
  for (const [key, value] of new URLSearchParams(query)) {
    params.set(key.toLowerCase(), value);
  }
  return params;
}
const InvisibleCharsRegExp = /[\x00-\x1F]/g;
function removeNullCharacters(str, replaceInvisible = false) {
  if (!InvisibleCharsRegExp.test(str)) {
    return str;
  }
  if (replaceInvisible) {
    return str.replaceAll(InvisibleCharsRegExp, m => m === "\x00" ? "" : " ");
  }
  return str.replaceAll("\x00", "");
}
function binarySearchFirstItem(items, condition, start = 0) {
  let minIndex = start;
  let maxIndex = items.length - 1;
  if (maxIndex < 0 || !condition(items[maxIndex])) {
    return items.length;
  }
  if (condition(items[minIndex])) {
    return minIndex;
  }
  while (minIndex < maxIndex) {
    const currentIndex = minIndex + maxIndex >> 1;
    const currentItem = items[currentIndex];
    if (condition(currentItem)) {
      maxIndex = currentIndex;
    } else {
      minIndex = currentIndex + 1;
    }
  }
  return minIndex;
}
function approximateFraction(x) {
  if (Math.floor(x) === x) {
    return [x, 1];
  }
  const xinv = 1 / x;
  const limit = 8;
  if (xinv > limit) {
    return [1, limit];
  } else if (Math.floor(xinv) === xinv) {
    return [1, xinv];
  }
  const x_ = x > 1 ? xinv : x;
  let a = 0,
    b = 1,
    c = 1,
    d = 1;
  while (true) {
    const p = a + c,
      q = b + d;
    if (q > limit) {
      break;
    }
    if (x_ <= p / q) {
      c = p;
      d = q;
    } else {
      a = p;
      b = q;
    }
  }
  let result;
  if (x_ - a / b < c / d - x_) {
    result = x_ === x ? [a, b] : [b, a];
  } else {
    result = x_ === x ? [c, d] : [d, c];
  }
  return result;
}
function floorToDivide(x, div) {
  return x - x % div;
}
function getPageSizeInches({
  view,
  userUnit,
  rotate
}) {
  const [x1, y1, x2, y2] = view;
  const changeOrientation = rotate % 180 !== 0;
  const width = (x2 - x1) / 72 * userUnit;
  const height = (y2 - y1) / 72 * userUnit;
  return {
    width: changeOrientation ? height : width,
    height: changeOrientation ? width : height
  };
}
function backtrackBeforeAllVisibleElements(index, views, top) {
  if (index < 2) {
    return index;
  }
  let elt = views[index].div;
  let pageTop = elt.offsetTop + elt.clientTop;
  if (pageTop >= top) {
    elt = views[index - 1].div;
    pageTop = elt.offsetTop + elt.clientTop;
  }
  for (let i = index - 2; i >= 0; --i) {
    elt = views[i].div;
    if (elt.offsetTop + elt.clientTop + elt.clientHeight <= pageTop) {
      break;
    }
    index = i;
  }
  return index;
}
function getVisibleElements({
  scrollEl,
  views,
  sortByVisibility = false,
  horizontal = false,
  rtl = false
}) {
  const top = scrollEl.scrollTop,
    bottom = top + scrollEl.clientHeight;
  const left = scrollEl.scrollLeft,
    right = left + scrollEl.clientWidth;
  function isElementBottomAfterViewTop(view) {
    const element = view.div;
    const elementBottom = element.offsetTop + element.clientTop + element.clientHeight;
    return elementBottom > top;
  }
  function isElementNextAfterViewHorizontally(view) {
    const element = view.div;
    const elementLeft = element.offsetLeft + element.clientLeft;
    const elementRight = elementLeft + element.clientWidth;
    return rtl ? elementLeft < right : elementRight > left;
  }
  const visible = [],
    ids = new Set(),
    numViews = views.length;
  let firstVisibleElementInd = binarySearchFirstItem(views, horizontal ? isElementNextAfterViewHorizontally : isElementBottomAfterViewTop);
  if (firstVisibleElementInd > 0 && firstVisibleElementInd < numViews && !horizontal) {
    firstVisibleElementInd = backtrackBeforeAllVisibleElements(firstVisibleElementInd, views, top);
  }
  let lastEdge = horizontal ? right : -1;
  for (let i = firstVisibleElementInd; i < numViews; i++) {
    const view = views[i],
      element = view.div;
    const currentWidth = element.offsetLeft + element.clientLeft;
    const currentHeight = element.offsetTop + element.clientTop;
    const viewWidth = element.clientWidth,
      viewHeight = element.clientHeight;
    const viewRight = currentWidth + viewWidth;
    const viewBottom = currentHeight + viewHeight;
    if (lastEdge === -1) {
      if (viewBottom >= bottom) {
        lastEdge = viewBottom;
      }
    } else if ((horizontal ? currentWidth : currentHeight) > lastEdge) {
      break;
    }
    if (viewBottom <= top || currentHeight >= bottom || viewRight <= left || currentWidth >= right) {
      continue;
    }
    const hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, viewBottom - bottom);
    const hiddenWidth = Math.max(0, left - currentWidth) + Math.max(0, viewRight - right);
    const fractionHeight = (viewHeight - hiddenHeight) / viewHeight,
      fractionWidth = (viewWidth - hiddenWidth) / viewWidth;
    const percent = fractionHeight * fractionWidth * 100 | 0;
    visible.push({
      id: view.id,
      x: currentWidth,
      y: currentHeight,
      view,
      percent,
      widthPercent: fractionWidth * 100 | 0
    });
    ids.add(view.id);
  }
  const first = visible[0],
    last = visible.at(-1);
  if (sortByVisibility) {
    visible.sort(function (a, b) {
      const pc = a.percent - b.percent;
      if (Math.abs(pc) > 0.001) {
        return -pc;
      }
      return a.id - b.id;
    });
  }
  return {
    first,
    last,
    views: visible,
    ids
  };
}
function normalizeWheelEventDirection(evt) {
  let delta = Math.hypot(evt.deltaX, evt.deltaY);
  const angle = Math.atan2(evt.deltaY, evt.deltaX);
  if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
    delta = -delta;
  }
  return delta;
}
function normalizeWheelEventDelta(evt) {
  const deltaMode = evt.deltaMode;
  let delta = normalizeWheelEventDirection(evt);
  const MOUSE_PIXELS_PER_LINE = 30;
  const MOUSE_LINES_PER_PAGE = 30;
  if (deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
    delta /= MOUSE_PIXELS_PER_LINE * MOUSE_LINES_PER_PAGE;
  } else if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta /= MOUSE_LINES_PER_PAGE;
  }
  return delta;
}
function isValidRotation(angle) {
  return Number.isInteger(angle) && angle % 90 === 0;
}
function isValidScrollMode(mode) {
  return Number.isInteger(mode) && Object.values(ScrollMode).includes(mode) && mode !== ScrollMode.UNKNOWN;
}
function isValidSpreadMode(mode) {
  return Number.isInteger(mode) && Object.values(SpreadMode).includes(mode) && mode !== SpreadMode.UNKNOWN;
}
function isPortraitOrientation(size) {
  return size.width <= size.height;
}
const animationStarted = new Promise(function (resolve) {
  window.requestAnimationFrame(resolve);
});
const docStyle = document.documentElement.style;
function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}
class ProgressBar {
  #classList = null;
  #disableAutoFetchTimeout = null;
  #percent = 0;
  #style = null;
  #visible = true;
  constructor(bar) {
    this.#classList = bar.classList;
    this.#style = bar.style;
  }
  get percent() {
    return this.#percent;
  }
  set percent(val) {
    this.#percent = clamp(val, 0, 100);
    if (isNaN(val)) {
      this.#classList.add("indeterminate");
      return;
    }
    this.#classList.remove("indeterminate");
    this.#style.setProperty("--progressBar-percent", `${this.#percent}%`);
  }
  setWidth(viewer) {
    if (!viewer) {
      return;
    }
    const container = viewer.parentNode;
    const scrollbarWidth = container.offsetWidth - viewer.offsetWidth;
    if (scrollbarWidth > 0) {
      this.#style.setProperty("--progressBar-end-offset", `${scrollbarWidth}px`);
    }
  }
  setDisableAutoFetch(delay = 5000) {
    if (this.#percent === 100 || isNaN(this.#percent)) {
      return;
    }
    if (this.#disableAutoFetchTimeout) {
      clearTimeout(this.#disableAutoFetchTimeout);
    }
    this.show();
    this.#disableAutoFetchTimeout = setTimeout(() => {
      this.#disableAutoFetchTimeout = null;
      this.hide();
    }, delay);
  }
  hide() {
    if (!this.#visible) {
      return;
    }
    this.#visible = false;
    this.#classList.add("hidden");
  }
  show() {
    if (this.#visible) {
      return;
    }
    this.#visible = true;
    this.#classList.remove("hidden");
  }
}
function getActiveOrFocusedElement() {
  let curRoot = document;
  let curActiveOrFocused = curRoot.activeElement || curRoot.querySelector(":focus");
  while (curActiveOrFocused?.shadowRoot) {
    curRoot = curActiveOrFocused.shadowRoot;
    curActiveOrFocused = curRoot.activeElement || curRoot.querySelector(":focus");
  }
  return curActiveOrFocused;
}
function apiPageLayoutToViewerModes(layout) {
  let scrollMode = ScrollMode.VERTICAL,
    spreadMode = SpreadMode.NONE;
  switch (layout) {
    case "SinglePage":
      scrollMode = ScrollMode.PAGE;
      break;
    case "OneColumn":
      break;
    case "TwoPageLeft":
      scrollMode = ScrollMode.PAGE;
    case "TwoColumnLeft":
      spreadMode = SpreadMode.ODD;
      break;
    case "TwoPageRight":
      scrollMode = ScrollMode.PAGE;
    case "TwoColumnRight":
      spreadMode = SpreadMode.EVEN;
      break;
  }
  return {
    scrollMode,
    spreadMode
  };
}
function apiPageModeToSidebarView(mode) {
  switch (mode) {
    case "UseNone":
      return SidebarView.NONE;
    case "UseThumbs":
      return SidebarView.THUMBS;
    case "UseOutlines":
      return SidebarView.OUTLINE;
    case "UseAttachments":
      return SidebarView.ATTACHMENTS;
    case "UseOC":
      return SidebarView.LAYERS;
  }
  return SidebarView.NONE;
}
function toggleCheckedBtn(button, toggle, view = null) {
  button.classList.toggle("toggled", toggle);
  button.setAttribute("aria-checked", toggle);
  view?.classList.toggle("hidden", !toggle);
}
function toggleExpandedBtn(button, toggle, view = null) {
  button.classList.toggle("toggled", toggle);
  button.setAttribute("aria-expanded", toggle);
  view?.classList.toggle("hidden", !toggle);
}
const calcRound = function () {
  const e = document.createElement("div");
  e.style.width = "round(down, calc(1.6666666666666665 * 792px), 1px)";
  return e.style.width === "calc(1320px)" ? Math.fround : x => x;
}();

;// ./web/app_options.js
{
  var compatParams = new Map();
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 1;
  const isAndroid = /Android/.test(userAgent);
  const isIOS = /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent) || platform === "MacIntel" && maxTouchPoints > 1;
  (function () {
    if (isIOS || isAndroid) {
      compatParams.set("maxCanvasPixels", 5242880);
    }
  })();
  (function () {
    if (isAndroid) {
      compatParams.set("useSystemFonts", false);
    }
  })();
}
const OptionKind = {
  BROWSER: 0x01,
  VIEWER: 0x02,
  API: 0x04,
  WORKER: 0x08,
  EVENT_DISPATCH: 0x10,
  PREFERENCE: 0x80
};
const Type = {
  BOOLEAN: 0x01,
  NUMBER: 0x02,
  OBJECT: 0x04,
  STRING: 0x08,
  UNDEFINED: 0x10
};
const defaultOptions = {
  allowedGlobalEvents: {
    value: null,
    kind: OptionKind.BROWSER
  },
  canvasMaxAreaInBytes: {
    value: -1,
    kind: OptionKind.BROWSER + OptionKind.API
  },
  isInAutomation: {
    value: false,
    kind: OptionKind.BROWSER
  },
  localeProperties: {
    value: {
      lang: navigator.language || "en-US"
    },
    kind: OptionKind.BROWSER
  },
  nimbusDataStr: {
    value: "",
    kind: OptionKind.BROWSER
  },
  supportsCaretBrowsingMode: {
    value: false,
    kind: OptionKind.BROWSER
  },
  supportsDocumentFonts: {
    value: true,
    kind: OptionKind.BROWSER
  },
  supportsIntegratedFind: {
    value: false,
    kind: OptionKind.BROWSER
  },
  supportsMouseWheelZoomCtrlKey: {
    value: true,
    kind: OptionKind.BROWSER
  },
  supportsMouseWheelZoomMetaKey: {
    value: true,
    kind: OptionKind.BROWSER
  },
  supportsPinchToZoom: {
    value: true,
    kind: OptionKind.BROWSER
  },
  toolbarDensity: {
    value: 0,
    kind: OptionKind.BROWSER + OptionKind.EVENT_DISPATCH
  },
  altTextLearnMoreUrl: {
    value: "",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  annotationEditorMode: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  annotationMode: {
    value: 2,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  cursorToolOnLoad: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  debuggerSrc: {
    value: "./debugger.mjs",
    kind: OptionKind.VIEWER
  },
  defaultZoomDelay: {
    value: 400,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  defaultZoomValue: {
    value: "",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  disableHistory: {
    value: false,
    kind: OptionKind.VIEWER
  },
  disablePageLabels: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableAltText: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableAltTextModelDownload: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE + OptionKind.EVENT_DISPATCH
  },
  enableGuessAltText: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE + OptionKind.EVENT_DISPATCH
  },
  enableHighlightFloatingButton: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableNewAltTextWhenAddingImage: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enablePermissions: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enablePrintAutoRotate: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableScripting: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableUpdatedAddImage: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  externalLinkRel: {
    value: "noopener noreferrer nofollow",
    kind: OptionKind.VIEWER
  },
  externalLinkTarget: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  highlightEditorColors: {
    value: "yellow=#FFFF98,green=#53FFBC,blue=#80EBFF,pink=#FFCBE6,red=#FF4F5F",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  historyUpdateUrl: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  ignoreDestinationZoom: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  imageResourcesPath: {
    value: "./images/",
    kind: OptionKind.VIEWER
  },
  maxCanvasPixels: {
    value: 2 ** 25,
    kind: OptionKind.VIEWER
  },
  forcePageColors: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  pageColorsBackground: {
    value: "Canvas",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  pageColorsForeground: {
    value: "CanvasText",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  pdfBugEnabled: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  printResolution: {
    value: 150,
    kind: OptionKind.VIEWER
  },
  sidebarViewOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  scrollModeOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  spreadModeOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  textLayerMode: {
    value: 1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  viewOnLoad: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  cMapPacked: {
    value: true,
    kind: OptionKind.API
  },
  cMapUrl: {
    value: "//cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/cmaps/",
    kind: OptionKind.API
  },
  disableAutoFetch: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableFontFace: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableRange: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableStream: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  docBaseUrl: {
    value: "",
    kind: OptionKind.API
  },
  enableHWA: {
    value: true,
    kind: OptionKind.API + OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableXfa: {
    value: true,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  fontExtraProperties: {
    value: false,
    kind: OptionKind.API
  },
  isEvalSupported: {
    value: true,
    kind: OptionKind.API
  },
  isOffscreenCanvasSupported: {
    value: true,
    kind: OptionKind.API
  },
  maxImageSize: {
    value: -1,
    kind: OptionKind.API
  },
  pdfBug: {
    value: false,
    kind: OptionKind.API
  },
  standardFontDataUrl: {
    value: "//cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/web/standard_fonts/",
    kind: OptionKind.API
  },
  useSystemFonts: {
    value: undefined,
    kind: OptionKind.API,
    type: Type.BOOLEAN + Type.UNDEFINED
  },
  verbosity: {
    value: 1,
    kind: OptionKind.API
  },
  workerPort: {
    value: null,
    kind: OptionKind.WORKER
  },
  workerSrc: {
    value: "//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.mjs",
    kind: OptionKind.WORKER
  }
};
{
  defaultOptions.defaultUrl = {
    value: "",
    kind: OptionKind.VIEWER
  };
  defaultOptions.sandboxBundleSrc = {
    value: "//cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.sandbox.mjs",
    kind: OptionKind.VIEWER
  };
  defaultOptions.viewerCssTheme = {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  };
  defaultOptions.enableFakeMLManager = {
    value: true,
    kind: OptionKind.VIEWER
  };
}
{
  defaultOptions.disablePreferences = {
    value: false,
    kind: OptionKind.VIEWER
  };
}
class AppOptions {
  static eventBus;
  static #opts = new Map();
  static {
    for (const name in defaultOptions) {
      this.#opts.set(name, defaultOptions[name].value);
    }
    for (const [name, value] of compatParams) {
      this.#opts.set(name, value);
    }
    this._hasInvokedSet = false;
    this._checkDisablePreferences = () => {
      if (this.get("disablePreferences")) {
        return true;
      }
      if (this._hasInvokedSet) {
        console.warn("The Preferences may override manually set AppOptions; " + 'please use the "disablePreferences"-option to prevent that.');
      }
      return false;
    };
  }
  static get(name) {
    return this.#opts.get(name);
  }
  static getAll(kind = null, defaultOnly = false) {
    const options = Object.create(null);
    for (const name in defaultOptions) {
      const defaultOpt = defaultOptions[name];
      if (kind && !(kind & defaultOpt.kind)) {
        continue;
      }
      options[name] = !defaultOnly ? this.#opts.get(name) : defaultOpt.value;
    }
    return options;
  }
  static set(name, value) {
    this.setAll({
      [name]: value
    });
  }
  static setAll(options, prefs = false) {
    this._hasInvokedSet ||= true;
    let events;
    for (const name in options) {
      const defaultOpt = defaultOptions[name],
        userOpt = options[name];
      if (!defaultOpt || !(typeof userOpt === typeof defaultOpt.value || Type[(typeof userOpt).toUpperCase()] & defaultOpt.type)) {
        continue;
      }
      const {
        kind
      } = defaultOpt;
      if (prefs && !(kind & OptionKind.BROWSER || kind & OptionKind.PREFERENCE)) {
        continue;
      }
      if (this.eventBus && kind & OptionKind.EVENT_DISPATCH) {
        (events ||= new Map()).set(name, userOpt);
      }
      this.#opts.set(name, userOpt);
    }
    if (events) {
      for (const [name, value] of events) {
        this.eventBus.dispatch(name.toLowerCase(), {
          source: this,
          value
        });
      }
    }
  }
}

;// ./web/pdf_link_service.js

const DEFAULT_LINK_REL = "noopener noreferrer nofollow";
const LinkTarget = {
  NONE: 0,
  SELF: 1,
  BLANK: 2,
  PARENT: 3,
  TOP: 4
};
class PDFLinkService {
  externalLinkEnabled = true;
  constructor({
    eventBus,
    externalLinkTarget = null,
    externalLinkRel = null,
    ignoreDestinationZoom = false
  } = {}) {
    this.eventBus = eventBus;
    this.externalLinkTarget = externalLinkTarget;
    this.externalLinkRel = externalLinkRel;
    this._ignoreDestinationZoom = ignoreDestinationZoom;
    this.baseUrl = null;
    this.pdfDocument = null;
    this.pdfViewer = null;
    this.pdfHistory = null;
  }
  setDocument(pdfDocument, baseUrl = null) {
    this.baseUrl = baseUrl;
    this.pdfDocument = pdfDocument;
  }
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  setHistory(pdfHistory) {
    this.pdfHistory = pdfHistory;
  }
  get pagesCount() {
    return this.pdfDocument ? this.pdfDocument.numPages : 0;
  }
  get page() {
    return this.pdfDocument ? this.pdfViewer.currentPageNumber : 1;
  }
  set page(value) {
    if (this.pdfDocument) {
      this.pdfViewer.currentPageNumber = value;
    }
  }
  get rotation() {
    return this.pdfDocument ? this.pdfViewer.pagesRotation : 0;
  }
  set rotation(value) {
    if (this.pdfDocument) {
      this.pdfViewer.pagesRotation = value;
    }
  }
  get isInPresentationMode() {
    return this.pdfDocument ? this.pdfViewer.isInPresentationMode : false;
  }
  async goToDestination(dest) {
    if (!this.pdfDocument) {
      return;
    }
    let namedDest, explicitDest, pageNumber;
    if (typeof dest === "string") {
      namedDest = dest;
      explicitDest = await this.pdfDocument.getDestination(dest);
    } else {
      namedDest = null;
      explicitDest = await dest;
    }
    if (!Array.isArray(explicitDest)) {
      console.error(`goToDestination: "${explicitDest}" is not a valid destination array, for dest="${dest}".`);
      return;
    }
    const [destRef] = explicitDest;
    if (destRef && typeof destRef === "object") {
      pageNumber = this.pdfDocument.cachedPageNumber(destRef);
      if (!pageNumber) {
        try {
          pageNumber = (await this.pdfDocument.getPageIndex(destRef)) + 1;
        } catch {
          console.error(`goToDestination: "${destRef}" is not a valid page reference, for dest="${dest}".`);
          return;
        }
      }
    } else if (Number.isInteger(destRef)) {
      pageNumber = destRef + 1;
    }
    if (!pageNumber || pageNumber < 1 || pageNumber > this.pagesCount) {
      console.error(`goToDestination: "${pageNumber}" is not a valid page number, for dest="${dest}".`);
      return;
    }
    if (this.pdfHistory) {
      this.pdfHistory.pushCurrentPosition();
      this.pdfHistory.push({
        namedDest,
        explicitDest,
        pageNumber
      });
    }
    this.pdfViewer.scrollPageIntoView({
      pageNumber,
      destArray: explicitDest,
      ignoreDestinationZoom: this._ignoreDestinationZoom
    });
  }
  goToPage(val) {
    if (!this.pdfDocument) {
      return;
    }
    const pageNumber = typeof val === "string" && this.pdfViewer.pageLabelToPageNumber(val) || val | 0;
    if (!(Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.pagesCount)) {
      console.error(`PDFLinkService.goToPage: "${val}" is not a valid page.`);
      return;
    }
    if (this.pdfHistory) {
      this.pdfHistory.pushCurrentPosition();
      this.pdfHistory.pushPage(pageNumber);
    }
    this.pdfViewer.scrollPageIntoView({
      pageNumber
    });
  }
  addLinkAttributes(link, url, newWindow = false) {
    if (!url || typeof url !== "string") {
      throw new Error('A valid "url" parameter must provided.');
    }
    const target = newWindow ? LinkTarget.BLANK : this.externalLinkTarget,
      rel = this.externalLinkRel;
    if (this.externalLinkEnabled) {
      link.href = link.title = url;
    } else {
      link.href = "";
      link.title = `Disabled: ${url}`;
      link.onclick = () => false;
    }
    let targetStr = "";
    switch (target) {
      case LinkTarget.NONE:
        break;
      case LinkTarget.SELF:
        targetStr = "_self";
        break;
      case LinkTarget.BLANK:
        targetStr = "_blank";
        break;
      case LinkTarget.PARENT:
        targetStr = "_parent";
        break;
      case LinkTarget.TOP:
        targetStr = "_top";
        break;
    }
    link.target = targetStr;
    link.rel = typeof rel === "string" ? rel : DEFAULT_LINK_REL;
  }
  getDestinationHash(dest) {
    if (typeof dest === "string") {
      if (dest.length > 0) {
        return this.getAnchorUrl("#" + escape(dest));
      }
    } else if (Array.isArray(dest)) {
      const str = JSON.stringify(dest);
      if (str.length > 0) {
        return this.getAnchorUrl("#" + escape(str));
      }
    }
    return this.getAnchorUrl("");
  }
  getAnchorUrl(anchor) {
    return this.baseUrl ? this.baseUrl + anchor : anchor;
  }
  setHash(hash) {
    if (!this.pdfDocument) {
      return;
    }
    let pageNumber, dest;
    if (hash.includes("=")) {
      const params = parseQueryString(hash);
      if (params.has("search")) {
        const query = params.get("search").replaceAll('"', ""),
          phrase = params.get("phrase") === "true";
        this.eventBus.dispatch("findfromurlhash", {
          source: this,
          query: phrase ? query : query.match(/\S+/g)
        });
      }
      if (params.has("page")) {
        pageNumber = params.get("page") | 0 || 1;
      }
      if (params.has("zoom")) {
        const zoomArgs = params.get("zoom").split(",");
        const zoomArg = zoomArgs[0];
        const zoomArgNumber = parseFloat(zoomArg);
        if (!zoomArg.includes("Fit")) {
          dest = [null, {
            name: "XYZ"
          }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null, zoomArgs.length > 2 ? zoomArgs[2] | 0 : null, zoomArgNumber ? zoomArgNumber / 100 : zoomArg];
        } else if (zoomArg === "Fit" || zoomArg === "FitB") {
          dest = [null, {
            name: zoomArg
          }];
        } else if (zoomArg === "FitH" || zoomArg === "FitBH" || zoomArg === "FitV" || zoomArg === "FitBV") {
          dest = [null, {
            name: zoomArg
          }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null];
        } else if (zoomArg === "FitR") {
          if (zoomArgs.length !== 5) {
            console.error('PDFLinkService.setHash: Not enough parameters for "FitR".');
          } else {
            dest = [null, {
              name: zoomArg
            }, zoomArgs[1] | 0, zoomArgs[2] | 0, zoomArgs[3] | 0, zoomArgs[4] | 0];
          }
        } else {
          console.error(`PDFLinkService.setHash: "${zoomArg}" is not a valid zoom value.`);
        }
      }
      if (dest) {
        this.pdfViewer.scrollPageIntoView({
          pageNumber: pageNumber || this.page,
          destArray: dest,
          allowNegativeOffset: true
        });
      } else if (pageNumber) {
        this.page = pageNumber;
      }
      if (params.has("pagemode")) {
        this.eventBus.dispatch("pagemode", {
          source: this,
          mode: params.get("pagemode")
        });
      }
      if (params.has("nameddest")) {
        this.goToDestination(params.get("nameddest"));
      }
      return;
    }
    dest = unescape(hash);
    try {
      dest = JSON.parse(dest);
      if (!Array.isArray(dest)) {
        dest = dest.toString();
      }
    } catch {}
    if (typeof dest === "string" || PDFLinkService.#isValidExplicitDest(dest)) {
      this.goToDestination(dest);
      return;
    }
    console.error(`PDFLinkService.setHash: "${unescape(hash)}" is not a valid destination.`);
  }
  executeNamedAction(action) {
    if (!this.pdfDocument) {
      return;
    }
    switch (action) {
      case "GoBack":
        this.pdfHistory?.back();
        break;
      case "GoForward":
        this.pdfHistory?.forward();
        break;
      case "NextPage":
        this.pdfViewer.nextPage();
        break;
      case "PrevPage":
        this.pdfViewer.previousPage();
        break;
      case "LastPage":
        this.page = this.pagesCount;
        break;
      case "FirstPage":
        this.page = 1;
        break;
      default:
        break;
    }
    this.eventBus.dispatch("namedaction", {
      source: this,
      action
    });
  }
  async executeSetOCGState(action) {
    if (!this.pdfDocument) {
      return;
    }
    const pdfDocument = this.pdfDocument,
      optionalContentConfig = await this.pdfViewer.optionalContentConfigPromise;
    if (pdfDocument !== this.pdfDocument) {
      return;
    }
    optionalContentConfig.setOCGState(action);
    this.pdfViewer.optionalContentConfigPromise = Promise.resolve(optionalContentConfig);
  }
  static #isValidExplicitDest(dest) {
    if (!Array.isArray(dest) || dest.length < 2) {
      return false;
    }
    const [page, zoom, ...args] = dest;
    if (!(typeof page === "object" && Number.isInteger(page?.num) && Number.isInteger(page?.gen)) && !Number.isInteger(page)) {
      return false;
    }
    if (!(typeof zoom === "object" && typeof zoom?.name === "string")) {
      return false;
    }
    const argsLen = args.length;
    let allowNull = true;
    switch (zoom.name) {
      case "XYZ":
        if (argsLen < 2 || argsLen > 3) {
          return false;
        }
        break;
      case "Fit":
      case "FitB":
        return argsLen === 0;
      case "FitH":
      case "FitBH":
      case "FitV":
      case "FitBV":
        if (argsLen > 1) {
          return false;
        }
        break;
      case "FitR":
        if (argsLen !== 4) {
          return false;
        }
        allowNull = false;
        break;
      default:
        return false;
    }
    for (const arg of args) {
      if (!(typeof arg === "number" || allowNull && arg === null)) {
        return false;
      }
    }
    return true;
  }
}
class SimpleLinkService extends PDFLinkService {
  setDocument(pdfDocument, baseUrl = null) {}
}

;// ./web/pdfjs.js
const {
  AbortException,
  AnnotationEditorLayer,
  AnnotationEditorParamsType,
  AnnotationEditorType,
  AnnotationEditorUIManager,
  AnnotationLayer,
  AnnotationMode,
  build,
  CMapCompressionType,
  ColorPicker,
  createValidAbsoluteUrl,
  DOMSVGFactory,
  DrawLayer,
  FeatureTest,
  fetchData,
  getDocument,
  getFilenameFromUrl,
  getPdfFilenameFromUrl: pdfjs_getPdfFilenameFromUrl,
  getXfaPageViewport,
  GlobalWorkerOptions,
  ImageKind,
  InvalidPDFException,
  isDataScheme,
  isPdfFile,
  MissingPDFException,
  noContextMenu,
  normalizeUnicode,
  OPS,
  OutputScale,
  PasswordResponses,
  PDFDataRangeTransport,
  PDFDateString,
  PDFWorker,
  PermissionFlag,
  PixelsPerInch,
  RenderingCancelledException,
  setLayerDimensions,
  shadow,
  TextLayer,
  UnexpectedResponseException,
  Util,
  VerbosityLevel,
  version,
  XfaLayer
} = globalThis.pdfjsLib;

;// ./web/event_utils.js
const WaitOnType = {
  EVENT: "event",
  TIMEOUT: "timeout"
};
async function waitOnEventOrTimeout({
  target,
  name,
  delay = 0
}) {
  if (typeof target !== "object" || !(name && typeof name === "string") || !(Number.isInteger(delay) && delay >= 0)) {
    throw new Error("waitOnEventOrTimeout - invalid parameters.");
  }
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  const ac = new AbortController();
  function handler(type) {
    ac.abort();
    clearTimeout(timeout);
    resolve(type);
  }
  const evtMethod = target instanceof EventBus ? "_on" : "addEventListener";
  target[evtMethod](name, handler.bind(null, WaitOnType.EVENT), {
    signal: ac.signal
  });
  const timeout = setTimeout(handler.bind(null, WaitOnType.TIMEOUT), delay);
  return promise;
}
class EventBus {
  #listeners = Object.create(null);
  on(eventName, listener, options = null) {
    this._on(eventName, listener, {
      external: true,
      once: options?.once,
      signal: options?.signal
    });
  }
  off(eventName, listener, options = null) {
    this._off(eventName, listener);
  }
  dispatch(eventName, data) {
    const eventListeners = this.#listeners[eventName];
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }
    let externalListeners;
    for (const {
      listener,
      external,
      once
    } of eventListeners.slice(0)) {
      if (once) {
        this._off(eventName, listener);
      }
      if (external) {
        (externalListeners ||= []).push(listener);
        continue;
      }
      listener(data);
    }
    if (externalListeners) {
      for (const listener of externalListeners) {
        listener(data);
      }
      externalListeners = null;
    }
  }
  _on(eventName, listener, options = null) {
    let rmAbort = null;
    if (options?.signal instanceof AbortSignal) {
      const {
        signal
      } = options;
      if (signal.aborted) {
        console.error("Cannot use an `aborted` signal.");
        return;
      }
      const onAbort = () => this._off(eventName, listener);
      rmAbort = () => signal.removeEventListener("abort", onAbort);
      signal.addEventListener("abort", onAbort);
    }
    const eventListeners = this.#listeners[eventName] ||= [];
    eventListeners.push({
      listener,
      external: options?.external === true,
      once: options?.once === true,
      rmAbort
    });
  }
  _off(eventName, listener, options = null) {
    const eventListeners = this.#listeners[eventName];
    if (!eventListeners) {
      return;
    }
    for (let i = 0, ii = eventListeners.length; i < ii; i++) {
      const evt = eventListeners[i];
      if (evt.listener === listener) {
        evt.rmAbort?.();
        eventListeners.splice(i, 1);
        return;
      }
    }
  }
}
class FirefoxEventBus extends EventBus {
  #externalServices;
  #globalEventNames;
  #isInAutomation;
  constructor(globalEventNames, externalServices, isInAutomation) {
    super();
    this.#globalEventNames = globalEventNames;
    this.#externalServices = externalServices;
    this.#isInAutomation = isInAutomation;
  }
  dispatch(eventName, data) {
    throw new Error("Not implemented: FirefoxEventBus.dispatch");
  }
}

;// ./web/external_services.js
class BaseExternalServices {
  updateFindControlState(data) {}
  updateFindMatchesCount(data) {}
  initPassiveLoading() {}
  reportTelemetry(data) {}
  async createL10n() {
    throw new Error("Not implemented: createL10n");
  }
  createScripting() {
    throw new Error("Not implemented: createScripting");
  }
  updateEditorStates(data) {
    throw new Error("Not implemented: updateEditorStates");
  }
  dispatchGlobalEvent(_event) {}
}

;// ./web/preferences.js

class BasePreferences {
  #defaults = Object.freeze({
    altTextLearnMoreUrl: "",
    annotationEditorMode: 0,
    annotationMode: 2,
    cursorToolOnLoad: 0,
    defaultZoomDelay: 400,
    defaultZoomValue: "",
    disablePageLabels: false,
    enableAltText: false,
    enableAltTextModelDownload: true,
    enableGuessAltText: true,
    enableHighlightFloatingButton: false,
    enableNewAltTextWhenAddingImage: true,
    enablePermissions: false,
    enablePrintAutoRotate: true,
    enableScripting: true,
    enableUpdatedAddImage: false,
    externalLinkTarget: 0,
    highlightEditorColors: "yellow=#FFFF98,green=#53FFBC,blue=#80EBFF,pink=#FFCBE6,red=#FF4F5F",
    historyUpdateUrl: false,
    ignoreDestinationZoom: false,
    forcePageColors: false,
    pageColorsBackground: "Canvas",
    pageColorsForeground: "CanvasText",
    pdfBugEnabled: false,
    sidebarViewOnLoad: -1,
    scrollModeOnLoad: -1,
    spreadModeOnLoad: -1,
    textLayerMode: 1,
    viewOnLoad: 0,
    disableAutoFetch: false,
    disableFontFace: false,
    disableRange: false,
    disableStream: false,
    enableHWA: true,
    enableXfa: true,
    viewerCssTheme: 0
  });
  #initializedPromise = null;
  constructor() {
    this.#initializedPromise = this._readFromStorage(this.#defaults).then(({
      browserPrefs,
      prefs
    }) => {
      if (AppOptions._checkDisablePreferences()) {
        return;
      }
      AppOptions.setAll({
        ...browserPrefs,
        ...prefs
      }, true);
    });
  }
  async _writeToStorage(prefObj) {
    throw new Error("Not implemented: _writeToStorage");
  }
  async _readFromStorage(prefObj) {
    throw new Error("Not implemented: _readFromStorage");
  }
  async reset() {
    await this.#initializedPromise;
    AppOptions.setAll(this.#defaults, true);
    await this._writeToStorage(this.#defaults);
  }
  async set(name, value) {
    await this.#initializedPromise;
    AppOptions.setAll({
      [name]: value
    }, true);
    await this._writeToStorage(AppOptions.getAll(OptionKind.PREFERENCE));
  }
  async get(name) {
    await this.#initializedPromise;
    return AppOptions.get(name);
  }
  get initializedPromise() {
    return this.#initializedPromise;
  }
}

;// ./node_modules/@fluent/bundle/esm/types.js
class FluentType {
  constructor(value) {
    this.value = value;
  }
  valueOf() {
    return this.value;
  }
}
class FluentNone extends FluentType {
  constructor(value = "???") {
    super(value);
  }
  toString(scope) {
    return `{${this.value}}`;
  }
}
class FluentNumber extends FluentType {
  constructor(value, opts = {}) {
    super(value);
    this.opts = opts;
  }
  toString(scope) {
    try {
      const nf = scope.memoizeIntlObject(Intl.NumberFormat, this.opts);
      return nf.format(this.value);
    } catch (err) {
      scope.reportError(err);
      return this.value.toString(10);
    }
  }
}
class FluentDateTime extends FluentType {
  constructor(value, opts = {}) {
    super(value);
    this.opts = opts;
  }
  toString(scope) {
    try {
      const dtf = scope.memoizeIntlObject(Intl.DateTimeFormat, this.opts);
      return dtf.format(this.value);
    } catch (err) {
      scope.reportError(err);
      return new Date(this.value).toISOString();
    }
  }
}
;// ./node_modules/@fluent/bundle/esm/resolver.js

const MAX_PLACEABLES = 100;
const FSI = "\u2068";
const PDI = "\u2069";
function match(scope, selector, key) {
  if (key === selector) {
    return true;
  }
  if (key instanceof FluentNumber && selector instanceof FluentNumber && key.value === selector.value) {
    return true;
  }
  if (selector instanceof FluentNumber && typeof key === "string") {
    let category = scope.memoizeIntlObject(Intl.PluralRules, selector.opts).select(selector.value);
    if (key === category) {
      return true;
    }
  }
  return false;
}
function getDefault(scope, variants, star) {
  if (variants[star]) {
    return resolvePattern(scope, variants[star].value);
  }
  scope.reportError(new RangeError("No default"));
  return new FluentNone();
}
function getArguments(scope, args) {
  const positional = [];
  const named = Object.create(null);
  for (const arg of args) {
    if (arg.type === "narg") {
      named[arg.name] = resolveExpression(scope, arg.value);
    } else {
      positional.push(resolveExpression(scope, arg));
    }
  }
  return {
    positional,
    named
  };
}
function resolveExpression(scope, expr) {
  switch (expr.type) {
    case "str":
      return expr.value;
    case "num":
      return new FluentNumber(expr.value, {
        minimumFractionDigits: expr.precision
      });
    case "var":
      return resolveVariableReference(scope, expr);
    case "mesg":
      return resolveMessageReference(scope, expr);
    case "term":
      return resolveTermReference(scope, expr);
    case "func":
      return resolveFunctionReference(scope, expr);
    case "select":
      return resolveSelectExpression(scope, expr);
    default:
      return new FluentNone();
  }
}
function resolveVariableReference(scope, {
  name
}) {
  let arg;
  if (scope.params) {
    if (Object.prototype.hasOwnProperty.call(scope.params, name)) {
      arg = scope.params[name];
    } else {
      return new FluentNone(`$${name}`);
    }
  } else if (scope.args && Object.prototype.hasOwnProperty.call(scope.args, name)) {
    arg = scope.args[name];
  } else {
    scope.reportError(new ReferenceError(`Unknown variable: $${name}`));
    return new FluentNone(`$${name}`);
  }
  if (arg instanceof FluentType) {
    return arg;
  }
  switch (typeof arg) {
    case "string":
      return arg;
    case "number":
      return new FluentNumber(arg);
    case "object":
      if (arg instanceof Date) {
        return new FluentDateTime(arg.getTime());
      }
    default:
      scope.reportError(new TypeError(`Variable type not supported: $${name}, ${typeof arg}`));
      return new FluentNone(`$${name}`);
  }
}
function resolveMessageReference(scope, {
  name,
  attr
}) {
  const message = scope.bundle._messages.get(name);
  if (!message) {
    scope.reportError(new ReferenceError(`Unknown message: ${name}`));
    return new FluentNone(name);
  }
  if (attr) {
    const attribute = message.attributes[attr];
    if (attribute) {
      return resolvePattern(scope, attribute);
    }
    scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));
    return new FluentNone(`${name}.${attr}`);
  }
  if (message.value) {
    return resolvePattern(scope, message.value);
  }
  scope.reportError(new ReferenceError(`No value: ${name}`));
  return new FluentNone(name);
}
function resolveTermReference(scope, {
  name,
  attr,
  args
}) {
  const id = `-${name}`;
  const term = scope.bundle._terms.get(id);
  if (!term) {
    scope.reportError(new ReferenceError(`Unknown term: ${id}`));
    return new FluentNone(id);
  }
  if (attr) {
    const attribute = term.attributes[attr];
    if (attribute) {
      scope.params = getArguments(scope, args).named;
      const resolved = resolvePattern(scope, attribute);
      scope.params = null;
      return resolved;
    }
    scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));
    return new FluentNone(`${id}.${attr}`);
  }
  scope.params = getArguments(scope, args).named;
  const resolved = resolvePattern(scope, term.value);
  scope.params = null;
  return resolved;
}
function resolveFunctionReference(scope, {
  name,
  args
}) {
  let func = scope.bundle._functions[name];
  if (!func) {
    scope.reportError(new ReferenceError(`Unknown function: ${name}()`));
    return new FluentNone(`${name}()`);
  }
  if (typeof func !== "function") {
    scope.reportError(new TypeError(`Function ${name}() is not callable`));
    return new FluentNone(`${name}()`);
  }
  try {
    let resolved = getArguments(scope, args);
    return func(resolved.positional, resolved.named);
  } catch (err) {
    scope.reportError(err);
    return new FluentNone(`${name}()`);
  }
}
function resolveSelectExpression(scope, {
  selector,
  variants,
  star
}) {
  let sel = resolveExpression(scope, selector);
  if (sel instanceof FluentNone) {
    return getDefault(scope, variants, star);
  }
  for (const variant of variants) {
    const key = resolveExpression(scope, variant.key);
    if (match(scope, sel, key)) {
      return resolvePattern(scope, variant.value);
    }
  }
  return getDefault(scope, variants, star);
}
function resolveComplexPattern(scope, ptn) {
  if (scope.dirty.has(ptn)) {
    scope.reportError(new RangeError("Cyclic reference"));
    return new FluentNone();
  }
  scope.dirty.add(ptn);
  const result = [];
  const useIsolating = scope.bundle._useIsolating && ptn.length > 1;
  for (const elem of ptn) {
    if (typeof elem === "string") {
      result.push(scope.bundle._transform(elem));
      continue;
    }
    scope.placeables++;
    if (scope.placeables > MAX_PLACEABLES) {
      scope.dirty.delete(ptn);
      throw new RangeError(`Too many placeables expanded: ${scope.placeables}, ` + `max allowed is ${MAX_PLACEABLES}`);
    }
    if (useIsolating) {
      result.push(FSI);
    }
    result.push(resolveExpression(scope, elem).toString(scope));
    if (useIsolating) {
      result.push(PDI);
    }
  }
  scope.dirty.delete(ptn);
  return result.join("");
}
function resolvePattern(scope, value) {
  if (typeof value === "string") {
    return scope.bundle._transform(value);
  }
  return resolveComplexPattern(scope, value);
}
;// ./node_modules/@fluent/bundle/esm/scope.js
class Scope {
  constructor(bundle, errors, args) {
    this.dirty = new WeakSet();
    this.params = null;
    this.placeables = 0;
    this.bundle = bundle;
    this.errors = errors;
    this.args = args;
  }
  reportError(error) {
    if (!this.errors || !(error instanceof Error)) {
      throw error;
    }
    this.errors.push(error);
  }
  memoizeIntlObject(ctor, opts) {
    let cache = this.bundle._intls.get(ctor);
    if (!cache) {
      cache = {};
      this.bundle._intls.set(ctor, cache);
    }
    let id = JSON.stringify(opts);
    if (!cache[id]) {
      cache[id] = new ctor(this.bundle.locales, opts);
    }
    return cache[id];
  }
}
;// ./node_modules/@fluent/bundle/esm/builtins.js

function values(opts, allowed) {
  const unwrapped = Object.create(null);
  for (const [name, opt] of Object.entries(opts)) {
    if (allowed.includes(name)) {
      unwrapped[name] = opt.valueOf();
    }
  }
  return unwrapped;
}
const NUMBER_ALLOWED = ["unitDisplay", "currencyDisplay", "useGrouping", "minimumIntegerDigits", "minimumFractionDigits", "maximumFractionDigits", "minimumSignificantDigits", "maximumSignificantDigits"];
function NUMBER(args, opts) {
  let arg = args[0];
  if (arg instanceof FluentNone) {
    return new FluentNone(`NUMBER(${arg.valueOf()})`);
  }
  if (arg instanceof FluentNumber) {
    return new FluentNumber(arg.valueOf(), {
      ...arg.opts,
      ...values(opts, NUMBER_ALLOWED)
    });
  }
  if (arg instanceof FluentDateTime) {
    return new FluentNumber(arg.valueOf(), {
      ...values(opts, NUMBER_ALLOWED)
    });
  }
  throw new TypeError("Invalid argument to NUMBER");
}
const DATETIME_ALLOWED = ["dateStyle", "timeStyle", "fractionalSecondDigits", "dayPeriod", "hour12", "weekday", "era", "year", "month", "day", "hour", "minute", "second", "timeZoneName"];
function DATETIME(args, opts) {
  let arg = args[0];
  if (arg instanceof FluentNone) {
    return new FluentNone(`DATETIME(${arg.valueOf()})`);
  }
  if (arg instanceof FluentDateTime) {
    return new FluentDateTime(arg.valueOf(), {
      ...arg.opts,
      ...values(opts, DATETIME_ALLOWED)
    });
  }
  if (arg instanceof FluentNumber) {
    return new FluentDateTime(arg.valueOf(), {
      ...values(opts, DATETIME_ALLOWED)
    });
  }
  throw new TypeError("Invalid argument to DATETIME");
}
;// ./node_modules/@fluent/bundle/esm/memoizer.js
const cache = new Map();
function getMemoizerForLocale(locales) {
  const stringLocale = Array.isArray(locales) ? locales.join(" ") : locales;
  let memoizer = cache.get(stringLocale);
  if (memoizer === undefined) {
    memoizer = new Map();
    cache.set(stringLocale, memoizer);
  }
  return memoizer;
}
;// ./node_modules/@fluent/bundle/esm/bundle.js





class FluentBundle {
  constructor(locales, {
    functions,
    useIsolating = true,
    transform = v => v
  } = {}) {
    this._terms = new Map();
    this._messages = new Map();
    this.locales = Array.isArray(locales) ? locales : [locales];
    this._functions = {
      NUMBER: NUMBER,
      DATETIME: DATETIME,
      ...functions
    };
    this._useIsolating = useIsolating;
    this._transform = transform;
    this._intls = getMemoizerForLocale(locales);
  }
  hasMessage(id) {
    return this._messages.has(id);
  }
  getMessage(id) {
    return this._messages.get(id);
  }
  addResource(res, {
    allowOverrides = false
  } = {}) {
    const errors = [];
    for (let i = 0; i < res.body.length; i++) {
      let entry = res.body[i];
      if (entry.id.startsWith("-")) {
        if (allowOverrides === false && this._terms.has(entry.id)) {
          errors.push(new Error(`Attempt to override an existing term: "${entry.id}"`));
          continue;
        }
        this._terms.set(entry.id, entry);
      } else {
        if (allowOverrides === false && this._messages.has(entry.id)) {
          errors.push(new Error(`Attempt to override an existing message: "${entry.id}"`));
          continue;
        }
        this._messages.set(entry.id, entry);
      }
    }
    return errors;
  }
  formatPattern(pattern, args = null, errors = null) {
    if (typeof pattern === "string") {
      return this._transform(pattern);
    }
    let scope = new Scope(this, errors, args);
    try {
      let value = resolveComplexPattern(scope, pattern);
      return value.toString(scope);
    } catch (err) {
      if (scope.errors && err instanceof Error) {
        scope.errors.push(err);
        return new FluentNone().toString(scope);
      }
      throw err;
    }
  }
}
;// ./node_modules/@fluent/bundle/esm/resource.js
const RE_MESSAGE_START = /^(-?[a-zA-Z][\w-]*) *= */gm;
const RE_ATTRIBUTE_START = /\.([a-zA-Z][\w-]*) *= */y;
const RE_VARIANT_START = /\*?\[/y;
const RE_NUMBER_LITERAL = /(-?[0-9]+(?:\.([0-9]+))?)/y;
const RE_IDENTIFIER = /([a-zA-Z][\w-]*)/y;
const RE_REFERENCE = /([$-])?([a-zA-Z][\w-]*)(?:\.([a-zA-Z][\w-]*))?/y;
const RE_FUNCTION_NAME = /^[A-Z][A-Z0-9_-]*$/;
const RE_TEXT_RUN = /([^{}\n\r]+)/y;
const RE_STRING_RUN = /([^\\"\n\r]*)/y;
const RE_STRING_ESCAPE = /\\([\\"])/y;
const RE_UNICODE_ESCAPE = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{6})/y;
const RE_LEADING_NEWLINES = /^\n+/;
const RE_TRAILING_SPACES = / +$/;
const RE_BLANK_LINES = / *\r?\n/g;
const RE_INDENT = /( *)$/;
const TOKEN_BRACE_OPEN = /{\s*/y;
const TOKEN_BRACE_CLOSE = /\s*}/y;
const TOKEN_BRACKET_OPEN = /\[\s*/y;
const TOKEN_BRACKET_CLOSE = /\s*] */y;
const TOKEN_PAREN_OPEN = /\s*\(\s*/y;
const TOKEN_ARROW = /\s*->\s*/y;
const TOKEN_COLON = /\s*:\s*/y;
const TOKEN_COMMA = /\s*,?\s*/y;
const TOKEN_BLANK = /\s+/y;
class FluentResource {
  constructor(source) {
    this.body = [];
    RE_MESSAGE_START.lastIndex = 0;
    let cursor = 0;
    while (true) {
      let next = RE_MESSAGE_START.exec(source);
      if (next === null) {
        break;
      }
      cursor = RE_MESSAGE_START.lastIndex;
      try {
        this.body.push(parseMessage(next[1]));
      } catch (err) {
        if (err instanceof SyntaxError) {
          continue;
        }
        throw err;
      }
    }
    function test(re) {
      re.lastIndex = cursor;
      return re.test(source);
    }
    function consumeChar(char, errorClass) {
      if (source[cursor] === char) {
        cursor++;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${char}`);
      }
      return false;
    }
    function consumeToken(re, errorClass) {
      if (test(re)) {
        cursor = re.lastIndex;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${re.toString()}`);
      }
      return false;
    }
    function match(re) {
      re.lastIndex = cursor;
      let result = re.exec(source);
      if (result === null) {
        throw new SyntaxError(`Expected ${re.toString()}`);
      }
      cursor = re.lastIndex;
      return result;
    }
    function match1(re) {
      return match(re)[1];
    }
    function parseMessage(id) {
      let value = parsePattern();
      let attributes = parseAttributes();
      if (value === null && Object.keys(attributes).length === 0) {
        throw new SyntaxError("Expected message value or attributes");
      }
      return {
        id,
        value,
        attributes
      };
    }
    function parseAttributes() {
      let attrs = Object.create(null);
      while (test(RE_ATTRIBUTE_START)) {
        let name = match1(RE_ATTRIBUTE_START);
        let value = parsePattern();
        if (value === null) {
          throw new SyntaxError("Expected attribute value");
        }
        attrs[name] = value;
      }
      return attrs;
    }
    function parsePattern() {
      let first;
      if (test(RE_TEXT_RUN)) {
        first = match1(RE_TEXT_RUN);
      }
      if (source[cursor] === "{" || source[cursor] === "}") {
        return parsePatternElements(first ? [first] : [], Infinity);
      }
      let indent = parseIndent();
      if (indent) {
        if (first) {
          return parsePatternElements([first, indent], indent.length);
        }
        indent.value = trim(indent.value, RE_LEADING_NEWLINES);
        return parsePatternElements([indent], indent.length);
      }
      if (first) {
        return trim(first, RE_TRAILING_SPACES);
      }
      return null;
    }
    function parsePatternElements(elements = [], commonIndent) {
      while (true) {
        if (test(RE_TEXT_RUN)) {
          elements.push(match1(RE_TEXT_RUN));
          continue;
        }
        if (source[cursor] === "{") {
          elements.push(parsePlaceable());
          continue;
        }
        if (source[cursor] === "}") {
          throw new SyntaxError("Unbalanced closing brace");
        }
        let indent = parseIndent();
        if (indent) {
          elements.push(indent);
          commonIndent = Math.min(commonIndent, indent.length);
          continue;
        }
        break;
      }
      let lastIndex = elements.length - 1;
      let lastElement = elements[lastIndex];
      if (typeof lastElement === "string") {
        elements[lastIndex] = trim(lastElement, RE_TRAILING_SPACES);
      }
      let baked = [];
      for (let element of elements) {
        if (element instanceof Indent) {
          element = element.value.slice(0, element.value.length - commonIndent);
        }
        if (element) {
          baked.push(element);
        }
      }
      return baked;
    }
    function parsePlaceable() {
      consumeToken(TOKEN_BRACE_OPEN, SyntaxError);
      let selector = parseInlineExpression();
      if (consumeToken(TOKEN_BRACE_CLOSE)) {
        return selector;
      }
      if (consumeToken(TOKEN_ARROW)) {
        let variants = parseVariants();
        consumeToken(TOKEN_BRACE_CLOSE, SyntaxError);
        return {
          type: "select",
          selector,
          ...variants
        };
      }
      throw new SyntaxError("Unclosed placeable");
    }
    function parseInlineExpression() {
      if (source[cursor] === "{") {
        return parsePlaceable();
      }
      if (test(RE_REFERENCE)) {
        let [, sigil, name, attr = null] = match(RE_REFERENCE);
        if (sigil === "$") {
          return {
            type: "var",
            name
          };
        }
        if (consumeToken(TOKEN_PAREN_OPEN)) {
          let args = parseArguments();
          if (sigil === "-") {
            return {
              type: "term",
              name,
              attr,
              args
            };
          }
          if (RE_FUNCTION_NAME.test(name)) {
            return {
              type: "func",
              name,
              args
            };
          }
          throw new SyntaxError("Function names must be all upper-case");
        }
        if (sigil === "-") {
          return {
            type: "term",
            name,
            attr,
            args: []
          };
        }
        return {
          type: "mesg",
          name,
          attr
        };
      }
      return parseLiteral();
    }
    function parseArguments() {
      let args = [];
      while (true) {
        switch (source[cursor]) {
          case ")":
            cursor++;
            return args;
          case undefined:
            throw new SyntaxError("Unclosed argument list");
        }
        args.push(parseArgument());
        consumeToken(TOKEN_COMMA);
      }
    }
    function parseArgument() {
      let expr = parseInlineExpression();
      if (expr.type !== "mesg") {
        return expr;
      }
      if (consumeToken(TOKEN_COLON)) {
        return {
          type: "narg",
          name: expr.name,
          value: parseLiteral()
        };
      }
      return expr;
    }
    function parseVariants() {
      let variants = [];
      let count = 0;
      let star;
      while (test(RE_VARIANT_START)) {
        if (consumeChar("*")) {
          star = count;
        }
        let key = parseVariantKey();
        let value = parsePattern();
        if (value === null) {
          throw new SyntaxError("Expected variant value");
        }
        variants[count++] = {
          key,
          value
        };
      }
      if (count === 0) {
        return null;
      }
      if (star === undefined) {
        throw new SyntaxError("Expected default variant");
      }
      return {
        variants,
        star
      };
    }
    function parseVariantKey() {
      consumeToken(TOKEN_BRACKET_OPEN, SyntaxError);
      let key;
      if (test(RE_NUMBER_LITERAL)) {
        key = parseNumberLiteral();
      } else {
        key = {
          type: "str",
          value: match1(RE_IDENTIFIER)
        };
      }
      consumeToken(TOKEN_BRACKET_CLOSE, SyntaxError);
      return key;
    }
    function parseLiteral() {
      if (test(RE_NUMBER_LITERAL)) {
        return parseNumberLiteral();
      }
      if (source[cursor] === '"') {
        return parseStringLiteral();
      }
      throw new SyntaxError("Invalid expression");
    }
    function parseNumberLiteral() {
      let [, value, fraction = ""] = match(RE_NUMBER_LITERAL);
      let precision = fraction.length;
      return {
        type: "num",
        value: parseFloat(value),
        precision
      };
    }
    function parseStringLiteral() {
      consumeChar('"', SyntaxError);
      let value = "";
      while (true) {
        value += match1(RE_STRING_RUN);
        if (source[cursor] === "\\") {
          value += parseEscapeSequence();
          continue;
        }
        if (consumeChar('"')) {
          return {
            type: "str",
            value
          };
        }
        throw new SyntaxError("Unclosed string literal");
      }
    }
    function parseEscapeSequence() {
      if (test(RE_STRING_ESCAPE)) {
        return match1(RE_STRING_ESCAPE);
      }
      if (test(RE_UNICODE_ESCAPE)) {
        let [, codepoint4, codepoint6] = match(RE_UNICODE_ESCAPE);
        let codepoint = parseInt(codepoint4 || codepoint6, 16);
        return codepoint <= 0xd7ff || 0xe000 <= codepoint ? String.fromCodePoint(codepoint) : "�";
      }
      throw new SyntaxError("Unknown escape sequence");
    }
    function parseIndent() {
      let start = cursor;
      consumeToken(TOKEN_BLANK);
      switch (source[cursor]) {
        case ".":
        case "[":
        case "*":
        case "}":
        case undefined:
          return false;
        case "{":
          return makeIndent(source.slice(start, cursor));
      }
      if (source[cursor - 1] === " ") {
        return makeIndent(source.slice(start, cursor));
      }
      return false;
    }
    function trim(text, re) {
      return text.replace(re, "");
    }
    function makeIndent(blank) {
      let value = blank.replace(RE_BLANK_LINES, "\n");
      let length = RE_INDENT.exec(blank)[1].length;
      return new Indent(value, length);
    }
  }
}
class Indent {
  constructor(value, length) {
    this.value = value;
    this.length = length;
  }
}
;// ./node_modules/@fluent/bundle/esm/index.js



;// ./node_modules/@fluent/dom/esm/overlay.js
const reOverlay = /<|&#?\w+;/;
const TEXT_LEVEL_ELEMENTS = {
  "http://www.w3.org/1999/xhtml": ["em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr"]
};
const LOCALIZABLE_ATTRIBUTES = {
  "http://www.w3.org/1999/xhtml": {
    global: ["title", "aria-label", "aria-valuetext"],
    a: ["download"],
    area: ["download", "alt"],
    input: ["alt", "placeholder"],
    menuitem: ["label"],
    menu: ["label"],
    optgroup: ["label"],
    option: ["label"],
    track: ["label"],
    img: ["alt"],
    textarea: ["placeholder"],
    th: ["abbr"]
  },
  "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul": {
    global: ["accesskey", "aria-label", "aria-valuetext", "label", "title", "tooltiptext"],
    description: ["value"],
    key: ["key", "keycode"],
    label: ["value"],
    textbox: ["placeholder", "value"]
  }
};
function translateElement(element, translation) {
  const {
    value
  } = translation;
  if (typeof value === "string") {
    if (element.localName === "title" && element.namespaceURI === "http://www.w3.org/1999/xhtml") {
      element.textContent = value;
    } else if (!reOverlay.test(value)) {
      element.textContent = value;
    } else {
      const templateElement = element.ownerDocument.createElementNS("http://www.w3.org/1999/xhtml", "template");
      templateElement.innerHTML = value;
      overlayChildNodes(templateElement.content, element);
    }
  }
  overlayAttributes(translation, element);
}
function overlayChildNodes(fromFragment, toElement) {
  for (const childNode of fromFragment.childNodes) {
    if (childNode.nodeType === childNode.TEXT_NODE) {
      continue;
    }
    if (childNode.hasAttribute("data-l10n-name")) {
      const sanitized = getNodeForNamedElement(toElement, childNode);
      fromFragment.replaceChild(sanitized, childNode);
      continue;
    }
    if (isElementAllowed(childNode)) {
      const sanitized = createSanitizedElement(childNode);
      fromFragment.replaceChild(sanitized, childNode);
      continue;
    }
    console.warn(`An element of forbidden type "${childNode.localName}" was found in ` + "the translation. Only safe text-level elements and elements with " + "data-l10n-name are allowed.");
    fromFragment.replaceChild(createTextNodeFromTextContent(childNode), childNode);
  }
  toElement.textContent = "";
  toElement.appendChild(fromFragment);
}
function hasAttribute(attributes, name) {
  if (!attributes) {
    return false;
  }
  for (let attr of attributes) {
    if (attr.name === name) {
      return true;
    }
  }
  return false;
}
function overlayAttributes(fromElement, toElement) {
  const explicitlyAllowed = toElement.hasAttribute("data-l10n-attrs") ? toElement.getAttribute("data-l10n-attrs").split(",").map(i => i.trim()) : null;
  for (const attr of Array.from(toElement.attributes)) {
    if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed) && !hasAttribute(fromElement.attributes, attr.name)) {
      toElement.removeAttribute(attr.name);
    }
  }
  if (!fromElement.attributes) {
    return;
  }
  for (const attr of Array.from(fromElement.attributes)) {
    if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed) && toElement.getAttribute(attr.name) !== attr.value) {
      toElement.setAttribute(attr.name, attr.value);
    }
  }
}
function getNodeForNamedElement(sourceElement, translatedChild) {
  const childName = translatedChild.getAttribute("data-l10n-name");
  const sourceChild = sourceElement.querySelector(`[data-l10n-name="${childName}"]`);
  if (!sourceChild) {
    console.warn(`An element named "${childName}" wasn't found in the source.`);
    return createTextNodeFromTextContent(translatedChild);
  }
  if (sourceChild.localName !== translatedChild.localName) {
    console.warn(`An element named "${childName}" was found in the translation ` + `but its type ${translatedChild.localName} didn't match the ` + `element found in the source (${sourceChild.localName}).`);
    return createTextNodeFromTextContent(translatedChild);
  }
  sourceElement.removeChild(sourceChild);
  const clone = sourceChild.cloneNode(false);
  return shallowPopulateUsing(translatedChild, clone);
}
function createSanitizedElement(element) {
  const clone = element.ownerDocument.createElement(element.localName);
  return shallowPopulateUsing(element, clone);
}
function createTextNodeFromTextContent(element) {
  return element.ownerDocument.createTextNode(element.textContent);
}
function isElementAllowed(element) {
  const allowed = TEXT_LEVEL_ELEMENTS[element.namespaceURI];
  return allowed && allowed.includes(element.localName);
}
function isAttrNameLocalizable(name, element, explicitlyAllowed = null) {
  if (explicitlyAllowed && explicitlyAllowed.includes(name)) {
    return true;
  }
  const allowed = LOCALIZABLE_ATTRIBUTES[element.namespaceURI];
  if (!allowed) {
    return false;
  }
  const attrName = name.toLowerCase();
  const elemName = element.localName;
  if (allowed.global.includes(attrName)) {
    return true;
  }
  if (!allowed[elemName]) {
    return false;
  }
  if (allowed[elemName].includes(attrName)) {
    return true;
  }
  if (element.namespaceURI === "http://www.w3.org/1999/xhtml" && elemName === "input" && attrName === "value") {
    const type = element.type.toLowerCase();
    if (type === "submit" || type === "button" || type === "reset") {
      return true;
    }
  }
  return false;
}
function shallowPopulateUsing(fromElement, toElement) {
  toElement.textContent = fromElement.textContent;
  overlayAttributes(fromElement, toElement);
  return toElement;
}
;// ./node_modules/cached-iterable/src/cached_iterable.mjs
class CachedIterable extends Array {
  static from(iterable) {
    if (iterable instanceof this) {
      return iterable;
    }
    return new this(iterable);
  }
}
;// ./node_modules/cached-iterable/src/cached_sync_iterable.mjs

class CachedSyncIterable extends CachedIterable {
  constructor(iterable) {
    super();
    if (Symbol.iterator in Object(iterable)) {
      this.iterator = iterable[Symbol.iterator]();
    } else {
      throw new TypeError("Argument must implement the iteration protocol.");
    }
  }
  [Symbol.iterator]() {
    const cached = this;
    let cur = 0;
    return {
      next() {
        if (cached.length <= cur) {
          cached.push(cached.iterator.next());
        }
        return cached[cur++];
      }
    };
  }
  touchNext(count = 1) {
    let idx = 0;
    while (idx++ < count) {
      const last = this[this.length - 1];
      if (last && last.done) {
        break;
      }
      this.push(this.iterator.next());
    }
    return this[this.length - 1];
  }
}
;// ./node_modules/cached-iterable/src/cached_async_iterable.mjs

class CachedAsyncIterable extends CachedIterable {
  constructor(iterable) {
    super();
    if (Symbol.asyncIterator in Object(iterable)) {
      this.iterator = iterable[Symbol.asyncIterator]();
    } else if (Symbol.iterator in Object(iterable)) {
      this.iterator = iterable[Symbol.iterator]();
    } else {
      throw new TypeError("Argument must implement the iteration protocol.");
    }
  }
  [Symbol.asyncIterator]() {
    const cached = this;
    let cur = 0;
    return {
      async next() {
        if (cached.length <= cur) {
          cached.push(cached.iterator.next());
        }
        return cached[cur++];
      }
    };
  }
  async touchNext(count = 1) {
    let idx = 0;
    while (idx++ < count) {
      const last = this[this.length - 1];
      if (last && (await last).done) {
        break;
      }
      this.push(this.iterator.next());
    }
    return this[this.length - 1];
  }
}
;// ./node_modules/cached-iterable/src/index.mjs


;// ./node_modules/@fluent/dom/esm/localization.js

class Localization {
  constructor(resourceIds = [], generateBundles) {
    this.resourceIds = resourceIds;
    this.generateBundles = generateBundles;
    this.onChange(true);
  }
  addResourceIds(resourceIds, eager = false) {
    this.resourceIds.push(...resourceIds);
    this.onChange(eager);
    return this.resourceIds.length;
  }
  removeResourceIds(resourceIds) {
    this.resourceIds = this.resourceIds.filter(r => !resourceIds.includes(r));
    this.onChange();
    return this.resourceIds.length;
  }
  async formatWithFallback(keys, method) {
    const translations = [];
    let hasAtLeastOneBundle = false;
    for await (const bundle of this.bundles) {
      hasAtLeastOneBundle = true;
      const missingIds = keysFromBundle(method, bundle, keys, translations);
      if (missingIds.size === 0) {
        break;
      }
      if (typeof console !== "undefined") {
        const locale = bundle.locales[0];
        const ids = Array.from(missingIds).join(", ");
        console.warn(`[fluent] Missing translations in ${locale}: ${ids}`);
      }
    }
    if (!hasAtLeastOneBundle && typeof console !== "undefined") {
      console.warn(`[fluent] Request for keys failed because no resource bundles got generated.
  keys: ${JSON.stringify(keys)}.
  resourceIds: ${JSON.stringify(this.resourceIds)}.`);
    }
    return translations;
  }
  formatMessages(keys) {
    return this.formatWithFallback(keys, messageFromBundle);
  }
  formatValues(keys) {
    return this.formatWithFallback(keys, valueFromBundle);
  }
  async formatValue(id, args) {
    const [val] = await this.formatValues([{
      id,
      args
    }]);
    return val;
  }
  handleEvent() {
    this.onChange();
  }
  onChange(eager = false) {
    this.bundles = CachedAsyncIterable.from(this.generateBundles(this.resourceIds));
    if (eager) {
      this.bundles.touchNext(2);
    }
  }
}
function valueFromBundle(bundle, errors, message, args) {
  if (message.value) {
    return bundle.formatPattern(message.value, args, errors);
  }
  return null;
}
function messageFromBundle(bundle, errors, message, args) {
  const formatted = {
    value: null,
    attributes: null
  };
  if (message.value) {
    formatted.value = bundle.formatPattern(message.value, args, errors);
  }
  let attrNames = Object.keys(message.attributes);
  if (attrNames.length > 0) {
    formatted.attributes = new Array(attrNames.length);
    for (let [i, name] of attrNames.entries()) {
      let value = bundle.formatPattern(message.attributes[name], args, errors);
      formatted.attributes[i] = {
        name,
        value
      };
    }
  }
  return formatted;
}
function keysFromBundle(method, bundle, keys, translations) {
  const messageErrors = [];
  const missingIds = new Set();
  keys.forEach(({
    id,
    args
  }, i) => {
    if (translations[i] !== undefined) {
      return;
    }
    let message = bundle.getMessage(id);
    if (message) {
      messageErrors.length = 0;
      translations[i] = method(bundle, messageErrors, message, args);
      if (messageErrors.length > 0 && typeof console !== "undefined") {
        const locale = bundle.locales[0];
        const errors = messageErrors.join(", ");
        console.warn(`[fluent][resolver] errors in ${locale}/${id}: ${errors}.`);
      }
    } else {
      missingIds.add(id);
    }
  });
  return missingIds;
}
;// ./node_modules/@fluent/dom/esm/dom_localization.js


const L10NID_ATTR_NAME = "data-l10n-id";
const L10NARGS_ATTR_NAME = "data-l10n-args";
const L10N_ELEMENT_QUERY = `[${L10NID_ATTR_NAME}]`;
class DOMLocalization extends Localization {
  constructor(resourceIds, generateBundles) {
    super(resourceIds, generateBundles);
    this.roots = new Set();
    this.pendingrAF = null;
    this.pendingElements = new Set();
    this.windowElement = null;
    this.mutationObserver = null;
    this.observerConfig = {
      attributes: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: [L10NID_ATTR_NAME, L10NARGS_ATTR_NAME]
    };
  }
  onChange(eager = false) {
    super.onChange(eager);
    if (this.roots) {
      this.translateRoots();
    }
  }
  setAttributes(element, id, args) {
    element.setAttribute(L10NID_ATTR_NAME, id);
    if (args) {
      element.setAttribute(L10NARGS_ATTR_NAME, JSON.stringify(args));
    } else {
      element.removeAttribute(L10NARGS_ATTR_NAME);
    }
    return element;
  }
  getAttributes(element) {
    return {
      id: element.getAttribute(L10NID_ATTR_NAME),
      args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
    };
  }
  connectRoot(newRoot) {
    for (const root of this.roots) {
      if (root === newRoot || root.contains(newRoot) || newRoot.contains(root)) {
        throw new Error("Cannot add a root that overlaps with existing root.");
      }
    }
    if (this.windowElement) {
      if (this.windowElement !== newRoot.ownerDocument.defaultView) {
        throw new Error(`Cannot connect a root:
          DOMLocalization already has a root from a different window.`);
      }
    } else {
      this.windowElement = newRoot.ownerDocument.defaultView;
      this.mutationObserver = new this.windowElement.MutationObserver(mutations => this.translateMutations(mutations));
    }
    this.roots.add(newRoot);
    this.mutationObserver.observe(newRoot, this.observerConfig);
  }
  disconnectRoot(root) {
    this.roots.delete(root);
    this.pauseObserving();
    if (this.roots.size === 0) {
      this.mutationObserver = null;
      if (this.windowElement && this.pendingrAF) {
        this.windowElement.cancelAnimationFrame(this.pendingrAF);
      }
      this.windowElement = null;
      this.pendingrAF = null;
      this.pendingElements.clear();
      return true;
    }
    this.resumeObserving();
    return false;
  }
  translateRoots() {
    const roots = Array.from(this.roots);
    return Promise.all(roots.map(root => this.translateFragment(root)));
  }
  pauseObserving() {
    if (!this.mutationObserver) {
      return;
    }
    this.translateMutations(this.mutationObserver.takeRecords());
    this.mutationObserver.disconnect();
  }
  resumeObserving() {
    if (!this.mutationObserver) {
      return;
    }
    for (const root of this.roots) {
      this.mutationObserver.observe(root, this.observerConfig);
    }
  }
  translateMutations(mutations) {
    for (const mutation of mutations) {
      switch (mutation.type) {
        case "attributes":
          if (mutation.target.hasAttribute("data-l10n-id")) {
            this.pendingElements.add(mutation.target);
          }
          break;
        case "childList":
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
              if (addedNode.childElementCount) {
                for (const element of this.getTranslatables(addedNode)) {
                  this.pendingElements.add(element);
                }
              } else if (addedNode.hasAttribute(L10NID_ATTR_NAME)) {
                this.pendingElements.add(addedNode);
              }
            }
          }
          break;
      }
    }
    if (this.pendingElements.size > 0) {
      if (this.pendingrAF === null) {
        this.pendingrAF = this.windowElement.requestAnimationFrame(() => {
          this.translateElements(Array.from(this.pendingElements));
          this.pendingElements.clear();
          this.pendingrAF = null;
        });
      }
    }
  }
  translateFragment(frag) {
    return this.translateElements(this.getTranslatables(frag));
  }
  async translateElements(elements) {
    if (!elements.length) {
      return undefined;
    }
    const keys = elements.map(this.getKeysForElement);
    const translations = await this.formatMessages(keys);
    return this.applyTranslations(elements, translations);
  }
  applyTranslations(elements, translations) {
    this.pauseObserving();
    for (let i = 0; i < elements.length; i++) {
      if (translations[i] !== undefined) {
        translateElement(elements[i], translations[i]);
      }
    }
    this.resumeObserving();
  }
  getTranslatables(element) {
    const nodes = Array.from(element.querySelectorAll(L10N_ELEMENT_QUERY));
    if (typeof element.hasAttribute === "function" && element.hasAttribute(L10NID_ATTR_NAME)) {
      nodes.push(element);
    }
    return nodes;
  }
  getKeysForElement(element) {
    return {
      id: element.getAttribute(L10NID_ATTR_NAME),
      args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
    };
  }
}
;// ./node_modules/@fluent/dom/esm/index.js


;// ./web/l10n.js
class L10n {
  #dir;
  #elements = new Set();
  #lang;
  #l10n;
  constructor({
    lang,
    isRTL
  }, l10n = null) {
    this.#lang = L10n.#fixupLangCode(lang);
    this.#l10n = l10n;
    this.#dir = isRTL ?? L10n.#isRTL(this.#lang) ? "rtl" : "ltr";
  }
  _setL10n(l10n) {
    this.#l10n = l10n;
  }
  getLanguage() {
    return this.#lang;
  }
  getDirection() {
    return this.#dir;
  }
  async get(ids, args = null, fallback) {
    if (Array.isArray(ids)) {
      ids = ids.map(id => ({
        id
      }));
      const messages = await this.#l10n.formatMessages(ids);
      return messages.map(message => message.value);
    }
    const messages = await this.#l10n.formatMessages([{
      id: ids,
      args
    }]);
    return messages[0]?.value || fallback;
  }
  async translate(element) {
    this.#elements.add(element);
    try {
      this.#l10n.connectRoot(element);
      await this.#l10n.translateRoots();
    } catch {}
  }
  async translateOnce(element) {
    try {
      await this.#l10n.translateElements([element]);
    } catch (ex) {
      console.error(`translateOnce: "${ex}".`);
    }
  }
  async destroy() {
    for (const element of this.#elements) {
      this.#l10n.disconnectRoot(element);
    }
    this.#elements.clear();
    this.#l10n.pauseObserving();
  }
  pause() {
    this.#l10n.pauseObserving();
  }
  resume() {
    this.#l10n.resumeObserving();
  }
  static #fixupLangCode(langCode) {
    langCode = langCode?.toLowerCase() || "en-us";
    const PARTIAL_LANG_CODES = {
      en: "en-us",
      es: "es-es",
      fy: "fy-nl",
      ga: "ga-ie",
      gu: "gu-in",
      hi: "hi-in",
      hy: "hy-am",
      nb: "nb-no",
      ne: "ne-np",
      nn: "nn-no",
      pa: "pa-in",
      pt: "pt-pt",
      sv: "sv-se",
      zh: "zh-cn"
    };
    return PARTIAL_LANG_CODES[langCode] || langCode;
  }
  static #isRTL(lang) {
    const shortCode = lang.split("-", 1)[0];
    return ["ar", "he", "fa", "ps", "ur"].includes(shortCode);
  }
}
const GenericL10n = null;

;// ./web/genericl10n.js




function createBundle(lang, text) {
  const resource = new FluentResource(text);
  const bundle = new FluentBundle(lang);
  const errors = bundle.addResource(resource);
  if (errors.length) {
    console.error("L10n errors", errors);
  }
  return bundle;
}
class genericl10n_GenericL10n extends L10n {
  constructor(lang) {
    super({
      lang
    });
    const generateBundles = !lang ? genericl10n_GenericL10n.#generateBundlesFallback.bind(genericl10n_GenericL10n, this.getLanguage()) : genericl10n_GenericL10n.#generateBundles.bind(genericl10n_GenericL10n, "en-us", this.getLanguage());
    this._setL10n(new DOMLocalization([], generateBundles));
  }
  static async *#generateBundles(defaultLang, baseLang) {
    const {
      baseURL,
      paths
    } = await this.#getPaths();
    const langs = [baseLang];
    if (defaultLang !== baseLang) {
      const shortLang = baseLang.split("-", 1)[0];
      if (shortLang !== baseLang) {
        langs.push(shortLang);
      }
      langs.push(defaultLang);
    }
    for (const lang of langs) {
      const bundle = await this.#createBundle(lang, baseURL, paths);
      if (bundle) {
        yield bundle;
      } else if (lang === "en-us") {
        yield this.#createBundleFallback(lang);
      }
    }
  }
  static async #createBundle(lang, baseURL, paths) {
    const path = paths[lang];
    if (!path) {
      return null;
    }
    const url = new URL(path, baseURL);
    const text = await fetchData(url, "text");
    return createBundle(lang, text);
  }
  static async #getPaths() {
    try {
      const {
        href
      } = document.querySelector(`link[type="application/l10n"]`);
      const paths = await fetchData(href, "json");
      return {
        baseURL: href.replace(/[^/]*$/, "") || "./",
        paths
      };
    } catch {}
    return {
      baseURL: "./",
      paths: Object.create(null)
    };
  }
  static async *#generateBundlesFallback(lang) {
    yield this.#createBundleFallback(lang);
  }
  static async #createBundleFallback(lang) {
    const text = "pdfjs-previous-button =\n    .title = Previous Page\npdfjs-previous-button-label = Previous\npdfjs-next-button =\n    .title = Next Page\npdfjs-next-button-label = Next\npdfjs-page-input =\n    .title = Page\npdfjs-of-pages = / { $pagesCount }\npdfjs-page-of-pages = ({ $pageNumber } / { $pagesCount })\npdfjs-zoom-out-button =\n    .title = Zoom Out\npdfjs-zoom-out-button-label = Zoom Out\npdfjs-zoom-in-button =\n    .title = Zoom In\npdfjs-zoom-in-button-label = Zoom In\npdfjs-zoom-select =\n    .title = Zoom\npdfjs-presentation-mode-button =\n    .title = Switch to Presentation Mode\npdfjs-presentation-mode-button-label = Presentation Mode\npdfjs-open-file-button =\n    .title = Open File\npdfjs-open-file-button-label = Open\npdfjs-print-button =\n    .title = Print\npdfjs-print-button-label = Print\npdfjs-save-button =\n    .title = Save\npdfjs-save-button-label = Save\npdfjs-download-button =\n    .title = Download\npdfjs-download-button-label = Download\npdfjs-bookmark-button =\n    .title = Current Page (View URL from Current Page)\npdfjs-bookmark-button-label = Current Page\npdfjs-tools-button =\n    .title = Tools\npdfjs-tools-button-label = Tools\npdfjs-first-page-button =\n    .title = Go to First Page\npdfjs-first-page-button-label = Go to First Page\npdfjs-last-page-button =\n    .title = Go to Last Page\npdfjs-last-page-button-label = Go to Last Page\npdfjs-page-rotate-cw-button =\n    .title = Rotate Clockwise\npdfjs-page-rotate-cw-button-label = Rotate Clockwise\npdfjs-page-rotate-ccw-button =\n    .title = Rotate Counterclockwise\npdfjs-page-rotate-ccw-button-label = Rotate Counterclockwise\npdfjs-cursor-text-select-tool-button =\n    .title = Enable Text Selection Tool\npdfjs-cursor-text-select-tool-button-label = Text Selection Tool\npdfjs-cursor-hand-tool-button =\n    .title = Enable Hand Tool\npdfjs-cursor-hand-tool-button-label = Hand Tool\npdfjs-scroll-page-button =\n    .title = Use Page Scrolling\npdfjs-scroll-page-button-label = Page Scrolling\npdfjs-scroll-vertical-button =\n    .title = Use Vertical Scrolling\npdfjs-scroll-vertical-button-label = Vertical Scrolling\npdfjs-scroll-horizontal-button =\n    .title = Use Horizontal Scrolling\npdfjs-scroll-horizontal-button-label = Horizontal Scrolling\npdfjs-scroll-wrapped-button =\n    .title = Use Wrapped Scrolling\npdfjs-scroll-wrapped-button-label = Wrapped Scrolling\npdfjs-spread-none-button =\n    .title = Do not join page spreads\npdfjs-spread-none-button-label = No Spreads\npdfjs-spread-odd-button =\n    .title = Join page spreads starting with odd-numbered pages\npdfjs-spread-odd-button-label = Odd Spreads\npdfjs-spread-even-button =\n    .title = Join page spreads starting with even-numbered pages\npdfjs-spread-even-button-label = Even Spreads\npdfjs-document-properties-button =\n    .title = Document Properties\u2026\npdfjs-document-properties-button-label = Document Properties\u2026\npdfjs-document-properties-file-name = File name:\npdfjs-document-properties-file-size = File size:\npdfjs-document-properties-size-kb = { NUMBER($kb, maximumSignificantDigits: 3) } KB ({ $b } bytes)\npdfjs-document-properties-size-mb = { NUMBER($mb, maximumSignificantDigits: 3) } MB ({ $b } bytes)\npdfjs-document-properties-title = Title:\npdfjs-document-properties-author = Author:\npdfjs-document-properties-subject = Subject:\npdfjs-document-properties-keywords = Keywords:\npdfjs-document-properties-creation-date = Creation Date:\npdfjs-document-properties-modification-date = Modification Date:\npdfjs-document-properties-date-time-string = { DATETIME($dateObj, dateStyle: \"short\", timeStyle: \"medium\") }\npdfjs-document-properties-creator = Creator:\npdfjs-document-properties-producer = PDF Producer:\npdfjs-document-properties-version = PDF Version:\npdfjs-document-properties-page-count = Page Count:\npdfjs-document-properties-page-size = Page Size:\npdfjs-document-properties-page-size-unit-inches = in\npdfjs-document-properties-page-size-unit-millimeters = mm\npdfjs-document-properties-page-size-orientation-portrait = portrait\npdfjs-document-properties-page-size-orientation-landscape = landscape\npdfjs-document-properties-page-size-name-a-three = A3\npdfjs-document-properties-page-size-name-a-four = A4\npdfjs-document-properties-page-size-name-letter = Letter\npdfjs-document-properties-page-size-name-legal = Legal\npdfjs-document-properties-page-size-dimension-string = { $width } \xD7 { $height } { $unit } ({ $orientation })\npdfjs-document-properties-page-size-dimension-name-string = { $width } \xD7 { $height } { $unit } ({ $name }, { $orientation })\npdfjs-document-properties-linearized = Fast Web View:\npdfjs-document-properties-linearized-yes = Yes\npdfjs-document-properties-linearized-no = No\npdfjs-document-properties-close-button = Close\npdfjs-print-progress-message = Preparing document for printing\u2026\npdfjs-print-progress-percent = { $progress }%\npdfjs-print-progress-close-button = Cancel\npdfjs-printing-not-supported = Warning: Printing is not fully supported by this browser.\npdfjs-printing-not-ready = Warning: The PDF is not fully loaded for printing.\npdfjs-toggle-sidebar-button =\n    .title = Toggle Sidebar\npdfjs-toggle-sidebar-notification-button =\n    .title = Toggle Sidebar (document contains outline/attachments/layers)\npdfjs-toggle-sidebar-button-label = Toggle Sidebar\npdfjs-document-outline-button =\n    .title = Show Document Outline (double-click to expand/collapse all items)\npdfjs-document-outline-button-label = Document Outline\npdfjs-attachments-button =\n    .title = Show Attachments\npdfjs-attachments-button-label = Attachments\npdfjs-layers-button =\n    .title = Show Layers (double-click to reset all layers to the default state)\npdfjs-layers-button-label = Layers\npdfjs-thumbs-button =\n    .title = Show Thumbnails\npdfjs-thumbs-button-label = Thumbnails\npdfjs-current-outline-item-button =\n    .title = Find Current Outline Item\npdfjs-current-outline-item-button-label = Current Outline Item\npdfjs-findbar-button =\n    .title = Find in Document\npdfjs-findbar-button-label = Find\npdfjs-additional-layers = Additional Layers\npdfjs-thumb-page-title =\n    .title = Page { $page }\npdfjs-thumb-page-canvas =\n    .aria-label = Thumbnail of Page { $page }\npdfjs-find-input =\n    .title = Find\n    .placeholder = Find in document\u2026\npdfjs-find-previous-button =\n    .title = Find the previous occurrence of the phrase\npdfjs-find-previous-button-label = Previous\npdfjs-find-next-button =\n    .title = Find the next occurrence of the phrase\npdfjs-find-next-button-label = Next\npdfjs-find-highlight-checkbox = Highlight All\npdfjs-find-match-case-checkbox-label = Match Case\npdfjs-find-match-diacritics-checkbox-label = Match Diacritics\npdfjs-find-entire-word-checkbox-label = Whole Words\npdfjs-find-reached-top = Reached top of document, continued from bottom\npdfjs-find-reached-bottom = Reached end of document, continued from top\npdfjs-find-match-count =\n    { $total ->\n        [one] { $current } of { $total } match\n       *[other] { $current } of { $total } matches\n    }\npdfjs-find-match-count-limit =\n    { $limit ->\n        [one] More than { $limit } match\n       *[other] More than { $limit } matches\n    }\npdfjs-find-not-found = Phrase not found\npdfjs-page-scale-width = Page Width\npdfjs-page-scale-fit = Page Fit\npdfjs-page-scale-auto = Automatic Zoom\npdfjs-page-scale-actual = Actual Size\npdfjs-page-scale-percent = { $scale }%\npdfjs-page-landmark =\n    .aria-label = Page { $page }\npdfjs-loading-error = An error occurred while loading the PDF.\npdfjs-invalid-file-error = Invalid or corrupted PDF file.\npdfjs-missing-file-error = Missing PDF file.\npdfjs-unexpected-response-error = Unexpected server response.\npdfjs-rendering-error = An error occurred while rendering the page.\npdfjs-annotation-date-time-string = { DATETIME($dateObj, dateStyle: \"short\", timeStyle: \"medium\") }\npdfjs-text-annotation-type =\n    .alt = [{ $type } Annotation]\npdfjs-password-label = Enter the password to open this PDF file.\npdfjs-password-invalid = Invalid password. Please try again.\npdfjs-password-ok-button = OK\npdfjs-password-cancel-button = Cancel\npdfjs-web-fonts-disabled = Web fonts are disabled: unable to use embedded PDF fonts.\npdfjs-editor-free-text-button =\n    .title = Text\npdfjs-editor-free-text-button-label = Text\npdfjs-editor-ink-button =\n    .title = Draw\npdfjs-editor-ink-button-label = Draw\npdfjs-editor-stamp-button =\n    .title = Add or edit images\npdfjs-editor-stamp-button-label = Add or edit images\npdfjs-editor-highlight-button =\n    .title = Highlight\npdfjs-editor-highlight-button-label = Highlight\npdfjs-highlight-floating-button1 =\n    .title = Highlight\n    .aria-label = Highlight\npdfjs-highlight-floating-button-label = Highlight\npdfjs-editor-remove-ink-button =\n    .title = Remove drawing\npdfjs-editor-remove-freetext-button =\n    .title = Remove text\npdfjs-editor-remove-stamp-button =\n    .title = Remove image\npdfjs-editor-remove-highlight-button =\n    .title = Remove highlight\npdfjs-editor-free-text-color-input = Color\npdfjs-editor-free-text-size-input = Size\npdfjs-editor-ink-color-input = Color\npdfjs-editor-ink-thickness-input = Thickness\npdfjs-editor-ink-opacity-input = Opacity\npdfjs-editor-stamp-add-image-button =\n    .title = Add image\npdfjs-editor-stamp-add-image-button-label = Add image\npdfjs-editor-free-highlight-thickness-input = Thickness\npdfjs-editor-free-highlight-thickness-title =\n    .title = Change thickness when highlighting items other than text\npdfjs-free-text =\n    .aria-label = Text Editor\npdfjs-free-text-default-content = Start typing\u2026\npdfjs-ink =\n    .aria-label = Draw Editor\npdfjs-ink-canvas =\n    .aria-label = User-created image\npdfjs-editor-alt-text-button-label = Alt text\npdfjs-editor-alt-text-edit-button-label = Edit alt text\npdfjs-editor-alt-text-dialog-label = Choose an option\npdfjs-editor-alt-text-dialog-description = Alt text (alternative text) helps when people can\u2019t see the image or when it doesn\u2019t load.\npdfjs-editor-alt-text-add-description-label = Add a description\npdfjs-editor-alt-text-add-description-description = Aim for 1-2 sentences that describe the subject, setting, or actions.\npdfjs-editor-alt-text-mark-decorative-label = Mark as decorative\npdfjs-editor-alt-text-mark-decorative-description = This is used for ornamental images, like borders or watermarks.\npdfjs-editor-alt-text-cancel-button = Cancel\npdfjs-editor-alt-text-save-button = Save\npdfjs-editor-alt-text-decorative-tooltip = Marked as decorative\npdfjs-editor-alt-text-textarea =\n    .placeholder = For example, \u201CA young man sits down at a table to eat a meal\u201D\npdfjs-editor-resizer-top-left =\n    .aria-label = Top left corner \u2014 resize\npdfjs-editor-resizer-top-middle =\n    .aria-label = Top middle \u2014 resize\npdfjs-editor-resizer-top-right =\n    .aria-label = Top right corner \u2014 resize\npdfjs-editor-resizer-middle-right =\n    .aria-label = Middle right \u2014 resize\npdfjs-editor-resizer-bottom-right =\n    .aria-label = Bottom right corner \u2014 resize\npdfjs-editor-resizer-bottom-middle =\n    .aria-label = Bottom middle \u2014 resize\npdfjs-editor-resizer-bottom-left =\n    .aria-label = Bottom left corner \u2014 resize\npdfjs-editor-resizer-middle-left =\n    .aria-label = Middle left \u2014 resize\npdfjs-editor-highlight-colorpicker-label = Highlight color\npdfjs-editor-colorpicker-button =\n    .title = Change color\npdfjs-editor-colorpicker-dropdown =\n    .aria-label = Color choices\npdfjs-editor-colorpicker-yellow =\n    .title = Yellow\npdfjs-editor-colorpicker-green =\n    .title = Green\npdfjs-editor-colorpicker-blue =\n    .title = Blue\npdfjs-editor-colorpicker-pink =\n    .title = Pink\npdfjs-editor-colorpicker-red =\n    .title = Red\npdfjs-editor-highlight-show-all-button-label = Show all\npdfjs-editor-highlight-show-all-button =\n    .title = Show all\npdfjs-editor-new-alt-text-dialog-edit-label = Edit alt text (image description)\npdfjs-editor-new-alt-text-dialog-add-label = Add alt text (image description)\npdfjs-editor-new-alt-text-textarea =\n    .placeholder = Write your description here\u2026\npdfjs-editor-new-alt-text-description = Short description for people who can\u2019t see the image or when the image doesn\u2019t load.\npdfjs-editor-new-alt-text-disclaimer1 = This alt text was created automatically and may be inaccurate.\npdfjs-editor-new-alt-text-disclaimer-learn-more-url = Learn more\npdfjs-editor-new-alt-text-create-automatically-button-label = Create alt text automatically\npdfjs-editor-new-alt-text-not-now-button = Not now\npdfjs-editor-new-alt-text-error-title = Couldn\u2019t create alt text automatically\npdfjs-editor-new-alt-text-error-description = Please write your own alt text or try again later.\npdfjs-editor-new-alt-text-error-close-button = Close\npdfjs-editor-new-alt-text-ai-model-downloading-progress = Downloading alt text AI model ({ $downloadedSize } of { $totalSize } MB)\n    .aria-valuetext = Downloading alt text AI model ({ $downloadedSize } of { $totalSize } MB)\npdfjs-editor-new-alt-text-added-button-label = Alt text added\npdfjs-editor-new-alt-text-missing-button-label = Missing alt text\npdfjs-editor-new-alt-text-to-review-button-label = Review alt text\npdfjs-editor-new-alt-text-generated-alt-text-with-disclaimer = Created automatically: { $generatedAltText }\npdfjs-image-alt-text-settings-button =\n    .title = Image alt text settings\npdfjs-image-alt-text-settings-button-label = Image alt text settings\npdfjs-editor-alt-text-settings-dialog-label = Image alt text settings\npdfjs-editor-alt-text-settings-automatic-title = Automatic alt text\npdfjs-editor-alt-text-settings-create-model-button-label = Create alt text automatically\npdfjs-editor-alt-text-settings-create-model-description = Suggests descriptions to help people who can\u2019t see the image or when the image doesn\u2019t load.\npdfjs-editor-alt-text-settings-download-model-label = Alt text AI model ({ $totalSize } MB)\npdfjs-editor-alt-text-settings-ai-model-description = Runs locally on your device so your data stays private. Required for automatic alt text.\npdfjs-editor-alt-text-settings-delete-model-button = Delete\npdfjs-editor-alt-text-settings-download-model-button = Download\npdfjs-editor-alt-text-settings-downloading-model-button = Downloading\u2026\npdfjs-editor-alt-text-settings-editor-title = Alt text editor\npdfjs-editor-alt-text-settings-show-dialog-button-label = Show alt text editor right away when adding an image\npdfjs-editor-alt-text-settings-show-dialog-description = Helps you make sure all your images have alt text.\npdfjs-editor-alt-text-settings-close-button = Close";
    return createBundle(lang, text);
  }
}

;// ./web/generic_scripting.js

async function docProperties(pdfDocument) {
  const url = "",
    baseUrl = url.split("#", 1)[0];
  let {
    info,
    metadata,
    contentDispositionFilename,
    contentLength
  } = await pdfDocument.getMetadata();
  if (!contentLength) {
    const {
      length
    } = await pdfDocument.getDownloadInfo();
    contentLength = length;
  }
  return {
    ...info,
    baseURL: baseUrl,
    filesize: contentLength,
    filename: contentDispositionFilename || getPdfFilenameFromUrl(url),
    metadata: metadata?.getRaw(),
    authors: metadata?.get("dc:creator"),
    numPages: pdfDocument.numPages,
    URL: url
  };
}
class GenericScripting {
  constructor(sandboxBundleSrc) {
    this._ready = new Promise((resolve, reject) => {
      const sandbox = import(/*webpackIgnore: true*/sandboxBundleSrc);
      sandbox.then(pdfjsSandbox => {
        resolve(pdfjsSandbox.QuickJSSandbox());
      }).catch(reject);
    });
  }
  async createSandbox(data) {
    const sandbox = await this._ready;
    sandbox.create(data);
  }
  async dispatchEventInSandbox(event) {
    const sandbox = await this._ready;
    setTimeout(() => sandbox.dispatchEvent(event), 0);
  }
  async destroySandbox() {
    const sandbox = await this._ready;
    sandbox.nukeSandbox();
  }
}

;// ./web/genericcom.js





function initCom(app) {}
class Preferences extends BasePreferences {
  async _writeToStorage(prefObj) {
    localStorage.setItem("pdfjs.preferences", JSON.stringify(prefObj));
  }
  async _readFromStorage(prefObj) {
    return {
      prefs: JSON.parse(localStorage.getItem("pdfjs.preferences"))
    };
  }
}
class ExternalServices extends BaseExternalServices {
  async createL10n() {
    return new genericl10n_GenericL10n(AppOptions.get("localeProperties")?.lang);
  }
  createScripting() {
    return new GenericScripting(AppOptions.get("sandboxBundleSrc"));
  }
}
class MLManager {
  async isEnabledFor(_name) {
    return false;
  }
  async deleteModel(_service) {
    return null;
  }
  isReady(_name) {
    return false;
  }
  guess(_data) {}
  toggleService(_name, _enabled) {}
  static getFakeMLManager(options) {
    return new FakeMLManager(options);
  }
}
class FakeMLManager {
  eventBus = null;
  hasProgress = false;
  constructor({
    enableGuessAltText,
    enableAltTextModelDownload
  }) {
    this.enableGuessAltText = enableGuessAltText;
    this.enableAltTextModelDownload = enableAltTextModelDownload;
  }
  setEventBus(eventBus, abortSignal) {
    this.eventBus = eventBus;
  }
  async isEnabledFor(_name) {
    return this.enableGuessAltText;
  }
  async deleteModel(_name) {
    this.enableAltTextModelDownload = false;
    return null;
  }
  async loadModel(_name) {}
  async downloadModel(_name) {
    this.hasProgress = true;
    const {
      promise,
      resolve
    } = Promise.withResolvers();
    const total = 1e8;
    const end = 1.5 * total;
    const increment = 5e6;
    let loaded = 0;
    const id = setInterval(() => {
      loaded += increment;
      if (loaded <= end) {
        this.eventBus.dispatch("loadaiengineprogress", {
          source: this,
          detail: {
            total,
            totalLoaded: loaded,
            finished: loaded + increment >= end
          }
        });
        return;
      }
      clearInterval(id);
      this.hasProgress = false;
      this.enableAltTextModelDownload = true;
      resolve(true);
    }, 900);
    return promise;
  }
  isReady(_name) {
    return this.enableAltTextModelDownload;
  }
  guess({
    request: {
      data
    }
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data ? {
          output: "Fake alt text"
        } : {
          error: true
        });
      }, 3000);
    });
  }
  toggleService(_name, enabled) {
    this.enableGuessAltText = enabled;
  }
}

;// ./web/new_alt_text_manager.js

class NewAltTextManager {
  #boundCancel = this.#cancel.bind(this);
  #createAutomaticallyButton;
  #currentEditor = null;
  #cancelButton;
  #descriptionContainer;
  #dialog;
  #disclaimer;
  #downloadModel;
  #downloadModelDescription;
  #eventBus;
  #firstTime = false;
  #guessedAltText;
  #hasAI = null;
  #isEditing = null;
  #imagePreview;
  #imageData;
  #isAILoading = false;
  #wasAILoading = false;
  #learnMore;
  #notNowButton;
  #overlayManager;
  #textarea;
  #title;
  #uiManager;
  #previousAltText = null;
  constructor({
    descriptionContainer,
    dialog,
    imagePreview,
    cancelButton,
    disclaimer,
    notNowButton,
    saveButton,
    textarea,
    learnMore,
    errorCloseButton,
    createAutomaticallyButton,
    downloadModel,
    downloadModelDescription,
    title
  }, overlayManager, eventBus) {
    this.#cancelButton = cancelButton;
    this.#createAutomaticallyButton = createAutomaticallyButton;
    this.#descriptionContainer = descriptionContainer;
    this.#dialog = dialog;
    this.#disclaimer = disclaimer;
    this.#notNowButton = notNowButton;
    this.#imagePreview = imagePreview;
    this.#textarea = textarea;
    this.#learnMore = learnMore;
    this.#title = title;
    this.#downloadModel = downloadModel;
    this.#downloadModelDescription = downloadModelDescription;
    this.#overlayManager = overlayManager;
    this.#eventBus = eventBus;
    dialog.addEventListener("close", this.#close.bind(this));
    dialog.addEventListener("contextmenu", event => {
      if (event.target !== this.#textarea) {
        event.preventDefault();
      }
    });
    cancelButton.addEventListener("click", this.#boundCancel);
    notNowButton.addEventListener("click", this.#boundCancel);
    saveButton.addEventListener("click", this.#save.bind(this));
    errorCloseButton.addEventListener("click", () => {
      this.#toggleError(false);
    });
    createAutomaticallyButton.addEventListener("click", async () => {
      const checked = createAutomaticallyButton.getAttribute("aria-pressed") !== "true";
      this.#currentEditor._reportTelemetry({
        action: "pdfjs.image.alt_text.ai_generation_check",
        data: {
          status: checked
        }
      });
      if (this.#uiManager) {
        this.#uiManager.setPreference("enableGuessAltText", checked);
        await this.#uiManager.mlManager.toggleService("altText", checked);
      }
      this.#toggleGuessAltText(checked, false);
    });
    textarea.addEventListener("focus", () => {
      this.#wasAILoading = this.#isAILoading;
      this.#toggleLoading(false);
      this.#toggleTitleAndDisclaimer();
    });
    textarea.addEventListener("blur", () => {
      if (!textarea.value) {
        this.#toggleLoading(this.#wasAILoading);
      }
      this.#toggleTitleAndDisclaimer();
    });
    textarea.addEventListener("input", () => {
      this.#toggleTitleAndDisclaimer();
    });
    eventBus._on("enableguessalttext", ({
      value
    }) => {
      this.#toggleGuessAltText(value, false);
    });
    this.#overlayManager.register(dialog);
    this.#learnMore.addEventListener("click", () => {
      this.#currentEditor._reportTelemetry({
        action: "pdfjs.image.alt_text.info",
        data: {
          topic: "alt_text"
        }
      });
    });
  }
  #toggleLoading(value) {
    if (!this.#uiManager || this.#isAILoading === value) {
      return;
    }
    this.#isAILoading = value;
    this.#descriptionContainer.classList.toggle("loading", value);
  }
  #toggleError(value) {
    if (!this.#uiManager) {
      return;
    }
    this.#dialog.classList.toggle("error", value);
  }
  async #toggleGuessAltText(value, isInitial = false) {
    if (!this.#uiManager) {
      return;
    }
    this.#dialog.classList.toggle("aiDisabled", !value);
    this.#createAutomaticallyButton.setAttribute("aria-pressed", value);
    if (value) {
      const {
        altTextLearnMoreUrl
      } = this.#uiManager.mlManager;
      if (altTextLearnMoreUrl) {
        this.#learnMore.href = altTextLearnMoreUrl;
      }
      this.#mlGuessAltText(isInitial);
    } else {
      this.#toggleLoading(false);
      this.#isAILoading = false;
      this.#toggleTitleAndDisclaimer();
    }
  }
  #toggleNotNow() {
    this.#notNowButton.classList.toggle("hidden", !this.#firstTime);
    this.#cancelButton.classList.toggle("hidden", this.#firstTime);
  }
  #toggleAI(value) {
    if (!this.#uiManager || this.#hasAI === value) {
      return;
    }
    this.#hasAI = value;
    this.#dialog.classList.toggle("noAi", !value);
    this.#toggleTitleAndDisclaimer();
  }
  #toggleTitleAndDisclaimer() {
    const visible = this.#isAILoading || this.#guessedAltText && this.#guessedAltText === this.#textarea.value;
    this.#disclaimer.hidden = !visible;
    const isEditing = this.#isAILoading || !!this.#textarea.value;
    if (this.#isEditing === isEditing) {
      return;
    }
    this.#isEditing = isEditing;
    this.#title.setAttribute("data-l10n-id", isEditing ? "pdfjs-editor-new-alt-text-dialog-edit-label" : "pdfjs-editor-new-alt-text-dialog-add-label");
  }
  async #mlGuessAltText(isInitial) {
    if (this.#isAILoading) {
      return;
    }
    if (this.#textarea.value) {
      return;
    }
    if (isInitial && this.#previousAltText !== null) {
      return;
    }
    this.#guessedAltText = this.#currentEditor.guessedAltText;
    if (this.#previousAltText === null && this.#guessedAltText) {
      this.#addAltText(this.#guessedAltText);
      return;
    }
    this.#toggleLoading(true);
    this.#toggleTitleAndDisclaimer();
    let hasError = false;
    try {
      const altText = await this.#currentEditor.mlGuessAltText(this.#imageData, false);
      if (altText) {
        this.#guessedAltText = altText;
        this.#wasAILoading = this.#isAILoading;
        if (this.#isAILoading) {
          this.#addAltText(altText);
        }
      }
    } catch (e) {
      console.error(e);
      hasError = true;
    }
    this.#toggleLoading(false);
    this.#toggleTitleAndDisclaimer();
    if (hasError && this.#uiManager) {
      this.#toggleError(true);
    }
  }
  #addAltText(altText) {
    if (!this.#uiManager || this.#textarea.value) {
      return;
    }
    this.#textarea.value = altText;
    this.#toggleTitleAndDisclaimer();
  }
  #setProgress() {
    this.#downloadModel.classList.toggle("hidden", false);
    const callback = async ({
      detail: {
        finished,
        total,
        totalLoaded
      }
    }) => {
      const ONE_MEGA_BYTES = 1e6;
      totalLoaded = Math.min(0.99 * total, totalLoaded);
      const totalSize = this.#downloadModelDescription.ariaValueMax = Math.round(total / ONE_MEGA_BYTES);
      const downloadedSize = this.#downloadModelDescription.ariaValueNow = Math.round(totalLoaded / ONE_MEGA_BYTES);
      this.#downloadModelDescription.setAttribute("data-l10n-args", JSON.stringify({
        totalSize,
        downloadedSize
      }));
      if (!finished) {
        return;
      }
      this.#eventBus._off("loadaiengineprogress", callback);
      this.#downloadModel.classList.toggle("hidden", true);
      this.#toggleAI(true);
      if (!this.#uiManager) {
        return;
      }
      const {
        mlManager
      } = this.#uiManager;
      mlManager.toggleService("altText", true);
      this.#toggleGuessAltText(await mlManager.isEnabledFor("altText"), true);
    };
    this.#eventBus._on("loadaiengineprogress", callback);
  }
  async editAltText(uiManager, editor, firstTime) {
    if (this.#currentEditor || !editor) {
      return;
    }
    if (firstTime && editor.hasAltTextData()) {
      editor.altTextFinish();
      return;
    }
    this.#firstTime = firstTime;
    let {
      mlManager
    } = uiManager;
    let hasAI = !!mlManager;
    this.#toggleTitleAndDisclaimer();
    if (mlManager && !mlManager.isReady("altText")) {
      hasAI = false;
      if (mlManager.hasProgress) {
        this.#setProgress();
      } else {
        mlManager = null;
      }
    } else {
      this.#downloadModel.classList.toggle("hidden", true);
    }
    const isAltTextEnabledPromise = mlManager?.isEnabledFor("altText");
    this.#currentEditor = editor;
    this.#uiManager = uiManager;
    this.#uiManager.removeEditListeners();
    ({
      altText: this.#previousAltText
    } = editor.altTextData);
    this.#textarea.value = this.#previousAltText ?? "";
    const AI_MAX_IMAGE_DIMENSION = 224;
    const MAX_PREVIEW_DIMENSION = 180;
    let canvas, width, height;
    if (mlManager) {
      ({
        canvas,
        width,
        height,
        imageData: this.#imageData
      } = editor.copyCanvas(AI_MAX_IMAGE_DIMENSION, MAX_PREVIEW_DIMENSION, true));
      if (hasAI) {
        this.#toggleGuessAltText(await isAltTextEnabledPromise, true);
      }
    } else {
      ({
        canvas,
        width,
        height
      } = editor.copyCanvas(AI_MAX_IMAGE_DIMENSION, MAX_PREVIEW_DIMENSION, false));
    }
    canvas.setAttribute("role", "presentation");
    const {
      style
    } = canvas;
    style.width = `${width}px`;
    style.height = `${height}px`;
    this.#imagePreview.append(canvas);
    this.#toggleNotNow();
    this.#toggleAI(hasAI);
    this.#toggleError(false);
    try {
      await this.#overlayManager.open(this.#dialog);
    } catch (ex) {
      this.#close();
      throw ex;
    }
  }
  #cancel() {
    this.#currentEditor.altTextData = {
      cancel: true
    };
    const altText = this.#textarea.value.trim();
    this.#currentEditor._reportTelemetry({
      action: "pdfjs.image.alt_text.dismiss",
      data: {
        alt_text_type: altText ? "present" : "empty",
        flow: this.#firstTime ? "image_add" : "alt_text_edit"
      }
    });
    this.#currentEditor._reportTelemetry({
      action: "pdfjs.image.image_added",
      data: {
        alt_text_modal: true,
        alt_text_type: "skipped"
      }
    });
    this.#finish();
  }
  #finish() {
    if (this.#overlayManager.active === this.#dialog) {
      this.#overlayManager.close(this.#dialog);
    }
  }
  #close() {
    const canvas = this.#imagePreview.firstChild;
    canvas.remove();
    canvas.width = canvas.height = 0;
    this.#imageData = null;
    this.#toggleLoading(false);
    this.#uiManager?.addEditListeners();
    this.#currentEditor.altTextFinish();
    this.#uiManager?.setSelected(this.#currentEditor);
    this.#currentEditor = null;
    this.#uiManager = null;
  }
  #save() {
    const altText = this.#textarea.value.trim();
    this.#currentEditor.altTextData = {
      altText,
      decorative: false
    };
    this.#currentEditor.altTextData.guessedAltText = this.#guessedAltText;
    if (this.#guessedAltText && this.#guessedAltText !== altText) {
      const guessedWords = new Set(this.#guessedAltText.split(/\s+/));
      const words = new Set(altText.split(/\s+/));
      this.#currentEditor._reportTelemetry({
        action: "pdfjs.image.alt_text.user_edit",
        data: {
          total_words: guessedWords.size,
          words_removed: guessedWords.difference(words).size,
          words_added: words.difference(guessedWords).size
        }
      });
    }
    this.#currentEditor._reportTelemetry({
      action: "pdfjs.image.image_added",
      data: {
        alt_text_modal: true,
        alt_text_type: altText ? "present" : "empty"
      }
    });
    this.#currentEditor._reportTelemetry({
      action: "pdfjs.image.alt_text.save",
      data: {
        alt_text_type: altText ? "present" : "empty",
        flow: this.#firstTime ? "image_add" : "alt_text_edit"
      }
    });
    this.#finish();
  }
  destroy() {
    this.#uiManager = null;
    this.#finish();
  }
}
class ImageAltTextSettings {
  #aiModelSettings;
  #createModelButton;
  #downloadModelButton;
  #dialog;
  #eventBus;
  #mlManager;
  #overlayManager;
  #showAltTextDialogButton;
  constructor({
    dialog,
    createModelButton,
    aiModelSettings,
    learnMore,
    closeButton,
    deleteModelButton,
    downloadModelButton,
    showAltTextDialogButton
  }, overlayManager, eventBus, mlManager) {
    this.#dialog = dialog;
    this.#aiModelSettings = aiModelSettings;
    this.#createModelButton = createModelButton;
    this.#downloadModelButton = downloadModelButton;
    this.#showAltTextDialogButton = showAltTextDialogButton;
    this.#overlayManager = overlayManager;
    this.#eventBus = eventBus;
    this.#mlManager = mlManager;
    const {
      altTextLearnMoreUrl
    } = mlManager;
    if (altTextLearnMoreUrl) {
      learnMore.href = altTextLearnMoreUrl;
    }
    dialog.addEventListener("contextmenu", noContextMenu);
    createModelButton.addEventListener("click", async e => {
      const checked = this.#togglePref("enableGuessAltText", e);
      await mlManager.toggleService("altText", checked);
      this.#reportTelemetry({
        type: "stamp",
        action: "pdfjs.image.alt_text.settings_ai_generation_check",
        data: {
          status: checked
        }
      });
    });
    showAltTextDialogButton.addEventListener("click", e => {
      const checked = this.#togglePref("enableNewAltTextWhenAddingImage", e);
      this.#reportTelemetry({
        type: "stamp",
        action: "pdfjs.image.alt_text.settings_edit_alt_text_check",
        data: {
          status: checked
        }
      });
    });
    deleteModelButton.addEventListener("click", this.#delete.bind(this, true));
    downloadModelButton.addEventListener("click", this.#download.bind(this, true));
    closeButton.addEventListener("click", this.#finish.bind(this));
    learnMore.addEventListener("click", () => {
      this.#reportTelemetry({
        type: "stamp",
        action: "pdfjs.image.alt_text.info",
        data: {
          topic: "ai_generation"
        }
      });
    });
    eventBus._on("enablealttextmodeldownload", ({
      value
    }) => {
      if (value) {
        this.#download(false);
      } else {
        this.#delete(false);
      }
    });
    this.#overlayManager.register(dialog);
  }
  #reportTelemetry(data) {
    this.#eventBus.dispatch("reporttelemetry", {
      source: this,
      details: {
        type: "editing",
        data
      }
    });
  }
  async #download(isFromUI = false) {
    if (isFromUI) {
      this.#downloadModelButton.disabled = true;
      const span = this.#downloadModelButton.firstChild;
      span.setAttribute("data-l10n-id", "pdfjs-editor-alt-text-settings-downloading-model-button");
      await this.#mlManager.downloadModel("altText");
      span.setAttribute("data-l10n-id", "pdfjs-editor-alt-text-settings-download-model-button");
      this.#createModelButton.disabled = false;
      this.#setPref("enableGuessAltText", true);
      this.#mlManager.toggleService("altText", true);
      this.#setPref("enableAltTextModelDownload", true);
      this.#downloadModelButton.disabled = false;
    }
    this.#aiModelSettings.classList.toggle("download", false);
    this.#createModelButton.setAttribute("aria-pressed", true);
  }
  async #delete(isFromUI = false) {
    if (isFromUI) {
      await this.#mlManager.deleteModel("altText");
      this.#setPref("enableGuessAltText", false);
      this.#setPref("enableAltTextModelDownload", false);
    }
    this.#aiModelSettings.classList.toggle("download", true);
    this.#createModelButton.disabled = true;
    this.#createModelButton.setAttribute("aria-pressed", false);
  }
  async open({
    enableGuessAltText,
    enableNewAltTextWhenAddingImage
  }) {
    const {
      enableAltTextModelDownload
    } = this.#mlManager;
    this.#createModelButton.disabled = !enableAltTextModelDownload;
    this.#createModelButton.setAttribute("aria-pressed", enableAltTextModelDownload && enableGuessAltText);
    this.#showAltTextDialogButton.setAttribute("aria-pressed", enableNewAltTextWhenAddingImage);
    this.#aiModelSettings.classList.toggle("download", !enableAltTextModelDownload);
    await this.#overlayManager.open(this.#dialog);
    this.#reportTelemetry({
      type: "stamp",
      action: "pdfjs.image.alt_text.settings_displayed"
    });
  }
  #togglePref(name, {
    target
  }) {
    const checked = target.getAttribute("aria-pressed") !== "true";
    this.#setPref(name, checked);
    target.setAttribute("aria-pressed", checked);
    return checked;
  }
  #setPref(name, value) {
    this.#eventBus.dispatch("setpreference", {
      source: this,
      name,
      value
    });
  }
  #finish() {
    if (this.#overlayManager.active === this.#dialog) {
      this.#overlayManager.close(this.#dialog);
    }
  }
}

;// ./web/alt_text_manager.js

class AltTextManager {
  #clickAC = null;
  #currentEditor = null;
  #cancelButton;
  #dialog;
  #eventBus;
  #hasUsedPointer = false;
  #optionDescription;
  #optionDecorative;
  #overlayManager;
  #saveButton;
  #textarea;
  #uiManager;
  #previousAltText = null;
  #resizeAC = null;
  #svgElement = null;
  #rectElement = null;
  #container;
  #telemetryData = null;
  constructor({
    dialog,
    optionDescription,
    optionDecorative,
    textarea,
    cancelButton,
    saveButton
  }, container, overlayManager, eventBus) {
    this.#dialog = dialog;
    this.#optionDescription = optionDescription;
    this.#optionDecorative = optionDecorative;
    this.#textarea = textarea;
    this.#cancelButton = cancelButton;
    this.#saveButton = saveButton;
    this.#overlayManager = overlayManager;
    this.#eventBus = eventBus;
    this.#container = container;
    const onUpdateUIState = this.#updateUIState.bind(this);
    dialog.addEventListener("close", this.#close.bind(this));
    dialog.addEventListener("contextmenu", event => {
      if (event.target !== this.#textarea) {
        event.preventDefault();
      }
    });
    cancelButton.addEventListener("click", this.#finish.bind(this));
    saveButton.addEventListener("click", this.#save.bind(this));
    optionDescription.addEventListener("change", onUpdateUIState);
    optionDecorative.addEventListener("change", onUpdateUIState);
    this.#overlayManager.register(dialog);
  }
  #createSVGElement() {
    if (this.#svgElement) {
      return;
    }
    const svgFactory = new DOMSVGFactory();
    const svg = this.#svgElement = svgFactory.createElement("svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    const defs = svgFactory.createElement("defs");
    svg.append(defs);
    const mask = svgFactory.createElement("mask");
    defs.append(mask);
    mask.setAttribute("id", "alttext-manager-mask");
    mask.setAttribute("maskContentUnits", "objectBoundingBox");
    let rect = svgFactory.createElement("rect");
    mask.append(rect);
    rect.setAttribute("fill", "white");
    rect.setAttribute("width", "1");
    rect.setAttribute("height", "1");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect = this.#rectElement = svgFactory.createElement("rect");
    mask.append(rect);
    rect.setAttribute("fill", "black");
    this.#dialog.append(svg);
  }
  async editAltText(uiManager, editor) {
    if (this.#currentEditor || !editor) {
      return;
    }
    this.#createSVGElement();
    this.#hasUsedPointer = false;
    this.#clickAC = new AbortController();
    const clickOpts = {
        signal: this.#clickAC.signal
      },
      onClick = this.#onClick.bind(this);
    for (const element of [this.#optionDescription, this.#optionDecorative, this.#textarea, this.#saveButton, this.#cancelButton]) {
      element.addEventListener("click", onClick, clickOpts);
    }
    const {
      altText,
      decorative
    } = editor.altTextData;
    if (decorative === true) {
      this.#optionDecorative.checked = true;
      this.#optionDescription.checked = false;
    } else {
      this.#optionDecorative.checked = false;
      this.#optionDescription.checked = true;
    }
    this.#previousAltText = this.#textarea.value = altText?.trim() || "";
    this.#updateUIState();
    this.#currentEditor = editor;
    this.#uiManager = uiManager;
    this.#uiManager.removeEditListeners();
    this.#resizeAC = new AbortController();
    this.#eventBus._on("resize", this.#setPosition.bind(this), {
      signal: this.#resizeAC.signal
    });
    try {
      await this.#overlayManager.open(this.#dialog);
      this.#setPosition();
    } catch (ex) {
      this.#close();
      throw ex;
    }
  }
  #setPosition() {
    if (!this.#currentEditor) {
      return;
    }
    const dialog = this.#dialog;
    const {
      style
    } = dialog;
    const {
      x: containerX,
      y: containerY,
      width: containerW,
      height: containerH
    } = this.#container.getBoundingClientRect();
    const {
      innerWidth: windowW,
      innerHeight: windowH
    } = window;
    const {
      width: dialogW,
      height: dialogH
    } = dialog.getBoundingClientRect();
    const {
      x,
      y,
      width,
      height
    } = this.#currentEditor.getClientDimensions();
    const MARGIN = 10;
    const isLTR = this.#uiManager.direction === "ltr";
    const xs = Math.max(x, containerX);
    const xe = Math.min(x + width, containerX + containerW);
    const ys = Math.max(y, containerY);
    const ye = Math.min(y + height, containerY + containerH);
    this.#rectElement.setAttribute("width", `${(xe - xs) / windowW}`);
    this.#rectElement.setAttribute("height", `${(ye - ys) / windowH}`);
    this.#rectElement.setAttribute("x", `${xs / windowW}`);
    this.#rectElement.setAttribute("y", `${ys / windowH}`);
    let left = null;
    let top = Math.max(y, 0);
    top += Math.min(windowH - (top + dialogH), 0);
    if (isLTR) {
      if (x + width + MARGIN + dialogW < windowW) {
        left = x + width + MARGIN;
      } else if (x > dialogW + MARGIN) {
        left = x - dialogW - MARGIN;
      }
    } else if (x > dialogW + MARGIN) {
      left = x - dialogW - MARGIN;
    } else if (x + width + MARGIN + dialogW < windowW) {
      left = x + width + MARGIN;
    }
    if (left === null) {
      top = null;
      left = Math.max(x, 0);
      left += Math.min(windowW - (left + dialogW), 0);
      if (y > dialogH + MARGIN) {
        top = y - dialogH - MARGIN;
      } else if (y + height + MARGIN + dialogH < windowH) {
        top = y + height + MARGIN;
      }
    }
    if (top !== null) {
      dialog.classList.add("positioned");
      if (isLTR) {
        style.left = `${left}px`;
      } else {
        style.right = `${windowW - left - dialogW}px`;
      }
      style.top = `${top}px`;
    } else {
      dialog.classList.remove("positioned");
      style.left = "";
      style.top = "";
    }
  }
  #finish() {
    if (this.#overlayManager.active === this.#dialog) {
      this.#overlayManager.close(this.#dialog);
    }
  }
  #close() {
    this.#currentEditor._reportTelemetry(this.#telemetryData || {
      action: "alt_text_cancel",
      alt_text_keyboard: !this.#hasUsedPointer
    });
    this.#telemetryData = null;
    this.#removeOnClickListeners();
    this.#uiManager?.addEditListeners();
    this.#resizeAC?.abort();
    this.#resizeAC = null;
    this.#currentEditor.altTextFinish();
    this.#currentEditor = null;
    this.#uiManager = null;
  }
  #updateUIState() {
    this.#textarea.disabled = this.#optionDecorative.checked;
  }
  #save() {
    const altText = this.#textarea.value.trim();
    const decorative = this.#optionDecorative.checked;
    this.#currentEditor.altTextData = {
      altText,
      decorative
    };
    this.#telemetryData = {
      action: "alt_text_save",
      alt_text_description: !!altText,
      alt_text_edit: !!this.#previousAltText && this.#previousAltText !== altText,
      alt_text_decorative: decorative,
      alt_text_keyboard: !this.#hasUsedPointer
    };
    this.#finish();
  }
  #onClick(evt) {
    if (evt.detail === 0) {
      return;
    }
    this.#hasUsedPointer = true;
    this.#removeOnClickListeners();
  }
  #removeOnClickListeners() {
    this.#clickAC?.abort();
    this.#clickAC = null;
  }
  destroy() {
    this.#uiManager = null;
    this.#finish();
    this.#svgElement?.remove();
    this.#svgElement = this.#rectElement = null;
  }
}

;// ./web/annotation_editor_params.js

class AnnotationEditorParams {
  constructor(options, eventBus) {
    this.eventBus = eventBus;
    this.#bindListeners(options);
  }
  #bindListeners({
    editorFreeTextFontSize,
    editorFreeTextColor,
    editorInkColor,
    editorInkThickness,
    editorInkOpacity,
    editorStampAddImage,
    editorFreeHighlightThickness,
    editorHighlightShowAll
  }) {
    const dispatchEvent = (typeStr, value) => {
      this.eventBus.dispatch("switchannotationeditorparams", {
        source: this,
        type: AnnotationEditorParamsType[typeStr],
        value
      });
    };
    editorFreeTextFontSize.addEventListener("input", function () {
      dispatchEvent("FREETEXT_SIZE", this.valueAsNumber);
    });
    editorFreeTextColor.addEventListener("input", function () {
      dispatchEvent("FREETEXT_COLOR", this.value);
    });
    editorInkColor.addEventListener("input", function () {
      dispatchEvent("INK_COLOR", this.value);
    });
    editorInkThickness.addEventListener("input", function () {
      dispatchEvent("INK_THICKNESS", this.valueAsNumber);
    });
    editorInkOpacity.addEventListener("input", function () {
      dispatchEvent("INK_OPACITY", this.valueAsNumber);
    });
    editorStampAddImage.addEventListener("click", () => {
      this.eventBus.dispatch("reporttelemetry", {
        source: this,
        details: {
          type: "editing",
          data: {
            action: "pdfjs.image.add_image_click"
          }
        }
      });
      dispatchEvent("CREATE");
    });
    editorFreeHighlightThickness.addEventListener("input", function () {
      dispatchEvent("HIGHLIGHT_THICKNESS", this.valueAsNumber);
    });
    editorHighlightShowAll.addEventListener("click", function () {
      const checked = this.getAttribute("aria-pressed") === "true";
      this.setAttribute("aria-pressed", !checked);
      dispatchEvent("HIGHLIGHT_SHOW_ALL", !checked);
    });
    this.eventBus._on("annotationeditorparamschanged", evt => {
      for (const [type, value] of evt.details) {
        switch (type) {
          case AnnotationEditorParamsType.FREETEXT_SIZE:
            editorFreeTextFontSize.value = value;
            break;
          case AnnotationEditorParamsType.FREETEXT_COLOR:
            editorFreeTextColor.value = value;
            break;
          case AnnotationEditorParamsType.INK_COLOR:
            editorInkColor.value = value;
            break;
          case AnnotationEditorParamsType.INK_THICKNESS:
            editorInkThickness.value = value;
            break;
          case AnnotationEditorParamsType.INK_OPACITY:
            editorInkOpacity.value = value;
            break;
          case AnnotationEditorParamsType.HIGHLIGHT_THICKNESS:
            editorFreeHighlightThickness.value = value;
            break;
          case AnnotationEditorParamsType.HIGHLIGHT_FREE:
            editorFreeHighlightThickness.disabled = !value;
            break;
          case AnnotationEditorParamsType.HIGHLIGHT_SHOW_ALL:
            editorHighlightShowAll.setAttribute("aria-pressed", value);
            break;
        }
      }
    });
  }
}

;// ./web/caret_browsing.js
const PRECISION = 1e-1;
class CaretBrowsingMode {
  #mainContainer;
  #toolBarHeight = 0;
  #viewerContainer;
  constructor(abortSignal, mainContainer, viewerContainer, toolbarContainer) {
    this.#mainContainer = mainContainer;
    this.#viewerContainer = viewerContainer;
    if (!toolbarContainer) {
      return;
    }
    this.#toolBarHeight = toolbarContainer.getBoundingClientRect().height;
    const toolbarObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === toolbarContainer) {
          this.#toolBarHeight = Math.floor(entry.borderBoxSize[0].blockSize);
          break;
        }
      }
    });
    toolbarObserver.observe(toolbarContainer);
    abortSignal.addEventListener("abort", () => toolbarObserver.disconnect(), {
      once: true
    });
  }
  #isOnSameLine(rect1, rect2) {
    const top1 = rect1.y;
    const bot1 = rect1.bottom;
    const mid1 = rect1.y + rect1.height / 2;
    const top2 = rect2.y;
    const bot2 = rect2.bottom;
    const mid2 = rect2.y + rect2.height / 2;
    return top1 <= mid2 && mid2 <= bot1 || top2 <= mid1 && mid1 <= bot2;
  }
  #isUnderOver(rect, x, y, isUp) {
    const midY = rect.y + rect.height / 2;
    return (isUp ? y >= midY : y <= midY) && rect.x - PRECISION <= x && x <= rect.right + PRECISION;
  }
  #isVisible(rect) {
    return rect.top >= this.#toolBarHeight && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  #getCaretPosition(selection, isUp) {
    const {
      focusNode,
      focusOffset
    } = selection;
    const range = document.createRange();
    range.setStart(focusNode, focusOffset);
    range.setEnd(focusNode, focusOffset);
    const rect = range.getBoundingClientRect();
    return [rect.x, isUp ? rect.top : rect.bottom];
  }
  static #caretPositionFromPoint(x, y) {
    if (!document.caretPositionFromPoint) {
      const {
        startContainer: offsetNode,
        startOffset: offset
      } = document.caretRangeFromPoint(x, y);
      return {
        offsetNode,
        offset
      };
    }
    return document.caretPositionFromPoint(x, y);
  }
  #setCaretPositionHelper(selection, caretX, select, element, rect) {
    rect ||= element.getBoundingClientRect();
    if (caretX <= rect.x + PRECISION) {
      if (select) {
        selection.extend(element.firstChild, 0);
      } else {
        selection.setPosition(element.firstChild, 0);
      }
      return;
    }
    if (rect.right - PRECISION <= caretX) {
      const {
        lastChild
      } = element;
      if (select) {
        selection.extend(lastChild, lastChild.length);
      } else {
        selection.setPosition(lastChild, lastChild.length);
      }
      return;
    }
    const midY = rect.y + rect.height / 2;
    let caretPosition = CaretBrowsingMode.#caretPositionFromPoint(caretX, midY);
    let parentElement = caretPosition.offsetNode?.parentElement;
    if (parentElement && parentElement !== element) {
      const elementsAtPoint = document.elementsFromPoint(caretX, midY);
      const savedVisibilities = [];
      for (const el of elementsAtPoint) {
        if (el === element) {
          break;
        }
        const {
          style
        } = el;
        savedVisibilities.push([el, style.visibility]);
        style.visibility = "hidden";
      }
      caretPosition = CaretBrowsingMode.#caretPositionFromPoint(caretX, midY);
      parentElement = caretPosition.offsetNode?.parentElement;
      for (const [el, visibility] of savedVisibilities) {
        el.style.visibility = visibility;
      }
    }
    if (parentElement !== element) {
      if (select) {
        selection.extend(element.firstChild, 0);
      } else {
        selection.setPosition(element.firstChild, 0);
      }
      return;
    }
    if (select) {
      selection.extend(caretPosition.offsetNode, caretPosition.offset);
    } else {
      selection.setPosition(caretPosition.offsetNode, caretPosition.offset);
    }
  }
  #setCaretPosition(select, selection, newLineElement, newLineElementRect, caretX) {
    if (this.#isVisible(newLineElementRect)) {
      this.#setCaretPositionHelper(selection, caretX, select, newLineElement, newLineElementRect);
      return;
    }
    this.#mainContainer.addEventListener("scrollend", this.#setCaretPositionHelper.bind(this, selection, caretX, select, newLineElement, null), {
      once: true
    });
    newLineElement.scrollIntoView();
  }
  #getNodeOnNextPage(textLayer, isUp) {
    while (true) {
      const page = textLayer.closest(".page");
      const pageNumber = parseInt(page.getAttribute("data-page-number"));
      const nextPage = isUp ? pageNumber - 1 : pageNumber + 1;
      textLayer = this.#viewerContainer.querySelector(`.page[data-page-number="${nextPage}"] .textLayer`);
      if (!textLayer) {
        return null;
      }
      const walker = document.createTreeWalker(textLayer, NodeFilter.SHOW_TEXT);
      const node = isUp ? walker.lastChild() : walker.firstChild();
      if (node) {
        return node;
      }
    }
  }
  moveCaret(isUp, select) {
    const selection = document.getSelection();
    if (selection.rangeCount === 0) {
      return;
    }
    const {
      focusNode
    } = selection;
    const focusElement = focusNode.nodeType !== Node.ELEMENT_NODE ? focusNode.parentElement : focusNode;
    const root = focusElement.closest(".textLayer");
    if (!root) {
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    walker.currentNode = focusNode;
    const focusRect = focusElement.getBoundingClientRect();
    let newLineElement = null;
    const nodeIterator = (isUp ? walker.previousSibling : walker.nextSibling).bind(walker);
    while (nodeIterator()) {
      const element = walker.currentNode.parentElement;
      if (!this.#isOnSameLine(focusRect, element.getBoundingClientRect())) {
        newLineElement = element;
        break;
      }
    }
    if (!newLineElement) {
      const node = this.#getNodeOnNextPage(root, isUp);
      if (!node) {
        return;
      }
      if (select) {
        const lastNode = (isUp ? walker.firstChild() : walker.lastChild()) || focusNode;
        selection.extend(lastNode, isUp ? 0 : lastNode.length);
        const range = document.createRange();
        range.setStart(node, isUp ? node.length : 0);
        range.setEnd(node, isUp ? node.length : 0);
        selection.addRange(range);
        return;
      }
      const [caretX] = this.#getCaretPosition(selection, isUp);
      const {
        parentElement
      } = node;
      this.#setCaretPosition(select, selection, parentElement, parentElement.getBoundingClientRect(), caretX);
      return;
    }
    const [caretX, caretY] = this.#getCaretPosition(selection, isUp);
    const newLineElementRect = newLineElement.getBoundingClientRect();
    if (this.#isUnderOver(newLineElementRect, caretX, caretY, isUp)) {
      this.#setCaretPosition(select, selection, newLineElement, newLineElementRect, caretX);
      return;
    }
    while (nodeIterator()) {
      const element = walker.currentNode.parentElement;
      const elementRect = element.getBoundingClientRect();
      if (!this.#isOnSameLine(newLineElementRect, elementRect)) {
        break;
      }
      if (this.#isUnderOver(elementRect, caretX, caretY, isUp)) {
        this.#setCaretPosition(select, selection, element, elementRect, caretX);
        return;
      }
    }
    this.#setCaretPosition(select, selection, newLineElement, newLineElementRect, caretX);
  }
}

;// ./web/download_manager.js

function download(blobUrl, filename) {
  const a = document.createElement("a");
  if (!a.click) {
    throw new Error('DownloadManager: "a.click()" is not supported.');
  }
  a.href = blobUrl;
  a.target = "_parent";
  if ("download" in a) {
    a.download = filename;
  }
  (document.body || document.documentElement).append(a);
  a.click();
  a.remove();
}
class DownloadManager {
  #openBlobUrls = new WeakMap();
  downloadData(data, filename, contentType) {
    const blobUrl = URL.createObjectURL(new Blob([data], {
      type: contentType
    }));
    download(blobUrl, filename);
  }
  openOrDownloadData(data, filename, dest = null) {
    const isPdfData = isPdfFile(filename);
    const contentType = isPdfData ? "application/pdf" : "";
    if (isPdfData) {
      let blobUrl = this.#openBlobUrls.get(data);
      if (!blobUrl) {
        blobUrl = URL.createObjectURL(new Blob([data], {
          type: contentType
        }));
        this.#openBlobUrls.set(data, blobUrl);
      }
      let viewerUrl;
      viewerUrl = "?file=" + encodeURIComponent(blobUrl + "#" + filename);
      if (dest) {
        viewerUrl += `#${escape(dest)}`;
      }
      try {
        window.open(viewerUrl);
        return true;
      } catch (ex) {
        console.error(`openOrDownloadData: ${ex}`);
        URL.revokeObjectURL(blobUrl);
        this.#openBlobUrls.delete(data);
      }
    }
    this.downloadData(data, filename, contentType);
    return false;
  }
  download(data, url, filename) {
    let blobUrl;
    if (data) {
      blobUrl = URL.createObjectURL(new Blob([data], {
        type: "application/pdf"
      }));
    } else {
      if (!createValidAbsoluteUrl(url, "http://example.com")) {
        console.error(`download - not a valid URL: ${url}`);
        return;
      }
      blobUrl = url + "#pdfjs.action=download";
    }
    download(blobUrl, filename);
  }
}

;// ./web/overlay_manager.js
class OverlayManager {
  #overlays = new WeakMap();
  #active = null;
  get active() {
    return this.#active;
  }
  async register(dialog, canForceClose = false) {
    if (typeof dialog !== "object") {
      throw new Error("Not enough parameters.");
    } else if (this.#overlays.has(dialog)) {
      throw new Error("The overlay is already registered.");
    }
    this.#overlays.set(dialog, {
      canForceClose
    });
    dialog.addEventListener("cancel", evt => {
      this.#active = null;
    });
  }
  async open(dialog) {
    if (!this.#overlays.has(dialog)) {
      throw new Error("The overlay does not exist.");
    } else if (this.#active) {
      if (this.#active === dialog) {
        throw new Error("The overlay is already active.");
      } else if (this.#overlays.get(dialog).canForceClose) {
        await this.close();
      } else {
        throw new Error("Another overlay is currently active.");
      }
    }
    this.#active = dialog;
    dialog.showModal();
  }
  async close(dialog = this.#active) {
    if (!this.#overlays.has(dialog)) {
      throw new Error("The overlay does not exist.");
    } else if (!this.#active) {
      throw new Error("The overlay is currently not active.");
    } else if (this.#active !== dialog) {
      throw new Error("Another overlay is currently active.");
    }
    dialog.close();
    this.#active = null;
  }
}

;// ./web/password_prompt.js

class PasswordPrompt {
  #activeCapability = null;
  #updateCallback = null;
  #reason = null;
  constructor(options, overlayManager, isViewerEmbedded = false) {
    this.dialog = options.dialog;
    this.label = options.label;
    this.input = options.input;
    this.submitButton = options.submitButton;
    this.cancelButton = options.cancelButton;
    this.overlayManager = overlayManager;
    this._isViewerEmbedded = isViewerEmbedded;
    this.submitButton.addEventListener("click", this.#verify.bind(this));
    this.cancelButton.addEventListener("click", this.close.bind(this));
    this.input.addEventListener("keydown", e => {
      if (e.keyCode === 13) {
        this.#verify();
      }
    });
    this.overlayManager.register(this.dialog, true);
    this.dialog.addEventListener("close", this.#cancel.bind(this));
  }
  async open() {
    await this.#activeCapability?.promise;
    this.#activeCapability = Promise.withResolvers();
    try {
      await this.overlayManager.open(this.dialog);
    } catch (ex) {
      this.#activeCapability.resolve();
      throw ex;
    }
    const passwordIncorrect = this.#reason === PasswordResponses.INCORRECT_PASSWORD;
    if (!this._isViewerEmbedded || passwordIncorrect) {
      this.input.focus();
    }
    this.label.setAttribute("data-l10n-id", passwordIncorrect ? "pdfjs-password-invalid" : "pdfjs-password-label");
  }
  async close() {
    if (this.overlayManager.active === this.dialog) {
      this.overlayManager.close(this.dialog);
    }
  }
  #verify() {
    const password = this.input.value;
    if (password?.length > 0) {
      this.#invokeCallback(password);
    }
  }
  #cancel() {
    this.#invokeCallback(new Error("PasswordPrompt cancelled."));
    this.#activeCapability.resolve();
  }
  #invokeCallback(password) {
    if (!this.#updateCallback) {
      return;
    }
    this.close();
    this.input.value = "";
    this.#updateCallback(password);
    this.#updateCallback = null;
  }
  async setUpdateCallback(updateCallback, reason) {
    if (this.#activeCapability) {
      await this.#activeCapability.promise;
    }
    this.#updateCallback = updateCallback;
    this.#reason = reason;
  }
}

;// ./web/base_tree_viewer.js

const TREEITEM_OFFSET_TOP = -100;
const TREEITEM_SELECTED_CLASS = "selected";
class BaseTreeViewer {
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this._l10n = options.l10n;
    this.reset();
  }
  reset() {
    this._pdfDocument = null;
    this._lastToggleIsShow = true;
    this._currentTreeItem = null;
    this.container.textContent = "";
    this.container.classList.remove("treeWithDeepNesting");
  }
  _dispatchEvent(count) {
    throw new Error("Not implemented: _dispatchEvent");
  }
  _bindLink(element, params) {
    throw new Error("Not implemented: _bindLink");
  }
  _normalizeTextContent(str) {
    return removeNullCharacters(str, true) || "\u2013";
  }
  _addToggleButton(div, hidden = false) {
    const toggler = document.createElement("div");
    toggler.className = "treeItemToggler";
    if (hidden) {
      toggler.classList.add("treeItemsHidden");
    }
    toggler.onclick = evt => {
      evt.stopPropagation();
      toggler.classList.toggle("treeItemsHidden");
      if (evt.shiftKey) {
        const shouldShowAll = !toggler.classList.contains("treeItemsHidden");
        this._toggleTreeItem(div, shouldShowAll);
      }
    };
    div.prepend(toggler);
  }
  _toggleTreeItem(root, show = false) {
    this._l10n.pause();
    this._lastToggleIsShow = show;
    for (const toggler of root.querySelectorAll(".treeItemToggler")) {
      toggler.classList.toggle("treeItemsHidden", !show);
    }
    this._l10n.resume();
  }
  _toggleAllTreeItems() {
    this._toggleTreeItem(this.container, !this._lastToggleIsShow);
  }
  _finishRendering(fragment, count, hasAnyNesting = false) {
    if (hasAnyNesting) {
      this.container.classList.add("treeWithDeepNesting");
      this._lastToggleIsShow = !fragment.querySelector(".treeItemsHidden");
    }
    this._l10n.pause();
    this.container.append(fragment);
    this._l10n.resume();
    this._dispatchEvent(count);
  }
  render(params) {
    throw new Error("Not implemented: render");
  }
  _updateCurrentTreeItem(treeItem = null) {
    if (this._currentTreeItem) {
      this._currentTreeItem.classList.remove(TREEITEM_SELECTED_CLASS);
      this._currentTreeItem = null;
    }
    if (treeItem) {
      treeItem.classList.add(TREEITEM_SELECTED_CLASS);
      this._currentTreeItem = treeItem;
    }
  }
  _scrollToCurrentTreeItem(treeItem) {
    if (!treeItem) {
      return;
    }
    this._l10n.pause();
    let currentNode = treeItem.parentNode;
    while (currentNode && currentNode !== this.container) {
      if (currentNode.classList.contains("treeItem")) {
        const toggler = currentNode.firstElementChild;
        toggler?.classList.remove("treeItemsHidden");
      }
      currentNode = currentNode.parentNode;
    }
    this._l10n.resume();
    this._updateCurrentTreeItem(treeItem);
    this.container.scrollTo(treeItem.offsetLeft, treeItem.offsetTop + TREEITEM_OFFSET_TOP);
  }
}

;// ./web/pdf_attachment_viewer.js


class PDFAttachmentViewer extends BaseTreeViewer {
  constructor(options) {
    super(options);
    this.downloadManager = options.downloadManager;
    this.eventBus._on("fileattachmentannotation", this.#appendAttachment.bind(this));
  }
  reset(keepRenderedCapability = false) {
    super.reset();
    this._attachments = null;
    if (!keepRenderedCapability) {
      this._renderedCapability = Promise.withResolvers();
    }
    this._pendingDispatchEvent = false;
  }
  async _dispatchEvent(attachmentsCount) {
    this._renderedCapability.resolve();
    if (attachmentsCount === 0 && !this._pendingDispatchEvent) {
      this._pendingDispatchEvent = true;
      await waitOnEventOrTimeout({
        target: this.eventBus,
        name: "annotationlayerrendered",
        delay: 1000
      });
      if (!this._pendingDispatchEvent) {
        return;
      }
    }
    this._pendingDispatchEvent = false;
    this.eventBus.dispatch("attachmentsloaded", {
      source: this,
      attachmentsCount
    });
  }
  _bindLink(element, {
    content,
    description,
    filename
  }) {
    if (description) {
      element.title = description;
    }
    element.onclick = () => {
      this.downloadManager.openOrDownloadData(content, filename);
      return false;
    };
  }
  render({
    attachments,
    keepRenderedCapability = false
  }) {
    if (this._attachments) {
      this.reset(keepRenderedCapability);
    }
    this._attachments = attachments || null;
    if (!attachments) {
      this._dispatchEvent(0);
      return;
    }
    const fragment = document.createDocumentFragment();
    let attachmentsCount = 0;
    for (const name in attachments) {
      const item = attachments[name];
      const div = document.createElement("div");
      div.className = "treeItem";
      const element = document.createElement("a");
      this._bindLink(element, item);
      element.textContent = this._normalizeTextContent(item.filename);
      div.append(element);
      fragment.append(div);
      attachmentsCount++;
    }
    this._finishRendering(fragment, attachmentsCount);
  }
  #appendAttachment(item) {
    const renderedPromise = this._renderedCapability.promise;
    renderedPromise.then(() => {
      if (renderedPromise !== this._renderedCapability.promise) {
        return;
      }
      const attachments = this._attachments || Object.create(null);
      for (const name in attachments) {
        if (item.filename === name) {
          return;
        }
      }
      attachments[item.filename] = item;
      this.render({
        attachments,
        keepRenderedCapability: true
      });
    });
  }
}

;// ./web/grab_to_pan.js
const CSS_CLASS_GRAB = "grab-to-pan-grab";
class GrabToPan {
  constructor({
    element
  }) {
    this.element = element;
    this.document = element.ownerDocument;
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.toggle = this.toggle.bind(this);
    this._onMouseDown = this.#onMouseDown.bind(this);
    this._onMouseMove = this.#onMouseMove.bind(this);
    this._endPan = this.#endPan.bind(this);
    const overlay = this.overlay = document.createElement("div");
    overlay.className = "grab-to-pan-grabbing";
  }
  activate() {
    if (!this.active) {
      this.active = true;
      this.element.addEventListener("mousedown", this._onMouseDown, true);
      this.element.classList.add(CSS_CLASS_GRAB);
    }
  }
  deactivate() {
    if (this.active) {
      this.active = false;
      this.element.removeEventListener("mousedown", this._onMouseDown, true);
      this._endPan();
      this.element.classList.remove(CSS_CLASS_GRAB);
    }
  }
  toggle() {
    if (this.active) {
      this.deactivate();
    } else {
      this.activate();
    }
  }
  ignoreTarget(node) {
    return node.matches("a[href], a[href] *, input, textarea, button, button *, select, option");
  }
  #onMouseDown(event) {
    if (event.button !== 0 || this.ignoreTarget(event.target)) {
      return;
    }
    if (event.originalTarget) {
      try {
        event.originalTarget.tagName;
      } catch {
        return;
      }
    }
    this.scrollLeftStart = this.element.scrollLeft;
    this.scrollTopStart = this.element.scrollTop;
    this.clientXStart = event.clientX;
    this.clientYStart = event.clientY;
    this.document.addEventListener("mousemove", this._onMouseMove, true);
    this.document.addEventListener("mouseup", this._endPan, true);
    this.element.addEventListener("scroll", this._endPan, true);
    event.preventDefault();
    event.stopPropagation();
    const focusedElement = document.activeElement;
    if (focusedElement && !focusedElement.contains(event.target)) {
      focusedElement.blur();
    }
  }
  #onMouseMove(event) {
    this.element.removeEventListener("scroll", this._endPan, true);
    if (!(event.buttons & 1)) {
      this._endPan();
      return;
    }
    const xDiff = event.clientX - this.clientXStart;
    const yDiff = event.clientY - this.clientYStart;
    this.element.scrollTo({
      top: this.scrollTopStart - yDiff,
      left: this.scrollLeftStart - xDiff,
      behavior: "instant"
    });
    if (!this.overlay.parentNode) {
      document.body.append(this.overlay);
    }
  }
  #endPan() {
    this.element.removeEventListener("scroll", this._endPan, true);
    this.document.removeEventListener("mousemove", this._onMouseMove, true);
    this.document.removeEventListener("mouseup", this._endPan, true);
    this.overlay.remove();
  }
}

;// ./web/pdf_cursor_tools.js



class PDFCursorTools {
  #active = CursorTool.SELECT;
  #prevActive = null;
  constructor({
    container,
    eventBus,
    cursorToolOnLoad = CursorTool.SELECT
  }) {
    this.container = container;
    this.eventBus = eventBus;
    this.#addEventListeners();
    Promise.resolve().then(() => {
      this.switchTool(cursorToolOnLoad);
    });
  }
  get activeTool() {
    return this.#active;
  }
  switchTool(tool) {
    if (this.#prevActive !== null) {
      return;
    }
    this.#switchTool(tool);
  }
  #switchTool(tool, disabled = false) {
    if (tool === this.#active) {
      if (this.#prevActive !== null) {
        this.eventBus.dispatch("cursortoolchanged", {
          source: this,
          tool,
          disabled
        });
      }
      return;
    }
    const disableActiveTool = () => {
      switch (this.#active) {
        case CursorTool.SELECT:
          break;
        case CursorTool.HAND:
          this._handTool.deactivate();
          break;
        case CursorTool.ZOOM:
      }
    };
    switch (tool) {
      case CursorTool.SELECT:
        disableActiveTool();
        break;
      case CursorTool.HAND:
        disableActiveTool();
        this._handTool.activate();
        break;
      case CursorTool.ZOOM:
      default:
        console.error(`switchTool: "${tool}" is an unsupported value.`);
        return;
    }
    this.#active = tool;
    this.eventBus.dispatch("cursortoolchanged", {
      source: this,
      tool,
      disabled
    });
  }
  #addEventListeners() {
    this.eventBus._on("switchcursortool", evt => {
      if (!evt.reset) {
        this.switchTool(evt.tool);
      } else if (this.#prevActive !== null) {
        annotationEditorMode = AnnotationEditorType.NONE;
        presentationModeState = PresentationModeState.NORMAL;
        enableActive();
      }
    });
    let annotationEditorMode = AnnotationEditorType.NONE,
      presentationModeState = PresentationModeState.NORMAL;
    const disableActive = () => {
      this.#prevActive ??= this.#active;
      this.#switchTool(CursorTool.SELECT, true);
    };
    const enableActive = () => {
      if (this.#prevActive !== null && annotationEditorMode === AnnotationEditorType.NONE && presentationModeState === PresentationModeState.NORMAL) {
        this.#switchTool(this.#prevActive);
        this.#prevActive = null;
      }
    };
    this.eventBus._on("annotationeditormodechanged", ({
      mode
    }) => {
      annotationEditorMode = mode;
      if (mode === AnnotationEditorType.NONE) {
        enableActive();
      } else {
        disableActive();
      }
    });
    this.eventBus._on("presentationmodechanged", ({
      state
    }) => {
      presentationModeState = state;
      if (state === PresentationModeState.NORMAL) {
        enableActive();
      } else if (state === PresentationModeState.FULLSCREEN) {
        disableActive();
      }
    });
  }
  get _handTool() {
    return shadow(this, "_handTool", new GrabToPan({
      element: this.container
    }));
  }
}

;// ./web/pdf_document_properties.js


const NON_METRIC_LOCALES = ["en-us", "en-lr", "my"];
const US_PAGE_NAMES = {
  "8.5x11": "pdfjs-document-properties-page-size-name-letter",
  "8.5x14": "pdfjs-document-properties-page-size-name-legal"
};
const METRIC_PAGE_NAMES = {
  "297x420": "pdfjs-document-properties-page-size-name-a-three",
  "210x297": "pdfjs-document-properties-page-size-name-a-four"
};
function getPageName(size, isPortrait, pageNames) {
  const width = isPortrait ? size.width : size.height;
  const height = isPortrait ? size.height : size.width;
  return pageNames[`${width}x${height}`];
}
class PDFDocumentProperties {
  #fieldData = null;
  constructor({
    dialog,
    fields,
    closeButton
  }, overlayManager, eventBus, l10n, fileNameLookup) {
    this.dialog = dialog;
    this.fields = fields;
    this.overlayManager = overlayManager;
    this.l10n = l10n;
    this._fileNameLookup = fileNameLookup;
    this.#reset();
    closeButton.addEventListener("click", this.close.bind(this));
    this.overlayManager.register(this.dialog);
    eventBus._on("pagechanging", evt => {
      this._currentPageNumber = evt.pageNumber;
    });
    eventBus._on("rotationchanging", evt => {
      this._pagesRotation = evt.pagesRotation;
    });
  }
  async open() {
    await Promise.all([this.overlayManager.open(this.dialog), this._dataAvailableCapability.promise]);
    const currentPageNumber = this._currentPageNumber;
    const pagesRotation = this._pagesRotation;
    if (this.#fieldData && currentPageNumber === this.#fieldData._currentPageNumber && pagesRotation === this.#fieldData._pagesRotation) {
      this.#updateUI();
      return;
    }
    const {
      info,
      contentLength
    } = await this.pdfDocument.getMetadata();
    const [fileName, fileSize, creationDate, modificationDate, pageSize, isLinearized] = await Promise.all([this._fileNameLookup(), this.#parseFileSize(contentLength), this.#parseDate(info.CreationDate), this.#parseDate(info.ModDate), this.pdfDocument.getPage(currentPageNumber).then(pdfPage => {
      return this.#parsePageSize(getPageSizeInches(pdfPage), pagesRotation);
    }), this.#parseLinearization(info.IsLinearized)]);
    this.#fieldData = Object.freeze({
      fileName,
      fileSize,
      title: info.Title,
      author: info.Author,
      subject: info.Subject,
      keywords: info.Keywords,
      creationDate,
      modificationDate,
      creator: info.Creator,
      producer: info.Producer,
      version: info.PDFFormatVersion,
      pageCount: this.pdfDocument.numPages,
      pageSize,
      linearized: isLinearized,
      _currentPageNumber: currentPageNumber,
      _pagesRotation: pagesRotation
    });
    this.#updateUI();
    const {
      length
    } = await this.pdfDocument.getDownloadInfo();
    if (contentLength === length) {
      return;
    }
    const data = Object.assign(Object.create(null), this.#fieldData);
    data.fileSize = await this.#parseFileSize(length);
    this.#fieldData = Object.freeze(data);
    this.#updateUI();
  }
  async close() {
    this.overlayManager.close(this.dialog);
  }
  setDocument(pdfDocument) {
    if (this.pdfDocument) {
      this.#reset();
      this.#updateUI();
    }
    if (!pdfDocument) {
      return;
    }
    this.pdfDocument = pdfDocument;
    this._dataAvailableCapability.resolve();
  }
  #reset() {
    this.pdfDocument = null;
    this.#fieldData = null;
    this._dataAvailableCapability = Promise.withResolvers();
    this._currentPageNumber = 1;
    this._pagesRotation = 0;
  }
  #updateUI() {
    if (this.#fieldData && this.overlayManager.active !== this.dialog) {
      return;
    }
    for (const id in this.fields) {
      const content = this.#fieldData?.[id];
      this.fields[id].textContent = content || content === 0 ? content : "-";
    }
  }
  async #parseFileSize(b = 0) {
    const kb = b / 1024,
      mb = kb / 1024;
    return kb ? this.l10n.get(mb >= 1 ? "pdfjs-document-properties-size-mb" : "pdfjs-document-properties-size-kb", {
      mb,
      kb,
      b
    }) : undefined;
  }
  async #parsePageSize(pageSizeInches, pagesRotation) {
    if (!pageSizeInches) {
      return undefined;
    }
    if (pagesRotation % 180 !== 0) {
      pageSizeInches = {
        width: pageSizeInches.height,
        height: pageSizeInches.width
      };
    }
    const isPortrait = isPortraitOrientation(pageSizeInches),
      nonMetric = NON_METRIC_LOCALES.includes(this.l10n.getLanguage());
    let sizeInches = {
      width: Math.round(pageSizeInches.width * 100) / 100,
      height: Math.round(pageSizeInches.height * 100) / 100
    };
    let sizeMillimeters = {
      width: Math.round(pageSizeInches.width * 25.4 * 10) / 10,
      height: Math.round(pageSizeInches.height * 25.4 * 10) / 10
    };
    let nameId = getPageName(sizeInches, isPortrait, US_PAGE_NAMES) || getPageName(sizeMillimeters, isPortrait, METRIC_PAGE_NAMES);
    if (!nameId && !(Number.isInteger(sizeMillimeters.width) && Number.isInteger(sizeMillimeters.height))) {
      const exactMillimeters = {
        width: pageSizeInches.width * 25.4,
        height: pageSizeInches.height * 25.4
      };
      const intMillimeters = {
        width: Math.round(sizeMillimeters.width),
        height: Math.round(sizeMillimeters.height)
      };
      if (Math.abs(exactMillimeters.width - intMillimeters.width) < 0.1 && Math.abs(exactMillimeters.height - intMillimeters.height) < 0.1) {
        nameId = getPageName(intMillimeters, isPortrait, METRIC_PAGE_NAMES);
        if (nameId) {
          sizeInches = {
            width: Math.round(intMillimeters.width / 25.4 * 100) / 100,
            height: Math.round(intMillimeters.height / 25.4 * 100) / 100
          };
          sizeMillimeters = intMillimeters;
        }
      }
    }
    const [{
      width,
      height
    }, unit, name, orientation] = await Promise.all([nonMetric ? sizeInches : sizeMillimeters, this.l10n.get(nonMetric ? "pdfjs-document-properties-page-size-unit-inches" : "pdfjs-document-properties-page-size-unit-millimeters"), nameId && this.l10n.get(nameId), this.l10n.get(isPortrait ? "pdfjs-document-properties-page-size-orientation-portrait" : "pdfjs-document-properties-page-size-orientation-landscape")]);
    return this.l10n.get(name ? "pdfjs-document-properties-page-size-dimension-name-string" : "pdfjs-document-properties-page-size-dimension-string", {
      width,
      height,
      unit,
      name,
      orientation
    });
  }
  async #parseDate(inputDate) {
    const dateObj = PDFDateString.toDateObject(inputDate);
    return dateObj ? this.l10n.get("pdfjs-document-properties-date-time-string", {
      dateObj: dateObj.valueOf()
    }) : undefined;
  }
  #parseLinearization(isLinearized) {
    return this.l10n.get(isLinearized ? "pdfjs-document-properties-linearized-yes" : "pdfjs-document-properties-linearized-no");
  }
}

;// ./web/pdf_find_utils.js
const CharacterType = {
  SPACE: 0,
  ALPHA_LETTER: 1,
  PUNCT: 2,
  HAN_LETTER: 3,
  KATAKANA_LETTER: 4,
  HIRAGANA_LETTER: 5,
  HALFWIDTH_KATAKANA_LETTER: 6,
  THAI_LETTER: 7
};
function isAlphabeticalScript(charCode) {
  return charCode < 0x2e80;
}
function isAscii(charCode) {
  return (charCode & 0xff80) === 0;
}
function isAsciiAlpha(charCode) {
  return charCode >= 0x61 && charCode <= 0x7a || charCode >= 0x41 && charCode <= 0x5a;
}
function isAsciiDigit(charCode) {
  return charCode >= 0x30 && charCode <= 0x39;
}
function isAsciiSpace(charCode) {
  return charCode === 0x20 || charCode === 0x09 || charCode === 0x0d || charCode === 0x0a;
}
function isHan(charCode) {
  return charCode >= 0x3400 && charCode <= 0x9fff || charCode >= 0xf900 && charCode <= 0xfaff;
}
function isKatakana(charCode) {
  return charCode >= 0x30a0 && charCode <= 0x30ff;
}
function isHiragana(charCode) {
  return charCode >= 0x3040 && charCode <= 0x309f;
}
function isHalfwidthKatakana(charCode) {
  return charCode >= 0xff60 && charCode <= 0xff9f;
}
function isThai(charCode) {
  return (charCode & 0xff80) === 0x0e00;
}
function getCharacterType(charCode) {
  if (isAlphabeticalScript(charCode)) {
    if (isAscii(charCode)) {
      if (isAsciiSpace(charCode)) {
        return CharacterType.SPACE;
      } else if (isAsciiAlpha(charCode) || isAsciiDigit(charCode) || charCode === 0x5f) {
        return CharacterType.ALPHA_LETTER;
      }
      return CharacterType.PUNCT;
    } else if (isThai(charCode)) {
      return CharacterType.THAI_LETTER;
    } else if (charCode === 0xa0) {
      return CharacterType.SPACE;
    }
    return CharacterType.ALPHA_LETTER;
  }
  if (isHan(charCode)) {
    return CharacterType.HAN_LETTER;
  } else if (isKatakana(charCode)) {
    return CharacterType.KATAKANA_LETTER;
  } else if (isHiragana(charCode)) {
    return CharacterType.HIRAGANA_LETTER;
  } else if (isHalfwidthKatakana(charCode)) {
    return CharacterType.HALFWIDTH_KATAKANA_LETTER;
  }
  return CharacterType.ALPHA_LETTER;
}
let NormalizeWithNFKC;
function getNormalizeWithNFKC() {
  NormalizeWithNFKC ||= ` ¨ª¯²-µ¸-º¼-¾Ĳ-ĳĿ-ŀŉſǄ-ǌǱ-ǳʰ-ʸ˘-˝ˠ-ˤʹͺ;΄-΅·ϐ-ϖϰ-ϲϴ-ϵϹևٵ-ٸक़-य़ড়-ঢ়য়ਲ਼ਸ਼ਖ਼-ਜ਼ਫ਼ଡ଼-ଢ଼ำຳໜ-ໝ༌གྷཌྷདྷབྷཛྷཀྵჼᴬ-ᴮᴰ-ᴺᴼ-ᵍᵏ-ᵪᵸᶛ-ᶿẚ-ẛάέήίόύώΆ᾽-῁ΈΉ῍-῏ΐΊ῝-῟ΰΎ῭-`ΌΏ´-῾ - ‑‗․-… ″-‴‶-‷‼‾⁇-⁉⁗ ⁰-ⁱ⁴-₎ₐ-ₜ₨℀-℃℅-ℇ℉-ℓℕ-№ℙ-ℝ℠-™ℤΩℨK-ℭℯ-ℱℳ-ℹ℻-⅀ⅅ-ⅉ⅐-ⅿ↉∬-∭∯-∰〈-〉①-⓪⨌⩴-⩶⫝̸ⱼ-ⱽⵯ⺟⻳⼀-⿕　〶〸-〺゛-゜ゟヿㄱ-ㆎ㆒-㆟㈀-㈞㈠-㉇㉐-㉾㊀-㏿ꚜ-ꚝꝰꟲ-ꟴꟸ-ꟹꭜ-ꭟꭩ豈-嗀塚晴凞-羽蘒諸逸-都飯-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-﷼︐-︙︰-﹄﹇-﹒﹔-﹦﹨-﹫ﹰ-ﹲﹴﹶ-ﻼ！-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￦`;
  return NormalizeWithNFKC;
}

;// ./web/pdf_find_controller.js


const FindState = {
  FOUND: 0,
  NOT_FOUND: 1,
  WRAPPED: 2,
  PENDING: 3
};
const FIND_TIMEOUT = 250;
const MATCH_SCROLL_OFFSET_TOP = -50;
const MATCH_SCROLL_OFFSET_LEFT = -400;
const CHARACTERS_TO_NORMALIZE = {
  "\u2010": "-",
  "\u2018": "'",
  "\u2019": "'",
  "\u201A": "'",
  "\u201B": "'",
  "\u201C": '"',
  "\u201D": '"',
  "\u201E": '"',
  "\u201F": '"',
  "\u00BC": "1/4",
  "\u00BD": "1/2",
  "\u00BE": "3/4"
};
const DIACRITICS_EXCEPTION = new Set([0x3099, 0x309a, 0x094d, 0x09cd, 0x0a4d, 0x0acd, 0x0b4d, 0x0bcd, 0x0c4d, 0x0ccd, 0x0d3b, 0x0d3c, 0x0d4d, 0x0dca, 0x0e3a, 0x0eba, 0x0f84, 0x1039, 0x103a, 0x1714, 0x1734, 0x17d2, 0x1a60, 0x1b44, 0x1baa, 0x1bab, 0x1bf2, 0x1bf3, 0x2d7f, 0xa806, 0xa82c, 0xa8c4, 0xa953, 0xa9c0, 0xaaf6, 0xabed, 0x0c56, 0x0f71, 0x0f72, 0x0f7a, 0x0f7b, 0x0f7c, 0x0f7d, 0x0f80, 0x0f74]);
let DIACRITICS_EXCEPTION_STR;
const DIACRITICS_REG_EXP = /\p{M}+/gu;
const SPECIAL_CHARS_REG_EXP = /([.*+?^${}()|[\]\\])|(\p{P})|(\s+)|(\p{M})|(\p{L})/gu;
const NOT_DIACRITIC_FROM_END_REG_EXP = /([^\p{M}])\p{M}*$/u;
const NOT_DIACRITIC_FROM_START_REG_EXP = /^\p{M}*([^\p{M}])/u;
const SYLLABLES_REG_EXP = /[\uAC00-\uD7AF\uFA6C\uFACF-\uFAD1\uFAD5-\uFAD7]+/g;
const SYLLABLES_LENGTHS = new Map();
const FIRST_CHAR_SYLLABLES_REG_EXP = "[\\u1100-\\u1112\\ud7a4-\\ud7af\\ud84a\\ud84c\\ud850\\ud854\\ud857\\ud85f]";
const NFKC_CHARS_TO_NORMALIZE = new Map();
let noSyllablesRegExp = null;
let withSyllablesRegExp = null;
function normalize(text) {
  const syllablePositions = [];
  let m;
  while ((m = SYLLABLES_REG_EXP.exec(text)) !== null) {
    let {
      index
    } = m;
    for (const char of m[0]) {
      let len = SYLLABLES_LENGTHS.get(char);
      if (!len) {
        len = char.normalize("NFD").length;
        SYLLABLES_LENGTHS.set(char, len);
      }
      syllablePositions.push([len, index++]);
    }
  }
  let normalizationRegex;
  if (syllablePositions.length === 0 && noSyllablesRegExp) {
    normalizationRegex = noSyllablesRegExp;
  } else if (syllablePositions.length > 0 && withSyllablesRegExp) {
    normalizationRegex = withSyllablesRegExp;
  } else {
    const replace = Object.keys(CHARACTERS_TO_NORMALIZE).join("");
    const toNormalizeWithNFKC = getNormalizeWithNFKC();
    const CJK = "(?:\\p{Ideographic}|[\u3040-\u30FF])";
    const HKDiacritics = "(?:\u3099|\u309A)";
    const CompoundWord = "\\p{Ll}-\\n\\p{Lu}";
    const regexp = `([${replace}])|([${toNormalizeWithNFKC}])|(${HKDiacritics}\\n)|(\\p{M}+(?:-\\n)?)|(${CompoundWord})|(\\S-\\n)|(${CJK}\\n)|(\\n)`;
    if (syllablePositions.length === 0) {
      normalizationRegex = noSyllablesRegExp = new RegExp(regexp + "|(\\u0000)", "gum");
    } else {
      normalizationRegex = withSyllablesRegExp = new RegExp(regexp + `|(${FIRST_CHAR_SYLLABLES_REG_EXP})`, "gum");
    }
  }
  const rawDiacriticsPositions = [];
  while ((m = DIACRITICS_REG_EXP.exec(text)) !== null) {
    rawDiacriticsPositions.push([m[0].length, m.index]);
  }
  let normalized = text.normalize("NFD");
  const positions = [[0, 0]];
  let rawDiacriticsIndex = 0;
  let syllableIndex = 0;
  let shift = 0;
  let shiftOrigin = 0;
  let eol = 0;
  let hasDiacritics = false;
  normalized = normalized.replace(normalizationRegex, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9, i) => {
    i -= shiftOrigin;
    if (p1) {
      const replacement = CHARACTERS_TO_NORMALIZE[p1];
      const jj = replacement.length;
      for (let j = 1; j < jj; j++) {
        positions.push([i - shift + j, shift - j]);
      }
      shift -= jj - 1;
      return replacement;
    }
    if (p2) {
      let replacement = NFKC_CHARS_TO_NORMALIZE.get(p2);
      if (!replacement) {
        replacement = p2.normalize("NFKC");
        NFKC_CHARS_TO_NORMALIZE.set(p2, replacement);
      }
      const jj = replacement.length;
      for (let j = 1; j < jj; j++) {
        positions.push([i - shift + j, shift - j]);
      }
      shift -= jj - 1;
      return replacement;
    }
    if (p3) {
      hasDiacritics = true;
      if (i + eol === rawDiacriticsPositions[rawDiacriticsIndex]?.[1]) {
        ++rawDiacriticsIndex;
      } else {
        positions.push([i - 1 - shift + 1, shift - 1]);
        shift -= 1;
        shiftOrigin += 1;
      }
      positions.push([i - shift + 1, shift]);
      shiftOrigin += 1;
      eol += 1;
      return p3.charAt(0);
    }
    if (p4) {
      const hasTrailingDashEOL = p4.endsWith("\n");
      const len = hasTrailingDashEOL ? p4.length - 2 : p4.length;
      hasDiacritics = true;
      let jj = len;
      if (i + eol === rawDiacriticsPositions[rawDiacriticsIndex]?.[1]) {
        jj -= rawDiacriticsPositions[rawDiacriticsIndex][0];
        ++rawDiacriticsIndex;
      }
      for (let j = 1; j <= jj; j++) {
        positions.push([i - 1 - shift + j, shift - j]);
      }
      shift -= jj;
      shiftOrigin += jj;
      if (hasTrailingDashEOL) {
        i += len - 1;
        positions.push([i - shift + 1, 1 + shift]);
        shift += 1;
        shiftOrigin += 1;
        eol += 1;
        return p4.slice(0, len);
      }
      return p4;
    }
    if (p5) {
      positions.push([i - shift + 3, 1 + shift]);
      shift += 1;
      shiftOrigin += 1;
      eol += 1;
      return p5.replace("\n", "");
    }
    if (p6) {
      const len = p6.length - 2;
      positions.push([i - shift + len, 1 + shift]);
      shift += 1;
      shiftOrigin += 1;
      eol += 1;
      return p6.slice(0, -2);
    }
    if (p7) {
      const len = p7.length - 1;
      positions.push([i - shift + len, shift]);
      shiftOrigin += 1;
      eol += 1;
      return p7.slice(0, -1);
    }
    if (p8) {
      positions.push([i - shift + 1, shift - 1]);
      shift -= 1;
      shiftOrigin += 1;
      eol += 1;
      return " ";
    }
    if (i + eol === syllablePositions[syllableIndex]?.[1]) {
      const newCharLen = syllablePositions[syllableIndex][0] - 1;
      ++syllableIndex;
      for (let j = 1; j <= newCharLen; j++) {
        positions.push([i - (shift - j), shift - j]);
      }
      shift -= newCharLen;
      shiftOrigin += newCharLen;
    }
    return p9;
  });
  positions.push([normalized.length, shift]);
  return [normalized, positions, hasDiacritics];
}
function getOriginalIndex(diffs, pos, len) {
  if (!diffs) {
    return [pos, len];
  }
  const start = pos;
  const end = pos + len - 1;
  let i = binarySearchFirstItem(diffs, x => x[0] >= start);
  if (diffs[i][0] > start) {
    --i;
  }
  let j = binarySearchFirstItem(diffs, x => x[0] >= end, i);
  if (diffs[j][0] > end) {
    --j;
  }
  const oldStart = start + diffs[i][1];
  const oldEnd = end + diffs[j][1];
  const oldLen = oldEnd + 1 - oldStart;
  return [oldStart, oldLen];
}
class PDFFindController {
  #state = null;
  #updateMatchesCountOnProgress = true;
  #visitedPagesCount = 0;
  constructor({
    linkService,
    eventBus,
    updateMatchesCountOnProgress = true
  }) {
    this._linkService = linkService;
    this._eventBus = eventBus;
    this.#updateMatchesCountOnProgress = updateMatchesCountOnProgress;
    this.onIsPageVisible = null;
    this.#reset();
    eventBus._on("find", this.#onFind.bind(this));
    eventBus._on("findbarclose", this.#onFindBarClose.bind(this));
  }
  get highlightMatches() {
    return this._highlightMatches;
  }
  get pageMatches() {
    return this._pageMatches;
  }
  get pageMatchesLength() {
    return this._pageMatchesLength;
  }
  get selected() {
    return this._selected;
  }
  get state() {
    return this.#state;
  }
  setDocument(pdfDocument) {
    if (this._pdfDocument) {
      this.#reset();
    }
    if (!pdfDocument) {
      return;
    }
    this._pdfDocument = pdfDocument;
    this._firstPageCapability.resolve();
  }
  #onFind(state) {
    if (!state) {
      return;
    }
    const pdfDocument = this._pdfDocument;
    const {
      type
    } = state;
    if (this.#state === null || this.#shouldDirtyMatch(state)) {
      this._dirtyMatch = true;
    }
    this.#state = state;
    if (type !== "highlightallchange") {
      this.#updateUIState(FindState.PENDING);
    }
    this._firstPageCapability.promise.then(() => {
      if (!this._pdfDocument || pdfDocument && this._pdfDocument !== pdfDocument) {
        return;
      }
      this.#extractText();
      const findbarClosed = !this._highlightMatches;
      const pendingTimeout = !!this._findTimeout;
      if (this._findTimeout) {
        clearTimeout(this._findTimeout);
        this._findTimeout = null;
      }
      if (!type) {
        this._findTimeout = setTimeout(() => {
          this.#nextMatch();
          this._findTimeout = null;
        }, FIND_TIMEOUT);
      } else if (this._dirtyMatch) {
        this.#nextMatch();
      } else if (type === "again") {
        this.#nextMatch();
        if (findbarClosed && this.#state.highlightAll) {
          this.#updateAllPages();
        }
      } else if (type === "highlightallchange") {
        if (pendingTimeout) {
          this.#nextMatch();
        } else {
          this._highlightMatches = true;
        }
        this.#updateAllPages();
      } else {
        this.#nextMatch();
      }
    });
  }
  scrollMatchIntoView({
    element = null,
    selectedLeft = 0,
    pageIndex = -1,
    matchIndex = -1
  }) {
    if (!this._scrollMatches || !element) {
      return;
    } else if (matchIndex === -1 || matchIndex !== this._selected.matchIdx) {
      return;
    } else if (pageIndex === -1 || pageIndex !== this._selected.pageIdx) {
      return;
    }
    this._scrollMatches = false;
    const spot = {
      top: MATCH_SCROLL_OFFSET_TOP,
      left: selectedLeft + MATCH_SCROLL_OFFSET_LEFT
    };
    scrollIntoView(element, spot, true);
  }
  #reset() {
    this._highlightMatches = false;
    this._scrollMatches = false;
    this._pdfDocument = null;
    this._pageMatches = [];
    this._pageMatchesLength = [];
    this.#visitedPagesCount = 0;
    this.#state = null;
    this._selected = {
      pageIdx: -1,
      matchIdx: -1
    };
    this._offset = {
      pageIdx: null,
      matchIdx: null,
      wrapped: false
    };
    this._extractTextPromises = [];
    this._pageContents = [];
    this._pageDiffs = [];
    this._hasDiacritics = [];
    this._matchesCountTotal = 0;
    this._pagesToSearch = null;
    this._pendingFindMatches = new Set();
    this._resumePageIdx = null;
    this._dirtyMatch = false;
    clearTimeout(this._findTimeout);
    this._findTimeout = null;
    this._firstPageCapability = Promise.withResolvers();
  }
  get #query() {
    const {
      query
    } = this.#state;
    if (typeof query === "string") {
      if (query !== this._rawQuery) {
        this._rawQuery = query;
        [this._normalizedQuery] = normalize(query);
      }
      return this._normalizedQuery;
    }
    return (query || []).filter(q => !!q).map(q => normalize(q)[0]);
  }
  #shouldDirtyMatch(state) {
    const newQuery = state.query,
      prevQuery = this.#state.query;
    const newType = typeof newQuery,
      prevType = typeof prevQuery;
    if (newType !== prevType) {
      return true;
    }
    if (newType === "string") {
      if (newQuery !== prevQuery) {
        return true;
      }
    } else if (JSON.stringify(newQuery) !== JSON.stringify(prevQuery)) {
      return true;
    }
    switch (state.type) {
      case "again":
        const pageNumber = this._selected.pageIdx + 1;
        const linkService = this._linkService;
        return pageNumber >= 1 && pageNumber <= linkService.pagesCount && pageNumber !== linkService.page && !(this.onIsPageVisible?.(pageNumber) ?? true);
      case "highlightallchange":
        return false;
    }
    return true;
  }
  #isEntireWord(content, startIdx, length) {
    let match = content.slice(0, startIdx).match(NOT_DIACRITIC_FROM_END_REG_EXP);
    if (match) {
      const first = content.charCodeAt(startIdx);
      const limit = match[1].charCodeAt(0);
      if (getCharacterType(first) === getCharacterType(limit)) {
        return false;
      }
    }
    match = content.slice(startIdx + length).match(NOT_DIACRITIC_FROM_START_REG_EXP);
    if (match) {
      const last = content.charCodeAt(startIdx + length - 1);
      const limit = match[1].charCodeAt(0);
      if (getCharacterType(last) === getCharacterType(limit)) {
        return false;
      }
    }
    return true;
  }
  #convertToRegExpString(query, hasDiacritics) {
    const {
      matchDiacritics
    } = this.#state;
    let isUnicode = false;
    query = query.replaceAll(SPECIAL_CHARS_REG_EXP, (match, p1, p2, p3, p4, p5) => {
      if (p1) {
        return `[ ]*\\${p1}[ ]*`;
      }
      if (p2) {
        return `[ ]*${p2}[ ]*`;
      }
      if (p3) {
        return "[ ]+";
      }
      if (matchDiacritics) {
        return p4 || p5;
      }
      if (p4) {
        return DIACRITICS_EXCEPTION.has(p4.charCodeAt(0)) ? p4 : "";
      }
      if (hasDiacritics) {
        isUnicode = true;
        return `${p5}\\p{M}*`;
      }
      return p5;
    });
    const trailingSpaces = "[ ]*";
    if (query.endsWith(trailingSpaces)) {
      query = query.slice(0, query.length - trailingSpaces.length);
    }
    if (matchDiacritics) {
      if (hasDiacritics) {
        DIACRITICS_EXCEPTION_STR ||= String.fromCharCode(...DIACRITICS_EXCEPTION);
        isUnicode = true;
        query = `${query}(?=[${DIACRITICS_EXCEPTION_STR}]|[^\\p{M}]|$)`;
      }
    }
    return [isUnicode, query];
  }
  #calculateMatch(pageIndex) {
    const query = this.#query;
    if (query.length === 0) {
      return;
    }
    const pageContent = this._pageContents[pageIndex];
    const matcherResult = this.match(query, pageContent, pageIndex);
    const matches = this._pageMatches[pageIndex] = [];
    const matchesLength = this._pageMatchesLength[pageIndex] = [];
    const diffs = this._pageDiffs[pageIndex];
    matcherResult?.forEach(({
      index,
      length
    }) => {
      const [matchPos, matchLen] = getOriginalIndex(diffs, index, length);
      if (matchLen) {
        matches.push(matchPos);
        matchesLength.push(matchLen);
      }
    });
    if (this.#state.highlightAll) {
      this.#updatePage(pageIndex);
    }
    if (this._resumePageIdx === pageIndex) {
      this._resumePageIdx = null;
      this.#nextPageMatch();
    }
    const pageMatchesCount = matches.length;
    this._matchesCountTotal += pageMatchesCount;
    if (this.#updateMatchesCountOnProgress) {
      if (pageMatchesCount > 0) {
        this.#updateUIResultsCount();
      }
    } else if (++this.#visitedPagesCount === this._linkService.pagesCount) {
      this.#updateUIResultsCount();
    }
  }
  match(query, pageContent, pageIndex) {
    const hasDiacritics = this._hasDiacritics[pageIndex];
    let isUnicode = false;
    if (typeof query === "string") {
      [isUnicode, query] = this.#convertToRegExpString(query, hasDiacritics);
    } else {
      query = query.sort().reverse().map(q => {
        const [isUnicodePart, queryPart] = this.#convertToRegExpString(q, hasDiacritics);
        isUnicode ||= isUnicodePart;
        return `(${queryPart})`;
      }).join("|");
    }
    if (!query) {
      return undefined;
    }
    const {
      caseSensitive,
      entireWord
    } = this.#state;
    const flags = `g${isUnicode ? "u" : ""}${caseSensitive ? "" : "i"}`;
    query = new RegExp(query, flags);
    const matches = [];
    let match;
    while ((match = query.exec(pageContent)) !== null) {
      if (entireWord && !this.#isEntireWord(pageContent, match.index, match[0].length)) {
        continue;
      }
      matches.push({
        index: match.index,
        length: match[0].length
      });
    }
    return matches;
  }
  #extractText() {
    if (this._extractTextPromises.length > 0) {
      return;
    }
    let deferred = Promise.resolve();
    const textOptions = {
      disableNormalization: true
    };
    for (let i = 0, ii = this._linkService.pagesCount; i < ii; i++) {
      const {
        promise,
        resolve
      } = Promise.withResolvers();
      this._extractTextPromises[i] = promise;
      deferred = deferred.then(() => {
        return this._pdfDocument.getPage(i + 1).then(pdfPage => pdfPage.getTextContent(textOptions)).then(textContent => {
          const strBuf = [];
          for (const textItem of textContent.items) {
            strBuf.push(textItem.str);
            if (textItem.hasEOL) {
              strBuf.push("\n");
            }
          }
          [this._pageContents[i], this._pageDiffs[i], this._hasDiacritics[i]] = normalize(strBuf.join(""));
          resolve();
        }, reason => {
          console.error(`Unable to get text content for page ${i + 1}`, reason);
          this._pageContents[i] = "";
          this._pageDiffs[i] = null;
          this._hasDiacritics[i] = false;
          resolve();
        });
      });
    }
  }
  #updatePage(index) {
    if (this._scrollMatches && this._selected.pageIdx === index) {
      this._linkService.page = index + 1;
    }
    this._eventBus.dispatch("updatetextlayermatches", {
      source: this,
      pageIndex: index
    });
  }
  #updateAllPages() {
    this._eventBus.dispatch("updatetextlayermatches", {
      source: this,
      pageIndex: -1
    });
  }
  #nextMatch() {
    const previous = this.#state.findPrevious;
    const currentPageIndex = this._linkService.page - 1;
    const numPages = this._linkService.pagesCount;
    this._highlightMatches = true;
    if (this._dirtyMatch) {
      this._dirtyMatch = false;
      this._selected.pageIdx = this._selected.matchIdx = -1;
      this._offset.pageIdx = currentPageIndex;
      this._offset.matchIdx = null;
      this._offset.wrapped = false;
      this._resumePageIdx = null;
      this._pageMatches.length = 0;
      this._pageMatchesLength.length = 0;
      this.#visitedPagesCount = 0;
      this._matchesCountTotal = 0;
      this.#updateAllPages();
      for (let i = 0; i < numPages; i++) {
        if (this._pendingFindMatches.has(i)) {
          continue;
        }
        this._pendingFindMatches.add(i);
        this._extractTextPromises[i].then(() => {
          this._pendingFindMatches.delete(i);
          this.#calculateMatch(i);
        });
      }
    }
    const query = this.#query;
    if (query.length === 0) {
      this.#updateUIState(FindState.FOUND);
      return;
    }
    if (this._resumePageIdx) {
      return;
    }
    const offset = this._offset;
    this._pagesToSearch = numPages;
    if (offset.matchIdx !== null) {
      const numPageMatches = this._pageMatches[offset.pageIdx].length;
      if (!previous && offset.matchIdx + 1 < numPageMatches || previous && offset.matchIdx > 0) {
        offset.matchIdx = previous ? offset.matchIdx - 1 : offset.matchIdx + 1;
        this.#updateMatch(true);
        return;
      }
      this.#advanceOffsetPage(previous);
    }
    this.#nextPageMatch();
  }
  #matchesReady(matches) {
    const offset = this._offset;
    const numMatches = matches.length;
    const previous = this.#state.findPrevious;
    if (numMatches) {
      offset.matchIdx = previous ? numMatches - 1 : 0;
      this.#updateMatch(true);
      return true;
    }
    this.#advanceOffsetPage(previous);
    if (offset.wrapped) {
      offset.matchIdx = null;
      if (this._pagesToSearch < 0) {
        this.#updateMatch(false);
        return true;
      }
    }
    return false;
  }
  #nextPageMatch() {
    if (this._resumePageIdx !== null) {
      console.error("There can only be one pending page.");
    }
    let matches = null;
    do {
      const pageIdx = this._offset.pageIdx;
      matches = this._pageMatches[pageIdx];
      if (!matches) {
        this._resumePageIdx = pageIdx;
        break;
      }
    } while (!this.#matchesReady(matches));
  }
  #advanceOffsetPage(previous) {
    const offset = this._offset;
    const numPages = this._linkService.pagesCount;
    offset.pageIdx = previous ? offset.pageIdx - 1 : offset.pageIdx + 1;
    offset.matchIdx = null;
    this._pagesToSearch--;
    if (offset.pageIdx >= numPages || offset.pageIdx < 0) {
      offset.pageIdx = previous ? numPages - 1 : 0;
      offset.wrapped = true;
    }
  }
  #updateMatch(found = false) {
    let state = FindState.NOT_FOUND;
    const wrapped = this._offset.wrapped;
    this._offset.wrapped = false;
    if (found) {
      const previousPage = this._selected.pageIdx;
      this._selected.pageIdx = this._offset.pageIdx;
      this._selected.matchIdx = this._offset.matchIdx;
      state = wrapped ? FindState.WRAPPED : FindState.FOUND;
      if (previousPage !== -1 && previousPage !== this._selected.pageIdx) {
        this.#updatePage(previousPage);
      }
    }
    this.#updateUIState(state, this.#state.findPrevious);
    if (this._selected.pageIdx !== -1) {
      this._scrollMatches = true;
      this.#updatePage(this._selected.pageIdx);
    }
  }
  #onFindBarClose(evt) {
    const pdfDocument = this._pdfDocument;
    this._firstPageCapability.promise.then(() => {
      if (!this._pdfDocument || pdfDocument && this._pdfDocument !== pdfDocument) {
        return;
      }
      if (this._findTimeout) {
        clearTimeout(this._findTimeout);
        this._findTimeout = null;
      }
      if (this._resumePageIdx) {
        this._resumePageIdx = null;
        this._dirtyMatch = true;
      }
      this.#updateUIState(FindState.FOUND);
      this._highlightMatches = false;
      this.#updateAllPages();
    });
  }
  #requestMatchesCount() {
    const {
      pageIdx,
      matchIdx
    } = this._selected;
    let current = 0,
      total = this._matchesCountTotal;
    if (matchIdx !== -1) {
      for (let i = 0; i < pageIdx; i++) {
        current += this._pageMatches[i]?.length || 0;
      }
      current += matchIdx + 1;
    }
    if (current < 1 || current > total) {
      current = total = 0;
    }
    return {
      current,
      total
    };
  }
  #updateUIResultsCount() {
    this._eventBus.dispatch("updatefindmatchescount", {
      source: this,
      matchesCount: this.#requestMatchesCount()
    });
  }
  #updateUIState(state, previous = false) {
    if (!this.#updateMatchesCountOnProgress && (this.#visitedPagesCount !== this._linkService.pagesCount || state === FindState.PENDING)) {
      return;
    }
    this._eventBus.dispatch("updatefindcontrolstate", {
      source: this,
      state,
      previous,
      entireWord: this.#state?.entireWord ?? null,
      matchesCount: this.#requestMatchesCount(),
      rawQuery: this.#state?.query ?? null
    });
  }
}

;// ./web/pdf_find_bar.js


const MATCHES_COUNT_LIMIT = 1000;
class PDFFindBar {
  #mainContainer;
  #resizeObserver = new ResizeObserver(this.#resizeObserverCallback.bind(this));
  constructor(options, mainContainer, eventBus) {
    this.opened = false;
    this.bar = options.bar;
    this.toggleButton = options.toggleButton;
    this.findField = options.findField;
    this.highlightAll = options.highlightAllCheckbox;
    this.caseSensitive = options.caseSensitiveCheckbox;
    this.matchDiacritics = options.matchDiacriticsCheckbox;
    this.entireWord = options.entireWordCheckbox;
    this.findMsg = options.findMsg;
    this.findResultsCount = options.findResultsCount;
    this.findPreviousButton = options.findPreviousButton;
    this.findNextButton = options.findNextButton;
    this.eventBus = eventBus;
    this.#mainContainer = mainContainer;
    this.toggleButton.addEventListener("click", () => {
      this.toggle();
    });
    this.findField.addEventListener("input", () => {
      this.dispatchEvent("");
    });
    this.bar.addEventListener("keydown", e => {
      switch (e.keyCode) {
        case 13:
          if (e.target === this.findField) {
            this.dispatchEvent("again", e.shiftKey);
          }
          break;
        case 27:
          this.close();
          break;
      }
    });
    this.findPreviousButton.addEventListener("click", () => {
      this.dispatchEvent("again", true);
    });
    this.findNextButton.addEventListener("click", () => {
      this.dispatchEvent("again", false);
    });
    this.highlightAll.addEventListener("click", () => {
      this.dispatchEvent("highlightallchange");
    });
    this.caseSensitive.addEventListener("click", () => {
      this.dispatchEvent("casesensitivitychange");
    });
    this.entireWord.addEventListener("click", () => {
      this.dispatchEvent("entirewordchange");
    });
    this.matchDiacritics.addEventListener("click", () => {
      this.dispatchEvent("diacriticmatchingchange");
    });
  }
  reset() {
    this.updateUIState();
  }
  dispatchEvent(type, findPrev = false) {
    this.eventBus.dispatch("find", {
      source: this,
      type,
      query: this.findField.value,
      caseSensitive: this.caseSensitive.checked,
      entireWord: this.entireWord.checked,
      highlightAll: this.highlightAll.checked,
      findPrevious: findPrev,
      matchDiacritics: this.matchDiacritics.checked
    });
  }
  updateUIState(state, previous, matchesCount) {
    const {
      findField,
      findMsg
    } = this;
    let findMsgId = "",
      status = "";
    switch (state) {
      case FindState.FOUND:
        break;
      case FindState.PENDING:
        status = "pending";
        break;
      case FindState.NOT_FOUND:
        findMsgId = "pdfjs-find-not-found";
        status = "notFound";
        break;
      case FindState.WRAPPED:
        findMsgId = previous ? "pdfjs-find-reached-top" : "pdfjs-find-reached-bottom";
        break;
    }
    findField.setAttribute("data-status", status);
    findField.setAttribute("aria-invalid", state === FindState.NOT_FOUND);
    findMsg.setAttribute("data-status", status);
    if (findMsgId) {
      findMsg.setAttribute("data-l10n-id", findMsgId);
    } else {
      findMsg.removeAttribute("data-l10n-id");
      findMsg.textContent = "";
    }
    this.updateResultsCount(matchesCount);
  }
  updateResultsCount({
    current = 0,
    total = 0
  } = {}) {
    const {
      findResultsCount
    } = this;
    if (total > 0) {
      const limit = MATCHES_COUNT_LIMIT;
      findResultsCount.setAttribute("data-l10n-id", total > limit ? "pdfjs-find-match-count-limit" : "pdfjs-find-match-count");
      findResultsCount.setAttribute("data-l10n-args", JSON.stringify({
        limit,
        current,
        total
      }));
    } else {
      findResultsCount.removeAttribute("data-l10n-id");
      findResultsCount.textContent = "";
    }
  }
  open() {
    if (!this.opened) {
      this.#resizeObserver.observe(this.#mainContainer);
      this.#resizeObserver.observe(this.bar);
      this.opened = true;
      toggleExpandedBtn(this.toggleButton, true, this.bar);
    }
    this.findField.select();
    this.findField.focus();
  }
  close() {
    if (!this.opened) {
      return;
    }
    this.#resizeObserver.disconnect();
    this.opened = false;
    toggleExpandedBtn(this.toggleButton, false, this.bar);
    this.eventBus.dispatch("findbarclose", {
      source: this
    });
  }
  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }
  #resizeObserverCallback() {
    const {
      bar
    } = this;
    bar.classList.remove("wrapContainers");
    const findbarHeight = bar.clientHeight;
    const inputContainerHeight = bar.firstElementChild.clientHeight;
    if (findbarHeight > inputContainerHeight) {
      bar.classList.add("wrapContainers");
    }
  }
}

;// ./web/pdf_history.js


const HASH_CHANGE_TIMEOUT = 1000;
const POSITION_UPDATED_THRESHOLD = 50;
const UPDATE_VIEWAREA_TIMEOUT = 1000;
function getCurrentHash() {
  return document.location.hash;
}
class PDFHistory {
  #eventAbortController = null;
  constructor({
    linkService,
    eventBus
  }) {
    this.linkService = linkService;
    this.eventBus = eventBus;
    this._initialized = false;
    this._fingerprint = "";
    this.reset();
    this.eventBus._on("pagesinit", () => {
      this._isPagesLoaded = false;
      this.eventBus._on("pagesloaded", evt => {
        this._isPagesLoaded = !!evt.pagesCount;
      }, {
        once: true
      });
    });
  }
  initialize({
    fingerprint,
    resetHistory = false,
    updateUrl = false
  }) {
    if (!fingerprint || typeof fingerprint !== "string") {
      console.error('PDFHistory.initialize: The "fingerprint" must be a non-empty string.');
      return;
    }
    if (this._initialized) {
      this.reset();
    }
    const reInitialized = this._fingerprint !== "" && this._fingerprint !== fingerprint;
    this._fingerprint = fingerprint;
    this._updateUrl = updateUrl === true;
    this._initialized = true;
    this.#bindEvents();
    const state = window.history.state;
    this._popStateInProgress = false;
    this._blockHashChange = 0;
    this._currentHash = getCurrentHash();
    this._numPositionUpdates = 0;
    this._uid = this._maxUid = 0;
    this._destination = null;
    this._position = null;
    if (!this.#isValidState(state, true) || resetHistory) {
      const {
        hash,
        page,
        rotation
      } = this.#parseCurrentHash(true);
      if (!hash || reInitialized || resetHistory) {
        this.#pushOrReplaceState(null, true);
        return;
      }
      this.#pushOrReplaceState({
        hash,
        page,
        rotation
      }, true);
      return;
    }
    const destination = state.destination;
    this.#updateInternalState(destination, state.uid, true);
    if (destination.rotation !== undefined) {
      this._initialRotation = destination.rotation;
    }
    if (destination.dest) {
      this._initialBookmark = JSON.stringify(destination.dest);
      this._destination.page = null;
    } else if (destination.hash) {
      this._initialBookmark = destination.hash;
    } else if (destination.page) {
      this._initialBookmark = `page=${destination.page}`;
    }
  }
  reset() {
    if (this._initialized) {
      this.#pageHide();
      this._initialized = false;
      this.#unbindEvents();
    }
    if (this._updateViewareaTimeout) {
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }
    this._initialBookmark = null;
    this._initialRotation = null;
  }
  push({
    namedDest = null,
    explicitDest,
    pageNumber
  }) {
    if (!this._initialized) {
      return;
    }
    if (namedDest && typeof namedDest !== "string") {
      console.error("PDFHistory.push: " + `"${namedDest}" is not a valid namedDest parameter.`);
      return;
    } else if (!Array.isArray(explicitDest)) {
      console.error("PDFHistory.push: " + `"${explicitDest}" is not a valid explicitDest parameter.`);
      return;
    } else if (!this.#isValidPage(pageNumber)) {
      if (pageNumber !== null || this._destination) {
        console.error("PDFHistory.push: " + `"${pageNumber}" is not a valid pageNumber parameter.`);
        return;
      }
    }
    const hash = namedDest || JSON.stringify(explicitDest);
    if (!hash) {
      return;
    }
    let forceReplace = false;
    if (this._destination && (isDestHashesEqual(this._destination.hash, hash) || isDestArraysEqual(this._destination.dest, explicitDest))) {
      if (this._destination.page) {
        return;
      }
      forceReplace = true;
    }
    if (this._popStateInProgress && !forceReplace) {
      return;
    }
    this.#pushOrReplaceState({
      dest: explicitDest,
      hash,
      page: pageNumber,
      rotation: this.linkService.rotation
    }, forceReplace);
    if (!this._popStateInProgress) {
      this._popStateInProgress = true;
      Promise.resolve().then(() => {
        this._popStateInProgress = false;
      });
    }
  }
  pushPage(pageNumber) {
    if (!this._initialized) {
      return;
    }
    if (!this.#isValidPage(pageNumber)) {
      console.error(`PDFHistory.pushPage: "${pageNumber}" is not a valid page number.`);
      return;
    }
    if (this._destination?.page === pageNumber) {
      return;
    }
    if (this._popStateInProgress) {
      return;
    }
    this.#pushOrReplaceState({
      dest: null,
      hash: `page=${pageNumber}`,
      page: pageNumber,
      rotation: this.linkService.rotation
    });
    if (!this._popStateInProgress) {
      this._popStateInProgress = true;
      Promise.resolve().then(() => {
        this._popStateInProgress = false;
      });
    }
  }
  pushCurrentPosition() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    this.#tryPushCurrentPosition();
  }
  back() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    const state = window.history.state;
    if (this.#isValidState(state) && state.uid > 0) {
      window.history.back();
    }
  }
  forward() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    const state = window.history.state;
    if (this.#isValidState(state) && state.uid < this._maxUid) {
      window.history.forward();
    }
  }
  get popStateInProgress() {
    return this._initialized && (this._popStateInProgress || this._blockHashChange > 0);
  }
  get initialBookmark() {
    return this._initialized ? this._initialBookmark : null;
  }
  get initialRotation() {
    return this._initialized ? this._initialRotation : null;
  }
  #pushOrReplaceState(destination, forceReplace = false) {
    const shouldReplace = forceReplace || !this._destination;
    const newState = {
      fingerprint: this._fingerprint,
      uid: shouldReplace ? this._uid : this._uid + 1,
      destination
    };
    this.#updateInternalState(destination, newState.uid);
    let newUrl;
    if (this._updateUrl && destination?.hash) {
      const baseUrl = document.location.href.split("#", 1)[0];
      if (!baseUrl.startsWith("file://")) {
        newUrl = `${baseUrl}#${destination.hash}`;
      }
    }
    if (shouldReplace) {
      window.history.replaceState(newState, "", newUrl);
    } else {
      window.history.pushState(newState, "", newUrl);
    }
  }
  #tryPushCurrentPosition(temporary = false) {
    if (!this._position) {
      return;
    }
    let position = this._position;
    if (temporary) {
      position = Object.assign(Object.create(null), this._position);
      position.temporary = true;
    }
    if (!this._destination) {
      this.#pushOrReplaceState(position);
      return;
    }
    if (this._destination.temporary) {
      this.#pushOrReplaceState(position, true);
      return;
    }
    if (this._destination.hash === position.hash) {
      return;
    }
    if (!this._destination.page && (POSITION_UPDATED_THRESHOLD <= 0 || this._numPositionUpdates <= POSITION_UPDATED_THRESHOLD)) {
      return;
    }
    let forceReplace = false;
    if (this._destination.page >= position.first && this._destination.page <= position.page) {
      if (this._destination.dest !== undefined || !this._destination.first) {
        return;
      }
      forceReplace = true;
    }
    this.#pushOrReplaceState(position, forceReplace);
  }
  #isValidPage(val) {
    return Number.isInteger(val) && val > 0 && val <= this.linkService.pagesCount;
  }
  #isValidState(state, checkReload = false) {
    if (!state) {
      return false;
    }
    if (state.fingerprint !== this._fingerprint) {
      if (checkReload) {
        if (typeof state.fingerprint !== "string" || state.fingerprint.length !== this._fingerprint.length) {
          return false;
        }
        const [perfEntry] = performance.getEntriesByType("navigation");
        if (perfEntry?.type !== "reload") {
          return false;
        }
      } else {
        return false;
      }
    }
    if (!Number.isInteger(state.uid) || state.uid < 0) {
      return false;
    }
    if (state.destination === null || typeof state.destination !== "object") {
      return false;
    }
    return true;
  }
  #updateInternalState(destination, uid, removeTemporary = false) {
    if (this._updateViewareaTimeout) {
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }
    if (removeTemporary && destination?.temporary) {
      delete destination.temporary;
    }
    this._destination = destination;
    this._uid = uid;
    this._maxUid = Math.max(this._maxUid, uid);
    this._numPositionUpdates = 0;
  }
  #parseCurrentHash(checkNameddest = false) {
    const hash = unescape(getCurrentHash()).substring(1);
    const params = parseQueryString(hash);
    const nameddest = params.get("nameddest") || "";
    let page = params.get("page") | 0;
    if (!this.#isValidPage(page) || checkNameddest && nameddest.length > 0) {
      page = null;
    }
    return {
      hash,
      page,
      rotation: this.linkService.rotation
    };
  }
  #updateViewarea({
    location
  }) {
    if (this._updateViewareaTimeout) {
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }
    this._position = {
      hash: location.pdfOpenParams.substring(1),
      page: this.linkService.page,
      first: location.pageNumber,
      rotation: location.rotation
    };
    if (this._popStateInProgress) {
      return;
    }
    if (POSITION_UPDATED_THRESHOLD > 0 && this._isPagesLoaded && this._destination && !this._destination.page) {
      this._numPositionUpdates++;
    }
    if (UPDATE_VIEWAREA_TIMEOUT > 0) {
      this._updateViewareaTimeout = setTimeout(() => {
        if (!this._popStateInProgress) {
          this.#tryPushCurrentPosition(true);
        }
        this._updateViewareaTimeout = null;
      }, UPDATE_VIEWAREA_TIMEOUT);
    }
  }
  #popState({
    state
  }) {
    const newHash = getCurrentHash(),
      hashChanged = this._currentHash !== newHash;
    this._currentHash = newHash;
    if (!state) {
      this._uid++;
      const {
        hash,
        page,
        rotation
      } = this.#parseCurrentHash();
      this.#pushOrReplaceState({
        hash,
        page,
        rotation
      }, true);
      return;
    }
    if (!this.#isValidState(state)) {
      return;
    }
    this._popStateInProgress = true;
    if (hashChanged) {
      this._blockHashChange++;
      waitOnEventOrTimeout({
        target: window,
        name: "hashchange",
        delay: HASH_CHANGE_TIMEOUT
      }).then(() => {
        this._blockHashChange--;
      });
    }
    const destination = state.destination;
    this.#updateInternalState(destination, state.uid, true);
    if (isValidRotation(destination.rotation)) {
      this.linkService.rotation = destination.rotation;
    }
    if (destination.dest) {
      this.linkService.goToDestination(destination.dest);
    } else if (destination.hash) {
      this.linkService.setHash(destination.hash);
    } else if (destination.page) {
      this.linkService.page = destination.page;
    }
    Promise.resolve().then(() => {
      this._popStateInProgress = false;
    });
  }
  #pageHide() {
    if (!this._destination || this._destination.temporary) {
      this.#tryPushCurrentPosition();
    }
  }
  #bindEvents() {
    if (this.#eventAbortController) {
      return;
    }
    this.#eventAbortController = new AbortController();
    const {
      signal
    } = this.#eventAbortController;
    this.eventBus._on("updateviewarea", this.#updateViewarea.bind(this), {
      signal
    });
    window.addEventListener("popstate", this.#popState.bind(this), {
      signal
    });
    window.addEventListener("pagehide", this.#pageHide.bind(this), {
      signal
    });
  }
  #unbindEvents() {
    this.#eventAbortController?.abort();
    this.#eventAbortController = null;
  }
}
function isDestHashesEqual(destHash, pushHash) {
  if (typeof destHash !== "string" || typeof pushHash !== "string") {
    return false;
  }
  if (destHash === pushHash) {
    return true;
  }
  const nameddest = parseQueryString(destHash).get("nameddest");
  if (nameddest === pushHash) {
    return true;
  }
  return false;
}
function isDestArraysEqual(firstDest, secondDest) {
  function isEntryEqual(first, second) {
    if (typeof first !== typeof second) {
      return false;
    }
    if (Array.isArray(first) || Array.isArray(second)) {
      return false;
    }
    if (first !== null && typeof first === "object" && second !== null) {
      if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
      }
      for (const key in first) {
        if (!isEntryEqual(first[key], second[key])) {
          return false;
        }
      }
      return true;
    }
    return first === second || Number.isNaN(first) && Number.isNaN(second);
  }
  if (!(Array.isArray(firstDest) && Array.isArray(secondDest))) {
    return false;
  }
  if (firstDest.length !== secondDest.length) {
    return false;
  }
  for (let i = 0, ii = firstDest.length; i < ii; i++) {
    if (!isEntryEqual(firstDest[i], secondDest[i])) {
      return false;
    }
  }
  return true;
}

;// ./web/pdf_layer_viewer.js

class PDFLayerViewer extends BaseTreeViewer {
  constructor(options) {
    super(options);
    this.eventBus._on("optionalcontentconfigchanged", evt => {
      this.#updateLayers(evt.promise);
    });
    this.eventBus._on("resetlayers", () => {
      this.#updateLayers();
    });
    this.eventBus._on("togglelayerstree", this._toggleAllTreeItems.bind(this));
  }
  reset() {
    super.reset();
    this._optionalContentConfig = null;
    this._optionalContentVisibility?.clear();
    this._optionalContentVisibility = null;
  }
  _dispatchEvent(layersCount) {
    this.eventBus.dispatch("layersloaded", {
      source: this,
      layersCount
    });
  }
  _bindLink(element, {
    groupId,
    input
  }) {
    const setVisibility = () => {
      const visible = input.checked;
      this._optionalContentConfig.setVisibility(groupId, visible);
      const cached = this._optionalContentVisibility.get(groupId);
      if (cached) {
        cached.visible = visible;
      }
      this.eventBus.dispatch("optionalcontentconfig", {
        source: this,
        promise: Promise.resolve(this._optionalContentConfig)
      });
    };
    element.onclick = evt => {
      if (evt.target === input) {
        setVisibility();
        return true;
      } else if (evt.target !== element) {
        return true;
      }
      input.checked = !input.checked;
      setVisibility();
      return false;
    };
  }
  _setNestedName(element, {
    name = null
  }) {
    if (typeof name === "string") {
      element.textContent = this._normalizeTextContent(name);
      return;
    }
    element.setAttribute("data-l10n-id", "pdfjs-additional-layers");
    element.style.fontStyle = "italic";
    this._l10n.translateOnce(element);
  }
  _addToggleButton(div, {
    name = null
  }) {
    super._addToggleButton(div, name === null);
  }
  _toggleAllTreeItems() {
    if (!this._optionalContentConfig) {
      return;
    }
    super._toggleAllTreeItems();
  }
  render({
    optionalContentConfig,
    pdfDocument
  }) {
    if (this._optionalContentConfig) {
      this.reset();
    }
    this._optionalContentConfig = optionalContentConfig || null;
    this._pdfDocument = pdfDocument || null;
    const groups = optionalContentConfig?.getOrder();
    if (!groups) {
      this._dispatchEvent(0);
      return;
    }
    this._optionalContentVisibility = new Map();
    const fragment = document.createDocumentFragment(),
      queue = [{
        parent: fragment,
        groups
      }];
    let layersCount = 0,
      hasAnyNesting = false;
    while (queue.length > 0) {
      const levelData = queue.shift();
      for (const groupId of levelData.groups) {
        const div = document.createElement("div");
        div.className = "treeItem";
        const element = document.createElement("a");
        div.append(element);
        if (typeof groupId === "object") {
          hasAnyNesting = true;
          this._addToggleButton(div, groupId);
          this._setNestedName(element, groupId);
          const itemsDiv = document.createElement("div");
          itemsDiv.className = "treeItems";
          div.append(itemsDiv);
          queue.push({
            parent: itemsDiv,
            groups: groupId.order
          });
        } else {
          const group = optionalContentConfig.getGroup(groupId);
          const input = document.createElement("input");
          this._bindLink(element, {
            groupId,
            input
          });
          input.type = "checkbox";
          input.checked = group.visible;
          this._optionalContentVisibility.set(groupId, {
            input,
            visible: input.checked
          });
          const label = document.createElement("label");
          label.textContent = this._normalizeTextContent(group.name);
          label.append(input);
          element.append(label);
          layersCount++;
        }
        levelData.parent.append(div);
      }
    }
    this._finishRendering(fragment, layersCount, hasAnyNesting);
  }
  async #updateLayers(promise = null) {
    if (!this._optionalContentConfig) {
      return;
    }
    const pdfDocument = this._pdfDocument;
    const optionalContentConfig = await (promise || pdfDocument.getOptionalContentConfig({
      intent: "display"
    }));
    if (pdfDocument !== this._pdfDocument) {
      return;
    }
    if (promise) {
      for (const [groupId, cached] of this._optionalContentVisibility) {
        const group = optionalContentConfig.getGroup(groupId);
        if (group && cached.visible !== group.visible) {
          cached.input.checked = cached.visible = !cached.visible;
        }
      }
      return;
    }
    this.eventBus.dispatch("optionalcontentconfig", {
      source: this,
      promise: Promise.resolve(optionalContentConfig)
    });
    this.render({
      optionalContentConfig,
      pdfDocument: this._pdfDocument
    });
  }
}

;// ./web/pdf_outline_viewer.js


class PDFOutlineViewer extends BaseTreeViewer {
  constructor(options) {
    super(options);
    this.linkService = options.linkService;
    this.downloadManager = options.downloadManager;
    this.eventBus._on("toggleoutlinetree", this._toggleAllTreeItems.bind(this));
    this.eventBus._on("currentoutlineitem", this._currentOutlineItem.bind(this));
    this.eventBus._on("pagechanging", evt => {
      this._currentPageNumber = evt.pageNumber;
    });
    this.eventBus._on("pagesloaded", evt => {
      this._isPagesLoaded = !!evt.pagesCount;
      this._currentOutlineItemCapability?.resolve(this._isPagesLoaded);
    });
    this.eventBus._on("sidebarviewchanged", evt => {
      this._sidebarView = evt.view;
    });
  }
  reset() {
    super.reset();
    this._outline = null;
    this._pageNumberToDestHashCapability = null;
    this._currentPageNumber = 1;
    this._isPagesLoaded = null;
    this._currentOutlineItemCapability?.resolve(false);
    this._currentOutlineItemCapability = null;
  }
  _dispatchEvent(outlineCount) {
    this._currentOutlineItemCapability = Promise.withResolvers();
    if (outlineCount === 0 || this._pdfDocument?.loadingParams.disableAutoFetch) {
      this._currentOutlineItemCapability.resolve(false);
    } else if (this._isPagesLoaded !== null) {
      this._currentOutlineItemCapability.resolve(this._isPagesLoaded);
    }
    this.eventBus.dispatch("outlineloaded", {
      source: this,
      outlineCount,
      currentOutlineItemPromise: this._currentOutlineItemCapability.promise
    });
  }
  _bindLink(element, {
    url,
    newWindow,
    action,
    attachment,
    dest,
    setOCGState
  }) {
    const {
      linkService
    } = this;
    if (url) {
      linkService.addLinkAttributes(element, url, newWindow);
      return;
    }
    if (action) {
      element.href = linkService.getAnchorUrl("");
      element.onclick = () => {
        linkService.executeNamedAction(action);
        return false;
      };
      return;
    }
    if (attachment) {
      element.href = linkService.getAnchorUrl("");
      element.onclick = () => {
        this.downloadManager.openOrDownloadData(attachment.content, attachment.filename);
        return false;
      };
      return;
    }
    if (setOCGState) {
      element.href = linkService.getAnchorUrl("");
      element.onclick = () => {
        linkService.executeSetOCGState(setOCGState);
        return false;
      };
      return;
    }
    element.href = linkService.getDestinationHash(dest);
    element.onclick = evt => {
      this._updateCurrentTreeItem(evt.target.parentNode);
      if (dest) {
        linkService.goToDestination(dest);
      }
      return false;
    };
  }
  _setStyles(element, {
    bold,
    italic
  }) {
    if (bold) {
      element.style.fontWeight = "bold";
    }
    if (italic) {
      element.style.fontStyle = "italic";
    }
  }
  _addToggleButton(div, {
    count,
    items
  }) {
    let hidden = false;
    if (count < 0) {
      let totalCount = items.length;
      if (totalCount > 0) {
        const queue = [...items];
        while (queue.length > 0) {
          const {
            count: nestedCount,
            items: nestedItems
          } = queue.shift();
          if (nestedCount > 0 && nestedItems.length > 0) {
            totalCount += nestedItems.length;
            queue.push(...nestedItems);
          }
        }
      }
      if (Math.abs(count) === totalCount) {
        hidden = true;
      }
    }
    super._addToggleButton(div, hidden);
  }
  _toggleAllTreeItems() {
    if (!this._outline) {
      return;
    }
    super._toggleAllTreeItems();
  }
  render({
    outline,
    pdfDocument
  }) {
    if (this._outline) {
      this.reset();
    }
    this._outline = outline || null;
    this._pdfDocument = pdfDocument || null;
    if (!outline) {
      this._dispatchEvent(0);
      return;
    }
    const fragment = document.createDocumentFragment();
    const queue = [{
      parent: fragment,
      items: outline
    }];
    let outlineCount = 0,
      hasAnyNesting = false;
    while (queue.length > 0) {
      const levelData = queue.shift();
      for (const item of levelData.items) {
        const div = document.createElement("div");
        div.className = "treeItem";
        const element = document.createElement("a");
        this._bindLink(element, item);
        this._setStyles(element, item);
        element.textContent = this._normalizeTextContent(item.title);
        div.append(element);
        if (item.items.length > 0) {
          hasAnyNesting = true;
          this._addToggleButton(div, item);
          const itemsDiv = document.createElement("div");
          itemsDiv.className = "treeItems";
          div.append(itemsDiv);
          queue.push({
            parent: itemsDiv,
            items: item.items
          });
        }
        levelData.parent.append(div);
        outlineCount++;
      }
    }
    this._finishRendering(fragment, outlineCount, hasAnyNesting);
  }
  async _currentOutlineItem() {
    if (!this._isPagesLoaded) {
      throw new Error("_currentOutlineItem: All pages have not been loaded.");
    }
    if (!this._outline || !this._pdfDocument) {
      return;
    }
    const pageNumberToDestHash = await this._getPageNumberToDestHash(this._pdfDocument);
    if (!pageNumberToDestHash) {
      return;
    }
    this._updateCurrentTreeItem(null);
    if (this._sidebarView !== SidebarView.OUTLINE) {
      return;
    }
    for (let i = this._currentPageNumber; i > 0; i--) {
      const destHash = pageNumberToDestHash.get(i);
      if (!destHash) {
        continue;
      }
      const linkElement = this.container.querySelector(`a[href="${destHash}"]`);
      if (!linkElement) {
        continue;
      }
      this._scrollToCurrentTreeItem(linkElement.parentNode);
      break;
    }
  }
  async _getPageNumberToDestHash(pdfDocument) {
    if (this._pageNumberToDestHashCapability) {
      return this._pageNumberToDestHashCapability.promise;
    }
    this._pageNumberToDestHashCapability = Promise.withResolvers();
    const pageNumberToDestHash = new Map(),
      pageNumberNesting = new Map();
    const queue = [{
      nesting: 0,
      items: this._outline
    }];
    while (queue.length > 0) {
      const levelData = queue.shift(),
        currentNesting = levelData.nesting;
      for (const {
        dest,
        items
      } of levelData.items) {
        let explicitDest, pageNumber;
        if (typeof dest === "string") {
          explicitDest = await pdfDocument.getDestination(dest);
          if (pdfDocument !== this._pdfDocument) {
            return null;
          }
        } else {
          explicitDest = dest;
        }
        if (Array.isArray(explicitDest)) {
          const [destRef] = explicitDest;
          if (destRef && typeof destRef === "object") {
            pageNumber = pdfDocument.cachedPageNumber(destRef);
          } else if (Number.isInteger(destRef)) {
            pageNumber = destRef + 1;
          }
          if (Number.isInteger(pageNumber) && (!pageNumberToDestHash.has(pageNumber) || currentNesting > pageNumberNesting.get(pageNumber))) {
            const destHash = this.linkService.getDestinationHash(dest);
            pageNumberToDestHash.set(pageNumber, destHash);
            pageNumberNesting.set(pageNumber, currentNesting);
          }
        }
        if (items.length > 0) {
          queue.push({
            nesting: currentNesting + 1,
            items
          });
        }
      }
    }
    this._pageNumberToDestHashCapability.resolve(pageNumberToDestHash.size > 0 ? pageNumberToDestHash : null);
    return this._pageNumberToDestHashCapability.promise;
  }
}

;// ./web/pdf_presentation_mode.js


const DELAY_BEFORE_HIDING_CONTROLS = 3000;
const ACTIVE_SELECTOR = "pdfPresentationMode";
const CONTROLS_SELECTOR = "pdfPresentationModeControls";
const MOUSE_SCROLL_COOLDOWN_TIME = 50;
const PAGE_SWITCH_THRESHOLD = 0.1;
const SWIPE_MIN_DISTANCE_THRESHOLD = 50;
const SWIPE_ANGLE_THRESHOLD = Math.PI / 6;
class PDFPresentationMode {
  #state = PresentationModeState.UNKNOWN;
  #args = null;
  #fullscreenChangeAbortController = null;
  #windowAbortController = null;
  constructor({
    container,
    pdfViewer,
    eventBus
  }) {
    this.container = container;
    this.pdfViewer = pdfViewer;
    this.eventBus = eventBus;
    this.contextMenuOpen = false;
    this.mouseScrollTimeStamp = 0;
    this.mouseScrollDelta = 0;
    this.touchSwipeState = null;
  }
  async request() {
    const {
      container,
      pdfViewer
    } = this;
    if (this.active || !pdfViewer.pagesCount || !container.requestFullscreen) {
      return false;
    }
    this.#addFullscreenChangeListeners();
    this.#notifyStateChange(PresentationModeState.CHANGING);
    const promise = container.requestFullscreen();
    this.#args = {
      pageNumber: pdfViewer.currentPageNumber,
      scaleValue: pdfViewer.currentScaleValue,
      scrollMode: pdfViewer.scrollMode,
      spreadMode: null,
      annotationEditorMode: null
    };
    if (pdfViewer.spreadMode !== SpreadMode.NONE && !(pdfViewer.pageViewsReady && pdfViewer.hasEqualPageSizes)) {
      console.warn("Ignoring Spread modes when entering PresentationMode, " + "since the document may contain varying page sizes.");
      this.#args.spreadMode = pdfViewer.spreadMode;
    }
    if (pdfViewer.annotationEditorMode !== AnnotationEditorType.DISABLE) {
      this.#args.annotationEditorMode = pdfViewer.annotationEditorMode;
    }
    try {
      await promise;
      pdfViewer.focus();
      return true;
    } catch {
      this.#removeFullscreenChangeListeners();
      this.#notifyStateChange(PresentationModeState.NORMAL);
    }
    return false;
  }
  get active() {
    return this.#state === PresentationModeState.CHANGING || this.#state === PresentationModeState.FULLSCREEN;
  }
  #mouseWheel(evt) {
    if (!this.active) {
      return;
    }
    evt.preventDefault();
    const delta = normalizeWheelEventDelta(evt);
    const currentTime = Date.now();
    const storedTime = this.mouseScrollTimeStamp;
    if (currentTime > storedTime && currentTime - storedTime < MOUSE_SCROLL_COOLDOWN_TIME) {
      return;
    }
    if (this.mouseScrollDelta > 0 && delta < 0 || this.mouseScrollDelta < 0 && delta > 0) {
      this.#resetMouseScrollState();
    }
    this.mouseScrollDelta += delta;
    if (Math.abs(this.mouseScrollDelta) >= PAGE_SWITCH_THRESHOLD) {
      const totalDelta = this.mouseScrollDelta;
      this.#resetMouseScrollState();
      const success = totalDelta > 0 ? this.pdfViewer.previousPage() : this.pdfViewer.nextPage();
      if (success) {
        this.mouseScrollTimeStamp = currentTime;
      }
    }
  }
  #notifyStateChange(state) {
    this.#state = state;
    this.eventBus.dispatch("presentationmodechanged", {
      source: this,
      state
    });
  }
  #enter() {
    this.#notifyStateChange(PresentationModeState.FULLSCREEN);
    this.container.classList.add(ACTIVE_SELECTOR);
    setTimeout(() => {
      this.pdfViewer.scrollMode = ScrollMode.PAGE;
      if (this.#args.spreadMode !== null) {
        this.pdfViewer.spreadMode = SpreadMode.NONE;
      }
      this.pdfViewer.currentPageNumber = this.#args.pageNumber;
      this.pdfViewer.currentScaleValue = "page-fit";
      if (this.#args.annotationEditorMode !== null) {
        this.pdfViewer.annotationEditorMode = {
          mode: AnnotationEditorType.NONE
        };
      }
    }, 0);
    this.#addWindowListeners();
    this.#showControls();
    this.contextMenuOpen = false;
    document.getSelection().empty();
  }
  #exit() {
    const pageNumber = this.pdfViewer.currentPageNumber;
    this.container.classList.remove(ACTIVE_SELECTOR);
    setTimeout(() => {
      this.#removeFullscreenChangeListeners();
      this.#notifyStateChange(PresentationModeState.NORMAL);
      this.pdfViewer.scrollMode = this.#args.scrollMode;
      if (this.#args.spreadMode !== null) {
        this.pdfViewer.spreadMode = this.#args.spreadMode;
      }
      this.pdfViewer.currentScaleValue = this.#args.scaleValue;
      this.pdfViewer.currentPageNumber = pageNumber;
      if (this.#args.annotationEditorMode !== null) {
        this.pdfViewer.annotationEditorMode = {
          mode: this.#args.annotationEditorMode
        };
      }
      this.#args = null;
    }, 0);
    this.#removeWindowListeners();
    this.#hideControls();
    this.#resetMouseScrollState();
    this.contextMenuOpen = false;
  }
  #mouseDown(evt) {
    if (this.contextMenuOpen) {
      this.contextMenuOpen = false;
      evt.preventDefault();
      return;
    }
    if (evt.button !== 0) {
      return;
    }
    if (evt.target.href && evt.target.parentNode?.hasAttribute("data-internal-link")) {
      return;
    }
    evt.preventDefault();
    if (evt.shiftKey) {
      this.pdfViewer.previousPage();
    } else {
      this.pdfViewer.nextPage();
    }
  }
  #contextMenu() {
    this.contextMenuOpen = true;
  }
  #showControls() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    } else {
      this.container.classList.add(CONTROLS_SELECTOR);
    }
    this.controlsTimeout = setTimeout(() => {
      this.container.classList.remove(CONTROLS_SELECTOR);
      delete this.controlsTimeout;
    }, DELAY_BEFORE_HIDING_CONTROLS);
  }
  #hideControls() {
    if (!this.controlsTimeout) {
      return;
    }
    clearTimeout(this.controlsTimeout);
    this.container.classList.remove(CONTROLS_SELECTOR);
    delete this.controlsTimeout;
  }
  #resetMouseScrollState() {
    this.mouseScrollTimeStamp = 0;
    this.mouseScrollDelta = 0;
  }
  #touchSwipe(evt) {
    if (!this.active) {
      return;
    }
    if (evt.touches.length > 1) {
      this.touchSwipeState = null;
      return;
    }
    switch (evt.type) {
      case "touchstart":
        this.touchSwipeState = {
          startX: evt.touches[0].pageX,
          startY: evt.touches[0].pageY,
          endX: evt.touches[0].pageX,
          endY: evt.touches[0].pageY
        };
        break;
      case "touchmove":
        if (this.touchSwipeState === null) {
          return;
        }
        this.touchSwipeState.endX = evt.touches[0].pageX;
        this.touchSwipeState.endY = evt.touches[0].pageY;
        evt.preventDefault();
        break;
      case "touchend":
        if (this.touchSwipeState === null) {
          return;
        }
        let delta = 0;
        const dx = this.touchSwipeState.endX - this.touchSwipeState.startX;
        const dy = this.touchSwipeState.endY - this.touchSwipeState.startY;
        const absAngle = Math.abs(Math.atan2(dy, dx));
        if (Math.abs(dx) > SWIPE_MIN_DISTANCE_THRESHOLD && (absAngle <= SWIPE_ANGLE_THRESHOLD || absAngle >= Math.PI - SWIPE_ANGLE_THRESHOLD)) {
          delta = dx;
        } else if (Math.abs(dy) > SWIPE_MIN_DISTANCE_THRESHOLD && Math.abs(absAngle - Math.PI / 2) <= SWIPE_ANGLE_THRESHOLD) {
          delta = dy;
        }
        if (delta > 0) {
          this.pdfViewer.previousPage();
        } else if (delta < 0) {
          this.pdfViewer.nextPage();
        }
        break;
    }
  }
  #addWindowListeners() {
    if (this.#windowAbortController) {
      return;
    }
    this.#windowAbortController = new AbortController();
    const {
      signal
    } = this.#windowAbortController;
    const touchSwipeBind = this.#touchSwipe.bind(this);
    window.addEventListener("mousemove", this.#showControls.bind(this), {
      signal
    });
    window.addEventListener("mousedown", this.#mouseDown.bind(this), {
      signal
    });
    window.addEventListener("wheel", this.#mouseWheel.bind(this), {
      passive: false,
      signal
    });
    window.addEventListener("keydown", this.#resetMouseScrollState.bind(this), {
      signal
    });
    window.addEventListener("contextmenu", this.#contextMenu.bind(this), {
      signal
    });
    window.addEventListener("touchstart", touchSwipeBind, {
      signal
    });
    window.addEventListener("touchmove", touchSwipeBind, {
      signal
    });
    window.addEventListener("touchend", touchSwipeBind, {
      signal
    });
  }
  #removeWindowListeners() {
    this.#windowAbortController?.abort();
    this.#windowAbortController = null;
  }
  #addFullscreenChangeListeners() {
    if (this.#fullscreenChangeAbortController) {
      return;
    }
    this.#fullscreenChangeAbortController = new AbortController();
    window.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        this.#enter();
      } else {
        this.#exit();
      }
    }, {
      signal: this.#fullscreenChangeAbortController.signal
    });
  }
  #removeFullscreenChangeListeners() {
    this.#fullscreenChangeAbortController?.abort();
    this.#fullscreenChangeAbortController = null;
  }
}

;// ./web/xfa_layer_builder.js

class XfaLayerBuilder {
  constructor({
    pdfPage,
    annotationStorage = null,
    linkService,
    xfaHtml = null
  }) {
    this.pdfPage = pdfPage;
    this.annotationStorage = annotationStorage;
    this.linkService = linkService;
    this.xfaHtml = xfaHtml;
    this.div = null;
    this._cancelled = false;
  }
  async render(viewport, intent = "display") {
    if (intent === "print") {
      const parameters = {
        viewport: viewport.clone({
          dontFlip: true
        }),
        div: this.div,
        xfaHtml: this.xfaHtml,
        annotationStorage: this.annotationStorage,
        linkService: this.linkService,
        intent
      };
      this.div = document.createElement("div");
      parameters.div = this.div;
      return XfaLayer.render(parameters);
    }
    const xfaHtml = await this.pdfPage.getXfa();
    if (this._cancelled || !xfaHtml) {
      return {
        textDivs: []
      };
    }
    const parameters = {
      viewport: viewport.clone({
        dontFlip: true
      }),
      div: this.div,
      xfaHtml,
      annotationStorage: this.annotationStorage,
      linkService: this.linkService,
      intent
    };
    if (this.div) {
      return XfaLayer.update(parameters);
    }
    this.div = document.createElement("div");
    parameters.div = this.div;
    return XfaLayer.render(parameters);
  }
  cancel() {
    this._cancelled = true;
  }
  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
}

;// ./web/print_utils.js



function getXfaHtmlForPrinting(printContainer, pdfDocument) {
  const xfaHtml = pdfDocument.allXfaHtml;
  const linkService = new SimpleLinkService();
  const scale = Math.round(PixelsPerInch.PDF_TO_CSS_UNITS * 100) / 100;
  for (const xfaPage of xfaHtml.children) {
    const page = document.createElement("div");
    page.className = "xfaPrintedPage";
    printContainer.append(page);
    const builder = new XfaLayerBuilder({
      pdfPage: null,
      annotationStorage: pdfDocument.annotationStorage,
      linkService,
      xfaHtml: xfaPage
    });
    const viewport = getXfaPageViewport(xfaPage, {
      scale
    });
    builder.render(viewport, "print");
    page.append(builder.div);
  }
}

;// ./web/pdf_print_service.js


let activeService = null;
let dialog = null;
let overlayManager = null;
let viewerApp = {
  initialized: false
};
function renderPage(activeServiceOnEntry, pdfDocument, pageNumber, size, printResolution, optionalContentConfigPromise, printAnnotationStoragePromise) {
  const scratchCanvas = activeService.scratchCanvas;
  const PRINT_UNITS = printResolution / PixelsPerInch.PDF;
  scratchCanvas.width = Math.floor(size.width * PRINT_UNITS);
  scratchCanvas.height = Math.floor(size.height * PRINT_UNITS);
  const ctx = scratchCanvas.getContext("2d");
  ctx.save();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
  ctx.restore();
  return Promise.all([pdfDocument.getPage(pageNumber), printAnnotationStoragePromise]).then(function ([pdfPage, printAnnotationStorage]) {
    const renderContext = {
      canvasContext: ctx,
      transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
      viewport: pdfPage.getViewport({
        scale: 1,
        rotation: size.rotation
      }),
      intent: "print",
      annotationMode: AnnotationMode.ENABLE_STORAGE,
      optionalContentConfigPromise,
      printAnnotationStorage
    };
    const renderTask = pdfPage.render(renderContext);
    return renderTask.promise.catch(reason => {
      if (!(reason instanceof RenderingCancelledException)) {
        console.error(reason);
      }
      throw reason;
    });
  });
}
class PDFPrintService {
  constructor({
    pdfDocument,
    pagesOverview,
    printContainer,
    printResolution,
    printAnnotationStoragePromise = null
  }) {
    this.pdfDocument = pdfDocument;
    this.pagesOverview = pagesOverview;
    this.printContainer = printContainer;
    this._printResolution = printResolution || 150;
    this._optionalContentConfigPromise = pdfDocument.getOptionalContentConfig({
      intent: "print"
    });
    this._printAnnotationStoragePromise = printAnnotationStoragePromise || Promise.resolve();
    this.currentPage = -1;
    this.scratchCanvas = document.createElement("canvas");
  }
  layout() {
    this.throwIfInactive();
    const body = document.querySelector("body");
    body.setAttribute("data-pdfjsprinting", true);
    const {
      width,
      height
    } = this.pagesOverview[0];
    const hasEqualPageSizes = this.pagesOverview.every(size => size.width === width && size.height === height);
    if (!hasEqualPageSizes) {
      console.warn("Not all pages have the same size. The printed result may be incorrect!");
    }
    this.pageStyleSheet = document.createElement("style");
    this.pageStyleSheet.textContent = `@page { size: ${width}pt ${height}pt;}`;
    body.append(this.pageStyleSheet);
  }
  destroy() {
    if (activeService !== this) {
      return;
    }
    this.printContainer.textContent = "";
    const body = document.querySelector("body");
    body.removeAttribute("data-pdfjsprinting");
    if (this.pageStyleSheet) {
      this.pageStyleSheet.remove();
      this.pageStyleSheet = null;
    }
    this.scratchCanvas.width = this.scratchCanvas.height = 0;
    this.scratchCanvas = null;
    activeService = null;
    ensureOverlay().then(function () {
      if (overlayManager.active === dialog) {
        overlayManager.close(dialog);
      }
    });
  }
  renderPages() {
    if (this.pdfDocument.isPureXfa) {
      getXfaHtmlForPrinting(this.printContainer, this.pdfDocument);
      return Promise.resolve();
    }
    const pageCount = this.pagesOverview.length;
    const renderNextPage = (resolve, reject) => {
      this.throwIfInactive();
      if (++this.currentPage >= pageCount) {
        renderProgress(pageCount, pageCount);
        resolve();
        return;
      }
      const index = this.currentPage;
      renderProgress(index, pageCount);
      renderPage(this, this.pdfDocument, index + 1, this.pagesOverview[index], this._printResolution, this._optionalContentConfigPromise, this._printAnnotationStoragePromise).then(this.useRenderedPage.bind(this)).then(function () {
        renderNextPage(resolve, reject);
      }, reject);
    };
    return new Promise(renderNextPage);
  }
  useRenderedPage() {
    this.throwIfInactive();
    const img = document.createElement("img");
    this.scratchCanvas.toBlob(blob => {
      img.src = URL.createObjectURL(blob);
    });
    const wrapper = document.createElement("div");
    wrapper.className = "printedPage";
    wrapper.append(img);
    this.printContainer.append(wrapper);
    const {
      promise,
      resolve,
      reject
    } = Promise.withResolvers();
    img.onload = resolve;
    img.onerror = reject;
    promise.catch(() => {}).then(() => {
      URL.revokeObjectURL(img.src);
    });
    return promise;
  }
  performPrint() {
    this.throwIfInactive();
    return new Promise(resolve => {
      setTimeout(() => {
        if (!this.active) {
          resolve();
          return;
        }
        print.call(window);
        setTimeout(resolve, 20);
      }, 0);
    });
  }
  get active() {
    return this === activeService;
  }
  throwIfInactive() {
    if (!this.active) {
      throw new Error("This print request was cancelled or completed.");
    }
  }
}
const print = window.print;
window.print = function () {
  if (activeService) {
    console.warn("Ignored window.print() because of a pending print job.");
    return;
  }
  ensureOverlay().then(function () {
    if (activeService) {
      overlayManager.open(dialog);
    }
  });
  try {
    dispatchEvent("beforeprint");
  } finally {
    if (!activeService) {
      console.error("Expected print service to be initialized.");
      ensureOverlay().then(function () {
        if (overlayManager.active === dialog) {
          overlayManager.close(dialog);
        }
      });
      return;
    }
    const activeServiceOnEntry = activeService;
    activeService.renderPages().then(function () {
      return activeServiceOnEntry.performPrint();
    }).catch(function () {}).then(function () {
      if (activeServiceOnEntry.active) {
        abort();
      }
    });
  }
};
function dispatchEvent(eventType) {
  const event = new CustomEvent(eventType, {
    bubbles: false,
    cancelable: false,
    detail: "custom"
  });
  window.dispatchEvent(event);
}
function abort() {
  if (activeService) {
    activeService.destroy();
    dispatchEvent("afterprint");
  }
}
function renderProgress(index, total) {
  dialog ||= document.getElementById("printServiceDialog");
  const progress = Math.round(100 * index / total);
  const progressBar = dialog.querySelector("progress");
  const progressPerc = dialog.querySelector(".relative-progress");
  progressBar.value = progress;
  progressPerc.setAttribute("data-l10n-args", JSON.stringify({
    progress
  }));
}
window.addEventListener("keydown", function (event) {
  if (event.keyCode === 80 && (event.ctrlKey || event.metaKey) && !event.altKey && (!event.shiftKey || window.chrome || window.opera)) {
    window.print();
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
if ("onbeforeprint" in window) {
  const stopPropagationIfNeeded = function (event) {
    if (event.detail !== "custom") {
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("beforeprint", stopPropagationIfNeeded);
  window.addEventListener("afterprint", stopPropagationIfNeeded);
}
let overlayPromise;
function ensureOverlay() {
  if (!overlayPromise) {
    overlayManager = viewerApp.overlayManager;
    if (!overlayManager) {
      throw new Error("The overlay manager has not yet been initialized.");
    }
    dialog ||= document.getElementById("printServiceDialog");
    overlayPromise = overlayManager.register(dialog, true);
    document.getElementById("printCancel").onclick = abort;
    dialog.addEventListener("close", abort);
  }
  return overlayPromise;
}
class PDFPrintServiceFactory {
  static initGlobals(app) {
    viewerApp = app;
  }
  static get supportsPrinting() {
    return shadow(this, "supportsPrinting", true);
  }
  static createPrintService(params) {
    if (activeService) {
      throw new Error("The print service is created and active.");
    }
    return activeService = new PDFPrintService(params);
  }
}

;// ./web/pdf_rendering_queue.js


const CLEANUP_TIMEOUT = 30000;
class PDFRenderingQueue {
  constructor() {
    this.pdfViewer = null;
    this.pdfThumbnailViewer = null;
    this.onIdle = null;
    this.highestPriorityPage = null;
    this.idleTimeout = null;
    this.printing = false;
    this.isThumbnailViewEnabled = false;
    Object.defineProperty(this, "hasViewer", {
      value: () => !!this.pdfViewer
    });
  }
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  setThumbnailViewer(pdfThumbnailViewer) {
    this.pdfThumbnailViewer = pdfThumbnailViewer;
  }
  isHighestPriority(view) {
    return this.highestPriorityPage === view.renderingId;
  }
  renderHighestPriority(currentlyVisiblePages) {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
      return;
    }
    if (this.isThumbnailViewEnabled && this.pdfThumbnailViewer?.forceRendering()) {
      return;
    }
    if (this.printing) {
      return;
    }
    if (this.onIdle) {
      this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT);
    }
  }
  getHighestPriority(visible, views, scrolledDown, preRenderExtra = false) {
    const visibleViews = visible.views,
      numVisible = visibleViews.length;
    if (numVisible === 0) {
      return null;
    }
    for (let i = 0; i < numVisible; i++) {
      const view = visibleViews[i].view;
      if (!this.isViewFinished(view)) {
        return view;
      }
    }
    const firstId = visible.first.id,
      lastId = visible.last.id;
    if (lastId - firstId + 1 > numVisible) {
      const visibleIds = visible.ids;
      for (let i = 1, ii = lastId - firstId; i < ii; i++) {
        const holeId = scrolledDown ? firstId + i : lastId - i;
        if (visibleIds.has(holeId)) {
          continue;
        }
        const holeView = views[holeId - 1];
        if (!this.isViewFinished(holeView)) {
          return holeView;
        }
      }
    }
    let preRenderIndex = scrolledDown ? lastId : firstId - 2;
    let preRenderView = views[preRenderIndex];
    if (preRenderView && !this.isViewFinished(preRenderView)) {
      return preRenderView;
    }
    if (preRenderExtra) {
      preRenderIndex += scrolledDown ? 1 : -1;
      preRenderView = views[preRenderIndex];
      if (preRenderView && !this.isViewFinished(preRenderView)) {
        return preRenderView;
      }
    }
    return null;
  }
  isViewFinished(view) {
    return view.renderingState === RenderingStates.FINISHED;
  }
  renderView(view) {
    switch (view.renderingState) {
      case RenderingStates.FINISHED:
        return false;
      case RenderingStates.PAUSED:
        this.highestPriorityPage = view.renderingId;
        view.resume();
        break;
      case RenderingStates.RUNNING:
        this.highestPriorityPage = view.renderingId;
        break;
      case RenderingStates.INITIAL:
        this.highestPriorityPage = view.renderingId;
        view.draw().finally(() => {
          this.renderHighestPriority();
        }).catch(reason => {
          if (reason instanceof RenderingCancelledException) {
            return;
          }
          console.error(`renderView: "${reason}"`);
        });
        break;
    }
    return true;
  }
}

;// ./web/pdf_scripting_manager.js


class PDFScriptingManager {
  #closeCapability = null;
  #destroyCapability = null;
  #docProperties = null;
  #eventAbortController = null;
  #eventBus = null;
  #externalServices = null;
  #pdfDocument = null;
  #pdfViewer = null;
  #ready = false;
  #scripting = null;
  #willPrintCapability = null;
  constructor({
    eventBus,
    externalServices = null,
    docProperties = null
  }) {
    this.#eventBus = eventBus;
    this.#externalServices = externalServices;
    this.#docProperties = docProperties;
  }
  setViewer(pdfViewer) {
    this.#pdfViewer = pdfViewer;
  }
  async setDocument(pdfDocument) {
    if (this.#pdfDocument) {
      await this.#destroyScripting();
    }
    this.#pdfDocument = pdfDocument;
    if (!pdfDocument) {
      return;
    }
    const [objects, calculationOrder, docActions] = await Promise.all([pdfDocument.getFieldObjects(), pdfDocument.getCalculationOrderIds(), pdfDocument.getJSActions()]);
    if (!objects && !docActions) {
      await this.#destroyScripting();
      return;
    }
    if (pdfDocument !== this.#pdfDocument) {
      return;
    }
    try {
      this.#scripting = this.#initScripting();
    } catch (error) {
      console.error(`setDocument: "${error.message}".`);
      await this.#destroyScripting();
      return;
    }
    const eventBus = this.#eventBus;
    this.#eventAbortController = new AbortController();
    const {
      signal
    } = this.#eventAbortController;
    eventBus._on("updatefromsandbox", event => {
      if (event?.source === window) {
        this.#updateFromSandbox(event.detail);
      }
    }, {
      signal
    });
    eventBus._on("dispatcheventinsandbox", event => {
      this.#scripting?.dispatchEventInSandbox(event.detail);
    }, {
      signal
    });
    eventBus._on("pagechanging", ({
      pageNumber,
      previous
    }) => {
      if (pageNumber === previous) {
        return;
      }
      this.#dispatchPageClose(previous);
      this.#dispatchPageOpen(pageNumber);
    }, {
      signal
    });
    eventBus._on("pagerendered", ({
      pageNumber
    }) => {
      if (!this._pageOpenPending.has(pageNumber)) {
        return;
      }
      if (pageNumber !== this.#pdfViewer.currentPageNumber) {
        return;
      }
      this.#dispatchPageOpen(pageNumber);
    }, {
      signal
    });
    eventBus._on("pagesdestroy", async () => {
      await this.#dispatchPageClose(this.#pdfViewer.currentPageNumber);
      await this.#scripting?.dispatchEventInSandbox({
        id: "doc",
        name: "WillClose"
      });
      this.#closeCapability?.resolve();
    }, {
      signal
    });
    try {
      const docProperties = await this.#docProperties(pdfDocument);
      if (pdfDocument !== this.#pdfDocument) {
        return;
      }
      await this.#scripting.createSandbox({
        objects,
        calculationOrder,
        appInfo: {
          platform: navigator.platform,
          language: navigator.language
        },
        docInfo: {
          ...docProperties,
          actions: docActions
        }
      });
      eventBus.dispatch("sandboxcreated", {
        source: this
      });
    } catch (error) {
      console.error(`setDocument: "${error.message}".`);
      await this.#destroyScripting();
      return;
    }
    await this.#scripting?.dispatchEventInSandbox({
      id: "doc",
      name: "Open"
    });
    await this.#dispatchPageOpen(this.#pdfViewer.currentPageNumber, true);
    Promise.resolve().then(() => {
      if (pdfDocument === this.#pdfDocument) {
        this.#ready = true;
      }
    });
  }
  async dispatchWillSave() {
    return this.#scripting?.dispatchEventInSandbox({
      id: "doc",
      name: "WillSave"
    });
  }
  async dispatchDidSave() {
    return this.#scripting?.dispatchEventInSandbox({
      id: "doc",
      name: "DidSave"
    });
  }
  async dispatchWillPrint() {
    if (!this.#scripting) {
      return;
    }
    await this.#willPrintCapability?.promise;
    this.#willPrintCapability = Promise.withResolvers();
    try {
      await this.#scripting.dispatchEventInSandbox({
        id: "doc",
        name: "WillPrint"
      });
    } catch (ex) {
      this.#willPrintCapability.resolve();
      this.#willPrintCapability = null;
      throw ex;
    }
    await this.#willPrintCapability.promise;
  }
  async dispatchDidPrint() {
    return this.#scripting?.dispatchEventInSandbox({
      id: "doc",
      name: "DidPrint"
    });
  }
  get destroyPromise() {
    return this.#destroyCapability?.promise || null;
  }
  get ready() {
    return this.#ready;
  }
  get _pageOpenPending() {
    return shadow(this, "_pageOpenPending", new Set());
  }
  get _visitedPages() {
    return shadow(this, "_visitedPages", new Map());
  }
  async #updateFromSandbox(detail) {
    const pdfViewer = this.#pdfViewer;
    const isInPresentationMode = pdfViewer.isInPresentationMode || pdfViewer.isChangingPresentationMode;
    const {
      id,
      siblings,
      command,
      value
    } = detail;
    if (!id) {
      switch (command) {
        case "clear":
          console.clear();
          break;
        case "error":
          console.error(value);
          break;
        case "layout":
          if (!isInPresentationMode) {
            const modes = apiPageLayoutToViewerModes(value);
            pdfViewer.spreadMode = modes.spreadMode;
          }
          break;
        case "page-num":
          pdfViewer.currentPageNumber = value + 1;
          break;
        case "print":
          await pdfViewer.pagesPromise;
          this.#eventBus.dispatch("print", {
            source: this
          });
          break;
        case "println":
          console.log(value);
          break;
        case "zoom":
          if (!isInPresentationMode) {
            pdfViewer.currentScaleValue = value;
          }
          break;
        case "SaveAs":
          this.#eventBus.dispatch("download", {
            source: this
          });
          break;
        case "FirstPage":
          pdfViewer.currentPageNumber = 1;
          break;
        case "LastPage":
          pdfViewer.currentPageNumber = pdfViewer.pagesCount;
          break;
        case "NextPage":
          pdfViewer.nextPage();
          break;
        case "PrevPage":
          pdfViewer.previousPage();
          break;
        case "ZoomViewIn":
          if (!isInPresentationMode) {
            pdfViewer.increaseScale();
          }
          break;
        case "ZoomViewOut":
          if (!isInPresentationMode) {
            pdfViewer.decreaseScale();
          }
          break;
        case "WillPrintFinished":
          this.#willPrintCapability?.resolve();
          this.#willPrintCapability = null;
          break;
      }
      return;
    }
    if (isInPresentationMode && detail.focus) {
      return;
    }
    delete detail.id;
    delete detail.siblings;
    const ids = siblings ? [id, ...siblings] : [id];
    for (const elementId of ids) {
      const element = document.querySelector(`[data-element-id="${elementId}"]`);
      if (element) {
        element.dispatchEvent(new CustomEvent("updatefromsandbox", {
          detail
        }));
      } else {
        this.#pdfDocument?.annotationStorage.setValue(elementId, detail);
      }
    }
  }
  async #dispatchPageOpen(pageNumber, initialize = false) {
    const pdfDocument = this.#pdfDocument,
      visitedPages = this._visitedPages;
    if (initialize) {
      this.#closeCapability = Promise.withResolvers();
    }
    if (!this.#closeCapability) {
      return;
    }
    const pageView = this.#pdfViewer.getPageView(pageNumber - 1);
    if (pageView?.renderingState !== RenderingStates.FINISHED) {
      this._pageOpenPending.add(pageNumber);
      return;
    }
    this._pageOpenPending.delete(pageNumber);
    const actionsPromise = (async () => {
      const actions = await (!visitedPages.has(pageNumber) ? pageView.pdfPage?.getJSActions() : null);
      if (pdfDocument !== this.#pdfDocument) {
        return;
      }
      await this.#scripting?.dispatchEventInSandbox({
        id: "page",
        name: "PageOpen",
        pageNumber,
        actions
      });
    })();
    visitedPages.set(pageNumber, actionsPromise);
  }
  async #dispatchPageClose(pageNumber) {
    const pdfDocument = this.#pdfDocument,
      visitedPages = this._visitedPages;
    if (!this.#closeCapability) {
      return;
    }
    if (this._pageOpenPending.has(pageNumber)) {
      return;
    }
    const actionsPromise = visitedPages.get(pageNumber);
    if (!actionsPromise) {
      return;
    }
    visitedPages.set(pageNumber, null);
    await actionsPromise;
    if (pdfDocument !== this.#pdfDocument) {
      return;
    }
    await this.#scripting?.dispatchEventInSandbox({
      id: "page",
      name: "PageClose",
      pageNumber
    });
  }
  #initScripting() {
    this.#destroyCapability = Promise.withResolvers();
    if (this.#scripting) {
      throw new Error("#initScripting: Scripting already exists.");
    }
    return this.#externalServices.createScripting();
  }
  async #destroyScripting() {
    if (!this.#scripting) {
      this.#pdfDocument = null;
      this.#destroyCapability?.resolve();
      return;
    }
    if (this.#closeCapability) {
      await Promise.race([this.#closeCapability.promise, new Promise(resolve => {
        setTimeout(resolve, 1000);
      })]).catch(() => {});
      this.#closeCapability = null;
    }
    this.#pdfDocument = null;
    try {
      await this.#scripting.destroySandbox();
    } catch {}
    this.#willPrintCapability?.reject(new Error("Scripting destroyed."));
    this.#willPrintCapability = null;
    this.#eventAbortController?.abort();
    this.#eventAbortController = null;
    this._pageOpenPending.clear();
    this._visitedPages.clear();
    this.#scripting = null;
    this.#ready = false;
    this.#destroyCapability?.resolve();
  }
}

;// ./web/pdf_sidebar.js

const SIDEBAR_WIDTH_VAR = "--sidebar-width";
const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_RESIZING_CLASS = "sidebarResizing";
const UI_NOTIFICATION_CLASS = "pdfSidebarNotification";
class PDFSidebar {
  #isRTL = false;
  #mouseAC = null;
  #outerContainerWidth = null;
  #width = null;
  constructor({
    elements,
    eventBus,
    l10n
  }) {
    this.isOpen = false;
    this.active = SidebarView.THUMBS;
    this.isInitialViewSet = false;
    this.isInitialEventDispatched = false;
    this.onToggled = null;
    this.onUpdateThumbnails = null;
    this.outerContainer = elements.outerContainer;
    this.sidebarContainer = elements.sidebarContainer;
    this.toggleButton = elements.toggleButton;
    this.resizer = elements.resizer;
    this.thumbnailButton = elements.thumbnailButton;
    this.outlineButton = elements.outlineButton;
    this.attachmentsButton = elements.attachmentsButton;
    this.layersButton = elements.layersButton;
    this.thumbnailView = elements.thumbnailView;
    this.outlineView = elements.outlineView;
    this.attachmentsView = elements.attachmentsView;
    this.layersView = elements.layersView;
    this._currentOutlineItemButton = elements.currentOutlineItemButton;
    this.eventBus = eventBus;
    this.#isRTL = l10n.getDirection() === "rtl";
    this.#addEventListeners();
  }
  reset() {
    this.isInitialViewSet = false;
    this.isInitialEventDispatched = false;
    this.#hideUINotification(true);
    this.switchView(SidebarView.THUMBS);
    this.outlineButton.disabled = false;
    this.attachmentsButton.disabled = false;
    this.layersButton.disabled = false;
    this._currentOutlineItemButton.disabled = true;
  }
  get visibleView() {
    return this.isOpen ? this.active : SidebarView.NONE;
  }
  setInitialView(view = SidebarView.NONE) {
    if (this.isInitialViewSet) {
      return;
    }
    this.isInitialViewSet = true;
    if (view === SidebarView.NONE || view === SidebarView.UNKNOWN) {
      this.#dispatchEvent();
      return;
    }
    this.switchView(view, true);
    if (!this.isInitialEventDispatched) {
      this.#dispatchEvent();
    }
  }
  switchView(view, forceOpen = false) {
    const isViewChanged = view !== this.active;
    let forceRendering = false;
    switch (view) {
      case SidebarView.NONE:
        if (this.isOpen) {
          this.close();
        }
        return;
      case SidebarView.THUMBS:
        if (this.isOpen && isViewChanged) {
          forceRendering = true;
        }
        break;
      case SidebarView.OUTLINE:
        if (this.outlineButton.disabled) {
          return;
        }
        break;
      case SidebarView.ATTACHMENTS:
        if (this.attachmentsButton.disabled) {
          return;
        }
        break;
      case SidebarView.LAYERS:
        if (this.layersButton.disabled) {
          return;
        }
        break;
      default:
        console.error(`PDFSidebar.switchView: "${view}" is not a valid view.`);
        return;
    }
    this.active = view;
    toggleCheckedBtn(this.thumbnailButton, view === SidebarView.THUMBS, this.thumbnailView);
    toggleCheckedBtn(this.outlineButton, view === SidebarView.OUTLINE, this.outlineView);
    toggleCheckedBtn(this.attachmentsButton, view === SidebarView.ATTACHMENTS, this.attachmentsView);
    toggleCheckedBtn(this.layersButton, view === SidebarView.LAYERS, this.layersView);
    if (forceOpen && !this.isOpen) {
      this.open();
      return;
    }
    if (forceRendering) {
      this.onUpdateThumbnails();
      this.onToggled();
    }
    if (isViewChanged) {
      this.#dispatchEvent();
    }
  }
  open() {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    toggleExpandedBtn(this.toggleButton, true);
    this.outerContainer.classList.add("sidebarMoving", "sidebarOpen");
    if (this.active === SidebarView.THUMBS) {
      this.onUpdateThumbnails();
    }
    this.onToggled();
    this.#dispatchEvent();
    this.#hideUINotification();
  }
  close(evt = null) {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    toggleExpandedBtn(this.toggleButton, false);
    this.outerContainer.classList.add("sidebarMoving");
    this.outerContainer.classList.remove("sidebarOpen");
    this.onToggled();
    this.#dispatchEvent();
    if (evt?.detail > 0) {
      this.toggleButton.blur();
    }
  }
  toggle(evt = null) {
    if (this.isOpen) {
      this.close(evt);
    } else {
      this.open();
    }
  }
  #dispatchEvent() {
    if (this.isInitialViewSet) {
      this.isInitialEventDispatched ||= true;
    }
    this.eventBus.dispatch("sidebarviewchanged", {
      source: this,
      view: this.visibleView
    });
  }
  #showUINotification() {
    this.toggleButton.setAttribute("data-l10n-id", "pdfjs-toggle-sidebar-notification-button");
    if (!this.isOpen) {
      this.toggleButton.classList.add(UI_NOTIFICATION_CLASS);
    }
  }
  #hideUINotification(reset = false) {
    if (this.isOpen || reset) {
      this.toggleButton.classList.remove(UI_NOTIFICATION_CLASS);
    }
    if (reset) {
      this.toggleButton.setAttribute("data-l10n-id", "pdfjs-toggle-sidebar-button");
    }
  }
  #addEventListeners() {
    const {
      eventBus,
      outerContainer
    } = this;
    this.sidebarContainer.addEventListener("transitionend", evt => {
      if (evt.target === this.sidebarContainer) {
        outerContainer.classList.remove("sidebarMoving");
        eventBus.dispatch("resize", {
          source: this
        });
      }
    });
    this.toggleButton.addEventListener("click", evt => {
      this.toggle(evt);
    });
    this.thumbnailButton.addEventListener("click", () => {
      this.switchView(SidebarView.THUMBS);
    });
    this.outlineButton.addEventListener("click", () => {
      this.switchView(SidebarView.OUTLINE);
    });
    this.outlineButton.addEventListener("dblclick", () => {
      eventBus.dispatch("toggleoutlinetree", {
        source: this
      });
    });
    this.attachmentsButton.addEventListener("click", () => {
      this.switchView(SidebarView.ATTACHMENTS);
    });
    this.layersButton.addEventListener("click", () => {
      this.switchView(SidebarView.LAYERS);
    });
    this.layersButton.addEventListener("dblclick", () => {
      eventBus.dispatch("resetlayers", {
        source: this
      });
    });
    this._currentOutlineItemButton.addEventListener("click", () => {
      eventBus.dispatch("currentoutlineitem", {
        source: this
      });
    });
    const onTreeLoaded = (count, button, view) => {
      button.disabled = !count;
      if (count) {
        this.#showUINotification();
      } else if (this.active === view) {
        this.switchView(SidebarView.THUMBS);
      }
    };
    eventBus._on("outlineloaded", evt => {
      onTreeLoaded(evt.outlineCount, this.outlineButton, SidebarView.OUTLINE);
      evt.currentOutlineItemPromise.then(enabled => {
        if (!this.isInitialViewSet) {
          return;
        }
        this._currentOutlineItemButton.disabled = !enabled;
      });
    });
    eventBus._on("attachmentsloaded", evt => {
      onTreeLoaded(evt.attachmentsCount, this.attachmentsButton, SidebarView.ATTACHMENTS);
    });
    eventBus._on("layersloaded", evt => {
      onTreeLoaded(evt.layersCount, this.layersButton, SidebarView.LAYERS);
    });
    eventBus._on("presentationmodechanged", evt => {
      if (evt.state === PresentationModeState.NORMAL && this.visibleView === SidebarView.THUMBS) {
        this.onUpdateThumbnails();
      }
    });
    this.resizer.addEventListener("mousedown", evt => {
      if (evt.button !== 0) {
        return;
      }
      outerContainer.classList.add(SIDEBAR_RESIZING_CLASS);
      this.#mouseAC = new AbortController();
      const opts = {
        signal: this.#mouseAC.signal
      };
      window.addEventListener("mousemove", this.#mouseMove.bind(this), opts);
      window.addEventListener("mouseup", this.#mouseUp.bind(this), opts);
      window.addEventListener("blur", this.#mouseUp.bind(this), opts);
    });
    eventBus._on("resize", evt => {
      if (evt.source !== window) {
        return;
      }
      this.#outerContainerWidth = null;
      if (!this.#width) {
        return;
      }
      if (!this.isOpen) {
        this.#updateWidth(this.#width);
        return;
      }
      outerContainer.classList.add(SIDEBAR_RESIZING_CLASS);
      const updated = this.#updateWidth(this.#width);
      Promise.resolve().then(() => {
        outerContainer.classList.remove(SIDEBAR_RESIZING_CLASS);
        if (updated) {
          eventBus.dispatch("resize", {
            source: this
          });
        }
      });
    });
  }
  get outerContainerWidth() {
    return this.#outerContainerWidth ||= this.outerContainer.clientWidth;
  }
  #updateWidth(width = 0) {
    const maxWidth = Math.floor(this.outerContainerWidth / 2);
    if (width > maxWidth) {
      width = maxWidth;
    }
    if (width < SIDEBAR_MIN_WIDTH) {
      width = SIDEBAR_MIN_WIDTH;
    }
    if (width === this.#width) {
      return false;
    }
    this.#width = width;
    docStyle.setProperty(SIDEBAR_WIDTH_VAR, `${width}px`);
    return true;
  }
  #mouseMove(evt) {
    let width = evt.clientX;
    if (this.#isRTL) {
      width = this.outerContainerWidth - width;
    }
    this.#updateWidth(width);
  }
  #mouseUp(evt) {
    this.outerContainer.classList.remove(SIDEBAR_RESIZING_CLASS);
    this.eventBus.dispatch("resize", {
      source: this
    });
    this.#mouseAC?.abort();
    this.#mouseAC = null;
  }
}

;// ./web/pdf_thumbnail_view.js


const DRAW_UPSCALE_FACTOR = 2;
const MAX_NUM_SCALING_STEPS = 3;
const THUMBNAIL_WIDTH = 98;
class TempImageFactory {
  static #tempCanvas = null;
  static getCanvas(width, height) {
    const tempCanvas = this.#tempCanvas ||= document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext("2d", {
      alpha: false
    });
    ctx.save();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    return [tempCanvas, tempCanvas.getContext("2d")];
  }
  static destroyCanvas() {
    const tempCanvas = this.#tempCanvas;
    if (tempCanvas) {
      tempCanvas.width = 0;
      tempCanvas.height = 0;
    }
    this.#tempCanvas = null;
  }
}
class PDFThumbnailView {
  constructor({
    container,
    eventBus,
    id,
    defaultViewport,
    optionalContentConfigPromise,
    linkService,
    renderingQueue,
    pageColors,
    enableHWA
  }) {
    this.id = id;
    this.renderingId = "thumbnail" + id;
    this.pageLabel = null;
    this.pdfPage = null;
    this.rotation = 0;
    this.viewport = defaultViewport;
    this.pdfPageRotate = defaultViewport.rotation;
    this._optionalContentConfigPromise = optionalContentConfigPromise || null;
    this.pageColors = pageColors || null;
    this.enableHWA = enableHWA || false;
    this.eventBus = eventBus;
    this.linkService = linkService;
    this.renderingQueue = renderingQueue;
    this.renderTask = null;
    this.renderingState = RenderingStates.INITIAL;
    this.resume = null;
    const anchor = document.createElement("a");
    anchor.href = linkService.getAnchorUrl("#page=" + id);
    anchor.setAttribute("data-l10n-id", "pdfjs-thumb-page-title");
    anchor.setAttribute("data-l10n-args", this.#pageL10nArgs);
    anchor.setAttribute('style', 'text-decoration:none !important;');
    anchor.onclick = function () {
      linkService.goToPage(id);
      return false;
    };
    this.anchor = anchor;
    const div = document.createElement("div");
    div.className = "thumbnail";
    div.setAttribute("data-page-number", this.id);
    this.div = div;
    this.#updateDims();
    const img = document.createElement("div");
    img.className = "thumbnailImage";
    this._placeholderImg = img;
    div.append(img);
    const thumbnailLabel = document.createElement('div');
    thumbnailLabel.className = "thumbnail-label";
    thumbnailLabel.setAttribute('style', "text-align:center; text-decoration:none; color:var(--main-color); margin-bottom:20px;font-size:13px;")
    thumbnailLabel.innerHTML = this.id;
    anchor.append(div);
    anchor.append(thumbnailLabel);
    container.append(anchor);
  }
  #updateDims() {
    const {
      width,
      height
    } = this.viewport;
    const ratio = width / height;
    this.canvasWidth = THUMBNAIL_WIDTH;
    this.canvasHeight = this.canvasWidth / ratio | 0;
    this.scale = this.canvasWidth / width;
    const {
      style
    } = this.div;
    style.setProperty("--thumbnail-width", `${this.canvasWidth}px`);
    style.setProperty("--thumbnail-height", `${this.canvasHeight}px`);
  }
  setPdfPage(pdfPage) {
    this.pdfPage = pdfPage;
    this.pdfPageRotate = pdfPage.rotate;
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = pdfPage.getViewport({
      scale: 1,
      rotation: totalRotation
    });
    this.reset();
  }
  reset() {
    this.cancelRendering();
    this.renderingState = RenderingStates.INITIAL;
    this.div.removeAttribute("data-loaded");
    this.image?.replaceWith(this._placeholderImg);
    this.#updateDims();
    if (this.image) {
      this.image.removeAttribute("src");
      delete this.image;
    }
  }
  update({
    rotation = null
  }) {
    if (typeof rotation === "number") {
      this.rotation = rotation;
    }
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = this.viewport.clone({
      scale: 1,
      rotation: totalRotation
    });
    this.reset();
  }
  cancelRendering() {
    if (this.renderTask) {
      this.renderTask.cancel();
      this.renderTask = null;
    }
    this.resume = null;
  }
  #getPageDrawContext(upscaleFactor = 1, enableHWA = this.enableHWA) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: !enableHWA
    });
    const outputScale = new OutputScale();
    canvas.width = upscaleFactor * this.canvasWidth * outputScale.sx | 0;
    canvas.height = upscaleFactor * this.canvasHeight * outputScale.sy | 0;
    const transform = outputScale.scaled ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0] : null;
    return {
      ctx,
      canvas,
      transform
    };
  }
  #convertCanvasToImage(canvas) {
    if (this.renderingState !== RenderingStates.FINISHED) {
      throw new Error("#convertCanvasToImage: Rendering has not finished.");
    }
    const reducedCanvas = this.#reduceImage(canvas);
    const image = document.createElement("img");
    image.className = "thumbnailImage";
    image.setAttribute("data-l10n-id", "pdfjs-thumb-page-canvas");
    image.setAttribute("data-l10n-args", this.#pageL10nArgs);
    image.src = reducedCanvas.toDataURL();
    this.image = image;
    this.div.setAttribute("data-loaded", true);
    this._placeholderImg.replaceWith(image);
    reducedCanvas.width = 0;
    reducedCanvas.height = 0;
  }
  async #finishRenderTask(renderTask, canvas, error = null) {
    if (renderTask === this.renderTask) {
      this.renderTask = null;
    }
    if (error instanceof RenderingCancelledException) {
      return;
    }
    this.renderingState = RenderingStates.FINISHED;
    this.#convertCanvasToImage(canvas);
    if (error) {
      throw error;
    }
  }
  async draw() {
    if (this.renderingState !== RenderingStates.INITIAL) {
      console.error("Must be in new state before drawing");
      return undefined;
    }
    const {
      pdfPage
    } = this;
    if (!pdfPage) {
      this.renderingState = RenderingStates.FINISHED;
      throw new Error("pdfPage is not loaded");
    }
    this.renderingState = RenderingStates.RUNNING;
    const {
      ctx,
      canvas,
      transform
    } = this.#getPageDrawContext(DRAW_UPSCALE_FACTOR);
    const drawViewport = this.viewport.clone({
      scale: DRAW_UPSCALE_FACTOR * this.scale
    });
    const renderContinueCallback = cont => {
      if (!this.renderingQueue.isHighestPriority(this)) {
        this.renderingState = RenderingStates.PAUSED;
        this.resume = () => {
          this.renderingState = RenderingStates.RUNNING;
          cont();
        };
        return;
      }
      cont();
    };
    const renderContext = {
      canvasContext: ctx,
      transform,
      viewport: drawViewport,
      optionalContentConfigPromise: this._optionalContentConfigPromise,
      pageColors: this.pageColors
    };
    const renderTask = this.renderTask = pdfPage.render(renderContext);
    renderTask.onContinue = renderContinueCallback;
    const resultPromise = renderTask.promise.then(() => this.#finishRenderTask(renderTask, canvas), error => this.#finishRenderTask(renderTask, canvas, error));
    resultPromise.finally(() => {
      canvas.width = 0;
      canvas.height = 0;
      this.eventBus.dispatch("thumbnailrendered", {
        source: this,
        pageNumber: this.id,
        pdfPage: this.pdfPage
      });
    });
    return resultPromise;
  }
  setImage(pageView) {
    if (this.renderingState !== RenderingStates.INITIAL) {
      return;
    }
    const {
      thumbnailCanvas: canvas,
      pdfPage,
      scale
    } = pageView;
    if (!canvas) {
      return;
    }
    if (!this.pdfPage) {
      this.setPdfPage(pdfPage);
    }
    if (scale < this.scale) {
      return;
    }
    this.renderingState = RenderingStates.FINISHED;
    this.#convertCanvasToImage(canvas);
  }
  #reduceImage(img) {
    const {
      ctx,
      canvas
    } = this.#getPageDrawContext(1, true);
    if (img.width <= 2 * canvas.width) {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      return canvas;
    }
    let reducedWidth = canvas.width << MAX_NUM_SCALING_STEPS;
    let reducedHeight = canvas.height << MAX_NUM_SCALING_STEPS;
    const [reducedImage, reducedImageCtx] = TempImageFactory.getCanvas(reducedWidth, reducedHeight);
    while (reducedWidth > img.width || reducedHeight > img.height) {
      reducedWidth >>= 1;
      reducedHeight >>= 1;
    }
    reducedImageCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, reducedWidth, reducedHeight);
    while (reducedWidth > 2 * canvas.width) {
      reducedImageCtx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, reducedWidth >> 1, reducedHeight >> 1);
      reducedWidth >>= 1;
      reducedHeight >>= 1;
    }
    ctx.drawImage(reducedImage, 0, 0, reducedWidth, reducedHeight, 0, 0, canvas.width, canvas.height);
    return canvas;
  }
  get #pageL10nArgs() {
    return JSON.stringify({
      page: this.pageLabel ?? this.id
    });
  }
  setPageLabel(label) {
    this.pageLabel = typeof label === "string" ? label : null;
    this.anchor.setAttribute("data-l10n-args", this.#pageL10nArgs);
    if (this.renderingState !== RenderingStates.FINISHED) {
      return;
    }
    this.image?.setAttribute("data-l10n-args", this.#pageL10nArgs);
  }
}

;// ./web/pdf_thumbnail_viewer.js


const THUMBNAIL_SCROLL_MARGIN = -19;
const THUMBNAIL_SELECTED_CLASS = "selected";
class PDFThumbnailViewer {
  constructor({
    container,
    eventBus,
    linkService,
    renderingQueue,
    pageColors,
    abortSignal,
    enableHWA
  }) {
    this.container = container;
    this.eventBus = eventBus;
    this.linkService = linkService;
    this.renderingQueue = renderingQueue;
    this.pageColors = pageColors || null;
    this.enableHWA = enableHWA || false;
    this.scroll = watchScroll(this.container, this.#scrollUpdated.bind(this), abortSignal);
    this.#resetView();
  }
  #scrollUpdated() {
    this.renderingQueue.renderHighestPriority();
  }
  getThumbnail(index) {
    return this._thumbnails[index];
  }
  #getVisibleThumbs() {
    return getVisibleElements({
      scrollEl: this.container,
      views: this._thumbnails
    });
  }
  scrollThumbnailIntoView(pageNumber) {
    if (!this.pdfDocument) {
      return;
    }
    const thumbnailView = this._thumbnails[pageNumber - 1];
    if (!thumbnailView) {
      console.error('scrollThumbnailIntoView: Invalid "pageNumber" parameter.');
      return;
    }
    if (pageNumber !== this._currentPageNumber) {
      const prevThumbnailView = this._thumbnails[this._currentPageNumber - 1];
      prevThumbnailView.div.classList.remove(THUMBNAIL_SELECTED_CLASS);
      thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);
    }
    const {
      first,
      last,
      views
    } = this.#getVisibleThumbs();
    if (views.length > 0) {
      let shouldScroll = false;
      if (pageNumber <= first.id || pageNumber >= last.id) {
        shouldScroll = true;
      } else {
        for (const {
          id,
          percent
        } of views) {
          if (id !== pageNumber) {
            continue;
          }
          shouldScroll = percent < 100;
          break;
        }
      }
      if (shouldScroll) {
        scrollIntoView(thumbnailView.div, {
          top: THUMBNAIL_SCROLL_MARGIN
        });
      }
    }
    this._currentPageNumber = pageNumber;
  }
  get pagesRotation() {
    return this._pagesRotation;
  }
  set pagesRotation(rotation) {
    if (!isValidRotation(rotation)) {
      throw new Error("Invalid thumbnails rotation angle.");
    }
    if (!this.pdfDocument) {
      return;
    }
    if (this._pagesRotation === rotation) {
      return;
    }
    this._pagesRotation = rotation;
    const updateArgs = {
      rotation
    };
    for (const thumbnail of this._thumbnails) {
      thumbnail.update(updateArgs);
    }
  }
  cleanup() {
    for (const thumbnail of this._thumbnails) {
      if (thumbnail.renderingState !== RenderingStates.FINISHED) {
        thumbnail.reset();
      }
    }
    TempImageFactory.destroyCanvas();
  }
  #resetView() {
    this._thumbnails = [];
    this._currentPageNumber = 1;
    this._pageLabels = null;
    this._pagesRotation = 0;
    this.container.textContent = "";
  }
  setDocument(pdfDocument) {
    if (this.pdfDocument) {
      this.#cancelRendering();
      this.#resetView();
    }
    this.pdfDocument = pdfDocument;
    if (!pdfDocument) {
      return;
    }
    const firstPagePromise = pdfDocument.getPage(1);
    const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig({
      intent: "display"
    });
    firstPagePromise.then(firstPdfPage => {
      const pagesCount = pdfDocument.numPages;
      const viewport = firstPdfPage.getViewport({
        scale: 1
      });
      for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
        const thumbnail = new PDFThumbnailView({
          container: this.container,
          eventBus: this.eventBus,
          id: pageNum,
          defaultViewport: viewport.clone(),
          optionalContentConfigPromise,
          linkService: this.linkService,
          renderingQueue: this.renderingQueue,
          pageColors: this.pageColors,
          enableHWA: this.enableHWA
        });
        this._thumbnails.push(thumbnail);
      }
      this._thumbnails[0]?.setPdfPage(firstPdfPage);
      const thumbnailView = this._thumbnails[this._currentPageNumber - 1];
      thumbnailView.div.classList.add(THUMBNAIL_SELECTED_CLASS);
    }).catch(reason => {
      console.error("Unable to initialize thumbnail viewer", reason);
    });
  }
  #cancelRendering() {
    for (const thumbnail of this._thumbnails) {
      thumbnail.cancelRendering();
    }
  }
  setPageLabels(labels) {
    if (!this.pdfDocument) {
      return;
    }
    if (!labels) {
      this._pageLabels = null;
    } else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
      this._pageLabels = null;
      console.error("PDFThumbnailViewer_setPageLabels: Invalid page labels.");
    } else {
      this._pageLabels = labels;
    }
    for (let i = 0, ii = this._thumbnails.length; i < ii; i++) {
      this._thumbnails[i].setPageLabel(this._pageLabels?.[i] ?? null);
    }
  }
  async #ensurePdfPageLoaded(thumbView) {
    if (thumbView.pdfPage) {
      return thumbView.pdfPage;
    }
    try {
      const pdfPage = await this.pdfDocument.getPage(thumbView.id);
      if (!thumbView.pdfPage) {
        thumbView.setPdfPage(pdfPage);
      }
      return pdfPage;
    } catch (reason) {
      console.error("Unable to get page for thumb view", reason);
      return null;
    }
  }
  #getScrollAhead(visible) {
    if (visible.first?.id === 1) {
      return true;
    } else if (visible.last?.id === this._thumbnails.length) {
      return false;
    }
    return this.scroll.down;
  }
  forceRendering() {
    const visibleThumbs = this.#getVisibleThumbs();
    const scrollAhead = this.#getScrollAhead(visibleThumbs);
    const thumbView = this.renderingQueue.getHighestPriority(visibleThumbs, this._thumbnails, scrollAhead);
    if (thumbView) {
      this.#ensurePdfPageLoaded(thumbView).then(() => {
        this.renderingQueue.renderView(thumbView);
      });
      return true;
    }
    return false;
  }
}

;// ./web/annotation_editor_layer_builder.js


class AnnotationEditorLayerBuilder {
  #annotationLayer = null;
  #drawLayer = null;
  #onAppend = null;
  #structTreeLayer = null;
  #textLayer = null;
  #uiManager;
  constructor(options) {
    this.pdfPage = options.pdfPage;
    this.accessibilityManager = options.accessibilityManager;
    this.l10n = options.l10n;
    this.l10n ||= new genericl10n_GenericL10n();
    this.annotationEditorLayer = null;
    this.div = null;
    this._cancelled = false;
    this.#uiManager = options.uiManager;
    this.#annotationLayer = options.annotationLayer || null;
    this.#textLayer = options.textLayer || null;
    this.#drawLayer = options.drawLayer || null;
    this.#onAppend = options.onAppend || null;
    this.#structTreeLayer = options.structTreeLayer || null;
  }
  async render(viewport, intent = "display") {
    if (intent !== "display") {
      return;
    }
    if (this._cancelled) {
      return;
    }
    const clonedViewport = viewport.clone({
      dontFlip: true
    });
    if (this.div) {
      this.annotationEditorLayer.update({
        viewport: clonedViewport
      });
      this.show();
      return;
    }
    const div = this.div = document.createElement("div");
    div.className = "annotationEditorLayer";
    div.hidden = true;
    div.dir = this.#uiManager.direction;
    this.#onAppend?.(div);
    this.annotationEditorLayer = new AnnotationEditorLayer({
      uiManager: this.#uiManager,
      div,
      structTreeLayer: this.#structTreeLayer,
      accessibilityManager: this.accessibilityManager,
      pageIndex: this.pdfPage.pageNumber - 1,
      l10n: this.l10n,
      viewport: clonedViewport,
      annotationLayer: this.#annotationLayer,
      textLayer: this.#textLayer,
      drawLayer: this.#drawLayer
    });
    const parameters = {
      viewport: clonedViewport,
      div,
      annotations: null,
      intent
    };
    this.annotationEditorLayer.render(parameters);
    this.show();
  }
  cancel() {
    this._cancelled = true;
    if (!this.div) {
      return;
    }
    this.annotationEditorLayer.destroy();
  }
  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
  show() {
    if (!this.div || this.annotationEditorLayer.isInvisible) {
      return;
    }
    this.div.hidden = false;
  }
}

;// ./web/annotation_layer_builder.js


class AnnotationLayerBuilder {
  #onAppend = null;
  #eventAbortController = null;
  constructor({
    pdfPage,
    linkService,
    downloadManager,
    annotationStorage = null,
    imageResourcesPath = "",
    renderForms = true,
    enableScripting = false,
    hasJSActionsPromise = null,
    fieldObjectsPromise = null,
    annotationCanvasMap = null,
    accessibilityManager = null,
    annotationEditorUIManager = null,
    onAppend = null
  }) {
    this.pdfPage = pdfPage;
    this.linkService = linkService;
    this.downloadManager = downloadManager;
    this.imageResourcesPath = imageResourcesPath;
    this.renderForms = renderForms;
    this.annotationStorage = annotationStorage;
    this.enableScripting = enableScripting;
    this._hasJSActionsPromise = hasJSActionsPromise || Promise.resolve(false);
    this._fieldObjectsPromise = fieldObjectsPromise || Promise.resolve(null);
    this._annotationCanvasMap = annotationCanvasMap;
    this._accessibilityManager = accessibilityManager;
    this._annotationEditorUIManager = annotationEditorUIManager;
    this.#onAppend = onAppend;
    this.annotationLayer = null;
    this.div = null;
    this._cancelled = false;
    this._eventBus = linkService.eventBus;
  }
  async render(viewport, options, intent = "display") {
    if (this.div) {
      if (this._cancelled || !this.annotationLayer) {
        return;
      }
      this.annotationLayer.update({
        viewport: viewport.clone({
          dontFlip: true
        })
      });
      return;
    }
    const [annotations, hasJSActions, fieldObjects] = await Promise.all([this.pdfPage.getAnnotations({
      intent
    }), this._hasJSActionsPromise, this._fieldObjectsPromise]);
    if (this._cancelled) {
      return;
    }
    const div = this.div = document.createElement("div");
    div.className = "annotationLayer";
    this.#onAppend?.(div);
    if (annotations.length === 0) {
      this.hide();
      return;
    }
    this.annotationLayer = new AnnotationLayer({
      div,
      accessibilityManager: this._accessibilityManager,
      annotationCanvasMap: this._annotationCanvasMap,
      annotationEditorUIManager: this._annotationEditorUIManager,
      page: this.pdfPage,
      viewport: viewport.clone({
        dontFlip: true
      }),
      structTreeLayer: options?.structTreeLayer || null
    });
    await this.annotationLayer.render({
      annotations,
      imageResourcesPath: this.imageResourcesPath,
      renderForms: this.renderForms,
      linkService: this.linkService,
      downloadManager: this.downloadManager,
      annotationStorage: this.annotationStorage,
      enableScripting: this.enableScripting,
      hasJSActions,
      fieldObjects
    });
    if (this.linkService.isInPresentationMode) {
      this.#updatePresentationModeState(PresentationModeState.FULLSCREEN);
    }
    if (!this.#eventAbortController) {
      this.#eventAbortController = new AbortController();
      this._eventBus?._on("presentationmodechanged", evt => {
        this.#updatePresentationModeState(evt.state);
      }, {
        signal: this.#eventAbortController.signal
      });
    }
  }
  cancel() {
    this._cancelled = true;
    this.#eventAbortController?.abort();
    this.#eventAbortController = null;
  }
  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
  hasEditableAnnotations() {
    return !!this.annotationLayer?.hasEditableAnnotations();
  }
  #updatePresentationModeState(state) {
    if (!this.div) {
      return;
    }
    let disableFormElements = false;
    switch (state) {
      case PresentationModeState.FULLSCREEN:
        disableFormElements = true;
        break;
      case PresentationModeState.NORMAL:
        break;
      default:
        return;
    }
    for (const section of this.div.childNodes) {
      if (section.hasAttribute("data-internal-link")) {
        continue;
      }
      section.inert = disableFormElements;
    }
  }
}

;// ./web/draw_layer_builder.js

class DrawLayerBuilder {
  #drawLayer = null;
  constructor(options) {
    this.pageIndex = options.pageIndex;
  }
  async render(intent = "display") {
    if (intent !== "display" || this.#drawLayer || this._cancelled) {
      return;
    }
    this.#drawLayer = new DrawLayer({
      pageIndex: this.pageIndex
    });
  }
  cancel() {
    this._cancelled = true;
    if (!this.#drawLayer) {
      return;
    }
    this.#drawLayer.destroy();
    this.#drawLayer = null;
  }
  setParent(parent) {
    this.#drawLayer?.setParent(parent);
  }
  getDrawLayer() {
    return this.#drawLayer;
  }
}

;// ./web/struct_tree_layer_builder.js

const PDF_ROLE_TO_HTML_ROLE = {
  Document: null,
  DocumentFragment: null,
  Part: "group",
  Sect: "group",
  Div: "group",
  Aside: "note",
  NonStruct: "none",
  P: null,
  H: "heading",
  Title: null,
  FENote: "note",
  Sub: "group",
  Lbl: null,
  Span: null,
  Em: null,
  Strong: null,
  Link: "link",
  Annot: "note",
  Form: "form",
  Ruby: null,
  RB: null,
  RT: null,
  RP: null,
  Warichu: null,
  WT: null,
  WP: null,
  L: "list",
  LI: "listitem",
  LBody: null,
  Table: "table",
  TR: "row",
  TH: "columnheader",
  TD: "cell",
  THead: "columnheader",
  TBody: null,
  TFoot: null,
  Caption: null,
  Figure: "figure",
  Formula: null,
  Artifact: null
};
const HEADING_PATTERN = /^H(\d+)$/;
class StructTreeLayerBuilder {
  #promise;
  #treeDom = null;
  #treePromise;
  #elementAttributes = new Map();
  #rawDims;
  #elementsToAddToTextLayer = null;
  constructor(pdfPage, rawDims) {
    this.#promise = pdfPage.getStructTree();
    this.#rawDims = rawDims;
  }
  async render() {
    if (this.#treePromise) {
      return this.#treePromise;
    }
    const {
      promise,
      resolve,
      reject
    } = Promise.withResolvers();
    this.#treePromise = promise;
    try {
      this.#treeDom = this.#walk(await this.#promise);
    } catch (ex) {
      reject(ex);
    }
    this.#promise = null;
    this.#treeDom?.classList.add("structTree");
    resolve(this.#treeDom);
    return promise;
  }
  async getAriaAttributes(annotationId) {
    await this.render();
    return this.#elementAttributes.get(annotationId);
  }
  hide() {
    if (this.#treeDom && !this.#treeDom.hidden) {
      this.#treeDom.hidden = true;
    }
  }
  show() {
    if (this.#treeDom?.hidden) {
      this.#treeDom.hidden = false;
    }
  }
  #setAttributes(structElement, htmlElement) {
    const {
      alt,
      id,
      lang
    } = structElement;
    if (alt !== undefined) {
      let added = false;
      const label = removeNullCharacters(alt);
      for (const child of structElement.children) {
        if (child.type === "annotation") {
          let attrs = this.#elementAttributes.get(child.id);
          if (!attrs) {
            attrs = new Map();
            this.#elementAttributes.set(child.id, attrs);
          }
          attrs.set("aria-label", label);
          added = true;
        }
      }
      if (!added) {
        htmlElement.setAttribute("aria-label", label);
      }
    }
    if (id !== undefined) {
      htmlElement.setAttribute("aria-owns", id);
    }
    if (lang !== undefined) {
      htmlElement.setAttribute("lang", removeNullCharacters(lang, true));
    }
  }
  #addImageInTextLayer(node, element) {
    const {
      alt,
      bbox,
      children
    } = node;
    const child = children?.[0];
    if (!this.#rawDims || !alt || !bbox || child?.type !== "content") {
      return false;
    }
    const {
      id
    } = child;
    if (!id) {
      return false;
    }
    element.setAttribute("aria-owns", id);
    const img = document.createElement("span");
    (this.#elementsToAddToTextLayer ||= new Map()).set(id, img);
    img.setAttribute("role", "img");
    img.setAttribute("aria-label", removeNullCharacters(alt));
    const {
      pageHeight,
      pageX,
      pageY
    } = this.#rawDims;
    const calc = "calc(var(--scale-factor)*";
    const {
      style
    } = img;
    style.width = `${calc}${bbox[2] - bbox[0]}px)`;
    style.height = `${calc}${bbox[3] - bbox[1]}px)`;
    style.left = `${calc}${bbox[0] - pageX}px)`;
    style.top = `${calc}${pageHeight - bbox[3] + pageY}px)`;
    return true;
  }
  addElementsToTextLayer() {
    if (!this.#elementsToAddToTextLayer) {
      return;
    }
    for (const [id, img] of this.#elementsToAddToTextLayer) {
      document.getElementById(id)?.append(img);
    }
    this.#elementsToAddToTextLayer.clear();
    this.#elementsToAddToTextLayer = null;
  }
  #walk(node) {
    if (!node) {
      return null;
    }
    const element = document.createElement("span");
    if ("role" in node) {
      const {
        role
      } = node;
      const match = role.match(HEADING_PATTERN);
      if (match) {
        element.setAttribute("role", "heading");
        element.setAttribute("aria-level", match[1]);
      } else if (PDF_ROLE_TO_HTML_ROLE[role]) {
        element.setAttribute("role", PDF_ROLE_TO_HTML_ROLE[role]);
      }
      if (role === "Figure" && this.#addImageInTextLayer(node, element)) {
        return element;
      }
    }
    this.#setAttributes(node, element);
    if (node.children) {
      if (node.children.length === 1 && "id" in node.children[0]) {
        this.#setAttributes(node.children[0], element);
      } else {
        for (const kid of node.children) {
          element.append(this.#walk(kid));
        }
      }
    }
    return element;
  }
}

;// ./web/text_accessibility.js

class TextAccessibilityManager {
  #enabled = false;
  #textChildren = null;
  #textNodes = new Map();
  #waitingElements = new Map();
  setTextMapping(textDivs) {
    this.#textChildren = textDivs;
  }
  static #compareElementPositions(e1, e2) {
    const rect1 = e1.getBoundingClientRect();
    const rect2 = e2.getBoundingClientRect();
    if (rect1.width === 0 && rect1.height === 0) {
      return +1;
    }
    if (rect2.width === 0 && rect2.height === 0) {
      return -1;
    }
    const top1 = rect1.y;
    const bot1 = rect1.y + rect1.height;
    const mid1 = rect1.y + rect1.height / 2;
    const top2 = rect2.y;
    const bot2 = rect2.y + rect2.height;
    const mid2 = rect2.y + rect2.height / 2;
    if (mid1 <= top2 && mid2 >= bot1) {
      return -1;
    }
    if (mid2 <= top1 && mid1 >= bot2) {
      return +1;
    }
    const centerX1 = rect1.x + rect1.width / 2;
    const centerX2 = rect2.x + rect2.width / 2;
    return centerX1 - centerX2;
  }
  enable() {
    if (this.#enabled) {
      throw new Error("TextAccessibilityManager is already enabled.");
    }
    if (!this.#textChildren) {
      throw new Error("Text divs and strings have not been set.");
    }
    this.#enabled = true;
    this.#textChildren = this.#textChildren.slice();
    this.#textChildren.sort(TextAccessibilityManager.#compareElementPositions);
    if (this.#textNodes.size > 0) {
      const textChildren = this.#textChildren;
      for (const [id, nodeIndex] of this.#textNodes) {
        const element = document.getElementById(id);
        if (!element) {
          this.#textNodes.delete(id);
          continue;
        }
        this.#addIdToAriaOwns(id, textChildren[nodeIndex]);
      }
    }
    for (const [element, isRemovable] of this.#waitingElements) {
      this.addPointerInTextLayer(element, isRemovable);
    }
    this.#waitingElements.clear();
  }
  disable() {
    if (!this.#enabled) {
      return;
    }
    this.#waitingElements.clear();
    this.#textChildren = null;
    this.#enabled = false;
  }
  removePointerInTextLayer(element) {
    if (!this.#enabled) {
      this.#waitingElements.delete(element);
      return;
    }
    const children = this.#textChildren;
    if (!children || children.length === 0) {
      return;
    }
    const {
      id
    } = element;
    const nodeIndex = this.#textNodes.get(id);
    if (nodeIndex === undefined) {
      return;
    }
    const node = children[nodeIndex];
    this.#textNodes.delete(id);
    let owns = node.getAttribute("aria-owns");
    if (owns?.includes(id)) {
      owns = owns.split(" ").filter(x => x !== id).join(" ");
      if (owns) {
        node.setAttribute("aria-owns", owns);
      } else {
        node.removeAttribute("aria-owns");
        node.setAttribute("role", "presentation");
      }
    }
  }
  #addIdToAriaOwns(id, node) {
    const owns = node.getAttribute("aria-owns");
    if (!owns?.includes(id)) {
      node.setAttribute("aria-owns", owns ? `${owns} ${id}` : id);
    }
    node.removeAttribute("role");
  }
  addPointerInTextLayer(element, isRemovable) {
    const {
      id
    } = element;
    if (!id) {
      return null;
    }
    if (!this.#enabled) {
      this.#waitingElements.set(element, isRemovable);
      return null;
    }
    if (isRemovable) {
      this.removePointerInTextLayer(element);
    }
    const children = this.#textChildren;
    if (!children || children.length === 0) {
      return null;
    }
    const index = binarySearchFirstItem(children, node => TextAccessibilityManager.#compareElementPositions(element, node) < 0);
    const nodeIndex = Math.max(0, index - 1);
    const child = children[nodeIndex];
    this.#addIdToAriaOwns(id, child);
    this.#textNodes.set(id, nodeIndex);
    const parent = child.parentNode;
    return parent?.classList.contains("markedContent") ? parent.id : null;
  }
  moveElementInDOM(container, element, contentElement, isRemovable) {
    const id = this.addPointerInTextLayer(contentElement, isRemovable);
    if (!container.hasChildNodes()) {
      container.append(element);
      return id;
    }
    const children = Array.from(container.childNodes).filter(node => node !== element);
    if (children.length === 0) {
      return id;
    }
    const elementToCompare = contentElement || element;
    const index = binarySearchFirstItem(children, node => TextAccessibilityManager.#compareElementPositions(elementToCompare, node) < 0);
    if (index === 0) {
      children[0].before(element);
    } else {
      children[index - 1].after(element);
    }
    return id;
  }
}

;// ./web/text_highlighter.js
class TextHighlighter {
  #eventAbortController = null;
  constructor({
    findController,
    eventBus,
    pageIndex
  }) {
    this.findController = findController;
    this.matches = [];
    this.eventBus = eventBus;
    this.pageIdx = pageIndex;
    this.textDivs = null;
    this.textContentItemsStr = null;
    this.enabled = false;
  }
  setTextMapping(divs, texts) {
    this.textDivs = divs;
    this.textContentItemsStr = texts;
  }
  enable() {
    if (!this.textDivs || !this.textContentItemsStr) {
      throw new Error("Text divs and strings have not been set.");
    }
    if (this.enabled) {
      throw new Error("TextHighlighter is already enabled.");
    }
    this.enabled = true;
    if (!this.#eventAbortController) {
      this.#eventAbortController = new AbortController();
      this.eventBus._on("updatetextlayermatches", evt => {
        if (evt.pageIndex === this.pageIdx || evt.pageIndex === -1) {
          this._updateMatches();
        }
      }, {
        signal: this.#eventAbortController.signal
      });
    }
    this._updateMatches();
  }
  disable() {
    if (!this.enabled) {
      return;
    }
    this.enabled = false;
    this.#eventAbortController?.abort();
    this.#eventAbortController = null;
    this._updateMatches(true);
  }
  _convertMatches(matches, matchesLength) {
    if (!matches) {
      return [];
    }
    const {
      textContentItemsStr
    } = this;
    let i = 0,
      iIndex = 0;
    const end = textContentItemsStr.length - 1;
    const result = [];
    for (let m = 0, mm = matches.length; m < mm; m++) {
      let matchIdx = matches[m];
      while (i !== end && matchIdx >= iIndex + textContentItemsStr[i].length) {
        iIndex += textContentItemsStr[i].length;
        i++;
      }
      if (i === textContentItemsStr.length) {
        console.error("Could not find a matching mapping");
      }
      const match = {
        begin: {
          divIdx: i,
          offset: matchIdx - iIndex
        }
      };
      matchIdx += matchesLength[m];
      while (i !== end && matchIdx > iIndex + textContentItemsStr[i].length) {
        iIndex += textContentItemsStr[i].length;
        i++;
      }
      match.end = {
        divIdx: i,
        offset: matchIdx - iIndex
      };
      result.push(match);
    }
    return result;
  }
  _renderMatches(matches) {
    if (matches.length === 0) {
      return;
    }
    const {
      findController,
      pageIdx
    } = this;
    const {
      textContentItemsStr,
      textDivs
    } = this;
    const isSelectedPage = pageIdx === findController.selected.pageIdx;
    const selectedMatchIdx = findController.selected.matchIdx;
    const highlightAll = findController.state.highlightAll;
    let prevEnd = null;
    const infinity = {
      divIdx: -1,
      offset: undefined
    };
    function beginText(begin, className) {
      const divIdx = begin.divIdx;
      textDivs[divIdx].textContent = "";
      return appendTextToDiv(divIdx, 0, begin.offset, className);
    }
    function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
      let div = textDivs[divIdx];
      if (div.nodeType === Node.TEXT_NODE) {
        const span = document.createElement("span");
        div.before(span);
        span.append(div);
        textDivs[divIdx] = span;
        div = span;
      }
      const content = textContentItemsStr[divIdx].substring(fromOffset, toOffset);
      const node = document.createTextNode(content);
      if (className) {
        const span = document.createElement("span");
        span.className = `${className} appended`;
        span.append(node);
        div.append(span);
        return className.includes("selected") ? span.offsetLeft : 0;
      }
      div.append(node);
      return 0;
    }
    let i0 = selectedMatchIdx,
      i1 = i0 + 1;
    if (highlightAll) {
      i0 = 0;
      i1 = matches.length;
    } else if (!isSelectedPage) {
      return;
    }
    let lastDivIdx = -1;
    let lastOffset = -1;
    for (let i = i0; i < i1; i++) {
      const match = matches[i];
      const begin = match.begin;
      if (begin.divIdx === lastDivIdx && begin.offset === lastOffset) {
        continue;
      }
      lastDivIdx = begin.divIdx;
      lastOffset = begin.offset;
      const end = match.end;
      const isSelected = isSelectedPage && i === selectedMatchIdx;
      const highlightSuffix = isSelected ? " selected" : "";
      let selectedLeft = 0;
      if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
        if (prevEnd !== null) {
          appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
        }
        beginText(begin);
      } else {
        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
      }
      if (begin.divIdx === end.divIdx) {
        selectedLeft = appendTextToDiv(begin.divIdx, begin.offset, end.offset, "highlight" + highlightSuffix);
      } else {
        selectedLeft = appendTextToDiv(begin.divIdx, begin.offset, infinity.offset, "highlight begin" + highlightSuffix);
        for (let n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
          textDivs[n0].className = "highlight middle" + highlightSuffix;
        }
        beginText(end, "highlight end" + highlightSuffix);
      }
      prevEnd = end;
      if (isSelected) {
        findController.scrollMatchIntoView({
          element: textDivs[begin.divIdx],
          selectedLeft,
          pageIndex: pageIdx,
          matchIndex: selectedMatchIdx
        });
      }
    }
    if (prevEnd) {
      appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
    }
  }
  _updateMatches(reset = false) {
    if (!this.enabled && !reset) {
      return;
    }
    const {
      findController,
      matches,
      pageIdx
    } = this;
    const {
      textContentItemsStr,
      textDivs
    } = this;
    let clearedUntilDivIdx = -1;
    for (const match of matches) {
      const begin = Math.max(clearedUntilDivIdx, match.begin.divIdx);
      for (let n = begin, end = match.end.divIdx; n <= end; n++) {
        const div = textDivs[n];
        div.textContent = textContentItemsStr[n];
        div.className = "";
      }
      clearedUntilDivIdx = match.end.divIdx + 1;
    }
    if (!findController?.highlightMatches || reset) {
      return;
    }
    const pageMatches = findController.pageMatches[pageIdx] || null;
    const pageMatchesLength = findController.pageMatchesLength[pageIdx] || null;
    this.matches = this._convertMatches(pageMatches, pageMatchesLength);
    this._renderMatches(this.matches);
  }
}

;// ./web/text_layer_builder.js


class TextLayerBuilder {
  #enablePermissions = false;
  #onAppend = null;
  #renderingDone = false;
  #textLayer = null;
  static #textLayers = new Map();
  static #selectionChangeAbortController = null;
  constructor({
    pdfPage,
    highlighter = null,
    accessibilityManager = null,
    enablePermissions = false,
    onAppend = null
  }) {
    this.pdfPage = pdfPage;
    this.highlighter = highlighter;
    this.accessibilityManager = accessibilityManager;
    this.#enablePermissions = enablePermissions === true;
    this.#onAppend = onAppend;
    this.div = document.createElement("div");
    this.div.tabIndex = 0;
    this.div.className = "textLayer";
  }
  async render(viewport, textContentParams = null) {
    if (this.#renderingDone && this.#textLayer) {
      this.#textLayer.update({
        viewport,
        onBefore: this.hide.bind(this)
      });
      this.show();
      return;
    }
    this.cancel();
    this.#textLayer = new TextLayer({
      textContentSource: this.pdfPage.streamTextContent(textContentParams || {
        includeMarkedContent: true,
        disableNormalization: true
      }),
      container: this.div,
      viewport
    });
    const {
      textDivs,
      textContentItemsStr
    } = this.#textLayer;
    this.highlighter?.setTextMapping(textDivs, textContentItemsStr);
    this.accessibilityManager?.setTextMapping(textDivs);
    await this.#textLayer.render();
    this.#renderingDone = true;
    const endOfContent = document.createElement("div");
    endOfContent.className = "endOfContent";
    this.div.append(endOfContent);
    this.#bindMouse(endOfContent);
    this.#onAppend?.(this.div);
    this.highlighter?.enable();
    this.accessibilityManager?.enable();
  }
  hide() {
    if (!this.div.hidden && this.#renderingDone) {
      this.highlighter?.disable();
      this.div.hidden = true;
    }
  }
  show() {
    if (this.div.hidden && this.#renderingDone) {
      this.div.hidden = false;
      this.highlighter?.enable();
    }
  }
  cancel() {
    this.#textLayer?.cancel();
    this.#textLayer = null;
    this.highlighter?.disable();
    this.accessibilityManager?.disable();
    TextLayerBuilder.#removeGlobalSelectionListener(this.div);
  }
  #bindMouse(end) {
    const {
      div
    } = this;
    div.addEventListener("mousedown", () => {
      div.classList.add("selecting");
    });
    div.addEventListener("copy", event => {
      if (!this.#enablePermissions) {
        const selection = document.getSelection();
        event.clipboardData.setData("text/plain", removeNullCharacters(normalizeUnicode(selection.toString())));
      }
      event.preventDefault();
      event.stopPropagation();
    });
    TextLayerBuilder.#textLayers.set(div, end);
    TextLayerBuilder.#enableGlobalSelectionListener();
  }
  static #removeGlobalSelectionListener(textLayerDiv) {
    this.#textLayers.delete(textLayerDiv);
    if (this.#textLayers.size === 0) {
      this.#selectionChangeAbortController?.abort();
      this.#selectionChangeAbortController = null;
    }
  }
  static #enableGlobalSelectionListener() {
    if (this.#selectionChangeAbortController) {
      return;
    }
    this.#selectionChangeAbortController = new AbortController();
    const {
      signal
    } = this.#selectionChangeAbortController;
    const reset = (end, textLayer) => {
      textLayer.append(end);
      end.style.width = "";
      end.style.height = "";
      textLayer.classList.remove("selecting");
    };
    let isPointerDown = false;
    document.addEventListener("pointerdown", () => {
      isPointerDown = true;
    }, {
      signal
    });
    document.addEventListener("pointerup", () => {
      isPointerDown = false;
      this.#textLayers.forEach(reset);
    }, {
      signal
    });
    window.addEventListener("blur", () => {
      isPointerDown = false;
      this.#textLayers.forEach(reset);
    }, {
      signal
    });
    document.addEventListener("keyup", () => {
      if (!isPointerDown) {
        this.#textLayers.forEach(reset);
      }
    }, {
      signal
    });
    var isFirefox, prevRange;
    document.addEventListener("selectionchange", () => {
      const selection = document.getSelection();
      if (selection.rangeCount === 0) {
        this.#textLayers.forEach(reset);
        return;
      }
      const activeTextLayers = new Set();
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        for (const textLayerDiv of this.#textLayers.keys()) {
          if (!activeTextLayers.has(textLayerDiv) && range.intersectsNode(textLayerDiv)) {
            activeTextLayers.add(textLayerDiv);
          }
        }
      }
      for (const [textLayerDiv, endDiv] of this.#textLayers) {
        if (activeTextLayers.has(textLayerDiv)) {
          textLayerDiv.classList.add("selecting");
        } else {
          reset(endDiv, textLayerDiv);
        }
      }
      isFirefox ??= getComputedStyle(this.#textLayers.values().next().value).getPropertyValue("-moz-user-select") === "none";
      if (isFirefox) {
        return;
      }
      const range = selection.getRangeAt(0);
      const modifyStart = prevRange && (range.compareBoundaryPoints(Range.END_TO_END, prevRange) === 0 || range.compareBoundaryPoints(Range.START_TO_END, prevRange) === 0);
      let anchor = modifyStart ? range.startContainer : range.endContainer;
      if (anchor.nodeType === Node.TEXT_NODE) {
        anchor = anchor.parentNode;
      }
      const parentTextLayer = anchor.parentElement?.closest(".textLayer");
      const endDiv = this.#textLayers.get(parentTextLayer);
      if (endDiv) {
        endDiv.style.width = parentTextLayer.style.width;
        endDiv.style.height = parentTextLayer.style.height;
        anchor.parentElement.insertBefore(endDiv, modifyStart ? anchor : anchor.nextSibling);
      }
      prevRange = range.cloneRange();
    }, {
      signal
    });
  }
}

;// ./web/pdf_page_view.js













const DEFAULT_LAYER_PROPERTIES = null;
const LAYERS_ORDER = new Map([["canvasWrapper", 0], ["textLayer", 1], ["annotationLayer", 2], ["annotationEditorLayer", 3], ["xfaLayer", 3]]);
class PDFPageView {
  #annotationMode = AnnotationMode.ENABLE_FORMS;
  #enableHWA = false;
  #hasRestrictedScaling = false;
  #isEditing = false;
  #layerProperties = null;
  #loadingId = null;
  #previousRotation = null;
  #scaleRoundX = 1;
  #scaleRoundY = 1;
  #renderError = null;
  #renderingState = RenderingStates.INITIAL;
  #textLayerMode = TextLayerMode.ENABLE;
  #useThumbnailCanvas = {
    directDrawing: true,
    initialOptionalContent: true,
    regularAnnotations: true
  };
  #viewportMap = new WeakMap();
  #layers = [null, null, null, null];
  constructor(options) {
    const container = options.container;
    const defaultViewport = options.defaultViewport;
    this.id = options.id;
    this.renderingId = "page" + this.id;
    this.#layerProperties = options.layerProperties || DEFAULT_LAYER_PROPERTIES;
    this.pdfPage = null;
    this.pageLabel = null;
    this.rotation = 0;
    this.scale = options.scale || DEFAULT_SCALE;
    this.viewport = defaultViewport;
    this.pdfPageRotate = defaultViewport.rotation;
    this._optionalContentConfigPromise = options.optionalContentConfigPromise || null;
    this.#textLayerMode = options.textLayerMode ?? TextLayerMode.ENABLE;
    this.#annotationMode = options.annotationMode ?? AnnotationMode.ENABLE_FORMS;
    this.imageResourcesPath = options.imageResourcesPath || "";
    this.maxCanvasPixels = options.maxCanvasPixels ?? AppOptions.get("maxCanvasPixels");
    this.pageColors = options.pageColors || null;
    this.#enableHWA = options.enableHWA || false;
    this.eventBus = options.eventBus;
    this.renderingQueue = options.renderingQueue;
    this.l10n = options.l10n;
    this.l10n ||= new genericl10n_GenericL10n();
    this.renderTask = null;
    this.resume = null;
    this._isStandalone = !this.renderingQueue?.hasViewer();
    this._container = container;
    this._annotationCanvasMap = null;
    this.annotationLayer = null;
    this.annotationEditorLayer = null;
    this.textLayer = null;
    this.zoomLayer = null;
    this.xfaLayer = null;
    this.structTreeLayer = null;
    this.drawLayer = null;
    const div = document.createElement("div");
    div.className = "page";
    div.setAttribute("data-page-number", this.id);
    div.setAttribute("role", "region");
    div.setAttribute("data-l10n-id", "pdfjs-page-landmark");
    div.setAttribute("data-l10n-args", JSON.stringify({
      page: this.id
    }));
    this.div = div;
    this.#setDimensions();
    container?.append(div);
    if (this._isStandalone) {
      container?.style.setProperty("--scale-factor", this.scale * PixelsPerInch.PDF_TO_CSS_UNITS);
      if (this.pageColors?.background) {
        container?.style.setProperty("--page-bg-color", this.pageColors.background);
      }
      const {
        optionalContentConfigPromise
      } = options;
      if (optionalContentConfigPromise) {
        optionalContentConfigPromise.then(optionalContentConfig => {
          if (optionalContentConfigPromise !== this._optionalContentConfigPromise) {
            return;
          }
          this.#useThumbnailCanvas.initialOptionalContent = optionalContentConfig.hasInitialVisibility;
        });
      }
      if (!options.l10n) {
        this.l10n.translate(this.div);
      }
    }
  }
  #addLayer(div, name) {
    const pos = LAYERS_ORDER.get(name);
    const oldDiv = this.#layers[pos];
    this.#layers[pos] = div;
    if (oldDiv) {
      oldDiv.replaceWith(div);
      return;
    }
    for (let i = pos - 1; i >= 0; i--) {
      const layer = this.#layers[i];
      if (layer) {
        layer.after(div);
        return;
      }
    }
    this.div.prepend(div);
  }
  get renderingState() {
    return this.#renderingState;
  }
  set renderingState(state) {
    if (state === this.#renderingState) {
      return;
    }
    this.#renderingState = state;
    if (this.#loadingId) {
      clearTimeout(this.#loadingId);
      this.#loadingId = null;
    }
    switch (state) {
      case RenderingStates.PAUSED:
        this.div.classList.remove("loading");
        break;
      case RenderingStates.RUNNING:
        this.div.classList.add("loadingIcon");
        this.#loadingId = setTimeout(() => {
          this.div.classList.add("loading");
          this.#loadingId = null;
        }, 0);
        break;
      case RenderingStates.INITIAL:
      case RenderingStates.FINISHED:
        this.div.classList.remove("loadingIcon", "loading");
        break;
    }
  }
  #setDimensions() {
    const {
      viewport
    } = this;
    if (this.pdfPage) {
      if (this.#previousRotation === viewport.rotation) {
        return;
      }
      this.#previousRotation = viewport.rotation;
    }
    setLayerDimensions(this.div, viewport, true, false);
  }
  setPdfPage(pdfPage) {
    if (this._isStandalone && (this.pageColors?.foreground === "CanvasText" || this.pageColors?.background === "Canvas")) {
      this._container?.style.setProperty("--hcm-highlight-filter", pdfPage.filterFactory.addHighlightHCMFilter("highlight", "CanvasText", "Canvas", "HighlightText", "Highlight"));
      this._container?.style.setProperty("--hcm-highlight-selected-filter", pdfPage.filterFactory.addHighlightHCMFilter("highlight_selected", "CanvasText", "Canvas", "HighlightText", "Highlight"));
    }
    this.pdfPage = pdfPage;
    this.pdfPageRotate = pdfPage.rotate;
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = pdfPage.getViewport({
      scale: this.scale * PixelsPerInch.PDF_TO_CSS_UNITS,
      rotation: totalRotation
    });
    this.#setDimensions();
    this.reset();
  }
  destroy() {
    this.reset();
    this.pdfPage?.cleanup();
  }
  hasEditableAnnotations() {
    return !!this.annotationLayer?.hasEditableAnnotations();
  }
  get _textHighlighter() {
    return shadow(this, "_textHighlighter", new TextHighlighter({
      pageIndex: this.id - 1,
      eventBus: this.eventBus,
      findController: this.#layerProperties.findController
    }));
  }
  #dispatchLayerRendered(name, error) {
    this.eventBus.dispatch(name, {
      source: this,
      pageNumber: this.id,
      error
    });
  }
  async #renderAnnotationLayer() {
    let error = null;
    try {
      await this.annotationLayer.render(this.viewport, {
        structTreeLayer: this.structTreeLayer
      }, "display");
    } catch (ex) {
      console.error(`#renderAnnotationLayer: "${ex}".`);
      error = ex;
    } finally {
      this.#dispatchLayerRendered("annotationlayerrendered", error);
    }
  }
  async #renderAnnotationEditorLayer() {
    let error = null;
    try {
      await this.annotationEditorLayer.render(this.viewport, "display");
    } catch (ex) {
      console.error(`#renderAnnotationEditorLayer: "${ex}".`);
      error = ex;
    } finally {
      this.#dispatchLayerRendered("annotationeditorlayerrendered", error);
    }
  }
  async #renderDrawLayer() {
    try {
      await this.drawLayer.render("display");
    } catch (ex) {
      console.error(`#renderDrawLayer: "${ex}".`);
    }
  }
  async #renderXfaLayer() {
    let error = null;
    try {
      const result = await this.xfaLayer.render(this.viewport, "display");
      if (result?.textDivs && this._textHighlighter) {
        this.#buildXfaTextContentItems(result.textDivs);
      }
    } catch (ex) {
      console.error(`#renderXfaLayer: "${ex}".`);
      error = ex;
    } finally {
      if (this.xfaLayer?.div) {
        this.l10n.pause();
        this.#addLayer(this.xfaLayer.div, "xfaLayer");
        this.l10n.resume();
      }
      this.#dispatchLayerRendered("xfalayerrendered", error);
    }
  }
  async #renderTextLayer() {
    if (!this.textLayer) {
      return;
    }
    let error = null;
    try {
      await this.textLayer.render(this.viewport);
    } catch (ex) {
      if (ex instanceof AbortException) {
        return;
      }
      console.error(`#renderTextLayer: "${ex}".`);
      error = ex;
    }
    this.#dispatchLayerRendered("textlayerrendered", error);
    this.#renderStructTreeLayer();
  }
  async #renderStructTreeLayer() {
    if (!this.textLayer) {
      return;
    }
    const treeDom = await this.structTreeLayer?.render();
    if (treeDom) {
      this.l10n.pause();
      this.structTreeLayer?.addElementsToTextLayer();
      if (this.canvas && treeDom.parentNode !== this.canvas) {
        this.canvas.append(treeDom);
      }
      this.l10n.resume();
    }
    this.structTreeLayer?.show();
  }
  async #buildXfaTextContentItems(textDivs) {
    const text = await this.pdfPage.getTextContent();
    const items = [];
    for (const item of text.items) {
      items.push(item.str);
    }
    this._textHighlighter.setTextMapping(textDivs, items);
    this._textHighlighter.enable();
  }
  _resetZoomLayer(removeFromDOM = false) {
    if (!this.zoomLayer) {
      return;
    }
    const zoomLayerCanvas = this.zoomLayer.firstChild;
    this.#viewportMap.delete(zoomLayerCanvas);
    zoomLayerCanvas.width = 0;
    zoomLayerCanvas.height = 0;
    if (removeFromDOM) {
      this.zoomLayer.remove();
    }
    this.zoomLayer = null;
  }
  reset({
    keepZoomLayer = false,
    keepAnnotationLayer = false,
    keepAnnotationEditorLayer = false,
    keepXfaLayer = false,
    keepTextLayer = false
  } = {}) {
    this.cancelRendering({
      keepAnnotationLayer,
      keepAnnotationEditorLayer,
      keepXfaLayer,
      keepTextLayer
    });
    this.renderingState = RenderingStates.INITIAL;
    const div = this.div;
    const childNodes = div.childNodes,
      zoomLayerNode = keepZoomLayer && this.zoomLayer || null,
      annotationLayerNode = keepAnnotationLayer && this.annotationLayer?.div || null,
      annotationEditorLayerNode = keepAnnotationEditorLayer && this.annotationEditorLayer?.div || null,
      xfaLayerNode = keepXfaLayer && this.xfaLayer?.div || null,
      textLayerNode = keepTextLayer && this.textLayer?.div || null;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const node = childNodes[i];
      switch (node) {
        case zoomLayerNode:
        case annotationLayerNode:
        case annotationEditorLayerNode:
        case xfaLayerNode:
        case textLayerNode:
          continue;
      }
      node.remove();
      const layerIndex = this.#layers.indexOf(node);
      if (layerIndex >= 0) {
        this.#layers[layerIndex] = null;
      }
    }
    div.removeAttribute("data-loaded");
    if (annotationLayerNode) {
      this.annotationLayer.hide();
    }
    if (annotationEditorLayerNode) {
      this.annotationEditorLayer.hide();
    }
    if (xfaLayerNode) {
      this.xfaLayer.hide();
    }
    if (textLayerNode) {
      this.textLayer.hide();
    }
    this.structTreeLayer?.hide();
    if (!zoomLayerNode) {
      if (this.canvas) {
        this.#viewportMap.delete(this.canvas);
        this.canvas.width = 0;
        this.canvas.height = 0;
        delete this.canvas;
      }
      this._resetZoomLayer();
    }
  }
  toggleEditingMode(isEditing) {
    if (!this.hasEditableAnnotations()) {
      return;
    }
    this.#isEditing = isEditing;
    this.reset({
      keepZoomLayer: true,
      keepAnnotationLayer: true,
      keepAnnotationEditorLayer: true,
      keepXfaLayer: true,
      keepTextLayer: true
    });
  }
  update({
    scale = 0,
    rotation = null,
    optionalContentConfigPromise = null,
    drawingDelay = -1
  }) {
    this.scale = scale || this.scale;
    if (typeof rotation === "number") {
      this.rotation = rotation;
    }
    if (optionalContentConfigPromise instanceof Promise) {
      this._optionalContentConfigPromise = optionalContentConfigPromise;
      optionalContentConfigPromise.then(optionalContentConfig => {
        if (optionalContentConfigPromise !== this._optionalContentConfigPromise) {
          return;
        }
        this.#useThumbnailCanvas.initialOptionalContent = optionalContentConfig.hasInitialVisibility;
      });
    }
    this.#useThumbnailCanvas.directDrawing = true;
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = this.viewport.clone({
      scale: this.scale * PixelsPerInch.PDF_TO_CSS_UNITS,
      rotation: totalRotation
    });
    this.#setDimensions();
    if (this._isStandalone) {
      this._container?.style.setProperty("--scale-factor", this.viewport.scale);
    }
    if (this.canvas) {
      let onlyCssZoom = false;
      if (this.#hasRestrictedScaling) {
        if (this.maxCanvasPixels === 0) {
          onlyCssZoom = true;
        } else if (this.maxCanvasPixels > 0) {
          const {
            width,
            height
          } = this.viewport;
          const {
            sx,
            sy
          } = this.outputScale;
          onlyCssZoom = (Math.floor(width) * sx | 0) * (Math.floor(height) * sy | 0) > this.maxCanvasPixels;
        }
      }
      const postponeDrawing = drawingDelay >= 0 && drawingDelay < 1000;
      if (postponeDrawing || onlyCssZoom) {
        if (postponeDrawing && !onlyCssZoom && this.renderingState !== RenderingStates.FINISHED) {
          this.cancelRendering({
            keepZoomLayer: true,
            keepAnnotationLayer: true,
            keepAnnotationEditorLayer: true,
            keepXfaLayer: true,
            keepTextLayer: true,
            cancelExtraDelay: drawingDelay
          });
          this.renderingState = RenderingStates.FINISHED;
          this.#useThumbnailCanvas.directDrawing = false;
        }
        this.cssTransform({
          target: this.canvas,
          redrawAnnotationLayer: true,
          redrawAnnotationEditorLayer: true,
          redrawXfaLayer: true,
          redrawTextLayer: !postponeDrawing,
          hideTextLayer: postponeDrawing
        });
        if (postponeDrawing) {
          return;
        }
        this.eventBus.dispatch("pagerendered", {
          source: this,
          pageNumber: this.id,
          cssTransform: true,
          timestamp: performance.now(),
          error: this.#renderError
        });
        return;
      }
      if (!this.zoomLayer && !this.canvas.hidden) {
        this.zoomLayer = this.canvas.parentNode;
        this.zoomLayer.style.position = "absolute";
      }
    }
    if (this.zoomLayer) {
      this.cssTransform({
        target: this.zoomLayer.firstChild
      });
    }
    this.reset({
      keepZoomLayer: true,
      keepAnnotationLayer: true,
      keepAnnotationEditorLayer: true,
      keepXfaLayer: true,
      keepTextLayer: true
    });
  }
  cancelRendering({
    keepAnnotationLayer = false,
    keepAnnotationEditorLayer = false,
    keepXfaLayer = false,
    keepTextLayer = false,
    cancelExtraDelay = 0
  } = {}) {
    if (this.renderTask) {
      this.renderTask.cancel(cancelExtraDelay);
      this.renderTask = null;
    }
    this.resume = null;
    if (this.textLayer && (!keepTextLayer || !this.textLayer.div)) {
      this.textLayer.cancel();
      this.textLayer = null;
    }
    if (this.annotationLayer && (!keepAnnotationLayer || !this.annotationLayer.div)) {
      this.annotationLayer.cancel();
      this.annotationLayer = null;
      this._annotationCanvasMap = null;
    }
    if (this.structTreeLayer && !this.textLayer) {
      this.structTreeLayer = null;
    }
    if (this.annotationEditorLayer && (!keepAnnotationEditorLayer || !this.annotationEditorLayer.div)) {
      if (this.drawLayer) {
        this.drawLayer.cancel();
        this.drawLayer = null;
      }
      this.annotationEditorLayer.cancel();
      this.annotationEditorLayer = null;
    }
    if (this.xfaLayer && (!keepXfaLayer || !this.xfaLayer.div)) {
      this.xfaLayer.cancel();
      this.xfaLayer = null;
      this._textHighlighter?.disable();
    }
  }
  cssTransform({
    target,
    redrawAnnotationLayer = false,
    redrawAnnotationEditorLayer = false,
    redrawXfaLayer = false,
    redrawTextLayer = false,
    hideTextLayer = false
  }) {
    if (!target.hasAttribute("zooming")) {
      target.setAttribute("zooming", true);
      const {
        style
      } = target;
      style.width = style.height = "";
    }
    const originalViewport = this.#viewportMap.get(target);
    if (this.viewport !== originalViewport) {
      const relativeRotation = this.viewport.rotation - originalViewport.rotation;
      const absRotation = Math.abs(relativeRotation);
      let scaleX = 1,
        scaleY = 1;
      if (absRotation === 90 || absRotation === 270) {
        const {
          width,
          height
        } = this.viewport;
        scaleX = height / width;
        scaleY = width / height;
      }
      target.style.transform = `rotate(${relativeRotation}deg) scale(${scaleX}, ${scaleY})`;
    }
    if (redrawAnnotationLayer && this.annotationLayer) {
      this.#renderAnnotationLayer();
    }
    if (redrawAnnotationEditorLayer && this.annotationEditorLayer) {
      if (this.drawLayer) {
        this.#renderDrawLayer();
      }
      this.#renderAnnotationEditorLayer();
    }
    if (redrawXfaLayer && this.xfaLayer) {
      this.#renderXfaLayer();
    }
    if (this.textLayer) {
      if (hideTextLayer) {
        this.textLayer.hide();
        this.structTreeLayer?.hide();
      } else if (redrawTextLayer) {
        this.#renderTextLayer();
      }
    }
  }
  get width() {
    return this.viewport.width;
  }
  get height() {
    return this.viewport.height;
  }
  getPagePoint(x, y) {
    return this.viewport.convertToPdfPoint(x, y);
  }
  async #finishRenderTask(renderTask, error = null) {
    if (renderTask === this.renderTask) {
      this.renderTask = null;
    }
    if (error instanceof RenderingCancelledException) {
      this.#renderError = null;
      return;
    }
    this.#renderError = error;
    this.renderingState = RenderingStates.FINISHED;
    this._resetZoomLayer(true);
    this.#useThumbnailCanvas.regularAnnotations = !renderTask.separateAnnots;
    this.eventBus.dispatch("pagerendered", {
      source: this,
      pageNumber: this.id,
      cssTransform: false,
      timestamp: performance.now(),
      error: this.#renderError
    });
    if (error) {
      throw error;
    }
  }
  async draw() {
    if (this.renderingState !== RenderingStates.INITIAL) {
      console.error("Must be in new state before drawing");
      this.reset();
    }
    const {
      div,
      l10n,
      pageColors,
      pdfPage,
      viewport
    } = this;
    if (!pdfPage) {
      this.renderingState = RenderingStates.FINISHED;
      throw new Error("pdfPage is not loaded");
    }
    this.renderingState = RenderingStates.RUNNING;
    const canvasWrapper = document.createElement("div");
    canvasWrapper.classList.add("canvasWrapper");
    this.#addLayer(canvasWrapper, "canvasWrapper");
    if (!this.textLayer && this.#textLayerMode !== TextLayerMode.DISABLE && !pdfPage.isPureXfa) {
      this._accessibilityManager ||= new TextAccessibilityManager();
      this.textLayer = new TextLayerBuilder({
        pdfPage,
        highlighter: this._textHighlighter,
        accessibilityManager: this._accessibilityManager,
        enablePermissions: this.#textLayerMode === TextLayerMode.ENABLE_PERMISSIONS,
        onAppend: textLayerDiv => {
          this.l10n.pause();
          this.#addLayer(textLayerDiv, "textLayer");
          this.l10n.resume();
        }
      });
    }
    if (!this.annotationLayer && this.#annotationMode !== AnnotationMode.DISABLE) {
      const {
        annotationStorage,
        annotationEditorUIManager,
        downloadManager,
        enableScripting,
        fieldObjectsPromise,
        hasJSActionsPromise,
        linkService
      } = this.#layerProperties;
      this._annotationCanvasMap ||= new Map();
      this.annotationLayer = new AnnotationLayerBuilder({
        pdfPage,
        annotationStorage,
        imageResourcesPath: this.imageResourcesPath,
        renderForms: this.#annotationMode === AnnotationMode.ENABLE_FORMS,
        linkService,
        downloadManager,
        enableScripting,
        hasJSActionsPromise,
        fieldObjectsPromise,
        annotationCanvasMap: this._annotationCanvasMap,
        accessibilityManager: this._accessibilityManager,
        annotationEditorUIManager,
        onAppend: annotationLayerDiv => {
          this.#addLayer(annotationLayerDiv, "annotationLayer");
        }
      });
    }
    const renderContinueCallback = cont => {
      showCanvas?.(false);
      if (this.renderingQueue && !this.renderingQueue.isHighestPriority(this)) {
        this.renderingState = RenderingStates.PAUSED;
        this.resume = () => {
          this.renderingState = RenderingStates.RUNNING;
          cont();
        };
        return;
      }
      cont();
    };
    const {
      width,
      height
    } = viewport;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "presentation");
    canvas.hidden = true;
    const hasHCM = !!(pageColors?.background && pageColors?.foreground);
    let showCanvas = isLastShow => {
      if (!hasHCM || isLastShow) {
        canvas.hidden = false;
        showCanvas = null;
      }
    };
    canvasWrapper.append(canvas);
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: !this.#enableHWA
    });
    const outputScale = this.outputScale = new OutputScale();
    if (this.maxCanvasPixels === 0) {
      const invScale = 1 / this.scale;
      outputScale.sx *= invScale;
      outputScale.sy *= invScale;
      this.#hasRestrictedScaling = true;
    } else if (this.maxCanvasPixels > 0) {
      const pixelsInViewport = width * height;
      const maxScale = Math.sqrt(this.maxCanvasPixels / pixelsInViewport);
      if (outputScale.sx > maxScale || outputScale.sy > maxScale) {
        outputScale.sx = maxScale;
        outputScale.sy = maxScale;
        this.#hasRestrictedScaling = true;
      } else {
        this.#hasRestrictedScaling = false;
      }
    }
    const sfx = approximateFraction(outputScale.sx);
    const sfy = approximateFraction(outputScale.sy);
    const canvasWidth = canvas.width = floorToDivide(calcRound(width * outputScale.sx), sfx[0]);
    const canvasHeight = canvas.height = floorToDivide(calcRound(height * outputScale.sy), sfy[0]);
    const pageWidth = floorToDivide(calcRound(width), sfx[1]);
    const pageHeight = floorToDivide(calcRound(height), sfy[1]);
    outputScale.sx = canvasWidth / pageWidth;
    outputScale.sy = canvasHeight / pageHeight;
    if (this.#scaleRoundX !== sfx[1]) {
      div.style.setProperty("--scale-round-x", `${sfx[1]}px`);
      this.#scaleRoundX = sfx[1];
    }
    if (this.#scaleRoundY !== sfy[1]) {
      div.style.setProperty("--scale-round-y", `${sfy[1]}px`);
      this.#scaleRoundY = sfy[1];
    }
    this.#viewportMap.set(canvas, viewport);
    const transform = outputScale.scaled ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0] : null;
    const renderContext = {
      canvasContext: ctx,
      transform,
      viewport,
      annotationMode: this.#annotationMode,
      optionalContentConfigPromise: this._optionalContentConfigPromise,
      annotationCanvasMap: this._annotationCanvasMap,
      pageColors,
      isEditing: this.#isEditing
    };
    const renderTask = this.renderTask = pdfPage.render(renderContext);
    renderTask.onContinue = renderContinueCallback;
    const resultPromise = renderTask.promise.then(async () => {
      showCanvas?.(true);
      await this.#finishRenderTask(renderTask);
      this.structTreeLayer ||= new StructTreeLayerBuilder(pdfPage, viewport.rawDims);
      this.#renderTextLayer();
      if (this.annotationLayer) {
        await this.#renderAnnotationLayer();
      }
      const {
        annotationEditorUIManager
      } = this.#layerProperties;
      if (!annotationEditorUIManager) {
        return;
      }
      this.drawLayer ||= new DrawLayerBuilder({
        pageIndex: this.id
      });
      await this.#renderDrawLayer();
      this.drawLayer.setParent(canvasWrapper);
      this.annotationEditorLayer ||= new AnnotationEditorLayerBuilder({
        uiManager: annotationEditorUIManager,
        pdfPage,
        l10n,
        structTreeLayer: this.structTreeLayer,
        accessibilityManager: this._accessibilityManager,
        annotationLayer: this.annotationLayer?.annotationLayer,
        textLayer: this.textLayer,
        drawLayer: this.drawLayer.getDrawLayer(),
        onAppend: annotationEditorLayerDiv => {
          this.#addLayer(annotationEditorLayerDiv, "annotationEditorLayer");
        }
      });
      this.#renderAnnotationEditorLayer();
    }, error => {
      if (!(error instanceof RenderingCancelledException)) {
        showCanvas?.(true);
      }
      return this.#finishRenderTask(renderTask, error);
    });
    if (pdfPage.isPureXfa) {
      if (!this.xfaLayer) {
        const {
          annotationStorage,
          linkService
        } = this.#layerProperties;
        this.xfaLayer = new XfaLayerBuilder({
          pdfPage,
          annotationStorage,
          linkService
        });
      }
      this.#renderXfaLayer();
    }
    div.setAttribute("data-loaded", true);
    this.eventBus.dispatch("pagerender", {
      source: this,
      pageNumber: this.id
    });
    return resultPromise;
  }
  setPageLabel(label) {
    this.pageLabel = typeof label === "string" ? label : null;
    this.div.setAttribute("data-l10n-args", JSON.stringify({
      page: this.pageLabel ?? this.id
    }));
    if (this.pageLabel !== null) {
      this.div.setAttribute("data-page-label", this.pageLabel);
    } else {
      this.div.removeAttribute("data-page-label");
    }
  }
  get thumbnailCanvas() {
    const {
      directDrawing,
      initialOptionalContent,
      regularAnnotations
    } = this.#useThumbnailCanvas;
    return directDrawing && initialOptionalContent && regularAnnotations ? this.canvas : null;
  }
}

;// ./web/pdf_viewer.js






const DEFAULT_CACHE_SIZE = 10;
const PagesCountLimit = {
  FORCE_SCROLL_MODE_PAGE: 10000,
  FORCE_LAZY_PAGE_INIT: 5000,
  PAUSE_EAGER_PAGE_INIT: 250
};
function isValidAnnotationEditorMode(mode) {
  return Object.values(AnnotationEditorType).includes(mode) && mode !== AnnotationEditorType.DISABLE;
}
class PDFPageViewBuffer {
  #buf = new Set();
  #size = 0;
  constructor(size) {
    this.#size = size;
  }
  push(view) {
    const buf = this.#buf;
    if (buf.has(view)) {
      buf.delete(view);
    }
    buf.add(view);
    if (buf.size > this.#size) {
      this.#destroyFirstView();
    }
  }
  resize(newSize, idsToKeep = null) {
    this.#size = newSize;
    const buf = this.#buf;
    if (idsToKeep) {
      const ii = buf.size;
      let i = 1;
      for (const view of buf) {
        if (idsToKeep.has(view.id)) {
          buf.delete(view);
          buf.add(view);
        }
        if (++i > ii) {
          break;
        }
      }
    }
    while (buf.size > this.#size) {
      this.#destroyFirstView();
    }
  }
  has(view) {
    return this.#buf.has(view);
  }
  [Symbol.iterator]() {
    return this.#buf.keys();
  }
  #destroyFirstView() {
    const firstView = this.#buf.keys().next().value;
    firstView?.destroy();
    this.#buf.delete(firstView);
  }
}
class PDFViewer {
  #buffer = null;
  #altTextManager = null;
  #annotationEditorHighlightColors = null;
  #annotationEditorMode = AnnotationEditorType.NONE;
  #annotationEditorUIManager = null;
  #annotationMode = AnnotationMode.ENABLE_FORMS;
  #containerTopLeft = null;
  #enableHWA = false;
  #enableHighlightFloatingButton = false;
  #enablePermissions = false;
  #enableUpdatedAddImage = false;
  #enableNewAltTextWhenAddingImage = false;
  #eventAbortController = null;
  #mlManager = null;
  #switchAnnotationEditorModeAC = null;
  #switchAnnotationEditorModeTimeoutId = null;
  #getAllTextInProgress = false;
  #hiddenCopyElement = null;
  #interruptCopyCondition = false;
  #previousContainerHeight = 0;
  #resizeObserver = new ResizeObserver(this.#resizeObserverCallback.bind(this));
  #scrollModePageState = null;
  #scaleTimeoutId = null;
  #textLayerMode = TextLayerMode.ENABLE;
  constructor(options) {
    const viewerVersion = "4.7.76";
    if (version !== viewerVersion) {
      throw new Error(`The API version "${version}" does not match the Viewer version "${viewerVersion}".`);
    }
    this.container = options.container;
    this.viewer = options.viewer || options.container.firstElementChild;
    if (this.container?.tagName !== "DIV" || this.viewer?.tagName !== "DIV") {
      throw new Error("Invalid `container` and/or `viewer` option.");
    }
    if (this.container.offsetParent && getComputedStyle(this.container).position !== "absolute") {
      throw new Error("The `container` must be absolutely positioned.");
    }
    this.#resizeObserver.observe(this.container);
    this.eventBus = options.eventBus;
    this.linkService = options.linkService || new SimpleLinkService();
    this.downloadManager = options.downloadManager || null;
    this.findController = options.findController || null;
    this.#altTextManager = options.altTextManager || null;
    if (this.findController) {
      this.findController.onIsPageVisible = pageNumber => this._getVisiblePages().ids.has(pageNumber);
    }
    this._scriptingManager = options.scriptingManager || null;
    this.#textLayerMode = options.textLayerMode ?? TextLayerMode.ENABLE;
    this.#annotationMode = options.annotationMode ?? AnnotationMode.ENABLE_FORMS;
    this.#annotationEditorMode = options.annotationEditorMode ?? AnnotationEditorType.NONE;
    this.#annotationEditorHighlightColors = options.annotationEditorHighlightColors || null;
    this.#enableHighlightFloatingButton = options.enableHighlightFloatingButton === true;
    this.#enableUpdatedAddImage = options.enableUpdatedAddImage === true;
    this.#enableNewAltTextWhenAddingImage = options.enableNewAltTextWhenAddingImage === true;
    this.imageResourcesPath = options.imageResourcesPath || "";
    this.enablePrintAutoRotate = options.enablePrintAutoRotate || false;
    this.removePageBorders = options.removePageBorders || false;
    this.maxCanvasPixels = options.maxCanvasPixels;
    this.l10n = options.l10n;
    this.l10n ||= new genericl10n_GenericL10n();
    this.#enablePermissions = options.enablePermissions || false;
    this.pageColors = options.pageColors || null;
    this.#mlManager = options.mlManager || null;
    this.#enableHWA = options.enableHWA || false;
    this.defaultRenderingQueue = !options.renderingQueue;
    if (this.defaultRenderingQueue) {
      this.renderingQueue = new PDFRenderingQueue();
      this.renderingQueue.setViewer(this);
    } else {
      this.renderingQueue = options.renderingQueue;
    }
    const {
      abortSignal
    } = options;
    abortSignal?.addEventListener("abort", () => {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }, {
      once: true
    });
    this.scroll = watchScroll(this.container, this._scrollUpdate.bind(this), abortSignal);
    this.presentationModeState = PresentationModeState.UNKNOWN;
    this._resetView();
    if (this.removePageBorders) {
      this.viewer.classList.add("removePageBorders");
    }
    this.#updateContainerHeightCss();
    this.eventBus._on("thumbnailrendered", ({
      pageNumber,
      pdfPage
    }) => {
      const pageView = this._pages[pageNumber - 1];
      if (!this.#buffer.has(pageView)) {
        pdfPage?.cleanup();
      }
    });
    if (!options.l10n) {
      this.l10n.translate(this.container);
    }
  }
  get pagesCount() {
    return this._pages.length;
  }
  getPageView(index) {
    return this._pages[index];
  }
  getCachedPageViews() {
    return new Set(this.#buffer);
  }
  get pageViewsReady() {
    return this._pages.every(pageView => pageView?.pdfPage);
  }
  get renderForms() {
    return this.#annotationMode === AnnotationMode.ENABLE_FORMS;
  }
  get enableScripting() {
    return !!this._scriptingManager;
  }
  get currentPageNumber() {
    return this._currentPageNumber;
  }
  set currentPageNumber(val) {
    if (!Number.isInteger(val)) {
      throw new Error("Invalid page number.");
    }
    if (!this.pdfDocument) {
      return;
    }
    if (!this._setCurrentPageNumber(val, true)) {
      console.error(`currentPageNumber: "${val}" is not a valid page.`);
    }
  }
  _setCurrentPageNumber(val, resetCurrentPageView = false) {
    if (this._currentPageNumber === val) {
      if (resetCurrentPageView) {
        this.#resetCurrentPageView();
      }
      return true;
    }
    if (!(0 < val && val <= this.pagesCount)) {
      return false;
    }
    const previous = this._currentPageNumber;
    this._currentPageNumber = val;
    this.eventBus.dispatch("pagechanging", {
      source: this,
      pageNumber: val,
      pageLabel: this._pageLabels?.[val - 1] ?? null,
      previous
    });
    if (resetCurrentPageView) {
      this.#resetCurrentPageView();
    }
    return true;
  }
  get currentPageLabel() {
    return this._pageLabels?.[this._currentPageNumber - 1] ?? null;
  }
  set currentPageLabel(val) {
    if (!this.pdfDocument) {
      return;
    }
    let page = val | 0;
    if (this._pageLabels) {
      const i = this._pageLabels.indexOf(val);
      if (i >= 0) {
        page = i + 1;
      }
    }
    if (!this._setCurrentPageNumber(page, true)) {
      console.error(`currentPageLabel: "${val}" is not a valid page.`);
    }
  }
  get currentScale() {
    return this._currentScale !== UNKNOWN_SCALE ? this._currentScale : DEFAULT_SCALE;
  }
  set currentScale(val) {
    if (isNaN(val)) {
      throw new Error("Invalid numeric scale.");
    }
    if (!this.pdfDocument) {
      return;
    }
    this.#setScale(val, {
      noScroll: false
    });
  }
  get currentScaleValue() {
    return this._currentScaleValue;
  }
  set currentScaleValue(val) {
    if (!this.pdfDocument) {
      return;
    }
    this.#setScale(val, {
      noScroll: false
    });
  }
  get pagesRotation() {
    return this._pagesRotation;
  }
  set pagesRotation(rotation) {
    if (!isValidRotation(rotation)) {
      throw new Error("Invalid pages rotation angle.");
    }
    if (!this.pdfDocument) {
      return;
    }
    rotation %= 360;
    if (rotation < 0) {
      rotation += 360;
    }
    if (this._pagesRotation === rotation) {
      return;
    }
    this._pagesRotation = rotation;
    const pageNumber = this._currentPageNumber;
    this.refresh(true, {
      rotation
    });
    if (this._currentScaleValue) {
      this.#setScale(this._currentScaleValue, {
        noScroll: true
      });
    }
    this.eventBus.dispatch("rotationchanging", {
      source: this,
      pagesRotation: rotation,
      pageNumber
    });
    if (this.defaultRenderingQueue) {
      this.update();
    }
  }
  get firstPagePromise() {
    return this.pdfDocument ? this._firstPageCapability.promise : null;
  }
  get onePageRendered() {
    return this.pdfDocument ? this._onePageRenderedCapability.promise : null;
  }
  get pagesPromise() {
    return this.pdfDocument ? this._pagesCapability.promise : null;
  }
  get _layerProperties() {
    const self = this;
    return shadow(this, "_layerProperties", {
      get annotationEditorUIManager() {
        return self.#annotationEditorUIManager;
      },
      get annotationStorage() {
        return self.pdfDocument?.annotationStorage;
      },
      get downloadManager() {
        return self.downloadManager;
      },
      get enableScripting() {
        return !!self._scriptingManager;
      },
      get fieldObjectsPromise() {
        return self.pdfDocument?.getFieldObjects();
      },
      get findController() {
        return self.findController;
      },
      get hasJSActionsPromise() {
        return self.pdfDocument?.hasJSActions();
      },
      get linkService() {
        return self.linkService;
      }
    });
  }
  #initializePermissions(permissions) {
    const params = {
      annotationEditorMode: this.#annotationEditorMode,
      annotationMode: this.#annotationMode,
      textLayerMode: this.#textLayerMode
    };
    if (!permissions) {
      return params;
    }
    if (!permissions.includes(PermissionFlag.COPY) && this.#textLayerMode === TextLayerMode.ENABLE) {
      params.textLayerMode = TextLayerMode.ENABLE_PERMISSIONS;
    }
    if (!permissions.includes(PermissionFlag.MODIFY_CONTENTS)) {
      params.annotationEditorMode = AnnotationEditorType.DISABLE;
    }
    if (!permissions.includes(PermissionFlag.MODIFY_ANNOTATIONS) && !permissions.includes(PermissionFlag.FILL_INTERACTIVE_FORMS) && this.#annotationMode === AnnotationMode.ENABLE_FORMS) {
      params.annotationMode = AnnotationMode.ENABLE;
    }
    return params;
  }
  async #onePageRenderedOrForceFetch(signal) {
    if (document.visibilityState === "hidden" || !this.container.offsetParent || this._getVisiblePages().views.length === 0) {
      return;
    }
    const hiddenCapability = Promise.withResolvers(),
      ac = new AbortController();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        hiddenCapability.resolve();
      }
    }, {
      signal: typeof AbortSignal.any === "function" ? AbortSignal.any([signal, ac.signal]) : signal
    });
    await Promise.race([this._onePageRenderedCapability.promise, hiddenCapability.promise]);
    ac.abort();
  }
  async getAllText() {
    const texts = [];
    const buffer = [];
    for (let pageNum = 1, pagesCount = this.pdfDocument.numPages; pageNum <= pagesCount; ++pageNum) {
      if (this.#interruptCopyCondition) {
        return null;
      }
      buffer.length = 0;
      const page = await this.pdfDocument.getPage(pageNum);
      const {
        items
      } = await page.getTextContent();
      for (const item of items) {
        if (item.str) {
          buffer.push(item.str);
        }
        if (item.hasEOL) {
          buffer.push("\n");
        }
      }
      texts.push(removeNullCharacters(buffer.join("")));
    }
    return texts.join("\n");
  }
  #copyCallback(textLayerMode, event) {
    const selection = document.getSelection();
    const {
      focusNode,
      anchorNode
    } = selection;
    if (anchorNode && focusNode && selection.containsNode(this.#hiddenCopyElement)) {
      if (this.#getAllTextInProgress || textLayerMode === TextLayerMode.ENABLE_PERMISSIONS) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      this.#getAllTextInProgress = true;
      const {
        classList
      } = this.viewer;
      classList.add("copyAll");
      const ac = new AbortController();
      window.addEventListener("keydown", ev => this.#interruptCopyCondition = ev.key === "Escape", {
        signal: ac.signal
      });
      this.getAllText().then(async text => {
        if (text !== null) {
          await navigator.clipboard.writeText(text);
        }
      }).catch(reason => {
        console.warn(`Something goes wrong when extracting the text: ${reason.message}`);
      }).finally(() => {
        this.#getAllTextInProgress = false;
        this.#interruptCopyCondition = false;
        ac.abort();
        classList.remove("copyAll");
      });
      event.preventDefault();
      event.stopPropagation();
    }
  }
  setDocument(pdfDocument) {
    if (this.pdfDocument) {
      this.eventBus.dispatch("pagesdestroy", {
        source: this
      });
      this._cancelRendering();
      this._resetView();
      this.findController?.setDocument(null);
      this._scriptingManager?.setDocument(null);
      this.#annotationEditorUIManager?.destroy();
      this.#annotationEditorUIManager = null;
    }
    this.pdfDocument = pdfDocument;
    if (!pdfDocument) {
      return;
    }
    const pagesCount = pdfDocument.numPages;
    const firstPagePromise = pdfDocument.getPage(1);
    const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig({
      intent: "display"
    });
    const permissionsPromise = this.#enablePermissions ? pdfDocument.getPermissions() : Promise.resolve();
    const {
      eventBus,
      pageColors,
      viewer
    } = this;
    this.#eventAbortController = new AbortController();
    const {
      signal
    } = this.#eventAbortController;
    if (pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE) {
      console.warn("Forcing PAGE-scrolling for performance reasons, given the length of the document.");
      const mode = this._scrollMode = ScrollMode.PAGE;
      eventBus.dispatch("scrollmodechanged", {
        source: this,
        mode
      });
    }
    this._pagesCapability.promise.then(() => {
      eventBus.dispatch("pagesloaded", {
        source: this,
        pagesCount
      });
    }, () => {});
    const onBeforeDraw = evt => {
      const pageView = this._pages[evt.pageNumber - 1];
      if (!pageView) {
        return;
      }
      this.#buffer.push(pageView);
    };
    eventBus._on("pagerender", onBeforeDraw, {
      signal
    });
    const onAfterDraw = evt => {
      if (evt.cssTransform) {
        return;
      }
      this._onePageRenderedCapability.resolve({
        timestamp: evt.timestamp
      });
      eventBus._off("pagerendered", onAfterDraw);
    };
    eventBus._on("pagerendered", onAfterDraw, {
      signal
    });
    Promise.all([firstPagePromise, permissionsPromise]).then(([firstPdfPage, permissions]) => {
      if (pdfDocument !== this.pdfDocument) {
        return;
      }
      this._firstPageCapability.resolve(firstPdfPage);
      this._optionalContentConfigPromise = optionalContentConfigPromise;
      const {
        annotationEditorMode,
        annotationMode,
        textLayerMode
      } = this.#initializePermissions(permissions);
      if (textLayerMode !== TextLayerMode.DISABLE) {
        const element = this.#hiddenCopyElement = document.createElement("div");
        element.id = "hiddenCopyElement";
        viewer.before(element);
      }
      if (typeof AbortSignal.any === "function" && annotationEditorMode !== AnnotationEditorType.DISABLE) {
        const mode = annotationEditorMode;
        if (pdfDocument.isPureXfa) {
          console.warn("Warning: XFA-editing is not implemented.");
        } else if (isValidAnnotationEditorMode(mode)) {
          this.#annotationEditorUIManager = new AnnotationEditorUIManager(this.container, viewer, this.#altTextManager, eventBus, pdfDocument, pageColors, this.#annotationEditorHighlightColors, this.#enableHighlightFloatingButton, this.#enableUpdatedAddImage, this.#enableNewAltTextWhenAddingImage, this.#mlManager);
          eventBus.dispatch("annotationeditoruimanager", {
            source: this,
            uiManager: this.#annotationEditorUIManager
          });
          if (mode !== AnnotationEditorType.NONE) {
            if (mode === AnnotationEditorType.STAMP) {
              this.#mlManager?.loadModel("altText");
            }
            this.#annotationEditorUIManager.updateMode(mode);
          }
        } else {
          console.error(`Invalid AnnotationEditor mode: ${mode}`);
        }
      }
      const viewerElement = this._scrollMode === ScrollMode.PAGE ? null : viewer;
      const scale = this.currentScale;
      const viewport = firstPdfPage.getViewport({
        scale: scale * PixelsPerInch.PDF_TO_CSS_UNITS
      });
      viewer.style.setProperty("--scale-factor", viewport.scale);
      if (pageColors?.background) {
        viewer.style.setProperty("--page-bg-color", pageColors.background);
      }
      if (pageColors?.foreground === "CanvasText" || pageColors?.background === "Canvas") {
        viewer.style.setProperty("--hcm-highlight-filter", pdfDocument.filterFactory.addHighlightHCMFilter("highlight", "CanvasText", "Canvas", "HighlightText", "Highlight"));
        viewer.style.setProperty("--hcm-highlight-selected-filter", pdfDocument.filterFactory.addHighlightHCMFilter("highlight_selected", "CanvasText", "Canvas", "HighlightText", "ButtonText"));
      }
      for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
        const pageView = new PDFPageView({
          container: viewerElement,
          eventBus,
          id: pageNum,
          scale,
          defaultViewport: viewport.clone(),
          optionalContentConfigPromise,
          renderingQueue: this.renderingQueue,
          textLayerMode,
          annotationMode,
          imageResourcesPath: this.imageResourcesPath,
          maxCanvasPixels: this.maxCanvasPixels,
          pageColors,
          l10n: this.l10n,
          layerProperties: this._layerProperties,
          enableHWA: this.#enableHWA
        });
        this._pages.push(pageView);
      }
      this._pages[0]?.setPdfPage(firstPdfPage);
      if (this._scrollMode === ScrollMode.PAGE) {
        this.#ensurePageViewVisible();
      } else if (this._spreadMode !== SpreadMode.NONE) {
        this._updateSpreadMode();
      }
      this.#onePageRenderedOrForceFetch(signal).then(async () => {
        if (pdfDocument !== this.pdfDocument) {
          return;
        }
        this.findController?.setDocument(pdfDocument);
        this._scriptingManager?.setDocument(pdfDocument);
        if (this.#hiddenCopyElement) {
          document.addEventListener("copy", this.#copyCallback.bind(this, textLayerMode), {
            signal
          });
        }
        if (this.#annotationEditorUIManager) {
          eventBus.dispatch("annotationeditormodechanged", {
            source: this,
            mode: this.#annotationEditorMode
          });
        }
        if (pdfDocument.loadingParams.disableAutoFetch || pagesCount > PagesCountLimit.FORCE_LAZY_PAGE_INIT) {
          this._pagesCapability.resolve();
          return;
        }
        let getPagesLeft = pagesCount - 1;
        if (getPagesLeft <= 0) {
          this._pagesCapability.resolve();
          return;
        }
        for (let pageNum = 2; pageNum <= pagesCount; ++pageNum) {
          const promise = pdfDocument.getPage(pageNum).then(pdfPage => {
            const pageView = this._pages[pageNum - 1];
            if (!pageView.pdfPage) {
              pageView.setPdfPage(pdfPage);
            }
            if (--getPagesLeft === 0) {
              this._pagesCapability.resolve();
            }
          }, reason => {
            console.error(`Unable to get page ${pageNum} to initialize viewer`, reason);
            if (--getPagesLeft === 0) {
              this._pagesCapability.resolve();
            }
          });
          if (pageNum % PagesCountLimit.PAUSE_EAGER_PAGE_INIT === 0) {
            await promise;
          }
        }
      });
      eventBus.dispatch("pagesinit", {
        source: this
      });
      pdfDocument.getMetadata().then(({
        info
      }) => {
        if (pdfDocument !== this.pdfDocument) {
          return;
        }
        if (info.Language) {
          viewer.lang = info.Language;
        }
      });
      if (this.defaultRenderingQueue) {
        this.update();
      }
    }).catch(reason => {
      console.error("Unable to initialize viewer", reason);
      this._pagesCapability.reject(reason);
    });
  }
  setPageLabels(labels) {
    if (!this.pdfDocument) {
      return;
    }
    if (!labels) {
      this._pageLabels = null;
    } else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
      this._pageLabels = null;
      console.error(`setPageLabels: Invalid page labels.`);
    } else {
      this._pageLabels = labels;
    }
    for (let i = 0, ii = this._pages.length; i < ii; i++) {
      this._pages[i].setPageLabel(this._pageLabels?.[i] ?? null);
    }
  }
  _resetView() {
    this._pages = [];
    this._currentPageNumber = 1;
    this._currentScale = UNKNOWN_SCALE;
    this._currentScaleValue = null;
    this._pageLabels = null;
    this.#buffer = new PDFPageViewBuffer(DEFAULT_CACHE_SIZE);
    this._location = null;
    this._pagesRotation = 0;
    this._optionalContentConfigPromise = null;
    this._firstPageCapability = Promise.withResolvers();
    this._onePageRenderedCapability = Promise.withResolvers();
    this._pagesCapability = Promise.withResolvers();
    this._scrollMode = ScrollMode.VERTICAL;
    this._previousScrollMode = ScrollMode.UNKNOWN;
    this._spreadMode = SpreadMode.NONE;
    this.#scrollModePageState = {
      previousPageNumber: 1,
      scrollDown: true,
      pages: []
    };
    this.#eventAbortController?.abort();
    this.#eventAbortController = null;
    this.viewer.textContent = "";
    this._updateScrollMode();
    this.viewer.removeAttribute("lang");
    this.#hiddenCopyElement?.remove();
    this.#hiddenCopyElement = null;
    this.#cleanupSwitchAnnotationEditorMode();
  }
  #ensurePageViewVisible() {
    if (this._scrollMode !== ScrollMode.PAGE) {
      throw new Error("#ensurePageViewVisible: Invalid scrollMode value.");
    }
    const pageNumber = this._currentPageNumber,
      state = this.#scrollModePageState,
      viewer = this.viewer;
    viewer.textContent = "";
    state.pages.length = 0;
    if (this._spreadMode === SpreadMode.NONE && !this.isInPresentationMode) {
      const pageView = this._pages[pageNumber - 1];
      viewer.append(pageView.div);
      state.pages.push(pageView);
    } else {
      const pageIndexSet = new Set(),
        parity = this._spreadMode - 1;
      if (parity === -1) {
        pageIndexSet.add(pageNumber - 1);
      } else if (pageNumber % 2 !== parity) {
        pageIndexSet.add(pageNumber - 1);
        pageIndexSet.add(pageNumber);
      } else {
        pageIndexSet.add(pageNumber - 2);
        pageIndexSet.add(pageNumber - 1);
      }
      const spread = document.createElement("div");
      spread.className = "spread";
      if (this.isInPresentationMode) {
        const dummyPage = document.createElement("div");
        dummyPage.className = "dummyPage";
        spread.append(dummyPage);
      }
      for (const i of pageIndexSet) {
        const pageView = this._pages[i];
        if (!pageView) {
          continue;
        }
        spread.append(pageView.div);
        state.pages.push(pageView);
      }
      viewer.append(spread);
    }
    state.scrollDown = pageNumber >= state.previousPageNumber;
    state.previousPageNumber = pageNumber;
  }
  _scrollUpdate() {
    if (this.pagesCount === 0) {
      return;
    }
    this.update();
  }
  #scrollIntoView(pageView, pageSpot = null) {
    const {
      div,
      id
    } = pageView;
    if (this._currentPageNumber !== id) {
      this._setCurrentPageNumber(id);
    }
    if (this._scrollMode === ScrollMode.PAGE) {
      this.#ensurePageViewVisible();
      this.update();
    }
    if (!pageSpot && !this.isInPresentationMode) {
      const left = div.offsetLeft + div.clientLeft,
        right = left + div.clientWidth;
      const {
        scrollLeft,
        clientWidth
      } = this.container;
      if (this._scrollMode === ScrollMode.HORIZONTAL || left < scrollLeft || right > scrollLeft + clientWidth) {
        pageSpot = {
          left: 0,
          top: 0
        };
      }
    }
    scrollIntoView(div, pageSpot);
    if (!this._currentScaleValue && this._location) {
      this._location = null;
    }
  }
  #isSameScale(newScale) {
    return newScale === this._currentScale || Math.abs(newScale - this._currentScale) < 1e-15;
  }
  #setScaleUpdatePages(newScale, newValue, {
    noScroll = false,
    preset = false,
    drawingDelay = -1,
    origin = null
  }) {
    this._currentScaleValue = newValue.toString();
    if (this.#isSameScale(newScale)) {
      if (preset) {
        this.eventBus.dispatch("scalechanging", {
          source: this,
          scale: newScale,
          presetValue: newValue
        });
      }
      return;
    }
    this.viewer.style.setProperty("--scale-factor", newScale * PixelsPerInch.PDF_TO_CSS_UNITS);
    const postponeDrawing = drawingDelay >= 0 && drawingDelay < 1000;
    this.refresh(true, {
      scale: newScale,
      drawingDelay: postponeDrawing ? drawingDelay : -1
    });
    if (postponeDrawing) {
      this.#scaleTimeoutId = setTimeout(() => {
        this.#scaleTimeoutId = null;
        this.refresh();
      }, drawingDelay);
    }
    const previousScale = this._currentScale;
    this._currentScale = newScale;
    if (!noScroll) {
      let page = this._currentPageNumber,
        dest;
      if (this._location && !(this.isInPresentationMode || this.isChangingPresentationMode)) {
        page = this._location.pageNumber;
        dest = [null, {
          name: "XYZ"
        }, this._location.left, this._location.top, null];
      }
      this.scrollPageIntoView({
        pageNumber: page,
        destArray: dest,
        allowNegativeOffset: true
      });
      if (Array.isArray(origin)) {
        const scaleDiff = newScale / previousScale - 1;
        const [top, left] = this.containerTopLeft;
        this.container.scrollLeft += (origin[0] - left) * scaleDiff;
        this.container.scrollTop += (origin[1] - top) * scaleDiff;
      }
    }
    this.eventBus.dispatch("scalechanging", {
      source: this,
      scale: newScale,
      presetValue: preset ? newValue : undefined
    });
    if (this.defaultRenderingQueue) {
      this.update();
    }
  }
  get #pageWidthScaleFactor() {
    if (this._spreadMode !== SpreadMode.NONE && this._scrollMode !== ScrollMode.HORIZONTAL) {
      return 2;
    }
    return 1;
  }
  #setScale(value, options) {
    let scale = parseFloat(value);
    if (scale > 0) {
      options.preset = false;
      this.#setScaleUpdatePages(scale, value, options);
    } else {
      const currentPage = this._pages[this._currentPageNumber - 1];
      if (!currentPage) {
        return;
      }
      let hPadding = SCROLLBAR_PADDING,
        vPadding = VERTICAL_PADDING;
      if (this.isInPresentationMode) {
        hPadding = vPadding = 4;
        if (this._spreadMode !== SpreadMode.NONE) {
          hPadding *= 2;
        }
      } else if (this.removePageBorders) {
        hPadding = vPadding = 0;
      } else if (this._scrollMode === ScrollMode.HORIZONTAL) {
        [hPadding, vPadding] = [vPadding, hPadding];
      }
      const pageWidthScale = (this.container.clientWidth - hPadding) / currentPage.width * currentPage.scale / this.#pageWidthScaleFactor;
      const pageHeightScale = (this.container.clientHeight - vPadding) / currentPage.height * currentPage.scale;
      switch (value) {
        case "page-actual":
          scale = 1;
          break;
        case "page-width":
          scale = pageWidthScale;
          break;
        case "page-height":
          scale = pageHeightScale;
          break;
        case "page-fit":
          scale = Math.min(pageWidthScale, pageHeightScale);
          break;
        case "auto":
          const horizontalScale = isPortraitOrientation(currentPage) ? pageWidthScale : Math.min(pageHeightScale, pageWidthScale);
          scale = Math.min(MAX_AUTO_SCALE, horizontalScale);
          break;
        default:
          console.error(`#setScale: "${value}" is an unknown zoom value.`);
          return;
      }
      options.preset = true;
      this.#setScaleUpdatePages(scale, value, options);
    }
  }
  #resetCurrentPageView() {
    const pageView = this._pages[this._currentPageNumber - 1];
    if (this.isInPresentationMode) {
      this.#setScale(this._currentScaleValue, {
        noScroll: true
      });
    }
    this.#scrollIntoView(pageView);
  }
  pageLabelToPageNumber(label) {
    if (!this._pageLabels) {
      return null;
    }
    const i = this._pageLabels.indexOf(label);
    if (i < 0) {
      return null;
    }
    return i + 1;
  }
  scrollPageIntoView({
    pageNumber,
    destArray = null,
    allowNegativeOffset = false,
    ignoreDestinationZoom = false
  }) {
    if (!this.pdfDocument) {
      return;
    }
    const pageView = Number.isInteger(pageNumber) && this._pages[pageNumber - 1];
    if (!pageView) {
      console.error(`scrollPageIntoView: "${pageNumber}" is not a valid pageNumber parameter.`);
      return;
    }
    if (this.isInPresentationMode || !destArray) {
      this._setCurrentPageNumber(pageNumber, true);
      return;
    }
    let x = 0,
      y = 0;
    let width = 0,
      height = 0,
      widthScale,
      heightScale;
    const changeOrientation = pageView.rotation % 180 !== 0;
    const pageWidth = (changeOrientation ? pageView.height : pageView.width) / pageView.scale / PixelsPerInch.PDF_TO_CSS_UNITS;
    const pageHeight = (changeOrientation ? pageView.width : pageView.height) / pageView.scale / PixelsPerInch.PDF_TO_CSS_UNITS;
    let scale = 0;
    switch (destArray[1].name) {
      case "XYZ":
        x = destArray[2];
        y = destArray[3];
        scale = destArray[4];
        x = x !== null ? x : 0;
        y = y !== null ? y : pageHeight;
        break;
      case "Fit":
      case "FitB":
        scale = "page-fit";
        break;
      case "FitH":
      case "FitBH":
        y = destArray[2];
        scale = "page-width";
        if (y === null && this._location) {
          x = this._location.left;
          y = this._location.top;
        } else if (typeof y !== "number" || y < 0) {
          y = pageHeight;
        }
        break;
      case "FitV":
      case "FitBV":
        x = destArray[2];
        width = pageWidth;
        height = pageHeight;
        scale = "page-height";
        break;
      case "FitR":
        x = destArray[2];
        y = destArray[3];
        width = destArray[4] - x;
        height = destArray[5] - y;
        let hPadding = SCROLLBAR_PADDING,
          vPadding = VERTICAL_PADDING;
        if (this.removePageBorders) {
          hPadding = vPadding = 0;
        }
        widthScale = (this.container.clientWidth - hPadding) / width / PixelsPerInch.PDF_TO_CSS_UNITS;
        heightScale = (this.container.clientHeight - vPadding) / height / PixelsPerInch.PDF_TO_CSS_UNITS;
        scale = Math.min(Math.abs(widthScale), Math.abs(heightScale));
        break;
      default:
        console.error(`scrollPageIntoView: "${destArray[1].name}" is not a valid destination type.`);
        return;
    }
    if (!ignoreDestinationZoom) {
      if (scale && scale !== this._currentScale) {
        this.currentScaleValue = scale;
      } else if (this._currentScale === UNKNOWN_SCALE) {
        this.currentScaleValue = DEFAULT_SCALE_VALUE;
      }
    }
    if (scale === "page-fit" && !destArray[4]) {
      this.#scrollIntoView(pageView);
      return;
    }
    const boundingRect = [pageView.viewport.convertToViewportPoint(x, y), pageView.viewport.convertToViewportPoint(x + width, y + height)];
    let left = Math.min(boundingRect[0][0], boundingRect[1][0]);
    let top = Math.min(boundingRect[0][1], boundingRect[1][1]);
    if (!allowNegativeOffset) {
      left = Math.max(left, 0);
      top = Math.max(top, 0);
    }
    this.#scrollIntoView(pageView, {
      left,
      top
    });
  }
  _updateLocation(firstPage) {
    const currentScale = this._currentScale;
    const currentScaleValue = this._currentScaleValue;
    const normalizedScaleValue = parseFloat(currentScaleValue) === currentScale ? Math.round(currentScale * 10000) / 100 : currentScaleValue;
    const pageNumber = firstPage.id;
    const currentPageView = this._pages[pageNumber - 1];
    const container = this.container;
    const topLeft = currentPageView.getPagePoint(container.scrollLeft - firstPage.x, container.scrollTop - firstPage.y);
    const intLeft = Math.round(topLeft[0]);
    const intTop = Math.round(topLeft[1]);
    let pdfOpenParams = `#page=${pageNumber}`;
    if (!this.isInPresentationMode) {
      pdfOpenParams += `&zoom=${normalizedScaleValue},${intLeft},${intTop}`;
    }
    this._location = {
      pageNumber,
      scale: normalizedScaleValue,
      top: intTop,
      left: intLeft,
      rotation: this._pagesRotation,
      pdfOpenParams
    };
  }
  update() {
    const visible = this._getVisiblePages();
    const visiblePages = visible.views,
      numVisiblePages = visiblePages.length;
    if (numVisiblePages === 0) {
      return;
    }
    const newCacheSize = Math.max(DEFAULT_CACHE_SIZE, 2 * numVisiblePages + 1);
    this.#buffer.resize(newCacheSize, visible.ids);
    this.renderingQueue.renderHighestPriority(visible);
    const isSimpleLayout = this._spreadMode === SpreadMode.NONE && (this._scrollMode === ScrollMode.PAGE || this._scrollMode === ScrollMode.VERTICAL);
    const currentId = this._currentPageNumber;
    let stillFullyVisible = false;
    for (const page of visiblePages) {
      if (page.percent < 100) {
        break;
      }
      if (page.id === currentId && isSimpleLayout) {
        stillFullyVisible = true;
        break;
      }
    }
    this._setCurrentPageNumber(stillFullyVisible ? currentId : visiblePages[0].id);
    this._updateLocation(visible.first);
    this.eventBus.dispatch("updateviewarea", {
      source: this,
      location: this._location
    });
  }
  #switchToEditAnnotationMode() {
    const visible = this._getVisiblePages();
    const pagesToRefresh = [];
    const {
      ids,
      views
    } = visible;
    for (const page of views) {
      const {
        view
      } = page;
      if (!view.hasEditableAnnotations()) {
        ids.delete(view.id);
        continue;
      }
      pagesToRefresh.push(page);
    }
    if (pagesToRefresh.length === 0) {
      return null;
    }
    this.renderingQueue.renderHighestPriority({
      first: pagesToRefresh[0],
      last: pagesToRefresh.at(-1),
      views: pagesToRefresh,
      ids
    });
    return ids;
  }
  containsElement(element) {
    return this.container.contains(element);
  }
  focus() {
    this.container.focus();
  }
  get _isContainerRtl() {
    return getComputedStyle(this.container).direction === "rtl";
  }
  get isInPresentationMode() {
    return this.presentationModeState === PresentationModeState.FULLSCREEN;
  }
  get isChangingPresentationMode() {
    return this.presentationModeState === PresentationModeState.CHANGING;
  }
  get isHorizontalScrollbarEnabled() {
    return this.isInPresentationMode ? false : this.container.scrollWidth > this.container.clientWidth;
  }
  get isVerticalScrollbarEnabled() {
    return this.isInPresentationMode ? false : this.container.scrollHeight > this.container.clientHeight;
  }
  _getVisiblePages() {
    const views = this._scrollMode === ScrollMode.PAGE ? this.#scrollModePageState.pages : this._pages,
      horizontal = this._scrollMode === ScrollMode.HORIZONTAL,
      rtl = horizontal && this._isContainerRtl;
    return getVisibleElements({
      scrollEl: this.container,
      views,
      sortByVisibility: true,
      horizontal,
      rtl
    });
  }
  cleanup() {
    for (const pageView of this._pages) {
      if (pageView.renderingState !== RenderingStates.FINISHED) {
        pageView.reset();
      }
    }
  }
  _cancelRendering() {
    for (const pageView of this._pages) {
      pageView.cancelRendering();
    }
  }
  async #ensurePdfPageLoaded(pageView) {
    if (pageView.pdfPage) {
      return pageView.pdfPage;
    }
    try {
      const pdfPage = await this.pdfDocument.getPage(pageView.id);
      if (!pageView.pdfPage) {
        pageView.setPdfPage(pdfPage);
      }
      return pdfPage;
    } catch (reason) {
      console.error("Unable to get page for page view", reason);
      return null;
    }
  }
  #getScrollAhead(visible) {
    if (visible.first?.id === 1) {
      return true;
    } else if (visible.last?.id === this.pagesCount) {
      return false;
    }
    switch (this._scrollMode) {
      case ScrollMode.PAGE:
        return this.#scrollModePageState.scrollDown;
      case ScrollMode.HORIZONTAL:
        return this.scroll.right;
    }
    return this.scroll.down;
  }
  forceRendering(currentlyVisiblePages) {
    const visiblePages = currentlyVisiblePages || this._getVisiblePages();
    const scrollAhead = this.#getScrollAhead(visiblePages);
    const preRenderExtra = this._spreadMode !== SpreadMode.NONE && this._scrollMode !== ScrollMode.HORIZONTAL;
    const pageView = this.renderingQueue.getHighestPriority(visiblePages, this._pages, scrollAhead, preRenderExtra);
    if (pageView) {
      this.#ensurePdfPageLoaded(pageView).then(() => {
        this.renderingQueue.renderView(pageView);
      });
      return true;
    }
    return false;
  }
  get hasEqualPageSizes() {
    const firstPageView = this._pages[0];
    for (let i = 1, ii = this._pages.length; i < ii; ++i) {
      const pageView = this._pages[i];
      if (pageView.width !== firstPageView.width || pageView.height !== firstPageView.height) {
        return false;
      }
    }
    return true;
  }
  getPagesOverview() {
    let initialOrientation;
    return this._pages.map(pageView => {
      const viewport = pageView.pdfPage.getViewport({
        scale: 1
      });
      const orientation = isPortraitOrientation(viewport);
      if (initialOrientation === undefined) {
        initialOrientation = orientation;
      } else if (this.enablePrintAutoRotate && orientation !== initialOrientation) {
        return {
          width: viewport.height,
          height: viewport.width,
          rotation: (viewport.rotation - 90) % 360
        };
      }
      return {
        width: viewport.width,
        height: viewport.height,
        rotation: viewport.rotation
      };
    });
  }
  get optionalContentConfigPromise() {
    if (!this.pdfDocument) {
      return Promise.resolve(null);
    }
    if (!this._optionalContentConfigPromise) {
      console.error("optionalContentConfigPromise: Not initialized yet.");
      return this.pdfDocument.getOptionalContentConfig({
        intent: "display"
      });
    }
    return this._optionalContentConfigPromise;
  }
  set optionalContentConfigPromise(promise) {
    if (!(promise instanceof Promise)) {
      throw new Error(`Invalid optionalContentConfigPromise: ${promise}`);
    }
    if (!this.pdfDocument) {
      return;
    }
    if (!this._optionalContentConfigPromise) {
      return;
    }
    this._optionalContentConfigPromise = promise;
    this.refresh(false, {
      optionalContentConfigPromise: promise
    });
    this.eventBus.dispatch("optionalcontentconfigchanged", {
      source: this,
      promise
    });
  }
  get scrollMode() {
    return this._scrollMode;
  }
  set scrollMode(mode) {
    if (this._scrollMode === mode) {
      return;
    }
    if (!isValidScrollMode(mode)) {
      throw new Error(`Invalid scroll mode: ${mode}`);
    }
    if (this.pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE) {
      return;
    }
    this._previousScrollMode = this._scrollMode;
    this._scrollMode = mode;
    this.eventBus.dispatch("scrollmodechanged", {
      source: this,
      mode
    });
    this._updateScrollMode(this._currentPageNumber);
  }
  _updateScrollMode(pageNumber = null) {
    const scrollMode = this._scrollMode,
      viewer = this.viewer;
    viewer.classList.toggle("scrollHorizontal", scrollMode === ScrollMode.HORIZONTAL);
    viewer.classList.toggle("scrollWrapped", scrollMode === ScrollMode.WRAPPED);
    if (!this.pdfDocument || !pageNumber) {
      return;
    }
    if (scrollMode === ScrollMode.PAGE) {
      this.#ensurePageViewVisible();
    } else if (this._previousScrollMode === ScrollMode.PAGE) {
      this._updateSpreadMode();
    }
    if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
      this.#setScale(this._currentScaleValue, {
        noScroll: true
      });
    }
    this._setCurrentPageNumber(pageNumber, true);
    this.update();
  }
  get spreadMode() {
    return this._spreadMode;
  }
  set spreadMode(mode) {
    if (this._spreadMode === mode) {
      return;
    }
    if (!isValidSpreadMode(mode)) {
      throw new Error(`Invalid spread mode: ${mode}`);
    }
    this._spreadMode = mode;
    this.eventBus.dispatch("spreadmodechanged", {
      source: this,
      mode
    });
    this._updateSpreadMode(this._currentPageNumber);
  }
  _updateSpreadMode(pageNumber = null) {
    if (!this.pdfDocument) {
      return;
    }
    const viewer = this.viewer,
      pages = this._pages;
    if (this._scrollMode === ScrollMode.PAGE) {
      this.#ensurePageViewVisible();
    } else {
      viewer.textContent = "";
      if (this._spreadMode === SpreadMode.NONE) {
        for (const pageView of this._pages) {
          viewer.append(pageView.div);
        }
      } else {
        const parity = this._spreadMode - 1;
        let spread = null;
        for (let i = 0, ii = pages.length; i < ii; ++i) {
          if (spread === null) {
            spread = document.createElement("div");
            spread.className = "spread";
            viewer.append(spread);
          } else if (i % 2 === parity) {
            spread = spread.cloneNode(false);
            viewer.append(spread);
          }
          spread.append(pages[i].div);
        }
      }
    }
    if (!pageNumber) {
      return;
    }
    if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
      this.#setScale(this._currentScaleValue, {
        noScroll: true
      });
    }
    this._setCurrentPageNumber(pageNumber, true);
    this.update();
  }
  _getPageAdvance(currentPageNumber, previous = false) {
    switch (this._scrollMode) {
      case ScrollMode.WRAPPED:
        {
          const {
              views
            } = this._getVisiblePages(),
            pageLayout = new Map();
          for (const {
            id,
            y,
            percent,
            widthPercent
          } of views) {
            if (percent === 0 || widthPercent < 100) {
              continue;
            }
            let yArray = pageLayout.get(y);
            if (!yArray) {
              pageLayout.set(y, yArray ||= []);
            }
            yArray.push(id);
          }
          for (const yArray of pageLayout.values()) {
            const currentIndex = yArray.indexOf(currentPageNumber);
            if (currentIndex === -1) {
              continue;
            }
            const numPages = yArray.length;
            if (numPages === 1) {
              break;
            }
            if (previous) {
              for (let i = currentIndex - 1, ii = 0; i >= ii; i--) {
                const currentId = yArray[i],
                  expectedId = yArray[i + 1] - 1;
                if (currentId < expectedId) {
                  return currentPageNumber - expectedId;
                }
              }
            } else {
              for (let i = currentIndex + 1, ii = numPages; i < ii; i++) {
                const currentId = yArray[i],
                  expectedId = yArray[i - 1] + 1;
                if (currentId > expectedId) {
                  return expectedId - currentPageNumber;
                }
              }
            }
            if (previous) {
              const firstId = yArray[0];
              if (firstId < currentPageNumber) {
                return currentPageNumber - firstId + 1;
              }
            } else {
              const lastId = yArray[numPages - 1];
              if (lastId > currentPageNumber) {
                return lastId - currentPageNumber + 1;
              }
            }
            break;
          }
          break;
        }
      case ScrollMode.HORIZONTAL:
        {
          break;
        }
      case ScrollMode.PAGE:
      case ScrollMode.VERTICAL:
        {
          if (this._spreadMode === SpreadMode.NONE) {
            break;
          }
          const parity = this._spreadMode - 1;
          if (previous && currentPageNumber % 2 !== parity) {
            break;
          } else if (!previous && currentPageNumber % 2 === parity) {
            break;
          }
          const {
              views
            } = this._getVisiblePages(),
            expectedId = previous ? currentPageNumber - 1 : currentPageNumber + 1;
          for (const {
            id,
            percent,
            widthPercent
          } of views) {
            if (id !== expectedId) {
              continue;
            }
            if (percent > 0 && widthPercent === 100) {
              return 2;
            }
            break;
          }
          break;
        }
    }
    return 1;
  }
  nextPage() {
    const currentPageNumber = this._currentPageNumber,
      pagesCount = this.pagesCount;
    if (currentPageNumber >= pagesCount) {
      return false;
    }
    const advance = this._getPageAdvance(currentPageNumber, false) || 1;
    this.currentPageNumber = Math.min(currentPageNumber + advance, pagesCount);
    return true;
  }
  previousPage() {
    const currentPageNumber = this._currentPageNumber;
    if (currentPageNumber <= 1) {
      return false;
    }
    const advance = this._getPageAdvance(currentPageNumber, true) || 1;
    this.currentPageNumber = Math.max(currentPageNumber - advance, 1);
    return true;
  }
  updateScale({
    drawingDelay,
    scaleFactor = null,
    steps = null,
    origin
  }) {
    if (steps === null && scaleFactor === null) {
      throw new Error("Invalid updateScale options: either `steps` or `scaleFactor` must be provided.");
    }
    if (!this.pdfDocument) {
      return;
    }
    let newScale = this._currentScale;
    if (scaleFactor > 0 && scaleFactor !== 1) {
      newScale = Math.round(newScale * scaleFactor * 100) / 100;
    } else if (steps) {
      const delta = steps > 0 ? DEFAULT_SCALE_DELTA : 1 / DEFAULT_SCALE_DELTA;
      const round = steps > 0 ? Math.ceil : Math.floor;
      steps = Math.abs(steps);
      do {
        newScale = round((newScale * delta).toFixed(2) * 10) / 10;
      } while (--steps > 0);
    }
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    this.#setScale(newScale, {
      noScroll: false,
      drawingDelay,
      origin
    });
  }
  increaseScale(options = {}) {
    this.updateScale({
      ...options,
      steps: options.steps ?? 1
    });
  }
  decreaseScale(options = {}) {
    this.updateScale({
      ...options,
      steps: -(options.steps ?? 1)
    });
  }
  #updateContainerHeightCss(height = this.container.clientHeight) {
    if (height !== this.#previousContainerHeight) {
      this.#previousContainerHeight = height;
      docStyle.setProperty("--viewer-container-height", `${height}px`);
    }
  }
  #resizeObserverCallback(entries) {
    for (const entry of entries) {
      if (entry.target === this.container) {
        this.#updateContainerHeightCss(Math.floor(entry.borderBoxSize[0].blockSize));
        this.#containerTopLeft = null;
        break;
      }
    }
  }
  get containerTopLeft() {
    return this.#containerTopLeft ||= [this.container.offsetTop, this.container.offsetLeft];
  }
  #cleanupSwitchAnnotationEditorMode() {
    this.#switchAnnotationEditorModeAC?.abort();
    this.#switchAnnotationEditorModeAC = null;
    if (this.#switchAnnotationEditorModeTimeoutId !== null) {
      clearTimeout(this.#switchAnnotationEditorModeTimeoutId);
      this.#switchAnnotationEditorModeTimeoutId = null;
    }
  }
  get annotationEditorMode() {
    return this.#annotationEditorUIManager ? this.#annotationEditorMode : AnnotationEditorType.DISABLE;
  }
  set annotationEditorMode({
    mode,
    editId = null,
    isFromKeyboard = false
  }) {
    if (!this.#annotationEditorUIManager) {
      throw new Error(`The AnnotationEditor is not enabled.`);
    }
    if (this.#annotationEditorMode === mode) {
      return;
    }
    if (!isValidAnnotationEditorMode(mode)) {
      throw new Error(`Invalid AnnotationEditor mode: ${mode}`);
    }
    if (!this.pdfDocument) {
      return;
    }
    if (mode === AnnotationEditorType.STAMP) {
      this.#mlManager?.loadModel("altText");
    }
    const {
      eventBus
    } = this;
    const updater = () => {
      this.#cleanupSwitchAnnotationEditorMode();
      this.#annotationEditorMode = mode;
      this.#annotationEditorUIManager.updateMode(mode, editId, isFromKeyboard);
      eventBus.dispatch("annotationeditormodechanged", {
        source: this,
        mode
      });
    };
    if (mode === AnnotationEditorType.NONE || this.#annotationEditorMode === AnnotationEditorType.NONE) {
      const isEditing = mode !== AnnotationEditorType.NONE;
      if (!isEditing) {
        this.pdfDocument.annotationStorage.resetModifiedIds();
      }
      for (const pageView of this._pages) {
        pageView.toggleEditingMode(isEditing);
      }
      const idsToRefresh = this.#switchToEditAnnotationMode();
      if (isEditing && idsToRefresh) {
        this.#cleanupSwitchAnnotationEditorMode();
        this.#switchAnnotationEditorModeAC = new AbortController();
        const signal = AbortSignal.any([this.#eventAbortController.signal, this.#switchAnnotationEditorModeAC.signal]);
        eventBus._on("pagerendered", ({
          pageNumber
        }) => {
          idsToRefresh.delete(pageNumber);
          if (idsToRefresh.size === 0) {
            this.#switchAnnotationEditorModeTimeoutId = setTimeout(updater, 0);
          }
        }, {
          signal
        });
        return;
      }
    }
    updater();
  }
  refresh(noUpdate = false, updateArgs = Object.create(null)) {
    if (!this.pdfDocument) {
      return;
    }
    for (const pageView of this._pages) {
      pageView.update(updateArgs);
    }
    if (this.#scaleTimeoutId !== null) {
      clearTimeout(this.#scaleTimeoutId);
      this.#scaleTimeoutId = null;
    }
    if (!noUpdate) {
      this.update();
    }
  }
}

;// ./web/secondary_toolbar.js


class SecondaryToolbar {
  #opts;
  constructor(options, eventBus) {
    this.#opts = options;
    const buttons = [{
      element: options.presentationModeButton,
      eventName: "presentationmode",
      close: true
    }, {
      element: options.printButton,
      eventName: "print",
      close: true
    }, {
      element: options.downloadButton,
      eventName: "download",
      close: true
    }, {
      element: options.viewBookmarkButton,
      eventName: null,
      close: true
    }, {
      element: options.firstPageButton,
      eventName: "firstpage",
      close: true
    }, {
      element: options.lastPageButton,
      eventName: "lastpage",
      close: true
    }, {
      element: options.pageRotateCwButton,
      eventName: "rotatecw",
      close: false
    }, {
      element: options.pageRotateCcwButton,
      eventName: "rotateccw",
      close: false
    }, {
      element: options.cursorSelectToolButton,
      eventName: "switchcursortool",
      eventDetails: {
        tool: CursorTool.SELECT
      },
      close: true
    }, {
      element: options.cursorHandToolButton,
      eventName: "switchcursortool",
      eventDetails: {
        tool: CursorTool.HAND
      },
      close: true
    }, {
      element: options.scrollPageButton,
      eventName: "switchscrollmode",
      eventDetails: {
        mode: ScrollMode.PAGE
      },
      close: true
    }, {
      element: options.scrollVerticalButton,
      eventName: "switchscrollmode",
      eventDetails: {
        mode: ScrollMode.VERTICAL
      },
      close: true
    }, {
      element: options.scrollHorizontalButton,
      eventName: "switchscrollmode",
      eventDetails: {
        mode: ScrollMode.HORIZONTAL
      },
      close: true
    }, {
      element: options.scrollWrappedButton,
      eventName: "switchscrollmode",
      eventDetails: {
        mode: ScrollMode.WRAPPED
      },
      close: true
    }, {
      element: options.spreadNoneButton,
      eventName: "switchspreadmode",
      eventDetails: {
        mode: SpreadMode.NONE
      },
      close: true
    }, {
      element: options.spreadOddButton,
      eventName: "switchspreadmode",
      eventDetails: {
        mode: SpreadMode.ODD
      },
      close: true
    }, {
      element: options.spreadEvenButton,
      eventName: "switchspreadmode",
      eventDetails: {
        mode: SpreadMode.EVEN
      },
      close: true
    }, {
      element: options.imageAltTextSettingsButton,
      eventName: "imagealttextsettings",
      close: true
    }, {
      element: options.documentPropertiesButton,
      eventName: "documentproperties",
      close: true
    }];
    buttons.push({
      element: options.openFileButton,
      eventName: "openfile",
      close: true
    });
    this.eventBus = eventBus;
    this.opened = false;
    this.#bindListeners(buttons);
    this.reset();
  }
  get isOpen() {
    return this.opened;
  }
  setPageNumber(pageNumber) {
    this.pageNumber = pageNumber;
    this.#updateUIState();
  }
  setPagesCount(pagesCount) {
    this.pagesCount = pagesCount;
    this.#updateUIState();
  }
  reset() {
    this.pageNumber = 0;
    this.pagesCount = 0;
    this.#updateUIState();
    this.eventBus.dispatch("switchcursortool", {
      source: this,
      reset: true
    });
    this.#scrollModeChanged({
      mode: ScrollMode.VERTICAL
    });
    this.#spreadModeChanged({
      mode: SpreadMode.NONE
    });
  }
  #updateUIState() {
    const {
      firstPageButton,
      lastPageButton,
      pageRotateCwButton,
      pageRotateCcwButton
    } = this.#opts;
    firstPageButton.disabled = this.pageNumber <= 1;
    lastPageButton.disabled = this.pageNumber >= this.pagesCount;
    pageRotateCwButton.disabled = this.pagesCount === 0;
    pageRotateCcwButton.disabled = this.pagesCount === 0;
  }
  #bindListeners(buttons) {
    const {
      eventBus
    } = this;
    const {
      toggleButton
    } = this.#opts;
    toggleButton.addEventListener("click", this.toggle.bind(this));
    for (const {
      element,
      eventName,
      close,
      eventDetails
    } of buttons) {
      element.addEventListener("click", evt => {
        if (eventName !== null) {
          eventBus.dispatch(eventName, {
            source: this,
            ...eventDetails
          });
        }
        if (close) {
          this.close();
        }
        eventBus.dispatch("reporttelemetry", {
          source: this,
          details: {
            type: "buttons",
            data: {
              id: element.id
            }
          }
        });
      });
    }
    eventBus._on("cursortoolchanged", this.#cursorToolChanged.bind(this));
    eventBus._on("scrollmodechanged", this.#scrollModeChanged.bind(this));
    eventBus._on("spreadmodechanged", this.#spreadModeChanged.bind(this));
  }
  #cursorToolChanged({
    tool,
    disabled
  }) {
    const {
      cursorSelectToolButton,
      cursorHandToolButton
    } = this.#opts;
    toggleCheckedBtn(cursorSelectToolButton, tool === CursorTool.SELECT);
    toggleCheckedBtn(cursorHandToolButton, tool === CursorTool.HAND);
    cursorSelectToolButton.disabled = disabled;
    cursorHandToolButton.disabled = disabled;
  }
  #scrollModeChanged({
    mode
  }) {
    const {
      scrollPageButton,
      scrollVerticalButton,
      scrollHorizontalButton,
      scrollWrappedButton,
      spreadNoneButton,
      spreadOddButton,
      spreadEvenButton
    } = this.#opts;
    toggleCheckedBtn(scrollPageButton, mode === ScrollMode.PAGE);
    toggleCheckedBtn(scrollVerticalButton, mode === ScrollMode.VERTICAL);
    toggleCheckedBtn(scrollHorizontalButton, mode === ScrollMode.HORIZONTAL);
    toggleCheckedBtn(scrollWrappedButton, mode === ScrollMode.WRAPPED);
    const forceScrollModePage = this.pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE;
    scrollPageButton.disabled = forceScrollModePage;
    scrollVerticalButton.disabled = forceScrollModePage;
    scrollHorizontalButton.disabled = forceScrollModePage;
    scrollWrappedButton.disabled = forceScrollModePage;
    const isHorizontal = mode === ScrollMode.HORIZONTAL;
    spreadNoneButton.disabled = isHorizontal;
    spreadOddButton.disabled = isHorizontal;
    spreadEvenButton.disabled = isHorizontal;
  }
  #spreadModeChanged({
    mode
  }) {
    const {
      spreadNoneButton,
      spreadOddButton,
      spreadEvenButton
    } = this.#opts;
    toggleCheckedBtn(spreadNoneButton, mode === SpreadMode.NONE);
    toggleCheckedBtn(spreadOddButton, mode === SpreadMode.ODD);
    toggleCheckedBtn(spreadEvenButton, mode === SpreadMode.EVEN);
  }
  open() {
    if (this.opened) {
      return;
    }
    this.opened = true;
    const {
      toggleButton,
      toolbar
    } = this.#opts;
    toggleExpandedBtn(toggleButton, true, toolbar);
  }
  close() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
    const {
      toggleButton,
      toolbar
    } = this.#opts;
    toggleExpandedBtn(toggleButton, false, toolbar);
  }
  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }
}

;// ./web/toolbar.js


class Toolbar {
  #opts;
  constructor(options, eventBus, toolbarDensity = 0) {
    this.#opts = options;
    this.eventBus = eventBus;
    const buttons = [{
      element: options.previous,
      eventName: "previouspage"
    }, {
      element: options.next,
      eventName: "nextpage"
    }, {
      element: options.zoomIn,
      eventName: "zoomin"
    }, {
      element: options.zoomOut,
      eventName: "zoomout"
    }, {
      element: options.print,
      eventName: "print"
    }, {
      element: options.download,
      eventName: "download"
    }, {
      element: options.editorFreeTextButton,
      eventName: "switchannotationeditormode",
      eventDetails: {
        get mode() {
          const {
            classList
          } = options.editorFreeTextButton;
          return classList.contains("toggled") ? AnnotationEditorType.NONE : AnnotationEditorType.FREETEXT;
        }
      }
    }, {
      element: options.editorHighlightButton,
      eventName: "switchannotationeditormode",
      eventDetails: {
        get mode() {
          const {
            classList
          } = options.editorHighlightButton;
          return classList.contains("toggled") ? AnnotationEditorType.NONE : AnnotationEditorType.HIGHLIGHT;
        }
      }
    }, {
      element: options.editorInkButton,
      eventName: "switchannotationeditormode",
      eventDetails: {
        get mode() {
          const {
            classList
          } = options.editorInkButton;
          return classList.contains("toggled") ? AnnotationEditorType.NONE : AnnotationEditorType.INK;
        }
      }
    }, {
      element: options.editorStampButton,
      eventName: "switchannotationeditormode",
      eventDetails: {
        get mode() {
          const {
            classList
          } = options.editorStampButton;
          return classList.contains("toggled") ? AnnotationEditorType.NONE : AnnotationEditorType.STAMP;
        }
      },
      telemetry: {
        type: "editing",
        data: {
          action: "pdfjs.image.icon_click"
        }
      }
    }];
    this.#bindListeners(buttons);
    this.#updateToolbarDensity({
      value: toolbarDensity
    });
    this.reset();
  }
  #updateToolbarDensity({
    value
  }) {
    let name = "normal";
    switch (value) {
      case 1:
        name = "compact";
        break;
      case 2:
        name = "touch";
        break;
    }
    document.documentElement.setAttribute("data-toolbar-density", name);
  }
  #setAnnotationEditorUIManager(uiManager, parentContainer) {
    const colorPicker = new ColorPicker({
      uiManager
    });
    uiManager.setMainHighlightColorPicker(colorPicker);
    parentContainer.append(colorPicker.renderMainDropdown());
  }
  setPageNumber(pageNumber, pageLabel) {
    this.pageNumber = pageNumber;
    this.pageLabel = pageLabel;
    this.#updateUIState(false);
  }
  setPagesCount(pagesCount, hasPageLabels) {
    this.pagesCount = pagesCount;
    this.hasPageLabels = hasPageLabels;
    this.#updateUIState(true);
  }
  setPageScale(pageScaleValue, pageScale) {
    this.pageScaleValue = (pageScaleValue || pageScale).toString();
    this.pageScale = pageScale;
    this.#updateUIState(false);
  }
  reset() {
    this.pageNumber = 0;
    this.pageLabel = null;
    this.hasPageLabels = false;
    this.pagesCount = 0;
    this.pageScaleValue = DEFAULT_SCALE_VALUE;
    this.pageScale = DEFAULT_SCALE;
    this.#updateUIState(true);
    this.updateLoadingIndicatorState();
    this.#editorModeChanged({
      mode: AnnotationEditorType.DISABLE
    });
  }
  #bindListeners(buttons) {
    const {
      eventBus
    } = this;
    const {
      editorHighlightColorPicker,
      editorHighlightButton,
      pageNumber,
      scaleSelect
    } = this.#opts;
    const self = this;
    for (const {
      element,
      eventName,
      eventDetails,
      telemetry
    } of buttons) {
      element.addEventListener("click", evt => {
        if (eventName !== null) {
          eventBus.dispatch(eventName, {
            source: this,
            ...eventDetails,
            isFromKeyboard: evt.detail === 0
          });
        }
        if (telemetry) {
          eventBus.dispatch("reporttelemetry", {
            source: this,
            details: telemetry
          });
        }
      });
    }
    pageNumber.addEventListener("click", function () {
      this.select();
    });
    pageNumber.addEventListener("change", function () {
      eventBus.dispatch("pagenumberchanged", {
        source: self,
        value: this.value
      });
    });
    scaleSelect.addEventListener("change", function () {
      if (this.value === "custom") {
        return;
      }
      eventBus.dispatch("scalechanged", {
        source: self,
        value: this.value
      });
    });
    scaleSelect.addEventListener("click", function ({
      target
    }) {
      if (this.value === self.pageScaleValue && target.tagName.toUpperCase() === "OPTION") {
        this.blur();
      }
    });
    //scaleSelect.oncontextmenu = noContextMenu;
    eventBus._on("annotationeditormodechanged", this.#editorModeChanged.bind(this));
    eventBus._on("showannotationeditorui", ({
      mode
    }) => {
      switch (mode) {
        case AnnotationEditorType.HIGHLIGHT:
          editorHighlightButton.click();
          break;
      }
    });
    eventBus._on("toolbardensity", this.#updateToolbarDensity.bind(this));
    if (editorHighlightColorPicker) {
      eventBus._on("annotationeditoruimanager", ({
        uiManager
      }) => {
        this.#setAnnotationEditorUIManager(uiManager, editorHighlightColorPicker);
      }, {
        once: true
      });
    }
  }
  #editorModeChanged({
    mode
  }) {
    const {
      editorFreeTextButton,
      editorFreeTextParamsToolbar,
      editorHighlightButton,
      editorHighlightParamsToolbar,
      editorInkButton,
      editorInkParamsToolbar,
      editorStampButton,
      editorStampParamsToolbar
    } = this.#opts;
    toggleExpandedBtn(editorFreeTextButton, mode === AnnotationEditorType.FREETEXT, editorFreeTextParamsToolbar);
    toggleExpandedBtn(editorHighlightButton, mode === AnnotationEditorType.HIGHLIGHT, editorHighlightParamsToolbar);
    toggleExpandedBtn(editorInkButton, mode === AnnotationEditorType.INK, editorInkParamsToolbar);
    toggleExpandedBtn(editorStampButton, mode === AnnotationEditorType.STAMP, editorStampParamsToolbar);
    const isDisable = mode === AnnotationEditorType.DISABLE;
    editorFreeTextButton.disabled = isDisable;
    editorHighlightButton.disabled = isDisable;
    editorInkButton.disabled = isDisable;
    editorStampButton.disabled = isDisable;
  }
  #updateUIState(resetNumPages = false) {
    const {
      pageNumber,
      pagesCount,
      pageScaleValue,
      pageScale
    } = this;
    const opts = this.#opts;
    if (resetNumPages) {
      if (this.hasPageLabels) {
        opts.pageNumber.type = "text";
        opts.numPages.setAttribute("data-l10n-id", "pdfjs-page-of-pages");
      } else {
        opts.pageNumber.type = "number";
        opts.numPages.setAttribute("data-l10n-id", "pdfjs-of-pages");
        opts.numPages.setAttribute("data-l10n-args", JSON.stringify({
          pagesCount
        }));
      }
      opts.pageNumber.max = pagesCount;
    }
    if (this.hasPageLabels) {
      opts.pageNumber.value = this.pageLabel;
      opts.numPages.setAttribute("data-l10n-args", JSON.stringify({
        pageNumber,
        pagesCount
      }));
    } else {
      opts.pageNumber.value = pageNumber;
    }
    opts.previous.disabled = pageNumber <= 1;
    opts.next.disabled = pageNumber >= pagesCount;
    opts.zoomOut.disabled = pageScale <= MIN_SCALE;
    opts.zoomIn.disabled = pageScale >= MAX_SCALE;
    let predefinedValueFound = false;
    for (const option of opts.scaleSelect.options) {
      if (option.value !== pageScaleValue) {
        option.selected = false;
        continue;
      }
      option.selected = true;
      predefinedValueFound = true;
    }
    if (!predefinedValueFound) {
      opts.customScaleOption.selected = true;
      opts.customScaleOption.setAttribute("data-l10n-args", JSON.stringify({
        scale: Math.round(pageScale * 10000) / 100
      }));
    }
  }
  updateLoadingIndicatorState(loading = false) {
    const {
      pageNumber
    } = this.#opts;
    pageNumber.classList.toggle("loading", loading);
  }
}

;// ./web/view_history.js
const DEFAULT_VIEW_HISTORY_CACHE_SIZE = 20;
class ViewHistory {
  constructor(fingerprint, cacheSize = DEFAULT_VIEW_HISTORY_CACHE_SIZE) {
    this.fingerprint = fingerprint;
    this.cacheSize = cacheSize;
    this._initializedPromise = this._readFromStorage().then(databaseStr => {
      const database = JSON.parse(databaseStr || "{}");
      let index = -1;
      if (!Array.isArray(database.files)) {
        database.files = [];
      } else {
        while (database.files.length >= this.cacheSize) {
          database.files.shift();
        }
        for (let i = 0, ii = database.files.length; i < ii; i++) {
          const branch = database.files[i];
          if (branch.fingerprint === this.fingerprint) {
            index = i;
            break;
          }
        }
      }
      if (index === -1) {
        index = database.files.push({
          fingerprint: this.fingerprint
        }) - 1;
      }
      this.file = database.files[index];
      this.database = database;
    });
  }
  async _writeToStorage() {
    const databaseStr = JSON.stringify(this.database);
    localStorage.setItem("pdfjs.history", databaseStr);
  }
  async _readFromStorage() {
    return localStorage.getItem("pdfjs.history");
  }
  async set(name, val) {
    await this._initializedPromise;
    this.file[name] = val;
    return this._writeToStorage();
  }
  async setMultiple(properties) {
    await this._initializedPromise;
    for (const name in properties) {
      this.file[name] = properties[name];
    }
    return this._writeToStorage();
  }
  async get(name, defaultValue) {
    await this._initializedPromise;
    const val = this.file[name];
    return val !== undefined ? val : defaultValue;
  }
  async getMultiple(properties) {
    await this._initializedPromise;
    const values = Object.create(null);
    for (const name in properties) {
      const val = this.file[name];
      values[name] = val !== undefined ? val : properties[name];
    }
    return values;
  }
}

;// ./web/app.js
































const FORCE_PAGES_LOADED_TIMEOUT = 10000;
const ViewOnLoad = {
  UNKNOWN: -1,
  PREVIOUS: 0,
  INITIAL: 1
};
const PDFViewerApplication = {
  initialBookmark: document.location.hash.substring(1),
  _initializedCapability: {
    ...Promise.withResolvers(),
    settled: false
  },
  appConfig: null,
  pdfDocument: null,
  pdfLoadingTask: null,
  printService: null,
  pdfViewer: null,
  pdfThumbnailViewer: null,
  pdfRenderingQueue: null,
  pdfPresentationMode: null,
  pdfDocumentProperties: null,
  pdfLinkService: null,
  pdfHistory: null,
  pdfSidebar: null,
  pdfOutlineViewer: null,
  pdfAttachmentViewer: null,
  pdfLayerViewer: null,
  pdfCursorTools: null,
  pdfScriptingManager: null,
  store: null,
  downloadManager: null,
  overlayManager: null,
  preferences: new Preferences(),
  toolbar: null,
  secondaryToolbar: null,
  eventBus: null,
  l10n: null,
  annotationEditorParams: null,
  imageAltTextSettings: null,
  isInitialViewSet: false,
  isViewerEmbedded: window.parent !== window,
  url: "",
  baseUrl: "",
  mlManager: null,
  _downloadUrl: "",
  _eventBusAbortController: null,
  _windowAbortController: null,
  _globalAbortController: new AbortController(),
  documentInfo: null,
  metadata: null,
  _contentDispositionFilename: null,
  _contentLength: null,
  _saveInProgress: false,
  _wheelUnusedTicks: 0,
  _wheelUnusedFactor: 1,
  _touchUnusedTicks: 0,
  _touchUnusedFactor: 1,
  _PDFBug: null,
  _hasAnnotationEditors: false,
  _title: document.title,
  _printAnnotationStoragePromise: null,
  _touchInfo: null,
  _isCtrlKeyDown: false,
  _caretBrowsing: null,
  _isScrolling: false,
  async initialize(appConfig) {
    this.appConfig = appConfig;
    try {
      await this.preferences.initializedPromise;
    } catch (ex) {
      console.error(`initialize: "${ex.message}".`);
    }
    if (AppOptions.get("pdfBugEnabled")) {
      await this._parseHashParams();
    }
    let mode;
    switch (AppOptions.get("viewerCssTheme")) {
      case 1:
        mode = "is-light";
        break;
      case 2:
        mode = "is-dark";
        break;
    }
    if (mode) {
      document.documentElement.classList.add(mode);
    }
    this.l10n = await this.externalServices.createL10n();
    document.getElementsByTagName("html")[0].dir = this.l10n.getDirection();
    this.l10n.translate(appConfig.appContainer || document.documentElement);
    if (this.isViewerEmbedded && AppOptions.get("externalLinkTarget") === LinkTarget.NONE) {
      AppOptions.set("externalLinkTarget", LinkTarget.TOP);
    }
    await this._initializeViewerComponents();
    this.bindEvents();
    this.bindWindowEvents();
    this._initializedCapability.settled = true;
    this._initializedCapability.resolve();
  },
  async _parseHashParams() {
    const hash = document.location.hash.substring(1);
    if (!hash) {
      return;
    }
    const {
        mainContainer,
        viewerContainer
      } = this.appConfig,
      params = parseQueryString(hash);
    const loadPDFBug = async () => {
      if (this._PDFBug) {
        return;
      }
      const {
        PDFBug
      } = await import(/*webpackIgnore: true*/AppOptions.get("debuggerSrc"));
      this._PDFBug = PDFBug;
    };
    if (params.get("disableworker") === "true") {
      try {
        GlobalWorkerOptions.workerSrc ||= AppOptions.get("workerSrc");
        await import(/*webpackIgnore: true*/PDFWorker.workerSrc);
      } catch (ex) {
        console.error(`_parseHashParams: "${ex.message}".`);
      }
    }
    if (params.has("textlayer")) {
      switch (params.get("textlayer")) {
        case "off":
          AppOptions.set("textLayerMode", TextLayerMode.DISABLE);
          break;
        case "visible":
        case "shadow":
        case "hover":
          viewerContainer.classList.add(`textLayer-${params.get("textlayer")}`);
          try {
            await loadPDFBug();
            this._PDFBug.loadCSS();
          } catch (ex) {
            console.error(`_parseHashParams: "${ex.message}".`);
          }
          break;
      }
    }
    if (params.has("pdfbug")) {
      AppOptions.setAll({
        pdfBug: true,
        fontExtraProperties: true
      });
      const enabled = params.get("pdfbug").split(",");
      try {
        await loadPDFBug();
        this._PDFBug.init(mainContainer, enabled);
      } catch (ex) {
        console.error(`_parseHashParams: "${ex.message}".`);
      }
    }
    if (params.has("locale")) {
      AppOptions.set("localeProperties", {
        lang: params.get("locale")
      });
    }
    const opts = {
      disableAutoFetch: x => x === "true",
      disableFontFace: x => x === "true",
      disableHistory: x => x === "true",
      disableRange: x => x === "true",
      disableStream: x => x === "true",
      verbosity: x => x | 0
    };
    for (const name in opts) {
      const check = opts[name],
        key = name.toLowerCase();
      if (params.has(key)) {
        AppOptions.set(name, check(params.get(key)));
      }
    }
  },
  async _initializeViewerComponents() {
    const {
      appConfig,
      externalServices,
      l10n
    } = this;
    const eventBus = new EventBus();
    this.eventBus = AppOptions.eventBus = eventBus;
    this.mlManager?.setEventBus(eventBus, this._globalAbortController.signal);
    this.overlayManager = new OverlayManager();
    const pdfRenderingQueue = new PDFRenderingQueue();
    pdfRenderingQueue.onIdle = this._cleanup.bind(this);
    this.pdfRenderingQueue = pdfRenderingQueue;
    const pdfLinkService = new PDFLinkService({
      eventBus,
      externalLinkTarget: AppOptions.get("externalLinkTarget"),
      externalLinkRel: AppOptions.get("externalLinkRel"),
      ignoreDestinationZoom: AppOptions.get("ignoreDestinationZoom")
    });
    this.pdfLinkService = pdfLinkService;
    const downloadManager = this.downloadManager = new DownloadManager();
    const findController = new PDFFindController({
      linkService: pdfLinkService,
      eventBus,
      updateMatchesCountOnProgress: true
    });
    this.findController = findController;
    const pdfScriptingManager = new PDFScriptingManager({
      eventBus,
      externalServices,
      docProperties: this._scriptingDocProperties.bind(this)
    });
    this.pdfScriptingManager = pdfScriptingManager;
    const container = appConfig.mainContainer,
      viewer = appConfig.viewerContainer;
    const annotationEditorMode = AppOptions.get("annotationEditorMode");
    const pageColors = AppOptions.get("forcePageColors") || window.matchMedia("(forced-colors: active)").matches ? {
      background: AppOptions.get("pageColorsBackground"),
      foreground: AppOptions.get("pageColorsForeground")
    } : null;
    let altTextManager;
    if (AppOptions.get("enableUpdatedAddImage")) {
      altTextManager = appConfig.newAltTextDialog ? new NewAltTextManager(appConfig.newAltTextDialog, this.overlayManager, eventBus) : null;
    } else {
      altTextManager = appConfig.altTextDialog ? new AltTextManager(appConfig.altTextDialog, container, this.overlayManager, eventBus) : null;
    }
    const enableHWA = AppOptions.get("enableHWA");
    const pdfViewer = new PDFViewer({
      container,
      viewer,
      eventBus,
      renderingQueue: pdfRenderingQueue,
      linkService: pdfLinkService,
      downloadManager,
      altTextManager,
      findController,
      scriptingManager: AppOptions.get("enableScripting") && pdfScriptingManager,
      l10n,
      textLayerMode: AppOptions.get("textLayerMode"),
      annotationMode: AppOptions.get("annotationMode"),
      annotationEditorMode,
      annotationEditorHighlightColors: AppOptions.get("highlightEditorColors"),
      enableHighlightFloatingButton: AppOptions.get("enableHighlightFloatingButton"),
      enableUpdatedAddImage: AppOptions.get("enableUpdatedAddImage"),
      enableNewAltTextWhenAddingImage: AppOptions.get("enableNewAltTextWhenAddingImage"),
      imageResourcesPath: AppOptions.get("imageResourcesPath"),
      enablePrintAutoRotate: AppOptions.get("enablePrintAutoRotate"),
      maxCanvasPixels: AppOptions.get("maxCanvasPixels"),
      enablePermissions: AppOptions.get("enablePermissions"),
      pageColors,
      mlManager: this.mlManager,
      abortSignal: this._globalAbortController.signal,
      enableHWA
    });
    this.pdfViewer = pdfViewer;
    pdfRenderingQueue.setViewer(pdfViewer);
    pdfLinkService.setViewer(pdfViewer);
    pdfScriptingManager.setViewer(pdfViewer);
    if (appConfig.sidebar?.thumbnailView) {
      this.pdfThumbnailViewer = new PDFThumbnailViewer({
        container: appConfig.sidebar.thumbnailView,
        eventBus,
        renderingQueue: pdfRenderingQueue,
        linkService: pdfLinkService,
        pageColors,
        abortSignal: this._globalAbortController.signal,
        enableHWA
      });
      pdfRenderingQueue.setThumbnailViewer(this.pdfThumbnailViewer);
    }
    if (!this.isViewerEmbedded && !AppOptions.get("disableHistory")) {
      this.pdfHistory = new PDFHistory({
        linkService: pdfLinkService,
        eventBus
      });
      pdfLinkService.setHistory(this.pdfHistory);
    }
    if (!this.supportsIntegratedFind && appConfig.findBar) {
      this.findBar = new PDFFindBar(appConfig.findBar, appConfig.principalContainer, eventBus);
    }
    if (appConfig.annotationEditorParams) {
      if (typeof AbortSignal.any === "function" && annotationEditorMode !== AnnotationEditorType.DISABLE) {
        this.annotationEditorParams = new AnnotationEditorParams(appConfig.annotationEditorParams, eventBus);
      } else {
        for (const id of ["editorModeButtons", "editorModeSeparator"]) {
          document.getElementById(id)?.classList.add("hidden");
        }
      }
    }
    if (this.mlManager && appConfig.secondaryToolbar?.imageAltTextSettingsButton) {
      this.imageAltTextSettings = new ImageAltTextSettings(appConfig.altTextSettingsDialog, this.overlayManager, eventBus, this.mlManager);
    }
    if (appConfig.documentProperties) {
      this.pdfDocumentProperties = new PDFDocumentProperties(appConfig.documentProperties, this.overlayManager, eventBus, l10n, () => this._docFilename);
    }
    if (appConfig.secondaryToolbar?.cursorHandToolButton) {
      this.pdfCursorTools = new PDFCursorTools({
        container,
        eventBus,
        cursorToolOnLoad: AppOptions.get("cursorToolOnLoad")
      });
    }
    if (appConfig.toolbar) {
      this.toolbar = new Toolbar(appConfig.toolbar, eventBus, AppOptions.get("toolbarDensity"));
    }
    if (appConfig.secondaryToolbar) {
      if (AppOptions.get("enableAltText")) {
        appConfig.secondaryToolbar.imageAltTextSettingsButton?.classList.remove("hidden");
        appConfig.secondaryToolbar.imageAltTextSettingsSeparator?.classList.remove("hidden");
      }
      this.secondaryToolbar = new SecondaryToolbar(appConfig.secondaryToolbar, eventBus);
    }
    if (this.supportsFullscreen && appConfig.secondaryToolbar?.presentationModeButton) {
      this.pdfPresentationMode = new PDFPresentationMode({
        container,
        pdfViewer,
        eventBus
      });
    }
    if (appConfig.passwordOverlay) {
      this.passwordPrompt = new PasswordPrompt(appConfig.passwordOverlay, this.overlayManager, this.isViewerEmbedded);
    }
    if (appConfig.sidebar?.outlineView) {
      this.pdfOutlineViewer = new PDFOutlineViewer({
        container: appConfig.sidebar.outlineView,
        eventBus,
        l10n,
        linkService: pdfLinkService,
        downloadManager
      });
    }
    if (appConfig.sidebar?.attachmentsView) {
      this.pdfAttachmentViewer = new PDFAttachmentViewer({
        container: appConfig.sidebar.attachmentsView,
        eventBus,
        l10n,
        downloadManager
      });
    }
    if (appConfig.sidebar?.layersView) {
      this.pdfLayerViewer = new PDFLayerViewer({
        container: appConfig.sidebar.layersView,
        eventBus,
        l10n
      });
    }
    if (appConfig.sidebar) {
      this.pdfSidebar = new PDFSidebar({
        elements: appConfig.sidebar,
        eventBus,
        l10n
      });
      this.pdfSidebar.onToggled = this.forceRendering.bind(this);
      this.pdfSidebar.onUpdateThumbnails = () => {
        for (const pageView of pdfViewer.getCachedPageViews()) {
          if (pageView.renderingState === RenderingStates.FINISHED) {
            this.pdfThumbnailViewer.getThumbnail(pageView.id - 1)?.setImage(pageView);
          }
        }
        this.pdfThumbnailViewer.scrollThumbnailIntoView(pdfViewer.currentPageNumber);
      };
    }
  },
  async run(config) {
    await this.initialize(config);
    const {
      appConfig,
      eventBus
    } = this;
    let file;

    const queryString = document.location.search.substring(1);
    const params = parseQueryString(queryString);
    file = params.get("file") ?? AppOptions.get("defaultUrl");
    validateFileURL(file);
    const fileInput = this._openFileInput = document.createElement("input");
    fileInput.id = "fileInput";
    fileInput.hidden = true;
    fileInput.type = "file";
    fileInput.value = null;
    document.body.append(fileInput);
    fileInput.addEventListener("change", function (evt) {
      const {
        files
      } = evt.target;
      if (!files || files.length === 0) {
        return;
      }
      eventBus.dispatch("fileinputchange", {
        source: this,
        fileInput: evt.target
      });
    });
    appConfig.mainContainer.addEventListener("dragover", function (evt) {
      for (const item of evt.dataTransfer.items) {
        if (item.type === "application/pdf") {
          evt.dataTransfer.dropEffect = evt.dataTransfer.effectAllowed === "copy" ? "copy" : "move";
          evt.preventDefault();
          evt.stopPropagation();
          return;
        }
      }
    });
    appConfig.mainContainer.addEventListener("drop", function (evt) {
      if (evt.dataTransfer.files?.[0].type !== "application/pdf") {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      eventBus.dispatch("fileinputchange", {
        source: this,
        fileInput: evt.dataTransfer
      });
    });
    if (!AppOptions.get("supportsDocumentFonts")) {
      AppOptions.set("disableFontFace", true);
      this.l10n.get("pdfjs-web-fonts-disabled").then(msg => {
        console.warn(msg);
      });
    }
    if (!this.supportsPrinting) {
      appConfig.toolbar?.print?.classList.add("hidden");
      appConfig.secondaryToolbar?.printButton.classList.add("hidden");
    }
    if (!this.supportsFullscreen) {
      appConfig.secondaryToolbar?.presentationModeButton.classList.add("hidden");
    }
    if (this.supportsIntegratedFind) {
      appConfig.findBar?.toggleButton?.classList.add("hidden");
    }
    if (file) {
      this.open({
        url: file
      });
    } else {
      this._hideViewBookmark();
    }
  },
  get externalServices() {
    return shadow(this, "externalServices", new ExternalServices());
  },
  get initialized() {
    return this._initializedCapability.settled;
  },
  get initializedPromise() {
    return this._initializedCapability.promise;
  },
  updateZoom(steps, scaleFactor, origin) {
    if (this.pdfViewer.isInPresentationMode) {
      return;
    }
    this.pdfViewer.updateScale({
      drawingDelay: AppOptions.get("defaultZoomDelay"),
      steps,
      scaleFactor,
      origin
    });
  },
  zoomIn() {
    this.updateZoom(1);
  },
  zoomOut() {
    this.updateZoom(-1);
  },
  zoomReset() {
    if (this.pdfViewer.isInPresentationMode) {
      return;
    }
    this.pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
  },
  get pagesCount() {
    return this.pdfDocument ? this.pdfDocument.numPages : 0;
  },
  get page() {
    return this.pdfViewer.currentPageNumber;
  },
  set page(val) {
    this.pdfViewer.currentPageNumber = val;
  },
  get supportsPrinting() {
    return PDFPrintServiceFactory.supportsPrinting;
  },
  get supportsFullscreen() {
    return shadow(this, "supportsFullscreen", document.fullscreenEnabled);
  },
  get supportsPinchToZoom() {
    return shadow(this, "supportsPinchToZoom", AppOptions.get("supportsPinchToZoom"));
  },
  get supportsIntegratedFind() {
    return shadow(this, "supportsIntegratedFind", AppOptions.get("supportsIntegratedFind"));
  },
  get loadingBar() {
    const barElement = document.getElementById("loadingBar");
    const bar = barElement ? new ProgressBar(barElement) : null;
    return shadow(this, "loadingBar", bar);
  },
  get supportsMouseWheelZoomCtrlKey() {
    return shadow(this, "supportsMouseWheelZoomCtrlKey", AppOptions.get("supportsMouseWheelZoomCtrlKey"));
  },
  get supportsMouseWheelZoomMetaKey() {
    return shadow(this, "supportsMouseWheelZoomMetaKey", AppOptions.get("supportsMouseWheelZoomMetaKey"));
  },
  get supportsCaretBrowsingMode() {
    return AppOptions.get("supportsCaretBrowsingMode");
  },
  moveCaret(isUp, select) {
    this._caretBrowsing ||= new CaretBrowsingMode(this._globalAbortController.signal, this.appConfig.mainContainer, this.appConfig.viewerContainer, this.appConfig.toolbar?.container);
    this._caretBrowsing.moveCaret(isUp, select);
  },
  setTitleUsingUrl(url = "", downloadUrl = null) {
    this.url = url;
    this.baseUrl = url.split("#", 1)[0];
    if (downloadUrl) {
      this._downloadUrl = downloadUrl === url ? this.baseUrl : downloadUrl.split("#", 1)[0];
    }
    if (isDataScheme(url)) {
      this._hideViewBookmark();
    }
    let title = pdfjs_getPdfFilenameFromUrl(url, "");
    if (!title) {
      try {
        title = decodeURIComponent(getFilenameFromUrl(url));
      } catch {}
    }
    this.setTitle(title || url);
  },
  setTitle(title = this._title) {
    this._title = title;
    if (this.isViewerEmbedded) {
      return;
    }
    const editorIndicator = this._hasAnnotationEditors && !this.pdfRenderingQueue.printing;
    document.title = `${editorIndicator ? "* " : ""}${title}`;
    document.getElementById('viewer-title').innerHTML = document.title;
  },
  get _docFilename() {
    return this._contentDispositionFilename || pdfjs_getPdfFilenameFromUrl(this.url);
  },
  _hideViewBookmark() {
    const {
      secondaryToolbar
    } = this.appConfig;
    secondaryToolbar?.viewBookmarkButton.classList.add("hidden");
    if (secondaryToolbar?.presentationModeButton.classList.contains("hidden")) {
      document.getElementById("viewBookmarkSeparator")?.classList.add("hidden");
    }
  },
  async close() {
    this._unblockDocumentLoadEvent();
    this._hideViewBookmark();
    if (!this.pdfLoadingTask) {
      return;
    }
    if (this.pdfDocument?.annotationStorage.size > 0 && this._annotationStorageModified) {
      try {
        await this.save();
      } catch {}
    }
    const promises = [];
    promises.push(this.pdfLoadingTask.destroy());
    this.pdfLoadingTask = null;
    if (this.pdfDocument) {
      this.pdfDocument = null;
      this.pdfThumbnailViewer?.setDocument(null);
      this.pdfViewer.setDocument(null);
      this.pdfLinkService.setDocument(null);
      this.pdfDocumentProperties?.setDocument(null);
    }
    this.pdfLinkService.externalLinkEnabled = true;
    this.store = null;
    this.isInitialViewSet = false;
    this.url = "";
    this.baseUrl = "";
    this._downloadUrl = "";
    this.documentInfo = null;
    this.metadata = null;
    this._contentDispositionFilename = null;
    this._contentLength = null;
    this._saveInProgress = false;
    this._hasAnnotationEditors = false;
    promises.push(this.pdfScriptingManager.destroyPromise, this.passwordPrompt.close());
    this.setTitle();
    this.pdfSidebar?.reset();
    this.pdfOutlineViewer?.reset();
    this.pdfAttachmentViewer?.reset();
    this.pdfLayerViewer?.reset();
    this.pdfHistory?.reset();
    this.findBar?.reset();
    this.toolbar?.reset();
    this.secondaryToolbar?.reset();
    this._PDFBug?.cleanup();
    await Promise.all(promises);
  },
  async open(args) {
    if (this.pdfLoadingTask) {
      await this.close();
    }
    const workerParams = AppOptions.getAll(OptionKind.WORKER);
    Object.assign(GlobalWorkerOptions, workerParams);
    if (args.url) {
      this.setTitleUsingUrl(args.originalUrl || args.url, args.url);
    }
    const apiParams = AppOptions.getAll(OptionKind.API);
    const loadingTask = getDocument({
      ...apiParams,
      ...args
    });
    this.pdfLoadingTask = loadingTask;
    loadingTask.onPassword = (updateCallback, reason) => {
      if (this.isViewerEmbedded) {
        this._unblockDocumentLoadEvent();
      }
      this.pdfLinkService.externalLinkEnabled = false;
      this.passwordPrompt.setUpdateCallback(updateCallback, reason);
      this.passwordPrompt.open();
    };
    loadingTask.onProgress = ({
      loaded,
      total
    }) => {
      this.progress(loaded / total);
    };
    return loadingTask.promise.then(pdfDocument => {
      this.load(pdfDocument);
    }, reason => {
      if (loadingTask !== this.pdfLoadingTask) {
        return undefined;
      }
      let key = "pdfjs-loading-error";
      if (reason instanceof InvalidPDFException) {
        key = "pdfjs-invalid-file-error";
      } else if (reason instanceof MissingPDFException) {
        key = "pdfjs-missing-file-error";
      } else if (reason instanceof UnexpectedResponseException) {
        key = "pdfjs-unexpected-response-error";
      }
      return this._documentError(key, {
        message: reason.message
      }).then(() => {
        throw reason;
      });
    });
  },
  async download() {
    let data;
    try {
      data = await this.pdfDocument.getData();
    } catch {}
    this.downloadManager.download(data, this._downloadUrl, this._docFilename);
  },
  async save() {
    if (this._saveInProgress) {
      return;
    }
    this._saveInProgress = true;
    await this.pdfScriptingManager.dispatchWillSave();
    try {
      const data = await this.pdfDocument.saveDocument();
      this.downloadManager.download(data, this._downloadUrl, this._docFilename);
    } catch (reason) {
      console.error(`Error when saving the document: ${reason.message}`);
      await this.download();
    } finally {
      await this.pdfScriptingManager.dispatchDidSave();
      this._saveInProgress = false;
    }
    if (this._hasAnnotationEditors) {
      this.externalServices.reportTelemetry({
        type: "editing",
        data: {
          type: "save",
          stats: this.pdfDocument?.annotationStorage.editorStats
        }
      });
    }
  },
  async downloadOrSave() {
    const {
      classList
    } = this.appConfig.appContainer;
    classList.add("wait");
    await (this.pdfDocument?.annotationStorage.size > 0 ? this.save() : this.download());
    classList.remove("wait");
  },
  async _documentError(key, moreInfo = null) {
    this._unblockDocumentLoadEvent();
    const message = await this._otherError(key || "pdfjs-loading-error", moreInfo);
    this.eventBus.dispatch("documenterror", {
      source: this,
      message,
      reason: moreInfo?.message ?? null
    });
  },
  async _otherError(key, moreInfo = null) {
    const message = await this.l10n.get(key);
    const moreInfoText = [`PDF.js v${version || "?"} (build: ${build || "?"})`];
    if (moreInfo) {
      moreInfoText.push(`Message: ${moreInfo.message}`);
      if (moreInfo.stack) {
        moreInfoText.push(`Stack: ${moreInfo.stack}`);
      } else {
        if (moreInfo.filename) {
          moreInfoText.push(`File: ${moreInfo.filename}`);
        }
        if (moreInfo.lineNumber) {
          moreInfoText.push(`Line: ${moreInfo.lineNumber}`);
        }
      }
    }
    console.error(`${message}\n\n${moreInfoText.join("\n")}`);
    return message;
  },
  progress(level) {
    const percent = Math.round(level * 100);
    if (!this.loadingBar || percent <= this.loadingBar.percent) {
      return;
    }
    this.loadingBar.percent = percent;
    if (this.pdfDocument?.loadingParams.disableAutoFetch ?? AppOptions.get("disableAutoFetch")) {
      this.loadingBar.setDisableAutoFetch();
    }
  },
  load(pdfDocument) {
    this.pdfDocument = pdfDocument;
    pdfDocument.getDownloadInfo().then(({
      length
    }) => {
      this._contentLength = length;
      this.loadingBar?.hide();
      firstPagePromise.then(() => {
        this.eventBus.dispatch("documentloaded", {
          source: this
        });
      });
    });
    const pageLayoutPromise = pdfDocument.getPageLayout().catch(() => {});
    const pageModePromise = pdfDocument.getPageMode().catch(() => {});
    const openActionPromise = pdfDocument.getOpenAction().catch(() => {});
    this.toolbar?.setPagesCount(pdfDocument.numPages, false);
    this.secondaryToolbar?.setPagesCount(pdfDocument.numPages);
    this.pdfLinkService.setDocument(pdfDocument);
    this.pdfDocumentProperties?.setDocument(pdfDocument);
    const pdfViewer = this.pdfViewer;
    pdfViewer.setDocument(pdfDocument);

    const {
      firstPagePromise,
      onePageRendered,
      pagesPromise
    } = pdfViewer;
    this.pdfThumbnailViewer?.setDocument(pdfDocument);
    const storedPromise = (this.store = new ViewHistory(pdfDocument.fingerprints[0])).getMultiple({
      page: null,
      zoom: DEFAULT_SCALE_VALUE,
      scrollLeft: "0",
      scrollTop: "0",
      rotation: null,
      sidebarView: SidebarView.UNKNOWN,
      scrollMode: ScrollMode.UNKNOWN,
      spreadMode: SpreadMode.UNKNOWN
    }).catch(() => {});
    firstPagePromise.then(pdfPage => {
      this.loadingBar?.setWidth(this.appConfig.viewerContainer);
      this._initializeAnnotationStorageCallbacks(pdfDocument);
      Promise.all([animationStarted, storedPromise, pageLayoutPromise, pageModePromise, openActionPromise]).then(async ([timeStamp, stored, pageLayout, pageMode, openAction]) => {
        const viewOnLoad = AppOptions.get("viewOnLoad");
        this._initializePdfHistory({
          fingerprint: pdfDocument.fingerprints[0],
          viewOnLoad,
          initialDest: openAction?.dest
        });
        const initialBookmark = this.initialBookmark;
        const zoom = AppOptions.get("defaultZoomValue");
        let hash = zoom ? `zoom=${zoom}` : null;
        let rotation = null;
        let sidebarView = AppOptions.get("sidebarViewOnLoad");
        let scrollMode = AppOptions.get("scrollModeOnLoad");
        let spreadMode = AppOptions.get("spreadModeOnLoad");
        if (stored?.page && viewOnLoad !== ViewOnLoad.INITIAL) {
          hash = `page=${stored.page}&zoom=${zoom || stored.zoom},` + `${stored.scrollLeft},${stored.scrollTop}`;
          rotation = parseInt(stored.rotation, 10);
          if (sidebarView === SidebarView.UNKNOWN) {
            sidebarView = stored.sidebarView | 0;
          }
          if (scrollMode === ScrollMode.UNKNOWN) {
            scrollMode = stored.scrollMode | 0;
          }
          if (spreadMode === SpreadMode.UNKNOWN) {
            spreadMode = stored.spreadMode | 0;
          }
        }
        if (pageMode && sidebarView === SidebarView.UNKNOWN) {
          sidebarView = apiPageModeToSidebarView(pageMode);
        }
        if (pageLayout && scrollMode === ScrollMode.UNKNOWN && spreadMode === SpreadMode.UNKNOWN) {
          const modes = apiPageLayoutToViewerModes(pageLayout);
          spreadMode = modes.spreadMode;
        }
        this.setInitialView(hash, {
          rotation,
          sidebarView,
          scrollMode,
          spreadMode
        });
        this.eventBus.dispatch("documentinit", {
          source: this
        });
        if (!this.isViewerEmbedded) {
          pdfViewer.focus();
        }
        await Promise.race([pagesPromise, new Promise(resolve => {
          setTimeout(resolve, FORCE_PAGES_LOADED_TIMEOUT);
        })]);
        if (!initialBookmark && !hash) {
          return;
        }
        if (pdfViewer.hasEqualPageSizes) {
          return;
        }
        this.initialBookmark = initialBookmark;
        pdfViewer.currentScaleValue = pdfViewer.currentScaleValue;
        this.setInitialView(hash);
      }).catch(() => {
        this.setInitialView();
      }).then(function () {
        pdfViewer.update();
      });
    });
    pagesPromise.then(() => {
      this._unblockDocumentLoadEvent();
      this._initializeAutoPrint(pdfDocument, openActionPromise);
    }, reason => {
      this._documentError("pdfjs-loading-error", {
        message: reason.message
      });
    });
    onePageRendered.then(data => {
      this.externalServices.reportTelemetry({
        type: "pageInfo",
        timestamp: data.timestamp
      });
      if (this.pdfOutlineViewer) {
        pdfDocument.getOutline().then(outline => {
          if (pdfDocument !== this.pdfDocument) {
            return;
          }
          this.pdfOutlineViewer.render({
            outline,
            pdfDocument
          });
        });
      }
      if (this.pdfAttachmentViewer) {
        pdfDocument.getAttachments().then(attachments => {
          if (pdfDocument !== this.pdfDocument) {
            return;
          }
          this.pdfAttachmentViewer.render({
            attachments
          });
        });
      }
      if (this.pdfLayerViewer) {
        pdfViewer.optionalContentConfigPromise.then(optionalContentConfig => {
          if (pdfDocument !== this.pdfDocument) {
            return;
          }
          this.pdfLayerViewer.render({
            optionalContentConfig,
            pdfDocument
          });
        });
      }
    });
    this._initializePageLabels(pdfDocument);
    this._initializeMetadata(pdfDocument);
  },
  async _scriptingDocProperties(pdfDocument) {
    if (!this.documentInfo) {
      await new Promise(resolve => {
        this.eventBus._on("metadataloaded", resolve, {
          once: true
        });
      });
      if (pdfDocument !== this.pdfDocument) {
        return null;
      }
    }
    if (!this._contentLength) {
      await new Promise(resolve => {
        this.eventBus._on("documentloaded", resolve, {
          once: true
        });
      });
      if (pdfDocument !== this.pdfDocument) {
        return null;
      }
    }
    return {
      ...this.documentInfo,
      baseURL: this.baseUrl,
      filesize: this._contentLength,
      filename: this._docFilename,
      metadata: this.metadata?.getRaw(),
      authors: this.metadata?.get("dc:creator"),
      numPages: this.pagesCount,
      URL: this.url
    };
  },
  async _initializeAutoPrint(pdfDocument, openActionPromise) {
    const [openAction, jsActions] = await Promise.all([openActionPromise, this.pdfViewer.enableScripting ? null : pdfDocument.getJSActions()]);
    if (pdfDocument !== this.pdfDocument) {
      return;
    }
    let triggerAutoPrint = openAction?.action === "Print";
    if (jsActions) {
      console.warn("Warning: JavaScript support is not enabled");
      for (const name in jsActions) {
        if (triggerAutoPrint) {
          break;
        }
        switch (name) {
          case "WillClose":
          case "WillSave":
          case "DidSave":
          case "WillPrint":
          case "DidPrint":
            continue;
        }
        triggerAutoPrint = jsActions[name].some(js => AutoPrintRegExp.test(js));
      }
    }
    if (triggerAutoPrint) {
      this.triggerPrinting();
    }
  },
  async _initializeMetadata(pdfDocument) {
    const {
      info,
      metadata,
      contentDispositionFilename,
      contentLength
    } = await pdfDocument.getMetadata();
    if (pdfDocument !== this.pdfDocument) {
      return;
    }
    this.documentInfo = info;
    this.metadata = metadata;
    this._contentDispositionFilename ??= contentDispositionFilename;
    this._contentLength ??= contentLength;
    console.log(`PDF ${pdfDocument.fingerprints[0]} [${info.PDFFormatVersion} ` + `${(info.Producer || "-").trim()} / ${(info.Creator || "-").trim()}] ` + `(PDF.js: ${version || "?"} [${build || "?"}])`);
    let pdfTitle = info.Title;
    const metadataTitle = metadata?.get("dc:title");
    if (metadataTitle) {
      if (metadataTitle !== "Untitled" && !/[\uFFF0-\uFFFF]/g.test(metadataTitle)) {
        pdfTitle = metadataTitle;
      }
    }
    if (pdfTitle) {
      this.setTitle(`${pdfTitle} - ${this._contentDispositionFilename || this._title}`);
    } else if (this._contentDispositionFilename) {
      this.setTitle(this._contentDispositionFilename);
    }
    if (info.IsXFAPresent && !info.IsAcroFormPresent && !pdfDocument.isPureXfa) {
      if (pdfDocument.loadingParams.enableXfa) {
        console.warn("Warning: XFA Foreground documents are not supported");
      } else {
        console.warn("Warning: XFA support is not enabled");
      }
    } else if ((info.IsAcroFormPresent || info.IsXFAPresent) && !this.pdfViewer.renderForms) {
      console.warn("Warning: Interactive form support is not enabled");
    }
    if (info.IsSignaturesPresent) {
      console.warn("Warning: Digital signatures validation is not supported");
    }
    this.eventBus.dispatch("metadataloaded", {
      source: this
    });
  },
  async _initializePageLabels(pdfDocument) {
    const labels = await pdfDocument.getPageLabels();
    if (pdfDocument !== this.pdfDocument) {
      return;
    }
    if (!labels || AppOptions.get("disablePageLabels")) {
      return;
    }
    const numLabels = labels.length;
    let standardLabels = 0,
      emptyLabels = 0;
    for (let i = 0; i < numLabels; i++) {
      const label = labels[i];
      if (label === (i + 1).toString()) {
        standardLabels++;
      } else if (label === "") {
        emptyLabels++;
      } else {
        break;
      }
    }
    if (standardLabels >= numLabels || emptyLabels >= numLabels) {
      return;
    }
    const {
      pdfViewer,
      pdfThumbnailViewer,
      toolbar
    } = this;
    pdfViewer.setPageLabels(labels);
    pdfThumbnailViewer?.setPageLabels(labels);
    toolbar?.setPagesCount(numLabels, true);
    toolbar?.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel);
  },
  _initializePdfHistory({
    fingerprint,
    viewOnLoad,
    initialDest = null
  }) {
    if (!this.pdfHistory) {
      return;
    }
    this.pdfHistory.initialize({
      fingerprint,
      resetHistory: viewOnLoad === ViewOnLoad.INITIAL,
      updateUrl: AppOptions.get("historyUpdateUrl")
    });
    if (this.pdfHistory.initialBookmark) {
      this.initialBookmark = this.pdfHistory.initialBookmark;
      this.initialRotation = this.pdfHistory.initialRotation;
    }
    if (initialDest && !this.initialBookmark && viewOnLoad === ViewOnLoad.UNKNOWN) {
      this.initialBookmark = JSON.stringify(initialDest);
      this.pdfHistory.push({
        explicitDest: initialDest,
        pageNumber: null
      });
    }
  },
  _initializeAnnotationStorageCallbacks(pdfDocument) {
    if (pdfDocument !== this.pdfDocument) {
      return;
    }
    const {
      annotationStorage
    } = pdfDocument;
    annotationStorage.onSetModified = () => {
      window.addEventListener("beforeunload", beforeUnload);
      this._annotationStorageModified = true;
    };
    annotationStorage.onResetModified = () => {
      window.removeEventListener("beforeunload", beforeUnload);
      delete this._annotationStorageModified;
    };
    annotationStorage.onAnnotationEditor = typeStr => {
      this._hasAnnotationEditors = !!typeStr;
      this.setTitle();
    };
  },
  setInitialView(storedHash, {
    rotation,
    sidebarView,
    scrollMode,
    spreadMode
  } = {}) {
    const setRotation = angle => {
      if (isValidRotation(angle)) {
        this.pdfViewer.pagesRotation = angle;
      }
    };
    const setViewerModes = (scroll, spread) => {
      if (isValidScrollMode(scroll)) {
        this.pdfViewer.scrollMode = scroll;
      }
      if (isValidSpreadMode(spread)) {
        this.pdfViewer.spreadMode = spread;
      }
    };
    this.isInitialViewSet = true;
    this.pdfSidebar?.setInitialView(sidebarView);
    setViewerModes(scrollMode, spreadMode);
    if (this.initialBookmark) {
      setRotation(this.initialRotation);
      delete this.initialRotation;
      this.pdfLinkService.setHash(this.initialBookmark);
      this.initialBookmark = null;
    } else if (storedHash) {
      setRotation(rotation);
      this.pdfLinkService.setHash(storedHash);
    }
    this.toolbar?.setPageNumber(this.pdfViewer.currentPageNumber, this.pdfViewer.currentPageLabel);
    this.secondaryToolbar?.setPageNumber(this.pdfViewer.currentPageNumber);
    if (!this.pdfViewer.currentScaleValue) {
      this.pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE;
    }
  },
  _cleanup() {
    if (!this.pdfDocument) {
      return;
    }
    this.pdfViewer.cleanup();
    this.pdfThumbnailViewer?.cleanup();
    this.pdfDocument.cleanup(AppOptions.get("fontExtraProperties"));
  },
  forceRendering() {
    this.pdfRenderingQueue.printing = !!this.printService;
    this.pdfRenderingQueue.isThumbnailViewEnabled = this.pdfSidebar?.visibleView === SidebarView.THUMBS;
    this.pdfRenderingQueue.renderHighestPriority();
  },
  beforePrint() {
    this._printAnnotationStoragePromise = this.pdfScriptingManager.dispatchWillPrint().catch(() => {}).then(() => this.pdfDocument?.annotationStorage.print);
    if (this.printService) {
      return;
    }
    if (!this.supportsPrinting) {
      this._otherError("pdfjs-printing-not-supported");
      return;
    }
    if (!this.pdfViewer.pageViewsReady) {
      this.l10n.get("pdfjs-printing-not-ready").then(msg => {
        window.alert(msg);
      });
      return;
    }
    this.printService = PDFPrintServiceFactory.createPrintService({
      pdfDocument: this.pdfDocument,
      pagesOverview: this.pdfViewer.getPagesOverview(),
      printContainer: this.appConfig.printContainer,
      printResolution: AppOptions.get("printResolution"),
      printAnnotationStoragePromise: this._printAnnotationStoragePromise
    });
    this.forceRendering();
    this.setTitle();
    this.printService.layout();
    if (this._hasAnnotationEditors) {
      this.externalServices.reportTelemetry({
        type: "editing",
        data: {
          type: "print",
          stats: this.pdfDocument?.annotationStorage.editorStats
        }
      });
    }
  },
  afterPrint() {
    if (this._printAnnotationStoragePromise) {
      this._printAnnotationStoragePromise.then(() => {
        this.pdfScriptingManager.dispatchDidPrint();
      });
      this._printAnnotationStoragePromise = null;
    }
    if (this.printService) {
      this.printService.destroy();
      this.printService = null;
      this.pdfDocument?.annotationStorage.resetModified();
    }
    this.forceRendering();
    this.setTitle();
  },
  rotatePages(delta) {
    this.pdfViewer.pagesRotation += delta;
  },
  requestPresentationMode() {
    this.pdfPresentationMode?.request();
  },
  triggerPrinting() {
    if (this.supportsPrinting) {
      window.print();
    }
  },
  bindEvents() {
    if (this._eventBusAbortController) {
      return;
    }
    const ac = this._eventBusAbortController = new AbortController();
    const opts = {
      signal: ac.signal
    };
    const {
      eventBus,
      externalServices,
      pdfDocumentProperties,
      pdfViewer,
      preferences
    } = this;
    eventBus._on("resize", onResize.bind(this), opts);
    eventBus._on("hashchange", onHashchange.bind(this), opts);
    eventBus._on("beforeprint", this.beforePrint.bind(this), opts);
    eventBus._on("afterprint", this.afterPrint.bind(this), opts);
    eventBus._on("pagerender", onPageRender.bind(this), opts);
    eventBus._on("pagerendered", onPageRendered.bind(this), opts);
    eventBus._on("updateviewarea", onUpdateViewarea.bind(this), opts);
    eventBus._on("pagechanging", onPageChanging.bind(this), opts);
    eventBus._on("scalechanging", onScaleChanging.bind(this), opts);
    eventBus._on("rotationchanging", onRotationChanging.bind(this), opts);
    eventBus._on("sidebarviewchanged", onSidebarViewChanged.bind(this), opts);
    eventBus._on("pagemode", onPageMode.bind(this), opts);
    eventBus._on("namedaction", onNamedAction.bind(this), opts);
    eventBus._on("presentationmodechanged", evt => pdfViewer.presentationModeState = evt.state, opts);
    eventBus._on("presentationmode", this.requestPresentationMode.bind(this), opts);
    eventBus._on("switchannotationeditormode", evt => pdfViewer.annotationEditorMode = evt, opts);
    eventBus._on("print", this.triggerPrinting.bind(this), opts);
    eventBus._on("download", this.downloadOrSave.bind(this), opts);
    eventBus._on("firstpage", () => this.page = 1, opts);
    eventBus._on("lastpage", () => this.page = this.pagesCount, opts);
    eventBus._on("nextpage", () => pdfViewer.nextPage(), opts);
    eventBus._on("previouspage", () => pdfViewer.previousPage(), opts);
    eventBus._on("zoomin", this.zoomIn.bind(this), opts);
    eventBus._on("zoomout", this.zoomOut.bind(this), opts);
    eventBus._on("zoomreset", this.zoomReset.bind(this), opts);
    eventBus._on("pagenumberchanged", onPageNumberChanged.bind(this), opts);
    eventBus._on("scalechanged", evt => pdfViewer.currentScaleValue = evt.value, opts);
    eventBus._on("rotatecw", this.rotatePages.bind(this, 90), opts);
    eventBus._on("rotateccw", this.rotatePages.bind(this, -90), opts);
    eventBus._on("optionalcontentconfig", evt => pdfViewer.optionalContentConfigPromise = evt.promise, opts);
    eventBus._on("switchscrollmode", evt => pdfViewer.scrollMode = evt.mode, opts);
    eventBus._on("scrollmodechanged", onViewerModesChanged.bind(this, "scrollMode"), opts);
    eventBus._on("switchspreadmode", evt => pdfViewer.spreadMode = evt.mode, opts);
    eventBus._on("spreadmodechanged", onViewerModesChanged.bind(this, "spreadMode"), opts);
    eventBus._on("imagealttextsettings", onImageAltTextSettings.bind(this), opts);
    eventBus._on("documentproperties", () => pdfDocumentProperties?.open(), opts);
    eventBus._on("findfromurlhash", onFindFromUrlHash.bind(this), opts);
    eventBus._on("updatefindmatchescount", onUpdateFindMatchesCount.bind(this), opts);
    eventBus._on("updatefindcontrolstate", onUpdateFindControlState.bind(this), opts);
    eventBus._on("fileinputchange", onFileInputChange.bind(this), opts);
    eventBus._on("openfile", onOpenFile.bind(this), opts);
  },
  bindWindowEvents() {
    if (this._windowAbortController) {
      return;
    }
    this._windowAbortController = new AbortController();
    const {
      eventBus,
      appConfig: {
        mainContainer
      },
      pdfViewer,
      _windowAbortController: {
        signal
      }
    } = this;
    function addWindowResolutionChange(evt = null) {
      if (evt) {
        pdfViewer.refresh();
      }
      const mediaQueryList = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      mediaQueryList.addEventListener("change", addWindowResolutionChange, {
        once: true,
        signal
      });
    }
    addWindowResolutionChange();
    window.addEventListener("wheel", onWheel.bind(this), {
      passive: false,
      signal
    });
    window.addEventListener("touchstart", onTouchStart.bind(this), {
      passive: false,
      signal
    });
    window.addEventListener("touchmove", onTouchMove.bind(this), {
      passive: false,
      signal
    });
    window.addEventListener("touchend", onTouchEnd.bind(this), {
      passive: false,
      signal
    });
    window.addEventListener("click", onClick.bind(this), {
      signal
    });
    window.addEventListener("keydown", onKeyDown.bind(this), {
      signal
    });
    window.addEventListener("keyup", onKeyUp.bind(this), {
      signal
    });
    window.addEventListener("resize", () => eventBus.dispatch("resize", {
      source: window
    }), {
      signal
    });
    window.addEventListener("hashchange", () => {
      eventBus.dispatch("hashchange", {
        source: window,
        hash: document.location.hash.substring(1)
      });
    }, {
      signal
    });
    window.addEventListener("beforeprint", () => eventBus.dispatch("beforeprint", {
      source: window
    }), {
      signal
    });
    window.addEventListener("afterprint", () => eventBus.dispatch("afterprint", {
      source: window
    }), {
      signal
    });
    window.addEventListener("updatefromsandbox", evt => {
      eventBus.dispatch("updatefromsandbox", {
        source: window,
        detail: evt.detail
      });
    }, {
      signal
    });
    if (!("onscrollend" in document.documentElement)) {
      return;
    }
    ({
      scrollTop: this._lastScrollTop,
      scrollLeft: this._lastScrollLeft
    } = mainContainer);
    const scrollend = () => {
      ({
        scrollTop: this._lastScrollTop,
        scrollLeft: this._lastScrollLeft
      } = mainContainer);
      this._isScrolling = false;
      mainContainer.addEventListener("scroll", scroll, {
        passive: true,
        signal
      });
      mainContainer.removeEventListener("scrollend", scrollend);
      mainContainer.removeEventListener("blur", scrollend);
    };
    const scroll = () => {
      if (this._isCtrlKeyDown) {
        return;
      }
      if (this._lastScrollTop === mainContainer.scrollTop && this._lastScrollLeft === mainContainer.scrollLeft) {
        return;
      }
      mainContainer.removeEventListener("scroll", scroll);
      this._isScrolling = true;
      mainContainer.addEventListener("scrollend", scrollend, {
        signal
      });
      mainContainer.addEventListener("blur", scrollend, {
        signal
      });
    };
    mainContainer.addEventListener("scroll", scroll, {
      passive: true,
      signal
    });
  },
  unbindEvents() {
    this._eventBusAbortController?.abort();
    this._eventBusAbortController = null;
  },
  unbindWindowEvents() {
    this._windowAbortController?.abort();
    this._windowAbortController = null;
  },
  async testingClose() {
    this.unbindEvents();
    this.unbindWindowEvents();
    this._globalAbortController?.abort();
    this._globalAbortController = null;
    this.findBar?.close();
    await Promise.all([this.l10n?.destroy(), this.close()]);
  },
  _accumulateTicks(ticks, prop) {
    if (this[prop] > 0 && ticks < 0 || this[prop] < 0 && ticks > 0) {
      this[prop] = 0;
    }
    this[prop] += ticks;
    const wholeTicks = Math.trunc(this[prop]);
    this[prop] -= wholeTicks;
    return wholeTicks;
  },
  _accumulateFactor(previousScale, factor, prop) {
    if (factor === 1) {
      return 1;
    }
    if (this[prop] > 1 && factor < 1 || this[prop] < 1 && factor > 1) {
      this[prop] = 1;
    }
    const newFactor = Math.floor(previousScale * factor * this[prop] * 100) / (100 * previousScale);
    this[prop] = factor / newFactor;
    return newFactor;
  },
  _unblockDocumentLoadEvent() {
    document.blockUnblockOnload?.(false);
    this._unblockDocumentLoadEvent = () => {};
  },
  get scriptingReady() {
    return this.pdfScriptingManager.ready;
  }
};
initCom(PDFViewerApplication);
{
  PDFPrintServiceFactory.initGlobals(PDFViewerApplication);
}
{
  const HOSTED_VIEWER_ORIGINS = ["null"];
  var validateFileURL = function (file) {
    if (!file) {
      return;
    }
    try {
      const viewerOrigin = new URL(window.location.href).origin || "null";
      if (HOSTED_VIEWER_ORIGINS.includes(viewerOrigin)) {
        return;
      }
      const fileOrigin = new URL(file, window.location.href).origin;
      if (fileOrigin !== viewerOrigin) {
       // throw new Error("file origin does not match viewer's");
      }
    } catch (ex) {
      PDFViewerApplication._documentError("pdfjs-loading-error", {
        message: ex.message
      });
      throw ex;
    }
  };
  var onFileInputChange = function (evt) {
    if (this.pdfViewer?.isInPresentationMode) {
      return;
    }
    const file = evt.fileInput.files[0];
    this.open({
      url: URL.createObjectURL(file),
      originalUrl: file.name
    });
  };
  var onOpenFile = function (evt) {
    this._openFileInput?.click();
  };
}
function onPageRender({
  pageNumber
}) {
  if (pageNumber === this.page) {
    this.toolbar?.updateLoadingIndicatorState(true);
  }
}
function onPageRendered({
  pageNumber,
  error
}) {
  if (pageNumber === this.page) {
    this.toolbar?.updateLoadingIndicatorState(false);
  }
  if (this.pdfSidebar?.visibleView === SidebarView.THUMBS) {
    const pageView = this.pdfViewer.getPageView(pageNumber - 1);
    const thumbnailView = this.pdfThumbnailViewer?.getThumbnail(pageNumber - 1);
    if (pageView) {
      thumbnailView?.setImage(pageView);
    }
  }
  if (error) {
    this._otherError("pdfjs-rendering-error", error);
  }
}
function onPageMode({
  mode
}) {
  let view;
  switch (mode) {
    case "thumbs":
      view = SidebarView.THUMBS;
      break;
    case "bookmarks":
    case "outline":
      view = SidebarView.OUTLINE;
      break;
    case "attachments":
      view = SidebarView.ATTACHMENTS;
      break;
    case "layers":
      view = SidebarView.LAYERS;
      break;
    case "none":
      view = SidebarView.NONE;
      break;
    default:
      console.error('Invalid "pagemode" hash parameter: ' + mode);
      return;
  }
  this.pdfSidebar?.switchView(view, true);
}
function onNamedAction(evt) {
  switch (evt.action) {
    case "GoToPage":
      this.appConfig.toolbar?.pageNumber.select();
      break;
    case "Find":
      if (!this.supportsIntegratedFind) {
        this.findBar?.toggle();
      }
      break;
    case "Print":
      this.triggerPrinting();
      break;
    case "SaveAs":
      this.downloadOrSave();
      break;
  }
}
function onSidebarViewChanged({
  view
}) {
  this.pdfRenderingQueue.isThumbnailViewEnabled = view === SidebarView.THUMBS;
  if (this.isInitialViewSet) {
    this.store?.set("sidebarView", view).catch(() => {});
  }
}
function onUpdateViewarea({
  location
}) {
  if (this.isInitialViewSet) {
    this.store?.setMultiple({
      page: location.pageNumber,
      zoom: location.scale,
      scrollLeft: location.left,
      scrollTop: location.top,
      rotation: location.rotation
    }).catch(() => {});
  }
  if (this.appConfig.secondaryToolbar) {
    this.appConfig.secondaryToolbar.viewBookmarkButton.href = this.pdfLinkService.getAnchorUrl(location.pdfOpenParams);
  }
}
function onViewerModesChanged(name, evt) {
  if (this.isInitialViewSet && !this.pdfViewer.isInPresentationMode) {
    this.store?.set(name, evt.mode).catch(() => {});
  }
}
function onResize() {
  const {
    pdfDocument,
    pdfViewer,
    pdfRenderingQueue
  } = this;
  if (pdfRenderingQueue.printing && window.matchMedia("print").matches) {
    return;
  }
  if (!pdfDocument) {
    return;
  }
  const currentScaleValue = pdfViewer.currentScaleValue;
  if (currentScaleValue === "auto" || currentScaleValue === "page-fit" || currentScaleValue === "page-width") {
    pdfViewer.currentScaleValue = currentScaleValue;
  }
  pdfViewer.update();
}
function onHashchange(evt) {
  const hash = evt.hash;
  if (!hash) {
    return;
  }
  if (!this.isInitialViewSet) {
    this.initialBookmark = hash;
  } else if (!this.pdfHistory?.popStateInProgress) {
    this.pdfLinkService.setHash(hash);
  }
}
function onPageNumberChanged(evt) {
  const {
    pdfViewer
  } = this;
  if (evt.value !== "") {
    this.pdfLinkService.goToPage(evt.value);
  }
  if (evt.value !== pdfViewer.currentPageNumber.toString() && evt.value !== pdfViewer.currentPageLabel) {
    this.toolbar?.setPageNumber(pdfViewer.currentPageNumber, pdfViewer.currentPageLabel);
  }
}
function onImageAltTextSettings() {
  this.imageAltTextSettings?.open({
    enableGuessAltText: AppOptions.get("enableGuessAltText"),
    enableNewAltTextWhenAddingImage: AppOptions.get("enableNewAltTextWhenAddingImage")
  });
}
function onFindFromUrlHash(evt) {
  this.eventBus.dispatch("find", {
    source: evt.source,
    type: "",
    query: evt.query,
    caseSensitive: false,
    entireWord: false,
    highlightAll: true,
    findPrevious: false,
    matchDiacritics: true
  });
}
function onUpdateFindMatchesCount({
  matchesCount
}) {
  if (this.supportsIntegratedFind) {
    this.externalServices.updateFindMatchesCount(matchesCount);
  } else {
    this.findBar?.updateResultsCount(matchesCount);
  }
}
function onUpdateFindControlState({
  state,
  previous,
  entireWord,
  matchesCount,
  rawQuery
}) {
  if (this.supportsIntegratedFind) {
    this.externalServices.updateFindControlState({
      result: state,
      findPrevious: previous,
      entireWord,
      matchesCount,
      rawQuery
    });
  } else {
    this.findBar?.updateUIState(state, previous, matchesCount);
  }
}
function onScaleChanging(evt) {
  this.toolbar?.setPageScale(evt.presetValue, evt.scale);
  this.pdfViewer.update();
}
function onRotationChanging(evt) {
  if (this.pdfThumbnailViewer) {
    this.pdfThumbnailViewer.pagesRotation = evt.pagesRotation;
  }
  this.forceRendering();
  this.pdfViewer.currentPageNumber = evt.pageNumber;
}
function onPageChanging({
  pageNumber,
  pageLabel
}) {
  this.toolbar?.setPageNumber(pageNumber, pageLabel);
  this.secondaryToolbar?.setPageNumber(pageNumber);
  if (this.pdfSidebar?.visibleView === SidebarView.THUMBS) {
    this.pdfThumbnailViewer?.scrollThumbnailIntoView(pageNumber);
  }
  const currentPage = this.pdfViewer.getPageView(pageNumber - 1);
  this.toolbar?.updateLoadingIndicatorState(currentPage?.renderingState === RenderingStates.RUNNING);
}
function onWheel(evt) {
  const {
    pdfViewer,
    supportsMouseWheelZoomCtrlKey,
    supportsMouseWheelZoomMetaKey,
    supportsPinchToZoom
  } = this;
  if (pdfViewer.isInPresentationMode) {
    return;
  }
  const deltaMode = evt.deltaMode;
  let scaleFactor = Math.exp(-evt.deltaY / 100);
  const isBuiltInMac = false;
  const isPinchToZoom = evt.ctrlKey && !this._isCtrlKeyDown && deltaMode === WheelEvent.DOM_DELTA_PIXEL && evt.deltaX === 0 && (Math.abs(scaleFactor - 1) < 0.05 || isBuiltInMac) && evt.deltaZ === 0;
  const origin = [evt.clientX, evt.clientY];
  if (isPinchToZoom || evt.ctrlKey && supportsMouseWheelZoomCtrlKey || evt.metaKey && supportsMouseWheelZoomMetaKey) {
    evt.preventDefault();
    if (this._isScrolling || document.visibilityState === "hidden" || this.overlayManager.active) {
      return;
    }
    if (isPinchToZoom && supportsPinchToZoom) {
      scaleFactor = this._accumulateFactor(pdfViewer.currentScale, scaleFactor, "_wheelUnusedFactor");
      this.updateZoom(null, scaleFactor, origin);
    } else {
      const delta = normalizeWheelEventDirection(evt);
      let ticks = 0;
      if (deltaMode === WheelEvent.DOM_DELTA_LINE || deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        ticks = Math.abs(delta) >= 1 ? Math.sign(delta) : this._accumulateTicks(delta, "_wheelUnusedTicks");
      } else {
        const PIXELS_PER_LINE_SCALE = 30;
        ticks = this._accumulateTicks(delta / PIXELS_PER_LINE_SCALE, "_wheelUnusedTicks");
      }
      this.updateZoom(ticks, null, origin);
    }
  }
}
function onTouchStart(evt) {
  if (this.pdfViewer.isInPresentationMode || evt.touches.length < 2) {
    return;
  }
  evt.preventDefault();
  if (evt.touches.length !== 2 || this.overlayManager.active) {
    this._touchInfo = null;
    return;
  }
  let [touch0, touch1] = evt.touches;
  if (touch0.identifier > touch1.identifier) {
    [touch0, touch1] = [touch1, touch0];
  }
  this._touchInfo = {
    touch0X: touch0.pageX,
    touch0Y: touch0.pageY,
    touch1X: touch1.pageX,
    touch1Y: touch1.pageY
  };
}
function onTouchMove(evt) {
  if (!this._touchInfo || evt.touches.length !== 2) {
    return;
  }
  const {
    pdfViewer,
    _touchInfo,
    supportsPinchToZoom
  } = this;
  let [touch0, touch1] = evt.touches;
  if (touch0.identifier > touch1.identifier) {
    [touch0, touch1] = [touch1, touch0];
  }
  const {
    pageX: page0X,
    pageY: page0Y
  } = touch0;
  const {
    pageX: page1X,
    pageY: page1Y
  } = touch1;
  const {
    touch0X: pTouch0X,
    touch0Y: pTouch0Y,
    touch1X: pTouch1X,
    touch1Y: pTouch1Y
  } = _touchInfo;
  if (Math.abs(pTouch0X - page0X) <= 1 && Math.abs(pTouch0Y - page0Y) <= 1 && Math.abs(pTouch1X - page1X) <= 1 && Math.abs(pTouch1Y - page1Y) <= 1) {
    return;
  }
  _touchInfo.touch0X = page0X;
  _touchInfo.touch0Y = page0Y;
  _touchInfo.touch1X = page1X;
  _touchInfo.touch1Y = page1Y;
  if (pTouch0X === page0X && pTouch0Y === page0Y) {
    const v1X = pTouch1X - page0X;
    const v1Y = pTouch1Y - page0Y;
    const v2X = page1X - page0X;
    const v2Y = page1Y - page0Y;
    const det = v1X * v2Y - v1Y * v2X;
    if (Math.abs(det) > 0.02 * Math.hypot(v1X, v1Y) * Math.hypot(v2X, v2Y)) {
      return;
    }
  } else if (pTouch1X === page1X && pTouch1Y === page1Y) {
    const v1X = pTouch0X - page1X;
    const v1Y = pTouch0Y - page1Y;
    const v2X = page0X - page1X;
    const v2Y = page0Y - page1Y;
    const det = v1X * v2Y - v1Y * v2X;
    if (Math.abs(det) > 0.02 * Math.hypot(v1X, v1Y) * Math.hypot(v2X, v2Y)) {
      return;
    }
  } else {
    const diff0X = page0X - pTouch0X;
    const diff1X = page1X - pTouch1X;
    const diff0Y = page0Y - pTouch0Y;
    const diff1Y = page1Y - pTouch1Y;
    const dotProduct = diff0X * diff1X + diff0Y * diff1Y;
    if (dotProduct >= 0) {
      return;
    }
  }
  evt.preventDefault();
  const origin = [(page0X + page1X) / 2, (page0Y + page1Y) / 2];
  const distance = Math.hypot(page0X - page1X, page0Y - page1Y) || 1;
  const pDistance = Math.hypot(pTouch0X - pTouch1X, pTouch0Y - pTouch1Y) || 1;
  if (supportsPinchToZoom) {
    const newScaleFactor = this._accumulateFactor(pdfViewer.currentScale, distance / pDistance, "_touchUnusedFactor");
    this.updateZoom(null, newScaleFactor, origin);
  } else {
    const PIXELS_PER_LINE_SCALE = 30;
    const ticks = this._accumulateTicks((distance - pDistance) / PIXELS_PER_LINE_SCALE, "_touchUnusedTicks");
    this.updateZoom(ticks, null, origin);
  }
}
function onTouchEnd(evt) {
  if (!this._touchInfo) {
    return;
  }
  evt.preventDefault();
  this._touchInfo = null;
  this._touchUnusedTicks = 0;
  this._touchUnusedFactor = 1;
}
function onClick(evt) {
  if (!this.secondaryToolbar?.isOpen) {
    return;
  }
  const appConfig = this.appConfig;
  if (this.pdfViewer.containsElement(evt.target) || appConfig.toolbar?.container.contains(evt.target) && !appConfig.secondaryToolbar?.toggleButton.contains(evt.target)) {
    this.secondaryToolbar.close();
  }
}
function onKeyUp(evt) {
  if (evt.key === "Control") {
    this._isCtrlKeyDown = false;
  }
}
function onKeyDown(evt) {
  this._isCtrlKeyDown = evt.key === "Control";
  if (this.overlayManager.active) {
    return;
  }
  const {
    eventBus,
    pdfViewer
  } = this;
  const isViewerInPresentationMode = pdfViewer.isInPresentationMode;
  let handled = false,
    ensureViewerFocused = false;
  const cmd = (evt.ctrlKey ? 1 : 0) | (evt.altKey ? 2 : 0) | (evt.shiftKey ? 4 : 0) | (evt.metaKey ? 8 : 0);
  if (cmd === 1 || cmd === 8 || cmd === 5 || cmd === 12) {
    switch (evt.keyCode) {
      case 70:
        if (!this.supportsIntegratedFind && !evt.shiftKey) {
          this.findBar?.open();
          handled = true;
        }
        break;
      case 71:
        if (!this.supportsIntegratedFind) {
          const {
            state
          } = this.findController;
          if (state) {
            const newState = {
              source: window,
              type: "again",
              findPrevious: cmd === 5 || cmd === 12
            };
            eventBus.dispatch("find", {
              ...state,
              ...newState
            });
          }
          handled = true;
        }
        break;
      case 61:
      case 107:
      case 187:
      case 171:
        this.zoomIn();
        handled = true;
        break;
      case 173:
      case 109:
      case 189:
        this.zoomOut();
        handled = true;
        break;
      case 48:
      case 96:
        if (!isViewerInPresentationMode) {
          setTimeout(() => {
            this.zoomReset();
          });
          handled = false;
        }
        break;
      case 38:
        if (isViewerInPresentationMode || this.page > 1) {
          this.page = 1;
          handled = true;
          ensureViewerFocused = true;
        }
        break;
      case 40:
        if (isViewerInPresentationMode || this.page < this.pagesCount) {
          this.page = this.pagesCount;
          handled = true;
          ensureViewerFocused = true;
        }
        break;
    }
  }
  if (cmd === 1 || cmd === 8) {
    switch (evt.keyCode) {
      case 83:
        eventBus.dispatch("download", {
          source: window
        });
        handled = true;
        break;
      case 79:
        {
          eventBus.dispatch("openfile", {
            source: window
          });
          handled = true;
        }
        break;
    }
  }
  if (cmd === 3 || cmd === 10) {
    switch (evt.keyCode) {
      case 80:
        this.requestPresentationMode();
        handled = true;
        this.externalServices.reportTelemetry({
          type: "buttons",
          data: {
            id: "presentationModeKeyboard"
          }
        });
        break;
      case 71:
        if (this.appConfig.toolbar) {
          this.appConfig.toolbar.pageNumber.select();
          handled = true;
        }
        break;
    }
  }
  if (handled) {
    if (ensureViewerFocused && !isViewerInPresentationMode) {
      pdfViewer.focus();
    }
    evt.preventDefault();
    return;
  }
  const curElement = getActiveOrFocusedElement();
  const curElementTagName = curElement?.tagName.toUpperCase();
  if (curElementTagName === "INPUT" || curElementTagName === "TEXTAREA" || curElementTagName === "SELECT" || curElementTagName === "BUTTON" && (evt.keyCode === 13 || evt.keyCode === 32) || curElement?.isContentEditable) {
    if (evt.keyCode !== 27) {
      return;
    }
  }
  if (cmd === 0) {
    let turnPage = 0,
      turnOnlyIfPageFit = false;
    switch (evt.keyCode) {
      case 38:
        if (this.supportsCaretBrowsingMode) {
          this.moveCaret(true, false);
          handled = true;
          break;
        }
      case 33:
        if (pdfViewer.isVerticalScrollbarEnabled) {
          turnOnlyIfPageFit = true;
        }
        turnPage = -1;
        break;
      case 8:
        if (!isViewerInPresentationMode) {
          turnOnlyIfPageFit = true;
        }
        turnPage = -1;
        break;
      case 37:
        if (this.supportsCaretBrowsingMode) {
          return;
        }
        if (pdfViewer.isHorizontalScrollbarEnabled) {
          turnOnlyIfPageFit = true;
        }
      case 75:
      case 80:
        turnPage = -1;
        break;
      case 27:
        if (this.secondaryToolbar?.isOpen) {
          this.secondaryToolbar.close();
          handled = true;
        }
        if (!this.supportsIntegratedFind && this.findBar?.opened) {
          this.findBar.close();
          handled = true;
        }
        break;
      case 40:
        if (this.supportsCaretBrowsingMode) {
          this.moveCaret(false, false);
          handled = true;
          break;
        }
      case 34:
        if (pdfViewer.isVerticalScrollbarEnabled) {
          turnOnlyIfPageFit = true;
        }
        turnPage = 1;
        break;
      case 13:
      case 32:
        if (!isViewerInPresentationMode) {
          turnOnlyIfPageFit = true;
        }
        turnPage = 1;
        break;
      case 39:
        if (this.supportsCaretBrowsingMode) {
          return;
        }
        if (pdfViewer.isHorizontalScrollbarEnabled) {
          turnOnlyIfPageFit = true;
        }
      case 74:
      case 78:
        turnPage = 1;
        break;
      case 36:
        if (isViewerInPresentationMode || this.page > 1) {
          this.page = 1;
          handled = true;
          ensureViewerFocused = true;
        }
        break;
      case 35:
        if (isViewerInPresentationMode || this.page < this.pagesCount) {
          this.page = this.pagesCount;
          handled = true;
          ensureViewerFocused = true;
        }
        break;
      case 83:
        this.pdfCursorTools?.switchTool(CursorTool.SELECT);
        break;
      case 72:
        this.pdfCursorTools?.switchTool(CursorTool.HAND);
        break;
      case 82:
        this.rotatePages(90);
        break;
      case 115:
        this.pdfSidebar?.toggle();
        break;
    }
    if (turnPage !== 0 && (!turnOnlyIfPageFit || pdfViewer.currentScaleValue === "page-fit")) {
      if (turnPage > 0) {
        pdfViewer.nextPage();
      } else {
        pdfViewer.previousPage();
      }
      handled = true;
    }
  }
  if (cmd === 4) {
    switch (evt.keyCode) {
      case 13:
      case 32:
        if (!isViewerInPresentationMode && pdfViewer.currentScaleValue !== "page-fit") {
          break;
        }
        pdfViewer.previousPage();
        handled = true;
        break;
      case 38:
        this.moveCaret(true, true);
        handled = true;
        break;
      case 40:
        this.moveCaret(false, true);
        handled = true;
        break;
      case 82:
        this.rotatePages(-90);
        break;
    }
  }
  if (!handled && !isViewerInPresentationMode) {
    if (evt.keyCode >= 33 && evt.keyCode <= 40 || evt.keyCode === 32 && curElementTagName !== "BUTTON") {
      ensureViewerFocused = true;
    }
  }
  if (ensureViewerFocused && !pdfViewer.containsElement(curElement)) {
    pdfViewer.focus();
  }
  if (handled) {
    evt.preventDefault();
  }
}
function beforeUnload(evt) {
  evt.preventDefault();
  evt.returnValue = "";
  return false;
}

;// ./web/viewer.js




const pdfjsVersion = "4.7.119";
const pdfjsBuild = "689ffda9d";
const AppConstants = {
  LinkTarget: LinkTarget,
  RenderingStates: RenderingStates,
  ScrollMode: ScrollMode,
  SpreadMode: SpreadMode
};
window.PDFViewerApplication = PDFViewerApplication;
window.PDFViewerApplicationConstants = AppConstants;
window.PDFViewerApplicationOptions = AppOptions;
function getViewerConfiguration() {
  return {
    appContainer: document.body,
    principalContainer: document.getElementById("mainContainer"),
    mainContainer: document.getElementById("viewerContainer"),
    viewerContainer: document.getElementById("viewer"),
    toolbar: {
      container: document.getElementById("toolbarContainer"),
      numPages: document.getElementById("numPages"),
      pageNumber: document.getElementById("pageNumber"),
      scaleSelect: document.getElementById("scaleSelect"),
      customScaleOption: document.getElementById("customScaleOption"),
      previous: document.getElementById("previous"),
      next: document.getElementById("next"),
      zoomIn: document.getElementById("zoomInButton"),
      zoomOut: document.getElementById("zoomOutButton"),
      print: document.getElementById("printButton"),
      editorFreeTextButton: document.getElementById("editorFreeTextButton"),
      editorFreeTextParamsToolbar: document.getElementById("editorFreeTextParamsToolbar"),
      editorHighlightButton: document.getElementById("editorHighlightButton"),
      editorHighlightParamsToolbar: document.getElementById("editorHighlightParamsToolbar"),
      editorHighlightColorPicker: document.getElementById("editorHighlightColorPicker"),
      editorInkButton: document.getElementById("editorInkButton"),
      editorInkParamsToolbar: document.getElementById("editorInkParamsToolbar"),
      editorStampButton: document.getElementById("editorStampButton"),
      editorStampParamsToolbar: document.getElementById("editorStampParamsToolbar"),
      download: document.getElementById("downloadButton")
    },
    secondaryToolbar: {
      toolbar: document.getElementById("secondaryToolbar"),
      toggleButton: document.getElementById("secondaryToolbarToggleButton"),
      presentationModeButton: document.getElementById("presentationMode"),
      openFileButton: document.getElementById("secondaryOpenFile"),
      printButton: document.getElementById("secondaryPrint"),
      downloadButton: document.getElementById("secondaryDownload"),
      viewBookmarkButton: document.getElementById("viewBookmark"),
      firstPageButton: document.getElementById("firstPage"),
      lastPageButton: document.getElementById("lastPage"),
      pageRotateCwButton: document.getElementById("pageRotateCw"),
      pageRotateCcwButton: document.getElementById("pageRotateCcw"),
      cursorSelectToolButton: document.getElementById("cursorSelectTool"),
      cursorHandToolButton: document.getElementById("cursorHandTool"),
      scrollPageButton: document.getElementById("scrollPage"),
      scrollVerticalButton: document.getElementById("scrollVertical"),
      scrollHorizontalButton: document.getElementById("scrollHorizontal"),
      scrollWrappedButton: document.getElementById("scrollWrapped"),
      spreadNoneButton: document.getElementById("spreadNone"),
      spreadOddButton: document.getElementById("spreadOdd"),
      spreadEvenButton: document.getElementById("spreadEven"),
      imageAltTextSettingsButton: document.getElementById("imageAltTextSettings"),
      imageAltTextSettingsSeparator: document.getElementById("imageAltTextSettingsSeparator"),
      documentPropertiesButton: document.getElementById("documentProperties")
    },
    sidebar: {
      outerContainer: document.getElementById("outerContainer"),
      sidebarContainer: document.getElementById("sidebarContainer"),
      toggleButton: document.getElementById("sidebarToggleButton"),
      resizer: document.getElementById("sidebarResizer"),
      thumbnailButton: document.getElementById("viewThumbnail"),
      outlineButton: document.getElementById("viewOutline"),
      attachmentsButton: document.getElementById("viewAttachments"),
      layersButton: document.getElementById("viewLayers"),
      thumbnailView: document.getElementById("thumbnailView"),
      outlineView: document.getElementById("outlineView"),
      attachmentsView: document.getElementById("attachmentsView"),
      layersView: document.getElementById("layersView"),
      currentOutlineItemButton: document.getElementById("currentOutlineItem")
    },
    findBar: {
      bar: document.getElementById("findbar"),
      toggleButton: document.getElementById("viewFindButton"),
      findField: document.getElementById("findInput"),
      highlightAllCheckbox: document.getElementById("findHighlightAll"),
      caseSensitiveCheckbox: document.getElementById("findMatchCase"),
      matchDiacriticsCheckbox: document.getElementById("findMatchDiacritics"),
      entireWordCheckbox: document.getElementById("findEntireWord"),
      findMsg: document.getElementById("findMsg"),
      findResultsCount: document.getElementById("findResultsCount"),
      findPreviousButton: document.getElementById("findPreviousButton"),
      findNextButton: document.getElementById("findNextButton")
    },
    passwordOverlay: {
      dialog: document.getElementById("passwordDialog"),
      label: document.getElementById("passwordText"),
      input: document.getElementById("password"),
      submitButton: document.getElementById("passwordSubmit"),
      cancelButton: document.getElementById("passwordCancel")
    },
    documentProperties: {
      dialog: document.getElementById("documentPropertiesDialog"),
      closeButton: document.getElementById("documentPropertiesClose"),
      fields: {
        fileName: document.getElementById("fileNameField"),
        fileSize: document.getElementById("fileSizeField"),
        title: document.getElementById("titleField"),
        author: document.getElementById("authorField"),
        subject: document.getElementById("subjectField"),
        keywords: document.getElementById("keywordsField"),
        creationDate: document.getElementById("creationDateField"),
        modificationDate: document.getElementById("modificationDateField"),
        creator: document.getElementById("creatorField"),
        producer: document.getElementById("producerField"),
        version: document.getElementById("versionField"),
        pageCount: document.getElementById("pageCountField"),
        pageSize: document.getElementById("pageSizeField"),
        linearized: document.getElementById("linearizedField")
      }
    },
    altTextDialog: {
      dialog: document.getElementById("altTextDialog"),
      optionDescription: document.getElementById("descriptionButton"),
      optionDecorative: document.getElementById("decorativeButton"),
      textarea: document.getElementById("descriptionTextarea"),
      cancelButton: document.getElementById("altTextCancel"),
      saveButton: document.getElementById("altTextSave")
    },
    newAltTextDialog: {
      dialog: document.getElementById("newAltTextDialog"),
      title: document.getElementById("newAltTextTitle"),
      descriptionContainer: document.getElementById("newAltTextDescriptionContainer"),
      textarea: document.getElementById("newAltTextDescriptionTextarea"),
      disclaimer: document.getElementById("newAltTextDisclaimer"),
      learnMore: document.getElementById("newAltTextLearnMore"),
      imagePreview: document.getElementById("newAltTextImagePreview"),
      createAutomatically: document.getElementById("newAltTextCreateAutomatically"),
      createAutomaticallyButton: document.getElementById("newAltTextCreateAutomaticallyButton"),
      downloadModel: document.getElementById("newAltTextDownloadModel"),
      downloadModelDescription: document.getElementById("newAltTextDownloadModelDescription"),
      error: document.getElementById("newAltTextError"),
      errorCloseButton: document.getElementById("newAltTextCloseButton"),
      cancelButton: document.getElementById("newAltTextCancel"),
      notNowButton: document.getElementById("newAltTextNotNow"),
      saveButton: document.getElementById("newAltTextSave")
    },
    altTextSettingsDialog: {
      dialog: document.getElementById("altTextSettingsDialog"),
      createModelButton: document.getElementById("createModelButton"),
      aiModelSettings: document.getElementById("aiModelSettings"),
      learnMore: document.getElementById("altTextSettingsLearnMore"),
      deleteModelButton: document.getElementById("deleteModelButton"),
      downloadModelButton: document.getElementById("downloadModelButton"),
      showAltTextDialogButton: document.getElementById("showAltTextDialogButton"),
      altTextSettingsCloseButton: document.getElementById("altTextSettingsCloseButton"),
      closeButton: document.getElementById("altTextSettingsCloseButton")
    },
    annotationEditorParams: {
      editorFreeTextFontSize: document.getElementById("editorFreeTextFontSize"),
      editorFreeTextColor: document.getElementById("editorFreeTextColor"),
      editorInkColor: document.getElementById("editorInkColor"),
      editorInkThickness: document.getElementById("editorInkThickness"),
      editorInkOpacity: document.getElementById("editorInkOpacity"),
      editorStampAddImage: document.getElementById("editorStampAddImage"),
      editorFreeHighlightThickness: document.getElementById("editorFreeHighlightThickness"),
      editorHighlightShowAll: document.getElementById("editorHighlightShowAll")
    },
    printContainer: document.getElementById("printContainer")
  };
}
function webViewerLoad() {
  const config = getViewerConfiguration();
  const event = new CustomEvent("webviewerloaded", {
    bubbles: true,
    cancelable: true,
    detail: {
      source: window
    }
  });
  try {
    parent.document.dispatchEvent(event);
  } catch (ex) {
    console.error(`webviewerloaded: ${ex}`);
    document.dispatchEvent(event);
  }
  PDFViewerApplication.run(config);
}
window.slickPdfView = function(url){


  //CHECK IF THE STYLESHEET EXISTS
  var styleExists = !!document.getElementById('sp-viewer-styles');

    //IF THE STYLESHEET DOESNT EXIST
    if(!styleExists){

      //DEFINE THE CSS ELEMENT
      var styleEle = `<style id="sp-viewer-styles">
        .toggle-button,.xfaLayer *{box-sizing:border-box;margin:0}#sidebarContainer,#sidebarContent{inset-block:var(--toolbar-height) 0}#findbar,#toolbarContainer{background-color:var(--toolbar-bg-color)}#sidebarContainer,#toolbarContainer #loadingBar,#viewerContainer:not(.pdfPresentationMode){transition-duration:var(--sidebar-transition-duration);transition-timing-function:var(--sidebar-transition-timing-function)}.dialog{--dialog-bg-color:white;--dialog-border-color:white;--dialog-shadow:0 2px 14px 0 rgb(58 57 68 / 0.2);--text-primary-color:#15141a;--text-secondary-color:#5b5b66;--hover-filter:brightness(0.9);--focus-ring-color:#0060df;--focus-ring-outline:2px solid var(--focus-ring-color);--link-fg-color:#0060df;--link-hover-fg-color:#0250bb;--separator-color:#f0f0f4;--textarea-border-color:#8f8f9d;--textarea-bg-color:white;--textarea-fg-color:var(--text-secondary-color);--radio-bg-color:#f0f0f4;--radio-checked-bg-color:#fbfbfe;--radio-border-color:#8f8f9d;--radio-checked-border-color:#0060df;--button-secondary-bg-color:#f0f0f4;--button-secondary-fg-color:var(--text-primary-color);--button-secondary-border-color:var(--button-secondary-bg-color);--button-secondary-hover-bg-color:var(--button-secondary-bg-color);--button-secondary-hover-fg-color:var(--button-secondary-fg-color);--button-secondary-hover-border-color:var(--button-secondary-hover-bg-color);--button-primary-bg-color:#0060df;--button-primary-fg-color:#fbfbfe;--button-primary-border-color:var(--button-primary-bg-color);--button-primary-hover-bg-color:var(--button-primary-bg-color);--button-primary-hover-fg-color:var(--button-primary-fg-color);--button-primary-hover-border-color:var(--button-primary-hover-bg-color);font:message-box;font-size:13px;font-weight:400;line-height:150%;border-radius:4px;padding:12px 16px;border:1px solid var(--dialog-border-color);background:var(--dialog-bg-color);color:var(--text-primary-color);box-shadow:var(--dialog-shadow)}:where(html.is-dark) .dialog{--dialog-bg-color:#1c1b22;--dialog-border-color:#1c1b22;--dialog-shadow:0 2px 14px 0 #15141a;--text-primary-color:#fbfbfe;--text-secondary-color:#cfcfd8;--focus-ring-color:#0df;--hover-filter:brightness(1.4);--link-fg-color:#0df;--link-hover-fg-color:#80ebff;--separator-color:#52525e;--textarea-bg-color:#42414d;--radio-bg-color:#2b2a33;--radio-checked-bg-color:#15141a;--radio-checked-border-color:#0df;--button-secondary-bg-color:#2b2a33;--button-primary-bg-color:#0df;--button-primary-fg-color:#15141a}:is(.dialog .mainContainer) :focus-visible{outline:var(--focus-ring-outline);outline-offset:2px}:is(.dialog .mainContainer) .title{display:flex;width:auto;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:12px}:is(:is(.dialog .mainContainer) .title)>span{font-size:13px;font-style:normal;font-weight:590;line-height:150%}:is(.dialog .mainContainer) .dialogSeparator{width:100%;height:0;margin-block:4px;border-top:1px solid var(--separator-color);border-bottom:none}:is(.dialog .mainContainer) .dialogButtonsGroup{display:flex;gap:12px;align-self:flex-end}:is(.dialog .mainContainer) .radio{display:flex;flex-direction:column;align-items:flex-start;gap:4px}:is(:is(.dialog .mainContainer) .radio)>.radioButton{display:flex;gap:8px;align-self:stretch;align-items:center}:is(:is(:is(.dialog .mainContainer) .radio) > .radioButton) input{-webkit-appearance:none;-moz-appearance:none;appearance:none;box-sizing:border-box;width:16px;height:16px;border-radius:50%;background-color:var(--radio-bg-color);border:1px solid var(--radio-border-color)}:is(:is(:is(:is(.dialog .mainContainer) .radio) > .radioButton) input):hover{filter:var(--hover-filter)}:is(:is(:is(:is(.dialog .mainContainer) .radio) > .radioButton) input):checked{background-color:var(--radio-checked-bg-color);border:4px solid var(--radio-checked-border-color)}:is(:is(.dialog .mainContainer) .radio)>.radioLabel{display:flex;padding-inline-start:24px;align-items:flex-start;gap:10px;align-self:stretch}:is(:is(:is(.dialog .mainContainer) .radio) > .radioLabel)>span{flex:1 0 0;font-size:11px;color:var(--text-secondary-color)}:is(.dialog .mainContainer) button:not(:is(.toggle-button,.closeButton)){border-radius:4px;border:1px solid;font:menu;font-weight:600;padding:4px 16px;width:auto;height:32px}:is(:is(.dialog .mainContainer) button:not(:is(.toggle-button,.closeButton))):hover{cursor:pointer;filter:var(--hover-filter)}.secondaryButton:is(:is(.dialog .mainContainer) button:not(:is(.toggle-button,.closeButton))){color:var(--button-secondary-fg-color);background-color:var(--button-secondary-bg-color);border-color:var(--button-secondary-border-color)}.secondaryButton:is(:is(.dialog .mainContainer) button:not(:is(.toggle-button,.closeButton))):hover{color:var(--button-secondary-hover-fg-color);background-color:var(--button-secondary-hover-bg-color);border-color:var(--button-secondary-hover-border-color)}.primaryButton:is(:is(.dialog .mainContainer) button:not(:is(.toggle-button,.closeButton))){color:var(--button-primary-fg-color);background-color:var(--button-primary-bg-color);border-color:var(--button-primary-border-color);opacity:1}.primaryButton:is(:is(.dialog .mainContainer) button:not(:is(.toggle-button,.closeButton))):hover{color:var(--button-primary-hover-fg-color);background-color:var(--button-primary-hover-bg-color);border-color:var(--button-primary-hover-border-color)}:is(.dialog .mainContainer) a{color:var(--link-fg-color)}:is(:is(.dialog .mainContainer) a):hover{color:var(--link-hover-fg-color)}:is(.dialog .mainContainer) textarea{font:inherit;padding:8px;resize:none;margin:0;box-sizing:border-box;border-radius:4px;border:1px solid var(--textarea-border-color);background:var(--textarea-bg-color);color:var(--textarea-fg-color)}:is(:is(.dialog .mainContainer) textarea):focus{outline-offset:0;border-color:transparent}:is(:is(.dialog .mainContainer) textarea):disabled{pointer-events:none;opacity:.4}:is(.dialog .mainContainer) .messageBar{--message-bar-warning-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNC44NzQ4IDEyLjAzN0w5LjM3NzgyIDIuMDM3QzguOTk2ODIgMS4zNDYgOC4zMTA4MiAxIDcuNjI0ODIgMUM2LjkzODgyIDEgNi4yNTI4MiAxLjM0NiA1Ljg3MjgyIDIuMDM3TDAuMzc1ODIzIDEyLjAzN0MtMC4zNTgxNzcgMTMuMzcgMC42MDY4MjMgMTUgMi4xMjc4MiAxNUgxMy4xMjI4QzE0LjY0MjggMTUgMTUuNjA3OCAxMy4zNyAxNC44NzQ4IDEyLjAzN1pNOC4yNDk4MiAxMS43NUw3Ljk5OTgyIDEySDcuMjQ5ODJMNi45OTk4MiAxMS43NVYxMUw3LjI0OTgyIDEwLjc1SDcuOTk5ODJMOC4yNDk4MiAxMVYxMS43NVpNOC4yNDk4MiA5LjA2MkM4LjI0OTgyIDkuMjI3NzYgOC4xODM5OCA5LjM4NjczIDguMDY2NzcgOS41MDM5NEM3Ljk0OTU1IDkuNjIxMTUgNy43OTA1OCA5LjY4NyA3LjYyNDgyIDkuNjg3QzcuNDU5MDYgOS42ODcgNy4zMDAwOSA5LjYyMTE1IDcuMTgyODggOS41MDM5NEM3LjA2NTY3IDkuMzg2NzMgNi45OTk4MiA5LjIyNzc2IDYuOTk5ODIgOS4wNjJWNS42MjVDNi45OTk4MiA1LjQ1OTI0IDcuMDY1NjcgNS4zMDAyNyA3LjE4Mjg4IDUuMTgzMDZDNy4zMDAwOSA1LjA2NTg1IDcuNDU5MDYgNSA3LjYyNDgyIDVDNy43OTA1OCA1IDcuOTQ5NTUgNS4wNjU4NSA4LjA2Njc3IDUuMTgzMDZDOC4xODM5OCA1LjMwMDI3IDguMjQ5ODIgNS40NTkyNCA4LjI0OTgyIDUuNjI1VjkuMDYyWiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--closing-button-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik03Ljg1ODIyIDguODQ5MjJMNC44NTMyMiAxMS44NTQyQzQuNzU4OTEgMTEuOTQ1MyA0LjYzMjYxIDExLjk5NTcgNC41MDE1MSAxMS45OTQ2QzQuMzcwNDIgMTEuOTkzNCA0LjI0NTAxIDExLjk0MDggNC4xNTIzMSAxMS44NDgxQzQuMDU5NiAxMS43NTU0IDQuMDA3MDIgMTEuNjMgNC4wMDU4OCAxMS40OTg5QzQuMDA0NzQgMTEuMzY3OCA0LjA1NTE0IDExLjI0MTUgNC4xNDYyMiAxMS4xNDcyTDcuMTUxMjIgOC4xNDIyMlY3Ljg1OTIyTDQuMTQ2MjIgNC44NTMyMkM0LjA1NTE0IDQuNzU4OTEgNC4wMDQ3NCA0LjYzMjYxIDQuMDA1ODggNC41MDE1MUM0LjAwNzAyIDQuMzcwNDIgNC4wNTk2IDQuMjQ1MDEgNC4xNTIzMSA0LjE1MjMxQzQuMjQ1MDEgNC4wNTk2IDQuMzcwNDIgNC4wMDcwMiA0LjUwMTUxIDQuMDA1ODhDNC42MzI2MSA0LjAwNDc0IDQuNzU4OTEgNC4wNTUxNCA0Ljg1MzIyIDQuMTQ2MjJMNy44NTgyMiA3LjE1MTIySDguMTQxMjJMMTEuMTQ2MiA0LjE0NjIyQzExLjI0MDUgNC4wNTUxNCAxMS4zNjY4IDQuMDA0NzQgMTEuNDk3OSA0LjAwNTg4QzExLjYyOSA0LjAwNzAyIDExLjc1NDQgNC4wNTk2IDExLjg0NzEgNC4xNTIzMUMxMS45Mzk4IDQuMjQ1MDEgMTEuOTkyNCA0LjM3MDQyIDExLjk5MzYgNC41MDE1MUMxMS45OTQ3IDQuNjMyNjEgMTEuOTQ0MyA0Ljc1ODkxIDExLjg1MzIgNC44NTMyMkw4Ljg0ODIyIDcuODU5MjJWOC4xNDIyMkwxMS44NTMyIDExLjE0NzJDMTEuOTQ0MyAxMS4yNDE1IDExLjk5NDcgMTEuMzY3OCAxMS45OTM2IDExLjQ5ODlDMTEuOTkyNCAxMS42MyAxMS45Mzk4IDExLjc1NTQgMTEuODQ3MSAxMS44NDgxQzExLjc1NDQgMTEuOTQwOCAxMS42MjkgMTEuOTkzNCAxMS40OTc5IDExLjk5NDZDMTEuMzY2OCAxMS45OTU3IDExLjI0MDUgMTEuOTQ1MyAxMS4xNDYyIDExLjg1NDJMOC4xNDEyMiA4Ljg0OTIyTDguMTQyMjIgOC44NTAyMkw3Ljg1ODIyIDguODQ5MjJaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--message-bar-bg-color:#ffebcd;--message-bar-fg-color:#15141a;--message-bar-border-color:rgb(0 0 0 / 0.08);--message-bar-icon-color:#cd411e;--message-bar-close-button-border-radius:4px;--message-bar-close-button-border:none;--message-bar-close-button-color:var(--text-primary-color);--message-bar-close-button-hover-bg-color:rgb(21 20 26 / 0.14);--message-bar-close-button-active-bg-color:rgb(21 20 26 / 0.21);--message-bar-close-button-focus-bg-color:rgb(21 20 26 / 0.07);--message-bar-close-button-color-hover:var(--text-primary-color);display:flex;position:relative;padding:12px 8px 12px 0;flex-direction:column;justify-content:center;align-items:flex-start;gap:8px;align-self:stretch;border-radius:4px;border:1px solid var(--message-bar-border-color);background:var(--message-bar-bg-color);color:var(--message-bar-fg-color)}:where(html.is-dark) :is(.dialog .mainContainer) .messageBar{--message-bar-bg-color:#5a3100;--message-bar-fg-color:#fbfbfe;--message-bar-border-color:rgb(255 255 255 / 0.08);--message-bar-icon-color:#e49c49;--message-bar-close-button-hover-bg-color:rgb(251 251 254 / 0.14);--message-bar-close-button-active-bg-color:rgb(251 251 254 / 0.21);--message-bar-close-button-focus-bg-color:rgb(251 251 254 / 0.07)}:is(:is(.dialog .mainContainer) .messageBar)>div{display:flex;padding-inline-start:16px;align-items:flex-start;gap:8px;align-self:stretch}:is(:is(:is(.dialog .mainContainer) .messageBar) > div)::before{content:"";display:inline-block;width:16px;height:16px;-webkit-mask-image:var(--message-bar-warning-icon);mask-image:var(--message-bar-warning-icon);-webkit-mask-size:cover;mask-size:cover;background-color:var(--message-bar-icon-color)}:is(:is(:is(.dialog .mainContainer) .messageBar) > div)>div{display:flex;flex-direction:column;align-items:flex-start;gap:8px;flex:1 0 0}:is(:is(:is(:is(.dialog .mainContainer) .messageBar) > div) > div) .title{font-size:13px;font-weight:590}:is(:is(:is(:is(.dialog .mainContainer) .messageBar) > div) > div) .description{font-size:13px}:is(:is(.dialog .mainContainer) .messageBar) .closeButton{position:absolute;width:32px;height:32px;inset-inline-end:8px;inset-block-start:8px;background:0 0;border-radius:var(--message-bar-close-button-border-radius);border:var(--message-bar-close-button-border)}:is(:is(:is(.dialog .mainContainer) .messageBar) .closeButton)::before{content:"";display:inline-block;width:16px;height:16px;-webkit-mask-image:var(--closing-button-icon);mask-image:var(--closing-button-icon);-webkit-mask-size:cover;mask-size:cover;background-color:var(--message-bar-close-button-color)}:is(:is(:is(.dialog .mainContainer) .messageBar) .closeButton):is(:hover,:active,:focus)::before{background-color:var(--message-bar-close-button-color-hover)}:is(:is(:is(.dialog .mainContainer) .messageBar) .closeButton):hover{background-color:var(--message-bar-close-button-hover-bg-color)}:is(:is(:is(.dialog .mainContainer) .messageBar) .closeButton):active{background-color:var(--message-bar-close-button-active-bg-color)}:is(:is(:is(.dialog .mainContainer) .messageBar) .closeButton):focus{background-color:var(--message-bar-close-button-focus-bg-color)}:is(:is(:is(.dialog .mainContainer) .messageBar) .closeButton)>span{display:inline-block;width:0;height:0;overflow:hidden}:is(.dialog .mainContainer) .toggler{display:flex;align-items:center;gap:8px;align-self:stretch}:is(:is(.dialog .mainContainer) .toggler)>.togglerLabel{-webkit-user-select:none;-moz-user-select:none;user-select:none}.textLayer{position:absolute;text-align:initial;inset:0;overflow:clip;opacity:1;line-height:1;-webkit-text-size-adjust:none;-moz-text-size-adjust:none;text-size-adjust:none;forced-color-adjust:none;transform-origin:0 0;caret-color:CanvasText;z-index:0}.textLayer :is(span,br){color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%}.textLayer .endOfContent,.textLayer span[role=img]{cursor:default;-webkit-user-select:none;-moz-user-select:none}.textLayer .markedContent span:not(.markedContent),.textLayer>:not(.markedContent){z-index:1}.textLayer span.markedContent{top:0;height:0}.textLayer span[role=img]{user-select:none}.textLayer .highlight{--highlight-bg-color:rgb(180 0 170 / 0.25);--highlight-selected-bg-color:rgb(0 100 0 / 0.25);--highlight-backdrop-filter:none;--highlight-selected-backdrop-filter:none;margin:-1px;padding:1px;background-color:var(--highlight-bg-color);-webkit-backdrop-filter:var(--highlight-backdrop-filter);backdrop-filter:var(--highlight-backdrop-filter);border-radius:4px}.appended:is(.textLayer .highlight){position:initial}.begin:is(.textLayer .highlight){border-radius:4px 0 0 4px}.end:is(.textLayer .highlight){border-radius:0 4px 4px 0}.middle:is(.textLayer .highlight){border-radius:0}.selected:is(.textLayer .highlight){background-color:var(--highlight-selected-bg-color);-webkit-backdrop-filter:var(--highlight-selected-backdrop-filter);backdrop-filter:var(--highlight-selected-backdrop-filter)}.textLayer ::-moz-selection{background:rgba(0 0 255 / .25);background:color-mix(in srgb,AccentColor,transparent 75%)}.textLayer ::selection{background:rgba(0 0 255 / .25);background:color-mix(in srgb,AccentColor,transparent 75%)}.textLayer br::-moz-selection{background:0 0}.textLayer br::selection{background:0 0}.textLayer .endOfContent{display:block;position:absolute;inset:100% 0 0;z-index:0;user-select:none}#outerContainer.sidebarOpen #sidebarContainer,#sidebarContent{inset-inline-start:0}.annotationLayer .popup,.annotationLayer .popupTriggerArea,.xfaButton{cursor:pointer}.textLayer.selecting .endOfContent{top:0}.annotationLayer{--annotation-unfocused-field-background:url("data:image/svg+xml;charset=UTF-8,<svg width='1px' height='1px' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' style='fill:rgba(0, 54, 255, 0.13);'/></svg>");--input-focus-border-color:Highlight;--input-focus-outline:1px solid Canvas;--input-unfocused-border-color:transparent;--input-disabled-border-color:transparent;--input-hover-border-color:black;--link-outline:none;position:absolute;top:0;left:0;pointer-events:none;transform-origin:0 0}@media screen and (forced-colors:active){.dialog{--dialog-bg-color:Canvas;--dialog-border-color:CanvasText;--dialog-shadow:none;--text-primary-color:CanvasText;--text-secondary-color:CanvasText;--hover-filter:none;--focus-ring-color:ButtonBorder;--link-fg-color:LinkText;--link-hover-fg-color:LinkText;--separator-color:CanvasText;--textarea-border-color:ButtonBorder;--textarea-bg-color:Field;--textarea-fg-color:ButtonText;--radio-bg-color:ButtonFace;--radio-checked-bg-color:ButtonFace;--radio-border-color:ButtonText;--radio-checked-border-color:ButtonText;--button-secondary-bg-color:ButtonFace;--button-secondary-fg-color:ButtonText;--button-secondary-border-color:ButtonText;--button-secondary-hover-bg-color:AccentColor;--button-secondary-hover-fg-color:AccentColorText;--button-primary-bg-color:ButtonText;--button-primary-fg-color:ButtonFace;--button-primary-hover-bg-color:AccentColor;--button-primary-hover-fg-color:AccentColorText}:is(.dialog .mainContainer) .messageBar{--message-bar-bg-color:HighlightText;--message-bar-fg-color:CanvasText;--message-bar-border-color:CanvasText;--message-bar-icon-color:CanvasText;--message-bar-close-button-color:ButtonText;--message-bar-close-button-border:1px solid ButtonText;--message-bar-close-button-hover-bg-color:ButtonText;--message-bar-close-button-active-bg-color:ButtonText;--message-bar-close-button-focus-bg-color:ButtonText;--message-bar-close-button-color-hover:HighlightText}.textLayer .highlight{--highlight-bg-color:transparent;--highlight-selected-bg-color:transparent;--highlight-backdrop-filter:var(--hcm-highlight-filter);--highlight-selected-backdrop-filter:var(--hcm-highlight-selected-filter)}.annotationLayer{--input-focus-border-color:CanvasText;--input-unfocused-border-color:ActiveText;--input-disabled-border-color:GrayText;--input-hover-border-color:Highlight;--link-outline:1.5px solid LinkText}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) input:required,.annotationLayer .choiceWidgetAnnotation select:required,.annotationLayer .textWidgetAnnotation :is(input,textarea):required{outline:selectedItem solid 1.5px}.annotationLayer .linkAnnotation{outline:var(--link-outline)}:is(.annotationLayer .linkAnnotation):hover{-webkit-backdrop-filter:var(--hcm-highlight-filter);backdrop-filter:var(--hcm-highlight-filter)}:is(.annotationLayer .linkAnnotation)>a:hover{opacity:0!important;background:0 0!important;box-shadow:none}.annotationLayer .popupAnnotation .popup{outline:calc(1.5px * var(--scale-factor)) solid CanvasText!important;background-color:ButtonFace!important;color:ButtonText!important}.annotationLayer .highlightArea:hover::after{position:absolute;top:0;left:0;width:100%;height:100%;-webkit-backdrop-filter:var(--hcm-highlight-filter);backdrop-filter:var(--hcm-highlight-filter);content:"";pointer-events:none}.annotationLayer .popupAnnotation.focused .popup{outline:calc(3px * var(--scale-factor)) solid Highlight!important}}.annotationLayer[data-main-rotation="90"] .norotate,[data-main-rotation="270"]{transform:rotate(270deg) translateX(-100%)}.annotationLayer[data-main-rotation="180"] .norotate,[data-main-rotation="180"]{transform:rotate(180deg) translate(-100%,-100%)}.annotationLayer[data-main-rotation="270"] .norotate,[data-main-rotation="90"]{transform:rotate(90deg) translateY(-100%)}.annotationLayer section,.xfaLayer{text-align:initial;transform-origin:0 0}.annotationEditorLayer.disabled,.annotationLayer.disabled .popup,.annotationLayer.disabled section,.textLayer.selecting~.annotationLayer section,.xfaLayer div,.xfaLayer svg,.xfaLayer svg *{pointer-events:none}.annotationLayer .annotationContent{position:absolute;width:100%;height:100%;pointer-events:none}.freetext:is(.annotationLayer .annotationContent){background:0 0;border:none;inset:0;overflow:visible;white-space:nowrap;font:10px/1.35 sans-serif;-webkit-user-select:none;-moz-user-select:none;user-select:none}.annotationLayer section{position:absolute;pointer-events:auto;box-sizing:border-box}:is(.annotationLayer section):has(div.annotationContent) canvas.annotationContent{display:none}.annotationLayer :is(.linkAnnotation,.buttonWidgetAnnotation.pushButton)>a{position:absolute;font-size:1em;top:0;left:0;width:100%;height:100%}.annotationLayer :is(.linkAnnotation,.buttonWidgetAnnotation.pushButton):not(.hasBorder)>a:hover{opacity:.2;background-color:rgb(255 255 0);box-shadow:0 2px 10px rgb(255 255 0)}.annotationLayer .linkAnnotation.hasBorder:hover{background-color:rgb(255 255 0 / .2)}.annotationLayer .hasBorder{background-size:100% 100%}.annotationLayer .textAnnotation img{position:absolute;cursor:pointer;width:100%;height:100%;top:0;left:0}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) input,.annotationLayer .choiceWidgetAnnotation select,.annotationLayer .textWidgetAnnotation :is(input,textarea){background-image:var(--annotation-unfocused-field-background);border:2px solid var(--input-unfocused-border-color);box-sizing:border-box;font:calc(9px * var(--scale-factor)) sans-serif;height:100%;margin:0;vertical-align:top;width:100%}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) input:required,.annotationLayer .choiceWidgetAnnotation select:required,.annotationLayer .textWidgetAnnotation :is(input,textarea):required{outline:red solid 1.5px}.annotationLayer .choiceWidgetAnnotation select option{padding:0}.annotationLayer .buttonWidgetAnnotation.radioButton input{border-radius:50%}.annotationLayer .textWidgetAnnotation textarea{resize:none}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) input[disabled],.annotationLayer .choiceWidgetAnnotation select[disabled],.annotationLayer .textWidgetAnnotation [disabled]:is(input,textarea){background:0 0;border:2px solid var(--input-disabled-border-color);cursor:not-allowed}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) input:hover,.annotationLayer .choiceWidgetAnnotation select:hover,.annotationLayer .textWidgetAnnotation :is(input,textarea):hover{border:2px solid var(--input-hover-border-color)}.annotationLayer .buttonWidgetAnnotation.checkBox input:hover,.annotationLayer .choiceWidgetAnnotation select:hover,.annotationLayer .textWidgetAnnotation :is(input,textarea):hover{border-radius:2px}.annotationLayer .choiceWidgetAnnotation select:focus,.annotationLayer .textWidgetAnnotation :is(input,textarea):focus{background:0 0;border:2px solid var(--input-focus-border-color);border-radius:2px;outline:var(--input-focus-outline)}.xfaBorder,.xfaLayer,.xfaLayer *{background-color:transparent}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) :focus{background-image:none;background-color:transparent}.annotationLayer .buttonWidgetAnnotation.checkBox :focus{border:2px solid var(--input-focus-border-color);border-radius:2px;outline:var(--input-focus-outline)}.annotationLayer .buttonWidgetAnnotation.radioButton :focus{border:2px solid var(--input-focus-border-color);outline:var(--input-focus-outline)}.annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after,.annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before,.annotationLayer .buttonWidgetAnnotation.radioButton input:checked::before{background-color:CanvasText;content:"";display:block;position:absolute}.annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after,.annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before{height:80%;left:45%;width:1px}.annotationLayer .buttonWidgetAnnotation.checkBox input:checked::before{transform:rotate(45deg)}.annotationLayer .buttonWidgetAnnotation.checkBox input:checked::after{transform:rotate(-45deg)}.annotationLayer .buttonWidgetAnnotation.radioButton input:checked::before{border-radius:50%;height:50%;left:25%;top:25%;width:50%}.annotationLayer .textWidgetAnnotation input.comb{font-family:monospace;padding-left:2px;padding-right:0}.annotationLayer .textWidgetAnnotation input.comb:focus{width:103%}.annotationLayer .buttonWidgetAnnotation:is(.checkBox,.radioButton) input{-webkit-appearance:none;-moz-appearance:none;appearance:none}.annotationLayer .fileAttachmentAnnotation .popupTriggerArea,.xfaLabel,body,html{height:100%;width:100%}.annotationLayer .popupAnnotation{position:absolute;font-size:calc(9px * var(--scale-factor));pointer-events:none;width:-moz-max-content;width:max-content;max-width:45%;height:auto}.annotationLayer .popup{background-color:rgb(255 255 153);box-shadow:0 calc(2px * var(--scale-factor)) calc(5px * var(--scale-factor)) rgb(136 136 136);border-radius:calc(2px * var(--scale-factor));outline:rgb(255 255 74) solid 1.5px;padding:calc(6px * var(--scale-factor));font:message-box;white-space:normal;word-wrap:break-word;pointer-events:auto}.annotationLayer .popup *,.annotationLayer .richText>*{font-size:calc(9px * var(--scale-factor))}.annotationLayer .popupAnnotation.focused .popup{outline-width:3px}.annotationLayer .popup>.header{display:inline-block}.annotationLayer .popup>.header h1,.toggleButton{display:inline}.annotationLayer .popup>.header .popupDate{display:inline-block;margin-left:calc(5px * var(--scale-factor));width:-moz-fit-content;width:fit-content}.annotationLayer .popupContent{border-top:1px solid rgb(51 51 51);margin-top:calc(2px * var(--scale-factor));padding-top:calc(2px * var(--scale-factor))}.annotationLayer .richText>*{white-space:pre-wrap}.annotationLayer section svg{position:absolute;width:100%;height:100%;top:0;left:0}.annotationLayer .annotationTextContent{position:absolute;width:100%;height:100%;opacity:0;color:transparent;-webkit-user-select:none;-moz-user-select:none;user-select:none;pointer-events:none}:is(.annotationLayer .annotationTextContent) span{width:100%;display:inline-block}.annotationLayer svg.quadrilateralsContainer{contain:strict;width:0;height:0;position:absolute;top:0;left:0;z-index:-1}:root{--xfa-unfocused-field-background:url("data:image/svg+xml;charset=UTF-8,<svg width='1px' height='1px' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' style='fill:rgba(0, 54, 255, 0.13);'/></svg>");--xfa-focus-outline:auto}@media screen and (forced-colors:active){:root{--xfa-focus-outline:2px solid CanvasText}.xfaLayer :required{outline:selectedItem solid 1.5px}}.xfaLayer .highlight{margin:-1px;padding:1px;background-color:rgb(239 203 237);border-radius:4px}.xfaLayer .highlight.appended{position:initial}.xfaLayer .highlight.begin{border-radius:4px 0 0 4px}.xfaLayer .highlight.end{border-radius:0 4px 4px 0}.xfaLayer .highlight.middle{border-radius:0}.xfaButton,.xfaCheckbox,.xfaRadio,.xfaSelect,.xfaTextfield{border:none;width:100%;height:100%}.xfaLayer .highlight.selected{background-color:rgb(203 223 203)}.xfaPage{overflow:hidden;position:relative}.xfaBorder,.xfaContentarea,.xfaLayer,.xfaLink{position:absolute}.xfaPrintOnly{display:none}.xfaLayer{top:0;left:0;line-height:1.2}.xfaLayer *{color:inherit;font:inherit;font-style:inherit;font-weight:inherit;font-kerning:inherit;letter-spacing:-.01px;text-align:inherit;text-decoration:inherit;padding:0;pointer-events:auto;line-height:inherit}#passwordDialog,.xfaButton,dialog .buttonRow{text-align:center}.treeItem>a,.xfaFont{text-decoration:none}.xfaLayer :required{outline:red solid 1.5px}.xfaLayer a{color:#00f}.xfaRich li{margin-left:3em}.xfaFont{color:#000;font-weight:400;font-kerning:none;font-size:10px;font-style:normal;letter-spacing:0;vertical-align:0}.xfaCaption{overflow:hidden;flex:0 0 auto}.xfaCaptionForCheckButton{overflow:hidden;flex:1 1 auto}.xfaLeft{display:flex;flex-direction:row;align-items:center}.xfaRight{display:flex;flex-direction:row-reverse;align-items:center}:is(.xfaLeft,.xfaRight)>:is(.xfaCaption,.xfaCaptionForCheckButton){max-height:100%}.xfaTop{display:flex;flex-direction:column;align-items:flex-start}.xfaBottom{display:flex;flex-direction:column-reverse;align-items:flex-start}:is(.xfaTop,.xfaBottom)>:is(.xfaCaption,.xfaCaptionForCheckButton){width:100%}.xfaBorder{pointer-events:none}.annotationEditorLayer .inkEditor,.xfaWrapped{width:100%;height:100%}:is(.xfaTextfield,.xfaSelect):focus{background-image:none;background-color:transparent;outline:var(--xfa-focus-outline);outline-offset:-1px}:is(.xfaCheckbox,.xfaRadio):focus{outline:var(--xfa-focus-outline)}.xfaSelect,.xfaTextfield{flex:1 1 auto;resize:none;background-image:var(--xfa-unfocused-field-background)}.xfaSelect{padding-inline:2px}:is(.xfaTop,.xfaBottom)>:is(.xfaTextfield,.xfaSelect){flex:0 1 auto}.xfaLink{width:100%;height:100%;top:0;left:0}.xfaCheckbox,.xfaRadio{flex:0 0 auto}.xfaRich{white-space:pre-wrap;width:100%;height:100%}.pdfViewer.scrollHorizontal,.spread,.visuallyHidden{white-space:nowrap}.xfaImage{-o-object-position:left top;object-position:left top;-o-object-fit:contain;object-fit:contain;width:100%;height:100%}.xfaLrTb,.xfaRlTb,.xfaTable,.xfaTb{display:flex;flex-direction:column;align-items:stretch}.xfaLr,.xfaTable .xfaRow{display:flex;flex-direction:row;align-items:stretch}.xfaRl{display:flex;flex-direction:row-reverse;align-items:stretch}.xfaTb>div{justify-content:left}.loadingInput,.xfaArea,.xfaPosition{position:relative}.xfaValignMiddle{display:flex;align-items:center}.xfaTable .xfaRlRow{display:flex;flex-direction:row-reverse;align-items:stretch;flex:1}.xfaTable .xfaRlRow>div{flex:1}:is(.xfaNonInteractive,.xfaDisabled,.xfaReadOnly) :is(input,textarea){background:initial}.canvasWrapper svg{transform:none}[data-main-rotation="90"]:is(.canvasWrapper svg) mask,[data-main-rotation="90"]:is(.canvasWrapper svg) use:not(.clip,.mask){transform:matrix(0,1,-1,0,1,0)}[data-main-rotation="180"]:is(.canvasWrapper svg) mask,[data-main-rotation="180"]:is(.canvasWrapper svg) use:not(.clip,.mask){transform:matrix(-1,0,0,-1,1,1)}[data-main-rotation="270"]:is(.canvasWrapper svg) mask,[data-main-rotation="270"]:is(.canvasWrapper svg) use:not(.clip,.mask){transform:matrix(0,-1,1,0,0,1)}.highlight:is(.canvasWrapper svg){--blend-mode:multiply;position:absolute;mix-blend-mode:var(--blend-mode)}.highlight:is(.canvasWrapper svg):not(.free){fill-rule:evenodd}.highlightOutline:is(.canvasWrapper svg){position:absolute;mix-blend-mode:normal;fill-rule:evenodd;fill:none}.highlightOutline.hovered:is(.canvasWrapper svg):not(.free):not(.selected){stroke:var(--hover-outline-color);stroke-width:var(--outline-width)}.highlightOutline.selected:is(.canvasWrapper svg):not(.free) .mainOutline{stroke:var(--outline-around-color);stroke-width:calc(var(--outline-width) + 2 * var(--outline-around-width))}.highlightOutline.selected:is(.canvasWrapper svg):not(.free) .secondaryOutline{stroke:var(--outline-color);stroke-width:var(--outline-width)}.highlightOutline.free.hovered:is(.canvasWrapper svg):not(.selected){stroke:var(--hover-outline-color);stroke-width:calc(2 * var(--outline-width))}.highlightOutline.free.selected:is(.canvasWrapper svg) .mainOutline{stroke:var(--outline-around-color);stroke-width:calc(2 * (var(--outline-width) + var(--outline-around-width)))}.highlightOutline.free.selected:is(.canvasWrapper svg) .secondaryOutline{stroke:var(--outline-color);stroke-width:calc(2 * var(--outline-width))}.toggle-button{--button-background-color:#f0f0f4;--button-background-color-hover:#e0e0e6;--button-background-color-active:#cfcfd8;--color-accent-primary:#0060df;--color-accent-primary-hover:#0250bb;--color-accent-primary-active:#054096;--border-interactive-color:#8f8f9d;--border-radius-circle:9999px;--border-width:1px;--size-item-small:16px;--size-item-large:32px;--color-canvas:white}:where(html.is-dark) .toggle-button{--button-background-color:color-mix(in srgb, currentColor 7%, transparent);--button-background-color-hover:color-mix(
      in srgb,
      currentColor 14%,
      transparent
    );--button-background-color-active:color-mix(
      in srgb,
      currentColor 21%,
      transparent
    );--color-accent-primary:#0df;--color-accent-primary-hover:#80ebff;--color-accent-primary-active:#aaf2ff;--border-interactive-color:#bfbfc9;--color-canvas:#1c1b22}@media (forced-colors:active){.toggle-button{--color-accent-primary:ButtonText;--color-accent-primary-hover:SelectedItem;--color-accent-primary-active:SelectedItem;--border-interactive-color:ButtonText;--button-background-color:ButtonFace;--border-interactive-color-hover:SelectedItem;--border-interactive-color-active:SelectedItem;--border-interactive-color-disabled:GrayText;--color-canvas:ButtonText}}.toggle-button{--toggle-background-color:var(--button-background-color);--toggle-background-color-hover:var(--button-background-color-hover);--toggle-background-color-active:var(--button-background-color-active);--toggle-background-color-pressed:var(--color-accent-primary);--toggle-background-color-pressed-hover:var(--color-accent-primary-hover);--toggle-background-color-pressed-active:var(--color-accent-primary-active);--toggle-border-color:var(--border-interactive-color);--toggle-border-color-hover:var(--toggle-border-color);--toggle-border-color-active:var(--toggle-border-color);--toggle-border-radius:var(--border-radius-circle);--toggle-border-width:var(--border-width);--toggle-height:var(--size-item-small);--toggle-width:var(--size-item-large);--toggle-dot-background-color:var(--toggle-border-color);--toggle-dot-background-color-hover:var(--toggle-dot-background-color);--toggle-dot-background-color-active:var(--toggle-dot-background-color);--toggle-dot-background-color-on-pressed:var(--color-canvas);--toggle-dot-margin:1px;--toggle-dot-height:calc(
    var(--toggle-height) - 2 * var(--toggle-dot-margin) - 2 *
      var(--toggle-border-width)
  );--toggle-dot-width:var(--toggle-dot-height);--toggle-dot-transform-x:calc(
    var(--toggle-width) - 4 * var(--toggle-dot-margin) - var(--toggle-dot-width)
  );-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0;border:var(--toggle-border-width) solid var(--toggle-border-color);height:var(--toggle-height);width:var(--toggle-width);border-radius:var(--toggle-border-radius);background:var(--toggle-background-color);flex-shrink:0}.toggle-button:focus-visible{outline:var(--focus-outline);outline-offset:var(--focus-outline-offset)}.toggle-button:enabled:hover{background:var(--toggle-background-color-hover);border-color:var(--toggle-border-color)}.toggle-button:enabled:active{background:var(--toggle-background-color-active);border-color:var(--toggle-border-color)}.toggle-button[aria-pressed=true]::before,.toggle-button[aria-pressed=true]:enabled:active::before,.toggle-button[aria-pressed=true]:enabled:hover::before{background-color:var(--toggle-dot-background-color-on-pressed)}.toggle-button[aria-pressed=true]{background:var(--toggle-background-color-pressed);border-color:transparent}.toggle-button[aria-pressed=true]:enabled:hover{background:var(--toggle-background-color-pressed-hover);border-color:transparent}.toggle-button[aria-pressed=true]:enabled:active{background:var(--toggle-background-color-pressed-active);border-color:transparent}.toggle-button::before{display:block;content:"";background-color:var(--toggle-dot-background-color);height:var(--toggle-dot-height);width:var(--toggle-dot-width);margin:var(--toggle-dot-margin);border-radius:var(--toggle-border-radius);translate:0}.toggle-button[aria-pressed=true]::before{translate:var(--toggle-dot-transform-x)}[dir=rtl] .toggle-button[aria-pressed=true]::before{translate:calc(-1 * var(--toggle-dot-transform-x))}@media (prefers-reduced-motion:no-preference){.toggle-button::before{transition:translate .1s}}@media (prefers-contrast){.toggle-button:enabled:hover,.toggle-button[aria-pressed=true]:enabled:hover,.toggle-button[aria-pressed=true]:enabled:hover:active{border-color:var(--toggle-border-color-hover)}.toggle-button:enabled:active{border-color:var(--toggle-border-color-active)}.toggle-button[aria-pressed=true]:enabled{border-color:var(--toggle-border-color);position:relative}.toggle-button[aria-pressed=true]:enabled:active{background-color:var(--toggle-dot-background-color-active);border-color:var(--toggle-dot-background-color-hover)}.toggle-button:active::before,.toggle-button:hover::before{background-color:var(--toggle-dot-background-color-hover)}}@media (forced-colors){.toggle-button{--toggle-dot-background-color:var(--color-accent-primary);--toggle-dot-background-color-hover:var(--color-accent-primary-hover);--toggle-dot-background-color-active:var(--color-accent-primary-active);--toggle-dot-background-color-on-pressed:var(--button-background-color);--toggle-background-color-disabled:var(--button-background-color-disabled);--toggle-border-color-hover:var(--border-interactive-color-hover);--toggle-border-color-active:var(--border-interactive-color-active);--toggle-border-color-disabled:var(--border-interactive-color-disabled)}.toggle-button[aria-pressed=true]:enabled::after{border:1px solid var(--button-background-color);content:"";position:absolute;height:var(--toggle-height);width:var(--toggle-width);display:block;border-radius:var(--toggle-border-radius);inset:-2px}.toggle-button[aria-pressed=true]:enabled:active::after{border-color:var(--toggle-border-color-active)}}:root{--outline-width:2px;--outline-color:#0060df;--outline-around-width:1px;--outline-around-color:#f0f0f4;--hover-outline-around-color:var(--outline-around-color);--focus-outline:solid var(--outline-width) var(--outline-color);--unfocus-outline:solid var(--outline-width) transparent;--focus-outline-around:solid var(--outline-around-width) var(--outline-around-color);--hover-outline-color:#8f8f9d;--hover-outline:solid var(--outline-width) var(--hover-outline-color);--hover-outline-around:solid var(--outline-around-width) var(--hover-outline-around-color);--freetext-line-height:1.35;--freetext-padding:2px;--resizer-bg-color:var(--outline-color);--resizer-size:6px;--resizer-shift:calc(
    0px - (var(--outline-width) + var(--resizer-size)) / 2 -
      var(--outline-around-width)
  );--editorFreeText-editing-cursor:text;--editorInk-editing-cursor:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuMDE4OTg3NyAxMy42NjQ1TDAuNjEyOTg5IDEwLjQ2MzVDMC42ODc5ODkgMTAuMDU0NSAwLjg4NDk4OSA5LjY4MDUgMS4xODA5OSA5LjM4MjVMOS45ODE5OSAwLjU4MDVDMTAuNzU2IC0wLjE5MjUgMTIuMDE1IC0wLjE5NDUgMTIuNzkyIDAuNTgwNUwxNC40MiAyLjIwODVDMTUuMTk0IDIuOTgzNSAxNS4xOTQgNC4yNDM1IDE0LjQyIDUuMDE4NUw1LjYxNTk5IDEzLjgyMTVDNS4zMTk5OSAxNC4xMTY1IDQuOTQ1OTkgMTQuMzEyNSA0LjUzNzk5IDE0LjM4NzVMMS4zMzU5OSAxNC45ODE1QzEuMjY1OTkgMTQuOTkzNSAxLjE5Nzk5IDE1LjAwMDUgMS4xMjk5OSAxNS4wMDA1QzAuODMyOTg5IDE1LjAwMDUgMC41NDQ5ODggMTQuODgzNSAwLjMzMDk4OCAxNC42Njk1QzAuMDY3OTg3NCAxNC40MDU1IC0wLjA0OTAxMjIgMTQuMDMwNSAwLjAxODk4NzcgMTMuNjY0NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0wLjAxODk4NzcgMTMuNjY0NUwwLjYxMjk4OSAxMC40NjM1QzAuNjg3OTg5IDEwLjA1NDUgMC44ODQ5ODkgOS42ODA1IDEuMTgwOTkgOS4zODI1TDkuOTgxOTkgMC41ODA1QzEwLjc1NiAtMC4xOTI1IDEyLjAxNSAtMC4xOTQ1IDEyLjc5MiAwLjU4MDVMMTQuNDIgMi4yMDg1QzE1LjE5NCAyLjk4MzUgMTUuMTk0IDQuMjQzNSAxNC40MiA1LjAxODVMNS42MTU5OSAxMy44MjE1QzUuMzE5OTkgMTQuMTE2NSA0Ljk0NTk5IDE0LjMxMjUgNC41Mzc5OSAxNC4zODc1TDEuMzM1OTkgMTQuOTgxNUMxLjI2NTk5IDE0Ljk5MzUgMS4xOTc5OSAxNS4wMDA1IDEuMTI5OTkgMTUuMDAwNUMwLjgzMjk4OSAxNS4wMDA1IDAuNTQ0OTg4IDE0Ljg4MzUgMC4zMzA5ODggMTQuNjY5NUMwLjA2Nzk4NzQgMTQuNDA1NSAtMC4wNDkwMTIyIDE0LjAzMDUgMC4wMTg5ODc3IDEzLjY2NDVaTTEyLjQ3MiA1LjE5NjVMMTMuNjMyIDQuMDM2NUwxMy42MzEgMy4xODg1TDExLjgxMSAxLjM2NzVMMTAuOTYzIDEuMzY4NUw5LjgwMjk5IDIuNTI4NUwxMi40NzIgNS4xOTY1Wk00LjMxMDk5IDEzLjE1ODVDNC40NzA5OSAxMy4xMjg1IDQuNjE3OTkgMTMuMDUxNSA0LjczMzk5IDEyLjkzNDVMMTEuNTg3IDYuMDgxNUw4LjkxODk5IDMuNDEzNUwyLjA2NTk5IDEwLjI2NTVDMS45NDg5OSAxMC4zODM1IDEuODcxOTkgMTAuNTMwNSAxLjg0MDk5IDEwLjY5MTVMMS4zNjY5OSAxMy4yNDg1TDEuNzUxOTkgMTMuNjMzNUw0LjMxMDk5IDEzLjE1ODVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K) 0 16,pointer;--editorHighlight-editing-cursor:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyOSAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI4IDE2Ljc1QzI4LjI3NjEgMTYuNzUgMjguNSAxNi41MjYxIDI4LjUgMTYuMjVWMTVDMjguNSAxNC43MjM5IDI4LjI3NjEgMTQuNSAyOCAxNC41SDI2LjM1OEMyNS45MTE3IDE0LjUgMjUuNDc3MyAxNC42MjU3IDI1LjA5OTkgMTQuODYwNEwyNS4wOTg5IDE0Ljg2MTFMMjQgMTUuNTQ4NEwyMi45IDE0Ljg2MUwyMi44OTkxIDE0Ljg2MDRDMjIuNTIxOCAxNC42MjU3IDIyLjA4NzUgMTQuNSAyMS42NDIgMTQuNUgyMEMxOS43MjM5IDE0LjUgMTkuNSAxNC43MjM5IDE5LjUgMTVWMTYuMjVDMTkuNSAxNi41MjYxIDE5LjcyMzkgMTYuNzUgMjAgMTYuNzVIMjEuNjQyQzIxLjY2NDggMTYuNzUgMjEuNjg4NSAxNi43NTY0IDIxLjcxMDEgMTYuNzY5N0MyMS43MTAyIDE2Ljc2OTggMjEuNzEwNCAxNi43Njk5IDIxLjcxMDUgMTYuNzdMMjIuODE3IDE3LjQ2MUMyMi44MTcgMTcuNDYxIDIyLjgxNzEgMTcuNDYxMSAyMi44MTcxIDE3LjQ2MTFDMjIuODE3MSAxNy40NjExIDIyLjgxNzEgMTcuNDYxMSAyMi44MTcxIDE3LjQ2MTFDMjIuODU1MiAxNy40ODQ5IDIyLjg3NiAxNy41MjI5IDIyLjg3NiAxNy41NjdWMjIuNjI1VjI3LjY4M0MyMi44NzYgMjcuNzI3MSAyMi44NTUyIDI3Ljc2NSAyMi44MTcyIDI3Ljc4ODlDMjIuODE3MSAyNy43ODg5IDIyLjgxNzEgMjcuNzg5IDIyLjgxNyAyNy43ODlMMjEuNzA5NSAyOC40OEMyMS43MDk0IDI4LjQ4MDEgMjEuNzA5MyAyOC40ODAyIDIxLjcwOTIgMjguNDgwM0MyMS42ODcyIDI4LjQ5MzggMjEuNjY0NCAyOC41IDIxLjY0MSAyOC41SDIwQzE5LjcyMzkgMjguNSAxOS41IDI4LjcyMzkgMTkuNSAyOVYzMC4yNUMxOS41IDMwLjUyNjEgMTkuNzIzOSAzMC43NSAyMCAzMC43NUgyMS42NDJDMjIuMDg4MyAzMC43NSAyMi41MjI3IDMwLjYyNDMgMjIuOTAwMSAzMC4zODk2TDIyLjkwMDkgMzAuMzg5MUwyNCAyOS43MDI2TDI1LjEgMzAuMzlMMjUuMTAwOSAzMC4zOTA2QzI1LjQ3ODMgMzAuNjI1MyAyNS45MTI3IDMwLjc1MSAyNi4zNTkgMzAuNzUxSDI4QzI4LjI3NjEgMzAuNzUxIDI4LjUgMzAuNTI3MSAyOC41IDMwLjI1MVYyOS4wMDFDMjguNSAyOC43MjQ5IDI4LjI3NjEgMjguNTAxIDI4IDI4LjUwMUgyNi4zNThDMjYuMzM1MiAyOC41MDEgMjYuMzExNSAyOC40OTQ2IDI2LjI4OTkgMjguNDgxM0MyNi4yODk3IDI4LjQ4MTIgMjYuMjg5NiAyOC40ODExIDI2LjI4OTUgMjguNDgxTDI1LjE4MyAyNy43OUMyNS4xODMgMjcuNzkgMjUuMTgzIDI3Ljc5IDI1LjE4MjkgMjcuNzlDMjUuMTgyOSAyNy43ODk5IDI1LjE4MjkgMjcuNzg5OSAyNS4xODI5IDI3Ljc4OTlDMjUuMTQ2MiAyNy43NjY5IDI1LjEyNSAyNy43Mjk3IDI1LjEyNSAyNy42ODRWMjIuNjI1VjE3LjU2N0MyNS4xMjUgMTcuNTIyNyAyNS4xNDYgMTcuNDg0NCAyNS4xODM2IDE3LjQ2MDZDMjUuMTgzOCAxNy40NjA1IDI1LjE4MzkgMTcuNDYwNCAyNS4xODQgMTcuNDYwM0wyNi4yODk1IDE2Ljc3QzI2LjI4OTYgMTYuNzY5OSAyNi4yODk4IDE2Ljc2OTggMjYuMjg5OSAxNi43Njk3QzI2LjMxMTkgMTYuNzU2MiAyNi4zMzQ2IDE2Ljc1IDI2LjM1OCAxNi43NUgyOFoiIGZpbGw9ImJsYWNrIiBzdHJva2U9IiNGQkZCRkUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI0LjYyNSAxNy41NjdDMjQuNjI1IDE3LjM1IDI0LjczNSAxNy4xNTIgMjQuOTE4IDE3LjAzN0wyNi4wMjYgMTYuMzQ1QzI2LjEyNiAxNi4yODMgMjYuMjQgMTYuMjUgMjYuMzU4IDE2LjI1SDI4VjE1SDI2LjM1OEMyNi4wMDYgMTUgMjUuNjYzIDE1LjA5OSAyNS4zNjQgMTUuMjg1TDI0LjI1NiAxNS45NzhDMjQuMTYxIDE2LjAzNyAyNC4wODEgMTYuMTEzIDI0IDE2LjE4N0MyMy45MTggMTYuMTEzIDIzLjgzOSAxNi4wMzcgMjMuNzQ0IDE1Ljk3OEwyMi42MzUgMTUuMjg1QzIyLjMzNiAxNS4wOTkgMjEuOTkzIDE1IDIxLjY0MiAxNUgyMFYxNi4yNUgyMS42NDJDMjEuNzU5IDE2LjI1IDIxLjg3NCAxNi4yODMgMjEuOTc0IDE2LjM0NUwyMy4wODIgMTcuMDM3QzIzLjI2NiAxNy4xNTIgMjMuMzc2IDE3LjM1IDIzLjM3NiAxNy41NjdWMjIuNjI1VjI3LjY4M0MyMy4zNzYgMjcuOSAyMy4yNjYgMjguMDk4IDIzLjA4MiAyOC4yMTNMMjEuOTczIDI4LjkwNUMyMS44NzMgMjguOTY3IDIxLjc1OSAyOSAyMS42NDEgMjlIMjBWMzAuMjVIMjEuNjQyQzIxLjk5NCAzMC4yNSAyMi4zMzcgMzAuMTUxIDIyLjYzNiAyOS45NjVMMjMuNzQ0IDI5LjI3M0MyMy44NCAyOS4yMTMgMjMuOTE5IDI5LjEzNyAyNCAyOS4wNjRDMjQuMDgxIDI5LjEzNyAyNC4xNjEgMjkuMjEzIDI0LjI1NiAyOS4yNzNMMjUuMzY1IDI5Ljk2NkMyNS42NjQgMzAuMTUyIDI2LjAwNyAzMC4yNTEgMjYuMzU5IDMwLjI1MUgyOFYyOS4wMDFIMjYuMzU4QzI2LjI0MSAyOS4wMDEgMjYuMTI2IDI4Ljk2OCAyNi4wMjYgMjguOTA2TDI0LjkxOCAyOC4yMTRDMjQuNzM0IDI4LjA5OSAyNC42MjUgMjcuOTAxIDI0LjYyNSAyNy42ODRWMjIuNjI1VjE3LjU2N1oiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMiAyLjU5QzEyLjI4IDIuNTEgMTIuNDMgMi41IDEyLjQzIDIuNUMxMi40OCAyLjUgMTIuNTggMi41MiAxMi42NiAyLjZMMTQuNDUgNC4zOUMxNC41OCA0LjUyIDE0LjU4IDQuNzIgMTQuNDUgNC44NUwxMS43NzEzIDcuNTI4NzJMOS41MTYyOCA1LjI3MzcyTDEyLjIgMi41OVpNMTMuMjY1OCA0LjYyTDExLjc3MTMgNi4xMTQ1TDEwLjkzMDUgNS4yNzM3MkwxMi40MjUgMy43NzkyMUwxMy4yNjU4IDQuNjJaIiBmaWxsPSIjRkJGQkZFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS45OCA4LjgyTDguMjMgMTEuMDdMMTAuNzEwNiA4LjU4OTM4TDguNDU1NjIgNi4zMzQzOEw1Ljk4IDguODFWOC44MlpNOC4yMyA5LjY1NTc5TDkuMjk2NDEgOC41ODkzOEw4LjQ1NTYyIDcuNzQ4NTlMNy4zODkyMSA4LjgxNUw4LjIzIDkuNjU1NzlaIiBmaWxsPSIjRkJGQkZFIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAuMTUyNiAxMi42ODE2TDE2LjIxMjUgNi42MjE3QzE2Ljc1NzYgNi4wODkxOSAxNy4wNSA1LjM3MDcgMTcuMDUgNC42MkMxNy4wNSAzLjg2OTMxIDE2Ljc1NzYgMy4xNTA4NCAxNi4yMTI2IDIuNjE4MzRMMTQuNDMxNyAwLjgzNzQ3NEMxMy44OTkyIDAuMjkyNDIgMTMuMTgwNyAwIDEyLjQzIDBDMTEuNjY0MyAwIDEwLjk1MjkgMC4zMTI5MjkgMTAuNDMyOSAwLjgzMjg5M0wzLjY4Mjg5IDcuNTgyODlDMy4wNDEyNyA4LjIyNDUyIDMuMDA0NTkgOS4yNTA3NSAzLjU3Mjg4IDkuOTM2MzRMMS4yOTE4NyAxMi4yMjM5QzEuMDkxODYgMTIuNDI0NSAwLjk5MDI2MyAxMi42OTU3IDEuMDAwNyAxMi45Njg1TDEgMTRDMC40NDc3MTUgMTQgMCAxNC40NDc3IDAgMTVWMTdDMCAxNy41NTIzIDAuNDQ3NzE1IDE4IDEgMThIMTZDMTYuNTUyMyAxOCAxNyAxNy41NTIzIDE3IDE3VjE1QzE3IDE0LjQ0NzcgMTYuNTUyMyAxNCAxNiAxNEgxMC4yMzI1QzkuODM1OTQgMTQgOS4zOTk1MyAxMy40MzQ3IDEwLjE1MjYgMTIuNjgxNlpNNC4zOSA5LjM1TDQuOTgwNyA5Ljk0MDdMMi4zOTc2MiAxMi41MzEySDYuNjM4NzdMNy4xMDUwMSAxMi4wNjVMNy41NzEyNSAxMi41MzEySDguODg4NzVMMTUuNTEgNS45MUMxNS44NiA1LjU3IDE2LjA1IDUuMTEgMTYuMDUgNC42MkMxNi4wNSA0LjEzIDE1Ljg2IDMuNjcgMTUuNTEgMy4zM0wxMy43MiAxLjU0QzEzLjM4IDEuMTkgMTIuOTIgMSAxMi40MyAxQzExLjk0IDEgMTEuNDggMS4yIDExLjE0IDEuNTRMNC4zOSA4LjI5QzQuMSA4LjU4IDQuMSA5LjA2IDQuMzkgOS4zNVpNMTYgMTdWMTVIMVYxN0gxNloiIGZpbGw9IiNGQkZCRkUiLz4KPHBhdGggZD0iTTE1LjE2MTYgNS41NTEzNkwxNS4xNjE2IDUuNTUxMzJMMTUuMTU2NCA1LjU1NjQ1TDguNDA2NDUgMTIuMzA2NEM4LjM1OTE1IDEyLjM1MzcgOC4yOTU4OSAxMi4zOCA4LjIzIDEyLjM4QzguMTY0MTEgMTIuMzggOC4xMDA4NSAxMi4zNTM3IDguMDUzNTUgMTIuMzA2NEw3LjQ1ODU3IDExLjcxMTVMNy4xMDUwMSAxMS4zNTc5TDYuNzUxNDYgMTEuNzExNUw2LjAzMjg5IDEyLjQzSDMuMjA0NjVMNS4zMzQ3NyAxMC4yOTM3TDUuNjg3MyA5Ljk0MDE5TDUuMzM0MjYgOS41ODcxNUw0Ljc0MzU1IDguOTk2NDVDNC42NDg4MiA4LjkwMTcxIDQuNjQ4ODIgOC43MzgyOSA0Ljc0MzU1IDguNjQzNTVMMTEuNDkzNiAxLjg5MzU1QzExLjc0MzYgMS42NDM1NCAxMi4wNzc5IDEuNSAxMi40MyAxLjVDMTIuNzg4MyAxLjUgMTMuMTE3OSAxLjYzNzc2IDEzLjM2MTQgMS44ODgzOUwxMy4zNjEzIDEuODg4NDNMMTMuMzY2NCAxLjg5MzU1TDE1LjE1NjQgMy42ODM1NUwxNS4xNTY0IDMuNjgzNTlMMTUuMTYxNiAzLjY4ODY0QzE1LjQxMjIgMy45MzIxMSAxNS41NSA0LjI2MTY2IDE1LjU1IDQuNjJDMTUuNTUgNC45NzgzNCAxNS40MTIyIDUuMzA3ODkgMTUuMTYxNiA1LjU1MTM2Wk01LjQ4IDguODJWOS4wMjcxMUw1LjYyNjQ1IDkuMTczNTVMNy44NzY0NSAxMS40MjM2TDguMjMgMTEuNzc3MUw4LjU4MzU1IDExLjQyMzZMMTEuMDY0MiA4Ljk0MjkzTDExLjQxNzcgOC41ODkzOEwxMS4wNjQyIDguMjM1ODJMOC44MDkxOCA1Ljk4MDgyTDguNDU1NjIgNS42MjcyN0w4LjEwMjA3IDUuOTgwODJMNS42MjY0NSA4LjQ1NjQ1TDUuNDggOC42MDI4OVY4LjgxVjguODJaTTExLjQxNzcgNy44ODIyN0wxMS43NzEzIDguMjM1ODJMMTIuMTI0OCA3Ljg4MjI3TDE0LjgwMzYgNS4yMDM1NUMxNS4xMjg4IDQuODc4MjkgMTUuMTI4OCA0LjM2MTcxIDE0LjgwMzYgNC4wMzY0NUwxMy4wMTM2IDIuMjQ2NDVDMTIuODE4NiAyLjA1MTQ2IDEyLjU3OTIgMiAxMi40MyAySDEyLjQxMzRMMTIuMzk2NyAyLjAwMTExTDEyLjQzIDIuNUMxMi4zOTY3IDIuMDAxMTEgMTIuMzk2NiAyLjAwMTEyIDEyLjM5NjUgMi4wMDExMkwxMi4zOTYzIDIuMDAxMTRMMTIuMzk1NyAyLjAwMTE3TDEyLjM5NDcgMi4wMDEyNUwxMi4zOTI0IDIuMDAxNDJMMTIuMzg3IDIuMDAxODRMMTIuMzczMiAyLjAwMzExQzEyLjM2MjggMi4wMDQxNiAxMi4zNDk4IDIuMDA1NjcgMTIuMzM0NiAyLjAwNzg0QzEyLjMwNDkgMi4wMTIwOCAxMi4yNjQyIDIuMDE5MjUgMTIuMjE3OCAyLjAzMTQ2QzEyLjEzOTYgMi4wNTIwMiAxMS45Nzk3IDIuMTAzMTcgMTEuODQ2NCAyLjIzNjQ1TDkuMTYyNzMgNC45MjAxNkw4LjgwOTE4IDUuMjczNzJMOS4xNjI3MyA1LjYyNzI3TDExLjQxNzcgNy44ODIyN1pNMS41IDE2LjVWMTUuNUgxNS41VjE2LjVIMS41WiIgc3Ryb2tlPSIjMTUxNDFBIi8+Cjwvc3ZnPgo=) 24 24,text;--editorFreeHighlight-editing-cursor:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAxOCAxOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi4yIDMuMDlDMTIuMjggMy4wMSAxMi40MyAzIDEyLjQzIDNDMTIuNDggMyAxMi41OCAzLjAyIDEyLjY2IDMuMUwxNC40NSA0Ljg5QzE0LjU4IDUuMDIgMTQuNTggNS4yMiAxNC40NSA1LjM1TDExLjc3MTMgOC4wMjg3Mkw5LjUxNjI4IDUuNzczNzJMMTIuMiAzLjA5Wk0xMy4yNjU4IDUuMTJMMTEuNzcxMyA2LjYxNDVMMTAuOTMwNSA1Ljc3MzcyTDEyLjQyNSA0LjI3OTIxTDEzLjI2NTggNS4xMloiIGZpbGw9IiNGQkZCRkUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01Ljk4IDkuMzJMOC4yMyAxMS41N0wxMC43MTA2IDkuMDg5MzhMOC40NTU2MiA2LjgzNDM4TDUuOTggOS4zMVY5LjMyWk04LjIzIDEwLjE1NThMOS4yOTY0MSA5LjA4OTM4TDguNDU1NjIgOC4yNDg1OUw3LjM4OTIxIDkuMzE1TDguMjMgMTAuMTU1OFoiIGZpbGw9IiNGQkZCRkUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC4xNTI2IDEzLjE4MTZMMTYuMjEyNSA3LjEyMTdDMTYuNzU3NiA2LjU4OTE5IDE3LjA1IDUuODcwNyAxNy4wNSA1LjEyQzE3LjA1IDQuMzY5MzEgMTYuNzU3NiAzLjY1MDg0IDE2LjIxMjYgMy4xMTgzNEwxNC40MzE3IDEuMzM3NDdDMTMuODk5MiAwLjc5MjQyIDEzLjE4MDcgMC41IDEyLjQzIDAuNUMxMS42NjQzIDAuNSAxMC45NTI5IDAuODEyOTI5IDEwLjQzMjkgMS4zMzI4OUwzLjY4Mjg5IDguMDgyODlDMy4wNDEyNyA4LjcyNDUyIDMuMDA0NTkgOS43NTA3NSAzLjU3Mjg4IDEwLjQzNjNMMS4yOTE4NyAxMi43MjM5QzEuMDkxODYgMTIuOTI0NSAwLjk5MDI2MyAxMy4xOTU3IDEuMDAwNyAxMy40Njg1TDEgMTQuNUMwLjQ0NzcxNSAxNC41IDAgMTQuOTQ3NyAwIDE1LjVWMTcuNUMwIDE4LjA1MjMgMC40NDc3MTUgMTguNSAxIDE4LjVIMTZDMTYuNTUyMyAxOC41IDE3IDE4LjA1MjMgMTcgMTcuNVYxNS41QzE3IDE0Ljk0NzcgMTYuNTUyMyAxNC41IDE2IDE0LjVIMTAuMjMyNUM5LjgzNTk0IDE0LjUgOS4zOTk1MyAxMy45MzQ3IDEwLjE1MjYgMTMuMTgxNlpNNC4zOSA5Ljg1TDQuOTgwNyAxMC40NDA3TDIuMzk3NjIgMTMuMDMxMkg2LjYzODc3TDcuMTA1MDEgMTIuNTY1TDcuNTcxMjUgMTMuMDMxMkg4Ljg4ODc1TDE1LjUxIDYuNDFDMTUuODYgNi4wNyAxNi4wNSA1LjYxIDE2LjA1IDUuMTJDMTYuMDUgNC42MyAxNS44NiA0LjE3IDE1LjUxIDMuODNMMTMuNzIgMi4wNEMxMy4zOCAxLjY5IDEyLjkyIDEuNSAxMi40MyAxLjVDMTEuOTQgMS41IDExLjQ4IDEuNyAxMS4xNCAyLjA0TDQuMzkgOC43OUM0LjEgOS4wOCA0LjEgOS41NiA0LjM5IDkuODVaTTE2IDE3LjVWMTUuNUgxVjE3LjVIMTZaIiBmaWxsPSIjRkJGQkZFIi8+CjxwYXRoIGQ9Ik0xNS4xNjE2IDYuMDUxMzZMMTUuMTYxNiA2LjA1MTMyTDE1LjE1NjQgNi4wNTY0NUw4LjQwNjQ1IDEyLjgwNjRDOC4zNTkxNSAxMi44NTM3IDguMjk1ODkgMTIuODggOC4yMyAxMi44OEM4LjE2NDExIDEyLjg4IDguMTAwODUgMTIuODUzNyA4LjA1MzU1IDEyLjgwNjRMNy40NTg1NyAxMi4yMTE1TDcuMTA1MDEgMTEuODU3OUw2Ljc1MTQ2IDEyLjIxMTVMNi4wMzI4OSAxMi45M0gzLjIwNDY1TDUuMzM0NzcgMTAuNzkzN0w1LjY4NzMgMTAuNDQwMkw1LjMzNDI2IDEwLjA4NzFMNC43NDM1NSA5LjQ5NjQ1QzQuNjQ4ODIgOS40MDE3MSA0LjY0ODgyIDkuMjM4MjkgNC43NDM1NSA5LjE0MzU1TDExLjQ5MzYgMi4zOTM1NUMxMS43NDM2IDIuMTQzNTQgMTIuMDc3OSAyIDEyLjQzIDJDMTIuNzg4MyAyIDEzLjExNzkgMi4xMzc3NiAxMy4zNjE0IDIuMzg4MzlMMTMuMzYxMyAyLjM4ODQzTDEzLjM2NjQgMi4zOTM1NUwxNS4xNTY0IDQuMTgzNTVMMTUuMTU2NCA0LjE4MzU5TDE1LjE2MTYgNC4xODg2NEMxNS40MTIyIDQuNDMyMTEgMTUuNTUgNC43NjE2NiAxNS41NSA1LjEyQzE1LjU1IDUuNDc4MzQgMTUuNDEyMiA1LjgwNzg5IDE1LjE2MTYgNi4wNTEzNlpNNy44NzY0NSAxMS45MjM2TDguMjMgMTIuMjc3MUw4LjU4MzU1IDExLjkyMzZMMTEuMDY0MiA5LjQ0MjkzTDExLjQxNzcgOS4wODkzOEwxMS4wNjQyIDguNzM1ODJMOC44MDkxOCA2LjQ4MDgyTDguNDU1NjIgNi4xMjcyN0w4LjEwMjA3IDYuNDgwODJMNS42MjY0NSA4Ljk1NjQ1TDUuNDggOS4xMDI4OVY5LjMxVjkuMzJWOS41MjcxMUw1LjYyNjQ1IDkuNjczNTVMNy44NzY0NSAxMS45MjM2Wk0xMS40MTc3IDguMzgyMjdMMTEuNzcxMyA4LjczNTgyTDEyLjEyNDggOC4zODIyN0wxNC44MDM2IDUuNzAzNTVDMTUuMTI4OCA1LjM3ODI5IDE1LjEyODggNC44NjE3MSAxNC44MDM2IDQuNTM2NDVMMTMuMDEzNiAyLjc0NjQ1QzEyLjgxODYgMi41NTE0NiAxMi41NzkyIDIuNSAxMi40MyAyLjVIMTIuNDEzNEwxMi4zOTY3IDIuNTAxMTFMMTIuNDMgM0MxMi4zOTY3IDIuNTAxMTEgMTIuMzk2NiAyLjUwMTEyIDEyLjM5NjUgMi41MDExMkwxMi4zOTYzIDIuNTAxMTRMMTIuMzk1NyAyLjUwMTE3TDEyLjM5NDcgMi41MDEyNUwxMi4zOTI0IDIuNTAxNDJMMTIuMzg3IDIuNTAxODRMMTIuMzczMiAyLjUwMzExQzEyLjM2MjggMi41MDQxNiAxMi4zNDk4IDIuNTA1NjcgMTIuMzM0NiAyLjUwNzg0QzEyLjMwNDkgMi41MTIwOCAxMi4yNjQyIDIuNTE5MjUgMTIuMjE3OCAyLjUzMTQ2QzEyLjEzOTYgMi41NTIwMiAxMS45Nzk3IDIuNjAzMTcgMTEuODQ2NCAyLjczNjQ1TDkuMTYyNzMgNS40MjAxNkw4LjgwOTE4IDUuNzczNzJMOS4xNjI3MyA2LjEyNzI3TDExLjQxNzcgOC4zODIyN1pNMS41IDE2SDE1LjVWMTdIMS41VjE2WiIgc3Ryb2tlPSIjMTUxNDFBIi8+Cjwvc3ZnPgo=) 1 18,pointer;--new-alt-text-warning-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNyAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOC43ODE4MiAyLjYzOTAzQzguNTg4ODIgMi4yODgwMyA4LjI1NzgyIDIuMjUwMDMgOC4xMjQ4MiAyLjI1MDAzQzcuOTkwMTkgMi4yNDg0NyA3Ljg1NzcxIDIuMjgzOTMgNy43NDE4NSAyLjM1MjUzQzcuNjI1OTkgMi40MjExMyA3LjUzMTIgMi41MjAyMyA3LjQ2NzgyIDIuNjM5MDNMMS45NzA4MiAxMi42MzlDMS45MDY3MyAxMi43NTI4IDEuODc0MDYgMTIuODgxNiAxLjg3NjE3IDEzLjAxMjJDMS44NzgyOCAxMy4xNDI3IDEuOTE1MDkgMTMuMjcwNCAxLjk4MjgyIDEzLjM4MkMyLjA0Nzk4IDEzLjQ5NTEgMi4xNDIwNyAxMy41ODg4IDIuMjU1NDMgMTMuNjUzNUMyLjM2ODc5IDEzLjcxODIgMi40OTczMiAxMy43NTE1IDIuNjI3ODIgMTMuNzVIMTMuNjIxOEMxMy43NTIzIDEzLjc1MTUgMTMuODgwOSAxMy43MTgyIDEzLjk5NDIgMTMuNjUzNUMxNC4xMDc2IDEzLjU4ODggMTQuMjAxNyAxMy40OTUxIDE0LjI2NjggMTMuMzgyQzE0LjMzNDYgMTMuMjcwNCAxNC4zNzE0IDEzLjE0MjcgMTQuMzczNSAxMy4wMTIyQzE0LjM3NTYgMTIuODgxNiAxNC4zNDI5IDEyLjc1MjggMTQuMjc4OCAxMi42MzlMOC43ODE4MiAyLjYzOTAzWk02LjM3MjgyIDIuMDM3MDNDNi43NTE4MiAxLjM0NjAzIDcuNDM4ODIgMS4wMDAwMyA4LjEyNDgyIDEuMDAwMDNDOC40ODM0MSAwLjk5Nzk4NSA4LjgzNTgzIDEuMDkzMjYgOS4xNDQ1NCAxLjI3NTdDOS40NTMyNSAxLjQ1ODE0IDkuNzA2NjggMS43MjA5MiA5Ljg3NzgyIDIuMDM2MDNMMTUuMzc0OCAxMi4wMzZDMTYuMTA3OCAxMy4zNjkgMTUuMTQzOCAxNSAxMy42MjI4IDE1SDIuNjI3ODJDMS4xMDY4MiAxNSAwLjE0MTgyMyAxMy4zNyAwLjg3NTgyMyAxMi4wMzdMNi4zNzI4MiAyLjAzNzAzWk04Ljc0OTgyIDkuMDYyMDNDOC43NDk4MiA5LjIyNzc5IDguNjgzOTcgOS4zODY3NiA4LjU2Njc2IDkuNTAzOTdDOC40NDk1NSA5LjYyMTE4IDguMjkwNTggOS42ODcwMyA4LjEyNDgyIDkuNjg3MDNDNy45NTkwNiA5LjY4NzAzIDcuODAwMDkgOS42MjExOCA3LjY4Mjg4IDkuNTAzOTdDNy41NjU2NiA5LjM4Njc2IDcuNDk5ODIgOS4yMjc3OSA3LjQ5OTgyIDkuMDYyMDNWNS42MjUwM0M3LjQ5OTgyIDUuNDU5MjcgNy41NjU2NiA1LjMwMDMgNy42ODI4OCA1LjE4MzA5QzcuODAwMDkgNS4wNjU4OCA3Ljk1OTA2IDUuMDAwMDMgOC4xMjQ4MiA1LjAwMDAzQzguMjkwNTggNS4wMDAwMyA4LjQ0OTU1IDUuMDY1ODggOC41NjY3NiA1LjE4MzA5QzguNjgzOTcgNS4zMDAzIDguNzQ5ODIgNS40NTkyNyA4Ljc0OTgyIDUuNjI1MDNWOS4wNjIwM1pNNy43NDk4MiAxMkw3LjQ5OTgyIDExLjc1VjExTDcuNzQ5ODIgMTAuNzVIOC40OTk4Mkw4Ljc0OTgyIDExVjExLjc1TDguNDk5ODIgMTJINy43NDk4MloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--viewer-container-height:0;--pdfViewer-padding-bottom:0;--page-margin:1px auto -8px;--page-border:9px solid transparent;--spreadHorizontalWrapped-margin-LR:-3.5px;--loading-icon-delay:400ms;--dir-factor:1;--inline-start:left;--inline-end:right;--sidebar-width:250px;--sidebar-transition-duration:200ms;--sidebar-transition-timing-function:ease;--toolbar-height:56px;--toolbar-horizontal-padding:1px;--toolbar-vertical-padding:2px;--icon-size:16px;--toolbar-icon-opacity:0.7;--doorhanger-icon-opacity:0.9;--doorhanger-height:8px;--main-color:rgb(12 12 13);--body-bg-color:#525659;--progressBar-color:rgb(10 132 255);--progressBar-bg-color:rgb(221 221 222);--progressBar-blend-color:rgb(116 177 239);--scrollbar-color:auto;--scrollbar-bg-color:auto;--toolbar-icon-bg-color:rgb(0 0 0);--toolbar-icon-hover-bg-color:rgb(0 0 0);--sidebar-narrow-bg-color:rgb(212 212 215 / 0.9);--sidebar-toolbar-bg-color:#323639;--toolbar-bg-color:#323639;--toolbar-border-color:rgb(184 184 184);--toolbar-box-shadow:0 1px 0 var(--toolbar-border-color);--toolbar-border-bottom:none;--toolbarSidebar-box-shadow:inset calc(-1px * var(--dir-factor)) 0 0 rgb(0 0 0 / 0.25),0 1px 0 rgb(0 0 0 / 0.15),0 0 1px rgb(0 0 0 / 0.1);--toolbarSidebar-border-bottom:none;--button-hover-color:rgba(255, 255, 255, 0.08);--toggled-btn-color:rgb(0 0 0);--toggled-btn-bg-color:rgb(0 0 0 / 0.3);--toggled-hover-active-btn-color:rgb(0 0 0 / 0.4);--toggled-hover-btn-outline:none;--dropdown-btn-bg-color:rgba(0,0,0,0.5);--dropdown-btn-border:none;--separator-color:rgb(0 0 0 / 0.3);--field-color:rgb(6 6 6);--field-bg-color:rgb(255 255 255);--field-border-color:rgb(187 187 188);--treeitem-color:rgb(0 0 0 / 0.8);--treeitem-bg-color:rgb(0 0 0 / 0.15);--treeitem-hover-color:rgb(0 0 0 / 0.9);--treeitem-selected-color:rgb(0 0 0 / 0.9);--treeitem-selected-bg-color:rgb(0 0 0 / 0.25);--thumbnail-hover-color:rgb(0 0 0 / 0.1);--thumbnail-selected-color:#8ab4f8;--doorhanger-bg-color:rgb(255 255 255);--doorhanger-border-color:rgb(12 12 13 / 0.2);--doorhanger-hover-color:rgb(12 12 13);--doorhanger-hover-bg-color:rgb(237 237 237);--doorhanger-separator-color:rgb(222 222 222);--dialog-button-border:none;--dialog-button-bg-color:rgb(12 12 13 / 0.1);--dialog-button-hover-bg-color:rgb(12 12 13 / 0.3);--loading-icon:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTYiIHdpZHRoPSIxNiIgc3R5bGU9ImFuaW1hdGlvbjpzcGluTG9hZGluZ0ljb24gMXMgc3RlcHMoMTIsZW5kKSBpbmZpbml0ZSI+PHN0eWxlPkBrZXlmcmFtZXMgc3BpbkxvYWRpbmdJY29ue3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19PC9zdHlsZT48cGF0aCBkPSJNNyAzVjFzMC0xIDEtMSAxIDEgMSAxdjJzMCAxLTEgMS0xLTEtMS0xeiIvPjxwYXRoIGQ9Ik00LjYzIDQuMWwtMS0xLjczUzMuMTMgMS41IDQgMWMuODctLjUgMS4zNy4zNyAxLjM3LjM3bDEgMS43M3MuNS44Ny0uMzcgMS4zN2MtLjg3LjU3LTEuMzctLjM3LTEuMzctLjM3eiIgZmlsbC1vcGFjaXR5PSIuOTMiLz48cGF0aCBkPSJNMy4xIDYuMzdsLTEuNzMtMVMuNSA0Ljg3IDEgNGMuNS0uODcgMS4zNy0uMzcgMS4zNy0uMzdsMS43MyAxcy44Ny41LjM3IDEuMzdjLS41Ljg3LTEuMzcuMzctMS4zNy4zN3oiIGZpbGwtb3BhY2l0eT0iLjg2Ii8+PHBhdGggZD0iTTMgOUgxUzAgOSAwIDhzMS0xIDEtMWgyczEgMCAxIDEtMSAxLTEgMXoiIGZpbGwtb3BhY2l0eT0iLjc5Ii8+PHBhdGggZD0iTTQuMSAxMS4zN2wtMS43MyAxUzEuNSAxMi44NyAxIDEyYy0uNS0uODcuMzctMS4zNy4zNy0xLjM3bDEuNzMtMXMuODctLjUgMS4zNy4zN2MuNS44Ny0uMzcgMS4zNy0uMzcgMS4zN3oiIGZpbGwtb3BhY2l0eT0iLjcyIi8+PHBhdGggZD0iTTMuNjMgMTMuNTZsMS0xLjczcy41LS44NyAxLjM3LS4zN2MuODcuNS4zNyAxLjM3LjM3IDEuMzdsLTEgMS43M3MtLjUuODctMS4zNy4zN2MtLjg3LS41LS4zNy0xLjM3LS4zNy0xLjM3eiIgZmlsbC1vcGFjaXR5PSIuNjUiLz48cGF0aCBkPSJNNyAxNXYtMnMwLTEgMS0xIDEgMSAxIDF2MnMwIDEtMSAxLTEtMS0xLTF6IiBmaWxsLW9wYWNpdHk9Ii41OCIvPjxwYXRoIGQ9Ik0xMC42MyAxNC41NmwtMS0xLjczcy0uNS0uODcuMzctMS4zN2MuODctLjUgMS4zNy4zNyAxLjM3LjM3bDEgMS43M3MuNS44Ny0uMzcgMS4zN2MtLjg3LjUtMS4zNy0uMzctMS4zNy0uMzd6IiBmaWxsLW9wYWNpdHk9Ii41MSIvPjxwYXRoIGQ9Ik0xMy41NiAxMi4zN2wtMS43My0xcy0uODctLjUtLjM3LTEuMzdjLjUtLjg3IDEuMzctLjM3IDEuMzctLjM3bDEuNzMgMXMuODcuNS4zNyAxLjM3Yy0uNS44Ny0xLjM3LjM3LTEuMzcuMzd6IiBmaWxsLW9wYWNpdHk9Ii40NCIvPjxwYXRoIGQ9Ik0xNSA5aC0ycy0xIDAtMS0xIDEtMSAxLTFoMnMxIDAgMSAxLTEgMS0xIDF6IiBmaWxsLW9wYWNpdHk9Ii4zNyIvPjxwYXRoIGQ9Ik0xNC41NiA1LjM3bC0xLjczIDFzLS44Ny41LTEuMzctLjM3Yy0uNS0uODcuMzctMS4zNy4zNy0xLjM3bDEuNzMtMXMuODctLjUgMS4zNy4zN2MuNS44Ny0uMzcgMS4zNy0uMzcgMS4zN3oiIGZpbGwtb3BhY2l0eT0iLjMiLz48cGF0aCBkPSJNOS42NCAzLjFsLjk4LTEuNjZzLjUtLjg3NCAxLjM3LS4zN2MuODcuNS4zNyAxLjM3LjM3IDEuMzdsLTEgMS43M3MtLjUuODctMS4zNy4zN2MtLjg3LS41LS4zNy0xLjM3LS4zNy0xLjM3eiIgZmlsbC1vcGFjaXR5PSIuMjMiLz48L3N2Zz4=);--treeitem-expanded-icon:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTEwIDEzbDQtN0g2eiIvPjwvc3ZnPg==);--treeitem-collapsed-icon:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTEzIDlMNiA1djh6Ii8+PC9zdmc+);--toolbarButton-editorFreeText-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zIDIuNUMyLjcyNDIxIDIuNSAyLjUgMi43MjQyMSAyLjUgM1Y0Ljc1SDFWM0MxIDEuODk1NzkgMS44OTU3OSAxIDMgMUgxM0MxNC4xMDQyIDEgMTUgMS44OTU3OSAxNSAzVjQuNzVIMTMuNVYzQzEzLjUgMi43MjQyMSAxMy4yNzU4IDIuNSAxMyAyLjVIM1oiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTEgMTVINVYxMy41SDExVjE1WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04Ljc1IDIuMjVWMTQuMjVINy4yNVYyLjI1SDguNzVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--toolbarButton-editorHighlight-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNyAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnPgogICAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuMTA5MTggMTEuNjZDNy4yNDkxOCAxMS44IDcuNDM5MTggMTEuODggNy42MzkxOCAxMS44OEM3LjgzOTE4IDExLjg4IDguMDI5MTggMTEuOCA4LjE2OTE4IDExLjY2TDE0LjkxOTIgNC45MUMxNS4yNjkyIDQuNTcgMTUuNDU5MiA0LjExIDE1LjQ1OTIgMy42MkMxNS40NTkyIDMuMTMgMTUuMjY5MiAyLjY3IDE0LjkxOTIgMi4zM0wxMy4xMjkyIDAuNTRDMTIuNzg5MiAwLjE5IDEyLjMyOTIgMCAxMS44MzkyIDBDMTEuMzQ5MiAwIDEwLjg4OTIgMC4yIDEwLjU0OTIgMC41NEwzLjc5OTE4IDcuMjlDMy41MDkxOCA3LjU4IDMuNTA5MTggOC4wNiAzLjc5OTE4IDguMzVMNC4zODk4OCA4Ljk0MDdMMS40MDkxOCAxMS45M0g1LjY0OTE4TDYuNTE0MTkgMTEuMDY1TDcuMTA5MTggMTEuNjZaTTcuNjM5MTggMTAuMDdMNS4zODkxOCA3LjgyVjcuODFMNy44NjQ4IDUuMzM0MzhMMTAuMTE5OCA3LjU4OTM4TDcuNjM5MTggMTAuMDdaTTExLjE4MDUgNi41Mjg3MkwxMy44NTkyIDMuODVDMTMuOTg5MiAzLjcyIDEzLjk4OTIgMy41MiAxMy44NTkyIDMuMzlMMTIuMDY5MiAxLjZDMTEuOTg5MiAxLjUyIDExLjg4OTIgMS41IDExLjgzOTIgMS41QzExLjgzOTIgMS41IDExLjY4OTIgMS41MSAxMS42MDkyIDEuNTlMOC45MjU0NiA0LjI3MzcyTDExLjE4MDUgNi41Mjg3MloiIGZpbGw9IiMwMDAiLz4KICAgICAgPHBhdGggZD0iTTAuNDA5MTggMTRIMTUuNDA5MlYxNkgwLjQwOTE4VjE0WiIgZmlsbD0iIzAwMCIvPgogICAgPC9nPgogIDwvc3ZnPg==);--toolbarButton-editorInk-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuNDk5MTMgMTIuNjI1MUMyLjYxOTEzIDEyLjYyNTEgMi43MzkxMyAxMi42MDUxIDIuODU3MTMgMTIuNTY2MUw2LjI5MDEzIDExLjQyMDFMMTMuMjg5MSA0LjQyMjFDMTQuMDE5MSAzLjY5MTEgMTQuMDE5MSAyLjUwMTEgMTMuMjg5MSAxLjc3MDFMMTIuMjI5MSAwLjcxMDA5OEMxMS40OTcxIC0wLjAxOTkwMjMgMTAuMzA5MSAtMC4wMTk5MDIzIDkuNTc3MTMgMC43MTAwOThMMi41NzgxMyA3LjcwOTFMMS40MzMxMyAxMS4xNDUxQzEuMjk4MTMgMTEuNTUxMSAxLjQwMjEzIDExLjk5MzEgMS43MDUxMyAxMi4yOTUxQzEuOTIxMTMgMTIuNTEwMSAyLjIwNjEzIDEyLjYyNTEgMi40OTkxMyAxMi42MjUxWk0xMC40NjExIDEuNTk1MUMxMC43MDMxIDEuMzUxMSAxMS4xMDIxIDEuMzUxMSAxMS4zNDQxIDEuNTk1MUwxMi40MDUxIDIuNjU2MUMxMi42NDkxIDIuODk5MSAxMi42NDkxIDMuMjk2MSAxMi40MDUxIDMuNTM5MUwxMS4zNDAxIDQuNjA1MUw5LjM5NTEzIDIuNjYwMUwxMC40NjExIDEuNTk1MVpNMy42NzAxMyA4LjM4NTFMOC41MTAxMyAzLjU0NTFMMTAuNDU0MSA1LjQ4OTFMNS42MTQxMyAxMC4zMzAxTDIuNjk3MTMgMTEuMzAzMUwzLjY3MDEzIDguMzg1MVoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xNC44MTY5IDEzLjMxNEwxMy4wMjI5IDEzLjg2MkMxMi4zMzA5IDE0LjA3MyAxMS41OTA5IDE0LjExMSAxMC44ODU5IDEzLjk2OEw4LjgwMzkxIDEzLjU1MUM3LjU4NDkxIDEzLjMwOCA2LjI5NzkxIDEzLjQ4IDUuMTg0OTEgMTQuMDM2QzMuOTUyOTEgMTQuNjUyIDIuNDY2OTEgMTQuNDEyIDEuNDkxOTEgMTMuNDM2TDEuNDQwOTEgMTMuMzg1TDAuNjA3OTEgMTQuMzIxQzEuNDYyOTEgMTUuMTc1IDIuNTk5OTEgMTUuNjI1IDMuNzUyOTEgMTUuNjI1QzQuNDI4OTEgMTUuNjI1IDUuMTA5OTEgMTUuNDcxIDUuNzQzOTEgMTUuMTUzQzYuNjA4OTEgMTQuNzIxIDcuNjA4OTEgMTQuNTg2IDguNTU4OTEgMTQuNzc3TDEwLjY0MDkgMTUuMTk0QzExLjU1MDkgMTUuMzc2IDEyLjUwMDkgMTUuMzI3IDEzLjM4NzkgMTUuMDU2TDE1LjE4MTkgMTQuNTA4TDE0LjgxNjkgMTMuMzE0WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--toolbarButton-editorStamp-icon:url(data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9ImJsYWNrIj4KICA8cGF0aCBkPSJNMyAxYTIgMiAwIDAgMC0yIDJsMCAxMGEyIDIgMCAwIDAgMiAybDEwIDBhMiAyIDAgMCAwIDItMmwwLTEwYTIgMiAwIDAgMC0yLTJMMyAxem0xMC43NSAxMi4xNS0uNi42LTEwLjMgMC0uNi0uNiAwLTEwLjMuNi0uNiAxMC4zIDAgLjYuNiAwIDEwLjN6Ii8+CiAgPHBhdGggZD0ibTExIDEyLTYgMGExIDEgMCAwIDEtMS0xbDAtMS4zMjFhLjc1Ljc1IDAgMCAxIC4yMTgtLjUyOUw2LjM1IDcuMDA1YS43NS43NSAwIDAgMSAxLjA2MS0uMDAzbDIuMTEyIDIuMTAyLjYxMi0uNTc3YS43NS43NSAwIDAgMSAxLjA0Ny4wMTdsLjYuNjA1YS43NS43NSAwIDAgMSAuMjE4LjUyOUwxMiAxMWExIDEgMCAwIDEtMSAxeiIvPgogIDxwYXRoIGQ9Im0xMS42IDUtMS4yIDAtLjQuNCAwIDEuMi40LjQgMS4yIDAgLjQtLjQgMC0xLjJ6Ii8+Cjwvc3ZnPgo=);--toolbarButton-menuArrow-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMjMzMzYgMTAuNDY2NEwxMS44NDc0IDYuODUzMzlDMTEuODk0IDYuODA3MSAxMS45MzEgNi43NTIwMyAxMS45NTYzIDYuNjkxMzZDMTEuOTgxNiA2LjYzMDY5IDExLjk5NDYgNi41NjU2MiAxMS45OTQ2IDYuNDk5ODlDMTEuOTk0NiA2LjQzNDE3IDExLjk4MTYgNi4zNjkxIDExLjk1NjMgNi4zMDg0M0MxMS45MzEgNi4yNDc3NiAxMS44OTQgNi4xOTI2OSAxMS44NDc0IDYuMTQ2MzlDMTEuNzUzNiA2LjA1MjY2IDExLjYyNjQgNiAxMS40OTM5IDZDMTEuMzYxMyA2IDExLjIzNDEgNi4wNTI2NiAxMS4xNDA0IDYuMTQ2MzlMNy45OTIzNiA5LjI5MzM5TDQuODQ3MzYgNi4xNDczOUM0Ljc1MzA1IDYuMDU2MzEgNC42MjY3NSA2LjAwNTkyIDQuNDk1NjYgNi4wMDcwNkM0LjM2NDU2IDYuMDA4MiA0LjIzOTE1IDYuMDYwNzggNC4xNDY0NSA2LjE1MzQ4QzQuMDUzNzQgNi4yNDYxOSA0LjAwMTE2IDYuMzcxNTkgNC4wMDAwMiA2LjUwMjY5QzMuOTk4ODggNi42MzM3OSA0LjA0OTI4IDYuNzYwMDkgNC4xNDAzNiA2Ljg1NDM5TDcuNzUyMzYgMTAuNDY3NEw4LjIzMzM2IDEwLjQ2NjRaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--toolbarButton-sidebarToggle-icon:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTAgOTZDMCA3OC4zIDE0LjMgNjQgMzIgNjRsMzg0IDBjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjMgMzItMzIgMzJMMzIgMTI4QzE0LjMgMTI4IDAgMTEzLjcgMCA5NnpNMCAyNTZjMC0xNy43IDE0LjMtMzIgMzItMzJsMzg0IDBjMTcuNyAwIDMyIDE0LjMgMzIgMzJzLTE0LjMgMzItMzIgMzJMMzIgMjg4Yy0xNy43IDAtMzItMTQuMy0zMi0zMnpNNDQ4IDQxNmMwIDE3LjctMTQuMyAzMi0zMiAzMkwzMiA0NDhjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzJsMzg0IDBjMTcuNyAwIDMyIDE0LjMgMzIgMzJ6Ii8+PC9zdmc+);--toolbarButton-secondaryToolbarToggle-icon:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDUxMiA1MTIiPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOC43LjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAxLjIuMCBCdWlsZCAxNDIpICAtLT4KICA8Zz4KICAgIDxnIGlkPSJMYXllcl8xIj4KICAgICAgPHBhdGggZD0iTTI1NiwzNjBjLTMwLjksMC01NiwyNS4xLTU2LDU2czI1LjEsNTYsNTYsNTYsNTYtMjUuMSw1Ni01Ni0yNS4xLTU2LTU2LTU2Wk0yNTYsMjAwYy0zMC45LDAtNTYsMjUuMS01Niw1NnMyNS4xLDU2LDU2LDU2LDU2LTI1LjEsNTYtNTYtMjUuMS01Ni01Ni01NlpNMzEyLDk2YzAtMzAuOS0yNS4xLTU2LTU2LTU2cy01NiwyNS4xLTU2LDU2LDI1LjEsNTYsNTYsNTYsNTYtMjUuMSw1Ni01NloiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==);--toolbarButton-pageUp-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMzUxNzkgNS4wMDFMMTMuODE3OCAxMC40NjZDMTMuODc2IDEwLjUyNCAxMy45MjIyIDEwLjU5MjkgMTMuOTUzNyAxMC42Njg4QzEzLjk4NTIgMTAuNzQ0NyAxNC4wMDEzIDEwLjgyNiAxNC4wMDEyIDEwLjkwODJDMTQuMDAxMSAxMC45OTA0IDEzLjk4NDggMTEuMDcxNyAxMy45NTMxIDExLjE0NzVDMTMuOTIxNSAxMS4yMjM0IDEzLjg3NTEgMTEuMjkyMiAxMy44MTY4IDExLjM1QzEzLjY5OTEgMTEuNDY2OCAxMy41NDAxIDExLjUzMjQgMTMuMzc0MyAxMS41MzI0QzEzLjIwODUgMTEuNTMyNCAxMy4wNDk0IDExLjQ2NjggMTIuOTMxOCAxMS4zNUw3Ljk5ODc5IDYuNDE2TDMuMDY2NzkgMTEuMzQ5QzIuOTQ4NDIgMTEuNDYxNCAyLjc5MDg1IDExLjUyMzEgMi42Mjc2NSAxMS41MjFDMi40NjQ0NSAxMS41MTg5IDIuMzA4NTMgMTEuNDUzMSAyLjE5MzEyIDExLjMzNzdDMi4wNzc3MSAxMS4yMjIzIDIuMDExOTMgMTEuMDY2MyAyLjAwOTgyIDEwLjkwMzFDMi4wMDc3IDEwLjczOTkgMi4wNjk0MSAxMC41ODI0IDIuMTgxNzkgMTAuNDY0TDcuNjQ3NzkgNUw4LjM1MTc5IDUuMDAxWiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--toolbarButton-pageDown-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMzUxNzYgMTAuOTk4OUwxMy44MTc4IDUuNTMzOTFDMTMuODc2IDUuNDc1OTQgMTMuOTIyMiA1LjQwNzAyIDEzLjk1MzcgNS4zMzExM0MxMy45ODUxIDUuMjU1MjQgMTQuMDAxMyA1LjE3Mzg3IDE0LjAwMTIgNS4wOTE3QzE0LjAwMTEgNS4wMDk1NCAxMy45ODQ4IDQuOTI4MiAxMy45NTMxIDQuODUyMzhDMTMuOTIxNSA0Ljc3NjU2IDEzLjg3NTEgNC43MDc3NSAxMy44MTY4IDQuNjQ5OTFDMTMuNjk5MSA0LjUzMzA5IDEzLjU0MDEgNC40Njc1MyAxMy4zNzQzIDQuNDY3NTNDMTMuMjA4NSA0LjQ2NzUzIDEzLjA0OTQgNC41MzMwOSAxMi45MzE4IDQuNjQ5OTFMNy45OTc3NiA5LjU4NDkxTDMuMDY3NzYgNC42NTA5MUMyLjk0OTQgNC41Mzg1MyAyLjc5MTgzIDQuNDc2ODIgMi42Mjg2MyA0LjQ3ODk0QzIuNDY1NDIgNC40ODEwNiAyLjMwOTUgNC41NDY4MyAyLjE5NDA5IDQuNjYyMjRDMi4wNzg2OCA0Ljc3NzY1IDIuMDEyOTEgNC45MzM1NyAyLjAxMDc5IDUuMDk2NzdDMi4wMDg2OCA1LjI1OTk3IDIuMDcwMzkgNS40MTc1NCAyLjE4Mjc2IDUuNTM1OTFMNy42NDc3NiAxMC45OTk5TDguMzUxNzYgMTAuOTk4OVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--toolbarButton-zoomOut-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjM3NSA5LjI1QzEzLjU0MDggOS4yNSAxMy42OTk3IDkuMTg0MTUgMTMuODE2OSA5LjA2Njk0QzEzLjkzNDIgOC45NDk3MyAxNCA4Ljc5MDc2IDE0IDguNjI1QzE0IDguNDU5MjQgMTMuOTM0MiA4LjMwMDI3IDEzLjgxNjkgOC4xODMwNkMxMy42OTk3IDguMDY1ODUgMTMuNTQwOCA4IDEzLjM3NSA4SDIuNjI1QzIuNDU5MjQgOCAyLjMwMDI3IDguMDY1ODUgMi4xODMwNiA4LjE4MzA2QzIuMDY1ODUgOC4zMDAyNyAyIDguNDU5MjQgMiA4LjYyNUMyIDguNzkwNzYgMi4wNjU4NSA4Ljk0OTczIDIuMTgzMDYgOS4wNjY5NEMyLjMwMDI3IDkuMTg0MTUgMi40NTkyNCA5LjI1IDIuNjI1IDkuMjVIMTMuMzc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--toolbarButton-zoomIn-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMDA0ODggOS43NVYxNEM3LjAwNDg4IDE0LjE2NTggNy4wNzA3MyAxNC4zMjQ3IDcuMTg3OTQgMTQuNDQxOUM3LjMwNTE1IDE0LjU1OTIgNy40NjQxMiAxNC42MjUgNy42Mjk4OCAxNC42MjVDNy43OTU2NCAxNC42MjUgNy45NTQ2MSAxNC41NTkyIDguMDcxODMgMTQuNDQxOUM4LjE4OTA0IDE0LjMyNDcgOC4yNTQ4OCAxNC4xNjU4IDguMjU0ODggMTRWOS43NUw4Ljc1NDg4IDkuMjVIMTMuMDA0OUMxMy4xNzA2IDkuMjUgMTMuMzI5NiA5LjE4NDE1IDEzLjQ0NjggOS4wNjY5NEMxMy41NjQgOC45NDk3MyAxMy42Mjk5IDguNzkwNzYgMTMuNjI5OSA4LjYyNUMxMy42Mjk5IDguNDU5MjQgMTMuNTY0IDguMzAwMjcgMTMuNDQ2OCA4LjE4MzA2QzEzLjMyOTYgOC4wNjU4NSAxMy4xNzA2IDggMTMuMDA0OSA4SDguNzU0ODhMOC4yNTQ4OCA3LjVWMy4yNUM4LjI1NDg4IDMuMDg0MjQgOC4xODkwNCAyLjkyNTI3IDguMDcxODMgMi44MDgwNkM3Ljk1NDYxIDIuNjkwODUgNy43OTU2NCAyLjYyNSA3LjYyOTg4IDIuNjI1QzcuNDY0MTIgMi42MjUgNy4zMDUxNSAyLjY5MDg1IDcuMTg3OTQgMi44MDgwNkM3LjA3MDczIDIuOTI1MjcgNy4wMDQ4OCAzLjA4NDI0IDcuMDA0ODggMy4yNVY3LjVMNi41MDQ4OCA4SDIuMjU0ODhDMi4wODkxMiA4IDEuOTMwMTUgOC4wNjU4NSAxLjgxMjk0IDguMTgzMDZDMS42OTU3MyA4LjMwMDI3IDEuNjI5ODggOC40NTkyNCAxLjYyOTg4IDguNjI1QzEuNjI5ODggOC43OTA3NiAxLjY5NTczIDguOTQ5NzMgMS44MTI5NCA5LjA2Njk0QzEuOTMwMTUgOS4xODQxNSAyLjA4OTEyIDkuMjUgMi4yNTQ4OCA5LjI1SDYuMzkxODhMNy4wMDQ4OCA5Ljc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--toolbarButton-presentationMode-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNSAzQzEuNSAyLjcyNDIxIDEuNzI0MjEgMi41IDIgMi41SDE0QzE0LjI3NTggMi41IDE0LjUgMi43MjQyMSAxNC41IDNWMTFDMTQuNSAxMS4yNzU4IDE0LjI3NTggMTEuNSAxNCAxMS41SDJDMS43MjQyMSAxMS41IDEuNSAxMS4yNzU4IDEuNSAxMVYzWk0yIDFDMC44OTU3ODYgMSAwIDEuODk1NzkgMCAzVjExQzAgMTIuMTA0MiAwLjg5NTc4NiAxMyAyIDEzSDIuNjQ5NzlMMS4zNTA1MiAxNS4yNDk5TDIuNjQ5NDkgMTZMNC4zODE5NCAxM0gxMS42MzkxTDEzLjM3MTUgMTZMMTQuNjcwNSAxNS4yNDk5TDEzLjM3MTIgMTNIMTRDMTUuMTA0MiAxMyAxNiAxMi4xMDQyIDE2IDExVjNDMTYgMS44OTU3OSAxNS4xMDQyIDEgMTQgMUgyWk01Ljc5NTAxIDQuNjQ0MDFWOS4zNTYwMUM1Ljc5NTAxIDkuODUwMDEgNi4zMjkwMSAxMC4xNTkgNi43NTcwMSA5LjkxNDAxTDEwLjg4IDcuNTU4MDFDMTEuMzEyIDcuMzEyMDEgMTEuMzEyIDYuNjg5MDEgMTAuODggNi40NDIwMUw2Ljc1NzAxIDQuMDg2MDFDNi4zMjgwMSAzLjg0MTAxIDUuNzk1MDEgNC4xNTAwMSA1Ljc5NTAxIDQuNjQ0MDFaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--toolbarButton-print-icon:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTEyOCAwQzkyLjcgMCA2NCAyOC43IDY0IDY0bDAgOTYgNjQgMCAwLTk2IDIyNi43IDBMMzg0IDkzLjNsMCA2Ni43IDY0IDAgMC02Ni43YzAtMTctNi43LTMzLjMtMTguNy00NS4zTDQwMCAxOC43QzM4OCA2LjcgMzcxLjcgMCAzNTQuNyAwTDEyOCAwek0zODQgMzUybDAgMzIgMCA2NC0yNTYgMCAwLTY0IDAtMTYgMC0xNiAyNTYgMHptNjQgMzJsMzIgMGMxNy43IDAgMzItMTQuMyAzMi0zMmwwLTk2YzAtMzUuMy0yOC43LTY0LTY0LTY0TDY0IDE5MmMtMzUuMyAwLTY0IDI4LjctNjQgNjRsMCA5NmMwIDE3LjcgMTQuMyAzMiAzMiAzMmwzMiAwIDAgNjRjMCAzNS4zIDI4LjcgNjQgNjQgNjRsMjU2IDBjMzUuMyAwIDY0LTI4LjcgNjQtNjRsMC02NHpNNDMyIDI0OGEyNCAyNCAwIDEgMSAwIDQ4IDI0IDI0IDAgMSAxIDAtNDh6Ii8+PC9zdmc+);--toolbarButton-openFile-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjQyODcgMS4wODM5OEMxMC41MTExIDEuMDI5MDUgMTAuNjA4IDAuOTk5ODI0IDEwLjcwNyAxSDE0LjdMMTUgMS4zVjUuMjkzQzE1IDUuMzkxOTQgMTQuOTcwNiA1LjQ4ODY0IDE0LjkxNTYgNS41NzA4OEMxNC44NjA2IDUuNjUzMTEgMTQuNzgyNCA1LjcxNzE4IDE0LjY5MSA1Ljc1NDk4QzE0LjU5OTYgNS43OTI3NyAxNC40OTkgNS44MDI1OSAxNC40MDIgNS43ODMxOUMxNC4zMDQ5IDUuNzYzNzkgMTQuMjE1OSA1LjcxNjA1IDE0LjE0NiA1LjY0NkwxMi45NzMgNC40NzNMMTIuNjkyIDQuMTkyTDkuMDY3IDcuODE3QzguOTQ5MjMgNy45MzM0NyA4Ljc5MDM0IDcuOTk4ODggOC42MjQ3IDcuOTk5MDdDOC40NTkwNyA3Ljk5OTI1IDguMzAwMDMgNy45MzQyMSA4LjE4MiA3LjgxOEM4LjA2NTE4IDcuNzAwMzYgNy45OTk2MiA3LjU0MTI5IDcuOTk5NjIgNy4zNzU1QzcuOTk5NjIgNy4yMDk3MSA4LjA2NTE4IDcuMDUwNjUgOC4xODIgNi45MzNMMTEuODA3IDMuMzA4TDEwLjM1MyAxLjg1NEMxMC4yODI5IDEuNzg0MDcgMTAuMjM1MSAxLjY5NDkgMTAuMjE1OCAxLjU5Nzc5QzEwLjE5NjQgMS41MDA2OCAxMC4yMDYzIDEuNDAwMDEgMTAuMjQ0MiAxLjMwODU0QzEwLjI4MjEgMS4yMTcwNyAxMC4zNDY0IDEuMTM4OTEgMTAuNDI4NyAxLjA4Mzk4Wk03LjgxNjk0IDIuMDY2OTRDNy42OTk3MyAyLjE4NDE1IDcuNTQwNzYgMi4yNSA3LjM3NSAyLjI1SDIuODVMMi4yNSAyLjg1VjEzLjE1TDIuODUgMTMuNzVIMTMuMTVMMTMuNzUgMTMuMTVWOC42MjVDMTMuNzUgOC40NTkyNCAxMy44MTU4IDguMzAwMjcgMTMuOTMzMSA4LjE4MzA2QzE0LjA1MDMgOC4wNjU4NSAxNC4yMDkyIDggMTQuMzc1IDhDMTQuNTQwOCA4IDE0LjY5OTcgOC4wNjU4NSAxNC44MTY5IDguMTgzMDZDMTQuOTM0MiA4LjMwMDI3IDE1IDguNDU5MjQgMTUgOC42MjVWMTNDMTUgMTMuNTMwNCAxNC43ODkzIDE0LjAzOTEgMTQuNDE0MiAxNC40MTQyQzE0LjAzOTEgMTQuNzg5MyAxMy41MzA0IDE1IDEzIDE1SDNDMi40Njk1NyAxNSAxLjk2MDg2IDE0Ljc4OTMgMS41ODU3OSAxNC40MTQyQzEuMjEwNzEgMTQuMDM5MSAxIDEzLjUzMDQgMSAxM1YzQzEgMi40Njk1NyAxLjIxMDcxIDEuOTYwODYgMS41ODU3OSAxLjU4NTc5QzEuOTYwODYgMS4yMTA3MSAyLjQ2OTU3IDEgMyAxSDcuMzc1QzcuNTQwNzYgMSA3LjY5OTczIDEuMDY1ODUgNy44MTY5NCAxLjE4MzA2QzcuOTM0MTUgMS4zMDAyNyA4IDEuNDU5MjQgOCAxLjYyNUM4IDEuNzkwNzYgNy45MzQxNSAxLjk0OTczIDcuODE2OTQgMi4wNjY5NFoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--toolbarButton-download-icon:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNi4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTIxNiAwaDgwYzEzLjMgMCAyNCAxMC43IDI0IDI0djE2OGg4Ny43YzE3LjggMCAyNi43IDIxLjUgMTQuMSAzNC4xTDI2OS43IDM3OC4zYy03LjUgNy41LTE5LjggNy41LTI3LjMgMEw5MC4xIDIyNi4xYy0xMi42LTEyLjYtMy43LTM0LjEgMTQuMS0zNC4xSDE5MlYyNGMwLTEzLjMgMTAuNy0yNCAyNC0yNHptMjk2IDM3NnYxMTJjMCAxMy4zLTEwLjcgMjQtMjQgMjRIMjRjLTEzLjMgMC0yNC0xMC43LTI0LTI0VjM3NmMwLTEzLjMgMTAuNy0yNCAyNC0yNGgxNDYuN2w0OSA0OWMyMC4xIDIwLjEgNTIuNSAyMC4xIDcyLjYgMGw0OS00OUg0ODhjMTMuMyAwIDI0IDEwLjcgMjQgMjR6bS0xMjQgODhjMC0xMS05LTIwLTIwLTIwcy0yMCA5LTIwIDIwIDkgMjAgMjAgMjAgMjAtOSAyMC0yMHptNjQgMGMwLTExLTktMjAtMjAtMjBzLTIwIDktMjAgMjAgOSAyMCAyMCAyMCAyMC05IDIwLTIweiIvPjwvc3ZnPg==);--toolbarButton-bookmark-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIgMy41QzEuNzI0MjEgMy41IDEuNSAzLjcyNDIxIDEuNSA0VjEyQzEuNSAxMi4yNzU4IDEuNzI0MjEgMTIuNSAyIDEyLjVIMTRDMTQuMjc1OCAxMi41IDE0LjUgMTIuMjc1OCAxNC41IDEyVjRDMTQuNSAzLjcyNDIxIDE0LjI3NTggMy41IDE0IDMuNUgyWk0wIDRDMCAyLjg5NTc5IDAuODk1Nzg2IDIgMiAySDE0QzE1LjEwNDIgMiAxNiAyLjg5NTc5IDE2IDRWMTJDMTYgMTMuMTA0MiAxNS4xMDQyIDE0IDE0IDE0SDJDMC44OTU3ODYgMTQgMCAxMy4xMDQyIDAgMTJWNFpNOC43NSA4Ljc1SDcuMjVWNy4yNUg4Ljc1VjguNzVaTTguMDAwMDEgNC42MjVDNS45MTE0MiA0LjYyNSA0LjE0NzM2IDUuOTQyOTEgMy40NTE1OSA3Ljc3ODQ3TDMuMzY3NjEgOEwzLjQ1MTU5IDguMjIxNTNDNC4xNDczNiAxMC4wNTcxIDUuOTExNDIgMTEuMzc1IDguMDAwMDEgMTEuMzc1QzEwLjA4ODYgMTEuMzc1IDExLjg1MjcgMTAuMDU3MSAxMi41NDg0IDguMjIxNTNMMTIuNjMyNCA4TDEyLjU0ODQgNy43Nzg0N0MxMS44NTI3IDUuOTQyOTEgMTAuMDg4NiA0LjYyNSA4LjAwMDAxIDQuNjI1Wk04LjAwMDAxIDEwLjEyNUM2LjUzOTEyIDEwLjEyNSA1LjI4NTA4IDkuMjU0NTUgNC43MTI4MiA4QzUuMjg1MDggNi43NDU0NSA2LjUzOTEyIDUuODc1IDguMDAwMDEgNS44NzVDOS40NjA5IDUuODc1IDEwLjcxNDkgNi43NDU0NSAxMS4yODcyIDhDMTAuNzE0OSA5LjI1NDU1IDkuNDYwOSAxMC4xMjUgOC4wMDAwMSAxMC4xMjVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--toolbarButton-viewThumbnail-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuNSAyQzMuNSAxLjcyNDIxIDMuNzI0MjEgMS41IDQgMS41SDUuMjVDNS41MjU3OSAxLjUgNS43NSAxLjcyNDIxIDUuNzUgMlY1LjI1QzUuNzUgNS41MjU3OSA1LjUyNTc5IDUuNzUgNS4yNSA1Ljc1SDRDMy43MjQyMSA1Ljc1IDMuNSA1LjUyNTc5IDMuNSA1LjI1VjJaTTQgMEMyLjg5NTc5IDAgMiAwLjg5NTc4NiAyIDJWNS4yNUMyIDYuMzU0MjEgMi44OTU3OSA3LjI1IDQgNy4yNUg1LjI1QzYuMzU0MjEgNy4yNSA3LjI1IDYuMzU0MjEgNy4yNSA1LjI1VjJDNy4yNSAwLjg5NTc4NiA2LjM1NDIxIDAgNS4yNSAwSDRaTTMuNSAxMC43NUMzLjUgMTAuNDc0MiAzLjcyNDIxIDEwLjI1IDQgMTAuMjVINS4yNUM1LjUyNTc5IDEwLjI1IDUuNzUgMTAuNDc0MiA1Ljc1IDEwLjc1VjE0QzUuNzUgMTQuMjc1OCA1LjUyNTc5IDE0LjUgNS4yNSAxNC41SDRDMy43MjQyMSAxNC41IDMuNSAxNC4yNzU4IDMuNSAxNFYxMC43NVpNNCA4Ljc1QzIuODk1NzkgOC43NSAyIDkuNjQ1NzkgMiAxMC43NVYxNEMyIDE1LjEwNDIgMi44OTU3OSAxNiA0IDE2SDUuMjVDNi4zNTQyMSAxNiA3LjI1IDE1LjEwNDIgNy4yNSAxNFYxMC43NUM3LjI1IDkuNjQ1NzkgNi4zNTQyMSA4Ljc1IDUuMjUgOC43NUg0Wk0xMC43NSAxLjVDMTAuNDc0MiAxLjUgMTAuMjUgMS43MjQyMSAxMC4yNSAyVjUuMjVDMTAuMjUgNS41MjU3OSAxMC40NzQyIDUuNzUgMTAuNzUgNS43NUgxMkMxMi4yNzU4IDUuNzUgMTIuNSA1LjUyNTc5IDEyLjUgNS4yNVYyQzEyLjUgMS43MjQyMSAxMi4yNzU4IDEuNSAxMiAxLjVIMTAuNzVaTTguNzUgMkM4Ljc1IDAuODk1Nzg2IDkuNjQ1NzkgMCAxMC43NSAwSDEyQzEzLjEwNDIgMCAxNCAwLjg5NTc4NiAxNCAyVjUuMjVDMTQgNi4zNTQyMSAxMy4xMDQyIDcuMjUgMTIgNy4yNUgxMC43NUM5LjY0NTc5IDcuMjUgOC43NSA2LjM1NDIxIDguNzUgNS4yNVYyWk0xMC4yNSAxMC43NUMxMC4yNSAxMC40NzQyIDEwLjQ3NDIgMTAuMjUgMTAuNzUgMTAuMjVIMTJDMTIuMjc1OCAxMC4yNSAxMi41IDEwLjQ3NDIgMTIuNSAxMC43NVYxNEMxMi41IDE0LjI3NTggMTIuMjc1OCAxNC41IDEyIDE0LjVIMTAuNzVDMTAuNDc0MiAxNC41IDEwLjI1IDE0LjI3NTggMTAuMjUgMTRWMTAuNzVaTTEwLjc1IDguNzVDOS42NDU3OSA4Ljc1IDguNzUgOS42NDU3OSA4Ljc1IDEwLjc1VjE0QzguNzUgMTUuMTA0MiA5LjY0NTc5IDE2IDEwLjc1IDE2SDEyQzEzLjEwNDIgMTYgMTQgMTUuMTA0MiAxNCAxNFYxMC43NUMxNCA5LjY0NTc5IDEzLjEwNDIgOC43NSAxMiA4Ljc1SDEwLjc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--toolbarButton-viewOutline-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMS4yNUgxNVYyLjc1SDNWMS4yNVpNMTUgNS4yNUgzVjYuNzVIMTVWNS4yNVpNMTUgMTMuMjVIM1YxNC43NUgxNVYxMy4yNVpNMTUgOS4yNUg2VjEwLjc1SDE1VjkuMjVaTTAgNS4yNUgxLjVWNi43NUgwVjUuMjVaTTEuNSAxMy4yNUgwVjE0Ljc1SDEuNVYxMy4yNVpNMCAxLjI1SDEuNVYyLjc1SDBWMS4yNVpNNC41IDkuMjVIM1YxMC43NUg0LjVWOS4yNVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--toolbarButton-viewAttachments-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuNSAzLjc1QzMuNSAxLjY3ODc5IDUuMTc4NzkgMCA3LjI1IDBDOS4zMjEyMSAwIDExIDEuNjc4NzkgMTEgMy43NVYxMC4yNUMxMSAxMS40OTIyIDkuOTkyMjEgMTIuNSA4Ljc1IDEyLjVDNy41MDc3OSAxMi41IDYuNSAxMS40OTIyIDYuNSAxMC4yNVYzLjVIOFYxMC4yNUM4IDEwLjY2MzggOC4zMzYyMSAxMSA4Ljc1IDExQzkuMTYzNzkgMTEgOS41IDEwLjY2MzggOS41IDEwLjI1VjMuNzVDOS41IDIuNTA3MjEgOC40OTI3OSAxLjUgNy4yNSAxLjVDNi4wMDcyMSAxLjUgNSAyLjUwNzIxIDUgMy43NVYxMC43NUM1IDEyLjgyMDggNi42NzkyMSAxNC41IDguNzUgMTQuNUMxMC44MjA4IDE0LjUgMTIuNSAxMi44MjA4IDEyLjUgMTAuNzVWMy41SDE0VjEwLjc1QzE0IDEzLjY0OTIgMTEuNjQ5MiAxNiA4Ljc1IDE2QzUuODUwNzkgMTYgMy41IDEzLjY0OTIgMy41IDEwLjc1VjMuNzVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--toolbarButton-viewLayers-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMzY2NDUgMi4zNDU2MkM4LjEzODc4IDIuMjE4MTMgNy44NjEyMiAyLjIxODEzIDcuNjMzNTUgMi4zNDU2MkwxLjM4MzU1IDUuODQ1NjJDMS4xNDY2OSA1Ljk3ODI2IDEgNi4yMjg1MyAxIDYuNUMxIDYuNzcxNDcgMS4xNDY2OSA3LjAyMTc0IDEuMzgzNTUgNy4xNTQzOEw3LjYzMzU1IDEwLjY1NDRDNy44NjEyMiAxMC43ODE5IDguMTM4NzggMTAuNzgxOSA4LjM2NjQ1IDEwLjY1NDRMMTQuNjE2NSA3LjE1NDM4QzE0Ljg1MzMgNy4wMjE3NCAxNSA2Ljc3MTQ3IDE1IDYuNUMxNSA2LjIyODUzIDE0Ljg1MzMgNS45NzgyNiAxNC42MTY1IDUuODQ1NjJMOC4zNjY0NSAyLjM0NTYyWk04IDkuMTQwNDFMMy4yODQ5OSA2LjVMOCAzLjg1OTU5TDEyLjcxNSA2LjVMOCA5LjE0MDQxWk0xLjYzNjQ3IDkuMDc2Nkw3Ljk5OTk5IDEyLjY0MDRMMTQuMzI1NSA5LjA5NzYxTDE1LjA1ODUgMTAuNDA2M0w4LjM2NjQ5IDE0LjE1NDNDOC4xMzg4MSAxNC4yODE4IDcuODYxMjIgMTQuMjgxOSA3LjYzMzUzIDE0LjE1NDNMMC45MDM1MzQgMTAuMzg1M0wxLjYzNjQ3IDkuMDc2NloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--toolbarButton-currentOutlineItem-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjgwMyA0Ljc0OTk4VjYuMDI0MzZDMTAuODAzIDYuMzkzMDIgMTAuMzU3MSA2LjU3NzkzIDEwLjA5NjcgNi4zMTc1M0w3Ljg3NzE2IDQuMDk4QzcuNzE1NjYgMy45MzY0OSA3LjcxNTY2IDMuNjc0MzQgNy44NzcxNiAzLjUxMjgzTDEwLjA5NjcgMS4yOTMyOUMxMC4zNTcxIDEuMDMyOSAxMC44MDM2IDEuMjE3MjIgMTAuODAzNiAxLjU4NTg4VjMuMjQ5OThIMTVWNC43NDk5OEgxMC44MDNaTTggMS4yNDk5OEgzVjIuNzQ5OThINi41TDggMS4yNDk5OFpNNi41IDUuMjQ5OThIM1Y2Ljc0OTk4SDhMNi41IDUuMjQ5OThaTTMgMTMuMjVIMTVWMTQuNzVIM1YxMy4yNVpNNiA5LjI0OTk4SDE1VjEwLjc1SDZWOS4yNDk5OFpNMS41IDUuMjQ5OThIMFY2Ljc0OTk4SDEuNVY1LjI0OTk4Wk0wIDEzLjI1SDEuNVYxNC43NUgwVjEzLjI1Wk0xLjUgMS4yNDk5OEgwVjIuNzQ5OThIMS41VjEuMjQ5OThaTTMgOS4yNDk5OEg0LjVWMTAuNzVIM1Y5LjI0OTk4WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--toolbarButton-search-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjA4OSAxMC45NzNMMTMuOTM0IDE0LjgxN0MxMy45OTE4IDE0Ljg3NTQgMTQuMDYwNSAxNC45MjE4IDE0LjEzNjQgMTQuOTUzNEMxNC4yMTIyIDE0Ljk4NTEgMTQuMjkzNiAxNS4wMDEzIDE0LjM3NTcgMTUuMDAxMkMxNC40NTc5IDE1LjAwMTEgMTQuNTM5MiAxNC45ODQ3IDE0LjYxNDkgMTQuOTUyOUMxNC42OTA3IDE0LjkyMTEgMTQuNzU5NCAxNC44NzQ2IDE0LjgxNyAxNC44MTZDMTQuODc1IDE0Ljc1NzkgMTQuOTIxIDE0LjY4ODkgMTQuOTUyMyAxNC42MTNDMTQuOTgzNiAxNC41MzcyIDE0Ljk5OTcgMTQuNDU1OSAxNC45OTk2IDE0LjM3MzhDMTQuOTk5NSAxNC4yOTE3IDE0Ljk4MzMgMTQuMjEwNCAxNC45NTE4IDE0LjEzNDZDMTQuOTIwMyAxNC4wNTg4IDE0Ljg3NDEgMTMuOTkgMTQuODE2IDEzLjkzMkwxMC45ODMgMTAuMUwxMC45ODkgOS42NzI5OUMxMS40ODkgOC45NjY3NCAxMS44MTUyIDguMTUyNDkgMTEuOTQxMyA3LjI5NjQyQzEyLjA2NzQgNi40NDAzNCAxMS45ODk3IDUuNTY2NiAxMS43MTQ1IDQuNzQ2MjFDMTEuNDM5NCAzLjkyNTgyIDEwLjk3NDUgMy4xODE5MiAxMC4zNTc4IDIuNTc0OThDOS43NDEwNCAxLjk2ODA0IDguOTg5NzkgMS41MTUxOSA4LjE2NTA5IDEuMjUzMjJDNy4zNDAzOSAwLjk5MTI1NSA2LjQ2NTUxIDAuOTI3NTcyIDUuNjExNTcgMS4wNjczNUM0Ljc1NzYzIDEuMjA3MTIgMy45NDg3MSAxLjU0NjQxIDMuMjUwNTcgMi4wNTc2NEMyLjU1MjQzIDIuNTY4ODcgMS45ODQ3NiAzLjIzNzYxIDEuNTkzNzEgNC4wMDk1QzEuMjAyNjUgNC43ODE0IDAuOTk5MjM2IDUuNjM0NjggMSA2LjQ5OTk5QzEgNy45NTg2OCAxLjU3OTQ2IDkuMzU3NjMgMi42MTA5MSAxMC4zODkxQzMuNjQyMzYgMTEuNDIwNSA1LjA0MTMxIDEyIDYuNSAxMkM3LjY4OSAxMiA4Ljc4OCAxMS42MiA5LjY4NyAxMC45NzhMMTAuMDg5IDEwLjk3M1YxMC45NzNaTTYuNSAxMC43NUM0LjE1NyAxMC43NSAyLjI1IDguODQyOTkgMi4yNSA2LjQ5OTk5QzIuMjUgNC4xNTY5OSA0LjE1NyAyLjI0OTk5IDYuNSAyLjI0OTk5QzguODQzIDIuMjQ5OTkgMTAuNzUgNC4xNTY5OSAxMC43NSA2LjQ5OTk5QzEwLjc1IDguODQyOTkgOC44NDMgMTAuNzUgNi41IDEwLjc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--findbarButton-previous-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUuMDAxIDguMzUyTDEwLjQ2NiAxMy44MThDMTAuNTg0NSAxMy45MzAzIDEwLjc0MjEgMTMuOTkxOCAxMC45MDUzIDEzLjk4OTVDMTEuMDY4NSAxMy45ODcyIDExLjIyNDQgMTMuOTIxMiAxMS4zMzk3IDEzLjgwNTdDMTEuNDU0OSAxMy42OTAyIDExLjUyMDUgMTMuNTM0MiAxMS41MjI1IDEzLjM3MDlDMTEuNTI0NCAxMy4yMDc3IDExLjQ2MjUgMTMuMDUwMiAxMS4zNSAxMi45MzJMNi40MTYgNy45OTlMMTEuMzQ5IDMuMDY3QzExLjQ2MTQgMi45NDg2NCAxMS41MjMxIDIuNzkxMDYgMTEuNTIxIDIuNjI3ODZDMTEuNTE4OSAyLjQ2NDY2IDExLjQ1MzEgMi4zMDg3NCAxMS4zMzc3IDIuMTkzMzNDMTEuMjIyMyAyLjA3NzkyIDExLjA2NjMgMi4wMTIxNSAxMC45MDMxIDIuMDEwMDNDMTAuNzM5OSAyLjAwNzkyIDEwLjU4MjQgMi4wNjk2MiAxMC40NjQgMi4xODJMNSA3LjY0N0w1LjAwMSA4LjM1MloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--findbarButton-next-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjk5OSA4LjM1Mkw1LjUzNCAxMy44MThDNS40MTU1MSAxMy45MzAzIDUuMjU3ODYgMTMuOTkxOCA1LjA5NDY2IDEzLjk4OTVDNC45MzE0NiAxMy45ODcyIDQuNzc1NjEgMTMuOTIxMiA0LjY2MDMzIDEzLjgwNTdDNC41NDUwNSAxMy42OTAyIDQuNDc5NDUgMTMuNTM0MiA0LjQ3NzUyIDEzLjM3MDlDNC40NzU1OSAxMy4yMDc3IDQuNTM3NDggMTMuMDUwMiA0LjY1IDEyLjkzMkw5LjU4NSA3Ljk5OEw0LjY1MSAzLjA2N0M0LjUzODYyIDIuOTQ4NjQgNC40NzY5MSAyLjc5MTA2IDQuNDc5MDMgMi42Mjc4NkM0LjQ4MTE0IDIuNDY0NjYgNC41NDY5MiAyLjMwODc0IDQuNjYyMzMgMi4xOTMzM0M0Ljc3Nzc0IDIuMDc3OTIgNC45MzM2NiAyLjAxMjE1IDUuMDk2ODYgMi4wMTAwM0M1LjI2MDA2IDIuMDA3OTIgNS40MTc2MyAyLjA2OTYyIDUuNTM2IDIuMTgyTDExIDcuNjQ3TDEwLjk5OSA4LjM1MloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-firstPage-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0IDMuNUgyVjVIMTRWMy41Wk04IDguODExTDEyLjkzOSAxMy43NUwxNC4wMDEgMTIuNjg5TDguNTMxIDcuMjE5QzguMjM4IDYuOTI2IDcuNzYzIDYuOTI2IDcuNDcgNy4yMTlMMiAxMi42ODlMMy4wNjEgMTMuNzVMOCA4LjgxMVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-lastPage-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggOC4xODlMMTIuOTM5IDMuMjVMMTQgNC4zMTFMOC41MzEgOS43ODFDOC4yMzggMTAuMDc0IDcuNzYzIDEwLjA3NCA3LjQ3IDkuNzgxTDIgNC4zMTFMMy4wNjEgMy4yNUw4IDguMTg5Wk0xNCAxMy41VjEySDJWMTMuNUgxNFoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-rotateCcw-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuNDEwNSA0LjgzNjEyTDQuNzcwMDEgNi4xOTYwMUM1LjA2NzAxIDYuNDkyMDEgNC44NTcwMSA3LjAwMDAxIDQuNDM3MDEgNy4wMDAwMUgwLjg2MjAwNkMwLjYwMjAwNiA3LjAwMDAxIDAuMzkxMDA2IDYuNzg5MDEgMC4zOTEwMDYgNi41MjkwMVYyLjk1NDAxQzAuMzkxMDA2IDIuNTM0MDEgMC44OTkwMDYgMi4zMjQwMSAxLjE5NjAxIDIuNjIxMDFMMi4zMjc5NiAzLjc1MzI4QzMuNjc5NTggMS43ODk3MyA1Ljk0MDEgMC41IDguNSAwLjVDMTIuNjM2IDAuNSAxNiAzLjg2NCAxNiA4QzE2IDEyLjEzNiAxMi42MzYgMTUuNSA4LjUgMTUuNUM0LjcwNCAxNS41IDEuNTY2IDEyLjY2MyAxLjA3NSA5SDIuNTlDMy4wNjggMTEuODMzIDUuNTMyIDE0IDguNSAxNEMxMS44MDkgMTQgMTQuNSAxMS4zMDkgMTQuNSA4QzE0LjUgNC42OTEgMTEuODA5IDIgOC41IDJDNi4zNTI2MiAyIDQuNDY4OTMgMy4xMzUwMyAzLjQxMDUgNC44MzYxMloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-rotateCw-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjU4OTUgNC44MzYxM0wxMS4yMyA2LjE5NjAxQzEwLjkzMyA2LjQ5MjAxIDExLjE0MyA3LjAwMDAxIDExLjU2MyA3LjAwMDAxSDE1LjEzOEMxNS4zOTggNy4wMDAwMSAxNS42MDkgNi43ODkwMSAxNS42MDkgNi41MjkwMVYyLjk1NDAxQzE1LjYwOSAyLjUzNDAxIDE1LjEwMSAyLjMyNDAxIDE0LjgwNCAyLjYyMTAxTDEzLjY3MiAzLjc1MzI4QzEyLjMyMDQgMS43ODk3MyAxMC4wNTk5IDAuNSA3LjUgMC41QzMuMzY0IDAuNSAwIDMuODY0IDAgOEMwIDEyLjEzNiAzLjM2NCAxNS41IDcuNSAxNS41QzExLjI5NiAxNS41IDE0LjQzNCAxMi42NjMgMTQuOTI1IDlIMTMuNDFDMTIuOTMyIDExLjgzMyAxMC40NjggMTQgNy41IDE0QzQuMTkxIDE0IDEuNSAxMS4zMDkgMS41IDhDMS41IDQuNjkxIDQuMTkxIDIgNy41IDJDOS42NDczOCAyIDExLjUzMTEgMy4xMzUwMyAxMi41ODk1IDQuODM2MTNaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--secondaryToolbarButton-selectTool-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuMzcxNTg4IDIuOTMxMzFDLTAuMjAzMzY2IDEuMzM0MjIgMS4zMzQyIC0wLjIwMzM1IDIuOTMxMjkgMC4zNzE2MDNMMi45MzI2MyAwLjM3MjA4NUwxMi4wNzE2IDMuNjgxNzFDMTIuMDcxOCAzLjY4MTc4IDEyLjA3MTQgMy42ODE2MyAxMi4wNzE2IDMuNjgxNzFDMTMuNDQ1OSA0LjE3NzU4IDEzLjg0NzggNS45Mzc0IDEyLjgwNzYgNi45Nzc2TDExLjgwNzkgNy45NzcyN0wxNC42ODc2IDEwLjg1NjlDMTUuNDcwNSAxMS42Mzk4IDE1LjQ3MDUgMTIuOTA0NyAxNC42ODc2IDEzLjY4NzZMMTMuNjQ3NiAxNC43Mjc2QzEyLjg2NDcgMTUuNTEwNSAxMS41OTk4IDE1LjUxMDUgMTAuODE2OSAxNC43Mjc2TDcuOTM3MjUgMTEuODQ3OUw2Ljk3NzU4IDEyLjgwNzZDNS45MzczOSAxMy44NDc4IDQuMTc3NzkgMTMuNDQ2NSAzLjY4MTkyIDEyLjA3MjJDMy42ODE4NCAxMi4wNzIgMy42ODIgMTIuMDcyNCAzLjY4MTkyIDEyLjA3MjJMMC4zNzE1ODggMi45MzEzMVpNMS43ODI5MiAyLjQyMzIzQzEuNzgyOTggMi40MjM0IDEuNzgyODYgMi40MjMwNSAxLjc4MjkyIDIuNDIzMjNMNS4wOTI4MSAxMS41NjI5QzUuMjE3MjUgMTEuOTA4MiA1LjY1NzI4IDEyLjAwNjYgNS45MTY5MiAxMS43NDY5TDcuOTM3MjUgOS43MjY2MUwxMS44Nzc2IDEzLjY2NjlDMTIuMDc0NyAxMy44NjQgMTIuMzg5OCAxMy44NjQgMTIuNTg2OSAxMy42NjY5TDEzLjYyNjkgMTIuNjI2OUMxMy44MjQgMTIuNDI5OCAxMy44MjQgMTIuMTE0NyAxMy42MjY5IDExLjkxNzZMOS42ODY1OSA3Ljk3NzI3TDExLjc0NjkgNS45MTY5NEMxMi4wMDY2IDUuNjU3MjkgMTEuOTA4MSA1LjIxNzI3IDExLjU2MjkgNS4wOTI4M0wxMS41NjE5IDUuMDkyNDVMMi40MjMyMSAxLjc4MjkzQzIuNDIzMDQgMS43ODI4NyAyLjQyMzM5IDEuNzgzIDIuNDIzMjEgMS43ODI5M0MyLjAyMDY3IDEuNjM4NDcgMS42Mzg0NiAyLjAyMDY5IDEuNzgyOTIgMi40MjMyM1oiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-handTool-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuNzUgMi4xMjVDNy43NSAxLjc4MDIxIDguMDMwMjEgMS41IDguMzc1IDEuNUM4LjcxOTc5IDEuNSA5IDEuNzgwMjEgOSAyLjEyNVYzLjEyNVY4SDEwLjVWMy4xMjVDMTAuNSAyLjc4MDIxIDEwLjc4MDIgMi41IDExLjEyNSAyLjVDMTEuNDY5OCAyLjUgMTEuNzUgMi43ODAyMSAxMS43NSAzLjEyNVY0LjYyNVY4SDEzLjI1VjQuNjI1QzEzLjI1IDQuMjgwMjEgMTMuNTMwMiA0IDEzLjg3NSA0QzE0LjIxOTggNCAxNC41IDQuMjgwMjEgMTQuNSA0LjYyNVYxMi4wMTg4TDEzLjM4MDIgMTMuNjYyOEMxMy4yOTU0IDEzLjc4NzIgMTMuMjUgMTMuOTM0NCAxMy4yNSAxNC4wODVWMTZIMTQuNzVWMTQuMzE2MkwxNS44Njk4IDEyLjY3MjJDMTUuOTU0NiAxMi41NDc4IDE2IDEyLjQwMDYgMTYgMTIuMjVWNC42MjVDMTYgMy40NTE3OSAxNS4wNDgyIDIuNSAxMy44NzUgMi41QzEzLjYzNDYgMi41IDEzLjQwMzUgMi41Mzk5NiAxMy4xODggMi42MTM2QzEyLjk1OSAxLjY4NzI0IDEyLjEyMTkgMSAxMS4xMjUgMUMxMC44MjM1IDEgMTAuNTM2NiAxLjA2Mjg2IDEwLjI3NjggMS4xNzYxOEM5LjkyODEgMC40Nzg5NjggOS4yMDcyNiAwIDguMzc1IDBDNy41NDI3NCAwIDYuODIxOSAwLjQ3ODk2OCA2LjQ3MzIzIDEuMTc2MThDNi4yMTMzNyAxLjA2Mjg2IDUuOTI2NSAxIDUuNjI1IDFDNC40NTE3OSAxIDMuNSAxLjk1MTc5IDMuNSAzLjEyNVY3LjI1MzE3QzIuNjY1MDQgNi41NDI4MiAxLjQxMDM1IDYuNTgxOTkgMC42MjE2NzIgNy4zNzA2N0MtMC4yMDgyMjEgOC4yMDA1NiAtMC4yMDgyMjEgOS41NDY0NCAwLjYyMTY3MiAxMC4zNzYzTDAuNjIxODggMTAuMzc2NUw1LjQ5OSAxNS4yNDk4VjE2SDYuOTk5VjE0LjkzOUM2Ljk5OSAxNC43NCA2LjkxOTkgMTQuNTQ5MSA2Ljc3OTEyIDE0LjQwODVMMS42ODIzMyA5LjMxNTY3QzEuNDM4MjMgOS4wNzE1NiAxLjQzODIzIDguNjc1NDQgMS42ODIzMyA4LjQzMTMzQzEuOTI2NDQgOC4xODcyMiAyLjMyMjU3IDguMTg3MjIgMi41NjY2NyA4LjQzMTMzTDMuNzE5NjcgOS41ODQzM0MzLjkzNDE3IDkuNzk4ODMgNC4yNTY3NiA5Ljg2MyA0LjUzNzAxIDkuNzQ2OTFDNC44MTcyNyA5LjYzMDgyIDUgOS4zNTczNSA1IDkuMDU0VjMuMTI1QzUgMi43ODAyMSA1LjI4MDIyIDIuNSA1LjYyNSAyLjVDNS45NjkyMSAyLjUgNi4yNDkwNiAyLjc3OTI3IDYuMjUgMy4xMjMyNlY4SDcuNzVMNy43NSAzLjEyNUw3Ljc1IDMuMTIxNzhWMi4xMjVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--secondaryToolbarButton-scrollPage-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuNSAyQzMuNSAxLjcyNDIxIDMuNzI0MjEgMS41IDQgMS41SDEyQzEyLjI3NTggMS41IDEyLjUgMS43MjQyMSAxMi41IDJWMTRDMTIuNSAxNC4yNzU4IDEyLjI3NTggMTQuNSAxMiAxNC41SDRDMy43MjQyMSAxNC41IDMuNSAxNC4yNzU4IDMuNSAxNFYyWk00IDBDMi44OTU3OSAwIDIgMC44OTU3ODYgMiAyVjE0QzIgMTUuMTA0MiAyLjg5NTc5IDE2IDQgMTZIMTJDMTMuMTA0MiAxNiAxNCAxNS4xMDQyIDE0IDE0VjJDMTQgMC44OTU3ODYgMTMuMTA0MiAwIDEyIDBINFpNNS44OTMwMSA2SDcuMjVWMTBINS44OTMwMUM1LjU0MzAxIDEwIDUuMzY4MDEgMTAuNDIzIDUuNjE1MDEgMTAuNjdMNy43MjEwMSAxMi43NzZDNy44NzQwMSAxMi45MjkgOC4xMjMwMSAxMi45MjkgOC4yNzYwMSAxMi43NzZMMTAuMzgzIDEwLjY2OUMxMC42MyAxMC40MjIgMTAuNDU1IDkuOTk5MDIgMTAuMTA1IDkuOTk5MDJIOC43NVY2SDEwLjEwNkMxMC40NTYgNiAxMC42MzIgNS41NzcgMTAuMzgzIDUuMzMxTDguMjc2MDEgMy4yMjRDOC4xMjMwMSAzLjA3MSA3Ljg3NDAxIDMuMDcxIDcuNzIxMDEgMy4yMjRMNS42MTUwMSA1LjMzQzUuMzY4MDEgNS41NzcgNS41NDMwMSA2IDUuODkzMDEgNloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-scrollVertical-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIgMVYxLjI1SDIuMDE0NzZDMi4xMTgzNCAyLjEzMjc5IDIuNzYyMSAzIDMuNzggM0gxMS43MkMxMi43Mzc5IDMgMTMuMzgxNyAyLjEzMjc5IDEzLjQ4NTIgMS4yNUgxMy41VjFIMTJDMTIgMS4xODEzMyAxMS45MzkxIDEuMzIyNzkgMTEuODY5NyAxLjQwNzA4QzExLjgwMTggMS40ODk2MSAxMS43NDU0IDEuNSAxMS43MiAxLjVIMy43OEMzLjc1NDU4IDEuNSAzLjY5ODIzIDEuNDg5NjEgMy42MzAyOSAxLjQwNzA4QzMuNTYwOSAxLjMyMjc5IDMuNSAxLjE4MTMzIDMuNSAxSDJaTTQgNkMzLjcyMzg2IDYgMy41IDYuMjIzODYgMy41IDYuNVYxMEMzLjUgMTAuMjc2MSAzLjcyMzg2IDEwLjUgNCAxMC41SDExLjVDMTEuNzc2MSAxMC41IDEyIDEwLjI3NjEgMTIgMTBWNi41QzEyIDYuMjIzODYgMTEuNzc2MSA2IDExLjUgNkg0Wk0yIDYuNUMyIDUuMzk1NDMgMi44OTU0MyA0LjUgNCA0LjVIMTEuNUMxMi42MDQ2IDQuNSAxMy41IDUuMzk1NDMgMTMuNSA2LjVWMTBDMTMuNSAxMS4xMDQ2IDEyLjYwNDYgMTIgMTEuNSAxMkg0QzIuODk1NDMgMTIgMiAxMS4xMDQ2IDIgMTBWNi41Wk0zLjc4IDEzLjVDMi43NjIxIDEzLjUgMi4xMTgzNCAxNC4zNjcyIDIuMDE0NzYgMTUuMjVIMlYxNS41SDMuNUMzLjUgMTUuMzE4NyAzLjU2MDkgMTUuMTc3MiAzLjYzMDI5IDE1LjA5MjlDMy42OTgyMyAxNS4wMTA0IDMuNzU0NTggMTUgMy43OCAxNUgxMS43MkMxMS43NDU0IDE1IDExLjgwMTggMTUuMDEwNCAxMS44Njk3IDE1LjA5MjlDMTEuOTM5MSAxNS4xNzcyIDEyIDE1LjMxODcgMTIgMTUuNUgxMy41VjE1LjI1SDEzLjQ4NTJDMTMuMzgxNyAxNC4zNjcyIDEyLjczNzkgMTMuNSAxMS43MiAxMy41SDMuNzhaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--secondaryToolbarButton-scrollHorizontal-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMy43OEMzIDIuNzYyMSAyLjEzMjc5IDIuMTE4MzQgMS4yNSAyLjAxNDc2VjJIMVYzLjVDMS4xODEzMyAzLjUgMS4zMjI3OSAzLjU2MDkgMS40MDcwOCAzLjYzMDI5QzEuNDg5NjEgMy42OTgyMyAxLjUgMy43NTQ1OCAxLjUgMy43OFYxMS43MkMxLjUgMTEuNzQ1NCAxLjQ4OTYxIDExLjgwMTggMS40MDcwOCAxMS44Njk3QzEuMzIyNzkgMTEuOTM5MSAxLjE4MTMzIDEyIDEgMTJWMTMuNUgxLjI1VjEzLjQ4NTJDMi4xMzI3OSAxMy4zODE3IDMgMTIuNzM3OSAzIDExLjcyVjMuNzhaTTEwLjUgNEMxMC41IDMuNzIzODYgMTAuMjc2MSAzLjUgMTAgMy41SDYuNUM2LjIyMzg2IDMuNSA2IDMuNzIzODYgNiA0VjExLjVDNiAxMS43NzYxIDYuMjIzODYgMTIgNi41IDEySDEwQzEwLjI3NjEgMTIgMTAuNSAxMS43NzYxIDEwLjUgMTEuNVY0Wk0xMCAyQzExLjEwNDYgMiAxMiAyLjg5NTQzIDEyIDRWMTEuNUMxMiAxMi42MDQ2IDExLjEwNDYgMTMuNSAxMCAxMy41SDYuNUM1LjM5NTQzIDEzLjUgNC41IDEyLjYwNDYgNC41IDExLjVWNEM0LjUgMi44OTU0MyA1LjM5NTQzIDIgNi41IDJIMTBaTTE1LjUgMkgxNS4yNVYyLjAxNDc2QzE0LjM2NzIgMi4xMTgzNCAxMy41IDIuNzYyMSAxMy41IDMuNzhWMTEuNzJDMTMuNSAxMi43Mzc5IDE0LjM2NzIgMTMuMzgxNyAxNS4yNSAxMy40ODUyVjEzLjVIMTUuNVYxMkMxNS4zMTg3IDEyIDE1LjE3NzIgMTEuOTM5MSAxNS4wOTI5IDExLjg2OTdDMTUuMDEwNCAxMS44MDE4IDE1IDExLjc0NTQgMTUgMTEuNzJWMy43OEMxNSAzLjc1NDU4IDE1LjAxMDQgMy42OTgyMyAxNS4wOTI5IDMuNjMwMjlDMTUuMTc3MiAzLjU2MDkgMTUuMzE4NyAzLjUgMTUuNSAzLjVWMloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-scrollWrapped-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuNSAxQzIuNSAxLjI3NTc5IDIuNzI0MjEgMS41IDMgMS41SDVDNS4yNzU3OSAxLjUgNS41IDEuMjc1NzkgNS41IDFIN0M3IDIuMTA0MjEgNi4xMDQyMSAzIDUgM0gzQzEuODk1NzkgMyAxIDIuMTA0MjEgMSAxSDIuNVpNMi41IDZDMi41IDUuNzI0MjEgMi43MjQyMSA1LjUgMyA1LjVINUM1LjI3NTc5IDUuNSA1LjUgNS43MjQyMSA1LjUgNlYxMEM1LjUgMTAuMjc1OCA1LjI3NTc5IDEwLjUgNSAxMC41SDNDMi43MjQyMSAxMC41IDIuNSAxMC4yNzU4IDIuNSAxMFY2Wk0zIDRDMS44OTU3OSA0IDEgNC44OTU3OSAxIDZWMTBDMSAxMS4xMDQyIDEuODk1NzkgMTIgMyAxMkg1QzYuMTA0MjEgMTIgNyAxMS4xMDQyIDcgMTBWNkM3IDQuODk1NzkgNi4xMDQyMSA0IDUgNEgzWk0xMCA2QzEwIDUuNzI0MjEgMTAuMjI0MiA1LjUgMTAuNSA1LjVIMTIuNUMxMi43NzU4IDUuNSAxMyA1LjcyNDIxIDEzIDZWMTBDMTMgMTAuMjc1OCAxMi43NzU4IDEwLjUgMTIuNSAxMC41SDEwLjVDMTAuMjI0MiAxMC41IDEwIDEwLjI3NTggMTAgMTBWNlpNMTAuNSA0QzkuMzk1NzkgNCA4LjUgNC44OTU3OSA4LjUgNlYxMEM4LjUgMTEuMTA0MiA5LjM5NTc5IDEyIDEwLjUgMTJIMTIuNUMxMy42MDQyIDEyIDE0LjUgMTEuMTA0MiAxNC41IDEwVjZDMTQuNSA0Ljg5NTc5IDEzLjYwNDIgNCAxMi41IDRIMTAuNVpNMyAxNC41QzIuNzI0MjEgMTQuNSAyLjUgMTQuNzI0MiAyLjUgMTVIMUMxIDEzLjg5NTggMS44OTU3OSAxMyAzIDEzSDVDNi4xMDQyMSAxMyA3IDEzLjg5NTggNyAxNUg1LjVDNS41IDE0LjcyNDIgNS4yNzU3OSAxNC41IDUgMTQuNUgzWk0xMCAxNUMxMCAxNC43MjQyIDEwLjIyNDIgMTQuNSAxMC41IDE0LjVIMTIuNUMxMi43NzU4IDE0LjUgMTMgMTQuNzI0MiAxMyAxNUgxNC41QzE0LjUgMTMuODk1OCAxMy42MDQyIDEzIDEyLjUgMTNIMTAuNUM5LjM5NTc5IDEzIDguNSAxMy44OTU4IDguNSAxNUgxMFpNMTAuNSAxLjVDMTAuMjI0MiAxLjUgMTAgMS4yNzU3OSAxMCAxSDguNUM4LjUgMi4xMDQyMSA5LjM5NTc5IDMgMTAuNSAzSDEyLjVDMTMuNjA0MiAzIDE0LjUgMi4xMDQyMSAxNC41IDFIMTNDMTMgMS4yNzU3OSAxMi43NzU4IDEuNSAxMi41IDEuNUgxMC41WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--secondaryToolbarButton-spreadNone-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMS41QzMuNzI0MjEgMS41IDMuNSAxLjcyNDIxIDMuNSAyVjE0QzMuNSAxNC4yNzU4IDMuNzI0MjEgMTQuNSA0IDE0LjVIMTJDMTIuMjc1OCAxNC41IDEyLjUgMTQuMjc1OCAxMi41IDE0VjJDMTIuNSAxLjcyNDIxIDEyLjI3NTggMS41IDEyIDEuNUg0Wk0yIDJDMiAwLjg5NTc4NiAyLjg5NTc5IDAgNCAwSDEyQzEzLjEwNDIgMCAxNCAwLjg5NTc4NiAxNCAyVjE0QzE0IDE1LjEwNDIgMTMuMTA0MiAxNiAxMiAxNkg0QzIuODk1NzkgMTYgMiAxNS4xMDQyIDIgMTRWMloiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=);--secondaryToolbarButton-spreadOdd-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEuNSA0QzEuNSAzLjcyNDIxIDEuNzI0MjEgMy41IDIgMy41SDcuMjVWMTNIMkMxLjcyNDIxIDEzIDEuNSAxMi43NzU4IDEuNSAxMi41VjRaTTguNzUgMTNWMy41SDE0QzE0LjI3NTggMy41IDE0LjUgMy43MjQyMSAxNC41IDRWMTIuNUMxNC41IDEyLjc3NTggMTQuMjc1OCAxMyAxNCAxM0g4Ljc1Wk0yIDJDMC44OTU3ODYgMiAwIDIuODk1NzkgMCA0VjEyLjVDMCAxMy42MDQyIDAuODk1Nzg2IDE0LjUgMiAxNC41SDE0QzE1LjEwNDIgMTQuNSAxNiAxMy42MDQyIDE2IDEyLjVWNEMxNiAyLjg5NTc5IDE1LjEwNDIgMiAxNCAySDJaTTQuNzUgNUgzVjYuNUg0VjExLjVINS41VjUuNzVDNS41IDUuMzM1NzkgNS4xNjQyMSA1IDQuNzUgNVpNMTAgNi41SDExLjVWNy4yODY0N0wxMC40MTQ2IDcuODI5MThDMTAuMTYwNSA3Ljk1NjIyIDEwIDguMjE1OTIgMTAgOC41VjEwLjc1QzEwIDExLjE2NDIgMTAuMzM1OCAxMS41IDEwLjc1IDExLjVIMTNWMTBIMTEuNVY4Ljk2MzUzTDEyLjU4NTQgOC40MjA4MkMxMi44Mzk1IDguMjkzNzggMTMgOC4wMzQwOCAxMyA3Ljc1VjUuNzVDMTMgNS4zMzU3OSAxMi42NjQyIDUgMTIuMjUgNUgxMFY2LjVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--secondaryToolbarButton-spreadEven-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMiAzLjVDMS43MjQyMSAzLjUgMS41IDMuNzI0MjEgMS41IDRWMTIuNUMxLjUgMTIuNzc1OCAxLjcyNDIxIDEzIDIgMTNINy4yNVYzLjVIMlpNMTQgMTNIOC43NVYzLjVIMTRDMTQuMjc1OCAzLjUgMTQuNSAzLjcyNDIxIDE0LjUgNFYxMi41QzE0LjUgMTIuNzc1OCAxNC4yNzU4IDEzIDE0IDEzWk0wIDRDMCAyLjg5NTc5IDAuODk1Nzg2IDIgMiAySDE0QzE1LjEwNDIgMiAxNiAyLjg5NTc5IDE2IDRWMTIuNUMxNiAxMy42MDQyIDE1LjEwNDIgMTQuNSAxNCAxNC41SDJDMC44OTU3ODYgMTQuNSAwIDEzLjYwNDIgMCAxMi41VjRaTTEwIDYuNUgxMS41VjcuNUgxMFY5SDExLjVWMTBIMTBWMTEuNUgxMi4yNUMxMi42NjQyIDExLjUgMTMgMTEuMTY0MiAxMyAxMC43NVY1Ljc1QzEzIDUuMzM1NzkgMTIuNjY0MiA1IDEyLjI1IDVIMTBWNi41Wk00LjUgNi41SDNWNUg1LjI1QzUuNjY0MjEgNSA2IDUuMzM1NzkgNiA1Ljc1VjcuNzVDNiA4LjAzNDA4IDUuODM5NSA4LjI5Mzc4IDUuNTg1NDEgOC40MjA4Mkw0LjUgOC45NjM1M1YxMEg2VjExLjVIMy43NUMzLjMzNTc5IDExLjUgMyAxMS4xNjQyIDMgMTAuNzVWOC41QzMgOC4yMTU5MiAzLjE2MDUgNy45NTYyMiAzLjQxNDU5IDcuODI5MThMNC41IDcuMjg2NDdWNi41WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--secondaryToolbarButton-imageAltTextSettings-icon:var(--toolbarButton-editorStamp-icon);--secondaryToolbarButton-documentProperties-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMS41QzQuNDEwMTUgMS41IDEuNSA0LjQxMDE1IDEuNSA4QzEuNSAxMS41ODk5IDQuNDEwMTUgMTQuNSA4IDE0LjVDMTEuNTg5OSAxNC41IDE0LjUgMTEuNTg5OSAxNC41IDhDMTQuNSA0LjQxMDE1IDExLjU4OTkgMS41IDggMS41Wk0wIDhDMCAzLjU4MTcyIDMuNTgxNzIgMCA4IDBDMTIuNDE4MyAwIDE2IDMuNTgxNzIgMTYgOEMxNiAxMi40MTgzIDEyLjQxODMgMTYgOCAxNkMzLjU4MTcyIDE2IDAgMTIuNDE4MyAwIDhaTTguNzUgNFY1LjVINy4yNVY0SDguNzVaTTguNzUgMTJWN0g3LjI1VjEySDguNzVaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);--editorParams-stampAddImage-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMDA0ODggOS43NVYxNEM3LjAwNDg4IDE0LjE2NTggNy4wNzA3MyAxNC4zMjQ3IDcuMTg3OTQgMTQuNDQxOUM3LjMwNTE1IDE0LjU1OTIgNy40NjQxMiAxNC42MjUgNy42Mjk4OCAxNC42MjVDNy43OTU2NCAxNC42MjUgNy45NTQ2MSAxNC41NTkyIDguMDcxODMgMTQuNDQxOUM4LjE4OTA0IDE0LjMyNDcgOC4yNTQ4OCAxNC4xNjU4IDguMjU0ODggMTRWOS43NUw4Ljc1NDg4IDkuMjVIMTMuMDA0OUMxMy4xNzA2IDkuMjUgMTMuMzI5NiA5LjE4NDE1IDEzLjQ0NjggOS4wNjY5NEMxMy41NjQgOC45NDk3MyAxMy42Mjk5IDguNzkwNzYgMTMuNjI5OSA4LjYyNUMxMy42Mjk5IDguNDU5MjQgMTMuNTY0IDguMzAwMjcgMTMuNDQ2OCA4LjE4MzA2QzEzLjMyOTYgOC4wNjU4NSAxMy4xNzA2IDggMTMuMDA0OSA4SDguNzU0ODhMOC4yNTQ4OCA3LjVWMy4yNUM4LjI1NDg4IDMuMDg0MjQgOC4xODkwNCAyLjkyNTI3IDguMDcxODMgMi44MDgwNkM3Ljk1NDYxIDIuNjkwODUgNy43OTU2NCAyLjYyNSA3LjYyOTg4IDIuNjI1QzcuNDY0MTIgMi42MjUgNy4zMDUxNSAyLjY5MDg1IDcuMTg3OTQgMi44MDgwNkM3LjA3MDczIDIuOTI1MjcgNy4wMDQ4OCAzLjA4NDI0IDcuMDA0ODggMy4yNVY3LjVMNi41MDQ4OCA4SDIuMjU0ODhDMi4wODkxMiA4IDEuOTMwMTUgOC4wNjU4NSAxLjgxMjk0IDguMTgzMDZDMS42OTU3MyA4LjMwMDI3IDEuNjI5ODggOC40NTkyNCAxLjYyOTg4IDguNjI1QzEuNjI5ODggOC43OTA3NiAxLjY5NTczIDguOTQ5NzMgMS44MTI5NCA5LjA2Njk0QzEuOTMwMTUgOS4xODQxNSAyLjA4OTEyIDkuMjUgMi4yNTQ4OCA5LjI1SDYuMzkxODhMNy4wMDQ4OCA5Ljc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==)}.visuallyHidden{position:absolute;top:0;left:0;border:0;margin:0;padding:0;width:0;height:0;overflow:hidden;font-size:0}.textLayer.highlighting{touch-action:none;cursor:var(--editorFreeHighlight-editing-cursor)}.textLayer.highlighting:not(.free) span{cursor:var(--editorHighlight-editing-cursor)}[role=img]:is(.textLayer.highlighting:not(.free) span){cursor:var(--editorFreeHighlight-editing-cursor)}.textLayer.highlighting.free span{cursor:var(--editorFreeHighlight-editing-cursor)}:is(#viewerContainer.pdfPresentationMode:fullscreen,.annotationEditorLayer.disabled) .noAltTextBadge{display:none!important}@media (min-resolution:1.1dppx){:root{--editorFreeText-editing-cursor:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDIuNzVIMTIuNVYyLjI1VjFWMC41SDEySDEwLjM1OEM5LjkxMTY1IDAuNSA5LjQ3NzMxIDAuNjI1NjYxIDkuMDk5ODkgMC44NjA0NDJMOS4wOTg4NiAwLjg2MTA4N0w4IDEuNTQ4MzdMNi44OTk5NyAwLjg2MDk3OUw2Ljg5OTExIDAuODYwNDQzQzYuNTIxOCAwLjYyNTczNCA2LjA4NzQ4IDAuNSA1LjY0MiAwLjVINEgzLjVWMVYyLjI1VjIuNzVINEg1LjY0MkM1LjY2NDc4IDIuNzUgNS42ODg1IDIuNzU2NDEgNS43MTAwOCAyLjc2OTY4QzUuNzEwMjMgMi43Njk3NyA1LjcxMDM4IDIuNzY5ODYgNS43MTA1MyAyLjc2OTk1TDYuODE3IDMuNDYxQzYuODE3MDQgMy40NjEwMyA2LjgxNzA5IDMuNDYxMDUgNi44MTcxMyAzLjQ2MTA4QzYuODE3MTMgMy40NjEwOCA2LjgxNzEzIDMuNDYxMDggNi44MTcxNCAzLjQ2MTA5QzYuODU1MiAzLjQ4NDk0IDYuODc2IDMuNTIyODUgNi44NzYgMy41NjdWOFYxMi40MzNDNi44NzYgMTIuNDc3MSA2Ljg1NTIzIDEyLjUxNSA2LjgxNzIyIDEyLjUzODlDNi44MTcxNSAxMi41Mzg5IDYuODE3MDcgMTIuNTM5IDYuODE3IDEyLjUzOUw1LjcwOTUzIDEzLjIzQzUuNzA5NDEgMTMuMjMwMSA1LjcwOTI5IDEzLjIzMDIgNS43MDkxNyAxMy4yMzAzQzUuNjg3MjMgMTMuMjQzOCA1LjY2NDQgMTMuMjUgNS42NDEgMTMuMjVINEgzLjVWMTMuNzVWMTVWMTUuNUg0SDUuNjQyQzYuMDg4MzUgMTUuNSA2LjUyMjY5IDE1LjM3NDMgNi45MDAxMSAxNS4xMzk2TDYuOTAwODYgMTUuMTM5MUw4IDE0LjQ1MjZMOS4xMDAwMyAxNS4xNEw5LjEwMDg5IDE1LjE0MDZDOS40NzgzMSAxNS4zNzUzIDkuOTEyNjUgMTUuNTAxIDEwLjM1OSAxNS41MDFIMTJIMTIuNVYxNS4wMDFWMTMuNzUxVjEzLjI1MUgxMkgxMC4zNThDMTAuMzM1MiAxMy4yNTEgMTAuMzExNSAxMy4yNDQ2IDEwLjI4OTkgMTMuMjMxM0MxMC4yODk3IDEzLjIzMTIgMTAuMjg5NiAxMy4yMzExIDEwLjI4OTUgMTMuMjMxTDkuMTgzIDEyLjU0QzkuMTgyOTggMTIuNTQgOS4xODI5NSAxMi41NCA5LjE4MjkzIDEyLjU0QzkuMTgyOTEgMTIuNTM5OSA5LjE4Mjg4IDEyLjUzOTkgOS4xODI4NiAxMi41Mzk5QzkuMTQ2MTUgMTIuNTE2OSA5LjEyNSAxMi40Nzk3IDkuMTI1IDEyLjQzNFY4VjMuNTY3QzkuMTI1IDMuNTIyNjYgOS4xNDYwMyAzLjQ4NDQxIDkuMTgzNjQgMy40NjA2QzkuMTgzNzcgMy40NjA1MiA5LjE4MzkgMy40NjA0MyA5LjE4NDA0IDMuNDYwMzVMMTAuMjg5NSAyLjc2OTk1QzEwLjI4OTYgMi43Njk4NSAxMC4yODk4IDIuNzY5NzUgMTAuMjg5OSAyLjc2OTY2QzEwLjMxMTkgMi43NTYxOSAxMC4zMzQ2IDIuNzUgMTAuMzU4IDIuNzVIMTJaIiBmaWxsPSJibGFjayIgc3Ryb2tlPSJ3aGl0ZSIvPgo8L3N2Zz4K) 0 16,text}}[data-editor-rotation="90"]{transform:rotate(90deg)}[data-editor-rotation="180"]{transform:rotate(180deg)}[data-editor-rotation="270"]{transform:rotate(270deg)}.annotationEditorLayer{background:0 0;position:absolute;inset:0;font-size:calc(100px * var(--scale-factor));transform-origin:0 0;cursor:auto}.annotationEditorLayer .selectedEditor{z-index:100000!important}.annotationEditorLayer.drawing *{pointer-events:none!important}.annotationEditorLayer.waiting{content:"";cursor:wait;position:absolute;inset:0;width:100%;height:100%}.annotationEditorLayer.freetextEditing{cursor:var(--editorFreeText-editing-cursor)}.annotationEditorLayer.inkEditing{cursor:var(--editorInk-editing-cursor)}.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor){position:absolute;background:0 0;z-index:1;transform-origin:0 0;cursor:auto;max-width:100%;max-height:100%;border:var(--unfocus-outline)}.draggable.selectedEditor:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)){cursor:move}.moving:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)){touch-action:none}.selectedEditor:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)){border:var(--focus-outline);outline:var(--focus-outline-around)}.selectedEditor:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor))::before{content:"";position:absolute;inset:0;border:var(--focus-outline-around);pointer-events:none}:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)):hover:not(.selectedEditor){border:var(--hover-outline);outline:var(--hover-outline-around)}:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)):hover:not(.selectedEditor)::before{content:"";position:absolute;inset:0;border:var(--focus-outline-around)}:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar{--editor-toolbar-delete-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICAgIGQ9Ik0xMSAzSDEzLjZDMTQgMyAxNC4zIDMuMyAxNC4zIDMuNkMxNC4zIDMuOSAxNCA0LjIgMTMuNyA0LjJIMTMuM1YxNEMxMy4zIDE1LjEgMTIuNCAxNiAxMS4zIDE2SDQuODAwMDVDMy43MDAwNSAxNiAyLjgwMDA1IDE1LjEgMi44MDAwNSAxNFY0LjJIMi40MDAwNUMyLjAwMDA1IDQuMiAxLjgwMDA1IDQgMS44MDAwNSAzLjZDMS44MDAwNSAzLjIgMi4wMDAwNSAzIDIuNDAwMDUgM0g1LjAwMDA1VjJDNS4wMDAwNSAwLjkgNS45MDAwNSAwIDcuMDAwMDUgMEg5LjAwMDA1QzEwLjEgMCAxMSAwLjkgMTEgMlYzWk02LjkwMDA1IDEuMkw2LjMwMDA1IDEuOFYzSDkuODAwMDVWMS44TDkuMjAwMDUgMS4ySDYuOTAwMDVaTTExLjQgMTQuN0wxMiAxNC4xVjQuMkg0LjAwMDA1VjE0LjFMNC42MDAwNSAxNC43SDExLjRaTTcuMDAwMDUgMTIuNEM3LjAwMDA1IDEyLjcgNi43MDAwNSAxMyA2LjQwMDA1IDEzQzYuMTAwMDUgMTMgNS44MDAwNSAxMi43IDUuODAwMDUgMTIuNFY3LjZDNS43MDAwNSA3LjMgNi4wMDAwNSA3IDYuNDAwMDUgN0M2LjgwMDA1IDcgNy4wMDAwNSA3LjMgNy4wMDAwNSA3LjZWMTIuNFpNMTAuMjAwMSAxMi40QzEwLjIwMDEgMTIuNyA5LjkwMDA2IDEzIDkuNjAwMDYgMTNDOS4zMDAwNiAxMyA5LjAwMDA2IDEyLjcgOS4wMDAwNiAxMi40VjcuNkM5LjAwMDA2IDcuMyA5LjMwMDA2IDcgOS42MDAwNiA3QzkuOTAwMDYgNyAxMC4yMDAxIDcuMyAxMC4yMDAxIDcuNlYxMi40WiIKICAgICAgICBmaWxsPSJibGFjayIgLz4KPC9zdmc+);--editor-toolbar-bg-color:#f0f0f4;--editor-toolbar-highlight-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNyAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnPgogICAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuMTA5MTggMTEuNjZDNy4yNDkxOCAxMS44IDcuNDM5MTggMTEuODggNy42MzkxOCAxMS44OEM3LjgzOTE4IDExLjg4IDguMDI5MTggMTEuOCA4LjE2OTE4IDExLjY2TDE0LjkxOTIgNC45MUMxNS4yNjkyIDQuNTcgMTUuNDU5MiA0LjExIDE1LjQ1OTIgMy42MkMxNS40NTkyIDMuMTMgMTUuMjY5MiAyLjY3IDE0LjkxOTIgMi4zM0wxMy4xMjkyIDAuNTRDMTIuNzg5MiAwLjE5IDEyLjMyOTIgMCAxMS44MzkyIDBDMTEuMzQ5MiAwIDEwLjg4OTIgMC4yIDEwLjU0OTIgMC41NEwzLjc5OTE4IDcuMjlDMy41MDkxOCA3LjU4IDMuNTA5MTggOC4wNiAzLjc5OTE4IDguMzVMNC4zODk4OCA4Ljk0MDdMMS40MDkxOCAxMS45M0g1LjY0OTE4TDYuNTE0MTkgMTEuMDY1TDcuMTA5MTggMTEuNjZaTTcuNjM5MTggMTAuMDdMNS4zODkxOCA3LjgyVjcuODFMNy44NjQ4IDUuMzM0MzhMMTAuMTE5OCA3LjU4OTM4TDcuNjM5MTggMTAuMDdaTTExLjE4MDUgNi41Mjg3MkwxMy44NTkyIDMuODVDMTMuOTg5MiAzLjcyIDEzLjk4OTIgMy41MiAxMy44NTkyIDMuMzlMMTIuMDY5MiAxLjZDMTEuOTg5MiAxLjUyIDExLjg4OTIgMS41IDExLjgzOTIgMS41QzExLjgzOTIgMS41IDExLjY4OTIgMS41MSAxMS42MDkyIDEuNTlMOC45MjU0NiA0LjI3MzcyTDExLjE4MDUgNi41Mjg3MloiIGZpbGw9IiMwMDAiLz4KICAgICAgPHBhdGggZD0iTTAuNDA5MTggMTRIMTUuNDA5MlYxNkgwLjQwOTE4VjE0WiIgZmlsbD0iIzAwMCIvPgogICAgPC9nPgogIDwvc3ZnPg==);--editor-toolbar-fg-color:#2e2e56;--editor-toolbar-border-color:#8f8f9d;--editor-toolbar-hover-border-color:var(--editor-toolbar-border-color);--editor-toolbar-hover-bg-color:#e0e0e6;--editor-toolbar-hover-fg-color:var(--editor-toolbar-fg-color);--editor-toolbar-hover-outline:none;--editor-toolbar-focus-outline-color:#0060df;--editor-toolbar-shadow:0 2px 6px 0 rgb(58 57 68 / 0.2);--editor-toolbar-vert-offset:6px;--editor-toolbar-height:28px;--editor-toolbar-padding:2px;--alt-text-done-color:#2ac3a2;--alt-text-warning-color:#0090ed;--alt-text-hover-done-color:var(--alt-text-done-color);--alt-text-hover-warning-color:var(--alt-text-warning-color);display:flex;width:-moz-fit-content;width:fit-content;height:var(--editor-toolbar-height);flex-direction:column;justify-content:center;align-items:center;cursor:default;pointer-events:auto;box-sizing:content-box;padding:var(--editor-toolbar-padding);position:absolute;inset-inline-end:0;inset-block-start:calc(100% + var(--editor-toolbar-vert-offset));border-radius:6px;background-color:var(--editor-toolbar-bg-color);border:1px solid var(--editor-toolbar-border-color);box-shadow:var(--editor-toolbar-shadow)}#findbar,.colorPicker .swatch,.dialogButton,.toolbarButton,.verticalToolbarSeparator{box-sizing:border-box}:where(html.is-dark) :is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar{--editor-toolbar-bg-color:#2b2a33;--editor-toolbar-fg-color:#fbfbfe;--editor-toolbar-hover-bg-color:#52525e;--editor-toolbar-focus-outline-color:#0df;--alt-text-done-color:#54ffbd;--alt-text-warning-color:#80ebff}.hidden:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar){display:none}:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar):has(:focus-visible){border-color:transparent}[dir=ltr] :is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar){transform-origin:100% 0}[dir=rtl] :is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar){transform-origin:0 0}:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons{display:flex;justify-content:center;align-items:center;gap:0;height:100%}:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .divider{width:0;height:calc(2 * var(--editor-toolbar-padding) + var(--editor-toolbar-height));border-left:1px solid var(--editor-toolbar-border-color);border-right:none;display:inline-block;margin-inline:2px}:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .highlightButton{width:var(--editor-toolbar-height)}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .highlightButton)::before{content:"";-webkit-mask-image:var(--editor-toolbar-highlight-image);mask-image:var(--editor-toolbar-highlight-image);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;display:inline-block;background-color:var(--editor-toolbar-fg-color);width:100%;height:100%}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .highlightButton):hover::before{background-color:var(--editor-toolbar-hover-fg-color)}:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .delete{width:var(--editor-toolbar-height)}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .delete)::before{content:"";-webkit-mask-image:var(--editor-toolbar-delete-image);mask-image:var(--editor-toolbar-delete-image);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;display:inline-block;background-color:var(--editor-toolbar-fg-color);width:100%;height:100%}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .delete):hover::before{background-color:var(--editor-toolbar-hover-fg-color)}:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons)>*{height:var(--editor-toolbar-height)}:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons)>:not(.divider){border:none;background-color:transparent;cursor:pointer}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) > :not(.divider)):hover{border-radius:2px;background-color:var(--editor-toolbar-hover-bg-color);color:var(--editor-toolbar-hover-fg-color);outline:var(--editor-toolbar-hover-outline);outline-offset:1px}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) > :not(.divider)):hover:active{outline:0}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) > :not(.divider)):focus-visible{border-radius:2px;outline:2px solid var(--editor-toolbar-focus-outline-color)}:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText{--alt-text-add-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMiAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgPHBhdGggZD0iTTUuMzc1IDcuNjI1VjExLjg3NUM1LjM3NSAxMi4wNDA4IDUuNDQwODUgMTIuMTk5NyA1LjU1ODA2IDEyLjMxNjlDNS42NzUyNyAxMi40MzQyIDUuODM0MjQgMTIuNSA2IDEyLjVDNi4xNjU3NiAxMi41IDYuMzI0NzMgMTIuNDM0MiA2LjQ0MTk0IDEyLjMxNjlDNi41NTkxNSAxMi4xOTk3IDYuNjI1IDEyLjA0MDggNi42MjUgMTEuODc1VjcuNjI1TDcuMTI1IDcuMTI1SDExLjM3NUMxMS41NDA4IDcuMTI1IDExLjY5OTcgNy4wNTkxNSAxMS44MTY5IDYuOTQxOTRDMTEuOTM0MiA2LjgyNDczIDEyIDYuNjY1NzYgMTIgNi41QzEyIDYuMzM0MjQgMTEuOTM0MiA2LjE3NTI3IDExLjgxNjkgNi4wNTgwNkMxMS42OTk3IDUuOTQwODUgMTEuNTQwOCA1Ljg3NSAxMS4zNzUgNS44NzVINy4xMjVMNi42MjUgNS4zNzVWMS4xMjVDNi42MjUgMC45NTkyNCA2LjU1OTE1IDAuODAwMjY5IDYuNDQxOTQgMC42ODMwNThDNi4zMjQ3MyAwLjU2NTg0OCA2LjE2NTc2IDAuNSA2IDAuNUM1LjgzNDI0IDAuNSA1LjY3NTI3IDAuNTY1ODQ4IDUuNTU4MDYgMC42ODMwNThDNS40NDA4NSAwLjgwMDI2OSA1LjM3NSAwLjk1OTI0IDUuMzc1IDEuMTI1VjUuMzc1TDQuODc1IDUuODc1SDAuNjI1QzAuNDU5MjQgNS44NzUgMC4zMDAyNjkgNS45NDA4NSAwLjE4MzA1OCA2LjA1ODA2QzAuMDY1ODQ4IDYuMTc1MjcgMCA2LjMzNDI0IDAgNi41QzAgNi42NjU3NiAwLjA2NTg0OCA2LjgyNDczIDAuMTgzMDU4IDYuOTQxOTRDMC4zMDAyNjkgNy4wNTkxNSAwLjQ1OTI0IDcuMTI1IDAuNjI1IDcuMTI1SDQuNzYyTDUuMzc1IDcuNjI1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+IAo=);--alt-text-done-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMiAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNNiAwLjVDNS4yMTIwNyAwLjUgNC40MzE4NSAwLjY1NTE5NSAzLjcwMzkgMC45NTY3MjNDMi45NzU5NSAxLjI1ODI1IDIuMzE0NTEgMS43MDAyMSAxLjc1NzM2IDIuMjU3MzZDMS4yMDAyMSAyLjgxNDUxIDAuNzU4MjUxIDMuNDc1OTUgMC40NTY3MjMgNC4yMDM5QzAuMTU1MTk1IDQuOTMxODUgMCA1LjcxMjA3IDAgNi41QzAgNy4yODc5MyAwLjE1NTE5NSA4LjA2ODE1IDAuNDU2NzIzIDguNzk2MUMwLjc1ODI1MSA5LjUyNDA1IDEuMjAwMjEgMTAuMTg1NSAxLjc1NzM2IDEwLjc0MjZDMi4zMTQ1MSAxMS4yOTk4IDIuOTc1OTUgMTEuNzQxNyAzLjcwMzkgMTIuMDQzM0M0LjQzMTg1IDEyLjM0NDggNS4yMTIwNyAxMi41IDYgMTIuNUM3LjU5MTMgMTIuNSA5LjExNzQyIDExLjg2NzkgMTAuMjQyNiAxMC43NDI2QzExLjM2NzkgOS42MTc0MiAxMiA4LjA5MTMgMTIgNi41QzEyIDQuOTA4NyAxMS4zNjc5IDMuMzgyNTggMTAuMjQyNiAyLjI1NzM2QzkuMTE3NDIgMS4xMzIxNCA3LjU5MTMgMC41IDYgMC41Wk01LjA2IDguOUwyLjk0NjQgNi43ODU2QzIuODUyNzMgNi42OTE3MSAyLjgwMDE4IDYuNTY0NDYgMi44MDAzMyA2LjQzMTgzQzIuODAwNDggNi4yOTkyMSAyLjg1MzMxIDYuMTcyMDcgMi45NDcyIDYuMDc4NEMzLjA0MTA5IDUuOTg0NzMgMy4xNjgzNCA1LjkzMjE4IDMuMzAwOTcgNS45MzIzM0MzLjQzMzU5IDUuOTMyNDggMy41NjA3MyA1Ljk4NTMxIDMuNjU0NCA2LjA3OTJMNS4zMTEyIDcuNzM2OEw4LjM0NjQgNC43MDA4QzguNDQxMDkgNC42MTA5IDguNTY3MTUgNC41NjE1MyA4LjY5NzcxIDQuNTYzMjJDOC44MjgyNyA0LjU2NDkyIDguOTUzMDEgNC42MTc1NCA5LjA0NTM0IDQuNzA5ODZDOS4xMzc2NiA0LjgwMjE5IDkuMTkwMjggNC45MjY5MyA5LjE5MTk4IDUuMDU3NDlDOS4xOTM2NyA1LjE4ODA1IDkuMTQ0MyA1LjMxNDExIDkuMDU0NCA1LjQwODhMNS41NjI0IDguOUg1LjA2WiIgZmlsbD0iI0ZCRkJGRSIvPgo8L3N2Zz4gCg==);display:flex;align-items:center;justify-content:center;width:-moz-max-content;width:max-content;padding-inline:8px;pointer-events:all;font:menu;font-weight:590;font-size:12px;color:var(--editor-toolbar-fg-color)}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText):disabled{pointer-events:none}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText)::before{content:"";-webkit-mask-image:var(--alt-text-add-image);mask-image:var(--alt-text-add-image);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;display:inline-block;width:12px;height:13px;background-color:var(--editor-toolbar-fg-color);margin-inline-end:4px}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText):hover::before{background-color:var(--editor-toolbar-hover-fg-color)}.done:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText)::before{-webkit-mask-image:var(--alt-text-done-image);mask-image:var(--alt-text-done-image)}.new:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText)::before{width:16px;height:16px;-webkit-mask-image:var(--new-alt-text-warning-image);mask-image:var(--new-alt-text-warning-image);background-color:var(--alt-text-warning-color);-webkit-mask-size:cover;mask-size:cover}.new:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText):hover::before{background-color:var(--alt-text-hover-warning-color)}.new.done:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText)::before{-webkit-mask-image:var(--alt-text-done-image);mask-image:var(--alt-text-done-image);background-color:var(--alt-text-done-color)}.new.done:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText):hover::before{background-color:var(--alt-text-hover-done-color)}:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText) .tooltip{display:none}.show:is(:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText) .tooltip){--alt-text-tooltip-bg:#f0f0f4;--alt-text-tooltip-fg:#15141a;--alt-text-tooltip-border:#8f8f9d;--alt-text-tooltip-shadow:0px 2px 6px 0px rgb(58 57 68 / 0.2);display:inline-flex;flex-direction:column;align-items:center;justify-content:center;position:absolute;top:calc(100% + 2px);inset-inline-start:0;padding-block:2px 3px;padding-inline:3px;max-width:300px;width:-moz-max-content;width:max-content;height:auto;font-size:12px;border:.5px solid var(--alt-text-tooltip-border);background:var(--alt-text-tooltip-bg);box-shadow:var(--alt-text-tooltip-shadow);color:var(--alt-text-tooltip-fg);pointer-events:none}:where(html.is-dark) .show:is(:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText) .tooltip){--alt-text-tooltip-bg:#1c1b22;--alt-text-tooltip-fg:#fbfbfe;--alt-text-tooltip-shadow:0px 2px 6px 0px #15141a}.annotationEditorLayer .freeTextEditor{padding:calc(var(--freetext-padding) * var(--scale-factor));width:auto;height:auto;touch-action:none}.annotationEditorLayer .freeTextEditor .internal{background:0 0;border:none;inset:0;overflow:visible;white-space:nowrap;font:10px sans-serif;line-height:var(--freetext-line-height);-webkit-user-select:none;-moz-user-select:none;user-select:none}.annotationEditorLayer .freeTextEditor .overlay{position:absolute;display:none;background:0 0;inset:0;width:100%;height:100%}.annotationEditorLayer freeTextEditor .overlay.enabled,.pdfViewer .page.loading::after{display:block}.annotationEditorLayer .freeTextEditor .internal:empty::before{content:attr(default-content);color:gray}.annotationEditorLayer .freeTextEditor .internal:focus{outline:0;-webkit-user-select:auto;-moz-user-select:auto;user-select:auto}.annotationEditorLayer .inkEditor.editing{cursor:inherit}.annotationEditorLayer .inkEditor .inkEditorCanvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}.annotationEditorLayer .stampEditor{width:auto;height:auto}:is(.annotationEditorLayer .stampEditor) canvas{position:absolute;width:100%;height:100%;margin:0;top:0;left:0}:is(.annotationEditorLayer .stampEditor) .noAltTextBadge{--no-alt-text-badge-border-color:#f0f0f4;--no-alt-text-badge-bg-color:#cfcfd8;--no-alt-text-badge-fg-color:#5b5b66;position:absolute;inset-inline-end:5px;inset-block-end:5px;display:inline-flex;width:32px;height:32px;padding:3px;justify-content:center;align-items:center;pointer-events:none;z-index:1;border-radius:2px;border:1px solid var(--no-alt-text-badge-border-color);background:var(--no-alt-text-badge-bg-color)}:where(html.is-dark) :is(.annotationEditorLayer .stampEditor) .noAltTextBadge{--no-alt-text-badge-border-color:#52525e;--no-alt-text-badge-bg-color:#fbfbfe;--no-alt-text-badge-fg-color:#15141a}:is(:is(.annotationEditorLayer .stampEditor) .noAltTextBadge)::before{content:"";display:inline-block;width:16px;height:16px;-webkit-mask-image:var(--new-alt-text-warning-image);mask-image:var(--new-alt-text-warning-image);-webkit-mask-size:cover;mask-size:cover;background-color:var(--no-alt-text-badge-fg-color)}:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor))>.resizers{position:absolute;inset:0}.hidden:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers){display:none}:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers)>.resizer{width:var(--resizer-size);height:var(--resizer-size);background:content-box var(--resizer-bg-color);border:var(--focus-outline-around);border-radius:2px;position:absolute}.topLeft:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){top:var(--resizer-shift);left:var(--resizer-shift)}.topMiddle:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){top:var(--resizer-shift);left:calc(50% + var(--resizer-shift))}.topRight:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){top:var(--resizer-shift);right:var(--resizer-shift)}.middleRight:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){top:calc(50% + var(--resizer-shift));right:var(--resizer-shift)}.bottomRight:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){bottom:var(--resizer-shift);right:var(--resizer-shift)}.bottomMiddle:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){bottom:var(--resizer-shift);left:calc(50% + var(--resizer-shift))}.bottomLeft:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){bottom:var(--resizer-shift);left:var(--resizer-shift)}.middleLeft:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor)) > .resizers) > .resizer){top:calc(50% + var(--resizer-shift));left:var(--resizer-shift)}.bottomRight:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer),.topLeft:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer){cursor:nwse-resize}.bottomMiddle:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer),.topMiddle:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer){cursor:ns-resize}.bottomLeft:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer),.topRight:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer){cursor:nesw-resize}.middleLeft:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer),.middleRight:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="180"],[data-editor-rotation="0"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="90"],[data-editor-rotation="270"])) > .resizers > .resizer){cursor:ew-resize}.bottomRight:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer),.topLeft:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer){cursor:nesw-resize}.bottomMiddle:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer),.topMiddle:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer){cursor:ew-resize}.bottomLeft:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer),.topRight:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer){cursor:nwse-resize}.middleLeft:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer),.middleRight:is(:is(.annotationEditorLayer[data-main-rotation="0"] :is([data-editor-rotation="90"],[data-editor-rotation="270"]),.annotationEditorLayer[data-main-rotation="90"] :is([data-editor-rotation="0"],[data-editor-rotation="180"]),.annotationEditorLayer[data-main-rotation="180"] :is([data-editor-rotation="270"],[data-editor-rotation="90"]),.annotationEditorLayer[data-main-rotation="270"] :is([data-editor-rotation="180"],[data-editor-rotation="0"])) > .resizers > .resizer){cursor:ns-resize}:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="90"],[data-main-rotation="90"] [data-editor-rotation="0"],[data-main-rotation="180"] [data-editor-rotation="270"],[data-main-rotation="270"] [data-editor-rotation="180"])) .editToolbar{rotate:270deg}[dir=ltr] :is(:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="90"],[data-main-rotation="90"] [data-editor-rotation="0"],[data-main-rotation="180"] [data-editor-rotation="270"],[data-main-rotation="270"] [data-editor-rotation="180"])) .editToolbar){inset-inline-end:calc(0px - var(--editor-toolbar-vert-offset));inset-block-start:0}[dir=rtl] :is(:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="90"],[data-main-rotation="90"] [data-editor-rotation="0"],[data-main-rotation="180"] [data-editor-rotation="270"],[data-main-rotation="270"] [data-editor-rotation="180"])) .editToolbar){inset-inline-end:calc(100% + var(--editor-toolbar-vert-offset));inset-block-start:0}:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="180"],[data-main-rotation="90"] [data-editor-rotation="90"],[data-main-rotation="180"] [data-editor-rotation="0"],[data-main-rotation="270"] [data-editor-rotation="270"])) .editToolbar{rotate:180deg;inset-inline-end:100%;inset-block-start:calc(0pc - var(--editor-toolbar-vert-offset))}:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="270"],[data-main-rotation="90"] [data-editor-rotation="180"],[data-main-rotation="180"] [data-editor-rotation="90"],[data-main-rotation="270"] [data-editor-rotation="0"])) .editToolbar{rotate:90deg}[dir=ltr] :is(:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="270"],[data-main-rotation="90"] [data-editor-rotation="180"],[data-main-rotation="180"] [data-editor-rotation="90"],[data-main-rotation="270"] [data-editor-rotation="0"])) .editToolbar){inset-inline-end:calc(100% + var(--editor-toolbar-vert-offset));inset-block-start:100%}[dir=rtl] :is(:is(.annotationEditorLayer :is([data-main-rotation="0"] [data-editor-rotation="270"],[data-main-rotation="90"] [data-editor-rotation="180"],[data-main-rotation="180"] [data-editor-rotation="90"],[data-main-rotation="270"] [data-editor-rotation="0"])) .editToolbar){inset-inline-start:calc(0px - var(--editor-toolbar-vert-offset));inset-block-start:0}.dialog.altText::backdrop{-webkit-mask:url(#alttext-manager-mask);mask:url(#alttext-manager-mask)}.dialog.altText.positioned,.pdfPresentationMode .spread{margin:0}.dialog.altText #altTextContainer{width:300px;height:-moz-fit-content;height:fit-content;display:inline-flex;flex-direction:column;align-items:flex-start;gap:16px}:is(.dialog.altText #altTextContainer) #overallDescription{display:flex;flex-direction:column;align-items:flex-start;gap:4px;align-self:stretch}:is(:is(.dialog.altText #altTextContainer) #overallDescription) span{align-self:stretch}:is(:is(.dialog.altText #altTextContainer) #overallDescription) .title{font-size:13px;font-style:normal;font-weight:590}:is(.dialog.altText #altTextContainer) #addDescription{display:flex;flex-direction:column;align-items:stretch;gap:8px}:is(:is(.dialog.altText #altTextContainer) #addDescription) .descriptionArea{flex:1;padding-inline:24px 10px}:is(:is(:is(.dialog.altText #altTextContainer) #addDescription) .descriptionArea) textarea{width:100%;min-height:75px}:is(.dialog.altText #altTextContainer) #buttons{display:flex;justify-content:flex-end;align-items:flex-start;gap:8px;align-self:stretch}.dialog.newAltText{--new-alt-text-ai-disclaimer-icon:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNyAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zLjQ5MDczIDEuMzAxNUwzLjMwODczIDIuMTUwNUMzLjI5MzQ5IDIuMjIyNDYgMy4yNTc2OSAyLjI4ODQ0IDMuMjA1NjggMi4zNDA0NUMzLjE1MzY4IDIuMzkyNDYgMy4wODc2OSAyLjQyODI2IDMuMDE1NzMgMi40NDM1TDIuMTY2NzMgMi42MjU1QzEuNzY0NzMgMi43MTI1IDEuNzY0NzMgMy4yODY1IDIuMTY2NzMgMy4zNzI1TDMuMDE1NzMgMy41NTU1QzMuMDg3NjkgMy41NzA3NCAzLjE1MzY4IDMuNjA2NTQgMy4yMDU2OCAzLjY1ODU1QzMuMjU3NjkgMy43MTA1NiAzLjI5MzQ5IDMuNzc2NTQgMy4zMDg3MyAzLjg0ODVMMy40OTA3MyA0LjY5NzVDMy41Nzc3MyA1LjA5OTUgNC4xNTE3MyA1LjA5OTUgNC4yMzc3MyA0LjY5NzVMNC40MjA3MyAzLjg0ODVDNC40MzU5OCAzLjc3NjU0IDQuNDcxNzcgMy43MTA1NiA0LjUyMzc4IDMuNjU4NTVDNC41NzU3OSAzLjYwNjU0IDQuNjQxNzggMy41NzA3NCA0LjcxMzczIDMuNTU1NUw1LjU2MTczIDMuMzcyNUM1Ljk2MzczIDMuMjg1NSA1Ljk2MzczIDIuNzExNSA1LjU2MTczIDIuNjI1NUw0LjcxMjczIDIuNDQzNUM0LjY0MDgzIDIuNDI4MTQgNC41NzQ5MSAyLjM5MjMgNC41MjI5MiAyLjM0MDMxQzQuNDcwOTMgMi4yODgzMiA0LjQzNTA5IDIuMjIyNCA0LjQxOTczIDIuMTUwNUw0LjIzNzczIDEuMzAxNUM0LjE1MDczIDAuODk5NSAzLjU3NjczIDAuODk5NSAzLjQ5MDczIDEuMzAxNVpNMTAuODY0NyAxMy45OTk1QzEwLjQ4NTMgMTQuMDA1NiAxMC4xMTU4IDEzLjg3ODIgOS44MjA2NyAxMy42Mzk3QzkuNTI1NTMgMTMuNDAxMyA5LjMyMzQ3IDEzLjA2NjcgOS4yNDk3MyAxMi42OTQ1TDguODkyNzMgMTEuMDI3NUM4LjgzNjc2IDEwLjc2ODcgOC43MDczOCAxMC41MzE2IDguNTIwMDkgMTAuMzQ0NUM4LjMzMjggMTAuMTU3NCA4LjA5NTU0IDEwLjAyODIgNy44MzY3MyA5Ljk3MjVMNi4xNjk3MyA5LjYxNTVDNS4zODg3MyA5LjQ0NjUgNC44NjQ3MyA4Ljc5NzUgNC44NjQ3MyA3Ljk5OTVDNC44NjQ3MyA3LjIwMTUgNS4zODg3MyA2LjU1MjUgNi4xNjk3MyA2LjM4NDVMNy44MzY3MyA2LjAyNzVDOC4wOTU1MSA1Ljk3MTM1IDguMzMyNjcgNS44NDE5MyA4LjUxOTkyIDUuNjU0NjhDOC43MDcxNiA1LjQ2NzQ0IDguODM2NTggNS4yMzAyOCA4Ljg5MjczIDQuOTcxNUw5LjI1MDczIDMuMzA0NUM5LjQxNzczIDIuNTIzNSAxMC4wNjY3IDEuOTk5NSAxMC44NjQ3IDEuOTk5NUMxMS42NjI3IDEuOTk5NSAxMi4zMTE3IDIuNTIzNSAxMi40Nzk3IDMuMzA0NUwxMi44MzY3IDQuOTcxNUMxMi45NTA3IDUuNDk5NSAxMy4zNjQ3IDUuOTEzNSAxMy44OTI3IDYuMDI2NUwxNS41NTk3IDYuMzgzNUMxNi4zNDA3IDYuNTUyNSAxNi44NjQ3IDcuMjAxNSAxNi44NjQ3IDcuOTk5NUMxNi44NjQ3IDguNzk3NSAxNi4zNDA3IDkuNDQ2NSAxNS41NTk3IDkuNjE0NUwxMy44OTI3IDkuOTcxNUMxMy42MzM3IDEwLjAyNzUgMTMuMzk2MyAxMC4xNTcgMTMuMjA5IDEwLjM0NDVDMTMuMDIxNyAxMC41MzE5IDEyLjg5MjUgMTAuNzY5NCAxMi44MzY3IDExLjAyODVMMTIuNDc4NyAxMi42OTQ1QzEyLjQwNTQgMTMuMDY2NyAxMi4yMDM2IDEzLjQwMTQgMTEuOTA4NiAxMy42Mzk5QzExLjYxMzUgMTMuODc4NCAxMS4yNDQxIDE0LjAwNTcgMTAuODY0NyAxMy45OTk1Wk0xMC44NjQ3IDMuMjQ5NUMxMC43NjY3IDMuMjQ5NSAxMC41MzM3IDMuMjc5NSAxMC40NzI3IDMuNTY1NUwxMC4xMTQ3IDUuMjMzNUMxMC4wMDgxIDUuNzI3NzcgOS43NjExNiA2LjE4MDgyIDkuNDAzNjEgNi41MzgzN0M5LjA0NjA2IDYuODk1OTMgOC41OTMwMSA3LjE0MjgzIDguMDk4NzMgNy4yNDk1TDYuNDMxNzMgNy42MDY1QzYuMTQ1NzMgNy42Njg1IDYuMTE0NzMgNy45MDE1IDYuMTE0NzMgNy45OTk1QzYuMTE0NzMgOC4wOTc1IDYuMTQ1NzMgOC4zMzA1IDYuNDMxNzMgOC4zOTI1TDguMDk4NzMgOC43NDk1QzguNTkzMDEgOC44NTYxNyA5LjA0NjA2IDkuMTAzMDcgOS40MDM2MSA5LjQ2MDYyQzkuNzYxMTYgOS44MTgxNyAxMC4wMDgxIDEwLjI3MTIgMTAuMTE0NyAxMC43NjU1TDEwLjQ3MjcgMTIuNDMzNUMxMC41MzM3IDEyLjcxOTUgMTAuNzY2NyAxMi43NDk1IDEwLjg2NDcgMTIuNzQ5NUMxMC45NjI3IDEyLjc0OTUgMTEuMTk1NyAxMi43MTk1IDExLjI1NjcgMTIuNDMzNUwxMS42MTQ3IDEwLjc2NjVDMTEuNzIxMiAxMC4yNzIgMTEuOTY4MSA5LjgxODc4IDEyLjMyNTYgOS40NjEwM0MxMi42ODMyIDkuMTAzMjkgMTMuMTM2MyA4Ljg1NjI0IDEzLjYzMDcgOC43NDk1TDE1LjI5NzcgOC4zOTI1QzE1LjU4MzcgOC4zMzA1IDE1LjYxNDcgOC4wOTc1IDE1LjYxNDcgNy45OTk1QzE1LjYxNDcgNy45MDE1IDE1LjU4MzcgNy42Njg1IDE1LjI5NzcgNy42MDY1TDEzLjYzMDcgNy4yNDk1QzEzLjEzNjUgNy4xNDI4MyAxMi42ODM0IDYuODk1OTMgMTIuMzI1OSA2LjUzODM3QzExLjk2ODMgNi4xODA4MiAxMS43MjE0IDUuNzI3NzcgMTEuNjE0NyA1LjIzMzVMMTEuMjU2NyAzLjU2NTVDMTEuMTk1NyAzLjI3OTUgMTAuOTYyNyAzLjI0OTUgMTAuODY0NyAzLjI0OTVaTTMuMzA4NzMgMTIuMTUwNUwzLjQ5MDczIDExLjMwMTVDMy41NzY3MyAxMC44OTk1IDQuMTUwNzMgMTAuODk5NSA0LjIzNzczIDExLjMwMTVMNC40MTk3MyAxMi4xNTA1QzQuNDM1MDkgMTIuMjIyNCA0LjQ3MDkzIDEyLjI4ODMgNC41MjI5MiAxMi4zNDAzQzQuNTc0OTEgMTIuMzkyMyA0LjY0MDgzIDEyLjQyODEgNC43MTI3MyAxMi40NDM1TDUuNTYxNzMgMTIuNjI1NUM1Ljk2MzczIDEyLjcxMTUgNS45NjM3MyAxMy4yODU1IDUuNTYxNzMgMTMuMzcyNUw0LjcxMjczIDEzLjU1NDVDNC42NDA4MyAxMy41Njk5IDQuNTc0OTEgMTMuNjA1NyA0LjUyMjkyIDEzLjY1NzdDNC40NzA5MyAxMy43MDk3IDQuNDM1MDkgMTMuNzc1NiA0LjQxOTczIDEzLjg0NzVMNC4yMzc3MyAxNC42OTY1QzQuMTUxNzMgMTUuMDk4NSAzLjU3NzczIDE1LjA5ODUgMy40OTA3MyAxNC42OTY1TDMuMzA4NzMgMTMuODQ3NUMzLjI5MzM3IDEzLjc3NTYgMy4yNTc1NCAxMy43MDk3IDMuMjA1NTUgMTMuNjU3N0MzLjE1MzU2IDEzLjYwNTcgMy4wODc2NCAxMy41Njk5IDMuMDE1NzMgMTMuNTU0NUwyLjE2NjczIDEzLjM3MjVDMS43NjQ3MyAxMy4yODY1IDEuNzY0NzMgMTIuNzEyNSAyLjE2NjczIDEyLjYyNTVMMy4wMTU3MyAxMi40NDM1QzMuMDg3NjkgMTIuNDI4MyAzLjE1MzY4IDEyLjM5MjUgMy4yMDU2OCAxMi4zNDA1QzMuMjU3NjkgMTIuMjg4NCAzLjI5MzQ5IDEyLjIyMjUgMy4zMDg3MyAxMi4xNTA1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==);--new-alt-text-spinner-icon:url(data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE2IDE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgogIDxzdHlsZT4KICAgIEBtZWRpYSBub3QgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb24pIHsKICAgICAgQGtleWZyYW1lcyBsb2FkaW5nUm90YXRlIHsKICAgICAgICBmcm9tIHsgcm90YXRlOiAwOyB9IHRvIHsgcm90YXRlOiAzNjBkZWcgfQogICAgICB9CiAgICAgICNjaXJjbGUtYXJyb3dzIHsKICAgICAgICBhbmltYXRpb246IGxvYWRpbmdSb3RhdGUgMS44cyBsaW5lYXIgaW5maW5pdGU7CiAgICAgICAgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsKICAgICAgfQogICAgICAjaG91cmdsYXNzIHsKICAgICAgICBkaXNwbGF5OiBub25lOwogICAgICB9CiAgICB9CgogICAgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uKSB7CiAgICAgICNjaXJjbGUtYXJyb3dzIHsKICAgICAgICBkaXNwbGF5OiBub25lOwogICAgICB9CiAgICB9CiAgPC9zdHlsZT4KICA8cGF0aCBpZD0iY2lyY2xlLWFycm93cyIgZD0iTTkgNS41MjhjMCAuNDIuNTA4LjYzLjgwNC4zMzNsMi41MjgtMi41MjhhLjQ3LjQ3IDAgMCAwIDAtLjY2Nkw5LjgwNS4xNEEuNDcxLjQ3MSAwIDAgMCA5IC40NzJ2MS44NjZBNS43NTYgNS43NTYgMCAwIDAgMi4yNSA4YzAgLjk0Mi4yMzIgMS44My42MzUgMi42MTVsMS4xNDMtMS4xNDNBNC4yMDggNC4yMDggMCAwIDEgMy43NSA4IDQuMjU0IDQuMjU0IDAgMCAxIDggMy43NWMuMzQ1IDAgLjY4LjA0MiAxIC4xMjJ2MS42NTZ6TTcgMTAuNDcydjEuNjU2Yy4zMi4wOC42NTUuMTIyIDEgLjEyMkE0LjI1NCA0LjI1NCAwIDAgMCAxMi4yNSA4YzAtLjUyLS4xMDctMS4wMTMtLjI3OS0xLjQ3NGwxLjE0My0xLjE0M2MuNDA0Ljc4Ni42MzYgMS42NzQuNjM2IDIuNjE3QTUuNzU2IDUuNzU2IDAgMCAxIDcgMTMuNjYydjEuODY2YS40Ny40NyAwIDAgMS0uODA0LjMzM2wtMi41MjgtMi41MjhhLjQ3LjQ3IDAgMCAxIDAtLjY2NmwyLjUyOC0yLjUyOGEuNDcuNDcgMCAwIDEgLjgwNC4zMzN6Ii8+CiAgPGcgaWQ9ImhvdXJnbGFzcyI+CiAgICA8cGF0aCBkPSJNMTMsMSBDMTMuNTUyMjg0NywxIDE0LDEuNDQ3NzE1MjUgMTQsMiBDMTQsMi41NTIyODQ3NSAxMy41NTIyODQ3LDMgMTMsMyBMMTIuOTg1NDIxNywyLjk5OTkwODAxIEMxMi45OTUwODE3LDMuMTY0OTU4ODUgMTMsMy4zMzE3MzI3NCAxMywzLjUgQzEzLDUuMjQ2Nzk4ODUgMTAuOTg3NzMxOCw2LjAxMDkwNDk1IDEwLjk4NzczMTgsOC4wMDE3NTM4IEMxMC45ODc3MzE4LDkuOTkyNjAyNjQgMTMsMTAuNzUzNjkyMiAxMywxMi41IEMxMywxMi42Njg2MDc5IDEyLjk5NTA2MTcsMTIuODM1NzE2MyAxMi45ODUzNjMsMTMuMDAxMDk0MyBMMTMsMTMgQzEzLjU1MjI4NDcsMTMgMTQsMTMuNDQ3NzE1MyAxNCwxNCBDMTQsMTQuNTUyMjg0NyAxMy41NTIyODQ3LDE1IDEzLDE1IEwzLDE1IEMyLjQ0NzcxNTI1LDE1IDIsMTQuNTUyMjg0NyAyLDE0IEMyLDEzLjQ0NzcxNTMgMi40NDc3MTUyNSwxMyAzLDEzIEwzLjAxNDYzNzA0LDEzLjAwMTA5NDMgQzMuMDA0OTM4MjcsMTIuODM1NzE2MyAzLDEyLjY2ODYwNzkgMywxMi41IEMzLDEwLjc1MzY5MjIgNC45ODc3MzE4LDkuOTkyNjAyNjQgNSw4LjAwMTc1MzggQzUuMDEyMjY4Miw2LjAxMDkwNDk1IDMsNS4yNDY3OTg4NSAzLDMuNSBDMywzLjMzMTczMjc0IDMuMDA0OTE4MzQsMy4xNjQ5NTg4NSAzLjAxNDU3ODMyLDIuOTk5OTA4MDEgTDMsMyBDMi40NDc3MTUyNSwzIDIsMi41NTIyODQ3NSAyLDIgQzIsMS40NDc3MTUyNSAyLjQ0NzcxNTI1LDEgMywxIEwxMywxIFogTTEwLjk4NywzIEw1LjAxMiwzIEw1LjAwMzA4OTE0LDMuMjQ4MTU3MTIgQzUuMDAxMDM3MDcsMy4zMzE2MzM2OCA1LDMuNDE1NTk0OCA1LDMuNSBDNSw1LjM2MTI1MDY5IDYuOTkxNTM2NDYsNi4wMTc3NDA4OSA2Ljk5MTUzNjQ2LDguMDAxNzUzOCBDNi45OTE1MzY0Niw5Ljk4NTc2NjcxIDUsMTAuNjM5MzczNyA1LDEyLjUgTDUuMDAzMDc3NDYsMTIuNzUxMzY3NiBMNS4wMTIyMjIwMSwxMi45OTk4MzkyIEw1LjYwMTkxNzExLDEyLjk5ODgzNDQgTDYuMDQyNTEzOCwxMi4yOTU5ODI2IEM3LjAyMzYyNzMxLDEwLjc2NTMyNzUgNy42NzYxMjI3MSwxMCA4LDEwIEM4LjM3MDE0NTQ3LDEwIDkuMTY5NTA2NDQsMTAuOTk5NjExNSAxMC4zOTgwODI5LDEyLjk5ODgzNDQgTDEwLjk4Nzc3OCwxMi45OTk4MzkyIEMxMC45OTU4Njc0LDEyLjgzNTIxMDQgMTEsMTIuNjY4NDkgMTEsMTIuNSBDMTEsMTAuNjM5MzczNyA4Ljk4Njg5Nzc5LDEwLjAxNDczODEgOC45ODY4OTc3OSw4LjAwMTc1MzggQzguOTg2ODk3NzksNS45ODg3Njk1MyAxMSw1LjM2MTI1MDY5IDExLDMuNSBMMTAuOTk2OTEwOSwzLjI0ODE1NzEyIEwxMC45ODcsMyBaIi8+CiAgICA8cGF0aCBkPSJNNiw0IEwxMCw0IEM4Ljk1MTY2MDE2LDYgOC4yODQ5OTM0OSw3IDgsNyBDNy43MTUwMDY1MSw3IDcuMDQ4MzM5ODQsNiA2LDQgWiIvPgogIDwvZz4KPC9zdmc+Cg==);--preview-image-bg-color:#f0f0f4;--preview-image-border:none;width:80%;max-width:570px;min-width:300px;padding:0}:where(html.is-dark) .dialog.newAltText{--preview-image-bg-color:#2b2a33}.dialog.newAltText.aiInstalling #newAltTextCreateAutomatically,.dialog.newAltText.error #newAltTextNotNow,.dialog.newAltText.noAi #newAltTextCreateAutomatically,.dialog.newAltText.noAi #newAltTextDisclaimer,.dialog.newAltText:not(.error) #newAltTextError,.hidden,.visibleMediumView,[hidden]{display:none!important}.dialog.newAltText.aiInstalling #newAltTextDownloadModel{display:flex!important}.dialog.newAltText.error #newAltTextCancel{display:inline-block!important}.dialog.newAltText #newAltTextContainer{display:flex;width:auto;padding:16px;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:12px;flex:0 1 auto;line-height:normal}:is(.dialog.newAltText #newAltTextContainer) #mainContent{display:flex;justify-content:flex-end;align-items:flex-start;gap:12px;align-self:stretch;flex:1 1 auto}:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionAndSettings{display:flex;flex-direction:column;align-items:flex-start;gap:16px;flex:1 0 0;align-self:stretch}:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction{display:flex;flex-direction:column;align-items:flex-start;gap:8px;align-self:stretch;flex:1 1 auto}:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer{width:100%;height:70px;position:relative}:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) textarea{width:100%;height:100%;padding:8px}:is(:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) textarea)::-moz-placeholder{color:var(--text-secondary-color)}:is(:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) textarea)::placeholder{color:var(--text-secondary-color)}:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) .altTextSpinner{display:none;position:absolute;width:16px;height:16px;inset-inline-start:8px;inset-block-start:8px;-webkit-mask-size:cover;mask-size:cover;background-color:var(--text-secondary-color);pointer-events:none}.loading:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) textarea::-moz-placeholder{color:transparent}.loading:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) textarea::placeholder{color:transparent}.loading:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescriptionContainer) .altTextSpinner{display:inline-block;-webkit-mask-image:var(--new-alt-text-spinner-icon);mask-image:var(--new-alt-text-spinner-icon)}:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDescription{font-size:11px}:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDisclaimer{display:flex;flex-direction:row;align-items:flex-start;gap:4px;font-size:11px}:is(:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #descriptionInstruction) #newAltTextDisclaimer)::before{content:"";display:inline-block;width:17px;height:16px;-webkit-mask-image:var(--new-alt-text-ai-disclaimer-icon);mask-image:var(--new-alt-text-ai-disclaimer-icon);-webkit-mask-size:cover;mask-size:cover;background-color:var(--text-secondary-color);flex:1 0 auto}:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #newAltTextDownloadModel{display:flex;align-items:center;gap:4px;align-self:stretch}:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #newAltTextDownloadModel)::before{content:"";display:inline-block;width:16px;height:16px;-webkit-mask-image:var(--new-alt-text-spinner-icon);mask-image:var(--new-alt-text-spinner-icon);-webkit-mask-size:cover;mask-size:cover;background-color:var(--text-secondary-color)}:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #newAltTextImagePreview{width:180px;aspect-ratio:1;display:flex;justify-content:center;align-items:center;flex:0 0 auto;background-color:var(--preview-image-bg-color);border:var(--preview-image-border)}:is(:is(:is(.dialog.newAltText #newAltTextContainer) #mainContent) #newAltTextImagePreview)>canvas{max-width:100%;max-height:100%}.colorPicker{--hover-outline-color:#0250bb;--selected-outline-color:#0060df;--swatch-border-color:#cfcfd8}:where(html.is-dark) .colorPicker{--hover-outline-color:#80ebff;--selected-outline-color:#aaf2ff;--swatch-border-color:#52525e}.colorPicker .swatch{width:16px;height:16px;border:1px solid var(--swatch-border-color);border-radius:100%;outline-offset:2px;forced-color-adjust:none}.colorPicker button:is(:hover,.selected)>.swatch{border:none}.annotationEditorLayer[data-main-rotation="0"] .highlightEditor:not(.free)>.editToolbar{rotate:0deg}.annotationEditorLayer[data-main-rotation="90"] .highlightEditor:not(.free)>.editToolbar{rotate:270deg}.annotationEditorLayer[data-main-rotation="180"] .highlightEditor:not(.free)>.editToolbar{rotate:180deg}.annotationEditorLayer[data-main-rotation="270"] .highlightEditor:not(.free)>.editToolbar{rotate:90deg}.annotationEditorLayer .highlightEditor{position:absolute;background:0 0;z-index:1;cursor:auto;max-width:100%;max-height:100%;border:none;outline:0;pointer-events:none;transform-origin:0 0}#layersView .treeItem>a *,.treeItem>a{cursor:pointer}:is(.annotationEditorLayer .highlightEditor):not(.free){transform:none}:is(.annotationEditorLayer .highlightEditor) .internal{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:auto}.disabled:is(.annotationEditorLayer .highlightEditor) .internal{pointer-events:none}.selectedEditor:is(.annotationEditorLayer .highlightEditor) .internal{cursor:pointer}:is(.annotationEditorLayer .highlightEditor) .editToolbar{--editor-toolbar-colorpicker-arrow-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguMjMzMzYgMTAuNDY2NEwxMS44NDc0IDYuODUzMzlDMTEuODk0IDYuODA3MSAxMS45MzEgNi43NTIwMyAxMS45NTYzIDYuNjkxMzZDMTEuOTgxNiA2LjYzMDY5IDExLjk5NDYgNi41NjU2MiAxMS45OTQ2IDYuNDk5ODlDMTEuOTk0NiA2LjQzNDE3IDExLjk4MTYgNi4zNjkxIDExLjk1NjMgNi4zMDg0M0MxMS45MzEgNi4yNDc3NiAxMS44OTQgNi4xOTI2OSAxMS44NDc0IDYuMTQ2MzlDMTEuNzUzNiA2LjA1MjY2IDExLjYyNjQgNiAxMS40OTM5IDZDMTEuMzYxMyA2IDExLjIzNDEgNi4wNTI2NiAxMS4xNDA0IDYuMTQ2MzlMNy45OTIzNiA5LjI5MzM5TDQuODQ3MzYgNi4xNDczOUM0Ljc1MzA1IDYuMDU2MzEgNC42MjY3NSA2LjAwNTkyIDQuNDk1NjYgNi4wMDcwNkM0LjM2NDU2IDYuMDA4MiA0LjIzOTE1IDYuMDYwNzggNC4xNDY0NSA2LjE1MzQ4QzQuMDUzNzQgNi4yNDYxOSA0LjAwMTE2IDYuMzcxNTkgNC4wMDAwMiA2LjUwMjY5QzMuOTk4ODggNi42MzM3OSA0LjA0OTI4IDYuNzYwMDkgNC4xNDAzNiA2Ljg1NDM5TDcuNzUyMzYgMTAuNDY3NEw4LjIzMzM2IDEwLjQ2NjRaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K);transform-origin:center!important}:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker{position:relative;width:auto;display:flex;justify-content:center;align-items:center;gap:4px;padding:4px}:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker)::after{content:"";-webkit-mask-image:var(--editor-toolbar-colorpicker-arrow-image);mask-image:var(--editor-toolbar-colorpicker-arrow-image);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;display:inline-block;background-color:var(--editor-toolbar-fg-color);width:12px;height:12px}:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker):hover::after{background-color:var(--editor-toolbar-hover-fg-color)}:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker):has(.dropdown:not(.hidden)){background-color:var(--editor-toolbar-hover-bg-color)}:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker):has(.dropdown:not(.hidden))::after{scale:-1}:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker) .dropdown{position:absolute;display:flex;justify-content:center;align-items:center;flex-direction:column;gap:11px;padding-block:8px;border-radius:6px;background-color:var(--editor-toolbar-bg-color);border:1px solid var(--editor-toolbar-border-color);box-shadow:var(--editor-toolbar-shadow);inset-block-start:calc(100% + 4px);width:calc(100% + 2 * var(--editor-toolbar-padding))}:is(:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker) .dropdown) button{width:100%;height:auto;border:none;cursor:pointer;display:flex;justify-content:center;align-items:center;background:0 0}:is(:is(:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker) .dropdown) button):is(:active,:focus-visible){outline:0}:is(:is(:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker) .dropdown) button)>.swatch{outline-offset:2px}[aria-selected=true]:is(:is(:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker) .dropdown) button)>.swatch{outline:2px solid var(--selected-outline-color)}:is(:is(:is(:is(:is(:is(.annotationEditorLayer .highlightEditor) .editToolbar) .buttons) .colorPicker) .dropdown) button):is(:hover,:active,:focus-visible)>.swatch{outline:2px solid var(--hover-outline-color)}.editorParamsToolbar:has(#highlightParamsToolbarContainer){padding:unset}#highlightParamsToolbarContainer{gap:16px;padding-inline:10px;padding-block-end:12px}#highlightParamsToolbarContainer .colorPicker{display:flex;flex-direction:column;gap:8px}:is(#highlightParamsToolbarContainer .colorPicker) .dropdown{display:flex;justify-content:space-between;align-items:center;flex-direction:row;height:auto}:is(:is(#highlightParamsToolbarContainer .colorPicker) .dropdown) button{width:auto;height:auto;border:none;cursor:pointer;display:flex;justify-content:center;align-items:center;background:0 0;flex:0 0 auto;padding:0}:is(:is(:is(#highlightParamsToolbarContainer .colorPicker) .dropdown) button) .swatch{width:24px;height:24px}:is(:is(:is(#highlightParamsToolbarContainer .colorPicker) .dropdown) button):is(:active,:focus-visible){outline:0}[aria-selected=true]:is(:is(:is(#highlightParamsToolbarContainer .colorPicker) .dropdown) button)>.swatch{outline:2px solid var(--selected-outline-color)}:is(:is(:is(#highlightParamsToolbarContainer .colorPicker) .dropdown) button):is(:hover,:active,:focus-visible)>.swatch{outline:2px solid var(--hover-outline-color)}#highlightParamsToolbarContainer #editorHighlightThickness{display:flex;flex-direction:column;align-items:center;gap:4px;align-self:stretch}:is(#highlightParamsToolbarContainer #editorHighlightThickness) .editorParamsLabel{height:auto;align-self:stretch}:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker{display:flex;justify-content:space-between;align-items:center;align-self:stretch;--example-color:#bfbfc9}:where(html.is-dark) :is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker{--example-color:#80808e}:is(:is(:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker) > .editorParamsSlider[disabled]){opacity:.4}:is(:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker)::after,:is(:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker)::before{content:"";width:8px;aspect-ratio:1;display:block;border-radius:100%;background-color:var(--example-color)}:is(:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker)::after{width:24px}:is(:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker) .editorParamsSlider{width:unset;height:14px}#highlightParamsToolbarContainer #editorHighlightVisibility{display:flex;flex-direction:column;align-items:flex-start;gap:8px;align-self:stretch}:is(#highlightParamsToolbarContainer #editorHighlightVisibility) .divider{--divider-color:#d7d7db;margin-block:4px;width:100%;height:1px;background-color:var(--divider-color)}.doorHanger,.doorHangerRight,dialog{background-color:var(--doorhanger-bg-color)}:where(html.is-dark) :is(#highlightParamsToolbarContainer #editorHighlightVisibility) .divider{--divider-color:#8f8f9d}:is(#highlightParamsToolbarContainer #editorHighlightVisibility) .toggler{display:flex;justify-content:space-between;align-items:center;align-self:stretch}#altTextSettingsDialog{padding:16px}#altTextSettingsDialog #altTextSettingsContainer{display:flex;width:573px;flex-direction:column;gap:16px}:is(#altTextSettingsDialog #altTextSettingsContainer) .mainContainer{gap:16px}:is(#altTextSettingsDialog #altTextSettingsContainer) .description{color:var(--text-secondary-color)}:is(#altTextSettingsDialog #altTextSettingsContainer) #aiModelSettings{display:flex;flex-direction:column;gap:12px}:is(:is(#altTextSettingsDialog #altTextSettingsContainer) #aiModelSettings) button{width:-moz-fit-content;width:fit-content}.download:is(:is(#altTextSettingsDialog #altTextSettingsContainer) #aiModelSettings) #deleteModelButton{display:none}:is(:is(#altTextSettingsDialog #altTextSettingsContainer) #aiModelSettings):not(.download) #downloadModelButton{display:none}:is(#altTextSettingsDialog #altTextSettingsContainer) #altTextEditor,:is(#altTextSettingsDialog #altTextSettingsContainer) #automaticAltText{display:flex;flex-direction:column;gap:8px}:is(#altTextSettingsDialog #altTextSettingsContainer) #aiModelSettings,:is(#altTextSettingsDialog #altTextSettingsContainer) #createModelDescription,:is(#altTextSettingsDialog #altTextSettingsContainer) #showAltTextDialogDescription{padding-inline-start:40px}:is(#altTextSettingsDialog #altTextSettingsContainer) #automaticSettings{display:flex;flex-direction:column;gap:16px}#hiddenCopyElement,.hiddenCanvasElement{position:absolute;top:0;left:0;width:0;height:0;display:none}#findbar>*,#toolbarContainer,#toolbarSidebar{height:var(--toolbar-height)}.pdfViewer{--scale-factor:1;--page-bg-color:unset;padding-bottom:var(--pdfViewer-padding-bottom);--hcm-highlight-filter:none;--hcm-highlight-selected-filter:none}.pdfViewer.copyAll{cursor:wait}.pdfViewer .canvasWrapper{overflow:hidden;width:100%;height:100%}:is(.pdfViewer .canvasWrapper) canvas{margin:0;display:block;width:100%;height:100%}[hidden]:is(:is(.pdfViewer .canvasWrapper) canvas){display:none}[zooming]:is(:is(.pdfViewer .canvasWrapper) canvas){width:100%;height:100%}:is(:is(.pdfViewer .canvasWrapper) canvas) .structTree{contain:strict}.pdfViewer .page{--scale-round-x:1px;--scale-round-y:1px;direction:ltr;width:816px;height:1056px;margin:var(--page-margin);position:relative;overflow:visible;border:var(--page-border);background-clip:content-box;background-color:var(--page-bg-color,rgb(255 255 255))}.pdfViewer .dummyPage{position:relative;width:0;height:var(--viewer-container-height)}.pdfViewer.noUserSelect{-webkit-user-select:none;-moz-user-select:none;user-select:none}.pdfViewer.removePageBorders .page{margin:0 auto 10px;border:none}.pdfViewer:is(.scrollHorizontal,.scrollWrapped),.spread{margin-inline:3.5px;text-align:center}.pdfViewer.removePageBorders,.pdfViewer:is(.scrollHorizontal,.scrollWrapped) .spread{margin-inline:0}.pdfViewer:is(.scrollHorizontal,.scrollWrapped) :is(.page,.spread),.spread :is(.page,.dummyPage){display:inline-block;vertical-align:middle}.pdfViewer:is(.scrollHorizontal,.scrollWrapped) .page,.spread .page{margin-inline:var(--spreadHorizontalWrapped-margin-LR)}.pdfViewer.removePageBorders .spread .page,.pdfViewer.removePageBorders:is(.scrollHorizontal,.scrollWrapped) .page{margin-inline:5px}.pdfViewer .page.loadingIcon::after{position:absolute;top:0;left:0;content:"";width:100%;height:100%;background:url("images/loading-icon.gif") center no-repeat;display:none;transition-property:display;transition-delay:var(--loading-icon-delay);z-index:5;contain:strict}.pdfViewer .page:not(.loading)::after{transition-property:none;display:none}.pdfPresentationMode .pdfViewer{padding-bottom:0}.pdfPresentationMode .pdfViewer .page{margin:0 auto;border:2px solid transparent}[dir=rtl]:root{--dir-factor:-1;--inline-start:right;--inline-end:left}@media (prefers-color-scheme:dark){:where(html:not(.is-light)) .dialog{--dialog-bg-color:#1c1b22;--dialog-border-color:#1c1b22;--dialog-shadow:0 2px 14px 0 #15141a;--text-primary-color:#fbfbfe;--text-secondary-color:#cfcfd8;--focus-ring-color:#0df;--hover-filter:brightness(1.4);--link-fg-color:#0df;--link-hover-fg-color:#80ebff;--separator-color:#52525e;--textarea-bg-color:#42414d;--radio-bg-color:#2b2a33;--radio-checked-bg-color:#15141a;--radio-checked-border-color:#0df;--button-secondary-bg-color:#2b2a33;--button-primary-bg-color:#0df;--button-primary-fg-color:#15141a}:where(html:not(.is-light)) :is(.dialog .mainContainer) .messageBar{--message-bar-bg-color:#5a3100;--message-bar-fg-color:#fbfbfe;--message-bar-border-color:rgb(255 255 255 / 0.08);--message-bar-icon-color:#e49c49;--message-bar-close-button-hover-bg-color:rgb(251 251 254 / 0.14);--message-bar-close-button-active-bg-color:rgb(251 251 254 / 0.21);--message-bar-close-button-focus-bg-color:rgb(251 251 254 / 0.07)}:where(html:not(.is-light)) .toggle-button{--button-background-color:color-mix(in srgb, currentColor 7%, transparent);--button-background-color-hover:color-mix(
      in srgb,
      currentColor 14%,
      transparent
    );--button-background-color-active:color-mix(
      in srgb,
      currentColor 21%,
      transparent
    );--color-accent-primary:#0df;--color-accent-primary-hover:#80ebff;--color-accent-primary-active:#aaf2ff;--border-interactive-color:#bfbfc9;--color-canvas:#1c1b22}:where(html:not(.is-light)) :is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar{--editor-toolbar-bg-color:#2b2a33;--editor-toolbar-fg-color:#fbfbfe;--editor-toolbar-hover-bg-color:#52525e;--editor-toolbar-focus-outline-color:#0df;--alt-text-done-color:#54ffbd;--alt-text-warning-color:#80ebff}:where(html:not(.is-light)) .show:is(:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText) .tooltip){--alt-text-tooltip-bg:#1c1b22;--alt-text-tooltip-fg:#fbfbfe;--alt-text-tooltip-shadow:0px 2px 6px 0px #15141a}:where(html:not(.is-light)) :is(.annotationEditorLayer .stampEditor) .noAltTextBadge{--no-alt-text-badge-border-color:#52525e;--no-alt-text-badge-bg-color:#fbfbfe;--no-alt-text-badge-fg-color:#15141a}:where(html:not(.is-light)) .dialog.newAltText{--preview-image-bg-color:#2b2a33}:where(html:not(.is-light)) .colorPicker{--hover-outline-color:#80ebff;--selected-outline-color:#aaf2ff;--swatch-border-color:#52525e}:where(html:not(.is-light)) :is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker{--example-color:#80808e}:where(html:not(.is-light)) :is(#highlightParamsToolbarContainer #editorHighlightVisibility) .divider{--divider-color:#8f8f9d}:root:where(:not(.is-light)){--main-color:rgb(249 249 250);--body-bg-color:#525659;--progressBar-color:rgb(0 96 223);--progressBar-bg-color:rgb(40 40 43);--progressBar-blend-color:rgb(20 68 133);--scrollbar-color:rgb(121 121 123);--scrollbar-bg-color:rgb(35 35 39);--toolbar-icon-bg-color:rgb(255 255 255);--toolbar-icon-hover-bg-color:rgb(255 255 255);--sidebar-narrow-bg-color:rgb(42 42 46 / 0.9);--sidebar-toolbar-bg-color:#323639;--toolbar-bg-color:#323639;--toolbar-border-color:rgb(12 12 13);--button-hover-color:rgba(255, 255, 255, 0.08);--toggled-btn-color:rgb(255 255 255);--toggled-btn-bg-color:rgb(0 0 0 / 0.3);--toggled-hover-active-btn-color:rgb(0 0 0 / 0.4);--dropdown-btn-bg-color:rgba(0,0,0,0.5);--separator-color:rgb(0 0 0 / 0.3);--field-color:rgb(250 250 250);--field-bg-color:rgb(64 64 68);--field-border-color:rgb(115 115 115);--treeitem-color:rgb(255 255 255 / 0.8);--treeitem-bg-color:rgb(255 255 255 / 0.15);--treeitem-hover-color:rgb(255 255 255 / 0.9);--treeitem-selected-color:rgb(255 255 255 / 0.9);--treeitem-selected-bg-color:rgb(255 255 255 / 0.25);--thumbnail-hover-color:rgb(255 255 255 / 0.1);--thumbnail-selected-color:#8ab4f8;--doorhanger-bg-color:rgb(74 74 79);--doorhanger-border-color:rgb(39 39 43);--doorhanger-hover-color:rgb(249 249 250);--doorhanger-hover-bg-color:rgb(93 94 98);--doorhanger-separator-color:rgb(92 92 97);--dialog-button-bg-color:rgb(92 92 97);--dialog-button-hover-bg-color:rgb(115 115 115)}}:root:where(.is-dark){--main-color:rgb(249 249 250);--body-bg-color:rgb(42 42 46);--progressBar-color:rgb(0 96 223);--progressBar-bg-color:rgb(40 40 43);--progressBar-blend-color:rgb(20 68 133);--scrollbar-color:rgb(121 121 123);--scrollbar-bg-color:rgb(35 35 39);--toolbar-icon-bg-color:rgb(255 255 255);--toolbar-icon-hover-bg-color:rgb(255 255 255);--sidebar-narrow-bg-color:rgb(42 42 46 / 0.9);--sidebar-toolbar-bg-color:#323639;--toolbar-bg-color:#323639;--toolbar-border-color:rgb(12 12 13);--button-hover-color:rgba(255, 255, 255, 0.08);--toggled-btn-color:rgb(255 255 255);--toggled-btn-bg-color:rgb(0 0 0 / 0.3);--toggled-hover-active-btn-color:rgb(0 0 0 / 0.4);--dropdown-btn-bg-color:rgba(0,0,0,0.5);--separator-color:rgb(0 0 0 / 0.3);--field-color:rgb(250 250 250);--field-bg-color:rgb(64 64 68);--field-border-color:rgb(115 115 115);--treeitem-color:rgb(255 255 255 / 0.8);--treeitem-bg-color:rgb(255 255 255 / 0.15);--treeitem-hover-color:rgb(255 255 255 / 0.9);--treeitem-selected-color:rgb(255 255 255 / 0.9);--treeitem-selected-bg-color:rgb(255 255 255 / 0.25);--thumbnail-hover-color:rgb(255 255 255 / 0.1);--thumbnail-selected-color:#8ab4f8;--doorhanger-bg-color:rgb(74 74 79);--doorhanger-border-color:rgb(39 39 43);--doorhanger-hover-color:rgb(249 249 250);--doorhanger-hover-bg-color:rgb(93 94 98);--doorhanger-separator-color:rgb(92 92 97);--dialog-button-bg-color:rgb(92 92 97);--dialog-button-hover-bg-color:rgb(115 115 115)}@media screen and (forced-colors:active){.highlight:is(.canvasWrapper svg){--blend-mode:difference}:root{--outline-color:CanvasText;--outline-around-color:ButtonFace;--resizer-bg-color:ButtonText;--hover-outline-color:Highlight;--hover-outline-around-color:SelectedItemText;--pdfViewer-padding-bottom:9px;--page-margin:8px auto -1px;--page-border:1px solid CanvasText;--spreadHorizontalWrapped-margin-LR:3.5px;--button-hover-color:Highlight;--doorhanger-hover-bg-color:Highlight;--toolbar-icon-opacity:1;--toolbar-icon-bg-color:ButtonText;--toolbar-icon-hover-bg-color:ButtonFace;--toggled-hover-active-btn-color:ButtonText;--toggled-hover-btn-outline:2px solid ButtonBorder;--toolbar-border-color:CanvasText;--toolbar-border-bottom:1px solid var(--toolbar-border-color);--toolbar-box-shadow:none;--toggled-btn-color:HighlightText;--toggled-btn-bg-color:LinkText;--doorhanger-hover-color:ButtonFace;--doorhanger-border-color-whcm:1px solid ButtonText;--doorhanger-triangle-opacity-whcm:0;--dialog-button-border:1px solid Highlight;--dialog-button-hover-bg-color:Highlight;--dialog-button-hover-color:ButtonFace;--dropdown-btn-border:1px solid ButtonText;--field-border-color:ButtonText;--main-color:CanvasText;--separator-color:GrayText;--doorhanger-separator-color:GrayText;--toolbarSidebar-box-shadow:none;--toolbarSidebar-border-bottom:1px solid var(--toolbar-border-color)}:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar{--editor-toolbar-bg-color:ButtonFace;--editor-toolbar-fg-color:ButtonText;--editor-toolbar-border-color:ButtonText;--editor-toolbar-hover-border-color:AccentColor;--editor-toolbar-hover-bg-color:ButtonFace;--editor-toolbar-hover-fg-color:AccentColor;--editor-toolbar-hover-outline:2px solid var(--editor-toolbar-hover-border-color);--editor-toolbar-focus-outline-color:ButtonBorder;--editor-toolbar-shadow:none;--alt-text-done-color:var(--editor-toolbar-fg-color);--alt-text-warning-color:var(--editor-toolbar-fg-color);--alt-text-hover-done-color:var(--editor-toolbar-hover-fg-color);--alt-text-hover-warning-color:var(--editor-toolbar-hover-fg-color)}.show:is(:is(:is(:is(:is(.annotationEditorLayer :is(.freeTextEditor,.inkEditor,.stampEditor,.highlightEditor),.textLayer) .editToolbar) .buttons) .altText) .tooltip){--alt-text-tooltip-bg:Canvas;--alt-text-tooltip-fg:CanvasText;--alt-text-tooltip-border:CanvasText;--alt-text-tooltip-shadow:none}:is(.annotationEditorLayer .stampEditor) .noAltTextBadge{--no-alt-text-badge-border-color:ButtonText;--no-alt-text-badge-bg-color:ButtonFace;--no-alt-text-badge-fg-color:ButtonText}.dialog.newAltText{--preview-image-bg-color:ButtonFace;--preview-image-border:1px solid ButtonText}.colorPicker{--hover-outline-color:Highlight;--selected-outline-color:var(--hover-outline-color);--swatch-border-color:ButtonText}:is(#highlightParamsToolbarContainer #editorHighlightThickness) .thicknessPicker{--example-color:CanvasText}:is(#highlightParamsToolbarContainer #editorHighlightVisibility) .divider{--divider-color:CanvasText}.pdfViewer{--hcm-highlight-filter:invert(100%)}}@media screen and (prefers-reduced-motion:reduce){:root{--sidebar-transition-duration:0}}@keyframes progressIndeterminate{0%{transform:translateX(calc(-142px * var(--dir-factor)))}100%{transform:translateX(0)}}html[data-toolbar-density=compact]{--toolbar-height:30px}html[data-toolbar-density=touch]{--toolbar-height:44px}body{margin:0;background-color:var(--body-bg-color);scrollbar-color:var(--scrollbar-color) var(--scrollbar-bg-color)}body.wait::before{content:"";position:fixed;width:100%;height:100%;z-index:100000;cursor:wait}#viewerContainer.pdfPresentationMode:fullscreen{top:0;background-color:rgb(0 0 0);width:100%;height:100%;overflow:hidden;cursor:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.pdfPresentationMode:fullscreen section:not([data-internal-link]){pointer-events:none}.pdfPresentationMode:fullscreen .textLayer span{cursor:none}.dialogButton,.pdfPresentationMode.pdfPresentationModeControls .textLayer span,.pdfPresentationMode.pdfPresentationModeControls>*{cursor:default}#outerContainer{width:100%;height:100%;position:relative;margin:0}#sidebarContainer{position:absolute;inset-inline-start:calc(-1 * var(--sidebar-width));width:var(--sidebar-width);visibility:hidden;z-index:1;font:message-box;border-top:1px solid transparent;border-inline-end:var(--doorhanger-border-color-whcm);transition-property:inset-inline-start}#outerContainer:is(.sidebarMoving,.sidebarOpen) #sidebarContainer{visibility:visible}#mainContainer{position:absolute;inset:0;min-width:350px;margin:0;display:flex;flex-direction:column}#sidebarContent{overflow:auto;position:absolute;width:100%; background-color:var(--toolbar-bg-color);  box-shadow:rgba(0, 0, 0, 0.09) 0px -2px 8px, rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.3) 0px 1px 2px, rgba(0, 0, 0, 0.15) 0px 2px 6px;}#viewerContainer{overflow:auto;position:absolute;inset:var(--toolbar-height) 0 0;outline:0;z-index:0}#outerContainer.sidebarOpen #viewerContainer:not(.pdfPresentationMode){inset-inline-start:var(--sidebar-width);transition-property:inset-inline-start}#sidebarContainer :is(input,button,select){font:message-box}.toolbar{z-index:2}#toolbarSidebar{width:100%;background-color:var(--sidebar-toolbar-bg-color);box-shadow:var(--toolbarSidebar-box-shadow);border-bottom:var(--toolbarSidebar-border-bottom);padding:var(--toolbar-vertical-padding) var(--toolbar-horizontal-padding);justify-content:space-between}#toolbarSidebar #toolbarSidebarLeft{width:auto;height:100%}:is(#toolbarSidebar #toolbarSidebarLeft) #viewThumbnail::before{-webkit-mask-image:var(--toolbarButton-viewThumbnail-icon);mask-image:var(--toolbarButton-viewThumbnail-icon)}:is(#toolbarSidebar #toolbarSidebarLeft) #viewOutline::before{-webkit-mask-image:var(--toolbarButton-viewOutline-icon);mask-image:var(--toolbarButton-viewOutline-icon);transform:scaleX(var(--dir-factor))}:is(#toolbarSidebar #toolbarSidebarLeft) #viewAttachments::before{-webkit-mask-image:var(--toolbarButton-viewAttachments-icon);mask-image:var(--toolbarButton-viewAttachments-icon)}:is(#toolbarSidebar #toolbarSidebarLeft) #viewLayers::before{-webkit-mask-image:var(--toolbarButton-viewLayers-icon);mask-image:var(--toolbarButton-viewLayers-icon)}#toolbarSidebar #toolbarSidebarRight{width:auto;height:100%;padding-inline-end:2px}#sidebarResizer{position:absolute;inset-block:0;inset-inline-end:-6px;width:6px;z-index:200;cursor:ew-resize}#outerContainer.sidebarOpen #loadingBar{inset-inline-start:var(--sidebar-width)}#outerContainer.sidebarResizing :is(#sidebarContainer,#viewerContainer,#loadingBar){transition-duration:0s}.doorHanger,.doorHangerRight{border-radius:2px;box-shadow:0 1px 5px var(--doorhanger-border-color),0 0 0 1px var(--doorhanger-border-color);border:var(--doorhanger-border-color-whcm);inset-block-start:calc(100% + var(--doorhanger-height) - 2px)}:is(.doorHanger,.doorHangerRight)::after,:is(.doorHanger,.doorHangerRight)::before{bottom:100%;border-style:solid;border-color:transparent;content:"";height:0;width:0;position:absolute;pointer-events:none;opacity:var(--doorhanger-triangle-opacity-whcm)}:is(.doorHanger,.doorHangerRight)::before{border-width:calc(var(--doorhanger-height) + 2px);border-bottom-color:var(--doorhanger-border-color)}:is(.doorHanger,.doorHangerRight)::after{border-width:var(--doorhanger-height)}.doorHangerRight{inset-inline-end:calc(50% - var(--doorhanger-height) - 1px)}.doorHangerRight::before{inset-inline-end:-1px}.doorHangerRight::after{border-bottom-color:var(--doorhanger-bg-color);inset-inline-end:1px}.doorHanger{inset-inline-start:calc(50% - var(--doorhanger-height) - 1px)}.doorHanger::before{inset-inline-start:-1px}.doorHanger::after{border-bottom-color:var(--toolbar-bg-color);inset-inline-start:1px}.dialogButton{background:0 0;height:28px;outline:0}.dialogButton:is(:hover,:focus-visible){background-color:var(--dialog-button-hover-bg-color)}.dialogButton:is(:hover,:focus-visible)>span{color:var(--dialog-button-hover-color)}.splitToolbarButtonSeparator{float:var(--inline-start);width:0;height:62%;border-left:1px solid var(--separator-color);border-right:none}.dialogButton{min-width:16px;border:none;border-radius:2px;color:var(--main-color);font-size:12px;line-height:14px;-webkit-user-select:none;-moz-user-select:none;user-select:none}.treeItemToggler::before{position:absolute;display:inline-block;width:16px;height:16px;content:"";background-color:var(--toolbar-icon-bg-color);-webkit-mask-size:cover;mask-size:cover}#sidebarToggleButton::before{-webkit-mask-image:var(--toolbarButton-sidebarToggle-icon);mask-image:var(--toolbarButton-sidebarToggle-icon);transform:scaleX(var(--dir-factor))}#secondaryToolbarToggleButton::before{-webkit-mask-image:var(--toolbarButton-secondaryToolbarToggle-icon);mask-image:var(--toolbarButton-secondaryToolbarToggle-icon);transform:scaleX(var(--dir-factor))}#previous::before{-webkit-mask-image:var(--toolbarButton-pageUp-icon);mask-image:var(--toolbarButton-pageUp-icon)}#next::before{-webkit-mask-image:var(--toolbarButton-pageDown-icon);mask-image:var(--toolbarButton-pageDown-icon)}#zoomOutButton::before{-webkit-mask-image:var(--toolbarButton-zoomOut-icon);mask-image:var(--toolbarButton-zoomOut-icon)}#zoomInButton::before{-webkit-mask-image:var(--toolbarButton-zoomIn-icon);mask-image:var(--toolbarButton-zoomIn-icon)}#presentationMode::before{-webkit-mask-image:var(--toolbarButton-presentationMode-icon);mask-image:var(--toolbarButton-presentationMode-icon)}#editorFreeTextButton::before{-webkit-mask-image:var(--toolbarButton-editorFreeText-icon);mask-image:var(--toolbarButton-editorFreeText-icon)}#editorHighlightButton::before{-webkit-mask-image:var(--toolbarButton-editorHighlight-icon);mask-image:var(--toolbarButton-editorHighlight-icon)}#editorInkButton::before{-webkit-mask-image:var(--toolbarButton-editorInk-icon);mask-image:var(--toolbarButton-editorInk-icon)}#editorStampButton::before{-webkit-mask-image:var(--toolbarButton-editorStamp-icon);mask-image:var(--toolbarButton-editorStamp-icon)}:is(#printButton,#secondaryPrint)::before{-webkit-mask-image:var(--toolbarButton-print-icon);mask-image:var(--toolbarButton-print-icon)}#secondaryOpenFile::before{-webkit-mask-image:var(--toolbarButton-openFile-icon);mask-image:var(--toolbarButton-openFile-icon)}:is(#downloadButton,#secondaryDownload)::before{-webkit-mask-image:var(--toolbarButton-download-icon);mask-image:var(--toolbarButton-download-icon)}#viewBookmark::before{-webkit-mask-image:var(--toolbarButton-bookmark-icon);mask-image:var(--toolbarButton-bookmark-icon)}#currentOutlineItem::before{-webkit-mask-image:var(--toolbarButton-currentOutlineItem-icon);mask-image:var(--toolbarButton-currentOutlineItem-icon);transform:scaleX(var(--dir-factor))}#viewFindButton::before{-webkit-mask-image:var(--toolbarButton-search-icon);mask-image:var(--toolbarButton-search-icon)}.pdfSidebarNotification::after{position:absolute;display:inline-block;top:2px;inset-inline-end:2px;content:"";background-color:rgb(112 219 85);height:9px;width:9px;border-radius:50%}.loadingInput::after,.toolbarButton::before{width:var(--icon-size);height:var(--icon-size);-webkit-mask-size:cover;content:""}.verticalToolbarSeparator{display:block;margin-inline:2px;width:0;height:80%;border-left:1px solid var(--separator-color);border-right:none}.horizontalToolbarSeparator{display:block;margin:6px 0;border-top:1px solid var(--doorhanger-separator-color);border-bottom:none;height:0;width:100%}.thumbnail,.thumbnailImage{width:var(--thumbnail-width);height:var(--thumbnail-height)}.toggleButton:is(:hover,:has( > input:focus-visible)){color:var(--toggled-btn-color);background-color:var(--button-hover-color)}.toggleButton:has( > input:checked){color:var(--toggled-btn-color);background-color:var(--toggled-btn-bg-color)}.toggleButton>input{position:absolute;top:50%;left:50%;opacity:0;width:0;height:0}.toolbarField{padding:4px 7px;margin:3px 0;border-radius:2px;background-color:var(--field-bg-color);background-clip:padding-box;border:1px solid var(--field-border-color);box-shadow:none;color:var(--field-color);font-size:12px;line-height:16px;outline:0}.toolbarField:focus{border-color:#0a84ff}#pageNumber{-moz-appearance:textfield;text-align:end;width:17px;background-size:0 0;transition-property:none}#pageNumber::-webkit-inner-spin-button{-webkit-appearance:none}.loadingInput:has( > .loading:is(#pageNumber))::after{display:inline;visibility:visible;transition-property:visibility;transition-delay:var(--loading-icon-delay)}.loadingInput::after{position:absolute;visibility:hidden;display:none;background-color:var(--toolbar-icon-bg-color);mask-size:cover;-webkit-mask-image:var(--loading-icon);mask-image:var(--loading-icon)}.loadingInput.start::after{inset-inline-start:4px}.loadingInput.end::after{inset-inline-end:4px}#attachmentsView,#layersView,#outlineView,#thumbnailView{text-align:center; position:absolute;width:calc(100% - 8px);inset-block:0;padding:4px 4px 0;overflow:auto;-webkit-user-select:none;-moz-user-select:none;user-select:none}.toolbarLabel,.treeItem>a{-webkit-user-select:none;-moz-user-select:none}#thumbnailView{width:calc(100% - 60px);padding:10px 30px 0}#thumbnailView>a:is(:active,:focus){outline:0;opacity:1;}.thumbnail{--thumbnail-width:0;--thumbnail-height:0; display:inline-block; opacity:0.6;/*float:var(--inline-start);*/margin:0 10px 5px;/*padding:1px;*/border:6px solid transparent;border-radius:2px}#thumbnailView>a:last-of-type>.thumbnail{margin-bottom:10px}.thumbnail:hover,a:focus>.thumbnail{opacity:1;/*border-color:var(--thumbnail-hover-color)*/}.thumbnail.selected{opacity:1; border-color:var(--thumbnail-selected-color)!important}.thumbnailImage{opacity:.9}.thumbnail:hover>.thumbnailImage,a:focus>.thumbnail>.thumbnailImage{opacity:.95}.thumbnail.selected>.thumbnailImage{opacity:1!important}.thumbnail:not([data-loaded])>.thumbnailImage{width:calc(var(--thumbnail-width) - 2px);height:calc(var(--thumbnail-height) - 2px);border:1px dashed rgb(132 132 132)}.treeItem>.treeItems,.treeWithDeepNesting>.treeItem{margin-inline-start:20px}.treeItem>a{display:inline-block;min-width:calc(100% - 4px);height:auto;margin-bottom:1px;padding:2px 0 5px;padding-inline-start:4px;border-radius:2px;color:var(--treeitem-color);font-size:13px;line-height:15px;user-select:none;white-space:normal}#layersView .treeItem>a>label{padding-inline-start:4px}#layersView .treeItem>a>label>input{float:var(--inline-start);margin-top:1px}.treeItemToggler{position:relative;float:var(--inline-start);height:0;width:0;color:rgb(255 255 255 / .5)}.dialogButton,.toolbarButton,dialog{color:var(--main-color)}.treeItemToggler::before{inset-inline-end:4px;-webkit-mask-image:var(--treeitem-expanded-icon);mask-image:var(--treeitem-expanded-icon)}.treeItemToggler.treeItemsHidden::before{-webkit-mask-image:var(--treeitem-collapsed-icon);mask-image:var(--treeitem-collapsed-icon);transform:scaleX(var(--dir-factor))}#outlineOptionsContainer,.treeItemToggler.treeItemsHidden~.treeItems{display:none}.treeItem.selected>a{background-color:var(--treeitem-selected-bg-color);color:var(--treeitem-selected-color)}.treeItem>a:hover,.treeItemToggler:hover,.treeItemToggler:hover+a,.treeItemToggler:hover~.treeItems{background-color:var(--treeitem-bg-color);background-clip:padding-box;border-radius:2px;color:var(--treeitem-hover-color)}#sidebarContainer:has(#outlineView:not(.hidden)) #outlineOptionsContainer{display:inline flex}.dialogButton{width:auto;margin:3px 4px 2px!important;padding:2px 11px;background-color:var(--dialog-button-bg-color);border:var(--dialog-button-border)!important}dialog{margin:auto;padding:15px;border-spacing:4px;font:message-box;font-size:12px;line-height:14px;border:1px solid;border-radius:4px;box-shadow:0 1px 4px rgb(0 0 0 / .3)}dialog::backdrop{background-color:rgb(0 0 0 / .2)}dialog>.row{display:table-row}dialog>.row>*{display:table-cell}dialog .toolbarField{margin:5px 0}dialog .separator{display:block;margin:4px 0;height:0;width:100%;border-top:1px solid var(--separator-color);border-bottom:none}dialog .buttonRow{vertical-align:middle}dialog :link{color:rgb(255 255 255)}#documentPropertiesDialog,.toolbarLabel{text-align:left}#passwordDialog .toolbarField{width:200px}#documentPropertiesDialog .row>*{min-width:100px;text-align:start}#documentPropertiesDialog .row>span{width:125px;word-wrap:break-word}#documentPropertiesDialog .row>p{max-width:225px;word-wrap:break-word}#documentPropertiesDialog .buttonRow{margin-top:10px}.grab-to-pan-grab{cursor:grab!important}.grab-to-pan-grab :not(input):not(textarea):not(button):not(select):not(:link){cursor:inherit!important}.grab-to-pan-grab:active,.grab-to-pan-grabbing{cursor:grabbing!important}.grab-to-pan-grabbing{position:fixed;background:rgb(0 0 0 / 0);display:block;inset:0;overflow:hidden;z-index:50000}.toolbarButton{height:32px; height:32px; aspect-ratio:1;display:flex;align-items:center;justify-content:center;background:0 0;border:none;outline:0;border-radius:50%;font:message-box;flex:none;position:relative}.toolbarButton>span{display:inline-block;width:0;height:0;overflow:hidden}.toolbarButton::before{opacity:var(--toolbar-icon-opacity);display:inline-block;background-color:var(--toolbar-icon-bg-color);mask-size:cover;-webkit-mask-position:center;mask-position:center}.toolbarButton.toggled{/*background-color:var(--toggled-btn-bg-color);color:var(--toggled-btn-color)*/}.toolbarButton.toggled::before{background-color:var(--toggled-btn-color)}.toolbarButton.toggled:hover{outline:var(--toggled-hover-btn-outline)!important}.toolbarButton.toggled:hover:active{background-color:var(--toggled-hover-active-btn-color)}.toolbarButton:is(:hover,:focus-visible){background-color:var(--button-hover-color)}.toolbarButton:is(:hover,:focus-visible)::before{background-color:var(--toolbar-icon-hover-bg-color)}.toolbarButton:is([disabled=disabled],[disabled]){opacity:.5;pointer-events:none}.toolbarButton.labeled{width:100%;min-height:var(--menuitem-height);justify-content:flex-start;gap:8px;padding-inline-start:12px;aspect-ratio:unset;text-align:start;white-space:normal;cursor:default}.toolbarButton.labeled:is(a){text-decoration:none}.toolbarButton.labeled[href="#"]:is(a){opacity:.5;pointer-events:none}.toolbarButton.labeled::before{opacity:var(--doorhanger-icon-opacity)}.toolbarButton.labeled:is(:hover,:focus-visible){background-color:var(--doorhanger-hover-bg-color);color:var(--doorhanger-hover-color)}.toolbarButton.labeled>span{display:inline-block;width:-moz-max-content;width:max-content;height:auto}.toolbarButtonWithContainer{height:100%;aspect-ratio:1;display:inline-block;position:relative;flex:none}.toolbarButtonWithContainer>.toolbarButton{width:32px;height:32px}.toolbarButtonWithContainer .menu{padding-block:5px}.toolbarButtonWithContainer .menuContainer{width:100%;height:auto;max-height:calc(var(--viewer-container-height) - var(--toolbar-height) - var(--doorhanger-height));display:flex;flex-direction:column;box-sizing:border-box;overflow-y:auto}.toolbarButtonWithContainer .editorParamsToolbar{height:auto;width:220px;position:absolute;z-index:30000;cursor:default}:is(.toolbarButtonWithContainer .editorParamsToolbar) #editorStampAddImage::before{-webkit-mask-image:var(--editorParams-stampAddImage-icon);mask-image:var(--editorParams-stampAddImage-icon)}:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsLabel{flex:none;font:menu;font-size:13px;font-style:normal;font-weight:400;line-height:150%;color:var(--main-color);width:-moz-fit-content;width:fit-content;inset-inline-start:0}:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer{width:100%;height:auto;display:flex;flex-direction:column;box-sizing:border-box;padding-inline:10px;padding-block:10px}:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer)>.editorParamsSetter{min-height:26px;display:flex;align-items:center;justify-content:space-between}:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsColor{width:32px;height:32px;flex:none;padding:0}:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsSlider{background-color:transparent;width:90px;flex:0 1 0;font:message-box}.dropdownToolbarButton,.toolbarLabel{font-size:12px;line-height:14px;cursor:default}:is(:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsSlider)::-moz-range-progress{background-color:#000}:is(:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsSlider)::-moz-range-track,:is(:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsSlider)::-webkit-slider-runnable-track{background-color:#000}:is(:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsSlider)::-moz-range-thumb,:is(:is(:is(.toolbarButtonWithContainer .editorParamsToolbar) .editorParamsToolbarContainer) .editorParamsSlider)::-webkit-slider-thumb{background-color:#fff}#secondaryToolbar{height:auto;width:220px;position:absolute;z-index:30000;cursor:default;min-height:26px;max-height:calc(var(--viewer-container-height) - 40px)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #secondaryOpenFile::before{-webkit-mask-image:var(--toolbarButton-openFile-icon);mask-image:var(--toolbarButton-openFile-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #secondaryPrint::before{-webkit-mask-image:var(--toolbarButton-print-icon);mask-image:var(--toolbarButton-print-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #secondaryDownload::before{-webkit-mask-image:var(--toolbarButton-download-icon);mask-image:var(--toolbarButton-download-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #presentationMode::before{-webkit-mask-image:var(--toolbarButton-presentationMode-icon);mask-image:var(--toolbarButton-presentationMode-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #viewBookmark::before{-webkit-mask-image:var(--toolbarButton-bookmark-icon);mask-image:var(--toolbarButton-bookmark-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #firstPage::before{-webkit-mask-image:var(--secondaryToolbarButton-firstPage-icon);mask-image:var(--secondaryToolbarButton-firstPage-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #lastPage::before{-webkit-mask-image:var(--secondaryToolbarButton-lastPage-icon);mask-image:var(--secondaryToolbarButton-lastPage-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #pageRotateCcw::before{-webkit-mask-image:var(--secondaryToolbarButton-rotateCcw-icon);mask-image:var(--secondaryToolbarButton-rotateCcw-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #pageRotateCw::before{-webkit-mask-image:var(--secondaryToolbarButton-rotateCw-icon);mask-image:var(--secondaryToolbarButton-rotateCw-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #cursorSelectTool::before{-webkit-mask-image:var(--secondaryToolbarButton-selectTool-icon);mask-image:var(--secondaryToolbarButton-selectTool-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #cursorHandTool::before{-webkit-mask-image:var(--secondaryToolbarButton-handTool-icon);mask-image:var(--secondaryToolbarButton-handTool-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #scrollPage::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollPage-icon);mask-image:var(--secondaryToolbarButton-scrollPage-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #scrollVertical::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollVertical-icon);mask-image:var(--secondaryToolbarButton-scrollVertical-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #scrollHorizontal::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollHorizontal-icon);mask-image:var(--secondaryToolbarButton-scrollHorizontal-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #scrollWrapped::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollWrapped-icon);mask-image:var(--secondaryToolbarButton-scrollWrapped-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #spreadNone::before{-webkit-mask-image:var(--secondaryToolbarButton-spreadNone-icon);mask-image:var(--secondaryToolbarButton-spreadNone-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #spreadOdd::before{-webkit-mask-image:var(--secondaryToolbarButton-spreadOdd-icon);mask-image:var(--secondaryToolbarButton-spreadOdd-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #spreadEven::before{-webkit-mask-image:var(--secondaryToolbarButton-spreadEven-icon);mask-image:var(--secondaryToolbarButton-spreadEven-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #imageAltTextSettings::before{-webkit-mask-image:var(--secondaryToolbarButton-imageAltTextSettings-icon);mask-image:var(--secondaryToolbarButton-imageAltTextSettings-icon)}:is(#secondaryToolbar #secondaryToolbarButtonContainer) #documentProperties::before{-webkit-mask-image:var(--secondaryToolbarButton-documentProperties-icon);mask-image:var(--secondaryToolbarButton-documentProperties-icon)}#findbar{--input-horizontal-padding:4px;--findbar-padding:2px;width:-moz-max-content;width:max-content;max-width:90vw;min-height:var(--toolbar-height);height:auto;position:absolute;z-index:30000;cursor:default;padding:0;min-width:300px;flex-wrap:wrap;justify-content:flex-start}#findbar>*{padding:var(--findbar-padding)}#findbar #findInputContainer{margin-inline-start:2px}:is(#findbar #findInputContainer) #findPreviousButton::before{-webkit-mask-image:var(--findbarButton-previous-icon);mask-image:var(--findbarButton-previous-icon)}:is(#findbar #findInputContainer) #findNextButton::before{-webkit-mask-image:var(--findbarButton-next-icon);mask-image:var(--findbarButton-next-icon)}:is(#findbar #findInputContainer) #findInput{width:200px;padding:5px var(--input-horizontal-padding)}:is(:is(#findbar #findInputContainer) #findInput)::-moz-placeholder{font-style:normal}:is(:is(#findbar #findInputContainer) #findInput)::placeholder{font-style:normal}.loadingInput:has( > [data-status=pending]:is(:is(#findbar #findInputContainer) #findInput))::after{display:inline;visibility:visible;inset-inline-end:calc(var(--input-horizontal-padding) + 1px)}[data-status=notFound]:is(:is(#findbar #findInputContainer) #findInput){background-color:rgb(255 102 102)}#findbar #findbarMessageContainer{display:none;gap:4px}:is(#findbar #findbarMessageContainer):has( > :is(#findResultsCount,#findMsg):not(:empty)){display:inline flex}:is(#findbar #findbarMessageContainer) #findResultsCount{background-color:rgb(217 217 217);color:rgb(82 82 82);padding-block:4px}.dropdownToolbarButton{background-color:transparent}.dropdownToolbarButton>select{outline:0;background-color:var(--dropdown-btn-bg-color)}:is(:is(#findbar #findbarMessageContainer) #findResultsCount):empty{display:none}[data-status=notFound]:is(:is(#findbar #findbarMessageContainer) #findMsg){font-weight:700}:is(:is(#findbar #findbarMessageContainer) #findMsg):empty{display:none}.dropdownToolbarButton,.toolbarHorizontalGroup,.toolbarLabel{display:inline flex;box-sizing:border-box}#findbar.wrapContainers{flex-direction:column;align-items:flex-start;height:-moz-max-content;height:max-content}#findbar.wrapContainers .toolbarLabel{margin:0 4px}#findbar.wrapContainers #findbarMessageContainer{flex-wrap:wrap;flex-flow:column nowrap;align-items:flex-start;height:-moz-max-content;height:max-content}:is(#findbar.wrapContainers #findbarMessageContainer) #findResultsCount{height:calc(var(--toolbar-height) - 2 * var(--findbar-padding))}:is(#findbar.wrapContainers #findbarMessageContainer) #findMsg{min-height:var(--toolbar-height)}@page{margin:0}#printContainer{display:none}@media print{.xfaSelect,.xfaTextfield{background:0 0}.xfaSelect{-webkit-appearance:none;-moz-appearance:none;appearance:none;text-indent:1px;text-overflow:""}#printContainer>.printedPage,#printContainer>.xfaPrintedPage{page-break-after:always;page-break-inside:avoid;width:100%;height:100%}body{background:rgb(0 0 0 / 0) none}body[data-pdfjsprinting] #outerContainer{display:none}body[data-pdfjsprinting] #printContainer{display:block}#printContainer{height:100%}#printContainer>.printedPage{display:flex;flex-direction:column;justify-content:center;align-items:center}#printContainer>.xfaPrintedPage .xfaPage{position:absolute}#printContainer>.xfaPrintedPage{position:relative}#printContainer>.printedPage :is(canvas,img){max-width:100%;max-height:100%;direction:ltr;display:block}}.toolbarLabel{width:-moz-max-content;width:max-content;min-width:16px;height:100%;padding-inline:4px;margin:2px;border-radius:2px;color:var(--main-color);user-select:none;flex-direction:column;align-items:center;justify-content:center}.toolbarLabel>label{width:100%}.toolbarHorizontalGroup{/*height:100%;*/flex-direction:row;align-items:center;justify-content:space-between;gap:1px}.dropdownToolbarButton{flex-direction:row;align-items:center;justify-content:center;position:relative;width:-moz-fit-content;width:fit-content;min-width:140px;padding:0;border:var(--dropdown-btn-border);border-radius:2px;color:var(--main-color);-webkit-user-select:none;-moz-user-select:none;user-select:none}.dropdownToolbarButton:hover{/*background-color:var(--button-hover-color)*/}.dropdownToolbarButton>select{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:inherit;min-width:inherit;height:26px;/*font:message-box;*/font-size:12px;color:var(--main-color);margin:0;padding-block:1px 2px;padding-inline:6px 38px;border:none}:is(.dropdownToolbarButton > select)>option{background:var(--doorhanger-bg-color);color:var(--main-color)}:is(.dropdownToolbarButton > select):is(:hover,:focus-visible){/*background-color:var(--button-hover-color);color:var(--toggled-btn-color)*/}.dropdownToolbarButton::after{position:absolute;display:inline;width:var(--icon-size);height:var(--icon-size);content:"";background-color:var(--toolbar-icon-bg-color);-webkit-mask-size:cover;mask-size:cover;inset-inline-end:4px;pointer-events:none;-webkit-mask-image:var(--toolbarButton-menuArrow-icon);mask-image:var(--toolbarButton-menuArrow-icon)}.dropdownToolbarButton:is(:hover,:focus-visible,:active)::after{background-color:var(--toolbar-icon-hover-bg-color)}#toolbarContainer{--menuitem-height:calc(var(--toolbar-height) - 28px);width:100%;padding:var(--toolbar-vertical-padding) var(--toolbar-horizontal-padding);position:relative;box-sizing:border-box;font:message-box; box-shadow:rgba(0, 0, 0, 0.09) 0px -2px 8px, rgba(0, 0, 0, 0.06) 0px 4px 8px, rgba(0, 0, 0, 0.3) 0px 1px 2px, rgba(0, 0, 0, 0.15) 0px 2px 6px;border-bottom:none}#toolbarContainer #toolbarViewer{width:100%;height:100%;justify-content:space-between}:is(#toolbarContainer #toolbarViewer)>*{flex:none}:is(#toolbarContainer #toolbarViewer) input{/*font:message-box;*/ background-color:rgba(0, 0, 0, 0.5); border:none;}:is(#toolbarContainer #toolbarViewer) .toolbarButtonSpacer{width:30px;display:block;height:1px}:is(#toolbarContainer #toolbarViewer) #toolbarViewerLeft #numPages.toolbarLabel{padding-inline-start:3px;flex:none}#toolbarContainer #loadingBar{--progressBar-percent:0%;--progressBar-end-offset:0;position:absolute;top:var(--toolbar-height);inset-inline:0 var(--progressBar-end-offset);height:4px;background-color:var(--progressBar-bg-color);border-bottom:1px solid var(--toolbar-border-color);transition-property:inset-inline-start}:is(#toolbarContainer #loadingBar) .progress{position:absolute;top:0;inset-inline-start:0;width:100%;transform:scaleX(var(--progressBar-percent));transform-origin:calc(50% - 50% * var(--dir-factor)) 0;height:100%;background-color:var(--progressBar-color);overflow:hidden;transition:transform .2s}.indeterminate:is(#toolbarContainer #loadingBar) .progress{transform:none;background-color:var(--progressBar-bg-color);transition:none}:is(.indeterminate:is(#toolbarContainer #loadingBar) .progress) .glimmer{position:absolute;top:0;inset-inline-start:0;height:100%;width:calc(100% + 150px);background:repeating-linear-gradient(135deg,var(--progressBar-blend-color) 0,var(--progressBar-bg-color) 5px,var(--progressBar-bg-color) 45px,var(--progressBar-color) 55px,var(--progressBar-color) 95px,var(--progressBar-blend-color) 100px);animation:1s linear infinite progressIndeterminate}#secondaryToolbar #firstPage::before{-webkit-mask-image:var(--secondaryToolbarButton-firstPage-icon);mask-image:var(--secondaryToolbarButton-firstPage-icon)}#secondaryToolbar #lastPage::before{-webkit-mask-image:var(--secondaryToolbarButton-lastPage-icon);mask-image:var(--secondaryToolbarButton-lastPage-icon)}#secondaryToolbar #pageRotateCcw::before{-webkit-mask-image:var(--secondaryToolbarButton-rotateCcw-icon);mask-image:var(--secondaryToolbarButton-rotateCcw-icon)}#secondaryToolbar #pageRotateCw::before{-webkit-mask-image:var(--secondaryToolbarButton-rotateCw-icon);mask-image:var(--secondaryToolbarButton-rotateCw-icon)}#secondaryToolbar #cursorSelectTool::before{-webkit-mask-image:var(--secondaryToolbarButton-selectTool-icon);mask-image:var(--secondaryToolbarButton-selectTool-icon)}#secondaryToolbar #cursorHandTool::before{-webkit-mask-image:var(--secondaryToolbarButton-handTool-icon);mask-image:var(--secondaryToolbarButton-handTool-icon)}#secondaryToolbar #scrollPage::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollPage-icon);mask-image:var(--secondaryToolbarButton-scrollPage-icon)}#secondaryToolbar #scrollVertical::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollVertical-icon);mask-image:var(--secondaryToolbarButton-scrollVertical-icon)}#secondaryToolbar #scrollHorizontal::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollHorizontal-icon);mask-image:var(--secondaryToolbarButton-scrollHorizontal-icon)}#secondaryToolbar #scrollWrapped::before{-webkit-mask-image:var(--secondaryToolbarButton-scrollWrapped-icon);mask-image:var(--secondaryToolbarButton-scrollWrapped-icon)}#secondaryToolbar #spreadNone::before{-webkit-mask-image:var(--secondaryToolbarButton-spreadNone-icon);mask-image:var(--secondaryToolbarButton-spreadNone-icon)}#secondaryToolbar #spreadOdd::before{-webkit-mask-image:var(--secondaryToolbarButton-spreadOdd-icon);mask-image:var(--secondaryToolbarButton-spreadOdd-icon)}#secondaryToolbar #spreadEven::before{-webkit-mask-image:var(--secondaryToolbarButton-spreadEven-icon);mask-image:var(--secondaryToolbarButton-spreadEven-icon)}#secondaryToolbar #documentProperties::before{-webkit-mask-image:var(--secondaryToolbarButton-documentProperties-icon);mask-image:var(--secondaryToolbarButton-documentProperties-icon)}@media all and (max-width:840px){#sidebarContainer{background-color:var(--sidebar-narrow-bg-color)}#outerContainer.sidebarOpen #viewerContainer{inset-inline-start:0!important}}@media all and (max-width:750px){#outerContainer .hiddenMediumView{display:none!important}#outerContainer .visibleMediumView:not(.hidden,[hidden]){display:inline-block!important}}@media all and (max-width:690px){.hiddenSmallView,.hiddenSmallView *{display:none!important}#toolbarContainer #toolbarViewer .toolbarButtonSpacer{width:0}}@media all and (max-width:560px){#scaleSelectContainer{display:none}}
          .menuContainer .toolbarButton {border-radius:2px}
          </style>`;

          //FIGURE OUT WHERE TO ADD THE STYLE ELEMENT
          var headEle = document.querySelector('head');
          if(!headEle) document.querySelector('body').innerHTML = styleEle+ocument.querySelector('body').innerHTML;
          else headEle.innerHTML += styleEle;
    }

var html = `
<div id="outerContainer">
      <div id="sidebarContainer">
        <div id="toolbarSidebar" class="toolbarHorizontalGroup" style="display:none;">
          <div id="toolbarSidebarLeft">
            <div id="sidebarViewButtons" class="toolbarHorizontalGroup toggled" role="radiogroup">
              <button id="viewThumbnail" class="toolbarButton toggled" type="button" title="Show Thumbnails" tabindex="0" data-l10n-id="pdfjs-thumbs-button" role="radio" aria-checked="true" aria-controls="thumbnailView">
                 <span data-l10n-id="pdfjs-thumbs-button-label">Thumbnails</span>
              </button>
              <button id="viewOutline" class="toolbarButton" type="button" title="Show Document Outline (double-click to expand/collapse all items)" tabindex="0" data-l10n-id="pdfjs-document-outline-button" role="radio" aria-checked="false" aria-controls="outlineView">
                 <span data-l10n-id="pdfjs-document-outline-button-label">Document Outline</span>
              </button>
              <button id="viewAttachments" class="toolbarButton" type="button" title="Show Attachments" tabindex="0" data-l10n-id="pdfjs-attachments-button" role="radio" aria-checked="false" aria-controls="attachmentsView">
                 <span data-l10n-id="pdfjs-attachments-button-label">Attachments</span>
              </button>
              <button id="viewLayers" class="toolbarButton" type="button" title="Show Layers (double-click to reset all layers to the default state)" tabindex="0" data-l10n-id="pdfjs-layers-button" role="radio" aria-checked="false" aria-controls="layersView">
                 <span data-l10n-id="pdfjs-layers-button-label">Layers</span>
              </button>
            </div>
          </div>

          <div id="toolbarSidebarRight">
            <div id="outlineOptionsContainer" class="toolbarHorizontalGroup">
              <div class="verticalToolbarSeparator"></div>

              <button id="currentOutlineItem" class="toolbarButton" type="button" disabled="disabled" title="Find Current Outline Item" tabindex="0" data-l10n-id="pdfjs-current-outline-item-button">
                <span data-l10n-id="pdfjs-current-outline-item-button-label">Current Outline Item</span>
              </button>
            </div>
          </div>
        </div>
        <div id="sidebarContent" style="top:0;">
          <div id="thumbnailView">
          </div>
          <div id="outlineView" class="hidden">
          </div>
          <div id="attachmentsView" class="hidden">
          </div>
          <div id="layersView" class="hidden">
          </div>
        </div>
        <div id="sidebarResizer"></div>
      </div>  <!-- sidebarContainer -->

      <div id="mainContainer">
        <div class="toolbar">
          <div id="toolbarContainer">
            <div id="toolbarViewer" class="toolbarHorizontalGroup">
              <div id="toolbarViewerLeft" class="toolbarHorizontalGroup" style="padding-left:20px;">
                <button id="sidebarToggleButton" class="toolbarButton" type="button" title="Toggle Sidebar" tabindex="0" data-l10n-id="pdfjs-toggle-sidebar-button" aria-expanded="false" aria-haspopup="true" aria-controls="sidebarContainer">
                  <span data-l10n-id="pdfjs-toggle-sidebar-button-label">Toggle Sidebar</span>
                </button>
                <div id="viewer-title" style="color:var(--main-color)"></div>
                <div class="toolbarButtonSpacer hidden"></div>
                <div class="toolbarButtonWithContainer">
                  <button id="viewFindButton" class="toolbarButton hidden" type="button" title="Find in Document" tabindex="0" data-l10n-id="pdfjs-findbar-button" aria-expanded="false" aria-controls="findbar">
                    <span data-l10n-id="pdfjs-findbar-button-label">Find</span>
                  </button>
                  <div class="hidden doorHanger toolbarHorizontalGroup" id="findbar">
                    <div id="findInputContainer" class="toolbarHorizontalGroup">
                      <span class="loadingInput end toolbarHorizontalGroup">
                        <input id="findInput" class="toolbarField" title="Find" placeholder="Find in document…" tabindex="0" data-l10n-id="pdfjs-find-input" aria-invalid="false">
                      </span>
                      <div class="toolbarHorizontalGroup">
                        <button id="findPreviousButton" class="toolbarButton" type="button" title="Find the previous occurrence of the phrase" tabindex="0" data-l10n-id="pdfjs-find-previous-button">
                          <span data-l10n-id="pdfjs-find-previous-button-label">Previous</span>
                        </button>
                        <div class="splitToolbarButtonSeparator"></div>
                        <button id="findNextButton" class="toolbarButton" type="button" title="Find the next occurrence of the phrase" tabindex="0" data-l10n-id="pdfjs-find-next-button">
                          <span data-l10n-id="pdfjs-find-next-button-label">Next</span>
                        </button>
                      </div>
                    </div>

                    <div id="findbarOptionsOneContainer" class="toolbarHorizontalGroup">
                      <div class="toggleButton toolbarLabel">
                        <input type="checkbox" id="findHighlightAll" tabindex="0" />
                        <label for="findHighlightAll" data-l10n-id="pdfjs-find-highlight-checkbox">Highlight All</label>
                      </div>
                      <div class="toggleButton toolbarLabel">
                        <input type="checkbox" id="findMatchCase" tabindex="0" />
                        <label for="findMatchCase" data-l10n-id="pdfjs-find-match-case-checkbox-label">Match Case</label>
                      </div>
                    </div>
                    <div id="findbarOptionsTwoContainer" class="toolbarHorizontalGroup">
                      <div class="toggleButton toolbarLabel">
                        <input type="checkbox" id="findMatchDiacritics" tabindex="0" />
                        <label for="findMatchDiacritics" data-l10n-id="pdfjs-find-match-diacritics-checkbox-label">Match Diacritics</label>
                      </div>
                      <div class="toggleButton toolbarLabel">
                        <input type="checkbox" id="findEntireWord" tabindex="0" />
                        <label for="findEntireWord" data-l10n-id="pdfjs-find-entire-word-checkbox-label">Whole Words</label>
                      </div>
                    </div>

                    <div id="findbarMessageContainer" class="toolbarHorizontalGroup" aria-live="polite">
                      <span id="findResultsCount" class="toolbarLabel"></span>
                      <span id="findMsg" class="toolbarLabel"></span>
                    </div>
                  </div>  <!-- findbar -->
                </div>
                <div class="toolbarHorizontalGroup hiddenSmallView hidden">
                  <button class="toolbarButton" title="Previous Page" type="button" id="previous" tabindex="0" data-l10n-id="pdfjs-previous-button">
                    <span data-l10n-id="pdfjs-previous-button-label">Previous</span>
                  </button>
                  <div class="splitToolbarButtonSeparator"></div>
                  <button class="toolbarButton" type="button" title="Next Page" id="next" tabindex="0" data-l10n-id="pdfjs-next-button">
                    <span data-l10n-id="pdfjs-next-button-label">Next</span>
                  </button>
                </div>
              </div>
              <div id="toolbarViewerMiddle" class="toolbarHorizontalGroup">
                <div class="toolbarHorizontalGroup">
                  <span class="loadingInput start toolbarHorizontalGroup">
                    <input type="number" id="pageNumber" class="toolbarField" title="Page" value="1" min="1" tabindex="0" data-l10n-id="pdfjs-page-input" autocomplete="off">
                  </span>
                  <span id="numPages" class="toolbarLabel"></span>
                  <button id="zoomOutButton" class="toolbarButton" type="button" title="Zoom Out" tabindex="0" data-l10n-id="pdfjs-zoom-out-button">
                    <span data-l10n-id="pdfjs-zoom-out-button-label">Zoom Out</span>
                  </button>

                </div>
                <span id="scaleSelectContainer" class="dropdownToolbarButton">
                  <select id="scaleSelect" title="Zoom" tabindex="0" data-l10n-id="pdfjs-zoom-select">
                    <option id="pageAutoOption" title="" value="auto" selected="selected" data-l10n-id="pdfjs-page-scale-auto">Automatic Zoom</option>
                    <option id="pageActualOption" title="" value="page-actual" data-l10n-id="pdfjs-page-scale-actual">Actual Size</option>
                    <option id="pageFitOption" title="" value="page-fit" data-l10n-id="pdfjs-page-scale-fit">Page Fit</option>
                    <option id="pageWidthOption" title="" value="page-width" data-l10n-id="pdfjs-page-scale-width">Page Width</option>
                    <option id="customScaleOption" title="" value="custom" disabled="disabled" hidden="true" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 0 }'>0%</option>
                    <option title="" value="0.5" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 50 }'>50%</option>
                    <option title="" value="0.75" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 75 }'>75%</option>
                    <option title="" value="1" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 100 }'>100%</option>
                    <option title="" value="1.25" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 125 }'>125%</option>
                    <option title="" value="1.5" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 150 }'>150%</option>
                    <option title="" value="2" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 200 }'>200%</option>
                    <option title="" value="3" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 300 }'>300%</option>
                    <option title="" value="4" data-l10n-id="pdfjs-page-scale-percent" data-l10n-args='{ "scale": 400 }'>400%</option>
                  </select>
                </span>
                <button id="zoomInButton" class="toolbarButton" type="button" title="Zoom In" tabindex="0" data-l10n-id="pdfjs-zoom-in-button">
                    <span data-l10n-id="pdfjs-zoom-in-button-label">Zoom In</span>
                  </button>
              </div>
              <div id="toolbarViewerRight" class="toolbarHorizontalGroup">
                <div id="editorModeButtons" class="toolbarHorizontalGroup" style="display:none;" role="radiogroup">
                  <div id="editorHighlight" class="toolbarButtonWithContainer">
                    <button id="editorHighlightButton" class="toolbarButton" type="button" disabled="disabled" title="Highlight" role="radio" aria-expanded="false" aria-haspopup="true" aria-controls="editorHighlightParamsToolbar" tabindex="0" data-l10n-id="pdfjs-editor-highlight-button">
                      <span data-l10n-id="pdfjs-editor-highlight-button-label">Highlight</span>
                    </button>
                    <div class="editorParamsToolbar hidden doorHangerRight" id="editorHighlightParamsToolbar">
                      <div id="highlightParamsToolbarContainer" class="editorParamsToolbarContainer">
                        <div id="editorHighlightColorPicker" class="colorPicker">
                          <span id="highlightColorPickerLabel" class="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-colorpicker-label">Highlight color</span>
                        </div>
                        <div id="editorHighlightThickness">
                          <label for="editorFreeHighlightThickness" class="editorParamsLabel" data-l10n-id="pdfjs-editor-free-highlight-thickness-input">Thickness</label>
                          <div class="thicknessPicker">
                            <input type="range" id="editorFreeHighlightThickness" class="editorParamsSlider" data-l10n-id="pdfjs-editor-free-highlight-thickness-title" value="12" min="8" max="24" step="1" tabindex="0">
                          </div>
                        </div>
                        <div id="editorHighlightVisibility">
                          <div class="divider"></div>
                          <div class="toggler">
                            <label for="editorHighlightShowAll" class="editorParamsLabel" data-l10n-id="pdfjs-editor-highlight-show-all-button-label">Show all</label>
                            <button id="editorHighlightShowAll" class="toggle-button" type="button" data-l10n-id="pdfjs-editor-highlight-show-all-button" aria-pressed="true" tabindex="0"></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorFreeText" class="toolbarButtonWithContainer">
                    <button id="editorFreeTextButton" class="toolbarButton" type="button" disabled="disabled" title="Text" role="radio" aria-expanded="false" aria-haspopup="true" aria-controls="editorFreeTextParamsToolbar" tabindex="0" data-l10n-id="pdfjs-editor-free-text-button">
                      <span data-l10n-id="pdfjs-editor-free-text-button-label">Text</span>
                    </button>
                    <div class="editorParamsToolbar hidden doorHangerRight" id="editorFreeTextParamsToolbar">
                      <div class="editorParamsToolbarContainer">
                        <div class="editorParamsSetter">
                          <label for="editorFreeTextColor" class="editorParamsLabel" data-l10n-id="pdfjs-editor-free-text-color-input">Color</label>
                          <input type="color" id="editorFreeTextColor" class="editorParamsColor" tabindex="0">
                        </div>
                        <div class="editorParamsSetter">
                          <label for="editorFreeTextFontSize" class="editorParamsLabel" data-l10n-id="pdfjs-editor-free-text-size-input">Size</label>
                          <input type="range" id="editorFreeTextFontSize" class="editorParamsSlider" value="10" min="5" max="100" step="1" tabindex="0">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorInk" class="toolbarButtonWithContainer">
                    <button id="editorInkButton" class="toolbarButton" type="button" disabled="disabled" title="Draw" role="radio" aria-expanded="false" aria-haspopup="true" aria-controls="editorInkParamsToolbar" tabindex="0" data-l10n-id="pdfjs-editor-ink-button">
                      <span data-l10n-id="pdfjs-editor-ink-button-label">Draw</span>
                    </button>
                    <div class="editorParamsToolbar hidden doorHangerRight" id="editorInkParamsToolbar">
                      <div class="editorParamsToolbarContainer">
                        <div class="editorParamsSetter">
                          <label for="editorInkColor" class="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-color-input">Color</label>
                          <input type="color" id="editorInkColor" class="editorParamsColor" tabindex="0">
                        </div>
                        <div class="editorParamsSetter">
                          <label for="editorInkThickness" class="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-thickness-input">Thickness</label>
                          <input type="range" id="editorInkThickness" class="editorParamsSlider" value="1" min="1" max="20" step="1" tabindex="0">
                        </div>
                        <div class="editorParamsSetter">
                          <label for="editorInkOpacity" class="editorParamsLabel" data-l10n-id="pdfjs-editor-ink-opacity-input">Opacity</label>
                          <input type="range" id="editorInkOpacity" class="editorParamsSlider" value="100" min="1" max="100" step="1" tabindex="0">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="editorStamp" class="toolbarButtonWithContainer">
                    <button id="editorStampButton" class="toolbarButton" type="button" disabled="disabled" title="Add or edit images" role="radio" aria-expanded="false" aria-haspopup="true" aria-controls="editorStampParamsToolbar" tabindex="0" data-l10n-id="pdfjs-editor-stamp-button">
                      <span data-l10n-id="pdfjs-editor-stamp-button-label">Add or edit images</span>
                    </button>
                    <div class="editorParamsToolbar hidden doorHangerRight menu" id="editorStampParamsToolbar">
                      <div class="menuContainer">
                        <button id="editorStampAddImage" class="toolbarButton labeled" type="button" title="Add image" tabindex="0" data-l10n-id="pdfjs-editor-stamp-add-image-button">
                          <span class="editorParamsLabel" data-l10n-id="pdfjs-editor-stamp-add-image-button-label">Add image</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="editorModeSeparator" class="verticalToolbarSeparator" style="display:none;"></div>

                <div class="toolbarHorizontalGroup hiddenMediumView">

                 <button id="downloadButton" class="toolbarButton" type="button" title="Save" tabindex="0" data-l10n-id="pdfjs-save-button">
                    <span data-l10n-id="pdfjs-save-button-label">Save</span>
                  </button>

                  <button id="printButton" class="toolbarButton" type="button" title="Print" tabindex="0" data-l10n-id="pdfjs-print-button">
                    <span data-l10n-id="pdfjs-print-button-label">Print</span>
                  </button>


                </div>

                <div class="verticalToolbarSeparator hiddenMediumView hidden"></div>

                <div id="secondaryToolbarToggle" class="toolbarButtonWithContainer" style="display:flex; align-items:center">
                  <button id="secondaryToolbarToggleButton" class="toolbarButton" type="button" title="Tools" tabindex="0" data-l10n-id="pdfjs-tools-button" aria-expanded="false" aria-haspopup="true" aria-controls="secondaryToolbar">
                    <span data-l10n-id="pdfjs-tools-button-label">Tools</span>
                  </button>
                  <div id="secondaryToolbar" class="hidden doorHangerRight menu">
                    <div id="secondaryToolbarButtonContainer" class="menuContainer">
                      <button id="secondaryOpenFile" class="toolbarButton labeled hidden" type="button" title="Open File" tabindex="0" data-l10n-id="pdfjs-open-file-button">
                        <span data-l10n-id="pdfjs-open-file-button-label">Open</span>
                      </button>

                      <div class="visibleMediumView">

                        <button id="secondaryDownload" class="toolbarButton labeled" type="button" title="Save" tabindex="0" data-l10n-id="pdfjs-save-button">
                          <span data-l10n-id="pdfjs-save-button-label">Save</span>
                        </button>

                        <button id="secondaryPrint" class="toolbarButton labeled" type="button" title="Print" tabindex="0" data-l10n-id="pdfjs-print-button">
                          <span data-l10n-id="pdfjs-print-button-label">Print</span>
                        </button>



                        <div class="horizontalToolbarSeparator"></div>

                      </div>



                      <button id="presentationMode" class="toolbarButton labeled" type="button" title="Switch to Presentation Mode" tabindex="0" data-l10n-id="pdfjs-presentation-mode-button">
                        <span data-l10n-id="pdfjs-presentation-mode-button-label">Presentation Mode</span>
                      </button>

                      <a href="#" id="viewBookmark" class="toolbarButton labeled" title="Current Page (View URL from Current Page)" tabindex="0" data-l10n-id="pdfjs-bookmark-button">
                        <span data-l10n-id="pdfjs-bookmark-button-label">Current Page</span>
                      </a>

                      <div id="viewBookmarkSeparator" class="horizontalToolbarSeparator"></div>

                      <button id="firstPage" class="toolbarButton labeled" type="button" title="Go to First Page" tabindex="0" data-l10n-id="pdfjs-first-page-button">
                        <span data-l10n-id="pdfjs-first-page-button-label">Go to First Page</span>
                      </button>
                      <button id="lastPage" class="toolbarButton labeled" type="button" title="Go to Last Page" tabindex="0" data-l10n-id="pdfjs-last-page-button">
                        <span data-l10n-id="pdfjs-last-page-button-label">Go to Last Page</span>
                      </button>

                      <div class="horizontalToolbarSeparator"></div>

                      <button id="pageRotateCw" class="toolbarButton labeled" type="button" title="Rotate Clockwise" tabindex="0" data-l10n-id="pdfjs-page-rotate-cw-button">
                        <span data-l10n-id="pdfjs-page-rotate-cw-button-label">Rotate Clockwise</span>
                      </button>
                      <button id="pageRotateCcw" class="toolbarButton labeled" type="button" title="Rotate Counterclockwise" tabindex="0" data-l10n-id="pdfjs-page-rotate-ccw-button">
                        <span data-l10n-id="pdfjs-page-rotate-ccw-button-label">Rotate Counterclockwise</span>
                      </button>

                      <div class="horizontalToolbarSeparator"></div>

                      <div id="cursorToolButtons" role="radiogroup">
                        <button id="cursorSelectTool" class="toolbarButton labeled toggled" type="button" title="Enable Text Selection Tool" tabindex="0" data-l10n-id="pdfjs-cursor-text-select-tool-button" role="radio" aria-checked="true">
                          <span data-l10n-id="pdfjs-cursor-text-select-tool-button-label">Text Selection Tool</span>
                        </button>
                        <button id="cursorHandTool" class="toolbarButton labeled" type="button" title="Enable Hand Tool" tabindex="0" data-l10n-id="pdfjs-cursor-hand-tool-button" role="radio" aria-checked="false">
                          <span data-l10n-id="pdfjs-cursor-hand-tool-button-label">Hand Tool</span>
                        </button>
                      </div>

                      <div class="horizontalToolbarSeparator"></div>

                      <div id="scrollModeButtons" role="radiogroup">
                        <button id="scrollPage" class="toolbarButton labeled" type="button" title="Use Page Scrolling" tabindex="0" data-l10n-id="pdfjs-scroll-page-button" role="radio" aria-checked="false">
                          <span data-l10n-id="pdfjs-scroll-page-button-label">Page Scrolling</span>
                        </button>
                        <button id="scrollVertical" class="toolbarButton labeled toggled" type="button" title="Use Vertical Scrolling" tabindex="0" data-l10n-id="pdfjs-scroll-vertical-button" role="radio" aria-checked="true">
                          <span data-l10n-id="pdfjs-scroll-vertical-button-label">Vertical Scrolling</span>
                        </button>
                        <button id="scrollHorizontal" class="toolbarButton labeled" type="button" title="Use Horizontal Scrolling" tabindex="0" data-l10n-id="pdfjs-scroll-horizontal-button" role="radio" aria-checked="false">
                          <span data-l10n-id="pdfjs-scroll-horizontal-button-label">Horizontal Scrolling</span>
                        </button>
                        <button id="scrollWrapped" class="toolbarButton labeled" type="button" title="Use Wrapped Scrolling" tabindex="0" data-l10n-id="pdfjs-scroll-wrapped-button" role="radio" aria-checked="false">
                          <span data-l10n-id="pdfjs-scroll-wrapped-button-label">Wrapped Scrolling</span>
                        </button>
                      </div>

                      <div class="horizontalToolbarSeparator"></div>

                      <div id="spreadModeButtons" role="radiogroup">
                        <button id="spreadNone" class="toolbarButton labeled toggled" type="button" title="Do not join page spreads" tabindex="0" data-l10n-id="pdfjs-spread-none-button" role="radio" aria-checked="true">
                          <span data-l10n-id="pdfjs-spread-none-button-label">No Spreads</span>
                        </button>
                        <button id="spreadOdd" class="toolbarButton labeled" type="button" title="Join page spreads starting with odd-numbered pages" tabindex="0" data-l10n-id="pdfjs-spread-odd-button" role="radio" aria-checked="false">
                          <span data-l10n-id="pdfjs-spread-odd-button-label">Odd Spreads</span>
                        </button>
                        <button id="spreadEven" class="toolbarButton labeled" type="button" title="Join page spreads starting with even-numbered pages" tabindex="0" data-l10n-id="pdfjs-spread-even-button" role="radio" aria-checked="false">
                          <span data-l10n-id="pdfjs-spread-even-button-label">Even Spreads</span>
                        </button>
                      </div>

                      <div id="imageAltTextSettingsSeparator" class="horizontalToolbarSeparator hidden"></div>
                      <button id="imageAltTextSettings" type="button" class="toolbarButton labeled hidden" title="Image alt text settings" tabindex="0" data-l10n-id="pdfjs-image-alt-text-settings-button" aria-controls="altTextSettingsDialog">
                        <span data-l10n-id="pdfjs-image-alt-text-settings-button-label">Image alt text settings</span>
                      </button>

                      <div class="horizontalToolbarSeparator"></div>

                      <button id="documentProperties" class="toolbarButton labeled" type="button" title="Document Properties…" tabindex="0" data-l10n-id="pdfjs-document-properties-button" aria-controls="documentPropertiesDialog">
                        <span data-l10n-id="pdfjs-document-properties-button-label">Document Properties…</span>
                      </button>
                    </div>
                  </div>  <!-- secondaryToolbar -->
                </div>
              </div>
            </div>
            <div id="loadingBar">
              <div class="progress">
                <div class="glimmer">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="viewerContainer" tabindex="0">
          <div id="viewer" class="pdfViewer"></div>
        </div>
      </div> <!-- mainContainer -->

      <div id="dialogContainer">
        <dialog id="passwordDialog">
          <div class="row">
            <label for="password" id="passwordText" data-l10n-id="pdfjs-password-label">Enter the password to open this PDF file:</label>
          </div>
          <div class="row">
            <input type="password" id="password" class="toolbarField">
          </div>
          <div class="buttonRow">
            <button id="passwordCancel" class="dialogButton" type="button"><span data-l10n-id="pdfjs-password-cancel-button">Cancel</span></button>
            <button id="passwordSubmit" class="dialogButton" type="button"><span data-l10n-id="pdfjs-password-ok-button">OK</span></button>
          </div>
        </dialog>
        <dialog id="documentPropertiesDialog">
          <div class="row">
            <span id="fileNameLabel" data-l10n-id="pdfjs-document-properties-file-name">File name:</span>
            <p id="fileNameField" aria-labelledby="fileNameLabel">-</p>
          </div>
          <div class="row">
            <span id="fileSizeLabel" data-l10n-id="pdfjs-document-properties-file-size">File size:</span>
            <p id="fileSizeField" aria-labelledby="fileSizeLabel">-</p>
          </div>
          <div class="separator"></div>
          <div class="row">
            <span id="titleLabel" data-l10n-id="pdfjs-document-properties-title">Title:</span>
            <p id="titleField" aria-labelledby="titleLabel">-</p>
          </div>
          <div class="row">
            <span id="authorLabel" data-l10n-id="pdfjs-document-properties-author">Author:</span>
            <p id="authorField" aria-labelledby="authorLabel">-</p>
          </div>
          <div class="row">
            <span id="subjectLabel" data-l10n-id="pdfjs-document-properties-subject">Subject:</span>
            <p id="subjectField" aria-labelledby="subjectLabel">-</p>
          </div>
          <div class="row">
            <span id="keywordsLabel" data-l10n-id="pdfjs-document-properties-keywords">Keywords:</span>
            <p id="keywordsField" aria-labelledby="keywordsLabel">-</p>
          </div>
          <div class="row">
            <span id="creationDateLabel" data-l10n-id="pdfjs-document-properties-creation-date">Creation Date:</span>
            <p id="creationDateField" aria-labelledby="creationDateLabel">-</p>
          </div>
          <div class="row">
            <span id="modificationDateLabel" data-l10n-id="pdfjs-document-properties-modification-date">Modification Date:</span>
            <p id="modificationDateField" aria-labelledby="modificationDateLabel">-</p>
          </div>
          <div class="row">
            <span id="creatorLabel" data-l10n-id="pdfjs-document-properties-creator">Creator:</span>
            <p id="creatorField" aria-labelledby="creatorLabel">-</p>
          </div>
          <div class="separator"></div>
          <div class="row">
            <span id="producerLabel" data-l10n-id="pdfjs-document-properties-producer">PDF Producer:</span>
            <p id="producerField" aria-labelledby="producerLabel">-</p>
          </div>
          <div class="row">
            <span id="versionLabel" data-l10n-id="pdfjs-document-properties-version">PDF Version:</span>
            <p id="versionField" aria-labelledby="versionLabel">-</p>
          </div>
          <div class="row">
            <span id="pageCountLabel" data-l10n-id="pdfjs-document-properties-page-count">Page Count:</span>
            <p id="pageCountField" aria-labelledby="pageCountLabel">-</p>
          </div>
          <div class="row">
            <span id="pageSizeLabel" data-l10n-id="pdfjs-document-properties-page-size">Page Size:</span>
            <p id="pageSizeField" aria-labelledby="pageSizeLabel">-</p>
          </div>
          <div class="separator"></div>
          <div class="row">
            <span id="linearizedLabel" data-l10n-id="pdfjs-document-properties-linearized">Fast Web View:</span>
            <p id="linearizedField" aria-labelledby="linearizedLabel">-</p>
          </div>
          <div class="buttonRow">
            <button id="documentPropertiesClose" class="dialogButton" type="button"><span data-l10n-id="pdfjs-document-properties-close-button">Close</span></button>
          </div>
        </dialog>
        <dialog class="dialog altText" id="altTextDialog" aria-labelledby="dialogLabel" aria-describedby="dialogDescription">
          <div id="altTextContainer" class="mainContainer">
            <div id="overallDescription">
              <span id="dialogLabel" data-l10n-id="pdfjs-editor-alt-text-dialog-label" class="title">Choose an option</span>
              <span id="dialogDescription" data-l10n-id="pdfjs-editor-alt-text-dialog-description">
                Alt text (alternative text) helps when people can’t see the image or when it doesn’t load.
              </span>
            </div>
            <div id="addDescription">
              <div class="radio">
                <div class="radioButton">
                  <input type="radio" id="descriptionButton" name="altTextOption" tabindex="0" aria-describedby="descriptionAreaLabel" checked>
                  <label for="descriptionButton" data-l10n-id="pdfjs-editor-alt-text-add-description-label">Add a description</label>
                </div>
                <div class="radioLabel">
                  <span id="descriptionAreaLabel" data-l10n-id="pdfjs-editor-alt-text-add-description-description">
                    Aim for 1-2 sentences that describe the subject, setting, or actions.
                  </span>
                </div>
              </div>
              <div class="descriptionArea">
                <textarea id="descriptionTextarea" placeholder="For example, “A young man sits down at a table to eat a meal”" aria-labelledby="descriptionAreaLabel" data-l10n-id="pdfjs-editor-alt-text-textarea" tabindex="0"></textarea>
              </div>
            </div>
            <div id="markAsDecorative">
              <div class="radio">
                <div class="radioButton">
                  <input type="radio" id="decorativeButton" name="altTextOption" aria-describedby="decorativeLabel">
                  <label for="decorativeButton" data-l10n-id="pdfjs-editor-alt-text-mark-decorative-label">Mark as decorative</label>
                </div>
                <div class="radioLabel">
                  <span id="decorativeLabel" data-l10n-id="pdfjs-editor-alt-text-mark-decorative-description">
                    This is used for ornamental images, like borders or watermarks.
                  </span>
                </div>
              </div>
            </div>
            <div id="buttons">
              <button id="altTextCancel" class="secondaryButton" type="button" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-cancel-button">Cancel</span></button>
              <button id="altTextSave" class="primaryButton" type="button" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-save-button">Save</span></button>
            </div>
          </div>
        </dialog>
        <dialog class="dialog newAltText" id="newAltTextDialog" aria-labelledby="newAltTextTitle" aria-describedby="newAltTextDescription" tabindex="0">
          <div id="newAltTextContainer" class="mainContainer">
            <div class="title">
              <span id="newAltTextTitle" data-l10n-id="pdfjs-editor-new-alt-text-dialog-edit-label" role="sectionhead" tabindex="0">Edit alt text (image description)</span>
            </div>
            <div id="mainContent">
              <div id="descriptionAndSettings">
                <div id="descriptionInstruction">
                  <div id="newAltTextDescriptionContainer">
                    <div class="altTextSpinner" role="status" aria-live="polite"></div>
                    <textarea id="newAltTextDescriptionTextarea" placeholder="Write your description here…" aria-labelledby="descriptionAreaLabel" data-l10n-id="pdfjs-editor-new-alt-text-textarea" tabindex="0"></textarea>
                  </div>
                  <span id="newAltTextDescription" role="note" data-l10n-id="pdfjs-editor-new-alt-text-description">Short description for people who can’t see the image or when the image doesn’t load.</span>
                  <div id="newAltTextDisclaimer" role="note"><div><span data-l10n-id="pdfjs-editor-new-alt-text-disclaimer1">This alt text was created automatically and may be inaccurate.</span> <a href="https://support.mozilla.org/en-US/kb/pdf-alt-text" target="_blank" rel="noopener noreferrer" id="newAltTextLearnMore" data-l10n-id="pdfjs-editor-new-alt-text-disclaimer-learn-more-url" tabindex="0">Learn more</a></div></div>
                </div>
                <div id="newAltTextCreateAutomatically" class="toggler">
                  <button id="newAltTextCreateAutomaticallyButton" class="toggle-button" type="button" aria-pressed="true" tabindex="0"></button>
                  <label for="newAltTextCreateAutomaticallyButton" class="togglerLabel" data-l10n-id="pdfjs-editor-new-alt-text-create-automatically-button-label">Create alt text automatically</label>
                </div>
                <div id="newAltTextDownloadModel" class="hidden">
                  <span id="newAltTextDownloadModelDescription" data-l10n-id="pdfjs-editor-new-alt-text-ai-model-downloading-progress" aria-valuemin="0" data-l10n-args='{ "totalSize": 0, "downloadedSize": 0 }'>Downloading alt text AI model (0 of 0 MB)</span>
                </div>
              </div>
              <div id="newAltTextImagePreview"></div>
            </div>
            <div id="newAltTextError" class="messageBar">
              <div>
                <div>
                  <span class="title" data-l10n-id="pdfjs-editor-new-alt-text-error-title">Couldn’t create alt text automatically</span>
                  <span  class="description" data-l10n-id="pdfjs-editor-new-alt-text-error-description">Please write your own alt text or try again later.</span>
                </div>
                <button id="newAltTextCloseButton" class="closeButton" type="button" tabindex="0" title="Close"><span data-l10n-id="pdfjs-editor-new-alt-text-error-close-button">Close</span></button>
              </div>
            </div>
            <div id="newAltTextButtons" class="dialogButtonsGroup">
              <button id="newAltTextCancel" type="button" class="secondaryButton hidden" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-cancel-button">Cancel</span></button>
              <button id="newAltTextNotNow" type="button" class="secondaryButton" tabindex="0"><span data-l10n-id="pdfjs-editor-new-alt-text-not-now-button">Not now</span></button>
              <button id="newAltTextSave" type="button" class="primaryButton" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-save-button">Save</span></button>
            </div>
          </div>
        </dialog>

        <dialog class="dialog" id="altTextSettingsDialog" aria-labelledby="altTextSettingsTitle">
          <div id="altTextSettingsContainer" class="mainContainer">
            <div class="title">
              <span id="altTextSettingsTitle" data-l10n-id="pdfjs-editor-alt-text-settings-dialog-label" role="sectionhead" tabindex="0" class="title">Image alt text settings</span>
            </div>
            <div id="automaticAltText">
              <span data-l10n-id="pdfjs-editor-alt-text-settings-automatic-title">Automatic alt text</span>
              <div id="automaticSettings">
                <div id="createModelSetting">
                  <div class="toggler">
                    <button id="createModelButton" type="button" class="toggle-button" aria-pressed="true" tabindex="0"></button>
                    <label for="createModelButton" class="togglerLabel" data-l10n-id="pdfjs-editor-alt-text-settings-create-model-button-label">Create alt text automatically</label>
                  </div>
                  <div id="createModelDescription" class="description">
                    <span data-l10n-id="pdfjs-editor-alt-text-settings-create-model-description">Suggests descriptions to help people who can’t see the image or when the image doesn’t load.</span> <a href="https://support.mozilla.org/en-US/kb/pdf-alt-text" target="_blank" rel="noopener noreferrer" id="altTextSettingsLearnMore" data-l10n-id="pdfjs-editor-new-alt-text-disclaimer-learn-more-url" tabindex="0">Learn more</a>
                  </div>
                </div>
                <div id="aiModelSettings">
                  <div>
                    <span data-l10n-id="pdfjs-editor-alt-text-settings-download-model-label" data-l10n-args='{ "totalSize": 180 }'>Alt text AI model (180MB)</span>
                    <div id="aiModelDescription" class="description">
                      <span data-l10n-id="pdfjs-editor-alt-text-settings-ai-model-description">Runs locally on your device so your data stays private. Required for automatic alt text.</span>
                    </div>
                  </div>
                  <button id="deleteModelButton" type="button" class="secondaryButton" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-settings-delete-model-button">Delete</span></button>
                  <button id="downloadModelButton" type="button" class="secondaryButton" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-settings-download-model-button">Download</span></button>
                </div>
              </div>
            </div>
            <div class="dialogSeparator"></div>
            <div id="altTextEditor">
              <span data-l10n-id="pdfjs-editor-alt-text-settings-editor-title">Alt text editor</span>
              <div id="showAltTextEditor">
                <div class="toggler">
                  <button id="showAltTextDialogButton" type="button" class="toggle-button" aria-pressed="true" tabindex="0"></button>
                  <label for="showAltTextDialogButton" class="togglerLabel" data-l10n-id="pdfjs-editor-alt-text-settings-show-dialog-button-label">Show alt text editor right away when adding an image</label>
                </div>
                <div id="showAltTextDialogDescription" class="description">
                  <span data-l10n-id="pdfjs-editor-alt-text-settings-show-dialog-description">Helps you make sure all your images have alt text.</span>
                </div>
              </div>
            </div>
            <div id="buttons" class="dialogButtonsGroup">
              <button id="altTextSettingsCloseButton" type="button" class="primaryButton" tabindex="0"><span data-l10n-id="pdfjs-editor-alt-text-settings-close-button">Close</span></button>
            </div>
          </div>
        </dialog>
        <dialog id="printServiceDialog" style="min-width: 200px;">
          <div class="row">
            <span data-l10n-id="pdfjs-print-progress-message">Preparing document for printing…</span>
          </div>
          <div class="row">
            <progress value="0" max="100"></progress>
            <span data-l10n-id="pdfjs-print-progress-percent" data-l10n-args='{ "progress": 0 }' class="relative-progress">0%</span>
          </div>
          <div class="buttonRow">
            <button id="printCancel" class="dialogButton" type="button"><span data-l10n-id="pdfjs-print-progress-close-button">Cancel</span></button>
          </div>
        </dialog>
      </div>  <!-- dialogContainer -->

    </div> <!-- outerContainer -->
    <div id="printContainer"></div>
    `;

  var wrapperEle = document.querySelector('body');
  wrapperEle.innerHTML += html;

  PDFViewerApplicationOptions.set('defaultUrl', url);
  webViewerLoad();
  //console.log(AnnotationMode);
}
/*
document.blockUnblockOnload?.(true);
if (document.readyState === "interactive" || document.readyState === "complete") {
  //webViewerLoad();
} else {
  //document.addEventListener("DOMContentLoaded", webViewerLoad, true);
}
*/

var __webpack_exports__slickPdfView = window.slickPdfView;
var __webpack_exports__PDFViewerApplication = __webpack_exports__.PDFViewerApplication;
var __webpack_exports__PDFViewerApplicationConstants = __webpack_exports__.PDFViewerApplicationConstants;
var __webpack_exports__PDFViewerApplicationOptions = __webpack_exports__.PDFViewerApplicationOptions;
export { __webpack_exports__PDFViewerApplication as PDFViewerApplication, __webpack_exports__PDFViewerApplicationConstants as PDFViewerApplicationConstants, __webpack_exports__PDFViewerApplicationOptions as PDFViewerApplicationOptions, __webpack_exports__slickPdfView as slickPdfView};
