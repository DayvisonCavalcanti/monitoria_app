import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

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
  const [pdfFrequencia, setPdfFrequencia] = useState('');

  // Função para lidar com o upload de arquivo PDF
  const handleFileChange = (e) => {
    setPdfFrequencia(e.target.files[0]);
  };

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o arquivo PDF foi selecionado
    if (!pdfFrequencia) {
      alert('Por favor, faça o upload do relatório de frequência.');
      return; // Impede o envio do formulário se não houver arquivo
    }

    try {
      // Faz o upload do arquivo PDF para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('RELATORIOS_FREQUENCIA') // O nome do seu bucket
        .upload(`monitorias/${pdfFrequencia.name}`, pdfFrequencia);

      if (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        alert('Erro ao fazer upload do arquivo.');
        return; // Impede a continuação caso o upload falhe
      }

      // Obtém a URL pública do arquivo PDF carregado
      const pdfUrl = supabase.storage
        .from('RELATORIOS_FREQUENCIA')
        .getPublicUrl(data.path);

      if (!pdfUrl) {
        console.error('URL do PDF não encontrada');
        alert('Erro ao obter a URL do PDF.');
        return;
      }

      // Agora, insere os dados na tabela 'monitorias' no banco de dados
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
            pdf_frequencia: pdfUrl, // Envia a URL do arquivo PDF
          },
        ]);

      if (insertError) {
        console.error('Erro ao cadastrar monitoria:', insertError);
        alert('Erro ao cadastrar monitoria.');
      } else {
        alert('Monitoria cadastrada com sucesso!');

        // Limpa os campos após o cadastro
        setEstudanteNome('');
        setEstudanteEmail('');
        setEstudanteTelefone('');
        setEstudanteMatricula('');
        setOrientadorNome('');
        setOrientadorEmail('');
        setOrientadorTelefone('');
        setOrientadorMatricula('');
        setDisciplinaNome('');
        setPdfFrequencia('');
      }
    } catch (error) {
      console.error('Erro durante o envio do formulário:', error);
      alert('Houve um erro ao enviar o formulário.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Barra de Navegação */}
      <nav className="bg-emerald-800 p-4 rounded mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-lg font-bold">Sistema de Monitoria</h1>
          <div>
            <Link to="/lista" className="text-gray-200 font-bold hover:text-white px-4">Monitorias</Link>
            <Link to="/sobre" className="text-gray-200 font-bold hover:text-white px-4">Sobre</Link>
          </div>
        </div>
      </nav>

      <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
        {/* <h2 className="text-2xl font-bold text-center mb-4">Cadastrar Monitoria</h2> */}

        {/* Dados do Estudante */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Nome do Estudante</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={estudanteNome}
              onChange={(e) => setEstudanteNome(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email do Estudante</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={estudanteEmail}
              onChange={(e) => setEstudanteEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Telefone do Estudante</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={estudanteTelefone}
              onChange={(e) => setEstudanteTelefone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Matrícula do Estudante</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={estudanteMatricula}
              onChange={(e) => setEstudanteMatricula(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Dados do Orientador */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Nome do Orientador</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={orientadorNome}
              onChange={(e) => setOrientadorNome(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email do Orientador</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={orientadorEmail}
              onChange={(e) => setOrientadorEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Telefone do Orientador</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={orientadorTelefone}
              onChange={(e) => setOrientadorTelefone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Matrícula do Orientador</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={orientadorMatricula}
              onChange={(e) => setOrientadorMatricula(e.target.value)}
              required
            />
          </div>
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

        <button type="submit" className="w-full bg-emerald-700 text-white font-bold p-2 rounded mt-4">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default MonitoriaForm;