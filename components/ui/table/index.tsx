import { Dispatch, SetStateAction } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// TODO: MAKE DRAGGABLE
// https://codesandbox.io/s/react-table-drag-and-drop-sort-rows-with-dnd-kit-btpy9?file=/src/Table.jsx:751-888
// https://tanstack.com/table/v8/docs/examples/react/basic

export type DragableDataHeader<T> = {
  header: string;
  accessor: keyof T;
};

export const createColumnsFromHeaders = <T extends unknown>(
  headers: DragableDataHeader<T>[]
) => {
  const columnHelper = createColumnHelper<T>();

  return headers.map((header, headerIdx) =>
    columnHelper.accessor((row: T) => row[header.accessor], {
      header: header.header,
      cell: (info) => info.getValue(),
    })
  );
};

type DraggableTable = {
  columns: any;
  data: any;
  setData: Dispatch<SetStateAction<any>>;
};

const DraggableTable: React.FC<DraggableTable> = ({
  columns,
  data,
  setData,
}) => {
  const { getHeaderGroups, getRowModel, getFooterGroups } = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2 text-white text-sm overflow-y-auto">
      <table>
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-xs font-normal">
          {getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-green-900">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="hover:bg-green-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default DraggableTable;
