// src/types/order.ts
export interface SelectedExtra {
    extraId: string
    name: string
    price: number
    qty: number
    quantityPerUnit?: number
    ingredientId?: string
}

export interface OrderItem {
    menuItemId: string
    menuItemName: string
    sizeName: string
    basePrice: number
    qty: number
    extras: SelectedExtra[]
    chickenUsed?: number
    riceUsed?: number
    cheeseUsed?: number
    totalIngredientCost?: number
    mediaUrl?: string
    image?: string
    imageUrl?: string
    img?: string
    item?: {
        name?: string
        mediaUrl?: string
    }
}

export interface Order {
    id: string
    orderNo: number
    kotToken: string
    tableId?: string | null
    tableNumber?: string | null
    source: string
    items: OrderItem[]
    total: number
    status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled' | 'paid'
    createdAt: string
    updatedAt: string
    servedAt?: string | null
    paymentStatus: string
    customerName: string
    customerPhone?: string | null
    notes?: string | null
    waiterName: string
}