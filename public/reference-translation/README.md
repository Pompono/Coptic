# Published Coptic translation data

`bohairic.json` contains selected Coptic/English rows from the Tasbeha splits of
the [Coptic Corpora dataset](https://huggingface.co/datasets/megalaa/coptic-corpora)
by megalaa. The dataset is licensed under
[Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).

The application uses exact whole-passage matching after normalizing case,
spacing, punctuation, and combining marks. It does not guess missing letters,
use fuzzy matching, or produce new translations. The result shows the matched
source text and corpus row identifier. The bundled corpus contains duplicate and
competing source rows; ambiguous rows are excluded unless a source row was
explicitly selected. This is reference retrieval, not a guarantee that every
corpus rendering is authoritative.

Source dataset revision, row identifiers, and selected-row provenance are kept
in the bundled JSON. The lookup implementation is in `lib/localTranslation/reference.mjs`.
