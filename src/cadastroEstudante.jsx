import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const CadastroEstudanteForm = () => {
  // Estados do formulário
  const [estudanteNome, setEstudanteNome] = useState('');
  const [estudanteEmail, setEstudanteEmail] = useState('');
  const [estudanteTelefone, setEstudanteTelefone] = useState('');
  const [estudanteMatricula, setEstudanteMatricula] = useState('');

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

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
return(
<form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
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

</form>
)
}