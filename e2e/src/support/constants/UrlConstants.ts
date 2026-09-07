// Base URLs of the Medusa storefront (and its admin API) under test. Sourced
// from the environment (BASE_UI_URL / BASE_API_URL) so the same suite runs
// against the odinforge docker deployment or a local stack without edits;
// the odinforge defaults keep the suite runnable when the vars are unset.
export class UrlConstants {
  public static readonly QA_BASE_UI_URL =
    process.env.BASE_UI_URL ?? 'http://odinforge:8011';
  public static readonly STAGE_BASE_UI_URL =
    process.env.BASE_UI_URL ?? 'http://odinforge:8011';

  public static readonly QA_BASE_API_URL =
    process.env.BASE_API_URL ?? 'http://odinforge:9001';
  public static readonly STAGE_BASE_API_URL =
    process.env.BASE_API_URL ?? 'http://odinforge:9001';
}
