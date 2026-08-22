declare module "@hara-lang/live" {
  type LiveSnippet = {
    id: string;
    title: string;
    kind: "console" | "canvas";
    source: string;
  };

  export function mountLiveCard(
    root: HTMLElement,
    options?: {
      snippets?: LiveSnippet[];
      activeSnippet?: string | null;
      kernel?: any;
      runtimeBase?: string;
    }
  ): {
    run: () => Promise<void>;
    destroy: () => void;
  };
}

declare module "@hara-lang/live/pong" {
  export const PONG_SOURCE: string;
}

declare module "@hara-lang/live/kernel" {
  export interface HaraLiveKernel {
    createSession(name: string, options?: { filesystem?: string }): Promise<any>;
    close(): void;
  }

  export interface HaraLiveKernelOptions {
    runtimeBase?: string;
    docsAssetsBase?: string;
    kernelModuleUrl?: string | null;
    manifestUrl?: string | null;
    workerUrl?: string | null;
    resources?: Record<string, string> | null;
  }

  export function createLiveKernel(
    options?: HaraLiveKernelOptions
  ): Promise<HaraLiveKernel>;
}
