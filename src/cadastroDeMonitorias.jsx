import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const MonitoriaForm = () => {
  // Estados do formulário
  const [estudanteNome, setEstudanteNome] = useState('');
  const [estudanteEmail, setEstudanteEmail] = useState('');
  const [estudanteTelefone, setEstudanteTelefone] = useState('');
  const [estudanteMatricula, setEstudanteMatricula] = useState('');
  const [orientadorNome, setOrientadorNome] = useState('');
  const [orientadorEmail, setOrientadorEmail] = useState('');
  const [orientadorTelefone, setOrientadorTelefone] = useState('');
  const [orientadorMatricula, setOrientadorMatricula] = useState('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [pdfFrequencia, setPdfFrequencia] = useState(null);

  // Função para lidar com o upload de arquivo PDF
  const handleFileChange = (e) => {
    setPdfFrequencia(e.target.files[0]);
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o arquivo PDF foi enviado
    if (!pdfFrequencia) {
      alert('Por favor, faça o upload do relatório de frequência.');
      return;
    }

    // Upload do arquivo PDF para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('RELATORIOS_FREQUENCIA')
      .upload(`monitorias/${pdfFrequencia.name}`, pdfFrequencia);

    if (error) {
      alert('Erro ao fazer upload do arquivo.');
      return;
    }

    // Obtém a URL pública do PDF carregado
    const pdfUrl = supabase.storage.from('frequencia').getPublicUrl(data.path).publicURL;

    // Inserção de dados na tabela monitorias no banco de dados
    const { error: insertError } = await supabase
      .from('monitorias')
      .insert([
        {
          estudante_nome: estudanteNome,
          estudante_email: estudanteEmail,
          estudante_telefone: estudanteTelefone,
          estudante_matricula: estudanteMatricula,
          orientador_nome: orientadorNome,
          orientador_email: orientadorEmail,
          orientador_telefone: orientadorTelefone,
          orientador_matricula: orientadorMatricula,
          disciplina_nome: disciplinaNome,
          pdf_frequencia: pdfUrl,
        },
      ]);

    // Verifica se ocorreu algum erro ao inserir os dados no banco
    if (insertError) {
      alert('Erro ao cadastrar monitoria.');
    } else {
      alert('Monitoria cadastrada com sucesso!');
      // Limpar os campos após o cadastro
      setEstudanteNome('');
      setEstudanteEmail('');
      setEstudanteTelefone('');
      setEstudanteMatricula('');
      setOrientadorNome('');
      setOrientadorEmail('');
      setOrientadorTelefone('');
      setOrientadorMatricula('');
      setDisciplinaNome('');
      setPdfFrequencia(null);
    }
  };

  return (
    <form className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center mb-4">Cadastrar Monitoria</h2>

      {/* Dados do Estudante */}
      <div className="mb-4">
        <label className="block text-gray-700">Nome do Estudante</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={estudanteNome}
          onChange={(e) => setEstudanteNome(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email do Estudante</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={estudanteEmail}
          onChange={(e) => setEstudanteEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Telefone do Estudante</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={estudanteTelefone}
          onChange={(e) => setEstudanteTelefone(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Matrícula do Estudante</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={estudanteMatricula}
          onChange={(e) => setEstudanteMatricula(e.target.value)}
          required
        />
      </div>

      {/* Dados do Orientador */}
      <div className="mb-4">
        <label className="block text-gray-700">Nome do Orientador</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={orientadorNome}
          onChange={(e) => setOrientadorNome(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email do Orientador</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={orientadorEmail}
          onChange={(e) => setOrientadorEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Telefone do Orientador</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={orientadorTelefone}
          onChange={(e) => setOrientadorTelefone(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Matrícula do Orientador</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={orientadorMatricula}
          onChange={(e) => setOrientadorMatricula(e.target.value)}
          required
        />
      </div>

      {/* Dados da Disciplina */}
      <div className="mb-4">
        <label className="block text-gray-700">Disciplina</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={disciplinaNome}
          onChange={(e) => setDisciplinaNome(e.target.value)}
          required
        />
      </div>

      {/* Upload PDF */}
      <div className="mb-4">
        <label className="block text-gray-700">Relatório de Frequência (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
        Cadastrar Monitoria
      </button>
    </form>
  );
};

export default MonitoriaForm;
