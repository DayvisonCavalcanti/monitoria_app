import React from 'react';
import { Link } from 'react-router-dom';

const Sobre = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <nav className="bg-emerald-800 p-4 rounded mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-lg font-bold">Sobre o Sistema de Monitoria</h1>
          <div>
            <Link to="/" className="text-gray-200 font-bold hover:text-white px-4">Cadastro</Link>
            <Link to="/lista" className="text-gray-200 font-bold hover:text-white px-4">Monitorias</Link>
            <Link to="/sobre" className="text-gray-200 font-bold hover:text-white px-4">Sobre</Link>
          </div>
        </div>
      </nav>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Objetivo do Sistema</h2>
        <p className="text-gray-700">
          Este sistema tem como objetivo gerenciar as monitorias acadêmicas, permitindo o cadastro, edição e acompanhamento das atividades de monitoria. Além disso, ele oferece a funcionalidade de fazer upload dos relatórios de frequência dos monitores.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Equipe de Desenvolvimento</h2>
        <p className="text-gray-700 mb-2">A equipe responsável pelo desenvolvimento deste sistema é composta por:</p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Desenvolvedora 1 - Ana Carolina</li>
          <li>Desenvolvedor 2 - Paulo Henrique</li>
          <li>Desenvolvedor 3 - Dayvison Cavalcanti</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Tecnologias Utilizadas</h2>
        <p className="text-gray-700">
          O sistema foi desenvolvido utilizando as seguintes tecnologias:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>React para a construção da interface do usuário</li>
          <li>Supabase como backend para gerenciamento de dados</li>
          <li>Tailwind CSS para estilização e layout responsivo</li>
        </ul>
      </section>
    </div>
  );
};

export default Sobre;