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

export interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  descriptionMarkdown: string;
  starterCode: string;
  hints: Hint[];
  testCases: TestCase[];
}
