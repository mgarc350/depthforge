import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
  });

  const CREDIT_AMOUNTS: Record<string, number> = {
    [process.env.STRIPE_PRICE_STARTER!]: 10,
    [process.env.STRIPE_PRICE_PRO!]: 50,
    [process.env.STRIPE_PRICE_STUDIO!]: 200,
  };

  const { priceId } = await req.json();

  if (!priceId || !CREDIT_AMOUNTS[priceId]) {
    return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 });
  }

  const origin = req.headers.get('origin') || 'https://depthforge.ai';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${origin}/?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?purchase=cancelled`,
    metadata: {
      userId,
      priceId,
      credits: CREDIT_AMOUNTS[priceId].toString(),
    },
  });

  return NextResponse.json({ url: session.url });
}
