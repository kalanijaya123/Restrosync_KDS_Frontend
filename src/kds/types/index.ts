export interface OrderItem {
    name: string
    qty: number
    price: number
}

export interface Order {
    id: string
    /** Human-friendly order number from API */
    orderNo: number
    /** Kitchen order token (optional) */
    kotToken?: string
    /** Customer display name (optional) */
    customerName?: string
    /** Order source (e.g., 'pos', 'mobile') */
    source?: string
    tableId: string
    tableNumber?: string
    /** Optional numeric table identifier if provided separately */
    tableNo?: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'preparing' | 'ready'
    createdAt: string
}