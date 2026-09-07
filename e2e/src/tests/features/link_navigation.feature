Feature: Dynamic link navigation

  # ── Figure 3, before: a wall of near-duplicate scenarios ─────────────────────
  # Each case is the same three steps with different values, and the wall grows
  # one scenario per link.

  Scenario: TC-NAV-01 category to the T-Shirt detail page
    Given a shopper is on the "/us/store" page
    When they click the "a[href$='/products/t-shirt']" link
    Then they should land on the "/us/products/t-shirt" page

  Scenario: TC-NAV-02 category to the Shorts detail page
    Given a shopper is on the "/us/store" page
    When they click the "a[href$='/products/shorts']" link
    Then they should land on the "/us/products/shorts" page

  Scenario: TC-NAV-05 detail page to a related product
    Given a shopper is on the "/us/products/t-shirt" page
    When they click the "[data-testid='related-products-container'] a[href$='/products/shorts']" link
    Then they should land on the "/us/products/shorts" page

  # ...one more scenario per link, and so on.

  # ── Figure 3, after: one Scenario Outline reading a fixture table ─────────────
  # The inputs move out into data, one row per case. Each row keeps its test-case
  # ID, so requirement-to-test-case traceability survives the collapse; coverage
  # grows by adding a row, not another scenario.

  Scenario Outline: <id> link navigation
    Given a shopper is on the "<parent>" page
    When they click the "<link>" link
    Then they should land on the "<target>" page

    Examples:
      | id        | parent               | link                                                                      | target                  |
      | TC-NAV-01 | /us/store            | a[href$='/products/t-shirt']                                              | /us/products/t-shirt    |
      | TC-NAV-02 | /us/store            | a[href$='/products/shorts']                                               | /us/products/shorts     |
      | TC-NAV-03 | /us/store            | a[href$='/products/sweatshirt']                                           | /us/products/sweatshirt |
      | TC-NAV-04 | /us/store            | a[href$='/products/sweatpants']                                           | /us/products/sweatpants |
      | TC-NAV-05 | /us/products/t-shirt | [data-testid='related-products-container'] a[href$='/products/shorts']     | /us/products/shorts     |
      | TC-NAV-06 | /us/products/t-shirt | [data-testid='related-products-container'] a[href$='/products/sweatshirt'] | /us/products/sweatshirt |
