// Enhanced Sandbox Error Bridge - Primary Next.js Error Handler
// This script acts as the default error handler for the sandbox Next.js project
// with immediate error detection and precise source filtering
//
// Features:
// - Replaces default Next.js error handling
// - Instant error detection and reporting
// - Advanced source filtering (sandbox-only errors)
// - Plugin/extension error exclusion
// - Real-time postMessage communication

(() => {
  if (typeof window === "undefined") return;
  if ((window as any).__sandboxErrorBridgeInstalled) return;
  (window as any).__sandboxErrorBridgeInstalled = true;

  // Enhanced sandbox identification
  const SANDBOX_MARKERS = {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    sandboxId: `sandbox_${process.env.NEXT_PUBLIC_PROJECT_ID || Date.now()}`,
    origin: window.location.origin,
    timestamp: Date.now(),
  };

  // Set global sandbox markers
  (window as any).__sandboxId = SANDBOX_MARKERS.sandboxId;
  (window as any).__isSandboxEnvironment = true;

  // Fast error posting with enhanced context
  const postError = (error: {
    type: string;
    message: string;
    stack?: string;
    source?: string;
    lineno?: number;
    colno?: number;
    timestamp?: number;
  }) => {
    try {
      const errorPayload = {
        type: "sandbox_error",
        sandboxId: SANDBOX_MARKERS.sandboxId,
        projectId: SANDBOX_MARKERS.projectId,
        error: {
          ...error,
          timestamp: error.timestamp || Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      };

      // Store last error for debugging
      (window as any).__lastSandboxError = errorPayload;

      // Immediate postMessage to parent
      window.parent?.postMessage(errorPayload, "*");

      // Debug log
      console.log("[Sandbox Error Bridge] Error reported:", {
        type: error.type,
        message: error.message.substring(0, 100),
        sandboxId: SANDBOX_MARKERS.sandboxId,
      });
    } catch (postError) {
      console.error("[Sandbox Error Bridge] Failed to post error:", postError);
    }
  };

  // Enhanced extension/plugin detection
  const isPluginError = (
    message: string,
    stack: string,
    source?: string,
  ): boolean => {
    const combinedText = `${message} ${stack} ${source || ""}`.toLowerCase();

    // Comprehensive plugin patterns
    const pluginPatterns = [
      // Password managers
      /lastpass|lp-icon|data-lastpass/i,
      /bitwarden|onepassword|1password|dashlane|keeper/i,

      // Grammar/spell checkers
      /grammarly|data-grammarly|grammarly-inline/i,

      // Shopping extensions
      /honey|data-honey|rakuten|capital-one/i,

      // Ad blockers
      /adblock|ublock|adblocker|adguard/i,

      // Browser extensions
      /chrome-extension|moz-extension|safari-extension|edge-extension/i,
      /extension-injected|content-script|injected-script/i,

      // Analytics/tracking extensions
      /_hj|hotjar|gtm|googletagmanager|facebook|twitter|pinterest/i,

      // Developer tools
      /react-devtools|redux-devtools/i,

      // Common injection patterns
      /data-.*-root|position.*relative.*height.*0px.*width.*0px.*float.*left/i,
      /style.*position.*relative.*z-index/i,
    ];

    // Extension-specific hydration patterns
    const isExtensionHydration =
      /hydration.*failed.*server.*html.*client/i.test(combinedText) &&
      /data-.*-root|float.*left|position.*relative.*height.*0px/i.test(
        combinedText,
      );

    return (
      pluginPatterns.some((pattern) => pattern.test(combinedText)) ||
      isExtensionHydration
    );
  };

  // Check for external/third-party errors
  const isExternalError = (combinedText: string): boolean => {
    const externalPatterns = [
      /google-analytics|googletagmanager|gtag/i,
      /facebook\.net|twitter\.com|linkedin\.com/i,
      /cdn\.|jsdelivr|unpkg|cdnjs/i,
      /googlesyndication|doubleclick|adsystem/i,
      /cors.*error|network.*error.*loading.*script/i,
      /script.*error.*from.*different.*origin/i,
    ];

    return externalPatterns.some((pattern) => pattern.test(combinedText));
  };

  // Precise sandbox error detection
  const isSandboxError = (
    message: string,
    stack: string,
    source?: string,
  ): boolean => {
    // First, filter out plugin errors
    if (isPluginError(message, stack, source)) {
      return false;
    }

    const combinedText = `${message} ${stack}`.toLowerCase();

    // Sandbox source validation
    const hasSandboxSource =
      // Stack trace contains sandbox paths
      (stack &&
        (/\/app\/|\/src\/|\/components\/|\/pages\/|\/lib\/|\/utils\//i.test(
          stack,
        ) ||
          /\.next\/|_next\/|home\/user/i.test(stack) ||
          /webpack:\/\/\.\//i.test(stack) || // Webpack internal paths
          new RegExp(SANDBOX_MARKERS.origin, "i").test(stack))) ||
      // Source file from sandbox
      (source &&
        (source.includes(SANDBOX_MARKERS.origin) ||
          /localhost|127\.0\.0\.1/i.test(source) ||
          source.includes("_next/") ||
          (source.includes(".js") && !source.includes("extension"))));

    // Sandbox-specific error patterns
    const sandboxErrorPatterns = [
      // React/Next.js errors
      /react.*error|component.*error|hook.*error/i,
      /next.*error|page.*error|routing.*error/i,
      /hydration.*failed/i,

      // JavaScript runtime errors
      /referenceerror|typeerror|syntaxerror/i,
      /cannot.*read.*propert|cannot.*access.*before.*initialization/i,
      /unexpected.*token|undefined.*is.*not.*function/i,

      // Build/compilation errors
      /webpack|compilation.*error|build.*error/i,
      /module.*not.*found|cannot.*resolve.*module/i,

      // API/Network errors from sandbox
      /api.*error|fetch.*failed|network.*error/i,
      /server.*error.*500|404.*not.*found/i,
    ];

    const hasErrorPattern = sandboxErrorPatterns.some((pattern) =>
      pattern.test(combinedText),
    );

    // Must have both sandbox source and error pattern, or be a clear sandbox error
    return (
      (hasSandboxSource && hasErrorPattern) ||
      (hasErrorPattern && !isExternalError(combinedText))
    );
  };

  // Override Next.js error handling
  const overrideNextJSErrors = () => {
    // Override Next.js error overlay
    if (typeof window !== "undefined" && (window as any).__NEXT_DATA__) {
      // Intercept Next.js error events
      const originalError = window.addEventListener;

      // Create a custom error event interceptor
      window.addEventListener = function (
        type: string,
        listener: any,
        options?: any,
      ) {
        if (type === "error" || type === "unhandledrejection") {
          // Wrap the listener to intercept and handle errors first
          const wrappedListener = (event: any) => {
            handleSandboxError(event);
            return listener.call(this, event);
          };
          return originalError.call(this, type, wrappedListener, options);
        }
        return originalError.call(this, type, listener, options);
      };
    }

    // Override console methods for immediate error capture
    const originalMethods = {
      error: console.error,
      warn: console.warn,
    };

    console.error = (...args: any[]) => {
      try {
        const message = args
          .map((arg) =>
            typeof arg === "string" ? arg : arg?.message || JSON.stringify(arg),
          )
          .join(" ");

        const errorObj = args.find((arg) => arg?.stack);
        const stack = errorObj?.stack || new Error().stack || "";

        if (isSandboxError(message, stack)) {
          postError({
            type: "console_error",
            message,
            stack,
            source: "console",
          });
        }
      } catch (e) {
        // Silent fail
      }

      return originalMethods.error.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      try {
        const message = args
          .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
          .join(" ");

        // Only report warnings that look like errors
        if (/error|failed|cannot|undefined|warning.*hydration/i.test(message)) {
          const stack = new Error().stack || "";
          if (isSandboxError(message, stack)) {
            postError({
              type: "console_warning",
              message,
              stack,
              source: "console",
            });
          }
        }
      } catch (e) {
        // Silent fail
      }

      return originalMethods.warn.apply(console, args);
    };
  };

  // Main error handler
  const handleSandboxError = (event: ErrorEvent | PromiseRejectionEvent) => {
    try {
      let message: string;
      let stack: string;
      let source: string | undefined;
      let lineno: number | undefined;
      let colno: number | undefined;

      if (event instanceof ErrorEvent) {
        message = event.message || String(event.error || "Unknown error");
        stack = event.error?.stack || "";
        source = event.filename;
        lineno = event.lineno;
        colno = event.colno;
      } else {
        // Promise rejection
        const reason = (event as any).reason;
        message =
          reason?.message || String(reason) || "Unhandled promise rejection";
        stack = reason?.stack || "";
      }

      if (isSandboxError(message, stack, source)) {
        postError({
          type:
            event instanceof ErrorEvent
              ? "javascript_error"
              : "promise_rejection",
          message,
          stack,
          source,
          lineno,
          colno,
        });
      }
    } catch (e) {
      console.error("[Sandbox Error Bridge] Error in handler:", e);
    }
  };

  // Install error handlers immediately
  window.addEventListener("error", handleSandboxError, { capture: true });
  window.addEventListener("unhandledrejection", handleSandboxError, {
    capture: true,
  });

  // Override Next.js error handling
  overrideNextJSErrors();

  // Enhanced DOM observer for Next.js error overlays
  const observeErrorOverlays = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Next.js error overlay detection
            const isErrorOverlay =
              element.id === "nextjs-portal-root" ||
              element.querySelector("[data-nextjs-error-overlay]") ||
              element.getAttribute("data-nextjs-error-overlay") !== null;

            if (isErrorOverlay) {
              setTimeout(() => {
                const errorText = element.textContent || "";
                if (errorText && isSandboxError(errorText, "")) {
                  postError({
                    type: "nextjs_overlay_error",
                    message: "Next.js Error Overlay Detected",
                    stack: errorText.split("\n").slice(0, 50).join("\n"),
                    source: "nextjs_overlay",
                  });
                }
              }, 100); // Small delay to ensure content is loaded
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-nextjs-error-overlay"],
    });

    (window as any).__sandboxErrorObserver = observer;
  };

  // Start observing when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeErrorOverlays);
  } else {
    observeErrorOverlays();
  }

  // Message handler for parent communication
  window.addEventListener("message", (event) => {
    const { data } = event;

    switch (data?.type) {
      case "request_last_error":
        const lastError = (window as any).__lastSandboxError;
        window.parent?.postMessage(
          {
            type: "last_error_response",
            error: lastError || null,
            sandboxId: SANDBOX_MARKERS.sandboxId,
          },
          "*",
        );
        break;

      case "ping_sandbox":
        window.parent?.postMessage(
          {
            type: "pong_sandbox",
            sandboxId: SANDBOX_MARKERS.sandboxId,
            status: "ready",
          },
          "*",
        );
        break;
    }
  });

  // Enhanced React error boundary integration
  if (typeof window !== "undefined" && (window as any).React) {
    const originalCreateElement = (window as any).React.createElement;

    // This is a more advanced technique - you might want to implement this
    // at the application level instead for better control
  }

  // Signal readiness
  setTimeout(() => {
    window.parent?.postMessage(
      {
        type: "sandbox_error_bridge_ready",
        sandboxId: SANDBOX_MARKERS.sandboxId,
        capabilities: [
          "javascript_errors",
          "promise_rejections",
          "console_errors",
          "nextjs_overlays",
          "plugin_filtering",
        ],
      },
      "*",
    );
  }, 100);

  console.log("[Sandbox Error Bridge] Enhanced error handler installed", {
    sandboxId: SANDBOX_MARKERS.sandboxId,
    projectId: SANDBOX_MARKERS.projectId,
  });
})();
