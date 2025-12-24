export interface BilingualStringDto {
  en: string
  de: string
}

export interface ProjectSectionDto {
  title: string
  texts: string[]
}

export interface ProjectSectionsDto {
  de: ProjectSectionDto[]
  en: ProjectSectionDto[]
}

export interface ProjectDto {
  id: number
  client: string
  title: BilingualStringDto
  category: BilingualStringDto
  tagline: BilingualStringDto
  image: string
  sections: ProjectSectionsDto
  displayRank: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  client: string
  title: BilingualStringDto
  category: BilingualStringDto
  tagline: BilingualStringDto
  image: string
  sections: ProjectSectionsDto
  displayRank: number
}

export interface UpdateProjectDto {
  client?: string
  title?: BilingualStringDto
  category?: BilingualStringDto
  tagline?: BilingualStringDto
  image?: string
  sections?: ProjectSectionsDto
  displayRank?: number
}

export interface ProjectResponseDto {
  success: boolean
  message: string
  data: {
    project: ProjectDto
  }
}

export interface ProjectsResponseDto {
  success: boolean
  message: string
  data: {
    projects: ProjectDto[]
    pagination: {
      currentPage: number
      totalProjects: number
      projectsPerPage: number
      totalPages: number
    }
  }
}

export interface ProjectImagesResponseDto {
  success: boolean
  message: string
  data: {
    image: {
      url: string
      public_id: string
      altText: string
    }
  }
}
