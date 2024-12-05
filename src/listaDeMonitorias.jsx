import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const MonitoriaList = () => {
  const [monitorias, setMonitorias] = useState([]);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Monitorias do Semestre</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">Disciplina</th>
            <th className="p-2 border">Estudante</th>
            <th className="p-2 border">Orientador</th>
            <th className="p-2 border">Frequência</th>
          </tr>
        </thead>
        <tbody>
          {monitorias.map((monitoria) => (
            <tr key={monitoria.id}>
              <td className="p-2 border">{monitoria.disciplina_nome}</td>
              <td className="p-2 border">{monitoria.estudante_nome}</td>
              <td className="p-2 border">{monitoria.orientador_nome}</td>
              <td className="p-2 border">
                <a href={monitoria.pdf_frequencia} target="_blank" className="text-blue-500">Ver PDF</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonitoriaList;
