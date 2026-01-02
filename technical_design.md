# Nixty Technical Design

## 1. System Architecture

Nixty follows a **headless, decoupled architecture** to ensure flexibility, scalability, and strict separation of concerns.

### High-Level Diagram

```mermaid
graph TD
    Client[Frontend Client] -->|HTTPS/JSON| API_GW[API Gateway / Load Balancer]
    API_GW --> API[Backend API Service]
    API --> Auth[Auth Service / Middleware]
    API --> DB[(PostgreSQL Database)]
    API --> Payment[Payment Gateway (Stripe/PayPal)]
    API --> Email[Email Service (SMTP/SendGrid)]
    
    subgraph "Backend Core"
        API
        Auth
        DB
    end
    
    subgraph "External Services"
        Payment
        Email
    end
```

- **Frontend**: Agnostic (React, Vue, Mobile). Consumes API via secure HTTPS.
- **Backend**: Node.js (TypeScript) with Express/NestJS.
- **Database**: PostgreSQL (Relational) for structured data integrity.
- **Statelessness**: RESTful API design.

## 2. Database Schema

We will use a normalized relational schema.

### Tables

**Users**
- `id` (UUID, PK)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `role` (ENUM: 'customer', 'admin')
- `created_at` (TIMESTAMP)

**Products**
- `id` (UUID, PK)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `type` (ENUM: 'key', 'credential', 'link')
- `created_at` (TIMESTAMP)

**Inventory**
- `id` (UUID, PK)
- `product_id` (UUID, FK -> Products.id)
- `data` (TEXT - Encrypted License Key or Credential JSON)
- `status` (ENUM: 'available', 'sold', 'reserved')
- `order_id` (UUID, FK -> Orders.id, Nullable)
- `created_at` (TIMESTAMP)

**Orders**
- `id` (UUID, PK)
- `user_id` (UUID, FK -> Users.id)
- `total_amount` (DECIMAL)
- `status` (ENUM: 'pending', 'paid', 'failed', 'refunded')
- `payment_reference` (VARCHAR)
- `created_at` (TIMESTAMP)

**OrderItems**
- `id` (UUID, PK)
- `order_id` (UUID, FK -> Orders.id)
- `product_id` (UUID, FK -> Products.id)
- `price_at_purchase` (DECIMAL)
- `inventory_id` (UUID, FK -> Inventory.id)

## 3. Fulfillment Workflow

1.  **Cart Checkout**: User initiates checkout.
2.  **Order Creation**: Backend creates an `Order` with status `pending`.
3.  **Inventory Reservation** (Optional but recommended): Backend temporarily reserves stock to prevent oversell.
4.  **Payment Processing**: User completes payment via Gateway.
5.  **Webhook Confirmation**: Gateway sends webhook to Backend.
6.  **Atomic Allocation**:
    -   Backend verifies payment.
    -   **TRANSACTION START**
    -   Update `Order` status to `paid`.
    -   Select available `Inventory` item for the product `FOR UPDATE`.
    -   Update `Inventory` status to `sold` and link `order_id`.
    -   **TRANSACTION COMMIT**
7.  **Delivery**:
    -   Send email with keys/credentials.
    -   Expose details in `GET /orders/:id` API.

## 4. API Specification

**Authentication**
- `POST /auth/login` -> `{ token: "jwt..." }`
- `POST /auth/register`

**Products**
- `GET /products` -> `[{ id, name, price, type }, ...]`
- `GET /products/:id`

**Orders & Cart**
- `POST /orders` (Create order)
- `POST /orders/:id/pay` (Simulate payment or get payment intent)
- `GET /orders/:id` (Get order details + delivered keys if paid)

**Admin**
- `POST /admin/products`
- `POST /admin/inventory` (Bulk upload keys)
- `GET /admin/stats`

### Example Response: License Delivery
```json
{
  "order_id": "123-abc",
  "status": "paid",
  "items": [
    {
      "product_name": "Antivirus Pro",
      "license_key": "XXXX-YYYY-ZZZZ-0000",
      "instructions": "Download from..."
    }
  ]
}
```

## 5. Security Considerations

-   **Encryption**: `Inventory.data` MUST be AES-256 encrypted at rest. Decrypted only upon delivery to the owner.
-   **Rate Limiting**: Apply strict rate limits to auth and order endpoints.
-   **Idempotency**: Webhook handlers must check if an order is already processed to avoid double fulfillment.
-   **Access Control**: Users can strictly only view orders they own (`WHERE user_id = current_user`).
