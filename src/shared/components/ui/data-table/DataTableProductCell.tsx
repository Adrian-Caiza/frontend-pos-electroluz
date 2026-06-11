import { ImageOff } from "lucide-react"

interface DataTableProductCellProps {
  name: string
  sku?: string
  imageUrl?: string | null
}

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
  return '#' + '00000'.substring(0, 6 - c.length) + c
}

export function DataTableProductCell({ name, sku, imageUrl }: DataTableProductCellProps) {
  // Generate a soft background color from name hash
  const bgColor = stringToColor(name)
  // Extract initials
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 rounded-lg border border-border overflow-hidden shrink-0 shadow-sm bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-xs font-semibold text-white shadow-inner"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="font-semibold text-sm truncate">{name}</span>
        {sku && <span className="text-xs text-muted-foreground truncate">{sku}</span>}
      </div>
    </div>
  )
}
