import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_BY_OFFER = {
  juridique: 4900,
  financier: 4900,
  complet: 8900,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { offer = "complet", email } = req.body || {};
    const amount = PRICE_BY_OFFER[offer] || PRICE_BY_OFFER.complet;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: "Analyse CheckMaCession" },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${process.env.SITE_URL}/?payment=success`,
      cancel_url: `${process.env.SITE_URL}/?payment=cancel`,
      metadata: { offer },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
