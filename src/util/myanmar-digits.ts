/**
 * Utilities for Myanmar numeral (၀–၉) input handling.
 *
 * Myanmar digits occupy Unicode code points U+1040 (၀) through U+1049 (၉).
 */

/** Regex that matches any character that is NOT a Myanmar digit */
const NON_MYANMAR_DIGIT = /[^\u1040-\u1049]/g

/**
 * Regex that matches any character that is NOT allowed in a Myanmar phone
 * number: Myanmar digits, +, space, hyphen, parentheses.
 */
const NON_MYANMAR_PHONE = /[^\u1040-\u1049+\s\-()]/g

/** Strip every character that is not a Myanmar digit (၀–၉). */
export function filterMyanmarDigits(value: string): string {
  return value.replace(NON_MYANMAR_DIGIT, "")
}

/**
 * Strip characters that are not valid in a Myanmar phone number.
 * Keeps Myanmar digits plus +, spaces, hyphens, and parentheses.
 */
export function filterMyanmarPhone(value: string): string {
  return value.replace(NON_MYANMAR_PHONE, "")
}

/**
 * Convert a string of Myanmar digits (၀–၉) to its Arabic-numeral equivalent
 * so it can be parsed with `parseInt` / `Number`.
 *
 * @example myanmarToArabic("၃၈၀") // "380"
 */
export function myanmarToArabic(value: string): string {
  return value.replace(/[\u1040-\u1049]/g, (ch) =>
    String(ch.codePointAt(0)! - 0x1040)
  )
}

/**
 * Convert a string of Arabic digits (0–9) to Myanmar digits (၀–၉).
 *
 * @example arabicToMyanmar("380") // "၃၈၀"
 */
export function arabicToMyanmar(value: string): string {
  return value.replace(/[0-9]/g, (ch) =>
    String.fromCodePoint(ch.codePointAt(0)! + 0x1040 - 48)
  )
}

export const PHONE_PREFIX = "၉၅၉"
const MAX_DIGITS_AFTER_PREFIX = 9

/**
 * Enforces the ၉၅၉ prefix and strips non-Myanmar digits after it.
 * Caps total digits after prefix at 9 (longest Myanmar mobile number).
 */
export function filterMyanmarPhoneWithPrefix(value: string): string {
  // Convert any Arabic digits typed to Myanmar digits first
  const converted = arabicToMyanmar(value)

  // Extract only Myanmar digits from the whole string
  const digitsOnly = converted.replace(NON_MYANMAR_DIGIT, "")

  // Ensure it always starts with ၉၅၉
  const prefixDigits = arabicToMyanmar("959") // = "၉၅၉"
  const withPrefix = digitsOnly.startsWith(prefixDigits)
    ? digitsOnly
    : prefixDigits + digitsOnly.replace(new RegExp(`^${prefixDigits}`), "")

  // Cap: prefix (3) + max 9 digits after = 12 total
  return withPrefix.slice(0, prefixDigits.length + MAX_DIGITS_AFTER_PREFIX)
}


/**
 * Accepts Arabic or Myanmar digits, converts Arabic → Myanmar,
 * then strips anything that isn't a Myanmar digit.
 * Use this for any numeric-only Myanmar input.
 */
export function filterMyanmarDigitsWithConversion(value: string): string {
  return arabicToMyanmar(value).replace(NON_MYANMAR_DIGIT, "")
}