abstract class StringValueObject {
  protected constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error(`${this.constructor.name} cannot be empty`);
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }
}

export class DocumentationRequestId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): DocumentationRequestId {
    return new DocumentationRequestId(value);
  }
}

export class CaseId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): CaseId {
    return new CaseId(value);
  }
}

export class DocumentationId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): DocumentationId {
    return new DocumentationId(value);
  }
}

export class MeetingId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): MeetingId {
    return new MeetingId(value);
  }
}

export class PersonId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): PersonId {
    return new PersonId(value);
  }
}

export class MessageThreadId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): MessageThreadId {
    return new MessageThreadId(value);
  }
}

export class MessageId extends StringValueObject {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): MessageId {
    return new MessageId(value);
  }
}

export class DurationMinutes {
  private constructor(private readonly value: number) {}

  static create(value: unknown): DurationMinutes {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new Error("Duration must be a valid number");
    }

    if (value <= 0) {
      throw new Error("Duration must be greater than 0");
    }

    if (!Number.isInteger(value)) {
      throw new Error("Duration must be an integer number of minutes");
    }

    return new DurationMinutes(value);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: DurationMinutes): boolean {
    return this.value === other.value;
  }

  add(other: DurationMinutes): DurationMinutes {
    return DurationMinutes.create(this.value + other.value);
  }
}
