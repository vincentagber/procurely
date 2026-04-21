export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = NavLink;

export type SiteContent = {
  site: {
    name: string;
    tagline: string;
    primaryColor: string;
    surfaceColor: string;
    footerColor: string;
    accentColor: string;
    testimonialBackground: string;
    logoDark: string;
    logoLight: string;
  };
  navigation: {
    socialLinks: SocialLink[];
    primaryLinks: NavLink[];
    accountLinks: NavLink[];
    submitCta: NavLink;
  };
  hero: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    backgroundImage: string;
  };
  features: Array<{
    icon: "truck" | "shield" | "headset";
    title: string;
    description: string;
  }>;
  categoriesSection: {
    eyebrowLead: string;
    eyebrowAccent: string;
    linkLabel: string;
    items: CategoryCard[];
  };
  brands: Brand[];
  products: Product[];
  bestSellerSection: {
    monthLabel: string;
    eyebrowLead: string;
    eyebrowAccent: string;
    linkLabel: string;
    productIds: string[];
  };
  promotions: {
    financing: PromotionBanner;
    renovation: PromotionBanner;
  };
  exploreSection: {
    monthLabel: string;
    eyebrowLead: string;
    eyebrowAccent: string;
    ctaLabel: string;
    productIds: string[];
  };
  faqs: FaqItem[];
  testimonials: {
    title: string;
    items: Testimonial[];
  };
  modernTestimonials: {
    title: string;
    items: Testimonial[];
  };
  footer: {
    subscribeTitle: string;
    subscribePromo: string;
    address: string[];
    email: string;
    phone: string;
    accountLinks: NavLink[];
    quickLinks: NavLink[];
    qrImage: string;
    paymentsImage: string;
  };
  authScreens: {
    login: AuthScreen;
    signup: AuthScreen;
    forgot: {
      title: string;
      description: string;
      submitLabel: string;
    };
  };
};

export type CategoryCard = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  cardImage: string;
  variant: "wide" | "tall" | "wide-small" | "small";
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  collection: string;
  price: number;
  currency: string;
  image: string;
  badge: string;
  featured: boolean;
  homepageSlot: string;
};

export type PromotionBanner = {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
  bannerImage: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  cardImage: string;
};

export type AuthScreen = {
  title: string;
  image: string;
  submitLabel: string;
};

export type Brand = {
  name: string;
  logo: string;
};

export type ApiEnvelope<T> = {
  data: T;
};

export type ApiErrorEnvelope = {
  error: {
    message: string;
    details?: Record<string, unknown>;
  };
};

export type Cart = {
  cartToken: string;
  items: CartItem[];
  subtotal: number;
  vat: number;
  shippingFee: number;
  serviceFee: number;
  total: number;
};

export type CartItem = {
  id: number;
  cartToken: string;
  quantity: number;
  lineTotal: number;
  product: Product;
};

export type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  paymentMethod?: string;
};

export type Order = {
  orderNumber: string;
  status: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  subtotal: number;
  vat: number;
  shippingFee: number;
  serviceFee: number;
  total: number;
  createdAt: string;
  items: Array<{
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
};

export type Wishlist = {
  wishlistToken: string;
  items: Product[];
};

export type WishlistItemPayload = {
  wishlistToken: string;
  productId: string;
};
