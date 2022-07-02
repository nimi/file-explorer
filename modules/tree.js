import { DIRECTORY, FILE } from "./constants"

const DEFAULT_DATE = new Date("July 2020")

/**
 interface ITreeNode {
    type: 'file' | 'folder',
    name: string,
    modified: Date,
    size: number,
    children?: ITreeNode[]
  }
  */

export class TreeNode {
  static make = (args) => new TreeNode(args)

  constructor(args = {}) {
    if (!args.name) {
      throw new Error("TreeNode is missing `name`. This is a required property")
    }
    this.name = args.name
    this.type = args.type === DIRECTORY ? DIRECTORY : FILE
    this.modified = args.modified || DEFAULT_DATE
    this.size = args.size ?? 0
    this.children = args.children ? args.children.map(TreeNode.make) : undefined
  }
}

export class Tree {
  static make = (args) => new Tree(args)

  constructor(root) {
    this.root = root ? TreeNode.make(root) : undefined
  }

  findChildren(name, root = this.root) {
    if (!root) return undefined
    if (root.name === name) {
      return root.children
    }

    let children = root.children ?? []

    for (const child of children) {
      const maybeFound = this.findChildren(name, child)

      if (maybeFound) {
        return maybeFound
      }
    }
  }

  toJSON() {
    if (!this.root) return undefined

    const { name, type, modified, size, children } = this.root
    return {
      name,
      type,
      modified,
      size,
      children: JSON.parse(JSON.stringify(children || null)),
    }
  }
}

export const tree = Tree.make({
  type: "folder",
  name: "Files",
  children: [
    {
      type: "folder",
      name: "Documents",
      size: 0,
      children: [
        {
          type: "folder",
          name: "More documents",
        },
        {
          type: "folder",
          name: "Misc",
        },
      ],
    },
    {
      type: "folder",
      name: "Images",
    },
    {
      type: "folder",
      name: "System",
    },
    {
      type: "file",
      name: "Description.rtf",
      size: 1024,
    },
    {
      type: "file",
      name: "Description.txt",
      size: 1024 * 2,
    },
  ],
})
