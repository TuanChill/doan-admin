import { Button } from '@/components/common/button';
import { CommonInput } from '@/components/common/common-input';
import { SearchIcon } from 'lucide-react';
import { DatePickerWithRange } from '@/components/common/date-picker-with-range';
import { CommonTable } from '@/components/common/common-table';
import { ColumnDef } from '@tanstack/react-table';

const mockData = [
  {
    tnxHash: '1234567890',
    address: '1234567890',
    date: '1234567890',
    transactionType: '1234567890',
    quantity: '1234567890',
    value: '1234567890',
    price: '1234567890',
  },
];

export const ContentExecute = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    {
      id: 'TnX Hash',
      header: 'TnX Hash',
      accessorKey: 'TnX Hash',
      cell: ({ row }) => <span>{row.original.tnxHash}</span>,
    },
    {
      id: 'Wallet address',
      header: 'Wallet address',
      accessorKey: 'Wallet address',
      cell: ({ row }) => <span>{row.original.address}</span>,
    },
    {
      id: 'Date',
      header: 'Date',
      accessorKey: 'Date',
      cell: ({ row }) => <span>{row.original.Date}</span>,
    },
    {
      id: 'Transaction Type',
      header: 'Transaction Type',
      accessorKey: 'Transaction Type',
      cell: ({ row }) => <span>{row.original.transactionType}</span>,
    },
    {
      id: 'Quantity (Amount)',
      header: 'Quantity (Amount)',
      accessorKey: 'Quantity (Amount)',
      cell: ({ row }) => <span>{row.original.quantity}</span>,
    },
    {
      id: 'Value',
      header: 'Value',
      accessorKey: 'Value',
    },
    {
      id: 'Price',
      header: 'Price',
      accessorKey: 'Price',
      cell: ({ row }) => <span>{row.original.price}</span>,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <CommonInput
          customClassNames="w-[300px]"
          placeholder="Search Wallet"
          iconElement={<SearchIcon size={16} color="#828284" />}
        />
        <DatePickerWithRange />
        <Button className="h-[40px]">Search</Button>
      </div>
      <div className="mt-6">
        <CommonTable
          columns={columns}
          data={mockData}
          docsPerPage={10}
          totalDocs={100}
          totalPage={10}
        />
      </div>
    </div>
  );
};
