import React, { useState } from 'react';
import { supabase } from './utils/supabase';
import { Link } from 'react-router-dom';

const CadastroUserForm = () => {
  // Estados do formulário
  const [userNome, setUserNome] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userSenha, setUserSenha] = useState('');
  const [userMatricula, setUserMatricula] = useState('');
  const [userCurso, setUserCurso] = useState('');

  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Agora, insere os dados na tabela 'monitorias' no banco de dados
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            nome: userNome,
            email: userEmail,
            senha: userSenha,
            matricula: userMatricula,
            curso_id: userCurso,
          },
        ]);

      if (insertError) {
        console.error('Erro ao cadastrar usuário:', insertError);
        alert('Erro ao cadastrar usuário.');
      } else {
        alert('Usuário cadastrado com sucesso!');

        // Limpa os campos após o cadastro
        setUserNome('');
        setUserEmail('');
        setUserSenha('');
        setUserMatricula('');
        setUserCurso('');
      }
    } catch (error) {
      console.error('Erro durante o envio do formulário:', error);
      alert('Houve um erro ao enviar o formulário.');
    }
  };
return(
<div className='flex-1 bg-gray-50 min-h-screen'>
  <div className="max-w-4xl mx-auto p-6">
      {/* Barra de Navegação */}
    <nav className="bg-emerald-800 p-4 rounded mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">Sistema de Monitoria</h1>
        <div>
          <Link to="/" className="text-gray-200 font-bold hover:text-white px-4">Voltar</Link>
        </div>
      </div>
    </nav>

    <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
        {/* Dados do user */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
            <label className="block text-gray-700">Nome:</label>
            <input
                type="text"
                className="w-full p-2 border rounded"
                value={userNome}
                onChange={(e) => setUserNome(e.target.value)}
                required
            />
        </div>
        <div>
            <label className="block text-gray-700">Email:</label>
            <input
                type="email"
                placeholder='email@institucional.ifpe.edu.br'
                className="w-full p-2 border rounded"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
            />
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
            <label className="block text-gray-700">Senha</label>
            <input
                type="password"
                className="w-full p-2 border rounded"
                value={userSenha}
                onChange={(e) => setUserSenha(e.target.value)}
                required
            />
        </div>
        <div>
            <label className="block text-gray-700">Matrícula:</label>
            <input
                type="text"
                className="w-full p-2 border rounded"
                value={userMatricula}
                onChange={(e) => setUserMatricula(e.target.value)}
                required
            />
        </div>
        <div>
            <label className="block text-gray-700">Curso:</label>
            <input
                type="text"
                className="w-full p-2 border rounded"
                value={userCurso}
                onChange={(e) => setUserCurso(e.target.value)}
                required
            />
        </div>
        <div className='flex justify-center'>
          <button type="submit" className=" w-1/2 bg-transparent border-solid border-2 border-emerald-700 hover:bg-emerald-700 hover:text-white text-emerald-700 font-bold p-2 rounded mt-4">
            Cadastrar
          </button>
        </div>
        </div>

    </form>
  </div>
</div>
)
}

export default CadastroUserForm;