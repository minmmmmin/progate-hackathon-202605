import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Image as ImageIcon,
  Scissors,
  Sparkles,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

type Spot = {
  title: string;
  description: string;
  gradient: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
};

const spots: Spot[] = [
  {
    title: "科学実験室",
    description: "ふしぎな実験がいっぱい！体験してみよう！",
    gradient: "from-indigo-200 via-purple-200 to-pink-200",
    Icon: FlaskConical,
    iconColor: "text-violet-700",
  },
  {
    title: "手作り雑貨店",
    description: "かわいい雑貨がたくさん！お気に入りを見つけてね♪",
    gradient: "from-amber-100 via-rose-100 to-pink-200",
    Icon: Scissors,
    iconColor: "text-rose-700",
  },
  {
    title: "展示コーナー",
    description: "みんなの力作をじっくり見てみよう！",
    gradient: "from-emerald-100 via-teal-100 to-cyan-200",
    Icon: ImageIcon,
    iconColor: "text-teal-700",
  },
];

export function RecommendedSpotsCard() {
  return (
    <Card icon={<Sparkles className="h-5 w-5" />} title="いま空いているおすすめスポット！">
      <div className="relative">
        <button
          type="button"
          aria-label="前へ"
          className="btn btn-circle btn-sm btn-primary absolute top-[42%] -left-3 z-10 hidden -translate-y-1/2 shadow-md sm:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="次へ"
          className="btn btn-circle btn-sm btn-primary absolute top-[42%] -right-3 z-10 hidden -translate-y-1/2 shadow-md sm:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:px-2">
          {spots.map((spot) => (
            <div key={spot.title} className="flex flex-col gap-2">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${spot.gradient}`}
              >
                <span className="absolute top-2 left-2 z-10">
                  <Badge tone="green">空いている</Badge>
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <spot.Icon className={`h-14 w-14 ${spot.iconColor}`} />
                </span>
              </div>
              <div className="px-1">
                <div className="text-base-content text-sm font-bold">{spot.title}</div>
                <p className="text-base-content/60 text-xs leading-relaxed">{spot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
