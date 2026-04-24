export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type TestCaseStatus = 'pending' | 'pass' | 'fail';
export type ConsoleTab = 'output' | 'testcases';

export interface TestCase {
  id: string;
  title: string;
  expected: string;
  got: string;
  status: TestCaseStatus;
}

export interface Hint {
  id: string;
  text: string;
}
export interface StarterCode {
  path: string;
  content: string;
}
export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  descriptionMarkdown: string;
  starterCode: StarterCode[];
  hints: Hint[];
  testCases: TestCase[];
}

export type FileTreeItem = {
  name: string
  path: string
} & (
  | {type: 'file'; children?: never}
  | {type: 'folder'; children: FileTreeItem[]}
  )
