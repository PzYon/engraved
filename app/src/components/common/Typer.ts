export class Typer {
  private typeTimer: unknown;
  private readonly cursorInterval: unknown;

  private readonly typoProbability: number = 0.1;
  private readonly blinkDurationMs = 500;
  private readonly idleBlinkDuration = this.blinkDurationMs * 2;

  public constructor(
    private textToType: string,
    private printText: (text: string) => void,
    private toggleCursor?: (show?: boolean) => void
  ) {
    if (toggleCursor) {
      this.cursorInterval = setInterval(
        this.toggleCursor,
        this.blinkDurationMs
      ) as never;
    }
  }

  private static getTypeInMs() {
    return Math.random() * 200 + 50;
  }

  public start() {
    this.typeNextChar();
  }

  public end = (): void => {
    this.toggleCursor(false);
    clearTimeout(this.typeTimer as number);
    clearInterval(this.cursorInterval as number);
  };

  private typeNextChar(index = 0): void {
    const hasNotStarted = index === 0;
    const isDone = index > this.textToType.length;
    const delay =
      hasNotStarted || isDone ? this.idleBlinkDuration : Typer.getTypeInMs();

    this.typeTimer = setTimeout(() => {
      if (isDone) {
        this.end();
        return;
      }

      const nextIndex = this.getNextIndex(index);

      this.printText(this.textToType.substring(0, nextIndex));
      this.typeNextChar(nextIndex);
    }, delay);
  }

  private getNextIndex(index: number) {
    const isTypo = Math.random() < this.typoProbability;
    return isTypo && index > 0 ? --index : ++index;
  }
}
