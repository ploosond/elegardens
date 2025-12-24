export interface ImageDto {
  id: string
  url: string
  alt?: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
}
export interface ProductDto {
  id: string
  slug: string
  common_name_en?: string | null
  common_name_de?: string | null
  description_en: string
  description_de: string
  height: string
  diameter: string
  hardiness: string
  light_en: string
  light_de: string
  images?: ImageDto[]
  color?: string | null
  metaTitle_en?: string | null
  metaTitle_de?: string | null
  metaDescription_en?: string | null
  metaDescription_de?: string | null
  updatedAt?: string
  createdAt?: string
}
