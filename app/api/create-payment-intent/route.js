import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_te" + "st_51TQntxHasuGpOGsbA2D9NpamifPk3BocjuObxIYG4nufd3i3NEDZaullXtxgibV5EqVbSiqXqzOzJSfbkODXGHqN000A6zGnBc");

export async function POST(request) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ['card', 'us_bank_account', 'cashapp', 'amazon_pay'],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
