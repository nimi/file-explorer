import { ICON_MAP, DIRECTORY, FILE } from "./constants.js"
import { humanReadableSize } from "./utils.js"

const renderRow = (item) => `
  <tr role="row" class="content-item">
    <td role="gridcell" class="type" class="item-type">
      <span role="img" alt="${item.type}">${ICON_MAP[item.type]}</span>
    </td>
    <td role="gridcell" class="item-name">
      ${
        item.type === DIRECTORY
          ? `<button class="directory" id="${item.name}">${item.name}</button>`
          : `<span id="${item.name}">${item.name}</span>`
      }
    </td>
    <td role="gridcell" class="item-modified">${
      item.modified
        ? new Intl.DateTimeFormat("en-US").format(new Date(item.modified))
        : "7/6/20"
    }</td>
    <td role="gridcell" class="item-size">${humanReadableSize(item.size)}</td>
  </tr>`

const renderRows = (items) => `
  <tbody>
    ${items.map((item) => renderRow(item)).join("")}
  </tbody>
`

export class DirectoryContent extends HTMLElement {
  static styles = `
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      overflow: visible;
      margin-top: 8px;
      width: 100%;
    }

    thead {
      border-bottom: 1px solid #e3e3e3;
    }

    thead th {
      position: relative;
      line-height: 16px;
      vertical-align: bottom;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      text-align: left;
    }

    th {
      padding: 0 0.5rem 1rem;
    }

    button:focus,
    button:focus {
      outline: 1px dashed rgba(0, 0, 0, 0.6);
      margin: 0;
    }
    button {
      width: 100%;
    }

    td {
      padding: 0.5rem;
    }

    tbody tr:hover {
      background-color: #eee;
    }

    .directory {
      all: unset;
      cursor: pointer;
      line-height: 2rem;
      flex: 1 1 auto;
      grid-area: directory;
    }

    .type {
      text-align: right;
    }

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
  `

  static get observedAttributes() {
    return ["dir"]
  }

  get data() {
    return this._data || []
  }

  set data(tree) {
    this._tree = tree
    this._data = tree.toJSON()
    this.render()
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.render()
  }

  render() {
    const { data } = this
    const dirName = "Folder"
    const contents = (data && this._tree?.findChildren(dirName)) ?? []
    const contentTable = `
      <table role="grid" aria-readonly="true">
        <thead>
          <tr role="row">
            <th role="columnheader" scope="col"></th>
            <th role="columnheader" scope="col">
              Name
            </th>
            <th role="columnheader" scope="col">
              Date Modified
            </th>
            <th role="columnheader" scope="col">
              File Size
            </th>
          </tr>
        </thead>
        ${renderRows(contents)}
      </table>
    `
    const empty = `
      <div class="empty">🪹 Empty directory</div>
    `
    this.shadowRoot.innerHTML = `
      <style>
        ${DirectoryContent.styles}
      </style>
      ${contents.length ? contentTable : empty}
    `
  }
}

customElements.define("directory-content", DirectoryContent)
