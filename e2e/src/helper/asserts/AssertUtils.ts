// src/helper/asserts/AssertUtils.ts
import { expect } from '@playwright/test';

/**
 * Value / primitive assertions with custom messaging and optional soft mode.
 * When `softAssert` is true, a failure is logged but not re-thrown, so the
 * scenario keeps running (fail-later strategy).
 */
export class AssertUtils {
  public async assertTrue(
    condition: boolean,
    description: string,
    softAssert = false
  ): Promise<void> {
    console.log(`Verifying that ${description} is true`);
    try {
      expect(condition, `Expected is "True" & Actual is "${condition}"`).toBeTruthy();
    } catch (error) {
      console.log('assertTrue error:', error);
      if (!softAssert) {
        throw new Error(`Error Details are : ${description}.\n${error}`);
      }
    }
  }

  public async assertContains(
    value1: string,
    value2: string,
    description: string,
    softAssert = false
  ): Promise<void> {
    console.log(`Verifying that "${value1}" contains "${value2}"`);
    try {
      expect(value1, `"${value1}" is expected to CONTAIN "${value2}"`).toContain(value2);
    } catch (error) {
      console.log('assertContains error:', error);
      if (!softAssert) {
        throw new Error(`Error Details are : ${description}.\n${error}`);
      }
    }
  }

  public async assertArrayContains<T>(
    expectedValues: T[],
    actual: T,
    description: string,
    softAssert = false
  ): Promise<void> {
    console.log(`Verifying that ${description} contains "${actual}"`);
    try {
      expect(
        expectedValues,
        `"${actual}" is expected to be CONTAINED in "${description}"`
      ).toContain(actual);
    } catch (error) {
      console.log('assertArrayContains error:', error);
      if (!softAssert) {
        throw new Error(`Error Details are : ${description}.\n${error}`);
      }
    }
  }

  public async assertEquals(
    actual: unknown,
    expected: unknown,
    description: string,
    softAssert = false
  ): Promise<void> {
    console.log(`Verifying that ${description} "${actual}" equals "${expected}"`);
    try {
      expect(actual, `Expected "${expected}" should be EQUAL to Actual "${actual}"`).toEqual(
        expected
      );
    } catch (error) {
      console.log('assertEquals error:', error);
      if (!softAssert) {
        throw new Error(`Error Details are : ${description}.\n${error}`);
      }
    }
  }

  public async assertNotEquals(
    actual: unknown,
    expected: unknown,
    description: string,
    softAssert = false
  ): Promise<void> {
    console.log(`Verifying that ${description} "${actual}" is NOT equal to "${expected}"`);
    try {
      expect(actual, `Expected "${expected}" NOT to be EQUAL to Actual "${actual}"`).not.toEqual(
        expected
      );
    } catch (error) {
      console.log('assertNotEquals error:', error);
      if (!softAssert) {
        throw new Error(`Error Details are : ${description}.\n${error}`);
      }
    }
  }
}
