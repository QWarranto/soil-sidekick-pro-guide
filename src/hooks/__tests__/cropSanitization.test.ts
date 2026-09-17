import { describe, it, expect, vi } from "vitest";

// Test the escapeRegExp and sanitizeCropName functions
// These are internal to useAICropRecommendations but we test the pattern

describe("Crop Name Sanitization", () => {
  // Simulate the escapeRegExp function
  const escapeRegExp = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const ALLOWED_CROPS = ['corn', 'soybeans', 'wheat', 'barley', 'oats', 'sunflower', 'soybean', 'rice', 'cotton', 'alfalfa', 'sorghum'];

  const sanitizeCropName = (crop: string): string => {
    const normalized = crop.toLowerCase().trim();
    if (ALLOWED_CROPS.includes(normalized)) {
      return normalized;
    }
    return escapeRegExp(normalized);
  };

  describe("escapeRegExp", () => {
    it("should escape special regex characters", () => {
      expect(escapeRegExp("test.*+?")).toBe("test\\.\\*\\+\\?");
      expect(escapeRegExp("a[b]c")).toBe("a\\[b\\]c");
      expect(escapeRegExp("(group)")).toBe("\\(group\\)");
      expect(escapeRegExp("a|b")).toBe("a\\|b");
    });

    it("should leave normal strings unchanged", () => {
      expect(escapeRegExp("corn")).toBe("corn");
      expect(escapeRegExp("wheat")).toBe("wheat");
    });
  });

  describe("sanitizeCropName", () => {
    it("should return whitelisted crops as-is", () => {
      expect(sanitizeCropName("corn")).toBe("corn");
      expect(sanitizeCropName("WHEAT")).toBe("wheat");
      expect(sanitizeCropName("  Barley  ")).toBe("barley");
    });

    it("should escape non-whitelisted crops", () => {
      expect(sanitizeCropName("custom.crop")).toBe("custom\\.crop");
      expect(sanitizeCropName("crop*")).toBe("crop\\*");
    });

    it("should prevent ReDoS injection attempts", () => {
      // These patterns could cause catastrophic backtracking if not escaped
      const maliciousInput = "(a+)+$";
      const sanitized = sanitizeCropName(maliciousInput);
      expect(sanitized).toBe("\\(a\\+\\)\\+\\$");
      
      // Creating a regex with sanitized input should be safe
      const safeRegex = new RegExp(sanitized, "gi");
      expect(() => safeRegex.test("test string")).not.toThrow();
    });
  });
});

describe("Safe Regex Creation", () => {
  it("should create safe regex for crop extraction", () => {
    const safeCrop = "corn";
    // Using the safer pattern from useAICropRecommendations
    const cropRegex = new RegExp(`(?:^|\\n)[^\\n]*${safeCrop}[^\\n]*(?:\\n|$)`, "gim");
    
    const testText = `
    Corn is a great crop for this region.
    Plant corn in late spring.
    Wheat is another option.
    `;
    
    const matches = testText.match(cropRegex);
    expect(matches).toHaveLength(2);
    expect(matches?.[0]).toContain("Corn");
    expect(matches?.[1]).toContain("corn");
  });
});
