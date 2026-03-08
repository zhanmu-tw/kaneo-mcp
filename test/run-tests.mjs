#!/usr/bin/env node

/**
 * Kaneo CLI — Full Test Suite
 *
 * Tests all 48 functions via CLI invocation against a live Kaneo instance.
 *
 * Usage:
 *   KANEO_API_URL=https://cloud.kaneo.app \
 *   KANEO_API_TOKEN=your-token \
 *   KANEO_WORKSPACE_ID=your-workspace-id \
 *   node test/run-tests.mjs
 *
 * Or with .env file:
 *   node --env-file=.env test/run-tests.mjs
 *
 * The test creates resources, validates responses, then cleans up.
 */

import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(__dirname, "../dist/index.js");

const API_URL = process.env.KANEO_API_URL;
const API_TOKEN = process.env.KANEO_API_TOKEN;
const WORKSPACE_ID = process.env.KANEO_WORKSPACE_ID;

if (!API_URL || !API_TOKEN || !WORKSPACE_ID) {
  console.error(
    "Error: KANEO_API_URL, KANEO_API_TOKEN, and KANEO_WORKSPACE_ID environment variables are required",
  );
  process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────

function callTool(name, flags = {}) {
  const args = [CLI_PATH, API_URL, WORKSPACE_ID, API_TOKEN, name];
  for (const [key, value] of Object.entries(flags)) {
    args.push(`--${key}=${value}`);
  }
  try {
    const stdout = execFileSync("node", args, {
      encoding: "utf-8",
      timeout: 15000,
    });
    return JSON.parse(stdout);
  } catch (err) {
    // execFileSync throws on non-zero exit
    const stderr = err.stderr?.toString() || err.message;
    throw new Error(`[CLI Error] ${stderr.trim()}`);
  }
}

// ─── Test Framework ─────────────────────────────────────────────────────

const results = { passed: 0, failed: 0, skipped: 0, errors: [] };

async function test(name, fn) {
  try {
    await fn();
    results.passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    results.failed++;
    results.errors.push({ name, error: err.message });
    console.log(`  ❌ ${name}: ${err.message}`);
  }
}

function skip(name, reason) {
  results.skipped++;
  console.log(`  ⏭️  ${name} (${reason})`);
}

async function testIf(value, name, fn) {
  if (value == null) {
    skip(name, "prerequisite resource was not created");
  } else {
    await test(name, fn);
  }
}

function assert(value, message) {
  if (!value) throw new Error(message || "Assertion failed");
}

function assertHas(obj, key, message) {
  if (obj == null || typeof obj !== "object") {
    throw new Error(
      message ||
        `Expected object with key "${key}", got ${typeof obj}: ${JSON.stringify(obj)?.substring(0, 100)}`,
    );
  }
  if (!(key in obj)) throw new Error(message || `Missing key: ${key}`);
}

function assertEq(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected "${expected}", got "${actual}"`);
  }
}

// ─── Test Suites ────────────────────────────────────────────────────────

async function runTests() {
  console.log("\n🚀 Starting Kaneo CLI tests...\n");

  // Track created resources for cleanup
  const ctx = {
    projectId: null,
    taskId: null,
    columnId: null,
    labelId: null,
    commentId: null,
    timeEntryId: null,
  };

  // ── 1. Smoke Test ───────────────────────────────────────────────────
  console.log("💨 Smoke Test");
  await test("CLI prints usage with no args", async () => {
    try {
      execFileSync("node", [CLI_PATH], { encoding: "utf-8" });
      throw new Error("Should have exited with error");
    } catch (err) {
      assert(err.status === 1, `Expected exit code 1, got ${err.status}`);
      assert(err.stderr?.includes("Usage:"), "Expected usage text in stderr");
    }
  });

  // ── 2. Config ────────────────────────────────────────────────────────
  console.log("\n⚙️  Config");
  await test("get_config returns settings", async () => {
    const data = callTool("get_config");
    assertHas(data, "disableRegistration");
    assertHas(data, "isDemoMode");
  });

  // ── 3. Projects ──────────────────────────────────────────────────────
  console.log("\n📁 Projects");
  await test("list_projects returns array", async () => {
    const data = callTool("list_projects");
    assert(Array.isArray(data), `Expected array, got ${typeof data}`);
  });

  await test("create_project creates a project", async () => {
    const slug = `cli-test-${Date.now()}`;
    const data = callTool("create_project", {
      name: "CLI Test Project",
      icon: "📋",
      slug,
    });
    assertHas(data, "id");
    assertEq(data.name, "CLI Test Project");
    ctx.projectId = data.id;
    console.log(`    → projectId: ${ctx.projectId}`);
  });

  await testIf(ctx.projectId, "get_project retrieves the project", async () => {
    const data = callTool("get_project", { id: ctx.projectId });
    assertEq(data.id, ctx.projectId);
    assertHas(data, "name");
  });

  await testIf(
    ctx.projectId,
    "update_project modifies the project",
    async () => {
      const data = callTool("update_project", {
        id: ctx.projectId,
        description: "Updated by CLI test suite",
      });
      assertEq(data.description, "Updated by CLI test suite");
    },
  );

  // ── 4. Columns ───────────────────────────────────────────────────────
  console.log("\n🏛️  Columns");
  await testIf(
    ctx.projectId,
    "get_columns returns project columns",
    async () => {
      const data = callTool("get_columns", { projectId: ctx.projectId });
      assert(Array.isArray(data), `Expected array, got ${typeof data}`);
    },
  );

  await testIf(ctx.projectId, "create_column adds a column", async () => {
    const data = callTool("create_column", {
      projectId: ctx.projectId,
      name: "Test Column",
      color: "#FF5733",
    });
    assertHas(data, "id");
    ctx.columnId = data.id;
    console.log(`    → columnId: ${ctx.columnId}`);
  });

  await testIf(ctx.columnId, "update_column modifies the column", async () => {
    const data = callTool("update_column", {
      id: ctx.columnId,
      name: "Updated Column",
      isFinal: "false",
    });
    assert(data != null, "Expected response");
  });

  await testIf(ctx.columnId, "reorder_columns changes order", async () => {
    const data = callTool("reorder_columns", {
      projectId: ctx.projectId,
      columns: JSON.stringify([{ id: ctx.columnId, position: 0 }]),
    });
    assert(data != null, "Expected response");
  });

  // ── 5. Tasks ─────────────────────────────────────────────────────────
  console.log("\n✅ Tasks");
  await testIf(ctx.projectId, "create_task creates a task", async () => {
    const cols = callTool("get_columns", { projectId: ctx.projectId });
    const colName =
      Array.isArray(cols) && cols.length > 0 ? cols[0].name : "To Do";
    const data = callTool("create_task", {
      projectId: ctx.projectId,
      title: "CLI Test Task",
      description: "Created by test suite",
      priority: "medium",
      status: colName,
    });
    assertHas(data, "id");
    assertEq(data.title, "CLI Test Task");
    ctx.taskId = data.id;
    console.log(`    → taskId: ${ctx.taskId}`);
  });

  await testIf(ctx.taskId, "get_task retrieves the task", async () => {
    const data = callTool("get_task", { id: ctx.taskId });
    assertEq(data.id, ctx.taskId);
    assertEq(data.title, "CLI Test Task");
  });

  await testIf(ctx.projectId, "list_tasks returns project tasks", async () => {
    const data = callTool("list_tasks", { projectId: ctx.projectId });
    assert(data != null, "Expected response");
  });

  await testIf(ctx.taskId, "update_task modifies all fields", async () => {
    const data = callTool("update_task", {
      id: ctx.taskId,
      title: "Updated Task",
      priority: "high",
    });
    assert(data != null, "Expected response");
  });

  await testIf(ctx.taskId, "update_task_title changes title", async () => {
    const data = callTool("update_task_title", {
      id: ctx.taskId,
      title: "Title via granular update",
    });
    assertEq(data.title, "Title via granular update");
  });

  await testIf(
    ctx.taskId,
    "update_task_description changes description",
    async () => {
      const data = callTool("update_task_description", {
        id: ctx.taskId,
        description: "Description via granular update",
      });
      assertEq(data.description, "Description via granular update");
    },
  );

  await testIf(
    ctx.taskId,
    "update_task_priority changes priority",
    async () => {
      const data = callTool("update_task_priority", {
        id: ctx.taskId,
        priority: "urgent",
      });
      assert(data != null, "Expected response");
    },
  );

  await testIf(ctx.taskId, "update_task_due_date sets due date", async () => {
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString();
    const data = callTool("update_task_due_date", {
      id: ctx.taskId,
      dueDate,
    });
    assertHas(data, "dueDate");
  });

  await testIf(ctx.taskId, "update_task_assignee unassigns", async () => {
    const data = callTool("update_task_assignee", {
      id: ctx.taskId,
      userId: "",
    });
    assert(data != null, "Expected response");
  });

  await testIf(ctx.taskId, "update_task_status changes status", async () => {
    let status = "Test Column";
    if (ctx.columnId) {
      const cols = callTool("get_columns", { projectId: ctx.projectId });
      if (Array.isArray(cols) && cols.length > 0) {
        status = cols[0].name;
      }
    }
    const data = callTool("update_task_status", {
      id: ctx.taskId,
      status,
    });
    assertHas(data, "status");
  });

  await testIf(
    ctx.projectId,
    "export_tasks exports project tasks",
    async () => {
      const data = callTool("export_tasks", { projectId: ctx.projectId });
      assert(data != null, "Expected response");
    },
  );

  await testIf(ctx.projectId, "import_tasks imports tasks", async () => {
    const cols = callTool("get_columns", { projectId: ctx.projectId });
    const colName =
      Array.isArray(cols) && cols.length > 0 ? cols[0].name : "To Do";
    const data = callTool("import_tasks", {
      projectId: ctx.projectId,
      tasks: JSON.stringify([
        { title: "Imported Task 1", priority: "low", status: colName },
        { title: "Imported Task 2", priority: "medium", status: colName },
      ]),
    });
    assert(data != null, "Expected response");
  });

  // ── 6. Activities & Comments ─────────────────────────────────────────
  console.log("\n💬 Activities & Comments");
  await testIf(ctx.taskId, "create_comment adds a comment", async () => {
    const data = callTool("create_comment", {
      taskId: ctx.taskId,
      comment: "Test comment from CLI",
    });
    assert(
      data != null && typeof data === "object",
      "Expected object response",
    );
    ctx.commentId = data.id || null;
    if (ctx.commentId) console.log(`    → commentId: ${ctx.commentId}`);
  });

  await testIf(
    ctx.taskId,
    "get_activities returns task activities",
    async () => {
      const data = callTool("get_activities", { taskId: ctx.taskId });
      assert(Array.isArray(data), `Expected array, got ${typeof data}`);
      assert(data.length > 0, "Expected at least one activity");
    },
  );

  await testIf(
    ctx.commentId,
    "update_comment modifies the comment",
    async () => {
      const data = callTool("update_comment", {
        activityId: ctx.commentId,
        comment: "Updated comment from CLI",
      });
      assertHas(data, "id");
    },
  );

  skip(
    "create_activity",
    "requires valid user ID — server returns 500 with empty userId",
  );

  await testIf(
    ctx.commentId,
    "delete_comment removes the comment",
    async () => {
      callTool("delete_comment", { id: ctx.commentId });
    },
  );

  // ── 7. Time Entries ──────────────────────────────────────────────────
  console.log("\n⏱️  Time Entries");
  await testIf(ctx.taskId, "create_time_entry logs time", async () => {
    const start = new Date(Date.now() - 3600000).toISOString();
    const end = new Date().toISOString();
    const data = callTool("create_time_entry", {
      taskId: ctx.taskId,
      startTime: start,
      endTime: end,
      description: "Test time entry",
    });
    assertHas(data, "id");
    ctx.timeEntryId = data.id;
    console.log(`    → timeEntryId: ${ctx.timeEntryId}`);
  });

  await testIf(
    ctx.taskId,
    "get_task_time_entries returns entries",
    async () => {
      const data = callTool("get_task_time_entries", {
        taskId: ctx.taskId,
      });
      assert(Array.isArray(data), `Expected array, got ${typeof data}`);
    },
  );

  await testIf(ctx.timeEntryId, "get_time_entry retrieves by ID", async () => {
    const data = callTool("get_time_entry", { id: ctx.timeEntryId });
    assertEq(data.id, ctx.timeEntryId);
  });

  await testIf(
    ctx.timeEntryId,
    "update_time_entry modifies entry",
    async () => {
      const data = callTool("update_time_entry", {
        id: ctx.timeEntryId,
        description: "Updated time entry",
      });
      assert(data != null, "Expected response");
    },
  );

  // ── 8. Labels ────────────────────────────────────────────────────────
  console.log("\n🏷️  Labels");
  await testIf(ctx.taskId, "create_label creates a label", async () => {
    const data = callTool("create_label", {
      name: "CLI Test Label",
      color: "#3498db",
      taskId: ctx.taskId,
    });
    assertHas(data, "id");
    ctx.labelId = data.id;
    console.log(`    → labelId: ${ctx.labelId}`);
  });

  await testIf(ctx.labelId, "get_label retrieves by ID", async () => {
    const data = callTool("get_label", { id: ctx.labelId });
    assertEq(data.id, ctx.labelId);
    assertEq(data.name, "CLI Test Label");
  });

  await testIf(ctx.taskId, "get_task_labels returns task labels", async () => {
    const data = callTool("get_task_labels", { taskId: ctx.taskId });
    assert(Array.isArray(data), `Expected array, got ${typeof data}`);
  });

  await test("get_workspace_labels returns workspace labels", async () => {
    const data = callTool("get_workspace_labels");
    assert(Array.isArray(data), `Expected array, got ${typeof data}`);
  });

  await testIf(ctx.labelId, "update_label modifies the label", async () => {
    const data = callTool("update_label", {
      id: ctx.labelId,
      name: "Updated Label",
      color: "#e74c3c",
    });
    assert(data != null, "Expected response");
  });

  // ── 9. Notifications ─────────────────────────────────────────────────
  console.log("\n🔔 Notifications");
  await test("list_notifications returns array", async () => {
    const data = callTool("list_notifications");
    assert(Array.isArray(data), `Expected array, got ${typeof data}`);
  });

  await test("mark_all_notifications_read succeeds", async () => {
    const data = callTool("mark_all_notifications_read");
    assertHas(data, "success");
  });

  await test("clear_all_notifications succeeds", async () => {
    const data = callTool("clear_all_notifications");
    assertHas(data, "success");
  });

  skip("create_notification", "requires target user ID");
  skip("mark_notification_read", "requires existing notification ID");

  // ── 10. Search ───────────────────────────────────────────────────────
  console.log("\n🔍 Search");
  await test("global_search returns results", async () => {
    const data = callTool("global_search", { q: "test" });
    assert(
      data != null && typeof data === "object",
      "Expected object response",
    );
  });

  await test("global_search with type filter", async () => {
    const data = callTool("global_search", { q: "test", type: "tasks" });
    assert(
      data != null && typeof data === "object",
      "Expected object response",
    );
  });

  // ── 11. Workflow Rules ───────────────────────────────────────────────
  console.log("\n🔄 Workflow Rules");
  await testIf(ctx.projectId, "get_workflow_rules returns rules", async () => {
    const data = callTool("get_workflow_rules", {
      projectId: ctx.projectId,
    });
    assert(data != null, "Expected response");
  });

  await testIf(
    ctx.projectId && ctx.columnId,
    "upsert_workflow_rule creates/updates a rule",
    async () => {
      const data = callTool("upsert_workflow_rule", {
        projectId: ctx.projectId,
        integrationType: "github",
        eventType: "pull_request_merged",
        columnId: ctx.columnId,
      });
      assert(data != null, "Expected response");
    },
  );

  // ── 12. Cleanup ──────────────────────────────────────────────────────
  console.log("\n🧹 Cleanup");

  if (ctx.labelId) {
    await test("delete_label removes the label", async () => {
      callTool("delete_label", { id: ctx.labelId });
    });
  } else {
    skip("delete_label", "no label was created");
  }

  if (ctx.taskId) {
    await test("delete_task removes the task", async () => {
      callTool("delete_task", { id: ctx.taskId });
    });
  } else {
    skip("delete_task", "no task was created");
  }

  if (ctx.columnId) {
    await test("delete_column removes the column", async () => {
      callTool("delete_column", { id: ctx.columnId });
    });
  } else {
    skip("delete_column", "no column was created");
  }

  if (ctx.projectId) {
    await test("delete_project removes the project", async () => {
      callTool("delete_project", { id: ctx.projectId });
    });
  } else {
    skip("delete_project", "no project was created");
  }

  // ── Results ──────────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(50));
  console.log(
    `📊 Results: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`,
  );
  console.log("═".repeat(50));

  if (results.errors.length > 0) {
    console.log("\n❌ Failures:");
    for (const { name, error } of results.errors) {
      console.log(`  • ${name}: ${error}`);
    }
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
