# Compact Context Command

You are tasked with creating comprehensive progress documentation that preserves context across development sessions, enabling seamless continuity for future work.

## Initial Response

When this command is invoked:

1. **Assess current work state**:
   - Check active RPI phase
   - Review recent changes
   - Identify stopping point
   - **IMPORTANT**: Capture all relevant context

2. **Standard response**:
```
I'll create a comprehensive progress document to preserve our current context.

Documenting:
- Completed work with file:line references
- Current task status
- Key decisions and rationale
- Known issues and blockers
- Next specific steps

Writing progress file...
```

## Process Steps

### Step 1: Context Analysis

1. **Gather session information**:
   - Current RPI phase (research/plan/implement)
   - Active files and changes
   - Test results if available
   - Unresolved issues

2. **Review conversation history**:
   - Key decisions made
   - Problems encountered
   - Solutions implemented
   - User preferences discovered

3. **Check existing progress files**:
   - Previous session context
   - Ongoing work threads
   - Accumulated knowledge

### Step 2: Progress Documentation

Create/append to: `thoughts/shared/progress/YYYY-MM-DD_HHMM_<topic>.md`

**Document structure:**

```markdown
# Progress: [Topic/Feature Name]

**Date**: YYYY-MM-DD HH:MM:SS
**Session**: [Brief session identifier]
**RPI Phase**: [research | plan | implement]
**Related Files**:
- Research: `thoughts/shared/research/[file].md`
- Plan: `thoughts/shared/plans/[file].md`
- Previous Progress: `thoughts/shared/progress/[file].md`

## Session Summary

[2-3 paragraph overview of what was accomplished in this session]

## Completed Work

### [Category/Phase 1]
- ✅ [Specific task] (`file.ext:123-145`)
  - [Key detail or decision]
  - [Verification method used]

### [Category/Phase 2]
- ✅ [Another task] (`another/file.py:67-89`)
- 🚧 [Partially complete task]
  - Completed: [what's done]
  - Remaining: [what's left]

## Current State

### Active Work
- **Task**: [What was being worked on when stopping]
- **File**: `path/to/current/file.ext:line`
- **Status**: [Specific state]
- **Next Action**: [Exact next step]

### File Modifications
```
modified: path/to/file1.ext
  - Added [feature] at lines 123-145
  - Updated [function] at lines 67-89

created: path/to/newfile.ext
  - [Purpose of new file]

deleted: path/to/oldfile.ext
  - [Reason for deletion]
```

### Test Status
```bash
# Last test run results
npm test
[Summary of results]
Passing: X/Y tests
Failures: [list any failures]
```

## Key Decisions

### Decision 1: [Topic]
**Context**: [Why decision was needed]
**Options Considered**:
1. [Option A] - [pros/cons]
2. [Option B] - [pros/cons]
**Choice**: [What was chosen]
**Rationale**: [Why this was best]

### Decision 2: [Topic]
[Similar structure...]

## Known Issues

### Issue 1: [Description]
- **Symptoms**: [What's happening]
- **Impact**: [What it affects]
- **Proposed Solution**: [How to fix]
- **Priority**: [High/Medium/Low]

### Issue 2: [Description]
[Similar structure...]

## Next Steps

### Immediate (Next Session)
1. [ ] [Specific task with file:line reference]
2. [ ] [Another specific task]
3. [ ] [Verification step]

### Short-term (This Phase)
- [ ] Complete [component/feature]
- [ ] Test [functionality]
- [ ] Document [aspect]

### Long-term (Future Phases)
- [ ] [Broader goal]
- [ ] [Architecture consideration]

## Context for Resuming

### Environment State
```bash
# Working directory
pwd: /path/to/project

# Git status
branch: feature/topic
modified files: 3
staged: 2
```

### Commands to Resume
```bash
# To continue exactly where we left off:
cd /path/to/project

# Run tests to verify state
npm test

# Continue with next task
[specific command]
```

### Mental Model
[Brief explanation of the approach being taken, any complex logic being implemented, or architectural patterns being followed]

## Dependencies & Blockers

### Dependencies
- [External dependency]: [status]
- [Team member input]: [what's needed]

### Blockers
- [Blocker description]: [impact and workaround if any]

## Session Metrics

- **Duration**: [Approximate time worked]
- **Files Modified**: [Count]
- **Tests Added**: [Count]
- **Tests Passing**: [X/Y]
- **Completion**: [Estimated % of overall task]

## Notes for Next Session

[Any specific things to remember, gotchas discovered, or important context that might not be obvious]

---
**Auto-suggestion**: Run `/clear` to reset context, then read this progress file to resume.
```

### Step 3: State Update

Update `.claude/data/rpi_state.json`:

```json
{
  "current_phase": "[phase]",
  "last_progress_file": "thoughts/shared/progress/[file].md",
  "session_end": "YYYY-MM-DDTHH:MM:SS",
  "context_preserved": true
}
```

### Step 4: User Guidance

Provide clear instructions:

```
Progress documented in:
`thoughts/shared/progress/YYYY-MM-DD_HHMM_<topic>.md`

To resume in a new session:
1. Run: /clear
2. Run: /read @thoughts/shared/progress/YYYY-MM-DD_HHMM_<topic>.md
3. Continue from documented next steps

Current context usage: [X]%
Recommendation: [Clear if >70%]
```

## Advanced Context Patterns

### Multi-Session Threading

When work spans multiple sessions:

```markdown
## Session History

### Session 1 (YYYY-MM-DD HH:MM)
- Completed: [Phase 1 tasks]
- Duration: 2 hours
- Key outcome: [Main achievement]

### Session 2 (YYYY-MM-DD HH:MM)
- Completed: [Phase 2 tasks]
- Duration: 1.5 hours
- Key outcome: [Main achievement]

### Current Session (YYYY-MM-DD HH:MM)
- Focus: [Current work]
- Progress: [What's done]
```

### Cross-Reference System

Link related documents:

```markdown
## Related Documents

### Research Chain
1. `research/2025-09-13_1000_initial-investigation.md`
2. `research/2025-09-13_1400_deep-dive.md`
3. `research/2025-09-13_1600_patterns-found.md`

### Plan Evolution
1. `plans/2025-09-13-initial-approach.md`
2. `plans/2025-09-14-revised-strategy.md`

### Progress Timeline
1. `progress/2025-09-13_1700_session1.md`
2. `progress/2025-09-14_0900_session2.md`
3. `progress/2025-09-14_1500_session3.md` (current)
```

### Knowledge Accumulation

Capture learned patterns:

```markdown
## Patterns Discovered

### Pattern 1: [Name]
**Context**: Where this applies
**Implementation**: How to use it
**Example**: `file.ext:123-145`

### Pattern 2: [Name]
[Similar structure...]

## Codebase Insights

### Architecture Notes
- [Discovery about system design]
- [Constraint identified]
- [Opportunity noticed]

### Style Conventions
- [Coding standard observed]
- [Naming pattern used]
- [File organization approach]
```

## Error Handling

### Common Scenarios

1. **No active work to document**:
```
No active development session to compact.

Current RPI phase: [phase]
Last activity: [timestamp]

Would you like to:
1. Review recent progress files
2. Start new research/planning/implementation
3. Check current RPI state
```

2. **Multiple concurrent threads**:
```
Multiple work threads detected:

1. Authentication implementation (Phase 2/3)
2. API optimization research (gathering evidence)
3. Bug fix for issue #123 (testing)

Which thread should I document? Or should I create separate progress files for each?
```

3. **Incomplete critical information**:
```
Warning: Some context may be missing:
- No test results available
- Uncommitted changes detected
- Plan document not referenced

Proceeding with available information...
```

## What NOT to Do

### For compact_context:
- Don't omit file:line references
- Don't use vague descriptions
- Don't forget test status
- Don't skip decision rationale
- Don't lose issue tracking
- Don't create without session work
- Don't overwrite previous progress
- Don't exclude blockers

## Examples

### Example 1: Mid-Implementation Context

**User**: `/compact_context`

**Response**:
```
I'll create a comprehensive progress document to preserve our current context.

Documenting:
- Completed Phase 1 of JWT implementation (3 files modified)
- Current task: Writing session management tests
- Key decision: Using Redis for session storage
- Known issue: Redis connection timeout in tests
- Next step: Mock Redis for unit tests

Writing progress file...

Progress documented in:
`thoughts/shared/progress/2025-09-13_1630_jwt-auth.md`

To resume in a new session:
1. Run: /clear
2. Run: /read @thoughts/shared/progress/2025-09-13_1630_jwt-auth.md
3. Continue from: Writing Redis mock for session tests

Current context usage: 68%
Recommendation: Consider clearing after this task completes
```

### Example 2: Research Session Context

**User**: `/compact_context`

**Response**:
```
I'll create a comprehensive progress document to preserve our current context.

Documenting:
- Completed authentication research with 15 agent tasks
- Analyzed 47 files across auth/, middleware/, and oauth/
- Identified 3 implementation patterns
- Found 2 architectural constraints
- Next: Create implementation plan

Writing progress file...

Progress documented in:
`thoughts/shared/progress/2025-09-13_1445_auth-research.md`

Research findings are in:
`thoughts/shared/research/2025-09-13_1400_authentication.md`

To continue:
1. Run: /plan_solo @thoughts/shared/research/2025-09-13_1400_authentication.md
```

### Example 3: Complex Multi-Phase Context

**User**: `/compact_context`

**Response**:
```
I'll create a comprehensive progress document to preserve our current context.

Complex session with multiple phases:

Phase Transitions:
- Started: Research on API optimization
- Completed: Research document
- Created: Implementation plan (3 phases)
- Implemented: Phase 1 (complete), Phase 2 (60% done)

Documenting:
- 12 files modified across 3 phases
- 8 tests added, all passing
- 2 decisions on caching strategy
- 1 blocker: Database migration pending
- Next: Complete Phase 2 query optimization

Writing progress file...

Progress documented in:
`thoughts/shared/progress/2025-09-13_1800_api-optimization.md`

Summary:
- Research: ✅ Complete
- Planning: ✅ Complete
- Implementation: 🚧 Phase 2 (60%)

To resume: Focus on completing query optimization, then run migration
```

## Quality Checklist

Before completing context compaction:

- [ ] All file modifications documented
- [ ] Test status captured
- [ ] Decisions explained with rationale
- [ ] Issues and blockers listed
- [ ] Next steps are specific and actionable
- [ ] File:line references included
- [ ] Resume commands provided
- [ ] Session metrics recorded
- [ ] Related documents linked
- [ ] Context percentage noted

## Performance Considerations

- Keep progress files focused on current work thread
- Archive old progress files after task completion
- Use bullet points and concise descriptions
- Include only essential code snippets
- Link to full documents rather than duplicating

## Collaboration Benefits

Well-structured progress files enable:

1. **Handoffs**: Another developer can continue work
2. **Review**: Clear record of changes and decisions
3. **Debugging**: Timeline of when issues appeared
4. **Learning**: Patterns and insights preserved
5. **Planning**: Accurate effort estimates from history

Remember: Context compaction is about preserving continuity. Future you (or teammates) should be able to pick up exactly where you left off without confusion or lost work.