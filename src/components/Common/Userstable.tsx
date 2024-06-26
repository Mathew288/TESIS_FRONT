import { Usuario } from "@/helpers/models/User";
import {
  ColumnSort,
  useReactTable,
  getPaginationRowModel,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { TextInput, Avatar, Button } from "flowbite-react";
import { useState, useEffect } from "react";
import PopupDetallesTabla from "../Popups/Historial_medico/PopupDetalles";

interface Props {
  data: Usuario[];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  columns: ColumnHelper[];
  filterPlaceholder: string;
}
export default function UsersTable({
  data,
  columns,
  filterPlaceholder,
}: Props) {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showPopupDetalles, setShowPopupDetalles] = useState(false);
  const [selectedUser, setSetselectedHistorial] = useState<Usuario>();

  useEffect(() => {}, [data]);

  const table = useReactTable({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
      <TextInput
        placeholder={filterPlaceholder}
        onChange={(e) => setGlobalFilter(e.target.value)}
        value={globalFilter}
        aria-label="Buscar usuarios"
      />
      <section className="w-[90%] overflow-x-auto">
        <div className="my-5 flex flex-col items-center justify-center">
          <table
            className="divide-y divide-gray-200 dark:divide-gray-600 my-5 overflow-x-auto"
            role="grid"
            aria-label="Tabla de usuarios"
          >
            <thead className="bg-gray-100 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                <tr key={data.id} role="row">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider dark:text-gray-400"
                        role="columnheader"
                        aria-sort={
                          header.column.getIsSorted()
                            ? header.column.getIsSorted() === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted()
                          ? header.column.getIsSorted() === "asc"
                            ? "🔼"
                            : "🔽"
                          : null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="dark:hover:bg-gray-600 hover:bg-gray-300"
                  onClick={() => {
                    setShowPopupDetalles(true);
                    setSetselectedHistorial(
                      data.find((d) => d.id === parseInt(row.getValue("id")))
                    );
                  }}
                  role="row"
                  aria-label={`Fila de usuario ${row.getValue("nombre")}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                      role="cell"
                    >
                      <div className="flex items-center justify-start gap-5">
                        {cell.column.id === "nombre" && (
                          <Avatar
                            img={
                              data.find(
                                (d) => d.id == parseInt(row.getValue("id"))
                              )?.photoUrl
                            }
                            rounded
                            aria-label={`Avatar de ${row.getValue("nombre")}`}
                          />
                        )}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center">
            <div className="paginacion flex gap-2 my-3">
              <Button
                color="gray"
                onClick={() => table.setPageIndex(0)}
                disabled={table.getState().pagination.pageIndex === 0}
                aria-label="Ir a la primera página"
              >
                Primera página
              </Button>
              <Button
                color="gray"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Ir a la página anterior"
              >
                Página anterior
              </Button>
              <Button
                color="gray"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Ir a la página siguiente"
              >
                Página siguiente
              </Button>
              <Button
                color="gray"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={
                  table.getState().pagination.pageIndex ===
                  table.getPageCount() - 1
                }
                aria-label="Ir a la última página"
              >
                Última página
              </Button>
            </div>
            <div>
              <span>
                Página{" "}
                <strong>
                  {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}
                </strong>{" "}
              </span>
            </div>
          </div>
          {showPopupDetalles && selectedUser && (
            <PopupDetallesTabla
              selectedUser={selectedUser}
              onClose={() => setShowPopupDetalles(false)}
              aria-label={`Detalles de ${selectedUser.nombre} ${selectedUser.apellido}`}
            />
          )}
        </div>
      </section>
    </>
  );
}