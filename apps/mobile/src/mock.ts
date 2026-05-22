export interface MockUpload {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  tags: string[];
  location: string | null;
  created_at: string;
}

export const MOCK_UPLOADS: MockUpload[] = [
  {
    id: "1",
    title: "Скрип снега, ул. Ленина",
    status: "approved",
    tags: ["снег", "зима", "улица"],
    location: "Москва",
    created_at: "2026-05-10T12:00:00Z",
  },
  {
    id: "2",
    title: "Гудок метро, Кольцевая",
    status: "pending",
    tags: ["метро", "город"],
    location: "Москва, Комсомольская",
    created_at: "2026-05-14T09:30:00Z",
  },
  {
    id: "3",
    title: "Капель с крыши, весна",
    status: "rejected",
    tags: ["капель", "весна", "вода"],
    location: "Санкт-Петербург",
    created_at: "2026-05-08T15:00:00Z",
  },
];
