/** Resolve a bundled public asset against the app base (works on GitHub Pages subpaths). */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
