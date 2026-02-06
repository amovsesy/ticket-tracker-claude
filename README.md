# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:none" drizzle="database:postgresql+postgresql:postgres.js+docker:no" --install pnpm ticket-tracker
```

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Ticket Tracking app

A desktop-first web application that helps users track event ticket prices across major US ticketing platforms and receive notifications when prices drop below their desired threshold.

## Overview

This app allows users to monitor ticket prices from multiple sources (StubHub, Ticketmaster, SeatGeek) and get alerted when prices fall below their specified price point. Users can customize tracking by section, seat type, and set personalized price thresholds.

## Key Features

### Core Functionality

- **Multi-Platform Price Tracking**: Import and track events from StubHub, Ticketmaster, and SeatGeek
- **Price Threshold Alerts**: Set custom price alerts for specific sections or seat types
- **Price History Visualization**: View price trends over time with sparkline graphs and detailed charts
- **Multiple Event Tracking**: Track multiple events simultaneously (paid tier)
- **Smart Notifications**: Email alerts (free) or SMS alerts (paid) when prices drop

### User Tiers

**Free Tier:**

- Track one event at a time
- Email notifications
- Daily digest updates
- Basic price history

**Paid Tier:**

- Track unlimited events
- Real-time SMS notifications
- Live price updates
- Advanced filtering and section selection
- Priority support

**Note:** All paid features are currently free during the launch period.
