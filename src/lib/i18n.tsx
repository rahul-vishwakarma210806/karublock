"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const D = {
  en: {
    brand: "Best Friend Test", heroTitle: "How well do your friends know you?",
    heroSub: "Make a quiz about yourself, send the link on WhatsApp, and see who really knows you.",
    yourName: "Your name", namePh: "e.g. Priya", qLabel: "Question {n}", qPh: "Write a question about you",
    optPh: "Option {n}", correct: "This is the right answer", remove: "Remove", add: "Add question",
    starter: "Fill in starter questions", create: "Create my quiz", creating: "Creating…",
    quizLang: "Quiz language", errName: "Enter your name", errQ: "Each question needs text, at least 2 options, and one marked correct answer.",
    errNet: "Something went wrong. Please try again.", ready: "Your quiz is ready!", shareIt: "Send this link to your friends:",
    waShare: "Share on WhatsApp", copy: "Copy link", copied: "Copied!", seeBoard: "See leaderboard",
    waText: "How well do you know {name}? Take my quiz and find out:",
    quizBy: "{name}'s quiz", intro: "How well do you know {name}?", yourNameShort: "Your name",
    start: "Start", of: "Question {a} of {b}", submitting: "Checking…", scoreMsgHi: "You really know {name}!",
    scoreMsgMid: "Not bad, but {name} has secrets.", scoreMsgLow: "Do you even know {name}?",
    review: "Your answers", yours: "You picked", right: "Right answer", leaderboard: "Leaderboard", empty: "No one has played yet.",
    shareScore: "Share my score", waScore: "I scored {s}/{t} on {name}'s quiz. Can you beat me?", download: "Download result card",
    makeOwn: "Create your own quiz", notFound: "This quiz doesn't exist. Check the link.", loading: "Loading…", playAgain: "Play again", home: "Home",
    heroSub2: "Tap your answers to 10 quick questions. Share the link. See which friend knows you best.",
    forWho: "Who is this quiz for?", catSchool: "School", catCollege: "College", catMix: "Everything",
    startQuiz: "Start my quiz", safety: "Use first names only. Never share phone numbers or addresses.",
    tapYours: "Tap YOUR answer. Your friends will try to guess it.", swap: "Swap question", own: "Write my own", del: "Delete question",
    next: "Next", back: "Back", errPick: "Tap your answer first.", photo: "Add photo", ownHint: "Tick the circle next to the right answer. Photos are optional.",
    guess: "What would {name} pick?", rank1: "Ultimate Bestie", rank2: "Close Friend", rank3: "Classmate", rank4: "Stranger",
    youScored: "You scored", photoErr: "That photo could not be used.",
  },
  hi: {
    brand: "बेस्ट फ्रेंड टेस्ट", heroTitle: "आपके दोस्त आपको कितना जानते हैं?",
    heroSub: "अपने बारे में क्विज़ बनाइए, WhatsApp पर लिंक भेजिए और देखिए कौन आपको सच में जानता है।",
    yourName: "आपका नाम", namePh: "जैसे प्रिया", qLabel: "सवाल {n}", qPh: "अपने बारे में एक सवाल लिखिए",
    optPh: "विकल्प {n}", correct: "यही सही जवाब है", remove: "हटाएँ", add: "सवाल जोड़ें",
    starter: "सैंपल सवाल भरें", create: "मेरा क्विज़ बनाएँ", creating: "बन रहा है…",
    quizLang: "क्विज़ की भाषा", errName: "अपना नाम लिखिए", errQ: "हर सवाल में टेक्स्ट, कम से कम 2 विकल्प और एक सही जवाब चाहिए।",
    errNet: "कुछ गड़बड़ हो गई। फिर से कोशिश कीजिए।", ready: "आपका क्विज़ तैयार है!", shareIt: "यह लिंक अपने दोस्तों को भेजिए:",
    waShare: "WhatsApp पर शेयर करें", copy: "लिंक कॉपी करें", copied: "कॉपी हो गया!", seeBoard: "लीडरबोर्ड देखें",
    waText: "तुम {name} को कितना जानते हो? मेरा क्विज़ खेलो और पता करो:",
    quizBy: "{name} का क्विज़", intro: "आप {name} को कितना जानते हैं?", yourNameShort: "आपका नाम",
    start: "शुरू करें", of: "सवाल {a} / {b}", submitting: "जाँच हो रही है…", scoreMsgHi: "आप तो {name} को सच में जानते हैं!",
    scoreMsgMid: "ठीक-ठाक, पर {name} के कुछ राज़ बाकी हैं।", scoreMsgLow: "क्या आप {name} को जानते भी हैं?",
    review: "आपके जवाब", yours: "आपने चुना", right: "सही जवाब", leaderboard: "लीडरबोर्ड", empty: "अभी तक किसी ने नहीं खेला।",
    shareScore: "मेरा स्कोर शेयर करें", waScore: "मैंने {name} के क्विज़ में {s}/{t} स्कोर किया। मुझे हरा सकते हो?", download: "रिज़ल्ट कार्ड डाउनलोड करें",
    makeOwn: "अपना क्विज़ बनाएँ", notFound: "यह क्विज़ मौजूद नहीं है। लिंक जाँच लीजिए।", loading: "लोड हो रहा है…", playAgain: "फिर से खेलें", home: "होम",
    heroSub2: "10 आसान सवालों के जवाब टैप कीजिए। लिंक शेयर कीजिए। देखिए कौन सा दोस्त आपको सबसे अच्छा जानता है।",
    forWho: "यह क्विज़ किसके लिए है?", catSchool: "स्कूल", catCollege: "कॉलेज", catMix: "सब कुछ",
    startQuiz: "मेरा क्विज़ शुरू करें", safety: "सिर्फ़ पहला नाम लिखिए। फ़ोन नंबर या पता कभी शेयर न करें।",
    tapYours: "अपना जवाब टैप कीजिए। आपके दोस्त उसे गेस करने की कोशिश करेंगे।", swap: "सवाल बदलें", own: "अपना सवाल लिखें", del: "सवाल हटाएँ",
    next: "आगे", back: "पीछे", errPick: "पहले अपना जवाब टैप कीजिए।", photo: "फ़ोटो जोड़ें", ownHint: "सही जवाब के बगल वाले गोले पर टिक कीजिए। फ़ोटो ज़रूरी नहीं है।",
    guess: "{name} क्या चुनेगा/चुनेगी?", rank1: "अल्टीमेट बेस्टी", rank2: "क़रीबी दोस्त", rank3: "क्लासमेट", rank4: "अजनबी",
    youScored: "आपका स्कोर", photoErr: "वह फ़ोटो इस्तेमाल नहीं हो सकी।",
  },
};
export type Key = keyof typeof D.en;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key, v?: Record<string, string | number>) => string };
const C = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setL] = useState<Lang>("en");
  useEffect(() => {
    try { const s = localStorage.getItem("kb_lang"); if (s === "hi" || s === "en") setL(s); } catch {}
  }, []);
  const setLang = (l: Lang) => { setL(l); try { localStorage.setItem("kb_lang", l); } catch {} document.documentElement.lang = l; };
  const t: Ctx["t"] = (k, v) => D[lang][k].replace(/\{(\w+)\}/g, (_, x) => String(v?.[x] ?? ""));
  return <C.Provider value={{ lang, setLang, t }}>{children}</C.Provider>;
}
export const useT = () => useContext(C);
