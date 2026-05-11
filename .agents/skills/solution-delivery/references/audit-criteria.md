# Mocking GUI Project Audit & Diagnosis Criteria

Diagnosis criteria for analyzing a user's project environment and determining the expected value and migration necessity when introducing Mocking GUI.

## 1. Project Tech Stack Audit

- **Framework Recognition**: Identifying the characteristics of each framework such as Next.js (App/Pages), React (Vite/CRA), and Remix.
- **Mocking Maturity**: Measuring current MSW usage, `faker` usage, and the proportion of hard-coded mock data.
- **Infrastructure Check**: Verifying package manager (pnpm/npm/yarn), TypeScript configuration, and Service Worker support.

## 2. Mocking Scale & Complexity

- **API Volume**: Determining the need to introduce Swagger Bridge based on total number of APIs (recommended for > 20).
- **Data Complexity**: Deciding whether to apply the ID Chain pattern based on the depth of relational data.
- **State Complexity**: Identifying whether complex scenarios requiring cross-screen integration exist.

## 3. Decision Matrix

- **Raw MSW -> Mocking GUI**: Emphasize the need for GUI control and scenario management efficiency.
- **No Mocking -> Mocking GUI**: Emphasize development productivity (DX) and parallel development capability.
- **Legacy Mocking -> Mocking GUI**: Propose improved maintainability through a standardized 4-Layer architecture.
