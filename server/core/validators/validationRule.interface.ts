export interface ValidationRule {
  validate: (v: string) => boolean
  message: string
}
