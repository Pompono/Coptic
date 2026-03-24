export type LessonAudioEntry = {
  id: string;
  fallbackText: string;
  src?: string;
};

const sharedLessonAudio: Record<string, LessonAudioEntry> = {
  a: {
    id: "a",
    fallbackText: "a",
    src: "/audio/learn/shared/a.wav",
  },
  "\u2C81": {
    id: "\u2C81",
    fallbackText: "a",
    src: "/audio/learn/shared/a.wav",
  },
  dha: {
    id: "dha",
    fallbackText: "dha",
    src: "/audio/learn/shared/dha.wav",
  },
  "\u2C87\u2C81": {
    id: "\u2C87\u2C81",
    fallbackText: "dha",
    src: "/audio/learn/shared/dha.wav",
  },
  dho: {
    id: "dho",
    fallbackText: "dho",
    src: "/audio/learn/shared/dho.wav",
  },
  "\u2C87\u2C9F": {
    id: "\u2C87\u2C9F",
    fallbackText: "dho",
    src: "/audio/learn/shared/dho.wav",
  },
  dhad: {
    id: "dhad",
    fallbackText: "dhad",
    src: "/audio/learn/shared/dhad.wav",
  },
  "\u2C87\u2C81\u2C87": {
    id: "\u2C87\u2C81\u2C87",
    fallbackText: "dhad",
    src: "/audio/learn/shared/dhad.wav",
  },
  dhod: {
    id: "dhod",
    fallbackText: "dhod",
    src: "/audio/learn/shared/dhod.wav",
  },
  "\u2C87\u2C9F\u2C87": {
    id: "\u2C87\u2C9F\u2C87",
    fallbackText: "dhod",
    src: "/audio/learn/shared/dhod.wav",
  },
  o: {
    id: "o",
    fallbackText: "o",
    src: "/audio/learn/shared/o.wav",
  },
  "\u2C9F": {
    id: "\u2C9F",
    fallbackText: "o",
    src: "/audio/learn/shared/o.wav",
  },
  oh: {
    id: "oh",
    fallbackText: "oh",
    src: "/audio/learn/shared/oh.mp3",
  },
  "\u2C71": {
    id: "\u2C71",
    fallbackText: "oh",
    src: "/audio/learn/shared/oh.mp3",
  },
  za: {
    id: "za",
    fallbackText: "za",
    src: "/audio/learn/shared/za.wav",
  },
  "â²â²": {
    id: "â²â²",
    fallbackText: "za",
    src: "/audio/learn/shared/za.wav",
  },
  zi: {
    id: "zi",
    fallbackText: "zi",
    src: "/audio/learn/shared/zi.wav",
  },
  "â²â²“": {
    id: "â²â²“",
    fallbackText: "zi",
    src: "/audio/learn/shared/zi.wav",
  },
  dhi: {
    id: "dhi",
    fallbackText: "dhi",
    src: "/audio/learn/shared/dhi.wav",
  },
  "â²‡â²“": {
    id: "â²‡â²“",
    fallbackText: "dhi",
    src: "/audio/learn/shared/dhi.wav",
  },
  di: {
    id: "di",
    fallbackText: "dhi",
    src: "/audio/learn/shared/dhi.wav",
  },
  i: {
    id: "i",
    fallbackText: "i",
    src: "/audio/learn/shared/i.wav",
  },
  "â²“": {
    id: "â²“",
    fallbackText: "i",
    src: "/audio/learn/shared/i.wav",
  },
  zod: {
    id: "zod",
    fallbackText: "zod",
    src: "/audio/learn/shared/zod.wav",
  },
  "â²â²Ÿâ²‡": {
    id: "â²â²Ÿâ²‡",
    fallbackText: "zod",
    src: "/audio/learn/shared/zod.wav",
  },
  zud: {
    id: "zud",
    fallbackText: "zod",
    src: "/audio/learn/shared/zod.wav",
  },
  zo: {
    id: "zo",
    fallbackText: "zo",
    src: "/audio/learn/shared/zo.wav",
  },
  ro: {
    id: "ro",
    fallbackText: "ro",
    src: "/audio/learn/shared/ro.wav",
  },
  rod: {
    id: "rod",
    fallbackText: "rod",
    src: "/audio/learn/shared/rod.wav",
  },
  ra: {
    id: "ra",
    fallbackText: "ra",
    src: "/audio/learn/shared/ra.wav",
  },
  "\u2CA3\u2C81": {
    id: "\u2CA3\u2C81",
    fallbackText: "ra",
    src: "/audio/learn/shared/ra.wav",
  },
  ri: {
    id: "ri",
    fallbackText: "ri",
    src: "/audio/learn/shared/ri.wav",
  },
  "\u2CA3\u2C93": {
    id: "\u2CA3\u2C93",
    fallbackText: "ri",
    src: "/audio/learn/shared/ri.wav",
  },
  oowa: {
    id: "oowa",
    fallbackText: "ouwa",
    src: "/audio/learn/shared/oowa.wav",
  },
  ouwa: {
    id: "ouwa",
    fallbackText: "ouwa",
    src: "/audio/learn/shared/oowa.wav",
  },
  ou: {
    id: "ou",
    fallbackText: "ou",
    src: "/audio/learn/shared/oo.wav",
  },
  oo: {
    id: "oo",
    fallbackText: "ou",
    src: "/audio/learn/shared/oo.wav",
  },
  daa: {
    id: "daa",
    fallbackText: "daa",
  },
  daad: {
    id: "daad",
    fallbackText: "daad",
  },
  ouwi: {
    id: "ouwi",
    fallbackText: "ouwi",
    src: "/audio/learn/shared/oowi.wav",
  },
  ya: {
    id: "ya",
    fallbackText: "ya",
    src: "/audio/learn/shared/ya.wav",
  },
  rav: {
    id: "rav",
    fallbackText: "rav",
    src: "/audio/learn/shared/rav.wav",
  },
  rai: {
    id: "rai",
    fallbackText: "rai",
    src: "/audio/learn/shared/rai.wav",
  },
  dhou: {
    id: "dhou",
    fallbackText: "dhou",
    src: "/audio/learn/shared/dhou.wav",
  },
  "\u2C87\u2C9F\u2CA9": {
    id: "\u2C87\u2C9F\u2CA9",
    fallbackText: "dhou",
    src: "/audio/learn/shared/dhou.wav",
  },
  dhoud: {
    id: "dhoud",
    fallbackText: "dhoud",
    src: "/audio/learn/shared/dhoud.wav",
  },
  "\u2C87\u2C9F\u2CA9\u2C87": {
    id: "\u2C87\u2C9F\u2CA9\u2C87",
    fallbackText: "dhoud",
    src: "/audio/learn/shared/dhoud.wav",
  },
  zar: {
    id: "zar",
    fallbackText: "zar",
    src: "/audio/learn/shared/zar.wav",
  },
  "\u2C8D\u2C81\u2CA3": {
    id: "\u2C8D\u2C81\u2CA3",
    fallbackText: "zar",
    src: "/audio/learn/shared/zar.wav",
  },
  "\u2CA3\u2C9F\u2C87": {
    id: "\u2CA3\u2C9F\u2C87",
    fallbackText: "rod",
    src: "/audio/learn/shared/rod.wav",
  },
  ee: {
    id: "ee",
    fallbackText: "ee",
    src: "/audio/learn/shared/ee.wav",
  },
  e: {
    id: "e",
    fallbackText: "e",
    src: "/audio/learn/shared/e.wav",
  },
  "\u2C89": {
    id: "\u2C89",
    fallbackText: "e",
    src: "/audio/learn/shared/e.wav",
  },
  "\u2C8F": {
    id: "\u2C8F",
    fallbackText: "ee",
    src: "/audio/learn/shared/ee.wav",
  },
  vee: {
    id: "vee",
    fallbackText: "vee",
    src: "/audio/learn/shared/vee.wav",
  },
  ve: {
    id: "ve",
    fallbackText: "ve",
    src: "/audio/learn/shared/ve.wav",
  },
  "\u2C83\u2C89": {
    id: "\u2C83\u2C89",
    fallbackText: "ve",
    src: "/audio/learn/shared/ve.wav",
  },
  "\u2C83\u2C8F": {
    id: "\u2C83\u2C8F",
    fallbackText: "vee",
    src: "/audio/learn/shared/vee.wav",
  },
  kee: {
    id: "kee",
    fallbackText: "kee",
    src: "/audio/learn/shared/kee.wav",
  },
  "\u2C95\u2C8F": {
    id: "\u2C95\u2C8F",
    fallbackText: "kee",
    src: "/audio/learn/shared/kee.wav",
  },
  ke: {
    id: "ke",
    fallbackText: "ke",
    src: "/audio/learn/shared/ke.wav",
  },
  "\u2C95\u2C89": {
    id: "\u2C95\u2C89",
    fallbackText: "ke",
    src: "/audio/learn/shared/ke.wav",
  },
  pi: {
    id: "pi",
    fallbackText: "pi",
    src: "/audio/learn/shared/pi.wav",
  },
  "\u2CA1\u2C93": {
    id: "\u2CA1\u2C93",
    fallbackText: "pi",
    src: "/audio/learn/shared/pi.wav",
  },
  pa: {
    id: "pa",
    fallbackText: "pa",
    src: "/audio/learn/shared/pa.wav",
  },
  "\u2CA1\u2C81": {
    id: "\u2CA1\u2C81",
    fallbackText: "pa",
    src: "/audio/learn/shared/pa.wav",
  },
  pod: {
    id: "pod",
    fallbackText: "pod",
    src: "/audio/learn/shared/pod.wav",
  },
  "\u2CA1\u2C9F\u2C87": {
    id: "\u2CA1\u2C9F\u2C87",
    fallbackText: "pod",
    src: "/audio/learn/shared/pod.wav",
  },
  vi: {
    id: "vi",
    fallbackText: "vi",
    src: "/audio/learn/shared/vi.wav",
  },
  "\u2C83\u2C93": {
    id: "\u2C83\u2C93",
    fallbackText: "vi",
    src: "/audio/learn/shared/vi.wav",
  },
  po: {
    id: "po",
    fallbackText: "po",
    src: "/audio/learn/shared/po.wav",
  },
  "\u2CA1\u2C9F": {
    id: "\u2CA1\u2C9F",
    fallbackText: "po",
    src: "/audio/learn/shared/po.wav",
  },
  ti: {
    id: "ti",
    fallbackText: "ti",
    src: "/audio/learn/shared/ti.wav",
  },
  "\u2CA7\u2C93": {
    id: "\u2CA7\u2C93",
    fallbackText: "ti",
    src: "/audio/learn/shared/ti.wav",
  },
  me: {
    id: "me",
    fallbackText: "me",
    src: "/audio/learn/shared/me.wav",
  },
  ma: {
    id: "ma",
    fallbackText: "ma",
    src: "/audio/learn/shared/ma.mp3",
  },
  "ⲙⲁ": {
    id: "ⲙⲁ",
    fallbackText: "ma",
    src: "/audio/learn/shared/ma.mp3",
  },
  "\u2C99\u2C89": {
    id: "\u2C99\u2C89",
    fallbackText: "me",
    src: "/audio/learn/shared/me.wav",
  },
  tee: {
    id: "tee",
    fallbackText: "tee",
    src: "/audio/learn/shared/tee.wav",
  },
  "\u2CA7\u2C8F": {
    id: "\u2CA7\u2C8F",
    fallbackText: "tee",
    src: "/audio/learn/shared/tee.wav",
  },
  te: {
    id: "te",
    fallbackText: "te",
    src: "/audio/learn/shared/te.wav",
  },
  "\u2CA7\u2C89": {
    id: "\u2CA7\u2C89",
    fallbackText: "te",
    src: "/audio/learn/shared/te.wav",
  },
  mi: {
    id: "mi",
    fallbackText: "mi",
    src: "/audio/learn/shared/mi.wav",
  },
  "\u2C99\u2C93": {
    id: "\u2C99\u2C93",
    fallbackText: "mi",
    src: "/audio/learn/shared/mi.wav",
  },
  "ⲡⲓⲣⲱⲙⲓ": {
    id: "ⲡⲓⲣⲱⲙⲓ",
    fallbackText: "pi romi",
    src: "/audio/learn/shared/piromi.mp3",
  },
  "ⲡⲓⲙⲱⲟⲩ": {
    id: "ⲡⲓⲙⲱⲟⲩ",
    fallbackText: "pi moo oo",
    src: "/audio/learn/shared/pimoou.mp3",
  },
  mina: {
    id: "mina",
    fallbackText: "Mina",
    src: "/audio/learn/shared/mina.mp3",
  },
  "ⲙⲏⲛⲁ": {
    id: "ⲙⲏⲛⲁ",
    fallbackText: "Mina",
    src: "/audio/learn/shared/mina.mp3",
  },
  "Ⲙⲏⲛⲁ": {
    id: "Ⲙⲏⲛⲁ",
    fallbackText: "Mina",
    src: "/audio/learn/shared/mina.mp3",
  },
  mark: {
    id: "mark",
    fallbackText: "Mark",
    src: "/audio/learn/shared/markos.mp3",
  },
  Mark: {
    id: "Mark",
    fallbackText: "Mark",
    src: "/audio/learn/shared/markos.mp3",
  },
  markos: {
    id: "markos",
    fallbackText: "Markos",
    src: "/audio/learn/shared/markos.mp3",
  },
  Markos: {
    id: "Markos",
    fallbackText: "Markos",
    src: "/audio/learn/shared/markos.mp3",
  },
  "ⲙⲁⲣⲕⲟⲥ": {
    id: "ⲙⲁⲣⲕⲟⲥ",
    fallbackText: "Markos",
    src: "/audio/learn/shared/markos.mp3",
  },
  "Ⲙⲁⲣⲕⲟⲥ": {
    id: "Ⲙⲁⲣⲕⲟⲥ",
    fallbackText: "Markos",
    src: "/audio/learn/shared/markos.mp3",
  },
  nai: {
    id: "nai",
    fallbackText: "nai",
  },
  "ⲛⲁⲓ": {
    id: "ⲛⲁⲓ",
    fallbackText: "nai",
  },
  pia: {
    id: "pia",
    fallbackText: "pia",
  },
  "ⲡⲓⲁ": {
    id: "ⲡⲓⲁ",
    fallbackText: "pia",
  },
  ria: {
    id: "ria",
    fallbackText: "ria",
    src: "/audio/learn/shared/ria.mp3",
  },
  "ⲣⲓⲁ": {
    id: "ⲣⲓⲁ",
    fallbackText: "ria",
    src: "/audio/learn/shared/ria.mp3",
  },
  anna: {
    id: "anna",
    fallbackText: "Anna",
    src: "/audio/learn/shared/anna.mp3",
  },
  Anna: {
    id: "Anna",
    fallbackText: "Anna",
    src: "/audio/learn/shared/anna.mp3",
  },
  "ⲁⲛⲛⲁ": {
    id: "ⲁⲛⲛⲁ",
    fallbackText: "Anna",
    src: "/audio/learn/shared/anna.mp3",
  },
  "Ⲁⲛⲛⲁ": {
    id: "Ⲁⲛⲛⲁ",
    fallbackText: "Anna",
    src: "/audio/learn/shared/anna.mp3",
  },
  "se Anna": {
    id: "se Anna",
    fallbackText: "se Anna",
    src: "/audio/learn/shared/se-anna.mp3",
  },
  "Ⲥⲉ Ⲁⲛⲛⲁ": {
    id: "Ⲥⲉ Ⲁⲛⲛⲁ",
    fallbackText: "se Anna",
    src: "/audio/learn/shared/se-anna.mp3",
  },
  "Ⲙⲁⲣⲓⲁ": {
    id: "Ⲙⲁⲣⲓⲁ",
    fallbackText: "Maria",
  },
  "ⲛⲁⲓ, Ⲁⲛⲛⲁ": {
    id: "ⲛⲁⲓ, Ⲁⲛⲛⲁ",
    fallbackText: "nai Anna",
  },
  "ⲛⲁⲓ, Ⲙⲁⲣⲓⲁ": {
    id: "ⲛⲁⲓ, Ⲙⲁⲣⲓⲁ",
    fallbackText: "nai Maria",
  },
  "Ⲁⲛⲛⲁ ⲛⲉⲙ Ⲙⲁⲣⲕⲟⲥ": {
    id: "Ⲁⲛⲛⲁ ⲛⲉⲙ Ⲙⲁⲣⲕⲟⲥ",
    fallbackText: "Anna nem Markos",
  },
  "ⲡⲓ ⲙⲓⲛⲓ ⲙⲁⲣⲕⲉⲧ": {
    id: "ⲡⲓ ⲙⲓⲛⲓ ⲙⲁⲣⲕⲉⲧ",
    fallbackText: "pi mini market",
  },
  "ⲡⲓ ⲙⲟⲟⲩ": {
    id: "ⲡⲓ ⲙⲟⲟⲩ",
    fallbackText: "pi mou",
  },
  mee: {
    id: "mee",
    fallbackText: "mee",
    src: "/audio/learn/shared/mee.wav",
  },
  "\u2C99\u2C8F": {
    id: "\u2C99\u2C8F",
    fallbackText: "mee",
    src: "/audio/learn/shared/mee.wav",
  },
  la: {
    id: "la",
    fallbackText: "la",
    src: "/audio/learn/shared/la.wav",
  },
  "\u2C97\u2C81": {
    id: "\u2C97\u2C81",
    fallbackText: "la",
    src: "/audio/learn/shared/la.wav",
  },
  ni: {
    id: "ni",
    fallbackText: "ni",
    src: "/audio/learn/shared/ni.wav",
  },
  "\u2C9B\u2C93": {
    id: "\u2C9B\u2C93",
    fallbackText: "ni",
    src: "/audio/learn/shared/ni.wav",
  },
  le: {
    id: "le",
    fallbackText: "le",
    src: "/audio/learn/shared/le.wav",
  },
  "\u2C97\u2C89": {
    id: "\u2C97\u2C89",
    fallbackText: "le",
    src: "/audio/learn/shared/le.wav",
  },
  na: {
    id: "na",
    fallbackText: "na",
    src: "/audio/learn/shared/na.wav",
  },
  "\u2C9B\u2C81": {
    id: "\u2C9B\u2C81",
    fallbackText: "na",
    src: "/audio/learn/shared/na.wav",
  },
  li: {
    id: "li",
    fallbackText: "li",
    src: "/audio/learn/shared/li.wav",
  },
  "\u2C97\u2C93": {
    id: "\u2C97\u2C93",
    fallbackText: "li",
    src: "/audio/learn/shared/li.wav",
  },
  ne: {
    id: "ne",
    fallbackText: "ne",
    src: "/audio/learn/shared/ne.wav",
  },
  "\u2C9B\u2C89": {
    id: "\u2C9B\u2C89",
    fallbackText: "ne",
    src: "/audio/learn/shared/ne.wav",
  },
  gha: {
    id: "gha",
    fallbackText: "gha",
    src: "/audio/learn/shared/gha.wav",
  },
  "\u2C85\u2C81": {
    id: "\u2C85\u2C81",
    fallbackText: "gha",
    src: "/audio/learn/shared/gha.wav",
  },
  sa: {
    id: "sa",
    fallbackText: "sa",
    src: "/audio/learn/shared/sa.wav",
  },
  "\u2CA5\u2C81": {
    id: "\u2CA5\u2C81",
    fallbackText: "sa",
    src: "/audio/learn/shared/sa.wav",
  },
  sha: {
    id: "sha",
    fallbackText: "sha",
    src: "/audio/learn/shared/sha.mp3",
  },
  "ϣⲁ": {
    id: "ϣⲁ",
    fallbackText: "sha",
    src: "/audio/learn/shared/sha.mp3",
  },
  she: {
    id: "she",
    fallbackText: "she",
    src: "/audio/learn/shared/she.mp3",
  },
  "ϣⲉ": {
    id: "ϣⲉ",
    fallbackText: "she",
    src: "/audio/learn/shared/she.mp3",
  },
  shi: {
    id: "shi",
    fallbackText: "shi",
    src: "/audio/learn/shared/shi.mp3",
  },
  "ϣⲓ": {
    id: "ϣⲓ",
    fallbackText: "shi",
    src: "/audio/learn/shared/shi.mp3",
  },
  ksa: {
    id: "ksa",
    fallbackText: "ksa",
    src: "/audio/learn/shared/ksa.mp3",
  },
  "ⲝⲁ": {
    id: "ⲝⲁ",
    fallbackText: "ksa",
    src: "/audio/learn/shared/ksa.mp3",
  },
  ksi: {
    id: "ksi",
    fallbackText: "ksi",
    src: "/audio/learn/shared/ksi.mp3",
  },
  "ⲝⲓ": {
    id: "ⲝⲓ",
    fallbackText: "ksi",
    src: "/audio/learn/shared/ksi.mp3",
  },
  ge: {
    id: "ge",
    fallbackText: "ge",
    src: "/audio/learn/shared/ge.wav",
  },
  ga: {
    id: "ga",
    fallbackText: "ga",
    src: "/audio/learn/shared/ga.wav",
  },
  "ϫⲁ": {
    id: "ϫⲁ",
    fallbackText: "ga",
    src: "/audio/learn/shared/ga-jima.mp3",
  },
  "\u2C85\u2C89": {
    id: "\u2C85\u2C89",
    fallbackText: "ge",
    src: "/audio/learn/shared/ge.wav",
  },
  gi: {
    id: "gi",
    fallbackText: "gi",
    src: "/audio/learn/shared/gee.wav",
  },
  "\u2C85\u2C93": {
    id: "\u2C85\u2C93",
    fallbackText: "gi",
    src: "/audio/learn/shared/gee.wav",
  },
  gee: {
    id: "gee",
    fallbackText: "gee",
    src: "/audio/learn/shared/gee.wav",
  },
  "\u2C85\u2C8F": {
    id: "\u2C85\u2C8F",
    fallbackText: "gee",
    src: "/audio/learn/shared/gee.wav",
  },
  se: {
    id: "se",
    fallbackText: "se",
    src: "/audio/learn/shared/se.wav",
  },
  "\u2CA5\u2C89": {
    id: "\u2CA5\u2C89",
    fallbackText: "se",
    src: "/audio/learn/shared/se.wav",
  },
  si: {
    id: "si",
    fallbackText: "si",
    src: "/audio/learn/shared/si.wav",
  },
  "\u2CA5\u2C93": {
    id: "\u2CA5\u2C93",
    fallbackText: "si",
    src: "/audio/learn/shared/si.wav",
  },
  see: {
    id: "see",
    fallbackText: "see",
    src: "/audio/learn/shared/see.wav",
  },
  "\u2CA5\u2CA9": {
    id: "\u2CA5\u2CA9",
    fallbackText: "see",
    src: "/audio/learn/shared/see.wav",
  },
  tha: {
    id: "tha",
    fallbackText: "tha",
    src: "/audio/learn/shared/tha.wav",
  },
  "\u2C91\u2C81": {
    id: "\u2C91\u2C81",
    fallbackText: "tha",
    src: "/audio/learn/shared/tha.wav",
  },
  the: {
    id: "the",
    fallbackText: "the",
    src: "/audio/learn/shared/the.mp3",
  },
  "\u2C91\u2C89": {
    id: "\u2C91\u2C89",
    fallbackText: "the",
    src: "/audio/learn/shared/the.mp3",
  },
  thi: {
    id: "thi",
    fallbackText: "thi",
    src: "/audio/learn/shared/thi.mp3",
  },
  "\u2C91\u2C93": {
    id: "\u2C91\u2C93",
    fallbackText: "thi",
    src: "/audio/learn/shared/thi.mp3",
  },
  thoh: {
    id: "thoh",
    fallbackText: "thoh",
    src: "/audio/learn/shared/thoh.mp3",
  },
  "\u2C91\u2C71": {
    id: "\u2C91\u2C71",
    fallbackText: "thoh",
    src: "/audio/learn/shared/thoh.mp3",
  },
  fa: {
    id: "fa",
    fallbackText: "fa",
    src: "/audio/learn/shared/fa.wav",
  },
  "\u2CAB\u2C81": {
    id: "\u2CAB\u2C81",
    fallbackText: "fa",
    src: "/audio/learn/shared/fa.wav",
  },
  fe: {
    id: "fe",
    fallbackText: "fe",
    src: "/audio/learn/shared/fe.mp3",
  },
  "\u2CAB\u2C89": {
    id: "\u2CAB\u2C89",
    fallbackText: "fe",
    src: "/audio/learn/shared/fe.mp3",
  },
  fi: {
    id: "fi",
    fallbackText: "fi",
    src: "/audio/learn/shared/fi.mp3",
  },
  "\u2CAB\u2C93": {
    id: "\u2CAB\u2C93",
    fallbackText: "fi",
    src: "/audio/learn/shared/fi.mp3",
  },
  foh: {
    id: "foh",
    fallbackText: "foh",
    src: "/audio/learn/shared/fo.mp3",
  },
  "\u2CAB\u2C71": {
    id: "\u2CAB\u2C71",
    fallbackText: "foh",
    src: "/audio/learn/shared/fo.mp3",
  },
  ha: {
    id: "ha",
    fallbackText: "ha",
    src: "/audio/learn/shared/ha.mp3",
  },
  "ϩⲁ": {
    id: "ϩⲁ",
    fallbackText: "ha",
    src: "/audio/learn/shared/ha.mp3",
  },
  kha: {
    id: "kha",
    fallbackText: "kha",
    src: "/audio/learn/shared/kha.mp3",
  },
  "ϧⲁ": {
    id: "ϧⲁ",
    fallbackText: "kha",
    src: "/audio/learn/shared/kha.mp3",
  },
  "ϧⲁⳉ": {
    id: "ϧⲁⳉ",
    fallbackText: "kha",
    src: "/audio/learn/shared/kha.mp3",
  },
  xa: {
    id: "xa",
    fallbackText: "kha",
    src: "/audio/learn/shared/xa.mp3",
  },
  "ⲭⲁ": {
    id: "ⲭⲁ",
    fallbackText: "kha",
    src: "/audio/learn/shared/xa.mp3",
  },
  "ⲭⲓ": {
    id: "ⲭⲓ",
    fallbackText: "khi",
    src: "/audio/learn/shared/khi-chi.mp3",
  },
  he: {
    id: "he",
    fallbackText: "he",
    src: "/audio/learn/shared/he.mp3",
  },
  "ϩⲉ": {
    id: "ϩⲉ",
    fallbackText: "he",
    src: "/audio/learn/shared/he.mp3",
  },
  khe: {
    id: "khe",
    fallbackText: "khe",
    src: "/audio/learn/shared/khe.mp3",
  },
  "ϧⲉ": {
    id: "ϧⲉ",
    fallbackText: "khe",
    src: "/audio/learn/shared/khe.mp3",
  },
  hi: {
    id: "hi",
    fallbackText: "hi",
    src: "/audio/learn/shared/hi.mp3",
  },
  "ϩⲓ": {
    id: "ϩⲓ",
    fallbackText: "hi",
    src: "/audio/learn/shared/hi.mp3",
  },
  khi: {
    id: "khi",
    fallbackText: "khi",
    src: "/audio/learn/shared/khi.mp3",
  },
  "ϧⲓ": {
    id: "ϧⲓ",
    fallbackText: "khi",
    src: "/audio/learn/shared/khi.mp3",
  },
  cha: {
    id: "cha",
    fallbackText: "cha",
    src: "/audio/learn/shared/cha.mp3",
  },
  "ϭⲁ": {
    id: "ϭⲁ",
    fallbackText: "cha",
    src: "/audio/learn/shared/cha.mp3",
  },
  je: {
    id: "je",
    fallbackText: "je",
    src: "/audio/learn/shared/je.mp3",
  },
  "ϫⲉ": {
    id: "ϫⲉ",
    fallbackText: "je",
    src: "/audio/learn/shared/je.mp3",
  },
  ji: {
    id: "ji",
    fallbackText: "ji",
    src: "/audio/learn/shared/ji.mp3",
  },
  "ϫⲓ": {
    id: "ϫⲓ",
    fallbackText: "ji",
    src: "/audio/learn/shared/ji.mp3",
  },
  che: {
    id: "che",
    fallbackText: "che",
    src: "/audio/learn/shared/che.mp3",
  },
  "ϭⲉ": {
    id: "ϭⲉ",
    fallbackText: "che",
    src: "/audio/learn/shared/che.mp3",
  },
  chi: {
    id: "chi",
    fallbackText: "chi",
    src: "/audio/learn/shared/chi.mp3",
  },
  "ϭⲓ": {
    id: "ϭⲓ",
    fallbackText: "chi",
    src: "/audio/learn/shared/chi.mp3",
  },
  psa: {
    id: "psa",
    fallbackText: "psa",
    src: "/audio/learn/shared/psa.mp3",
  },
  "ⲯⲁ": {
    id: "ⲯⲁ",
    fallbackText: "psa",
    src: "/audio/learn/shared/psa.mp3",
  },
  pse: {
    id: "pse",
    fallbackText: "pse",
    src: "/audio/learn/shared/pse.mp3",
  },
  "ⲯⲉ": {
    id: "ⲯⲉ",
    fallbackText: "pse",
    src: "/audio/learn/shared/pse.mp3",
  },
  psi: {
    id: "psi",
    fallbackText: "psi",
    src: "/audio/learn/shared/psi.mp3",
  },
  "ⲯⲓ": {
    id: "ⲯⲓ",
    fallbackText: "psi",
    src: "/audio/learn/shared/psi.mp3",
  },
  "correct-answer": {
    id: "correct-answer",
    fallbackText: "",
    src: "/audio/learn/shared/correct-answer.wav",
  },
  "incorrect-answer": {
    id: "incorrect-answer",
    fallbackText: "",
    src: "/audio/learn/shared/incorrect-answer.wav",
  },
  "lesson-complete": {
    id: "lesson-complete",
    fallbackText: "",
    src: "/audio/learn/shared/lesson-complete.wav",
  },
};

const lessonSpecificAudio: Record<string, Record<string, LessonAudioEntry>> = {
  // Keep Group 5's ϫⲁ audio distinct from the shared ga clip.
  "lesson-21-j-ch-bridge": {
    ga: {
      id: "ga",
      fallbackText: "ga",
      src: "/audio/learn/shared/ga-jima.mp3",
    },
    kha: {
      id: "kha",
      fallbackText: "kha",
      src: "/audio/learn/shared/xa.mp3",
    },
  },
  "lesson-22-j-ch-bridge": {
    ga: {
      id: "ga",
      fallbackText: "ga",
      src: "/audio/learn/shared/ga-jima.mp3",
    },
    kha: {
      id: "kha",
      fallbackText: "kha",
      src: "/audio/learn/shared/xa.mp3",
    },
    khi: {
      id: "khi",
      fallbackText: "khi",
      src: "/audio/learn/shared/khi-chi.mp3",
    },
  },
  "lesson-23-ps-ti-bridge": {
    kha: {
      id: "kha",
      fallbackText: "kha",
      src: "/audio/learn/shared/xa.mp3",
    },
  },
  "lesson-24-ps-ti-bridge": {
    khi: {
      id: "khi",
      fallbackText: "khi",
      src: "/audio/learn/shared/khi-chi.mp3",
    },
  },
  "lesson-25-group-5-review": {
    ga: {
      id: "ga",
      fallbackText: "ga",
      src: "/audio/learn/shared/ga-jima.mp3",
    },
    kha: {
      id: "kha",
      fallbackText: "kha",
      src: "/audio/learn/shared/xa.mp3",
    },
    khi: {
      id: "khi",
      fallbackText: "khi",
      src: "/audio/learn/shared/khi-chi.mp3",
    },
  },
  "unit-1-review-final": {
    ga: {
      id: "ga",
      fallbackText: "ga",
      src: "/audio/learn/shared/ga-jima.mp3",
    },
    kha: {
      id: "kha",
      fallbackText: "kha",
      src: "/audio/learn/shared/xa.mp3",
    },
    khi: {
      id: "khi",
      fallbackText: "khi",
      src: "/audio/learn/shared/khi-chi.mp3",
    },
  },
};
const sharedAudioAliases: Record<string, string> = {
  "\u2C8D\u2C9F": "zo",
  "\u2CA3\u2C9F": "ro",
  "\u2C87\u2C9F\u2CA9": "dhou",
  "\u2C87\u2C9F\u2CA9\u2C87": "dhoud",
  "\u2C9F\u2CA9": "ou",
  "\u2C9F\u2CA9\u2C81": "ouwa",
  "\u2C9F\u2CA9\u2C93": "ouwi",
  "\u2CA3\u2C81\u2CA9": "rav",
  "\u2CA3\u2C81\u2C93": "rai",
  "\u2C93\u2C81": "ya",
};

export function resolveLessonAudio(lessonId: string, audioId: string): LessonAudioEntry | null {
  const lessonMatch = lessonSpecificAudio[lessonId]?.[audioId];
  if (lessonMatch) {
    return lessonMatch;
  }

  return sharedLessonAudio[audioId] ?? sharedLessonAudio[sharedAudioAliases[audioId]] ?? null;
}

export function listSharedLessonAudio(): LessonAudioEntry[] {
  return Object.values(sharedLessonAudio);
}

