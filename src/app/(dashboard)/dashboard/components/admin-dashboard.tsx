import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
import { T } from "@/components/t"

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
          {firstName
            ? <T k="admin.welcome" values={{ name: firstName }} />
            : <T k="admin.title" />}
        </h1>
        <p className="text-muted-foreground mt-1"><T k="admin.subtitle" /></p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="admin.totalUsers" /></CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.totalUsers)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <T k="admin.expertsClients" values={{ experts: fmt(stats?.totalExperts), clients: fmt(stats?.totalClients) }} />
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/users" className="flex items-center gap-1">
                <T k="admin.manageUsers" /> <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="admin.pendingVerifications" /></CardDescription>
            <ShieldCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.pendingVerifications)}</p>
            <p className="text-xs text-muted-foreground mt-1"><T k="admin.awaitingReview" /></p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/verifications" className="flex items-center gap-1">
                <T k="admin.reviewQueue" /> <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="admin.activeMissions" /></CardDescription>
            <Briefcase className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.activeMissions)}</p>
            <p className="text-xs text-muted-foreground mt-1"><T k="admin.currentlyInProgress" /></p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              <T k="admin.completedTotal" values={{ n: fmt(stats?.completedMissions) }} />
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="admin.platformRevenue" /></CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmtCurrency(stats?.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-1"><T k="admin.fromCompletedMissions" /></p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              <T k="admin.missionsCompleted" values={{ n: fmt(stats?.completedMissions) }} />
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="admin.verifiedExperts" /></CardDescription>
            <UserCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.totalExperts)}</p>
            <p className="text-xs text-muted-foreground mt-1"><T k="admin.registeredExperts" /></p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/admin/verifications" className="flex items-center gap-1">
                <T k="admin.verifications" /> <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription><T k="admin.completedMissions" /></CardDescription>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmt(stats?.completedMissions)}</p>
            <p className="text-xs text-muted-foreground mt-1"><T k="admin.allTime" /></p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              <T k="admin.avgPerMission" values={{
                amount: stats?.completedMissions && stats?.totalRevenue
                  ? fmtCurrency(stats.totalRevenue / stats.completedMissions)
                  : "—"
              }} />
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
