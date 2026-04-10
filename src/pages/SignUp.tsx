import { Button } from "@/components/ui/button"
import { Field,  FieldDescription,  FieldError,  FieldGroup, FieldLabel,  FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, LucideCheckCircle2, LucideLoader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {AxiosError} from 'axios'
import { authApiEndPoints, axiosInstance } from "@/api/api"
import { useMutation,  useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"

export const SignUpPage = ()=>{
    const [isPassword,setIsPassword] = useState(true)
    const [errors,setErrors] = useState<any>({})
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey:['postUser'],
        mutationFn: async (formData:object)=>{
            console.log('user')
            console.log(formData)
            toast.loading('registering user',{position:'top-center',id:'11'})
            await new Promise((resolve)=>setTimeout(()=>resolve(''),1000))
            const response = await axiosInstance.post(authApiEndPoints.register,formData,{headers:{"Content-Type":'application/json'}})
            return response.data
        },
        onSuccess(data) {
            console.log('Registration successful:', data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('registered successfully',{position:'top-center',id:'11'})
            navigate('/login')
        },
        onError(error: AxiosError<any>) {
            if(error.status === 400){
                const errors = mapHelperError(error.response?.data['message'])
                console.log(errors)
                setErrors(errors)
                toast.error(error?.message,{position:'top-center',id:'11'})
            }

            if(error.status === 409){
                setErrors({email:error.response?.data.message})
            }
            toast.error(error?.message,{position:'top-center',id:'11'})
        },
    })

    function mapHelperError(errors:string[]){
        let errorMap:any = {};
        for (const error of errors) {
            if(error.startsWith('firstname') && !errorMap.firstname){
                errorMap = {...errorMap,firstname: error}
            }else if(error.startsWith('lastname') && !errorMap.lastname){
                errorMap = {...errorMap,lastname: error}
            }else if(error.startsWith('email')&& !errorMap.email){
                errorMap = {...errorMap,email:error}
            }else if(error.startsWith('password') && !errorMap.password){
                errorMap = {...errorMap,password:error}
            }else{
                errorMap = {...errorMap,global:error}
            }
        }
        return errorMap
    }

    const navigate = useNavigate()

    async function handleSubmit(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        const formData = new FormData(e.target)
        console.log(formData)
        const data = Object.fromEntries(formData.entries())

        mutation.mutate(data)

    }

    return <>
        <form className="max-w-[500px] bg-(--auth-card) mx-auto px-4 rounded-lg p-10 mt-15"  onSubmit={handleSubmit}>
            <div className="text-center ">
                <h2 className="text-3xl dark:text-white font-bold mt-10">Create Your Account</h2>
                <p className="dark:text-[#92adc9] text-[#6b7a90]">Join TaskFlow to manage your team's projects efficiently.</p>
            </div>

            {/* fields */}
            <FieldSet>
                <FieldGroup>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <Field>
                        <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                        <Input id="firstname" name="firstname" autoComplete="off" placeholder="John" />
                        <FieldError>{errors['firstname']}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                        <Input id="lastname" name="lastname" autoComplete="off" placeholder="Doe" />
                        <FieldError>{errors['lastname']}</FieldError>
                    </Field>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="email">Work Email</FieldLabel>
                        <Input id="email" name="email" autoComplete="off" placeholder="jane.doe@company.com"/>
                        <FieldError>{errors['email']}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="flex dark:bg-[#192633]">
                            <Input type={isPassword?'password':"text"} id="password" name="password" autoComplete="off" />
                            <Button variant={"ghost"} type="button" onClick={()=>setIsPassword(!isPassword)}>
                            {isPassword?<Eye/>:<EyeOff/>}  
                            </Button>
                        </div>
                        <FieldError>{errors['password']}</FieldError>
                        <FieldDescription>
                            Password must contain:
                        </FieldDescription>
                        <div className="flex gap-2">
                            <LucideCheckCircle2 className="w-5 h-5"/>
                            8+ Characters
                        </div>
                    </Field>
                </FieldGroup>
                <Button variant={'defaultYellow'} className="p-6 font-bold text-white">
                    Create Account {mutation.isPending&&<LucideLoader2 className="animate-spin"/>}
                </Button>
            </FieldSet>
            <p className="text-center mt-2"> Already have an account? 
                <Button variant={"link"}>
                    <Link className="text-(--link-primary)" to={'/login'}>Login</Link> 
                </Button>
            </p>
        </form>
    </>
} 