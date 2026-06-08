import { APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:5072";

export type SeedJournalType = "Counter" | "Gauge" | "Timer" | "Scraps";

export interface SeedEntry {
  value?: number;
  title?: string;
  notes?: string;
}

export interface SeedJournal {
  name: string;
  description?: string;
  type: SeedJournalType;
  entries?: SeedEntry[];
}

export interface Scenario {
  journals: SeedJournal[];
}

export interface SeededJournal {
  journalId: string;
  entryIds: string[];
}

export interface SeedResult {
  journals: SeededJournal[];
}

/**
 * Test-data builder. The ONLY place aware of how setup data is created on the
 * backend. Tests express a scenario in domain language; this seeds it in a
 * single call to the e2e-only `/api/test/seed` endpoint. Authentication in e2e
 * mode is just the username sent as a bearer token (no real token to manage).
 */
export class TestData {
  constructor(
    private request: APIRequestContext,
    private userName: string,
  ) {}

  async seed(scenario: Scenario): Promise<SeedResult> {
    const response = await this.request.post(`${API_BASE_URL}/api/test/seed`, {
      headers: { Authorization: "Bearer " + this.userName },
      data: scenario,
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to seed test data: ${response.status()} ${await response.text()}`,
      );
    }

    return response.json();
  }
}
