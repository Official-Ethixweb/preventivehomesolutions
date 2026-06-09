import TopBar from './components/TopBar.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import WhyChoose from './components/WhyChoose.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import Process from './components/Process.jsx'
import About from './components/About.jsx'
import Testimonials from './components/Testimonials.jsx'
import Areas from './components/Areas.jsx'
import Faq from './components/Faq.jsx'
import Blog from './components/Blog.jsx'
import ContactForm from './components/ContactForm.jsx'
import MapSection from './components/MapSection.jsx'
import Footer from './components/Footer.jsx'
import ScrollButton from './components/ScrollButton.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header />
      <Hero />
      <Services />
      <WhyChoose />
      {/* Shared fixed background image spanning the CtaBanner → Process → About sections */}
      <div className="relative bg-[url('/bcg.jpg')] bg-cover bg-fixed bg-center">
        <CtaBanner />
        <Process />
        <About />
      </div>
      <Testimonials />
      <Areas />
      <Faq />
      <Blog />
      <ContactForm />
      <MapSection />
      <Footer />
      <ScrollButton />
    </div>
  )
}
