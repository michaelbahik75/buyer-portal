"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Badge, Loader } from "@mantine/core";
import { IconHeart, IconHeartFilled, IconLogout } from "@tabler/icons-react";
import useAuth from "@/utils/contexts/UserContext";
import { apiGet, apiPost, apiDelete } from "@/utils/http/http";

interface Property {
  id: number;
  name: string;
  location: string;
  price: string;
  type: "rent" | "sale";
}

const EMOJIS = ["🏢", "🏡", "🏠", "🏘️", "🏗️", "🏰"];
const COLORS = ["bg-emerald-50", "bg-blue-50", "bg-amber-50", "bg-rose-50", "bg-green-50", "bg-pink-50"];

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [favouriteIds, setFavouriteIds] = useState<Set<number>>(new Set());
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/auth/login");
  }, [router]);

  // Fetch all properties
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiGet("properties");
        console.log("res.data.data:", res.data.data);
        setProperties(res.data.data ?? res.data);
        console.log("properties set:", res.data.data);
      } catch {
        setError("Could not load properties.");
      } finally {
        setLoadingProps(false);
      }
    };
    fetch();
  }, []);

  // Fetch user's favourites
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiGet("favourites");
        const favs: Property[] = res.data.data ?? res.data;
        setFavouriteIds(new Set(favs.map((f) => f.id)));
      } catch {
        setError("Could not load favourites.");
      } finally {
        setLoadingFavs(false);
      }
    };
    fetch();
  }, []);

  const toggleFavourite = async (property: Property) => {
    if (togglingId) return;
    setTogglingId(property.id);

    const isFav = favouriteIds.has(property.id);

    // Optimistic update
    setFavouriteIds((prev) => {
      const next = new Set(prev);
      isFav ? next.delete(property.id) : next.add(property.id);
      return next;
    });

    try {
      if (isFav) {
        await apiDelete(`favourites/${property.id}`);
      } else {
        await apiPost(`favourites/${property.id}`, {});
      }
    } catch {
      // Revert on error
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        isFav ? next.add(property.id) : next.delete(property.id);
        return next;
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    router.push("/auth/login");
  };

  const favouriteProperties = properties.filter((p) => favouriteIds.has(p.id));
  const isLoading = loadingProps || loadingFavs;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 shadow-sm">
        <span className="text-base font-semibold text-gray-900">Buyer Portal</span>

        <div className="flex items-center gap-3">
          {/* User chip */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1">
            <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-[11px] font-semibold">
              {initials}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-800">{user?.name ?? "User"}</span>
              <span className="text-[11px] text-gray-400">Buyer</span>
            </div>
          </div>

          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconLogout size={14} />}
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-8">

        {/* ── User info card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name ?? "—"}</p>
            <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>
            <Badge color="blue" variant="light" size="sm" mt={4}>Buyer</Badge>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader color="blue" />
          </div>
        ) : (
          <>
            {/* ── All Properties ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">All Properties</h2>
                <span className="text-xs text-gray-400">{properties.length} listed</span>
              </div>

              {properties.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">No properties available.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {properties.map((prop, i) => {
                    const isFav = favouriteIds.has(prop.id);
                    return (
                      <div
                        key={prop.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className={`${COLORS[i % COLORS.length]} h-28 flex items-center justify-center relative`}>
                          <span className="text-4xl">{EMOJIS[i % EMOJIS.length]}</span>
                          <span className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            prop.type === "rent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {prop.type === "rent" ? "For Rent" : "For Sale"}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 truncate">{prop.name}</p>
                          <p className="text-xs text-gray-500 mb-3 truncate">{prop.location}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{prop.price}</span>
                            <button
                              onClick={() => toggleFavourite(prop)}
                              disabled={togglingId === prop.id}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
                                isFav
                                  ? "border-red-300 bg-red-50 text-red-500"
                                  : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-400"
                              }`}
                            >
                              {isFav
                                ? <IconHeartFilled size={14} />
                                : <IconHeart size={14} />
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── My Favourites ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">My Favourites</h2>
                <span className="text-xs font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  {favouriteIds.size} saved
                </span>
              </div>

              {favouriteProperties.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-10 text-center">
                  <p className="text-2xl mb-2">🏠</p>
                  <p className="text-sm text-gray-500">No favourites yet — click the heart on any property to save it.</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
                  {favouriteProperties.map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{prop.name}</p>
                        <p className="text-xs text-gray-500">{prop.location} · {prop.price}</p>
                      </div>
                      <button
                        onClick={() => toggleFavourite(prop)}
                        disabled={togglingId === prop.id}
                        className="w-8 h-8 rounded-full border border-red-200 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors active:scale-90"
                      >
                        <IconHeartFilled size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}