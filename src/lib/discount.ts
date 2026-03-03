/**
 * Discount Calculation Logic for Srushti Publications
 * 
 * HIERARCHY (priority order):
 *  1. Per-book sellingPrice is ALWAYS the final price shown to the customer
 *  2. Per-book discount field is INFORMATIONAL (shows what % is saved)
 *  3. Global/category discount can be applied by admin to recompute sellingPrice 
 *     for ALL books in bulk — it does NOT permanently overwrite MRP
 * 
 * KEY PRINCIPLE:
 *  - MRP = original maximum retail price (never changed)
 *  - sellingPrice = what the customer pays (can be reduced from MRP)
 *  - discount field = percentage saved (for display/badge purposes)
 */

export type DiscountType = 'percentage' | 'fixed'

/**
 * Calculate the final selling price after applying a discount to MRP.
 * Returns the discounted price, rounded to 2 decimal places.
 * Guarantees price >= 1 (never zero or negative).
 */
export function applyDiscount(
  mrp: number,
  discountType: DiscountType,
  discountValue: number,
): number {
  if (!discountValue || discountValue <= 0) return mrp

  let finalPrice: number

  if (discountType === 'percentage') {
    // Cap at 90% max discount
    const safePercent = Math.min(discountValue, 90)
    finalPrice = mrp * (1 - safePercent / 100)
  } else {
    // Fixed amount off — never go below ₹1
    finalPrice = mrp - discountValue
  }

  return Math.max(1, Math.round(finalPrice * 100) / 100)
}

/**
 * Calculate what percentage is being saved from MRP.
 * Returns 0 if no discount, or if sellingPrice >= mrp.
 */
export function calculateSavingsPercent(mrp: number, sellingPrice: number): number {
  if (!mrp || mrp <= 0 || sellingPrice >= mrp) return 0
  return Math.round(((mrp - sellingPrice) / mrp) * 100)
}

/**
 * Validate a discount value before saving.
 * Returns an error message string, or null if valid.
 */
export function validateDiscount(
  mrp: number,
  discountType: DiscountType,
  discountValue: number,
): string | null {
  if (discountValue < 0) return 'ರಿಯಾಯಿತಿ ಋಣಾತ್ಮಕವಾಗಿರಬಾರದು'
  if (discountType === 'percentage') {
    if (discountValue > 90) return 'ಶೇಕಡಾ ರಿಯಾಯಿತಿ 90%ಕ್ಕಿಂತ ಹೆಚ್ಚಿರಬಾರದು'
  } else {
    if (discountValue >= mrp) return 'ಸ್ಥಿರ ರಿಯಾಯಿತಿ MRP ಮೊತ್ತಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು'
    const resultPrice = mrp - discountValue
    if (resultPrice < 1) return 'ಅಂತಿಮ ಬೆಲೆ ₹1 ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬಾರದು'
  }
  return null
}

/**
 * Apply a global/category discount to a list of books.
 * Returns an array of { id, newSellingPrice } updates.
 * Does NOT touch MRP.
 * 
 * @param books - array of { id, mrp, sellingPrice }
 * @param discountType - 'percentage' | 'fixed'
 * @param discountValue - the discount amount
 * @param mode - 'override': always apply to MRP | 'stack': apply on top of existing selling price
 */
export function computeGlobalDiscount(
  books: { id: string; mrp: number; sellingPrice: number }[],
  discountType: DiscountType,
  discountValue: number,
  mode: 'override' | 'stack' = 'override',
): { id: string; sellingPrice: number }[] {
  return books.map((book) => {
    const basePrice = mode === 'override' ? book.mrp : book.sellingPrice
    return {
      id: book.id,
      sellingPrice: applyDiscount(basePrice, discountType, discountValue),
    }
  })
}

/**
 * Format a discount for display in the admin UI.
 */
export function formatDiscountLabel(discountType: DiscountType, discountValue: number): string {
  if (!discountValue) return 'ರಿಯಾಯಿತಿ ಇಲ್ಲ'
  return discountType === 'percentage'
    ? `${discountValue}% ರಿಯಾಯಿತಿ`
    : `₹${discountValue} ರಿಯಾಯಿತಿ`
}
