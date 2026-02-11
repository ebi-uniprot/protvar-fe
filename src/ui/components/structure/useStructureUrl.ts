import { useCallback } from "react";

// URL parameter keys - aligned with James's suggestion
const STR_PARAM = "structure";
const CHAIN_PARAM = "highlight_chain";
const POCKET_PARAM = "highlight_pocket";
const INTERFACE_PARAM = "highlight_interface";
const ZOOM_PARAM = "zoom";

export interface StructureUrlParams {
  structureId: string | null;
  chain: string | null;
  pocket: string | null;
  interface: boolean;
  zoom: boolean;
}

export type StructureType = "pdb" | "prediction" | "interaction";

export function useStructureUrl() {
  // Parse URL parameters
  const getParams = useCallback((): StructureUrlParams => {
    const params = new URLSearchParams(window.location.search);

    return {
      structureId: params.get(STR_PARAM),
      chain: params.get(CHAIN_PARAM),
      pocket: params.get(POCKET_PARAM),
      interface: params.get(INTERFACE_PARAM) === "true",
      zoom: params.get(ZOOM_PARAM) === "true",
    };
  }, []);

  // Update structure parameter
  const setStructure = useCallback((type: StructureType, id?: string) => {
    const params = new URLSearchParams(window.location.search);

    if (id) {
      params.set(STR_PARAM, `${type}:${id}`);
    } else {
      params.set(STR_PARAM, type);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, []);

  // Update highlight/action parameters
  const updateActions = useCallback((updates: {
    chain?: string | null;
    pocket?: string | null;
    interface?: boolean | null;
    zoom?: boolean | null;
  }) => {
    const params = new URLSearchParams(window.location.search);

    // Update or remove each parameter
    if (updates.chain !== undefined) {
      if (updates.chain) {
        params.set(CHAIN_PARAM, updates.chain);
      } else {
        params.delete(CHAIN_PARAM);
      }
    }

    if (updates.pocket !== undefined) {
      if (updates.pocket) {
        params.set(POCKET_PARAM, updates.pocket);
      } else {
        params.delete(POCKET_PARAM);
      }
    }

    if (updates.interface !== undefined) {
      if (updates.interface) {
        params.set(INTERFACE_PARAM, "true");
      } else {
        params.delete(INTERFACE_PARAM);
      }
    }

    if (updates.zoom !== undefined) {
      if (updates.zoom) {
        params.set(ZOOM_PARAM, "true");
      } else {
        params.delete(ZOOM_PARAM);
      }
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, []);

  // Clear incompatible parameters when switching structure types
  const clearIncompatibleActions = useCallback((type: StructureType) => {
    const updates: any = {};

    if (type === "pdb") {
      // PDB only supports chain highlighting
      updates.pocket = null;
      updates.interface = null;
    } else if (type === "prediction") {
      // AlphaFold only supports pocket highlighting
      updates.chain = null;
      updates.interface = null;
    } else if (type === "interaction") {
      // Interactions only support interface highlighting
      updates.chain = null;
      updates.pocket = null;
    }

    updateActions(updates);
  }, [updateActions]);

  return {
    getParams,
    setStructure,
    updateActions,
    clearIncompatibleActions,
  };
}