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
