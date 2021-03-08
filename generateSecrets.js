console.log(
  `env_variables:
  JWT_SECRET: ${process.env.JWT_SECRET}
  JWT_EXPIRES_IN: ${process.env.JWT_EXPIRES_IN}
  SMTP_HOST=${process.env.SMTP_HOST}
  SMTP_USER=${process.env.SMTP_USER}
  SMTP_PASS=${process.env.SMTP_PASS}`
)
