// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { ensureExecutable } = require("./install");

if (process.platform === "win32") {
  console.log("skipping POSIX executable permission tests on win32");
} else {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ocr-install-test-"));
  const binary = path.join(dir, "opencodereview");

  try {
    fs.writeFileSync(binary, "test binary", { mode: 0o644 });
    ensureExecutable(binary);

    const mode = fs.statSync(binary).mode & 0o777;
    assert.strictEqual(mode, 0o755, "installer must restore executable permissions");

    assert.throws(
      () => ensureExecutable(path.join(dir, "missing-binary")),
      /ENOENT/,
      "installer must fail when it cannot repair the platform binary"
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  console.log("installer executable permission tests passed");
}
