export interface WorkflowProject {
    id: string
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    edges: any[]
    createdAt: number
    updatedAt: number
}

const STORAGE_KEY = "workflow_projects"

export const projectStorage = {
    getAllProjects: (): WorkflowProject[] => {
        if (typeof window === "undefined") return []
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    },

    getProject: (id: string): WorkflowProject | null => {
        const projects = projectStorage.getAllProjects()
        return projects.find((p) => p.id === id) || null
    },

    createProject: (name: string): WorkflowProject => {
        const project: WorkflowProject = {
            id: Date.now().toString(),
            name,
            nodes: [],
            edges: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }
        const projects = projectStorage.getAllProjects()
        projects.push(project)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
        return project
    },

    updateProject: (id: string, updates: Partial<WorkflowProject>) => {
        const projects = projectStorage.getAllProjects()
        const index = projects.findIndex((p) => p.id === id)
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                ...updates,
                updatedAt: Date.now(),
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
        }
    },

    deleteProject: (id: string) => {
        const projects = projectStorage.getAllProjects()
        const filtered = projects.filter((p) => p.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    },

    renameProject: (id: string, name: string) => {
        projectStorage.updateProject(id, { name })
    },
}