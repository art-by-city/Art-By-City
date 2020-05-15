export interface ValidationRule {
  validate: (v: string) => boolean
  message: string
}

export const mapRules = (rule: ValidationRule) => (v: string) =>
  rule.validate(v || '') || rule.message
