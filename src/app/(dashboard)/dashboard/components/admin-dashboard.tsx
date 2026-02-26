import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  Users,
  Briefcase,
  CheckCircle2,
  DollarSign,
  UserCheck,
  ArrowRight,
} from "lucide-react"

type AdminStats = {
  totalUsers: number
  totalExperts: number
  totalClients: number
  pendingVerifications: number
  activeMissions: number
  completedMissions: number
  totalRevenue: number
}

type Props = {
  firstName?: string
  stats: AdminStats | null
}

function fmt(n: number | undefined | null) {
  return n != null ? n.toLocaleString() : "—"
}

function fmtCurrency(n: number | undefined | null) {
  if (n == null) return "—"
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n)
}

export function AdminDashboard({ firstName, stats }: Props) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {firstName ? `Welcome, ${firstName}` : "Admin Overview"}
        </h1>
        <p className="text-muted-foreground mt-1">Platform management and oversight.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Total Users</CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.totalUsers)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {fmt(stats?.totalExperts)} experts · {fmt(stats?.totalClients)} clients
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/users" className="flex items-center gap-1">
                Manage users <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Pending Verifications</CardDescription>
            <ShieldCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.pendingVerifications)}</p>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/verifications" className="flex items-center gap-1">
                Review queue <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active Missions</CardDescription>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.activeMissions)}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              {fmt(stats?.completedMissions)} completed total
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Platform Revenue</CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmtCurrency(stats?.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-1">From completed missions</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              {fmt(stats?.completedMissions)} missions completed
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Verified Experts</CardDescription>
            <UserCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.totalExperts)}</p>
            <p className="text-xs text-muted-foreground mt-1">Registered experts</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/verifications" className="flex items-center gap-1">
                Verifications <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Completed Missions</CardDescription>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.completedMissions)}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Avg {stats?.completedMissions && stats?.totalRevenue
                ? fmtCurrency(stats.totalRevenue / stats.completedMissions)
                : "—"} / mission
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
