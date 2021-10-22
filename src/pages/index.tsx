import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { FormEvent } from 'react'
import Link from 'next/link';

import api from '../services/api'
import { setCookie } from '../services/cookies';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationLogin = yup.object().shape({
  email: yup.string().required("Email é obrigatório!"),
  password: yup.string().required("Senha é obrigatório!")
})

const Home: NextPage = () => {

  const {register, handleSubmit, formState: { errors }} = useForm({
    resolver: yupResolver(validationLogin)
  })

  const router = useRouter();

  const onLogin = async (resp: any) => {

    const {data} = await api.post("auth/login", resp)
    setCookie('token', data.token)
    router.push('/orders');
   
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center"> Login</h3>
        <form action="" onSubmit={handleSubmit(onLogin)}>
          <div className="mt-4">
            <div className="mt-4">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" {...register("email")} placeholder="Email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
              <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
            </div>
            <div className="mt-4">
              <label htmlFor="password">Senha</label>
              <input type="password" name="password" id="password" {...register("password")} placeholder="Senha" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
              <p className="text-red-500 text-xs italic">{errors.password?.message}</p>
            </div>
            <div className="flex items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white bg-green-400 rounded-lg hover:bg-green-600" type="submit">Login</button>
              <span className="text-sm text-green-400 hover:underline"><Link href="/register" >Criar Conta</Link></span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Home
