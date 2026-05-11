# Mocking GUI Faker Standards: Deterministic Data Generation

Standard guidelines for using the `faker` library to create reproducible test environments.

## 1. Global Seed Management

All random data generation must be performed based on a fixed seed.

- **Why**: The same data must be maintained across refreshes and rebuilds to ensure test reliability.

## 2. Localization

When Korean data is required, use the `fakerKO` package first; mix in `fakerEN` for technical identifiers (ID, Email, etc.).

## 3. Custom Generators

Domain-specific data (business registration numbers, codes in specific formats, etc.) are managed with custom generators that extend `faker`.
