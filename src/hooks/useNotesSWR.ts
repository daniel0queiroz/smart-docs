import useSWR from "swr";

export function useNotesSWR() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading, mutate } = useSWR("/api/notes", fetcher, {
    refreshInterval: 5000,
  });
  return {
    notes: data?.notes || [],
    isLoading,
    error,
    mutate,
  };
}
