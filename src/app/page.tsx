import { Header } from "~/components/header"
import { Sidebar } from "~/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { mockProjects, mockFeatureToggles } from "~/lib/mock-data"
import { BarChart3, Flag, Layers, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const activeToggles = mockFeatureToggles.filter((toggle) => toggle.enabled).length
  const totalToggles = mockFeatureToggles.length
  const totalProjects = mockProjects.length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header showSearch={false} showCreateButton={false} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Toggles</CardTitle>
                  <Flag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeToggles}</div>
                  <p className="text-xs text-muted-foreground">of {totalToggles} total toggles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground">across your organization</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Toggle Evaluations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5k</div>
                  <p className="text-xs text-muted-foreground">in the last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Stale Toggles</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">toggle needs review</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mt-4">Recent Projects</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">{project.toggleCount} feature toggles</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

