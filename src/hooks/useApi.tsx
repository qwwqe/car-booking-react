import { useGlobalState } from "../context";

export default function useApi() {
  const {
    state: { api },
  } = useGlobalState();

  return api;
}
