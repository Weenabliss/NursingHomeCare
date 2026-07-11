export interface Resident {
  id: string;
  name: string;
  room: string;
  status: "normal" | "attention";
  age: number;
}

export const residentsMockData: Resident[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    room: "Phòng 101",
    status: "normal",
    age: 75,
  },
  {
    id: "2",
    name: "Trần Thị B",
    room: "Phòng 102",
    status: "attention",
    age: 82,
  },
];
