import { PersonId } from "@piconex/iam";
import { CaseNoteId } from "../../shared";

export class CaseNote {
  private readonly noteId: CaseNoteId;
  private readonly authorId: PersonId;

  private readonly text: string;
  private readonly important: boolean;

  private readonly createdAt: Date;

  private constructor(
    noteId: CaseNoteId,
    authorId: PersonId,
    text: string,
    important: boolean,
    createdAt: Date,
  ) {
    this.noteId = noteId;
    this.authorId = authorId;
    this.text = text;
    this.important = important;
    this.createdAt = createdAt;
  }

  static createNew(
    noteId: CaseNoteId,
    authorId: PersonId,
    text: string,
    important: boolean,
  ): CaseNote {
    if (!text || text.trim().length === 0) {
      throw new Error("Case note text cannot be empty");
    }

    return new CaseNote(noteId, authorId, text, important, new Date());
  }

  static restore(props: {
    noteId: CaseNoteId;
    authorId: PersonId;
    text: string;
    important: boolean;
    createdAt: Date;
  }): CaseNote {
    return new CaseNote(
      props.noteId,
      props.authorId,
      props.text,
      props.important,
      props.createdAt,
    );
  }

  getNoteId(): CaseNoteId {
    return this.noteId;
  }

  getAuthorId(): PersonId {
    return this.authorId;
  }

  getText(): string {
    return this.text;
  }

  isImportant(): boolean {
    return this.important;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
