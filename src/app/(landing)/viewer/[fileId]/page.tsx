import Text from "@/components/ui/Text";
import { getFileByBucketFileId } from "@/lib/actions/file.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async ({ params }: SearchParamProps) => {
  const fileId = ((await params)?.fileId as string) || "";
  const file = await getFileByBucketFileId(fileId);
  // console.log("🚀 ~ page ~ file:", file);
  const { error, ...currentUser } = await getCurrentUser();

  const isImage = file?.type === "image";

  if (
    file?.isPublic ||
    currentUser?.accountId === file?.accountId ||
    file?.users.includes(currentUser?.email)
  ) {
    return (
      <>
        <div className="mx-auto flex h-full min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-3 py-6 pb-10">
          <div className="flex w-full items-center justify-between">
            <h1 className="h1 text-light-100">{file?.name}</h1>
            <Text toolTipAlign="center" tooltip={file?.name}>
              <a
                href={`/api/image-proxy?fileId=${fileId}&download=true`}
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
              "bg-red-500 m-auto",
              isImage
                ? "flex items-center justify-center"
                : "min-h-[calc(100vh-80px)]",
            )}
          >
            {fileId && isImage && (
              <img
                // width={800}
                // height={600}
                alt="Viewer"
                // className="h-full w-full"
                src={`/api/image-proxy?fileId=${fileId}`}
              />
            )}
            {fileId && !isImage && (
              <embed
                className="h-full min-h-[calc(100vh-80px)] w-full border-none"
                // src={fileUrl}
                src={`/api/image-proxy?fileId=${fileId}`}
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

// const arrayBufferToBlob = (
//   arrayBuffer,
//   mimeType = "application/octet-stream",
// ) => {
//   return new Blob([arrayBuffer], { type: mimeType });
// };
