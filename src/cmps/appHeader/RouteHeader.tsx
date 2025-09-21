// RouteHeader.tsx (modernized header, neutral palette, no "Home" crumb)
import { useEffect, useMemo, useState } from "react";
import { Link, matchPath, useLocation, useNavigate, useParams, Params } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { RouteMeta, routeMeta } from "../../services/routeMeta";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import ErrorPage from "../ErrorPage";
import { Loader } from "../helpers/Loader";
import { useQuery } from "@tanstack/react-query";
import { ApiServiceResponse, User } from "../../types/commonTypes/commonTypes";
import { storageService } from "../../services/storage.service";
import { navigateService } from "../../services/navigate.service";
import { routeService } from "../../services/route.service";
import { employeesService } from "../../services/employees.service";
import { utilService } from "../../services/util.service";
import { Button } from "../../components/ui/button";

/** Breadcrumb crumb type */
export type Crumb = { to?: string; label: string };

/** Find best meta match for current route (includes dynamic) */
function findBestMeta(pathname: string): RouteMeta | undefined {
  return routeMeta.find((m) => matchPath({ path: m.path, end: true }, pathname));
}

const HOME = "/tasks";

/** Centralized, explicit breadcrumb map (parents are clickable). */
/** NOTE: All "Home" entries removed */
const advancedBreadcrumbMap: Record<string, Crumb[]> = {
  // Auth
  "/": [],

  // Home & top-level
  [HOME]: [{ label: "Tasks" }],
  "/create": [{ to: "/tasks", label: "Tasks" }, { label: "New" }],

  // Tasks & types/priority levels/statuses
  "/tasks": [{ label: "Tasks" }],
  "/task/types": [{ to: "/tasks", label: "Tasks" }, { label: "Types" }],
  "/task/statuses": [{ to: "/tasks", label: "Tasks" }, { label: "Statuses" }],
  "/task/priority-levels": [{ to: "/tasks", label: "Tasks" }, { label: "Priority Levels" }],



  // Users
  "/users": [{ label: "Users" }],
  "/user/types": [{ to: "/users", label: "Users" }, { label: "Types" }],
  "/user/statuses": [{ to: "/users", label: "Users" }, { label: "Statuses" }],

  // Profile
  "/profile": [{ label: "Profile" }],



  // Invoices
  "/real-time-work": [{ label: "Dashboard" }],

  "/reports": [{ label: "Reports" }],

  "/campaigns": [{ label: "Campaigns" }],

  "/departments": [{ label: "Departments" }],
  "/task/products": [{ label: "Task products" }],
  "/task/stuck-products": [{ label: "Task Stuck products" }],
  "/reports/by-ticket-id": [{ label: "Task History" }],
};

const toDefinedParams = (p: Readonly<Params<string>>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(p)) if (v !== undefined) out[k] = v;
  return out;
};

/** Helpers to keep RouteHeader simple (reduces cognitive complexity) */
function isCampaignDetails(pathname: string, test = false) {
  return matchPath({ path: test ? "/campaign-details-test/:id" : "/campaign-details/:id", end: true }, pathname);
}

function buildDynamicDetailCrumbs(pathname: string, params: Readonly<Params<string>>): Crumb[] | null {
  if (isCampaignDetails(pathname)) {
    return [
      { to: "/campaigns", label: "Campaigns" },
      { label: params.id ? `Details (${params.id})` : "Details" },
    ];
  }
  if (isCampaignDetails(pathname, true)) {
    return [
      { to: "/campaigns", label: "Campaigns" },
      { label: params.id ? `Details Test (${params.id})` : "Details Test" },
    ];
  }
  return null;
}

function buildFallbackCrumbs(
  pathname: string,
  dynamicLabel: string | null,
  meta: RouteMeta | undefined
): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let cumulative = "";

  segments.forEach((seg, idx) => {
    cumulative += "/" + seg;
    const isLast = idx === segments.length - 1;
    const m = routeMeta.find((r) => matchPath({ path: r.path, end: true }, cumulative));
    const label = isLast ? dynamicLabel || m?.crumb || seg : m?.crumb || seg;
    crumbs.push({ to: !isLast ? cumulative : undefined, label });
  });

  // ⛔️ do NOT inject "Home"
  return crumbs;
}

function getCrumbs(
  pathname: string,
  params: Readonly<Params<string>>,
  dynamicLabel: string | null,
  meta: RouteMeta | undefined
): Crumb[] {
  if (advancedBreadcrumbMap[pathname]) return advancedBreadcrumbMap[pathname];
  const dynamic = buildDynamicDetailCrumbs(pathname, params);
  if (dynamic) return dynamic;
  return buildFallbackCrumbs(pathname, dynamicLabel, meta);
}

export default function RouteHeader(): React.JSX.Element | null {
  const params = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const meta = useMemo(() => findBestMeta(pathname), [pathname]);

  const [dynamicLabel, setDynamicLabel] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      if (meta?.dynamicCrumb) {
        try {
          const label = await meta.dynamicCrumb(toDefinedParams(params));
          if (active) setDynamicLabel(label);
        } catch {
          if (active) setDynamicLabel(null);
        }
      } else setDynamicLabel(null);
    })();
    return () => {
      active = false;
    };
  }, [meta, params]);

  const handleLogout = () => {
    try {
      storageService.remove("USERTYPEID_TASKIFY", false);
      storageService.remove("USERTYPEID_TASKIFY", true);
      storageService.remove("TOKEN_TASKIFY", false);
      storageService.remove("TOKEN_TASKIFY", true);
      storageService.remove("fullName_TASKIFY", false);
      storageService.remove("fullName_TASKIFY", true);
    } finally {
      navigateService.handleNavigation(navigate, routeService.LOGIN);
    }
  };

  // -------- fetch user --------
  // const idStr = "1";
  // const numericId = idStr ? Number(idStr) : undefined;
  // const hasValidId = Number.isFinite(numericId);

  // const { data: user, isLoading, isError, error } = useQuery<ApiServiceResponse<User>, Error>({
  //   queryKey: ["user", numericId],
  //   queryFn: () => employeesService.getEmployee(numericId!) as Promise<ApiServiceResponse<User>>,
  //   enabled: !!hasValidId,
  //   retry: false,
  // });

  // if (!hasValidId) return <ErrorPage errorText="User ID not found—are you logged in?" />;
  // if (isError) return <ErrorPage errorText={`Error fetching profile. ${error?.message}`} />;
  // if (isLoading || !user) return <Loader />;

  // Only hide when the route explicitly asks for it
  if (meta?.hideBreadcrumb) return null;

  // -------- breadcrumbs --------
  const rawCrumbs = getCrumbs(pathname, params, dynamicLabel, meta);
  // On HOME (/campaigns) keep only the last item (e.g. "Campaigns")
  const filteredCrumbs = pathname === HOME ? rawCrumbs.slice(-1) : rawCrumbs;
  // console.log("user", user)



  const username = utilService.getUserName()
  return (
    <div className="sticky top-0 z-30">
      {/* Neutral translucent header (no harsh red) */}
      <div className="border-b border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/55 dark:supports-[backdrop-filter]:bg-neutral-900/50">
        <div className="mx-auto max-w-7xl px-0">
          <div className="h-14 flex items-center justify-between gap-4 pr-4 sm:pr-6">
            {/* Breadcrumbs (no left margin) */}
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {filteredCrumbs.map((c, i) => {
                  const isLast = i === filteredCrumbs.length - 1;
                  const pad = i === 0 ? "px-0" : "px-2"; // no left padding on first crumb
                  return (
                    <li key={i} className="flex items-center min-w-0">
                      {!isLast && c.to ? (
                        <>
                          <Link
                            to={c.to}
                            className={`truncate ${pad} py-1 rounded-md hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 dark:focus-visible:ring-white/30`}
                          >
                            <span
                              className="truncate inline-block max-w-[10rem] sm:max-w-[14rem]"
                              title={c.label}
                            >
                              {c.label}
                            </span>
                          </Link>
                          <ChevronRight className="mx-1 h-3 w-3 opacity-60" aria-hidden />
                        </>
                      ) : (
                        <span className={`truncate ${pad} py-1`} title={c.label}>
                          <AnimatePresence mode="wait">
                            <motion.span key={c.label}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.18 }}
                              className="truncate inline-block max-w-[12rem] sm:max-w-[18rem]"
                            >
                              {c.label}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                      )
                      }
                    </li>
                  );
                })}
              </ol>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-1 hover:bg-slate-900/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 flex items-center justify-center ring-1 ring-black/10 dark:ring-white/20">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium leading-tight text-slate-900 dark:text-white">
                      {username}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{username}</p>
                </div>
                <DropdownMenuSeparator />


                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </div >
  );
}
