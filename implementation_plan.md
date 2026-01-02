# Nixty Implementation Plan

## Goal Description
Implement the "Nixty" headless e-commerce system based on the [Technical Design](technical_design.md).

## Proposed Changes
### Backend (`Nixty/backend`)
#### [NEW] [Project Setup]
- Initialize Node.js/TypeScript project.
- Install dependencies: `express`, `pg` (or `typeorm`/`prisma`), `jsonwebtoken`, `bcrypt`, `dotenv`.

#### [NEW] [Database]
- Set up PostgreSQL connection.
- Create migrations for `Users`, `Products`, `Orders`, `Inventory`.

#### [NEW] [API Core]
- Implement Auth Middleware (JWT).
- Implement Error Handling.

#### [NEW] [Features]
- **Auth**: Register, Login.
- **Products**: CRUD APIs.
- **Orders**: Create, Payment Webhook, Get Details.
- **Inventory**: Secure storage and atomic allocation logic.

### Frontend (`Nixty/frontend`)
#### [NEW] [Project Setup]
- Initialize Next.js project.

#### [NEW] [Pages]
- **Catalog**: List products.
- **Product Detail**: Show product info + Buy button.
- **Checkout**: Simple payment flow simulation.
- **Dashboard**: View purchased keys.

## Verification Plan
### Automated Tests
- **Backend**: Jest tests for API endpoints (`/auth`, `/orders`).
- **Integration**: Test the atomic transaction logic for inventory allocation.

### Manual Verification
- **Flow**:
    1.  Register User.
    2.  Browse Product.
    3.  Buy Product (Simulate Payment).
    4.  Verify License Key is delivered and marked 'sold' in DB.
