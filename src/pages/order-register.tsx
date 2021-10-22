import Cookies from 'js-cookie';
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link';
import router from 'next/router';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

import api from '../services/api'
import { getPayload, isTokenExpired } from '../services/auth';
import { parseCookies } from '../services/cookies';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

const validationOrderRegister = yup.object().shape({
  name: yup.string().required("Nome Status é obrigatório!"),
  order_id: yup.string().required("Id Ordem é obrigatório!"),
  value: yup.string().required("Valor é obrigatório!"),
})

interface PrivatePageProps {
  payload: any;
}

const OrderRegister: NextPage<PrivatePageProps> = (props) => {
  
  const router = useRouter()

  const {register, handleSubmit, reset, formState: { errors }} = useForm({
    resolver: yupResolver(validationOrderRegister)
  });

  const  createOrder = async (resp: any) => {

    let num = Number(resp.value)

    const data = {
      name: resp.name,
      order_id: resp.order_id,
      value: num.toFixed(2),
    }

    console.log(data);

    try {
      await api.post("orders", data)
      router.push('/orders');
    } catch (err) {
      alert(
        err?.response?.data?.error || 'Houve um problema na criação do pedido'
      );
    }
  }

  function setLogout() {
    Cookies.remove('token');
    router.push('/');
  }

  return (
    <div>
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            <span className="flex items-center py-4 px-2 text-gray-500 font-semibold">
                                Histórico de Pedidos
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-3 ">
                        <span className="py-2 px-2 font-medium text-gray-500">Olá, {props.email}</span>
                        <a href="" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300" onClick={() => {setLogout()}}>Sair</a>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button className="outline-none mobile-menu-button">
                            <svg className=" w-6 h-6 text-gray-500 hover:text-green-500 "
                                x-show="!showMenu"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        
        <div className="max-w-6xl mx-auto px-4 mt-10">
            
            <h3 className="text-2xl font-bold text-center">Pedido</h3>
            <form action="" onSubmit={handleSubmit(createOrder)} onReset={reset} className="flex items-center justify-center px-8 py-6 mt-4 text-left bg-white shadow-lg">
                <div className="mt-4">
                    <div className="mt-4">
                        <label htmlFor="name">Nome Status</label>
                        <div className="relative">
                            <select id="name" name="name" {...register("name")}  className="block appearance-none w-full bg-white border focus:ring-green-400  hover:border-green-400 px-4 py-2 mt-2 pr-8 rounded leading-tight">
                                <option value="">--- Selecione um status ---</option>
                                <option value="Aguardando pagamento">Aguardando pagamento</option>
                                <option value="Pagamento aprovado">Pagamento aprovado</option>
                                <option value="Preparando pedido">Preparando pedido</option>
                                <option value="Pedido preparado">Pedido preparado</option>
                                <option value="Enviado à transportadora">Enviado à transportadora</option>
                                <option value="Saiu para entrega">Saiu para entrega</option>
                                <option value="Entregue">Entregue</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-600">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                            <p className="text-red-500 text-xs italic">{errors.name?.message}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                    <label htmlFor="order_id">Ordem Id</label>
                    <input type="text" name="order_id" id="order_id" {...register("order_id")} placeholder="Ordem Id" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
                    <p className="text-red-500 text-xs italic">{errors.order_id?.message}</p>
                    </div>
                    <div className="mt-4">
                    <label htmlFor="value">Valor</label>
                    <input type="text" name="value" id="value" {...register("value")} placeholder="Valor" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-400"/>
                    <p className="text-red-500 text-xs italic">{errors.value?.message}</p>
                    </div>
                    <div className="flex items-baseline justify-between">
                    <button type="submit" className="px-6 py-2 mt-4 text-white bg-green-400 rounded-lg hover:bg-green-600">Adicionar</button>
                    <Link href="/orders"><button className="px-6 py-2 mt-4 text-white bg-green-400 rounded-lg hover:bg-green-600">Cancelar</button></Link>
                    </div>
                </div>
            </form>
            
        </div>

    </div>
    )
}

export default OrderRegister

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const cookies: {} = parseCookies(ctx.req);

  if (!cookies.token || isTokenExpired(cookies.token)) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      }
    }
  }

  const payload = getPayload(cookies.token);

  console.log(cookies);
  return{
    props: payload,
  }
};
