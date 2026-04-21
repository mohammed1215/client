import {
    format,
    isThisMonth,
    isThisYear,
    isToday,
    isYesterday,
} from "date-fns";
import React from "react";
import {
    ArrowRightLeft,
    MessageSquare,
    Plus,
    Trash2,
    Edit,
    Paperclip,
} from "lucide-react";

export const getUrl = (path: string, params: any = {}) => {
    let url = path;
    Object.keys(params).forEach((key) => {
        url = url.replace(`{${key}}`, params[key]);
    });
    return url;
};

export function formatterDate(date: Date | string) {
    if (isToday(date, {})) {
        return format(date, "hh:mm a");
    } else if (isYesterday(date)) {
        return "yesterday at" + format(date, "hh:mm a");
    } else if (isThisMonth(date)) {
        return format(date, "dd hh:mm a");
    } else if (isThisYear(date)) {
        return format(date, "MMM dd hh:mm a");
    } else {
        return format(date, "yyyy MMM dd hh:mm a");
    }
}
export const getActivityIcon = (type: string): React.ReactNode => {
    switch (type) {
        case "moved":
            return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
        case "commented":
            return <MessageSquare className="w-4 h-4 text-green-500" />;
        case "created":
            return <Plus className="w-4 h-4 text-emerald-500" />;
        case "updated":
            return <Edit className="w-4 h-4 text-orange-500" />;
        case "deleted":
            return <Trash2 className="w-4 h-4 text-red-500" />;
        case "attachmentAdded":
            return <Paperclip className="w-4 h-4 text-purple-500" />;
        default:
            return null;
    }
};

export const transformPriority = (p: Record<string, number>) => {
    return Object.entries(p).map(([name, value]) => {
        return {
            name,
            value,
        };
    });
};

export const transformCompletionTrend = (
    data: Array<{
        date: string;
        count: number;
    }>,
) => {
    return data.map((d) => {
        return {
            name: format(d.date, "EE"),
            value: d.count,
        };
    });
};
