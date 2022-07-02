import "../modules/directory-content.js"
import "../modules/directory-tree.js"

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
      padding: var(--size-md);
      position: relative;
    }
    main {
      position: relative;
      padding: var(--size-sm) 0;
      width: var(--size-xl);
    }

    @media (min-width: 768px) {
      nav {
        flex: 0 0 var(--size-side-nav);
      }

      main {
        width: auto;
        flex: 1;
      }
    }
  `

  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = `
      <style>${FileExplorerApp.styles}</style>
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
