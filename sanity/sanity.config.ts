import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'thegirlwithacamera',
  title: 'The Girl With A Camera',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Studio')
          .items([
            S.listItem()
              .title('Articles')
              .child(
                S.documentList()
                  .title('Tous les articles')
                  .filter('_type == "post"')
                  .defaultOrdering([{ field: 'date', direction: 'desc' }])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
