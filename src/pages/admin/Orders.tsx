import HeaderAdmin from '../../components/admin/HeaderAdmin'
import AdminTableCard from '../../components/admin/AdminTableCard'
// import { CiSearch } from "react-icons/ci";


function Stock() {
  return (
    <div>

      <HeaderAdmin
        title="จัดการคำสั่งซื้อ"
        subtitle="ตรวจสอบ ติดตามสถานะ และดำเนินการจัดการคำสั่งซื้อ
"
      />

      <div className="p-6 text-[#374151] ">
        <AdminTableCard title="รายการสินค้า" showAddButton={true}></AdminTableCard>
    
            
   

      
      </div>

    </div>
  )
}

export default Stock
