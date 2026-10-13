import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'bz8msak0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-10-12',
});
