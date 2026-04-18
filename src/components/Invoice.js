"use client";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function InvoiceGenerator({ task }) {
  const generatePDF = () => {
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      
      doc.setFont("helvetica");
      
      // ШАПКА
      doc.setFontSize(24);
      doc.setTextColor(249, 115, 22);
      doc.text("RU-TIMBER EXPORT", 14, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Direct from Siberian Sawmills", 14, 32);
      doc.text("Email: export@ru-timber.com", 14, 38);
      doc.text("WhatsApp: +7 915 349 00 07", 14, 44);

      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
      const date = new Date().toLocaleDateString('en-US');
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("COMMERCIAL INVOICE", 130, 25);
      doc.setFontSize(10);
      doc.text(`Invoice No: ${invoiceNumber}`, 130, 35);
      doc.text(`Date: ${date}`, 130, 41);

      // КЛИЕНТ
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("BILL TO:", 14, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`Company: ${task.client || "Client"}`, 14, 67);
      doc.text(`Phone: ${task.phone || "N/A"}`, 14, 73);

      // ПАРСИНГ ЦИФР
      const unitPrice = Number(task.price) || 0;
      const qty = Number(task.volume) || 0;
      const totalAmount = unitPrice * qty;

      // ТАБЛИЦА
      doc.autoTable({
        startY: 85,
        head: [['Description', 'Quantity (m3)', 'Unit Price (USD)', 'Total (USD)']],
        body: [
          [
            'Russian Pine Sawn Timber\nGOST 8486-86 (KD 10-12%, AST)\nSize: 44x100/150x5980mm', 
            qty.toString(), 
            `$${unitPrice}`, 
            `$${totalAmount.toLocaleString()}`
          ],
        ],
        headStyles: { fillColor: [15, 23, 42] },
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 5 }
      });

      // ИТОГО
      const finalY = doc.lastAutoTable.finalY || 120;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`TOTAL AMOUNT: $${totalAmount.toLocaleString()}`, 140, finalY + 15);

      // РЕКВИЗИТЫ
      doc.setFontSize(10);
      doc.text("BANK DETAILS:", 14, finalY + 30);
      doc.setFont("helvetica", "normal");
      doc.text("Bank Name: [To be provided upon contract signing]", 14, finalY + 37);
      doc.text("SWIFT: [XXX]", 14, finalY + 43);
      doc.text("Account No: [XXX]", 14, finalY + 49);

      // ПЕЧАТЬ
      doc.text("Authorized Signature:", 140, finalY + 40);
      doc.setDrawColor(0, 0, 0);
      doc.line(140, finalY + 50, 190, finalY + 50);
      
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1);
      doc.circle(165, finalY + 50, 15);
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(8);
      doc.text("RU-TIMBER", 155, finalY + 48);
      doc.text("EXPORT", 157, finalY + 52);

      const safeName = (task.client || "Client").replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`Invoice_${safeName}.pdf`);
      
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error);
      alert("Ошибка генерации PDF. Попробуйте перезагрузить страницу.");
    }
  };

  return (
    <button 
      onClick={generatePDF}
      className="flex items-center gap-1 bg-blue-900/30 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors px-2 py-1 rounded text-[10px] font-bold"
      title="Скачать PDF Инвойс"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      INVOICE
    </button>
  );
}