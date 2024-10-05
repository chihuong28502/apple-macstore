import TopCard from "@/components/TopicCard/TopCard";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
const listTopic = [
  { title: "Nội dung nổi bật", isSelect: true },
  { title: "Nội dung từ chủ đề đã theo dõi", isSelect: false },
  { title: "Nội dung từ chủ đề đã theo dõi", isSelect: false },
  { title: "Nội dung từ chủ đề đã theo dõi", isSelect: false },
  { title: "Nội dung từ chủ đề đã theo dõi", isSelect: false },
];

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className="">
      <div>
        <h1>{t("title")}</h1>
        <Link href="/about">{t("about")}</Link>
      </div>
      {listTopic.map(
        (item: { title: string; isSelect: boolean }, index: number) => (
          <TopCard key={index} item={item} />
        )
      )}
    </div>
  );
}
