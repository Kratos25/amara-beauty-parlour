import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Booking from "@/components/sections/Booking";
import Footer from "@/components/sections/Footer";
import BeforeAfter from "@/components/sections/BeforeAfter";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#FDFAF5" }}>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Gallery />
      <BeforeAfter />
      <Testimonials />
      <Booking />
      <Footer />
    </main>
  );
}