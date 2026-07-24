// src/helper/actions/DropDownActions.ts
import { Locator } from '@playwright/test';
import { UIElementActions } from './UIElementActions';

export class DropDownActions extends UIElementActions {
  public setDropdown(selector: string | Locator, description: string): DropDownActions {
    this.locator = this.locatorFactory.getLocator(this.locator);
    this.description = description;
    return this;
  }

  public async selectByValue(value: string): Promise<void> {
    console.log(`Selecting value '${value}' in ${this.description}`);
    await this.locator.selectOption({ value });
  }

  public async selectByLabel(label: string): Promise<void> {
    console.log(`Selecting label '${label}' in ${this.description}`);
    await this.locator.selectOption({ label });
  }

  public async getSelectedValue() {
    console.log(`Getting selected value of ${this.description}`);
    return await this.locator.inputValue();
  }
}
