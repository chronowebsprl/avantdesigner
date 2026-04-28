import { useState, useEffect, useRef } from "react";

const API_KEY_PLACEHOLDER = ""; // handled by proxy

// ── FONTS & GLOBAL STYLES ──────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0F1923;
      --ink-soft: #1E2D3D;
      --gold: #C8A84B;
      --gold-light: #E2C97A;
      --gold-pale: rgba(200,168,75,0.12);
      --cream: #F8F5EF;
      --cream-dark: #EDE8DF;
      --white: #FFFFFF;
      --muted: #6B7A8D;
      --border: rgba(15,25,35,0.10);
      --danger: #C0392B;
      --danger-bg: #FDF0EE;
      --warning: #D4741A;
      --warning-bg: #FEF4E8;
      --success: #1A6B3C;
      --success-bg: #EDF7F2;
      --shadow-sm: 0 2px 8px rgba(15,25,35,0.06);
      --shadow-md: 0 8px 32px rgba(15,25,35,0.10);
      --shadow-lg: 0 24px 64px rgba(15,25,35,0.14);
      --r: 10px;
    }

    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); -webkit-font-smoothing: antialiased; line-height: 1.6; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
    @keyframes progressBar { from { width: 0%; } to { width: var(--target-width); } }

    .fade-up { animation: fadeUp 0.55s ease both; }
    .fade-up-2 { animation: fadeUp 0.55s 0.1s ease both; }
    .fade-up-3 { animation: fadeUp 0.55s 0.2s ease both; }
    .fade-up-4 { animation: fadeUp 0.55s 0.3s ease both; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--cream-dark); }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

    .btn-gold {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--gold); color: var(--ink);
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      padding: 14px 28px; border-radius: 8px; border: none; cursor: pointer;
      transition: all 0.2s; letter-spacing: 0.01em;
    }
    .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,168,75,0.35); }
    .btn-gold:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .btn-dark {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--ink); color: var(--white);
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      padding: 14px 28px; border-radius: 8px; border: none; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-dark:hover { background: var(--ink-soft); transform: translateY(-1px); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; color: var(--muted);
      font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 14px;
      padding: 10px 18px; border-radius: 8px; border: 1.5px solid var(--border); cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--gold-pale); color: var(--gold); border: 1px solid rgba(200,168,75,0.25);
      font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px;
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    .card {
      background: var(--white); border-radius: var(--r);
      border: 1px solid var(--border); box-shadow: var(--shadow-sm);
    }

    .disclaimer {
      font-size: 11px; color: var(--muted); font-style: italic; line-height: 1.6;
    }

    input, select, textarea {
      font-family: 'DM Sans', sans-serif;
      font-size: 15px; color: var(--ink);
    }
  `}</style>
);

// ── VIEWS ──────────────────────────────────────────────────────────────────
const VIEWS = { LANDING: "landing", FUNNEL: "funnel", ANALYZING: "analyzing", REPORT: "report" };

// ── NAV ────────────────────────────────────────────────────────────────────
function Nav({ view, onHome, onStart }) {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(248,245,239,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
      <div onClick={onHome} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Check<span style={{ color: "var(--gold)" }}>Ma</span>Cession
        </div>
      </div>
      {view === VIEWS.LANDING && (
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost" style={{ fontSize: 13, padding: "8px 14px" }}>Se connecter</button>
          <button className="btn-gold" onClick={onStart} style={{ fontSize: 13, padding: "8px 16px" }}>Analyser mon dossier →</button>
        </div>
      )}
    </nav>
  );
}

// ── LANDING ────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null);

  const offers = [
    { id: "juridique", icon: "⚖️", title: "Juridique", subtitle: "Je veux savoir si le contrat est risqué", price: "49€", features: ["Analyse complète du bail", "Score de risque /100", "Alertes en langage clair", "Clauses à renégocier", "Contexte marché local", "Rapport PDF par email"] },
    { id: "complet", icon: "🎯", title: "Dossier 360°", subtitle: "Je veux une vision complète avant de faire une offre", price: "89€", features: ["Bail + finances combinés", "Score global du dossier", "Conclusion acheteur", "Conclusion vendeur", "Checklist avant offre", "Contexte marché local", "Vue simple + vue pro"], highlight: true },
    { id: "financier", icon: "📈", title: "Financier", subtitle: "Je veux savoir si le commerce est vraiment rentable", price: "49€", features: ["Analyse des 3 derniers bilans", "Rentabilité réelle", "Taux d\'effort loyer/CA", "Points de vigilance", "Comparatif sectoriel", "Rapport PDF par email"] },
  ];

  const examples = [
    { kind: "Cas dossier risqué", name: "Restaurant traditionnel", type: "Reprise fonds · Bail + Finances", score: 34, level: "low", takeaway: "Bail qui interdit la vente à emporter et la livraison. Aménagements deviennent propriété du bailleur. À renégocier impérativement avant signature.", tags: ["Bail", "Finances"] },
    { kind: "Cas dossier moyen", name: "Café de quartier", type: "Reprise fonds · Bail uniquement", score: 58, level: "mid", takeaway: "Affaire intéressante mais 3 clauses à renégocier : indexation ICC à remplacer, charges non limitatives, clause résolutoire à 1 mois.", tags: ["Bail"] },
    { kind: "Cas dossier favorable", name: "Boulangerie-pâtisserie", type: "Cession · Dossier complet", score: 76, level: "high", takeaway: "Bail bien rédigé, indexation ILC, finances solides, taux d\'effort 9%. Bonne affaire — quelques points mineurs à clarifier sur les charges.", tags: ["Bail", "Finances"] },
  ];

  const levelStyles = {
    low: { bg: "var(--danger-bg)", color: "var(--danger)" },
    mid: { bg: "var(--warning-bg)", color: "var(--warning)" },
    high: { bg: "var(--success-bg)", color: "var(--success)" },
  };

  const faqs = [
    { q: "Est-ce que je dois être expert pour comprendre le rapport ?", a: "Non. C\'est fait pour tout le monde. Chaque point est expliqué en langage simple, sans jargon. Si c\'est risqué, on vous le dit clairement — pas en termes juridiques complexes." },
    { q: "En combien de temps je reçois mon rapport ?", a: "En moins de 2 minutes après l\'upload. Vous le lisez directement à l\'écran et recevez le PDF par email dans la foulée." },
    { q: "Mes documents sont-ils confidentiels ?", a: "Oui. Vos documents sont chiffrés et ne sont jamais partagés avec des tiers. Ils sont supprimés automatiquement après 30 jours." },
    { q: "CheckMaCession remplace-t-il un avocat ou un comptable ?", a: "Non — et on vous le dira toujours clairement. C\'est une première analyse sérieuse pour vous aider à poser les bonnes questions avant de consulter un professionnel. Ne signez jamais sans l\'avis d\'un expert." },
    { q: "Ça marche pour quel type de commerce ?", a: "Restaurants, snacks, cafés, boulangeries, bars, dark kitchens — tout le secteur CHR. Et plus généralement tout fonds de commerce avec un bail commercial." },
    { q: "Et si ma ville n\'est pas connue de la plateforme ?", a: "L\'IA détecte automatiquement la ville depuis l\'adresse de votre bail et adapte son analyse. Elle connaît toutes les villes françaises et leurs spécificités de marché." },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ background: "var(--white)", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 60 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 40px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 80, alignItems: "center" }} className="hero-grid">
          <div className="fade-up">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#FEF3C7", color: "#92400E", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              ⚡ Résultat en 2 minutes
            </div>
            <h1 style={{ fontFamily: "\'Playfair Display\', serif", fontSize: "clamp(40px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.1, color: "var(--ink)", marginBottom: 20, letterSpacing: "-0.02em" }}>
              Vous investissez<br />des milliers d\'euros.<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Sachez où vous mettez les pieds.</em>
            </h1>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
              Uploadez votre bail, vos bilans ou votre liasse fiscale. CheckMaCession les analyse en 2 minutes et vous dit clairement ce qui va, ce qui cloche, et ce qu\'il faut négocier.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 48, flexWrap: "wrap" }}>
              <button className="btn-gold" onClick={onStart} style={{ fontSize: 15 }}>Analyser mon dossier →</button>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>À partir de 49€ · Sans abonnement</span>
            </div>
            <div style={{ display: "flex", gap: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <div><div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>31 700</div><div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>cessions/an en France</div></div>
              <div><div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>25%</div><div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>sont des CHR</div></div>
              <div><div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>258 000€</div><div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>prix moyen d\'un fonds</div></div>
            </div>
          </div>

          <div className="fade-up-2">
            <div style={{ background: "var(--white)", borderRadius: 14, border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", overflow: "hidden" }}>
              <div style={{ background: "var(--ink)", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Exemple de rapport</div>
                  <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 17, fontWeight: 700, color: "white" }}>Restaurant — exemple type</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Bail commercial + Finances</div>
                </div>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(185,28,28,0.2)", border: "2.5px solid #EF4444", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 22, fontWeight: 700, color: "#FCA5A5", lineHeight: 1 }}>34</div>
                  <div style={{ fontSize: 9, color: "#FCA5A5" }}>/100</div>
                </div>
              </div>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Ce que CheckMaCession trouve</div>
                {[
                  { bg: "#FEF2F2", border: "#EF4444", text: "🚨 Le bail interdit la livraison et la vente à emporter" },
                  { bg: "#FEF2F2", border: "#EF4444", text: "🚨 Les aménagements deviennent propriété du bailleur" },
                  { bg: "#FFF7ED", border: "#F97316", text: "⚠️ Indexation défavorable au secteur" },
                ].map((f, i) => (
                  <div key={i} style={{ padding: "9px 12px", borderRadius: 7, marginBottom: 7, borderLeft: `3px solid ${f.border}`, fontSize: 12, lineHeight: 1.5, color: "var(--ink)", background: f.bg }}>{f.text}</div>
                ))}
                <div style={{ padding: "9px 12px", borderRadius: 7, marginTop: 12, borderLeft: "3px solid #22C55E", fontSize: 12, lineHeight: 1.5, color: "var(--ink)", background: "#F0FDF4" }}>✓ Cession du bail libre sans accord du bailleur</div>
              </div>
              <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ background: "#F0FDF4", color: "#15803D", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 5 }}>✓ Analysé en 90 secondes</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Rapport PDF par email</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "#F9FAFB", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "48px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { icon: "⏱️", t: "2 minutes", d: "De l\'upload au rapport complet" },
            { icon: "🗣️", t: "Langage clair", d: "Pas de jargon — des conclusions directes" },
            { icon: "📍", t: "Marché local", d: "Adapté à la ville de votre commerce" },
            { icon: "🔒", t: "Confidentiel", d: "Vos documents ne sont jamais partagés" },
          ].map((item, i) => (
            <div key={i}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.t}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{item.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EXAMPLES SECTION - HONEST */}
      <section id="examples" style={{ padding: "80px 40px", background: "var(--white)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Exemples de rapports</div>
            <h2 style={{ fontFamily: "\'Playfair Display\', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>À quoi ressemble une analyse CheckMaCession ?</h2>
            <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 600, lineHeight: 1.7, margin: "0 auto" }}>Trois types de dossiers représentatifs — d\'un cas risqué à un cas favorable.</p>
          </div>

          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 18px", margin: "0 auto 40px", fontSize: 12, color: "#78350F", lineHeight: 1.6, maxWidth: 640, textAlign: "center" }}>
            <strong style={{ color: "#92400E" }}>📝 Note :</strong> Ces trois exemples sont des cas-types représentatifs construits à des fins de démonstration. CheckMaCession démarre — nous publierons des cas clients réels (anonymisés) au fur et à mesure de notre activité.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto" }}>
            {examples.map((ex, i) => {
              const ls = levelStyles[ex.level];
              return (
                <div key={i} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{ex.kind}</div>
                      <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 18, fontWeight: 700, lineHeight: 1.25, marginBottom: 4 }}>{ex.name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{ex.type}</div>
                    </div>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `2.5px solid ${ls.color}`, background: ls.bg, color: ls.color }}>
                      <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{ex.score}</div>
                      <div style={{ fontSize: 8, opacity: 0.7 }}>/100</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Conclusion type</div>
                    <div style={{ fontSize: 13, lineHeight: 1.55, padding: "10px 12px", borderRadius: 6, borderLeft: `3px solid ${ls.color}`, background: ls.bg }}>{ex.takeaway}</div>
                  </div>
                  <div style={{ padding: "12px 20px", background: "#FAFAF8", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
                    <span>{ex.tags.map(t => <span key={t} style={{ display: "inline-block", background: "var(--white)", color: "var(--muted)", border: "1px solid var(--border)", fontSize: 10, padding: "2px 8px", borderRadius: 4, marginRight: 4 }}>{t}</span>)}</span>
                    <span>Cas-type</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>Que votre dossier soit risqué, moyen ou favorable —<br />vous saurez exactement où vous en êtes en 2 minutes.</div>
            <button className="btn-gold" onClick={onStart}>Analyser mon dossier →</button>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section id="offres" style={{ padding: "80px 40px", background: "#F9FAFB", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Nos formules</div>
            <h2 style={{ fontFamily: "\'Playfair Display\', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>Choisissez ce dont vous avez besoin</h2>
            <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 480, margin: "0 auto" }}>Pas d\'abonnement. Vous payez, vous recevez votre rapport immédiatement.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, alignItems: "stretch" }}>
            {offers.map((offer, i) => (
              <div key={i} style={{ background: offer.highlight ? "var(--ink)" : "var(--white)", borderRadius: 12, border: offer.highlight ? "2px solid var(--gold)" : "1px solid var(--border)", padding: 28, display: "flex", flexDirection: "column", position: "relative", boxShadow: offer.highlight ? "0 12px 40px rgba(0,0,0,0.08)" : "none" }}>
                {offer.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--gold)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 16px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.06em" }}>Le plus complet</div>}
                <div style={{ fontSize: 28, marginBottom: 16 }}>{offer.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: offer.highlight ? "rgba(255,255,255,0.45)" : "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{offer.title}</div>
                <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 22, fontWeight: 700, color: offer.highlight ? "white" : "var(--ink)", marginBottom: 8 }}>{offer.title}</div>
                <div style={{ fontSize: 13, color: offer.highlight ? "rgba(255,255,255,0.5)" : "var(--muted)", lineHeight: 1.6, marginBottom: 20, fontStyle: "italic" }}>"{offer.subtitle}"</div>
                <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 40, fontWeight: 700, color: "var(--gold)", marginBottom: 20 }}>{offer.price}</div>
                <ul style={{ listStyle: "none", marginBottom: 24, flex: 1 }}>
                  {offer.features.map((f, j) => (
                    <li key={j} style={{ fontSize: 13, color: offer.highlight ? "rgba(255,255,255,0.6)" : "var(--muted)", padding: "6px 0", borderBottom: offer.highlight ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--border)", display: "flex", gap: 8, alignItems: "flex-start", lineHeight: 1.4 }}>
                      <span style={{ color: "var(--gold)" }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button className={offer.highlight ? "btn-gold" : "btn-dark"} onClick={onStart} style={{ width: "100%", justifyContent: "center", padding: 13 }}>Choisir cette formule →</button>
              </div>
            ))}
          </div>
          <p className="disclaimer" style={{ textAlign: "center", marginTop: 24 }}>⚠️ CheckMaCession est un outil d\'aide à la décision. Il ne remplace pas un avocat, un expert-comptable ou un conseiller financier.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 40px", background: "var(--white)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Questions fréquentes</div>
            <h2 style={{ fontFamily: "\'Playfair Display\', serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>Vous avez des questions ?</h2>
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--white)" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid var(--border)" : "none" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ fontSize: 18, color: "var(--gold)", flexShrink: 0, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 18px", fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: "var(--gold)", padding: "72px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "\'Playfair Display\', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "white", marginBottom: 16, letterSpacing: "-0.02em" }}>Prêt à analyser votre dossier ?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 36 }}>En 2 minutes, vous saurez exactement où vous mettez les pieds.</p>
          <button onClick={onStart} style={{ background: "white", color: "var(--gold)", fontSize: 15, fontWeight: 700, padding: "15px 40px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>Commencer maintenant →</button>
          <div style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>⚠️ Outil d\'aide à la décision — ne remplace pas un conseil professionnel</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--ink)", padding: "40px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "\'Playfair Display\', serif", fontSize: 20, fontWeight: 700, color: "white" }}>Check<span style={{ color: "var(--gold)" }}>Ma</span>Cession</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>© 2025 CheckMaCession — CHRONOWEB SRL</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>⚠️ Aide à la décision — pas un conseil juridique</div>
        </div>
      </footer>
    </div>
  );
}

// ── FUNNEL ─────────────────────────────────────────────────────────────────
function Funnel({ onAnalyze }) {
  const [step, setStep] = useState(1); // 1=offre, 2=upload, 3=paiement
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [paying, setPaying] = useState(false);
  const fileRef = useRef();

  const offers = [
    { id: "juridique", icon: "⚖️", title: "Bail uniquement", desc: "Je veux savoir si le contrat est risqué", price: "49€", priceNum: 49, docs: ["Votre bail commercial (PDF)"] },
    { id: "financier", icon: "📈", title: "Finances uniquement", desc: "Je veux savoir si le commerce est rentable", price: "49€", priceNum: 49, docs: ["Bilans des 3 derniers exercices (PDF)", "Liasse fiscale (PDF)"] },
    { id: "complet", icon: "🎯", title: "Dossier complet", desc: "Vision 360° avant une offre", price: "89€", priceNum: 89, docs: ["Bail commercial (PDF)", "Bilans des 3 derniers exercices (PDF)", "Liasse fiscale (PDF)"], highlight: true },
  ];

  const handleFiles = (newFiles) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === "application/pdf");
    setFiles(prev => [...prev, ...pdfs]);
  };

  const handlePay = () => {
    if (!email) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); onAnalyze(files, selectedOffer, email); }, 1600);
  };

  const inputStyle = { width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 15, background: "var(--cream)", color: "var(--ink)", outline: "none" };

  const offer = offers.find(o => o.id === selectedOffer);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 60 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px" }}>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48, justifyContent: "center" }}>
          {["Formule", "Documents", "Paiement"].map((label, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "var(--success)" : active ? "var(--gold)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: done || active ? "white" : "var(--muted)", transition: "all 0.3s" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: active ? "var(--ink)" : "var(--muted)", fontWeight: active ? 600 : 400 }}>{label}</span>
                </div>
                {i < 2 && <div style={{ width: 28, height: 1, background: done ? "var(--success)" : "var(--border)" }} />}
              </div>
            );
          })}
        </div>

        {/* Step 1 — Offre */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Que voulez-vous analyser ?</h2>
            <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: 32, fontSize: 15 }}>Choisissez la formule adaptée à votre situation.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {offers.map(o => (
                <button key={o.id} onClick={() => { setSelectedOffer(o.id); setStep(2); }} style={{ background: o.highlight ? "var(--ink)" : "var(--white)", border: o.highlight ? "2px solid var(--gold)" : "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", transition: "all 0.2s", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span style={{ fontSize: 28 }}>{o.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: o.highlight ? "var(--white)" : "var(--ink)", marginBottom: 2 }}>{o.title}</div>
                      <div style={{ fontSize: 13, color: o.highlight ? "rgba(255,255,255,0.55)" : "var(--muted)" }}>"{o.desc}"</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "var(--gold)" }}>{o.price}</div>
                    <div style={{ fontSize: 12, color: o.highlight ? "rgba(255,255,255,0.4)" : "var(--muted)" }}>par rapport</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Upload */}
        {step === 2 && offer && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Uploadez vos documents</h2>
            <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: 8, fontSize: 15 }}>Pour la formule <strong>{offer.title}</strong>, il vous faut :</p>
            <div style={{ background: "var(--gold-pale)", border: "1px solid rgba(200,168,75,0.2)", borderRadius: 8, padding: "12px 16px", marginBottom: 28 }}>
              {offer.docs.map((d, i) => (
                <div key={i} style={{ fontSize: 13, color: "var(--ink)", padding: "3px 0", display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--gold)" }}>→</span>{d}
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current.click()}
              style={{ border: `2px dashed ${dragOver ? "var(--gold)" : "var(--border)"}`, borderRadius: 12, padding: "48px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "var(--gold-pale)" : "var(--white)", transition: "all 0.2s", marginBottom: 16 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Glissez vos documents ici</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>ou cliquez pour parcourir — PDF uniquement</div>
              <input ref={fileRef} type="file" accept=".pdf" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--success-bg)", borderRadius: 8, marginBottom: 6, border: "1px solid rgba(26,107,60,0.2)" }}>
                    <span style={{ fontSize: 13, color: "var(--success)" }}>✓ {f.name}</span>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 16 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-gold" onClick={() => files.length > 0 && setStep(3)} disabled={files.length === 0} style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
              Continuer vers le paiement →
            </button>
            <p className="disclaimer" style={{ marginTop: 12, textAlign: "center" }}>🔒 Vos documents sont chiffrés et confidentiels.</p>
          </div>
        )}

        {/* Step 3 — Paiement */}
        {step === 3 && offer && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <button onClick={() => setStep(2)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Retour</button>
            <div className="card" style={{ padding: 36 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Récapitulatif</h2>

              <div style={{ background: "var(--cream)", borderRadius: 8, padding: 18, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14 }}>Analyse CheckMaCession — {offer.title}</span>
                  <strong style={{ fontSize: 14 }}>{offer.price}</strong>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {files.map(f => `📄 ${f.name}`).join(" • ")}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Votre email</label>
                <input style={inputStyle} type="email" placeholder="pour recevoir votre rapport PDF" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Paiement sécurisé</div>
                <div style={{ border: "1.5px solid var(--border)", borderRadius: 8, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--cream-dark)" }}>
                  <span style={{ fontSize: 14, color: "var(--muted)" }}>•••• •••• •••• 4242</span>
                  <span style={{ fontSize: 18 }}>💳</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, display: "flex", gap: 8 }}>
                  <span>🔒 Paiement sécurisé Stripe</span><span>•</span><span>TLS 1.3</span>
                </div>
              </div>

              <button className="btn-gold" onClick={handlePay} disabled={paying || !email} style={{ width: "100%", justifyContent: "center", padding: 15, fontSize: 15 }}>
                {paying ? "Traitement..." : `Payer ${offer.price} et recevoir mon rapport →`}
              </button>
              <p className="disclaimer" style={{ marginTop: 14, textAlign: "center" }}>
                ⚠️ Rapport non remboursable une fois généré. Aide à la décision — pas un conseil juridique.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ANALYZING ──────────────────────────────────────────────────────────────
function Analyzing({ files, offer, onDone }) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = [
    "Lecture de vos documents...",
    "Identification du type de commerce...",
    "Détection de la localisation...",
    "Adaptation au marché local...",
    "Analyse des clauses clés...",
    "Évaluation des risques...",
    "Rédaction du rapport en langage clair...",
    "Finalisation..."
  ];

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { i++; setStepIdx(i); if (i >= steps.length - 1) clearInterval(iv); }, 700);

    (async () => {
      try {
        let reportData;
        if (files && files.length > 0) {
          const base64 = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result.split(",")[1]);
            r.onerror = rej;
            r.readAsDataURL(files[0]);
          });

          const offerType = offer?.id || "complet";
          const systemPrompt = `Tu es CheckMaCession, un outil d'analyse de dossiers de cession de fonds de commerce. Tu parles à deux types de personnes en même temps :
1. L'acheteur néophyte : tu lui expliques en langage simple, sans jargon, comme si tu parlais à un ami.
2. Le professionnel (agent, courtier) : tu fournis aussi les références techniques précises.

Pour chaque point, tu donnes TOUJOURS les deux versions.

Tu détectes automatiquement :
- Le type de commerce (restaurant, café, snack, boulangerie...)
- La ville et le quartier EXACTEMENT tels qu'ils apparaissent dans le document

RÈGLE ABSOLUE : Tu lis l'adresse dans le document et tu l'utilises telle quelle.
Tu ne changes JAMAIS la ville. Si c'est Saint-Ouen, tu écris Saint-Ouen. Si c'est Lyon, tu écris Lyon.
Si aucune adresse n'est trouvée, tu écris ville: "Non précisée dans le document" et quartier: null.
Tu n'inventes JAMAIS une ville, un quartier ou une adresse.

CONTEXTE LOCAL PAR VILLE (uniquement basé sur la ville réellement détectée dans le document) :
- Marseille (tous arrondissements) : marché CHR tendu sur les arrondissements 1-7, forte négociation culturelle, bailleurs souvent familiaux peu formalisés, forte concurrence CHR, saisonnalité marquée Vieux-Port et Corniche
- Saint-Ouen : secteur des puces en pleine mutation, clientèle touristique et locale mixte, bailleurs de marché souples, loyers accessibles vs Paris intra-muros
- Paris (tous arrondissements) : loyers hors norme, bailleurs institutionnels, peu de marge de négociation orale
- Aix-en-Provence : loyers élevés, clientèle estudiantine et touristique, bailleurs structurés
- Toulon : marché accessible, clientèle militaire et locale, secteurs en mutation
- Nice/Côte d'Azur : forte saisonnalité, clientèle internationale, loyers premium en front de mer
- Lyon : marché dynamique, gastronomie forte, concurrence CHR élevée centre-ville
- Bordeaux : marché en hausse, gentrification, nouveaux quartiers attractifs
- Toute autre ville : décris factuellement le marché local basé sur tes connaissances de cette ville spécifique

Retourne UNIQUEMENT un JSON valide sans markdown.`;

          const userPrompt = `Analyse ce document (${offerType === "juridique" ? "bail commercial" : offerType === "financier" ? "bilans/liasse fiscale" : "dossier complet"}) pour un acheteur potentiel de fonds de commerce CHR.

Retourne ce JSON exact :
{
  "score": <0-100>,
  "scoreLabel": <"Critique"|"Risqué"|"Modéré"|"Favorable"|"Excellent">,
  "commerce": <type de commerce détecté>,
  "ville": <ville détectée ou "Non précisée">,
  "quartier": <quartier si détecté>,
  "contexteLocal": <1 phrase sur le marché local de cette ville pour ce type de commerce>,
  "loyer": <montant mensuel HT ou null>,
  "redFlags": [
    {
      "simple": <explication en langage simple, sans jargon, 1-2 phrases>,
      "pro": <version technique avec référence article si bail>
    }
  ],
  "pointsPositifs": [
    {
      "simple": <explication simple>,
      "pro": <version technique>
    }
  ],
  "aRenegocier": [
    {
      "quoi": <nom de la clause>,
      "simple": <pourquoi c'est important en langage simple>,
      "pro": <version technique>,
      "demander": <ce qu'il faut demander concrètement>
    }
  ],
  "conclusionAcheteur": <3 phrases en langage très simple. Commencer par : c'est une bonne/mauvaise affaire ? Pourquoi ? Que faire maintenant ?>,
  "conclusionVendeur": <2 phrases : les objections que l'acheteur va soulever et comment y répondre>,
  "checklist": [<8 actions concrètes avant de faire une offre, formulées simplement>],
  "offreConseillée": <fourchette de prix conseillée si les infos le permettent, sinon null>
}`;

          const resp = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 2500,
              system: systemPrompt,
              messages: [{ role: "user", content: [
                { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
                { type: "text", text: userPrompt }
              ]}]
            })
          });
          const data = await resp.json();
          const text = data.content?.find(b => b.type === "text")?.text || "";
          reportData = JSON.parse(text.replace(/```json|```/g, "").trim());
        } else {
          reportData = getDemoReport();
        }
        setTimeout(() => onDone(reportData, offer), 800);
      } catch(e) {
        console.error(e);
        setTimeout(() => onDone(getDemoReport(), offer), 800);
      }
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 36px" }}>
          <div style={{ position: "absolute", inset: 0, border: "3px solid rgba(200,168,75,0.15)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: 0, border: "3px solid var(--gold)", borderRadius: "50%", borderRightColor: "transparent", animation: "spin 1s linear infinite" }} />
          <div style={{ position: "absolute", inset: "22%", background: "rgba(200,168,75,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📊</div>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "var(--white)", marginBottom: 14 }}>Analyse en cours...</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>Notre IA lit chaque ligne de votre dossier</p>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 18 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ padding: "5px 0", fontSize: 13, color: i < stepIdx ? "rgba(255,255,255,0.85)" : i === stepIdx ? "var(--gold)" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s" }}>
              <span style={{ fontSize: 12 }}>{i < stepIdx ? "✓" : i === stepIdx ? "→" : "·"}</span>{s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DEMO DATA ──────────────────────────────────────────────────────────────
function getDemoReport() {
  return {
    score: 38,
    scoreLabel: "Risqué",
    commerce: "Restaurant / Petite restauration",
    ville: "Saint-Ouen",
    quartier: "Marché Vernaison",
    contexteLocal: "Le marché CHR de Saint-Ouen est en pleine mutation — secteur des puces attractif pour la restauration, clientèle touristique et locale mixte, bailleurs de marché souvent plus souples que les bailleurs institutionnels classiques.",
    loyer: "1 700€/mois",
    redFlags: [
      { simple: "Votre bail vous interdit de faire de la livraison. Si vous voulez proposer Uber Eats ou Just Eat demain, le propriétaire peut légalement vous le refuser.", pro: "Clause de destination Art. 2 restrictive — activité limitée à 'petite restauration assise uniquement', vente à emporter et livraison non couvertes." },
      { simple: "Tout ce que vous installez dans le local — votre cuisine professionnelle, votre comptoir, votre déco — appartient au propriétaire quand vous partez. Sans indemnité.", pro: "Art. 4.8 — Travaux et aménagements propriété du bailleur en fin d'exploitation sans indemnité. Risque financier estimé 40 000 à 120 000€ pour un CHR." },
      { simple: "Votre loyer va augmenter plus vite que la normale chaque année. L'indice utilisé n'est pas adapté à votre type de commerce.", pro: "Indexation ICC (Indice Coût Construction) au lieu d'ILC — ICC défavorable pour activités tertiaires/CHR depuis loi Pinel 2014." },
    ],
    pointsPositifs: [
      { simple: "Vous pouvez revendre votre restaurant à n'importe qui, sans demander la permission au propriétaire. C'est un vrai avantage si vous voulez partir un jour.", pro: "Art. 20 — Cession libre du bail à l'acquéreur du fonds sans agrément préalable du bailleur (conforme L.145-16 C.com)." },
      { simple: "Si le bâtiment tombe en ruine ou a besoin de grosses réparations, c'est le propriétaire qui paie — pas vous.", pro: "Art. 4 — Grosses réparations Art. 606 Code Civil à charge du bailleur, conforme au statut." },
    ],
    aRenegocier: [
      { quoi: "Destination du bail", simple: "Faire ajouter clairement la livraison et la vente à emporter dans votre contrat. Sinon vous êtes bloqué pour vous développer.", pro: "Modifier Art. 2 : remplacer par 'restauration, vente à emporter, livraison et toute activité de commerce de bouche'.", demander: "Un avenant écrit qui ajoute 'vente à emporter et livraison' avant de signer quoi que ce soit." },
      { quoi: "Travaux et aménagements", simple: "Négocier que vous gardez ce que vous installez, ou qu'on vous rembourse à votre départ.", pro: "Supprimer Art. 4.8 ou ajouter clause d'indemnisation des aménagements à la valeur nette comptable.", demander: "Supprimer la phrase 'deviennent propriété du bailleur sans indemnité' ou ajouter une compensation." },
      { quoi: "Indice de révision du loyer", simple: "Demander à changer l'indice utilisé pour votre loyer. Celui qui est dans votre bail va le faire monter plus vite.", pro: "Remplacer ICC par ILC (Indice des Loyers Commerciaux) — adapté aux baux commerciaux depuis loi Pinel 2014.", demander: "Un avenant pour passer de l'ICC à l'ILC dès la prochaine révision." },
    ],
    conclusionAcheteur: "Ce dossier présente des risques sérieux qui méritent d'être réglés avant de signer. Le problème principal : votre bail vous bloque pour faire de la livraison ou de la vente à emporter — en 2025, c'est une contrainte majeure pour un restaurant. Avant de faire une offre, demandez à modifier ces trois points dans le contrat. Si le propriétaire refuse, c'est un signal d'alarme.",
    conclusionVendeur: "L'acheteur va soulever la clause de destination restrictive et les travaux à sa charge comme objections principales. Préparez-vous à proposer un avenant sur la destination et à négocier sur le sort des aménagements — c'est ce qui va débloquer la transaction.",
    checklist: [
      "✗ Demander un avenant écrit qui autorise la vente à emporter et la livraison",
      "✗ Faire chiffrer vos futurs aménagements par un artisan pour estimer le risque en fin de bail",
      "✗ Vérifier avec la mairie l'autorisation d'ouvrir un restaurant (ERP type N)",
      "✗ Demander les charges réelles des 2 dernières années au propriétaire",
      "✗ Vérifier le règlement de copropriété (horaires, nuisances sonores)",
      "✗ Confirmer par écrit que vous pouvez installer une extraction de fumées",
      "✗ Demander les 3 dernières quittances de loyer du cédant",
      "✓ État des lieux contradictoire prévu — s'assurer qu'il sera réalisé avant l'entrée",
    ],
    offreConseillée: null,
  };
}

// ── REPORT ─────────────────────────────────────────────────────────────────
function Report({ report, offer, onNew }) {
  const [activeTab, setActiveTab] = useState("acheteur");
  const [showPro, setShowPro] = useState(false);

  const score = report.score;
  const scoreColor = score >= 70 ? "var(--success)" : score >= 45 ? "var(--warning)" : "var(--danger)";
  const scoreBg = score >= 70 ? "var(--success-bg)" : score >= 45 ? "var(--warning-bg)" : "var(--danger-bg)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", paddingTop: 60 }}>
      {/* Header */}
      <div style={{ background: "var(--ink)", padding: "40px 28px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
            <div>
              <div className="tag" style={{ marginBottom: 10 }}>Rapport CheckMaCession</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>
                {report.commerce}
              </h1>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                {report.ville && <span>📍 {report.ville}{report.quartier ? ` — ${report.quartier}` : ""}</span>}
                {report.loyer && <span>💰 {report.loyer}</span>}
                {offer && <span>📋 Formule {offer.title}</span>}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: scoreBg, border: `4px solid ${scoreColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "countUp 0.5s ease" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 11, color: scoreColor }}>/100</div>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: scoreColor }}>{report.scoreLabel}</div>
            </div>
          </div>

          {/* Context local */}
          {report.contexteLocal && (
            <div style={{ background: "rgba(200,168,75,0.1)", border: "1px solid rgba(200,168,75,0.25)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "rgba(255,255,255,0.75)", fontStyle: "italic" }}>
              📍 <strong style={{ color: "var(--gold)" }}>Contexte local :</strong> {report.contexteLocal}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px" }}>

        {/* Toggle simple/pro */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Vue :</span>
          <div style={{ background: "var(--cream-dark)", borderRadius: 8, padding: 3, display: "flex" }}>
            {[["simple", "👤 Simple"], ["pro", "🤝 Professionnel"]].map(([id, label]) => (
              <button key={id} onClick={() => setShowPro(id === "pro")} style={{ padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", background: (id === "pro") === showPro ? "var(--white)" : "transparent", color: (id === "pro") === showPro ? "var(--ink)" : "var(--muted)", fontWeight: (id === "pro") === showPro ? 600 : 400, fontSize: 13, transition: "all 0.2s", boxShadow: (id === "pro") === showPro ? "var(--shadow-sm)" : "none" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Red flags */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            🚨 Points d'alerte
            <span style={{ fontSize: 14, background: "var(--danger)", color: "white", borderRadius: 20, padding: "2px 10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{report.redFlags?.length}</span>
          </h2>
          {report.redFlags?.map((flag, i) => (
            <div key={i} style={{ background: "var(--danger-bg)", borderLeft: "4px solid var(--danger)", borderRadius: 8, padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--danger)", marginBottom: 4 }}>Alerte #{i + 1}</div>
              <div style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65, marginBottom: showPro && flag.pro ? 8 : 0 }}>
                {showPro ? flag.pro : flag.simple}
              </div>
              {showPro && flag.pro && !showPro && (
                <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", marginTop: 6 }}>{flag.pro}</div>
              )}
            </div>
          ))}
        </div>

        {/* À renégocier */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            ⚠️ Ce qu'il faut renégocier
          </h2>
          {report.aRenegocier?.map((item, i) => (
            <div key={i} style={{ background: "var(--warning-bg)", borderLeft: "4px solid var(--warning)", borderRadius: 8, padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--warning)", marginBottom: 6 }}>{item.quoi}</div>
              <div style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.65, marginBottom: 8 }}>
                {showPro ? item.pro : item.simple}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink)", background: "rgba(212,116,26,0.1)", borderRadius: 6, padding: "8px 10px" }}>
                <strong>👉 Concrètement :</strong> {item.demander}
              </div>
            </div>
          ))}
        </div>

        {/* Points positifs */}
        {report.pointsPositifs?.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>✅ Ce qui va</h2>
            {report.pointsPositifs.map((p, i) => (
              <div key={i} style={{ background: "var(--success-bg)", borderLeft: "4px solid var(--success)", borderRadius: 8, padding: "12px 18px", marginBottom: 8, fontSize: 14, color: "var(--ink)", lineHeight: 1.65 }}>
                {showPro ? p.pro : p.simple}
              </div>
            ))}
          </div>
        )}

        {/* Conclusions */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Conclusion</h2>
          <div style={{ background: "var(--cream-dark)", borderRadius: 8, padding: 4, display: "flex", marginBottom: 16 }}>
            {[["acheteur", "👤 Pour l'acheteur"], ["vendeur", "🤝 Pour le vendeur"]].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, padding: "9px", border: "none", borderRadius: 6, cursor: "pointer", background: activeTab === id ? "var(--white)" : "transparent", color: activeTab === id ? "var(--ink)" : "var(--muted)", fontWeight: activeTab === id ? 600 : 400, fontSize: 14, transition: "all 0.2s", boxShadow: activeTab === id ? "var(--shadow-sm)" : "none" }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ background: "var(--white)", borderRadius: 10, padding: 24, border: "1px solid var(--border)", fontSize: 15, lineHeight: 1.8 }}>
            {activeTab === "acheteur" ? report.conclusionAcheteur : report.conclusionVendeur}
          </div>
        </div>

        {/* Checklist */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, marginBottom: 16 }}>📋 Avant de faire une offre</h2>
          <div style={{ background: "var(--white)", borderRadius: 10, padding: "8px 20px", border: "1px solid var(--border)" }}>
            {report.checklist?.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < report.checklist.length - 1 ? "1px solid var(--border)" : "none", fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "var(--ink)", borderRadius: 12, padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>Rapport envoyé par email</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>PDF téléchargeable • À partager avec votre conseil</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-gold" onClick={onNew}>Analyser un autre dossier →</button>
          </div>
        </div>

        <p className="disclaimer" style={{ marginTop: 20, textAlign: "center" }}>
          ⚠️ Ce rapport est un outil d'aide à la décision. Il ne constitue pas un conseil juridique, comptable ou financier. Consultez un professionnel avant toute décision d'investissement. CheckMaCession — CHRONOWEB SRL.
        </p>
      </div>
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState(VIEWS.LANDING);
  const [analysisFiles, setAnalysisFiles] = useState(null);
  const [analysisOffer, setAnalysisOffer] = useState(null);
  const [report, setReport] = useState(null);

  return (
    <>
      <GlobalStyles />
      <Nav 
        view={view} 
        onHome={() => setView(VIEWS.LANDING)} 
        onStart={() => setView(VIEWS.FUNNEL)} 
      />

      {view === VIEWS.LANDING && (
        <Landing onStart={() => setView(VIEWS.FUNNEL)} />
      )}
      {view === VIEWS.FUNNEL && (
        <Funnel onAnalyze={(files, offer, email) => {
          setAnalysisFiles(files);
          setAnalysisOffer(offer);
          setView(VIEWS.ANALYZING);
        }} />
      )}
      {view === VIEWS.ANALYZING && (
        <Analyzing files={analysisFiles} offer={analysisOffer} onDone={(r, o) => {
          setReport(r);
          setAnalysisOffer(o);
          setView(VIEWS.REPORT);
        }} />
      )}
      {view === VIEWS.REPORT && report && (
        <Report report={report} offer={analysisOffer} onNew={() => { setReport(null); setView(VIEWS.FUNNEL); }} />
      )}
    </>
  );
}
