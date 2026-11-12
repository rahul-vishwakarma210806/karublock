import type { Lang } from "./i18n";

export type Cat = "school" | "college" | "mix";
type O = [emoji: string, en: string, hi: string];
type B = { id: string; cat: "school" | "college" | "fun"; q: [string, string]; o: [O, O, O, O] };

export const BANK: B[] = [
  // ---- School ----
  { id: "s1", cat: "school", q: ["What is my favourite subject?", "मेरा पसंदीदा विषय कौन सा है?"], o: [["📐", "Maths", "गणित"], ["🔬", "Science", "विज्ञान"], ["📖", "English", "अंग्रेज़ी"], ["🏏", "Games period", "गेम्स पीरियड"]] },
  { id: "s2", cat: "school", q: ["What is the best thing about school for me?", "मेरे लिए स्कूल की सबसे अच्छी चीज़ क्या है?"], o: [["🍱", "Lunch break", "लंच ब्रेक"], ["👫", "Friends", "दोस्त"], ["🏃", "Sports day", "स्पोर्ट्स डे"], ["🔔", "The last bell", "छुट्टी की घंटी"]] },
  { id: "s3", cat: "school", q: ["Where do I sit in class?", "मैं क्लास में कहाँ बैठता/बैठती हूँ?"], o: [["⬆️", "Front bench", "आगे की बेंच"], ["↔️", "Middle", "बीच में"], ["⬇️", "Last bench", "आख़िरी बेंच"], ["🪟", "Near the window", "खिड़की के पास"]] },
  { id: "s4", cat: "school", q: ["Homework is pending. What do I do?", "होमवर्क बाकी है। मैं क्या करता/करती हूँ?"], o: [["📒", "Copy from a friend", "दोस्त की कॉपी देखता/देखती हूँ"], ["🌙", "Finish it at night", "रात को पूरा करता/करती हूँ"], ["🙊", "Make an excuse", "बहाना बनाता/बनाती हूँ"], ["🙏", "Pray the teacher is absent", "दुआ करता/करती हूँ कि टीचर न आएँ"]] },
  { id: "s5", cat: "school", q: ["What is my favourite tiffin?", "मेरा पसंदीदा टिफ़िन क्या है?"], o: [["🍜", "Maggi", "मैगी"], ["🫓", "Paratha", "पराठा"], ["🥪", "Sandwich", "सैंडविच"], ["🍟", "Chips and snacks", "चिप्स और स्नैक्स"]] },
  { id: "s6", cat: "school", q: ["How do I prepare for exams?", "मैं परीक्षा की तैयारी कैसे करता/करती हूँ?"], o: [["📚", "Study all night", "रात भर पढ़ाई"], ["⏰", "Last-minute reading", "आख़िरी वक़्त पर पढ़ाई"], ["🤞", "Total luck", "पूरी तरह किस्मत भरोसे"], ["🧠", "Calm, already prepared", "पहले से तैयार"]] },
  { id: "s7", cat: "school", q: ["The teacher scolds me. What do I do?", "टीचर डाँटती हैं तो मैं क्या करता/करती हूँ?"], o: [["😇", "Look innocent", "मासूम बन जाता/जाती हूँ"], ["😭", "Cry", "रो देता/देती हूँ"], ["😂", "Burst out laughing", "हँस पड़ता/पड़ती हूँ"], ["🤐", "Stay silent", "चुप रहता/रहती हूँ"]] },
  { id: "s8", cat: "school", q: ["Where would I pick for a school trip?", "स्कूल ट्रिप के लिए मैं कहाँ जाना चाहूँगा/चाहूँगी?"], o: [["🏞️", "Hill station", "हिल स्टेशन"], ["🏖️", "Beach", "बीच"], ["🏰", "Historic fort", "ऐतिहासिक किला"], ["🎢", "Amusement park", "एम्यूज़मेंट पार्क"]] },
  // ---- College ----
  { id: "c1", cat: "college", q: ["What is my favourite place on campus?", "कैंपस में मेरी पसंदीदा जगह कौन सी है?"], o: [["🍵", "Canteen", "कैंटीन"], ["📚", "Library", "लाइब्रेरी"], ["🌳", "Ground", "मैदान"], ["🪑", "Last bench", "आख़िरी बेंच"]] },
  { id: "c2", cat: "college", q: ["I have an 8 AM lecture. What do I do?", "सुबह 8 बजे की क्लास है। मैं क्या करता/करती हूँ?"], o: [["🏃", "Run in late", "देर से भागकर पहुँचता/पहुँचती हूँ"], ["😴", "Bunk it", "बंक मार देता/देती हूँ"], ["⏰", "Reach early", "समय से पहले पहुँचता/पहुँचती हूँ"], ["📱", "Ask a friend for proxy", "दोस्त से प्रॉक्सी लगवाता/लगवाती हूँ"]] },
  { id: "c3", cat: "college", q: ["The assignment is due tomorrow. What do I do?", "असाइनमेंट कल जमा करना है। मैं क्या करता/करती हूँ?"], o: [["🌙", "All-nighter", "रात भर जागकर बनाता/बनाती हूँ"], ["✅", "Already submitted", "पहले ही जमा कर चुका/चुकी हूँ"], ["💬", "Ask the group chat", "ग्रुप चैट में मदद माँगता/माँगती हूँ"], ["🙈", "Ask for an extension", "एक्सटेंशन माँगता/माँगती हूँ"]] },
  { id: "c4", cat: "college", q: ["What do I spend most of my pocket money on?", "मैं अपनी पॉकेट मनी सबसे ज़्यादा किस पर खर्च करता/करती हूँ?"], o: [["☕", "Chai and coffee", "चाय-कॉफ़ी"], ["🍔", "Street food", "स्ट्रीट फ़ूड"], ["👟", "Clothes and shoes", "कपड़े-जूते"], ["🎮", "Games and OTT", "गेम्स और OTT"]] },
  { id: "c5", cat: "college", q: ["What is my biggest college stress?", "कॉलेज में मेरा सबसे बड़ा तनाव क्या है?"], o: [["📊", "Exams", "परीक्षा"], ["💼", "Placements", "प्लेसमेंट"], ["💸", "Running out of money", "पैसे ख़त्म हो जाना"], ["😴", "Lack of sleep", "नींद की कमी"]] },
  { id: "c6", cat: "college", q: ["What is my dream after college?", "कॉलेज के बाद मेरा सपना क्या है?"], o: [["💼", "Corporate job", "कॉर्पोरेट जॉब"], ["🚀", "My own startup", "अपना स्टार्टअप"], ["🏛️", "Government job", "सरकारी नौकरी"], ["🌍", "Study abroad", "विदेश में पढ़ाई"]] },
  { id: "c7", cat: "college", q: ["At the college fest, where will you find me?", "कॉलेज फ़ेस्ट में मैं कहाँ मिलूँगा/मिलूँगी?"], o: [["🎤", "On stage", "स्टेज पर"], ["🛠️", "Behind the scenes", "पर्दे के पीछे"], ["🍿", "In the audience", "दर्शकों में"], ["🍕", "At the food stalls", "फ़ूड स्टॉल पर"]] },
  { id: "c8", cat: "college", q: ["How do I study best?", "मैं सबसे अच्छी पढ़ाई कैसे करता/करती हूँ?"], o: [["👥", "Group study", "ग्रुप स्टडी"], ["🎧", "Alone with music", "अकेले गाने सुनते हुए"], ["📺", "YouTube lectures", "यूट्यूब लेक्चर"], ["📝", "Previous year papers", "पिछले साल के पेपर"]] },
  // ---- Friends & fun (school + college) ----
  { id: "f1", cat: "fun", q: ["What is my favourite food?", "मेरा पसंदीदा खाना क्या है?"], o: [["🍕", "Pizza", "पिज़्ज़ा"], ["🍔", "Burger", "बर्गर"], ["🍛", "Biryani", "बिरयानी"], ["🥟", "Momos", "मोमोज़"]] },
  { id: "f2", cat: "fun", q: ["What is my perfect weekend?", "मेरा परफ़ेक्ट वीकेंड कैसा होता है?"], o: [["😴", "Sleep all day", "दिन भर सोना"], ["🎬", "Movies and series", "फ़िल्में और वेब सीरीज़"], ["🏏", "Play outside", "बाहर खेलना"], ["🛵", "Hang out with friends", "दोस्तों के साथ घूमना"]] },
  { id: "f2b", cat: "fun", q: ["What do I do to chill?", "आराम करने के लिए मैं क्या करता/करती हूँ?"], o: [["🎵", "Listen to music", "गाने सुनता/सुनती हूँ"], ["🎮", "Play games", "गेम खेलता/खेलती हूँ"], ["📱", "Scroll reels", "रील्स देखता/देखती हूँ"], ["📚", "Read a book", "किताब पढ़ता/पढ़ती हूँ"]] },
  { id: "f3", cat: "fun", q: ["What am I most afraid of?", "मुझे सबसे ज़्यादा किस चीज़ से डर लगता है?"], o: [["🕷️", "Insects", "कीड़े-मकोड़े"], ["👻", "Ghosts", "भूत"], ["🎤", "Speaking on stage", "स्टेज पर बोलना"], ["🌑", "The dark", "अँधेरा"]] },
  { id: "f4", cat: "fun", q: ["Which superpower would I pick?", "मैं कौन सी सुपरपावर चुनूँगा/चुनूँगी?"], o: [["🦸", "Flying", "उड़ना"], ["👻", "Invisibility", "अदृश्य होना"], ["⏳", "Stopping time", "समय रोकना"], ["🧠", "Reading minds", "मन पढ़ना"]] },
  { id: "f5", cat: "fun", q: ["What is my favourite drink?", "मेरा पसंदीदा ड्रिंक क्या है?"], o: [["☕", "Chai", "चाय"], ["🧋", "Cold coffee", "कोल्ड कॉफ़ी"], ["🥤", "Cold drink", "कोल्ड ड्रिंक"], ["🥭", "Mango shake", "मैंगो शेक"]] },
  { id: "f6", cat: "fun", q: ["What do I use my phone for the most?", "मैं फ़ोन का सबसे ज़्यादा इस्तेमाल किसलिए करता/करती हूँ?"], o: [["📸", "Photos and selfies", "फ़ोटो और सेल्फ़ी"], ["💬", "Chatting", "चैटिंग"], ["▶️", "YouTube", "यूट्यूब"], ["🎮", "Games", "गेम्स"]] },
  { id: "f7", cat: "fun", q: ["What annoys me the most?", "मुझे सबसे ज़्यादा किस बात पर चिढ़ होती है?"], o: [["🐌", "Slow internet", "धीमा इंटरनेट"], ["🔋", "Low phone battery", "फ़ोन की बैटरी कम होना"], ["⏰", "Waking up early", "जल्दी उठना"], ["🗣️", "Spoilers", "स्पॉइलर"]] },
];

export const bankById = Object.fromEntries(BANK.map((b) => [b.id, b]));
export const poolFor = (c: Cat) => BANK.filter((b) => (c === "mix" ? true : b.cat === c || b.cat === "fun"));

export function bankView(b: B, lang: Lang) {
  const i = lang === "hi" ? 1 : 0;
  return { text: b.q[i], opts: b.o.map((o) => ({ e: o[0], t: o[i + 1] })) };
}

export function shuffled<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
