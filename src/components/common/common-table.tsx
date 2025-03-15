/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_DOCS_PER_PAGE, DOCS_PER_PAGE_OPTIONS } from '@/const/default';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cloneDeep } from 'lodash';
import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react';
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import { ReactTableScroll } from 'react-table-scroll';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';
import { createArrayFrom1ToN } from '@/util/helper';

type Props = {
  data: any[];
  columns: any[];
  page?: number;
  totalPage?: number;
  totalDocs?: number;
  docsPerPage?: number;
  selectedRow?: { [key: number]: boolean };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowClick?: (row: any) => void;
  onRowDoubleClick?: (row: any) => void;
  onRowSelection?: (row: any) => void;
  enableRowSelection?: boolean;
  enableIndexColumn?: boolean;
  disableFooter?: boolean;
  disableBorder?: boolean;
  manualPagination?: boolean;
  disableDefaultRowSelection?: boolean;
  onSelect?: (row: any) => void;
  customTableClassname?: string;
};

export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        'cursor-pointer',
        className,
        rest.checked && '!accent-blue-50'
      )}
      {...rest}
    />
  );
}

export const CommonTable = ({
  columns,
  data,
  docsPerPage = DEFAULT_DOCS_PER_PAGE,
  totalPage,
  totalDocs,
  page = 1,
  // rowSelection,
  selectedRow,
  enableRowSelection = false,
  enableIndexColumn = false,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onRowSelection,
  onRowDoubleClick,
  disableFooter = false,
  disableBorder = false,
  disableDefaultRowSelection = false,
  manualPagination = true,
  customTableClassname,
  onSelect,
}: Props) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: docsPerPage,
  });
  const [rowSelection, setRowSelection] = useState({});
  const isEmpty = !data || data.length === 0;

  const rowSelectionColumn = {
    id: 'select',
    header: ({ table }: any) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }: any) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
    size: 36,
  };

  const indexColumn = {
    header: 'STT',
    cell: ({ row }: any) => <span>{row.index + 1}</span>,
  };

  const renderedColumns = (): any[] => {
    const clone = cloneDeep(columns);
    if (enableIndexColumn) {
      clone.unshift(indexColumn);
    }
    if (
      enableRowSelection &&
      !disableDefaultRowSelection &&
      data &&
      data.length > 0
    ) {
      clone.unshift(rowSelectionColumn);
    }
    return clone;
  };

  const handleOnRowSelection = (row: any) => {
    setRowSelection(row);
    onRowSelection?.(row);
  };

  const table = useReactTable({
    data,
    columns: renderedColumns(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: handleOnRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      pagination,
    },
    manualPagination: manualPagination,
  });

  const isFirstPage = useMemo(() => {
    return manualPagination ? page === 1 : !table.getCanPreviousPage();
  }, [manualPagination, page, table, totalPage, pagination]);

  const isLastPage = useMemo(() => {
    return manualPagination ? page === totalPage : !table.getCanNextPage();
  }, [manualPagination, page, table, totalPage, pagination]);

  const dataRange = useMemo(() => {
    if (!totalDocs || !totalPage || !docsPerPage || !data) return '0 - 0';
    if (manualPagination)
      return page === totalPage
        ? `${docsPerPage! * (page! - 1) + 1} - ${totalDocs - docsPerPage! * (page! - 1)}`
        : `${docsPerPage! * (page! - 1) + 1} - ${docsPerPage! * page!}`;
    return page === table.getPageCount()
      ? `${pagination.pageIndex * pagination.pageSize! + 1} - ${
          table.getRowCount() - pagination.pageIndex * pagination.pageSize!
        }`
      : `${pagination.pageIndex * pagination.pageSize! + 1} - ${
          (pagination.pageIndex + 1) * pagination.pageSize!
        }`;
  }, [
    totalDocs,
    totalPage,
    docsPerPage,
    data,
    manualPagination,
    page,
    table,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const handleNextPage = () => {
    if (!isLastPage) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      manualPagination ? onPageChange!(page! + 1) : table.nextPage();
    }
  };

  const handlePrevPage = () => {
    if (!isFirstPage) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      manualPagination ? onPageChange!(page! - 1) : table.previousPage();
    }
  };

  const handleRowClick = (row: any) => {
    onRowClick?.(row);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onSelect && onSelect?.(row.original);
  };

  const pageOptions = useMemo(() => {
    const options = createArrayFrom1ToN(
      manualPagination ? (totalPage ?? 1) : table.getPageCount()
    );
    return options.map((option) => (
      <SelectItem key={option} value={option.toString()}>
        {option}
      </SelectItem>
    ));
  }, [manualPagination, table, totalPage]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedRow && setRowSelection(selectedRow ?? {});
  }, [selectedRow]);
  const tableFooter = (
    <div className="bg-gray-5 mt-2 flex w-full text-sm font-normal text-gray-950">
      <div className="flex items-center gap-x-1.5 px-4 py-3">
        {/* <div>
          Kết quả mỗi trang:{' '}
          {manualPagination ? docsPerPage : pagination.pageSize}
        </div>
        <ChevronDown size={16} /> */}
        <div className="grow text-dark-gray-05">Show: </div>
        <Select
          value={
            manualPagination
              ? docsPerPage.toString()
              : pagination.pageSize.toString()
          }
          onValueChange={(value) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            manualPagination
              ? onPageSizeChange?.(parseInt(value))
              : // : setPagination((prev) => set(prev, 'pageSize', value))
                table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-[36px] gap-3 border border-dark-gray-60 bg-dark-gray-80 px-3 text-dark-gray-05">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="!z-[105] border border-dark-gray-60 bg-dark-gray-80 text-dark-gray-05">
            {DOCS_PER_PAGE_OPTIONS.map((option: any) => (
              <SelectItem
                className="cursor-pointer text-dark-gray-05"
                key={option}
                value={option.toString()}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <VerticalDivider /> */}
      <div className="flex grow items-center justify-between py-3 text-dark-gray-05">
        <div>
          {dataRange} in
          {manualPagination ? totalDocs : table.getRowCount()} results
        </div>
        <div className="flex items-center gap-x-1.5">
          {/* <div>Trang {manualPagination ? page : pagination.pageIndex + 1}</div>
          <ChevronDown size={16} />
          <div>
            của {manualPagination ? totalPage : table.getPageCount()} trang
          </div> */}
          <Select
            value={
              manualPagination
                ? page.toString()
                : (pagination.pageIndex + 1).toString()
            }
            onValueChange={(value) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              manualPagination
                ? onPageChange?.(parseInt(value))
                : // : setPagination((prev) =>
                  //     set(prev, 'pageIndex', parseInt(value) + 1)
                  //   )
                  table.setPageIndex(page);
            }}
          >
            <SelectTrigger className="border border-dark-gray-60 bg-dark-gray-80 text-dark-gray-05">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="!z-[105] border border-dark-gray-60 bg-dark-gray-80 text-dark-gray-05"
            >
              {pageOptions}
              {/* {DOCS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* <VerticalDivider /> */}
      <div
        className="flex cursor-pointer items-center justify-center p-3"
        onClick={handlePrevPage}
      >
        <ChevronLeft size={20} />
      </div>
      {/* <VerticalDivider /> */}
      <div
        className="flex cursor-pointer items-center justify-center p-3"
        onClick={handleNextPage}
      >
        <ChevronRight size={20} />
      </div>
    </div>
  );

  const buildTable = (
    <>
      <div
        className={cn(
          !disableBorder &&
            'border-gray-20 rounded-lg border border-dark-gray-60',
          'w-full overflow-y-auto',
          customTableClassname
        )}
      >
        <ReactTableScroll>
          <table className="w-full text-sm text-dark-gray-05">
            {!table
              .getHeaderGroups()
              .every((headerGroup) =>
                headerGroup.headers.every(
                  (header) =>
                    !header.column.columnDef.header ||
                    header.column.columnDef.header === ''
                )
              ) && (
              <thead className="border-b border-dark-gray-70 bg-dark-gray-70">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="text-subheader-sm text-dark-gray-05"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-4 py-3 text-start font-medium"
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : 'auto',
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
            {!isEmpty && (
              <tbody className="bg-dark-gray-80">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className={cn(
                      'hover:bg-blue-5 cursor-pointer border-b',
                      row.index === table.getRowCount() - 1 && 'border-b-0',
                      row.original.isError && 'box-content bg-red-100 py-2'
                    )}
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    onDoubleClick={() => onRowDoubleClick?.(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-4 py-3" key={cell.id}>
                        <div className="line-clamp-1 flex items-center justify-between">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                          {selectedRow && selectedRow[row.original.id] && (
                            <CircleCheck
                              className="ml-2"
                              fill="white"
                              stroke="blue"
                              size={18}
                            />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </ReactTableScroll>
        {isEmpty && (
          <div className="my-12 flex items-center justify-center">
            <span>No data</span>
          </div>
        )}
      </div>
      {!disableFooter && !isEmpty && tableFooter}
    </>
  );

  return buildTable;
};
