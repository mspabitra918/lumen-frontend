import type { Metadata } from "next";
import StatusPage from "../status/page";

// Link target in the backend's status emails: /track-loan?applicationId=…&email=…
export const metadata: Metadata = {
  title: "Track your loan — Lumen",
  description: "Check the status of your Lumen loan application.",
};

export default StatusPage;
