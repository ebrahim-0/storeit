import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function ZoomAbleImage({
  src,
  alt,
  className,
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
  if (!src) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img src={src} alt={alt || ""} sizes="100vw" className={className} />
      </DialogTrigger>
      <DialogContent
        className="h-full max-w-full border-0 bg-black p-0"
        closeClassName="!bg-white"
      >
        <div className="relative left-1/2 top-1/2 h-[calc(100vh-80px)] -translate-x-1/2 -translate-y-1/2 overflow-clip">
          <img
            src={src}
            alt={alt || ""}
            className="mx-auto h-full !w-fit object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
