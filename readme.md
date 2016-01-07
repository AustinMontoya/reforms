Lessons learned from previous forms attempts:

- Declarative approach (schemas, embedded validation rules, etc.) does not work
  - Simple DSLs / bindings break down in complex scenarios
  - The more flexible a DSL is, the more you end up re-implementing procedural features declaratively
  - Super-flexible DSLs are just as hard / harder to understand as procedural view-specific code
    - Think grunt vs. gulp

- Components aren't really isolated
  - For example, closed date must come after due date

- "Dirtiness" is component- (and UX-) dependent
- Synchronizing the state across a complex form is hard with stateful components
  - One component might become invalid, but cause another component to become valid
  - Stateful components require a lot of re-renders, even when nothing happened, because the validation rules are tightly coupled to the components and need to be re-run

- Reusable forms code often encroaches on business logic
- Nested controls (and forms) are hard
- Isolated components do not play nicely with asynchronous validation

What this is leading towards:

- Stateless (or "controlled") form components increase flexibility by making fewer assumptions
  - They are also easier to understand and implement
  - Things like datepicker might be an exception (would you want to push managing picker visibility out of the component itself??)
- Validation should happen at the form level in a single function, ideally not tied to any component directly
- Reusability in validation rules should come from pure, composable functions, not configurable / extensible objects

Things to figure out:

- Nested groups
- Multiple groups
- `actions --> group <-- reducers` is a weird relationship (but just another level of indirection)
- how does group integrate with store (does it need to)?
- reselect integration
- react-redux integration
- Form reset
- Not using a string for tying a reducer / component to a group
- Is `validating` "standard"?
- Is `submitting` "standard"?


Things that might be nice:

- Remove dependency on immutable js
- pre-built higher order components?
- Store state on react component (or anything??)
- Undo / Redo
- Snapshotting
