# Research Solo Command

You are tasked with conducting comprehensive, evidence-first research using parallel sub-agents and producing thoroughly documented findings with file:line citations.

## Initial Response

When this command is invoked:

1. **Report current RPI state**:
   - Check `.claude/data/solo_rpi_state.json`
   - Note: State is now "research" phase
   - Previous phase: [show previous phase]

2. **Validate research scope**:
   - If specific files or topics were provided, begin immediate research
   - If vague request, clarify scope first
   - **IMPORTANT**: Read any mentioned files FULLY before proceeding
   - **CRITICAL**: Use Read tool WITHOUT limit/offset parameters

2. **If no parameters provided**, respond with:
```
I'll conduct evidence-first research on your topic.

Please provide:
1. The specific topic or question to research
2. Any relevant context or constraints
3. Particular areas of focus

Tip: You can also invoke with specifics: `/research_solo "How does authentication work?"`
```

## Auto-Context Loading

Before beginning research, automatically check:

1. **Load system state**:
```bash
python3 .claude/scripts/state_reader.py --json
```

2. **Find related research**:
```bash
python3 .claude/scripts/state_reader.py --topic "[research_topic]"
```

3. **Check recent progress**:
```bash
python3 .claude/scripts/state_reader.py --recent 6
```

4. **Verify phase prerequisites**:
   - If previous research exists on topic, reference it
   - If in wrong phase, notify user before proceeding

## Process Steps

### Step 1: Context Gathering & Decomposition

1. **Read all mentioned resources immediately**:
   - Any files referenced in the request
   - Related configuration files
   - **NEVER** spawn sub-tasks before reading these yourself

2. **Decompose the research question**:
   - Identify core components to investigate
   - Determine which sub-agents are needed
   - Plan parallel research strategy

### Step 2: Parallel Sub-Agent Research

1. **Create research todo list** using TodoWrite:
   - Track each research component
   - Monitor agent completion status
   - Document synthesis progress

2. **Spawn specialized agents in parallel**:

   **For Claude Code documentation:**
   - Use **official-docs-agent** to get authoritative Claude Code information
   - Check official patterns, configurations, and best practices

   **Example spawn patterns:**
   ```python
   # For Claude Code feature research
   Task("Research hooks documentation",
        "Use official-docs-agent to research Claude Code hooks configuration, best practices, and available lifecycle events",
        subagent_type="official-docs-agent"),

   Task("Check SDK integration patterns",
        "Use official-docs-agent to find official SDK usage examples and integration guidelines",
        subagent_type="official-docs-agent"),

   Task("Verify command structure",
        "Use official-docs-agent to validate slash command configuration and agent orchestration patterns",
        subagent_type="official-docs-agent"),

   # For library documentation research
   Task("Research library patterns",
        "Use context7-agent to research current Next.js App Router patterns and best practices",
        subagent_type="context7-agent"),

   Task("Check library compatibility",
        "Use context7-agent to verify Supabase authentication API compatibility with our requirements",
        subagent_type="context7-agent"),

   Task("Validate framework approach",
        "Use context7-agent to check current TypeScript best practices for our implementation approach",
        subagent_type="context7-agent")
   ```

   **For codebase exploration:**
   - Use **codebase-locator** to find WHERE relevant files exist
   - Use **codebase-analyzer** to understand HOW implementations work
   - Use **codebase-pattern-finder** to discover similar patterns

   **For documentation research:**
   - Use **thoughts-locator** to find existing research/plans
   - Use **thoughts-analyzer** to extract key insights

   **Agent orchestration strategy:**
   - Start with locator agents to map the landscape
   - Then use analyzer agents on most promising findings
   - Run pattern-finder for implementation examples
   - **IMPORTANT**: Wait for ALL agents to complete

3. **Synthesis and verification**:
   - Cross-reference findings across agents
   - Verify critical discoveries with direct file reads
   - Identify patterns and contradictions

### Step 3: Document Generation

Write research to `thoughts/shared/research/YYYY-MM-DD_HHMM_<topic>.md`

## Sub-Agent Orchestration Strategy

### Agent Selection Logic

**Use official-docs-agent when:**
- Researching Claude Code features or capabilities
- Verifying configuration patterns or best practices
- Understanding SDK or API usage
- Checking official implementation patterns
- Need authoritative documentation on hooks, agents, or commands
- Example prompt: "Research Claude Code hooks documentation and configuration patterns"

**Use context7-agent when:**
- Researching library features, APIs, or integration patterns
- Need current, version-specific documentation for frameworks
- Understanding best practices for React, Next.js, Supabase, etc.
- Checking library compatibility or migration requirements
- Verifying current API patterns and implementation approaches
- Example prompt: "Research React Query v5 data fetching patterns for Next.js"

**Use codebase-locator when:**
- Need to find files by topic/feature
- Searching for specific implementations
- Mapping directory structures
- Example prompt: "Find all files related to authentication"

**Use codebase-analyzer when:**
- Need to understand HOW code works
- Analyzing implementation details
- Tracing data flow
- Example prompt: "Analyze how user sessions are managed in auth.py"

**Use codebase-pattern-finder when:**
- Looking for similar implementations
- Need code examples to follow
- Searching for patterns to replicate
- Example prompt: "Find examples of error handling patterns"

**Use thoughts-locator when:**
- Researching previous decisions
- Finding related documentation
- Checking for existing research
- Example prompt: "Find any existing research about authentication"

**Use thoughts-analyzer when:**
- Need deep analysis of research documents
- Extracting insights from multiple thoughts
- Understanding complex research context
- Example prompt: "Analyze all authentication-related research documents"

### Parallel Execution Pattern

```python
# Enhanced execution with library documentation
agents = [
    Task("Locate files", codebase_locator_prompt),
    Task("Find patterns", pattern_finder_prompt),
    Task("Check existing research", thoughts_locator_prompt),
    Task("Research library docs", context7_agent_prompt)  # NEW
]
# Wait for ALL to complete before synthesis
```

### Agent Boundary Guidelines

**CRITICAL SEPARATION**:
- **official-docs-agent**: Use ONLY for Claude Code documentation (hooks, agents, commands, SDK)
- **context7-agent**: Use for ALL other library documentation (React, Next.js, Supabase, TypeScript, testing frameworks)

**Decision Matrix**:
- Query about Claude Code hooks? → official-docs-agent
- Query about React Query patterns? → context7-agent
- Query about Claude Code SDK? → official-docs-agent
- Query about Supabase authentication? → context7-agent

### Synthesis Requirements

After all agents complete:
1. **Consolidate findings** into coherent narrative
2. **Resolve contradictions** between agent outputs
3. **Verify critical findings** with direct file reads
4. **Identify gaps** that need follow-up research

## Error Handling

### Common Failure Scenarios

1. **Missing or inaccessible files**:
   - If codebase files missing: Verify repository state
   - If thoughts directory absent: Check configuration
   - Recovery: Use alternative search strategies

2. **Agent failures**:
   - If sub-agent returns no results: Try alternative search terms
   - If agent times out: Break into smaller requests
   - If contradictory results: Prioritize direct file reads

3. **Incomplete context**:
   - If research gaps found: Run additional targeted research
   - If requirements unclear: Stop and request clarification
   - Recovery: Document known gaps in research output

### Recovery Strategies

**For research_solo:**
- Fallback to manual file exploration if agents fail
- Use broader search terms if too specific
- Check alternative directories if expected structure differs
- Document uncertainties explicitly in research output

## What NOT to Do

### For research_solo:
- Don't guess about implementations
- Don't skip reading files completely
- Don't proceed with partial context
- Don't ignore contradictory findings
- Don't omit file:line references
- Don't make assumptions without evidence
- Don't synthesize before all agents complete
- Don't trust agent output without verification

## Verification Requirements

1. **If user corrects any misunderstanding**:
   - DO NOT just accept the correction
   - Spawn new research tasks to verify
   - Read specific files/directories mentioned
   - Only proceed once verified independently

2. **Before finalizing any output**:
   - Cross-reference with source files
   - Verify all file:line citations
   - Check for contradictions
   - Ensure completeness

## Output Template

Write to: `thoughts/shared/research/YYYY-MM-DD_HHMM_<topic>.md`

Required structure:

```markdown
---
date: YYYY-MM-DDTHH:MM:SS+TZ:TZ
researcher: claude-opus-4.1
git_commit: [current commit hash]
branch: [current branch]
repository: [repository name]
topic: "[exact research question]"
tags: [research, evidence-first, solo-rpi, ...]
status: complete
last_updated: YYYY-MM-DD
last_updated_by: claude-opus-4.1
---

# Research: [Topic Name]

**Date**: YYYY-MM-DDTHH:MM:SS+TZ:TZ
**Researcher**: claude-opus-4.1
**Git Commit**: [hash]
**Branch**: [branch]
**Repository**: [name]

## Research Question
[Exact question being researched]

## Summary
[2-3 paragraph executive summary with key findings]

## Detailed Findings

### [Category 1]
[Findings with file:line references]

### [Category 2]
[More findings with evidence]

## Code References
- `path/to/file.ext:123-145` - [What this shows]
- `another/file.py:67-89` - [Key implementation]

## Architecture Insights
[System design observations with evidence]

## Data Flow
```mermaid
[Optional diagram if helpful]
```

## Code Patterns
```language
// Example from file.ext:123-125
[actual code snippet]
```

## Assumptions
- [Assumption made] based on [evidence]
- [Another assumption] inferred from [file:line]

## Open Questions
- [Unresolved question] - needs [what to resolve]

## Related Research
- `thoughts/shared/research/[previous].md` - [Relevance]
```

## Examples

### Example 1: Simple Research Request

**User**: `/research_solo "How does authentication work?"`

**Response**:
```
I'll conduct evidence-first research on how authentication works.

Creating research todo list to track:
1. Locating authentication-related files
2. Analyzing authentication implementation
3. Finding authentication patterns
4. Checking existing authentication research

Spawning parallel sub-agents to investigate...

[After synthesis]

Research complete! I've documented my findings in:
`thoughts/shared/research/2025-09-13_1430_authentication.md`

Key findings:
- Authentication uses JWT tokens (auth/jwt.py:45-89)
- Session management in middleware (middleware/session.py:23-67)
- OAuth2 integration for third-party (oauth/providers.py:12-134)
```

### Example 2: Research with Context

**User**: `/research_solo @config/auth.yaml "authentication configuration patterns"`

**Response**:
```
I'll research authentication configuration patterns, starting with config/auth.yaml.

First, let me read the configuration file completely...

[Reads file]

Now spawning specialized agents to:
1. Locate all configuration usage points
2. Analyze configuration loading patterns
3. Find similar configuration examples
4. Check for configuration-related research

[After research]

Research documented in:
`thoughts/shared/research/2025-09-13_1445_auth-config-patterns.md`

Configuration patterns identified:
- YAML-based with environment overrides (config/loader.py:34-56)
- Validation using pydantic models (models/config.py:12-45)
- Runtime reloading capability (config/watcher.py:67-89)
```

### Example 3: Handling Vague Request

**User**: `/research_solo "performance"`

**Response**:
```
I'll conduct evidence-first research on performance.

To provide focused research, please clarify:
1. Specific performance area? (API response time, database queries, memory usage, etc.)
2. Any particular components or operations of interest?
3. Are there known performance issues to investigate?

Example: `/research_solo "database query performance in user endpoints"`
```

## Advanced Usage

### Multi-Agent Coordination

When researching complex topics, coordinate multiple agent types:

```python
# Research authentication flow
locator_tasks = [
    "Find all authentication entry points",
    "Locate token validation logic",
    "Find session management code"
]

analyzer_tasks = [
    "Analyze JWT token generation process",
    "Understand session lifecycle",
    "Trace authentication middleware flow"
]

pattern_tasks = [
    "Find all authentication decorators",
    "Identify common auth patterns",
    "Find error handling examples"
]
```

### Research Depth Control

**Shallow Research** (quick overview):
- Use only locator agents
- Focus on file discovery
- Document high-level structure

**Deep Research** (comprehensive analysis):
- Use all agent types
- Multiple rounds of investigation
- Detailed code analysis with snippets
- Complete data flow documentation

### Context Management

**IMPORTANT**: Keep context utilization under 50% by:
- Delegating heavy analysis to sub-agents
- Reading files selectively after agent reports
- Focusing synthesis on key findings only
- Using references instead of full content

## Quality Checklist

Before completing research:

- [ ] All mentioned files read completely
- [ ] Multiple agent types utilized appropriately
- [ ] Findings cross-referenced and verified
- [ ] File:line citations for all claims
- [ ] Code snippets included for key patterns
- [ ] Assumptions explicitly documented
- [ ] Open questions clearly listed
- [ ] Research output follows template exactly
- [ ] No guesswork or unfounded claims
- [ ] Context utilization under 50%

## Performance Considerations

- Keep context utilization under 50% through focused agent delegation
- Use parallel agent execution for research efficiency
- Cache frequently accessed reference materials
- Optimize searches with specific, targeted prompts
- Batch related research topics when possible

Remember: Research quality depends on evidence quality. Every finding must be traceable to specific code locations. When in doubt, verify with direct file reads.