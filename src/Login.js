// Login.js
import React from 'react';
import { auth, provider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { redirect, useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result)
      const user = result.user;

      // Verificar domínio do email
      const emailDomain = user.email.split('@')[1];
      if (emailDomain === 'discente.ifpe.edu.br' || emailDomain === 'jaboatao.ifpe.edu.br') {
        console.log('Login bem-sucedido:', user);
        navigate('/cadastro')
      } else {
        alert('Acesso negado. Você deve usar um email institucional para ter acesso ao sistema!');
        // Desconectar o usuário
        await auth.signOut();
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (

    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
    <div className="bg-transparent border-solid border-2 border-emerald-700 rounded-lg shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <img src="monitoria-logo.jpg" alt="Logo" className="w-22 h-22" />
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Login</h2>
      </div>

      <form>
        
        <div className="mb-4">
          <label for="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail</label>
          <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder='email@institucional.ifpe.edu.br' />
        </div>

        <div className="mb-6">
          <label for="password" className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
          <input type="password" id="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder='**************'/>
        </div>

        <div className='divide-y divide-emerald-700 divide-dashed flex-col justify-center pt-2'>
          <div className="flex justify-center pb-3">
            <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 transition text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>navigate('/cadastro')}>Entrar</button>
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