/**
 * Minimal 3Dmol.js viewer for a single small molecule (one amino-acid SDF),
 * rendered as ball-and-stick on the given canvas.
 *
 * Uses 3Dmol rather than molstar: a 3Dmol viewer is just a canvas, so two of
 * them start instantly, and its chunk is ~1/4 the size of the molstar-core one
 * (pdbe-molstar ships its own prebuilt molstar, which this view can't share).
 * 3Dmol is imported dynamically so it is code-split out of the main bundle and
 * only loaded when the 3D view is actually opened.
 */
import type { GLViewer } from '3dmol';

export class ResidueViewer {
  private viewer: GLViewer | null = null;
  // Initial framing (the SDFs are pre-aligned to a canonical pose), for reset.
  private home: any[] | null = null;

  async mount(canvas: HTMLCanvasElement, container: HTMLDivElement): Promise<void> {
    const $3Dmol = await import('3dmol');
    // Background follows the active theme (navy in dark, white otherwise).
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.viewer = $3Dmol.createViewer(container, {
      canvas,
      backgroundColor: dark ? '#0e2438' : '#ffffff',
    });
    if (!this.viewer) throw new Error('Could not initialise the 3D viewer.');
  }

  async load(url: string): Promise<void> {
    const viewer = this.viewer;
    if (!viewer) return;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not load the 3D structure (${res.status}).`);
    const sdf = await res.text();
    if (this.viewer !== viewer) return; // disposed while fetching
    viewer.clear();
    viewer.addModel(sdf, 'sdf');
    viewer.setStyle({}, { stick: { radius: 0.12 }, sphere: { scale: 0.2 } });
    viewer.zoomTo();
    viewer.render();
    this.home = viewer.getView();
  }

  setSpin(on: boolean): void {
    this.viewer?.spin(on ? 'y' : false);
  }

  /** Reset to the initial pose (undoes any spin/drag). */
  reset(): void {
    if (this.viewer && this.home) this.viewer.setView(this.home);
  }

  dispose(): void {
    this.viewer?.spin(false);
    this.viewer?.clear();
    this.viewer = null;
  }
}
