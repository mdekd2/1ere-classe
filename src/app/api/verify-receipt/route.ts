import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic'

const RECEIPT_SECRET_KEY = process.env.RECEIPT_SECRET_KEY || 'your-secret-key-here';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const signature = searchParams.get('signature');
    const bookingId = searchParams.get('bookingId');

    if (!signature || !bookingId) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Signature ou ID de réservation manquant' 
      }, { status: 400 });
    }

    // TODO: Retrieve receipt data from database using bookingId
    // For now, we'll simulate verification
    const storedReceiptData = await getReceiptFromDatabase(bookingId);
    
    if (!storedReceiptData) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Reçu non trouvé dans la base de données' 
      }, { status: 404 });
    }

    // Verify signature
    const dataString = JSON.stringify(storedReceiptData);
    const expectedSignature = crypto
      .createHmac('sha256', RECEIPT_SECRET_KEY)
      .update(dataString)
      .digest('hex');

    const isValid = signature === expectedSignature;

    return NextResponse.json({
      valid: isValid,
      receipt: isValid ? storedReceiptData : null,
      message: isValid ? 'Reçu authentique' : 'Reçu invalide ou modifié',
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error verifying receipt:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Erreur lors de la vérification' 
    }, { status: 500 });
  }
}

// Mock function to get receipt from database
async function getReceiptFromDatabase(bookingId: string) {
  // TODO: Implement database query
  // This should return the original receipt data stored when the receipt was generated
  console.log('Retrieving receipt from database:', bookingId);
  
  // For demo purposes, return mock data
  return {
    bookingId,
    tripDetails: {
      from: 'Nouakchott',
      to: 'Nouadhibou',
      departureDate: '2024-01-15',
      departureTime: '08:00'
    },
    passengerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+222123456789'
    },
    paymentInfo: {
      paymentId: 'bpay_123456789',
      amount: 5000,
      method: 'BPay'
    },
    selectedSeats: ['A1', 'A2'],
    timestamp: '2024-01-15T08:00:00.000Z'
  };
} 