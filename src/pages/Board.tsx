import { axiosInstance, boardEndPoints } from "@/api/api";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, Loader2, PlusCircle } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import { useState } from "react";
import { getUrl } from "@/helpers/helpers";
import { BoardCard } from "@/components/Board";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InviteMemberDialog } from "@/components/InviteMemberDialog";

interface ErrorResponse {
  message: string;
}

interface CreateBoardDto {
  name: string;
  description: string;
  backgroundColor: string;
  visibility: string;
}
export interface Visibility {
  PUBLIC: "PUBLIC";
  PRIVATE: "PRIVATE";
  WORKSPACE: "WORKSPACE";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GetWorkspacesDto {
  workspaces: WorkspaceDto[];
  workspaceCount: number;
  pageCount: number;
}

export const BoardsPage = () => {
  const location = useLocation();
  const { token } = useUser();
  const [errors, setErrors] = useState(null);
  const [active, setActive] = useState("all");
  const { workspaceId } = useParams();

  // create workspace
  const mutation = useMutation({
    mutationKey: ["create-board"],
    mutationFn: async (formData: CreateBoardDto) => {
      const response = await axiosInstance.post(
        getUrl(boardEndPoints.getOrCreateBoards, { workspaceId }),
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    },
    onSuccess(data) {
      console.log(data);
      toast.success("board has been created successfully", {
        id: "create-board",
      });
      query.refetch();
    },
    onError(error: AxiosError<ErrorResponse>) {
      toast.error(error.response?.data.message, {
        position: "top-center",
        id: "create-board",
      });
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
    // eslint-disable-next-line no-debugger
    debugger;
    const formData = new FormData(e.target);
    const data = Object.fromEntries(
      formData.entries(),
    ) as unknown as CreateBoardDto;
    mutation.mutate(data);
  };

  // get workspaces
  const query = useQuery({
    queryKey: ["get-boards"],
    queryFn: async () => {
      const response = await axiosInstance.get<Board[]>(
        getUrl(boardEndPoints.getOrCreateBoards, { workspaceId }),
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
              className="hidden md:block text-sm cursor-pointer bg-input"
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
            <DialogTrigger>
              <Button
                variant={"defaultYellow"}
                className="cursor-pointer font-bold"
              >
                <PlusCircle /> New Board
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
                      Board Name *
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        name="name"
                        className="dark:bg-(--deep) placeholder:text-(--text-4)"
                        id="name"
                        placeholder="e.g. Backend API"
                      />
                      {errors && errors["name"] && (
                        <FieldError>{errors["name"]}</FieldError>
                      )}
                    </FieldContent>
                    <FieldLabel
                      htmlFor="description"
                      className="text-(--text-2)"
                    >
                      Description
                    </FieldLabel>
                    <FieldContent>
                      <Textarea
                        name="description"
                        className="dark:bg-(--deep) placeholder:text-(--text-4)"
                        id="description"
                      />
                      {errors && errors["description"] && (
                        <FieldError>{errors["description"]}</FieldError>
                      )}
                    </FieldContent>
                    <FieldGroup className="flex md:flex-row">
                      <div className="md:w-1/2">
                        <FieldLabel
                          htmlFor="background"
                          className="text-(--text-2)"
                        >
                          Background
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            name="backgroundColor"
                            type="color"
                            className="dark:bg-(--deep) placeholder:text-(--text-4)"
                            id="background"
                            placeholder="What does your team work on?"
                          />
                          {errors && errors["background"] && (
                            <FieldError>{errors["background"]}</FieldError>
                          )}
                        </FieldContent>
                      </div>
                      <div className="w-full md:w-1/2">
                        <FieldLabel
                          htmlFor="visibility"
                          className="text-(--text-2)"
                        >
                          Visibility
                        </FieldLabel>
                        <FieldContent>
                          <Select name="visibility">
                            <SelectTrigger
                              name="visibility"
                              id="visibility"
                              className="w-full bg-(--deep)!"
                            >
                              <SelectValue
                                placeholder="Select a Visibility"
                                className="placeholder:text-(--text-3)!"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="PRIVATE">Private</SelectItem>
                                <SelectItem value="WORKSPACE">
                                  Workspace
                                </SelectItem>
                                <SelectItem value="PUBLIC">Public</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                            {errors && errors["visibility"] && (
                              <FieldError>{errors["visibility"]}</FieldError>
                            )}
                          </Select>
                        </FieldContent>
                      </div>
                    </FieldGroup>
                    <div className="flex bg-(--raised) p-3 rounded-lg border border-border items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-(--text-3) text-xs">
                          💡 3 default columns: To Do, In Progress, Done
                        </span>
                      </div>
                    </div>
                    <hr />
                    <div className="flex justify-end gap-2">
                      <Button className="cursor-pointer" type="button">
                        Cancel
                      </Button>
                      <Button
                        variant={"defaultYellow"}
                        className="cursor-pointer"
                      >
                        Create Board
                      </Button>
                    </div>
                  </Field>
                </form>
              </div>
            </DialogContent>
          </Dialog>
          <InviteMemberDialog
            workspaceName={location.state?.workspaceName}
            workspaceId={workspaceId as string}
          />
        </div>
      </header>

      {/* Main Board Section */}
      <div className="main-workspace-section">
        <h2 className="main-workspace-header capitalize text-2xl font-bold">
          {location.pathname.split("/").at(-1)}
        </h2>
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
            className={`main-workspace-filter ${active !== "active" ? "inactive" : ""}`}
            onClick={() => {
              setActive("active");
            }}
          >
            Active
          </Badge>
          <Badge
            variant={"defaultYellow"}
            className={`main-workspace-filter ${active !== "archived" ? "inactive" : ""}`}
            onClick={() => {
              setActive("archived");
            }}
          >
            Archived
          </Badge>
        </div>
      </div>
      <hr />
      <div className="workspace-cards">
        {query.data?.map((board) => {
          // let role = 'member'
          // if(workspace.owner.id === user.id){
          //     role = 'owner'
          // }else{
          //     workspace.members.forEach(member=>{
          //         if(member.user.id === user.id){
          //             role = member.role
          //         }
          //     })
          // }
          return (
            <Link to={`/boards/${board.id}`}>
              <BoardCard
                title={board.name}
                updatedAt={board.updatedAt}
                description={board.description}
                visibility={board.visibility}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
