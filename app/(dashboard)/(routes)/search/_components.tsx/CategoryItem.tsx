"use client";

import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import qs from "query-string";
import { title } from "process";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const IsSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query: {
          title: currentTitle,
          categoryId: IsSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <button
      className={cn(
        "py-2 px-3 text-sm border  rounded-full flex items-center  border-slate-200 gap-x-1 hover:border-sky-700 transition",
        IsSelected && "border-sky-700 text-sky-800 bg-sky-200/20"
      )}
      type="button"
      onClick={onClick}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
