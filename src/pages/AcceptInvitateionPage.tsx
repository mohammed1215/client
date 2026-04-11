import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance, workspaceEndPoints } from "@/api/api"; // قم بتعديله لمسار الـ Endpoints الخاص بك
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const senderId = searchParams.get("senderId"); // 👈 استخراج التوكن من الرابط
  const invitationId = searchParams.get("invitationId");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["accept-invite"],
    mutationFn: async () => {
      // 👈 تأكد من تطابق هذا الرابط مع الـ Backend (NestJS) لديك
      debugger;

      const response = await axiosInstance.post(
        workspaceEndPoints.acceptInvitation + location.search,
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("تم قبول الدعوة بنجاح!");
      navigate("/workspaces"); // التوجيه لمساحات العمل بعد النجاح
    },
    onError: () => {
      toast.error("رابط الدعوة غير صالح أو منتهي الصلاحية.");
    },
  });

  // معالجة حالة عدم وجود توكن في الرابط
  if (!invitationId || !senderId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <XCircle className="text-red-500" size={64} />
        <h2 className="text-2xl font-bold">رابط الدعوة غير صحيح!</h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-(--background) w-full">
      <div className="w-full max-w-md rounded-xl border border-border bg-(--surface) p-8 text-center shadow-lg">
        <CheckCircle2 className="mx-auto mb-4 text-(--amber)" size={56} />
        <h2 className="mb-2 text-2xl font-bold">دعوة للانضمام</h2>
        <p className="mb-8 text-(--text-3)">
          لقد تمت دعوتك للانضمام إلى مساحة عمل. هل توافق على الانضمام لفريق
          العمل؟
        </p>

        <Button
          variant="defaultYellow"
          className="w-full font-bold cursor-pointer text-black bg-(--amber)"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "قبول الدعوة"
          )}
        </Button>
      </div>
    </div>
  );
};
