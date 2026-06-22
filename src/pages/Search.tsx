import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Loader2, Search } from "lucide-react";
import type { Column, SearchTypes } from "./BoardInfo";
import { TaskPriority } from "@/components/TaskPriority";
import { useSearch } from "../hooks/useSearch";

export interface SearchResponse {
    results: {
        tasks: {
            id: string;
            taskNumber: string;
            title: string;
            snippet: string;
            boardName: string;
            workspaceName: string;
            column: Column;
            priority: "high" | "medium" | "urgent" | "low";
        }[];
        boards: {
            id: string;
            title: string;
            workspaceName: string;
            snippet: string;
        }[];
    };
    searchTimeMs: number;
    totalCount: number;
}

export const SearchPage = () => {
    const { isSearching, isSuccess, results, setText, setType, text, type } =
        useSearch();
    return (
        <div className="w-full">
            <header className="flex items-center justify-between h-16 px-4 bg-background border-b border-border">
                <div className="flex items-center gap-4">
                    {/* This button automatically toggles the Sidebar! */}
                    <SidebarTrigger />
                    <p className="capitalize">Search</p>
                </div>
            </header>

            {/* content */}
            <section className="flex max-w-[700px] mx-auto justify-center mt-5">
                <div className="flex-1">
                    {/* title */}
                    <h2 className="text-2xl font-bold">Global Search</h2>
                    {/* paragraph */}
                    <p>
                        Search tasks, boards, and more across all your
                        workspaces
                    </p>
                    <div className="flex items-stretch">
                        <div className="px-[16px] py-[12px] flex flex-1 items-center gap-3 bg-(--surface) rounded-(--radius) border-(--border) border">
                            <Search />
                            <Input
                                onChange={(e) => setText(e.target.value)}
                                value={text}
                                type="search"
                                placeholder="Search tasks, boards, descriptions…"
                                className="text-[14px]! flex-1 dark:bg-(--surface)! border-none!"
                                name=""
                            />
                        </div>
                        <Select
                            name=""
                            onValueChange={(type) =>
                                setType(type as SearchTypes)
                            }
                            value={type}
                        >
                            <SelectTrigger className="h-full self-stretch">
                                <SelectValue placeholder="Select Type of Search" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Types</SelectItem>
                                <SelectItem value="TASKS">Tasks</SelectItem>
                                <SelectItem value="BOARDS">Boards</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* results */}
                    {isSearching && (
                        <div className="justify-center flex w-full items-center h-100vh">
                            <Loader2 className="animate-spin" /> Searching
                        </div>
                    )}
                    {isSuccess && (
                        <>
                            <div className="search-result">
                                <div className="search-tasks search">
                                    <span>
                                        Tasks ({results?.tasks?.length ?? 0})
                                    </span>
                                    <div className="search-cards">
                                        {results?.tasks?.map((task) => {
                                            console.log(task);
                                            return (
                                                <div
                                                    key={task.id}
                                                    className="search-card"
                                                >
                                                    <div className="text">
                                                        <h3>{task.title}</h3>
                                                        <p>
                                                            {task.taskNumber}.
                                                            {task.column?.name}.
                                                            {task.workspaceName}
                                                        </p>
                                                    </div>
                                                    <TaskPriority
                                                        priority={task.priority}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="search-boards search">
                                    <span>
                                        Boards ({results?.boards?.length ?? 0})
                                    </span>
                                    <div className="search-cards">
                                        {results?.boards?.map((board) => {
                                            // console.log(task)
                                            return (
                                                <div
                                                    key={board.id}
                                                    className="search-card"
                                                >
                                                    <div className="text">
                                                        <h3>{board.title}</h3>
                                                        <p>
                                                            {
                                                                board.workspaceName
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};
