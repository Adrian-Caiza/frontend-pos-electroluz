import type { ColumnDef } from '@tanstack/react-table';
import type { Proforma } from '../../domain/Proforma';
import { DataTableColumnHeader } from '../../../../shared/components/ui/data-table/DataTableColumnHeader';
import { DataTableCheckbox } from '../../../../shared/components/ui/data-table/DataTableCheckbox';
import { DataTableRowActions, type DataTableRowActionItem } from '../../../../shared/components/ui/data-table/DataTableRowActions';
import { Receipt, CheckCircle2, XCircle, Pencil, FileText } from 'lucide-react';
import { MdiGmail, LaWhatsapp } from '../../../../shared/components/icons/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTableStatusBadge } from '../../../../shared/components/ui/data-table/DataTableStatusBadge';

export interface ProformaTableMeta {
  onCancel: (id: string) => void;
  onPay: (id: string) => void;
  onEdit: (id: string) => void;
  isCanceling: boolean;
  isPaying: boolean;
  isSending: boolean;
  onViewPdf: (id: string) => void;
  onSend: (id: string, channel: 'email' | 'whatsapp') => void;
}

export const columns: ColumnDef<Proforma>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex justify-center w-full px-1">
        <DataTableCheckbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center w-full px-1">
        <DataTableCheckbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'prfmaidentificador',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Comprobante" />,
    cell: ({ row }) => {
      const proforma = row.original;
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 text-muted-foreground">
            <Receipt className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{proforma.prfmaidentificador}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(proforma.prfmafchregistro), "d MMM yyyy, HH:mm", { locale: es })}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'cliente',
    accessorFn: (row) => `${row.receptor.clntenombre || (row.receptor as any).cliente?.clntenombre} ${row.receptor.clnteidentificacion || (row.receptor as any).cliente?.clnteidentificacion || (row.receptor as any).identificacion || ''}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      const receptor = row.original.receptor;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{receptor.clntenombre || (receptor as any).cliente?.clntenombre}</span>
          <span className="text-xs text-muted-foreground">CI/RUC: {receptor.clnteidentificacion || (receptor as any).cliente?.clnteidentificacion || (receptor as any).identificacion || (receptor as any).clntedocumento || 'N/A'}</span>
        </div>
      );
    },
  },
  {
    id: 'metodopago',
    accessorFn: (row) => row.metodoPago.mpnombre,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método de Pago" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.metodoPago.mpnombre}
      </span>
    ),
  },
  {
    id: 'total',
    accessorFn: (row) => row.total.prfmatotal,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right w-full">
        <span className="font-bold text-foreground">
          ${row.original.total.prfmatotal.toFixed(2)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'prfmaestado',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" className="justify-center" />,
    cell: ({ row }) => {
      const estado = row.getValue('prfmaestado') as string;
      return (
        <div className="flex w-full justify-center">
          <DataTableStatusBadge
            status={estado}
            colorMap={{
              pagada: {
                bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20',
                text: 'text-emerald-700 dark:text-emerald-400',
                dot: 'bg-emerald-500'
              },
              anulada: {
                bg: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20',
                text: 'text-rose-700 dark:text-rose-400',
                dot: 'bg-rose-500'
              },
              cancelada: {
                bg: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20',
                text: 'text-rose-700 dark:text-rose-400',
                dot: 'bg-rose-500'
              },
              emitida: {
                bg: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20',
                text: 'text-amber-700 dark:text-amber-400',
                dot: 'bg-amber-500'
              }
            }}
          />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Acciones" className="text-center w-full block" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta as ProformaTableMeta;
      const proforma = row.original;

      const actions: DataTableRowActionItem[] = [
        {
          label: 'Ver PDF',
          icon: <FileText className="h-4 w-4 text-muted-foreground" />,
          onClick: () => meta.onViewPdf(proforma.prfmaid),
        }
      ];

      if (proforma.prfmaestado === 'emitida') {
        actions.push(
          {
            label: 'Editar Proforma',
            icon: <Pencil className="h-4 w-4 text-blue-600" />,
            onClick: () => meta.onEdit(proforma.prfmaid),
            separatorAbove: true
          },
          {
            label: 'Registrar Pago',
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
            onClick: () => meta.onPay(proforma.prfmaid),
          },
          {
            label: 'Cancelar Proforma',
            icon: <XCircle className="h-4 w-4 text-rose-600" />,
            onClick: () => meta.onCancel(proforma.prfmaid),
            variant: 'danger',
            separatorAbove: true
          }
        );
      }

      if (proforma.prfmaestado !== 'cancelada') {
        const receptor = proforma.receptor;
        const hasEmail = Boolean(receptor.clntecorreo || receptor.cliente?.clntecorreo);
        const hasPhone = Boolean(receptor.clntetelefono || receptor.cliente?.clntetelefono);

        actions.push(
          {
            label: hasEmail ? 'Enviar por Email' : 'Sin correo registrado',
            icon: <MdiGmail className="h-4 w-4 text-slate-600" />,
            onClick: () => meta.onSend(proforma.prfmaid, 'email'),
            separatorAbove: true,
            disabled: !hasEmail || meta.isSending
          },
          {
            label: hasPhone ? 'Enviar por WhatsApp' : 'Sin teléfono registrado',
            icon: <LaWhatsapp className="h-4 w-4 text-slate-600" />,
            onClick: () => meta.onSend(proforma.prfmaid, 'whatsapp'),
            disabled: !hasPhone || meta.isSending
          }
        );
      }

      return (
        <div className="flex justify-center">
          <DataTableRowActions title="Acciones" actions={actions} />
        </div>
      );
    },
  },
];
