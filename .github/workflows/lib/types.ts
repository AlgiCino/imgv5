export type Locale = 'ar' | 'en';
export type LocalizedString = { ar?: string; en?: string };
export type MaybeLocalized = string | LocalizedString;

export interface Amenity {
  name: LocalizedString;
  description?: LocalizedString;
}

export interface MapPOI {
  name: MaybeLocalized;
  distance?: MaybeLocalized;
  category?: string | Record<string, unknown>;
  coordinates: { lat: number; lon: number };
  title?: MaybeLocalized;
}

export interface Contact {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface NewsItem {
  title: MaybeLocalized;
  url?: string;
  date?: string;
  source?: string;
}

export interface Project {
  slug: string;
  id?: string;
  developer?: string;

  projectName: MaybeLocalized;
  country?: MaybeLocalized;
  city?: MaybeLocalized;
  area?: MaybeLocalized;
  location?: MaybeLocalized;

  description?: MaybeLocalized;
  summary?: MaybeLocalized;
  insights?: MaybeLocalized;
  
  amenities?: Amenity[];
  mapDescription?: MaybeLocalized;
  mapPointsOfInterest?: MapPOI[];

  bedrooms?: number[];
  propertyTypes?: Array<MaybeLocalized>;

  brochurePdfLink?: string;
  videoLink?: string;
  "3D_TourLink"?: string;

  galleryImages?: string[];
  heroImage?: string;

  launchDate?: string;
  deliveryDate?: string;

  goldenVisaEligible?: boolean;
  views?: LocalizedString[];
  highlights?: LocalizedString[];

  minAreaSqft?: number;
  maxAreaSqft?: number;
  minAreaSqmt?: number;
  maxAreaSqmt?: number;

  minPriceAED?: number;
  maxPriceAED?: number;

  projectPageLink?: string;
  projectStatus?: MaybeLocalized;

  sellable?: boolean;
  projectID?: string;

  latitude?: number;
  longitude?: number;

  news?: NewsItem[];
  contact?: Contact;
  
  [k: string]: any;
}
