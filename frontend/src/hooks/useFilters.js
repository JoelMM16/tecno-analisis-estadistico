import { useMemo, useState } from "react";
import { filterRows } from "../utils/filters";
export function useFilters(rows) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterRows(rows, query), [rows, query]);
  return { query, setQuery, filtered };
}
