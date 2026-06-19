export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'owner' | 'admin' | 'sales'
export type CustomerSegment = 'vip' | 'regular' | 'new' | 'at_risk'
export type OrderChannel = 'tiktok' | 'shopee' | 'facebook' | 'lazada'
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
export type ShipmentStatus =
  | 'picked_up'
  | 'in_transit'
  | 'hub_arrived'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned'
export type ChatChannel = 'tiktok' | 'shopee' | 'facebook' | 'lazada' | 'line'
export type ChatStatus = 'active' | 'resolved' | 'pending'
export type SenderRole = 'customer' | 'agent' | 'system'
export type TagCategory = 'user' | 'order'
export type TaskState = 'todo' | 'in_progress' | 'review' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type FinanceType = 'income' | 'expense' | 'ad_spend'
export type CommissionStatus = 'pending' | 'approved' | 'paid'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: UserRole
          avatar_url: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: UserRole
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          segment: CustomerSegment
          total_orders: number
          total_spent: number
          platforms: string[]
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          segment?: CustomerSegment
          total_orders?: number
          total_spent?: number
          platforms?: string[]
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          segment?: CustomerSegment
          total_orders?: number
          total_spent?: number
          platforms?: string[]
          notes?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          price: number
          cost: number
          stock_quantity: number
          low_stock_threshold: number
          channel: string | null
          category: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          price: number
          cost: number
          stock_quantity?: number
          low_stock_threshold?: number
          channel?: string | null
          category?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          price?: number
          cost?: number
          stock_quantity?: number
          low_stock_threshold?: number
          channel?: string | null
          category?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          channel: OrderChannel
          customer_id: string | null
          sales_id: string | null
          status: OrderStatus
          subtotal: number
          shipping_cost: number
          discount: number
          total_amount: number
          shipping_address: Json | null
          tracking_number: string | null
          shipping_provider: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          channel: OrderChannel
          customer_id?: string | null
          sales_id?: string | null
          status?: OrderStatus
          subtotal?: number
          shipping_cost?: number
          discount?: number
          total_amount?: number
          shipping_address?: Json | null
          tracking_number?: string | null
          shipping_provider?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          channel?: OrderChannel
          customer_id?: string | null
          sales_id?: string | null
          status?: OrderStatus
          subtotal?: number
          shipping_cost?: number
          discount?: number
          total_amount?: number
          shipping_address?: Json | null
          tracking_number?: string | null
          shipping_provider?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          total: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
          total: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          total?: number
        }
      }
      shipment_events: {
        Row: {
          id: string
          order_id: string
          status: ShipmentStatus
          location: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: ShipmentStatus
          location?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: ShipmentStatus
          location?: string | null
          note?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          customer_id: string
          channel: ChatChannel
          assigned_to: string | null
          last_message: string | null
          unread_count: number
          status: ChatStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          channel: ChatChannel
          assigned_to?: string | null
          last_message?: string | null
          unread_count?: number
          status?: ChatStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          channel?: ChatChannel
          assigned_to?: string | null
          last_message?: string | null
          unread_count?: number
          status?: ChatStatus
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: SenderRole
          sender_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: SenderRole
          sender_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_type?: SenderRole
          sender_id?: string | null
          content?: string
          created_at?: string
        }
      }
      message_tags: {
        Row: {
          id: string
          message_id: string
          tag_type: TagCategory
          reference_id: string
          display_text: string
        }
        Insert: {
          id?: string
          message_id: string
          tag_type: TagCategory
          reference_id: string
          display_text: string
        }
        Update: {
          id?: string
          message_id?: string
          tag_type?: TagCategory
          reference_id?: string
          display_text?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: TaskState
          priority: TaskPriority
          assigned_to: string | null
          order_id: string | null
          labels: string[]
          due_date: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: TaskState
          priority?: TaskPriority
          assigned_to?: string | null
          order_id?: string | null
          labels?: string[]
          due_date?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: TaskState
          priority?: TaskPriority
          assigned_to?: string | null
          order_id?: string | null
          labels?: string[]
          due_date?: string | null
          position?: number
          created_at?: string
        }
      }
      commissions: {
        Row: {
          id: string
          sales_id: string
          order_id: string
          amount: number
          rate: number
          status: CommissionStatus
          period: string
          created_at: string
        }
        Insert: {
          id?: string
          sales_id: string
          order_id: string
          amount: number
          rate: number
          status?: CommissionStatus
          period: string
          created_at?: string
        }
        Update: {
          id?: string
          sales_id?: string
          order_id?: string
          amount?: number
          rate?: number
          status?: CommissionStatus
          period?: string
          created_at?: string
        }
      }
      finance_entries: {
        Row: {
          id: string
          type: FinanceType
          category: string
          amount: number
          description: string | null
          reference_id: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          type: FinanceType
          category: string
          amount: number
          description?: string | null
          reference_id?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: FinanceType
          category?: string
          amount?: number
          description?: string | null
          reference_id?: string | null
          date?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          category?: string
          created_at?: string
        }
      }
      customer_tags: {
        Row: {
          customer_id: string
          tag_id: string
        }
        Insert: {
          customer_id: string
          tag_id: string
        }
        Update: {
          customer_id?: string
          tag_id?: string
        }
      }
      quick_reply_templates: {
        Row: {
          id: string
          shortcut: string
          title: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          shortcut: string
          title: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          shortcut?: string
          title?: string
          content?: string
          created_at?: string
        }
      }
    }
    Enums: {
      user_role: UserRole
      customer_segment: CustomerSegment
      order_channel: OrderChannel
      order_status: OrderStatus
      shipment_status: ShipmentStatus
      chat_channel: ChatChannel
      chat_status: ChatStatus
      sender_role: SenderRole
      tag_category: TagCategory
      task_state: TaskState
      task_priority: TaskPriority
      finance_type: FinanceType
      commission_status: CommissionStatus
    }
  }
}
