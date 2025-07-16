// app/api/pay-with-bpay/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, phone, bookingId } = await req.json();

    // Mock BPay implementation for testing
    console.log('Mock BPay Payment:', { amount, phone, bookingId });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful payment
    const mockPaymentId = `bpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock response - in real implementation, this would come from BPay API
    const mockResponse = {
      payment_id: mockPaymentId,
      status: 'success',
      amount: amount,
      phone: phone,
      reference: bookingId,
      timestamp: new Date().toISOString(),
      redirect_url: null // No redirect needed for mock
    };

    console.log('Mock BPay Success:', mockResponse);

    return NextResponse.json({
      success: true,
      paymentId: mockPaymentId,
      message: 'Paiement simulé avec succès',
      data: mockResponse
    });

  } catch (error) {
    console.error("Erreur API BPay:", error);
    return NextResponse.json({ 
      error: "Erreur serveur", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 