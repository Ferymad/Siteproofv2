# Fix Citations Command

Automatically fix common citation issues based on validation results.

## Usage

When this command is invoked, you should:

1. **Run validation first**:
   ```bash
   python3 .claude/scripts/validate_evidence.py --save --quiet
   ```

2. **Identify fixable issues**:
   - Read validation files to find errors
   - Focus on auto-fixable issues like:
     - Wrong line numbers (can look up correct lines)
     - Incorrect file paths (can find correct path)
     - Files that moved (can update path)

3. **For each file with errors**:
   - Read the validation report
   - Identify citations that can be fixed
   - Apply fixes systematically

## Auto-Fix Process

### For "File not found" errors:

1. **Try suggested search**:
   ```bash
   find . -name "filename.py" -type f
   ```

2. **If file found with different path**:
   - Update citation to use correct path
   - Example: `user_prompt_submit.py:42` → `.claude/hooks/user_prompt_submit.py:42`

3. **If file was renamed**:
   ```bash
   git log --follow --name-only --format="" -- "*filename*" | head -5
   ```

### For "Line out of range" errors:

1. **Check actual line count**:
   ```bash
   wc -l filename.py
   ```

2. **Adjust citation to valid range**:
   - If cited line 566 but file has 550 lines
   - Change to: `filename.py:1-550` or find actual content

### For each fix:

1. **Read the original file**
2. **Find and replace citations**
3. **Document what was fixed**

## Example Fix Report

```markdown
# Citation Fixes Applied

## Fixed Files (3)
- `thoughts/shared/research/example.md`: 5 citations fixed
- `thoughts/shared/plans/plan.md`: 2 citations fixed
- `thoughts/shared/research/another.md`: 1 citation fixed

## Fixes Applied

### thoughts/shared/research/example.md
- ❌ `user_prompt_submit.py:42`
- ✅ `.claude/hooks/user_prompt_submit.py:42`
- **Reason**: File found at different path

### thoughts/shared/plans/plan.md
- ❌ `validate_evidence.py:200`
- ✅ `.claude/scripts/validate_evidence.py:200`
- **Reason**: Missing path prefix

## Unable to Fix (2)
- `SOLO_RPI_SPEC.md:102`: File no longer exists
- `old_file.py:50`: File deleted in commit abc123
```

## Implementation Notes

- Always create a backup before modifying files
- Run validation again after fixes to verify
- Report both successful and failed fixes
- Prefer conservative fixes (don't guess)

## Safety Rules

- Never modify citations that are already valid
- Don't change citation content, only fix references
- Preserve original formatting and context
- If unsure, mark as "needs manual review"