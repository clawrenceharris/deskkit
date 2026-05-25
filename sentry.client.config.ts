import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://3468c0858f3b82ee29e1a70a939e00e9@o4511450618200064.ingest.us.sentry.io/4511450929430528",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/deskshare-rho\.vercel\.app/],
    // Set profileSessionSampleRate to 1.0 to profile during every session.
    // The decision, whether to profile or not, is made once per session (when the SDK is initialized).
    profileSessionSampleRate: 1.0
  });