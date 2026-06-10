export type Note = {
  id: string;          // sha1(path) truncated to 12
  path: string;        // absolute path, source of truth
  title: string;       // first H1, or filename
  body: string;        // raw markdown
  imported_at: string; // ISO 8601
};

export type IndexEntry = {
  token: string;
  note_ids: string[];
};

export type NotesFile = { notes: Note[] };
export type IndexFile = { tokens: IndexEntry[] };