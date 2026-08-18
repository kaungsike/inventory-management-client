export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  discontinued: 'Discontinued',
  draft: 'Draft',
  sent: 'Sent',
  partial: 'Partial',
  received: 'Received',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  completed: 'Completed',
  purchase: 'Purchase',
  sale: 'Sale',
  transfer: 'Transfer',
  adjustment: 'Adjustment',
  return: 'Return',
  return_in: 'Return In',
  damage: 'Damage',
  expired: 'Expired',
  archived: 'Archived',
}

export const USER_ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
}

export function statusLabel(status: string | null | undefined): string {
  if (status === null || status === undefined) return ''
  return STATUS_LABELS[status] ?? status
}

export function roleLabel(role: string | null | undefined): string {
  if (role === null || role === undefined) return ''
  return USER_ROLE_LABELS[role] ?? role
}

export function toLabelItems<T extends { id: number }>(
  entities: T[],
  label: (entity: T) => string
): Record<string, string> {
  const items: Record<string, string> = {}
  for (const entity of entities) {
    items[String(entity.id)] = label(entity)
  }
  return items
}