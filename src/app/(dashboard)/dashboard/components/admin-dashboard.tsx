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
import { ShieldCheck, ClipboardList, CreditCard, ArrowRight } from "lucide-react"

type Props = {
  firstName?: string
}

export function AdminDashboard({ firstName }: Props) {
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {firstName ? `Welcome, ${firstName}` : "Admin Overview"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform management and oversight.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Expert Verification</CardDescription>
            <ShieldCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/experts" className="flex items-center gap-1">
                Manage experts <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Platform Requests</CardDescription>
            <ClipboardList className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/requests" className="flex items-center gap-1">
                View requests <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Payments</CardDescription>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">—</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="-ml-2">
              <Link href="/payments" className="flex items-center gap-1">
                View payments <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
