export function getCoefficient(currentIndex: number, instanceCount: number) {
  return currentIndex * (0.5 / Math.max(instanceCount - 1, 1));
}
