import { CATEGORY_COLOR, HOSTAWAY_CHANNEL_MAP, STATUS_COLOR } from '@data/Constants';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import { Input } from '@maincomponents/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincomponents/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maincomponents/components/ui/table';
import FilterSelect from '@maincomponents/Inputs/FilterSelect';
import { cn } from '@maincomponents/lib/utils';
import LoaderButton from '@maincomponents/loaders/LoaderButton';
import TableSkeleton from '@maincomponents/loaders/TableSkeleton';
import ApprovalChangeModal from '@maincomponents/modal/ApprovalChangeModal';
import TablePagination from '@maincomponents/Pagination';
import { fetchAllReview, setPage, setPerPage, setSelectedItem } from '@redux/slice/reviewSlice';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import api from '@utils/axiosInstance';
import debounce from '@utils/debouncer';
import { successToast } from '@utils/toastUtil';
import { set } from 'date-fns';
import { Ellipsis, PenLine, Star, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const columnHelper = createColumnHelper();

const Review = () => {
  let Once = true;
  const dispatch = useDispatch();
  const { data: userData } = useSelector(state => state.auth);
  const { data, isLoading, totalRows, page, perPage, totalPages } = useSelector(state => state.reviews);
  const [sycncLoading, setSyncLoading] = useState(false);
  const [dataSyncStatus, setDataSyncStatus] = useState('not_started');
  const [syncing, setSyncing] = useState(null);
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [channels, setChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [approved, setApproved] = useState('');
  const [approvalModal, setApprovalModal] = useState(false);

  async function checkDataSyncStatus() {
    try {
      setSyncLoading(true);
      const response = await api.get('/hostaway/sync_status');
      const status = response?.data?.reviewSyncStatus?.dataStatus;
      setDataSyncStatus(status || false);
      setSyncLoading(false);
      if (status === 'completed') {
        getReviewsData();
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncLoading(false);
    }
  }

  async function syncData() {
    try {
      setSyncing(true);
      const response = await api.patch('/hostaway/sync_status');
      successToast(response?.data?.message || 'Data sync initiated successfully');
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setSyncing(false);
    }
  }

  function handlePageChange(pageNo) {
    dispatch(setPage(pageNo));
  }

  function handlelimitChange(limit) {
    dispatch(setPerPage(limit));
  }

  async function getReviewsData() {
    await dispatch(fetchAllReview({ page, perPage, minRating, maxRating, search: searchTerm, channels, approved }));
  }

  const columns = useMemo(() => [
    columnHelper.accessor('serial', {
      header: 'S.No',
      cell: ({ row }) => <div className='w-fit text-nowrap pl-1'>{row.index + 1}</div>
    }),
    columnHelper.accessor('guestName', {
      header: 'Guest Name',
      cell: ({ row }) => <div className='w-fit text-nowrap capitalize'>{row?.original?.guestName || 'N/A'}</div>
    }),
    // columnHelper.accessor('type', {
    //   header: 'Type',
    //   cell: ({ row }) => <div className='w-fit text-nowrap'>{row?.original?.type || 'N/A'}</div>
    // }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => {
        const { status } = row.original;
        const badgeColor = STATUS_COLOR.get(status);
        return (
          <div className='flex space-x-2'>
            <Badge variant='outline' className={cn('capitalize', badgeColor)}>
              {status}
            </Badge>
          </div>
        );
      }
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.rating || 'N/A'}</div>
    }),

    columnHelper.accessor('listingName', {
      header: 'Listing',
      cell: ({ row }) => <div className='w-fit text-nowrap'>{row.original.listingName}</div>
    }),
    columnHelper.accessor('approved', {
      header: 'Approved',
      cell: ({ row }) => {
        const { approved } = row.original;
        const badgeColor = approved
          ? 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200 '
          : ' bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10';
        return (
          <div className='flex space-x-2'>
            <Badge variant='outline' className={cn('capitalize', badgeColor)}>
              {approved ? 'Approved' : 'Not Approved'}
            </Badge>
          </div>
        );
      }
    }),
    columnHelper.accessor('categories', {
      header: 'Categories',
      cell: ({ row }) => {
        const categories = row.original?.categories || [];
        const [showAll, setShowAll] = useState(false);

        const displayedCategories = showAll ? categories : categories.slice(0, 2);

        const getRandomColor = () => {
          const index = Math.floor(Math.random() * CATEGORY_COLOR.length);
          return CATEGORY_COLOR[index];
        };
        return (
          <div className='flex flex-wrap gap-1 bg'>
            {displayedCategories.map((cat, idx) => (
              <Badge key={idx} variant='outline' className={`capitalize ${getRandomColor()}`}>
                {cat.key}: <Star className='inline-block w-3 h-3 ml-1 ' />
                {cat.rating}
              </Badge>
            ))}

            {categories?.length > 2 && !showAll && (
              <button className='text-blue-500 text-xs ml-1' onClick={() => setShowAll(true)}>
                +{categories.length - 2} more
              </button>
            )}

            {showAll && categories?.length > 2 && (
              <button className='text-blue-500 text-xs ml-1' onClick={() => setShowAll(false)}>
                show less
              </button>
            )}
          </div>
        );
      }
    }),
    columnHelper.accessor('channel', {
      header: 'Channel',
      cell: ({ row }) => <div className='w-fit text-nowrap capitalize'>{row.original.channel}</div>
    }),
    columnHelper.accessor('submittedAt', {
      header: 'Submitted',
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>
          {row.original.submittedAt ? new Date(row.original.submittedAt).toLocaleDateString() : 'N/A'}
        </div>
      )
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
                  dispatch(setSelectedItem(row.original));
                  setApprovalModal(true);
                }}
              >
                Change Approval Status
                <DropdownMenuShortcut>
                  <PenLine size={16} />
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

  const debounceCall = useMemo(() => {
    return debounce((searchTerm, minRating, maxRating, approved, channels, pageValue, perPageValue) => {
      dispatch(
        fetchAllReview({
          search: searchTerm,
          minRating,
          maxRating,
          approved,
          channels,
          page: pageValue,
          perPage: perPageValue
        })
      );
    }, 700);
  }, [dispatch]);

  useEffect(() => {
    if (data?.length) {
      getReviewsData();
    }
  }, [page, perPage]);

  useEffect(() => {
    if (Once) {
      Once = false;
      if (!userData?.hostAwayConnection) {
        return;
      } else {
        checkDataSyncStatus();
      }
    }
  }, []);

  return (
    <>
      <div>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Reviews</h2>
          <p className='text-muted-foreground'>Manage your reviews here</p>
        </div>
        {!userData?.clientId || !userData?.hostAwayConnection ? (
          <Card className={'mt-4'}>
            <CardHeader>
              <CardTitle>
                <h1 className='text-red-500'>OOPs! Hostway not connected</h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Looks like you have not added hostaway keys or connected to hostaway. Please go to integration page and
                add your hostaway keys and connect to hostaway to manage your reviews or{' '}
                <Link to='/integration' className='font-semibold text-blue-600 hover:underline'>
                  Click here
                </Link>
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className='mt-2'>
            {sycncLoading ? (
              <div role='status' className='flex justify-center items-center pt-20'>
                <svg
                  aria-hidden='true'
                  className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              <div>
                <div className='flex justify-end'>
                  {dataSyncStatus === 'pending' ? (
                    <LoaderButton btnText='Syncing ...' loaderText='Syncing...' loading={true} type='button' />
                  ) : (
                    <LoaderButton
                      btnText={`${dataSyncStatus === 'completed' ? 'Sync Again' : 'Sync Data'}`}
                      loaderText='Syncing...'
                      loading={syncing}
                      type='button'
                      onClick={syncData}
                    />
                  )}
                </div>

                {dataSyncStatus === 'completed' ? (
                  <>
                    <div className='flex items-center justify-start gap-3 flex-wrap mt-3'>
                      <Input
                        type='text'
                        value={searchTerm}
                        placeholder='Search guest or listing name'
                        className='w-[150px] lg:w-[300px]'
                        onChange={e => {
                          setSearchTerm(e.target.value);
                          debounceCall(e.target.value, minRating, maxRating, approved, channels, page, perPage);
                        }}
                      />

                      <Select
                        value={minRating}
                        onValueChange={value => {
                          setMinRating(value);
                          debounceCall(searchTerm, Number(value), maxRating, approved, channels, page, perPage);
                        }}
                      >
                        <SelectTrigger className='w-[120px]'>
                          <SelectValue placeholder='Min Rating' />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(r => (
                            <SelectItem key={r} value={r.toString()}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={maxRating}
                        onValueChange={value => {
                          setMaxRating(value);
                          debounceCall(searchTerm, minRating, Number(value), approved, channels, page, perPage);
                        }}
                      >
                        <SelectTrigger className='w-[120px]'>
                          <SelectValue placeholder='Max Rating' />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(r => (
                            <SelectItem key={r} value={r.toString()}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={approved === 'false' ? 'false' : approved === 'true' ? 'true' : 'all'}
                        onValueChange={value => {
                          let parsedValue = null;
                          if (value === 'true') parsedValue = 'true';
                          if (value === 'false') parsedValue = 'false';

                          setApproved(parsedValue);
                          debounceCall(searchTerm, minRating, maxRating, parsedValue, channels, page, perPage);
                        }}
                      >
                        <SelectTrigger className='w-[160px]'>
                          <SelectValue placeholder='Filter by Approval' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All</SelectItem>
                          <SelectItem value='true'>Approved</SelectItem>
                          <SelectItem value='false'>Not Approved</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className='flex gap-x-2'>
                        <FilterSelect
                          label='Filter Channels'
                          value={channels}
                          options={HOSTAWAY_CHANNEL_MAP?.map(item => ({ label: item.toUpperCase(), value: item }))}
                          setValue={setChannels}
                          onClose={() => {
                            debounceCall(searchTerm, minRating, maxRating, approved, channels, page, perPage);
                          }}
                        />
                      </div>

                      <Button
                        onClick={async () => {
                          setSearchTerm('');
                          setMinRating('');
                          setMaxRating('');
                          setApproved('');
                          setChannels([]);
                          await dispatch(fetchAllReview({ page: 1, perPage }));
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                    <div className='overflow-hidden rounded-md border mt-5'>
                      <Table>
                        <TableHeader>
                          {table.getHeaderGroups().map((headerGroup, i) => (
                            <TableRow key={i}>
                              {headerGroup.headers.map((header, index) => {
                                return (
                                  <TableHead key={index}>
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
                            table.getRowModel().rows.map((row, index) => {
                              return (
                                <TableRow key={index}>
                                  {row.getVisibleCells().map((cell, index) => {
                                    return (
                                      <TableCell key={index}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })
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
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
      {approvalModal ? (
        <ApprovalChangeModal
          open={approvalModal}
          onClose={() => {
            dispatch(setSelectedItem(null));
            setApprovalModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default Review;
