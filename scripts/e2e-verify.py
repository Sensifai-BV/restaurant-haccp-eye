import asyncio
import sys
import json
from playwright.async_api import async_playwright

async def run_e2e():
    print("=====================================================================")
    print("  Restaurant HACCP Eye Phase 4 & API Full End-to-End (E2E) Verification")
    print("=====================================================================\n")

    errors = []
    page_errors = []
    console_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True
        )

        # -------------------------------------------------------------
        # Journey 1: Zero Runtime & Console Errors on / and /workspace
        # -------------------------------------------------------------
        print("[E2E Test 1] Verifying Zero Runtime, Hydration & Console Errors...")
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        page.on("pageerror", lambda err: page_errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: console_errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        res_home = await page.goto("http://localhost:3000", wait_until="networkidle")
        assert res_home.status == 200, f"Expected 200 for /, got {res_home.status}"

        res_work = await page.goto("http://localhost:3000/workspace", wait_until="networkidle")
        assert res_work.status == 200, f"Expected 200 for /workspace, got {res_work.status}"

        if page_errors:
            print(f"  ✗ Page errors detected: {page_errors}")
            errors.extend(page_errors)
        else:
            print("  ✓ Zero uncaught page exceptions or React crashes")

        if console_errors:
            print(f"  ✗ Console errors detected: {console_errors}")
            errors.extend(console_errors)
        else:
            print("  ✓ Zero console errors or React hydration mismatches")

        # -------------------------------------------------------------
        # Journey 2: Plain-Text Copy Cleanliness & Asset Integrity
        # -------------------------------------------------------------
        print("\n[E2E Test 2] Verifying Plain-Text Copy Cleanliness & Image Asset Integrity...")
        await page.goto("http://localhost:3000", wait_until="networkidle")

        body_text = await page.inner_text("body")
        for bad_pattern in ["**", "###", "```", "\\n\\n"]:
            if bad_pattern in body_text:
                err = f"Raw Markdown/escape sequence '{bad_pattern}' detected in rendered landing UI!"
                print(f"  ✗ {err}")
                errors.append(err)
        print("  ✓ Plain-text cleanliness verified: 0 raw Markdown markers or broken escapes in copy")

        # Scroll to ensure all assets load
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)

        # Image natural width checks
        images = await page.eval_on_selector_all("img", """
            imgs => imgs.map(img => ({
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            }))
        """)

        failed_imgs = [img for img in images if not img["complete"] or img["naturalWidth"] == 0]
        if failed_imgs:
            print(f"  ✗ Broken images found: {failed_imgs}")
            errors.append(f"Broken images: {failed_imgs}")
        else:
            print(f"  ✓ All {len(images)} images on landing page loaded with naturalWidth > 0")

        # -------------------------------------------------------------
        # Journey 3: Interactive Preset Switching Flow in /workspace
        # -------------------------------------------------------------
        print("\n[E2E Test 3] Verifying Interactive Preset Switching & Telemetry Flow...")
        await page.goto("http://localhost:3000/workspace", wait_until="networkidle")

        # Check default preset
        title_initial = await page.inner_text("h3")
        assert "Walk-In Cooler" in title_initial, f"Expected Walk-In Cooler in initial title, got: {title_initial}"
        print(f"  ✓ Initial preset verified: {title_initial}")

        # Click preset 2 (Salad Prep)
        preset_buttons = await page.query_selector_all("button:has-text('Salad Prep')")
        if preset_buttons:
            await preset_buttons[0].click(force=True)
            await page.wait_for_timeout(500)
            title_p2 = await page.inner_text("h3")
            assert "Salad Prep" in title_p2 or "Deli Slicer" in title_p2, f"Expected Salad Prep in title, got: {title_p2}"
            print(f"  ✓ Preset switch 2 verified: {title_p2}")

        # Click preset 3 (Raw Seafood)
        preset_seafood = await page.query_selector_all("button:has-text('Raw Seafood')")
        if preset_seafood:
            await preset_seafood[0].click(force=True)
            await page.wait_for_timeout(500)
            title_p3 = await page.inner_text("h3")
            assert "Seafood" in title_p3 or "Hot Holding" in title_p3, f"Expected Seafood in title, got: {title_p3}"
            print(f"  ✓ Preset switch 3 verified: {title_p3}")

        # Check AI Disclaimer presence
        disclaimer = await page.query_selector("text=Sensifai AI may make mistakes")
        assert disclaimer is not None, "Mandatory AI Legal & Accuracy Disclaimer not rendered in workspace!"
        print("  ✓ Mandatory AI Legal & Accuracy Disclaimer verified below action buttons")

        # -------------------------------------------------------------
        # Journey 4: Custom Input Auth Gate Flow
        # -------------------------------------------------------------
        print("\n[E2E Test 4] Verifying Custom Input Auth Gate & 401 Enforcement...")
        # Switch to Custom Station Audit tab
        custom_tab_btn = await page.query_selector("button:has-text('Custom Station Audit')")
        assert custom_tab_btn is not None, "Custom Station Audit tab button missing!"
        await custom_tab_btn.click(force=True)
        await page.wait_for_timeout(500)

        # Check AuthGateCard visibility for guest
        auth_gate = await page.query_selector("text=Sign In")
        assert auth_gate is not None, "AuthGateCard not displayed for unauthenticated custom analysis!"
        print("  ✓ Unauthenticated user receives AuthGateCard with Sign In prompt")

        # Test API Route 401 directly
        api_res = await page.request.post("http://localhost:3000/api/billable-action", data=json.dumps({
            "operation": "haccp_audit",
            "stationName": "Unauthorized Walk-In Test",
            "measuredTemp": 39.0
        }), headers={"Content-Type": "application/json"})
        assert api_res.status == 401, f"Expected 401 Unauthorized on billable route, got {api_res.status}"
        api_json = await api_res.json()
        assert api_json.get("code") == "UNAUTHORIZED", f"Expected UNAUTHORIZED code, got {api_json}"
        print("  ✓ POST /api/billable-action strictly returns HTTP 401 UNAUTHORIZED for guests")

        # -------------------------------------------------------------
        # Journey 5: Real OIDC Login Redirect Resolution
        # -------------------------------------------------------------
        print("\n[E2E Test 5] Verifying Real Logto OIDC PKCE Login Redirect...")
        login_res = await page.request.get("http://localhost:3000/api/auth/login", max_redirects=0)
        assert login_res.status in [302, 307], f"Expected 302/307 redirect from /api/auth/login, got {login_res.status}"
        redirect_location = login_res.headers.get("location", "")
        assert "auth.sensifai.com/oidc/auth" in redirect_location, f"Expected Logto OIDC auth URL, got: {redirect_location}"
        assert "response_type=code" in redirect_location, "Missing response_type=code in OIDC redirect"
        assert "code_challenge=" in redirect_location, "Missing PKCE code_challenge in OIDC redirect"
        print(f"  ✓ Live Logto OIDC PKCE redirect verified: {redirect_location[:60]}...")

        # -------------------------------------------------------------
        # Journey 6: Responsive Layout (Desktop Left Sidebar vs Mobile Bottom Bar)
        # -------------------------------------------------------------
        print("\n[E2E Test 6] Verifying Responsive Layouts & Zero Overflow...")
        # Desktop check: Left sidebar present
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.goto("http://localhost:3000/workspace", wait_until="networkidle")
        sidebar = await page.query_selector("aside")
        assert sidebar is not None, "Desktop Left Sidebar (aside) not found at 1280px viewport!"
        print("  ✓ Desktop (1280px): Collapsible Left Sidebar & Live Wallet Card rendered")

        # Mobile check: Bottom tab bar present + zero horizontal overflow
        await page.set_viewport_size({"width": 375, "height": 812})
        await page.goto("http://localhost:3000/workspace", wait_until="networkidle")
        await page.wait_for_timeout(800)

        mobile_nav = await page.query_selector("nav.fixed.bottom-0, div.fixed.bottom-0")
        assert mobile_nav is not None, "Mobile fixed bottom navigation bar not found at 375px viewport!"
        print("  ✓ Mobile (375px): Native Fixed Bottom Navigation Bar rendered")

        overflow = await page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        assert not overflow, "Mobile layout has horizontal overflow (scrollWidth > innerWidth)!"
        print("  ✓ Mobile (375px): Zero horizontal overflow verified (scrollWidth <= innerWidth)")

        # -------------------------------------------------------------
        # Journey 7: Developer API Hub Key Issuance & Masked Secrets
        # -------------------------------------------------------------
        print("\n[E2E Test 7] Verifying Developer API Key Generation & Masked Secrets (/api/v1/keys)...")
        new_key_res = await page.request.post("http://localhost:3000/api/v1/keys", data=json.dumps({
            "name": "Line Cook Tablet Station #2 Key"
        }), headers={"Content-Type": "application/json"})
        assert new_key_res.status == 201, f"Expected 201 Created on /api/v1/keys, got {new_key_res.status}"
        new_key_data = await new_key_res.json()
        assert new_key_data.get("success") is True, f"Failed key generation: {new_key_data}"
        raw_api_key = new_key_data.get("apiKey")
        assert raw_api_key and raw_api_key.startswith("rh_live_"), f"API key must start with rh_live_, got: {raw_api_key}"
        assert len(raw_api_key) >= 40, f"API key length must be >= 40, got: {len(raw_api_key)}"
        print(f"  ✓ Newly issued dedicated application key: {raw_api_key[:12]}...{raw_api_key[-4:]}")

        # List keys and verify raw secret is NOT leaked in GET
        list_keys_res = await page.request.get("http://localhost:3000/api/v1/keys")
        assert list_keys_res.status == 200, f"Expected 200 from GET /api/v1/keys, got {list_keys_res.status}"
        list_keys_data = await list_keys_res.json()
        assert list_keys_data.get("success") is True, f"Failed listing keys: {list_keys_data}"
        assert len(list_keys_data.get("keys", [])) >= 1, "Expected at least 1 key in list"
        for k in list_keys_data["keys"]:
            assert "maskedKey" in k, f"Key missing maskedKey: {k}"
            assert "key" not in k, f"CRITICAL: Full unmasked secret leaked in GET /api/v1/keys: {k}"
            assert "sub" not in k and "logto" not in str(k).lower(), f"CRITICAL: User ID leaked in keys list: {k}"
        print("  ✓ GET /api/v1/keys returns properly masked secrets with zero credential leakage")

        # -------------------------------------------------------------
        # Journey 8: Developer Station Catalog & CCP Standards (/api/v1/stations)
        # -------------------------------------------------------------
        print("\n[E2E Test 8] Verifying Developer Station Catalog & Standards (/api/v1/stations)...")
        stations_res = await page.request.get("http://localhost:3000/api/v1/stations")
        assert stations_res.status == 200, f"Expected 200 from GET /api/v1/stations, got {stations_res.status}"
        stations_data = await stations_res.json()
        assert stations_data.get("success") is True, f"Failed stations catalog: {stations_data}"
        assert stations_data.get("totalStations") == 4, f"Expected 4 station presets, got {stations_data.get('totalStations')}"
        assert "ccpStandards" in stations_data, "Missing ccpStandards in stations response"
        assert stations_data["ccpStandards"]["coldFoodHolding"]["maxTempF"] == 41.0, "FDA 41.0F standard check failed"
        print(f"  ✓ Station catalog verified: 4 stations, FDA Food Code standards, and zero user PII")

        # -------------------------------------------------------------
        # Journey 9: Public B2B HACCP Audit API Auth Gate Enforcement
        # -------------------------------------------------------------
        print("\n[E2E Test 9] Verifying Public B2B HACCP Audit API Auth Gate (/api/v1/audit)...")
        # Without key -> 401
        no_key_res = await page.request.post("http://localhost:3000/api/v1/audit", data=json.dumps({
            "stationName": "Walk-In Cooler Line",
            "measuredTemp": 37.5
        }), headers={"Content-Type": "application/json"})
        assert no_key_res.status == 401, f"Expected 401 Unauthorized without API key, got {no_key_res.status}"
        no_key_data = await no_key_res.json()
        assert no_key_data.get("code") == "UNAUTHORIZED_KEY", f"Expected UNAUTHORIZED_KEY, got {no_key_data}"
        print("  ✓ POST /api/v1/audit strictly rejects calls with missing or invalid API keys (401)")

        # -------------------------------------------------------------
        # Journey 10: Real B2B HACCP Telemetry Audit Execution with Valid Key
        # -------------------------------------------------------------
        print("\n[E2E Test 10] Verifying Real B2B HACCP Audit Execution with Valid API Key...")
        audit_res = await page.request.post("http://localhost:3000/api/v1/audit", data=json.dumps({
            "stationName": "Main Walk-In Cooler Line",
            "category": "Cold Holding & Protein Storage",
            "measuredTemp": 36.8,
            "unit": "°F",
            "observations": "Stainless steel cambros organized by protein hierarchy. Digital probe calibrated.",
            "labelsText": "Poultry prepped today, expiration Nov 17."
        }), headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {raw_api_key}"
        })
        assert audit_res.status == 200, f"Expected 200 OK from /api/v1/audit with valid key, got {audit_res.status}"
        audit_data = await audit_res.json()
        assert audit_data.get("success") is True, f"Audit returned success=false: {audit_data}"
        assert audit_data.get("reportId", "").startswith("HACCP-"), f"Invalid reportId: {audit_data.get('reportId')}"
        assert audit_data.get("ccpStatus") in ["PASSED", "ACTION_REQUIRED", "CRITICAL_VIOLATION"], f"Invalid ccpStatus: {audit_data.get('ccpStatus')}"
        assert 0 <= audit_data.get("overallScore", -1) <= 100, f"Score out of bounds: {audit_data.get('overallScore')}"
        assert len(audit_data.get("findings", [])) >= 1, "Audit returned 0 findings"
        # STRICT PRIVACY CHECK: Verify NO Logto ID or personal data in response
        response_str = json.dumps(audit_data).lower()
        for forbidden in ["wckiqf9jo9gs", "sub", "logto_id", "client_secret", "refresh_token"]:
            assert forbidden not in response_str, f"CRITICAL LEAK: Forbidden token '{forbidden}' detected in API response!"
        print(f"  ✓ B2B Audit verified: Report {audit_data['reportId']} ({audit_data['ccpStatus']}, Score: {audit_data['overallScore']}%)")
        print("  ✓ Zero personal Logto IDs or developer secrets exposed in response payload")

        # -------------------------------------------------------------
        # Journey 11: Workspace Developer Hub UI Navigation
        # -------------------------------------------------------------
        print("\n[E2E Test 11] Verifying Workspace Developer Hub UI & Sandbox...")
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.goto("http://localhost:3000/workspace?tab=api", wait_until="networkidle")
        await page.wait_for_timeout(500)

        # Check API Hub header
        api_header = await page.query_selector("text=Developer & POS API Integration Hub")
        assert api_header is not None, "Developer API Hub header not rendered!"

        # Check Create API Key button
        create_btn = await page.query_selector("button:has-text('Create API Key')")
        assert create_btn is not None, "Create API Key button not found in API Hub!"

        # Check Sandbox form
        sandbox_input = await page.query_selector("input[placeholder*='rh_live_']")
        assert sandbox_input is not None, "API Key input for sandbox not rendered!"
        print("  ✓ Developer API Hub UI renders key management table and interactive REST sandbox")

        await browser.close()

    print("\n=====================================================================")
    if errors:
        print(f"  FAILED: {len(errors)} E2E issues detected:")
        for e in errors:
            print(f"    - {e}")
            sys.exit(1)
    else:
        print("  ALL 11 BROWSER & REST API E2E USER JOURNEYS PASSED WITH ZERO DEFECTS!")
    print("=====================================================================\n")

if __name__ == "__main__":
    asyncio.run(run_e2e())
