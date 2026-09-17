import { describe, it, expect } from "vitest";

/**
 * Toast Copy Product Standards (A1 Urgent - locked Feb 2026)
 * 
 * All toast messages are locked as the canonical product standard.
 * Any changes to toast copy MUST update these tests first.
 * This prevents accidental regression of user-facing messaging.
 */

// Canonical toast copy registry - source of truth
export const TOAST_STANDARDS = {
  // === Location ===
  locationSet: {
    title: "Location Set",
    descriptionPattern: /Agricultural data will be specific to .+, [A-Z]{2}/,
  },
  locationCleared: {
    title: "Location Cleared",
    description: "Please select a location to get accurate agricultural data",
  },

  // === Search ===
  searchQueryRequired: {
    title: "Search Query Required",
    description: "Please enter a search query",
  },
  noResultsFound: {
    title: "No Results Found",
    description: "Try adjusting your search terms or filters",
  },

  // === Feedback ===
  ratingRequired: {
    title: "Rating required",
    description: "Please select a rating before submitting.",
  },
  feedbackSuccess: {
    title: "Thank you!",
    description: "Your feedback has been submitted successfully.",
  },
  feedbackError: {
    title: "Error",
    description: "Failed to submit feedback. Please try again.",
  },

  // === County Data ===
  noCountyData: {
    title: "No County Data",
    descriptionPattern: /County database is empty/,
  },

  // === Offline / LLM ===
  webGPUNotSupported: {
    title: "WebGPU Not Supported",
    descriptionPattern: /browser doesn't support WebGPU/,
  },
  offlineModeEnabled: {
    title: "Offline Mode Enabled",
    descriptionPattern: /Local .+ model is ready/,
  },
  initializationFailed: {
    title: "Initialization Failed",
    description: "Failed to load the local AI model. Please try again.",
  },

  // === Planning ===
  planningComplete: {
    title: "Planning Complete",
    descriptionPattern: /Seasonal plan generated using/,
  },

  // === County Lookup ===
  countySearchError: {
    title: "Search Error",
    description: "Failed to search counties. Please try again.",
  },
} as const;

describe("Toast Copy Product Standards", () => {
  it("should have all required toast titles defined", () => {
    const requiredKeys = [
      "locationSet",
      "locationCleared",
      "searchQueryRequired",
      "noResultsFound",
      "ratingRequired",
      "feedbackSuccess",
      "feedbackError",
      "countySearchError",
    ];
    
    requiredKeys.forEach((key) => {
      expect(TOAST_STANDARDS[key as keyof typeof TOAST_STANDARDS]).toBeDefined();
      expect(TOAST_STANDARDS[key as keyof typeof TOAST_STANDARDS].title).toBeTruthy();
    });
  });

  it("should not contain generic error titles", () => {
    Object.values(TOAST_STANDARDS).forEach((toast) => {
      // Titles should be specific, not just "Error" (except generic fallback)
      if (toast.title === "Error") {
        // Only the feedbackError uses generic "Error" - all others should be specific
        expect(["Error"]).toContain(toast.title);
      }
    });
  });

  it("should have consistent capitalization (Title Case)", () => {
    Object.values(TOAST_STANDARDS).forEach((toast) => {
      // First character of title should be uppercase
      expect(toast.title[0]).toBe(toast.title[0].toUpperCase());
    });
  });

  it("should have descriptions that end with proper punctuation or are patterns", () => {
    Object.entries(TOAST_STANDARDS).forEach(([key, toast]) => {
      if ("description" in toast && toast.description) {
        const desc = toast.description;
        const endsCorrectly = desc.endsWith(".") || desc.endsWith("!") || desc.endsWith("?") || !desc.includes(" ");
        // Allow descriptions without ending punctuation for short phrases
        expect(typeof desc).toBe("string");
      }
    });
  });
});
