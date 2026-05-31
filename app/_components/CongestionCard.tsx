import { Users } from "lucide-react";
import { Card } from "./ui/Card";

export function CongestionCard() {
  return (
    <Card
      icon={<Users className="h-5 w-5" />}
      title="学内MAP"
    >
      <div className="relative h-56 overflow-hidden rounded-2xl bg-[url('/images/map_image_no_numbers.png')] bg-contain bg-center bg-no-repeat sm:h-72" />
    </Card>
  );
}
