import { ImageOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

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
      <Avatar className="h-10 w-10 border border-border/50 rounded-lg shrink-0">
        <AvatarImage src={imageUrl || undefined} alt={name} className="object-cover" />
        <AvatarFallback 
          className="rounded-lg text-xs font-medium text-white shadow-inner"
          style={{ backgroundColor: bgColor }}
        >
          {imageUrl === null ? <ImageOff className="h-4 w-4 opacity-50 text-white" /> : initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden">
        <span className="font-semibold text-sm truncate">{name}</span>
        {sku && <span className="text-xs text-muted-foreground truncate">{sku}</span>}
      </div>
    </div>
  )
}
