import { defineConfig } from 'rollup'
import ts from 'rollup-plugin-ts'
import gpj from 'rollup-plugin-generate-package-json'

export default defineConfig({
  input: 'server/index.ts',
  output: {
    file: 'dist-server/app.js',
    format: 'cjs'
  },
  plugins: [
    ts(),
    gpj({
      baseContents({ name, version }) {
        return {
          name,
          version,
          scripts: {
            start: 'node app.js'
          }
        }
      }
    })
  ]
})
