import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, credits } = session.metadata || {};

    if (!userId || !credits) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const creditsToAdd = parseInt(credits, 10);

    const { error: upsertError } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_credits: creditsToAdd,
    });

    if (upsertError) {
      console.error('Failed to add credits:', upsertError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    await supabase.from('transactions').insert({
      user_id: userId,
      credits_added: creditsToAdd,
      stripe_session_id: session.id,
      amount_cents: session.amount_total,
    });
  }

  return NextResponse.json({ received: true });
}
