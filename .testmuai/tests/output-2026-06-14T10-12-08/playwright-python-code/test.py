import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="2436bb47-9e42-4a0e-b688-18fb2280c0fd",
    name="Log In to EventHub",
    tc_id="TC-3",
    network=os.getenv("NETWORK", "false").lower() == "true",
    variables={"__cp_final": "true"},
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
    async with testmu.step('Navigate to https://eventhub.rahulshettyacademy.com', instruction_id='49ec52e1-c88e-4225-b921-b31408c2b324'):
        await page.goto("https://eventhub.rahulshettyacademy.com")
    
    async with testmu.step('Confirming the login page is open', instruction_id='89472f3a-7ab9-417f-9647-ebeeb6278c54'):
        await page.wait_for_timeout(500)
    
    async with testmu.step('Typing email into the login form', instruction_id='5f4a4485-5bcd-46c1-afec-e1cca63af34d'):
        element_0 = page.locator("internal:role=textbox[name=\"Email\"i]")
        
        await element_0.click()
        await element_0.fill("testing@gmail.com")
    
    async with testmu.step('Typing password into the Password field', instruction_id='047c3a8f-227a-4b6d-a7bf-8c249d3fa668'):
        element_1 = page.locator("internal:role=textbox[name=\"Password\"i]")
        
        await element_1.click()
        await element_1.fill("Testing@123")
    
    async with testmu.step('Clicking the Sign In button', instruction_id='5e4a5cb0-749c-406a-a3a5-0e16e9e25c4a'):
        _loc_1 = page.locator("internal:role=button[name=\"Sign In\"i]")
        
        await _loc_1.click()
    _condition_met = False
    _until_retries = 0
    while _until_retries < 10:
        print(f"[until-loop] iteration {_until_retries + 1}/10")
        async with testmu.step("PRIMARY: wait for login to complete and dashboard/header navigation to appear (e.g., a 'Logout' link or 'Home'/'Events' menu visible)", instruction_id='d0f00c5e-2192-4146-b3e8-5fe08447682f'):
            await page.wait_for_timeout(1000)
        await page.wait_for_timeout(500)
        if await testmu.check_until_condition(page, "the top navigation shows a link or text 'Logout'"):
            _condition_met = True
            break
        _until_retries += 1
    set_var("__result__", {"condition_met": _condition_met, "retries": _until_retries + 1})
    
    async with testmu.step('Waiting briefly after successful login', instruction_id='c4daa00f-550c-46bf-8c0d-c6568104a3fd'):
        await page.wait_for_timeout(200)
    
    async with testmu.step('PRIMARY: a "Logout" link is visible in the top navigation bar | HINTS: top-right header Always answer true/false, nothing else.', instruction_id='fa6e4a02-7132-4faa-80f6-9443a68a5472'):
        set_var('__cp_final', await testmu.vision_query(page, "PRIMARY: a \"Logout\" link is visible in the top navigation bar | HINTS: top-right header Always answer true/false, nothing else.", ""))
    
    async with testmu.step('Assertion check', instruction_id='98331254-a598-4613-b9da-81f5c69bb4ce'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'Final verification — confirm the objective is fully achieved', 'passed': True, 'operator': 'equals', 'transforms': ['strip', 'lowercase'], 'expected': 'true', 'extracted_value': '{{__cp_final}}', 'store_key': '__cp_final', 'variable_refs': {'{{__cp_final}}': 'true'}}], 'sub_checks': [{'description': 'Final verification — confirm the objective is fully achieved', 'store_key': '__cp_final', 'expected_value': 'true', 'extracted_value': '{{__cp_final}}', 'operator': 'equals', 'transforms': ['strip', 'lowercase']}], 'composite_operator': 'and', 'claim': 'Log in to EventHub with testing@gmail.com and password Testing@123'})


if __name__ == "__main__":
    testmu.run(test)