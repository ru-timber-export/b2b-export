"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Обновленные дефолтные данные с WBS чек-листами
const initialData = {
  columns: {
    "col-1": { id: "col-1", title: "Инициация", taskIds: ["task-1"] },
    "col-2": { id: "col-2", title: "Планирование", taskIds: [] },
    "col-3": { id: "col-3", title: "Исполнение", taskIds: [] },
    "col-4": { id: "col-4", title: "Закрытие", taskIds: [] },
  },
  tasks: {
    "task-1": { 
      id: "task-1", 
      client: "Nandha (IND)", 
      volume: "40 м³", 
      price: "$220 CIF", 
      status: "Ждем ответ по фото",
      checklist: [
        { id: "c1", text: "Согласование цены и ГОСТа", done: true },
        { id: "c2", text: "Расчет логистики (РУСКОН)", done: false },
        { id: "c3", text: "Подписание контракта", done: false },
        { id: "c4", text: "Предоплата получена", done: false },
        { id: "c5", text: "Подача контейнера", done: false },
        { id: "c6", text: "Таможня и Коносамент", done: false }
      ]
    },
  },
  columnOrder: ["col-1", "col-2", "col-3", "col-4"],
};

export default function CRMDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "erp", "crm"), (docSnap) => {
      if (docSnap.exists()) {
        // Проверка на старые данные без чек-листов (чтобы не сломалось)
        const fetchedData = docSnap.data();
        if (!fetchedData.tasks["task-1"].checklist) {
          setData(initialData);
          setDoc(doc(db, "erp", "crm"), initialData);
        } else {
          setData(fetchedData);
        }
      } else {
        setData(initialData);
      }
    });
    return () => unsub();
  }, []);

  // Перетаскивание мышкой
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startCol = data.columns[source.droppableId];
    const finishCol = data.columns[destination.droppableId];

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

    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartCol = { ...startCol, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishCol.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishCol = { ...finishCol, taskIds: finishTaskIds };

    const newData = { ...data, columns: { ...data.columns, [newStartCol.id]: newStartCol, [newFinishCol.id]: newFinishCol } };
    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
  };

  // Перемещение кнопками (Мобилка)
  const moveTaskMobile = (taskId, sourceColId, direction) => {
    const colIndex = data.columnOrder.indexOf(sourceColId);
    const newColIndex = direction === 'right' ? colIndex + 1 : colIndex - 1;
    if (newColIndex < 0 || newColIndex >= data.columnOrder.length) return;

    const destColId = data.columnOrder[newColIndex];
    const startCol = data.columns[sourceColId];
    const finishCol = data.columns[destColId];

    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(startTaskIds.indexOf(taskId), 1);
    const newStartCol = { ...startCol, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishCol.taskIds);
    finishTaskIds.push(taskId);
    const newFinishCol = { ...finishCol, taskIds: finishTaskIds };

    const newData = { ...data, columns: { ...data.columns, [newStartCol.id]: newStartCol, [newFinishCol.id]: newFinishCol } };
    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
  };

  // Переключение чек-бокса
  const toggleChecklist = (taskId, checklistId) => {
    const task = data.tasks[taskId];
    const newChecklist = task.checklist.map(item => 
      item.id === checklistId ? { ...item, done: !item.done } : item
    );
    const newTask = { ...task, checklist: newChecklist };
    const newData = { ...data, tasks: { ...data.tasks, [taskId]: newTask } };
    
    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
  };

  // Подсчет прогресса
  const calculateProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return 0;
    const doneCount = checklist.filter(item => item.done).length;
    return Math.round((doneCount / checklist.length) * 100);
  };

  if (!data) return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-green-500 font-mono">LOADING SECURE DATA...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-purple-500/30">
      
      {/* МЕНЮ */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <div><h1 className="text-lg md:text-xl font-black text-white tracking-widest">RU-TIMBER</h1><p className="text-[10px] text-purple-500 mt-1 uppercase tracking-widest font-mono hidden md:block">Project Management</p></div>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-visible">
          <Link href="/" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Витрина</Link>
          <Link href="/admin" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">ERP Калькулятор</Link>
          <Link href="/crm" className="whitespace-nowrap px-4 py-2 md:py-3 rounded bg-purple-900/20 text-purple-400 border border-purple-900/50 text-[10px] md:text-xs uppercase tracking-wider font-bold">Управление (WBS)</Link>
          <Link href="/stats" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Сводка</Link>
        </nav>
      </aside>

      {/* ДОСКА ПРОЕКТОВ */}
      <main className="flex-1 p-4 md:p-8 overflow-x-auto flex flex-col">
        <header className="mb-6 md:mb-8 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">Управление проектами (WBS)</h2>
        </header>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 md:gap-6 h-full pb-4 items-start min-w-max">
            {data.columnOrder.map((columnId, colIndex) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <div key={column.id} className="bg-[#111] border border-gray-800 rounded-lg w-80 flex flex-col shrink-0 max-h-full">
                  <div className="p-3 border-b border-gray-800 bg-[#161616] rounded-t-lg">
                    <h3 className="text-white text-xs font-bold uppercase tracking-widest">{column.title} <span className="text-gray-600 ml-2">({tasks.length})</span></h3>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 p-3 space-y-4 overflow-y-auto min-h-[150px] ${snapshot.isDraggingOver ? 'bg-purple-900/10' : ''}`}>
                        {tasks.map((task, index) => {
                          const progress = calculateProgress(task.checklist);
                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-[#0a0a0a] border ${snapshot.isDragging ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-gray-700'} p-4 rounded`}>
                                  
                                  {/* Заголовок карточки */}
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-white font-bold text-sm">{task.client}</h4>
                                    <span className="text-[10px] font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded">{task.volume}</span>
                                  </div>
                                  <p className="text-green-500 font-mono text-xs mb-3">{task.price}</p>
                                  
                                  {/* Прогресс-бар */}
                                  <div className="mb-4">
                                    <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1">
                                      <span>ПРОГРЕСС СДЕЛКИ</span>
                                      <span className={progress === 100 ? "text-green-500" : "text-purple-400"}>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-purple-500"}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Чек-лист WBS */}
                                  <div className="space-y-2 border-t border-gray-800 pt-3 mb-3">
                                    {task.checklist?.map(item => (
                                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                                        <input 
                                          type="checkbox" 
                                          checked={item.done} 
                                          onChange={() => toggleChecklist(task.id, item.id)}
                                          className="mt-0.5 accent-purple-500 cursor-pointer"
                                        />
                                        <span className={`text-[10px] leading-tight transition-colors ${item.done ? 'text-gray-600 line-through' : 'text-gray-400 group-hover:text-white'}`}>
                                          {item.text}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                  
                                  {/* Кнопки для мобилки */}
                                  <div className="flex justify-between mt-3 md:hidden border-t border-gray-800 pt-3">
                                    <button onClick={() => moveTaskMobile(task.id, column.id, 'left')} disabled={colIndex === 0} className={`text-[10px] px-3 py-1 rounded font-bold uppercase ${colIndex === 0 ? 'text-gray-700 bg-gray-900' : 'text-purple-400 bg-purple-900/30 hover:bg-purple-900/50'}`}>&larr;</button>
                                    <button onClick={() => moveTaskMobile(task.id, column.id, 'right')} disabled={colIndex === data.columnOrder.length - 1} className={`text-[10px] px-3 py-1 rounded font-bold uppercase ${colIndex === data.columnOrder.length - 1 ? 'text-gray-700 bg-gray-900' : 'text-purple-400 bg-purple-900/30 hover:bg-purple-900/50'}`}>&rarr;</button>
                                  </div>

                                </div>
                              )}
                            </Draggable>
                          );
                        })}
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