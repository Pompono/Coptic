# Coptic

## Coptic → English translator integration

The app now runs the Hugging Face model `megalaa/coptic-english-translator` locally through a Python CLI wrapper that preserves the model repo's required preprocessing logic (greekify + dialect tag).

### 1) Python dependencies

Install translator dependencies in your environment:

```bash
pip install torch transformers numpy
```

### 2) Optional environment variables

Create `.env.local` (optional):

```bash
# Python executable used by app/api/translate/route.ts
COPTIC_TRANSLATOR_PYTHON_BIN=python3

# Default dialect used when request body omits "dialect"
# values: sahidic | bohairic
COPTIC_TRANSLATOR_DEFAULT_DIALECT=bohairic
```

> Set `COPTIC_TRANSLATOR_DEFAULT_DIALECT=bohairic` to make in-app translation assume Bohairic by default.

### 3) Use in the Dictionary page

Open `/dictionary`, enter **Coptic** text in the translator box, and click **Translate**.

The top translation is copied into dictionary search.

### 4) Run translator from CLI directly

```bash
python3 translator/cli.py "ⲡⲉⲛⲛⲟⲩϯ" --dialect bohairic --include-confidence
```

Example JSON output:

```json
{
  "translation": "Our God.",
  "confidence": 0.61,
  "dialect": "bohairic"
}
```