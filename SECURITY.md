# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving security updates depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[security@example.com](mailto:security@example.com)**. You will receive a response within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

**Please do not report security vulnerabilities through public GitHub issues.**

## Security Best Practices

### Private Keys
- **Never commit private keys** to the repository
- Use environment variables or secure secret management
- `.env` files are git-ignored by default

### Smart Contracts
- All contracts are deployed to testnets (Arbitrum Sepolia) only
- Review all contract code before deployment
- Use multi-sig wallets for production deployments

### Dependencies
- Keep dependencies up to date
- Review dependency changes before updating
- Use `pnpm audit` to check for known vulnerabilities

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under maintenance
4. Publish security advisories
