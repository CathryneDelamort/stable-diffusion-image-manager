import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import type { Adapter } from 'vite-plugin-mix'
import mixPlugin from 'vite-plugin-mix'


// fix for mix is not a function in typescript taken from
// https://github.com/egoist/vite-plugin-mix/issues/33#issuecomment-1255778587
interface MixConfig {
  handler: string
  adapter?: Adapter | undefined
}

type MixPlugin = (config: MixConfig) => Plugin

interface Mix {
  default: MixPlugin
}

const mix = (mixPlugin as unknown as Mix).default

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    mix({
      handler: './api.ts',
    }),
    vanillaExtractPlugin()
  ],
})
