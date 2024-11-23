import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      remix({
        ignoredRouteFiles: ["**/.*"],
      }),
      tsconfigPaths(),
    ],
    define: {
      // Make env variables available to the client
      'process.env.RECAPTCHA_SITE_KEY': JSON.stringify(env.VITE_RECAPTCHA_SITE_KEY),
      'process.env.RECAPTCHA_SECRET_KEY': JSON.stringify(env.VITE_RECAPTCHA_SECRET_KEY),
      'process.env.SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.NODE_ENV': JSON.stringify(env.VITE_NODE_ENV || mode),
    },
    server: {
      port: parseInt(env.VITE_PORT || '5173'),
      host: true,
      watch: {
        usePolling: true,
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': [
              '@remix-run/react',
              'react',
              'react-dom',
              '@supabase/supabase-js',
            ],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        '@remix-run/react',
        'react',
        'react-dom',
        '@supabase/supabase-js',
      ],
    },
    envPrefix: ['VITE_'],
  };
});