import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const MonitoriaList = () => {
  const [monitorias, setMonitorias] = useState([]);
  const [selectedMonitoria, setSelectedMonitoria] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchMonitorias = async () => {
      const { data, error } = await supabase
        .from('monitorias')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setMonitorias(data);
      }
    };

    fetchMonitorias();
  }, []);

  const handleEdit = (monitoria) => {
    setSelectedMonitoria(monitoria);
    setIsEditing(true);
  };

  const handleDelete = (monitoria) => {
    setSelectedMonitoria(monitoria);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from('monitorias')
      .delete()
      .eq('id', selectedMonitoria.id);

    if (error) {
      console.error(error);
    } else {
      setMonitorias(monitorias.filter(m => m.id !== selectedMonitoria.id));
    }
    setModalVisible(false);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const { error } = await supabase
      .from('monitorias')
      .update({
        disciplina_nome: event.target.disciplina_nome.value,
        estudante_nome: event.target.estudante_nome.value,
        orientador_nome: event.target.orientador_nome.value,
        pdf_frequencia: event.target.pdf_frequencia.value,
      })
      .eq('id', selectedMonitoria.id);

    if (error) {
      console.error(error);
    } else {
      setMonitorias(monitorias.map(m => (m.id === selectedMonitoria.id ? { ...m, ...selectedMonitoria } : m)));
    }
    setIsEditing(false);
    setSelectedMonitoria(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Monitorias do Semestre</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border text-center">Disciplina</th>
            <th className="p-2 border text-center">Estudante</th>
            <th className="p-2 border text-center">Orientador</th>
            <th className="p-2 border text-center">Frequência</th>
            <th className="p-2 border text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {monitorias.map((monitoria) => (
            <tr key={monitoria.id}>
              <td className="p-2 border text-center">{monitoria.disciplina_nome}</td>
              <td className="p-2 border text-center">{monitoria.estudante_nome}</td>
              <td className="p-2 border text-center">{monitoria.orientador_nome}</td>
              <td className="p-2 border text-center">
                <a href={monitoria.pdf_frequencia} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver PDF</a>
              </td>
              <td className="p-2 border text-center">
                <button onClick={() => handleEdit(monitoria)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Editar</button>
                <button onClick={() => handleDelete(monitoria)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ml-2">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulário de Edição */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4"> Editar Monitoria</h3>
            <label className="block mb-2">
              Disciplina:
              <input type="text" name="disciplina_nome" defaultValue={selectedMonitoria.disciplina_nome} className="border p-2 w-full" required />
            </label>
            <label className="block mb-2">
              Estudante:
              <input type="text" name="estudante_nome" defaultValue={selectedMonitoria.estudante_nome} className="border p-2 w-full" required />
            </label>
            <label className="block mb-2">
              Orientador:
              <input type="text" name="orientador_nome" defaultValue={selectedMonitoria.orientador_nome} className="border p-2 w-full" required />
            </label>
            <label className="block mb-2">
              PDF de Frequência:
              <input type="text" name="pdf_frequencia" defaultValue={selectedMonitoria.pdf_frequencia} className="border p-2 w-full" required />
            </label>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition mr-2">Cancelar</button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Confirmar Exclusão</h3>
            <p>Você tem certeza que deseja excluir a monitoria de <strong>{selectedMonitoria.estudante_nome}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={() => setModalVisible(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition mr-2">Cancelar</button>
              <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoriaList;