# Implement Solo Command

You are tasked with executing approved implementation plans with test-first development, phase-by-phase verification, and comprehensive progress tracking.

## Initial Response

When this command is invoked:

1. **Verify RPI workflow progression**:
   - Check `.claude/data/solo_rpi_state.json`
   - Note: State is now "implement" phase
   - Confirm plan phase was completed
   - Verify plan file exists and is valid

2. **Read the ENTIRE plan first**:
   - **CRITICAL**: Read the ENTIRE plan document first
   - **IMPORTANT**: Check for any existing checkmarks (- [x]) to avoid redoing work
   - Verify plan structure and success criteria

2. **If plan document missing**:
```
Cannot implement without an approved plan.

Please either:
1. Provide a plan document: `/implement_solo @thoughts/shared/plans/[file].md`
2. Create a plan first: `/plan_solo @thoughts/shared/research/[research].md`
```

3. **If resuming work**, check for progress:
```
I see Phase [N] is partially complete with [X] of [Y] tasks done.
Resuming from: [specific task]

Previous work verified:
- [Completed item with checkmark]
- [Another completed item]

Continuing implementation...
```

## Auto-Context Loading

Before implementation, automatically verify:

1. **Load implementation plan**:
```bash
# Ensure plan file exists and is readable
test -f [plan_file] || echo "Error: Plan file not found"
```

2. **Check phase dependencies**:
```bash
python3 .claude/scripts/state_reader.py --json | python3 -c "
import sys, json
data = json.load(sys.stdin)
phase = data['rpi']['phase']
if phase != 'implement':
    print(f'Error: Cannot implement in {phase} phase. Run /plan_solo first.')
    sys.exit(1)
"
```

3. **Verify testing commands**:
```bash
# Check for test configuration
test -f Makefile && grep -q "^test:" Makefile && echo "Test command: make test"
test -f package.json && grep -q '"test"' package.json && echo "Test command: npm test"
test -f pytest.ini && echo "Test command: python3 -m pytest"
```

4. **Load recent implementation progress**:
```bash
python3 .claude/scripts/state_reader.py --recent 2
```

## Process Steps

### Step 1: Plan Analysis & Setup

1. **Read plan completely**:
   - Understand all phases and dependencies
   - Note success criteria for each phase
   - Identify required tools and commands

2. **Read original research if referenced**:
   - Understand the context behind the plan
   - Verify technical constraints
   - Review discovered patterns

3. **Create implementation todo list**:
   - Break down phases into specific tasks
   - Track completion status
   - Monitor test results

### Step 2: Test-First Development

For each phase in the plan:

1. **Write failing tests first**:
   - Unit tests for new functionality
   - Integration tests for workflows
   - **IMPORTANT**: Tests must fail initially

2. **Run tests to confirm failure**:
```bash
# Example test execution
npm test
# or
make test
```

3. **Implement the solution**:
   - Follow plan specifications exactly
   - Use identified patterns from research
   - Maintain code style consistency

4. **Run tests to verify success**:
   - All new tests must pass
   - No regression in existing tests
   - **CRITICAL**: Don't proceed if tests fail

### Step 3: Phase Implementation

**For each phase:**

1. **Update plan with progress**:
   - Check off completed items: `- [x]`
   - Note any deviations or issues
   - Document decisions made

2. **Execute changes systematically**:
   - Read files before modifying
   - Apply changes as specified
   - Verify each change works

3. **Run success criteria checks**:
   - Automated verification commands
   - File existence checks
   - Pattern verification

4. **Document any deviations**:
```
Deviation in Phase [N]:
Expected: [what plan said]
Actual: [what was found]
Resolution: [how you adapted]
Rationale: [why this approach]
```

### Step 4: Progress Documentation

After each phase or stopping point:

1. **Update progress file**:
   - Write to `thoughts/shared/progress/YYYY-MM-DD_HHMM_<topic>.md`
   - Document completed work
   - List next steps
   - Note any blockers

2. **Update RPI state**:
   - Set state to "implement" when active
   - Include current phase information
   - Track completion percentage

## Error Handling

### Common Failure Scenarios

1. **Test failures**:
   - Analyze failure output carefully
   - Fix implementation, not tests
   - Re-run full test suite
   - Document persistent issues

2. **Plan mismatches**:
   - File doesn't exist where expected
   - Code structure differs from plan
   - Dependencies not available
   - **Recovery**: Document and adapt

3. **Breaking changes**:
   - Existing functionality broken
   - Tests failing in unrelated areas
   - Performance degradation
   - **Recovery**: Rollback and reassess

4. **Incomplete specifications**:
   - Plan lacks critical details
   - Ambiguous instructions
   - Missing success criteria
   - **Recovery**: Request clarification

### Recovery Strategies

**For implement_solo:**
- Always verify changes are non-breaking
- Keep changes atomic and reversible
- Document all deviations in progress file
- Stop and request help if blocked
- Never skip test-first approach

## What NOT to Do

### For implement_solo:
- Don't implement without reading the full plan
- Don't skip writing tests first
- Don't ignore failing tests
- Don't proceed to next phase with failures
- Don't make changes outside plan scope
- Don't modify plan requirements during implementation
- Don't guess when specifications are unclear
- Don't commit code without passing tests

## Verification Requirements

1. **Before starting each phase**:
   - Previous phase fully complete
   - All dependencies available
   - Test environment ready
   - Plan requirements clear

2. **During implementation**:
   - Tests written before code
   - Each change verified
   - No regressions introduced
   - Code follows conventions

3. **After each phase**:
   - All success criteria met
   - Tests passing completely
   - Plan updated with progress
   - Progress documented

## Test-First Development Process

### Writing Tests

**Unit Test Structure:**
```python
def test_new_feature():
    # Arrange
    [setup test data]

    # Act
    result = function_under_test(data)

    # Assert
    assert result == expected_value
```

**Integration Test Structure:**
```python
def test_workflow():
    # Setup
    [prepare environment]

    # Execute workflow
    [perform operations]

    # Verify end state
    [check results]
```

### Running Tests

**Test Execution Pattern:**
```bash
# 1. Run tests to see failure
npm test  # Should fail

# 2. Implement feature
[make code changes]

# 3. Run tests to verify
npm test  # Should pass

# 4. Run full suite
npm test  # No regressions
```

### Test Coverage Requirements

- New code must have tests
- Edge cases explicitly tested
- Error conditions handled
- Integration points verified

## Progress Tracking

### Progress File Template

Write to: `thoughts/shared/progress/YYYY-MM-DD_HHMM_<topic>.md`

```markdown
# Implementation Progress: [Topic]

**Date**: YYYY-MM-DD HH:MM
**Plan**: `thoughts/shared/plans/[plan-file].md`
**Phase**: [Current phase name]
**Status**: [In Progress | Blocked | Complete]

## Completed Work

### Phase 1: [Name] ✅
- [x] Test written for [feature] (file.test.js:12-34)
- [x] Implementation of [component] (file.js:45-89)
- [x] Integration verified (test output clean)

### Phase 2: [Name] 🚧
- [x] Initial setup complete
- [ ] Core functionality - IN PROGRESS
- [ ] Error handling

## Next Steps
1. Complete [specific task]
2. Run [verification command]
3. Begin [next phase]

## Known Issues
- [Issue description] - [proposed solution]

## Deviations from Plan
- Changed [X] because [reason]
- Skipped [Y] due to [blocker]

## Key Decisions
- Used [approach] for [problem] because [rationale]
- Chose [option A] over [option B] due to [reason]

## Test Results
```
npm test
[test output summary]
All tests passing: YES/NO
```

## Commands to Resume
```bash
# To continue where left off:
cd [working directory]
[specific command to run next]
```
```

### State Management

Update `.claude/data/rpi_state.json`:
```json
{
  "current_phase": "implement",
  "phase_details": {
    "plan": "thoughts/shared/plans/[file].md",
    "current_phase": "Phase 2",
    "completion": "40%",
    "last_task": "Implementing core logic"
  },
  "timestamp": "YYYY-MM-DDTHH:MM:SS"
}
```

## Examples

### Example 1: Starting Fresh Implementation

**User**: `/implement_solo @thoughts/shared/plans/2025-09-13-jwt-authentication.md`

**Response**:
```
Reading implementation plan for JWT authentication...

Plan contains 3 phases:
- Phase 1: Core JWT Implementation
- Phase 2: Session Management
- Phase 3: OAuth2 Integration

No previous progress detected. Starting Phase 1.

Creating implementation todo list:
1. Write JWT generation tests
2. Write JWT validation tests
3. Implement token generation
4. Implement token validation
5. Verify all tests pass

Writing failing test for JWT generation...

[Shows test code]

Running test to confirm failure...
✗ JWT generation test failed (expected)

Now implementing JWT generation...

[Shows implementation]

Running tests again...
✓ JWT generation test passed

Continuing with validation tests...
```

### Example 2: Resuming Implementation

**User**: `/implement_solo @thoughts/shared/plans/2025-09-13-api-optimization.md`

**Response**:
```
Reading implementation plan for API optimization...

I see Phase 1 is complete with all 5 tasks done ✅
Phase 2 is partially complete with 2 of 4 tasks done.

Previous work verified:
- [x] Response caching middleware implemented
- [x] Cache tests passing

Resuming from: Database query optimization

Running existing tests to verify state...
✓ All Phase 1 tests passing
✓ Cache middleware tests passing

Continuing with query optimization...

Writing test for optimized query...
[test code]

Test failing as expected. Implementing optimization...
```

### Example 3: Handling Test Failure

**User**: [During implementation, a test fails unexpectedly]

**Response**:
```
Test failure detected:

✗ Session persistence test failed
Error: Redis connection refused

This is blocking Phase 2 completion.

Analyzing failure:
- Test expects Redis on localhost:6379
- Redis service may not be running

Suggested resolution:
1. Start Redis: `redis-server`
2. Or use mock Redis for testing
3. Or skip to Phase 3 if Redis optional

How would you like to proceed?

Current progress saved to:
`thoughts/shared/progress/2025-09-13_1530_jwt-auth.md`
```

## Advanced Implementation Patterns

### Parallel Implementation

When phases can run in parallel:

```python
# If plan allows parallel work
parallel_tasks = [
    "Frontend components (Phase 2A)",
    "Backend endpoints (Phase 2B)"
]

# Document parallel progress
progress = {
    "Phase 2A": "3 of 5 components complete",
    "Phase 2B": "2 of 4 endpoints complete"
}
```

### Incremental Verification

Run verification after each significant change:

```bash
# After each file modification
npm test [specific-test]  # Quick check

# After each component
npm test  # Full suite

# After each phase
npm run lint && npm test && npm run build  # Complete validation
```

### Rollback Strategy

If implementation causes issues:

```bash
# Save current state
git stash

# Or revert specific changes
git checkout -- [file]

# Document in progress file
"Rolled back [change] due to [issue]"
```

## Quality Checklist

Before marking phase complete:

- [ ] All tests written and passing
- [ ] No regression in existing tests
- [ ] Code follows project style
- [ ] Plan tasks checked off
- [ ] Success criteria verified
- [ ] Progress file updated
- [ ] Any deviations documented
- [ ] Performance acceptable
- [ ] Edge cases handled
- [ ] Error handling complete

## Performance Considerations

- Run minimal test sets during development
- Use watch mode for rapid feedback
- Profile before/after for performance-critical changes
- Document performance impacts in progress file
- Consider incremental compilation/building

## Collaboration Notes

When implementation requires collaboration:

1. **Document stopping points clearly**
2. **List exact commands to resume**
3. **Note any environment setup needed**
4. **Highlight blockers prominently**
5. **Provide context for decisions made**

Remember: Implementation is about executing the plan faithfully while adapting to reality. Document everything, test everything, and never skip verification steps.