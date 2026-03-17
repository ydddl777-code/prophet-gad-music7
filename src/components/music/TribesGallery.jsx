import React, { useState } from 'react';
import { X } from 'lucide-react';

const TRIBES = [
  {
    name: "Reuben",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/e237ef153_REUBEN1.jpg",
    symbol: "Mandrakes",
    symbolMeaning: "Potential without follow-through — beautiful but rooted, unable to move.",
    blessing: "Reuben, you are my firstborn, my might, and the firstfruits of my strength, the excellency of dignity and the excellency of power. Unstable as water, you shall not excel, because you went up to your father's bed; then you defiled it. — Genesis 49:3-4",
    whoTheyWere: "The firstborn of Israel, Reuben carried the birthright in name only — it was stripped from him due to his sin against his father. His tribe settled east of the Jordan, choosing comfort over calling. Yet Reuben showed moments of conscience — it was he who tried to spare Joseph from death, saying 'Shed no blood.' The Reubenites were warriors numbered among Israel's fighting men but never rose to national leadership.",
    notableFigures: "No kings or major judges arose from Reuben. His legacy is a warning — the firstborn who lost his inheritance through moral failure. The birthright passed to Joseph, the priesthood to Levi, and the kingship to Judah.",
    revelation: "Reuben is listed first among the 144,000 in Revelation 7:5 — 12,000 sealed. Despite his failures, the mercy of the Most High restores him to his place among the tribes of destiny.",
  },
  {
    name: "Simeon",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/64a5d1c11_SIMEON1.jpg",
    symbol: "Sword / City Gate",
    symbolMeaning: "Zeal without wisdom — the sword that cuts both ways.",
    blessing: "Simeon and Levi are brothers; instruments of cruelty are in their habitations... for in their anger they slew a man... Cursed be their anger, for it was fierce; and their wrath, for it was cruel: I will divide them in Jacob, and scatter them in Israel. — Genesis 49:5-7",
    whoTheyWere: "Simeon was scattered as Jacob prophesied — his tribe received no contiguous territory of their own but was absorbed within the territory of Judah. By the time of David's census, Simeon was among the smallest tribes. Together with Levi, Simeon put an entire city to the sword to avenge his sister Dinah — passion for honor with disastrous execution.",
    notableFigures: "Simeon the son of Jacob is distinguished from Simeon of the New Testament (Luke 2:25-35) who blessed the infant Messiah in the Temple — a beautiful prophetic echo of the tribe's need for redemption.",
    revelation: "Simeon appears in Revelation 7:7 among the 144,000 — 12,000 sealed. The scattered tribe is gathered. The curse is absorbed into covenant mercy.",
  },
  {
    name: "Levi",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/1b0dffc2d_LEVI1.jpeg",
    symbol: "Breastplate / Urim and Thummim",
    symbolMeaning: "Lights and Perfections — the instrument of divine communication and holy inquiry.",
    blessing: "Let your Thummim and your Urim belong to your faithful servant... He watched over your word and guarded your covenant. — Deuteronomy 33:8-9",
    whoTheyWere: "Levi began under a curse and ended as the tribe of the priesthood. No inheritance of land — the Most High Himself was their inheritance (Numbers 18:20). The Levites were scattered across 48 cities but their scattering became a blessing — teachers, priests, musicians, and gatekeepers throughout all Israel. The breastplate bore the names of all twelve tribes over the priest's heart — Levi carried Israel before God.",
    notableFigures: "Moses, Aaron, Miriam, Phinehas, Ezra, John the Baptist. The entire Aaronic priesthood descended from Levi through Aaron. The historical Prophet Gad worked alongside Levitical musicians to establish temple worship (2 Chronicles 29:25).",
    revelation: "In Revelation 7, Levi replaces Dan among the 144,000 — 12,000 sealed. The priestly tribe stands where the tribe of the serpent's path once stood.",
  },
  {
    name: "Judah",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/62121e8bd_JUDAH1.jpg",
    symbol: "Lion",
    symbolMeaning: "Sovereignty, courage, and the authority to rule — the scepter belongs to Judah alone.",
    blessing: "Judah is a lion's whelp... The scepter shall not depart from Judah, nor a lawgiver from between his feet, until Shiloh come; and unto him shall the gathering of the people be. — Genesis 49:9-10",
    whoTheyWere: "The royal tribe. Judah led the march in the wilderness. Judah was the largest tribe. The southern kingdom bore Judah's name after the division. The lion represents Judah's arc — from warrior tribe to established monarchy to the eternal King who is the Lion of the tribe of Judah (Revelation 5:5).",
    notableFigures: "Caleb, David, Solomon, Hezekiah, Josiah. The Messiah Himself came through the tribe of Judah — the Lion of the tribe of Judah (Revelation 5:5).",
    revelation: "Judah is listed first in Revelation 7:5 — not Reuben the firstborn, but Judah the royal tribe. 12,000 sealed. The Lion leads the remnant.",
  },
  {
    name: "Dan",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/cdc196f14_DAN1.jpg",
    symbol: "Serpent / Eagle",
    symbolMeaning: "Discernment twisted into guile — the tension of gifting used for good or ill.",
    blessing: "Dan shall judge his people, as one of the tribes of Israel. Dan shall be a serpent by the way, an adder in the path... I have waited for your salvation, O Lord. — Genesis 49:16-18",
    whoTheyWere: "Dan judged Israel — Samson was a Danite judge. The Danites were the first tribe to fall into systematic idolatry, setting up Micah's idol and establishing a false priesthood (Judges 18). The serpent strikes from hiding, bringing down the powerful through cunning. The eagle sees from great height — the judicial function of the tribe.",
    notableFigures: "Samson — great gifting, compromised by the flesh. Oholiab, craftsman of the Tabernacle, was also a Danite (Exodus 31:6).",
    revelation: "Dan is absent from the 144,000 in Revelation 7 — replaced by Manasseh. A solemn warning: a tribe can forfeit its place in the remnant through persistent apostasy.",
  },
  {
    name: "Naphtali",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/e92c9bb08_naphtali1.jpg",
    symbol: "Doe / Swift Deer",
    symbolMeaning: "Liberation and eloquence — a tribe that could not be contained by conventional boundaries.",
    blessing: "Naphtali is a doe let loose; he gives beautiful words. — Genesis 49:21",
    whoTheyWere: "Naphtali's territory around the Sea of Galilee fulfilled Isaiah's prophecy — the Messiah made His base of ministry in this land. Swift, eloquent, free-spirited. The doe is unrestrained, leaping across terrain with effortless speed — Naphtali's beauty was in words, not weapons, though they were fierce fighters when called upon.",
    notableFigures: "Barak the general who defeated Sisera (Judges 4:6). The land of Naphtali became the cradle of the Galilean ministry of the Messiah.",
    revelation: "Naphtali appears in Revelation 7:6 — 12,000 sealed. The doe let loose runs into eternity.",
  },
  {
    name: "Gad",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/d759e65b4_GAD1.jpg",
    symbol: "Lion / Armed Warrior / Encampment",
    symbolMeaning: "A field lion — ferocity combined with speed — the warrior-prophet bearing the word like a weapon.",
    blessing: "Gad, a troop shall overcome him, but he shall overcome at the last. — Genesis 49:19. Moses adds: Gad lives there like a lion, tearing at arm or head... He executed the justice of the Lord, and his judgments with Israel. — Deuteronomy 33:20-21",
    whoTheyWere: "The Gadites were among the fiercest warriors in all of Israel. They settled in Gilead east of the Jordan — choosing the best land — but honored their covenant to fight alongside their brothers until the conquest was complete. The Gadite warriors who joined David at Ziklag had faces like lions and were swift as gazelles (1 Chronicles 12:8).",
    notableFigures: "The Prophet Gad — David's seer (1 Samuel 22:5, 2 Samuel 24, 1 Chronicles 29:29). He confronted David, delivered judgment, wrote chronicles, and organized temple worship. Elijah the Tishbite came from Gilead — Gad's territory.",
    revelation: "Gad appears in Revelation 7:5 — 12,000 sealed. The troop that overcomes at the last. The warrior-prophet tribe sealed for the final conflict.",
  },
  {
    name: "Asher",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/a92747e62_ASHER1.jpg",
    symbol: "Olive Tree / Cup of Oil",
    symbolMeaning: "The cup that overflows — anointing, abundance, light, and healing beyond measure.",
    blessing: "Out of Asher his bread shall be fat, and he shall yield royal dainties... let him dip his foot in oil. Your bars shall be iron and bronze, and as your days, so shall your strength be. — Genesis 49:20, Deuteronomy 33:24-25",
    whoTheyWere: "Asher was the tribe of abundance, oil, and royal provision. Their Mediterranean coastal territory was among the most fertile in the land. 'As your days, so shall your strength be' — strength proportional to the demand. Asher's territory produced the finest olive oil in Israel, used for the Temple lamps and for anointing kings and priests.",
    notableFigures: "Anna the prophetess from Asher recognized the infant Messiah in the Temple (Luke 2:36-38). A woman from the most abundant tribe announced the arrival of the Bread of Life.",
    revelation: "Asher appears in Revelation 7:6 — 12,000 sealed. The tribe of royal dainties serves at the table of the eternal kingdom.",
  },
  {
    name: "Issachar",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/f45a1b7ad_ISSACHAR1.jpg",
    symbol: "Donkey / Sun and Moon",
    symbolMeaning: "The tribe that bore burdens also bore understanding — knowing the times and seasons.",
    blessing: "Issachar is a strong donkey, crouching between the sheepfolds. He saw that a resting place was good... so he bowed his shoulder to bear, and became a servant at forced labor. — Genesis 49:14-15",
    whoTheyWere: "The sons of Issachar who came to David were 'men who had understanding of the times, to know what Israel ought to do' (1 Chronicles 12:32) — 200 chiefs of discernment. The tribe of knowing the hour. The donkey carries what must be carried — patient, sure-footed, essential. The Messiah Himself entered Jerusalem on a donkey, fulfilling Zechariah 9:9.",
    notableFigures: "Tola, judge of Israel (Judges 10:1). The 200 chiefs who understood the times — Issachar's greatest prophetic contribution.",
    revelation: "Issachar appears in Revelation 7:7 — 12,000 sealed. The tribe that knew the times is sealed for the final hour.",
  },
  {
    name: "Zebulun",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/c90a2525e_ZEBULUN1.jpg",
    symbol: "Ship / Anchor",
    symbolMeaning: "A bridge tribe — rooted in covenant while navigating between peoples and nations.",
    blessing: "Zebulun shall dwell at the shore of the sea; he shall become a haven for ships, and his border shall be at Sidon. — Genesis 49:13",
    whoTheyWere: "Zebulun controlled key trade routes. Warriors of unusual courage — 'a people that jeopardized their lives to the death in the high places of the field' (Judges 5:18). Their territory became part of the Messiah's Galilean ministry region. Neither fully of the sea nor fully of the land, but essential to both.",
    notableFigures: "Elon the judge (Judges 12:11-12). The territory of Zebulun produced the context for the calling of the first disciples on the Sea of Galilee.",
    revelation: "Zebulun appears in Revelation 7:8 — 12,000 sealed. The haven tribe, sealed to shelter the remnant.",
  },
  {
    name: "Joseph",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/fdb7d9ab4_JOSEPH1.jpg",
    symbol: "Fruitful Vine / Bull",
    symbolMeaning: "Branches that run over the wall — influence that overflows every boundary placed upon it.",
    blessing: "Joseph is a fruitful bough, a fruitful bough by a spring; his branches run over the wall... by the God of your father who will help you, by the Almighty who will bless you with blessings of heaven above. — Genesis 49:22-25",
    whoTheyWere: "Joseph received the double portion — Ephraim and Manasseh each became a full tribe. Joseph's life is the most complete type of the Messiah in Scripture: beloved, rejected, sold, imprisoned, raised to the throne, and the savior of those who betrayed him. The two bundles of grain recall his dreams fulfilled when his brothers bowed before him in Egypt.",
    notableFigures: "Joshua from Ephraim led Israel into the Promised Land. Gideon from Manasseh (Judges 6:15). Jeroboam who divided the kingdom was an Ephraimite.",
    revelation: "Manasseh appears in Revelation 7 with 12,000 sealed. Joseph is listed separately with 12,000. Ephraim is absent — associated with golden calf worship at Bethel.",
  },
  {
    name: "Benjamin",
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ab3d8b448_BENJAMIN1.jpg",
    symbol: "Wolf / Arrow",
    symbolMeaning: "Relentless, resilient, precise — nearly annihilated and miraculously restored.",
    blessing: "Benjamin is a ravenous wolf; in the morning he devours the prey, and at evening he divides the spoil. — Genesis 49:27",
    whoTheyWere: "The last born and most fiercely loved — Rachel died giving him birth. Benjamin's warriors were elite left-handed slingers — 700 men who could hit a hair's breadth target without missing (Judges 20:16). The tribe nearly destroyed itself in the civil war of Gibeah (Judges 19-21), was almost annihilated, and was restored only through extraordinary measures.",
    notableFigures: "King Saul — Israel's first king (1 Samuel 9:1-2). The Apostle Paul — 'of the tribe of Benjamin' (Philippians 3:5). Mordecai and Esther — deliverers of the Jewish people in Persia. The ravenous wolf tribe produced Israel's first king and the apostle to the Gentiles.",
    revelation: "Benjamin appears last in Revelation 7:8 — 12,000 sealed. The last born, nearly destroyed, miraculously preserved — sealed among the firstfruits of the final harvest.",
  },
];

const GOLDEN_GATE = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698ae99a8f13115b248081e9/ddc9085d4_Gemini_Generated_Image_kkdrsjkkdrsjkkdr.png";

function TribeDossier({ tribe, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl max-w-2xl w-full shadow-2xl my-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-48 rounded-t-2xl overflow-hidden">
          <img src={tribe.url} alt={tribe.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white bg-black/40 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-5">
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Prophetic Dossier</p>
            <h2 className="text-3xl font-black text-amber-400">Tribe of {tribe.name}</h2>
            <p className="text-slate-400 text-xs mt-0.5">Symbol: {tribe.symbol}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Symbol */}
          <div>
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">Tribal Symbol</p>
            <p className="text-amber-300 font-semibold text-sm">{tribe.symbol}</p>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{tribe.symbolMeaning}</p>
          </div>

          {/* Jacob's Blessing */}
          <div>
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2">Jacob's Blessing</p>
            <blockquote className="border-l-2 border-amber-500/60 pl-4 italic text-amber-300/90 text-sm leading-relaxed">
              {tribe.blessing}
            </blockquote>
          </div>

          {/* Who They Were */}
          <div>
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">Who They Were</p>
            <p className="text-slate-300 text-sm leading-relaxed">{tribe.whoTheyWere}</p>
          </div>

          {/* Notable Figures */}
          <div>
            <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">Notable Figures</p>
            <p className="text-slate-300 text-sm leading-relaxed">{tribe.notableFigures}</p>
          </div>

          {/* Revelation 7 */}
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4">
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Sealed in Revelation 7</p>
            <p className="text-slate-300 text-sm leading-relaxed">{tribe.revelation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TribesGallery() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="relative overflow-hidden h-28">
        <img src={GOLDEN_GATE} alt="New Jerusalem" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/90" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">The Twelve Tribes of Israel</p>
          <h2 className="text-white text-2xl font-black tracking-wide" style={{textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
            Remnant Seed · Standing Firm
          </h2>
          <p className="text-slate-400 text-xs mt-1 italic">"He that hath an ear, let him hear what the Spirit saith" — Rev. 2</p>
        </div>
      </div>

      {/* Tribe Banners Grid */}
      <div className="bg-slate-950 py-6 px-4">
        <p className="text-center text-slate-500 text-xs italic mb-4">Click any tribe to open the prophetic dossier</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 max-w-7xl mx-auto">
          {TRIBES.map((tribe) => (
            <div
              key={tribe.name}
              onClick={() => setSelected(tribe)}
              className="group relative overflow-hidden rounded-lg border border-slate-800 hover:border-amber-500/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-900/30 cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              <img src={tribe.url} alt={`Tribe of ${tribe.name}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-0 right-0 text-center">
                <span className="text-amber-400 text-[10px] font-bold drop-shadow-lg">{tribe.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dossier Modal */}
      {selected && <TribeDossier tribe={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}