import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://3468c0858f3b82ee29e1a70a939e00e9@o4511450618200064.ingest.us.sentry.io/4511450929430528",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Tracing must be enabled for profiling to work
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: 'trace',
});

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
Sentry.startSpan({
  name: "My Span",
}, () => {
  // The code executed here will be profiled
});