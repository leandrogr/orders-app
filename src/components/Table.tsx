
import React, { useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";

export default function Table({ columns, data }) {

    const [filterInput, setFilterInput] = useState("");

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable (
        {
            columns,
            data
        },
        useGlobalFilter,
        useSortBy
    );

    const { globalFilter  } = state

    return (
        <div>

            <div className="container flex mx-auto">
                <div className="flex border-2 rounded">
                    <button className="flex items-center justify-center px-4 border-r">
                        <svg className="w-6 h-6 text-gray-600 " fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z">
                            </path>
                        </svg>
                    </button>
                    <input 
                    className="px-4 py-2 w-full bg-white border focus:ring-green-400  hover:border-green-400"
                    value={globalFilter || ''}  onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder={"Pesquisa..."}
                    />
                </div>
            </div>

            <table {...getTableProps()} className="min-w-full">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">{column.render("Header")}</th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white">
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"><div className="text-sm leading-5 text-gray-500">{cell.render("Cell")}</div></td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </table>
      </div>
    );

}