const DEFAULT_DATE = new Date("July 2020")
const DIRECTORY = "folder"
const FILE = "file"

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
