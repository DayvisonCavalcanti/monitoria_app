import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase.js';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from './context/AuthContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
  const [userCurso, setUserCurso] = useState('');
  const [pdfFrequencia, setPdfFrequencia] = useState('');
  const [cursos, setCursos] = useState([]);
  const [fieldsDisabled, setFieldsDisabled] = useState(true);

  const auth = getAuth();
  const { session, signOut } = UserAuth();
  const [isGoogle, setIsGoogle] = useState(false);
  const [isSupa, setIsSupabase] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isGoogle) {
        // Logout from Firebase
        try {
            await auth.signOut();
            console.log("User  signed out successfully from Firebase");
            navigate('/'); // Redirect to home or login page
        } catch (error) {
            console.error("Sign out error from Firebase: ", error);
        }
    } else {
        // Logout from Supabase
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Sign out error from Supabase: ", error);
            } else {
                console.log("User  signed out successfully from Supabase");
                navigate('/'); // Redirect to home or login page
            }
        } catch (error) {
            console.error("Unexpected error during sign out from Supabase: ", error);
        }
    }
};

  const fetchStudent = async (email) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("nome")
        .eq('email', email);

      if (error) {
        console.error("Erro ao buscar estudante:", error);
      } else {
        setEstudanteNome(data[0]?.nome || ''); // Use o primeiro item do array
      }
    } catch (error) {
      console.error("Erro ao buscar estudante:", error);
    }
  };

  useEffect(() => {
    // Monitorar autenticação do Firebase
    const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsGoogle(true);
        setIsSupabase(false);
        setEstudanteEmail(user.email);
        setFieldsDisabled(true)
      } else {
        setIsGoogle(false);
        setFieldsDisabled(false)
      }
    });

    // Monitorar autenticação do Supabase
    const { data: { session } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsSupabase(true);
        setIsGoogle(false);
        fetchStudent(session.user.email); // Busca o estudante usando o email do Supabase
      } else {
        setIsSupabase(false);
      }
    });

    return () => {
      unsubscribeFirebase();
    };
  }, [auth]);

  const fetchUserCurso = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("nome", { ascending: true });

      if (error) {
        console.error("Erro ao buscar cursos:", error);
      } else {
        setCursos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    }
  };

  useEffect(() => {
    fetchUserCurso(); // Chama a função ao montar o componente
  }, []);

  const handleFileChange = (e) => {
    setPdfFrequencia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFrequencia) {
      alert('Por favor, faça o upload do relatório de frequência.');
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('REL ATORIOS_FREQUENCIA')
        .upload(`monitorias/${pdfFrequencia.name}`, pdfFrequencia);

      if (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
        alert('Erro ao fazer upload do arquivo.');
        return;
      }

      const pdfUrl = supabase.storage
        .from('RELATORIOS_FREQUENCIA')
        .getPublicUrl(data.path).publicURL;

      if (!pdfUrl) {
        console.error('URL do PDF não encontrada');
        alert('Erro ao obter a URL do PDF.');
        return;
      }

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
            disciplina_nome: userCurso,
            pdf_frequencia: pdfUrl,
          },
        ]);

      if (insertError) {
        console.error('Erro ao cadastrar monitoria:', insertError);
        alert('Erro ao cadastrar monitoria.');
      } else {
        alert('Monitoria cadastrada com sucesso!');
        setEstudanteNome('');
        setEstudanteEmail('');
        setEstudanteTelefone('');
        setEstudanteMatricula('');
        setOrientadorNome('');
        setOrientadorEmail('');
        setOrientadorTelefone('');
        setOrientadorMatricula('');
        setUserCurso('');
        setPdfFrequencia('');
      }
    } catch (error) {
      console.error('Erro durante o envio do formulário:', error);
      alert('Houve um erro ao enviar o formulário.');
    }
  };

  return (
    <div className='flex-1 bg-gray-50 min-h-screen'>
      <div className="max-w-4xl mx-auto p-6">
        <nav className="bg-emerald-800 p-4 rounded mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-lg font-bold">Sistema de Monitoria</h1>
            <div className='flex flex-row'>
              <p className="text-gray-200 font-bold hover:text-white px-4">Olá, {estudanteEmail}</p>
              <button onClick={handleLogout} className="text-gray-200 font-bold hover:text-white px-4">
                Sair
              </button>
            </div>
          </div>
        </nav>

        <form className="bg-white rounded-lg shadow-xl p-6" onSubmit={handleSubmit}>
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
                disabled={fieldsDisabled}
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

          <div className="mb-4">
            <label className="block text-gray-700">Disciplina</label>
            <select
              className="w-full p-2 border-solid border-2 bg-transparent rounded"
              value={userCurso}
              onChange={(e) => setUserCurso(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um curso</option>
              {cursos
                .filter(curso => curso.nome !== 'Docente')
                .map((curso) => (
                  <option key={curso.id} value={curso.id}>{curso.nome}</option>
                ))}
            </select>
          </div>

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
    </div>
  );
};

export default MonitoriaForm;