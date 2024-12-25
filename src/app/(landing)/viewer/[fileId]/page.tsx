import Text from "@/components/ui/Text";
import { getFileByBucketFileId } from "@/lib/actions/file.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "StoreIt | Viewer",
};

const page = async ({ params }: SearchParamProps) => {
  const fileId = ((await params)?.fileId as string) || "";
  const file = await getFileByBucketFileId(fileId);
  const { error, ...currentUser } = await getCurrentUser();

  const isImage = file?.type === "image";

  if (
    file?.isPublic ||
    currentUser?.accountId === file?.accountId ||
    file?.users.includes(currentUser?.email)
  ) {
    return (
      <>
        <div className="mx-auto flex h-full min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-3 pb-10 pt-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="h1 text-light-100">{file?.name}</h1>
            <Text toolTipAlign="center" tooltip="Download" side="bottom">
              <a
                href={`/api/image-proxy/${fileId}?download=true`}
                target="_self"
                download={file?.name}
              >
                <Image
                  src="/assets/icons/download.svg"
                  alt="Download"
                  width={55}
                  height={55}
                  className="cursor-pointer"
                />
              </a>
            </Text>
          </div>
          <div
            className={cn(
              "relative h-full w-full overflow-hidden",
              "bg-red-500 m-auto min-h-[calc(100vh-80px)] rounded-3xl bg-light-300 p-5",
              isImage ? "flex items-center justify-center" : "",
            )}
          >
            {fileId && isImage && (
              <img
                alt="Viewer"
                className="max-h-[calc(100vh-120px)] object-cover"
                src={`/api/image-proxy/${fileId}`}
              />
            )}
            {fileId && !isImage && (
              <embed
                className="h-full min-h-[calc(100vh-80px)] w-full border-none"
                src={`/api/image-proxy/${fileId}`}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  redirect("/");
};

export default page;
