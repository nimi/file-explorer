export class DirectoryContent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = `
      <span>directory content</span>
    `
  }
}

customElements.define("directory-content", DirectoryContent)
