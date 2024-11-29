module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalCommits",
        // parserOpts: {
        //   noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        // },
        releaseRules: [
          { type: "chore", scope: "deps", release: "patch" }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalCommits",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        },
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "perf", section: "Performance Improvements" },
            { type: "revert", section: "Reverts" },
            { type: "docs", section: "Documentation", hidden: false },
            { type: "style", section: "Styles", hidden: false },
            { type: "chore", section: "Dependency Updates", hidden: false },
            { type: "refactor", section: "Code Refactors", hidden: false },
            { type: "test", section: "Tests", hidden: false },
            { type: "build", section: "Build System", hidden: false },
            { type: "ci", section: "CI/CD", hidden: false },
            { type: "improvement", section: "Improvements", hidden: false }
          ]
        },
        writerOpts: {
          commitsSort: ["subject", "scope"]
        }
      }
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: false
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    ["@semantic-release/exec", {
      // "verifyConditionsCmd": "./verify.sh",
      "publishCmd": "npm run archive ${nextRelease.version}"
    }],
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "archive/archive.zip", label: "Distribution ZIP" },
        ],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "package.json"
        ]
      }
    ]
  ]
};