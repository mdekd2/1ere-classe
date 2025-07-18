// app/api/bpay-callback/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const { reference, status, transaction_id } = payload;

    if (status === "SUCCESS") {
      // ⚠️ TODO: Marquer la réservation dans la DB comme "payée"
      console.log(`Paiement confirmé pour ${reference}, txn: ${transaction_id}`);
    } else {
      console.warn(`Paiement échoué pour ${reference}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur callback BPay:", error);
    return NextResponse.json({ error: "Erreur traitement callback" }, { status: 500 });
  }
} 