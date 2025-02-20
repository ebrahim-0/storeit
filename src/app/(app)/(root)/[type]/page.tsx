import { SortArrow } from "@/components/Sort";
import { FilesList } from "@/components/UploadFiles";
import { fileType } from "@/constants";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.action";
import {
  capitalize,
  convertFileSize,
  getFileTypesParams,
  getUsageSummary,
} from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export async function generateStaticParams() {
  return fileType.map((type) => ({
    type: type,
  }));
}

export async function generateMetadata({
  params,
}: SearchParamProps): Promise<Metadata> {
  const type = ((await params)?.type as string) || "";

  return {
    title: `StoreIt | ${capitalize(type)}`,
  };
}

const page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";

  if (!fileType.includes(type)) {
    return notFound();
  }

  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "$createdAt-desc";
  const limit = ((await searchParams)?.limit as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const [{ error: errorFile, ...files }, { error, ...totalUsed }] =
    await Promise.all([
      getFiles({
        types,
        searchText,
        sort,
        limit,
      }),
      getTotalSpaceUsed(),
    ]);

  const userSummary = getUsageSummary(totalUsed);

  return (
    <>
      <div className="page-container">
        <section className="w-full">
          <h1 className="h1 capitalize">{type}</h1>

          <div className="mt-2 flex flex-col justify-between sm:flex-row sm:items-center">
            <p className="body-1">
              Total:{" "}
              <span className="h5">
                {convertFileSize(
                  userSummary.find((summary) => summary.type === type)?.size ||
                    0,
                )}
              </span>
            </p>

            <div className="mt-5 flex items-center gap-3 sm:mt-0">
              <SortArrow />
            </div>
          </div>
        </section>
        <FilesList files={files} />
      </div>
    </>
  );
};

export default page;
