// src/helper/asserts/ExpectUtils.ts
import { expect, Locator, Expect } from '@playwright/test';
import { LocatorFactory } from '../actions/LocatorFactory';
import { PageActions } from '../actions/PageActions';

export interface SoftOption {
  soft?: boolean;
}

export interface ExpectOptions extends SoftOption {
  timeout?: number;
}

/**
 * DOM-focused assertions built on Playwright's `expect`. Supports soft mode
 * (via `expect.configure`) and per-assertion timeouts, with a custom error
 * message surfaced on failure.
 */
export class ExpectUtils {
  private readonly locatorFactory: LocatorFactory;

  constructor(private readonly actions: PageActions) {
    this.locatorFactory = new LocatorFactory(actions);
  }

  private getExpectWithSoftOption(options?: SoftOption): Expect {
    return expect.configure({ soft: options?.soft });
  }

  private getLocatorAndAssert(
    input: string | Locator,
    options?: SoftOption
  ): { locator: Locator; assert: Expect } {
    const locator = this.locatorFactory.getLocator(input);
    const assert = this.getExpectWithSoftOption(options);
    return { locator, assert };
  }

  public async expectElementToBeHidden(
    input: string | Locator,
    errorMessage: string,
    options?: ExpectOptions
  ): Promise<void> {
    const { locator, assert } = this.getLocatorAndAssert(input, options);
    try {
      await assert(locator).toBeHidden(options);
    } catch (error) {
      console.log('expectElementToBeHidden error:', error);
      throw new Error(errorMessage);
    }
  }

  public async expectElementToBeVisible(
    input: string | Locator,
    errorMessage: string,
    options?: ExpectOptions
  ): Promise<void> {
    const { locator, assert } = this.getLocatorAndAssert(input, options);
    try {
      await assert(locator).toBeVisible(options);
    } catch (error) {
      console.log('expectElementToBeVisible error:', error);
      throw new Error(errorMessage);
    }
  }

  public async expectPageToHaveTitle(
    titleOrRegExp: string | RegExp,
    errorMessage: string,
    options?: ExpectOptions
  ): Promise<void> {
    const assert = this.getExpectWithSoftOption(options);
    try {
      await assert(this.actions.getPage()).toHaveTitle(titleOrRegExp, options);
    } catch (error) {
      console.log('expectPageToHaveTitle error:', error);
      throw new Error(errorMessage);
    }
  }

  public async expectPageToHaveURL(
    urlOrRegExp: string | RegExp,
    errorMessage: string,
    options?: ExpectOptions
  ): Promise<void> {
    const assert = this.getExpectWithSoftOption(options);
    try {
      await assert(this.actions.getPage()).toHaveURL(urlOrRegExp, options);
    } catch (error) {
      console.log('expectPageToHaveURL error:', error);
      throw new Error(errorMessage);
    }
  }

  public async expectElementToContainText(
    input: string | Locator,
    expected: string | RegExp,
    errorMessage: string,
    options?: ExpectOptions
  ): Promise<void> {
    const { locator, assert } = this.getLocatorAndAssert(input, options);
    try {
      await assert(locator).toContainText(expected, options);
    } catch (error) {
      console.log('expectElementToContainText error:', error);
      throw new Error(errorMessage);
    }
  }
}
