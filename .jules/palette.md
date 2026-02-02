## 2024-05-22 - Visual Feedback for Async Actions
**Learning:** Users often click submit buttons multiple times if the only feedback is text change (e.g., "Processing..."). A rotating spinner provides a stronger visual cue that the application is "working" and active, reducing rage clicks and uncertainty.
**Action:** Replace text-only loading states in primary action buttons (Checkout, Add to Cart) with a standard spinner icon (`Loader2`) + label pattern to maintain context while indicating progress.
