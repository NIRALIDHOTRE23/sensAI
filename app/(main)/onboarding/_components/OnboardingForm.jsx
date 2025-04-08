"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema } from "@/app/library/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateUser } from "@/actions/user";


const OnboardingForm = ({ industries }) => {

    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const router = useRouter();

    const {
        loading: updateLoading,
        fn: updateUserFn,
        data: updateResult,
    } = useFetch(updateUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(onboardingSchema)
    })

    const onSubmit = async (values) => {
        try {
            const formattedIndustry = `${values.industry}-${values.subIndustry
                .toLowerCase()
                .replace(/ /g, "-")}`;

            await updateUserFn({
                ...values,
                industry: formattedIndustry,
            });

        } catch (error) {
            console.error("Onboarding error:", error);
        }
    };

    useEffect(() => {
        if(updateResult?.success && !updateLoading) {
            toast.success("Profile completed successfully!");
            router.push("/dashboard");
            router.refresh();
        }
    }, [updateResult, updateLoading])
    

    const watchIndustry = watch("industry");

    return (
        <div className="flex items-center justify-center bg-background">
            <Card className="w-full max-w-lg mt-10 mx-2 rounded-lg bg-black-100">
                <CardHeader>
                    <CardTitle className="font-extrabold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent bg-clip-text text-4xl">Complete Your Profile</CardTitle>
                    <CardDescription>Select your industry to get personalized career insights and recommendations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label htmlFor="industry" className="mb- 1">Industry</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("industry", value);
                                    setSelectedIndustry(industries.find((ind) => ind.id === value)
                                    );
                                    setValue("subIndustry", "");
                                }}
                            >
                                <SelectTrigger id="industry" className="bg-black text-white w-full rounded-sm"
                                >
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind) => {
                                        return <SelectItem value={ind.id} key={ind.id}>{ind.name}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            {errors.industry && (
                                <p className="text-sm text-red-500">
                                    {errors.industry.message}
                                </p>
                            )}
                        </div>

                        {watchIndustry && (
                            <div className="space-y-2">
                                <Label htmlFor="subIndustry" className="mb- 1">Specialization</Label>
                                <Select
                                    onValueChange={(value) => setValue("subIndustry", value)}>
                                    <SelectTrigger id="subIndustry" className="bg-black text-white w-full rounded-sm"
                                    >
                                        <SelectValue placeholder="Select an industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedIndustry?.subIndustries.map((ind) => {
                                            return <SelectItem value={ind} key={ind}>{ind}</SelectItem>
                                        })}
                                    </SelectContent>
                                </Select>
                                {errors.subIndustry && (
                                    <p className="text-sm text-red-500">
                                        {errors.subIndustry.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="experience" className="mb- 1">Years of Experience</Label>
                            <Input
                                id="experience"
                                type="number"
                                min="0"
                                max="50"
                                placeholder="Enter years of experience"
                                {...register("experience")}
                                className=" rounded-sm"
                            />

                            {errors.experience && (
                                <p className="text-sm text-red-500">
                                    {errors.experience.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills" className="mb- 1">Skills</Label>
                            <Input
                                id="skills"
                                placeholder="e.g., Python, Javascript, Project Management"
                                {...register("skills")}
                                className=" rounded-sm"
                            />
                            <p className="text-sm text-muted-foreground">
                                Separate multiple skills with commas
                            </p>

                            {errors.skills && (
                                <p className="text-sm text-red-500">
                                    {errors.skills.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="mb- 1">Professional Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about your professional background"
                                {...register("bio")}
                                className="h-40 rounded-sm"
                            />

                            {errors.bio && (
                                <p className="text-sm text-red-500">
                                    {errors.bio.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full rounded-sm" disabled={updateLoading}>
                            {updateLoading ? (
                                <>
                                <Loader2 className="mr-2 h-4 animate-spin" />
                                Saving...
                                </>
                            ) : (
                                " Complete Profile"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );

};

export default OnboardingForm;                     