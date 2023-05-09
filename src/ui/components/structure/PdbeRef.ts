class PdbeRef {

    ref: any

    constructor(ref: any) {
        this.ref = ref
    }

    update(opts: any) {
        if (this.ref && this.ref.current) {
            (this.ref.current as any).viewerInstance.visual.update(opts, true);
            //(this.ref.current as any).viewerInstance.visual.reset({ theme: true });
        }
    }

    onloadSelect(pos: number) {
        (this.ref.current as any).viewerInstance.visual.select({
            data: [{
                start_residue_number: pos, end_residue_number: pos,
                color: {r: 255, g: 255, b: 0}, focus: true,
                sideChain: true
            }]
        })
    }

    selectPos(pos: number) {
        (this.ref.current as any).viewerInstance.visual.select({
            data: [{
                start_residue_number: pos, end_residue_number: pos,
                color: {r: 255, g: 255, b: 0}, focus: true
            }]
        })
    }

    highlightPos(pos: number) {
        (this.ref.current as any).viewerInstance.visual.highlight({
            data: [ {start_residue_number: pos, end_residue_number: pos, } ]
        });
    }

    selectPocket(pos: number[]) {
        const d = pos.map((p) => {
            return {start_residue_number: p, end_residue_number: p,
                color: { r: 255, g: 255, b: 0 }, focus:true};
        });
        (this.ref.current as any).viewerInstance.visual.select({
            data: d
        })
    }

    clearSelect(reset?:boolean) {
        (this.ref.current as any).viewerInstance.visual.clearSelection();
        (this.ref.current as any).viewerInstance.visual.reset({ camera: true });
    }

    selectChain(chain: string) {
        (this.ref.current as any).viewerInstance.visual.select({
            data: [{struct_asym_id: chain, color:{r:255,g:255,b:0}}], nonSelectedColor: {r:255,g:255,b:255}
        })
    }

    highlightResids(resids: number[], chain: string) {
        const rs = resids.map((r) => {
            return {struct_asym_id: chain, start_residue_number: r, end_residue_number: r,
                color: { r: 255, g: 255, b: 0 }, focus:true};
        });
        (this.ref.current as any).viewerInstance.visual.highlight({
            data: rs
        })
    }
}

export default PdbeRef;