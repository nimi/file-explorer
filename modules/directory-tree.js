export class DirectoryTree extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = `
      <span>directory tree</span>
    `
  }
}

customElements.define("directory-tree", DirectoryTree)
