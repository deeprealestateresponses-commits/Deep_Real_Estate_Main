# Vercel MCP server

Lets Claude Code inspect and drive this project's Vercel deployments.

## Setup

1. Create a token at <https://vercel.com/account/tokens> (scope: Full Account, or
   just this project). Copy it — Vercel shows it once.
2. Export it before starting Claude Code:

   ```bash
   export VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxx
   # only if the project lives under a team rather than your personal account:
   export VERCEL_TEAM_ID=team_xxxxxxxx
   ```

3. Start a new Claude Code session in this folder. MCP servers are loaded at
   startup, so a session that was already running will not see it.

Registration lives in [`.mcp.json`](../../.mcp.json) at the repo root.

## Tools

| Tool | Does |
| --- | --- |
| `vercel_whoami` | Check the token works and report the account. |
| `vercel_projects` | List projects with their build settings. |
| `vercel_project` | One project in full — crucially, whether a Git repo is connected. |
| `vercel_deployments` | Recent deployments with state and source commit. |
| `vercel_build_logs` | Build output for a deployment; where a failure explains itself. |
| `vercel_redeploy` | Rebuild an existing deployment and promote it to production. |
| `vercel_deploy_dir` | Push a local directory straight to production, bypassing Git. |
| `vercel_check_url` | Fetch a deployed URL and report status, `<title>` and cache state. |

## Notes

No dependencies — it speaks MCP over stdio as newline-delimited JSON-RPC and
talks to the Vercel REST API with `fetch`. `vercel_deploy_dir` is the one
exception: it shells out to `npx vercel@latest`, because reimplementing the
file-upload protocol would be a lot of surface area for no gain.

The token is read from the environment and never written to disk by this server.
Keep it out of the repo.
