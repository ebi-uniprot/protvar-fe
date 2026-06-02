/**
 * Minimal molstar-core viewer for a single small molecule (one amino-acid SDF).
 *
 * Deliberately avoids the heavy `pdbe-molstar` plugin: it boots a trimmed
 * `PluginContext` (canvas only, no React UI) and renders the residue as
 * ball-and-stick. molstar is imported dynamically so it is code-split out of
 * the main bundle and only loaded when the 3D view is actually opened.
 */
import type { PluginContext } from 'molstar/lib/mol-plugin/context';
import type { Vec3 } from 'molstar/lib/mol-math/linear-algebra';

export class ResidueViewer {
  private plugin: PluginContext | null = null;
  // Canonical "home" orientation (up +Y, looking down -Z) used for reset.
  private up: Vec3 | null = null;
  private dir: Vec3 | null = null;

  async mount(canvas: HTMLCanvasElement, container: HTMLDivElement): Promise<void> {
    const [{ PluginContext }, { DefaultPluginSpec }, { Color }, linAlg] = await Promise.all([
      import('molstar/lib/mol-plugin/context'),
      import('molstar/lib/mol-plugin/spec'),
      import('molstar/lib/mol-util/color'),
      import('molstar/lib/mol-math/linear-algebra'),
    ]);
    this.up = linAlg.Vec3.create(0, 1, 0);
    this.dir = linAlg.Vec3.create(0, 0, -1);
    const plugin = new PluginContext(DefaultPluginSpec());
    await plugin.init();
    if (!plugin.initViewer(canvas, container)) {
      plugin.dispose();
      throw new Error('Could not initialise the 3D viewer.');
    }
    // White background; hide the orientation axes gizmo. (PD discriminated
    // unions don't type cleanly here, hence the cast.)
    plugin.canvas3d?.setProps({
      renderer: { backgroundColor: Color(0xffffff) },
      camera: { helper: { axes: { name: 'off', params: {} } } },
    } as any);
    this.plugin = plugin;
  }

  async load(url: string): Promise<void> {
    const plugin = this.plugin;
    if (!plugin) return;
    await plugin.clear();
    const data = await plugin.builders.data.download({ url }, { state: { isGhost: true } });
    const trajectory = await plugin.builders.structure.parseTrajectory(data, 'sdf');
    const model = await plugin.builders.structure.createModel(trajectory);
    const structure = await plugin.builders.structure.createStructure(model);
    await plugin.builders.structure.representation.addRepresentation(structure, {
      type: 'ball-and-stick',
    });
    plugin.canvas3d?.requestCameraReset();
  }

  setSpin(on: boolean): void {
    this.plugin?.canvas3d?.setProps({
      trackball: { animate: on ? { name: 'spin', params: { speed: 1 } } : { name: 'off', params: {} } },
    } as any);
  }

  /**
   * Reset to the initial pose. requestCameraReset only re-centres/zooms and
   * keeps the current rotation, so we recompute the focus with the canonical
   * orientation to also undo any spin/drag.
   */
  reset(): void {
    const canvas3d = this.plugin?.canvas3d;
    if (!canvas3d || !this.up || !this.dir) return;
    const sphere = canvas3d.boundingSphere;
    if (sphere.radius <= 0) {
      canvas3d.requestCameraReset({ durationMs: 250 });
      return;
    }
    const snapshot = canvas3d.camera.getFocus(sphere.center, sphere.radius, this.up, this.dir);
    canvas3d.camera.setState(snapshot, 250);
  }

  dispose(): void {
    this.plugin?.dispose();
    this.plugin = null;
  }
}
