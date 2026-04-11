import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LucideLoader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { authApiEndPoints, axiosInstance } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContext, useDebugValue, useState } from "react";
import { UserContext } from "@/context/userContext";

export const ForgotPassword = () => {
  const [errors, setErrors] = useState<any>({});
  const userContext = useContext(UserContext);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (formData: object) => {
      debugger;
      toast.loading("sending email", {
        position: "top-center",
        id: "11",
        style: { color: "black", fontWeight: "bold", fontSize: "medium" },
      });

      const response = await axiosInstance.post(
        authApiEndPoints.forgotPassword,
        formData,
        { headers: { "Content-Type": "application/json" } },
      );
      return response.data;
    },
    onSuccess(data) {
      console.log("reset password email sent successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("reset password email sent successfully", {
        position: "top-center",
        id: "11",
        style: { color: "green", fontWeight: "bold", fontSize: "medium" },
      });

      // navigate("/reset-password",{state: {token:}});
    },
    onError(error: AxiosError<any>) {
      if (error.status === 400) {
        if (typeof error.response?.data.message === "string") {
          toast.error(error.response.data.message, {
            position: "top-center",
            id: "11",
            style: { color: "red", fontWeight: "bold", fontSize: "medium" },
          });
          return;
        }
        const errors = mapHelperError(error.response?.data["message"]);

        console.log(errors);
        setErrors(errors);
      }

      if (error.status === 404) {
        setErrors({ email: error.response?.data.message });
      }
      toast.error(error?.message, { position: "top-center", id: "11" });
    },
  });

  function mapHelperError(errors: string[]) {
    let errorMap: any = {};
    for (const error of errors) {
      if (error.startsWith("email") && !errorMap.email) {
        errorMap = { ...errorMap, email: error };
      }
    }
    return errorMap;
  }

  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(formData);
    const data = Object.fromEntries(formData.entries());

    mutation.mutate(data);
  }

  return (
    <>
      <form
        className="max-w-125 bg-(--auth-card) mx-auto px-4 rounded-lg p-10 mt-15 border-border border"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-6 space-y-3">
          <h2 className="text-3xl dark:text-white font-bold mt-10">
            Reset Password
          </h2>
          <p className="dark:text-(--text-4) text-[#6b7a90]">
            Enter your email to reset the Password
          </p>
        </div>

        {/* fields */}
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                className="dark:bg-(--input-secondary) dark:placeholder:text-(--text-4)"
                name="email"
                autoComplete="off"
                placeholder="jane.doe@company.com"
              />
              <FieldError>{errors["email"]}</FieldError>
            </Field>
          </FieldGroup>
          <Button
            variant={"defaultYellow"}
            disabled={mutation.isPending}
            className="p-6 cursor-pointer font-bold text-white"
          >
            Send Reset Password Email
            {mutation.isPending && <LucideLoader2 className="animate-spin" />}
          </Button>
        </FieldSet>
      </form>
    </>
  );
};
