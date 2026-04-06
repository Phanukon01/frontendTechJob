import { useState } from "react";
import { authUsers } from "../data/dataCore.jsx";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkUserType = (username) => {
    const user = authUsers[username.toLowerCase()];
    return user ? user.type : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = authUsers[username.toLowerCase()];
      if (user && user.password === password) {
        alert(`เข้าสู่ระบบสำเร็จ!\nสวัสดี ${user.fullName}\nประเภท: ${user.type}`);
        if (onLogin) onLogin(username, user.type);
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
      setIsLoading(false);
    }, 1000);
  };

  const currentUserType = username ? checkUserType(username) : null;

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      {/* โลโก้ TechJob ทางซ้าย */}
      <div className="flex items-center m-20">
        <div className="text-6xl font-normal text-gray-800">
          Tech
        </div>
        <div className="text-6xl text-white text-center bg-blue-400 rounded-full h-32 w-32 flex items-center justify-center ml-2 shadow-lg">
          Job
        </div>
      </div>

      {/* กล่องฟอร์ม Login */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-10 border-t-8 border-blue-400">

        {/* ส่วนปุ่มสลับ Admin/User (ใช้สำหรับแสดง UserType ที่ค้นพบ)
        {/* ส่วนปุ่มสลับ Admin/User */}
        <div className="flex bg-blue-50 p-1 rounded-full mb-2">
          {/* Manager Button */}
          <div className={`w-1/2 py-2 text-sm font-semibold transition text-center
              ${currentUserType === 'manager'
              ? 'bg-blue-400 text-white shadow-md rounded-l-full'
              : 'text-gray-600 rounded-l-full'
            }`}>
            Manager
          </div>
          {/* Admin Button */}
          <div className={`w-1/2 py-2 text-sm font-semibold transition text-center
              ${currentUserType === 'admin'
              ? 'bg-blue-400 text-white shadow-md rounded-r-full'
              : 'text-gray-600 rounded-r-full'
            }`}>
            Admin
          </div>
        </div>
        <div className="flex bg-blue-50 p-1 rounded-full mb-8">
          {/* Leader Button */}
          <div className={`w-1/2 py-2 text-sm font-semibold transition text-center
              ${currentUserType === 'leader'
              ? 'bg-blue-400 text-white shadow-md rounded-l-full'
              : 'text-gray-600 rounded-l-full'
            }`}>
            Leader
          </div>
          {/* User Button */}
          <div className={`w-1/2 py-2 text-sm font-semibold transition text-center
              ${currentUserType == 'user'
              ? 'bg-blue-400 text-white shadow-md rounded-r-full'
              : 'text-gray-600 rounded-r-full'
            }`}>
            User
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">
            เข้าสู่ระบบ TechJob
          </h2>
        </div>

        {/* แสดง Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Input Username (เปลี่ยนจาก ชื่อผู้ใช้ เป็น Email) */}
          <div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500"
              placeholder="Email(แต่ตัวอย่างยังใช้เป็นUsername)"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Input Password */}
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500"
              placeholder="Password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* ปุ่ม Login */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed bg-blue-200 hover:bg-blue-500 text-gray-700 border border-gray-300 shadow-sm`}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </div>

        {/* ส่วนที่ไม่ได้แสดงในภาพ แต่เก็บไว้เพื่อใช้งานได้ */}
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium" onClick={() => alert("ยังไม่ได้ทำ")}>
            ลืมรหัสผ่าน?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;