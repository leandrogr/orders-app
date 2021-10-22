import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Link from 'next/link';

import api from '../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationRegister = yup.object().shape({
  name: yup.string().required("Nome é obrigatório!"),
  email: yup.string().required("Email é obrigatório!"),
  password: yup.string().required("Senha é obrigatório!").matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
    "A senha deve ter uma Letra maiuscula um numero e um catactere especial"
  ),
})

const Register: NextPage = () => {

  const {register, handleSubmit, reset, formState: { errors }} = useForm({
    resolver: yupResolver(validationRegister)
  })

  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [message, setMessage] = useState('');

  const onRegister = async (resp: any) => {

      try {
        await api.post("users", resp)
        reset()
        setName([]);
        setEmail([]);
        setPassword([]);
        setMessage("Cadastro realizado com sucesso!");
      } catch (err) {
        alert(
          err?.response?.data?.error || 'Houve um problema na criação do usuário'
        );
      }
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Registro</h3>
        <form action="" onSubmit={handleSubmit(onRegister)}>
          {message.length > 0 &&
            <h2>
              {message}
            </h2>
          }
          {message}
          <div className="mt-4">
            <div className="mt-4">
              <label htmlFor="email">Nome</label>
              <input type="text" name="name" id="name" {...register("name")}  placeholder="Nome" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
              <p className="text-red-500 text-xs italic">{errors.name?.message}</p>
            </div>
            <div className="mt-4">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" {...register("email")} placeholder="Email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
              <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
            </div>
            <div className="mt-4">
              <label htmlFor="password">Senha</label>
              <input type="password" name="password" id="password" {...register("password")}  placeholder="Senha" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
              <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
            </div>
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-green-400 rounded-lg hover:bg-green-600">Criar Conta</button>
              <span className="text-sm text-green-600 hover:underline"><Link href="/">Já tem uma conta? Entre</Link></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
