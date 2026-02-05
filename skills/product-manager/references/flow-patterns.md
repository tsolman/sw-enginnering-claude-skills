# User Flow Patterns

Common flow patterns for product documentation using Mermaid diagrams.

## Core Principles

1. **One flow per user goal** — Don't cram everything into one diagram
2. **Show decision points** — Where does the user make choices?
3. **Include error paths** — What happens when things go wrong?
4. **Label with user intent** — Use action verbs from the user's perspective

---

## Pattern 1: Authentication Flow

```mermaid
flowchart TD
    A[User arrives] --> B{Has account?}
    B -->|Yes| C[Show login]
    B -->|No| D[Show signup]

    C --> E{Valid credentials?}
    E -->|Yes| F[Redirect to dashboard]
    E -->|No| G[Show error]
    G --> C

    D --> H[Collect info]
    H --> I{Valid data?}
    I -->|Yes| J[Create account]
    I -->|No| K[Show validation errors]
    K --> H
    J --> F
```

## Pattern 2: Onboarding Flow

```mermaid
flowchart TD
    A[New user signup] --> B[Welcome screen]
    B --> C[Step 1: Profile setup]
    C --> D{Complete?}
    D -->|Skip| E[Step 2: Preferences]
    D -->|Done| E
    E --> F[Step 3: First action]
    F --> G{Success?}
    G -->|Yes| H[Show success + dashboard]
    G -->|No| I[Offer help]
    I --> F
```

## Pattern 3: CRUD Operations

```mermaid
flowchart TD
    A[List view] --> B{User action}
    B -->|Create| C[New item form]
    B -->|Read| D[Item detail view]
    B -->|Update| E[Edit form]
    B -->|Delete| F[Confirm dialog]

    C --> G{Valid?}
    G -->|Yes| H[Save & return to list]
    G -->|No| I[Show errors]
    I --> C

    E --> J{Valid?}
    J -->|Yes| H
    J -->|No| K[Show errors]
    K --> E

    F --> L{Confirmed?}
    L -->|Yes| M[Delete & return to list]
    L -->|No| A

    H --> A
    M --> A
```

## Pattern 4: Search & Filter

```mermaid
flowchart TD
    A[Results page] --> B{User action}
    B -->|Search| C[Enter query]
    B -->|Filter| D[Select filters]
    B -->|Sort| E[Choose sort order]

    C --> F[Execute search]
    D --> F
    E --> F

    F --> G{Results found?}
    G -->|Yes| H[Display results]
    G -->|No| I[Show empty state]

    H --> B
    I --> J[Suggest alternatives]
    J --> B
```

## Pattern 5: Multi-step Form (Wizard)

```mermaid
flowchart TD
    A[Start wizard] --> B[Step 1]
    B --> C{Valid?}
    C -->|No| D[Show errors]
    D --> B
    C -->|Yes| E[Step 2]

    E --> F{Valid?}
    F -->|No| G[Show errors]
    G --> E
    F -->|Yes| H[Step 3 - Review]

    H --> I{Confirm?}
    I -->|Edit| J{Which step?}
    J -->|Step 1| B
    J -->|Step 2| E
    I -->|Submit| K[Process submission]

    K --> L{Success?}
    L -->|Yes| M[Show confirmation]
    L -->|No| N[Show error + retry]
    N --> H
```

## Pattern 6: Payment Flow

```mermaid
flowchart TD
    A[Cart/Checkout] --> B[Enter payment info]
    B --> C{Payment method}
    C -->|Card| D[Card form]
    C -->|PayPal| E[Redirect to PayPal]
    C -->|Other| F[Alternative method]

    D --> G[Validate card]
    E --> H[PayPal auth]
    F --> I[Process alternative]

    G --> J{Valid?}
    H --> J
    I --> J

    J -->|Yes| K[Process payment]
    J -->|No| L[Show error]
    L --> B

    K --> M{Success?}
    M -->|Yes| N[Order confirmation]
    M -->|No| O[Payment failed]
    O --> P{Retry?}
    P -->|Yes| B
    P -->|No| Q[Save cart for later]
```

## Pattern 7: Feature Discovery (Inspired)

Use this pattern to map the discovery process itself:

```mermaid
flowchart TD
    A[Problem identified] --> B[Framing]
    B --> C{Clear problem?}
    C -->|No| D[More customer research]
    D --> B
    C -->|Yes| E[Ideation]

    E --> F[Generate solutions]
    F --> G[Select top 2-3]
    G --> H[Build prototypes]

    H --> I[Test: Value]
    I --> J{Validated?}
    J -->|No| K{Pivot or iterate?}
    K -->|Pivot| E
    K -->|Iterate| H

    J -->|Yes| L[Test: Usability]
    L --> M{Validated?}
    M -->|No| H
    M -->|Yes| N[Test: Feasibility]

    N --> O{Validated?}
    O -->|No| P[Technical alternatives]
    P --> H
    O -->|Yes| Q[Test: Viability]

    Q --> R{Validated?}
    R -->|No| S[Stakeholder alignment]
    S --> E
    R -->|Yes| T[Add to validated backlog]
```

## Pattern 8: Error Recovery

```mermaid
flowchart TD
    A[User action] --> B{Success?}
    B -->|Yes| C[Continue flow]
    B -->|No| D{Error type}

    D -->|User error| E[Show inline validation]
    D -->|System error| F[Show error message]
    D -->|Network error| G[Show retry option]

    E --> H[User corrects]
    H --> A

    F --> I{Recoverable?}
    I -->|Yes| J[Show recovery steps]
    I -->|No| K[Show support contact]
    J --> A

    G --> L{Retry?}
    L -->|Yes| A
    L -->|No| M[Save progress offline]
```

---

## Diagram Tips

### Do
- Start with the user's goal at the top
- Use clear, action-oriented labels
- Show what happens on failure
- Keep it to one page when possible
- Use consistent shapes (rectangles for actions, diamonds for decisions)

### Don't
- Mix multiple user journeys in one diagram
- Include implementation details
- Forget error states
- Make it so complex it needs a legend

### Mermaid Syntax Quick Reference

```
flowchart TD          # Top-down direction (or LR for left-right)
A[Rectangle]          # Standard node
B{Diamond}            # Decision point
C([Stadium])          # Start/end state
D[(Database)]         # Data store
A --> B               # Arrow
A -->|Label| B        # Arrow with label
A -.-> B              # Dotted arrow
A ==> B               # Thick arrow
```

---

*Use these patterns as starting points. Adapt them to your specific user journey.*
