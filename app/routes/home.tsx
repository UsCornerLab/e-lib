import {
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import NewArrivals from "~/components/main/new-arrivals";
import NewsSection from "~/components/main/news-section";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative">
        <div className="container relative z-20 flex flex-col items-center justify-center h-[600px] text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/40 -z-10" />
          <img
            src="/landing.jpg"
            alt="Library interior with bookshelves and reading areas"
            className="w-full absolute inset-0 -z-20 h-[600px] object-cover"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            Discover, Learn, and Connect
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
            Your community hub for knowledge, resources, and events
          </p>
          <div className="w-full max-w-2xl relative">
            <Input
              type="search"
              placeholder="Search for books, authors, or topics..."
              className="w-full h-12 pl-12 pr-12 rounded-full bg-white/90 text-black"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" asChild>
              <Link to="/catalog">Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">52,254</span>
              <span className="text-sm md:text-base mt-2">Books Available</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">854</span>
              <span className="text-sm md:text-base mt-2">Active Members</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">452</span>
              <span className="text-sm md:text-base mt-2">
                Events This Year
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">120</span>
              <span className="text-sm md:text-base mt-2">
                Digital Resources
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-muted/50 px-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Book Borrowing</h3>
              <p className="text-muted-foreground mb-4">
                Access our extensive collection of books, audiobooks, and
                e-books with your library card.
              </p>
              <Button variant="link" className="p-0" asChild>
                <Link to="/services/borrowing">Learn More</Link>
              </Button>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">American Corner</h3>
              <p className="text-muted-foreground mb-4">
                Join our Community clubs, workshops, and educational programs
                for all ages.
              </p>
              <Button variant="link" className="p-0" asChild>
                <Link to="/services/programs">Learn More</Link>
              </Button>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <Calendar className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Study Spaces</h3>
              <p className="text-muted-foreground mb-4">
                Reserve quiet study rooms, meeting spaces, and computer
                workstations.
              </p>
              <Button variant="link" className="p-0" asChild>
                <Link to="/services/spaces">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section id="catalog" className="py-16 px-12">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Button variant="outline" asChild>
              <Link to="/catalog">View All Books</Link>
            </Button>
          </div>
          <NewArrivals />
        </div>
      </section>

      {/* News & Blog Section */}
      <section className="py-16 bg-muted/50 px-12">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Library News</h2>
            <Button variant="outline" asChild>
              <Link to="/news">View All News</Link>
            </Button>
          </div>
          <NewsSection />
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section
        id="contact"
        className="py-16 bg-primary text-primary-foreground px-12"
      >
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p>Shell, Dire Dawa, Ethiopia</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Hours</h3>
                    <p>Monday - Saturday: 8:00am - 8:00pm</p>
                    <p>Sunday: 8:00am - 12:00pm</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p>info@publiclibrary.org</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Find Us</h2>
              <div className="bg-white rounded-lg overflow-hidden h-[300px] relative">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.1384868411255!2d41.8543699731514!3d9.58332898006956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x163101976d7e6645%3A0xb007bc6932424009!2zRGlyZSBEYXdhIE1haW4gUHVibGljIExpYnJhcnkg4Yuo4YiF4Yud4YmlIOGJpOGJsCDhiJjhjL3hiJDhjY3hibU!5e0!3m2!1sen!2set!4v1747851278959!5m2!1sen!2set"
                  width="600"
                  height="450"
                  // style="border:0"
                  // allowfullscreen=""
                  loading="lazy"
                  // referrerpolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
