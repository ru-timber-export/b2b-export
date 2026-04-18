"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

function InvoiceContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      const docSnap = await getDoc(doc(db, "erp", "crm"));
      if (docSnap.exists()) {
        const crmData = docSnap.data();
        setTask(crmData.tasks[taskId]);
      }
      setLoading(false);
    };
    fetchTask();
  }, [taskId]);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${taskId.slice(-4)}`;
    const totalAmount = (Number(task.price) * Number(task.volume)).toLocaleString();
    const link = window.location.href;
    
    const text = `Hello! Here is your Commercial Invoice #${invoiceNumber} for the Russian Pine Sawn Timber.\n\nTotal amount: $${totalAmount}\n\nYou can view and download the official document here:\n${link}`;
    
    const phone = task.phone ? task.phone.replace(/\D/g, '') : '';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="h-screen bg-slate-100 flex items-center justify-center text-slate-500">Загрузка данных инвойса...</div>;
  if (!task) return <div className="h-screen bg-slate-100 flex items-center justify-center text-red-500">Сделка не найдена</div>;

  const unitPrice = Number(task.price) || 0;
  const qty = Number(task.volume) || 0;
  const totalAmount = unitPrice * qty;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${taskId.slice(-4)}`;
  const date = new Date().toLocaleDateString('en-US');

  return (
    <div className="min-h-screen bg-slate-200 p-2 md:p-8 font-sans">
      
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ (Не печатается) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <Link href="/crm" className="text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-2">
          &larr; Назад в CRM
        </Link>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={handleWhatsApp} className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Отправить в WhatsApp
          </button>
          <button onClick={handlePrint} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            <span className="hidden md:inline">Сохранить как PDF</span>
            <span className="md:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* КОНТЕЙНЕР ДЛЯ МОБИЛЬНЫХ (чтобы лист не сжимался, а прокручивался) */}
      <div className="w-full overflow-x-auto pb-8 print:overflow-visible print:pb-0">
        
        {/* ЛИСТ А4 (Сам Инвойс) - Жестко задаем минимальную ширину */}
        <div className="min-w-[800px] max-w-4xl mx-auto bg-white p-12 shadow-2xl print:shadow-none print:p-0 relative">
          
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
            
            <div className="text-center relative w-64 h-40">
              <p className="text-slate-500 mb-2 absolute bottom-0 left-0">Authorized Signature</p>
              <div className="w-48 border-b border-slate-400 absolute bottom-6 left-0"></div>
              
              {/* ВАША ПОДПИСЬ (картинка из папки public) */}
              {/* mix-blend-multiply убирает белый фон у картинки, делая её прозрачной */}
              <img 
                src="/signature.png" 
                alt="Signature" 
                className="absolute bottom-4 left-4 w-40 h-auto z-10 mix-blend-multiply opacity-90"
                onError={(e) => e.target.style.display = 'none'} // Скроет, если вы забыли добавить картинку
              />
              
              {/* РЕАЛИСТИЧНАЯ ПЕЧАТЬ С ЧЕРНИЛАМИ */}
              <div 
                className="absolute bottom-2 right-0 w-32 h-32 border-[3px] border-blue-800 rounded-full flex flex-col items-center justify-center opacity-80 rotate-[-15deg] mix-blend-multiply z-0"
                style={{
                  boxShadow: 'inset 0 0 6px rgba(30,58,138,0.4), 0 0 4px rgba(30,58,138,0.3)',
                  borderStyle: 'dashed solid solid solid' // Имитация непропечатанного края
                }}
              >
                <span className="text-[11px] font-black text-blue-800 tracking-widest uppercase mt-2">RU-Timber</span>
                <span className="text-[9px] font-bold text-blue-800 tracking-widest border-t border-b border-blue-800 my-1 px-3 py-0.5" style={{ textShadow: '0px 0px 1px rgba(30,58,138,0.5)' }}>EXPORT</span>
                <span className="text-[7px] text-blue-800 font-mono tracking-widest">APPROVED</span>
                
                {/* Имитация пятен чернил внутри печати */}
                <div className="absolute w-full h-full rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.1)_0%,transparent_70%)] pointer-events-none"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-100 flex items-center justify-center">Загрузка...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}