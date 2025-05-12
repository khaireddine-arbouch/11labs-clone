import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "11labs Clone - App",
  description: "11labs Clone App Section",
};

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {children}
    </div>
  );
} 