// Login.js
import React, { useState } from 'react';
import { auth, provider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase'; // Ensure you impot your Supabase client

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', data);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error message

    const result = await signInWithEmail(email, password);
    let domain = email.split('@')[1]
    if (result.success && domain === 'discente.ifpe.edu.br' ) {
      console.log('Login successful:', result.user);
      navigate('/cadastro'); // Redirect to the desired page
    } else if (result.success && domain === 'jaboatao.ifpe.edu.br' ) {
      console.log('Login successful:', result.user);
      navigate('/sobre'); // Redirect to the desired page
    } else {
    setErrorMessage(result.error); // Display error message
    setPassword(''); // Clear password field on error
  }};

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verify email domain
      const emailDomain = user.email.split('@')[1];
      if (emailDomain === 'jaboatao.ifpe.edu.br') {
        console.log('Login successful:', user);
        navigate('/sobre');
      } else if (emailDomain === 'discente.ifpe.edu.br'){
        console.log('Login successful:', user);
        navigate('/cadastro')
      }else{
        alert('Accesso negado. Utilize um email institucional para acessar o sistema!');
        // Sign out the user
        await auth.signOut();
      }
    } catch (error) {
      console.error('Erro durante o login com Google:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-transparent border-solid border-2 border-emerald-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-4">
          <img src="monitoria-logo.jpg" alt="Logo" className="w-22 h-22" />
          <h2 className="text-2xl font-bold text-emerald-700">Sistema de Monitorias</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail</label>
            <input 
              type="email" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              placeholder='email@institucional.ifpe.edu.br'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input 
              type="password" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              placeholder='**************'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}

          <div className='divide-y divide-emerald-700 divide-dashed flex-col justify-center pt-2'>
            <div className="flex justify-center pb-3">
              <button 
                className="bg-emerald-700 hover:bg-emerald-800 transition text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type='submit'
              >
                Entrar
              </button>
            </div>
            <div className="flex justify-center pt-3">
              <button className="flex gap-2 p-2 border-solid border-2 rounded border-emerald-700" onClick={handleLogin}>
                <img src="simbolo-do-google.png" className='bg-transparent bg-no-repeat w-6 h-6' alt="Google Logo"/>
                <span>Entrar com Google</span>
              </button>
            </div>
          </div>
        </form>

        <div className='flex justify-center pt-3'>
          <p>Primeiro acesso? <a className="font-bold text-emerald-700" href='/user'>Cadastrar</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;