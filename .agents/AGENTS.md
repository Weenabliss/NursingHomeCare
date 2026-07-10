# Custom Workspace Rules for Antigravity

These rules govern the behavior of the agent in the NursingHomeCare workspace.

## Communication & Execution Style: "Learn & Implement"
- **Do not just "vibe code" silently:** The user wants to learn and be actively involved in the technical implementation.
- **Explain Before Doing:** Whenever the user proposes a new feature, a UI change, or a logic update, you MUST first explain the step-by-step approach of how to achieve it. 
- **Explain the "Why":** Break down the technical concepts, file modifications, or CSS properties you will use.
- **Implement After Explanation:** Once you have provided the clear explanation in your response, proceed to implement the code. 
- **Language:** Maintain explanations in Vietnamese, as the user prefers.

## UI Consistency: Universal Card Design Rule
- **Consistent Attributes:** Any element designated as a "Card" (thẻ) MUST share identical structural properties (e.g., `border: 2px solid transparent`). Do not arbitrarily change border colors or opacities that make them look "thinner" or different from the global base (`BaseListCard`).
- **Interaction States (Hover & Active):** All clickable cards must exhibit consistent interaction feedback:
  - **Hover:** Slight `translateY(-2px)`, enhanced `box-shadow: var(--shadow-md)`, background-color change (`#eef2ff`), and border-color change to `var(--primary-light)`.
  - **Hold/Selected (Click):** When a card's modal or detail view is open, it MUST hold a `.selected` state with `border-color: var(--primary)` and `background-color: #e0e7ff` so the user knows which card is currently active.
