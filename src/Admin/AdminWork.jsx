import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

const AdminWork = () => {
  const [selectedWork, setSelectedWork] = useState(null);
  const [worksToApprove, setWorksToApprove] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงใบงานทั้งหมดจาก API
  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/works/getAll`);
      const data = await res.json();
      setWorksToApprove(data.works || []);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleRowClick = (work) => {
    setSelectedWork(work);
  };

  // อนุมัติ = เปลี่ยนสถานะเป็น เสร็จสิ้น
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/works/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'เสร็จสิ้น' })
      });
      if (res.ok) {
        await fetchWorks();
        if (selectedWork?.work_id === id) {
          setSelectedWork({ ...selectedWork, status: 'เสร็จสิ้น' });
        }
        alert(`✅ งาน #${id} ได้รับการอนุมัติแล้ว`);
      } else {
        alert(`❌ ไม่สามารถอนุมัติงาน #${id} ได้`);
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  // ปฏิเสธ = เปลี่ยนสถานะเป็น ส่งกลับแก้ไข
  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API_URL}/works/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ส่งกลับแก้ไข' })
      });
      if (res.ok) {
        await fetchWorks();
        setSelectedWork(null);
        alert(`❌ งาน #${id} ถูกตีกลับแล้ว`);
      } else {
        alert(`❌ ไม่สามารถตีกลับงาน #${id} ได้`);
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const completedCount = worksToApprove.filter(w => w.status === 'เสร็จสิ้น').length;
  const pendingCount = worksToApprove.filter(w => w.status === 'รอตรวจงาน').length;

  if (loading) return <div className="p-4 text-center">กำลังโหลด...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4" style={{ width: '100%', minHeight: '100vh', marginLeft: '14rem' }}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2 flex items-center">
          <i className="bi bi-file-earmark-plus-fill mx-3"></i>
          จัดการใบงาน
        </h3>
        <p className="text-gray-600">จัดการและตรวจสอบใบงานทั้งหมดในระบบ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">ใบงานทั้งหมด</p>
              <h3 className="text-2xl font-bold">{worksToApprove.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">เสร็จสิ้น</p>
              <h3 className="text-2xl font-bold">{completedCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">รอตรวจงาน</p>
              <h3 className="text-2xl font-bold">{pendingCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table */}
        <div className={selectedWork ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto" style={{ maxHeight: '60vh' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">รหัส</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่องาน</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ประเภท</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">วันที่</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานที่</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {worksToApprove.length > 0 ? (
                    worksToApprove.map((work) => (
                      <tr
                        key={work.work_id}
                        onClick={() => handleRowClick(work)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${selectedWork?.work_id === work.work_id ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            #{work.work_id}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="font-semibold text-gray-900">{work.job_name}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {work.job_type || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">
                          {work.start_date ? new Date(work.start_date).toLocaleDateString('th-TH') : '-'}
                        </td>
                        <td className="px-4 py-3 text-left text-sm text-gray-600">
                          {work.location || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            work.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-800' :
                            work.status === 'รอตรวจงาน' ? 'bg-yellow-100 text-yellow-800' :
                            work.status === 'ส่งกลับแก้ไข' ? 'bg-red-100 text-red-800' :
                            work.status === 'กำลังดำเนินการ' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {work.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                        <p className="text-lg font-medium">ไม่มีใบงาน</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedWork && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm sticky top-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h5 className="font-bold">รายละเอียดใบงาน #{selectedWork.work_id}</h5>
                <button onClick={() => setSelectedWork(null)} className="text-white hover:bg-blue-700 rounded px-2 py-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">ชื่องาน</p>
                  <p className="font-semibold">{selectedWork.job_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ลูกค้า</p>
                  <p className="font-semibold">{selectedWork.customer_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ประเภทงาน</p>
                  <p className="font-semibold">{selectedWork.job_type || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">รายละเอียด</p>
                  <p className="font-semibold">{selectedWork.job_detail || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">สถานที่</p>
                  <p className="font-semibold">{selectedWork.location || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">วันที่เริ่มงาน</p>
                  <p className="font-semibold">
                    {selectedWork.start_date ? new Date(selectedWork.start_date).toLocaleDateString('th-TH') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">สถานะ</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedWork.status === 'เสร็จสิ้น' ? 'bg-green-100 text-green-800' :
                    selectedWork.status === 'รอตรวจงาน' ? 'bg-yellow-100 text-yellow-800' :
                    selectedWork.status === 'ส่งกลับแก้ไข' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedWork.status}
                  </span>
                </div>

                <div className="mt-6 space-y-2 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedWork.work_id)}
                    className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    อนุมัติงาน
                  </button>
                  <button
                    onClick={() => handleReject(selectedWork.work_id)}
                    className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    ไม่อนุมัติ / ตีกลับ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWork;