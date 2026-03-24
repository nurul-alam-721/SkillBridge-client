import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}