import type { Route } from "./+types/home";
import App from "../App";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "SROI 投入管理系統" },
    { name: "description", content: "線上 SROI 折現評估系統" },
  ];
}

export default function Home() {
  return <App />;
}
