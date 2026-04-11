import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Link2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance, workspaceEndPoints } from "@/api/api";
import { getUrl } from "@/helpers/helpers";
import { useState } from "react";
import { FieldError } from "./ui/field";
import { toast } from "sonner";
import { AxiosError } from "axios";
type WorkspaceRole = "member" | "admin" | "viewer";
export const InviteMemberDialog = ({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) => {
  const mutation = useMutation({
    mutationKey: ["invite-user"],
    mutationFn: async (data: {
      email: string;
      role: string;
      message?: string;
    }) => {
      toast.loading("email is being sent", { id: "11" });
      const response = await axiosInstance.post(
        getUrl(workspaceEndPoints.sendInvitation, { workspaceId: workspaceId }),
        data,
      );
      return response.data;
    },
    onSuccess() {
      toast.success("invitation email has been sent successfully", {
        id: "11",
      });
    },
    onError(error) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.data
      ) {
        toast.error(
          "there is an error happened" + error?.response.data?.message,
          { id: "11" },
        );
      }
    },
  });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin" | "viewer">("member");
  const [message, setMessage] = useState<string | undefined>("");
  const [errors, setErrors] = useState({ email: "", role: "" });

  function handleInviteUser(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    debugger;
    //test email before making request
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: "Must Be a valid Email",
      }));
      return;
    }

    //test role before making request
    if (role !== "admin" && role !== "member" && role !== "viewer") {
      setErrors((prev) => ({
        ...prev,
        role: "Must be valid role (admin|member|viewer)",
      }));
      return;
    } else {
      //to remove the errors of role
      setErrors((prev) => ({ ...prev, role: "" }));
    }
    mutation.mutate({ email, role, message });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="defaultYellow"
          className="gap-2 font-bold cursor-pointer"
        >
          <UserPlus size={18} />
          Invite Members
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-(--surface) sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {workspaceName}</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 py-4"
          onSubmit={(e) => handleInviteUser(e)}
        >
          {/* Email Input & Role Select */}
          <div className="flex gap-2 items-center">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-(--deep)"
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (!value) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                    return;
                  }
                }}
              />
              <FieldError>{errors["email"]}</FieldError>
            </div>
            <div>
              <Select
                defaultValue="member"
                onValueChange={(value) => {
                  setRole(value as WorkspaceRole);
                }}
              >
                <SelectTrigger className="w-27.5 bg-(--deep)">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors["role"]}</FieldError>
            </div>
          </div>
          {/* Message */}
          <div>
            <Textarea
              name="message"
              placeholder="Enter Message to send in invitation"
              className="flex-1 bg-(--deep)!"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {/* Send Button */}
          <Button
            variant="defaultYellow"
            className="w-full font-bold cursor-pointer"
          >
            Send Invitation
          </Button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-border"></div>
            <span className="shrink-0 mx-4 text-(--text-3) text-xs">OR</span>
            <div className="grow border-t border-border"></div>
          </div>

          {/* Copy Link Option */}
          <div className="flex justify-between items-center bg-(--raised) p-3 rounded-lg border border-border">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Invite Link</span>
              <span className="text-xs text-(--text-3)">
                Anyone with the link can join
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 cursor-pointer border-border hover:bg-(--hover)"
            >
              <Link2 size={14} />
              Copy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
