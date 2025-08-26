import AddButton from '@maincomponents/Buttons/AddButton';
import { Button } from '@maincomponents/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import { Input } from '@maincomponents/components/ui/input';
import { Ellipsis, PenLine, Trash, Printer, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import { formatDate } from '@utils/formatter';
import { fetchAllLoads, setPage, setPerPage, setSelectedLoad } from '@redux/slice/loadSlice';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';
import AddEditLoad from '@maincomponents/Modal/AddEditLoad';
import DeleteLoad from '@maincomponents/Modal/DeleteLaod';
import { fetchTruckOptions } from '@redux/slice/truckSlice';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import debounce from '@utils/debouncer';
import TablePagination from '@maincomponents/Pagination';
import { handlePrint } from '@utils/printutil';
import { Badge } from '@maincomponents/components/ui/badge';
import { NO_PRINT_COLUMN } from '@data/Constants';

const columnHelper = createColumnHelper();

const Load = () => {
  const dispatch = useDispatch();
  const { data, isLoading, totalRows, page, perPage, totalPages } = useSelector(state => state.loads);
  const { options: truckOptions } = useSelector(state => state.trucks);
  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [from, setFrom] = useState('');
  const [selectedTrucks, setSelectedTrucks] = useState([]);
  const [to, setTo] = useState('');
  const printRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // '2025-08-03' for example
  });

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: ({ row }) => <div className='w-fit text-nowrap pl-1'>{row.original.id}</div>
    }),
    columnHelper.accessor('from', {
      header: 'From',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.from}</div>
    }),
    columnHelper.accessor('to', {
      header: 'To',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.to}</div>
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: ({ row }) => <div className='w-fit text-nowrap'>SAR {row.original.amount}</div>
    }),

    columnHelper.accessor('date', {
      header: 'Date',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{formatDate(row.original.date)}</div>
    }),
    columnHelper.accessor('invoice', {
      header: 'Invoice',
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>
          {row?.original?.invoice ? (
            <a
              href={`${import.meta.env.VITE_FILE_URL}/${row?.original?.invoice}`} // your file URL
              target='_blank'
              rel='noopener noreferrer'
            >
              <Badge className={'bg-blue-600 dark:bg-chart-3 text-slate-50'}>
                <Eye /> View File
              </Badge>
            </a>
          ) : (
            <Badge>N/A</Badge>
          )}
        </div>
      )
    }),
    columnHelper.accessor('tripMoney', {
      header: 'Trip Money',
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>{row?.original?.tripMoney ? 'SAR ' + row?.original?.tripMoney : 'N/A'}</div>
      )
    }),
    columnHelper.accessor('truck', {
      header: 'Truck',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.truck.numberPlate}</div>
    }),
    columnHelper.accessor('driverName', {
      header: 'Driver Name',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row?.original?.truck?.driverName || 'N/A'}</div>
    }),
    columnHelper.accessor('user', {
      header: 'Add/Edit By',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.user.fullName}</div>
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ row }) => <div className='flex flex-col space-y-1'>{formatDate(row?.original?.createdAt)}</div>
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated',
      cell: ({ row }) => <div className='flex flex-col space-y-1'>{formatDate(row?.original?.updatedAt)}</div>
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
                <Ellipsis className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setSelectedLoad(row.original));
                  setEdit(true);
                  setOpen(true);
                }}
              >
                Edit
                <DropdownMenuShortcut>
                  <PenLine size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  dispatch(setSelectedLoad(row.original));
                  setDeleteModal(true);
                }}
                className='text-red-500!'
              >
                Delete
                <DropdownMenuShortcut>
                  <Trash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    })
  ]);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const fetchTrucks = async () => {
    if (!truckOptions?.length) {
      await dispatch(fetchTruckOptions());
    }
  };

  function handlePageChange(pageNo) {
    dispatch(setPage(pageNo));
  }

  function handlelimitChange(limit) {
    dispatch(setPerPage(limit));
  }

  const debounceCall = useMemo(() => {
    return debounce((fromValue, toValue, truckValue, fromDate, toDate, pageValue, perPageValue) => {
      dispatch(
        fetchAllLoads({
          from: fromValue,
          to: toValue,
          truck: truckValue,
          startDate: fromDate,
          endDate: toDate,
          page: pageValue,
          perPage: perPageValue
        })
      );
    }, 700);
  }, [dispatch]);

  const totalAmount = useMemo(() => {
    return data?.reduce((acc, truck) => acc + (truck.amount || 0), 0);
  }, [data]);

  const totalTripMoney = useMemo(() => {
    return data?.reduce((acc, truck) => acc + (truck.tripMoney || 0), 0);
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchAllLoads({ page, perPage, from, to, selectedTrucks, startDate, endDate }));
    }
    fetchData();
  }, [page, perPage]);

  return (
    <>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Loads Information</h2>
          <p className='text-muted-foreground'>Manage your loads here.</p>
        </div>
        <AddButton onClick={() => setOpen(true)} text='Add Load' />
      </div>
      <div>
        <div className='flex justify-between items-center'>
          <div className='flex items-center justify-start gap-3 flex-wrap'>
            <Input
              type='text'
              value={from}
              placeholder='From ...'
              className='w-[150px] lg:w-[200px]'
              onChange={e => {
                setFrom(e.target.value);
                debounceCall(e.target.value, to, selectedTrucks, startDate, endDate, page, perPage);
              }}
            />
            <Input
              type='text'
              value={to}
              placeholder='To ...'
              className='w-[150px] lg:w-[200px]'
              name='to'
              onChange={e => {
                setTo(e.target.value);
                debounceCall(from, e.target.value, selectedTrucks, startDate, endDate, page, perPage);
              }}
            />

            <Input
              type='date'
              value={startDate}
              className='w-[150px] lg:w-[200px]'
              onChange={e => {
                setStartDate(e.target.value);
                debounceCall(from, to, selectedTrucks, e.target.value, endDate, page, perPage);
              }}
            />
            <Input
              type='date'
              value={endDate}
              className='w-[150px] lg:w-[200px]'
              onChange={e => {
                setEndDate(e.target.value);
                debounceCall(from, to, selectedTrucks, startDate, e.target.value, page, perPage);
              }}
            />

            <div className='flex gap-x-2'>
              <FilterSelect
                label='Filter trucks'
                value={selectedTrucks}
                options={truckOptions?.map(item => ({ label: item.numberPlate, value: item.id }))}
                setValue={setSelectedTrucks}
                onClose={() => {
                  debounceCall(from, to, selectedTrucks, startDate, endDate, page, perPage);
                }}
                onOpen={fetchTrucks}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              handlePrint(printRef, 'Load Table');
            }}
            className='btn btn-primary mb-4 flex items-center gap-2'
          >
            <Printer className='w-4 h-4' />
            Print Table
          </Button>
        </div>

        <div className='overflow-hidden rounded-md border mt-5' ref={printRef}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup, i) => (
                <TableRow key={i}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead key={index} className={NO_PRINT_COLUMN.includes(header.column.id) ? 'no-print' : ''}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columnsCount={columns.length} />
              ) : table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        {row.getVisibleCells().map((cell, index) => {
                          return (
                            <TableCell
                              key={index}
                              className={NO_PRINT_COLUMN.includes(cell.column.id) ? 'no-print' : ''}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                  <TableRow className='hidden'>
                    <TableCell colSpan={4} className='total'>
                      <div className='font-semibold text-right pr-4'>
                        Total Amount: <span className='ml-2'>SAR {totalAmount}</span>
                      </div>
                    </TableCell>
                    <TableCell colSpan={columns.length - 4} className='total'>
                      <div className='font-semibold text-center '>
                        Total Trip Amount: <span className='ml-2'>SAR {totalTripMoney}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          totalRecords={totalRows}
          totalPages={totalPages}
          limit={perPage}
          currentPage={page}
          onLimitChange={handlelimitChange}
          onPageChange={handlePageChange}
        />
      </div>
      {open ? (
        <AddEditLoad
          isEdit={isEdit}
          open={open}
          onClose={() => {
            dispatch(setSelectedLoad(null));
            setOpen(false);
            setEdit(false);
          }}
        />
      ) : null}

      {deleteModal ? (
        <DeleteLoad
          open={deleteModal}
          onClose={() => {
            dispatch(setSelectedLoad(null));
            setDeleteModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default Load;
