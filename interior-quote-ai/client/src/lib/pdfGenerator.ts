import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

export interface QuotationData {
  id: number;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  projectType: string;
  area: number;
  budget: number;
  estimatedTimeline: string;
  selectedServices: string[];
  lineItems: Array<{
    itemName: string;
    quantity: number;
    rate: number;
    gstPercentage: number;
    discount: number;
  }>;
  subtotal: number;
  gstAmount: number;
  finalTotal: number;
  createdAt: Date;
}

export interface ProposalData {
  id: number;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  projectAddress?: string;
  projectType: string;
  area: number;
  budget: number;
  estimatedTimeline: string;
  selectedServices: string[];
  pricingSummary: {
    subtotal: number;
    gst: number;
    total: number;
  };
  termsAndConditions: string;
  createdAt: Date;
}

export async function generateQuotationPDF(data: QuotationData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(37, 99, 235); // Blue
  pdf.text('QUOTATION', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Quotation #${data.id}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

  // Client Information
  yPosition += 20;
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('CLIENT INFORMATION', 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.text(`Name: ${data.clientName}`, 20, yPosition);
  yPosition += 7;
  if (data.clientEmail) {
    pdf.text(`Email: ${data.clientEmail}`, 20, yPosition);
    yPosition += 7;
  }
  if (data.clientPhone) {
    pdf.text(`Phone: ${data.clientPhone}`, 20, yPosition);
    yPosition += 7;
  }

  // Project Details
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.text('PROJECT DETAILS', 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.text(`Project Type: ${data.projectType}`, 20, yPosition);
  yPosition += 7;
  pdf.text(`Area: ${data.area} sq ft`, 20, yPosition);
  yPosition += 7;
  pdf.text(`Budget: ₹${data.budget.toLocaleString()}`, 20, yPosition);
  yPosition += 7;
  pdf.text(`Timeline: ${data.estimatedTimeline}`, 20, yPosition);

  // Services
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.text('SERVICES INCLUDED', 20, yPosition);

  yPosition += 8;
  pdf.setFontSize(9);
  data.selectedServices.forEach((service) => {
    pdf.text(`• ${service}`, 25, yPosition);
    yPosition += 6;
  });

// Line Items Table
yPosition += 10;
pdf.setFontSize(12);
pdf.setTextColor(0, 0, 0);
pdf.text('LINE ITEMS', 20, yPosition);

yPosition += 10;

const tableRows = data.lineItems.map((item) => {
  const total =
    item.quantity * item.rate -
    item.discount +
    ((item.quantity * item.rate - item.discount) *
      item.gstPercentage) /
      100;

  return [
    item.itemName,
    item.quantity.toString(),
    `₹${item.rate.toLocaleString()}`,
    `${item.gstPercentage}%`,
    `₹${total.toFixed(2)}`,
  ];
});

autoTable(pdf, {
  startY: yPosition,
  head: [['Item', 'Qty', 'Rate', 'GST', 'Total']],
  body: tableRows,
  theme: 'grid',

  headStyles: {
    fillColor: [37, 99, 235],
    textColor: 255,
    fontStyle: 'bold',
  },

  alternateRowStyles: {
    fillColor: [245, 247, 250],
  },

  styles: {
    fontSize: 9,
    cellPadding: 3,
  },

  columnStyles: {
    0: { cellWidth: 70 },
    1: { halign: 'center' },
    2: { halign: 'right' },
    3: { halign: 'center' },
    4: { halign: 'right' },
  },
});

yPosition = (pdf as any).lastAutoTable.finalY + 10;
pdf.setTextColor(0, 0, 0);

  // Totals
  yPosition += 10;
  pdf.setFontSize(11);
  pdf.setFont(undefined as any, 'bold');
  pdf.text(`Subtotal: ₹${Number(data.subtotal).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 8;
  pdf.text(`GST (18%): ₹${Number(data.gstAmount).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setTextColor(37, 99, 235);
  pdf.text(`TOTAL: ₹${Number(data.finalTotal).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

  return pdf;
}

export async function generateProposalPDF(data: ProposalData) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Cover Page
  pdf.setFontSize(28);
  pdf.setTextColor(37, 99, 235);
  pdf.text('PROPOSAL', pageWidth / 2, yPosition + 40, { align: 'center' });

  yPosition += 60;
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`For: ${data.clientName}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 20;
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Project Type: ${data.projectType}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 50;
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Proposal Date: ${new Date(data.createdAt).toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

  // New Page - Client Information
  pdf.addPage();
  yPosition = 20;

  pdf.setFontSize(14);
  pdf.setTextColor(37, 99, 235);
  pdf.text('CLIENT INFORMATION', 20, yPosition);

  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${data.clientName}`, 20, yPosition);
  yPosition += 8;
  if (data.clientEmail) {
    pdf.text(`Email: ${data.clientEmail}`, 20, yPosition);
    yPosition += 8;
  }
  if (data.clientPhone) {
    pdf.text(`Phone: ${data.clientPhone}`, 20, yPosition);
    yPosition += 8;
  }
  if (data.projectAddress) {
    pdf.text(`Address: ${data.projectAddress}`, 20, yPosition);
    yPosition += 8;
  }

  // Project Overview
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(37, 99, 235);
  pdf.text('PROJECT OVERVIEW', 20, yPosition);

  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Project Type: ${data.projectType}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Area: ${data.area} sq ft`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Estimated Timeline: ${data.estimatedTimeline}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`Budget: ₹${data.budget.toLocaleString()}`, 20, yPosition);

  // Scope of Work
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(37, 99, 235);
  pdf.text('SCOPE OF WORK', 20, yPosition);

  yPosition += 12;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  data.selectedServices.forEach((service) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(`• ${service}`, 25, yPosition);
    yPosition += 8;
  });

  // Pricing Summary
  yPosition += 15;
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(37, 99, 235);
  pdf.text('PRICING SUMMARY', 20, yPosition);

  yPosition += 15;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Subtotal: ₹${data.pricingSummary.subtotal.toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  pdf.text(`GST (15%): ₹${data.pricingSummary.gst.toFixed(2)}`, 20, yPosition);
  yPosition += 10;
  pdf.setFont(undefined as any, 'bold' as any);
  pdf.setFontSize(13);
  pdf.setTextColor(37, 99, 235);
  pdf.text(`TOTAL: ₹${data.pricingSummary.total.toFixed(2)}`, 20, yPosition);

  // Terms & Conditions
  yPosition += 20;
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFont(undefined as any, 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(37, 99, 235);
  pdf.text('TERMS & CONDITIONS', 20, yPosition);

  yPosition += 10;
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  const splitText = pdf.splitTextToSize(data.termsAndConditions || 'Standard terms and conditions apply.', pageWidth - 40);
  pdf.text(splitText, 20, yPosition);

  // Signature Section
  yPosition = pageHeight - 30;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Authorized By:', 20, yPosition);
  pdf.line(20, yPosition + 15, 80, yPosition + 15);
  pdf.text('Date: _______________', pageWidth - 60, yPosition);
  pdf.line(pageWidth - 60, yPosition + 15, pageWidth - 20, yPosition + 15);

  return pdf;
}
