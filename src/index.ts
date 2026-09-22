const releaseDMGURL = "https://github.com/tubasasakunn/vela/releases/latest/download/Vela-latest.dmg";
const downloadURL = "/download";
import { page, demoScript } from "./landing";

const setupMarkdown = `# Vela setup guide

Vela is a native macOS control surface for launching commands, searching clipboard history, controlling windows, and expanding snippets.

Its behavior is defined in one local JavaScript configuration file.

This guide is the canonical first-run procedure for people and AI assistants.

## Prerequisites

- macOS 14 or later on Apple silicon.
- Install the Apple-notarized DMG from [the latest Vela release](${downloadURL}), then open Vela from the DMG.

  Vela moves itself to Applications, relaunches, and opens the AI-guided setup.

  Homebrew is also supported:

  \`\`\`sh
  brew install tubasasakunn/tap/vela
  \`\`\`

## First-time setup

An AI assistant must keep the user in control of macOS permission dialogs.

The assistant can open the appropriate System Settings page and check the result.

Only the user can turn on a privacy permission or press an Apple permission button.

Do not claim that a permission is granted until the status check confirms it.

### 1. Choose and initialize the configuration folder

Ask the person where they want Vela's configuration folder.

Use \`~/.config/vela\` when they have no preference.

Run the helper from the installed app.

The directory argument must be an absolute path.

   \`\`\`sh
   /Applications/Vela.app/Contents/Helpers/vela init --directory "<configuration-folder>"
   \`\`\`


Do not propose or edit settings until this command finishes.

It creates, or preserves, \`vela.js\`, \`AGENT.md\`, and \`.agent/skills/vela-configuration/\` in the configuration folder.

### 2. Grant permissions before configuring behavior

First, inspect the current state.

\`\`\`sh
/Applications/Vela.app/Contents/Helpers/vela permissions status
\`\`\`

Request each missing permission in this order: **Accessibility**, **Input Monitoring**, **Screen Recording**, then **Notifications**.

For every missing permission, follow the same conversation.

1. Explain the capability it enables.
2. Ask the person to confirm they are ready to grant it.
3. Request only that permission.
4. Tell the person which Vela switch to turn on, or which Apple dialog button to press.
5. Wait for the person to say that they have finished.
6. Run the status command again and continue only when it reports the permission as granted.

Use the command with the exact permission name.

\`\`\`sh
/Applications/Vela.app/Contents/Helpers/vela permissions request accessibility
/Applications/Vela.app/Contents/Helpers/vela permissions request input-monitoring
/Applications/Vela.app/Contents/Helpers/vela permissions request screen-recording
/Applications/Vela.app/Contents/Helpers/vela permissions request notifications
\`\`\`

Do not use \`vela permissions setup\` for AI-guided first-run setup.

It can proceed through every missing permission without giving the assistant a chance to explain the next request.

If macOS does not present a prompt, open only the relevant settings page instead.

\`\`\`sh
/Applications/Vela.app/Contents/Helpers/vela permissions open <name>
\`\`\`

Use clear, single-step language such as:

> Vela needs Accessibility permission before it can move or resize windows.
> System Settings is open now.
> Turn on Vela, approve the macOS dialog if it appears, then tell me when that is done.

The user should not have to infer which switch to use or whether the assistant has already verified it.

### 3. Read the generated guidance

Before suggesting a configuration, read \`AGENT.md\`, \`.agent/skills/vela-configuration/SKILL.md\`, and \`references/vela-js-api.md\` inside that skill.

If the assistant cannot access the folder, ask the person to attach those files to the conversation.

### 4. Learn the person's workflow and propose settings

Ask about the following workflows before writing \`vela.js\`.

- Frequently opened apps, folders, and web pages.
- Desired shortcuts and window actions.
- Fixed text such as signatures, addresses, and reply templates.
- **Screen text capture**: whether the person wants to select an area of the screen, recognize its text, and copy the result to the clipboard.

  Ask for a shortcut if they do.

  This needs Screen Recording permission.
- **Context-aware paste**: whether the person wants Vela to offer a saved value when it recognizes the accessible label or description of a focused form field.

  Ask which concrete values to offer, such as a work address or a billing name, and which fields should match them.

  Vela never fills a field without the person's action.

  It ranks candidates for the focused field, and the person chooses one to paste.

  Secure text fields are excluded.

Do not reduce this to a generic question about snippets.

Screen text capture and context-aware paste solve different problems and should be discussed separately.

Explain the proposed changes and any possible shortcut conflicts.

Obtain confirmation before editing \`vela.js\`.

### 5. Validate, activate, and try the approved settings

Validate and activate the approved configuration.

   \`\`\`sh
   /Applications/Vela.app/Contents/Helpers/vela check
   /Applications/Vela.app/Contents/Helpers/vela reload
   \`\`\`

Ask the person to try one configured shortcut or window action.

When screen text capture or context-aware paste was configured, ask the person to try that specific workflow too.

If it does not work, inspect the relevant permission status before changing the configuration.

## Safety and scope

- Keep settings in \`vela.js\`; Vela validates them before the running app adopts
  them.
- Use only the documented Vela API in the generated configuration skill.
- Do not add filesystem, network, or environment access to the configuration.
- Preserve existing user settings unless the person explicitly asks to change
  them.
`;

const llmText = `# Vela

Vela is a native macOS control surface configured through a local JavaScript file.

It provides a launcher, clipboard history, snippets, global hotkeys, and window actions.

It can also recognize text from a selected screen area and copy it to the clipboard, or rank saved paste candidates from the focused field's accessible context.

Vela has no account, telemetry, or advertising SDKs.

## Setup

- [Canonical LLM setup guide](/setup.md): installation, initialization, one-at-a-time permissions, generated configuration instructions, validation, and activation.
- [Latest notarized download](${downloadURL})
- [Source and release history](https://github.com/tubasasakunn/vela)

## Assistant behavior

Read the setup guide before changing a Vela configuration.

Initialize first.

Before asking about shortcuts or editing settings, request each missing macOS permission individually in the documented order.

Explain why the next permission is needed, ask the user to approve it, wait for their acknowledgement, then run \`vela permissions status\` to verify it.

Never claim a permission is granted without that verification.

Read the generated AGENT.md and Vela configuration skill after initialization.

Ask about the user's workflow, explain proposed shortcuts and conflicts, and get confirmation before editing.

The workflow interview must explicitly cover screen text capture and context-aware paste, separately from fixed-text snippets.

Explain that text capture needs Screen Recording permission and that context-aware paste offers a user-selected candidate rather than filling a field automatically.

Finish with \`vela check\`, \`vela reload\`, and one real shortcut or window-action check.
`;

export default {
  fetch(request): Response {
    const url = new URL(request.url);
    if (url.pathname === "/demo.js") {
      return new Response(demoScript, {
        headers: {
          "content-type": "text/javascript; charset=UTF-8",
          "cache-control": "public, max-age=300",
          "x-content-type-options": "nosniff",
        },
      });
    }
    if (url.pathname === downloadURL) {
      return Response.redirect(releaseDMGURL, 302);
    }
    if (url.pathname === "/setup") {
      return Response.redirect(new URL("/setup.md", url).toString(), 308);
    }
    if (url.pathname === "/setup.md") {
      return new Response(setupMarkdown, {
        headers: {
          "content-type": "text/markdown; charset=UTF-8",
          "cache-control": "public, max-age=300",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
          "x-frame-options": "DENY",
        },
      });
    }
    if (url.pathname === "/llm.txt" || url.pathname === "/llms.txt") {
      return new Response(llmText, {
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "public, max-age=300",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
          "x-frame-options": "DENY",
        },
      });
    }
    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin",
        "x-frame-options": "DENY",
      },
    });
  },
} satisfies ExportedHandler;
