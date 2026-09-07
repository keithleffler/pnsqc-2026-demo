Feature: Product card and detail page

  # ── Figure 1, panel 1a — the scenario as it began ────────────────────────────
  # One responsibility: from the category page, opening a product card lands on
  # that product's detail page. If it goes red, exactly one thing is wrong.
  Scenario: Opening a product card lands on the product detail page
    Given a shopper is on the "us" store category page
    When they open the "t-shirt" product card
    Then they should be on the "t-shirt" product detail page

  # ── Figure 1, panel 1b — the same feature a year later ───────────────────────
  # One scenario now asserts component visibility, pricing, the sale, a second
  # region, and several navigations. A failure at any early step blocks every
  # step below it, so a red run no longer says which thing broke.
  Scenario: Reviewing the T-Shirt across regions and related products
    Given a shopper is on the "us" store category page
    Then they should see the "t-shirt" product card
    And the "t-shirt" card should show sale price "$10.00" and original price "$15.00"
    When they open the "t-shirt" product card
    Then they should be on the "t-shirt" product detail page
    And they should see the title, description, price, options, and Add to Cart button
    And the detail page should show sale price "$10.00", original price "$15.00", and discount "-33%"
    And they should see the related products
    When they view the "t-shirt" product in the "gb" region
    Then the price should be shown in "€"
    And the sale badge should not appear
    When they view the "t-shirt" product in the "us" region
    And they open the "sweatshirt" related product
    Then they should be on the "sweatshirt" product detail page
