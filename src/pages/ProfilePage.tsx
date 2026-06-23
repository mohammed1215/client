import { Field } from "../components/Field";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { useProfile } from "../hooks/useProfile";
import { Camera } from "lucide-react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

export const ProfilePage = () => {
    const {
        handleUpdateProfile,
        isEditing,
        user,
        handleUploadImage,
        isUploadingProfileImage,
        progress,
        imageProfile,
        setSelectedFile,
        setImageProfile,
    } = useProfile();

    return (
        <section className="flex justify-center items-center w-full gap-5 px-3">
            {isUploadingProfileImage && (
                <progress
                    className="fixed top-0 left-0 block w-screen h-1 accent-indigo-600 bg-transparent z-[9999]"
                    value={progress}
                    max={100}
                ></progress>
            )}

            <div className="max-w-[500px]  bg-(--surface) rounded-lg px-10 py-8 flex-col flex items-center gap-5">
                <div>
                    {/* image */}
                    <span>PROFILE</span>
                    <form
                        action=""
                        id="upload-profile-image"
                        onSubmit={handleUploadImage}
                    >
                        <div className="relative">
                            <Avatar
                                size="lg"
                                className="w-20! h-20! dark:text-xl! border-2! text-(--amber)!"
                            >
                                <AvatarImage
                                    src={imageProfile ?? user?.avatarUrl ?? ""}
                                    alt=""
                                />
                                <AvatarFallback className="text-xl text-(--amber)!">
                                    {(user?.firstname?.[0].toUpperCase() ??
                                        "") +
                                        (user?.lastname?.[0].toUpperCase() ??
                                            "")}
                                </AvatarFallback>
                            </Avatar>
                            <Label htmlFor="upload-image">
                                <Camera className="absolute right-0 bottom-0 bg-(--raised) w-10 h-10 p-3 text-sm rounded-full cursor-pointer" />
                            </Label>
                            <Input
                                type="file"
                                id="upload-image"
                                className="hidden"
                                name="avatar"
                                required
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setSelectedFile(file);
                                        setImageProfile(
                                            URL.createObjectURL(file),
                                        );
                                    }
                                }}
                            />
                        </div>
                    </form>
                </div>
                <Button
                    variant={"outline"}
                    type="submit"
                    form="upload-profile-image"
                    className="dark:border-(--border2)! cursor-pointer"
                    isLoading={isUploadingProfileImage}
                >
                    Upload Image
                </Button>
                {/* fields */}
                <form className="space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="flex gap-5 flex-col sm:flex-row">
                        <Field
                            label="Firstname"
                            htmlFor="first-name"
                            name="firstname"
                            defaultValue={user?.firstname ?? ""}
                            placeholder="Enter Firstname"
                        />

                        <Field
                            label="Lastname"
                            htmlFor="last-name"
                            name="lastname"
                            defaultValue={user?.lastname ?? ""}
                            placeholder="Enter Lastname"
                        />
                    </div>

                    <Field
                        label="Email"
                        htmlFor="email"
                        name="email"
                        defaultValue={user?.email ?? ""}
                        disabled={true}
                        placeholder="Enter Email Address"
                    />

                    <Field
                        label="Bio"
                        htmlFor="bio"
                        name="bio"
                        defaultValue={user?.bio ?? ""}
                        placeholder="Write Short Bio About You..."
                    />
                    {/* buttons */}
                    <div>
                        <Button
                            variant={"outline"}
                            className="dark:border-(--border2)! cursor-pointer mx-auto block "
                            isLoading={isEditing}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
};
