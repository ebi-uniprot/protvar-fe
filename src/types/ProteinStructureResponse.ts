export interface ProteinStructureResponse extends Array<ProteinStructureElement>{
}

export interface ProteinStructureElement {
    chain_id: string,
    pdb_id: string,
    start: number,
    resolution: number,
    experimental_method: string,
}