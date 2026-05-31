import { Map } from "lucide-react";
import { Card } from "../../_components/ui/Card";

export function CongestionMapCard() {
  return (
    <Card icon={<Map className="h-5 w-5" />} title="混雑状況マップ">
      <div className="relative h-64 overflow-hidden rounded-2xl bg-[url('/images/map_image_no_numbers.png')] bg-contain bg-center bg-no-repeat sm:h-80" />
    </Card>
  );
}
