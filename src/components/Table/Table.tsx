import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  chakra
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
  fixedColumns?: boolean
}

const Table = <T, >({ columns, rows, isLoading, fixedColumns }: Props<T>) => {
  const Resizer = chakra('div', {
    baseStyle: {
      position: 'absolute',
      right: 0,
      top: 2,
      height: '60%',
      width: '3px',
      bgColor: 'bg.alt',
      cursor: fixedColumns ? 'normal' : 'col-resize',
      userSelect: 'none',
      touchAction: 'none',
      _hover: { bgColor: fixedColumns ? 'bg.alt' : 'fg.main' }
    }
  })

  const table = useReactTable({
    data: rows,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <TableContainer
      borderRadius='xl'
      h='75vh'
      overflowY='scroll'
      bgColor='bg.alt'
    >
      <ChakraTable style={{ width: fixedColumns ? 'unset' : table.getCenterTotalSize() }}>
        <Thead
          position='sticky'
          bgColor='brand.500'
          top={0}
          zIndex='docked'
        >
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th
                  color='fg.main'
                  key={header.id}
                  borderColor='transparent'
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                  position='relative'
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <Resizer />
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {!isLoading
            ? table.getRowModel().rows.map(row => (
              <Tr key={row.id} borderColor='brand.500'>
                {row.getVisibleCells().map(cell => (
                  <Td
                    key={cell.id}
                    py={2}
                    borderColor='brand.500'
                    fontSize='sm'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))
            : <TableSkeleton colQty={columns.length} rowQty={1} />}
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
  )
}

export default Table
