import { apiFetch } from "./api";

export interface Entry {
  id: number;
  title: string;
  what_did: string;
  what_learned: string;
  entryDate: string;
}

/* GET ALL */
export async function getEntries(): Promise<Entry[]> {
  return apiFetch("/api/v1/entries");
}

/* GET BY DATE */
export async function getEntriesByDate(date: string): Promise<Entry[]> {
  return apiFetch(`/api/v1/entries/by-date?date=${date}`);
}

/* CREATE */
export async function createEntry(data: {
  title: string;
  what_did: string;
  what_learned: string;
  entryDate: string;
}): Promise<Entry> {
  return apiFetch("/api/v1/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getRangeEntries(
  start: string,
  end: string,
): Promise<Entry[]> {
  return apiFetch(`/api/v1/entries/range?start=${start}&end=${end}`);
}

export async function deleteEntry(id: number): Promise<void> {
  await apiFetch(`/api/v1/entries/${id}`, {
    method: "DELETE",
  });
}

/* UPDATE */
export async function updateEntry(
  id: number,
  data: {
    title: string;
    what_did: string;
    what_learned: string;
  },
): Promise<Entry> {
  return apiFetch(`/api/v1/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
