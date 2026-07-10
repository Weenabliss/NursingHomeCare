const PDFDocument = require("pdfkit");
const fs = require("fs");

const doc = new PDFDocument({ margin: 50 });

doc.pipe(fs.createWriteStream("public/sample-contract.pdf"));

// Use a built-in font
doc.font("Helvetica-Bold").fontSize(20).text("HOP DONG LAO DONG", { align: "center" });
doc.moveDown();

doc.font("Helvetica").fontSize(12);
doc.text("Ben A: VIEN DUONG LAO WEENABLISS");
doc.text("Dai dien: Nguyen Van Giam Doc");
doc.moveDown();

doc.text("Ben B: Nhan vien (Theo danh sach hien tai)");
doc.moveDown();

doc.text("Dieu 1: Thoi han hop dong");
doc.text("- Loai hop dong: Xac dinh thoi han / Vo thoi han");
doc.text("- Ngay bat dau: Theo he thong");
doc.moveDown();

doc.text("Dieu 2: Cong viec va Dia diem lam viec");
doc.text("- Dia diem: Vien duong lao Weenabliss, TP.HCM");
doc.text("- Chuc vu: Theo phan cong trong he thong Weenabliss.");
doc.moveDown();

doc.text("Dieu 3: Quyen loi va Nghia vu");
doc.text("- Muc luong: Theo thoa thuan ban dau.");
doc.text("- Che do BHXH, BHYT theo quy dinh cua phap luat.");
doc.moveDown();

doc.moveDown();
doc.text("Dai dien Ben A                                     Dai dien Ben B", { align: "center" });

doc.end();

console.log("Created public/sample-contract.pdf");
