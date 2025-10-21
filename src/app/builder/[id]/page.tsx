"use client"

import { useParams } from "next/navigation"
import WorkflowBuilder from "@/components/WorkflowCanvas"

export default function BuilderPage() {
    const params = useParams()
    const projectId = params.id as string

    return (
        <main className="w-full h-screen">
            <WorkflowBuilder projectId={projectId} />
        </main>
    )
}