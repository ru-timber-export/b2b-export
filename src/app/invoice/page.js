"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function InvoicePage() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Читаем ID прямо из адресной строки браузера (Vercel сюда не доберется при сборке)
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("id");

    const fetchTask = async () => {
      if (!taskId) {
        setLoading(false);
        return;
      }
      const docSnap = await getDoc(doc(db, "erp", "crm"));
      if (docSnap.exists()) {
        const crmData = docSnap.data();
        setTask(crmData.tasks[taskId]);
      }
      setLoading(false);
    };
    fetchTask();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="h-screen bg-slate-100 flex items-center justify-center text-slate-500 font-mono">Loading Invoice Data...</div>;
  if (!task) return <div className="h-screen bg-slate-100 flex items-center justify-center text-red-500 font-mono">Invoice Not Found</div>;

  const unitPrice = Number(task.price) || 0;
  const qty = Number(task.volume) || 0;
  const totalAmount = unitPrice * qty;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
  const date = new Date().toLocaleDateString('en-US');

  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-8 font-sans">
      
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ (Не печатается) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/crm" className="text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-2 transition-colors">
          &larr; Назад в CRM
        </Link>
        <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Сохранить как PDF
        </button>
      </div>

      {/* ЛИСТ А4 (Сам Инвойс) */}
      <div className="max-w-4xl mx-auto bg-white p-12 shadow-2xl print:shadow-none print:p-0">
        
        {/* ШАПКА */}
        <div className="flex justify-between items-start mb-12 border-b-2 border-slate-100 pb-8">
          <div>
            <h1 className="text-4xl font-black text-orange-500 tracking-wider">RU-TIMBER EXPORT</h1>
            <p className="text-slate-500 mt-2">Direct from Siberian Sawmills to the World</p>
            <p className="text-slate-500 mt-1">Email: export@ru-timber.com</p>
            <p className="text-slate-500 mt-1">WhatsApp: +7 915 349 00 07</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-slate-800">INVOICE</h2>
            <p className="text-slate-500 mt-2 font-mono">#{invoiceNumber}</p>
            <p className="text-slate-500 mt-1">Date: {date}</p>
          </div>
        </div>

        {/* КЛИЕНТ */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To:</h3>
          <p className="text-xl font-bold text-slate-800">{task.client}</p>
          <p className="text-slate-600 mt-1">Phone: {task.phone || "N/A"}</p>
        </div>

        {/* ТАБЛИЦА ТОВАРОВ */}
        <table className="w-full mb-12 text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 font-bold rounded-tl-lg">Description</th>
              <th className="p-4 font-bold">Quantity (m³)</th>
              <th className="p-4 font-bold">Unit Price</th>
              <th className="p-4 font-bold text-right rounded-tr-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-4">
                <p className="font-bold text-slate-800">Russian Pine Sawn Timber</p>
                <p className="text-sm text-slate-500 mt-1">GOST 8486-86 (KD 10-12%, AST)</p>
                <p className="text-sm text-slate-500">Size: 44x100/150x5980mm</p>
              </td>
              <td className="p-4 text-slate-800">{qty}</td>
              <td className="p-4 text-slate-800">${unitPrice}</td>
              <td className="p-4 text-right font-bold text-slate-800">${totalAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* ИТОГО */}
        <div className="flex justify-end mb-16">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b-2 border-slate-800">
              <span className="font-bold text-slate-800">TOTAL AMOUNT:</span>
              <span className="font-black text-xl text-green-600">${totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* РЕКВИЗИТЫ И ПЕЧАТЬ */}
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Bank Details:</h3>
            <p className="text-slate-800 font-mono text-sm">Bank Name: [To be provided]</p>
            <p className="text-slate-800 font-mono text-sm">SWIFT: [XXX]</p>
            <p className="text-slate-800 font-mono text-sm">Account No: [XXX]</p>
          </div>
          
          <div className="text-center relative">
            <p className="text-slate-500 mb-8">Authorized Signature</p>
            <div className="w-48 border-b border-slate-400"></div>
            
            {/* Имитация печати */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-blue-600 rounded-full flex flex-col items-center justify-center opacity-80 rotate-[-15deg]">
              <span className="text-[10px] font-black text-blue-600 tracking-widest">RU-TIMBER</span>
              <span className="text-[8px] font-bold text-blue-600 tracking-widest border-t border-b border-blue-600 my-1 px-2">EXPORT</span>
              <span className="text-[6px] text-blue-600">APPROVED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}