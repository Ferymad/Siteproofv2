# Lint Evidence Command

You are tasked with validating file:line citations in Solo RPI research and plan documents, ensuring all evidence references point to actual code locations.

## Initial Response

When this command is invoked:

1. **Identify scope of validation**:
   - If specific file provided: validate that file
   - Otherwise: validate all research and plan documents
   - Note current RPI phase from state

2. **Run validation script**:
   - Execute `.claude/scripts/validate_evidence.py`
   - Collect results and categorize issues

3. **Present findings clearly**:
   - Summary of validation results
   - Critical errors (missing files) listed first
   - Warnings (invalid line ranges) listed second
   - Suggestions for fixing issues

## Process Steps

### Step 1: Scope Determination

Determine what to validate based on command invocation:

- `/lint-evidence` - Validate all research and plans
- `/lint-evidence @file.md` - Validate specific file
- `/lint-evidence research` - Validate research directory only
- `/lint-evidence plans` - Validate plans directory only

### Step 2: Execute Validation

Run the validation script and collect results:

```bash
# For all documents
uv run .claude/scripts/validate_evidence.py

# For specific file
echo '{"files":["path/to/file.md"]}' | uv run .claude/scripts/validate_evidence.py
```

### Step 3: Present Results

Format results for clarity:

```
📋 Evidence Validation Report
═══════════════════════════════

Files Scanned: X
Total Citations: Y
Valid Citations: Z (XX%)

⚠️ CRITICAL ISSUES (Missing Files):
- file.md: `missing.py:123` - File not found
- other.md: `gone.js:45-67` - File not found

⚠️ WARNINGS (Invalid Line Ranges):
- doc.md: `exist.py:9999` - Line 9999 not found (file has 500 lines)
- plan.md: `real.js:100-200` - Line 200 not found (file has 150 lines)

✅ SUGGESTIONS:
1. Update citations to match current file structure
2. Verify line numbers after recent refactoring
3. Use exact line ranges from current codebase

Run `/research_solo` to regenerate evidence with current citations.
```

## Examples

### Example 1: Validating All Documents

**User**: `/lint-evidence`

**Response**:
```
Running evidence validation across all research and plan documents...

📋 Evidence Validation Report
═══════════════════════════════

Files Scanned: 15
Total Citations: 247
Valid Citations: 242 (98%)

⚠️ CRITICAL ISSUES (Missing Files):
- 2025-09-13_auth.md: `auth/old_jwt.py:45` - File not found

⚠️ WARNINGS (Invalid Line Ranges):
- 2025-09-14_api.md: `api/routes.py:567` - Line 567 not found (file has 423 lines)
- 2025-09-14_api.md: `api/routes.py:601-650` - Line 650 not found (file has 423 lines)
- 2025-09-13_cache.md: `cache/redis.py:234` - Line 234 not found (file has 189 lines)
- 2025-09-12_db.md: `models/user.py:99` - Line 99 not found (file has 87 lines)

✅ SUGGESTIONS:
1. File `auth/old_jwt.py` may have been renamed or removed
2. Line ranges in `api/routes.py` appear outdated after recent changes
3. Consider regenerating research for affected components

Overall evidence quality: GOOD (98% valid)
Minor updates needed for full compliance.
```

### Example 2: Validating Specific File

**User**: `/lint-evidence @thoughts/shared/plans/2025-09-14-feature.md`

**Response**:
```
Validating evidence in: thoughts/shared/plans/2025-09-14-feature.md

📋 Evidence Validation Report
═══════════════════════════════

File: 2025-09-14-feature.md
Total Citations: 23
Valid Citations: 23 (100%)

✅ All evidence citations are valid!

The implementation plan has solid evidence foundation.
Ready to proceed with `/implement_solo`.
```

### Example 3: No Documents Found

**User**: `/lint-evidence`

**Response**:
```
No research or plan documents found to validate.

The Solo RPI workflow starts with research:
1. Run `/research_solo "your topic"` to create research
2. Run `/plan_solo @research_file.md` to create plan
3. Then use `/lint-evidence` to validate citations

Current RPI phase: none
```

## Error Handling

### Common Issues

1. **Validation script not found**:
   - Check if Phase 1 implementation is complete
   - Verify script path is correct
   - Ensure UV is properly configured

2. **Permission errors**:
   - Check file permissions on scripts
   - Verify directory access rights

3. **Large number of errors**:
   - Focus on critical issues first
   - Suggest incremental fixes
   - Offer to help update citations

## Integration Notes

- Command updates evidence validation timestamp in state
- Results can influence Stop hook behavior
- Works with all Solo RPI workflow phases
- Non-blocking by default (informational)

## What NOT to Do

- Don't block workflow (only inform)
- Don't modify files automatically
- Don't validate content meaningfulness
- Don't check non-backtick citations
- Don't scan outside thoughts/shared/