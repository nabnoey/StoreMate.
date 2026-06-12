import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../redux/store";
import { getUserManagement, updateUserRole, suspendUser, activeUser } from "../../redux/owner/ownerReducer";
import type { User, UserRole } from "../../types/owner";


// ─── Pagination config ───
const ITEMS_PER_PAGE = 10;

/** แปลง role จาก API เป็นภาษาไทย */
const ROLE_LABEL_MAP: Record<UserRole, string> = {
  ADMIN: "เจ้าของร้าน",
  MODERATOR: "พนักงาน",
  USER: "ผู้ใช้งาน",
};

const getRoleLabel = (role: UserRole): string =>
  ROLE_LABEL_MAP[role];

const getRoleBadgeClass = (role: UserRole): string => {
  const norm = role.replace("ROLE_", "");
  switch (norm) {
    case "OWNER":
    case "ADMIN":
      return "bg-[#F3E8FF] text-[#7E22CE]";
    case "MODERATOR":
      return "bg-[#EFF6FF] text-[#1D4ED8]";
    default:
      return "bg-[#F3F4F6] text-[#4B5563]";
  }
};

/** สี Badge ตามสถานะ */
const getStatusBadge = (suspended: boolean) => {
  if (suspended) {
    return {
      label: "ระงับการใช้งาน",
      className: "bg-[#FEE2E2] text-[#DC2626]",
    };
  }
  return {
    label: "ใช้งานได้",
    className: "bg-[#E8F5E9] text-[#2E7D32]",
  };
};

function UserManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { users, total, loading } = useSelector(
    (state: RootState) => state.owner
  );

  // อ่านหน้าปัจจุบันจาก URL (ค่าเริ่มต้นเริ่มที่หน้า 1)
  const [displayPage, setDisplayPage] = useState(() => {
    return Number(searchParams.get("page") || 0);
  });

  // อ่านค่า keyword จาก URL มาเป็นสถานะเริ่มต้น
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get("keyword") || "";
  });
  const [activeKeyword, setActiveKeyword] = useState(() => {
    return searchParams.get("search") || "";
  });

  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      role: selectedUser?.role?.replace("ROLE_", "") === "OWNER"
        ? "ADMIN"
        : (selectedUser?.role?.replace("ROLE_", "") || "USER"),
      suspended: selectedUser?.suspended ? "suspended" : "active",
    },
    onSubmit: async (values) => {
      if (!selectedUser) return;

      try {
        const currentRole = selectedUser.role.replace("ROLE_", "") === "OWNER"
          ? "ADMIN"
          : (selectedUser.role.replace("ROLE_", "") || "USER");
        const currentSuspended = selectedUser.suspended ? "suspended" : "active";

        const roleChanged = values.role !== currentRole;
        const suspendChanged = values.suspended !== currentSuspended;

        if (!roleChanged && !suspendChanged) {
          setSelectedUser(null);
          return;
        }

        const promises: Promise<any>[] = [];

        // 1. Update Role
        if (roleChanged) {
          promises.push(dispatch(updateUserRole({
            userId: selectedUser.id,
            roleName: values.role as UserRole
          })).unwrap());
        }

        // 2. Update Status
        if (suspendChanged) {
          if (values.suspended === "suspended") {
            promises.push(dispatch(suspendUser(selectedUser.id)).unwrap());
          } else {
            promises.push(dispatch(activeUser(selectedUser.id)).unwrap());
          }
        }

        await Promise.all(promises);

        // 3. Show success toast and close modal
        if (roleChanged && suspendChanged) {
          toast.success("อัปเดตบทบาทและสถานะสำเร็จ");
        } else if (roleChanged) {
          toast.success("อัปเดตบทบาทสำเร็จ");
        } else if (suspendChanged) {
          toast.success("อัปเดตสถานะสำเร็จ");
        }

        setSelectedUser(null);
      } catch (error) {
        console.error("Update error:", error);
        toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    },
  });

  // ─── Derived values ───
  const totalDisplayPages = total > 0 ? Math.ceil(total / ITEMS_PER_PAGE) : 0;

  // ─── Stable ref สำหรับ setSearchParams ───
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  // ฟังก์ชันเขียนค่าลง URL
  const updateSearchParams = useCallback(
    (pageValue: number, keywordValue: string) => {
      const params: Record<string, string> = {
        page: String(pageValue),
        size: String(ITEMS_PER_PAGE),
      };

      if (keywordValue.trim()) {
        params.search = keywordValue.trim();
      }

      setSearchParamsRef.current(params, { replace: true });
    },
    []
  );


  useEffect(() => {
    updateSearchParams(displayPage, activeKeyword);
  }, [displayPage, activeKeyword, updateSearchParams]);

  // เรียกดึงข้อมูลจาก API เมื่อ apiPage หรือ activeKeyword มีการเปลี่ยนแปลง
  useEffect(() => {
    dispatch(
      getUserManagement({
        page: displayPage,
        size: ITEMS_PER_PAGE,
        search: activeKeyword.trim(),
      })
    );
  }, [dispatch, activeKeyword]);

  // ฟังก์ชันกดค้นหาจากปุ่ม หรือ Enter
  const handleSearchSubmit = () => {
    setDisplayPage(1);
    setActiveKeyword(searchTerm);
  };

  const displayedUsers = useMemo(() => {
    let result: User[] = [...users];

    if (roleFilter) {
      const matchRoles: string[] = [roleFilter, `ROLE_${roleFilter}`];
      if (roleFilter === "ADMIN" || roleFilter === "OWNER") {
        matchRoles.push("ADMIN");
      }
      result = result.filter((u) => matchRoles.includes(u.role));
    }

    if (statusFilter === "active") {
      result = result.filter((u) => !u.suspended);
    } else if (statusFilter === "suspended") {
      result = result.filter((u) => u.suspended);
    }

    // 3. จัดเรียงลำดับบทบาท (Owner -> Moderator -> User)
    const ROLE_PRIORITY_LOCAL: Record<string, number> = {
      OWNER: 0, ROLE_OWNER: 0, ADMIN: 0, ROLE_ADMIN: 0,
      MODERATOR: 1, ROLE_MODERATOR: 1,
      USER: 2, ROLE_USER: 2,
    };

    result.sort((a, b) => {
      const priorityA = ROLE_PRIORITY_LOCAL[a.role] ?? 99;
      const priorityB = ROLE_PRIORITY_LOCAL[b.role] ?? 99;
      return priorityA - priorityB;
    });

    return result; // ไม่ต้องทำ .slice() แล้ว เพราะได้ข้อมูลตรงจำนวนจาก API มาแล้ว
  }, [users, roleFilter, statusFilter]);

  // ──────────────────────────────────────────────
  // Pagination helpers
  // ──────────────────────────────────────────────
  const handlePageChange = (newDisplayPage: number) => {
    if (newDisplayPage >= 1 && newDisplayPage <= totalDisplayPages) {
      setDisplayPage(newDisplayPage);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setDisplayPage(1);
      setActiveKeyword("");
    }
  };

  const maxVisiblePages = 5;
  const pageNumbers = useMemo(() => {
    if (totalDisplayPages <= 0) return [];

    let start = Math.max(1, displayPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;

    if (end > totalDisplayPages) {
      end = totalDisplayPages;
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalDisplayPages, displayPage]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <HeaderAdmin
        title="จัดการผู้ใช้"
        subtitle="จัดการบัญชีผู้ใช้ บทบาท และสิทธิ์การเข้าถึง"
      />

      <div className="p-6 text-[#374151]">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* ─── Search & Filters ─── */}
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-6">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ค้นหาชื่อผู้ใช้งาน
              </label>
              <div className="relative flex items-center">
                <input
                  id="search-input"
                  type="text"
                  placeholder="ค้นหาโดย ชื่อ หรือ อีเมล แล้วกด Enter หรือปุ่มค้นหา"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="absolute right-2 p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors"
                  title="ค้นหา"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="w-1/2 md:w-40">
                <label className="block text-xs text-gray-500 mb-1.5">
                  กรองโดยบทบาท
                </label>
                <select
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none"
                >
                  <option value="">บทบาท</option>
                  <option value="ADMIN">เจ้าของร้าน</option>
                  <option value="MODERATOR">พนักงาน</option>
                  <option value="USER">ผู้ใช้งาน</option>
                </select>
              </div>

              <div className="w-1/2 md:w-40">
                <label className="block text-xs text-gray-500 mb-1.5">
                  กรองโดยสถานะ
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none"
                >
                  <option value="">สถานะบัญชี</option>
                  <option value="active">ใช้งานได้</option>
                  <option value="suspended">ระงับการใช้งาน</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── Table ─── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm font-medium">
                  <th className="pb-3 font-medium">ชื่อ - นามสกุล</th>
                  <th className="pb-3 font-medium">อีเมล</th>
                  <th className="pb-3 font-medium">เบอร์โทร</th>
                  <th className="pb-3 font-medium">บทบาท</th>
                  <th className="pb-3 font-medium">สถานะ</th>
                  <th className="pb-3 text-right" />
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      กำลังโหลด...
                    </td>
                  </tr>
                )}

                {!loading && displayedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      ไม่พบข้อมูลผู้ใช้
                    </td>
                  </tr>
                )}

                {!loading &&
                  displayedUsers.map((user) => {
                    const status = getStatusBadge(user.suspended);
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 font-normal text-gray-900">
                          {user.name}
                        </td>
                        <td className="py-4 text-gray-500">{user.email}</td>
                        <td className="py-4 text-gray-500">
                          {user.phone ?? "-"}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                          >
                            จัดการ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ─── */}
          {totalDisplayPages > 0 && (
            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button
                id="pagination-prev"
                type="button"
                onClick={() => handlePageChange(displayPage - 1)}
                disabled={displayPage === 1}
                className={`px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${displayPage === 1
                    ? "text-gray-300 cursor-not-allowed border-gray-200"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                ก่อนหน้า
              </button>

              <div className="flex items-center gap-1">
                {pageNumbers.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === displayPage
                        ? "text-blue-600 font-bold bg-transparent"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                id="pagination-next"
                type="button"
                onClick={() => handlePageChange(displayPage + 1)}
                disabled={displayPage >= totalDisplayPages}
                className={`px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${displayPage >= totalDisplayPages
                    ? "text-gray-300 cursor-not-allowed border-gray-200"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                ต่อไป
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Modal จัดการผู้ใช้ ─── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden transform transition-all">
            <div className="bg-[#3B82F6] p-6 text-center">
              <h3 className="text-white text-xl font-bold tracking-wide">บัญชีผู้ใช้</h3>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">ชื่อ - นามสกุล</label>
                    <input
                      type="text"
                      disabled
                      value={selectedUser.name}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">อีเมล</label>
                    <input
                      type="text"
                      disabled
                      value={selectedUser.email}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
                    <input
                      type="text"
                      disabled
                      value={selectedUser.phone ?? "-"}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">บทบาทปัจจุบัน</label>
                      <select
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        className={`w-full px-2 py-2 border-none rounded-lg text-xs font-medium focus:outline-none cursor-pointer ${formik.values.role === "ADMIN" || formik.values.role === "OWNER"
                            ? "bg-[#F3E8FF] text-[#7E22CE]"
                            : formik.values.role === "MODERATOR"
                              ? "bg-[#EFF6FF] text-[#1D4ED8]"
                              : "bg-[#F3F4F6] text-[#4B5563]"
                          }`}
                      >
                        <option value="ADMIN">เจ้าของร้าน</option>
                        <option value="MODERATOR">พนักงาน</option>
                        <option value="USER">ผู้ใช้งาน</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">สถานะบัญชีผู้ใช้</label>
                      <select
                        name="suspended"
                        value={formik.values.suspended}
                        onChange={formik.handleChange}
                        className={`w-full px-2 py-2 border-none rounded-lg text-xs font-medium focus:outline-none cursor-pointer ${formik.values.suspended === "suspended"
                            ? "bg-[#FEE2E2] text-[#DC2626]"
                            : "bg-[#E8F5E9] text-[#2E7D32]"
                          }`}
                      >
                        <option value="active">ใช้งานได้</option>
                        <option value="suspended">ระงับการใช้งาน</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="px-8 py-2 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-8 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserManagement;