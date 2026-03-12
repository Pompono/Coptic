from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from typing import Any

import numpy as np
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


SAHIDIC_TAG = "з"

GENERATION_KWARGS = {
    "max_new_tokens": 128,
    "min_new_tokens": 1,
    "early_stopping": True,
    "num_beams": 5,
    "output_scores": True,
    "return_dict_in_generate": True,
}

GREEK_TO_COPTIC = {
    "α": "ⲁ",
    "β": "ⲃ",
    "γ": "ⲅ",
    "δ": "ⲇ",
    "ε": "ⲉ",
    "ϛ": "ⲋ",
    "ζ": "ⲍ",
    "η": "ⲏ",
    "θ": "ⲑ",
    "ι": "ⲓ",
    "κ": "ⲕ",
    "λ": "ⲗ",
    "μ": "ⲙ",
    "ν": "ⲛ",
    "ξ": "ⲝ",
    "ο": "ⲟ",
    "π": "ⲡ",
    "ρ": "ⲣ",
    "σ": "ⲥ",
    "ς": "ⲥ",
    "ϲ": "ⲥ",
    "τ": "ⲧ",
    "υ": "ⲩ",
    "φ": "ⲫ",
    "χ": "ⲭ",
    "ψ": "ⲯ",
    "ω": "ⲱ",
    "s": "ϣ",
    "f": "ϥ",
    "k": "ϧ",
    "h": "ϩ",
    "j": "ϫ",
    "c": "ϭ",
    "t": "ϯ",
}

GREEK_TO_COPTIC.update({k.upper(): v.upper() for k, v in list(GREEK_TO_COPTIC.items()) if k.isalpha()})


class TranslatorError(RuntimeError):
    """Base translator error."""


class TranslatorInputError(TranslatorError):
    """Raised when user input is invalid."""


class TranslatorLoadError(TranslatorError):
    """Raised when model/tokenizer load fails."""


class TranslatorRuntimeError(TranslatorError):
    """Raised when generation fails."""


@dataclass(frozen=True)
class ProcessedInput:
    dialect: str
    tagged_text: str


def normalize_dialect(dialect: str | None) -> str:
    d = (dialect or "").strip().lower()
    if d in {"bohairic", "boh", "b"}:
        return "bohairic"
    if d in {"sahidic", "sah", "s"}:
        return "sahidic"
    if d == "":
        return "bohairic"
    raise TranslatorInputError("dialect must be one of: sahidic, bohairic")


def copticify(text: str) -> str:
    return "".join(GREEK_TO_COPTIC.get(ch, ch) for ch in text)


class EnglishCopticTranslator:
    def __init__(self, model_name: str = "megalaa/english-coptic-translator") -> None:
        try:
            self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        except Exception as exc:  # noqa: BLE001
            raise TranslatorLoadError(f"failed to load model '{model_name}': {exc}") from exc

    def _prepare(self, text: str, dialect: str) -> ProcessedInput:
        normalized_input = (text or "").strip().lower()
        if not normalized_input:
            raise TranslatorInputError("text must not be empty")

        if dialect == "sahidic":
            return ProcessedInput(dialect="sahidic", tagged_text=f"{SAHIDIC_TAG} {normalized_input}")
        return ProcessedInput(dialect="bohairic", tagged_text=normalized_input)

    def translate(
        self,
        text: str,
        dialect: str = "bohairic",
        include_confidence: bool = False,
    ) -> dict[str, Any]:
        normalized_dialect = normalize_dialect(dialect)
        processed = self._prepare(text=text, dialect=normalized_dialect)

        try:
            input_tensors = self.tokenizer.encode(processed.tagged_text, return_tensors="pt")
            outputs = self.model.generate(
                input_tensors[:, : self.tokenizer.model_max_length],
                **GENERATION_KWARGS,
            )
            decoded = self.tokenizer.decode(outputs.sequences[0], skip_special_tokens=True).strip()
            translation = copticify(decoded)
        except Exception as exc:  # noqa: BLE001
            raise TranslatorRuntimeError(f"translation failed: {exc}") from exc

        response: dict[str, Any] = {
            "translation": translation,
            "dialect": processed.dialect,
        }

        if include_confidence:
            scores = outputs.scores
            confidences = [torch.softmax(score, dim=-1).max().item() for score in scores]
            num_words = max(1, len(translation.split()))
            scaled_probability = np.exp(sum(np.log(confidences)) / num_words)
            response["confidence"] = float(scaled_probability)

        return response


@lru_cache(maxsize=2)
def get_translator(model_name: str = "megalaa/english-coptic-translator") -> EnglishCopticTranslator:
    return EnglishCopticTranslator(model_name=model_name)