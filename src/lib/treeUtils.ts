import type { FileTreeItem } from '@/types';

export function insertNodeInTree(tree: FileTreeItem[], parentPath: string, node: FileTreeItem): FileTreeItem[] {
  if (parentPath === '') return [...tree, node];
  return tree.map((item) => {
    if (item.type === 'folder' && item.path === parentPath) {
      return { ...item, children: [...item.children, node] };
    }
    if (item.type === 'folder') {
      return { ...item, children: insertNodeInTree(item.children, parentPath, node) };
    }
    return item;
  });
}

export function removeNodeFromTree(tree: FileTreeItem[], path: string): FileTreeItem[] {
  return tree
    .filter((item) => item.path !== path)
    .map((item) =>
      item.type === 'folder'
        ? { ...item, children: removeNodeFromTree(item.children, path) }
        : item
    );
}

export function renameNodeInTree(tree: FileTreeItem[], path: string, newName: string): FileTreeItem[] {
  return tree.map((item) => {
    if (item.path === path) return { ...item, name: newName };
    if (item.type === 'folder') {
      return { ...item, children: renameNodeInTree(item.children, path, newName) };
    }
    return item;
  });
}
