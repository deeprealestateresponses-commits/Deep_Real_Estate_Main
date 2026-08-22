#!/usr/bin/env node
/**
 * Vercel MCP server.
 *
 * Exposes the handful of Vercel operations this project actually needs —
 * inspecting projects and deployments, reading a failed build's logs,
 * redeploying, and pushing a local directory straight to production.
 *
 * Speaks MCP over stdio as newline-delimited JSON-RPC, with no dependencies, so
 * it runs from a bare checkout with nothing installed.
 *
 * Auth: set VERCEL_TOKEN (create one at https://vercel.com/account/tokens).
 * Optionally set VERCEL_TEAM_ID if the project belongs to a team rather than a
 * personal account.
 */

import { spawn } from 'node:child_process';

const API = 'https://api.vercel.com';
const TOKEN = process.env.VERCEL_TOKEN || '';
const TEAM = process.env.VERCEL_TEAM_ID || '';

/* --------------------------------------------------------------- Vercel API */

async function api(path, init = {}) {
  if (!TOKEN) {
    throw new Error(
      'VERCEL_TOKEN is not set. Create a token at https://vercel.com/account/tokens ' +
        'and put it in the mcpServers env block for this server.'
    );
  }
  const url = new URL(API + path);
  if (TEAM && !url.searchParams.has('teamId')) url.searchParams.set('teamId', TEAM);

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const msg = body?.error?.message || body?.message || text || res.statusText;
    throw new Error(`Vercel API ${res.status}: ${msg}`);
  }
  return body;
}

/** Resolve a project name to the id the deployment endpoints want. */
async function projectId(nameOrId) {
  const p = await api(`/v9/projects/${encodeURIComponent(nameOrId)}`);
  return p.id;
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      ...opts,
      env: { ...process.env, ...(opts.env || {}) },
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => resolve({ code: -1, out, err: err + e.message }));
    child.on('close', (code) => resolve({ code, out, err }));
  });
}

/* ------------------------------------------------------------------- tools */

const TOOLS = [
  {
    name: 'vercel_whoami',
    description:
      'Confirm the token works and report which Vercel account or team it belongs to. Call this first when something is not behaving.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    async run() {
      const me = await api('/v2/user');
      return {
        user: me.user?.username || me.user?.email,
        id: me.user?.id,
        teamId: TEAM || null,
      };
    },
  },

  {
    name: 'vercel_projects',
    description: 'List the projects on the account, newest first.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number', description: 'How many to return (default 20).' } },
      additionalProperties: false,
    },
    async run({ limit = 20 }) {
      const r = await api(`/v9/projects?limit=${limit}`);
      return r.projects.map((p) => ({
        name: p.name,
        id: p.id,
        framework: p.framework,
        outputDirectory: p.outputDirectory,
        buildCommand: p.buildCommand,
        rootDirectory: p.rootDirectory,
        gitRepo: p.link ? `${p.link.type}:${p.link.org}/${p.link.repo}` : null,
        productionBranch: p.link?.productionBranch ?? null,
        updatedAt: new Date(p.updatedAt).toISOString(),
      }));
    },
  },

  {
    name: 'vercel_project',
    description:
      'Full settings for one project, including whether a Git repository is connected and what the build settings are. Use this to diagnose a project that never builds on push.',
    inputSchema: {
      type: 'object',
      properties: { project: { type: 'string', description: 'Project name or id.' } },
      required: ['project'],
      additionalProperties: false,
    },
    async run({ project }) {
      const p = await api(`/v9/projects/${encodeURIComponent(project)}`);
      return {
        name: p.name,
        id: p.id,
        framework: p.framework,
        rootDirectory: p.rootDirectory,
        buildCommand: p.buildCommand,
        installCommand: p.installCommand,
        outputDirectory: p.outputDirectory,
        nodeVersion: p.nodeVersion,
        gitConnected: Boolean(p.link),
        git: p.link
          ? {
              type: p.link.type,
              repo: `${p.link.org}/${p.link.repo}`,
              productionBranch: p.link.productionBranch,
              deployHooks: (p.link.deployHooks || []).map((h) => ({ name: h.name, ref: h.ref })),
            }
          : null,
        latestProductionUrl: p.targets?.production?.url ?? null,
        latestProductionCommit: p.targets?.production?.meta?.githubCommitSha ?? null,
      };
    },
  },

  {
    name: 'vercel_deployments',
    description:
      'Recent deployments for a project, newest first, with state and the commit each was built from.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Project name or id.' },
        limit: { type: 'number', description: 'How many to return (default 10).' },
      },
      required: ['project'],
      additionalProperties: false,
    },
    async run({ project, limit = 10 }) {
      const r = await api(`/v6/deployments?app=${encodeURIComponent(project)}&limit=${limit}`);
      return r.deployments.map((d) => ({
        uid: d.uid,
        url: d.url,
        state: d.state ?? d.readyState,
        target: d.target,
        created: new Date(d.created ?? d.createdAt).toISOString(),
        commit: d.meta?.githubCommitSha?.slice(0, 7) ?? null,
        message: d.meta?.githubCommitMessage?.split('\n')[0] ?? null,
        branch: d.meta?.githubCommitRef ?? null,
      }));
    },
  },

  {
    name: 'vercel_build_logs',
    description:
      'Build and runtime events for one deployment. This is where a failed build says why it failed.',
    inputSchema: {
      type: 'object',
      properties: {
        deploymentId: { type: 'string', description: 'Deployment uid, e.g. dpl_xxx.' },
        limit: { type: 'number', description: 'How many events (default 200).' },
        errorsOnly: { type: 'boolean', description: 'Keep only error-level lines.' },
      },
      required: ['deploymentId'],
      additionalProperties: false,
    },
    async run({ deploymentId, limit = 200, errorsOnly = false }) {
      const events = await api(
        `/v3/deployments/${encodeURIComponent(deploymentId)}/events?limit=${limit}&builds=1`
      );
      const rows = (Array.isArray(events) ? events : events.events || [])
        .filter((e) => (errorsOnly ? e.type === 'stderr' || e.level === 'error' : true))
        .map((e) => (e.payload?.text ?? e.text ?? '').toString().trimEnd())
        .filter(Boolean);
      return { lines: rows.length, log: rows.join('\n') };
    },
  },

  {
    name: 'vercel_redeploy',
    description:
      'Rebuild an existing deployment, optionally promoting it to production. Use when the code is already on the right commit and the build just needs to run again.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Project name.' },
        deploymentId: { type: 'string', description: 'Deployment uid to rebuild.' },
        production: { type: 'boolean', description: 'Promote to production (default true).' },
      },
      required: ['project', 'deploymentId'],
      additionalProperties: false,
    },
    async run({ project, deploymentId, production = true }) {
      const d = await api(`/v13/deployments`, {
        method: 'POST',
        body: JSON.stringify({
          name: project,
          deploymentId,
          target: production ? 'production' : undefined,
          meta: { action: 'redeploy' },
        }),
      });
      return { uid: d.id, url: d.url, state: d.readyState, inspector: d.inspectorUrl };
    },
  },

  {
    name: 'vercel_deploy_dir',
    description:
      'Deploy a local directory straight to Vercel, bypassing the Git integration entirely. This is the reliable way to get a static export live when pushes are not triggering builds. Shells out to the Vercel CLI via npx.',
    inputSchema: {
      type: 'object',
      properties: {
        dir: { type: 'string', description: 'Absolute path to the directory to deploy.' },
        project: { type: 'string', description: 'Vercel project name to deploy into.' },
        production: { type: 'boolean', description: 'Deploy to production (default true).' },
      },
      required: ['dir', 'project'],
      additionalProperties: false,
    },
    async run({ dir, project, production = true }) {
      if (!TOKEN) throw new Error('VERCEL_TOKEN is not set.');
      const args = [
        '--yes',
        'vercel@latest',
        'deploy',
        dir,
        '--yes',
        '--name',
        project,
        '--token',
        TOKEN,
      ];
      if (production) args.push('--prod');
      if (TEAM) args.push('--scope', TEAM);

      const r = await run('npx', args, { cwd: dir });
      const url = (r.out.match(/https:\/\/[^\s]+\.vercel\.app/g) || []).pop() || null;
      return {
        exitCode: r.code,
        url,
        stdout: r.out.slice(-4000),
        stderr: r.err.slice(-4000),
      };
    },
  },

  {
    name: 'vercel_check_url',
    description:
      'Fetch a URL on the deployment and report the status, the <title>, and the byte size. Use to verify a deploy actually serves what you expect rather than a stale build.',
    inputSchema: {
      type: 'object',
      properties: { url: { type: 'string', description: 'Full URL to fetch.' } },
      required: ['url'],
      additionalProperties: false,
    },
    async run({ url }) {
      const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
      const body = await res.text();
      return {
        status: res.status,
        bytes: body.length,
        title: (body.match(/<title>([^<]*)<\/title>/i) || [, null])[1],
        vercelCache: res.headers.get('x-vercel-cache'),
        vercelId: res.headers.get('x-vercel-id'),
      };
    },
  },
];

/* --------------------------------------------------------- MCP over stdio */

const byName = new Map(TOOLS.map((t) => [t.name, t]));

function reply(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}
function fail(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

async function handle(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    return reply(id, {
      protocolVersion: params?.protocolVersion || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'vercel', version: '1.0.0' },
    });
  }

  // notifications carry no id and expect no response
  if (id === undefined) return;

  if (method === 'ping') return reply(id, {});

  if (method === 'tools/list') {
    return reply(
      id,
      { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) }
    );
  }

  if (method === 'tools/call') {
    const tool = byName.get(params?.name);
    if (!tool) return fail(id, -32602, `Unknown tool: ${params?.name}`);
    try {
      const out = await tool.run(params.arguments || {});
      return reply(id, {
        content: [{ type: 'text', text: JSON.stringify(out, null, 1) }],
      });
    } catch (e) {
      return reply(id, {
        content: [{ type: 'text', text: `Error: ${e.message}` }],
        isError: true,
      });
    }
  }

  return fail(id, -32601, `Method not found: ${method}`);
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      continue;
    }
    handle(msg).catch((e) => {
      if (msg.id !== undefined) fail(msg.id, -32603, e.message);
    });
  }
});
process.stdin.on('end', () => process.exit(0));
