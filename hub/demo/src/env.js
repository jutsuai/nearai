import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    ROUTER_URL: z.string().url(),
    DATA_SOURCE: z.enum(['registry', 'local_files']).default('registry'),
    HOME: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_CONSUMER_MODE: z.preprocess(
      (val) => (val === 'true' ? true : false),
      z.boolean(),
    ),
    NEXT_PUBLIC_CONSUMER_CHAT_AGENT_ID: z
      .string()
      .regex(/.+\/.+\/.+/)
      .optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    ROUTER_URL: process.env.ROUTER_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/`
      : process.env.NEXT_PUBLIC_BASE_URL,
    DATA_SOURCE: process.env.DATA_SOURCE,
    HOME: process.env.HOME,
    NEXT_PUBLIC_CONSUMER_MODE: process.env.NEXT_PUBLIC_CONSUMER_MODE,
    NEXT_PUBLIC_CONSUMER_CHAT_AGENT_ID:
      process.env.NEXT_PUBLIC_CONSUMER_CHAT_AGENT_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
