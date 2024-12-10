
import { Metadata } from "next";
import Hero from '@/components/Hero'
export const metadata: Metadata = {
  title: "Inventory Management ",
  description: "Inventory Management of Rakhis Fashins",
  // other metadata
};

export default function Home() {
  return (
    <>


  <Hero/>
     </>
  );
}
