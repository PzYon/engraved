import { APIRequestContext } from "@playwright/test";

const API_BASE_URL = "http://localhost:5072";

type SeedJournalType = "Counter" | "Gauge" | "Timer" | "Scraps";

interface SeedEntry {
  value?: number;
  title?: string;
  notes?: string;
}

interface SeedJournal {
  name: string;
  description?: string;
  type: SeedJournalType;
  entries?: SeedEntry[];
}

interface SeedTag {
  id: string;
  label: string;
}

export interface SeedTestData {
  journals?: SeedJournal[];
  tags?: SeedTag[];
}

interface SeededJournal {
  journalId: string;
  entryIds: string[];
}

export interface SeedResult {
  journals: SeededJournal[];
}

export class TestData {
  constructor(
    private request: APIRequestContext,
    private userName: string,
  ) {}

  async seed(testData: SeedTestData): Promise<SeedResult> {
    const response = await this.request.post(`${API_BASE_URL}/api/test/seed`, {
      headers: { Authorization: "Bearer " + this.userName },
      data: testData,
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to seed test data: ${response.status()} ${await response.text()}`,
      );
    }

    return response.json();
  }
}
