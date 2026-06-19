# คู่มือสำหรับ AI Agent (AGENT.md)

ยินดีต้อนรับ AI Agent เข้าสู่พื้นที่ทำงานของโครงการ **Zanacrm (OMS - Omni-Channel Order Management System)**  
เอกสารฉบับนี้รวบรวมข้อมูลเกี่ยวกับสภาพแวดล้อม คลังสกิล (Skills) ทั้งหมด และการเลือกใช้สกิลในการวางแผนพัฒนาโครงการในเฟสถัดไป

---

## 🛠️ ข้อมูลโครงการและเทคโนโลยี (Project Profile)

- **Workspace Root**: [Zanacrm Workspace](file:///f:/0P/Zanacrm)
- **Framework**: Next.js 15 (App Router)
- **ภาษา**: TypeScript
- **CSS Framework**: Tailwind CSS + Custom Design Tokens (สไตล์แบบ Calm Control Center)
- **สเตตัสปัจจุบัน**: ระบบต้นแบบแดชบอร์ดและโมดูลหลักพร้อมใช้งาน (~96% Production Ready) รายละเอียดเพิ่มเติมดูได้ที่ [README.md](file:///f:/0P/Zanacrm/README.md)

---

## 📚 คลังสกิลทั้งหมดในโครงการ (Skill Inventory)

คลังสกิลของระบบแบ่งออกเป็น 3 หมวดหมู่หลักตามลักษณะการใช้งานและแหล่งที่มา:

### 1. กระบวนการและการทำงานของ Agent (โฟลเดอร์ [.agent/skills](file:///f:/0P/Zanacrm/.agent/skills))
เน้นไปที่ขั้นตอนการทำงาน (Workflow), การทดสอบ (Testing), การดีบัก และการจัดการโค้ด

| ชื่อสกิล | เส้นทางไฟล์ | รายละเอียดและหน้าที่การทำงาน |
|:---|:---|:---|
| **brainstorming** | [brainstorming/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/brainstorming/SKILL.md) | **ต้องใช้ก่อนเริ่มงานสร้างสรรค์ทุกครั้ง** เพื่อสำรวจความต้องการและหาแนวทางที่เหมาะสมที่สุด |
| **dispatching-parallel-agents** | [dispatching-parallel-agents/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/dispatching-parallel-agents/SKILL.md) | ใช้เมื่อมีงานที่เป็นอิสระต่อกันตั้งแต่ 2 งานขึ้นไปที่สามารถแยกกันทำแบบขนานได้ |
| **executing-plans** | [executing-plans/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/executing-plans/SKILL.md) | ใช้เมื่อได้รับแผนการพัฒนาเพื่อลงมือปฏิบัติและตรวจสอบความคืบหน้าอย่างเป็นระบบ |
| **finishing-a-development-branch** | [finishing-a-development-branch/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/finishing-a-development-branch/SKILL.md) | ใช้เมื่อเขียนโค้ดและทดสอบเสร็จสมบูรณ์ เพื่อเตรียมผสานโค้ด (Merge) หรือเปิด PR |
| **receiving-code-review** | [receiving-code-review/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/receiving-code-review/SKILL.md) | ใช้เมื่อได้รับผลการรีวิวโค้ด เพื่อนำมาปรับปรุงด้วยความเข้มงวดเชิงเทคนิค |
| **requesting-code-review** | [requesting-code-review/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/requesting-code-review/SKILL.md) | ใช้สำหรับส่งโค้ดให้รีวิวก่อนจะคอมมิตหรือผสานโค้ดเข้ากิ่งหลัก |
| **subagent-driven-development** | [subagent-driven-development/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/subagent-driven-development/SKILL.md) | ใช้สำหรับมอบหมายงานย่อยแบบเป็นเอกเทศให้ Agent ผู้ช่วยทำในเซสชันเดียวกัน |
| **systematic-debugging** | [systematic-debugging/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/systematic-debugging/SKILL.md) | **ต้องใช้ทันทีเมื่อเจอบั๊กหรือรันเทสต์ไม่ผ่าน** เพื่อสืบสวนหาสาเหตุอย่างมีระเบียบ |
| **test-driven-development** | [test-driven-development/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/test-driven-development/SKILL.md) | ใช้พัฒนาฟีเจอร์หรือแก้ไขบั๊กโดยเน้นการเขียนชุดทดสอบ (Unit Test) ก่อนเขียนโค้ดจริง |
| **using-git-worktrees** | [using-git-worktrees/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/using-git-worktrees/SKILL.md) | ใช้จัดการแยกพื้นที่ทำงานเพื่อไม่ให้รบกวนกันด้วย Git Worktree |
| **using-superpowers** | [using-superpowers/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/using-superpowers/SKILL.md) | ใช้กำหนดกรอบการเรียกใช้และเปิดใช้งานสกิลในทุกเซสชันอย่างถูกต้อง |
| **verification-before-completion** | [verification-before-completion/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/verification-before-completion/SKILL.md) | **ต้องใช้ก่อนประกาศว่างานเสร็จ** เพื่อรันคอมไพล์ รันเทสต์ และตรวจสอบความถูกต้อง |
| **writing-plans** | [writing-plans/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/writing-plans/SKILL.md) | ใช้เขียนแผนการดำเนินงาน (Implementation Plan) ก่อนเริ่มพัฒนาฟีเจอร์ซับซ้อน |
| **writing-skills** | [writing-skills/SKILL.md](file:///f:/0P/Zanacrm/.agent/skills/writing-skills/SKILL.md) | ใช้เมื่อสร้างสกิลใหม่หรือปรับปรุงสเปกโครงสร้างของสกิลที่มีอยู่ |

---

### 2. การวางแผนและระบบการออกแบบ (โฟลเดอร์ [.github/skills](file:///f:/0P/Zanacrm/.github/skills))
เน้นการสร้างเอกสาร สเปก สถาปัตยกรรม การเชื่อมต่อกับ Figma และการทบทวนคุณภาพงานออกแบบหน้าเว็บ

| ชื่อสกิล | เส้นทางไฟล์ | รายละเอียดและหน้าที่การทำงาน |
|:---|:---|:---|
| **architecture-blueprint-generator** | [architecture-blueprint-generator/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/architecture-blueprint-generator/SKILL.md) | วิเคราะห์โค้ดเบสเพื่อสร้างพิมพ์เขียวสถาปัตยกรรม (Architecture Blueprint) |
| **canvas-design** | [canvas-design/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/canvas-design/SKILL.md) | สร้างสุนทรียศาสตร์ทางศิลปะและเอกสารดีไซน์ในรูปแบบไฟล์ PDF หรือ PNG ตามปรัชญาการออกแบบ |
| **figma-create-design-system-rules** | [figma-create-design-system-rules/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/figma-create-design-system-rules/SKILL.md) | สร้างและบันทึกกฎของระบบการออกแบบ (Design System) ในไฟล์ CLAUDE.md หรือ AGENTS.md |
| **figma-generate-design** | [figma-generate-design/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/figma-generate-design/SKILL.md) | แปลงโครงสร้างโค้ดหน้าเว็บกลับเป็นเฟรมหน้าจอและส่วนประกอบใน Figma โดยอ้างอิง Tokens |
| **figma-generate-library** | [figma-generate-library/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/figma-generate-library/SKILL.md) | วางรากฐานและสร้าง component library หรือ variables ใน Figma อิงจากโค้ด |
| **figma-implement-design** | [figma-implement-design/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/figma-implement-design/SKILL.md) | ดึง Context และภาพหน้าจอจาก Figma ผ่าน MCP Server มาพัฒนาเป็นโค้ดในโปรเจกต์ 1:1 |
| **refactor** | [refactor/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/refactor/SKILL.md) | ปรับปรุงโครงสร้าง ความสะอาด และความปลอดภัยของประเภทข้อมูล โดยไม่เปลี่ยนแปลงพฤติกรรมโค้ด |
| **refactor-plan** | [refactor-plan/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/refactor-plan/SKILL.md) | จัดทำแผนการทำงานก่อนลงมือ Refactor โค้ดหลายไฟล์ เพื่อลดความเสี่ยงโค้ดพัง |
| **review-and-refactor** | [review-and-refactor/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/review-and-refactor/SKILL.md) | รันการตรวจสอบคุณภาพโค้ดตามเช็กลิสต์แล้วทำการปรับแก้ตามคำสั่งรีวิว |
| **update-implementation-plan** | [update-implementation-plan/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/update-implementation-plan/SKILL.md) | อัปเดตไฟล์แผนการทำงานในโฟลเดอร์ `/plan/` ให้สอดคล้องกับข้อกำหนดใหม่ตามเทมเพลตมาตรฐาน |
| **update-markdown-file-index** | [update-markdown-file-index/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/update-markdown-file-index/SKILL.md) | อัปเดตรายการดัชนี (Index/Table) ของไฟล์ในเอกสาร Markdown อ้างอิงโฟลเดอร์เป้าหมาย |
| **update-specification** | [update-specification/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/update-specification/SKILL.md) | เขียน/อัปเดตสเปกความต้องการ (Specification) ในโฟลเดอร์ `/spec/` ให้เหมาะสมกับการใช้งานของ AI |
| **web-design-reviewer** | [web-design-reviewer/SKILL.md](file:///f:/0P/Zanacrm/.github/skills/web-design-reviewer/SKILL.md) | ตรวจจับและวิเคราะห์บั๊กของ UI หน้าเว็บด้วยเบราว์เซอร์อัตโนมัติ (Playwright) และทำการแก้ไขโค้ด |

---

### 3. สกิลภายนอก/ส่วนกลางของระบบ (Global Skills)
สกิลภายนอกที่อยู่ในระบบของ Agent ซึ่งสามารถเรียกใช้งานได้เมื่อมีงานด้านดีไซน์ระดับลึก

| ชื่อสกิล | เส้นทางไฟล์ | รายละเอียดและหน้าที่การทำงาน |
|:---|:---|:---|
| **frontend-design** | [frontend-design/SKILL.md](file:///c:/Users/x_ser/.agents/skills/frontend-design/SKILL.md) | คำแนะนำด้านการออกแบบเชิงสุนทรียศาสตร์และการจัดวางองค์ประกอบศิลป์ ช่วยให้การเลือกคู่สี ฟอนต์ และการจัดเลย์เอาต์มีอัตลักษณ์เฉพาะตัวของแบรนด์ หลีกเลี่ยงสี/เลย์เอาต์ที่เป็น AI Default |

---

## 🎨 การเลือกสกิลเฉพาะทางสำหรับ Frontend Design ในโครงการ

เมื่อต้องจัดการงานออกแบบ พัฒนาส่วนหน้า หรือตรวจสอบคุณภาพหน้าเว็บ (Frontend Design Tasks) คลังสกิลในโครงการมีสกิลที่เกี่ยวข้องโดยตรง 6 รายการ ซึ่งต้องเลือกนำมาใช้ตามบริบทของงานดังนี้:

### 1. งานปรับปรุง ปรับแก้ และตรวจสอบดีไซน์หน้าเว็บให้สมบูรณ์ (Visual QA & Review)
- **สกิลหลัก**: [web-design-reviewer](file:///f:/0P/Zanacrm/.github/skills/web-design-reviewer/SKILL.md)
- **บริบทที่เลือกใช้**: เมื่อทดสอบการแสดงผลในหน้าจอขนาดต่างๆ (Responsive) ตรวจจับปัญหาการล้นกรอบ (Element Overflow) ข้อความถูกตัด (Text Clipping) หรือปัญหา Contrast และการนำทางด้วยคีย์บอร์ด (Accessibility) โดยสกิลนี้จะนำทาง Playwright เข้ามาถ่ายสกรีนช็อตและแนะนำแนวทางแก้ไขโค้ดในจุดที่ผิดพลาดทันที

### 2. การสร้างโค้ดหน้าเว็บจากแบบร่างดีไซน์ (Design-to-Code Implementation)
- **สกิลหลัก**: [figma-implement-design](file:///f:/0P/Zanacrm/.github/skills/figma-implement-design/SKILL.md)
- **บริบทที่เลือกใช้**: เมื่อฝ่ายดีไซเนอร์ส่งลิงก์หน้าจอ Figma (Frame/Node ID) มาให้ สกิลนี้จะมีหน้าที่ดึงโครงสร้าง CSS/HTML และจัดลำดับขั้นตอนการเปลี่ยนดีไซน์เป็นส่วนประกอบ (Components) ใน Next.js ด้วยความแม่นยำสูงแบบ 1:1

### 3. การวางกฎเกณฑ์และโทเค็นการออกแบบ (Design Tokens & Rules Setup)
- **สกิลหลัก**: [figma-create-design-system-rules](file:///f:/0P/Zanacrm/.github/skills/figma-create-design-system-rules/SKILL.md)
- **บริบทที่เลือกใช้**: เมื่อต้องการกำหนดขอบเขตของโทเค็น (เช่น สเกล Spacing, สีหลัก, สีสถานะ, ฟอนต์) และบันทึกลงในคู่มือพัฒนาเพื่อควบคุมไม่ให้เกิดการฮาร์ดโค้ดค่าดิบลงในคอมโพเนนต์

### 4. การจัดการเฟรมดีไซน์และไลบรารีใน Figma จากโค้ด (Code-to-Design Sync)
- **สกิลหลัก**: [figma-generate-design](file:///f:/0P/Zanacrm/.github/skills/figma-generate-design/SKILL.md) และ [figma-generate-library](file:///f:/0P/Zanacrm/.github/skills/figma-generate-library/SKILL.md)
- **บริบทที่เลือกใช้**: เมื่อมีการพัฒนาส่วนติดต่อผู้ใช้งานใหม่ขึ้นมาในโค้ด และต้องการแปลงโครงสร้างหน้านั้นรวมถึง UI Tokens กลับเข้าไปบันทึกไว้ใน Figma เพื่อให้แบบร่างและระบบจริงตรงกัน (Single Source of Truth)

### 5. การวางกรอบสุนทรียศาสตร์และการใช้ศิลปะในการจัดหน้าเว็บ (Aesthetic Philosophy)
- **สกิลหลัก**: [canvas-design](file:///f:/0P/Zanacrm/.github/skills/canvas-design/SKILL.md)
- **บริบทที่เลือกใช้**: เมื่อต้องทำเอกสารชี้แจงแนวทางการออกแบบ (Design Manifesto) หรือภาพรวมธีมศิลปะของระบบการทำงาน (Calm Control Center) เพื่อไม่ให้สไตล์หลุดกรอบและคงความสวยงามสม่ำเสมอ

---

## 🎯 แผนการเลือกใช้สกิลสำหรับงานพัฒนาระบบอื่นในเฟสถัดไป

สำหรับการพัฒนาฟีเจอร์อื่นๆ นอกเหนือจากงานออกแบบส่วนหน้า ให้ใช้สกิลประกอบดังต่อไปนี้:

- **เชื่อมต่อ Socket.io / Supabase Realtime**: ใช้ [update-specification](file:///f:/0P/Zanacrm/.github/skills/update-specification/SKILL.md) คุมข้อตกลง payload และ [update-implementation-plan](file:///f:/0P/Zanacrm/.github/skills/update-implementation-plan/SKILL.md) คุมแผนงาน
- **เพิ่ม Zustand (Global State)**: ใช้ [architecture-blueprint-generator](file:///f:/0P/Zanacrm/.github/skills/architecture-blueprint-generator/SKILL.md) และ [refactor-plan](file:///f:/0P/Zanacrm/.github/skills/refactor-plan/SKILL.md) เพื่อคุมขอบเขต State Store
- **เชื่อม API & Database จริง**: ใช้ [systematic-debugging](file:///f:/0P/Zanacrm/.agent/skills/systematic-debugging/SKILL.md) ควบคู่เพื่อสืบหาข้อผิดพลาดทาง Network
- **เพิ่มชุดทดสอบ (Unit Testing)**: ใช้ [test-driven-development](file:///f:/0P/Zanacrm/.agent/skills/test-driven-development/SKILL.md) และ [verification-before-completion](file:///f:/0P/Zanacrm/.agent/skills/verification-before-completion/SKILL.md) คุมกระบวนการ

---

## 🚦 กฎเหล็กและลำดับความสำคัญของชุดคำสั่งสำหรับ AI Agent

เมื่อปฏิบัติงานในโปรเจกต์นี้ ให้ยึดลำดับความสำคัญของกฎ (Instruction Priority) ดังต่อไปนี้:

1. **คำสั่งของสมาชิกหรือข้อความในโปรเจกต์** (เช่น direct requests, แผนพัฒนา) — มีผลสูงสุด
2. **คำสั่งจากคลังสกิล (Skills)** — เมื่อเรียกใช้งานผ่าน `view_file` สกิลจะทับกฎการทำงานพื้นฐาน
3. **คำสั่งดีฟอลต์ของโมเดล** — ลำดับความสำคัญต่ำสุด

> **คำแนะนำการเปิดใช้งานสกิล**:
> ในการเรียกใช้คลังสกิลข้างต้น ให้ใช้เครื่องมือ `view_file` ไปยังเส้นทาง `SKILL.md` และระบุพารามิเตอร์ `IsSkillFile: true` เสมอ เพื่อให้ระบบนำทางความจำของโมเดลเปิดใช้งานเนื้อหาสกิลเหล่านั้นอย่างสมบูรณ์

### ลำดับก่อนเริ่ม Implement

ก่อนลงมือแก้โค้ดทุกครั้ง Agent ต้องทำตามลำดับนี้:

1. อ่านและทำตาม **Rules ของ Workspace/Project** ก่อนเสมอ
2. อ่าน `AGENT.md` เพื่อเข้าใจโปรเจกต์ สกิลที่เกี่ยวข้อง และข้อจำกัดหลัก
3. หากมีแผนงานใน `docs/superpowers/plans/` ให้อ่านแผนให้ครบก่อนเริ่มแก้ไฟล์
4. เลือกและเปิดใช้สกิลที่ตรงกับงาน เช่น `executing-plans`, `test-driven-development`, `systematic-debugging`, หรือ `web-design-reviewer`
5. สรุปขอบเขตงานสั้น ๆ แล้วจึงเริ่ม implement

### Auto-Accept Guardrails

ให้ Agent ดำเนินงานตามปกติโดยไม่ถามซ้ำสำหรับงานที่ปลอดภัย เช่น อ่านไฟล์ แก้ไฟล์ใน workspace และรันคำสั่งตรวจสอบอย่าง `typecheck`, `lint`, `test`, `build`

ต้องหยุดถามก่อนเสมอเมื่อจะทำสิ่งต่อไปนี้:

- ลบไฟล์หรือโฟลเดอร์
- รันคำสั่งลบแบบ recursive เช่น `rm -rf` หรือ `Remove-Item -Recurse`
- แก้ `.env`, secret, token, credential, SSH key หรือ config ที่เกี่ยวกับ auth
- ติดตั้ง package หรือแก้ lockfile โดยไม่ได้รับอนุญาต
- รัน database migration หรือ destructive SQL
- ใช้ `git push`, `git reset`, `git checkout` หรือ force operation
- รันคำสั่งนอก workspace
- รันคำสั่ง admin/sudo หรือคำสั่งที่ย้อนกลับไม่ได้
