class PdbeRef {

    ref: any

    constructor(ref: any) {
        this.ref = ref
    }

    update(opts: any) {
        console.log("update -- ");
        console.log(this.ref);
        if (this.ref && this.ref.current) {
            (this.ref.current as any).viewerInstance.visual.update(opts);
        }
    }

    selectPos(pos: number) {
        console.log("selectPos -- ");
        console.log(this.ref);
        (this.ref.current as any).viewerInstance.visual.select({
            data: [{
                start_residue_number: pos, end_residue_number: pos,
                color: {r: 255, g: 255, b: 0}, focus: true
            }]
        })
    }

    highlightPos(pos: number) {
        console.log("highlightPos -- ");
        console.log(this.ref);
        (this.ref.current as any).viewerInstance.visual.highlight({
            data: [ {start_residue_number: pos, end_residue_number: pos, } ]
        });
    }

    selectPocket(pos: number[]) {
        console.log("selectPocket -- ");
        console.log(this.ref);
        const d = pos.map((p) => {
            return {start_residue_number: p, end_residue_number: p,
                color: { r: 255, g: 255, b: 0 }, focus:true};
        });
        (this.ref.current as any).viewerInstance.visual.select({
            data: d
        })
    }

    clearSelect(reset?:boolean) {
        console.log("clearSelect -- ");
        console.log(this.ref);
        (this.ref.current as any).viewerInstance.visual.clearSelection();
        (this.ref.current as any).viewerInstance.visual.reset({ camera: true });
    }

    selectChain(chain: string) {
        console.log("selectChain -- ");
        console.log(this.ref);
        (this.ref.current as any).viewerInstance.visual.select({
            data: [{struct_asym_id: chain, color:{r:255,g:255,b:0}}], nonSelectedColor: {r:255,g:255,b:255}
        })
    }

    highlightResids(resids: number[], chain: string) {
        console.log("highlightResids -- ");
        console.log(this.ref);
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