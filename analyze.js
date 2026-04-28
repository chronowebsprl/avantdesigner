import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { base64, offerType = "complet" } = req.body || {};
    if (!base64) return res.status(400).json({ error: "Document manquant" });

    const system = `Tu es CheckMaCession, un outil d'aide à la décision pour dossiers de cession/reprise de fonds de commerce. Tu réponds uniquement en JSON valide. Tu n'inventes jamais une ville, une adresse, un loyer ou un chiffre absent du document.`;
    const prompt = `Analyse ce document pour une formule ${offerType}. Retourne un JSON avec score, scoreLabel, commerce, ville, quartier, contexteLocal, loyer, redFlags, pointsPositifs, aRenegocier, conclusionAcheteur, conclusionVendeur, checklist, offreConseillée.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system,
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
          { type: "text", text: prompt }
        ]
      }]
    });

    const text = message.content?.find((b) => b.type === "text")?.text || "{}";
    const cleaned = text.replace(/```json|```/g, "").trim();
    res.status(200).json(JSON.parse(cleaned));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
