import { NextRequest, NextResponse } from 'next/server'
import { generateReceiptPDF } from '@/lib/receiptGenerator'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { bookingId, tripDetails, passengerInfo, paymentInfo, selectedSeats } = await req.json();

    // Generate digital signature
    const receiptData = {
      bookingId,
      tripDetails,
      passengerInfo,
      paymentInfo,
      selectedSeats,
      timestamp: new Date().toISOString()
    };
    
    const dataString = JSON.stringify(receiptData);
    const signature = crypto
      .createHmac('sha256', RECEIPT_SECRET_KEY)
      .update(dataString)
      .digest('hex');

    // Generate verification URL with signature
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-receipt?signature=${signature}&bookingId=${bookingId}`;

    // Create PDF document
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('1ere Classe', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Transport de Passagers', 105, 30, { align: 'center' });
    
    // Add receipt title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Reçu de Paiement', 105, 45, { align: 'center' });
    
    // Add booking details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 60;
    
    // Booking information
    doc.setFont('helvetica', 'bold');
    doc.text('Informations de Réservation:', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Numéro de réservation: ${bookingId}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Heure: ${new Date().toLocaleTimeString('fr-FR')}`, 20, yPosition);
    yPosition += 12;
    
    // Trip details
    doc.setFont('helvetica', 'bold');
    doc.text('Détails du Voyage:', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Trajet: ${tripDetails.from} → ${tripDetails.to}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Date de départ: ${tripDetails.departureDate}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Heure de départ: ${tripDetails.departureTime}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Places: ${selectedSeats.join(', ')}`, 20, yPosition);
    yPosition += 12;
    
    // Passenger information
    doc.setFont('helvetica', 'bold');
    doc.text('Informations Passager:', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom: ${passengerInfo.name}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Email: ${passengerInfo.email}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Téléphone: ${passengerInfo.phone}`, 20, yPosition);
    yPosition += 12;
    
    // Payment information
    doc.setFont('helvetica', 'bold');
    doc.text('Informations de Paiement:', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Méthode: BPay`, 20, yPosition);
    yPosition += 6;
    doc.text(`ID de paiement: ${paymentInfo.paymentId}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Montant: ${paymentInfo.amount} MRU`, 20, yPosition);
    yPosition += 6;
    doc.text(`Statut: Payé`, 20, yPosition);
    yPosition += 12;
    
    // Total
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${paymentInfo.amount} MRU`, 20, yPosition);
    yPosition += 20;
    
    // Security section
    doc.setFont('helvetica', 'bold');
    doc.text('Sécurité:', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Signature: ${signature.substring(0, 16)}...`, 20, yPosition);
    yPosition += 5;
    doc.text(`Vérifier: ${verificationUrl}`, 20, yPosition);
    yPosition += 10;
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci de votre confiance!', 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text('1ere Classe - Transport de Passagers', 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text('Ce reçu est sécurisé et vérifiable en ligne', 105, yPosition, { align: 'center' });
    
    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Store receipt data in database for verification (you'll need to implement this)
    await storeReceiptForVerification(bookingId, signature, receiptData);
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${bookingId}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la génération du reçu' 
    }, { status: 500 });
  }
}

// Function to store receipt data for verification
async function storeReceiptForVerification(bookingId: string, signature: string, receiptData: Record<string, unknown>) {
  // TODO: Store in database (Prisma/PostgreSQL)
  // This ensures receipts can be verified even if the PDF is modified
  console.log('Storing receipt for verification:', { bookingId, signature });
} 