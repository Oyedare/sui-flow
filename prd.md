Sui Flow: Portfolio & Tax Tool
Product Requirements Document (PRD)
1. Executive Summary
Product Name: Sui Flow (formerly SuiTracker)

Version: 1.1

Date: December 2024

Product Owner: [Your Name]

Status: Draft

Overview
Sui Flow is a comprehensive, privacy-first portfolio tracking and tax reporting tool designed specifically for the Sui blockchain community. Beyond standard tracking, it leverages native Sui technologies—Suins for identity, Walrus for decentralized data storage, and Nautilus for verifiable privacy-preserving computations—to provide a truly "Sui Rich" experience. It addresses the critical need for unified asset management across the rapidly growing Sui ecosystem.

Problem Statement
Sui users currently face significant challenges:

No unified view of assets across multiple protocols and platforms
Manual tracking required for portfolio performance
Complex tax calculation and reporting for crypto transactions
Difficulty understanding real-time profit/loss across holdings
Data privacy concerns with centralized tracking platforms
Solution
Sui Flow provides a single, user-friendly dashboard that automatically tracks all Sui blockchain activity. It distinguishes itself by using:

Suins for human-readable wallet identities.
Walrus for secure, user-owned storage of tax reports and transaction history.
Nautilus (TEE) for calculating taxes and sensitive metrics without exposing raw user data to centralized servers.
2. Product Goals & Success Metrics
Primary Goals
Enable users to view their complete Sui portfolio in one place.
Automate profit/loss calculations across all asset types.
Simplify tax reporting for Sui transactions using verifiable private computation.
Showcase the power of the Sui software stack (Suins, Walrus, Nautilus).
Success Metrics (6 months post-launch)
User Adoption: 10,000+ active users
Portfolio Tracking: 50,000+ wallets connected
Engagement: 40% weekly active user rate
Tax Reports: 2,000+ tax reports stored on Walrus
Performance: Portfolio sync time <5 seconds
3. Target Users
(Same as original: Active Trader, DeFi Participant, NFT Collector, Casual Holder)

4. Core Features & Requirements
4.1 Portfolio Dashboard
Priority: P0 (Must Have)

Total portfolio value in USD and SUI
Asset breakdown (tokens, NFTs, DeFi)
Real-time updates
Feature: Uses Suins to resolve and display user avatars and names instead of raw addresses.
4.2 Wallet Connection
Priority: P0 (Must Have)

Support for major Sui wallets (Sui Wallet, Ethos, Suiet, Martian)
Integration: Suins resolution for all connected wallets.
View-only mode logic.
4.3 Token Tracking
Priority: P0 (Must Have)

Display tokens, prices, cost basis (FIFO/LIFO/Avg).
Support for wrapped/bridged tokens.
4.4 DeFi Position Tracking
Priority: P0 (Must Have)

Integration with major protocols (Cetus, Turbos, Navi, Scallop, AfterMath, etc.).
Impermanent loss calculation.
4.5 NFT Portfolio
Priority: P1 (Should Have)

Storage: optional metadata caching on Walrus for faster loading of NFT galleries.
Floor price tracking and P&L.
4.6 Transaction History
Priority: P0 (Must Have)

Complete record of transactions.
Storage: Archives of historical transaction data stored on Walrus to reduce centralized database bloat and give users ownership.
4.7 Tax Reporting (Privacy-First)
Priority: P0 (Must Have)

Technology: Uses Nautilus (Trusted Execution Environment) to perform tax calculations off-chain but verifiably.
Benefit: User privacy is preserved; raw financial data doesn't sit in a centralized DB in plain text.
Outputs: Form 8949, country-specific reports.
Storage: Generated PDF/CSV reports are encrypted and stored on Walrus, retrievable only by the user.
4.8 Analytics & Insights
Priority: P1 (Should Have)

Performance charts, risk metrics.
Asset allocation breakdown.
4.9 Alerts & Notifications
Priority: P2 (Nice to Have)

Price, Value, and Staking alerts.
4.10 Settings & Preferences
Priority: P1 (Should Have)

Currency, Theme (Dark/Light).
Identity: Manage Suins profile display settings.
5. Technical Requirements
5.1 Architecture
Frontend:

Next.js for web application
Tailwind CSS for styling (Sui Flow aesthetic)
Sui dApp Kit (@mysten/dapp-kit) for wallet connection
Backend & Data Layer:

Node.js API for aggregations.
Sui SDK for blockchain interaction.
Suins SDK for name resolution.
Walrus SDK for decentralized file storage (reports, history archives).
Nautilus Integration for secure compute (tax engine).
Blockchain Integration:

Sui RPC nodes.
Indexer (e.g., Sui Indexer or custom) for high-speed history.
5.2 Performance Requirements
Page load <3s.
Sync <5s.
5.3 Security Requirements & Privacy
Nautilus: Leveraging TEEs for sensitive data processing.
Walrus: Decentralized storage eliminates central data honeypots.
Read-only wallet access.
6. User Experience & Design
6.1 Design Concept "Flow"
Aesthetic: Fluid animations, "water/flow" motif consistent with Sui identity.
Interactions: Fast, optimistic UI updates.
Visuals: High-quality glassmorphism, vibrant Sui blues and teals.
6.2 Key User Flows
Onboarding: Connect Wallet -> Resolve Suins -> Load Dashboard.
Tax Gen: Select Year -> Nautilus computes -> Report saved to Walrus -> Download.
7. MVP Scope (Phase 1)
✅ Wallet connection (w/ Suins)
✅ Portfolio dashboard (Token & DeFi)
✅ Transaction history
✅ Basic Tax Report (US, FIFO)
✅ Storage of Reports on Walrus
8. Development Timeline & Team
(Standard timeline as per original, adapted for new tech stack integration)

9. Appendix: "Sui Rich" Integrations
Suins: Identity layer (Names, Avatars).
Walrus: Storage layer (User Data, Reports, NFT Cache).
Nautilus: Compute/Privacy layer (Tax Engine).
This PRD is a living document for Sui Flow.