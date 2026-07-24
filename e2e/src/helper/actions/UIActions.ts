import { CheckBoxActions } from './CheckBoxActions';
import { DropDownActions } from './DropDownActions';
import { EditBoxActions } from './EditBoxActions';
import { UIElementActions } from './UIElementActions';
import { PageActions } from './PageActions';
import { AssertUtils } from '../asserts/AssertUtils';
import { ExpectUtils } from '../asserts/ExpectUtils';
import { Locator, Page } from '@playwright/test';

/**
 * Single entry point for page objects. Owns one PageActions (the live-page
 * owner) and injects it into every action/assertion helper so they all target
 * the same, current page.
 */
export class UIActions {
  private elementAction: UIElementActions;
  private editBoxAction: EditBoxActions;
  private checkboxAction: CheckBoxActions;
  private dropdownAction: DropDownActions;
  private pageActions: PageActions;
  private assertUtils: AssertUtils;
  private expectUtils: ExpectUtils;

  constructor(page: Page) {
    this.pageActions = new PageActions(page);
    this.elementAction = new UIElementActions(this.pageActions);
    this.editBoxAction = new EditBoxActions(this.pageActions);
    this.checkboxAction = new CheckBoxActions(this.pageActions);
    this.dropdownAction = new DropDownActions(this.pageActions);
    this.assertUtils = new AssertUtils();
    this.expectUtils = new ExpectUtils(this.pageActions);
  }

  public checkbox(selector: string | Locator, description: string) {
    return this.checkboxAction.setCheckbox(
      this.elementAction.setElement(selector, description).getLocator(),
      description
    );
  }

  public dropdown(selector: string | Locator, description: string) {
    return this.dropdownAction.setDropdown(
      this.elementAction.setElement(selector, description).getLocator(),
      description
    );
  }

  public editBox(selector: string | Locator, description: string) {
    return this.editBoxAction.setEditBox(selector, description);
  }

  public element(selector: string | Locator, description: string) {
    return this.elementAction.setElement(selector, description).getLocator();
  }

  public page() {
    return this.pageActions;
  }

  public assert() {
    return this.assertUtils;
  }

  public expect() {
    return this.expectUtils;
  }
}
