import HeaderAdmin from '../../components/admin/HeaderAdmin'
import AdminTableCard from '../../components/admin/AdminTableCard'
// import { CiSearch } from "react-icons/ci";


function Stock() {
  return (
    <div>

      <HeaderAdmin
        title="จัดการสินค้าในคลัง"
        subtitle="เพิ่ม แก้ไข ลบสินค้า และจัดการสต๊อก"
      />

      <div className="p-6 text-[#374151] ">
        <AdminTableCard title="รายการสินค้า" showAddButton={true}></AdminTableCard>
    
            
   

      
      </div>

    </div>
  )
}

export default Stock
