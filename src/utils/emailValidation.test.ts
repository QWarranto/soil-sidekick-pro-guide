import { describe, it, expect } from "vitest";
import { validateEmail, isDisposableEmail } from "@/utils/emailValidation";

describe("Email Validation", () => {
  describe("validateEmail", () => {
    it("should accept valid email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.org",
        "user+tag@gmail.com",
        "name@subdomain.domain.co.uk",
      ];

      validEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "",
        "notanemail",
        "@nodomain.com",
        "no@",
        "spaces in@email.com",
        "missing.domain@",
      ];

      invalidEmails.forEach((email) => {
        const result = validateEmail(email);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it("should handle edge cases gracefully", () => {
      // Whitespace-only inputs
      const result = validateEmail("   ");
      expect(result.valid).toBe(false);
    });

    it("should reject disposable email addresses", () => {
      const result = validateEmail("test@mailinator.com");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("disposable");
    });
  });

  describe("isDisposableEmail", () => {
    it("should detect common disposable email domains", () => {
      const disposableEmails = [
        "test@mailinator.com",
        "user@tempmail.com",
        "fake@guerrillamail.com",
      ];

      disposableEmails.forEach((email) => {
        expect(isDisposableEmail(email)).toBe(true);
      });
    });

    it("should allow legitimate email domains", () => {
      const legitimateEmails = [
        "user@gmail.com",
        "user@yahoo.com",
        "user@company.com",
        "user@university.edu",
      ];

      legitimateEmails.forEach((email) => {
        expect(isDisposableEmail(email)).toBe(false);
      });
    });
  });
});
