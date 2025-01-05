import ActionDropdown from "@/components/ActionDropdown";
import { DashboardChart } from "@/components/DashboardChart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.action";
import Link from "next/link";
import { Models } from "node-appwrite";

const page = async () => {
  const [{ error: errorFile, ...files }, { error, ...totalUsed }] =
    await Promise.all([
      getFiles({ types: [], limit: 10 }),
      getTotalSpaceUsed(),
    ]);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 min-[915px]:grid-cols-2 xl:gap-10">
      <section>
        <DashboardChart used={totalUsed.used} />
      </section>

      <section className="custom-scrollbar h-[calc(100vh-195px)] overflow-auto rounded-[20px] bg-white p-5 xl:p-7">
        <h2 className="h3 xl:h2 mb-5 text-light-100">Recent files uploaded</h2>

        {files?.total > 0 ? (
          <section className="grid w-full grid-cols-1 gap-[26px]">
            {files?.documents?.map((file: Models.Document) => (
              <Link
                key={file.$id}
                href={`/file/${file.$id}`}
                target="_blank"
                className="flex items-center gap-3"
              >
                <Thumbnail
                  extension={file.extension}
                  type={file.type}
                  url={file.url}
                />

                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="subtitle-2 w-full max-w-24 truncate text-light-100 min-[400px]:max-w-44 sm:max-w-[200px] lg:max-w-[150px] min-[1200px]:max-w-[250px]">
                      {file.name}
                    </p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <p className="body-1 mt-10 text-center text-light-200">
            no files uploaded
          </p>
        )}
      </section>
    </div>
  );
};

export default page;
