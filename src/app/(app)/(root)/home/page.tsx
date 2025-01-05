import ActionDropdown from "@/components/ActionDropdown";
import { DashboardChart } from "@/components/DashboardChart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Icon from "@/components/Icon";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.action";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";

const page = async () => {
  const [{ error: errorFile, ...files }, { error, ...totalUsed }] =
    await Promise.all([
      getFiles({ types: [], limit: 10 }),
      getTotalSpaceUsed(),
    ]);

  const userSummary = getUsageSummary(totalUsed);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 min-[915px]:grid-cols-2 xl:gap-10">
      <section>
        <DashboardChart used={totalUsed.used} />

        <div className="mt-6 grid grid-cols-1 gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-9">
          {userSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="relative mt-6 rounded-[20px] bg-white p-5 transition-all hover:scale-105"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Icon
                    id={summary.icon}
                    width={226}
                    height={108}
                    viewBox="0 0 241 118"
                    color={summary.iconBg}
                    className="absolute left-[-13px] top-[-33px] z-10 w-[190px] object-contain"
                  />
                  <h4 className="h4 relative z-20 w-full text-right">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="h5 relative z-20 text-center">
                  {summary.title}
                </h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="custom-scrollbar h-full overflow-auto rounded-[20px] bg-white p-5 xl:h-[740px] xl:p-7">
        <h2 className="h3 xl:h2 mb-5 text-light-100">Recent files uploaded</h2>

        {files?.total > 0 ? (
          <section className="grid w-full grid-cols-1 gap-[26px]">
            {files?.documents?.map((file: Models.Document) => (
              <Link
                key={file.$id}
                href={`/viewer/${file.$id}`}
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
