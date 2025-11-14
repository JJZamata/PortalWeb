import React from 'react';
import UsuariosView from '@/features/control/usuarios/usuariosView';

interface AddUserFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}

const UsuariosPage = () => {
  return <UsuariosView />;
};

export default UsuariosPage;