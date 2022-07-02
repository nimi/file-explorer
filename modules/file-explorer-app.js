export class FileExplorerApp extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = `
      <div>
        <nav>
          tree
        </nav>
        <main>
          content
        </main>
      </div>
    `
  }
}

customElements.define("file-explorer-app", FileExplorerApp)
