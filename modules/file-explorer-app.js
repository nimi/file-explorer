import "../modules/directory-content.js"
import "../modules/directory-tree.js"

export class FileExplorerApp extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = `
      <div>
        <nav>
          <directory-tree></directory-tree>
        </nav>
        <main>
          <directory-content></directory-content>
        </main>
      </div>
    `
  }
}

customElements.define("file-explorer-app", FileExplorerApp)
