import { Heart } from "lucide-react"
import Link from "next/link"
import { T } from "@/components/t"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <T k="footer.madeWith" />
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            <T k="footer.by" />
            <Link
              href="https://shadcnstore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              WorkedIn
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            <T k="footer.description" />
          </p>
        </div>
      </div>
    </footer>
  )
}
