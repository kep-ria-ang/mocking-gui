# Mocking GUI Library Internal Architecture Reference

Internal structure and technical design standards of the Mocking GUI library, derived from analysis of `packages/mocking-gui` and `docs`.

---

## 1. Directory Structure & Layering (packages/mocking-gui)

### 1.1. Entry Points

- **`browser.ts`**: Browser-only entry point. Exports `MockingGUIBoundary`.
- **`server.ts`**: Node.js/SSR-only entry point. Exports `setupMockingServer`.
- **`index.ts`**: Common type exports (`HandlerConfigOption`, `MockingConfig`, `SwaggerSourceConfigOption`).

### 1.2. Internal Modules (`src/`)

```
src/
├── components/
│   ├── MockingGUIBoundary.tsx     # Top-level entry component (Shadow DOM orchestration)
│   ├── MockingGUIPanel.tsx        # Tab-based GUI panel body
│   ├── MockingGUIToggle.tsx       # Panel toggle button
│   ├── LoadingPage.tsx            # Worker initialization waiting screen
│   ├── common/ShadowRootPortal.tsx  # Shadow DOM isolation layer
│   └── features/
│       ├── api-section/           # API tab: handler list/search/filter/control
│       ├── scenario-section/      # Scenario tab: save/apply/share
│       ├── swagger-section/       # Swagger tab: URL input/JSON import
│       └── setting-section/       # Settings tab: panel position/size
├── store/
│   ├── useHandlerStore.ts         # Handler + scenario + Swagger state (Zustand + persist)
│   ├── usePanelStore.ts           # Panel UI state (position, size, search filter)
│   └── types.ts                   # Store type definitions
├── hooks/
│   ├── useSetupMockingGUIWorker.ts   # 3-phase Worker initialization orchestrator
│   ├── useSwaggerHandlerSetup.ts  # Parallel Swagger source loading
│   └── useMockingGUIStyles.ts     # Shadow DOM style injection
├── utils/
│   ├── handler/
│   │   ├── convertToMsw.ts        # HandlerState → MSW HttpHandler conversion
│   │   ├── core.ts                # Handler type determination + initial state generation
│   │   └── pathParams.ts          # Swagger {param} → MSW :param + URL normalization
│   ├── swagger/
│   │   ├── load.ts                # Swagger JSON fetch → HandlerState[] conversion
│   │   ├── merge.ts               # Merge manual handlers + Swagger handlers
│   │   ├── convert.ts             # OpenAPI spec → HandlerState[]
│   │   └── export.ts              # Swagger handlers → manual HandlerState (for JSON export)
│   ├── browser/
│   │   ├── workerManager.ts       # MSW Worker module singleton
│   │   └── cookie.ts              # mocking_gui_sync cookie synchronization
│   ├── server/
│   │   ├── setup.ts               # SSR server creation (createMockingGUIServer, setupMockingServer)
│   │   └── state.ts               # Cookie → handlerConfigs restoration
│   ├── common/
│   │   ├── keys.ts                # Handler key generation utility
│   │   └── url.ts                 # URL parsing utility
│   └── scenario.ts                # Scenario computation + Base64 encoding/decoding
├── constants/key.ts               # LocalStorage key constants
└── types/
    ├── config.ts                  # MockingConfig, MockingServerConfig, HandlerConfigOption
    ├── handler.ts                 # HandlerType, StoredHandlerVariants, Scenario, RawBody
    ├── panel.ts                   # PanelPosition, PanelSize
    └── index.ts                   # Public type re-export
```

---

## 2. Key Architectural Patterns

### 2.1. UI Isolation (Shadow DOM)

- `ShadowRootPortal` creates a Shadow DOM container to render the GUI panel in isolation.
- The `useMockingGUIStyles` hook injects Tailwind CSS inside the Shadow DOM.

### 2.2. 3-Phase Worker Initialization (`useSetupMockingGUIWorker`)

```
1. Worker start (isWorkerReady)
   → MockingGUIWorkerManager.start() → MSW setupWorker singleton initialization

2. Handler ready (isHandlersReady)
   → Swagger source loading complete → merge manual + Swagger handlers → setupInitialState()

3. Mocking active (isMockingReady = isReady)
   → convertToMswHandler() based on handlerConfigs → worker.resetHandlers()
```

`MockingGUIBoundary` renders `LoadingPage` while `isReady = false`.

### 2.3. SSR/RSC State Synchronization (Cookie Bridge)

- **Cookie Key**: `mocking_gui_sync`
- **Format**: `encodeURIComponent(JSON.stringify([["handlerKey", "M|A|S", "variantName"], ...]))`
- **Write**: `syncStateToCookie()` — updates cookie with 300ms debounce on state change
- **Note**: 4KB cookie limit (~3800 chars → warning, no truncation)
- **Read**: `reconstructHandlerConfigsFromCookie()` — parses cookie in SSR → restores `StoredHandlerVariants`
- When `setupMockingServer({ cookie })` is called, the cookie state is applied to SSR as-is.

### 2.4. MockingGUIWorkerManager (Module Singleton)

```typescript
// Singleton implemented as module-level variable, not a class instance
// Prevents duplicate start: returns existing Promise if startPromise exists
const MockingGUIWorkerManager = { getWorker, start, stop, isStarted };
```

### 2.5. SSR Server Singleton (`__MOGU_SSR_SERVER__`)

```typescript
// Caches SetupServer instance in globalThis.__MOGU_SSR_SERVER__
// On re-call, updates only handlers via resetHandlers() (no server re-creation)
```

### 2.6. MSW 2.x Proxy Layer

- `convertToMswHandler(handlers, handlerConfigs)` → Store state → MSW `HttpHandler[]` conversion.
- `active: false` → `passthrough()` (forwarded to the real server).
- `rawBody` takes priority over JSON body when present.

---

## 3. State Persistence

### LocalStorage (Browser)

- **`MOGU_HANDLERS`**: `handlerConfigs`, `scenarios`, `activeScenarioId`
- **`MOGU_PANEL`**: `panelPosition`, `panelSize`, search filter

### Handler Key Format

```typescript
getHandlerKey(handler) = `${method}.${url}`; // For storage (exact URL)
getHandlerUniqueKey(handler) = `${method}.${normalizedUrl}`; // For merging (path parameter masking)
```

---

## 4. Draft Scenario Workflow

```
Click handler ⊕ in API tab → addToDraft(handlerKey)  → Copy current handlerConfigs[key] to draftScenario (force active: true)
                              removeFromDraft(handlerKey) → Remove individual item
                              clearDraft()                → Reset all
Enter name in Scenario tab → addScenario(name, desc)   → Convert draftScenario to Scenario object and save to scenarios[]
```

---

## 5. Documentation System (`docs/`)

- **VitePress-based**: Static site generation.
- `guide/introduction.md`: Library overview.
- `guide/quick-start.md`: Installation + framework integration (React Vite, Next.js App Router).
- `guide/usage/`: handler-guide, scenario-guide, swagger-guide, gui-guide, api-guide.
- `guide/troubleshooting.md`: Common problem resolution.
