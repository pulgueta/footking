import { useCallback } from "react";

import jsonStates from "@/data/colombia.json";

export function useColombia() {
  const states = jsonStates.map((state) => ({
    state: state.departamento,
    cities: state.ciudades,
  }));

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
