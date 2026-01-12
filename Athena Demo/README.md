# Athena - Next-Gen Transaction Monitoring UI

A high-fidelity, interactive prototype for a crypto transaction monitoring dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI (Radix Primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: Zustand
- **Table**: TanStack Table

## Features

- **High-Tech Visuals**: Dark mode, glassmorphism, neon accents, density-optimized layout.
- **Interactive Dashboard**:
  - Filterable Transaction Table (Chain, Asset, Risk, Search).
  - KPI Donut Charts (Clickable to filter).
  - Drill-down Drawer for Transaction Details.
- **Case Management**: Dedicated view for investigation workflows.
- **Mock Data**: Deterministic generation of realistic crypto transaction scenarios.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:3000`.

## Demo Script (What to Show)

1.  **Dashboard Overview**:
    - Show the KPI cards at the top. Note the risk distribution.
    - Scroll through the transaction table.
    - Hover over "Risk Level" badges to see variations.

2.  **Filtering**:
    - Click the "Critical" slice on the Risk Donut chart to filter the table.
    - Use the "Chain" dropdown to select "ETH".
    - Type a hash or name in the global search bar.
    - Clear filters using the "Clear" button.

3.  **Investigation Flow**:
    - Click on a transaction row (e.g., a High Risk one).
    - observe the **Transaction Details Drawer** sliding in from the right.
    - Review the "Risk Score", "Triggered Rules", and "Entity Flow".
    - Click "Create Case" (simulation).

4.  **Case Management**:
    - Navigate to the **Cases** page via the sidebar.
    - View the active cases and their priority distribution.

## Project Structure

- `src/app`: Pages (Dashboard, Cases, Rules, etc.)
- `src/components`: UI components and feature-specific widgets.
- `src/data`: Mock data generators.
- `src/store`: Zustand state management.
- `src/types`: TypeScript definitions.

