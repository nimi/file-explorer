import { expect, describe, it } from "vitest"
import { Tree } from "../modules/tree"

describe("Tree", () => {
  it("should create an empty root if no data is initially provided", () => {
    const tree = Tree.make()
    expect(tree.root).toBeUndefined()
  })

  it("should create a root if data is initially provided", () => {
    const tree = Tree.make({
      type: "folder",
      name: "a",
    })
    expect(tree.root).not.toBeUndefined()
  })

  it("should create a tree with correct structure when config is provided", () => {
    const config = {
      type: "folder",
      name: "a",
      children: [
        {
          type: "folder",
          name: "b",
        },
        {
          type: "folder",
          name: "c",
        },
        {
          type: "file",
          name: "test.js",
          size: 1024,
        },
      ],
    }
    const tree = Tree.make(config)

    expect(tree.root.name).toBe("a")
    expect(tree.root.children.length).toBe(3)

    expect(tree.root.children[0].name).toBe("b")
    expect(tree.root.children[1].name).toBe("c")
    expect(tree.root.children[2].name).toBe("test.js")

    expect(tree.root.children[0].size).toBe(0)
  })

  it("should find children by node when node exists", () => {
    const tree = Tree.make({
      type: "folder",
      name: "a",
      children: [
        {
          type: "folder",
          name: "b",
          children: [
            {
              type: "folder",
              name: "c",
            },
            {
              type: "folder",
              name: "d",
            },
          ],
        },
      ],
    })
    expect(tree.findChildren("b")).not.toBeUndefined()
    expect(tree.findChildren("b").length).toBe(2)
  })

  it("should not find children by node when node does not exist", () => {
    const tree = Tree.make({
      type: "folder",
      name: "a",
      children: [
        {
          type: "folder",
          name: "b",
          children: [
            {
              type: "folder",
              name: "c",
            },
            {
              type: "folder",
              name: "d",
            },
          ],
        },
      ],
    })
    expect(tree.findChildren("nope")).toBeUndefined()
  })
})
