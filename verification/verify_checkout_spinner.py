from playwright.sync_api import sync_playwright, expect
import json
import time

def test_checkout_spinner():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800}
        )

        # Mock cart data
        cart_data = {
            "state": {
                "items": [
                    {
                        "id": "item_1",
                        "quantity": 1,
                        "price": 100,
                        "bookId": "book_1",
                        "book": {
                            "id": "book_1",
                            "title": "Test Book",
                            "slug": "test-book",
                            "author": "Test Author",
                            "price": 100,
                            "sellingPrice": 100,
                            "mrp": 150,
                            "stockQuantity": 10,
                            "coverImage": "/placeholder-book.jpg"
                        }
                    }
                ],
                "sessionId": "session_1"
            },
            "version": 0
        }

        # Inject localStorage before page load
        cart_json = json.dumps(cart_data)
        context.add_init_script(f"""
            window.localStorage.setItem('srushti-cart', JSON.stringify({cart_json}));
        """)

        # Note: JSON.stringify inside JS because passing the string directly might have escaping issues if we aren't careful,
        # but here we are passing the python string which is a valid JSON object string.
        # Actually safer:
        # context.add_init_script(script="window.localStorage.setItem('srushti-cart', '" + cart_json + "');")
        # But cart_json has double quotes.
        # Let's use the object passing capability if possible, or just be careful.

        # Use a function to avoid quoting hell
        context.add_init_script(f"""
            const data = {cart_json};
            window.localStorage.setItem('srushti-cart', JSON.stringify(data));
        """)

        page = context.new_page()

        # 2. Navigate to checkout
        page.goto("http://localhost:3000/checkout")

        # Verify we are on checkout and have items
        # Wait for hydration
        try:
            expect(page.get_by_text("Test Book")).to_be_visible(timeout=5000)
        except:
            # If failed, take screenshot to debug
            page.screenshot(path="verification/failed_state.png")
            raise

        # 3. Fill form
        page.fill('input[name="firstName"]', "Test")
        page.fill('input[name="email"]', "test@example.com")
        page.fill('input[name="phone"]', "9876543210")
        page.fill('textarea[name="address"]', "123 Test St")
        page.fill('input[name="city"]', "Bangalore")
        page.fill('input[name="pincode"]', "560001")

        # 4. Mock the order API to be slow so we can see the spinner
        def handle_order(route):
            time.sleep(2)
            route.fulfill(status=200, body=json.dumps({"success": True, "orderNumber": "123"}))

        page.route("**/api/orders", handle_order)

        # 5. Click Order
        button = page.get_by_role("button", name="ಆರ್ಡರ್ ಮಾಡಿ")

        # Scroll to button just in case
        button.scroll_into_view_if_needed()
        button.click()

        # 6. Verify Spinner/Processing state
        # The button text changes to 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...'
        expect(page.get_by_text("ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...")).to_be_visible()

        # 7. Take screenshot immediately
        page.screenshot(path="verification/verification.png")

        browser.close()

if __name__ == "__main__":
    test_checkout_spinner()
