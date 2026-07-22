// Generates a Mongo-ObjectId-shaped id (24 hex chars: 4-byte unix timestamp + 8 random bytes) on
// the client. This gives entries created while offline a stable identity before they ever reach
// the server - the id in the outbox, in the optimistic cache and in the database is the same.
export function generateClientId(): string {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");

  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const random = Array.from(randomBytes, (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");

  return timestamp + random;
}
