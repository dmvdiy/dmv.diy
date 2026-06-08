import {
  serverCacheMaxAgeSeconds,
  serverStaleWhileInvalidateSeconds,
} from "./utils/util";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    '/cuba': { redirect: 'https://secure.givelively.org/donate/peoples-forum-inc/let-cuba-live-bread-for-our-neighbors/let-cuba-live-rva' },
    '/rss.xml': { redirect: '/rss' },
  },
  typescript: {
    // This ignores errors on build too.
    typeCheck: false,
  },
  modules: ["nuxt-security"],
  // See https://nuxt-security.vercel.app/getting-started/quick-start for info on security.
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https:'],
      },
    },
    rateLimiter: {
      value: {
        tokensPerInterval: process.dev ? 999999 : 30,
        interval: "hour",
        fireImmediately: false,
      },
      route: "",
      throwError: false, // optional
    },
    requestSizeLimiter: {
      value: {
        maxRequestSizeInBytes: 8000, // Most browsers have a request limit of 8KB, but this is to be safe.
        maxUploadFileRequestInBytes: 1000000,
      },
      route: "",
      throwError: false, // optional,
    },
    allowedMethodsRestricter: {
      value: ["GET"],
      route: "",
      throwError: false, // optional
    },
    corsHandler: {
      value: {
        origin: "*",
        methods: "*",
      },
      route: "",
    },
  },
css: ["vue-final-modal/style.css"],

  // Vite build optimizations
  vite: {
    build: {
      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-calendar': ['@fullcalendar/core', '@fullcalendar/vue3', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/list'],
            'vendor-utils': ['luxon', 'jquery', 'sanitize-html'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  },

  // Enable production optimizations
  experimental: {
    payloadExtraction: false,
  },

  components: true,
});
