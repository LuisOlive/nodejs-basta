import { defineConfig } from 'rollup'
import ts from 'rollup-plugin-ts'
import gpj from 'rollup-plugin-generate-package-json'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  input: 'server/index.ts',
  output: {
    file: 'nodejs-basta/app.js',
    format: 'cjs'
  },
  plugins: [
    ts(),
    gpj({
      // generate package json
      baseContents({ name, version }) {
        return {
          name,
          version,
          scripts: {
            start: 'node app.js'
          }
        }
      }
    }),
    copy({
      targets: [{ src: 'dist/**/*', dest: 'nodejs-basta/public' }]
    })
  ]
})
