/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/modules/app.js
class App {
  /**
   * @description
   * Свойства и методы экземпляра класса `Burger`.
   *
   * @type {AppBurger}
   */
  static burger = {
    close: undefined,
    isActive: false,
    matchMedia: undefined
  }

  /**
   * @description
   * Свойства экземпляра класса `Dialogs`.
   *
   * @type {AppDialogs}
   */
  static dialogs = {
    activeDialogs: 0
  };

  /**
   * @description
   * Хранит элементы `html` и `body`.
   *
   * @type {AppDocument}
   */
  static document = {
    body: document.body,
    html: document.documentElement
  }

  /**
   * @description
   * Свойства экземпляра класса `HeaderObserver`.
   *
   * @type {AppHeaderObservers}
   */
  static headerObservers = {
    $header: document.querySelector("[data-header=\"header\"]")
  }

  /**
   * @description
   * Свойства элемента `html`.
   *
   * @type {AppHTML}
   */
  static html = {
    htmlClassList: this.document.html.classList,
    htmlStyle: this.document.html.style
  }
}



;// CONCATENATED MODULE: ./src/js/modules/header-observers.js


const { headerObservers: { $header }, html: { htmlClassList, htmlStyle } } = App;

class HeaderObservers {
  #$header = $header;
  /** @type {HTMLDivElement} */
  #$headerWrapper = document.querySelector("[data-header=\"wrapper\"]");
  #addingClass = "scrolled";
  #cssProperty = "--header-height";
  #intersection;
  #resize;

  /** @param {HeaderObserversOptions} options */
  constructor(options = {}) {
    this.#intersection = options.intersection ?? true;
    this.#resize = options.resize ?? true;

    this.#init();
  }

  #init() {
    if (this.#intersection && this.#$header) {
      const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          htmlClassList.toggle(this.#addingClass, !entry.isIntersecting);
        });
      });

      intersectionObserver.observe(this.#$header);
    }

    if (this.#resize && this.#$headerWrapper) {
      const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { borderBoxSize: [{ blockSize }] } = entry;

          htmlStyle.setProperty(this.#cssProperty, `${blockSize}px`);
        });
      });

      resizeObserver.observe(this.#$headerWrapper);
    }
  }
}



;// CONCATENATED MODULE: ./src/js/scripts/scripts/header-observers.js


const headerObservers = new HeaderObservers();

;// CONCATENATED MODULE: ./src/js/modules/scrolling.js


const { html: { htmlClassList: scrolling_htmlClassList, htmlStyle: scrolling_htmlStyle }, document: { body } } = App;
const cssProperty = "--scrollbar-width";
const fixedElements = document.querySelectorAll("[data-fixed]");

fixedElements?.forEach(fixedElement => {
  fixedElement.style.paddingRight = `var(${cssProperty})`;
});

body.style.paddingRight = `var(${cssProperty})`;

class Scrolling {
  static #addingClass = "scroll-lock";

  /**
   * @description
   * Скрывает скроллбар.
   *
   * @returns {void}
   */
  static lock() {
    scrolling_htmlStyle.setProperty(`${cssProperty}`, `${this.#scrollbarWidth}px`);
    scrolling_htmlClassList.add(this.#addingClass);
  }

  /**
   * @description
   * Показывет скроллбар.
   *
   * @returns {void}
   */
  static unlock() {
    scrolling_htmlStyle.removeProperty(`${cssProperty}`);
    scrolling_htmlClassList.remove(this.#addingClass);
  }

  static get #scrollbarWidth() {
    return innerWidth - body.offsetWidth;
  }
}



;// CONCATENATED MODULE: ./src/js/modules/burger.js



const { burger: app, dialogs, document: { body: burger_body }, headerObservers: { $header: burger_$header }, html: { htmlClassList: burger_htmlClassList } } = App;
const selectors = {
  button: "[data-burger=\"button\"]",
  close: "[data-burger=\"close\"]",
  menu: "[data-burger=\"menu\"]",
  open: "[data-burger=\"open\"]",
  wrapper: "[data-burger=\"wrapper\"]",
  pageWrapper: "[data-wrapper]",
};
const { button: burger_button, close: burger_close, menu, open: burger_open, wrapper } = selectors;
/** @type {HTMLButtonElement} */
const $button = document.querySelector(burger_button);
const $menu = document.querySelector(menu);
const $placeholder = document.createElement("div");
const addingClass = "burger-active";
const buttons = !$button &&
  document.querySelector(burger_open) && document.querySelector(burger_close) ?
  {
    /** @type {HTMLButtonElement} */
    $close: document.querySelector(burger_close),
    /** @type {HTMLButtonElement} */
    $open: document.querySelector(burger_open)
  } : null;
const id = `burgerID-${Date.now().toString(36)}`;
const isButtonsSame = !!$button;
const menuLabel = $menu?.ariaLabel || $menu?.querySelector("nav")?.ariaLabel;

class Burger {
  #a11y;
  #breakpoint;
  #inertingElements;
  #matchMedia;
  #onClickOutside = this.#closeOnClickOutside.bind(this);
  #onClose = this.close.bind(this);
  #onEscape = this.#closeOnEscape.bind(this);
  #onOpen = this.open.bind(this);
  #onToggle = this.#toggle.bind(this);

  /** @param {BurgerOptions} options */
  constructor(options = {}) {
    if (($button || buttons) && $menu) {
      this.#breakpoint = options.breakpoint ?? 768;

      if (this.#breakpoint) {
        this.#matchMedia = matchMedia(`(max-width: ${this.#breakpoint}px)`);
      }

      this.#a11y = {
        buttonsLabels: {
          close: options.a11y?.buttonsLabels?.close ?? `Закрыть "${menuLabel || "бургер-меню"}"`,
          open: options.a11y?.buttonsLabels?.open ?? `Открыть "${menuLabel || "бургер-меню"}"`
        },
        inertElementsSelectors: options.a11y?.inertElementsSelectors ?? `${selectors.pageWrapper} > *:not(${selectors.wrapper})`,
        moveMenu: options.a11y?.moveMenu ?? false,
        wrapperSelector: options.a11y?.wrapperSelector ?? wrapper
      }
      this.#inertingElements = document.querySelectorAll(this.#a11y.inertElementsSelectors);

      this.#init();
    }
  }

  #init() {
    $menu.id = id;
    $placeholder.hidden = true;
    app.close = this.#onClose;
    app.matchMedia = this.#matchMedia;

    if (this.#breakpoint) {
      this.#matchMedia.matches ? this.#activate() : this.#hideButtons();

      this.#matchMedia.addEventListener("change", event => {
        const { matches } = event;

        if (matches) {
          this.#activate();
          this.#showButtons();
        } else {
          if (app.isActive) this.close(true);

          this.#inactivate();
          this.#hideButtons();
        }
      });
    } else {
      this.#activate();
    }
  }

  #activate() {
    if (isButtonsSame) {
      $button.ariaLabel = this.#a11y.buttonsLabels.open;
      $button.setAttribute("aria-controls", id);
      $button.ariaExpanded = false;
      $button.addEventListener("click", this.#onToggle);
    } else {
      buttons.$open.ariaLabel = this.#a11y.buttonsLabels.open;
      buttons.$open.setAttribute("aria-controls", id);
      buttons.$open.ariaExpanded = false;
      buttons.$open.addEventListener("click", this.#onOpen);
      buttons.$close.ariaLabel = this.#a11y.buttonsLabels.close;
      buttons.$close.addEventListener("click", this.#onClose);
    }

    if (this.#a11y.moveMenu) {
      $menu.insertAdjacentElement("afterend", $placeholder);

      burger_$header ? burger_$header.insertAdjacentElement("afterend", $menu) :
        burger_body.insertAdjacentElement("afterbegin", $menu);
    }
  }

  #inactivate() {
    if (isButtonsSame) {
      $button.removeAttribute("aria-label");
      $button.removeAttribute("aria-controls");
      $button.removeAttribute("aria-expanded");
      $button.removeEventListener("click", this.#onToggle);
    } else {
      buttons.$open.removeAttribute("aria-label");
      buttons.$open.removeAttribute("aria-controls");
      buttons.$open.removeAttribute("aria-expanded");
      buttons.$open.removeEventListener("click", this.#onOpen);
      buttons.$close.removeAttribute("aria-label");
      buttons.$close.removeEventListener("click", this.#onClose);
    }

    if (this.#a11y.moveMenu) {
      $placeholder.insertAdjacentElement("afterend", $menu);
      $placeholder.remove();
    }
  }

  #hideButtons() {
    if (isButtonsSame) {
      $button.hidden = true;
    } else {
      buttons.$open.hidden = true;
      buttons.$close.hidden = true;
    }
  }

  #showButtons() {
    if (isButtonsSame) {
      $button.hidden = false;
    } else {
      buttons.$open.hidden = false;
      buttons.$close.hidden = false;
    }
  }

  #toggle() {
    app.isActive ? this.close() : this.open();
  }

  /**
   * @description
   * Открывает бургер-меню.
   *
   * @returns {void}
   */
  open() {
    app.isActive = true;

    if (isButtonsSame) {
      $button.ariaLabel = this.#a11y.buttonsLabels.close;
      $button.ariaExpanded = true;
    } else {
      buttons.$open.ariaExpanded = true;
      buttons.$close.focus();
    }

    this.#inertingElements?.forEach(inertElement => {
      inertElement.setAttribute("inert", "");
    });

    document.addEventListener("keydown", this.#onEscape);
    document.addEventListener("click", this.#onClickOutside);
    Scrolling.lock();
    burger_htmlClassList.add(addingClass);
  }

  /**
   * @description
   * Закрывает бургер-меню.
   *
   * @param {boolean} force - Если `true`, бургер-меню закроется принудительно. По умолчанию `false`.
   *
   * @returns {void}
   */
  close(force = false) {
    if (force || !dialogs.activeDialogs) {
      app.isActive = false;

      if (isButtonsSame) {
        $button.ariaLabel = this.#a11y.buttonsLabels.open;
        $button.ariaExpanded = false;
        $button.focus();
      } else {
        buttons.$open.ariaExpanded = false;
        buttons.$open.focus();
      }

      this.#inertingElements?.forEach(inertElement => {
        inertElement.removeAttribute("inert");
      });

      document.removeEventListener("keydown", this.#onEscape);
      document.removeEventListener("click", this.#onClickOutside);

      if (!dialogs.activeDialogs) Scrolling.unlock();

      burger_htmlClassList.remove(addingClass);
    }
  }

  /** @param {KeyboardEvent} event */
  #closeOnEscape(event) {
    if (event.code === "Escape") this.close();
  }

  /** @param {MouseEvent} event */
  #closeOnClickOutside(event) {
    /** @type {{target: Element}} */
    const { target } = event;

    if (isButtonsSame) {
      if (!target.closest(this.#a11y.wrapperSelector) && !target.closest(burger_button) && !target.closest(menu)) this.close();
    } else {
      if (!target.closest(this.#a11y.wrapperSelector) && !target.closest(burger_open) && !target.closest(menu)) this.close();
    }
  }
}



;// CONCATENATED MODULE: ./src/js/scripts/scripts/burger.js


const burger = new Burger();

;// CONCATENATED MODULE: ./src/js/scripts/scripts/up.js
/** @type {HTMLButtonElement} */
const upButton = document.querySelector(".up");
/** @type {NodeListOf<HTMLAnchorElement | HTMLButtonElement>} */
const firstFocusableElements = document.querySelectorAll("[data-up]");

upButton?.addEventListener("click", () => {
  let isFocused = false;

  scrollTo({
    top: 0,
  });

  firstFocusableElements?.forEach(element => {
    if (!isFocused) {
      const { dataset } = element;

      let { up } = dataset;

      up = up.trim();

      if (up) {
        const media = matchMedia(up);
        const { matches } = media;

        if (matches) {
          element.focus();

          isFocused = true;
        }
      } else {
        element.focus();

        isFocused = true;
      }
    }
  });
});

;// CONCATENATED MODULE: ./src/js/scripts/scripts.js




;// CONCATENATED MODULE: ./src/js/script.js


/******/ })()
;