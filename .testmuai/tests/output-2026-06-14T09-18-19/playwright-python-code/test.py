import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="0446d8f4-0926-44c3-b0c6-4e7b13c9d4bc",
    name="Verify Login Page Load",
    tc_id="TC-2",
    network=os.getenv("NETWORK", "false").lower() == "true",
    variables={"login_page_loads_successfully": "true"},
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=30000,
    kane_run_v4=True,
)

async def _resolve_ranked_locator(page, locators, description=""):
    """Return the first locator in *locators* that matches at least one element.

    Mirrors Selenium's ranked-selector iteration: tries each locator in the
    order supplied and stops at the first match, preserving selector rank
    priority rather than DOM order (which .or_().first would use).

    When no locator resolves:
      - description provided (V3 path): returns ``testmu.locator(page,
        description=description)`` — a VisionLocator that triggers the heal
        cascade when its action method is awaited.
      - description omitted (V4 path): raises ``TimeoutError``.
    """
    for _loc in locators:
        if await _loc.count() > 0:
            return _loc
    if description:
        import testmu
        return testmu.locator(page, description=description)
    raise TimeoutError("ranked locator resolution exhausted — no selector matched")


@testmu.test
async def test(page: Page):
    async with testmu.step('Navigate to https://eventhub.rahulshettyacademy.com', instruction_id='c7ecf73e-7b17-418d-b44f-7697cebbea3c'):
        await page.goto("https://eventhub.rahulshettyacademy.com")
    
    async with testmu.step('PRIMARY: whether the EventHub login page is loaded successfully; return true if a login form is visible with heading "Sign in to EventHub" and input fields labeled "Email" and "Password" and a "Sign In" button; otherwise return false', instruction_id='cc1ebc48-c747-409e-9549-257eb7813ae6'):
        set_var('login_page_loads_successfully', await testmu.vision_query(page, "PRIMARY: whether the EventHub login page is loaded successfully; return true if a login form is visible with heading \"Sign in to EventHub\" and input fields labeled \"Email\" and \"Password\" and a \"Sign In\" button; otherwise return false", ""))
    
    async with testmu.step('Assertion check', instruction_id='f6924ccf-365b-415e-8182-5cde24e0544b'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Login page loads successfully', 'passed': True, 'operator': 'equals', 'transforms': [], 'expected': 'true', 'extracted_value': '{{login_page_loads_successfully}}', 'store_key': 'login_page_loads_successfully', 'variable_refs': {'{{login_page_loads_successfully}}': 'true'}}], 'sub_checks': [{'description': 'Login page loads successfully', 'store_key': 'login_page_loads_successfully', 'expected_value': 'true', 'extracted_value': '{{login_page_loads_successfully}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'Verify Login Page loads successfully'})


if __name__ == "__main__":
    testmu.run(test)