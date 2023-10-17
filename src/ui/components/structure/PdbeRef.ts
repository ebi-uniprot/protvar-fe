import {CYAN, MAGENTA, WHITE, YELLOW} from "../../../types/Colors";

class PdbeRef {

    ref: any

    constructor(ref: any) {
        this.ref = ref
    }

    async highlightVariant(pos: number, chain?: string) { // we mean "select"
        await this.ref.current?.viewerInstance.visual.clearSelection();
        await this.ref.current?.viewerInstance.visual.select({
            data: [{
                start_residue_number: pos, end_residue_number: pos,
                color: YELLOW,
                sideChain: true,
                ...chain && {struct_asym_id: chain}
            }]
        })
    }

    // Focus (and maintain select on) variant
    async zoomToVariant(pos: number, chain?: string) {
        await this.ref.current?.viewerInstance.visual.clearSelection();
        // focus
        await this.ref.current?.viewerInstance.visual.focus([{
            start_residue_number: pos, end_residue_number: pos,
            ...chain && {struct_asym_id: chain}
        }])
        // select
        await this.ref.current?.viewerInstance.visual.select({
            data: [{
                start_residue_number: pos, end_residue_number: pos,
                color: YELLOW,
                sideChain: true,
                ...chain && {struct_asym_id: chain}
            }]
        })
    }

    async highlightChain(pos: number, chain: string) { // we mean "select"
        await this.ref.current?.viewerInstance.visual.clearSelection();
        await this.ref.current?.viewerInstance.visual.select({
            data: [
                {struct_asym_id: chain, color: MAGENTA},  // select chain
                {
                    start_residue_number: pos, end_residue_number: pos,
                    color: YELLOW,
                    sideChain: true,
                    ...chain && {struct_asym_id: chain}
                } // select variant in different color
            ]
            , nonSelectedColor: WHITE
        })
    }

    async resetDefault(pos: number, chain?: string) {
        await this.ref.current?.viewerInstance.visual.clearSelection();
        await this.ref.current?.viewerInstance.visual.reset({camera: true});
        await this.highlightVariant(pos, chain);
    }


    async update(opts: any) {
        await this.ref.current?.viewerInstance.visual.clearSelection();
        await this.ref.current?.viewerInstance.visual.update(opts, true);
            //(this.ref.current as any).viewerInstance.visual.reset({ theme: true });
    }

    async subscribeOnload(pos: number, chain?: string) {
        await this.ref.current?.viewerInstance.events.loadComplete.subscribe(() => {
            this.highlightVariant(pos, chain)
        });
    }

    async highlightPocket(aaPos: number, pocketResids: number[]) {
        await this.ref.current?.viewerInstance.visual.clearSelection();
        await this.ref.current?.viewerInstance.visual.select({
            data: pocketResids.map((p) => {
                return {
                    start_residue_number: p, end_residue_number: p,
                    color: MAGENTA,
                    sideChain: false
                };
            }).concat(
                {
                    start_residue_number: aaPos, end_residue_number: aaPos,
                    color: YELLOW,
                    sideChain: true
                } // select variant in different color
            )
            , nonSelectedColor: WHITE
        })
    }

    async highlightInterface(aresids: number[], bresids: number[], pos: number, protChain: string) {
        await this.ref.current?.viewerInstance.visual.clearSelection();
        await this.ref.current?.viewerInstance.visual.select({
            data: aresids.map((p) => {
                return {
                    struct_asym_id: 'A',
                    start_residue_number: p, end_residue_number: p,
                    color: MAGENTA,
                    sideChain: false
                };
            }).concat(bresids.map((p) => {
                return {
                    struct_asym_id: 'B',
                    start_residue_number: p, end_residue_number: p,
                    color: CYAN,
                    sideChain: false
                };
            })).concat(
                {
                    struct_asym_id: protChain,
                    start_residue_number: pos, end_residue_number: pos,
                    color: YELLOW,
                    sideChain: true
                } // select variant in different color
            )
            , nonSelectedColor: WHITE
        })
    }
}

export default PdbeRef;