import { getActivityIcon } from "@/helpers/helpers";
import { FileText } from "lucide-react";

export const ActivityTab = ({ activities, boardMembers }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted max-h-112 overflow-y-auto">
      {activities?.map((activity) => (
        <div key={activity.id} className="relative group">
          <div className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full border-2 border-background bg-primary ring-4 ring-background transition-transform group-hover:scale-125" />

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold capitalize flex items-center gap-2">
                {getActivityIcon(activity.activityType)}
                {activity.activityType} {activity.fieldName}
              </span>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(activity.createdAt).toLocaleString()}
              </time>
            </div>

            <div className="text-sm bg-muted/30 rounded-lg p-3 border border-border">
              {activity?.activityType === "assigned" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Assigned task to:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activity.newValue?.assignedUserIds?.map(
                      (userId: string) => {
                        // بندور في أعضاء البورد اللي معاهم البيانات الكاملة
                        const memberRecord = boardMembers?.find(
                          (m) => m.user.id === userId,
                        );
                        const userData = memberRecord?.user;

                        return (
                          <div
                            key={userId}
                            className="flex items-center gap-2 pr-3 p-1 bg-indigo-50/50 border border-indigo-100 rounded-full"
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold border border-white">
                              {userData?.avatarUrl ? (
                                <img
                                  src={userData.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>
                                  {userData?.firstname
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-indigo-700">
                              {userData
                                ? `${userData.firstname} ${userData.lastname}`
                                : "Member"}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : activity?.activityType === "attachmentAdded" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Attached a new file:
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-dashed border-border hover:bg-muted transition-colors group/file">
                    <div className="p-2 bg-background rounded border shadow-sm">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p
                        className="text-sm font-medium truncate max-w-62.5"
                        title={activity.newValue?.attachmentName}
                      >
                        {activity.newValue?.attachmentName?.split("_").pop() ||
                          "Unknown File"}
                      </p>

                      <p className="text-[10px] text-muted-foreground font-mono">
                        {activity.newValue?.size > 1024 * 1024
                          ? `${(activity.newValue.size / (1024 * 1024)).toFixed(2)} MB`
                          : `${(activity.newValue.size / 1024).toFixed(1)} KB`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : activity?.activityType === "moved" ? (
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground italic line-clamp-1">
                    &quot;{activity.oldValue?.task}&quot;
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-background border rounded text-xs">
                      {activity.oldValue?.oldColumn}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-xs font-medium text-primary">
                      {activity.newValue?.newColumn}
                    </span>
                  </div>
                </div>
              ) : activity?.activityType === "created" ? (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    Created a new task:{" "}
                    <span className="text-primary font-bold">
                      &quot;{activity.newValue?.title}&quot;
                    </span>
                  </p>

                  {activity.newValue?.priority && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Priority:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          activity.newValue.priority === "high"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : activity.newValue.priority === "medium"
                              ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                              : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {activity.newValue.priority}
                      </span>
                    </div>
                  )}
                </div>
              ) : activity?.activityType === "commented" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Added a new comment:
                  </p>
                  <div className="relative pl-4 py-2 border-l-4 border-primary/20 bg-primary/5 rounded-r-lg">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      &quot;{activity.newValue?.comment?.content}&quot;
                    </p>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
