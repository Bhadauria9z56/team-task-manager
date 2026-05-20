"use client";

import { BarChart3, FolderKanban, LogOut, Moon, SunMedium } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/projects", label: "Projects", icon: FolderKanban }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: user } = useAuth();

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    router.replace("/login");
  }

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-foreground bg-foreground p-5 text-background shadow-2xl shadow-black/20 lg:block">
          <div className="mono-visual mb-8 min-h-40 rounded-lg border border-background/70 p-4 text-background">
            <p className="relative z-10 text-xs font-medium uppercase text-background/70">Workspace</p>
            <h1 className="relative z-10 mt-2 max-w-40 text-2xl font-semibold leading-tight tracking-normal">
              Team Task Manager
            </h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-background bg-background text-foreground"
                      : "border-background/20 text-background/70 hover:border-background/60 hover:text-background"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-4 border-b bg-background/90 px-4 py-3 backdrop-blur md:px-8">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium">{user?.name}</p>
            </div>
            <nav className="flex items-center gap-1 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Button key={item.href} asChild variant={active ? "secondary" : "ghost"} size="icon">
                    <Link href={item.href} aria-label={item.label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              })}
            </nav>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Toggle theme"
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <SunMedium className="hidden h-4 w-4 dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
