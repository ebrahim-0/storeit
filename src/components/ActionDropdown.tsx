"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Models } from "node-appwrite";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { renameFile, updateFileUsers } from "@/lib/actions/file.action";
import { FileDetails, ShareFile } from "./ActionsModalContent";
import { useSelector } from "zustore";
import { getUserByEmail } from "@/lib/actions/user.action";
import { toast } from "sonner";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const path = usePathname();
  const user = useSelector<IUser>("user");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name.replace(/\.[^/.]+$/, ""));
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>(file?.users || []);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file?.name.replace(/\.[^/.]+$/, ""));
    setEmails(file?.users || []);
  };

  const handleRemoveUser = useCallback(
    async (email: string) => {
      const existingUser = await getUserByEmail(email);

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

      // if (success) setEmails(updatedUsers);
      if (success) setEmails(file?.users || []);
      // closeAllModals();
    },
    [file],
  );

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    let success = false;

    const actions = {
      rename: async () =>
        await renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        }),
      share: async () => {
        if (emails.includes(user?.email)) {
          toast.error("You can't share the file with yourself");
          return false;
        }

        if (emails.some((email) => file?.users.includes(email))) {
          toast.error("One or more emails are already shared with this file");
          return false;
        }

        await updateFileUsers({
          fileId: file.$id,
          emails: [...file?.users, ...emails],
          path,
        });
      },
      delete: () => {},
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();
    setIsLoading(false);
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { label, value } = action;

    return (
      <DialogContent className="button w-[90%] max-w-[400px] !rounded-[26px] px-6 py-8">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>

          {value === "share" && (
            <ShareFile
              file={file}
              onChangeInput={setEmails}
              onRemove={handleRemoveUser}
              handleAction={handleAction}
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
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="no-focus cursor-default">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={24}
            height={24}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px] rounded-[20px] border-0 py-3 shadow-drop-2">
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem, idx) => {
            return (
              <>
                <DropdownMenuItem
                  key={actionItem.value}
                  onClick={() => {
                    setAction(actionItem);
                    if (
                      ["delete", "rename", "share", "details"].includes(
                        actionItem.value,
                      )
                    ) {
                      setIsModalOpen(true);
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  {actionItem.value === "download" ? (
                    <Link
                      href={constructDownloadUrl(file.bucketFileId)}
                      download={file.name}
                      className="flex items-center gap-2"
                    >
                      <Image
                        src={actionItem.icon}
                        alt={actionItem.label}
                        width={30}
                        height={30}
                      />
                      {actionItem.label}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Image
                        src={actionItem.icon}
                        alt={actionItem.label}
                        width={30}
                        height={30}
                      />
                      {actionItem.label}
                    </div>
                  )}
                </DropdownMenuItem>
                {idx !== actionsDropdownItems.length - 1 && (
                  <DropdownMenuSeparator />
                )}
              </>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
