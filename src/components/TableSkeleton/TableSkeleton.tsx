import {
  Skeleton,
  Tr,
  Td
} from '@chakra-ui/react'

interface Props {
  rowQty: number
  colQty: number
}

const TableSkeleton = ({ rowQty, colQty }: Props) => {
  const dummyRows = [...Array(rowQty).keys()]
  const dummyCols = [...Array(colQty).keys()]
  return (
    <>
      {dummyRows.map(key => (
        <Tr key={key}>
          {dummyCols.map(key => (
            <Td key={key}>
              <Skeleton h='20px' />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  )
}

export default TableSkeleton
