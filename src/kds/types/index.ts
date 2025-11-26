export interface OrderItem {
    name: string
    qty: number
    price: number
}

export interface Order {
    id: string
    /** Optional human-friendly order number from API */
    orderNo?: string
    tableId: string
    /** Optional numeric table identifier if provided separately */
    tableNo?: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'preparing' | 'ready'
    createdAt: string
}