# Mocking GUI & Component Implementation Standard

All UI development in the Mocking GUI project must adhere to the following semantic structure and design consistency standards.

## 1. UI Primitive Usage (Atomic First)

- **Standard Components**: When implementing new UI, always use atomic components (`Button`, `Input`, `Badge`, `Card`, etc.) under `@components/ui` first.
- **Custom Styling Avoidance**: Prioritize the `variant` and `size` properties within atomic components, and use theme-token-based `Tailwind CSS` classes instead of arbitrary hard-coded styles (e.g., `bg-blue-600`).
- **Icon Consistency**: Use icons from the `lucide-react` library consistently.

## 2. Design Language & Tokens

- **Color System**: Strictly follow theme colors such as `primary`, `foreground`, `muted`, and `border` to maintain the Mocking GUI Panel's brand identity.
- **Visual Hierarchy**: Clearly differentiate text size (`text-[10px]`, `text-xs`, etc.) and color contrast according to the importance of information.
- **Consistency**: All sections inside the panel must have consistent padding (`p-4`, `p-6`, etc.) and rounding (`rounded-md`, `rounded-xl`) values.

## 3. Semantic Layout & Positioning

- **Layered Structure**: Global notifications or action bars should be positioned appropriately (e.g., fixed at the bottom) with shadow effects (`shadow-lg`) to establish layer hierarchy without disrupting the information flow.
- **Action Verbs**: Phrases that prompt user actions must use clear and intuitive verbs. (e.g., "Recording" → "Scenario Draft")

## 4. Technical Constraints

- All components must exclude `any` types and define Props types through interfaces.
- Complex logic must be separated into utilities or custom hooks outside the component to maintain readability.
