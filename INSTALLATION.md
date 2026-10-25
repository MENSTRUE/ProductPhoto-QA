# Applying this documentation package (no automatic commit)

The ZIP is meant to be extracted/merged into your existing repository root `ProductPhoto QA/`. Only Markdown documentation files are included. It intentionally does **not** overwrite model, Python, React, trained outputs, notebook, plots, LICENSE or `.gitignore`.

1. Back up edited READMEs and review differences before overwriting.
2. Extract the ZIP so root `README.md`, `AGENTS.md` and `docs/{id,en}/...` are in existing repository, not in an extra nested directory.
3. Run `git status --short` / `git diff -- README.md docs`.
4. Open README in VS Code Markdown Preview; inspect plot embeds and links.
5. Optionally run backend `pytest -q`, frontend `npm run build` and CLI as documented; report output.
6. **Do not automatically commit or push**. The repository owner decides all commit actions and messages.

Audit note: the documentation was authored against GitHub main repository tree. Your local tree may include more recent changes, particularly `ml/inference/__init__.py` lazy-import fix; review diff rather than overwrite local implementation.
