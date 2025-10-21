"use client"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { projectStorage, type WorkflowProject } from "@/lib/ProjectStorage"
import { workflowTemplates } from "@/lib/workflow-templates"
import { TEMPLATE_ICONS } from "@/config/constants"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

export default function HomePage() {
    const router = useRouter()
    const [projects, setProjects] = useState<WorkflowProject[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isRenameOpen, setIsRenameOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [selectedProject, setSelectedProject] = useState<WorkflowProject | null>(null)

    useEffect(() => {
        setProjects(projectStorage.getAllProjects())
    }, [])

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            const project = projectStorage.createProject(newProjectName)
            setProjects(projectStorage.getAllProjects())
            setNewProjectName("")
            setIsCreateOpen(false)
            router.push(`/builder/${project.id}`)
        }
    }

    const handleCreateFromTemplate = (templateId: string) => {
        const template = workflowTemplates.find((t) => t.id === templateId)
        if (template) {
            const project = projectStorage.createProject(template.project.name)
            projectStorage.updateProject(project.id, {
                nodes: template.project.nodes,
                edges: template.project.edges,
            })
            setProjects(projectStorage.getAllProjects())
            router.push(`/builder/${project.id}`)
        }
    }

    const handleRenameProject = () => {
        if (selectedProject && newProjectName.trim()) {
            projectStorage.renameProject(selectedProject.id, newProjectName)
            setProjects(projectStorage.getAllProjects())
            setNewProjectName("")
            setIsRenameOpen(false)
            setSelectedProject(null)
        }
    }

    const handleDeleteProject = () => {
        if (selectedProject) {
            projectStorage.deleteProject(selectedProject.id)
            setProjects(projectStorage.getAllProjects())
            setIsDeleteOpen(false)
            setSelectedProject(null)
        }
    }

    const handleOpenProject = (projectId: string) => {
        router.push(`/builder/${projectId}`)
    }

    const openRenameDialog = (project: WorkflowProject) => {
        setSelectedProject(project)
        setNewProjectName(project.name)
        setIsRenameOpen(true)
    }

    const openDeleteDialog = (project: WorkflowProject) => {
        setSelectedProject(project)
        setIsDeleteOpen(true)
    }

    const getTemplateIcon = (iconName: string) => {
        const IconComponent = TEMPLATE_ICONS[iconName as keyof typeof TEMPLATE_ICONS] || TEMPLATE_ICONS.Rocket
        return <IconComponent className="w-8 h-8" />
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-background">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    {/* Your Projects Section - Now at the top */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Your Projects</h1>
                                <p className="text-muted-foreground mt-1">Manage and organize your workflows</p>
                            </div>
                        </div>

                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className="p-6 hover:shadow-lg transition-all hover:border-blue-400 cursor-pointer group"
                                    >
                                        <div onClick={() => handleOpenProject(project.id)} className="mb-4">
                                            <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {project.nodes.length} nodes • {project.edges.length} connections
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Updated {new Date(project.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-border">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-2 bg-transparent"
                                                onClick={() => openRenameDialog(project)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Rename
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive bg-transparent"
                                                onClick={() => openDeleteDialog(project)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center border-dashed">
                                <p className="text-muted-foreground mb-6">No projects yet. Create your first workflow below!</p>
                            </Card>
                        )}
                    </div>

                    {/* Templates Section */}
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-foreground">Start from a Template</h2>
                            <p className="text-muted-foreground mt-1">Choose a template or start with a blank canvas</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Blank Template */}
                            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group border-2 border-dashed border-border hover:border-blue-400">
                                <div
                                    onClick={() => setIsCreateOpen(true)}
                                    className="text-center h-full flex flex-col items-center justify-center"
                                >
                                    <div className="flex justify-center mb-4">
                                        <Plus className="w-10 h-10 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                                        Blank Project
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-2">Start with an empty canvas</p>
                                </div>
                            </Card>

                            {/* Template Cards */}
                            {workflowTemplates.map((template) => (
                                <Card
                                    key={template.id}
                                    className="p-6 hover:shadow-lg transition-all cursor-pointer group hover:border-blue-400"
                                    onClick={() => handleCreateFromTemplate(template.id)}
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="text-muted-foreground group-hover:text-blue-600 transition-colors">
                                            {getTemplateIcon(template.icon)}
                                        </div>
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground group-hover:text-blue-600 transition-colors text-center">
                                        {template.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">{template.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Project Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateProject}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rename Project Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input
                            placeholder="Project name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRenameProject()}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleRenameProject}>Rename</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Project Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete &quot;{selectedProject?.name}&quot;? This action cannot be undone.
                    </AlertDialogDescription>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
            <Footer />
        </>
    )
}
