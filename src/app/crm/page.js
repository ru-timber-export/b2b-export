"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Дефолтные данные, если база пустая
const initialData = {
  columns: {
    "col-1": { id: "col-1", title: "Новые запросы", taskIds: ["task-1"] },
    "col-2": { id: "col-2", title: "В переговорах", taskIds: [] },
    "col-3": { id: "col-3", title: "Ждем логистику", taskIds: [] },
    "col-4": { id: "col-4", title: "Контракт / Оплата", taskIds: [] },
  },
  tasks: {
    "task-1": { id: "task-1", client: "Nandha (IND)", volume: "40 м³", price: "$220 CIF", status: "Ждем ответ по фото" },
  },
  columnOrder: ["col-1", "col-2", "col-3", "col-4"],
};

export default function CRMDashboard() {
  const [data, setData] = useState(null);

  // Читаем из Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "erp", "crm"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(initialData); // Если базы нет, ставим дефолт
      }
    });
    return () => unsub();
  }, []);

  // Обработка перетаскивания
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startCol = data.columns[source.droppableId];
    const finishCol = data.columns[destination.droppableId];

    // Перемещение внутри одной колонки
    if (startCol === finishCol) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newCol = { ...startCol, taskIds: newTaskIds };
      const newData = { ...data, columns: { ...data.columns, [newCol.id]: newCol } };
      
      setData(newData);
      setDoc(doc(db, "erp", "crm"), newData);
      return;
    }

    // Перемещение между колонками
    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartCol = { ...startCol, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishCol.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishCol = { ...finishCol, taskIds: finishTaskIds };

    const newData = {
      ...data,
      columns: { ...data.columns, [newStartCol.id]: newStartCol, [newFinishCol.id]: newFinishCol },
    };

    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
  };

  if (!data) return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-green-500 font-mono">LOADING SECURE DATA...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-purple-500/30">
      
      {/* СТРОГОЕ МЕНЮ */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-widest">RU-TIMBER</h1>
            <p className="text-[10px] text-purple-500 mt-1 uppercase tracking-widest font-mono hidden md:block">Client Relations</p>
          </div>
          <div className="md:hidden flex items-center gap-2 text-[10px] font-mono text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            SYNCED
          </div>
        </div>
        
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-visible">
          <Link href="/" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">
            Витрина
          </Link>
          <Link href="/admin" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">
            ERP Калькулятор
          </Link>
          <Link href="/crm" className="whitespace-nowrap px-4 py-2 md:py-3 rounded bg-purple-900/20 text-purple-400 border border-purple-900/50 text-[10px] md:text-xs uppercase tracking-wider font-bold">
            CRM Доска
          </Link>
          <Link href="/stats" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">
            Сводка
          </Link>
        </nav>
      </aside>

      {/* ОСНОВНОЙ КОНТЕНТ CRM */}
      <main className="flex-1 p-4 md:p-8 overflow-x-auto flex flex-col">
        <header className="mb-6 md:mb-8 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">Воронка продаж (CRM)</h2>
          <p className="text-gray-500 mt-1 text-[10px] md:text-xs uppercase tracking-widest font-mono">Drag & Drop управление сделками</p>
        </header>

        {/* ДОСКА KANBAN */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 md:gap-6 h-full pb-4 items-start min-w-max">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <div key={column.id} className="bg-[#111] border border-gray-800 rounded-lg w-72 flex flex-col shrink-0 max-h-full">
                  <div className="p-3 border-b border-gray-800 bg-[#161616] rounded-t-lg">
                    <h3 className="text-white text-xs font-bold uppercase tracking-widest">{column.title} <span className="text-gray-600 ml-2">({tasks.length})</span></h3>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-purple-900/10' : ''}`}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-[#0a0a0a] border ${snapshot.isDragging ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-gray-700'} p-4 rounded cursor-grab active:cursor-grabbing`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-white font-bold text-sm">{task.client}</h4>
                                  <span className="text-[10px] font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded">{task.volume}</span>
                                </div>
                                <p className="text-green-500 font-mono text-xs mb-3">{task.price}</p>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider border-t border-gray-800 pt-2">
                                  {task.status}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}