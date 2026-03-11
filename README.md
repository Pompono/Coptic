# Coptic

## English → Coptic translator integration

This app can proxy translation requests to the Coptic NMT backend.

### 1) Run the backend
Set up and run the backend from:
- https://github.com/Coptic-NMT/coptic-translator-backend

### 2) Configure this frontend
Create `.env.local` with:

```bash
COPTIC_TRANSLATOR_BACKEND_URL=http://localhost:8000/translate
```

> Use the backend endpoint that accepts `POST` JSON payloads like `{ "text": "..." }`.

### 3) Use it in the Dictionary page
Open `/dictionary`, enter English text in **English → Coptic translator (experimental)**, then click **Translate**.
The top translation is copied into dictionary search, and all returned candidates are shown as quick chips.