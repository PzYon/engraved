export class Typer {
  private typeTimer: unknown;
  private readonly cursorInterval: unknown;

  private readonly typoProbability: number = 0.05;
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

  public start(onComplete: () => void) {
    this.typeNextChar(0, onComplete);
  }

  public end = (): void => {
    this.toggleCursor?.(false);
    clearTimeout(this.typeTimer as number);
    clearInterval(this.cursorInterval as number);
  };

  private typeNextChar(index: number, onComplete: () => void): void {
    const hasNotStarted = index === 0;
    const isDone = index > this.textToType.length;
    const delay =
      hasNotStarted || isDone ? this.idleBlinkDuration : Typer.getTypeInMs();

    this.typeTimer = setTimeout(() => {
      if (isDone) {
        onComplete();
        this.end();
        return;
      }

      const nextIndex = this.getNextIndex(index);

      this.printText(this.textToType.substring(0, nextIndex));
      this.typeNextChar(nextIndex, onComplete);
    }, delay);
  }

  private getNextIndex(index: number) {
    const isTypo = Math.random() < this.typoProbability;
    return isTypo && index > 0 ? --index : ++index;
  }
}
