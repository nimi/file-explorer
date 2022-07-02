import type { IWindow } from "happy-dom"
import { beforeEach, describe, it, expect } from "vitest"

import "../modules/file-explorer-app"

declare global {
  interface Window extends IWindow {}
}

describe("File explorer", async () => {
  beforeEach(async () => {
    document.body.innerHTML = "<file-explorer-app></file-explorer-app>"
    await window.happyDOM.whenAsyncComplete()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  function getDirectoryTree() {
    const el = document.body.querySelector("file-explorer-app")
    return el?.shadowRoot?.querySelector("directory-tree")?.shadowRoot
  }

  function getDirectoryContents() {
    const el = document.body.querySelector("file-explorer-app")
    return el?.shadowRoot?.querySelector("directory-content")?.shadowRoot
  }

  it("should render a single initially collapsed directory tree", () => {
    const directoryTree = getDirectoryTree()
    const directories = directoryTree?.querySelectorAll(".directory")
    expect(directories.length).toBe(1)
  })

  it("should render the default 'Files' directory contents", () => {
    const directoryContents = getDirectoryContents()
    const items = directoryContents?.querySelectorAll(".content-item")
    expect(items?.length).toBe(5)
    expect(items[0].querySelector(".item-name").innerHTML).toContain(
      "Documents"
    )
    expect(items[1].querySelector(".item-name").innerHTML).toContain("Images")
    expect(items[2].querySelector(".item-name").innerHTML).toContain("System")
    expect(items[3].querySelector(".item-name").innerHTML).toContain(
      "Description.rtf"
    )
    expect(items[4].querySelector(".item-name").innerHTML).toContain(
      "Description.txt"
    )
  })
})
