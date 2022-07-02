import { DIRECTORY } from "./constants.js"

const isDirectory = (item) => item.type === DIRECTORY
const hasChildDirectories = (item) =>
  item.children &&
  item.children.length &&
  item.children.some((child) => child.type === DIRECTORY)

const renderTreeItems = (items) => `
  <ul>
    ${[...items]
      .filter(isDirectory)
      .map((item) => {
        return renderTreeItem(item)
      })
      .join("")}
  </ul>
`

const renderTreeItem = (item) => `
  <li>
    <button
      hidden="${hasChildDirectories(item) ? "false" : "true"}"
      class="directory-toggle" aria-expanded="false"
    >
      <span role="img" aria-label="">▶</span>
      <span class="visually-hidden">Toggle directory</span>
    </button>
    <button class="directory" id="${item.name}">
      <span class="directory-icon" role="img" aria-label="">📂</span>
      <span class="directory-label">${item.name}</span>
    </button>
    ${item.children ? renderTreeItems(item.children) : ""}
  </li>`

export class DirectoryTree extends HTMLElement {
  static styles = `
    [hidden='true'] {
      display: none;
    }

    button:focus,
    button:active {
      outline: yellow solid 2px !important;
    }

    .selected {
      background-color: var(--selected);
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
      padding-left: 1.5rem;
    }

    li {
      list-style-type: none;
      display: grid;
      align-items: center;
      grid-template-columns: 1.5rem auto;
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
      line-height: 2rem;
      padding-left: 0.5rem;
      flex: 1 1 auto;
      font-weight: 500;
      grid-area: directory;
    }

    .directory-icon {
      padding-right: 0.5rem;
      display: inline-block;
    }

    .directory-toggle {
      line-height: 0.6rem;
      text-align: center;
      width: 1.5rem;
      height: 1.5rem;
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

  get data() {
    return this._data || []
  }

  set data(tree) {
    this._data = tree.toJSON()
    this.render()
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" })

    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${DirectoryTree.styles}
      </style>
      <div class="directory-tree">
        ${renderTreeItems([this.data])}
      </div>
    `
  }
}

customElements.define("directory-tree", DirectoryTree)
