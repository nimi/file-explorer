import { DIRECTORY } from "./constants.js"

const isDirectory = (item) => item.type === DIRECTORY
const hasChildDirectories = (item) =>
  item.children &&
  item.children.length &&
  item.children.some((child) => child.type === DIRECTORY)

const renderTreeItems = (items, { toggled } = {}) => `
  <ul>
    ${[...items]
      .filter(isDirectory)
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      .map((item) => {
        return renderTreeItem(item, { toggled })
      })
      .join("")}
  </ul>
`

const renderTreeItem = (item, { toggled } = {}) => `
  <li>
    <button
      hidden="${hasChildDirectories(item) ? "false" : "true"}"
      class="directory-toggle" aria-expanded="${
        toggled?.get(item.name) ? "true" : "false"
      }"
    >
      <span role="img" aria-label="">▶</span>
      <span class="visually-hidden">Toggle directory</span>
    </button>
    <button class="directory" id="${item.name}">
      <span class="directory-icon" role="img" aria-label="">📂</span>
      <span class="directory-label">${item.name}</span>
    </button>
    ${
      item.children && !!toggled?.get(item.name)
        ? renderTreeItems(item.children, { toggled })
        : ""
    }
  </li>`

const isOpen = (node) => node.getAttribute("aria-expanded") === "true"

export class DirectoryTree extends HTMLElement {
  static styles = `
    [hidden='true'] {
      display: none;
    }

    button:focus,
    button:active {
      outline: var(--outline-color) dashed 1px !important;
    }

    .selected {
      background-color: var(--selected-color);
    }

    button[aria-expanded='false'] + button + ul {
      display: none;
    }

    button[aria-expanded='true'] {
      transform: rotate(90deg);
    }

    ul {
      padding-left: 0;
    }

    ul ul {
      grid-area: children;
      padding-left: var(--size-lg);
    }

    li {
      list-style-type: none;
      display: grid;
      align-items: center;
      grid-template-columns: var(--size-lg) auto;
      grid-template-rows: auto;
      grid-template-areas:
        "toggle directory"
        "children children";
    }

    li > div {
      display: inline-flex;
      align-items: center;
      width: 100%;
    }

    button {
      all: unset;
      cursor: pointer;
    }

    .directory {
      line-height: var(--size-xl);
      padding-left: var(--size-sm);
      flex: 1 1 auto;
      font-weight: 500;
      grid-area: directory;
    }

    .directory-icon {
      padding-right: var(--size-sm);
      display: inline-block;
    }

    .directory-toggle {
      line-height: calc(var(--size-sm) + 0.1rem);
      text-align: center;
      width: var(--size-lg);
      height: var(--size-lg);
      grid-area: toggle;
    }

    .visually-hidden:not(:focus):not(:active) {
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  `

  static get observedAttributes() {
    return ["dir"]
  }

  get data() {
    return this._data || []
  }

  set data(tree) {
    this._data = tree.toJSON()
    this.updateView()
  }

  constructor() {
    super()
    this.toggled = new Map()
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.updateView()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "dir" || !this.shadowRoot) return

    this.updateView()
  }

  setEventListeners() {
    const root = this.shadowRoot
    const items = root?.querySelectorAll("li") || []

    for (var i = 0; i < items.length; i++) {
      this.setActiveItem(items[i])
    }
  }

  updateView() {
    this.render()
    this.setEventListeners()
  }

  setActiveItem(item) {
    const dir = item.querySelector(".directory")
    const toggle = item.querySelector(".directory-toggle")
    const toggleExpanded = () => {
      if (isOpen(toggle)) {
        this.toggled.set(dir.id, false)
        toggle.setAttribute("aria-expanded", "false")
      } else {
        this.toggled.set(dir.id, true)
        toggle.setAttribute("aria-expanded", "true")
      }

      this.updateView()
    }

    if (dir.id === this.getAttribute("dir")) {
      dir.classList.add("selected")
    }

    toggle.addEventListener("click", toggleExpanded)

    dir.addEventListener("click", () => {
      const lastSelected = this.shadowRoot.querySelector(".selected")

      if (lastSelected) {
        lastSelected.classList.remove("selected")
      }

      if (!isOpen(toggle)) {
        this.toggled.set(dir.id, true)
        toggle.setAttribute("aria-expanded", "true")
      }

      dir.classList.add("selected")

      this.dispatchEvent(
        new CustomEvent("dir-select", {
          detail: {
            id: dir.id,
          },
          bubbles: true,
        })
      )
    })
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${DirectoryTree.styles}
      </style>
      <div class="directory-tree">
        ${renderTreeItems([this.data], { toggled: this.toggled })}
      </div>
    `
  }
}

customElements.define("directory-tree", DirectoryTree)
