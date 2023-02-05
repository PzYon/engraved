export class Typer {
  private typeTimer: unknown;
  private readonly cursorInterval: unknown;

  private readonly typoProbability: number = 0.05;
  private readonly blinkDurationMs = 500;
  private readonly idleBlinkDuration = this.blinkDurationMs;

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
    return Math.random() * 150 + 50;
  }

  public start(): Promise<void> {
    return this.startTyping();
  }

  public end(): void {
    this.toggleCursor?.(false);
    clearTimeout(this.typeTimer as number);
    clearInterval(this.cursorInterval as number);
  }

  private startTyping(index = 0): Promise<void> {
    return new Promise((resolve) => this.typeNextChar(index, resolve));
  }

  private typeNextChar(index: number, resolve: () => void) {
    const hasNotStarted = index === 0;
    const isDone = index > this.textToType.length;
    const delay =
      hasNotStarted || isDone ? this.idleBlinkDuration : Typer.getTypeInMs();

    this.typeTimer = setTimeout(() => {
      if (isDone) {
        this.end();
        resolve();
        return;
      }

      const nextIndex = this.getNextIndex(index);

      this.printText(this.textToType.substring(0, nextIndex));
      this.typeNextChar(nextIndex, resolve);
    }, delay);
  }

  private getNextIndex(index: number) {
    const isTypo = Math.random() < this.typoProbability;
    return isTypo && index > 0 ? --index : ++index;
  }
}
