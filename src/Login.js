// Login.js
import React from 'react';
import { auth, provider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
        alert('Acesso negado. Você deve usar um email @discente.ifpe.edu.br ou @jaboatao.ifpe.edu.br');
        // Desconectar o usuário
        await auth.signOut();
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login com Google</button>
    </div>
  );
};

export default Login;