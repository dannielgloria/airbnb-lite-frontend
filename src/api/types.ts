export type ApiErrorShape = {
  success: false;
  status: number;
  message: string;
};

export type AuthLoginResponse = { accessToken: string }; // backend login
export type AuthRegisterResponse = { id: string; name: string; email: string }; // backend register
export type MeResponse = { _id: string; name: string; email: string; createdAt?: string };

export type Photo = { url: string; publicId: string };

export type Listing = {
  _id: string;
  hostId: string;
  title: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  amenities: string[];
  isActive: boolean;
  photos: Photo[];
  createdAt?: string;
  updatedAt?: string;
};

export type Booking = {
  _id: string;
  listingId: Listing | string;
  guestId: { _id: string; email: string; name: string } | string;
  startDate: string;
  endDate: string;
  nights: number;
  totalPrice: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt?: string;
};
