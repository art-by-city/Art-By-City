console.log(
  `env_variables:
  JWT_SECRET: ${process.env.JWT_SECRET}
  JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}
  SMTP_HOST: ${process.env.SMTP_HOST}
  SMTP_USER: ${process.env.SMTP_USER}
  SMTP_PASS: ${process.env.SMTP_PASS}
  DB_HOST: ${process.env.DB_HOST}
  DB_PORT: ${process.env.DB_PORT}
  DB_USER: ${process.env.DB_USER}
  DB_PASS: ${process.env.DB_PASS}
  DB_NAME: ${process.env.DB_NAME}
  EXM_API_KEY: ${process.env.EXM_API_KEY}
  ARK_EXM_FUNCTION_ID: ${process.env.ARK_EXM_FUNCTION_ID}
  ADMIN_JWK_PATH: ${process.env.ADMIN_JWK_PATH}
  `
)
