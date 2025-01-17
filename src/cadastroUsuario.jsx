import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from './context/AuthContext';


const CadastroUserForm = () => {

  // Estados do formulário
  const [userNome, setUserNome] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userMatricula, setUserMatricula] = useState('');
  const [cursos, setCursos] = useState([]);
  const [userCurso, setUserCurso] = useState('');
  const [table, setTable] = useState('')
  const [isDocente, setIsDocente] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const { session, signUpNewUser } = UserAuth();
  const navigate = useNavigate();
  const fetchUserCurso = async () => {
    console.log("Iniciando fetchUserCurso...");
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("nome", { ascending: true });

      if (error) {
        console.error("Erro ao buscar cursos:", error);
      } else {
        console.log("Cursos cadastrados:", data);
        setCursos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar monitorias:", error);
    }
  };


  useEffect(() => {
    fetchUserCurso(); // Chama a função ao montar o componente
  }, []);


  useEffect(() => {
    // Verifica o domínio do e-mail
    if (email.endsWith('@jaboatao.ifpe.edu.br')) {
      setTable('professors')
      setIsDocente(true);
      setUserCurso('Docente'); // Define a opção "Docente" como selecionada
      setIsDisabled(false); // Habilita o botão de cadastrar
    } else if (email.endsWith('@discente.ifpe.edu.br')) {
      setTable('students')
      setIsDocente(false);
      setIsDisabled(false); // Habilita o botão de cadastrar
    } else {
      setTable('')
      setIsDocente(false);
      setUserCurso(''); // Limpa a seleção de curso
      setIsDisabled(true); // Desabilita o botão de cadastrar
    }
  }, [email]);


  // Função para submeter o formulário

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o carregamento

    try {
      const result = await signUpNewUser (email, password);
      if (result.success) {
        // Agora, insere os dados na tabela 'students' no banco de dados
        const { error: insertError } = await supabase
          .from(table)
          .insert([
            {
              nome: userNome,
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
          setEmail('');
          setPassword('');
          setUserMatricula('');
          setUserCurso('');
        }
        navigate('/')
      } else {
        alert(result.error); // Exibe a mensagem de erro retornada pela função de signup
      }
    } catch (error) {
      console.error('Erro durante o envio do formulário:', error);
      alert('Houve um erro ao enviar o formulário.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className='flex-1 bg-gray-50 min-h-screen'>
      <div className=" max-w-4xl mx-auto p-6">
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
          {/* Dados do usuário */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">Senha:</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <select
                className="w-full p-2 border-solid border-2 bg-transparent rounded"
                value={userCurso}
                onChange={(e) => setUserCurso(e.target.value)}
                required
                disabled={isDisabled}
              >
                <option value="" disabled>Selecione um curso</option>
                {isDocente ? (
                  <option value='78d231cd-c53a-4a65-a746-2d3ca4a55ba7'>Docente</option>
                ) : (
                  cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>{curso.nome}</option>
                  ))
                )}
              </select>
            </div>
            <div className='flex justify-center'>
              <button 
                type="submit" 
                className={`w-1/2 bg-transparent border-solid border-2 border-emerald-700 hover:bg-emerald-700 hover:text-white text-emerald-700 font-bold p-2 rounded mt-4 ${isDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isDisabled || loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroUserForm;