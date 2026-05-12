---
layout: home
hero:
  name: Mocking GUI
  text: The Mocking GUI for MSW
  tagline: Manage your API mocks with an intuitive GUI panel.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View Examples
      link: https://github.com/kakaoenterprise/mocking-gui/tree/main/examples
features:
  - title: Visual Management
    details: Manage MSW handlers intuitively with GUI panel. Quickly find APIs with search and filtering capabilities.
  - title: Real-time Control
    details: Toggle mocks, switch response variants, and inject network delays instantly without code changes.
  - title: Universal State Sync
    details: Share mock states between Browser and Server (SSR/RSC) seamlessly via cookie propagation.
  - title: Swagger Integration
    details: Generate a complete mock server instantly from your OpenAPI/Swagger documents. No manual handler setup needed.
  - title: Scenario Management
    details: Capture complex bug reproduction steps as "Scenarios". Save, restore, and share them with your team.
  - title: Flexible Interface
    details: Customize the panel's size and position. Shadow DOM ensures zero style conflicts with your application.
---

## What is Mocking GUI?

**Mocking GUI** is a **GUI library based on MSW (Mock Service Worker)**. It provides an intuitive interface to easily mock and test APIs during development.

### Key Features

- **Zero Config**: Seamless integration with MSW.
- **Intuitive Interface**: Manage handlers without complex code.
- **Swagger Automation**: Generate mocks instantly from OpenAPI/Swagger.
- **Type Safe**: Full TypeScript support.

### Quick Start

Start by installing the package in your project.

```bash
pnpm add @kakaocloud/mocking-gui
```

Initialize MSW configuration:

```bash
npx msw init <PUBLIC_DIR> [options]
```

Wrap your application with `MockingGUIBoundary`:

```tsx
import { MockingGUIBoundary } from '@kakaocloud/mocking-gui/browser';

function App() {
  return (
    <MockingGUIBoundary>
      <YourAppContent />
    </MockingGUIBoundary>
  );
}
```

<a href="./guide/introduction" class="QuickStartButton">
  Read the Documentation →
</a>

### Examples

Check out our examples to get started quickly.

<div class="ExampleGuideCard">
  <h3>Next.js (App Router)</h3>
  <p>Example using Next.js App Router with Mocking GUI.</p>
  <a href="https://github.com/kakaoenterprise/mocking-gui/tree/main/examples/next-app-router" target="_blank">View Example →</a>
</div>

<div class="ExampleGuideCard">
  <h3>React (Vite)</h3>
  <p>Simple React SPA example built with Vite.</p>
  <a href="https://github.com/kakaoenterprise/mocking-gui/tree/main/examples/react-csr" target="_blank">View Example →</a>
</div>
