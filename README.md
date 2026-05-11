# Mocking GUI

<section align="center">
  <h3>Intuitive Mock Service Worker (MSW) Management GUI</h3>
  <p>
    Manage API mocks, simulate complex scenarios, and accelerate development with a powerful GUI.
  </p>
  <a href="https://pages.github.com/kakaoenterprise/mocking-gui">
    <img src="https://img.shields.io/badge/docs-mocking--gui-blue?logo=read-the-docs&logoColor=white" alt="Mocking GUI Docs" />
  </a>
  <a href="https://www.npmjs.com/package/@kakaocloud/mocking-gui">
    <img src="https://img.shields.io/npm/v/@kakaocloud/mocking-gui.svg" alt="NPM Version" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" />
  </a>
</section>

<br />

<div align="center">
  <img src="docs/public/api-tab.png" alt="Mocking GUI Preview" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
</div>

<br />

## Why Mocking GUI?

Mocking GUI supercharges your development workflow by adding a visual layer to **MSW (Mock Service Worker)**. No more code changes to switch mock scenarios or network responses.

- **Visual Control**: Toggle handlers and switch response variants instantly via the GUI.
- **Scenario Management**: Capture complex bug reproduction steps as "Scenarios" and share them with your team.
- **Swagger Integration**: Generate mocks automatically from OpenAPI/Swagger documents.

## Quick Start

### Installation

```bash
pnpm add @kakaocloud/mocking-gui
# or
npm install @kakaocloud/mocking-gui
# or
yarn add @kakaocloud/mocking-gui
```

### Setup

1. **Initialize MSW** (if you haven't already)

```bash
npx msw init <PUBLIC_DIR>
```

2. **Add the Mocking GUI Panel**

Simply render `MockingGUIBoundary` iyoot corootneompnt

```tsx
// src/App.tsx
import { MockingGUIBoundary } from '@kakaocloud/mocking-gui/browser';

function App() {
  return (
    <>
      {/* Conditionally render Mocking GUI Panel only in development */}
      {process.env.NODE_ENV === 'development' ? (
        <MockingGUIBoundary>
          <AppContent />
        </MockingGUIBoundary>
      ) : (
        <AppContent />
      )}
    </>
  );
}
```

## Examples

Explore our ready-to-run examples to see it in action:

| Project                                           | Description                               |
| :------------------------------------------------ | :---------------------------------------- |
| [**next-app-router**](./examples/next-app-router) | Next.js App Router integration (RSC, CSR) |
| [**react-csr**](./examples/react-csr)             | Basic React Example (CSR)                 |

## Documentation

For comprehensive guides and API references, visit our [documentation site](https://pages.github.com/kakaoenterprise/mocking-gui).

- [**Introduction**](https://pages.github.com/kakaoenterprise/mocking-gui/guide/introduction)
- [**API Reference**](https://pages.github.com/kakaoenterprise/mocking-gui/guide/usage/api-guide)
- [**AI Agentic Harness Guide**](./docs/guide/agentic-harness.md)
- [**Contributing Guide**](./CONTRIBUTING.md)

---

## 🎯 Mission Map: 상황별 워크플로우 가이드

원할한 기여를 위해 사용자의 상황에 맞는 **전문가 워크플로우**를 제공합니다. 당신이 필요한 미션을 선택하고 에이전트에게 요청하세요.

| 당신의 상황 (Situation)              | 요청할 미션 (Mission Request)                     | 결과물 (Outcome)                          |
| :----------------------------------- | :------------------------------------------------ | :---------------------------------------- |
| **라이브러리 자체를 개발/수정할 때** | `@harness-dev-pipeline, 개발 파이프라인 시작해줘` | 설계-구현-테스트 파이프라인 진행          |
| **기존 MSW에서 마이그레이션할 때**   | `@technical-solution-support, 진단 시작해줘`      | 자동 진단 기반의 도입 전략 및 솔루션 제공 |

---

## 🚀 Entry Points: 영역별 전문 지식 베이스

하네스 에이전트 시스템은 각 도메인에 특화된 **단일 진입점(Entry Point)**을 제공합니다. 지금 당신이 처한 상황에 맞는 스킬을 선택하세요.

- **[Handler Generation](./.agents/skills/handler-generation/SKILL.md)**: "새로운 API를 모킹해야 하거나, Swagger 명세가 준비되어 있어요."
- **[Mocking GUI Core Knowledge](./.agents/skills/harness-core/SKILL.md)**: "라이브러리 내부 동작 원리나 서버 사이드 동기화 구조가 궁금해요."
- **[Scenario Orchestration](./.agents/skills/scenario-orchestration/SKILL.md)**: "여러 API 상태를 조합하여 복잡한 비즈니스 흐름(버그 재현 등)을 설계하고 싶어요."
- **[Technical Guardrail](./.agents/skills/technical-guardrail/SKILL.md)**: "우리 프로젝트의 모킹 구조가 표준 레이어를 잘 지키고 있는지 검토하고 싶어요."

---

## 🤝 Technical Solution Support 호출하기

대규모 프로젝트 도입이나 구조적인 마이그레이션 고민이 있다면 솔루션 팀을 즉시 호출하세요.

1. **진단 요청**: `@technical-solution-support, 프로젝트 도입 진단 및 솔루션 서포트 진행해줘.`
2. **자동 실행**: 에이전트가 `technical-solution-support` 워크플로우를 가동하여 상황별 최적의 솔루션을 제안합니다.

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) and [AI Agentic Harness Guide](docs/guide/agentic-harness.md) for details on how to get started.

## NOTICE

Please refer to [NOTICE.md](NOTICE.md) for important legal notices and third-party attribution information.

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/kakaoenterprise">Kakao Enterprise Corp.</a></sub>
</div>
