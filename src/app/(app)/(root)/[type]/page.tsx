import ClientToast from "@/components/ClientToast";
import FilesList from "@/components/FilesList";
import Icon from "@/components/Icon";
import Sort from "@/components/Sort";
import { fileType } from "@/constants";
import { getFiles } from "@/lib/actions/file.action";
import { capitalize, getFileTypesParams } from "@/lib/utils";
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
  const sort = ((await searchParams)?.sort as string) || "";
  const limit = ((await searchParams)?.limit as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const { error, ...files } = await getFiles({
    types,
    searchText,
    sort,
    limit: parseInt(limit),
  });

  return (
    <>
      {error && (
        <ClientToast
          key={error.message}
          message={<p className="body-2 text-white">{error?.message}</p>}
          data={{
            className: "!rounded-[10px]",
          }}
        />
      )}
      <div className="page-container">
        <section className="w-full">
          <h1 className="h1 capitalize">{type}</h1>

          <div className="mt-2 flex flex-col justify-between sm:flex-row sm:items-center">
            <p className="body-1">
              Total: <span className="h5">12GB</span>
            </p>

            <div className="mt-5 flex items-center gap-3 sm:mt-0">
              <p className="body-1 hidden text-light-200 sm:block">Sort By: </p>
              <Sort />

              {/* <div className="flex-center size-11 rounded-lg bg-white">
                <Icon
                  id="menu"
                  width={22}
                  height={22}
                  viewBox="0 0 22 22"
                  color="hsl(var(--light-100))"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex-center size-11 rounded-lg bg-brand">
                <Icon
                  id="grid"
                  width={22}
                  height={22}
                  viewBox="0 0 22 22"
                  color="white"
                  className="cursor-pointer"
                />
              </div> */}
            </div>
          </div>
        </section>
        <FilesList files={files} />
      </div>
    </>
  );
};

export default page;
