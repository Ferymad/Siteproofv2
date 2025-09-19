# Update Learnings Command

Apply accumulated learning suggestions to CLAUDE.md from session data and clear learning files for next cycle.

## Process

1. **Check Learning Sources**
   - Read `.claude/data/session_learning.json` (WorkflowLearner data)
   - Read `.claude/data/pending_learnings.json` (PreCompact suggestions)
   - Read test data if files above don't exist

2. **Apply Quality Filter**
   - Include: Concrete fixes, repeated patterns (≥2 times), verified solutions
   - Exclude: Vague suggestions, one-time issues, duplicates of existing content

3. **Update CLAUDE.md**
   - Add to "Known Issues & Fixes" section
   - Use structured format with timestamps
   - Include evidence and context

4. **Archive and Clean**
   - Move applied suggestions to `.claude/data/applied_learnings.json`
   - Clear session learning files
   - Prepare for next learning cycle

## Expected Output

Show me:
- Number of suggestions found and applied
- Specific improvements added to CLAUDE.md
- Any suggestions skipped and why
- Confirmation that learning data was cleared

## Example Learning Entry Format

```markdown
### Command Retry Patterns - 2025-09-16
- **Issue**: `python` command fails in environment
- **Fix**: Always use `python3` instead of `python`
- **Context**: UV script execution and general Python usage
- **Evidence**: 3 retry successes in session logs
```

This command provides manual control over when accumulated learnings get applied to documentation, ensuring quality and user oversight of the self-learning process.