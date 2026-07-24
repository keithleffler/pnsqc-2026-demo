// src/helper/actions/CheckBoxActions.ts

import { Locator } from '@playwright/test';
import { UIElementActions } from './UIElementActions';

export class CheckBoxActions extends UIElementActions {
  //   private locator!: Locator;
  //   private description!: string;

  public setCheckbox(selector: Locator, description: string): CheckBoxActions {
    this.locator = this.locatorFactory.getLocator(this.locator);
    this.description = description;
    return this;
  }

  public async check(): Promise<void> {
    console.log(`Checking ${this.description}`);
    await this.locator.check();
  }

  public async uncheck(): Promise<void> {
    console.log(`Unchecking ${this.description}`);
    await this.locator.uncheck();
  }

  public async isChecked() {
    console.log(`Checking if ${this.description} is checked`);
    return await this.locator.isChecked();
  }
}
