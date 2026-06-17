import { generateQuotationPDF, generateProposalPDF, QuotationData, ProposalData } from './pdfGenerator';

export async function downloadQuotationPDF(data: QuotationData) {
  try {
    const pdf = await generateQuotationPDF(data);
    pdf.save(`Quotation_${data.id}.pdf`);
  } catch (error) {
    console.error('Error generating quotation PDF:', error);
    throw error;
  }
}

export async function printQuotation(data: QuotationData) {
  try {
    const pdf = await generateQuotationPDF(data);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  } catch (error) {
    console.error('Error printing quotation:', error);
    throw error;
  }
}

export async function downloadProposalPDF(data: ProposalData) {
  try {
    const pdf = await generateProposalPDF(data);
    pdf.save(`Proposal_${data.id}.pdf`);
  } catch (error) {
    console.error('Error generating proposal PDF:', error);
    throw error;
  }
}

export async function printProposal(data: ProposalData) {
  try {
    const pdf = await generateProposalPDF(data);
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(url);
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  } catch (error) {
    console.error('Error printing proposal:', error);
    throw error;
  }
}
