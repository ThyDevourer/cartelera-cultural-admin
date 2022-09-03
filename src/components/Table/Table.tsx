import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Skeleton
} from '@chakra-ui/react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef
} from '@tanstack/react-table'
import TableSkeleton from '../TableSkeleton/TableSkeleton'

interface Props<T> {
  columns: ColumnDef<T, any>[]
  rows: T[]
  isLoading: boolean
}

const Table = <T, >({ columns, rows, isLoading }: Props<T>) => {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Box
      borderRadius='xl'
      bgColor='bg.alt'
      h='75vh'
      overflowY='scroll'
    >
      <TableContainer w='full' borderRadius='xl'>
        <ChakraTable>
          <Thead bgColor='brand.100'>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th color='bg.main' key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {!isLoading
              ? table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Td key={cell.id} py={2}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
              ))
              : <TableSkeleton colQty={6} rowQty={20} />}
          </Tbody>
          <Tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <Tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <Th key={header.id}>
                    {flexRender(header.column.columnDef.footer, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Tfoot>
        </ChakraTable>
      </TableContainer>
    </Box>
  )
}

export default Table
