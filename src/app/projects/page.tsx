import { Header } from "~/components/header"
import { Sidebar } from "~/components/sidebar"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { mockProjects } from "~/lib/mock-data"
import { Calendar, Flag, Plus } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          breadcrumbs={[{ label: "Projects", href: "/projects", active: true }]}
          createButtonLabel="New Project"
          createButtonLink="/projects/create"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Flag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{project.toggleCount} feature toggles</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Created {project.createdAt}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/projects/${project.id}`}>View Project</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Set up a new project to organize your feature toggles</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/projects/create" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

