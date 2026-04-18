"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const exportDocumentChecklist = [
  { id: "doc1", text: "1. Контракт (Sales Contract)", done: false },
  { id: "doc2", text: "2. Инвойс (Commercial Invoice)", done: false },
  { id: "doc3", text: "3. Спецификация (Specification)", done: false },
  { id: "doc4", text: "4. Упаковочный лист (Packing List)", done: false },
  { id: "doc5", text: "5. Экспортная декларация (Customs Decl.)", done: false },
  { id: "doc6", text: "6. Фитосанитарный сертификат (Phyto)", done: false },
  { id: "doc7", text: "7. Сертификат происхождения (Cert. of Origin)", done: false },
  { id: "doc8", text: "8. Коносамент (Bill of Lading / BL)", done: false },
];

const initialData = {
  columns: {
    "col-1": { id: "col-1", title: "Переговоры / Оффер", taskIds: ["task-1"] },
    "col-2": { id: "col-2", title: "Подготовка документов", taskIds: [] },
    "col-3": { id: "col-3", title: "Таможня / Погрузка", taskIds: [] },
    "col-4": { id: "col-4", title: "В пути (Транзит)", taskIds: [] },
    "col-5": { id: "col-5", title: "Сделка закрыта", taskIds: [] },
  },
  tasks: {
    "task-1": { 
      id: "task-1", client: "Nandha (IND)", phone: "919876543210", volume: "40 м³ (1x40HC)", 
      price: "Ожидание CIF", status: "Отправлены фото с завода", checklist: exportDocumentChecklist
    },
  },
  columnOrder: ["col-1", "col-2", "col-3", "col-4", "col-5"],
};

export default function CRMDashboard() {
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "erp", "crm"), (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(initialData);
      }
    });
    return () => unsub();
  }, []);

  // --- ЛОГИКА ПЕРЕТАСКИВАНИЯ ---
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

  const toggleChecklist = (taskId, checklistId) => {
    const task = data.tasks[taskId];
    const newChecklist = task.checklist.map(item => item.id === checklistId ? { ...item, done: !item.done } : item);
    const newData = { ...data, tasks: { ...data.tasks, [taskId]: { ...task, checklist: newChecklist } } };
    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
  };

  const calculateProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return 0;
    return Math.round((checklist.filter(item => item.done).length / checklist.length) * 100);
  };

  // --- ЛОГИКА РЕДАКТИРОВАНИЯ И ДОБАВЛЕНИЯ ---
  const handleAddNew = () => {
    setEditingTask({ id: `task-${Date.now()}`, client: "", phone: "", volume: "", price: "", status: "", checklist: exportDocumentChecklist, isNew: true });
    setIsEditing(true);
  };

  const handleEdit = (task) => {
    setEditingTask({ ...task, isNew: false });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingTask.client) { alert("Введите имя клиента"); return; }
    
    let newData = { ...data };
    
    if (editingTask.isNew) {
      // Добавляем новую задачу
      const newTask = { ...editingTask };
      delete newTask.isNew;
      newData.tasks[newTask.id] = newTask;
      newData.columns["col-1"].taskIds.unshift(newTask.id); // Добавляем в первую колонку
    } else {
      // Обновляем существующую
      const updatedTask = { ...editingTask };
      delete updatedTask.isNew;
      newData.tasks[updatedTask.id] = updatedTask;
    }

    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!window.confirm("Удалить эту сделку навсегда?")) return;
    
    let newData = { ...data };
    delete newData.tasks[editingTask.id];
    
    // Удаляем ID из колонки
    Object.keys(newData.columns).forEach(colId => {
      newData.columns[colId].taskIds = newData.columns[colId].taskIds.filter(id => id !== editingTask.id);
    });

    setData(newData);
    setDoc(doc(db, "erp", "crm"), newData);
    setIsEditing(false);
  };

  if (!data) return <div className="h-screen bg-[#0a0a0a] flex items-center justify-center text-green-500 font-mono">LOADING SECURE DATA...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-purple-500/30 relative">
      
      {/* МЕНЮ (Единое название "CRM (Сделки)") */}
      <aside className="w-full md:w-64 bg-[#111] border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center md:block">
          <div><h1 className="text-lg md:text-xl font-black text-white tracking-widest">RU-TIMBER</h1><p className="text-[10px] text-purple-500 mt-1 uppercase tracking-widest font-mono hidden md:block">Export Control</p></div>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-visible">
          <Link href="/" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Витрина</Link>
          <Link href="/admin" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">ERP Калькулятор</Link>
          <Link href="/crm" className="whitespace-nowrap px-4 py-2 md:py-3 rounded bg-purple-900/20 text-purple-400 border border-purple-900/50 text-[10px] md:text-xs uppercase tracking-wider font-bold">CRM (Сделки)</Link>
          <Link href="/stats" className="whitespace-nowrap px-4 py-2 md:py-3 rounded text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-[10px] md:text-xs uppercase tracking-wider font-bold">Сводка</Link>
        </nav>
      </aside>

      {/* ДОСКА */}
      <main className="flex-1 p-4 md:p-8 overflow-x-auto flex flex-col">
        <header className="mb-6 md:mb-8 shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">Контроль экспортных сделок</h2>
          </div>
          <button onClick={handleAddNew} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            + Новая сделка
          </button>
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
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`bg-[#0a0a0a] border ${snapshot.isDragging ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-gray-700'} p-4 rounded group relative`}>
                                  
                                  {/* Кнопка редактирования (появляется при наведении) */}
                                  <button onClick={() => handleEdit(task)} className="absolute top-2 right-2 text-gray-600 hover:text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </button>

                                  <div className="flex justify-between items-start mb-3 border-b border-gray-800 pb-3 pr-6">
                                    <div>
                                      <h4 className="text-white font-bold text-sm">{task.client}</h4>
                                      <p className="text-green-500 font-mono text-xs mt-1">{task.price}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="text-[10px] font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded">{task.volume}</span>
                                      {task.phone && (
                                        <a href={`https://wa.me/${task.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-green-900/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors px-2 py-1 rounded text-[10px] font-bold">
                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.883-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                          ЧАТ
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <p className="text-gray-500 font-mono text-[10px] mb-4 uppercase">{task.status}</p>
                                  
                                  <div className="mb-4 bg-[#161616] p-3 rounded border border-gray-800">
                                    <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-2">
                                      <span>ПАКЕТ ДОКУМЕНТОВ</span>
                                      <span className={progress === 100 ? "text-green-500 font-bold" : "text-purple-400"}>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-900 rounded-full h-1.5 mb-3">
                                      <div className={`h-1.5 rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-purple-500"}`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="space-y-2">
                                      {task.checklist?.map(item => (
                                        <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                                          <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(task.id, item.id)} className="mt-0.5 accent-purple-500 cursor-pointer"/>
                                          <span className={`text-[10px] font-mono leading-tight transition-colors ${item.done ? 'text-gray-600 line-through' : 'text-gray-300 group-hover:text-white'}`}>{item.text}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  
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

      {/* МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-wider">{editingTask.isNew ? "Новая сделка" : "Редактировать сделку"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Клиент / Компания</label>
                <input type="text" value={editingTask.client} onChange={(e) => setEditingTask({...editingTask, client: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-purple-500 rounded p-2 text-white outline-none" placeholder="Например: Nandha (IND)"/>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Телефон (WhatsApp)</label>
                <input type="text" value={editingTask.phone} onChange={(e) => setEditingTask({...editingTask, phone: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-purple-500 rounded p-2 text-white outline-none" placeholder="Только цифры: 919876543210"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Объем</label>
                  <input type="text" value={editingTask.volume} onChange={(e) => setEditingTask({...editingTask, volume: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-purple-500 rounded p-2 text-white outline-none" placeholder="40 м³"/>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Цена</label>
                  <input type="text" value={editingTask.price} onChange={(e) => setEditingTask({...editingTask, price: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-purple-500 rounded p-2 text-white outline-none" placeholder="$260 CIF"/>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Текущий статус (заметка)</label>
                <input type="text" value={editingTask.status} onChange={(e) => setEditingTask({...editingTask, status: e.target.value})} className="w-full bg-[#0a0a0a] border border-gray-700 focus:border-purple-500 rounded p-2 text-white outline-none" placeholder="Ждем оплату..."/>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
              {!editingTask.isNew ? (
                <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider">Удалить</button>
              ) : <div></div>}
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-wider px-3 py-2">Отмена</button>
                <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}