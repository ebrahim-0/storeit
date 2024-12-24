import { getFileView } from "@/lib/actions/file.action";

const FilePreview = async ({
  fileUrl,
  isImage,
}: {
  fileUrl: string;
  isImage: boolean;
}) => {
  const data = await getFileView(fileId);
  console.log("🚀 ~ page ~ data:", data);
  const blob = arrayBufferToBlob(data, "image/png");
  console.log("🚀 ~ page ~ blob:", blob);

  return (
    <div>
      {fileUrl && isImage && (
        <img
          width={800}
          height={600}
          alt="Viewer"
          className="h-full w-full"
          src={fileUrl}
        />
      )}
      {fileUrl && !isImage && (
        <embed
          className="h-full min-h-[calc(100vh-80px)] w-full border-none"
          src={fileUrl}
        />
      )}
    </div>
  );
};

export default FilePreview;

const arrayBufferToBlob = (
  arrayBuffer,
  mimeType = "application/octet-stream",
) => {
  return new Blob([arrayBuffer], { type: mimeType });
};
