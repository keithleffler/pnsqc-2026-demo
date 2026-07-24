import { Locator } from '@playwright/test';
import { UIElementActions } from './UIElementActions';

export class EditBoxActions extends UIElementActions {
  public setEditBox(selector: string | Locator, description: string): EditBoxActions {
    this.setElement(selector, description);
    return this;
  }

  public async type(text: string): Promise<void> {
    console.log(`Typing '${text}' into ${this.description}`);
    await this.locator.fill(text);
  }

  public async clear(): Promise<void> {
    console.log(`Clearing ${this.description}`);
    await this.locator.fill('');
  }

  public async getValue() {
    console.log(`Getting value from ${this.description}`);
    return await this.locator.inputValue();
  }
}
