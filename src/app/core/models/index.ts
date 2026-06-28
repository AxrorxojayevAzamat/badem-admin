export type Role = 'admin' | 'moderator' | 'store_operator' | 'supplier_operator' | 'distributor_operator';
export type ProductState = 'at_supplier' | 'at_distributor' | 'at_store' | 'sold' | 'returned';
export interface Product { id: string; name: string; description?: string; price: number; sku: string; stock: number; state?: ProductState; supplierId?: string; distributorId?: string; storeId?: string; imageUrl?: string; }
export interface Company { id: string; name: string; address?: string; phone?: string; }
export interface Page<T> { data: T[]; total: number; page: number; limit: number; }
