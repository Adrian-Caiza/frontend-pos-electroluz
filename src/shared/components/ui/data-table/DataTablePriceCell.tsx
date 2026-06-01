interface DataTablePriceCellProps {
  price: number | string
  cost?: number | string
  currency?: string
}

export function DataTablePriceCell({ price, cost, currency = "$" }: DataTablePriceCellProps) {
  const formattedPrice = Number(price).toFixed(2)
  const formattedCost = cost !== undefined ? Number(cost).toFixed(2) : undefined

  return (
    <div className="flex flex-col text-right">
      <span className="font-semibold text-primary">
        {currency}{formattedPrice}
      </span>
      {formattedCost && (
        <span className="text-xs text-muted-foreground">
          Costo: {currency}{formattedCost}
        </span>
      )}
    </div>
  )
}
