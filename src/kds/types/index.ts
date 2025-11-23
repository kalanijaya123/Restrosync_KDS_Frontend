export interface OrderItem {
    name: string
    qty: number
    price: number
}

export interface Order {
    id: string
    tableId: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'preparing' | 'ready'
    createdAt: string
}