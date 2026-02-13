import { APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:5072";

interface Journal {
  journalId?: string;
  name: string;
  description?: string;
  journalType: "Counter" | "Gauge" | "Timer" | "Scraps";
}

export async function createJournalViaApi(
  requestContext: APIRequestContext,
  journal: Journal,
): Promise<string> {
  const response = await requestContext.post(`${API_BASE_URL}/api/journals`, {
    data: {
      name: journal.name,
      description: journal.description || "",
      journalType: journal.journalType,
    },
  });

  if (!response.ok()) {
    throw new Error(
      `Failed to create journal: ${response.status()} ${await response.text()}`,
    );
  }

  const result = await response.json();
  return result.result?.journalId || result.journalId;
}
