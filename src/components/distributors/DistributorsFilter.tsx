"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { Search, Users, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SortIcon } from "@/components/ui/sort-icon";
import { cn } from "@/lib/utils";
import { deleteDistributor } from "@/lib/actions";
import { AddDistributorModal } from "@/components/distributors/AddDistributorModal";
import type { Distributor, DistributorType } from "@/types";

type SortKey = "company_name" | "contacts";
type SortDir = "asc" | "desc";

interface Props {
  distributors: Distributor[];
  specialties: string[];
  defaultType?: DistributorType;
}

export function DistributorsFilter({ distributors: initialDistributors, defaultType }: Props) {
  const [distributors, setDistributors] = useState<Distributor[]>(initialDistributors);
  const [activeTab, setActiveTab] = useState<DistributorType>(defaultType ?? "material");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [sortKey, setSortKey] = useState<SortKey>("company_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      await deleteDistributor(id);
      setDistributors((prev) => prev.filter((v) => v.id !== id));
      setDeletingId(null);
    });
  }

  function handleAddSuccess(d: Distributor) {
    setDistributors((prev) => [...prev, d]);
  }

  const byTab = useMemo(
    () => distributors.filter((v) => v.distributor_type === activeTab),
    [distributors, activeTab]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return byTab.filter(
      (v) =>
        !q ||
        v.company_name.toLowerCase().includes(q) ||
        (v.address ?? "").toLowerCase().includes(q) ||
        v.contacts.some((c) => c.name.toLowerCase().includes(q) || (c.role ?? "").toLowerCase().includes(q))
    );
  }, [byTab, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const cmp =
        sortKey === "company_name"
          ? a.company_name.localeCompare(b.company_name, "ko")
          : a.contacts.length - b.contacts.length;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const thClass = "flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors";

  const allTabs: { type: DistributorType; label: string }[] = [
    { type: "material", label: "마감재 업체" },
    { type: "other", label: "기타 업체" },
  ];

  // 마감재 업체 페이지: 마감재 탭만 / 기타 업체 페이지: 마감재 제외 / 전체: 모두 표시
  const tabs = defaultType === "material"
    ? allTabs.filter((t) => t.type === "material")
    : defaultType === "other"
    ? allTabs.filter((t) => t.type !== "material")
    : allTabs;

  // 마감재 업체 페이지에서만 모달 타입 잠금
  const lockModalType = defaultType === "material";

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">업체</h1>
          <p className="text-muted-foreground mt-1">자재 공급 및 시공 협력 업체 관리</p>
        </div>
        <AddDistributorModal
          key={activeTab}
          onSuccess={handleAddSuccess}
          defaultType={activeTab}
          lockType={lockModalType}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => { setActiveTab(tab.type); setSearch(""); }}
            className={cn(
              "px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.type
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span className={cn(
              "ml-1.5 text-xs rounded-full px-1.5 py-0.5",
              activeTab === tab.type ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {distributors.filter((v) => v.distributor_type === tab.type).length}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="업체명, 주소, 담당자 검색..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-sm text-muted-foreground ml-auto">{sorted.length}개 업체</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort("company_name")} className={thClass}>
                  업체명 <SortIcon active={sortKey === "company_name"} dir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-muted-foreground">주소</span>
              </th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort("contacts")} className={thClass}>
                  담당자 <SortIcon active={sortKey === "contacts"} dir={sortDir} />
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground w-20">상세보기</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground w-12">삭제</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-muted-foreground">
                  {search ? "검색 결과가 없습니다." : "등록된 업체가 없습니다."}
                </td>
              </tr>
            ) : (
              sorted.map((v) => (
                <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium">{v.company_name}</span>
                    {v.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{v.note}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {v.address || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>{v.contacts.length}명</span>
                      {v.contacts.length > 0 && (
                        <span className="text-foreground">
                          {v.contacts.slice(0, 2).map((c) => c.name).join(", ")}
                          {v.contacts.length > 2 && ` 외 ${v.contacts.length - 2}명`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-3" asChild>
                      <Link href={`/distributors/${v.id}`}>상세보기</Link>
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(v.id)}
                      disabled={deletingId === v.id}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
