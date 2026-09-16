function BasicPageContent({ type }: { type: string }) {
  return type === "custom-tours" ? (
    <CustomTourBuilder />
  ) : (
    <BasicPageRenderer type={type} />
  );
}
function NfcCardLoader() {
  return (
    <div className="card-loading-overlay" aria-live="polite">
      <div className="nfc-loader-scene" aria-label="Loading business card">
        <div className="nfc-loader-phone">
          <div className="iphone-speaker" />
          <div className="iphone-screen-glow" />
          <div className="iphone-wallet-pass">
            <span className="iphone-wallet-logo" />
            <strong>BOLA</strong>
            <small>Express Card</small>
          </div>
          <div className="nfc-loader-card">
            <span className="apple-card-mark" />
            <strong>BOLA</strong>
            <small>Tap card</small>
          </div>
          <div className="nfc-loader-chip" />
          <div className="nfc-loader-wave one" />
          <div className="nfc-loader-wave two" />
          <div className="nfc-loader-wave three" />
        </div>
        <span className="nfc-loader-caption">Hold near iPhone</span>
      </div>
    </div>
  );
}
function CustomTourBuilder() {
  const stops = districtCities;
  const [bookingView, setBookingView] = useState<"map" | "form" | "smart">(
    location.hash === "#form" ? "form" : location.hash === "#ai" ? "smart" : "map",
  );
  const [cardLoading, setCardLoading] = useState(false);
  const [cardPreviewOpen, setCardPreviewOpen] = useState(false);
  const [revealId, setRevealId] = useState(0);
  const [selected, setSelected] = useState<string[]>([
    "Colombo",
    "Kandy",
    "Ella",
    "Galle",
  ]);
  const [date, setDate] = useState("");
  const [days, setDays] = useState(8);
  const [style, setStyle] = useState("Comfort");
  const [travellers, setTravellers] = useState(2);
  const toggle = (name: string) =>
    setSelected((items) =>
      items.includes(name)
        ? items.filter((item) => item !== name)
        : [...items, name],
    );
  const chosen = stops.filter((stop) => selected.includes(stop.name));
  const message = `Hello Bola Tours, I would like to request a custom Sri Lanka tour. Route: ${selected.join(" → ")}. Travel date: ${date || "to be confirmed"}. Duration: ${days} days. Style: ${style}. Travellers: ${travellers}.`;
  const openCardPreview = () => {
    setRevealId((value) => value + 1);
    setCardLoading(true);
    setCardPreviewOpen(false);
    window.setTimeout(() => {
      setCardLoading(false);
      setCardPreviewOpen(true);
    }, 1850);
  };
  return (
    <>
      <PageHero
        eyebrow="Build your own island"
        title="Your Sri Lanka, drawn your way."
        copy="Start with the places that pull you in. We’ll connect the dots into a beautiful, realistic route."
        image="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=75"
      />
      <div className="custom-booking-tabs container-fluid">
        <button className="view-card-tab-btn" onClick={openCardPreview}>
          <Sparkles size={16} /> View Card
        </button>
        <button
          className={bookingView === "map" ? "active" : ""}
          onClick={() => setBookingView("map")}
        >
          <Map size={16} /> Map planner
        </button>
        <button
          className={bookingView === "smart" ? "active" : ""}
          onClick={() => setBookingView("smart")}
        >
          <Sparkles size={16} /> AI planner
        </button>
        <button
          className={bookingView === "form" ? "active" : ""}
          onClick={() => setBookingView("form")}
        >
          <CalendarDays size={16} /> Booking form
        </button>
      </div>
      {cardLoading && <NfcCardLoader />}
      {cardPreviewOpen && (
        <BusinessCardPreview
          open={cardPreviewOpen}
          onClose={() => setCardPreviewOpen(false)}
          revealId={revealId}
        />
      )}
      {bookingView === "form" ? (
        <CustomTourForm stops={stops} onMap={() => setBookingView("map")} />
      ) : bookingView === "smart" ? (
        <RuleTripPlanner stops={stops} />
      ) : (
      <main className="custom-builder">
        <div className="custom-map-panel">
          <div className="map-toolbar">
            <div>
              <span className="eyebrow">01 · Choose your route</span>
              <h2>
                Tap the places
                <br />
                <i>you want to feel.</i>
              </h2>
            </div>
            <span className="map-count">{selected.length} stops selected</span>
          </div>
          <SriLankaMap stops={stops} selected={selected} onToggle={toggle} />
          <div className="map-legend">
            <span>
              <i className="dot selected-dot" />
              Selected stop
            </span>
            <span>
              <i className="dot" />
              Tap to add
            </span>
            <span>Pan, zoom and choose your stops</span>
          </div>
        </div>
        <aside className="custom-summary">
          <div className="summary-heading">
            <span className="eyebrow">02 · Shape the feeling</span>
            <h3>Your island route</h3>
            <p>We’ll refine the order and travel time with you.</p>
          </div>
          <div className="route-list">
            {chosen.length ? (
              chosen.map((stop, index) => (
                <div className="route-stop" key={stop.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{stop.name}</strong>
                    <small>
                      {stop.tag} · suggested {stop.days}{" "}
                      {stop.days === 1 ? "day" : "days"}
                    </small>
                  </div>
                  <button
                    onClick={() => toggle(stop.name)}
                    aria-label={`Remove ${stop.name}`}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-route">
                Choose at least two places from the map to start your route.
              </p>
            )}
          </div>
          <PopupCalendar
            className="custom-label"
            label="Travel date"
            value={date}
            onChange={setDate}
          />
          <label className="custom-label">
            Days <strong>{days}</strong>
            <input
              type="range"
              min="3"
              max="14"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            />
            <span className="range-labels">
              <small>3 days</small>
              <small>14 days</small>
            </span>
          </label>
          <div className="custom-field">
            <span>Travel style</span>
            <div className="style-options">
              {["Budget", "Comfort", "Luxury", "Adventure"].map((option) => (
                <button
                  className={style === option ? "active" : ""}
                  key={option}
                  onClick={() => setStyle(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="custom-field traveller-field">
            <span>Travellers</span>
            <div className="traveller-step">
              <button
                onClick={() => setTravellers(Math.max(1, travellers - 1))}
              >
                −
              </button>
              <strong>{travellers}</strong>
              <button onClick={() => setTravellers(travellers + 1)}>+</button>
            </div>
          </div>
          <div className="custom-total">
            <span>All tours</span>
            <strong>{STARTING_PRICE}</strong>
            <small>Final quote confirmed by our team</small>
          </div>
          <button
            className="solid-btn wide"
            disabled={selected.length < 2}
            onClick={() => whatsapp(message)}
          >
            Request this trip <ArrowRight size={16} />
          </button>
          <button className="custom-reset" onClick={() => setSelected([])}>
            Clear route
          </button>
        </aside>
      </main>
      )}
      <section className="custom-trust">
        <div>
          <Check size={19} />
          <strong>Locally routed</strong>
          <span>We balance dream stops with real roads.</span>
        </div>
        <div>
          <Check size={19} />
          <strong>Nothing locked in</strong>
          <span>Change your route before confirmation.</span>
        </div>
        <div>
          <Check size={19} />
          <strong>Human advice</strong>
          <span>A Bola host reviews every request.</span>
        </div>
      </section>
    </>
  );
}

function RuleTripPlanner({ stops }: { stops: MapStop[] }) {
  const [days, setDays] = useState(5);
  const [start, setStart] = useState("Colombo");
  const [style, setStyle] = useState("Comfort");
  const [interest, setInterest] = useState("Beach + nature");

  const suggested = useMemo(() => {
    const profiles: Record<string, string[]> = {
      "Beach + nature": ["Colombo", "Bentota", "Galle", "Mirissa", "Ella", "Yala"],
      "Culture + history": ["Colombo", "Kandy", "Dambulla", "Sigiriya", "Anuradhapura", "Polonnaruwa"],
      "Wildlife + safari": ["Colombo", "Udawalawe", "Yala", "Ella", "Horton Plains", "Galle"],
      "Hill country": ["Colombo", "Kandy", "Nuwara Eliya", "Horton Plains", "Ella", "Ratnapura"],
      "Surf + coast": ["Colombo", "Hikkaduwa", "Galle", "Mirissa", "Arugam Bay", "Pasikuda"],
      "Family easy route": ["Colombo", "Negombo", "Kandy", "Nuwara Eliya", "Bentota", "Galle"],
    };
    const route = [start, ...(profiles[interest] || profiles["Beach + nature"]).filter((place) => place !== start)];
    const maxStops = Math.min(Math.max(3, Math.ceil(days / 2) + 2), 6);
    return route
      .slice(0, maxStops)
      .map((name, index) => {
        const stop = stops.find((item) => item.name === name) || stops[index % stops.length];
        const suggestedDays = index === 0 ? 1 : Math.max(1, Math.min(2, Math.round(days / maxStops)));
        return { ...stop, suggestedDays };
      });
  }, [days, interest, start, stops]);

  const routeText = suggested.map((stop) => stop.name).join(" → ");
  const message = `Hello Bola Tours, I used the built-in trip planner. Route: ${routeText}. Duration: ${days} days. Style: ${style}. Interest: ${interest}. Please help me book this trip.`;

  return (
    <main className="smart-planner-section container-fluid">
      <section className="smart-planner-panel">
        <div className="smart-planner-copy">
          <span className="eyebrow">Free built-in planner</span>
          <h2>Tell us the feeling. We’ll draft the route.</h2>
          <p>
            This planner uses Bola Tours route rules, not a paid AI API. It is fast,
            private and tuned for Sri Lanka travel.
          </p>
        </div>
        <div className="smart-planner-controls">
          <label>
            Days
            <input
              type="range"
              min="3"
              max="14"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            />
            <strong>{days} days</strong>
          </label>
          <label>
            Start from
            <select value={start} onChange={(event) => setStart(event.target.value)}>
              {["Colombo", "Negombo", "Galle", "Kandy", "Ella"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Trip interest
            <select value={interest} onChange={(event) => setInterest(event.target.value)}>
              {["Beach + nature", "Culture + history", "Wildlife + safari", "Hill country", "Surf + coast", "Family easy route"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Travel style
            <select value={style} onChange={(event) => setStyle(event.target.value)}>
              {["Budget", "Comfort", "Luxury", "Adventure"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section className="smart-route-panel">
        <div className="smart-route-head">
          <span className="eyebrow">Suggested route</span>
          <strong>{STARTING_PRICE}</strong>
        </div>
        <div className="smart-route-list">
          {suggested.map((stop, index) => (
            <div className="smart-route-stop" key={`${stop.name}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{stop.name}</strong>
                <small>{stop.tag} · {stop.district || "Sri Lanka"} · {stop.suggestedDays} {stop.suggestedDays === 1 ? "day" : "days"}</small>
              </div>
            </div>
          ))}
        </div>
        <button className="solid-btn wide" onClick={() => whatsapp(message)}>
          Send this route to WhatsApp <ArrowRight size={16} />
        </button>
      </section>
    </main>
  );
}
function CustomTourForm({ stops, onMap }: { stops: MapStop[]; onMap: () => void }) {
  const locations = stops.map((stop) => stop.name);
  const [from, setFrom] = useState("Colombo");
  const [to, setTo] = useState("Yala");
  const [days, setDays] = useState("5 days");
  const [tourType, setTourType] = useState("Wildlife");
  const [travellers, setTravellers] = useState("2 travellers");
  const [style, setStyle] = useState("Comfort");
  const [pickup, setPickup] = useState("Hotel pickup");
  const [date, setDate] = useState("");
  const message = `Hello Bola Tours, I would like to book a custom tour by form. From: ${from}. Main destination: ${to}. Travel date: ${date || "to be confirmed"}. Duration: ${days}. Tour type: ${tourType}. Travellers: ${travellers}. Style: ${style}. Pickup: ${pickup}.`;

  return (
    <main className="custom-form-section container-fluid">
      <form
        className="custom-booking-form row g-3"
        onSubmit={(event) => {
          event.preventDefault();
          whatsapp(message);
        }}
      >
        <div className="col-12">
          <span className="eyebrow">Quick custom booking</span>
          <h2>Plan it with dropdowns.</h2>
          <p>
            Choose the basics and send the request. We’ll confirm the route with
            you.
          </p>
        </div>
        <PopupCalendar
          className="col-md-6"
          label="Travel date"
          value={date}
          onChange={setDate}
        />
        <label className="col-md-6">
          Start location
          <select value={from} onChange={(event) => setFrom(event.target.value)}>
            {locations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
        </label>
        <label className="col-md-6">
          Main destination
          <select value={to} onChange={(event) => setTo(event.target.value)}>
            {locations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
        </label>
        <label className="col-md-4">
          Days
          <select value={days} onChange={(event) => setDays(event.target.value)}>
            {["1 day", "2 days", "3 days", "5 days", "7 days", "10 days", "14 days"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="col-md-4">
          Tour type
          <select value={tourType} onChange={(event) => setTourType(event.target.value)}>
            {["Wildlife", "Cultural", "Beach", "Adventure", "Honeymoon", "Family", "Private island tour"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="col-md-4">
          Travellers
          <select value={travellers} onChange={(event) => setTravellers(event.target.value)}>
            {["1 traveller", "2 travellers", "3 travellers", "4 travellers", "5+ travellers"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="col-md-6">
          Travel style
          <select value={style} onChange={(event) => setStyle(event.target.value)}>
            {["Budget", "Comfort", "Luxury", "Adventure"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="col-md-6">
          Pickup option
          <select value={pickup} onChange={(event) => setPickup(event.target.value)}>
            {["Hotel pickup", "Airport pickup", "Meet in Colombo", "Meet in Negombo", "I will confirm later"].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <div className="custom-form-price col-12">
          <span>{STARTING_PRICE}</span>
          <small>Final route and quote confirmed by our team.</small>
        </div>
        <div className="col-12 d-grid d-sm-flex gap-2">
          <button className="planner-rgb-btn" type="submit">
            Send booking form <ArrowRight size={16} />
          </button>
          <button className="outline-btn" type="button" onClick={onMap}>
            Open map planner
          </button>
        </div>
      </form>
    </main>
  );
}
function Seo({ path }: { path: string }) {
  useEffect(() => {
    const base = "https://bolatours.com";
    const slug = path.split("/")[2] || "";
    const tour = path.startsWith("/tours/")
      ? tours.find((item) => item.slug === slug)
      : undefined;
    const destination = path.startsWith("/destinations/")
    ? destinations.find((item) => item.slug === slug) || undefined
      : undefined;
    const defaults: Record<string, { title: string; description: string; keywords: string }> = {
      "/": {
        title: "Galle Tours & Mirissa Galle Bike Rental | Bola Tours Sri Lanka",
        description:
          "Book Galle tours, Mirissa beach trips and reliable bike rental from Galle, Mirissa, Hikkaduwa, Ella and Kalutara with Bola Tours Sri Lanka.",
        keywords:
          "Galle tours, Mirissa Galle bike rental, Galle bike rental, Mirissa bike rental, scooter rental Galle, Sri Lanka tours, Bola Tours",
      },
      "/tours": {
        title: "Galle Tours, Mirissa Tours & Sri Lanka Private Tours | Bola Tours",
        description:
          "Browse Galle tours, Mirissa beach tours, south coast trips, wildlife safaris and private Sri Lanka tour packages with Bola Tours.",
        keywords:
          "Galle tours, Mirissa tours, Sri Lanka private tours, south coast tours Sri Lanka, Galle Fort tour, Mirissa beach tour",
      },
      "/destinations": {
        title:
          "Galle, Mirissa & Sri Lanka Destinations | Bola Tours",
        description:
          "Plan your Sri Lanka trip with local insight into Galle, Mirissa, Ella, Sigiriya, Kandy, Yala and more.",
        keywords:
          "Galle travel guide, Mirissa travel guide, Sri Lanka destinations, Galle Fort, Mirissa beach, Ella Sri Lanka",
      },
      "/activities": {
        title: "Sri Lanka Activities & Excursions | Bola Tours",
        description:
          "Book Sri Lanka activities including Mirissa whale watching, Galle coast experiences, safaris, tea tours, hikes and cultural encounters.",
        keywords:
          "Mirissa whale watching, Galle activities, Sri Lanka activities, safari Sri Lanka, tea tour Sri Lanka",
      },
      "/bike-rental": {
        title: "Mirissa Galle Bike Rental | Scooter & Motorcycle Hire | Bola Tours",
        description:
          "Rent scooters and motorcycles in Galle, Mirissa, Hikkaduwa, Ella and Kalutara. Daily bike rental from $5 with helmets, local route support and WhatsApp booking.",
        keywords:
          "Mirissa Galle bike rental, Galle bike rental, Mirissa scooter rental, scooter rental Galle, motorcycle hire Galle, bike rental Sri Lanka, Hikkaduwa bike rental",
      },
      "/custom-tours": {
        title: "Custom Galle & Sri Lanka Tours | Build Your Trip | Bola Tours",
        description:
          "Create a custom Sri Lanka itinerary around Galle, Mirissa, Ella, Yala, Kandy and your preferred travel style.",
        keywords:
          "custom Sri Lanka tours, custom Galle tours, Mirissa itinerary, Sri Lanka trip planner, Bola Tours",
      },
      "/faq": {
        title: "Sri Lanka Travel FAQ | Bola Tours",
        description:
          "Answers about Sri Lanka tours, bike rental licences, shop locations, cancellations, helmets, custom itineraries and travel seasons.",
        keywords:
          "Sri Lanka tours FAQ, Galle bike rental FAQ, Mirissa bike rental, Sri Lanka travel questions",
      },
      "/offers": {
        title: "Sri Lanka Tour Offers & Travel Deals | Bola Tours",
        description:
          "Discover Bola Tours offers on Galle tours, Mirissa trips, Sri Lanka journeys, couple escapes and bike rental bundles.",
        keywords:
          "Galle tour offers, Mirissa tour deals, Sri Lanka tour offers, bike rental offers Sri Lanka",
      },
    };
    const info = tour
        ? {
            title: `${tour.title} | Sri Lanka Tour | Bola Tours`,
            description: `${tour.description} Book a thoughtful ${tour.duration} Sri Lanka tour with Bola Tours. ${STARTING_PRICE}.`,
            keywords: `${tour.title}, ${tour.location}, Galle tours, Mirissa tours, Sri Lanka tours, Bola Tours`,
          }
        : destination
          ? {
            title: `${destination.name} Sri Lanka Travel Guide & Tours | Bola Tours`,
            description: `Discover ${destination.name}: ${destination.description} Find local tours, things to do and the best time to visit.`,
            keywords: `${destination.name} tours, ${destination.name} travel guide, Galle tours, Mirissa tours, Sri Lanka destinations`,
          }
        : defaults[path] || defaults["/"];
    const canonical = `${base}${path === "/" ? "" : path}`;
    document.title = info.title;
    const set = (
      selector: string,
      attribute: "content" | "href",
      value: string,
    ) => {
      let element = document.querySelector(selector);
      if (!element && selector === 'meta[name="keywords"]') {
        element = document.createElement("meta");
        element.setAttribute("name", "keywords");
        document.head.appendChild(element);
      }
      if (element) element.setAttribute(attribute, value);
    };
    set('meta[name="description"]', "content", info.description);
    set('meta[name="keywords"]', "content", info.keywords);
    set('meta[property="og:title"]', "content", info.title);
    set('meta[property="og:description"]', "content", info.description);
    set('meta[property="og:url"]', "content", canonical);
    set('meta[name="twitter:title"]', "content", info.title);
    set('meta[name="twitter:description"]', "content", info.description);
    set('link[rel="canonical"]', "href", canonical);
    const graph: any[] = [
      {
        "@type": "TravelAgency",
        "@id": `${base}/#organization`,
        name: "Bola Tours",
        url: base,
        logo: `${base}/bola-tours-logo.jpeg`,
        description:
          "Galle tours, Mirissa trips, Sri Lanka private excursions and scooter or motorcycle bike rentals.",
        telephone: "+94 740094273",
        email: BUSINESS_EMAILS[0],
        areaServed: ["Sri Lanka", "Galle", "Mirissa", "Hikkaduwa", "Ella", "Kalutara"],
        knowsAbout: [
          "Galle tours",
          "Mirissa Galle bike rental",
          "Galle bike rental",
          "Mirissa scooter rental",
          "Sri Lanka private tours",
          "South coast Sri Lanka tours",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Galle, Kalutara, Ella and Hikkaduwa",
          addressCountry: "LK",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Bola Tours",
        publisher: { "@id": `${base}/#organization` },
      },
      {
        "@type": "Service",
        "@id": `${base}/bike-rental#service`,
        name: "Mirissa Galle Bike Rental",
        serviceType: "Scooter and motorcycle rental",
        provider: { "@id": `${base}/#organization` },
        areaServed: ["Galle", "Mirissa", "Hikkaduwa", "Ella", "Kalutara"],
        description:
          "Daily scooter and motorcycle rental for Galle, Mirissa, Hikkaduwa, Ella and Kalutara with WhatsApp booking and local support.",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: 5,
          highPrice: 10,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${base}/bike-rental`,
        },
      },
      {
        "@type": "Service",
        "@id": `${base}/tours#galle-service`,
        name: "Galle Tours",
        serviceType: "Private tours and day trips",
        provider: { "@id": `${base}/#organization` },
        areaServed: ["Galle", "Mirissa", "South Coast Sri Lanka"],
        description:
          "Private Galle tours, Galle Fort trips, Mirissa beach tours and Sri Lanka south coast travel experiences.",
        url: `${base}/tours`,
      },
    ];
    if (tour)
      graph.push({
        "@type": "TouristTrip",
        name: tour.title,
        description: tour.description,
        image: tour.image,
        touristType: ["Adventure", "Culture", "Nature"],
        offers: {
          "@type": "Offer",
          price: 1,
          priceCurrency: "USD",
          url: canonical,
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tour.rating,
          bestRating: 5,
          ratingCount: tour.reviews,
        },
      });
    if (path === "/faq")
      graph.push({
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        ...path
          .split("/")
          .filter(Boolean)
          .map((part, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name: part
              .replaceAll("-", " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
            item: `${base}/${path
              .split("/")
              .filter(Boolean)
              .slice(0, index + 1)
              .join("/")}`,
          })),
      ],
    });
    let script = document.getElementById("bola-seo-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "bola-seo-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [path]);
  return null;
}
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight,
  Bike,
  Camera,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  CreditCard,
  Gift,
  Heart,
  Languages,
  Lock,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Moon,
  Motorbike,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  X,
} from "lucide-react";
import {
  activities,
  bikes,
  destinations,
  faqs,
  reviews,
  tours,
  type Tour,
} from "./data";

const businessCardImage = "/bolacard-preview.jpeg";

type MapStop = { name: string; tag: string; lat: number; lng: number; days: number; district?: string };
type DestinationItem = (typeof destinations)[number];
const LazySriLankaMap = lazy(() => import("./SriLankaMap"));

function MapPlaceholder() {
  return (
    <div className="map-placeholder" aria-label="Loading map">
      <span />
      <strong>Loading map</strong>
    </div>
  );
}

function SriLankaMap(props: {
  stops: MapStop[];
  selected: string[];
  onToggle: (name: string) => void;
}) {
  return (
    <Suspense fallback={<MapPlaceholder />}>
      <LazySriLankaMap {...props} />
    </Suspense>
  );
}

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (value: string) => {
  if (!value) return "Choose date";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function PopupCalendar({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const todayValue = toDateValue(new Date());
  const selectedDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const monthDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: firstDay + daysInMonth }, (_, index) =>
      index < firstDay ? null : new Date(year, month, index - firstDay + 1),
    );
  }, [viewDate]);

  const moveMonth = (amount: number) =>
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );

  return (
    <label className={`popup-calendar ${className}`}>
      {label}
      <button
        type="button"
        className={`calendar-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen((visible) => !visible)}
      >
        <CalendarDays size={16} />
        <span>{displayDate(value)}</span>
      </button>
      {open ? (
        <div className="calendar-popover">
          <div className="calendar-head">
            <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={15} />
            </button>
            <strong>
              {viewDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </strong>
            <button type="button" onClick={() => moveMonth(1)} aria-label="Next month">
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="calendar-grid">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
            {monthDays.map((day, index) => {
              const dayValue = day ? toDateValue(day) : "";
              const disabled = Boolean(day && dayValue < todayValue);
              return day ? (
                <button
                  type="button"
                  key={dayValue}
                  className={dayValue === value ? "selected" : ""}
                  disabled={disabled}
                  onClick={() => {
                    onChange(dayValue);
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              ) : (
                <i key={`empty-${index}`} />
              );
            })}
          </div>
        </div>
      ) : null}
    </label>
  );
}

const districtCities: MapStop[] = [
  { name: "Colombo", tag: "Western capital", district: "Colombo", lat: 6.9271, lng: 79.8612, days: 1 },
  { name: "Sri Jayawardenepura Kotte", tag: "Parliament city", district: "Colombo", lat: 6.8941, lng: 79.9025, days: 1 },
  { name: "Gampaha", tag: "Garden province", district: "Gampaha", lat: 7.0917, lng: 80.0000, days: 1 },
  { name: "Kalutara", tag: "River and coast", district: "Kalutara", lat: 6.5854, lng: 79.9607, days: 1 },
  { name: "Kandy", tag: "Living culture", district: "Kandy", lat: 7.2906, lng: 80.6337, days: 1 },
  { name: "Matale", tag: "Spice country", district: "Matale", lat: 7.4675, lng: 80.6234, days: 1 },
  { name: "Nuwara Eliya", tag: "Tea country", district: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, days: 2 },
  { name: "Galle", tag: "Southern soul", district: "Galle", lat: 6.0329, lng: 80.2168, days: 1 },
  { name: "Matara", tag: "Southern shore", district: "Matara", lat: 5.9485, lng: 80.5353, days: 1 },
  { name: "Hambantota", tag: "Salt and safari", district: "Hambantota", lat: 6.1241, lng: 81.1185, days: 1 },
  { name: "Jaffna", tag: "Northern heritage", district: "Jaffna", lat: 9.6615, lng: 80.0255, days: 2 },
  { name: "Kilinochchi", tag: "Northern plains", district: "Kilinochchi", lat: 9.3803, lng: 80.3770, days: 1 },
  { name: "Mannar", tag: "Island frontier", district: "Mannar", lat: 8.9810, lng: 79.9044, days: 1 },
  { name: "Mullaitivu", tag: "Quiet coast", district: "Mullaitivu", lat: 9.2671, lng: 80.8128, days: 1 },
  { name: "Vavuniya", tag: "Northern gateway", district: "Vavuniya", lat: 8.7514, lng: 80.4971, days: 1 },
  { name: "Batticaloa", tag: "Lagoon country", district: "Batticaloa", lat: 7.7310, lng: 81.6747, days: 1 },
  { name: "Ampara", tag: "East coast trails", district: "Ampara", lat: 7.2916, lng: 81.6720, days: 1 },
  { name: "Trincomalee", tag: "Blue bay", district: "Trincomalee", lat: 8.5874, lng: 81.2152, days: 2 },
  { name: "Kurunegala", tag: "Coconut country", district: "Kurunegala", lat: 7.4863, lng: 80.3623, days: 1 },
  { name: "Puttalam", tag: "Lagoon and dunes", district: "Puttalam", lat: 8.0362, lng: 79.8283, days: 1 },
  { name: "Anuradhapura", tag: "Ancient kingdom", district: "Anuradhapura", lat: 8.3114, lng: 80.4037, days: 2 },
  { name: "Polonnaruwa", tag: "Stone heritage", district: "Polonnaruwa", lat: 7.9403, lng: 81.0188, days: 1 },
  { name: "Badulla", tag: "Hill country life", district: "Badulla", lat: 6.9934, lng: 81.0550, days: 1 },
  { name: "Monaragala", tag: "Wild east", district: "Monaragala", lat: 6.8728, lng: 81.3507, days: 1 },
  { name: "Ratnapura", tag: "Gem country", district: "Ratnapura", lat: 6.6828, lng: 80.3992, days: 1 },
  { name: "Kegalle", tag: "Forest foothills", district: "Kegalle", lat: 7.2513, lng: 80.3464, days: 1 },
  { name: "Sigiriya", tag: "Ancient wonder", district: "Matale", lat: 7.9570, lng: 80.7603, days: 1 },
  { name: "Ella", tag: "Mountain air", district: "Badulla", lat: 6.8667, lng: 81.0466, days: 2 },
  { name: "Yala", tag: "Wild at heart", district: "Hambantota", lat: 6.3698, lng: 81.5185, days: 2 },
  { name: "Mirissa", tag: "Ocean days", district: "Matara", lat: 5.9483, lng: 80.4716, days: 1 },
  { name: "Negombo", tag: "Lagoon gateway", district: "Gampaha", lat: 7.2083, lng: 79.8358, days: 1 },
  { name: "Dambulla", tag: "Cave temples", district: "Matale", lat: 7.8731, lng: 80.7718, days: 1 },
  { name: "Hikkaduwa", tag: "Coral coast", district: "Galle", lat: 6.1395, lng: 80.1463, days: 1 },
  { name: "Bentota", tag: "River and beach", district: "Galle", lat: 6.4211, lng: 80.0030, days: 1 },
  { name: "Arugam Bay", tag: "Surf coast", district: "Ampara", lat: 6.8400, lng: 81.8360, days: 2 },
  { name: "Pasikuda", tag: "East coast blue", district: "Batticaloa", lat: 7.9220, lng: 81.5660, days: 2 },
  { name: "Kalpitiya", tag: "Dolphin coast", district: "Puttalam", lat: 8.2370, lng: 79.7670, days: 2 },
  { name: "Udawalawe", tag: "Elephant country", district: "Ratnapura", lat: 6.4750, lng: 80.8880, days: 1 },
  { name: "Horton Plains", tag: "Cloud forest", district: "Nuwara Eliya", lat: 6.8020, lng: 80.8080, days: 1 },
];

const WA = "94740094273";
const BIKE_RENTAL_WA = "94740094273";
const STARTING_PRICE = "Starting from $1 / 300 LKR";
const formatUsd = (value: number) => `$${value}`;
const BUSINESS_EMAILS = [
  "ramzan@bolatours.com",
  "bookings@bolatours.com",
  "hello@bolatours.com",
  "younus@bolatours.com",
];
const imgFallback =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=75";
function go(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
function whatsapp(message: string, phone = WA) {
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank",
  );
}

function destinationMessage(destination: DestinationItem) {
  return `Hello Bola Tours, I would like to plan a trip to ${destination.name}. Best time: ${destination.best}. Attractions: ${destination.attractions}. Please send me details.`;
}

function DestinationContactModal({
  destination,
  onClose,
}: {
  destination: DestinationItem;
  onClose: () => void;
}) {
  const message = destinationMessage(destination);
  const subject = `Trip enquiry for ${destination.name}`;
  const emailHref = `mailto:tours@bolatours.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const phoneHref = `tel:+${WA}`;
  return (
    <div className="destination-contact-overlay" role="dialog" aria-modal="true" aria-label={`Contact Bola Tours for ${destination.name}`}>
      <div className="destination-contact-panel">
        <button className="destination-contact-close" onClick={onClose} aria-label="Close contact options">
          <X size={18} />
        </button>
        <span className="eyebrow">Plan this destination</span>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <div className="destination-contact-actions">
          <a href={emailHref} onClick={onClose}>
            <Mail size={18} />
            <span>Email</span>
          </a>
          <button onClick={() => { whatsapp(message); onClose(); }}>
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </button>
          <a href={phoneHref} onClick={onClose}>
            <Phone size={18} />
            <span>Phone call</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function DestinationContactCard({
  destination,
  className = "destination-card",
  meta,
}: {
  destination: DestinationItem;
  className?: string;
  meta: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={className}
        onClick={() => setOpen(true)}
      >
        <img src={destination.image} alt={destination.name} loading="lazy" decoding="async" />
        <div>
          <span>{destination.eyebrow}</span>
          <h3>{destination.name}</h3>
          <small>{meta}</small>
        </div>
      </button>
      {open && (
        <DestinationContactModal
          destination={destination}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const promoCountries = [
  { label: "Sri Lanka", code: "+94" },
  { label: "India", code: "+91" },
  { label: "United Kingdom", code: "+44" },
  { label: "United States", code: "+1" },
  { label: "Germany", code: "+49" },
  { label: "France", code: "+33" },
  { label: "Australia", code: "+61" },
  { label: "UAE", code: "+971" },
];

function GiftPromoPopup() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [step, setStep] = useState<"offer" | "phone" | "code">("offer");
  const [country, setCountry] = useState("+94");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("bola-gift-popup-seen") === "1") return;
    const timer = window.setTimeout(() => setVisible(true), 15000);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    sessionStorage.setItem("bola-gift-popup-seen", "1");
    setVisible(false);
  };

  const submitPhone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!phone.trim()) return;
    sessionStorage.setItem("bola-gift-popup-seen", "1");
    setStep("code");
  };

  if (!visible) return null;

  if (!expanded) {
    return (
      <div className="gift-teaser-wrap">
        <button
          className="gift-teaser"
          onClick={() => setExpanded(true)}
          aria-label="Open 5 percent discount gift"
        >
          <span className="gift-teaser-icon">
            <Gift size={20} />
          </span>
          <span>
            <strong>5% off</strong>
            <small>Tap to claim</small>
          </span>
        </button>
        <button className="gift-teaser-dismiss" onClick={close} aria-label="Dismiss gift">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="gift-popup" role="dialog" aria-modal="true" aria-label="Bola Tours gift discount">
      <div className="gift-popup-panel">
        <button className="gift-popup-close" onClick={close} aria-label="Close gift popup">
          <X size={16} />
        </button>
        <div className="gift-sheet-handle" />
        <div className="gift-icon">
          <Gift size={24} />
        </div>
        {step === "offer" && (
          <>
            <span className="eyebrow">Small gift</span>
            <h3>Take 5% off your first booking.</h3>
            <p>Claim your welcome code before you plan the route.</p>
            <div className="gift-benefits">
              <span>Private tours</span>
              <span>Bike rental</span>
              <span>Custom routes</span>
            </div>
            <button className="gift-claim-btn" onClick={() => setStep("phone")}>
              Claim 5% off <ArrowRight size={16} />
            </button>
          </>
        )}
        {step === "phone" && (
          <form onSubmit={submitPhone} className="gift-phone-form">
            <span className="eyebrow">Almost there</span>
            <h3>Enter your number.</h3>
            <p>Choose your country code and we’ll unlock the promo code.</p>
            <div className="gift-phone-row">
              <select value={country} onChange={(event) => setCountry(event.target.value)} aria-label="Country code">
                {promoCountries.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label} {item.code}
                  </option>
                ))}
              </select>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/[^\d\s-]/g, ""))}
                inputMode="tel"
                autoComplete="tel"
                placeholder="Phone number"
                required
              />
            </div>
            <small>{country} {phone || "your number"}</small>
            <button className="gift-claim-btn" type="submit">
              Show promo code <ArrowRight size={16} />
            </button>
          </form>
        )}
        {step === "code" && (
          <>
            <span className="eyebrow">Unlocked</span>
            <h3>Your 5% off code</h3>
            <button
              className="gift-code"
              onClick={() => navigator.clipboard?.writeText("bolanew990")}
              title="Click to copy"
            >
              bolanew990
            </button>
            <p>Use this code when you book with Bola Tours.</p>
            <button className="gift-claim-btn" onClick={close}>
              Done <Check size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <>
      <Seo path={location.pathname} />
      <button
        className="logo"
        onClick={() => go("/")}
        aria-label="Bola Tours home"
      >
        <img src="/bola-tours-logo-small.jpeg" alt="Bola Tours" decoding="async" />
      </button>
    </>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardPreviewOpen, setCardPreviewOpen] = useState(false);
  const [revealId, setRevealId] = useState(0);
  const [translateOpen, setTranslateOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("bola-theme");
    return saved
      ? saved === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    const f = () => setScrolled(scrollY > 24);
    addEventListener("scroll", f);
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("bola-theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => {
    if (!translateOpen || document.getElementById("google_translate_script")) return;
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };
    const script = document.createElement("script");
    script.id = "google_translate_script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, [translateOpen]);
  const openCardPreview = () => {
    setRevealId((value) => value + 1);
    setCardLoading(true);
    setCardPreviewOpen(false);
    setOpen(false);
    window.setTimeout(() => {
      setCardLoading(false);
      setCardPreviewOpen(true);
    }, 1850);
  };
  const links = [
    ["Tours", "/tours"],
    ["Destinations", "/destinations"],
    ["Activities", "/activities"],
    ["Bike rental", "/bike-rental"],
  ];
  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-wrap">
          <Logo />
          <nav className={open ? "open" : ""}>
            {links.map(([label, path]) => (
              <button
                key={path}
                className={path === "/bike-rental" ? "nav-bike-btn" : undefined}
                onClick={() => {
                  go(path);
                  setOpen(false);
                }}
              >
                {label}
              </button>
            ))}
            <button
              className="nav-card-btn"
              onClick={openCardPreview}
              title="View business card"
            >
              <Sparkles size={15} /> Card
            </button>
            <button
              className="nav-ai-btn"
              onClick={() => {
                go("/custom-tours#ai");
                setOpen(false);
              }}
              title="Open AI trip planner"
            >
              <Sparkles size={15} /> AI Planner
            </button>
            <button
              className="nav-translate-btn"
              onClick={() => setTranslateOpen((value) => !value)}
              title="Translate language"
            >
              <Languages size={15} /> Translate
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              className="nav-book"
              onClick={() => {
                go("/custom-tours");
                setOpen(false);
              }}
            >
              Book a journey <ArrowRight size={15} />
            </button>
          </nav>
          <div className="mobile-tools">
            <button
              className="mobile-card-btn"
              onClick={openCardPreview}
              aria-label="View business card"
            >
              <Sparkles size={17} />
            </button>
            <button
              className="mobile-ai-btn"
              onClick={() => go("/custom-tours#ai")}
              aria-label="Open AI trip planner"
            >
              <Sparkles size={17} />
            </button>
            <button
              className="mobile-translate-btn"
              onClick={() => setTranslateOpen((value) => !value)}
              aria-label="Translate language"
            >
              <Languages size={17} />
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="menu-btn"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {translateOpen && (
          <div className="translate-panel">
            <span>Translate this site</span>
            <div id="google_translate_element" />
          </div>
        )}
      </header>
      <div className="mobile-dynamic-island" aria-label="Quick actions">
        <button onClick={() => go("/tours")} aria-label="Open tours">
          <Compass size={14} />
        </button>
        <button onClick={() => setTranslateOpen((value) => !value)} aria-label="Translate language">
          <Languages size={14} />
        </button>
        <button onClick={() => go("/custom-tours#ai")} aria-label="Open AI trip planner">
          <Sparkles size={14} />
        </button>
        <button onClick={openCardPreview} aria-label="View business card">
          <CreditCard size={14} />
        </button>
        <button
          onClick={() => go("/bike-rental")}
          aria-label="Open bike rental"
        >
          <Motorbike size={14} />
        </button>
      </div>
      {cardLoading && <NfcCardLoader />}
      {cardPreviewOpen && (
        <BusinessCardPreview
          open={cardPreviewOpen}
          onClose={() => setCardPreviewOpen(false)}
          revealId={revealId}
        />
      )}
    </>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Logo />
          <p>Thoughtful journeys through the island we call home.</p>
          <div className="socials">
            <a aria-label="Instagram">
              <Camera size={18} />
            </a>
            <a aria-label="Email" href={`mailto:${BUSINESS_EMAILS[0]}`}>
              <Mail size={18} />
            </a>
            <a aria-label="Phone" href="tel:+94725553858">
              <Phone size={18} />
            </a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <button onClick={() => go("/tours")}>Sri Lanka tours</button>
          <button onClick={() => go("/destinations")}>Destinations</button>
          <button onClick={() => go("/activities")}>Local activities</button>
          <button onClick={() => go("/offers")}>Special offers</button>
        </div>
        <div>
          <h4>Travel with us</h4>
          <button onClick={() => go("/bike-rental")}>Bike rental</button>
          <button onClick={() => go("/custom-tours")}>Build your trip</button>
          <button onClick={() => go("/faq")}>Travel FAQ</button>
          <a
            href="https://www.instagram.com/art_guy25/"
            target="_blank"
            rel="noreferrer"
          >
            Draw your free art
          </a>
        </div>
        <div>
          <h4>Say hello</h4>
          <p>Bola Tours shops: Galle, Kalutara, Ella, Hikkaduwa</p>
          <a href="tel:+94725553858">+94 72 555 3858</a>
          <a href="tel:+94740094273">+94 74 009 4273</a>
          <a href="tel:+94758687510">+94 75 868 7510</a>
          <div className="footer-email-list">
            {BUSINESS_EMAILS.map((email) => (
              <a key={email} href={`mailto:${email}`}>
                {email}
              </a>
            ))}
          </div>
          <span>Open daily · 24 hrs</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Bola Tours. All rights reserved.</span>
        <span>Privacy · Terms · Cancellation</span>
        <a href="https://younusfowzer.com/" target="_blank" rel="noreferrer">
          Developed by Younus
        </a>
      </div>
    </footer>
  );
}
function WhatsAppButton({ label = "Chat with a local" }: { label?: string }) {
  return (
    <button
      className="wa-btn"
      onClick={() =>
        whatsapp("Hello Bola Tours, I would like to plan a Sri Lanka journey.")
      }
    >
      <MessageCircle size={16} />
      <span>{label}</span>
    </button>
  );
}
function SectionHead({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action && (
        <button className="text-link" onClick={() => go("/tours")}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {"★".repeat(Math.round(rating))}
      <small>{rating}</small>
    </span>
  );
}
function TourCard({
  tour,
  wish,
  onWish,
}: {
  tour: Tour;
  wish: boolean;
  onWish: () => void;
}) {
  return (
    <article className="tour-card">
      <div className="card-image">
        <img
          src={tour.image}
          alt={tour.title}
          loading="lazy"
          decoding="async"
          onError={(e) => (e.currentTarget.src = imgFallback)}
        />
        <span className="card-badge">{tour.badge || tour.category}</span>
        <button
          className={`heart ${wish ? "active" : ""}`}
          onClick={onWish}
          aria-label="Save tour"
        >
          <Heart size={18} fill={wish ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-body">
        <div className="card-kicker">
          <span>
            <MapPin size={13} />
            {tour.location.split(" · ")[0]}
          </span>
          <span>
            <Clock3 size={13} />
            {tour.duration}
          </span>
        </div>
        <h3>{tour.title}</h3>
        <p>{tour.description}</p>
        <div className="card-bottom">
          <span>
            <Stars rating={tour.rating} /> <em>({tour.reviews})</em>
          </span>
          <strong>{STARTING_PRICE}</strong>
        </div>
        <div className="card-actions">
          <button
            className="outline-btn"
            onClick={() => go(`/tours/${tour.slug}`)}
          >
            View tour
          </button>
          <button
            className="solid-btn"
            onClick={() => go(`/tours/${tour.slug}`)}
          >
            Book now
          </button>
        </div>
      </div>
    </article>
  );
}
function BusinessCardPreview({
  open,
  onClose,
  revealId,
}: {
  open: boolean;
  onClose: () => void;
  revealId: number;
}) {
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="card-preview-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        key={revealId}
        className="business-card-preview nfc-animate"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="nfc-rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="nfc-scan-sweep" aria-hidden="true" />

        <button
          className="card-preview-close"
          onClick={onClose}
          aria-label="Close card preview"
        >
          <X size={16} />
        </button>

        <div className="business-card-image-shell">
          <img src={businessCardImage} alt="Bola Tours business card" decoding="async" />
        </div>
      </div>
    </div>
  );
}

function CustomTourCard() {
  const [cardOpen, setCardOpen] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [revealId, setRevealId] = useState(0);

  const openCard = () => {
    setRevealId((value) => value + 1);
    setCardLoading(true);
    setCardOpen(false);
    window.setTimeout(() => {
      setCardLoading(false);
      setCardOpen(true);
    }, 1850);
  };

  return (
    <>
      <article className="tour-card custom-tour-card">
        <div className="custom-card-visual">
          <span>?</span>
          <strong>Custom</strong>
        </div>
        <div className="card-body">
          <div className="card-kicker">
            <span>
              <MapPin size={13} />
              All Sri Lanka
            </span>
            <span>
              <Clock3 size={13} />
              Flexible days
            </span>
          </div>
          <h3>Your Own Tour</h3>
          <p>
            Choose locations, days, tour type, travellers and style in the custom
            planner.
          </p>
          <div className="custom-card-fields" aria-label="Custom tour options">
            <span>All locations</span>
            <span>Days</span>
            <span>Tour types</span>
            <span>Travel style</span>
          </div>
          <div className="card-bottom">
            <span>
              <Stars rating={5} /> <em>(custom)</em>
            </span>
            <strong>{STARTING_PRICE}</strong>
          </div>
          <div className="card-actions">
            <button className="outline-btn view-card-btn" onClick={openCard}>
              View Card
            </button>
            <button className="outline-btn" onClick={() => go("/custom-tours")}>
              Map planner
            </button>
            <button className="solid-btn" onClick={() => go("/custom-tours")}>
              Book journey
            </button>
            <button
              className="solid-btn form-book-btn"
              onClick={() => go("/custom-tours#form")}
            >
              Book form
            </button>
          </div>
        </div>
      </article>

      {cardLoading && <NfcCardLoader />}
      <BusinessCardPreview
        open={cardOpen}
        onClose={() => setCardOpen(false)}
        revealId={revealId}
      />
    </>
  );
}
function SearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="search-panel">
      <div className="search-intro">
        <Compass size={22} />
        <div>
          <strong>Find your kind of island</strong>
          <span>Search our curated journeys</span>
        </div>
      </div>
      <div className="search-field">
        <Search size={18} />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onSearch?.(e.target.value);
          }}
          placeholder="Try “Ella”, “safari” or “beach”"
        />
        <button onClick={() => onSearch?.(q)}>Search</button>
      </div>
      <div className="quick-tags">
        <span>Popular:</span>
        {["Ella", "Sigiriya", "Yala safari", "Galle"].map((x) => (
          <button
            key={x}
            onClick={() => {
              setQ(x);
              onSearch?.(x);
            }}
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow light">
              Yala safari and Sri Lanka journeys
            </span>
            <h1>
              Feel Yala
              <br />
              <i>come alive.</i>
            </h1>
            <p>
              Wildlife mornings, local stories and the freedom to travel at
              your own rhythm across the island.
            </p>
            <div className="hero-actions">
              <button className="light-btn hero-tour-rgb-btn" onClick={() => go("/tours")}>
                Explore tours <ArrowRight size={17} />
              </button>
              <button className="ghost-btn" onClick={() => go("/bike-rental")}>
                <Bike size={17} /> Rent a bike
              </button>
              <button className="ghost-btn custom-tour-btn" onClick={() => go("/custom-tours")}>
                <Sparkles size={17} /> Custom tours
              </button>
            </div>
          </div>
          <div className="hero-note">
            <span>01 / 04</span>
            <strong>
              Yala wild plains
              <br />
              to the southern sea
            </strong>
            <span className="line" />
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <strong>
              500<span>+</span>
            </strong>
            <span>Happy travellers</span>
          </div>
          <div>
            <strong>
              50<span>+</span>
            </strong>
            <span>Local experiences</span>
          </div>
          <div>
            <strong>
              25<span>+</span>
            </strong>
            <span>Places to discover</span>
          </div>
          <div>
            <strong>
              24<span>/7</span>
            </strong>
            <span>Open 24 hrs</span>
          </div>
        </div>
      </section>
      <main>
        <HomeCustomMap />
        <Offers />
        <section className="section destinations-section">
          <SectionHead
            eyebrow="Choose your backdrop"
            title="Sri Lanka, in chapters"
            copy="From misty highlands to warm southern shores, every corner has a different rhythm."
            action="Explore destinations"
          />
          <div className="destination-grid">
            {destinations.slice(0, 4).map((d, i) => (
              <DestinationContactCard
                className={`destination-card d${i}`}
                key={d.slug}
                destination={d}
                meta={<>Contact for trip <ArrowRight size={14} /></>}
              />
            ))}
          </div>
        </section>
        <BikeTeaser />
        <section className="section activities-section">
          <SectionHead
            eyebrow="Make it yours"
            title="The island, up close"
            copy="Small moments are often the ones you take home."
            action="Browse activities"
          />
          <div className="activity-grid">
            {activities.map((a) => (
              <button
                className="activity-card"
                key={a.title}
                onClick={() => go("/activities")}
              >
                <img src={a.image} alt={a.title} loading="lazy" decoding="async" />
                <div>
                  <span>
                    {a.location} · {a.duration}
                  </span>
                  <h3>{a.title}</h3>
                  <strong>{STARTING_PRICE}</strong>
                </div>
              </button>
            ))}
          </div>
        </section>
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
    </>
  );
}
function Offers() {
  return (
    <section className="offers-band">
      <div className="offers-inner">
        <div>
          <span className="eyebrow">A little extra</span>
          <h2>
            More island,
            <br />
            <i>less spend.</i>
          </h2>
          <p>
            Make the most of the season with thoughtfully paired experiences.
          </p>
          <button className="light-btn" onClick={() => go("/offers")}>
            See all offers <ArrowRight size={16} />
          </button>
        </div>
        <div className="offer-stack">
          <div className="offer-card">
            <span className="offer-icon">15%</span>
            <div>
              <span>Early bird</span>
              <h3>Start planning, save 15%</h3>
              <p>For journeys booked 60 days ahead.</p>
            </div>
            <ArrowRight />
          </div>
          <div className="offer-card offset">
            <span className="offer-icon">♡</span>
            <div>
              <span>Couple escape</span>
              <h3>Two people, one beautiful island</h3>
              <p>Save 10% on private journeys.</p>
            </div>
            <ArrowRight />
          </div>
        </div>
      </div>
    </section>
  );
}
function BikeTeaser() {
  return (
    <section className="bike-teaser">
      <div className="bike-content">
        <span className="eyebrow">Go your own way</span>
        <h2>
          One island.
          <br />
          <i>Endless roads.</i>
        </h2>
        <p>
          From Colombo traffic to Ella switchbacks, find the right two wheels
          for your story.
        </p>
        <button className="dark-btn" onClick={() => go("/bike-rental")}>
          Explore bike rental <ArrowRight size={16} />
        </button>
      </div>
      <div className="bike-image">
        <img src={bikes[0].image} alt="Honda adventure scooter" loading="lazy" decoding="async" />
      </div>
    </section>
  );
}
function HomeCustomMap() {
  const stops = districtCities;
  const [selected, setSelected] = useState(["Colombo", "Ella", "Galle", "Yala"]);
  const toggle = (name: string) =>
    setSelected((current) =>
      current.includes(name)
        ? current.filter((place) => place !== name)
        : [...current, name],
    );
  return (
    <section className="home-custom section container-fluid">
      <div className="home-custom-copy d-flex flex-column align-items-start">
        <span className="eyebrow">Your island, your way</span>
        <h2>Build a route<br /><i>worth taking.</i></h2>
        <p>Choose the places that pull you in. We’ll turn your shortlist into a smooth, beautifully paced Sri Lanka journey.</p>
        <div className="home-route-preview">
          <span>YOUR ROUTE</span>
          <strong>{selected.length ? selected.join("  →  ") : "Tap the map to begin"}</strong>
        </div>
        <button className="planner-rgb-btn" onClick={() => go("/custom-tours")}>Open the full planner <ArrowRight size={16} /></button>
      </div>
      <div className="home-map-wrap d-flex flex-column">
        <div className="home-map-heading d-flex align-items-center justify-content-between"><span>Tap to add a stop</span><strong>{selected.length} selected</strong></div>
        <SriLankaMap stops={stops} selected={selected} onToggle={toggle} />
        <div className="home-map-note d-flex align-items-center justify-content-between"><span><i className="dot selected-dot" />Your selected places</span><span>Full planning, local advice</span></div>
      </div>
    </section>
  );
}
function Builder() {
  const [days, setDays] = useState(7);
  const [style, setStyle] = useState("Comfort");
  const [done, setDone] = useState(false);
  return (
    <section className="builder section">
      <div className="builder-visual">
        <span className="eyebrow light">Your island, your pace</span>
        <h2>
          Build a trip
          <br />
          <i>that feels like you.</i>
        </h2>
        <p>Tell us what pulls you towards Sri Lanka. We’ll sketch the rest.</p>
        <div className="builder-path">
          <span>Colombo</span>
          <i />
          <span>Ella</span>
          <i />
          <span>Galle</span>
        </div>
      </div>
      <div className="builder-form">
        <div className="step">
          <span>01</span>
          <div>
            <label>How long have you got?</label>
            <div className="stepper">
              <button onClick={() => setDays(Math.max(3, days - 1))}>
                <Minus size={16} />
              </button>
              <strong>
                {days} <small>days</small>
              </strong>
              <button onClick={() => setDays(Math.min(14, days + 1))}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="step">
          <span>02</span>
          <div>
            <label>Travel style</label>
            <div className="pills">
              {["Budget", "Comfort", "Luxury", "Adventure"].map((x) => (
                <button
                  className={style === x ? "selected" : ""}
                  onClick={() => setStyle(x)}
                  key={x}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="solid-btn wide" onClick={() => setDone(true)}>
          {done ? "Your trip is ready" : "Create my itinerary"}{" "}
          <ArrowRight size={16} />
        </button>
        {done && (
          <div className="builder-result">
            <Check size={18} />{" "}
            <span>
              <strong>
                {days}-day {style.toLowerCase()} journey
              </strong>
              <small>
                {STARTING_PRICE} · We’ll tailor every detail.
              </small>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
function Reviews() {
  const [active, setActive] = useState(0);
  return (
    <section className="section reviews">
      <SectionHead
        eyebrow="Kind words"
        title="The best souvenirs are stories"
        copy="A few notes from people who let us show them around."
      />
      <div className="review-wrap">
        <div className="review-quote">“</div>
        <blockquote>{reviews[active].quote}</blockquote>
        <div className="review-person">
          <div className="avatar">{reviews[active].name[0]}</div>
          <div>
            <strong>{reviews[active].name}</strong>
            <span>
              {reviews[active].country} · {reviews[active].tour}
            </span>
          </div>
          <Stars rating={5} />
        </div>
        <div className="review-controls">
          <button
            onClick={() =>
              setActive((active + reviews.length - 1) % reviews.length)
            }
            aria-label="Previous review"
          >
            <ChevronLeft />
          </button>
          <span>
            0{active + 1} / 0{reviews.length}
          </span>
          <button
            onClick={() => setActive((active + 1) % reviews.length)}
            aria-label="Next review"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq">
      <SectionHead
        eyebrow="Good to know"
        title="Questions, answered."
        copy="The practical bits, made simple."
      />
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <div className={`faq-item ${open === i ? "open" : ""}`} key={q}>
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span>
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </button>
            {open === i && <p>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
function FinalCta() {
  return (
    <section className="final-cta">
      <img
        src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=75"
        alt="Palm lined Sri Lankan coast"
        loading="lazy"
        decoding="async"
      />
      <div>
        <span className="eyebrow light">The island is waiting</span>
        <h2>
          Come find your
          <br />
          <i>way here.</i>
        </h2>
        <WhatsAppButton label="Start a conversation" />
      </div>
    </section>
  );
}
function ToursPage({
  onWish,
  wishlist,
}: {
  onWish: (s: string) => void;
  wishlist: string[];
}) {
  const [destination, setDestination] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = tours.filter(
    (t) =>
      (destination === "All" || t.location.includes(destination)) &&
      (category === "All" || t.category === category) &&
      `${t.title} ${t.location}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHero
        eyebrow="The collection"
        title="Journeys with a point of view."
        copy="Private tours, wild encounters and slow days by the sea. Choose a starting point, then make it yours."
        image="https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1400&q=80"
        rotateImage="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1400&q=80"
        rotateAfter={10000}
      />
      <HomeCustomMap />
      <main className="catalog section">
        <div className="filter-bar">
          <div className="catalog-search">
            <Search size={17} />
            <input
              placeholder="Search tours"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option>All</option>
            {[
              "Ella",
              "Sigiriya",
              "Kandy",
              "Galle",
              "Yala",
              "Mirissa",
              "Nuwara Eliya",
              "Colombo",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All</option>
            {[
              "Cultural",
              "Nature",
              "Beach",
              "Wildlife",
              "Adventure",
              "Honeymoon",
              "Multi-Day Tours",
              "Private Tours",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="catalog-meta">
          <span>{filtered.length + 1} journeys to explore</span>
          <span>{STARTING_PRICE}</span>
        </div>
        <div className="tour-grid">
          <CustomTourCard />
          {filtered.map((t) => (
            <TourCard
              key={t.slug}
              tour={t}
              wish={wishlist.includes(t.slug)}
              onWish={() => onWish(t.slug)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
function PageHero({
  eyebrow,
  title,
  copy,
  image,
  rotateImage,
  rotateAfter = 10000,
  className = "",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  rotateImage?: string;
  rotateAfter?: number;
  className?: string;
}) {
  const [rotated, setRotated] = useState(false);
  useEffect(() => {
    setRotated(false);
    if (!rotateImage) return;
    const timer = window.setTimeout(() => setRotated(true), rotateAfter);
    return () => window.clearTimeout(timer);
  }, [image, rotateAfter, rotateImage]);
  const activeImage = rotated && rotateImage ? rotateImage : image;
  return (
    <section className={`page-hero ${className} ${rotateImage ? "rotating-hero" : ""}`}>
      <img key={activeImage} src={activeImage} alt="" loading="eager" decoding="async" />
      <div>
        <span className="eyebrow light">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}
function Detail({
  tour,
  onBook,
}: {
  tour: Tour;
  onBook: (summary: string) => void;
}) {
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  return (
    <>
      <section className="detail-hero">
        <img src={tour.image} alt={tour.title} loading="eager" decoding="async" />
        <div>
          <span className="eyebrow light">{tour.location}</span>
          <h1>{tour.title}</h1>
          <div className="detail-meta">
            <Stars rating={tour.rating} />
            <span>{tour.reviews} traveller reviews</span>
            <span>
              <Clock3 size={15} /> {tour.duration}
            </span>
          </div>
        </div>
      </section>
      <main className="detail-layout section">
        <article className="detail-copy">
          <span className="eyebrow">A day well spent</span>
          <h2>
            Let the island
            <br />
            surprise you.
          </h2>
          <p className="lead">
            {tour.description} With a local host beside you, there’s room for
            the unexpected: a roadside fruit stop, a village story, a view you
            won’t find on a postcard.
          </p>
          <h3>Highlights</h3>
          <div className="highlight-list">
            {tour.highlights.map((x) => (
              <span key={x}>
                <Check size={16} />
                {x}
              </span>
            ))}
          </div>
          <h3>Your day</h3>
          <p>
            We’ll collect you from your accommodation in the morning and shape
            the day around the best light, local rhythm and your interests. Your
            private vehicle, an English-speaking host and entrance coordination
            are included.
          </p>
          <h3>Good to know</h3>
          <p>
            Wear comfortable shoes, bring sun protection and leave a little
            space in the day for serendipity. Flexible cancellation is available
            up to 72 hours before departure.
          </p>
        </article>
        <aside className="booking-card">
          <span className="eyebrow">Booking request</span>
          <h3>Make it yours.</h3>
          <div className="price-line">
            <strong>{STARTING_PRICE}</strong>
            <span>final quote confirmed by our team</span>
          </div>
          <PopupCalendar label="Travel date" value={date} onChange={setDate} />
          <div className="guest-row">
            <label>
              Adults
              <div className="mini-step">
                <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                  −
                </button>
                <span>{adults}</span>
                <button onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </label>
            <label>
              Children
              <div className="mini-step">
                <button onClick={() => setChildren(Math.max(0, children - 1))}>
                  −
                </button>
                <span>{children}</span>
                <button onClick={() => setChildren(children + 1)}>+</button>
              </div>
            </label>
          </div>
          <label>
            Pickup location
            <input placeholder="Hotel or area" />
          </label>
          <div className="estimate">
            <span>All bookings</span>
            <strong>{STARTING_PRICE}</strong>
            <small>Final availability and payment confirmed by our team.</small>
          </div>
          <button
            className="solid-btn wide"
            onClick={() =>
              onBook(
                `Hello Bola Tours, I would like to enquire about the ${tour.title}. Travel date: ${date || "to be confirmed"}. Travellers: ${adults} adults, ${children} children.`,
              )
            }
          >
            Request booking <ArrowRight size={16} />
          </button>
          <button
            className="wa-link"
            onClick={() =>
              whatsapp(
                `Hello Bola Tours, I would like to enquire about the ${tour.title}. Travel date: ${date || "to be confirmed"}. Travellers: ${adults} adults, ${children} children.`,
              )
            }
          >
            Book via WhatsApp
          </button>
        </aside>
      </main>
      <section className="section related">
        <SectionHead eyebrow="Keep exploring" title="You may also like" />
        <div className="tour-grid">
          {tours
            .filter((x) => x.slug !== tour.slug)
            .slice(0, 3)
            .map((x) => (
              <TourCard key={x.slug} tour={x} wish={false} onWish={() => {}} />
            ))}
        </div>
      </section>
    </>
  );
}
function BikePage() {
  const [bike, setBike] = useState(bikes[0]);
  const [days, setDays] = useState(2);
  const [date, setDate] = useState("");
  const [helmet, setHelmet] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const total = bike.price * days;
  const discount = promoApplied ? total * 0.05 : 0;
  const finalTotal = total - discount;
  const money = (value: number) =>
    Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === "bolanew990") {
      setPromoApplied(true);
      setPromoError("");
      return;
    }
    setPromoApplied(false);
    setPromoError("Enter a valid promo code.");
  };
  return (
    <>
      <PageHero
        eyebrow="Mirissa Galle bike rental"
        title="Bike rental from Galle to Mirissa."
        copy="Reliable scooters and motorcycles from $5/day in Galle, Mirissa, Hikkaduwa, Ella and Kalutara, with helmets and local route support."
        image="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=75"
        className="bike-rental-hero"
      />
      <main className="section rental-layout bike-rental-page">
        <div>
          <SectionHead
            eyebrow="Galle scooter rental"
            title="Two wheels, your south coast pace."
            copy="Choose daily bike rental for Galle Fort, Mirissa beach runs, Hikkaduwa surf stops and flexible island rides."
          />
          <div className="bike-grid">
            {bikes.map((b) => {
              const locked = ["bajaj n160", "adv160"].includes(b.name.toLowerCase());
              return (
              <button
                className={`bike-card ${bike.name === b.name ? "selected" : ""} ${locked ? "locked" : ""}`}
                key={b.name}
                onClick={() => {
                  if (!locked) setBike(b);
                }}
                aria-pressed={bike.name === b.name}
                aria-disabled={locked}
              >
                <img src={b.image} alt={b.name} loading="lazy" decoding="async" />
                {locked && (
                  <div className="bike-lock-layer" aria-hidden="true">
                    <span>
                      <Lock size={19} />
                    </span>
                    <strong>Locked</strong>
                    <small>Coming soon</small>
                  </div>
                )}
                <div>
                  <span>
                    {b.type} · {b.cc}cc
                  </span>
                  <h3>{b.name}</h3>
                  <strong>
                    {formatUsd(b.price)} <small>/ day</small>
                  </strong>
                </div>
              </button>
              );
            })}
          </div>
          <div className="bike-mobile-summary" aria-live="polite">
            <span>Selected ride</span>
            <strong>{bike.name}</strong>
            <small>
              {bike.type} · {formatUsd(bike.price)} / day
            </small>
          </div>
        </div>
        <aside className="booking-card rental-calc">
          <span className="eyebrow">Rental calculator</span>
          <h3>Your ride, sorted.</h3>
          <PopupCalendar label="Rental date" value={date} onChange={setDate} />
          <label>
            Rental duration
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              {[1, 2, 3, 5, 7, 14, 30].map((d) => (
                <option value={d} key={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Custom days
            <input
              type="number"
              min="1"
              max="90"
              value={days}
              onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <label>
            Pickup location
            <input placeholder="Galle, Mirissa, Hikkaduwa, Ella or Kalutara" />
          </label>
          <div className="extras">
            <span>Extras</span>
            <label>
              <input
                type="checkbox"
                checked={helmet}
                onChange={(e) => setHelmet(e.target.checked)}
              />{" "}
              Helmet upgrade
            </label>
            <label>
              <input
                type="checkbox"
                checked={delivery}
                onChange={(e) => setDelivery(e.target.checked)}
              />{" "}
              Door delivery
            </label>
          </div>
          <div className={`bike-promo-box ${promoApplied ? "applied" : ""}`}>
            <div>
              <span>Promotion code</span>
              <strong>{promoApplied ? "5% off applied" : "Have a promo?"}</strong>
            </div>
            <div className="bike-promo-entry">
              <input
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoError("");
                  if (promoApplied) setPromoApplied(false);
                }}
                placeholder="Enter code"
                aria-label="Promotion code"
              />
              <button type="button" onClick={applyPromo}>
                Apply
              </button>
            </div>
            {promoApplied && (
              <small>Welcome discount applied.</small>
            )}
            {promoError && <small className="promo-error">{promoError}</small>}
          </div>
          <div className="estimate">
            <span>{days} {days === 1 ? "day" : "days"} rental</span>
            <strong>{money(finalTotal)}</strong>
            <small>
              {promoApplied
                ? `${money(total)} before discount · ${money(discount)} saved.`
                : `${formatUsd(bike.price)} per day · Availability confirmed by our team.`}
            </small>
          </div>
          <button
            className="solid-btn wide"
            onClick={() =>
              whatsapp(
                `Hello Bola Tours, I would like to enquire about renting a ${bike.name} for ${days} days. Rental date: ${date || "to be confirmed"}. Bike rental price: ${formatUsd(bike.price)} per day. ${promoApplied ? `Promo code bolanew990 applied for 5% off. ` : ""}Estimated total: ${money(finalTotal)}.`,
                BIKE_RENTAL_WA,
              )
            }
          >
            Request this bike <ArrowRight size={16} />
          </button>
        </aside>
      </main>
      <section className="section reassurance">
        <div>
          <ShieldCheck />
          <h3>Ready when you are</h3>
          <p>
            All rentals include quality helmets, a short handover and a local
            number for support.
          </p>
        </div>
        <div>
          <MapPin />
          <h3>Easy collection</h3>
          <p>
            Collect from Galle, Kalutara, Ella or Hikkaduwa, or add delivery to your
            accommodation.
          </p>
        </div>
        <div>
          <Sparkles />
          <h3>Ride with confidence</h3>
          <p>
            Simple booking, no surprise fees and practical route tips from people
            who know the roads.
          </p>
        </div>
      </section>
    </>
  );
}
function BasicPageRenderer({ type }: { type: string }) {
  const lockedOffers = [
    {
      title: "Christmas Island Tour",
      saving: "50% off",
      season: "Holiday special",
      copy: "Festive Sri Lanka routes with beaches, highlands and family-friendly pacing.",
    },
    {
      title: "New Year Escape",
      saving: "45% off",
      season: "Countdown deal",
      copy: "A bright start to the year across Galle, Ella, Kandy and the southern coast.",
    },
    {
      title: "Family Holiday Pack",
      saving: "35% off",
      season: "School break",
      copy: "Private vehicle, easier timing and soft adventure days for families.",
    },
    {
      title: "Couple Winter Getaway",
      saving: "40% off",
      season: "Romantic route",
      copy: "Boutique stays, sunset beaches and misty tea country moments.",
    },
  ];
  type PageContent = {
    eyebrow: string;
    title: string;
    copy: string;
    image: string;
  };
  const content: PageContent = {
    destinations: {
      eyebrow: "The island in chapters",
      title: "Where will you feel most at home?",
      copy: "Sri Lanka is small enough to cross in a day, but every turn changes the light, the food and the story.",
      image: destinations[2].image,
    },
    activities: {
      eyebrow: "Local, memorable, yours",
      title: "Do more than see it.",
      copy: "Swim at sunrise, learn to cook with a village family, or follow the tracks into the wild.",
      image: activities[0].image,
    },
    "custom-tours": {
      eyebrow: "Made around you",
      title: "A trip no one else can take.",
      copy: "Share the places, tastes and pace you are dreaming of. We’ll turn them into a considered island route.",
      image: destinations[0].image,
    },
    offers: {
      eyebrow: "Locked holiday offers",
      title: "Big seasonal deals are almost here.",
      copy: "Four limited Bola Tours promotions are being prepared for Christmas, New Year and holiday travellers.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=75",
    },
  }[type] || {
    eyebrow: "Bola Tours",
    title: "Discover Sri Lanka your way.",
    copy: "Thoughtful journeys, local stories and open roads.",
    image: destinations[1].image,
  };
  return (
    <>
      <PageHero {...content} />
      <main className="section basic-page">
        {type === "destinations" ? (
          <div className="destination-grid large">
            {destinations.map((d) => (
              <DestinationContactCard
                className="destination-card"
                key={d.slug}
                destination={d}
                meta={<>{d.best} <ArrowRight size={14} /></>}
              />
            ))}
          </div>
        ) : type === "activities" ? (
          <div className="activity-grid large">
            {activities.map((a) => (
              <button
                className="activity-card"
                key={a.title}
                onClick={() =>
                  whatsapp(
                    `Hello Bola Tours, I would like to book ${a.title} in ${a.location}. Please send me details.`,
                  )
                }
              >
                <img src={a.image} alt={a.title} loading="lazy" decoding="async" />
                <div>
                  <span>
                    {a.location} · {a.duration}
                  </span>
                  <h3>{a.title}</h3>
                  <strong>{STARTING_PRICE}</strong>
                </div>
              </button>
            ))}
          </div>
        ) : type === "offers" ? (
          <div className="locked-offers-grid">
            {lockedOffers.map((offer, index) => (
              <article className="locked-offer-card" key={offer.title}>
                <div className="locked-offer-top">
                  <span>{offer.season}</span>
                  <strong>{offer.saving}</strong>
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.copy}</p>
                <div className="locked-offer-lock" aria-hidden="true">
                  <span>
                    <Lock size={20} />
                  </span>
                  <small>{index === 0 ? "Unlocking soon" : "Locked offer"}</small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="story-grid">
            <div>
              <span className="eyebrow">
                The Bola way
              </span>
              <h2>
                  Tell us where you want to go.
              </h2>
              <p>
                We are a small, local team of hosts, drivers, riders and
                storytellers. We care about the timing of a train, the right
                place to stop for tea and the feeling of being looked after
                without being hurried.
              </p>
              <p>
                Send a note with your dates and ideas. We’ll reply with honest
                advice, a clear route and no pressure to decide before you are
                ready.
              </p>
              <button
                className="dark-btn"
                onClick={() =>
                  whatsapp("Hello Bola Tours, I would like to plan a Sri Lanka journey.")
                }
              >
                Start a conversation <ArrowRight size={16} />
              </button>
            </div>
            <div className="story-aside">
              <div>
                <strong>8+</strong>
                <span>
                  years making
                  <br />
                  island memories
                </span>
              </div>
              <div>
                <strong>1</strong>
                <span>
                  island we’re
                  <br />
                  proud to call home
                </span>
              </div>
              <div>
                <strong>∞</strong>
                <span>
                  ways to
                  <br />
                  experience it
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
function App() {
  const [path, setPath] = useState(location.pathname);
  const [wishlist, setWishlist] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("bola-wishlist") || "[]"),
  );
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const f = () => {
      setPath(location.pathname);
      scrollTo(0, 0);
    };
    addEventListener("popstate", f);
    return () => removeEventListener("popstate", f);
  }, []);
  useEffect(() => {
    if (path === "/contact" || path === "/about" || path === "/airport-transfers") {
      go("/custom-tours");
    }
  }, [path]);
  const onWish = (slug: string) =>
    setWishlist((x) => {
      const next = x.includes(slug)
        ? x.filter((i) => i !== slug)
        : [...x, slug];
      localStorage.setItem("bola-wishlist", JSON.stringify(next));
      return next;
    });
  const onBook = (summary: string) => {
    setNotice(
      "Your booking request is prepared. Choose WhatsApp to send it to Bola Tours.",
    );
    setTimeout(() => whatsapp(summary), 150);
  };
  let view: ReactNode;
  if (path === "/") view = <Home />;
  else if (path === "/tours")
    view = <ToursPage onWish={onWish} wishlist={wishlist} />;
  else if (path.startsWith("/tours/")) {
    const tour = tours.find((t) => t.slug === path.split("/")[2]) || tours[0];
    view = <Detail tour={tour} onBook={onBook} />;
  } else if (path === "/bike-rental") view = <BikePage />;
  else if (path === "/custom-tours") view = <CustomTourBuilder />;
  else if (path === "/contact" || path === "/about" || path === "/airport-transfers")
    view = <CustomTourBuilder />;
  else if (path === "/faq")
    view = (
      <>
        <PageHero
          eyebrow="Good to know"
          title="Questions, answered."
          copy="Everything you need for a smooth, joyful journey through Sri Lanka."
          image={destinations[5].image}
        />
        <main className="section">
          <Faq />
        </main>
      </>
    );
  else view = <BasicPageRenderer type={path.slice(1).split("/")[0]} />;
  return (
    <>
      <Header />
      {view}
      <Footer />
      <GiftPromoPopup />
      {notice && (
        <div className="toast">
          <Check size={17} />
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}
      <div className="mobile-cta">
        <WhatsAppButton label="Chat with us" />
      </div>
    </>
  );
}

export default App;
