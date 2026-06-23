import { TabsContent } from "./ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Column, Task } from "../pages/BoardInfo";
import { DialogButton } from "./DialogButton";

export const DetailsTaskTab = ({
    columns,
    taskData,
    handleMoveTask,
    handleRemoveAssignee,
    handleAddAssignee,
    assigneeIds,
    setAssigneeIds,
    isMoveLoading,
}: {
    columns: Column[] | null | undefined;
    taskData: Task | undefined;
    handleMoveTask: (e: React.SubmitEvent<Element>) => void;
    handleRemoveAssignee: (assigneeId: string) => void;
    handleAddAssignee: (assigneeIds: string[]) => void;
    assigneeIds: string[];
    setAssigneeIds: (ids: string[]) => void;
    isMoveLoading: boolean;
}) => {
    return (
        <TabsContent value="details">
            {/* description */}
            <div>
                <h3 className="detail-section-hdr">DESCRIPTION</h3>
                <p className="details-description">{taskData?.description}</p>
            </div>
            <div className="assignees mt-4">
                <div className="assignees-header">
                    <h3 className="detail-section-hdr">Assignees</h3>
                    <Dialog>
                        <DialogButton variant="dark">+ Add</DialogButton>
                        <DialogContent>
                            <DialogTitle>Assign Members</DialogTitle>
                            {/* people inside the board */}
                            <div className="assign-list">
                                {taskData?.board?.members.map((member) => {
                                    // let checked = false;
                                    // if (assigneeIds) {
                                    //   for (const assigneeId of assigneeIds) {
                                    //     if (assigneeId === member.user.id) {
                                    //       checked = true;
                                    //       break;
                                    //     }
                                    //   }
                                    // }
                                    return (
                                        <div
                                            key={member.id}
                                            className="assign-item"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar className="dark:border-2 dark:border-(--amber)">
                                                    <AvatarImage></AvatarImage>
                                                    <AvatarFallback className="dark:bg-(--amber-soft)! dark:text-(--amber) text-sm font-bold">
                                                        DM
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-sm">
                                                        {member.user.firstname}{" "}
                                                        {member.user.lastname}
                                                    </h4>
                                                    <p className="text-xs text-(--text-3)">
                                                        {member.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <Checkbox
                                                onClick={(_e) => {
                                                    const index =
                                                        assigneeIds.indexOf(
                                                            member.user.id,
                                                        );
                                                    const ids = [
                                                        ...assigneeIds,
                                                    ];
                                                    if (index !== -1) {
                                                        ids.splice(index, 1);
                                                        setAssigneeIds(ids);
                                                        handleRemoveAssignee(
                                                            member.user.id,
                                                        );
                                                    } else {
                                                        const newIds = [
                                                            ...assigneeIds,
                                                            member.user.id,
                                                        ];
                                                        setAssigneeIds(newIds);
                                                        handleAddAssignee(
                                                            newIds,
                                                        );
                                                    }
                                                }}
                                                checked={assigneeIds.includes(
                                                    member.user.id,
                                                )}
                                                className=" border-2 border-(--border2)"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-4">
                    {taskData?.assignedTasks?.map((assignee) => (
                        <div key={assignee.id} className="assign-item">
                            <div className="flex items-center gap-4">
                                <Avatar className="dark:border-2 dark:border-(--amber)">
                                    <AvatarImage></AvatarImage>
                                    <AvatarFallback className="dark:bg-(--amber-soft)! dark:text-(--amber) text-sm font-bold">
                                        DM
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="text-sm">
                                        {assignee.user.firstname}{" "}
                                        {assignee.user.lastname}
                                    </h4>
                                    <p className="text-xs text-(--text-3)">
                                        {assignee.user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4">
                <h3 className="detail-section-hdr">Move Task</h3>
                <div>
                    <form
                        action=""
                        className="flex gap-2"
                        onSubmit={handleMoveTask}
                    >
                        <Select
                            name="columnId"
                            defaultValue={taskData?.column?.id}
                        >
                            <SelectTrigger
                                id="columnId"
                                className="w-full bg-(--deep)!"
                            >
                                <SelectValue
                                    placeholder="Select a column"
                                    className="placeholder:text-(--text-3)!"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {columns?.map((column: Column) => {
                                    return (
                                        <SelectItem
                                            key={column.id}
                                            value={column.id}
                                        >
                                            {column.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                        <Input
                            name="position"
                            type="number"
                            min={0}
                            defaultValue={1}
                        />
                        <Button
                            className="cursor-pointer dark:border-(--border2)! "
                            variant={"outline"}
                            isLoading={isMoveLoading}
                            disabled={isMoveLoading}
                        >
                            Move
                        </Button>
                    </form>
                </div>
            </div>
        </TabsContent>
    );
};
