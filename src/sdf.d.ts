// SDF files are emitted as static asset URLs by the bundler.
declare module '*.sdf' {
  const url: string;
  export default url;
}
