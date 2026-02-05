# Risk Assessment Framework

Based on Marty Cagan's "Inspired" — the four critical risks that kill products.

## The Four Risks

Every product idea fails for one of these reasons:

| Risk | The Question | What Kills You |
|------|-------------|----------------|
| **Value** | Will customers want this? | Building something nobody needs |
| **Usability** | Can users figure it out? | Customers can't use what you built |
| **Feasibility** | Can we build it? | Technical impossibility or unacceptable cost |
| **Viability** | Does it work for the business? | Legal, financial, or strategic blockers |

---

## Value Risk

### Signs of High Value Risk
- No direct customer evidence of the problem
- Solution came from a stakeholder, not customer discovery
- "If we build it, they will come" thinking
- Competitive feature parity as the primary driver

### Validation Techniques

| Technique | When to Use | Evidence Quality |
|-----------|-------------|------------------|
| Customer interviews | Early exploration | Qualitative - understand pain |
| Fake door test | Before building | Quantitative - measure intent |
| Concierge MVP | Complex workflows | Qualitative - observe behavior |
| Wizard of Oz | Need to test experience | Qualitative - real interactions |
| Landing page test | New product/feature | Quantitative - conversion |
| A/B test | Existing product | Quantitative - behavior change |

### Value Risk Checklist
- [ ] Have we talked to 5+ customers who have this problem?
- [ ] Can customers articulate the problem without prompting?
- [ ] What do customers currently do to solve this? (workaround)
- [ ] Would they pay for a solution? How much?
- [ ] Have we tested demand before committing to build?

---

## Usability Risk

### Signs of High Usability Risk
- Novel interaction patterns
- Complex multi-step workflows
- Users unfamiliar with technology
- No existing mental model to leverage
- Accessibility requirements

### Validation Techniques

| Technique | Fidelity | When to Use |
|-----------|----------|-------------|
| Paper prototype | Low | Early concept testing |
| Wireframe walkthrough | Low | Information architecture |
| Clickable prototype | Medium | Interaction testing |
| High-fidelity prototype | High | Visual + interaction |
| Usability study | Any | 5-8 users watching them try |

### Usability Test Protocol
1. Define tasks user should complete
2. Recruit 5-8 representative users
3. Watch them attempt tasks (don't guide!)
4. Note where they struggle, express confusion
5. Ask them to think aloud
6. Debrief: what surprised them? What was hard?

### Usability Risk Checklist
- [ ] Have we tested the prototype with real users?
- [ ] Can users complete key tasks without help?
- [ ] Where do users get stuck or confused?
- [ ] Is the mental model clear?
- [ ] Have we tested with diverse users (accessibility)?

---

## Feasibility Risk

### Signs of High Feasibility Risk
- New technology stack or infrastructure
- Performance requirements near limits
- Third-party dependencies
- Data/algorithm challenges
- Scale requirements
- Integration complexity

### Validation Techniques

| Technique | What It Validates |
|-----------|-------------------|
| Technical spike | Can we build the core mechanism? |
| Proof of concept | Does the approach work at all? |
| Architecture review | Will it scale? Integrate? |
| Performance prototype | Can we meet speed/load requirements? |
| Vendor evaluation | Does the third-party actually work? |

### Engineer Involvement
> "Often the key to innovation is the engineers on the team, but this means including them from the very beginning, not just at the end." — Marty Cagan

**Engineers must be in discovery because:**
- They see technical possibilities others miss
- They catch infeasibility early
- They can suggest simpler alternatives
- They're more invested in solutions they helped shape

### Feasibility Risk Checklist
- [ ] Has engineering assessed the technical approach?
- [ ] Have we built a spike for high-risk components?
- [ ] Do we understand third-party dependencies?
- [ ] Are there performance concerns? Tested?
- [ ] What's the realistic effort estimate?

---

## Viability Risk

### Signs of High Viability Risk
- Regulatory/compliance implications
- Significant revenue impact (positive or negative)
- Changes to business model
- New market or customer segment
- Partnership dependencies
- Brand/reputation concerns

### Stakeholders to Consult

| Stakeholder | Their Concern |
|-------------|---------------|
| Legal | Compliance, liability, terms of service |
| Finance | Revenue impact, cost, pricing |
| Security | Data protection, vulnerabilities |
| Marketing | Brand alignment, positioning, launch |
| Sales | Customer impact, competitive position |
| Support | Serviceability, documentation |
| Leadership | Strategic alignment, priorities |

### Viability Assessment Questions
- Does this align with company strategy?
- Can we sell/market this effectively?
- Are there legal/compliance blockers?
- Does the unit economics work?
- Do we have the operational capacity?
- Does this cannibalize existing revenue?

### Viability Risk Checklist
- [ ] Have we consulted relevant stakeholders?
- [ ] Are there regulatory/compliance issues?
- [ ] Does the financial model work?
- [ ] Does this align with company strategy?
- [ ] Do we have go-to-market capability?

---

## Risk Assessment Matrix

Use this to quickly assess any product idea:

```
                    LOW CONFIDENCE          HIGH CONFIDENCE
                    (needs validation)      (evidence exists)
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
V   │   Value:       [  ] Low    [  ] Med    [  ] High       │
A   │                                                         │
L   │   Usability:   [  ] Low    [  ] Med    [  ] High       │
I   │                                                         │
D   │   Feasibility: [  ] Low    [  ] Med    [  ] High       │
A   │                                                         │
T   │   Viability:   [  ] Low    [  ] Med    [  ] High       │
E   │                                                         │
D   └─────────────────────────────────────────────────────────┘
```

**Reading the matrix:**
- All High confidence → Ready for delivery
- Any Medium → Targeted discovery needed
- Any Low → Must validate before proceeding

---

## Risk-First Discovery

### Prioritize by Risk Level

Don't validate everything at once. Focus discovery on the highest risks first.

**Typical priority:**
1. **Value** — If nobody wants it, nothing else matters
2. **Feasibility** — If we can't build it, don't waste design effort
3. **Usability** — Iterate until users can succeed
4. **Viability** — Ensure stakeholder alignment before launch

### When to Stop Discovery

Discovery is complete when:
- All four risks are rated "High confidence"
- Evidence exists for each (not just opinions)
- Stakeholders have signed off on viability
- Team believes the solution will work

---

## Anti-Patterns

### Value Risk Anti-Patterns
- "The VP wants this feature"
- "Competitors have it"
- "It's obvious users need this"
- "We'll learn after launch"

### Usability Risk Anti-Patterns
- "It's intuitive"
- "Users will figure it out"
- "We'll add help text"
- Testing only with internal users

### Feasibility Risk Anti-Patterns
- "Engineering can figure it out"
- "We've done similar things"
- Excluding engineers until specs are done
- Underestimating integration complexity

### Viability Risk Anti-Patterns
- "Legal will approve it"
- "Finance will find budget"
- Surprising stakeholders at launch
- Assuming strategic alignment

---

*Reference: Cagan, M. (2017). Inspired: How to Create Tech Products Customers Love (2nd ed.). Wiley.*
