import * as Sentry from "@sentry/nextjs";


export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;


export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;


// Helper functions to manually control the Sentry UI profiler (continuous profiling).
// Use these from client components to start/stop profiling around suspect code paths.
export function startUiProfiler(label?: string) {
  try {
    if (Sentry && (Sentry).uiProfiler && typeof (Sentry).uiProfiler.startProfiler === "function") {
      (Sentry).uiProfiler.startProfiler();
      console.debug("[sentry] uiProfiler started", label ?? "");
      return true;
    }
  } catch (e) {
    console.error("[sentry] startUiProfiler failed", e);
  }
  return false;
}

export function stopUiProfiler(label?: string) {
  try {
    if (Sentry && (Sentry).uiProfiler && typeof (Sentry).uiProfiler.stopProfiler === "function") {
      (Sentry).uiProfiler.stopProfiler();
      console.debug("[sentry] uiProfiler stopped", label ?? "");
      return true;
    }
  } catch (e) {
    console.error("[sentry] stopUiProfiler failed", e);
  }
  return false;
}
