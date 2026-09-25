// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: [{ path: "/" }],
    // Disabled: on Netlify's build machines, Nitro auto-detects the `netlify` preset
    // (NETLIFY=true is always set), which emits main.mjs/server.mjs instead of the
    // index.mjs that @lovable.dev/vite-tanstack-config's prerender shim looks for.
    // The shim then never gets written and the build crashes trying to prerender "/".
    // The page still renders correctly via SSR on every request.
    prerender: { enabled: false, autoStaticPathsDiscovery: false },
  },
  nitro: {
    // Nitro's auto-detected `netlify` preset (NETLIFY=true on Netlify's build
    // machines) writes client assets to `dist/` by default, but the Netlify site's
    // publish directory is configured as `dist/client`. Pin the public output dir
    // so the two agree and the deploy step finds the built client assets.
    output: { publicDir: "dist/client" },
  },
});
