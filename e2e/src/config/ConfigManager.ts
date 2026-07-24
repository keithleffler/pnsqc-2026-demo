import { UrlConstants } from '../support/constants/UrlConstants';
import { Browsers } from '../support/enum/Browsers';
import { Environments } from '../support/enum/Environments';

export class ConfigManager {
  public static getEnvironment(): Environments {
    const env = process.env.ENVIRONMENT?.toUpperCase() as Environments;
    if (!env || !(env in Environments)) {
      throw new Error('Invalid or missing ENVIRONMENT in .env');
    }
    return env;
  }

  public static getBaseUIUrl(): string {
    const env = this.getEnvironment();
    switch (env) {
      case Environments.QA:
      case Environments.DEV:
        return UrlConstants.QA_BASE_UI_URL;
      case Environments.STAGE:
      case Environments.PROD:
        return UrlConstants.STAGE_BASE_UI_URL;
      default:
        throw new Error('Unhandled environment in getBaseUIUrl');
    }
  }

  public static getBrowser(): Browsers {
    const browser = process.env.BROWSER?.toLowerCase();
    switch (browser) {
      case Browsers.FIREFOX:
        return Browsers.FIREFOX;
      case Browsers.WEBKIT:
        return Browsers.WEBKIT;
      case Browsers.MSEDGE:
        return Browsers.MSEDGE;
      default:
        return Browsers.CHROMIUM;
    }
  }

  public static isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }
}
