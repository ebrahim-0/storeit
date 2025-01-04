import Card from "@/components/Card";
import ClientToast from "@/components/ClientToast";
import Sort from "@/components/Sort";
import { fileType } from "@/constants";
import { getFiles } from "@/lib/actions/file.action";
import { capitalize, getFileTypesParams } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Models } from "node-appwrite";

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

  console.log("🚀 ~ page ~ files:", files);

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

            <div className="mt-5 flex items-center sm:mt-0 sm:gap-3">
              <p className="body-1 hidden text-light-200 sm:block">Sort By: </p>
              <Sort />
            </div>
          </div>
        </section>
        {files?.total > 0 ? (
          <section className="grid w-full grid-cols-1 gap-[26px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files?.documents?.map((file: Models.Document) => (
              <Card key={file.$id} file={file} />
            ))}
          </section>
        ) : (
          <p className="body-1 mt-10 text-center text-light-200">
            no files uploaded
          </p>
        )}
      </div>
    </>
  );
};

export default page;
