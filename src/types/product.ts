export type ProductStatus  = 'available' | 'reserved' | 'sold' | 'pre-order';
export type ConditionGrade = 'new' | 'like-new' | 'excellent' | 'good' | 'fair';
export type FlawLevel      = 'none' | 'minor' | 'visible' | 'heavy';
export type BoxStatus      = 'original' | 'replacement' | 'none';
export type PhotoType      = 'editorial' | 'condition' | 'detail' | 'lifestyle';
export type EvidencePhotoType =
  | 'front'
  | 'left_side'
  | 'right_side'
  | 'heel'
  | 'outsole'
  | 'size_tag'
  | 'box_label'
  | 'top_down'
  | 'defect_closeup'
  | 'receipt';

export interface Flaw {
  id:          number;
  location:    string;
  severity:    FlawLevel;
  description: string;
  photos:      string[];
}

export interface Photo {
  url:           string;
  type:          PhotoType;
  alt:           string;
  evidenceType?: EvidencePhotoType;
}

export interface ProductSize {
  us:  number;
  eur: number;
  cm:  number;
}

export interface ProductVariant {
  id:             string;
  sizeLabel:      string;
  status:         ProductStatus;
  salePrice?:     number;
  sizeMx?:        number | string;
  sizeUs?:        number | string;
  sizeEu?:        number | string;
  sizeCm?:        number | string;
  stockQuantity?: number;
}

export interface Product {
  id:        string;
  slug:      string;
  brand:     string;
  category:  string;
  model:     string;
  subtitle:  string;
  size:      ProductSize;
  price:     number;
  status:    ProductStatus;
  variants:  ProductVariant[];
  condition: ConditionGrade;
  conditionScore?: number;
  flawLevel: FlawLevel;
  flaws:     Flaw[];
  box:       BoxStatus;
  photos:    Photo[];
  pairing?:  string;
  createdAt: string;
  soldAt?:   string;
  notes?:    string;
}

export interface Pairing {
  sneakerSlug:   string;
  fragranceName: string;
  fragranceSlug: string;
  rationale:     string;
}
