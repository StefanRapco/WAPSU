import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  documents: [
    'packages/api/graphql.ts',
    'packages/api/schema.graphql',
    'packages/frontend/src/**/*.tsx',
    'packages/frontend/src/hooks/**.ts'
  ],
  generates: {
    'packages/frontend/src/gql-generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql'
        // import: 'import gql from "graphql-tag";' // Explicitly import gql tag
      }
    }
  }
};

export default config;
