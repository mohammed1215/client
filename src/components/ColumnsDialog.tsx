import { X } from "lucide-react";
import { useColumnsDialog } from "../hooks/useColumnsDialog";
import type { Column } from "../types/types";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export const ColumnsDialog = ({
    BoardColumnsData,
}: {
    BoardColumnsData: Column[] | undefined;
}) => {
    const {
        addColumnFormOpen,
        handleAddColumn,
        handleDeleteColumn,
        handleDragOver,
        handleDragStart,
        handleDrop,
        handleReOrder,
        isAddingTask,
        isDeletingTask,
        setAddColumnFormOpen,
    } = useColumnsDialog(BoardColumnsData);
    return (
        <Dialog>
            <DialogTrigger>
                <Button className="cursor-pointer hover:border-white border-2">
                    Columns
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-(--surface)">
                <DialogHeader>
                    <DialogTitle>Manage Columns</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-xs">
                    Drag to reorder columns. Max 10 columns per board.
                </DialogDescription>
                {
                    <>
                        <form onSubmit={handleReOrder}>
                            <div className="col-list border-b border-b-border pb-3">
                                {BoardColumnsData?.map((column, index) => {
                                    return (
                                        <div
                                            key={`col_item_${column.id}`}
                                            className="col-item"
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData(
                                                    "text/plain",
                                                    index.toString(),
                                                );
                                                handleDragStart(index);
                                            }}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                handleDrop(index);
                                            }}
                                        >
                                            <span>⠿</span>
                                            <Input
                                                type="text"
                                                defaultValue={column.name}
                                                name="name"
                                            />
                                            <span
                                                style={{
                                                    fontSize: "11px",
                                                    color: "var(--text-3)",
                                                    fontFamily:
                                                        "'IBM Plex Mono',monospace",
                                                }}
                                            >
                                                pos:
                                                {column.position}
                                            </span>
                                            <Button
                                                variant={"destructive"}
                                                disabled={
                                                    column.name === "Done" ||
                                                    isDeletingTask
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleDeleteColumn(
                                                        column.id,
                                                    )
                                                }
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </form>

                        <Button
                            variant={"defaultYellow"}
                            className="cursor-pointer"
                            onClick={() =>
                                setAddColumnFormOpen(!addColumnFormOpen)
                            }
                        >
                            {addColumnFormOpen ? "Close" : "Open"} Column Form
                        </Button>
                    </>
                }

                {addColumnFormOpen && (
                    <form
                        action=""
                        id="change-column-name"
                        onSubmit={handleAddColumn}
                    >
                        <div>
                            <label htmlFor="col-name">Column Name</label>
                            <Input
                                id="col-name"
                                name="name"
                                className="mt-4"
                                placeholder="Enter Column Name"
                                required
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant={"defaultYellow"}
                                className="cursor-pointer border-border border-3 dark:hover:border-[var(--amber-dim)] hover:scale-105"
                                type="submit"
                                disabled={isAddingTask}
                            >
                                + Add Column
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};
