import { useState } from "react";

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""); // ใช้เป็น Username หรือ Email
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState({ show: false, message: "" });

  const API_URL = "http://localhost:3000/users";

  const showSuccess = (message) => {
    setSuccessPopup({ show: true, message });
    setTimeout(() => {
      setSuccessPopup({ show: false, message: "" });
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess(`ยินดีต้อนรับ ${data.user?.name || data.user?.username || email}`);
        if (onLogin) onLogin(data.user);
      } else {
        setError(data.message || "Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !newPassword) {
      setError("กรุณากรอกอีเมลและรหัสผ่านใหม่");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess("รีเซ็ตรหัสผ่านสำเร็จ!");
        setMode("login");
        setPassword("");
      } else {
        setError(data.message || "รีเซ็ตรหัสผ่านไม่สำเร็จ");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4 relative">
      {successPopup.show && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center">
          <span className="font-semibold">{successPopup.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-10 border-t-8 border-blue-400">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {mode === "login" ? "เข้าสู่ระบบ TechJob" : "ตั้งรหัสผ่านใหม่"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <div className="space-y-6">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:ring-blue-400"
              placeholder="Username หรือ Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:ring-blue-400"
              placeholder="Password"
            />
            <button onClick={handleLogin} disabled={isLoading} className="w-full text-white py-3 rounded-lg font-bold bg-blue-400 hover:bg-blue-500 disabled:opacity-50">
              {isLoading ? "กำลังตรวจสอบ..." : "Login"}
            </button>
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => setMode("forgot")}>
                ลืมรหัสผ่าน?
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email ที่ลงทะเบียนไว้"
              className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="รหัสผ่านใหม่"
              className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg" />
            <button onClick={handleForgotPassword} disabled={isLoading} className="w-full text-white py-3 rounded-lg font-bold bg-yellow-500 hover:bg-yellow-600">
              ยืนยันการเปลี่ยนรหัสผ่าน
            </button>
            <div className="text-center">
              <button className="text-gray-500 text-sm" onClick={() => setMode("login")}>
                ย้อนกลับไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;