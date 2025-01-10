"use client";

import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.action";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { FileDetails, ShareFile } from "./ActionsModalContent";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { getUserByEmail } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { useSelector } from "zustore";

export const RenderDialogContent = ({
  action,
  file,
  setAction,
  setIsModalOpen,
  setIsDropdownOpen,
}: RenderDialogContentProps) => {
  const path = usePathname();
  const user = useSelector<IUser>("user");

  const [name, setName] = useState(file.name.replace(/\.[^/.]+$/, ""));
  const [email, setEmail] = useState("");

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file?.name.replace(/\.[^/.]+$/, ""));
    setIsLoading(false);
    setEmail("");
  };

  const handleRemoveUser = useCallback(
    async (email: string) => {
      const existingUser = await getUserByEmail(email);

      if (file?.accountId !== user?.accountId) {
        toast.error("You can't remove a user from a file shared with you");
        return;
      }

      if (existingUser?.role === "admin" && user?.role !== "admin") {
        toast.error("You can't remove an admin from the file");
        return;
      }

      const updatedUsers = file?.users.filter((user: string) => user !== email);

      const success = await updateFileUsers({
        fileId: file.$id,
        emails: updatedUsers,
        path,
      });

      if (success?.error) {
        toast.error(success.error.message);
      }
    },
    [file],
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    let success = null;

    const actions = {
      rename: async () => {
        return await renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        });
      },
      share: async () => {
        if (file?.accountId !== user?.accountId) {
          toast.error("You can't share a file shared with you");
          return;
        }

        if (user?.email === email) {
          toast.error("You can't share the file with yourself");
          return false;
        }

        if (file?.users.includes(email)) {
          toast.error("One or more emails are already shared with this file");
          return false;
        }

        const res = await updateFileUsers({
          fileId: file.$id,
          emails: [...file?.users, email],
          path,
        });

        if (!res.error) {
          setEmail("");
          toast.success("File shared successfully");
        }
        return res;
      },
      delete: async () => {
        if (file?.users.includes(email)) {
          toast.error("You can't delete a file shared with you");
          return;
        }
        const res = await deleteFile(file.bucketFileId, path);

        if (!res.error) {
          toast.success("File deleted successfully");
        }
      },
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success?.error) {
      toast.error(success.error.message);
      setIsLoading(false);
      return;
    }

    if (success && action?.value !== "share") closeAllModals();
    setIsLoading(false);
  };

  if (!action) return null;

  const { label, value } = action;

  return (
    <DialogContent
      className="button w-[90%] max-w-[400px] !rounded-[26px] px-6 py-8"
      onClose={closeAllModals}
    >
      <DialogHeader className="flex flex-col gap-3">
        <DialogTitle className="text-center text-light-100">
          {label}
        </DialogTitle>

        {value === "share" && (
          <ShareFile
            file={file}
            onRemove={handleRemoveUser}
            handleAction={handleAction}
            setEmail={setEmail}
            email={email}
          />
        )}

        {value === "rename" && (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAction()}
            placeholder="Enter new name"
            className="no-focus h-[52px] rounded-[30px] !border-0 p-4 text-light-100 shadow-drop-1"
          />
        )}

        {value === "delete" && (
          <p className="subtitle-2 text-center text-light-100">
            Are you sure you want to delete this file?
          </p>
        )}

        {value === "details" && <FileDetails file={file} />}
      </DialogHeader>

      {["delete", "rename", "share"].includes(value) && (
        <DialogFooter className="flex flex-col gap-3 md:flex-row">
          <Button
            onClick={closeAllModals}
            className="h-[42px] flex-1 rounded-full bg-white text-light-100 hover:bg-transparent"
          >
            Cancel
          </Button>

          <Button
            className="btn !mx-0 h-[52px] flex-1"
            onClick={handleAction}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <p className="capitalize">{value}</p>
          </Button>
        </DialogFooter>
      )}
    </DialogContent>
  );
};
