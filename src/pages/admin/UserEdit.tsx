import HeaderAdmin from "../../components/admin/HeaderAdmin";
import AdminTableCard from "../../components/admin/AdminTableCard";

function UserEdit() {
  return (
    <div>
      <HeaderAdmin
        title="จัดการผู้ใช้"
        subtitle="จัดการบัญชีผู้ใช้ บทบาท และสิทธิ์การเข้าถึง"
      />

      <div className="p-6 text-[#374151] ">
        <AdminTableCard
          title="รายการสินค้า"
          showAddButton={true}
        ></AdminTableCard>
      </div>
    </div>
  );
}

export default UserEdit;
