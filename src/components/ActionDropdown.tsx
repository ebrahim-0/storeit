"use client";

import {
  Dialog,
  DialogClose,
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
import { actionsDropdownItems, actionsDropdownItemsAsShare } from "@/constants";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.action";
import { FileDetails, ShareFile } from "./ActionsModalContent";
import { useSelector } from "zustore";
import { getUserByEmail } from "@/lib/actions/user.action";
import { toast } from "sonner";
import Text from "./ui/Text";
import { constructFileUrl, shareUrl } from "@/lib/utils";
import Icon from "./Icon";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const path = usePathname();
  const user = useSelector<IUser>("user");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name.replace(/\.[^/.]+$/, ""));
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const isSharedWithMe = file?.users.includes(user?.email);

  const dropdownItems = useMemo(
    () => (isSharedWithMe ? actionsDropdownItemsAsShare : actionsDropdownItems),
    [file, user],
  );

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

  const renderDialogContent = () => {
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

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogClose asChild onClick={() => console.log("closed")} />
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="no-focus cursor-default">
          <Icon
            id="dots"
            size={28}
            viewBox="0 0 34 34"
            className="cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px] rounded-[20px] border-0 py-3 shadow-drop-2">
          <DropdownMenuLabel>
            <Text className="max-w-[200px] truncate" tooltip={file.name}>
              {file.name}
            </Text>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dropdownItems.map((actionItem, idx) => {
            return (
              <Fragment
                key={`${actionItem.label}-${Math.random()}-${file.$id}`}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setAction(actionItem);

                    if (actionItem.value === "share-link") {
                      navigator.clipboard
                        .writeText(shareUrl(file?.bucketFileId))
                        .then(() => {
                          toast.success("File url copied to clipboard");
                        });
                    }

                    if (actionItem.value === "remove-share") {
                      const removeMyEmail = file?.users.filter(
                        (fileUser: string) => fileUser !== user?.email,
                      );
                      updateFileUsers({
                        fileId: file.$id,
                        emails: removeMyEmail,
                        path,
                      }).then((res) => {
                        if (res?.error) {
                          toast.error(res.error.message);
                        } else {
                          toast.success("File unshared successfully");
                        }
                      });
                    }

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
                    <a
                      // href={`/api/files/${file.bucketFileId}?download=true`}
                      href={constructFileUrl(file?.bucketFileId)}
                      download={file.name}
                      target="_self"
                      className="flex items-center gap-2"
                    >
                      <Icon id={actionItem.icon} size={30} />
                      {actionItem.label}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon id={actionItem.icon} size={30} />
                      {actionItem.label}
                    </div>
                  )}
                </DropdownMenuItem>
                {idx !== dropdownItems.length - 1 && <DropdownMenuSeparator />}
              </Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
