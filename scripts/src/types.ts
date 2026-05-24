export interface DiffFile {
  filename: string;
  patch: string;
  validLines: Set<number>;
}

export interface ReviewComment {
  path: string;
  line: number;
  body: string;
}
