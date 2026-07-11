export const BASE_WAGE = 1800000;

export interface AllowanceOption {
  id: string;
  name: string;
  amount: number;
}

export const ALLOWANCE_OPTIONS: AllowanceOption[] = [
  { id: "AN_TRUA", name: "Phụ cấp ăn trưa", amount: 730000 },
  { id: "XANG_XE", name: "Phụ cấp xăng xe", amount: 500000 },
  { id: "DIEN_THOAI", name: "Phụ cấp điện thoại", amount: 300000 },
  { id: "DOC_HAI", name: "Phụ cấp độc hại", amount: 1000000 },
  { id: "CON_NHO", name: "Phụ cấp nuôi con nhỏ", amount: 500000 },
];

export interface BankOption {
  code: string;
  name: string;
  shortName: string;
  logo: string;
}

export const BANKS: BankOption[] = [
  { code: "VCB", name: "Ngân hàng TMCP Ngoại thương Việt Nam", shortName: "Vietcombank", logo: "https://cdn.vietqr.io/img/VCB.png" },
  { code: "TCB", name: "Ngân hàng TMCP Kỹ thương Việt Nam", shortName: "Techcombank", logo: "https://cdn.vietqr.io/img/TCB.png" },
  { code: "MB", name: "Ngân hàng TMCP Quân đội", shortName: "MBBank", logo: "https://cdn.vietqr.io/img/MB.png" },
  { code: "ACB", name: "Ngân hàng TMCP Á Châu", shortName: "ACB", logo: "https://cdn.vietqr.io/img/ACB.png" },
  { code: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", shortName: "BIDV", logo: "https://cdn.vietqr.io/img/BIDV.png" },
  { code: "ICB", name: "Ngân hàng TMCP Công thương Việt Nam", shortName: "VietinBank", logo: "https://cdn.vietqr.io/img/ICB.png" },
  { code: "VBA", name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam", shortName: "Agribank", logo: "https://cdn.vietqr.io/img/VBA.png" },
  { code: "VIB", name: "Ngân hàng TMCP Quốc tế Việt Nam", shortName: "VIB", logo: "https://cdn.vietqr.io/img/VIB.png" },
  { code: "TPB", name: "Ngân hàng TMCP Tiên Phong", shortName: "TPBank", logo: "https://cdn.vietqr.io/img/TPB.png" },
  { code: "VPB", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", shortName: "VPBank", logo: "https://cdn.vietqr.io/img/VPB.png" },
];
