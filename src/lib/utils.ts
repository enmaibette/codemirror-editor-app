import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileTreeItem, StarterCode } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildFileTree(starterCode: StarterCode[]): FileTreeItem[] {

  const root: FileTreeItem[] = []
  for (const {path, content: _} of starterCode ) {

    const parts = path.split("/")
    let current = root
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isFile = i === parts.length - 1
      const currentPath = parts.slice(0, i + 1).join("/")
      if (isFile) {
        current.push({ name, path: currentPath, type: 'file' });
      } else {
        let folder = current.find(
          (n): n is FileTreeItem & { type: 'folder'} =>
            n.type === 'folder' && n.name === name
        )
        if(!folder) {
          folder = {type: 'folder', name, path: currentPath, children: []}
          current.push(folder)
        }
        current = folder.children
      }
    }
  }
  return root
}
