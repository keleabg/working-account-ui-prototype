const fetch = require("node-fetch");

const PLUGIN_NAME = "WebpackErrorReporterPlugin";

class WebpackErrorReporterPlugin {
  constructor(projectId, webhookUrl) {
    this.webhookUrl = webhookUrl;
    this.projectId = projectId;
    console.log(
      `[${PLUGIN_NAME}] Initialized. Project ID: ${this.projectId}, Webhook URL configured: ${!!this.webhookUrl}`,
    );
  }

  apply(compiler) {
    if (!this.webhookUrl) {
      console.warn(
        `[${PLUGIN_NAME}] Webhook URL is not defined. Skipping error reporting.`,
      );
      return;
    }

    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      console.log(
        `[${PLUGIN_NAME}] Webpack compilation finished. Has errors: ${stats.hasErrors()}`,
      );

      if (stats.hasErrors()) {
        const errorMessages = stats.compilation.errors
          .map((err) => {
            if (typeof err === "string") {
              return err;
            } else if (err instanceof Error) {
              return `${err.message}\n${err.stack || "No stack trace available."}`;
            } else if (err && typeof err.message === "string") {
              return err.message;
            }
            return JSON.stringify(err, null, 2);
          })
          .join("\n\n--- Next Webpack Error ---\n\n");

        const payload = {
          projectId: this.projectId,
          level: "error",
          message: `Next.js Webpack Build Error!`,
          details: errorMessages,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || "unknown",
          buildPhase: "webpack",
          additionalInfo: {
            webpackErrorsCount: stats.compilation.errors.length,
          },
        };

        console.error(
          `[${PLUGIN_NAME}] Build failed! Attempting to send error to webhook...`,
        );
        this.sendWebhook(payload);
      } else {
        console.log(`[${PLUGIN_NAME}] Build completed successfully.`);
      }
    });
  }

  async sendWebhook(payload) {
    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponseText = await response.text();
        console.error(
          `[${PLUGIN_NAME}] Failed to send webhook. Status: ${response.status}. Response: ${errorResponseText}`,
        );
      } else {
        console.log(
          `[${PLUGIN_NAME}] Webpack build error successfully posted to webhook.`,
        );
      }
    } catch (error) {
      console.error(
        `[${PLUGIN_NAME}] Error during webhook fetch operation:`,
        error,
      );
    }
  }
}

module.exports = WebpackErrorReporterPlugin;
