/// <reference types="astro/client" />

import type { SkeletonType } from "./lib/route-skeletons";

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
    __lunadeerRouteLoadingController?: AbortController;
    __lunadeerRouteLoading?: {
      init: () => void;
      show: (type: SkeletonType) => void;
      hide: () => void;
    };
    __lunadeerDocsReaderController?: AbortController;
    __lunadeerDocsReader?: {
      init: () => void;
      isManagedUrl: (url: URL) => boolean;
      isReady: (url: URL) => boolean;
    };
  }
}

export {};
