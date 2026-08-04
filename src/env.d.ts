/// <reference types="astro/client" />

declare global {
  interface Window {
    __LUNADEER_SEARCH_INDEX__?: Array<{
      title: string;
      url: string;
      type: string;
      category?: string;
      documentSet?: string;
      summary: string;
      status?: string;
    }>;
  }
}

export {};
