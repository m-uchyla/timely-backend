// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      "eslint.config.mjs",
      "dist/**",
      "lib/**",
      "**/*.js",
      "node_modules*",
      "*.svg",
      "*.ico",
      "*.json",
      ".gitignore",
      "*.md",
      "*.log",
      "*.lock",
      '**/*.template.ts'
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      perfectionist,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // override from eslint:recommended
      "constructor-super": "off",
      "no-constant-condition": "off",
      "no-control-regex": "off",
      "no-unused-vars": "off",

      // other rules from eslint:recommended
      "array-callback-return": "error",
      "no-constructor-return": "error",
      "no-inner-declarations": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "require-atomic-updates": "error",
      curly: "error",
      "default-case-last": "error",
      eqeqeq: "error",
      "grouped-accessor-pairs": "error",
      "id-match": ["error", "^[a-zA-Z0-9_$:]+$"],
      "max-classes-per-file": ["error", 1],
      "no-array-constructor": "error",
      "no-else-return": "error",
      "no-eval": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-implicit-coercion": "error",
      "no-implied-eval": "error",
      "no-lone-blocks": "error",
      "no-lonely-if": "error",
      "no-multi-assign": "error",
      "no-multi-str": "error",
      "no-nested-ternary": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-object-constructor": "error",
      "no-param-reassign": "error",
      "no-return-assign": ["error", "always"],
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unneeded-ternary": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "no-void": "warn",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-regex-literals": "error",
      "prefer-rest-params": "error",
      "prefer-template": "error",
      yoda: "error",

      // override from @typescript-eslint/recommended
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "_", // ignore local variables with _ in the name
          argsIgnorePattern: "_", // ignore arguments with _ in the name
          ignoreRestSiblings: true, // allow destructuring to omit properties
          caughtErrors: "all", // require using error argument
        },
      ],
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/require-await": "warn",

      // override from @typescript-eslint/strict
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-type-arguments": "warn",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",

      // override from @typescript-eslint/stylistic
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as" },
      ],
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/dot-notation": [
        "error",
        {
          allowPrivateClassPropertyAccess: true,
          allowProtectedClassPropertyAccess: true,
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // other rules from @typescript-eslint
      "default-param-last": "off",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          overrides: { constructors: "no-public" }, // don't require public access modifier on a constructor
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "max-params": "off",
      "@typescript-eslint/max-params": 'warn',
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "no-loop-func": "off",
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-require-imports": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/prefer-find": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "no-return-await": "off",
      "@typescript-eslint/return-await": "error",

      // override from prettier/recommended
      "prettier/prettier": [
        "error",
        {
          semi: true,
          tabWidth: 2,
          arrowParens: "always",
          printWidth: 100,
          singleQuote: true,
          trailingComma: "all",
        },
      ],

      // perfectionist plugin
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          "internalPattern": ["@.+/.+"],
          groups: [
            "external",
            "internal",
            "builtin",
            "parent",
            "sibling",
            "external-type",
            "internal-type",
            "builtin-type",
            "parent-type",
            "sibling-type",
            "unknown",
          ],
          "newlinesBetween": "never",
        },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-exports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-array-includes": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
    },
  },
);