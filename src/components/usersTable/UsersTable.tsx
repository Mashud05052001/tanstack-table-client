import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  // getPaginationRowModel,
  // getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import {
  TbSortAscendingLetters,
  TbSortAscendingNumbers,
  TbSortDescendingLetters,
  TbSortDescendingNumbers,
} from "react-icons/tb";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import Container from "../Container";
import "./pagination.css";
// import { GrFormPrevious, GrNext } from "react-icons/gr";

type PropTypes<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalDataNo: number;
};

const UsersTable = <TData, TValue>({
  columns,
  data,
  totalDataNo,
}: PropTypes<TData, TValue>) => {
  // custom pagination
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterType, setFilterType] = useState<string>("name");
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const gettingDataCount = data.length !== 0 ? data.length : -1;

  const totalPages = Math.ceil(totalDataNo / gettingDataCount);

  const table = useReactTable({
    columns,
    data: data,
    state: {
      sorting: sorting,
      // Custom Pagination
      pagination,
      globalFilter,
    },
    sortDescFirst: false,
    // default sorting
    // getSortedRowModel: getSortedRowModel(),
    // custom sort from databade
    manualSorting: true,
    // multiple sorting
    enableMultiSort: true,

    getPaginationRowModel: getPaginationRowModel(),
    // Custom Pagination
    pageCount: totalPages,
    manualPagination: true,
    onPaginationChange: setPagination,

    onSortingChange: setSorting,
    // getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
  });
  // For Sorting
  useEffect(() => {
    if (sorting.length > 0) {
      const sortingCollection = sorting
        .map((item) => `${item?.id}:${item?.desc ? "desc" : "asc"}`)
        .join(",");
      const query = `${sortingCollection}`;
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.delete("sort");
        newSearchParams.append("sort", query);
        return newSearchParams.toString();
      });
    } else if (sorting.length === 0) {
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.delete("sort");
        return newSearchParams.toString();
      });
    }
  }, [searchParams, setSearchParams, sorting, table]);
  // For pagination
  useEffect(() => {
    setSearchParams((prev) => {
      const newSearchParams = new URLSearchParams(prev);
      newSearchParams.set("skip", `${table.getState().pagination.pageIndex}`);
      newSearchParams.set("size", `${table.getState().pagination.pageSize}`);
      return newSearchParams;
    });
  }, [pagination, setSearchParams, table]);
  // For Filtering
  useEffect(() => {
    if (!(globalFilter === "")) {
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.delete("filter");
        newSearchParams.append("filter", `${filterType}:${globalFilter}`);
        return newSearchParams.toString();
      });
    } else {
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.delete("filter");
        return newSearchParams.toString();
      });
    }
  }, [globalFilter]);
  return (
    <Container className="pb-10">
      <h1 className="text-4xl font-bold text-center mb-5">Users</h1>
      <section className="flex justify-between mb-5 items-center">
        <div>
          <p className="mb-1">
            Page <span>{table.getState().pagination.pageIndex + 1}</span> of{" "}
            <span>{table.getPageCount()}</span>
          </p>
        </div>
        <div className="flex">
          <input
            type={`${filterType === "age" ? "number" : "text"}`}
            className="input input-bordered input-sm rounded-md w-40 focus:outline-none border-r-0 rounded-tr-none rounded-br-none"
            placeholder={`Filtered by ${filterType}`}
            min={filterType === "age" ? 1 : undefined}
            max={filterType === "age" ? 150 : undefined}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className=" select w-20 select-bordered select-sm rounded-tl-none rounded-bl-none focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="age">Age</option>
              <option value="gender">Gender</option>
            </select>
          </div>
        </div>
      </section>
      <div className="overflow-x-auto px-3 py-5 border-4 rounded-md">
        <table className="table">
          {/* head */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup?.id}>
                <th>No</th>
                {headerGroup?.headers?.map((header) => (
                  <th
                    key={header.id}
                    // single sorting
                    // onClick={header.column.getToggleSortingHandler()}
                    // multiple sorting
                    onClick={() => header.column.toggleSorting(undefined, true)}
                    className="hover:bg-slate-300"
                  >
                    {header?.isPlaceholder ? null : (
                      <>
                        <div className="">
                          <div className="relative inline-block">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span className="text-xl absolute -right-6 -top-0.5">
                              {header.column.getIsSorted() === "asc" &&
                                (String(
                                  header.column.columnDef.header
                                ).toLowerCase() === "age" ? (
                                  <TbSortAscendingNumbers />
                                ) : (
                                  <TbSortAscendingLetters />
                                ))}
                              {header.column.getIsSorted() === "desc" &&
                                (String(
                                  header.column.columnDef.header
                                ).toLowerCase() === "age" ? (
                                  <TbSortDescendingNumbers />
                                ) : (
                                  <TbSortDescendingLetters />
                                ))}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr key={row.id} className="hover">
                <td>
                  {Number(
                    Number(table.getState().pagination.pageSize) *
                      Number(table.getState().pagination.pageIndex)
                  ) + Number(idx + 1)}
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons mt-5 space-x-2 flex justify-around">
        <div>
          <button className="btn" onClick={() => table.setPageIndex(0)}>
            1st Page
          </button>
          <button
            className="btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev Page
          </button>
          <button
            className="btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next Page
          </button>
          <button
            className="btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            Last Page
          </button>
        </div>
        <div>
          <select
            className=" select w-40 select-bordered"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            <option disabled>Select Table Size</option>
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Custom Pagination */}
      <div className="table-pagination">
        <ul className="customUl">
          <li onClick={() => table.setPageIndex(0)}>
            <MdFirstPage className="my-[0.25rem]" />
          </li>
          <ReactPaginate
            breakLabel="..."
            forcePage={table.getState().pagination.pageIndex}
            nextLabel=">"
            onPageChange={(e) => table.setPageIndex(e.selected)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            previousLabel="<"
          />
          <li onClick={() => table.setPageIndex(totalPages - 1)}>
            <MdLastPage className="my-[0.25rem]" />
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default UsersTable;
