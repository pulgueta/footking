import { useCallback, useMemo } from "react";

import jsonStates from "@/data/colombia.json";

export function useColombia() {
  const states = useMemo(() => {
    const filtered = jsonStates.map((state) => ({
      state: state.departamento,
      cities: state.ciudades,
    }));

    return filtered;
  }, []);

  const citiesFromState = useCallback(
    (state: string) => {
      const found = states.find((s) => s.state === state);

      if (!found) {
        return [];
      }

      return found.cities;
    },
    [states],
  );

  return {
    states,
    citiesFromState,
  };
}
