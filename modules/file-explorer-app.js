import { tree } from "./tree.js"

import "../modules/directory-content.js"
import "../modules/directory-tree.js"

const DEFAULT_SELECTED_DIR = "Files"

export class FileExplorerApp extends HTMLElement {
  static styles = `
    :host {
      display: flex;
      height: 100vh;
      flex-direction: column;
    }
    :host > div {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    nav {
      flex: 1;
      border-right: solid 1px var(--border-color);
      padding: var(--size-sm);
      position: relative;
    }
    main {
      position: relative;
      padding: var(--size-sm) 0;
      width: var(--size-xl);
    }
    .handle {
      content: '↔️';
      position: absolute;
      height: 100%;
      display: flex;
      align-items: center;
      margin-left: calc(var(--size-lg) * -1);
      cursor: pointer;
      background: var(--border-color);
      padding: 0 var(--size-xs);
      top: 0;
    }

    @media (min-width: 768px) {
      nav {
        flex: 0 0 var(--size-side-nav);
      }

      main {
        width: auto;
        flex: 1;
      }

      .handle {
        display: none;
      }
    }
  `

  constructor() {
    super()
    this.selectedDir = DEFAULT_SELECTED_DIR
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" })

    this.updateView()
  }

  updateView(data = tree) {
    this.render()
    this.loadData(data)
    this.setEventListeners()
  }

  loadData(data) {
    this.shadowRoot.querySelector("directory-tree").data = data
    this.shadowRoot.querySelector("directory-content").data = data
  }

  setEventListeners() {
    this.shadowRoot
      .querySelector(".file-explorer")
      .addEventListener("dir-select", (e) => {
        this.selectedDir = e.detail.id
        this.shadowRoot
          .querySelector("directory-content")
          .setAttribute("dir", this.selectedDir)
        this.shadowRoot
          .querySelector("directory-tree")
          .setAttribute("dir", this.selectedDir)
      })

    const main = this.shadowRoot.querySelector("main")
    main.querySelector(".handle").addEventListener("mousedown", (event) => {
      const startX = event.clientX
      const startWidth = parseInt(window.getComputedStyle(main).width, 10)
      this.onHandleDrag = (event) =>
        this.#onHandleDrag({ event, startWidth, startX })
      document.addEventListener("mousemove", this.onHandleDrag)
      document.addEventListener("mouseup", this.onHandleStopDrag.bind(this))
    })
  }

  #onHandleDrag({ event, startWidth, startX }) {
    const main = this.shadowRoot.querySelector("main")
    let width = startWidth + (event.clientX - startX) * -1

    if (event.clientX <= 30) {
      width = startX - 30
    } else if (width < 30) {
      width = 30
    }

    main.style.width = `${width}px`
  }

  onHandleStopDrag() {
    document.removeEventListener("mousemove", this.onHandleDrag)
    document.removeEventListener("mouseup", this.onHandleStopDrag)
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${FileExplorerApp.styles}</style>
      <div class="file-explorer">
        <nav>
          <directory-tree dir="${this.selectedDir}"></directory-tree>
        </nav>
        <main>
          <div class="handle">↔️</div>
          <directory-content dir="${this.selectedDir}"></directory-content>
        </main>
      </div>
    `
  }
}

customElements.define("file-explorer-app", FileExplorerApp)
