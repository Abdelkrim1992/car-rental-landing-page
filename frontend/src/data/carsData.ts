// Car images - using public folder paths for Next.js
export const imgBugatti = "/images/b227dfaa10ab295e6582836281b6250997327b9a.png";
export const imgLambo = "/images/3bd3087fb3001d5362d5167baf4c8d6a0e29cb43.png";
export const imgPorsche918 = "/images/78a4b89df20fa1fbe30c4c405ba2e9d60efb6c99.png";
export const imgPorscheTaycan = "/images/adebee23f7896499677e9a0c415c382a8aa85bd6.png";
export const imgMustang = "/images/ee2f058676f5786a3c01fc324cd6782da010b3bc.png";
export const imgFerrari = "/images/53806ca99b42af7169e4f4b4b1876e05cffb1b80.png";
export const imgMcLaren = "/images/d086cf4b073656fbb28e410396d39c24e8a709d9.png";
export const imgRacing = "/images/decf7d8db1b3d907191b547179400875be2a762f.png";
export const imgHeadlight = "/images/04686ec0d3f939900814965c608686e63c5679cf.png";
export const imgHeroBg = "/images/hero section.png";
export const imgWoman = "/images/adb4265a4555d5880f34c515fd601456eeaedac0.png";
export const imgJames = "/images/abc80987f259972c9a4440eba4883840eae5421e.png";
export const imgFaqImage = "/images/6259f53688a0da98ea9c614fe9e73aa01605beed.png";
export const imgUsaFlag = "/images/c18f64ccd26d0ad3cf9aa97341b0bd9ea71bf308.png";
export const imgAusFlag = "/images/b9250847be9d4e3eb755b876e896f9e979c43175.png";
export const imgIndiaFlag = "/images/d37b2ddd228c5871f516e25cddf0f3cc98b26ea1.png";

// ——— Featured Cars ———
export const featuredCars = [
    {
        name: "Bugatti Chiron Sport",
        price: "$10.99/Day",
        fuel: "Petrol",
        mileage: "18031",
        img: imgBugatti,
        category: "Hypercar",
    },
    {
        name: "Lamborghini Countach",
        price: "$10.99/Day",
        fuel: "Petrol",
        mileage: "15200",
        img: imgLambo,
        category: "Supercar",
    },
    {
        name: "Porsche 918 SPYD",
        price: "$10.99/Day",
        fuel: "Hybrid",
        mileage: "12400",
        img: imgPorsche918,
        category: "Hypercar",
    },
];

// ——— Browse Cars ———
export interface BrowseCar {
    id: string;
    name: string;
    price: string;
    fuel: string;
    mileage: string;
    img: string;
    type: string;
    brand: string;
    location: string;
    description?: string;
    status?: string;
}

export const browseCars: BrowseCar[] = [
    { id: "1", name: "Porsche Taycan 4S", price: "$10.89/Day", fuel: "Electric", mileage: "18031", img: imgPorscheTaycan, type: "Sports Car", brand: "Porsche", location: "New York", description: "The Porsche Taycan 4S combines electrifying performance with everyday usability. With dual electric motors delivering 522 hp, it accelerates from 0-60 in 3.8 seconds while offering a refined, luxurious driving experience." },
    { id: "2", name: "Mustang GT 350", price: "$10.99/Day", fuel: "Petrol", mileage: "18031", img: imgMustang, type: "Muscle Car", brand: "Ford", location: "Miami", description: "The Shelby GT350 is the ultimate driver's Mustang. Its flat-plane-crank 5.2L V8 revs to 8,250 rpm, delivering 526 hp of naturally aspirated fury through a precise 6-speed manual transmission." },
    { id: "3", name: "Ferrari 812 Superfast", price: "$10.99/Day", fuel: "Petrol", mileage: "18031", img: imgFerrari, type: "Supercar", brand: "Ferrari", location: "Los Angeles", description: "The Ferrari 812 Superfast lives up to its name with a 789 hp 6.5L V12 engine, making it the most powerful naturally aspirated production car Ferrari has ever built. Pure Italian excellence." },
    { id: "4", name: "Bugatti Chiron Sport", price: "$12.99/Day", fuel: "Petrol", mileage: "18031", img: imgBugatti, type: "Hypercar", brand: "Bugatti", location: "New York", description: "The Bugatti Chiron Sport is the pinnacle of automotive engineering. Its quad-turbocharged W16 engine produces 1,479 hp, propelling you to a top speed of 261 mph in unparalleled luxury." },
    { id: "5", name: "Lamborghini Countach", price: "$11.49/Day", fuel: "Petrol", mileage: "15200", img: imgLambo, type: "Supercar", brand: "Lamborghini", location: "Miami", description: "The Lamborghini Countach LPI 800-4 is a modern tribute to the legendary original. Powered by a V12 hybrid powertrain producing 803 hp, it combines retro-futuristic design with cutting-edge technology." },
    { id: "6", name: "Porsche 918 SPYD", price: "$13.99/Day", fuel: "Hybrid", mileage: "12400", img: imgPorsche918, type: "Hypercar", brand: "Porsche", location: "Los Angeles", description: "The Porsche 918 Spyder is a plug-in hybrid hypercar that redefined what's possible. With a combined 887 hp from its V8 and dual electric motors, it demolishes the Nürburgring in under 7 minutes." },
];

export const carTypes = ["All Types", "Sports Car", "Muscle Car", "Supercar", "Hypercar"];
export const carBrands = ["All Brands", "Porsche", "Ford", "Ferrari", "Bugatti", "Lamborghini"];
export const carLocations = ["All Locations", "New York", "Miami", "Los Angeles"];

// ——— Featured Ride ———
export const featuredRide = {
    name: "McLaren P1",
    img: imgMcLaren,
    badge: "50% Off Weekend Rentals",
    specs: [
        { value: 350, unit: "Kph", label: "Top Speed" },
        { value: 900, unit: "Nm", label: "Torque" },
        { value: 916, unit: "PS", label: "Power" },
    ],
};

// ——— Reviews ———
export const reviews = [
    {
        name: "James Rodriguez",
        location: "Miami, Florida",
        rating: 5,
        title: "Luxury Made Easy",
        text: "The Booking Process Was Incredibly Seamless And User-Friendly, Making It Easy For Me To Find The Perfect Car For My Needs.",
        avatar: imgJames,
        photo: imgWoman,
    },
    {
        name: "Sarah Mitchell",
        location: "Los Angeles, CA",
        rating: 5,
        title: "Outstanding Experience",
        text: "From Start To Finish, Everything Was Perfect. The Car Was Immaculate And The Customer Service Was Top-Notch. Will Definitely Be Coming Back!",
        avatar: imgJames,
        photo: imgWoman,
    },
    {
        name: "David Chen",
        location: "New York, NY",
        rating: 5,
        title: "Dream Cars, Real Service",
        text: "I've Rented From Many Places Before, But Renture Stands Out With Their Incredible Selection And Attention To Detail. Highly Recommended!",
        avatar: imgJames,
        photo: imgWoman,
    },
    {
        name: "Emily Watson",
        location: "Chicago, IL",
        rating: 4,
        title: "Unforgettable Ride",
        text: "Driving A Supercar Through The City Was A Bucket List Experience. The Team Made It Effortless And Memorable. Thank You Renture!",
        avatar: imgJames,
        photo: imgWoman,
    },
];

// ——— FAQ ———
export const faqItems = [
    {
        q: "What Documents Are Required To Rent A Car?",
        a: "To rent a car, you'll need a valid driver's license, a government-issued ID (passport or national ID), and a credit card for the security deposit. International renters may also need an International Driving Permit (IDP).",
    },
    {
        q: "Can I Extend My Rental Period?",
        a: "Yes, you can extend your rental period. Simply contact our support team at least 24 hours before your return date, and we'll adjust your booking accordingly. Extension rates may vary based on availability.",
    },
    {
        q: "Are There Any Mileage Limits On Rentals?",
        a: "Mileage Limits Vary Depending On The Car And Rental Plan You Choose. While Many Of Our Vehicles Come With Unlimited Mileage, Some High-Performance Or Specialty Cars May Have A Daily Limit. Check Your Rental Agreement For Details.",
    },
    {
        q: "Is Delivery And Pickup Available?",
        a: "Absolutely! We offer complimentary delivery and pickup within city limits. For locations outside the city, a small surcharge may apply. Schedule your delivery during the booking process.",
    },
    {
        q: "What Happens In Case Of A Breakdown Or Accident?",
        a: "We provide 24/7 roadside assistance for all rentals. In case of an accident, contact our emergency line immediately. Our comprehensive insurance coverage ensures you're protected throughout your rental period.",
    },
];

// ——— Why Us ———
export const whyUsItems = [
    {
        num: "01",
        title: "Affordable Prices",
        description: "We offer competitive pricing that makes luxury accessible. Enjoy premium vehicles at rates that won't break the bank, with transparent pricing and no hidden fees.",
    },
    {
        num: "02",
        title: "Premium Fleet",
        description: "Our premium fleet is carefully curated to bring you the most iconic and sought-after cars in the world.",
    },
    {
        num: "03",
        title: "Well-Maintained Cars",
        description: "Every vehicle in our fleet undergoes rigorous maintenance checks and detailed cleaning before each rental, ensuring you always drive a car in perfect condition.",
    },
    {
        num: "04",
        title: "24/7 Support",
        description: "Our dedicated support team is available around the clock, ready to assist with roadside emergencies, booking changes, or any questions you may have.",
    },
    {
        num: "05",
        title: "Flexible Plans",
        description: "Choose from daily, weekly, or monthly rental plans tailored to your needs. Cancel or modify your reservation up to 24 hours in advance with no penalty.",
    },
];

// ——— Rental Steps ———
export const rentalSteps = [
    {
        num: "01",
        title: "Browse And Select",
        description:
            "Begin Your Journey By Exploring Our Extensive Collection Of Luxury And Sports Cars, Each Meticulously Curated To Suit A Variety Of Preferences And Occasions.",
        dark: true,
        img: imgHeadlight,
    },
    {
        num: "02",
        title: "Book And Confirm",
        description:
            "Once You've Found Your Ideal Car, Proceed To Book With Ease. Select Your Rental Duration, Choose Optional Add-Ons For A Personalized Experience, & Review Transparent Pricing With No Hidden Fees.",
        dark: false,
        img: imgRacing,
    },
    {
        num: "03",
        title: "Drive And Enjoy",
        description:
            "Pick Up Your Car Or Have It Delivered To Your Location. Experience The Thrill And Comfort Of Driving A Well-Maintained Premium Vehicle.",
        dark: false,
        img: imgMcLaren,
    },
];

// ——— Footer ———
export const footerLocations = [
    { flag: imgUsaFlag, country: "UNITED STATE", address: "417 Bicetown Road, New York, NY 10018, USA." },
    { flag: imgAusFlag, country: "AUSTRALIA", address: "25 Oceanview Drive, Sydney, NSW 2000, Australia" },
    { flag: imgIndiaFlag, country: "INDIA", address: "58, Green Park Avenue, Sector 15, Haryana 122001, India" },
];

export const footerSiteMapLinks = ["Home", "About", "Our Fleet", "Contact Us"];
export const footerContactInfo = {
    phone: "+1 123 345 6789",
    email: "info@renture.com",
};
