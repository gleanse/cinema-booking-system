# Security Notes (To Revisit Later)
these are things to enable, review, or monitor when authentication, user data, or sensitive features are added

## Cookie & CSRF
- [ ] Set `CSRF_COOKIE_SECURE = True` (only over HTTPS)
- [ ] Set `SESSION_COOKIE_SECURE = True` (only over HTTPS)
- [ ] Configure `CSRF_TRUSTED_ORIGINS` when adding frontend clients

## HTTP Security Headers
- [ ] `SECURE_BROWSER_XSS_FILTER = True`
- [ ] `SECURE_CONTENT_TYPE_NOSNIFF = True`
- [ ] `X_FRAME_OPTIONS = "DENY"`
- [ ] Consider HSTS:
  - `SECURE_HSTS_SECONDS = 31536000`
  - `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`
  - `SECURE_HSTS_PRELOAD = True`

## Database & Secrets
- [ ] Rotate DB passwords regularly
- [ ] Ensure `SECRET_KEY` is strong and kept in environment variables
- [ ] Only give database user minimal privileges

## Notes / Reminders
- Only enable cookie & header security when `DEBUG = False`
- Monitor logs for suspicious activity once auth is added
- all this environment variables are usually set on render not the local .env
