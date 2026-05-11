# Mocking GUI Scenario Schema: State Atomicity Standard

The data schema standard used by Mocking GUI scenarios in local storage and during transmission.

---

## 1. Scenario Interface

```typescript
export type Scenario = {
  id: string; // Unique ID (crypto.randomUUID())
  name: string; // Scenario name (must be unique)
  description?: string; // Detailed description
  configs: Record<string, StoredHandlerVariants>; // Active state and variant info per handler key
  createdAt: string; // ISO Date string
};

// Handler key: `${method}.${url}` (based on getHandlerKey function)
export type StoredHandlerVariants = {
  active: boolean;
  type: HandlerType | null; // MANUAL | AUTO | SWAGGER
  variant?: string; // Selected variant name (MANUAL/SWAGGER mode)
  delay?: number | DelayMode; // Delay time (ms)
};
```

---

## 2. ScenarioMatchStatus (Based on Actual Implementation)

```typescript
export enum ScenarioMatchStatus {
  ACTIVE = 'Active', // All scenario.configs entries exactly match current handlerConfigs
  INACTIVE = 'Inactive', // Does not match or is in an inactive state
}
```

> **Note**: MODIFIED and PARTIAL states do not exist in the current implementation. Status is a binary determination of ACTIVE or INACTIVE.

---

## 3. Draft → Save Workflow

```
1. Click handler ⊕ in the API tab
   → addToDraft(handlerKey)  : Copy current handlerConfigs[key] to draftScenario (force active: true)

2. Repeat add/remove
   → removeFromDraft(handlerKey) : Remove individual item
   → clearDraft()               : Reset all

3. Enter a name in the Scenario tab and save
   → addScenario(name, desc) : Convert draftScenario to Scenario object and save to scenarios[]
   → Returns false on duplicate name (duplicate check required)
   → draftScenario automatically reset

4. Apply saved scenario
   → activateScenario(id) : Update handlerConfigs based on scenario.configs
   → deactivateScenario() : Reset all handlers to initialStoredHandlerVariants default values
```

---

## 4. Scenario Sharing (Base64 Encoding)

```typescript
// Encoding for sharing (UTF-8 → Base64)
encodeScenario(scenario: Scenario): string
// Base64 → Scenario restoration (synchronous)
decodeScenario(input: string): Scenario | null
// Base64 → Scenario restoration (asynchronous, fetch Data URL method)
decodeScenarioAsync(input: string): Promise<Scenario | null>
```

**Sharing flow:**

1. Share: Share button → `encodeScenario()` → Copy Base64 string to clipboard
2. Receive: Import button → Paste Base64 → `decodeScenario()` + `isValidScenario()` validation → `importScenario(scenario)` save
   - `importScenario`: Returns false on id/name duplicate

---

## 5. Integrity Rules

- When applying a scenario, handlers not in scenario.configs are not touched.
- `activateScenario()` applies only the valid configs based on the current handler list (`buildAppliedConfigs`).
- If a handler no longer exists, that config entry is ignored.
- Scenario names are checked for duplicates after trimming (`scenarios.some(s => s.name.trim() === name.trim())`).
