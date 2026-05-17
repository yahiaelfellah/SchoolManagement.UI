// src/composables/useLocalI18n.ts
import { useI18n } from "vue-i18n";

/**
 * useLocalI18n - Scoped i18n helper for any view or module
 * @param basePath - The base i18n path (e.g. "operations.students.enrollStudent")
 */
export function useLocalI18n(basePath: string) {
  const { t } = useI18n();
  /**
   * Local translator that automatically prepends the base path.
   * Example: tl('form.student') → t('operations.students.enrollStudent.form.student')
   */
  const tl = (key: string, params?: Record<string, any>) =>
    params ? t(`${basePath}.${key}`, params) : t(`${basePath}.${key}`);
  return { t, tl };
}
