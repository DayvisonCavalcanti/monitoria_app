import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";

const MonitoriaList = () => {
  const [monitorias, setMonitorias] = useState([]);
  const [selectedMonitoria, setSelectedMonitoria] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMonitorias = async () => {
    console.log("Iniciando fetchMonitorias...");
    try {
      const { data, error } = await supabase
        .from("monitorias")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar monitorias:", error);
      } else {
        console.log("Monitorias obtidas:", data);
        setMonitorias(data);
      }
    } catch (error) {
      console.error("Erro ao buscar monitorias:", error);
    }
  };

  useEffect(() => {
    fetchMonitorias();

    const monitoriaChannel = supabase
      .channel("monitoria_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "monitorias" },
        async (payload) => {
          console.log("Mudança detectada no canal Supabase:", payload);

          if (isUpdating) {
            console.log("Atualização em progresso, ignorando...");
            return;
          }

          setIsUpdating(true);

          try {
            setMonitorias((prevMonitorias) => {
              let updatedMonitorias = [...prevMonitorias];

              if (payload.eventType === "INSERT") {
                updatedMonitorias = [payload.new, ...updatedMonitorias];
              } else if (payload.eventType === "UPDATE") {
                updatedMonitorias = updatedMonitorias.map((monitoria) =>
                  monitoria.id === payload.new.id ? payload.new : monitoria
                );
              } else if (payload.eventType === "DELETE") {
                updatedMonitorias = updatedMonitorias.filter(
                  (monitoria) => monitoria.id !== payload.old.id
                );
              }

              return updatedMonitorias;
            });
          } catch (error) {
            console.error("Erro ao processar mudança:", error);
          } finally {
            setIsUpdating(false);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Desinscrevendo do canal...");
      monitoriaChannel.unsubscribe();
    };
  }, [isUpdating]);

  const handleEdit = (monitoria) => {
    setSelectedMonitoria(monitoria);
    setIsEditing(true);
  };

  const handleDelete = (monitoria) => {
    setSelectedMonitoria(monitoria);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const pdfUrl = selectedMonitoria.pdf_frequencia;

      console.log("PDF URL original:", pdfUrl);

      if (pdfUrl) {
        const filePath = pdfUrl.split("RELATORIOS_FREQUENCIA/")[1].trim();

        console.log("Caminho do arquivo a ser excluído:", filePath);

        if (!filePath) {
          console.error("Erro: Caminho do arquivo não encontrado.");
          return;
        }

        const { error: storageError } = await supabase.storage
          .from("RELATORIOS_FREQUENCIA")
          .remove([filePath]);

        if (storageError) {
          console.error(
            "Erro ao excluir o arquivo no storage:",
            storageError.message
          );
          return;
        }
        console.log(`Arquivo ${filePath} excluído com sucesso do storage.`);
      } else {
        console.error("Caminho do arquivo não encontrado.");
        return;
      }

      const { error } = await supabase
        .from("monitorias")
        .delete()
        .eq("id", selectedMonitoria.id);

      if (error) {
        console.error("Erro ao excluir monitoria:", error.message);
      } else {
        console.log("Monitoria excluída com sucesso.");
        setMonitorias(monitorias.filter((m) => m.id !== selectedMonitoria.id));
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Erro durante a exclusão:", error.message);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const updatedData = {
      disciplina_nome: event.target.disciplina_nome.value,
      estudante_nome: event.target.estudante_nome.value,
      orientador_nome: event.target.orientador_nome.value,
      pdf_frequencia: event.target.pdf_frequencia.value,
    };

    if (
      updatedData.disciplina_nome !== selectedMonitoria.disciplina_nome ||
      updatedData.estudante_nome !== selectedMonitoria.estudante_nome ||
      updatedData.orientador_nome !== selectedMonitoria.orientador_nome ||
      updatedData.pdf_frequencia !== selectedMonitoria.pdf_frequencia
    ) {
      const { error } = await supabase
        .from("monitorias")
        .update(updatedData)
        .eq("id", selectedMonitoria.id);

      if (error) {
        console.error("Erro ao atualizar:", error);
      } else {
        setMonitorias(
          monitorias.map((m) =>
            m.id === selectedMonitoria.id ? { ...m, ...updatedData } : m
          )
        );
      }
    }

    setIsEditing(false);
    setSelectedMonitoria(null);
  };

  const getValidUrl = (value) => {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (parsed.data && parsed.data.publicUrl) {
          return parsed.data.publicUrl;
        }
      } catch (e) {
        console.error("Erro ao analisar URL:", e);
      }
    }
    if (value && value.data && value.data.publicUrl) {
      return value.data.publicUrl;
    }
    return "";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <nav className="bg-emerald-800 p-4 rounded mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-lg font-bold">
            Monitorias do Semestre
          </h1>
          <div>
            <Link
              to="/"
              className="text-gray-200 font-bold hover:text-white px-4"
            >
              Cadastro
            </Link>
            <Link
              to="/sobre"
              className="text-gray-200 font-bold hover:text-white px-4"
            >
              Sobre
            </Link>
          </div>
        </div>
      </nav>

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
              <td className="p-2 border text-center">
                {monitoria.disciplina_nome}
              </td>
              <td className="p-2 border text-center">
                {monitoria.estudante_nome}
              </td>
              <td className="p-2 border text-center">
                {monitoria.orientador_nome}
              </td>
              <td className="p-2 border text-center">
                <a
                  href={getValidUrl(monitoria.pdf_frequencia)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  Ver PDF
                </a>
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleEdit(monitoria)}
                  className="bg-emerald-700 text-white px-3 py-1 rounded hover:bg-emerald-800 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(monitoria)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ml-2"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded shadow-md w-96"
          >
            <h3 className="text-lg font-bold mb-4"> Editar Monitoria</h3>
            <label className="block mb-2">
              Disciplina:
              <input
                type="text"
                name="disciplina_nome"
                defaultValue={selectedMonitoria.disciplina_nome}
                className="border p-2 w-full"
                required
              />
            </label>
            <label className="block mb-2">
              Estudante:
              <input
                type="text"
                name="estudante_nome"
                defaultValue={selectedMonitoria.estudante_nome}
                className="border p-2 w-full"
                required
              />
            </label>
            <label className="block mb-2">
              Orientador:
              <input
                type="text"
                name="orientador_nome"
                defaultValue={selectedMonitoria.orientador_nome}
                className="border p-2 w-full"
                required
              />
            </label>
            <label className="block mb-2">
              PDF Frequência:
              <input
                type="url"
                name="pdf_frequencia"
                defaultValue={selectedMonitoria.pdf_frequencia}
                className="border p-2 w-full"
                required
              />
            </label>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition mr-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Atualizar
              </button>
            </div>
          </form>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Excluir Monitoria</h3>
            <p>Tem certeza que deseja excluir esta monitoria?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoriaList;
