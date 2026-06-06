import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "MindPilot AI",
  description: "Predictive student wellness MVP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
