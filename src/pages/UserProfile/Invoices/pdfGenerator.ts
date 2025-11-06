import html2pdf from 'html2pdf.js';

export interface PDFOptions {
    margin: number | [number, number] | [number, number, number, number];
    filename: string;
    image: { type: 'jpeg' | 'png' | 'webp'; quality: number };
    html2canvas: { scale: number; useCORS: boolean };
    jsPDF: { unit: string; format: string; orientation: 'portrait' | 'landscape' };
}

export const defaultPDFOptions: PDFOptions = {
    margin: [10, 10, 10, 10],
    filename: 'invoice.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
};

/**
 * Generate PDF from DOM element
 * @param element - DOM element to convert to PDF
 * @param options - PDF generation options
 */
export const generatePDF = async (
    element: HTMLElement,
    options: Partial<PDFOptions> = {}
): Promise<void> => {
    const finalOptions = { ...defaultPDFOptions, ...options };

    try {
        await html2pdf().set(finalOptions).from(element).save();
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Không thể tạo file PDF. Vui lòng thử lại.');
    }
};

/**
 * Generate PDF with custom filename based on invoice data
 * @param element - DOM element to convert to PDF
 * @param invoiceId - Invoice ID for filename
 * @param patientName - Patient name for filename
 */
export const generateInvoicePDF = async (
    element: HTMLElement,
    invoiceId: string,
    patientName?: string
): Promise<void> => {
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const cleanPatientName = patientName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Patient';
    const filename = `HoaDon_${invoiceId.slice(0, 8)}_${cleanPatientName}_${timestamp}.pdf`;

    const options: Partial<PDFOptions> = {
        filename,
        margin: [15, 10, 15, 10], // More margin for invoice
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
        },
    };

    return generatePDF(element, options);
};

/**
 * Print invoice (alternative to PDF download)
 * @param element - DOM element to print
 */
export const printInvoice = (element: HTMLElement): void => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Popup bị chặn. Vui lòng cho phép popup để in hóa đơn.');
        return;
    }

    const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
            try {
                return Array.from(styleSheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join('');
            } catch (e) {
                console.log('Cannot read stylesheet', e);
                return '';
            }
        })
        .join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Hóa đơn</title>
                <style>
                    ${styles}
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none !important; }
                    }
                </style>
            </head>
            <body>
                ${element.outerHTML}
            </body>
        </html>
    `;

    printWindow.document.open();
    printWindow.document.documentElement.innerHTML = htmlContent;
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
};
