# Vectora — Goal Intelligence Platform

Vectora is a robust, cloud-native application for goal tracking, check-ins, and performance management. It transitions from a local-state prototype to true end-to-end data persistence using Supabase.

## Architecture & Infrastructure
- **Frontend**: Next.js (React)
- **Backend/Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Infrastructure Cost**: $0 (Utilizing Supabase and Vercel free tiers)

## Authentication Strategy (Rule 5.1.4 Exception)
As per the initial business requirements, Azure AD SSO was considered for enterprise authentication. However, due to the lack of an available Azure AD tenant, this requirement (Rule 5.1.4) has been formally excluded from this deployment. 
For demonstration and testing purposes, we utilize the "Quick Access - Demo Roles" on the login page while persisting all application data securely in Supabase.

## Setup
1. Clone the repository.
2. Run `npm install`.
3. Set up the `.env.local` variables with your Supabase credentials.
4. Run `npm run dev` to start the local development server.
