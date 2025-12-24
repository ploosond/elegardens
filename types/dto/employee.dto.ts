export interface ProfilePictureDto {
  url: string
  public_id: string
  altText: string
}

export interface EmployeeDto {
  id: number
  first_name: string
  last_name: string
  email?: string
  role_en: string
  role_de: string
  department_en?: string
  department_de?: string
  telephone?: string
  profilePicture?: ProfilePictureDto
  createdAt: string
  updatedAt: string
}
