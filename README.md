# ASR Frontend Portal

## Description

ASR Frontend Portal is a Vite-powered React application designed for performing transcriptions of Ugandan languages. It integrates with `Sunbird AI's` ASR API for efficient speech-to-text conversion.

## Features

- **Fast Development** with Vite
- **React Router** for seamless navigation
- **Speech-to-Text** API integration with `api.sunbird.ai`

## Tech Stack

- **Frontend:** Vite + React
- **Styling:** Tailwind CSS, Material-UI

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SunbirdAI/ASR-portal-react.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd ASR-portal-react
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a `.env` file in the root directory** and add the following environment variables:
   ```bash
   VITE_SB_API_URL=<your_api_url>
   VITE_SB_API_TOKEN=<your_api_token>
   VITE_GA4_TRACKING_ID=<your_tracking_id>
   VITE_GA4_MEASUREMENT_ID=<your_measurement_id>
   VITE_FEEDBACK_URL=<your_feedback_url>
   ```
5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000/`
