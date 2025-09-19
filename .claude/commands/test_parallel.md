# Test Parallel Command

This command spawns multiple agents in parallel to test and verify parallel execution capability.

## Usage

```
/test_parallel [number_of_agents]
```

Default: 3 agents if number not specified

## Implementation

When invoked, spawn the specified number of agents simultaneously using parallel Task tool invocations. This command is designed to create deliberate parallel execution for testing the verification suite.

### Execution Pattern

```python
# Parse number of agents (default 3, max 5 for safety)
num_agents = min(int(args[0]) if args else 3, 5)

# Create parallel agent tasks
tasks = []
for i in range(num_agents):
    task_desc = f"Test agent {i+1} of {num_agents}"
    task_prompt = f"Search for patterns related to 'test_pattern_{i}' in the codebase. This is verification test {i+1} of {num_agents} agents running in parallel. Look for any files containing this pattern or similar testing patterns."

    tasks.append(
        Task(task_desc, task_prompt, subagent_type="codebase-locator")
    )

# Execute ALL tasks simultaneously (not sequentially)
# CRITICAL: All Task() calls must be made in the same message for true parallelism

# After agents complete, automatically run verification
try:
    import subprocess
    result = subprocess.run([".claude/scripts/verify_parallel.py"],
                          capture_output=True, text=True, timeout=10)

    if result.returncode == 0:
        verification = json.loads(result.stdout)
        print("\n" + "="*50)
        print("🔍 PARALLEL EXECUTION VERIFICATION")
        print("="*50)

        if verification['summary']['verified']:
            metrics = verification['metrics']
            print(f"✅ Parallel execution VERIFIED!")
            print(f"   • Total agents spawned: {metrics['total_agents']}")
            print(f"   • Parallel pairs detected: {metrics['parallel_pairs']}")
            print(f"   • Maximum parallelism: {metrics['max_parallelism']}")
            print(f"   • Estimated speedup: {metrics['estimated_speedup']}x")
            print(f"   • Parallel percentage: {metrics['parallel_percentage']}%")

            # Show timing examples
            if verification['overlaps']['examples']:
                print(f"\n📊 Timing Examples:")
                for example in verification['overlaps']['examples'][:3]:
                    print(f"   • {example['agent1']['type']} ⟷ {example['agent2']['type']}: {example['time_diff_ms']}ms apart")
        else:
            print("❌ No parallel execution detected")
            print("   Agents may have run sequentially instead of parallel")

        print(f"\n📄 Full results: {verification.get('file', 'session log')}")
        print("="*50)
    else:
        print(f"\n⚠️  Verification script error: {result.stderr}")

except Exception as e:
    print(f"\n⚠️  Could not run verification: {e}")
```

## Agent Configuration

**Agent Type**: `codebase-locator`
- Lightweight search operations to avoid resource waste
- Fast execution for testing purposes
- Safe operations that don't modify anything

**Search Patterns**:
- Each agent searches for unique patterns (`test_pattern_0`, `test_pattern_1`, etc.)
- Prevents duplicate work while ensuring distinct tasks
- Provides measurable verification data

## Verification Process

After agent execution completes:

1. **Automatic Verification**: Run `.claude/scripts/verify_parallel.py`
2. **Results Display**: Show parallel execution metrics
3. **Timing Analysis**: Display overlap examples
4. **Performance Metrics**: Calculate estimated speedup

## Expected Output

```
Spawning 3 test agents for parallel execution verification...

🔍 Running Test Agent 1: Search for test_pattern_0
🔍 Running Test Agent 2: Search for test_pattern_1
🔍 Running Test Agent 3: Search for test_pattern_2

[Agent execution occurs...]

==================================================
🔍 PARALLEL EXECUTION VERIFICATION
==================================================
✅ Parallel execution VERIFIED!
   • Total agents spawned: 3
   • Parallel pairs detected: 3
   • Maximum parallelism: 3
   • Estimated speedup: 3.0x
   • Parallel percentage: 100.0%

📊 Timing Examples:
   • codebase-locator ⟷ codebase-locator: 50ms apart
   • codebase-locator ⟷ codebase-locator: 75ms apart

📄 Full results: .claude/data/logs/session_abc123.jsonl
==================================================

Parallel execution test completed successfully! The verification suite
detected true parallel agent spawning with 3.0x estimated speedup.
```

## Error Handling

**If verification fails:**
```
❌ No parallel execution detected
   Agents may have run sequentially instead of parallel

This could indicate:
- Task tools were not spawned simultaneously
- Claude Code executed agents sequentially
- Verification script needs debugging
```

**If agents fail:**
- Continue with verification anyway
- Document any agent failures
- Show partial results if available

## Usage Examples

```bash
# Test with default 3 agents
/test_parallel

# Test with 2 agents
/test_parallel 2

# Test with maximum 5 agents
/test_parallel 5

# Invalid: Over limit (will cap at 5)
/test_parallel 10
```

## Safety Considerations

- **Agent limit**: Maximum 5 agents to prevent resource overload
- **Lightweight operations**: Only search operations, no modifications
- **Timeout protection**: Verification has 10-second timeout
- **Error isolation**: Agent failures don't break verification

## Integration

This command integrates with:
- **Phase 1**: `verify_parallel.py` for automated verification
- **Phase 2**: `verify_parallel.sh` for manual cross-checking
- **Phase 4**: Hook integration for session-end reporting

## Notes

- **Purpose**: Testing and validation only, not for production use
- **Performance**: Designed to prove parallel execution capability
- **Verification**: Automatically validates its own parallel spawning
- **Evidence**: Creates concrete data for verification suite testing

This command serves as both a test of parallel execution AND a validator of the verification suite itself.