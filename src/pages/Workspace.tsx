import { axiosInstance, workspaceEndPoints } from "@/api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, Loader2, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import { useState } from "react";
import { WorkspaceCard } from "@/components/WorkspaceCard";

interface ErrorResponse {
  message: string;
}

interface CreateWorkspaceDTO {
  name: string;
  isPrivate?: boolean;
  description: string;
}

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  avatarUrl: string | null;
  bio: string | null;
  emailVerified: boolean | null;
  emailPreference: string;
  isActive: false;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}
interface WorkspaceMember {
  id: string;
  role: string;
  joinedAt: string;
  user: User;
}
interface Board {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string;
  visibility: string;
  deletedAt: string | null;
}
interface WorkspaceDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  isPrivate: false;
  createdAt: string;
  updatedAt: string;
  owner: User;
  members: WorkspaceMember[];

  boards: Board[];
}

interface GetWorkspacesDto {
  workspaces: WorkspaceDto[];
  workspaceCount: number;
  pageCount: number;
}

export const WorkspacePage = () => {
  const location = useLocation();
  const { token, user } = useUser();
  const [errors, setErrors] = useState(null);
  const [active, setActive] = useState("all");
  // create workspace
  const mutation = useMutation({
    mutationKey: ["create-workspace"],
    mutationFn: async (formData: CreateWorkspaceDTO) => {
      const response = await axiosInstance.post(
        workspaceEndPoints.getOrCreateWorkspace,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess(data) {
      console.log(data);
      toast.success("workspace has been created successfully", {
        id: "create-workspace",
      });
    },
    onError(error: AxiosError<ErrorResponse>) {
      toast.error(error.response?.data.message, {
        position: "top-center",
        id: "create-workspace",
      });
      // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
      let errs: any = {};
      if (
        error.response?.data.message &&
        Array.isArray(error.response.data.message)
      ) {
        for (const err of error.response.data.message) {
          if (typeof err === "string") {
            errs[err.split(" ")[0]] = err;
          }
        }
        setErrors(errs);
      }
    },
  });
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(
      formData.entries(),
    ) as unknown as CreateWorkspaceDTO;
    if (!data.isPrivate) {
      data.isPrivate = false;
    } else {
      data.isPrivate = true;
    }
    mutation.mutate(data);
  };

  // get workspaces
  const query = useQuery({
    queryKey: ["get-workspaces"],
    queryFn: async () => {
      const response = await axiosInstance.get<GetWorkspacesDto>(
        workspaceEndPoints.getOrCreateWorkspace,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
  });

  if (query.isPending) {
    return (
      <div className="justify-center flex w-full items-center h-100vh">
        <Loader2 className="animate-spin" /> Loading
      </div>
    );
  }

  return (
    <div className="flex-col flex w-full">
      <header className="flex items-center justify-between h-16 px-4 bg-background border-b border-border">
        <div className="flex items-center gap-4">
          {/* This button automatically toggles the Sidebar! */}
          <SidebarTrigger />
          <p className="capitalize">{location.pathname.split("/").at(-1)}</p>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-4 text-gray-500">
          {/* Search Input Placeholder */}
          <Link to={"/search"}>
            <Input
              type="text"
              placeholder="Search tasks..."
              className="hidden md:block text-sm cursor-pointer bg-(--input)"
            />
          </Link>
          <Button
            variant={"default"}
            className="relative cursor-pointer dark:text-white dark:hover:text-white hover:text-gray-700"
          >
            <Bell className="" />
            {/* Unread Badge */}
            <Badge
              className="absolute top-0 right-0 w-2 h-2 block"
              variant={"destructive"}
            ></Badge>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"defaultYellow"}
                className="cursor-pointer font-bold"
              >
                <PlusCircle /> Create Workspace
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-(--auth-card)">
              <DialogHeader>
                <DialogTitle>New Workspace</DialogTitle>
              </DialogHeader>
              <div>
                <form action="" onSubmit={handleSubmit}>
                  <Field className="">
                    <FieldLabel htmlFor="name" className="text-(--text-2)">
                      Workspace Name *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="name"
                        className="dark:bg-(--deep) placeholder:text-(--text)"
                        id="name"
                        placeholder="My Workspace"
                      />
                      {errors && errors["name"] && (
                        <FieldError>{errors["name"]}</FieldError>
                      )}
                    </FieldContent>
                    {/* <FieldLabel htmlFor="slug" className="text-(--text-2)">
                                                Workspace URL
                                            </FieldLabel>
                                            <div className="flex items-center gap-2">
                                                <span className="text-(--text) text-sm">taskflow.app/</span>
                                                <FieldContent>
                                                    <Input name="slug" className="dark:bg-(--deep) placeholder:text-(--text)" id="slug" placeholder="my-workspace"/>
                                                </FieldContent>
                                            </div> */}
                    <FieldLabel
                      htmlFor="description"
                      className="text-(--text-2)"
                    >
                      Description
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="description"
                        className="dark:bg-(--deep) placeholder:text-(--text)"
                        id="description"
                        placeholder="What does your team work on?"
                      />
                      {errors && errors["description"] && (
                        <FieldError>{errors["description"]}</FieldError>
                      )}
                    </FieldContent>
                    <div className="flex bg-(--raised) p-4 rounded-lg border border-(--border) items-center justify-between">
                      <div className="flex flex-col">
                        <span>Private Workspace</span>
                        <span className="text-(--text-3) text-sm">
                          Only invited members can join
                        </span>
                      </div>
                      <Switch name="isPrivate" defaultChecked={false} />
                    </div>
                    {errors && errors["isPrivate"] && (
                      <FieldError>{errors["isPrivate"]}</FieldError>
                    )}
                    <hr />
                    <div className="flex justify-end gap-2">
                      <Button className="cursor-pointer" type="button">
                        Cancel
                      </Button>
                      <Button
                        variant={"defaultYellow"}
                        className="cursor-pointer"
                      >
                        Create Workspace
                      </Button>
                    </div>
                  </Field>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Workspace Section */}
      <div className="main-workspace-section">
        <h2 className="main-workspace-header text-2xl font-bold">Workspaces</h2>
        <p className="main-workspace-text text-(--text) text-sm">
          Your organizations and teams
        </p>
        <div className="main-workspace-filters ">
          <Badge
            variant={"defaultYellow"}
            className={`main-workspace-filter ${active !== "all" ? "inactive" : ""}`}
            onClick={() => {
              setActive("all");
            }}
          >
            All
          </Badge>
          <Badge
            variant={"defaultYellow"}
            className={`main-workspace-filter ${active !== "owned" ? "inactive" : ""}`}
            onClick={() => {
              setActive("owned");
            }}
          >
            owned
          </Badge>
          <Badge
            variant={"defaultYellow"}
            className={`main-workspace-filter ${active !== "member" ? "inactive" : ""}`}
            onClick={() => {
              setActive("member");
            }}
          >
            member
          </Badge>
        </div>
      </div>
      <hr />
      <div className="workspace-cards">
        {query.data?.workspaces.map((workspace) => {
          let role = "member";
          if (workspace.owner.id === user.id) {
            role = "owner";
          } else {
            workspace.members.forEach((member) => {
              if (member.user.id === user.id) {
                role = member.role;
              }
            });
          }

          return (
            <Link
              to={`/workspaces/${workspace.id}/boards`}
              state={{ workspaceName: workspace.name }}
            >
              <WorkspaceCard
                stats={{
                  boards: workspace.boards.length,
                  members: workspace.members.length,
                }}
                role={role}
                title={workspace.name}
                description={workspace.description}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
