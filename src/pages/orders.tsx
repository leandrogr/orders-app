import Cookies from 'js-cookie';
import type { GetServerSideProps, NextPage } from 'next'
import router from 'next/router';
import React, { useMemo, useEffect, useState } from 'react'
import Link from 'next/link';

import api from '../services/api'
import { getPayload, isTokenExpired } from '../services/auth';
import { parseCookies } from '../services/cookies';
import  Table from '../components/Table';

interface PrivatePageProps {
  payload: any;
}

const OrderRegister: NextPage<PrivatePageProps> = (props) => {

  console.log(props.email);

  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [{
        Header: "Pedidos",
        columns: [{
            Header: "Id",
            accessor: "id"
          },
          {
            Header: "Data de Criação",
            accessor: "createdAt"
          },
          {
            Header: "Nome Status",
            accessor: "name",
            Cell: ({ cell: { value } }) => <Status value={value} />
          },
          {
            Header: "Ordem Id",
            accessor: "order_id"
          },
          {
            Header: "Valor",
            accessor: "value"
          },
          {
            Header: "Histórico",
            accessor: "history",
            Cell: (data) => (
               <button type="submit"  onClick={() => console.log(data.row.original.id)} className="px-6 py-2 text-white bg-green-400 rounded-lg hover:bg-green-600">Visualizar</button>
            )
          }
        ]
      }
    ],
    []
  );

  const Status = ({ value }) => {


    return (
      <div>
        {(() => {
          switch (value) {
            case 'Aguardando pagamento':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{value}</span>;
            case 'Pagamento aprovado':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-400 bg-red-100 rounded-full">{value}</span>;
            case 'Preparando pedido':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-pink-800 bg-pink-100 rounded-full">{value}</span>;
            case 'Pedido preparado':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">{value}</span>;
            case 'Enviado à transportadora':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">{value}</span>;
            case 'Saiu para entrega':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full">{value}</span>;
            case 'Entregue':
              return <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{value}</span>;
            default:
              return null;
          }
        })()}
      </div>
    );

  };

  const  getOrders = async () => {
    const result = await api.get("orders")
    setData(result.data);
  }

  useEffect(() => {
    getOrders();
  }, []);

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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
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
        {/* <div className="max-w-6xl mx-auto px-4">
        <a href="" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Add +</a>
        </div> */}
        
        <div className="max-w-6xl mx-auto px-4 mt-10">
        <Link href="/order-register" ><span className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Adicionar Pedido</span></Link>
        <div className="flex flex-col mt-8">
            <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                    <Table columns={columns} data={data} />
                </div>
            </div>
        </div>
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
