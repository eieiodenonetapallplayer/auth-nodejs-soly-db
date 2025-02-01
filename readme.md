# ระบบ Authentication API

## รายละเอียดโปรเจค
โปรเจคนี้เป็นระบบ Authentication (การยืนยันตัวตน) ที่สร้างขึ้นเพื่อให้ผู้ใช้งานสามารถสมัครสมาชิกและเข้าสู่ระบบได้อย่างปลอดภัย โดยใช้เทคโนโลยี JWT (JSON Web Token) และการเข้ารหัสรหัสผ่านด้วย Bcrypt เพื่อความปลอดภัยสูงสุดของข้อมูลผู้ใช้

### ฟีเจอร์หลัก
- **การสมัครสมาชิก (Registration):**
  - ผู้ใช้สามารถสมัครสมาชิกโดยกรอกชื่อผู้ใช้ (username), อีเมล (email), และรหัสผ่าน (password)
  - มีการตรวจสอบรูปแบบอีเมลและการยืนยันรหัสผ่าน
  - เก็บข้อมูลรหัสผ่านในรูปแบบที่เข้ารหัส (Hashed Password)
  - ระบบสร้าง Token เพื่อให้ผู้ใช้สามารถใช้งาน API ได้หลังสมัครสมาชิกสำเร็จ

- **การเข้าสู่ระบบ (Login):**
  - ผู้ใช้สามารถเข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน
  - ระบบตรวจสอบชื่อผู้ใช้และรหัสผ่าน
  - หากข้อมูลถูกต้อง ระบบจะสร้าง Token และส่งกลับในรูปแบบ Cookie

- **การออกจากระบบ (Logout):**
  - ผู้ใช้สามารถออกจากระบบได้
  - ระบบจะลบ Cookie Token และตอบกลับข้อความยืนยันการออกจากระบบ

- **การจัดการข้อมูลผู้ใช้:**
  - อ่านและเขียนข้อมูลผู้ใช้จากไฟล์ JSON เพื่อความสะดวกในการจัดการข้อมูลโดยไม่ต้องใช้ฐานข้อมูล

---

## โครงสร้างโปรเจค

```
project/
├── server.js                // ไฟล์หลักของเซิร์ฟเวอร์
├── routes/
│   ├── auth.js             // เส้นทาง API การสมัครสมาชิกและเข้าสู่ระบบ
│   ├── logout.js
├── sys/
│   ├── local/
│       ├── userLocal.json  // ไฟล์เก็บข้อมูลผู้ใช้
├── .env                     // ไฟล์เก็บค่า SECRET_JWT
```

---

## การติดตั้งและใช้งาน

1. **Clone โปรเจคนี้**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install
   ```

3. **ตั้งค่าไฟล์ .env**
   สร้างไฟล์ `.env` และเพิ่มค่า:
   ```env
   SECRET_JWT=your_secret_key
   ```

4. **เริ่มเซิร์ฟเวอร์**
   ```bash
   node server.js
   ```

5. **ใช้งาน API**
   - สมัครสมาชิก: `POST /register`
   - เข้าสู่ระบบ: `POST /login`
   - ออกจากระบบ: `GET /logout`

---

## การติดต่อ
- อีเมล: center@proleakinnovation.com
- Discord: [https://discord.gg/FfGmbTERBs](https://discord.gg/FfGmbTERBs)

---

## เครดิต
โปรเจคนี้พัฒนาโดย **PROLEAK INNOVATION** เพื่อการเรียนรู้และการพัฒนาระบบที่ปลอดภัยยิ่งขึ้น