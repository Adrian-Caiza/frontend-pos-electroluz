import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

interface DataTableAvatarCellProps {
  name: string
  subtitle?: string
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

export function DataTableAvatarCell({ name, subtitle, imageUrl }: DataTableAvatarCellProps) {
  const bgColor = stringToColor(name)
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 border border-border/50 shadow-sm shrink-0">
        <AvatarImage src={imageUrl || undefined} alt={name} className="object-cover" />
        <AvatarFallback 
          className="text-xs font-medium text-white shadow-inner"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden">
        <span className="font-medium text-sm truncate">{name}</span>
        {subtitle && <span className="text-xs text-muted-foreground truncate">{subtitle}</span>}
      </div>
    </div>
  )
}
