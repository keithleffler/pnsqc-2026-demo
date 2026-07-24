// src/helper/actions/UIElementActions.ts
import { Locator } from '@playwright/test';
import { LocatorFactory } from './LocatorFactory';
import { PageActions } from './PageActions';

export class UIElementActions {
  protected locator!: Locator;
  protected description!: string;
  protected selector!: string | Locator;

  // protected (not private) so the typed subclasses can reuse the factory.
  protected readonly locatorFactory: LocatorFactory;

  constructor(protected actions: PageActions) {
    this.locatorFactory = new LocatorFactory(actions);
  }

  public getLocator(): Locator {
    return this.locatorFactory.getLocator(this.locator);
  }

  public getLocators(): Promise<Locator[]> {
    return this.locatorFactory.getAllLocators(this.locator);
  }

  public setElement(selector: string | Locator, description: string): UIElementActions {
    this.selector = selector;
    this.locator =
      typeof this.selector === 'string'
        ? this.actions.getPage().locator(this.selector)
        : this.selector;
    this.description = description;
    return this;
  }

  public setLocator(locator: Locator, description: string): UIElementActions {
    this.locator = locator;
    this.description = description;
    return this;
  }

  public async click(): Promise<void> {
    console.log(`Clicking on ${this.description}`);
    await this.locator.click();
  }

  public async hover(): Promise<void> {
    console.log(`Hovering on ${this.description}`);
    await this.locator.hover();
  }

  public async isVisible() {
    console.log(`Checking visibility of ${this.description}`);
    return await this.locator.isVisible();
  }

  public async getText(): Promise<string> {
    console.log(`Getting text from ${this.description}`);
    return (await this.locator.textContent())?.trim() || '';
  }

  public async waitUntilVisible(): Promise<void> {
    console.log(`Waiting for ${this.description} to be visible`);
    await this.locator.waitFor({ state: 'visible' });
  }
}
