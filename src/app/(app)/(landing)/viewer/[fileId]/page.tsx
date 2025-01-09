import Text from "@/components/ui/Text";
import ZoomAbleImage from "@/components/ZoomAbleImage";
import { getFileByBucketFileId } from "@/lib/actions/file.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { cn, constructFileUrl } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import MediaPlayer from "@/components/MediaPlayer";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "StoreIt | Viewer",
};

const page = async ({ params }: SearchParamProps) => {
  const fileId = ((await params)?.fileId as string) || "";
  const { error: fileError, ...file } = await getFileByBucketFileId(fileId);
  const { error, ...currentUser } = await getCurrentUser();

  const isImage = file?.type === "image";
  const isVideo = file?.type === "video";
  const isAudio = file?.type === "audio";

  if (fileError) {
    return (
      <div className="mx-auto flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-3 pb-10 pt-6">
        {fileError.message}
      </div>
    );
  }

  if (
    file?.isPublic ||
    currentUser?.accountId === file?.accountId ||
    file?.users.includes(currentUser?.email)
  ) {
    return (
      <>
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-3 pb-10 pt-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="h1 truncate text-light-100">{file?.name}</h1>
            <Text align="center" tooltip="Download" side="bottom">
              <a
                // href={`/api/files/${fileId}?download=true`}
                href={constructFileUrl(fileId)}
                target="_self"
                download={file?.name}
              >
                <Icon
                  id="download"
                  size={55}
                  viewBox="0 0 30 30"
                  className="cursor-pointer"
                />
              </a>
            </Text>
          </div>
          <div
            className={cn(
              "relative h-full w-full",
              "bg-red-500 m-auto rounded-3xl bg-light-300 p-5",
              isImage
                ? "flex h-[calc(100vh-80px)] items-center justify-center"
                : "",
            )}
          >
            {fileId && isImage && (
              <ZoomAbleImage
                // src={`/api/files/${fileId}`}
                src={
                  file?.extension === "svg"
                    ? `/api/files/${fileId}`
                    : constructFileUrl(fileId)
                }
                alt={file?.name}
                className="h-full !w-fit object-contain"
              />
            )}

            {fileId && (isAudio || isVideo) && (
              <MediaPlayer
                // src={`/api/files/${fileId}`}
                src={constructFileUrl(fileId)}
                type={file?.type}
              />
            )}
            {fileId && !isImage && !isVideo && !isAudio && (
              <embed
                className="h-[calc(100vh-80px)] w-full border-none"
                // src={`/api/files/${fileId}`}
                src={constructFileUrl(fileId)}
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
