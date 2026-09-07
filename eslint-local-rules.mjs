/**
 * SYCONIA local ESLint rules — G-8 design-system lint seam (CI-CD.md §4).
 * Registered as the "syconia" plugin in eslint.config.mjs; verified against
 * the deliberate fixtures in tests/lint-fixtures/ by scripts/ci/lint-rules-check.sh.
 */

const HEX_COLOR = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

const rules = {
  "no-raw-hex": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Colors are token-only (AGENT law 6 / G-8): raw hex literals are banned outside the token layer (/app/styles/tokens.css per DESIGN-SYSTEM §13).",
      },
      schema: [
        {
          type: "object",
          properties: {
            allowedFiles: {
              type: "array",
              items: { type: "string" },
            },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        rawHex:
          "Raw hex color '{{hex}}' — use the design-token layer (DESIGN-SYSTEM §4/§13; G-8).",
      },
    },
    create(context) {
      const options = context.options[0] ?? {};
      const allowedFiles = options.allowedFiles ?? [];
      const filename = context.filename ?? "";
      const exempt = allowedFiles.some(
        (suffix) => typeof suffix === "string" && suffix.length > 0 && filename.endsWith(suffix),
      );
      if (exempt) {
        return {};
      }
      function checkValue(node, value) {
        if (typeof value !== "string") {
          return;
        }
        for (const hex of value.match(HEX_COLOR) ?? []) {
          context.report({ node, messageId: "rawHex", data: { hex } });
        }
      }
      return {
        Literal(node) {
          checkValue(node, node.value);
        },
        TemplateLiteral(node) {
          for (const quasi of node.quasis) {
            checkValue(quasi, quasi.value.cooked);
          }
        },
      };
    },
  },
  "no-dangerously-set-inner-html": {
    meta: {
      type: "problem",
      docs: {
        description:
          "dangerouslySetInnerHTML is forbidden (AGENT §8): source text renders as React text nodes; the strict sanitizer covers the rare rich field (ARCHITECTURE §10).",
      },
      schema: [],
      messages: {
        banned:
          "dangerouslySetInnerHTML is forbidden — render text nodes or the sanctioned sanitizer path (AGENT §8; ARCHITECTURE §10).",
      },
    },
    create(context) {
      return {
        JSXAttribute(node) {
          if (
            node.name &&
            node.name.type === "JSXIdentifier" &&
            node.name.name === "dangerouslySetInnerHTML"
          ) {
            context.report({ node, messageId: "banned" });
          }
        },
      };
    },
  },
};

const syconiaPlugin = { rules };

export default syconiaPlugin;
