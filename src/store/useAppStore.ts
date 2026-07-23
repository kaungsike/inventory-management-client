import { create } from 'zustand'

interface Notification { id: string; message: string; type: 'warning' | 'error' | 'info'; read: boolean }

interface AppStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void
  markRead: (id: string) => void
  clearNotifications: () => void
  filters: Record<string, Record<string, unknown>>
  setFilter: (page: string, key: string, value: unknown) => void
  clearFilters: (page: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  notifications: [],
  addNotification: (n) =>
    set((s) => ({
      notifications: [
        ...s.notifications,
        { ...n, id: Date.now().toString(), read: false },
      ],
    })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  clearNotifications: () => set({ notifications: [] }),

  filters: {},
  setFilter: (page, key, value) =>
    set((s) => ({ filters: { ...s.filters, [page]: { ...s.filters[page], [key]: value } } })),
  clearFilters: (page) =>
    set((s) => { const f = { ...s.filters }; delete f[page]; return { filters: f } }),
}))
